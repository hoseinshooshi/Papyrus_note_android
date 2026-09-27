import React, { useState, useMemo } from 'react';
import { 
  JournalEntry, 
  JournalMood, 
  JOURNAL_MOODS, 
  NOTE_COLORS,
  ImageAspectRatio 
} from '../types';
import { getAspectClass } from './ImageAspectPicker';
import { 
  Calendar as CalendarIcon, 
  List as ListIcon, 
  Plus, 
  Search, 
  Filter, 
  Smile, 
  Mic, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Edit3, 
  BookOpen, 
  Sparkles,
  Volume2,
  Clock,
  CheckCircle2,
  CheckSquare,
  FileText
} from 'lucide-react';

interface JournalViewProps {
  journals: JournalEntry[];
  onOpenJournal: (entry: JournalEntry) => void;
  onCreateJournal: (forDate?: string) => void;
  onDeleteJournal: (id: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  journals,
  onOpenJournal,
  onCreateJournal,
  onDeleteJournal,
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedMood, setSelectedMood] = useState<JournalMood | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calendar month state
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Index journals by date (YYYY-MM-DD) for instant calendar lookup
  const journalsByDate = useMemo(() => {
    const map: Record<string, JournalEntry[]> = {};
    journals.forEach(j => {
      if (!map[j.date]) map[j.date] = [];
      map[j.date].push(j);
    });
    return map;
  }, [journals]);

