import { SolutionId } from '../types';

export interface StageTask {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  completed: boolean;
  isArtUpload?: boolean;
}

export const isArtActivity = (title?: string, description?: string): boolean => {
  if (!title) return false;
  const t = (title + ' ' + (description || '')).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return (
    t.includes('arte') ||
    t.includes('logo') ||
    t.includes('logotipo') ||
    t.includes('paleta') ||
    t.includes('tipografia') ||
    t.includes('elemento') ||
    t.includes('grafic') ||
    t.includes('identidade visual') ||
    t.includes('tom de voz') ||
    t.includes('redesenho') ||
    t.includes('manual') ||
    t.includes('brandbook') ||
    t.includes('post') ||
    t.includes('carrossel') ||
    t.includes('storie') ||
    t.includes('story') ||
    t.includes('criativ') ||
    t.includes('criacao') ||
    t.includes('copy') ||
    t.includes('peca') ||
    t.includes('banner') ||
    t.includes('campanha') ||
    t.includes('design') ||
    t.includes('layout')
  );
};

export interface StagePrerequisite {
  completed: boolean;
  completedAt?: string;
  title?: string;
  description?: string;
  responsibleStaff?: string;
}

export interface ProductStageDefinition {
  id: string;
  order: number;
  name: string;
  description: string;
  responsibleStaff: string;
  requiresArt: boolean;
  isArtCreation?: boolean;
  status: 'pending' | 'in_progress' | 'completed';
  onboarding?: StagePrerequisite;
  kickoff?: StagePrerequisite;
  tasks: StageTask[];
}

export type ProductStage = ProductStageDefinition;

export const ONBOARDING_INFO = {
  title: '1. ONBOARDING',
  shortTitle: 'Onboarding',
  subtitle: 'Apresentação Institucional & Questionário Base',
  description: 'Apresentação da empresa, produtos contratados e metodologia Sharp. Envio do questionário estratégico que baseará todo o projeto.',
  responsible: 'Ingrid (CS) & Raphael'
};

export const KICKOFF_INFO = {
  title: '2. KICK-OFF',
  shortTitle: 'Kick-off',
  subtitle: 'Plano Operacional, Marketing & Agendas para Ação',
  description: 'Apresentação do plano operacional (o que será feito, como será feito), plano de marketing e definição de agendas para ação.',
  responsible: 'Raphael (Estrategista Chefe)'
};

export interface ProductWorkflow {
  productId: string;
  productName: string;
  solutionId: SolutionId | string;
  responsibleLead: string;
  description: string;
  stages: ProductStageDefinition[];
}

export const PRODUCT_OBJECTIVES: Record<string, string> = {
  sharp_insights: 'Investigar o negócio e transformar dados, evidências e percepções em direcionamentos estratégicos.',
  sharp_brand: 'Definir a estratégia da marca e transformar essa estratégia em identidade verbal e visual.',
  sharp_presence: 'Construir e administrar uma presença digital coerente com o posicionamento da marca.',
  sharp_growth: 'Acompanhar a empresa estrategicamente, organizar prioridades e orientar o crescimento.'
};

const ensurePrerequisites = (stages: ProductStageDefinition[]): ProductStageDefinition[] => {
  return stages.map(stage => {
    const isCompleted = stage.status === 'completed';
    return {
      ...stage,
      onboarding: stage.onboarding || {
        completed: isCompleted,
        title: ONBOARDING_INFO.title,
        description: ONBOARDING_INFO.description,
        responsibleStaff: ONBOARDING_INFO.responsible
      },
      kickoff: stage.kickoff || {
        completed: isCompleted,
        title: KICKOFF_INFO.title,
        description: KICKOFF_INFO.description,
        responsibleStaff: KICKOFF_INFO.responsible
      }
    };
  });
};

