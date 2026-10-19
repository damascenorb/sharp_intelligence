import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SolutionId,
  BriefingFormData,
  DiagnosticData,
  PainAnalysisResult,
  VisualInspiration,
  Lead,
  Project,
  ProjectStage,
  OnboardingCheckitem,
  ScheduledMeeting,
  UserRole,
  ContentDeliverable,
  PipelineStage,
  StaffMember,
  ClientAccount,
  CurrentUser,
  ChatMessage,
  SystemNotification,
  InternalReview,
  ClientApprovalInfo,
  ContentComment,
  Account,
  Contact,
  DuplicateNotice,
  Opportunity,
  Contract,
  DeliveryTemplate,
  ProjectReworkTask,
  ProjectActiveProduct,
  ProjectSubProduct,
  QualityFollowUp
} from '../types';
import {
  generateDefaultSubProducts
} from '../utils/productUtils';
import {
  STORAGE_KEYS,
  initializeSingleSourceData
} from '../data/singleSourceData';
import {
  SHARP_SOLUTIONS,
  INITIAL_LEADS,
  INITIAL_PROJECTS,
  INITIAL_VISUAL_INSPIRATIONS,
  INITIAL_MEETINGS,
  INITIAL_STAFF,
  INITIAL_CLIENT_ACCOUNTS,
  INITIAL_CHAT_MESSAGES
} from '../data/mockData';
import {
  ServicePackagePricing,
  SHARP_OFFICIAL_PACKAGES
} from '../data/sharpPricingData';
import {
  getUnifiedClients,
  saveUnifiedClients,
  createUnifiedEnrollment,
  UnifiedClient
} from '../data/methodologyData';
import {
  createDataBackup,
  restoreDataBackup,
  getLatestBackup,
  ensureInitialSafetyBackup,
  DataBackup
} from '../utils/backupUtils';
import { isClientMatch } from '../utils/clientMatching';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
  selectedChatClientId: string | null;
  setSelectedChatClientId: (id: string | null) => void;
  navigateToClientChat: (clientIdentifier: string) => void;

  currentUser: CurrentUser | null;
  staffMembers: StaffMember[];
  clientAccounts: ClientAccount[];
  sharpLogoUrl: string | null;
  setSharpLogoUrl: (url: string | null) => void;
  sharpMasterProfile: {
    companyName: string;
    masterUsername: string;
    email: string;
    phone: string;
    whatsapp: string;
    description: string;
    lastUpdated?: string;
  };
  updateSharpMasterProfile: (data: Partial<{
    companyName: string;
    masterUsername: string;
    email: string;
    phone: string;
    whatsapp: string;
    description: string;
  }>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  registerStaffMember: (staff: Omit<StaffMember, 'id' | 'createdAt'>) => { success: boolean; message?: string };
  updateStaffMember: (staffId: string, updatedData: Partial<StaffMember>) => { success: boolean; message?: string };
  deleteStaffMember: (staffId: string) => { success: boolean; message?: string };
  registerClientAccount: (client: Omit<ClientAccount, 'id' | 'createdAt'>) => { success: boolean; message?: string };
  updateClientAccount: (accountId: string, updatedData: Partial<ClientAccount>) => { success: boolean; message?: string };
  deleteClientAccount: (accountId: string) => { success: boolean; message?: string };
  toggleClientStatus: (accountId: string, status: 'active' | 'inactive') => void;
  isClientInactive: (identifier?: string) => boolean;
  clearAllClientTestData: () => void;
  changeUserPassword: (newPassword: string) => { success: boolean; message?: string };

  notifications: SystemNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<SystemNotification, 'id' | 'createdAt' | 'read'>) => void;

  chatMessages: ChatMessage[];
  sendChatMessage: (msg: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  updateChatApprovalStatus: (messageId: string, status: 'approved' | 'rejected' | 'revision', feedback?: string) => void;

  // New Workflow actions for Art & Deliverables Approval
  sendDeliverableToClientApproval: (projectId: string, contentId: string) => void;
  sendDeliverableToInternalReview: (projectId: string, contentId: string) => void;
  submitClientDecision: (projectId: string, contentId: string, decision: 'approved' | 'rejected' | 'revision', feedback?: string) => void;
  submitInternalReview: (projectId: string, contentId: string, decision: 'approved' | 'rejected' | 'revision', notes?: string) => void;
  addDeliverableComment: (projectId: string, contentId: string, text: string) => void;

  selectedDeliverableForFocus: { projectId: string; deliverableId: string } | null;
  setSelectedDeliverableForFocus: React.Dispatch<React.SetStateAction<{ projectId: string; deliverableId: string } | null>>;

  selectedSolutions: SolutionId[];
  toggleSolution: (id: SolutionId) => void;
  setSelectedSolutions: (ids: SolutionId[]) => void;
  
  clientInfo: {
    name: string;
    company: string;
    email: string;
    phone: string;
    segment: string;
  };
  setClientInfo: React.Dispatch<React.SetStateAction<{
    name: string;
    company: string;
    email: string;
    phone: string;
    segment: string;
  }>>;

  leads: Lead[];
  projects: Project[];
  visualInspirations: VisualInspiration[];
  scheduledMeetings: ScheduledMeeting[];

  currentBriefing: BriefingFormData | null;
  currentPainAnalysis: PainAnalysisResult | null;
  
  isSubmittingBriefing: boolean;
  isAnalyzingPain: boolean;
  isGeneratingVisual: boolean;

  // Actions
  submitBriefing: (formData: BriefingFormData) => Promise<boolean>;
  submitDiagnosticLead: (data: {
    contactName: string;
    companyName: string;
    email: string;
    phone: string;
    segment?: string;
    painAnalysis?: PainAnalysisResult;
    chatSummary?: string;
    diagnosticData?: DiagnosticData;
    notes?: string;
  }) => Promise<boolean>;
  analyzePain: (challenge: string) => Promise<PainAnalysisResult | null>;
  generateVisual: (prompt: string, style: string) => Promise<VisualInspiration | null>;
  bookMeeting: (
    date: string,
    timeSlot: string,
    specialist: string,
    type?: 'diagnostico_gratuito' | 'semanal_feedback',
    customInfo?: { name: string; company: string; email: string; companySocial?: string; phone?: string; reason?: string }
  ) => Promise<ScheduledMeeting>;
  
  // Admin actions
  updateLeadStage: (leadId: string, stage: PipelineStage) => void;
  convertLeadToClientAndProject: (leadId: string) => { success: boolean; projectId?: string; clientId?: string };
  deleteLead: (leadId: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => Project;
  updateProject: (projectId: string, updatedData: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  deleteDeliverable: (projectId: string, contentId: string) => void;
  deleteVisualInspiration: (inspirationId: string) => void;
  sendArtLeaderNotes: (inspirationId: string, notes: string) => void;
  uploadContentDeliverable: (projectId: string, content: Omit<ContentDeliverable, 'id' | 'createdAt'>) => void;
  toggleProjectArchive: (projectId: string, archived?: boolean) => void;
  toggleDeliverableArchive: (projectId: string, contentId: string, archived?: boolean) => void;
  toggleArtArchive: (inspirationId: string, archived?: boolean) => void;
  
  // Stage Checklists
  toggleStageChecklistItem: (projectId: string, stage: ProjectStage, itemId: string) => void;
  addStageChecklistItem: (projectId: string, stage: ProjectStage, label: string) => void;
  removeStageChecklistItem: (projectId: string, stage: ProjectStage, itemId: string) => void;
  setProjectStage: (projectId: string, stage: ProjectStage) => void;
  
  // Backup & Safety
  createDataBackup: () => DataBackup;
  restoreDataBackup: (backupPayload?: DataBackup | string) => { success: boolean; message: string; details?: any };
  getLatestBackup: () => DataBackup | null;

  // Client actions
  approveContent: (projectId: string, contentId: string) => void;
  requestContentAdjustment: (projectId: string, contentId: string, feedback: string) => void;
  toggleOnboardingItem: (projectId: string, itemId: string) => void;
  addOnboardingItem: (projectId: string, label: string) => void;
  removeOnboardingItem: (projectId: string, itemId: string) => void;

  // Quality Follow-Ups (Acompanhamento e Retorno de Clientes)
  qualityFollowUps: QualityFollowUp[];
  addQualityFollowUp: (followUp: Omit<QualityFollowUp, 'id' | 'createdAt'> & { id?: string }) => QualityFollowUp;
  updateQualityFollowUp: (id: string, data: Partial<QualityFollowUp>) => void;
  deleteQualityFollowUp: (id: string) => void;

  // Single Source Accounts, Contacts, Opportunities, Contracts & Delivery Templates
  accounts: Account[];
  contacts: Contact[];
  duplicateNotices: DuplicateNotice[];
  opportunities: Opportunity[];
  contracts: Contract[];
  deliveryTemplates: DeliveryTemplate[];

  createAccount: (account: Omit<Account, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Account;
  updateAccount: (accountId: string, updatedData: Partial<Account>) => void;
  archiveAccount: (accountId: string) => void;
  archiveClientCascade: (companyNameOrAccountId: string, actionType?: 'archive' | 'delete') => void;
  restoreClientCascade: (companyNameOrAccountId: string) => void;
  toggleReworkTaskStatus: (projectId: string, taskId: string, status?: 'pending' | 'in_progress' | 'completed') => void;
  deleteAccountPermanently: (accountId: string, reason?: string) => void;
  deleteClientPermanently: (companyNameOrAccountId: string, reason?: string) => void;
  resolveDuplicateNotice: (noticeId: string) => void;
  createContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Contact;
  updateContact: (contactId: string, updatedData: Partial<Contact>) => void;
  createOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Opportunity;
  updateOpportunity: (opportunityId: string, updatedData: Partial<Opportunity>) => void;
  createContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => Contract;

  // Active Products & SubProducts Operational Sync
  addActiveProductToProject: (projectId: string, product: Omit<ProjectActiveProduct, 'id'>) => void;
  updateProjectActiveProduct: (projectId: string, productId: string, data: Partial<ProjectActiveProduct>) => void;
  removeProjectActiveProduct: (projectId: string, productId: string) => void;
  addSubProductToActiveProduct: (projectId: string, productId: string, subProduct: Omit<ProjectSubProduct, 'id'>) => void;
  updateProjectSubProduct: (projectId: string, productId: string, subProductId: string, data: Partial<ProjectSubProduct>) => void;
  removeProjectSubProduct: (projectId: string, productId: string, subProductId: string) => void;
  syncAllRegisteredClientsToProjects: () => { syncedCount: number; message: string };

  // Official Pricing & Products Catalog Management (Financeiro Comercial)
  officialPackages: ServicePackagePricing[];
  updateOfficialPackage: (packageId: string, updatedData: Partial<ServicePackagePricing>) => void;
  resetOfficialPackagesToDefault: () => void;
  addCustomOfficialPackage: (newPkg: ServicePackagePricing) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const DEFAULT_STAGE_TASKS: Record<ProjectStage, string[]> = {
  vendas_negociacao: [
    'Contrato de prestação de serviços assinado',
    'Escopo de produtos e subprodutos definido',
    'Condições comerciais e faturamento aprovados',
    'Criação da conta de acesso e dados cadastrais no portal'
  ],
  onboarding: [
    'Envio da logo e vetor da marca em alta resolução',
    'Preenchimento do Briefing Detalhado de Conteúdo & Público-Alvo',
    'Concessão de acesso de parceiro ao Meta Business Suite / Google Ads',
    'Envio de banco de fotos da empresa, produtos e equipe',
    'Agendamento da Reunião de Kickoff Executivo'
  ],
  kickoff: [
    'Alinhamento estratégico com o cliente e time de criação',
    'Definição das metas de branding, tom de voz e personas',
    'Estruturação do cronograma e prazos de entrega dos lotes',
    'Aprovação da direção de arte e moodboard inicial',
    'Abertura dos cards de criação e distribuição para designers'
  ],
  investigacao_estudo: [
    'Auditoria de concorrentes diretos e presença digital no segmento',
    'Mapeamento de Personas e Dores do ICP (Raphael & Cristiano)',
    'Benchmarking de território e Proposta Única de Valor (UVP)',
    'Definição dos 4 pilares temáticos de autoridade da linha editorial',
    'Passagem de bastão de Raphael & Cristiano para Kauã (Artes)'
  ],
  producao: [
    'Redação e revisão dos copys dos posts e criativos',
    'Design dos criativos, carrosséis e peças visuais',
    'Revisão técnica de qualidade pelo Líder de Arte (Luan)',
    'Validação da aderência às diretrizes do pilar contratado',
    'Upload das peças na esteira de aprovação interna'
  ],
  revisao_cliente: [
    'Envio da prévia do lote para avaliação do cliente',
    'Coleta de feedbacks e eventuais solicitações de ajuste',
    'Execução das alterações pontuais solicitadas pelo cliente',
    'Aprovação formal das peças e agendamento de publicação'
  ],
  concluido: [
    'Publicação / Entrega final dos arquivos em alta resolução',
    'Configuração de campanhas de tráfego / distribuição',
    'Monitoramento de métricas e engajamento inicial',
    'Apresentação do relatório de resultados do ciclo',
    'Fechamento do ciclo e renovação do próximo lote'
  ]
};

export const getInitialChecklistForStage = (stage: ProjectStage): OnboardingCheckitem[] => {
  const items = DEFAULT_STAGE_TASKS[stage] || DEFAULT_STAGE_TASKS.onboarding;
  return items.map((label, idx) => ({
    id: `chk-${stage}-${Date.now()}-${idx}`,
    label,
    completed: false
  }));
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem('sharp_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'guest';
  });

  const isCleared = typeof window !== 'undefined' && localStorage.getItem('sharp_cleared_test_data') === 'true';

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('sharp_staff_members');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [clientAccounts, setClientAccounts] = useState<ClientAccount[]>(() => {
    const saved = localStorage.getItem('sharp_client_accounts');
    return saved ? JSON.parse(saved) : (isCleared ? [] : INITIAL_CLIENT_ACCOUNTS);
  });

  const [sharpLogoUrl, setSharpLogoUrlState] = useState<string | null>(() => {
    return localStorage.getItem('sharp_custom_logo_url') || null;
  });

  const setSharpLogoUrl = (url: string | null) => {
    setSharpLogoUrlState(url);
    if (url && url.trim()) {
      localStorage.setItem('sharp_custom_logo_url', url.trim());
    } else {
      localStorage.removeItem('sharp_custom_logo_url');
    }
  };

  const [sharpMasterProfile, setSharpMasterProfile] = useState<{
    companyName: string;
    masterUsername: string;
    email: string;
    phone: string;
    whatsapp: string;
    description: string;
    lastUpdated?: string;
  }>(() => {
    const saved = localStorage.getItem('sharp_master_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error reading sharp master profile', e);
      }
    }
    return {
      companyName: 'SHARP Intelligence Corp / Matriz',
      masterUsername: 'sharp',
      email: 'contato@sharpintelligence.com.br',
      phone: '(19) 9 9568-2110',
      whatsapp: '5519995682110',
      description: 'Hub executivo de inteligência, branding e presença digital de alta performance.'
    };
  });

  const updateSharpMasterProfile = (data: Partial<{
    companyName: string;
    masterUsername: string;
    email: string;
    phone: string;
    whatsapp: string;
    description: string;
  }>) => {
    setSharpMasterProfile(prev => {
      const updated = { ...prev, ...data, lastUpdated: new Date().toISOString() };
      localStorage.setItem('sharp_master_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<string>('solutions');
  const [selectedChatClientId, setSelectedChatClientId] = useState<string | null>(null);

  const navigateToClientChat = (clientIdentifier: string) => {
    // 1. Match client account
    let targetAcc = clientAccounts.find(
      c => c.id === clientIdentifier ||
           c.companyName.toLowerCase() === clientIdentifier.toLowerCase() ||
           c.clientName.toLowerCase() === clientIdentifier.toLowerCase() ||
           c.username.toLowerCase() === clientIdentifier.toLowerCase()
    );

    let targetClientId = targetAcc?.id;

    // 2. If not found in clientAccounts, check projects or accounts and register
    if (!targetClientId) {
      const proj = projects.find(
        p => p.id === clientIdentifier ||
             p.companyName.toLowerCase() === clientIdentifier.toLowerCase() ||
             p.clientName.toLowerCase() === clientIdentifier.toLowerCase()
      );
      const company = proj?.companyName || clientIdentifier;
      const clientName = proj?.clientName || company;
      const cleanUsername = company
        .split(' ')[0]
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "") || 'cliente';
      
      const newClientId = `client-${Date.now()}`;
      const newClientAcc: ClientAccount = {
        id: newClientId,
        companyName: company,
        clientName: clientName,
        email: proj?.clientEmail || `${cleanUsername}@cliente.com.br`,
        phone: proj?.clientPhone || '(19) 9 9568-2110',
        username: cleanUsername,
        password: 'Sharp@2026',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      setClientAccounts(prev => {
        const updated = [...prev, newClientAcc];
        if (typeof window !== 'undefined') {
          localStorage.setItem('sharp_client_accounts', JSON.stringify(updated));
        }
        return updated;
      });

      targetClientId = newClientId;
      targetAcc = newClientAcc;
    }

    // 3. Ensure a welcome chat message exists for this client
    setChatMessages(prev => {
      const exists = prev.some(m => m.clientAccountId === targetClientId);
      if (!exists) {
        const companyName = targetAcc?.companyName || clientIdentifier;
        const welcomeMsg: ChatMessage = {
          id: `msg_welcome_${Date.now()}`,
          senderId: 'team-raphael',
          senderName: 'Raphael (Estrategista Chefe - Sharp)',
          senderRole: 'sharp',
          channel: 'client_direct',
          clientAccountId: targetClientId,
          content: `Olá, equipe ${companyName}! Sejam muito bem-vindos à Sharp. Este é o canal direto e exclusivo de comunicação com os estrategistas, designers e líderes da sua conta. Qualquer dúvida, solicitação de alteração ou alinhamento operacional pode ser enviado diretamente por aqui.`,
          createdAt: new Date().toISOString()
        };
        const updated = [...prev, welcomeMsg];
        if (typeof window !== 'undefined') {
          localStorage.setItem('sharp_chat_messages', JSON.stringify(updated));
        }
        return updated;
      }
      return prev;
    });

    // 4. Set state and navigate
    setSelectedChatClientId(targetClientId);
    setActiveNavTab('chat');
  };

  const [selectedSolutions, setSelectedSolutionsState] = useState<SolutionId[]>(['sharp_brand', 'sharp_presence']);
  
  const [clientInfo, setClientInfo] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    segment: ''
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('sharp_leads');
    return saved ? JSON.parse(saved) : (isCleared ? [] : INITIAL_LEADS);
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('sharp_projects');
    return saved ? JSON.parse(saved) : (isCleared ? [] : INITIAL_PROJECTS);
  });

  const [visualInspirations, setVisualInspirations] = useState<VisualInspiration[]>(() => {
    const saved = localStorage.getItem('sharp_visual_inspirations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(v => v.id !== 'vis-1' && v.clientEmail !== 'camila@luminaodonto.com.br');
        }
      } catch (e) {
        console.error('Error loading visual inspirations', e);
      }
    }
    return isCleared ? [] : INITIAL_VISUAL_INSPIRATIONS;
  });

  const [scheduledMeetings, setScheduledMeetings] = useState<ScheduledMeeting[]>(() => {
    const saved = localStorage.getItem('sharp_meetings');
    return saved ? JSON.parse(saved) : (isCleared ? [] : INITIAL_MEETINGS);
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('sharp_chat_messages');
    return saved ? JSON.parse(saved) : (isCleared ? [] : INITIAL_CHAT_MESSAGES);
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('sharp_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading notifications', e);
      }
    }
    return [
      {
        id: 'notif-seed-1',
        type: 'internal_art_review',
        targetRole: 'sharp',
        title: 'Nova Arte para Avaliação Interna',
        message: 'Solicitação para avaliar a arte "Carrossel: Os 5 Pilares da Transformação" vinculada ao cliente Lumina Odontologia.',
        clientName: 'Lumina Odontologia Estética',
        projectId: 'proj-1',
        deliverableId: 'c1',
        read: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        actionTab: 'projects'
      }
    ];
  });

  const [selectedDeliverableForFocus, setSelectedDeliverableForFocus] = useState<{ projectId: string; deliverableId: string } | null>(null);

  const [currentBriefing, setCurrentBriefing] = useState<BriefingFormData | null>(null);

  const [currentPainAnalysis, setCurrentPainAnalysis] = useState<PainAnalysisResult | null>(() => {
    const lead = INITIAL_LEADS.find(l => l.email === clientInfo.email);
    return lead?.painAnalysis || null;
  });

  const [isSubmittingBriefing, setIsSubmittingBriefing] = useState(false);
  const [isAnalyzingPain, setIsAnalyzingPain] = useState(false);
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false);

  // Single Source Data States (ETAPA 2)
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.accounts);
    return saved ? JSON.parse(saved) : initializeSingleSourceData().accounts;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.contacts);
    return saved ? JSON.parse(saved) : initializeSingleSourceData().contacts;
  });

  const [duplicateNotices, setDuplicateNotices] = useState<DuplicateNotice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.duplicateNotices);
    return saved ? JSON.parse(saved) : initializeSingleSourceData().duplicateNotices;
  });

  const [qualityFollowUps, setQualityFollowUps] = useState<QualityFollowUp[]>(() => {
    const saved = localStorage.getItem('sharp_quality_followups');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading quality followups', e);
      }
    }
    return [
      {
        id: 'fol-lumina-1',
        clientId: 'client-camila',
        clientName: 'Dra. Camila Vasconcelos',
        companyName: 'Lumina Odontologia Estética',
        scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        contactPerson: 'Dra. Camila Vasconcelos',
        channel: 'whatsapp',
        satisfactionScore: 5,
        status: 'completed',
        qualityNotes: 'Cliente altamente satisfeita com o alinhamento da identidade visual e agilidade da equipe Sharp.',
        clientFeedback: 'Excelente acompanhamento da equipe. As artes do feed ficaram impecáveis.',
        actionItems: 'Avançar com a liberação do lote de social media e agendar reunião de alinhamento mensal.',
        contactedBy: 'Time de Qualidade & CS Sharp',
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: 'fol-lumina-2',
        clientId: 'client-camila',
        clientName: 'Dra. Camila Vasconcelos',
        companyName: 'Lumina Odontologia Estética',
        scheduledDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        contactPerson: 'Dra. Camila Vasconcelos',
        channel: 'call',
        status: 'pending',
        qualityNotes: 'Acompanhamento do segundo lote de publicações e validação de percepção de marca.',
        actionItems: 'Apresentar dados de engajamento do Instagram e coletar novo feedback.',
        contactedBy: 'Time de Qualidade & CS Sharp',
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.opportunities);
    return saved ? JSON.parse(saved) : initializeSingleSourceData().opportunities;
  });

  const [contracts, setContracts] = useState<Contract[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.contracts);
    return saved ? JSON.parse(saved) : initializeSingleSourceData().contracts;
  });

  const [deliveryTemplates, setDeliveryTemplates] = useState<DeliveryTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.deliveryTemplates);
    return saved ? JSON.parse(saved) : initializeSingleSourceData().deliveryTemplates;
  });

  // Official Pricing & Products Catalog State (Financeiro Comercial)
  const [officialPackages, setOfficialPackages] = useState<ServicePackagePricing[]>(() => {
    const saved = localStorage.getItem('sharp_official_packages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Error loading official packages', e);
      }
    }
    return SHARP_OFFICIAL_PACKAGES;
  });

  useEffect(() => {
    localStorage.setItem('sharp_official_packages', JSON.stringify(officialPackages));
  }, [officialPackages]);

  const updateOfficialPackage = (packageId: string, updatedData: Partial<ServicePackagePricing>) => {
    setOfficialPackages(prev => prev.map(p => p.id === packageId ? { ...p, ...updatedData } : p));
  };

  const resetOfficialPackagesToDefault = () => {
    setOfficialPackages(SHARP_OFFICIAL_PACKAGES);
    localStorage.removeItem('sharp_official_packages');
  };

  const addCustomOfficialPackage = (newPkg: ServicePackagePricing) => {
    setOfficialPackages(prev => [...prev, newPkg]);
  };

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sharp_current_user', JSON.stringify(currentUser));
      setUserRole(currentUser.role);
    } else {
      localStorage.removeItem('sharp_current_user');
      setUserRole('guest');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sharp_staff_members', JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem('sharp_client_accounts', JSON.stringify(clientAccounts));
  }, [clientAccounts]);

  useEffect(() => {
    localStorage.setItem('sharp_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('sharp_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('sharp_visual_inspirations', JSON.stringify(visualInspirations));
  }, [visualInspirations]);

  useEffect(() => {
    localStorage.setItem('sharp_meetings', JSON.stringify(scheduledMeetings));
  }, [scheduledMeetings]);

  useEffect(() => {
    localStorage.setItem('sharp_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('sharp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sharp_quality_followups', JSON.stringify(qualityFollowUps));
  }, [qualityFollowUps]);

  // Quality Follow-Up Handlers
  const addQualityFollowUp = (data: Omit<QualityFollowUp, 'id' | 'createdAt'> & { id?: string }): QualityFollowUp => {
    const newFollowUp: QualityFollowUp = {
      ...data,
      id: data.id || `fol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    setQualityFollowUps(prev => [newFollowUp, ...prev]);
    return newFollowUp;
  };

  const updateQualityFollowUp = (id: string, data: Partial<QualityFollowUp>) => {
    setQualityFollowUps(prev => prev.map(f => f.id === id ? { ...f, ...data } : f));
  };

  const deleteQualityFollowUp = (id: string) => {
    setQualityFollowUps(prev => prev.filter(f => f.id !== id));
  };

  // Auto-guarantee initial backup snapshot on start
  useEffect(() => {
    ensureInitialSafetyBackup();
  }, []);

  // Notifications logic
  const unreadNotificationsCount = notifications.filter(n => {
    if (n.read) return false;
    if (currentUser?.role === 'sharp_admin') {
      return n.targetRole === 'sharp' || n.targetRole === 'all';
    }
    return n.targetRole === 'client' || n.targetRole === 'all';
  }).length;

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notifData: Omit<SystemNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: SystemNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Chat Actions
  const sendChatMessage = (msgData: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const updateChatApprovalStatus = (messageId: string, status: 'approved' | 'rejected' | 'revision', feedback?: string) => {
    const targetMsg = chatMessages.find(m => m.id === messageId);
    
    setChatMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          approvalStatus: status,
          clientFeedback: feedback
        };
      }
      return msg;
    }));

    if (targetMsg?.fileAttachment?.contentDeliverableId && targetMsg.fileAttachment.projectId) {
      submitClientDecision(
        targetMsg.fileAttachment.projectId,
        targetMsg.fileAttachment.contentDeliverableId,
        status,
        feedback
      );
    }
  };

  const changeUserPassword = (newPassword: string): { success: boolean; message?: string } => {
    if (!currentUser) return { success: false, message: 'Nenhum usuário logado.' };
    const cleanPass = newPassword.trim();
    if (!cleanPass) return { success: false, message: 'Senha inválida.' };

    if (currentUser.role === 'sharp_admin') {
      setStaffMembers(prev => prev.map(s => s.id === currentUser.id ? { ...s, password: cleanPass } : s));
      return { success: true, message: 'Sua senha de integrante Sharp foi alterada com sucesso!' };
    } else if (currentUser.role === 'client') {
      setClientAccounts(prev => prev.map(c => c.id === currentUser.id ? { ...c, password: cleanPass } : c));
      return { success: true, message: 'Sua senha de cliente foi alterada com sucesso!' };
    }
    return { success: false, message: 'Operação não permitida.' };
  };


  // Auth Methods
  const login = (usernameInput: string, passwordInput: string): { success: boolean; message?: string } => {
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // 1. Check Staff Members (Raphael, Luan, Lucas, Cristiano, or added staff)
    const staffMatch = staffMembers.find(
      s => (s.username.toLowerCase() === cleanUser || (s.email && s.email.toLowerCase() === cleanUser)) && s.password === cleanPass
    );

    if (staffMatch) {
      const userObj: CurrentUser = {
        id: staffMatch.id,
        name: staffMatch.name,
        username: staffMatch.username,
        role: 'sharp_admin',
        staffRole: staffMatch.role
      };
      setCurrentUser(userObj);
      setUserRole('sharp_admin');
      setIsAuthModalOpen(false);
      return { success: true };
    }

    // 2. Check Client Accounts
    const clientMatch = clientAccounts.find(
      c => (c.username.toLowerCase() === cleanUser || c.email.toLowerCase() === cleanUser) && c.password === cleanPass
    );

    if (clientMatch) {
      const userObj: CurrentUser = {
        id: clientMatch.id,
        name: clientMatch.clientName,
        username: clientMatch.username,
        role: 'client',
        clientEmail: clientMatch.email,
        companyName: clientMatch.companyName
      };

      // Update clientInfo context so Client Portal renders their project
      setClientInfo(prev => ({
        ...prev,
        name: clientMatch.clientName,
        company: clientMatch.companyName,
        email: clientMatch.email
      }));

      setCurrentUser(userObj);
      setUserRole('client');
      setIsAuthModalOpen(false);
      return { success: true };
    }

    return {
      success: false,
      message: 'Usuário ou senha incorretos.'
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole('guest');
  };

  const registerStaffMember = (staffData: Omit<StaffMember, 'id' | 'createdAt'>): { success: boolean; message?: string } => {
    const cleanUsername = staffData.username.trim().toLowerCase();
    
    // Check if username already exists
    if (staffMembers.some(s => s.username.toLowerCase() === cleanUsername)) {
      return { success: false, message: `Já existe um integrante da equipe com o usuário "${cleanUsername}".` };
    }

    const newStaff: StaffMember = {
      ...staffData,
      id: `staff-${Date.now()}`,
      username: cleanUsername,
      createdAt: new Date().toISOString()
    };

    setStaffMembers(prev => [...prev, newStaff]);
    return { success: true };
  };

  const updateStaffMember = (staffId: string, updatedData: Partial<StaffMember>): { success: boolean; message?: string } => {
    if (updatedData.username) {
      const cleanUsername = updatedData.username.trim().toLowerCase();
      if (staffMembers.some(s => s.id !== staffId && s.username.toLowerCase() === cleanUsername)) {
        return { success: false, message: `O nome de usuário "${cleanUsername}" já está em uso por outro integrante.` };
      }
    }

    setStaffMembers(prev => prev.map(s => {
      if (s.id === staffId) {
        const newUsername = updatedData.username ? updatedData.username.trim().toLowerCase() : s.username;
        return { ...s, ...updatedData, username: newUsername };
      }
      return s;
    }));

    if (currentUser && currentUser.id === staffId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        name: updatedData.name || prev.name,
        username: updatedData.username ? updatedData.username.trim().toLowerCase() : prev.username,
        staffRole: updatedData.role || prev.staffRole
      } : null);
    }

    return { success: true };
  };

  const deleteStaffMember = (staffId: string): { success: boolean; message?: string } => {
    if (staffMembers.length <= 1) {
      return { success: false, message: 'Não é possível excluir o único integrante da equipe.' };
    }
    setStaffMembers(prev => prev.filter(s => s.id !== staffId));
    if (currentUser && currentUser.id === staffId) {
      logout();
    }
    return { success: true };
  };

  const registerClientAccount = (clientData: Omit<ClientAccount, 'id' | 'createdAt'>): { success: boolean; message?: string } => {
    let cleanUsername = clientData.username ? clientData.username.trim().toLowerCase() : '';
    if (!cleanUsername) {
      const baseName = (clientData.clientName || clientData.companyName || 'cliente')
        .split(' ')[0]
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
      cleanUsername = baseName || 'cliente';
    }

    // If username already exists, generate a safe unique username
    if (clientAccounts.some(c => c.username.toLowerCase() === cleanUsername)) {
      let counter = 2;
      while (clientAccounts.some(c => c.username.toLowerCase() === `${cleanUsername}${counter}`)) {
        counter++;
      }
      cleanUsername = `${cleanUsername}${counter}`;
    }

    const clientId = `client-${Date.now()}`;
    const newClient: ClientAccount = {
      ...clientData,
      id: clientId,
      username: cleanUsername,
      password: clientData.password || '2026',
      status: clientData.status || 'active',
      createdAt: new Date().toISOString()
    };

    // Atualiza clientAccounts
    setClientAccounts(prev => [...prev, newClient]);

    // Ensure corresponding Single Source Account exists
    let createdAccId = `acc_${Date.now()}`;
    setAccounts(prev => {
      const exists = prev.some(a => a.companyName.toLowerCase() === newClient.companyName.toLowerCase());
      if (!exists) {
        const newAcc: Account = {
          id: createdAccId,
          companyName: newClient.companyName,
          segment: 'Serviços Gerais',
          phone: '(19) 9 9568-2110',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const updated = [newAcc, ...prev];
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(updated));
        }
        return updated;
      } else {
        const found = prev.find(a => a.companyName.toLowerCase() === newClient.companyName.toLowerCase());
        if (found) createdAccId = found.id;
      }
      return prev;
    });

    // Auto-create Project for this client so it appears directly in Operação / Projetos
    setProjects(prev => {
      const projectExists = prev.some(p => 
        p.companyName.toLowerCase() === newClient.companyName.toLowerCase() ||
        (p.clientEmail && newClient.email && p.clientEmail.toLowerCase() === newClient.email.toLowerCase())
      );
      if (!projectExists) {
        const initialSolutions: SolutionId[] = ['sharp_brand', 'sharp_presence'];
        const initialActiveProducts: ProjectActiveProduct[] = [
          {
            id: `prod_brand_${Date.now()}`,
            solutionId: 'sharp_brand',
            name: 'Sharp Brand',
            packageName: 'Identidade & Posicionamento Autoral',
            status: 'active',
            currentStage: 'Criação de Ativos & Brandbook',
            responsibleStaff: 'Luan (Líder de Arte)',
            startDate: new Date().toISOString().split('T')[0],
            deliverablesSummary: 'Logotipo vetorial, manual de marca e brandbook institucional.'
          },
          {
            id: `prod_presence_${Date.now()}`,
            solutionId: 'sharp_presence',
            name: 'Sharp Presence',
            packageName: 'Social Media & Gestão de Conteúdo',
            status: 'active',
            currentStage: 'Produção de Lote & Copys',
            responsibleStaff: 'Luan (Líder de Arte)',
            startDate: new Date().toISOString().split('T')[0],
            deliverablesSummary: 'Artes de feed, carrosséis, stories interativos e roteiros de vídeos.'
          }
        ];

        const initialOnboarding = [
          { id: `ob-1-${Date.now()}`, label: 'Coleta de acessos & Briefing técnico validado', completed: true },
          { id: `ob-2-${Date.now()}`, label: 'Definição de personas, tom de voz e referências', completed: true },
          { id: `ob-3-${Date.now()}`, label: 'Planejamento e distribuição de tarefas de produção', completed: false },
          { id: `ob-4-${Date.now()}`, label: 'Validação interna com Líder de Arte (Luan)', completed: false }
        ];

        const newProj: Project = {
          id: `proj_${Date.now()}`,
          accountId: createdAccId,
          clientId: newClient.id,
          leadId: `lead_${Date.now()}`,
          companyName: newClient.companyName,
          clientName: newClient.clientName,
          clientEmail: newClient.email || `${cleanUsername}@sharp.com.br`,
          clientPhone: '(19) 9 9568-2110',
          segment: 'Serviços & Negócios',
          solutions: initialSolutions,
          activeProducts: initialActiveProducts,
          stage: 'producao',
          onboardingChecklist: initialOnboarding,
          assignedTeam: {
            designer: 'Luan (Líder de Arte)',
            strategist: 'Raphael (Estrategista Chefe)',
            commercial: 'Ingrid (Atendimento & CS)'
          },
          contentItems: [
            {
              id: `c-init-${Date.now()}`,
              projectId: `proj_${Date.now()}`,
              title: `Post Institucional: Apresentação da Marca ${newClient.companyName}`,
              type: 'feed_post',
              mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
              copyText: `Apresentamos o novo posicionamento de ${newClient.companyName}. Sofisticação, autoridade e consistência estratégica.`,
              status: 'ready_for_review',
              uploadedBy: 'Luan (Líder de Arte)',
              createdAt: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedProjects = [newProj, ...prev];
        if (typeof window !== 'undefined') {
          localStorage.setItem('sharp_projects', JSON.stringify(updatedProjects));
        }
        return updatedProjects;
      }
      return prev;
    });

    // Trigger notification for Sharp team
    addNotification({
      type: 'client_registered',
      targetRole: 'sharp',
      title: 'Novo Cliente Cadastrado na Operação',
      message: `A conta de acesso para "${newClient.companyName}" (${newClient.clientName}) subiu para Projetos e Operação com produtos ativos configurados.`,
      clientName: newClient.companyName,
      actionTab: 'projects'
    });

    // Auto-create direct chat with welcome message for the new client
    const welcomeMsg: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      senderId: 'staff-raphael',
      senderName: 'Raphael (Estrategista Chefe - Sharp)',
      senderRole: 'sharp',
      channel: 'client_direct',
      clientAccountId: newClient.id,
      content: `Olá, ${newClient.clientName || 'Cliente'}! Seja muito bem-vindo(a) à Sharp Intelligence. Este é o seu canal oficial direto com nossa equipe para alinhamento estratégico, acompanhamento dos produtos contratados e envio de materiais para sua aprovação. Estamos à disposição para potencializar o posicionamento e os resultados da ${newClient.companyName}!`,
      createdAt: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, welcomeMsg]);

    return { success: true };
  };

  const updateClientAccount = (accountId: string, updatedData: Partial<ClientAccount>): { success: boolean; message?: string } => {
    if (updatedData.username) {
      const cleanUsername = updatedData.username.trim().toLowerCase();
      if (clientAccounts.some(c => c.id !== accountId && c.username.toLowerCase() === cleanUsername)) {
        return { success: false, message: `O nome de usuário "${cleanUsername}" já está em uso por outro cliente.` };
      }
    }

    setClientAccounts(prev => prev.map(c => {
      if (c.id === accountId) {
        const newUsername = updatedData.username ? updatedData.username.trim().toLowerCase() : c.username;
        return { ...c, ...updatedData, username: newUsername };
      }
      return c;
    }));

    if (currentUser && currentUser.id === accountId) {
      setCurrentUser(prev => prev ? {
        ...prev,
        name: updatedData.clientName || prev.name,
        username: updatedData.username ? updatedData.username.trim().toLowerCase() : prev.username,
        companyName: updatedData.companyName || prev.companyName,
        clientEmail: updatedData.email || prev.clientEmail
      } : null);
    }

    return { success: true };
  };

  const deleteClientAccount = (accountId: string): { success: boolean; message?: string } => {
    setClientAccounts(prev => prev.filter(c => c.id !== accountId));
    if (currentUser && currentUser.id === accountId) {
      logout();
    }
    return { success: true };
  };

  const toggleClientStatus = (accountId: string, status: 'active' | 'inactive') => {
    setClientAccounts(prev => prev.map(c => c.id === accountId ? { ...c, status } : c));
  };

  const isClientInactive = (identifier?: string): boolean => {
    if (!identifier) return false;
    const q = identifier.toLowerCase().trim();
    // Check clientAccounts
    const matchAccount = clientAccounts.find(
      c => c.id === identifier ||
           c.companyName.toLowerCase() === q ||
           c.email.toLowerCase() === q ||
           c.clientName.toLowerCase() === q ||
           c.username.toLowerCase() === q
    );
    if (matchAccount) {
      return matchAccount.status === 'inactive';
    }
    // Also check sharp_clients_directory in localStorage
    try {
      const savedDir = localStorage.getItem('sharp_clients_directory');
      if (savedDir) {
        const parsed = JSON.parse(savedDir);
        if (Array.isArray(parsed)) {
          const matchDir = parsed.find((p: any) => 
            p.id === identifier || 
            (p.companyName && p.companyName.toLowerCase() === q) || 
            (p.email && p.email.toLowerCase() === q) || 
            (p.name && p.name.toLowerCase() === q)
          );
          if (matchDir && (matchDir.status === 'Inativo' || matchDir.status === 'Inativo (Arquivado)')) {
            return true;
          }
        }
      }
    } catch (e) {
      // ignore JSON parse error
    }
    return false;
  };

  const deleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => {
      const nextProjects = prev.filter(p => p.id !== projectId);
      localStorage.setItem('sharp_projects', JSON.stringify(nextProjects));
      return nextProjects;
    });
  };

  const deleteDeliverable = (projectId: string, contentId: string) => {
    setProjects(prev => {
      const nextProjects = prev.map(proj => {
        if (proj.id === projectId) {
          return {
            ...proj,
            contentItems: proj.contentItems.filter(item => item.id !== contentId)
          };
        }
        return proj;
      });
      localStorage.setItem('sharp_projects', JSON.stringify(nextProjects));
      return nextProjects;
    });
  };

  const deleteVisualInspiration = (inspirationId: string) => {
    setVisualInspirations(prev => {
      const nextInspirations = prev.filter(item => item.id !== inspirationId);
      localStorage.setItem('sharp_visual_inspirations', JSON.stringify(nextInspirations));
      return nextInspirations;
    });
  };

  const clearAllClientTestData = () => {
    setLeads([]);
    setProjects([]);
    setVisualInspirations([]);
    setScheduledMeetings([]);
    setClientAccounts([]);
    setChatMessages([]);
    setCurrentBriefing(null);
    setCurrentPainAnalysis(null);
    setClientInfo({ name: '', company: '', email: '', phone: '', segment: '' });

    localStorage.setItem('sharp_leads', JSON.stringify([]));
    localStorage.setItem('sharp_projects', JSON.stringify([]));
    localStorage.setItem('sharp_visual_inspirations', JSON.stringify([]));
    localStorage.setItem('sharp_meetings', JSON.stringify([]));
    localStorage.setItem('sharp_client_accounts', JSON.stringify([]));
    localStorage.setItem('sharp_chat_messages', JSON.stringify([]));
    localStorage.setItem('sharp_client_info', JSON.stringify({ name: '', company: '', email: '', phone: '', segment: '' }));
    localStorage.setItem('sharp_clients_directory', JSON.stringify([]));
    localStorage.setItem('sharp_cleared_test_data', 'true');
  };

  const toggleSolution = (id: SolutionId) => {
    setSelectedSolutionsState(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const setSelectedSolutions = (ids: SolutionId[]) => {
    setSelectedSolutionsState(ids);
  };

  // Submit Briefing Form to Server & Register Lead
  const submitBriefing = async (formData: BriefingFormData): Promise<boolean> => {
    setIsSubmittingBriefing(true);
    try {
      setCurrentBriefing(formData);
      
      // Call server endpoint
      await fetch('/api/send-briefing-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadInfo: {
            name: formData.contactName,
            company: formData.companyName,
            email: formData.email,
            phone: formData.phone
          },
          solutions: selectedSolutions,
          formData,
          painAnalysis: currentPainAnalysis
        })
      });

      // Update local clientInfo
      setClientInfo({
        name: formData.contactName || clientInfo.name,
        company: formData.companyName || clientInfo.company,
        email: formData.email || clientInfo.email,
        phone: formData.phone || clientInfo.phone,
        segment: formData.segment || clientInfo.segment
      });

      // Check if lead exists or create new
      const existingIdx = leads.findIndex(l => l.email.toLowerCase() === formData.email.toLowerCase());
      
      const newLead: Lead = {
        id: existingIdx >= 0 ? leads[existingIdx].id : `lead-${Date.now()}`,
        name: formData.contactName || clientInfo.name,
        company: formData.companyName || clientInfo.company,
        email: formData.email || clientInfo.email,
        phone: formData.phone || clientInfo.phone,
        segment: formData.segment || clientInfo.segment,
        selectedSolutions,
        briefingData: formData,
        painAnalysis: currentPainAnalysis || undefined,
        stage: existingIdx >= 0 ? leads[existingIdx].stage : 'novo_lead',
        createdAt: existingIdx >= 0 ? leads[existingIdx].createdAt : new Date().toISOString()
      };

      if (existingIdx >= 0) {
        const updated = [...leads];
        updated[existingIdx] = newLead;
        setLeads(updated);
      } else {
        setLeads(prev => [newLead, ...prev]);
      }

      // Trigger notification for new lead in pipeline
      addNotification({
        type: 'new_lead',
        targetRole: 'sharp',
        title: 'Novo Lead na Fila',
        message: `Novo lead "${formData.contactName}" da empresa "${formData.companyName}" enviou o formulário de briefing.`,
        clientName: formData.companyName,
        actionTab: 'crm'
      });

      setIsSubmittingBriefing(false);
      return true;
    } catch (err) {
      console.error('Erro ao enviar briefing:', err);
      setIsSubmittingBriefing(false);
      return false;
    }
  };

  // Submit Lead from Gemini Diagnostic or Chat Interaction directly to Sharp Lead Channel
  const submitDiagnosticLead = async (data: {
    contactName: string;
    companyName: string;
    email: string;
    phone: string;
    segment?: string;
    painAnalysis?: PainAnalysisResult;
    chatSummary?: string;
    diagnosticData?: DiagnosticData;
    notes?: string;
  }): Promise<boolean> => {
    try {
      // 1. Update clientInfo state
      const newSegment = data.segment || clientInfo.segment || 'PME / Geral';
      setClientInfo({
        name: data.contactName,
        company: data.companyName,
        email: data.email,
        phone: data.phone,
        segment: newSegment
      });

      const existingIdx = leads.findIndex(l => 
        l.email.toLowerCase() === data.email.toLowerCase() || 
        l.company.toLowerCase() === data.companyName.toLowerCase()
      );

      const targetPainAnalysis = data.painAnalysis || currentPainAnalysis || undefined;
      
      const diagSummaryText = data.diagnosticData ? [
        '📋 [Diagnóstico Estruturado IA Sharp]:',
        `• Porte / Equipe: ${data.diagnosticData.employeeCount || 'Não informado'}`,
        `• Faturamento Mensal: ${data.diagnosticData.revenueStage || 'Não informado'}`,
        `• Produto/Serviço: ${data.diagnosticData.mainProduct || 'Não informado'}`,
        `• Diferencial: ${data.diagnosticData.mainDifferential || 'Não informado'}`,
        `• Canal de Vendas: ${data.diagnosticData.salesChannel || 'Não informado'}`,
        `• Presença de Marca: ${data.diagnosticData.brandPresence || 'Não informado'}`,
        `• Maior Gargalo: ${data.diagnosticData.mainBottleneck || 'Não informado'}`,
        `• Objetivo 12 Meses: ${data.diagnosticData.growthObjective || 'Não informado'}`,
        data.diagnosticData.overallScore ? `• Score de Posicionamento: ${data.diagnosticData.overallScore}/100` : ''
      ].filter(Boolean).join('\n') : '';

      const historyNoteText = data.notes 
        ? `${data.notes}${diagSummaryText ? '\n\n' + diagSummaryText : ''}`
        : data.chatSummary 
          ? `[Lead via Chat Gemini]: ${data.chatSummary}${diagSummaryText ? '\n\n' + diagSummaryText : ''}`
          : targetPainAnalysis 
            ? `[Lead via Diagnóstico Gemini]: Solução Recomendada: ${targetPainAnalysis.oportunidade_sugerida} | Problema: ${targetPainAnalysis.problema_central}${diagSummaryText ? '\n\n' + diagSummaryText : ''}`
            : diagSummaryText || 'Lead registrado via canal Sharp';

      const newHistoryNote = {
        id: `note-${Date.now()}`,
        author: 'IA Sharp / Solicitar Diagnóstico',
        text: historyNoteText,
        createdAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        const existing = leads[existingIdx];
        const updatedLead: Lead = {
          ...existing,
          name: data.contactName || existing.name,
          company: data.companyName || existing.company,
          email: data.email || existing.email,
          phone: data.phone || existing.phone,
          segment: newSegment || existing.segment,
          painAnalysis: targetPainAnalysis || existing.painAnalysis,
          diagnosticData: data.diagnosticData || existing.diagnosticData,
          notes: existing.notes ? `${existing.notes}\n\n${historyNoteText}` : historyNoteText,
          historyNotes: [newHistoryNote, ...(existing.historyNotes || [])]
        };
        setLeads(prev => {
          const arr = [...prev];
          arr[existingIdx] = updatedLead;
          return arr;
        });
      } else {
        const newLead: Lead = {
          id: `lead-${Date.now()}`,
          name: data.contactName,
          company: data.companyName,
          email: data.email,
          phone: data.phone,
          segment: newSegment,
          selectedSolutions,
          painAnalysis: targetPainAnalysis,
          diagnosticData: data.diagnosticData,
          stage: 'novo_lead',
          notes: historyNoteText,
          historyNotes: [newHistoryNote],
          createdAt: new Date().toISOString()
        };
        setLeads(prev => [newLead, ...prev]);
      }

      // Notification for new lead via diagnostic / AI
      addNotification({
        type: 'new_lead',
        targetRole: 'sharp',
        title: 'Novo Lead no Diagnóstico',
        message: `Novo lead "${data.contactName}" da empresa "${data.companyName}" entrou via Diagnóstico IA Sharp.`,
        clientName: data.companyName,
        actionTab: 'crm'
      });

      return true;
    } catch (err) {
      console.error('Erro ao registrar lead no canal Sharp:', err);
      return false;
    }
  };

  // Run AI Pain Analysis via Gemini API
  const analyzePain = async (challenge: string): Promise<PainAnalysisResult | null> => {
    setIsAnalyzingPain(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      let data: PainAnalysisResult;
      try {
        const res = await fetch('/api/gemini/analyze-pain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challenge,
            companyName: clientInfo.company || 'Empresa Cliente',
            segment: clientInfo.segment || 'Geral'
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Falha na resposta da API');
        data = await res.json();
      } catch (fetchErr) {
        clearTimeout(timeoutId);
        console.warn('Fallback ativado para análise de dor:', fetchErr);
        data = {
          problema_central: `Posicionamento e Conversão Comercial em ${clientInfo.segment || 'Serviços'}`,
          diagnostico_preliminar: `Com base no relato "${challenge}", nota-se uma oportunidade evidente de reposicionar os diferenciais do negócio para atrair clientes de maior ticket e estruturar a autoridade visual da marca nas redes sociais.`,
          oportunidade_sugerida: "Sharp Brand + Sharp Presence",
          grau_urgencia: "Alto",
          plano_preliminar: [
            "1. Alinhamento de Posicionamento e Proposta de Valor Única (UVP) no pilar Sharp Brand.",
            "2. Estruturação do Calendário Editorial Diário e Identidade Visual no pilar Sharp Presence.",
            "3. Análise de Concorrentes e Benchmark de Mercado no pilar Sharp Insights."
          ]
        };
      }

      data.createdAt = new Date().toISOString();
      setCurrentPainAnalysis(data);

      // Attach to lead in state
      setLeads(prev => prev.map(lead => {
        if (lead.email.toLowerCase() === clientInfo.email.toLowerCase()) {
          return { ...lead, painAnalysis: data };
        }
        return lead;
      }));

      setIsAnalyzingPain(false);
      return data;
    } catch (err) {
      console.error('Erro no analisador de dor:', err);
      setIsAnalyzingPain(false);
      return null;
    }
  };

  // Generate Visual Inspiration via Gemini
  const generateVisual = async (prompt: string, style: string): Promise<VisualInspiration | null> => {
    setIsGeneratingVisual(true);
    try {
      const res = await fetch('/api/gemini/generate-visual-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          style,
          brandName: clientInfo.company
        })
      });

      if (!res.ok) throw new Error('Falha na geração de imagem');

      const data = await res.json();

      const newInspiration: VisualInspiration = {
        id: `vis-${Date.now()}`,
        clientId: clientInfo.email,
        clientEmail: clientInfo.email,
        clientName: clientInfo.name,
        companyName: clientInfo.company,
        prompt,
        style,
        imageUrl: data.imageUrl,
        status: 'pending_art_leader',
        createdAt: new Date().toISOString()
      };

      setVisualInspirations(prev => [newInspiration, ...prev]);

      // Attach to lead
      setLeads(prev => prev.map(lead => {
        if (lead.email.toLowerCase() === clientInfo.email.toLowerCase()) {
          const list = lead.visualInspirations || [];
          return { ...lead, visualInspirations: [newInspiration, ...list] };
        }
        return lead;
      }));

      setIsGeneratingVisual(false);
      return newInspiration;
    } catch (err) {
      console.error('Erro ao gerar inspiração visual:', err);
      setIsGeneratingVisual(false);
      return null;
    }
  };

  // Book Meeting
  const bookMeeting = async (
    date: string,
    timeSlot: string,
    specialist: string,
    type: 'diagnostico_gratuito' | 'semanal_feedback' = 'diagnostico_gratuito',
    customInfo?: { name: string; company: string; email: string; companySocial?: string; phone?: string; reason?: string }
  ): Promise<ScheduledMeeting> => {
    const name = customInfo?.name || clientInfo.name;
    const company = customInfo?.company || clientInfo.company;
    const email = customInfo?.email || clientInfo.email;
    const companySocial = customInfo?.companySocial || '';
    const phone = customInfo?.phone || clientInfo.phone || '';
    const reason = customInfo?.reason || '1ª Reunião de Diagnóstico Gratuito Sharp';

    const meeting: ScheduledMeeting = {
      id: `meet-${Date.now()}`,
      clientName: name,
      clientEmail: email,
      companyName: company,
      companySocial,
      phone,
      reason,
      date,
      timeSlot,
      specialist,
      type,
      status: 'scheduled',
      notes: customInfo?.reason 
        ? `[Motivo: ${customInfo.reason}] - Instagram: ${companySocial || 'Não informado'} | Tel: ${phone || 'Não informado'}`
        : type === 'diagnostico_gratuito' 
        ? '1ª Reunião de Diagnóstico Gratuito Sharp (30 min)' 
        : 'Reunião Semanal de Feedback & Planejamento'
    };

    setScheduledMeetings(prev => [meeting, ...prev]);

    // Advance lead pipeline stage or create/update lead if booking first meeting
    setLeads(prev => {
      const existingLead = prev.find(lead => lead.email.toLowerCase() === email.toLowerCase());
      if (existingLead) {
        return prev.map(lead => {
          if (lead.email.toLowerCase() === email.toLowerCase()) {
            return {
              ...lead,
              phone: phone || lead.phone,
              scheduledMeeting: meeting,
              stage: lead.stage === 'novo_lead' ? 'diagnostico_agendado' : lead.stage
            };
          }
          return lead;
        });
      } else {
        // Create new Lead record
        const newLeadRecord: Lead = {
          id: `lead-${Date.now()}`,
          name,
          company,
          email,
          phone: phone || '(19) 9 9568-2110',
          segment: 'Serviços / PME',
          selectedSolutions: ['sharp_brand', 'sharp_presence'],
          briefingData: {
            companyName: company,
            segment: 'Serviços / PME',
            contactName: name,
            email,
            phone: phone || '(19) 9 9568-2110',
            websiteOrSocial: companySocial || '@empresa',
            brandPersonality: 'Profissional, inovadora e de alta autoridade',
            idealCustomer: 'Clientes B2B / Consumidores de alto padrão',
            topCompetitors: 'Principais concorrentes do setor',
            socialPlatforms: 'Instagram, LinkedIn e Site Oficial',
            postingFrequency: 'Diária / Estratégica',
            contentGoals: 'Aumentar autoridade, ser percebido como referência e vender mais'
          },
          stage: 'diagnostico_agendado',
          scheduledMeeting: meeting,
          createdAt: new Date().toISOString().split('T')[0]
        };
        return [newLeadRecord, ...prev];
      }
    });

    // Trigger notification for new lead meeting
    addNotification({
      type: 'new_lead',
      targetRole: 'sharp',
      title: 'Reunião Agendada / Novo Lead',
      message: `Reunião agendada com "${name}" (${company}) para ${date} às ${timeSlot}.`,
      clientName: company,
      actionTab: 'crm'
    });

    return meeting;
  };

  // Admin: Convert Lead to Official Unified Client & Open Project
  const convertLeadToClientAndProject = (leadId: string): { success: boolean; projectId?: string; clientId?: string } => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return { success: false };

    // 1. Update lead stage to cliente_fechado
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: 'cliente_fechado' } : l));

    // 2. Ensure Unified Client exists in sharp_clients_directory_unified
    const currentUnified = getUnifiedClients();
    let existingUnified = currentUnified.find(
      c => (lead.email && c.email.toLowerCase() === lead.email.toLowerCase()) ||
           (lead.company && c.companyName.toLowerCase() === lead.company.toLowerCase())
    );

    let targetClientId = existingUnified?.id;
    if (!existingUnified) {
      targetClientId = `cli-${Date.now()}`;
      const defaultEnrollments = (lead.selectedSolutions && lead.selectedSolutions.length > 0 ? lead.selectedSolutions : (['sharp_brand', 'sharp_presence'] as SolutionId[])).map(sId => {
        const packageId = sId === 'sharp_brand' ? 'brand_strategy' :
                          sId === 'sharp_presence' ? 'presence_management' :
                          sId === 'sharp_insights' ? 'insights_essential' : 'growth_advisory';
        return createUnifiedEnrollment(sId, packageId, 'Time Sharp');
      });

      const newUnified: UnifiedClient = {
        id: targetClientId,
        name: lead.name,
        clientName: lead.name,
        companyName: lead.company,
        segment: lead.segment || 'Geral',
        phone: lead.phone || '(19) 9 9568-2110',
        email: lead.email || `contato@${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
        contractedProducts: defaultEnrollments.map(e => e.packageName),
        nextMeetingDate: 'A definir (Kickoff)',
        meetingTopic: 'Alinhamento Estratégico & Kickoff',
        approvedMaterials: 0,
        rejectedMaterials: 0,
        pendingMaterials: 0,
        status: 'Ativo',
        createdAt: new Date().toISOString().split('T')[0],
        enrolledProducts: defaultEnrollments,
        sharpNotes: lead.painAnalysis?.problema_central
          ? `Origem: Diagnóstico IA Sharp. Problema Central: ${lead.painAnalysis.problema_central}`
          : (lead.notes || 'Convertido a partir do Pipeline CRM Sharp.')
      };

      currentUnified.push(newUnified);
      saveUnifiedClients(currentUnified);
    }

    // 3. Ensure ClientAccount exists for login
    const cleanUsername = (lead.name || lead.company || 'cliente')
      .split(' ')[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "") || 'cliente';

    let safeUser = cleanUsername;
    let count = 2;
    while (clientAccounts.some(c => c.username.toLowerCase() === safeUser)) {
      safeUser = `${cleanUsername}${count}`;
      count++;
    }

    if (!clientAccounts.some(c => (lead.email && c.email.toLowerCase() === lead.email.toLowerCase()) || (lead.company && c.companyName.toLowerCase() === lead.company.toLowerCase()))) {
      const newAcc: ClientAccount = {
        id: `acc-${Date.now()}`,
        clientName: lead.name,
        companyName: lead.company,
        email: lead.email,
        username: safeUser,
        password: '2026',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      setClientAccounts(prev => [...prev, newAcc]);
    }

    // 4. Create or fetch Project
    let targetProj = projects.find(
      p => p.leadId === leadId || 
           (lead.email && p.clientEmail.toLowerCase() === lead.email.toLowerCase()) ||
           (lead.company && p.companyName.toLowerCase() === lead.company.toLowerCase())
    );

    let projId = targetProj?.id;
    if (!targetProj) {
      projId = `proj-${Date.now()}`;
      const defaultChecklist = getInitialChecklistForStage('onboarding');
      const newProj: Project = {
        id: projId,
        leadId: lead.id,
        clientId: targetClientId,
        companyName: lead.company,
        clientName: lead.name,
        clientEmail: lead.email,
        clientPhone: lead.phone,
        segment: lead.segment,
        solutions: lead.selectedSolutions && lead.selectedSolutions.length > 0 ? lead.selectedSolutions : ['sharp_brand', 'sharp_presence'],
        stage: 'onboarding',
        assignedTeam: {
          designer: 'Luan (Líder de Arte)',
          strategist: 'Raphael (Estrategista Chefe)',
          commercial: 'Ingrid (Atendimento & CS)'
        },
        onboardingChecklist: defaultChecklist,
        stageChecklists: {
          onboarding: defaultChecklist
        },
        contentItems: [],
        createdAt: new Date().toISOString()
      };
      setProjects(prev => [newProj, ...prev]);
    } else if (targetClientId && !targetProj.clientId) {
      setProjects(prev => prev.map(p => p.id === targetProj!.id ? { ...p, clientId: targetClientId } : p));
    }

    // 5. Notify Team
    addNotification({
      type: 'client_registered',
      targetRole: 'sharp',
      title: 'Lead Convertido em Cliente & Projeto Aberto',
      message: `O lead "${lead.company}" (${lead.name}) foi convertido com sucesso em cliente oficial no Diretório Sharp e o projeto está ativo em Onboarding.`,
      clientName: lead.company,
      projectId: projId,
      actionTab: 'projects'
    });

    return { success: true, projectId: projId, clientId: targetClientId };
  };

  // Admin: Update Lead Pipeline stage
  const updateLeadStage = (leadId: string, stage: PipelineStage) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return { ...l, stage };
      }
      return l;
    }));

    if (stage === 'cliente_fechado' || stage === 'fechado_ganho') {
      convertLeadToClientAndProject(leadId);
    }
  };

  // Admin: Art Leader Notes for Visual Inspiration
  const sendArtLeaderNotes = (inspirationId: string, notes: string) => {
    setVisualInspirations(prev => prev.map(vis => {
      if (vis.id === inspirationId) {
        return {
          ...vis,
          status: 'analyzed',
          artLeaderNotes: notes
        };
      }
      return vis;
    }));
  };

  // Admin: Upload new post / story / copy / file deliverable
  const uploadContentDeliverable = (
    projectId: string, 
    content: Omit<ContentDeliverable, 'id' | 'createdAt'>,
    options?: { sendDirectToClient?: boolean; sendToInternal?: boolean }
  ) => {
    const newItemId = `c-${Date.now()}`;
    const targetProj = projects.find(p => p.id === projectId);
    const willSendToClient = Boolean(options?.sendDirectToClient || content.sentToClient);
    const willSendToInternal = Boolean(options?.sendToInternal || content.sentToInternal);

    const newItem: ContentDeliverable = {
      ...content,
      id: newItemId,
      createdAt: new Date().toISOString(),
      sentToClient: willSendToClient,
      sentToInternal: willSendToInternal,
      status: willSendToClient ? 'ready_for_review' : willSendToInternal ? 'internal_review' : (content.status || 'ready_for_review'),
      clientApproval: willSendToClient ? { status: 'pending', clientName: targetProj?.clientName } : content.clientApproval,
      comments: content.comments || [],
      internalReviews: content.internalReviews || []
    };

    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          stage: proj.stage === 'onboarding' || proj.stage === 'kickoff' ? 'producao' : proj.stage,
          contentItems: [newItem, ...proj.contentItems]
        };
      }
      return proj;
    }));

    if (willSendToClient) {
      // Find client account ID matching the project client
      const targetClient = clientAccounts.find(
        c => (p => p.clientEmail?.toLowerCase() === c.email?.toLowerCase() || p.companyName?.toLowerCase() === c.companyName?.toLowerCase() || p.id === c.projectId)(targetProj || { clientEmail: '', companyName: '', id: projectId } as any)
      );

      const msgContent = newItem.copyText 
        ? `🎨 Nova arte para aprovação: "${newItem.title}"\n\n📝 Copy / Informações:\n${newItem.copyText}`
        : `🎨 Nova arte para aprovação: "${newItem.title}"`;

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: currentUser?.id || 'staff-raphael',
        senderName: currentUser?.name || 'Equipe Sharp Intelligence',
        senderRole: 'sharp',
        channel: 'client_direct',
        clientAccountId: targetClient?.id || targetProj?.clientId || targetProj?.id || 'client-camila',
        content: msgContent,
        fileAttachment: {
          name: newItem.title,
          url: newItem.mediaUrl,
          type: 'art_approval',
          contentDeliverableId: newItem.id,
          projectId
        },
        approvalStatus: 'pending',
        createdAt: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, newMsg]);

      // Notification for client
      addNotification({
        type: 'general',
        targetRole: 'client',
        title: 'Arte Enviada para sua Aprovação',
        message: `A equipe Sharp enviou a peça "${newItem.title}" para você aprovar no chat.`,
        clientName: targetProj?.companyName,
        projectId,
        deliverableId: newItem.id,
        actionTab: 'chat'
      });
    } else if (willSendToInternal) {
      addNotification({
        type: 'internal_art_review',
        targetRole: 'sharp',
        title: 'Solicitação de Avaliação Interna de Arte',
        message: `A peça "${newItem.title}" (${targetProj?.companyName}) foi enviada para revisão interna da equipe Sharp.`,
        clientName: targetProj?.companyName,
        projectId,
        deliverableId: newItem.id,
        actionTab: 'projects'
      });
    } else {
      addNotification({
        type: 'art_status',
        targetRole: 'sharp',
        title: 'Nova Arte Adicionada',
        message: `A peça "${newItem.title}" foi salva no projeto ${targetProj?.companyName || 'Cliente'}.`,
        clientName: targetProj?.companyName,
        projectId,
        deliverableId: newItem.id,
        actionTab: 'projects'
      });
    }

    return newItem;
  };

  // Workflow Action 1: Send Deliverable to Client Approval
  const sendDeliverableToClientApproval = (projectId: string, contentId: string) => {
    const proj = projects.find(p => p.id === projectId);
    const item = proj?.contentItems.find(i => i.id === contentId);
    if (!proj || !item) return;

    // Update deliverable status in project
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          contentItems: p.contentItems.map(it => {
            if (it.id === contentId) {
              return {
                ...it,
                sentToClient: true,
                status: 'ready_for_review',
                clientApproval: it.clientApproval || { status: 'pending', clientName: p.clientName }
              };
            }
            return it;
          })
        };
      }
      return p;
    }));

    // Find client account ID matching the project client
    const targetClient = clientAccounts.find(
      c => (p => p.clientEmail?.toLowerCase() === c.email?.toLowerCase() || p.companyName?.toLowerCase() === c.companyName?.toLowerCase() || p.id === c.projectId)(proj)
    );

    const msgContent = item.copyText
      ? `🎨 Arte para aprovação: "${item.title}"\n\n📝 Copy / Informações:\n${item.copyText}`
      : `🎨 Arte para aprovação: "${item.title}"`;

    // Post to client direct chat
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || 'staff-raphael',
      senderName: currentUser?.name || 'Equipe Sharp Intelligence',
      senderRole: 'sharp',
      channel: 'client_direct',
      clientAccountId: targetClient?.id || proj.clientId || proj.id || 'client-camila',
      content: msgContent,
      fileAttachment: {
        name: item.title,
        url: item.mediaUrl,
        type: 'art_approval',
        contentDeliverableId: item.id,
        projectId: proj.id
      },
      approvalStatus: 'pending',
      createdAt: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Send notification for client
    addNotification({
      type: 'general',
      targetRole: 'client',
      title: 'Arte para aprovação',
      message: `A equipe Sharp enviou a arte "${item.title}" para sua aprovação no chat.`,
      clientName: proj.companyName,
      projectId: proj.id,
      deliverableId: item.id,
      actionTab: 'chat'
    });
  };

  // Workflow Action 2: Send Deliverable to Internal Team Review
  const sendDeliverableToInternalReview = (projectId: string, contentId: string) => {
    const proj = projects.find(p => p.id === projectId);
    const item = proj?.contentItems.find(i => i.id === contentId);
    if (!proj || !item) return;

    // Mark deliverable as sent to internal
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          contentItems: p.contentItems.map(it => {
            if (it.id === contentId) {
              return { ...it, sentToInternal: true };
            }
            return it;
          })
        };
      }
      return p;
    }));

    // Generate high-priority notification for sharp internal team
    addNotification({
      type: 'internal_art_review',
      targetRole: 'sharp',
      title: 'Solicitação de Avaliação de Arte',
      message: `Solicitação para olhar a arte "${item.title}" vinculada ao cliente ${proj.companyName} (${proj.clientName}).`,
      clientName: proj.companyName,
      projectId: proj.id,
      deliverableId: item.id,
      actionTab: 'projects'
    });
  };

  // Workflow Action 3: Client Decision (Approved, Rejected, Revision)
  const submitClientDecision = (
    projectId: string,
    contentId: string,
    decision: 'approved' | 'rejected' | 'revision',
    feedback?: string
  ) => {
    const decidedAt = new Date().toISOString();
    const clientName = currentUser?.name || 'Cliente';
    const proj = projects.find(p => p.id === projectId);
    const item = proj?.contentItems.find(i => i.id === contentId);
    const title = item?.title || 'Arte';

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const nextReworkTasks: ProjectReworkTask[] = [...(p.reworkTasks || [])];

        // ETAPA 7: Gerar tarefa de retrabalho automática se for reprovação ou revisão
        if (decision === 'rejected' || decision === 'revision') {
          nextReworkTasks.unshift({
            id: `rework_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            projectId: p.id,
            deliverableId: contentId,
            title: `Ajuste: ${title} (${decision === 'rejected' ? 'Reprovado' : 'Revisão'})`,
            description: feedback || (decision === 'rejected' ? 'Peça reprovada pelo cliente.' : 'Revisão solicitada pelo cliente.'),
            assignedTo: p.assignedTeam?.designer || 'Luan (Líder de Arte)',
            status: 'pending',
            createdFrom: decision === 'rejected' ? 'client_rejection' : 'client_revision',
            createdAt: decidedAt
          });
        }

        return {
          ...p,
          reworkTasks: nextReworkTasks,
          contentItems: p.contentItems.map(it => {
            if (it.id === contentId) {
              const newStatus: ContentDeliverable['status'] =
                decision === 'approved' ? 'approved' : decision === 'rejected' ? 'rejected' : 'revision_requested';
              
              const defaultText = decision === 'approved' ? 'Aprovado pelo cliente' : (feedback || '');

              return {
                ...it,
                status: newStatus,
                clientFeedback: defaultText,
                clientApproval: {
                  status: decision,
                  feedback: feedback || '',
                  decidedAt,
                  clientName
                }
              };
            }
            return it;
          })
        };
      }
      return p;
    }));

    // Sync chat approval statuses
    setChatMessages(prev => prev.map(msg => {
      if (msg.fileAttachment?.contentDeliverableId === contentId) {
        return {
          ...msg,
          approvalStatus: decision,
          clientFeedback: feedback
        };
      }
      return msg;
    }));

    // Post explanatory message in client chat
    let messageText = '';
    if (decision === 'approved') {
      messageText = `✅ Aprovado pelo cliente (${clientName})! A arte está liberada para publicação.`;
    } else if (decision === 'rejected') {
      messageText = `❌ Reprovado pelo cliente. Motivo: "${feedback || 'Sem observações adicionais.'}"`;
    } else {
      messageText = `⚠️ Revisar os pontos: "${feedback || 'Pequenos ajustes solicitados.'}"`;
    }

    sendChatMessage({
      senderId: currentUser?.id || 'client',
      senderName: currentUser?.name || clientName,
      senderRole: 'client',
      channel: 'client_direct',
      clientAccountId: currentUser?.id || proj?.clientId || proj?.id,
      content: messageText
    });

    // Notify Sharp internal team
    addNotification({
      type: 'client_feedback',
      targetRole: 'sharp',
      title: decision === 'approved' ? 'Arte Aprovada pelo Cliente' : decision === 'rejected' ? 'Arte Reprovada pelo Cliente' : 'Revisão Solicitada pelo Cliente',
      message: `${proj?.companyName || 'Cliente'} respondeu sobre a arte "${title}": ${decision === 'approved' ? 'Aprovado pelo cliente' : (decision === 'rejected' ? 'Reprovado: ' : 'Revisar os pontos: ') + (feedback || '')}`,
      clientName: proj?.companyName,
      projectId,
      deliverableId: contentId,
      actionTab: 'projects'
    });

    // Notify any active operational views or modals
    try {
      window.dispatchEvent(new CustomEvent('sharp_art_decision', { 
        detail: { projectId, contentId, decision, title, feedback, decidedAt, clientName } 
      }));
    } catch (e) {
      // ignore in non-browser context
    }
  };

  // Workflow Action 4: Internal Team Review (Approved, Rejected, Revision by @username)
  const submitInternalReview = (
    projectId: string,
    contentId: string,
    decision: 'approved' | 'rejected' | 'revision',
    notes?: string
  ) => {
    const reviewedAt = new Date().toISOString();
    const reviewedBy = currentUser?.name || 'Membro Sharp';
    const reviewerUsername = currentUser?.username || 'sharp_staff';

    const newReview: InternalReview = {
      id: `rev-${Date.now()}`,
      reviewedBy,
      reviewerUsername,
      decision,
      notes: notes || '',
      reviewedAt
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const item = p.contentItems.find(it => it.id === contentId);
        const title = item?.title || 'Arte';
        const nextReworkTasks: ProjectReworkTask[] = [...(p.reworkTasks || [])];

        // ETAPA 7: Gerar tarefa de retrabalho se reprovado ou em revisão interna
        if (decision === 'rejected' || decision === 'revision') {
          nextReworkTasks.unshift({
            id: `rework_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            projectId: p.id,
            deliverableId: contentId,
            title: `Retrabalho Interno: ${title} (${decision === 'rejected' ? 'Reprovado' : 'Revisão'} por @${reviewerUsername})`,
            description: notes || (decision === 'rejected' ? 'Reprovado na revisão interna.' : 'Ajustes solicitados na revisão interna.'),
            assignedTo: p.assignedTeam?.designer || 'Luan (Líder de Arte)',
            status: 'pending',
            createdFrom: 'internal_review',
            createdAt: reviewedAt
          });
        }

        return {
          ...p,
          reworkTasks: nextReworkTasks,
          contentItems: p.contentItems.map(it => {
            if (it.id === contentId) {
              const currentReviews = it.internalReviews || [];
              return {
                ...it,
                internalReviews: [newReview, ...currentReviews]
              };
            }
            return it;
          })
        };
      }
      return p;
    }));
  };

  const toggleReworkTaskStatus = (projectId: string, taskId: string, status?: 'pending' | 'in_progress' | 'completed') => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId && p.reworkTasks) {
        return {
          ...p,
          reworkTasks: p.reworkTasks.map(t => {
            if (t.id === taskId) {
              const nextStatus = status ? status : (t.status === 'completed' ? 'pending' : 'completed');
              return { ...t, status: nextStatus };
            }
            return t;
          })
        };
      }
      return p;
    }));
  };

  // Workflow Action 5: Add Comment to Deliverable
  const addDeliverableComment = (projectId: string, contentId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: ContentComment = {
      id: `comm-${Date.now()}`,
      authorName: currentUser?.name || 'Equipe',
      authorUsername: currentUser?.username,
      authorRole: currentUser?.role === 'sharp_admin' ? 'sharp' : 'client',
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          contentItems: p.contentItems.map(it => {
            if (it.id === contentId) {
              const currentComments = it.comments || [];
              return {
                ...it,
                comments: [...currentComments, newComment]
              };
            }
            return it;
          })
        };
      }
      return p;
    }));
  };

  // Client: Approve content
  const approveContent = (projectId: string, contentId: string) => {
    submitClientDecision(projectId, contentId, 'approved');
  };

  // Client: Request adjustment on content
  const requestContentAdjustment = (projectId: string, contentId: string, feedback: string) => {
    submitClientDecision(projectId, contentId, 'revision', feedback);
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Project => {
    const newProj: Project = {
      ...projectData,
      id: projectData.id || `proj-${Date.now()}`,
      createdAt: projectData.createdAt || new Date().toISOString()
    };
    setProjects(prev => [newProj, ...prev]);
    return newProj;
  };

  const updateProject = (projectId: string, updatedData: Partial<Project>) => {
    setProjects(prev => {
      const updated = prev.map(proj => {
        if (proj.id === projectId) {
          return { ...proj, ...updatedData, updatedAt: new Date().toISOString() };
        }
        return proj;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(updated));
      }
      return updated;
    });

    // Bidirectional sync to Account if financial or profile data is altered in Project
    const targetProj = projects.find(p => p.id === projectId);
    if (targetProj) {
      const compName = targetProj.companyName;
      const accId = targetProj.accountId;
      if (updatedData.monthlyFee !== undefined || updatedData.contractValue !== undefined || updatedData.logoUrl !== undefined || updatedData.notes !== undefined) {
        setAccounts(prev => {
          const updated = prev.map(a => {
            if ((accId && a.id === accId) || a.companyName.toLowerCase() === compName.toLowerCase()) {
              return {
                ...a,
                ...(updatedData.monthlyFee !== undefined ? { monthlyFee: typeof updatedData.monthlyFee === 'number' ? updatedData.monthlyFee : parseFloat(String(updatedData.monthlyFee).replace(/[^0-9.-]+/g, '')) || a.monthlyFee } : {}),
                ...(updatedData.contractValue !== undefined ? { contractValue: typeof updatedData.contractValue === 'number' ? updatedData.contractValue : parseFloat(String(updatedData.contractValue).replace(/[^0-9.-]+/g, '')) || a.contractValue } : {}),
                ...(updatedData.logoUrl !== undefined ? { logoUrl: updatedData.logoUrl } : {}),
                ...(updatedData.notes !== undefined ? { notes: updatedData.notes } : {}),
                updatedAt: new Date().toISOString()
              };
            }
            return a;
          });
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(updated));
          }
          return updated;
        });
      }
    }
  };

  // Client / Admin: Toggle Onboarding item
  const toggleOnboardingItem = (projectId: string, itemId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          onboardingChecklist: proj.onboardingChecklist.map(item =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return proj;
    }));
  };

  const addOnboardingItem = (projectId: string, label: string) => {
    if (!label.trim()) return;
    const newItem = {
      id: `ob-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label: label.trim(),
      completed: false
    };
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          onboardingChecklist: [...proj.onboardingChecklist, newItem]
        };
      }
      return proj;
    }));
  };

  const removeOnboardingItem = (projectId: string, itemId: string) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          onboardingChecklist: proj.onboardingChecklist.filter(item => item.id !== itemId)
        };
      }
      return proj;
    }));
  };

  // Stage Checklists & Pipeline Management
  const setProjectStage = (projectId: string, stage: ProjectStage) => {
    setProjects(prev => {
      const nextProjects = prev.map(proj => {
        if (proj.id === projectId) {
          const currentStageChecklists = proj.stageChecklists || {};
          let targetChecklist = currentStageChecklists[stage];
          if (!targetChecklist || targetChecklist.length === 0) {
            targetChecklist = getInitialChecklistForStage(stage);
          }
          const updatedStageChecklists = {
            ...currentStageChecklists,
            [stage]: targetChecklist
          };
          return {
            ...proj,
            stage,
            stageChecklists: updatedStageChecklists,
            onboardingChecklist: stage === 'onboarding' ? targetChecklist : proj.onboardingChecklist
          };
        }
        return proj;
      });
      localStorage.setItem('sharp_projects', JSON.stringify(nextProjects));
      return nextProjects;
    });
  };

  const toggleStageChecklistItem = (projectId: string, stage: ProjectStage, itemId: string) => {
    setProjects(prev => {
      const nextProjects = prev.map(proj => {
        if (proj.id === projectId) {
          const currentStageChecklists = proj.stageChecklists || {};
          const currentList = currentStageChecklists[stage] || (stage === 'onboarding' ? proj.onboardingChecklist : getInitialChecklistForStage(stage));
          const updatedList = currentList.map(item => item.id === itemId ? { ...item, completed: !item.completed } : item);
          const updatedStageChecklists = {
            ...currentStageChecklists,
            [stage]: updatedList
          };
          return {
            ...proj,
            stageChecklists: updatedStageChecklists,
            onboardingChecklist: stage === 'onboarding' ? updatedList : proj.onboardingChecklist
          };
        }
        return proj;
      });
      localStorage.setItem('sharp_projects', JSON.stringify(nextProjects));
      return nextProjects;
    });
  };

  const addStageChecklistItem = (projectId: string, stage: ProjectStage, label: string) => {
    if (!label.trim()) return;
    const newItem: OnboardingCheckitem = {
      id: `chk-${stage}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      label: label.trim(),
      completed: false
    };
    setProjects(prev => {
      const nextProjects = prev.map(proj => {
        if (proj.id === projectId) {
          const currentStageChecklists = proj.stageChecklists || {};
          const currentList = currentStageChecklists[stage] || (stage === 'onboarding' ? proj.onboardingChecklist : getInitialChecklistForStage(stage));
          const updatedList = [...currentList, newItem];
          const updatedStageChecklists = {
            ...currentStageChecklists,
            [stage]: updatedList
          };
          return {
            ...proj,
            stageChecklists: updatedStageChecklists,
            onboardingChecklist: stage === 'onboarding' ? updatedList : proj.onboardingChecklist
          };
        }
        return proj;
      });
      localStorage.setItem('sharp_projects', JSON.stringify(nextProjects));
      return nextProjects;
    });
  };

  const removeStageChecklistItem = (projectId: string, stage: ProjectStage, itemId: string) => {
    setProjects(prev => {
      const nextProjects = prev.map(proj => {
        if (proj.id === projectId) {
          const currentStageChecklists = proj.stageChecklists || {};
          const currentList = currentStageChecklists[stage] || (stage === 'onboarding' ? proj.onboardingChecklist : getInitialChecklistForStage(stage));
          const updatedList = currentList.filter(item => item.id !== itemId);
          const updatedStageChecklists = {
            ...currentStageChecklists,
            [stage]: updatedList
          };
          return {
            ...proj,
            stageChecklists: updatedStageChecklists,
            onboardingChecklist: stage === 'onboarding' ? updatedList : proj.onboardingChecklist
          };
        }
        return proj;
      });
      localStorage.setItem('sharp_projects', JSON.stringify(nextProjects));
      return nextProjects;
    });
  };

  const toggleProjectArchive = (projectId: string, archived?: boolean) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          archived: archived !== undefined ? archived : !proj.archived
        };
      }
      return proj;
    }));
  };

  const toggleDeliverableArchive = (projectId: string, contentId: string, archived?: boolean) => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === projectId) {
        return {
          ...proj,
          contentItems: proj.contentItems.map(item =>
            item.id === contentId
              ? { ...item, archived: archived !== undefined ? archived : !item.archived }
              : item
          )
        };
      }
      return proj;
    }));
  };

  const toggleArtArchive = (inspirationId: string, archived?: boolean) => {
    setVisualInspirations(prev => prev.map(item => {
      if (item.id === inspirationId) {
        return {
          ...item,
          archived: archived !== undefined ? archived : !item.archived
        };
      }
      return item;
    }));
  };

  // ==========================================
  // SINGLE SOURCE ACTIONS (ETAPA 2)
  // ==========================================

  const createAccount = (accountData: Omit<Account, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Account => {
    const accountId = accountData.id || `acc_${Date.now()}`;
    const newAcc: Account = {
      ...accountData,
      id: accountId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setAccounts(prev => {
      const updated = [newAcc, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(updated));
      }
      return updated;
    });

    // 1. Auto-create ClientAccount for Chat & Portal access
    const cleanUsername = (newAcc.companyName || 'cliente')
      .split(' ')[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "") || 'cliente';

    let safeUser = cleanUsername;
    let count = 2;
    while (clientAccounts.some(c => c.username.toLowerCase() === safeUser)) {
      safeUser = `${cleanUsername}${count}`;
      count++;
    }

    const newClientAccId = `client-${Date.now()}`;
    const newClientAcc: ClientAccount = {
      id: newClientAccId,
      clientName: newAcc.companyName,
      companyName: newAcc.companyName,
      email: `contato@${cleanUsername}.com.br`,
      username: safeUser,
      password: '2026',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setClientAccounts(prev => {
      if (!prev.some(c => c.companyName.toLowerCase() === newAcc.companyName.toLowerCase())) {
        const updated = [...prev, newClientAcc];
        if (typeof window !== 'undefined') {
          localStorage.setItem('sharp_client_accounts', JSON.stringify(updated));
        }
        return updated;
      }
      return prev;
    });

    // 2. Auto-create Project for Operations (Kanban & Selector)
    setProjects(prev => {
      if (!prev.some(p => p.accountId === accountId || p.companyName.toLowerCase() === newAcc.companyName.toLowerCase())) {
        const defaultChecklist = getInitialChecklistForStage('onboarding');
        const newProj: Project = {
          id: `proj-${Date.now()}`,
          accountId: accountId,
          clientId: newClientAccId,
          companyName: newAcc.companyName,
          clientName: newAcc.companyName,
          clientEmail: `contato@${cleanUsername}.com.br`,
          clientPhone: newAcc.phone || '(19) 9 9568-2110',
          segment: newAcc.segment || 'Serviços & Negócios',
          logoUrl: newAcc.logoUrl,
          solutions: newAcc.contractedSolutions && newAcc.contractedSolutions.length > 0 ? newAcc.contractedSolutions : ['sharp_brand', 'sharp_presence'],
          contractedPackages: newAcc.contractedPackages || [],
          monthlyFee: newAcc.monthlyFee !== undefined ? newAcc.monthlyFee : 2900,
          contractValue: newAcc.contractValue !== undefined ? newAcc.contractValue : 6500,
          stage: 'onboarding',
          assignedTeam: {
            designer: 'Luan (Líder de Arte)',
            strategist: 'Raphael (Estrategista Chefe)',
            commercial: 'Ingrid (Atendimento & CS)'
          },
          onboardingChecklist: defaultChecklist,
          stageChecklists: { onboarding: defaultChecklist },
          contentItems: [],
          notes: newAcc.notes || 'Cliente cadastrado via Clientes & Contas.',
          createdAt: new Date().toISOString()
        };
        const updated = [newProj, ...prev];
        if (typeof window !== 'undefined') {
          localStorage.setItem('sharp_projects', JSON.stringify(updated));
        }
        return updated;
      }
      return prev;
    });

    // 3. Auto-initialize Direct Chat Channel
    setChatMessages(prev => {
      if (!prev.some(m => m.clientAccountId === newClientAccId)) {
        const welcomeMsg: ChatMessage = {
          id: `msg_welcome_${Date.now()}`,
          senderId: 'team-raphael',
          senderName: 'Raphael (Estrategista Chefe - Sharp)',
          senderRole: 'sharp',
          channel: 'client_direct',
          clientAccountId: newClientAccId,
          content: `Olá, equipe ${newAcc.companyName}! Sejam muito bem-vindos à Sharp. Este é o canal direto e exclusivo de comunicação com os estrategistas, designers e líderes da sua conta. Qualquer dúvida ou solicitação pode ser enviada por aqui.`,
          createdAt: new Date().toISOString()
        };
        const updated = [...prev, welcomeMsg];
        if (typeof window !== 'undefined') {
          localStorage.setItem('sharp_chat_messages', JSON.stringify(updated));
        }
        return updated;
      }
      return prev;
    });

    return newAcc;
  };

  const updateAccount = (accountId: string, updatedData: Partial<Account>) => {
    setAccounts(prev => {
      const updated = prev.map(a => a.id === accountId ? { ...a, ...updatedData, updatedAt: new Date().toISOString() } : a);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(updated));
      }
      return updated;
    });

    // Automatic cascade to Projects & ClientAccounts
    const targetAccount = accounts.find(a => a.id === accountId);
    const compName = targetAccount?.companyName || '';

    if (compName) {
      setProjects(prev => {
        let changed = false;
        const updated = prev.map(p => {
          if (p.accountId === accountId || p.companyName.toLowerCase() === compName.toLowerCase()) {
            changed = true;
            return {
              ...p,
              ...(updatedData.companyName ? { companyName: updatedData.companyName } : {}),
              ...(updatedData.logoUrl !== undefined ? { logoUrl: updatedData.logoUrl } : {}),
              ...(updatedData.segment ? { segment: updatedData.segment } : {}),
              ...(updatedData.monthlyFee !== undefined ? { monthlyFee: updatedData.monthlyFee } : {}),
              ...(updatedData.contractValue !== undefined ? { contractValue: updatedData.contractValue } : {}),
              ...(updatedData.contractedSolutions ? { solutions: updatedData.contractedSolutions } : {}),
              ...(updatedData.contractedPackages ? { contractedPackages: updatedData.contractedPackages } : {}),
              ...(updatedData.notes ? { notes: updatedData.notes } : {}),
              updatedAt: new Date().toISOString()
            };
          }
          return p;
        });
        if (changed && typeof window !== 'undefined') {
          localStorage.setItem('sharp_projects', JSON.stringify(updated));
        }
        return updated;
      });

      setClientAccounts(prev => {
        let changed = false;
        const updated = prev.map(ca => {
          if (ca.id === accountId || ca.companyName.toLowerCase() === compName.toLowerCase()) {
            changed = true;
            return {
              ...ca,
              ...(updatedData.companyName ? { companyName: updatedData.companyName, clientName: updatedData.companyName } : {})
            };
          }
          return ca;
        });
        if (changed && typeof window !== 'undefined') {
          localStorage.setItem('sharp_client_accounts', JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  const archiveAccount = (accountId: string) => {
    archiveClientCascade(accountId, 'archive');
  };

  const archiveClientCascade = (companyNameOrAccountId: string, actionType: 'archive' | 'delete' = 'archive') => {
    const targetKey = companyNameOrAccountId;
    const targetAcc = accounts.find(a => isClientMatch(a, targetKey));
    const targetProj = projects.find(p => isClientMatch(p, targetKey));
    const targetClientAcc = clientAccounts.find(c => isClientMatch(c, targetKey));
    const companyName = targetAcc?.companyName || targetProj?.companyName || targetClientAcc?.companyName || companyNameOrAccountId;
    const accountId = targetAcc?.id || targetProj?.accountId || companyNameOrAccountId;

    // 1. Update or create Accounts with status: 'archived'
    setAccounts(prev => {
      let matched = false;
      const updated = prev.map(a => {
        if (isClientMatch(a, targetKey) || (targetAcc && a.id === targetAcc.id)) {
          matched = true;
          return {
            ...a,
            status: 'archived' as const,
            updatedAt: new Date().toISOString()
          };
        }
        return a;
      });

      // If this account wasn't in accounts yet (e.g. was a pure project or unified client), explicitly insert as archived
      if (!matched && (targetProj || targetClientAcc || companyName)) {
        const archivedAcc: Account = {
          id: accountId || `acc_archived_${Date.now()}`,
          companyName: companyName,
          segment: targetProj?.segment || 'Serviços Gerais',
          phone: targetProj?.clientPhone || '(19) 9 9568-2110',
          status: 'archived',
          contractValue: targetProj?.contractValue,
          monthlyFee: targetProj?.monthlyFee,
          contractedSolutions: targetProj?.solutions || ['sharp_brand', 'sharp_presence'],
          contractedPackages: targetProj?.contractedPackages,
          notes: targetProj?.notes,
          logoUrl: targetProj?.logoUrl,
          createdAt: targetProj?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updated.unshift(archivedAcc);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(updated));
      }
      return updated;
    });

    // 2. Archive all Projects of this client
    setProjects(prev => {
      const updated = prev.map(p => {
        if (
          isClientMatch(p, targetKey) ||
          isClientMatch(p, companyName) ||
          (accountId && p.accountId === accountId) ||
          (targetAcc && isClientMatch(p, targetAcc.companyName))
        ) {
          return {
            ...p,
            archived: true,
            status: 'archived' as any,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(updated));
      }
      return updated;
    });

    // 3. Update ClientAccounts
    setClientAccounts(prev => {
      const updated = prev.map(ca => {
        if (
          isClientMatch(ca, targetKey) ||
          isClientMatch(ca, companyName) ||
          (accountId && ca.id === accountId)
        ) {
          return { ...ca, status: 'inactive' as const };
        }
        return ca;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_client_accounts', JSON.stringify(updated));
      }
      return updated;
    });

    // 4. Update Contacts
    setContacts(prev => {
      const updated = prev.map(c => {
        if (c.accountId === accountId || isClientMatch(c, targetKey) || isClientMatch(c, companyName)) {
          return { ...c, status: 'archived' as const, updatedAt: new Date().toISOString() };
        }
        return c;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(updated));
      }
      return updated;
    });

    // 5. Update Unified Clients
    try {
      const uniClients = getUnifiedClients();
      const updatedUni = uniClients.map(uc => {
        if (isClientMatch(uc, targetKey) || isClientMatch(uc, companyName)) {
          return { ...uc, status: 'Inativo / Arquivado' as const, updatedAt: new Date().toISOString() };
        }
        return uc;
      });
      saveUnifiedClients(updatedUni);
    } catch (e) {
      console.error('Error updating unified clients on archive:', e);
    }

    // 6. Broadcast global notification
    addNotification({
      type: 'general',
      targetRole: 'all',
      title: actionType === 'delete' ? 'Cliente Excluído / Arquivado' : 'Cliente Arquivado com Sucesso',
      message: `O cliente "${companyName}" foi ${actionType === 'delete' ? 'excluído e movido para os registros arquivados' : 'arquivado'}. Todos os seus cards e canais foram atualizados.`,
      clientName: companyName,
      actionTab: 'clients',
      projectId: targetAcc?.id || targetProj?.id
    });
  };

  const restoreClientCascade = (companyNameOrAccountId: string) => {
    const targetKey = companyNameOrAccountId;
    const targetAcc = accounts.find(a => isClientMatch(a, targetKey));
    const targetProj = projects.find(p => isClientMatch(p, targetKey));
    const targetClientAcc = clientAccounts.find(c => isClientMatch(c, targetKey));
    const companyName = targetAcc?.companyName || targetProj?.companyName || targetClientAcc?.companyName || companyNameOrAccountId;
    const accountId = targetAcc?.id || targetProj?.accountId || companyNameOrAccountId;

    // 1. Restore Accounts
    setAccounts(prev => {
      const updated = prev.map(a => {
        if (isClientMatch(a, targetKey) || (targetAcc && a.id === targetAcc.id)) {
          return {
            ...a,
            status: 'active' as const,
            updatedAt: new Date().toISOString()
          };
        }
        return a;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(updated));
      }
      return updated;
    });

    // 2. Unarchive Projects
    setProjects(prev => {
      const updated = prev.map(p => {
        if (
          isClientMatch(p, targetKey) ||
          isClientMatch(p, companyName) ||
          (accountId && p.accountId === accountId) ||
          (targetAcc && isClientMatch(p, targetAcc.companyName))
        ) {
          return {
            ...p,
            archived: false,
            status: 'producao' as any,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(updated));
      }
      return updated;
    });

    // 3. Reactivate Client Accounts
    setClientAccounts(prev => {
      const updated = prev.map(ca => {
        if (
          isClientMatch(ca, targetKey) ||
          isClientMatch(ca, companyName) ||
          (accountId && ca.id === accountId)
        ) {
          return { ...ca, status: 'active' as const };
        }
        return ca;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_client_accounts', JSON.stringify(updated));
      }
      return updated;
    });

    // 4. Restore Contacts
    setContacts(prev => {
      const updated = prev.map(c => {
        if (c.accountId === accountId || isClientMatch(c, targetKey) || isClientMatch(c, companyName)) {
          return { ...c, status: 'active' as const, updatedAt: new Date().toISOString() };
        }
        return c;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(updated));
      }
      return updated;
    });

    // 5. Restore Unified Clients
    try {
      const uniClients = getUnifiedClients();
      const updatedUni = uniClients.map(uc => {
        if (isClientMatch(uc, targetKey) || isClientMatch(uc, companyName)) {
          return { ...uc, status: 'Ativo' as const, updatedAt: new Date().toISOString() };
        }
        return uc;
      });
      saveUnifiedClients(updatedUni);
    } catch (e) {
      console.error('Error updating unified clients on restore:', e);
    }

    // 6. Toast / Notification
    addNotification({
      type: 'general',
      targetRole: 'all',
      title: 'Cliente Desarquivado e Restaurado',
      message: `O cliente "${companyName}" e seus cards de Operação foram restaurados para a esteira ativa!`,
      clientName: companyName,
      actionTab: 'projects',
      projectId: targetAcc?.id || targetProj?.id
    });
  };

  const deleteAccountPermanently = (companyNameOrAccountId: string, reason?: string) => {
    deleteClientPermanently(companyNameOrAccountId, reason);
  };

  const deleteClientPermanently = (companyNameOrAccountId: string, reason?: string) => {
    const targetKey = companyNameOrAccountId;
    const targetAcc = accounts.find(a => isClientMatch(a, targetKey));
    const targetProj = projects.find(p => isClientMatch(p, targetKey));
    const targetClientAcc = clientAccounts.find(c => isClientMatch(c, targetKey));
    const companyName = targetAcc?.companyName || targetProj?.companyName || targetClientAcc?.companyName || companyNameOrAccountId;
    const accountId = targetAcc?.id || targetProj?.accountId || companyNameOrAccountId;

    // Log audit event
    const audit = {
      id: `aud_del_${Date.now()}`,
      action: 'PERMANENT_DELETE_CLIENT',
      entityType: 'client_and_account',
      entityId: accountId,
      performedBy: currentUser?.name || 'Administrador Sharp',
      reason: reason || 'Exclusão permanente e definitiva executada via Clientes & Contas',
      affectedRecords: [accountId, companyName],
      timestamp: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      try {
        const existingAudits = JSON.parse(localStorage.getItem(STORAGE_KEYS.auditEvents) || '[]');
        localStorage.setItem(STORAGE_KEYS.auditEvents, JSON.stringify([...existingAudits, audit]));
      } catch (e) {}
    }

    // 1. Remove from accounts
    setAccounts(prev => {
      const updated = prev.filter(a => !isClientMatch(a, targetKey) && !isClientMatch(a, companyName) && a.id !== accountId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(updated));
      }
      return updated;
    });

    // 2. Permanently remove from projects
    setProjects(prev => {
      const updated = prev.filter(p => !isClientMatch(p, targetKey) && !isClientMatch(p, companyName) && p.accountId !== accountId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(updated));
      }
      return updated;
    });

    // 3. Permanently remove from clientAccounts
    setClientAccounts(prev => {
      const updated = prev.filter(ca => !isClientMatch(ca, targetKey) && !isClientMatch(ca, companyName) && ca.id !== accountId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_client_accounts', JSON.stringify(updated));
      }
      return updated;
    });

    // 4. Remove contacts
    setContacts(prev => {
      const updated = prev.filter(c => c.accountId !== accountId && !isClientMatch(c, targetKey) && !isClientMatch(c, companyName));
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(updated));
      }
      return updated;
    });

    // 5. Remove leads if matching
    setLeads(prev => prev.filter(l => !isClientMatch(l, targetKey) && !isClientMatch(l, companyName)));

    // 6. Remove chat messages
    setChatMessages(prev => {
      const updated = prev.filter(m => {
        if (targetClientAcc && m.clientAccountId === targetClientAcc.id) return false;
        if (m.clientAccountId === accountId) return false;
        return true;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_chat_messages', JSON.stringify(updated));
      }
      return updated;
    });

    // 7. Remove scheduled meetings
    setScheduledMeetings(prev => prev.filter(m => !isClientMatch(m, targetKey) && !isClientMatch(m, companyName)));

    // 8. Remove from unified clients
    try {
      const uniClients = getUnifiedClients();
      const updatedUni = uniClients.filter(uc => !isClientMatch(uc, targetKey) && !isClientMatch(uc, companyName));
      saveUnifiedClients(updatedUni);
    } catch (e) {
      console.error('Error removing unified client on delete:', e);
    }

    if (currentUser && (isClientMatch(currentUser as any, targetKey) || currentUser.id === accountId)) {
      logout();
    }

    addNotification({
      type: 'general',
      targetRole: 'all',
      title: 'Cliente Excluído Definitivamente',
      message: `O cliente "${companyName}" foi permanentemente excluído do sistema (contas, projetos, contatos e histórico).`,
      clientName: companyName,
      actionTab: 'clients'
    });
  };

  const resolveDuplicateNotice = (noticeId: string) => {
    setDuplicateNotices(prev => {
      const updated = prev.map(n => n.id === noticeId ? { ...n, status: 'resolved' as const } : n);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.duplicateNotices, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const createContact = (contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Contact => {
    const newContact: Contact = {
      ...contactData,
      id: contactData.id || `cnt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setContacts(prev => {
      const updated = [...prev, newContact];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(updated));
      }
      return updated;
    });
    return newContact;
  };

  const updateContact = (contactId: string, updatedData: Partial<Contact>) => {
    setContacts(prev => {
      const updated = prev.map(c => c.id === contactId ? { ...c, ...updatedData, updatedAt: new Date().toISOString() } : c);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.contacts, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const createOpportunity = (oppData: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Opportunity => {
    const newOpp: Opportunity = {
      ...oppData,
      id: oppData.id || `opp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setOpportunities(prev => {
      const updated = [newOpp, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.opportunities, JSON.stringify(updated));
      }
      return updated;
    });
    return newOpp;
  };

  const updateOpportunity = (opportunityId: string, updatedData: Partial<Opportunity>) => {
    setOpportunities(prev => {
      const updated = prev.map(o => o.id === opportunityId ? { ...o, ...updatedData, updatedAt: new Date().toISOString() } : o);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.opportunities, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const createContract = (contractData: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Contract => {
    const newContract: Contract = {
      ...contractData,
      id: contractData.id || `cntr_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setContracts(prev => {
      const updated = [newContract, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.contracts, JSON.stringify(updated));
      }
      return updated;
    });
    return newContract;
  };

  // ==========================================
  // ACTIVE PRODUCTS & OPERATIONAL SYNC
  // ==========================================

  const addActiveProductToProject = (projectId: string, product: Omit<ProjectActiveProduct, 'id'>) => {
    const defaultSubs = product.subProducts && product.subProducts.length > 0 
      ? product.subProducts 
      : generateDefaultSubProducts(product.solutionId);

    const newProd: ProjectActiveProduct = {
      ...product,
      subProducts: defaultSubs,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };

    setProjects(prev => {
      const updated = prev.map(proj => {
        if (proj.id === projectId) {
          const currentActive = proj.activeProducts || [];
          const updatedActive = [...currentActive, newProd];
          const solId = product.solutionId as SolutionId;
          const currentSolutions = proj.solutions || [];
          const updatedSolutions = currentSolutions.includes(solId) ? currentSolutions : [...currentSolutions, solId];

          return {
            ...proj,
            activeProducts: updatedActive,
            solutions: updatedSolutions,
            updatedAt: new Date().toISOString()
          };
        }
        return proj;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateProjectActiveProduct = (projectId: string, productId: string, data: Partial<ProjectActiveProduct>) => {
    setProjects(prev => {
      const updated = prev.map(proj => {
        if (proj.id === projectId) {
          const currentActive = proj.activeProducts || [];
          const updatedActive = currentActive.map(p => p.id === productId ? { ...p, ...data } : p);
          return {
            ...proj,
            activeProducts: updatedActive,
            updatedAt: new Date().toISOString()
          };
        }
        return proj;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeProjectActiveProduct = (projectId: string, productId: string) => {
    setProjects(prev => {
      const updated = prev.map(proj => {
        if (proj.id === projectId) {
          const currentActive = proj.activeProducts || [];
          const updatedActive = currentActive.filter(p => p.id !== productId);
          return {
            ...proj,
            activeProducts: updatedActive,
            updatedAt: new Date().toISOString()
          };
        }
        return proj;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addSubProductToActiveProduct = (projectId: string, productId: string, subProduct: Omit<ProjectSubProduct, 'id'>) => {
    const newSub: ProjectSubProduct = {
      ...subProduct,
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };

    setProjects(prev => {
      const updated = prev.map(proj => {
        if (proj.id === projectId) {
          const currentActive = proj.activeProducts || [];
          const updatedActive = currentActive.map(prod => {
            if (prod.id === productId) {
              const currentSubs = prod.subProducts || [];
              return {
                ...prod,
                subProducts: [...currentSubs, newSub]
              };
            }
            return prod;
          });
          return {
            ...proj,
            activeProducts: updatedActive,
            updatedAt: new Date().toISOString()
          };
        }
        return proj;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateProjectSubProduct = (projectId: string, productId: string, subProductId: string, data: Partial<ProjectSubProduct>) => {
    setProjects(prev => {
      const updated = prev.map(proj => {
        if (proj.id === projectId) {
          const currentActive = proj.activeProducts || [];
          const updatedActive = currentActive.map(prod => {
            if (prod.id === productId) {
              const currentSubs = prod.subProducts || [];
              const updatedSubs = currentSubs.map(s => s.id === subProductId ? { ...s, ...data } : s);
              return {
                ...prod,
                subProducts: updatedSubs
              };
            }
            return prod;
          });
          return {
            ...proj,
            activeProducts: updatedActive,
            updatedAt: new Date().toISOString()
          };
        }
        return proj;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeProjectSubProduct = (projectId: string, productId: string, subProductId: string) => {
    setProjects(prev => {
      const updated = prev.map(proj => {
        if (proj.id === projectId) {
          const currentActive = proj.activeProducts || [];
          const updatedActive = currentActive.map(prod => {
            if (prod.id === productId) {
              const currentSubs = prod.subProducts || [];
              const updatedSubs = currentSubs.filter(s => s.id !== subProductId);
              return {
                ...prod,
                subProducts: updatedSubs
              };
            }
            return prod;
          });
          return {
            ...proj,
            activeProducts: updatedActive,
            updatedAt: new Date().toISOString()
          };
        }
        return proj;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const syncAllRegisteredClientsToProjects = (): { syncedCount: number; message: string } => {
    let newProjectsCreated = 0;
    
    setProjects(prevProjects => {
      let currentProjects = [...prevProjects];

      // 1. Gather all candidates from Accounts, ClientAccounts, and UnifiedClients
      const candidates: {
        companyName: string;
        clientName: string;
        email: string;
        phone: string;
        segment?: string;
        accountId?: string;
        clientId?: string;
        solutions?: SolutionId[];
      }[] = [];

      // From accounts (ACTIVE only)
      accounts.forEach(acc => {
        if (acc.status !== 'archived' && acc.companyName && !candidates.some(c => isClientMatch(c.companyName, acc.companyName))) {
          const contact = contacts.find(co => co.accountId === acc.id);
          candidates.push({
            companyName: acc.companyName,
            clientName: contact?.name || acc.companyName,
            email: contact?.email || `contato@${acc.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
            phone: contact?.phone || acc.phone || '(19) 9 9568-2110',
            segment: acc.segment || 'Serviços & Negócios',
            accountId: acc.id
          });
        }
      });

      // From clientAccounts (ACTIVE only)
      clientAccounts.forEach(ca => {
        if (ca.status !== 'inactive' && ca.companyName && !candidates.some(c => isClientMatch(c.companyName, ca.companyName))) {
          // Verify account is not archived
          const isArchived = accounts.some(a => isClientMatch(a, ca.companyName) && a.status === 'archived');
          if (!isArchived) {
            candidates.push({
              companyName: ca.companyName,
              clientName: ca.clientName,
              email: ca.email || `${ca.username}@sharp.com.br`,
              phone: '(19) 9 9568-2110',
              segment: 'Serviços Gerais',
              clientId: ca.id
            });
          }
        }
      });

      // From unifiedClients (ACTIVE only)
      try {
        const uniClients = getUnifiedClients();
        uniClients.forEach(uc => {
          if (uc.status !== 'Inativo / Arquivado' && uc.companyName && !candidates.some(c => isClientMatch(c.companyName, uc.companyName))) {
            const isArchived = accounts.some(a => isClientMatch(a, uc.companyName) && a.status === 'archived');
            if (!isArchived) {
              candidates.push({
                companyName: uc.companyName,
                clientName: uc.clientName || uc.name || uc.companyName,
                email: uc.email,
                phone: uc.phone,
                segment: uc.segment,
                clientId: uc.id,
                solutions: (uc.enrolledProducts?.map(p => p.pillarId as SolutionId) || [])
              });
            }
          }
        });
      } catch (err) {
        console.error('Error fetching unified clients for sync:', err);
      }

      // 2. Iterate candidates and create missing projects
      candidates.forEach((cand, idx) => {
        const alreadyHasProject = currentProjects.some(p =>
          isClientMatch(p, cand.companyName) ||
          (p.accountId && cand.accountId && p.accountId === cand.accountId) ||
          (p.clientId && cand.clientId && p.clientId === cand.clientId)
        );

        if (!alreadyHasProject) {
          const chosenSolutions: SolutionId[] = cand.solutions && cand.solutions.length > 0
            ? cand.solutions
            : ['sharp_brand', 'sharp_presence'];

          const activeProducts: ProjectActiveProduct[] = chosenSolutions.map((solId, pIdx) => {
            const names: Record<string, { name: string; pkg: string; stage: string; staff: string }> = {
              sharp_brand: {
                name: 'Sharp Brand',
                pkg: 'Identidade & Posicionamento Autoral',
                stage: 'Criação de Ativos & Brandbook',
                staff: 'Luan (Líder de Arte)'
              },
              sharp_presence: {
                name: 'Sharp Presence',
                pkg: 'Social Media & Gestão de Conteúdo',
                stage: 'Produção de Lote & Copys',
                staff: 'Luan (Líder de Arte)'
              },
              sharp_insights: {
                name: 'Sharp Insights',
                pkg: 'Inteligência de Mercado & Diagnóstico',
                stage: 'Direcionamento Estratégico',
                staff: 'Raphael (Estrategista Chefe)'
              },
              sharp_growth: {
                name: 'Sharp Growth',
                pkg: 'Performance & Gestão de Tráfego',
                stage: 'Setup de Campanhas & Conversão',
                staff: 'Cristiano (Growth & Mídia)'
              }
            };
            const meta = names[solId] || {
              name: solId.toUpperCase(),
              pkg: 'Pacote Operacional',
              stage: 'Em Execução',
              staff: 'Luan (Líder de Arte)'
            };

            return {
              id: `prod_${solId}_${Date.now()}_${pIdx}`,
              solutionId: solId,
              name: meta.name,
              packageName: meta.pkg,
              status: 'active' as const,
              currentStage: meta.stage,
              responsibleStaff: meta.staff,
              startDate: new Date().toISOString().split('T')[0],
              deliverablesSummary: `Execução contínua das entregas de ${meta.name} para ${cand.companyName}.`,
              subProducts: generateDefaultSubProducts(solId)
            };
          });

          const newProj: Project = {
            id: `proj_sync_${Date.now()}_${idx}`,
            accountId: cand.accountId,
            clientId: cand.clientId,
            leadId: `lead_sync_${Date.now()}_${idx}`,
            companyName: cand.companyName,
            clientName: cand.clientName,
            clientEmail: cand.email,
            clientPhone: cand.phone || '(19) 9 9568-2110',
            segment: cand.segment || 'Serviços & Negócios',
            solutions: chosenSolutions,
            activeProducts: activeProducts,
            stage: 'producao',
            onboardingChecklist: [
              { id: `ob-sync-1-${Date.now()}-${idx}`, label: 'Coleta de acessos & Briefing técnico validado', completed: true },
              { id: `ob-sync-2-${Date.now()}-${idx}`, label: 'Definição de personas, tom de voz e referências', completed: true },
              { id: `ob-sync-3-${Date.now()}-${idx}`, label: 'Planejamento e distribuição de tarefas de produção', completed: false },
              { id: `ob-sync-4-${Date.now()}-${idx}`, label: 'Validação técnica com Líder de Arte (Luan)', completed: false }
            ],
            assignedTeam: {
              designer: 'Luan (Líder de Arte)',
              strategist: 'Raphael (Estrategista Chefe)',
              commercial: 'Ingrid (Atendimento & CS)'
            },
            contentItems: [
              {
                id: `c-sync-${Date.now()}-${idx}`,
                projectId: `proj_sync_${Date.now()}_${idx}`,
                title: `Arte de Posicionamento Oficial: ${cand.companyName}`,
                type: 'feed_post',
                mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
                copyText: `Diretriz estratégica e visual autoral desenvolvida para a marca ${cand.companyName}.`,
                status: 'ready_for_review',
                uploadedBy: 'Luan (Líder de Arte)',
                createdAt: new Date().toISOString()
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          currentProjects.push(newProj);
          newProjectsCreated++;
        }
      });

      // 3. For any existing project lacking activeProducts or subProducts, enrich with defaults
      currentProjects = currentProjects.map(p => {
        if (!p.activeProducts || p.activeProducts.length === 0) {
          const sols = p.solutions && p.solutions.length > 0 ? p.solutions : ['sharp_brand', 'sharp_presence'];
          const prods: ProjectActiveProduct[] = sols.map((solId, pIdx) => ({
            id: `prod_${solId}_${p.id}_${pIdx}`,
            solutionId: solId,
            name: solId === 'sharp_brand' ? 'Sharp Brand' : solId === 'sharp_presence' ? 'Sharp Presence' : solId === 'sharp_insights' ? 'Sharp Insights' : 'Sharp Growth',
            packageName: solId === 'sharp_brand' ? 'Identidade & Posicionamento Autoral' : 'Social Media & Gestão de Conteúdo',
            status: 'active' as const,
            currentStage: solId === 'sharp_brand' ? 'Criação de Ativos & Brandbook' : 'Produção de Lote & Copys',
            responsibleStaff: solId === 'sharp_growth' ? 'Cristiano (Growth & Mídia)' : solId === 'sharp_insights' ? 'Raphael (Estrategista Chefe)' : 'Luan (Líder de Arte)',
            startDate: p.createdAt ? p.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            deliverablesSummary: `Entregas e cronograma de ${solId} para ${p.companyName}.`,
            subProducts: generateDefaultSubProducts(solId)
          }));
          return { ...p, activeProducts: prods };
        } else {
          // If active products exist but some lack subProducts, populate them
          const enrichedActive = p.activeProducts.map(prod => {
            if (!prod.subProducts || prod.subProducts.length === 0) {
              return {
                ...prod,
                subProducts: generateDefaultSubProducts(prod.solutionId)
              };
            }
            return prod;
          });
          return { ...p, activeProducts: enrichedActive };
        }
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('sharp_projects', JSON.stringify(currentProjects));
      }
      return currentProjects;
    });

    return {
      syncedCount: newProjectsCreated,
      message: newProjectsCreated > 0 
        ? `${newProjectsCreated} clientes sincronizados e subiram para Projetos e Operação com sucesso!`
        : 'Todos os clientes cadastrados já estão integrados e ativos na Operação.'
    };
  };

  // Run self-healing sync on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      syncAllRegisteredClientsToProjects();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activeNavTab,
        setActiveNavTab,
        selectedChatClientId,
        setSelectedChatClientId,
        navigateToClientChat,
        currentUser,
        staffMembers,
        clientAccounts,
        sharpLogoUrl,
        setSharpLogoUrl,
        sharpMasterProfile,
        updateSharpMasterProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        logout,
        registerStaffMember,
        updateStaffMember,
        deleteStaffMember,
        registerClientAccount,
        updateClientAccount,
        deleteClientAccount,
        toggleClientStatus,
        isClientInactive,
        clearAllClientTestData,
        changeUserPassword,
        chatMessages,
        sendChatMessage,
        updateChatApprovalStatus,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        sendDeliverableToClientApproval,
        sendDeliverableToInternalReview,
        submitClientDecision,
        submitInternalReview,
        addDeliverableComment,
        selectedDeliverableForFocus,
        setSelectedDeliverableForFocus,
        selectedSolutions,
        toggleSolution,
        setSelectedSolutions,
        clientInfo,
        setClientInfo,
        leads,
        projects,
        visualInspirations,
        scheduledMeetings,
        currentBriefing,
        currentPainAnalysis,
        isSubmittingBriefing,
        isAnalyzingPain,
        isGeneratingVisual,
        submitBriefing,
        submitDiagnosticLead,
        analyzePain,
        generateVisual,
        bookMeeting,
        updateLeadStage,
        convertLeadToClientAndProject,
        deleteLead,
        addProject,
        updateProject,
        deleteProject,
        deleteDeliverable,
        deleteVisualInspiration,
        sendArtLeaderNotes,
        uploadContentDeliverable,
        approveContent,
        requestContentAdjustment,
        setProjectStage,
        toggleStageChecklistItem,
        addStageChecklistItem,
        removeStageChecklistItem,
        toggleOnboardingItem,
        addOnboardingItem,
        removeOnboardingItem,
        toggleProjectArchive,
        toggleDeliverableArchive,
        toggleArtArchive,
        createDataBackup,
        restoreDataBackup,
        getLatestBackup,
        // Quality Follow-Ups
        qualityFollowUps,
        addQualityFollowUp,
        updateQualityFollowUp,
        deleteQualityFollowUp,
        // Single Source (ETAPA 2)
        accounts,
        contacts,
        duplicateNotices,
        opportunities,
        contracts,
        deliveryTemplates,
        createAccount,
        updateAccount,
        archiveAccount,
        archiveClientCascade,
        restoreClientCascade,
        toggleReworkTaskStatus,
        deleteAccountPermanently,
        deleteClientPermanently,
        resolveDuplicateNotice,
        createContact,
        updateContact,
        createOpportunity,
        updateOpportunity,
        createContract,
        // Active Products & Operational Sync
        addActiveProductToProject,
        updateProjectActiveProduct,
        removeProjectActiveProduct,
        addSubProductToActiveProduct,
        updateProjectSubProduct,
        removeProjectSubProduct,
        syncAllRegisteredClientsToProjects,
        // Official Pricing & Products Catalog Management (Financeiro Comercial)
        officialPackages,
        updateOfficialPackage,
        resetOfficialPackagesToDefault,
        addCustomOfficialPackage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider');
  return context;
};
