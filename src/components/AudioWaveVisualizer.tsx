import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Check, X, Sparkles, Volume2 } from 'lucide-react';

interface AudioWaveVisualizerProps {
  isRecording: boolean;
  stream?: MediaStream | null;
  durationSeconds: number;
  interimTranscript?: string;
  onStop: () => void;
  onCancel?: () => void;
  onInsertTranscript?: (text: string) => void;
  className?: string;
}

export const AudioWaveVisualizer: React.FC<AudioWaveVisualizerProps> = ({
  isRecording,
  stream,
  durationSeconds,
  interimTranscript = '',
  onStop,
  onCancel,
  onInsertTranscript,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Connect Web Audio Analyser if stream is available
  useEffect(() => {
    if (!isRecording) return;

    let localAudioCtx: AudioContext | null = null;
    let localAnalyser: AnalyserNode | null = null;

    if (stream) {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          localAudioCtx = new AudioCtxClass();
          localAnalyser = localAudioCtx.createAnalyser();
          localAnalyser.fftSize = 128;
          localAnalyser.smoothingTimeConstant = 0.8;

          const source = localAudioCtx.createMediaStreamSource(stream);
          source.connect(localAnalyser);

          audioCtxRef.current = localAudioCtx;
          analyserRef.current = localAnalyser;
        }
      } catch (e) {
        console.log('Web Audio Analyser fallback:', e);
      }
    }

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (localAudioCtx && localAudioCtx.state !== 'closed') {
        localAudioCtx.close().catch(() => {});
      }
      audioCtxRef.current = null;
      analyserRef.current = null;
    };
  }, [isRecording, stream]);

  // Canvas wave animation loop
  useEffect(() => {
    if (!isRecording) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const dataArray = new Uint8Array(64);

    const renderWave = () => {
      phase += 0.08;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      let volume = 0.25;
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        volume = Math.max(0.15, Math.min(1.2, avg / 55));
        setAudioLevel(volume);
      } else {
        // Organic pseudo fluctuation when microphone analyser is not directly hooked
        volume = 0.35 + Math.sin(phase * 1.5) * 0.15 + Math.cos(phase * 0.7) * 0.1;
        setAudioLevel(volume);
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing wave ribbons
      // Background subtle wave
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(217, 164, 65, 0.35)';
      for (let x = 0; x < width; x += 3) {
        const norm = x / width;
        const envelope = Math.sin(norm * Math.PI); // tapering ends
        const y = centerY + Math.sin(norm * 12 + phase * 0.8) * 14 * volume * envelope
                          + Math.cos(norm * 8 - phase * 0.5) * 8 * volume * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Foreground main wave
      ctx.beginPath();
      ctx.lineWidth = 3;
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#C99E52');
      gradient.addColorStop(0.5, '#E5B869');
      gradient.addColorStop(1, '#9C7836');
      ctx.strokeStyle = gradient;

      for (let x = 0; x < width; x += 2) {
        const norm = x / width;
        const envelope = Math.sin(norm * Math.PI); // tapering ends
        const y = centerY + Math.sin(norm * 14 + phase * 1.2) * 22 * volume * envelope
                          + Math.sin(norm * 28 + phase * 1.8) * 6 * volume * envelope;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Dynamic frequency bars
      const numBars = 32;
      const barSpacing = width / numBars;
      const barWidth = Math.max(2.5, barSpacing * 0.45);

      for (let i = 0; i < numBars; i++) {
        const norm = i / (numBars - 1);
        const envelope = Math.sin(norm * Math.PI);
        const freqVal = dataArray[i % dataArray.length] || 0;
        
        // Combine real frequency data with harmonic oscillation
        const barHeight = Math.max(
          4,
          (freqVal > 0 
            ? (freqVal / 255) * 44 * envelope
            : (Math.sin(phase * 2 + i * 0.4) * 0.5 + 0.5) * 32 * volume * envelope)
        );

        const x = i * barSpacing + (barSpacing - barWidth) / 2;
        const y = centerY - barHeight / 2;

        const barGrad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        barGrad.addColorStop(0, '#E8C176');
        barGrad.addColorStop(0.5, '#B78F46');
        barGrad.addColorStop(1, '#8C672A');

        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      animFrameIdRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isRecording]);

  if (!isRecording) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 border-[#D8C7A3] bg-gradient-to-r from-[#FFFBF2] via-[#FBF5E8] to-[#FFFBF2] p-4 shadow-lg transition-all animate-fade-in ${className}`}>
      {/* Ambient background glow */}
      <div 
        className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#E5B869]/20 blur-2xl pointer-events-none transition-transform duration-300"
        style={{ transform: `scale(${1 + audioLevel * 0.6})` }}
      />
      <div 
        className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-[#B08D57]/20 blur-2xl pointer-events-none transition-transform duration-300"
        style={{ transform: `scale(${1 + audioLevel * 0.6})` }}
      />

      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Pulsing indicator */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-4 h-4 rounded-full bg-red-500/40 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#3B2F21] uppercase tracking-wider font-mono">
              Voice-to-Text Active
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#EDE2C7] text-[#594630] font-mono text-[11px] font-bold border border-[#D9CAAA]">
              {formatTime(durationSeconds)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {interimTranscript && onInsertTranscript && (
            <button
              type="button"
              onClick={() => onInsertTranscript(interimTranscript)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#2E251C] hover:bg-[#453729] text-[#FEF08A] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              title="Insert current spoken words into journal"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Insert Words</span>
            </button>
          )}

          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="Finish voice recording"
          >
            <Square className="w-3 h-3 fill-white" />
            <span>Done</span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-1 rounded-lg hover:bg-[#E8DCC2] text-[#786653] transition-colors cursor-pointer"
              title="Cancel recording"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Audio Wave Canvas Visualizer */}
      <div className="relative w-full h-16 bg-[#F4ECDA]/70 rounded-xl border border-[#DFD3B8] overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={640}
          height={64}
          className="w-full h-full block"
        />

        {/* Centered micro-caption overlay when starting */}
        {!interimTranscript && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-transparent">
            <span className="text-[11px] font-medium text-[#7C6952] bg-[#FAF5E8]/80 backdrop-blur-xs px-3 py-0.5 rounded-full border border-[#DFD3B8]/60 shadow-2xs flex items-center gap-1.5">
              <Mic className="w-3 h-3 text-[#B08D57] animate-pulse" />
              Listening... Speak your reflection clearly
            </span>
          </div>
        )}
      </div>

      {/* Real-time transcribed text preview banner */}
      <div className="mt-2 px-3 py-2 rounded-xl bg-[#FFFDF9]/90 border border-[#E4DAC2] text-xs text-[#2E2419] flex items-start gap-2 min-h-[38px] transition-all">
        <Sparkles className="w-3.5 h-3.5 text-[#B08D57] mt-0.5 shrink-0 animate-spin-slow" />
        <div className="flex-1 overflow-hidden">
          {interimTranscript ? (
            <p className="font-serif italic leading-relaxed text-[#2C2319]">
              "{interimTranscript}"
              <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#B08D57] animate-pulse align-middle" />
            </p>
          ) : (
            <p className="text-[#8F7E6C] italic font-serif">
              Speech will appear here in real time as you talk...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
