/* ═══════════════════════════════════════════════════════════════════════════
   RABI — Memory Garden System
   memories.js
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

class MemoryGarden {
  constructor(containerEl, overlayEl, easterEggMgr, audioMgr) {
    this._container  = containerEl;
    this._overlay    = overlayEl;
    this._eggMgr     = easterEggMgr;
    this._audio      = audioMgr;
    this._flowers    = [];
    this._secretEl   = null;
    this._secretTaps = 0;
    this._observer   = null;
    this._built      = false;
  }

  build() {
    if (this._built) return;
    this._built = true;

    const memories = window.MEMORIES || [];
    const cfg = CONFIG.memory;

    // Build garden flowers from MEMORIES array
    memories.forEach((mem, idx) => {
      const flower = this._createFlower(mem, idx);
      this._container.appendChild(flower);
      this._flowers.push(flower);
    });

    // Place secret flower at a pseudo-random but consistent position
    const secretFlower = this._createSecretFlower();
    this._container.appendChild(secretFlower);
    this._secretEl = secretFlower;

    // Lazy load images via IntersectionObserver
    this._setupLazyLoad();

    // Wire overlay close
    const closeBtn = document.getElementById('memory-frame-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this._closeFrame());
    }

    // Close on overlay background tap
    const overlay = document.getElementById('memory-frame-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this._closeFrame();
      });
    }
  }

  _createFlower(memory, idx) {
    const wrapper = document.createElement('div');
    wrapper.className = 'garden-flower';
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('aria-label', `Open memory ${idx + 1}`);
    wrapper.style.setProperty('--delay', `${idx * 0.1}s`);

    const head = document.createElement('div');
    head.className = `flower-head flower-head--${memory.flowerType || 'rose'}`;

    const stem = document.createElement('div');
    stem.className = 'flower-stem';

    wrapper.appendChild(head);
    wrapper.appendChild(stem);

    // Store data
    wrapper.dataset.memoryIdx = idx;
    wrapper.dataset.image     = memory.image;
    wrapper.dataset.caption   = memory.caption;
    wrapper.dataset.alt       = memory.alt;

    // Interaction
    const open = () => this._openFrame(memory, wrapper);
    wrapper.addEventListener('click', open);
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });

    return wrapper;
  }

  _createSecretFlower() {
    const wrapper = document.createElement('div');
    wrapper.className = 'garden-flower garden-flower--secret';
    wrapper.setAttribute('aria-label', 'A mysterious flower');
    wrapper.setAttribute('tabindex', '0');

    const head = document.createElement('div');
    head.className = 'flower-head flower-head--orchid';

    const stem = document.createElement('div');
    stem.className = 'flower-stem';

    wrapper.appendChild(head);
    wrapper.appendChild(stem);

    // Secret tap handler
    const handleTap = () => {
      this._secretTaps++;
      this._eggMgr?.onSecretFlowerTap();
      if (this._secretTaps >= (CONFIG.memory?.secretTriggerTaps || 7)) {
        this._showSecretGarden();
      }
    };

    wrapper.addEventListener('click', handleTap);
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleTap(); }
    });

    return wrapper;
  }

  _openFrame(memory, flowerEl) {
    // Bloom animation
    flowerEl.classList.add('bloomed');
    this._audio?.playRoseSelect();

    const overlay      = document.getElementById('memory-frame-overlay');
    const img          = document.getElementById('memory-frame-img');
    const caption      = document.getElementById('memory-frame-caption');
    const placeholder  = document.getElementById('memory-frame-placeholder');

    if (!overlay) return;

    caption.textContent = memory.caption || '';

    // Try loading image
    if (memory.image) {
      img.src = memory.image;
      img.alt = memory.alt || 'Memory';
      img.hidden = false;

      img.onload  = () => { img.hidden = false; placeholder.hidden = true; };
      img.onerror = () => { img.hidden = true; placeholder.hidden = false; };

      // Check if already failed (cached)
      if (img.complete && img.naturalWidth === 0) {
        img.hidden = true;
        placeholder.hidden = false;
      }
    } else {
      img.hidden = true;
      placeholder.hidden = false;
    }

    overlay.hidden = false;
    overlay.style.animation = 'sceneIn 0.35s var(--ease-out) forwards';

    // Spawn particles around frame
    this._spawnFrameParticles();

    // Trap focus
    const closeBtn = document.getElementById('memory-frame-close');
    setTimeout(() => closeBtn?.focus(), 50);
  }

  _closeFrame() {
    const overlay = document.getElementById('memory-frame-overlay');
    if (!overlay) return;
    overlay.style.animation = 'sceneOut 0.3s ease forwards';
    setTimeout(() => {
      overlay.hidden = true;
      overlay.style.animation = '';
    }, 300);
  }

  _spawnFrameParticles() {
    const container = document.getElementById('memory-frame-particles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: absolute;
        width: ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        border-radius: 50%;
        background: ${Math.random() < 0.5 ? '#c77dff' : '#ef5350'};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0.7;
        pointer-events: none;
        animation: particleDrift ${2 + Math.random() * 3}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
      `;
      container.appendChild(p);
    }
  }

  _showSecretGarden() {
    const secret = document.getElementById('scene-secret');
    if (!secret || !secret.hidden === false) return;

    const introText  = document.getElementById('secret-intro-text');
    const revealText = document.getElementById('secret-reveal-text');
    const msgText    = document.getElementById('secret-message-text');
    const closeBtn   = document.getElementById('secret-close-btn');

    const cfg = CONFIG.secret;
    if (introText)  introText.textContent  = cfg.found;
    if (msgText)    msgText.textContent    = cfg.message;

    secret.hidden = false;
    this._audio?.playSecretReveal();

    // Animate in sequence
    setTimeout(() => {
      if (revealText) revealText.hidden = false;
    }, 1800);

    setTimeout(() => {
      if (msgText) msgText.hidden = false;
    }, 3200);

    // Spawn secret particles
    this._spawnSecretParticles();

    closeBtn?.addEventListener('click', () => {
      secret.style.animation = 'sceneOut 0.4s ease forwards';
      setTimeout(() => {
        secret.hidden = true;
        secret.style.animation = '';
      }, 400);
    }, { once: true });

    // Focus close button for accessibility
    setTimeout(() => closeBtn?.focus(), 100);
  }

  _spawnSecretParticles() {
    const container = document.getElementById('secret-particles');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      const isRose = Math.random() < 0.4;
      p.style.cssText = `
        position: absolute;
        width: ${6 + Math.random() * 10}px;
        height: ${4 + Math.random() * 6}px;
        border-radius: 50% 0 50% 0;
        background: ${isRose ? 'rgba(198,40,40,0.7)' : 'rgba(199,125,255,0.6)'};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: petalSwirl ${4 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 3}s;
        pointer-events: none;
      `;
      container.appendChild(p);
    }
  }

  _setupLazyLoad() {
    if (!('IntersectionObserver' in window)) return;
    this._observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const flower = entry.target;
          const img = flower.querySelector('.flower-bg-img');
          if (img && img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          this._observer.unobserve(flower);
        }
      });
    }, { threshold: 0.1, rootMargin: '100px' });

    this._flowers.forEach(f => this._observer.observe(f));
  }

  destroy() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
}
