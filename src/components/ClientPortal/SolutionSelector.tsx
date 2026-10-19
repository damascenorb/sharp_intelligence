import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { HeroDashboard } from './HeroDashboard';
import { TechDifferentials } from './TechDifferentials';
import { SubProductsMatrix } from './SubProductsMatrix';

interface SolutionSelectorProps {
  onContinueToBriefing: () => void;
  onGoToPainAnalyzer: () => void;
}

export const SolutionSelector: React.FC<SolutionSelectorProps> = ({ onContinueToBriefing, onGoToPainAnalyzer }) => {
  const { selectedSolutions } = useApp();

  return (
    <div className="space-y-12 sm:space-y-16 max-w-[1200px] mx-auto animate-fadeIn pb-12">
      
      {/* 1. Dynamic Executive Hero Banner */}
      <HeroDashboard 
        onGoToPainAnalyzer={onGoToPainAnalyzer} 
        onScrollToSolutions={() => {
          const el = document.getElementById('subprodutos-matriz');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }} 
      />

      {/* 2. Tabela de Recursos com Itens Riscados / Feature Exclusion Matrix para Subprodutos */}
      <SubProductsMatrix 
        onContinueToBriefing={onContinueToBriefing}
        onGoToPainAnalyzer={onGoToPainAnalyzer}
      />

      {/* 3. Diferenciais de Governança Sharp */}
      <TechDifferentials />

      {/* Executive Callout Footer */}
      <div className="bg-white text-slate-800 border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center justify-center sm:justify-start space-x-2">
            <Sparkles className="w-5 h-5 text-cyan-600" />
            <span>Pronto para Diagnosticar o Momento do Seu Negócio?</span>
          </h3>
          <p className="text-xs text-slate-600 max-w-xl font-medium leading-relaxed">
            Nossos consultores analisam a maturidade da sua empresa e indicam o nível exato de estruturação necessário em Inteligência, Marca, Presença e Escala.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={onGoToPainAnalyzer}
            className="w-full sm:w-auto px-5 py-3 rounded-full bg-cyan-50 hover:bg-cyan-100/80 text-cyan-900 border border-cyan-200/80 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>Diagnóstico com IA</span>
          </button>

          <button
            onClick={onContinueToBriefing}
            className="group w-full sm:w-auto px-7 py-3 rounded-full bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-between gap-3 shadow-md cursor-pointer"
          >
            <span>Preencher Briefing Inteligente</span>
            <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>

    </div>
  );
};

