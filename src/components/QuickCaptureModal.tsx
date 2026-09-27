import React, { useState, useEffect, useRef } from 'react';
import { Note, Task, NoteColor, TaskPriority, NOTE_COLORS } from '../types';
import { X, BookOpen, CheckSquare, Sparkles, Calendar, Tag } from 'lucide-react';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  categories: string[];
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onAddNote,
  onAddTask,
  categories,
}) => {
  const [activeTab, setActiveTab] = useState<'note' | 'task'>('note');
  
  // Note fields
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState(categories[1] || 'Personal');
  const [noteColor, setNoteColor] = useState<NoteColor>('parchment');

  // Task fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState(categories[1] || 'Work');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskDueDate, setTaskDueDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      // Reset form
      setNoteTitle('');
      setNoteContent('');
      setTaskTitle('');
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    onAddNote({
      title: noteTitle.trim(),
      content: noteContent.trim(),
      category: noteCategory,
      tags: [noteCategory.toLowerCase()],
      color: noteColor,
      isPinned: false,
      checklist: [],
    });
    onClose();
  };

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask({
      title: taskTitle.trim(),
      completed: false,
      priority: taskPriority,
      dueDate: taskDueDate || undefined,
      category: taskCategory,
      tags: [taskCategory.toLowerCase()],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231E18]/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-[#FAF7F0] border border-[#DFD6C2] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with mode tabs */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#E8DEC9] bg-[#F4EEE2]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('note')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'note'
                  ? 'bg-[#2E251C] text-[#FAF7F0] shadow-xs'
                  : 'text-[#6C5F50] hover:text-[#2E251C] hover:bg-[#ECE4D4]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Capture Note</span>
            </button>
            <button
              onClick={() => setActiveTab('task')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'task'
                  ? 'bg-[#2E251C] text-[#FAF7F0] shadow-xs'
                  : 'text-[#6C5F50] hover:text-[#2E251C] hover:bg-[#ECE4D4]'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Capture Task</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A6D5E] hover:text-[#2C241C] hover:bg-[#EAE1CF] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Note Form */}
        {activeTab === 'note' && (
          <form onSubmit={handleSubmitNote} className="p-6 space-y-4">
            <div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Note Title..."
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full text-lg font-serif-display font-semibold bg-transparent border-b border-[#DDD2BD] pb-2 text-[#2C241C] placeholder-[#9E907E] focus:outline-none focus:border-[#8C724B]"
                required
              />
            </div>

            <div>
              <textarea
                placeholder="Write your thought, idea, or markdown snippet..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={4}
                className="w-full p-3 bg-[#F4EFE5] border border-[#E1D7C4] rounded-xl text-sm text-[#2C241C] placeholder-[#9E907E] focus:outline-none focus:ring-1 focus:ring-[#8C724B] focus:border-[#8C724B] resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#7A6C5C]" />
                <select
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="text-xs bg-[#EFE9DC] border border-[#D9CEBA] rounded-lg px-2.5 py-1 text-[#2C241C] focus:outline-none"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Color swatches */}
                <div className="flex items-center gap-1.5 ml-2">
                  {(Object.keys(NOTE_COLORS) as NoteColor[]).slice(0, 5).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNoteColor(c)}
                      className={`w-5 h-5 rounded-full border transition-all ${NOTE_COLORS[c].bgClass} ${
                        noteColor === c ? 'border-[#2C241C] scale-110 shadow-xs' : 'border-[#D9CFBE]'
                      }`}
                      title={NOTE_COLORS[c].name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#6F6151] hover:text-[#2C241C] hover:bg-[#EFE9DC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!noteTitle.trim()}
                  className="px-4 py-1.5 rounded-lg bg-[#2E251C] hover:bg-[#45372A] disabled:opacity-50 text-[#F8F5EE] text-xs font-semibold shadow-xs transition-all"
                >
                  Save Note
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Task Form */}
        {activeTab === 'task' && (
          <form onSubmit={handleSubmitTask} className="p-6 space-y-4">
            <div>
              <input
                ref={inputRef}
                type="text"
                placeholder="What needs to be done?"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full text-base font-semibold bg-transparent border-b border-[#DDD2BD] pb-2 text-[#2C241C] placeholder-[#9E907E] focus:outline-none focus:border-[#8C724B]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Priority */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#796B5B] font-bold block mb-1">
                  Priority
                </label>
                <div className="flex rounded-lg border border-[#DACFBB] overflow-hidden">
                  {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTaskPriority(p)}
                      className={`flex-1 py-1.5 text-xs font-semibold capitalize transition-colors ${
                        taskPriority === p
                          ? p === 'high'
                            ? 'bg-[#B5736E] text-white'
                            : p === 'medium'
                            ? 'bg-[#C29D38] text-white'
                            : 'bg-[#5B8258] text-white'
                          : 'bg-[#F2ECE0] text-[#6B5E4E] hover:bg-[#ECE4D4]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due date */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#796B5B] font-bold block mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full text-xs bg-[#F2ECE0] border border-[#DACFBB] rounded-lg px-2.5 py-1.5 text-[#2C241C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#796B5B] font-bold block mb-1">
                  Category
                </label>
                <select
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full text-xs bg-[#F2ECE0] border border-[#DACFBB] rounded-lg px-2.5 py-1.5 text-[#2C241C] focus:outline-none"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EADBCA]">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs text-[#6F6151] hover:text-[#2C241C] hover:bg-[#EFE9DC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!taskTitle.trim()}
                className="px-4 py-1.5 rounded-lg bg-[#2E251C] hover:bg-[#45372A] disabled:opacity-50 text-[#F8F5EE] text-xs font-semibold shadow-xs transition-all"
              >
                Save Task
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
