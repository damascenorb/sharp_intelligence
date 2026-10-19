import { PillarId, MethodologyTask, ProductNoteLog, ProductPackage, StageDefinition, PillarDefinition, ClientProductEnrollment, UnifiedClient } from '../types';

export type { PillarId, MethodologyTask, ProductNoteLog, ProductPackage, StageDefinition, PillarDefinition, ClientProductEnrollment, UnifiedClient };

export const OPERATIONAL_STATUS_OPTIONS = [
  {
    id: 'Em Andamento Normal',
    label: 'Em Andamento Normal',
    emoji: '✅',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    selectedClass: 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/30'
  },
  {
    id: 'Atraso pelo Cliente',
    label: 'Atraso pelo Cliente',
    emoji: '⚠️',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
    selectedClass: 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-500/30'
  },
  {
    id: 'Aguardando Aprovação',
    label: 'Aguardando Aprovação',
    emoji: '⏳',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-300',
    selectedClass: 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/30'
  },
  {
    id: 'Pausado a Pedido do Cliente',
    label: 'Pausado a Pedido',
    emoji: '⏸️',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    selectedClass: 'bg-slate-700 text-white border-slate-800 shadow-xs ring-2 ring-slate-500/30'
  },
  {
    id: 'Em Ajustes / Refação',
    label: 'Em Ajustes / Refação',
    emoji: '🔄',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-300',
    selectedClass: 'bg-purple-600 text-white border-purple-600 shadow-xs ring-2 ring-purple-500/30'
  },
  {
    id: 'Atraso Interno / Operacional',
    label: 'Atraso Interno',
    emoji: '🚨',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
    selectedClass: 'bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-500/30'
  }
];

export const DEFAULT_STAFF_MEMBERS = [
  'Raphael (Estrategista Chefe)',
  'Luan (Líder de Arte & Design)',
  'Lucas (Atendimento & Vendas)',
  'Cristiano (Estrategista & Growth)',
  'Ingrid (Especialista em Marca)',
  'Ana (Growth & Conteúdo)',
  'Guilherme (Gestão & Performance)',
  'Time Sharp'
];

