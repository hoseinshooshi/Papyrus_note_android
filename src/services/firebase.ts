import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Note, Task, CharacterProfile, JournalEntry } from '../types';
import { INITIAL_NOTES, INITIAL_TASKS, INITIAL_JOURNALS } from '../data/initialData';
import { DEFAULT_CHARACTER } from '../data/pixelAvatars';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
}) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with configured databaseId
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

/**
 * Recursively sanitizes data before sending to Firestore.
 * Firestore does NOT accept `undefined` as a field value and throws:
 * "Function setDoc() called with invalid data. Unsupported field value: undefined".
 * This helper cleanses objects by replacing `undefined` with `null` so Firestore can persist it
 * without error (and clears any previously stored field on merge).
 */
export function cleanFirestoreData<T>(obj: T): any {
  if (obj === undefined) {
    return null;
  }
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((item) => item !== undefined)
      .map((item) => cleanFirestoreData(item));
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj as Record<string, any>)) {
    if (value === undefined) {
      result[key] = null;
    } else if (value !== null && typeof value === 'object') {
      result[key] = cleanFirestoreData(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

// Authentication Helpers
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserAccount(result.user);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        await syncUserAccount(user);
      } catch (err) {
        console.warn('Failed to sync user account doc:', err);
      }
    }
    callback(user);
  });
}

// User document sync
export async function syncUserAccount(user: User): Promise<void> {
  if (!user.uid) return;
  const userRef = doc(db, 'users', user.uid);
  const data = cleanFirestoreData({
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || 'Parchment Scribe',
    photoURL: user.photoURL || '',
    updatedAt: Date.now(),
  });
  await setDoc(userRef, data, { merge: true });
}

// --- Cloud Notes Sync ---
export function subscribeUserNotes(
  userId: string, 
  callback: (notes: Note[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const notesCol = collection(db, 'users', userId, 'notes');
  return onSnapshot(notesCol, (snapshot) => {
    if (snapshot.empty) {
      // Seed initial notes if first time in cloud
      seedInitialNotes(userId).catch(console.error);
      callback(INITIAL_NOTES);
      return;
    }
    const notes: Note[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      notes.push({
        id: docSnap.id,
        title: data.title || 'Untitled Note',
        content: data.content || '',
        category: data.category || 'General',
        tags: Array.isArray(data.tags) ? data.tags : [],
        color: data.color || 'parchment',
        isPinned: !!data.isPinned,
        checklist: Array.isArray(data.checklist) ? data.checklist : [],
        thumbnailUrl: data.thumbnailUrl || undefined,
        thumbnailAspectRatio: data.thumbnailAspectRatio || undefined,
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
      });
    });
    // Sort pinned first, then by updatedAt descending
    notes.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
    callback(notes);
  }, (err) => {
    console.error('Notes cloud sync error:', err);
    if (onError) onError(err);
  });
}

// --- Cloud Journals Sync ---
export function subscribeUserJournals(
  userId: string, 
  callback: (journals: JournalEntry[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const journalsCol = collection(db, 'users', userId, 'journals');
  return onSnapshot(journalsCol, (snapshot) => {
    if (snapshot.empty) {
      // Seed initial journals if first time
      seedInitialJournals(userId).catch(console.error);
      callback(INITIAL_JOURNALS);
      return;
    }
    const journals: JournalEntry[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      journals.push({
        id: docSnap.id,
        date: data.date || new Date().toISOString().split('T')[0],
        title: data.title || 'Daily Reflection',
        content: data.content || '',
        mood: data.mood || 'peaceful',
        tags: Array.isArray(data.tags) ? data.tags : [],
        color: data.color || 'parchment',
        thumbnailUrl: data.thumbnailUrl || undefined,
        thumbnailAspectRatio: data.thumbnailAspectRatio || undefined,
        audioRecording: data.audioRecording || undefined,
        voiceTranscript: data.voiceTranscript || undefined,
        checklist: Array.isArray(data.checklist) ? data.checklist : [],
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
      });
    });
    // Sort by date descending, then by updatedAt desc
    journals.sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return b.updatedAt - a.updatedAt;
    });
    callback(journals);
  }, (err) => {
    console.error('Journals cloud sync error:', err);
    if (onError) onError(err);
  });
}

