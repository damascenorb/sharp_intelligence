import React, { useState } from 'react';
import { SHARP_PILLARS } from '../../data/mockData';
import { Globe2, BarChart3, MessageSquareQuote, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ThreePillarsShowcaseProps {
  onGoToBriefing: () => void;
  onGoToDiagnostic: () => void;
}

export const ThreePillarsShowcase: React.FC<ThreePillarsShowcaseProps> = ({ onGoToBriefing, onGoToDiagnostic }) => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('sharp_insights');
  const { toggleSolution, selectedSolutions } = useApp();

  const activePillar = SHARP_PILLARS.find(p => p.id === selectedPillarId) || SHARP_PILLARS[0];

  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'sharp_insights':
        return BarChart3;
      case 'sharp_brand':
        return MessageSquareQuote;
      case 'sharp_presence':
        return Globe2;
      case 'sharp_growth':
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  const handleActivatePillarSolutions = (solutions: string[]) => {
    solutions.forEach(solId => {
      if (!selectedSolutions.includes(solId as any)) {
        toggleSolution(solId as any);
      }
    });
    onGoToBriefing();
  };

  return (
    <section className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-xl relative overflow-hidden space-y-8">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-widest text-cyan-800 bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>Metodologia Operacional Sharp</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Os 4 Pilares da Metodologia Sharp
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
          Compreender → Posicionar → Comunicar → Medir e Crescer. Nossa metodologia estruturada transforma empresas em marcas fortes, coerentes e preparadas para crescer.
        </p>
      </div>

      {/* Pillar Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10">
        {SHARP_PILLARS.map((pillar) => {
          const Icon = getPillarIcon(pillar.id);
          const isSelected = pillar.id === selectedPillarId;

          return (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillarId(pillar.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-50/80 via-white to-cyan-50/30 border-cyan-500 shadow-md ring-1 ring-cyan-400/40 scale-[1.01]'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-cyan-600 text-white font-bold shadow-2xs' : 'bg-slate-200 text-slate-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  isSelected ? 'bg-cyan-100 text-cyan-800 border-cyan-300' : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}>
                  {pillar.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{pillar.title}</h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">{pillar.subtitle}</p>
              </div>

              <div className="pt-2 text-[11px] font-bold text-cyan-700 flex items-center space-x-1">
                <span>{isSelected ? 'Pilar Selecionado' : 'Explorar Pilar'}</span>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-cyan-600' : 'text-slate-400'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Pillar Detailed Showcase */}
      <div className="bg-slate-50/80 rounded-2xl p-6 sm:p-8 border border-slate-200/90 space-y-6 relative z-10 animate-fadeIn">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-cyan-800">
              DETALHAMENTO DO PILAR SHARP
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2.5">
              <span>{activePillar.title}</span>
              <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                {activePillar.subtitle}
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {activePillar.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => handleActivatePillarSolutions(activePillar.mappedSolutions)}
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>Ativar Soluções do Pilar</span>
            </button>
            <button
              onClick={onGoToDiagnostic}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
            >
              <span>Auditar Pilar no Diagnóstico</span>
            </button>
          </div>
        </div>

        {/* Grid of Capabilities & Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Key Capabilities */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-3 shadow-2xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-800 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>Entregáveis e Capacidades do Pilar</span>
            </h4>
            <ul className="space-y-2.5">
              {activePillar.keyCapabilities.map((cap, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Impact Metrics */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 space-y-3 shadow-2xs">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Métricas de Impacto e Resultado Esperado</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {activePillar.impactMetrics.map((metric, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{metric}</span>
                  <span className="text-[10px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Garantia Sharp
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
