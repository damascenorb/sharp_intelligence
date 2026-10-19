import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentDeliverableFile } from '../../types';
import { 
  Upload, X, FileImage, Sparkles, Check, Paperclip, Send, 
  ShieldCheck, FileText, CheckCircle2, MessageSquare, Palette,
  Film, Layers, Image as ImageIcon, Trash2, Plus
} from 'lucide-react';

interface ContentUploadModalProps {
  projectId: string;
  productId?: string;
  subProductId?: string;
  subProductName?: string;
  companyName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ContentUploadModal: React.FC<ContentUploadModalProps> = ({ 
  projectId, 
  productId,
  subProductId,
  subProductName,
  companyName,
  isOpen, 
  onClose,
  onSuccess
}) => {
  const { uploadContentDeliverable, currentUser, projects } = useApp();

  const defaultAuthor = currentUser?.role === 'sharp_admin'
    ? `${currentUser.name} (${currentUser.jobTitle || 'Sharp'})`
    : 'Luan (Líder de Arte & Design)';

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'feed_post' | 'carousel_static' | 'video' | 'story' | 'copy' | 'brand_identity' | 'file'>('feed_post');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80');
  const [uploadedFiles, setUploadedFiles] = useState<ContentDeliverableFile[]>([]);
  const [copyText, setCopyText] = useState('');
  const [uploadedBy, setUploadedBy] = useState(defaultAuthor);
  const [destinationFlow, setDestinationFlow] = useState<'client_chat' | 'internal_review' | 'draft'>('client_chat');
  const [isSuccessSent, setIsSuccessSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsSuccessSent(false);
      if (subProductName) {
        setTitle(subProductName.startsWith('Arte:') ? subProductName : `Arte: ${subProductName}`);
      } else {
        setTitle('');
      }
      setUploadedFiles([]);
    }
  }, [isOpen, subProductName]);

  if (!isOpen) return null;

  const currentProject = projects.find(p => p.id === projectId);
  const clientDisplayName = companyName || currentProject?.companyName || currentProject?.clientName || 'Cliente';

  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const newFiles: ContentDeliverableFile[] = [];
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

        // If first file and no title
        if (index === 0 && !title) {
          setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
        }

        // Auto switch format if video
        if (isVideo) {
          setType('video');
        } else if (filesArr.length > 1 && type === 'feed_post') {
          setType('carousel_static');
        }
      };

      if (isImg || isVideo) {
        reader.readAsDataURL(file);
      } else {
        // Generic file
        newFiles.push({
          name: file.name,
          url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
          type: file.type,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        });
        setUploadedFiles(prev => [...prev, ...newFiles]);
      }
    });
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      if (filtered.length > 0) {
        setMediaUrl(filtered[0].url);
      }
      return filtered;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !type) return;

    const willSendClient = destinationFlow === 'client_chat';
    const willSendInternal = destinationFlow === 'internal_review';

    const effectiveMediaUrls = uploadedFiles.length > 0 
      ? uploadedFiles.map(f => f.url) 
      : [mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'];

    const mainMedia = effectiveMediaUrls[0] || mediaUrl;

    const isCarousel = type === 'carousel_static' || type === 'carousel';
    const isVid = type === 'video';

    uploadContentDeliverable(
      projectId, 
      {
        projectId,
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
        copyText: copyText.trim() || 'Arte e diretrizes visuais produzidas pela equipe Sharp para aprovação.',
        status: willSendClient ? 'ready_for_review' : willSendInternal ? 'internal_review' : 'draft',
        uploadedBy: uploadedBy || defaultAuthor,
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

    setIsSuccessSent(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
      onClose();
    }, 1200);
  };

  const sampleMediaOptions = [
    { label: 'Logo & Marca', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80', icon: '🎨' },
    { label: 'Carrossel Estático', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', icon: '📑' },
    { label: 'Vídeo / Motion', url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80', icon: '🎬' },
    { label: 'Paleta & Cores', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', icon: '🌈' },
    { label: 'Social Feed', url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80', icon: '📱' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Produção de Arte & Aprovação</h2>
              <p className="text-xs text-slate-500">
                Cliente: <strong className="text-cyan-700">{clientDisplayName}</strong>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccessSent ? (
          <div className="py-12 text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Arte Enviada com Sucesso!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              {destinationFlow === 'client_chat' 
                ? `A peça foi enviada para o chat do cliente ${clientDisplayName}. O status agora é "Em avaliação com o cliente". Somente o cliente pode aprovar ou solicitar refação com observações.`
                : destinationFlow === 'internal_review'
                ? 'A peça foi enviada para avaliação técnica da equipe interna Sharp.'
                : 'A peça foi salva com sucesso no card do projeto.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* DESTINATION FLOW SELECTOR */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Fluxo de Destino da Peça / Aprovação *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDestinationFlow('client_chat')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    destinationFlow === 'client_chat'
                      ? 'bg-cyan-50/80 border-cyan-500 text-cyan-900 shadow-xs ring-1 ring-cyan-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <MessageSquare className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span className="text-xs font-bold">Chat do Cliente</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Muda para "Em avaliação com o cliente" para aprovação formal
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationFlow('internal_review')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    destinationFlow === 'internal_review'
                      ? 'bg-purple-50/80 border-purple-500 text-purple-900 shadow-xs ring-1 ring-purple-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="text-xs font-bold">Time Sharp</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Avaliação interna prévia pela liderança criativa
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDestinationFlow('draft')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    destinationFlow === 'draft'
                      ? 'bg-slate-100 border-slate-500 text-slate-900 shadow-xs ring-1 ring-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <FileText className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="text-xs font-bold">Rascunho</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Salvar no card para envio posterior
                  </p>
                </button>
              </div>
            </div>

            {/* FORMAT / TYPE SELECTOR (Carrossel estático, vídeo, post, etc.) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Tipo e Formato da Peça *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setType('feed_post')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                    type === 'feed_post' 
                      ? 'bg-cyan-50 border-cyan-500 text-cyan-900 font-bold ring-1 ring-cyan-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>Post Estático (1:1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('carousel_static')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                    type === 'carousel_static' || type === 'carousel'
                      ? 'bg-purple-50 border-purple-500 text-purple-900 font-bold ring-1 ring-purple-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>📑 Carrossel Estático</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('video')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                    type === 'video' 
                      ? 'bg-red-50 border-red-500 text-red-900 font-bold ring-1 ring-red-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Film className="w-4 h-4 text-red-600 shrink-0" />
                  <span>🎬 Vídeo / Motion</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('story')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                    type === 'story' 
                      ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold ring-1 ring-amber-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm">📱</span>
                  <span>Story (9:16)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('brand_identity')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                    type === 'brand_identity' 
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-1 ring-emerald-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Palette className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>🎨 Identidade / Logo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('copy')}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                    type === 'copy' 
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>✍️ Copy / Tom de Voz</span>
                </button>
              </div>
            </div>

            {/* MULTI-FILE UPLOAD ZONE */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Subir Arquivos (Imagens, Vídeos, Documentos) *
                </label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {uploadedFiles.length > 0 ? `${uploadedFiles.length} arquivo(s) selecionado(s)` : 'Pode selecionar múltiplos arquivos'}
                </span>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMultipleFiles}
                multiple
                accept="image/*,video/*,.pdf,.psd,.ai,.eps,.svg,.mp4,.mov"
                className="hidden"
              />
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-cyan-300 hover:border-cyan-500 bg-cyan-50/30 hover:bg-cyan-50/60 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2"
              >
                <div className="w-9 h-9 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Clique para selecionar um ou múltiplos arquivos
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Suporta fotos para Carrossel Estático, Vídeos (MP4/MOV), Logotipos e PDFs
                  </p>
                </div>
              </div>

              {/* Uploaded Files Gallery / Carousel List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <span className="text-[11px] font-bold text-slate-600 block">
                    Arquivos Anexados ({uploadedFiles.length}):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="relative group bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center space-x-2 text-xs">
                        {file.type?.includes('video') ? (
                          <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                            <Film className="w-4 h-4" />
                          </div>
                        ) : file.url.startsWith('data:image') || file.url.startsWith('http') ? (
                          <img src={file.url} alt={file.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 truncate text-[11px]">{file.name}</p>
                          <span className="text-[10px] text-slate-400">{file.size || 'Arquivo'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer opacity-80 hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome da Atividade / Peça de Arte *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex: Carrossel de Lançamento, Logotipo Principal, Vídeo Teaser..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Responsável pela Criação *</label>
                <input
                  type="text"
                  required
                  value={uploadedBy}
                  onChange={e => setUploadedBy(e.target.value)}
                  placeholder="Ex: Kauã (Designer) / Luan (Líder de Arte)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL da Imagem / Vídeo Principal</label>
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={e => setMediaUrl(e.target.value)}
                  placeholder="URL externa ou gerada pelo arquivo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors font-medium"
                />
              </div>
            </div>

            {/* Quick sample media */}
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="text-slate-400 font-bold self-center mr-1">Exemplos Rápidos:</span>
              {sampleMediaOptions.map((opt, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setMediaUrl(opt.url)}
                  className="bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 border border-slate-200 hover:border-cyan-300 px-2.5 py-1 rounded-full text-slate-700 font-medium transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Copy Text or Guidelines */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subir Copy, Justificativa ou Instruções para o Cliente
              </label>
              <textarea
                rows={3}
                value={copyText}
                onChange={e => setCopyText(e.target.value)}
                placeholder="Ex: Texto da legenda, instruções dos slides do carrossel ou roteiro do vídeo..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center space-x-2"
              >
                {destinationFlow === 'client_chat' ? (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar para Avaliação no Chat</span>
                  </>
                ) : destinationFlow === 'internal_review' ? (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Pedir Avaliação Interna</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Salvar Rascunho</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
