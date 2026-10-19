export type UserRole = 'guest' | 'lead' | 'client' | 'sharp_admin';

export type SolutionId = 'sharp_brand' | 'sharp_presence' | 'sharp_insights' | 'sharp_growth';

export interface SubProductFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

export interface SubProductTier {
  id: string;
  productId: SolutionId;
  name: string;
  shortName: string;
  badge?: string;
  popular?: boolean;
  description: string;
  targetProfile: string;
  features: SubProductFeature[];
}

export interface SolutionOption {
  id: SolutionId;
  name: string;
  tagline: string;
  category: string;
  description: string;
  clientDesire: string; // "O cliente compra: ..."
  deliverables: string[];
  recommendedFor: string;
}

export interface DiagnosticData {
  id?: string;
  // Etapa 1: Dados da Empresa
  contactName?: string;
  companyName?: string;
  segment?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  linkedin?: string;

  // Etapa 2: Sobre o Negócio & Porte
  timeInMarket?: string;
  employeeCount?: string;
  productCount?: string;
  serviceCount?: string;
  revenueRange?: string;
  revenueStage?: string;
  mainProduct?: string;
  mainService?: string;
  mainDifferential?: string;

  // Etapa 3: Mercado & Canais
  idealClients?: string;
  mainCompetitors?: string;
  clientAcquisitionMethod?: string;
  salesChannel?: string;
  biggestDifficulty?: string;
  mainBottleneck?: string;
  next12MonthsGoals?: string;
  growthObjective?: string;

  // Etapa 4: Marca & Estratégia
  brandPresence?: string;
  hasVisualIdentity?: string;
  hasPositioning?: string;
  hasDigitalPresence?: string;
  hasStrategicPlanning?: string;
  hasMarketingTeam?: string;
  hasSalesTeam?: string;

  // Scores
  overallScore?: number;
  presencaScore?: number;
  comercialScore?: number;
  posicionamentoScore?: number;
  comunicacaoScore?: number;

  createdAt?: string;
}

export interface BriefingFormData {
  // General PME Info
  companyName: string;
  segment: string;
  contactName: string;
  email: string;
  phone: string;
  websiteOrSocial: string;

  // Sharp Brand Block
  brandPersonality?: string;
  idealCustomer?: string;
  topCompetitors?: string;
  perceivedValues?: string;

  // Sharp Presence Block
  socialPlatforms?: string;
  postingFrequency?: string;
  contentGoals?: string;
  visualStylePreference?: string;

  // Sharp Insights Block
  keyMarketQuestions?: string;
  geographicRegion?: string;
  mainCompetitorThreat?: string;
  currentDecisionBottleneck?: string;

  // Sharp Growth Block
  revenueStage?: string;
  teamSize?: string;
  salesBottleneck?: string;
  mainKPIsTracked?: string;
}

export interface PainAnalysisResult {
  problema_central: string;
  diagnostico_preliminar: string;
  oportunidade_sugerida: string;
  grau_urgencia: 'Alto' | 'Médio' | 'Crítico' | string;
  plano_preliminar: string[];
  createdAt?: string;
}

export interface VisualInspiration {
  id: string;
  clientId: string;
  clientEmail: string;
  clientName: string;
  companyName: string;
  prompt: string;
  style: string;
  imageUrl: string;
  status: 'pending_art_leader' | 'analyzed' | 'incorporated';
  artLeaderNotes?: string;
  archived?: boolean;
  createdAt: string;
}

export type PipelineStage = 
  | 'novo_lead' 
  | 'contato'
  | 'contato_realizado'
  | 'diagnostico' 
  | 'diagnostico_agendado'
  | 'reuniao' 
  | 'reuniao_realizada'
  | 'reuniao_fechamento'
  | 'proposta' 
  | 'proposta_enviada'
  | 'negociacao' 
  | 'cliente' 
  | 'cliente_fechado'
  | 'fechado_ganho'
  | 'desqualificado'
  | 'arquivado';

