export type NoteColor = 'parchment' | 'linen' | 'cream' | 'sage' | 'sand' | 'rose' | 'slate';

export type ImageAspectRatio = '16:9' | '4:3' | '1:1' | '3:4' | '21:9';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}
export interface Crypto{
  name: string, 
  textAddress: string, 
  qrCodeSRC:string, 
  icon:string
}
export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  color: NoteColor;
  isPinned: boolean;
  isArchived?: boolean;
  checklist?: ChecklistItem[];
  thumbnailUrl?: string;
  thumbnailAspectRatio?: ImageAspectRatio;
  createdAt: number;
  updatedAt: number;
}

// ==========================================
// JOURNAL TYPES & MOODS
// ==========================================

export type JournalMood = 
  | 'radiant'     // ☀️ Radiant & Joyful
  | 'peaceful'    // 🌿 Peaceful & Calm
  | 'motivated'   // ⚡ Motivated & Energized
  | 'focused'     // 🧠 Deeply Focused
  | 'reflective'  // ☕ Reflective & Grounded
  | 'melancholy'  // 🌧️ Melancholy & Quiet
  | 'anxious'     // 🌪️ Stressed & Anxious
  | 'weary'      // 😴 Weary & Resting
  | 'angry'     // 😴 Weary & Resting
  | 'happy'     // 😴 Weary & Resting
  | 'notwell';      // 😴 Weary & Resting

export interface JournalAudioRecording {
  audioDataUrl?: string;
  durationSeconds: number;
  recordedAt: number;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: JournalMood;
  tags: string[];
  color: NoteColor;
  thumbnailUrl?: string;
  thumbnailAspectRatio?: ImageAspectRatio;
  audioRecording?: JournalAudioRecording;
  voiceTranscript?: string;
  checklist?: ChecklistItem[];
  createdAt: number;
  updatedAt: number;
}

export interface MoodConfig {
  id: JournalMood;
  label: string;
  tagline: string;
  emoji: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
  accentColor: string;
}

export const JOURNAL_MOODS: Record<JournalMood, MoodConfig> = {
  radiant: {
    id: 'radiant',
    label: 'Radiant',
    tagline: 'Joyful, vibrant & inspired',
    emoji: '/moods/Radiant.svg',
    bgClass: 'bg-[#FEFCE8]',
    borderClass: 'border-[#FDE047]',
    textClass: 'text-[#854D0E]',
    badgeClass: 'bg-[#FEF08A] text-[#713F12] border-[#FACC15]',
    accentColor: '#EAB308',
  },
  peaceful: {
    id: 'peaceful',
    label: 'Peaceful',
    tagline: 'Calm, balanced & serene',
    emoji: '/moods/Peaceful.svg',
    bgClass: 'bg-[#F0FDF4]',
    borderClass: 'border-[#BBF7D0]',
    textClass: 'text-[#166534]',
    badgeClass: 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]',
    accentColor: '#22C55E',
  },
  motivated: {
    id: 'motivated',
    label: 'Motivated',
    tagline: 'Energized & driven to create',
    emoji: '/moods/Motivated.svg',
    bgClass: 'bg-[#FFFBEB]',
    borderClass: 'border-[#FDE68A]',
    textClass: 'text-[#92400E]',
    badgeClass: 'bg-[#FEF3C7] text-[#78350F] border-[#FCD34D]',
    accentColor: '#F59E0B',
  },
  focused: {
    id: 'focused',
    label: 'Deep Focus',
    tagline: 'In the flow & clear-minded',
    emoji: '/moods/Deep-Focus.svg',
    bgClass: 'bg-[#F0F9FF]',
    borderClass: 'border-[#BAE6FD]',
    textClass: 'text-[#075985]',
    badgeClass: 'bg-[#E0F2FE] text-[#0C4A6E] border-[#7DD3FC]',
    accentColor: '#0EA5E9',
  },
  reflective: {
    id: 'reflective',
    label: 'Reflective',
    tagline: 'Thoughtful, observing & introspective',
    emoji:'/moods/Reflective.svg',
    bgClass: 'bg-[#FAF6EE]',
    borderClass: 'border-[#E6DEC9]',
    textClass: 'text-[#5C4A38]',
    badgeClass: 'bg-[#EFE7D8] text-[#4A3B2C] border-[#D6C7AE]',
    accentColor: '#B08D57',
  },
  melancholy: {
    id: 'melancholy',
    label: 'Melancholy',
    tagline: 'Quiet, gentle sorrow & low energy',
    emoji: '/moods/Melancholy.svg',
    bgClass: 'bg-[#F1F5F9]',
    borderClass: 'border-[#CBD5E1]',
    textClass: 'text-[#334155]',
    badgeClass: 'bg-[#E2E8F0] text-[#1E293B] border-[#94A3B8]',
    accentColor: '#64748B',
  },
  anxious: {
    id: 'anxious',
    label: 'Restless',
    tagline: 'Overwhelmed or processing worries',
    emoji: '/moods/Restless.svg',
    bgClass: 'bg-[#FFF7ED]',
    borderClass: 'border-[#FED7AA]',
    textClass: 'text-[#9A3412]',
    badgeClass: 'bg-[#FFEDD5] text-[#7C2D12] border-[#FDBA74]',
    accentColor: '#EA580C',
  },
  weary: {
    id: 'weary',
    label: 'Weary',
    tagline: 'Fatigued, seeking solace and rest',
    emoji: '/moods/Weary.svg',
    bgClass: 'bg-[#FAF5FF]',
    borderClass: 'border-[#E9D5FF]',
    textClass: 'text-[#6B21A8]',
    badgeClass: 'bg-[#F3E8FF] text-[#581C87] border-[#D8B4FE]',
    accentColor: '#A855F7',
  },
  happy: {
    id: 'happy',
    label: 'happy',
    tagline: '',
    emoji: '/moods/happy.svg',
    bgClass: 'bg-[#376FD0]/70',
    borderClass: 'border-[#376FD0]',
    textClass: 'text-[#6B21A8]',
    badgeClass: 'bg-[#376FD0]/70 text-[#376FD0] border-[#376FD0]',
    accentColor: '#376FD0',
  },
  angry: {
    id: 'angry',
    label: 'angry',
    tagline: '',
    emoji: '/moods/Angry.svg',
    bgClass: 'bg-[#8b2237]/90',
    borderClass: 'border-[#8b2237]',
    textClass: 'text-[#6B21A8]',
    badgeClass: 'bg-[#8b2237]/70 text-[#8b2237] border-[#8b2237]',
    accentColor: '#8b2237',
  },
  notwell: {
    id: 'notwell',
    label: 'notwell',
    tagline: '',
    emoji: '/moods/Not-Well.svg',
    bgClass: 'bg-[#53505A]/90',
    borderClass: 'border-[#53505A]',
    textClass: 'text-[#53505A]',
    badgeClass: 'bg-[#53505A]/70 text-[#53505A] border-[#53505A]',
    accentColor: '#53505A',
  },
};

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  category: string;
  tags: string[];
  createdAt: number;
  completedAt?: number;
}

