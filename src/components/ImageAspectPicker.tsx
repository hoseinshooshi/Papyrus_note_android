import React, { useState, useRef } from 'react';
import { ImageAspectRatio } from '../types';
import { 
  Image as ImageIcon, 
  Trash2, 
  Upload, 
  Link as LinkIcon, 
  Sparkles,
  Check,
  Ratio
} from 'lucide-react';

interface ImageAspectPickerProps {
  thumbnailUrl?: string;
  aspectRatio?: ImageAspectRatio;
  onImageChange: (url?: string, ratio?: ImageAspectRatio) => void;
  className?: string;
}

export const ASPECT_RATIOS: { id: ImageAspectRatio; label: string; ratioClass: string; desc: string }[] = [
  { id: '16:9', label: '16:9', ratioClass: 'aspect-[16/9]', desc: 'Widescreen landscape' },
  { id: '4:3', label: '4:3', ratioClass: 'aspect-[4/3]', desc: 'Classic photograph' },
  { id: '1:1', label: '1:1', ratioClass: 'aspect-square', desc: 'Square polaroid' },
  { id: '3:4', label: '3:4', ratioClass: 'aspect-[3/4]', desc: 'Portrait editorial' },
  { id: '21:9', label: '21:9', ratioClass: 'aspect-[21/9]', desc: 'Panoramic header' },
];

const PRESET_IMAGES = [
  {
    title: 'Autumn Rain & Tea',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: 'Nature',
  },
  {
    title: 'Vintage Writing Desk',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    category: 'Work',
  },
  {
    title: 'Quiet Pine Forest',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    category: 'Forest',
  },
  {
    title: 'Antique Books & Candle',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    category: 'Books',
  },
  {
    title: 'Morning Fog in Valley',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    category: 'Mountains',
  },
  {
    title: 'Cozy Coffee & Notebook',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    category: 'Cafe',
  },
];

export const getAspectClass = (ratio: ImageAspectRatio = '16:9'): string => {
  switch (ratio) {
    case '16:9': return 'aspect-[16/9]';
    case '4:3': return 'aspect-[4/3]';
    case '1:1': return 'aspect-square';
    case '3:4': return 'aspect-[3/4]';
    case '21:9': return 'aspect-[21/9]';
    default: return 'aspect-[16/9]';
  }
};

