import { SolutionId } from '../types';

export interface ServicePackagePricing {
  id: string;
  pillarId: SolutionId;
  solutionId?: SolutionId;
  pillarName: string;
  name: string;
  tagline: string;
  model: 'pontual' | 'recorrente';
  billingType?: 'monthly' | 'one_time';
  hasMonthlyFee?: boolean;
  suggestedPrice: number;
  monthlyPrice?: number;
  firstMonthSetupPrice?: number;
  periodLabel: 'pontual' | '/mês';
  focus: string;
  includes: string[];
  badge?: string;
  popular?: boolean;
}

export const SHARP_OFFICIAL_PACKAGES: ServicePackagePricing[] = [
  // ==========================================
  // 01. SHARP INSIGHTS (Diagnóstico & Pesquisa)
  // ==========================================
  {
    id: 'insights_start',
    pillarId: 'sharp_insights',
    pillarName: 'Sharp Insights',
    name: 'Insights Start',
    tagline: 'Diagnóstico inicial e clareza rápida de cenário',
    model: 'pontual',
    hasMonthlyFee: false,
    suggestedPrice: 890,
    firstMonthSetupPrice: 890,
    monthlyPrice: 0,
    periodLabel: 'pontual',
    badge: 'Diagnóstico Inicial',
    focus: 'Diagnóstico inicial para empresas que precisam sair do achismo e entender o cenário básico.',
    includes: [
      'Questionário e briefing estruturado',
      'Auditoria de presença digital e canais',
      'Análise de concorrentes diretos (top 3 players)',
      'Mapa preliminar de oportunidades',
      'Relatório executivo com prioridades de ação'
    ]
  },
  {
    id: 'insights_market',
    pillarId: 'sharp_insights',
    pillarName: 'Sharp Insights',
    name: 'Insights Market',
    tagline: 'Pesquisa aprofundada de mercado, público e concorrência',
    model: 'pontual',
    hasMonthlyFee: false,
    suggestedPrice: 1790,
    firstMonthSetupPrice: 1790,
    monthlyPrice: 0,
    periodLabel: 'pontual',
    badge: 'Mais Escolhido',
    popular: true,
    focus: 'Pesquisa mais profunda para quem precisa entender mercado e público com mais segurança.',
    includes: [
      'Tudo do nível Insights Start',
      'Entrevistas qualitativas com clientes e leads',
      'Segmentação detalhada de público-alvo',
      'Benchmarking aprofundado de concorrentes diretos e indiretos',
      'Leitura comportamental e análise de reputação online'
    ]
  },
  {
    id: 'insights_strategic',
    pillarId: 'sharp_insights',
    pillarName: 'Sharp Insights',
    name: 'Insights Strategic',
    tagline: 'Diagnóstico avançado para posicionamento ou expansão',
    model: 'pontual',
    hasMonthlyFee: false,
    suggestedPrice: 3490,
    firstMonthSetupPrice: 3490,
    monthlyPrice: 0,
    periodLabel: 'pontual',
    badge: 'Conselho C-Level',
    focus: 'Diagnóstico avançado para decisões de posicionamento, reposicionamento ou expansão.',
    includes: [
      'Tudo do nível Insights Market',
      'Análise setorial ampliada e tendências de mercado',
      'Mapeamento completo de Personas e Jornada de Compra',
      'Hipóteses estratégicas de crescimento',
      'Plano de ação e recomendações prioritárias detalhadas'
    ]
  },

  // ==========================================
  // 02. SHARP BRAND (Estratégia & Identidade Visual)
  // ==========================================
  {
    id: 'brand_start',
    pillarId: 'sharp_brand',
    pillarName: 'Sharp Brand',
    name: 'Brand Start',
    tagline: 'Identidade essencial e apresentação profissional imediata',
    model: 'pontual',
    hasMonthlyFee: false,
    suggestedPrice: 1490,
    firstMonthSetupPrice: 1490,
    monthlyPrice: 0,
    periodLabel: 'pontual',
    badge: 'Identidade Essencial',
    focus: 'Identidade essencial para empresas que precisam de uma base visual profissional e rápida.',
    includes: [
      'Briefing estratégico e diagnóstico de conceito',
      'Conceito central e símbolo da marca',
      'Logotipo autoral (versões principal e secundária)',
      'Paleta de cores institucional e tipografia oficial',
      'Aplicações mínimas e guia essencial de uso'
    ]
  },
  {
    id: 'brand_strategy',
    pillarId: 'sharp_brand',
    pillarName: 'Sharp Brand',
    name: 'Brand Strategy',
    tagline: 'Plataforma completa de marca e posicionamento de autoridade',
    model: 'pontual',
    hasMonthlyFee: false,
    suggestedPrice: 2990,
    firstMonthSetupPrice: 2990,
    monthlyPrice: 0,
    periodLabel: 'pontual',
    badge: 'Mais Escolhido',
    popular: true,
    focus: 'Identidade com base estratégica mais forte, para marcas que querem clareza de posicionamento.',
    includes: [
      'Tudo do nível Brand Start',
      'Plataforma de marca (Propósito, Visão, Valores e Proposta de Valor)',
      'Manifesto de marca e tom de voz institucional',
      'Manual de identidade visual completo (Brandbook)',
      'Sistema visual avançado e elementos gráficos proprietários'
    ]
  },
  {
    id: 'brand_rebrand',
    pillarId: 'sharp_brand',
    pillarName: 'Sharp Brand',
    name: 'Brand Rebrand',
    tagline: 'Reposicionamento e reformulação completa de marca',
    model: 'pontual',
    hasMonthlyFee: false,
    suggestedPrice: 4900,
    firstMonthSetupPrice: 4900,
    monthlyPrice: 0,
    periodLabel: 'pontual',
    badge: 'Transformação Total',
    focus: 'Reposicionamento completo para marcas que já existem, mas não se comunicam bem ou precisam mudar de percepção.',
    includes: [
      'Auditoria profunda da marca atual e percepção legada',
      'Redefinição e arquitetura estratégica da nova marca',
      'Nova identidade visual autoral completa e desdobramentos',
      'Pitch deck institucional e kit de apresentação C-Level',
      'Plano estruturado de transição e lançamento da nova marca'
    ]
  },

  // ==========================================
  // 03. SHARP PRESENCE (Social Media & Gestão de Conteúdo - MENSALIDADE)
  // ==========================================
  {
    id: 'presence_start',
    pillarId: 'sharp_presence',
    pillarName: 'Sharp Presence',
    name: 'Presence Start',
    tagline: 'Consistência de conteúdo com design e copy profissional',
    model: 'recorrente',
    hasMonthlyFee: true,
    suggestedPrice: 990,
    firstMonthSetupPrice: 0,
    monthlyPrice: 990,
    periodLabel: '/mês',
    badge: 'Entrada Recorrente',
    focus: 'Pacote de entrada para quem precisa de consistência básica com cara profissional.',
    includes: [
      'Planejamento mensal de pautas e temas',
      'Criação de posts e stories em alta resolução',
      'Copywriting base focado em retenção',
      'Design visual autoral alinhado à marca',
      'Entrega organizada de arquivos para publicação'
    ]
  },
  {
    id: 'presence_strategic',
    pillarId: 'sharp_presence',
    pillarName: 'Sharp Presence',
    name: 'Presence Strategic',
    tagline: 'Planejamento editorial completo, métricas e objetivos claros',
    model: 'recorrente',
    hasMonthlyFee: true,
    suggestedPrice: 1790,
    firstMonthSetupPrice: 0,
    monthlyPrice: 1790,
    periodLabel: '/mês',
    badge: 'Mais Escolhido',
    popular: true,
    focus: 'Pacote para empresas que querem mais intenção, mais qualidade e análise mais clara.',
    includes: [
      'Tudo do nível Presence Start',
      'Calendário editorial interativo completo',
      'Alinhamento de conteúdos a objetivos de negócio e vendas',
      'Relatório mensal de métricas e performance de engajamento',
      'Reunião mensal de alinhamento e direcionamento'
    ]
  },
  {
    id: 'presence_authority',
    pillarId: 'sharp_presence',
    pillarName: 'Sharp Presence',
    name: 'Presence Authority',
    tagline: 'Construção de autoridade contínua, múltiplos formatos e C-Level',
    model: 'recorrente',
    hasMonthlyFee: true,
    suggestedPrice: 3490,
    firstMonthSetupPrice: 0,
    monthlyPrice: 3490,
    periodLabel: '/mês',
    badge: 'Autoridade & Escala',
    focus: 'Pacote para marcas que precisam construir autoridade com mais profundidade e continuidade.',
    includes: [
      'Tudo do nível Presence Strategic',
      'Conteúdo estratégico aprofundado e artigos de opinião',
      'Formatos variados: Carrosséis técnicos, vídeos e pautas autorais',
      'Posicionamento de porta-vozes e especialistas C-Level',
      'Reuniões quinzenais de acompanhamento e visão orientada a autoridade'
    ]
  },

  // ==========================================
  // 04. SHARP GROWTH (Consultoria & Acompanhamento Estratégico - MENSALIDADE)
  // ==========================================
  {
    id: 'growth_advisory',
    pillarId: 'sharp_growth',
    pillarName: 'Sharp Growth',
    name: 'Growth Advisory',
    tagline: 'Consultoria e direcionamento executivo periódico',
    model: 'recorrente',
    hasMonthlyFee: true,
    suggestedPrice: 1490,
    firstMonthSetupPrice: 0,
    monthlyPrice: 1490,
    periodLabel: '/mês',
    badge: 'Conselho Executivo',
    focus: 'Consultoria de entrada para empresas que precisam de direcionamento sem um contrato muito pesado.',
    includes: [
      'Reunião periódica de conselho executivo',
      'Leitura e análise dos principais indicadores de negócio',
      'Diagnóstico de gargalos comerciais e operacionais',
      'Recomendações e orientações estratégicas da Sharp',
      'Plano de ação prioritário para execução'
    ]
  },
  {
    id: 'growth_management',
    pillarId: 'sharp_growth',
    pillarName: 'Sharp Growth',
    name: 'Growth Management',
    tagline: 'Governança, metas e KPIs/OKRs estruturados com disciplina',
    model: 'recorrente',
    hasMonthlyFee: true,
    suggestedPrice: 2990,
    firstMonthSetupPrice: 0,
    monthlyPrice: 2990,
    periodLabel: '/mês',
    badge: 'Mais Escolhido',
    popular: true,
    focus: 'Acompanhamento mais consistente para quem precisa de governança e disciplina estratégica.',
    includes: [
      'Tudo do nível Growth Advisory',
      'Reuniões quinzenais de governança e alinhamento de metas',
      'Painel estruturado de KPIs e OKRs de crescimento',
      'Controle rigoroso de execução e planos de ação',
      'Matriz de priorização contínua de iniciativas'
    ]
  },
  {
    id: 'growth_partner',
    pillarId: 'sharp_growth',
    pillarName: 'Sharp Growth',
    name: 'Growth Partner',
    tagline: 'Parceria consultiva contínua no dia a dia executivo',
    model: 'recorrente',
    hasMonthlyFee: true,
    suggestedPrice: 5900,
    firstMonthSetupPrice: 0,
    monthlyPrice: 5900,
    periodLabel: '/mês',
    badge: 'Parceiro Estratégico',
    focus: 'Modelo de parceria para empresas que querem uma atuação estratégica contínua da Sharp.',
    includes: [
      'Tudo do nível Growth Management',
      'Atuação consultiva contínua (side-by-side com a liderança)',
      'Revisão recorrente e refinamento do modelo de negócio',
      'Desenvolvimento e testes de experimentos de crescimento',
      'Presença consultiva forte e suporte direto nas decisões estratégicas'
    ]
  }
];

