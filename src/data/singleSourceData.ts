import { 
  Account, Contact, DuplicateNotice, Opportunity, Contract, ContractProduct, 
  DeliveryTemplate, Deliverable, DiagnosticRecord, Activity, AuditEvent,
  Project, SolutionId, OnboardingCheckitem, ProjectStage
} from '../types';
import { INITIAL_PROJECTS, INITIAL_LEADS, INITIAL_CLIENT_ACCOUNTS } from './mockData';
import { INITIAL_UNIFIED_CLIENTS } from './methodologyData';

// Storage Keys
export const STORAGE_KEYS = {
  accounts: 'sharp_accounts',
  contacts: 'sharp_contacts',
  duplicateNotices: 'sharp_duplicate_notices',
  opportunities: 'sharp_opportunities',
  contracts: 'sharp_contracts',
  deliveryTemplates: 'sharp_delivery_templates',
  deliverables: 'sharp_deliverables',
  diagnosticRecords: 'sharp_diagnostic_records',
  activities: 'sharp_activities',
  auditEvents: 'sharp_audit_events',
  migratedMarker: 'sharp_single_source_migrated_v1'
};

// =========================================================================
// ETAPA 5: MODELOS DE ENTREGA REUTILIZÁVEIS (DELIVERY TEMPLATES)
// =========================================================================

