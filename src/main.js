import './style.css';

/* ══════════════════════════════════════════════════════════
   MAIN.JS — Code-syntax particles, interactive hero,
   custom cursor trail, theme toggle, parallax, animations
   ══════════════════════════════════════════════════════════ */

// ─── Code Syntax Particle Field ───
const CODE_SYMBOLS = ['{', '}', '(', ')', '=>', '</>', ';', '//', '#', '[]', '&&', '||', '!=', '++', '--', '**', '::',  'fn', 'if', '01', '<?', '/>'];

class CodeParticleField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: 220 };
    this.scrollY = 0;
    this.isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const area = this.canvas.width * this.canvas.height;
    const count = Math.min(Math.floor(area / 8000), 150);

    for (let i = 0; i < count; i++) {
      const type = Math.random();
      let fontSize, speed, opacity, color;

      if (type < 0.15) {
        fontSize = Math.random() * 6 + 14;
        speed = 0.12;
        opacity = Math.random() * 0.4 + 0.25;
        color = Math.random() > 0.5 ? 'cyan' : 'purple';
      } else if (type < 0.4) {
        fontSize = Math.random() * 4 + 11;
        speed = 0.2;
        opacity = Math.random() * 0.3 + 0.15;
        color = 'cyan';
      } else {
        fontSize = Math.random() * 3 + 9;
        speed = 0.3;
        opacity = Math.random() * 0.2 + 0.06;
        color = 'white';
      }

      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        fontSize,
        baseFontSize: fontSize,
        opacity,
        baseOpacity: opacity,
        color,
        symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.008,
        driftRadius: Math.random() * 25 + 8,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => { this.resize(); this.init(); });
    window.addEventListener('mousemove', (e) => { this.mouse.x = e.clientX; this.mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { this.mouse.x = -1000; this.mouse.y = -1000; });
    window.addEventListener('scroll', () => { this.scrollY = window.scrollY; }, { passive: true });
  }

  getColor(particle, alpha) {
    if (this.isDark) {
      if (particle.color === 'cyan') return `rgba(0, 212, 255, ${alpha})`;
      if (particle.color === 'purple') return `rgba(123, 47, 255, ${alpha})`;
      return `rgba(200, 200, 220, ${alpha})`;
    } else {
      if (particle.color === 'cyan') return `rgba(0, 140, 180, ${alpha})`;
      if (particle.color === 'purple') return `rgba(100, 40, 200, ${alpha})`;
      return `rgba(80, 80, 120, ${alpha})`;
    }
  }

  updateTheme(isDark) {
    this.isDark = isDark;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Organic drift motion
      p.angle += p.angleSpeed;
      const driftX = Math.cos(p.angle) * p.driftRadius * 0.008;
      const driftY = Math.sin(p.angle) * p.driftRadius * 0.008;
      p.x += p.vx + driftX;
      p.y += p.vy + driftY;
      p.rotation += p.rotationSpeed;

      // Wrap around edges
      if (p.x < -40) p.x = this.canvas.width + 40;
      if (p.x > this.canvas.width + 40) p.x = -40;
      if (p.y < -40) p.y = this.canvas.height + 40;
      if (p.y > this.canvas.height + 40) p.y = -40;

      // Mouse interaction — repulsion with elastic return
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        const pushForce = force * force * 2.5;
        p.vx += (dx / dist) * pushForce * 0.6;
        p.vy += (dy / dist) * pushForce * 0.6;
        p.fontSize = p.baseFontSize + force * 6;
        p.opacity = Math.min(p.baseOpacity + force * 0.5, 1);
        p.rotationSpeed += force * 0.003;
      } else {
        p.fontSize += (p.baseFontSize - p.fontSize) * 0.04;
        p.opacity += (p.baseOpacity - p.opacity) * 0.04;
        p.rotationSpeed += ((Math.random() - 0.5) * 0.008 - p.rotationSpeed) * 0.01;
      }

      // Dampen velocity
      p.vx *= 0.97;
      p.vy *= 0.97;

      // Draw code symbol
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.font = `${Math.round(p.fontSize)}px 'JetBrains Mono', monospace`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';

      if (p.fontSize > 12) {
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = this.getColor(p, 0.35);
      }

      this.ctx.fillStyle = this.getColor(p, p.opacity);
      this.ctx.fillText(p.symbol, 0, 0);
      this.ctx.restore();

      // Draw connections to nearby particles  
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const cdx = p.x - p2.x;
        const cdy = p.y - p2.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < 130) {
          let lineOpacity = (1 - cdist / 130) * 0.08;
          const midX = (p.x + p2.x) / 2;
          const midY = (p.y + p2.y) / 2;
          const mouseDist = Math.sqrt((midX - this.mouse.x) ** 2 + (midY - this.mouse.y) ** 2);
          if (mouseDist < this.mouse.radius) {
            lineOpacity += ((this.mouse.radius - mouseDist) / this.mouse.radius) * 0.15;
          }
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = this.isDark
            ? `rgba(0, 212, 255, ${lineOpacity})`
            : `rgba(0, 140, 180, ${lineOpacity})`;
          this.ctx.lineWidth = 0.4;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle field
const particleCanvas = document.getElementById('particle-canvas');
let particleField = null;
if (particleCanvas) {
  particleField = new CodeParticleField(particleCanvas);
}

// ─── Hero Hacker Glitch Effect ───
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

class HeroHackerGlitch {
  constructor() {
    this.letters = document.querySelectorAll('.hero-letter');
    this.heroName = document.getElementById('hero-name');
    this.overlay = document.getElementById('hero-intro-overlay');
    if (!this.letters.length || !this.heroName) return;

    // Store original characters
    this.originals = Array.from(this.letters).map(l => l.textContent);
    this.isGlitching = false;
    this.glitchIntervals = [];

    this.runEntryAnimation();
    this.bindHover();
  }

  runEntryAnimation() {
    // Start with scrambled letters
    this.letters.forEach((letter) => {
      letter.style.opacity = '1';
      letter.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    });

    // Overlay fade
    if (this.overlay) {
      this.overlay.style.opacity = '1';
      setTimeout(() => {
        this.overlay.style.opacity = '0';
        this.overlay.style.pointerEvents = 'none';
      }, 300);
    }

    // Resolve each letter one by one with scrambling
    this.letters.forEach((letter, i) => {
      const original = this.originals[i];
      let iterations = 0;
      const maxIterations = 8 + i * 4;

      const interval = setInterval(() => {
        if (iterations >= maxIterations) {
          letter.textContent = original;
          letter.classList.remove('hero-glitch');
          clearInterval(interval);
          return;
        }
        letter.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        letter.classList.add('hero-glitch');
        iterations++;
      }, 40);
    });
  }

  bindHover() {
    this.heroName.addEventListener('mouseenter', () => {
      if (this.isGlitching) return;
      this.isGlitching = true;
      this.startGlitch();
    });

    this.heroName.addEventListener('mouseleave', () => {
      this.stopGlitch();
    });
  }

  startGlitch() {
    // Scramble all letters rapidly
    this.glitchIntervals = this.letters.length ? [] : [];
    this.letters.forEach((letter, i) => {
      letter.classList.add('hero-glitch');
      const interval = setInterval(() => {
        letter.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }, 50);
      this.glitchIntervals.push(interval);
    });
  }

  stopGlitch() {
    // Resolve letters back to original with stagger
    this.glitchIntervals.forEach(interval => clearInterval(interval));
    this.glitchIntervals = [];

    this.letters.forEach((letter, i) => {
      const original = this.originals[i];
      let iterations = 0;
      const maxIterations = 6 + i * 3;

      const interval = setInterval(() => {
        if (iterations >= maxIterations) {
          letter.textContent = original;
          letter.classList.remove('hero-glitch');
          clearInterval(interval);
          if (i === this.letters.length - 1) {
            this.isGlitching = false;
          }
          return;
        }
        letter.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        iterations++;
      }, 35);
    });
  }
}

// ─── Code-Only Cursor (trail symbol, no circles) ───
class CodeCursor {
  constructor() {
    this.trail = document.getElementById('cursor-trail');
    // Hide the old circle elements entirely
    const outer = document.getElementById('cursor-outer');
    const inner = document.getElementById('cursor-inner');
    const glow = document.getElementById('cursor-glow');
    if (outer) outer.style.display = 'none';
    if (inner) inner.style.display = 'none';
    if (glow) glow.style.display = 'none';

    if (!this.trail) return;

    this.pos = { x: -100, y: -100 };
    this.trailPos = { x: -100, y: -100 };
    this.visible = false;
    this.trailSymbols = ['{  }', '( )', '=>', '</>', '[ ]', '/**/', '//', '!=', '&&', '++', '::'];
    this.currentTrailSymbol = 0;
    this.trailTimer = 0;
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
      if (!this.visible) {
        this.visible = true;
      }
    });

    document.addEventListener('mouseout', () => {
      this.visible = false;
      this.trail.style.opacity = '0';
    });
  }

  animate() {
    if (this.trail && this.visible) {
      this.trailPos.x += (this.pos.x - this.trailPos.x) * 0.12;
      this.trailPos.y += (this.pos.y - this.trailPos.y) * 0.12;
      this.trail.style.left = `${this.trailPos.x}px`;
      this.trail.style.top = `${this.trailPos.y}px`;
      this.trail.style.opacity = '1';

      this.trailTimer++;
      if (this.trailTimer % 120 === 0) {
        this.currentTrailSymbol = (this.currentTrailSymbol + 1) % this.trailSymbols.length;
        this.trail.textContent = this.trailSymbols[this.currentTrailSymbol];
        this.trail.classList.remove('trail-pop');
        void this.trail.offsetHeight;
        this.trail.classList.add('trail-pop');
      }
      if (!this.trail.textContent) {
        this.trail.textContent = this.trailSymbols[0];
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ─── Floating Parallax Elements ───
class ParallaxField {
  constructor() {
    this.elements = document.querySelectorAll('.parallax-float');
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.ticking = false;
    if (this.elements.length === 0) return;
    this.animate();
    window.addEventListener('scroll', () => {
      this.targetScrollY = window.scrollY;
    }, { passive: true });
  }

  animate() {
    // Smoothed parallax with lerp
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.08;
    this.elements.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.5;
      const rotation = parseFloat(el.dataset.rotate) || 0;
      const y = -(this.scrollY * speed);
      const r = this.scrollY * rotation;
      el.style.transform = `translateY(${y}px) rotate(${r}deg)`;
    });
    requestAnimationFrame(() => this.animate());
  }
}

new ParallaxField();

// ─── Magnetic Hover Effect ───
class MagneticElement {
  constructor(el) {
    this.el = el;
    this.strength = parseFloat(el.dataset.magnetic) || 0.3;
    this.bindEvents();
  }

  bindEvents() {
    this.el.addEventListener('mousemove', (e) => {
      const rect = this.el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * this.strength;
      const deltaY = (e.clientY - centerY) * this.strength;
      this.el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    this.el.addEventListener('mouseleave', () => {
      this.el.style.transform = '';
      this.el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { this.el.style.transition = ''; }, 500);
    });
  }
}

document.querySelectorAll('.btn, .social-link').forEach((el) => {
  new MagneticElement(el);
});

// ─── 3D Tilt on Cards ───
class TiltCard {
  constructor(el) {
    this.el = el;
    this.maxTilt = 6;
    this.bindEvents();
  }

  bindEvents() {
    this.el.addEventListener('mousemove', (e) => {
      const rect = this.el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * -this.maxTilt;
      const tiltY = (x - 0.5) * this.maxTilt;
      this.el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
    });

    this.el.addEventListener('mouseleave', () => {
      this.el.style.transform = '';
      this.el.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => { this.el.style.transition = ''; }, 600);
    });

    this.el.addEventListener('mouseenter', () => {
      this.el.style.transition = 'none';
    });
  }
}

document.querySelectorAll('.project-card, .skill-category, .terminal-card').forEach((el) => {
  new TiltCard(el);
});

// ─── Typing Effect ───
class TypeWriter {
  constructor(element, texts, speed = 80) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.deleteSpeed = 40;
    this.pauseTime = 2000;
    this.currentText = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.type();
  }

  type() {
    const current = this.texts[this.currentText];
    if (this.isDeleting) {
      this.element.textContent = current.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = current.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let delay = this.isDeleting ? this.deleteSpeed : this.speed;
    if (!this.isDeleting && this.charIndex === current.length) {
      delay = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.currentText = (this.currentText + 1) % this.texts.length;
      delay = 400;
    }
    setTimeout(() => this.type(), delay);
  }
}

const typedEl = document.getElementById('typed-title');
if (typedEl) {
  new TypeWriter(typedEl, [
    'Software Engineer',
    'AI/ML Enthusiast',
    'Competitive Programmer',
    'CS Undergraduate',
    'Full-Stack Developer',
  ]);
}

// ─── Light/Dark Theme Toggle with Water-Flow Ripple ───
class ThemeToggle {
  constructor() {
    this.toggleBtn = document.getElementById('theme-toggle');
    this.overlay = document.getElementById('theme-transition-overlay');
    if (!this.toggleBtn) return;

    this.isDark = true;
    this.animating = false;
    this.loadPreference();
    this.bindEvents();
  }

  loadPreference() {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light') {
      this.isDark = false;
      document.documentElement.setAttribute('data-theme', 'light');
      this.toggleBtn.classList.add('light-active');
      if (particleField) particleField.updateTheme(false);
    } else if (!saved && window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.isDark = false;
      document.documentElement.setAttribute('data-theme', 'light');
      this.toggleBtn.classList.add('light-active');
      if (particleField) particleField.updateTheme(false);
    }
  }

  bindEvents() {
    this.toggleBtn.addEventListener('click', (e) => {
      if (this.animating) return;
      this.animating = true;
      this.toggle(e);
    });
  }

  toggle(e) {
    const willBeDark = !this.isDark;
    const rect = this.toggleBtn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Calculate max distance from button to farthest corner
    const maxDist = Math.sqrt(
      Math.max(x, window.innerWidth - x) ** 2 +
      Math.max(y, window.innerHeight - y) ** 2
    );

    // Immediately switch the theme on the root so the page behind the overlay changes
    this.isDark = willBeDark;
    document.documentElement.setAttribute('data-theme', willBeDark ? 'dark' : 'light');
    this.toggleBtn.classList.toggle('light-active', !willBeDark);
    localStorage.setItem('portfolio-theme', willBeDark ? 'dark' : 'light');
    if (particleField) particleField.updateTheme(willBeDark);

    // The overlay captures the OLD theme look — set it to the previous theme color
    // and cover the entire screen, then shrink it away to reveal the new theme beneath
    this.overlay.style.background = willBeDark ? '#f0f0f5' : '#0a0a0f';
    this.overlay.style.clipPath = `circle(${maxDist}px at ${x}px ${y}px)`;
    this.overlay.style.display = 'block';
    this.overlay.style.opacity = '1';
    this.overlay.style.transition = 'none';

    // Force a paint so the overlay is visible at full coverage
    void this.overlay.offsetHeight;

    // Now shrink the overlay circle to 0, revealing the new theme underneath like a ripple
    requestAnimationFrame(() => {
      this.overlay.style.transition = 'clip-path 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      this.overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    });

    // Clean up after animation completes
    setTimeout(() => {
      this.overlay.style.display = 'none';
      this.overlay.style.transition = '';
      this.animating = false;
    }, 1300);
  }
}

new ThemeToggle();

// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── Active nav link based on scroll ───
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -60% 0px' }
);
sections.forEach((section) => sectionObserver.observe(section));

// ─── Enhanced Scroll reveal animations ───
const revealElements = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
revealElements.forEach((el) => revealObserver.observe(el));

// ─── Staggered skill tag reveal ───
const skillCategories = document.querySelectorAll('.skill-category');
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll('.skill-tag');
        tags.forEach((tag, i) => {
          tag.style.transitionDelay = `${i * 60}ms`;
          tag.classList.add('tag-revealed');
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
skillCategories.forEach((cat) => skillObserver.observe(cat));

// ─── Counter animation ───
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count, 10);
        const duration = 1500;
        const start = performance.now();
        const easeOutElastic = (t) => {
          if (t === 0 || t === 1) return t;
          return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
        };
        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          counter.textContent = Math.round(target * easeOutElastic(progress));
          if (progress < 1) requestAnimationFrame(tick);
          else counter.textContent = target;
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(counter);
      }
    });
  },
  { threshold: 0.5 }
);
counters.forEach((counter) => counterObserver.observe(counter));

// ─── Smooth scroll for nav links ───
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      mobileMenu?.classList.remove('open');
      mobileBtn?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ─── Mobile menu toggle ───
if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}

// ─── Section headers reveal ───
const sectionHeaders = document.querySelectorAll('.section-header');
const headerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('header-revealed');
        headerObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
sectionHeaders.forEach((header) => headerObserver.observe(header));

// ─── Mouse glow effect on sections ───
document.querySelectorAll('.section').forEach((section) => {
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    section.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    section.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});

// ─── Init cursor and hero ───
if (window.matchMedia('(pointer: fine)').matches) {
  new CodeCursor();
  document.body.classList.add('custom-cursor-active');
}

// Delay hero glitch intro slightly for smooth load
window.addEventListener('load', () => {
  setTimeout(() => new HeroHackerGlitch(), 200);
});

console.log('%c[ SHREY ] Portfolio loaded. ✦', 'color: #00d4ff; font-family: monospace; font-size: 14px;');
