/**
 * Web Audio API Sound Synthesizer & Speech Synthesis
 * Fully client-side, zero external audio asset dependencies.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMusicEnabled: boolean = false;
  private isSfxEnabled: boolean = true;
  private bgmTimer: number | null = null;
  private speechRate: number = 0.9;


  private practicePreset: 'gentle' | 'playful' | 'minimal' = 'gentle';
  private practiceVolume = 0.35;
  private practiceEnabled = true;
  private practiceLoaded = false;

  private loadPracticeSettings() {
    if (this.practiceLoaded || typeof window === 'undefined') return;
    this.practiceLoaded = true;
    try {
      const saved = JSON.parse(window.localStorage.getItem('biology-practice-sound-v1') || '{}');
      if (['gentle', 'playful', 'minimal'].includes(saved.preset)) this.practicePreset = saved.preset;
      if (typeof saved.volume === 'number' && Number.isFinite(saved.volume)) this.practiceVolume = Math.max(0, Math.min(1, saved.volume));
      if (typeof saved.enabled === 'boolean') this.practiceEnabled = saved.enabled;
    } catch {}
  }

  public getPracticeSettings() {
    this.loadPracticeSettings();
    return { enabled: this.practiceEnabled, volume: this.practiceVolume, preset: this.practicePreset };
  }

  public setPracticeSettings(settings: Partial<{enabled: boolean; volume: number; preset: 'gentle' | 'playful' | 'minimal'}>) {
    this.loadPracticeSettings();
    if (typeof settings.enabled === 'boolean') this.practiceEnabled = settings.enabled;
    if (typeof settings.volume === 'number' && Number.isFinite(settings.volume)) this.practiceVolume = Math.max(0, Math.min(1, settings.volume));
    if (settings.preset && ['gentle', 'playful', 'minimal'].includes(settings.preset)) this.practicePreset = settings.preset;
    try { window.localStorage.setItem('biology-practice-sound-v1', JSON.stringify(this.getPracticeSettings())); } catch {}
    return this.getPracticeSettings();
  }

  public playPracticeSound(effect: 'tap' | 'place' | 'remove' | 'correct' | 'wrong' | 'complete') {
    this.loadPracticeSettings();
    if (!this.practiceEnabled || this.practiceVolume <= 0) return;
    const ctx = this.initCtx();
    if (!ctx) return;
    const sequences: Record<string, number[][]> = {
      tap: [[620,0,.075]], place: [[440,0,.09],[660,.09,.14]],
      remove: [[370,0,.12]], correct: [[523,0,.15],[659,.14,.17],[784,.3,.23]],
      wrong: [[330,0,.16],[277,.17,.22]],
      complete: [[523,0,.17],[659,.15,.17],[784,.3,.19],[1047,.46,.3]]
    };
    const speed = this.practicePreset === 'minimal' ? .6 : this.practicePreset === 'playful' ? .85 : 1;
    const pitch = this.practicePreset === 'minimal' ? .9 : this.practicePreset === 'playful' ? 1.15 : 1;
    const wave: OscillatorType = this.practicePreset === 'playful' ? 'triangle' : 'sine';
    const all = sequences[effect];
    const notes = this.practicePreset === 'minimal' && all.length > 2 ? [all[0],all[all.length-1]] : all;
    for (const [frequency, offset, duration] of notes) {
      try {
        const start = ctx.currentTime + offset * speed;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(frequency * pitch, start);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(Math.max(.0001, this.practiceVolume * .16), start + .012);
        gain.gain.exponentialRampToValueAtTime(.0001, start + duration * speed);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(start); osc.stop(start + duration * speed + .02);
      } catch {}
    }
  }

  constructor() {
    // AudioContext will be initialized upon first user interaction
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playTone(freq: number, type: OscillatorType, duration: number, vol: number) {
    if (!this.isSfxEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      gainNode.gain.setValueAtTime(vol, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback handling
    }
  }

  public playConnectSound() {
    this.playTone(600, 'sine', 0.1, 0.12);
  }

  public playRemoveSound() {
    this.playTone(320, 'triangle', 0.14, 0.15);
  }

  public playLockSound() {
    this.playTone(160, 'sawtooth', 0.25, 0.2);
  }

  public playCorrectSound() {
    if (!this.isSfxEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    [
      { f: 880, start: 0, dur: 0.25 },
      { f: 1108.73, start: 0.08, dur: 0.35 },
    ].forEach((note) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, now + note.start);
        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.12, now + note.start);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.start + note.dur);

        osc.start(now + note.start);
        osc.stop(now + note.start + note.dur);
      } catch {
        // Fallback
      }
    });
  }

  public playWrongSound() {
    this.playTone(240, 'sawtooth', 0.35, 0.14);
  }

  public playVictoryEDM() {
    if (!this.isSfxEnabled) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { f: 523.25, offset: 0.0, dur: 0.16 }, // C5
      { f: 659.25, offset: 0.14, dur: 0.16 }, // E5
      { f: 783.99, offset: 0.28, dur: 0.16 }, // G5
      { f: 1046.5, offset: 0.42, dur: 0.65 }, // C6
      { f: 1318.51, offset: 0.55, dur: 0.8 }, // E6 chord
    ];

    notes.forEach((n, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx >= 3 ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(n.f, now + n.offset);
        osc.connect(gain);
        gain.connect(ctx.destination);

        const startTime = now + n.offset;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + n.dur);

        osc.start(startTime);
        osc.stop(startTime + n.dur);
      } catch {
        // Fallback
      }
    });
  }

  // Ambient BGM synthesizer
  private playBgmNote = () => {
    if (!this.isMusicEnabled) return;
    const scales = [
      [261.63, 293.66, 329.63, 392.0, 440.0], // C major pentatonic
      [329.63, 392.0, 440.0, 493.88, 587.33], // E minor pentatonic
    ];
    const scale = scales[Math.floor(Math.random() * scales.length)];
    const freq = scale[Math.floor(Math.random() * scale.length)];

    const ctx = this.initCtx();
    if (ctx) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

        osc.start();
        osc.stop(ctx.currentTime + 2.5);
      } catch {
        // Fallback
      }
    }

    this.bgmTimer = window.setTimeout(this.playBgmNote, 600 + Math.random() * 1000);
  };

  public toggleMusic(forceState?: boolean): boolean {
    this.initCtx();
    this.isMusicEnabled = forceState !== undefined ? forceState : !this.isMusicEnabled;
    if (this.isMusicEnabled) {
      this.playBgmNote();
    } else {
      if (this.bgmTimer) {
        window.clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
    }
    return this.isMusicEnabled;
  }

  public getMusicState(): boolean {
    return this.isMusicEnabled;
  }

  public toggleSfx(forceState?: boolean): boolean {
    this.isSfxEnabled = forceState !== undefined ? forceState : !this.isSfxEnabled;
    return this.isSfxEnabled;
  }

  public getSfxState(): boolean {
    return this.isSfxEnabled;
  }

  public setSpeechRate(rate: number) {
    this.speechRate = Math.max(0.5, Math.min(2.0, rate));
  }

  public speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = this.speechRate;
      window.speechSynthesis.speak(utterance);
    } catch {
      // TTS fallback
    }
  }
}

export const sound = new SoundSystem();
