import React, { useEffect, useState } from "react";
import Markdown from "react-native-markdown-display";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { ChecklistItem, JournalEntry, JournalMood, Note, NoteColor, Task, TaskPriority } from "../../src/types";
import { JOURNAL_MOODS, NOTE_COLORS } from "../../src/types";
import { C, AppText, Button, Card, Field, Pill } from "./ui";
import { uploadMedia } from "./firebase";

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

const categories = ["Work", "Personal", "Writing", "Ideas", "Reading", "Projects", "General"];
const palette = Object.keys(NOTE_COLORS) as NoteColor[];
const localToday = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; };
const createId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

function SheetFrame({
  visible,
  title,
  subtitle,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ paddingHorizontal: 19, paddingTop: 14, paddingBottom: 13, borderBottomWidth: 1, borderColor: C.line, backgroundColor: C.paper, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <AppText serif style={{ fontSize: 23, fontFamily: "Newsreader_600SemiBold" }}>{title}</AppText>
            {subtitle ? <AppText muted style={{ fontSize: 10, marginTop: 2 }}>{subtitle}</AppText> : null}
          </View>
          <Button title="Close" variant="light" compact onPress={onClose} />
        </View>
        {children}
      </View>
    </Modal>
  );
}

function ImageAttachment({ uri, onPick, onRemove }: { uri?: string; onPick: () => void; onRemove: () => void }) {
  return (
    <Card style={{ gap: 9 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <AppText style={{ fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" }}>PHOTO ATTACHMENT</AppText>
        <Button title={uri ? "Change photo" : "Add photo"} compact variant="light" onPress={onPick} />
      </View>
      {uri ? (
        <View>
          <Image source={{ uri }} resizeMode="cover" style={{ width: "100%", height: 170, borderRadius: 12 }} />
          <Button title="Remove photo" compact variant="outline" onPress={onRemove} style={{ marginTop: 8, alignSelf: "flex-start" }} />
        </View>
      ) : <AppText muted style={{ fontSize: 11 }}>Attach a visual memory to this entry.</AppText>}
    </Card>
  );
}

function ChecklistEditor({ items, onChange }: { items: ChecklistItem[]; onChange: (items: ChecklistItem[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    if (!draft.trim()) return;
    onChange([...items, { id: createId("check"), text: draft.trim(), completed: false }]);
    setDraft("");
  };
  return (
    <Card style={{ gap: 9 }}>
      <AppText style={{ fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" }}>CHECKLIST</AppText>
      {items.map((item) => (
        <View key={item.id} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable onPress={() => onChange(items.map((x) => x.id === item.id ? { ...x, completed: !x.completed } : x))} style={{ width: 23, height: 23, borderRadius: 7, borderWidth: 1, borderColor: item.completed ? C.green : C.line, backgroundColor: item.completed ? "#E5EFE1" : C.paper, alignItems: "center", justifyContent: "center" }}>
            {item.completed ? <Text style={{ color: C.green, fontWeight: "800" }}>✓</Text> : null}
          </Pressable>
          <AppText style={{ flex: 1, fontSize: 12, textDecorationLine: item.completed ? "line-through" : "none", color: item.completed ? C.muted : C.ink }}>{item.text}</AppText>
          <Pressable onPress={() => onChange(items.filter((x) => x.id !== item.id))}><AppText muted style={{ fontSize: 17 }}>×</AppText></Pressable>
        </View>
      ))}
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <TextInput value={draft} onChangeText={setDraft} onSubmitEditing={add} placeholder="Add a checklist item…" placeholderTextColor="#A99D8D" style={{ flex: 1, minHeight: 40, borderWidth: 1, borderColor: C.line, backgroundColor: "#F5F0E6", borderRadius: 10, paddingHorizontal: 11, fontSize: 12, color: C.ink }} />
        <Button title="Add" compact onPress={add} disabled={!draft.trim()} />
      </View>
    </Card>
  );
}

export function NoteEditorSheet({
  visible,
  note,
  uid,
  onClose,
  onSave,
  onDelete,
}: {
  visible: boolean;
  note: Note | null;
  uid: string;
  onClose: () => void;
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Writing");
  const [tags, setTags] = useState("");
  const [color, setColor] = useState<NoteColor>("parchment");
  const [pinned, setPinned] = useState(false);
  const [archived, setArchived] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setCategory(note?.category || "Writing");
    setTags((note?.tags || []).join(", "));
    setColor(note?.color || "parchment");
    setPinned(!!note?.isPinned);
    setArchived(!!note?.isArchived);
    setThumbnailUrl(note?.thumbnailUrl);
    setChecklist(note?.checklist || []);
    setPreview(false);
  }, [note, visible]);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo access needed", "Allow Papyrus to access selected photos in Android settings.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.82 });
    if (result.canceled || !result.assets[0]) return;
    const localUri = result.assets[0].uri;
    setUploading(true);
    try {
      const remote = await uploadMedia(uid, localUri, `note-${note?.id || Date.now()}.jpg`, "image/jpeg");
      setThumbnailUrl(remote);
    } catch {
      setThumbnailUrl(localUri);
      Alert.alert("Saved on this device", "The image could not be uploaded. It will remain available on this device until cloud storage is configured.");
    } finally {
      setUploading(false);
    }
  };

  const save = () => {
    if (!title.trim()) {
      Alert.alert("A title is required", "Give this note a short title before saving.");
      return;
    }
    const now = Date.now();
    onSave({
      id: note?.id || createId("note"),
      title: title.trim(),
      content,
      category,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      color,
      isPinned: pinned,
      isArchived: archived,
      checklist,
      thumbnailUrl,
      thumbnailAspectRatio: note?.thumbnailAspectRatio,
      createdAt: note?.createdAt || now,
      updatedAt: now,
    });
    onClose();
  };

  return (
    <SheetFrame visible={visible} title={note ? "Edit note" : "New note"} subtitle="Markdown, tags, checklist and paper themes" onClose={onClose}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 13, paddingBottom: 40 }}>
        <Field label="Title" value={title} onChangeText={setTitle} placeholder="A thought worth keeping…" />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>CATEGORY</AppText>
            <View style={{ backgroundColor: "#F5F0E6", borderColor: C.line, borderWidth: 1, borderRadius: 10, marginTop: 6 }}>
              <Picker selectedValue={category} onValueChange={setCategory} style={{ height: 45 }}>
                {categories.map((item) => <Picker.Item key={item} label={item} value={item} />)}
              </Picker>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Field label="Tags (comma separated)" value={tags} onChangeText={setTags} placeholder="ideas, reading" />
          </View>
        </View>
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>NOTE CONTENT · MARKDOWN</AppText>
            <Pill label={preview ? "Edit" : "Preview"} selected onPress={() => setPreview(!preview)} />
          </View>
          {preview ? (
            <View style={{ minHeight: 175, borderRadius: 12, borderWidth: 1, borderColor: C.line, backgroundColor: "#F5F0E6", padding: 12 }}>
              {content.trim() ? <Markdown style={{ body: { color: C.ink, fontSize: 12, lineHeight: 20 }, heading1: { color: C.ink, fontFamily: "Newsreader_600SemiBold" }, heading2: { color: C.ink, fontFamily: "Newsreader_600SemiBold" }, link: { color: C.blue } }}>{content}</Markdown> : <AppText muted>Nothing to preview yet.</AppText>}
            </View>
          ) : <Field label="Write" value={content} onChangeText={setContent} placeholder="Write in Markdown…&#10;&#10;# Heading&#10;- A thought" multiline numberOfLines={8} />}
        </View>
        <View style={{ gap: 8 }}>
          <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>PAPER COLOR</AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {palette.map((key) => <Pressable key={key} onPress={() => setColor(key)} style={{ backgroundColor: NOTE_COLORS[key].hex, borderRadius: 11, borderWidth: color === key ? 2 : 1, borderColor: color === key ? C.brown : C.line, paddingHorizontal: 10, paddingVertical: 8 }}><AppText style={{ fontSize: 10 }}>{NOTE_COLORS[key].name}</AppText></Pressable>)}
          </View>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 9 }}>
          <Pill label={pinned ? "★ Pinned" : "☆ Pin note"} selected={pinned} onPress={() => setPinned(!pinned)} />
          <Pill label={archived ? "In archive" : "Move to archive"} selected={archived} onPress={() => setArchived(!archived)} />
        </View>
        <ChecklistEditor items={checklist} onChange={setChecklist} />
        <ImageAttachment uri={thumbnailUrl} onPick={pickPhoto} onRemove={() => setThumbnailUrl(undefined)} />
        {uploading ? <AppText muted style={{ fontSize: 10 }}>Uploading photo to your private vault…</AppText> : null}
        <Button title={note ? "Save changes" : "Create note"} onPress={save} disabled={uploading || !title.trim()} />
        {note ? <Button title="Delete note" variant="danger" onPress={() => Alert.alert("Delete note?", "This cannot be undone.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => { onDelete(note.id); onClose(); } }])} /> : null}
      </ScrollView>
    </SheetFrame>
  );
}

export function TaskEditorSheet({
  visible,
  task,
  onClose,
  onSave,
  onDelete,
}: {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!visible) return;
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setCategory(task?.category || "Work");
    setPriority(task?.priority || "medium");
    setDueDate(task?.dueDate || localToday());
  }, [task, visible]);

  const save = () => {
    if (!title.trim()) return Alert.alert("A title is required", "Enter what needs to be done.");
    const now = Date.now();
    onSave({
      id: task?.id || createId("task"),
      title: title.trim(),
      description,
      completed: task?.completed || false,
      priority,
      dueDate: dueDate.trim() || undefined,
      category,
      tags: task?.tags || [category.toLowerCase()],
      createdAt: task?.createdAt || now,
      completedAt: task?.completedAt,
    });
    onClose();
  };

  return (
    <SheetFrame visible={visible} title={task ? "Edit task" : "New task"} subtitle="Choose a priority and a date to keep the day intentional" onClose={onClose}>
      <ScrollView contentContainerStyle={{ padding: 17, gap: 14, paddingBottom: 40 }}>
        <Field label="Task" value={title} onChangeText={setTitle} placeholder="What needs to be done?" />
        <Field label="Description" value={description} onChangeText={setDescription} multiline placeholder="Optional details…" />
        <View style={{ gap: 8 }}>
          <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>PRIORITY</AppText>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {(["low", "medium", "high"] as TaskPriority[]).map((value) => <Pill key={value} label={value.toUpperCase()} selected={priority === value} onPress={() => setPriority(value)} />)}
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Field label="Due date (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} placeholder="2026-10-31" />
          </View>
          <View style={{ flex: 1 }}>
            <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>CATEGORY</AppText>
            <View style={{ backgroundColor: "#F5F0E6", borderColor: C.line, borderWidth: 1, borderRadius: 10, marginTop: 6 }}>
              <Picker selectedValue={category} onValueChange={setCategory} style={{ height: 45 }}>
                {categories.map((item) => <Picker.Item key={item} label={item} value={item} />)}
              </Picker>
            </View>
          </View>
        </View>
        <Button title={task ? "Save task" : "Add task"} onPress={save} disabled={!title.trim()} />
        {task ? <Button title="Delete task" variant="danger" onPress={() => Alert.alert("Delete task?", "This cannot be undone.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => { onDelete(task.id); onClose(); } }])} /> : null}
      </ScrollView>
    </SheetFrame>
  );
}

export function JournalEditorSheet({
  visible,
  entry,
  uid,
  onClose,
  onSave,
  onDelete,
}: {
  visible: boolean;
  entry: JournalEntry | null;
  uid: string;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}) {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<JournalMood>("peaceful");
  const [tags, setTags] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>();
  const [audioRecording, setAudioRecording] = useState<JournalEntry["audioRecording"]>();
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const recorder = useAudioRecorder({ ...RecordingPresets.HIGH_QUALITY, directory: "document" });
  const recorderState = useAudioRecorderState(recorder);
  const player = useAudioPlayer(audioRecording?.audioDataUrl || null);

  useEffect(() => {
    if (!visible) return;
    setDate(entry?.date || localToday());
    setTitle(entry?.title || "");
    setContent(entry?.content || "");
    setMood(entry?.mood || "peaceful");
    setTags((entry?.tags || []).join(", "));
    setThumbnailUrl(entry?.thumbnailUrl);
    setAudioRecording(entry?.audioRecording);
    setVoiceTranscript(entry?.voiceTranscript || "");
    setChecklist(entry?.checklist || []);
  }, [entry, visible]);

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Photo access needed", "Allow photo access to attach an image.");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.82 });
    if (result.canceled || !result.assets[0]) return;
    const localUri = result.assets[0].uri;
    setUploading(true);
    try {
      const remote = await uploadMedia(uid, localUri, `journal-${entry?.id || Date.now()}.jpg`, "image/jpeg");
      setThumbnailUrl(remote);
    } catch {
      setThumbnailUrl(localUri);
      Alert.alert("Saved on this device", "The photo could not be uploaded and is stored locally on this device.");
    } finally {
      setUploading(false);
    }
  };

  const toggleRecording = async () => {
    try {
      if (recorderState.isRecording) {
        await recorder.stop();
        const uri = recorder.uri;
        if (uri) {
          setUploading(true);
          try {
            const remote = await uploadMedia(uid, uri, `journal-audio-${Date.now()}.m4a`, "audio/mp4");
            setAudioRecording({ audioDataUrl: remote, durationSeconds: Math.max(1, Math.round(recorderState.durationMillis / 1000)), recordedAt: Date.now() });
          } catch {
            setAudioRecording({ audioDataUrl: uri, durationSeconds: Math.max(1, Math.round(recorderState.durationMillis / 1000)), recordedAt: Date.now() });
            Alert.alert("Recording saved locally", "Cloud upload failed; this recording is stored on this device only.");
          } finally {
            setUploading(false);
          }
        }
        return;
      }
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) return Alert.alert("Microphone access needed", "Allow microphone access to record a journal voice note.");
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (error) {
      Alert.alert("Audio unavailable", error instanceof Error ? error.message : "Unable to start recording.");
    }
  };

  const save = () => {
    if (!title.trim()) return Alert.alert("A title is required", "Give this journal entry a title.");
    const now = Date.now();
    onSave({
      id: entry?.id || createId("journal"),
      date: date.trim() || localToday(),
      title: title.trim(),
      content,
      mood,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      color: entry?.color || "parchment",
      thumbnailUrl,
      thumbnailAspectRatio: entry?.thumbnailAspectRatio,
      audioRecording,
      voiceTranscript,
      checklist,
      createdAt: entry?.createdAt || now,
      updatedAt: now,
    });
    onClose();
  };

  const selectedMood = moods.find((item) => item.id === mood)!;

  return (
    <SheetFrame visible={visible} title={entry ? "Edit journal" : "Daily journal"} subtitle="A private page for the small details of the day" onClose={onClose}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 13, paddingBottom: 42 }}>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}><Field label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} placeholder="2026-10-31" /></View>
          <View style={{ flex: 1 }}><Field label="Title" value={title} onChangeText={setTitle} placeholder="A day worth remembering…" /></View>
        </View>
        <Card style={{ gap: 10 }}>
          <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>HOW ARE YOU FEELING?</AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
            {moods.map((item) => <Pill key={item.id} label={`${item.emoji} ${item.label}`} selected={mood === item.id} onPress={() => setMood(item.id)} />)}
          </View>
          <AppText muted style={{ fontSize: 10 }}>{JOURNAL_MOODS[mood].tagline}</AppText>
        </Card>
        <Field label="Reflection" value={content} onChangeText={setContent} placeholder="What happened today? What did you notice, learn, or appreciate?" multiline numberOfLines={9} />
        <Field label="Voice transcript" value={voiceTranscript} onChangeText={setVoiceTranscript} placeholder="Optional transcript or dictated thoughts…" multiline numberOfLines={3} />
        <Field label="Tags (comma separated)" value={tags} onChangeText={setTags} placeholder="gratitude, work, family" />
        <Card style={{ gap: 9 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" }}>VOICE RECORDING</AppText>
              <AppText muted style={{ fontSize: 10, marginTop: 3 }}>{recorderState.isRecording ? "Recording in progress…" : audioRecording ? `${audioRecording.durationSeconds}s recorded` : "Add an audio memory to this entry"}</AppText>
            </View>
            <Button compact title={recorderState.isRecording ? "Stop" : audioRecording ? "Record again" : "Record"} variant={recorderState.isRecording ? "danger" : "dark"} onPress={toggleRecording} />
          </View>
          {audioRecording?.audioDataUrl && !recorderState.isRecording ? <Button title="Play recording" compact variant="light" onPress={() => player.play()} /> : null}
          {uploading ? <AppText muted style={{ fontSize: 10 }}>Uploading attachment…</AppText> : null}
        </Card>
        <ChecklistEditor items={checklist} onChange={setChecklist} />
        <ImageAttachment uri={thumbnailUrl} onPick={pickPhoto} onRemove={() => setThumbnailUrl(undefined)} />
        <Button title={entry ? "Save journal entry" : "Save journal"} onPress={save} disabled={uploading || recorderState.isRecording || !title.trim()} />
        {entry ? <Button title="Delete journal entry" variant="danger" onPress={() => Alert.alert("Delete entry?", "This cannot be undone.", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => { onDelete(entry.id); onClose(); } }])} /> : null}
      </ScrollView>
    </SheetFrame>
  );
}