export interface LeadHistoryNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface LeadTask {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  segment: string;
  selectedSolutions: SolutionId[];
  briefingData?: BriefingFormData;
  diagnosticData?: DiagnosticData;
  painAnalysis?: PainAnalysisResult;
  visualInspirations?: VisualInspiration[];
  scheduledMeeting?: ScheduledMeeting;
  stage: PipelineStage;
  notes?: string;
  historyNotes?: LeadHistoryNote[];
  tasks?: LeadTask[];
  attachments?: { name: string; url: string; date: string }[];
  createdAt: string;
}

export type ContentStatus = 
  | 'draft' 
  | 'ready_for_review' 
  | 'pending_client_approval'
  | 'internal_review'
  | 'adjustment_requested' 
  | 'approved' 
  | 'revision_requested' 
  | 'rejected';

export interface ContentComment {
  id: string;
  authorName: string;
  authorUsername?: string;
  authorRole: 'sharp' | 'client';
  text: string;
  createdAt: string;
}

export interface InternalReview {
  id: string;
  reviewedBy: string; // e.g. "Luan"
  reviewerUsername: string; // e.g. "luan"
  decision: 'approved' | 'rejected' | 'revision';
  notes?: string;
  reviewedAt: string;
}

export interface ClientApprovalInfo {
  status: 'pending' | 'approved' | 'rejected' | 'revision';
  feedback?: string; // Motivo de reprovação ou pontos a revisar
  decidedAt?: string;
  clientName?: string;
}

export interface ContentDeliverableFile {
  name: string;
  url: string;
  type?: string;
  size?: string;
}

export interface ContentDeliverable {
  id: string;
  projectId: string;
  productId?: string;
  subProductId?: string;
  title: string;
  type: 'feed_post' | 'carousel' | 'carousel_static' | 'video' | 'story' | 'copy' | 'brand_identity' | 'file';
  mediaUrl: string;
  mediaUrls?: string[];
  files?: ContentDeliverableFile[];
  formatDetails?: {
    isCarouselStatic?: boolean;
    isVideo?: boolean;
    slideCount?: number;
    duration?: string;
  };
  fileName?: string;
  fileSize?: string;
  copyText: string;
  status: ContentStatus;
  clientFeedback?: string;
  uploadedBy: string; // e.g., 'Luan (Designer)' | 'Raphael (Estrategista)'
  archived?: boolean;
  createdAt: string;
  
  // Workflow & Approval data
  clientApproval?: ClientApprovalInfo;
  internalReviews?: InternalReview[];
  comments?: ContentComment[];
  sentToClient?: boolean;
  sentToInternal?: boolean;
}

export interface OnboardingCheckitem {
  id: string;
  label: string;
  completed: boolean;
}

export type ProjectStage = 
  | 'vendas_negociacao'
  | 'onboarding' 
  | 'kickoff' 
  | 'investigacao_estudo'
  | 'producao' 
  | 'revisao_cliente' 
  | 'concluido';

export interface ResearchStudyTask {
  id: string;
  title: string;
  category: 'mercado' | 'concorrencia' | 'persona' | 'posicionamento' | 'editorial' | 'growth';
  description: string;
  whatToResearch: string[];
  findings?: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string; // e.g. "Raphael (Estrategista)" | "Cristiano (Growth)"
  completedAt?: string;
}

export interface ResearchHandoff {
  id: string;
  projectId: string;
  solutionId: string;
  investigators: string[]; // e.g. ["Raphael", "Cristiano"]
  passedTo: string; // e.g. "Kauã (Criação de Artes & Design)"
  passedToUsername: string; // e.g. "kaua" or "luan"
  summaryFindings: string;
  creativeDirectives: string[];
  status: 'draft' | 'passed' | 'accepted';
  passedAt?: string;
}

export interface ProjectReworkTask {
  id: string;
  projectId: string;
  deliverableId: string;
  title: string;
  description: string;
  assignedTo?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdFrom: 'client_revision' | 'client_rejection' | 'internal_review' | string;
  createdAt: string;
}

