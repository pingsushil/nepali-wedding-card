/**
 * Royal Nepali Wedding Background Music Engine (Mangal Dhun / Raag Bhupali)
 * ------------------------------------------------------------------------
 * Synthesizes a serene, warm, continuously looping traditional Nepali wedding
 * atmosphere using the Web Audio API:
 *   - Soft Tanpura drone (Sa + Pa: C3 + G3 + subtle octave C4 shimmer)
 *   - Expressive Bansuri (bamboo flute) playing an auspicious Nepali pentatonic
 *     melody (C-D-E-G-A, Raag Bhupali / Himalayan folk scale) with gentle vibrato
 *   - Delicate Santoor / Harp plucked arpeggio accompaniment & soft temple bell
 *
 * Works immediately on tap inside WhatsApp/Messenger/iOS/Android browsers with
 * zero network latency, and seamlessly yields to `/wedding-theme.mp3` whenever
 * the host places a custom audio track inside `public/wedding-theme.mp3`.
 */

// Pentatonic Raag Bhupali / Nepali Mangal Dhun scale (Hz)
const N = {
  C3: 130.81,
  G3: 196.0,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
};

// Gentle 16-bar auspicious Nepali Bansuri melody phrase: [freq | null, durationBeats]
const BANSURI_PHRASE = [
  // Phrase 1 — tender ascending welcome
  [N.E4, 1.5], [N.G4, 1.5], [N.A4, 1.0], [N.C5, 2.5], [N.A4, 1.5],
  [N.G4, 1.5], [N.E4, 1.0], [N.D4, 1.5], [N.E4, 2.5], [null, 1.5],
  // Phrase 2 — joyful Himalayan lift
  [N.G4, 1.5], [N.A4, 1.0], [N.C5, 1.5], [N.D5, 2.0], [N.E5, 2.0],
  [N.D5, 1.2], [N.C5, 1.3], [N.A4, 1.5], [N.G4, 2.5], [null, 1.5],
  // Phrase 3 — warm devotional resolution
  [N.A4, 1.5], [N.C5, 1.5], [N.A4, 1.0], [N.G4, 2.0], [N.E4, 2.0],
  [N.D4, 1.5], [N.E4, 1.5], [N.G4, 1.5], [N.E4, 1.5], [N.C4, 3.0], [null, 1.0],
];

// Soft Santoor / harp accompaniment arpeggio cycle
const SANTOOR_ARPEGGIO = [
  N.C4, N.E4, N.G4, N.C5, N.G4, N.E4,
  N.D4, N.G4, N.A4, N.D5, N.A4, N.G4,
  N.C4, N.E4, N.G4, N.A4, N.G4, N.E4,
];

