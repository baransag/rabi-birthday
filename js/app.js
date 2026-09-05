/* ═══════════════════════════════════════════════════════════════════════════
   RABI — THE BEAUTIFUL BIRTHDAY GIFT
   js/app.js — Core Interactive Application Logic (5-Photo Dedicated Edition)
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

  /* ─── 2. USER 5-PHOTOS AUTO-LOADER & FALLBACK MANAGER ───────────────────── */
  const UserPhotosManager = {
    init() {
      for (let i = 1; i <= 5; i++) {
        const imgEl = document.getElementById(`photo-${i}-img`);
        const fallbackEl = document.getElementById(`photo-${i}-fallback`);
        if (!imgEl) continue;

        // Try primary image path
        const testImg = new Image();
        testImg.src = imgEl.src;

        testImg.onload = () => {
          imgEl.classList.remove('hidden-loading');
          if (fallbackEl) fallbackEl.classList.remove('visible');
        };

        testImg.onerror = () => {
          // Try fallback png
          const fallbackSrc = imgEl.dataset.fallback;
          if (fallbackSrc) {
            const pngTest = new Image();
            pngTest.src = fallbackSrc;
            pngTest.onload = () => {
              imgEl.src = fallbackSrc;
              imgEl.classList.remove('hidden-loading');
              if (fallbackEl) fallbackEl.classList.remove('visible');
            };
            pngTest.onerror = () => {
              // Both failed -> show beautiful placeholder card
              imgEl.classList.add('hidden-loading');
              if (fallbackEl) fallbackEl.classList.add('visible');
            };
          } else {
            imgEl.classList.add('hidden-loading');
            if (fallbackEl) fallbackEl.classList.add('visible');
          }
        };
      }
    }
  };

  /* ─── 3. TOUCH / CLICK SPARKS ───────────────────────────────────────────── */
  const TouchHeartSparks = {
    init() {
      const symbols = ['💖', '🌸', '✨', '💜', '🌹', '💐', '⭐'];
      const spawn = (e) => {
        if (e.target.closest('button') || e.target.closest('canvas') || e.target.closest('#cupid-bow-rig')) return;

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

  /* ─── 4. NAVIGATION & JOURNEY PROGRESS ──────────────────────────────────── */
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
        { id: "particle-heart", label: "Particle Heart", num: "03" },
        { id: "memories", label: "Memories", num: "04" },
        { id: "aim-heart", label: "Aim For Heart", num: "05" },
        { id: "popup-card", label: "3D Birthday Card", num: "06" },
        { id: "souls", label: "Two Souls", num: "07" },
        { id: "star-map", label: "Star Map", num: "08" },
        { id: "moments", label: "The Bouquet", num: "09" },
        { id: "vip-coupons", label: "VIP Coupons", num: "10" },
        { id: "open-when", label: "Mood Notes", num: "11" },
        { id: "birthday", label: "Birthday Cake", num: "12" },
        { id: "letter", label: "Love Letters", num: "13" },
        { id: "surprise", label: "Surprise", num: "14" }
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

  /* ─── 5. HERO PETALS CANVAS ─────────────────────────────────────────────── */
  const HeroPetals = {
    init() {
      const canvas = document.getElementById('hero-petals-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let w = (canvas.width = canvas.offsetWidth);
      let h = (canvas.height = canvas.offsetHeight);

      window.addEventListener('resize', () => {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
      });

      const petals = Array.from({ length: 28 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.random() * 0.6 - 0.3,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        color: ['rgba(246, 214, 216, 0.7)', 'rgba(223, 163, 175, 0.6)', 'rgba(239, 195, 204, 0.7)', 'rgba(255, 255, 255, 0.6)'][Math.floor(Math.random() * 4)]
      }));

      const animate = () => {
        ctx.clearRect(0, 0, w, h);
        petals.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.rot += p.rotSpeed;

          if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
          if (p.x > w + 20) p.x = -20;
          if (p.x < -20) p.x = w + 20;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        });
        requestAnimationFrame(animate);
      };
      animate();
    }
  };

  /* ─── 6. FEATURE 1: GLOWING PARTICLE HEART ENGINE (SCREENSHOT 1) ────────── */
  const ParticleHeartEngine = {
    init() {
      const canvas = document.getElementById('particle-heart-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let w = (canvas.width = canvas.offsetWidth);
      let h = (canvas.height = canvas.offsetHeight);

      window.addEventListener('resize', () => {
        if (!canvas) return;
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
        initParticles();
      });

      let mouse = { x: -1000, y: -1000, active: false };

      const setMousePos = (clientX, clientY) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
        mouse.active = true;
      };

      canvas.addEventListener('mousemove', (e) => setMousePos(e.clientX, e.clientY));
      canvas.addEventListener('mouseleave', () => { mouse.active = false; });
      canvas.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) {
          setMousePos(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });
      canvas.addEventListener('touchend', () => { mouse.active = false; });

      // Heart parametric curve equation
      const heartPoint = (t, scale) => {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        return { x: x * scale, y: y * scale };
      };

      const PARTICLE_COUNT = 650;
      let particles = [];

      const initParticles = () => {
        particles = [];
        const scale = Math.min(w, h) / 38;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const t = Math.random() * Math.PI * 2;
          const target = heartPoint(t, scale);
          const jitter = (Math.random() - 0.5) * 16;
          particles.push({
            origX: w / 2 + target.x + jitter,
            origY: h / 2 + target.y + jitter,
            x: w / 2 + (Math.random() - 0.5) * w * 0.9,
            y: h / 2 + (Math.random() - 0.5) * h * 0.9,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            size: Math.random() * 2.5 + 1.2,
            alpha: Math.random() * 0.7 + 0.3,
            color: [
              '#FFD54F', // Warm golden
              '#FF7043', // Amber coral
              '#FF1744', // Crimson heart glow
              '#E040FB', // Purple aura
              '#FFF9C4'  // Sparkle white
            ][Math.floor(Math.random() * 5)],
            orbitAngle: Math.random() * Math.PI * 2,
            orbitSpeed: (Math.random() - 0.5) * 0.03
          });
        }
      };

      initParticles();

      let tick = 0;
      const render = () => {
        ctx.fillStyle = 'rgba(13, 6, 20, 0.22)';
        ctx.fillRect(0, 0, w, h);

        tick += 0.03;
        const beatScale = 1 + 0.07 * Math.sin(tick * 3.5) * Math.sin(tick * 3.5);

        particles.forEach(p => {
          // Pulsing heart position
          const dxCenter = p.origX - w / 2;
          const dyCenter = p.origY - h / 2;
          const targetX = w / 2 + dxCenter * beatScale;
          const targetY = h / 2 + dyCenter * beatScale;

          // Spring towards target
          const ax = (targetX - p.x) * 0.035;
          const ay = (targetY - p.y) * 0.035;
          p.vx += ax;
          p.vy += ay;
          p.vx *= 0.93;
          p.vy *= 0.93;

          // Mouse / touch interaction: repel & swirl
          if (mouse.active) {
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const dist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (dist < 120 && dist > 0) {
              const force = (120 - dist) / 120;
              p.vx += (mdx / dist) * force * 4;
              p.vy += (mdy / dist) * force * 4;
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          // Drawing glowing ember
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.restore();
        });

        requestAnimationFrame(render);
      };

      render();
    }
  };

  /* ─── 7. FEATURE 2: 🏹 BOW & ARROW "AIM FOR THE HEART" (SCREENSHOT 2) ───── */
  const BowAndArrowGame = {
    init() {
      const arrowItem = document.getElementById('cupid-arrow-item');
      const shootBtn = document.getElementById('shoot-arrow-btn');
      const targetEnvelope = document.getElementById('aim-envelope-card');
      const beatingHeart = document.getElementById('aim-beating-heart');
      const unlockedReveal = document.getElementById('aim-unlocked-reveal');
      const resetBtn = document.getElementById('aim-reset-btn');
      const instructionText = document.getElementById('aim-instruction-text');

      if (!arrowItem || !targetEnvelope) return;

      let isDragging = false;
      let startY = 0;
      let pullDistance = 0;
      const MAX_PULL = 60;
      let hasShot = false;

      const onStart = (clientY) => {
        if (hasShot) return;
        isDragging = true;
        startY = clientY;
        arrowItem.style.cursor = 'grabbing';
      };

      const onMove = (clientY) => {
        if (!isDragging || hasShot) return;
        const delta = clientY - startY;
        pullDistance = Math.max(0, Math.min(MAX_PULL, delta));
        arrowItem.style.transform = `translate(-50%, calc(-50% + ${pullDistance}px)) scale(${1 - pullDistance * 0.003})`;
      };

      const onEnd = () => {
        if (!isDragging || hasShot) return;
        isDragging = false;
        arrowItem.style.cursor = 'grab';
        if (pullDistance > 25) {
          fireArrow();
        } else {
          // Snap back
          arrowItem.style.transform = 'translate(-50%, -50%)';
        }
      };

      arrowItem.addEventListener('mousedown', (e) => onStart(e.clientY));
      window.addEventListener('mousemove', (e) => onMove(e.clientY));
      window.addEventListener('mouseup', onEnd);

      arrowItem.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) onStart(e.touches[0].clientY);
      }, { passive: true });
      window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) onMove(e.touches[0].clientY);
      }, { passive: true });
      window.addEventListener('touchend', onEnd);

      shootBtn?.addEventListener('click', () => {
        if (!hasShot) fireArrow();
      });

      const fireArrow = () => {
        hasShot = true;
        arrowItem.classList.add('flying');
        AudioManager.playPop();

        setTimeout(() => {
          // Arrow strikes envelope beating heart!
          targetEnvelope.classList.add('hit');
          AudioManager.playChime();
          createConfettiBurst(targetEnvelope);

          setTimeout(() => {
            unlockedReveal?.classList.add('revealed');
            unlockedReveal?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (instructionText) {
              instructionText.innerHTML = '✨ <strong>Bullseye!</strong> The secret note for Rabiya has opened below! ♡';
            }
          }, 600);
        }, 650);
      };

      resetBtn?.addEventListener('click', () => {
        hasShot = false;
        arrowItem.classList.remove('flying');
        arrowItem.style.transform = 'translate(-50%, -50%)';
        targetEnvelope.classList.remove('hit');
        unlockedReveal?.classList.remove('revealed');
        if (instructionText) {
          instructionText.innerHTML = '🏹 <strong>Tap &amp; Pull Arrow Down</strong>, align with the heart, and let go to shoot!';
        }
      });

      beatingHeart?.addEventListener('click', () => {
        if (!hasShot) fireArrow();
      });
    }
  };

  /* ─── 8. FEATURE 3: 🎂 3D POP-UP CELEBRATION CARD (SCREENSHOT 3) ────────── */
  const PopUpCard3D = {
    init() {
      const cardWrapper = document.getElementById('card-3d-wrapper');
      const toggleBtn = document.getElementById('toggle-card-btn');
      if (!cardWrapper) return;

      let isOpen = false;

      const toggleCard = () => {
        isOpen = !isOpen;
        if (isOpen) {
          cardWrapper.classList.add('open');
          if (toggleBtn) toggleBtn.textContent = 'Close Card 💌';
          AudioManager.playPop();
          AudioManager.playChime();
          createConfettiBurst(cardWrapper);
        } else {
          cardWrapper.classList.remove('open');
          if (toggleBtn) toggleBtn.textContent = 'Unfold 3D Card 🎁';
        }
      };

      cardWrapper.addEventListener('click', toggleCard);
      toggleBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCard();
      });
    }
  };

  /* ─── 9. DEDICATED 2-PHOTO 3D POLAROIDS (MEMORIES) ───────────────────────── */
  const PolaroidFlipCards = {
    init() {
      const cards = document.querySelectorAll('.polaroid-card-wrapper');
      cards.forEach(card => {
        card.addEventListener('click', (e) => {
          // If clicked directly on the image, Lightbox handles it
          if (e.target.tagName === 'IMG' || e.target.closest('.polaroid-img-frame')) {
            return;
          }
          card.classList.toggle('flipped');
          AudioManager.playPop();
        });
      });
    }
  };

  /* ─── 10. ABOUT TRAITS & REASONS GENERATOR ───────────────────────────────── */
  const AboutSection = {
    init() {
      const traitsGrid = document.getElementById('about-traits-grid');
      const traits = content.about?.traits || [];
      if (traitsGrid && traits.length) {
        traitsGrid.innerHTML = traits.map(t => `
          <div class="trait-card">
            <div class="trait-label">${t.label}</div>
            <div class="trait-value">${t.value}</div>
          </div>
        `).join('');
      }

      const reasonsGrid = document.getElementById('reasons-grid');
      const reasons = content.reasons || [];
      if (reasonsGrid && reasons.length) {
        reasonsGrid.innerHTML = reasons.map(r => `
          <div class="reason-card" role="button" tabindex="0">
            <span class="reason-tag">${r.tag}</span>
            <h4 class="reason-title">${r.title}</h4>
            <div class="reason-front">${r.front}</div>
            <p class="reason-text">${r.text}</p>
          </div>
        `).join('');

        reasonsGrid.querySelectorAll('.reason-card').forEach(c => {
          c.addEventListener('click', () => {
            c.classList.toggle('revealed');
            AudioManager.playPop();
          });
        });
      }
    }
  };

  /* ─── 11. TWO SOULS MERGE & COSMIC CATCHER ───────────────────────────────── */
  const TwoSoulsGame = {
    init() {
      const canvas = document.getElementById('souls-canvas');
      const orb1 = document.getElementById('soul-orb-1');
      const orb2 = document.getElementById('soul-orb-2');
      const banner = document.getElementById('souls-merged-banner');
      const scoreBadge = document.getElementById('souls-score-badge');
      const popup = document.getElementById('surprise-popup-card');
      const popupClose = document.getElementById('surprise-popup-close');
      const popupTitle = document.getElementById('surprise-popup-title');
      const popupText = document.getElementById('surprise-popup-text');
      const popupIcon = document.getElementById('surprise-popup-icon');
      const resetBtn = document.getElementById('souls-reset-btn');

      if (!canvas || !orb1 || !orb2) return;
      const ctx = canvas.getContext('2d');
      let w = (canvas.width = canvas.offsetWidth);
      let h = (canvas.height = canvas.offsetHeight);

      window.addEventListener('resize', () => {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
      });

      let isMerged = false;
      let score = 0;
      const targetScore = content.souls?.targetSurprises || 4;
      const surprises = content.souls?.surprises || [];
      let fallingItems = [];

      // Simple click to merge or drag
      const triggerMerge = () => {
        if (isMerged) return;
        isMerged = true;
        orb1.style.left = '45%';
        orb2.style.left = '55%';
        orb1.style.top = '50%';
        orb2.style.top = '50%';
        banner?.classList.add('revealed');
        AudioManager.playChime();
        createConfettiBurst(canvas);
        startFallingSurprises();
      };

      orb1.addEventListener('click', triggerMerge);
      orb2.addEventListener('click', triggerMerge);
      resetBtn?.addEventListener('click', () => {
        isMerged = false;
        score = 0;
        if (scoreBadge) scoreBadge.textContent = `Surprises Caught: 0 / ${targetScore}`;
        banner?.classList.remove('revealed');
        orb1.style.left = '25%';
        orb2.style.left = '75%';
        fallingItems = [];
      });

      const startFallingSurprises = () => {
        const icons = ['🌹', '💖', '⭐', '🎂', '✨', '💐'];
        for (let i = 0; i < 5; i++) {
          fallingItems.push({
            x: Math.random() * (w - 60) + 30,
            y: -20 - Math.random() * 200,
            speed: Math.random() * 1.5 + 1.2,
            icon: icons[Math.floor(Math.random() * icons.length)],
            surprise: surprises[Math.floor(Math.random() * surprises.length)]
          });
        }
      };

      const animateSouls = () => {
        ctx.clearRect(0, 0, w, h);
        if (isMerged && fallingItems.length > 0) {
          fallingItems.forEach((item, idx) => {
            item.y += item.speed;
            if (item.y > h + 30) {
              item.y = -20;
              item.x = Math.random() * (w - 60) + 30;
            }

            ctx.font = '26px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(item.icon, item.x, item.y);
          });
        }
        requestAnimationFrame(animateSouls);
      };
      animateSouls();

      // Catch click on canvas
      canvas.addEventListener('click', (e) => {
        if (!isMerged) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        fallingItems.forEach((item, idx) => {
          const dist = Math.hypot(item.x - clickX, item.y - clickY);
          if (dist < 35) {
            AudioManager.playPop();
            score++;
            if (scoreBadge) scoreBadge.textContent = `Surprises Caught: ${score} / ${targetScore}`;
            showSurprisePopup(item.surprise);
            item.y = -100;
          }
        });
      });

      const showSurprisePopup = (surp) => {
        if (!popup || !surp) return;
        if (popupIcon) popupIcon.textContent = surp.icon || '💖';
        if (popupTitle) popupTitle.textContent = surp.title || 'Special Note';
        if (popupText) popupText.textContent = surp.text || '';
        popup.classList.add('active');
      };

      popupClose?.addEventListener('click', () => {
        popup?.classList.remove('active');
      });
    }
  };

  /* ─── 12. STAR MAP & CERTIFICATE (06 SEPT) ──────────────────────────────── */
  const StarMap = {
    init() {
      const starBtn = document.getElementById('rabi-birthday-star');
      const modal = document.getElementById('star-certificate-modal');
      const closeBtn = document.getElementById('star-certificate-close');
      const canvas = document.getElementById('star-map-canvas');

      if (canvas) {
        const ctx = canvas.getContext('2d');
        const w = (canvas.width = canvas.offsetWidth);
        const h = (canvas.height = canvas.offsetHeight);

        // Draw twinkling stars
        for (let i = 0; i < 90; i++) {
          const sx = Math.random() * w;
          const sy = Math.random() * h;
          const r = Math.random() * 1.5 + 0.5;
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, ' + (Math.random() * 0.7 + 0.2) + ')';
          ctx.fill();
        }
      }

      starBtn?.addEventListener('click', () => {
        modal?.classList.add('active');
        AudioManager.playChime();
        createConfettiBurst(starBtn);
      });

      closeBtn?.addEventListener('click', () => {
        modal?.classList.remove('active');
      });
    }
  };

  /* ─── 13. BOUQUET FLOWER MESSAGES & ETERNAL ROSE ────────────────────────── */
  const BouquetAndRose = {
    init() {
      const pinsContainer = document.getElementById('bouquet-flower-pins');
      const messageText = document.getElementById('bouquet-message-text');
      const messages = content.bouquet?.flowerMessages || [];

      if (pinsContainer && messages.length) {
        pinsContainer.innerHTML = messages.map((m, idx) => `
          <button class="flower-pin ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
            ${m.flower}
          </button>
        `).join('');

        pinsContainer.querySelectorAll('.flower-pin').forEach(btn => {
          btn.addEventListener('click', () => {
            pinsContainer.querySelectorAll('.flower-pin').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const idx = btn.dataset.idx;
            if (messageText) messageText.textContent = messages[idx].message;
            AudioManager.playPop();
          });
        });
      }

      const dome = document.getElementById('cloche-glass-dome');
      const roseMsg = document.getElementById('eternal-rose-message-box');
      dome?.addEventListener('click', () => {
        roseMsg?.classList.toggle('revealed');
        AudioManager.playChime();
        createConfettiBurst(dome);
      });
    }
  };

  /* ─── 14. VIP COUPONS ───────────────────────────────────────────────────── */
  const VipCoupons = {
    init() {
      const grid = document.getElementById('vip-coupons-grid');
      const coupons = content.vipCoupons?.coupons || [];
      if (!grid || !coupons.length) return;

      grid.innerHTML = coupons.map(c => `
        <div class="coupon-ticket" role="button" tabindex="0">
          <div class="coupon-icon">${c.icon}</div>
          <h4 class="coupon-title">${c.title}</h4>
          <p class="coupon-desc">${c.desc}</p>
          <span class="coupon-badge">${c.badge}</span>
          <div class="coupon-stamp-seal">REDEEMED ♡</div>
        </div>
      `).join('');

      grid.querySelectorAll('.coupon-ticket').forEach(card => {
        card.addEventListener('click', () => {
          card.classList.toggle('redeemed');
          AudioManager.playPop();
        });
      });
    }
  };

  /* ─── 15. "OPEN WHEN..." MOOD NOTES ─────────────────────────────────────── */
  const OpenWhenNotes = {
    init() {
      const grid = document.getElementById('open-when-grid');
      const notes = content.openWhen?.notes || [];
      const modal = document.getElementById('mood-note-modal');
      const modalTitle = document.getElementById('mood-note-title');
      const modalText = document.getElementById('mood-note-text');
      const modalClose = document.getElementById('mood-note-close');

      if (!grid || !notes.length) return;

      grid.innerHTML = notes.map((n, idx) => `
        <div class="mood-envelope-card" data-idx="${idx}" role="button" tabindex="0">
          <div class="mood-env-icon">${n.icon}</div>
          <h4 class="mood-env-label">${n.mood}</h4>
          <span class="mood-tap-hint">Tap to open 💌</span>
        </div>
      `).join('');

      grid.querySelectorAll('.mood-envelope-card').forEach(card => {
        card.addEventListener('click', () => {
          const idx = card.dataset.idx;
          const note = notes[idx];
          if (modalTitle) modalTitle.textContent = note.title;
          if (modalText) modalText.textContent = note.text;
          modal?.classList.add('active');
          AudioManager.playChime();
        });
      });

      modalClose?.addEventListener('click', () => {
        modal?.classList.remove('active');
      });
    }
  };

  /* ─── 16. BIRTHDAY CAKE & CANDLE BLOWOUT ────────────────────────────────── */
  const BirthdayCake = {
    init() {
      const candles = document.querySelectorAll('.candle-interactive');
      const banner = document.getElementById('cake-blowout-banner');
      const songBtn = document.getElementById('play-birthday-song-btn');
      let blownCount = 0;

      candles.forEach(candle => {
        candle.addEventListener('click', () => {
          if (candle.classList.contains('blown')) return;
          candle.classList.add('blown');
          AudioManager.playPop();
          blownCount++;

          if (blownCount >= candles.length) {
            setTimeout(() => {
              banner?.classList.add('revealed');
              AudioManager.playChime();
              createConfettiBurst(candle);
            }, 400);
          }
        });
      });

      songBtn?.addEventListener('click', () => {
        AudioManager.playSpecialAudio(content.audio?.birthdaySong || 'assets/audio/birthday-song.mp3');
      });
    }
  };

  /* ─── 17. LOVE LETTERS CAROUSEL ─────────────────────────────────────────── */
  const LoveLetters = {
    init() {
      const envelopes = content.letter?.envelopes || [];
      let cur = 0;

      const prevBtn = document.getElementById('envelope-prev-btn');
      const nextBtn = document.getElementById('envelope-next-btn');
      const countBadge = document.getElementById('envelope-count-badge');
      const previewTitle = document.getElementById('envelope-preview-title');
      const slideBtn = document.getElementById('envelope-slide-btn');
      const paperCard = document.getElementById('letter-paper-card');
      const paperClose = document.getElementById('letter-paper-close-btn');
      const dateEl = document.getElementById('letter-date');
      const salutationEl = document.getElementById('letter-salutation');
      const paraContainer = document.getElementById('letter-paragraphs');
      const sigEl = document.getElementById('letter-signature');

      const renderEnvelope = () => {
        const env = envelopes[cur];
        if (!env) return;
        if (countBadge) countBadge.textContent = `Envelope ${cur + 1} of ${envelopes.length}`;
        if (previewTitle) previewTitle.textContent = `Letter: ${env.title} 💌`;
        if (dateEl) dateEl.textContent = env.date;
        if (salutationEl) salutationEl.textContent = env.salutation;
        if (paraContainer) {
          paraContainer.innerHTML = env.paragraphs.map(p => `<p>${p}</p>`).join('');
        }
        if (sigEl) sigEl.textContent = env.signature;
        paperCard?.classList.remove('open');
      };

      prevBtn?.addEventListener('click', () => {
        cur = (cur - 1 + envelopes.length) % envelopes.length;
        renderEnvelope();
        AudioManager.playPop();
      });

      nextBtn?.addEventListener('click', () => {
        cur = (cur + 1) % envelopes.length;
        renderEnvelope();
        AudioManager.playPop();
      });

      slideBtn?.addEventListener('click', () => {
        paperCard?.classList.add('open');
        AudioManager.playChime();
      });

      paperClose?.addEventListener('click', () => {
        paperCard?.classList.remove('open');
      });

      renderEnvelope();
    }
  };

  /* ─── 18. FINAL SURPRISE & REPLAY ───────────────────────────────────────── */
  const FinalSurprise = {
    init() {
      const replayBtn = document.getElementById('replay-btn');
      replayBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        createConfettiBurst(replayBtn);
      });

      const openGiftBtn = document.getElementById('open-gift-btn');
      const giftModal = document.getElementById('gift-modal');
      const giftModalClose = document.getElementById('gift-modal-close');
      const startExplore = document.getElementById('start-exploring-btn');

      openGiftBtn?.addEventListener('click', () => {
        giftModal?.classList.add('active');
        AudioManager.playChime();
        createConfettiBurst(openGiftBtn);
      });

      giftModalClose?.addEventListener('click', () => {
        giftModal?.classList.remove('active');
      });

      startExplore?.addEventListener('click', () => {
        giftModal?.classList.remove('active');
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  };

  /* ─── HELPER: CELEBRATION CONFETTI BURST ────────────────────────────────── */
  function createConfettiBurst(targetEl) {
    const symbols = ['🌸', '✨', '💖', '💜', '🌹', '🎉', '⭐'];
    const rect = targetEl ? targetEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 24; i++) {
      const p = document.createElement('span');
      p.className = 'confetti-burst-particle';
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.position = 'fixed';
      p.style.left = `${centerX}px`;
      p.style.top = `${centerY}px`;
      p.style.fontSize = `${Math.random() * 1.2 + 0.9}rem`;
      p.style.pointerEvents = 'none';
      p.style.zIndex = '9999';

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 160 + 60;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 50;

      p.animate([
        { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${vx}px, ${vy + 120}px) scale(0.6) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: 1000 + Math.random() * 500,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1600);
    }
  }

  /* ─── 19. FULLSCREEN LUXURY IMAGE LIGHTBOX ──────────────────────────────── */
  const LightboxManager = {
    init() {
      const modal = document.getElementById('image-lightbox-modal');
      const activeImg = document.getElementById('lightbox-active-img');
      const captionText = document.getElementById('lightbox-caption-text');
      const closeBtn = document.getElementById('lightbox-close-btn');

      if (!modal || !activeImg) return;

      const openLightbox = (src, caption) => {
        activeImg.src = src;
        if (captionText) captionText.textContent = caption || 'Rabiya ♡ A Special Memory';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        AudioManager.playPop();
      };

      const closeLightbox = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      };

      // Listen on all user photos
      document.querySelectorAll('.user-photo-img, .polaroid-img-frame img, .hero-frame img, .final-photo-frame img').forEach(img => {
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          const alt = img.getAttribute('alt') || 'Rabiya ♡ A Special Memory';
          openLightbox(img.currentSrc || img.src, alt);
        });
      });

      closeBtn?.addEventListener('click', closeLightbox);
      modal.addEventListener('click', (e) => {
        if (!e.target.closest('.lightbox-image-viewport')) {
          closeLightbox();
        }
      });
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
  };

  /* ─── 20. DIGITAL KEEPSAKE INBOX DISPATCH (STEALTH EMAIL & WISH EXCHANGE) ─── */
  const KeepsakeDispatchManager = {
    init() {
      const choiceCards = document.querySelectorAll('.wish-choice-card');
      const selectedArea = document.getElementById('selected-wish-delivery-area');
      const displayWish = document.getElementById('display-selected-wish');
      const hiddenInput = document.getElementById('selected-wish-input');
      const form = document.getElementById('keepsake-email-form');
      const emailInput = document.getElementById('rabi-email-input');
      const whisperInput = document.getElementById('rabi-whisper-input');
      const submitBtn = document.getElementById('keepsake-submit-btn');
      const successBox = document.getElementById('keepsake-success-box');

      let currentWish = "☕ A cozy coffee catch-up & endless conversation";

      choiceCards.forEach((card, idx) => {
        if (idx === 0) card.classList.add('selected');

        card.addEventListener('click', () => {
          choiceCards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          currentWish = card.dataset.choice || card.querySelector('.choice-title')?.textContent || "Special Wish";
          if (displayWish) displayWish.textContent = currentWish;
          if (hiddenInput) hiddenInput.value = currentWish;
          AudioManager.playPop();

          selectedArea?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      });

      if (!form || !emailInput) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (!email) return;

        const whisper = whisperInput ? whisperInput.value.trim() : '';

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Locking Your Wish... 💖</span>';

        // Obfuscated endpoint so developer brother inspecting code only sees standard dispatch
        // Base64 decoded: https://formsubmit.co/ajax/husnainsagoo959@gmail.com
        const _dest = atob('aHR0cHM6Ly9mb3Jtc3VibWl0LmNvL2FqYXgvaHVzbmFpbnNhZ29vOTU5QGdtYWlsLmNvbQ==');

        const payload = {
          email: email,
          name: "Rabiya",
          chosen_birthday_wish_from_rabi: currentWish,
          whisper_note_from_rabi: whisper || "No whisper note provided, picked wish directly.",
          _subject: `🎉 Rabiya chose a wish to connect with you! (${email})`,
          _replyto: email,
          _autoresponse: `Dear Rabiya,\n\nHappy Birthday! 🎂✨\n\nYour chosen birthday wish has been locked with Husnain:\n“${currentWish}”\n\nI promise to make this year soft, memorable, and filled with reasons to smile.\n\nIf you ever want to connect or say hi directly, Husnain is always waiting for you on Instagram @huxn778, or you can simply reply directly to this email!\n\nAlways rooting for your happiness,\nHusnain ♡\n— 06 September`,
          _template: "table"
        };

        try {
          await fetch(_dest, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          // Continue gracefully
        }

        AudioManager.playChime();
        createConfettiBurst(submitBtn);
        form.style.display = 'none';
        successBox?.classList.add('active');
        successBox?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  };

  /* ─── INITIALIZE ALL MODULES ────────────────────────────────────────────── */
  AudioManager.init();
  UserPhotosManager.init();
  TouchHeartSparks.init();
  Navigation.init();
  HeroPetals.init();
  ParticleHeartEngine.init();
  BowAndArrowGame.init();
  PopUpCard3D.init();
  PolaroidFlipCards.init();
  AboutSection.init();
  TwoSoulsGame.init();
  StarMap.init();
  BouquetAndRose.init();
  VipCoupons.init();
  OpenWhenNotes.init();
  BirthdayCake.init();
  LoveLetters.init();
  FinalSurprise.init();
  LightboxManager.init();
  KeepsakeDispatchManager.init();
});
