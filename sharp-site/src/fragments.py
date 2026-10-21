ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-5-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>'
CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>'
WA_NUM = '5511993918460'
WA_TXT = 'Olá, Sharp! Quero apresentar meu desafio.'
EMAIL = 'midia.sharp@gmail.com'

STEP = {
 'i1': '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="21" cy="21" r="12" fill="none" stroke="currentColor" stroke-width="2.8"/><path d="m30 30 12 12" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>',
 'i2': '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6v36M10 14h28M10 14 4 28a6 6 0 0 0 12 0Zm28 0-6 14a6 6 0 0 0 12 0ZM16 42h16" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 'i3': '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 5h17l9 9v29H12Z" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><path d="M29 5v9h9M18 24h14M18 31h14M18 38h8" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>',
 'i4': '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="m16 14-10 10 10 10M32 14l10 10-10 10M27 8l-6 32" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 'i5': '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4 7 11v12c0 11 7 18 17 21 10-3 17-10 17-21V11Z" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><path d="m16 24 6 6 11-12" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 'i6': '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 26a18 18 0 0 1 36 0M6 26v8a3 3 0 0 0 3 3h3V25H9a3 3 0 0 0-3 1Zm36 0v8a3 3 0 0 1-3 3h-3V25h3a3 3 0 0 1 3 1ZM36 37c0 4-4 6-9 6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>',
 'chat': '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 8h36v26H22l-10 8v-8H6Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M14 17h20M14 25h12" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
 'mail': '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="10" width="38" height="28" rx="4" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="m6 13 18 14 18-14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>',
 'globe': '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M6 24h36M24 6c-9 10-9 26 0 36M24 6c9 10 9 26 0 36" fill="none" stroke="currentColor" stroke-width="2.6"/></svg>',
}
ICON = {
 'web': '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="5" y="9" width="38" height="30" rx="4" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M5 18h38" stroke="currentColor" stroke-width="2.6"/><circle cx="11" cy="13.5" r="1.4" fill="currentColor"/><circle cx="16" cy="13.5" r="1.4" fill="currentColor"/><path d="M13 26h14M13 32h22" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
 'systems': '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="6" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2.6"/><rect x="26" y="6" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2.6"/><rect x="6" y="26" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M34 26v16M26 34h16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
 'auto': '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="10" cy="24" r="5" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="38" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="38" cy="36" r="5" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M15 22l18-8M15 26l18 8" stroke="currentColor" stroke-width="2.6"/></svg>',
 'data': '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 41V7M7 41h34" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><rect x="13" y="24" width="6" height="12" fill="currentColor"/><rect x="23" y="16" width="6" height="20" fill="currentColor"/><rect x="33" y="9" width="6" height="27" fill="currentColor"/></svg>',
}

ICON.update(STEP)

def win(url, body, label='Exemplo ilustrativo', cls=''):
    return f'''<figure class="screen {cls}"><div class="win" role="img" aria-label="{label}: tela de {url}">
<div class="win-bar"><i></i><i></i><i></i><span>{url}</span></div>{body}</div><figcaption>{label}</figcaption></figure>'''

def side(active, items=('Painel', 'Estoque', 'Movimentações', 'Pedidos', 'Clientes', 'Relatórios')):
    return '<nav class="app-side"><b>Sua empresa</b>' + ''.join(f'<span{" class=on" if i == active else ""}>{t}</span>' for i, t in enumerate(items)) + '</nav>'

def side2(active, items):
    return side(active, items)

def pin(n, x, y):
    return f'<em class="pin" style="left:{x}%;top:{y}%">{n}</em>'