  // Month navigation
  const prevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const goToToday = () => {
    const today = new Date();
    setCurrentMonthDate(today);
    setSelectedCalendarDate(today.toISOString().split('T')[0]);
  };

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Days array for calendar grid
  const calendarDays = useMemo(() => {
    const days: { dayNumber: number; dateString: string; isCurrentMonth: boolean }[] = [];
    
    // Padding days from previous month
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        dayNumber: prevMonthDays - i,
        dateString: prevDate.toISOString().split('T')[0],
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = (month + 1).toString().padStart(2, '0');
      const dStr = d.toString().padStart(2, '0');
      days.push({
        dayNumber: d,
        dateString: `${year}-${mStr}-${dStr}`,
        isCurrentMonth: true,
      });
    }

    // Fill remaining grid spaces to make full weeks
    const remaining = 35 - days.length > 0 ? 35 - days.length : (42 - days.length > 0 ? 42 - days.length : 0);
    for (let r = 1; r <= remaining; r++) {
      const nextDate = new Date(year, month + 1, r);
      days.push({
        dayNumber: r,
        dateString: nextDate.toISOString().split('T')[0],
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month, daysInMonth, firstDayOfWeek]);

  // Filtered journals for List view
  const filteredJournals = useMemo(() => {
    return journals.filter(j => {
      const matchMood = selectedMood === 'all' || j.mood === selectedMood;
      const matchSearch = searchQuery.trim() === '' || 
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.tags && j.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchMood && matchSearch;
    });
  }, [journals, selectedMood, searchQuery]);

  // Selected entry for the active calendar date
  const selectedDateEntries = journalsByDate[selectedCalendarDate] || [];

  // Mood frequency breakdown
  const moodStats = useMemo(() => {
    const counts: Record<string, number> = {};
    journals.forEach(j => {
      counts[j.mood] = (counts[j.mood] || 0) + 1;
    });
    return counts;
  }, [journals]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      
      {/* Top Header & View Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#FFFDF9] p-5 rounded-3xl border border-[#E8DEC7] shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-[#FAF3E3] text-[#8C724B] border border-[#E8DFC9]">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#2A231C]">
                Daily Journal & Reflections
              </h1>
              <p className="text-xs text-[#7A6D5E]">
                Capture daily thoughts, voice reflections, moods, and photos across your calendar
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Calendar vs List switch */}
          <div className="flex items-center bg-[#F2EDE1] p-1 rounded-2xl border border-[#E2D8C3]">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-[#2E251C] text-[#FEF08A] shadow-xs'
                  : 'text-[#695B4C] hover:text-[#2A231C]'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#2E251C] text-[#FEF08A] shadow-xs'
                  : 'text-[#695B4C] hover:text-[#2A231C]'
              }`}
            >
              <ListIcon className="w-4 h-4" />
              Timeline List
            </button>
          </div>

          {/* New Journal Button */}
          <button
            type="button"
            onClick={() => onCreateJournal(selectedCalendarDate)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#8C724B] hover:bg-[#735D3B] text-white text-xs font-bold shadow-xs transition-transform active:scale-98 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Write New Journal
          </button>
        </div>
      </div>

      {/* Mood Strip Bar (Summary of recent emotions) */}
      <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E6DEC9] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Smile className="w-4 h-4 text-[#B08D57]" />
          <span className="text-xs font-bold text-[#45382B]">
            Emotional Weather & Moods:
          </span>
          <span className="text-[11px] text-[#8C7A68]">
            ({journals.length} total entries recorded)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {Object.values(JOURNAL_MOODS).map((m) => {
            const count = moodStats[m.id] || 0;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedMood(prev => prev === m.id ? 'all' : m.id);
                  if (viewMode !== 'list') setViewMode('list');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs transition-all cursor-pointer border ${
                  selectedMood === m.id
                    ? `${m.bgClass} ${m.borderClass} ${m.textClass} ring-2 ring-[#B08D57]/40 font-bold shadow-2xs`
                    : 'bg-[#FFFDF9] border-[#E8DEC7] text-[#635545] hover:bg-[#F7F2E6]'
                }`}
                title={`${m.label}: ${count} entries`}
              >
                <span>{m.emoji}</span>
                <span className="font-semibold">{m.label}</span>
                {count > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 bg-[#EDE4D0] text-[#4A3C2D] rounded-full text-[10px] font-bold">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= CALENDAR VIEW ================= */}
      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Calendar Grid (8 cols on desktop) */}
          <div className="lg:col-span-8 bg-[#FFFDF9] p-5 sm:p-6 rounded-3xl border border-[#E8DEC7] shadow-xs space-y-4">
            
            {/* Calendar Month Header Navigation */}
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE8D8]">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-[#2E251C]">
                  {monthName}
                </h2>
                <button
                  type="button"
                  onClick={goToToday}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[#FAF3E3] hover:bg-[#F3E7CD] text-[#7A5B20] border border-[#E4D5B3] transition-colors cursor-pointer"
                >
                  Today
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-2 rounded-xl hover:bg-[#F2ECE0] text-[#554737] transition-colors cursor-pointer"
                  title="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-2 rounded-xl hover:bg-[#F2ECE0] text-[#554737] transition-colors cursor-pointer"
                  title="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 text-center font-bold text-xs text-[#8C7A68] pb-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {calendarDays.map((calDay, idx) => {
                const dayJournals = journalsByDate[calDay.dateString] || [];
                const hasEntry = dayJournals.length > 0;
                const isSelected = selectedCalendarDate === calDay.dateString;
                const isToday = todayStr === calDay.dateString;
                const primaryMood = hasEntry ? dayJournals[0].mood : null;
                const moodCfg = primaryMood ? JOURNAL_MOODS[primaryMood] : null;

                return (
                  <div
                    key={`${calDay.dateString}-${idx}`}
                    onClick={() => setSelectedCalendarDate(calDay.dateString)}
                    className={`min-h-[72px] sm:min-h-[88px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                      !calDay.isCurrentMonth
                        ? 'bg-[#F9F6F0]/60 opacity-40 border-transparent'
                        : isSelected
                          ? 'bg-[#FAF6EE] border-[#8C724B] ring-2 ring-[#8C724B]/40 shadow-xs'
                          : hasEntry
                            ? `${moodCfg?.bgClass || 'bg-[#FAF6EE]'} border-[#E2D8C3] hover:border-[#8C724B]`
                            : 'bg-[#FFFDF9] border-[#EFE8D8] hover:bg-[#FAF7F0]'
                    }`}
                  >
                    {/* Top line: Day number and Today badge */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isToday 
                          ? 'w-6 h-6 rounded-full bg-[#8C724B] text-white flex items-center justify-center shadow-xs' 
                          : isSelected 
                            ? 'text-[#2A231C]' 
                            : 'text-[#695B4C]'
                      }`}>
                        {calDay.dayNumber}
                      </span>

                      {/* Entry Indicator dots / icons */}
                      {hasEntry && (
                        <div className="flex items-center gap-1">
                          {dayJournals[0].audioRecording && (
                            <Mic className="w-3 h-3 text-[#B08D57]" />
                          )}
                          {dayJournals[0].thumbnailUrl && (
                            <ImageIcon className="w-3 h-3 text-[#22C55E]" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Middle: Mood Emoji & Title Preview if exists */}
                    {hasEntry ? (
                      <div className="mt-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{moodCfg?.emoji}</span>
                          <span className="text-[10px] font-bold text-[#45382B] truncate hidden sm:inline">
                            {dayJournals[0].title}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Hover prompt to write on this date */
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#8C7A68] text-center">
                        + write
                      </div>
                    )}

                    {/* Bottom: subtle count if multiple entries */}
                    {dayJournals.length > 1 && (
                      <span className="text-[9px] font-semibold text-[#8C7A68] self-end">
                        +{dayJournals.length - 1} more
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Sidebar: Selected Date Details & Entries (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#FFFDF9] p-5 rounded-3xl border border-[#E8DEC7] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EFE8D8]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7A68]">
                    Selected Date
                  </span>
                  <h3 className="text-lg font-serif font-bold text-[#2A231C]">
                    {new Date(selectedCalendarDate + 'T00:00:00').toLocaleDateString('default', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => onCreateJournal(selectedCalendarDate)}
                  className="px-3 py-1.5 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-[#FEF08A] text-xs font-bold shadow-xs cursor-pointer"
                >
                  + Write Entry
                </button>
              </div>

              {/* Entries list for selected date */}
              {selectedDateEntries.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEntries.map((entry) => {
                    const moodCfg = JOURNAL_MOODS[entry.mood] || JOURNAL_MOODS.peaceful;
                    const aspectCls = getAspectClass(entry.thumbnailAspectRatio || '16:9');
                    return (
                      <div
                        key={entry.id}
                        className={`p-4 rounded-2xl border transition-all hover:shadow-sm ${moodCfg.bgClass} ${moodCfg.borderClass}`}
                      >
                        {/* Thumbnail with selected aspect ratio */}
                        {entry.thumbnailUrl && (
                          <div className={`w-full ${aspectCls} rounded-xl overflow-hidden mb-3 border border-[#E2D8C3]`}>
                            <img
                              src={entry.thumbnailUrl}
                              alt={entry.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${moodCfg.badgeClass}`}>
                            <span>{moodCfg.emoji}</span>
                            <span>{moodCfg.label}</span>
                          </span>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onOpenJournal(entry)}
                              className="p-1.5 rounded-lg hover:bg-black/5 text-[#554737] transition-colors cursor-pointer"
                              title="Edit journal"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Delete this journal entry?')) {
                                  onDeleteJournal(entry.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
                              title="Delete journal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <h4 
                          onClick={() => onOpenJournal(entry)}
                          className="font-serif font-bold text-base text-[#2A231C] hover:text-[#8C724B] cursor-pointer mb-1"
                        >
                          {entry.title}
                        </h4>

                        <p className="text-xs text-[#554737] line-clamp-3 mb-2 leading-relaxed">
                          {entry.content.replace(/!\[(.*?)\]\((.*?)\)/g, '📷 [$1]').replace(/[#*`>_~-]/g, '').trim() || 'No preview text...'}
                        </p>

                        {/* Checklist progress badge if exists */}
                        {entry.checklist && entry.checklist.length > 0 && (
                          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#5C4D3C] bg-white/70 border border-[#DDD2BD] px-2.5 py-1 rounded-lg">
                            <CheckSquare className="w-3.5 h-3.5 text-[#8C724B]" />
                            <span>{entry.checklist.filter(c => c.completed).length}/{entry.checklist.length} Intentions done</span>
                          </div>
                        )}

                        {/* Audio note pill if exists */}
                        {entry.audioRecording && (
                          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#8C724B] bg-[#EDE4D0] px-2.5 py-1 rounded-lg">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Audio Memo ({entry.audioRecording.durationSeconds}s)</span>
                          </div>
                        )}

                        {/* Tags */}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map(t => (
                              <span key={t} className="text-[10px] bg-black/5 px-2 py-0.5 rounded-md text-[#554737]">
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty state for selected date */
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF3E3] text-[#8C724B] flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 opacity-80" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2A231C]">No Journal Entry for this day</h4>
                    <p className="text-xs text-[#8C7A68] mt-1 max-w-xs mx-auto">
                      Reflect on what happened, record a voice note, or capture how you felt.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCreateJournal(selectedCalendarDate)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8C724B] hover:bg-[#735D3B] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Write for this Day
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* ================= LIST / TIMELINE VIEW ================= */
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#FFFDF9] p-4 rounded-2xl border border-[#E8DEC7]">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89C8C]" />
              <input
                type="text"
                placeholder="Search reflections, gratitude, keywords, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#FAF6EE] border border-[#DDD2BC] rounded-xl text-xs text-[#2A231C] placeholder-[#9E9080] focus:outline-none focus:ring-1 focus:ring-[#8C724B]"
              />
            </div>

            {selectedMood !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedMood('all')}
                className="px-3 py-1.5 rounded-xl bg-[#EFE7D8] text-[#554737] text-xs font-bold hover:bg-[#E2D8C5] cursor-pointer"
              >
                Reset Mood Filter
              </button>
            )}
          </div>

          {/* Cards Grid */}
          {filteredJournals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJournals.map((entry) => {
                const moodCfg = JOURNAL_MOODS[entry.mood] || JOURNAL_MOODS.peaceful;
                const aspectCls = getAspectClass(entry.thumbnailAspectRatio || '16:9');
                return (
                  <div
                    key={entry.id}
                    className={`rounded-3xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${moodCfg.bgClass} ${moodCfg.borderClass} group`}
                  >
                    <div>
                      {/* Thumbnail with selected aspect ratio */}
                      {entry.thumbnailUrl && (
                        <div 
                          onClick={() => onOpenJournal(entry)}
                          className={`w-full ${aspectCls} rounded-2xl overflow-hidden mb-3.5 border border-[#E2D8C3] cursor-pointer`}
                        >
                          <img
                            src={entry.thumbnailUrl}
                            alt={entry.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {/* Header Row: Date & Mood */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-xs font-bold text-[#554737] flex items-center gap-1">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#B08D57]" />
                          {entry.date}
                        </span>

                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${moodCfg.badgeClass}`}>
                          <span>{moodCfg.emoji}</span>
                          <span>{moodCfg.label}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onOpenJournal(entry)}
                        className="font-serif font-bold text-lg text-[#2A231C] hover:text-[#8C724B] cursor-pointer mb-2 transition-colors"
                      >
                        {entry.title}
                      </h3>

                      {/* Snippet */}
                      <p className="text-xs text-[#554737] line-clamp-4 mb-3 leading-relaxed">
                        {entry.content.replace(/!\[(.*?)\]\((.*?)\)/g, '📷 [$1]').replace(/[#*`>_~-]/g, '').trim() || 'No preview text...'}
                      </p>

                      {/* Checklist progress badge if exists */}
                      {entry.checklist && entry.checklist.length > 0 && (
                        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-[#5C4D3C] bg-white/70 border border-[#DDD2BD] px-3 py-1.5 rounded-xl">
                          <CheckSquare className="w-3.5 h-3.5 text-[#8C724B]" />
                          <span>{entry.checklist.filter(c => c.completed).length}/{entry.checklist.length} Daily Intentions done</span>
                        </div>
                      )}

                      {/* Voice Note badge */}
                      {entry.audioRecording && (
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#8C724B] bg-[#EDE4D0]/80 px-3 py-1.5 rounded-xl">
                          <Mic className="w-3.5 h-3.5" />
                          <span>Voice Recording ({entry.audioRecording.durationSeconds}s)</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Tags & Actions */}
                    <div className="pt-3 border-t border-black/5 flex items-center justify-between gap-2 mt-2">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags?.slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] bg-black/5 px-2 py-0.5 rounded-md text-[#554737]">
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onOpenJournal(entry)}
                          className="p-1.5 rounded-xl hover:bg-black/5 text-[#554737] transition-colors cursor-pointer"
                          title="Open & Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Delete this journal reflection?')) {
                              onDeleteJournal(entry.id);
                            }
                          }}
                          className="p-1.5 rounded-xl hover:bg-red-100 text-red-700 transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty state for List View */
            <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DEC7] p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-[#8C724B] mx-auto opacity-75" />
              <h3 className="text-base font-bold text-[#2A231C]">No journals match your criteria</h3>
              <p className="text-xs text-[#7A6D5E] max-w-sm mx-auto">
                {selectedMood !== 'all' ? `No entries found tagged with ${selectedMood} mood.` : 'Start writing your daily logs to preserve moments in time.'}
              </p>
              <button
                type="button"
                onClick={() => onCreateJournal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8C724B] text-white text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Write First Reflection
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
