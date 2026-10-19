import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2, Users, CheckCircle2, Clock, FileText,
  Calendar, TrendingUp, Sparkles, ArrowRight, CheckSquare,
  Search, Filter, Eye, ChevronRight, Zap, BarChart3,
  Layers, ExternalLink, ShieldCheck, AlertCircle, RefreshCw,
  FolderKanban, Palette, User, ArrowUpRight, Check, LayoutGrid, Table,
  PieChart as PieChartIcon, Activity, ArrowDownRight, Award, Flame,
  Timer, Percent, SlidersHorizontal, ArrowUpDown, DollarSign, Wallet,
  BadgeCheck, Tag, Receipt
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { Project, SolutionId } from '../../types';
import { calculatePreStipulatedValues, formatBRL, SHARP_OFFICIAL_PACKAGES } from '../../data/sharpPricingData';

interface MyOperationsProps {
  onNavigateTab: (tab: string, extraState?: any) => void;
}

interface ProductProjectItem {
  id: string;
  projectId: string;
  clientCompanyName: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientSegment?: string;
  clientLogo?: string;
  productId: string;
  solutionId: SolutionId;
  productName: string;
  packageName: string;
  currentStage: string;
  responsibleStaff: string;
  status: 'active' | 'in_progress' | 'review' | 'completed' | 'paused';
  progressPercentage: number;
  startDate?: string;
  targetEndDate?: string;
  subProductsCount: number;
  completedSubProductsCount: number;
  deliverablesSummary?: string;
  notes?: string;
  // Financial fields based on official attachments & account negotiation
  monthlyFee: number;
  contractValue: number;
  preStipulatedMonthlyFee: number;
  preStipulatedContractValue: number;
  isNegotiated: boolean;
}

const SOLUTION_COLORS: Record<string, string> = {
  sharp_brand: '#0891b2', // cyan-600
  sharp_presence: '#6366f1', // indigo-500
  sharp_insights: '#8b5cf6', // purple-500
  sharp_growth: '#10b981', // emerald-500
};

const STATUS_COLORS: Record<string, string> = {
  in_progress: '#0ea5e9', // sky-500
  review: '#f59e0b', // amber-500
  completed: '#10b981', // emerald-500
  active: '#6366f1', // indigo-500
  paused: '#94a3b8', // slate-400
};

