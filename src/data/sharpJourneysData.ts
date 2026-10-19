export type JourneyId = 'jornada_1' | 'jornada_2' | 'jornada_3' | 'jornada_4';

export type AnswerType = 
  | 'short_text' 
  | 'long_text' 
  | 'select' 
  | 'multi_select' 
  | 'number' 
  | 'currency' 
  | 'percent'
  | 'date' 
  | 'file_upload' 
  | 'scale_1_5' 
  | 'auto_calc_viability' 
  | 'structured';

export interface QuestionHelpGuide {
  title: string;
  explanation: string;
  calculationFormula?: string;
  steps?: string[];
  benchmarks?: string[];
  example?: string;
  calculatorType?: 'tam' | 'sam' | 'som' | 'cac_ltv' | 'nps' | 'costs_projection' | 'profit_margin' | 'breakeven' | 'general';
}

export interface QuestionDefinition {
  id: string;
  questionNumber: number | string;
  title: string;
  field: string;
  type: AnswerType;
  required: boolean;
  guidance: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  charLimit?: number;
  isBreakEvenCalculator?: boolean;
  specialComponent?: 
    | 'brainstorm_ideas' 
    | 'competitor_pros_cons' 
    | 'team_members' 
    | 'growth_and_costs_split' 
    | 'pitch_marco1_review' 
    | 'marco2_review' 
    | 'marco3_dossier_report'
    | 'secondary_segment_conditional';
  helpGuide?: QuestionHelpGuide;
}

export interface StepSection {
  id: string;
  sectionCode: string;
  title: string;
  objective: string;
  introExplanation?: string;
  exposureDescription?: string;
  questions: QuestionDefinition[];
}

export interface Milestone {
  id: string;
  milestoneCode: string;
  title: string;
  objective: string;
  conclusionOutcome?: string;
  submissionReview?: string;
  sections: StepSection[];
}

export interface JourneyDefinition {
  id: JourneyId;
  title: string;
  shortTitle: string;
  subtitle: string;
  logicDescription: string;
  icon: string;
  badge: string;
  milestones: Milestone[];
}

export interface GuidedProject {
  id: string;
  journeyId: JourneyId;
  name: string;
  companyLocation: string;
  companyBranch: string;
  companyMarket: string;
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
  answers: Record<string, string>;
  files?: Record<string, { name: string; size: string; date: string }>;
}

