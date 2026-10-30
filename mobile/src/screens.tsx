import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import * as Clipboard from "expo-clipboard";
import { Note, Task, JournalEntry, JournalMood, CharacterProfile, NoteColor, TaskPriority, NOTE_COLORS, JOURNAL_MOODS } from "../../src/types";
import { INITIAL_CATEGORIES, CRYPTO_ADDRESS } from "../../src/data/initialData";
import { NOTE_TEMPLATES } from "../../src/data/templates";
import { PIXEL_AVATARS, AVATAR_CATEGORIES, getAvatarById } from "../../src/data/pixelAvatars";
import { C, AppText, Button, Card, Field, Heading, Pill, Stat } from "./ui";
import { PixelAvatarNative } from "./pixelArt";

const moods: { id: JournalMood; label: string; emoji: string }[] = [
  { id: "radiant", label: "Radiant", emoji: "☀️" },
  { id: "peaceful", label: "Peaceful", emoji: "🌿" },
  { id: "motivated", label: "Motivated", emoji: "⚡" },
  { id: "focused", label: "Deep Focus", emoji: "🧠" },
  { id: "reflective", label: "Reflective", emoji: "☕" },
  { id: "melancholy", label: "Melancholy", emoji: "🌧️" },
  { id: "anxious", label: "Restless", emoji: "🌪️" },
  { id: "weary", label: "Weary", emoji: "🌙" },
  { id: "angry", label: "Angry", emoji: "🔥" },
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "notwell", label: "Not well", emoji: "🫧" },
];

const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const today = () => localDate(new Date());
const niceDate = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
};
const idEmoji = (id: string) => {
  if (id.includes("cat")) return "🐈";
  if (id.includes("dog") || id.includes("animal")) return "🐾";
  if (id.includes("robot")) return "🤖";
  if (id.includes("ghost")) return "👻";
  if (id.includes("dragon")) return "🐉";
  if (id.includes("astronaut") || id.includes("space")) return "🧑‍🚀";
  if (id.includes("plant") || id.includes("cactus")) return "🌵";
  if (id.includes("coffee") || id.includes("desk")) return "☕";
  if (id.includes("wizard") || id.includes("mage")) return "🧙";
  if (id.includes("alien")) return "👽";
  if (id.includes("wanderer")) return "🌙";
  if (id.includes("sakura")) return "🌸";
  if (id.includes("ramen")) return "🍜";
  if (id.includes("cyberpunk") || id.includes("rain")) return "🌃";
  if (id.includes("cliff")) return "🏞️";
  return "🧑‍🎨";
};

