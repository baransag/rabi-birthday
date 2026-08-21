/* ═══════════════════════════════════════════════════════════════════════════
   RABI — THE BEAUTIFUL BIRTHDAY GIFT
   js/app.js — Core Interactive Application Logic
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const content = window.CONTENT || {};

  /* ─── 1. AUDIO MANAGER ─────────────────────────────────────────────────── */
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

    playSpecialAudio(src, onComplete) {
      this.initContext();
      if (this.bgMusic) {
        this.bgMusic.volume = 0.05;
      }

      if (this.specialAudio) {
        this.specialAudio.pause();
      }

      this.specialAudio = new Audio(src);
      this.specialAudio.play().then(() => {
        this.specialAudio.onended = () => {
          if (this.bgMusic && this.isEnabled) {
            this.bgMusic.volume = this.currentVolume;
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
      const symbols = ['💖', '🌸', '✨', '💜', '🌹', '💐', '⭐'];
      const spawn = (e) => {
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

  /* ─── 3. NAVIGATION & JOURNEY PROGRESS ──────────────────────────────────── */
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
        { id: "star-map", label: "Star Map", num: "05" },
        { id: "moments", label: "The Bouquet", num: "06" },
        { id: "vip-coupons", label: "VIP Coupons", num: "07" },
        { id: "open-when", label: "Mood Notes", num: "08" },
        { id: "bottle-capsule", label: "Bottle Capsule", num: "09" },
        { id: "birthday", label: "Birthday", num: "10" },
        { id: "letter", label: "Love Letters", num: "11" },
        { id: "surprise", label: "Surprise", num: "12" }
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
            if (numEl) numEl.textContent = `${step.num} / ${journeySteps.length}`;
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

      for (let i = 0; i < 22; i++) {
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
      const colors = ['rgba(207, 152, 146, 0.75)', 'rgba(105, 104, 166, 0.65)', 'rgba(246, 214, 216, 0.75)', 'rgba(221, 212, 243, 0.65)'];
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

  /* ─── NEW FEATURE 1: 🌌 RABI'S BIRTHDAY STAR MAP ────────────────────────── */
  const StarMap = {
    canvas: null,
    ctx: null,
    stars: [],

    init() {
      this.canvas = document.getElementById('star-map-canvas');
      const interactiveStar = document.getElementById('rabi-birthday-star');
      const modal = document.getElementById('star-certificate-modal');
      const closeBtn = document.getElementById('star-certificate-close');

      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });

      for (let i = 0; i < 90; i++) {
        this.stars.push({
          x: Math.random() * (this.canvas.width || 700),
          y: Math.random() * (this.canvas.height || 380),
          size: Math.random() * 2 + 0.6,
          alpha: Math.random() * 0.8 + 0.2,
          speed: (Math.random() - 0.5) * 0.015
        });
      }

      interactiveStar?.addEventListener('click', () => {
        modal?.classList.add('active');
        AudioManager.initContext();
        AudioManager.playChime();
      });

      closeBtn?.addEventListener('click', () => {
        modal?.classList.remove('active');
        AudioManager.playPop();
      });

      this.render();
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
    },

    render() {
      if (!this.ctx || !this.canvas) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 0.95 || s.alpha < 0.2) s.speed = -s.speed;

        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        this.ctx.fill();
      });

      // Draw subtle constellation line to Rabi's Star
      const cx = this.canvas.width * 0.54;
      const cy = this.canvas.height * 0.42;

      this.ctx.beginPath();
      this.ctx.moveTo(cx - 100, cy - 60);
      this.ctx.lineTo(cx, cy);
      this.ctx.lineTo(cx + 90, cy - 40);
      this.ctx.lineTo(cx + 120, cy + 70);
      this.ctx.strokeStyle = 'rgba(207, 152, 146, 0.45)';
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([4, 4]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      requestAnimationFrame(() => this.render());
    }
  };

  /* ─── NEW FEATURE 2: 🎟️ VIP COUPONS ─────────────────────────────────────── */
  const VIPCoupons = {
    init() {
      const grid = document.getElementById('vip-coupons-grid');
      if (!grid || !content.vipCoupons?.coupons) return;

      grid.innerHTML = '';
      content.vipCoupons.coupons.forEach(c => {
        const card = document.createElement('div');
        card.className = 'vip-coupon-card';
        card.innerHTML = `
          <div class="vip-coupon-icon">${c.icon}</div>
          <h4 class="vip-coupon-title">${c.title}</h4>
          <p class="vip-coupon-desc">${c.desc}</p>
          <button class="coupon-redeem-btn">${c.badge || 'REDEEM COUPON 🎟️'}</button>
          <div class="coupon-claimed-stamp">CLAIMED BY RABIYA ♡</div>
        `;

        const btn = card.querySelector('.coupon-redeem-btn');
        btn.addEventListener('click', () => {
          card.classList.add('claimed');
          AudioManager.initContext();
          AudioManager.playChime();
        });

        grid.appendChild(card);
      });
    }
  };

  /* ─── NEW FEATURE 3: 💌 OPEN WHEN MOOD NOTES ────────────────────────────── */
  const OpenWhenNotes = {
    init() {
      const grid = document.getElementById('open-when-grid');
      const modal = document.getElementById('mood-note-modal');
      const titleEl = document.getElementById('mood-note-title');
      const textEl = document.getElementById('mood-note-text');
      const closeBtn = document.getElementById('mood-note-close');

      if (!grid || !content.openWhen?.notes) return;

      grid.innerHTML = '';
      content.openWhen.notes.forEach(n => {
        const card = document.createElement('div');
        card.className = 'mood-envelope-card';
        card.innerHTML = `
          <div class="mood-envelope-icon">${n.icon}</div>
          <h4 class="mood-envelope-title">${n.mood}</h4>
        `;

        card.addEventListener('click', () => {
          if (titleEl) titleEl.textContent = n.title;
          if (textEl) textEl.textContent = n.text;
          modal?.classList.add('active');
          AudioManager.initContext();
          AudioManager.playChime();
        });

        grid.appendChild(card);
      });

      closeBtn?.addEventListener('click', () => {
        modal?.classList.remove('active');
        AudioManager.playPop();
      });
    }
  };

  /* ─── NEW FEATURE 4: 🍾 MESSAGE IN A BOTTLE CAPSULE ─────────────────────── */
  const MessageInBottle = {
    init() {
      const bottle = document.getElementById('floating-glass-bottle');
      const scrollCard = document.getElementById('bottle-scroll-unrolled');
      const scrollText = document.getElementById('bottle-scroll-text');

      if (scrollText && content.messageInBottle?.scrollText) {
        scrollText.textContent = content.messageInBottle.scrollText;
      }

      bottle?.addEventListener('click', () => {
        scrollCard?.classList.toggle('open');
        AudioManager.initContext();
        AudioManager.playChime();
      });
    }
  };

  /* ─── 5. MEMORY GALLERY & LIGHTBOX ──────────────────────────────────────── */
  const Gallery = {
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
        item.innerHTML = `
          <div class="gallery-img-wrapper">
            <img src="${m.image}" alt="${m.title}" class="gallery-img" loading="lazy">
          </div>
          <h4 class="gallery-title">${m.title}</h4>
          <div class="gallery-date">${m.date || '06 September'} • ${m.caption}</div>
        `;

        const img = item.querySelector('.gallery-img');
        img.onerror = () => {
          if (m.localImage) img.src = m.localImage;
        };

        item.addEventListener('click', () => {
          this.openLightbox(idx);
          AudioManager.initContext();
          AudioManager.playPop();
        });

        grid.appendChild(item);
      });

      this.initLightbox();
      this.initMemoryBloom();
      this.initVideos();
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
    },

    openLightbox(idx) {
      this.currentIndex = idx;
      this.renderLightbox();
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
      this.renderLightbox();
    },

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.items.length;
      this.renderLightbox();
    },

    renderLightbox() {
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
    },

    initVideos() {
      const vGrid = document.getElementById('videos-grid');
      const vModal = document.getElementById('video-modal');
      const vPlayer = document.getElementById('modal-video-player');
      const vClose = document.getElementById('video-modal-close');

      if (!vGrid || !content.videos) return;
      vGrid.innerHTML = '';

      content.videos.forEach(v => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
          <div class="video-poster-wrapper">
            <img src="${v.poster}" alt="${v.title}" class="video-poster-img" loading="lazy">
            <div class="video-play-badge">▶</div>
          </div>
          <div class="video-info-box">
            <h4 class="video-title">${v.title}</h4>
            <div class="video-caption">${v.caption}</div>
          </div>
        `;

        card.addEventListener('click', () => {
          if (vPlayer && vModal) {
            vPlayer.src = v.video;
            vModal.classList.add('active');
            vPlayer.play().catch(() => {});
            AudioManager.initContext();
          }
        });

        vGrid.appendChild(card);
      });

      const closeVideo = () => {
        if (vPlayer && vModal) {
          vPlayer.pause();
          vPlayer.src = '';
          vModal.classList.remove('active');
        }
      };

      vClose?.addEventListener('click', closeVideo);
      vModal?.addEventListener('click', (e) => {
        if (e.target === vModal) closeVideo();
      });
    }
  };

  /* ─── 6. TWO SOULS GALAXY SUPERNOVA & SURPRISE CATCHER ──────────────────── */
  const TwoSoulsGame = {
    canvas: null,
    ctx: null,
    orb1: null,
    orb2: null,
    isDragging: null,
    merged: false,
    stars: [],
    supernovaParticles: [],
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
        const scoreBadge = document.getElementById('souls-score-badge');
        if (scoreBadge) scoreBadge.style.display = 'none';
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
      const w = this.canvas.width || 600;
      const h = this.canvas.height || 380;
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

      this.createSupernova(midX, midY);

      document.getElementById('souls-merged-banner')?.classList.add('active');
      AudioManager.playChime();

      setTimeout(() => this.startSurprisesGame(), 600);
    },

    createSupernova(cx, cy) {
      const colors = ['#CF9892', '#6968A6', '#E040FB', '#FFD54F', '#FFF9F5'];
      for (let i = 0; i < 80; i++) {
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

      this.stars.forEach(s => {
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        this.ctx.fill();
      });

      if (!this.merged && this.orb1Pos && this.orb2Pos) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.orb1Pos.x, this.orb1Pos.y);
        this.ctx.lineTo(this.orb2Pos.x, this.orb2Pos.y);
        const grad = this.ctx.createLinearGradient(this.orb1Pos.x, this.orb1Pos.y, this.orb2Pos.x, this.orb2Pos.y);
        grad.addColorStop(0, 'rgba(207, 152, 146, 0.7)');
        grad.addColorStop(1, 'rgba(105, 104, 166, 0.7)');
        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = 2.5;
        this.ctx.setLineDash([5, 6]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }

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

  /* ─── 7. ETERNAL ROSE IN CRYSTAL CLOCHE ─────────────────────────────────── */
  const EternalRoseCloche = {
    init() {
      const dome = document.getElementById('cloche-glass-dome');
      const messageBox = document.getElementById('eternal-rose-message-box');

      dome?.addEventListener('click', () => {
        dome.classList.add('petal-fallen');
        AudioManager.initContext();
        AudioManager.playChime();

        setTimeout(() => {
          messageBox?.classList.add('active');
        }, 1200);
      });
    }
  };

  /* ─── 8. MINI GAMES ────────────────────────────────────────────────────── */
  const MiniGames = {
    init() {
      this.initFlowerGame();
      this.initGiftFinderGame();
      this.initTrustNoGame();
    },

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

        const flowerPool = ['🌹', '🌸', '🌷', '🌹', '💐', '💜', '🌺', '🌹', '🥀', '🌿'];

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

  /* ─── 9. INTERACTIVE LOVE LETTERS & ENVELOPES CAROUSEL ──────────────────── */
  const LetterCarousel = {
    currentEnvelopeIndex: 0,
    envelopes: [],

    init() {
      this.envelopes = content.letter?.envelopes || [];
      const prevBtn = document.getElementById('envelope-prev-btn');
      const nextBtn = document.getElementById('envelope-next-btn');
      const slideBtn = document.getElementById('envelope-slide-btn');
      const paperCloseBtn = document.getElementById('letter-paper-close-btn');

      this.renderEnvelope();

      prevBtn?.addEventListener('click', () => {
        this.currentEnvelopeIndex = (this.currentEnvelopeIndex - 1 + this.envelopes.length) % this.envelopes.length;
        this.renderEnvelope();
        AudioManager.initContext();
        AudioManager.playPop();
      });

      nextBtn?.addEventListener('click', () => {
        this.currentEnvelopeIndex = (this.currentEnvelopeIndex + 1) % this.envelopes.length;
        this.renderEnvelope();
        AudioManager.initContext();
        AudioManager.playPop();
      });

      slideBtn?.addEventListener('click', () => {
        const paper = document.getElementById('letter-paper-card');
        paper?.classList.add('open');
        AudioManager.initContext();
        AudioManager.playChime();
      });

      paperCloseBtn?.addEventListener('click', () => {
        const paper = document.getElementById('letter-paper-card');
        paper?.classList.remove('open');
        AudioManager.initContext();
        AudioManager.playPop();
      });
    },

    renderEnvelope() {
      const current = this.envelopes[this.currentEnvelopeIndex];
      if (!current) return;

      const badge = document.getElementById('envelope-count-badge');
      const previewTitle = document.getElementById('envelope-preview-title');
      const dateEl = document.getElementById('letter-date');
      const salutationEl = document.getElementById('letter-salutation');
      const paragraphsEl = document.getElementById('letter-paragraphs');
      const closingEl = document.getElementById('letter-closing');
      const signatureEl = document.getElementById('letter-signature');

      if (badge) badge.textContent = `Envelope ${this.currentEnvelopeIndex + 1} of ${this.envelopes.length}`;
      if (previewTitle) previewTitle.textContent = `Letter: ${current.title} 💌`;
      if (dateEl) dateEl.textContent = current.date || '06 September';
      if (salutationEl) salutationEl.textContent = current.salutation || 'Dear Rabi,';
      if (closingEl) closingEl.textContent = current.closing || 'With love,';
      if (signatureEl) signatureEl.textContent = current.signature || 'Husnain ♡';

      if (paragraphsEl) {
        paragraphsEl.innerHTML = '';
        current.paragraphs.forEach(p => {
          const pEl = document.createElement('p');
          pEl.textContent = p;
          paragraphsEl.appendChild(pEl);
        });
      }

      document.getElementById('letter-paper-card')?.classList.remove('open');
    }
  };

  /* ─── 10. POPULATE CONTENT ──────────────────────────────────────────────── */
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
      const reasonsGrid = document.getElementById('reasons-grid');
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

      if (reasonsGrid && content.reasons) {
        reasonsGrid.innerHTML = '';
        content.reasons.forEach(r => {
          const rc = document.createElement('div');
          rc.className = 'reason-card';
          rc.innerHTML = `
            <div class="reason-tag">${r.tag}</div>
            <h4 class="reason-title">${r.title}</h4>
            <p class="reason-text">${r.text}</p>
          `;
          rc.addEventListener('click', () => {
            AudioManager.initContext();
            AudioManager.playPop();
          });
          reasonsGrid.appendChild(rc);
        });
      }

      // Bouquet
      const mainImg = document.querySelector('.bouquet-main-img');
      const pinsContainer = document.getElementById('bouquet-flower-pins');
      const messageBox = document.getElementById('bouquet-message-text');

      if (mainImg && content.bouquet?.mainImage) mainImg.src = content.bouquet.mainImage;
      if (pinsContainer && messageBox) {
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
        if (messages.length > 0) messageBox.textContent = messages[0].message;
      }

      // Final Surprise
      const surpriseQuote = document.getElementById('final-quote-text');
      const finalPhoto = document.querySelector('.final-photo-frame img');
      const replayBtn = document.getElementById('replay-btn');

      if (finalPhoto && content.surprise?.finalPhoto) finalPhoto.src = content.surprise.finalPhoto;
      if (surpriseQuote && content.surprise?.finalLine) surpriseQuote.textContent = `“${content.surprise.finalLine}”`;
      replayBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        AudioManager.initContext();
        AudioManager.playChime();
      });

      // Candles
      let candlesLit = 3;
      document.querySelectorAll('.candle-interactive').forEach(candle => {
        candle.addEventListener('click', () => {
          if (!candle.classList.contains('blown')) {
            candle.classList.add('blown');
            candlesLit--;
            AudioManager.initContext();
            AudioManager.playPop();
            if (candlesLit <= 0) {
              document.getElementById('cake-blowout-banner')?.classList.add('active');
              AudioManager.playChime();
            }
          }
        });
      });

      document.getElementById('play-birthday-song-btn')?.addEventListener('click', () => {
        AudioManager.playSpecialAudio(content.audio?.birthdaySong || 'assets/audio/birthday-song.mp3');
      });

      // Wish star
      document.getElementById('wish-trigger')?.addEventListener('click', () => {
        AudioManager.initContext();
        AudioManager.playChime();
        document.getElementById('wish-revealed-card')?.classList.add('active');
      });

      // Gift Modal
      document.getElementById('open-gift-btn')?.addEventListener('click', () => {
        document.getElementById('gift-modal')?.classList.add('active');
        AudioManager.initContext();
        AudioManager.playChime();
      });
      document.getElementById('gift-modal-close')?.addEventListener('click', () => {
        document.getElementById('gift-modal')?.classList.remove('active');
      });
      document.getElementById('start-exploring-btn')?.addEventListener('click', () => {
        document.getElementById('gift-modal')?.classList.remove('active');
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  /* ─── INITIALIZE APPLICATION ────────────────────────────────────────────── */
  ContentPopulator.populate();
  TouchHeartSparks.init();
  Navigation.init();
  HeroPetals.init();
  StarMap.init();
  Gallery.init();
  TwoSoulsGame.init();
  EternalRoseCloche.init();
  VIPCoupons.init();
  OpenWhenNotes.init();
  MessageInBottle.init();
  MiniGames.init();
  LetterCarousel.init();
  AudioManager.init();
});
