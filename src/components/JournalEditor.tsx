import React, { useState, useEffect, useRef } from 'react';
import { 
  JournalEntry, 
  JournalMood, 
  JOURNAL_MOODS, 
  NoteColor, 
  NOTE_COLORS, 
  ImageAspectRatio,
  JournalAudioRecording,
  ChecklistItem 
} from '../types';
import { ImageAspectPicker } from './ImageAspectPicker';
import { VoiceRecorder } from './VoiceRecorder';
import { AudioWaveVisualizer } from './AudioWaveVisualizer';
import { InsertPhotoModal } from './InsertPhotoModal';
import { AccordionSection } from './AccordionSection';
import { 
  X, 
  ArrowLeft,
  Calendar as CalendarIcon, 
  Smile, 
  Sparkles, 
  Save, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Tag as TagIcon,
  Palette,
  Eye,
  Edit3,
  Columns,
  Mic,
  Maximize2,
  Minimize2,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import { copyToClipboard } from '../utils/extensionExporter';

interface JournalEditorProps {
  journal?: JournalEntry | null;
  entry?: JournalEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  journal,
  entry,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const activeJournal = entry !== undefined ? entry : journal;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<JournalMood>('peaceful');
  const [color, setColor] = useState<NoteColor>('parchment');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(undefined);
  const [thumbnailAspectRatio, setThumbnailAspectRatio] = useState<ImageAspectRatio>('16:9');
  const [audioRecording, setAudioRecording] = useState<JournalAudioRecording | undefined>(undefined);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(true);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Accordion open/collapse states
  const [openSections, setOpenSections] = useState({
    reflections: true,
    coverAudio: false,
    content: true,
    checklist: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAllSections = () => {
    setOpenSections({ reflections: true, coverAudio: true, content: true, checklist: true });
  };

  const collapseAllExceptContent = () => {
    setOpenSections({ reflections: false, coverAudio: false, content: true, checklist: false });
  };

  // Live Voice-to-Text & Audio Wave states
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [activeVoiceStream, setActiveVoiceStream] = useState<MediaStream | null>(null);
  const [voiceElapsedSeconds, setVoiceElapsedSeconds] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const voiceStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const voiceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      if (voiceStreamRef.current) {
        voiceStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (activeJournal) {
      setTitle(activeJournal.title || '');
      setContent(activeJournal.content || '');
      setDate(activeJournal.date || new Date().toISOString().split('T')[0]);
      setMood(activeJournal.mood || 'peaceful');
      setColor(activeJournal.color || 'parchment');
      setTags(activeJournal.tags || []);
      setThumbnailUrl(activeJournal.thumbnailUrl);
      setThumbnailAspectRatio(activeJournal.thumbnailAspectRatio || '16:9');
      setAudioRecording(activeJournal.audioRecording);
      setChecklist(activeJournal.checklist || []);
      setIsSaved(true);
    }
  }, [activeJournal]);

  if (!isOpen || !activeJournal) return null;

  const handleSave = () => {
    const updated: JournalEntry = {
      ...activeJournal,
      title: title.trim() || `Journal for ${date}`,
      content,
      date,
      mood,
      color,
      tags,
      thumbnailUrl,
      thumbnailAspectRatio,
      audioRecording,
      checklist,
      updatedAt: Date.now(),
    };
    onSave(updated);
    setIsSaved(true);
    onClose();
  };

  const handleTextChange = (newText: string) => {
    setContent(newText);
    setIsSaved(false);
  };

  const insertMarkdown = (syntaxStart: string, syntaxEnd: string = '') => {
    if (!textareaRef.current) {
      setContent(prev => prev + syntaxStart + syntaxEnd);
      setIsSaved(false);
      return;
    }
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

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    setIsSaved(false);
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(item => item.id !== id));
    setIsSaved(false);
  };

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newChecklistText.trim(),
      completed: false,
    };
    setChecklist(prev => [...prev, newItem]);
    setNewChecklistText('');
    setIsSaved(false);
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-3 font-serif-display text-[#2C241C] leading-relaxed text-base">
        {lines.map((line, idx) => {
          if (line.startsWith('# ')) {
            return <h1 key={idx} className="text-2xl font-bold text-[#241D17] pt-2 pb-1 border-b border-[#E8DEC9]">{line.replace('# ', '')}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={idx} className="text-xl font-bold text-[#2A231B] pt-1.5">{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={idx} className="text-lg font-semibold text-[#362C23]">{line.replace('### ', '')}</h3>;
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote key={idx} className="pl-4 border-l-3 border-[#B59E75] italic text-[#554737] bg-[#F4EDE0]/50 py-1 rounded-r-md">
                {line.replace('> ', '')}
              </blockquote>
            );
          }
          if (line.trim() === '---' || line.trim() === '***') {
            return <hr key={idx} className="my-4 border-[#E2D6C0]" />;
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-[#8C724B] mt-1 text-xs">●</span>
                <span>{line.replace(/^[-*]\s+/, '')}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="font-mono text-xs font-bold text-[#8C724B] mt-0.5">{line.match(/^\d+\./)?.[0]}</span>
                <span>{line.replace(/^\d+\.\s+/, '')}</span>
              </div>
            );
          }
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
          // Inline / Embedded photos: ![alt](url)
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
                    alt={altText || 'Journal photo'}
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
          if (!line.trim()) {
            return <div key={idx} className="h-2" />;
          }
          return <p key={idx} className="text-[#2C241C]">{line}</p>;
        })}
      </div>
    );
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '').toLowerCase();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setIsSaved(false);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
    setIsSaved(false);
  };

  const handleVoiceTranscribe = (text: string) => {
    setContent(prev => {
      const separator = prev.trim() ? '\n\n' : '';
      return `${prev}${separator}*Voice reflection:* ${text}`;
    });
    setIsSaved(false);
  };

  const handleCopyMarkdown = async () => {
    const md = `# ${title || 'Daily Journal'} - ${date}\n**Mood:** ${JOURNAL_MOODS[mood].label} ${JOURNAL_MOODS[mood].emoji}\n\n${content}`;
    await copyToClipboard(md);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleExportText = () => {
    const md = `# ${title || 'Daily Journal'}\nDate: ${date}\nMood: ${JOURNAL_MOODS[mood].label} ${JOURNAL_MOODS[mood].emoji}\nTags: ${tags.join(', ')}\n\n${content}`;
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `journal-${date}-${(title || 'entry').slice(0, 20).replace(/\s+/g, '-').toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Microphone access is not supported by your browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceStreamRef.current = stream;
      setActiveVoiceStream(stream);
      setIsVoiceRecording(true);
      setVoiceElapsedSeconds(0);
      setInterimTranscript('');

      // Dictation seconds counter
      voiceTimerRef.current = window.setInterval(() => {
        setVoiceElapsedSeconds((s) => s + 1);
      }, 1000);

      // Speech Recognition setup for live voice-to-text dictation
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-US';

          rec.onresult = (event: any) => {
            let finalSnippet = '';
            let interimSnippet = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalSnippet += event.results[i][0].transcript + ' ';
              } else {
                interimSnippet += event.results[i][0].transcript;
              }
            }
            if (interimSnippet) {
              setInterimTranscript(interimSnippet);
            }
            if (finalSnippet.trim()) {
              handleVoiceTranscribe(finalSnippet.trim());
              setInterimTranscript('');
            }
          };

          rec.onerror = (e: any) => {
            console.log('Speech recognition notice:', e);
          };

          rec.onend = () => {
            if (voiceStreamRef.current) {
              try { rec.start(); } catch (_) {}
            }
          };

          rec.start();
          recognitionRef.current = rec;
        } catch (recErr) {
          console.log('Speech rec start error:', recErr);
        }
      }
    } catch (err: any) {
      console.error('Error starting voice recording:', err);
      alert('Could not access microphone: ' + (err.message || 'Permission denied'));
    }
  };

  const stopVoiceRecording = () => {
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    if (voiceStreamRef.current) {
      voiceStreamRef.current.getTracks().forEach((t) => t.stop());
      voiceStreamRef.current = null;
    }
    if (interimTranscript.trim()) {
      handleVoiceTranscribe(interimTranscript.trim());
      setInterimTranscript('');
    }
    setIsVoiceRecording(false);
    setActiveVoiceStream(null);
  };

  const cancelVoiceRecording = () => {
    if (voiceTimerRef.current) {
      clearInterval(voiceTimerRef.current);
      voiceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      recognitionRef.current = null;
    }
    if (voiceStreamRef.current) {
      voiceStreamRef.current.getTracks().forEach((t) => t.stop());
      voiceStreamRef.current = null;
    }
    setInterimTranscript('');
    setIsVoiceRecording(false);
    setActiveVoiceStream(null);
  };

  const colorConfig = NOTE_COLORS[color] || NOTE_COLORS.parchment;
  const moodConfig = JOURNAL_MOODS[mood] || JOURNAL_MOODS.peaceful;
  const wordCount = content.trim() ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = content.length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className={isFullScreen 
      ? `fixed inset-0 z-50 flex flex-col w-full h-full min-h-screen ${colorConfig.bgClass} overflow-hidden animate-fade-in`
      : `fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-fade-in`
    }>
      <div className={isFullScreen
        ? `w-full h-full flex flex-col overflow-hidden transition-all duration-300`
        : `w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden transition-all duration-300 ${colorConfig.bgClass} ${colorConfig.borderClass}`
      }>
        
        {/* Header Toolbar (Parity with NoteEditor) */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-[#E6DEC9] bg-[#FFFDF9]/90 backdrop-blur-xs shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Exit without saving (Left arrow) */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white text-[#4F4132] hover:text-[#231A12] border border-[#DDD0B8] text-xs font-bold transition-all shadow-2xs cursor-pointer group shrink-0"
              title="Exit without saving"
              aria-label="Exit without saving"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 text-[#8C724B]" />
              <span className="hidden sm:inline">Exit</span>
            </button>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#EFE8D6] text-[#4F4132] border border-[#DDD2BA]">
              <CalendarIcon className="w-3.5 h-3.5 text-[#B08D57]" />
              Daily Journal
            </span>
            <span className={`text-[11px] font-medium transition-opacity ${isSaved ? 'text-[#15803D]' : 'text-[#B45309]'}`}>
              {isSaved ? '● Cloud Synced' : '○ Unsaved edits'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1.5 rounded-xl hover:bg-[#EFE7D5] text-[#695C4E] transition-colors cursor-pointer"
              title={isFullScreen ? "Windowed view" : "Full screen view"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* View Mode Switcher: Edit, Split, Preview (Exact Parity) */}
            <div className="flex items-center p-0.5 bg-white/70 rounded-xl border border-[#DDD2BD]">
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'edit' ? 'bg-[#2E251C] text-[#FEF08A] shadow-xs' : 'text-[#6D5F50] hover:text-[#2E251C]'
                }`}
                title="Edit Mode"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg text-xs font-medium hidden md:block transition-all cursor-pointer ${
                  viewMode === 'split' ? 'bg-[#2E251C] text-[#FEF08A] shadow-xs' : 'text-[#6D5F50] hover:text-[#2E251C]'
                }`}
                title="Side-by-Side Split Mode"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'preview' ? 'bg-[#2E251C] text-[#FEF08A] shadow-xs' : 'text-[#6D5F50] hover:text-[#2E251C]'
                }`}
                title="Preview Mode"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Copy Markdown */}
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="p-1.5 rounded-xl hover:bg-[#EFE7D5] text-[#695C4E] transition-colors cursor-pointer"
              title="Copy as Markdown"
            >
              {copySuccess ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Export Markdown File */}
            <button
              type="button"
              onClick={handleExportText}
              className="p-1.5 rounded-xl hover:bg-[#EFE7D5] text-[#695C4E] transition-colors cursor-pointer"
              title="Export as Markdown file"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Delete entry */}
            <button
              type="button"
              onClick={() => {
                if (confirm('Delete this journal entry?')) {
                  onDelete(activeJournal.id);
                  onClose();
                }
              }}
              className="p-1.5 rounded-xl hover:bg-[#FEE2E2] text-[#991B1B] transition-colors cursor-pointer"
              title="Delete journal entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-[#DDD3BE] mx-1" />

            {/* Save & Close */}
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-[#FEF08A] text-xs font-bold shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save & Close
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-[#EFE7D5] text-[#695C4E] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title Input at Top */}
        <div className={`${isFullScreen ? 'px-6 sm:px-8 py-3.5' : 'px-6 py-3'} border-b border-[#E8DEC9]/70 bg-white/40 shrink-0`}>
          <input
            type="text"
            placeholder="Give today's journal a title or reflection thought..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsSaved(false);
            }}
            className="w-full text-2xl sm:text-3xl font-serif font-bold bg-transparent border-none focus:outline-none text-[#2A231C] placeholder-[#A89C8C]"
          />
        </div>

        {/* Scrollable Body with Collapsible Accordion Sections */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="max-w-5xl mx-auto space-y-4">

            {/* Quick Accordion Toggles */}
            <div className="flex items-center justify-between px-1 text-xs text-[#7A6C5B]">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-[#8C7A68]">
                Journal Sections (Minimize / Maximize)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={expandAllSections}
                  className="px-2.5 py-1 rounded-lg bg-white/60 hover:bg-white/90 border border-[#DDD2BD] text-[11px] font-semibold text-[#5C4D3C] cursor-pointer transition-colors"
                >
                  Expand All
                </button>
                <button
                  type="button"
                  onClick={collapseAllExceptContent}
                  className="px-2.5 py-1 rounded-lg bg-white/60 hover:bg-white/90 border border-[#DDD2BD] text-[11px] font-semibold text-[#5C4D3C] cursor-pointer transition-colors"
                >
                  Focus Writing
                </button>
              </div>
            </div>

            {/* Accordion 1: Reflections, Mood & Palette */}
            <AccordionSection
              title="Day Reflections, Mood & Parchment Palette"
              icon={<Smile className="w-4 h-4" />}
              isOpen={openSections.reflections}
              onToggle={() => toggleSection('reflections')}
              summaryBadge={
                <>
                  <span className="font-semibold">{date}</span>
                  <span>•</span>
                  <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${moodConfig.badgeClass}`}>
                    {moodConfig.emoji} {moodConfig.label}
                  </span>
                  <span>•</span>
                  <span className="capitalize">{color}</span>
                  <span>•</span>
                  <span>{tags.length} tags</span>
                </>
              }
            >
              <div className="space-y-4">
                {/* Date & Mood Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#554737] flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#B08D57]" />
                      Journal Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setIsSaved(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white/70 border border-[#DFD5C0] text-xs font-semibold text-[#2E251C] focus:outline-none focus:ring-2 focus:ring-[#B08D57]/40"
                    />
                  </div>

                  {/* Selected Mood reflection quote */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#554737] flex items-center justify-between">
                      <span>Selected Mood</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${moodConfig.badgeClass}`}>
                        {moodConfig.emoji} {moodConfig.label}
                      </span>
                    </label>
                    <p className="text-[11px] text-[#7A6D5E] italic bg-white/50 p-2 rounded-xl border border-[#E8DEC7]">
                      "{moodConfig.tagline}"
                    </p>
                  </div>
                </div>

                {/* Mood Selection Cards */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#6D5E4E]">
                    Select Mood for this Day:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.values(JOURNAL_MOODS).map((m) => {
                      const isSelected = mood === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setMood(m.id);
                            setIsSaved(false);
                          }}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                            isSelected 
                              ? `${m.bgClass} ${m.borderClass} ring-2 ring-[#B08D57]/50 shadow-xs font-bold`
                              : 'bg-white/60 border-[#E8DEC7] hover:bg-white/90 opacity-90'
                          }`}
                        >
                          <span className="text-lg">{m.emoji}</span>
                          <div className="overflow-hidden">
                            <div className={`text-xs ${m.textClass} truncate font-bold`}>{m.label}</div>
                            <div className="text-[9px] text-[#8C7A68] truncate">{m.tagline.split(',')[0]}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Palette & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EAE1CF]">
                  {/* Parchment Palette */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#554737] flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#B08D57]" />
                      Journal Parchment Palette
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap p-1 bg-white/60 rounded-xl border border-[#DFD5C2]">
                      {(Object.keys(NOTE_COLORS) as NoteColor[]).map((c) => {
                        const cfg = NOTE_COLORS[c];
                        const isSelected = color === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setColor(c);
                              setIsSaved(false);
                            }}
                            className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${cfg.borderClass} ${
                              isSelected ? 'scale-115 ring-2 ring-[#2E251C]' : 'hover:scale-105'
                            }`}
                            style={{ backgroundColor: cfg.hex }}
                            title={cfg.name}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#2E251C]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#554737] flex items-center gap-1.5">
                      <TagIcon className="w-3.5 h-3.5 text-[#B08D57]" />
                      Tags (press Enter)
                    </label>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/80 text-[#554737] border border-[#DDD3BF]"
                        >
                          #{t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="hover:text-red-700 cursor-pointer ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="+ Add tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="px-2.5 py-1 bg-white/60 text-xs text-[#2A231C] placeholder-[#9E9080] focus:outline-none border border-[#DDD2BC] rounded-lg min-w-28"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </AccordionSection>

            {/* Accordion 2: Cover Photo & Voice Memo */}
            <AccordionSection
              title="Cover Photo & Voice Memo"
              icon={<ImageIcon className="w-4 h-4" />}
              isOpen={openSections.coverAudio}
              onToggle={() => toggleSection('coverAudio')}
              summaryBadge={
                <>
                  <span>{thumbnailUrl ? `Cover attached (${thumbnailAspectRatio})` : 'No cover photo'}</span>
                  <span>•</span>
                  <span>{audioRecording ? '🎙️ Voice memo saved' : 'No memo'}</span>
                </>
              }
            >
              <div className="space-y-4">
                {/* Cover & Aspect Ratio Picker */}
                <ImageAspectPicker
                  thumbnailUrl={thumbnailUrl}
                  aspectRatio={thumbnailAspectRatio}
                  onImageChange={(url, ratio) => {
                    setThumbnailUrl(url);
                    if (ratio) setThumbnailAspectRatio(ratio);
                    setIsSaved(false);
                  }}
                />

                {/* Voice Journal Memo Recorder */}
                <div className="pt-2 border-t border-[#EAE1CF]">
                  <VoiceRecorder
                    recording={audioRecording}
                    onSaveRecording={(rec) => {
                      setAudioRecording(rec);
                      setIsSaved(false);
                    }}
                    onTranscribeText={handleVoiceTranscribe}
                    onRecordingStateChange={(recording, stream) => {
                      setIsVoiceRecording(recording);
                      setActiveVoiceStream(stream || null);
                      if (!recording) {
                        setInterimTranscript('');
                      }
                    }}
                  />
                </div>
              </div>
            </AccordionSection>

            {/* Accordion 3: Journal Writing Canvas & Markdown (Default Open!) */}
            <AccordionSection
              title="Journal Content & Editorial Canvas"
              icon={<Edit3 className="w-4 h-4" />}
              isOpen={openSections.content}
              onToggle={() => toggleSection('content')}
              summaryBadge={
                <span>{wordCount} words • ~{readingTime} min read</span>
              }
            >
              <div className="space-y-3">
                {/* Formatting Toolbar (Parity with NoteEditor + Insert Photo + Voice Dictate) */}
                {viewMode !== 'preview' && (
                  <div className="flex items-center gap-1 py-1.5 px-2 border border-[#E8DEC9] rounded-xl bg-white/60 overflow-x-auto text-xs shrink-0 flex-wrap">
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

                    <div className="w-px h-4 bg-[#DFD5C2] mx-1" />

                    {/* Instant Voice Dictation */}
                    <button
                      type="button"
                      onClick={isVoiceRecording ? stopVoiceRecording : startVoiceRecording}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isVoiceRecording
                          ? 'bg-red-600 text-white shadow-xs animate-pulse ring-2 ring-red-400'
                          : 'bg-[#FAF3E3] hover:bg-[#F3E7CD] text-[#7A5B28] border border-[#DFCFA8]'
                      }`}
                      title={isVoiceRecording ? "Finish voice recording" : "Dictate text with live audio waveform"}
                    >
                      <Mic className={`w-3.5 h-3.5 ${isVoiceRecording ? 'text-white' : 'text-[#A87E3B]'}`} />
                      <span>{isVoiceRecording ? 'Listening...' : 'Voice Dictate'}</span>
                    </button>
                  </div>
                )}

                {/* Real-time Audio Wave Visualizer when dictating */}
                {isVoiceRecording && (
                  <AudioWaveVisualizer
                    isRecording={isVoiceRecording}
                    stream={activeVoiceStream}
                    durationSeconds={voiceElapsedSeconds}
                    interimTranscript={interimTranscript}
                    onStop={stopVoiceRecording}
                    onCancel={cancelVoiceRecording}
                    onInsertTranscript={(text) => {
                      handleVoiceTranscribe(text);
                      setInterimTranscript('');
                    }}
                  />
                )}

                {/* Editorial Canvas: Edit, Split or Preview */}
                <div className="rounded-2xl border border-[#E4DBC8] bg-white/70 overflow-hidden flex flex-col min-h-[380px]">
                  <div className="flex-1 flex overflow-hidden">
                    {/* Editor Pane */}
                    {(viewMode === 'edit' || viewMode === 'split') && (
                      <div className={`flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto ${viewMode === 'split' ? 'border-r border-[#E4DBC8]' : ''}`}>
                        <textarea
                          ref={textareaRef}
                          value={content}
                          onChange={(e) => handleTextChange(e.target.value)}
                          placeholder="What happened today? How did you feel, what are you grateful for, and what thoughts are on your mind?

Tip: Use the toolbar above to format headings, bullet points, checklists, or insert photos among paragraphs."
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

            {/* Accordion 4: Daily Intentions & Action Checklist */}
            <AccordionSection
              title="Daily Intentions & Action Checklist"
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
                    <p className="text-xs text-[#9E907E] italic">No daily intentions or checklist items yet. Add one below!</p>
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
                    placeholder="+ Add intention or action item..."
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
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-[#2E251C] hover:bg-[#45372A] text-[#FEF08A] text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
