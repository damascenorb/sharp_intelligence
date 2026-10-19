import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, MessageSquare, User, Archive, RefreshCw } from 'lucide-react';

export const ArtLeaderQueue: React.FC = () => {
  const { visualInspirations, sendArtLeaderNotes, isClientInactive, toggleArtArchive } = useApp();
  const [selectedInspirationId, setSelectedInspirationId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [artTab, setArtTab] = useState<'active' | 'archived'>('active');

  const isArchivedItem = (item: typeof visualInspirations[0]) => {
    return item.archived === true || isClientInactive(item.companyName) || isClientInactive(item.clientEmail);
  };

  const activeItems = visualInspirations.filter(i => !isArchivedItem(i));
  const archivedItems = visualInspirations.filter(i => isArchivedItem(i));

  const displayedItems = artTab === 'active' ? activeItems : archivedItems;

  const handleSaveNotes = (id: string) => {
    if (!notesText.trim()) return;
    sendArtLeaderNotes(id, notesText);
    setSelectedInspirationId(null);
    setNotesText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>Mesa de Trabalho (Líder de Arte Sharp)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Fila de Análise de Inspiração Visual IA</h1>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Examine e reavalie as referências de imagem geradas pelos clientes por IA. Envie orientações de direção de arte antes do tratamento e vetorização.
          </p>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-center shrink-0">
          <span className="block text-lg font-bold text-purple-800">{visualInspirations.length}</span>
          <span className="text-[10px] text-slate-500">Total Referências</span>
        </div>
      </div>

      {/* Sub-filters for Active vs Archived Art Queue */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 text-xs shadow-2xs">
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl font-semibold">
          <button
            onClick={() => setArtTab('active')}
            className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
              artTab === 'active' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Fila Ativa ({activeItems.length})
          </button>
          <button
            onClick={() => setArtTab('archived')}
            className={`px-4 py-1.5 rounded-lg transition-colors cursor-pointer ${
              artTab === 'archived' ? 'bg-amber-100 text-amber-900 shadow-2xs font-bold border border-amber-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Arquivados ({archivedItems.length})
          </button>
        </div>

        <span className="text-slate-500 font-semibold hidden sm:inline">
          Exibindo {displayedItems.length} item(ns) na {artTab === 'active' ? 'Fila Ativa' : 'Fila Arquivada'}
        </span>
      </div>

      {/* Inspirations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedItems.length === 0 ? (
          <div className="col-span-full bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400 text-xs">
            {artTab === 'active'
              ? 'Nenhuma referência ativa na fila de direção de arte.'
              : 'Nenhum histórico arquivado de clientes inativos.'}
          </div>
        ) : (
          displayedItems.map(item => {
            const isItemArchived = isArchivedItem(item);

            return (
              <div key={item.id} className={`bg-white border rounded-3xl p-6 space-y-4 shadow-sm transition-all ${
                isItemArchived ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}>
                
                {/* Header Details */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <span className="text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded-full uppercase">
                        {item.style}
                      </span>
                      {isItemArchived && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full uppercase">
                          📁 Arquivado
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{item.companyName}</h3>
                    <p className="text-xs text-slate-500 flex items-center space-x-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{item.clientName} ({item.clientEmail})</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      item.status === 'analyzed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {item.status === 'analyzed' ? '✓ Analisado' : '⏳ Pendente'}
                    </span>

                    <button
                      onClick={() => toggleArtArchive(item.id, !item.archived)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-colors flex items-center space-x-1 ${
                        item.archived
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                      title={item.archived ? 'Desarquivar e Mover para Fila Ativa' : 'Arquivar esta arte'}
                    >
                      {item.archived ? <RefreshCw className="w-3 h-3" /> : <Archive className="w-3 h-3" />}
                      <span>{item.archived ? 'Desarquivar' : 'Arquivar Arte'}</span>
                    </button>
                  </div>
                </div>

              {/* Watermarked Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 select-none">
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-slate-900/10 pointer-events-none p-3 flex flex-col justify-between">
                  <span className="bg-slate-900/80 text-cyan-300 text-[9px] font-mono px-2.5 py-0.5 rounded-full w-fit">
                    PAINEL ADMIN • DIREÇÃO DE ARTE
                  </span>
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <strong className="text-slate-400 block text-[10px] uppercase">Prompt de IA enviado pelo cliente:</strong>
                "{item.prompt}"
              </div>

              {/* Art Leader Notes Section */}
              {item.artLeaderNotes ? (
                <div className="bg-purple-50 border border-purple-200 p-3.5 rounded-2xl text-xs text-purple-950 space-y-1">
                  <span className="font-bold text-purple-900 block text-[10px] uppercase">
                    Sua Instrução Registrada para o Cliente:
                  </span>
                  <p className="leading-relaxed">{item.artLeaderNotes}</p>
                </div>
              ) : (
                selectedInspirationId === item.id ? (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <textarea
                      rows={3}
                      value={notesText}
                      onChange={e => setNotesText(e.target.value)}
                      placeholder="Digite sua avaliação técnica como Líder de Arte (ex: 'Direção aprovada. Vamos aplicar o tom champanhe pastel no carrossel institucional...')"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
                    />

                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedInspirationId(null)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSaveNotes(item.id)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                      >
                        Salvar e Enviar p/ Cliente
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedInspirationId(item.id);
                      setNotesText('');
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                    <span>Adicionar Direção de Arte do Líder</span>
                  </button>
                )
              )}

            </div>
          );
        })
        )}
      </div>

    </div>
  );
};
