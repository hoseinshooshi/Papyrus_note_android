import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { Note, Task, ViewMode, CharacterProfile, JournalEntry,Crypto } from './types';
import { storageService } from './services/storageService';
import DonationModal from './components/DonationModal'
import { 
  subscribeToAuth, 
  signOutUser,
  subscribeUserNotes, 
  saveCloudNote, 
  deleteCloudNote,
  subscribeUserTasks, 
  saveCloudTask, 
  deleteCloudTask,
  subscribeUserProfile, 
  saveCloudProfile,
  subscribeUserJournals,
  saveCloudJournal,
  deleteCloudJournal
} from './services/firebase';
import { INITIAL_CATEGORIES } from './data/initialData';
import { NOTE_TEMPLATES } from './data/templates';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { DashboardView } from './components/DashboardView';
import { NotesView } from './components/NotesView';
import { JournalView } from './components/JournalView';
import { TasksView } from './components/TasksView';
import { CharacterCreator } from './components/CharacterCreator';
import { PomodoroClock } from './components/PomodoroClock';
import { NoteEditor } from './components/NoteEditor';
import { JournalEditor } from './components/JournalEditor';
import { TaskEditModal } from './components/TaskEditModal';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { LoginScreen } from './components/LoginScreen';
import { PapyrusBrandLogo } from './components/FullSvg';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isCloudSynced, setIsCloudSynced] = useState(true);

  // App core state
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [notes, setNotes] = useState<Note[]>(() => storageService.getNotes());
  const [journals, setJournals] = useState<JournalEntry[]>(() => storageService.getJournals());
  const [tasks, setTasks] = useState<Task[]>(() => storageService.getTasks());
  const [character, setCharacter] = useState<CharacterProfile>(() => storageService.getCharacter());
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);

  // Modals state
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [isJournalEditorOpen, setIsJournalEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);


  //for donation Modal
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [viewingCrypto, setViewingCrypto] = useState<Crypto | null>(null);
  const onViewDonation = (crypto:Crypto) =>{
    setViewingCrypto(crypto)
    setShowDonateModal(true)
  }
  // Subscribe to Firebase Authentication
  useEffect(() => {
    const unsubscribeAuth = subscribeToAuth((user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // Subscribe to Cloud Firestore once authenticated
  useEffect(() => {
    if (!currentUser?.uid) return;
    setIsCloudSynced(true);

    const unsubNotes = subscribeUserNotes(
      currentUser.uid, 
      (cloudNotes) => {
        setNotes(cloudNotes);
        storageService.saveNotes(cloudNotes);
      },
      () => setIsCloudSynced(false)
    );

    const unsubJournals = subscribeUserJournals(
      currentUser.uid,
      (cloudJournals) => {
        setJournals(cloudJournals);
        storageService.saveJournals(cloudJournals);
      },
      () => setIsCloudSynced(false)
    );

    const unsubTasks = subscribeUserTasks(
      currentUser.uid, 
      (cloudTasks) => {
        setTasks(cloudTasks);
        storageService.saveTasks(cloudTasks);
      },
      () => setIsCloudSynced(false)
    );

    const unsubProfile = subscribeUserProfile(
      currentUser.uid, 
      (cloudProfile) => {
        setCharacter(cloudProfile);
        storageService.saveCharacter(cloudProfile);
      },
      () => setIsCloudSynced(false)
    );

    return () => {
      unsubNotes();
      unsubJournals();
      unsubTasks();
      unsubProfile();
    };
  }, [currentUser?.uid]);

  // Sync to storage and cloud on notes change
  const updateNotes = useCallback((newNotes: Note[]) => {
    setNotes(newNotes);
    storageService.saveNotes(newNotes);
  }, []);

  // Sync to storage and cloud on journals change
  const updateJournals = useCallback((newJournals: JournalEntry[]) => {
    setJournals(newJournals);
    storageService.saveJournals(newJournals);
  }, []);

  // Sync to storage and cloud on tasks change
  const updateTasks = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    storageService.saveTasks(newTasks);
  }, []);

  // Sync character changes locally & to cloud
  const handleSaveCharacter = useCallback((newChar: CharacterProfile) => {
    setCharacter(newChar);
    storageService.saveCharacter(newChar);
    if (currentUser?.uid) {
      saveCloudProfile(currentUser.uid, newChar).catch(console.error);
    }
  }, [currentUser?.uid]);

  // Pomodoro session completion handler
  const handleCompletePomodoroSession = (minutesFocused: number) => {
    const nextMinutes = (character.totalFocusMinutes || 0) + minutesFocused;
    const nextCompleted = (character.completedPomodoros || 0) + 1;

    const updatedChar: CharacterProfile = {
      ...character,
      totalFocusMinutes: nextMinutes,
      completedPomodoros: nextCompleted,
    };

    handleSaveCharacter(updatedChar);
  };

  // Note actions
  const handleOpenNote = (note: Note) => {
    setEditingNote(note);
    setIsNoteEditorOpen(true);
  };

  const handleCreateNote = () => {
    const newNote: Note = {
      id: 'note_' + Date.now(),
      title: 'Untitled Note',
      content: '',
      category: 'Writing',
      tags: [],
      color: 'parchment',
      isPinned: false,
      checklist: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newNote, ...notes];
    updateNotes(updated);
    setEditingNote(newNote);
    setIsNoteEditorOpen(true);

    if (currentUser?.uid) {
      saveCloudNote(currentUser.uid, newNote).catch(console.error);
    }
  };

  const handleCreateFromTemplate = (templateId: string) => {
    const tpl = NOTE_TEMPLATES.find(t => t.id === templateId) || NOTE_TEMPLATES[0];
    const newNote: Note = {
      id: 'note_' + Date.now(),
      title: tpl.title,
      content: tpl.content,
      category: tpl.category,
      tags: [...tpl.tags],
      color: tpl.color,
      isPinned: false,
      checklist: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newNote, ...notes];
    updateNotes(updated);
    setEditingNote(newNote);
    setIsNoteEditorOpen(true);

    if (currentUser?.uid) {
      saveCloudNote(currentUser.uid, newNote).catch(console.error);
    }
  };

  const handleSaveNote = (savedNote: Note) => {
    const updated = notes.map(n => n.id === savedNote.id ? savedNote : n);
    updateNotes(updated);

    if (currentUser?.uid) {
      saveCloudNote(currentUser.uid, savedNote).catch(console.error);
    }
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    updateNotes(updated);

    if (currentUser?.uid) {
      deleteCloudNote(currentUser.uid, id).catch(console.error);
    }
  };

  const handleTogglePin = (id: string) => {
    const target = notes.find(n => n.id === id);
    if (!target) return;
    const nextPinned = !target.isPinned;
    const updatedNote = { ...target, isPinned: nextPinned, updatedAt: Date.now() };
    const updated = notes.map(n => n.id === id ? updatedNote : n);
    updateNotes(updated);

    if (currentUser?.uid) {
      saveCloudNote(currentUser.uid, updatedNote).catch(console.error);
    }
  };

  const handleDuplicateNote = (note: Note) => {
    const duplicated: Note = {
      ...note,
      id: 'note_' + Date.now(),
      title: `${note.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [duplicated, ...notes];
    updateNotes(updated);

    if (currentUser?.uid) {
      saveCloudNote(currentUser.uid, duplicated).catch(console.error);
    }
  };

  // Journal actions
  const handleOpenJournal = (entry: JournalEntry) => {
    setEditingJournal(entry);
    setIsJournalEditorOpen(true);
  };

  const handleCreateJournal = (dateStr?: string) => {
    const todayStr = dateStr || new Date().toISOString().split('T')[0];
    const newEntry: JournalEntry = {
      id: 'journal_' + Date.now(),
      date: todayStr,
      title: '',
      content: '',
      mood: 'peaceful',
      tags: [],
      color: 'parchment',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newEntry, ...journals];
    updateJournals(updated);
    setEditingJournal(newEntry);
    setIsJournalEditorOpen(true);

    if (currentUser?.uid) {
      saveCloudJournal(currentUser.uid, newEntry).catch(console.error);
    }
  };

  const handleSaveJournal = (savedEntry: JournalEntry) => {
    const updated = journals.map(j => j.id === savedEntry.id ? savedEntry : j);
    updateJournals(updated);

    if (currentUser?.uid) {
      saveCloudJournal(currentUser.uid, savedEntry).catch(console.error);
    }
  };

  const handleDeleteJournal = (id: string) => {
    const updated = journals.filter(j => j.id !== id);
    updateJournals(updated);
    if (editingJournal?.id === id) {
      setIsJournalEditorOpen(false);
      setEditingJournal(null);
    }

    if (currentUser?.uid) {
      deleteCloudJournal(currentUser.uid, id).catch(console.error);
    }
  };

  // Task actions
  const handleToggleTask = (id: string) => {
    let updatedTask: Task | null = null;
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        updatedTask = {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? Date.now() : undefined,
        };
        return updatedTask;
      }
      return t;
    });
    updateTasks(updated);

    if (updatedTask && currentUser?.uid) {
      saveCloudTask(currentUser.uid, updatedTask).catch(console.error);
    }
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: 'task_' + Date.now(),
      createdAt: Date.now(),
    };
    const updated = [newTask, ...tasks];
    updateTasks(updated);

    if (currentUser?.uid) {
      saveCloudTask(currentUser.uid, newTask).catch(console.error);
    }
  };

  const handleOpenTaskEditor = (task: Task) => {
    setEditingTask(task);
    setIsTaskEditorOpen(true);
  };

  const handleSaveTask = (savedTask: Task) => {
    const updated = tasks.map(t => t.id === savedTask.id ? savedTask : t);
    updateTasks(updated);

    if (currentUser?.uid) {
      saveCloudTask(currentUser.uid, savedTask).catch(console.error);
    }
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    updateTasks(updated);
    if (editingTask?.id === id) {
      setIsTaskEditorOpen(false);
      setEditingTask(null);
    }

    if (currentUser?.uid) {
      deleteCloudTask(currentUser.uid, id).catch(console.error);
    }
  };

  const handleClearCompletedTasks = () => {
    const completedTasks = tasks.filter(t => t.completed);
    const updated = tasks.filter(t => !t.completed);
    updateTasks(updated);

    if (currentUser?.uid) {
      completedTasks.forEach(t => deleteCloudTask(currentUser.uid, t.id).catch(console.error));
    }
  };

  // Quick capture submission
  const handleQuickCaptureNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: 'note_' + Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    updateNotes([newNote, ...notes]);

    if (currentUser?.uid) {
      saveCloudNote(currentUser.uid, newNote).catch(console.error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  // 1. Initial Authentication Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-4">
          <PapyrusBrandLogo />
          <div className="w-8 h-8 border-3 border-[#D4B37D]/40 border-t-[#8C724B] rounded-full animate-spin" />
          <p className="text-xs font-serif-display font-medium text-[#7A6D5E] tracking-wide">
            Opening your parchment vault...
          </p>
        </div>
      </div>
    );
  }

  // 2. Authentication Gate: The app is strictly not available until user is signed in with Google
  if (!currentUser) {
    return <LoginScreen />;
  }

  // 3. Main Authenticated Application
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] text-[#2C2825]">
      {/* Header bar */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        notesCount={notes.length}
        journalsCount={journals.length}
        pendingTasksCount={pendingTasksCount}
        character={character}
        user={currentUser}
        onSignOut={handleSignOut}
        isCloudSynced={isCloudSynced}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 sm:pb-8">
        {currentView === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            notes={notes}
            tasks={tasks}
            onViewDonation={onViewDonation}
            character={character}
            onOpenNote={handleOpenNote}
            onCreateNote={handleCreateNote}
            onCreateFromTemplate={handleCreateFromTemplate}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onEditTask={handleOpenTaskEditor}
            onDeleteTask={handleDeleteTask}
            onViewAllNotes={() => setCurrentView('notes')}
            onViewAllTasks={() => setCurrentView('tasks')}
            onOpenPomodoro={() => setCurrentView('pomodoro')}
            onOpenCharacter={() => setCurrentView('character')}
          />
        )}

        {currentView === 'pomodoro' && (
          <PomodoroClock
            character={character}
            tasks={tasks}
            onCompleteSession={handleCompletePomodoroSession}
            onOpenCharacterCreator={() => setCurrentView('character')}
          />
        )}

        {currentView === 'character' && (
          <CharacterCreator
            character={character}
            onSaveCharacter={handleSaveCharacter}
            onStartFocusSession={() => setCurrentView('pomodoro')}
            currentUser={currentUser}
            onSignOut={handleSignOut}
            stats={{
              totalNotes: notes.length,
              totalJournals: journals.length,
              totalTasks: tasks.length
            }}
          />
        )}

        {currentView === 'notes' && (
          <NotesView
            notes={notes}
            onOpenNote={handleOpenNote}
            onCreateNote={handleCreateNote}
            onCreateFromTemplate={handleCreateFromTemplate}
            onDeleteNote={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onDuplicateNote={handleDuplicateNote}
            categories={categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {currentView === 'journal' && (
          <JournalView
            journals={journals}
            onOpenJournal={handleOpenJournal}
            onCreateJournal={handleCreateJournal}
            onDeleteJournal={handleDeleteJournal}
          />
        )}

        {currentView === 'tasks' && (
          <TasksView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onEditTask={handleOpenTaskEditor}
            onDeleteTask={handleDeleteTask}
            onClearCompleted={handleClearCompletedTasks}
            categories={categories}
            searchQuery={searchQuery}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNavBar
        currentView={currentView}
        onViewChange={setCurrentView}
        notesCount={notes.length}
        journalsCount={journals.length}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Note Editor Modal */}
      <NoteEditor
        note={editingNote}
        isOpen={isNoteEditorOpen}
        onClose={() => {
          setIsNoteEditorOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        onDelete={handleDeleteNote}
        categories={categories}
      />

      {/* Journal Editor Modal */}
      <JournalEditor
        entry={editingJournal}
        isOpen={isJournalEditorOpen}
        onClose={() => {
          setIsJournalEditorOpen(false);
          setEditingJournal(null);
        }}
        onSave={handleSaveJournal}
        onDelete={handleDeleteJournal}
      />

      {/* Task Edit Modal */}
      <TaskEditModal
        task={editingTask}
        isOpen={isTaskEditorOpen}
        onClose={() => {
          setIsTaskEditorOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        categories={categories}
      />
      <DonationModal
        crypto={viewingCrypto}
        isOpen={showDonateModal}
        onClose={() => {
          setShowDonateModal(false);
          setViewingCrypto(null);
        }}
      />
      {/* Quick Capture Modal */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onAddNote={handleQuickCaptureNote}
        onAddTask={handleAddTask}
        categories={categories}
      />
    </div>
  );
}
