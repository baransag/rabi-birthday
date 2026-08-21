/* ═══════════════════════════════════════════════════════════════════════════
   RABI — THE BEAUTIFUL BIRTHDAY GIFT
   js/app.js — Core Interactive Application Logic (Polished & Streamlined)
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
        if (navBtn) navBtn.innerHTML = '<span>❚❚</span> Pause Music';
        if (drawerBtn) drawerBtn.innerHTML = '<span>❚❚</span> Pause Music';
      } else {
        navBtn?.classList.remove('playing');
        drawerBtn?.classList.remove('playing');
        if (navBtn) navBtn.innerHTML = '<span>♫</span> Play Music';
        if (drawerBtn) drawerBtn.innerHTML = '<span>♫</span> Play Music';
      }
    },

    playBgMusic() {
      if (!this.bgMusic) {
        this.bgMusic = new Audio(content.audio?.backgroundMusic || 'assets/audio/background-music.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.currentVolume;
      }

      this.bgMusic.play().catch(() => {
        // Synthesize a soft chime if local file isn't found
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

  /* ─── 2. NAVIGATION & JOURNEY INDICATOR ─────────────────────────────────── */
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
        { id: "moments", label: "Moments", num: "04" },
        { id: "birthday", label: "Birthday", num: "05" },
        { id: "letter", label: "Letter", num: "06" },
        { id: "surprise", label: "Surprise", num: "07" }
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
            if (numEl) numEl.textContent = `${step.num} / 07`;
            if (labelEl) labelEl.textContent = step.label;
          }
        }
      });
    }
  };

  /* ─── 3. HERO PETALS CANVAS ─────────────────────────────────────────────── */
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

  /* ─── 4. DIGITAL ENVELOPE / GIFT MODAL ──────────────────────────────────── */
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

  /* ─── 5. REASONS YOU'RE SPECIAL ─────────────────────────────────────────── */
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

  /* ─── 6. MEMORY GALLERY, LIGHTBOX & MEMORY BLOOM ────────────────────────── */
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
          const wrapper = item.querySelector('.gallery-thumb-wrapper');
          if (wrapper) {
            wrapper.innerHTML = `
              <div class="image-placeholder">
                <span class="placeholder-icon">🌹</span>
                <p class="placeholder-text">${m.title}</p>
                <span class="placeholder-hint">Add ${m.image}</span>
              </div>
            `;
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
        img.onerror = () => {
          img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23FFF0F2"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%237D3042">🌸 ' + encodeURIComponent(item.title) + '</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%237A686C">Image placeholder</text></svg>';
        };
      }
    },

    /* SIGNATURE WOW MOMENT: THE MEMORY BLOOM */
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

  /* ─── 7. VIDEO MEMORIES ─────────────────────────────────────────────────── */
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

        const posterImg = card.querySelector('.video-poster-img');
        posterImg.onerror = () => {
          posterImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect width="100%" height="100%" fill="%23DDD4F3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%237D3042">📹 ' + encodeURIComponent(v.title) + '</text></svg>';
        };

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

  /* ─── 8. THE BOUQUET SECTION ────────────────────────────────────────────── */
  const BouquetSection = {
    init() {
      const pinsContainer = document.getElementById('bouquet-flower-pins');
      const messageBox = document.getElementById('bouquet-message-text');
      if (!pinsContainer || !messageBox) return;

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

  /* ─── 9. BIRTHDAY CAKE & CELEBRATION ────────────────────────────────────── */
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

  /* ─── 10. MINI GAME 1 — CATCH THE FLOWERS ───────────────────────────────── */
  const FlowerGame = {
    score: 0,
    target: 10,
    interval: null,
    active: false,

    init() {
      const area = document.getElementById('flower-game-canvas');
      const startBtn = document.getElementById('start-flower-game-btn');
      const scoreEl = document.getElementById('flower-game-score');
      const resultBox = document.getElementById('flower-game-result');

      this.target = content.games?.flowerGame?.target || 10;

      startBtn?.addEventListener('click', () => {
        this.score = 0;
        if (scoreEl) scoreEl.textContent = `0 / ${this.target}`;
        resultBox?.classList.remove('active');
        startBtn.textContent = 'Restart Game 🌸';
        this.startGame(area);
      });
    },

    startGame(area) {
      if (!area) return;
      clearInterval(this.interval);
      area.querySelectorAll('.falling-flower-item').forEach(e => e.remove());
      this.active = true;

      this.interval = setInterval(() => {
        if (!this.active || this.score >= this.target) return;
        this.spawnFlower(area);
      }, 700);
    },

    spawnFlower(area) {
      const flowers = ['🌸', '🌺', '🌷', '🌹', '💐', '💜'];
      const el = document.createElement('div');
      el.className = 'falling-flower-item';
      el.textContent = flowers[Math.floor(Math.random() * flowers.length)];
      el.style.left = `${Math.random() * 85 + 5}%`;
      el.style.setProperty('--speed', `${Math.random() * 2 + 2.5}s`);
      el.style.setProperty('--sway', `${(Math.random() - 0.5) * 50}px`);

      el.addEventListener('click', () => {
        this.score++;
        AudioManager.initContext();
        AudioManager.playPop();
        const scoreEl = document.getElementById('flower-game-score');
        if (scoreEl) scoreEl.textContent = `${this.score} / ${this.target}`;
        el.remove();

        if (this.score >= this.target) {
          this.active = false;
          clearInterval(this.interval);
          const resultBox = document.getElementById('flower-game-result');
          if (resultBox) {
            resultBox.textContent = content.games?.flowerGame?.completionMessage || 'Your bouquet is complete 💐✨';
            resultBox.classList.add('active');
          }
          AudioManager.playChime();
        }
      });

      area.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }
  };

  /* ─── 11. MINI GAME 2 — FIND THE GIFT ───────────────────────────────────── */
  const GiftFinderGame = {
    init() {
      const boxes = document.querySelectorAll('.gift-box-item');
      const resultBox = document.getElementById('gift-finder-result');
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
            if (resultBox) {
              resultBox.textContent = content.games?.giftGame?.giftMessage || 'You found it! ♡';
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
    }
  };

  /* ─── 12. MAKE A WISH INTERACTION ───────────────────────────────────────── */
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

  /* ─── 13. POPULATE DYNAMIC CONTENT FROM DATA/CONTENT.JS ─────────────────── */
  const ContentPopulator = {
    populate() {
      // Hero
      const heroTitle = document.getElementById('hero-title');
      const heroSub = document.getElementById('hero-subtitle');
      if (heroTitle && content.hero?.title) {
        heroTitle.innerHTML = `${content.hero.title.replace('♡', '')} <span>${content.person?.name || 'Rabi'} ♡</span>`;
      }
      if (heroSub && content.hero?.subtitle) {
        heroSub.textContent = content.hero.subtitle;
      }

      // About
      const aboutDesc = document.getElementById('about-description');
      const aboutQuote = document.getElementById('about-quote');
      const traitsGrid = document.getElementById('about-traits-grid');

      if (aboutDesc && content.about?.description) aboutDesc.textContent = content.about.description;
      if (aboutQuote && content.about?.quote) aboutQuote.textContent = content.about.quote;

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

      // Letter
      const letterTitle = document.getElementById('letter-title');
      const letterDate = document.getElementById('letter-date');
      const letterSalutation = document.getElementById('letter-salutation');
      const letterBody = document.getElementById('letter-paragraphs');
      const letterClosing = document.getElementById('letter-closing');
      const letterSig = document.getElementById('letter-signature');

      if (letterTitle && content.letter?.title) letterTitle.textContent = content.letter.title;
      if (letterDate && content.letter?.date) letterDate.textContent = content.letter.date;
      if (letterSalutation && content.letter?.salutation) letterSalutation.textContent = content.letter.salutation;
      if (letterClosing && content.letter?.closing) letterClosing.textContent = content.letter.closing;
      if (letterSig && content.letter?.signature) letterSig.textContent = content.letter.signature;

      if (letterBody && content.letter?.paragraphs) {
        letterBody.innerHTML = '';
        content.letter.paragraphs.forEach(p => {
          const pEl = document.createElement('p');
          pEl.className = 'letter-paragraph';
          pEl.textContent = p;
          letterBody.appendChild(pEl);
        });
      }

      // Final Surprise
      const surpriseQuote = document.getElementById('final-quote-text');
      const replayBtn = document.getElementById('replay-btn');
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
  Navigation.init();
  HeroPetals.init();
  GiftModal.init();
  ReasonsSection.init();
  MemoryGallery.init();
  VideoMemories.init();
  BouquetSection.init();
  BirthdayCelebration.init();
  FlowerGame.init();
  GiftFinderGame.init();
  MakeAWish.init();
  AudioManager.init();
});
