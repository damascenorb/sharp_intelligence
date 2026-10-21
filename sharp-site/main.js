(() => {
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ano = document.getElementById('ano'); if (ano) ano.textContent = new Date().getFullYear();

  const burger = document.querySelector('.burger'), sheet = document.getElementById('sheet');
  const setSheet = (o) => { sheet.hidden = !o; burger.setAttribute('aria-expanded', String(o)); burger.textContent = o ? 'Fechar' : 'Menu'; document.body.style.overflow = o ? 'hidden' : ''; };
  burger.addEventListener('click', () => setSheet(sheet.hidden));
  sheet.addEventListener('click', (e) => { if (e.target.closest('a')) setSheet(false); });

  const dd = document.querySelector('.dd'), ddBtn = dd.querySelector('button'), mega = document.getElementById('mega');
  let t;
  const setMega = (o) => { clearTimeout(t); mega.hidden = !o; dd.classList.toggle('open', o); ddBtn.setAttribute('aria-expanded', String(o)); };
  const later = () => { clearTimeout(t); t = setTimeout(() => setMega(false), 260); };
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  // mouse com hover: o clique do mouse só abre; teclado e toque alternam
  ddBtn.addEventListener('click', (e) => setMega(hover && e.detail > 0 ? true : mega.hidden));
  if (hover) { dd.addEventListener('mouseenter', () => setMega(true)); dd.addEventListener('mouseleave', later); }
  dd.addEventListener('focusout', (e) => { if (!dd.contains(e.relatedTarget)) later(); });
  document.addEventListener('click', (e) => { if (!dd.contains(e.target)) setMega(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { setMega(false); if (!sheet.hidden) { setSheet(false); burger.focus(); } } });

  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv').forEach((el, i) => { el.style.setProperty('--i', String(i % 3)); io.observe(el); });

  const tl = document.querySelector('.tl');
  if (tl) {
    const items = [...tl.querySelectorAll('.tl-i')];
    const upd = () => { const r = tl.getBoundingClientRect(), mid = innerHeight * .55; tl.style.setProperty('--p', Math.min(1, Math.max(0, (mid - r.top) / r.height))); items.forEach((i) => i.classList.toggle('on', i.getBoundingClientRect().top < mid)); };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  const tilt = document.querySelector('.tilt');
  if (tilt && !reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const scr = tilt.querySelector('.screen');
    tilt.addEventListener('pointermove', (e) => { const r = tilt.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; scr.style.setProperty('--ry', (-8 + x * 10) + 'deg'); scr.style.setProperty('--rx', (3 - y * 8) + 'deg'); });
    tilt.addEventListener('pointerleave', () => { scr.style.setProperty('--ry', '-8deg'); scr.style.setProperty('--rx', '3deg'); });
  }

  const form = document.getElementById('form');
  if (form) {
    const err = document.getElementById('f-err');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (n) => form.elements[n].value.trim();
      if (!v('nome') || !v('problema')) { err.hidden = false; return; }
      err.hidden = true;
      const msg = ['Olá, Sharp! Quero apresentar meu desafio.', '', `Nome: ${v('nome')}`, v('empresa') ? `Empresa e segmento: ${v('empresa')}` : null, `Problema: ${v('problema')}`, v('resultado') ? `O que quero melhorar: ${v('resultado')}` : null].filter((l) => l !== null).join('\n');
      window.open('https://wa.me/5511993918460?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }
})();
