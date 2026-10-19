import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatBRL, ServicePackagePricing } from '../../data/sharpPricingData';
import { CommercialPricingManager } from './CommercialPricingManager';
import {
  DollarSign,
  TrendingUp,
  Users,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  Edit3,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Tag,
  Receipt,
  PieChart,
  SlidersHorizontal,
  X,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';

interface FinancialManagementDashboardProps {
  onNavigateTab?: (tab: string) => void;
}

export const FinancialManagementDashboard: React.FC<FinancialManagementDashboardProps> = ({ onNavigateTab }) => {
  const {
    accounts,
    projects,
    updateAccount,
    updateProject,
    officialPackages
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'clients' | 'pricing'>('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'with_monthly' | 'one_time'>('all');
  
  // Quick Edit Modal State for a specific client
  const [editingClientAccount, setEditingClientAccount] = useState<any | null>(null);
  const [tempMonthlyFee, setTempMonthlyFee] = useState<string>('');
  const [tempContractValue, setTempContractValue] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Only take valid accounts (active / existing)
  const activeAccounts = accounts.filter(acc => !acc.isArchived);

  // Financial Metrics Calculation
  const totalMRR = activeAccounts.reduce((sum, acc) => {
    const fee = typeof acc.monthlyFee === 'number' ? acc.monthlyFee : parseFloat(String(acc.monthlyFee || 0));
    return sum + (isNaN(fee) ? 0 : fee);
  }, 0);

  const totalContractSetup = activeAccounts.reduce((sum, acc) => {
    const val = typeof acc.contractValue === 'number' ? acc.contractValue : parseFloat(String(acc.contractValue || 0));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  const payingClientsCount = activeAccounts.filter(acc => {
    const m = typeof acc.monthlyFee === 'number' ? acc.monthlyFee : parseFloat(String(acc.monthlyFee || 0));
    const c = typeof acc.contractValue === 'number' ? acc.contractValue : parseFloat(String(acc.contractValue || 0));
    return (m > 0 || c > 0);
  }).length;

  const averageMRR = payingClientsCount > 0 ? (totalMRR / payingClientsCount) : 0;
  const estimatedARR = (totalMRR * 12) + totalContractSetup;

  // Pillar Distribution Calculation based on contracted packages / solutions
  const pillarStats: Record<string, { count: number; name: string; color: string; bg: string }> = {
    sharp_insights: { count: 0, name: 'Sharp Insights (Diagnóstico)', color: 'text-indigo-600', bg: 'bg-indigo-500' },
    sharp_brand: { count: 0, name: 'Sharp Brand (Identidade & Estratégia)', color: 'text-purple-600', bg: 'bg-purple-500' },
    sharp_presence: { count: 0, name: 'Sharp Presence (Social & Conteúdo)', color: 'text-cyan-600', bg: 'bg-cyan-500' },
    sharp_growth: { count: 0, name: 'Sharp Growth (Consultoria & Acompanhamento)', color: 'text-emerald-600', bg: 'bg-emerald-500' }
  };

  activeAccounts.forEach(acc => {
    const solutions = acc.selectedSolutions || [];
    solutions.forEach(sol => {
      if (pillarStats[sol]) {
        pillarStats[sol].count += 1;
      }
    });
  });

  const totalPillarsAssigned = Object.values(pillarStats).reduce((acc, p) => acc + p.count, 0) || 1;

  // Filter clients list
  const filteredAccounts = activeAccounts.filter(acc => {
    const matchesSearch = 
      acc.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (acc.segment && acc.segment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (acc.legalName && acc.legalName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const monthly = typeof acc.monthlyFee === 'number' ? acc.monthlyFee : parseFloat(String(acc.monthlyFee || 0));
    
    if (statusFilter === 'active') return acc.status === 'active';
    if (statusFilter === 'with_monthly') return monthly > 0;
    if (statusFilter === 'one_time') return monthly === 0;
    return true;
  });

  // Open Quick Edit
  const handleOpenEdit = (acc: any) => {
    setEditingClientAccount(acc);
    setTempMonthlyFee(String(acc.monthlyFee || 0));
    setTempContractValue(String(acc.contractValue || 0));
  };

  // Save Quick Edit
  const handleSaveClientFinancials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClientAccount) return;

    const newMonthly = parseFloat(tempMonthlyFee) || 0;
    const newContract = parseFloat(tempContractValue) || 0;

    // Update Account
    updateAccount(editingClientAccount.id, {
      monthlyFee: newMonthly,
      contractValue: newContract,
      updatedAt: new Date().toISOString()
    });

    // Also sync to matching project if any
    const matchingProject = projects.find(p => 
      p.accountId === editingClientAccount.id ||
      p.companyName?.toLowerCase() === editingClientAccount.companyName.toLowerCase()
    );

    if (matchingProject) {
      updateProject(matchingProject.id, {
        monthlyFee: newMonthly,
        contractValue: newContract
      });
    }

    showToast(`Valores financeiros de "${editingClientAccount.companyName}" atualizados com sucesso!`);
    setEditingClientAccount(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-cyan-500/30 flex items-center space-x-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Gestão Financeira Executiva Sharp</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Painel Financeiro, Mensalidades & Tabela de Preços
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-3xl">
            Acompanhe o faturamento em tempo real, receita recorrente mensal (MRR), valores de projetos/setups contratados por cliente e faça a gestão completa da tabela de preços dos produtos Sharp.
          </p>
        </div>

        {/* Action / Sync Button */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Previsão Anual (ARR)
            </span>
            <span className="text-base font-black text-emerald-700">
              {formatBRL(estimatedARR)}
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: MRR */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-cyan-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              MRR (Receita Recorrente)
            </span>
            <div className="w-9 h-9 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatBRL(totalMRR)}
              <span className="text-xs font-bold text-cyan-600 ml-1">/mês</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Soma de todas as mensalidades ativas
            </span>
          </div>
        </div>

        {/* Card 2: Setups / 1st Month */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Projetos & 1º Mês (Setup)
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatBRL(totalContractSetup)}
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Entradas pontuais e setups de clientes
            </span>
          </div>
        </div>

        {/* Card 3: Ticket Médio */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Ticket Médio Mensal
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <PieChart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {formatBRL(averageMRR)}
              <span className="text-xs font-bold text-purple-600 ml-1">/cliente</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Média de mensalidade por conta pagante
            </span>
          </div>
        </div>

        {/* Card 4: Clientes Pagantes */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Contas Pagantes Ativas
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">
              {payingClientsCount} <span className="text-xs font-bold text-slate-400">/ {activeAccounts.length} totais</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Clientes com faturamento registrado
            </span>
          </div>
        </div>

      </div>

      {/* Pillar Revenue Breakdown Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-600" />
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Adesão por Solução & Pilar Estratégico Sharp
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-bold">
            {officialPackages.length} produtos oficiais catalogados
          </span>
        </div>

        {/* Progress Bar of Pillars */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
          {Object.entries(pillarStats).map(([key, stat]) => {
            const percent = Math.round((stat.count / totalPillarsAssigned) * 100);
            if (percent === 0) return null;
            return (
              <div
                key={key}
                style={{ width: `${percent}%` }}
                className={`${stat.bg} h-full transition-all`}
                title={`${stat.name}: ${percent}% (${stat.count} contratos)`}
              />
            );
          })}
        </div>

        {/* Pillar legend grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {Object.entries(pillarStats).map(([key, stat]) => (
            <div key={key} className="flex items-center space-x-2 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${stat.bg}`} />
              <span className="font-bold text-slate-700 truncate">{stat.name.split('(')[0]}</span>
              <span className="font-extrabold text-slate-900 ml-auto shrink-0">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Subtab Selector */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSubTab('clients')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === 'clients'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Faturamento & Mensalidades por Cliente ({activeAccounts.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pricing')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === 'pricing'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Tabela de Preços Oficial dos Produtos ({officialPackages.length})</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CLIENTS & MONTHLY FEES */}
      {activeSubTab === 'clients' && (
        <div className="space-y-4">
          
          {/* Filters & Search */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por cliente ou segmento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos ({activeAccounts.length})
              </button>

              <button
                onClick={() => setStatusFilter('with_monthly')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                  statusFilter === 'with_monthly'
                    ? 'bg-cyan-700 text-white'
                    : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                }`}
              >
                Com Mensalidade ({activeAccounts.filter(a => (a.monthlyFee || 0) > 0).length})
              </button>

              <button
                onClick={() => setStatusFilter('one_time')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                  statusFilter === 'one_time'
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Projeto Pontual ({activeAccounts.filter(a => !a.monthlyFee || a.monthlyFee === 0).length})
              </button>
            </div>
          </div>

          {/* Clean Financial Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Cliente / Empresa</th>
                    <th className="py-3.5 px-4">Produtos / Soluções</th>
                    <th className="py-3.5 px-4">1º Mês (Projeto/Setup)</th>
                    <th className="py-3.5 px-4">Mensalidade (MRR)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ação Financeira</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Nenhum cliente encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map(acc => {
                      const monthly = typeof acc.monthlyFee === 'number' ? acc.monthlyFee : parseFloat(String(acc.monthlyFee || 0));
                      const contract = typeof acc.contractValue === 'number' ? acc.contractValue : parseFloat(String(acc.contractValue || 0));
                      const packages = acc.contractedPackages || [];

                      return (
                        <tr key={acc.id} className="hover:bg-slate-50/60 transition-colors">
                          
                          {/* Client Info */}
                          <td className="py-4 px-5">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-800 font-extrabold text-xs shrink-0">
                                {acc.companyName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 block text-xs">
                                  {acc.companyName}
                                </span>
                                <span className="text-[11px] text-slate-400 block">
                                  {acc.segment || 'Serviços'} • {acc.phone || '(19) 9 9568-2110'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Packages */}
                          <td className="py-4 px-4 max-w-[220px]">
                            {packages.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {packages.slice(0, 2).map((pkg, idx) => (
                                  <span key={idx} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200 truncate max-w-[140px]">
                                    {pkg.replace(/_/g, ' ')}
                                  </span>
                                ))}
                                {packages.length > 2 && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded-md">
                                    +{packages.length - 2}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-[11px] italic">Nenhum pacote vinculado</span>
                            )}
                          </td>

                          {/* 1st Month / Setup */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {contract > 0 ? (
                              <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                                {formatBRL(contract)}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">—</span>
                            )}
                          </td>

                          {/* Monthly Fee */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {monthly > 0 ? (
                              <span className="font-black text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg border border-cyan-100">
                                {formatBRL(monthly)}<span className="text-[10px] font-bold text-cyan-600">/mês</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Sem mensalidade</span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              monthly > 0
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {monthly > 0 ? 'Recorrente Ativo' : 'Pontual'}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(acc)}
                              className="px-3 py-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800 bg-cyan-50/80 hover:bg-cyan-100 rounded-xl transition-all cursor-pointer border border-cyan-200 inline-flex items-center space-x-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar Valores</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: OFFICIAL PRICING TABLE (REPOSICIONADA NA ABA FINANCEIRO) */}
      {activeSubTab === 'pricing' && (
        <div className="space-y-4">
          <CommercialPricingManager />
        </div>
      )}

      {/* QUICK FINANCIAL EDIT MODAL */}
      {editingClientAccount && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-sm">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Ajuste Financeiro do Cliente
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingClientAccount.companyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingClientAccount(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClientFinancials} className="space-y-4 text-xs">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                
                {/* Monthly Fee */}
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Mensalidade Recorrente (R$/mês)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1">
                    Valor cobrado todo mês deste cliente
                  </p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      value={tempMonthlyFee}
                      onChange={(e) => setTempMonthlyFee(e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2.5 text-base font-black text-cyan-800 bg-white border border-cyan-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                {/* Contract / 1st Month Value */}
                <div className="space-y-1 pt-2 border-t border-slate-200">
                  <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    1º Mês / Setup / Projeto Pontual (R$)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-1">
                    Valor de entrada, diagnóstico ou taxa de setup inicial
                  </p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      value={tempContractValue}
                      onChange={(e) => setTempContractValue(e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2.5 text-base font-black text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingClientAccount(null)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-white bg-slate-900 hover:bg-cyan-600 rounded-xl transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