export interface ProjectExecutionTemplate {
  templateId: string;
  templateVersion: number;
  templateName: string;
  copiedAt: string;
  stages: {
    id: string;
    templateStageId: string;
    name: string;
    order: number;
    status: 'pending' | 'in_progress' | 'completed';
    acceptanceCriteria: string[];
    tasks: {
      id: string;
      templateTaskId: string;
      title: string;
      role?: string;
      completed: boolean;
      status: 'pending' | 'in_progress' | 'completed';
    }[];
  }[];
}

export interface ProjectSubProduct {
  id: string;
  name: string;
  category: 'art' | 'strategy' | 'copy' | 'media' | 'tech';
  description?: string;
  isArtDeliverable: boolean; // Flag to indicate art/photo upload & approval pipeline
  stage: string;
  responsibleStaff: string;
  deliverablesCount?: number;
  approvedCount?: number;
  status: 'pending' | 'in_progress' | 'in_review' | 'completed';
}

export interface ProjectActiveProduct {
  id: string;
  solutionId: SolutionId | string;
  name: string;
  packageName?: string;
  status: 'active' | 'in_progress' | 'paused' | 'completed';
  currentStage: string;
  responsibleStaff: string;
  startDate: string;
  targetEndDate?: string;
  deliverablesSummary?: string;
  notes?: string;
  subProducts?: ProjectSubProduct[];
}

export interface Project {
  id: string;
  accountId?: string;
  primaryContactId?: string;
  contractId?: string;
  deliveryTemplateVersionIds?: string[];
  executionTemplates?: ProjectExecutionTemplate[];
  reworkTasks?: ProjectReworkTask[];
  leadId?: string;
  clientId?: string;
  companyName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  segment?: string;
  cnpj?: string;
  address?: string;
  logoUrl?: string;
  contractValue?: number; // valor fechado / setup total
  monthlyFee?: number; // mensalidade / fee recorrente
  packagePriceOverrides?: Record<string, { customPrice: number; reason?: string }>;
  priceAdjustmentReason?: string;
  solutions: SolutionId[];
  activeProducts?: ProjectActiveProduct[];
  contractedPackages?: string[];
  stage: ProjectStage;
  startDate?: string;
  targetEndDate?: string;
  onboardingChecklist: OnboardingCheckitem[];
  stageChecklists?: Partial<Record<ProjectStage, OnboardingCheckitem[]>>;
  assignedTeam: {
    designer?: string; // e.g. "Luan"
    strategist?: string; // e.g. "Raphael"
    commercial?: string; // e.g. "Ingrid"
    [key: string]: string | undefined;
  };
  contentItems: ContentDeliverable[];
  deliverables?: Deliverable[];
  notes?: string;
  deadline?: string;
  archived?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ScheduledMeeting {
  id: string;
  leadId?: string;
  clientName: string;
  clientEmail: string;
  companyName: string;
  companySocial?: string;
  phone?: string;
  reason?: string;
  date: string;
  timeSlot: string;
  specialist: string; // e.g., "Raphael (Estrategista Chefe)" | "Luan (Líder de Arte)" | "Ingrid (Vendas)"
  type: 'diagnostico_gratuito' | 'fechamento' | 'semanal_feedback';
  status: 'scheduled' | 'confirmed' | 'rescheduled' | 'canceled' | 'completed';
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  username: string; // e.g. 'raphael', 'luan', 'lucas', 'cristiano'
  password: string; // Default: '2026'
  role: string;     // e.g. 'Estrategista Chefe', 'Líder de Arte', 'Atendimento & Vendas', 'Estrategista de Conteúdo'
  email?: string;
  avatarUrl?: string;
  photoUrl?: string;
  createdAt: string;
}

export interface ClientAccount {
  id: string;
  companyName: string;
  clientName: string;
  email: string;
  phone?: string;
  username: string; // e.g. 'camila'
  password: string; // Default: '2026'
  avatarUrl?: string;
  photoUrl?: string;
  projectId?: string;
  status?: 'active' | 'inactive'; // 'active' or 'inactive'
  createdAt: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  staffRole?: string;    // If sharp_admin
  clientEmail?: string;  // If client
  companyName?: string;  // If client
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'sharp' | 'client';
  channel: 'internal_team' | 'client_direct';
  clientAccountId?: string; // required if channel === 'client_direct'
  content: string;
  fileAttachment?: {
    name: string;
    url: string;
    type: 'image' | 'document' | 'art_approval';
    contentDeliverableId?: string;
    projectId?: string;
  };
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'revision';
  clientFeedback?: string;
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  type: 'internal_art_review' | 'client_feedback' | 'new_lead' | 'client_registered' | 'art_status' | 'general';
  targetRole: 'sharp' | 'client' | 'all';
  targetUsername?: string;
  title: string;
  message: string;
  clientName?: string;
  projectId?: string;
  deliverableId?: string;
  read: boolean;
  createdAt: string;
  actionTab?: string;
}

export interface CMSArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  coverImage?: string;
  summary: string;
  content: string;
  author: string;
  tags?: string[];
  status: 'draft' | 'published';
  date: string;
  seoDescription?: string;
}

