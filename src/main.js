import './style.css';

/* ══════════════════════════════════════════════════════════
   MAIN.JS — Interactive particle canvas, custom cursor,
   parallax, magnetic effects, scroll animations
   ══════════════════════════════════════════════════════════ */

// ─── Full-Page Interactive Particle Canvas ───
class InteractiveParticleField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: 200 };
    this.scrollY = 0;
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
    const count = Math.min(Math.floor(area / 6000), 200);

    for (let i = 0; i < count; i++) {
      const type = Math.random();
      let radius, speed, opacity, color;

      if (type < 0.15) {
        // Large accent particles
        radius = Math.random() * 2.5 + 1.5;
        speed = 0.15;
        opacity = Math.random() * 0.5 + 0.3;
        color = Math.random() > 0.5 ? 'cyan' : 'purple';
      } else if (type < 0.4) {
        // Medium particles
        radius = Math.random() * 1.5 + 0.8;
        speed = 0.25;
        opacity = Math.random() * 0.4 + 0.2;
        color = 'cyan';
      } else {
        // Small ambient particles
        radius = Math.random() * 0.8 + 0.3;
        speed = 0.35;
        opacity = Math.random() * 0.25 + 0.08;
        color = 'white';
      }

      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        baseX: Math.random() * this.canvas.width,
        baseY: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius,
        baseRadius: radius,
        opacity,
        baseOpacity: opacity,
        color,
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.01,
        driftRadius: Math.random() * 30 + 10,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.init();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    }, { passive: true });
  }

  getColor(particle, alpha) {
    if (particle.color === 'cyan') {
      return `rgba(0, 212, 255, ${alpha})`;
    } else if (particle.color === 'purple') {
      return `rgba(123, 47, 255, ${alpha})`;
    }
    return `rgba(200, 200, 220, ${alpha})`;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Organic drift motion
      p.angle += p.angleSpeed;
      const driftX = Math.cos(p.angle) * p.driftRadius * 0.01;
      const driftY = Math.sin(p.angle) * p.driftRadius * 0.01;

      p.x += p.vx + driftX;
      p.y += p.vy + driftY;

      // Wrap around edges
      if (p.x < -20) p.x = this.canvas.width + 20;
      if (p.x > this.canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = this.canvas.height + 20;
      if (p.y > this.canvas.height + 20) p.y = -20;

      // Mouse interaction — strong repel with elastic return
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        const pushForce = force * force * 3; // Quadratic falloff for stronger near-effect
        p.vx += (dx / dist) * pushForce * 0.8;
        p.vy += (dy / dist) * pushForce * 0.8;

        // Particles grow and brighten near cursor
        p.radius = p.baseRadius + force * 2;
        p.opacity = Math.min(p.baseOpacity + force * 0.5, 1);
      } else {
        // Gradually return to base size/opacity
        p.radius += (p.baseRadius - p.radius) * 0.05;
        p.opacity += (p.baseOpacity - p.opacity) * 0.05;
      }

      // Dampen velocity (elastic return)
      p.vx *= 0.96;
      p.vy *= 0.96;

      // Draw particle with glow
      this.ctx.save();
      if (p.radius > 1.2) {
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = this.getColor(p, 0.4);
      }
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(p.radius, 0.1), 0, Math.PI * 2);
      this.ctx.fillStyle = this.getColor(p, p.opacity);
      this.ctx.fill();
      this.ctx.restore();

      // Draw connections to nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const cdx = p.x - p2.x;
        const cdy = p.y - p2.y;
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

        if (cdist < 120) {
          let lineOpacity = (1 - cdist / 120) * 0.12;

          // Lines glow brighter near cursor
          const midX = (p.x + p2.x) / 2;
          const midY = (p.y + p2.y) / 2;
          const mouseDist = Math.sqrt(
            (midX - this.mouse.x) ** 2 + (midY - this.mouse.y) ** 2
          );
          if (mouseDist < this.mouse.radius) {
            const boost = (this.mouse.radius - mouseDist) / this.mouse.radius;
            lineOpacity += boost * 0.2;
          }

          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(0, 212, 255, ${lineOpacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize full-page particle canvas
const particleCanvas = document.getElementById('particle-canvas');
if (particleCanvas) {
  new InteractiveParticleField(particleCanvas);
}

// ─── Custom Cursor ───
class CustomCursor {
  constructor() {
    this.outer = document.getElementById('cursor-outer');
    this.inner = document.getElementById('cursor-inner');
    this.glow = document.getElementById('cursor-glow');
    if (!this.outer || !this.inner) return;

    this.pos = { x: -100, y: -100 };
    this.outerPos = { x: -100, y: -100 };
    this.glowPos = { x: -100, y: -100 };
    this.visible = false;
    this.hovered = false;
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.pos.x = e.clientX;
      this.pos.y = e.clientY;
      if (!this.visible) {
        this.visible = true;
        this.outer.style.opacity = '1';
        this.inner.style.opacity = '1';
        if (this.glow) this.glow.style.opacity = '1';
      }
    });

    document.addEventListener('mouseout', () => {
      this.visible = false;
      this.outer.style.opacity = '0';
      this.inner.style.opacity = '0';
      if (this.glow) this.glow.style.opacity = '0';
    });

    // Scale up on interactive elements
    const interactives = document.querySelectorAll(
      'a, button, .skill-tag, .project-card, .timeline-content, .social-link'
    );
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        this.hovered = true;
        this.outer.classList.add('cursor-hover');
        this.inner.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        this.hovered = false;
        this.outer.classList.remove('cursor-hover');
        this.inner.classList.remove('cursor-hover');
      });
    });
  }

  animate() {
    // Inner dot follows exactly
    this.inner.style.left = `${this.pos.x}px`;
    this.inner.style.top = `${this.pos.y}px`;

    // Outer ring follows with lag (lerp)
    this.outerPos.x += (this.pos.x - this.outerPos.x) * 0.15;
    this.outerPos.y += (this.pos.y - this.outerPos.y) * 0.15;
    this.outer.style.left = `${this.outerPos.x}px`;
    this.outer.style.top = `${this.outerPos.y}px`;

    // Glow follows with even more lag
    if (this.glow) {
      this.glowPos.x += (this.pos.x - this.glowPos.x) * 0.08;
      this.glowPos.y += (this.pos.y - this.glowPos.y) * 0.08;
      this.glow.style.left = `${this.glowPos.x}px`;
      this.glow.style.top = `${this.glowPos.y}px`;
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Only init custom cursor on non-touch devices
if (window.matchMedia('(pointer: fine)').matches) {
  new CustomCursor();
  document.body.classList.add('custom-cursor-active');
}

// ─── Floating Parallax Elements ───
class ParallaxField {
  constructor() {
    this.elements = document.querySelectorAll('.parallax-float');
    this.scrollY = 0;
    this.ticking = false;

    if (this.elements.length === 0) return;

    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }

  update() {
    this.elements.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.5;
      const rotation = parseFloat(el.dataset.rotate) || 0;
      const y = -(this.scrollY * speed);
      const r = this.scrollY * rotation;
      el.style.transform = `translateY(${y}px) rotate(${r}deg)`;
    });
  }
}

new ParallaxField();

// ─── Magnetic Hover Effect on Buttons ───
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
      setTimeout(() => {
        this.el.style.transition = '';
      }, 500);
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
    this.maxTilt = 8;
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
      setTimeout(() => {
        this.el.style.transition = '';
      }, 600);
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
    'AI/ML Engineer',
    'Full-Stack Developer',
    'Deep Learning Researcher',
    'System Architect',
  ]);
}

// ─── Navbar scroll effect ───
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = scrollY;
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

// ─── Counter animation with overshoot ───
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
          const eased = easeOutElastic(progress);
          counter.textContent = Math.round(target * eased);

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            counter.textContent = target;
          }
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
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu if open
      mobileMenu?.classList.remove('open');
      mobileBtn?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ─── Mobile menu toggle ───
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

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

sectionHeaders.forEach((header) => {
  headerObserver.observe(header);
});

// ─── Mouse glow effect on sections ───
document.querySelectorAll('.section').forEach((section) => {
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    section.style.setProperty('--mouse-x', `${x}px`);
    section.style.setProperty('--mouse-y', `${y}px`);
  });
});

console.log('%c[ SHREY ] Portfolio loaded. ✦', 'color: #00d4ff; font-family: monospace; font-size: 14px;');
