/* Cultuñol interactions. No inline scripts or style attributes in markup:
   motion is driven through classes and CSS custom properties set via CSSOM. */
(() => {
  const root = document.documentElement;
  root.classList.remove('no-js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Nav: hairline once scrolled.
  const nav = document.querySelector('[data-nav]');
  const onScrollNav = () => nav && nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  // Mobile menu.
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    const set = open => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
    };
    toggle.addEventListener('click', () => set(menu.hidden));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', () => set(false));
  }

  // Reveal on scroll, staggered within a row.
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window && !reduce.matches) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    reveals.forEach(el => {
      const siblings = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
      const i = siblings.indexOf(el);
      if (i > 0 && !el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${Math.min(i, 4) * 0.1}s`);
      io.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add('is-in'));
  }

  // Words that light up as they pass through the viewport.
  const lit = [...document.querySelectorAll('[data-lit]')];
  const wrapWords = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const span = document.createElement('span');
          span.className = 'w';
          span.textContent = part;
          frag.appendChild(span);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        wrapWords(child);
      }
    });
  };
  lit.forEach(wrapWords);

  // Scroll-linked scenes: zoom frames and lit words.
  const zooms = [...document.querySelectorAll('[data-zoom]')];
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    zooms.forEach(section => {
      const frame = section.querySelector('.zoom-frame');
      const r = section.getBoundingClientRect();
      const span = Math.max(1, r.height - vh * 0.8);
      const p = Math.min(1, Math.max(0, -r.top / span));
      frame.style.setProperty('--p', reduce.matches ? 0 : p.toFixed(4));
    });
    lit.forEach(block => {
      const words = block.querySelectorAll('.w');
      const r = block.getBoundingClientRect();
      const start = vh * 0.85;
      const p = reduce.matches ? 1 : Math.min(1, Math.max(0, (start - r.top) / (vh * 0.35 + r.height * 0.4)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
      if (n >= words.length) block.classList.add('done');
    });
  };
  const schedule = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  if (zooms.length || lit.length) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  }

  // Gentle 3D tilt on course cards (pointer devices only).
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce.matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--ry', `${(x * 7).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      });
    });
  }

  // Photo to dog portrait toggle (tap on touch, hover on desktop).
  document.querySelectorAll('[data-flip]').forEach(btn => {
    btn.addEventListener('click', () => btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true')));
  });

  // Portraits peek at their dog version once, the first time the team comes into view.
  const peek = document.querySelector('[data-peek]');
  if (peek && 'IntersectionObserver' in window && !reduce.matches) {
    const po = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      po.disconnect();
      peek.querySelectorAll('[data-flip]').forEach((flip, i) => {
        setTimeout(() => {
          flip.classList.add('peek');
          flip.addEventListener('animationend', () => flip.classList.remove('peek'), { once: true });
        }, 900 + i * 450);
      });
    }, { threshold: 0.55 });
    po.observe(peek);
  }

  // "Coming soon" dialog.
  const soon = document.getElementById('soon');
  document.querySelectorAll('[data-soon]').forEach(btn => {
    btn.addEventListener('click', () => soon && soon.showModal && soon.showModal());
  });
  if (soon) soon.addEventListener('click', e => { if (e.target === soon) soon.close(); });
})();

// Subscribe form: localised country names, light validation, pending notice until it is wired up.
(() => {
  const select = document.querySelector('[data-countries]');
  if (select && window.Intl && Intl.DisplayNames) {
    try {
      const names = new Intl.DisplayNames([select.dataset.locale || 'es'], { type: 'region' });
      const collator = new Intl.Collator(select.dataset.locale || 'es');
      const opts = [...select.options];
      opts.forEach(o => { o.textContent = names.of(o.value) || o.value; });
      opts.sort((a, b) => collator.compare(a.textContent, b.textContent)).forEach(o => select.appendChild(o));
    } catch (e) { /* keep ISO codes */ }
  }
  document.querySelectorAll('[data-subscribe]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('[required]').forEach(input => {
        const bad = !input.value.trim() || (input.type === 'email' && !input.checkValidity());
        input.setAttribute('aria-invalid', String(bad));
        if (bad && ok) { input.focus(); ok = false; }
      });
      if (ok) form.querySelector('[data-subscribe-note]').hidden = false;
    });
  });

  // Joke reveal on the "not subscribed yet" page.
  document.querySelectorAll('[data-joke]').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = document.getElementById(btn.getAttribute('aria-controls'));
      answer.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      btn.hidden = true;
    });
  });
})();
