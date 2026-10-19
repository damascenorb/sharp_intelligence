import React, { useState } from 'react';
import { 
  Compass, BarChart3, Globe2, CheckCircle2, 
  ArrowRight, Zap, Sparkles, Target, ShieldCheck, Users, Lightbulb
} from 'lucide-react';

interface MethodologyStep {
  id: string;
  number: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  keyFocus: string;
  ritual: string;
}

const METHODOLOGY_STEPS: MethodologyStep[] = [
  {
    id: 'insights',
    number: '01',
    badge: 'Sharp Insights',
    title: 'Fase 1: Diagnóstico & Inteligência de Mercado',
    subtitle: 'Compreensão Profunda do Mercado & Concorrentes',
    description: 'Entendemos seu mercado, analisamos o que seus concorrentes fazem de certo ou errado e identificamos onde estão as melhores oportunidades para sua empresa crescer sem adivinhações.',
    deliverables: ['Estudo Completo de Mercado & Concorrência', 'Mapeamento das Oportunidades Não Exploradas', 'Diagnóstico dos Gargalos Comerciais'],
    keyFocus: 'Substituir palpites por clareza e dados reais.',
    ritual: 'Reunião Inicial de Alinhamento e Imersão'
  },
  {
    id: 'brand',
    number: '02',
    badge: 'Sharp Brand',
    title: 'Fase 2: Posicionamento & Identidade de Marca',
    subtitle: 'Marca Forte que Transmite Confiança e Autoridade',
    description: 'Criamos ou reformulamos a identidade visual, mensagens e apresentação da sua empresa para que seu cliente enxergue alto valor no seu trabalho e não peça descontos.',
    deliverables: ['Identidade Visual & Logotipo de Alto Padrão', 'Manual de Posicionamento & Tom de Voz', 'Apresentação Comercial & Materiais de Venda'],
    keyFocus: 'Elevar a percepção de valor e acabar com leilão de preços.',
    ritual: 'Workshop de Posicionamento de Marca'
  },
  {
    id: 'presence',
    number: '03',
    badge: 'Sharp Presence',
    title: 'Fase 3: Presença Digital & Atração Diária',
    subtitle: 'Conteúdo Profissional & Redes Sociais Ativas',
    description: 'Planejamos e publicamos conteúdos diários e estratégicos nas suas redes sociais para manter sua empresa visível, lembrada e atraindo novos clientes interessados constantemente.',
    deliverables: ['Calendário Editorial Mensal de Posts', 'Design e Redação Profissional para Redes', 'Gestão e Relatórios Simples de Acompanhamento'],
    keyFocus: 'Presença diária sem sobrecarregar sua rotina.',
    ritual: 'Reunião Mensal de Pauta & Aprovação Simples'
  },
  {
    id: 'growth',
    number: '04',
    badge: 'Sharp Growth',
    title: 'Fase 4: Consultoria de Crescimento & Escala',
    subtitle: 'Acompanhamento de Metas e Crescimento Organizado',
    description: 'Acompanhamos suas metas mês a mês com reuniões periódicas de conselho para garantir que sua empresa venda mais, com margem de lucro e organização.',
    deliverables: ['Metas Claras & Painel Simples de Vendas', 'Plano de Ação para Expansão Contínua', 'Reuniões Periódicas de Acompanhamento Executivo'],
    keyFocus: 'Garantir crescimento contínuo, seguro e lucrativo.',
    ritual: 'Reunião Executiva de Acompanhamento'
  }
];

export const SharpPlatformOverview: React.FC<{ onGoToDiagnostic: () => void }> = ({ onGoToDiagnostic }) => {
  const [activeStepId, setActiveStepId] = useState<string>('insights');
  const activeStep = METHODOLOGY_STEPS.find(s => s.id === activeStepId) || METHODOLOGY_STEPS[0];

  return (
    <div className="max-w-[1150px] mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Hero Section - Clean Light Style */}
      <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-sm relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-cyan-50 border border-cyan-200/80 text-cyan-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-cyan-600" />
            <span>Como a Sharp Transforma seu Negócio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Metodologia Clara: Do Diagnóstico às Vendas
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
            Entenda o método em 4 etapas simples que conectam a inteligência da sua empresa à atração de clientes e ao crescimento organizado.
          </p>
          <div className="pt-1 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onGoToDiagnostic}
              className="px-5 py-3 bg-slate-900 hover:bg-cyan-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Agendar Diagnóstico Gratuito</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visual Workflow Chain */}
      <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center max-w-lg mx-auto space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 inline-block">
            Esteira do Método em 4 Passos
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Conheça as 4 Etapas do Nosso Trabalho
          </h2>
          <p className="text-slate-500 text-xs font-medium">
            Clique em cada etapa para ver os entregáveis e o benefício direto para seu negócio.
          </p>
        </div>

        {/* Step Flow Bar (4 Phases) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {METHODOLOGY_STEPS.map((step) => {
            const isSelected = activeStepId === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-50/80 text-slate-900 border-cyan-400 shadow-md ring-2 ring-cyan-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold mb-2">
                    <span className={isSelected ? 'text-cyan-800 font-extrabold' : 'text-slate-400'}>PASSO {step.number}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                      isSelected ? 'bg-cyan-600 text-white border-cyan-600' : 'bg-slate-200 text-slate-600 border-slate-300'
                    }`}>
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xs sm:text-sm leading-snug text-slate-900">
                    {step.title}
                  </h3>
                </div>
                <div className={`text-[10px] font-bold mt-3 pt-2 border-t ${isSelected ? 'border-cyan-200 text-cyan-800' : 'border-slate-200 text-slate-500'}`}>
                  {isSelected ? '✓ Etapa Selecionada' : 'Clique para entender'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/90 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-extrabold text-cyan-700 font-mono">PASSO {activeStep.number}</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{activeStep.badge}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              {activeStep.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {activeStep.description}
            </p>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1">
              <div><strong className="text-slate-900">Objetivo Principal:</strong> <span className="text-slate-700 font-medium">{activeStep.keyFocus}</span></div>
              <div><strong className="text-cyan-800">Acompanhamento:</strong> <span className="text-slate-700 font-medium">{activeStep.ritual}</span></div>
            </div>
          </div>

          <div className="md:col-span-5 bg-white p-5 rounded-xl border border-slate-200/80 space-y-3 shadow-2xs">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block border-b border-slate-100 pb-2">
              O que entregamos nesta etapa:
            </span>
            <ul className="space-y-2">
              {activeStep.deliverables.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Summary Flow */}
      <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 text-center space-y-3 shadow-2xs">
        <h3 className="text-sm font-extrabold text-slate-900">
          A Jornada de Evolução da Sua Empresa com a Sharp
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700">
          <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">1. Entender seu Mercado</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">2. Fortalecer sua Marca</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">3. Atrair Clientes Diariamente</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <span className="bg-cyan-50 text-cyan-800 px-3 py-1.5 rounded-lg border border-cyan-200">4. Crescer de Forma Organizada</span>
        </div>
      </div>

    </div>
  );
};

