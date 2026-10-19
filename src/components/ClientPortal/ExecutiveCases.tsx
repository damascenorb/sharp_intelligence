import React, { useState } from 'react';
import { 
  Award, TrendingUp, CheckCircle2, ArrowRight, BarChart3, 
  Building2, ShieldCheck, Zap, Globe2, MessageSquareQuote, Compass, Search 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CaseItem {
  id: string;
  serviceCategory: string;
  clientType: string;
  headline: string;
  problem: string;
  sharpSolution: string;
  results: string[];
  metricsChartData: { metric: string; Antes: number; Depois: number }[];
}

const CASES: CaseItem[] = [
  {
    id: 'brand',
    serviceCategory: 'Estratégia de Marca',
    clientType: 'Empresa de Serviços Corporativos B2B',
    headline: 'Reposicionamento High-Ticket e Eliminação de Guerras de Preço',
    problem: 'A marca era percebida como apenas mais uma consultoria genérica no mercado, sofrendo constante pressão por descontos e com ciclo de vendas arrastado.',
    sharpSolution: 'Reformulação completa do posicionamento, criação de proposta de valor de autoridade e redesenho de todo o kit comercial executivo.',
    results: [
      'Aumento de 2.4x no Ticket Médio das propostas comerciais.',
      'Redução de 45 dias para 16 dias no tempo de fechamento.',
      'Eliminação total de objeções de preço nas primeiras reuniões.'
    ],
    metricsChartData: [
      { metric: 'Ticket Médio (R$ k)', Antes: 15, Depois: 36 },
      { metric: 'Ciclo de Venda (Dias)', Antes: 45, Depois: 16 }
    ]
  },
  {
    id: 'digital',
    serviceCategory: 'Gestão de Presença Digital',
    clientType: 'Grupo Industrial & Distribuição',
    headline: 'Presença Digital Omnicanal e Inbound B2B de Alta Qualificação',
    problem: 'Dependência exclusiva de indicação de terceiros e equipe de vendas externa, sem nenhuma atração ativa de clientes qualificados pelos canais digitais.',
    sharpSolution: 'Criação do ecossistema digital de autoridade, linha editorial de conteúdo B2B, otimização de posicionamento de busca e campanhas focadas em decisores.',
    results: [
      'Atração mensal constante de mais de 40 novos leads qualificados C-Level.',
      '+210% de engajamento e reconhecimento da marca por diretores do setor.',
      'Abertura de novos canais de distribuição regionais via canal digital.'
    ],
    metricsChartData: [
      { metric: 'Leads C-Level / Mês', Antes: 3, Depois: 42 },
      { metric: 'Reconhecimento (pts)', Antes: 20, Depois: 85 }
    ]
  },
  {
    id: 'market_intel',
    serviceCategory: 'Inteligência de Mercado',
    clientType: 'Rede de Tecnologia e Soluções B2B',
    headline: 'Identificação de Novas Oportunidades e Mapeamento da Concorrência',
    problem: 'Decisões de expansão baseadas apenas no feeling dos diretores, sem clareza sobre o tamanho real do mercado e movimentos dos concorrentes.',
    sharpSolution: 'Desenvolvimento de Dossiê de Inteligência de Mercado contínuo, mapeando o perfil ideal do cliente, precificação do mercado e nichos inexplorados.',
    results: [
      'Descberta de 2 novos segmentos de mercado altamente rentáveis.',
      'Otimização da estratégia de preços aumentando a margem líquida.',
      'Prevenção de investimento frustrado em produto de baixa demanda.'
    ],
    metricsChartData: [
      { metric: 'Margem Líquida (%)', Antes: 12, Depois: 28 },
      { metric: 'Precisão de Previsão (%)', Antes: 35, Depois: 90 }
    ]
  },
  {
    id: 'growth',
    serviceCategory: 'Consultoria de Crescimento',
    clientType: 'Empresa Médial em Expansão',
    headline: 'Estruturação da Tração e Acompanhamento de Metas Executivas',
    problem: 'Empresa estagnada no faturamento há 2 anos devido à desorganização da equipe comercial, falta de métricas claras e processo de vendas desalinhado.',
    sharpSolution: 'Implementação da metodologia de crescimento Sharp, reestruturação do pipeline de vendas, acompanhamento quinzenal da diretoria e alinhamento de OKRs.',
    results: [
      '+180% de faturamento acumulado em 12 meses de acompanhamento.',
      'Alinhamento completo da equipe comercial aos objetivos da diretoria.',
      'Crescimento sustentável sem necessidade de contratar novos vendedores.'
    ],
    metricsChartData: [
      { metric: 'Faturamento Indexado', Antes: 100, Depois: 280 },
      { metric: 'Conversão Comercial (%)', Antes: 11, Depois: 29 }
    ]
  }
];

export const ExecutiveCases: React.FC<{ onGoToDiagnostic: () => void }> = ({ onGoToDiagnostic }) => {
  const [activeCaseId, setActiveCaseId] = useState<string>('brand');
  const activeCase = CASES.find((c) => c.id === activeCaseId) || CASES[0];

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-950 text-white rounded-[28px] p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden space-y-3">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
          RESULTADOS QUE ENTREGAMOS
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Histórias Reais de Transformação & Crescimento
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl">
          Conheça como apoiamos pequenas e médias empresas a conquistar autoridade, presença digital marcante, inteligência competitiva e crescimento acelerado.
        </p>
      </div>

      {/* Service Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {CASES.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveCaseId(item.id)}
            className={`px-5 py-3 rounded-2xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeCaseId === item.id
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.serviceCategory}
          </button>
        ))}
      </div>

      {/* Case Detail Card */}
      <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-lg space-y-8">
        
        <div className="space-y-2 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              {activeCase.serviceCategory}
            </span>
            <span className="text-xs text-slate-500 font-medium">• {activeCase.clientType}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
            {activeCase.headline}
          </h2>
        </div>

        {/* Problem vs Sharp Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50/60 border border-red-200 p-6 rounded-2xl space-y-2">
            <span className="text-xs font-black uppercase text-red-900 tracking-wider block">
              Desafio Inicial / Problema do Cliente
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {activeCase.problem}
            </p>
          </div>

          <div className="bg-cyan-50/60 border border-cyan-200 p-6 rounded-2xl space-y-2">
            <span className="text-xs font-black uppercase text-cyan-900 tracking-wider block">
              Solução Estratégica da Sharp
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {activeCase.sharpSolution}
            </p>
          </div>
        </div>

        {/* Chart + Results Bullet Points */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800">
          
          {/* Bullet Points */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center space-x-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Resultados Alcançados</span>
            </h3>
            <ul className="space-y-3">
              {activeCase.results.map((res, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chart Comparison */}
          <div className="lg:col-span-5 bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block text-center">Comparativo de Desempenho</span>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeCase.metricsChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="metric" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="Antes" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Depois" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* CTA Banner */}
        <div className="pt-2 text-center">
          <button
            onClick={onGoToDiagnostic}
            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-600/20 inline-flex items-center space-x-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Agendar Diagnóstico Estratégico para Minha Empresa</span>
          </button>
        </div>

      </div>

    </div>
  );
};