export interface NoteTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
  content: string;
  color: NoteColor;
}

export type ViewMode = 'dashboard' | 'journal' | 'notes' | 'tasks' | 'pomodoro' | 'character';

export interface NoteColorConfig {
  id: NoteColor;
  name: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  accentClass: string;
  hex: string;
}

export const NOTE_COLORS: Record<NoteColor, NoteColorConfig> = {
  parchment: {
    id: 'parchment',
    name: 'Parchment',
    bgClass: 'bg-[#FAF6EE]',
    borderClass: 'border-[#E6DEC9]',
    badgeClass: 'bg-[#ECE3D0] text-[#635545]',
    accentClass: 'bg-[#B08D57]',
    hex: '#FAF6EE',
  },
  linen: {
    id: 'linen',
    name: 'Natural Linen',
    bgClass: 'bg-[#F5F2EB]',
    borderClass: 'border-[#DFD9CE]',
    badgeClass: 'bg-[#E5DFD4] text-[#5C5549]',
    accentClass: 'bg-[#8C7A68]',
    hex: '#F5F2EB',
  },
  cream: {
    id: 'cream',
    name: 'Aged Cream',
    bgClass: 'bg-[#FCF9F0]',
    borderClass: 'border-[#EFE7D0]',
    badgeClass: 'bg-[#F2E8CD] text-[#705F39]',
    accentClass: 'bg-[#C29D38]',
    hex: '#FCF9F0',
  },
  sage: {
    id: 'sage',
    name: 'Herbal Sage',
    bgClass: 'bg-[#F2F6F1]',
    borderClass: 'border-[#D5E1D4]',
    badgeClass: 'bg-[#DCE6DB] text-[#4A6347]',
    accentClass: 'bg-[#5B8258]',
    hex: '#F2F6F1',
  },
  sand: {
    id: 'sand',
    name: 'Desert Sand',
    bgClass: 'bg-[#F7F3E9]',
    borderClass: 'border-[#E4DCCB]',
    badgeClass: 'bg-[#EAE1CE] text-[#695D47]',
    accentClass: 'bg-[#A3895B]',
    hex: '#F7F3E9',
  },
  rose: {
    id: 'rose',
    name: 'Dusty Petal',
    bgClass: 'bg-[#FAF3F2]',
    borderClass: 'border-[#EADBD9]',
    badgeClass: 'bg-[#EEDCDA] text-[#754E4B]',
    accentClass: 'bg-[#B5736E]',
    hex: '#FAF3F2',
  },
  slate: {
    id: 'slate',
    name: 'Misty Slate',
    bgClass: 'bg-[#F0F3F5]',
    borderClass: 'border-[#D4DDE3]',
    badgeClass: 'bg-[#DCE3E8] text-[#455A64]',
    accentClass: 'bg-[#607D8B]',
    hex: '#F0F3F5',
  },
};

// ==========================================
// USER AVATAR & PROFILE TYPES
// ==========================================

export interface UserProfile {
  name: string;
  avatarId: string; // ID of selected pixel avatar from PIXEL_AVATARS
  selectedSceneId?: string; // ID of active atmospheric pixel art scene from PIXEL_SCENES
  totalFocusMinutes: number;
  completedPomodoros: number;
  statusText?: string;
  // Optional legacy fields for backward-compatibility with saved data
  level?: number;
  focusExp?: number;
  characterClass?: string;
  equipment?: {
    weapon?: string;
    weaponDesc?: string;
    relic?: string;
    relicDesc?: string;
  };
}

// Backward-compatibility alias
export type CharacterProfile = UserProfile;

// ==========================================
// POMODORO CLOCK TYPES
// ==========================================

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  workDurationMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
}