export const SHARP_GUIDED_JOURNEYS: Record<JourneyId, JourneyDefinition> = {
  jornada_1: {
    id: 'jornada_1',
    title: '1. IDEIA NOVA DE NEGÓCIO',
    shortTitle: 'Ideia Nova de Negócio',
    subtitle: 'Preservação máxima do formulário correto: cadastro → problema → clientes → solução → oportunidade/concorrência → protótipo → modelo de negócio → GTM → finanças → equipe → viabilidade/pitch.',
    logicDescription: 'Problema → Clientes → Solução → Concorrência → Protótipo → Modelo → GTM → Finanças → Equipe → Viabilidade / Pitch',
    icon: 'Sparkles',
    badge: 'Nova Ideia / Startup',
    milestones: [
      {
        id: 'j1_m0',
        milestoneCode: 'Marco 0',
        title: 'Cadastrar projeto (Identidade do projeto)',
        objective: 'Criar o registro básico do empreendimento antes do início da jornada.',
        conclusionOutcome: 'Identidade do projeto registrada e reutilizada como exposição.',
        sections: [
          {
            id: 'j1_0_1',
            sectionCode: '0.1',
            title: 'Identidade do projeto',
            objective: 'Criar o registro básico do empreendimento.',
            exposureDescription: 'O sistema mostra essas informações em todas as etapas seguintes, sem pedir repetição.',
            questions: [
              {
                id: 'j1_0_1_q1',
                questionNumber: 1,
                title: 'Qual é o nome provisório do projeto?',
                field: 'j1_0_1_q1',
                type: 'short_text',
                required: true,
                guidance: 'É um nome de trabalho; poderá ser alterado depois.',
                placeholder: 'Ex.: Nome de trabalho do projeto...'
              },
              {
                id: 'j1_0_1_q2',
                questionNumber: 2,
                title: 'Em qual país o projeto será desenvolvido inicialmente?',
                field: 'j1_0_1_q2',
                type: 'select',
                required: true,
                guidance: 'Selecione o país da primeira atuação.',
                options: [
                  { value: 'Brasil', label: 'Brasil' },
                  { value: 'Estados Unidos', label: 'Estados Unidos' },
                  { value: 'Portugal', label: 'Portugal' },
                  { value: 'Espanha', label: 'Espanha' },
                  { value: 'Outro', label: 'Outro' }
                ]
              },
              {
                id: 'j1_0_1_q3',
                questionNumber: 3,
                title: 'Qual estado/região será o ponto de partida?',
                field: 'j1_0_1_q3',
                type: 'short_text',
                required: true,
                guidance: 'Informe a região inicial da operação ou validação.',
                placeholder: 'Ex.: São Paulo (SP), Região Metropolitana...'
              },
              {
                id: 'j1_0_1_q4',
                questionNumber: 4,
                title: 'Qual cidade será o ponto de partida?',
                field: 'j1_0_1_q4',
                type: 'short_text',
                required: true,
                guidance: 'Mesmo que o negócio seja digital, informe a cidade-base.',
                placeholder: 'Ex.: Indaiatuba, Campinas, São Paulo...'
              },
              {
                id: 'j1_0_1_q5',
                questionNumber: 5,
                title: 'Qual é a indústria/segmento principal?',
                field: 'j1_0_1_q5',
                type: 'select',
                required: true,
                guidance: 'Escolha a categoria econômica que melhor representa o setor do projeto.',
                options: [
                  { value: 'Tecnologia & Software (SaaS / App)', label: 'Tecnologia & Software (SaaS / App)' },
                  { value: 'Saúde & Bem-estar / Clínicas', label: 'Saúde & Bem-estar / Clínicas' },
                  { value: 'Educação & Treinamento / EdTech', label: 'Educação & Treinamento / EdTech' },
                  { value: 'Varejo, E-commerce & Bens de Consumo', label: 'Varejo, E-commerce & Bens de Consumo' },
                  { value: 'Serviços Financeiros & FinTech', label: 'Serviços Financeiros & FinTech' },
                  { value: 'Alimentação, Gastronomia & FoodTech', label: 'Alimentação, Gastronomia & FoodTech' },
                  { value: 'Jurídico, Contábil & Consultoria', label: 'Jurídico, Contábil & Consultoria' },
                  { value: 'Construção, Imobiliário & PropTech', label: 'Construção, Imobiliário & PropTech' },
                  { value: 'Agronegócio & AgTech', label: 'Agronegócio & AgTech' },
                  { value: 'Logística, Mobilidade & Supply Chain', label: 'Logística, Mobilidade & Supply Chain' },
                  { value: 'Outro', label: 'Outro (especificar)' }
                ]
              },
              {
                id: 'j1_0_1_q6',
                questionNumber: 6,
                title: 'Qual é o domínio ou nicho específico de atuação?',
                field: 'j1_0_1_q6',
                type: 'short_text',
                required: true,
                guidance: 'O domínio define a fatia específica ou subsegmento do mercado onde você focará antes de expandir. Seja preciso sobre a especialidade.',
                placeholder: 'Ex.: Gestão financeira e faturamento via WhatsApp para consultórios odontológicos com até 3 dentistas'
              },
              {
                id: 'j1_0_1_q7',
                questionNumber: 7,
                title: 'Descreva sua ideia de negócio em poucas linhas.',
                field: 'j1_0_1_q7',
                type: 'long_text',
                required: true,
                guidance: 'Explique a ideia sem tentar vender. O objetivo é registrar a hipótese inicial.',
                placeholder: 'Ex.: Explique a ideia sem tentar vender...'
              },
              {
                id: 'j1_0_1_q8',
                questionNumber: 8,
                title: 'Por que você está considerando essa ideia agora?',
                field: 'j1_0_1_q8',
                type: 'long_text',
                required: true,
                guidance: 'Pode ser experiência própria, oportunidade percebida, tendência, pedido de cliente ou outro gatilho.',
                placeholder: 'Ex.: Experiência própria, oportunidade percebida...'
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m1',
        milestoneCode: 'Módulo 1',
        title: 'Identificar e analisar problemas do mundo real',
        objective: 'Identificar um problema que vale a pena resolver e entender sua estrutura.',
        conclusionOutcome: 'Problema claro, área/indústria/domínio, impacto, causas e motivação.',
        sections: [
          {
            id: 'j1_1_1',
            sectionCode: '1.1',
            title: "Descobrir 'Problemas da Vida Real'",
            objective: 'Formular o problema claramente, sem viés de solução.',
            exposureDescription: 'Exposição: A ideia inicial do projeto (Atividade 1.1).',
            questions: [
              {
                id: 'j1_1_1_q1',
                questionNumber: 1,
                title: 'Qual problema sua startup está tentando resolver?',
                field: 'j1_1_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Declare-o claramente, sem mencionar ou sugerir uma solução específica.',
                placeholder: 'Ex.: Declare o problema claramente sem sugerir solução...'
              },
              {
                id: 'j1_1_1_q2',
                questionNumber: 2,
                title: 'Por favor, compartilhe alguns dados ou referências que confirmem o problema mencionado acima.',
                field: 'j1_1_1_q2',
                type: 'short_text',
                charLimit: 100,
                required: true,
                guidance: 'Inclua dados ou referências verificáveis.',
                placeholder: 'Ex.: 45% das clínicas relatam perda de 20% do faturamento...'
              },
              {
                id: 'j1_1_1_q3',
                questionNumber: 3,
                title: 'Qual é a fonte dessa informação/dado?',
                field: 'j1_1_1_q3',
                type: 'short_text',
                charLimit: 100,
                required: true,
                guidance: 'Informe relatório, órgão, pesquisa, estudo ou fonte original.',
                placeholder: 'Ex.: Relatório Setorial CFO / Entrevistas Primárias 2026...'
              }
            ]
          },
          {
            id: 'j1_1_2',
            sectionCode: '1.2',
            title: 'Informações sobre Indústria/Domínio',
            objective: 'Classificar o problema dentro do ambiente econômico adequado.',
            exposureDescription: 'Exposição: Exibe automaticamente o problema já preenchido.',
            questions: [
              {
                id: 'j1_1_2_q2',
                questionNumber: 2,
                title: 'Por favor, conte-nos um pouco mais sobre o problema que sua equipe escolheu resolver.',
                field: 'j1_1_2_q2',
                type: 'long_text',
                required: true,
                guidance: 'Amplie o contexto sem apresentar ainda a solução.',
                placeholder: 'Ex.: Amplie o contexto do problema sem solução...'
              },
              {
                id: 'j1_1_2_q3',
                questionNumber: 3,
                title: 'Qual é a área?',
                field: 'j1_1_2_q3',
                type: 'select',
                required: true,
                guidance: 'Selecione o modelo operacional ou modelo de público da área.',
                options: [
                  { value: 'B2B Enterprise / Grandes Contas', label: 'B2B Enterprise (Grandes Contas)' },
                  { value: 'B2B PMEs / Pequenos Negócios', label: 'B2B PMEs (Pequenos e Médios Negócios)' },
                  { value: 'B2C / Consumidor Final', label: 'B2C (Consumidor Final)' },
                  { value: 'B2B2C / Plataformas Híbridas', label: 'B2B2C (Plataformas Híbridas)' },
                  { value: 'Marketplace / Intermediação', label: 'Marketplace (Intermediação)' },
                  { value: 'D2C / Venda Direta', label: 'D2C (Venda Direta da Fábrica)' },
                  { value: 'B2G / Governo & Setor Público', label: 'B2G (Governo / Setor Público)' },
                  { value: 'Outro', label: 'Outro (especificar)' }
                ]
              },
              {
                id: 'j1_1_2_q4',
                questionNumber: 4,
                title: 'Qual é a indústria?',
                field: 'j1_1_2_q4',
                type: 'select',
                required: true,
                guidance: 'Classifique o macrosetor econômico do mercado.',
                options: [
                  { value: 'Tecnologia & Software (SaaS / App)', label: 'Tecnologia & Software (SaaS / App)' },
                  { value: 'Saúde & Bem-estar / Clínicas', label: 'Saúde & Bem-estar / Clínicas' },
                  { value: 'Educação & Treinamento / EdTech', label: 'Educação & Treinamento / EdTech' },
                  { value: 'Varejo, E-commerce & Bens de Consumo', label: 'Varejo, E-commerce & Bens de Consumo' },
                  { value: 'Serviços Financeiros & FinTech', label: 'Serviços Financeiros & FinTech' },
                  { value: 'Alimentação, Gastronomia & FoodTech', label: 'Alimentação, Gastronomia & FoodTech' },
                  { value: 'Jurídico, Contábil & Consultoria', label: 'Jurídico, Contábil & Consultoria' },
                  { value: 'Construção, Imobiliário & PropTech', label: 'Construção, Imobiliário & PropTech' },
                  { value: 'Agronegócio & AgTech', label: 'Agronegócio & AgTech' },
                  { value: 'Logística, Mobilidade & Supply Chain', label: 'Logística, Mobilidade & Supply Chain' },
                  { value: 'Outro', label: 'Outro (especificar)' }
                ]
              },
              {
                id: 'j1_1_2_q5',
                questionNumber: 5,
                title: 'Qual é o domínio?',
                field: 'j1_1_2_q5',
                type: 'short_text',
                required: true,
                guidance: 'O domínio é o nicho ou especialidade concreta dentro da indústria onde a solução operará.',
                placeholder: 'Ex.: Atendimento e Confirmação Automatizada de Pacientes para Clínicas Odontológicas'
              }
            ]
          },
          {
            id: 'j1_1_3',
            sectionCode: '1.3',
            title: 'Analisar o(s) problema(s) que sua Startup irá resolver',
            objective: 'Aprofundar impacto, causas e motivação.',
            exposureDescription: 'Exposição: Exibe problema, área, indústria e domínio.',
            questions: [
              {
                id: 'j1_1_3_q1',
                questionNumber: 1,
                title: 'Quem é afetado por esse problema?',
                field: 'j1_1_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Identifique diferentes pessoas ou organizações afetadas.',
                placeholder: 'Ex.: Dentistas, secretárias, pacientes...'
              },
              {
                id: 'j1_1_3_q2',
                questionNumber: 2,
                title: 'Qual é o impacto negativo causado por esse problema?',
                field: 'j1_1_3_q2',
                type: 'long_text',
                required: true,
                guidance: 'Descreva as consequências para os diferentes envolvidos.',
                placeholder: 'Ex.: Perda financeira, ociosidade de sala, desgaste...'
              },
              {
                id: 'j1_1_3_q3',
                questionNumber: 3,
                title: 'Causas raízes: por que esse problema existe?',
                field: 'j1_1_3_q3',
                type: 'long_text',
                required: true,
                guidance: 'Identifique os principais fatores que contribuem para sua continuidade.',
                placeholder: 'Ex.: Falta de integração, processos manuais no WhatsApp...'
              },
              {
                id: 'j1_1_3_q4',
                questionNumber: 4,
                title: 'Conexão pessoal: por que você deseja trabalhar nesse problema?',
                field: 'j1_1_3_q4',
                type: 'long_text',
                required: true,
                guidance: 'Descreva como enfrentar o problema se alinha às paixões, habilidades ou motivações da equipe.',
                placeholder: 'Ex.: Vivenciamos isso em nossas próprias clínicas...'
              },
              {
                id: 'j1_1_3_q5',
                questionNumber: 5,
                title: 'Mini apresentação do negócio — problema que resolve.',
                field: 'j1_1_3_q5',
                type: 'short_text',
                charLimit: 200,
                required: true,
                guidance: 'Em no máximo 200 caracteres, reescreva o problema.',
                placeholder: 'Ex.: Alta taxa de no-show em consultas particulares gerando 20% de ociosidade...'
              },
              {
                id: 'j1_1_3_q6',
                questionNumber: 6,
                title: 'Mini apresentação do negócio — impacto negativo.',
                field: 'j1_1_3_q6',
                type: 'short_text',
                charLimit: 200,
                required: true,
                guidance: 'Em no máximo 200 caracteres, reescreva o impacto negativo nos envolvidos.',
                placeholder: 'Ex.: Redução drástica da margem de lucro e frustração da equipe...'
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m2',
        milestoneCode: 'Módulo 2',
        title: 'Identificar clientes e validar suas necessidades',
        objective: 'Identificar segmentos, construir uma persona inicial e confrontar hipóteses com clientes reais.',
        conclusionOutcome: 'Segmentos, persona, JTBD, roteiro de entrevistas, lista de participantes e insights.',
        sections: [
          {
            id: 'j1_2_1',
            sectionCode: '2.1',
            title: 'Identificar Segmentos de Clientes',
            objective: 'Definir foco principal e secundário.',
            questions: [
              {
                id: 'j1_2_1_q1',
                questionNumber: 1,
                title: 'Entre os muitos envolvidos que podem estar enfrentando o problema, quem seria o foco principal do empreendimento?',
                field: 'j1_2_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Escolha o grupo que será prioritário.',
                placeholder: 'Ex.: Proprietários de clínicas odontológicas de médio porte...'
              },
              {
                id: 'j1_2_1_q2',
                questionNumber: 2,
                title: 'Para o público-alvo que é o foco principal, qual é o tipo de negócio?',
                field: 'j1_2_1_q2',
                type: 'select',
                required: true,
                guidance: 'Ex.: B2C para estudantes, B2B para fabricantes.',
                options: [
                  { value: 'B2B', label: 'B2B (Empresas)' },
                  { value: 'B2C', label: 'B2C (Consumidor Final)' },
                  { value: 'B2B2C', label: 'B2B2C' },
                  { value: 'B2G', label: 'B2G (Governo)' },
                  { value: 'Outro', label: 'Outro' }
                ]
              },
              {
                id: 'j1_2_1_q3',
                questionNumber: 3,
                title: 'Para B2C, quais atributos são comuns entre os indivíduos?',
                field: 'j1_2_1_q3',
                type: 'short_text',
                required: false,
                guidance: 'Idade, gênero, renda, localização, ocupação, adoção de tecnologia, hobbies, redes sociais etc.',
                placeholder: 'Ex.: Idade 30-50 anos, renda A/B, alta adoção digital...'
              },
              {
                id: 'j1_2_1_q4',
                questionNumber: 4,
                title: 'Atribua uma breve descrição/título ao segmento primário.',
                field: 'j1_2_1_q4',
                type: 'short_text',
                required: true,
                guidance: 'Ex.: pequenos varejistas de alimentos em cidades de médio porte.',
                placeholder: 'Ex.: Clínicas odontológicas privadas em centros urbanos...'
              },
              {
                id: 'j1_2_1_q5',
                questionNumber: 5,
                title: 'Existe um segmento secundário?',
                field: 'j1_2_1_q5',
                type: 'select',
                required: false,
                specialComponent: 'secondary_segment_conditional',
                guidance: 'É comum que startups atendam múltiplos segmentos; designe um como primário e registre o secundário se aplicável.',
                options: [
                  { value: 'Sim', label: 'Sim (Possui segmento secundário)' },
                  { value: 'Não', label: 'Não (Apenas segmento primário)' }
                ]
              }
            ]
          },
          {
            id: 'j1_2_2',
            sectionCode: '2.2',
            title: 'Construir uma Persona Inicial de Cliente',
            objective: 'Transformar o segmento em perfil de cliente/usuário para investigação.',
            questions: [
              {
                id: 'j1_2_2_q1',
                questionNumber: 1,
                title: 'Faça upload da imagem da persona.',
                field: 'j1_2_2_q1',
                type: 'file_upload',
                required: false,
                guidance: 'SUBIR ARQUIVO: Arquivo da persona, se desejado pelo fluxo.'
              },
              {
                id: 'j1_2_2_q2',
                questionNumber: 2,
                title: 'Qual é o nome da persona?',
                field: 'j1_2_2_q2',
                type: 'short_text',
                required: true,
                guidance: 'Nome de identificação.',
                placeholder: 'Ex.: Dra. Camila Ramos'
              },
              {
                id: 'j1_2_2_q3',
                questionNumber: 3,
                title: 'Qual é o local?',
                field: 'j1_2_2_q3',
                type: 'short_text',
                required: true,
                guidance: 'Localização.',
                placeholder: 'Ex.: São Paulo / SP'
              },
              {
                id: 'j1_2_2_q4',
                questionNumber: 4,
                title: 'Qual é a idade?',
                field: 'j1_2_2_q4',
                type: 'short_text',
                required: true,
                guidance: 'Faixa ou idade.',
                placeholder: 'Ex.: 38 anos'
              },
              {
                id: 'j1_2_2_q5',
                questionNumber: 5,
                title: 'Qual é a educação/formação?',
                field: 'j1_2_2_q5',
                type: 'short_text',
                required: true,
                guidance: 'Formação relevante.',
                placeholder: 'Ex.: Odontologia com especialização em Harmonização'
              },
              {
                id: 'j1_2_2_q6',
                questionNumber: 6,
                title: 'Qual é o gênero?',
                field: 'j1_2_2_q6',
                type: 'select',
                required: false,
                guidance: 'Quando relevante.',
                options: [
                  { value: 'Feminino', label: 'Feminino' },
                  { value: 'Masculino', label: 'Masculino' },
                  { value: 'Não-binário', label: 'Não-binário' },
                  { value: 'Misto / Ambos', label: 'Misto / Ambos' },
                  { value: 'Não se aplica', label: 'Não se aplica' }
                ]
              },
              {
                id: 'j1_2_2_q7',
                questionNumber: 7,
                title: 'Qual é a ocupação?',
                field: 'j1_2_2_q7',
                type: 'short_text',
                required: true,
                guidance: 'Atividade profissional.',
                placeholder: 'Ex.: Cirurgiã-dentista e proprietária de clínica'
              },
              {
                id: 'j1_2_2_q8',
                questionNumber: 8,
                title: 'Qual é o papel principal da persona na organização?',
                field: 'j1_2_2_q8',
                type: 'short_text',
                required: false,
                guidance: 'Para B2B/B2G.',
                placeholder: 'Ex.: Sócia-diretora e tomadora de decisão'
              },
              {
                id: 'j1_2_2_q9',
                questionNumber: 9,
                title: 'A que indústria a organização pertence?',
                field: 'j1_2_2_q9',
                type: 'short_text',
                required: false,
                guidance: 'Para B2B/B2G.',
                placeholder: 'Ex.: Saúde & Estética Privada'
              },
              {
                id: 'j1_2_2_q10',
                questionNumber: 10,
                title: 'Quais são as responsabilidades da persona na organização?',
                field: 'j1_2_2_q10',
                type: 'long_text',
                required: false,
                guidance: 'Descreva.',
                placeholder: 'Ex.: Gestão clínica, fechamento financeiro, atendimento VIP...'
              },
              {
                id: 'j1_2_2_q11',
                questionNumber: 11,
                title: 'Qual é a natureza da organização da persona?',
                field: 'j1_2_2_q11',
                type: 'select',
                required: false,
                guidance: 'Selecione a estrutura jurídica/institucional onde a persona atua ou se trata de consumidor final.',
                options: [
                  { value: 'Micro / Pequena Empresa (PME Tradicional)', label: 'Micro / Pequena Empresa (PME Tradicional)' },
                  { value: 'Startup / Empresa de Tecnologia', label: 'Startup / Empresa de Tecnologia' },
                  { value: 'Média / Grande Empresa Corporativa', label: 'Média / Grande Empresa Corporativa' },
                  { value: 'Profissional Liberal / Autônomo / Consultório', label: 'Profissional Liberal / Autônomo / Consultório' },
                  { value: 'Órgão Público / Governamental (B2G)', label: 'Órgão Público / Governamental (B2G)' },
                  { value: 'ONG / Associação / Terceiro Setor', label: 'ONG / Associação / Terceiro Setor' },
                  { value: 'Instituição de Ensino / Academia', label: 'Instituição de Ensino / Academia' },
                  { value: 'Consumidor Final (Pessoa Física / B2C)', label: 'Consumidor Final (Pessoa Física / B2C)' },
                  { value: 'Outro', label: 'Outro (especificar)' }
                ]
              },
              {
                id: 'j1_2_2_q12',
                questionNumber: 12,
                title: 'Quais são os interesses/hobbies?',
                field: 'j1_2_2_q12',
                type: 'long_text',
                required: false,
                guidance: 'Contexto de vida.',
                placeholder: 'Ex.: Viagens, congressos, esportes ao ar livre...'
              },
              {
                id: 'j1_2_2_q13',
                questionNumber: 13,
                title: 'Como prefere comprar?',
                field: 'j1_2_2_q13',
                type: 'long_text',
                required: true,
                guidance: 'Canais e estilo de compra.',
                placeholder: 'Ex.: Demonstração online rápida, pagamento por assinatura no cartão...'
              },
              {
                id: 'j1_2_2_q14',
                questionNumber: 14,
                title: 'Quais redes sociais utiliza?',
                field: 'j1_2_2_q14',
                type: 'short_text',
                required: false,
                guidance: 'Selecione ou liste.',
                placeholder: 'Ex.: Instagram, WhatsApp, LinkedIn'
              },
              {
                id: 'j1_2_2_q15',
                questionNumber: 15,
                title: 'Qual é a principal fonte de informação/notícias?',
                field: 'j1_2_2_q15',
                type: 'short_text',
                required: false,
                guidance: 'Defina.',
                placeholder: 'Ex.: Portais de odontologia, podcasts de gestão, Instagram'
              },
              {
                id: 'j1_2_2_q16',
                questionNumber: 16,
                title: 'Qual é o conforto com tecnologia?',
                field: 'j1_2_2_q16',
                type: 'select',
                required: false,
                guidance: 'Baixo, médio, alto, especialista.',
                options: [
                  { value: 'Médio', label: 'Médio' },
                  { value: 'Alto', label: 'Alto' },
                  { value: 'Baixo', label: 'Baixo' },
                  { value: 'Especialista', label: 'Especialista' }
                ]
              },
              {
                id: 'j1_2_2_q17',
                questionNumber: 17,
                title: 'Quais são os locais de encontro off-line favoritos?',
                field: 'j1_2_2_q17',
                type: 'long_text',
                required: false,
                guidance: 'Quando relevante.',
                placeholder: 'Ex.: Feiras odontológicas (CIOSP), cursos de imersão...'
              },
              {
                id: 'j1_2_2_q18',
                questionNumber: 18,
                title: 'Quais são as tarefas funcionais a serem realizadas (JTBD)?',
                field: 'j1_2_2_q18',
                type: 'long_text',
                required: true,
                guidance: 'Liste tarefas práticas que a persona deseja realizar e que o problema impede/dificulta.',
                placeholder: 'Ex.: Manter a agenda 100% ocupada sem gastar 4h no WhatsApp...'
              },
              {
                id: 'j1_2_2_q19',
                questionNumber: 19,
                title: 'Quais são as tarefas emocionais a serem realizadas?',
                field: 'j1_2_2_q19',
                type: 'long_text',
                required: true,
                guidance: 'Como a persona deseja se sentir.',
                placeholder: 'Ex.: Sentir-se no controle da clínica e sem ansiedade de cancelamento...'
              },
              {
                id: 'j1_2_2_q20',
                questionNumber: 20,
                title: 'Quais são as tarefas sociais a serem realizadas?',
                field: 'j1_2_2_q20',
                type: 'long_text',
                required: true,
                guidance: 'Resultados/reconhecimento social desejado.',
                placeholder: 'Ex.: Ser vista como uma clínica premium e altamente pontual...'
              },
              {
                id: 'j1_2_2_q21',
                questionNumber: 21,
                title: 'Como a persona supera o problema atualmente?',
                field: 'j1_2_2_q21',
                type: 'long_text',
                required: true,
                guidance: 'Liste soluções/alternativas atuais.',
                placeholder: 'Ex.: Secretária manda mensagens manuais no WhatsApp uma a uma...'
              },
              {
                id: 'j1_2_2_q22',
                questionNumber: 22,
                title: 'Quais são as limitações das soluções existentes?',
                field: 'j1_2_2_q22',
                type: 'long_text',
                required: true,
                guidance: 'Por que a persona está insatisfeita?',
                placeholder: 'Ex.: Secretária esquece, mensagens soam frias e pacientes não respondem...'
              }
            ]
          },
          {
            id: 'j1_2_3',
            sectionCode: '2.3',
            title: 'Preparar Roteiros para Entrevistas com Clientes',
            objective: 'Preparar perguntas de entrevista para validar as suposições.',
            questions: [
              {
                id: 'j1_2_3_q1',
                questionNumber: 1,
                title: 'Prompt de abertura da entrevista.',
                field: 'j1_2_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Sugira uma maneira amigável de contextualizar o problema e deixar claro que não se trata de uma venda.',
                placeholder: 'Ex.: Olá! Estamos fazendo uma pesquisa de melhoria de rotinas clínicas...'
              },
              {
                id: 'j1_2_3_q2',
                questionNumber: 2,
                title: 'Prompt de investigação ampla.',
                field: 'j1_2_3_q2',
                type: 'long_text',
                required: true,
                guidance: 'Crie uma pergunta sobre histórico pessoal, profissional, estilo de vida, importância do problema, tarefas funcionais, emocionais e sociais, alternativas atuais, limitações e requisitos mínimos.',
                placeholder: 'Ex.: Como é hoje sua rotina de confirmação de consultas e quando ocorreu o último no-show?'
              },
              {
                id: 'j1_2_3_q3',
                questionNumber: 3,
                title: 'Prompt de encerramento.',
                field: 'j1_2_3_q3',
                type: 'short_text',
                required: true,
                guidance: 'Como agradecer e solicitar acompanhamento, se necessário?',
                placeholder: 'Ex.: Muito obrigado pelo seu tempo! Posso te avisar quando tivermos um piloto pronto?'
              }
            ]
          },
          {
            id: 'j1_2_4',
            sectionCode: '2.4',
            title: 'Identificar Pessoas para Entrevistar',
            objective: 'Criar uma lista real de pessoas aderentes à persona.',
            questions: [
              {
                id: 'j1_2_4_q1',
                questionNumber: 1,
                title: 'Quantas pessoas você pretende entrevistar?',
                field: 'j1_2_4_q1',
                type: 'number',
                required: true,
                guidance: 'Referência do programa: B2C pelo menos 10 clientes; B2B/B2G 3–4 pessoas de no mínimo duas organizações.',
                placeholder: 'Ex.: 12'
              },
              {
                id: 'j1_2_4_q2',
                questionNumber: 2,
                title: 'Como essas pessoas serão encontradas?',
                field: 'j1_2_4_q2',
                type: 'long_text',
                required: true,
                guidance: 'Rede, parceiros, comunidades etc.',
                placeholder: 'Ex.: Contatos da faculdade, grupo de WhatsApp de dentistas de SP...'
              },
              {
                id: 'j1_2_4_q3',
                questionNumber: 3,
                title: 'Liste os potenciais entrevistados.',
                field: 'j1_2_4_q3',
                type: 'long_text',
                required: true,
                guidance: 'Inclua identificação e contato, quando apropriado.',
                placeholder: 'Ex.: 1. Dr. Carlos (Clínica Sorriso), 2. Dra. Fernanda (Dermato)...'
              }
            ]
          },
          {
            id: 'j1_2_5',
            sectionCode: '2.5',
            title: 'Insights das entrevistas com clientes',
            objective: 'Registrar o que mudou depois do contato com clientes reais.',
            questions: [
              {
                id: 'j1_2_5_q1',
                questionNumber: 1,
                title: 'Quantos clientes potenciais você encontrou pessoalmente?',
                field: 'j1_2_5_q1',
                type: 'number',
                required: true,
                guidance: 'Número.',
                placeholder: 'Ex.: 5'
              },
              {
                id: 'j1_2_5_q2',
                questionNumber: 2,
                title: 'Quantos encontrou virtualmente?',
                field: 'j1_2_5_q2',
                type: 'number',
                required: true,
                guidance: 'Telefone, Zoom etc.',
                placeholder: 'Ex.: 8'
              },
              {
                id: 'j1_2_5_q3',
                questionNumber: 3,
                title: 'Do total, quantos sentiram que é muito importante buscar uma nova solução?',
                field: 'j1_2_5_q3',
                type: 'number',
                required: true,
                guidance: 'Número.',
                placeholder: 'Ex.: 11'
              },
              {
                id: 'j1_2_5_q4',
                questionNumber: 4,
                title: 'Do total, quantos estavam muito insatisfeitos com as alternativas atuais?',
                field: 'j1_2_5_q4',
                type: 'number',
                required: true,
                guidance: 'Número.',
                placeholder: 'Ex.: 9'
              },
              {
                id: 'j1_2_5_q5',
                questionNumber: 5,
                title: 'Quais foram seus maiores desafios nas entrevistas?',
                field: 'j1_2_5_q5',
                type: 'long_text',
                required: true,
                guidance: 'Explique.',
                placeholder: 'Ex.: Conseguir que os donos de clínica parassem a rotina para atender...'
              },
              {
                id: 'j1_2_5_q6',
                questionNumber: 6,
                title: 'Quais foram os aprendizados inesperados?',
                field: 'j1_2_5_q6',
                type: 'long_text',
                required: true,
                guidance: 'Necessidades não previstas.',
                placeholder: 'Ex.: O maior problema não é a confirmação, e sim o encaixe de última hora...'
              },
              {
                id: 'j1_2_5_q7',
                questionNumber: 7,
                title: 'Você precisa atualizar a declaração do problema?',
                field: 'j1_2_5_q7',
                type: 'select',
                required: true,
                guidance: 'Sim/Não + justificativa.',
                options: [
                  { value: 'Sim - Necessita atualização', label: 'Sim (Necessita atualização)' },
                  { value: 'Não - Problema confirmado', label: 'Não (Problema confirmado)' },
                  { value: 'Parcialmente - Pequenos ajustes', label: 'Parcialmente (Pequenos ajustes)' }
                ]
              },
              {
                id: 'j1_2_5_q8',
                questionNumber: 8,
                title: 'Você precisa atualizar os segmentos?',
                field: 'j1_2_5_q8',
                type: 'select',
                required: true,
                guidance: 'Sim/Não + justificativa.',
                options: [
                  { value: 'Sim - Necessita atualização', label: 'Sim (Necessita atualização)' },
                  { value: 'Não - Segmentos confirmados', label: 'Não (Segmentos confirmados)' },
                  { value: 'Parcialmente - Pequenos ajustes', label: 'Parcialmente (Pequenos ajustes)' }
                ]
              },
              {
                id: 'j1_2_5_q9',
                questionNumber: 9,
                title: 'Você precisa atualizar a persona?',
                field: 'j1_2_5_q9',
                type: 'select',
                required: true,
                guidance: 'Sim/Não + justificativa.',
                options: [
                  { value: 'Sim - Necessita atualização', label: 'Sim (Necessita atualização)' },
                  { value: 'Não - Persona confirmada', label: 'Não (Persona confirmada)' },
                  { value: 'Parcialmente - Pequenos ajustes', label: 'Parcialmente (Pequenos ajustes)' }
                ]
              },
              {
                id: 'j1_2_5_q10',
                questionNumber: 10,
                title: 'Você precisa entrevistar mais pessoas?',
                field: 'j1_2_5_q10',
                type: 'select',
                required: true,
                guidance: 'Sim/Não + critério.',
                options: [
                  { value: 'Sim - Mais entrevistas necessárias', label: 'Sim (Mais entrevistas necessárias)' },
                  { value: 'Não - Saturação de dados atingida', label: 'Não (Saturação de dados atingida)' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m3',
        milestoneCode: 'Módulo 3',
        title: 'Gerar ideias de soluções',
        objective: 'Gerar várias soluções, escolher uma e descrever seu funcionamento e benefícios.',
        conclusionOutcome: 'Solução selecionada, desenho, experiência e benefícios.',
        sections: [
          {
            id: 'j1_3_1',
            sectionCode: '3.1 & 3.2',
            title: 'Gerar e Selecionar uma Ideia de Solução',
            objective: 'Gerar alternativas criativas e escolher uma única direção para continuar.',
            introExplanation: 'A fase de ideação visa expandir o pensamento antes de convergir. Gere e liste múltiplas ideias de solução alternativas antes de escolher uma única direção para desenvolver.',
            questions: [
              {
                id: 'j1_3_1_q0',
                questionNumber: 0,
                title: '0. Gere ideias de solução (Brainstorming de Alternativas)',
                field: 'j1_3_1_q0',
                type: 'long_text',
                required: true,
                specialComponent: 'brainstorm_ideas',
                guidance: 'Adicione várias ideias de solução no painel abaixo. Classifique cada uma como Promissora, Descartada ou Em Dúvida para selecionar a melhor hipótese.',
                placeholder: 'Digite uma ideia de solução e clique em Adicionar Ideia...'
              },
              {
                id: 'j1_3_1_q1',
                questionNumber: 1,
                title: 'Quais ideias de solução foram geradas?',
                field: 'j1_3_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Sintetize as alternativas geradas pela equipe ou extraia do brainstorm acima.',
                placeholder: 'Ex.: Ideia A: Assistente WhatsApp integrado; Ideia B: Portal do paciente com lista de espera; Ideia C: Totem na clínica...'
              },
              {
                id: 'j1_3_1_q2',
                questionNumber: 2,
                title: 'Selecione três ideias mais relevantes e exclusivas.',
                field: 'j1_3_1_q2',
                type: 'long_text',
                required: true,
                guidance: 'Escolha três alternativas com maior potencial de viabilidade e impacto.',
                placeholder: 'Ex.: 1. Assistente inteligente no WhatsApp; 2. Sistema de encaixe dinâmico com incentivo; 3. Pagamento antecipado de caução...'
              },
              {
                id: 'j1_3_2_q1',
                questionNumber: 3,
                title: 'Qual é a ÚNICA ideia de solução escolhida?',
                field: 'j1_3_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Escolha uma única direção vencedora para focar todos os esforços de validação.',
                placeholder: 'Ex.: Assistente inteligente no WhatsApp conectado à lista de espera instantânea...'
              },
              {
                id: 'j1_3_2_q2',
                questionNumber: 4,
                title: 'Por que essa ideia foi selecionada?',
                field: 'j1_3_2_q2',
                type: 'long_text',
                required: true,
                guidance: 'Considere experiência técnica, investimento, diferenciação e aderência ao cliente.',
                placeholder: 'Ex.: Menor atrito para o paciente (não precisa baixar app) e rápida integração técnica com sistemas existentes...'
              }
            ]
          },
          {
            id: 'j1_3_3',
            sectionCode: '3.3 & 3.4',
            title: 'Desenho da Solução e Benefícios',
            objective: 'Descrever como a solução existe, funciona e mapear benefícios.',
            questions: [
              {
                id: 'j1_3_3_q1',
                questionNumber: 1,
                title: 'Qual será o formato da solução?',
                field: 'j1_3_3_q1',
                type: 'select',
                required: true,
                guidance: 'Selecione o modelo arquitetural e de entrega da solução.',
                options: [
                  { value: 'Plataforma Web SaaS (Software em Nuvem)', label: 'Plataforma Web SaaS (Software em Nuvem)' },
                  { value: 'Aplicativo Mobile (iOS / Android)', label: 'Aplicativo Mobile (iOS / Android)' },
                  { value: 'Marketplace / Plataforma de Intermediação', label: 'Marketplace / Plataforma de Intermediação' },
                  { value: 'Inteligência Artificial / Agente Autônomo', label: 'Inteligência Artificial / Agente Autônomo' },
                  { value: 'API / Integração Técnica B2B', label: 'API / Integração Técnica B2B' },
                  { value: 'Serviço Produtizado (Tech-Enabled Service)', label: 'Serviço Produtizado (Tech-Enabled Service)' },
                  { value: 'Hardware + Software IoT', label: 'Hardware + Software IoT' },
                  { value: 'E-commerce / Loja Virtual D2C', label: 'E-commerce / Loja Virtual D2C' },
                  { value: 'Consultoria / Metodologia Proprietária', label: 'Consultoria / Metodologia Proprietária' },
                  { value: 'Modelo Híbrido (App + Web + Atendimento)', label: 'Modelo Híbrido (App + Web + Atendimento)' },
                  { value: 'Outro', label: 'Outro (especificar)' }
                ]
              },
              {
                id: 'j1_3_3_q2',
                questionNumber: 2,
                title: 'Quais tecnologias ou metodologias serão usadas?',
                field: 'j1_3_3_q2',
                type: 'long_text',
                required: true,
                guidance: 'Liste as principais tecnologias/metodologias.',
                placeholder: 'Ex.: Node.js, API oficial WhatsApp, React, IA generativa...'
              },
              {
                id: 'j1_3_3_q3',
                questionNumber: 3,
                title: 'Quais são os principais recursos da solução?',
                field: 'j1_3_3_q3',
                type: 'long_text',
                required: true,
                guidance: 'Liste os recursos.',
                placeholder: 'Ex.: Confirmação em 2 cliques, remanejamento automático de vagas...'
              },
              {
                id: 'j1_3_3_q4',
                questionNumber: 4,
                title: 'O que há de único e especial nesta solução?',
                field: 'j1_3_3_q4',
                type: 'long_text',
                required: true,
                guidance: 'Tecnologia proprietária, dados, parceria, marca etc.',
                placeholder: 'Ex.: Algoritmo de predição de cancelamento baseado no histórico do paciente...'
              },
              {
                id: 'j1_3_3_q5',
                questionNumber: 5,
                title: 'Mini Pitch — o que o negócio faz?',
                field: 'j1_3_3_q5',
                type: 'short_text',
                required: true,
                guidance: 'Uma frase simples.',
                placeholder: 'Ex.: Eliminamos o no-show de clínicas odontológicas através de predição inteligente...'
              },
              {
                id: 'j1_3_4_q1',
                questionNumber: 6,
                title: 'Como os usuários se envolverão com seu produto/serviço?',
                field: 'j1_3_4_q1',
                type: 'long_text',
                required: true,
                guidance: 'Liste 3–4 etapas principais.',
                placeholder: 'Ex.: 1. Conecta agenda, 2. Robô envia mensagem, 3. Vaga remanejada automaticamente...'
              },
              {
                id: 'j1_3_4_q2',
                questionNumber: 7,
                title: 'Quais benefícios FUNCIONAIS, EMOCIONAIS e SOCIAIS serão obtidos?',
                field: 'j1_3_4_q2',
                type: 'long_text',
                required: true,
                guidance: 'Alinhe aos JTBD e considere o impacto na sociedade/economia.',
                placeholder: 'Ex.: Funcional: +20% faturamento; Emocional: tranquilidade; Social: pontualidade...'
              },
              {
                id: 'j1_3_4_q6',
                questionNumber: 8,
                title: 'Mini Pitch — resuma a ideia e seus benefícios.',
                field: 'j1_3_4_q6',
                type: 'short_text',
                required: true,
                guidance: 'Síntese.',
                placeholder: 'Ex.: Aumentamos a receita das clínicas em até 25% recuperando horários ociosos...'
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m4',
        milestoneCode: 'Módulo 4',
        title: 'Mapear oportunidade e concorrência',
        objective: 'Entender a competição, tendências e tamanho inicial da oportunidade.',
        conclusionOutcome: 'Mapa de concorrentes, tendências e TAM/crescimento.',
        sections: [
          {
            id: 'j1_4_1',
            sectionCode: '4.1 & 4.2',
            title: 'Concorrentes e Macrotendências',
            objective: 'Mapear soluções atuais, lacunas e forças externas favoráveis e desfavoráveis.',
            questions: [
              {
                id: 'j1_4_1_q1',
                questionNumber: 1,
                title: 'Quais empresas oferecem opções/alternativas atuais?',
                field: 'j1_4_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Considere locais, regionais, globais, emergentes e nichos.',
                placeholder: 'Ex.: Softwares tradicionais de agenda, soluções genéricas de WhatsApp...'
              },
              {
                id: 'j1_4_1_q2',
                questionNumber: 2,
                title: 'Liste concorrentes diretos e indiretos (Brasil e Globais).',
                field: 'j1_4_1_q2',
                type: 'long_text',
                required: true,
                guidance: 'Nome/empresa.',
                placeholder: 'Ex.: Diretos Brasil: Simples Dental; Indiretos: Planilhas Excel...'
              },
              {
                id: 'j1_4_1_q4',
                questionNumber: 3,
                title: 'Existem lacunas de mercado que ninguém atende?',
                field: 'j1_4_1_q4',
                type: 'long_text',
                required: true,
                guidance: 'Identifique.',
                placeholder: 'Ex.: Ninguém faz a reocupação de vaga em tempo real com oferta dinâmica...'
              },
              {
                id: 'j1_4_2_q1',
                questionNumber: 4,
                title: 'Analise macrotendências favoráveis e desfavoráveis.',
                field: 'j1_4_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Explique impacto e cite fontes consultadas (relatórios do setor, dados governamentais etc.).',
                placeholder: 'Ex.: Favorável: Adoção massiva do WhatsApp no Brasil; Desfavorável: Regulação LGPD...'
              }
            ]
          },
          {
            id: 'j1_4_3',
            sectionCode: '4.3',
            title: 'Tamanho da Oportunidade (TAM)',
            objective: 'Estimar TAM e crescimento.',
            questions: [
              {
                id: 'j1_4_3_q1',
                questionNumber: 1,
                title: 'Qual é o TAM estimado (Mercado Total Endereçável)?',
                field: 'j1_4_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Calcule a demanda total potencial se sua empresa atingisse 100% de penetração de mercado.',
                placeholder: 'Ex.: R$ 1.2 bilhão/ano (120 mil clínicas odontológicas no Brasil x R$ 10.000 de gasto médio anual com software)',
                helpGuide: {
                  title: 'Como Calcular o TAM (Total Addressable Market)',
                  explanation: 'O TAM representa a receita total disponível se você capturasse 100% do mercado em que atua. Ele prova aos investidores que a oportunidade é grande o suficiente.',
                  calculationFormula: 'TAM = Número Total de Clientes Potenciais no Mercado × Gasto Médio Anual (Ticket Anual)',
                  steps: [
                    'Identifique o total de entidades elegíveis (ex.: número de empresas do setor, número de pessoas do perfil).',
                    'Multiplique pelo valor anual que cada cliente pagaria pelo seu produto ou serviço.',
                    'Use abordagem Top-Down (relatórios setoriais) ou Bottom-Up (unidades × preço anual).'
                  ],
                  example: 'Exemplo: 120.000 consultórios odontológicos no Brasil × R$ 800/mês (R$ 9.600/ano) = TAM de R$ 1,15 Bilhão por ano.'
                }
              },
              {
                id: 'j1_4_3_q2',
                questionNumber: 2,
                title: 'Qual é a taxa de crescimento do setor/domínio?',
                field: 'j1_4_3_q2',
                type: 'short_text',
                required: true,
                guidance: 'Informe a taxa percentual de crescimento anual (CAGR) e período de referência.',
                placeholder: 'Ex.: 14.8% ao ano (CAGR projetado 2024-2030)',
                helpGuide: {
                  title: 'Taxa de Crescimento Anual (CAGR)',
                  explanation: 'A taxa anual composta (Compound Annual Growth Rate) demonstra se o mercado está em expansão, estável ou em retração.',
                  calculationFormula: 'CAGR = (Valor Final / Valor Inicial)^(1 / Anos) - 1',
                  benchmarks: [
                    'Mercado Tradicional / Maduro: 3% a 6% ao ano',
                    'Mercado em Expansão: 8% a 15% ao ano',
                    'Setores de Alta Tecnologia / IA / HealthTech: 18% a 35%+ ao ano'
                  ]
                }
              },
              {
                id: 'j1_4_3_q3',
                questionNumber: 3,
                title: 'Quais fontes sustentam essas informações?',
                field: 'j1_4_3_q3',
                type: 'short_text',
                required: true,
                guidance: 'Cite fontes confiáveis como associações setoriais, IBGE, consultorias de mercado (Gartner, McKinsey, Statista) ou publicações acadêmicas.',
                placeholder: 'Ex.: Associação Brasileira de Odontologia (CFO 2025), Relatório Grand View Research & Statista',
                helpGuide: {
                  title: 'Fontes Confiáveis de Dados de Mercado',
                  explanation: 'Dados sem fonte enfraquecem qualquer tese. Use sempre referências verificáveis.',
                  steps: [
                    'Órgãos governamentais e conselhos profissionais (IBGE, CFO, CRM, Sebrae, Banco Central).',
                    'Relatórios setoriais públicos de consultorias (McKinsey, Bain, PwC, Gartner, Statista).',
                    'Bases de dados abertas e dados contábeis de empresas de capital aberto do segmento.'
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        id: 'j1_mw1',
        milestoneCode: 'Marco 1 Wadhwani Ignite',
        title: 'Validar problema e solução inicial (Revisão)',
        objective: 'Primeiro ponto de revisão e consolidação de evidências.',
        conclusionOutcome: 'Problema importante + solução inicial + evidência de clientes.',
        submissionReview: 'SUBIR ARQUIVO — Apresentação/Pitch ou material solicitado pela plataforma.',
        sections: [
          {
            id: 'j1_mw1_s1',
            sectionCode: 'M1.1',
            title: 'Submissão e Feedback do Marco 1',
            objective: 'Submeter deck/apresentação de validação do problema e solução inicial.',
            questions: [
              {
                id: 'j1_mw1_f1',
                questionNumber: 1,
                title: 'Feedback/revisão do marco: Apresentação/Pitch do Marco 1.',
                field: 'j1_mw1_f1',
                type: 'file_upload',
                required: true,
                specialComponent: 'pitch_marco1_review',
                guidance: 'SUBIR ARQUIVO — Apresentação/Pitch ou material solicitado pela plataforma. Veja a síntese dos módulos anteriores abaixo.'
              },
              {
                id: 'j1_mw1_t1',
                questionNumber: 2,
                title: 'Resumo das principais evidências e decisões consolidadas neste Marco 1.',
                field: 'j1_mw1_t1',
                type: 'long_text',
                required: true,
                guidance: 'Resuma em tópicos os aprendizados que liberam o avanço para o protótipo.',
                placeholder: 'Ex.: 1. Problema validado com 12 clínicas (taxa de dor 9/10); 2. Solução aprovada em conceito; 3. Formato Web SaaS definido...'
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m5',
        milestoneCode: 'Módulo 5',
        title: 'Desenvolver e validar um protótipo',
        objective: 'Demonstrar como a solução ganha vida e aprender com usuários/clientes.',
        conclusionOutcome: 'Protótipo, participantes, feedback e ajustes.',
        sections: [
          {
            id: 'j1_5_1',
            sectionCode: '5.1',
            title: 'Construir seu protótipo',
            objective: 'Criar representação da solução.',
            questions: [
              {
                id: 'j1_5_1_q1',
                questionNumber: 1,
                title: 'Qual será o formato do protótipo e quais funcionalidades serão incluídas/excluídas?',
                field: 'j1_5_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Físico, digital ou conceitual; explique como será apresentado.',
                placeholder: 'Ex.: Mockup no Figma navegável com fluxo de confirmação e disparo...'
              },
              {
                id: 'j1_5_1_q4',
                questionNumber: 2,
                title: 'Carregue uma imagem em alta resolução do protótipo.',
                field: 'j1_5_1_q4',
                type: 'file_upload',
                required: true,
                guidance: 'SUBIR ARQUIVO: Tamanho máximo de 1 MB.'
              },
              {
                id: 'j1_5_1_q5',
                questionNumber: 3,
                title: 'Carregue outra foto do protótipo (opcional).',
                field: 'j1_5_1_q5',
                type: 'file_upload',
                required: false,
                guidance: 'SUBIR ARQUIVO: Tamanho máximo de 1 MB.'
              },
              {
                id: 'j1_5_1_q6',
                questionNumber: 4,
                title: 'Com quem você validará o protótipo?',
                field: 'j1_5_1_q6',
                type: 'short_text',
                required: true,
                guidance: 'Identifique principais usuários/clientes.',
                placeholder: 'Ex.: 6 donos de clínica e 4 secretárias'
              }
            ]
          },
          {
            id: 'j1_5_2',
            sectionCode: '5.2 & 5.3',
            title: 'Coletar Feedback e Revisar Insights',
            objective: 'Registrar reação, participação e refinar protótipo com base no feedback.',
            questions: [
              {
                id: 'j1_5_2_q1',
                questionNumber: 1,
                title: 'Quantas pessoas se envolveram diretamente com o protótipo?',
                field: 'j1_5_2_q1',
                type: 'number',
                required: true,
                guidance: 'Número.',
                placeholder: 'Ex.: 10'
              },
              {
                id: 'j1_5_2_q2',
                questionNumber: 2,
                title: 'Quantas gostaram/amaram e quantas ficaram neutras ou insatisfeitas?',
                field: 'j1_5_2_q2',
                type: 'short_text',
                required: true,
                guidance: 'Números e observação comportamental.',
                placeholder: 'Ex.: 8 amaram, 2 neutras...'
              },
              {
                id: 'j1_5_3_q1',
                questionNumber: 3,
                title: 'Quais aspectos os usuários adoraram e quais não agradaram?',
                field: 'j1_5_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Liste.',
                placeholder: 'Ex.: Adoraram: velocidade de resposta; Não agradaram: texto muito formal...'
              },
              {
                id: 'j1_5_3_q3',
                questionNumber: 4,
                title: 'O que você precisa para construir um protótipo mais funcional?',
                field: 'j1_5_3_q3',
                type: 'long_text',
                required: true,
                guidance: 'Laboratório, dados, fundos, especialistas etc.',
                placeholder: 'Ex.: Integração oficial com API do WhatsApp Business e servidor em nuvem...'
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m6',
        milestoneCode: 'Módulo 6',
        title: 'Estimar oportunidade e analisar concorrentes em profundidade',
        objective: 'Aprofundar concorrência e revisar TAM/SAM/SOM.',
        conclusionOutcome: 'Benchmark competitivo e dimensionamento revisado.',
        sections: [
          {
            id: 'j1_6_1',
            sectionCode: '6.1',
            title: 'Análise da Concorrência',
            objective: 'Comparar concorrentes relevantes.',
            questions: [
              {
                id: 'j1_6_1_q1',
                questionNumber: 1,
                title: 'Concorrentes Brasileiros e Globais (pontos fortes e fracos).',
                field: 'j1_6_1_q1',
                type: 'long_text',
                required: true,
                specialComponent: 'competitor_pros_cons',
                guidance: 'Adicione concorrentes diretos/indiretos mapeando pontos fortes, fracos e preços.',
                placeholder: 'Ex.: Concorrente A: Forte em agenda, fraco em automação WhatsApp...'
              },
              {
                id: 'j1_6_1_q5',
                questionNumber: 2,
                title: 'Como seu produto/serviço será melhor? Liste 3 fatores.',
                field: 'j1_6_1_q5',
                type: 'long_text',
                required: true,
                guidance: 'Diferenciais concretos e vantagens competitivas percebidas pelo cliente.',
                placeholder: 'Ex.: 1. Disparo inteligente em 2 cliques; 2. Sem taxa de setup; 3. Integração nativa de agenda...'
              }
            ]
          },
          {
            id: 'j1_6_2',
            sectionCode: '6.2',
            title: 'Avaliação de Oportunidades (TAM / SAM / SOM)',
            objective: 'Refinar TAM e estimar SAM/SOM.',
            questions: [
              {
                id: 'j1_6_2_q1',
                questionNumber: 1,
                title: 'Qual é a estimativa TAM revisada?',
                field: 'j1_6_2_q1',
                type: 'short_text',
                required: true,
                guidance: 'Total Addressable Market: Receita global/nacional potencial máxima se tivesse 100% de market share.',
                placeholder: 'Ex.: R$ 1.2 bilhão/ano',
                helpGuide: {
                  title: 'TAM (Total Addressable Market)',
                  explanation: 'O TAM é o universo total de demanda pelo seu produto se não houvesse barreiras geográficas ou concorrentes.',
                  calculationFormula: 'TAM = Universo Total de Clientes × Gasto Anual Médio',
                  calculatorType: 'tam',
                  example: 'Ex.: 120.000 clínicas no Brasil × R$ 10.000/ano = R$ 1,2 Bilhão/ano'
                }
              },
              {
                id: 'j1_6_2_q2',
                questionNumber: 2,
                title: 'Quais são as suposições para calcular o SAM e qual é o SAM?',
                field: 'j1_6_2_q2',
                type: 'long_text',
                required: true,
                guidance: 'Serviceable Addressable Market: Parcela do TAM que sua empresa realmente consegue atender com seu modelo atual, canais e geografia.',
                placeholder: 'Ex.: Clínicas no estado de SP (35.000 clínicas com faturamento acima de R$ 50k/mês) = R$ 350 milhões/ano',
                helpGuide: {
                  title: 'SAM (Serviceable Addressable Market)',
                  explanation: 'O SAM é o mercado que você pode atender com seu produto atual, localização geográfica e canais de distribuição.',
                  calculationFormula: 'SAM = Clientes no seu Segmento/Região de Atuação × Gasto Anual Médio',
                  calculatorType: 'sam',
                  example: 'Ex.: 35.000 clínicas em SP que utilizam software em nuvem × R$ 10.000/ano = R$ 350 Milhões/ano'
                }
              },
              {
                id: 'j1_6_2_q4',
                questionNumber: 3,
                title: 'Quais são as suposições para calcular o SOM, preço médio e estimativa SOM?',
                field: 'j1_6_2_q4',
                type: 'long_text',
                required: true,
                guidance: 'Serviceable Obtainable Market: Parcela do SAM que você planeja capturar realisticamente nos primeiros 1 a 3 anos.',
                placeholder: 'Ex.: Meta de 300 clínicas no 1º ano e 800 no 2º ano × R$ 350/mês (R$ 4.200/ano) = SOM de R$ 3,36 milhões/ano',
                helpGuide: {
                  title: 'SOM (Serviceable Obtainable Market)',
                  explanation: 'O SOM é sua meta real e atingível de receita no curto/médio prazo (1-3 anos), considerando capacidade da equipe comercial e marketing.',
                  calculationFormula: 'SOM = Meta Realista de Clientes Ativos em 1-3 Anos × Ticket Anual',
                  calculatorType: 'som',
                  example: 'Ex.: Meta de 800 clínicas ativas em 2 anos × R$ 4.200/ano = SOM de R$ 3,36 Milhões/ano (0,96% do SAM).'
                }
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m7',
        milestoneCode: 'Módulo 7',
        title: 'Desenvolver Modelos de Negócios',
        objective: 'Definir monetização e consolidar o modelo no Lean Canvas.',
        conclusionOutcome: 'Modelo de receita, preço, UVP, canais, custos, métricas e vantagem injusta.',
        sections: [
          {
            id: 'j1_7_1',
            sectionCode: '7.1',
            title: 'Modelos de Receita e Preços',
            objective: 'Escolher monetização por segmento.',
            questions: [
              {
                id: 'j1_7_1_q1',
                questionNumber: 1,
                title: 'Selecione um modelo de receita para o segmento primário.',
                field: 'j1_7_1_q1',
                type: 'select',
                required: true,
                guidance: 'Selecione o formato de precificação e monetização principal.',
                options: [
                  { value: 'SaaS / Assinatura Recorrente', label: 'SaaS / Assinatura Recorrente' },
                  { value: 'Venda Direta / E-commerce', label: 'Venda Direta / E-commerce' },
                  { value: 'Marketplace / Comissão por Transação', label: 'Marketplace / Comissão por Transação' },
                  { value: 'Freemium com Upgrade Premium', label: 'Freemium com Upgrade Premium' },
                  { value: 'Pay-per-use (Cobrança por Volume/Uso)', label: 'Pay-per-use (Cobrança por Volume/Uso)' },
                  { value: 'Licenciamento / Setup Enterprise', label: 'Licenciamento / Setup Enterprise' },
                  { value: 'Publicidade / Patrocínio / Afiliados', label: 'Publicidade / Patrocínio / Afiliados' },
                  { value: 'Prestação de Serviços / Horas / Sucesso', label: 'Prestação de Serviços / Horas / Sucesso' },
                  { value: 'Outro', label: 'Outro (especificar)' }
                ]
              },
              {
                id: 'j1_7_1_q3',
                questionNumber: 2,
                title: 'Modelo de receita para segmento secundário (se houver).',
                field: 'j1_7_1_q3',
                type: 'select',
                required: false,
                guidance: 'Se houver.',
                options: [
                  { value: 'Não se aplica / Sem segmento secundário', label: 'Não se aplica / Sem segmento secundário' },
                  { value: 'SaaS / Assinatura Recorrente', label: 'SaaS / Assinatura Recorrente' },
                  { value: 'Venda Direta / E-commerce', label: 'Venda Direta / E-commerce' },
                  { value: 'Marketplace / Comissão', label: 'Marketplace / Comissão' },
                  { value: 'Freemium com Upgrade', label: 'Freemium com Upgrade' },
                  { value: 'Pay-per-use (Por uso)', label: 'Pay-per-use (Por uso)' },
                  { value: 'Licenciamento / Enterprise', label: 'Licenciamento / Enterprise' },
                  { value: 'Outro', label: 'Outro (especificar)' }
                ]
              }
            ]
          },
          {
            id: 'j1_7_2',
            sectionCode: '7.2',
            title: 'Construir o Lean Canvas da startup/negócio',
            objective: 'Consolidar o modelo.',
            questions: [
              {
                id: 'j1_7_2_q1',
                questionNumber: 1,
                title: 'Qual é a Proposta de Valor Única (UVP)?',
                field: 'j1_7_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'O que torna a solução única e quais benefícios específicos existem?',
                placeholder: 'Ex.: Redução garantida de 80% no no-show com ativação em menos de 10 minutos...'
              },
              {
                id: 'j1_7_2_q2',
                questionNumber: 2,
                title: 'Quais canais de distribuição serão usados?',
                field: 'j1_7_2_q2',
                type: 'long_text',
                required: true,
                guidance: 'Como o produto/serviço será entregue ao cliente.',
                placeholder: 'Ex.: Vendas diretas por Inside Sales e anúncios direcionados...'
              },
              {
                id: 'j1_7_2_q3',
                questionNumber: 3,
                title: 'Quais serão as principais áreas de custos/despesas e métricas de desempenho?',
                field: 'j1_7_2_q3',
                type: 'long_text',
                required: true,
                guidance: 'Categorias de custo e indicadores (CAC, retenção, MRR etc.).',
                placeholder: 'Ex.: Custos: Servidor, API WhatsApp, Vendas. Métricas: MRR, Churn, LTV...'
              },
              {
                id: 'j1_7_2_q5',
                questionNumber: 4,
                title: 'Qual é a vantagem injusta?',
                field: 'j1_7_2_q5',
                type: 'long_text',
                required: true,
                guidance: 'Elemento difícil de copiar e relevante para a vantagem competitiva.',
                placeholder: 'Ex.: Parceria exclusiva com a maior associação regional de clínicas...'
              }
            ]
          }
        ]
      },
      {
        id: 'j1_mw2',
        milestoneCode: 'Marco 2 Wadhwani Ignite',
        title: 'Solução, mercado e modelo (Revisão)',
        objective: 'Revisar protótipo, necessidades, receita, Lean Canvas e mercado.',
        conclusionOutcome: 'Material de marco + revisão.',
        submissionReview: 'SUBIR ARQUIVO — apresentação ou documento de marco conforme exigência do programa.',
        sections: [
          {
            id: 'j1_mw2_s1',
            sectionCode: 'M2.1',
            title: 'Submissão e Feedback do Marco 2',
            objective: 'Submeter o relatório e pitch consolidado do modelo e mercado.',
            questions: [
              {
                id: 'j1_mw2_f1',
                questionNumber: 1,
                title: 'Material para submissão/revisão: Apresentação ou documento de marco.',
                field: 'j1_mw2_f1',
                type: 'file_upload',
                required: true,
                specialComponent: 'marco2_review',
                guidance: 'SUBIR ARQUIVO — Apresentação ou documento de marco com protótipo e modelo de negócio.'
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m8',
        milestoneCode: 'Módulo 8',
        title: 'Estratégia de Marketing e Vendas',
        objective: 'Planejar GTM, vendas, serviço e pitch comercial.',
        conclusionOutcome: 'Canais, KPIs, vendas, atendimento e pitch.',
        sections: [
          {
            id: 'j1_8_1',
            sectionCode: '8.1 & 8.2',
            title: 'Estratégia GTM e Abordagem de Vendas',
            objective: 'Definir canais digitais/físicos, métricas, processo de atendimento e parcerias.',
            questions: [
              {
                id: 'j1_8_1_q1',
                questionNumber: 1,
                title: 'Quais principais canais digitais e físicos/tradicionais usar?',
                field: 'j1_8_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Google Ads, Meta, LinkedIn, eventos, feiras etc.',
                placeholder: 'Ex.: Instagram Ads segmentado por interesse + estande em congressos...'
              },
              {
                id: 'j1_8_1_q4',
                questionNumber: 2,
                title: 'Quais métricas/KPIs medirão o GTM e em quais regiões focará no primeiro ano?',
                field: 'j1_8_1_q4',
                type: 'long_text',
                required: true,
                guidance: 'Defina os indicadores chave de desempenho de Go-To-Market (CAC, LTV, taxa de conversão do funil) e o foco geográfico inicial.',
                placeholder: 'Ex.: CAC alvo < R$ 450, Conversão Lead-to-Sale 12%, Foco regional no Estado de São Paulo e Grande BH...',
                helpGuide: {
                  title: 'Métricas e KPIs de Go-To-Market (GTM)',
                  explanation: 'Métricas de GTM medem a eficiência com que você adquire e retém clientes pagantes.',
                  calculationFormula: 'CAC = Investimento ÷ Novos Clientes | LTV = Ticket × Tempo de Retenção',
                  calculatorType: 'cac_ltv',
                  steps: [
                    'CAC (Custo de Aquisição de Clientes) = Total investido em Mkt e Vendas ÷ Novos clientes conquistados.',
                    'LTV (Lifetime Value) = Valor total que o cliente gera durante todo o relacionamento.',
                    'Relação LTV/CAC: O benchmark saudável é LTV/CAC ≥ 3x.',
                    'Payback do CAC: Em quantos meses o cliente se paga (ideal < 12 meses).'
                  ]
                }
              },
              {
                id: 'j1_8_2_q3',
                questionNumber: 3,
                title: 'Como fornecerá atendimento, responderá dúvidas e medirá satisfação (NPS)?',
                field: 'j1_8_2_q3',
                type: 'long_text',
                required: true,
                guidance: 'Descreva os canais de suporte, SLA de resposta e metodologia de medição de NPS/CSAT.',
                placeholder: 'Ex.: Suporte via WhatsApp dedicado com resposta em até 10 min. Pesquisa de NPS automatizada a cada 60 dias...',
                helpGuide: {
                  title: 'Atendimento e Medição de NPS (Net Promoter Score)',
                  explanation: 'O NPS mede a fidelidade dos clientes através da pergunta: "Em uma escala de 0 a 10, o quanto você recomendaria nossa empresa para um amigo ou colega?".',
                  calculationFormula: 'NPS = ((Promotores - Detratores) / Total de Respostas) × 100',
                  calculatorType: 'nps',
                  benchmarks: [
                    'Excelente (Zona de Encantamento): NPS 75 a 100',
                    'Muito Bom (Zona de Qualidade): NPS 50 a 74',
                    'Razoável (Zona de Aperfeiçoamento): NPS 0 a 49',
                    'Crítico: NPS negativo'
                  ]
                }
              }
            ]
          },
          {
            id: 'j1_8_3',
            sectionCode: '8.3',
            title: 'Construir Pitch de Vendas',
            objective: 'Criar a narrativa comercial e presença mínima.',
            questions: [
              {
                id: 'j1_8_3_q1',
                questionNumber: 1,
                title: 'Escreva um roteiro para vídeo de pitch de 45–60 segundos.',
                field: 'j1_8_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Problema → solução → benefícios → diferencial → CTA.',
                placeholder: 'Ex.: Sua clínica perde dinheiro com horários vazios? O Lumina resolve...'
              },
              {
                id: 'j1_8_3_q2',
                questionNumber: 2,
                title: 'Insira o link do vídeo de pitch.',
                field: 'j1_8_3_q2',
                type: 'short_text',
                required: true,
                guidance: 'URL do vídeo (YouTube, Loom, Vimeo).',
                placeholder: 'https://loom.com/share/...'
              },
              {
                id: 'j1_8_3_q3',
                questionNumber: 3,
                title: 'Crie um site/página de destino/conta de mídia social e insira o link.',
                field: 'j1_8_3_q3',
                type: 'short_text',
                required: true,
                guidance: 'Mostre UVP, benefícios, recursos e CTA.',
                placeholder: 'https://luminadental.com.br'
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m9',
        milestoneCode: 'Módulo 9',
        title: 'Gestão Financeira para Rentabilidade',
        objective: 'Construir premissas, P&L e análise financeira.',
        conclusionOutcome: 'Premissas, projeções, unit economics, receita/lucro e break-even.',
        sections: [
          {
            id: 'j1_9_1',
            sectionCode: '9.1',
            title: 'Premissas de Custos e Vendas',
            objective: 'Mapear custos dos próximos 12 meses e documentar suposições de vendas.',
            questions: [
              {
                id: 'j1_9_1_q1',
                questionNumber: 1,
                title: 'Identifique os principais custos que sua startup incorrerá nos próximos 12 meses. Além disso, documente suas suposições em relação às vendas esperadas.',
                field: 'j1_9_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Mapeie os custos operacionais (tecnologia, marketing, pessoas) e detalhe as premissas de volume e preços de vendas esperadas.',
                placeholder: 'Ex.: Custos: R$ 3k/mês infraestrutura + R$ 8k equipe. Suposições de vendas: 15 novos clientes/mês com ticket de R$ 350...',
                helpGuide: {
                  title: 'Premissas de Custos e Vendas (12 Meses)',
                  explanation: 'Mapear os custos essenciais fixos e variáveis e relacionar com o volume de vendas projetado.',
                  calculationFormula: 'Custos Totais = (Custos Fixos Mensais × 12) + Custos de Pessoal + Marketing',
                  calculatorType: 'costs_projection',
                  steps: [
                    '1. Liste os custos de infraestrutura e softwares essenciais.',
                    '2. Estime o investimento mensal em aquisição de clientes (marketing).',
                    '3. Calcule a folha salarial ou pró-labore da equipe.',
                    '4. Defina o volume mensal esperado de novos clientes e vendas.'
                  ]
                }
              }
            ]
          },
          {
            id: 'j1_9_2',
            sectionCode: '9.2',
            title: 'Projeção de Receitas, Custos e Lucros',
            objective: 'Projetar receitas, custos e lucros e analisar viabilidade e praticidade.',
            questions: [
              {
                id: 'j1_9_2_q1',
                questionNumber: 1,
                title: 'Projete as receitas, custos e lucros da sua startup para os próximos 12 meses e analise-os quanto à viabilidade/praticidade.',
                field: 'j1_9_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Projete as receitas brutas, custos totais e lucro operacional líquido para os próximos 12 meses, analisando a viabilidade prática.',
                placeholder: 'Ex.: Receita projetada ano 1: R$ 180.000. Custos totais: R$ 115.000. Lucro líquido projetado: R$ 65.000 (Margem de 36%, viável com tração comercial)...',
                helpGuide: {
                  title: 'Projeção de Receitas, Custos e Lucros',
                  explanation: 'Calcule a receita anual esperada menos os custos operacionais totais para encontrar o lucro líquido e a margem de lucro.',
                  calculationFormula: 'Lucro Líquido = Receita Total Projetada - Custos Totais | Margem = (Lucro / Receita) × 100',
                  calculatorType: 'profit_margin',
                  steps: [
                    '1. Multiplique a quantidade estimada de vendas pelo preço médio anual.',
                    '2. Subtraia a soma de todos os custos fixos e variáveis do ano.',
                    '3. Analise se a margem de lucro resultante é suficiente para sustentar o crescimento.'
                  ]
                }
              }
            ]
          },
          {
            id: 'j1_9_3',
            sectionCode: '9.3',
            title: 'Saúde Financeira e Captação de Recursos',
            objective: 'Analisar saúde financeira, sustentabilidade de caixa e captação de recursos.',
            questions: [
              {
                id: 'j1_9_3_q1',
                questionNumber: 1,
                title: 'Analise suas receitas/lucros projetados para obter insights sobre saúde financeira e captação de recursos',
                field: 'j1_9_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Avalie a sustentabilidade do fluxo de caixa, mês em que atinge o ponto de equilíbrio (break-even) e necessidades de capital ou investimento externo.',
                placeholder: 'Ex.: Ponto de equilíbrio atingido no 7º mês (com 45 clientes). Necessidade de capital de giro de R$ 40.000 para cobrir o déficit inicial de tração...',
                helpGuide: {
                  title: 'Ponto de Equilíbrio (Break-even) e Saúde Financeira',
                  explanation: 'O ponto de equilíbrio indica quando as receitas mensais superam os custos, apontando se o negócio precisa de aporte financeiro.',
                  calculationFormula: 'Vendas para Break-even = Custos Fixos Mensais ÷ (Preço Unitário - Custo Variável)',
                  calculatorType: 'breakeven',
                  steps: [
                    '1. Calcule a margem de contribuição unitária (Preço - Custo Variável).',
                    '2. Divida os custos fixos mensais pela margem unitária para encontrar as vendas mínimas.',
                    '3. Compare com o caixa disponível para estimar a necessidade de captação (runway).'
                  ]
                }
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m10',
        milestoneCode: 'Módulo 10',
        title: 'Requisitos de Equipe e Talentos',
        objective: 'Registrar capacidade da equipe.',
        conclusionOutcome: 'Perfis, habilidades, funções e compromisso.',
        sections: [
          {
            id: 'j1_10_1',
            sectionCode: '10.1',
            title: 'Perfis dos membros da equipe',
            objective: 'Cadastrar membros da equipe e calcular a composição do time.',
            questions: [
              {
                id: 'j1_10_1_q1',
                questionNumber: 1,
                title: 'Cadastro e Composição da Equipe de Fundadores e Colaboradores',
                field: 'j1_10_1_q1',
                type: 'long_text',
                required: true,
                specialComponent: 'team_members',
                guidance: 'Cadastre todos os membros da equipe no painel interativo abaixo, indicando nome, papel, habilidades e dedicação.',
                placeholder: 'Utilize o gerenciador de membros abaixo para adicionar os fundadores e colaboradores...'
              },
              {
                id: 'j1_10_1_f2',
                questionNumber: 2,
                title: 'Foto ou documento com organograma da equipe.',
                field: 'j1_10_1_f2',
                type: 'file_upload',
                required: false,
                guidance: 'SUBIR ARQUIVO: Organograma ou fotos da equipe.'
              }
            ]
          }
        ]
      },
      {
        id: 'j1_m11',
        milestoneCode: 'Módulo 11',
        title: 'Viabilidade, próximos passos e pitch',
        objective: 'Avaliar confiança, planejar 12 meses e preparar narrativa final.',
        conclusionOutcome: 'Índice de viabilidade, forças/lacunas, metas trimestrais, missão e pitch.',
        sections: [
          {
            id: 'j1_11_1',
            sectionCode: '11.1',
            title: 'Autoavaliação de Viabilidade (Escala 1–5 & Índice Automático)',
            objective: 'Avaliar confiança em afirmações centrais.',
            questions: [
              {
                id: 'j1_11_1_q1',
                questionNumber: 1,
                title: '1. A indústria-alvo é grande e tem alto potencial de crescimento.',
                field: 'j1_11_1_q1',
                type: 'scale_1_5',
                required: true,
                guidance: '1 = nada confiante; 5 = muito confiante.'
              },
              {
                id: 'j1_11_1_q2',
                questionNumber: 2,
                title: '2. Entendemos as necessidades e desejos dos segmentos-alvo.',
                field: 'j1_11_1_q2',
                type: 'scale_1_5',
                required: true,
                guidance: '1–5.'
              },
              {
                id: 'j1_11_1_q3',
                questionNumber: 3,
                title: '3. Podemos construir um protótipo funcional em breve.',
                field: 'j1_11_1_q3',
                type: 'scale_1_5',
                required: true,
                guidance: '1–5.'
              },
              {
                id: 'j1_11_1_q4',
                questionNumber: 4,
                title: '4. Nossa proposta de valor é diferenciada dos concorrentes.',
                field: 'j1_11_1_q4',
                type: 'scale_1_5',
                required: true,
                guidance: '1–5.'
              },
              {
                id: 'j1_11_1_q5',
                questionNumber: 5,
                title: '5. Nossa equipe possui habilidades e conhecimento necessários.',
                field: 'j1_11_1_q5',
                type: 'scale_1_5',
                required: true,
                guidance: '1–5.'
              },
              {
                id: 'j1_11_1_q6',
                questionNumber: 6,
                title: '6. Nosso modelo de receita e preços produzirá renda sustentável.',
                field: 'j1_11_1_q6',
                type: 'scale_1_5',
                required: true,
                guidance: '1–5.'
              },
              {
                id: 'j1_11_1_q7',
                questionNumber: 7,
                title: '7. Nossa equipe está comprometida com missão, visão e objetivos.',
                field: 'j1_11_1_q7',
                type: 'scale_1_5',
                required: true,
                guidance: '1–5.'
              },
              {
                id: 'j1_11_1_q8',
                questionNumber: 8,
                title: '8. Nossas projeções financeiras são realistas e alcançáveis.',
                field: 'j1_11_1_q8',
                type: 'scale_1_5',
                required: true,
                guidance: '1–5.'
              },
              {
                id: 'j1_11_1_q9',
                questionNumber: 9,
                title: '9. Nossa estratégia de marketing e vendas irá gerar leads e clientes.',
                field: 'j1_11_1_q9',
                type: 'scale_1_5',
                required: true,
                guidance: '1–5.'
              },
              {
                id: 'j1_11_1_q10',
                questionNumber: 10,
                title: 'Índice de Viabilidade de Negócio (Resultado Automático 0–100)',
                field: 'j1_11_1_q10',
                type: 'auto_calc_viability',
                required: true,
                guidance: 'Calcular automaticamente: média das 9 respostas ÷ 5 × 100.'
              },
              {
                id: 'j1_11_1_q11',
                questionNumber: 11,
                title: 'Quais são os principais pontos fortes do negócio e áreas de melhoria?',
                field: 'j1_11_1_q11',
                type: 'long_text',
                required: true,
                guidance: 'Baseie-se na autoavaliação.',
                placeholder: 'Ex.: Fortes: diferenciação técnica; Melhoria: velocidade de tração inicial...'
              }
            ]
          },
          {
            id: 'j1_11_2',
            sectionCode: '11.2 & 11.3',
            title: 'Plano de 12 Meses, Pitch e Mentoria',
            objective: 'Planejar os 12 meses seguintes e montar narrativa final.',
            questions: [
              {
                id: 'j1_11_2_q1',
                questionNumber: 1,
                title: 'Metas e marcos para os próximos 12 meses (trimestre a trimestre).',
                field: 'j1_11_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'M1-3, M4-6, M7-9, M10-12 (metas, fundos e recursos).',
                placeholder: 'Ex.: M1-3: MVP validado; M4-6: 50 clientes; M7-9: Break-even; M10-12: Escala...'
              },
              {
                id: 'j1_11_3_q4',
                questionNumber: 2,
                title: 'Insira o roteiro da História de Negócio para um pitch de 4–5 minutos.',
                field: 'j1_11_3_q4',
                type: 'long_text',
                charLimit: 3000,
                required: true,
                guidance: 'Máximo 3.000 caracteres; problema → solução → mercado → evidências → modelo → futuro.',
                placeholder: 'Ex.: Escreva o roteiro completo de pitch...'
              },
              {
                id: 'j1_11_3_f5',
                questionNumber: 3,
                title: 'Carregue o material final do pitch.',
                field: 'j1_11_3_f5',
                type: 'file_upload',
                required: true,
                guidance: 'SUBIR ARQUIVO: Apresentação/PPTX ou outro material final.'
              },
              {
                id: 'j1_11_4_q2',
                questionNumber: 4,
                title: 'Em quais áreas você precisa de mentoria e quem são seus mentores?',
                field: 'j1_11_4_q2',
                type: 'long_text',
                required: true,
                guidance: 'Tecnologia, produto, estratégia, testes, marketing, vendas, captação etc.',
                placeholder: 'Ex.: Mentoria em Go-To-Market B2B e precificação SaaS...'
              }
            ]
          }
        ]
      },
      {
        id: 'j1_mw3',
        milestoneCode: 'Marco 3 Wadhwani Ignite',
        title: 'Final da Jornada (Pitch Final & Dossiê Executivo)',
        objective: 'Concluir a jornada, gerar o relatório consolidado executivo e preparar o empreendimento para a banca.',
        conclusionOutcome: 'Relatório Executivo Completo + Pitch Final + Dossiê Baixável em PDF.',
        submissionReview: 'SUBIR ARQUIVO — PPTX / Apresentação do projeto e visualização do Dossiê.',
        sections: [
          {
            id: 'j1_mw3_s1',
            sectionCode: 'M3.1',
            title: 'Submissão Final e Dossiê do Projeto',
            objective: 'Submeter deck final e exportar o relatório do projeto.',
            questions: [
              {
                id: 'j1_mw3_f1',
                questionNumber: 1,
                title: 'Dossiê do Projeto & Relatório Executivo Consolidado',
                field: 'j1_mw3_f1',
                type: 'file_upload',
                required: true,
                specialComponent: 'marco3_dossier_report',
                guidance: 'Visualize abaixo o relatório consolidado com todos os dados dos Marcos 0, 1, 2 e 3 e faça o download em PDF para a banca examinadora.'
              }
            ]
          }
        ]
      }
    ]
  },
  jornada_2: {
    id: 'jornada_2',
    title: '2. DESENVOLVIMENTO DE NOVO PRODUTO/SERVIÇO',
    shortTitle: 'Novo Produto ou Serviço',
    subtitle: 'Criar um novo produto/serviço dentro de seis marcos robustos, priorizando descoberta, experiência, protótipo, viabilidade e lançamento.',
    logicDescription: 'Oportunidade & Resultado → Descoberta de Necessidade → Conceito & Escopo → Protótipo & Validação → Viabilidade → Piloto & Lançamento',
    icon: 'Package',
    badge: 'Novo Produto / Linha',
    milestones: [
      {
        id: 'j2_m1',
        milestoneCode: 'Módulo 1',
        title: 'Definir oportunidade e resultado',
        objective: 'Entender o contexto do novo produto e qual resultado precisa mudar.',
        conclusionOutcome: 'Problema/oportunidade, usuário, comprador, outcome e contexto.',
        sections: [
          {
            id: 'j2_1_1',
            sectionCode: '1.1',
            title: 'Contexto do produto',
            objective: 'Definir o que será desenvolvido sem começar pela lista de features.',
            questions: [
              {
                id: 'j2_1_1_q1',
                questionNumber: 1,
                title: 'Qual produto/serviço você quer desenvolver?',
                field: 'j2_1_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Descrição inicial.',
                placeholder: 'Ex.: Descrição inicial...'
              },
              {
                id: 'j2_1_1_q2',
                questionNumber: 2,
                title: 'Por que ele precisa existir agora?',
                field: 'j2_1_1_q2',
                type: 'long_text',
                required: true,
                guidance: 'Mudança de mercado, estratégia, cliente, tecnologia etc.',
                placeholder: 'Ex.: Oportunidade de mercado...'
              },
              {
                id: 'j2_1_1_q3',
                questionNumber: 3,
                title: 'Qual resultado estratégico o produto deve gerar para a empresa e qual outcome o usuário deve obter?',
                field: 'j2_1_1_q3',
                type: 'long_text',
                required: true,
                guidance: 'Receita, retenção, expansão, eficiência e benefício do usuário.',
                placeholder: 'Ex.: Para a empresa: expansão; Para o usuário: rapidez...'
              }
            ]
          },
          {
            id: 'j2_1_2',
            sectionCode: '1.2',
            title: 'Usuário, comprador e decisor',
            objective: 'Definir os atores do produto.',
            questions: [
              {
                id: 'j2_1_2_q1',
                questionNumber: 1,
                title: 'Quem será o usuário principal, quem compra e quem decide/influencia?',
                field: 'j2_1_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Mapeie papéis e defina segmento foco.',
                placeholder: 'Ex.: Usuário: equipe; Comprador: diretoria...'
              },
              {
                id: 'j2_1_2_q5',
                questionNumber: 2,
                title: 'Que comportamento atual mostra que existe uma necessidade?',
                field: 'j2_1_2_q5',
                type: 'long_text',
                required: true,
                guidance: 'Dado/observação.',
                placeholder: 'Ex.: Clientes gastam 3 horas em planilhas improvisadas...'
              }
            ]
          }
        ]
      },
      {
        id: 'j2_m2',
        milestoneCode: 'Módulo 2',
        title: 'Descoberta de necessidade e oportunidade',
        objective: 'Validar necessidades e escolher a oportunidade de produto.',
        conclusionOutcome: 'Pesquisa de usuários, jornada, fricções e oportunidade.',
        sections: [
          {
            id: 'j2_2_1',
            sectionCode: '2.1 & 2.2',
            title: 'Contexto de Uso e Investigação com Usuários',
            objective: 'Mapear jornada atual, fricções e confrontar hipóteses.',
            questions: [
              {
                id: 'j2_2_1_q1',
                questionNumber: 1,
                title: 'Quais passos o usuário realiza hoje, onde ocorre a maior fricção e como resolve?',
                field: 'j2_2_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Gatilho, fluxo, ponto de dor e alternativas atuais.',
                placeholder: 'Ex.: Descreva a jornada e pontos de dor...'
              },
              {
                id: 'j2_2_2_q1',
                questionNumber: 2,
                title: 'Quem foi pesquisado, quantas pessoas e quais padrões e contradições apareceram?',
                field: 'j2_2_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Critérios, quantidade, insights e validação de hipóteses.',
                placeholder: 'Ex.: 15 entrevistas revelando insatisfação com suporte...'
              }
            ]
          },
          {
            id: 'j2_2_3',
            sectionCode: '2.3',
            title: 'Definir oportunidade',
            objective: 'Escolher oportunidade prioritária.',
            questions: [
              {
                id: 'j2_2_3_q1',
                questionNumber: 1,
                title: 'Qual oportunidade tem maior impacto/valor estratégico e será priorizada no produto?',
                field: 'j2_2_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Escolha e controle de escopo (o que ficará fora).',
                placeholder: 'Ex.: Oportunidade prioritária...'
              }
            ]
          }
        ]
      },
      {
        id: 'j2_m3',
        milestoneCode: 'Módulo 3',
        title: 'Conceito, experiência e escopo',
        objective: 'Criar alternativas e definir uma primeira versão coerente.',
        conclusionOutcome: 'Conceito, diferenciação, fluxo e escopo.',
        sections: [
          {
            id: 'j2_3_1',
            sectionCode: '3.1, 3.2 & 3.3',
            title: 'Conceitos, Experiência e Escopo Mínimo',
            objective: 'Gerar conceitos, definir fluxo de uso e delimitar o que é indispensável.',
            questions: [
              {
                id: 'j2_3_1_q1',
                questionNumber: 1,
                title: 'Qual conceito foi priorizado e por que foi escolhido?',
                field: 'j2_3_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Impacto, viabilidade e diferenciação.',
                placeholder: 'Ex.: Conceito escolhido...'
              },
              {
                id: 'j2_3_2_q1',
                questionNumber: 2,
                title: 'Qual é o primeiro momento de valor e quais passos principais o usuário fará?',
                field: 'j2_3_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Defina fluxo e onde pode haver abandono.',
                placeholder: 'Ex.: Primeiro momento de valor e fluxo...'
              },
              {
                id: 'j2_3_3_q1',
                questionNumber: 3,
                title: 'Quais capacidades são indispensáveis e o que será simulado na 1ª versão?',
                field: 'j2_3_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Lista de indispensáveis vs o que pode esperar.',
                placeholder: 'Ex.: Indispensáveis vs simulações...'
              }
            ]
          }
        ]
      },
      {
        id: 'j2_m4',
        milestoneCode: 'Módulo 4',
        title: 'Protótipo e validação',
        objective: 'Construir e testar a menor versão capaz de gerar aprendizado.',
        conclusionOutcome: 'Protótipo, usuários, evidências, iterações.',
        sections: [
          {
            id: 'j2_4_1',
            sectionCode: '4.1 & 4.2',
            title: 'Construir Protótipo e Testar Usuários',
            objective: 'Representar a solução e observar comportamento.',
            questions: [
              {
                id: 'j2_4_1_q1',
                questionNumber: 1,
                title: 'Qual foi o formato de protótipo utilizado no teste?',
                field: 'j2_4_1_q1',
                type: 'select',
                required: true,
                guidance: 'Selecione o formato do protótipo.',
                options: [
                  { value: 'Mockup Digital Navegável (Figma / Adobe)', label: 'Mockup Digital Navegável (Figma / Adobe)' },
                  { value: 'Protótipo Funcional / MVP Simplificado', label: 'Protótipo Funcional / MVP Simplificado' },
                  { value: 'Mágico de Oz / Operação Manual Oculta', label: 'Mágico de Oz / Operação Manual Oculta' },
                  { value: 'Vídeo Demonstrativo / Landing Page com CTA', label: 'Vídeo Demonstrativo / Landing Page com CTA' },
                  { value: 'Protótipo Físico / Amostra Real', label: 'Protótipo Físico / Amostra Real' }
                ]
              },
              {
                id: 'j2_4_1_f4',
                questionNumber: 2,
                title: 'Carregue o protótipo ou uma representação do protótipo.',
                field: 'j2_4_1_f4',
                type: 'file_upload',
                required: true,
                guidance: 'SUBIR ARQUIVO: Imagem, PDF, Figma exportado ou outro arquivo.'
              },
              {
                id: 'j2_4_2_q1',
                questionNumber: 3,
                title: 'Quantas pessoas participaram e que evidência mostra valor?',
                field: 'j2_4_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Comportamento observado, pontos de dificuldade e o que manter/mudar.',
                placeholder: 'Ex.: 12 usuários testaram, 10 completaram com facilidade...'
              }
            ]
          }
        ]
      },
      {
        id: 'j2_m5',
        milestoneCode: 'Módulo 5',
        title: 'Viabilidade técnica, operacional e econômica',
        objective: 'Verificar se o produto pode ser entregue e sustentado.',
        conclusionOutcome: 'Viabilidade, preço, custos e operação.',
        sections: [
          {
            id: 'j2_5_1',
            sectionCode: '5.1, 5.2 & 5.3',
            title: 'Viabilidade Técnica, Operacional e Modelo Comercial',
            objective: 'Identificar riscos técnicos, fluxo de entrega, pagador e preço.',
            questions: [
              {
                id: 'j2_5_1_q1',
                questionNumber: 1,
                title: 'Quais tecnologias são críticas e como os riscos técnicos serão testados?',
                field: 'j2_5_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Liste tecnologias e experimentos.',
                placeholder: 'Ex.: APIs de mensageria, banco de dados distribuído...'
              },
              {
                id: 'j2_5_2_q1',
                questionNumber: 2,
                title: 'Como será produzido/entregue e onde a operação pode quebrar?',
                field: 'j2_5_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Processo, pessoas e fornecedores críticos.',
                placeholder: 'Ex.: Fluxo de atendimento e contingência...'
              },
              {
                id: 'j2_5_3_q1',
                questionNumber: 3,
                title: 'Quem pagará, qual é a hipótese de preço e custos variáveis?',
                field: 'j2_5_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Pagador, unidade de valor, preço e experimento de disposição a pagar.',
                placeholder: 'Ex.: Empresa paga assinatura mensal de R$ 450...'
              }
            ]
          }
        ]
      },
      {
        id: 'j2_m6',
        milestoneCode: 'Módulo 6',
        title: 'Piloto, lançamento e decisão',
        objective: 'Testar em mercado controlado e preparar lançamento.',
        conclusionOutcome: 'Piloto, GTM inicial, métricas, decisão e próximos passos.',
        sections: [
          {
            id: 'j2_6_1',
            sectionCode: '6.1, 6.2 & 6.3',
            title: 'Piloto Comercial e Decisão de Lançamento',
            objective: 'Executar piloto, preparar entrada e tomar decisão executiva.',
            questions: [
              {
                id: 'j2_6_1_q1',
                questionNumber: 1,
                title: 'Quem participou do piloto, qual oferta foi apresentada e qual métrica principal indicou sucesso?',
                field: 'j2_6_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Perfil, condições, canal e resultado.',
                placeholder: 'Ex.: 5 clientes em beta fechado com 90% de adesão...'
              },
              {
                id: 'j2_6_2_q1',
                questionNumber: 2,
                title: 'Qual segmento receberá primeiro e que condição libera a expansão?',
                field: 'j2_6_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Foco, canal, mensagem e critério de escala.',
                placeholder: 'Ex.: Lançamento restrito a SP antes da expansão nacional...'
              },
              {
                id: 'j2_6_3_q4',
                questionNumber: 3,
                title: 'Qual é a decisão final e qual o próximo marco?',
                field: 'j2_6_3_q4',
                type: 'select',
                required: true,
                guidance: 'Lançar, iterar, testar novamente ou interromper.',
                options: [
                  { value: 'Lançar', label: 'Lançar' },
                  { value: 'Iterar', label: 'Iterar' },
                  { value: 'Testar novamente', label: 'Testar novamente' },
                  { value: 'Interromper', label: 'Interromper' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  jornada_3: {
    id: 'jornada_3',
    title: '3. MELHORIA DE PRODUTO EXISTENTE',
    shortTitle: 'Melhoria de Produto Existente',
    subtitle: 'Aqui a entrada é um produto real com dados, clientes ou desempenho observado. Por isso o processo começa em diagnóstico e baseline, não em ideação.',
    logicDescription: 'Diagnóstico & Baseline → Causa & Oportunidade → Alternativas & Hipótese → Experimentação → Implantação & Impacto → Decisão',
    icon: 'TrendingUp',
    badge: 'Otimização de Desempenho',
    milestones: [
      {
        id: 'j3_m1',
        milestoneCode: 'Módulo 1',
        title: 'Diagnóstico e baseline',
        objective: 'Entender o problema de desempenho.',
        conclusionOutcome: 'Produto, objetivos, métricas e diferença esperado x atual.',
        sections: [
          {
            id: 'j3_1_1',
            sectionCode: '1.1 & 1.2',
            title: 'Contexto e Baseline de Indicadores',
            objective: 'Definir motivo da melhoria e estabelecer números atuais.',
            questions: [
              {
                id: 'j3_1_1_q1',
                questionNumber: 1,
                title: 'Qual produto será melhorado, qual resultado deveria gerar e por que melhorar agora?',
                field: 'j3_1_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Descreva objetivo, motivo e o que está abaixo do esperado (quantifique).',
                placeholder: 'Ex.: Produto X apresenta queda de 15% na retenção após 60 dias...'
              },
              {
                id: 'j3_1_2_q1',
                questionNumber: 2,
                title: 'Quais indicadores medem o produto, qual o valor atual e qual era o esperado?',
                field: 'j3_1_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Dados, meta, segmento pior e fontes.',
                placeholder: 'Ex.: Churn atual: 8.5% (Meta: 3%)...'
              },
              {
                id: 'j3_1_3_q1',
                questionNumber: 3,
                title: 'Quais são as etapas da experiência atual e onde ocorre o abandono/fricção?',
                field: 'j3_1_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Fluxo, dados associados e etapa investigada primeiro.',
                placeholder: 'Ex.: Fricção no onboarding na etapa de importação de contatos...'
              }
            ]
          }
        ]
      },
      {
        id: 'j3_m2',
        milestoneCode: 'Módulo 2',
        title: 'Causa, usuário e oportunidade',
        objective: 'Encontrar causas e não apenas sintomas.',
        conclusionOutcome: 'Causas, entrevistas e oportunidade prioritária.',
        sections: [
          {
            id: 'j3_2_1',
            sectionCode: '2.1 & 2.2',
            title: 'Investigar Causas e Escutar Clientes Atuais',
            objective: 'Testar hipóteses causais e obter evidência qualitativa.',
            questions: [
              {
                id: 'j3_2_1_q1',
                questionNumber: 1,
                title: 'Quais causas podem explicar o problema e qual parece mais provável?',
                field: 'j3_2_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Múltiplas hipóteses, dados associados e lacunas.',
                placeholder: 'Ex.: Hipótese 1: Falta de treinamento da secretária...'
              },
              {
                id: 'j3_2_2_q1',
                questionNumber: 2,
                title: 'Quem foi entrevistado e que descoberta mudou sua visão?',
                field: 'j3_2_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Satisfeitos, insatisfeitos, ex-clientes e comportamento alternativo.',
                placeholder: 'Ex.: 8 clientes cancelados relataram que não sabiam usar a integração...'
              }
            ]
          },
          {
            id: 'j3_2_3',
            sectionCode: '2.3',
            title: 'Definir oportunidade',
            objective: 'Transformar diagnóstico em oportunidade.',
            questions: [
              {
                id: 'j3_2_3_q1',
                questionNumber: 1,
                title: 'Qual oportunidade específica deve ser melhorada e por que priorizar?',
                field: 'j3_2_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Não use feature como primeira resposta; alinhe a segmento e outcome/métrica.',
                placeholder: 'Ex.: Reduzir tempo de ativação de 5 dias para 15 minutos...'
              }
            ]
          }
        ]
      },
      {
        id: 'j3_m3',
        milestoneCode: 'Módulo 3',
        title: 'Alternativas, priorização e hipótese',
        objective: 'Escolher mudança e relação causal.',
        conclusionOutcome: 'Opções, prioridade, hipótese e métrica.',
        sections: [
          {
            id: 'j3_3_1',
            sectionCode: '3.1 & 3.3',
            title: 'Alternativas e Formulação de Hipótese',
            objective: 'Gerar opções, priorizar por esforço/impacto e formular hipótese causal.',
            questions: [
              {
                id: 'j3_3_1_q1',
                questionNumber: 1,
                title: 'Quais mudanças poderiam resolver e qual melhoria foi priorizada?',
                field: 'j3_3_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Alternativas, impacto esperado, esforço e riscos.',
                placeholder: 'Ex.: Criar assistente guiado passo a passo...'
              },
              {
                id: 'j3_3_3_q1',
                questionNumber: 2,
                title: 'Complete: Se fizermos [mudança], então [resultado] deve melhorar porque [razão].',
                field: 'j3_3_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Relação causal, métrica principal, guardrail e resultado confirmador.',
                placeholder: 'Ex.: Se adicionarmos setup automático, o churn cai 50% porque...'
              }
            ]
          }
        ]
      },
      {
        id: 'j3_m4',
        milestoneCode: 'Módulo 4',
        title: 'Experimentação e validação',
        objective: 'Testar antes de implantação.',
        conclusionOutcome: 'Experimento e resultado.',
        sections: [
          {
            id: 'j3_4_1',
            sectionCode: '4.1, 4.2 & 4.3',
            title: 'Desenhar Experimento, Executar e Aprender',
            objective: 'Teste proporcional ao risco, coleta de dados e conclusões.',
            questions: [
              {
                id: 'j3_4_1_q1',
                questionNumber: 1,
                title: 'Qual foi a menor intervenção testada e qual a duração?',
                field: 'j3_4_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'População testada, método de medição e baseline vs resultado.',
                placeholder: 'Ex.: Teste A/B em 50 novas contas durante 14 dias...'
              },
              {
                id: 'j3_4_3_q1',
                questionNumber: 2,
                title: 'A hipótese foi confirmada, parcialmente confirmada ou refutada?',
                field: 'j3_4_3_q1',
                type: 'select',
                required: true,
                guidance: 'Escolha e registre insights.',
                options: [
                  { value: 'Confirmada', label: 'Confirmada' },
                  { value: 'Parcialmente confirmada', label: 'Parcialmente confirmada' },
                  { value: 'Refutada', label: 'Refutada' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'j3_m5',
        milestoneCode: 'Módulo 5',
        title: 'Implantação, impacto e economia',
        objective: 'Passar do teste para produto real.',
        conclusionOutcome: 'Rollout e impacto.',
        sections: [
          {
            id: 'j3_5_1',
            sectionCode: '5.1 & 5.2',
            title: 'Implantação e Medição de Impacto',
            objective: 'Controlar rollout, mensagens, monitoramento e verificar resultado econômico.',
            questions: [
              {
                id: 'j3_5_1_q1',
                questionNumber: 1,
                title: 'Como será o rollout, comunicação, monitoramento e plano de rollback?',
                field: 'j3_5_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Segmento/coorte, métricas e plano de contingência.',
                placeholder: 'Ex.: Liberação de 20% por semana...'
              },
              {
                id: 'j3_5_1_f6',
                questionNumber: 2,
                title: 'Carregue o plano/artefato de implantação, se existir.',
                field: 'j3_5_1_f6',
                type: 'file_upload',
                required: false,
                guidance: 'SUBIR ARQUIVO: Documento, imagem ou planilha.'
              },
              {
                id: 'j3_5_2_q1',
                questionNumber: 3,
                title: 'Qual impacto econômico e resultados foram observados?',
                field: 'j3_5_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Receita, custo, margem, retenção e sustentabilidade do resultado.',
                placeholder: 'Ex.: Retenção subiu para 94%, gerando +R$ 18.000 MRR...'
              }
            ]
          }
        ]
      },
      {
        id: 'j3_m6',
        milestoneCode: 'Módulo 6',
        title: 'Decisão e próximo ciclo',
        objective: 'Concluir a melhoria e definir o próximo problema.',
        conclusionOutcome: 'Decisão explícita e próximo ciclo.',
        sections: [
          {
            id: 'j3_6_1',
            sectionCode: '6.1',
            title: 'Decisão',
            objective: 'Escalar, iterar ou parar.',
            questions: [
              {
                id: 'j3_6_1_q1',
                questionNumber: 1,
                title: 'Qual é a decisão e qual é a próxima oportunidade?',
                field: 'j3_6_1_q1',
                type: 'select',
                required: true,
                guidance: 'Escalar, manter, iterar, testar novamente ou abandonar.',
                options: [
                  { value: 'Escalar', label: 'Escalar' },
                  { value: 'Manter', label: 'Manter' },
                  { value: 'Iterar', label: 'Iterar' },
                  { value: 'Testar novamente', label: 'Testar novamente' },
                  { value: 'Abandonar', label: 'Abandonar' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  jornada_4: {
    id: 'jornada_4',
    title: '4. VALIDAÇÃO DE MODELO EXISTENTE NO MERCADO',
    shortTitle: 'Validação de Modelo Existente',
    subtitle: 'Um modelo que funciona em um contexto pode ser transferido/adaptado para outro mercado, região ou segmento? A jornada começa pela transferibilidade.',
    logicDescription: 'Modelo de Origem & Transferência → Novo Mercado & Cliente Local → Concorrência & Barreiras → Piloto Comercial → Capacidade Operacional → Decisão de Entrada',
    icon: 'Compass',
    badge: 'Transferência de Modelo',
    milestones: [
      {
        id: 'j4_m1',
        milestoneCode: 'Módulo 1',
        title: 'Modelo de origem e transferibilidade',
        objective: 'Entender o que já funciona e o que depende do contexto original.',
        conclusionOutcome: 'Modelo, evidências e hipóteses de transferência.',
        sections: [
          {
            id: 'j4_1_1',
            sectionCode: '1.1 & 1.2',
            title: 'Descrever Modelo Existente e Separar Universal de Contextual',
            objective: 'Registrar modelo atual e identificar o que pode ser transferido.',
            questions: [
              {
                id: 'j4_1_1_q1',
                questionNumber: 1,
                title: 'Qual modelo/produto/serviço será validado, onde funciona hoje e como gera receita?',
                field: 'j4_1_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Mercado de origem, clientes, proposta, modelo e evidências de funcionamento.',
                placeholder: 'Ex.: Modelo de franquia odontológica digital validado em SP...'
              },
              {
                id: 'j4_1_1_f7',
                questionNumber: 2,
                title: 'Carregue apresentação ou documento do modelo original, se disponível.',
                field: 'j4_1_1_f7',
                type: 'file_upload',
                required: false,
                guidance: 'SUBIR ARQUIVO: Documento, deck, planilha etc.'
              },
              {
                id: 'j4_1_2_q1',
                questionNumber: 3,
                title: 'O que continua válido e o que depende de comportamento local/regulação/preço?',
                field: 'j4_1_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Elementos universais vs dependências locais e hipótese crítica de transferência.',
                placeholder: 'Ex.: Universal: necessidade de agendamento; Local: sensibilidade a preço...'
              }
            ]
          }
        ]
      },
      {
        id: 'j4_m2',
        milestoneCode: 'Módulo 2',
        title: 'Novo mercado e cliente local',
        objective: 'Validar a necessidade no contexto-alvo.',
        conclusionOutcome: 'Mercado, segmento, comportamento e evidências locais.',
        sections: [
          {
            id: 'j4_2_1',
            sectionCode: '2.1, 2.2 & 2.3',
            title: 'Mercado-Alvo, Cliente Local e Validação de Necessidade',
            objective: 'Escolher recorte, mapear comportamento local e verificar importância do problema.',
            questions: [
              {
                id: 'j4_2_1_q1',
                questionNumber: 1,
                title: 'Qual país/região/segmento será testado primeiro e por que esse mercado?',
                field: 'j4_2_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Recorte, justificativa e evidências preliminares.',
                placeholder: 'Ex.: Expansão para a Região Sul (Porto Alegre e Curitiba)...'
              },
              {
                id: 'j4_2_2_q1',
                questionNumber: 2,
                title: 'Quem é o segmento prioritário local e o que difere do cliente de origem?',
                field: 'j4_2_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Comportamento, cultura, processo e alternativas locais.',
                placeholder: 'Ex.: Clínicas menores com forte dependência de convênios...'
              },
              {
                id: 'j4_2_2_f6',
                questionNumber: 3,
                title: 'Carregue os resultados da pesquisa/entrevistas, se existirem.',
                field: 'j4_2_2_f6',
                type: 'file_upload',
                required: false,
                guidance: 'SUBIR ARQUIVO: Planilha, documento, transcrição, imagem.'
              }
            ]
          }
        ]
      },
      {
        id: 'j4_m3',
        milestoneCode: 'Módulo 3',
        title: 'Concorrência, adaptação e barreiras',
        objective: 'Descobrir como o modelo deve mudar para competir.',
        conclusionOutcome: 'Concorrentes locais, proposta adaptada, economia e barreiras.',
        sections: [
          {
            id: 'j4_3_1',
            sectionCode: '3.1, 3.2, 3.3 & 3.4',
            title: 'Concorrência Local, Adaptação da Proposta e Barreiras',
            objective: 'Entender alternativas locais, adaptar proposta e mapear barreiras regulatórias/econômicas.',
            questions: [
              {
                id: 'j4_3_1_q1',
                questionNumber: 1,
                title: 'Quais concorrentes diretos locais existem e onde há lacuna?',
                field: 'j4_3_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Substitutos, percepção de preço e qualidade.',
                placeholder: 'Ex.: Concorrentes locais cobram por hora...'
              },
              {
                id: 'j4_3_2_q1',
                questionNumber: 2,
                title: 'Qual benefício central é preservado e o que precisa mudar na proposta de valor?',
                field: 'j4_3_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Núcleo, produto, serviço, preço, linguagem e suporte.',
                placeholder: 'Ex.: Preservada a automação; Adaptado o modelo de cobrança...'
              },
              {
                id: 'j4_3_3_q1',
                questionNumber: 3,
                title: 'Qual preço faz sentido, custos locais e quais barreiras de entrada existem?',
                field: 'j4_3_3_q1',
                type: 'long_text',
                required: true,
                guidance: 'Margem esperada, impostos locais, barreiras regulatórias e de distribuição.',
                placeholder: 'Ex.: Preço R$ 290/mês, impostos municipais...'
              }
            ]
          }
        ]
      },
      {
        id: 'j4_m4',
        milestoneCode: 'Módulo 4',
        title: 'Piloto comercial',
        objective: 'Obter comportamento real no novo mercado.',
        conclusionOutcome: 'Oferta, canal, preço, conversão e aprendizados.',
        sections: [
          {
            id: 'j4_4_1',
            sectionCode: '4.1, 4.2 & 4.3',
            title: 'Desenhar Piloto, Executar e Aprender',
            objective: 'Criar teste mínimo, medir comportamento real e transformar em ajustes.',
            questions: [
              {
                id: 'j4_4_1_q1',
                questionNumber: 1,
                title: 'Quem participou do piloto, qual oferta foi apresentada e quantos compraram/contrataram?',
                field: 'j4_4_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Abordados, avançados, compradores, objeções e condições de fechamento.',
                placeholder: 'Ex.: 20 clínicas abordadas, 6 fecharam contrato piloto...'
              },
              {
                id: 'j4_4_2_f7',
                questionNumber: 2,
                title: 'Carregue os resultados do piloto.',
                field: 'j4_4_2_f7',
                type: 'file_upload',
                required: false,
                guidance: 'SUBIR ARQUIVO: Planilha, relatório, screenshots ou outro material.'
              },
              {
                id: 'j4_4_3_q1',
                questionNumber: 3,
                title: 'Qual foi o resultado da hipótese de transferência do modelo?',
                field: 'j4_4_3_q1',
                type: 'select',
                required: true,
                guidance: 'Selecione o status da hipótese de transferência.',
                options: [
                  { value: 'Hipótese Confirmada (Modelo Transferível com Sucesso)', label: 'Hipótese Confirmada (Modelo Transferível com Sucesso)' },
                  { value: 'Parcialmente Confirmada (Necessita Adaptações Locais)', label: 'Parcialmente Confirmada (Necessita Adaptações Locais)' },
                  { value: 'Hipótese Refutada (Modelo Inviável neste Novo Mercado)', label: 'Hipótese Refutada (Modelo Inviável neste Novo Mercado)' }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'j4_m5',
        milestoneCode: 'Módulo 5',
        title: 'Capacidade operacional e escalabilidade',
        objective: 'Verificar se o modelo suporta expansão.',
        conclusionOutcome: 'Operação, pessoas, parceiros e finanças.',
        sections: [
          {
            id: 'j4_5_1',
            sectionCode: '5.1 & 5.2',
            title: 'Operação Local e Finanças da Expansão',
            objective: 'Definir entrega, capacidades, parceiros, custos e retorno.',
            questions: [
              {
                id: 'j4_5_1_q1',
                questionNumber: 1,
                title: 'Como a solução será entregue, parceiros críticos e o que será centralizado vs local?',
                field: 'j4_5_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Fluxo, riscos operacionais e recursos necessários.',
                placeholder: 'Ex.: Suporte local via parceiro credenciado...'
              },
              {
                id: 'j4_5_2_q1',
                questionNumber: 2,
                title: 'Quanto custa lançar em pequena escala, custo de aquisição e previsão de equilíbrio?',
                field: 'j4_5_2_q1',
                type: 'long_text',
                required: true,
                guidance: 'Estimativa de investimento, margem e risco financeiro.',
                placeholder: 'Ex.: Investimento de R$ 50.000 com retorno estimado em 8 meses...'
              },
              {
                id: 'j4_5_2_f6',
                questionNumber: 3,
                title: 'Carregue a simulação financeira da expansão, se houver.',
                field: 'j4_5_2_f6',
                type: 'file_upload',
                required: false,
                guidance: 'SUBIR ARQUIVO: Planilha, screenshot ou PDF.'
              }
            ]
          }
        ]
      },
      {
        id: 'j4_m6',
        milestoneCode: 'Módulo 6',
        title: 'Decisão de entrada e escala',
        objective: 'Concluir se deve entrar, adaptar, testar novamente ou não avançar.',
        conclusionOutcome: 'Decisão, condições e plano de 90 dias.',
        sections: [
          {
            id: 'j4_6_1',
            sectionCode: '6.1 & 6.2',
            title: 'Avaliar Transferência e Decisão Executiva',
            objective: 'Consolidar evidências e transformar em decisão executiva com metas de 90 dias.',
            questions: [
              {
                id: 'j4_6_1_q1',
                questionNumber: 1,
                title: 'O problema existe, a economia local funciona e a operação consegue sustentar?',
                field: 'j4_6_1_q1',
                type: 'long_text',
                required: true,
                guidance: 'Responda com dados consolidados do piloto.',
                placeholder: 'Ex.: Sim, dados do piloto comprovam adesão e margem de 65%...'
              },
              {
                id: 'j4_6_2_q1',
                questionNumber: 2,
                title: 'Qual é a decisão?',
                field: 'j4_6_2_q1',
                type: 'select',
                required: true,
                guidance: 'Entrar, adaptar, novo piloto, pausar ou não entrar.',
                options: [
                  { value: 'Entrar', label: 'Entrar' },
                  { value: 'Adaptar', label: 'Adaptar' },
                  { value: 'Novo piloto', label: 'Novo piloto' },
                  { value: 'Pausar', label: 'Pausar' },
                  { value: 'Não entrar', label: 'Não entrar' }
                ]
              },
              {
                id: 'j4_6_2_q2',
                questionNumber: 3,
                title: 'Quais condições precisam ser cumpridas antes da expansão e qual a meta para os próximos 90 dias?',
                field: 'j4_6_2_q2',
                type: 'long_text',
                required: true,
                guidance: 'KPIs/limites, recursos necessários e sinal de interrupção.',
                placeholder: 'Ex.: Meta de 30 clientes em 90 dias com CAC < R$ 350...'
              },
              {
                id: 'j4_6_2_f6',
                questionNumber: 4,
                title: 'Carregue o plano de expansão, se existir.',
                field: 'j4_6_2_f6',
                type: 'file_upload',
                required: false,
                guidance: 'SUBIR ARQUIVO: Apresentação, planilha ou documento.'
              }
            ]
          }
        ]
      }
    ]
  }
};

const STORAGE_KEY = 'sharp_decision_guided_projects_v9';

export function createFullDemoGuidedProject(): GuidedProject {
  return {
    id: 'proj-demo-lumina-saas',
    journeyId: 'jornada_1',
    name: 'Projeto Exemplo • Lumina Dental SaaS (Gestão & Confirmação de Consultas)',
    companyLocation: 'São Paulo - SP / Brasil',
    companyBranch: 'Saúde & Bem-estar (HealthTech)',
    companyMarket: 'Automação de confirmação via WhatsApp e redução de no-show para clínicas odontológicas e estéticas',
    archived: false,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    answers: {
      // Marco 0 - Identidade do Projeto
      j1_0_1_q1: 'Lumina Dental SaaS',
      j1_0_1_q2: 'Brasil',
      j1_0_1_q3: 'São Paulo (SP)',
      j1_0_1_q4: 'São Paulo (Capital e Interior)',
      j1_0_1_q5: 'Saúde & Bem-estar / Clínicas',
      j1_0_1_q6: 'Gestão de agenda, confirmação inteligente via WhatsApp e cobrança preventiva de consultas para clínicas odontológicas e médicas',
      j1_0_1_q7: 'Plataforma em nuvem integrada aos prontuários eletrônicos que prevê e evita faltas de pacientes por meio de lembretes humanizados e lista de espera inteligente no WhatsApp.',
      j1_0_1_q8: 'Aumento exponencial de custos operacionais das clínicas e constatação de que mais de 22% dos horários agendados resultam em no-show sem aviso.',

      // Módulo 1 - Problemas do Mundo Real
      j1_1_1_q1: 'Altas taxas de faltas sem aviso prévio ("no-show") em clínicas odontológicas particulares, gerando ociosidade de cadeiras clínicas e perda direta de faturamento.',
      j1_1_1_q2: 'Pesquisa setorial CFO e Dental Tribune (2025): 22% a 28% das consultas particulares sofrem no-show.',
      j1_1_1_q3: 'Conselho Federal de Odontologia (CFO) e Amostra Primária com 48 clínicas em SP (2025).',
      j1_1_2_q2: 'As recepcionistas perdem mais de 3 horas diárias tentando ligar ou mandar WhatsApp manualmente, obtendo baixas taxas de resposta e reposição tardia de horários.',
      j1_1_2_q3: 'B2B PMEs / Pequenos Negócios',
      j1_1_2_q4: 'Saúde & Bem-estar / Clínicas',
      j1_1_2_q5: 'Atendimento e Confirmação Automatizada de Pacientes para Clínicas Odontológicas e Estéticas',
      j1_1_3_q1: 'Dentistas proprietários (perda de receita), recepcionistas (sobrecarga) e pacientes (demora para reagendamento).',
      j1_1_3_q2: 'Perda financeira média de R$ 9.200,00/mês por consultório e desorganização da escala clínica.',
      j1_1_3_q3: 'Processos manuais arcaicos, falta de integração do WhatsApp com a agenda do software e esquecimento dos pacientes.',
      j1_1_3_q4: 'Equipe fundadora é composta por cirurgião-dentista com 12 anos de consultório e engenheiro de software especialista em IA conversacional.',
      j1_1_3_q5: 'No-show médio de 25% nas clínicas odontológicas gerando ociosidade severa e perda de faturamento.',
      j1_1_3_q6: 'Prejuízo financeiro de R$ 9k/mês por clínica e sobrecarga de 3h diárias na recepção.',

      // Módulo 2 - Clientes e Validação de Necessidades
      j1_2_1_q1: 'Proprietários e gestores de clínicas odontológicas de médio porte (2 a 6 cadeiras) com foco em procedimentos particulares de média e alta complexidade.',
      j1_2_1_q2: 'B2B',
      j1_2_2_q1: 'Dra. Mariana Costa (38 anos), cirurgiã-dentista e proprietária da Clínica Costa Odonto, e Carla Ramos (29 anos), secretária-chefe.',
      j1_2_2_q2: 'Garantir cadeira 100% ocupada, evitar prejuízo com pacientes faltantes e economizar tempo na recepção.',
      j1_2_2_q3: 'Pacientes confirmam mas não aparecem; pacientes desmarcam em cima da hora sem tempo hábil para encaixar outra pessoa.',
      j1_2_2_q4: 'WhatsApp pessoal da clínica (lento) ou mensagens genéricas de SMS que ninguém responde.',
      j1_2_2_q5: 'Plataforma automatizada que envie mensagens interativas com botão de confirmação/reagendamento e chame a lista de espera.',
      j1_2_3_q1: '1. Como vocês confirmam as consultas hoje? 2. Quantos pacientes faltam por semana? 3. Quanto isso custa para a clínica? 4. Como vocês repõem horários vagos?',
      j1_2_3_q2: '24 clínicas entrevistadas presencialmente e por videoconferência em São Paulo, Campinas e Santos.',
      j1_2_3_q3: '92% das clínicas afirmaram que o no-show é o seu principal gargalo financeiro e 78% pagariam mensalidade de R$ 300 a R$ 500 por uma solução automatizada.',

      // Módulo 3 - Ideação e Solução
      j1_3_1_q0: '1. Robô de WhatsApp com IA conversacional para confirmação em 1 clique;\n2. Lista de espera inteligente com disparo automático para encaixes em menos de 5 minutos;\n3. Cobrança de sinal/reserva integrada via PIX para procedimentos longos.',
      j1_3_1_q1: 'Plataforma SaaS integrada aos prontuários eletrônicos que automatiza o fluxo de confirmações, reagendamentos e reposição em tempo recorde via WhatsApp Oficial (Meta API).',
      j1_3_1_q2: 'Redução do no-show de 25% para menos de 6%, gerando em média R$ 8.500 adicionais de receita recuperada por mês para cada clínica parceira.',
      j1_3_2_q1: 'Prontuários eletrônicos tradicionais (Simples Dental, Dental Cloud) que têm apenas lembretes básicos sem inteligência ou IA.',
      j1_3_2_q2: 'Nossa IA compreende áudios e respostas naturais em linguagem informal, renegocia horários automaticamente e ativa lista de espera instantaneamente.',
      j1_3_3_q1: 'Integração via webhook com agendas existentes e fluxo de conversação humanizado homologado.',

      // Módulo 4 - Proposta de Valor e Diferenciação
      j1_4_1_q1: 'Cadeira cheia e agenda blindada: redução de 75% no no-show com reposição automática de horários em minutos sem sobrecarregar a recepção.',
      j1_4_1_q2: 'Conectividade direta com o WhatsApp oficial sem necessidade de instalar novos sistemas complexos, com onboarding em 15 minutos.',
      j1_4_2_q1: 'SaaS concorrentes exigem troca de prontuário e custam mais de R$ 1.200/mês; mensagens manuais custam tempo e falham frequentemente.',
      j1_4_2_q2: 'Arquitetura modular plug-and-play e algoritmo preditivo de faltas com base no histórico comportamental.',

      // Módulo 5 - Modelo de Negócios e Unidade de Venda
      j1_5_1_q1: 'Assinatura SaaS B2B Recorrente por Clínica (Plano Standard: R$ 290/mês | Plano Pro: R$ 450/mês para clínicas multi-cadeiras).',
      j1_5_1_q2: 'Cobrança mensal recorrente via cartão de crédito ou faturamento boleto bancário anual com 15% de desconto.',
      j1_5_2_q1: 'Custo Marginal baixíssimo por mensagem WhatsApp (R$ 0,08 via Meta Cloud API) e infraestrutura serverless escalável.',
      j1_5_3_q1: 'Receita previsível, alta margem bruta (82%) e ciclo de vendas curto (7 a 14 dias com teste grátis de 14 dias).',

      // Módulo 6 - Validação com Clientes e NPS
      j1_6_1_q1: 'Piloto operacional de 45 dias com 8 clínicas odontológicas em SP com mais de 3.200 consultas processadas.',
      j1_6_1_q2: 'NPS projetado de 75 (Zona de Encantamento) com 18 promotores, 5 neutros e 1 detrator em 24 avaliações qualitativas.',
      j1_6_2_q1: 'Taxa de no-show das 8 clínicas caiu de 24,6% para 5,2% no período piloto; 100% das clínicas converteram para contratos anuais pagos.',

      // Módulo 7 - Go-To-Market e Aquisição de Clientes
      j1_7_1_q1: 'Tráfego pago no Instagram/Meta direcionado a cirurgiões-dentistas e gestores + Parcerias com associações regionais (APCD/CRO) + Vendas diretas Inside Sales.',
      j1_7_1_q2: 'CAC projetado de R$ 450,00, LTV de R$ 6.300,00 (relação LTV/CAC de 14.0x, com retenção média de 18 meses) — Diagnóstico: Excelente (LTV/CAC ≥ 3x)',
      j1_7_2_q1: 'Ciclo médio de vendas de 10 dias com taxa de conversão de lead qualificado para cliente de 22%.',

      // Módulo 8 - Métricas Principais (KPIs)
      j1_8_1_q1: '1. MRR (Receita Recorrente Mensal);\n2. Churn Rate Mensal (meta < 1.2%);\n3. CAC Payback (< 2 meses);\n4. Taxa média de no-show dos clientes (< 6%).',
      j1_8_2_q1: 'Dashboard em tempo real integrado ao Stripe e banco de dados monitorando uso ativo e satisfação semanal.',

      // Módulo 9 - Projeções Financeiras e Viabilidade (Conforme requisitos estritos de 9.1, 9.2 e 9.3)
      j1_9_1_q1: 'Custos previstos de R$ 276.000,00 para os próximos 12 meses (R$ 9.000,00/mês em infraestrutura cloud e Meta API WhatsApp + R$ 8.000,00/mês em equipe técnica/suporte + R$ 5.000,00/mês em marketing digital + R$ 12.000,00 de reserva de contingência anual). Premissas de vendas: início com 15 clientes no Mês 1 e chegada a 120 clínicas pagantes ao final do Mês 12.',
      j1_9_1_q2: 'Projeção Financeira Detalhada (4 Trimestres): [T1 (M1-3)]: Receita R$ 36.000,00 | Custos R$ 66.000,00 | Lucro -R$ 30.000,00; [T2 (M4-6)]: Receita R$ 81.000,00 | Custos R$ 69.000,00 | Lucro R$ 12.000,00; [T3 (M7-9)]: Receita R$ 117.000,00 | Custos R$ 70.500,00 | Lucro R$ 46.500,00; [T4 (M10-12)]: Receita R$ 144.000,00 | Custos R$ 70.500,00 | Lucro R$ 73.500,00. TOTAL ACUMULADO: Receita Total de R$ 378.000,00, Custos Totais de R$ 276.000,00, Lucro Líquido Final de R$ 102.000,00 (Margem Líquida Média de 27.0%). Diagnóstico de Viabilidade: Excelente / Altamente Lucrativo — Margem saudável e crescimento consistente de caixa.',
      j1_9_1_q3: 'Ponto de equilíbrio (Break-even): 48 clientes ativos pagantes gerando R$ 16.800,00/mês com margem unitária de R$ 350,00 — Diagnóstico: Ponto de Equilíbrio Acessível (Meta realista atingida no 5º mês de operação, gerando fluxo positivo e dispensando aportes pesados de capital externo).',

      // Módulo 10 - Estrutura de Equipe e Execução
      j1_10_1_q1: 'Co-fundador 1 (CEO / Comercial): Dentista e especialista em gestão de clínicas com rede de contatos no setor odontológico; Co-fundador 2 (CTO / Produto): Engenheiro de software full-stack sênior especialista em IA conversacional e integrações em nuvem.',
      j1_10_2_q1: 'Contratação no Mês 4 de 1 profissional de Customer Success e no Mês 7 de 1 desenvolvedor front-end júnior.',

      // Módulo 11 - Pitch e Viabilidade Final
      j1_11_1_q1: 'Lumina Dental é o copiloto inteligente de WhatsApp que elimina o no-show em clínicas de saúde, transformando ociosidade em R$ 8.500 de lucro extra por consultório todos os meses.',
      j1_11_2_q1: 'Mercado SAM de R$ 120M no Brasil, modelo SaaS escalável com 82% de margem bruta, CAC payback de 1,5 meses e tração inicial validada com NPS 75.'
    },
    files: {
      'j1_1_1_file': { name: 'Pesquisa_CFO_NoShow_Clinicas_2025.pdf', size: '1.4 MB', date: '2026-08-12' },
      'j1_2_3_file': { name: 'Relatorio_Entrevistas_24_Clinicas_SP.pdf', size: '2.1 MB', date: '2026-08-14' },
      'j1_6_1_file': { name: 'Resultados_Piloto_8_Clinicas_NPS.pdf', size: '3.5 MB', date: '2026-08-16' },
      'j1_9_1_file': { name: 'Planilha_Projecao_Financeira_12_Meses.xlsx', size: '850 KB', date: '2026-08-18' }
    }
  };
}

export function createStarterGuidedProject(
  journeyId: JourneyId = 'jornada_1',
  name: string = 'Meu Novo Projeto • Startup de Saúde & SaaS',
  location: string = 'São Paulo - SP / Brasil',
  branch: string = 'Saúde & Farmacêutica',
  market: string = 'Software de automação para clínicas e consultórios'
): GuidedProject {
  return {
    id: `proj-decision-${Date.now()}`,
    journeyId,
    name,
    companyLocation: location,
    companyBranch: branch,
    companyMarket: market,
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    answers: {
      j1_0_1_q1: name,
      j1_0_1_q2: 'Brasil',
      j1_0_1_q3: 'São Paulo (SP)',
      j1_0_1_q4: location.split('-')[0]?.trim() || 'São Paulo',
      j1_0_1_q5: branch,
      j1_0_1_q6: market
    },
    files: {}
  };
}

export function getStoredGuidedProjects(): GuidedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const demo = createFullDemoGuidedProject();
      saveStoredGuidedProjects([demo]);
      return [demo];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const demo = createFullDemoGuidedProject();
      saveStoredGuidedProjects([demo]);
      return [demo];
    }
    return parsed;
  } catch (e) {
    console.error('Error loading stored guided projects:', e);
    const demo = createFullDemoGuidedProject();
    return [demo];
  }
}

export function saveStoredGuidedProjects(projects: GuidedProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving stored guided projects:', e);
  }
}