export async function saveCloudJournal(userId: string, journal: JournalEntry): Promise<void> {
  const journalRef = doc(db, 'users', userId, 'journals', journal.id);
  const data = cleanFirestoreData({
    ...journal,
    updatedAt: Date.now(),
  });
  await setDoc(journalRef, data, { merge: true });
}

export async function deleteCloudJournal(userId: string, journalId: string): Promise<void> {
  const journalRef = doc(db, 'users', userId, 'journals', journalId);
  await deleteDoc(journalRef);
}

async function seedInitialJournals(userId: string): Promise<void> {
  for (const journal of INITIAL_JOURNALS) {
    await saveCloudJournal(userId, journal);
  }
}

export async function saveCloudNote(userId: string, note: Note): Promise<void> {
  const noteRef = doc(db, 'users', userId, 'notes', note.id);
  const data = cleanFirestoreData({
    ...note,
    updatedAt: Date.now(),
  });
  await setDoc(noteRef, data, { merge: true });
}

export async function deleteCloudNote(userId: string, noteId: string): Promise<void> {
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await deleteDoc(noteRef);
}

async function seedInitialNotes(userId: string): Promise<void> {
  for (const note of INITIAL_NOTES) {
    await saveCloudNote(userId, note);
  }
}

// --- Cloud Tasks Sync ---
export function subscribeUserTasks(
  userId: string, 
  callback: (tasks: Task[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const tasksCol = collection(db, 'users', userId, 'tasks');
  return onSnapshot(tasksCol, (snapshot) => {
    if (snapshot.empty) {
      // Seed initial tasks if first time
      seedInitialTasks(userId).catch(console.error);
      callback(INITIAL_TASKS);
      return;
    }
    const tasks: Task[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      tasks.push({
        id: docSnap.id,
        title: data.title || 'Untitled Task',
        description: data.description || '',
        completed: !!data.completed,
        completedAt: data.completedAt,
        priority: data.priority || 'medium',
        dueDate: data.dueDate,
        category: data.category || 'General',
        tags: Array.isArray(data.tags) ? data.tags : [],
        createdAt: data.createdAt || Date.now(),
      });
    });
    // Sort active tasks first, then by createdAt desc
    tasks.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.createdAt - a.createdAt;
    });
    callback(tasks);
  }, (err) => {
    console.error('Tasks cloud sync error:', err);
    if (onError) onError(err);
  });
}

export async function saveCloudTask(userId: string, task: Task): Promise<void> {
  const taskRef = doc(db, 'users', userId, 'tasks', task.id);
  const data = cleanFirestoreData(task);
  await setDoc(taskRef, data, { merge: true });
}

export async function deleteCloudTask(userId: string, taskId: string): Promise<void> {
  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  await deleteDoc(taskRef);
}

async function seedInitialTasks(userId: string): Promise<void> {
  for (const task of INITIAL_TASKS) {
    await saveCloudTask(userId, task);
  }
}

// --- Cloud Profile Sync ---
export function subscribeUserProfile(
  userId: string, 
  callback: (profile: CharacterProfile) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const profileDoc = doc(db, 'users', userId, 'profile', 'character');
  return onSnapshot(profileDoc, (snapshot) => {
    if (!snapshot.exists()) {
      // Seed default character
      saveCloudProfile(userId, DEFAULT_CHARACTER).catch(console.error);
      callback(DEFAULT_CHARACTER);
      return;
    }
    const data = snapshot.data();
    callback({
      ...DEFAULT_CHARACTER,
      ...data,
    });
  }, (err) => {
    console.error('Profile cloud sync error:', err);
    if (onError) onError(err);
  });
}

export async function saveCloudProfile(userId: string, profile: CharacterProfile): Promise<void> {
  const profileDoc = doc(db, 'users', userId, 'profile', 'character');
  const data = cleanFirestoreData({
    ...profile,
    updatedAt: Date.now(),
  });
  await setDoc(profileDoc, data, { merge: true });
}
