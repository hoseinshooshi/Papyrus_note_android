import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Newsreader_400Regular, Newsreader_600SemiBold } from "@expo-google-fonts/newsreader";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  type User,
} from "firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import { Note, Task, JournalEntry, CharacterProfile, NoteColor } from "../src/types";
import { INITIAL_NOTES, INITIAL_TASKS, INITIAL_JOURNALS, INITIAL_CATEGORIES, CRYPTO_ADDRESS } from "../src/data/initialData";
import { DEFAULT_CHARACTER } from "../src/data/pixelAvatars";
import { NOTE_TEMPLATES } from "../src/data/templates";
import firebaseConfig from "../firebase-applet-config.json";
import { auth, db, watchAuth, watchCollection, watchCharacter, saveItem, removeItem, saveCharacter, syncUserAccount, flushPendingWrites } from "./src/firebase";
import { C, AppText, Button, Card, Heading, Loading } from "./src/ui";
import { NoteEditorSheet, TaskEditorSheet, JournalEditorSheet, QuickCaptureSheet } from "./src/sheets";
import { DashboardScreen, NotesScreen, JournalScreen, TasksScreen, FocusScreen, ProfileScreen, DonationSheet } from "./src/screens";

WebBrowser.maybeCompleteAuthSession();

type TabId = "home" | "notes" | "journal" | "tasks" | "focus" | "profile";
type LocalCache = { notes?: Note[]; journals?: JournalEntry[]; tasks?: Task[]; character?: CharacterProfile };
const sortNotes = (items: Note[]) => [...items].sort((a, b) => Number(!!b.isPinned) - Number(!!a.isPinned) || b.updatedAt - a.updatedAt);
const sortJournals = (items: JournalEntry[]) => [...items].sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt - a.updatedAt);
const sortTasks = (items: Task[]) => [...items].sort((a, b) => Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt);
const makeId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

function GoogleLogin({ onError, error }: { onError: (message: string) => void; error: string }) {
  const [busy, setBusy] = useState(false);
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: androidClientId || undefined,
    webClientId: firebaseConfig.oAuthClientId,
    redirectUri: AuthSession.makeRedirectUri({ scheme: "papyrusnotes", path: "auth" }),
    responseType: AuthSession.ResponseType.IdToken,
    usePKCE: false,
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    const finish = async () => {
      if (response?.type !== "success") return;
      const idToken = response.authentication?.idToken || response.params?.id_token;
      if (!idToken) {
        onError("Google did not return an ID token. Check the Android OAuth client ID and redirect configuration.");
        return;
      }
      try {
        setBusy(true);
        const credential = GoogleAuthProvider.credential(idToken);
        const result = await signInWithCredential(auth, credential);
        await syncUserAccount(result.user);
      } catch (error) {
        onError(error instanceof Error ? error.message : "Google sign-in failed. Please try again.");
      } finally {
        setBusy(false);
      }
    };
    void finish();
  }, [response, onError]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg, justifyContent: "center", padding: 22 }}>
      <View style={{ alignItems: "center", marginBottom: 26 }}>
        <View style={{ width: 94, height: 94, borderRadius: 30, backgroundColor: "#E9DFC9", alignItems: "center", justifyContent: "center", marginBottom: 16, borderWidth: 1, borderColor: C.line }}>
          <Text style={{ fontSize: 50 }}>📜</Text>
        </View>
        <AppText serif style={{ fontSize: 38, fontFamily: "Newsreader_600SemiBold" }}>Papyrus</AppText>
        <AppText muted style={{ fontSize: 10, letterSpacing: 2, marginTop: 3 }}>NOTES · JOURNALS · INTENTIONS</AppText>
      </View>
      <Card style={{ padding: 21, gap: 15 }}>
        <Heading subtitle="A calm, tactile space for your thoughts and daily practice">Welcome to your paper vault</Heading>
        <View style={{ gap: 10 }}>
          {[
            ["☁", "Real-time cloud backup and sync"],
            ["🔒", "Private, user-isolated Firestore storage"],
            ["✎", "Notes, journals, tasks and focus sessions"],
          ].map(([icon, text]) => <View key={text} style={{ flexDirection: "row", gap: 10, alignItems: "center" }}><Text style={{ fontSize: 18 }}>{icon}</Text><AppText style={{ fontSize: 11 }}>{text}</AppText></View>)}
        </View>
        {error ? <AppText style={{ color: C.red, fontSize: 10, lineHeight: 16 }}>{error}</AppText> : null}
        <Button title={busy ? "Connecting…" : "Continue with Google"} disabled={!request || busy} onPress={() => { setBusy(true); void promptAsync().catch((err) => onError(err instanceof Error ? err.message : "Google sign-in could not be started.")).finally(() => setBusy(false)); }} icon={<Text style={{ color: "#FFF", fontWeight: "800" }}>G</Text>} />
        {!androidClientId ? <AppText muted style={{ fontSize: 9, lineHeight: 15 }}>Android OAuth setup is required: create an Android OAuth client for com.hoseinshooshi.papyrusnotes and add its ID to mobile/.env as EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID.</AppText> : null}
        <AppText muted style={{ fontSize: 9, textAlign: "center" }}>Your notes remain private to your signed-in Firebase account.</AppText>
      </Card>
    </SafeAreaView>
  );
}

