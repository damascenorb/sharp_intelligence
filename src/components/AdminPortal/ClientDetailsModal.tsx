import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Project, SolutionId, ContentDeliverable, QualityFollowUp } from '../../types';
import { SHARP_SOLUTIONS } from '../../data/mockData';
import { 
  ProductStageDefinition, 
  GET_DEFAULT_STAGES_FOR_SOLUTION,
  PRODUCT_OBJECTIVES,
  ONBOARDING_INFO,
  KICKOFF_INFO
} from '../../data/productStagesData';
import { StageTasksModal } from './StageTasksModal';
import { ContentUploadModal } from './ContentUploadModal';
import { ArtDeliverablePipeline } from './ArtDeliverablePipeline';
import { useApp } from '../../context/AppContext';
import { getProductColorTheme } from '../../utils/productUtils';
import { 
  Building2, 
  X, 
  Layers, 
  Users, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  FileText,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Package,
  Upload,
  Palette,
  Eye,
  Check,
  Plus,
  AlertCircle,
  FolderKanban,
  Lock,
  Unlock,
  ShieldAlert,
  HelpCircle,
  DollarSign,
  Calendar,
  Star,
  MessageSquare,
  MessageCircle,
  PhoneCall,
  Video,
  Edit3,
  Camera,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  User
} from 'lucide-react';

interface ClientDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'products' | 'details' | 'followup' | 'art';
  onGoToProduction?: () => void;
}

