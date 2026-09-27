import { Note, Task, JournalEntry } from '../types';

export const INITIAL_CATEGORIES = [
  'All',
  'Work',
  'Personal',
  'Writing',
  'Ideas',
  'Reading',
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-welcome',
    title: 'Welcome to Papyrus: The Art of Deliberate Thinking',
    content: `# Welcome to Papyrus 📜

A calm, tactile digital sanctuary for your thoughts, journal entries, and daily obligations.

### ✨ What makes Papyrus special:
- **Parchment Aesthetics**: Designed with warm, eye-friendly tones that evoke the tactile pleasure of real linen and archival paper.
- **Markdown & Checklists**: Full markdown formatting support, quotes, headers, and interactive checklists.
- **Quick Capture (Q)**: Tap **Q** or click **Quick Capture** at any time to instantly jot an idea or schedule a task without losing your flow.
- **Keyboard Friendly**: Press **?** or click **Shortcuts** to view all available hotkeys.
- **Private & Local-First**: Your notes never leave your browser unless you choose to export them.

> *"The palest ink is clearer than the best memory."* — Ancient Proverb

### 🚀 Getting Started
1. Click any note to edit or preview markdown.
2. Toggle between **Dashboard**, **Notes**, and **Tasks** using the navigation bar.
3. Try adding a new task with high priority or using one of the ready-made templates!
`,
    category: 'Writing',
    tags: ['welcome', 'guide', 'papyrus'],
    color: 'parchment',
    isPinned: true,
    checklist: [
      { id: 'c1', text: 'Explore the Notes and Tasks views', completed: true },
      { id: 'c2', text: 'Try pressing "Q" for Quick Capture', completed: false },
      { id: 'c3', text: 'Create your first custom note from a template', completed: false },
    ],
    createdAt: Date.now() - 3600000 * 24 * 2,
    updatedAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'note-architecture',
    title: 'Design System Principles: Warm Tactile Neutrals',
    content: `# Principles of the Papyrus Aesthetic

### 1. The Power of Warm Neutrals
Pure stark whites (#ffffff) and harsh terminal blacks strain the eyes over long writing stretches. Papyrus embraces 5% subtle amber/warm undertones:
- **Parchment**: Soft sunlit cotton paper
- **Linen**: Earthy, woven tactile feel
- **Herbal Sage**: Gentle botanic resting tone
- **Aged Cream**: Classic library manuscript warmth

### 2. Typographic Hierarchy
- **Headings**: Newsreader Serif — literary, poised, timeless
- **Body**: Plus Jakarta Sans — crisp, high legibility, comfortable rhythm
- **Accents**: Cinzel Roman — classical architectural precision

### 3. Deliberate Craftsmanship
No noisy gradients or distracting bells and whistles. Every pixel honors the writer's uninterrupted focus.
`,
    category: 'Ideas',
    tags: ['design', 'typography', 'system'],
    color: 'linen',
    isPinned: true,
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'note-reading-seneca',
    title: 'Notes on Seneca: On the Shortness of Life',
    content: `# Seneca: De Brevitate Vitae

**Subject:** Stoic Philosophy on Time & Attention

> *"It is not that we have a short time to live, but that we waste a lot of it. Life is long enough, and a sufficiently generous estimate has been given to us for the highest achievements if it were all well invested."*

### Key Reflections:
- Time is the only asset that cannot be recouped once spent.
- Being busy with trivia is identical to sloth.
- Guarding one's calendar is an act of deep self-respect.

### Personal Commitments:
- Protect early mornings (6:30 AM - 9:00 AM) for uninterrupted creative writing.
- Review weekly accomplishments every Sunday afternoon.
`,
    category: 'Reading',
    tags: ['philosophy', 'stoicism', 'books'],
    color: 'cream',
    isPinned: false,
    createdAt: Date.now() - 3600000 * 48,
    updatedAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'note-product-roadmap',
    title: 'Product Roadmap & Sprint Goals',
    content: `# Roadmap: Next Generation Experience

## 🎯 Quarter Target Deliverables
- [x] Responsive layout with adaptive mobile bottom bar
- [x] Markdown parsing engine with live preview
- [x] Keyboard shortcuts modal and global bindings
- [ ] Drag-and-drop task reordering
- [ ] Export to Markdown (.md) and JSON backup snapshot
- [ ] Cloud sync integrations

## 💡 Customer Feedback Highlights
- Users love the tactile paper look over modern clinical interfaces.
- The Quick Capture modal saves ~15 minutes of context switching daily.
`,
    category: 'Work',
    tags: ['roadmap', 'sprint', 'engineering'],
    color: 'sage',
    isPinned: false,
    checklist: [
      { id: 'r1', text: 'Responsive mobile bottom bar', completed: true },
      { id: 'r2', text: 'Live markdown rendering', completed: true },
      { id: 'r3', text: 'Data export utilities', completed: true },
    ],
    createdAt: Date.now() - 3600000 * 72,
    updatedAt: Date.now() - 3600000 * 6,
  },
  {
    id: 'note-recipes-bread',
    title: 'Rustic Country Sourdough Formula',
    content: `# Country Sourdough Loaf (80% Hydration)

### Ingredients
- 450g Unbleached Bread Flour
- 50g Whole Wheat Flour
- 400g Tepid Water (80°F)
- 100g Active Ripe Sourdough Starter
- 11g Fine Sea Salt

### Schedule
1. **Autolyse (45 mins):** Mix flours and 375g water; rest covered.
2. **Incorporate Starter & Salt:** Dimple in starter, add remaining 25g water with salt.
3. **Bulk Fermentation:** 4 sets of stretch-and-folds spaced 30 minutes apart.
4. **Cold Retard:** Shape and place in banneton; refrigerate overnight (14-16 hours).
5. **Bake:** In preheated Dutch oven at 475°F (245°C) with lid for 20 mins, then lid off at 450°F for 22 mins.
`,
    category: 'Personal',
    tags: ['recipe', 'baking', 'weekend'],
    color: 'sand',
    isPinned: false,
    createdAt: Date.now() - 3600000 * 96,
    updatedAt: Date.now() - 3600000 * 30,
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Review and finalize Q3 roadmap milestones',
    description: 'Ensure cross-functional alignment on timeline and deliverables.',
    completed: false,
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0], // Today
    category: 'Work',
    tags: ['roadmap', 'work'],
    createdAt: Date.now() - 3600000 * 20,
  },
  {
    id: 'task-2',
    title: 'Complete chapter 4 of reading notes synthesis',
    description: 'Summarize key takeaways and draft two actionable habits.',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    category: 'Reading',
    tags: ['reading', 'focus'],
    createdAt: Date.now() - 3600000 * 18,
  },
  {
    id: 'task-3',
    title: 'Morning 20-minute mindfulness & reflection',
    description: 'Journal gratitude and identify the singular highest impact task.',
    completed: true,
    priority: 'low',
    dueDate: new Date().toISOString().split('T')[0], // Today
    category: 'Personal',
    tags: ['habit', 'wellness'],
    createdAt: Date.now() - 3600000 * 26,
    completedAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'task-4',
    title: 'Weekly backup of Papyrus archives and exported files',
    description: 'Export JSON snapshot and store in secure local archive.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    category: 'Work',
    tags: ['security', 'backup'],
    createdAt: Date.now() - 3600000 * 10,
  },
  {
    id: 'task-5',
    title: 'Order stone-ground whole grain flour for weekend bake',
    description: 'Check pantry supplies for yeast, banneton liner, and parchment sheets.',
    completed: true,
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    category: 'Personal',
    tags: ['errand'],
    createdAt: Date.now() - 3600000 * 48,
    completedAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'task-6',
    title: 'Draft architectural proposal for offline sync indexing',
    description: 'Document data integrity strategies, conflict resolution, and client storage limits.',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    category: 'Ideas',
    tags: ['architecture', 'planning'],
    createdAt: Date.now() - 3600000 * 14,
  },
];

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgoStr = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
const threeDaysAgoStr = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0];

