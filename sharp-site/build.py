#!/usr/bin/env python3
"""Gera as páginas estáticas a partir de src/pages. Uso: python3 build.py"""
import json, re
from pathlib import Path
from urllib.parse import quote
from src.fragments import ARROW, CHECK, ICON, SCREEN, WA_NUM, WA_TXT, EMAIL, INSTA

ROOT = Path(__file__).parent
WA = f'https://wa.me/{WA_NUM}?text=' + quote(WA_TXT)
PAGES = [
 ('index', 'Sharp Intelligence | Você tem um problema. Nós desenvolvemos a solução.', 'Sites, sistemas online, automações com IA e dashboards sob medida para MEIs e pequenas empresas. Atendimento em todo o Brasil.', ''),
 ('solucoes', 'Soluções | Sharp Intelligence', 'Sharp Web, Systems, Automation & AI e Data: sites, sistemas online, automações e dashboards sob medida para pequenos negócios.', 'solucoes'),
 ('como-trabalhamos', 'Como trabalhamos | Sharp Intelligence', 'Diagnóstico, viabilidade, proposta, desenvolvimento, testes e suporte. Veja o processo e as duas formas de contratação.', 'como-trabalhamos'),
 ('projetos', 'Projetos | Sharp Intelligence', 'Um gargalo operacional real que virou uma ferramenta simples, e pontos de partida comuns para o seu negócio.', 'projetos'),
 ('sobre', 'Sobre a Sharp | Sharp Intelligence', 'Tecnologia acessível, aplicada ao seu negócio. Soluções digitais sob medida para MEIs e pequenas empresas, em todo o Brasil.', 'sobre'),
 ('contato', 'Contato | Sharp Intelligence', 'Apresente seu desafio pelo WhatsApp (11) 99391-8460 ou por e-mail. Atendimento em todo o Brasil, 100% online.', 'contato'),
 ('privacidade', 'Política de privacidade | Sharp Intelligence', 'Como a Sharp Intelligence trata os seus dados, de acordo com a LGPD.', ''),
 ('termos', 'Termos de uso | Sharp Intelligence', 'As regras para usar o site da Sharp Intelligence.', ''),
]
NAV = [('como-trabalhamos', 'Como trabalhamos'), ('projetos', 'Projetos'), ('sobre', 'Sobre'), ('contato', 'Contato')]
SOL = [('web', 'Sharp Web', 'Sites e páginas comerciais', 'web'), ('systems', 'Sharp Systems', 'Sistemas online sob medida', 'systems'), ('automation', 'Sharp Automation &amp; AI', 'Automação e inteligência artificial', 'auto'), ('data', 'Sharp Data', 'Dashboards e relatórios', 'data')]
CHEV = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2 4 4 4 4-4" fill="none" stroke="currentColor" stroke-width="2"/></svg>'

CTA = f'''<section class="cta"><div class="wrap rv"><h2>Apresente seu desafio.</h2><p>Conte o que está travando o seu negócio. A conversa segue no WhatsApp, com a sua mensagem já pronta.</p>
<div class="cta-row"><a class="btn btn-y" href="contato.html#desafio">Apresentar meu desafio {ARROW}</a><a class="btn btn-o" href="{WA}" target="_blank" rel="noopener">Chamar no WhatsApp</a></div></div></section>'''

JSONLD = json.dumps({"@context": "https://schema.org", "@type": "ProfessionalService", "name": "Sharp Intelligence", "description": "Sites, sistemas online, automações com IA e dashboards sob medida para MEIs e pequenas empresas.", "telephone": "+55-11-99391-8460", "email": EMAIL, "areaServed": {"@type": "Country", "name": "Brasil"}, "sameAs": [INSTA], "slogan": "Tecnologia aplicada aos negócios"}, ensure_ascii=False)