// Arquitetura dos 4 Pilares da Metodologia Sharp
export const SHARP_METHODOLOGY_PILLARS: PillarDefinition[] = [
  {
    id: 'sharp_insights',
    name: 'Sharp Insights',
    tagline: 'Compreender antes de decidir',
    question: 'Onde a empresa está e o que o mercado demonstra?',
    deliverableTitle: 'Diagnóstico e direcionamento estratégico',
    iconName: 'Compass',
    colorScheme: {
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      pill: 'bg-amber-50 text-amber-800 border-amber-200',
      border: 'border-amber-200',
      borderActive: 'border-amber-500 ring-2 ring-amber-500/20',
      bgLight: 'bg-amber-50/50',
      accentText: 'text-amber-700',
      accentBg: 'bg-amber-600',
      dot: 'bg-amber-500',
    },
    packages: [
      {
        id: 'insights_essential',
        name: 'Sharp Insights Essential',
        badge: 'Essential',
        description: 'Diagnóstico enxuto com análise de questionário, presença e concorrentes.',
        tasks: [
          'Análise detalhada do questionário de diagnóstico',
          'Análise da presença digital e pontos de contato',
          'Pesquisa básica de concorrentes diretos',
          'Definição preliminar do público-alvo',
          'Elaboração da análise SWOT (Forças, Fraquezas, Oportunidades e Ameaças)',
          'Identificação das principais oportunidades de curto prazo',
          'Elaboração das recomendações prioritárias de execução'
        ]
      },
      {
        id: 'insights_market',
        name: 'Sharp Insights Market',
        badge: 'Market',
        description: 'Pesquisa aprofundada de mercado, concorrentes diretos/indiretos, personas e jornada.',
        tasks: [
          'Análise setorial e dinâmica do segmento',
          'Mapeamento de concorrentes diretos e indiretos',
          'Benchmarking de referências e boas práticas',
          'Entrevistas estruturadas com clientes e decisores',
          'Análise de avaliações, comentários e reputação online',
          'Auditoria de cliente oculto (quando aplicável)',
          'Segmentação detalhada de público',
          'Construção e validação de personas',
          'Mapeamento da jornada de compra do cliente',
          'Matriz de oportunidades e ameaças de mercado',
          'Recomendações estratégicas consolidadas'
        ]
      },
      {
        id: 'insights_strategic',
        name: 'Sharp Insights Strategic',
        badge: 'Strategic',
        description: 'Dossiê completo com análise de portfólio, pricing, canais, cenários e metas.',
        tasks: [
          'Todos os entregáveis do pacote Market',
          'Análise e otimização do portfólio de produtos/serviços',
          'Estruturação da Proposta Única de Valor (UVP)',
          'Mapeamento dos diferenciais competitivos sustentáveis',
          'Análise de precificação, margem e modelos de oferta',
          'Análise de canais de aquisição e conversão',
          'Matriz de atratividade e capacidade operacional',
          'Desenho de cenários de crescimento',
          'Plano estratégico preliminar de posicionamento',
          'Definição de indicadores e métricas recomendadas'
        ]
      }
    ],
    stages: [
      {
        id: 'si_stage_1',
        title: '1. Preparação & Alinhamento',
        subtitle: 'Revisão de contrato, handoff e questionário',
        deliverable: 'Plano de Pesquisa Sharp',
        tasks: [
          'Leitura do contrato e escopo contratado',
          'Revisão do handoff comercial e expectativas',
          'Análise do questionário modular enviado pelo cliente',
          'Organização de lacunas de informação e dúvidas',
          'Definição de hipóteses e elaboração do plano de pesquisa'
        ]
      },
      {
        id: 'si_stage_2',
        title: '2. Pesquisa Secundária & Primária',
        subtitle: 'Coleta de evidências, concorrência e entrevistas',
        deliverable: 'Base de Evidências & Fontes',
        tasks: [
          'Análise de site, redes sociais e materiais atuais do cliente',
          'Mapeamento e auditoria de sites/redes dos concorrentes',
          'Exame de avaliações no Google, marketplaces e canais abertos',
          'Entrevistas estruturadas com sócios e lideranças',
          'Entrevistas com clientes e ex-clientes da empresa',
          'Aplicação de questionários e cliente oculto'
        ]
      },
      {
        id: 'si_stage_3',
        title: '3. Inteligência & Segmentação',
        subtitle: 'Matriz de concorrência, público e personas',
        deliverable: 'Matriz de Concorrência & Personas',
        tasks: [
          'Mapeamento de canais, preços, tom e diferenciais de cada concorrente',
          'Construção da Matriz de Concorrência oficial',
          'Segmentação por localização, comportamento, maturidade e ticket',
          'Construção de personas com dores, critérios, objeções e jornada'
        ]
      },
      {
        id: 'si_stage_4',
        title: '4. Diagnóstico & Revisão',
        subtitle: 'Separação de evidências e plano preliminar',
        deliverable: 'Documento de Diagnóstico Estratégico',
        tasks: [
          'Separação rigorosa entre evidências, percepções e hipóteses',
          'Priorização dos problemas e gargalos identificados',
          'Formulação das recomendações e plano preliminar',
          'Revisão interna de coerência e limitações metodológicas'
        ]
      },
      {
        id: 'si_stage_5',
        title: '5. Sharp Alignment & Aprovação',
        subtitle: 'Validação executiva com C-Level',
        deliverable: 'Termo de Direcionamento Aprovado',
        tasks: [
          'Apresentação executiva de evidências e divergências',
          'Discussão de implicações comerciais e de marca',
          'Priorização conjunta de decisões estratégicas',
          'Aprovação formal do Termo de Direcionamento Estratégico'
        ]
      }
    ]
  },
  {
    id: 'sharp_brand',
    name: 'Sharp Brand',
    tagline: 'Definir como a empresa deve ser percebida',
    question: 'Qual espaço a marca deve ocupar na mente do público?',
    deliverableTitle: 'Uma marca clara, coerente e diferenciada',
    iconName: 'Sparkles',
    colorScheme: {
      badge: 'bg-purple-100 text-purple-900 border-purple-300',
      pill: 'bg-purple-50 text-purple-800 border-purple-200',
      border: 'border-purple-200',
      borderActive: 'border-purple-500 ring-2 ring-purple-500/20',
      bgLight: 'bg-purple-50/50',
      accentText: 'text-purple-700',
      accentBg: 'bg-purple-600',
      dot: 'bg-purple-500',
    },
    packages: [
      {
        id: 'brand_essential',
        name: 'Sharp Brand Essential',
        badge: 'Essential',
        description: 'Identidade visual enxuta: conceito, logo, cores, tipografia e manual essencial.',
        tasks: [
          'Briefing e alinhamento inicial de identidade',
          'Diagnóstico básico de percepção e contexto',
          'Criação do conceito central da marca',
          'Desenvolvimento do logotipo oficial e variações',
          'Definição da paleta de cores primária e secundária',
          'Seleção da tipografia institucional (títulos e corpo)',
          'Desenvolvimento de elementos gráficos e padrões de apoio',
          'Elaboração do manual essencial de aplicação'
        ]
      },
      {
        id: 'brand_strategy',
        name: 'Sharp Brand Strategy',
        badge: 'Strategy',
        description: 'Estratégia completa de marca: propósito, posicionamento, tom de voz, identidade e manual.',
        tasks: [
          'Pesquisa aprofundada e diagnóstico de marca',
          'Definição de posicionamento e território competitivo',
          'Estruturação de propósito, visão e valores inegociáveis',
          'Formulação da proposta única de valor e diferenciais',
          'Definição da personalidade da marca e atributos centrais',
          'Mapeamento detalhado do público e mensagens por segmento',
          'Criação da mensagem central e slogan institucional',
          'Definição do tom de voz, manifesto e guia de vocabulário',
          'Desenvolvimento do sistema de identidade visual completo',
          'Elaboração do Brandbook oficial e manual completo'
        ]
      },
      {
        id: 'brand_rebrand',
        name: 'Sharp Brand Rebrand',
        badge: 'Rebrand',
        description: 'Redesenho e reposicionamento de marcas existentes com plano de transição seguro.',
        tasks: [
          'Auditoria completa da marca atual e ativos existentes',
          'Identificação de problemas de percepção, legibilidade ou desgaste',
          'Decisão técnica entre evolução suave ou ruptura de marca',
          'Novo reposicionamento estratégico de mercado',
          'Redesenho completo da identidade visual e verbal',
          'Elaboração do plano de transição de marca',
          'Orientações e cronograma de aplicação nos pontos de contato'
        ]
      }
    ],
    stages: [
      {
        id: 'sb_stage_1',
        title: '1. Descoberta (Discovery)',
        subtitle: 'Auditoria de marca, materiais e referências',
        deliverable: 'Dossiê Brand Discovery',
        tasks: [
          'Revisão do diagnóstico de inteligência',
          'Entrevista com fundadores e líderes',
          'Auditoria de marca e coleta de materiais existentes',
          'Análise de aplicações e restrições técnicas'
        ]
      },
      {
        id: 'sb_stage_2',
        title: '2. Estratégia de Marca',
        subtitle: 'Propósito, posicionamento e promessa',
        deliverable: 'Plataforma de Marca',
        tasks: [
          'Definição de propósito, visão e valores',
          'Definição de posicionamento, essência e atributos',
          'Estruturação da promessa e razões para acreditar (RTBs)'
        ]
      },
      {
        id: 'sb_stage_3',
        title: '3. Identidade Verbal',
        subtitle: 'Mensagem central, tom de voz e manifesto',
        deliverable: 'Guia de Voz & Mensagem',
        tasks: [
          'Criação da mensagem central e slogan',
          'Definição do tom de voz e vocabulário preferido/evitado',
          'Redação do manifesto institucional e mensagens por público'
        ]
      },
      {
        id: 'sb_stage_4',
        title: '4. Direção Criativa',
        subtitle: 'Territórios visuais e conceitos',
        deliverable: 'Direção Criativa Aprovada',
        tasks: [
          'Desenvolvimento de territórios visuais e referências',
          'Exploração de paleta de cores e tipografias potenciais',
          'Aprovação formal da direção estratégica com o cliente'
        ]
      },
      {
        id: 'sb_stage_5',
        title: '5. Desenvolvimento Visual',
        subtitle: 'Logo, símbolo, padrões e tipografia',
        deliverable: 'Sistema Visual Desenvolvido',
        tasks: [
          'Desenvolvimento do logotipo oficial e variações',
          'Criação do símbolo, paleta e tipografia',
          'Criação de elementos gráficos, ícones e estilo fotográfico'
        ]
      },
      {
        id: 'sb_stage_6',
        title: '6. Testes & Consistência',
        subtitle: 'Redução, contraste, avatar e impressão',
        deliverable: 'Checklist de Testes Aprovado',
        tasks: [
          'Teste de redução, legibilidade e contraste',
          'Teste em fundos escuros/claros e avatar de redes',
          'Validação técnica de impressão e suporte digital'
        ]
      },
      {
        id: 'sb_stage_7',
        title: '7. Apresentação & Feedback',
        subtitle: 'Defesa estratégica da narrativa',
        deliverable: 'Registro de Validação',
        tasks: [
          'Apresentação da narrativa: problema → estratégia → conceito → visual',
          'Coleta de feedback orientada por critérios objetivos'
        ]
      },
      {
        id: 'sb_stage_8',
        title: '8. Manual & Brandbook',
        subtitle: 'Regras de aplicação e arquivos finais',
        deliverable: 'Brandbook Oficial & Vetores',
        tasks: [
          'Documentação de regras, grid, proteção e usos incorretos',
          'Exportação de pacotes de arquivos em alta resolução e vetores'
        ]
      },
      {
        id: 'sb_stage_9',
        title: '9. Implantação nos Canais',
        subtitle: 'Aplicação em redes, site e papelaria',
        deliverable: 'Plano de Implantação Concluído',
        tasks: [
          'Aplicação em redes sociais, site e apresentações',
          'Aplicação em papelaria, fachada, uniformes ou embalagens',
          'Cronograma de substituição dos materiais legados'
        ]
      }
    ]
  },
  {
    id: 'sharp_presence',
    name: 'Sharp Presence',
    tagline: 'Transformar a estratégia em comunicação constante',
    question: 'Como a marca deve aparecer, comunicar e construir autoridade?',
    deliverableTitle: 'Uma presença reconhecível e consistente',
    iconName: 'Target',
    colorScheme: {
      badge: 'bg-cyan-100 text-cyan-900 border-cyan-300',
      pill: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      border: 'border-cyan-200',
      borderActive: 'border-cyan-500 ring-2 ring-cyan-500/20',
      bgLight: 'bg-cyan-50/50',
      accentText: 'text-cyan-700',
      accentBg: 'bg-cyan-600',
      dot: 'bg-cyan-500',
    },
    packages: [
      {
        id: 'presence_content',
        name: 'Sharp Presence Content',
        badge: 'Content',
        description: 'Planejamento editorial mensal, criação de posts, carrosséis, stories e copy.',
        tasks: [
          'Planejamento editorial mensal alinhado ao posicionamento',
          'Estruturação do calendário editorial com datas e temas',
          'Criação de posts estáticos no feed',
          'Criação de carrosséis educativos e de autoridade',
          'Desenvolvimento de stories estratégicos e interativos',
          'Redação de copywriting persuasivo com CTAs claros',
          'Revisão e entrega dos pacotes de peças prontas'
        ]
      },
      {
        id: 'presence_management',
        name: 'Sharp Presence Management',
        badge: 'Management',
        description: 'Gestão completa: estratégia de canais, publicação, agendamento, monitoramento e relatórios.',
        tasks: [
          'Definição da estratégia e tom específico por canal',
          'Calendário editorial mensal e gestão de aprovações',
          'Criação de arte visual e redação publicitária',
          'Publicação e agendamento dos conteúdos em ferramentas',
          'Monitoramento de comentários, mensagens e interações',
          'Elaboração de relatório mensal de métricas e alcance',
          'Reunião mensal de acompanhamento e alinhamento de pautas'
        ]
      },
      {
        id: 'presence_authority',
        name: 'Sharp Presence Authority',
        badge: 'Authority',
        description: 'Construção de autoridade executiva, temas proprietários, artigos e captação de leads.',
        tasks: [
          'Estratégia de conteúdo aprofundado para líderes e especialistas',
          'Construção de narrativas e temas proprietários da empresa',
          'Posicionamento de porta-vozes e diretoria no mercado',
          'Produção de estudos, artigos e whitepapers setoriais',
          'Planejamento de campanhas especiais e captação de leads',
          'Acompanhamento contínuo de conversão e indicadores de autoridade'
        ]
      }
    ],
    stages: [
      {
        id: 'sp_stage_1',
        title: '1. Auditoria Digital',
        subtitle: 'Análise de canais, perfil e taxas',
        deliverable: 'Relatório de Auditoria Digital',
        tasks: [
          'Auditoria de biografia, perfil, identidade e links',
          'Análise de frequência, formatos atuais e taxas de engajamento',
          'Mapeamento dos pontos de atrito no atendimento online'
        ]
      },
      {
        id: 'sp_stage_2',
        title: '2. Estratégia de Presença',
        subtitle: 'Pilares de conteúdo e diretrizes',
        deliverable: 'Matriz de Pilares & Canais',
        tasks: [
          'Definição de objetivos claros por canal de atuação',
          'Estruturação dos pilares de conteúdo (autoridade, educação, prova, produto, conversão)',
          'Definição de tom, frequência e indicadores de sucesso'
        ]
      },
      {
        id: 'sp_stage_3',
        title: '3. Planejamento Editorial',
        subtitle: 'Grade mensal com temas e CTAs',
        deliverable: 'Calendário Editorial do Mês',
        tasks: [
          'Estruturação da grade de publicações do mês',
          'Definição de temas, formatos, conceitos visuais e chamadas para ação'
        ]
      },
      {
        id: 'sp_stage_4',
        title: '4. Produção (Copy & Design)',
        subtitle: 'Redação, arte, revisão e aprovação',
        deliverable: 'Lote de Peças Finalizadas',
        tasks: [
          'Redação de copies e roteiros de conteúdo',
          'Criação do design visual das peças e carrosséis',
          'Revisão estratégica interna e revisão textual rigorosa',
          'Aprovação das peças pelo cliente e ajustes solicitados'
        ]
      },
      {
        id: 'sp_stage_5',
        title: '5. Publicação & Agendamento',
        subtitle: 'Verificação de links e postagem',
        deliverable: 'Cronograma Agendado',
        tasks: [
          'Verificação técnica de formatos e resoluções',
          'Revisão de legendas, links na bio e marcações',
          'Agendamento nas plataformas oficiais'
        ]
      },
      {
        id: 'sp_stage_6',
        title: '6. Monitoramento & Métricas',
        subtitle: 'Alcance, engajamento e leads',
        deliverable: 'Dashboard de Indicadores',
        tasks: [
          'Acompanhamento de impressões, engajamento e salvamentos',
          'Registro de mensagens recebidas e leads gerados'
        ]
      },
      {
        id: 'sp_stage_7',
        title: '7. Relatório & Otimização',
        subtitle: 'Análise de performance e melhorias',
        deliverable: 'Relatório Executivo Mensal',
        tasks: [
          'Apresentação de resultados e comparativos de período',
          'Análise dos melhores e piores conteúdos',
          'Definição de hipóteses e ajustes para o próximo ciclo'
        ]
      }
    ]
  },
  {
    id: 'sharp_growth',
    name: 'Sharp Growth',
    tagline: 'Medir, aprender e crescer',
    question: 'O que precisa ser melhorado para sustentar o crescimento?',
    deliverableTitle: 'Evolução acompanhada por metas, indicadores e planos de ação',
    iconName: 'TrendingUp',
    colorScheme: {
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      pill: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      border: 'border-emerald-200',
      borderActive: 'border-emerald-500 ring-2 ring-emerald-500/20',
      bgLight: 'bg-emerald-50/50',
      accentText: 'text-emerald-700',
      accentBg: 'bg-emerald-600',
      dot: 'bg-emerald-500',
    },
    packages: [
      {
        id: 'growth_advisory',
        name: 'Sharp Growth Advisory',
        badge: 'Advisory',
        description: 'Reunião mensal, análise de indicadores centrais, diagnóstico de gargalos e plano de ação.',
        tasks: [
          'Reunião executiva mensal com sócios e diretores',
          'Análise detalhada dos principais indicadores de vendas e margem',
          'Diagnóstico contínuo de gargalos operacionais e comerciais',
          'Elaboração de recomendações estratégicas práticas',
          'Construção e revisão do plano de ação priorizado',
          'Acompanhamento rigoroso da execução das tarefas'
        ]
      },
      {
        id: 'growth_management',
        name: 'Sharp Growth Management',
        badge: 'Management',
        description: 'Planejamento estratégico, reuniões quinzenais, análise de projetos e revisão trimestral.',
        tasks: [
          'Estruturação do planejamento estratégico de médio prazo',
          'Definição e acompanhamento de indicadores-chave (KPIs/OKRs)',
          'Reuniões quinzenais de governança e alinhamento',
          'Acompanhamento do progresso dos projetos em andamento',
          'Análise integrada de desempenho comercial e marketing',
          'Melhoria contínua de processos ligados à expansão',
          'Revisão trimestral profunda de resultados e metas'
        ]
      },
      {
        id: 'growth_partner',
        name: 'Sharp Growth Partner',
        badge: 'Partner',
        description: 'Atuação consultiva contínua, reuniões semanais/quinzenais, experimentos e decisões.',
        tasks: [
          'Atuação consultiva contínua com presença estratégica',
          'Reuniões semanais ou quinzenais de acompanhamento',
          'Gestão integrada de marketing, comunicação e crescimento',
          'Participação direta nas decisões executivas do negócio',
          'Desenvolvimento e validação de experimentos de produto/venda',
          'Análise aprofundada de desempenho financeiro e CAC/LTV',
          'Priorização contínua de iniciativas de alto retorno'
        ]
      }
    ],
    stages: [
      {
        id: 'sg_stage_1',
        title: '1. Diagnóstico de Maturidade',
        subtitle: 'Avaliação em 10 dimensões de gestão',
        deliverable: 'Matriz de Maturidade Sharp',
        tasks: [
          'Avaliação em 10 dimensões: estratégia, marca, marketing, comercial, cliente, produtos, canais, processos, pessoas e dados',
          'Classificação na escala de maturidade (1. inexistente a 5. otimizado)'
        ]
      },
      {
        id: 'sg_stage_2',
        title: '2. Definição de Metas & KPIs',
        subtitle: 'Linhas de base, metas e prazos',
        deliverable: 'Mapa de Objetivos e Indicadores',
        tasks: [
          'Definição de resultados esperados e metas quantitativas',
          'Estabelecimento de linhas de base, prazos e responsáveis'
        ]
      },
      {
        id: 'sg_stage_3',
        title: '3. Identificação de Gargalos',
        subtitle: 'Mapeamento de perdas e causas-raiz',
        deliverable: 'Mapa de Gargalos & Fricções',
        tasks: [
          'Identificação de gargalos (leads, posicionamento, conversão, pós-venda)',
          'Mapeamento de causas-raiz de ineficiência'
        ]
      },
      {
        id: 'sg_stage_4',
        title: '4. Priorização Estratégica',
        subtitle: 'Matriz impacto, esforço e risco',
        deliverable: 'Matriz de Priorização Executiva',
        tasks: [
          'Avaliação por impacto, esforço, custo, urgência e risco',
          'Seleção das iniciativas prioritárias para o ciclo'
        ]
      },
      {
        id: 'sg_stage_5',
        title: '5. Plano de Ação',
        subtitle: 'Cronograma com responsáveis e marcos',
        deliverable: 'Plano de Ação Operacional',
        tasks: [
          'Detalhamento de hipótese, atividades, responsável e prazo',
          'Definição dos critérios de conclusão para cada entrega'
        ]
      },
      {
        id: 'sg_stage_6',
        title: '6. Execução & Governança',
        subtitle: 'Remoção de bloqueios e atas periódicas',
        deliverable: 'Painel de Acompanhamento & Atas',
        tasks: [
          'Acompanhamento contínuo das ações em andamento',
          'Remoção de impedimentos e bloqueios operacionais',
          'Registro de atas de reuniões e decisões'
        ]
      },
      {
        id: 'sg_stage_7',
        title: '7. Experimentos & Testes',
        subtitle: 'Validação rápida de hipóteses',
        deliverable: 'Registro de Experimentos & ROI',
        tasks: [
          'Execução de testes rápidos de mercado ou comunicação',
          'Registro de hipótese, métrica, resultado e decisão'
        ]
      },
      {
        id: 'sg_stage_8',
        title: '8. Relatório Executivo',
        subtitle: 'Consolidação de ROI e novo ciclo',
        deliverable: 'Relatório Executivo Trimestral',
        tasks: [
          'Consolidação de progresso, ROI gerado e gargalos superados',
          'Apresentação executiva e planejamento do próximo ciclo trimestral'
        ]
      }
    ]
  }
];