function SectionLabel({ children, action, onAction }: { children: React.ReactNode; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, marginBottom: 10 }}>
      <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold", letterSpacing: 1.3 }}>{children}</AppText>
      {action ? <Pressable onPress={onAction}><AppText style={{ color: C.gold, fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" }}>{action}</AppText></Pressable> : null}
    </View>
  );
}

export function DashboardScreen({
  name,
  notes,
  journals,
  tasks,
  character,
  onNavigate,
  onNewNote,
  onNewTask,
  onNewJournal,
  onOpenNote,
  onToggleTask,
  cloudSynced,
}: {
  name: string;
  notes: Note[];
  journals: JournalEntry[];
  tasks: Task[];
  character: CharacterProfile;
  onNavigate: (tab: string) => void;
  onNewNote: () => void;
  onNewTask: () => void;
  onNewJournal: () => void;
  onOpenNote: (note: Note) => void;
  onToggleTask: (task: Task) => void;
  cloudSynced: boolean;
}) {
  const activeTasks = tasks.filter((task) => !task.completed);
  const todaysTasks = activeTasks.filter((task) => !task.dueDate || task.dueDate <= today()).slice(0, 4);
  const latestNotes = [...notes].filter((note) => !note.isArchived).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
  const minutes = character.totalFocusMinutes || 0;
  return (
    <View style={{ gap: 16 }}>
      <Card style={{ backgroundColor: "#F2EBDD", borderColor: "#E6D9C2", padding: 19 }}>
        <AppText muted style={{ fontSize: 10, letterSpacing: 1.4, fontFamily: "PlusJakartaSans_700Bold" }}>YOUR PERSONAL SANCTUARY</AppText>
        <AppText serif style={{ fontSize: 31, lineHeight: 37, marginTop: 7, fontFamily: "Newsreader_600SemiBold" }}>A quieter space for clear thoughts.</AppText>
        <AppText muted style={{ fontSize: 12, lineHeight: 19, marginTop: 8 }}>Welcome back, {name || "Scribe"}. Gather your ideas, tend to your tasks, and make room for deep work.</AppText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginTop: 12 }}>
          <View style={{ width: 7, height: 7, borderRadius: 9, backgroundColor: cloudSynced ? C.green : C.red }} />
          <AppText muted style={{ fontSize: 10 }}>{cloudSynced ? "Cloud vault connected" : "Offline mode · changes saved locally"}</AppText>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          <Button title="Quick capture" compact onPress={onNewNote} icon={<Ionicons name="flash-outline" size={14} color="#FFF" />} />
          <Button title="New journal" compact variant="light" onPress={onNewJournal} />
          <Button title="Focus" compact variant="light" onPress={() => onNavigate("focus")} />
        </View>
      </Card>

      <View style={{ flexDirection: "row", gap: 9 }}>
        <Stat label="NOTES" value={notes.filter((n) => !n.isArchived).length} icon={<Ionicons name="book-outline" color={C.brown} size={17} />} />
        <Stat label="JOURNALS" value={journals.length} tint="#E6EEE4" icon={<Ionicons name="calendar-outline" color={C.green} size={17} />} />
        <Stat label="TASKS LEFT" value={activeTasks.length} tint="#F5E9E2" icon={<Ionicons name="checkmark-done-outline" color={C.red} size={17} />} />
      </View>
      <Card style={{ gap: 9 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <AppText style={{ fontSize: 10, letterSpacing: 1.2, fontFamily: "PlusJakartaSans_700Bold" }}>YOUR FOCUS PRACTICE</AppText>
            <AppText serif style={{ fontSize: 22, marginTop: 3, fontFamily: "Newsreader_600SemiBold" }}>{Math.floor(minutes / 60)}h {minutes % 60}m invested</AppText>
          </View>
          <View style={{ width: 47, height: 47, borderRadius: 16, backgroundColor: "#E9DDC9", alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 24 }}>⏳</Text></View>
        </View>
        <View style={{ height: 7, backgroundColor: "#EDE5D8", borderRadius: 8, overflow: "hidden" }}><View style={{ width: `${Math.min(100, character.completedPomodoros * 4)}%`, height: 7, backgroundColor: C.gold, borderRadius: 8 }} /></View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <AppText muted style={{ fontSize: 10 }}>{character.completedPomodoros || 0} completed Pomodoros</AppText>
          <Pressable onPress={() => onNavigate("profile")}><AppText style={{ color: C.gold, fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>View character →</AppText></Pressable>
        </View>
      </Card>

      <View>
        <SectionLabel action="All tasks →" onAction={() => onNavigate("tasks")}>TODAY'S INTENTIONS</SectionLabel>
        {todaysTasks.length ? todaysTasks.map((task) => (
          <Pressable key={task.id} onPress={() => onToggleTask(task)} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 13, padding: 12, marginBottom: 8 }}>
            <View style={{ width: 22, height: 22, borderWidth: 1.5, borderColor: task.completed ? C.green : "#BDAF9C", borderRadius: 7, alignItems: "center", justifyContent: "center", backgroundColor: task.completed ? "#E5EFE1" : "transparent" }}>{task.completed ? <Text style={{ color: C.green }}>✓</Text> : null}</View>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontSize: 12, textDecorationLine: task.completed ? "line-through" : "none" }}>{task.title}</AppText>
              <AppText muted style={{ fontSize: 9, marginTop: 3 }}>{task.category} · {task.priority} priority</AppText>
            </View>
            <AppText muted style={{ fontSize: 9 }}>{task.dueDate || "Anytime"}</AppText>
          </Pressable>
        )) : <Card><AppText muted style={{ fontSize: 11 }}>Your list is clear. Take a breath or add one small intention.</AppText><Button title="Add a task" compact onPress={onNewTask} style={{ marginTop: 10, alignSelf: "flex-start" }} /></Card>}
      </View>
      <View>
        <SectionLabel action="All notes →" onAction={() => onNavigate("notes")}>RECENTLY TOUCHED</SectionLabel>
        {latestNotes.map((note) => (
          <Pressable key={note.id} onPress={() => onOpenNote(note)} style={{ flexDirection: "row", gap: 11, padding: 12, backgroundColor: NOTE_COLORS[note.color || "parchment"].hex, borderRadius: 14, borderWidth: 1, borderColor: C.line, marginBottom: 8 }}>
            <View style={{ width: 4, backgroundColor: C.gold, borderRadius: 5 }} />
            <View style={{ flex: 1 }}>
              <AppText style={{ fontSize: 12, fontFamily: "PlusJakartaSans_700Bold" }} numberOfLines={1}>{note.title}</AppText>
              <AppText muted style={{ fontSize: 10, marginTop: 3 }} numberOfLines={2}>{note.content.replace(/[#*_>`]/g, "").slice(0, 100)}</AppText>
              <AppText muted style={{ fontSize: 9, marginTop: 6 }}>{note.category} · {new Date(note.updatedAt).toLocaleDateString()}</AppText>
            </View>
            {note.isPinned ? <Text>📌</Text> : null}
          </Pressable>
        ))}
        {latestNotes.length === 0 ? <Card><AppText muted style={{ fontSize: 11 }}>Your paper vault is ready for its first note.</AppText><Button title="Create a note" compact onPress={onNewNote} style={{ marginTop: 10, alignSelf: "flex-start" }} /></Card> : null}
      </View>
    </View>
  );
}

export function NotesScreen({
  notes,
  search,
  onSearch,
  onNew,
  onOpen,
  onPin,
  onDuplicate,
  onDelete,
  onArchive,
  onShare,
  onTemplate,
}: {
  notes: Note[];
  search: string;
  onSearch: (value: string) => void;
  onNew: () => void;
  onOpen: (note: Note) => void;
  onPin: (note: Note) => void;
  onDuplicate: (note: Note) => void;
  onDelete: (note: Note) => void;
  onArchive: (note: Note) => void;
  onShare: (note: Note) => void;
  onTemplate: (id: string) => void;
}) {
  const [archive, setArchive] = useState(false);
  const [category, setCategory] = useState("All");
  const [color, setColor] = useState<NoteColor | "all">("all");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<"updated" | "created" | "title">("updated");
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags || []))).slice(0, 14);
  const filtered = useMemo(() => notes.filter((note) => {
    if (!!note.isArchived !== archive) return false;
    if (category !== "All" && note.category !== category) return false;
    if (color !== "all" && note.color !== color) return false;
    if (tag && !(note.tags || []).includes(tag)) return false;
    const q = search.toLowerCase().trim();
    if (q && !note.title.toLowerCase().includes(q) && !note.content.toLowerCase().includes(q) && !(note.tags || []).some((v) => v.toLowerCase().includes(q))) return false;
    return true;
  }).sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    if (sort === "created") return b.createdAt - a.createdAt;
    if (sort === "title") return a.title.localeCompare(b.title);
    return b.updatedAt - a.updatedAt;
  }), [notes, archive, category, color, tag, search, sort]);

  return (
    <View style={{ gap: 12 }}>
      <Heading subtitle="A library of thoughts, references and unfinished ideas">The paper vault</Heading>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}><TextInput value={search} onChangeText={onSearch} placeholder="Search title, text or tag…" placeholderTextColor="#A99D8D" style={{ height: 43, paddingHorizontal: 13, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, color: C.ink, fontSize: 11 }} /></View>
        <Button title="＋ New" onPress={onNew} compact />
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pill label={`Notes (${notes.filter((n) => !n.isArchived).length})`} selected={!archive} onPress={() => setArchive(false)} />
        <Pill label={`Archive (${notes.filter((n) => n.isArchived).length})`} selected={archive} onPress={() => setArchive(true)} />
        <Pill label="Templates" onPress={() => setTemplatesOpen(!templatesOpen)} selected={templatesOpen} />
      </View>
      {templatesOpen ? <Card style={{ gap: 8 }}>
        <AppText style={{ fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" }}>START WITH A TEMPLATE</AppText>
        {NOTE_TEMPLATES.map((tpl) => <Pressable key={tpl.id} onPress={() => { onTemplate(tpl.id); setTemplatesOpen(false); }} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.line }}>
          <View style={{ flex: 1, paddingRight: 8 }}><AppText style={{ fontSize: 11 }}>{tpl.title}</AppText><AppText muted style={{ fontSize: 9, marginTop: 2 }}>{tpl.description}</AppText></View><AppText style={{ color: C.gold }}>＋</AppText>
        </Pressable>)}
      </Card> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
        {["All", ...INITIAL_CATEGORIES.filter((x) => x !== "All")].map((item) => <Pill key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />)}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
        <Pill label="All colors" selected={color === "all"} onPress={() => setColor("all")} />
        {(Object.keys(NOTE_COLORS) as NoteColor[]).map((item) => <Pill key={item} label={NOTE_COLORS[item].name} selected={color === item} color={NOTE_COLORS[item].hex} onPress={() => setColor(item)} />)}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
        <Pill label="All tags" selected={!tag} onPress={() => setTag("")} />
        {allTags.map((item) => <Pill key={item} label={`#${item}`} selected={tag === item} onPress={() => setTag(tag === item ? "" : item)} />)}
      </ScrollView>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <AppText muted style={{ fontSize: 10 }}>{filtered.length} notes</AppText>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {(["updated", "created", "title"] as const).map((item) => <Pill key={item} label={item} selected={sort === item} onPress={() => setSort(item)} />)}
        </View>
      </View>
      {filtered.length ? filtered.map((note) => (
        <Card key={note.id} style={{ padding: 0, overflow: "hidden", backgroundColor: NOTE_COLORS[note.color || "parchment"].hex }}>
          <Pressable onPress={() => onOpen(note)} style={{ padding: 14, gap: 7 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <AppText style={{ fontSize: 9, fontFamily: "PlusJakartaSans_700Bold", color: C.muted }}>{note.category.toUpperCase()}</AppText>
                {note.isPinned ? <Text style={{ fontSize: 11 }}>📌</Text> : null}
                {note.isArchived ? <Pill label="ARCHIVED" /> : null}
              </View>
              <AppText muted style={{ fontSize: 9 }}>{new Date(note.updatedAt).toLocaleDateString()}</AppText>
            </View>
            <AppText serif style={{ fontSize: 20, fontFamily: "Newsreader_600SemiBold" }} numberOfLines={2}>{note.title || "Untitled note"}</AppText>
            {note.thumbnailUrl ? <Image source={{ uri: note.thumbnailUrl }} style={{ width: "100%", height: 120, borderRadius: 10 }} resizeMode="cover" /> : null}
            <AppText muted style={{ fontSize: 11, lineHeight: 17 }} numberOfLines={3}>{note.content.replace(/[#*_>`]/g, "").trim() || "No content yet. Tap to add your thoughts."}</AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {(note.tags || []).slice(0, 5).map((item) => <Pill key={item} label={`#${item}`} />)}
            </View>
          </Pressable>
          <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: C.line, padding: 8, gap: 5 }}>
            <Button title={note.isPinned ? "Unpin" : "Pin"} compact variant="light" onPress={() => onPin(note)} style={{ flex: 1 }} />
            <Button title="Copy" compact variant="light" onPress={() => onDuplicate(note)} style={{ flex: 1 }} />
            <Button title="Share" compact variant="light" onPress={() => onShare(note)} style={{ flex: 1 }} />
            <Button title={archive ? "Restore" : "Archive"} compact variant="light" onPress={() => onArchive(note)} style={{ flex: 1 }} />
            <Button title="Delete" compact variant="danger" onPress={() => onDelete(note)} />
          </View>
        </Card>
      )) : <Card><AppText muted style={{ fontSize: 11 }}>No notes match these filters. Change the search or create a fresh page.</AppText></Card>}
    </View>
  );
}

export function JournalScreen({
  entries,
  onNew,
  onOpen,
  onDelete,
}: {
  entries: JournalEntry[];
  onNew: (date: string) => void;
  onOpen: (entry: JournalEntry) => void;
  onDelete: (entry: JournalEntry) => void;
}) {
  const [mode, setMode] = useState<"calendar" | "list">("calendar");
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState(today());
  const [mood, setMood] = useState<JournalMood | "all">("all");
  const [search, setSearch] = useState("");
  const monthTitle = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const calendarDays = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return { date, key: localDate(date), current: date.getMonth() === month.getMonth() };
    });
  }, [month]);
  const matching = entries.filter((entry) => {
    if (mood !== "all" && entry.mood !== mood) return false;
    const q = search.trim().toLowerCase();
    return !q || entry.title.toLowerCase().includes(q) || entry.content.toLowerCase().includes(q) || entry.tags.some((tag) => tag.toLowerCase().includes(q));
  }).sort((a, b) => b.date.localeCompare(a.date) || b.updatedAt - a.updatedAt);
  const dayEntries = matching.filter((entry) => entry.date === selected);
  const moodFor = (date: string) => entries.find((entry) => entry.date === date);
  return (
    <View style={{ gap: 12 }}>
      <Heading subtitle="Track the weather within, one day at a time">Daily journal</Heading>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}><TextInput value={search} onChangeText={setSearch} placeholder="Search reflections and tags…" placeholderTextColor="#A99D8D" style={{ height: 42, backgroundColor: C.paper, borderColor: C.line, borderWidth: 1, borderRadius: 11, paddingHorizontal: 12, color: C.ink, fontSize: 11 }} /></View>
        <Button title="＋ Entry" compact onPress={() => onNew(selected)} />
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pill label="Calendar" selected={mode === "calendar"} onPress={() => setMode("calendar")} />
        <Pill label="All entries" selected={mode === "list"} onPress={() => setMode("list")} />
        <Pill label="Today" onPress={() => { setSelected(today()); setMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); }} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
        <Pill label="All moods" selected={mood === "all"} onPress={() => setMood("all")} />
        {moods.map((item) => <Pill key={item.id} label={`${item.emoji} ${item.label}`} selected={mood === item.id} onPress={() => setMood(item.id)} />)}
      </ScrollView>
      {mode === "calendar" ? <Card style={{ gap: 11 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Pressable onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><AppText style={{ fontSize: 22 }}>‹</AppText></Pressable>
          <AppText serif style={{ fontSize: 20, fontFamily: "Newsreader_600SemiBold" }}>{monthTitle}</AppText>
          <Pressable onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><AppText style={{ fontSize: 22 }}>›</AppText></Pressable>
        </View>
        <View style={{ flexDirection: "row" }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => <View key={i} style={{ flex: 1, alignItems: "center" }}><AppText muted style={{ fontSize: 9 }}>{day}</AppText></View>)}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {calendarDays.map(({ key, date, current }) => {
            const entry = moodFor(key);
            const selectedDay = selected === key;
            return <Pressable key={key} onPress={() => setSelected(key)} style={{ width: "14.285%", height: 42, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: selectedDay ? C.brown : "transparent", opacity: current ? 1 : 0.35 }}>
              <Text style={{ fontSize: 11, color: selectedDay ? "#FFFFFF" : C.ink, fontFamily: "PlusJakartaSans_700Bold" }}>{date.getDate()}</Text>
              {entry ? <Text style={{ fontSize: 9, marginTop: 1 }}>{moods.find((x) => x.id === entry.mood)?.emoji || "•"}</Text> : null}
            </Pressable>;
          })}
        </View>
        <View style={{ borderTopWidth: 1, borderTopColor: C.line, paddingTop: 11, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View><AppText style={{ fontSize: 12, fontFamily: "PlusJakartaSans_700Bold" }}>{niceDate(selected)}</AppText><AppText muted style={{ fontSize: 9, marginTop: 3 }}>{dayEntries.length} entries</AppText></View>
          <Button title="Write for this day" compact onPress={() => onNew(selected)} />
        </View>
      </Card> : null}
      <SectionLabel>{mode === "calendar" ? "THIS DAY'S PAGES" : "YOUR REFLECTIONS"}</SectionLabel>
      {(mode === "calendar" ? dayEntries : matching).length ? (mode === "calendar" ? dayEntries : matching).map((entry) => (
        <Card key={entry.id} style={{ gap: 8 }}>
          <Pressable onPress={() => onOpen(entry)} style={{ gap: 7 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <AppText muted style={{ fontSize: 9 }}>{niceDate(entry.date)} · {moods.find((x) => x.id === entry.mood)?.emoji} {JOURNAL_MOODS[entry.mood].label}</AppText>
              <AppText muted style={{ fontSize: 9 }}>Updated {new Date(entry.updatedAt).toLocaleDateString()}</AppText>
            </View>
            <AppText serif style={{ fontSize: 20, fontFamily: "Newsreader_600SemiBold" }}>{entry.title}</AppText>
            <AppText muted style={{ fontSize: 11, lineHeight: 18 }} numberOfLines={3}>{entry.content || "A blank page, ready for your words."}</AppText>
            {entry.thumbnailUrl ? <Image source={{ uri: entry.thumbnailUrl }} style={{ width: "100%", height: 125, borderRadius: 11 }} resizeMode="cover" /> : null}
            <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>{entry.tags.map((tag) => <Pill key={tag} label={`#${tag}`} />)}</View>
            {entry.audioRecording ? <Pill label={`🎙 Voice note · ${entry.audioRecording.durationSeconds}s`} /> : null}
          </Pressable>
          <View style={{ flexDirection: "row", gap: 8 }}><Button title="Edit" compact variant="light" onPress={() => onOpen(entry)} style={{ flex: 1 }} /><Button title="Delete" compact variant="danger" onPress={() => Alert.alert("Delete entry?", "This cannot be undone.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => onDelete(entry) }])} /></View>
        </Card>
      )) : <Card style={{ gap: 8 }}><AppText muted style={{ fontSize: 11 }}>No journal page for {niceDate(selected)} yet.</AppText><Button title="Begin a reflection" compact onPress={() => onNew(selected)} style={{ alignSelf: "flex-start" }} /></Card>}
    </View>
  );
}

export function TasksScreen({
  tasks,
  search,
  onSearch,
  onNew,
  onToggle,
  onEdit,
  onDelete,
  onClearCompleted,
}: {
  tasks: Task[];
  search: string;
  onSearch: (value: string) => void;
  onNew: () => void;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onClearCompleted: () => void;
}) {
  const [tab, setTab] = useState<"all" | "today" | "upcoming" | "priority" | "completed">("all");
  const [category, setCategory] = useState("All");
  const filtered = tasks.filter((task) => {
    if (category !== "All" && task.category !== category) return false;
    const q = search.toLowerCase().trim();
    if (q && !task.title.toLowerCase().includes(q) && !(task.description || "").toLowerCase().includes(q) && !task.category.toLowerCase().includes(q)) return false;
    if (tab === "today") return !task.completed && task.dueDate === today();
    if (tab === "upcoming") return !task.completed && !!task.dueDate && task.dueDate > today();
    if (tab === "priority") return !task.completed && task.priority === "high";
    if (tab === "completed") return task.completed;
    return true;
  }).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const p = { high: 0, medium: 1, low: 2 };
    if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority];
    return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
  });
  return (
    <View style={{ gap: 12 }}>
      <Heading subtitle="Turn good intentions into clear next steps">Tasks & intentions</Heading>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <View style={{ flex: 1 }}><TextInput value={search} onChangeText={onSearch} placeholder="Search your tasks…" placeholderTextColor="#A99D8D" style={{ height: 42, backgroundColor: C.paper, borderColor: C.line, borderWidth: 1, borderRadius: 11, paddingHorizontal: 12, color: C.ink, fontSize: 11 }} /></View>
        <Button title="＋ Add" compact onPress={onNew} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
        {([{ id: "all", label: "All" }, { id: "today", label: "Today" }, { id: "upcoming", label: "Upcoming" }, { id: "priority", label: "High priority" }, { id: "completed", label: "Completed" }] as const).map((item) => <Pill key={item.id} label={item.label} selected={tab === item.id} onPress={() => setTab(item.id)} />)}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
        {["All", ...INITIAL_CATEGORIES.filter((item) => item !== "All")].map((item) => <Pill key={item} label={item} selected={category === item} onPress={() => setCategory(item)} />)}
      </ScrollView>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <AppText muted style={{ fontSize: 10 }}>{filtered.length} {tab === "all" ? "tasks" : tab + " tasks"}</AppText>
        <Pressable onPress={() => Alert.alert("Clear completed tasks?", "Completed tasks will be permanently deleted.", [{ text: "Cancel", style: "cancel" }, { text: "Clear", style: "destructive", onPress: onClearCompleted }])}><AppText style={{ color: C.red, fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>Clear completed</AppText></Pressable>
      </View>
      {filtered.length ? filtered.map((task) => (
        <Card key={task.id} style={{ padding: 12 }}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <Pressable onPress={() => onToggle(task)} style={{ width: 25, height: 25, borderRadius: 8, borderWidth: 1.5, borderColor: task.completed ? C.green : "#BBAE9B", backgroundColor: task.completed ? "#E5EFE1" : "transparent", alignItems: "center", justifyContent: "center" }}>{task.completed ? <Text style={{ color: C.green, fontWeight: "800" }}>✓</Text> : null}</Pressable>
            <Pressable onPress={() => onEdit(task)} style={{ flex: 1, gap: 3 }}>
              <AppText style={{ fontSize: 12, fontFamily: "PlusJakartaSans_700Bold", textDecorationLine: task.completed ? "line-through" : "none", color: task.completed ? C.muted : C.ink }}>{task.title}</AppText>
              {task.description ? <AppText muted style={{ fontSize: 10 }} numberOfLines={2}>{task.description}</AppText> : null}
              <AppText muted style={{ fontSize: 9 }}>{task.category} · {task.dueDate ? `Due ${task.dueDate}` : "No due date"} · {task.priority.toUpperCase()}</AppText>
            </Pressable>
            <View style={{ gap: 8 }}>
              <Pressable onPress={() => onEdit(task)}><Ionicons name="create-outline" size={17} color={C.muted} /></Pressable>
              <Pressable onPress={() => Alert.alert("Delete task?", task.title, [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => onDelete(task) }])}><Ionicons name="trash-outline" size={16} color={C.red} /></Pressable>
            </View>
          </View>
        </Card>
      )) : <Card><AppText muted style={{ fontSize: 11 }}>Nothing here for this filter. Add a new task or enjoy the breathing room.</AppText></Card>}
    </View>
  );
}

export function FocusScreen({
  tasks,
  character,
  onComplete,
  onProfile,
}: {
  tasks: Task[];
  character: CharacterProfile;
  onComplete: (minutes: number) => void;
  onProfile: () => void;
}) {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortMinutes, setShortMinutes] = useState(5);
  const [longMinutes, setLongMinutes] = useState(15);
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [customVisible, setCustomVisible] = useState(false);
  const [custom, setCustom] = useState("25");
  const [selectedTask, setSelectedTask] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const endAt = useRef<number | null>(null);
  const scheduledNotification = useRef<string | null>(null);
  const length = mode === "work" ? workMinutes : mode === "shortBreak" ? shortMinutes : longMinutes;
  const lengthRef = useRef(length);
  lengthRef.current = length;

  const cancelEndNotification = async () => {
    if (!scheduledNotification.current) return;
    const id = scheduledNotification.current;
    scheduledNotification.current = null;
    await Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined);
  };

  useEffect(() => {
    Notifications.setNotificationChannelAsync("papyrus-focus-sound", {
      name: "Focus sessions · sound",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "default",
    }).catch(() => undefined);
    Notifications.setNotificationChannelAsync("papyrus-focus-silent", {
      name: "Focus sessions · silent",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: null,
    }).catch(() => undefined);
    return () => {
      if (scheduledNotification.current) {
        Notifications.cancelScheduledNotificationAsync(scheduledNotification.current).catch(() => undefined);
      }
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    endAt.current = Date.now() + secondsLeft * 1000;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil(((endAt.current || Date.now()) - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        scheduledNotification.current = null;
        setRunning(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
        if (mode === "work") {
          onComplete(lengthRef.current);
          setMode("shortBreak");
          setSecondsLeft(shortMinutes * 60);
        } else {
          setMode("work");
          setSecondsLeft(workMinutes * 60);
        }
      }
    }, 250);
    return () => clearInterval(timer);
  }, [running, mode, shortMinutes, workMinutes, onComplete]);

  const switchMode = (next: "work" | "shortBreak" | "longBreak") => {
    void cancelEndNotification();
    setRunning(false);
    setMode(next);
    setSecondsLeft((next === "work" ? workMinutes : next === "shortBreak" ? shortMinutes : longMinutes) * 60);
  };
  const startPause = async () => {
    if (running) {
      const remaining = Math.max(0, Math.ceil(((endAt.current || Date.now()) - Date.now()) / 1000));
      setSecondsLeft(remaining);
      setRunning(false);
      await cancelEndNotification();
      return;
    }
    const duration = secondsLeft <= 0 ? length * 60 : secondsLeft;
    if (secondsLeft <= 0) setSecondsLeft(duration);
    const permission = await Notifications.getPermissionsAsync();
    const granted = permission.granted || (await Notifications.requestPermissionsAsync()).granted;
    if (granted) {
      await cancelEndNotification();
      scheduledNotification.current = await Notifications.scheduleNotificationAsync({
        content: {
          title: mode === "work" ? "Focus session complete" : "Break complete",
          body: mode === "work" ? `You focused for ${length} minutes. Well done.` : "Your next focus session is ready.",
          sound: soundEnabled ? "default" : false,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: Math.max(1, duration),
          channelId: soundEnabled ? "papyrus-focus-sound" : "papyrus-focus-silent",
        },
      });
    }
    setRunning(true);
  };
  const reset = () => {
    void cancelEndNotification();
    setRunning(false);
    setSecondsLeft(length * 60);
  };
  const applyCustom = () => {
    const value = Math.min(180, Math.max(1, Number(custom) || 25));
    setWorkMinutes(value);
    if (mode === "work") { setRunning(false); setSecondsLeft(value * 60); }
    setCustom(String(value));
    setCustomVisible(false);
  };
  const totalSeconds = length * 60;
  const progress = Math.max(0, Math.min(100, ((totalSeconds - secondsLeft) / totalSeconds) * 100));
  const timeText = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  return (
    <View style={{ gap: 15 }}>
      <Heading subtitle="Protect your attention. One deliberate interval at a time.">Sanctum of focus</Heading>
      <Card style={{ alignItems: "center", paddingVertical: 22, gap: 13 }}>
        <View style={{ flexDirection: "row", gap: 7 }}>
          <Pill label={`🧠 Focus · ${workMinutes}m`} selected={mode === "work"} onPress={() => switchMode("work")} />
          <Pill label={`☕ Short · ${shortMinutes}m`} selected={mode === "shortBreak"} onPress={() => switchMode("shortBreak")} />
          <Pill label={`🌿 Long · ${longMinutes}m`} selected={mode === "longBreak"} onPress={() => switchMode("longBreak")} />
        </View>
        <View style={{ width: 232, height: 232, borderRadius: 116, borderWidth: 10, borderColor: "#E9DFCD", justifyContent: "center", alignItems: "center", backgroundColor: "#F4EEE2" }}>
          <View style={{ position: "absolute", top: -10, bottom: -10, left: -10, right: -10, borderRadius: 130, borderWidth: 10, borderColor: "transparent", borderTopColor: C.gold, transform: [{ rotate: `${progress * 3.6}deg` }] }} />
          <Text style={{ fontSize: 46 }}>{mode === "work" ? "📜" : mode === "shortBreak" ? "☕" : "🌱"}</Text>
          <AppText style={{ fontSize: 45, fontFamily: "Newsreader_600SemiBold", marginTop: 2 }}>{timeText}</AppText>
          <AppText muted style={{ fontSize: 10 }}>{mode === "work" ? "DEEP WORK" : mode === "shortBreak" ? "SHORT REST" : "LONG REST"}</AppText>
        </View>
        <View style={{ width: "100%", height: 7, backgroundColor: "#EDE5D8", borderRadius: 8, overflow: "hidden" }}><View style={{ height: 7, width: `${progress}%`, backgroundColor: C.gold, borderRadius: 8 }} /></View>
        <View style={{ flexDirection: "row", gap: 9 }}>
          <Button title={running ? "Pause" : "Begin session"} onPress={startPause} icon={<Ionicons name={running ? "pause" : "play"} color="#FFF" size={15} />} />
          <Button title="Reset" variant="light" onPress={reset} icon={<Ionicons name="refresh" size={15} color={C.ink} />} />
          <Button title={soundEnabled ? "Sound on" : "Muted"} compact variant="light" onPress={() => setSoundEnabled(!soundEnabled)} />
        </View>
        <Pressable onPress={() => setCustomVisible(!customVisible)}><AppText style={{ color: C.gold, fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>⚙ Configure intervals</AppText></Pressable>
        {customVisible ? <View style={{ width: "100%", gap: 9, borderTopWidth: 1, borderColor: C.line, paddingTop: 12 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <View style={{ flex: 1 }}><Field label="Focus (min)" value={custom} onChangeText={setCustom} keyboardType="numeric" /></View>
            <View style={{ flex: 1 }}><Field label="Short break" value={String(shortMinutes)} onChangeText={(v) => setShortMinutes(Math.max(1, Math.min(60, Number(v) || 5)))} keyboardType="numeric" /></View>
            <View style={{ flex: 1 }}><Field label="Long break" value={String(longMinutes)} onChangeText={(v) => setLongMinutes(Math.max(1, Math.min(90, Number(v) || 15)))} keyboardType="numeric" /></View>
          </View>
          <Button title="Apply durations" compact onPress={applyCustom} />
        </View> : null}
      </Card>
      <Card style={{ gap: 9 }}>
        <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>DEDICATE THIS SESSION TO</AppText>
        <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 10, backgroundColor: "#F5F0E6" }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 8, gap: 7 }}>
            <Pill label="Free focus" selected={!selectedTask} onPress={() => setSelectedTask("")} />
            {tasks.filter((task) => !task.completed).map((task) => <Pill key={task.id} label={task.title.slice(0, 24)} selected={selectedTask === task.id} onPress={() => setSelectedTask(task.id)} />)}
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View><AppText muted style={{ fontSize: 9 }}>TOTAL POMODOROS</AppText><AppText serif style={{ fontSize: 24, fontFamily: "Newsreader_600SemiBold" }}>{character.completedPomodoros || 0}</AppText></View>
          <View><AppText muted style={{ fontSize: 9 }}>TOTAL FOCUS MINUTES</AppText><AppText serif style={{ fontSize: 24, fontFamily: "Newsreader_600SemiBold" }}>{character.totalFocusMinutes || 0}</AppText></View>
          <Button title="Character" compact variant="light" onPress={onProfile} />
        </View>
      </Card>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {[15, 25, 45, 60].map((minutes) => <Pill key={minutes} label={`${minutes}m`} selected={workMinutes === minutes} onPress={() => { setWorkMinutes(minutes); setCustom(String(minutes)); if (mode === "work") { setRunning(false); setSecondsLeft(minutes * 60); } }} />)}
      </View>
    </View>
  );
}

export function ProfileScreen({
  character,
  notesCount,
  journalsCount,
  tasksCount,
  onSave,
  onSignOut,
  onDonation,
  userEmail,
}: {
  character: CharacterProfile;
  notesCount: number;
  journalsCount: number;
  tasksCount: number;
  onSave: (character: CharacterProfile) => void;
  onSignOut: () => void;
  onDonation: (crypto: (typeof CRYPTO_ADDRESS)[number]) => void;
  userEmail?: string | null;
}) {
  const [name, setName] = useState(character.name || "Scribe");
  const [statusText, setStatusText] = useState(character.statusText || "Gathering thoughts, one page at a time.");
  const [avatarId, setAvatarId] = useState(character.avatarId || "cat-tabby");
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setName(character.name || "Scribe");
    setStatusText(character.statusText || "");
    setAvatarId(character.avatarId || "cat-tabby");
  }, [character]);
  const avatars = PIXEL_AVATARS.filter((item) => (category === "all" || item.category === category) && (!search.trim() || item.name.toLowerCase().includes(search.toLowerCase()) || item.nameFa.includes(search)));
  const selectedAvatar = getAvatarById(avatarId);
  const save = () => {
    onSave({ ...character, name: name.trim() || "Scribe", statusText, avatarId });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };
  return (
    <View style={{ gap: 14 }}>
      <Heading subtitle="Shape your little corner of the Papyrus universe">Your character</Heading>
      <Card style={{ alignItems: "center", gap: 8, backgroundColor: selectedAvatar.bgHex, borderColor: selectedAvatar.borderHex }}>
        <PixelAvatarNative avatarId={avatarId} size={94} />
        <AppText serif style={{ fontSize: 24, fontFamily: "Newsreader_600SemiBold" }}>{name || "Scribe"}</AppText>
        <AppText muted style={{ fontSize: 10 }}>{selectedAvatar.name} · {selectedAvatar.category}</AppText>
        {statusText ? <AppText muted style={{ fontSize: 11, textAlign: "center" }}>{statusText}</AppText> : null}
        <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
          <View style={{ alignItems: "center" }}><AppText style={{ fontSize: 18, fontFamily: "Newsreader_600SemiBold" }}>{character.completedPomodoros || 0}</AppText><AppText muted style={{ fontSize: 8 }}>POMODOROS</AppText></View>
          <View style={{ width: 1, backgroundColor: "#0002" }} />
          <View style={{ alignItems: "center" }}><AppText style={{ fontSize: 18, fontFamily: "Newsreader_600SemiBold" }}>{character.totalFocusMinutes || 0}</AppText><AppText muted style={{ fontSize: 8 }}>FOCUS MIN</AppText></View>
        </View>
      </Card>
      <Card style={{ gap: 12 }}>
        <Field label="Character name" value={name} onChangeText={setName} placeholder="Your scribe name…" />
        <Field label="Status" value={statusText} onChangeText={setStatusText} placeholder="A quiet line about your current chapter…" />
        <View style={{ gap: 8 }}>
          <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>CHOOSE YOUR AVATAR</AppText>
          <TextInput value={search} onChangeText={setSearch} placeholder="Find an avatar…" placeholderTextColor="#A99D8D" style={{ height: 40, backgroundColor: "#F5F0E6", borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 11, color: C.ink, fontSize: 11 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 7 }}>
            {AVATAR_CATEGORIES.map((item) => <Pill key={item.id} label={`${item.emoji} ${item.label}`} selected={category === item.id} onPress={() => setCategory(item.id)} />)}
          </ScrollView>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 9 }}>
            {avatars.map((item) => <Pressable key={item.id} onPress={() => setAvatarId(item.id)} style={{ width: "22%", minWidth: 66, aspectRatio: 1, borderRadius: 13, backgroundColor: item.bgHex, borderWidth: avatarId === item.id ? 3 : 1, borderColor: avatarId === item.id ? C.brown : item.borderHex, alignItems: "center", justifyContent: "center" }}>
              <PixelAvatarNative avatarId={item.id} size={43} /><AppText style={{ fontSize: 8, textAlign: "center", marginTop: 3 }} numberOfLines={1}>{item.name}</AppText>
            </Pressable>)}
          </View>
          <AppText muted style={{ fontSize: 9 }}>Original pixel-art sprites and featured SVG scenes are rendered natively on Android. Floating CSS animations are intentionally static in this renderer.</AppText>
        </View>
        <Button title={saved ? "✓ Saved" : "Save character"} onPress={save} />
      </Card>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <Stat label="NOTES" value={notesCount} icon={<Ionicons name="book-outline" color={C.brown} size={16} />} />
        <Stat label="JOURNALS" value={journalsCount} icon={<Ionicons name="calendar-outline" color={C.green} size={16} />} />
        <Stat label="TASKS" value={tasksCount} icon={<Ionicons name="checkmark-done-outline" color={C.red} size={16} />} />
      </View>
      <Card style={{ gap: 8 }}>
        <AppText style={{ fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" }}>ACCOUNT & SUPPORT</AppText>
        <AppText muted style={{ fontSize: 10 }}>{userEmail || "Signed in with Google"}</AppText>
        <AppText muted style={{ fontSize: 10 }}>Your private cloud vault uses your existing Papyrus Firebase account.</AppText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
          {CRYPTO_ADDRESS.map((crypto) => <Button key={crypto.name} title={`♡ ${crypto.name}`} compact variant="light" onPress={() => onDonation(crypto)} />)}
        </View>
        <Button title="Sign out" variant="outline" onPress={onSignOut} />
      </Card>
    </View>
  );
}

export function DonationSheet({ crypto, onClose }: { crypto: (typeof CRYPTO_ADDRESS)[number] | null; onClose: () => void }) {
  if (!crypto) return null;
  const qr = `https://raw.githubusercontent.com/hoseinshooshi/Papyrus_note_android/main/public/${crypto.qrCodeSRC.replace(/^\//, "")}`;
  return (
    <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "#1E1914AA", justifyContent: "center", padding: 20 }}>
      <Card style={{ padding: 17, gap: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1 }}><AppText serif style={{ fontSize: 21, fontFamily: "Newsreader_600SemiBold" }}>Support Papyrus</AppText><AppText muted style={{ fontSize: 10 }}>Only use this address for {crypto.name}</AppText></View>
          <Button title="Close" compact variant="light" onPress={onClose} />
        </View>
        <Image source={{ uri: qr }} resizeMode="contain" style={{ width: 220, height: 220, alignSelf: "center", backgroundColor: "#FFF", borderRadius: 12 }} />
        <AppText style={{ textAlign: "center", fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" }}>{crypto.name} wallet address</AppText>
        <View style={{ borderWidth: 1, borderColor: C.line, backgroundColor: "#F5F0E6", borderRadius: 10, padding: 10 }}>
          <AppText style={{ fontSize: 10, lineHeight: 17, textAlign: "center" }}>{crypto.textAddress}</AppText>
        </View>
        <Button title="Copy wallet address" onPress={() => Clipboard.setStringAsync(crypto.textAddress).then(() => Alert.alert("Copied", "Wallet address copied to clipboard."))} />
      </Card>
    </View>
  );
}
