import React, { useState, useEffect } from 'react';
import { ProductStage, StageTask, isArtActivity } from '../../data/productStagesData';
import { Project, ContentDeliverable } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, Check, Lock, Sparkles, Upload, FileText, CheckCircle2, 
  MessageSquare, ShieldCheck, AlertCircle, ArrowRight, ExternalLink, Image as ImageIcon
} from 'lucide-react';

interface StageTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: ProductStage;
  productName: string;
  solutionId?: string;
  companyName?: string;
  project?: Project;
  onToggleTask?: (stageId: string, taskId: string) => void;
  onTogglePrerequisite?: (stageId: string, type: 'onboarding' | 'kickoff') => void;
  onAddTask?: (stageId: string, title: string, assignedTo: string) => void;
  onOpenUploadModal?: (taskTitle?: string) => void;
  onOpenUploadDeliverable?: () => void;
  onAdvanceStage?: (stageId: string) => void;
  onUpdateStageStatus?: (stageId: string, newStatus: 'pending' | 'in_progress' | 'completed') => void;
  onPassBaton?: (notes: string) => void;
}

export const StageTasksModal: React.FC<StageTasksModalProps> = ({
  isOpen,
  onClose,
  stage,
  productName,
  solutionId,
  companyName,
  project,
  onToggleTask,
  onTogglePrerequisite,
  onAddTask,
  onOpenUploadModal,
  onOpenUploadDeliverable,
  onAdvanceStage,
  onUpdateStageStatus,
  onPassBaton
}) => {
  const { projects, sendChatMessage, currentUser } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Kauã (Designer & Criação)');
  const [handoffNote, setHandoffNote] = useState('');
  const [isHandoffSent, setIsHandoffSent] = useState(false);
  const [prereqWarning, setPrereqWarning] = useState<string | null>(null);

  // Local state for prerequisites fallback if stage prop updates
  const [localOnboardingDone, setLocalOnboardingDone] = useState(false);
  const [localKickoffDone, setLocalKickoffDone] = useState(false);
  const [forceUpdateNonce, setForceUpdateNonce] = useState(0);

  useEffect(() => {
    if (stage) {
      const isComp = stage.status === 'completed';
      setLocalOnboardingDone(stage.onboarding?.completed ?? isComp);
      setLocalKickoffDone(stage.kickoff?.completed ?? isComp);
    }
  }, [stage]);

  useEffect(() => {
    if (!prereqWarning) return;
    const timer = setTimeout(() => setPrereqWarning(null), 4500);
    return () => clearTimeout(timer);
  }, [prereqWarning]);

  // Listen for real-time art approvals dispatched in chat
  useEffect(() => {
    const handleArtDecision = (e: any) => {
      setForceUpdateNonce(n => n + 1);
    };
    window.addEventListener('sharp_art_decision', handleArtDecision);
    return () => window.removeEventListener('sharp_art_decision', handleArtDecision);
  }, []);

  if (!isOpen || !stage) return null;

  // Retrieve current live project data
  const liveProject = (project ? projects.find(p => p.id === project.id) : null) || project;
  const effectiveCompanyName = companyName || liveProject?.companyName || 'Cliente';
  const projectDeliverables: ContentDeliverable[] = liveProject?.contentItems || [];

  const isOnboardingDone = stage.onboarding?.completed ?? localOnboardingDone;
  const isKickoffDone = stage.kickoff?.completed ?? localKickoffDone;
  const isPrerequisitesFulfilled = isOnboardingDone && isKickoffDone;

  const handlePrereqClick = (type: 'onboarding' | 'kickoff') => {
    if (type === 'kickoff' && !isKickoffDone && !isOnboardingDone) {
      setPrereqWarning('O 2. Kick-off só pode ser validado após a conclusão e validação do 1. Onboarding (com envio do questionário).');
      return;
    }

    if (onTogglePrerequisite) {
      onTogglePrerequisite(stage.id, type);
    } else {
      if (type === 'onboarding') {
        const next = !localOnboardingDone;
        setLocalOnboardingDone(next);
        if (!next) setLocalKickoffDone(false);
      } else {
        setLocalKickoffDone(!localKickoffDone);
      }
    }
  };

  const handleTaskClick = (taskId: string) => {
    if (!isPrerequisitesFulfilled) {
      setPrereqWarning('Para validar as tarefas da etapa, é obrigatório concluir e validar primeiro o 1. Onboarding e o 2. Kick-off.');
      return;
    }
    if (onToggleTask) {
      onToggleTask(stage.id, taskId);
    }
  };

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    if (onAddTask) {
      onAddTask(stage.id, newTaskTitle.trim(), newTaskAssignee);
    }
    setNewTaskTitle('');
  };

  const handleSendHandoff = () => {
    if (onPassBaton) {
      onPassBaton(handoffNote);
    }
    setIsHandoffSent(true);
    setTimeout(() => setIsHandoffSent(false), 4000);
  };

  const handleOpenUpload = (taskTitle?: string) => {
    if (onOpenUploadModal) {
      onOpenUploadModal(taskTitle);
    } else if (onOpenUploadDeliverable) {
      onOpenUploadDeliverable();
    }
  };

  // Check matching deliverable for each task
  const findMatchingDeliverable = (task: StageTask) => {
    return projectDeliverables.find(d => {
      if (d.subProductId === task.id) return true;
      const dt = d.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const tt = task.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (dt.includes(tt) || tt.includes(dt)) return true;
      
      // Keyword matching for art and design items
      if (tt.includes('logo') && dt.includes('logo')) return true;
      if (tt.includes('paleta') && (dt.includes('paleta') || dt.includes('cor'))) return true;
      if (tt.includes('tipografia') && (dt.includes('tipografia') || dt.includes('fonte'))) return true;
      if (tt.includes('elemento') && dt.includes('elemento')) return true;
      if (tt.includes('manual') && dt.includes('manual')) return true;
      if (tt.includes('tom de voz') && dt.includes('tom de voz')) return true;
      if (tt.includes('identidade') && dt.includes('identidade')) return true;
      if (tt.includes('redesenho') && dt.includes('redesenho')) return true;
      return false;
    });
  };

  const totalTasks = stage.tasks.length;
  const completedTasks = stage.tasks.filter(t => {
    if (t.completed) return true;
    const deliverable = findMatchingDeliverable(t);
    return deliverable?.status === 'approved';
  }).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base border shrink-0 ${
              stage.status === 'completed'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : stage.requiresArt
                ? 'bg-purple-100 text-purple-800 border-purple-300'
                : 'bg-cyan-100 text-cyan-800 border-cyan-300'
            }`}>
              {stage.status === 'completed' ? '✓' : stage.order}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  {productName} • {effectiveCompanyName}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  stage.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : stage.status === 'in_progress'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {stage.status === 'completed' ? 'Etapa Concluída' : stage.status === 'in_progress' ? 'Em Andamento' : 'Pendente'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                {stage.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PREREQUISITE WARNING BANNER */}
        {prereqWarning && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start justify-between gap-3 text-amber-900 text-xs animate-fadeIn shrink-0 shadow-xs">
            <div className="flex items-start space-x-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-amber-950">Ordem de Execução Obrigatória:</strong>
                <p className="mt-0.5">{prereqWarning}</p>
              </div>
            </div>
            <button onClick={() => setPrereqWarning(null)} className="p-1 text-amber-700 hover:text-amber-900 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Modal Content */}
        <div className="space-y-5 overflow-y-auto pr-1 flex-1">
          
          {/* Stage Details & Assigned Lead */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Objetivo & Escopo da Etapa:</span>
              <p className="text-slate-700 font-medium mt-0.5 leading-relaxed">{stage.description}</p>
            </div>
            <div className="shrink-0 bg-white px-3 py-2 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">Responsável:</span>
              <strong className="text-slate-900">{stage.responsibleStaff}</strong>
            </div>
          </div>

          {/* SECTION 1: MANDATORY PREREQUISITES (ONBOARDING & KICK-OFF) */}
          <div className="space-y-2.5 bg-slate-50/60 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-slate-900 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                  <span>Etapas Antecedentes Obrigatórias (Pré-requisitos)</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Obrigatório
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">
                {isPrerequisitesFulfilled ? '✓ 1 e 2 validados' : 'Obrigatório validar antes dos itens de produção'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* 1. ONBOARDING */}
              <div
                onClick={() => handlePrereqClick('onboarding')}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                  isOnboardingDone
                    ? 'bg-emerald-50/90 border-emerald-300 text-slate-800 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isOnboardingDone 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'border-slate-300 bg-white hover:border-cyan-500'
                  }`}>
                    {isOnboardingDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-[10px] font-bold text-slate-400">1</span>}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <strong className={`text-xs ${isOnboardingDone ? 'text-emerald-900' : 'text-slate-900'}`}>
                        1. ONBOARDING
                      </strong>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        Ingrid / Raphael
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Apresentação da empresa, produtos contratados e metodologia. Além de enviar o questionário que baseará todo o projeto.
                    </p>
                    <div className="pt-0.5">
                      {isOnboardingDone ? (
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Onboarding Concluído & Questionário Enviado</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-700">
                          Pendente • Clique para validar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. KICK-OFF */}
              <div
                onClick={() => handlePrereqClick('kickoff')}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                  isKickoffDone
                    ? 'bg-emerald-50/90 border-emerald-300 text-slate-800 shadow-xs'
                    : !isOnboardingDone
                    ? 'bg-slate-50/80 border-slate-200/90 opacity-75'
                    : 'bg-white border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                    isKickoffDone 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : !isOnboardingDone
                      ? 'border-slate-200 bg-slate-100 text-slate-400'
                      : 'border-slate-300 bg-white hover:border-cyan-500'
                  }`}>
                    {isKickoffDone ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : !isOnboardingDone ? (
                      <Lock className="w-3 h-3 text-slate-400" />
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">2</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <strong className={`text-xs ${isKickoffDone ? 'text-emerald-900' : 'text-slate-900'}`}>
                        2. KICK-OFF
                      </strong>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        Raphael (Estrategista)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Apresentação do plano operacional (o que será feito, como será feito), plano de marketing e agendas para ação.
                    </p>
                    <div className="pt-0.5">
                      {isKickoffDone ? (
                        <span className="text-[10px] font-bold text-emerald-700 flex items-center space-x-1">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>Kick-off Apresentado & Agendas Alinhadas</span>
                        </span>
                      ) : !isOnboardingDone ? (
                        <span className="text-[10px] font-semibold text-slate-500 flex items-center space-x-1">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Requer validação prévia do Onboarding</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-700">
                          Pendente • Clique para validar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ART CREATION HERO BOX */}
          {(stage.requiresArt || stage.isArtCreation) && (
            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-200 text-purple-900 border border-purple-300">
                      🎨 ETAPA DE CRIAÇÃO DE ARTE & DESIGN
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-purple-950 mt-1">
                    Upload, Informações & Aprovação com Cliente
                  </h4>
                  <p className="text-xs text-purple-900/80 mt-0.5">
                    Suba imagens, logotipos, cópias e envie direto para aprovação do cliente pelo chat ou solicite revisão interna.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenUpload(stage.name)}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  <span>+ Subir Peça / Arte da Etapa</span>
                </button>
              </div>

              {/* Uploaded Deliverables List */}
              {projectDeliverables.length > 0 && (
                <div className="pt-2 border-t border-purple-200/80">
                  <span className="text-[11px] font-bold text-purple-950 block mb-2">
                    Peças & Arquivos vinculados ({projectDeliverables.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {projectDeliverables.slice(0, 4).map(item => (
                      <div key={item.id} className="bg-white p-2.5 rounded-xl border border-purple-100 flex items-center space-x-2.5 text-xs shadow-2xs">
                        <img 
                          src={item.mediaUrl} 
                          alt={item.title} 
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-900 truncate">{item.title}</p>
                          <span className={`text-[10px] font-bold inline-flex items-center space-x-1 ${
                            item.status === 'approved' 
                              ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded' 
                              : item.status === 'ready_for_review'
                              ? 'text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded'
                              : 'text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded'
                          }`}>
                            <span>{item.status === 'approved' ? '✓ Aprovado pelo Cliente' : item.status === 'ready_for_review' ? '💬 No Chat do Cliente' : '● Em Revisão'}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: TASKS / DEMANDAS CHECKLIST */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>Itens & Tarefas da Etapa ({completedTasks}/{totalTasks} • {progressPercent}%):</span>
                </h4>
                {isPrerequisitesFulfilled ? (
                  <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md">
                    ✓ Liberado
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 rounded-md flex items-center space-x-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Bloqueado</span>
                  </span>
                )}
              </div>
              <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Task Items List */}
            <div className="space-y-2.5">
              {stage.tasks.map((task) => {
                const isLocked = !isPrerequisitesFulfilled;
                const isArt = Boolean(task.isArtUpload || isArtActivity(task.title, task.description) || stage.requiresArt || stage.isArtCreation);
                const matchingDeliverable = findMatchingDeliverable(task);
                const isApprovedByClient = matchingDeliverable?.status === 'approved';
                const isSentInChat = matchingDeliverable?.status === 'ready_for_review' || matchingDeliverable?.status === 'pending_client_approval';
                const isUnderInternalReview = matchingDeliverable?.status === 'internal_review';
                const hasRevisionRequested = matchingDeliverable?.status === 'revision_requested' || matchingDeliverable?.status === 'rejected';
                
                const isEffectivelyCompleted = task.completed || isApprovedByClient;

                return (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task.id)}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col space-y-2 text-xs ${
                      isApprovedByClient
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs'
                        : isEffectivelyCompleted
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                        : isLocked
                        ? 'bg-slate-50/70 border-slate-200/90 text-slate-500 cursor-not-allowed opacity-80'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 cursor-pointer shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        isEffectivelyCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isLocked
                          ? 'border-slate-200 bg-slate-100 text-slate-400'
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isEffectivelyCompleted ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : isLocked ? (
                          <Lock className="w-2.5 h-2.5 text-slate-400" />
                        ) : null}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2 min-w-0">
                            <strong className={`truncate ${isEffectivelyCompleted ? 'text-slate-900 font-bold' : 'text-slate-900'}`}>
                              {task.title}
                            </strong>
                            {isArt && (
                              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                                🎨 Arte
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            {isLocked && !isEffectivelyCompleted && (
                              <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                🔒 Bloqueado
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {task.assignedTo.split('(')[0]}
                            </span>
                          </div>
                        </div>

                        {task.description && (
                          <p className={`text-[11px] mt-0.5 ${isEffectivelyCompleted ? 'text-slate-500' : 'text-slate-500'}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* STATUS BADGES & ART ACTIONS */}
                    <div className="pl-7 pt-1 flex flex-wrap items-center justify-between gap-2">
                      
                      {/* DELIVERABLE WORKFLOW STATUS PILL */}
                      <div className="flex items-center space-x-2">
                        {isApprovedByClient ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>✓ Aprovado pelo Cliente</span>
                          </span>
                        ) : isSentInChat ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-cyan-100 text-cyan-900 border border-cyan-300 text-[11px] font-bold">
                            <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
                            <span>⏳ Em Avaliação com o Cliente</span>
                          </span>
                        ) : isUnderInternalReview ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 border border-purple-300 text-[11px] font-bold">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                            <span>🛡️ Em Avaliação Interna Sharp</span>
                          </span>
                        ) : hasRevisionRequested ? (
                          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-red-100 text-red-900 border border-red-300 text-[11px] font-bold">
                            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                            <span>Carimbo: REFAZER ({matchingDeliverable?.clientFeedback || 'Observações pendentes'})</span>
                          </span>
                        ) : null}

                        {matchingDeliverable && (
                          <span className="text-[10px] text-slate-400">
                            Arquivo: {matchingDeliverable.title}
                          </span>
                        )}
                      </div>

                      {/* ART UPLOAD BUTTON IF IT'S AN ART ACTIVITY */}
                      {isArt && (
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenUpload(task.title);
                            }}
                            className={`px-3 py-1 text-[11px] font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs ${
                              isApprovedByClient
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                                : 'bg-cyan-600 hover:bg-cyan-700 text-white'
                            }`}
                          >
                            <Upload className="w-3 h-3" />
                            <span>{matchingDeliverable ? 'Subir Nova Versão / Copy' : '🎨 Produção de Arte / Subir Peça'}</span>
                          </button>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Task Form */}
            <form onSubmit={handleAddNewTask} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="+ Adicionar nova demanda a esta etapa..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-slate-400"
              />
              <select
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none"
              >
                <option value="Kauã (Designer)">Kauã (Designer)</option>
                <option value="Raphael (Estrategista)">Raphael (Estrategista)</option>
                <option value="Cristiano (Growth)">Cristiano (Growth)</option>
                <option value="Luan (Líder de Arte)">Luan (Líder de Arte)</option>
                <option value="Ingrid (CS)">Ingrid (CS)</option>
              </select>
              <button
                type="submit"
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
              >
                + Adicionar
              </button>
            </form>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onAdvanceStage) {
                onAdvanceStage(stage.id);
              } else if (onUpdateStageStatus) {
                onUpdateStageStatus(stage.id, stage.status === 'completed' ? 'in_progress' : 'completed');
              }
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-1.5 ${
              stage.status === 'completed'
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stage.status === 'completed' ? 'Reabrir Etapa' : 'Marcar Etapa como Concluída ✓'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