export const INITIAL_UNIFIED_CLIENTS: UnifiedClient[] = [
  {
    id: 'cli-1',
    name: 'Dra. Camila Vasconcelos',
    clientName: 'Dra. Camila Vasconcelos',
    companyName: 'Lumina Odontologia Estética',
    segment: 'Saúde & Odontologia High-Ticket',
    phone: '(19) 9 9568-2110',
    email: 'camila@luminaodonto.com.br',
    contractedProducts: ['Sharp Brand Strategy', 'Sharp Insights Market', 'Sharp Presence Management'],
    nextMeetingDate: '24/08/2026 às 15:00',
    meetingTopic: 'Apresentação da Identidade Visual & Brandbook',
    approvedMaterials: 12,
    rejectedMaterials: 0,
    pendingMaterials: 2,
    sharpNotes: 'Cliente com alto padrão de exigência estética e sofisticação. Foco em odontologia estética e alinhadores invisíveis.',
    status: 'Ativo',
    createdAt: '2026-07-10',
    enrolledProducts: [
      {
        id: 'enr-1-brand',
        pillarId: 'sharp_brand',
        packageId: 'brand_strategy',
        packageName: 'Sharp Brand Strategy',
        currentStageId: 'sb_stage_5',
        startDate: '2026-07-12',
        responsibleStaff: 'Luan (Líder de Arte & Design)',
        statusReason: 'Em Andamento Normal',
        notes: 'Direção criativa aprovada pela Dra. Camila. Criando o sistema visual e variações de logotipo.',
        noteLogs: [
          {
            id: 'log-101',
            author: 'Luan (Líder de Arte & Design)',
            date: '28/07/2026',
            time: '16:45',
            text: 'Direção criativa aprovada formalmente pela Dra. Camila. Iniciado o desdobramento do logotipo oficial.'
          },
          {
            id: 'log-102',
            author: 'Raphael (Estrategista Chefe)',
            date: '18/07/2026',
            time: '10:30',
            text: 'Validação dos pilares de propósito, tom de voz e diferenciais concluída em reunião executiva.'
          }
        ],
        tasks: [
          { id: 't-1', text: 'Revisão do diagnóstico de inteligência', completed: true, completedAt: '2026-07-14', completedBy: 'Raphael' },
          { id: 't-2', text: 'Entrevista com fundadores e líderes', completed: true, completedAt: '2026-07-15', completedBy: 'Raphael' },
          { id: 't-3', text: 'Auditoria de marca e materiais existentes', completed: true, completedAt: '2026-07-16', completedBy: 'Luan' },
          { id: 't-4', text: 'Análise de aplicações e restrições técnicas', completed: true, completedAt: '2026-07-17', completedBy: 'Luan' },
          { id: 't-5', text: 'Definição de propósito, visão e valores', completed: true, completedAt: '2026-07-18', completedBy: 'Raphael' },
          { id: 't-6', text: 'Definição de posicionamento, essência e atributos', completed: true, completedAt: '2026-07-19', completedBy: 'Raphael' },
          { id: 't-7', text: 'Estruturação da promessa e razões para acreditar (RTBs)', completed: true, completedAt: '2026-07-20', completedBy: 'Raphael' },
          { id: 't-8', text: 'Criação da mensagem central e slogan', completed: true, completedAt: '2026-07-21', completedBy: 'Raphael' },
          { id: 't-9', text: 'Definição do tom de voz e vocabulário preferido/evitado', completed: true, completedAt: '2026-07-22', completedBy: 'Raphael' },
          { id: 't-10', text: 'Redação do manifesto institucional e mensagens por público', completed: true, completedAt: '2026-07-23', completedBy: 'Raphael' },
          { id: 't-11', text: 'Desenvolvimento de territórios visuais e referências', completed: true, completedAt: '2026-07-25', completedBy: 'Luan' },
          { id: 't-12', text: 'Exploração de paleta de cores e tipografias potenciais', completed: true, completedAt: '2026-07-26', completedBy: 'Luan' },
          { id: 't-13', text: 'Aprovação formal da direção estratégica com o cliente', completed: true, completedAt: '2026-07-28', completedBy: 'Luan' },
          { id: 't-14', text: 'Desenvolvimento do logotipo oficial e variações', completed: false },
          { id: 't-15', text: 'Criação do símbolo, paleta e tipografia', completed: false },
          { id: 't-16', text: 'Criação de elementos gráficos, ícones e estilo fotográfico', completed: false },
          { id: 't-17', text: 'Teste de redução, legibilidade e contraste', completed: false },
          { id: 't-18', text: 'Teste em fundos escuros/claros e avatar de redes', completed: false },
          { id: 't-19', text: 'Validação técnica de impressão e suporte digital', completed: false },
          { id: 't-20', text: 'Apresentação da narrativa: problema → estratégia → conceito → visual', completed: false },
          { id: 't-21', text: 'Coleta de feedback orientada por critérios objetivos', completed: false },
          { id: 't-22', text: 'Documentação de regras, grid, proteção e usos incorretos', completed: false },
          { id: 't-23', text: 'Exportação de pacotes de arquivos em alta resolução e vetores', completed: false },
          { id: 't-24', text: 'Aplicação em redes sociais, site e apresentações', completed: false },
          { id: 't-25', text: 'Aplicação em papelaria, fachada, uniformes ou embalagens', completed: false },
          { id: 't-26', text: 'Cronograma de substituição dos materiais legados', completed: false }
        ]
      },
      {
        id: 'enr-1-insights',
        pillarId: 'sharp_insights',
        packageId: 'insights_market',
        packageName: 'Sharp Insights Market',
        currentStageId: 'si_stage_5',
        startDate: '2026-07-10',
        responsibleStaff: 'Raphael (Estrategista Chefe)',
        statusReason: 'Em Andamento Normal',
        notes: 'Dossiê de inteligência e pesquisa setorial entregue e aprovado.',
        noteLogs: [
          {
            id: 'log-103',
            author: 'Raphael (Estrategista Chefe)',
            date: '15/07/2026',
            time: '14:20',
            text: 'Termo de Direcionamento Estratégico assinado e validado pela diretoria clínica.'
          }
        ],
        tasks: [
          { id: 'ti-1', text: 'Leitura do contrato e escopo contratado', completed: true, completedAt: '2026-07-10', completedBy: 'Raphael' },
          { id: 'ti-2', text: 'Revisão do handoff comercial e expectativas', completed: true, completedAt: '2026-07-10', completedBy: 'Lucas' },
          { id: 'ti-3', text: 'Análise do questionário modular enviado pelo cliente', completed: true, completedAt: '2026-07-11', completedBy: 'Raphael' },
          { id: 'ti-4', text: 'Organização de lacunas de informação e dúvidas', completed: true, completedAt: '2026-07-11', completedBy: 'Raphael' },
          { id: 'ti-5', text: 'Definição de hipóteses e elaboração do plano de pesquisa', completed: true, completedAt: '2026-07-12', completedBy: 'Raphael' },
          { id: 'ti-6', text: 'Análise de site, redes sociais e materiais atuais do cliente', completed: true, completedAt: '2026-07-12', completedBy: 'Luan' },
          { id: 'ti-7', text: 'Mapeamento e auditoria de sites/redes dos concorrentes', completed: true, completedAt: '2026-07-13', completedBy: 'Raphael' },
          { id: 'ti-8', text: 'Exame de avaliações no Google, marketplaces e canais abertos', completed: true, completedAt: '2026-07-13', completedBy: 'Raphael' },
          { id: 'ti-9', text: 'Entrevistas estruturadas com sócios e lideranças', completed: true, completedAt: '2026-07-14', completedBy: 'Raphael' },
          { id: 'ti-10', text: 'Entrevistas com clientes e ex-clientes da empresa', completed: true, completedAt: '2026-07-14', completedBy: 'Raphael' },
          { id: 'ti-11', text: 'Aplicação de questionários e cliente oculto', completed: true, completedAt: '2026-07-14', completedBy: 'Raphael' },
          { id: 'ti-12', text: 'Mapeamento de canais, preços, tom e diferenciais de cada concorrente', completed: true, completedAt: '2026-07-15', completedBy: 'Raphael' },
          { id: 'ti-13', text: 'Construção da Matriz de Concorrência oficial', completed: true, completedAt: '2026-07-15', completedBy: 'Raphael' },
          { id: 'ti-14', text: 'Segmentação por localização, comportamento, maturidade e ticket', completed: true, completedAt: '2026-07-15', completedBy: 'Raphael' },
          { id: 'ti-15', text: 'Construção de personas com dores, critérios, objeções e jornada', completed: true, completedAt: '2026-07-15', completedBy: 'Raphael' },
          { id: 'ti-16', text: 'Separação rigorosa entre evidências, percepções e hipóteses', completed: true, completedAt: '2026-07-16', completedBy: 'Raphael' },
          { id: 'ti-17', text: 'Priorização dos problemas e gargalos identificados', completed: true, completedAt: '2026-07-16', completedBy: 'Raphael' },
          { id: 'ti-18', text: 'Formulação das recomendações e plano preliminar', completed: true, completedAt: '2026-07-16', completedBy: 'Raphael' },
          { id: 'ti-19', text: 'Revisão interna de coerência e limitações metodológicas', completed: true, completedAt: '2026-07-16', completedBy: 'Raphael' },
          { id: 'ti-20', text: 'Apresentação executiva de evidências e divergências', completed: true, completedAt: '2026-07-17', completedBy: 'Raphael' },
          { id: 'ti-21', text: 'Discussão de implicações comerciais e de marca', completed: true, completedAt: '2026-07-17', completedBy: 'Raphael' },
          { id: 'ti-22', text: 'Priorização conjunta de decisões estratégicas', completed: true, completedAt: '2026-07-17', completedBy: 'Raphael' },
          { id: 'ti-23', text: 'Aprovação formal do Termo de Direcionamento Estratégico', completed: true, completedAt: '2026-07-17', completedBy: 'Raphael' }
        ]
      },
      {
        id: 'enr-1-presence',
        pillarId: 'sharp_presence',
        packageId: 'presence_management',
        packageName: 'Sharp Presence Management',
        currentStageId: 'sp_stage_1',
        startDate: '2026-07-19',
        responsibleStaff: 'Ana (Growth & Conteúdo)',
        statusReason: 'Aguardando Aprovação',
        notes: 'Início da auditoria dos canais sociais agendado para o kickoff da nova marca.',
        noteLogs: [
          {
            id: 'log-104',
            author: 'Ana (Growth & Conteúdo)',
            date: '19/07/2026',
            time: '11:15',
            text: 'Auditoria preliminar dos canais do Instagram e Google Meu Negócio iniciada.'
          }
        ],
        tasks: [
          { id: 'tp-1', text: 'Auditoria de biografia, perfil, identidade e links', completed: false },
          { id: 'tp-2', text: 'Análise de frequência, formatos atuais e taxas de engajamento', completed: false },
          { id: 'tp-3', text: 'Mapeamento dos pontos de atrito no atendimento online', completed: false }
        ]
      }
    ]
  }
];

