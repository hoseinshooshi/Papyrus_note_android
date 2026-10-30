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

export function watchCollection<T>(
  uid: string,
  name: "notes" | "journals" | "tasks",
  callback: (items: T[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  return onSnapshot(
    collection(db, "users", uid, name),
    (snapshot) => callback(snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as T)),
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
      if (!snapshot.exists()) {
        callback(DEFAULT_CHARACTER);
        saveCharacter(uid, DEFAULT_CHARACTER).catch(onError);
        return;
      }
      callback({ ...DEFAULT_CHARACTER, ...snapshot.data() } as typeof DEFAULT_CHARACTER);
    },
    onError
  );
}

export async function saveItem<T extends { id: string }>(
  uid: string,
  collectionName: "notes" | "journals" | "tasks",
  item: T
) {
  const payload = cleanFirestoreData({ ...item, updatedAt: Date.now() });
  await setDoc(doc(db, "users", uid, collectionName, item.id), payload, { merge: true });
}

export async function removeItem(uid: string, collectionName: "notes" | "journals" | "tasks", id: string) {
  await deleteDoc(doc(db, "users", uid, collectionName, id));
}

export async function saveCharacter(uid: string, profile: typeof DEFAULT_CHARACTER) {
  await setDoc(
    doc(db, "users", uid, "profile", "character"),
    cleanFirestoreData({ ...profile, updatedAt: Date.now() }),
    { merge: true }
  );
}

export async function uploadMedia(uid: string, uri: string, fileName: string, contentType: string): Promise<string> {
  const response = await fetch(uri);
  if (!response.ok) throw new Error("Unable to read selected media.");
  const blob = await response.blob();
  const target = ref(storage, `users/${uid}/media/${fileName}`);
  const result = await uploadBytes(target, blob, { contentType });
  return getDownloadURL(result.ref);
}
