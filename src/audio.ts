/** Tiny synthesized sound kit — no audio files, no network, all offline. */
export class SoundKit {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  muted = false;

  unlock(): void {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) return;
      this.ctx = new AudioContextClass();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.28;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : 0.28;
  }

  private tone(
    frequency: number,
    duration: number,
    options: {
      type?: OscillatorType;
      volume?: number;
      slideTo?: number;
      delay?: number;
    } = {},
  ): void {
    if (!this.ctx || !this.master || this.muted) return;
    const { type = 'sine', volume = 0.2, slideTo, delay = 0 } = options;
    const start = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, start);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(this.master);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  }

  private noise(duration: number, volume = 0.16, filterFreq = 1200): void {
    if (!this.ctx || !this.master || this.muted) return;
    const length = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 0.8;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    source.connect(filter).connect(gain).connect(this.master);
    source.start();
  }

  click(): void {
    this.tone(720, 0.055, { type: 'triangle', volume: 0.12, slideTo: 540 });
  }

  hover(): void {
    this.tone(880, 0.035, { type: 'sine', volume: 0.04 });
  }

  roll(): void {
    this.noise(0.22, 0.18, 900);
    for (let i = 0; i < 4; i += 1) {
      this.tone(260 + i * 60, 0.05, {
        type: 'square',
        volume: 0.05,
        delay: 0.05 + i * 0.045,
      });
    }
  }

  hop(): void {
    this.tone(440, 0.06, { type: 'triangle', volume: 0.07, slideTo: 620 });
  }

  coin(): void {
    this.tone(880, 0.12, { type: 'triangle', volume: 0.15 });
    this.tone(1320, 0.18, { type: 'triangle', volume: 0.12, delay: 0.07 });
  }

  buy(): void {
    this.tone(523, 0.16, { type: 'triangle', volume: 0.13 });
    this.tone(659, 0.2, { type: 'triangle', volume: 0.12, delay: 0.08 });
    this.tone(784, 0.28, { type: 'triangle', volume: 0.11, delay: 0.16 });
  }

  event(): void {
    this.tone(660, 0.2, { type: 'sine', volume: 0.1 });
    this.tone(990, 0.3, { type: 'sine', volume: 0.08, delay: 0.1 });
  }

  bad(): void {
    this.tone(320, 0.22, { type: 'sawtooth', volume: 0.08, slideTo: 170 });
    this.tone(170, 0.28, { type: 'triangle', volume: 0.1, delay: 0.12 });
  }

  good(): void {
    this.tone(659, 0.14, { type: 'triangle', volume: 0.12 });
    this.tone(880, 0.22, { type: 'triangle', volume: 0.1, delay: 0.1 });
  }

  win(): void {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((note, index) => {
      this.tone(note, 0.5, {
        type: 'triangle',
        volume: 0.13,
        delay: index * 0.13,
      });
      this.tone(note / 2, 0.5, {
        type: 'sine',
        volume: 0.08,
        delay: index * 0.13,
      });
    });
  }

  retire(): void {
    this.tone(392, 0.4, { type: 'sine', volume: 0.12 });
    this.tone(523, 0.5, { type: 'sine', volume: 0.1, delay: 0.18 });
    this.tone(659, 0.7, { type: 'sine', volume: 0.08, delay: 0.36 });
  }

  turn(): void {
    this.tone(520, 0.08, { type: 'sine', volume: 0.06 });
    this.tone(690, 0.1, { type: 'sine', volume: 0.05, delay: 0.04 });
  }
}

export const sound = new SoundKit();
