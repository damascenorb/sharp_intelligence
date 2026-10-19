import { ProjectSubProduct, SolutionId } from '../types';

export const DEFAULT_SOLUTION_SUBPRODUCTS: Record<string, Omit<ProjectSubProduct, 'id'>[]> = {
  sharp_brand: [
    {
      name: 'Conceito & Posicionamento Central',
      category: 'strategy',
      description: 'Definição do território da marca, proposta de valor e atributos de autoridade.',
      isArtDeliverable: false,
      stage: 'Alinhamento Estratégico',
      responsibleStaff: 'Raphael (Estrategista Chefe)',
      deliverablesCount: 1,
      approvedCount: 1,
      status: 'completed'
    },
    {
      name: 'Logotipo Vetorial & Símbolos Oficiais',
      category: 'art',
      description: 'Criação do símbolo, tipografia institucional e variações para fundos claros/escuros.',
      isArtDeliverable: true,
      stage: 'Criação & Vetorização',
      responsibleStaff: 'Luan (Líder de Arte)',
      deliverablesCount: 3,
      approvedCount: 2,
      status: 'in_review'
    },
    {
      name: 'Brandbook & Guia de Identidade Visual',
      category: 'art',
      description: 'Manual de aplicação com paleta de cores, tipografia, proibições e tom de voz.',
      isArtDeliverable: true,
      stage: 'Diagramação & Fechamento',
      responsibleStaff: 'Luan (Líder de Arte)',
      deliverablesCount: 1,
      approvedCount: 0,
      status: 'in_progress'
    },
    {
      name: 'Papelaria & Materiais Institucionais',
      category: 'art',
      description: 'Cartão de visitas, timbrados, crachás e templates para apresentações executivas.',
      isArtDeliverable: true,
      stage: 'Produção Gráfica',
      responsibleStaff: 'Luan (Líder de Arte)',
      deliverablesCount: 2,
      approvedCount: 1,
      status: 'in_progress'
    }
  ],
  sharp_presence: [
    {
      name: 'Planejamento Editorial & Pautas do Mês',
      category: 'copy',
      description: 'Calendário editorial, temas de autoridade e divisão de formatos para redes.',
      isArtDeliverable: false,
      stage: 'Estratégia Editorial',
      responsibleStaff: 'Raphael (Estrategista Chefe)',
      deliverablesCount: 1,
      approvedCount: 1,
      status: 'completed'
    },
    {
      name: 'Artes de Feed & Carrosséis Autoriais',
      category: 'art',
      description: 'Design visual de posts únicos e carrosséis com narrativa e design premium.',
      isArtDeliverable: true,
      stage: 'Criação Visual de Lote',
      responsibleStaff: 'Luan (Líder de Arte)',
      deliverablesCount: 4,
      approvedCount: 2,
      status: 'in_review'
    },
    {
      name: 'Stories Interativos & Enquetes de Engajamento',
      category: 'art',
      description: 'Sequências de stories focadas em retenção, bastidores e caixas de perguntas.',
      isArtDeliverable: true,
      stage: 'Produção Dinâmica',
      responsibleStaff: 'Luan (Líder de Arte)',
      deliverablesCount: 3,
      approvedCount: 3,
      status: 'completed'
    },
    {
      name: 'Roteiros de Reels & Edição de Vídeos Curtos',
      category: 'media',
      description: 'Roteirização com ganchos fortes e edição dinâmica com legendas animadas.',
      isArtDeliverable: true,
      stage: 'Edição & Finalização',
      responsibleStaff: 'Luan (Líder de Arte)',
      deliverablesCount: 2,
      approvedCount: 1,
      status: 'in_progress'
    }
  ],
  sharp_insights: [
    {
      name: 'Diagnóstico de Mercado & Auditoria de Presença',
      category: 'strategy',
      description: 'Auditoria de concorrentes, benchmarks e oportunidades do setor.',
      isArtDeliverable: false,
      stage: 'Pesquisa & Diagnóstico',
      responsibleStaff: 'Raphael (Estrategista Chefe)',
      deliverablesCount: 1,
      approvedCount: 1,
      status: 'completed'
    },
    {
      name: 'Matriz de Concorrência & Personas Validadas',
      category: 'strategy',
      description: 'Mapeamento de critérios de decisão e dores dos clientes prioritários.',
      isArtDeliverable: false,
      stage: 'Mapeamento Estratégico',
      responsibleStaff: 'Raphael (Estrategista Chefe)',
      deliverablesCount: 1,
      approvedCount: 1,
      status: 'completed'
    },
    {
      name: 'Painel Executivo de Direcionamento Estratégico',
      category: 'art',
      description: 'Apresentação executiva com recomendações prioritárias para C-Level.',
      isArtDeliverable: true,
      stage: 'Fechamento Executivo',
      responsibleStaff: 'Raphael (Estrategista Chefe)',
      deliverablesCount: 1,
      approvedCount: 0,
      status: 'in_review'
    }
  ],
  sharp_growth: [
    {
      name: 'Setup de Contas Meta Ads & Google Ads',
      category: 'tech',
      description: 'Configuração de Business Manager, tags de conversão e eventos no site.',
      isArtDeliverable: false,
      stage: 'Setup Técnico & Tracking',
      responsibleStaff: 'Cristiano (Growth & Mídia)',
      deliverablesCount: 1,
      approvedCount: 1,
      status: 'completed'
    },
    {
      name: 'Criativos de Anúncios & Banners de Alta Conversão',
      category: 'art',
      description: 'Variações estáticas e motion para testes A/B de tráfego pago.',
      isArtDeliverable: true,
      stage: 'Criação de Criativos de Tráfego',
      responsibleStaff: 'Luan (Líder de Arte)',
      deliverablesCount: 4,
      approvedCount: 2,
      status: 'in_review'
    },
    {
      name: 'Landing Page de Captura & Otimização de Conversão',
      category: 'art',
      description: 'Design e estruturação de página focada em conversão de leads qualificados.',
      isArtDeliverable: true,
      stage: 'Design & Copy de LP',
      responsibleStaff: 'Luan (Líder de Arte)',
      deliverablesCount: 1,
      approvedCount: 1,
      status: 'completed'
    },
    {
      name: 'Relatórios de Performance & Otimização de CAC/ROAS',
      category: 'media',
      description: 'Acompanhamento semanal de métricas, custo por lead e retorno sobre investimento.',
      isArtDeliverable: false,
      stage: 'Escala & Otimização Contínua',
      responsibleStaff: 'Cristiano (Growth & Mídia)',
      deliverablesCount: 2,
      approvedCount: 2,
      status: 'completed'
    }
  ]
};