export function QuickCaptureSheet({
  visible,
  onClose,
  onCreateNote,
  onCreateTask,
}: {
  visible: boolean;
  onClose: () => void;
  onCreateNote: (title: string, content: string) => void;
  onCreateTask: (title: string) => void;
}) {
  const [mode, setMode] = useState<"note" | "task">("note");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  useEffect(() => {
    if (!visible) { setTitle(""); setBody(""); setMode("note"); }
  }, [visible]);
  const submit = () => {
    if (!title.trim()) return;
    if (mode === "note") onCreateNote(title.trim(), body);
    else onCreateTask(title.trim());
    onClose();
  };
  return (
    <SheetFrame visible={visible} title="Quick capture" subtitle="Catch the thought before it disappears" onClose={onClose}>
      <ScrollView contentContainerStyle={{ padding: 18, gap: 14 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pill label="✎ Note" selected={mode === "note"} onPress={() => setMode("note")} />
          <Pill label="☑ Task" selected={mode === "task"} onPress={() => setMode("task")} />
        </View>
        <Field label={mode === "note" ? "Note title" : "Task title"} value={title} onChangeText={setTitle} placeholder={mode === "note" ? "A thought worth keeping…" : "What needs to be done?"} />
        {mode === "note" ? <Field label="Thought" value={body} onChangeText={setBody} placeholder="Write a few lines…" multiline /> : null}
        <Button title={mode === "note" ? "Save note" : "Add task"} onPress={submit} disabled={!title.trim()} />
      </ScrollView>
    </SheetFrame>
  );
}