// Helper: Formatter for BRL currency
export const formatBRL = (val?: number | string | null): string => {
  if (val === undefined || val === null || val === '') return 'R$ 0,00';
  const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, '')) : val;
  if (isNaN(num)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
};

// Helper: Get Package By ID
export const getPackageById = (packageId: string, customList?: ServicePackagePricing[]): ServicePackagePricing | undefined => {
  const list = customList || SHARP_OFFICIAL_PACKAGES;
  return list.find(p => p.id === packageId || p.name.toLowerCase() === packageId.toLowerCase());
};

// Helper: Get Packages For Solution
export const getPackagesForSolution = (solutionId: SolutionId | string, customList?: ServicePackagePricing[]): ServicePackagePricing[] => {
  const list = customList || SHARP_OFFICIAL_PACKAGES;
  return list.filter(p => p.pillarId === solutionId || p.solutionId === solutionId);
};

// Helper: Get Default Package for a Solution
export const getDefaultPackageForSolution = (solutionId: SolutionId | string, customList?: ServicePackagePricing[]): ServicePackagePricing => {
  const list = customList || SHARP_OFFICIAL_PACKAGES;
  switch (solutionId) {
    case 'sharp_insights':
      return list.find(p => p.id === 'insights_market') || list[0];
    case 'sharp_brand':
      return list.find(p => p.id === 'brand_strategy') || list.find(p => p.pillarId === 'sharp_brand') || list[0];
    case 'sharp_presence':
      return list.find(p => p.id === 'presence_strategic') || list.find(p => p.pillarId === 'sharp_presence') || list[0];
    case 'sharp_growth':
      return list.find(p => p.id === 'growth_management') || list.find(p => p.pillarId === 'sharp_growth') || list[0];
    default:
      return list[0];
  }
};