export const INITIAL_DELIVERY_TEMPLATES: DeliveryTemplate[] = [
  {
    id: 'dt_sharp_brand_strategy',
    productId: 'sharp_brand',
    packageId: 'tier_brand_strategy',
    name: 'Sharp Brand Strategy',
    version: 1,
    status: 'active',
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    stages: [
      {
        id: 'stg_brand_1',
        name: 'Imersão Estratégica & Diagnóstico',
        description: 'Mapeamento profundo de atributos, público e diferenciais.',
        order: 1,
        acceptanceCriteria: ['Briefing 100% preenchido', 'Pesquisa de concorrência validada'],
        tasks: [
          { id: 't_b1', title: 'Análise de Matriz SWOT & Território de Marca', role: 'Estrategista', required: true, order: 1 },
          { id: 't_b2', title: 'Entrevista de Alinhamento com Fundadores', role: 'Estrategista', required: true, order: 2 },
          { id: 't_b3', title: 'Mapeamento de Arquétipos e Tom de Voz', role: 'Estrategista', required: true, order: 3 }
        ]
      },
      {
        id: 'stg_brand_2',
        name: 'Diretrizes Visuais & Identidade',
        description: 'Criação do universo visual, tipografia e grid.',
        order: 2,
        acceptanceCriteria: ['Aprovação interna do Líder de Arte', 'Painel semântico validado'],
        tasks: [
          { id: 't_b4', title: 'Construção do Moodboard Semântico', role: 'Líder de Arte', required: true, order: 1 },
          { id: 't_b5', title: 'Desenvolvimento do Símbolo e Tipografia', role: 'Líder de Arte', required: true, order: 2 },
          { id: 't_b6', title: 'Aplicações em Peças Chave e Mockups', role: 'Líder de Arte', required: true, order: 3 }
        ]
      },
      {
        id: 'stg_brand_3',
        name: 'Brandbook & Entrega Oficial',
        description: 'Consolidação de regras e manuais de marca.',
        order: 3,
        acceptanceCriteria: ['Brandbook PDF entregue', 'Aprovação final do cliente'],
        tasks: [
          { id: 't_b7', title: 'Compilação do Brandbook Executivo', role: 'Líder de Arte', required: true, order: 1 },
          { id: 't_b8', title: 'Apresentação Executiva de Posicionamento', role: 'Estrategista', required: true, order: 2 }
        ]
      }
    ]
  },
  {
    id: 'dt_sharp_insights_essential',
    productId: 'sharp_insights',
    packageId: 'tier_insights_essential',
    name: 'Sharp Insights Essential',
    version: 1,
    status: 'active',
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    stages: [
      {
        id: 'stg_ins_1',
        name: 'Coleta e Mapeamento de Dados',
        description: 'Estruturação dos dados e benchmarks de mercado.',
        order: 1,
        tasks: [
          { id: 't_i1', title: 'Levantamento de Indicadores de Mercado', role: 'Estrategista', required: true, order: 1 },
          { id: 't_i2', title: 'Diagnóstico de Presença Digital dos Concorrentes', role: 'Estrategista', required: true, order: 2 }
        ]
      },
      {
        id: 'stg_ins_2',
        name: 'Relatório Executivo de Oportunidades',
        description: 'Síntese das recomendações acionáveis para o negócio.',
        order: 2,
        tasks: [
          { id: 't_i3', title: 'Redação do Dossiê de Inteligência', role: 'Estrategista', required: true, order: 1 },
          { id: 't_i4', title: 'Reunião de Apresentação de Insights', role: 'Estrategista', required: true, order: 2 }
        ]
      }
    ]
  },
  {
    id: 'dt_sharp_insights_market',
    productId: 'sharp_insights',
    packageId: 'tier_insights_market',
    name: 'Sharp Insights Market',
    version: 1,
    status: 'active',
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    stages: [
      {
        id: 'stg_insm_1',
        name: 'Pesquisa Setorial Aprofundada',
        description: 'Análise de macro e microambiente de negócios.',
        order: 1,
        tasks: [
          { id: 't_im1', title: 'Estudo de Precificação e Margens de Concorrentes', role: 'Estrategista', required: true, order: 1 },
          { id: 't_im2', title: 'Mapeamento de Tendências de Consumo', role: 'Estrategista', required: true, order: 2 }
        ]
      },
      {
        id: 'stg_insm_2',
        name: 'Plano de Ação Estratégico',
        description: 'Roadmap de crescimento baseado em inteligência de dados.',
        order: 2,
        tasks: [
          { id: 't_im3', title: 'Desenvolvimento do Plano de Ação', role: 'Estrategista', required: true, order: 1 }
        ]
      }
    ]
  },
  {
    id: 'dt_sharp_presence_mgmt',
    productId: 'sharp_presence',
    packageId: 'tier_presence_management',
    name: 'Sharp Presence Management',
    version: 1,
    status: 'active',
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    stages: [
      {
        id: 'stg_pres_1',
        name: 'Planejamento Editorial & Linhas Editoriais',
        description: 'Definição de calendários, temas e formatos.',
        order: 1,
        tasks: [
          { id: 't_p1', title: 'Estruturação das Linhas de Conteúdo Estratégico', role: 'Estrategista de Conteúdo', required: true, order: 1 },
          { id: 't_p2', title: 'Criação do Cronograma Mensal', role: 'Estrategista de Conteúdo', required: true, order: 2 }
        ]
      },
      {
        id: 'stg_pres_2',
        name: 'Produção Criativa & Design',
        description: 'Redação de copy e design de peças de alto impacto.',
        order: 2,
        tasks: [
          { id: 't_p3', title: 'Redação de Copywriting e Roteiros', role: 'Estrategista de Conteúdo', required: true, order: 1 },
          { id: 't_p4', title: 'Design de Artes e Carrosséis', role: 'Líder de Arte', required: true, order: 2 },
          { id: 't_p5', title: 'Revisão Interna de Qualidade', role: 'Líder de Arte', required: true, order: 3 }
        ]
      },
      {
        id: 'stg_pres_3',
        name: 'Publicação & Monitoramento',
        description: 'Distribuição e análise de métricas de engajamento.',
        order: 3,
        tasks: [
          { id: 't_p6', title: 'Agendamento de Postagens', role: 'Atendimento & CS', required: true, order: 1 },
          { id: 't_p7', title: 'Relatório Mensal de Performance', role: 'Estrategista', required: true, order: 2 }
        ]
      }
    ]
  },
  {
    id: 'dt_sharp_growth_advisory',
    productId: 'sharp_growth',
    packageId: 'tier_growth_advisory',
    name: 'Sharp Growth Advisory',
    version: 1,
    status: 'active',
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    stages: [
      {
        id: 'stg_grw_1',
        name: 'Auditoria de Aquisição & Conversão',
        description: 'Análise de canais de vendas e funis existentes.',
        order: 1,
        tasks: [
          { id: 't_g1', title: 'Mapeamento do Funil Comercial Atual', role: 'Estrategista', required: true, order: 1 },
          { id: 't_g2', title: 'Diagnóstico de CAC, LTV e Taxa de Conversão', role: 'Estrategista', required: true, order: 2 }
        ]
      },
      {
        id: 'stg_grw_2',
        name: 'Implementação de Alavancas de Crescimento',
        description: 'Execução de testes rápidos e otimização de canais.',
        order: 2,
        tasks: [
          { id: 't_g3', title: 'Criação do Playbook de Vendas', role: 'Estrategista', required: true, order: 1 },
          { id: 't_g4', title: 'Sessão Quinzenal de Acompanhamento de Metas', role: 'Estrategista', required: true, order: 2 }
        ]
      }
    ]
  }
];

