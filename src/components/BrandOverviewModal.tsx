import React from 'react';
import { X, CheckCircle, Target, Sparkles, Layers, UserCheck, ShieldCheck } from 'lucide-react';
import { SHARP_SOLUTIONS, SHARP_PILLARS } from '../data/mockData';
import { SharpLogo } from './SharpLogo';

interface BrandOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandOverviewModal: React.FC<BrandOverviewModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-800">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-xs">
              <SharpLogo size="sm" showText={false} textColor="text-slate-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Sharp Intelligence</h2>
              <p className="text-xs text-cyan-700 font-medium">Estúdio de estratégia, marca, comunicação e crescimento para PMEs.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 max-h-[75vh] overflow-y-auto">
          
          {/* Mission & Positioning */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-sm uppercase tracking-wider text-cyan-700 font-bold flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Posicionamento Estratégico Sharp</span>
            </h3>
            <p className="text-base font-medium text-slate-700 italic leading-relaxed">
              "A Sharp estrutura marcas para que elas sejam compreendidas, lembradas e preparadas para crescer. Unimos inteligência de mercado, estratégia de marca, comunicação visual e acompanhamento para transformar empresas em marcas mais fortes e competitivas."
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center shadow-2xs">
                <span className="block text-xs text-slate-500">Posicionamento</span>
                <span className="text-xs font-semibold text-slate-900">Estruturação & Marca</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center shadow-2xs">
                <span className="block text-xs text-slate-500">Transformação</span>
                <span className="text-xs font-semibold text-slate-900">Compreender, Posicionar e Crescer</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center shadow-2xs">
                <span className="block text-xs text-slate-500">Público-Alvo</span>
                <span className="text-xs font-semibold text-slate-900">Pequenas e Médias Empresas</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-center shadow-2xs">
                <span className="block text-xs text-slate-500">Pilares</span>
                <span className="text-xs font-semibold text-cyan-700">Insights, Brand, Presence, Growth</span>
              </div>
            </div>
          </div>

          {/* Methodology Pillars */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-600" />
              <span>A Metodologia Sharp em 4 Pilares</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {SHARP_PILLARS.map((pilar) => (
                <div key={pilar.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-200 inline-block mb-1">
                      {pilar.badge}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{pilar.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{pilar.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-semibold text-cyan-700 block">{pilar.impactMetrics[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Matrix */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-600" />
              <span>Arquitetura de Produtos Sharp</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SHARP_SOLUTIONS.map(sol => (
                <div key={sol.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-cyan-400 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-cyan-800 text-lg">{sol.name}</span>
                      <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium">{sol.category}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">{sol.description}</p>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-cyan-800 font-medium mb-3">
                      💡 {sol.clientDesire}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">Entregáveis principais:</span>
                    <ul className="space-y-1">
                      {sol.deliverables.slice(0, 3).map((d, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-center space-x-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Roles */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-sm uppercase tracking-wider text-cyan-700 font-bold flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>Papéis da Equipe Sharp</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900 text-sm block">Raphael</span>
                <span className="text-xs text-cyan-700 font-medium block">Estrategista & Gestão</span>
                <p className="text-xs text-slate-500 mt-1">Diagnóstico, posicionamento, planejamento, revisão estratégica e gestão de projetos.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900 text-sm block">Luan</span>
                <span className="text-xs text-purple-700 font-medium block">Design & Direção Visual</span>
                <p className="text-xs text-slate-500 mt-1">Direção visual, identidade de marca, artes, padrões e manuais visuais.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900 text-sm block">Ingrid</span>
                <span className="text-xs text-emerald-700 font-medium block">Comercial & Prospecção</span>
                <p className="text-xs text-slate-500 mt-1">Prospecção de leads, qualificação, propostas, negociações e handoff comercial.</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900 text-sm block">Cristiano & Lucas</span>
                <span className="text-xs text-amber-700 font-medium block">Conteúdo & Atendimento</span>
                <p className="text-xs text-slate-500 mt-1">Estratégias de conteúdo, comunicação com clientes e suporte de atendimento.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Modelo Operacional Sharp Intelligence</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-cyan-600 text-white font-bold transition-all cursor-pointer"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
