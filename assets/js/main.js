  // ---------- LOADER ----------
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('done');
      // Trigger hero animations after loader
      setTimeout(() => {
        document.getElementById('hero-eyebrow').classList.add('visible');
        document.querySelectorAll('#hero-title .word-reveal').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), 200 + i * 80);
        });
        setTimeout(() => {
          document.getElementById('hero-sub').style.opacity = '0.85';
          document.getElementById('hero-sub').style.transform = 'translateY(0)';
          document.getElementById('hero-sub').style.transition = 'all .8s cubic-bezier(.16,1,.3,1)';
        }, 800);
        setTimeout(() => {
          document.getElementById('hero-actions').style.opacity = '1';
          document.getElementById('hero-actions').style.transform = 'translateY(0)';
          document.getElementById('hero-actions').style.transition = 'all .8s cubic-bezier(.16,1,.3,1)';
        }, 1000);
      }, 400);
    }, 1800);
  });

  // ---------- CUSTOM CURSOR ----------
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .dcard, .scard').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  // ---------- NAVBAR SCROLL ----------
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 80);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // ---------- SMOOTH SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });

  // ---------- INTERSECTION OBSERVER ----------
  const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -80px 0px' };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.reveal, .eyebrow').forEach(el => revealObserver.observe(el));

  // ---------- COUNTER ANIMATION ----------
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target);
          const duration = 2500;
          const startTime = performance.now();
          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            counter.textContent = Math.floor(ease * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.proof').forEach(el => counterObserver.observe(el));

  // ---------- HERO CANVAS (Constellation) ----------
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let width, height, particles = [];
  const PARTICLE_COUNT = 60;
  const CONNECTION_DIST = 120;
  const MOUSE_DIST = 180;

  function resizeCanvas() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(233,162,59,0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  let mouseCanvasX = 0, mouseCanvasY = 0;
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseCanvasX = e.clientX - rect.left;
    mouseCanvasY = e.clientY - rect.top;
  });

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, i) => {
      p.update();
      p.draw();
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(15,110,115,${0.15 * (1 - dist / CONNECTION_DIST)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      const mdx = p.x - mouseCanvasX;
      const mdy = p.y - mouseCanvasY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < MOUSE_DIST) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseCanvasX, mouseCanvasY);
        ctx.strokeStyle = `rgba(233,162,59,${0.2 * (1 - mDist / MOUSE_DIST)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // ---------- GLOBE PARALLAX ----------
  const globe = document.querySelector('.globe');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight && globe) {
      globe.style.transform = `translateY(${scrolled * 0.1}px) rotate(${scrolled * 0.012}deg)`;
    }
  }, {passive:true});

  // ---------- COPY EMAIL ----------
  const emailLink = document.getElementById('copy-email');
  if (emailLink) {
    emailLink.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('contact@meridiangeo.sn').then(() => {
        emailLink.classList.add('copied');
        setTimeout(() => emailLink.classList.remove('copied'), 2000);
      });
    });
  }

  // ---------- 3D TILT EFFECT ----------
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const glow = card.querySelector('.glow');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      if (glow) {
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
