import React, { useState } from 'react';
import { Task, TaskPriority } from '../types';
import { playTaskCompleteSound } from '../utils/taskAccomplishment';
import { 
  CheckSquare, 
  Plus, 
  Flame, 
  Calendar, 
  Tag, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Pencil,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted?: () => void;
  categories: string[];
  searchQuery: string;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onClearCompleted,
  categories,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'priority' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [recentlyCompletedId, setRecentlyCompletedId] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newDueDate, setNewDueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newCategory, setNewCategory] = useState(categories[1] || 'Work');
  const [showAddDetails, setShowAddDetails] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleToggle = (task: Task) => {
    if (!task.completed) {
      playTaskCompleteSound();
      setRecentlyCompletedId(task.id);
      setTimeout(() => {
        setRecentlyCompletedId(prev => (prev === task.id ? null : prev));
      }, 1400);
    }
    onToggleTask(task.id);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      completed: false,
      priority: newPriority,
      dueDate: newDueDate || undefined,
      category: newCategory,
      tags: [newCategory.toLowerCase()],
    });

    setNewTitle('');
    setShowAddDetails(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchCategory = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;

    // Tabs filter
    if (activeTab === 'today') {
      return task.dueDate === todayStr;
    }
    if (activeTab === 'upcoming') {
      return task.dueDate && task.dueDate > todayStr && !task.completed;
    }
    if (activeTab === 'priority') {
      return task.priority === 'high' && !task.completed;
    }
    if (activeTab === 'completed') {
      return task.completed;
    }
    return true;
  });

  // Sort tasks: pending first, then by priority, then by due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const priorityWeight: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
    if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    if (a.dueDate && b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }
    return 0;
  });

  const totalCompleted = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const highPriorityCount = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#2A231C]">
            Tasks & Obligations
          </h1>
          <p className="text-xs text-[#7A6B5B]">
            {pendingCount} pending • {totalCompleted} completed • {highPriorityCount} urgent
          </p>
        </div>

        {totalCompleted > 0 && onClearCompleted && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-[#F2ECE0] hover:bg-[#F2DFDD] text-[#7A6B5B] hover:text-red-700 text-xs font-semibold border border-[#DDD2BC] hover:border-[#F0CEC9] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Clear all completed tasks"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Completed ({totalCompleted})</span>
          </button>
        )}
      </div>

      {/* Inline Task Creation Card */}
      <div className="bg-[#FAF6EE] border border-[#E5DECD] rounded-2xl p-4 sm:p-5 shadow-xs">
        <form onSubmit={handleCreateTask} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="+ Add a new task, action item, or commitment..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onFocus={() => setShowAddDetails(true)}
              className="flex-1 text-sm bg-transparent border-none focus:outline-none text-[#2C241C] placeholder-[#9E907E] font-medium"
            />
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-4 py-2 rounded-xl bg-[#2E251C] hover:bg-[#45372A] disabled:opacity-40 text-[#FAF7F0] text-xs font-semibold shadow-xs transition-all flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Collapsible Details Row */}
          {showAddDetails && (
            <div className="pt-3 border-t border-[#E8DFC9] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                {/* Priority Selector */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-[#8C7D6C] uppercase">Priority:</span>
                  <div className="flex rounded-lg border border-[#DACFBB] overflow-hidden">
                    {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`px-2.5 py-1 text-[11px] font-semibold capitalize transition-colors ${
                          newPriority === p
                            ? p === 'high'
                              ? 'bg-[#B5736E] text-white'
                              : p === 'medium'
                              ? 'bg-[#C29D38] text-white'
                              : 'bg-[#5B8258] text-white'
                            : 'bg-[#F2ECE0] text-[#6B5E4E]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8C7D6C]" />
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="text-xs bg-[#F2ECE0] border border-[#DACFBB] rounded-lg px-2 py-0.5 text-[#2C241C]"
                  />
                </div>

                {/* Category */}
                <div className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#8C7D6C]" />
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="text-xs bg-[#F2ECE0] border border-[#DACFBB] rounded-lg px-2 py-0.5 text-[#2C241C]"
                  >
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddDetails(false)}
                className="text-xs text-[#8C7D6C] hover:text-[#2C241C]"
              >
                Hide options
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Tabs & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F0] border border-[#E5DECC] p-3 rounded-2xl">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All' },
            { id: 'today', label: 'Today' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'priority', label: 'High Priority' },
            { id: 'completed', label: 'Completed' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#2E251C] text-[#FAF7F0] shadow-xs'
                  : 'text-[#6D5E4F] hover:bg-[#F2ECE0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8C7D6C] font-semibold">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-[#EFE9DC] border border-[#DDD2BC] rounded-lg px-2.5 py-1 text-[#33281E] focus:outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-[#FAF7F0] border border-[#E5DECC] rounded-2xl overflow-hidden divide-y divide-[#EFE8D9] shadow-2xs">
        {sortedTasks.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CheckSquare className="w-9 h-9 text-[#A49480] mx-auto opacity-70" />
            <h3 className="font-serif-display text-base font-bold text-[#2C241C]">
              No tasks in this view
            </h3>
            <p className="text-xs text-[#7A6C5B]">
              Add a new task above or switch your active tab.
            </p>
          </div>
        ) : (
          sortedTasks.map(task => {
            const isOverdue = task.dueDate && task.dueDate < todayStr && !task.completed;
            const isDueToday = task.dueDate === todayStr && !task.completed;

            return (
              <div
                key={task.id}
                className={`p-3.5 sm:p-4 hover:bg-[#F3ECE0]/60 transition-all flex items-center justify-between gap-3 group relative ${
                  recentlyCompletedId === task.id ? 'animate-task-complete-flash' : ''
                }`}
              >
                {/* Floating Accomplishment Badge */}
                {recentlyCompletedId === task.id && (
                  <div className="absolute left-10 -top-2 pointer-events-none animate-task-accomplish-badge z-20 flex items-center gap-1 bg-[#231D17] text-[#FEF08A] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md border border-[#F59E0B]/50">
                    <Sparkles className="w-3 h-3 text-[#FBBF24] animate-spin" />
                    <span>Done! Great job! ✨</span>
                  </div>
                )}

                <div className="flex items-start gap-3 min-w-0 flex-1 relative">
                  {/* Checkbox button */}
                  <div className="relative flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(task)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                        recentlyCompletedId === task.id ? 'animate-task-check-pop' : ''
                      } ${
                        task.completed
                          ? 'bg-[#5B8258] border-[#4A6D47] text-white shadow-2xs'
                          : 'border-[#C4B7A3] hover:border-[#8C724B] bg-white/70'
                      }`}
                      title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    {/* Pixel Sparkle Burst Animation on Task Completion */}
                    {recentlyCompletedId === task.id && (
                      <div className="absolute inset-0 -m-3 pointer-events-none flex items-center justify-center animate-pixel-sparkle-burst z-10">
                        <div className="w-1.5 h-1.5 bg-[#FBBF24] absolute -top-1 -left-1 shadow-xs" />
                        <div className="w-1.5 h-1.5 bg-[#34D399] absolute -top-1 -right-1 shadow-xs" />
                        <div className="w-1.5 h-1.5 bg-[#60A5FA] absolute -bottom-1 -left-1 shadow-xs" />
                        <div className="w-1.5 h-1.5 bg-[#F472B6] absolute -bottom-1 -right-1 shadow-xs" />
                        <div className="w-1 h-1 bg-[#F59E0B] absolute -top-2.5" />
                        <div className="w-1 h-1 bg-[#10B981] absolute -bottom-2.5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div 
                      onClick={() => onEditTask(task)}
                      className="cursor-pointer group/title"
                      title="Click to edit task"
                    >
                      <p className={`text-sm font-medium leading-snug transition-all group-hover/title:text-[#8C724B] ${
                        task.completed ? 'line-through text-[#998B7B]' : 'text-[#2C241C]'
                      }`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-[#7A6C5B] line-clamp-2 mt-0.5 font-normal">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px]">
                      {/* Priority Tag */}
                      <span className={`px-2 py-0.2 rounded font-bold uppercase text-[10px] ${
                        task.priority === 'high'
                          ? 'bg-[#F2DFDD] text-[#9E3F38]'
                          : task.priority === 'medium'
                          ? 'bg-[#F3EACB] text-[#826922]'
                          : 'bg-[#DEEADC] text-[#3F633B]'
                      }`}>
                        {task.priority}
                      </span>

                      {/* Category tag */}
                      <span className="px-2 py-0.2 rounded bg-[#EDE4D3] text-[#554737] font-semibold">
                        #{task.category}
                      </span>

                      {/* Due Date tag */}
                      {task.dueDate && (
                        <span className={`flex items-center gap-1 font-medium ${
                          isOverdue 
                            ? 'text-red-700 font-bold' 
                            : isDueToday 
                            ? 'text-[#96671A] font-bold' 
                            : 'text-[#827464]'
                        }`}>
                          <Calendar className="w-3 h-3" />
                          {isDueToday ? 'Today' : isOverdue ? `Overdue (${task.dueDate})` : task.dueDate}
                        </span>
                      )}

                      {/* Tags */}
                      {task.tags && task.tags.filter(t => t.toLowerCase() !== task.category.toLowerCase()).map(tag => (
                        <span key={tag} className="text-[#8C7D6D] text-[10px]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons: Edit and Delete */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => onEditTask(task)}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#EFE9DC] hover:bg-[#E5DDC9] text-[#483B2D] border border-[#DDD2BC] hover:border-[#C4B79E] transition-all flex items-center gap-1 text-xs font-semibold shadow-2xs cursor-pointer"
                    title="Edit task / ویرایش تسک"
                    aria-label="Edit task"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#8C724B]" />
                    <span className="hidden sm:inline text-[11px]">Edit</span>
                  </button>

                  {/* Delete Button / Inline Confirmation */}
                  {taskToDeleteId === task.id ? (
                    <div className="flex items-center gap-1 animate-fade-in">
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteTask(task.id);
                          setTaskToDeleteId(null);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                        title="Confirm Delete"
                      >
                        Confirm?
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskToDeleteId(null)}
                        className="px-2 py-1.5 rounded-lg bg-[#EFE9DC] hover:bg-[#E5DDC9] text-[#6D5E4F] text-[11px] font-medium transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setTaskToDeleteId(task.id)}
                      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-[#FAF3F2] hover:bg-[#FBE9E7] text-[#9E3F38] hover:text-red-700 border border-[#EADBD9] hover:border-[#E2BCB8] transition-all flex items-center gap-1 text-xs font-semibold shadow-2xs cursor-pointer"
                      title="Delete task / حذف تسک"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