export const STORAGE_KEY_UNIFIED_CLIENTS = 'sharp_clients_directory_unified';

export function getUnifiedClients(): UnifiedClient[] {
  if (typeof window === 'undefined') return INITIAL_UNIFIED_CLIENTS;
  
  const isCleared = localStorage.getItem('sharp_cleared_test_data') === 'true';
  if (isCleared) return [];

  const filterTestItems = (list: UnifiedClient[]) => {
    return list.filter(c => {
      const comp = (c.companyName || '').toLowerCase().trim();
      const email = (c.email || '').toLowerCase().trim();
      const name = (c.name || c.clientName || '').toLowerCase().trim();
      return comp !== 'teste' && email !== 'teste@gmail.com' && name !== 'teste';
    });
  };

  const saved = localStorage.getItem(STORAGE_KEY_UNIFIED_CLIENTS);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const cleaned = filterTestItems(parsed);
        if (cleaned.length !== parsed.length) {
          saveUnifiedClients(cleaned);
        }
        return cleaned;
      }
    } catch (e) {
      console.error('Error loading unified clients', e);
    }
  }

  // Fallback check from prior keys to preserve existing user data seamlessly
  const priorMethodology = localStorage.getItem('sharp_methodology_clients_v2');
  if (priorMethodology) {
    try {
      const parsed = JSON.parse(priorMethodology);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const unified = filterTestItems(parsed.map((c: any) => ({
          ...c,
          name: c.clientName || c.name || 'Cliente Sem Nome',
          clientName: c.clientName || c.name || 'Cliente Sem Nome',
          companyName: c.companyName || 'Empresa Sem Nome',
          segment: c.segment || 'Serviços Gerais',
          phone: c.phone || '(19) 9 9568-2110',
          email: c.email || 'contato@empresa.com.br',
          contractedProducts: c.contractedProducts || (c.enrolledProducts || []).map((p: any) => p.packageName || p.packageId),
          nextMeetingDate: c.nextMeetingDate || 'A agendar',
          meetingTopic: c.meetingTopic || 'Reunião de Acompanhamento',
          approvedMaterials: c.approvedMaterials ?? 0,
          rejectedMaterials: c.rejectedMaterials ?? 0,
          pendingMaterials: c.pendingMaterials ?? 1,
          sharpNotes: c.sharpNotes || 'Cliente cadastrado na plataforma Sharp.',
          status: c.status || 'Ativo',
          createdAt: c.createdAt || new Date().toISOString().split('T')[0],
          enrolledProducts: c.enrolledProducts || []
        })));
        saveUnifiedClients(unified);
        return unified;
      }
    } catch (e) {
      console.error('Error migrating prior methodology clients', e);
    }
  }

  // Fallback from sharp_clients_directory
  const priorDirectory = localStorage.getItem('sharp_clients_directory');
  if (priorDirectory) {
    try {
      const parsed = JSON.parse(priorDirectory);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned = filterTestItems(parsed);
        saveUnifiedClients(cleaned);
        return cleaned;
      }
    } catch (e) {
      console.error('Error migrating prior directory', e);
    }
  }

  saveUnifiedClients(INITIAL_UNIFIED_CLIENTS);
  return INITIAL_UNIFIED_CLIENTS;
}

