/* ═══════════════════════════════════════════════════════════════════════════
   RABI — THE BEAUTIFUL BIRTHDAY GIFT
   js/app.js — Core Interactive Application Logic
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const content = window.CONTENT || {};

  /* ─── 1. AUDIO PRIORITY MANAGER ─────────────────────────────────────────── */
  const AudioManager = {
    ctx: null,
    bgMusic: null,
    specialAudio: null,
    isEnabled: false,
    currentVolume: 0.35,

    init() {
      const saved = sessionStorage.getItem('rabi_audio_enabled');
      if (saved === 'true') {
        this.isEnabled = true;
        this.updateBtnStates(true);
      }

      const navBtn = document.getElementById('nav-audio-btn');
      const drawerBtn = document.getElementById('drawer-audio-btn');

      const toggle = () => this.toggleGlobal();
      navBtn?.addEventListener('click', toggle);
      drawerBtn?.addEventListener('click', toggle);
    },

    initContext() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    toggleGlobal() {
      this.initContext();
      this.isEnabled = !this.isEnabled;
      sessionStorage.setItem('rabi_audio_enabled', String(this.isEnabled));

      if (this.isEnabled) {
        this.playBgMusic();
      } else {
        this.pauseAll();
      }
      this.updateBtnStates(this.isEnabled);
    },

    updateBtnStates(playing) {
      const navBtn = document.getElementById('nav-audio-btn');
      const drawerBtn = document.getElementById('drawer-audio-btn');

      if (playing) {
        navBtn?.classList.add('playing');
        drawerBtn?.classList.add('playing');
        if (navBtn) navBtn.innerHTML = '<span class="vinyl-disc-icon">💿</span> Pause Music';
        if (drawerBtn) drawerBtn.innerHTML = '<span class="vinyl-disc-icon">💿</span> Pause Music';
      } else {
        navBtn?.classList.remove('playing');
        drawerBtn?.classList.remove('playing');
        if (navBtn) navBtn.innerHTML = '<span class="vinyl-disc-icon">♫</span> Play Music';
        if (drawerBtn) drawerBtn.innerHTML = '<span class="vinyl-disc-icon">♫</span> Play Music';
      }
    },

    playBgMusic() {
      if (!this.bgMusic) {
        this.bgMusic = new Audio(content.audio?.backgroundMusic || 'assets/audio/background-music.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.currentVolume;
      }

      this.bgMusic.play().catch(() => {
        this.playChime();
      });
    },

    fadeBgMusic(targetVolume, durationMs = 800) {
      if (!this.bgMusic) return;
      const initial = this.bgMusic.volume;
      const steps = 15;
      const stepTime = durationMs / steps;
      const delta = (targetVolume - initial) / steps;
      let count = 0;

      const timer = setInterval(() => {
        count++;
        this.bgMusic.volume = Math.max(0, Math.min(1, this.bgMusic.volume + delta));
        if (count >= steps) {
          clearInterval(timer);
          this.bgMusic.volume = targetVolume;
        }
      }, stepTime);
    },

    playSpecialAudio(src, onComplete) {
      this.initContext();
      if (this.bgMusic) {
        this.fadeBgMusic(0.05, 600);
      }

      if (this.specialAudio) {
        this.specialAudio.pause();
      }

      this.specialAudio = new Audio(src);
      this.specialAudio.play().then(() => {
        this.specialAudio.onended = () => {
          if (this.bgMusic && this.isEnabled) {
            this.fadeBgMusic(this.currentVolume, 800);
          }
          if (onComplete) onComplete();
        };
      }).catch(() => {
        this.playChime();
        if (onComplete) onComplete();
      });
    },

    pauseAll() {
      if (this.bgMusic) this.bgMusic.pause();
      if (this.specialAudio) this.specialAudio.pause();
    },

    playChime() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.08, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.8);
      });
    },

    playPop() {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    }
  };

  /* ─── 2. INTERACTIVE TOUCH / CLICK HEART SPARKS ─────────────────────────── */
  const TouchHeartSparks = {
    init() {
      const symbols = ['💖', '🌸', '✨', '💜', '🌹', '💐'];
      const spawn = (e) => {
        // Avoid spawning when clicking inputs or video controls
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'VIDEO') return;

        const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
        const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
        if (!x || !y) return;

        const p = document.createElement('span');
        p.className = 'click-heart-particle';
        p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        p.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 40}px`);
        p.style.setProperty('--rot', `${(Math.random() - 0.5) * 45}deg`);
        document.body.appendChild(p);

        setTimeout(() => p.remove(), 900);
      };

      window.addEventListener('click', spawn, { passive: true });
    }
  };

  /* ─── 3. NAVIGATION & JOURNEY INDICATOR ─────────────────────────────────── */
  const Navigation = {
    init() {
      const navbar = document.querySelector('.navbar');
      const hamburger = document.getElementById('hamburger-btn');
      const drawer = document.getElementById('mobile-drawer');
      const overlay = document.getElementById('drawer-overlay');
      const closeBtn = document.getElementById('drawer-close-btn');
      const links = document.querySelectorAll('.nav-link, .drawer-link');

      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          navbar?.classList.add('scrolled');
        } else {
          navbar?.classList.remove('scrolled');
        }
        this.updateActiveLinkAndJourney();
      }, { passive: true });

      const openDrawer = () => {
        drawer?.classList.add('open');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
      };

      const closeDrawer = () => {
        drawer?.classList.remove('open');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
      };

      hamburger?.addEventListener('click', openDrawer);
      closeBtn?.addEventListener('click', closeDrawer);
      overlay?.addEventListener('click', closeDrawer);

      links.forEach(link => {
        link.addEventListener('click', () => {
          closeDrawer();
        });
      });
    },

    updateActiveLinkAndJourney() {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.scrollY + 140;

      const journeySteps = content.journey?.steps || [
        { id: "hero", label: "Welcome", num: "01" },
        { id: "about", label: "About Rabi", num: "02" },
        { id: "memories", label: "Memories", num: "03" },
        { id: "souls", label: "Two Souls", num: "04" },
        { id: "moments", label: "Moments", num: "05" },
        { id: "birthday", label: "Birthday", num: "06" },
        { id: "letter", label: "Letters", num: "07" },
        { id: "surprise", label: "Surprise", num: "08" }
      ];

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);

        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link?.classList.add('active');

          const step = journeySteps.find(s => s.id === id);
          if (step) {
            const numEl = document.getElementById('journey-num');
            const labelEl = document.getElementById('journey-label');
            if (numEl) numEl.textContent = `${step.num} / 08`;
            if (labelEl) labelEl.textContent = step.label;
          }
        }
      });
    }
  };

  /* ─── 4. HERO PETALS CANVAS ─────────────────────────────────────────────── */
  const HeroPetals = {
    canvas: null,
    ctx: null,
    petals: [],

    init() {
      this.canvas = document.getElementById('hero-petals-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });

      for (let i = 0; i < 20; i++) {
        this.petals.push(this.createPetal());
      }
      this.loop();
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    },

    createPetal() {
      const colors = ['rgba(246, 214, 216, 0.75)', 'rgba(239, 195, 204, 0.75)', 'rgba(223, 163, 175, 0.7)', 'rgba(221, 212, 243, 0.65)'];
      return {
        x: Math.random() * (this.canvas?.width || window.innerWidth),
        y: Math.random() * (this.canvas?.height || 600) - 50,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 0.7 + 0.35,
        speedX: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02
      };
    },

    loop() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.petals.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(p.angle) * 0.5 + p.speedX;
        p.angle += p.angleSpeed;

        if (p.y > this.canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * this.canvas.width;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.angle);
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
        this.ctx.restore();
      });

      requestAnimationFrame(() => this.loop());
    }
  };

  /* ─── 5. DIGITAL ENVELOPE / GIFT MODAL ──────────────────────────────────── */
  const GiftModal = {
    init() {
      const openBtn = document.getElementById('open-gift-btn');
      const modal = document.getElementById('gift-modal');
      const closeBtn = document.getElementById('gift-modal-close');
      const startBtn = document.getElementById('start-exploring-btn');
      const msgEl = document.getElementById('gift-modal-text');

      if (msgEl && content.hero?.giftMessage) {
        msgEl.textContent = content.hero.giftMessage;
      }

      const open = () => {
        modal?.classList.add('active');
        AudioManager.initContext();
        AudioManager.playChime();
        document.body.style.overflow = 'hidden';
      };

      const close = () => {
        modal?.classList.remove('active');
        document.body.style.overflow = '';
      };

      openBtn?.addEventListener('click', open);
      closeBtn?.addEventListener('click', close);
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) close();
      });

      startBtn?.addEventListener('click', () => {
        close();
        const aboutSec = document.getElementById('about');
        aboutSec?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  /* ─── 6. REASONS YOU'RE SPECIAL ─────────────────────────────────────────── */
  const ReasonsSection = {
    init() {
      const grid = document.getElementById('reasons-grid');
      if (!grid) return;

      const reasons = content.reasons || [];
      grid.innerHTML = '';

      reasons.forEach(r => {
        const card = document.createElement('div');
        card.className = 'reason-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${r.tag}: ${r.title}`);

        card.innerHTML = `
          <div class="reason-header">
            <span class="reason-tag">${r.tag}</span>
            <span class="reason-icon">🌸</span>
          </div>
          <h3 class="reason-title">${r.title}</h3>
          <p class="reason-revealed-text">${r.text}</p>
          <div class="reason-front-prompt">
            <span>${r.front || 'Tap to reveal ♡'}</span>
            <span>→</span>
          </div>
        `;

        const reveal = () => {
          card.classList.toggle('revealed');
          AudioManager.initContext();
          AudioManager.playPop();
        };

        card.addEventListener('click', reveal);
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            reveal();
          }
        });

        grid.appendChild(card);
      });
    }
  };

  /* ─── 7. MEMORY GALLERY & LIGHTBOX & MEMORY BLOOM ───────────────────────── */
  const MemoryGallery = {
    currentIndex: 0,
    items: [],

    init() {
      const grid = document.getElementById('gallery-grid');
      if (!grid) return;

      this.items = content.memories || [];
      grid.innerHTML = '';

      this.items.forEach((m, idx) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View memory: ${m.title}`);

        item.innerHTML = `
          <div class="gallery-thumb-wrapper">
            <img src="${m.image}" alt="${m.alt || m.title}" class="gallery-thumb" loading="lazy">
            <div class="gallery-overlay">
              <span class="gallery-overlay-text">${m.title} ♡</span>
            </div>
          </div>
          <div class="gallery-item-caption">
            <p>${m.caption}</p>
          </div>
        `;

        const img = item.querySelector('.gallery-thumb');
        img.onerror = () => {
          if (m.localImage) {
            img.src = m.localImage;
          }
        };

        item.addEventListener('click', () => this.openLightbox(idx));
        grid.appendChild(item);
      });

      this.initLightbox();
      this.initMemoryBloom();
    },

    initLightbox() {
      const modal = document.getElementById('gallery-lightbox');
      const closeBtn = document.getElementById('lightbox-close');
      const prevBtn = document.getElementById('lightbox-prev');
      const nextBtn = document.getElementById('lightbox-next');

      closeBtn?.addEventListener('click', () => this.closeLightbox());
      prevBtn?.addEventListener('click', () => this.prev());
      nextBtn?.addEventListener('click', () => this.next());

      modal?.addEventListener('click', (e) => {
        if (e.target === modal) this.closeLightbox();
      });

      document.addEventListener('keydown', (e) => {
        if (!modal?.classList.contains('active')) return;
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    },

    openLightbox(idx) {
      this.currentIndex = idx;
      this.renderLightboxContent();
      const modal = document.getElementById('gallery-lightbox');
      modal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
      const modal = document.getElementById('gallery-lightbox');
      modal?.classList.remove('active');
      document.body.style.overflow = '';
    },

    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
      this.renderLightboxContent();
    },

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
      this.renderLightboxContent();
    },

    renderLightboxContent() {
      const item = this.items[this.currentIndex];
      if (!item) return;

      const img = document.getElementById('lightbox-img');
      const title = document.getElementById('lightbox-title');
      const caption = document.getElementById('lightbox-caption');

      if (title) title.textContent = `${item.title} (${this.currentIndex + 1} / ${this.items.length})`;
      if (caption) caption.textContent = item.caption;

      if (img) {
        img.src = item.image;
        img.alt = item.title;
      }
    },

    initMemoryBloom() {
      const bloomBtn = document.getElementById('bloom-trigger-btn');
      const bloomStage = document.getElementById('memory-bloom-stage');

      bloomBtn?.addEventListener('click', () => {
        AudioManager.initContext();
        AudioManager.playChime();
        bloomStage?.classList.add('bloomed');
        bloomBtn.style.display = 'none';
      });
    }
  };

  /* ─── 8. TWO SOULS GALAXY SUPERNOVA & SURPRISE CATCHER GAME ─────────────── */
  const TwoSoulsGame = {
    canvas: null,
    ctx: null,
    orb1: null,
    orb2: null,
    isDragging: null,
    merged: false,
    stars: [],
    supernovaParticles: [],
    fallingSurprises: [],
    surpriseInterval: null,
    caughtCount: 0,
    targetSurprises: 6,

    init() {
      this.canvas = document.getElementById('souls-canvas');
      this.orb1 = document.getElementById('soul-orb-1');
      this.orb2 = document.getElementById('soul-orb-2');
      const mergeResetBtn = document.getElementById('souls-reset-btn');
      const popupCloseBtn = document.getElementById('surprise-popup-close');

      if (!this.canvas || !this.orb1 || !this.orb2) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });

      // Init star background
      for (let i = 0; i < 60; i++) {
        this.stars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.8 + 0.2
        });
      }

      this.resetOrbs();
      this.setupDraggable(this.orb1, 1);
      this.setupDraggable(this.orb2, 2);

      mergeResetBtn?.addEventListener('click', () => {
        this.merged = false;
        this.caughtCount = 0;
        clearInterval(this.surpriseInterval);
        document.getElementById('souls-merged-banner')?.classList.remove('active');
        document.getElementById('souls-score-badge').style.display = 'none';
        document.querySelectorAll('.falling-surprise-item').forEach(e => e.remove());
        this.resetOrbs();
        AudioManager.playChime();
      });

      popupCloseBtn?.addEventListener('click', () => {
        document.getElementById('surprise-popup-card')?.classList.remove('active');
        AudioManager.playPop();
      });

      this.render();
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    },

    resetOrbs() {
      const w = this.canvas.width;
      const h = this.canvas.height;
      this.orb1Pos = { x: w * 0.25, y: h * 0.5 };
      this.orb2Pos = { x: w * 0.75, y: h * 0.5 };
      this.updateOrbDOM();
    },

    updateOrbDOM() {
      if (this.orb1) {
        this.orb1.style.left = `${this.orb1Pos.x}px`;
        this.orb1.style.top = `${this.orb1Pos.y}px`;
      }
      if (this.orb2) {
        this.orb2.style.left = `${this.orb2Pos.x}px`;
        this.orb2.style.top = `${this.orb2Pos.y}px`;
      }
    },

    setupDraggable(orb, id) {
      const startDrag = (e) => {
        if (this.merged) return;
        this.isDragging = id;
        AudioManager.initContext();
        e.preventDefault();
      };

      const moveDrag = (e) => {
        if (!this.isDragging) return;
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const x = Math.max(40, Math.min(this.canvas.width - 40, clientX - rect.left));
        const y = Math.max(40, Math.min(this.canvas.height - 40, clientY - rect.top));

        if (this.isDragging === 1) this.orb1Pos = { x, y };
        if (this.isDragging === 2) this.orb2Pos = { x, y };

        this.updateOrbDOM();
        this.checkMerge();
      };

      const stopDrag = () => {
        this.isDragging = null;
      };

      orb.addEventListener('mousedown', startDrag);
      orb.addEventListener('touchstart', startDrag, { passive: false });

      window.addEventListener('mousemove', moveDrag);
      window.addEventListener('touchmove', moveDrag, { passive: false });

      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('touchend', stopDrag);
    },

    checkMerge() {
      if (this.merged) return;
      const dx = this.orb1Pos.x - this.orb2Pos.x;
      const dy = this.orb1Pos.y - this.orb2Pos.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 65) {
        this.triggerMerge();
      }
    },

    triggerMerge() {
      this.merged = true;
      const midX = (this.orb1Pos.x + this.orb2Pos.x) / 2;
      const midY = (this.orb1Pos.y + this.orb2Pos.y) / 2;

      this.orb1Pos = { x: midX, y: midY };
      this.orb2Pos = { x: midX, y: midY };
      this.updateOrbDOM();

      // Trigger Supernova Particles
      this.createSupernova(midX, midY);

      document.getElementById('souls-merged-banner')?.classList.add('active');
      AudioManager.playChime();

      // Start Falling Cosmic Surprises Game
      setTimeout(() => this.startSurprisesGame(), 600);
    },

    createSupernova(cx, cy) {
      const colors = ['#E040FB', '#EF5350', '#FFD54F', '#FFF9F5', '#EFC3CC'];
      for (let i = 0; i < 70; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.supernovaParticles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015
        });
      }
    },

    startSurprisesGame() {
      const wrapper = document.querySelector('.souls-canvas-wrapper');
      const scoreBadge = document.getElementById('souls-score-badge');
      if (!wrapper || !scoreBadge) return;

      this.caughtCount = 0;
      this.targetSurprises = content.souls?.targetSurprises || 6;
      scoreBadge.style.display = 'block';
      scoreBadge.textContent = `Surprises Caught: 0 / ${this.targetSurprises}`;

      clearInterval(this.surpriseInterval);
      const surprisesList = content.souls?.surprises || [];

      this.surpriseInterval = setInterval(() => {
        if (!this.merged || this.caughtCount >= this.targetSurprises) return;

        const surprise = surprisesList[Math.floor(Math.random() * surprisesList.length)];
        const item = document.createElement('div');
        item.className = 'falling-surprise-item';
        item.textContent = surprise.icon || '🌸';
        item.style.left = `${Math.random() * 80 + 10}%`;
        item.style.top = '-20px';
        item.style.setProperty('--speed', `${Math.random() * 1.5 + 3.5}s`);

        item.addEventListener('click', () => {
          this.caughtCount++;
          scoreBadge.textContent = `Surprises Caught: ${this.caughtCount} / ${this.targetSurprises}`;
          AudioManager.playChime();
          this.showSurprisePopup(surprise);
          item.remove();

          if (this.caughtCount >= this.targetSurprises) {
            clearInterval(this.surpriseInterval);
            const titleEl = document.querySelector('.souls-merged-title');
            const textEl = document.querySelector('.souls-merged-text');
            if (titleEl) titleEl.textContent = content.souls?.completionTitle || 'Galaxy Surprises Collected! 💐✨';
            if (textEl) textEl.textContent = content.souls?.completionMessage || 'You caught all of Husnain\'s surprises! 💜🌹';
          }
        });

        wrapper.appendChild(item);
        setTimeout(() => item.remove(), 4200);
      }, 900);
    },

    showSurprisePopup(surprise) {
      const card = document.getElementById('surprise-popup-card');
      const icon = document.getElementById('surprise-popup-icon');
      const title = document.getElementById('surprise-popup-title');
      const text = document.getElementById('surprise-popup-text');
      const img = document.getElementById('surprise-popup-img');

      if (icon) icon.textContent = surprise.icon || '🌸';
      if (title) title.textContent = surprise.title || 'Special Surprise';
      if (text) text.textContent = surprise.text || '';

      if (img) {
        if (surprise.img) {
          img.src = surprise.img;
          img.style.display = 'block';
        } else {
          img.style.display = 'none';
        }
      }

      card?.classList.add('active');
    },

    render() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Render cosmic background stars
      this.stars.forEach(s => {
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        this.ctx.fill();
      });

      // Render magnetic stardust connection
      if (!this.merged && this.orb1Pos && this.orb2Pos) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.orb1Pos.x, this.orb1Pos.y);
        this.ctx.lineTo(this.orb2Pos.x, this.orb2Pos.y);
        const grad = this.ctx.createLinearGradient(this.orb1Pos.x, this.orb1Pos.y, this.orb2Pos.x, this.orb2Pos.y);
        grad.addColorStop(0, 'rgba(224, 64, 251, 0.5)');
        grad.addColorStop(1, 'rgba(239, 83, 80, 0.5)');
        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = 2.5;
        this.ctx.setLineDash([5, 6]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

      // Render Supernova Particles
      for (let i = this.supernovaParticles.length - 1; i >= 0; i--) {
        const p = this.supernovaParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          this.supernovaParticles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.shadowColor = p.color;
        this.ctx.shadowBlur = 10;
        this.ctx.fill();
        this.ctx.restore();
      }

      requestAnimationFrame(() => this.render());
    }
  };

  /* ─── 9. VIDEO MEMORIES ─────────────────────────────────────────────────── */
  const VideoMemories = {
    init() {
      const grid = document.getElementById('videos-grid');
      const modal = document.getElementById('video-modal');
      const closeBtn = document.getElementById('video-modal-close');
      const videoEl = document.getElementById('modal-video-player');

      if (!grid) return;
      const videos = content.videos || [];
      grid.innerHTML = '';

      videos.forEach(v => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
          <div class="video-poster-wrapper" role="button" tabindex="0" aria-label="Play video: ${v.title}">
            <img src="${v.poster}" alt="${v.title}" class="video-poster-img" loading="lazy">
            <div class="video-play-overlay">
              <div class="play-circle">▶</div>
            </div>
          </div>
          <div class="video-details">
            <h3 class="video-card-title">${v.title}</h3>
            <p class="video-card-caption">${v.caption}</p>
          </div>
        `;

        const play = () => {
          if (videoEl) {
            videoEl.src = v.video;
            videoEl.play().catch(() => {});
          }
          modal?.classList.add('active');
          document.body.style.overflow = 'hidden';
        };

        card.querySelector('.video-poster-wrapper')?.addEventListener('click', play);
        grid.appendChild(card);
      });

      const closeModal = () => {
        if (videoEl) {
          videoEl.pause();
          videoEl.src = '';
        }
        modal?.classList.remove('active');
        document.body.style.overflow = '';
      };

      closeBtn?.addEventListener('click', closeModal);
      modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }
  };

  /* ─── 10. THE BOUQUET SECTION ───────────────────────────────────────────── */
  const BouquetSection = {
    init() {
      const pinsContainer = document.getElementById('bouquet-flower-pins');
      const messageBox = document.getElementById('bouquet-message-text');
      const mainImg = document.querySelector('.bouquet-main-img');
      if (!pinsContainer || !messageBox) return;

      if (mainImg && content.bouquet?.mainImage) {
        mainImg.src = content.bouquet.mainImage;
      }

      const messages = content.bouquet?.flowerMessages || [];
      pinsContainer.innerHTML = '';

      messages.forEach((item, i) => {
        const btn = document.createElement('button');
        btn.className = `flower-pin-btn ${i === 0 ? 'active' : ''}`;
        btn.innerHTML = `
          <span class="flower-pin-icon">🌸</span>
          <span class="flower-pin-name">${item.flower}</span>
        `;

        btn.addEventListener('click', () => {
          document.querySelectorAll('.flower-pin-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          messageBox.style.opacity = '0';
          setTimeout(() => {
            messageBox.textContent = item.message;
            messageBox.style.opacity = '1';
          }, 200);
          AudioManager.initContext();
          AudioManager.playPop();
        });

        pinsContainer.appendChild(btn);
      });

      if (messages.length > 0) {
        messageBox.textContent = messages[0].message;
      }
    }
  };

  /* ─── 11. BIRTHDAY CAKE & CELEBRATION ───────────────────────────────────── */
  const BirthdayCelebration = {
    candlesLit: 3,

    init() {
      const candles = document.querySelectorAll('.candle-interactive');
      const banner = document.getElementById('cake-blowout-banner');
      const songBtn = document.getElementById('play-birthday-song-btn');

      candles.forEach(candle => {
        candle.addEventListener('click', () => {
          if (!candle.classList.contains('blown')) {
            candle.classList.add('blown');
            this.candlesLit--;
            AudioManager.initContext();
            AudioManager.playPop();

            if (this.candlesLit <= 0) {
              banner?.classList.add('active');
              AudioManager.playChime();
              this.launchConfetti();
            }
          }
        });
      });

      songBtn?.addEventListener('click', () => {
        AudioManager.playSpecialAudio(content.audio?.birthdaySong || 'assets/audio/birthday-song.mp3');
      });
    },

    launchConfetti() {
      const container = document.querySelector('.cake-stage');
      if (!container) return;

      const emojis = ['🌸', '✨', '💐', '💜', '🎂', '🌹'];
      for (let i = 0; i < 28; i++) {
        const conf = document.createElement('span');
        conf.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        conf.style.position = 'absolute';
        conf.style.left = `${Math.random() * 90 + 5}%`;
        conf.style.top = `${Math.random() * 60}%`;
        conf.style.fontSize = `${Math.random() * 14 + 18}px`;
        conf.style.pointerEvents = 'none';
        conf.style.animation = `confettiFall ${Math.random() * 1.5 + 1.5}s ease-out forwards`;
        conf.style.setProperty('--rot', `${Math.random() * 720}deg`);
        container.appendChild(conf);

        setTimeout(() => conf.remove(), 3000);
      }
    }
  };

  /* ─── 12. ADVANCED MINI GAMES: DYNAMIC BOUQUET WEAVER & SEED-TO-ROSE ────── */
  const MiniGames = {
    init() {
      this.initFlowerGame();
      this.initGiftFinderGame();
      this.initTrustNoGame();
    },

    /* 1. Dynamic Animated Bouquet Weaver */
    initFlowerGame() {
      const area = document.getElementById('flower-game-canvas');
      const startBtn = document.getElementById('start-flower-game-btn');
      const scoreEl = document.getElementById('flower-game-score');
      const resultBox = document.getElementById('flower-game-result');
      const vaseStack = document.getElementById('dynamic-bouquet-flowers-stack');

      let score = 0;
      const target = content.games?.flowerGame?.target || 10;
      let interval = null;

      startBtn?.addEventListener('click', () => {
        score = 0;
        if (scoreEl) scoreEl.textContent = `0 / ${target}`;
        resultBox?.classList.remove('active');
        if (vaseStack) vaseStack.innerHTML = '';
        startBtn.textContent = 'Restart Game 🌸';
        clearInterval(interval);
        area?.querySelectorAll('.falling-flower-item').forEach(e => e.remove());

        const flowerPool = ['🌸', '🌺', '🌷', '🌹', '💐', '💜', '🌼', '🌻', '🥀', '🌿'];

        interval = setInterval(() => {
          if (score >= target) return;
          const flowerEmoji = flowerPool[score % flowerPool.length];
          const el = document.createElement('div');
          el.className = 'falling-flower-item';
          el.textContent = flowerEmoji;
          el.style.left = `${Math.random() * 80 + 10}%`;
          el.style.setProperty('--speed', `${Math.random() * 1.5 + 3.2}s`);
          el.style.setProperty('--sway', `${(Math.random() - 0.5) * 50}px`);

          el.addEventListener('click', () => {
            score++;
            AudioManager.initContext();
            AudioManager.playPop();
            if (scoreEl) scoreEl.textContent = `${score} / ${target}`;

            // Add flower dynamically to the bouquet vase with bounce
            if (vaseStack) {
              const collected = document.createElement('span');
              collected.className = 'basket-collected-flower';
              collected.textContent = flowerEmoji;
              collected.style.transform = `rotate(${(Math.random() - 0.5) * 30}deg)`;
              vaseStack.appendChild(collected);
            }

            el.remove();

            if (score >= target) {
              clearInterval(interval);
              if (resultBox) {
                resultBox.innerHTML = `
                  <strong>💐 Gorgeous Bouquet Assembled! ✨</strong><br>
                  Rabi &amp; Husnain's handcrafted 10-flower bouquet is complete! May your year bloom with endless joy and love. 🌸💜
                `;
                resultBox.classList.add('active');
              }
              AudioManager.playChime();
            }
          });

          area?.appendChild(el);
          setTimeout(() => el.remove(), 4800);
        }, 750);
      });
    },

    /* 2. Seed-to-Blooming Magic Rose */
    initGiftFinderGame() {
      const boxes = document.querySelectorAll('.gift-box-item');
      const resultBox = document.getElementById('gift-finder-result');
      const roseStage = document.getElementById('rose-blooming-stage');
      const roseQuote = document.getElementById('blooming-rose-quote');
      const winningIndex = Math.floor(Math.random() * boxes.length);

      boxes.forEach((box, idx) => {
        box.addEventListener('click', () => {
          AudioManager.initContext();

          const icon = box.querySelector('.gift-box-icon');
          if (idx === winningIndex) {
            AudioManager.playChime();
            if (icon) icon.textContent = '🎉';
            box.style.borderColor = 'var(--burgundy)';
            box.style.background = 'var(--grad-blush)';

            // Trigger Seed-to-Blooming Rose Animation
            if (roseStage) {
              roseStage.classList.add('active');
              setTimeout(() => {
                if (roseQuote) roseQuote.classList.add('revealed');
              }, 2200);
            }

            if (resultBox) {
              resultBox.textContent = content.games?.giftGame?.giftMessage || 'Of course you found it! Good things have a way of finding you. ♡';
              resultBox.classList.add('active');
            }
          } else {
            AudioManager.playPop();
            if (icon) icon.textContent = '✨';
            box.style.opacity = '0.75';
            if (resultBox && !resultBox.classList.contains('active')) {
              resultBox.textContent = content.games?.giftGame?.wrongMessage || 'Almost… try another one ♡';
              resultBox.classList.add('active');
              setTimeout(() => {
                if (resultBox.textContent.includes('Almost')) {
                  resultBox.classList.remove('active');
                }
              }, 2000);
            }
          }
        });
      });
    },

    /* 3. Trust Issues No Button */
    initTrustNoGame() {
      const noBtn = document.getElementById('trust-no-btn');
      const yesBtn = document.getElementById('trust-yes-btn');
      const resultBox = document.getElementById('trust-game-result');
      const dodges = content.games?.trustNoButton?.dodges || [
        "Nope, not allowed! 😂",
        "The 'No' button has trust issues! 🙈",
        "Try clicking Yes instead! 💖"
      ];
      let dodgeCount = 0;

      const dodge = (e) => {
        e.preventDefault();
        dodgeCount++;
        const randX = (Math.random() - 0.5) * 220;
        const randY = (Math.random() - 0.5) * 120;
        noBtn.style.transform = `translate(${randX}px, ${randY}px)`;
        noBtn.textContent = dodges[dodgeCount % dodges.length];
        AudioManager.initContext();
        AudioManager.playPop();
      };

      noBtn?.addEventListener('mouseenter', dodge);
      noBtn?.addEventListener('touchstart', dodge, { passive: false });

      yesBtn?.addEventListener('click', () => {
        AudioManager.initContext();
        AudioManager.playChime();
        if (resultBox) {
          resultBox.textContent = content.games?.trustNoButton?.yesResponse || 'Yay! Promise sealed forever! 🎉💜';
          resultBox.classList.add('active');
        }
      });
    }
  };

  /* ─── 13. INTERACTIVE LOVE LETTERS & ENVELOPES ──────────────────────────── */
  const InteractiveLetters = {
    currentIdx: 0,
    envelopes: [],

    init() {
      this.envelopes = content.letter?.envelopes || [];
      const prevBtn = document.getElementById('envelope-prev-btn');
      const nextBtn = document.getElementById('envelope-next-btn');
      const slideBtn = document.getElementById('envelope-slide-btn');
      const closePaperBtn = document.getElementById('letter-paper-close-btn');

      this.renderEnvelope();

      prevBtn?.addEventListener('click', () => {
        this.currentIdx = (this.currentIdx - 1 + this.envelopes.length) % this.envelopes.length;
        this.renderEnvelope();
        AudioManager.initContext();
        AudioManager.playPop();
      });

      nextBtn?.addEventListener('click', () => {
        this.currentIdx = (this.currentIdx + 1) % this.envelopes.length;
        this.renderEnvelope();
        AudioManager.initContext();
        AudioManager.playPop();
      });

      slideBtn?.addEventListener('click', () => {
        const paper = document.getElementById('letter-paper-card');
        paper?.classList.add('open');
        slideBtn.style.display = 'none';
        AudioManager.initContext();
        AudioManager.playChime();
      });

      closePaperBtn?.addEventListener('click', () => {
        const paper = document.getElementById('letter-paper-card');
        paper?.classList.remove('open');
        if (slideBtn) slideBtn.style.display = 'inline-flex';
        AudioManager.initContext();
        AudioManager.playPop();
      });
    },

    renderEnvelope() {
      const data = this.envelopes[this.currentIdx];
      if (!data) return;

      const badge = document.getElementById('envelope-count-badge');
      const envTitle = document.getElementById('envelope-preview-title');
      const dateEl = document.getElementById('letter-date');
      const salutationEl = document.getElementById('letter-salutation');
      const bodyEl = document.getElementById('letter-paragraphs');
      const closingEl = document.getElementById('letter-closing');
      const sigEl = document.getElementById('letter-signature');
      const paper = document.getElementById('letter-paper-card');
      const slideBtn = document.getElementById('envelope-slide-btn');

      if (badge) badge.textContent = `Envelope ${this.currentIdx + 1} of ${this.envelopes.length}`;
      if (envTitle) envTitle.textContent = `Letter: ${data.title} 💌`;

      if (dateEl) dateEl.textContent = data.date;
      if (salutationEl) salutationEl.textContent = data.salutation;
      if (closingEl) closingEl.textContent = data.closing;
      if (sigEl) sigEl.textContent = data.signature;

      if (bodyEl && data.paragraphs) {
        bodyEl.innerHTML = '';
        data.paragraphs.forEach(p => {
          const pEl = document.createElement('p');
          pEl.className = 'letter-paragraph';
          pEl.textContent = p;
          bodyEl.appendChild(pEl);
        });
      }

      paper?.classList.remove('open');
      if (slideBtn) slideBtn.style.display = 'inline-flex';
    }
  };

  /* ─── 14. MAKE A WISH INTERACTION ───────────────────────────────────────── */
  const MakeAWish = {
    init() {
      const trigger = document.getElementById('wish-trigger');
      const card = document.getElementById('wish-revealed-card');
      const text = document.getElementById('wish-revealed-text');

      if (text && content.wish?.message) {
        text.textContent = content.wish.message;
      }

      trigger?.addEventListener('click', () => {
        AudioManager.initContext();
        AudioManager.playChime();
        trigger.style.transform = 'scale(1.2) rotate(15deg)';
        setTimeout(() => {
          trigger.style.transform = 'scale(1)';
          card?.classList.add('active');
        }, 300);
      });
    }
  };

  /* ─── 15. POPULATE DYNAMIC CONTENT ──────────────────────────────────────── */
  const ContentPopulator = {
    populate() {
      // Hero
      const heroTitle = document.getElementById('hero-title');
      const heroSub = document.getElementById('hero-subtitle');
      const heroImg = document.querySelector('.hero-img');
      if (heroTitle && content.hero?.title) {
        heroTitle.innerHTML = `${content.hero.title.replace('♡', '')} <span>${content.person?.name || 'Rabi'} ♡</span>`;
      }
      if (heroSub && content.hero?.subtitle) {
        heroSub.textContent = content.hero.subtitle;
      }
      if (heroImg && content.hero?.image) {
        heroImg.src = content.hero.image;
      }

      // About
      const aboutDesc = document.getElementById('about-description');
      const aboutQuote = document.getElementById('about-quote');
      const traitsGrid = document.getElementById('about-traits-grid');
      const aboutPhoto1 = document.querySelector('.about-photo-card.card-1 img');
      const aboutPhoto2 = document.querySelector('.about-photo-card.card-2 img');

      if (aboutDesc && content.about?.description) aboutDesc.textContent = content.about.description;
      if (aboutQuote && content.about?.quote) aboutQuote.textContent = content.about.quote;
      if (aboutPhoto1 && content.about?.photo1) aboutPhoto1.src = content.about.photo1;
      if (aboutPhoto2 && content.about?.photo2) aboutPhoto2.src = content.about.photo2;

      if (traitsGrid && content.about?.traits) {
        traitsGrid.innerHTML = '';
        content.about.traits.forEach(t => {
          const tc = document.createElement('div');
          tc.className = 'trait-card';
          tc.innerHTML = `
            <div class="trait-label">${t.label}</div>
            <div class="trait-value">${t.value}</div>
          `;
          traitsGrid.appendChild(tc);
        });
      }

      // Final Surprise
      const surpriseQuote = document.getElementById('final-quote-text');
      const finalPhoto = document.querySelector('.final-photo-frame img');
      const replayBtn = document.getElementById('replay-btn');

      if (finalPhoto && content.surprise?.finalPhoto) {
        finalPhoto.src = content.surprise.finalPhoto;
      }
      if (surpriseQuote && content.surprise?.finalLine) {
        surpriseQuote.textContent = `“${content.surprise.finalLine}”`;
      }
      if (replayBtn && content.surprise?.replayBtn) {
        replayBtn.textContent = content.surprise.replayBtn;
      }
      replayBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        AudioManager.initContext();
        AudioManager.playChime();
      });
    }
  };

  /* ─── INITIALIZE ALL MODULES ────────────────────────────────────────────── */
  ContentPopulator.populate();
  TouchHeartSparks.init();
  Navigation.init();
  HeroPetals.init();
  GiftModal.init();
  ReasonsSection.init();
  MemoryGallery.init();
  TwoSoulsGame.init();
  VideoMemories.init();
  BouquetSection.init();
  BirthdayCelebration.init();
  MiniGames.init();
  InteractiveLetters.init();
  MakeAWish.init();
  AudioManager.init();
});
