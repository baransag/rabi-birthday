/* ═══════════════════════════════════════════════════════════════════════════
   RABI — Adaptive Particle System
   particles.js
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

class ParticleSystem {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {string} quality — 'HIGH' | 'MEDIUM' | 'LOW' | 'REDUCED'
   */
  constructor(canvas, quality = 'MEDIUM') {
    this.canvas  = canvas;
    this.ctx     = canvas.getContext('2d');
    this.quality = quality;
    this.particles = [];
    this.emitters  = [];
    this._rafId    = null;
    this._running  = false;
    this._lastTime = 0;
    this._frameCount = 0;
    this._fpsWindow  = [];

    // Quality caps
    this._maxCounts = { HIGH: 220, MEDIUM: 120, LOW: 60, REDUCED: 0 };
    this._maxParticles = this._maxCounts[quality] ?? 80;

    this._resize();
    window.addEventListener('resize', () => this._resize(), { passive: true });
  }

  _resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width  = window.innerWidth  * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width  = window.innerWidth  + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.scale(dpr, dpr);
    this._w = window.innerWidth;
    this._h = window.innerHeight;
  }

  start() {
    if (this._running || this.quality === 'REDUCED') return;
    this._running = true;
    this._lastTime = performance.now();
    this._loop(this._lastTime);
  }

  stop() {
    this._running = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  clear() {
    this.particles = [];
    this.emitters  = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this._w, this._h);
    }
  }

  setMode(mode) {
    this.clear();
    this.emitters = [];

    switch (mode) {
      case 'purple-ambient':    this._setupPurpleAmbient(); break;
      case 'petal-rain':        this._setupPetalRain();     break;
      case 'star-field':        this._setupStarField();     break;
      case 'bouquet-sparkle':   this._setupBouquetSparkle(); break;
      case 'petal-explosion':   this._setupPetalExplosion(); break;
      case 'galaxy-nebula':     this._setupGalaxyNebula();  break;
      case 'epilogue-eternal':  this._setupEpilogueEternal(); break;
      case 'fireworks':         this._setupFireworks();     break;
      case 'none': default:     break;
    }
  }

  // ── Particle Emitter Presets ─────────────────────────────────────────────

  _setupPurpleAmbient() {
    // Slow gentle purple particles drifting up
    const count = Math.floor(this._maxParticles * 0.5);
    for (let i = 0; i < count; i++) {
      this.particles.push(this._makePurpleParticle(true));
    }
    this.emitters.push({
      type: 'purple-ambient',
      rate: 0.5,                 // particles per frame
      acc: 0,
    });
  }

  _setupPetalRain() {
    const count = Math.floor(this._maxParticles * 0.6);
    for (let i = 0; i < count; i++) {
      const p = this._makePetal('red');
      p.y = Math.random() * this._h;  // spread initially
      this.particles.push(p);
    }
    this.emitters.push({ type: 'petal-rain', rate: 0.4, acc: 0 });
  }

  _setupStarField() {
    const count = this._maxParticles;
    for (let i = 0; i < count; i++) {
      this.particles.push(this._makeStar(true));
    }
    // No continuous emitter — stars stay put
  }

  _setupBouquetSparkle() {
    const count = Math.floor(this._maxParticles * 0.3);
    for (let i = 0; i < count; i++) {
      this.particles.push(this._makeSparkle());
    }
    this.emitters.push({ type: 'sparkle', rate: 0.3, acc: 0 });
  }

  _setupPetalExplosion() {
    // Massive burst from center
    const count = this._maxParticles;
    const cx = this._w / 2;
    const cy = this._h / 2;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 2 + Math.random() * 6;
      const p = this._makePetal(Math.random() < 0.6 ? 'red' : 'purple');
      p.x  = cx;
      p.y  = cy;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 2;
      p.life = 0.8 + Math.random() * 0.8;
      p.maxLife = p.life;
      this.particles.push(p);
    }
    // Then transition to rain
    setTimeout(() => this.setMode('petal-rain'), 2000);
  }

  _setupGalaxyNebula() {
    // Stars + purple nebula dust
    const starCount = Math.floor(this._maxParticles * 0.8);
    const dustCount = Math.floor(this._maxParticles * 0.2);
    for (let i = 0; i < starCount; i++) this.particles.push(this._makeStar(true));
    for (let i = 0; i < dustCount; i++) this.particles.push(this._makeNebulaDust());
    this.emitters.push({ type: 'nebula-drift', rate: 0.1, acc: 0 });
  }

  _setupEpilogueEternal() {
    // Living bouquet: mix of petals and sparkles, slow and breathing
    const count = Math.floor(this._maxParticles * 0.6);
    for (let i = 0; i < count; i++) {
      if (Math.random() < 0.4) this.particles.push(this._makePetal('red'));
      else if (Math.random() < 0.5) this.particles.push(this._makePetal('purple'));
      else this.particles.push(this._makeSparkle());
    }
    this.emitters.push({ type: 'eternal', rate: 0.2, acc: 0 });
  }

  _setupFireworks() {
    // Birthday fireworks — purple and gold
    const launch = () => {
      if (!this._running) return;
      this._launchFirework();
      const next = 400 + Math.random() * 600;
      setTimeout(launch, next);
    };
    launch();
  }

  _launchFirework() {
    const cx = this._w * (0.2 + Math.random() * 0.6);
    const cy = this._h * (0.1 + Math.random() * 0.5);
    const colors = [
      '#c77dff', '#e040fb', '#f3e5f5',  // purple range
      '#ef5350', '#ff8a80',              // rose range
      '#fff9c4', '#ffe082',              // gold
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = Math.floor(20 + Math.random() * 30);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        type: 'firework',
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 2,
        color,
        life: 0.8 + Math.random() * 0.5,
        maxLife: 1.3,
        gravity: 0.06,
        alpha: 1,
      });
    }
  }

  // ── Particle Factories ───────────────────────────────────────────────────

  _makePurpleParticle(randomY = false) {
    const colors = ['#c77dff', '#e040fb', '#9b59b6', '#f3e5f5', '#a855f7'];
    return {
      type: 'circle',
      x:  Math.random() * this._w,
      y:  randomY ? Math.random() * this._h : this._h + 10,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.3 + Math.random() * 0.6),
      size: 1 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.2 + Math.random() * 0.5,
      life:  2 + Math.random() * 4,
      maxLife: 6,
      gravity: 0,
    };
  }

  _makePetal(colorType = 'red') {
    const w  = 6 + Math.random() * 10;
    const h  = w * (0.5 + Math.random() * 0.4);
    const drift = (Math.random() - 0.5) * 200;
    const colors = colorType === 'red'
      ? ['rgba(198,40,40,', 'rgba(229,57,53,', 'rgba(239,83,80,', 'rgba(183,28,28,']
      : ['rgba(199,125,255,', 'rgba(156,39,176,', 'rgba(74,44,138,', 'rgba(224,64,251,'];
    const base = colors[Math.floor(Math.random() * colors.length)];

    return {
      type: 'petal',
      x: Math.random() * this._w,
      y: -20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1 + Math.random() * 2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.08,
      w, h,
      drift,
      color: base,
      alpha: 0.7 + Math.random() * 0.3,
      life: 3 + Math.random() * 3,
      maxLife: 6,
      gravity: 0.02,
    };
  }

  _makeStar(randomY = false) {
    const size = Math.random() < 0.1 ? 2.5 : Math.random() < 0.3 ? 1.5 : 0.8;
    return {
      type: 'star',
      x: Math.random() * this._w,
      y: randomY ? Math.random() * this._h : Math.random() * this._h * 0.7,
      vx: 0, vy: 0,
      size,
      alpha: 0.2 + Math.random() * 0.8,
      baseAlpha: 0.2 + Math.random() * 0.8,
      twinkleSpeed: 0.01 + Math.random() * 0.03,
      twinkleOffset: Math.random() * Math.PI * 2,
      life: 99999,
      maxLife: 99999,
      gravity: 0,
    };
  }

  _makeNebulaDust() {
    return {
      type: 'nebula',
      x: Math.random() * this._w,
      y: Math.random() * this._h,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      size: 40 + Math.random() * 80,
      alpha: 0.02 + Math.random() * 0.04,
      color: Math.random() < 0.6 ? '74,44,138' : '199,125,255',
      life: 99999, maxLife: 99999, gravity: 0,
    };
  }

  _makeSparkle() {
    return {
      type: 'sparkle',
      x: Math.random() * this._w,
      y: Math.random() * this._h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.5 - Math.random() * 0.5,
      size: 1 + Math.random() * 2,
      alpha: 0.8,
      color: '#c77dff',
      life: 1 + Math.random() * 2,
      maxLife: 3,
      gravity: 0,
      sparkleT: 0,
    };
  }

  // ── Main Loop ────────────────────────────────────────────────────────────

  _loop(timestamp) {
    if (!this._running) return;
    this._rafId = requestAnimationFrame((t) => this._loop(t));

    const dt = Math.min((timestamp - this._lastTime) / 1000, 0.05); // cap at 50ms
    this._lastTime = timestamp;

    // Adaptive FPS reduction
    this._fpsWindow.push(1 / (dt || 0.016));
    if (this._fpsWindow.length > 60) this._fpsWindow.shift();
    const avgFps = this._fpsWindow.reduce((a, b) => a + b, 0) / this._fpsWindow.length;
    if (avgFps < 30 && this._maxParticles > 30) {
      this._maxParticles = Math.max(30, this._maxParticles - 5);
    }

    this._update(dt);
    this._draw();
  }

  _update(dt) {
    // Emit new particles
    for (const emitter of this.emitters) {
      emitter.acc += emitter.rate;
      while (emitter.acc >= 1 && this.particles.length < this._maxParticles) {
        emitter.acc -= 1;
        this.particles.push(this._emitFor(emitter.type));
      }
      emitter.acc = emitter.acc % 1;
    }

    // Update particles
    this.particles = this.particles.filter(p => {
      p.life -= dt;
      if (p.life <= 0) return false;

      p.x  += p.vx;
      p.y  += p.vy;
      if (p.gravity) p.vy += p.gravity;

      // Petal sway
      if (p.type === 'petal') {
        p.rot += p.rotV;
        p.x   += Math.sin(p.life * 2) * 0.4;
      }

      // Star twinkle
      if (p.type === 'star') {
        p.twinkleOffset += p.twinkleSpeed;
        p.alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(p.twinkleOffset));
      }

      // Sparkle phase
      if (p.type === 'sparkle') {
        p.sparkleT += dt;
        p.alpha = Math.max(0, 1 - p.sparkleT / p.maxLife);
      }

      // Wrap horizontally for ambient types
      if (p.x < -20) p.x = this._w + 10;
      if (p.x > this._w + 20) p.x = -10;

      // Remove if off bottom/top
      if (p.y > this._h + 40) return false;
      if (p.type === 'circle' && p.y < -40) return false;

      return true;
    });
  }

  _emitFor(type) {
    switch (type) {
      case 'purple-ambient': return this._makePurpleParticle();
      case 'petal-rain':     return this._makePetal(Math.random() < 0.7 ? 'red' : 'purple');
      case 'sparkle':        return this._makeSparkle();
      case 'nebula-drift':   return this._makeNebulaDust();
      case 'eternal':
        return Math.random() < 0.5
          ? this._makePetal(Math.random() < 0.6 ? 'red' : 'purple')
          : this._makeSparkle();
      default: return this._makePurpleParticle();
    }
  }

  _draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this._w, this._h);

    for (const p of this.particles) {
      const progress = 1 - p.life / p.maxLife;
      let alpha = p.alpha;

      // Fade in/out
      if (progress < 0.1) alpha *= progress / 0.1;
      if (progress > 0.8) alpha *= (1 - progress) / 0.2;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      switch (p.type) {
        case 'circle': {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          // Soft glow
          const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grd.addColorStop(0, p.color + '40');
          grd.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
          break;
        }

        case 'petal': {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
          const pg = ctx.createRadialGradient(-p.w * 0.2, -p.h * 0.2, 0, 0, 0, p.w * 0.7);
          pg.addColorStop(0, p.color + '0.9)');
          pg.addColorStop(1, p.color + '0.2)');
          ctx.fillStyle = pg;
          ctx.fill();
          break;
        }

        case 'star': {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          if (p.size > 1.2) {
            const sg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
            sg.addColorStop(0, 'rgba(255,255,255,0.3)');
            sg.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            ctx.fillStyle = sg;
            ctx.fill();
          }
          break;
        }

        case 'nebula': {
          const ng = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          ng.addColorStop(0, `rgba(${p.color},${alpha * 0.5})`);
          ng.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = ng;
          ctx.fill();
          break;
        }

        case 'sparkle': {
          // Cross/star shape
          ctx.strokeStyle = p.color;
          ctx.lineWidth   = p.size * 0.5;
          ctx.lineCap = 'round';
          const s = p.size * 2;
          ctx.beginPath();
          ctx.moveTo(p.x - s, p.y); ctx.lineTo(p.x + s, p.y);
          ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x, p.y + s);
          ctx.stroke();
          break;
        }

        case 'firework': {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          const fg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          fg.addColorStop(0, p.color + '60');
          fg.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = fg;
          ctx.fill();
          break;
        }
      }

      ctx.restore();
    }
  }

  // ── Public burst helpers ─────────────────────────────────────────────────

  burst(x, y, count = 30, colorType = 'purple') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      const p = colorType === 'petal'
        ? this._makePetal(Math.random() < 0.6 ? 'red' : 'purple')
        : this._makePurpleParticle();
      p.x  = x;
      p.y  = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.life = 0.5 + Math.random() * 1;
      p.maxLife = p.life;
      this.particles.push(p);
    }
  }
}
