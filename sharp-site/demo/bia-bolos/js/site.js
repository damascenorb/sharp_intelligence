(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NUM = '5511900000000';

  // menu no celular
  const nav = $('#top'), burger = $('.burger');
  const closeMenu = (focus) => { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menu'); document.body.style.overflow = ''; if (focus) burger.focus(); };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('.nav__links a').forEach((a) => a.addEventListener('click', () => closeMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu(true); });
  matchMedia('(min-width:1001px)').addEventListener('change', (m) => { if (m.matches) closeMenu(false); });

  // filtro do catálogo
  const btns = $$('.filters button'), cards = $$('#grid .card');
  btns.forEach((b) => b.addEventListener('click', () => {
    btns.forEach((x) => { const on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on); });
    cards.forEach((c) => { c.hidden = b.dataset.f !== 'todos' && c.dataset.cat !== b.dataset.f; });
  }));

  // galeria: foto ampliada
  const lb = $('#lb'), lbimg = $('#lbimg');
  $$('.mosaic button').forEach((b) => b.addEventListener('click', () => {
    lbimg.src = b.dataset.full; lbimg.alt = b.dataset.alt;
    if (lb.showModal) lb.showModal(); else window.open(b.dataset.full, '_blank', 'noopener');
  }));
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });

  // formulário -> WhatsApp
  const form = $('#pedido');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim(), err = $('#err'), st = $('.status', form);
    err.hidden = !!nome;
    form.nome.setAttribute('aria-invalid', nome ? 'false' : 'true');
    if (!nome) { form.nome.focus(); return; }
    const dia = form.dia.value && form.dia.value.split('-').reverse().join('/');
    const txt = ['Olá, Bia! Quero fazer uma encomenda.', `Meu nome é ${nome}.`, `Quero: ${form.tipo.value}.`, dia && `Data da festa: ${dia}.`, form.n.value && `Para ${form.n.value} pessoas.`].filter(Boolean).join('\n');
    const href = `https://wa.me/${NUM}?text=${encodeURIComponent(txt)}`;
    st.innerHTML = `Abrindo o WhatsApp com o seu pedido. Se não abrir, <a href="${href}" target="_blank" rel="noopener">toque aqui</a>.`;
    st.hidden = false;
    window.open(href, '_blank', 'noopener');
  });

  // entrada suave dos blocos
  const rv = $$('.sechead, .card, .box, .fest, .steps li, .mosaic li, .story__tx, .contact__tx, .form').map((el) => (el.classList.add('rv'), el));
  if (!still && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
    rv.forEach((el) => io.observe(el));
  } else rv.forEach((el) => el.classList.add('in'));
})();
