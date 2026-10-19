import React, { useState } from 'react';
import {
  Download, Eye, FileText, CheckCircle2, Copy, Printer, Check, X,
  Sparkles, Table, ArrowRight, ShieldCheck, HelpCircle, Layers,
  Compass, TrendingUp, Calculator, Share2, BarChart3, FileSpreadsheet
} from 'lucide-react';

interface AssetTemplate {
  id: string;
  title: string;
  category: string;
  type: string;
  format: string;
  description: string;
  readTime: string;
  fileExtension: string;
  downloadFileName: string;
  content: {
    overview: string;
    sections: {
      heading: string;
      description?: string;
      items?: string[];
      table?: {
        headers: string[];
        rows: string[][];
      };
      formula?: string;
    }[];
    actionSteps: string[];
    rawText: string;
  };
}

const TEMPLATES: AssetTemplate[] = [
  {
    id: 'guia_benchmarking',
    title: 'Guia de Inteligência de Mercado & Benchmarking Competitivo',
    category: 'Sharp Insights',
    type: 'Framework de Mercado',
    format: 'PDF Interativo & Checklist',
    readTime: '12 min de estudo',
    fileExtension: 'pdf',
    downloadFileName: 'sharp_guia_benchmarking_competitivo.md',
    description: 'Guia prático com critérios de análise SWOT, mapeamento de concorrência e identificação de oportunidades não exploradas no setor.',
    content: {
      overview: 'Este guia estabelece o padrão executivo Sharp para monitorar concorrentes diretos e indiretos, mapear diferenciais reais e identificar lacunas de mercado não atendidas.',
      sections: [
        {
          heading: '1. Matriz de Análise Competitiva Direta',
          description: 'Compare seu posicionamento atual frente aos 3 principais concorrentes do seu nicho:',
          table: {
            headers: ['Critério de Análise', 'Sua Empresa', 'Concorrente Alpha', 'Concorrente Beta'],
            rows: [
              ['Proposta de Valor Central', 'Solução sob medida de alto valor', 'Preço baixo / volume', 'Marca tradicional de massa'],
              ['Ticket Médio Estimado', 'R$ 4.500 / mês', 'R$ 1.200 / mês', 'R$ 8.000 / projeto'],
              ['Canal de Aquisição Forte', 'Indicação + Consultoria Ativa', 'Anúncios de varejo / Meta', 'Eventos presenciais e networking'],
              ['Principal Ponto Fraco', 'Presença digital ainda tímida', 'Atendimento genérico e robótico', 'Processos lentos e burocráticos'],
              ['Tempo de Resposta ao Lead', 'Menos de 2 horas', '24 a 48 horas', 'Mais de 3 dias']
            ]
          }
        },
        {
          heading: '2. Matriz SWOT / FOFA Estruturada',
          description: 'Mapeie as variáveis internas e externas com foco em diferenciação sustentável:',
          items: [
            'Forças (Internas): Especialização da equipe, agilidade na tomada de decisão, atendimento humanizado e cases comprovados.',
            'Fraquezas (Internas): Dependência de indicações de fundadores, ausência de funil previsível e materiais visuais defasados.',
            'Oportunidades (Externas): Demanda crescente por serviços consultivos, migração de concorrentes para modelos automatizados impessoais.',
            'Ameaças (Externas): Entrada de players low-cost e oscilações na taxa de juros que impactam crédito corporativo.'
          ]
        },
        {
          heading: '3. Espionagem Ética & Monitoramento Contínuo',
          description: 'Rotina quinzenal recomendada para a liderança da empresa:',
          items: [
            'Biblioteca de Anúncios da Meta: Inspecione criativos ativos, formatos de vídeo e ofertas vigentes dos concorrentes.',
            'Google Alerts & Menções: Monitore termos-chave da concorrência e novos lançamentos do setor.',
            'Revisão de Avaliações Google & Reclame Aqui: Identifique as maiores queixas dos clientes da concorrência para transformá-las em argumentos de venda.'
          ]
        }
      ],
      actionSteps: [
        'Preencha a matriz de concorrentes com dados verificados desta semana.',
        'Redefina seu diferencial primário destacando o que a concorrência não consegue copiar com rapidez.',
        'Ajuste o script de qualificação comercial para contra-atacar objeções comuns de concorrentes.'
      ],
      rawText: `# GUIA DE INTELIGÊNCIA DE MERCADO & BENCHMARKING COMPETITIVO - SHARP INTELLIGENCE
Data de Emissão: 2026 | Metodologia Sharp Insights

1. OBJETIVO EXECUTIVO
Estruturar o processo de análise de concorrentes e posicionamento de mercado para pequenas e médias empresas.

2. MATRIZ DE BENCHMARKING
- Critérios: Proposta de Valor, Faixa de Preço, Canais de Aquisição, Fraquezas e Tempo de Resposta.
- Mapeamento SWOT: Forças, Fraquezas, Oportunidades e Ameaças.

3. PLANO DE AÇÃO
- Monitore anúncios dos concorrentes a cada 15 dias.
- Realce seu diferencial de atendimento e personalização.
- Documente objeções e refine sua proposta comercial.
`
    }
  },
  {
    id: 'planilha_precificacao',
    title: 'Planilha de Formação de Preço e Margem B2B',
    category: 'Finanças & Gestão',
    type: 'Planilha Inteligente & Simulador',
    format: 'Excel / CSV & Simulador',
    readTime: '15 min de prática',
    fileExtension: 'csv',
    downloadFileName: 'sharp_calculo_preco_margem_b2b.csv',
    description: 'Modelo automatizado com cálculo de custos fixos, variáveis, impostos, markup e comparativo com valores praticados no mercado.',
    content: {
      overview: 'Desenvolvida para eliminar o risco de vender no prejuízo disfarçado. Esta ferramenta calcula o Markup divisor e multiplicador exato considerando a carga tributária real e a margem de lucro líquida desejada.',
      sections: [
        {
          heading: '1. Estrutura da Fórmula de Markup Multiplicador',
          description: 'A fórmula matemática oficial para garantir a margem líquida após todos os descontos:',
          formula: 'Markup Multiplicador = 100 / [100 - (Custos Fixos % + Despesas Variáveis % + Impostos % + Margem Líquida %)]',
          items: [
            'Exemplo Prático:',
            '• Custos Fixos proporcionais: 15%',
            '• Despesas Variáveis (Comissão/Taxa Cartão): 8%',
            '• Impostos (Simples Nacional / Lucro Presumido): 11%',
            '• Margem de Lucro Líquida Alvo: 25%',
            '• Soma das deduções: 15 + 8 + 11 + 25 = 59%',
            '• Cálculo: 100 / (100 - 59) = 100 / 41 = Markup de 2,439'
          ]
        },
        {
          heading: '2. Tabela de Simulação de Preço de Venda B2B',
          table: {
            headers: ['Componente', 'Percentual (%)', 'Exemplo em R$ (Serviço Padrão)'],
            rows: [
              ['Custo Direto / Horas Homem', '41.0%', 'R$ 1.000,00'],
              ['Custos Fixos de Estrutura', '15.0%', 'R$ 365,85'],
              ['Comissões & Custos Comerciais', '8.0%', 'R$ 195,12'],
              ['Impostos e Tributos', '11.0%', 'R$ 268,29'],
              ['Lucro Líquido Real', '25.0%', 'R$ 609,75'],
              ['Preço Final de Venda Sugerido', '100.0%', 'R$ 2.439,00']
            ]
          }
        },
        {
          heading: '3. Ponto de Equilíbrio Operacional (Break-Even)',
          items: [
            'Ponto de Equilíbrio Financeiro = Custos Fixos Totais (R$) / Margem de Contribuição (%)',
            'Se seus custos fixos mensais são de R$ 25.000 e sua margem de contribuição é de 45%, seu faturamento mínimo mensal de sobrevivência é de R$ 55.555,55.',
            'Qualquer faturamento acima deste teto gera lucro líquido integral correspondente à margem.'
          ]
        }
      ],
      actionSteps: [
        'Levante a folha de pagamento e custos de software do último trimestre.',
        'Insira as alíquotas reais de tributação do seu regime tributário.',
        'Aplique o multiplicador nos novos orçamentos comerciais da Sharp e descarte descontos que corroam a margem líquida mínima de 20%.'
      ],
      rawText: `Item,Percentual,Valor_Exemplo_B2B
Custo Direto,41%,1000.00
Custo Fixo Rateado,15%,365.85
Comissoes e Variaveis,8%,195.12
Impostos Faturamento,11%,268.29
Margem Lucro Liquida,25%,609.75
Preco Final Venda,100%,2439.00
`
    }
  },
  {
    id: 'canvas_posicionamento',
    title: 'Canvas de Posicionamento e Proposta de Valor',
    category: 'Sharp Brand',
    type: 'Framework Estratégico',
    format: 'PDF Interativo & Matriz Visual',
    readTime: '10 min de leitura',
    fileExtension: 'pdf',
    downloadFileName: 'sharp_canvas_posicionamento_valor.md',
    description: 'Matriz visual para mapear dores dos clientes, diferenciais competitivos e mensagens de alta autoridade.',
    content: {
      overview: 'O Canvas de Posicionamento Sharp sintetiza em uma única página o porquê de um cliente escolher a sua marca em vez do concorrente mais barato ou mais antigo.',
      sections: [
        {
          heading: '1. O Perfil do Cliente Ideal (ICP)',
          items: [
            'Tarefas do Cliente (Jobs to be Done): Contratar um fornecedor de confiança, aumentar faturamento sem sobrecarregar a operação, ter previsibilidade.',
            'Dores Críticas (Pains): Fornecedores que somem, retrabalho constante em entregas, sensação de dinheiro desperdiçado em agências generalistas.',
            'Ganhos Desejados (Gains): Clareza estratégica, relatórios mensuráveis, aumento de autoridade e tranquilidade operacional.'
          ]
        },
        {
          heading: '2. O Mapa de Valor da Sua Solução',
          table: {
            headers: ['Bloco do Canvas', 'O que deve conter', 'Exemplo de Aplicação Sharp'],
            rows: [
              ['Produtos & Serviços', 'Lista de entregáveis concretos', 'Diagnóstico de Posicionamento + Linha Editorial + Identidade'],
              ['Aliviadores de Dor', 'Como eliminamos o medo do cliente', 'Aprovações rápidas, prazos garantidos e atendimento executivo'],
              ['Criadores de Ganho', 'Como geramos valor extraordinário', 'Design exclusivo de alto padrão e inteligência de mercado real'],
              ['Diferencial Exclusivo', 'A barreira que a concorrência não tem', 'Método em 4 pilares: Insights, Brand, Presence e Growth']
            ]
          }
        },
        {
          heading: '3. A Declaração de Posicionamento (Brand Pitch)',
          description: 'A fórmula de uma linha para apresentações institucionais e propostas:',
          formula: '"Ajudamos [Público-Alvo Específico] a [Resultado Desejado] através de [Método Único], sem [Maior Dor ou Medo do Setor]."',
          items: [
            'Exemplo Aplicado: "Ajudamos pequenas e médias empresas a conquistar autoridade e dobrar a geração de leads qualificados através de posicionamento estratégico e design refinado, sem depender de fórmulas mágicas ou posts sem propósito."'
          ]
        }
      ],
      actionSteps: [
        'Valide o Brand Pitch com 3 clientes atuais e peça feedback sincero.',
        'Padronize a bio do Instagram, o cabeçalho do LinkedIn e a página inicial do site.',
        'Incorpore a declaração no slide inicial de todas as propostas comerciais.'
      ],
      rawText: `# CANVAS DE POSICIONAMENTO E PROPOSTA DE VALOR SHARP
1. PERFIL DO CLIENTE
- Jobs: Contratação de soluções confiáveis e escaláveis.
- Dores: Amadorismo, atrasos, promessas vazias.
- Ganhos: Previsibilidade, autoridade e retorno financeiro.

2. MAPA DE VALOR
- Entregáveis estruturados com critério de aceite.
- Design de nível internacional e estratégia executiva.

3. DECLARAÇÃO DE POSICIONAMENTO
"Para empresas que buscam liderança em seus setores, a Sharp entrega inteligência, identidade e autoridade para impulsionar vendas com consistência."
`
    }
  },
  {
    id: 'playbook_redes',
    title: 'Playbook de Presença Digital & Calendário Editorial Omnicanal',
    category: 'Sharp Presence',
    type: 'Planilha & Guia de Produção',
    format: 'Notion / Sheets & Roteiros',
    readTime: '20 min de estudo',
    fileExtension: 'csv',
    downloadFileName: 'sharp_playbook_calendario_editorial.csv',
    description: 'Estrutura para planejar conteúdos diários, matriz de copywriting de vendas e acompanhamento de engajamento.',
    content: {
      overview: 'Matriz estratégica para transformar as redes sociais da sua empresa em uma esteira contínua de atração de clientes qualificados e fortalecimento institucional.',
      sections: [
        {
          heading: '1. Matriz de Distribuição dos 4 Pilares Editoriais',
          table: {
            headers: ['Pilar Editorial', 'Frequência %', 'Objetivo Primário', 'Formato Recomendado'],
            rows: [
              ['Autoridade & Cases', '35%', 'Gerar confiança imediata e provar competência técnica', 'Carrossel técnico e antes/depois documentado'],
              ['Educação & Insights', '30%', 'Elevar o nível de consciência do lead sobre seu problema', 'Reels com gancho forte e tutoriais passo a passo'],
              ['Conexão & Bastidores', '15%', 'Humanizar a marca e mostrar rigor na execução', 'Stories diários e fotos da rotina da equipe'],
              ['Conversão & Oferta', '20%', 'Gerar chamadas diretas para diagnóstico e reuniões', 'Posts com CTA para WhatsApp e Direct']
            ]
          }
        },
        {
          heading: '2. As 5 Fórmulas de Ganchos (Hooks) de Alta Retenção',
          items: [
            'Hook de Erro Comum: "O erro silencioso que está custando R$ 10.000 por mês no seu segmento..."',
            'Hook de Contraste: "Por que 90% das empresas do seu setor falham ao tentar fazer X (e o que as líderes fazem diferente)..."',
            'Hook de Bastidores / Prova: "Como estruturamos o posicionamento da empresa Y para atingir X em 60 dias..."',
            'Hook de Passo a Passo: "3 decisões simples para blindar seu fluxo de caixa contra a alta do dólar..."',
            'Hook de Provocação: "Se o seu cliente ainda te pede desconto, o problema não é o preço. É o seu posicionamento."'
          ]
        },
        {
          heading: '3. Papel Estratégico de Cada Canal',
          items: [
            'Instagram: Vitrine visual, relacionamento diário, prova social rápida e humanização da liderança.',
            'LinkedIn: Artigos de liderança intelectual, parcerias B2B, atração de talentos e conexão com C-Levels.',
            'Google Perfil de Empresa (Maps): Captação de demanda ativa local e avaliações com 5 estrelas.',
            'Site Institucional: Fechamento de negócios, apresentação detalhada da empresa e captação de diagnósticos.'
          ]
        }
      ],
      actionSteps: [
        'Planeje os 12 temas do mês seguinte utilizando a proporção 35/30/15/20.',
        'Grave 4 vídeos de até 60 segundos aplicando os ganchos de contraste e bastidores.',
        'Monitore a taxa de conversão em leads via direct e WhatsApp toda sexta-feira.'
      ],
      rawText: `Data,Pilar,Tema_Conteudo,Formato,Canal,CTA_Chamada
Segunda,Autoridade,Estudo de Caso Real: De R$ 50k para R$ 200k,Carrossel,Instagram/LinkedIn,Comente CASE para receber os detalhes
Quarta,Educacao,Como calcular a margem de contribuicao sem erro,Reels 45s,Instagram/TikTok,Envie para seu socio
Sexta,Conversao,Agende seu Diagnostico Estrategico Sharp,Post Unico,Todos,Link na bio / WhatsApp
`
    }
  },
  {
    id: 'matriz_kpis_okrs',
    title: 'Matriz de Maturidade Empresarial & Painel de Indicadores (KPIs/OKRs)',
    category: 'Sharp Growth',
    type: 'Dashboard Executivo & Governança',
    format: 'Dashboard Sheets / Notion',
    readTime: '15 min de prática',
    fileExtension: 'json',
    downloadFileName: 'sharp_matriz_kpis_okrs_governanca.json',
    description: 'Framework de governança para diagnosticar maturidade, estabelecer metas de curto e longo prazo e monitorar o crescimento.',
    content: {
      overview: 'Sistema de acompanhamento trimestral para monitorar a saúde dos 5 pilares do negócio com cadência de ritos executivos semanais e mensais.',
      sections: [
        {
          heading: '1. Os 6 KPIs Essenciais de Sobrevivência e Escala',
          table: {
            headers: ['Indicador', 'Fórmula de Cálculo', 'Meta Recomendada PME', 'Frequência de Checagem'],
            rows: [
              ['CAC (Custo de Aquisição)', 'Total Investimento Comercial / Novos Clientes', 'Inferior a 1/3 do LTV', 'Mensal'],
              ['LTV (Valor do Ciclo de Vida)', 'Ticket Médio x Meses de Retenção', '3x superior ao CAC', 'Trimestral'],
              ['Margem Líquida Real', 'Lucro Líquido / Faturamento Bruto x 100', 'Mínimo de 18% a 25%', 'Mensal'],
              ['Taxa de Conversão de Propostas', 'Contratos Fechados / Propostas Apresentadas x 100', 'Acima de 35% a 40%', 'Semanal'],
              ['Churn Rate (Cancelamentos)', 'Clientes Perdidos no Mês / Base Total x 100', 'Inferior a 2.5% ao mês', 'Mensal'],
              ['NPS (Satisfação do Cliente)', '% Promotores (notas 9-10) - % Detratores (notas 0-6)', 'Acima de 75 pontos', 'Bimestral']
            ]
          }
        },
        {
          heading: '2. Exemplo de OKR Trimestral (Objective & Key Results)',
          items: [
            'Objetivo Estratégico (O): "Consolidar a autoridade da marca e aumentar a previsibilidade de vendas."',
            '• KR 1: Aumentar o número de leads qualificados de 15 para 45 por mês.',
            '• KR 2: Elevar a taxa de conversão de propostas de 22% para 38% com a nova apresentação executiva.',
            '• KR 3: Implementar o rito de reunião de alinhamento semanal com 100% de adesão.'
          ]
        },
        {
          heading: '3. Cadência de Governança Recomendada',
          items: [
            'Segunda-feira (30 min): Alinhamento tático semanal, metas da semana e remoção de gargalos operacionais.',
            'Última sexta-feira do mês (90 min): Fechamento do DRE gerencial, apuração de margem e revisão de KPIs.',
            'Fechamento de Trimestre (Meio Período): Avaliação de OKRs atingidos e definição do plano estratégico do próximo ciclo.'
          ]
        }
      ],
      actionSteps: [
        'Calcule o CAC e LTV históricos dos últimos 6 meses.',
        'Estabeleça os 3 Key Results inegociáveis para este trimestre.',
        'Bloqueie na agenda a reunião de governança de segunda-feira com os líderes de área.'
      ],
      rawText: JSON.stringify({
        framework: "Sharp Growth OKR & KPI Governance Matrix",
        version: "2026.1",
        kpis: [
          { name: "CAC", formula: "Investimento / Novos Clientes", target: "< 1/3 LTV" },
          { name: "LTV", formula: "Ticket x Meses Retencao", target: "> 3x CAC" },
          { name: "Margem Liquida", formula: "Lucro / Faturamento * 100", target: "> 20%" },
          { name: "Conversao Propostas", formula: "Fechados / Enviados * 100", target: "> 35%" }
        ],
        rituals: ["Weekly Alignment (Seg 09:00)", "Monthly DRE Review (Ultima Sex)", "Quarterly OKR Planning"]
      }, null, 2)
    }
  }
];