export function saveUnifiedClients(clients: UnifiedClient[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_UNIFIED_CLIENTS, JSON.stringify(clients));
    window.dispatchEvent(new CustomEvent('sharp_unified_clients_changed', { detail: clients }));
  } catch (e) {
    console.error('Error in saveUnifiedClients storage write', e);
  }
}

export function createUnifiedEnrollment(pillarId: PillarId, packageId: string, responsibleStaff?: string): ClientProductEnrollment {
  const pillar = SHARP_METHODOLOGY_PILLARS.find(p => p.id === pillarId) || SHARP_METHODOLOGY_PILLARS[0];
  const pkg = pillar.packages.find(p => p.id === packageId) || pillar.packages[0];
  const firstStage = pillar.stages[0];

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Generate tasks combining package tasks and stage tasks
  const allTaskTexts = Array.from(new Set([
    ...pkg.tasks,
    ...(firstStage ? firstStage.tasks : [])
  ]));

  const enrollmentTasks: MethodologyTask[] = allTaskTexts.map((text, idx) => ({
    id: `task-${Date.now()}-${idx}`,
    text,
    completed: false
  }));

  const staff = responsibleStaff || 'Raphael (Estrategista Chefe)';

  return {
    id: `enr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    pillarId,
    packageId: pkg.id,
    packageName: pkg.name,
    currentStageId: firstStage ? firstStage.id : `${pillar.id}_stage_1`,
    startDate: now.toISOString().split('T')[0],
    responsibleStaff: staff,
    statusReason: 'Em Andamento Normal',
    lifecycleStatus: 'ativo',
    notes: `Produto ${pkg.name} iniciado no pilar ${pillar.name}.`,
    noteLogs: [
      {
        id: `log-init-${Date.now()}`,
        author: staff,
        date: dateStr,
        time: timeStr,
        text: `Produto ${pkg.name} contratado e cadastrado na esteira operacional.`
      }
    ],
    tasks: enrollmentTasks
  };
}
