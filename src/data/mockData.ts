import { SolutionOption, SubProductTier, Lead, Project, ScheduledMeeting, VisualInspiration, StaffMember, ClientAccount, ChatMessage } from '../types';

export interface SharpPillar {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  impactMetrics: string[];
  keyCapabilities: string[];
  mappedSolutions: string[];
}

export const SHARP_PILLARS: SharpPillar[] = [
  {
    id: 'sharp_insights',
    title: '01. Sharp Insights',
    subtitle: 'Compreender antes de decidir (Inteligência & Diagnóstico)',
    badge: 'Pilar 01 • Compreender',
    description: 'A Sharp pesquisa o negócio, os clientes, os concorrentes, o mercado e as oportunidades para gerar diagnósticos e direcionamento estratégico fundamentados.',
    impactMetrics: ['Diagnóstico e direcionamento estratégico', 'Mapeamento de concorrência e ICP', 'Eliminação do achismo nas decisões'],
    keyCapabilities: [
      'Análise setorial, concorrência e benchmarking',
      'Pesquisa primária e entrevistas de profundidade',
      'Análise SWOT, personas e jornada de compra',
      'Diagnóstico de posicionamento e oportunidades'
    ],
    mappedSolutions: ['sharp_insights']
  },
  {
    id: 'sharp_brand',
    title: '02. Sharp Brand',
    subtitle: 'Definir como a empresa deve ser percebida (Estratégia & Marca)',
    badge: 'Pilar 02 • Posicionar',
    description: 'Transformamos o diagnóstico em posicionamento, personalidade, proposta de valor, identidade verbal e identidade visual marcante.',
    impactMetrics: ['Marca clara, coerente e diferenciada', 'Percepção imediata de alto valor', 'Diferenciação competitiva sólida'],
    keyCapabilities: [
      'Posicionamento, propósito e proposta de valor',
      'Personalidade, mensagem central e tom de voz',
      'Identidade visual completa e autoral',
      'Manual de marca e pitch deck institucional'
    ],
    mappedSolutions: ['sharp_brand']
  },
  {
    id: 'sharp_presence',
    title: '03. Sharp Presence',
    subtitle: 'Transformar a estratégia em comunicação constante (Presença Digital)',
    badge: 'Pilar 03 • Comunicar',
    description: 'Planejamos e gerenciamos conteúdos, mensagens, campanhas e presença digital para construir autoridade contínua e atração de clientes.',
    impactMetrics: ['Presença reconhecível e consistente', 'Constância editorial com planejamento', 'Construção diária de autoridade'],
    keyCapabilities: [
      'Planejamento mensal e calendário editorial',
      'Copywriting estratégico e design visual autoral',
      'Gestão de canais, agendamento e publicação',
      'Análise de alcance, engajamento e relatórios'
    ],
    mappedSolutions: ['sharp_presence']
  },
  {
    id: 'sharp_growth',
    title: '04. Sharp Growth',
    subtitle: 'Medir, aprender e crescer (Acompanhamento & Escala)',
    badge: 'Pilar 04 • Medir e Crescer',
    description: 'Acompanhamos indicadores, identificamos gargalos, priorizamos ações e apoiamos decisões estratégicas para sustentar o crescimento.',
    impactMetrics: ['Evolução acompanhada por metas e KPIs', 'Diagnóstico e destravamento de gargalos', 'Acompanhamento consultivo periódico'],
    keyCapabilities: [
      'Acompanhamento de indicadores (KPIs e OKRs)',
      'Diagnóstico e solução de gargalos do negócio',
      'Matriz de priorização e planos de ação',
      'Reuniões de conselho e orientação estratégica'
    ],
    mappedSolutions: ['sharp_growth']
  }
];

