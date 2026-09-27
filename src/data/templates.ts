import { NoteTemplate } from '../types';

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: 'tpl-meeting',
    title: 'Meeting Notes & Action Items',
    description: 'Structure agenda, key decisions, discussion highlights, and immediate next steps.',
    icon: 'Users',
    category: 'Work',
    tags: ['meeting', 'action-items'],
    color: 'linen',
    content: `# Meeting: [Topic / Project Name]
**Date:** ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
**Attendees:** @Alex, @Sarah, @David

---

## 🎯 Objectives & Agenda
- Align on product roadmap deliverables for Q3
- Review critical performance metrics & feedback
- Assign responsibilities for sprint milestones

## 💡 Key Discussion Points
- Architectural shift reduces client-side latency by 40%
- User feedback indicated need for faster quick-capture workflow
- Design system migration to warm tactile tones completed

## 📌 Decisions Made
- [x] Adopt papyrus parchment theme as standard
- [ ] Finalize API schemas by Thursday noon
- [ ] Schedule user interview sessions for next Monday

## ⚡ Action Items
- **@You:** Finalize responsive mobile layout & keyboard shortcuts
- **@Sarah:** Review test suite and compile release documentation
- **@David:** Conduct benchmark on storage synchronization
`,
  },
  {
    id: 'tpl-daily',
    title: 'Daily Reflection & Intentions',
    description: 'Set your 3 top priorities, morning mindset, and evening grateful reflection.',
    icon: 'SunMedium',
    category: 'Personal',
    tags: ['journal', 'daily-focus'],
    color: 'parchment',
    content: `# Daily Log: ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}

> *"Simplicity is about subtracting the obvious and adding the meaningful."*

---

## 🌅 Morning Intentions
- **Focus of the day:** Deliver clean, uncluttered user experience
- **Energy Level:** High (8/10)
- **Mindset:** Calm, deliberate, attentive to craft

## 🎯 The Big 3 Priorities
1. Complete core note editor with live markdown preview
2. Implement fast quick capture modal (Ctrl/Cmd + K)
3. 30-minute afternoon walk without screens

## 📝 Stream of Consciousness & Brain Dump
Ideas, thoughts, and spontaneous insights throughout the day:

- The rhythm between typography and white space feels right.
- Remember to hydrate before afternoon deep work session.

## 🌙 Evening Gratitude & Win
- **What went well today:** 
- **What I learned:** 
- **Grateful for:** 
`,
  },
  {
    id: 'tpl-project',
    title: 'Project Brief & Milestones',
    description: 'Scope, user problems, technical milestones, and success criteria.',
    icon: 'Compass',
    category: 'Projects',
    tags: ['planning', 'roadmap'],
    color: 'sage',
    content: `# Project Brief: [Project Codename]

## 📋 Executive Overview
A tactile, fast, local-first note-taking and task environment designed for thinkers, writers, and makers.

## 🎯 Problem Statement
Digital note tools have become overloaded with bloated sidebars, distracting notifications, and complex hierarchy. Writers need a calm, parchment-like sanctuary that encourages focused thought.

## 🗺️ Milestones & Phases
- [x] **Phase 1: Core Foundation** - Data models, types, local persistence
- [x] **Phase 2: Note & Task Engines** - Filtering, priority tagging, markdown support
- [ ] **Phase 3: Tactical Quick Capture** - Modal shortcuts, command palette
- [ ] **Phase 4: Sync & Export** - Markdown exports, JSON backup snapshot

## 🛡️ Non-Negotiables
- Instant load times (< 100ms)
- Beautiful typography with proportional spacing
- Zero cloud account requirements to start writing
`,
  },
  {
    id: 'tpl-book',
    title: 'Book Notes & Synthesis',
    description: 'Extract core themes, favorite quotes, practical insights, and ratings.',
    icon: 'BookOpen',
    category: 'Reading',
    tags: ['books', 'insights'],
    color: 'cream',
    content: `# Reading Notes: [Book Title]
**Author:** [Author Name] | **Genre:** Non-Fiction / Philosophy
**Rating:** ★★★★★ | **Finished On:** ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}

---

## 🌟 The One Sentence Thesis
*What is the singular transformative idea of this book?*

## 💡 Core Insights & Principles
1. **First Principle:** Clarity of thought emerges from intentional subtraction.
2. **Second Principle:** Tactile feedback enhances memory retention and deep work stamina.
3. **Third Principle:** Systems beat goals every single time.

## 📜 Memorable Quotes
> "We don't rise to the level of our expectations; we fall to the level of our training."

## 🛠️ Practical Applications
- [ ] Apply the 2-minute rule to daily task triaging
- [ ] Set dedicated offline writing intervals every morning
`,
  },
  {
    id: 'tpl-sprint',
    title: 'Weekly Sprint & Review',
    description: 'Retrospective, sprint review, blockers, and upcoming week planning.',
    icon: 'Kanban',
    category: 'Work',
    tags: ['sprint', 'review'],
    color: 'sand',
    content: `# Weekly Sprint Review (Week ${Math.ceil((new Date().getDate() + 6) / 7)})

## 🏁 Sprint Scorecard
- **Planned Tasks:** 12
- **Completed Tasks:** 10
- **Velocity:** 83%

## 🟢 What Worked
- Morning deep focus sessions without Slack or email
- Quick capture hotkey drastically reduced context switching

## 🔴 Friction & Blockers
- Underestimated time required for offline sync edge cases
- Need better guidelines for task prioritization

## 🚀 Commitments for Next Week
1. Polish keyboard shortcuts modal and documentation
2. Audit color contrast against WCAG AA standards
3. Export functionality for markdown and formatted text
`,
  },
];
