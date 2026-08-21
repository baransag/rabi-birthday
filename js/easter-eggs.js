/* ═══════════════════════════════════════════════════════════════════════════
   RABI — Easter Egg Manager
   easter-eggs.js
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

class EasterEggManager {
  constructor(audioMgr) {
    this._audio    = audioMgr;
    this._cfg      = CONFIG.easterEggs;
    this._found    = { egg1: false, egg2: false, egg3: false };
    this._tapCount = { secret: 0, rabi: 0 };
    this._dismissTimers = {};
    this._rabiEl = null;
  }

  init() {
    if (!this._cfg.enabled) return;
    // Egg 3 watcher is set up when epilogue starts
    this._setupEgg2();
  }

  // ── Egg 1 — Secret flower taps ──────────────────────────────────────────

  onSecretFlowerTap() {
    if (!this._cfg.enabled || this._found.egg1) return;
    this._tapCount.secret++;

    if (this._tapCount.secret >= this._cfg.egg1TapsRequired) {
      this._revealEgg1();
    } else {
      // Pulse feedback
      const flower = document.querySelector('.garden-flower--secret .flower-head');
      if (flower) {
        flower.style.animation = 'none';
        requestAnimationFrame(() => {
          flower.style.animation = '';
          flower.style.boxShadow = `0 0 ${this._tapCount.secret * 6}px rgba(224,64,251,0.8)`;
        });
      }
    }
  }

  _revealEgg1() {
    this._found.egg1 = true;
    const overlay = document.getElementById('egg-1-overlay');
    const text    = document.getElementById('egg-1-text');
    if (!overlay || !text) return;

    text.textContent = this._cfg.egg1Message;
    overlay.hidden = false;
    this._audio?.playSecretReveal();

    // Auto-dismiss after 5s or tap
    this._autoDismiss(overlay, 5000, 'egg1');
    overlay.addEventListener('click', () => this._dismiss(overlay, 'egg1'), { once: true });
  }

  // ── Egg 2 — Moon tap ────────────────────────────────────────────────────

  _setupEgg2() {
    // Moon is in dream room — bind when that scene is available
    document.addEventListener('scene:dreamroom:enter', () => {
      const moon = document.getElementById('room-moon');
      if (!moon) return;
      moon.addEventListener('click',  () => this._triggerEgg2(), { once: true });
      moon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') this._triggerEgg2();
      }, { once: true });
    });
  }

  _triggerEgg2() {
    if (!this._cfg.enabled || this._found.egg2) return;
    this._found.egg2 = true;

    const overlay = document.getElementById('egg-2-overlay');
    const text    = document.getElementById('egg-2-text');
    if (!overlay || !text) return;

    text.textContent = this._cfg.egg2Message;
    overlay.hidden   = false;
    overlay.style.animation = 'moonFadeWhisper 3.5s ease-in-out forwards';

    // Hide moon
    const moon = document.getElementById('room-moon');
    if (moon) {
      moon.style.transition = 'opacity 1s';
      moon.style.opacity    = '0';
    }

    setTimeout(() => {
      overlay.hidden = true;
      overlay.style.animation = '';
    }, 3500);
  }

  // ── Egg 3 — RABI text taps (epilogue) ───────────────────────────────────

  setupEgg3(rabiEl) {
    if (!this._cfg.enabled) return;
    this._rabiEl = rabiEl;
    rabiEl.addEventListener('click', () => this._onRabiTap());
    rabiEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') this._onRabiTap();
    });
  }

  _onRabiTap() {
    if (!this._cfg.enabled || this._found.egg3) return;
    this._tapCount.rabi++;

    // Visual feedback
    if (this._rabiEl) {
      this._rabiEl.style.animation = 'shake 0.3s ease-in-out';
      setTimeout(() => {
        if (this._rabiEl) this._rabiEl.style.animation = '';
      }, 300);
    }

    if (this._tapCount.rabi >= this._cfg.egg3TapsRequired) {
      this._triggerEgg3();
    }
  }

  _triggerEgg3() {
    this._found.egg3 = true;
    const overlay = document.getElementById('egg-3-overlay');
    const text    = document.getElementById('egg-3-text');
    if (!overlay || !text) return;

    text.textContent = this._cfg.egg3Message;
    overlay.hidden   = false;
    this._audio?.playSecretReveal();

    this._autoDismiss(overlay, 5000, 'egg3');
    overlay.addEventListener('click', () => this._dismiss(overlay, 'egg3'), { once: true });
  }

  // ── Utility ──────────────────────────────────────────────────────────────

  _dismiss(overlay, key) {
    clearTimeout(this._dismissTimers[key]);
    overlay.style.animation = 'sceneOut 0.4s ease forwards';
    setTimeout(() => {
      overlay.hidden = true;
      overlay.style.animation = '';
    }, 400);
  }

  _autoDismiss(overlay, ms, key) {
    this._dismissTimers[key] = setTimeout(() => {
      if (!overlay.hidden) this._dismiss(overlay, key);
    }, ms);
  }

  // Reset tap counts (e.g., on orientation change)
  resetTaps() {
    this._tapCount = { secret: 0, rabi: 0 };
  }

  allFound() {
    return this._found.egg1 && this._found.egg2 && this._found.egg3;
  }
}
