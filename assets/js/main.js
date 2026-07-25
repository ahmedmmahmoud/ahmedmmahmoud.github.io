// ============================================================
// Ahmed Mahmoud — Portfolio / Resume Site — main.js
// Vanilla JS only. No jQuery, no unused plugin weight.
// ============================================================
(function(){
  "use strict";

  document.documentElement.classList.add('js');

  // Small helper: run a feature in isolation so one failure never
  // blocks the rest of the page's scripts (fonts blocked, storage
  // disabled, file:// restrictions, ad blockers, etc. all land here).
  function safe(label, fn){
    try{ fn(); }
    catch(err){ console.warn('[site] skipped "' + label + '":', err); }
  }

  // Storage helpers that quietly no-op instead of throwing
  // (Chrome blocks localStorage on file:// pages, for example).
  const store = {
    get(key){ try{ return localStorage.getItem(key); } catch(e){ return null; } },
    set(key, val){ try{ localStorage.setItem(key, val); } catch(e){ /* ignore */ } }
  };

  /* ---------- Theme (dark / light) ---------- */
  const THEME_KEY = 'am-theme';
  const root = document.documentElement;
  safe('theme init', function(){
    const stored = store.get(THEME_KEY);
    if(stored){ root.setAttribute('data-theme', stored); }
  });

  function currentTheme(){
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }
  function setTheme(t){
    root.setAttribute('data-theme', t);
    store.set(THEME_KEY, t);
    document.querySelectorAll('.theme-toggle i').forEach(i=>{
      i.className = t === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    });
  }
  safe('theme toggle buttons', function(){
    document.querySelectorAll('.theme-toggle').forEach(btn=>{
      btn.addEventListener('click', ()=> setTheme(currentTheme() === 'light' ? 'dark' : 'light'));
    });
    setTheme(currentTheme());
  });

  /* ---------- Loader ---------- */
  // Belt and suspenders: hide on window load, but also force it away
  // on a timer so a slow font/icon CDN can never leave it stuck.
  function hideLoader(){
    const loader = document.getElementById('loader');
    if(loader){ loader.classList.add('hidden'); }
  }
  window.addEventListener('load', ()=> setTimeout(hideLoader, 250));
  setTimeout(hideLoader, 2500);

  /* ---------- Active nav link on scroll ---------- */
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.nav-links a, .mobile-menu a'));
  function updateActiveNav(){
    let current = sections[0] && sections[0].id;
    const offset = 120;
    sections.forEach(sec=>{
      if(window.scrollY + offset >= sec.offsetTop){ current = sec.id; }
    });
    navLinks.forEach(a=>{
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- Scroll progress bar ---------- */
  safe('scroll progress + nav', function(){
    const progress = document.getElementById('scroll-progress');
    function onScroll(){
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      if(progress) progress.style.width = scrolled + '%';

      const nav = document.querySelector('header.nav');
      if(nav){ nav.classList.toggle('scrolled', h.scrollTop > 30); }

      const backTop = document.getElementById('back-top');
      if(backTop){ backTop.classList.toggle('show', h.scrollTop > 500); }

      safe('active nav update', updateActiveNav);
    }
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  /* ---------- Mobile menu ---------- */
  safe('mobile menu', function(){
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    function closeMenu(){
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
    if(hamburger && mobileMenu){
      hamburger.addEventListener('click', ()=>{
        const open = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
      mobileMenu.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeMenu));
    }
  });

  /* ---------- Smooth scroll with header offset ---------- */
  safe('smooth scroll links', function(){
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', function(e){
        const id = this.getAttribute('href');
        if(id.length < 2) return;
        const target = document.querySelector(id);
        if(!target) return;
        e.preventDefault();
        const navEl = document.querySelector('header.nav');
        const navH = navEl ? navEl.offsetHeight : 76;
        const top = target.getBoundingClientRect().top + window.scrollY - (navH - 8);
        window.scrollTo({ top, behavior: 'smooth' });
        history.pushState(null, '', id);
      });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  // If this feature can't run for any reason, show everything immediately
  // instead of leaving sections stuck invisible.
  safe('reveal on scroll', function(){
    const revealEls = document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)){
      revealEls.forEach(el=> el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el, i)=>{
      el.style.setProperty('--i', i % 6);
      io.observe(el);
    });
  });
  // Hard safety net: whatever happened above, make sure content is
  // visible no more than 3 seconds after the page starts.
  setTimeout(function(){
    document.querySelectorAll('.reveal:not(.in)').forEach(el=> el.classList.add('in'));
  }, 3000);

  /* ---------- Animated counters ---------- */
  safe('animated counters', function(){
    const counters = document.querySelectorAll('[data-count]');
    const counterIO = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();
        function tick(now){
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (target % 1 !== 0 ? val.toFixed(1) : Math.round(val)) + suffix;
          if(p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el=> counterIO.observe(el));
  });

  /* ---------- Animated skill bars ---------- */
  safe('skill bars', function(){
    const bars = document.querySelectorAll('.bar-fill');
    const barIO = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.style.width = entry.target.dataset.width;
          barIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(b=> barIO.observe(b));
  });

  /* ---------- Typewriter hero roles ---------- */
  safe('typewriter', function(){
    const typedEl = document.getElementById('typed');
    const roles = [
      'After-Sales Service Manager',
      'Service Operations Leader',
      'Warranty & Escalation Specialist',
      'Customer Success Advocate'
    ];
    if(!typedEl) return;
    let ri = 0, ci = 0, deleting = false;
    function loopType(){
      const word = roles[ri];
      if(!deleting){
        ci++;
        typedEl.textContent = word.slice(0, ci);
        if(ci === word.length){ deleting = true; setTimeout(loopType, 1600); return; }
      } else {
        ci--;
        typedEl.textContent = word.slice(0, ci);
        if(ci === 0){ deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(loopType, deleting ? 35 : 65);
    }
    loopType();
  });

  /* ---------- Hero particle network canvas ---------- */
  safe('hero particle canvas', function(){
    const canvas = document.getElementById('hero-canvas');
    if(!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    let w, h, points = [];
    function resize(){
      const wrap = canvas.parentElement;
      w = canvas.width = wrap.clientWidth;
      h = canvas.height = wrap.clientHeight;
      const count = Math.min(70, Math.floor((w * h) / 18000));
      points = Array.from({ length: count }, ()=> ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - .5) * .35,
        vy: (Math.random() - .5) * .35
      }));
    }
    function draw(){
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(14,165,233,.7)';
      points.forEach(p=>{
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > w) p.vx *= -1;
        if(p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      });
      for(let i = 0; i < points.length; i++){
        for(let j = i + 1; j < points.length; j++){
          const dx = points[i].x - points[j].x, dy = points[i].y - points[j].y;
          const dist = Math.hypot(dx, dy);
          if(dist < 120){
            ctx.strokeStyle = 'rgba(14,165,233,' + (1 - dist / 120) * .25 + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    resize();
    draw();
    window.addEventListener('resize', resize);
  });

  /* ---------- Awards carousel dots (mobile) ---------- */
  safe('awards dots', function(){
    const track = document.querySelector('.awards-track');
    const dotsWrap = document.getElementById('award-dots');
    if(track && dotsWrap && window.innerWidth < 721){
      const cards = Array.from(track.children);
      cards.forEach((_, i)=>{
        const dot = document.createElement('button');
        dot.className = 'award-dot';
        dot.addEventListener('click', ()=> cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center' }));
        dotsWrap.appendChild(dot);
      });
    }
  });

  /* ---------- Contact form lazy embed ---------- */
  safe('contact form embed', function(){
    const formToggle = document.getElementById('load-form-btn');
    const formWrap = document.getElementById('form-frame-wrap');
    if(formToggle && formWrap){
      formToggle.addEventListener('click', function(){
        const src = formWrap.dataset.src;
        if(src && !formWrap.querySelector('iframe')){
          const iframe = document.createElement('iframe');
          iframe.src = src;
          iframe.title = 'Contact form';
          iframe.loading = 'lazy';
          formWrap.appendChild(iframe);
        }
        formWrap.style.display = 'block';
        formToggle.style.display = 'none';
      });
    }
  });

  /* ---------- Footer year ---------- */
  safe('footer year', function(){
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
  });

})();
