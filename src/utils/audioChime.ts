// Web Audio API Synthesizer for Gentle Chimes & Bell Notifications

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx || audioCtx.state === 'closed') {
    audioCtx = new AudioContextClass();
  }
  return audioCtx;
}

export interface ChimeOptions {
  volume?: number; // 0.0 to 1.0
  type?: 'tibetan' | 'crystal' | 'zen';
}

/**
 * Plays a warm, soothing meditation bell / singing bowl chime
 * using pure Web Audio API synthesis without external network assets.
 */
export async function playGentleChime(options: ChimeOptions = {}): Promise<void> {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const volume = Math.min(1, Math.max(0.01, options.volume ?? 0.65));
    const now = ctx.currentTime;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.45, now);
    masterGain.connect(ctx.destination);

    // Warm Low-pass filter to eliminate harshness
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3600, now);
    filter.connect(masterGain);

    // Meditative harmonious partials (Solfeggio 528Hz base chime)
    const tones = [
      { freq: 528.0, delay: 0.0, decay: 3.4, gain: 0.65 },    // Fundamental
      { freq: 792.0, delay: 0.03, decay: 3.0, gain: 0.4 },    // Harmonic 5th
      { freq: 1056.0, delay: 0.06, decay: 2.5, gain: 0.3 },   // Octave
      { freq: 1320.0, delay: 0.22, decay: 3.2, gain: 0.5 },   // High bell bell note
      { freq: 1584.0, delay: 0.25, decay: 2.6, gain: 0.25 },  // Overtones
      { freq: 2112.0, delay: 0.28, decay: 1.8, gain: 0.12 },  // Delicate shimmer
    ];

    tones.forEach(({ freq, delay, decay, gain: toneGain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);

      // Smooth attack to avoid clicks
      gainNode.gain.setValueAtTime(0.0001, now + delay);
      gainNode.gain.linearRampToValueAtTime(toneGain, now + delay + 0.02);
      // Gentle natural exponential ring-out
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + decay);

      osc.connect(gainNode);
      gainNode.connect(filter);

      osc.start(now + delay);
      osc.stop(now + delay + decay + 0.1);
    });

  } catch (err) {
    console.warn('Audio chime playback notice:', err);
  }
}