// ==========================================
// UNIFIED CLIENT & METHODOLOGY TYPES
// ==========================================

export type PillarId = 'sharp_insights' | 'sharp_brand' | 'sharp_presence' | 'sharp_growth';

export interface MethodologyTask {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  stageId?: string;
}

export interface ProductNoteLog {
  id: string;
  author: string;
  date: string;
  time: string;
  text: string;
}

export interface ProductPackage {
  id: string;
  name: string;
  badge: string;
  description: string;
  tasks: string[];
}

export interface StageDefinition {
  id: string;
  title: string;
  subtitle: string;
  deliverable: string;
  tasks: string[];
}

export interface PillarDefinition {
  id: PillarId;
  name: string;
  tagline: string;
  question: string;
  deliverableTitle: string;
  iconName: string;
  colorScheme: {
    badge: string;
    pill: string;
    border: string;
    borderActive: string;
    bgLight: string;
    accentText: string;
    accentBg: string;
    dot: string;
  };
  packages: ProductPackage[];
  stages: StageDefinition[];
}

export interface ClientProductEnrollment {
  id: string;
  pillarId: PillarId;
  packageId: string;
  packageName: string;
  currentStageId: string;
  startDate: string;
  responsibleStaff: string;
  lifecycleStatus?: 'ativo' | 'concluido' | 'arquivado';
  statusReason?: string;
  notes?: string;
  noteLogs?: ProductNoteLog[];
  tasks: MethodologyTask[];
}

export interface UnifiedClient {
  id: string;
  name: string;
  clientName: string;
  companyName: string;
  segment: string;
  phone: string;
  email: string;
  contractedProducts: string[];
  nextMeetingDate: string;
  meetingTopic: string;
  approvedMaterials: number;
  rejectedMaterials: number;
  pendingMaterials: number;
  sharpNotes: string;
  status: 'Ativo' | 'Em Onboarding' | 'Pausado' | 'Inativo / Arquivado' | 'Concluído';
  createdAt: string;
  enrolledProducts: ClientProductEnrollment[];
}

// ==========================================
// ETAPAS 2, 3, 5, 7, 8, 9, 10, 11 - DOMAIN ENTITIES
// ==========================================