export const DownloadLibrary: React.FC<{ onGoToDiagnostic: () => void }> = ({ onGoToDiagnostic }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<AssetTemplate | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [copiedRawText, setCopiedRawText] = useState(false);

  // Trigger genuine file download in browser
  const handleDownloadFile = (template: AssetTemplate) => {
    try {
      const mimeType = template.fileExtension === 'csv' 
        ? 'text/csv;charset=utf-8;' 
        : template.fileExtension === 'json'
        ? 'application/json;charset=utf-8;'
        : 'text/markdown;charset=utf-8;';

      const blob = new Blob([template.content.rawText], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', template.downloadFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccessMessage(`Arquivo "${template.downloadFileName}" gerado e baixado com sucesso!`);
      setTimeout(() => {
        setDownloadSuccessMessage(null);
      }, 5000);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const handleCopyText = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedRawText(true);
      setTimeout(() => setCopiedRawText(false), 3000);
    }
  };

  const handlePrintDocument = () => {
    window.print();
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-950 text-white rounded-[32px] p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden space-y-3">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Biblioteca de Frameworks Oficiais</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Templates, Frameworks e Ferramentas Práticas
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
            Abra diretamente no navegador ou baixe os modelos executivos para planejar preços, calcular margens, analisar concorrentes e estruturar a governança da sua empresa.
          </p>
        </div>

        {/* Global Download Success Banner */}
        {downloadSuccessMessage && (
          <div className="mt-4 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccessMessage}</span>
            </div>
            <button onClick={() => setDownloadSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Grid of Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 hover:border-cyan-500/60 group relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-cyan-50 text-cyan-800 text-[11px] font-bold px-3 py-1 rounded-full border border-cyan-200">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {item.format}
                </span>
              </div>

              <h2 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-cyan-800 transition-colors">
                {item.title}
              </h2>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom Actions: View Document & Download */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>{item.type}</span>
                <span>{item.readTime}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(item)}
                  className="py-2.5 px-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 border border-cyan-200 cursor-pointer shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Abrir / Visualizar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadFile(item)}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Baixar Arquivo</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Full Document Viewer Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 px-2.5 py-0.5 rounded-full border border-cyan-200">
                    {selectedTemplate.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                    {selectedTemplate.format}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedTemplate.title}
                </h2>
                <p className="text-xs text-slate-500">
                  Visualizador Oficial de Documentos Sharp • Tempo estimado: {selectedTemplate.readTime}
                </p>
              </div>

              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1 text-slate-800">
              
              {/* Executive Overview Box */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-800 block flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Visão Executiva do Documento</span>
                </span>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  {selectedTemplate.content.overview}
                </p>
              </div>

              {/* Document Sections */}
              <div className="space-y-6">
                {selectedTemplate.content.sections.map((sec, idx) => (
                  <div key={idx} className="space-y-3 pb-6 border-b border-slate-100 last:border-b-0">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{sec.heading}</span>
                    </h3>

                    {sec.description && (
                      <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                        {sec.description}
                      </p>
                    )}

                    {sec.formula && (
                      <div className="ml-8 p-3.5 bg-slate-900 text-cyan-300 font-mono text-xs sm:text-sm rounded-xl border border-slate-800 shadow-inner">
                        {sec.formula}
                      </div>
                    )}

                    {sec.table && (
                      <div className="ml-8 overflow-x-auto rounded-2xl border border-slate-200">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                            <tr>
                              {sec.table.headers.map((h, hIdx) => (
                                <th key={hIdx} className="p-3 whitespace-nowrap">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {sec.table.rows.map((r, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                {r.map((c, cIdx) => (
                                  <td key={cIdx} className={`p-3 text-slate-700 ${cIdx === 0 ? 'font-semibold text-slate-900' : ''}`}>
                                    {c}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {sec.items && (
                      <ul className="ml-8 space-y-2 text-xs sm:text-sm text-slate-700">
                        {sec.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start space-x-2">
                            <Check className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Steps Box */}
              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 block flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Plano de Execução Imediato:</span>
                </span>
                <div className="space-y-1.5">
                  {selectedTemplate.content.actionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-emerald-900 font-medium">
                      <span className="font-bold">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Sticky Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleCopyText(selectedTemplate.content.rawText)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  {copiedRawText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar Conteúdo</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrintDocument}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Imprimir / Salvar PDF</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleDownloadFile(selectedTemplate)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Baixar Arquivo ({selectedTemplate.fileExtension.toUpperCase()})</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(null);
                    onGoToDiagnostic();
                  }}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
                >
                  <span>Solicitar Aplicação Consultiva</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
