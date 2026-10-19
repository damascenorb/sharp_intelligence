import React, { useState } from 'react';
import { 
  BookOpen, Calculator, Compass, CheckSquare, Layers, Plus, Trash2, 
  Shield, ArrowUpRight, ArrowDownRight, Sparkles, RefreshCw, Target, 
  DollarSign, CheckCircle2, Building2, TrendingUp, BarChart3, Info, 
  Users, Award, AlertTriangle, PieChart, Printer, Download, Clock, ArrowRight,
  ChevronRight, Filter, Eye, Check, Lightbulb, HelpCircle, Activity, Scale, EyeOff
} from 'lucide-react';

// --- TYPES ---
interface CashbookEntry {
  id: string;
  date: string;
  description: string;
  type: 'entrada' | 'saida';
  category: string;
  paymentMethod: string;
  status: 'Realizado' | 'A Pagar' | 'A Receber';
  entityName: string;
  amount: number;
}

interface ActionItem5W2H {
  id: string;
  what: string;
  why: string;
  where: string;
  when: string;
  who: string;
  how: string;
  howMuch: number;
  status: 'A Fazer' | 'Em Andamento' | 'Concluído';
  pdcaPhase: 'Plan' | 'Do' | 'Check' | 'Act';
}

interface MvpValuationItem {
  id: string;
  hypothesis: string;
  validationMethod: string;
  metricTarget: string;
  status: 'Em Rascunho' | 'Em Teste' | 'Validado' | 'Pivotado';
}