export interface Account {
  id: string;
  companyName: string;
  legalName?: string;
  segment?: string;
  phone?: string;
  website?: string;
  cnpj?: string;
  address?: string;
  logoUrl?: string;
  contractValue?: number; // valor fechado
  monthlyFee?: number; // mensalidade
  packagePriceOverrides?: Record<string, { customPrice: number; reason?: string }>;
  priceAdjustmentReason?: string;
  contractedPackages?: string[]; // pacotes oficiais contratados
  contractedSolutions?: SolutionId[]; // soluções contratadas
  notes?: string; // observações
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  accountId: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary: boolean;
  status: 'active' | 'inactive' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface DuplicateNotice {
  id: string;
  accountId: string;
  companyName: string;
  field: string;
  sourceValues: { source: string; value: string }[];
  status: 'pending_review' | 'resolved';
  createdAt: string;
}

export interface Opportunity {
  id: string;
  accountId?: string;
  primaryContactId?: string;
  leadId?: string;
  title: string;
  selectedSolutions: string[];
  stage: 'new' | 'qualified' | 'diagnostic' | 'proposal' | 'negotiation' | 'won';
  estimatedValue?: number;
  expectedCloseDate?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractProduct {
  productId: string;
  packageId: string;
  deliveryTemplateId: string;
  quantity?: number;
  customNotes?: string;
}

export interface Contract {
  id: string;
  accountId: string;
  primaryContactId?: string;
  opportunityId: string;
  status: 'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'cancelled';
  products: ContractProduct[];
  startDate?: string;
  endDate?: string;
  totalValue?: number;
  scope?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryTaskTemplate {
  id: string;
  title: string;
  description?: string;
  role?: string;
  required: boolean;
  order: number;
}

export interface DeliveryStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  tasks: DeliveryTaskTemplate[];
  acceptanceCriteria?: string[];
}

export interface DeliveryTemplate {
  id: string;
  productId: string;
  packageId: string;
  name: string;
  version: number;
  status: 'draft' | 'active' | 'archived';
  stages: DeliveryStage[];
  createdAt: string;
  updatedAt: string;
}

export interface Deliverable {
  id: string;
  projectId: string;
  templateTaskId?: string;
  title: string;
  type: string;
  version: number;
  status: 'draft' | 'internal_review' | 'client_review' | 'revision' | 'approved' | 'rejected' | 'published';
  assignedTo?: string;
  fileUrl?: string;
  internalNotes?: string;
  clientFeedback?: string;
  createdAt: string;
  updatedAt: string;
  decisionLogs?: {
    user: string;
    role: string;
    date: string;
    time: string;
    version: number;
    decision: string;
    comment?: string;
    fileUrl?: string;
  }[];
}

export interface DiagnosticRecord {
  id: string;
  accountId: string;
  opportunityId?: string;
  projectId?: string;
  type: 'pain_analysis' | 'business_health_check' | 'market_analysis' | 'roi_calc';
  status: 'draft' | 'processing' | 'completed' | 'failed';
  input: Record<string, unknown>;
  result?: Record<string, unknown>;
  errorMessage?: string;
  createdBy?: string;
  createdAt: string;
  completedAt?: string;
}

export interface Activity {
  id: string;
  accountId: string;
  projectId?: string;
  contactId?: string;
  type: 'message' | 'meeting' | 'approval' | 'decision' | 'note' | 'status_change';
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface AuditEvent {
  id: string;
  action: string;
  entityType: 'account' | 'contact' | 'opportunity' | 'contract' | 'project' | 'deliverable' | 'system';
  entityId: string;
  performedBy: string;
  reason?: string;
  affectedRecords?: string[];
  timestamp: string;
}

export interface QualityFollowUp {
  id: string;
  accountId: string;
  projectId?: string;
  contactDate: string;
  qualityAgent: string; // e.g. "Ingrid (CS & Qualidade)", "Lucas (Qualidade)"
  channel: 'whatsapp' | 'call' | 'meeting' | 'survey' | 'email';
  satisfactionScore: number; // 1 to 10
  sentiment: 'promoter' | 'neutral' | 'attention_needed' | 'risk';
  clientPerception: string; // O que o cliente está achando do projeto e das entregas
  pointsOfImprovement?: string;
  compliments?: string;
  nextScheduledReturn?: string;
  actionItems?: string;
  createdAt: string;
}