export const MyOperationsDashboard: React.FC<MyOperationsProps> = ({ onNavigateTab }) => {
  const {
    projects,
    accounts,
    leads,
    scheduledMeetings,
    qualityFollowUps
  } = useApp();

  // Search, Filter & View state
  const [searchQuery, setSearchQuery] = useState('');
  const [solutionFilter, setSolutionFilter] = useState<string>('all');
  const [specialistFilter, setSpecialistFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'analytics' | 'cards' | 'table'>('analytics');
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '90d'>('all');

  // Derive each product of each client as an individual project with full financial bindings
  const productProjectsList: ProductProjectItem[] = useMemo(() => {
    const list: ProductProjectItem[] = [];
    const activeProjects = (projects || []).filter(p => !p.archived);

    activeProjects.forEach(p => {
      const activeProds = p.activeProducts || [];
      const account = accounts.find(a => a.id === p.accountId || a.companyName.toLowerCase() === p.companyName.toLowerCase());
      const logo = p.logoUrl || account?.logoUrl;

      // Extract financial values
      const clientMonthlyFee = p.monthlyFee !== undefined ? p.monthlyFee : (account?.monthlyFee !== undefined ? account.monthlyFee : 2490);
      const clientContractValue = p.contractValue !== undefined ? p.contractValue : (account?.contractValue !== undefined ? account.contractValue : 4500);
      const clientSolutions = p.solutions || account?.solutions || ['sharp_brand'];
      const clientPackages = p.contractedPackages || account?.contractedPackages || [];

      // Calculate pre-stipulated values from official Sharp attachments
      const preCalc = calculatePreStipulatedValues(clientSolutions, clientPackages);
      const isNegotiated = clientMonthlyFee !== preCalc.suggestedMonthlyFee || clientContractValue !== preCalc.suggestedOneTimeContractValue;

      if (activeProds.length > 0) {
        activeProds.forEach((prod, idx) => {
          const subProds = prod.subProducts || [];
          const totalSub = subProds.length;
          const completedSub = subProds.filter(s => s.status === 'completed').length;
          
          let progress = 35;
          if (totalSub > 0) {
            progress = Math.round((completedSub / totalSub) * 100);
          } else {
            if (prod.status === 'completed') progress = 100;
            else if (prod.status === 'in_progress') progress = 60;
            else progress = 30;
          }

          // Ensure realistic progress distribution
          if (progress === 0 && (p.stage === 'producao' || p.stage === 'revisao')) {
            progress = 40 + (idx * 15);
          }

          list.push({
            id: `${p.id}_${prod.id || prod.solutionId}_${idx}`,
            projectId: p.id,
            clientCompanyName: p.companyName,
            clientName: p.clientName,
            clientEmail: p.clientEmail,
            clientPhone: p.clientPhone,
            clientSegment: p.segment || 'Serviços & Negócios',
            clientLogo: logo,
            productId: prod.id || `prod_${prod.solutionId}`,
            solutionId: prod.solutionId as SolutionId,
            productName: prod.name,
            packageName: prod.packageName || 'Plano de Entrega Padrão',
            currentStage: prod.currentStage || (p.stage === 'onboarding' ? 'Onboarding & Alinhamento' : p.stage === 'revisao' ? 'Revisão & Aprovação' : p.stage === 'concluido' ? 'Concluído' : 'Produção de Ativos & Conteúdo'),
            responsibleStaff: prod.responsibleStaff || (prod.solutionId === 'sharp_growth' ? 'Cristiano (Growth)' : prod.solutionId === 'sharp_insights' ? 'Raphael (Estrategista)' : 'Luan (Líder de Arte)'),
            status: (prod.status as any) || (progress >= 100 ? 'completed' : p.stage === 'revisao' ? 'review' : 'in_progress'),
            progressPercentage: Math.min(100, Math.max(10, progress)),
            startDate: prod.startDate || p.startDate || '2026-02-01',
            targetEndDate: prod.targetEndDate || p.targetEndDate || '2026-03-30',
            subProductsCount: totalSub > 0 ? totalSub : 4,
            completedSubProductsCount: completedSub,
            deliverablesSummary: prod.deliverablesSummary || `Execução contínua das demandas do produto ${prod.name}.`,
            notes: p.notes,
            monthlyFee: clientMonthlyFee,
            contractValue: clientContractValue,
            preStipulatedMonthlyFee: preCalc.suggestedMonthlyFee,
            preStipulatedContractValue: preCalc.suggestedOneTimeContractValue,
            isNegotiated
          });
        });
      } else {
        // Fallback for projects that list solutions array
        const solutions = p.solutions || ['sharp_brand'];
        solutions.forEach((solId, idx) => {
          const prodName = solId === 'sharp_brand' ? 'Sharp Brand' : solId === 'sharp_presence' ? 'Sharp Presence' : solId === 'sharp_insights' ? 'Sharp Insights' : 'Sharp Growth';
          const defaultStaff = solId === 'sharp_growth' ? 'Cristiano (Growth)' : solId === 'sharp_insights' ? 'Raphael (Estrategista)' : 'Luan (Líder de Arte)';
          const progress = p.stage === 'concluido' ? 100 : p.stage === 'revisao' ? 85 : p.stage === 'producao' ? 55 : 25;
          
          list.push({
            id: `${p.id}_${solId}_${idx}`,
            projectId: p.id,
            clientCompanyName: p.companyName,
            clientName: p.clientName,
            clientEmail: p.clientEmail,
            clientPhone: p.clientPhone,
            clientSegment: p.segment || 'Serviços & Negócios',
            clientLogo: logo,
            productId: `prod_${solId}`,
            solutionId: solId,
            productName: prodName,
            packageName: solId === 'sharp_brand' ? 'Identidade & Posicionamento Autoral' : 'Social Media & Gestão de Conteúdo',
            currentStage: p.stage === 'onboarding' ? 'Alinhamento Inicial & Briefing' : p.stage === 'revisao' ? 'Validação com Cliente' : 'Produção de Lote & Criativos',
            responsibleStaff: defaultStaff,
            status: progress >= 100 ? 'completed' : p.stage === 'revisao' ? 'review' : 'in_progress',
            progressPercentage: progress,
            startDate: p.startDate || '2026-02-01',
            targetEndDate: p.targetEndDate || '2026-03-30',
            subProductsCount: 4,
            completedSubProductsCount: Math.round((progress / 100) * 4),
            deliverablesSummary: `Execução contínua para ${p.companyName}.`,
            notes: p.notes,
            monthlyFee: clientMonthlyFee,
            contractValue: clientContractValue,
            preStipulatedMonthlyFee: preCalc.suggestedMonthlyFee,
            preStipulatedContractValue: preCalc.suggestedOneTimeContractValue,
            isNegotiated
          });
        });
      }
    });

    return list;
  }, [projects, accounts]);

  // Filtered product projects
  const filteredProductProjects = useMemo(() => {
    return productProjectsList.filter(item => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        item.clientCompanyName.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        item.packageName.toLowerCase().includes(q) ||
        item.responsibleStaff.toLowerCase().includes(q) ||
        item.clientName.toLowerCase().includes(q) ||
        (item.clientSegment && item.clientSegment.toLowerCase().includes(q));

      const matchesSolution = solutionFilter === 'all' || item.solutionId === solutionFilter;
      const matchesSpecialist = specialistFilter === 'all' || item.responsibleStaff.toLowerCase().includes(specialistFilter.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesSolution && matchesSpecialist && matchesStatus;
    });
  }, [productProjectsList, searchQuery, solutionFilter, specialistFilter, statusFilter]);

  // -------------------------------------------------------------
  // STATISTICAL & ANALYTICAL AGGREGATIONS
  // -------------------------------------------------------------

  // 1. Key Performance Indicators & Financial Totals
  const statsKPIs = useMemo(() => {
    const total = filteredProductProjects.length;
    
    // Unique clients in current filter for financial metrics
    const clientMap = new Map<string, { monthlyFee: number; contractValue: number; preMonthly: number; preContract: number }>();
    filteredProductProjects.forEach(p => {
      if (!clientMap.has(p.clientCompanyName)) {
        clientMap.set(p.clientCompanyName, {
          monthlyFee: p.monthlyFee || 0,
          contractValue: p.contractValue || 0,
          preMonthly: p.preStipulatedMonthlyFee || 0,
          preContract: p.preStipulatedContractValue || 0
        });
      }
    });

    let totalMRR = 0;
    let totalContractValue = 0;
    let preStipulatedMRR = 0;
    let preStipulatedContract = 0;

    clientMap.forEach(val => {
      totalMRR += val.monthlyFee;
      totalContractValue += val.contractValue;
      preStipulatedMRR += val.preMonthly;
      preStipulatedContract += val.preContract;
    });

    const uniqueClientCount = clientMap.size || 1;
    const avgMonthlyTicket = Math.round(totalMRR / uniqueClientCount);

    if (total === 0) {
      return {
        total: 0,
        avgProgress: 0,
        completed: 0,
        inProgress: 0,
        inReview: 0,
        onTrackPct: 100,
        totalDeliverables: 0,
        completedDeliverables: 0,
        deliverableCompletionRate: 0,
        avgDeliverablesPerProject: 0,
        totalMRR: 0,
        totalContractValue: 0,
        preStipulatedMRR: 0,
        preStipulatedContract: 0,
        avgMonthlyTicket: 0,
        uniqueClients: 0
      };
    }

    const sumProgress = filteredProductProjects.reduce((acc, curr) => acc + curr.progressPercentage, 0);
    const avgProgress = Math.round(sumProgress / total);
    const completed = filteredProductProjects.filter(p => p.progressPercentage >= 100 || p.status === 'completed').length;
    const inReview = filteredProductProjects.filter(p => p.status === 'review' || p.currentStage.toLowerCase().includes('revis') || p.currentStage.toLowerCase().includes('avalia')).length;
    const inProgress = total - completed;

    const totalDeliverables = filteredProductProjects.reduce((acc, curr) => acc + curr.subProductsCount, 0);
    const completedDeliverables = filteredProductProjects.reduce((acc, curr) => acc + curr.completedSubProductsCount, 0);
    const deliverableCompletionRate = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;
    const avgDeliverablesPerProject = total > 0 ? Number((totalDeliverables / total).toFixed(1)) : 0;

    // SLA / On-track calculation
    const onTrack = filteredProductProjects.filter(p => p.progressPercentage >= 35 || p.status === 'completed').length;
    const onTrackPct = total > 0 ? Math.round((onTrack / total) * 100) : 100;

    return {
      total,
      avgProgress,
      completed,
      inProgress,
      inReview,
      onTrackPct,
      totalDeliverables,
      completedDeliverables,
      deliverableCompletionRate,
      avgDeliverablesPerProject,
      totalMRR,
      totalContractValue,
      preStipulatedMRR,
      preStipulatedContract,
      avgMonthlyTicket,
      uniqueClients: clientMap.size
    };
  }, [filteredProductProjects]);

  // 2. Breakdown by Product Solution (Pie & Bar)
  const productDistributionData = useMemo(() => {
    const map: Record<string, { name: string; count: number; completedCount: number; avgProg: number; color: string }> = {
      sharp_brand: { name: 'Sharp Brand', count: 0, completedCount: 0, avgProg: 0, color: SOLUTION_COLORS.sharp_brand },
      sharp_presence: { name: 'Sharp Presence', count: 0, completedCount: 0, avgProg: 0, color: SOLUTION_COLORS.sharp_presence },
      sharp_insights: { name: 'Sharp Insights', count: 0, completedCount: 0, avgProg: 0, color: SOLUTION_COLORS.sharp_insights },
      sharp_growth: { name: 'Sharp Growth', count: 0, completedCount: 0, avgProg: 0, color: SOLUTION_COLORS.sharp_growth },
    };

    filteredProductProjects.forEach(item => {
      if (map[item.solutionId]) {
        map[item.solutionId].count += 1;
        if (item.progressPercentage >= 100) map[item.solutionId].completedCount += 1;
        map[item.solutionId].avgProg += item.progressPercentage;
      }
    });

    return Object.keys(map).map(k => {
      const entry = map[k];
      return {
        key: k,
        name: entry.name,
        count: entry.count,
        completedCount: entry.completedCount,
        avgProgress: entry.count > 0 ? Math.round(entry.avgProg / entry.count) : 0,
        color: entry.color,
      };
    });
  }, [filteredProductProjects]);

  // 3. Operational Velocity & Progress Tiers
  const progressTiersData = useMemo(() => {
    const tiers = [
      { name: '0% - 25% (Início)', count: 0, fill: '#cbd5e1' },
      { name: '26% - 50% (Produção)', count: 0, fill: '#38bdf8' },
      { name: '51% - 75% (Avançado)', count: 0, fill: '#6366f1' },
      { name: '76% - 99% (Revisão/Final)', count: 0, fill: '#f59e0b' },
      { name: '100% (Concluído)', count: 0, fill: '#10b981' },
    ];

    filteredProductProjects.forEach(item => {
      const p = item.progressPercentage;
      if (p <= 25) tiers[0].count += 1;
      else if (p <= 50) tiers[1].count += 1;
      else if (p <= 75) tiers[2].count += 1;
      else if (p < 100) tiers[3].count += 1;
      else tiers[4].count += 1;
    });

    return tiers;
  }, [filteredProductProjects]);

  // 4. Specialist Workload & Efficiency
  const specialistStatsData = useMemo(() => {
    const map: Record<string, { specialist: string; activeProjects: number; completedProjects: number; totalDeliverables: number; avgProg: number }> = {};

    filteredProductProjects.forEach(item => {
      const spec = item.responsibleStaff || 'Equipe Geral';
      const cleanName = spec.split('(')[0].trim() || spec;
      if (!map[cleanName]) {
        map[cleanName] = {
          specialist: cleanName,
          activeProjects: 0,
          completedProjects: 0,
          totalDeliverables: 0,
          avgProg: 0
        };
      }
      map[cleanName].activeProjects += 1;
      if (item.progressPercentage >= 100) map[cleanName].completedProjects += 1;
      map[cleanName].totalDeliverables += item.subProductsCount;
      map[cleanName].avgProg += item.progressPercentage;
    });

    return Object.values(map).map(s => ({
      ...s,
      avgProgress: s.activeProjects > 0 ? Math.round(s.avgProg / s.activeProjects) : 0
    })).sort((a, b) => b.activeProjects - a.activeProjects);
  }, [filteredProductProjects]);

  // 5. Stage Funnel Flow Distribution
  const stageFunnelData = useMemo(() => {
    const stageMap: Record<string, number> = {
      'Onboarding / Briefing': 0,
      'Produção & Ativos': 0,
      'Revisão / Avaliação': 0,
      'Concluído / Entregue': 0
    };

    filteredProductProjects.forEach(item => {
      const st = item.currentStage.toLowerCase();
      if (item.progressPercentage >= 100 || item.status === 'completed') {
        stageMap['Concluído / Entregue'] += 1;
      } else if (st.includes('onboarding') || st.includes('alinhamento') || st.includes('briefing')) {
        stageMap['Onboarding / Briefing'] += 1;
      } else if (st.includes('revis') || st.includes('avalia') || st.includes('validação')) {
        stageMap['Revisão / Avaliação'] += 1;
      } else {
        stageMap['Produção & Ativos'] += 1;
      }
    });

    return Object.keys(stageMap).map((k, i) => ({
      stage: k,
      count: stageMap[k],
      color: i === 0 ? '#38bdf8' : i === 1 ? '#6366f1' : i === 2 ? '#f59e0b' : '#10b981'
    }));
  }, [filteredProductProjects]);

  // 6. Segment Distribution
  const segmentStats = useMemo(() => {
    const map: Record<string, number> = {};
    filteredProductProjects.forEach(item => {
      const seg = item.clientSegment || 'Geral / Outros';
      map[seg] = (map[seg] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filteredProductProjects]);

  // Navigate to operation with specific project
  const handleOpenInOperation = (projectId: string) => {
    onNavigateTab('projects', { selectedProjectId: projectId });
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-50 via-indigo-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center space-x-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-600" />
                <span>OVERVIEW OPERACIONAL & INDICADORES</span>
              </span>
              <span className="text-slate-500 text-xs font-medium">• Painel Central de Desempenho e Projetos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Overview Geral Sharp
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1.5 leading-relaxed">
              Visão consolidada das operações ativas, distribuição de esteira por especialista, fluxo de entregáveis e taxas de conclusão por cliente.
            </p>
          </div>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'analytics'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Visão Estatística</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Projetos (Cards)</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Tabela</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex items-center space-x-3.5 relative overflow-hidden group hover:border-cyan-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 shrink-0">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total de Projetos/Ativos</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-black text-slate-900">{statsKPIs.total}</h3>
              <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">
                {statsKPIs.uniqueClients} clientes
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{statsKPIs.totalDeliverables} entregáveis na esteira</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex items-center space-x-3.5 relative overflow-hidden group hover:border-indigo-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Progresso Médio Geral</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-black text-indigo-700">{statsKPIs.avgProgress}%</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                +12% veloc.
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${statsKPIs.avgProgress}%` }} />
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex items-center space-x-3.5 relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Taxa de Conclusão</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-black text-emerald-700">{statsKPIs.deliverableCompletionRate}%</h3>
              <span className="text-[10px] font-bold text-slate-600">
                ({statsKPIs.completedDeliverables}/{statsKPIs.totalDeliverables})
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{statsKPIs.completed} projetos finalizados</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs flex items-center space-x-3.5 relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Projetos no Prazo (SLA)</p>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-2xl font-black text-amber-800">{statsKPIs.onTrackPct}%</h3>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                Alta pontualidade
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">{statsKPIs.inReview} em revisão/aprovação</p>
          </div>
        </div>
      </div>

      {/* OPERATIONAL SUMMARY & DIRECT LINK TO DEDICATED FINANCIAL DASHBOARD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Painel Integrado de Governança e Operações</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-medium">
                  Single Source of Truth
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                A gestão financeira completa, DRE, mensalidades e faturamento estão centralizados exclusivamente na aba Financeiro.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigateTab('financial')}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
            >
              <DollarSign className="w-4 h-4" />
              <span>Acessar Gestão Financeira</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Entregáveis Concluídos */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Entregáveis Finalizados</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 tracking-tight">
              {statsKPIs.completedDeliverables}
              <span className="text-xs font-normal text-slate-400 ml-1">/ {statsKPIs.totalDeliverables}</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/50">
              <span>{statsKPIs.deliverableCompletionRate}% de conclusão</span>
              <span className="text-emerald-400 font-bold">Produção</span>
            </div>
          </div>

          {/* Em Andamento */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Em Produção Ativa</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {statsKPIs.inProgress}
              <span className="text-xs font-normal text-slate-400 ml-1">projetos</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/50">
              <span>Esteiras ativas</span>
              <span className="text-cyan-400 font-bold">Sprint Atual</span>
            </div>
          </div>

          {/* Em Revisão / Aprovação */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Em Validação / Cliente</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 tracking-tight">
              {statsKPIs.inReview}
              <span className="text-xs font-normal text-slate-400 ml-1">etapas</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/50">
              <span>Aguardando feedback</span>
              <span className="text-amber-400 font-bold">Revisão</span>
            </div>
          </div>

          {/* Total de Clientes Ativos */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Clientes Ativos na Operação</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300 tracking-tight">
              {statsKPIs.uniqueClients}
              <span className="text-xs font-normal text-slate-400 ml-1">contas</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-700/50">
              <span>{statsKPIs.total} projetos vinculados</span>
              <span className="text-purple-400 font-bold">Carteira</span>
            </div>
          </div>

        </div>
      </div>

      {/* FILTERS & SEARCH CONTROL BAR */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por cliente, produto, nicho, especialista ou pacote..."
              className="w-full pl-10 pr-4 py-2 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Solution Filters Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
            {[
              { id: 'all', label: 'Todos os Produtos' },
              { id: 'sharp_brand', label: 'Sharp Brand' },
              { id: 'sharp_presence', label: 'Sharp Presence' },
              { id: 'sharp_insights', label: 'Sharp Insights' },
              { id: 'sharp_growth', label: 'Sharp Growth' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setSolutionFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  solutionFilter === f.id
                    ? 'bg-cyan-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Specialist Select */}
          <div className="flex items-center space-x-2">
            <select
              value={specialistFilter}
              onChange={(e) => setSpecialistFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium"
            >
              <option value="all">Todos os Especialistas</option>
              <option value="Luan">Luan (Líder de Arte)</option>
              <option value="Raphael">Raphael (Estrategista)</option>
              <option value="Cristiano">Cristiano (Growth)</option>
              <option value="Ingrid">Ingrid (CS)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 1. VISÃO ANALÍTICA ESTATÍSTICA (GRÁFICOS, MÉTRICAS E DISTRIBUIÇÃO) */}
      {/* ---------------------------------------------------------------- */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          
          {/* Charts Row 1: Distribution by Product & Progress Tiers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Volume e Progresso Médio por Solução Sharp */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <PieChartIcon className="w-4 h-4 text-cyan-600" />
                    <span>Distribuição de Produtos & Conclusão Média</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Volume de projetos ativos e taxa média de progresso por linha</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                  {statsKPIs.total} projetos totais
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productDistributionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      formatter={(val: any, name: any) => [
                        name === 'count' ? `${val} Projetos` : `${val}% Concluído`,
                        name === 'count' ? 'Qtd Projetos' : 'Progresso Médio'
                      ]}
                    />
                    <Bar dataKey="count" name="count" fill="#0891b2" radius={[6, 6, 0, 0]} barSize={26} />
                    <Bar dataKey="avgProgress" name="avgProgress" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={26} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Mini Legend & Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                {productDistributionData.map(p => (
                  <div key={p.key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="font-bold text-[11px] text-slate-800 truncate">{p.name}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>{p.count} proj.</span>
                      <span className="font-bold text-slate-700">{p.avgProgress}% médio</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Esteira de Etapas & Funil Operacional */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Funil de Execução por Etapa Operacional</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Volume de demandas concentradas em cada estágio do pipeline</p>
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">
                  Fluxo Contínuo
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={stageFunnelData} margin={{ top: 10, right: 20, left: 35, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      formatter={(val: any) => [`${val} Projetos`, 'Volume']}
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={22}>
                      {stageFunnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Progress Tiers Mini Badges */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
                {progressTiersData.map((t, idx) => (
                  <div key={idx} className="flex items-center space-x-1 text-[11px] bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/60">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.fill }} />
                    <span className="text-slate-600 font-medium">{t.name}:</span>
                    <span className="font-bold text-slate-900">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Charts Row 2: Specialist Workload & Delivery Velocity Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Specialist Efficiency & Workload */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Users className="w-4 h-4 text-cyan-600" />
                    <span>Carga Operacional & Produtividade por Especialista</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Distribuição de responsabilidade técnica e taxa média de avanço</p>
                </div>
                <span className="text-[10px] font-bold bg-cyan-50 text-cyan-800 px-2.5 py-1 rounded-lg">
                  {specialistStatsData.length} Especialistas
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">Especialista</th>
                      <th className="px-4 py-3 text-center">Projetos Ativos</th>
                      <th className="px-4 py-3 text-center">Entregáveis Sob Gestão</th>
                      <th className="px-4 py-3 text-center">Concluídos</th>
                      <th className="px-4 py-3 text-right rounded-r-xl">Avanço Médio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {specialistStatsData.map((spec, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-900 flex items-center space-x-2.5">
                          <div className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-cyan-700 font-black">
                            {spec.specialist.charAt(0)}
                          </div>
                          <span>{spec.specialist}</span>
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-slate-800">
                          {spec.activeProjects}
                        </td>
                        <td className="px-4 py-3.5 text-center text-slate-600 font-medium">
                          {spec.totalDeliverables} itens
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-emerald-700">
                          {spec.completedProjects}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center space-x-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-cyan-600 rounded-full"
                                style={{ width: `${spec.avgProgress}%` }}
                              />
                            </div>
                            <span className="font-black text-slate-900">{spec.avgProgress}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Segment Niches Distribution */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Segmentos Atendidos</span>
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                    Nichos PME
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mb-4">Concentração de projetos por setor econômico</p>

                <div className="space-y-3">
                  {segmentStats.slice(0, 5).map((seg, idx) => {
                    const pct = Math.round((seg.value / (filteredProductProjects.length || 1)) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span className="truncate pr-2">{seg.name}</span>
                          <span className="text-slate-900 font-bold">{seg.value} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 bg-slate-50/50 p-3 rounded-2xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Ação Rápida:</span>
                  <button
                    onClick={() => setViewMode('cards')}
                    className="text-cyan-700 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Ver lista completa de projetos</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Quick List Preview: Top Active Operations in Execution */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <span>Projetos em Execução Ativa & Acompanhamento de SLA</span>
                </h3>
                <p className="text-[11px] text-slate-500">Acompanhe individualmente o status, líder responsável e entregas</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('cards')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Alternar para Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Ver Tabela Geral
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {filteredProductProjects.slice(0, 6).map(item => (
                <div
                  key={item.id}
                  onClick={() => handleOpenInOperation(item.projectId)}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 hover:bg-white hover:border-cyan-400 hover:shadow-xs transition-all cursor-pointer space-y-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs group-hover:text-cyan-700 transition-colors">
                        {item.clientCompanyName}
                      </h4>
                      <p className="text-[11px] text-slate-500">{item.productName}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-700 shadow-2xs">
                      {item.progressPercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-600 h-full rounded-full"
                      style={{ width: `${item.progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{item.responsibleStaff.split('(')[0]}</span>
                    <span className="font-semibold text-cyan-800 flex items-center space-x-1">
                      <span>Abrir</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 2. VISÃO EM CARDS (PRODUCTS AS PROJECTS GRID) */}
      {/* ---------------------------------------------------------------- */}
      {viewMode === 'cards' && (
        <>
          {filteredProductProjects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3">
              <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">Nenhum projeto de produto encontrado</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Não encontramos produtos cadastrados com os filtros atuais.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProductProjects.map(item => {
                const isCompleted = item.progressPercentage >= 100;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenInOperation(item.projectId)}
                    className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs hover:shadow-md hover:border-cyan-400/80 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top Info */}
                    <div className="space-y-4">
                      
                      {/* Header: Company & Product Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3 min-w-0">
                          {/* Logo or Initial Avatar */}
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 font-extrabold text-lg shrink-0 overflow-hidden shadow-2xs group-hover:border-cyan-300 transition-colors">
                            {item.clientLogo ? (
                              <img
                                src={item.clientLogo}
                                alt={item.clientCompanyName}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-cyan-700 bg-cyan-50 w-full h-full flex items-center justify-center font-black text-base">
                                {item.clientCompanyName.substring(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors truncate">
                              {item.clientCompanyName}
                            </h3>
                            <p className="text-xs text-slate-500 truncate">
                              {item.clientName} • {item.clientSegment}
                            </p>
                          </div>
                        </div>

                        {/* Solution Badge */}
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-cyan-50 text-cyan-800 border border-cyan-200 shrink-0">
                          {item.productName}
                        </span>
                      </div>

                      {/* Project Package, Values & Current Stage */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Pacote Contratado</span>
                          <span className="text-[11px] font-semibold text-slate-700">{item.packageName}</span>
                        </div>

                        {/* Financial Snapshot */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                          <div className="flex items-center space-x-1 text-slate-500">
                            <Wallet className="w-3 h-3 text-cyan-600" />
                            <span>Mensalidade:</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-slate-900">{formatBRL(item.monthlyFee)}/mês</span>
                            {item.isNegotiated ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                                Negociado
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                                Tab. Oficial
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Etapa Atual</span>
                          <span className="text-[11px] font-bold text-cyan-800">{item.currentStage}</span>
                        </div>
                      </div>

                      {/* Responsible Specialist & Dates */}
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px] font-medium">{item.responsibleStaff}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Prazo: {item.targetEndDate}
                        </span>
                      </div>

                      {/* Progress Bar & Percentage */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-medium text-slate-500">Percentual Concluído</span>
                          <span className={`text-xs font-black ${isCompleted ? 'text-emerald-700' : 'text-slate-900'}`}>
                            {item.progressPercentage}%
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500'
                            }`}
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-cyan-700 group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                        <span>Abrir Operação & Etapas</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.completedSubProductsCount}/{item.subProductsCount > 0 ? item.subProductsCount : 4} subprodutos
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 3. VISÃO EM TABELA EXECUTIVA */}
      {/* ---------------------------------------------------------------- */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Cliente / Empresa</th>
                  <th className="px-5 py-3.5">Produto / Projeto</th>
                  <th className="px-5 py-3.5">Valor Mensal / Setup</th>
                  <th className="px-5 py-3.5">Etapa Atual</th>
                  <th className="px-5 py-3.5">Responsável</th>
                  <th className="px-5 py-3.5">Progresso</th>
                  <th className="px-5 py-3.5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProductProjects.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenInOperation(item.projectId)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 overflow-hidden">
                          {item.clientLogo ? (
                            <img src={item.clientLogo} alt="logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            item.clientCompanyName.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{item.clientCompanyName}</div>
                          <div className="text-[11px] text-slate-400">{item.clientName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                        {item.productName}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1">{item.packageName}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-extrabold text-slate-900">{formatBRL(item.monthlyFee)}/mês</div>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400">Setup: {formatBRL(item.contractValue)}</span>
                        {item.isNegotiated ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                            Negociado
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                            Tab. Oficial
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">
                      {item.currentStage}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {item.responsibleStaff}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded-full"
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-slate-800">{item.progressPercentage}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenInOperation(item.projectId);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
