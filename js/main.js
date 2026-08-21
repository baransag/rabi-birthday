/* ═══════════════════════════════════════════════════════════════════════════
   RABI — The Bouquet That Never Fades
   main.js — Scene Manager, Story Engine & All Scene Logic
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── ADAPTIVE QUALITY SYSTEM ───────────────────────────────────────────── */
const AdaptiveQuality = {
  detect() {
    if (CONFIG.performance?.forceQuality) return CONFIG.performance.forceQuality;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'REDUCED';
    const mobile  = window.innerWidth < 768;
    const lowCore = (navigator.hardwareConcurrency || 4) <= 2;
    const lowMem  = (navigator.deviceMemory || 4) <= 2;
    if (mobile && (lowCore || lowMem)) return 'LOW';
    if (mobile) return 'MEDIUM';
    return 'HIGH';
  },
};

/* ─── UTILITY FUNCTIONS ──────────────────────────────────────────────────── */
const delay = (ms) => new Promise(r => setTimeout(r, ms));

function typeWriter(el, text, msBetween = 35, initialDelay = 0) {
  return new Promise((resolve) => {
    let i = 0;
    el.textContent = '';
    setTimeout(() => {
      const tick = () => {
        if (i < text.length) {
          el.textContent += text[i++];
          setTimeout(tick, msBetween + Math.random() * 15);
        } else {
          resolve();
        }
      };
      tick();
    }, initialDelay);
  });
}