function AppRoot() {
  const [fontsLoaded] = useFonts({
    Newsreader_400Regular,
    Newsreader_600SemiBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
  });
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [journals, setJournals] = useState<JournalEntry[]>(INITIAL_JOURNALS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [character, setCharacter] = useState<CharacterProfile>(DEFAULT_CHARACTER);
  const [cloudSynced, setCloudSynced] = useState(true);
  const [cacheReadyUid, setCacheReadyUid] = useState<string | null>(null);
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<TabId>("home");
  const [search, setSearch] = useState("");

  const [noteSheet, setNoteSheet] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [taskSheet, setTaskSheet] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [journalSheet, setJournalSheet] = useState(false);
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [quickSheet, setQuickSheet] = useState(false);
  const [donation, setDonation] = useState<(typeof CRYPTO_ADDRESS)[number] | null>(null);

  useEffect(() => watchAuth((nextUser) => {
    setUser(nextUser);
    setAuthLoading(false);
    if (!nextUser) {
      setCloudSynced(false);
      setCacheReadyUid(null);
      setNotes(INITIAL_NOTES);
      setJournals(INITIAL_JOURNALS);
      setTasks(INITIAL_TASKS);
      setCharacter(DEFAULT_CHARACTER);
      setTab("home");
      setSearch("");
    }
  }), []);

  useEffect(() => {
    if (!user?.uid) return;
    const uid = user.uid;
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        flushPendingWrites(uid)
          .then(() => setCloudSynced(true))
          .catch(() => setCloudSynced(false));
      } else if (state.isConnected === false) {
        setCloudSynced(false);
      }
    });
    return unsubscribe;
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    let active = true;
    let unsubs: (() => void)[] = [];
    const uid = user.uid;

    setCacheReadyUid(null);
    const bootstrap = async () => {
      let cache: LocalCache = {};
      try {
        const raw = await AsyncStorage.getItem(`papyrus:${uid}:cache`);
        if (raw) cache = JSON.parse(raw) as LocalCache;
      } catch {
        setCloudSynced(false);
      }
      if (!active) return;
      if (cache.notes?.length) setNotes(sortNotes(cache.notes));
      if (cache.journals?.length) setJournals(sortJournals(cache.journals));
      if (cache.tasks?.length) setTasks(sortTasks(cache.tasks));
      if (cache.character) setCharacter({ ...DEFAULT_CHARACTER, ...cache.character });
      const network = await NetInfo.fetch();
      if (active && network.isConnected) {
        try {
          await flushPendingWrites(uid);
        } catch {
          setCloudSynced(false);
        }
      }
      if (!active) return;
      setCacheReadyUid(uid);

      const seeded = { notes: false, journals: false, tasks: false };
      const attach = <T extends { id: string }>(
        name: "notes" | "journals" | "tasks",
        defaults: T[],
        local: T[] | undefined,
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
        sorter: (items: T[]) => T[]
      ) => {
        const unsubscribe = watchCollection<T>(uid, name, (items) => {
          if (!active) return;
          if (items.length === 0) {
            const seedItems = local?.length ? local : defaults;
            setItems(sorter(seedItems));
            if (!seeded[name]) {
              seeded[name] = true;
              Promise.all(seedItems.map((item) => saveItem(uid, name, item))).catch(() => setCloudSynced(false));
            }
          } else {
            setItems(sorter(items));
            setCloudSynced(true);
          }
        }, () => setCloudSynced(false));
        unsubs.push(unsubscribe);
      };

      setCloudSynced(true);
      attach<Note>("notes", INITIAL_NOTES, cache.notes, setNotes, sortNotes);
      attach<JournalEntry>("journals", INITIAL_JOURNALS, cache.journals, setJournals, sortJournals);
      attach<Task>("tasks", INITIAL_TASKS, cache.tasks, setTasks, sortTasks);

      const unsubscribeProfile = watchCharacter(uid, (profile) => {
        if (active) {
          setCharacter(profile);
          setCloudSynced(true);
        }
      }, () => setCloudSynced(false));
      unsubs.push(unsubscribeProfile);
    };
    void bootstrap();
    return () => {
      active = false;
      unsubs.forEach((unsubscribe) => unsubscribe());
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || cacheReadyUid !== user.uid) return;
    const cache: LocalCache = { notes, journals, tasks, character };
    AsyncStorage.setItem(`papyrus:${user.uid}:cache`, JSON.stringify(cache)).catch(() => setCloudSynced(false));
  }, [user?.uid, cacheReadyUid, notes, journals, tasks, character]);

  const cloudSave = useCallback((collectionName: "notes" | "journals" | "tasks", item: { id: string; [key: string]: unknown }) => {
    if (!user?.uid) return;
    saveItem(user.uid, collectionName, item).then(() => setCloudSynced(true)).catch(() => setCloudSynced(false));
  }, [user?.uid]);

  const saveNote = useCallback((note: Note) => {
    setNotes((items) => sortNotes([note, ...items.filter((item) => item.id !== note.id)]));
    cloudSave("notes", note as unknown as { id: string; [key: string]: unknown });
  }, [cloudSave]);
  const deleteNote = useCallback((id: string) => {
    setNotes((items) => items.filter((item) => item.id !== id));
    if (user?.uid) removeItem(user.uid, "notes", id).catch(() => setCloudSynced(false));
  }, [user?.uid]);
  const saveTask = useCallback((task: Task) => {
    setTasks((items) => sortTasks([task, ...items.filter((item) => item.id !== task.id)]));
    cloudSave("tasks", task as unknown as { id: string; [key: string]: unknown });
  }, [cloudSave]);
  const deleteTask = useCallback((id: string) => {
    setTasks((items) => items.filter((item) => item.id !== id));
    if (user?.uid) removeItem(user.uid, "tasks", id).catch(() => setCloudSynced(false));
  }, [user?.uid]);
  const saveJournal = useCallback((entry: JournalEntry) => {
    setJournals((items) => sortJournals([entry, ...items.filter((item) => item.id !== entry.id)]));
    cloudSave("journals", entry as unknown as { id: string; [key: string]: unknown });
  }, [cloudSave]);
  const deleteJournal = useCallback((id: string) => {
    setJournals((items) => items.filter((item) => item.id !== id));
    if (user?.uid) removeItem(user.uid, "journals", id).catch(() => setCloudSynced(false));
  }, [user?.uid]);

  const openNewNote = () => { setEditingNote(null); setNoteSheet(true); };
  const openNewTask = () => { setEditingTask(null); setTaskSheet(true); };
  const localToday = (() => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; })();
  const openNewJournal = (date = localToday) => {
    setEditingJournal({
      id: makeId("journal"),
      date,
      title: "",
      content: "",
      mood: "peaceful",
      tags: [],
      color: "parchment",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setJournalSheet(true);
  };

  const createTemplate = (templateId: string) => {
    const template = NOTE_TEMPLATES.find((item) => item.id === templateId) || NOTE_TEMPLATES[0];
    setEditingNote({
      id: makeId("note"),
      title: template.title,
      content: template.content,
      category: template.category,
      tags: [...template.tags],
      color: template.color,
      isPinned: false,
      checklist: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setNoteSheet(true);
  };

  const toggleTask = (task: Task) => {
    const next = { ...task, completed: !task.completed, completedAt: !task.completed ? Date.now() : undefined };
    saveTask(next);
  };
  const clearCompleted = () => {
    const completed = tasks.filter((task) => task.completed);
    setTasks((items) => items.filter((task) => !task.completed));
    if (user?.uid) completed.forEach((task) => removeItem(user.uid, "tasks", task.id).catch(() => setCloudSynced(false)));
  };
  const updateCharacter = (profile: CharacterProfile) => {
    setCharacter(profile);
    if (user?.uid) saveCharacter(user.uid, profile).then(() => setCloudSynced(true)).catch(() => setCloudSynced(false));
  };
  const completeFocus = useCallback((minutes: number) => {
    setCharacter((current) => {
      const updated = {
        ...current,
        totalFocusMinutes: (current.totalFocusMinutes || 0) + minutes,
        completedPomodoros: (current.completedPomodoros || 0) + 1,
      };
      if (user?.uid) saveCharacter(user.uid, updated).then(() => setCloudSynced(true)).catch(() => setCloudSynced(false));
      return updated;
    });
  }, [user?.uid]);

  const shareNote = (note: Note) => {
    Alert.alert("Export note", note.title, [
      {
        text: "Markdown",
        onPress: () => Share.share({
          title: note.title,
          message: `# ${note.title}\n\n${note.content}\n\nTags: ${note.tags.join(", ")}`,
        }).catch(() => undefined),
      },
      {
        text: "JSON",
        onPress: () => Share.share({
          title: `${note.title}.json`,
          message: JSON.stringify(note, null, 2),
        }).catch(() => undefined),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };
  const duplicateNote = (note: Note) => saveNote({ ...note, id: makeId("note"), title: `${note.title} (Copy)`, createdAt: Date.now(), updatedAt: Date.now() });
  const togglePin = (note: Note) => saveNote({ ...note, isPinned: !note.isPinned, updatedAt: Date.now() });
  const toggleArchive = (note: Note) => saveNote({ ...note, isArchived: !note.isArchived, updatedAt: Date.now() });

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setTab("home");
    } catch (error) {
      Alert.alert("Sign out failed", error instanceof Error ? error.message : "Please try again.");
    }
  };

  const handleQuickNote = (title: string, content: string) => {
    const now = Date.now();
    saveNote({ id: makeId("note"), title, content, category: "Personal", tags: ["quick-capture"], color: "parchment", isPinned: false, checklist: [], createdAt: now, updatedAt: now });
  };
  const handleQuickTask = (title: string) => {
    const now = Date.now();
    saveTask({ id: makeId("task"), title, completed: false, priority: "medium", category: "Personal", tags: ["quick-capture"], createdAt: now });
  };

  if (!fontsLoaded || authLoading) return <Loading />;
  if (!user) return <GoogleLogin onError={setAuthError} error={authError} />;
  if (cacheReadyUid !== user.uid) return <Loading label="Opening your private cloud vault…" />;

  const tabs: { id: TabId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: "home", label: "Home", icon: "home-outline" },
    { id: "notes", label: "Notes", icon: "book-outline" },
    { id: "journal", label: "Journal", icon: "calendar-outline" },
    { id: "tasks", label: "Tasks", icon: "checkbox-outline" },
    { id: "focus", label: "Focus", icon: "hourglass-outline" },
    { id: "profile", label: "Profile", icon: "person-circle-outline" },
  ];

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={["top", "left", "right"]}>
        <StatusBar style="dark" />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 17, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.line, backgroundColor: C.bg }}>
          <Pressable onPress={() => setTab("home")} style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: "#E9DFC9", justifyContent: "center", alignItems: "center" }}><Text style={{ fontSize: 19 }}>📜</Text></View>
            <View><AppText serif style={{ fontSize: 19, fontFamily: "Newsreader_600SemiBold" }}>Papyrus</AppText><AppText muted style={{ fontSize: 8, letterSpacing: 1 }}>NOTES & TASKS</AppText></View>
          </Pressable>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <View style={{ width: 7, height: 7, borderRadius: 5, backgroundColor: cloudSynced ? C.green : C.red }} />
            <AppText muted style={{ fontSize: 9 }}>{cloudSynced ? "Synced" : "Offline"}</AppText>
            <Pressable onPress={() => setQuickSheet(true)} style={{ width: 34, height: 34, backgroundColor: C.brown, borderRadius: 11, alignItems: "center", justifyContent: "center", marginLeft: 3 }}><Ionicons name="add" size={23} color="#FFFFFF" /></Pressable>
          </View>
        </View>
        {(tab === "notes" || tab === "tasks") ? <View style={{ paddingHorizontal: 16, paddingTop: 9 }}>
          <View style={{ flexDirection: "row", alignItems: "center", borderRadius: 11, backgroundColor: C.paper, borderColor: C.line, borderWidth: 1, paddingHorizontal: 10 }}>
            <Ionicons name="search" size={15} color={C.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={tab === "notes" ? "Search your notes…" : "Search your tasks…"}
              placeholderTextColor="#A99D8D"
              style={{ flex: 1, height: 39, fontSize: 11, color: C.ink, paddingHorizontal: 8 }}
            />
            {search ? <Pressable onPress={() => setSearch("")}><Ionicons name="close-circle" size={16} color={C.muted} /></Pressable> : null}
          </View>
        </View> : null}

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingBottom: 26, gap: 6 }}>
          {tab === "home" ? <DashboardScreen
            name={user.displayName || character.name || "Scribe"}
            notes={notes}
            journals={journals}
            tasks={tasks}
            character={character}
            onNavigate={(next) => setTab(next as TabId)}
            onNewNote={() => setQuickSheet(true)}
            onNewTask={openNewTask}
            onNewJournal={() => openNewJournal()}
            onOpenNote={(note) => { setEditingNote(note); setNoteSheet(true); }}
            onToggleTask={toggleTask}
            cloudSynced={cloudSynced}
          /> : null}
          {tab === "notes" ? <NotesScreen
            notes={notes}
            search={search}
            onSearch={setSearch}
            onNew={openNewNote}
            onOpen={(note) => { setEditingNote(note); setNoteSheet(true); }}
            onPin={togglePin}
            onDuplicate={duplicateNote}
            onDelete={(note) => Alert.alert("Delete note?", note.title, [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => deleteNote(note.id) }])}
            onArchive={toggleArchive}
            onShare={shareNote}
            onTemplate={createTemplate}
          /> : null}
          {tab === "journal" ? <JournalScreen
            entries={journals}
            onNew={openNewJournal}
            onOpen={(entry) => { setEditingJournal(entry); setJournalSheet(true); }}
            onDelete={(entry) => deleteJournal(entry.id)}
          /> : null}
          {tab === "tasks" ? <TasksScreen
            tasks={tasks}
            search={search}
            onSearch={setSearch}
            onNew={openNewTask}
            onToggle={toggleTask}
            onEdit={(task) => { setEditingTask(task); setTaskSheet(true); }}
            onDelete={(task) => deleteTask(task.id)}
            onClearCompleted={clearCompleted}
          /> : null}
          {tab === "focus" ? <FocusScreen tasks={tasks} character={character} onComplete={completeFocus} onProfile={() => setTab("profile")} /> : null}
          {tab === "profile" ? <ProfileScreen
            character={character}
            notesCount={notes.length}
            journalsCount={journals.length}
            tasksCount={tasks.length}
            onSave={updateCharacter}
            onSignOut={handleSignOut}
            onDonation={setDonation}
            userEmail={user.email}
          /> : null}
          <View style={{ paddingTop: 18, paddingBottom: 4, alignItems: "center" }}>
            <AppText muted style={{ fontSize: 8 }}>PAPYRUS · A SMALL SANCTUARY FOR THOUGHT</AppText>
          </View>
        </ScrollView>

        <View style={{ flexDirection: "row", borderTopColor: C.line, borderTopWidth: 1, backgroundColor: C.paper, paddingTop: 8, paddingBottom: 5, paddingHorizontal: 2 }}>
          {tabs.map((item) => {
            const active = item.id === tab;
            const badge = item.id === "tasks" ? tasks.filter((task) => !task.completed).length : item.id === "notes" ? notes.filter((note) => !note.isArchived).length : item.id === "journal" ? journals.length : 0;
            return <Pressable key={item.id} onPress={() => { setTab(item.id); if (item.id !== "notes" && item.id !== "tasks") setSearch(""); }} style={{ flex: 1, alignItems: "center", gap: 3, paddingVertical: 4 }}>
              <View style={{ width: 34, height: 26, borderRadius: 9, alignItems: "center", justifyContent: "center", backgroundColor: active ? "#E9DFC9" : "transparent" }}><Ionicons name={item.icon} size={18} color={active ? C.brown : C.muted} /></View>
              <AppText style={{ fontSize: 8, fontFamily: active ? "PlusJakartaSans_700Bold" : "PlusJakartaSans_400Regular", color: active ? C.brown : C.muted }}>{item.label}</AppText>
              {badge > 0 ? <View style={{ position: "absolute", top: 1, right: 12, minWidth: 13, height: 13, borderRadius: 7, backgroundColor: C.gold, alignItems: "center", justifyContent: "center" }}><Text style={{ color: "#FFF", fontSize: 7, fontWeight: "800" }}>{badge > 99 ? "99+" : badge}</Text></View> : null}
            </Pressable>;
          })}
        </View>

        <NoteEditorSheet visible={noteSheet} note={editingNote} uid={user.uid} onClose={() => setNoteSheet(false)} onSave={saveNote} onDelete={deleteNote} />
        <TaskEditorSheet visible={taskSheet} task={editingTask} onClose={() => setTaskSheet(false)} onSave={saveTask} onDelete={deleteTask} />
        <JournalEditorSheet visible={journalSheet} entry={editingJournal} uid={user.uid} onClose={() => setJournalSheet(false)} onSave={saveJournal} onDelete={deleteJournal} />
        <QuickCaptureSheet visible={quickSheet} onClose={() => setQuickSheet(false)} onCreateNote={handleQuickNote} onCreateTask={handleQuickTask} />
        {donation ? <DonationSheet crypto={donation} onClose={() => setDonation(null)} /> : null}
      </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><AppRoot /></SafeAreaProvider>;
}
