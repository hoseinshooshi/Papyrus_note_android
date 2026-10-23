import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Link as LinkIcon,  X, Check, Image } from 'lucide-react';

interface InsertPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertPhoto: (markdownCode: string) => void;
}

const PRESET_PHOTOS = [
  {
    title: 'Bridge',
    url: '/Preset/bridge.jpg',
    caption: '',
  },
  {
    title: 'field',
    url: '/Preset/field.jpg',
    caption: '',
  },
  {
    title: 'Forest',
    url: '/Preset/forest.jpg',
    caption: '',
  },
  {
    title: 'Forest 2',
    url: '/Preset/forest_1.jpg',
    caption: '',
  },
  {
    title: 'lake',
    url: '/Preset/lake.jpg',
    caption: '',
  },
  {
    title: 'river',
    url: '/Preset/river.jpg',
    caption: '',
  },
  {
    title: 'street',
    url: '/Preset/street.jpg',
    caption: '',
  },
  {
    title: 'village',
    url: '/Preset/village.jpg',
    caption: '',
  }
];

export const InsertPhotoModal: React.FC<InsertPhotoModalProps> = ({
  isOpen,
  onClose,
  onInsertPhoto,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, etc.).');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
      if (!captionInput) {
        setCaptionInput(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      alert('Could not read file.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof PRESET_PHOTOS[0]) => {
    setPreviewUrl(preset.url);
    setCaptionInput(preset.caption);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = previewUrl || (activeTab === 'url' ? urlInput.trim() : null);
    if (!finalUrl) {
      alert('Please select or enter an image URL.');
      return;
    }

    const caption = captionInput.trim();
    const markdown = `\n\n![${caption}](${finalUrl})\n\n`;
    onInsertPhoto(markdown);
    onClose();
    // Reset state
    setPreviewUrl(null);
    setUrlInput('');
    setCaptionInput('');
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-lg bg-[#FFFDF9] border-2 border-[#DFD4BF] rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all text-[#2D2319]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8DEC9] bg-[#FAF5EB]/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#EFE8D6] text-[#7A5F35] border border-[#DDD0B7]">
              <ImageIcon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-[#2A231C]">Insert Photo Among Text</h3>
              <p className="text-[11px] text-[#7A6C5B]">Embed pictures directly inside paragraphs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#EFE8D6] text-[#695B4C] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-[#E8DEC9] bg-[#F7F2E7]/50 px-5 pt-2 gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#8C724B] text-[#2C2319] font-bold'
                : 'border-transparent text-[#7F7162] hover:text-[#2C2319]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'border-[#8C724B] text-[#2C2319] font-bold'
                : 'border-transparent text-[#7F7162] hover:text-[#2C2319]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            Image URL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'border-[#8C724B] text-[#2C2319] font-bold'
                : 'border-transparent text-[#7F7162] hover:text-[#2C2319]'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            Presets
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#DDD0B7] hover:border-[#8C724B] bg-[#FAF6EE] hover:bg-[#F5EEDB] rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-[#EBE2CF] group-hover:bg-[#E2D4BD] flex items-center justify-center text-[#7B6239] transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#3B3024]">
                  {isProcessing ? 'Processing image...' : 'Click to browse image from device'}
                </div>
                <div className="text-[11px] text-[#8C7A68]">
                  JPG, PNG, GIF, WEBP supported
                </div>
              </div>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#554737] mb-1">
                  Image Web URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 text-xs bg-[#FAF5EB] border border-[#DDD0B7] rounded-xl px-3 py-2 text-[#2C2319] focus:outline-none focus:border-[#8C724B]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-2 rounded-xl bg-[#EFE8D6] text-xs font-bold text-[#594833] hover:bg-[#E3D9C3] border border-[#DDD0B7] cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PRESET_PHOTOS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-left rounded-xl border overflow-hidden p-1 bg-[#FAF6EE] transition-all cursor-pointer group ${
                    previewUrl === p.url ? 'border-[#8C724B] ring-2 ring-[#8C724B]/30' : 'border-[#E0D5BE] hover:border-[#8C724B]'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.title}
                    className="w-full h-16 object-cover rounded-lg group-hover:scale-102 transition-transform"
                  />
                  <p className="text-[11px] font-bold text-[#382D22] mt-1 truncate px-1">{p.title}</p>
                </button>
              ))}
            </div>
          )}

          {/* Live Preview & Caption */}
          {previewUrl && (
            <div className="space-y-3 pt-2 border-t border-[#E8DEC9]">
              <label className="block text-xs font-bold text-[#554737]">
                Selected Photo Preview
              </label>
              <div className="relative rounded-xl overflow-hidden border border-[#DDD0B7] bg-[#EFE9DC] max-h-48 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewUrl(null)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#554737] mb-1">
                  Photo Caption (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon study session with tea..."
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  className="w-full text-xs bg-[#FAF5EB] border border-[#DDD0B7] rounded-xl px-3 py-2 text-[#2C2319] focus:outline-none focus:border-[#8C724B]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8DEC9] bg-[#FAF5EB]/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6C5E4E] hover:bg-[#EFE8D6] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!previewUrl && !(activeTab === 'url' && urlInput.trim())}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-white text-xs font-bold shadow-xs disabled:opacity-50 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            Insert Into Content
          </button>
        </div>
      </div>
    </div>
  );
};