export const SHARP_SOLUTIONS: SolutionOption[] = [
  {
    id: 'sharp_insights',
    name: 'Sharp Insights',
    tagline: 'Investigar o negócio e transformar dados em direcionamentos estratégicos',
    category: 'Inteligência de Mercado',
    description: 'Compreender antes de decidir. A Sharp pesquisa o negócio, os clientes, os concorrentes, o mercado e as oportunidades para substituir o achismo por diagnósticos precisos.',
    clientDesire: 'Quero compreender meu mercado, concorrência e tomar decisões com segurança.',
    deliverables: [
      'Diagnóstico de Mercado & Direcionamento Estratégico',
      'Benchmarking Competitivo (Análise de Concorrentes Diretos e Indiretos)',
      'Mapeamento de Público, Personas e Jornada de Compra',
      'Análise SWOT Comercial & Auditoria de Posicionamento',
      'Relatório de Oportunidades & Plano de Recomendações Prioritárias'
    ],
    recommendedFor: 'Empresas que precisam compreender o mercado, identificar oportunidades e fundamentar suas decisões estratégicas.'
  },
  {
    id: 'sharp_brand',
    name: 'Sharp Brand',
    tagline: 'Definir como a empresa deve ser percebida e construir sua identidade',
    category: 'Estratégia de Marca',
    description: 'Transformação da estratégia em posicionamento, propósito, personalidade, tom de voz, mensagem central e identidade visual autoral para criar uma marca marcante e respeitada.',
    clientDesire: 'Quero que minha empresa tenha uma marca clara, coerente, lembrada e preparada para crescer.',
    deliverables: [
      'Plataforma de Marca (Propósito, Visão, Valores & Posicionamento)',
      'Guia de Voz e Mensagem Central (Tom de Comunicação e Manifesto)',
      'Sistema Completo de Identidade Visual (Logotipo, Paleta, Tipografia e Elementos)',
      'Brandbook Executivo (Manual de Uso da Marca e Aplicações)',
      'Kit & Pitch Deck Comercial de Apresentação Institucional'
    ],
    recommendedFor: 'Empresas que querem transmitir profissionalismo, ser reconhecidas como referência e fortalecer sua presença no mercado.'
  },
  {
    id: 'sharp_presence',
    name: 'Sharp Presence',
    tagline: 'Construir e administrar uma presença digital coerente com a marca',
    category: 'Presença Digital',
    description: 'Transformar a estratégia em comunicação diária. Planejamento, copywriting, criação e gestão de conteúdos para manter sua marca ativa, atraente e com alta autoridade.',
    clientDesire: 'Quero que minha marca tenha uma presença digital frequente, profissional e reconhecível.',
    deliverables: [
      'Estratégia de Canais & Calendário Editorial Mensal',
      'Copywriting Persuasivo & Roteiros de Conteúdo Estratégico',
      'Design Visual Autoral para Redes Sociais e Mídias Digitais',
      'Gestão de Publicações, Agendamento e Monitoramento de Interações',
      'Relatórios Mensais de Performance & Reunião de Acompanhamento'
    ],
    recommendedFor: 'Empresas que buscam constância, comunicação alinhada à estratégia de marca e construção contínua de autoridade.'
  },
  {
    id: 'sharp_growth',
    name: 'Sharp Growth',
    tagline: 'Acompanhar a empresa estrategicamente, organizar prioridades e orientar o crescimento',
    category: 'Acompanhamento & Escala',
    description: 'Medir, aprender e crescer. Acompanhamento periódico de indicadores, identificação de gargalos e planos de ação para orientar a evolução contínua do negócio.',
    clientDesire: 'Quero monitorar meus resultados, resolver gargalos e crescer com metas e planejamento.',
    deliverables: [
      'Diagnóstico de Maturidade Empresarial e Comercial',
      'Painel de Indicadores de Desempenho (KPIs & OKRs)',
      'Matriz de Priorização de Iniciativas & Planos de Ação',
      'Análise e Solução de Gargalos Estratégicos',
      'Reuniões Periódicas de Conselho & Governança de Crescimento'
    ],
    recommendedFor: 'Empresas que desejam organizar suas prioridades, tomar decisões informadas e sustentar o crescimento.'
  }
];

