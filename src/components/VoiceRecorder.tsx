import React, { useState, useRef, useEffect } from 'react';
import { JournalAudioRecording } from '../types';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Volume2, 
  Radio, 
  FileAudio,
  Check,
  RotateCcw
} from 'lucide-react';

interface VoiceRecorderProps {
  recording?: JournalAudioRecording;
  onSaveRecording: (recording?: JournalAudioRecording) => void;
  onTranscribeText?: (text: string) => void;
  onRecordingStateChange?: (isRecording: boolean, stream?: MediaStream | null) => void;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  recording,
  onSaveRecording,
  onTranscribeText,
  onRecordingStateChange,
  className = '',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Format seconds to mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone recording is not supported on this device/browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      activeStreamRef.current = stream;
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          onSaveRecording({
            audioDataUrl: base64Audio,
            durationSeconds: elapsedSeconds,
            recordedAt: Date.now(),
          });
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        activeStreamRef.current = null;
        if (onRecordingStateChange) {
          onRecordingStateChange(false, null);
        }
      };

      // Optional Speech recognition for live voice-to-text dictation
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition && onTranscribeText) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript + ' ';
              }
            }
            if (transcript.trim()) {
              onTranscribeText(transcript.trim());
            }
          };
          recognition.start();
          recognitionRef.current = recognition;
        } catch (recErr) {
          console.log('Speech recognition not available or denied:', recErr);
        }
      }

      mediaRecorder.start(200);
      setIsRecording(true);
      setElapsedSeconds(0);
      if (onRecordingStateChange) {
        onRecordingStateChange(true, stream);
      }

      timerIntervalRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setErrorMessage(err.message || 'Could not access microphone.');
      if (onRecordingStateChange) {
        onRecordingStateChange(false, null);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      if (onRecordingStateChange) {
        onRecordingStateChange(false, null);
      }
    }
  };

  const handleTogglePlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      const progress = (audioPlayerRef.current.currentTime / audioPlayerRef.current.duration) * 100;
      setPlayProgress(isNaN(progress) ? 0 : progress);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlayProgress(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioPlayerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newPercent = Math.max(0, Math.min(1, clickX / width));
    audioPlayerRef.current.currentTime = newPercent * audioPlayerRef.current.duration;
  };

  return (
    <div className={`p-4 rounded-2xl border border-[#DFD5C0] bg-[#FAF7F0] space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#45382B] flex items-center gap-1.5">
          <Mic className="w-4 h-4 text-[#B08D57]" />
          Voice Journal & Audio Note
        </span>
        {recording && !isRecording && (
          <span className="text-[10px] font-semibold text-[#8C7A68] bg-[#EDE5D3] px-2 py-0.5 rounded-full">
            {formatTime(recording.durationSeconds)} recorded
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="p-2 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[11px] text-[#991B1B]">
          {errorMessage}
        </div>
      )}

      {/* When actively recording */}
      {isRecording ? (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#FEF2F2] border border-[#F87171]/40 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            <div className="text-xs font-mono font-bold text-[#991B1B]">
              REC {formatTime(elapsedSeconds)}
            </div>
            {/* Audio wave animation */}
            <div className="flex items-center gap-0.5 h-4">
              <span className="w-1 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
              <span className="w-1 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s] h-5" />
              <span className="w-1 bg-red-500 rounded-full animate-bounce h-2" />
              <span className="w-1 bg-red-500 rounded-full animate-bounce [animation-delay:-0.2s] h-4" />
            </div>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            Finish Recording
          </button>
        </div>
      ) : recording?.audioDataUrl ? (
        /* When an audio recording exists: show audio player */
        <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E4DAC6] space-y-2 shadow-2xs">
          <audio
            ref={audioPlayerRef}
            src={recording.audioDataUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnded}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-8 h-8 rounded-full bg-[#2E251C] hover:bg-[#433629] text-white flex items-center justify-center cursor-pointer shadow-xs transition-transform active:scale-95"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Scrubber track */}
            <div 
              onClick={handleSeek}
              className="flex-1 h-3 bg-[#EDE5D3] rounded-full overflow-hidden cursor-pointer relative"
            >
              <div 
                className="h-full bg-[#B08D57] transition-all duration-100 rounded-full"
                style={{ width: `${playProgress}%` }}
              />
            </div>

            <div className="text-[11px] font-mono text-[#695B4C] min-w-10 text-right">
              {formatTime(recording.durationSeconds)}
            </div>

            <button
              type="button"
              onClick={() => onSaveRecording(undefined)}
              className="p-1 text-[#991B1B] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
              title="Delete audio memo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#7A6D5E] pt-1">
            <span className="flex items-center gap-1">
              <FileAudio className="w-3 h-3 text-[#B08D57]" />
              Voice note attached
            </span>
            <button
              type="button"
              onClick={startRecording}
              className="text-[#8C724B] hover:text-[#5B472E] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Re-record
            </button>
          </div>
        </div>
      ) : (
        /* Empty state: Record voice note button */
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF3E3] hover:bg-[#F3E7CD] border border-[#DFCFA8] text-xs font-bold text-[#6D5220] transition-colors cursor-pointer shadow-2xs"
          >
            <Mic className="w-4 h-4 text-[#A87E3B]" />
            <span>Record Voice Memo</span>
          </button>
          <span className="text-[10px] text-[#8C7A68]">
            Speaks directly into your daily journal
          </span>
        </div>
      )}
    </div>
  );
};