const getRawDefaultStagesForSolution = (
  solutionId: string, 
  productName: string = '',
  companyName: string = 'Cliente'
): ProductStageDefinition[] => {
  const normSol = (solutionId || '').toLowerCase().replace(/[-\s]/g, '_');
  const normName = (productName || '').toLowerCase();

  // 1. SHARP INSIGHTS
  if (normSol === 'sharp_insights' || normName.includes('insights') || normName.includes('pesquisa')) {
    // If specific sub-package is requested:
    if (normName.includes('essential')) {
      return [
        {
          id: 'insights_essential_stage',
          order: 1,
          name: 'Sharp Insights Essential',
          description: 'Investigar o negócio e transformar dados, evidências e percepções em direcionamentos estratégicos.',
          responsibleStaff: 'Raphael (Estrategista Chefe)',
          requiresArt: false,
          status: 'in_progress',
          tasks: [
            { id: 't_ie_1', title: 'Análise do questionário', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_ie_2', title: 'Análise de presença digital', assignedTo: 'Cristiano (Growth)', completed: true },
            { id: 't_ie_3', title: 'Pesquisa básica de concorrentes', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_ie_4', title: 'Definição preliminar de público', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_ie_5', title: 'Análise SWOT', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_ie_6', title: 'Principais oportunidades', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_ie_7', title: 'Recomendações prioritárias', assignedTo: 'Raphael (Estrategista)', completed: false }
          ]
        }
      ];
    }

    if (normName.includes('market')) {
      return [
        {
          id: 'insights_market_stage',
          order: 1,
          name: 'Sharp Insights Market',
          description: 'Investigar o mercado profundo, concorrentes diretos/indiretos, personas e jornada de compra.',
          responsibleStaff: 'Raphael & Cristiano',
          requiresArt: false,
          status: 'in_progress',
          tasks: [
            { id: 't_im_1', title: 'Análise setorial', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_im_2', title: 'Concorrentes diretos e indiretos', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_im_3', title: 'Benchmarking', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_im_4', title: 'Entrevistas com clientes', assignedTo: 'Ingrid (CS)', completed: false },
            { id: 't_im_5', title: 'Análise de avaliações e comentários', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_im_6', title: 'Cliente oculto, quando aplicável', assignedTo: 'Equipe Sharp', completed: false },
            { id: 't_im_7', title: 'Segmentação de público', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_im_8', title: 'Personas', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_im_9', title: 'Jornada de compra', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_im_10', title: 'Oportunidades e ameaças', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_im_11', title: 'Recomendações estratégicas', assignedTo: 'Raphael (Estrategista)', completed: false }
          ]
        }
      ];
    }

    if (normName.includes('strategic')) {
      return [
        {
          id: 'insights_strategic_stage',
          order: 1,
          name: 'Sharp Insights Strategic',
          description: 'Diagnóstico 360°, proposta de valor, precificação, canais e plano estratégico preliminar.',
          responsibleStaff: 'Raphael (Estrategista Chefe)',
          requiresArt: false,
          status: 'in_progress',
          tasks: [
            { id: 't_is_1', title: 'Todos os itens anteriores (Pesquisa, Concorrência & Personas)', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_is_2', title: 'Análise de portfólio', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_is_3', title: 'Proposta de valor', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_is_4', title: 'Diferenciais competitivos', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_is_5', title: 'Análise de preços e ofertas', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_is_6', title: 'Análise de canais', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_is_7', title: 'Matriz de atratividade e capacidade', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_is_8', title: 'Cenários', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_is_9', title: 'Plano estratégico preliminar', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_is_10', title: 'Indicadores recomendados', assignedTo: 'Cristiano (Growth)', completed: false }
          ]
        }
      ];
    }

    // Default Sharp Insights: 3 Complete Stages (Essential, Market, Strategic)
    return [
      {
        id: 'insights_stage_1',
        order: 1,
        name: 'Sharp Insights Essential',
        description: 'Investigar o negócio e transformar dados, evidências e percepções em direcionamentos estratégicos.',
        responsibleStaff: 'Raphael (Estrategista Chefe)',
        requiresArt: false,
        status: 'completed',
        tasks: [
          { id: 't_ins_1', title: 'Análise do questionário', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_ins_2', title: 'Análise de presença digital', assignedTo: 'Cristiano (Growth)', completed: true },
          { id: 't_ins_3', title: 'Pesquisa básica de concorrentes', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_ins_4', title: 'Definição preliminar de público', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_ins_5', title: 'Análise SWOT', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_ins_6', title: 'Principais oportunidades', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_ins_7', title: 'Recomendações prioritárias', assignedTo: 'Raphael (Estrategista)', completed: true }
        ]
      },
      {
        id: 'insights_stage_2',
        order: 2,
        name: 'Sharp Insights Market',
        description: 'Mapeamento aprofundado do ecossistema de mercado, concorrência, clientes e personas.',
        responsibleStaff: 'Raphael & Cristiano',
        requiresArt: false,
        status: 'in_progress',
        tasks: [
          { id: 't_ins_8', title: 'Análise setorial', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_ins_9', title: 'Concorrentes diretos e indiretos', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_ins_10', title: 'Benchmarking', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_ins_11', title: 'Entrevistas com clientes', assignedTo: 'Ingrid (CS)', completed: false },
          { id: 't_ins_12', title: 'Análise de avaliações e comentários', assignedTo: 'Cristiano (Growth)', completed: false },
          { id: 't_ins_13', title: 'Cliente oculto, quando aplicável', assignedTo: 'Equipe Sharp', completed: false },
          { id: 't_ins_14', title: 'Segmentação de público', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_15', title: 'Personas', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_16', title: 'Jornada de compra', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_17', title: 'Oportunidades e ameaças', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_18', title: 'Recomendações estratégicas', assignedTo: 'Raphael (Estrategista)', completed: false }
        ]
      },
      {
        id: 'insights_stage_3',
        order: 3,
        name: 'Sharp Insights Strategic',
        description: 'Consolidação estratégica, posicionamento, proposta de valor, cenários e plano final de inteligência.',
        responsibleStaff: 'Raphael (Estrategista Chefe)',
        requiresArt: false,
        status: 'pending',
        tasks: [
          { id: 't_ins_19', title: 'Todos os itens anteriores', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_20', title: 'Análise de portfólio', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_21', title: 'Proposta de valor', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_22', title: 'Diferenciais competitivos', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_23', title: 'Análise de preços e ofertas', assignedTo: 'Cristiano (Growth)', completed: false },
          { id: 't_ins_24', title: 'Análise de canais', assignedTo: 'Cristiano (Growth)', completed: false },
          { id: 't_ins_25', title: 'Matriz de atratividade e capacidade', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_26', title: 'Cenários', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_27', title: 'Plano estratégico preliminar', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_ins_28', title: 'Indicadores recomendados', assignedTo: 'Cristiano (Growth)', completed: false }
        ]
      }
    ];
  }

  // 2. SHARP BRAND
  if (normSol === 'sharp_brand' || normName.includes('brand') || normName.includes('marca')) {
    if (normName.includes('essential')) {
      return [
        {
          id: 'brand_essential_stage',
          order: 1,
          name: 'Sharp Brand Essential',
          description: 'Definir a estratégia da marca e transformar essa estratégia em identidade verbal e visual.',
          responsibleStaff: 'Raphael & Kauã',
          requiresArt: true,
          isArtCreation: true,
          status: 'in_progress',
          tasks: [
            { id: 't_be_1', title: 'Briefing', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_be_2', title: 'Diagnóstico básico', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_be_3', title: 'Conceito da marca', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_be_4', title: 'Logotipo', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true },
            { id: 't_be_5', title: 'Paleta', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true },
            { id: 't_be_6', title: 'Tipografia', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true },
            { id: 't_be_7', title: 'Elementos gráficos', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true },
            { id: 't_be_8', title: 'Manual essencial', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true }
          ]
        }
      ];
    }

    if (normName.includes('strategy')) {
      return [
        {
          id: 'brand_strategy_stage',
          order: 1,
          name: 'Sharp Brand Strategy',
          description: 'Estratégia profunda, posicionamento, propósito, tom de voz e identidade visual completa com manual.',
          responsibleStaff: 'Raphael & Kauã',
          requiresArt: true,
          isArtCreation: true,
          status: 'in_progress',
          tasks: [
            { id: 't_bs_1', title: 'Pesquisa e diagnóstico', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_bs_2', title: 'Posicionamento', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_bs_3', title: 'Propósito', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_bs_4', title: 'Proposta de valor', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_bs_5', title: 'Personalidade', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_bs_6', title: 'Diferenciais', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_bs_7', title: 'Público', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_bs_8', title: 'Mensagem central', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_bs_9', title: 'Tom de voz', assignedTo: 'Raphael (Estrategista)', completed: false, isArtUpload: true },
            { id: 't_bs_10', title: 'Identidade visual completa', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true },
            { id: 't_bs_11', title: 'Manual de marca', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true }
          ]
        }
      ];
    }

    if (normName.includes('rebrand')) {
      return [
        {
          id: 'brand_rebrand_stage',
          order: 1,
          name: 'Sharp Brand Rebrand',
          description: 'Auditoria da marca atual, decisão evolução/ruptura, redesenho e plano de transição.',
          responsibleStaff: 'Raphael & Luan',
          requiresArt: true,
          isArtCreation: true,
          status: 'in_progress',
          tasks: [
            { id: 't_br_1', title: 'Auditoria da marca atual', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_br_2', title: 'Identificação de problemas', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_br_3', title: 'Decisão entre evolução ou ruptura', assignedTo: 'Raphael & Sócios', completed: false },
            { id: 't_br_4', title: 'Reposicionamento', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_br_5', title: 'Redesenho da identidade', assignedTo: 'Kauã & Luan (Design)', completed: false, isArtUpload: true },
            { id: 't_br_6', title: 'Plano de transição', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_br_7', title: 'Orientação para aplicação', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true }
          ]
        }
      ];
    }

    // Default Sharp Brand: 3 Complete Stages (Essential, Strategy, Rebrand)
    return [
      {
        id: 'brand_stage_1',
        order: 1,
        name: 'Sharp Brand Essential',
        description: 'Definir a estratégia da marca e transformar essa estratégia em identidade verbal e visual.',
        responsibleStaff: 'Raphael (Estratégia) & Kauã (Design)',
        requiresArt: true,
        isArtCreation: true,
        status: 'completed',
        tasks: [
          { id: 't_bra_1', title: 'Briefing', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_bra_2', title: 'Diagnóstico básico', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_bra_3', title: 'Conceito da marca', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_bra_4', title: 'Logotipo', assignedTo: 'Kauã (Designer)', completed: true, isArtUpload: true },
          { id: 't_bra_5', title: 'Paleta', assignedTo: 'Kauã (Designer)', completed: true, isArtUpload: true },
          { id: 't_bra_6', title: 'Tipografia', assignedTo: 'Kauã (Designer)', completed: true, isArtUpload: true },
          { id: 't_bra_7', title: 'Elementos gráficos', assignedTo: 'Kauã (Designer)', completed: true, isArtUpload: true },
          { id: 't_bra_8', title: 'Manual essencial', assignedTo: 'Kauã (Designer)', completed: true, isArtUpload: true }
        ]
      },
      {
        id: 'brand_stage_2',
        order: 2,
        name: 'Sharp Brand Strategy',
        description: 'Pesquisa, diagnóstico, posicionamento, propósito, diferenciais, mensagem, tom de voz e manual completo.',
        responsibleStaff: 'Raphael (Estrategista Chefe) & Luan',
        requiresArt: true,
        isArtCreation: true,
        status: 'in_progress',
        tasks: [
          { id: 't_bra_9', title: 'Pesquisa e diagnóstico', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_bra_10', title: 'Posicionamento', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_bra_11', title: 'Propósito', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_bra_12', title: 'Proposta de valor', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_bra_13', title: 'Personalidade', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_bra_14', title: 'Diferenciais', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_bra_15', title: 'Público', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_bra_16', title: 'Mensagem central', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_bra_17', title: 'Tom de voz', assignedTo: 'Raphael (Estrategista)', completed: false, isArtUpload: true },
          { id: 't_bra_18', title: 'Identidade visual completa', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true },
          { id: 't_bra_19', title: 'Manual de marca', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true }
        ]
      },
      {
        id: 'brand_stage_3',
        order: 3,
        name: 'Sharp Brand Rebrand',
        description: 'Auditoria de marca, diagnóstico de problemas, decisão evolução/ruptura, redesign e transição.',
        responsibleStaff: 'Raphael & Luan (Direção Criativa)',
        requiresArt: true,
        isArtCreation: true,
        status: 'pending',
        tasks: [
          { id: 't_bra_20', title: 'Auditoria da marca atual', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_bra_21', title: 'Identificação de problemas', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_bra_22', title: 'Decisão entre evolução ou ruptura', assignedTo: 'Raphael & Sócios', completed: false },
          { id: 't_bra_23', title: 'Reposicionamento', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_bra_24', title: 'Redesenho da identidade', assignedTo: 'Kauã & Luan (Design)', completed: false, isArtUpload: true },
          { id: 't_bra_25', title: 'Plano de transição', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_bra_26', title: 'Orientação para aplicação', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true }
        ]
      }
    ];
  }

  // 3. SHARP PRESENCE
  if (normSol === 'sharp_presence' || normName.includes('presence') || normName.includes('social') || normName.includes('conteúdo')) {
    if (normName.includes('content')) {
      return [
        {
          id: 'presence_content_stage',
          order: 1,
          name: 'Sharp Presence Content',
          description: 'Construir e administrar uma presença digital coerente com o posicionamento da marca.',
          responsibleStaff: 'Raphael & Kauã',
          requiresArt: true,
          isArtCreation: true,
          status: 'in_progress',
          tasks: [
            { id: 't_pc_1', title: 'Planejamento mensal', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_pc_2', title: 'Calendário editorial', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_pc_3', title: 'Criação de posts', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true },
            { id: 't_pc_4', title: 'Carrosséis', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true },
            { id: 't_pc_5', title: 'Stories', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true },
            { id: 't_pc_6', title: 'Copywriting', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_pc_7', title: 'Entrega das peças', assignedTo: 'Ingrid (CS)', completed: false }
          ]
        }
      ];
    }

    if (normName.includes('management')) {
      return [
        {
          id: 'presence_management_stage',
          order: 1,
          name: 'Sharp Presence Management',
          description: 'Gestão completa: estratégia de canais, publicação, agendamento, monitoramento, interação e relatório.',
          responsibleStaff: 'Ingrid & Equipe Sharp',
          requiresArt: true,
          isArtCreation: true,
          status: 'in_progress',
          tasks: [
            { id: 't_pm_1', title: 'Estratégia de canais', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_pm_2', title: 'Calendário', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_pm_3', title: 'Criação', assignedTo: 'Kauã (Designer)', completed: false, isArtUpload: true },
            { id: 't_pm_4', title: 'Copy', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_pm_5', title: 'Publicação', assignedTo: 'Ingrid (CS)', completed: false },
            { id: 't_pm_6', title: 'Agendamento', assignedTo: 'Ingrid (CS)', completed: false },
            { id: 't_pm_7', title: 'Monitoramento', assignedTo: 'Ingrid (CS)', completed: false },
            { id: 't_pm_8', title: 'Interação definida em contrato', assignedTo: 'Ingrid (CS)', completed: false },
            { id: 't_pm_9', title: 'Relatório mensal', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_pm_10', title: 'Reunião de acompanhamento', assignedTo: 'Raphael & Sócios', completed: false }
          ]
        }
      ];
    }

    if (normName.includes('authority')) {
      return [
        {
          id: 'presence_authority_stage',
          order: 1,
          name: 'Sharp Presence Authority',
          description: 'Construção de autoridade com temas proprietários, posicionamento de especialistas e campanhas de captação.',
          responsibleStaff: 'Raphael & Cristiano',
          requiresArt: true,
          isArtCreation: true,
          status: 'in_progress',
          tasks: [
            { id: 't_pa_1', title: 'Conteúdo estratégico', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_pa_2', title: 'Construção de autoridade', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_pa_3', title: 'Temas proprietários', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_pa_4', title: 'Posicionamento de especialistas', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_pa_5', title: 'Estudos, artigos ou conteúdos aprofundados', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_pa_6', title: 'Campanhas', assignedTo: 'Cristiano (Growth)', completed: false, isArtUpload: true },
            { id: 't_pa_7', title: 'Captação de leads', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_pa_8', title: 'Acompanhamento de indicadores', assignedTo: 'Cristiano (Growth)', completed: false }
          ]
        }
      ];
    }

    // Default Sharp Presence: 3 Complete Stages (Content, Management, Authority)
    return [
      {
        id: 'presence_stage_1',
        order: 1,
        name: 'Sharp Presence Content',
        description: 'Construir e administrar uma presença digital coerente com o posicionamento da marca.',
        responsibleStaff: 'Raphael (Estratégia) & Kauã (Criação)',
        requiresArt: true,
        isArtCreation: true,
        status: 'completed',
        tasks: [
          { id: 't_pre_1', title: 'Planejamento mensal', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_pre_2', title: 'Calendário editorial', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_pre_3', title: 'Criação de posts', assignedTo: 'Kauã (Designer)', completed: true, isArtUpload: true },
          { id: 't_pre_4', title: 'Carrosséis', assignedTo: 'Kauã (Designer)', completed: true, isArtUpload: true },
          { id: 't_pre_5', title: 'Stories', assignedTo: 'Kauã (Designer)', completed: true, isArtUpload: true },
          { id: 't_pre_6', title: 'Copywriting', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_pre_7', title: 'Entrega das peças', assignedTo: 'Ingrid (CS)', completed: true }
        ]
      },
      {
        id: 'presence_stage_2',
        order: 2,
        name: 'Sharp Presence Management',
        description: 'Operação de publicação, agendamento, monitoramento de interações e relatórios de acompanhamento.',
        responsibleStaff: 'Ingrid (CS) & Cristiano (Growth)',
        requiresArt: true,
        isArtCreation: true,
        status: 'in_progress',
        tasks: [
          { id: 't_pre_8', title: 'Estratégia de canais', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_pre_9', title: 'Calendário', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_pre_10', title: 'Criação', assignedTo: 'Kauã (Designer)', completed: true, isArtUpload: true },
          { id: 't_pre_11', title: 'Copy', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_pre_12', title: 'Publicação', assignedTo: 'Ingrid (CS)', completed: false },
          { id: 't_pre_13', title: 'Agendamento', assignedTo: 'Ingrid (CS)', completed: false },
          { id: 't_pre_14', title: 'Monitoramento', assignedTo: 'Ingrid (CS)', completed: false },
          { id: 't_pre_15', title: 'Interação definida em contrato', assignedTo: 'Ingrid (CS)', completed: false },
          { id: 't_pre_16', title: 'Relatório mensal', assignedTo: 'Cristiano (Growth)', completed: false },
          { id: 't_pre_17', title: 'Reunião de acompanhamento', assignedTo: 'Raphael & Sócios', completed: false }
        ]
      },
      {
        id: 'presence_stage_3',
        order: 3,
        name: 'Sharp Presence Authority',
        description: 'Posicionamento de autoridade, temas proprietários de especialistas, campanhas e captação de leads.',
        responsibleStaff: 'Raphael (Estrategista Chefe) & Cristiano',
        requiresArt: true,
        isArtCreation: true,
        status: 'pending',
        tasks: [
          { id: 't_pre_18', title: 'Conteúdo estratégico', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_pre_19', title: 'Construção de autoridade', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_pre_20', title: 'Temas proprietários', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_pre_21', title: 'Posicionamento de especialistas', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_pre_22', title: 'Estudos, artigos ou conteúdos aprofundados', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_pre_23', title: 'Campanhas', assignedTo: 'Cristiano (Growth)', completed: false, isArtUpload: true },
          { id: 't_pre_24', title: 'Captação de leads', assignedTo: 'Cristiano (Growth)', completed: false },
          { id: 't_pre_25', title: 'Acompanhamento de indicadores', assignedTo: 'Cristiano (Growth)', completed: false }
        ]
      }
    ];
  }

  // 4. SHARP GROWTH
  if (normSol === 'sharp_growth' || normName.includes('growth') || normName.includes('crescimento') || normName.includes('tráfego')) {
    if (normName.includes('advisory')) {
      return [
        {
          id: 'growth_advisory_stage',
          order: 1,
          name: 'Sharp Growth Advisory',
          description: 'Acompanhar a empresa estrategicamente, organizar prioridades e orientar o crescimento.',
          responsibleStaff: 'Raphael & Cristiano',
          requiresArt: false,
          status: 'in_progress',
          tasks: [
            { id: 't_ga_1', title: 'Reunião mensal', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_ga_2', title: 'Análise dos principais indicadores', assignedTo: 'Cristiano (Growth)', completed: true },
            { id: 't_ga_3', title: 'Diagnóstico de gargalos', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_ga_4', title: 'Recomendações', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_ga_5', title: 'Plano de ação', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_ga_6', title: 'Acompanhamento das ações', assignedTo: 'Ingrid (CS)', completed: false }
          ]
        }
      ];
    }

    if (normName.includes('management')) {
      return [
        {
          id: 'growth_management_stage',
          order: 1,
          name: 'Sharp Growth Management',
          description: 'Planejamento estratégico contínuo, reuniões quinzenais, acompanhamento comercial e de marketing.',
          responsibleStaff: 'Cristiano & Raphael',
          requiresArt: false,
          status: 'in_progress',
          tasks: [
            { id: 't_gm_1', title: 'Planejamento estratégico', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_gm_2', title: 'Indicadores', assignedTo: 'Cristiano (Growth)', completed: true },
            { id: 't_gm_3', title: 'Reuniões quinzenais', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_gm_4', title: 'Acompanhamento de projetos', assignedTo: 'Ingrid (CS)', completed: false },
            { id: 't_gm_5', title: 'Análise comercial e de marketing', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_gm_6', title: 'Melhoria de processos relacionados ao crescimento', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_gm_7', title: 'Revisão trimestral', assignedTo: 'Raphael & Sócios', completed: false }
          ]
        }
      ];
    }

    if (normName.includes('partner')) {
      return [
        {
          id: 'growth_partner_stage',
          order: 1,
          name: 'Sharp Growth Partner',
          description: 'Atuação consultiva contínua, reuniões semanais, desenvolvimento de experimentos e priorização de iniciativas.',
          responsibleStaff: 'Raphael & Cristiano (Partners)',
          requiresArt: false,
          status: 'in_progress',
          tasks: [
            { id: 't_gp_1', title: 'Atuação consultiva contínua', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_gp_2', title: 'Reuniões semanais ou quinzenais', assignedTo: 'Raphael (Estrategista)', completed: true },
            { id: 't_gp_3', title: 'Acompanhamento de marketing, comunicação e estratégia', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_gp_4', title: 'Participação em decisões', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_gp_5', title: 'Desenvolvimento de experimentos', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_gp_6', title: 'Análise de desempenho', assignedTo: 'Cristiano (Growth)', completed: false },
            { id: 't_gp_7', title: 'Priorização de iniciativas', assignedTo: 'Raphael (Estrategista)', completed: false },
            { id: 't_gp_8', title: 'Planejamento trimestral', assignedTo: 'Raphael & Sócios', completed: false }
          ]
        }
      ];
    }

    // Default Sharp Growth: 3 Complete Stages (Advisory, Management, Partner)
    return [
      {
        id: 'growth_stage_1',
        order: 1,
        name: 'Sharp Growth Advisory',
        description: 'Acompanhar a empresa estrategicamente, organizar prioridades e orientar o crescimento.',
        responsibleStaff: 'Raphael (Estrategista) & Cristiano',
        requiresArt: false,
        status: 'completed',
        tasks: [
          { id: 't_gro_1', title: 'Reunião mensal', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_gro_2', title: 'Análise dos principais indicadores', assignedTo: 'Cristiano (Growth)', completed: true },
          { id: 't_gro_3', title: 'Diagnóstico de gargalos', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_gro_4', title: 'Recomendações', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_gro_5', title: 'Plano de ação', assignedTo: 'Cristiano (Growth)', completed: true },
          { id: 't_gro_6', title: 'Acompanhamento das ações', assignedTo: 'Ingrid (CS)', completed: true }
        ]
      },
      {
        id: 'growth_stage_2',
        order: 2,
        name: 'Sharp Growth Management',
        description: 'Planejamento estratégico, indicadores, reuniões quinzenais, análise comercial/marketing e revisão trimestral.',
        responsibleStaff: 'Cristiano (Growth & Mídia) & Raphael',
        requiresArt: false,
        status: 'in_progress',
        tasks: [
          { id: 't_gro_7', title: 'Planejamento estratégico', assignedTo: 'Raphael (Estrategista)', completed: true },
          { id: 't_gro_8', title: 'Indicadores', assignedTo: 'Cristiano (Growth)', completed: true },
          { id: 't_gro_9', title: 'Reuniões quinzenais', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_gro_10', title: 'Acompanhamento de projetos', assignedTo: 'Ingrid (CS)', completed: false },
          { id: 't_gro_11', title: 'Análise comercial e de marketing', assignedTo: 'Cristiano (Growth)', completed: false },
          { id: 't_gro_12', title: 'Melhoria de processos relacionados ao crescimento', assignedTo: 'Cristiano (Growth)', completed: false },
          { id: 't_gro_13', title: 'Revisão trimestral', assignedTo: 'Raphael & Sócios', completed: false }
        ]
      },
      {
        id: 'growth_stage_3',
        order: 3,
        name: 'Sharp Growth Partner',
        description: 'Atuação consultiva contínua, acompanhamento de decisões, experimentos e priorização de iniciativas.',
        responsibleStaff: 'Raphael (Estrategista Chefe) & Cristiano',
        requiresArt: false,
        status: 'pending',
        tasks: [
          { id: 't_gro_14', title: 'Atuação consultiva contínua', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_gro_15', title: 'Reuniões semanais ou quinzenais', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_gro_16', title: 'Acompanhamento de marketing, comunicação e estratégia', assignedTo: 'Cristiano (Growth)', completed: false },
          { id: 't_gro_17', title: 'Participação em decisões', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_gro_18', title: 'Desenvolvimento de experimentos', assignedTo: 'Cristiano (Growth)', completed: false },
          { id: 't_gro_19', title: 'Análise de desempenho', assignedTo: 'Cristiano (Growth)', completed: false },
          { id: 't_gro_20', title: 'Priorização de iniciativas', assignedTo: 'Raphael (Estrategista)', completed: false },
          { id: 't_gro_21', title: 'Planejamento trimestral', assignedTo: 'Raphael & Sócios', completed: false }
        ]
      }
    ];
  }

  // Generic fallback
  return [
    {
      id: 'gen_stage_1',
      order: 1,
      name: '1. Diagnóstico & Planejamento',
      description: 'Alinhamento de escopo, briefing inicial e definição dos entregáveis contratados.',
      responsibleStaff: 'Raphael (Estrategista)',
      requiresArt: false,
      status: 'completed',
      tasks: [
        { id: 't_g_1', title: 'Briefing e alinhamento inicial', assignedTo: 'Raphael (Estrategista)', completed: true },
        { id: 't_g_2', title: 'Definição de cronograma e metas', assignedTo: 'Raphael (Estrategista)', completed: true }
      ]
    },
    {
      id: 'gen_stage_2',
      order: 2,
      name: '2. Execução & Produção',
      description: 'Desenvolvimento dos itens estratégicos e operacionais do produto contratado.',
      responsibleStaff: 'Equipe Técnica Sharp',
      requiresArt: false,
      status: 'in_progress',
      tasks: [
        { id: 't_g_3', title: 'Produção dos entregáveis estratégicos', assignedTo: 'Equipe Sharp', completed: false },
        { id: 't_g_4', title: 'Validação interna de qualidade', assignedTo: 'Luan & Raphael', completed: false }
      ]
    },
    {
      id: 'gen_stage_3',
      order: 3,
      name: '3. Apresentação & Entrega',
      description: 'Apresentação formal ao cliente e liberação dos materiais.',
      responsibleStaff: 'Ingrid (CS)',
      requiresArt: false,
      status: 'pending',
      tasks: [
        { id: 't_g_5', title: 'Apresentação dos resultados ao cliente', assignedTo: 'Raphael (Estrategista)', completed: false },
        { id: 't_g_6', title: 'Coleta de feedback e validação final', assignedTo: 'Ingrid (CS)', completed: false }
      ]
    }
  ];
};

export const GET_DEFAULT_STAGES_FOR_SOLUTION = (
  solutionId: string, 
  productName: string = '',
  companyName: string = 'Cliente'
): ProductStageDefinition[] => {
  const stages = getRawDefaultStagesForSolution(solutionId, productName, companyName);
  return ensurePrerequisites(stages);
};

