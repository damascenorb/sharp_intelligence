import React, { useState } from 'react';
import { 
  BarChart3, MessageSquareQuote, Globe2, TrendingUp, 
  CheckCircle2, Sparkles, Users, Search, Target, ShieldCheck, 
  ArrowRight, Cpu, Compass, Layers, Zap
} from 'lucide-react';

interface MethodPhase {
  id: string;
  number: string;
  productBadge: string;
  productName: string;
  phaseName: string;
  tagline: string;
  icon: any;
  duration: string;
  pillarFocus: string;
  executiveRitual: string;
  methodologyDetails: {
    objective: string;
    keyActivities: string[];
    deliverables: string[];
    impactMetric: string;
  };
  theme: {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    activeTabBg: string;
    activeTabBorder: string;
    accentText: string;
    cardBg: string;
    cardBorder: string;
  };
}

const METHOD_PHASES: MethodPhase[] = [
  {
    id: 'insights',
    number: '01',
    productBadge: 'Sharp Insights',
    productName: 'Inteligência de Mercado & Análise de Negócio',
    phaseName: 'Fase 1: Diagnóstico & Imersão Competitiva',
    tagline: 'Análise aprofundada do modelo de negócio, pesquisa de concorrentes e mapeamento de gargalos.',
    icon: BarChart3,
    duration: 'Semanas 1-2',
    pillarFocus: 'Análise de Negócio & Pesquisa',
    executiveRitual: 'Reunião de Imersão C-Level & Alignment Session',
    methodologyDetails: {
      objective: 'Substituir palpites por dados reais de mercado, descobrindo exatamente onde sua empresa está perdendo dinheiro e como os concorrentes estão se posicionando.',
      keyActivities: [
        'Entrevistas de alinhamento estratégico com sócios e diretores',
        'Benchmarking competitivo de preço, oferta e posicionamento no setor',
        'Pesquisa de tendências e hábitos de consumo do cliente ideal (ICP)',
        'Diagnóstico de maturidade comercial e auditoria de imagem atual'
      ],
      deliverables: [
        'Dossiê Completo de Inteligência de Mercado',
        'Matriz SWOT Comercial e de Percepção',
        'Mapeamento de Gargalos e Oportunidades Reprimidas'
      ],
      impactMetric: '98% de assertividade no direcionamento estratégico'
    },
    theme: {
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-300',
      activeTabBg: 'bg-amber-50',
      activeTabBorder: 'border-amber-500',
      accentText: 'text-amber-700',
      cardBg: 'bg-gradient-to-br from-amber-50/50 via-white to-amber-50/20',
      cardBorder: 'border-amber-200/90'
    }
  },
  {
    id: 'brand',
    number: '02',
    productBadge: 'Sharp Brand',
    productName: 'Estratégia de Marca & Posicionamento High-Ticket',
    phaseName: 'Fase 2: Arquitetura & Identidade High-Ticket',
    tagline: 'Construção do posicionamento, proposta de valor e identidade visual para transmitir autoridade instantânea.',
    icon: MessageSquareQuote,
    duration: 'Semanas 2-4',
    pillarFocus: 'Estratégia de Marca & Design Autoral',
    executiveRitual: 'Workshop de Posicionamento & Pitch Commercial Review',
    methodologyDetails: {
      objective: 'Eliminar a objeção de preço criando uma percepção de marca sofisticada, fazendo sua empresa ser reconhecida como a principal referência do setor.',
      keyActivities: [
        'Definição da proposta única de valor (UVP) e tom de voz institucional',
        'Desenvolvimento do sistema de identidade visual (Logo, Cores, Tipografia, Elementos)',
        'Criação de narrativas comerciais persuasivas para reuniões de venda',
        'Elaboração de kit e deck corporativo executivo de alta conversão'
      ],
      deliverables: [
        'Manual de Identidade Visual High-Ticket (Brandbook)',
        'Manual de Posicionamento & Tom de Voz',
        'Kit Executivo & Pitch Deck Comercial'
      ],
      impactMetric: '+320% de aumento na percepção de valor e autoridade'
    },
    theme: {
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      badgeBorder: 'border-purple-300',
      activeTabBg: 'bg-purple-50',
      activeTabBorder: 'border-purple-500',
      accentText: 'text-purple-700',
      cardBg: 'bg-gradient-to-br from-purple-50/50 via-white to-purple-50/20',
      cardBorder: 'border-purple-200/90'
    }
  },
  {
    id: 'presence',
    number: '03',
    productBadge: 'Sharp Presence',
    productName: 'Gestão de Presença Digital Omnicanal',
    phaseName: 'Fase 3: Execução Editorial & Atração Diária',
    tagline: 'Planejamento e publicação contínua de conteúdos estratégicos com copywriting focado em conversão.',
    icon: Globe2,
    duration: 'Execução Diária & Mensal',
    pillarFocus: 'Comunicação em Redes & Copywriting',
    executiveRitual: 'Reunião Mensal de Pauta & Aprovação Ágil na Galeria',
    methodologyDetails: {
      objective: 'Garantir que sua empresa esteja presente todos os dias diante dos tomadores de decisão com conteúdo profissional, esteticamente impecável e persuasivo.',
      keyActivities: [
        'Construção da linha editorial com pilares de autoridade, prova social e vendas',
        'Criação diária de peças visuais de alto padrão e redação estratégica (copywriting)',
        'Gestão e agendamento de publicações nos canais oficiais',
        'Análise semanal do engajamento e refinamento dos formatos com melhor retorno'
      ],
      deliverables: [
        'Calendário e Matriz Editorial Mensal de Conteúdo',
        'Design Estratégico & Copywriting Diário',
        'Relatórios Periódicos de Alcance e Atração'
      ],
      impactMetric: '100% de constância digital sem sobrecarregar sua equipe'
    },
    theme: {
      badgeBg: 'bg-cyan-100',
      badgeText: 'text-cyan-800',
      badgeBorder: 'border-cyan-300',
      activeTabBg: 'bg-cyan-50',
      activeTabBorder: 'border-cyan-500',
      accentText: 'text-cyan-700',
      cardBg: 'bg-gradient-to-br from-cyan-50/50 via-white to-cyan-50/20',
      cardBorder: 'border-cyan-200/90'
    }
  },
  {
    id: 'growth',
    number: '04',
    productBadge: 'Sharp Growth',
    productName: 'Consultoria Estratégica & Escala Organizada',
    phaseName: 'Fase 4: Governança, KPIs & Escala Sustentável',
    tagline: 'Acompanhamento periódico de metas, métricas de vendas e direcionamento executivo contínuo.',
    icon: TrendingUp,
    duration: 'Ciclos Contínuos',
    pillarFocus: 'Consultoria de Escala & OKRs',
    executiveRitual: 'Reunião Mensal de Conselho & Board Review Executivo',
    methodologyDetails: {
      objective: 'Acompanhar a evolução do faturamento, alinhar os indicadores de conversão e garantir que a estrutura de comunicação e marca continue gerando resultados escaláveis.',
      keyActivities: [
        'Definição e monitoramento de KPIs (Indicadores-Chave) e OKRs do negócio',
        'Reuniões de conselho com especialistas sêniores para tomada de decisão',
        'Ajustes de rota em tempo real com base nos dados de conversão',
        'Consultoria para expansão de novos canais e parcerias comerciais'
      ],
      deliverables: [
        'Dashboard de Performance Executiva & KPIs',
        'Reuniões Periódicas de Conselho & Alinhamento',
        'Plano de Ação para Expansão Continuada'
      ],
      impactMetric: '3.4x de Retorno Médio sobre Investimento (ROI)'
    },
    theme: {
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      badgeBorder: 'border-emerald-300',
      activeTabBg: 'bg-emerald-50',
      activeTabBorder: 'border-emerald-500',
      accentText: 'text-emerald-700',
      cardBg: 'bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20',
      cardBorder: 'border-emerald-200/90'
    }
  }
];

