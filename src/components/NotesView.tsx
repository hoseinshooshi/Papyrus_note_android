import React, { useState } from 'react';
import { Note, NoteColor, NOTE_COLORS } from '../types';
import { NOTE_TEMPLATES } from '../data/templates';
import { 
  Plus, 
  Search, 
  Grid, 
  List as ListIcon, 
  Pin, 
  Download, 
  Trash2, 
  Copy, 
  Filter, 
  BookOpen, 
  Sparkles,
  ChevronDown,
  Tag
} from 'lucide-react';
import { exportNoteAsMarkdown } from '../utils/extensionExporter';
import { getAspectClass } from './ImageAspectPicker';

interface NotesViewProps {
  notes: Note[];
  onOpenNote: (note: Note) => void;
  onCreateNote: () => void;
  onCreateFromTemplate: (templateId: string) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDuplicateNote: (note: Note) => void;
  categories: string[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onOpenNote,
  onCreateNote,
  onCreateFromTemplate,
  onDeleteNote,
  onTogglePin,
  onDuplicateNote,
  categories,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedColor, setSelectedColor] = useState<NoteColor | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const [showTemplatesDropdown, setShowTemplatesDropdown] = useState(false);

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || []))).slice(0, 12);

  // Filter notes
  const filteredNotes = notes.filter(note => {
    // Category filter
    if (selectedCategory !== 'All' && note.category !== selectedCategory) return false;
    // Color filter
    if (selectedColor !== 'all' && note.color !== selectedColor) return false;
    // Tag filter
    if (selectedTag && !note.tags.includes(selectedTag)) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content.toLowerCase().includes(q);
      const matchTag = note.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchContent && !matchTag) return false;
    }
    return true;
  });

  // Sort notes: pinned first, then by selected sort
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    if (sortBy === 'updated') return b.updatedAt - a.updatedAt;
    if (sortBy === 'created') return b.createdAt - a.createdAt;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#2A231C]">
            Manuscripts & Notes
          </h1>
          <p className="text-xs text-[#7A6B5B]">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
          </p>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Template picker dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTemplatesDropdown(!showTemplatesDropdown)}
              className="px-3 py-2 rounded-xl bg-[#EFE9DC] hover:bg-[#E7DEC9] border border-[#DDD2BC] text-xs font-semibold text-[#483B2D] flex items-center gap-1.5 transition-all shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#9A7D4E]" />
              <span>Templates</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showTemplatesDropdown && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[#FAF7F0] border border-[#DDD2BC] rounded-xl shadow-xl py-2 z-20"
                onClick={() => setShowTemplatesDropdown(false)}
              >
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8A7966]">
                  Select a template
                </div>
                {NOTE_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => onCreateFromTemplate(tpl.id)}
                    className="w-full text-left px-3 py-2 hover:bg-[#F2ECE0] text-xs text-[#2C241C] transition-colors flex flex-col"
                  >
                    <span className="font-semibold">{tpl.title}</span>
                    <span className="text-[10px] text-[#7A6C5B]">{tpl.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Blank Note button */}
          <button
            onClick={onCreateNote}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-white text-xs font-semibold tracking-wide shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Categories + Color Swatches + Tags */}
      <div className="space-y-3 bg-[#FAF7F0] border border-[#E5DECC] p-4 rounded-2xl shadow-2xs">
        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#2E251C] text-[#FAF7F0] shadow-xs'
                  : 'bg-[#F2ECE0] text-[#635546] hover:bg-[#EBE3D4]'
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="w-px h-5 bg-[#DDD2BC] mx-2 flex-shrink-0" />

          {/* Color filter */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => setSelectedColor('all')}
              className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedColor === 'all' ? 'bg-[#2E251C] text-white font-bold' : 'text-[#7D6E5E] hover:bg-[#F2ECE0]'
              }`}
            >
              All Colors
            </button>
            {(Object.keys(NOTE_COLORS) as NoteColor[]).map(c => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-4.5 h-4.5 rounded-full border transition-transform ${NOTE_COLORS[c].bgClass} ${
                  selectedColor === c ? 'border-[#2C241C] scale-125 shadow-2xs' : 'border-[#DDD2BC] hover:scale-110'
                }`}
                title={NOTE_COLORS[c].name}
              />
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1 flex-shrink-0">
            {/* View Mode Grid/List */}
            <div className="flex items-center p-0.5 bg-[#EFE9DC] rounded-lg border border-[#DDD2BC]">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1 rounded text-xs ${layoutMode === 'grid' ? 'bg-white shadow-2xs text-[#2C241C]' : 'text-[#7D6E5E]'}`}
                title="Grid Layout"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-1 rounded text-xs ${layoutMode === 'list' ? 'bg-white shadow-2xs text-[#2C241C]' : 'text-[#7D6E5E]'}`}
                title="List Layout"
              >
                <ListIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-[#EFE9DC] border border-[#DDD2BC] rounded-lg px-2 py-1 text-[#3E3326] focus:outline-none"
            >
              <option value="updated">Recent</option>
              <option value="created">Oldest</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Tag pills */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
            <Tag className="w-3.5 h-3.5 text-[#8A7966] flex-shrink-0" />
            <span className="text-[11px] font-bold text-[#8A7966] mr-1">Tags:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-[#8C724B] text-white shadow-2xs'
                    : 'bg-[#F1EBE0] text-[#685948] hover:bg-[#EBE2D3]'
                }`}
              >
                #{tag}
              </button>
            ))}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[10px] text-red-600 hover:underline ml-1"
              >
                Clear tag
              </button>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {sortedNotes.length === 0 && (
        <div className="p-12 text-center bg-[#FAF6EE] border border-dashed border-[#DDD2BC] rounded-2xl space-y-3">
          <BookOpen className="w-10 h-10 text-[#A49480] mx-auto" />
          <h3 className="font-serif-display text-lg font-semibold text-[#2C241C]">
            No manuscripts found
          </h3>
          <p className="text-xs text-[#7A6C5B] max-w-sm mx-auto">
            {searchQuery
              ? `No notes match "${searchQuery}". Try adjusting your filters.`
              : 'Your library is waiting for your next profound thought.'}
          </p>
          <button
            onClick={onCreateNote}
            className="px-4 py-2 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-white text-xs font-semibold inline-flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-3.5 h-3.5" /> Create Note
          </button>
        </div>
      )}

      {/* Grid View */}
      {layoutMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {!sortedNotes && (
            <div className='flex flex-col align-cnter justify-center gap-2'>
                  <div className="p-6 text-center text-xs text-[#8C7E6F] italic">
                    No tasks due today. Everything is calm!
                  </div>
                  <img src="/tasks_akriti.svg" className='w-5/10 h-5/10 self-center' />
            </div>
          )}
          {sortedNotes.map(note => {
            const colorConfig = NOTE_COLORS[note.color] || NOTE_COLORS.parchment;
            return (
              <div
                key={note.id}
                onClick={() => onOpenNote(note)}
                className={`p-5 rounded-2xl ${colorConfig.bgClass} border ${colorConfig.borderClass} shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group min-h-[220px]`}
              >
                <div className="space-y-2.5">
                  {note.thumbnailUrl && (
                    <div className={`w-full ${getAspectClass(note.thumbnailAspectRatio)} rounded-xl overflow-hidden mb-2 border border-[#E2D8C3]`}>
                      <img 
                        src={note.thumbnailUrl} 
                        alt={note.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${colorConfig.badgeClass}`}>
                      {note.category}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePin(note.id);
                        }}
                        className={`p-1 rounded hover:bg-black/5 ${note.isPinned ? 'text-[#B08D57]' : 'text-[#8F8171]'}`}
                        title={note.isPinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-[#B08D57]' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-serif-display font-bold text-lg text-[#2A231B] group-hover:text-[#8C724B] transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  <p className="text-xs text-[#615446] line-clamp-4 leading-relaxed font-serif-display">
                    {note.content.replace(/[#*_`~-]/g, '')}
                  </p>

                  {note.checklist && note.checklist.length > 0 && (
                    <div className="text-[11px] text-[#7A6B5B] font-medium flex items-center gap-1.5 pt-1">
                      <span className="w-2 h-2 rounded-full bg-[#8C724B]" />
                      <span>
                        {note.checklist.filter(c => c.completed).length}/{note.checklist.length} checklist items
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between text-[11px] text-[#867767]">
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateNote(note);
                      }}
                      className="p-1 hover:text-[#2C241C]"
                      title="Duplicate note"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        exportNoteAsMarkdown(note);
                      }}
                      className="p-1 hover:text-[#2C241C]"
                      title="Export markdown"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${note.title}"?`)) {
                          onDeleteNote(note.id);
                        }
                      }}
                      className="p-1 text-[#A14740] hover:text-red-700"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {layoutMode === 'list' && (
        <div className="bg-[#FAF7F0] border border-[#E5DECC] rounded-2xl divide-y divide-[#EFE8D9] overflow-hidden shadow-2xs">
          {!sortedNotes && (
            <div className='flex flex-col align-cnter justify-center gap-2'>
                  <div className="p-6 text-center text-xs text-[#8C7E6F] italic">
                    No tasks due today. Everything is calm!
                  </div>
                  <img src="/tasks_akriti.svg" className='w-5/10 h-5/10 self-center' />
            </div>
          )}
          {sortedNotes.map(note => {
            const colorConfig = NOTE_COLORS[note.color] || NOTE_COLORS.parchment;
            return (
              <div
                key={note.id}
                onClick={() => onOpenNote(note)}
                className="p-4 hover:bg-[#F3ECE0] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(note.id);
                    }}
                    className={`p-1 rounded ${note.isPinned ? 'text-[#B08D57]' : 'text-[#A09383]'}`}
                  >
                    <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-[#B08D57]' : ''}`} />
                  </button>

                  {note.thumbnailUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-[#DDD2BD]">
                      <img 
                        src={note.thumbnailUrl} 
                        alt="" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif-display font-bold text-sm text-[#2C241C] group-hover:text-[#8C724B] truncate">
                        {note.title}
                      </h4>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${colorConfig.badgeClass}`}>
                        {note.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#776858] truncate font-serif-display">
                      {note.content.replace(/[#*_`~-]/g, '')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0 text-xs text-[#8A7A6A]">
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportNoteAsMarkdown(note);
                      }}
                      className="p-1 hover:text-[#2C241C]"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete "${note.title}"?`)) {
                          onDeleteNote(note.id);
                        }
                      }}
                      className="p-1 text-[#A14740] hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
