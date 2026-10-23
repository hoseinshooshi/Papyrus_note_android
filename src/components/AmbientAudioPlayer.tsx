import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Music, 
  Sliders, 
  Sparkles,
  Check
} from 'lucide-react';
import { 
  ambientEngine, 
  AmbientSoundType, 
  AMBIENT_PRESETS, 
  SoundPreset 
} from '../utils/ambientAudio';

interface AmbientAudioPlayerProps {
  isFocusTimerRunning?: boolean;
  autoPlayOnFocus?: boolean;
  onAutoPlayChange?: (enabled: boolean) => void;
  className?: string;
}

export const AmbientAudioPlayer: React.FC<AmbientAudioPlayerProps> = ({
  isFocusTimerRunning = false,
  autoPlayOnFocus = true,
  onAutoPlayChange,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentType, setCurrentType] = useState<AmbientSoundType>('rain');
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(true);

  // Synchronize initial state
  useEffect(() => {
    ambientEngine.setVolume(volume);
  }, []);

  // Handle focus session auto-play
  useEffect(() => {
    if (!autoPlayOnFocus) return;

    if (isFocusTimerRunning && !isPlaying) {
      ambientEngine.play(currentType);
      setIsPlaying(true);
    } else if (!isFocusTimerRunning && isPlaying) {
      // Optional: keep playing or pause when timer stops
      // Let's pause to preserve flow state separation
      ambientEngine.stop();
      setIsPlaying(false);
    }
  }, [isFocusTimerRunning, autoPlayOnFocus]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      ambientEngine.stop();
      setIsPlaying(false);
    } else {
      ambientEngine.play(currentType);
      setIsPlaying(true);
    }
  };

  const handleSelectSound = (type: AmbientSoundType) => {
    setCurrentType(type);
    if (isPlaying) {
      ambientEngine.play(type);
    }
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (newVal === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    ambientEngine.setVolume(newVal);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      const restored = prevVolume > 0 ? prevVolume : 0.5;
      setVolume(restored);
      setIsMuted(false);
      ambientEngine.setVolume(restored);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
      ambientEngine.setVolume(0);
    }
  };

  const activePreset = AMBIENT_PRESETS.find(p => p.id === currentType) || AMBIENT_PRESETS[0];

  return (
    <div className={`bg-[#FAF7F0] border-2 border-[#E2D8C3] rounded-3xl p-5 shadow-sm transition-all ${className}`}>
      {/* Header bar of Audio Player */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#E8DFC8]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2E251C] text-[#F3ECE0] flex items-center justify-center shadow-2xs">
            <Music className="w-4 h-4 text-[#E6C994]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-[#2A231C] tracking-wide">
                Focus Soundscape
              </h4>
              {isPlaying && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]/60 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Playing
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#7A6D5E]">
              Ambient nature & lo-fi sounds for deep study
            </p>
          </div>
        </div>

        {/* Master Play / Pause Toggle Button */}
        <div className="flex items-center gap-2">
          {/* Animated sound equalizer bars when playing */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-5 px-1">
              <span className="w-1 bg-[#B08D57] rounded-full animate-[bounce_0.8s_infinite_100ms] h-3" />
              <span className="w-1 bg-[#B08D57] rounded-full animate-[bounce_0.7s_infinite_300ms] h-5" />
              <span className="w-1 bg-[#B08D57] rounded-full animate-[bounce_0.9s_infinite_150ms] h-4" />
              <span className="w-1 bg-[#B08D57] rounded-full animate-[bounce_0.6s_infinite_250ms] h-2" />
            </div>
          )}

          <button
            onClick={handleTogglePlay}
            id="ambient-audio-toggle"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 ${
              isPlaying
                ? 'bg-[#2E251C] text-white hover:bg-[#433629]'
                : 'bg-[#EFE9DC] hover:bg-[#E5DDC9] text-[#2A231C] border border-[#DDD2BC]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Sound</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Sound</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Soundscape presets picker */}
      <div className="pt-4 space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {AMBIENT_PRESETS.map((preset: SoundPreset) => {
            const isSelected = currentType === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectSound(preset.id)}
                className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between relative cursor-pointer ${
                  isSelected
                    ? 'bg-[#F2ECE0] border-[#8C724B] shadow-xs ring-1 ring-[#8C724B]/30'
                    : 'bg-[#FFFDF9] border-[#E5DCB] hover:bg-[#F7F3EB]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xl">
                    <img src={preset.icon} className='w-6 h-6' />
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-[#8C724B] text-white flex items-center justify-center text-[10px]">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2A231C] leading-snug">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-[#857463] truncate">
                    {preset.tagline}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Track Description Banner */}
        <div className="p-2.5 rounded-xl bg-[#F4EFE5] border border-[#E4DCB] text-[11px] text-[#695B4C] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">
                <img src={activePreset.icon} className='w-6 h-6' />
            </span>
            <span>
              <strong>{activePreset.name}:</strong> {activePreset.description}
            </span>
          </div>
        </div>

        {/* Audio Volume & Auto-Play Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Volume Slider */}
          <div className="flex items-center gap-2 w-full sm:w-64">
            <button
              onClick={handleToggleMute}
              className="text-[#6D5E4F] hover:text-[#2A231C] transition-colors p-1"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#A84B42]" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#DDD2BC] rounded-lg appearance-none cursor-pointer accent-[#8C724B]"
            />
            <span className="text-[11px] font-semibold text-[#7A6D5E] w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Auto-Play Focus Session Toggle */}
          {onAutoPlayChange && (
            <label className="flex items-center gap-2 text-xs font-semibold text-[#554737] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoPlayOnFocus}
                onChange={(e) => onAutoPlayChange(e.target.checked)}
                className="w-4 h-4 rounded border-[#C4B7A3] text-[#8C724B] focus:ring-[#8C724B] cursor-pointer"
              />
              <span>Auto-play when focus session starts</span>
            </label>
          )}
        </div>
      </div>
    </div>
  );
};
