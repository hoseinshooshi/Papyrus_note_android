import { Note, Task, CharacterProfile, JournalEntry } from '../types';
import { INITIAL_NOTES, INITIAL_TASKS, INITIAL_JOURNALS } from '../data/initialData';
import { DEFAULT_CHARACTER } from '../data/pixelAvatars';

const NOTES_KEY = 'papyrus_notes_v1';
const TASKS_KEY = 'papyrus_tasks_v1';
const JOURNALS_KEY = 'papyrus_journals_v1';
const CHARACTER_KEY = 'papyrus_character_v1';

export const storageService = {
  getNotes(): Note[] {
    try {
      const data = localStorage.getItem(NOTES_KEY);
      if (!data) {
        localStorage.setItem(NOTES_KEY, JSON.stringify(INITIAL_NOTES));
        return INITIAL_NOTES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load notes from storage:', e);
      return INITIAL_NOTES;
    }
  },

  saveNotes(notes: Note[]): void {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to storage:', e);
    }
  },

  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(TASKS_KEY);
      if (!data) {
        localStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
        return INITIAL_TASKS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load tasks from storage:', e);
      return INITIAL_TASKS;
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to storage:', e);
    }
  },

  getJournals(): JournalEntry[] {
    try {
      const data = localStorage.getItem(JOURNALS_KEY);
      if (!data) {
        localStorage.setItem(JOURNALS_KEY, JSON.stringify(INITIAL_JOURNALS));
        return INITIAL_JOURNALS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load journals from storage:', e);
      return INITIAL_JOURNALS;
    }
  },

  saveJournals(journals: JournalEntry[]): void {
    try {
      localStorage.setItem(JOURNALS_KEY, JSON.stringify(journals));
    } catch (e) {
      console.error('Failed to save journals to storage:', e);
    }
  },

  getCharacter(): CharacterProfile {
    try {
      const data = localStorage.getItem(CHARACTER_KEY);
      if (!data) {
        localStorage.setItem(CHARACTER_KEY, JSON.stringify(DEFAULT_CHARACTER));
        return DEFAULT_CHARACTER;
      }
      return { ...DEFAULT_CHARACTER, ...JSON.parse(data) };
    } catch (e) {
      console.error('Failed to load character from storage:', e);
      return DEFAULT_CHARACTER;
    }
  },

  saveCharacter(character: CharacterProfile): void {
    try {
      localStorage.setItem(CHARACTER_KEY, JSON.stringify(character));
    } catch (e) {
      console.error('Failed to save character to storage:', e);
    }
  },
};