export const generateDefaultSubProducts = (solutionId: string): ProjectSubProduct[] => {
  const defaults = DEFAULT_SOLUTION_SUBPRODUCTS[solutionId] || [
    {
      name: 'Entregáveis Principais do Pacote',
      category: 'art',
      description: 'Execução e entregas do serviço contratado.',
      isArtDeliverable: true,
      stage: 'Produção',
      responsibleStaff: 'Luan (Líder de Arte)',
      deliverablesCount: 1,
      approvedCount: 0,
      status: 'in_progress'
    }
  ];

  return defaults.map((item, idx) => ({
    ...item,
    id: `sub_${solutionId}_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 5)}`
  }));
};

export interface ProductColorTheme {
  name: string;
  solutionId: string;
  pillBg: string;
  pillText: string;
  pillBorder: string;
  dotColor: string;
  cardBorder: string;
  cardHoverBorder: string;
  cardBgLight: string;
  cardBorderAccent: string;
  badgeGradient: string;
  barColor: string;
  accentText: string;
  accentBg: string;
}

export const PRODUCT_COLOR_THEMES: Record<string, ProductColorTheme> = {
  sharp_brand: {
    name: 'Sharp Brand',
    solutionId: 'sharp_brand',
    pillBg: 'bg-amber-50',
    pillText: 'text-amber-800',
    pillBorder: 'border-amber-200',
    dotColor: 'bg-amber-500',
    cardBorder: 'border-amber-200/90',
    cardHoverBorder: 'hover:border-amber-400',
    cardBgLight: 'bg-amber-50/40',
    cardBorderAccent: 'border-amber-500',
    badgeGradient: 'from-amber-500 to-orange-600',
    barColor: 'bg-amber-500',
    accentText: 'text-amber-700',
    accentBg: 'bg-amber-500/10'
  },
  sharp_presence: {
    name: 'Sharp Presence',
    solutionId: 'sharp_presence',
    pillBg: 'bg-blue-50',
    pillText: 'text-blue-800',
    pillBorder: 'border-blue-200',
    dotColor: 'bg-blue-500',
    cardBorder: 'border-blue-200/90',
    cardHoverBorder: 'hover:border-blue-400',
    cardBgLight: 'bg-blue-50/40',
    cardBorderAccent: 'border-blue-500',
    badgeGradient: 'from-blue-600 to-cyan-600',
    barColor: 'bg-blue-600',
    accentText: 'text-blue-700',
    accentBg: 'bg-blue-500/10'
  },
  sharp_insights: {
    name: 'Sharp Insights',
    solutionId: 'sharp_insights',
    pillBg: 'bg-purple-50',
    pillText: 'text-purple-800',
    pillBorder: 'border-purple-200',
    dotColor: 'bg-purple-500',
    cardBorder: 'border-purple-200/90',
    cardHoverBorder: 'hover:border-purple-400',
    cardBgLight: 'bg-purple-50/40',
    cardBorderAccent: 'border-purple-500',
    badgeGradient: 'from-purple-600 to-indigo-600',
    barColor: 'bg-purple-600',
    accentText: 'text-purple-700',
    accentBg: 'bg-purple-500/10'
  },
  sharp_growth: {
    name: 'Sharp Growth',
    solutionId: 'sharp_growth',
    pillBg: 'bg-emerald-50',
    pillText: 'text-emerald-800',
    pillBorder: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    cardBorder: 'border-emerald-200/90',
    cardHoverBorder: 'hover:border-emerald-400',
    cardBgLight: 'bg-emerald-50/40',
    cardBorderAccent: 'border-emerald-500',
    badgeGradient: 'from-emerald-600 to-teal-600',
    barColor: 'bg-emerald-600',
    accentText: 'text-emerald-700',
    accentBg: 'bg-emerald-500/10'
  }
};

