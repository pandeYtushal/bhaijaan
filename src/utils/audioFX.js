// Web Audio API Synthesizer for Retro Saloon & Barbershop Sound Effects

class SoundFX {
  constructor() {
    this.ctx = null;
    this.crackleNode = null;
    this.crackleGain = null;
    this.isCracklePlaying = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  }

  // Barber Scissors Snip SFX (Saloon signature)
  playScissors() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // High frequency metallic snip
      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.08, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));

      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const filt = this.ctx.createBiquadFilter();
      filt.type = 'highpass';
      filt.frequency.setValueAtTime(2500, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      src.connect(filt);
      filt.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(now);
    } catch (e) {}
  }

  // Soft Satisfying Vintage Cassette Deck Click (No harsh buzz or spark)
  playCassetteClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.03);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  // Radio Station Channel Tuning / Rewind Frequency Sweep
  playRadioTuning() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.25, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const filt = this.ctx.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.setValueAtTime(300, now);
      filt.frequency.linearRampToValueAtTime(4000, now + 0.12);
      filt.frequency.linearRampToValueAtTime(200, now + 0.25);
      filt.Q.setValueAtTime(6, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      src.connect(filt);
      filt.connect(gain);
      gain.connect(this.ctx.destination);
      src.start(now);
      src.stop(now + 0.25);
    } catch (e) {}
  }

  playFilmBurn() {
    this.playRadioTuning();
  }

  playBhaiMode() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.7);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {}
  }

  // Toggle Background Vinyl Crackle & Tape Hiss Loop
  toggleVinylCrackle(enable = true) {
    try {
      this.init();
      if (!this.ctx) return;

      if (!enable && this.crackleNode) {
        this.crackleGain?.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.crackleNode?.stop();
          this.crackleNode?.disconnect();
          this.crackleNode = null;
          this.isCracklePlaying = false;
        }, 500);
        return;
      }

      if (enable && !this.isCracklePlaying) {
        const bufferSize = this.ctx.sampleRate * 2;
        const buf = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const d = buf.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          // Subtle random crackle pops + pink noise
          const isPop = Math.random() < 0.002;
          d[i] = isPop ? (Math.random() * 0.4 - 0.2) : (Math.random() * 0.02 - 0.01);
        }

        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1800;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        src.start();
        this.crackleNode = src;
        this.crackleGain = gain;
        this.isCracklePlaying = true;
      }
    } catch (e) {}
  }
}

export const audioFX = new SoundFX();
export default audioFX;
