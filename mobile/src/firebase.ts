import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  type DocumentData,
  type Unsubscribe,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";
import { DEFAULT_CHARACTER } from "../../src/data/pixelAvatars";

const app = getApps()[0] ?? initializeApp(firebaseConfig as FirebaseOptions);

function createAuth() {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

export const auth = createAuth();
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
export const storage = getStorage(app);

type CollectionName = "notes" | "journals" | "tasks";
type QueueCollectionName = CollectionName | "profile";
type PendingWrite = {
  collectionName: QueueCollectionName;
  id: string;
  payload: Record<string, unknown> | null;
  token: string;
};

const pendingKey = (uid: string) => `papyrus:${uid}:outbox`;
const activeFlushes = new Map<string, Promise<void>>();
const outboxLocks = new Map<string, Promise<void>>();

async function withOutboxLock<T>(uid: string, operation: () => Promise<T>): Promise<T> {
  const previous = outboxLocks.get(uid) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => { release = resolve; });
  outboxLocks.set(uid, current);
  await previous;
  try {
    return await operation();
  } finally {
    release();
    if (outboxLocks.get(uid) === current) outboxLocks.delete(uid);
  }
}

export function watchAuth(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

export function cleanFirestoreData(value: unknown): DocumentData {
  if (value === undefined) return null;
  if (value === null || typeof value !== "object") return value as DocumentData;
  if (Array.isArray(value)) {
    return value.filter((item) => item !== undefined).map(cleanFirestoreData) as unknown as DocumentData;
  }
  const result: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    result[key] = child === undefined ? null : cleanFirestoreData(child);
  }
  return result as DocumentData;
}

async function readOutbox(uid: string): Promise<PendingWrite[]> {
  try {
    const raw = await AsyncStorage.getItem(pendingKey(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PendingWrite[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeOutbox(uid: string, items: PendingWrite[]) {
  if (items.length === 0) {
    await AsyncStorage.removeItem(pendingKey(uid));
  } else {
    await AsyncStorage.setItem(pendingKey(uid), JSON.stringify(items));
  }
}

async function enqueueWrite(
  uid: string,
  collectionName: QueueCollectionName,
  id: string,
  payload: Record<string, unknown> | null
) {
  await withOutboxLock(uid, async () => {
    const pending = await readOutbox(uid);
    const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const next = pending.filter((item) => !(item.collectionName === collectionName && item.id === id));
    next.push({ collectionName, id, payload, token });
    await writeOutbox(uid, next);
  });
}

function getDocumentRef(uid: string, item: PendingWrite) {
  if (item.collectionName === "profile") {
    return doc(db, "users", uid, "profile", "character");
  }
  return doc(db, "users", uid, item.collectionName, item.id);
}

/**
 * Replays the per-user durable outbox in order. An operation is removed only
 * after Firestore accepts it, and only if it has not been superseded meanwhile.
 */
export async function flushPendingWrites(uid: string): Promise<void> {
  const existing = activeFlushes.get(uid);
  if (existing) {
    await existing;
    if ((await readOutbox(uid)).length > 0) return flushPendingWrites(uid);
    return;
  }

  const work = (async () => {
    while (true) {
      const pending = await readOutbox(uid);
      const operation = pending[0];
      if (!operation) return;

      const target = getDocumentRef(uid, operation);
      if (operation.payload === null) {
        await deleteDoc(target);
      } else {
        await setDoc(target, cleanFirestoreData(operation.payload), { merge: true });
      }

      await withOutboxLock(uid, async () => {
        const latest = await readOutbox(uid);
        await writeOutbox(uid, latest.filter((item) => item.token !== operation.token));
      });
    }
  })();

  activeFlushes.set(uid, work);
  try {
    await work;
  } finally {
    activeFlushes.delete(uid);
  }
}

async function applyPendingOverrides<T extends { id: string }>(
  uid: string,
  collectionName: CollectionName,
  remoteItems: T[]
): Promise<T[]> {
  const merged = new Map<string, T>(remoteItems.map((item) => [item.id, item]));
  const pending = await readOutbox(uid);
  for (const operation of pending) {
    if (operation.collectionName !== collectionName) continue;
    if (operation.payload === null) {
      merged.delete(operation.id);
    } else {
      merged.set(operation.id, { ...operation.payload, id: operation.id } as T);
    }
  }
  return Array.from(merged.values());
}

async function readPendingProfile(uid: string): Promise<Record<string, unknown> | null | undefined> {
  const pending = await readOutbox(uid);
  const operation = pending.find((item) => item.collectionName === "profile" && item.id === "character");
  return operation ? operation.payload : undefined;
}

export async function syncUserAccount(user: User) {
  if (!user.uid) return;
  await setDoc(
    doc(db, "users", user.uid),
    cleanFirestoreData({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "Parchment Scribe",
      photoURL: user.photoURL || "",
      updatedAt: Date.now(),
    }),
    { merge: true }
  );
}

export function watchCollection<T extends { id: string }>(
  uid: string,
  name: CollectionName,
  callback: (items: T[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, "users", uid, name),
    (snapshot) => {
      const remoteItems = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as T);
      void applyPendingOverrides(uid, name, remoteItems).then(callback).catch(onError);
    },
    onError
  );
}

export function watchCharacter(
  uid: string,
  callback: (profile: typeof DEFAULT_CHARACTER) => void,
  onError: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, "users", uid, "profile", "character"),
    (snapshot) => {
      void readPendingProfile(uid).then((pending) => {
        if (pending !== undefined) {
          callback(pending === null ? DEFAULT_CHARACTER : ({ ...DEFAULT_CHARACTER, ...pending } as typeof DEFAULT_CHARACTER));
          return;
        }
        if (!snapshot.exists()) {
          callback(DEFAULT_CHARACTER);
          void saveCharacter(uid, DEFAULT_CHARACTER).catch(onError);
          return;
        }
        callback({ ...DEFAULT_CHARACTER, ...snapshot.data() } as typeof DEFAULT_CHARACTER);
      }).catch(onError);
    },
    onError
  );
}

export async function saveItem<T extends { id: string }>(
  uid: string,
  collectionName: CollectionName,
  item: T
) {
  const payload = cleanFirestoreData({ ...item, updatedAt: Date.now() }) as Record<string, unknown>;
  await enqueueWrite(uid, collectionName, item.id, payload);
  await flushPendingWrites(uid);
}

export async function removeItem(uid: string, collectionName: CollectionName, id: string) {
  await enqueueWrite(uid, collectionName, id, null);
  await flushPendingWrites(uid);
}

export async function saveCharacter(uid: string, profile: typeof DEFAULT_CHARACTER) {
  const payload = cleanFirestoreData({ ...profile, updatedAt: Date.now() }) as Record<string, unknown>;
  await enqueueWrite(uid, "profile", "character", payload);
  await flushPendingWrites(uid);
}

export async function uploadMedia(uid: string, uri: string, fileName: string, contentType: string): Promise<string> {
  const response = await fetch(uri);
  if (!response.ok) throw new Error("Unable to read selected media.");
  const blob = await response.blob();
  const target = ref(storage, `users/${uid}/media/${fileName}`);
  const result = await uploadBytes(target, blob, { contentType });
  return getDownloadURL(result.ref);
}
