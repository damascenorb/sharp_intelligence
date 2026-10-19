import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Sparkles, Send, RefreshCw, Lock, Eye, CheckCircle } from 'lucide-react';

interface VisualInspirationAIProps {
  onGoToArtQueueNotice?: () => void;
}

export const VisualInspirationAI: React.FC<VisualInspirationAIProps> = () => {
  const { generateVisual, isGeneratingVisual, clientInfo, visualInspirations } = useApp();

  const [promptText, setPromptText] = useState(
    'Conceito de feed de Instagram para clínica estética odontológica de luxo com tons bege champagne, detalhes dourados minimalistas, iluminação suave e tipografia serifada moderna'
  );
  const [style, setStyle] = useState('Luxo Minimalista & Clean');
  const [sentNotice, setSentNotice] = useState(false);

  const clientInspirations = visualInspirations.filter(
    v => v.clientEmail.toLowerCase() === clientInfo.email.toLowerCase()
  );

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    setSentNotice(false);
    await generateVisual(promptText, style);
  };

  const handleSendToDesigner = () => {
    setSentNotice(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-cyan-50 border border-cyan-200/80 text-cyan-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-cyan-600" />
            <span>Inspiração Visual de Marca com Proteção Intelectual</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gerador de Referência Visual para o Designer
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed">
            Crie conceitos estéticos por IA para instruir nosso Líder de Arte (Luan) na direção criativa da sua marca. As referências são transmitidas diretamente para a mesa do designer com proteção de propriedade intelectual.
          </p>
        </div>
      </div>

      {/* Input Generator */}
      <form onSubmit={handleGenerate} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Prompt do Estilo / Referência Visual Desejada
            </label>
            <input
              type="text"
              required
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder="Descreva o universo visual (ex: minimalista, vibrante, escuro com néon...)"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Estilo de Design
            </label>
            <select
              value={style}
              onChange={e => setStyle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
            >
              <option value="Luxo Minimalista & Clean">Luxo Minimalista & Clean</option>
              <option value="Moderno & Vibrante">Moderno & Vibrante</option>
              <option value="Corporate & Tech">Corporate & Tech</option>
              <option value="Editorial & Orgânico">Editorial & Orgânico</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center space-x-2 text-[11px] text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            <Lock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>Imagens protegidas por marca d'água contra reprodução sem aprovação.</span>
          </div>

          <button
            type="submit"
            disabled={isGeneratingVisual || !promptText.trim()}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-xs ${
              isGeneratingVisual || !promptText.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-cyan-700 text-white cursor-pointer'
            }`}
          >
            {isGeneratingVisual ? (
              <span className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Renderizando Conceito...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Gerar Imagem de Inspiração</span>
              </span>
            )}
          </button>
        </div>
      </form>

      {/* Generated Inspirations Queue Display with Protected Watermark Canvas */}
      {clientInspirations.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-cyan-600" />
            <span>Minhas Referências Geradas para o Designer</span>
          </h2>

          {sentNotice && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-emerald-800 text-xs flex items-center justify-between animate-fadeIn">
              <span className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Inspiração enviada para a fila de análise do Líder de Arte Luan!</span>
              </span>
              <span className="font-semibold text-emerald-900">Registrado na Fila Sharp</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clientInspirations.map(item => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-4 p-5 relative group"
                onContextMenu={e => e.preventDefault()}
                onDragStart={e => e.preventDefault()}
              >
                {/* Protected Watermarked Image Display */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 select-none">
                  <img
                    src={item.imageUrl}
                    alt="Referência Visual"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover pointer-events-none filter select-none"
                  />

                  {/* Watermark Overlay (Anti-Screenshot / Anti-Copy) */}
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[0.5px] pointer-events-none flex flex-col justify-between p-4 border border-cyan-500/20">
                    <div className="flex justify-between items-start">
                      <span className="bg-slate-900/90 text-cyan-300 border border-cyan-500/40 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                        PROPRIEDADE SHARP INTELLIGENCE
                      </span>
                      <span className="bg-slate-900/90 text-slate-200 text-[9px] font-mono px-2 py-0.5 rounded">
                        {item.clientEmail}
                      </span>
                    </div>

                    <div className="text-center opacity-40 select-none rotate-[-25deg] transform">
                      <p className="text-xl font-black text-white tracking-widest drop-shadow-md">
                        SHARP ARTWORK - APENAS REVISÃO
                      </p>
                      <p className="text-xs font-mono text-cyan-200 drop-shadow-md">
                        {item.companyName} • LÍDER DE ARTE LUAN
                      </p>
                    </div>

                    <div className="flex justify-between items-end text-[9px] text-white bg-slate-900/80 p-2 rounded-xl">
                      <span>NÃO REPRODUZIR</span>
                      <span>STATUS: {item.status === 'pending_art_leader' ? 'EM ANÁLISE PELO DESIGNER' : 'REVISADO POR LUAN'}</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cyan-800 font-bold bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">{item.style}</span>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 italic line-clamp-2">
                    "{item.prompt}"
                  </p>

                  {item.artLeaderNotes && (
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-800">
                      <span className="font-bold text-slate-900 block mb-0.5">Nota de Luan (Líder de Arte):</span>
                      {item.artLeaderNotes}
                    </div>
                  )}

                  {/* Dispatch to Designer Action */}
                  <button
                    onClick={handleSendToDesigner}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Enviar Inspiração para meu Designer (Luan)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