export const INITIAL_JOURNALS: JournalEntry[] = [
  {
    id: 'journal-today',
    date: todayStr,
    title: 'Morning Clarity & Autumn Rain ☕',
    content: `Woke up early before dawn to the gentle patter of raindrops against the windowpane. Made a fresh pot of pour-over coffee, listening to the ambient lo-fi soundscape. 

There is something deeply grounding about setting aside 15 minutes before the daily rush to articulate thoughts onto paper. The pixel companion on my desk kept quiet rhythm while I outlined my creative aspirations for the coming week.

### Key Intentions for Today:
1. Finish the core architecture write-up with patient focus.
2. Take a mindful walking break without screens after lunch.
3. Read 30 pages of history by lamplight tonight.

> "To write is to carve a quiet clearing in the dense forest of the mind."`,
    mood: 'peaceful',
    tags: ['morning', 'gratitude', 'focus', 'rituals'],
    color: 'sage',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    thumbnailAspectRatio: '16:9',
    voiceTranscript: 'Woke up early to the sound of soft rain outside. Feeling exceptionally calm and ready to tackle today with intention and peace.',
    createdAt: Date.now() - 3600000 * 3,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'journal-yesterday',
    date: yesterdayStr,
    title: 'A Breakthrough in Deep Work ⚡',
    content: `Completed four 25-minute Pomodoro sprints back-to-back without breaking flow. 

I turned on the fireplace ambient sound and found myself completely absorbed in the writing flow. Completed the design draft that had been stalling for two weeks. It feels wonderful to see ideas turn into structured form.

Celebrated in the evening by trying a new herbal tea blend and sketching pixel art ideas.`,
    mood: 'motivated',
    tags: ['breakthrough', 'pomodoro', 'productivity'],
    color: 'cream',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
    thumbnailAspectRatio: '4:3',
    createdAt: Date.now() - 3600000 * 26,
    updatedAt: Date.now() - 3600000 * 25,
  },
  {
    id: 'journal-2-days-ago',
    date: twoDaysAgoStr,
    title: 'Solitude and Old Books in the Library 📖',
    content: `Spent the rainy afternoon in the quiet room of the municipal archives. The aroma of aged parchment and leather bindings is unmatched.

Reflecting on how modern digital life fractures our attention spans, and how intentionally designed, quiet software can serve as an antidote rather than a distraction.`,
    mood: 'reflective',
    tags: ['reading', 'solitude', 'manuscripts'],
    color: 'parchment',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80',
    thumbnailAspectRatio: '1:1',
    createdAt: Date.now() - 3600000 * 50,
    updatedAt: Date.now() - 3600000 * 48,
  },
  {
    id: 'journal-3-days-ago',
    date: threeDaysAgoStr,
    title: 'Golden Hour Walk Through the Pine Woods 🌲',
    content: `The low autumn sunlight filtered through the pine needles in golden shafts of light. Stepped away from screens for a full hour and let my mind wander.

Came back refreshed with several fresh ideas for the project notes layout.`,
    mood: 'radiant',
    tags: ['nature', 'walk', 'goldenhour'],
    color: 'sand',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    thumbnailAspectRatio: '21:9',
    createdAt: Date.now() - 3600000 * 74,
    updatedAt: Date.now() - 3600000 * 72,
  },
];