export const EntrepreneurHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('livro_caixa');

  // ==========================================
  // 1. LIVRO CAIXA & DRE DIÁRIO STATE
  // ==========================================
  const [cashEntries, setCashEntries] = useState<CashbookEntry[]>([
    { id: '1', date: '2026-07-30', description: 'Venda de Consultoria Estratégica B2B', type: 'entrada', category: 'Venda de Serviços', paymentMethod: 'Pix', status: 'Realizado', entityName: 'Grupo Alpha Ltda', amount: 9500 },
    { id: '2', date: '2026-07-29', description: 'Licença de Software e Servidores Cloud', type: 'saida', category: 'Infraestrutura', paymentMethod: 'Cartão de Crédito', status: 'Realizado', entityName: 'AWS / Cloud Services', amount: 620 },
    { id: '3', date: '2026-07-28', description: 'Pró-Labore Direção Executiva', type: 'saida', category: 'Pessoal/Pró-Labore', paymentMethod: 'Transferência', status: 'Realizado', entityName: 'Sócios', amount: 4500 },
    { id: '4', date: '2026-07-26', description: 'Gestão de Tráfego Pago & Mídia', type: 'saida', category: 'Marketing/Mídia', paymentMethod: 'Pix', status: 'Realizado', entityName: 'Agência Meta/Google', amount: 2200 },
    { id: '5', date: '2026-07-25', description: 'Honorário de Projeto de Rebranding', type: 'entrada', category: 'Venda de Serviços', paymentMethod: 'Boleto Bancário', status: 'Realizado', entityName: 'Clínica Lumina', amount: 14000 },
    { id: '6', date: '2026-08-05', description: 'Fatura Fornecedor de Material Gráfico', type: 'saida', category: 'Fornecedores', paymentMethod: 'Boleto Bancário', status: 'A Pagar', entityName: 'GrafPack Brasil', amount: 1850 },
    { id: '7', date: '2026-08-10', description: 'Parcela 2 Contrato de Gestão Mensal', type: 'entrada', category: 'Venda de Serviços', paymentMethod: 'Pix', status: 'A Receber', entityName: 'Empório Real', amount: 3500 }
  ]);

  const [filterType, setFilterType] = useState<string>('todos');
  const [filterCategory, setFilterCategory] = useState<string>('todas');

  // Form State for Cashbook
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'entrada' | 'saida'>('entrada');
  const [newCategory, setNewCategory] = useState('Venda de Serviços');
  const [newPayment, setNewPayment] = useState('Pix');
  const [newStatus, setNewStatus] = useState<'Realizado' | 'A Pagar' | 'A Receber'>('Realizado');
  const [newEntity, setNewEntity] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;
    const num = parseFloat(newAmount);
    if (isNaN(num)) return;

    const entry: CashbookEntry = {
      id: `cash-${Date.now()}`,
      date: newDate,
      description: newDesc,
      type: newType,
      category: newCategory,
      paymentMethod: newPayment,
      status: newStatus,
      entityName: newEntity || 'Cliente/Fornecedor',
      amount: num
    };

    setCashEntries([entry, ...cashEntries]);
    setNewDesc('');
    setNewAmount('');
    setNewEntity('');
  };

  const handleDeleteEntry = (id: string) => {
    setCashEntries(cashEntries.filter(c => c.id !== id));
  };

  // Summaries
  const totalEntradasRealizadas = cashEntries
    .filter(c => c.type === 'entrada' && c.status === 'Realizado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSaidasRealizadas = cashEntries
    .filter(c => c.type === 'saida' && c.status === 'Realizado')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const saldoRealizado = totalEntradasRealizadas - totalSaidasRealizadas;

  const totalAPagar = cashEntries
    .filter(c => c.type === 'saida' && c.status === 'A Pagar')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalAReceber = cashEntries
    .filter(c => c.type === 'entrada' && c.status === 'A Receber')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const filteredEntries = cashEntries.filter(entry => {
    if (filterType !== 'todos' && entry.type !== filterType) return false;
    if (filterCategory !== 'todas' && entry.category !== filterCategory) return false;
    return true;
  });

  // ==========================================
  // 2. ANÁLISE DE OPORTUNIDADE SEBRAE 360º
  // ==========================================
  // Aspectos Internos (3 perguntas do gráfico SEBRAE)
  const [opDesafioIntelectual, setOpDesafioIntelectual] = useState<number>(9); // 1-10
  const [opPaixaoPessoal, setOpPaixaoPessoal] = useState<number>(8); // 1-10
  const [opRedeContatos, setOpRedeContatos] = useState<number>(8); // 1-10

  // Aspectos Externos (7 perguntas do gráfico SEBRAE)
  const [opMuitasPessoas, setOpMuitasPessoas] = useState<number>(8); // Bilhões(10), Milhões(8), Milhares(6), Dezenas(3)
  const [opTipoNecessidade, setOpTipoNecessidade] = useState<number>(9); // Auto-realização(10), Auto-estima(8), Social(7), Segurança(8), Básica(10)
  const [opAlcanceIdeia, setOpAlcanceIdeia] = useState<number>(8); // Global(10), Nacional(8), Regional(6), Cidade/Bairro(4)
  const [opBeneficioClaro, setOpBeneficioClaro] = useState<number>(9); // Só de olhar(10), Só de ler(8), Requer explicação(6), Requer demonstração(4)
  const [opTamanhoMercado, setOpTamanhoMercado] = useState<number>(8); // R$ bilhões(10), R$ centenas milhões(8), R$ milhões(6), R$ milhares(4)
  const [opLucratividade, setOpLucratividade] = useState<number>(9); // Altíssima(10), Alta(8), Média(5), Baixa(2)
  const [opInovacao, setOpInovacao] = useState<number>(8); // No mundo(10), No Brasil(8), No segmento em que atuo(7), Na região(5)

  // Calculations for Opportunity Wheel
  const internalScore = Math.round(((opDesafioIntelectual + opPaixaoPessoal + opRedeContatos) / 30) * 100);
  const externalScore = Math.round(((opMuitasPessoas + opTipoNecessidade + opAlcanceIdeia + opBeneficioClaro + opTamanhoMercado + opLucratividade + opInovacao) / 70) * 100);
  const totalOpportunityScore = Math.round((internalScore * 0.4) + (externalScore * 0.6));

  // ==========================================
  // 3. PROTOTIPAGEM DE NEGÓCIO (FERRAMENTA DE VIABILIDADE)
  // ==========================================
  const [protoName, setProtoName] = useState('Academia Boutique High-Ticket');
  const [protoSegment, setProtoSegment] = useState('Saúde, Fitness & Bem-Estar');
  const [protoTarget, setProtoTarget] = useState('Executivos e profissionais liberais buscando atendimento exclusivo');
  const [protoCapex, setProtoCapex] = useState<string>('180000'); // Investimento inicial
  const [protoFixedOpex, setProtoFixedOpex] = useState<string>('24000'); // Custos fixos mensais
  const [protoVarCostUnit, setProtoVarCostUnit] = useState<string>('50'); // Custo direto por cliente
  const [protoPriceUnit, setProtoPriceUnit] = useState<string>('480'); // Mensalidade / Ticket
  const [protoVolExpected, setProtoVolExpected] = useState<string>('120'); // Vendas/Membros
  const [protoDiscountRate, setProtoDiscountRate] = useState<string>('12'); // Taxa de desconto % a.a.

  // Math Computations for Prototype
  const capex = parseFloat(protoCapex) || 0;
  const opexFix = parseFloat(protoFixedOpex) || 0;
  const varCost = parseFloat(protoVarCostUnit) || 0;
  const priceUnit = parseFloat(protoPriceUnit) || 0;
  const vol = parseFloat(protoVolExpected) || 0;
  const discountRate = (parseFloat(protoDiscountRate) || 12) / 100;

  const revenueMonthly = priceUnit * vol;
  const varCostTotal = varCost * vol;
  const marginContribUnit = priceUnit - varCost;
  const marginContribPercent = priceUnit > 0 ? (marginContribUnit / priceUnit) * 100 : 0;
  
  const breakEvenUnits = marginContribUnit > 0 ? Math.ceil(opexFix / marginContribUnit) : 0;
  const breakEvenRevenue = breakEvenUnits * priceUnit;
  const marginOfSafetyPercent = vol > 0 ? Math.max(0, ((vol - breakEvenUnits) / vol) * 100) : 0;

  const netProfitMonthly = revenueMonthly - varCostTotal - opexFix;
  const netProfitMargin = revenueMonthly > 0 ? (netProfitMonthly / revenueMonthly) * 100 : 0;
  const paybackMonths = netProfitMonthly > 0 ? Math.ceil(capex / netProfitMonthly) : 0;
  const annualROI = capex > 0 && netProfitMonthly > 0 ? ((netProfitMonthly * 12) / capex) * 100 : 0;

  // Estimated VPL (5 Years discounted cash flow)
  let estimatedNPV = -capex;
  for (let year = 1; year <= 5; year++) {
    const annualCashFlow = netProfitMonthly * 12;
    estimatedNPV += annualCashFlow / Math.pow(1 + discountRate, year);
  }

  // Scenarios: Pessimistic (-20% sales), Realistic, Optimistic (+25% sales)
  const pessimisticVol = Math.round(vol * 0.8);
  const pessimisticProfit = (priceUnit * pessimisticVol) - (varCost * pessimisticVol) - opexFix;
  
  const optimisticVol = Math.round(vol * 1.25);
  const optimisticProfit = (priceUnit * optimisticVol) - (varCost * optimisticVol) - opexFix;

  // MVP Hypotheses List
  const [mvpHypotheses, setMvpHypotheses] = useState<MvpValuationItem[]>([
    { id: 'mvp-1', hypothesis: 'Clientes pagam R$ 480/mês por atendimento com personal dedicado em turmas de até 4 pessoas', validationMethod: 'Pré-venda de 15 assinaturas antecipadas com 10% de desconto', metricTarget: '15 matrículas em 14 dias', status: 'Em Teste' },
    { id: 'mvp-2', hypothesis: 'Custo de aquisição de cliente (CAC) em anúncios geolocalizados é inferior a R$ 120', validationMethod: 'Campanha de R$ 1.000 em Meta Ads direcionada a raio de 5km', metricTarget: 'CPL < R$ 15 e CAC < R$ 120', status: 'Validado' }
  ]);

  const [newHypo, setNewHypo] = useState('');
  const [newMethod, setNewMethod] = useState('');
  const [newMetric, setNewMetric] = useState('');

  const handleAddHypothesis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHypo) return;
    setMvpHypotheses([
      ...mvpHypotheses,
      {
        id: `mvp-${Date.now()}`,
        hypothesis: newHypo,
        validationMethod: newMethod || 'Pesquisa/Teste Prático',
        metricTarget: newMetric || 'Meta Definida',
        status: 'Em Rascunho'
      }
    ]);
    setNewHypo('');
    setNewMethod('');
    setNewMetric('');
  };

  const handleToggleHypoStatus = (id: string) => {
    setMvpHypotheses(mvpHypotheses.map(item => {
      if (item.id === id) {
        const next = item.status === 'Em Rascunho' ? 'Em Teste' : item.status === 'Em Teste' ? 'Validado' : item.status === 'Validado' ? 'Pivotado' : 'Em Rascunho';
        return { ...item, status: next };
      }
      return item;
    }));
  };

  // ==========================================
  // 4. ANÁLISE DE PROJETOS (5W2H & PDCA INTEGRADOS)
  // ==========================================
  const [actionItems, setActionItems] = useState<ActionItem5W2H[]>([
    {
      id: '5w-1',
      what: 'Lançamento do Novo Site Executivo e Posicionamento',
      why: 'Elevar a percepção de valor e captar leads de alto ticket',
      where: 'Canal Digital / Domínio Web',
      when: '20 de Agosto',
      who: 'Equipe de Marketing & Design Sharp',
      how: 'Design Responsivo, copy de conversão e prova social',
      howMuch: 4500,
      status: 'Em Andamento',
      pdcaPhase: 'Do'
    },
    {
      id: '5w-2',
      what: 'Treinamento Comercial e Alinhamento de Script de Vendas',
      why: 'Aumentar a taxa de fechamento de reuniões de 18% para 32%',
      where: 'Sala de Reuniões da Empresa',
      when: '12 de Agosto',
      who: 'Líder Comercial',
      how: 'Simulação de objeções e matriz de apresentação executiva',
      howMuch: 1200,
      status: 'A Fazer',
      pdcaPhase: 'Plan'
    },
    {
      id: '5w-3',
      what: 'Auditoria de Qualidade no Atendimento ao Cliente',
      why: 'Identificar motivos de cancelamento e reduzir churn',
      where: 'Base Interna de Dados',
      when: '05 de Agosto',
      who: 'Gerente de Operações',
      how: 'Pesquisa NPS e entrevistas estruturadas com clientes',
      howMuch: 600,
      status: 'Concluído',
      pdcaPhase: 'Check'
    }
  ]);

  const [wWhat, setWWhat] = useState('');
  const [wWhy, setWWhy] = useState('');
  const [wWhere, setWWhere] = useState('');
  const [wWhen, setWWhen] = useState('');
  const [wWho, setWWho] = useState('');
  const [wHow, setWHow] = useState('');
  const [wHowMuch, setWHowMuch] = useState('');
  const [wPdcaPhase, setWPdcaPhase] = useState<'Plan' | 'Do' | 'Check' | 'Act'>('Plan');

  const handleAdd5W2H = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wWhat || !wWho) return;
    const newItem: ActionItem5W2H = {
      id: `5w-${Date.now()}`,
      what: wWhat,
      why: wWhy,
      where: wWhere,
      when: wWhen,
      who: wWho,
      how: wHow,
      howMuch: parseFloat(wHowMuch) || 0,
      status: 'A Fazer',
      pdcaPhase: wPdcaPhase
    };
    setActionItems([...actionItems, newItem]);
    setWWhat('');
    setWWhy('');
    setWWhere('');
    setWWhen('');
    setWWho('');
    setWHow('');
    setWHowMuch('');
  };

  const handleToggleStatus = (id: string) => {
    setActionItems(actionItems.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'A Fazer' ? 'Em Andamento' : item.status === 'Em Andamento' ? 'Concluído' : 'A Fazer';
        const nextPhase = nextStatus === 'Concluído' ? 'Act' : nextStatus === 'Em Andamento' ? 'Do' : 'Plan';
        return { ...item, status: nextStatus, pdcaPhase: nextPhase };
      }
      return item;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setActionItems(actionItems.filter(item => item.id !== id));
  };

  // ==========================================
  // 5. BUSINESS MODEL CANVAS (Alexander Osterwalder)
  // ==========================================
  const [canvasData, setCanvasData] = useState<{ [key: string]: string[] }>({
    parcerias: ['Fornecedores de Alta Tecnologia', 'Agência de Marketing Sharp', 'Plataformas de Pagamento VIP'],
    atividades: ['Atendimento Executivo Personalizado', 'Desenvolvimento de Soluções Sob Medida', 'Gestão Continuada de Qualidade'],
    recursos: ['Equipe Especializada e Multidisciplinar', 'Plataforma Tecnológica Própria', 'Capital de Giro e Marca Consolidada'],
    propostaValor: ['Experiência Exclusiva e de Alto Padrão', 'Resolução Ágil de Problemas Complexos', 'Retorno Claro sobre o Investimento (ROI)'],
    relacionamento: ['Atendimento VIP com Gerente Dedicado', 'Suporte Prioritário 24/7', 'Acompanhamento Estratégico Mensal'],
    canais: ['Redes Sociais Oficiais e Mídia de Performance', 'Site Institucional Executivo', 'Indicações de Clientes e Eventos Privados'],
    segmentos: ['Empresários B2B & Executivos', 'Clínicas, Consultórios e Escritórios', 'Marcas em Fase de Expansão e Reposicionamento'],
    custos: ['Folha de Pagamento & Pró-Labore', 'Infraestrutura Tecnológica e Software', 'Investimento em Mídia Pago e Marketing'],
    receitas: ['Contratos de Recorrência Mensal', 'Projetos Spot de Alto Valor Agregado', 'Taxas de Sucesso e Aceleração']
  });

  const [canvasBlockSelect, setCanvasBlockSelect] = useState('propostaValor');
  const [canvasItemInput, setCanvasItemInput] = useState('');

  const handleAddCanvasItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canvasItemInput.trim()) return;
    setCanvasData(prev => ({
      ...prev,
      [canvasBlockSelect]: [...(prev[canvasBlockSelect] || []), canvasItemInput.trim()]
    }));
    setCanvasItemInput('');
  };

  const handleRemoveCanvasItem = (blockKey: string, index: number) => {
    setCanvasData(prev => ({
      ...prev,
      [blockKey]: prev[blockKey].filter((_, i) => i !== index)
    }));
  };

  // ==========================================
  // 6. PRECIFICAÇÃO & MARGENS DETALHADA COM COMPARATIVO DE MERCADO
  // ==========================================
  const [pCostDirectMaterial, setPCostDirectMaterial] = useState('800'); // Custo Material/Insumos
  const [pCostDirectLabor, setPCostDirectLabor] = useState('400'); // Custo Mão de Obra Direta
  const [pFixedOverheadPercent, setPFixedOverheadPercent] = useState('15'); // % Rateio Custo Fixo
  const [pTaxPercent, setPTaxPercent] = useState('10'); // % Impostos
  const [pGatewayFeePercent, setPGatewayFeePercent] = useState('4.5'); // % Taxa Maquininha/Gateway
  const [pCommissionPercent, setPCommissionPercent] = useState('5'); // % Comissão de Vendas
  const [pTargetProfitPercent, setPTargetProfitPercent] = useState('25'); // % Lucro Desejado
  const [pMarketPrice, setPMarketPrice] = useState('3200'); // PREÇO PRATICADO PELO MERCADO/CONCORRENTES

  // Calculations for Pricing
  const matCost = parseFloat(pCostDirectMaterial) || 0;
  const laborCost = parseFloat(pCostDirectLabor) || 0;
  const directCostTotal = matCost + laborCost;

  const fixedPerc = parseFloat(pFixedOverheadPercent) || 0;
  const taxPerc = parseFloat(pTaxPercent) || 0;
  const gatewayPerc = parseFloat(pGatewayFeePercent) || 0;
  const commPerc = parseFloat(pCommissionPercent) || 0;
  const profitPerc = parseFloat(pTargetProfitPercent) || 0;
  const marketPrice = parseFloat(pMarketPrice) || 0;

  const totalDeductionsPercent = fixedPerc + taxPerc + gatewayPerc + commPerc + profitPerc;
  
  // Markup Divisor Formula: Preço = Custo Direto / (1 - % Deduções Totais)
  const markupDivisorFactor = totalDeductionsPercent < 100 ? (100 - totalDeductionsPercent) / 100 : 0.1;
  const suggestedSellingPrice = markupDivisorFactor > 0 ? directCostTotal / markupDivisorFactor : directCostTotal * 2;
  const markupMultiplier = directCostTotal > 0 ? suggestedSellingPrice / directCostTotal : 1;

  // Price vs Market Comparisons
  const priceDiffR$ = suggestedSellingPrice - marketPrice;
  const priceDiffPercent = marketPrice > 0 ? ((suggestedSellingPrice - marketPrice) / marketPrice) * 100 : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12">
      
      {/* Executive Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full tracking-wider">
              Hub Executivo do Empreendedor
            </span>
            <span className="text-xs text-slate-400 font-medium">Gestão, Finanças & Estratégia de Negócios</span>
          </div>
          <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Central de Inteligência & Ferramentas do Empresário
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
            Plataforma prática de gestão para acompanhamento do fluxo financeiro, análise de oportunidade 360º SEBRAE, prototipagem de viabilidade, gestão de projetos com 5W2H/PDCA, Modelagem Canvas e Precificação comparada ao mercado.
          </p>
        </div>

        {/* Sub-Header Navigation Tabs */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          {[
            { id: 'livro_caixa', label: '1. Livro Caixa & DRE Diário', icon: BookOpen },
            { id: 'analise_oportunidade', label: '2. Análise de Oportunidade (SEBRAE 360º)', icon: Compass },
            { id: 'prototipagem', label: '3. Prototipagem de Negócio', icon: Lightbulb },
            { id: 'analise_projeto', label: '4. Análise de Projetos (5W2H & PDCA)', icon: CheckSquare },
            { id: 'business_canvas', label: '5. Business Model Canvas', icon: Layers },
            { id: 'precificacao', label: '6. Precificação & Margens Detalhada', icon: Calculator }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                  active
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==========================================
          TAB 1: LIVRO CAIXA & DRE DIÁRIO
      ========================================== */}
      {activeTab === 'livro_caixa' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Receitas Realizadas</span>
              <div className="text-xl font-black text-emerald-600 flex items-center space-x-1">
                <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                <span>R$ {totalEntradasRealizadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <span className="text-[10px] text-slate-400">Entradas conciliadas no mês</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Despesas Realizadas</span>
              <div className="text-xl font-black text-rose-600 flex items-center space-x-1">
                <ArrowDownRight className="w-5 h-5 text-rose-500" />
                <span>R$ {totalSaidasRealizadas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <span className="text-[10px] text-slate-400">Saídas pagas efetivadas</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Saldo do Livro Caixa</span>
              <div className={`text-xl font-black ${saldoRealizado >= 0 ? 'text-cyan-800' : 'text-rose-600'}`}>
                R$ {saldoRealizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[10px] text-slate-400">Resultado operacional líquido</span>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Previsão Pendente</span>
              <div className="text-xs font-semibold text-slate-300 space-y-0.5">
                <div className="text-emerald-400 font-bold">A Receber: R$ {totalAReceber.toLocaleString('pt-BR')}</div>
                <div className="text-amber-400 font-bold">A Pagar: R$ {totalAPagar.toLocaleString('pt-BR')}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Lançamento */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-cyan-600" />
                  <span>Novo Lançamento Diário</span>
                </h3>
                <p className="text-[11px] text-slate-500">Registre entradas e saídas no caixa com detalhamento.</p>
              </div>

              <form onSubmit={handleAddEntry} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Descrição do Lançamento *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Venda de serviço / Fatura de fornecedor"
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipo</label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as 'entrada' | 'saida')}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                    >
                      <option value="entrada">Entrada (+)</option>
                      <option value="saida">Saída (-)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={newAmount}
                      onChange={e => setNewAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                    <select
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    >
                      <option value="Venda de Serviços">Venda de Serviços</option>
                      <option value="Venda de Produtos">Venda de Produtos</option>
                      <option value="Fornecedores">Fornecedores</option>
                      <option value="Impostos">Impostos / Tributos</option>
                      <option value="Pessoal/Pró-Labore">Pessoal / Pró-Labore</option>
                      <option value="Marketing/Mídia">Marketing & Anúncios</option>
                      <option value="Infraestrutura">Infraestrutura & Aluguel</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    >
                      <option value="Realizado">Realizado</option>
                      <option value="A Pagar">A Pagar</option>
                      <option value="A Receber">A Receber</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Meio de Pagamento</label>
                    <select
                      value={newPayment}
                      onChange={e => setNewPayment(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    >
                      <option value="Pix">Pix</option>
                      <option value="Boleto Bancário">Boleto Bancário</option>
                      <option value="Cartão de Crédito">Cartão de Crédito</option>
                      <option value="Transferência">Transferência TED/Doc</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Data</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cliente / Fornecedor</label>
                  <input
                    type="text"
                    placeholder="Ex: Empresa X / Fornecedor Y"
                    value={newEntity}
                    onChange={e => setNewEntity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" />
                  <span>Salvar Lançamento</span>
                </button>
              </form>
            </div>

            {/* Extrato do Livro Caixa */}
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Extrato Consolidado do Livro Caixa</h3>
                  <p className="text-[11px] text-slate-500">Histórico detalhado de movimentações financeiras.</p>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-2 text-xs">
                  <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold"
                  >
                    <option value="todos">Todos os Tipos</option>
                    <option value="entrada">Apenas Entradas</option>
                    <option value="saida">Apenas Saídas</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-2 px-2">Data</th>
                      <th className="py-2 px-2">Descrição & Entidade</th>
                      <th className="py-2 px-2">Categoria</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2 text-right">Valor (R$)</th>
                      <th className="py-2 px-2 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEntries.map(entry => (
                      <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-2 text-slate-500 font-medium whitespace-nowrap">{entry.date}</td>
                        <td className="py-3 px-2">
                          <div className="font-bold text-slate-900">{entry.description}</div>
                          <div className="text-[10px] text-slate-400">{entry.entityName} • {entry.paymentMethod}</div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[10px]">
                            {entry.category}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            entry.status === 'Realizado'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : entry.status === 'A Pagar'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className={`py-3 px-2 text-right font-bold whitespace-nowrap ${
                          entry.type === 'entrada' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {entry.type === 'entrada' ? '+' : '-'} R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          TAB 2: ANÁLISE DE OPORTUNIDADE SEBRAE 360º
      ========================================== */}
      {activeTab === 'analise_oportunidade' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
            
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest inline-block mb-1">
                  Metodologia SEBRAE de Validação
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">Análise 360º da Oportunidade de Negócio</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Avalie a viabilidade da sua ideia considerando Aspectos Internos (você e sua equipe) e Aspectos Externos (mercado, clientes e diferencial).
                </p>
              </div>

              <div className="bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 text-center min-w-[180px]">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Score de Oportunidade</span>
                <div className="text-3xl font-black text-white">{totalOpportunityScore}<span className="text-base text-slate-500">/100</span></div>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  totalOpportunityScore >= 75 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  totalOpportunityScore >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {totalOpportunityScore >= 75 ? 'Excelente Oportunidade!' : totalOpportunityScore >= 50 ? 'Oportunidade Promissora' : 'Necessita Ajustes'}
                </span>
              </div>
            </div>

            {/* Visual Radar Wheel Representation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Wheel Graphic */}
              <div className="lg:col-span-5 bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center space-y-4 relative overflow-hidden">
                <div className="text-center space-y-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Roda 360º SEBRAE</span>
                  <p className="text-[11px] text-slate-400">Dimensões Internas vs Externas</p>
                </div>

                {/* SVG Visual Representation of the Wheel */}
                <div className="relative w-56 h-56 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
                    
                    {/* Aspectos Internos Arc (Orange) */}
                    <circle 
                      cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="8"
                      strokeDasharray={`${(internalScore / 100) * 141} 282`}
                      strokeDashoffset="0"
                      className="transition-all duration-700"
                    />

                    {/* Aspectos Externos Arc (Cyan) */}
                    <circle 
                      cx="50" cy="50" r="45" fill="none" stroke="#06b6d4" strokeWidth="8"
                      strokeDasharray={`${(externalScore / 100) * 141} 282`}
                      strokeDashoffset="-141"
                      className="transition-all duration-700"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-2xl font-black text-white">{totalOpportunityScore}%</span>
                    <span className="text-[9px] uppercase font-extrabold text-slate-400">Aderência total</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full text-center text-xs">
                  <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
                    <span className="text-[10px] text-amber-300 font-bold block">Aspectos Internos</span>
                    <span className="text-lg font-black text-amber-400">{internalScore}%</span>
                  </div>
                  <div className="bg-cyan-500/10 border border-cyan-500/30 p-2.5 rounded-xl">
                    <span className="text-[10px] text-cyan-300 font-bold block">Aspectos Externos</span>
                    <span className="text-lg font-black text-cyan-400">{externalScore}%</span>
                  </div>
                </div>
              </div>

              {/* Questions Column */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. ASPECTOS INTERNOS (Laranja) */}
                <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-4 text-xs">
                  <span className="font-extrabold text-amber-900 uppercase tracking-wider text-xs block flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-amber-700" />
                    <span>Aspectos Internos (Perfil do Empreendedor & Equipe)</span>
                  </span>

                  <div className="space-y-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        1. O problema representa um desafio intelectual no médio/longo prazo?
                      </label>
                      <select
                        value={opDesafioIntelectual}
                        onChange={e => setOpDesafioIntelectual(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value={10}>Sim, é agora e continuará sendo no médio/longo prazo! (10/10)</option>
                        <option value={8}>Sim, definitivamente! (8/10)</option>
                        <option value={7}>Sim... entendo que sim (7/10)</option>
                        <option value={5}>Acho que sim... talvez (5/10)</option>
                        <option value={2}>Não sei / Acho que não (2/10)</option>
                        <option value={1}>Não! (1/10)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        2. O problema representa uma de suas paixões pessoais?
                      </label>
                      <select
                        value={opPaixaoPessoal}
                        onChange={e => setOpPaixaoPessoal(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value={10}>Tenho certeza que sim! Adoro o problema e a solução! (10/10)</option>
                        <option value={8}>Gosto muito do problema e do produto (8/10)</option>
                        <option value={6}>Gosto do produto, mas não tanto do problema (6/10)</option>
                        <option value={4}>Talvez sim... / Não sei ao certo (4/10)</option>
                        <option value={1}>Não é uma paixão pessoal (1/10)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        3. Conhece muitas pessoas que pagariam pela sua solução?
                      </label>
                      <select
                        value={opRedeContatos}
                        onChange={e => setOpRedeContatos(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value={10}>Sim! São contatos diretos e prontos para comprar! (10/10)</option>
                        <option value={8}>Sim! A maior parte são contatos diretos (8/10)</option>
                        <option value={6}>Sim! A maior parte são contatos indiretos (6/10)</option>
                        <option value={4}>Acho que sim... talvez não (4/10)</option>
                        <option value={1}>Não conheço (1/10)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. ASPECTOS EXTERNOS (Azul) */}
                <div className="bg-cyan-50/70 border border-cyan-200 p-5 rounded-2xl space-y-4 text-xs">
                  <span className="font-extrabold text-cyan-900 uppercase tracking-wider text-xs block flex items-center space-x-1.5">
                    <Target className="w-4 h-4 text-cyan-700" />
                    <span>Aspectos Externos (Mercado, Clientes & Inovação)</span>
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">4. Resolve o problema de quantas pessoas?</label>
                      <select
                        value={opMuitasPessoas}
                        onChange={e => setOpMuitasPessoas(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value={10}>Bilhões de pessoas (10/10)</option>
                        <option value={8}>Milhões de pessoas (8/10)</option>
                        <option value={6}>Milhares de pessoas (6/10)</option>
                        <option value={3}>Dezenas / Poucas pessoas (3/10)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">5. Tipo de problema (Necessidade de Maslow)?</label>
                      <select
                        value={opTipoNecessidade}
                        onChange={e => setOpTipoNecessidade(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value={10}>Auto-realização / Básica (10/10)</option>
                        <option value={8}>Auto-estima / Status (8/10)</option>
                        <option value={8}>Segurança física/financeira (8/10)</option>
                        <option value={7}>Social / Pertencimento (7/10)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">6. Alcance da sua ideia "atual"?</label>
                      <select
                        value={opAlcanceIdeia}
                        onChange={e => setOpAlcanceIdeia(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value={10}>Global (Escalável sem fronteiras) (10/10)</option>
                        <option value={8}>Nacional (Todo o Brasil) (8/10)</option>
                        <option value={6}>Regional (Estado / Região) (6/10)</option>
                        <option value={4}>Cidade / Bairro Local (4/10)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">7. Benefício claro para o cliente?</label>
                      <select
                        value={opBeneficioClaro}
                        onChange={e => setOpBeneficioClaro(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value={10}>Só de olhar a pessoa já entende! (10/10)</option>
                        <option value={8}>Só de ler a explicação básica (8/10)</option>
                        <option value={6}>Requer breve explicação (6/10)</option>
                        <option value={4}>Requer demonstração técnica avançada (4/10)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">8. Tamanho estimado do seu mercado?</label>
                      <select
                        value={opTamanhoMercado}
                        onChange={e => setOpTamanhoMercado(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value={10}>Mercado de R$ Bilhões (10/10)</option>
                        <option value={8}>Mercado de R$ Centenas de Milhões (8/10)</option>
                        <option value={6}>Mercado de R$ Milhões (6/10)</option>
                        <option value={4}>Mercado de R$ Milhares (4/10)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">9. Lucratividade / Margem?</label>
                      <select
                        value={opLucratividade}
                        onChange={e => setOpLucratividade(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value={10}>Altíssima (&gt; 40% margem líquida) (10/10)</option>
                        <option value={8}>Alta (20% a 40% margem líquida) (8/10)</option>
                        <option value={5}>Média (10% a 20% margem) (5/10)</option>
                        <option value={2}>Baixa (&lt; 10% margem) (2/10)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-800 mb-1">10. Nível de Inovação da Solução?</label>
                      <select
                        value={opInovacao}
                        onChange={e => setOpInovacao(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold"
                      >
                        <option value={10}>Inovadora no MUNDO (Inédita) (10/10)</option>
                        <option value={8}>Inovadora no BRASIL (Pioneira nacional) (8/10)</option>
                        <option value={7}>Inovadora no SEGMENTO em que atuo (7/10)</option>
                        <option value={5}>Inovadora apenas na minha REGIÃO (5/10)</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Diagnostic Advice */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center space-x-2 font-bold text-cyan-400">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Parecer Diagnóstico da Oportunidade:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {totalOpportunityScore >= 75
                  ? `Sua ideia possui um Score 360º de ${totalOpportunityScore}%. Tanto os aspectos de paixão e motivação interna quanto os fatores de mercado e escala indicam um potencial altíssimo de tração. Recomendamos avançar para a Prototipagem do Negócio.`
                  : totalOpportunityScore >= 50
                  ? `Sua oportunidade obteve Score de ${totalOpportunityScore}%. O projeto é promissor, mas requer atenção no aumento da percepção do beneficio e expansão do alcance do mercado.`
                  : `Score atual: ${totalOpportunityScore}%. Avalie pivotar aspectos do benefício do cliente ou do segmento de atuação para aumentar a margem e atratividade antes de investir capital.`}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          TAB 3: PROTOTIPAGEM DE NEGÓCIO (VIABILIDADE & MVP)
      ========================================== */}
      {activeTab === 'prototipagem' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-widest block">Simulador & Modelagem Financeira</span>
                <h2 className="text-xl font-extrabold text-slate-900">Prototipagem de Negócio & Indicadores de Viabilidade</h2>
              </div>
              <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold">
                <Lightbulb className="w-4 h-4 text-cyan-600" />
                <span>Análise de Viabilidade Econômico-Financeira</span>
              </div>
            </div>

            {/* Input Form for Prototype */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome do Projeto/Ideia *</label>
                <input
                  type="text"
                  value={protoName}
                  onChange={e => setProtoName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Segmento de Atuação</label>
                <input
                  type="text"
                  value={protoSegment}
                  onChange={e => setProtoSegment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Investimento Inicial (CapEx R$)</label>
                <input
                  type="number"
                  value={protoCapex}
                  onChange={e => setProtoCapex(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-cyan-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Custos Fixos Mensais (OpEx R$)</label>
                <input
                  type="number"
                  value={protoFixedOpex}
                  onChange={e => setProtoFixedOpex(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preço Planejado / Ticket (R$)</label>
                <input
                  type="number"
                  value={protoPriceUnit}
                  onChange={e => setProtoPriceUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Custo Variável Unid/Serviço (R$)</label>
                <input
                  type="number"
                  value={protoVarCostUnit}
                  onChange={e => setProtoVarCostUnit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vendas Mensais Esperadas (Qtd)</label>
                <input
                  type="number"
                  value={protoVolExpected}
                  onChange={e => setProtoVolExpected(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Taxa de Desconto / Custo Capital (% a.a.)</label>
                <input
                  type="number"
                  value={protoDiscountRate}
                  onChange={e => setProtoDiscountRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
              </div>
            </div>

            {/* Calculated Financial Viability Dashboard */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Projeção Mestra de Viabilidade ({protoName})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Faturamento Mensal</span>
                  <div className="text-lg font-black text-slate-900">
                    R$ {revenueMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-slate-400">Margem Contribuição: {marginContribPercent.toFixed(1)}%</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Break-Even (Ponto Equilíbrio)</span>
                  <div className="text-lg font-black text-amber-600">
                    {breakEvenUnits} vendas <span className="text-xs font-medium text-slate-500">(R$ {breakEvenRevenue.toLocaleString('pt-BR')})</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Margem de Segurança: {marginOfSafetyPercent.toFixed(1)}%</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Lucro Líquido Projetado</span>
                  <div className={`text-lg font-black ${netProfitMonthly >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    R$ {netProfitMonthly.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês
                  </div>
                  <span className="text-[10px] text-slate-400">Margem Líquida: {netProfitMargin.toFixed(1)}%</span>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">Payback & VPL 5 Anos</span>
                  <div className="text-lg font-black text-white">
                    {paybackMonths > 0 ? `${paybackMonths} meses` : 'Inviável'}
                  </div>
                  <span className="text-[10px] text-slate-300">VPL Estimado: R$ {estimatedNPV.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>

            {/* MATRIZ DE CENÁRIOS (PESSIMISTA, REALISTA, OTIMISTA) */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                Matriz de Sensibilidade e Cenários de Vendas
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Pessimista */}
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider block">Cenário Pessimista (-20% Vendas)</span>
                  <div className="text-base font-black text-rose-900">
                    {pessimisticVol} vendas /mês
                  </div>
                  <div className="text-xs font-bold text-rose-700">
                    Lucro Líquido: R$ {pessimisticProfit.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-[10px] text-rose-600">Comportamento em momentos de retração de mercado.</p>
                </div>

                {/* Realista */}
                <div className="bg-cyan-50 border border-cyan-200 p-4 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-extrabold text-cyan-800 uppercase tracking-wider block">Cenário Realista (Base)</span>
                  <div className="text-base font-black text-cyan-900">
                    {vol} vendas /mês
                  </div>
                  <div className="text-xs font-bold text-cyan-700">
                    Lucro Líquido: R$ {netProfitMonthly.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-[10px] text-cyan-600">Meta estipulada de plano de negócios.</p>
                </div>

                {/* Otimista */}
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block">Cenário Otimista (+25% Vendas)</span>
                  <div className="text-base font-black text-emerald-900">
                    {optimisticVol} vendas /mês
                  </div>
                  <div className="text-xs font-bold text-emerald-700">
                    Lucro Líquido: R$ {optimisticProfit.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-[10px] text-emerald-600">Com atração acelerada via tráfego pago Sharp.</p>
                </div>
              </div>
            </div>

            {/* TESTE DE MVP E HIPÓTESES DE PROTOTIPAGEM */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-cyan-800 uppercase tracking-widest block">Metodologia Lean Startup</span>
                  <h3 className="text-base font-extrabold text-slate-900">Validação de Protótipo e Hipóteses de MVP</h3>
                </div>
              </div>

              {/* Add Hypothesis Form */}
              <form onSubmit={handleAddHypothesis} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Hipótese do Protótipo *"
                  value={newHypo}
                  onChange={e => setNewHypo(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Método de Validação"
                  value={newMethod}
                  onChange={e => setNewMethod(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold rounded-xl px-4 py-2 cursor-pointer uppercase tracking-wider"
                >
                  + Adicionar Hipótese
                </button>
              </form>

              {/* Hypotheses List */}
              <div className="space-y-2">
                {mvpHypotheses.map(item => (
                  <div key={item.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">{item.hypothesis}</div>
                      <div className="text-[10px] text-slate-500">
                        <strong>Validação:</strong> {item.validationMethod} | <strong>Meta:</strong> {item.metricTarget}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className={`px-3 py-1 rounded-full font-extrabold text-[10px] cursor-pointer ${
                        item.status === 'Validado' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        item.status === 'Em Teste' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        item.status === 'Pivotado' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          TAB 4: ANÁLISE DE PROJETOS (5W2H & PDCA INTEGRADOS)
      ========================================== */}
      {activeTab === 'analise_projeto' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Section 5W2H */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-widest block">Metodologia Integrada de Execução</span>
                <h2 className="text-xl font-extrabold text-slate-900">Plano de Ação 5W2H & Ciclo PDCA</h2>
              </div>
              <div className="text-xs bg-cyan-50 border border-cyan-200 text-cyan-800 px-3 py-1.5 rounded-xl font-extrabold flex items-center space-x-1.5">
                <CheckSquare className="w-4 h-4 text-cyan-600" />
                <span>Total Orçado: R$ {actionItems.reduce((acc, curr) => acc + curr.howMuch, 0).toLocaleString('pt-BR')}</span>
              </div>
            </div>

            {/* Form 5W2H */}
            <form onSubmit={handleAdd5W2H} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider">
                Adicionar Nova Ação ao Plano de Projeto:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="What (O que fazer) *"
                  value={wWhat}
                  onChange={e => setWWhat(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
                <input
                  type="text"
                  placeholder="Why (Por que fazer)"
                  value={wWhy}
                  onChange={e => setWWhy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
                <input
                  type="text"
                  placeholder="Where (Onde / Canal)"
                  value={wWhere}
                  onChange={e => setWWhere(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
                <input
                  type="text"
                  placeholder="When (Quando / Prazo)"
                  value={wWhen}
                  onChange={e => setWWhen(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
                <input
                  type="text"
                  required
                  placeholder="Who (Quem é o responsável) *"
                  value={wWho}
                  onChange={e => setWWho(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
                <input
                  type="text"
                  placeholder="How (Como será feito)"
                  value={wHow}
                  onChange={e => setWHow(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />
                <input
                  type="number"
                  placeholder="How Much (Custo R$)"
                  value={wHowMuch}
                  onChange={e => setWHowMuch(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                />
                <select
                  value={wPdcaPhase}
                  onChange={e => setWPdcaPhase(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                >
                  <option value="Plan">PDCA: Plan (Planejar)</option>
                  <option value="Do">PDCA: Do (Executar)</option>
                  <option value="Check">PDCA: Check (Checar)</option>
                  <option value="Act">PDCA: Act (Padronizar)</option>
                </select>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold rounded-xl px-6 py-2.5 cursor-pointer uppercase tracking-wider text-xs shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Ação no Plano</span>
                </button>
              </div>
            </form>

            {/* PDCA Columns View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { phase: 'Plan', title: '1. Plan (Planejar)', color: 'border-cyan-500 bg-cyan-50/50 text-cyan-900' },
                { phase: 'Do', title: '2. Do (Executar)', color: 'border-amber-500 bg-amber-50/50 text-amber-900' },
                { phase: 'Check', title: '3. Check (Checar)', color: 'border-purple-500 bg-purple-50/50 text-purple-900' },
                { phase: 'Act', title: '4. Act (Padronizar)', color: 'border-emerald-500 bg-emerald-50/50 text-emerald-900' }
              ].map(col => {
                const itemsInPhase = actionItems.filter(i => i.pdcaPhase === col.phase);
                return (
                  <div key={col.phase} className={`p-4 rounded-2xl border-t-4 border ${col.color} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs">{col.title}</span>
                      <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-slate-200">
                        {itemsInPhase.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {itemsInPhase.map(item => (
                        <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2 text-xs">
                          <div className="font-bold text-slate-900">{item.what}</div>
                          <p className="text-[10px] text-slate-500 leading-tight">{item.why}</p>
                          <div className="text-[10px] text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100">
                            <span>Resp: <strong>{item.who}</strong></span>
                            <span className="font-bold text-emerald-600">R$ {item.howMuch}</span>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <button
                              onClick={() => handleToggleStatus(item.id)}
                              className={`px-2 py-1 rounded-lg text-[9px] font-extrabold cursor-pointer ${
                                item.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.status}
                            </button>
                            <button
                              onClick={() => handleDeleteTask(item.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          TAB 5: BUSINESS MODEL CANVAS
      ========================================== */}
      {activeTab === 'business_canvas' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-widest block">Matriz Estratégica Osterwalder</span>
                <h2 className="text-xl font-extrabold text-slate-900">Business Model Canvas Separado & Robusto</h2>
              </div>

              {/* Form Add Canvas Item */}
              <form onSubmit={handleAddCanvasItem} className="flex items-center space-x-2 w-full sm:w-auto text-xs">
                <select
                  value={canvasBlockSelect}
                  onChange={e => setCanvasBlockSelect(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 font-bold text-slate-700"
                >
                  <option value="parcerias">1. Parcerias Chave</option>
                  <option value="atividades">2. Atividades Chave</option>
                  <option value="recursos">3. Recursos Chave</option>
                  <option value="propostaValor">4. Proposta de Valor</option>
                  <option value="relacionamento">5. Relacionamento</option>
                  <option value="canais">6. Canais</option>
                  <option value="segmentos">7. Segmentos de Clientes</option>
                  <option value="custos">8. Estrutura de Custos</option>
                  <option value="receitas">9. Fontes de Receita</option>
                </select>

                <input
                  type="text"
                  placeholder="Novo item..."
                  value={canvasItemInput}
                  onChange={e => setCanvasItemInput(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                />

                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl px-4 py-2 cursor-pointer uppercase shrink-0"
                >
                  + Add
                </button>
              </form>
            </div>

            {/* Beautiful 9-Block Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
              
              {/* Block 1: Parcerias Chave */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 min-h-[180px]">
                <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block border-b border-slate-200 pb-1">
                  1. Parcerias Chave
                </span>
                <div className="space-y-1">
                  {canvasData.parcerias.map((item, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800 font-medium flex items-center justify-between text-[11px]">
                      <span>{item}</span>
                      <button onClick={() => handleRemoveCanvasItem('parcerias', idx)} className="text-slate-400 hover:text-rose-600 ml-1">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Block 2: Atividades Chave & Recursos Chave */}
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 min-h-[140px]">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block border-b border-slate-200 pb-1">
                    2. Atividades Chave
                  </span>
                  <div className="space-y-1">
                    {canvasData.atividades.map((item, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800 font-medium flex items-center justify-between text-[11px]">
                        <span>{item}</span>
                        <button onClick={() => handleRemoveCanvasItem('atividades', idx)} className="text-slate-400 hover:text-rose-600 ml-1">✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 min-h-[140px]">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block border-b border-slate-200 pb-1">
                    3. Recursos Chave
                  </span>
                  <div className="space-y-1">
                    {canvasData.recursos.map((item, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800 font-medium flex items-center justify-between text-[11px]">
                        <span>{item}</span>
                        <button onClick={() => handleRemoveCanvasItem('recursos', idx)} className="text-slate-400 hover:text-rose-600 ml-1">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Block 3: Proposta de Valor (Center Core) */}
              <div className="bg-cyan-50/70 p-4 rounded-2xl border border-cyan-200 space-y-2 min-h-[290px]">
                <span className="font-extrabold text-cyan-900 text-[11px] uppercase tracking-wider block border-b border-cyan-200 pb-1 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-700" />
                  <span>4. Proposta de Valor</span>
                </span>
                <div className="space-y-1">
                  {canvasData.propostaValor.map((item, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-lg border border-cyan-200 text-slate-900 font-bold shadow-2xs flex items-center justify-between text-[11px]">
                      <span>{item}</span>
                      <button onClick={() => handleRemoveCanvasItem('propostaValor', idx)} className="text-slate-400 hover:text-rose-600 ml-1">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Block 4: Relacionamento & Canais */}
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 min-h-[140px]">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block border-b border-slate-200 pb-1">
                    5. Relacionamento
                  </span>
                  <div className="space-y-1">
                    {canvasData.relacionamento.map((item, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800 font-medium flex items-center justify-between text-[11px]">
                        <span>{item}</span>
                        <button onClick={() => handleRemoveCanvasItem('relacionamento', idx)} className="text-slate-400 hover:text-rose-600 ml-1">✕</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 min-h-[140px]">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block border-b border-slate-200 pb-1">
                    6. Canais
                  </span>
                  <div className="space-y-1">
                    {canvasData.canais.map((item, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800 font-medium flex items-center justify-between text-[11px]">
                        <span>{item}</span>
                        <button onClick={() => handleRemoveCanvasItem('canais', idx)} className="text-slate-400 hover:text-rose-600 ml-1">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Block 5: Segmentos de Clientes */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 min-h-[180px]">
                <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block border-b border-slate-200 pb-1">
                  7. Segmentos de Clientes
                </span>
                <div className="space-y-1">
                  {canvasData.segmentos.map((item, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-slate-800 font-medium flex items-center justify-between text-[11px]">
                      <span>{item}</span>
                      <button onClick={() => handleRemoveCanvasItem('segmentos', idx)} className="text-slate-400 hover:text-rose-600 ml-1">✕</button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Row: Custos & Receitas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 space-y-2">
                <span className="font-extrabold text-rose-900 text-[11px] uppercase tracking-wider block border-b border-rose-200 pb-1">
                  8. Estrutura de Custos
                </span>
                <div className="space-y-1">
                  {canvasData.custos.map((item, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-rose-200 text-slate-800 font-medium flex items-center justify-between text-[11px]">
                      <span>{item}</span>
                      <button onClick={() => handleRemoveCanvasItem('custos', idx)} className="text-slate-400 hover:text-rose-600 ml-1">✕</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <span className="font-extrabold text-emerald-900 text-[11px] uppercase tracking-wider block border-b border-emerald-200 pb-1">
                  9. Fontes de Receita
                </span>
                <div className="space-y-1">
                  {canvasData.receitas.map((item, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-emerald-200 text-slate-800 font-medium flex items-center justify-between text-[11px]">
                      <span>{item}</span>
                      <button onClick={() => handleRemoveCanvasItem('receitas', idx)} className="text-slate-400 hover:text-rose-600 ml-1">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          TAB 6: PRECIFICAÇÃO & MARGENS DETALHADA
      ========================================== */}
      {activeTab === 'precificacao' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Column */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Calculator className="w-4 h-4 text-cyan-600" />
                  <span>Engenharia de Precificação & Markup Divisor</span>
                </h3>
                <p className="text-[11px] text-slate-500">Defina os custos diretos, taxas operacionais e margem desejada.</p>
              </div>

              <div className="space-y-3">
                
                {/* Custos Diretos */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block text-cyan-800">
                    1. Custos Diretos do Produto/Serviço
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Insumos / Material (R$)</label>
                      <input
                        type="number"
                        value={pCostDirectMaterial}
                        onChange={e => setPCostDirectMaterial(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mão de Obra Direta (R$)</label>
                      <input
                        type="number"
                        value={pCostDirectLabor}
                        onChange={e => setPCostDirectLabor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Margens e Rateios Operacionais */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block text-cyan-800">
                    2. Deduções Percentuais e Margens S/ Venda (%)
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Impostos S/ Venda (%)</label>
                      <input
                        type="number"
                        value={pTaxPercent}
                        onChange={e => setPTaxPercent(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Taxas Cartão/Gateway (%)</label>
                      <input
                        type="number"
                        value={pGatewayFeePercent}
                        onChange={e => setPGatewayFeePercent(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Comissão de Venda (%)</label>
                      <input
                        type="number"
                        value={pCommissionPercent}
                        onChange={e => setPCommissionPercent(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Rateio Custo Fixo (%)</label>
                      <input
                        type="number"
                        value={pFixedOverheadPercent}
                        onChange={e => setPFixedOverheadPercent(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Margem de Lucro Desejada (%)</label>
                    <input
                      type="number"
                      value={pTargetProfitPercent}
                      onChange={e => setPTargetProfitPercent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-emerald-600"
                    />
                  </div>
                </div>

                {/* PREÇO PRATICADO PELO MERCADO */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="font-bold text-amber-800 text-[11px] uppercase tracking-wider block">
                    3. Comparativo de Mercado (Benchmark)
                  </span>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Preço Praticado pelo Mercado / Concorrentes (R$)
                    </label>
                    <input
                      type="number"
                      value={pMarketPrice}
                      onChange={e => setPMarketPrice(e.target.value)}
                      className="w-full bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-slate-900 font-black text-amber-900"
                      placeholder="Ex: 3200"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Informe o valor cobrado pelos principais concorrentes no seu setor.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
                
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900">Resultado da Formulação do Preço</h3>
                  <span className="text-xs text-slate-500 font-medium">Markup Multiplicador: <strong>{markupMultiplier.toFixed(2)}x</strong></span>
                </div>

                {/* Big Price Card */}
                <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Preço de Venda Sugerido Sharp</span>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-400">
                      R$ {suggestedSellingPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <span className="text-[10px] text-slate-400">Calculado via Markup Divisor</span>
                  </div>

                  {/* Market Comparison Badge */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">Comparativo com o Mercado</span>
                    <div className="text-lg font-bold text-white">
                      R$ {marketPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-xs text-slate-400">(Mercado)</span>
                    </div>

                    <div className={`text-xs font-bold ${priceDiffR$ > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {priceDiffR$ > 0 
                        ? `+ R$ ${priceDiffR$.toFixed(2)} (+${priceDiffPercent.toFixed(1)}% acima do mercado)`
                        : `- R$ ${Math.abs(priceDiffR$).toFixed(2)} (${priceDiffPercent.toFixed(1)}% abaixo do mercado)`}
                    </div>
                  </div>
                </div>

                {/* Breakdown Progress Bars */}
                <div className="space-y-3 text-xs">
                  <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] block">
                    Composição Interna da Receita do Produto/Serviço:
                  </span>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-medium">
                      <span>Custo Direto (Materiais + Mão de Obra)</span>
                      <span className="font-bold">R$ {directCostTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between font-medium">
                      <span>Impostos ({taxPerc}%)</span>
                      <span className="font-bold">R$ {(suggestedSellingPrice * (taxPerc/100)).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between font-medium">
                      <span>Taxas Cartão / Gateway ({gatewayPerc}%)</span>
                      <span className="font-bold">R$ {(suggestedSellingPrice * (gatewayPerc/100)).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between font-medium">
                      <span>Comissão de Vendas ({commPerc}%)</span>
                      <span className="font-bold">R$ {(suggestedSellingPrice * (commPerc/100)).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between font-medium">
                      <span>Rateio de Custo Fixo ({fixedPerc}%)</span>
                      <span className="font-bold">R$ {(suggestedSellingPrice * (fixedPerc/100)).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between font-extrabold text-emerald-600 pt-2 border-t border-slate-100">
                      <span>Lucro Líquido Real ({profitPerc}%)</span>
                      <span>R$ {(suggestedSellingPrice * (profitPerc/100)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Position Strategy Note */}
                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl space-y-1 text-xs text-slate-800">
                  <strong className="text-cyan-900 font-extrabold block">Recomendação Estratégica de Posicionamento:</strong>
                  <p className="text-[11px] leading-relaxed text-slate-700">
                    {priceDiffR$ > 0
                      ? `O preço sugerido está ${priceDiffPercent.toFixed(1)}% acima da média praticada pelo mercado. Para sustentar esse valor sem perder vendas, é fundamental investir no rebranding e na percepção de valor High-Ticket através do ecossistema Sharp.`
                      : `Seu preço calculado está competitivo e ${Math.abs(priceDiffPercent).toFixed(1)}% abaixo da média praticada no mercado, permitindo margem confortável para absorver campanhas de anúncios.`}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