def layout(name, title, desc, cur, body):
    attr = ' aria-current="page"'
    nav = ''.join(f'<a href="{n}.html"{attr if n == cur else ""}>{t}</a>' for n, t in NAV)
    mega = ''.join(f'<a href="solucoes.html#{i}">{ICON[ic]}<b>{t}</b><span>{d}</span></a>' for i, t, d, ic in SOL)
    sheet = '<a href="solucoes.html">Soluções</a>' + ''.join(f'<a href="{n}.html">{t}</a>' for n, t in NAV) + '<a href="privacidade.html" style="font-size:1.1rem;font-weight:500">Privacidade e termos</a>'
    ld = f'<script type="application/ld+json">{JSONLD}</script>' if name == 'index' else ''
    sol_links = ''.join(f'<a href="solucoes.html#{i}">{t}</a>' for i, t, d, ic in SOL) + '<a href="solucoes.html#comunicacao">Comunicação</a>'
    return f'''<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#050b1e">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Sharp Intelligence">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}">
<link rel="icon" type="image/png" href="assets/sharp-mark-dark.png">
<link rel="preload" href="assets/fonts/albert-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="styles.css">
{ld}
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="hd"><div class="wrap hd-in">
  <a class="brand" href="index.html" aria-label="Sharp Intelligence, início"><img src="assets/sharp-mark.png" alt="" width="29" height="42"><span>Sharp</span></a>
  <nav class="nav" aria-label="Principal">
    <div class="dd"><button type="button" aria-expanded="false" aria-controls="mega">Soluções {CHEV}</button><div class="mega" id="mega" hidden>{mega}<a class="all" href="solucoes.html">Ver todas as soluções</a></div></div>
    {nav}
  </nav>
  <a class="btn btn-y" href="contato.html#desafio">Apresente seu desafio</a>
  <button class="burger" type="button" aria-expanded="false" aria-controls="sheet">Menu</button>
</div></header>
<nav class="sheet" id="sheet" aria-label="Menu" hidden>{sheet}</nav>
{body}
<footer class="ft"><div class="wrap">
  <div class="ft-grid">
    <div><a class="brand" href="index.html" style="padding:0"><img src="assets/sharp-mark.png" alt="" width="29" height="42"><span>Sharp Intelligence</span></a><p style="margin-top:14px;max-width:30ch">Tecnologia aplicada aos negócios. Você tem um problema. Nós desenvolvemos a solução.</p></div>
    <div><h2>Soluções</h2>{sol_links}</div>
    <div><h2>Empresa</h2><a href="como-trabalhamos.html">Como trabalhamos</a><a href="projetos.html">Projetos</a><a href="sobre.html">Sobre</a><a href="contato.html">Contato</a></div>
    <div><h2>Legal</h2><a href="privacidade.html">Privacidade</a><a href="termos.html">Termos de uso</a></div>
    <div><h2>Fale com a Sharp</h2><a href="{WA}" target="_blank" rel="noopener">WhatsApp (11) 99391-8460</a><a href="mailto:{EMAIL}">{EMAIL}</a><a href="{INSTA}" target="_blank" rel="noopener">Instagram @sharpintelligence</a><p>Atendimento em todo o Brasil, 100% online.</p></div>
  </div>
  <div class="ft-end"><span>© <span id="ano">2026</span> Sharp Intelligence</span><span>As telas do site são exemplos ilustrativos.</span></div>
</div></footer>
<a class="wa" href="{WA}" target="_blank" rel="noopener" aria-label="Falar com a Sharp pelo WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.2 4.23-9.42 9.43-9.42 2.52 0 4.88.98 6.66 2.76a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.42 9.42m8.02-17.44A11.27 11.27 0 0 0 12.05.75C5.8.75.72 5.83.72 12.08c0 2 .52 3.95 1.52 5.66L.62 23.62l6.01-1.58a11.3 11.3 0 0 0 5.42 1.38h.01c6.25 0 11.33-5.08 11.33-11.33 0-3.03-1.18-5.87-3.32-8.01"/></svg></a>
<script src="main.js" defer></script>
</body>
</html>
'''

ART = '<div class="art" aria-hidden="true"><img src="assets/quebre-wide.jpg" alt="" width="1024" height="559" loading="eager"></div>'
MARK = ''

def render(b):
    b = b.replace('<section class="phero"><div class="wrap">', '<section class="phero">' + ART + MARK + '<div class="wrap">').replace('{{ART}}', ART)
    b = b.replace('{{CTA}}', CTA)
    b = re.sub(r'\{\{SCREEN:(\w+)\}\}', lambda m: SCREEN[m.group(1)], b)
    b = re.sub(r'\{\{ICON:(\w+)\}\}', lambda m: ICON[m.group(1)], b)
    return b.replace('{{ARROW}}', ARROW).replace('{{CHECK}}', CHECK).replace('{{WA}}', WA).replace('{{EMAIL}}', EMAIL).replace('{{INSTA}}', INSTA)

for name, title, desc, cur in PAGES:
    body = render((ROOT / 'src/pages' / f'{name}.html').read_text(encoding='utf8'))
    (ROOT / f'{name}.html').write_text(layout(name, title, desc, cur, body), encoding='utf8')
print('ok')
