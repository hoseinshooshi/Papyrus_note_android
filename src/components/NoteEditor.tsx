import React, { useState, useEffect, useRef } from 'react';
import { Note, NoteColor, NOTE_COLORS, ChecklistItem, ImageAspectRatio } from '../types';
import { ImageAspectPicker } from './ImageAspectPicker';
import { 
  X, 
  ArrowLeft,
  Save,
  Pin, 
  Download, 
  Copy, 
  Trash2, 
  Check, 
  Eye, 
  Edit3, 
  Columns, 
  Tag, 
  CheckSquare, 
  Plus, 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Quote, 
  List, 
  ListOrdered, 
  Code,
  FileText,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';
import { exportNoteAsMarkdown, exportNoteAsPlainText, copyToClipboard } from '../utils/extensionExporter';
import { InsertPhotoModal } from './InsertPhotoModal';
import { AccordionSection } from './AccordionSection';

interface NoteEditorProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  onDelete: (id: string) => void;
  categories: string[];
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  isOpen,
  onClose,
  onSave,
  onDelete,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Personal');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [color, setColor] = useState<NoteColor>('parchment');
  const [isPinned, setIsPinned] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(undefined);
  const [thumbnailAspectRatio, setThumbnailAspectRatio] = useState<ImageAspectRatio>('16:9');
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    properties: true,
    cover: false,
    content: true,
    checklist: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAllSections = () => {
    setOpenSections({ properties: true, cover: true, content: true, checklist: true });
  };

  const collapseAllExceptContent = () => {
    setOpenSections({ properties: false, cover: false, content: true, checklist: false });
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category);
      setTags(note.tags || []);
      setColor(note.color || 'parchment');
      setIsPinned(note.isPinned || false);
      setChecklist(note.checklist || []);
      setThumbnailUrl(note.thumbnailUrl);
      setThumbnailAspectRatio(note.thumbnailAspectRatio || '16:9');
      setIsSaved(true);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const handleTextChange = (newContent: string) => {
    setContent(newContent);
    setIsSaved(false);
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setIsSaved(false);
  };

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title: title.trim() || 'Untitled Note',
      content,
      category,
      tags,
      color,
      isPinned,
      checklist,
      thumbnailUrl,
      thumbnailAspectRatio,
      updatedAt: Date.now(),
    };
    onSave(updatedNote);
    setIsSaved(true);
  };

  const handleClose = () => {
    handleSave();
    onClose();
  };

  const handleExitWithoutSaving = () => {
    onClose();
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '').toLowerCase();
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
        setIsSaved(false);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
    setIsSaved(false);
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const item: ChecklistItem = {
      id: 'c_' + Date.now() + Math.random().toString(36).substring(2, 6),
      text: newChecklistText.trim(),
      completed: false,
    };
    setChecklist([...checklist, item]);
    setNewChecklistText('');
    setIsSaved(false);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    setIsSaved(false);
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
    setIsSaved(false);
  };

  const insertMarkdown = (syntaxStart: string, syntaxEnd = '') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${syntaxStart}${selectedText}${syntaxEnd}`;
    
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);
    setIsSaved(false);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          start + syntaxStart.length,
          start + syntaxStart.length + selectedText.length
        );
      }
    }, 0);
  };

  const handleCopyNote = async () => {
    const success = await copyToClipboard(`# ${title}\n\n${content}`);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Simple Markdown parser for live preview
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-3 font-serif-display text-[#2C241C] leading-relaxed text-base">
        {lines.map((line, idx) => {
          // Headers
          if (line.startsWith('# ')) {
            return <h1 key={idx} className="text-2xl font-bold font-serif-display text-[#241D17] pt-2 pb-1 border-b border-[#E8DEC9]">{line.replace('# ', '')}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={idx} className="text-xl font-bold font-serif-display text-[#2A231B] pt-1.5">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={idx} className="text-lg font-semibold font-serif-display text-[#362C23]">{line.replace('### ', '')}</h3>;
          }
          // Blockquote
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="pl-4 border-l-3 border-[#B59E75] italic text-[#554737] bg-[#F4EDE0]/50 py-1 rounded-r-md">
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          // Horizontal Rule
          if (line.trim() === '---' || line.trim() === '***') {
            return <hr key={idx} className="my-4 border-[#E2D6C0]" />;
          }
          // Bullet lists
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-[#8C724B] mt-1 text-xs">●</span>
                <span>{line.replace(/^[-*]\s+/, '')}</span>
              </div>
            );
          }
          // Numbered lists
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="font-mono text-xs font-bold text-[#8C724B] mt-0.5">{line.match(/^\d+\./)?.[0]}</span>
                <span>{line.replace(/^\d+\.\s+/, '')}</span>
              </div>
            );
          }
          // Checkboxes
          if (line.startsWith('- [ ] ')) {
            return (
              <div key={idx} className="flex items-center gap-2.5 pl-2 text-[#463B2F]">
                <input type="checkbox" disabled className="rounded text-[#8C724B]" />
                <span>{line.replace('- [ ] ', '')}</span>
              </div>
            );
          }
          if (line.startsWith('- [x] ') || line.startsWith('- [X] ')) {
            return (
              <div key={idx} className="flex items-center gap-2.5 pl-2 text-[#8C8072] line-through">
                <input type="checkbox" checked disabled className="rounded text-[#8C724B]" />
                <span>{line.replace(/- \[[xX]\] /, '')}</span>
              </div>
            );
          }
          // Check for Inline / Embedded Photo: ![caption](imageUrl)
          if (line.includes('![') && line.includes('](')) {
            const regex = /!\[(.*?)\]\((.*?)\)/g;
            const parts: React.ReactNode[] = [];
            let lastIdx = 0;
            let match;
            while ((match = regex.exec(line)) !== null) {
              if (match.index > lastIdx) {
                parts.push(<span key={`txt-${lastIdx}`}>{line.substring(lastIdx, match.index)}</span>);
              }
              const altText = match[1];
              const imgSrc = match[2];
              parts.push(
                <figure key={`fig-${match.index}`} className="my-3 block w-full">
                  <img
                    src={imgSrc}
                    alt={altText || 'Embedded photograph'}
                    className="w-full max-h-[480px] object-cover rounded-2xl border border-[#DFD4BF] shadow-md bg-stone-100"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  {altText && (
                    <figcaption className="text-center text-xs text-[#7A6C5B] italic mt-1 font-sans">
                      {altText}
                    </figcaption>
                  )}
                </figure>
              );
              lastIdx = regex.lastIndex;
            }
            if (lastIdx < line.length) {
              parts.push(<span key={`txt-${lastIdx}`}>{line.substring(lastIdx)}</span>);
            }
            return <div key={idx} className="space-y-1">{parts}</div>;
          }

          // Blank line
          if (!line.trim()) {
            return <div key={idx} className="h-2" />;
          }
          // Normal paragraph
          return <p key={idx}>{line}</p>;
        })}
      </div>
    );
  };

  const currentColorConfig = NOTE_COLORS[color] || NOTE_COLORS.parchment;

  return (
    <div className={isFullScreen
      ? "fixed inset-0 z-50 flex flex-col w-full h-full min-h-screen animate-fade-in"
      : "fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#231E18]/50 backdrop-blur-xs animate-fade-in"
    }>
      <div 
        className={isFullScreen
          ? `w-full h-full ${currentColorConfig.bgClass} flex flex-col overflow-hidden transition-colors duration-200`
          : `w-full max-w-4xl h-[92vh] ${currentColorConfig.bgClass} border ${currentColorConfig.borderClass} rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-colors duration-200`
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className={`flex items-center justify-between ${isFullScreen ? 'px-4 sm:px-8 py-3.5' : 'px-4 sm:px-6 py-3'} border-b border-[#E4DBC8] bg-black/3 shrink-0`}>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Exit without saving (Left arrow) */}
            <button
              type="button"
              onClick={handleExitWithoutSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white text-[#4F4132] hover:text-[#231A12] border border-[#DDD0B8] text-xs font-bold transition-all shadow-2xs cursor-pointer group shrink-0"
              title="Exit without saving"
              aria-label="Exit without saving"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-[#8C724B]" />
              <span className="hidden sm:inline">Exit</span>
            </button>

            {/* Color Palette Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-white/40 rounded-xl border border-[#DFD5C2]">
              {(Object.keys(NOTE_COLORS) as NoteColor[]).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { setColor(c); setIsSaved(false); }}
                  className={`w-5 h-5 rounded-full border transition-all ${NOTE_COLORS[c].bgClass} ${
                    color === c ? 'border-[#2D2319] scale-110 shadow-xs' : 'border-[#DDD2BE] hover:scale-105'
                  }`}
                  title={NOTE_COLORS[c].name}
                />
              ))}
            </div>

            {/* Category selector */}
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setIsSaved(false); }}
              className="text-xs font-semibold bg-white/50 border border-[#DDD2BD] rounded-lg px-2.5 py-1 text-[#332A20] focus:outline-none"
            >
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Pin Toggle */}
            <button
              type="button"
              onClick={() => { setIsPinned(!isPinned); setIsSaved(false); }}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 font-semibold transition-all ${
                isPinned 
                  ? 'bg-[#B08D57] text-white border-[#967440] shadow-xs' 
                  : 'bg-white/40 text-[#6B5D4E] border-[#DDD2BD] hover:bg-white/70'
              }`}
              title={isPinned ? 'Unpin note' : 'Pin note to top'}
            >
              <Pin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isPinned ? 'Pinned' : 'Pin'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-lg text-[#6B5D4E] hover:text-[#2E251C] hover:bg-white/60 border border-transparent hover:border-[#DDD2BD] transition-all cursor-pointer"
              title={isFullScreen ? "Windowed view" : "Full screen view"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* View Mode Toggle: Edit / Split / Preview */}
            <div className="flex items-center p-0.5 bg-white/50 rounded-lg border border-[#DDD2BD]">
              <button
                onClick={() => setViewMode('edit')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'edit' ? 'bg-[#2E251C] text-white shadow-xs' : 'text-[#6D5F50] hover:text-[#2E251C]'
                }`}
                title="Edit Mode"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-md text-xs font-medium hidden md:block transition-all ${
                  viewMode === 'split' ? 'bg-[#2E251C] text-white shadow-xs' : 'text-[#6D5F50] hover:text-[#2E251C]'
                }`}
                title="Side-by-Side Split Mode"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'preview' ? 'bg-[#2E251C] text-white shadow-xs' : 'text-[#6D5F50] hover:text-[#2E251C]'
                }`}
                title="Preview Mode"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Actions (Copy, Export, Delete, Close) */}
            <button
              onClick={handleCopyNote}
              className="p-1.5 rounded-lg text-[#6B5D4E] hover:text-[#2E251C] hover:bg-white/60 border border-transparent hover:border-[#DDD2BD] transition-all"
              title="Copy note to clipboard"
            >
              {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={() => exportNoteAsMarkdown({ ...note, title, content, category, tags, color, isPinned, checklist, updatedAt: Date.now() })}
              className="p-1.5 rounded-lg text-[#6B5D4E] hover:text-[#2E251C] hover:bg-white/60 border border-transparent hover:border-[#DDD2BD] transition-all"
              title="Download as Markdown file"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.confirm(`Delete "${title}"?`)) {
                  onDelete(note.id);
                  onClose();
                }
              }}
              className="p-1.5 rounded-lg text-[#944D48] hover:bg-[#FBE8E7] border border-transparent hover:border-[#F2C2BF] transition-all"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-[#DED5C3] mx-1" />

            {/* Save & Close */}
            <button
              type="button"
              onClick={handleClose}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-white text-xs font-bold shadow-xs cursor-pointer"
              title="Save changes and close"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              type="button"
              onClick={handleExitWithoutSaving}
              className="p-1.5 rounded-lg text-[#6B5D4E] hover:text-[#2E251C] hover:bg-white/60 border border-transparent hover:border-[#DDD2BD] transition-all cursor-pointer"
              title="Exit without saving"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Note Header: Title & Quick Controls */}
        <div className={`${isFullScreen ? 'px-6 sm:px-8 py-4' : 'px-6 py-4'} border-b border-[#E8DEC9]/70 space-y-2.5 shrink-0`}>
          <input
            type="text"
            placeholder="Title of this note..."
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full text-2xl sm:text-3xl font-serif-display font-semibold bg-transparent border-none focus:outline-none text-[#282119] placeholder-[#A09382]"
          />
        </div>

        {/* Scrollable Accordion Sections Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="max-w-5xl mx-auto space-y-4">
            {/* Quick Accordion Toggles */}
            <div className="flex items-center justify-between px-1 text-xs text-[#7A6C5B]">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-[#8C7A68]">
                Note Sections (Minimize / Maximize)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={expandAllSections}
                  className="px-2.5 py-1 rounded-lg bg-white/50 hover:bg-white/80 border border-[#DDD2BD] text-[11px] font-semibold text-[#5C4D3C] cursor-pointer transition-colors"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={collapseAllExceptContent}
                  className="px-2.5 py-1 rounded-lg bg-white/50 hover:bg-white/80 border border-[#DDD2BD] text-[11px] font-semibold text-[#5C4D3C] cursor-pointer transition-colors"
                >
                  Focus Content
                </button>
              </div>
            </div>

            {/* Accordion 1: Properties & Theme */}
            <AccordionSection
              title="Note Properties, Category & Tags"
              icon={<Tag className="w-4 h-4" />}
              isOpen={openSections.properties}
              onToggle={() => toggleSection('properties')}
              summaryBadge={
                <>
                  <span className="px-2 py-0.5 rounded-md bg-[#EDE4D0] font-semibold text-[#3D3224]">{category}</span>
                  <span>•</span>
                  <span className="capitalize">{color}</span>
                  <span>•</span>
                  <span>{isPinned ? '📌 Pinned' : 'Standard'}</span>
                  <span>•</span>
                  <span>{tags.length} tags</span>
                </>
              }
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#554737] block">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => { setCategory(e.target.value); setIsSaved(false); }}
                      className="text-xs font-semibold bg-white/70 border border-[#DDD2BD] rounded-xl px-3 py-1.5 text-[#332A20] focus:outline-none"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pin status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#554737] block">
                      Pin to Top
                    </label>
                    <button
                      type="button"
                      onClick={() => { setIsPinned(!isPinned); setIsSaved(false); }}
                      className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 font-semibold transition-all cursor-pointer ${
                        isPinned 
                          ? 'bg-[#B08D57] text-white border-[#967440] shadow-xs' 
                          : 'bg-white/60 text-[#6B5D4E] border-[#DDD2BD] hover:bg-white/90'
                      }`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                      <span>{isPinned ? 'Pinned Note' : 'Pin Note'}</span>
                    </button>
                  </div>

                  {/* Color Palette */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#554737] block">
                      Parchment Color Palette
                    </label>
                    <div className="flex items-center gap-1.5 p-1 bg-white/60 rounded-xl border border-[#DFD5C2]">
                      {(Object.keys(NOTE_COLORS) as NoteColor[]).map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setColor(c); setIsSaved(false); }}
                          className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${NOTE_COLORS[c].bgClass} ${
                            color === c ? 'border-[#2D2319] scale-110 shadow-xs ring-2 ring-[#2D2319]/20' : 'border-[#DDD2BE] hover:scale-105'
                          }`}
                          title={NOTE_COLORS[c].name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags bar */}
                <div className="space-y-1 pt-1 border-t border-[#EAE1CF]">
                  <label className="text-xs font-bold text-[#554737] block">
                    Tags
                  </label>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-[#867867]" />
                    {tags.map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/80 text-[#544637] border border-[#DDD3BF]"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600 transition-colors ml-0.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="+ add tag (Enter)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      className="text-xs bg-white/60 border border-[#DDD2BD] rounded-lg px-2.5 py-1 placeholder-[#A49786] text-[#3D3327] focus:outline-none w-36"
                    />
                  </div>
                </div>
              </div>
            </AccordionSection>

            {/* Accordion 2: Cover Photo */}
            <AccordionSection
              title="Note Cover & Thumbnail Photo"
              icon={<ImageIcon className="w-4 h-4" />}
              isOpen={openSections.cover}
              onToggle={() => toggleSection('cover')}
              summaryBadge={
                thumbnailUrl ? (
                  <span>Cover image attached ({thumbnailAspectRatio})</span>
                ) : (
                  <span>No cover photo</span>
                )
              }
            >
              <ImageAspectPicker
                thumbnailUrl={thumbnailUrl}
                aspectRatio={thumbnailAspectRatio}
                onImageChange={(url, ratio) => {
                  setThumbnailUrl(url);
                  if (ratio) setThumbnailAspectRatio(ratio);
                  setIsSaved(false);
                }}
              />
            </AccordionSection>

            {/* Accordion 3: Note Content & Markdown (Main writing canvas) */}
            <AccordionSection
              title="Note Content & Editorial Canvas"
              icon={<Edit3 className="w-4 h-4" />}
              isOpen={openSections.content}
              onToggle={() => toggleSection('content')}
              summaryBadge={
                <span>{wordCount} words • ~{readingTime} min read</span>
              }
            >
              <div className="space-y-3">
                {/* Markdown Toolbar with Photo Insert */}
                {viewMode !== 'preview' && (
                  <div className="flex items-center gap-1 py-1.5 px-2 border border-[#E8DEC9] rounded-xl bg-white/50 overflow-x-auto text-xs shrink-0 flex-wrap">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('**', '**')}
                      className="p-1.5 rounded hover:bg-white text-[#5F5243] cursor-pointer"
                      title="Bold (**text**)"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('*', '*')}
                      className="p-1.5 rounded hover:bg-white text-[#5F5243] cursor-pointer"
                      title="Italic (*text*)"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-[#DFD5C2] mx-1" />
                    <button
                      type="button"
                      onClick={() => insertMarkdown('# ')}
                      className="p-1.5 rounded hover:bg-white text-[#5F5243] cursor-pointer"
                      title="Heading 1"
                    >
                      <Heading1 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('## ')}
                      className="p-1.5 rounded hover:bg-white text-[#5F5243] cursor-pointer"
                      title="Heading 2"
                    >
                      <Heading2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-px h-4 bg-[#DFD5C2] mx-1" />
                    <button
                      type="button"
                      onClick={() => insertMarkdown('> ')}
                      className="p-1.5 rounded hover:bg-white text-[#5F5243] cursor-pointer"
                      title="Blockquote"
                    >
                      <Quote className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('- ')}
                      className="p-1.5 rounded hover:bg-white text-[#5F5243] cursor-pointer"
                      title="Bullet List"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('1. ')}
                      className="p-1.5 rounded hover:bg-white text-[#5F5243] cursor-pointer"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('- [ ] ')}
                      className="p-1.5 rounded hover:bg-white text-[#5F5243] cursor-pointer"
                      title="Task Checkbox"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('`', '`')}
                      className="p-1.5 rounded hover:bg-white text-[#5F5243] cursor-pointer"
                      title="Inline Code"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('\n---\n')}
                      className="px-2 py-1 rounded hover:bg-white text-[#5F5243] font-mono text-[11px] cursor-pointer"
                      title="Horizontal Divider"
                    >
                      Divider
                    </button>

                    <div className="w-px h-4 bg-[#DFD5C2] mx-1" />

                    {/* Insert Photo Among Text Button */}
                    <button
                      type="button"
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF5EB] hover:bg-[#F3ECDD] text-[#3D3123] border border-[#DDD0B7] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                      title="Insert photo among paragraphs"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#8C724B]" />
                      <span>Insert Photo</span>
                    </button>
                  </div>
                )}

                {/* Editor / Split / Preview Canvas */}
                <div className="rounded-2xl border border-[#E4DBC8] bg-white/60 overflow-hidden flex flex-col min-h-[380px]">
                  <div className="flex-1 flex overflow-hidden">
                    {/* Editor Pane */}
                    {(viewMode === 'edit' || viewMode === 'split') && (
                      <div className={`flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto ${viewMode === 'split' ? 'border-r border-[#E4DBC8]' : ''}`}>
                        <textarea
                          ref={textareaRef}
                          value={content}
                          onChange={(e) => handleTextChange(e.target.value)}
                          placeholder="Write your note here. Markdown formatting and embedded photos are fully supported..."
                          className="flex-1 w-full bg-transparent border-none focus:outline-none resize-y min-h-[320px] font-serif-display text-base sm:text-lg leading-relaxed text-[#2C241C] placeholder-[#9E907E]"
                        />
                      </div>
                    )}

                    {/* Preview Pane */}
                    {(viewMode === 'preview' || viewMode === 'split') && (
                      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-black/1 min-h-[320px]">
                        {content.trim() ? (
                          renderMarkdown(content)
                        ) : (
                          <p className="text-[#9E907E] italic text-sm">Preview will appear here as you type...</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AccordionSection>

            {/* Accordion 4: Action Checklist */}
            <AccordionSection
              title="Action Checklist & Items"
              icon={<CheckSquare className="w-4 h-4" />}
              isOpen={openSections.checklist}
              onToggle={() => toggleSection('checklist')}
              summaryBadge={
                <span>{checklist.length} items ({checklist.filter(c => c.completed).length} done)</span>
              }
            >
              <div className="space-y-3">
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {checklist.length === 0 ? (
                    <p className="text-xs text-[#9E907E] italic">No checklist items yet. Add one below!</p>
                  ) : (
                    checklist.map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-2 text-xs group p-1.5 rounded-lg hover:bg-white/60">
                        <label className="flex items-center gap-2.5 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklistItem(item.id)}
                            className="rounded text-[#8C724B] focus:ring-[#8C724B] w-4 h-4 cursor-pointer"
                          />
                          <span className={`text-xs ${item.completed ? 'line-through text-[#8C8072]' : 'text-[#2C241C] font-medium'}`}>
                            {item.text}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => removeChecklistItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 text-[#9C8F7F] hover:text-red-600 transition-opacity p-1 cursor-pointer"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddChecklistItem} className="flex gap-2 pt-2 border-t border-[#EAE1CF]">
                  <input
                    type="text"
                    placeholder="+ Add action item..."
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    className="flex-1 text-xs bg-white/70 border border-[#DDD3BF] rounded-xl px-3 py-2 text-[#2C241C] focus:outline-none focus:border-[#8C724B]"
                  />
                  <button
                    type="submit"
                    disabled={!newChecklistText.trim()}
                    className="px-4 py-2 text-xs rounded-xl bg-[#2E251C] hover:bg-[#433629] disabled:opacity-50 text-white font-bold cursor-pointer"
                  >
                    Add Item
                  </button>
                </form>
              </div>
            </AccordionSection>
          </div>
        </div>

        {/* Modal for inserting photos among paragraphs */}
        <InsertPhotoModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onInsertPhoto={(snippet) => insertMarkdown(snippet)}
        />

        {/* Bottom Status Bar */}
        <div className={`flex items-center justify-between ${isFullScreen ? 'px-6 sm:px-8 py-3' : 'px-6 py-2.5'} border-t border-[#E4DBC8] bg-black/4 text-xs text-[#7A6C5B] shrink-0`}>
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
            <span>•</span>
            <span>~{readingTime} min read</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#8C7E6E]">
              {isSaved ? 'All changes saved' : 'Unsaved edits...'}
            </span>
            <button
              onClick={handleClose}
              className="px-4 py-1.5 rounded-lg bg-[#2E251C] hover:bg-[#45372A] text-[#FAF7F0] text-xs font-semibold shadow-xs transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
