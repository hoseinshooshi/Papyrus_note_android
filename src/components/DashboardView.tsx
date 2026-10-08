import React, { useState, useEffect } from 'react';
import { Note, Task, NOTE_COLORS, CharacterProfile,Crypto } from '../types';
import { NOTE_TEMPLATES } from '../data/templates';
import { PixelAvatar } from './PixelAvatar';
import { playTaskCompleteSound } from '../utils/taskAccomplishment';
import { 
  Sparkles, 
  BookOpen, 
  CheckSquare, 
  Pin, 
  Plus, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Swords,
  Play,
  Pencil,
  Trash2, 
  HeartHandshake
} from 'lucide-react';
import {CRYPTO_ADDRESS} from "../data/initialData.ts" 

interface DashboardViewProps {
  notes: Note[];
  tasks: Task[];
  character: CharacterProfile;
  onOpenNote: (note: Note) => void;
  onCreateNote: () => void;
  onCreateFromTemplate: (templateId: string) => void;
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onEditTask?: (task: Task) => void;
  onViewDonation: (crypto: Crypto) => void;
  onDeleteTask?: (id: string) => void;
  onViewAllNotes: () => void;
  onViewAllTasks: () => void;
  onOpenPomodoro: () => void;
  onOpenCharacter: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  notes,
  tasks,
  character,
  onOpenNote,
  onCreateNote,
  onCreateFromTemplate,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onViewAllNotes,
  onViewAllTasks,
  onOpenPomodoro,
  onOpenCharacter,
  onViewDonation
}) => {
  const [quickTaskText, setQuickTaskText] = useState('');
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [recentlyCompletedTaskId, setRecentlyCompletedTaskId] = useState<string | null>(null);
  


  const todayStr = new Date().toISOString().split('T')[0];
  const handleTaskToggle = (task: Task) => {
    if (!task.completed) {
      playTaskCompleteSound();
      setRecentlyCompletedTaskId(task.id);
      setTimeout(() => {
        setRecentlyCompletedTaskId(prev => (prev === task.id ? null : prev));
      }, 1400);
    }
    onToggleTask(task.id);
  };
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const pinnedNotes = notes.filter(n => n.isPinned);
  const recentNotes = [...notes].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);

  const todayTasks = tasks.filter(t => t.dueDate === todayStr || !t.completed);
  const completedTodayCount = tasks.filter(t => t.completed && t.completedAt && (Date.now() - t.completedAt < 86400000)).length;
  const pendingTasks = tasks.filter(t => !t.completed);

  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  const handleQuickTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;

    onAddTask({
      title: quickTaskText.trim(),
      completed: false,
      priority: 'medium',
      dueDate: todayStr,
      category: 'Work',
      tags: ['quick'],
    });
    setQuickTaskText('');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Hero Welcome & Character Showcase Banner */}
      <div className="bg-[#FAF6EE] border border-[#E5DECD] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8DCBF]/25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Greeting & Text */}
          <div className="space-y-2 max-w-xl">
            <span className="text-xs uppercase tracking-widest text-[#857461] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A3895B]" />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#2A231C]">
              {greeting}, {character.name}.
            </h1>
            <p className="text-sm text-[#6C5E4E] leading-relaxed">
              Your sanctum is prepared. You have <strong className="text-[#2A231C]">{pendingTasks.length} pending obligations</strong> and <strong className="text-[#2A231C]">{notes.length} saved manuscripts</strong>.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onOpenPomodoro}
                className="px-4 py-2.5 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Focus Timer</span>
              </button>

              <button
                onClick={onOpenCharacter}
                className="px-3.5 py-2.5 rounded-xl bg-[#EFE9DC] hover:bg-[#E5DDC9] border border-[#DDD2BC] text-[#483B2D] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
              >
                <span>Change Avatar</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right: Tactile User Profile & Pixel Avatar Card */}
          <div 
            onClick={onOpenCharacter}
            className="p-4 rounded-2xl bg-[#F2ECE0] border border-[#DDD3BF] shadow-xs flex items-center gap-4 cursor-pointer hover:border-[#C4B79E] transition-all group"
            title="Click to customize your pixel avatar"
          >
            <div className="relative">
              <div className="p-2 rounded-xl bg-[#231E18] border border-[#D4B37D]">
                <PixelAvatar character={character} size="md" animated={true} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif-display font-bold text-sm text-[#2A231C] group-hover:text-[#8C724B] transition-colors">
                  {character.name}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#E4DCB] text-[#554737] text-[10px] font-semibold">
                  Pixel Avatar
                </span>
              </div>
              <p className="text-[11px] text-[#7A6C5B]">
                Click to choose another avatar
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#8C7D6D] font-mono">
                <span>{character.totalFocusMinutes || 0}m focused</span>
                <span>•</span>
                <span>{character.completedPomodoros || 0} pomodoros</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ready-to-use Template Pill Row */}
        <div className="mt-6 pt-5 border-t border-[#E8DEC9] flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-bold text-[#726353] flex-shrink-0 mr-1">
            Manuscript Templates:
          </span>
          {NOTE_TEMPLATES.map(tpl => (
            <button
              key={tpl.id}
              onClick={() => onCreateFromTemplate(tpl.id)}
              className="px-3 py-1.5 rounded-lg bg-[#EFE9DC] hover:bg-[#E7DEC9] border border-[#DDD2BC] text-xs font-medium text-[#46392D] flex items-center gap-1.5 whitespace-nowrap transition-colors shadow-2xs"
            >
              <span>{tpl.title.split(' ')[0]}</span>
              <span className="text-[10px] text-[#82715F] font-normal hidden sm:inline">
                ({tpl.category})
              </span>
            </button>
          ))}
          <button
            onClick={onCreateNote}
            className="px-3 py-1.5 rounded-lg bg-[#2E251C] hover:bg-[#45372A] text-white text-xs font-semibold flex items-center gap-1 whitespace-nowrap transition-colors ml-auto shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Blank Note</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pinned & Recent Notes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Pinned Notes section (if any) */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif-display font-bold text-[#2A231C] flex items-center gap-2">
                  <Pin className="w-4 h-4 text-[#B08D57] fill-[#B08D57]" />
                  Pinned Manuscripts
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pinnedNotes.map(note => {
                  const colorConfig = NOTE_COLORS[note.color] || NOTE_COLORS.parchment;
                  return (
                    <div
                      key={note.id}
                      onClick={() => onOpenNote(note)}
                      className={`p-5 rounded-2xl ${colorConfig.bgClass} border ${colorConfig.borderClass} shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorConfig.badgeClass}`}>
                            {note.category}
                          </span>
                          <Pin className="w-3.5 h-3.5 text-[#B08D57] fill-[#B08D57]" />
                        </div>
                        <h3 className="font-serif-display font-bold text-base text-[#2C241C] group-hover:text-[#8C724B] transition-colors line-clamp-2">
                          {note.title}
                        </h3>
                        <p className="text-xs text-[#6B5E4F] line-clamp-3 leading-relaxed font-serif-display">
                          {note.content.replace(/[#*_`~-]/g, '').slice(0, 140)}...
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-black/5 flex items-center justify-between text-[11px] text-[#867868]">
                        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                        {note.tags.length > 0 && (
                          <span className="truncate max-w-[120px]">#{note.tags[0]}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Notes section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif-display font-bold text-[#2A231C] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8C724B]" />
                Recent Notes
              </h2>
              <button
                onClick={onViewAllNotes}
                className="text-xs font-semibold text-[#8C724B] hover:text-[#5F4B2E] flex items-center gap-1"
              >
                <span>View all ({notes.length})</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentNotes.map(note => {
                const colorConfig = NOTE_COLORS[note.color] || NOTE_COLORS.parchment;
                return (
                  <div
                    key={note.id}
                    onClick={() => onOpenNote(note)}
                    className={`p-4 rounded-xl ${colorConfig.bgClass} border ${colorConfig.borderClass} hover:border-[#C4B79E] transition-all cursor-pointer flex items-center justify-between gap-4 group shadow-2xs`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${colorConfig.badgeClass}`}>
                          {note.category}
                        </span>
                        {note.isPinned && <Pin className="w-3 h-3 text-[#B08D57] fill-[#B08D57]" />}
                        <span className="text-[11px] text-[#8F8171]">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-serif-display font-bold text-sm text-[#2C241C] group-hover:text-[#8C724B] transition-colors truncate">
                        {note.title}
                      </h4>
                      <p className="text-xs text-[#726354] truncate font-serif-display">
                        {note.content.replace(/[#*_`~-]/g, '').slice(0, 100)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono text-[#8C7D6C] group-hover:translate-x-0.5 inline-block transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Today & High Priority Tasks (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF6EE] border border-[#E5DECD] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EADDCB] text-[#594735] flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif-display font-bold text-base text-[#2C241C]">
                    Today's Tasks
                  </h2>
                  <span className="text-[11px] text-[#867664]">
                    {pendingTasks.length} pending • {completedTodayCount} done today
                  </span>
                </div>
              </div>
              <button
                onClick={onViewAllTasks}
                className="text-xs font-semibold text-[#8C724B] hover:text-[#5F4B2E] flex items-center gap-1"
              >
                <span>All Tasks</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Quick add task field */}
            <form onSubmit={handleQuickTaskSubmit} className="relative">
              <input
                type="text"
                placeholder="+ Add task for today (press Enter)..."
                value={quickTaskText}
                onChange={(e) => setQuickTaskText(e.target.value)}
                className="w-full pl-3 pr-9 py-2 bg-[#F1EBE0] hover:bg-[#EBE3D4] focus:bg-white text-xs text-[#2C241C] placeholder-[#8F8171] rounded-xl border border-[#DDD3BE] focus:outline-none focus:border-[#8C724B] transition-all"
              />
              <button
                type="submit"
                disabled={!quickTaskText.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7D6E5D] hover:text-[#2C241C] disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Task list items */}
            <div className="space-y-2 pt-1 max-h-[380px] overflow-y-auto">
              {todayTasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8C7E6F] italic">
                  No tasks due today. Everything is calm!
                </div>
              ) : (
                todayTasks.slice(0, 7).map(task => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F2ECE0] transition-all group relative ${
                      recentlyCompletedTaskId === task.id ? 'animate-task-complete-flash' : ''
                    }`}
                  >
                    {/* Floating accomplishment badge */}
                    {recentlyCompletedTaskId === task.id && (
                      <div className="absolute left-8 -top-2 pointer-events-none animate-task-accomplish-badge z-20 flex items-center gap-1 bg-[#2E251C] text-[#F8F4EC] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-[#F59E0B]/50">
                        <Sparkles className="w-2.5 h-2.5 text-[#F8F4EC]" />
                        <span>Completed!</span>
                      </div>
                    )}

                    <div className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleTaskToggle(task)}
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                          recentlyCompletedTaskId === task.id ? 'animate-task-check-pop' : ''
                        } ${
                          task.completed
                            ? 'bg-[#5B8258] border-[#4A6D47] text-white'
                            : 'border-[#BCB09C] hover:border-[#8C724B]'
                        }`}
                        title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
                      >
                        {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      {/* Pixel Sparkle Burst on complete */}
                      {recentlyCompletedTaskId === task.id && (
                        <div className="absolute inset-0 -m-2 pointer-events-none flex items-center justify-center animate-pixel-sparkle-burst z-10">
                          <div className="w-1 h-1 bg-[#FBBF24] absolute -top-1 -left-1" />
                          <div className="w-1 h-1 bg-[#34D399] absolute -top-1 -right-1" />
                          <div className="w-1 h-1 bg-[#60A5FA] absolute -bottom-1 -left-1" />
                          <div className="w-1 h-1 bg-[#F472B6] absolute -bottom-1 -right-1" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p 
                        onClick={() => onEditTask && onEditTask(task)}
                        className={`text-xs font-medium leading-snug cursor-pointer hover:text-[#8C724B] transition-colors ${
                          task.completed ? 'line-through text-[#998B7B]' : 'text-[#2C241C]'
                        }`}
                        title="Click to edit task"
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px]">
                        {task.priority === 'high' && (
                          <span className="text-[#A14740] font-bold flex items-center gap-0.5">
                            <Flame className="w-3 h-3" /> High
                          </span>
                        )}
                        <span className="text-[#877867]">#{task.category}</span>
                        {task.dueDate && (
                          <span className="text-[#877867]">
                            {task.dueDate === todayStr ? 'Today' : task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons on Dashboard */}
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {onEditTask && (
                        <button
                          type="button"
                          onClick={() => onEditTask(task)}
                          className="p-1 rounded-lg hover:bg-black/5 text-[#7A6B5B] hover:text-[#2C241C] transition-colors cursor-pointer"
                          title="Edit task / ویرایش تسک"
                          aria-label="Edit task"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {onDeleteTask && (
                        taskToDeleteId === task.id ? (
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteTask(task.id);
                              setTaskToDeleteId(null);
                            }}
                            className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold shadow-xs cursor-pointer"
                            title="Confirm delete"
                          >
                            Del?
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setTaskToDeleteId(task.id)}
                            className="p-1 rounded-lg hover:bg-[#F2DFDD] text-[#7A6B5B] hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete task / حذف تسک"
                            aria-label="Delete task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
          </div>
          <div id="donate-me" className="bg-[#FAF6EE] border border-[#E5DECD] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#EADDCB] text-[#594735] flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4 text-[#ff857e]" />
                </div>
                <div>
                  <h2 className="font-serif-display font-bold text-base text-[#3a5537]">
                    Donate ME
                  </h2>
                  <span className="text-[11px] text-[#867664]">
                    Your Donations keeps me GOING...
                  </span>
                </div>
              </div>
            </div>
            {CRYPTO_ADDRESS.map(crypto=> (
              <div key={crypto.name} className="flex items-start overflow-hidden cursor-pointer gap-3 p-2.5 rounded-xl hover:bg-[#F2ECE0] transition-all border border-[#2E251C] group relative">
                <button onClick={()=>onViewDonation(crypto)} className="flex w-full items-center overflow-hidden cursor-pointer gap-2" >
                  <img src={crypto.icon} alt={`${crypto.name} icon`} className="w-7 h-7"/>
                  <div className="flex flex-col cursor-pointer">
                  <span className="self-start">{crypto.name}</span>
                  <span className="text-xs overflow-hidden">{crypto.textAddress}</span>
                  </div>
                </button>
                
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};
