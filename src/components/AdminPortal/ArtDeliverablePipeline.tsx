import React, { useState, useRef } from 'react';
import { Project, ContentDeliverable, ProjectSubProduct, ContentDeliverableFile } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MessageSquare,
  Copy,
  Download,
  Eye,
  Check,
  X,
  FileImage,
  Send,
  RefreshCw,
  Trash2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  ThumbsUp,
  Image as ImageIcon,
  Film,
  Layers,
  Palette,
  FileText
} from 'lucide-react';

interface ArtDeliverablePipelineProps {
  project: Project;
  subProduct?: ProjectSubProduct;
  productId?: string;
  subProductId?: string;
}

export const ArtDeliverablePipeline: React.FC<ArtDeliverablePipelineProps> = ({
  project,
  subProduct,
  productId,
  subProductId
}) => {
  const {
    uploadContentDeliverable,
    approveContent,
    requestContentAdjustment,
    submitClientDecision,
    deleteDeliverable,
    submitInternalReview,
    sendDeliverableToClientApproval,
    accounts,
    toggleReworkTaskStatus,
    currentUser
  } = useApp();

  // Upload Box State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'feed_post' | 'carousel_static' | 'video' | 'story' | 'copy' | 'brand_identity' | 'file'>('feed_post');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80');
  const [uploadedFiles, setUploadedFiles] = useState<ContentDeliverableFile[]>([]);
  const [copyText, setCopyText] = useState('');
  const [uploadedBy, setUploadedBy] = useState('Luan (Líder de Arte)');
  const [destinationFlow, setDestinationFlow] = useState<'client_chat' | 'internal_review' | 'draft'>('client_chat');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);

  // Review & Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDeliverableForModal, setSelectedDeliverableForModal] = useState<ContentDeliverable | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isInternalRefactorOpen, setIsInternalRefactorOpen] = useState(false);
  const [internalRefactorNotes, setInternalRefactorNotes] = useState('');
  const [activeSlideMap, setActiveSlideMap] = useState<Record<string, number>>({});

  // Sample media presets
  const samplePresets = [
    { label: 'Identidade & Logo', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80' },
    { label: 'Carrossel Estático', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
    { label: 'Vídeo / Motion', url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80' },
    { label: 'Paleta Visual', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80' },
    { label: 'Social Feed', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const filesArr = Array.from(fileList) as File[];
    filesArr.forEach((file: File, index: number) => {
      const isVideo = file.type.startsWith('video/');
      const isImg = file.type.startsWith('image/');
      
      const reader = new FileReader();
      reader.onload = () => {
        const fileUrl = (reader.result as string) || '';
        const fileItem: ContentDeliverableFile = {
          name: file.name,
          url: fileUrl,
          type: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        };

        setUploadedFiles(prev => {
          const next = [...prev, fileItem];
          if (next.length === 1 && !mediaUrl) {
            setMediaUrl(fileUrl);
          }
          return next;
        });

        if (index === 0 && !title) {
          setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        }

        if (isVideo) {
          setType('video');
        } else if (filesArr.length > 1 && type === 'feed_post') {
          setType('carousel_static');
        }
      };

      if (isImg || isVideo) {
        reader.readAsDataURL(file);
      } else {
        setUploadedFiles(prev => [
          ...prev, 
          {
            name: file.name,
            url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
            type: file.type,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          }
        ]);
      }
    });
  };

  const handleRemoveUploadedFile = (idx: number) => {
    setUploadedFiles(prev => {
      const filtered = prev.filter((_, i) => i !== idx);
      if (filtered.length > 0) {
        setMediaUrl(filtered[0].url);
      }
      return filtered;
    });
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const willSendClient = destinationFlow === 'client_chat';
    const willSendInternal = destinationFlow === 'internal_review';

    const effectiveMediaUrls = uploadedFiles.length > 0 
      ? uploadedFiles.map(f => f.url) 
      : [mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'];

    const mainMedia = effectiveMediaUrls[0] || mediaUrl;
    const isCarousel = type === 'carousel_static' || type === 'carousel';
    const isVid = type === 'video';

    uploadContentDeliverable(
      project.id, 
      {
        projectId: project.id,
        productId: productId || undefined,
        subProductId: subProductId || undefined,
        title: title.trim(),
        type: (type as any),
        mediaUrl: mainMedia,
        mediaUrls: effectiveMediaUrls,
        files: uploadedFiles,
        formatDetails: {
          isCarouselStatic: isCarousel,
          isVideo: isVid,
          slideCount: isCarousel ? Math.max(effectiveMediaUrls.length, 1) : 1
        },
        copyText: copyText.trim() || `Arte desenvolvida para ${project.companyName} pela equipe de criação Sharp.`,
        status: willSendClient ? 'ready_for_review' : willSendInternal ? 'internal_review' : 'draft',
        uploadedBy: uploadedBy || 'Luan (Líder de Arte)',
        fileName: uploadedFiles[0]?.name || undefined,
        fileSize: uploadedFiles[0]?.size || undefined,
        sentToClient: willSendClient,
        sentToInternal: willSendInternal,
        comments: [],
        internalReviews: []
      },
      {
        sendDirectToClient: willSendClient,
        sendToInternal: willSendInternal
      }
    );

    // Reset upload form
    setTitle('');
    setCopyText('');
    setUploadedFiles([]);
    setIsUploadModalOpen(false);
  };

  // Filter deliverables: if subProductId is provided, filter or show all if none
  const allDeliverables = project.contentItems || [];
  const deliverables = subProductId
    ? allDeliverables.filter(d => d.subProductId === subProductId || (!d.subProductId && !d.productId))
    : allDeliverables;

  // Split into stages matching strict user requirements
  const internalAndDraftQueue = deliverables.filter(d => d.status === 'draft' || d.status === 'internal_review');
  const clientApprovalQueue = deliverables.filter(d => d.status === 'ready_for_review' || d.status === 'pending_client_approval');
  const approvedQueue = deliverables.filter(d => d.status === 'approved');
  const refazerQueue = deliverables.filter(d => d.status === 'rejected' || d.status === 'revision_requested' || d.status === 'changes_requested');

  const handleCopyCaption = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCaptionId(id);
    setTimeout(() => setCopiedCaptionId(null), 2000);
  };

  const handleSendToClientApproval = (deliverableId: string) => {
    if (sendDeliverableToClientApproval) {
      sendDeliverableToClientApproval(project.id, deliverableId);
    } else {
      approveContent(project.id, deliverableId);
    }
  };

  const handleOpenClientAdjustmentModal = (deliverable: ContentDeliverable) => {
    setSelectedDeliverableForModal(deliverable);
    setFeedbackText(deliverable.clientFeedback || '');
    setIsAdjustmentModalOpen(true);
  };

  const handleSubmitClientAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeliverableForModal || !feedbackText.trim()) return;

    submitClientDecision(
      project.id,
      selectedDeliverableForModal.id,
      'revision',
      feedbackText.trim()
    );

    setIsAdjustmentModalOpen(false);
    setSelectedDeliverableForModal(null);
  };

  const handleOpenInternalRefactor = (deliverable: ContentDeliverable) => {
    setSelectedDeliverableForModal(deliverable);
    setInternalRefactorNotes('');
    setIsInternalRefactorOpen(true);
  };

  const handleSubmitInternalRefactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeliverableForModal || !internalRefactorNotes.trim()) return;

    if (submitInternalReview) {
      submitInternalReview(
        project.id,
        selectedDeliverableForModal.id,
        'revision',
        internalRefactorNotes.trim()
      );
    }

    setIsInternalRefactorOpen(false);
    setSelectedDeliverableForModal(null);
  };

  const handleSlideChange = (id: string, delta: number, max: number) => {
    setActiveSlideMap(prev => ({
      ...prev,
      [id]: ((prev[id] || 0) + delta + max) % max
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600">
              <Palette className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Produção de Arte, Carrossel & Fluxo de Aprovação Exclusivo do Cliente
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {subProduct 
              ? `Atividade de arte: ${subProduct.name}. Suba múltiplos arquivos, carrossel estático ou vídeo e envie para avaliação com o cliente.`
              : `Suba fotos, carrosséis e vídeos. O status é controlado exclusivamente pela aprovação do cliente (${project.companyName}).`}
          </p>
        </div>

        {/* Action Button & Stats Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Upload className="w-4 h-4" />
            <span>Subir Arte</span>
          </button>

          <div className="flex items-center space-x-1.5 text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-800 font-semibold">
              {clientApprovalQueue.length} em avaliação
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
              {approvedQueue.length} aprovadas
            </span>
            {refazerQueue.length > 0 && (
              <span className="px-2.5 py-1 rounded-xl bg-red-50 border border-red-200 text-red-800 font-semibold">
                {refazerQueue.length} refazer
              </span>
            )}
          </div>
        </div>
      </div>

      {/* The 3-Stage Workflow + Refazer Section (Esteira) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>Esteira de Aprovação de Peças (Validação Exclusiva do Cliente)</span>
          </h4>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Total: {deliverables.length} entregáveis</span>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="text-xs text-cyan-700 hover:text-cyan-800 font-bold hover:underline cursor-pointer flex items-center space-x-1"
            >
              <Upload className="w-3 h-3" />
              <span>+ Subir Arte</span>
            </button>
          </div>
        </div>

        {deliverables.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <div>
              <p className="text-xs font-semibold text-slate-700">Nenhuma arte cadastrada ainda neste subproduto/projeto.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Clique no botão abaixo para abrir o envio de arte.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Arte</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Column 1: Preparação & Rascunho / Interno */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <h5 className="text-xs font-bold text-slate-800">
                    1. Rascunho / Interno
                  </h5>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">
                  {internalAndDraftQueue.length}
                </span>
              </div>

              {internalAndDraftQueue.length === 0 ? (
                <p className="text-[11px] text-slate-400 py-4 text-center">Nenhuma peça em rascunho.</p>
              ) : (
                <div className="space-y-3">
                  {internalAndDraftQueue.map(item => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                      <div className="relative rounded-lg overflow-hidden h-32 bg-slate-900">
                        {item.type === 'video' || item.formatDetails?.isVideo ? (
                          <div className="w-full h-full flex items-center justify-center text-white">
                            <Film className="w-6 h-6 text-red-500" />
                          </div>
                        ) : (
                          <img
                            src={item.mediaUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                          {item.type === 'carousel_static' ? 'CARROSSEL' : item.type.toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h6 className="text-xs font-bold text-slate-900">{item.title}</h6>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{item.copyText}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                        <button
                          onClick={() => handleSendToClientApproval(item.id)}
                          className="flex-1 px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>Enviar p/ Avaliação do Cliente</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Em Avaliação com o Cliente */}
            <div className="bg-cyan-50/40 border border-cyan-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-cyan-200 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                  <h5 className="text-xs font-bold text-cyan-900">
                    2. Em Avaliação com o Cliente
                  </h5>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">
                  {clientApprovalQueue.length}
                </span>
              </div>

              {clientApprovalQueue.length === 0 ? (
                <p className="text-[11px] text-cyan-700/70 py-4 text-center">Nenhuma peça aguardando cliente.</p>
              ) : (
                <div className="space-y-3">
                  {clientApprovalQueue.map(item => {
                    const slides = item.mediaUrls && item.mediaUrls.length > 0 ? item.mediaUrls : [item.mediaUrl];
                    const activeSlide = activeSlideMap[item.id] || 0;
                    const isCarousel = item.type === 'carousel_static' || item.type === 'carousel' || slides.length > 1;

                    return (
                      <div key={item.id} className="bg-white p-3 rounded-xl border border-cyan-200/80 shadow-xs space-y-2.5">
                        <div className="relative rounded-lg overflow-hidden h-32 bg-slate-900 group">
                          {item.type === 'video' || item.formatDetails?.isVideo ? (
                            <div className="w-full h-full flex items-center justify-center text-white bg-slate-950">
                              <Film className="w-6 h-6 text-red-500" />
                              <span className="text-[10px] font-bold ml-1.5">VÍDEO / REELS</span>
                            </div>
                          ) : (
                            <img
                              src={slides[activeSlide] || item.mediaUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}

                          {isCarousel && slides.length > 1 && (
                            <div className="absolute inset-x-0 bottom-1 flex items-center justify-between px-2">
                              <button
                                type="button"
                                onClick={() => handleSlideChange(item.id, -1, slides.length)}
                                className="p-0.5 rounded-full bg-black/60 text-white text-[10px]"
                              >
                                ‹
                              </button>
                              <span className="text-[9px] bg-black/70 text-white px-1.5 py-0.5 rounded font-bold">
                                {activeSlide + 1}/{slides.length}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleSlideChange(item.id, 1, slides.length)}
                                className="p-0.5 rounded-full bg-black/60 text-white text-[10px]"
                              >
                                ›
                              </button>
                            </div>
                          )}

                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-cyan-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                            {isCarousel ? 'CARROSSEL' : item.type.toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <h6 className="text-xs font-bold text-slate-900">{item.title}</h6>
                          <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{item.copyText}</p>
                        </div>

                        <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[10px] text-amber-900 font-medium flex items-center space-x-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>Aguardando aprovação exclusiva do cliente no Chat / Portal</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Column 3: Artes Aprovadas */}
            <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h5 className="text-xs font-bold text-emerald-900">
                    3. Aprovadas pelo Cliente
                  </h5>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {approvedQueue.length}
                </span>
              </div>

              {approvedQueue.length === 0 ? (
                <p className="text-[11px] text-emerald-700/70 py-4 text-center">Nenhuma peça aprovada ainda.</p>
              ) : (
                <div className="space-y-3">
                  {approvedQueue.map(item => (
                    <div key={item.id} className="bg-white p-3 rounded-xl border border-emerald-200/80 shadow-xs space-y-2.5">
                      <div className="relative rounded-lg overflow-hidden h-32 bg-slate-100">
                        <img
                          src={item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold">
                          ✓ APROVADA
                        </span>
                      </div>

                      <div>
                        <h6 className="text-xs font-bold text-slate-900">{item.title}</h6>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{item.copyText}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => handleCopyCaption(item.id, item.copyText)}
                          className="flex items-center space-x-1 text-slate-600 hover:text-emerald-700 font-medium cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedCaptionId === item.id ? 'Copiado!' : 'Copiar Legenda'}</span>
                        </button>

                        <a
                          href={item.mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1 text-emerald-700 hover:underline font-bold"
                        >
                          <Download className="w-3 h-3" />
                          <span>Baixar HD</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Section 4: Artes para REFAZER (Reprovadas ou em Revisão com o Carimbo REFAZER) */}
        {refazerQueue.length > 0 && (
          <div className="mt-6 bg-red-50/40 border border-red-200 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-red-200 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                <h5 className="text-sm font-black uppercase tracking-wider text-red-900 flex items-center space-x-2">
                  <span>Artes com Carimbo "REFAZER" — Observações do Cliente</span>
                </h5>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                {refazerQueue.length} peça(s) para ajuste
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {refazerQueue.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border-2 border-red-300 shadow-md space-y-3 relative overflow-hidden">
                  
                  {/* Visual Stamp REFAZER */}
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-900">
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-red-950/20">
                      <div className="border-4 border-red-600 bg-red-100/90 text-red-700 font-black text-xl px-4 py-1.5 rounded-xl uppercase transform -rotate-12 shadow-2xl tracking-widest">
                        REFAZER
                      </div>
                    </div>
                  </div>

                  <div>
                    <h6 className="text-xs font-bold text-slate-900">{item.title}</h6>
                    <span className="text-[10px] text-slate-400">Criado por {item.uploadedBy}</span>
                  </div>

                  {/* Client Observation Callout */}
                  <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-red-800 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      <span>Observações de Mudança do Cliente:</span>
                    </span>
                    <p className="text-xs text-red-950 font-medium whitespace-pre-line bg-white/90 p-2 rounded-lg border border-red-200">
                      {item.clientFeedback || 'O cliente solicitou a refação desta peça com mudanças específicas.'}
                    </p>
                  </div>

                  {/* Re-send to client approval button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => handleSendToClientApproval(item.id)}
                      className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reenviar p/ Avaliação do Cliente</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Modal: Client Adjustment */}
      {isAdjustmentModalOpen && selectedDeliverableForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Observações de Ajuste: {selectedDeliverableForModal.title}
              </h4>
              <button onClick={() => setIsAdjustmentModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitClientAdjustment} className="space-y-3">
              <p className="text-xs text-slate-500">
                Descreva os pontos solicitados para alteração. Isso adicionará o carimbo "REFAZER" e notificará a equipe criativa.
              </p>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={3}
                placeholder="Ex: Trocar a foto do produto 2 e destacar o botão de contato em dourado..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                required
              />

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustmentModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!feedbackText.trim()}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl shadow-xs cursor-pointer"
                >
                  Confirmar e Carimbar "REFAZER"
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Internal Refactor */}
      {isInternalRefactorOpen && selectedDeliverableForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900">
                Refação Interna de Arte: {selectedDeliverableForModal.title}
              </h4>
              <button onClick={() => setIsInternalRefactorOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitInternalRefactor} className="space-y-3">
              <p className="text-xs text-slate-500">
                Anotações técnicas de design, diagramação, contraste ou tipografia:
              </p>
              <textarea
                value={internalRefactorNotes}
                onChange={(e) => setInternalRefactorNotes(e.target.value)}
                rows={3}
                placeholder="Ex: Ajustar o kerning do título e corrigir margem de segurança inferior..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                required
              />

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInternalRefactorOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-xs"
                >
                  Registrar Refação Interna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Subir Arte / Pop-up de Upload */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Subir Nova Arte / Arquivos para Aprovação
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Suporta Carrossel Estático (múltiplas imagens), Vídeos (MP4) e Artes Estáticas
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setIsUploadModalOpen(false)} 
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Left: Drag & Drop / Image Preview */}
                <div className="space-y-2">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-cyan-300 hover:border-cyan-500 bg-slate-50 hover:bg-cyan-50/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[170px] overflow-hidden group"
                  >
                    {uploadedFiles.length > 0 ? (
                      <div className="space-y-2 w-full">
                        <div className="relative w-full h-28 rounded-xl overflow-hidden bg-slate-900">
                          {uploadedFiles[0].type?.includes('video') ? (
                            <div className="w-full h-full flex items-center justify-center text-white bg-slate-950">
                              <Film className="w-8 h-8 text-red-500" />
                            </div>
                          ) : (
                            <img
                              src={uploadedFiles[0].url}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-bold">
                            {uploadedFiles.length} arquivo(s)
                          </span>
                        </div>
                        <p className="text-[11px] text-cyan-800 font-bold">Clique para adicionar mais</p>
                      </div>
                    ) : mediaUrl ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden">
                        <img
                          src={mediaUrl}
                          alt="Preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                          Trocar Imagem
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 py-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-700">Clique para selecionar arquivos</p>
                        <p className="text-[10px] text-slate-400">ou arraste para cá</p>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.psd,.ai,.eps,.svg,.mp4"
                      onChange={handleMultipleFilesChange}
                      className="hidden"
                    />
                  </div>

                  {/* Sample Presets */}
                  <div className="flex items-center space-x-1 overflow-x-auto text-[10px] pb-1">
                    <span className="text-slate-400 shrink-0">Exemplos:</span>
                    {samplePresets.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setMediaUrl(p.url)}
                        className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 hover:bg-cyan-50 hover:text-cyan-800 whitespace-nowrap transition-colors cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Form fields */}
                <div className="md:col-span-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Título da Peça / Atividade *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={subProduct ? `Ex: ${subProduct.name} - V1` : "Ex: Carrossel de Lançamento / Identidade Visual"}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-slate-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Formato da Peça *
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-medium"
                      >
                        <option value="feed_post">🖼️ Post Estático (1:1 / 4:5)</option>
                        <option value="carousel_static">📑 Carrossel Estático (Sequência)</option>
                        <option value="video">🎬 Vídeo / Reels / Motion (MP4)</option>
                        <option value="story">📱 Story (9:16)</option>
                        <option value="brand_identity">🎨 Identidade Visual / Logotipo / Paleta</option>
                        <option value="copy">✍️ Copywriting / Tom de Voz / Roteiro</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Legenda / Copy / Instruções para o Cliente:
                    </label>
                    <textarea
                      value={copyText}
                      onChange={(e) => setCopyText(e.target.value)}
                      rows={2}
                      placeholder="Escreva a legenda oficial ou as diretrizes que o cliente verá na aprovação..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Uploaded files mini preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="flex items-center space-x-1 bg-white border border-slate-200 px-2 py-1 rounded-lg text-[11px]">
                          <span className="truncate max-w-[120px] font-medium">{f.name}</span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoveUploadedFile(i)}
                            className="text-slate-400 hover:text-red-600 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fluxo de Destino *
                    </label>
                    <select
                      value={destinationFlow}
                      onChange={(e) => setDestinationFlow(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                    >
                      <option value="client_chat">💬 Enviar para Avaliação com o Cliente (Chat / Portal)</option>
                      <option value="internal_review">🛡️ Enviar para Revisão Interna Sharp</option>
                      <option value="draft">📝 Salvar como Rascunho / Interno</option>
                    </select>
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="inline-flex items-center justify-center space-x-1.5 px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Subir e Disparar Fluxo</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