export const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
  project,
  isOpen,
  onClose,
  initialTab = 'products',
  onGoToProduction
}) => {
  const { 
    addNotification, 
    updateProject, 
    qualityFollowUps, 
    addQualityFollowUp, 
    updateQualityFollowUp, 
    deleteQualityFollowUp,
    accounts,
    updateAccount,
    clientAccounts,
    navigateToClientChat,
    setActiveNavTab
  } = useApp();

  // Active view tab inside modal
  const [activeTab, setActiveTab] = useState<'products' | 'details' | 'followup' | 'art'>(initialTab);

  // Selected product for drill-down into stages
  const [selectedProductKey, setSelectedProductKey] = useState<string | null>(null);

  // Product stages state mapped by productKey (prod.id or prod.solutionId)
  const [productStagesMap, setProductStagesMap] = useState<Record<string, ProductStageDefinition[]>>({});

  // Active Stage Tasks Modal State
  const [selectedStageData, setSelectedStageData] = useState<{
    productName: string;
    solutionId: string;
    prodKey: string;
    stage: ProductStageDefinition;
  } | null>(null);

  // Upload / Artes Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadContext, setUploadContext] = useState<{
    productId?: string;
    subProductName?: string;
  }>({});

  // Blocked Art Stage Alert State
  const [blockedArtModal, setBlockedArtModal] = useState<{
    productName: string;
    pendingStages: string[];
  } | null>(null);

  // Editable Client Contract & Notes state
  const [contractValue, setContractValue] = useState<string>('');
  const [monthlyFee, setMonthlyFee] = useState<string>('');
  const [operationalNotes, setOperationalNotes] = useState<string>('');
  const [clientLogoUrl, setClientLogoUrl] = useState<string>('');
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [blockedPrereqWarning, setBlockedPrereqWarning] = useState<string | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Auto-dismiss prerequisite warning
  useEffect(() => {
    if (!blockedPrereqWarning) return;
    const timer = setTimeout(() => {
      setBlockedPrereqWarning(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [blockedPrereqWarning]);

  // New Quality Follow-Up Form State
  const [showAddFollowUpModal, setShowAddFollowUpModal] = useState(false);
  const [expandedFollowUpIds, setExpandedFollowUpIds] = useState<string[]>([]);
  const [folChannel, setFolChannel] = useState<'whatsapp' | 'call' | 'meet' | 'email'>('whatsapp');
  const [folDate, setFolDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [folContactPerson, setFolContactPerson] = useState<string>('');
  const [folSatisfactionScore, setFolSatisfactionScore] = useState<number>(5);
  const [folNotes, setFolNotes] = useState<string>('');
  const [folFeedback, setFolFeedback] = useState<string>('');
  const [folActionItems, setFolActionItems] = useState<string>('');

  const toggleFollowUpExpanded = (id: string) => {
    setExpandedFollowUpIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Initialize data on mount or project change
  useEffect(() => {
    if (!project) return;
    const prods = project.activeProducts || [];
    const newMap: Record<string, ProductStageDefinition[]> = { ...productStagesMap };

    prods.forEach(prod => {
      const prodKey = prod.id || prod.solutionId;
      if (!newMap[prodKey]) {
        newMap[prodKey] = GET_DEFAULT_STAGES_FOR_SOLUTION(
          prod.solutionId as string, 
          prod.name, 
          project.companyName
        );
      }
    });

    setProductStagesMap(newMap);
    setContractValue(project.contractValue || 'R$ 6.500,00');
    setMonthlyFee(project.monthlyFee || 'R$ 2.900,00 / mês');
    setOperationalNotes(project.notes || 'Posicionamento e produção estratégica de conteúdo autoral.');
    setClientLogoUrl(project.logoUrl || '');
    setFolContactPerson(project.clientName || '');
  }, [project?.id, project?.activeProducts]);

  if (!isOpen || !project) return null;

  const activeProds = project.activeProducts || [];
  const deliverables = project.contentItems || [];
  const approvedArts = deliverables.filter(d => d.status === 'approved').length;
  const pendingArts = deliverables.filter(d => d.status === 'ready_for_review' || d.status === 'pending_client_approval').length;

  // Onboarding & Kickoff completion check
  const onboardingTasks = project.onboardingChecklist || [];
  const completedOnboardingCount = onboardingTasks.filter(t => t.completed).length;
  const isOnboardingComplete = onboardingTasks.length > 0 && completedOnboardingCount === onboardingTasks.length;
  const isKickoffPassed = true;
  const areProductsUnlocked = true; // Stages and art production are free for use at any time per user directive

  // Determine if client has active Art / Creative deliverables service
  const hasArtService = useMemo(() => {
    if (!project) return false;
    const solutions = project.solutions || [];
    if (solutions.some(s => s === 'sharp_brand' || s === 'sharp_presence')) return true;

    const prods = project.activeProducts || [];
    if (prods.some(p => 
      p.solutionId === 'sharp_brand' || 
      p.solutionId === 'sharp_presence' ||
      p.name?.toLowerCase().includes('brand') ||
      p.name?.toLowerCase().includes('presence') ||
      p.name?.toLowerCase().includes('arte') ||
      p.name?.toLowerCase().includes('social') ||
      p.name?.toLowerCase().includes('design') ||
      (p.subProducts && p.subProducts.some(sp => sp.isArtDeliverable || sp.category === 'art'))
    )) return true;

    if ((project.contentItems || []).length > 0) return true;
    return false;
  }, [project]);

  // Find associated client account credentials
  const clientAccount = clientAccounts.find(
    c => (project.clientId && c.id === project.clientId) ||
         c.companyName.toLowerCase() === project.companyName.toLowerCase() ||
         (project.clientEmail && c.email?.toLowerCase() === project.clientEmail.toLowerCase())
  ) || {
    username: project.companyName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'cliente',
    password: 'Sharp@2026',
    status: 'active'
  };

  const [copiedCredentials, setCopiedCredentials] = useState(false);
  const handleCopyCredentials = () => {
    const text = `Credenciais de Acesso ao Portal Sharp:\nEmpresa: ${project.companyName}\nUsuário: ${clientAccount.username}\nSenha: ${clientAccount.password}\nLink: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 3000);
  };

  // Quality Follow-ups filtered for this client
  const clientFollowUps = qualityFollowUps.filter(f => 
    (f.clientId && (f.clientId === project.clientId || f.clientId === project.id || f.clientId === project.accountId)) ||
    (f.companyName && f.companyName.toLowerCase() === project.companyName.toLowerCase()) ||
    (f.clientName && f.clientName.toLowerCase() === project.clientName.toLowerCase())
  );

  // Calculate percentage of completion for a specific product
  const getProductProgress = (prodKey: string, prod: any): number => {
    const stages = productStagesMap[prodKey] || [];
    if (stages.length > 0) {
      const completedCount = stages.filter(s => s.status === 'completed').length;
      return Math.min(100, Math.round((completedCount / stages.length) * 100));
    }
    const subProds = prod.subProducts || [];
    if (subProds.length > 0) {
      const completedSubs = subProds.filter((s: any) => s.status === 'completed').length;
      return Math.min(100, Math.round((completedSubs / subProds.length) * 100));
    }
    return prod.status === 'completed' ? 100 : prod.status === 'in_progress' ? 60 : 30;
  };

  // Overall client completion percentage
  const overallProgressPercentage = useMemo(() => {
    if (activeProds.length === 0) return 35;
    let totalScore = 0;
    activeProds.forEach(prod => {
      const prodKey = prod.id || prod.solutionId;
      totalScore += getProductProgress(prodKey, prod);
    });
    return Math.min(100, Math.max(10, Math.round(totalScore / activeProds.length)));
  }, [activeProds, productStagesMap]);

  // Handle Logo Upload (Base64)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        const dataUrl = uploadEvent.target.result as string;
        setClientLogoUrl(dataUrl);
        updateProject(project.id, { logoUrl: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Save Client Details
  const handleSaveDetails = () => {
    setIsSavingDetails(true);
    updateProject(project.id, {
      contractValue,
      monthlyFee,
      notes: operationalNotes,
      logoUrl: clientLogoUrl
    });
    setTimeout(() => {
      setIsSavingDetails(false);
      setSaveSuccessMsg('Dados cadastrais e contratuais salvos com sucesso!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }, 400);
  };

  // Handle Complete Onboarding to Unlock Products
  const handleCompleteAllOnboarding = () => {
    const updatedChecklist = onboardingTasks.map(t => ({ ...t, completed: true }));
    updateProject(project.id, {
      onboardingChecklist: updatedChecklist,
      stage: 'producao'
    });
    addNotification({
      type: 'general',
      targetRole: 'sharp',
      title: 'Onboarding & Kickoff Concluídos',
      message: `O cliente "${project.companyName}" concluiu o Onboarding. Todos os produtos foram ativados na esteira operacional!`,
      clientName: project.companyName,
      projectId: project.id,
      actionTab: 'projects'
    });
  };

  // Handle Toggle Single Onboarding Task
  const handleToggleOnboardingTask = (taskId: string) => {
    const updatedChecklist = onboardingTasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const allDone = updatedChecklist.every(t => t.completed);
    updateProject(project.id, {
      onboardingChecklist: updatedChecklist,
      stage: allDone ? 'producao' : project.stage
    });
  };

  // Handle Submit New Quality Follow-Up
  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    addQualityFollowUp({
      clientId: project.clientId || project.id,
      clientName: project.clientName,
      companyName: project.companyName,
      scheduledDate: folDate,
      contactPerson: folContactPerson || project.clientName,
      channel: folChannel,
      satisfactionScore: folSatisfactionScore,
      status: 'completed',
      qualityNotes: folNotes,
      clientFeedback: folFeedback,
      actionItems: folActionItems,
      contactedBy: 'Time de Qualidade & CS Sharp',
      completedAt: new Date().toISOString()
    });

    setShowAddFollowUpModal(false);
    setFolNotes('');
    setFolFeedback('');
    setFolActionItems('');
  };

  // Handler for clicking a stage within a product
  const handleStageClick = (prodKey: string, prodName: string, solutionId: string, stage: ProductStageDefinition, stageIdx: number) => {
    const currentStages = productStagesMap[prodKey] || [];
    const isArtStage = stage.requiresArt || stage.isArtCreation || stageIdx === currentStages.length - 1;

    if (isArtStage) {
      const priorStages = currentStages.slice(0, stageIdx);
      const pending = priorStages.filter(s => s.status !== 'completed');
      if (pending.length > 0) {
        setBlockedArtModal({
          productName: prodName,
          pendingStages: pending.map(s => s.name)
        });
        return;
      }
    }

    setSelectedStageData({
      productName: prodName,
      solutionId,
      prodKey,
      stage
    });
  };

  const handleUpdateStageStatus = (stageId: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    const prodKey = selectedProductKey || selectedStageData?.prodKey;
    if (!prodKey) return;
    const currentStages = productStagesMap[prodKey] || [];

    const updatedStages = currentStages.map(st => {
      if (st.id === stageId) {
        const isComp = newStatus === 'completed';
        return {
          ...st,
          status: newStatus,
          progress: isComp ? 100 : newStatus === 'in_progress' ? 50 : 0,
          onboarding: isComp ? { 
            completed: true, 
            completedAt: new Date().toISOString(), 
            title: ONBOARDING_INFO.title, 
            description: ONBOARDING_INFO.description, 
            responsibleStaff: ONBOARDING_INFO.responsible 
          } : st.onboarding,
          kickoff: isComp ? { 
            completed: true, 
            completedAt: new Date().toISOString(), 
            title: KICKOFF_INFO.title, 
            description: KICKOFF_INFO.description, 
            responsibleStaff: KICKOFF_INFO.responsible 
          } : st.kickoff,
          tasks: isComp ? (st.tasks || []).map(t => ({ ...t, completed: true })) : st.tasks
        };
      }
      return st;
    });

    setProductStagesMap(prev => ({ ...prev, [prodKey]: updatedStages }));

    if (newStatus === 'completed') {
      const targetStage = currentStages.find(s => s.id === stageId);
      addNotification({
        type: 'general',
        targetRole: 'sharp',
        title: 'Etapa de Produção Concluída',
        message: `A etapa "${targetStage?.name || 'Produção'}" do produto foi concluída para ${project.companyName}.`,
        clientName: project.companyName,
        projectId: project.id,
        actionTab: 'projects'
      });
    }
  };

  const handleTogglePrerequisite = (stageId: string, prereqType: 'onboarding' | 'kickoff') => {
    const prodKey = selectedProductKey || selectedStageData?.prodKey;
    if (!prodKey) return;
    const currentStages = productStagesMap[prodKey] || [];
    const targetStage = currentStages.find(s => s.id === stageId);
    if (!targetStage) return;

    const currentOnboarding = targetStage.onboarding?.completed ?? (targetStage.status === 'completed');
    const currentKickoff = targetStage.kickoff?.completed ?? (targetStage.status === 'completed');

    // Rule: Kick-off can ONLY be completed if Onboarding is already completed
    if (prereqType === 'kickoff' && !currentKickoff && !currentOnboarding) {
      setBlockedPrereqWarning('Etapa bloqueada: O 2. Kick-off só pode ser validado após a conclusão e validação do 1. Onboarding (com envio e resposta do questionário).');
      return;
    }

    const updatedStages = currentStages.map(st => {
      if (st.id === stageId) {
        const isCurrentlyOnboarding = st.onboarding?.completed ?? (st.status === 'completed');
        const isCurrentlyKickoff = st.kickoff?.completed ?? (st.status === 'completed');

        let newOnboarding = isCurrentlyOnboarding;
        let newKickoff = isCurrentlyKickoff;

        if (prereqType === 'onboarding') {
          newOnboarding = !isCurrentlyOnboarding;
          // If unchecking onboarding, also uncheck kickoff since kickoff depends on onboarding
          if (!newOnboarding) {
            newKickoff = false;
          }
        } else if (prereqType === 'kickoff') {
          newKickoff = !isCurrentlyKickoff;
        }

        return {
          ...st,
          onboarding: {
            ...(st.onboarding || {}),
            completed: newOnboarding,
            completedAt: newOnboarding ? new Date().toISOString() : undefined,
            title: ONBOARDING_INFO.title,
            description: ONBOARDING_INFO.description,
            responsibleStaff: ONBOARDING_INFO.responsible
          },
          kickoff: {
            ...(st.kickoff || {}),
            completed: newKickoff,
            completedAt: newKickoff ? new Date().toISOString() : undefined,
            title: KICKOFF_INFO.title,
            description: KICKOFF_INFO.description,
            responsibleStaff: KICKOFF_INFO.responsible
          }
        };
      }
      return st;
    });

    setProductStagesMap(prev => ({ ...prev, [prodKey]: updatedStages }));

    const actionName = prereqType === 'onboarding' ? '1. Onboarding & Questionário Base' : '2. Kick-off & Plano Operacional';
    addNotification({
      type: 'general',
      targetRole: 'sharp',
      title: `Pré-requisito Validado: ${actionName}`,
      message: `A etapa "${actionName}" do produto ${selectedProduct?.name || ''} foi validada com sucesso para ${project.companyName}.`,
      clientName: project.companyName,
      projectId: project.id,
      actionTab: 'projects'
    });
  };

  const handleToggleTask = (stageId: string, taskId: string) => {
    const prodKey = selectedProductKey || selectedStageData?.prodKey;
    if (!prodKey) return;
    const currentStages = productStagesMap[prodKey] || [];
    const targetStage = currentStages.find(s => s.id === stageId);
    if (!targetStage) return;

    const isOnboardingDone = targetStage.onboarding?.completed ?? (targetStage.status === 'completed');
    const isKickoffDone = targetStage.kickoff?.completed ?? (targetStage.status === 'completed');

    // Rule: Tasks in "Itens & Tarefas da Etapa" can ONLY be completed if BOTH Onboarding and Kickoff are completed
    if (!isOnboardingDone || !isKickoffDone) {
      setBlockedPrereqWarning('Etapa de produção bloqueada: Para validar os "Itens & Tarefas da Etapa", é obrigatório concluir e validar primeiro o 1. Onboarding e o 2. Kick-off.');
      return;
    }

    const updatedStages = currentStages.map(st => {
      if (st.id === stageId) {
        const updatedTasks = (st.tasks || []).map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const allCompleted = updatedTasks.length > 0 && updatedTasks.every(t => t.completed);
        const someCompleted = updatedTasks.some(t => t.completed);

        return {
          ...st,
          tasks: updatedTasks,
          status: allCompleted ? ('completed' as const) : someCompleted ? ('in_progress' as const) : st.status,
          progress: allCompleted ? 100 : Math.round((updatedTasks.filter(t => t.completed).length / updatedTasks.length) * 100)
        };
      }
      return st;
    });

    setProductStagesMap(prev => ({ ...prev, [prodKey]: updatedStages }));
  };

  const selectedProduct = activeProds.find(p => (p.id || p.solutionId) === selectedProductKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200/90 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center space-x-3.5 min-w-0">
            {/* Client Logo / Avatar */}
            <div className="relative group w-13 h-13 rounded-2xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-center text-cyan-800 font-extrabold text-base overflow-hidden shrink-0 shadow-xs">
              {clientLogoUrl ? (
                <img src={clientLogoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span>{project.companyName.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                  {project.companyName}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  areProductsUnlocked
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {areProductsUnlocked ? '✓ Produtos Ativos' : '⚡ Aguardando Kickoff'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span>Contato: <strong className="text-slate-700">{project.clientName}</strong></span>
                <span>•</span>
                <span>{project.clientEmail}</span>
                {project.segment && (
                  <>
                    <span>•</span>
                    <span className="text-cyan-700 font-semibold">{project.segment}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Header: Overall Progress & Close Button */}
          <div className="flex items-center space-x-3 self-end md:self-center">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Progresso Geral</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black text-slate-900">{overallProgressPercentage}%</span>
                <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-600 rounded-full transition-all duration-300"
                    style={{ width: `${overallProgressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title="Fechar janela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* MODAL TABS NAVIGATION */}
        <div className="px-6 bg-slate-50/40 border-b border-slate-200/80 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => { setActiveTab('products'); setSelectedProductKey(null); }}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'products'
                  ? 'border-cyan-600 text-cyan-800 bg-white/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-600" />
              <span>Produtos & Etapas ({activeProds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'details'
                  ? 'border-cyan-600 text-cyan-800 bg-white/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-600" />
              <span>Dados Cadastrais & Contrato</span>
            </button>

            <button
              onClick={() => setActiveTab('followup')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'followup'
                  ? 'border-cyan-600 text-cyan-800 bg-white/60'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Follow-up & Qualidade ({clientFollowUps.length})</span>
            </button>

            {/* TAB 4: ARTE & ENTREGÁVEIS (DYNAMIC DEPENDING ON PRODUCTS) */}
            {hasArtService ? (
              <button
                onClick={() => setActiveTab('art')}
                className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                  activeTab === 'art'
                    ? 'border-purple-600 text-purple-800 bg-white/60'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Palette className="w-4 h-4 text-purple-600" />
                <span>Arte & Entregáveis ({deliverables.length})</span>
                {pendingArts > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-white">
                    {pendingArts}
                  </span>
                )}
              </button>
            ) : (
              <div
                title="Este cliente possui apenas serviços de diagnóstico/estratégia sem confecção de artes contratada. Ao vincular Sharp Brand, Sharp Presence ou produto de design, este módulo é ativado automaticamente."
                className="px-4 py-3 text-xs font-bold border-b-2 border-transparent text-slate-400 flex items-center space-x-2 cursor-not-allowed opacity-60"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Arte (Bloqueado)</span>
              </div>
            )}
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: PRODUTOS & ETAPAS DA OPERAÇÃO */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* ONBOARDING & KICKOFF GATE BANNER */}
              {!areProductsUnlocked && (
                <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-amber-900">
                          Produtos em Preparação: Conclua o Onboarding e Kickoff
                        </h4>
                        <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                          Os produtos contratados deste cliente são liberados para produção assim que os itens de Onboarding & Kickoff forem validados com o cliente.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCompleteAllOnboarding}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors shrink-0 flex items-center space-x-1.5 shadow-xs cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Liberar Produtos Agora</span>
                    </button>
                  </div>

                  {/* Checklist Items */}
                  <div className="pt-2 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {onboardingTasks.map(task => (
                      <label 
                        key={task.id} 
                        className="flex items-center space-x-2 bg-white/70 p-2 rounded-xl border border-amber-200/60 cursor-pointer hover:bg-white text-xs text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleOnboardingTask(task.id)}
                          className="rounded text-cyan-600 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                        />
                        <span className={task.completed ? 'line-through text-slate-400 font-medium' : 'font-semibold'}>
                          {task.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 1: PRODUCT SELECTION MENU (IF NO PRODUCT IS CLICKED) */}
              {!selectedProductKey ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Produtos Ativos do Cliente
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Clique em qualquer produto para abrir suas <strong>etapas de produção detalhadas</strong>.
                      </p>
                    </div>

                    <span className="text-xs font-semibold text-slate-500">
                      {activeProds.length} produto(s) vinculado(s)
                    </span>
                  </div>

                  {/* PRODUCTS LIST / CARDS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeProds.map((prod) => {
                      const prodKey = prod.id || prod.solutionId;
                      const progress = getProductProgress(prodKey, prod);
                      const stages = productStagesMap[prodKey] || [];
                      const completedStages = stages.filter(s => s.status === 'completed').length;
                      const theme = getProductColorTheme(prod.solutionId || prod.name);

                      return (
                        <div
                          key={prodKey}
                          onClick={() => setSelectedProductKey(prodKey)}
                          className={`bg-white border ${theme.cardBorder} hover:shadow-md rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2.5">
                                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold ${theme.pillBg} ${theme.pillText} ${theme.pillBorder}`}>
                                  <Package className="w-4 h-4" />
                                </div>
                                <span className={`text-xs font-bold ${theme.accentText} transition-colors`}>
                                  {prod.name}
                                </span>
                              </div>

                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${theme.pillBg} ${theme.pillText} ${theme.pillBorder}`}>
                                {prod.status === 'completed' ? 'Concluído' : 'Ativo'}
                              </span>
                            </div>

                            {prod.packageName && (
                              <p className="text-xs text-slate-500 font-medium pl-1">
                                {prod.packageName}
                              </p>
                            )}
                          </div>

                          {/* Completion Percentage Bar */}
                          <div className="pt-3 border-t border-slate-100 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 font-medium">
                                {stages.length > 0 ? `${completedStages} de ${stages.length} etapas concluídas` : 'Percentual Concluído'}
                              </span>
                              <span className={`font-black text-sm ${theme.accentText}`}>{progress}%</span>
                            </div>

                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${theme.barColor} rounded-full transition-all duration-300`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>

                            <div className={`flex items-center justify-between text-[11px] font-bold pt-1 ${theme.accentText} group-hover:translate-x-1 transition-transform`}>
                              <span>Abrir Etapas do Produto</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {activeProds.length === 0 && (
                      <div className="col-span-full p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                        <p className="text-xs text-slate-500">Nenhum produto cadastrado para este cliente.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* VIEW 2: PRODUCT STAGES DRILL-DOWN */
                <div className="space-y-5 animate-fadeIn">
                  
                  {/* Breadcrumb / Back button */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <button
                      onClick={() => setSelectedProductKey(null)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Voltar aos Produtos do Cliente</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">Produto Selecionado:</span>
                      <span className="px-3 py-1 bg-cyan-50 border border-cyan-200 text-cyan-900 font-bold rounded-xl text-xs">
                        {selectedProduct?.name}
                      </span>
                    </div>
                  </div>

                  {/* PRODUCT OBJECTIVE BANNER */}
                  {selectedProduct && (
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white p-4 sm:p-5 rounded-2xl border border-slate-700 shadow-sm space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-extrabold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                          Objetivo Estratégico do Produto
                        </span>
                        <span className="text-xs text-slate-400 font-medium">| {selectedProduct.name}</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                        {PRODUCT_OBJECTIVES[selectedProduct.solutionId as string] || 
                         PRODUCT_OBJECTIVES[selectedProduct.id as string] || 
                         'Investigar o negócio e transformar dados, evidências e percepções em direcionamentos estratégicos de alto impacto.'}
                      </p>
                    </div>
                  )}

                  {/* PREREQUISITE BLOCKED ALERT BANNER */}
                  {blockedPrereqWarning && (
                    <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start justify-between gap-3 text-amber-900 animate-fadeIn shadow-xs">
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <strong className="font-bold block text-amber-950">Ordem de Execução Obrigatória:</strong>
                          <p className="mt-0.5 leading-relaxed text-amber-900">{blockedPrereqWarning}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setBlockedPrereqWarning(null)}
                        className="text-amber-700 hover:text-amber-950 p-1 rounded-lg hover:bg-amber-100/60 cursor-pointer shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* STAGES LIST FOR THE SELECTED PRODUCT */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Etapas de Produção & Entregáveis ({selectedProduct?.name})
                        </h4>
                        <p className="text-xs text-slate-500">
                          O fluxo exige validação sequencial: 1. Onboarding ➔ 2. Kick-off ➔ Itens & Tarefas da Etapa.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setUploadContext({ productId: selectedProductKey });
                          setIsUploadModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Nova Arte / Lote</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {(productStagesMap[selectedProductKey] || []).map((stage, sIdx) => {
                        const isCompleted = stage.status === 'completed';
                        const isInProgress = stage.status === 'in_progress';
                        const isArtStage = stage.requiresArt || stage.isArtCreation || sIdx === (productStagesMap[selectedProductKey]?.length || 1) - 1;
                        const tasks = stage.tasks || [];
                        const completedTasksCount = tasks.filter(t => t.completed).length;
                        const totalTasksCount = tasks.length;

                        // Prerequisites check for this stage
                        const isOnboardingDone = stage.onboarding?.completed ?? isCompleted;
                        const isKickoffDone = stage.kickoff?.completed ?? isCompleted;
                        const isPrerequisitesFulfilled = isOnboardingDone && isKickoffDone;

                        return (
                          <div
                            key={stage.id}
                            className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-4 ${
                              isCompleted
                                ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                                : isInProgress
                                ? 'bg-cyan-50/40 border-cyan-300 ring-1 ring-cyan-400/30 shadow-xs'
                                : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100/80 pb-3">
                              <div className="flex items-start space-x-3 min-w-0">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                  isCompleted
                                    ? 'bg-emerald-600 text-white'
                                    : isInProgress
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {isCompleted ? <Check className="w-4 h-4" /> : sIdx + 1}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                    <h5 className="text-xs sm:text-sm font-bold text-slate-900">{stage.name}</h5>
                                    {isArtStage && (
                                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                                        🎨 Produção de Artes
                                      </span>
                                    )}
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                      {completedTasksCount}/{totalTasksCount} itens concluídos
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-1">{stage.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                                <button
                                  onClick={() => handleUpdateStageStatus(
                                    stage.id,
                                    isCompleted ? 'in_progress' : isInProgress ? 'completed' : 'in_progress'
                                  )}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                                    isCompleted
                                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-200'
                                      : isInProgress
                                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span>{isCompleted ? '✓ Concluída' : isInProgress ? 'Em Execução' : 'Iniciar Etapa'}</span>
                                </button>

                                <button
                                  onClick={() => handleStageClick(
                                    selectedProductKey,
                                    selectedProduct?.name || 'Produto',
                                    selectedProduct?.solutionId || 'sharp_brand',
                                    stage,
                                    sIdx
                                  )}
                                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Painel Completo</span>
                                </button>
                              </div>
                            </div>

                            {/* SECTION 1: MANDATORY PREREQUISITES (ONBOARDING & KICK-OFF) */}
                            <div className="space-y-2 pt-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                                    <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                                    <span>Etapas Antecedentes Obrigatórias (Pré-requisitos)</span>
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                                    Validação Obrigatória
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {isPrerequisitesFulfilled ? '✓ Pré-requisitos validados' : 'Obrigatório validar 1 e 2 para liberar produção'}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                
                                {/* 1. ONBOARDING CARD */}
                                <div
                                  onClick={() => handleTogglePrerequisite(stage.id, 'onboarding')}
                                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                    isOnboardingDone
                                      ? 'bg-emerald-50/80 border-emerald-300 text-slate-800 shadow-xs'
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
                                        <span className={`font-extrabold text-xs tracking-tight ${isOnboardingDone ? 'text-emerald-900' : 'text-slate-900'}`}>
                                          1. ONBOARDING
                                        </span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                                          Ingrid / Raphael
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-600 leading-snug">
                                        Apresentação da empresa, produtos contratados e metodologia. Além de enviar o questionário que baseará todo o projeto.
                                      </p>
                                      <div className="pt-0.5 flex items-center space-x-1.5">
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

                                {/* 2. KICK-OFF CARD */}
                                <div
                                  onClick={() => handleTogglePrerequisite(stage.id, 'kickoff')}
                                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                    isKickoffDone
                                      ? 'bg-emerald-50/80 border-emerald-300 text-slate-800 shadow-xs'
                                      : !isOnboardingDone
                                      ? 'bg-slate-50/80 border-slate-200/90 opacity-75 hover:border-amber-300'
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
                                        <span className={`font-extrabold text-xs tracking-tight ${isKickoffDone ? 'text-emerald-900' : 'text-slate-900'}`}>
                                          2. KICK-OFF
                                        </span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                                          Raphael (Estrategista)
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-slate-600 leading-snug">
                                        Apresentação do plano operacional (o que será feito, como será feito), plano de marketing e agendas para ação.
                                      </p>
                                      <div className="pt-0.5 flex items-center space-x-1.5">
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

                            {/* SECTION 2: PRODUCTION TASKS & DELIVERABLES */}
                            {tasks.length > 0 && (
                              <div className="space-y-2 pt-2 border-t border-slate-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                                  <div className="flex items-center space-x-2">
                                    <span>Itens & Tarefas da Etapa:</span>
                                    {isPrerequisitesFulfilled ? (
                                      <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md">
                                        ✓ Liberado para Produção
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200 rounded-md flex items-center space-x-1">
                                        <Lock className="w-2.5 h-2.5" />
                                        <span>Bloqueado: Requer Onboarding e Kick-off</span>
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    {isPrerequisitesFulfilled ? 'Clique para marcar como concluído' : 'Valide os pré-requisitos para poder dar check'}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {tasks.map(task => {
                                    const isLocked = !isPrerequisitesFulfilled;
                                    return (
                                      <div
                                        key={task.id}
                                        onClick={() => {
                                          if (isLocked) {
                                            setBlockedPrereqWarning('Para marcar as tarefas de produção, conclua e valide primeiro as etapas de 1. Onboarding e 2. Kick-off.');
                                            return;
                                          }
                                          handleToggleTask(stage.id, task.id);
                                        }}
                                        title={isLocked ? 'Bloqueado: Conclua o Onboarding e o Kick-off primeiro' : undefined}
                                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                                          task.completed
                                            ? 'bg-emerald-50/70 border-emerald-200 text-slate-700 line-through opacity-75'
                                            : isLocked
                                            ? 'bg-slate-50/70 border-slate-200/90 text-slate-500 cursor-not-allowed opacity-80 hover:bg-slate-100'
                                            : 'bg-white border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/20 text-slate-800 cursor-pointer'
                                        }`}
                                      >
                                        <div className="flex items-center space-x-2.5 min-w-0">
                                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                                            task.completed 
                                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                                              : isLocked
                                              ? 'border-slate-200 bg-slate-100 text-slate-400'
                                              : 'border-slate-300 bg-white'
                                          }`}>
                                            {task.completed ? (
                                              <Check className="w-3 h-3 stroke-[3]" />
                                            ) : isLocked ? (
                                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                                            ) : null}
                                          </div>
                                          <span className={`truncate font-medium ${isLocked && !task.completed ? 'text-slate-600' : ''}`}>
                                            {task.title}
                                          </span>
                                        </div>

                                        <div className="flex items-center space-x-1.5 shrink-0">
                                          {isLocked && !task.completed && (
                                            <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/70 px-1.5 py-0.5 rounded">
                                              🔒 Bloqueado
                                            </span>
                                          )}
                                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium">
                                            {task.assignedTo?.split(' ')[0] || 'Sharp'}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 2: DADOS CADASTRAIS, LOGO & CONTRATO */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Logo & General Info */}
                <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Logotipo do Cliente
                  </h4>

                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                      {clientLogoUrl ? (
                        <img src={clientLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-300" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={logoFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      <button
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Fazer Upload do Logo</span>
                      </button>
                      <p className="text-[10px] text-slate-500">Formatos aceitos: SVG, PNG ou JPG em alta resolução.</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 space-y-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Razão Social / Empresa</span>
                      <p className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold">{project.companyName}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block mb-1">Responsável Principal</span>
                      <p className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold">{project.clientName}</p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-700 block mb-1">E-mail Cadastrado</span>
                      <p className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold">{project.clientEmail}</p>
                    </div>

                    {/* Quick Access Credentials & Chat Link */}
                    <div className="p-3 bg-cyan-50/70 border border-cyan-200/80 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-cyan-950 flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Credenciais de Acesso do Cliente</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {clientAccount.status === 'active' ? 'Ativo' : 'Pendente'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 rounded-lg border border-cyan-100">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Usuário</span>
                          <span className="font-mono font-bold text-slate-800">{clientAccount.username}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Senha Padrão</span>
                          <span className="font-mono font-bold text-slate-800">{clientAccount.password}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCopyCredentials}
                          className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-100 border border-cyan-200 rounded-lg text-[11px] font-bold text-cyan-800 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5 text-cyan-600" />
                          <span>{copiedCredentials ? 'Copiado!' : 'Copiar Acesso'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            navigateToClientChat(project.companyName);
                          }}
                          className="flex-1 py-1.5 px-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center space-x-1 cursor-pointer shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Abrir Chat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Contract Values & Operational Notes */}
                <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Valores & Contrato (Sincronizado)
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                      Gestão Centralizada
                    </span>
                  </div>

                  {/* Financial Read-Only Summary Box */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">1º Mês / Setup</span>
                        <p className="text-sm font-black text-slate-900 mt-0.5">
                          {contractValue ? (typeof contractValue === 'string' && contractValue.startsWith('R$') ? contractValue : `R$ ${parseFloat(String(contractValue).replace(/[^0-9.]/g, '') || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`) : 'R$ 0,00'}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mensalidade</span>
                        <p className="text-sm font-black text-cyan-800 mt-0.5">
                          {monthlyFee ? (typeof monthlyFee === 'string' && monthlyFee.startsWith('R$') ? monthlyFee : `R$ ${parseFloat(String(monthlyFee).replace(/[^0-9.]/g, '') || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês`) : 'R$ 0,00/mês'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <p className="text-[10px] text-slate-500">
                        Editável exclusivamente via <strong>Financeiro</strong> ou <strong>Clientes & Contas</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          setActiveNavTab('financial');
                        }}
                        className="text-[11px] font-bold text-cyan-700 hover:text-cyan-800 flex items-center space-x-1 cursor-pointer"
                      >
                        <span>Abrir Financeiro</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Observações Estratégicas do Cliente</label>
                      <textarea
                        rows={4}
                        value={operationalNotes}
                        onChange={(e) => setOperationalNotes(e.target.value)}
                        placeholder="Anotações internas sobre preferências, tom de voz, público e diretrizes do cliente..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSaveDetails}
                      disabled={isSavingDetails}
                      className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <span>{isSavingDetails ? 'Salvando...' : 'Salvar Alterações Operacionais'}</span>
                    </button>
                    {saveSuccessMsg && (
                      <p className="text-xs text-emerald-700 font-bold text-center mt-2 animate-fadeIn">{saveSuccessMsg}</p>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: FOLLOW-UP & CONTROLE DE QUALIDADE */}
          {activeTab === 'followup' && (
            <div className="space-y-5 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Acompanhamento & Retornos de Qualidade (CS)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Registre os contatos de feedback, medição de satisfação e acompanhamento das entregas com o cliente.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddFollowUpModal(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Registrar Follow-up</span>
                </button>
              </div>

              {/* Follow-up History Cards */}
              <div className="space-y-3">
                {clientFollowUps.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                    <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-semibold">Nenhum follow-up de qualidade registrado ainda.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Clique no botão "+ Registrar Follow-up" acima para iniciar o acompanhamento.</p>
                  </div>
                ) : (
                  clientFollowUps.map(fol => {
                    const isExpanded = expandedFollowUpIds.includes(fol.id);
                    const channelLabel = fol.channel === 'whatsapp' ? 'WhatsApp' :
                      fol.channel === 'call' ? 'Ligação' :
                      fol.channel === 'meet' ? 'Reunião Meet' : 'E-mail';

                    return (
                      <div
                        key={fol.id}
                        className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl shadow-xs transition-all overflow-hidden"
                      >
                        {/* REDUCED HEADER (CANAL, DATA, ESTRELAS, EXPAND BUTTON) */}
                        <div
                          onClick={() => toggleFollowUpExpanded(fol.id)}
                          className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 transition-colors"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 border border-cyan-100">
                              {fol.channel === 'whatsapp' ? <MessageCircle className="w-4 h-4" /> :
                               fol.channel === 'call' ? <PhoneCall className="w-4 h-4" /> :
                               fol.channel === 'meet' ? <Video className="w-4 h-4" /> :
                               <Mail className="w-4 h-4" />}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center space-x-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-900">
                                  {channelLabel}
                                </span>
                                <span className="text-[11px] text-slate-400">•</span>
                                <span className="text-xs font-semibold text-slate-700">
                                  {fol.scheduledDate}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 truncate block">
                                Contato: {fol.contactPerson || 'Responsável'} {fol.contactedBy ? `• Feito por: ${fol.contactedBy}` : ''}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-center">
                            {/* Stars Rating Display */}
                            {fol.satisfactionScore && (
                              <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800">
                                <div className="flex items-center">
                                  {Array.from({ length: fol.satisfactionScore }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-500" />
                                  ))}
                                </div>
                                <span>{fol.satisfactionScore}/5</span>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteQualityFollowUp(fol.id);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Excluir follow-up"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>

                        {/* EXPANDED FULL DETAILS */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/40 space-y-3 text-xs animate-fadeIn">
                            {fol.qualityNotes && (
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Observações do Time de Qualidade</span>
                                <p className="text-slate-700 mt-0.5 bg-white p-2.5 rounded-xl border border-slate-200/80">{fol.qualityNotes}</p>
                              </div>
                            )}

                            {fol.clientFeedback && (
                              <div>
                                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Feedback do Cliente</span>
                                <p className="text-slate-800 mt-0.5 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/80 font-medium">"{fol.clientFeedback}"</p>
                              </div>
                            )}

                            {fol.actionItems && (
                              <div>
                                <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider block">Próximos Passos / Encaminhamentos</span>
                                <p className="text-slate-700 mt-0.5 bg-white p-2 rounded-xl border border-slate-200/80">{fol.actionItems}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* TAB 4: ARTE & ENTREGÁVEIS */}
          {activeTab === 'art' && hasArtService && (
            <div className="space-y-6 animate-fadeIn">
              <ArtDeliverablePipeline project={project} />
            </div>
          )}

        </div>

      </div>

      {/* MODAL: NOVO FOLLOW-UP DE QUALIDADE */}
      {showAddFollowUpModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Registrar Follow-up de Qualidade</span>
              </div>
              <button onClick={() => setShowAddFollowUpModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFollowUp} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Canal de Contato</label>
                  <select
                    value={folChannel}
                    onChange={(e: any) => setFolChannel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-900"
                  >
                    <option value="whatsapp">WhatsApp Oficial</option>
                    <option value="call">Ligação Telefônica</option>
                    <option value="meet">Google Meet / Reunião</option>
                    <option value="email">E-mail</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Data do Contato</label>
                  <input
                    type="date"
                    required
                    value={folDate}
                    onChange={(e) => setFolDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Pessoa Contatada</label>
                <input
                  type="text"
                  required
                  value={folContactPerson}
                  onChange={(e) => setFolContactPerson(e.target.value)}
                  placeholder="Ex: Dra. Camila"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nota de Satisfação (1 a 5 estrelas)</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setFolSatisfactionScore(score)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center space-x-1 ${
                        folSatisfactionScore >= score
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{score}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Relato / Feedback do Cliente</label>
                <textarea
                  rows={2}
                  required
                  placeholder="O que o cliente relatou sobre o projeto e a qualidade dos serviços..."
                  value={folFeedback}
                  onChange={(e) => setFolFeedback(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Observações Internas de Qualidade & CS</label>
                <textarea
                  rows={2}
                  placeholder="Anotações para a equipe sobre pontos de atenção..."
                  value={folNotes}
                  onChange={(e) => setFolNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Encaminhamentos / Próximos Passos</label>
                <input
                  type="text"
                  placeholder="Ex: Liberar próximo lote no dia 15"
                  value={folActionItems}
                  onChange={(e) => setFolActionItems(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFollowUpModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Salvar Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAGE TASKS MODAL */}
      {selectedStageData && (() => {
        const currentStages = productStagesMap[selectedStageData.prodKey] || [];
        const liveStage = currentStages.find(s => s.id === selectedStageData.stage.id) || selectedStageData.stage;

        return (
          <StageTasksModal
            isOpen={true}
            onClose={() => setSelectedStageData(null)}
            stage={liveStage}
            productName={selectedStageData.productName}
            solutionId={selectedStageData.solutionId}
            companyName={project.companyName}
            project={project}
            onToggleTask={handleToggleTask}
            onTogglePrerequisite={handleTogglePrerequisite}
            onUpdateStageStatus={handleUpdateStageStatus}
            onAddTask={(stageId, title, assignedTo) => {
              const currentStages = productStagesMap[selectedStageData.prodKey] || [];
              const updatedStages = currentStages.map(st => {
                if (st.id === stageId) {
                  const newTask = {
                    id: `task_custom_${Date.now()}`,
                    title,
                    completed: false,
                    assignedTo
                  };
                  return {
                    ...st,
                    tasks: [...st.tasks, newTask]
                  };
                }
                return st;
              });
              setProductStagesMap(prev => ({ ...prev, [selectedStageData.prodKey]: updatedStages }));
            }}
            onOpenUploadModal={(taskTitle) => {
              setUploadContext({ 
                productId: selectedStageData.prodKey,
                subProductName: taskTitle || selectedStageData.productName
              });
              setIsUploadModalOpen(true);
            }}
            onOpenUploadDeliverable={() => {
              setUploadContext({ 
                productId: selectedStageData.prodKey,
                subProductName: selectedStageData.productName
              });
              setIsUploadModalOpen(true);
            }}
          />
        );
      })()}

      {/* CONTENT UPLOAD MODAL */}
      <ContentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        projectId={project.id}
        productId={uploadContext?.productId}
        subProductId={uploadContext?.subProductId}
        subProductName={uploadContext?.subProductName}
        companyName={project.companyName}
      />

      {/* BLOCKED ART STAGE MODAL */}
      {blockedArtModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Etapa de Artes Bloqueada</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Para liberar a criação e upload de artes em <strong>{blockedArtModal.productName}</strong>, é necessário concluir as etapas anteriores:
            </p>
            <div className="bg-slate-50 p-3 rounded-xl text-xs text-left space-y-1">
              {blockedArtModal.pendingStages.map((st, i) => (
                <div key={i} className="flex items-center space-x-1.5 text-amber-800 font-semibold">
                  <span>•</span>
                  <span>{st}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setBlockedArtModal(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
