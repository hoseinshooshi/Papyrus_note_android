/**
 * High-quality Web Audio Ambient Soundscapes Generator
 * Synthesizes relaxing, loopable nature and lo-fi audio without external media dependencies.
 */

export type AmbientSoundType = 'rain' | 'forest' | 'lofi' | 'waves' | 'drone';

export interface SoundPreset {
  id: AmbientSoundType;
  name: string;
  nameFa: string;
  icon: string;
  tagline: string;
  description: string;
  color: string;
}

export const AMBIENT_PRESETS: SoundPreset[] = [
  {
    id: 'rain',
    name: 'Gentle Rain',
    nameFa: 'باران ملایم',
    icon: '🌧️',
    tagline: 'Window raindrops & calm rumble',
    description: 'Continuous soft rainfall with filtered white noise and subtle water droplet taps.',
    color: '#3B82F6',
  },
  {
    id: 'forest',
    name: 'Forest Breeze',
    nameFa: 'نسیم جنگل و پرندگان',
    icon: '🍃',
    tagline: 'Canopy wind & gentle birds',
    description: 'Warm breeze through green leaves paired with periodic chirping birds.',
    color: '#10B981',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Coffeehouse',
    nameFa: 'کافه لوفای و وینیل',
    icon: '☕',
    tagline: 'Analog vinyl crackle & warm chords',
    description: 'Subtle nostalgic vinyl record crackle with calming, tape-warmed chord pads.',
    color: '#D97706',
  },
  {
    id: 'waves',
    name: 'Ocean Tide',
    nameFa: 'موج‌های ساحل آرام',
    icon: '🌊',
    tagline: 'Rhythmic surf & shore swells',
    description: 'Gentle waves rolling onto smooth pebbles in slow, meditative rhythms.',
    color: '#06B6D4',
  },
  {
    id: 'drone',
    name: 'Celestial Focus',
    nameFa: 'ارتعاش عمیق کیهانی ۴۳۲ هرتز',
    icon: '🌌',
    tagline: '432Hz deep meditative drone',
    description: 'Binaural harmonic undertones designed for deep thought and flow state.',
    color: '#8B5CF6',
  },
];

class AmbientEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private currentType: AmbientSoundType | null = null;
  private isPlaying = false;
  private volume = 0.6;
  private intervalIds: number[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentType(): AmbientSoundType | null {
    return this.currentType;
  }

  public stop() {
    this.intervalIds.forEach(id => window.clearInterval(id));
    this.intervalIds = [];

    if (this.masterGain && this.ctx) {
      // Fade out gently to avoid popping
      this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    }

    setTimeout(() => {
      this.activeNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch {
          // ignore already stopped nodes
        }
      });
      this.activeNodes = [];
      this.isPlaying = false;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      }
    }, 180);
  }

  public play(type: AmbientSoundType) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    // If already playing this type, ensure volume is restored and return
    if (this.isPlaying && this.currentType === type) {
      return;
    }

    this.stop();
    this.currentType = type;
    this.isPlaying = true;

    // Small delay to let previous stop fade out
    setTimeout(() => {
      if (!this.isPlaying) return;
      if (!this.ctx || !this.masterGain) return;
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      switch (type) {
        case 'rain':
          this.startRainSound();
          break;
        case 'forest':
          this.startForestSound();
          break;
        case 'lofi':
          this.startLofiSound();
          break;
        case 'waves':
          this.startWavesSound();
          break;
        case 'drone':
          this.startDroneSound();
          break;
      }
    }, 200);
  }

  // --- 1. Rain Synthesizer ---
  private startRainSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // White/Pink noise buffer
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Rain lowpass filter (muffles harsh highs into soft patter)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);

    // Rain gain
    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.45, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);
    noiseSource.start();

    this.activeNodes.push(noiseSource, rainGain, filter);

    // Periodic random water droplets
    const dropInterval = window.setInterval(() => {
      if (!this.isPlaying || this.currentType !== 'rain') return;
      try {
        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();
        const startFreq = 1800 + Math.random() * 800;
        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(startFreq, ctx.currentTime);
        dropOsc.frequency.exponentialRampToValueAtTime(startFreq * 0.6, ctx.currentTime + 0.04);

        dropGain.gain.setValueAtTime(0.04 + Math.random() * 0.04, ctx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

        dropOsc.connect(dropGain);
        dropGain.connect(this.masterGain!);
        dropOsc.start();
        dropOsc.stop(ctx.currentTime + 0.05);
      } catch {
        // ignore drop errors
      }
    }, 180);
    this.intervalIds.push(dropInterval);
  }

  // --- 2. Forest Breeze & Birds Synthesizer ---
  private startForestSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Wind noise
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const windSource = ctx.createBufferSource();
    windSource.buffer = buffer;
    windSource.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(320, ctx.currentTime);
    windFilter.Q.setValueAtTime(1.8, ctx.currentTime);

    // Slow LFO to modulate breeze intensity
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(180, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(windFilter.frequency);
    lfo.start();

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.6, ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    windSource.start();

    this.activeNodes.push(windSource, windFilter, windGain, lfo, lfoGain);

    // Bird chirping generator
    const birdInterval = window.setInterval(() => {
      if (!this.isPlaying || this.currentType !== 'forest') return;
      if (Math.random() > 0.45) return;

      try {
        const baseFreq = 2600 + Math.random() * 1200;
        const count = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const chirpOsc = ctx.createOscillator();
          const chirpGain = ctx.createGain();
          const time = ctx.currentTime + i * 0.09;

          chirpOsc.type = 'sine';
          chirpOsc.frequency.setValueAtTime(baseFreq, time);
          chirpOsc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, time + 0.04);
          chirpOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, time + 0.07);

          chirpGain.gain.setValueAtTime(0.001, time);
          chirpGain.gain.linearRampToValueAtTime(0.05, time + 0.02);
          chirpGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);

          chirpOsc.connect(chirpGain);
          chirpGain.connect(this.masterGain!);
          chirpOsc.start(time);
          chirpOsc.stop(time + 0.08);
        }
      } catch {
        // ignore
      }
    }, 3200);
    this.intervalIds.push(birdInterval);
  }

  // --- 3. Lo-Fi Coffeehouse Synthesizer ---
  private startLofiSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Vinyl crackle (soft random clicks)
    const crackleInterval = window.setInterval(() => {
      if (!this.isPlaying || this.currentType !== 'lofi') return;
      if (Math.random() > 0.3) {
        try {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(800 + Math.random() * 3000, ctx.currentTime);
          g.gain.setValueAtTime(0.015 + Math.random() * 0.02, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.012);
          osc.connect(g);
          g.connect(this.masterGain!);
          osc.start();
          osc.stop(ctx.currentTime + 0.015);
        } catch {
          // ignore
        }
      }
    }, 60);
    this.intervalIds.push(crackleInterval);

    // Warm Lo-Fi Chords progression (Fmaj7 - Em7 - Dm7 - Cmaj7)
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [164.81, 196.00, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.00, 261.63], // Dm7
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
    ];

    let chordIndex = 0;
    const playCurrentChord = () => {
      if (!this.isPlaying || this.currentType !== 'lofi') return;
      const freqs = chords[chordIndex % chords.length];
      chordIndex++;

      freqs.forEach(f => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          // Warm lo-fi mellow triangle tone
          osc.type = 'triangle';
          // Tape flutter / vibrato
          osc.frequency.setValueAtTime(f * (0.996 + Math.random() * 0.008), ctx.currentTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, ctx.currentTime);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.2);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain!);

          osc.start();
          osc.stop(ctx.currentTime + 5.0);
        } catch {
          // ignore
        }
      });
    };

    playCurrentChord();
    const chordInterval = window.setInterval(playCurrentChord, 4500);
    this.intervalIds.push(chordInterval);
  }

  // --- 4. Ocean Waves Synthesizer ---
  private startWavesSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 2.5; // brownian noise
    }

    const waveSource = ctx.createBufferSource();
    waveSource.buffer = buffer;
    waveSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, ctx.currentTime);

    // Wave swell LFO
    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.15, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec ocean swell period
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(250, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    waveSource.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);
    waveSource.start();

    this.activeNodes.push(waveSource, filter, waveGain, lfo, lfoGain);
  }

  // --- 5. Deep Celestial Drone (432Hz) ---
  private startDroneSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const freqs = [108, 216, 432, 648]; // 432Hz harmonics
    freqs.forEach((f, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, ctx.currentTime);

        const amp = 0.06 / (idx + 1);
        gain.gain.setValueAtTime(amp, ctx.currentTime);

        // subtle detuning LFO for slow binaural beat
        const detuneLfo = ctx.createOscillator();
        detuneLfo.frequency.setValueAtTime(0.08 + idx * 0.02, ctx.currentTime);
        const detuneGain = ctx.createGain();
        detuneGain.gain.setValueAtTime(1.5, ctx.currentTime);
        detuneLfo.connect(detuneGain);
        detuneGain.connect(osc.frequency);
        detuneLfo.start();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);
        osc.start();

        this.activeNodes.push(osc, gain, filter, detuneLfo, detuneGain);
      } catch {
        // ignore
      }
    });
  }
}

export const ambientEngine = new AmbientEngine();
