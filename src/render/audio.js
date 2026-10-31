/**
 * Tiny WebAudio synth. No audio files, nothing to download, and it starts only
 * after a user gesture (browser policy).
 */
export class AudioEngine {
  constructor() {
    this.ctx = null
    this.master = null
    this.musicGain = null
    this.muted = false
    this.musicTimer = null
    this.chordIndex = 0
    this.ready = false
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    this.ctx = new Ctx()
    this.master = this.ctx.createGain()
    this.master.gain.value = this.muted ? 0 : 0.55
    this.master.connect(this.ctx.destination)

    const delay = this.ctx.createDelay(0.6)
    delay.delayTime.value = 0.28
    const feedback = this.ctx.createGain()
    feedback.gain.value = 0.22
    const wet = this.ctx.createGain()
    wet.gain.value = 0.25
    this.master.connect(delay)
    delay.connect(feedback)
    feedback.connect(delay)
    delay.connect(wet)
    wet.connect(this.ctx.destination)

    this.musicGain = this.ctx.createGain()
    this.musicGain.gain.value = 0.5
    this.musicGain.connect(this.master)
    this.ready = true
    this.startMusic()
  }

  setMuted(muted) {
    this.muted = muted
    if (this.master) this.master.gain.setTargetAtTime(muted ? 0 : 0.55, this.ctx.currentTime, 0.05)
  }

  tone({ freq = 440, dur = 0.15, type = 'sine', gain = 0.08, slide = 0, delay = 0, lowpass = null }) {
    if (!this.ready || this.muted) return
    const t = this.ctx.currentTime + delay
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, t)
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur)
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(gain, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    let node = osc
    if (lowpass) {
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = lowpass
      node.connect(filter)
      node = filter
    }
    node.connect(g)
    g.connect(this.master)
    osc.start(t)
    osc.stop(t + dur + 0.05)
  }

  noise({ dur = 0.2, gain = 0.05, delay = 0, freq = 1200 }) {
    if (!this.ready || this.muted) return
    const t = this.ctx.currentTime + delay
    const size = Math.floor(this.ctx.sampleRate * dur)
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size)
    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = freq
    filter.Q.value = 0.8
    const g = this.ctx.createGain()
    g.gain.value = gain
    src.connect(filter)
    filter.connect(g)
    g.connect(this.master)
    src.start(t)
  }

  click() {
    this.tone({ freq: 680, dur: 0.05, type: 'triangle', gain: 0.035 })
  }

  hover() {
    this.tone({ freq: 940, dur: 0.035, type: 'sine', gain: 0.012 })
  }

  dice() {
    this.noise({ dur: 0.35, gain: 0.07, freq: 900 })
    for (let i = 0; i < 7; i++) {
      this.noise({ dur: 0.03, gain: 0.08, freq: 2400 + Math.random() * 1000, delay: 0.1 + i * 0.09 })
    }
  }

  hop() {
    this.tone({ freq: 420, dur: 0.08, type: 'sine', gain: 0.025, slide: 140 })
  }

  coin() {
    this.tone({ freq: 880, dur: 0.2, type: 'sine', gain: 0.05 })
    this.tone({ freq: 1320, dur: 0.25, type: 'sine', gain: 0.035, delay: 0.06 })
  }

  pay() {
    this.tone({ freq: 300, dur: 0.2, type: 'triangle', gain: 0.05, slide: -100 })
  }

  buy() {
    ;[523, 659, 784].forEach((f, i) => this.tone({ freq: f, dur: 0.3, type: 'triangle', gain: 0.05, delay: i * 0.07 }))
  }

  upgrade() {
    ;[392, 523, 659, 880].forEach((f, i) => this.tone({ freq: f, dur: 0.35, type: 'sine', gain: 0.04, delay: i * 0.06 }))
  }

  card() {
    this.noise({ dur: 0.25, gain: 0.035, freq: 1800 })
    this.tone({ freq: 520, dur: 0.15, type: 'sine', gain: 0.025, slide: 220 })
  }

  evolve() {
    ;[330, 392, 494, 587].forEach((f, i) =>
      this.tone({ freq: f, dur: 0.5, type: 'sine', gain: 0.018, delay: i * 0.09, lowpass: 1600 })
    )
  }

  error() {
    this.tone({ freq: 180, dur: 0.18, type: 'square', gain: 0.03 })
  }

  win() {
    const notes = [392, 523, 659, 784, 1046]
    notes.forEach((f, i) =>
      this.tone({ freq: f, dur: 0.6, type: 'triangle', gain: 0.055, delay: i * 0.12 })
    )
    this.tone({ freq: 784, dur: 1.2, type: 'sine', gain: 0.03, delay: 0.7 })
  }

  sleep() {
    this.tone({ freq: 220, dur: 0.3, type: 'sine', gain: 0.04, slide: -60 })
  }

  startMusic() {
    if (!this.ready || this.musicTimer) return
    const chords = [
      [130.81, 196.0, 261.63, 329.63],
      [110.0, 164.81, 261.63, 329.63],
      [174.61, 220.0, 293.66, 349.23],
      [146.83, 220.0, 293.66, 392.0]
    ]
    const play = () => {
      if (!this.ready || this.muted) return
      const chord = chords[this.chordIndex % chords.length]
      this.chordIndex++
      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        const filter = this.ctx.createBiquadFilter()
        osc.type = i === 0 ? 'triangle' : 'sine'
        osc.frequency.value = freq * (i === 2 ? 1.001 : 1)
        filter.type = 'lowpass'
        filter.frequency.value = 900
        const t = this.ctx.currentTime
        gain.gain.setValueAtTime(0.0001, t)
        gain.gain.linearRampToValueAtTime(i === 0 ? 0.028 : 0.018, t + 1.8)
        gain.gain.linearRampToValueAtTime(0.0001, t + 7.4)
        osc.connect(filter)
        filter.connect(gain)
        gain.connect(this.musicGain)
        osc.start(t)
        osc.stop(t + 7.6)
      })
      // sparse sparkle
      if (Math.random() < 0.65) {
        const scale = [523.25, 587.33, 659.25, 783.99, 880.0]
        this.tone({
          freq: scale[Math.floor(Math.random() * scale.length)],
          dur: 0.5,
          type: 'sine',
          gain: 0.012,
          delay: 2 + Math.random() * 3,
          lowpass: 2200
        })
      }
      this.musicTimer = setTimeout(play, 6000)
    }
    play()
  }

  stopMusic() {
    clearTimeout(this.musicTimer)
    this.musicTimer = null
  }
}

export const audio = new AudioEngine()
