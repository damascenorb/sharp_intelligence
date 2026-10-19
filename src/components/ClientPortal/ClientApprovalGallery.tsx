import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentDeliverable } from '../../types';
import { 
  Check, Edit3, Clock, CheckCircle2, FileText, ImageIcon, CheckCircle, 
  XCircle, X, ChevronLeft, ChevronRight, Film, Layers, AlertCircle, MessageSquare
} from 'lucide-react';

export const ClientApprovalGallery: React.FC = () => {
  const { projects, clientInfo, submitClientDecision, toggleOnboardingItem } = useApp();

  const activeProject = projects.find(
    p => p.clientEmail?.toLowerCase() === clientInfo.email?.toLowerCase() ||
         p.companyName?.toLowerCase() === clientInfo.companyName?.toLowerCase()
  ) || projects[0];

  const [selectedItem, setSelectedItem] = useState<ContentDeliverable | null>(null);
  const [modalActionType, setModalActionType] = useState<'rejected' | 'revision'>('revision');
  const [feedbackText, setFeedbackText] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeSlideIndexMap, setActiveSlideIndexMap] = useState<Record<string, number>>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'refazer'>('all');

  if (!activeProject) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 max-w-2xl mx-auto my-12 text-slate-700 shadow-sm">
        <Clock className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Nenhum Projeto Ativo Encontrado</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Seu projeto de branding e produção de arte será exibido assim que ativado pela equipe Sharp Intelligence.
        </p>
      </div>
    );
  }

  const handleApprove = (deliverableId: string) => {
    submitClientDecision(activeProject.id, deliverableId, 'approved');
  };

  const handleOpenFeedbackModal = (item: ContentDeliverable, action: 'rejected' | 'revision') => {
    setSelectedItem(item);
    setModalActionType(action);
    setFeedbackText(item.clientFeedback && item.clientFeedback !== 'Aprovado pelo cliente' ? item.clientFeedback : '');
    setShowFeedbackModal(true);
  };

  const handleConfirmFeedback = () => {
    if (!selectedItem || !feedbackText.trim()) return;
    submitClientDecision(activeProject.id, selectedItem.id, modalActionType, feedbackText.trim());
    setShowFeedbackModal(false);
    setSelectedItem(null);
    setFeedbackText('');
  };

  const handlePrevSlide = (itemId: string, total: number) => {
    setActiveSlideIndexMap(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + total) % total
    }));
  };

  const handleNextSlide = (itemId: string, total: number) => {
    setActiveSlideIndexMap(prev => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % total
    }));
  };

  const allItems = activeProject.contentItems || [];
  
  const filteredItems = allItems.filter(item => {
    if (activeFilter === 'pending') {
      return item.status === 'ready_for_review' || item.status === 'pending_client_approval';
    }
    if (activeFilter === 'approved') {
      return item.status === 'approved';
    }
    if (activeFilter === 'refazer') {
      return item.status === 'rejected' || item.status === 'revision_requested' || item.status === 'changes_requested';
    }
    return true;
  });

  const pendingCount = allItems.filter(i => i.status === 'ready_for_review' || i.status === 'pending_client_approval').length;
  const approvedCount = allItems.filter(i => i.status === 'approved').length;
  const refazerCount = allItems.filter(i => i.status === 'rejected' || i.status === 'revision_requested' || i.status === 'changes_requested').length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Project Banner Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-[10px] font-bold bg-cyan-50 text-cyan-800 px-2.5 py-1 rounded-full border border-cyan-200 uppercase tracking-wider">
              Portal do Cliente • Aprovação de Artes
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold uppercase">
              Etapa: {activeProject.stage.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeProject.companyName}
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Equipe Criativa: <strong className="text-slate-900">{activeProject.assignedTeam?.designer || 'Luan'}</strong> (Designer) • <strong className="text-slate-900">{activeProject.assignedTeam?.strategist || 'Raphael'}</strong> (Estrategista)
          </p>
        </div>

        {/* Status Counter */}
        <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
          <div className="text-center px-3 border-r border-slate-200">
            <span className="block text-lg font-bold text-slate-900">{allItems.length}</span>
            <span className="text-[10px] text-slate-500">Total Peças</span>
          </div>
          <div className="text-center px-3 border-r border-slate-200">
            <span className="block text-lg font-bold text-cyan-700">{pendingCount}</span>
            <span className="text-[10px] text-slate-500">Em Avaliação</span>
          </div>
          <div className="text-center px-3 border-r border-slate-200">
            <span className="block text-lg font-bold text-emerald-700">{approvedCount}</span>
            <span className="text-[10px] text-slate-500">Aprovadas</span>
          </div>
          <div className="text-center px-3">
            <span className="block text-lg font-bold text-red-600">{refazerCount}</span>
            <span className="text-[10px] text-slate-500">Refazer</span>
          </div>
        </div>
      </div>

      {/* Onboarding Checklist Section */}
      {activeProject.onboardingChecklist && activeProject.onboardingChecklist.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              <span>Checklist de Onboarding & Materiais de Acesso</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {activeProject.onboardingChecklist.filter(i => i.completed).length}/{activeProject.onboardingChecklist.length} concluídos
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeProject.onboardingChecklist.map(item => (
              <div
                key={item.id}
                onClick={() => toggleOnboardingItem(activeProject.id, item.id)}
                className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  item.completed
                    ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                    : 'bg-white border-slate-200 text-slate-900 hover:border-cyan-600'
                }`}
              >
                <span className="text-xs font-semibold">{item.label}</span>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  item.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-slate-50'
                }`}>
                  {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deliverables Approval Feed */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-cyan-600" />
              <span>Galeria de Aprovação de Peças & Conteúdos</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Toda arte deve ser validada por você. Ao reprovar ou solicitar revisão, detalhe as observações de mudança.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas ({allItems.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'pending' ? 'bg-white text-cyan-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Em Avaliação ({pendingCount})
            </button>
            <button
              onClick={() => setActiveFilter('approved')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'approved' ? 'bg-white text-emerald-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aprovadas ({approvedCount})
            </button>
            <button
              onClick={() => setActiveFilter('refazer')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilter === 'refazer' ? 'bg-white text-red-600 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Refazer ({refazerCount})
            </button>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-2">
            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
            <p className="text-sm font-semibold text-slate-700">Nenhuma peça nesta visualização</p>
            <p className="text-xs text-slate-400">Alterne os filtros acima para ver outras peças do projeto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const isRefazer = item.status === 'rejected' || item.status === 'revision_requested' || item.status === 'changes_requested';
              const isApproved = item.status === 'approved';
              const isPending = item.status === 'ready_for_review' || item.status === 'pending_client_approval';

              const slides = item.mediaUrls && item.mediaUrls.length > 0 ? item.mediaUrls : [item.mediaUrl];
              const currentSlideIndex = activeSlideIndexMap[item.id] || 0;
              const currentMedia = slides[currentSlideIndex] || item.mediaUrl;
              const isVideo = item.type === 'video' || item.formatDetails?.isVideo || currentMedia.endsWith('.mp4') || currentMedia.includes('video');
              const isCarousel = item.type === 'carousel_static' || item.type === 'carousel' || slides.length > 1;

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between transition-all relative ${
                    isApproved
                      ? 'border-emerald-300 ring-1 ring-emerald-200'
                      : isRefazer
                      ? 'border-red-300 ring-1 ring-red-200'
                      : 'border-slate-200 hover:border-cyan-300'
                  }`}
                >
                  {/* Media Preview Header */}
                  <div>
                    <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden group">
                      {isVideo ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                          {currentMedia.startsWith('http') && currentMedia.endsWith('.mp4') ? (
                            <video src={currentMedia} controls className="w-full h-full object-contain" />
                          ) : (
                            <img
                              src={currentMedia || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80'}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover opacity-80"
                            />
                          )}
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-bold flex items-center space-x-1">
                            <Film className="w-3 h-3" />
                            <span>VÍDEO / MOTION</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={currentMedia}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Carousel Slide Navigator */}
                      {isCarousel && slides.length > 1 && (
                        <div className="absolute inset-x-0 bottom-2 flex items-center justify-between px-3">
                          <button
                            type="button"
                            onClick={() => handlePrevSlide(item.id, slides.length)}
                            className="p-1 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs backdrop-blur-xs transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <span className="px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-bold backdrop-blur-xs">
                            Slide {currentSlideIndex + 1} de {slides.length}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleNextSlide(item.id, slides.length)}
                            className="p-1 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs backdrop-blur-xs transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs border ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isRefazer
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                        }`}>
                          {isApproved
                            ? '✓ Aprovada'
                            : isRefazer
                            ? '✕ Refazer Solicitado'
                            : '⏳ Em Avaliação com o Cliente'}
                        </span>
                      </div>

                      {/* STAMP "REFAZER" (Carimbo Estilizado) */}
                      {isRefazer && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="border-4 border-red-600/90 text-red-600 bg-red-50/90 backdrop-blur-xs font-black tracking-widest text-2xl uppercase px-5 py-2 rounded-2xl transform -rotate-12 shadow-2xl animate-scaleIn select-none">
                            REFAZER
                          </div>
                        </div>
                      )}

                      {/* Format tag */}
                      <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                        {isCarousel ? '📑 CARROSSEL' : isVideo ? '🎬 VÍDEO' : item.type.toUpperCase()}
                      </div>
                    </div>

                    {/* Title and Copy Text */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                        <span className="text-[10px] text-slate-400">Produzido por {item.uploadedBy}</span>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1">
                        <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider flex items-center space-x-1">
                          <FileText className="w-3 h-3 text-cyan-600" />
                          <span>Copy / Informações:</span>
                        </span>
                        <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
                          {item.copyText}
                        </p>
                      </div>

                      {/* Prominent REFAZER Observation Card */}
                      {isRefazer && (
                        <div className="bg-red-50/90 border border-red-300 p-3 rounded-2xl text-xs text-red-900 space-y-1 animate-fadeIn">
                          <div className="flex items-center space-x-1.5 font-extrabold text-red-800 uppercase text-[11px]">
                            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                            <span>Observações de Mudança / Refazer:</span>
                          </div>
                          <p className="text-xs text-red-900 font-medium bg-white/90 p-2 rounded-xl border border-red-200 whitespace-pre-line">
                            {item.clientFeedback || 'Alterações solicitadas pelo cliente para a equipe criativa.'}
                          </p>
                        </div>
                      )}

                      {isApproved && (
                        <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs text-emerald-900 font-bold flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Peça Aprovada pelo Cliente — Pronta para publicação</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3 Action Buttons (Aprovar, Reprovar, Revisar) */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      className={`py-2 px-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1 shadow-2xs cursor-pointer ${
                        isApproved
                          ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Aprovar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenFeedbackModal(item, 'rejected')}
                      className={`py-2 px-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1 shadow-2xs cursor-pointer ${
                        item.status === 'rejected'
                          ? 'bg-red-600 text-white ring-2 ring-red-400'
                          : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reprovar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenFeedbackModal(item, 'revision')}
                      className={`py-2 px-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1 shadow-2xs cursor-pointer ${
                        item.status === 'revision_requested' || item.status === 'changes_requested'
                          ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Revisar</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mandatory Feedback Modal for Reprovar & Revisar */}
      {showFeedbackModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                {modalActionType === 'rejected' ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>Reprovar Peça & Carimbar "REFAZER"</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span>Solicitar Revisão / Mudanças</span>
                  </>
                )}
              </h3>
              <button 
                onClick={() => setShowFeedbackModal(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl text-xs text-amber-900 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong>Observações de mudança obrigatórias:</strong> Para que a equipe Sharp Intelligence realize a refação precisa da peça, detalhe exatamente o que precisa ser ajustado.
              </p>
            </div>

            <textarea
              rows={4}
              required
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              placeholder={
                modalActionType === 'rejected'
                  ? 'Ex: O estilo visual não condiz com a identidade da marca, precisamos reformular o conceito visual, cores e tipografia...'
                  : 'Ex: Trocar a foto do slide 2, corrigir a frase do título e ajustar a paleta de cores secundária...'
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                {!feedbackText.trim() ? 'Digite ao menos uma observação de mudança.' : '✓ Observação preenchida'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmFeedback}
                  disabled={!feedbackText.trim()}
                  className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                    modalActionType === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {modalActionType === 'rejected' ? 'Confirmar Reprovação (Refazer)' : 'Enviar Observações de Revisão'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
