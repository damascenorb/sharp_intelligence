import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Users,
  Building2,
  Send,
  Paperclip,
  CheckCircle,
  XCircle,
  Sparkles,
  Image as ImageIcon,
  ShieldCheck,
  Clock,
  ThumbsUp,
  FileText,
  Bookmark,
  Check,
  Calendar,
  User,
  FolderKanban
} from 'lucide-react';
import { ChatMessage, Activity } from '../../types';
import { STORAGE_KEYS } from '../../data/singleSourceData';

export const TeamAndClientChat: React.FC = () => {
  const {
    currentUser,
    chatMessages,
    sendChatMessage,
    updateChatApprovalStatus,
    clientAccounts,
    projects,
    isClientInactive,
    selectedChatClientId
  } = useApp();

  const isClientUser = currentUser?.role === 'client';
  const myClientId = isClientUser ? currentUser?.id : (selectedChatClientId || clientAccounts[0]?.id || 'client-camila');

  const [chatChannel, setChatChannel] = useState<'internal_team' | 'client_direct'>(
    isClientUser || selectedChatClientId ? 'client_direct' : 'internal_team'
  );
  const [chatClientTab, setChatClientTab] = useState<'active' | 'archived'>('active');
  const [selectedClientId, setSelectedClientId] = useState<string>(selectedChatClientId || myClientId || 'client-camila');

  React.useEffect(() => {
    if (selectedChatClientId) {
      setChatChannel('client_direct');
      setSelectedClientId(selectedChatClientId);
    }
  }, [selectedChatClientId]);

  const activeClientId = isClientUser ? (currentUser?.id || 'client-camila') : selectedClientId;

  const [messageInput, setMessageInput] = useState('');
  const [attachmentType, setAttachmentType] = useState<'none' | 'image' | 'art_approval'>('none');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const [activeFeedbackInputMessageId, setActiveFeedbackInputMessageId] = useState<string | null>(null);
  const [feedbackActionType, setFeedbackActionType] = useState<'rejected' | 'revision' | null>(null);
  const [feedbackInputText, setFeedbackInputText] = useState('');

  // Decision Modal State (ETAPA 9)
  const [decisionModalMsg, setDecisionModalMsg] = useState<ChatMessage | null>(null);
  const [decisionTitle, setDecisionTitle] = useState('');
  const [decisionResponsible, setDecisionResponsible] = useState('Raphael Damasceno');
  const [decisionDeadline, setDecisionDeadline] = useState('');
  const [decisionProjectId, setDecisionProjectId] = useState<string>('');
  const [decisionCreateTask, setDecisionCreateTask] = useState(true);
  const [decisionSuccessMsg, setDecisionSuccessMsg] = useState<string | null>(null);

  const handleOpenDecisionModal = (msg: ChatMessage) => {
    setDecisionModalMsg(msg);
    setDecisionTitle(msg.content || 'Definição estratégica e alinhamento de escopo');
    setDecisionResponsible(currentUser?.name || 'Raphael Damasceno');
    setDecisionDeadline(new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]);
    setDecisionProjectId(projects[0]?.id || '');
    setDecisionCreateTask(true);
  };

  const handleSaveDecision = () => {
    if (!decisionModalMsg || !decisionTitle.trim()) return;

    const newActivity: Activity = {
      id: `act_dec_${Date.now()}`,
      accountId: decisionModalMsg.clientAccountId || 'acc_lumina',
      projectId: decisionProjectId || undefined,
      type: 'decision',
      title: `Decisão: ${decisionTitle.trim()}`,
      description: `Definição registrada via Chat por ${currentUser?.name || 'Equipe'}. Responsável: ${decisionResponsible}. Prazo: ${decisionDeadline || 'A definir'}. Conteúdo: "${decisionModalMsg.content}"`,
      createdBy: currentUser?.name || 'Equipe Sharp',
      createdAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      try {
        const existingActs: Activity[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.activities) || '[]');
        localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify([newActivity, ...existingActs]));
      } catch (err) {
        console.error('Error saving activity:', err);
      }
    }

    setDecisionModalMsg(null);
    setDecisionSuccessMsg(`Decisão registrada com sucesso no histórico operacional e vinculada à conta!`);
    setTimeout(() => setDecisionSuccessMsg(null), 4500);
  };

  const handleOpenFeedback = (msgId: string, type: 'rejected' | 'revision') => {
    setActiveFeedbackInputMessageId(msgId);
    setFeedbackActionType(type);
    setFeedbackInputText('');
  };

  const handleConfirmFeedback = (msgId: string) => {
    if (!feedbackActionType) return;
    updateChatApprovalStatus(msgId, feedbackActionType, feedbackInputText.trim());
    setActiveFeedbackInputMessageId(null);
    setFeedbackActionType(null);
    setFeedbackInputText('');
  };

  // Current active user name
  const currentSenderName = currentUser
    ? `${currentUser.name} (${currentUser.role === 'sharp_admin' ? 'Sharp' : 'Cliente'})`
    : 'Equipe Sharp';

  // Filter messages based on channel and active client
  const filteredMessages = chatMessages.filter(msg => {
    if (!isClientUser && chatChannel === 'internal_team') {
      return msg.channel === 'internal_team';
    } else {
      return msg.channel === 'client_direct' && msg.clientAccountId === activeClientId;
    }
  });

  const selectedClient = isClientUser
    ? { companyName: currentUser?.companyName || 'Sua Empresa', clientName: currentUser?.name || 'Cliente' }
    : clientAccounts.find(c => c.id === activeClientId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && attachmentType === 'none') return;

    let fileAttachment: ChatMessage['fileAttachment'] = undefined;

    if (attachmentType !== 'none') {
      fileAttachment = {
        name: attachmentName || (attachmentType === 'art_approval' ? 'Arte_Aprovacao_Sharp.png' : 'Documento_Anexo.png'),
        url: attachmentUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        type: attachmentType === 'art_approval' ? 'art_approval' : 'image'
      };
    }

    sendChatMessage({
      senderId: currentUser?.id || 'staff-raphael',
      senderName: currentSenderName,
      senderRole: isClientUser ? 'client' : 'sharp',
      channel: isClientUser ? 'client_direct' : chatChannel,
      clientAccountId: (isClientUser || chatChannel === 'client_direct') ? activeClientId : undefined,
      content: messageInput.trim(),
      fileAttachment,
      approvalStatus: attachmentType === 'art_approval' ? 'pending' : undefined
    });

    setMessageInput('');
    setAttachmentType('none');
    setAttachmentUrl('');
    setAttachmentName('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[750px] text-slate-800">
      
      {/* Top Header */}
      <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-700 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Central de Comunicação & Aprovações</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Chat Sharp & Portal de Mensagens
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discussão interna entre os integrantes da equipe e canal direto com clientes contratantes.
          </p>
        </div>

        {/* Channel selector tabs (Visible only for Sharp team) */}
        {!isClientUser && (
          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setChatChannel('internal_team')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                chatChannel === 'internal_team'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-cyan-600" />
              <span>Chat Interno Equipe Sharp</span>
            </button>

            <button
              onClick={() => setChatChannel('client_direct')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-2 ${
                chatChannel === 'client_direct'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-cyan-600" />
              <span>Chat com Clientes ({clientAccounts.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Body Grid */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* If Client Channel is selected AND user is Sharp staff, show Client List on Left */}
        {!isClientUser && chatChannel === 'client_direct' && (
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 p-3 space-y-3 overflow-y-auto">
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setChatClientTab('active')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-colors cursor-pointer text-[11px] ${
                  chatClientTab === 'active' ? 'bg-cyan-50 text-cyan-800 font-bold border border-cyan-200' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Ativos ({clientAccounts.filter(c => c.status !== 'inactive').length})
              </button>
              <button
                onClick={() => setChatClientTab('archived')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-colors cursor-pointer text-[11px] ${
                  chatClientTab === 'archived' ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Arquivados ({clientAccounts.filter(c => c.status === 'inactive').length})
              </button>
            </div>

            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              {chatClientTab === 'active' ? 'Clientes Ativos' : 'Clientes Arquivados (Inativos)'}
            </div>

            {clientAccounts.filter(c => chatClientTab === 'active' ? c.status !== 'inactive' : c.status === 'inactive').length === 0 ? (
              <div className="text-xs text-slate-400 italic p-3 text-center border border-dashed border-slate-200 rounded-xl">
                {chatClientTab === 'active' ? 'Nenhum cliente ativo no momento.' : 'Nenhum cliente arquivado.'}
              </div>
            ) : (
              clientAccounts
                .filter(c => chatClientTab === 'active' ? c.status !== 'inactive' : c.status === 'inactive')
                .map((client) => {
                  const isSelected = selectedClientId === client.id;
                  const isArchived = client.status === 'inactive';
                  return (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`w-full p-3 rounded-xl text-left border transition-all flex items-center space-x-3 cursor-pointer ${
                        isSelected
                          ? isArchived ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold' : 'bg-cyan-50 border-cyan-300 text-cyan-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isArchived ? 'bg-amber-100 border border-amber-200 text-amber-800' : 'bg-cyan-100 border border-cyan-200 text-cyan-800'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="text-xs font-bold truncate flex items-center justify-between">
                          <span className="truncate">{client.companyName}</span>
                          {isArchived && <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded shrink-0">Arquivado</span>}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{client.clientName}</div>
                      </div>
                    </button>
                  );
                })
            )}
          </div>
        )}

        {/* Message Thread Area */}
        <div className="flex-1 flex flex-col justify-between bg-white p-4 sm:p-6 overflow-hidden">
          
          {/* Subheader info bar */}
          <div className="pb-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${
                (selectedClient?.status === 'inactive' || isClientInactive(selectedClient?.companyName))
                  ? 'bg-amber-500'
                  : 'bg-emerald-500 animate-pulse'
              }`} />
              <span className="font-semibold text-slate-800 flex items-center space-x-2">
                <span>
                  {chatChannel === 'internal_team'
                    ? 'Canal Reservado da Equipe Sharp Intelligence'
                    : `Conversa com: ${selectedClient?.companyName || 'Cliente'} (${selectedClient?.clientName || ''})`}
                </span>
                {(selectedClient?.status === 'inactive' || isClientInactive(selectedClient?.companyName)) && (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    📁 Arquivado (Cliente Inativo)
                  </span>
                )}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Histórico seguro em tempo real
            </span>
          </div>

          {/* Archived Banner if client is inactive */}
          {chatChannel === 'client_direct' && (selectedClient?.status === 'inactive' || isClientInactive(selectedClient?.companyName)) && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                  📁 CHAT ARQUIVADO
                </span>
                <span>Cliente inativo — O histórico completo de conversas foi preservado para referência da equipe.</span>
              </div>
            </div>
          )}

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300" />
                <p className="text-xs">Nenhuma mensagem neste canal ainda. Envie a primeira mensagem abaixo!</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSharp = msg.senderRole === 'sharp';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col space-y-1.5 ${
                      isSharp ? 'items-start' : 'items-end'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span className={`font-bold ${isSharp ? 'text-cyan-700' : 'text-emerald-700'}`}>
                        {msg.senderName}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400 font-mono">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Message Card Container */}
                    <div
                      className={`max-w-xl p-4 rounded-2xl text-xs space-y-3 shadow-2xs ${
                        isSharp
                          ? 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none'
                          : 'bg-cyan-50 border border-cyan-200 text-slate-900 rounded-tr-none'
                      }`}
                    >
                      {/* Text content */}
                      {msg.content && <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>}

                      {/* Sharp Staff Action: Registrar como Decisão (ETAPA 9) */}
                      {!isClientUser && msg.content && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleOpenDecisionModal(msg)}
                            className="text-[10px] font-bold text-slate-500 hover:text-cyan-700 flex items-center space-x-1 py-1 px-2 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Transformar esta mensagem em uma Decisão Estratégica registrada para a Conta"
                          >
                            <Bookmark className="w-3 h-3 text-cyan-600" />
                            <span>Registrar como Decisão</span>
                          </button>
                        </div>
                      )}

                      {/* File attachment preview if present */}
                      {msg.fileAttachment && (
                        <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-cyan-800 font-semibold text-[11px]">
                              <ImageIcon className="w-4 h-4 text-cyan-600" />
                              <span className="truncate">{msg.fileAttachment.name}</span>
                            </div>
                            {msg.fileAttachment.type === 'art_approval' && (
                              <span className="text-[10px] font-bold uppercase bg-cyan-100 border border-cyan-200 text-cyan-800 px-2 py-0.5 rounded-md">
                                Arte p/ Aprovação
                              </span>
                            )}
                          </div>

                          <div className="relative rounded-lg overflow-hidden border border-slate-200">
                            <img
                              src={msg.fileAttachment.url}
                              alt="Arte para aprovação"
                              className="w-full max-h-56 object-cover"
                            />
                            {(msg.approvalStatus === 'rejected' || msg.approvalStatus === 'revision') && (
                              <div className="absolute inset-0 flex items-center justify-center bg-red-950/20 pointer-events-none">
                                <div className="border-4 border-red-600 bg-red-100/95 text-red-700 font-black text-xl px-4 py-1.5 rounded-xl uppercase transform -rotate-12 shadow-2xl tracking-widest">
                                  REFAZER
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Approval Status & Observation below the photo */}
                          {msg.fileAttachment.type === 'art_approval' && (
                            <div className="space-y-2 pt-2 border-t border-slate-200">
                              {/* Status Display below photo */}
                              {msg.approvalStatus === 'approved' && (
                                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>Aprovado pelo cliente</span>
                                </div>
                              )}

                              {(msg.approvalStatus === 'rejected' || msg.approvalStatus === 'revision') && (
                                <div className="bg-red-50 border border-red-300 rounded-xl p-2.5 text-xs text-red-900 space-y-1.5">
                                  <div className="flex items-center space-x-1.5 font-bold">
                                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                    <span>Carimbo: REFAZER ({msg.approvalStatus === 'rejected' ? 'Reprovado' : 'Revisão Solicitada'})</span>
                                  </div>
                                  {msg.clientFeedback && (
                                    <div className="text-[11px] text-red-950 bg-white/90 p-2 rounded-lg border border-red-200">
                                      <strong className="block text-red-800 text-[10px] uppercase font-bold mb-0.5">Observações de Mudança do Cliente:</strong>
                                      <span>{msg.clientFeedback}</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Pending Status with 3 Action Buttons */}
                              {(!msg.approvalStatus || msg.approvalStatus === 'pending') && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                    <span>Aguardando decisão da arte:</span>
                                    <span className="text-cyan-700 font-bold bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full text-[10px]">
                                      Em avaliação com o cliente
                                    </span>
                                  </div>

                                  {/* 3 Action Buttons */}
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => updateChatApprovalStatus(msg.id, 'approved')}
                                      className="flex-1 min-w-[80px] py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-[11px] transition-all flex items-center justify-center space-x-1 shadow-2xs cursor-pointer"
                                      title="Aprovar a arte"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      <span>Aprovar</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenFeedback(msg.id, 'rejected')}
                                      className="flex-1 min-w-[80px] py-1.5 px-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-xl text-[11px] transition-all flex items-center justify-center space-x-1 shadow-2xs cursor-pointer"
                                      title="Reprovar a arte e explicar motivo"
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>Reprovar</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleOpenFeedback(msg.id, 'revision')}
                                      className="flex-1 min-w-[80px] py-1.5 px-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-xl text-[11px] transition-all flex items-center justify-center space-x-1 shadow-2xs cursor-pointer"
                                      title="Solicitar revisão de pontos específicos"
                                    >
                                      <Clock className="w-3.5 h-3.5" />
                                      <span>Revisar</span>
                                    </button>
                                  </div>

                                  {/* Inline Feedback / Observation Form */}
                                  {activeFeedbackInputMessageId === msg.id && (
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-fadeIn mt-2">
                                      <label className="block text-[11px] font-bold text-slate-800">
                                        {feedbackActionType === 'rejected'
                                          ? 'Observação de Mudança Obrigatória (Reprovação):'
                                          : 'Observação de Mudança Obrigatória (Revisão):'}
                                      </label>
                                      <textarea
                                        rows={2}
                                        value={feedbackInputText}
                                        onChange={e => setFeedbackInputText(e.target.value)}
                                        placeholder={
                                          feedbackActionType === 'rejected'
                                            ? 'Ex: O tom visual não combina com a paleta institucional...'
                                            : 'Ex: Trocar a tipografia do título e ajustar a cor do botão...'
                                        }
                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                                      />
                                      <div className="flex items-center justify-end space-x-2">
                                        <button
                                          type="button"
                                          onClick={() => setActiveFeedbackInputMessageId(null)}
                                          className="px-2.5 py-1 text-slate-500 hover:text-slate-800 text-[11px] font-medium"
                                        >
                                          Cancelar
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleConfirmFeedback(msg.id)}
                                          disabled={!feedbackInputText.trim()}
                                          className={`px-3 py-1 text-white font-bold text-[11px] rounded-lg shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                                            feedbackActionType === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
                                          }`}
                                        >
                                          {feedbackActionType === 'rejected' ? 'Confirmar Reprovação (Refazer)' : 'Enviar Revisão'}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Attachment Box Options */}
          {attachmentType !== 'none' && (
            <div className="mb-2 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Paperclip className="w-4 h-4 text-cyan-600" />
                  <span>Anexar Arquivo / Arte</span>
                </span>
                <button
                  type="button"
                  onClick={() => setAttachmentType('none')}
                  className="text-slate-400 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nome do Arquivo (ex: Post_Insta_Lumina.png)"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
                />

                <input
                  type="text"
                  placeholder="URL da Imagem ou Mídia (opcional)"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Input Bar Form */}
          <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-200 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setAttachmentType(attachmentType === 'art_approval' ? 'none' : 'art_approval')}
              className={`p-2.5 rounded-xl border transition-colors flex items-center space-x-1 text-xs shrink-0 ${
                attachmentType === 'art_approval'
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Anexar arte para aprovação"
            >
              <Paperclip className="w-4 h-4 text-cyan-600" />
              <span className="hidden sm:inline font-medium">Anexar Arte</span>
            </button>

            <input
              type="text"
              placeholder={
                chatChannel === 'internal_team'
                  ? 'Escreva para o time (Cristiano, Luan, Raphael, Ingrid, Lucas)...'
                  : 'Enviar mensagem direta ao cliente...'
              }
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-cyan-500 text-slate-900 rounded-xl py-2.5 px-4 text-xs focus:outline-none transition-colors"
            />

            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center space-x-1.5 shadow-md"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

      {/* Success banner for Decision */}
      {decisionSuccessMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 p-3 bg-emerald-600 text-white rounded-2xl shadow-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-200" />
          <span>{decisionSuccessMsg}</span>
        </div>
      )}

      {/* Modal: Registrar como Decisão (ETAPA 9) */}
      {decisionModalMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2 text-cyan-800">
              <Bookmark className="w-5 h-5 text-cyan-600" />
              <h3 className="text-base font-black text-slate-900">
                Registrar Definição como Decisão Oficial
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Transforme o alinhamento realizado no chat em uma decisão documentada com responsável e prazo.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 italic">
              "{decisionModalMsg.content}"
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Título da Decisão:</label>
                <input
                  type="text"
                  value={decisionTitle}
                  onChange={e => setDecisionTitle(e.target.value)}
                  placeholder="Ex: Aprovação da paleta esmeralda e novo tom de voz"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Responsável:</label>
                  <input
                    type="text"
                    value={decisionResponsible}
                    onChange={e => setDecisionResponsible(e.target.value)}
                    placeholder="Nome do responsável"
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Prazo Limite:</label>
                  <input
                    type="date"
                    value={decisionDeadline}
                    onChange={e => setDecisionDeadline(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {projects.length > 0 && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Projeto Vinculado:</label>
                  <select
                    value={decisionProjectId}
                    onChange={e => setDecisionProjectId(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="">Geral / Sem projeto específico</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.companyName} — {p.title || 'Projeto'}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDecisionModalMsg(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveDecision}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
              >
                Confirmar Registro de Decisão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
