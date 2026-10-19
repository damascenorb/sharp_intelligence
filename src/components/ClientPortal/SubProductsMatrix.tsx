import React, { useState } from 'react';
import { SUB_PRODUCTS_TIERS, SHARP_SOLUTIONS } from '../../data/mockData';
import { SolutionId } from '../../types';
import { Check, X, Sparkles, BarChart3, MessageSquareQuote, Globe2, TrendingUp, ArrowRight, ShieldCheck, CheckCircle2, Target } from 'lucide-react';

interface SubProductsMatrixProps {
  onContinueToBriefing: () => void;
  onGoToPainAnalyzer?: () => void;
}

export const SubProductsMatrix: React.FC<SubProductsMatrixProps> = ({ onContinueToBriefing }) => {
  const [activeProductId, setActiveProductId] = useState<SolutionId>('sharp_insights');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');

  const productsList = [
    {
      id: 'sharp_insights' as SolutionId,
      number: '01',
      title: 'Sharp Insights',
      subtitle: 'Compreender',
      tagline: 'Inteligência & Diagnóstico',
      icon: BarChart3,
    },
    {
      id: 'sharp_brand' as SolutionId,
      number: '02',
      title: 'Sharp Brand',
      subtitle: 'Posicionar',
      tagline: 'Marca & Identidade',
      icon: MessageSquareQuote,
    },
    {
      id: 'sharp_presence' as SolutionId,
      number: '03',
      title: 'Sharp Presence',
      subtitle: 'Comunicar',
      tagline: 'Presença Digital',
      icon: Globe2,
    },
    {
      id: 'sharp_growth' as SolutionId,
      number: '04',
      title: 'Sharp Growth',
      subtitle: 'Medir e Crescer',
      tagline: 'Governança & KPIs',
      icon: TrendingUp,
    },
  ];

  const currentProduct = SHARP_SOLUTIONS.find(s => s.id === activeProductId) || SHARP_SOLUTIONS[0];
  const activeTiers = SUB_PRODUCTS_TIERS.filter(t => t.productId === activeProductId);

  // Collect all unique feature names for the matrix view, sorted by check count (most checks at top, X's at bottom)
  const allFeatureNames = Array.from(
    new Set(activeTiers.flatMap(tier => tier.features.map(f => f.name)))
  ).sort((a, b) => {
    const checksA = activeTiers.filter(t => t.features.find(f => f.name === a)?.included).length;
    const checksB = activeTiers.filter(t => t.features.find(f => f.name === b)?.included).length;
    return checksB - checksA; // Highest count of checks first
  });

  return (
    <div className="space-y-8 animate-fadeIn" id="subprodutos-matriz">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Matriz Estruturada de Recursos & Subprodutos</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Níveis de Profundidade por Produto
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
          Cada produto Sharp possui versões desenhadas para o momento atual do seu negócio — da estruturação essencial ao acompanhamento estratégico C-Level.
        </p>
      </div>

      {/* Split Layout: Products Selection (Left) & Active Product Overview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left Column: 4 Products Selection List */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-2.5 p-3 bg-slate-100/90 rounded-3xl border border-slate-200 shadow-xs h-full">
          {productsList.map((prod) => {
            const Icon = prod.icon;
            const isActive = activeProductId === prod.id;

            return (
              <button
                key={prod.id}
                onClick={() => setActiveProductId(prod.id)}
                className={`flex-1 p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 flex items-center justify-between cursor-pointer border relative overflow-hidden ${
                  isActive
                    ? 'bg-white text-slate-900 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {prod.number} • {prod.subtitle}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold tracking-tight truncate text-slate-900">{prod.title}</h3>
                    <p className={`text-[11px] font-medium truncate mt-0.5 ${isActive ? 'text-slate-600' : 'text-slate-500'}`}>
                      {prod.tagline}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Product Details Text */}
        <div className="lg:col-span-7 bg-white text-slate-800 p-5 sm:p-6 rounded-3xl border border-slate-200/90 flex flex-col justify-between shadow-sm space-y-4 h-full">
          <div className="space-y-3.5">
            {/* Category & Tagline */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/80">
                {currentProduct.category}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">• {currentProduct.tagline}</span>
            </div>

            {/* Title & Client Desire */}
            <h3 className="text-base sm:text-lg lg:text-xl font-black text-slate-900 leading-tight tracking-tight">
              {currentProduct.name}: <span className="text-blue-600 font-semibold italic">"{currentProduct.clientDesire}"</span>
            </h3>

            {/* Main Description */}
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {currentProduct.description}
            </p>

            {/* Key Deliverables List */}
            {currentProduct.deliverables && currentProduct.deliverables.length > 0 && (
              <div className="pt-1 space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Entregáveis e Mapeamentos Chave:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {currentProduct.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200/60 text-[11px] font-medium text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span className="leading-snug truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Recommendation Box */}
            {currentProduct.recommendedFor && (
              <div className="bg-gradient-to-r from-blue-50/80 to-slate-50 p-2.5 sm:p-3 rounded-xl border border-blue-100 flex items-start space-x-2.5 text-[11px] text-slate-700">
                <Target className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <span className="font-extrabold text-blue-900 uppercase tracking-wider text-[9px] block">Indicado Para:</span>
                  <p className="font-medium text-slate-600 leading-snug">{currentProduct.recommendedFor}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Line */}
          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="font-semibold text-slate-400">Solução Integrada Sharp Intelligence</span>
            <span className="font-extrabold text-blue-700">{currentProduct.name}</span>
          </div>
        </div>

      </div>

      {/* Standalone View Mode Toggle Ribbon (Detached below division) */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-100 text-slate-800 p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs gap-3">
        <span className="text-xs sm:text-sm font-bold text-slate-700 sm:pl-2">
          Modo de Exibição dos Recursos ({currentProduct.name})
        </span>
        <div className="bg-white p-1 rounded-xl flex items-center border border-slate-200 text-xs font-bold w-full sm:w-auto justify-center shadow-xs">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'cards' ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cards Riscados
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'matrix' ? 'bg-blue-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Matriz Comparativa
          </button>
        </div>
      </div>

      {/* MODE 1: Strikethrough Pricing Cards */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTiers.map((tier) => {
            // Sort features: included (check) FIRST, not included (cross) LAST
            const sortedFeatures = [...tier.features].sort((a, b) => Number(b.included) - Number(a.included));

            return (
              <div
                key={tier.id}
                className={`rounded-2xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between relative border ${
                  tier.popular
                    ? 'bg-white border-cyan-500 shadow-xl ring-2 ring-cyan-500/20'
                    : 'bg-white border-slate-200 shadow-md hover:border-slate-300'
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                    ★ {tier.badge || 'Mais Escolhido'}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Tier Title & Badge */}
                  <div>
                    {!tier.popular && tier.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 inline-block mb-2">
                        {tier.badge}
                      </span>
                    )}
                    <h4 className="text-lg font-black text-slate-900 tracking-tight mt-1">{tier.name}</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                      {tier.description}
                    </p>
                  </div>

                  {/* Target Profile Box */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-0.5">Indicado para:</span>
                    {tier.targetProfile}
                  </div>

                  {/* Divider */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block mb-3">
                      Recursos e Entregáveis Inclusos:
                    </span>

                    {/* Strikethrough Feature List (Checks Above, Crosses Below) */}
                    <ul className="space-y-2.5 text-xs">
                      {sortedFeatures.map((feat, idx) => {
                        return (
                          <li
                            key={idx}
                            className={`flex items-start space-x-2.5 ${
                              feat.included
                                ? 'text-slate-800 font-medium'
                                : 'text-slate-400 line-through opacity-50 decoration-slate-400 select-none'
                            }`}
                          >
                            {feat.included ? (
                              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                                <X className="w-3 h-3 stroke-[2.5]" />
                              </div>
                            )}
                            <span className="leading-tight">{feat.name}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Status */}
                <div className="pt-5 mt-6 border-t border-slate-100 text-center">
                  <span className="inline-block text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    Estrutura Nível {tier.shortName}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODE 2: Comprehensive Matrix Table */}
      {viewMode === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-900 text-white border-b border-slate-800">
                  <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider w-2/5">
                    Recursos & Entregáveis ({currentProduct.name})
                  </th>
                  {activeTiers.map(tier => (
                    <th key={tier.id} className="p-4 sm:p-5 text-center text-xs font-extrabold border-l border-slate-800 w-1/5">
                      <div className="space-y-1">
                        {tier.badge && (
                          <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30 inline-block">
                            {tier.badge}
                          </span>
                        )}
                        <span className="block text-sm font-black text-white">{tier.shortName}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {allFeatureNames.map((featName, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-800 leading-snug">
                      {featName}
                    </td>
                    {activeTiers.map(tier => {
                      const feat = tier.features.find(f => f.name === featName);
                      const isInc = feat?.included ?? false;

                      return (
                        <td key={tier.id} className="p-3.5 sm:p-4 text-center border-l border-slate-100">
                          {isInc ? (
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-black">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-300">
                              <X className="w-4 h-4" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Footer Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Processo Integrado Sharp Intelligence</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            A Sharp não vende logotipos ou posts isolados.
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl">
            Projetamos a estruturação estratégica completa para que sua empresa seja compreendida, lembrada e preparada para crescer de forma sustentável.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            onClick={onContinueToBriefing}
            className="w-full sm:w-auto px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Iniciar Diagnóstico Executivo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