export const SUB_PRODUCTS_TIERS: SubProductTier[] = [
  // ==================== 01. SHARP INSIGHTS ====================
  {
    id: 'insights_essential',
    productId: 'sharp_insights',
    name: 'Sharp Insights Essential',
    shortName: 'Essential',
    badge: 'Diagnóstico Inicial',
    description: 'Para pequenas empresas que precisam de um diagnóstico inicial seguro sobre sua situação e concorrência.',
    targetProfile: 'Pequenas empresas e negócios em fase inicial buscando clareza rápida.',
    features: [
      { name: 'Análise do questionário & briefing executivo', included: true },
      { name: 'Auditoria de presença digital nos canais sociais e web', included: true },
      { name: 'Pesquisa básica de concorrência direta (top 3 players)', included: true },
      { name: 'Definição preliminar do perfil de público-alvo', included: true },
      { name: 'Análise SWOT comercial (Forças, Fraquezas, Oportunidades, Ameaças)', included: true },
      { name: 'Recomendações estratégicas prioritárias', included: true },
      { name: 'Análise setorial profunda e tendências de mercado', included: false },
      { name: 'Entrevistas de profundidade com clientes e ex-clientes', included: false },
      { name: 'Análise de reputação, avaliações e comentários online', included: false },
      { name: 'Mapeamento detalhado de Personas e Jornada de Compra', included: false },
      { name: 'Análise de portfólio, margens e precificação competitiva', included: false },
      { name: 'Matriz de atratividade, capacidade e cenários futuros', included: false },
    ]
  },
  {
    id: 'insights_market',
    productId: 'sharp_insights',
    name: 'Sharp Insights Market',
    shortName: 'Market',
    badge: 'Mais Escolhido',
    popular: true,
    description: 'Para empresas que precisam compreender profundamente o mercado, concorrentes e público para tomar decisões.',
    targetProfile: 'Empresas consolidadas buscando diferenciação e inteligência competitiva.',
    features: [
      { name: 'Análise do questionário & briefing executivo', included: true },
      { name: 'Auditoria de presença digital nos canais sociais e web', included: true },
      { name: 'Pesquisa básica de concorrência direta (top 3 players)', included: true },
      { name: 'Definição preliminar do perfil de público-alvo', included: true },
      { name: 'Análise SWOT comercial (Forças, Fraquezas, Oportunidades, Ameaças)', included: true },
      { name: 'Recomendações estratégicas prioritárias', included: true },
      { name: 'Análise setorial profunda e tendências de mercado', included: true },
      { name: 'Benchmarking de concorrentes diretos e indiretos', included: true },
      { name: 'Análise de reputação, avaliações e comentários online', included: true },
      { name: 'Mapeamento detalhado de Personas e Jornada de Compra', included: true },
      { name: 'Análise de portfólio, margens e precificação competitiva', included: false },
      { name: 'Matriz de atratividade, capacidade e cenários futuros', included: false },
    ]
  },
  {
    id: 'insights_strategic',
    productId: 'sharp_insights',
    name: 'Sharp Insights Strategic',
    shortName: 'Strategic',
    badge: 'Conselho C-Level',
    description: 'Para decisões de posicionamento, expansão, novos produtos ou rodadas de investimento.',
    targetProfile: 'Médias empresas e lideranças em momento de transição ou expansão de mercado.',
    features: [
      { name: 'Análise do questionário & briefing executivo', included: true },
      { name: 'Auditoria de presença digital nos canais sociais e web', included: true },
      { name: 'Pesquisa básica de concorrência direta (top 3 players)', included: true },
      { name: 'Definição preliminar do perfil de público-alvo', included: true },
      { name: 'Análise SWOT comercial (Forças, Fraquezas, Oportunidades, Ameaças)', included: true },
      { name: 'Recomendações estratégicas prioritárias', included: true },
      { name: 'Análise setorial profunda e tendências de mercado', included: true },
      { name: 'Benchmarking de concorrentes diretos e indiretos', included: true },
      { name: 'Análise de reputação, avaliações e comentários online', included: true },
      { name: 'Mapeamento detalhado de Personas e Jornada de Compra', included: true },
      { name: 'Análise de portfólio, margens e precificação competitiva', included: true },
      { name: 'Matriz de atratividade, capacidade e cenários futuros', included: true },
    ]
  },

  // ==================== 02. SHARP BRAND ====================
  {
    id: 'brand_essential',
    productId: 'sharp_brand',
    name: 'Sharp Brand Essential',
    shortName: 'Essential',
    badge: 'Marca Inicial',
    description: 'Construção da identidade visual essencial para empresas que precisam de apresentação profissional imediata.',
    targetProfile: 'Novos negócios e profissionais liberais buscando uma marca autoral.',
    features: [
      { name: 'Briefing estratégico & diagnóstico de conceito', included: true },
      { name: 'Conceito central e símbolo da marca', included: true },
      { name: 'Logotipo autoral (versões principal e secundária)', included: true },
      { name: 'Paleta de cores institucional & Tipografia oficial', included: true },
      { name: 'Elementos gráficos auxiliares e padrões visuais', included: true },
      { name: 'Manual essencial de uso da marca (Brand Guide)', included: true },
      { name: 'Pesquisa de posicionamento & diagnóstico de percepção', included: false },
      { name: 'Propósito, Visão, Valores e Proposta de Valor', included: false },
      { name: 'Personalidade da marca, Tom de voz e Guia verbal', included: false },
      { name: 'Manifesto institucional e mensagem central', included: false },
      { name: 'Kit & Pitch Deck comercial de apresentação C-Level', included: false },
      { name: 'Auditoria de marca legada e plano de Rebrand com transição', included: false },
    ]
  },
  {
    id: 'brand_strategy',
    productId: 'sharp_brand',
    name: 'Sharp Brand Strategy',
    shortName: 'Strategy',
    badge: 'Mais Escolhido',
    popular: true,
    description: 'Plataforma estratégica completa de marca + Identidade Visual de alto padrão para liderar o segmento.',
    targetProfile: 'Empresas que desejam ser reconhecidas como autoridade e gerar valor percebido elevado.',
    features: [
      { name: 'Briefing estratégico & diagnóstico de conceito', included: true },
      { name: 'Conceito central e símbolo da marca', included: true },
      { name: 'Logotipo autoral (versões principal e secundária)', included: true },
      { name: 'Paleta de cores institucional & Tipografia oficial', included: true },
      { name: 'Elementos gráficos auxiliares e padrões visuais', included: true },
      { name: 'Manual essencial de uso da marca (Brand Guide)', included: true },
      { name: 'Pesquisa de posicionamento & diagnóstico de percepção', included: true },
      { name: 'Propósito, Visão, Valores e Proposta de Valor', included: true },
      { name: 'Personalidade da marca, Tom de voz e Guia verbal', included: true },
      { name: 'Manifesto institucional e mensagem central', included: true },
      { name: 'Kit & Pitch Deck comercial de apresentação C-Level', included: false },
      { name: 'Auditoria de marca legada e plano de Rebrand com transição', included: false },
    ]
  },
  {
    id: 'brand_rebrand',
    productId: 'sharp_brand',
    name: 'Sharp Rebrand',
    shortName: 'Rebrand',
    badge: 'Transformação Total',
    description: 'Para empresas consolidadas com marcas ultrapassadas ou que mudaram de patamar no mercado.',
    targetProfile: 'Empresas em reposicionamento, fusões ou reformulação completa de imagem.',
    features: [
      { name: 'Briefing estratégico & diagnóstico de conceito', included: true },
      { name: 'Conceito central e símbolo da marca', included: true },
      { name: 'Logotipo autoral (versões principal e secundária)', included: true },
      { name: 'Paleta de cores institucional & Tipografia oficial', included: true },
      { name: 'Elementos gráficos auxiliares e padrões visuais', included: true },
      { name: 'Manual essencial de uso da marca (Brand Guide)', included: true },
      { name: 'Pesquisa de posicionamento & diagnóstico de percepção', included: true },
      { name: 'Propósito, Visão, Valores e Proposta de Valor', included: true },
      { name: 'Personalidade da marca, Tom de voz e Guia verbal', included: true },
      { name: 'Manifesto institucional e mensagem central', included: true },
      { name: 'Kit & Pitch Deck comercial de apresentação C-Level', included: true },
      { name: 'Auditoria de marca legada e plano de Rebrand com transição', included: true },
    ]
  },

  // ==================== 03. SHARP PRESENCE ====================
  {
    id: 'presence_content',
    productId: 'sharp_presence',
    name: 'Sharp Presence Content',
    shortName: 'Content',
    badge: 'Produção Visual',
    description: 'Planejamento editorial, criação autoral de design e copywriting para empresas que já possuem equipe de publicação.',
    targetProfile: 'Empresas que necessitam de peças visuais de alto padrão e copys estratégicas.',
    features: [
      { name: 'Planejamento mensal estratégico de pautas', included: true },
      { name: 'Calendário editorial interativo', included: true },
      { name: 'Criação de posts, carrosséis e artes em alta resolução', included: true },
      { name: 'Copywriting persuasivo e focado em engajamento', included: true },
      { name: 'Roteiros institucionais para vídeos e stories', included: true },
      { name: 'Entrega organizada de arquivos finais', included: true },
      { name: 'Estratégia omnicanal de canais digitais', included: false },
      { name: 'Publicação e agendamento em redes sociais', included: false },
      { name: 'Monitoramento de interações e métricas', included: false },
      { name: 'Relatório mensal de desempenho e audiência', included: false },
      { name: 'Posicionamento de especialistas e executivos', included: false },
      { name: 'Campanhas de captação de leads qualificados', included: false },
    ]
  },
  {
    id: 'presence_management',
    productId: 'sharp_presence',
    name: 'Sharp Presence Management',
    shortName: 'Management',
    badge: 'Mais Escolhido',
    popular: true,
    description: 'Gestão 100% terceirizada de presença digital com planejamento, design, publicação e relatórios.',
    targetProfile: 'Empresas que buscam constância e terceirização completa da operação de redes sociais.',
    features: [
      { name: 'Planejamento mensal estratégico de pautas', included: true },
      { name: 'Calendário editorial interativo', included: true },
      { name: 'Criação de posts, carrosséis e artes em alta resolução', included: true },
      { name: 'Copywriting persuasivo e focado em engajamento', included: true },
      { name: 'Roteiros institucionais para vídeos e stories', included: true },
      { name: 'Entrega organizada de arquivos finais', included: true },
      { name: 'Estratégia omnicanal de canais digitais', included: true },
      { name: 'Publicação e agendamento em redes sociais', included: true },
      { name: 'Monitoramento de interações e métricas', included: true },
      { name: 'Relatório mensal de desempenho e audiência', included: true },
      { name: 'Posicionamento de especialistas e executivos', included: false },
      { name: 'Campanhas de captação de leads qualificados', included: false },
    ]
  },
  {
    id: 'presence_authority',
    productId: 'sharp_presence',
    name: 'Sharp Presence Authority',
    shortName: 'Authority',
    badge: 'Liderança Digital',
    description: 'Presença digital avançada com foco em autoridade C-Level, artigos, campanhas e conversão de novos clientes.',
    targetProfile: 'Marcas e executivos buscando liderar o diálogo setorial e atrair grandes contratos.',
    features: [
      { name: 'Planejamento mensal estratégico de pautas', included: true },
      { name: 'Calendário editorial interativo', included: true },
      { name: 'Criação de posts, carrosséis e artes em alta resolução', included: true },
      { name: 'Copywriting persuasivo e focado em engajamento', included: true },
      { name: 'Roteiros institucionais para vídeos e stories', included: true },
      { name: 'Entrega organizada de arquivos finais', included: true },
      { name: 'Estratégia omnicanal de canais digitais', included: true },
      { name: 'Publicação e agendamento em redes sociais', included: true },
      { name: 'Monitoramento de interações e métricas', included: true },
      { name: 'Relatório mensal de desempenho e audiência', included: true },
      { name: 'Posicionamento de especialistas e executivos', included: true },
      { name: 'Campanhas de captação de leads qualificados', included: true },
    ]
  },

  // ==================== 04. SHARP GROWTH ====================
  {
    id: 'growth_advisory',
    productId: 'sharp_growth',
    name: 'Sharp Growth Advisory',
    shortName: 'Advisory',
    badge: 'Conselho Mensal',
    description: 'Aconselhamento executivo mensal para analisar métricas, identificar gargalos e priorizar ações.',
    targetProfile: 'PMEs que precisam de direcionamento quinzenal/mensal de um consultor sênior.',
    features: [
      { name: 'Reunião mensal de conselho executivo', included: true },
      { name: 'Análise dos principais indicadores de desempenho', included: true },
      { name: 'Diagnóstico de gargalos operacionais e comerciais', included: true },
      { name: 'Recomendações e orientações estratégicas', included: true },
      { name: 'Plano de ação executivo para o período seguinte', included: true },
      { name: 'Acompanhamento do cumprimento das ações', included: true },
      { name: 'Planejamento estratégico de médio e longo prazo', included: false },
      { name: 'Painel estruturado de KPIs e OKRs de crescimento', included: false },
      { name: 'Reuniões quinzenais de governança e alinhamento', included: false },
      { name: 'Análise e otimização de processos de vendas', included: false },
      { name: 'Atuação consultiva contínua (side-by-side)', included: false },
      { name: 'Desenvolvimento e testes de experimentos de growth', included: false },
    ]
  },
  {
    id: 'growth_management',
    productId: 'sharp_growth',
    name: 'Sharp Growth Management',
    shortName: 'Management',
    badge: 'Mais Escolhido',
    popular: true,
    description: 'Planejamento estratégico, KPIs/OKRs e governança quinzenal para acelerar resultados organizadamente.',
    targetProfile: 'Empresas em fase de expansão buscando previsibilidade e rigor nos indicadores.',
    features: [
      { name: 'Reunião mensal de conselho executivo', included: true },
      { name: 'Análise dos principais indicadores de desempenho', included: true },
      { name: 'Diagnóstico de gargalos operacionais e comerciais', included: true },
      { name: 'Recomendações e orientações estratégicas', included: true },
      { name: 'Plano de ação executivo para o período seguinte', included: true },
      { name: 'Acompanhamento do cumprimento das ações', included: true },
      { name: 'Planejamento estratégico de médio e longo prazo', included: true },
      { name: 'Painel estruturado de KPIs e OKRs de crescimento', included: true },
      { name: 'Reuniões quinzenais de governança e alinhamento', included: true },
      { name: 'Análise e otimização de processos de vendas', included: true },
      { name: 'Atuação consultiva contínua (side-by-side)', included: false },
      { name: 'Desenvolvimento e testes de experimentos de growth', included: false },
    ]
  },
  {
    id: 'growth_partner',
    productId: 'sharp_growth',
    name: 'Sharp Growth Partner',
    shortName: 'Partner',
    badge: 'Parceiro Contínuo',
    description: 'Atuação consultiva contínua como braço de estratégia, marca e crescimento da empresa.',
    targetProfile: 'Empresas que desejam a Sharp presente no dia a dia da gestão e tomada de decisões.',
    features: [
      { name: 'Reunião mensal de conselho executivo', included: true },
      { name: 'Análise dos principais indicadores de desempenho', included: true },
      { name: 'Diagnóstico de gargalos operacionais e comerciais', included: true },
      { name: 'Recomendações e orientações estratégicas', included: true },
      { name: 'Plano de ação executivo para o período seguinte', included: true },
      { name: 'Acompanhamento do cumprimento das ações', included: true },
      { name: 'Planejamento estratégico de médio e longo prazo', included: true },
      { name: 'Painel estruturado de KPIs e OKRs de crescimento', included: true },
      { name: 'Reuniões quinzenais de governança e alinhamento', included: true },
      { name: 'Análise e otimização de processos de vendas', included: true },
      { name: 'Atuação consultiva contínua (side-by-side)', included: true },
      { name: 'Desenvolvimento e testes de experimentos de growth', included: true },
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Dra. Camila Vasconcelos',
    company: 'Lumina Odontologia Estética',
    email: 'camila@luminaodonto.com.br',
    phone: '(11) 98765-4321',
    segment: 'Saúde & Estética',
    selectedSolutions: ['sharp_brand', 'sharp_presence'],
    briefingData: {
      companyName: 'Lumina Odontologia Estética',
      segment: 'Odontologia de Alto Padrão',
      contactName: 'Camila Vasconcelos',
      email: 'camila@luminaodonto.com.br',
      phone: '(11) 98765-4321',
      websiteOrSocial: '@lumina.odonto',
      brandPersonality: 'Sophisticada, acolhedora, científica, inovadora',
      idealCustomer: 'Pacientes de 28-55 anos buscando alinhamento invisível e facetas de porcelana',
      topCompetitors: 'Atelier Oral, OdontoK, Instituto Sorriso',
      socialPlatforms: 'Instagram e TikTok',
      postingFrequency: 'Diária (5 a 7x por semana)',
      contentGoals: 'Gerar autoridade e captar avaliações particulares pelo Direct'
    },
    painAnalysis: {
      problema_central: 'Percepção de preço desalinhada com a alta qualidade dos tratamentos',
      diagnostico_preliminar: 'A marca atual não transmite o posicionamento de luxo e sofisticação necessário para atrair pacientes de alto ticket, dependendo excessivamente de indicações pontuais.',
      oportunidade_sugerida: 'Sharp Brand + Sharp Presence',
      grau_urgencia: 'Alto',
      plano_preliminar: [
        'Redesenho da identidade visual para alinhamento com estética de clínica boutique.',
        'Desenvolvimento de linha editorial de bastidores e transformação sem promessas sensacionalistas.',
        'Série de stories diários focados em quebrar objeções de valor e durabilidade dos tratamentos.'
      ]
    },
    stage: 'diagnostico_agendado',
    scheduledMeeting: {
      id: 'meet-1',
      clientName: 'Dra. Camila Vasconcelos',
      clientEmail: 'camila@luminaodonto.com.br',
      companyName: 'Lumina Odontologia Estética',
      date: '2026-08-03',
      timeSlot: '14:30',
      specialist: 'Raphael (Estrategista)',
      type: 'diagnostico_gratuito',
      status: 'scheduled'
    },
    createdAt: '2026-07-28T10:00:00Z'
  },
  {
    id: 'lead-2',
    name: 'Marcelo Ribeiro',
    company: 'Orquídea Gastronomia & Bistrô',
    email: 'marcelo@orquideabistro.com',
    phone: '(21) 99887-6655',
    segment: 'Gastronomia',
    selectedSolutions: ['sharp_presence', 'sharp_insights'],
    briefingData: {
      companyName: 'Orquídea Gastronomia & Bistrô',
      segment: 'Bistrô Contemporâneo',
      contactName: 'Marcelo Ribeiro',
      email: 'marcelo@orquideabistro.com',
      phone: '(21) 99887-6655',
      websiteOrSocial: '@orquideabistro',
      socialPlatforms: 'Instagram e Google Meu Negócio',
      postingFrequency: '4x por semana',
      contentGoals: 'Aumentar reservas nas noites de quinta e sexta-feira',
      keyMarketQuestions: 'Quais os pratos mais desejados do bairro e qual a faixa de preço da concorrência local?'
    },
    stage: 'novo_lead',
    createdAt: '2026-07-29T15:20:00Z'
  },
  {
    id: 'lead-3',
    name: 'Juliana Costa',
    company: 'Nexus Soluções Financeiras',
    email: 'juliana@nexusfinance.com.br',
    phone: '(31) 97112-2334',
    segment: 'Serviços Financeiros B2B',
    selectedSolutions: ['sharp_growth', 'sharp_brand'],
    stage: 'reuniao_fechamento',
    createdAt: '2026-07-25T09:00:00Z'
  }
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-lumina',
    leadId: 'lead-1',
    companyName: 'Lumina Odontologia Estética',
    clientName: 'Dra. Camila Vasconcelos',
    clientEmail: 'camila@luminaodonto.com.br',
    solutions: ['sharp_brand', 'sharp_presence'],
    stage: 'producao',
    assignedTeam: {
      designer: 'Luan (Líder de Arte)',
      strategist: 'Raphael (Estrategista)',
      commercial: 'Ingrid (Atendimento)'
    },
    onboardingChecklist: [
      { id: 'ob-1', label: 'Envio da logo e vetor da marca em alta resolução', completed: true },
      { id: 'ob-2', label: 'Preenchimento do Briefing Detalhado de Conteúdo', completed: true },
      { id: 'ob-3', label: 'Concessão de acesso de parceiro ao Meta Business Suite', completed: true },
      { id: 'ob-4', label: 'Envio de banco de fotos da clínica e equipe', completed: false }
    ],
    contentItems: [
      {
        id: 'c-1',
        projectId: 'proj-lumina',
        title: 'Carrossel: O Segredo da Durabilidade das Lentes de Porcelana',
        type: 'carousel',
        mediaUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
        copyText: '✨ Você sabe o que realmente garante um sorriso perfeito e natural por mais de 15 anos?\n\nNão é apenas o material — é o planejamento digital personalizado antes de dar qualquer passo.\n\nNo carrossel acima, explicamos em 4 etapas como a tecnologia Lumina preserva a estrutura natural do seu dente.\n\n👉 Arraste para o lado e comente "SORRISO" para agendar sua avaliação exclusiva no Direct.',
        status: 'ready_for_review',
        uploadedBy: 'Luan (Designer)',
        createdAt: '2026-07-30T08:00:00Z'
      },
      {
        id: 'c-2',
        projectId: 'proj-lumina',
        title: 'Story Interativo: Enquete de Mitos e Verdades sobre Clareamento',
        type: 'story',
        mediaUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
        copyText: 'Mito ou Verdade: Clareamento a laser sensibiliza os dentes permanentemente?\n\n[Caixa de Enquete: MITO x VERDADE]\n\nResposta no próximo card com explicação da Dra. Camila!',
        status: 'approved',
        uploadedBy: 'Raphael (Estrategista)',
        createdAt: '2026-07-29T11:30:00Z'
      },
      {
        id: 'c-3',
        projectId: 'proj-lumina',
        title: 'Post Estático: Manifesto de Marca Lumina - A Arte de Sorrir com Confiança',
        type: 'feed_post',
        mediaUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
        copyText: 'Um sorriso não é apenas estética. É a expressão mais pura da sua autoconfiança.\n\nNa Lumina, unimos a precisão da odontologia moderna com o olhar refinado de quem entende que cada detalhe facial é único.\n\nVenha viver a experiência de transformar seu sorriso em um ambiente boutique acolhedor no coração de Jardins.\n\n#LuminaOdonto #EsteticaDental #SorrisoBoutique #OdontologiaDePonta',
        status: 'adjustment_requested',
        clientFeedback: 'Por favor, ajustar o tom do azul do fundo para o tom mais pastel da nossa nova paleta e destacar a palavra Boutique em dourado.',
        uploadedBy: 'Luan (Designer)',
        createdAt: '2026-07-28T16:00:00Z'
      }
    ],
    createdAt: '2026-07-26T12:00:00Z'
  }
];