SCREEN = {}
SCREEN['estoque'] = win('app.suaempresa.com.br/estoque', f'''<div class="app">{side(1)}<div class="app-main">
<div class="app-top"><h4>Estoque</h4><span class="btn-mini">+ Nova entrada</span></div>
<div class="kpis"><div><small>Itens cadastrados</small><b>5</b></div><div class="warn"><small>Abaixo do mínimo</small><b>1</b></div><div><small>Movimentos hoje</small><b>4</b></div></div>
<table class="app-t"><thead><tr><th>Produto</th><th>Entrou</th><th>Saiu</th><th>Saldo</th><th>Situação</th></tr></thead><tbody>
<tr><td>Balões (pacote)</td><td>60</td><td>42</td><td>18</td><td><u class="ok">Normal</u></td></tr>
<tr><td>Painel redondo</td><td>80</td><td>55</td><td>25</td><td><u class="ok">Normal</u></td></tr>
<tr class="low"><td>Fita de cetim</td><td>24</td><td>20</td><td>4</td><td><u class="bad">Repor</u></td></tr>
<tr><td>Toalha de mesa</td><td>50</td><td>31</td><td>19</td><td><u class="ok">Normal</u></td></tr>
<tr><td>Vela decorativa</td><td>36</td><td>22</td><td>14</td><td><u class="ok">Normal</u></td></tr></tbody></table>
</div>{pin(1,59,17)}{pin(2,62,23)}{pin(3,77,52)}</div>''')

SCREEN['dash'] = win('app.suaempresa.com.br/painel', f'''<div class="app">{side(0)}<div class="app-main">
<div class="app-top"><h4>Painel da semana</h4><span class="btn-mini">Exportar</span></div>
<div class="kpis"><div><small>Pedidos</small><b>124</b></div><div><small>Melhor dia</small><b>Sábado</b></div><div><small>Pedidos no melhor dia</small><b>31</b></div></div>
<svg class="app-chart" viewBox="0 0 320 150" aria-hidden="true" font-family="Albert Sans, sans-serif" font-size="12" fill="#5a6488">
<rect x="14" y="86" width="38" height="44" rx="4" fill="#b9c6ff"/><rect x="66" y="76" width="38" height="54" rx="4" fill="#b9c6ff"/><rect x="118" y="91" width="38" height="39" rx="4" fill="#b9c6ff"/><rect x="170" y="50" width="38" height="80" rx="4" fill="#b9c6ff"/><rect x="222" y="64" width="38" height="66" rx="4" fill="#b9c6ff"/><rect x="274" y="22" width="38" height="108" rx="4" fill="#2f5bff"/>
<text x="33" y="148" text-anchor="middle">Seg</text><text x="85" y="148" text-anchor="middle">Ter</text><text x="137" y="148" text-anchor="middle">Qua</text><text x="189" y="148" text-anchor="middle">Qui</text><text x="241" y="148" text-anchor="middle">Sex</text><text x="293" y="148" text-anchor="middle">Sáb</text>
<text x="33" y="80" text-anchor="middle" fill="#0a1030">14</text><text x="85" y="70" text-anchor="middle" fill="#0a1030">18</text><text x="137" y="85" text-anchor="middle" fill="#0a1030">12</text><text x="189" y="44" text-anchor="middle" fill="#0a1030">27</text><text x="241" y="58" text-anchor="middle" fill="#0a1030">22</text><text x="293" y="16" text-anchor="middle" fill="#0a1030">31</text></svg>
</div>{pin(1,59,19)}{pin(2,74,34)}{pin(3,88,48)}</div>''')

BALLOONS = '<svg class="balloons" viewBox="0 0 120 120" aria-hidden="true"><g stroke="#fff" stroke-opacity=".55" fill="none"><path d="M32 62c-4 20 6 34 12 54M62 50c2 22-2 40 4 66M92 64c6 18-2 34-8 52"/></g><ellipse cx="32" cy="42" rx="16" ry="20" fill="#7fd6f5"/><ellipse cx="62" cy="28" rx="17" ry="21" fill="#fff"/><ellipse cx="92" cy="44" rx="16" ry="20" fill="#2f6bff"/><ellipse cx="26" cy="34" rx="4" ry="6" fill="#fff" fill-opacity=".5"/></svg>'