export const ImageAspectPicker: React.FC<ImageAspectPickerProps> = ({
  thumbnailUrl,
  aspectRatio = '16:9',
  onImageChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'url' | 'upload'>('presets');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentRatioConfig = ASPECT_RATIOS.find(r => r.id === aspectRatio) || ASPECT_RATIOS[0];

  const handleSelectPreset = (url: string) => {
    onImageChange(url, aspectRatio);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onImageChange(urlInput.trim(), aspectRatio);
      setUrlInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert local image to base64 data URL for durable storage
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageChange(reader.result, aspectRatio);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onImageChange(undefined, aspectRatio);
  };

  const handleChangeRatio = (newRatio: ImageAspectRatio) => {
    onImageChange(thumbnailUrl, newRatio);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* If thumbnail is set, show thumbnail preview with aspect ratio controls */}
      {thumbnailUrl ? (
        <div className="relative group rounded-2xl overflow-hidden border border-[#DDD2BC] bg-[#F2EDE1] shadow-xs">
          <div className={`w-full ${currentRatioConfig.ratioClass} overflow-hidden`}>
            <img 
              src={thumbnailUrl} 
              alt="Thumbnail preview" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Aspect Ratio switcher overlay buttons */}
          <div className="p-3 bg-[#FAF6EE] border-t border-[#E6DEC9] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-[#6B5E51] flex items-center gap-1 mr-1">
                <Ratio className="w-3.5 h-3.5" />
                Aspect Ratio:
              </span>
              {ASPECT_RATIOS.map((r) => {
                const isActive = r.id === aspectRatio;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleChangeRatio(r.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#2E251C] text-[#FEF08A] shadow-xs'
                        : 'bg-[#EDE7DB] hover:bg-[#E2D9C8] text-[#554737]'
                    }`}
                    title={r.desc}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(prev => !prev)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#E8DEC9] hover:bg-[#DDD2BB] text-[#2A231C] transition-colors cursor-pointer"
              >
                Change Photo
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-1 rounded-lg text-[#991B1B] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state: button to add cover photo */
        <div>
          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-[#CFC3AE] hover:border-[#8C724B] bg-[#FAF7F0] hover:bg-[#F5EFE3] text-xs font-semibold text-[#665747] transition-all cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-[#8C724B]" />
            <span>Add Cover / Thumbnail Photo</span>
          </button>
        </div>
      )}

      {/* Popover / Drawer for choosing photo */}
      {isOpen && (
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border-2 border-[#E2D8C3] shadow-md space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#EFE8DA]">
            <span className="text-xs font-bold text-[#2A231C] flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#8C724B]" />
              Select Cover Picture & Preferred Ratio
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-[#8C7D6D] hover:text-[#2A231C]"
            >
              ✕
            </button>
          </div>

          {/* Aspect Ratio Selection bar */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#695B4C] flex items-center gap-1">
              <Ratio className="w-3.5 h-3.5" />
              1. Choose Preferred Aspect Ratio
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {ASPECT_RATIOS.map((r) => {
                const isSelected = r.id === aspectRatio;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleChangeRatio(r.id)}
                    className={`py-1.5 px-2 rounded-xl text-center border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2E251C] text-[#FEF08A] border-[#2E251C] shadow-xs'
                        : 'bg-[#FAF6EE] text-[#554737] border-[#E2D8C3] hover:bg-[#F2ECE0]'
                    }`}
                  >
                    <div>{r.label}</div>
                    <div className="text-[9px] font-normal opacity-80">{r.desc.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Tabs */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#EFE8DA]">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'presets'
                  ? 'bg-[#8C724B] text-white'
                  : 'bg-[#F2EDE1] text-[#695B4C] hover:bg-[#EAE2D2]'
              }`}
            >
              Curated Presets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-[#8C724B] text-white'
                  : 'bg-[#F2EDE1] text-[#695B4C] hover:bg-[#EAE2D2]'
              }`}
            >
              Upload Local File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-[#8C724B] text-white'
                  : 'bg-[#F2EDE1] text-[#695B4C] hover:bg-[#EAE2D2]'
              }`}
            >
              Image Web URL
            </button>
          </div>

          {/* Presets Grid */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
              {PRESET_IMAGES.map((preset) => {
                const isSelected = thumbnailUrl === preset.url;
                return (
                  <div
                    key={preset.url}
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                      isSelected
                        ? 'border-[#8C724B] ring-2 ring-[#8C724B]/30'
                        : 'border-[#E2D8C3] hover:border-[#8C724B]'
                    }`}
                  >
                    <div className="w-full aspect-[16/9] overflow-hidden">
                      <img 
                        src={preset.url} 
                        alt={preset.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-1.5 bg-[#FAF7F0] text-[10px] font-medium text-[#2A231C] truncate">
                      {preset.title}
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#8C724B] text-white flex items-center justify-center text-xs shadow-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Upload File */}
          {activeTab === 'upload' && (
            <div className="p-4 rounded-xl border-2 border-dashed border-[#CFC3AE] hover:border-[#8C724B] bg-[#FAF6EE] text-center transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="thumbnail-file-input"
              />
              <Upload className="w-8 h-8 text-[#8C724B] mx-auto mb-2 opacity-80" />
              <p className="text-xs font-bold text-[#2A231C] mb-1">
                Drag & drop or browse from your device
              </p>
              <p className="text-[10px] text-[#7A6D5E] mb-3">
                Supports PNG, JPG, WebP, GIF
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 rounded-xl bg-[#2E251C] hover:bg-[#433629] text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Browse Image File
              </button>
            </div>
          )}

          {/* URL Input */}
          {activeTab === 'url' && (
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#FAF6EE] border border-[#DDD2BC] rounded-xl text-xs text-[#2A231C] placeholder-[#9E9080] focus:outline-none focus:ring-1 focus:ring-[#8C724B]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 bg-[#2E251C] hover:bg-[#433629] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
