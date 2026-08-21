/* ═══════════════════════════════════════════════════════════════════════════
   RABI — Audio Manager
   audio.js
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

class AudioManager {
  constructor() {
    this._ctx     = null;
    this._gainNode = null;
    this._source  = null;
    this._buffer  = null;
    this._muted   = false;
    this._loaded  = false;
    this._enabled = false;
    this._volume  = CONFIG.audio.volume ?? 0.3;
    this._fadeMs  = CONFIG.audio.fadeMs ?? 2000;
  }

  async init(withSound = true) {
    this._enabled = withSound;
    if (!withSound) {
      this._updateMuteBtn(true);
      return;
    }

    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      this._gainNode = this._ctx.createGain();
      this._gainNode.gain.setValueAtTime(0, this._ctx.currentTime);
      this._gainNode.connect(this._ctx.destination);

      // Load audio async — don't block the experience
      this._loadAmbient();
    } catch (e) {
      console.warn('[Audio] Web Audio API unavailable:', e);
    }
  }

  async _loadAmbient() {
    try {
      const src = CONFIG.audio.ambientSrc;
      const res = await fetch(src);
      if (!res.ok) throw new Error('Audio file not found');
      const buf = await res.arrayBuffer();
      this._buffer = await this._ctx.decodeAudioData(buf);
      this._loaded = true;
      this._playAmbient();
    } catch (e) {
      // Ambient audio is optional — fail silently
      console.info('[Audio] Ambient track not loaded (optional):', e.message);
    }
  }

  _playAmbient() {
    if (!this._loaded || !this._ctx || !this._enabled || this._muted) return;

    if (this._source) {
      try { this._source.disconnect(); } catch (_) {}
    }

    this._source = this._ctx.createBufferSource();
    this._source.buffer = this._buffer;
    this._source.loop   = true;
    this._source.connect(this._gainNode);
    this._source.start(0);

    // Fade in
    this._gainNode.gain.cancelScheduledValues(this._ctx.currentTime);
    this._gainNode.gain.setValueAtTime(0, this._ctx.currentTime);
    this._gainNode.gain.linearRampToValueAtTime(
      this._volume,
      this._ctx.currentTime + this._fadeMs / 1000
    );
  }

  // Resume if context was suspended (browser policy)
  async resume() {
    if (this._ctx && this._ctx.state === 'suspended') {
      await this._ctx.resume();
    }
  }

  toggleMute() {
    this._muted = !this._muted;
    if (this._ctx && this._gainNode) {
      const now = this._ctx.currentTime;
      this._gainNode.gain.cancelScheduledValues(now);
      this._gainNode.gain.setValueAtTime(this._gainNode.gain.value, now);
      if (this._muted) {
        this._gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
      } else {
        this._gainNode.gain.linearRampToValueAtTime(this._volume, now + 0.8);
        if (!this._source) this._playAmbient();
      }
    }
    this._updateMuteBtn(this._muted);
    return this._muted;
  }

  isMuted() { return this._muted; }

  _updateMuteBtn(muted) {
    const btn    = document.getElementById('mute-btn');
    const iconOn = btn?.querySelector('.mute-icon-on');
    const iconOff = btn?.querySelector('.mute-icon-off');
    if (iconOn)  iconOn.hidden  = muted;
    if (iconOff) iconOff.hidden = !muted;
    if (btn) btn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
  }

  // ── Scene Transition Sounds (Web Audio synthesis — no file needed) ────────

  playRoseSelect() {
    if (!this._ctx || this._muted || !this._enabled) return;
    this._playTone(440, 0.08, 'sine', 0.3);
    setTimeout(() => this._playTone(554, 0.06, 'sine', 0.2), 80);
    setTimeout(() => this._playTone(659, 0.05, 'sine', 0.15), 160);
  }

  playButtonClick() {
    if (!this._ctx || this._muted || !this._enabled) return;
    this._playTone(330, 0.05, 'sine', 0.1);
  }

  playMagic() {
    if (!this._ctx || this._muted || !this._enabled) return;
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 0.04, 'sine', 0.4), i * 120);
    });
  }

  playStarMerge() {
    if (!this._ctx || this._muted || !this._enabled) return;
    // Deep resonant tone
    this._playTone(110, 0.15, 'sine', 1.5);
    setTimeout(() => this._playTone(220, 0.1, 'sine', 1.2), 200);
    setTimeout(() => this._playTone(440, 0.08, 'triangle', 1.0), 600);
  }

  playCandleOut() {
    if (!this._ctx || this._muted || !this._enabled) return;
    // Soft wind-like noise
    this._playNoise(0.03, 0.3);
  }

  playSecretReveal() {
    if (!this._ctx || this._muted || !this._enabled) return;
    [330, 415, 494, 622].forEach((freq, i) => {
      setTimeout(() => this._playTone(freq, 0.06, 'sine', 0.5), i * 150);
    });
  }

  _playTone(freq, gain, type, duration) {
    try {
      const osc  = this._ctx.createOscillator();
      const g    = this._ctx.createGain();
      osc.type   = type;
      osc.frequency.setValueAtTime(freq, this._ctx.currentTime);
      g.gain.setValueAtTime(gain, this._ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this._ctx.currentTime + duration);
      osc.connect(g);
      g.connect(this._gainNode || this._ctx.destination);
      osc.start(this._ctx.currentTime);
      osc.stop(this._ctx.currentTime + duration);
    } catch (_) {}
  }

  _playNoise(gain, duration) {
    try {
      const bufSize = this._ctx.sampleRate * duration;
      const buffer  = this._ctx.createBuffer(1, bufSize, this._ctx.sampleRate);
      const data    = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = this._ctx.createBufferSource();
      const g   = this._ctx.createGain();
      src.buffer = buffer;
      g.gain.setValueAtTime(gain, this._ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, this._ctx.currentTime + duration);
      src.connect(g);
      g.connect(this._gainNode || this._ctx.destination);
      src.start();
    } catch (_) {}
  }
}