def site_body(pins=True):
    return f'''<div class="site"><div class="site-nav"><b>Festa &amp; Cia Decorações</b><span>Temas</span><span>Orçamento</span><span>Contato</span></div>
<div class="site-hero"><div><h4>Sua festa decorada do jeito que você sonhou.</h4><p>Painéis, balões e mesas montados no local. Peça o orçamento pelo WhatsApp.</p><span class="btn-mini wa">Pedir orçamento</span></div>{BALLOONS}</div>
<div class="site-cards"><div class="t1"><i></i>Balões</div><div class="t2"><i></i>Painéis</div><div class="t3"><i></i>Mesas</div></div>{pin(1,40,45) + pin(2,18,16) + pin(3,52,78) if pins else ''}</div>'''

SCREEN['site'] = win('festaecia-exemplo.com.br', site_body())

def phone(inner, cls=''):
    return f'<div class="phone {cls}"><i class="notch"></i><div class="ph-scr">{inner}</div></div>'

PHONE_SITE = phone(f'''<div class="ph-nav"><b>Festa &amp; Cia</b><span>Menu</span></div><div class="ph-hero"><h4>Sua festa, decorada.</h4><p>Painéis, balões e mesas.</p><span class="btn-mini wa">Pedir orçamento</span>{BALLOONS}</div>
<div class="ph-tiles"><div class="t1"><i></i>Balões</div><div class="t2"><i></i>Painéis</div><div class="t3"><i></i>Mesas</div><div class="t1"><i></i>Arcos</div></div>''')
PHONE_APP = phone('''<div class="ph-nav"><b>Estoque</b><span>+ Entrada</span></div><div class="ph-kpi"><div><small>Itens</small><b>5</b></div><div class="warn"><small>Repor</small><b>1</b></div></div>
<ul class="ph-list"><li><span>Balões (pacote)</span><b>18</b></li><li><span>Painel redondo</span><b>25</b></li><li class="low"><span>Fita de cetim</span><b>4</b></li><li><span>Toalha de mesa</span><b>19</b></li></ul><div class="ph-tab"><i class="on"></i><i></i><i></i></div>''', 'b')

STAR = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 3c1.5 11 5 17.500 21 21-16 3.500-19.500 10-21 21-1.500-11-5-17.500-21-21C19 20.500 22.500 14 24 3Z" fill="currentColor"/></svg>'
SCREEN['devices'] = f'''<div class="devices"><span class="orb">{STAR}</span><div class="dv-win">{win('festaecia-exemplo.com.br', site_body(False))}</div><div class="dv-ph a">{PHONE_SITE}</div><div class="dv-ph b">{PHONE_APP}</div></div>'''

SCREEN['auto'] = win('app.suaempresa.com.br/automacoes', f'''<div class="app">{side(3)}<div class="app-main">
<div class="app-top"><h4>Automação: quando chega um pedido</h4><span class="btn-mini">Ativa</span></div>
<ol class="flow"><li><b>O pedido chega pelo formulário</b><small>Gatilho</small></li><li><b>Os dados vão para a planilha</b><small>Feito</small></li><li><b>O cliente recebe a confirmação</b><small>Feito</small></li><li><b>O estoque é atualizado</b><small>Em andamento</small></li></ol>
</div>{pin(1,59,28)}{pin(2,66,52)}{pin(3,66,76)}</div>''')

SCREEN['busca'] = win('app.suaempresa.com.br/busca', f'''<div class="app">{side(4)}<div class="app-main">
<div class="app-top"><h4>Prestadores mais próximos</h4></div>
<div class="field-mock">Localização recebida: Rua Exemplo, 100</div>
<table class="app-t"><thead><tr><th>Prestador</th><th>Região</th><th>Distância</th></tr></thead><tbody>
<tr><td>Prestador A</td><td>Mesma região</td><td>1,2 km</td></tr><tr><td>Prestador B</td><td>Região vizinha</td><td>2,8 km</td></tr><tr><td>Prestador C</td><td>Região vizinha</td><td>4,1 km</td></tr></tbody></table>
<p class="note-mock">Nomes e distâncias fictícios, só para mostrar o formato.</p>
</div>{pin(1,64,24)}{pin(2,70,43)}</div>''')

