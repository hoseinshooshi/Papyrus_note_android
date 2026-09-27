import React, { useState, useEffect, useRef } from 'react';
import { CharacterProfile, PomodoroMode, Task } from '../types';
import { PixelAvatar } from './PixelAvatar';
import { AmbientAudioPlayer } from './AmbientAudioPlayer';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Coffee, 
  Brain, 
  ChevronRight,
  Sliders,
  Settings,
  Zap,
  Bell
} from 'lucide-react';
import { playGentleChime } from '../utils/audioChime';

interface PomodoroClockProps {
  character: CharacterProfile;
  tasks: Task[];
  onCompleteSession: (minutesFocused: number) => void;
  onOpenCharacterCreator: () => void;
}

export const PomodoroClock: React.FC<PomodoroClockProps> = ({
  character,
  tasks,
  onCompleteSession,
  onOpenCharacterCreator,
}) => {
  // Timer settings
  const [workMinutes, setWorkMinutes] = useState(25);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(5);
  const [longBreakMinutes, setLongBreakMinutes] = useState(15);
  const [mode, setMode] = useState<PomodoroMode>('work');
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customInputMinutes, setCustomInputMinutes] = useState(25);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(character.completedPomodoros || 0);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [celebrationBanner, setCelebrationBanner] = useState<string | null>(null);
  const [autoPlayAmbient, setAutoPlayAmbient] = useState(true);

  const timerRef = useRef<number | null>(null);

  // Total session seconds for progress calculation
  const currentTotalSeconds = (() => {
    if (mode === 'work') return workMinutes * 60;
    if (mode === 'shortBreak') return shortBreakMinutes * 60;
    return longBreakMinutes * 60;
  })();

  // Web Audio chime generator (gentle Tibetan singing bowl / crystal bell chime on finish)
  const playChime = () => {
    if (!soundEnabled) return;
    playGentleChime({ volume: 0.7 });
  };

  // Timer countdown loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, mode, workMinutes, shortBreakMinutes, longBreakMinutes]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    playChime();

    if (mode === 'work') {
      onCompleteSession(workMinutes);
      setCompletedSessionsCount(prev => prev + 1);
      setCelebrationBanner(`🎉 Focus session complete! +${workMinutes} minutes focused.`);
      setTimeout(() => setCelebrationBanner(null), 5000);

      // Auto switch to break if wanted
      setMode('shortBreak');
      setTimeLeft(shortBreakMinutes * 60);
    } else {
      setCelebrationBanner('☀️ Break finished! Ready to resume deep focus.');
      setTimeout(() => setCelebrationBanner(null), 5000);
      setMode('work');
      setTimeLeft(workMinutes * 60);
    }
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(currentTotalSeconds);
  };

  const handleModeSwitch = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'work') setTimeLeft(workMinutes * 60);
    else if (newMode === 'shortBreak') setTimeLeft(shortBreakMinutes * 60);
    else setTimeLeft(longBreakMinutes * 60);
  };

  const handleSetPreset = (minutes: number) => {
    setIsRunning(false);
    setWorkMinutes(minutes);
    setCustomInputMinutes(minutes);
    if (mode === 'work') {
      setTimeLeft(minutes * 60);
    }
  };

  const handleApplyCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInputMinutes < 1) return;
    setIsRunning(false);
    setWorkMinutes(customInputMinutes);
    if (mode === 'work') {
      setTimeLeft(customInputMinutes * 60);
    }
    setIsCustomizing(false);
  };

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress circle percentage
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentTotalSeconds - timeLeft) / currentTotalSeconds) * 100)
  );

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C724B] flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#B08D57]" /> Sanctum of Focus
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-[#2A231C] mt-1">
            Pomodoro Chamber
          </h1>
          <p className="text-xs text-[#7A6D5E]">
            Watch {character.name} focus and channel momentum as the sands of time flow.
          </p>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => playGentleChime({ volume: 0.7 })}
            className="px-2.5 py-2 rounded-xl bg-[#FAF7F0] border border-[#DDD2BC] text-[#554637] hover:bg-[#F2ECE0] transition-colors shadow-2xs text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Preview gentle finishing chime sound"
          >
            <Bell className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Test Chime</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-[#FAF7F0] border border-[#DDD2BC] text-[#554637] hover:bg-[#F2ECE0] transition-colors shadow-2xs cursor-pointer"
            title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="px-3 py-2 rounded-xl bg-[#FAF7F0] border border-[#DDD2BC] text-xs font-semibold text-[#554637] hover:bg-[#F2ECE0] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Set Duration</span>
          </button>
        </div>
      </div>

      {/* Celebration Banner */}
      {celebrationBanner && (
        <div className="p-4 rounded-2xl bg-[#E8F3E6] border border-[#BEDDB8] text-[#285724] font-semibold text-xs flex items-center justify-between shadow-xs animate-bounce-subtle">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#3A7E35]" />
            <span>{celebrationBanner}</span>
          </div>
          <button 
            onClick={() => setCelebrationBanner(null)}
            className="text-xs hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Custom Duration Settings Popdown */}
      {isCustomizing && (
        <div className="bg-[#FAF7F0] border border-[#E2D8C3] rounded-2xl p-5 shadow-sm animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7966] flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" /> Configure Timer Intervals
            </h3>
            <button 
              onClick={() => setIsCustomizing(false)}
              className="text-xs text-[#8A7966] hover:text-[#2C241C]"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleApplyCustomTime} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[#554737] block mb-1">
                Focus Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="180"
                value={customInputMinutes}
                onChange={(e) => setCustomInputMinutes(Number(e.target.value))}
                className="w-full text-xs font-bold bg-[#F2ECE0] border border-[#DDD2BC] rounded-xl px-3 py-2 text-[#2A231C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#554737] block mb-1">
                Short Break (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={shortBreakMinutes}
                onChange={(e) => setShortBreakMinutes(Number(e.target.value))}
                className="w-full text-xs font-bold bg-[#F2ECE0] border border-[#DDD2BC] rounded-xl px-3 py-2 text-[#2A231C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#554737] block mb-1">
                Long Break (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={longBreakMinutes}
                onChange={(e) => setLongBreakMinutes(Number(e.target.value))}
                className="w-full text-xs font-bold bg-[#F2ECE0] border border-[#DDD2BC] rounded-xl px-3 py-2 text-[#2A231C]"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#2E251C] hover:bg-[#45372A] text-white text-xs font-semibold"
              >
                Apply Custom Times
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mode Switcher (Work, Short Break, Long Break) */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-[#EFE9DC] border border-[#DDD2BC] shadow-2xs">
          <button
            onClick={() => handleModeSwitch('work')}
            className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'work'
                ? 'bg-[#2E251C] text-white shadow-xs'
                : 'text-[#6C5E4E] hover:text-[#2A231C]'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Focus Session ({workMinutes}m)</span>
          </button>

          <button
            onClick={() => handleModeSwitch('shortBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'shortBreak'
                ? 'bg-[#2E251C] text-white shadow-xs'
                : 'text-[#6C5E4E] hover:text-[#2A231C]'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Short Break ({shortBreakMinutes}m)</span>
          </button>

          <button
            onClick={() => handleModeSwitch('longBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'longBreak'
                ? 'bg-[#2E251C] text-white shadow-xs'
                : 'text-[#6C5E4E] hover:text-[#2A231C]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Long Break ({longBreakMinutes}m)</span>
          </button>
        </div>
      </div>

      {/* Main Centerpiece: Animated Character Stage + Circular Timer Ring */}
      <div className="bg-[#FAF7F0] border-2 border-[#E2D8C3] rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden flex flex-col items-center justify-center">
        {/* Dynamic ambient background glow that pulses when working */}
        <div 
          className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
            isRunning 
              ? 'opacity-25 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400 via-indigo-400 to-transparent animate-pulse' 
              : 'opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400 to-transparent'
          }`} 
        />

        {/* Stage Presentation Container */}
        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md w-full">
          
          {/* Animated Pixel Art Hero Podium */}
          <div className="relative">
            {/* Pulsing Aura Ring when Timer is Running */}
            {isRunning && (
              <div className="absolute -inset-4 rounded-3xl bg-amber-400/20 blur-xl animate-ping" />
            )}

            <div className={`p-4 rounded-3xl bg-[#231E18] border-2 border-[#D4B37D] shadow-2xl transition-all ${
              isRunning ? 'ring-4 ring-[#B08D57]/40 scale-105' : ''
            }`}>
              <PixelAvatar
                character={character}
                size="hero"
                animated={true}
                isWorking={isRunning}
              />
            </div>

            {/* Live Status Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 whitespace-nowrap ${
                isRunning
                  ? 'bg-[#2E251C] text-[#FEF08A] ring-2 ring-[#FEF08A]/50'
                  : 'bg-[#EFE9DC] text-[#695B4C] border border-[#DDD2BC]'
              }`}>
                {isRunning ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#FEF08A] animate-ping" />
                    Focus Flow Active
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#8E7E6F]" />
                    Ready to Begin
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Character Dialogue / Action Status */}
          <div className="pt-2 space-y-1">
            <h3 className="font-serif-display text-lg font-bold text-[#2A231C]">
              {character.name}
            </h3>
            <p className="text-xs text-[#7A6D5E] italic">
              {isRunning
                ? mode === 'work'
                  ? `Focus mode active. Flowing smoothly through your work...`
                  : `Taking a restful break. Breathe and relax...`
                : `Ready for your next session. Press play when prepared.`}
            </p>
          </div>

          {/* Digital Clock Display */}
          <div className="space-y-2 w-full">
            <div className="font-serif-display font-bold text-6xl sm:text-7xl tracking-wider text-[#2A231C]">
              {formatTime(timeLeft)}
            </div>

            {/* Progress Bar with Parchment Style */}
            <div className="w-full bg-[#E8E1D1] h-3 rounded-full overflow-hidden p-0.5 border border-[#DACFBD]">
              <div 
                className="bg-gradient-to-r from-[#B08D57] via-[#8C724B] to-[#433629] h-full rounded-full transition-all duration-1000 ease-linear shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-[#8C7D6D] font-medium pt-1">
              <span>{Math.round(progressPercent)}% elapsed</span>
              <span>{Math.ceil(timeLeft / 60)}m remaining</span>
            </div>
          </div>

          {/* Primary Action Buttons (Play / Pause / Reset) */}
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={handleReset}
              className="p-3 rounded-2xl bg-[#EFE9DC] hover:bg-[#E5DDC9] border border-[#DDD2BC] text-[#554637] transition-all active:scale-95 shadow-2xs"
              title="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className={`px-8 py-4 rounded-2xl text-white font-bold text-sm tracking-wide shadow-md transition-all active:scale-95 flex items-center gap-2 ${
                isRunning
                  ? 'bg-[#A84B42] hover:bg-[#933D35]'
                  : 'bg-[#2E251C] hover:bg-[#45372A]'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause Focus</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Begin Session</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toggleable Ambient Nature & Lo-Fi Focus Audio Player */}
      <AmbientAudioPlayer
        isFocusTimerRunning={isRunning && mode === 'work'}
        autoPlayOnFocus={autoPlayAmbient}
        onAutoPlayChange={setAutoPlayAmbient}
      />

      {/* Presets Row & Optional Task Association */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Quick Presets */}
        <div className="bg-[#FAF7F0] border border-[#E2D8C3] rounded-2xl p-4 shadow-2xs space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8A7966] block">
            Quick Duration Presets
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[15, 25, 45, 60].map(mins => (
              <button
                key={mins}
                onClick={() => handleSetPreset(mins)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  workMinutes === mins && mode === 'work'
                    ? 'bg-[#2E251C] text-white border-[#2E251C] shadow-xs'
                    : 'bg-[#F2ECE0] border-[#DDD2BC] text-[#554637] hover:bg-[#EBE3D4]'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Link with active Task */}
        <div className="bg-[#FAF7F0] border border-[#E2D8C3] rounded-2xl p-4 shadow-2xs space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8A7966] block">
            Dedicate Session to Task
          </span>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full text-xs font-semibold bg-[#F2ECE0] border border-[#DDD2BC] rounded-xl px-3 py-2 text-[#2A231C] focus:outline-none"
          >
            <option value="">-- Freewriting / Unbound Study --</option>
            {tasks.filter(t => !t.completed).map(task => (
              <option key={task.id} value={task.id}>
                {task.title} (#{task.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Character Profile Quick Bar */}
      <div className="bg-[#FAF7F0] border border-[#E2D8C3] rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PixelAvatar character={character} size="sm" animated={true} />
          <div>
            <h4 className="text-xs font-bold text-[#2A231C]">
              {character.name} • Pixel Avatar
            </h4>
            <p className="text-[11px] text-[#7A6D5E]">
              {character.completedPomodoros || 0} pomodoros completed • {character.totalFocusMinutes || 0} minutes focused
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCharacterCreator}
          className="px-3 py-1.5 rounded-xl bg-[#EFE9DC] hover:bg-[#E6DEC9] border border-[#DDD2BC] text-xs font-semibold text-[#483B2D] flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>Change Avatar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