export const INITIAL_VISUAL_INSPIRATIONS: VisualInspiration[] = [];

export const INITIAL_MEETINGS: ScheduledMeeting[] = [
  {
    id: 'meet-1',
    leadId: 'lead-1',
    clientName: 'Dra. Camila Vasconcelos',
    clientEmail: 'camila@luminaodonto.com.br',
    companyName: 'Lumina Odontologia Estética',
    date: '2026-08-03',
    timeSlot: '14:30',
    specialist: 'Raphael (Estrategista)',
    type: 'diagnostico_gratuito',
    status: 'scheduled',
    notes: 'Apresentar análise preliminar de IA e proposta unificada Sharp Brand + Presence.'
  },
  {
    id: 'meet-weekly-1',
    clientName: 'Dra. Camila Vasconcelos',
    clientEmail: 'camila@luminaodonto.com.br',
    companyName: 'Lumina Odontologia Estética',
    date: '2026-08-07',
    timeSlot: '10:00',
    specialist: 'Luan & Raphael',
    type: 'semanal_feedback',
    status: 'scheduled',
    notes: 'Reunião semanal recorrente de alinhamento de posts e aprovação do calendário quinzenal.'
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-raphael',
    name: 'Raphael',
    username: 'raphael',
    password: '2026',
    role: 'Estrategista de Conteúdo & Growth',
    email: 'raphael@sharpintelligence.com.br',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'staff-luan',
    name: 'Luan',
    username: 'luan',
    password: '2026',
    role: 'Líder de Arte & Design',
    email: 'luan@sharpintelligence.com.br',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'staff-kaua',
    name: 'Kauã',
    username: 'kaua',
    password: '2026',
    role: 'Designer & Criação de Artes',
    email: 'kaua@sharpintelligence.com.br',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'staff-lucas',
    name: 'Lucas',
    username: 'lucas',
    password: '2026',
    role: 'Atendimento & Vendas',
    email: 'lucas@sharpintelligence.com.br',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'staff-cristiano',
    name: 'Cristiano',
    username: 'cristiano',
    password: '2026',
    role: 'Estrategista de Conteúdo & Growth',
    email: 'cristiano@sharpintelligence.com.br',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'staff-ingrid',
    name: 'Ingrid',
    username: 'ingrid',
    password: '2026',
    role: 'Comercial & Prospecção',
    email: 'ingrid@sharpintelligence.com.br',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_CLIENT_ACCOUNTS: ClientAccount[] = [
  {
    id: 'client-camila',
    companyName: 'Lumina Odontologia Estética',
    clientName: 'Dra. Camila Vasconcelos',
    email: 'camila@luminaodonto.com.br',
    username: 'camila',
    password: '2026',
    projectId: 'proj-lumina',
    createdAt: '2026-07-26T12:00:00Z'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'staff-raphael',
    senderName: 'Raphael',
    senderRole: 'sharp',
    channel: 'internal_team',
    content: 'Fala time! Alinhando as campanhas da Lumina Odontologia para a próxima quinzena. Luan, como estão as artes?',
    createdAt: '2026-07-30T09:00:00Z'
  },
  {
    id: 'msg-2',
    senderId: 'staff-luan',
    senderName: 'Luan',
    senderRole: 'sharp',
    channel: 'internal_team',
    content: 'Eae Raphael! As artes do Carrossel de Lentes de Contato Oral já estão finalizadas e subidas no portal de aprovação da Dra. Camila.',
    createdAt: '2026-07-30T09:05:00Z'
  },
  {
    id: 'msg-3',
    senderId: 'staff-cristiano',
    senderName: 'Cristiano',
    senderRole: 'sharp',
    channel: 'internal_team',
    content: 'Ótimo trabalho Luan! Já finalizei a copy com foco no desejo de harmonização do sorriso e aumento da autoestima.',
    createdAt: '2026-07-30T09:10:00Z'
  },
  {
    id: 'msg-4',
    senderId: 'staff-ingrid',
    senderName: 'Ingrid',
    senderRole: 'sharp',
    channel: 'internal_team',
    content: 'Show pessoal! Tivemos mais 2 novos leads qualificados no CRM que agendaram reunião de diagnóstico pra amanhã.',
    createdAt: '2026-07-30T09:15:00Z'
  },
  // Client Direct Chat Example
  {
    id: 'msg-client-1',
    senderId: 'staff-luan',
    senderName: 'Luan (Sharp)',
    senderRole: 'sharp',
    channel: 'client_direct',
    clientAccountId: 'client-camila',
    content: 'Olá Dra. Camila! Disponibilizamos o Carrossel do Tratamento de Lentes para sua aprovação no portal. Qual seu feedback?',
    fileAttachment: {
      name: 'Carrossel_Lentes_Lumina.png',
      url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
      type: 'art_approval',
      contentDeliverableId: 'del-1'
    },
    approvalStatus: 'pending',
    createdAt: '2026-07-30T09:20:00Z'
  },
  {
    id: 'msg-client-2',
    senderId: 'client-camila',
    senderName: 'Dra. Camila (Lumina)',
    senderRole: 'client',
    channel: 'client_direct',
    clientAccountId: 'client-camila',
    content: 'Olá Luan! A arte ficou linda demais! Aprovadíssima com a legenda. Podemos agendar nossa reunião semanal para sexta às 14h?',
    createdAt: '2026-07-30T09:25:00Z'
  }
];