// Helper to safely access localStorage
function getLocalArray<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (e) {
    console.error(`Erro lendo ${key}:`, e);
    return fallback;
  }
}

function setLocalArray<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Erro gravando ${key}:`, e);
  }
}

// =========================================================================
// ETAPA 2: MIGRAÇÃO E FONTE ÚNICA PARA CLIENTES (ACCOUNTS & CONTACTS)
// =========================================================================

export function initializeSingleSourceData(): {
  accounts: Account[];
  contacts: Contact[];
  duplicateNotices: DuplicateNotice[];
  opportunities: Opportunity[];
  contracts: Contract[];
  deliveryTemplates: DeliveryTemplate[];
} {
  const existingAccounts = getLocalArray<Account>(STORAGE_KEYS.accounts, []);
  const existingContacts = getLocalArray<Contact>(STORAGE_KEYS.contacts, []);
  const existingNotices = getLocalArray<DuplicateNotice>(STORAGE_KEYS.duplicateNotices, []);
  const existingOpps = getLocalArray<Opportunity>(STORAGE_KEYS.opportunities, []);
  const existingContracts = getLocalArray<Contract>(STORAGE_KEYS.contracts, []);
  const existingTemplates = getLocalArray<DeliveryTemplate>(STORAGE_KEYS.deliveryTemplates, INITIAL_DELIVERY_TEMPLATES);

  // If already migrated and accounts exist, return them
  if (existingAccounts.length > 0) {
    return {
      accounts: existingAccounts,
      contacts: existingContacts,
      duplicateNotices: existingNotices,
      opportunities: existingOpps,
      contracts: existingContracts,
      deliveryTemplates: existingTemplates
    };
  }

  // Perform migration from old collections
  const accounts: Account[] = [];
  const contacts: Contact[] = [];
  const duplicateNotices: DuplicateNotice[] = [];
  const opportunities: Opportunity[] = [];
  const contracts: Contract[] = [];

  // 1. Initialized Accounts from seed data
  // Special case: Clínica Lumina Odontologia as specified in ETAPA 2
  const luminaAccount: Account = {
    id: 'acc_lumina_odontologia',
    companyName: 'Clínica Lumina Odontologia',
    legalName: 'Clínica Lumina Odontologia Especializada Ltda',
    segment: 'Saúde & Odontologia Premium',
    phone: '(19) 9 9568-2110',
    website: 'https://clinicalumina.com.br',
    status: 'active',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-02-18T14:30:00.000Z'
  };
  accounts.push(luminaAccount);

  const luminaPrimaryContact: Contact = {
    id: 'cnt_camila_vasconcelos',
    accountId: luminaAccount.id,
    name: 'Dra. Camila Vasconcelos',
    email: 'camila@clinicalumina.com.br',
    phone: '(19) 9 9568-2110',
    role: 'Diretora Clínica & Sócia Fundadora',
    isPrimary: true,
    status: 'active',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-02-18T14:30:00.000Z'
  };
  contacts.push(luminaPrimaryContact);

  // Additional divergent contact kept for validation
  const luminaAltContact: Contact = {
    id: 'cnt_camila_secundaria',
    accountId: luminaAccount.id,
    name: 'Camila Vasconcelos (Contato Administrativo)',
    email: 'contato@clinicalumina.com.br',
    phone: '(19) 9 8877-6655',
    role: 'Administração',
    isPrimary: false,
    status: 'active',
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-01-20T10:00:00.000Z'
  };
  contacts.push(luminaAltContact);

  // Notice for Lumina
  duplicateNotices.push({
    id: 'not_lumina_dup_1',
    accountId: luminaAccount.id,
    companyName: 'Clínica Lumina Odontologia',
    field: 'E-mail de Contato Principal',
    sourceValues: [
      { source: 'Portal do Cliente', value: 'camila@clinicalumina.com.br' },
      { source: 'Cadastro Histórico', value: 'contato@clinicalumina.com.br' }
    ],
    status: 'pending_review',
    createdAt: '2026-02-18T10:00:00.000Z'
  });

  // Seed remaining mock accounts from INITIAL_PROJECTS and INITIAL_UNIFIED_CLIENTS
  const seedProjects = INITIAL_PROJECTS;
  seedProjects.forEach((proj, idx) => {
    if (proj.companyName.toLowerCase().includes('lumina')) return; // already handled

    const accId = `acc_${proj.id || 'seed_' + idx}`;
    const contactId = `cnt_${proj.id || 'seed_' + idx}`;

    const acc: Account = {
      id: accId,
      companyName: proj.companyName,
      segment: proj.segment || 'Serviços & Negócios',
      phone: proj.clientPhone || '(19) 9 9568-2110',
      status: 'active',
      createdAt: proj.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    accounts.push(acc);

    const contact: Contact = {
      id: contactId,
      accountId: accId,
      name: proj.clientName || 'Responsável',
      email: proj.clientEmail,
      phone: proj.clientPhone || '(19) 9 9568-2110',
      role: 'Principal',
      isPrimary: true,
      status: 'active',
      createdAt: proj.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contacts.push(contact);

    // Initial contract for existing active project
    const contractId = `ct_${proj.id}`;
    const oppId = `opp_${proj.id}`;

    opportunities.push({
      id: oppId,
      accountId: accId,
      primaryContactId: contactId,
      leadId: proj.leadId,
      title: `Contrato Inicial - ${proj.companyName}`,
      selectedSolutions: proj.solutions,
      stage: 'won',
      estimatedValue: 12500,
      createdAt: proj.createdAt,
      updatedAt: proj.createdAt
    });

    contracts.push({
      id: contractId,
      accountId: accId,
      primaryContactId: contactId,
      opportunityId: oppId,
      status: 'active',
      products: proj.solutions.map(sol => ({
        productId: sol,
        packageId: `tier_${sol}_default`,
        deliveryTemplateId: sol === 'sharp_brand' ? 'dt_sharp_brand_strategy' : 'dt_sharp_presence_mgmt'
      })),
      startDate: proj.createdAt,
      totalValue: 12500,
      scope: `Execução contratual de ${proj.solutions.join(', ')}`,
      createdAt: proj.createdAt,
      updatedAt: proj.createdAt
    });
  });

  // Save to storage
  setLocalArray(STORAGE_KEYS.accounts, accounts);
  setLocalArray(STORAGE_KEYS.contacts, contacts);
  setLocalArray(STORAGE_KEYS.duplicateNotices, duplicateNotices);
  setLocalArray(STORAGE_KEYS.opportunities, opportunities);
  setLocalArray(STORAGE_KEYS.contracts, contracts);
  setLocalArray(STORAGE_KEYS.deliveryTemplates, existingTemplates);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.migratedMarker, 'true');
  }

  return {
    accounts,
    contacts,
    duplicateNotices,
    opportunities,
    contracts,
    deliveryTemplates: existingTemplates
  };
}

// =========================================================================
// ETAPA 4: CONVERSÃO IDEMPOTENTE DO CRM
// =========================================================================

export function convertOpportunityToClientProject(
  opportunityId: string,
  allAccounts: Account[],
  allContacts: Contact[],
  allOpportunities: Opportunity[],
  allContracts: Contract[],
  allProjects: Project[],
  allTemplates: DeliveryTemplate[],
  currentUserName = 'Administrador Sharp'
): {
  success: boolean;
  message: string;
  account?: Account;
  contact?: Contact;
  contract?: Contract;
  project?: Project;
  opportunity?: Opportunity;
  auditEvent?: AuditEvent;
} {
  // 1. Localizar a oportunidade
  const oppIndex = allOpportunities.findIndex(o => o.id === opportunityId);
  if (oppIndex === -1) {
    return { success: false, message: `Oportunidade ID ${opportunityId} não encontrada.` };
  }
  const opp = allOpportunities[oppIndex];

  // 2. Verificar se ela já possui accountId ou localizar/criar conta
  let account = allAccounts.find(a => a.id === opp.accountId);
  if (!account) {
    // Buscar por título ou criar
    const cleanName = opp.title.replace(/^Projeto - |^Contrato - |^Oportunidade - /gi, '').trim() || 'Nova Empresa';
    const existingByName = allAccounts.find(a => a.companyName.toLowerCase() === cleanName.toLowerCase());
    
    if (existingByName) {
      account = existingByName;
    } else {
      account = {
        id: `acc_${Date.now()}`,
        companyName: cleanName,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      allAccounts.push(account);
    }
    opp.accountId = account.id;
  }

  // 3. Localizar ou criar contato principal
  let contact = allContacts.find(c => c.id === opp.primaryContactId || (c.accountId === account!.id && c.isPrimary));
  if (!contact) {
    contact = {
      id: `cnt_${Date.now()}`,
      accountId: account.id,
      name: 'Contato Principal',
      isPrimary: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    allContacts.push(contact);
  }
  opp.primaryContactId = contact.id;

  // 4. Idempotência do Contrato: verificar se já existe contrato com opportunityId
  let contract = allContracts.find(c => c.opportunityId === opp.id);
  if (!contract) {
    // 5. Copiar produtos contratados para o contrato
    const contractProducts: ContractProduct[] = opp.selectedSolutions.map(sol => {
      const matchingTemplate = allTemplates.find(t => t.productId === sol && t.status === 'active') || allTemplates[0];
      return {
        productId: sol,
        packageId: `tier_${sol}_default`,
        deliveryTemplateId: matchingTemplate.id,
        quantity: 1,
        customNotes: `Contratado via Oportunidade ${opp.title}`
      };
    });

    contract = {
      id: `ct_${Date.now()}`,
      accountId: account.id,
      primaryContactId: contact.id,
      opportunityId: opp.id,
      status: 'active',
      products: contractProducts,
      startDate: new Date().toISOString().split('T')[0],
      totalValue: opp.estimatedValue || 10000,
      scope: `Execução dos Modelos Sharp para ${account.companyName}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    allContracts.push(contract);
  }

  // 6. Idempotência do Projeto: verificar se já existe projeto com contractId
  let project = allProjects.find(p => p.contractId === contract!.id);
  if (!project) {
    // Selecionar templates de entrega e compilar executionTemplates versionados (ETAPA 5)
    const chosenTemplateIds = contract.products.map(p => p.deliveryTemplateId);
    const chosenTemplates = allTemplates.filter(t => chosenTemplateIds.includes(t.id));
    const activeTemplates = chosenTemplates.length > 0 ? chosenTemplates : allTemplates.slice(0, 1);

    const projectExecutionTemplates = activeTemplates.map(t => ({
      templateId: t.id,
      templateVersion: t.version,
      templateName: t.name,
      copiedAt: new Date().toISOString(),
      stages: t.stages.map(stg => ({
        id: `exec_stg_${stg.id}_${Date.now()}`,
        templateStageId: stg.id,
        name: stg.name,
        order: stg.order,
        status: 'pending' as const,
        acceptanceCriteria: stg.acceptanceCriteria || [],
        tasks: stg.tasks.map(tsk => ({
          id: `exec_tsk_${tsk.id}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          templateTaskId: tsk.id,
          title: tsk.title,
          role: tsk.role,
          completed: false,
          status: 'pending' as const
        }))
      }))
    }));

    // Montar onboarding checklist inicial a partir do primeiro estágio
    const initialTasks: OnboardingCheckitem[] = [];
    activeTemplates.forEach(t => {
      t.stages.forEach(stg => {
        stg.tasks.forEach(tsk => {
          initialTasks.push({
            id: `task_${tsk.id}_${Date.now()}`,
            label: `[${t.name}] ${tsk.title} (${tsk.role || 'Geral'})`,
            completed: false
          });
        });
      });
    });

    const fallbackChecklist: OnboardingCheckitem[] = initialTasks.length > 0 ? initialTasks : [
      { id: `ob_1_${Date.now()}`, label: 'Coleta de acessos & Briefing validado', completed: false },
      { id: `ob_2_${Date.now()}`, label: 'Definição de equipe e cronograma', completed: false },
      { id: `ob_3_${Date.now()}`, label: 'Kickoff de alinhamento com cliente', completed: false }
    ];

    project = {
      id: `proj_${Date.now()}`,
      accountId: account.id,
      primaryContactId: contact.id,
      contractId: contract.id,
      deliveryTemplateVersionIds: activeTemplates.map(t => t.id),
      executionTemplates: projectExecutionTemplates,
      reworkTasks: [],
      leadId: opp.leadId || `lead_${Date.now()}`,
      companyName: account.companyName,
      clientName: contact.name,
      clientEmail: contact.email || `contato@${account.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
      clientPhone: contact.phone || '(19) 9 9568-2110',
      solutions: (opp.selectedSolutions && opp.selectedSolutions.length > 0 ? opp.selectedSolutions : ['sharp_brand']) as SolutionId[],
      contractedPackages: activeTemplates.map(t => t.name),
      stage: 'onboarding',
      onboardingChecklist: fallbackChecklist,
      assignedTeam: {
        designer: 'Luan (Líder de Arte)',
        strategist: 'Raphael (Estrategista Chefe)',
        commercial: 'Ingrid (Comercial)'
      },
      contentItems: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    allProjects.push(project);
  }

  // 7. Alterar oportunidade para WON
  opp.stage = 'won';
  opp.updatedAt = new Date().toISOString();

  // 8. Evento de Auditoria
  const auditEvent: AuditEvent = {
    id: `aud_${Date.now()}`,
    action: 'CONVERT_OPPORTUNITY_TO_PROJECT',
    entityType: 'opportunity',
    entityId: opp.id,
    performedBy: currentUserName,
    reason: `Conversão comercial ganha da oportunidade "${opp.title}"`,
    affectedRecords: [account.id, contact.id, contract.id, project.id],
    timestamp: new Date().toISOString()
  };

  // Salvar alterações
  setLocalArray(STORAGE_KEYS.accounts, allAccounts);
  setLocalArray(STORAGE_KEYS.contacts, allContacts);
  setLocalArray(STORAGE_KEYS.opportunities, allOpportunities);
  setLocalArray(STORAGE_KEYS.contracts, allContracts);
  setLocalArray(STORAGE_KEYS.auditEvents, [...getLocalArray<AuditEvent>(STORAGE_KEYS.auditEvents, []), auditEvent]);
  setLocalArray('sharp_projects', allProjects);

  return {
    success: true,
    message: `Oportunidade convertida com sucesso em Contrato e Projeto (${project.companyName}).`,
    account,
    contact,
    contract,
    project,
    opportunity: opp,
    auditEvent
  };
}
