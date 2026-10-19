import React from 'react';
import { 
  Sparkles, Globe2, BarChart3, MessageSquareQuote, Zap, 
  ShieldCheck, Target, TrendingUp, Layers 
} from 'lucide-react';

const DIFFERENTIALS = [
  {
    icon: BarChart3,
    title: '01. Sharp Insights (Compreender)',
    description: 'Compreender antes de decidir. Pesquisa do negócio, clientes, concorrentes, mercado e oportunidades para diagnósticos estratégicos.'
  },
  {
    icon: MessageSquareQuote,
    title: '02. Sharp Brand (Posicionar)',
    description: 'Definir como a empresa deve ser percebida. Posicionamento, proposta de valor, tom de voz, manifesto e identidade visual completa.'
  },
  {
    icon: Globe2,
    title: '03. Sharp Presence (Comunicar)',
    description: 'Transformar a estratégia em comunicação constante. Conteúdo editorial, copywriting persuasivo, design autoral e presença digital.'
  },
  {
    icon: TrendingUp,
    title: '04. Sharp Growth (Medir e Crescer)',
    description: 'Medir, aprender e crescer. Acompanhamento de indicadores, solução de gargalos operacionais e planos de ação para a evolução do negócio.'
  },
  {
    icon: Target,
    title: 'Transformação Integrada',
    description: 'A Sharp não vende apenas logotipos ou posts: vende a estruturação completa para que a marca seja compreendida, lembrada e preparada para crescer.'
  },
  {
    icon: ShieldCheck,
    title: 'Processo Operacional Rigoroso',
    description: 'Conexão entre diagnóstico, estratégia, criação autoral, aplicação em canais e acompanhamento de metas.'
  }
];

export const TechDifferentials: React.FC = () => {
  return (
    <section className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-lg space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-800 bg-cyan-50 px-3.5 py-1 rounded-full border border-cyan-200">
          Diferenciais Estratégicos
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          O Diferencial da Sharp Intelligence
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm font-medium">
          Unimos inteligência de mercado, estratégia de marca, comunicação visual e acompanhamento para transformar empresas em marcas mais fortes e competitivas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DIFFERENTIALS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 space-y-3 group hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors shadow-2xs">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-cyan-700 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