export const MethodologyTimeline: React.FC = () => {
  const [activePhaseId, setActivePhaseId] = useState<string>('insights');

  const activePhase = METHOD_PHASES.find(p => p.id === activePhaseId) || METHOD_PHASES[0];
  const ActiveIcon = activePhase.icon;

  return (
    <section className="bg-white rounded-[28px] p-6 sm:p-10 text-slate-900 border border-slate-200/90 shadow-xl relative overflow-hidden space-y-8">
      
      {/* Decorative Subtle Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-800 bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>Metodologia Executiva Sharp Intelligence</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          O Ciclo de Aceleração Estratégica em 4 Fases
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
          Cada produto Sharp atua como um motor especializado da nossa metodologia: combinando inteligência de mercado, design de autoridade, constância editorial e governança de resultados.
        </p>
      </div>

      {/* Phase Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {METHOD_PHASES.map((phase) => {
          const Icon = phase.icon;
          const isSelected = activePhaseId === phase.id;

          return (
            <button
              key={phase.id}
              onClick={() => setActivePhaseId(phase.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer space-y-2 relative overflow-hidden ${
                isSelected
                  ? `${phase.theme.activeTabBg} ${phase.theme.activeTabBorder} shadow-md ring-2 ring-offset-1 ring-slate-200 scale-[1.01]`
                  : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded border ${phase.theme.badgeBg} ${phase.theme.badgeText} ${phase.theme.badgeBorder}`}>
                  FASE {phase.number}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  {phase.duration}
                </span>
              </div>

              <div className="font-black text-sm flex items-center space-x-2 text-slate-900 pt-1">
                <div className={`p-1.5 rounded-lg border ${phase.theme.badgeBg} ${phase.theme.badgeBorder} ${phase.theme.accentText}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate">{phase.productBadge}</span>
              </div>

              <p className="text-[11px] font-medium text-slate-500 truncate">
                {phase.pillarFocus}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Phase Detailed View Card */}
      <div className={`${activePhase.theme.cardBg} border ${activePhase.theme.cardBorder} rounded-2xl p-6 sm:p-8 space-y-6 relative z-10 transition-all duration-300 animate-fadeIn shadow-sm`}>
        
        {/* Phase Title & Header Info */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${activePhase.theme.badgeBg} ${activePhase.theme.badgeText} ${activePhase.theme.badgeBorder}`}>
                {activePhase.productBadge} • {activePhase.productName}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
              <span>{activePhase.phaseName}</span>
            </h3>

            <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed max-w-3xl">
              {activePhase.tagline}
            </p>
          </div>

          {/* Metric Highlight Badge */}
          <div className="bg-white/90 border border-slate-200/90 px-4 py-3 rounded-xl shrink-0 space-y-0.5 shadow-2xs">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Garantia de Impacto:
            </span>
            <span className={`text-sm sm:text-base font-black ${activePhase.theme.accentText}`}>
              {activePhase.methodologyDetails.impactMetric}
            </span>
          </div>
        </div>

        {/* Ritual & Method Core Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Executive Rituals & Objective */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Objective Box */}
            <div className="bg-white/80 border border-slate-200/80 rounded-xl p-4 space-y-1.5 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-cyan-600" />
                <span>Objetivo Estratégico da Fase</span>
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {activePhase.methodologyDetails.objective}
              </p>
            </div>

            {/* Executive Ritual Box */}
            <div className="bg-slate-900 text-white rounded-xl p-4 space-y-1.5 shadow-md">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ritual Executivo & Acompanhamento</span>
              </span>
              <p className="text-xs font-bold text-slate-200">
                {activePhase.executiveRitual}
              </p>
              <span className="text-[11px] text-slate-400 block font-normal">
                Reuniões diretas com especialistas sêniores para validação e tomada de decisão.
              </span>
            </div>

            {/* Key Activities List */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block">
                Atividades-Chave do Método:
              </span>
              <div className="space-y-2">
                {activePhase.methodologyDetails.keyActivities.map((act, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs font-medium text-slate-800">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${activePhase.theme.accentText}`} />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Deliverables & Outputs */}
          <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-slate-200/90 space-y-4 shadow-2xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-2 pb-2 border-b border-slate-100">
                <ShieldCheck className={`w-4 h-4 ${activePhase.theme.accentText}`} />
                <span>Entregáveis Tangíveis da Fase</span>
              </span>

              <div className="space-y-2.5">
                {activePhase.methodologyDetails.deliverables.map((del, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center space-x-3 text-xs font-bold text-slate-800">
                    <div className={`w-2 h-2 rounded-full ${activePhase.theme.accentText} bg-current`} />
                    <span>{del}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Fase {activePhase.number} do Método Sharp</span>
              <span className="font-bold text-slate-800 flex items-center space-x-1">
                <span>Solução Integrada</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