export class NepaliWeddingSynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.delayNode = null;
    this.droneNodes = [];
    this.timers = [];
    this.isPlaying = false;
    this.phraseIdx = 0;
    this.arpIdx = 0;
  }

  _ensureContext() {
    if (this.ctx) return this.ctx;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);

    // Gentle warm low-pass filter for velvety concert-hall warmth
    const warmth = ctx.createBiquadFilter();
    warmth.type = 'lowpass';
    warmth.frequency.setValueAtTime(2400, ctx.currentTime);
    warmth.Q.setValueAtTime(0.7, ctx.currentTime);

    // Subtle courtyard echo/reverb feedback loop
    const delay = ctx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.42, ctx.currentTime);
    const delayFeedback = ctx.createGain();
    delayFeedback.gain.setValueAtTime(0.28, ctx.currentTime);
    const delayWet = ctx.createGain();
    delayWet.gain.setValueAtTime(0.24, ctx.currentTime);

    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(delayWet);

    warmth.connect(master);
    delayWet.connect(master);
    master.connect(ctx.destination);

    this.ctx = ctx;
    this.masterGain = master;
    this.warmthBus = warmth;
    this.delayNode = delay;
    return ctx;
  }

  _startTanpuraDrone() {
    if (!this.ctx || this.droneNodes.length > 0) return;
    const now = this.ctx.currentTime;

    const droneSpecs = [
      { freq: N.C3, type: 'sine', gain: 0.085 },
      { freq: N.G3, type: 'triangle', gain: 0.032 },
      { freq: N.C4, type: 'sine', gain: 0.025 },
    ];

    droneSpecs.forEach(({ freq, type, gain }) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(gain, now);
      osc.connect(g);
      g.connect(this.warmthBus);
      osc.start(now);
      this.droneNodes.push({ osc, g });
    });
  }

  _stopTanpuraDrone() {
    this.droneNodes.forEach(({ osc, g }) => {
      try {
        osc.stop();
        osc.disconnect();
        g.disconnect();
      } catch {
        // Ignore already stopped oscillators
      }
    });
    this.droneNodes = [];
  }

  _playBansuriNote(freq, durationSec) {
    if (!this.ctx || !this.isPlaying || !freq) return;
    const now = this.ctx.currentTime;

    // Warm bamboo flute tone (fundamental sine + soft 2nd harmonic triangle)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const env = this.ctx.createGain();
    const overtoneGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, now);
    overtoneGain.gain.setValueAtTime(0.08, now);

    // Gentle singing flute vibrato
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(4.6, now);
    lfoGain.gain.setValueAtTime(freq * 0.0045, now);
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);

    // Soft breathy attack & expressive decay
    const attack = Math.min(0.24, durationSec * 0.28);
    const release = Math.min(0.38, durationSec * 0.35);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.145, now + attack);
    env.gain.setValueAtTime(0.135, now + Math.max(attack + 0.05, durationSec - release));
    env.gain.exponentialRampToValueAtTime(0.0001, now + durationSec + 0.08);

    osc1.connect(env);
    osc2.connect(overtoneGain);
    overtoneGain.connect(env);
    env.connect(this.warmthBus);
    env.connect(this.delayNode);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);

    const stopAt = now + durationSec + 0.14;
    osc1.stop(stopAt);
    osc2.stop(stopAt);
    lfo.stop(stopAt);
  }

  _playSantoorPluck(freq) {
    if (!this.ctx || !this.isPlaying || !freq) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(0.042, now + 0.015);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

    osc.connect(env);
    env.connect(this.warmthBus);
    env.connect(this.delayNode);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  _scheduleNextMelodyNote() {
    if (!this.isPlaying) return;
    const beatSec = 0.54; // ~111 BPM gentle royal tempo
    const [freq, beats] = BANSURI_PHRASE[this.phraseIdx % BANSURI_PHRASE.length];
    this.phraseIdx = (this.phraseIdx + 1) % BANSURI_PHRASE.length;

    const durSec = beats * beatSec;
    if (freq) {
      this._playBansuriNote(freq, durSec * 0.94);
    }

    const t = window.setTimeout(() => this._scheduleNextMelodyNote(), durSec * 1000);
    this.timers.push(t);
  }

  _scheduleNextSantoor() {
    if (!this.isPlaying) return;
    const freq = SANTOOR_ARPEGGIO[this.arpIdx % SANTOOR_ARPEGGIO.length];
    this.arpIdx = (this.arpIdx + 1) % SANTOOR_ARPEGGIO.length;
    this._playSantoorPluck(freq);

    const t = window.setTimeout(() => this._scheduleNextSantoor(), 720);
    this.timers.push(t);
  }

  async play() {
    const ctx = this._ensureContext();
    if (!ctx) return false;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    if (this.isPlaying) return true;

    this.isPlaying = true;
    const now = ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.linearRampToValueAtTime(0.75, now + 0.9);

    this._startTanpuraDrone();
    this._scheduleNextMelodyNote();
    this._scheduleNextSantoor();
    return true;
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.timers.forEach((id) => window.clearTimeout(id));
    this.timers = [];

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      window.setTimeout(() => {
        if (!this.isPlaying) {
          this._stopTanpuraDrone();
        }
      }, 380);
    }
  }

  destroy() {
    this.pause();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