function checkImageExists(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(false);
    const img = new Image();
    img.onload  = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function makeSVGRose(width = 100, height = 170, scale = 1) {
  const id = 'r' + Math.random().toString(36).slice(2, 7);
  return `<svg viewBox="0 0 ${width} ${height}" width="${width * scale}" height="${height * scale}"
    xmlns="http://www.w3.org/2000/svg" class="rose-svg" aria-hidden="true" overflow="visible">
    <defs>
      <radialGradient id="pg-${id}" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#ef5350"/>
        <stop offset="55%" stop-color="#c62828"/>
        <stop offset="100%" stop-color="#7f0000"/>
      </radialGradient>
      <radialGradient id="pi-${id}" cx="45%" cy="30%" r="60%">
        <stop offset="0%" stop-color="#e53935"/>
        <stop offset="100%" stop-color="#b71c1c"/>
      </radialGradient>
      <filter id="rf-${id}" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.5" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <!-- Stem -->
    <path d="M${width/2},${height} Q${width/2-2},${height*0.75} ${width/2},${height*0.6}"
      stroke="#2d6a4f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Leaf L -->
    <path d="M${width/2},${height*0.8} Q${width/2-14},${height*0.72} ${width/2-16},${height*0.63}
              Q${width/2-4},${height*0.67} ${width/2},${height*0.8}" fill="#2d6a4f"/>
    <!-- Leaf R -->
    <path d="M${width/2},${height*0.73} Q${width/2+13},${height*0.65} ${width/2+14},${height*0.56}
              Q${width/2+3},${height*0.61} ${width/2},${height*0.73}" fill="#388e3c"/>
    <!-- Outer petals -->
    <g filter="url(#rf-${id})">
      ${[0,51.4,102.8,154.2,205.7,257.1,308.5].map(a =>
        `<ellipse cx="${width/2}" cy="${height*0.38}" rx="${width*0.21}" ry="${height*0.24}"
          fill="url(#pg-${id})" transform="rotate(${a},${width/2},${height*0.38})" opacity="0.88"/>`
      ).join('')}
    </g>
    <!-- Mid petals -->
    <g>
      ${[0,60,120,180,240,300].map(a =>
        `<ellipse cx="${width/2}" cy="${height*0.35}" rx="${width*0.155}" ry="${height*0.18}"
          fill="url(#pi-${id})" transform="rotate(${a},${width/2},${height*0.35})" opacity="0.92"/>`
      ).join('')}
    </g>
    <!-- Center -->
    <ellipse cx="${width/2}" cy="${height*0.33}" rx="${width*0.1}" ry="${height*0.12}" fill="#b71c1c"/>
    <ellipse cx="${width/2}" cy="${height*0.31}" rx="${width*0.065}" ry="${height*0.08}" fill="#c62828"/>
  </svg>`;
}

/* ─── SCENE BASE CLASS ───────────────────────────────────────────────────── */
class Scene {
  constructor(id) {
    this.id      = id;
    this.element = document.getElementById(`scene-${id}`);
    this.state   = 'idle';
    this._listeners = [];
    this._timers    = [];
    this._rafs      = [];
  }

  async preload()            {}
  async enter(fromId, opts)  { this.state = 'entering'; }
  play()                     { this.state = 'playing'; }
  pause()                    { this.state = 'paused'; this._cancelRafs(); }
  async exit(toId, opts)     { this.state = 'exiting'; }
  destroy()                  { this._cleanup(); }

  show()  { this.element?.classList.add('scene--active'); this.element?.removeAttribute('hidden'); }
  hide()  { this.element?.classList.remove('scene--active'); }

  _on(el, ev, fn, opts) {
    el?.addEventListener(ev, fn, opts);
    this._listeners.push({ el, ev, fn, opts });
  }

  _after(ms, fn) {
    const t = setTimeout(fn, ms);
    this._timers.push(t);
    return t;
  }

  _raf(fn) {
    const id = requestAnimationFrame(fn);
    this._rafs.push(id);
    return id;
  }

  _cancelRafs() {
    this._rafs.forEach(id => cancelAnimationFrame(id));
    this._rafs = [];
  }

  _cleanup() {
    this._listeners.forEach(({ el, ev, fn, opts }) => el?.removeEventListener(ev, fn, opts));
    this._listeners = [];
    this._timers.forEach(clearTimeout);
    this._timers = [];
    this._cancelRafs();
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCENE IMPLEMENTATIONS
═══════════════════════════════════════════════════════════════════════════ */

// ── Scene 00: Loading ──────────────────────────────────────────────────────
class LoadingScene extends Scene {
  constructor() { super('loading'); }

  async run(onComplete) {
    this.show();
    this.state = 'playing';

    const fill    = document.getElementById('loading-bar-fill');
    const pct     = document.getElementById('loading-percent');
    const stage   = document.getElementById('loading-stage-text');
    const bar     = document.getElementById('loading-progress-bar');

    const stages = [
      { label: 'Loading flowers...', target: 20, ms: 500 },
      { label: 'Loading light...', target: 40, ms: 600 },
      { label: 'Loading stars...', target: 60, ms: 500 },
      { label: 'Preparing memories...', target: 80, ms: 700 },
      { label: 'Almost ready...', target: 95, ms: 400 },
      { label: 'Ready.', target: 100, ms: 300 },
    ];

    let current = 0;

    const setProgress = (value) => {
      current = value;
      if (fill) fill.style.width = value + '%';
      if (pct)  pct.textContent  = value + '%';
      bar?.setAttribute('aria-valuenow', value);
    };

    for (const s of stages) {
      if (stage) stage.textContent = s.label;
      // Smooth fill to target
      const step = () => {
        if (current < s.target) {
          setProgress(Math.min(current + 1, s.target));
          if (current < s.target) this._raf(step);
        }
      };
      this._raf(step);
      await delay(s.ms);
    }

    await delay(400);
    onComplete();
  }
}

// ── Scene 01: The Opening ─────────────────────────────────────────────────
class OpeningScene extends Scene {
  constructor(particles) {
    super('opening');
    this._particles = particles;
    this._done      = false;
  }

  async enter(fromId) {
    super.enter(fromId);
    this._done = false;
    this.show();
    this._particles.setMode('purple-ambient');
    this._particles.start();
    await this._runSequence();
  }

  async _runSequence() {
    const cfg = CONFIG.opening;

    // Step 1: Date typewriter
    const dateEl = this.element.querySelector('.opening-date-text');
    await delay(600);
    if (dateEl) await typeWriter(dateEl, cfg.dateDisplay, 80);
    await delay(1200);

    // Step 2: Quote
    const quoteWrapper = document.getElementById('opening-quote-wrapper');
    const introEl = this.element.querySelector('.opening-intro');
    const quoteEl = this.element.querySelector('.opening-quote-text');
    if (quoteWrapper) quoteWrapper.hidden = false;
    await delay(200);
    if (quoteWrapper) quoteWrapper.style.opacity = '1';
    if (introEl) introEl.style.animation = 'sceneSlideInUp 0.8s var(--ease-out) forwards';
    await delay(900);
    if (quoteEl) await typeWriter(quoteEl, cfg.quote, 45);
    await delay(2000);

    // Step 3: Rose grows from darkness
    const roseWrapper = document.getElementById('opening-rose-wrapper');
    if (roseWrapper) {
      roseWrapper.hidden = false;
      roseWrapper.style.opacity = '0';
    }

    const soEl = this.element.querySelector('.opening-so');
    await delay(300);
    if (roseWrapper) roseWrapper.style.cssText += 'opacity:1;transition:opacity 0.8s ease;';
    if (soEl) soEl.style.animation = 'sceneSlideInUp 0.8s ease forwards';

    await delay(800);
    this._growRose();
    await delay(2200);

    // Step 4: Reveal text
    const revealEl = document.getElementById('opening-reveal');
    const mainEl   = revealEl?.querySelector('.opening-reveal-main');
    if (revealEl) revealEl.hidden = false;
    if (mainEl)   await typeWriter(mainEl, cfg.revealMain, 55);
    await delay(600);

    // Continue button
    const continueBtn = document.getElementById('opening-continue');
    if (continueBtn) {
      continueBtn.hidden = false;
      continueBtn.style.animation = 'sceneSlideInUp 0.6s ease forwards';
    }

    this._done = true;
  }

  _growRose() {
    const svg     = this.element.querySelector('.rose-grow-svg');
    if (!svg) return;

    const stem        = svg.querySelector('.rose-stem');
    const leafLeft    = svg.querySelector('.rose-leaf-left');
    const leafRight   = svg.querySelector('.rose-leaf-right');
    const outerPetals = svg.querySelector('.rose-petals-outer');
    const innerPetals = svg.querySelector('.rose-petals-inner');
    const center      = svg.querySelector('.rose-center');
    const heart       = svg.querySelector('.rose-heart');

    // Animate stem
    if (stem) {
      stem.style.animation = 'roseGrowStem 1.2s ease forwards';
    }

    this._after(800, () => {
      [leafLeft, leafRight].forEach(el => {
        if (el) el.style.cssText = 'opacity:1;transition:opacity 0.8s;';
      });
    });

    this._after(1200, () => {
      [outerPetals, innerPetals].forEach(el => {
        if (el) el.style.cssText = 'opacity:1;transition:opacity 0.8s,transform 0.8s;transform:scale(1);animation:roseBloom 0.8s ease forwards;';
      });
    });

    this._after(1800, () => {
      if (center) center.style.cssText = 'opacity:1;transition:opacity 0.5s;';
      if (heart)  heart.style.cssText  = 'opacity:1;transition:opacity 0.5s 0.2s;';
    });
  }

  play() {
    super.play();
    this._particles.start();
  }

  pause() {
    super.pause();
    this._particles.stop();
  }

  async exit() {
    super.exit();
    this._particles.stop();
    this.element.style.transition = 'opacity 0.8s ease';
    this.element.style.opacity = '0';
    await delay(800);
    this.hide();
    this.element.style.opacity = '';
    this.element.style.transition = '';
  }
}

// ── Scene 02: Developer Reveal ────────────────────────────────────────────
class DeveloperScene extends Scene {
  constructor(particles, audio) {
    super('developer');
    this._particles = particles;
    this._audio     = audio;
    this._executed  = false;
    this._onComplete = null;
  }

  async enter(fromId, opts = {}) {
    super.enter(fromId, opts);
    this._executed = false;
    this.show();
    this.element.style.opacity = '0';
    await delay(50);
    this.element.style.cssText += 'opacity:1;transition:opacity 0.8s ease;';
    this._particles.setMode('purple-ambient');
    this._particles.start();

    this._buildFragments();
    await this._typeCode();
    this._showExecuteButton();
  }

  _buildFragments() {
    const container = document.getElementById('dev-fragments');
    if (!container) return;
    container.innerHTML = '';
    const snippets = ['const love =', 'return true;', '// Rabi', 'Promise.resolve(💜)', 'flowers++', 'birthday.now()'];
    snippets.forEach((s, i) => {
      const el = document.createElement('div');
      el.className = 'dev-fragment';
      el.textContent = s;
      el.style.cssText = `left:${10 + Math.random() * 80}%;animation-duration:${8 + i * 2}s;animation-delay:${i * 1.5}s;`;
      container.appendChild(el);
    });
  }

  async _typeCode() {
    const codeEl    = document.getElementById('dev-code-output');
    const numbersEl = document.getElementById('dev-line-numbers');
    if (!codeEl) return;

    const lines = CONFIG.developer.codeLines;
    let lineNum = 1;

    for (const line of lines) {
      const lineEl = document.createElement('span');
      lineEl.style.display = 'block';

      // Color code syntax
      const colored = this._colorize(line);
      codeEl.appendChild(lineEl);

      if (line === '') {
        lineEl.innerHTML = '&nbsp;';
        if (numbersEl) numbersEl.innerHTML += `<div>${lineNum++}</div>`;
        await delay(80);
        continue;
      }

      if (numbersEl) numbersEl.innerHTML += `<div>${lineNum++}</div>`;

      // Type character by character
      let charIdx = 0;
      const rawChars = line.split('');
      await new Promise(resolve => {
        const tick = () => {
          if (charIdx < rawChars.length) {
            lineEl.innerHTML = this._colorize(rawChars.slice(0, ++charIdx).join(''));
            this._after(28 + Math.random() * 20, tick);
          } else resolve();
        };
        tick();
      });

      await delay(line.includes('{') || line.includes('}') ? 120 : 60);
    }
  }

  _colorize(line) {
    return line
      .replace(/\b(const|function|return)\b/g, '<span class="kw">$1</span>')
      .replace(/"([^"]+)"/g, '<span class="str">"$1"</span>')
      .replace(/\b(Infinity)\b/g, '<span class="num">$1</span>')
      .replace(/\b(createBirthdayGift|rabi|reason)\b(?=\s*[({]?)/g, (m) => {
        if (m === 'createBirthdayGift') return `<span class="fn">${m}</span>`;
        return `<span class="key">${m}</span>`;
      });
  }

  _showExecuteButton() {
    const area = document.getElementById('dev-execute-area');
    const btn  = document.getElementById('dev-execute-btn');
    if (!area) return;
    area.hidden = false;
    area.style.animation = 'sceneSlideInUp 0.6s ease forwards';

    btn?.addEventListener('click', () => this._execute(), { once: true });
  }

  async _execute() {
    if (this._executed) return;
    this._executed = true;

    const btn     = document.getElementById('dev-execute-btn');
    const result  = document.getElementById('dev-result');
    const area    = document.getElementById('dev-execute-area');

    this._audio?.playMagic();

    if (btn) btn.disabled = true;
    if (btn) btn.querySelector('.dev-execute-label').textContent = 'Running...';

    await delay(600);

    if (area)   area.hidden   = true;
    if (result) result.hidden = false;
    result.style.animation = 'sceneSlideInUp 0.5s ease forwards';

    await delay(1200);

    // Dissolve everything into particles
    this._dissolve();
  }

  _dissolve() {
    const window_ = this.element.querySelector('.dev-window');
    if (window_) {
      window_.style.transition = 'transform 1s ease, opacity 1s ease';
      window_.style.opacity = '0';
      window_.style.transform = 'scale(0.95)';
    }

    this._particles.setMode('petal-explosion');

    this._after(1200, () => {
      this._onComplete && this._onComplete();
    });
  }

  setOnComplete(fn) { this._onComplete = fn; }

  play()  { super.play();  this._particles.start(); }
  pause() { super.pause(); this._particles.stop(); }

  async exit() {
    super.exit();
    this._particles.stop();
    this.element.style.transition = 'opacity 0.6s ease';
    this.element.style.opacity = '0';
    await delay(600);
    this.hide();
    this.element.style.opacity = '';
    this.element.style.transition = '';
  }
}

// ── Scene 03: The Digital Bouquet ─────────────────────────────────────────
class BouquetScene extends Scene {
  constructor(particles, audio) {
    super('bouquet');
    this._particles  = particles;
    this._audio      = audio;
    this._rosePicked = new Array(7).fill(false);
    this._pickCount  = 0;
    this._onFinalPick = null;
    this._roses      = [];
    this._bouquetBuilt = false;
    this._interactionEnabled = false;
  }

  async enter(fromId) {
    super.enter(fromId);
    this.show();
    this.element.style.opacity = '0';
    await delay(50);
    this.element.style.cssText += 'opacity:1;transition:opacity 1s ease;';

    this._particles.setMode('bouquet-sparkle');
    this._particles.start();

    if (!this._bouquetBuilt) {
      this._buildBouquet();
      this._bouquetBuilt = true;
    }

    await this._runIntro();
    this._showBouquet();
  }

  _buildBouquet() {
    const container = document.getElementById('bouquet-flowers');
    if (!container) return;
    container.innerHTML = '';
    this._roses = [];

    const roseData = CONFIG.bouquet.roses;

    // Bouquet positions: arranged in a natural bouquet shape
    const positions = [
      { left: '42%', bottom: '68%', width: 58,  height: 100, rotate: -10, zIndex: 3 },
      { left: '22%', bottom: '60%', width: 52,  height: 90,  rotate: -25, zIndex: 2 },
      { left: '63%', bottom: '60%', width: 52,  height: 90,  rotate: 20,  zIndex: 2 },
      { left: '8%',  bottom: '48%', width: 46,  height: 80,  rotate: -35, zIndex: 1 },
      { left: '76%', bottom: '48%', width: 46,  height: 80,  rotate: 30,  zIndex: 1 },
      { left: '30%', bottom: '44%', width: 50,  height: 86,  rotate: -15, zIndex: 4 },
      { left: '55%', bottom: '44%', width: 50,  height: 86,  rotate: 12,  zIndex: 4 },
    ];

    roseData.forEach((rose, i) => {
      const pos = positions[i] || positions[i % positions.length];
      const btn = document.createElement('button');
      btn.className = 'bouquet-rose-btn' + (rose.isFinal ? ' rose--final' : '');
      btn.setAttribute('aria-label', `Rose ${i + 1} — tap to pick`);
      btn.style.cssText = `
        left: ${pos.left};
        bottom: ${pos.bottom};
        width: ${pos.width}px;
        height: ${pos.height}px;
        transform: rotate(${pos.rotate}deg);
        z-index: ${pos.zIndex};
      `;
      btn.dataset.roseIdx = i;
      btn.dataset.message = rose.message;
      btn.dataset.isFinal = rose.isFinal ? '1' : '0';
      btn.innerHTML = makeSVGRose(pos.width, pos.height);

      btn.addEventListener('click', () => this._pickRose(btn, i));
      container.appendChild(btn);
      this._roses.push(btn);
    });
  }

  async _runIntro() {
    const intro     = document.getElementById('bouquet-intro');
    const title     = document.getElementById('bouquet-title');
    const linesEl   = document.getElementById('bouquet-intro-lines');
    const cfg       = CONFIG.bouquet;

    if (!intro) return;
    intro.style.opacity = '0';
    await delay(400);
    intro.style.cssText += 'opacity:1;transition:opacity 1s ease;';

    if (title) {
      title.style.animation = 'sceneSlideInUp 0.8s ease forwards';
    }
    await delay(1400);

    // Show intro lines one by one
    for (const line of cfg.introLines) {
      const p = document.createElement('p');
      p.className = `bouquet-intro-line${line === cfg.introLines.at(-1) ? ' bouquet-intro-line--final' : ''}`;
      p.textContent = line;
      linesEl.appendChild(p);
      await delay(80);
      p.classList.add('bouquet-intro-line--visible');
      await delay(1400);
    }

    await delay(800);
    // Fade out intro
    intro.style.transition = 'opacity 0.8s ease';
    intro.style.opacity = '0';
    await delay(800);
    intro.hidden = true;
  }

  _showBouquet() {
    const stage   = document.getElementById('bouquet-stage');
    const pickArea = document.getElementById('bouquet-pick-area');
    if (stage)   { stage.hidden = false;   stage.style.animation = 'sceneIn 0.8s ease forwards'; }
    if (pickArea){ pickArea.hidden = false; pickArea.style.animation = 'sceneSlideInUp 0.8s ease forwards'; }
    this._interactionEnabled = true;
  }

  _pickRose(btn, idx) {
    if (!this._interactionEnabled) return;
    if (this._rosePicked[idx]) return;

    this._rosePicked[idx] = true;
    this._pickCount++;
    this._audio?.playRoseSelect();

    // Select animation
    btn.classList.add('rose--selected');
    btn.disabled = true;

    // Show message
    const msgDisplay = document.getElementById('rose-message-display');
    const msgText    = document.getElementById('rose-message-text');
    if (msgText) {
      msgText.textContent = btn.dataset.message;
      if (msgDisplay) {
        msgDisplay.hidden = false;
        msgDisplay.style.animation = 'sceneIn 0.5s ease forwards';
      }
    }

    // After a pause, mark as picked and hide message
    setTimeout(() => {
      btn.classList.remove('rose--selected');
      btn.classList.add('rose--picked');
      if (msgDisplay) {
        msgDisplay.style.animation = 'sceneOut 0.5s ease forwards';
        setTimeout(() => { msgDisplay.hidden = true; msgDisplay.style.animation = ''; }, 500);
      }

      // Check if this was the final rose
      if (btn.dataset.isFinal === '1') {
        setTimeout(() => this._triggerFinalRose(), 200);
      }
    }, 2800);
  }

  _triggerFinalRose() {
    this._interactionEnabled = false;
    this._particles.setMode('petal-explosion');
    this._audio?.playMagic();
    this._onFinalPick && this._onFinalPick();
  }

  setOnFinalPick(fn) { this._onFinalPick = fn; }

  play()  { super.play();  this._particles.start(); }
  pause() { super.pause(); this._particles.stop(); }

  async exit() {
    super.exit();
    this._particles.stop();
    this.element.style.transition = 'opacity 0.8s ease';
    this.element.style.opacity = '0';
    await delay(800);
    this.hide();
    this.element.style.opacity = '';
    this.element.style.transition = '';
  }
}

// ── Scene 04: Galaxy / Two Souls ─────────────────────────────────────────
class GalaxyScene extends Scene {
  constructor(particles, audio) {
    super('galaxy');
    this._particles  = particles;
    this._audio      = audio;
    this._canvas     = null;
    this._ctx        = null;
    this._stars      = [];
    this._rafId      = null;
    this._merged     = false;
    this._onContinue = null;
    this._msgIndex   = 0;
    this._isDrawing  = false;
  }

  async enter(fromId) {
    super.enter(fromId);
    this.show();
    this.element.style.opacity = '0';
    await delay(100);
    this.element.style.cssText += 'opacity:1;transition:opacity 1.5s ease;';

    this._setupCanvas();
    this._particles.setMode('galaxy-nebula');
    this._particles.start();

    // Set labels from config
    const cfg = CONFIG.galaxy;
    const soulsContainer = document.getElementById('souls-container');
    const leftLabel  = this.element.querySelector('.soul--left .soul-label');
    const rightLabel = this.element.querySelector('.soul--right .soul-label');
    const centerText = document.getElementById('soul-center-text');

    if (leftLabel)  leftLabel.textContent  = cfg.leftLabel;
    if (rightLabel) rightLabel.textContent = cfg.rightLabel;
    if (centerText) centerText.querySelector('p').textContent = cfg.centerText;

    // Wire merge button
    const mergeBtn = document.getElementById('galaxy-merge-btn');
    mergeBtn?.addEventListener('click', () => this._triggerMerge(), { once: true });

    await delay(800);
    if (soulsContainer) soulsContainer.style.animation = 'sceneSlideInUp 1s ease forwards';
    await delay(1200);
    if (mergeBtn) {
      mergeBtn.hidden = false;
      mergeBtn.style.animation = 'sceneSlideInUp 0.8s ease forwards';
    }
  }

  _setupCanvas() {
    this._canvas = document.getElementById('galaxy-canvas');
    if (!this._canvas) return;
    const dpr = Math.min(devicePixelRatio, 2);
    this._canvas.width  = innerWidth * dpr;
    this._canvas.height = innerHeight * dpr;
    this._ctx = this._canvas.getContext('2d');
    this._ctx.scale(dpr, dpr);
    this._buildStars();
    this._drawLoop();
  }

  _buildStars() {
    this._stars = [];
    const count = 180;
    for (let i = 0; i < count; i++) {
      this._stars.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: Math.random() < 0.08 ? 2 : Math.random() < 0.25 ? 1.2 : 0.6,
        a: Math.random(),
        baseA: 0.3 + Math.random() * 0.7,
        speed: 0.008 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  _drawLoop() {
    if (!this._ctx || this._isDrawing) return;
    this._isDrawing = true;
    const draw = (t) => {
      if (!this._isDrawing) return;
      const ctx = this._ctx;
      ctx.clearRect(0, 0, innerWidth, innerHeight);

      for (const s of this._stars) {
        s.phase += s.speed;
        s.a = s.baseA * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();
      }

      this._rafId = requestAnimationFrame(draw);
    };
    this._rafId = requestAnimationFrame(draw);
  }

  async _triggerMerge() {
    if (this._merged) return;
    this._merged = true;

    this._audio?.playStarMerge();

    const mergeBtn   = document.getElementById('galaxy-merge-btn');
    const centerText = document.getElementById('soul-center-text');
    const soulLeft   = document.querySelector('.soul--left .soul-star');
    const soulRight  = document.querySelector('.soul--right .soul-star');

    if (mergeBtn) mergeBtn.hidden = true;
    if (centerText) {
      centerText.style.transition = 'opacity 0.5s';
      centerText.style.opacity = '0';
    }

    // Animate stars moving together
    await delay(200);
    if (soulLeft)  { soulLeft.style.transition  = 'transform 2s cubic-bezier(0.77,0,0.18,1)'; soulLeft.style.transform  = 'translateX(90px)'; }
    if (soulRight) { soulRight.style.transition = 'transform 2s cubic-bezier(0.77,0,0.18,1)'; soulRight.style.transform = 'translateX(-90px)'; }

    await delay(2000);

    // Burst effect via CSS element
    const burst = document.createElement('div');
    burst.style.cssText = `
      position:fixed;top:50%;left:50%;
      width:80px;height:80px;border-radius:50%;
      background:radial-gradient(circle at center, #fff 0%, #c77dff 40%, transparent 70%);
      animation:mergeBurst 1.2s ease forwards;
      pointer-events:none;z-index:600;
    `;
    document.body.appendChild(burst);

    // Ripples
    for (let i = 0; i < 3; i++) {
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position:fixed;top:50%;left:50%;
        width:80px;height:80px;border-radius:50%;
        border:2px solid rgba(199,125,255,0.6);
        animation:mergeRipple ${1.5 + i * 0.4}s ease forwards;
        animation-delay:${i * 0.25}s;
        pointer-events:none;z-index:599;
      `;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 2500);
    }

    setTimeout(() => burst.remove(), 1500);
    this._particles.burst(innerWidth / 2, innerHeight / 2, 40, 'purple');

    await delay(1400);

    // Show messages
    const msgContainer = document.getElementById('galaxy-messages');
    if (msgContainer) msgContainer.hidden = false;

    const msgs = CONFIG.galaxy.mergeMessages;
    const msgEls = [
      document.getElementById('galaxy-msg-1'),
      document.getElementById('galaxy-msg-2'),
      document.getElementById('galaxy-msg-3'),
    ];

    for (let i = 0; i < msgs.length; i++) {
      if (msgEls[i]) {
        msgEls[i].textContent = msgs[i];
        await delay(i === 0 ? 400 : 1500);
        msgEls[i].classList.add('galaxy-msg--visible');
      }
    }

    await delay(2000);

    const continueBtn = document.getElementById('galaxy-continue');
    if (continueBtn) {
      continueBtn.hidden = false;
      continueBtn.style.animation = 'sceneSlideInUp 0.6s ease forwards';
      continueBtn.addEventListener('click', () => this._onContinue?.(), { once: true });
    }
  }

  setOnContinue(fn) { this._onContinue = fn; }

  play()  {
    super.play();
    this._isDrawing = false; // Reset so drawLoop can re-enter
    this._drawLoop();
    this._particles.start();
  }

  pause() {
    super.pause();
    this._isDrawing = false;
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    this._particles.stop();
  }

  async exit() {
    this.pause();
    this.element.style.transition = 'opacity 1s ease';
    this.element.style.opacity = '0';
    await delay(1000);
    this.hide();
    this.element.style.opacity = '';
    this.element.style.transition = '';
  }
}

// ── Scene 05: Memory Garden ────────────────────────────────────────────────
class MemoryScene extends Scene {
  constructor(particles, audio, eggMgr) {
    super('memory');
    this._particles = particles;
    this._audio     = audio;
    this._eggMgr    = eggMgr;
    this._garden    = null;
    this._built     = false;
    this._onContinue = null;
  }

  async enter(fromId) {
    super.enter(fromId);
    this.show();
    this.element.style.opacity = '0';
    await delay(100);
    this.element.style.cssText += 'opacity:1;transition:opacity 1.2s ease;';

    this._buildStars();
    this._particles.setMode('purple-ambient');
    this._particles.start();

    if (!this._built) {
      const container = document.getElementById('memory-garden');
      const overlay   = document.getElementById('memory-frame-overlay');
      this._garden = new MemoryGarden(container, overlay, this._eggMgr, this._audio);
      this._garden.build();
      this._built = true;
    }

    const continueBtn = document.getElementById('memory-continue');
    continueBtn?.addEventListener('click', () => this._onContinue?.(), { once: true });
  }

  _buildStars() {
    const container = document.getElementById('memory-stars');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 60; i++) {
      const dot = document.createElement('div');
      const size = Math.random() < 0.1 ? 'lg' : Math.random() < 0.3 ? 'md' : 'sm';
      dot.className = `star-dot star-dot--${size}`;
      dot.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*60}%;--tw:${2+Math.random()*3}s;--td:${Math.random()*3}s;`;
      container.appendChild(dot);
    }
  }

  setOnContinue(fn) { this._onContinue = fn; }

  play()  { super.play();  this._particles.start(); }
  pause() { super.pause(); this._particles.stop(); }

  async exit() {
    super.exit();
    this._particles.stop();
    this.element.style.transition = 'opacity 1s ease';
    this.element.style.opacity = '0';
    await delay(1000);
    this.hide();
    this.element.style.opacity = '';
    this.element.style.transition = '';
  }
}

// ── Scene 06: Purple Dream Room ───────────────────────────────────────────
class DreamRoomScene extends Scene {
  constructor(particles, audio) {
    super('dreamroom');
    this._particles = particles;
    this._audio     = audio;
    this._onContinue = null;
    this._parallaxActive = false;
    this._handleParallax = null;
  }

  async enter(fromId) {
    super.enter(fromId);
    this.show();
    this.element.style.opacity = '0';
    await delay(100);
    this.element.style.cssText += 'opacity:1;transition:opacity 1.5s ease;';

    document.dispatchEvent(new Event('scene:dreamroom:enter'));

    this._buildWindowStars();
    this._buildFloatingRoses();
    this._buildFloatingPhotos();
    this._setupParallax();
    this._typeRoomQuote();
    this._particles.setMode('purple-ambient');
    this._particles.start();

    const continueBtn = document.getElementById('room-continue');
    continueBtn?.addEventListener('click', () => this._onContinue?.(), { once: true });
  }

  _buildWindowStars() {
    const container = document.getElementById('room-window-stars');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 40; i++) {
      const dot = document.createElement('div');
      const size = Math.random() < 0.1 ? 'lg' : 'sm';
      dot.className = `star-dot star-dot--${size}`;
      dot.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;--tw:${1.5+Math.random()*2.5}s;--td:${Math.random()*2}s;`;
      container.appendChild(dot);
    }
  }

  _buildFloatingRoses() {
    const container = document.getElementById('room-floating-roses');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const el = document.createElement('div');
      el.className = 'room-float-rose';
      el.innerHTML = makeSVGRose(30, 50, 1);
      el.style.cssText = `
        left:${Math.random()*90}%;
        top:${10 + Math.random()*70}%;
        --r:${(Math.random()-0.5)*30}deg;
        --dur:${7+Math.random()*6}s;
        --del:${Math.random()*4}s;
      `;
      container.appendChild(el);
    }
  }

  _buildFloatingPhotos() {
    const container = document.getElementById('room-photos');
    if (!container) return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    container.innerHTML = '';
    const portraits = CONFIG.images.portraits;
    portraits.slice(0, 3).forEach((src, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'room-photo';
      const rotations = [-4, 3, -6, 5];
      wrapper.style.cssText = `
        left:${[5, 78, 12, 72][i]}%;
        top:${[20, 15, 65, 60][i]}%;
        --rot:${rotations[i]}deg;
        --dur:${8+i*2}s;
        --del:${i*1.5}s;
        --opacity:${0.2 + i*0.05};
      `;
      const img = document.createElement('img');
      img.alt = `Rabi portrait ${i+1}`;
      img.loading = 'lazy';
      checkImageExists(src).then(exists => {
        if (exists) img.src = src;
        else wrapper.style.display = 'none';
      });
      wrapper.appendChild(img);
      container.appendChild(wrapper);
    });
  }

  async _typeRoomQuote() {
    const el = document.getElementById('room-quote');
    if (!el) return;
    await delay(1200);
    el.style.opacity = '0';
    el.textContent = CONFIG.dreamRoom.quote;
    el.style.cssText += 'opacity:1;transition:opacity 1.5s ease;';
  }

  _setupParallax() {
    const far  = document.getElementById('room-far');
    const mid  = document.getElementById('room-mid');
    const near = document.getElementById('room-near');

    if (!far && !mid && !near) return;

    const isTouch = 'ontouchstart' in window;
    const cx = innerWidth / 2;
    const cy = innerHeight / 2;

    const move = (nx, ny) => {
      const dx = (nx - cx) / cx;
      const dy = (ny - cy) / cy;
      if (far)  far.style.transform  = `translate(${dx * -8}px, ${dy * -5}px)`;
      if (mid)  mid.style.transform  = `translate(${dx * -14}px, ${dy * -8}px)`;
      if (near) near.style.transform = `translate(${dx * -4}px, ${dy * -2}px)`;
    };

    if (isTouch) {
      this._handleParallax = (e) => {
        const t = e.touches[0];
        move(t.clientX, t.clientY);
      };
      this._on(document, 'touchmove', this._handleParallax, { passive: true });
    } else {
      this._handleParallax = (e) => move(e.clientX, e.clientY);
      this._on(document, 'mousemove', this._handleParallax, { passive: true });
    }
    this._parallaxActive = true;
  }

  setOnContinue(fn) { this._onContinue = fn; }

  play()  { super.play();  this._particles.start(); }
  pause() {
    super.pause();
    this._particles.stop();
  }

  async exit() {
    super.exit();
    this._particles.stop();
    this.element.style.transition = 'opacity 1.2s ease';
    this.element.style.opacity = '0';
    await delay(1200);
    this.hide();
    this.element.style.opacity = '';
    this.element.style.transition = '';
  }
}

// ── Scene 07: The Day ─────────────────────────────────────────────────────
class TheDayScene extends Scene {
  constructor(particles) {
    super('theday');
    this._particles  = particles;
    this._onContinue = null;
  }

  _getBirthdayState() {
    const now   = new Date();
    const bm    = CONFIG.birthday.month;   // 9 = September
    const bd    = CONFIG.birthday.day;     // 6
    const today = { m: now.getMonth() + 1, d: now.getDate() };

    if (today.m === bm && today.d === bd) return 'today';

    // Calculate next birthday
    let next = new Date(now.getFullYear(), bm - 1, bd);
    if (now > next) next = new Date(now.getFullYear() + 1, bm - 1, bd);

    const msLeft  = next - now;
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

    return today.m > bm || (today.m === bm && today.d > bd) ? 'after' : { daysLeft };
  }

  async enter(fromId) {
    super.enter(fromId);
    this.show();
    this.element.style.opacity = '0';
    await delay(100);
    this.element.style.cssText += 'opacity:1;transition:opacity 1s ease;';
    this._particles.setMode('star-field');
    this._particles.start();

    await this._runSequence();

    const continueBtn = document.getElementById('theday-continue');
    continueBtn?.addEventListener('click', () => this._onContinue?.(), { once: true });
  }

  async _runSequence() {
    const cfg     = CONFIG.theDay;
    const numEl   = document.getElementById('theday-number');
    const monthEl = document.getElementById('theday-month');
    const subEl   = document.getElementById('theday-subtitle');
    const statusEl = document.getElementById('theday-status');
    const cdEl    = document.getElementById('theday-countdown');

    await delay(600);
    if (numEl)   numEl.classList.add('theday-number--visible');
    await delay(900);
    if (monthEl) monthEl.classList.add('theday-month--visible');
    await delay(700);
    if (subEl)   subEl.classList.add('theday-subtitle--visible');
    await delay(900);

    const state = this._getBirthdayState();
    if (state === 'today') {
      if (statusEl) { statusEl.textContent = cfg.onBirthday; statusEl.classList.add('theday-status--visible'); }
      this._particles.burst(innerWidth/2, innerHeight/2, 50, 'purple');
    } else if (state === 'after') {
      if (statusEl) { statusEl.textContent = cfg.afterBirthday; statusEl.classList.add('theday-status--visible'); }
    } else {
      // Show countdown
      if (cdEl) {
        cdEl.hidden = false;
        const daysEl  = document.getElementById('countdown-days');
        const labelEl = document.getElementById('countdown-label');
        if (daysEl)  daysEl.textContent  = state.daysLeft;
        if (labelEl) labelEl.textContent = cfg.countdownSuffix;
        cdEl.style.animation = 'sceneSlideInUp 0.8s ease forwards';
      }
    }

    await delay(500);
    const continueBtn = document.getElementById('theday-continue');
    if (continueBtn) continueBtn.style.animation = 'sceneSlideInUp 0.6s ease forwards';
  }

  setOnContinue(fn) { this._onContinue = fn; }

  play()  { super.play();  this._particles.start(); }
  pause() { super.pause(); this._particles.stop(); }

  async exit() {
    super.exit();
    this._particles.stop();
    this.element.style.transition = 'opacity 0.8s ease';
    this.element.style.opacity = '0';
    await delay(800);
    this.hide();
    this.element.style.opacity = '';
    this.element.style.transition = '';
  }
}

// ── Scene 08: Birthday Table ───────────────────────────────────────────────
class BirthdayScene extends Scene {
  constructor(particles, audio) {
    super('birthday');
    this._particles  = particles;
    this._audio      = audio;
    this._candlesLit = 5;
    this._onContinue = null;
  }

  async enter(fromId) {
    super.enter(fromId);
    this.show();
    this.element.style.opacity = '0';
    await delay(100);
    this.element.style.cssText += 'opacity:1;transition:opacity 1s ease;';
    this._particles.setMode('purple-ambient');
    this._particles.start();

    await delay(600);
    const heading = document.getElementById('birthday-heading');
    if (heading) heading.style.animation = 'sceneSlideInUp 1s ease forwards';

    this._setupCandles();
  }

  _setupCandles() {
    const candles = document.querySelectorAll('.cake-candle');
    candles.forEach((candle) => {
      this._on(candle, 'click', () => this._blowCandle(candle));
    });
  }

  _blowCandle(candle) {
    if (candle.classList.contains('extinguished')) return;
    candle.classList.add('extinguished');
    this._audio?.playCandleOut();
    this._candlesLit--;

    if (this._candlesLit <= 0) {
      this._allCandlesOut();
    }
  }

  async _allCandlesOut() {
    const hint = document.getElementById('candle-hint');
    const wish = document.getElementById('birthday-wish');

    if (hint) { hint.style.transition = 'opacity 0.5s'; hint.style.opacity = '0'; }

    await delay(600);
    this._particles.setMode('fireworks');
    this._audio?.playMagic();

    if (wish) {
      wish.hidden = false;
      wish.style.animation = 'sceneSlideInUp 0.8s ease forwards';
    }

    await delay(2000);

    const continueBtn = document.getElementById('birthday-continue');
    if (continueBtn) {
      continueBtn.hidden = false;
      continueBtn.style.animation = 'sceneSlideInUp 0.6s ease forwards';
      continueBtn.addEventListener('click', () => this._onContinue?.(), { once: true });
    }
  }

  setOnContinue(fn) { this._onContinue = fn; }

  play()  { super.play();  this._particles.start(); }
  pause() { super.pause(); this._particles.stop(); }

  async exit() {
    super.exit();
    this._particles.stop();
    this.element.style.transition = 'opacity 0.8s ease';
    this.element.style.opacity = '0';
    await delay(800);
    this.hide();
    this.element.style.opacity = '';
    this.element.style.transition = '';
  }
}

// ── Scene 09: Final Letter ────────────────────────────────────────────────
class LetterScene extends Scene {
  constructor(particles, audio) {
    super('letter');
    this._particles  = particles;
    this._audio      = audio;
    this._onComplete = null;
  }

  async enter(fromId) {
    super.enter(fromId);
    this.show();
    this.element.style.opacity = '0';
    await delay(100);
    this.element.style.cssText += 'opacity:1;transition:opacity 1.5s ease;';
    this._particles.setMode('purple-ambient');
    this._particles.start();

    await delay(1200);
    await this._typeLetter();
    await delay(800);
    await this._showFinalRose();
    await delay(600);
    await this._showFinalPhoto();
    await delay(600);
    this._showContinue();
  }

  async _typeLetter() {
    const cfg        = CONFIG.letter;
    const salEl      = document.getElementById('letter-salutation');
    const bodyEl     = document.getElementById('letter-body');
    const closingEl  = document.getElementById('letter-closing');
    const cursorEl   = document.getElementById('letter-cursor');

    // Salutation
    if (salEl) {
      await typeWriter(salEl, cfg.salutation, 60);
      salEl.classList.add('letter-salutation--visible');
      salEl.style.opacity = '1';
    }

    await delay(600);

    // Body paragraphs
    if (bodyEl) {
      for (const line of cfg.body) {
        if (!line) {
          bodyEl.innerHTML += '<div style="height:1em"></div>';
          await delay(120);
          continue;
        }
        const p = document.createElement('p');
        p.className = 'letter-paragraph';
        bodyEl.appendChild(p);
        await delay(80);
        p.classList.add('letter-paragraph--visible');
        await typeWriter(p, line, 38);
        await delay(200);
      }
    }

    await delay(400);

    // Closing
    if (closingEl) {
      await typeWriter(closingEl, cfg.closing, 45);
      closingEl.classList.add('letter-closing--visible');
      closingEl.style.opacity = '1';
    }

    // Hide cursor
    if (cursorEl) cursorEl.style.display = 'none';
  }

  async _showFinalRose() {
    const roseEl = document.getElementById('letter-final-rose');
    const textEl = roseEl?.querySelector('.final-rose-text');
    const subEl  = roseEl?.querySelector('.final-rose-subtext');

    if (!roseEl) return;

    roseEl.hidden = false;
    roseEl.style.opacity = '0';
    await delay(50);
    roseEl.style.cssText += 'opacity:1;transition:opacity 1.5s ease;';

    this._audio?.playRoseSelect();
  }

  async _showFinalPhoto() {
    const photoEl = document.getElementById('letter-final-photo');
    const img     = document.getElementById('final-photo-img');
    const placeholder = document.getElementById('final-photo-placeholder');
    const src     = CONFIG.images.special.final;

    if (!photoEl) return;

    const exists = await checkImageExists(src);
    if (exists && img) {
      img.src = src;
      img.hidden = false;
      if (placeholder) placeholder.hidden = true;
    } else {
      if (img) img.hidden = true;
      if (placeholder) placeholder.hidden = false;
    }

    photoEl.hidden = false;
    photoEl.style.opacity = '0';
    await delay(50);
    photoEl.style.cssText += 'opacity:1;transition:opacity 1.5s ease;';
  }

  _showContinue() {
    const btn = document.getElementById('letter-continue');
    if (!btn) return;
    btn.hidden = false;
    btn.style.animation = 'sceneSlideInUp 0.8s ease forwards';
    btn.textContent = CONFIG.letter.continueLabel;
    btn.addEventListener('click', () => this._onComplete?.(), { once: true });
  }

  setOnComplete(fn) { this._onComplete = fn; }

  play()  { super.play();  this._particles.start(); }
  pause() { super.pause(); this._particles.stop(); }

  async exit() {
    super.exit();
    this._particles.stop();
    this.element.style.transition = 'opacity 1s ease';
    this.element.style.opacity = '0';
    await delay(1000);
    this.hide();
    this.element.style.opacity = '';
    this.element.style.transition = '';
  }
}

// ── Scene 10: Epilogue ────────────────────────────────────────────────────
class EpilogueScene extends Scene {
  constructor(particles, audio, eggMgr) {
    super('epilogue');
    this._particles = particles;
    this._audio     = audio;
    this._eggMgr    = eggMgr;
    this._canvas    = null;
    this._built     = false;
  }

  async enter(fromId) {
    super.enter(fromId);
    this.show();
    this.element.style.opacity = '0';
    await delay(100);
    this.element.style.cssText += 'opacity:1;transition:opacity 2s ease;';

    this._particles.setMode('epilogue-eternal');
    this._particles.start();

    if (!this._built) {
      this._buildBouquet();
      await delay(1000);
      await this._typeEpilogue();
      this._setupEgg3();
      this._built = true;
    }
  }

  _buildBouquet() {
    const container = document.getElementById('epilogue-bouquet');
    if (!container) return;
    container.innerHTML = '';

    const positions = [
      { left: '40%', bottom: '30%', width: 60, height: 110, rotate: -8, z: 3 },
      { left: '20%', bottom: '20%', width: 50, height: 90, rotate: -22, z: 2 },
      { left: '60%', bottom: '20%', width: 50, height: 90, rotate: 18, z: 2 },
      { left: '5%',  bottom: '10%', width: 44, height: 80, rotate: -30, z: 1 },
      { left: '75%', bottom: '10%', width: 44, height: 80, rotate: 28, z: 1 },
    ];

    positions.forEach((pos, i) => {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `
        position:absolute;left:${pos.left};bottom:${pos.bottom};
        width:${pos.width}px;height:${pos.height}px;
        transform:rotate(${pos.rotate}deg);z-index:${pos.z};
        animation:eternalBreathe ${4 + i * 0.5}s ease-in-out infinite;
        animation-delay:${i * 0.3}s;
        filter:drop-shadow(0 0 ${8 + i*2}px rgba(198,40,40,0.4));
      `;
      wrapper.innerHTML = makeSVGRose(pos.width, pos.height);
      container.appendChild(wrapper);
    });
  }

  async _typeEpilogue() {
    const titleEl = this.element.querySelector('.epilogue-title');
    const lineEl  = document.getElementById('epilogue-final-line');
    const sigEl   = this.element.querySelector('.epilogue-signature');

    await delay(600);
    if (titleEl) titleEl.style.animation = 'sceneSlideInUp 1s ease forwards';
    await delay(1200);
    if (lineEl) {
      lineEl.style.opacity = '0';
      lineEl.textContent = CONFIG.epilogue.finalLine;
      lineEl.style.cssText += 'opacity:1;transition:opacity 1.5s ease;';
    }
    await delay(1500);
    if (sigEl) sigEl.style.animation = 'sceneSlideInUp 0.8s ease forwards';
  }

  _setupEgg3() {
    // The "RABI" text in the epilogue title triggers egg 3
    const titleEl = this.element.querySelector('.epilogue-title');
    if (titleEl && this._eggMgr) {
      // Wrap RABI word
      titleEl.innerHTML = titleEl.innerHTML.replace(
        'The Bouquet That Never Fades',
        'The Bouquet That Never Fades'
      );
      // Actually wire egg 3 to the epilogue-rabi-text or title
      const rabiEl = document.createElement('span');
      rabiEl.className = 'epilogue-rabi-text';
      rabiEl.textContent = 'RABI';
      rabiEl.setAttribute('role', 'button');
      rabiEl.setAttribute('tabindex', '0');
      rabiEl.setAttribute('aria-label', 'Rabi');
      this.element.querySelector('.epilogue-content')?.insertBefore(rabiEl, this.element.querySelector('.epilogue-signature'));
      this._eggMgr.setupEgg3(rabiEl);
    }
  }

  play()  { super.play();  this._particles.start(); }
  pause() { super.pause(); this._particles.stop(); }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCENE MANAGER
═══════════════════════════════════════════════════════════════════════════ */
class SceneManager {
  constructor() {
    this.current     = null;
    this.scenes      = {};
    this.transitioning = false;
    this.history     = [];
  }

  register(id, scene) {
    this.scenes[id] = scene;
  }

  async go(toId, opts = {}) {
    if (this.transitioning) return;
    if (this.current?.id === toId) return;
    if (!this.scenes[toId]) return;

    this.transitioning = true;

    const fromScene = this.current;
    const toScene   = this.scenes[toId];

    try {
      await toScene.preload?.();

      if (fromScene) await fromScene.exit(toId, opts);

      await toScene.enter(fromScene?.id || null, opts);

      this.history.push(toId);
      this.current = toScene;

      if (fromScene) {
        setTimeout(() => {
          fromScene.pause?.();
          fromScene.hide?.();
        }, 300);
      }

      this._updateProgress(toId);
    } catch(e) {
      console.error('[SceneManager] Transition error:', e);
    } finally {
      this.transitioning = false;
    }
  }

  _updateProgress(sceneId) {
    const order = ['loading','opening','developer','bouquet','galaxy','memory','dreamroom','theday','birthday','letter','epilogue'];
    const idx   = order.indexOf(sceneId);
    const label = document.getElementById('progress-label');
    const dots  = document.getElementById('progress-dots');
    if (!label || !dots) return;

    const displayScenes = order.slice(1); // Exclude loading
    const displayIdx    = displayScenes.indexOf(sceneId);
    if (displayIdx < 0) return;

    label.textContent = `${String(displayIdx + 1).padStart(2,'0')} / ${String(displayScenes.length).padStart(2,'0')}`;

    dots.innerHTML = '';
    displayScenes.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'progress-dot' + (i === displayIdx ? ' progress-dot--active' : i < displayIdx ? ' progress-dot--done' : '');
      dots.appendChild(dot);
    });
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   CURSOR EFFECTS
═══════════════════════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor  = document.getElementById('cursor');
  const trail   = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;
  let heartTimer = null;

  document.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top  = ty + 'px';
  }, { passive: true });

  const animTrail = () => {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    trail.style.left = cx + 'px';
    trail.style.top  = cy + 'px';
    requestAnimationFrame(animTrail);
  };
  animTrail();

  // Occasional heart particle
  document.addEventListener('mousemove', () => {
    if (heartTimer) return;
    heartTimer = setTimeout(() => {
      if (Math.random() < 0.08) spawnHeartAt(tx, ty);
      heartTimer = null;
    }, 200);
  }, { passive: true });

  // Cursor state on interactive elements
  document.querySelectorAll('button, [role="button"], a').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      trail.style.transform  = 'translate(-50%,-50%) scale(0.6)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      trail.style.transform  = 'translate(-50%,-50%) scale(1)';
    });
  });
}

function spawnHeartAt(x, y) {
  const el = document.createElement('span');
  el.className = 'cursor-heart';
  el.textContent = Math.random() < 0.5 ? '💜' : '🌹';
  el.style.left = x + 'px';
  el.style.top  = y + 'px';
  el.style.setProperty('--rot', `${(Math.random()-0.5)*40}deg`);
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

/* ═══════════════════════════════════════════════════════════════════════════
   APP INITIALIZATION
═══════════════════════════════════════════════════════════════════════════ */
async function init() {
  // Detect quality
  const quality = AdaptiveQuality.detect();

  // Global systems
  const particleCanvas = document.getElementById('particle-canvas');
  const particles      = new ParticleSystem(particleCanvas, quality);
  const audio          = new AudioManager();
  const eggMgr         = new EasterEggManager(audio);
  const manager        = new SceneManager();

  // Init scenes
  const loading   = new LoadingScene();
  const opening   = new OpeningScene(particles);
  const developer = new DeveloperScene(particles, audio);
  const bouquet   = new BouquetScene(particles, audio);
  const galaxy    = new GalaxyScene(particles, audio);
  const memory    = new MemoryScene(particles, audio, eggMgr);
  const dreamroom = new DreamRoomScene(particles, audio);
  const theday    = new TheDayScene(particles);
  const birthday  = new BirthdayScene(particles, audio);
  const letter    = new LetterScene(particles, audio);
  const epilogue  = new EpilogueScene(particles, audio, eggMgr);

  manager.register('loading',   loading);
  manager.register('opening',   opening);
  manager.register('developer', developer);
  manager.register('bouquet',   bouquet);
  manager.register('galaxy',    galaxy);
  manager.register('memory',    memory);
  manager.register('dreamroom', dreamroom);
  manager.register('theday',    theday);
  manager.register('birthday',  birthday);
  manager.register('letter',    letter);
  manager.register('epilogue',  epilogue);

  // Wire scene transitions
  document.getElementById('opening-continue')?.addEventListener('click', () => manager.go('developer'));
  developer.setOnComplete(() => manager.go('bouquet'));
  bouquet.setOnFinalPick(() => { setTimeout(() => manager.go('galaxy'), 1800); });
  galaxy.setOnContinue(() => manager.go('memory'));
  memory.setOnContinue(() => manager.go('dreamroom'));
  dreamroom.setOnContinue(() => manager.go('theday'));
  theday.setOnContinue(() => manager.go('birthday'));
  birthday.setOnContinue(() => manager.go('letter'));
  letter.setOnComplete(() => manager.go('epilogue'));

  // Mute button
  const muteBtn = document.getElementById('mute-btn');
  muteBtn?.addEventListener('click', () => audio.toggleMute());

  // Easter eggs
  eggMgr.init();

  // Progress indicator — shown after loading
  const progressEl = document.getElementById('progress-indicator');

  // ── Check revisit ────────────────────────────────────────────────────────
  const hasVisited = localStorage.getItem('rabi-visited');
  if (hasVisited) {
    const revisitGate = document.getElementById('revisit-gate');
    const nameEl      = document.getElementById('revisit-name');
    if (revisitGate && nameEl) {
      nameEl.textContent = CONFIG.revisit.greeting;
      revisitGate.hidden = false;

      document.getElementById('revisit-bouquet-btn')?.addEventListener('click', () => {
        revisitGate.style.animation = 'sceneOut 0.6s ease forwards';
        setTimeout(() => {
          revisitGate.hidden = true;
          startExperience(true);
        }, 600);
      });

      document.getElementById('revisit-replay-btn')?.addEventListener('click', () => {
        revisitGate.style.animation = 'sceneOut 0.6s ease forwards';
        setTimeout(() => {
          revisitGate.hidden = true;
          startExperience(false);
        }, 600);
      });
    }
  }

  // ── Audio gate → Loading → Experience ───────────────────────────────────
  const audioGate = document.getElementById('audio-gate');

  const startExperience = async (skipToEnd = false) => {
    localStorage.setItem('rabi-visited', '1');

    // Show mute button
    if (muteBtn) muteBtn.hidden = false;
    if (progressEl) progressEl.hidden = false;

    if (skipToEnd) {
      // Direct to bouquet on revisit if chosen
      await manager.go('bouquet');
      return;
    }

    // Run loading then open experience
    await manager.go('loading');
    loading.show();
    loading.state = 'playing';

    loading.run(async () => {
      // Fade out loading
      const loadEl = document.getElementById('scene-loading');
      if (loadEl) {
        loadEl.style.transition = 'opacity 1s ease';
        loadEl.style.opacity = '0';
      }
      await delay(1000);
      loading.hide();
      await manager.go('opening');
    });
  };

  if (!hasVisited) {
    // First visit — show audio gate
    document.getElementById('audio-yes-btn')?.addEventListener('click', async () => {
      audioGate.style.animation = 'sceneOut 0.6s ease forwards';
      setTimeout(async () => {
        audioGate.hidden = true;
        await audio.init(true);
        await startExperience(false);
      }, 600);
    }, { once: true });

    document.getElementById('audio-no-btn')?.addEventListener('click', async () => {
      audioGate.style.animation = 'sceneOut 0.6s ease forwards';
      setTimeout(async () => {
        audioGate.hidden = true;
        await audio.init(false);
        await startExperience(false);
      }, 600);
    }, { once: true });
  } else {
    // Returning visitor — hide audio gate, show revisit
    audioGate.hidden = true;
    await audio.init(false); // start silently; user can unmute
  }

  // ── Page visibility API — pause when hidden ───────────────────────────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      manager.current?.pause?.();
    } else {
      manager.current?.play?.();
      audio.resume?.();
    }
  });

  // ── Custom cursor ─────────────────────────────────────────────────────────
  const isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (!isTouchDevice) initCursor();

  // ── Resize — maintain canvas ──────────────────────────────────────────────
  window.addEventListener('resize', () => {
    // Sessions storage preserves discovery, orientation doesn't reset eggs
  }, { passive: true });
}

// Boot
document.addEventListener('DOMContentLoaded', init);
