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
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { ChecklistItem, ImageAspectRatio, JournalEntry, JournalMood, Note, NoteColor, Task, TaskPriority } from "../../src/types";
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

const ASPECT_CHOICES: { id: ImageAspectRatio; description: string }[] = [
  { id: "16:9", description: "Widescreen" },
  { id: "4:3", description: "Classic" },
  { id: "1:1", description: "Square" },
  { id: "3:4", description: "Portrait" },
  { id: "21:9", description: "Panorama" },
];
const COVER_PRESETS = [
  { title: "Autumn Rain & Tea", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", category: "Nature" },
  { title: "Vintage Writing Desk", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80", category: "Work" },
  { title: "Quiet Pine Forest", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80", category: "Forest" },
  { title: "Antique Books & Candle", url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80", category: "Books" },
  { title: "Morning Fog in Valley", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80", category: "Mountains" },
  { title: "Cozy Coffee & Notebook", url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80", category: "Cafe" },
];
const aspectValue = (ratio: ImageAspectRatio) => {
  const [width, height] = ratio.split(":").map(Number);
  return width / height;
};

function ImageAttachment({
  uri,
  aspectRatio,
  onPick,
  onRemove,
  onRatioChange,
  onUseUrl,
}: {
  uri?: string;
  aspectRatio: ImageAspectRatio;
  onPick: () => void;
  onRemove: () => void;
  onRatioChange: (ratio: ImageAspectRatio) => void;
  onUseUrl: (url: string) => void;
}) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [url, setUrl] = useState("");
  return (
    <Card style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <AppText style={{ fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" }}>COVER / THUMBNAIL PHOTO</AppText>
          <AppText muted style={{ fontSize: 9, marginTop: 3 }}>Choose a cover, use a web image or upload from the device</AppText>
        </View>
        <Button title={optionsOpen ? "Done" : uri ? "Change" : "Add cover"} compact variant="light" onPress={() => setOptionsOpen(!optionsOpen)} />
      </View>
      {uri ? (
        <View style={{ gap: 9 }}>
          <Image source={{ uri }} resizeMode="cover" style={{ width: "100%", aspectRatio: aspectValue(aspectRatio), borderRadius: 12, backgroundColor: C.paper2 }} />
          <View style={{ gap: 7 }}>
            <AppText muted style={{ fontSize: 9 }}>ASPECT RATIO</AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {ASPECT_CHOICES.map((item) => (
                <Pill key={item.id} label={item.id} selected={aspectRatio === item.id} onPress={() => onRatioChange(item.id)} />
              ))}
            </View>
          </View>
          <Button title="Remove cover photo" compact variant="outline" onPress={onRemove} style={{ alignSelf: "flex-start" }} />
        </View>
      ) : <AppText muted style={{ fontSize: 11 }}>No cover photo selected yet.</AppText>}
      {optionsOpen ? (
        <View style={{ gap: 10, borderTopWidth: 1, borderTopColor: C.line, paddingTop: 11 }}>
          <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>PREFERRED ASPECT RATIO</AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {ASPECT_CHOICES.map((item) => <Pill key={item.id} label={item.id} selected={aspectRatio === item.id} onPress={() => onRatioChange(item.id)} />)}
          </View>
          <Button title="Choose from photo library" compact onPress={onPick} />
          <View style={{ gap: 7 }}>
            <Field label="Image web URL" value={url} onChangeText={setUrl} placeholder="https://example.com/photo.jpg" />
            <Button title="Apply image URL" compact variant="light" disabled={!/^https?:\/\//i.test(url.trim())} onPress={() => { onUseUrl(url.trim()); setUrl(""); setOptionsOpen(false); }} />
          </View>
          <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>CURATED PRESETS</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {COVER_PRESETS.map((preset) => (
              <Pressable key={preset.url} onPress={() => { onUseUrl(preset.url); setOptionsOpen(false); }} style={{ width: 135, borderRadius: 11, overflow: "hidden", borderWidth: 1, borderColor: C.line, backgroundColor: C.paper2 }}>
                <Image source={{ uri: preset.url }} style={{ width: 135, height: 76 }} resizeMode="cover" />
                <View style={{ padding: 7 }}>
                  <AppText style={{ fontSize: 9, fontFamily: "PlusJakartaSans_700Bold" }} numberOfLines={1}>{preset.title}</AppText>
                  <AppText muted style={{ fontSize: 8 }}>{preset.category}</AppText>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </Card>
  );
}

const INLINE_PHOTO_PRESETS = [
  { title: "Bridge", url: "https://raw.githubusercontent.com/hoseinshooshi/Papyrus_note_android/main/public/Preset/bridge.jpg" },
  { title: "Field", url: "https://raw.githubusercontent.com/hoseinshooshi/Papyrus_note_android/main/public/Preset/field.jpg" },
  { title: "Forest", url: "https://raw.githubusercontent.com/hoseinshooshi/Papyrus_note_android/main/public/Preset/forest.jpg" },
  { title: "Forest 2", url: "https://raw.githubusercontent.com/hoseinshooshi/Papyrus_note_android/main/public/Preset/forest_1.jpg" },
  { title: "Lake", url: "https://raw.githubusercontent.com/hoseinshooshi/Papyrus_note_android/main/public/Preset/lake.jpg" },
  { title: "River", url: "https://raw.githubusercontent.com/hoseinshooshi/Papyrus_note_android/main/public/Preset/river.jpg" },
  { title: "Street", url: "https://raw.githubusercontent.com/hoseinshooshi/Papyrus_note_android/main/public/Preset/street.jpg" },
  { title: "Village", url: "https://raw.githubusercontent.com/hoseinshooshi/Papyrus_note_android/main/public/Preset/village.jpg" },
];

function InlinePhotoComposer({
  visible,
  uid,
  prefix,
  onInsert,
}: {
  visible: boolean;
  uid: string;
  prefix: string;
  onInsert: (markdown: string) => void;
}) {
  const [tab, setTab] = useState<"presets" | "url" | "upload">("presets");
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!visible) return null;

  const pickUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Photo access needed", "Allow photo access to attach an image.");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.85 });
    if (result.canceled || !result.assets[0]) return;
    const localUri = result.assets[0].uri;
    setUploading(true);
    try {
      const remote = await uploadMedia(uid, localUri, `${prefix}-inline-${Date.now()}.jpg`, result.assets[0].mimeType || "image/jpeg");
      setPreviewUrl(remote);
    } catch {
      setPreviewUrl(localUri);
      Alert.alert("Saved on this device", "Cloud upload failed; the local image URI will only work on this device.");
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    const finalUrl = previewUrl || (tab === "url" ? url.trim() : "");
    if (!finalUrl) return Alert.alert("Choose an image", "Select a preset, upload a photo or enter a valid image URL.");
    if (!finalUrl.startsWith("https://") && !finalUrl.startsWith("http://") && !finalUrl.startsWith("file://")) {
      return Alert.alert("Invalid image URL", "Use an http(s) image URL or upload a photo from this device.");
    }
    onInsert(`\n\n![${caption.trim()}](${finalUrl})\n\n`);
    setPreviewUrl("");
    setUrl("");
    setCaption("");
    setTab("presets");
  };

  return (
    <Card style={{ gap: 9 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>INSERT PHOTO IN TEXT</AppText>
        <View style={{ flexDirection: "row", gap: 6 }}>
          <Pill label="Presets" selected={tab === "presets"} onPress={() => setTab("presets")} />
          <Pill label="Web URL" selected={tab === "url"} onPress={() => setTab("url")} />
          <Pill label="Upload" selected={tab === "upload"} onPress={() => setTab("upload")} />
        </View>
      </View>
      {tab === "presets" ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 7 }}>
          {INLINE_PHOTO_PRESETS.map((item) => (
            <Pressable key={item.url} onPress={() => { setPreviewUrl(item.url); setCaption(item.title); }} style={{ width: "23%", gap: 3 }}>
              <Image source={{ uri: item.url }} style={{ width: "100%", height: 55, borderRadius: 7, borderWidth: previewUrl === item.url ? 2 : 1, borderColor: previewUrl === item.url ? C.gold : C.line }} resizeMode="cover" />
              <AppText muted style={{ fontSize: 8 }} numberOfLines={1}>{item.title}</AppText>
            </Pressable>
          ))}
        </View>
      ) : null}
      {tab === "url" ? <Field label="Image web URL" value={url} onChangeText={(value) => { setUrl(value); setPreviewUrl(""); }} placeholder="https://example.com/image.jpg" /> : null}
      {tab === "upload" ? (
        <View style={{ gap: 8 }}>
          <Button title={uploading ? "Uploading…" : "Choose image from device"} compact disabled={uploading} onPress={pickUpload} />
          {previewUrl ? <Image source={{ uri: previewUrl }} style={{ width: "100%", height: 130, borderRadius: 10 }} resizeMode="cover" /> : null}
        </View>
      ) : null}
      {tab !== "upload" && previewUrl ? <Image source={{ uri: previewUrl }} style={{ width: "100%", height: 130, borderRadius: 10 }} resizeMode="cover" /> : null}
      <Field label="Photo caption (optional)" value={caption} onChangeText={setCaption} placeholder="A note about this picture…" />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button title="Insert Markdown image" compact disabled={uploading || (tab === "url" && !url.trim()) || (tab === "presets" && !previewUrl)} onPress={submit} />
      </View>
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
  const [thumbnailAspectRatio, setThumbnailAspectRatio] = useState<ImageAspectRatio>("16:9");
  const [showInlinePhoto, setShowInlinePhoto] = useState(false);
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
    setThumbnailAspectRatio(note?.thumbnailAspectRatio || "16:9");
    setShowInlinePhoto(false);
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
      thumbnailAspectRatio,
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
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Pill label="Insert photo" onPress={() => setShowInlinePhoto(!showInlinePhoto)} selected={showInlinePhoto} />
              <Pill label={preview ? "Edit" : "Preview"} selected onPress={() => setPreview(!preview)} />
            </View>
          </View>
          <InlinePhotoComposer visible={showInlinePhoto} uid={uid} prefix="note" onInsert={(markdown) => setContent((current) => current + markdown)} />
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
        <ImageAttachment
          uri={thumbnailUrl}
          aspectRatio={thumbnailAspectRatio}
          onPick={pickPhoto}
          onRemove={() => setThumbnailUrl(undefined)}
          onRatioChange={setThumbnailAspectRatio}
          onUseUrl={setThumbnailUrl}
        />
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
  const [thumbnailAspectRatio, setThumbnailAspectRatio] = useState<ImageAspectRatio>("16:9");
  const [showInlinePhoto, setShowInlinePhoto] = useState(false);
  const [audioRecording, setAudioRecording] = useState<JournalEntry["audioRecording"]>();
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [dictationLanguage, setDictationLanguage] = useState<"en-US" | "fa-IR">("en-US");
  const [dictationActive, setDictationActive] = useState(false);
  const [dictationPartial, setDictationPartial] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [uploading, setUploading] = useState(false);
  useSpeechRecognitionEvent("start", () => {
    setDictationActive(true);
    setDictationPartial("");
  });
  useSpeechRecognitionEvent("end", () => {
    setDictationActive(false);
    setDictationPartial("");
  });
  useSpeechRecognitionEvent("result", (event) => {
    const transcript = event.results?.[0]?.transcript?.trim() || "";
    if (!transcript) return;
    if (event.isFinal) {
      setVoiceTranscript((current) => [current.trim(), transcript].filter(Boolean).join(" "));
      setDictationPartial("");
    } else {
      setDictationPartial(transcript);
    }
  });
  useSpeechRecognitionEvent("error", (event) => {
    setDictationActive(false);
    setDictationPartial("");
    Alert.alert("Speech recognition unavailable", event.message || event.error || "Check the Android speech service and microphone permissions.");
  });

  useEffect(() => {
    if (!visible && dictationActive) ExpoSpeechRecognitionModule.abort();
  }, [visible, dictationActive]);

  useEffect(() => {
    return () => {
      ExpoSpeechRecognitionModule.abort();
    };
  }, []);

  const toggleDictation = async () => {
    if (dictationActive) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    if (recorderState.isRecording) {
      Alert.alert("Finish audio recording first", "Stop the voice recording before starting live dictation.");
      return;
    }
    if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
      Alert.alert("Speech service unavailable", "Install or enable an Android speech recognition service (for example, Google Speech Services) and try again.");
      return;
    }
    try {
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Allow microphone and speech recognition permissions to dictate journal text.");
        return;
      }
      ExpoSpeechRecognitionModule.start({
        lang: dictationLanguage,
        interimResults: true,
        continuous: false,
        maxAlternatives: 1,
      });
    } catch (error) {
      Alert.alert("Could not start dictation", error instanceof Error ? error.message : "Please try again.");
    }
  };

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
    setThumbnailAspectRatio(entry?.thumbnailAspectRatio || "16:9");
    setShowInlinePhoto(false);
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
      thumbnailAspectRatio,
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
        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>REFLECTION · MARKDOWN</AppText>
            <Pill label="Insert photo" selected={showInlinePhoto} onPress={() => setShowInlinePhoto(!showInlinePhoto)} />
          </View>
          <InlinePhotoComposer visible={showInlinePhoto} uid={uid} prefix="journal" onInsert={(markdown) => setContent((current) => current + markdown)} />
          <Field label="Reflection" value={content} onChangeText={setContent} placeholder="What happened today? What did you notice, learn, or appreciate?" multiline numberOfLines={9} />
        </View>
        <Card style={{ gap: 9 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontSize: 10, fontFamily: "PlusJakartaSans_700Bold" }}>LIVE SPEECH-TO-TEXT</AppText>
              <AppText muted style={{ fontSize: 9, marginTop: 3 }}>{dictationActive ? "Listening… speak naturally, then stop." : "Dictate a reflection directly into the journal."}</AppText>
            </View>
            <Button title={dictationActive ? "Stop dictation" : "Start dictation"} compact variant={dictationActive ? "danger" : "dark"} onPress={toggleDictation} disabled={recorderState.isRecording || uploading} />
          </View>
          <View style={{ flexDirection: "row", gap: 7 }}>
            <Pill label="English" selected={dictationLanguage === "en-US"} onPress={() => setDictationLanguage("en-US")} />
            <Pill label="فارسی" selected={dictationLanguage === "fa-IR"} onPress={() => setDictationLanguage("fa-IR")} />
          </View>
          {dictationPartial ? <AppText style={{ fontSize: 11, color: C.blue }}>…{dictationPartial}</AppText> : null}
          {dictationActive ? <AppText muted style={{ fontSize: 9 }}>Interim words appear here and are added when the speech service returns a final result.</AppText> : null}
        </Card>
        <Field label="Voice transcript" value={voiceTranscript} onChangeText={setVoiceTranscript} placeholder="Type or dictate journal thoughts…" multiline numberOfLines={4} />
        <Field label="Tags (comma separated)" value={tags} onChangeText={setTags} placeholder="gratitude, work, family" />
        <Card style={{ gap: 9 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontSize: 11, fontFamily: "PlusJakartaSans_700Bold" }}>VOICE RECORDING</AppText>
              <AppText muted style={{ fontSize: 10, marginTop: 3 }}>{recorderState.isRecording ? "Recording in progress…" : audioRecording ? `${audioRecording.durationSeconds}s recorded` : "Add an audio memory to this entry"}</AppText>
            </View>
            <Button compact title={recorderState.isRecording ? "Stop" : audioRecording ? "Record again" : "Record"} variant={recorderState.isRecording ? "danger" : "dark"} onPress={toggleRecording} disabled={dictationActive || uploading} />
          </View>
          {audioRecording?.audioDataUrl && !recorderState.isRecording ? <Button title="Play recording" compact variant="light" onPress={() => player.play()} /> : null}
          {uploading ? <AppText muted style={{ fontSize: 10 }}>Uploading attachment…</AppText> : null}
        </Card>
        <ChecklistEditor items={checklist} onChange={setChecklist} />
        <ImageAttachment
          uri={thumbnailUrl}
          aspectRatio={thumbnailAspectRatio}
          onPick={pickPhoto}
          onRemove={() => setThumbnailUrl(undefined)}
          onRatioChange={setThumbnailAspectRatio}
          onUseUrl={setThumbnailUrl}
        />
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
