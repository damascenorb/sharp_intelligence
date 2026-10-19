import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

interface InsightCard {
  id: string;
  stat: string;
  label: string;
  impact: string;
  description: string;
  sharpSolution: string;
}

const INSIGHTS: InsightCard[] = [
  {
    id: 'unit_economics',
    stat: '82%',
    label: 'Desconhecem CAC e LTV Reais',
    impact: 'Gastos ineficientes em marketing sem saber qual canal gera os clientes mais rentáveis.',
    description: 'Empresas investem em atração sem rastrear a rentabilidade líquida por cliente e o custo real de aquisição ao longo do tempo.',
    sharpSolution: 'Mapeamento preciso de unit economics e alocação inteligente de recursos nos canais de maior margem.'
  },
  {
    id: 'predictive',
    stat: 'Gargalo Identificado',
    label: 'Não Utilizam Inteligência Preditiva',
    impact: 'Empresas reagem ao mercado em vez de antecipar oportunidades, mudanças de comportamento dos clientes ou movimentos da concorrência.',
    description: 'A tomada de decisão reativa impede que a empresa se antecipe a tendências e capture fatias de mercado antes dos concorrentes.',
    sharpSolution: 'Monitoramento contínuo de inteligência de mercado e cenários competitivos para decisões estratégicas seguras.'
  },
  {
    id: 'positioning',
    stat: 'Gargalo Identificado',
    label: 'Marca sem Posicionamento',
    impact: 'Empresas possuem bons produtos ou serviços, mas não conseguem transmitir autoridade e valor suficiente para serem lembradas e escolhidas pelo mercado.',
    description: 'A falta de clareza na proposta de valor gera guerras de preço e dificulta o fechamento de contratos de maior valor.',
    sharpSolution: 'Desenvolvimento de estratégia de marca, identidade visual de alto impacto e posicionamento de autoridade.'
  },
  {
    id: 'digital_presence',
    stat: 'Gargalo Identificado',
    label: 'Presença Digital Inconsistente',
    impact: 'Publicações sem estratégia, comunicação desalinhada e baixa frequência fazem a empresa perder relevância diante da concorrência.',
    description: 'A ausência de um ecossistema digital forte deixa a marca invisível para os clientes de alto ticket que buscam soluções online.',
    sharpSolution: 'Gestão de presença digital omnicanal com conteúdo estratégico e narrativa orientada a autoridade e conversão.'
  },
  {
    id: 'planning',
    stat: 'Gargalo Identificado',
    label: 'Crescimento sem Planejamento',
    impact: 'Empresas crescem de forma desorganizada, sem metas claras, indicadores ou direcionamento estratégico.',
    description: 'Tentar escalar sem um plano claro gera desalinhamento entre equipes e desperdício de recursos financeiros e operacionais.',
    sharpSolution: 'Consultoria de crescimento empresarial com definição de metas, prioridades e direcionamento de longo prazo.'
  },
  {
    id: 'perception',
    stat: 'Gargalo Identificado',
    label: 'Decisões Baseadas em Percepção',
    impact: 'A falta de análises estruturadas faz com que decisões importantes sejam tomadas apenas pela experiência ou intuição.',
    description: 'Decidir sem fundamentação analítica aumenta os riscos operacionais e compromete a sustentabilidade do negócio.',
    sharpSolution: 'Diagnóstico empresarial profundo e inteligência de mercado para respaldar cada passo estratégico da liderança.'
  }
];

export const BrazilianMarketInsights: React.FC<{ onGoToDiagnostic: () => void }> = ({ onGoToDiagnostic }) => {
  const [selectedInsight, setSelectedInsight] = useState<string>('unit_economics');

  return (
    <section className="bg-slate-900 rounded-[28px] p-6 sm:p-10 text-white border border-slate-800 shadow-2xl relative overflow-hidden space-y-8">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center space-x-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Gargalos Frequentes em PMEs</span>
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          Os desafios que impedem empresas de crescer
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
          Mapeamento dos principais pontos de atrito e desalinhamentos estratégicos identificados em pequenas e médias empresas brasileiras.
        </p>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INSIGHTS.map((item) => {
          const isSelected = selectedInsight === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedInsight(item.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                isSelected 
                  ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10 scale-[1.02]' 
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-black ${item.stat === '82%' ? 'text-3xl sm:text-4xl text-cyan-400' : 'text-xs uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-500/30 font-bold'}`}>
                  {item.stat}
                </span>
                {isSelected && (
                  <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-500/40">
                    SELECIONADO
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white mt-3 leading-snug">{item.label}</h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{item.impact}</p>
              
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>Ver Diagnóstico & Solução</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Insight Detail Drawer */}
      {selectedInsight && (
        <div className="bg-slate-950/90 border border-slate-800 p-6 rounded-2xl space-y-4 animate-fadeIn">
          {(() => {
            const current = INSIGHTS.find((i) => i.id === selectedInsight)!;
            return (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Gargalo Identificado</span>
                  </div>
                  <h4 className="text-lg font-bold text-white">{current.label}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{current.description}</p>
                </div>

                <div className="md:col-span-5 bg-gradient-to-br from-cyan-950/60 to-slate-900 p-4 rounded-xl border border-cyan-500/30 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Abordagem Estratégica Sharp</span>
                  </div>
                  <p className="text-xs text-cyan-100 leading-relaxed font-medium">{current.sharpSolution}</p>
                  <button
                    onClick={onGoToDiagnostic}
                    className="w-full mt-2 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-md shadow-cyan-600/20"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Eliminar este gargalo na minha empresa</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
};