// Helper: Calculate Pre-stipulated (Tabela Oficial) values for any set of solutions or package IDs
export interface PreStipulatedCalculation {
  suggestedMonthlyFee: number;
  suggestedOneTimeContractValue: number;
  totalSuggestedValue: number;
  matchedPackages: ServicePackagePricing[];
}

export const calculatePreStipulatedValues = (
  solutions: (SolutionId | string)[] = [],
  contractedPackages: string[] = [],
  customList?: ServicePackagePricing[]
): PreStipulatedCalculation => {
  const list = customList || SHARP_OFFICIAL_PACKAGES;
  const matchedPackages: ServicePackagePricing[] = [];
  const handledPillars = new Set<string>();

  // 1. If explicit contractedPackages are present, match them
  if (contractedPackages && contractedPackages.length > 0) {
    contractedPackages.forEach(pkgIdOrName => {
      const found = list.find(
        p => p.id === pkgIdOrName || 
             p.name.toLowerCase() === pkgIdOrName.toLowerCase() ||
             pkgIdOrName.toLowerCase().includes(p.name.toLowerCase())
      );
      if (found && !matchedPackages.some(m => m.id === found.id)) {
        matchedPackages.push(found);
        handledPillars.add(found.pillarId);
      }
    });
  }

  // 2. For any solutionId not covered by explicit packages, pick default popular tier
  solutions.forEach(sol => {
    if (!handledPillars.has(sol)) {
      const defaultPkg = getDefaultPackageForSolution(sol, list);
      if (defaultPkg && !matchedPackages.some(m => m.id === defaultPkg.id)) {
        matchedPackages.push(defaultPkg);
        handledPillars.add(sol);
      }
    }
  });

  // Calculate totals
  let suggestedMonthlyFee = 0;
  let suggestedOneTimeContractValue = 0;

  matchedPackages.forEach(pkg => {
    const isMonthly = pkg.hasMonthlyFee ?? (pkg.model === 'recorrente' || pkg.billingType === 'monthly' || pkg.periodLabel === '/mês');
    const mPrice = pkg.monthlyPrice !== undefined ? pkg.monthlyPrice : (isMonthly ? pkg.suggestedPrice : 0);
    const pPrice = pkg.firstMonthSetupPrice !== undefined ? pkg.firstMonthSetupPrice : (!isMonthly ? pkg.suggestedPrice : 0);

    if (isMonthly) {
      suggestedMonthlyFee += mPrice;
      if (pPrice > 0) {
        suggestedOneTimeContractValue += pPrice;
      }
    } else {
      suggestedOneTimeContractValue += pPrice;
      if (mPrice > 0) {
        suggestedMonthlyFee += mPrice;
      }
    }
  });

  return {
    suggestedMonthlyFee,
    suggestedOneTimeContractValue,
    totalSuggestedValue: suggestedMonthlyFee + suggestedOneTimeContractValue,
    matchedPackages
  };
};
