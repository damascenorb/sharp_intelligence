import React from 'react';
import { BarChart3, MessageSquareQuote, Globe2, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

interface StageItem {
  number: string;
  badge: string;
  title: string;
  description: string;
  icon: any;
  deliverables: string[];
}

const STAGES: StageItem[] = [
  {
    number: '01',
    badge: 'Sharp Insights',
    title: 'Compreender',
    description: 'Compreender antes de decidir. Investigação do negócio, clientes, concorrência, mercado e oportunidades.',
    icon: BarChart3,
    deliverables: ['Diagnóstico & Direcionamento Estratégico', 'Benchmarking Competitivo de Concorrentes', 'Mapeamento de Público, Personas & Jornada']
  },
  {
    number: '02',
    badge: 'Sharp Brand',
    title: 'Posicionar',
    description: 'Definir como a empresa deve ser percebida. Estratégia de marca, mensagem central, tom de voz e identidade visual autoral.',
    icon: MessageSquareQuote,
    deliverables: ['Plataforma de Marca & Posicionamento', 'Guia de Voz & Manifesto Institucional', 'Identidade Visual Completa & Brandbook']
  },
  {
    number: '03',
    badge: 'Sharp Presence',
    title: 'Comunicar',
    description: 'Transformar a estratégia em comunicação constante. Planejamento editorial, copywriting e presença digital reconhecível.',
    icon: Globe2,
    deliverables: ['Estratégia de Canais & Calendário Editorial', 'Copywriting & Design Autoral para Redes', 'Gestão, Agendamento e Relatórios Mensais']
  },
  {
    number: '04',
    badge: 'Sharp Growth',
    title: 'Medir e Crescer',
    description: 'Medir, aprender e crescer. Acompanhamento de indicadores, identificação de gargalos e apoio a decisões estratégicas.',
    icon: TrendingUp,
    deliverables: ['Diagnóstico de Maturidade Empresarial', 'Painel de Indicadores (KPIs & OKRs)', 'Matriz de Priorização & Planos de Ação']
  }
];

export const HowSharpTransforms: React.FC = () => {
  return (
    <section className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-lg space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-800 bg-cyan-50 px-3.5 py-1 rounded-full border border-cyan-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>Transformação Estratégica Sharp</span>
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Como a Sharp Transforma Empresas
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
          A Sharp estrutura marcas para que elas sejam compreendidas, lembradas e preparadas para crescer.
        </p>
      </div>

      {/* 4 Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          return (
            <div
              key={idx}
              className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100/80 px-2.5 py-0.5 rounded border border-cyan-200">
                    {stage.badge}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900 group-hover:text-cyan-700 transition-colors">
                  {stage.title}
                </h3>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {stage.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Entregáveis do Método:
                </span>
                <ul className="space-y-1.5">
                  {stage.deliverables.map((item, dIdx) => (
                    <li key={dIdx} className="text-[11px] font-medium text-slate-700 flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