SCREEN['fin'] = win('app.suaempresa.com.br/financeiro', f'''<div class="app">{side2(1, ['Painel','Fluxo de caixa','Contas a pagar','Contas a receber','Categorias','Relatórios'])}<div class="app-main">
<div class="app-top"><h4>Fluxo de caixa do mês</h4><span class="btn-mini">+ Novo lançamento</span></div>
<div class="kpis"><div><small>Entradas</small><b>R$ 12.400</b></div><div><small>Saídas</small><b>R$ 8.150</b></div><div class="good"><small>Saldo</small><b>R$ 4.250</b></div></div>
<svg class="app-chart" viewBox="0 0 320 130" aria-hidden="true" font-family="Albert Sans, sans-serif" font-size="11" fill="#5a6488">
<rect x="22" y="31" width="30" height="75" rx="3" fill="#2f6bff"/><rect x="56" y="56" width="30" height="50" rx="3" fill="#b9cdff"/><rect x="108" y="17" width="30" height="89" rx="3" fill="#2f6bff"/><rect x="142" y="51" width="30" height="55" rx="3" fill="#b9cdff"/><rect x="194" y="30" width="30" height="76" rx="3" fill="#2f6bff"/><rect x="228" y="62" width="30" height="44" rx="3" fill="#b9cdff"/><rect x="270" y="20" width="30" height="86" rx="3" fill="#2f6bff"/><rect x="304" y="42" width="14" height="64" rx="3" fill="none"/>
<text x="54" y="125" text-anchor="middle">Semana 1</text><text x="140" y="125" text-anchor="middle">Semana 2</text><text x="226" y="125" text-anchor="middle">Semana 3</text><text x="290" y="125" text-anchor="middle">Sem. 4</text></svg>
<table class="app-t"><thead><tr><th>Data</th><th>Descrição</th><th>Tipo</th><th>Valor</th></tr></thead><tbody>
<tr><td>08/05</td><td>Sinal, festa infantil</td><td><u class="ok">Entrada</u></td><td>R$ 1.500</td></tr>
<tr><td>09/05</td><td>Compra de balões</td><td><u class="bad">Saída</u></td><td>R$ 620</td></tr>
<tr><td>12/05</td><td>Saldo, festa de 15 anos</td><td><u class="ok">Entrada</u></td><td>R$ 2.200</td></tr></tbody></table>
</div>{pin(1,59,22)}{pin(2,76,50)}{pin(3,76,81)}</div>''')

SCREEN['agenda'] = win('app.suaempresa.com.br/agenda', f'''<div class="app">{side2(1, ['Painel','Agenda','Clientes','Serviços','Lembretes','Relatórios'])}<div class="app-main">
<div class="app-top"><h4>Agenda da semana</h4><span class="btn-mini">+ Agendar</span></div>
<div class="kpis"><div><small>Na semana</small><b>9</b></div><div class="good"><small>Confirmados</small><b>7</b></div><div class="warn"><small>A confirmar</small><b>2</b></div></div>
<div class="cal"><div class="cal-h"><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span></div>
<div class="cal-b"><div><em class="ok">09h Visita</em><em class="ok">14h Montagem</em></div><div><em class="wait">10h Orçamento</em></div><div><em class="ok">08h Montagem</em><em class="ok">16h Retirada</em></div><div><em class="ok">11h Visita</em></div><div><em class="ok">09h Montagem</em><em class="ok">13h Visita</em><em class="wait">17h Orçamento</em></div></div></div>
</div>{pin(1,59,19)}{pin(2,64,39)}{pin(3,72,65)}</div>''')