export const getProductColorTheme = (keyOrName?: string): ProductColorTheme => {
  if (!keyOrName) return PRODUCT_COLOR_THEMES.sharp_presence;
  const lower = keyOrName.toLowerCase().trim();

  if (lower.includes('brand') || lower === 'sharp_brand') {
    return PRODUCT_COLOR_THEMES.sharp_brand;
  }
  if (lower.includes('presence') || lower === 'sharp_presence' || lower.includes('social') || lower.includes('presença')) {
    return PRODUCT_COLOR_THEMES.sharp_presence;
  }
  if (lower.includes('insight') || lower === 'sharp_insights' || lower.includes('diagnóstico') || lower.includes('estratégia')) {
    return PRODUCT_COLOR_THEMES.sharp_insights;
  }
  if (lower.includes('growth') || lower === 'sharp_growth' || lower.includes('tráfego') || lower.includes('mídia') || lower.includes('ads')) {
    return PRODUCT_COLOR_THEMES.sharp_growth;
  }

  return {
    name: keyOrName,
    solutionId: 'custom',
    pillBg: 'bg-slate-100',
    pillText: 'text-slate-800',
    pillBorder: 'border-slate-300',
    dotColor: 'bg-slate-500',
    cardBorder: 'border-slate-200',
    cardHoverBorder: 'hover:border-slate-400',
    cardBgLight: 'bg-slate-50',
    cardBorderAccent: 'border-slate-400',
    badgeGradient: 'from-slate-700 to-slate-900',
    barColor: 'bg-slate-700',
    accentText: 'text-slate-700',
    accentBg: 'bg-slate-500/10'
  };
};
