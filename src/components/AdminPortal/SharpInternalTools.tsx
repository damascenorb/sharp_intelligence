import React, { useState, useEffect } from 'react';
import { 
  Building2, DollarSign, BarChart3, PieChart, Lock, Sparkles, 
  FileText, Download, CheckCircle, Calculator, TrendingUp, Users, 
  Target, ShieldAlert, Award, ArrowUpRight, ArrowDownRight, RefreshCw, Layers,
  Compass, Lightbulb, Shield, BrainCircuit, History, AlertTriangle, Play,
  Clock, CheckCircle2, XCircle, RotateCcw
} from 'lucide-react';
import { EntrepreneurHub } from '../ClientPortal/EntrepreneurHub';
import { IdeaOperatingSystem } from './IdeaOperatingSystem';
import { useApp } from '../../context/AppContext';
import { DiagnosticRecord, Account } from '../../types';
import { STORAGE_KEYS, initializeSingleSourceData } from '../../data/singleSourceData';

export const SharpInternalTools: React.FC = () => {
  const { currentUser, analyzePain } = useApp();
  const [activeInternalTab, setActiveInternalTab] = useState<'consultoria' | 'diagnosticos_contas' | 'hub_completo' | 'idea_os'>('consultoria');

  // Accounts list for linking diagnostics
  const [accounts, setAccounts] = useState<Account[]>(() => {
    return initializeSingleSourceData().accounts;
  });

  // Diagnostic records list (ETAPA 8)
  const [diagnostics, setDiagnostics] = useState<DiagnosticRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.diagnosticRecords);
        if (raw) return JSON.parse(raw);
      } catch (err) {
        console.error('Error loading diagnostics:', err);
      }
    }
    return [
      {
        id: 'diag_init_1',
        accountId: 'acc_lumina',
        type: 'pain_analysis',
        status: 'completed',
        input: { text: 'Alinhamento de esteira de tratamentos e aumento de ticket médio.' },
        result: { executiveSummary: 'Necessidade de estruturação de esteira de produtos e posicionamento de marca premium.' },
        createdBy: 'Raphael Damasceno',
        createdAt: '2026-02-10T14:30:00.000Z',
        completedAt: '2026-02-10T14:30:05.000Z'
      }
    ];
  });

  // New diagnostic runner state
  const [selectedAccountId, setSelectedAccountId] = useState<string>(() => accounts[0]?.id || 'acc_lumina');
  const [diagnosticType, setDiagnosticType] = useState<DiagnosticRecord['type']>('pain_analysis');
  const [diagnosticInputText, setDiagnosticInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [lastCompletedResult, setLastCompletedResult] = useState<any>(null);

  // Sync helpers
  const saveDiagnostics = (newDiags: DiagnosticRecord[]) => {
    setDiagnostics(newDiags);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.diagnosticRecords, JSON.stringify(newDiags));
    }
  };

  // Run AI Diagnostic with timeout, fallback, and status recording (ETAPA 8)
  const handleRunDiagnostic = async () => {
    if (!diagnosticInputText.trim()) return;

    const account = accounts.find(a => a.id === selectedAccountId);
    const diagId = `diag_${Date.now()}`;

    // Step 1: Create record with 'processing'
    const newRecord: DiagnosticRecord = {
      id: diagId,
      accountId: selectedAccountId,
      type: diagnosticType,
      status: 'processing',
      input: {
        text: diagnosticInputText.trim(),
        companyName: account?.companyName || 'Empresa',
        segment: account?.segment || 'Serviços'
      },
      createdBy: currentUser?.name || 'Estrategista Sharp',
      createdAt: new Date().toISOString()
    };

    const updatedList = [newRecord, ...diagnostics];
    saveDiagnostics(updatedList);

    setIsProcessing(true);
    setProcessingError(null);
    setLastCompletedResult(null);

    // Timeout safety: 12 seconds max
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Tempo limite excedido na conexão de IA')), 12000);
    });

    try {
      // Step 3: Call AI
      const apiCall = analyzePain(diagnosticInputText.trim());
      const result = await Promise.race([apiCall, timeoutPromise]);

      if (result) {
        // Step 4: Success -> updated to 'completed'
        const completedRecord: DiagnosticRecord = {
          ...newRecord,
          status: 'completed',
          result: result,
          completedAt: new Date().toISOString()
        };
        const finalList = updatedList.map(d => d.id === diagId ? completedRecord : d);
        saveDiagnostics(finalList);
        setLastCompletedResult(result);
      } else {
        throw new Error('Não foi possível gerar a resposta completa da IA');
      }
    } catch (err: any) {
      // Step 5: Failed -> save error and status 'failed'
      const errorMsg = err?.message || 'Falha temporária ao comunicar com a inteligência artificial.';
      const failedRecord: DiagnosticRecord = {
        ...newRecord,
        status: 'failed',
        errorMessage: errorMsg,
        completedAt: new Date().toISOString()
      };
      const finalList = updatedList.map(d => d.id === diagId ? failedRecord : d);
      saveDiagnostics(finalList);
      setProcessingError(errorMsg);
    } finally {
      // Step 6: Always clear processing state
      setIsProcessing(false);
    }
  };

  // Fallback preliminary analysis (ETAPA 8.8)
  const handleUsePreliminaryFallback = () => {
    const account = accounts.find(a => a.id === selectedAccountId);
    const diagId = `diag_fallback_${Date.now()}`;

    const fallbackResult = {
      executiveSummary: `Análise preliminar local estruturada para ${account?.companyName || 'Empresa'}. Identificada necessidade prioritária de alinhamento entre posicionamento de mercado e esteira de produtos high-ticket.`,
      recommendedPillar: 'Estruturação Comercial & Posicionamento de Marca',
      keyActions: [
        'Padronização da proposta de valor com metodologia Sharp',
        'Revisão do ticket médio e estratégia de retenção de clientes',
        'Estruturação de esteira de entregáveis previsíveis'
      ]
    };

    const completedRecord: DiagnosticRecord = {
      id: diagId,
      accountId: selectedAccountId,
      type: diagnosticType,
      status: 'completed',
      input: {
        text: diagnosticInputText.trim() || 'Análise preliminar local',
        companyName: account?.companyName || 'Empresa'
      },
      result: fallbackResult,
      createdBy: currentUser?.name || 'Estrategista Sharp (Modo Local)',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    saveDiagnostics([completedRecord, ...diagnostics]);
    setLastCompletedResult(fallbackResult);
    setProcessingError(null);
  };

  // Client & General Business Info
  const [clientCompany, setClientCompany] = useState('Lumina Odontologia Estética');
  const [segment, setSegment] = useState('Saúde & Odontologia High-Ticket');
  const [businessModel, setBusinessModel] = useState('Serviços Recorrentes / Venda de Tratamentos');

  // DRE & Financial Inputs
  const [receitaBruta, setReceitaBruta] = useState<string>('150000');
  const [impostosPercent, setImpostosPercent] = useState<string>('10');
  const [custosVariaveis, setCustosVariaveis] = useState<string>('30000');
  const [custosFixos, setCustosFixos] = useState<string>('45000');

  // Marketing, Sales & Advanced Diagnostic Inputs
  const [investimentoMidia, setInvestimentoMidia] = useState<string>('12000');
  const [custosComerciais, setCustosComerciais] = useState<string>('8000');
  const [novosClientes, setNovosClientes] = useState<string>('16');
  const [baseClientesAtivos, setBaseClientesAtivos] = useState<string>('65');
  const [ticketMedio, setTicketMedio] = useState<string>('3500');
  const [churnRatePercent, setChurnRatePercent] = useState<string>('3.5');
  const [lifespanMonths, setLifespanMonths] = useState<string>('14');

  // Extended High-Precision Diagnostic Metrics
  const [concentrationPercent, setConcentrationPercent] = useState<string>('25'); // Top 3 clientes % da receita
  const [paybackMonths, setPaybackMonths] = useState<string>('3.5'); // Payback do CAC em meses
  const [conversionRatePercent, setConversionRatePercent] = useState<string>('18'); // Conversão de propostas %
  const [founderDependencyLevel, setFounderDependencyLevel] = useState<string>('4'); // 1-5 (5 = Dependência Crítica)
  const [npsScore, setNpsScore] = useState<string>('72'); // Satisfação do cliente (-100 a +100)
  const [cycleDsoDays, setCycleDsoDays] = useState<string>('38'); // Prazo médio de recebimento (dias)

  // Parsed Numerical Values
  const recBruta = parseFloat(receitaBruta) || 0;
  const impPercent = parseFloat(impostosPercent) || 0;
  const cVariaveis = parseFloat(custosVariaveis) || 0;
  const cFixos = parseFloat(custosFixos) || 0;

  const invMidia = parseFloat(investimentoMidia) || 0;
  const cComercial = parseFloat(custosComerciais) || 0;
  const nClientes = parseFloat(novosClientes) || 1;
  const tMedio = parseFloat(ticketMedio) || 0;
  const churnPercent = parseFloat(churnRatePercent) || 0;
  const lifespan = parseFloat(lifespanMonths) || 1;

  const concPercent = parseFloat(concentrationPercent) || 0;
  const paybackM = parseFloat(paybackMonths) || 0;
  const convRate = parseFloat(conversionRatePercent) || 0;
  const founderDep = parseFloat(founderDependencyLevel) || 1;
  const nps = parseFloat(npsScore) || 0;
  const dsoDays = parseFloat(cycleDsoDays) || 0;

  // --- COMPUTE KEY MASTER INDICATORS ---
  const valorImpostos = recBruta * (impPercent / 100);
  const margemContribucaoR$ = recBruta - cVariaveis - valorImpostos;
  const margemContribucaoPercent = recBruta > 0 ? (margemContribucaoR$ / recBruta) * 100 : 0;

  const lucroOperacionalR$ = margemContribucaoR$ - cFixos;
  const margemLiquidaPercent = recBruta > 0 ? (lucroOperacionalR$ / recBruta) * 100 : 0;

  const breakEvenR$ = margemContribucaoPercent > 0 ? (cFixos / (margemContribucaoPercent / 100)) : 0;
  const folgaOperacionalPercent = recBruta > 0 ? ((recBruta - breakEvenR$) / recBruta) * 100 : 0;

  // CAC & LTV Calculations
  const investimentoTotalAquisitation = invMidia + cComercial;
  const cac = nClientes > 0 ? investimentoTotalAquisitation / nClientes : 0;
  
  const ltv = tMedio * lifespan;
  const ltvCacRatio = cac > 0 ? ltv / cac : 0;

  // ROI de Mídia/Marketing
  const receitaGeradaNovosClientes = nClientes * tMedio;
  const roiMidiaPercent = invMidia > 0 ? ((receitaGeradaNovosClientes - invMidia) / invMidia) * 100 : 0;

  // Health Score Calculation (0-100)
  let healthScore = 50;
  if (margemLiquidaPercent >= 20) healthScore += 15;
  else if (margemLiquidaPercent >= 10) healthScore += 10;

  if (ltvCacRatio >= 3) healthScore += 20;
  else if (ltvCacRatio >= 1.5) healthScore += 10;

  if (folgaOperacionalPercent >= 30) healthScore += 15;
  else if (folgaOperacionalPercent >= 10) healthScore += 5;

  if (churnPercent <= 4) healthScore += 10;

  healthScore = Math.min(100, Math.max(0, healthScore));

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fadeIn pb-12 print:p-0 print:m-0 print:max-w-none">
      
      {/* Top Banner Navigation for Sharp Staff */}
      <div className="bg-gradient-to-r from-slate-50 via-cyan-50/40 to-slate-50 text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Ferramentas Internas Sharp • Gestão & Consultoria Executiva</span>
            </span>
            <span className="text-xs text-slate-500 font-medium">Equipe Interna Sharp</span>
          </div>
          <span className="text-xs text-emerald-700 font-extrabold flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Módulo Consultivo Senior</span>
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ferramentas Internas de Consultoria & Gestão
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1 leading-relaxed">
            Painel interno com diagnóstico consultivo avançado de LTV, CAC, DRE, e acesso completo às ferramentas de Análise de Oportunidade 360º SEBRAE, Prototipagem de Negócio e Precificação.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveInternalTab('consultoria')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeInternalTab === 'consultoria'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Diagnóstico Mestre</span>
          </button>

          <button
            onClick={() => setActiveInternalTab('diagnosticos_contas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeInternalTab === 'diagnosticos_contas'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Histórico de Diagnósticos por Conta</span>
          </button>

          <button
            onClick={() => setActiveInternalTab('hub_completo')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeInternalTab === 'hub_completo'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Ferramentas de Soluções</span>
          </button>

          <button
            onClick={() => setActiveInternalTab('idea_os')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
              activeInternalTab === 'idea_os'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 font-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-cyan-300" />
            <span>Tomada de Decisão em Novos Negócios</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: DIAGNÓSTICO MESTRE LTV/CAC */}
      {activeInternalTab === 'consultoria' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5 print:hidden">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center space-x-1.5">
                  <Calculator className="w-4 h-4 text-cyan-600" />
                  <span>Parâmetros Financeiros & Comerciais</span>
                </h2>
                <p className="text-[11px] text-slate-500">Coleta de dados da entrevista consultiva.</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Bloco 1: Identificação */}
              <div className="space-y-2">
                <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block text-cyan-800">
                  1. Identificação do Cliente
                </span>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Empresa Analisada</label>
                  <input
                    type="text"
                    value={clientCompany}
                    onChange={e => setClientCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Segmento</label>
                    <input
                      type="text"
                      value={segment}
                      onChange={e => setSegment(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Modelo de Negócio</label>
                    <input
                      type="text"
                      value={businessModel}
                      onChange={e => setBusinessModel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Bloco 2: DRE Básico */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block text-cyan-800">
                  2. DRE Operacional Mensal
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Receita Bruta (R$)</label>
                    <input
                      type="number"
                      value={receitaBruta}
                      onChange={e => setReceitaBruta(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Impostos S/ Venda (%)</label>
                    <input
                      type="number"
                      value={impostosPercent}
                      onChange={e => setImpostosPercent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Custos Variáveis (R$)</label>
                    <input
                      type="number"
                      value={custosVariaveis}
                      onChange={e => setCustosVariaveis(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Custos Fixos Totais (R$)</label>
                    <input
                      type="number"
                      value={custosFixos}
                      onChange={e => setCustosFixos(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Bloco 3: Mídia, Vendas & Clientes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block text-cyan-800">
                  3. Métricas de Vendas, CAC & LTV
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Invest. Mídia Pago (R$)</label>
                    <input
                      type="number"
                      value={investimentoMidia}
                      onChange={e => setInvestimentoMidia(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-cyan-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Custo Comercial/Vendas (R$)</label>
                    <input
                      type="number"
                      value={custosComerciais}
                      onChange={e => setCustosComerciais(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Novos Clientes Mês (Qtd)</label>
                    <input
                      type="number"
                      value={novosClientes}
                      onChange={e => setNovosClientes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ticket Médio (R$)</label>
                    <input
                      type="number"
                      value={ticketMedio}
                      onChange={e => setTicketMedio(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Permanência Média (Meses)</label>
                    <input
                      type="number"
                      value={lifespanMonths}
                      onChange={e => setLifespanMonths(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Churn Rate Mensal (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={churnRatePercent}
                      onChange={e => setChurnRatePercent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Bloco 4: Diagnóstico Mestre de Riscos, Operação & Retenção */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block text-cyan-800">
                  4. Parâmetros de Riscos, Reter & Operar
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Concentração Top 3 Clientes (%)</label>
                    <input
                      type="number"
                      value={concentrationPercent}
                      onChange={e => setConcentrationPercent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Payback do CAC (Meses)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={paybackMonths}
                      onChange={e => setPaybackMonths(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Conversão Funil Vendas (%)</label>
                    <input
                      type="number"
                      value={conversionRatePercent}
                      onChange={e => setConversionRatePercent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Prazo Recebimento DSO (Dias)</label>
                    <input
                      type="number"
                      value={cycleDsoDays}
                      onChange={e => setCycleDsoDays(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dependência Sócios (1 a 5)</label>
                    <select
                      value={founderDependencyLevel}
                      onChange={e => setFounderDependencyLevel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold"
                    >
                      <option value="1">1 - Baixa (Processos Rodam)</option>
                      <option value="2">2 - Moderada</option>
                      <option value="3">3 - Média</option>
                      <option value="4">4 - Alta (Fundador Centraliza)</option>
                      <option value="5">5 - Crítica (Operação Para Sem Sócios)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Satisfação NPS (-100 a +100)</label>
                    <input
                      type="number"
                      value={npsScore}
                      onChange={e => setNpsScore(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-emerald-600"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Senior Master Report & Indicators */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
              
              {/* Report Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-cyan-800 uppercase tracking-widest block">
                    Relatório Executivo de Inteligência Estratégica
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">{clientCompany}</h3>
                  <p className="text-xs text-slate-500 font-medium">{segment} • {businessModel}</p>
                </div>

                <button
                  onClick={handlePrintReport}
                  className="px-4 py-2 bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm print:hidden"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Imprimir Diagnóstico</span>
                </button>
              </div>

              {/* Health Score & Overall Assessment (UNIFIED LIGHT THEME) */}
              <div className="bg-gradient-to-r from-cyan-50 via-white to-cyan-50 text-slate-900 p-6 rounded-2xl border border-cyan-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-4 text-center sm:border-r border-slate-200 sm:pr-4 space-y-1">
                  <span className="text-[10px] font-extrabold text-cyan-800 uppercase tracking-wider block">Score de Saúde Sharp</span>
                  <div className="text-4xl font-black text-slate-900">{healthScore}<span className="text-lg text-slate-500">/100</span></div>
                  <div className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    healthScore >= 75 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    healthScore >= 50 ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {healthScore >= 75 ? 'Excelente Saúde Operacional' : healthScore >= 50 ? 'Estável com Oportunidades' : 'Alerta de Ineficiência'}
                  </div>
                </div>

                <div className="sm:col-span-8 text-xs text-slate-700 space-y-1">
                  <strong className="text-slate-900 block font-bold text-sm">Resumo do Mestre em Consultoria:</strong>
                  <p className="leading-relaxed text-[11px] text-slate-600 font-medium">
                    {ltvCacRatio >= 3 
                      ? `A relação LTV/CAC de ${ltvCacRatio.toFixed(1)}x é excelente e indica que a empresa tem tração forte para acelerar investimentos em mídia.`
                      : `A relação LTV/CAC atual de ${ltvCacRatio.toFixed(1)}x exige otimização do custo de aquisição (CAC: R$ ${cac.toFixed(0)}) ou aumento do tempo de retenção do cliente.`}
                    A folga operacional em relação ao ponto de equilíbrio é de <strong className="text-slate-900">{folgaOperacionalPercent.toFixed(1)}%</strong>.
                  </p>
                </div>
              </div>

              {/* Grid 6 Key Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                
                {/* CAC */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CAC (Custo de Aquisição)</span>
                  <div className="text-lg font-black text-slate-900">
                    R$ {cac.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[10px] text-slate-400">Invest. Mídia + Vendas / Clientes</span>
                </div>

                {/* LTV */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">LTV (Lifetime Value)</span>
                  <div className="text-lg font-black text-emerald-600">
                    R$ {ltv.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[10px] text-slate-400">Valor gerado no ciclo de vida</span>
                </div>

                {/* LTV / CAC Ratio */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Relação LTV / CAC</span>
                  <div className={`text-lg font-black ${ltvCacRatio >= 3 ? 'text-emerald-600' : ltvCacRatio >= 1.5 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {ltvCacRatio.toFixed(1)}x
                  </div>
                  <span className="text-[10px] text-slate-400">{ltvCacRatio >= 3 ? 'Meta > 3x (Escalável)' : 'Necessita Ajuste'}</span>
                </div>

                {/* ROI de Mídia */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ROI de Mídia Pago</span>
                  <div className="text-lg font-black text-cyan-800">
                    {roiMidiaPercent.toFixed(0)}%
                  </div>
                  <span className="text-[10px] text-slate-400">Retorno sobre investimento</span>
                </div>

                {/* Break-Even Point */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ponto de Equilíbrio</span>
                  <div className="text-lg font-black text-amber-600">
                    R$ {breakEvenR$.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[10px] text-slate-400">Faturamento mínimo necessário</span>
                </div>

                {/* Lucro Operacional Líquido */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Lucro Líquido / EBITDA</span>
                  <div className={`text-lg font-black ${lucroOperacionalR$ >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    R$ {lucroOperacionalR$.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                  </div>
                  <span className="text-[10px] text-slate-400">Margem Líquida: {margemLiquidaPercent.toFixed(1)}%</span>
                </div>

                {/* Concentração de Clientes */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Concentração Top 3</span>
                  <div className={`text-lg font-black ${concPercent > 35 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {concPercent}%
                  </div>
                  <span className="text-[10px] text-slate-400">{concPercent > 35 ? '⚠️ Risco de Concentração' : 'Distribuição Saudável'}</span>
                </div>

                {/* Payback do CAC */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Payback do CAC</span>
                  <div className={`text-lg font-black ${paybackM <= 6 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {paybackM} meses
                  </div>
                  <span className="text-[10px] text-slate-400">{paybackM <= 6 ? '✓ Retorno Rápido (< 6m)' : 'Retorno Longo'}</span>
                </div>

                {/* Conversão do Funil */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Conversão de Vendas</span>
                  <div className="text-lg font-black text-cyan-800">
                    {convRate}%
                  </div>
                  <span className="text-[10px] text-slate-400">Propostas para Fechamento</span>
                </div>

                {/* Dependência dos Fundadores */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Dependência Sócios</span>
                  <div className={`text-lg font-black ${founderDep >= 4 ? 'text-rose-600' : 'text-slate-900'}`}>
                    Nível {founderDep}/5
                  </div>
                  <span className="text-[10px] text-slate-400">{founderDep >= 4 ? '⚠️ Centralização Crítica' : 'Processos Autônomos'}</span>
                </div>

                {/* Prazo Médio Recebimento DSO */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ciclo DSO (Recebimento)</span>
                  <div className={`text-lg font-black ${dsoDays > 45 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {dsoDays} dias
                  </div>
                  <span className="text-[10px] text-slate-400">{dsoDays > 45 ? 'Prazos Longos em Caixa' : 'Prazo de Caixa Bom'}</span>
                </div>

                {/* Satisfação NPS */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">NPS / Satisfação</span>
                  <div className="text-lg font-black text-emerald-600">
                    +{nps}
                  </div>
                  <span className="text-[10px] text-slate-400">Zona de Excelência (&gt;50)</span>
                </div>

              </div>

              {/* Strategic Advice Notes for Consultant */}
              <div className="p-6 bg-cyan-50/60 border border-cyan-200 rounded-2xl space-y-3 text-xs text-slate-800">
                <div className="font-extrabold text-cyan-900 flex items-center space-x-2 text-sm">
                  <Sparkles className="w-4 h-4 text-cyan-700" />
                  <span>Parecer Técnico do Consultor Mestre para Reunião de Conselho</span>
                </div>
                
                <div className="space-y-2 text-slate-700 text-[11px] leading-relaxed">
                  <p>
                    1. <strong className="text-slate-900">Análise de Precificação & Margem:</strong> A margem de contribuição atual é de <strong className="text-slate-900">{margemContribucaoPercent.toFixed(1)}%</strong>. Há oportunidade de elevar o ticket médio ({tMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) através do reposicionamento de marca com a solução Sharp.
                  </p>
                  <p>
                    2. <strong className="text-slate-900">Estratégia de Aquisição (CAC):</strong> O custo de aquisição atual é de <strong className="text-slate-900">R$ {cac.toFixed(0)}</strong> com payback em <strong className="text-slate-900">{paybackM} meses</strong>. Com um LTV de <strong className="text-slate-900">R$ {ltv.toFixed(0)}</strong>, o negócio sustenta uma expansão agressiva em tráfego de mídia paga.
                  </p>
                  <p>
                    3. <strong className="text-slate-900">Maturidade de Processos & Governança:</strong> O nível de dependência dos fundadores está em <strong className="text-slate-900">{founderDep}/5</strong> e a concentração dos top 3 clientes em <strong className="text-slate-900">{concPercent}%</strong>. É crucial documentar manuais de vendas e delegar processos operacionais.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* VIEW: HISTÓRICO UNIFICADO DE DIAGNÓSTICOS (ETAPA 8) */}
      {activeInternalTab === 'diagnosticos_contas' && (
        <div className="space-y-6">
          {/* Runner Form */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                  <Play className="w-4 h-4 text-emerald-600" />
                  <span>Novo Diagnóstico Estratégico com Inteligência Artificial</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Execute análises aprofundadas vinculadas a uma Conta cliente, com histórico unificado e garantia de tolerância a falhas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Selecionar Conta Cliente:
                </label>
                <select
                  value={selectedAccountId}
                  onChange={e => setSelectedAccountId(e.target.value)}
                  disabled={isProcessing}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.companyName} ({acc.segment})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Tipo de Diagnóstico:
                </label>
                <select
                  value={diagnosticType}
                  onChange={e => setDiagnosticType(e.target.value as any)}
                  disabled={isProcessing}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="pain_analysis">Análise de Dores e Gargalos (Pain Analysis)</option>
                  <option value="business_health_check">Health Check de Negócios 360º</option>
                  <option value="market_analysis">Análise de Mercado & Posicionamento</option>
                  <option value="roi_calc">Cálculo de ROI & Viabilidade Econômica</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Contexto, Dores & Desafios Observados na Empresa:
              </label>
              <textarea
                rows={3}
                value={diagnosticInputText}
                onChange={e => setDiagnosticInputText(e.target.value)}
                placeholder="Ex: Empresa possui faturamento estagnado há 6 meses, alto CAC em Google Ads e time de vendas com baixa conversão de reuniões para propostas..."
                disabled={isProcessing}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Error and Fallback notification */}
            {processingError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-2">
                <div className="flex items-center space-x-2 font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Erro na execução do diagnóstico: {processingError}</span>
                </div>
                <p className="text-[11px] text-rose-700">
                  O registro foi gravado como <strong>failed</strong> no histórico. Você pode tentar novamente ou usar o diagnóstico preliminar offline da Sharp.
                </p>
                <div className="flex items-center space-x-3 pt-1">
                  <button
                    type="button"
                    onClick={handleRunDiagnostic}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tentar Novamente</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleUsePreliminaryFallback}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Prosseguir com Análise Preliminar</span>
                  </button>
                </div>
              </div>
            )}

            {/* Completed Result Display */}
            {lastCompletedResult && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-950 space-y-2 animate-fadeIn">
                <div className="flex items-center space-x-2 font-black text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Diagnóstico Concluído com Sucesso e Salvo no Histórico</span>
                </div>
                <div className="bg-white/80 p-3.5 rounded-xl border border-emerald-100 space-y-2 text-slate-800 text-xs leading-relaxed">
                  <p><strong>Síntese:</strong> {lastCompletedResult.executiveSummary || lastCompletedResult.analysis || JSON.stringify(lastCompletedResult)}</p>
                  {lastCompletedResult.keyActions && (
                    <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-700">
                      {lastCompletedResult.keyActions.map((act: string, idx: number) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleRunDiagnostic}
                disabled={isProcessing || !diagnosticInputText.trim()}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                  isProcessing || !diagnosticInputText.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                }`}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processando Diagnóstico...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Executar Diagnóstico IA</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Historical Unified Diagnostics Table */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                  <History className="w-4 h-4 text-cyan-600" />
                  <span>Histórico Geral de Diagnósticos por Conta</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rastreabilidade completa de todas as análises realizadas, status e resultados vinculados às contas.
                </p>
              </div>
              <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                {diagnostics.length} registros
              </span>
            </div>

            <div className="space-y-3">
              {diagnostics.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Nenhum diagnóstico registrado até o momento.
                </div>
              ) : (
                diagnostics.map((diag) => {
                  const targetAcc = accounts.find(a => a.id === diag.accountId);

                  return (
                    <div
                      key={diag.id}
                      className="p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl space-y-2.5 transition-all text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {targetAcc?.companyName || 'Conta Cliente'}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                            {diag.type.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {diag.status === 'completed' && (
                            <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Concluído</span>
                            </span>
                          )}
                          {diag.status === 'processing' && (
                            <span className="flex items-center space-x-1 text-[11px] font-bold text-cyan-700 bg-cyan-100 border border-cyan-200 px-2.5 py-0.5 rounded-full">
                              <Clock className="w-3.5 h-3.5 animate-spin" />
                              <span>Processando</span>
                            </span>
                          )}
                          {diag.status === 'failed' && (
                            <span className="flex items-center space-x-1 text-[11px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2.5 py-0.5 rounded-full">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Falhou</span>
                            </span>
                          )}
                          {diag.status === 'draft' && (
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                              Rascunho
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-slate-600 text-[11px]">
                        <strong>Entrada / Dores:</strong> {diag.input?.text || JSON.stringify(diag.input)}
                      </div>

                      {diag.result && (
                        <div className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-800 space-y-1">
                          <strong className="text-emerald-800">Resultado:</strong>
                          <p>{diag.result.executiveSummary || diag.result.analysis || JSON.stringify(diag.result)}</p>
                        </div>
                      )}

                      {diag.errorMessage && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800">
                          <strong>Erro:</strong> {diag.errorMessage}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
                        <span>Criado por: {diag.createdBy}</span>
                        <span>{new Date(diag.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL HUB DE FERRAMENTAS PARA A SHARP */}
      {activeInternalTab === 'hub_completo' && (
        <EntrepreneurHub />
      )}

      {/* VIEW 3: TOMADA DE DECISÃO EM NOVOS NEGÓCIOS */}
      {activeInternalTab === 'idea_os' && (
        <IdeaOperatingSystem />
      )}

    </div>
  );
};
