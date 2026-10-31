// Tiny synthesised sound engine: no audio files, no downloads, and it works
// offline. All sounds are created with oscillators and a little filtered noise.

let ctx = null;
let master = null;
let muted = false;

function ensureContext() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    ctx = new AudioCtor();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, duration, { type = 'sine', gain = 0.2, when = 0, slide = null, attack = 0.005 } = {}) {
  const audio = ensureContext();
  if (!audio || muted) return;
  const start = audio.currentTime + when;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slide), start + duration);
  amp.gain.setValueAtTime(0.0001, start);
  amp.gain.exponentialRampToValueAtTime(gain, start + attack);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp);
  amp.connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function noise(duration, { gain = 0.15, when = 0, frequency = 1200, q = 0.8 } = {}) {
  const audio = ensureContext();
  if (!audio || muted) return;
  const start = audio.currentTime + when;
  const frames = Math.max(1, Math.floor(audio.sampleRate * duration));
  const buffer = audio.createBuffer(1, frames, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const source = audio.createBufferSource();
  source.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = frequency;
  filter.Q.value = q;
  const amp = audio.createGain();
  amp.gain.setValueAtTime(gain, start);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter);
  filter.connect(amp);
  amp.connect(master);
  source.start(start);
}

export function unlockAudio() {
  ensureContext();
}

export function setMuted(value) {
  muted = Boolean(value);
  if (!muted) unlockAudio();
}

export function isMuted() {
  return muted;
}

export function play(name) {
  if (muted) return;
  switch (name) {
    case 'click':
      tone(520, 0.05, { type: 'triangle', gain: 0.08 });
      break;
    case 'dice':
      noise(0.09, { gain: 0.12, frequency: 1800, q: 1.2 });
      noise(0.07, { gain: 0.1, frequency: 900, when: 0.11 });
      noise(0.06, { gain: 0.09, frequency: 1400, when: 0.24 });
      break;
    case 'diceLand':
      noise(0.12, { gain: 0.16, frequency: 700, q: 1 });
      tone(190, 0.1, { type: 'triangle', gain: 0.12, slide: 130 });
      break;
    case 'step':
      tone(440, 0.06, { type: 'triangle', gain: 0.07, slide: 520 });
      break;
    case 'coin':
      tone(880, 0.12, { type: 'triangle', gain: 0.13 });
      tone(1318, 0.18, { type: 'triangle', gain: 0.1, when: 0.06 });
      break;
    case 'buy':
      [523, 659, 784].forEach((f, i) => tone(f, 0.18, { type: 'triangle', gain: 0.12, when: i * 0.07 }));
      break;
    case 'rent':
      tone(392, 0.16, { type: 'triangle', gain: 0.11 });
      tone(294, 0.22, { type: 'triangle', gain: 0.1, when: 0.12 });
      break;
    case 'card':
      noise(0.16, { gain: 0.09, frequency: 2200, q: 0.6 });
      tone(660, 0.12, { type: 'sine', gain: 0.07, when: 0.05 });
      break;
    case 'choice':
      [523, 784].forEach((f, i) => tone(f, 0.22, { type: 'sine', gain: 0.1, when: i * 0.1 }));
      break;
    case 'joy':
      [659, 880, 1046].forEach((f, i) => tone(f, 0.25, { type: 'sine', gain: 0.09, when: i * 0.08 }));
      break;
    case 'bad':
      tone(220, 0.28, { type: 'sawtooth', gain: 0.07, slide: 120 });
      break;
    case 'retire':
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.45, { type: 'sine', gain: 0.09, when: i * 0.12 }));
      break;
    case 'win':
      [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.5, { type: 'triangle', gain: 0.1, when: i * 0.11 }));
      tone(1568, 0.8, { type: 'sine', gain: 0.08, when: 0.55 });
      break;
    case 'bankrupt':
      [392, 330, 262, 196].forEach((f, i) => tone(f, 0.4, { type: 'sawtooth', gain: 0.07, when: i * 0.14 }));
      break;
    default:
      tone(600, 0.08, { type: 'triangle', gain: 0.08 });
  }
}
