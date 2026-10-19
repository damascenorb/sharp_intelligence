import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServicePackagePricing, formatBRL } from '../../data/sharpPricingData';
import { SolutionId } from '../../types';
import {
  DollarSign,
  Package,
  Plus,
  RotateCcw,
  Check,
  Edit3,
  Sparkles,
  TrendingUp,
  Layers,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  Trash2,
  X,
  ArrowUpRight,
  ShieldCheck,
  ListChecks,
  LayoutGrid,
  List
} from 'lucide-react';

export const CommercialPricingManager: React.FC = () => {
  const {
    officialPackages,
    updateOfficialPackage,
    resetOfficialPackagesToDefault,
    addCustomOfficialPackage
  } = useApp();

  const [activePillarFilter, setActivePillarFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [editingPackage, setEditingPackage] = useState<ServicePackagePricing | null>(null);
  const [inlinePriceEditingId, setInlinePriceEditingId] = useState<string | null>(null);
  const [inlinePriceValue, setInlinePriceValue] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);

  // New package form state
  const [newPkgPillar, setNewPkgPillar] = useState<SolutionId>('sharp_presence');
  const [newPkgName, setNewPkgName] = useState<string>('');
  const [newPkgTagline, setNewPkgTagline] = useState<string>('');
  const [newPkgHasMonthly, setNewPkgHasMonthly] = useState<boolean>(true);
  const [newPkgFirstMonthPrice, setNewPkgFirstMonthPrice] = useState<string>('0');
  const [newPkgMonthlyPrice, setNewPkgMonthlyPrice] = useState<string>('1500');
  const [newPkgFocus, setNewPkgFocus] = useState<string>('');
  const [newPkgBadge, setNewPkgBadge] = useState<string>('Novo');
  const [newPkgIncludes, setNewPkgIncludes] = useState<string[]>([
    'Entregável oficial 1',
    'Entregável oficial 2'
  ]);
  const [newIncludeText, setNewIncludeText] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getPillarColorTheme = (pillarId?: string) => {
    switch (pillarId) {
      case 'sharp_insights':
        return {
          title: 'Sharp Insights',
          sub: 'Diagnóstico & Pesquisa',
          badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          accent: 'text-indigo-600',
          headerBg: 'from-indigo-600 to-indigo-800',
          lightBg: 'bg-indigo-50/60',
          border: 'border-indigo-200'
        };
      case 'sharp_brand':
        return {
          title: 'Sharp Brand',
          sub: 'Estratégia & Identidade Visual',
          badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
          accent: 'text-purple-600',
          headerBg: 'from-purple-600 to-purple-800',
          lightBg: 'bg-purple-50/60',
          border: 'border-purple-200'
        };
      case 'sharp_presence':
        return {
          title: 'Sharp Presence',
          sub: 'Social Media & Gestão de Conteúdo',
          badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          accent: 'text-cyan-600',
          headerBg: 'from-cyan-600 to-cyan-800',
          lightBg: 'bg-cyan-50/60',
          border: 'border-cyan-200'
        };
      case 'sharp_growth':
        return {
          title: 'Sharp Growth',
          sub: 'Consultoria & Acompanhamento Estratégico',
          badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          accent: 'text-emerald-600',
          headerBg: 'from-emerald-600 to-emerald-800',
          lightBg: 'bg-emerald-50/60',
          border: 'border-emerald-200'
        };
      default:
        return {
          title: 'Sharp Soluções',
          sub: 'Solução Estratégica',
          badgeBg: 'bg-slate-50 text-slate-800 border-slate-200',
          accent: 'text-slate-600',
          headerBg: 'from-slate-700 to-slate-900',
          lightBg: 'bg-slate-50',
          border: 'border-slate-200'
        };
    }
  };

  const filteredPackages = officialPackages.filter(pkg => {
    if (activePillarFilter === 'all') return true;
    return pkg.pillarId === activePillarFilter || pkg.solutionId === activePillarFilter;
  });

  const handleStartInlineEdit = (pkg: ServicePackagePricing) => {
    setInlinePriceEditingId(pkg.id);
    const isMonthly = pkg.hasMonthlyFee ?? (pkg.model === 'recorrente' || pkg.billingType === 'monthly' || pkg.periodLabel === '/mês');
    const val = isMonthly ? (pkg.monthlyPrice ?? pkg.suggestedPrice) : (pkg.firstMonthSetupPrice ?? pkg.suggestedPrice);
    setInlinePriceValue(val.toString());
  };

  const handleSaveInlinePrice = (pkgId: string) => {
    const val = parseFloat(inlinePriceValue);
    if (!isNaN(val) && val >= 0) {
      const pkg = officialPackages.find(p => p.id === pkgId);
      const isMonthly = pkg?.hasMonthlyFee ?? (pkg?.model === 'recorrente' || pkg?.billingType === 'monthly' || pkg?.periodLabel === '/mês');
      if (isMonthly) {
        updateOfficialPackage(pkgId, { monthlyPrice: val, suggestedPrice: val });
      } else {
        updateOfficialPackage(pkgId, { firstMonthSetupPrice: val, suggestedPrice: val });
      }
      showToast('Valor padrão do produto atualizado com sucesso!');
    }
    setInlinePriceEditingId(null);
  };

  const handleSaveFullEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    const hasMonthly = editingPackage.hasMonthlyFee ?? (editingPackage.model === 'recorrente');
    const mPrice = hasMonthly ? (editingPackage.monthlyPrice !== undefined ? editingPackage.monthlyPrice : editingPackage.suggestedPrice) : 0;
    const pPrice = editingPackage.firstMonthSetupPrice !== undefined ? editingPackage.firstMonthSetupPrice : (!hasMonthly ? editingPackage.suggestedPrice : 0);
    const suggestedPrice = hasMonthly ? (mPrice || pPrice) : pPrice;

    updateOfficialPackage(editingPackage.id, {
      name: editingPackage.name,
      tagline: editingPackage.tagline,
      focus: editingPackage.focus,
      hasMonthlyFee: hasMonthly,
      model: hasMonthly ? 'recorrente' : 'pontual',
      billingType: hasMonthly ? 'monthly' : 'one_time',
      periodLabel: hasMonthly ? '/mês' : 'pontual',
      suggestedPrice: suggestedPrice,
      monthlyPrice: mPrice,
      firstMonthSetupPrice: pPrice,
      badge: editingPackage.badge,
      includes: editingPackage.includes
    });

    showToast(`Produto "${editingPackage.name}" atualizado com sucesso!`);
    setEditingPackage(null);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName.trim()) return;

    const pPrice = parseFloat(newPkgFirstMonthPrice) || 0;
    const mPrice = parseFloat(newPkgMonthlyPrice) || 0;
    const suggestedPrice = newPkgHasMonthly ? (mPrice || pPrice) : (pPrice || mPrice || 1000);

    const pillarNameMap: Record<SolutionId, string> = {
      sharp_insights: 'Sharp Insights',
      sharp_brand: 'Sharp Brand',
      sharp_presence: 'Sharp Presence',
      sharp_growth: 'Sharp Growth'
    };

    const newPkg: ServicePackagePricing = {
      id: `custom_${Date.now()}_${newPkgName.toLowerCase().replace(/\s+/g, '_')}`,
      pillarId: newPkgPillar,
      solutionId: newPkgPillar,
      pillarName: pillarNameMap[newPkgPillar],
      name: newPkgName.trim(),
      tagline: newPkgTagline.trim() || 'Solução customizada Sharp',
      model: newPkgHasMonthly ? 'recorrente' : 'pontual',
      billingType: newPkgHasMonthly ? 'monthly' : 'one_time',
      hasMonthlyFee: newPkgHasMonthly,
      suggestedPrice: suggestedPrice,
      firstMonthSetupPrice: pPrice,
      monthlyPrice: newPkgHasMonthly ? mPrice : 0,
      periodLabel: newPkgHasMonthly ? '/mês' : 'pontual',
      badge: newPkgBadge.trim() || 'Custom',
      focus: newPkgFocus.trim() || 'Atendimento comercial customizado.',
      includes: newPkgIncludes.filter(i => i.trim().length > 0)
    };

    addCustomOfficialPackage(newPkg);
    showToast(`Novo produto "${newPkg.name}" adicionado à Tabela Oficial!`);
    setShowAddModal(false);
    
    // Reset fields
    setNewPkgName('');
    setNewPkgTagline('');
    setNewPkgHasMonthly(true);
    setNewPkgFirstMonthPrice('0');
    setNewPkgMonthlyPrice('1500');
    setNewPkgFocus('');
    setNewPkgIncludes(['Entregável 1', 'Entregável 2']);
  };

  const handleConfirmReset = () => {
    resetOfficialPackagesToDefault();
    setShowResetConfirmModal(false);
    showToast('Tabela de Preços restaurada para os valores oficiais originais!');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10 text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-700 animate-slideDown">
          <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Section Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-100/50 via-emerald-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center space-x-1.5">
                <DollarSign className="w-3.5 h-3.5 text-cyan-600" />
                <span>FINANCEIRO COMERCIAL & TABELA OFICIAL</span>
              </span>
              <span className="text-slate-500 text-xs font-medium">• Gestão de Produtos & Preços Base</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tabela de Produtos, Valores & Mensalidades
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1.5 leading-relaxed">
              Defina o <strong>Valor Único Oficial</strong> de cada produto e pacote da Sharp. Qualquer alteração feita aqui atualiza instantaneamente a base de cálculo de novas propostas, CRM e Diretório de Clientes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setShowResetConfirmModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer border border-slate-200"
              title="Restaurar tabela para os valores originais dos anexos"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Restaurar Padrão</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Pacote / Produto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pillar Filter Tabs & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: `Todos (${officialPackages.length})` },
            { id: 'sharp_insights', label: 'Sharp Insights' },
            { id: 'sharp_brand', label: 'Sharp Brand' },
            { id: 'sharp_presence', label: 'Sharp Presence' },
            { id: 'sharp_growth', label: 'Sharp Growth' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActivePillarFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                activePillarFilter === tab.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Tabela Limpa (Valores)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: CLEAN TABLE - FOCUSED DIRECTLY ON VALUES */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Pilar / Solução</th>
                  <th className="py-3 px-4">Produto</th>
                  <th className="py-3 px-4">Cobrança</th>
                  <th className="py-3 px-4">1º Mês (Projeto / Setup)</th>
                  <th className="py-3 px-4">Mensalidade</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPackages.map(pkg => {
                  const theme = getPillarColorTheme(pkg.pillarId);
                  const isMonthly = pkg.hasMonthlyFee ?? (pkg.model === 'recorrente' || pkg.billingType === 'monthly' || pkg.periodLabel === '/mês');
                  const pPrice = pkg.firstMonthSetupPrice !== undefined ? pkg.firstMonthSetupPrice : (!isMonthly ? pkg.suggestedPrice : 0);
                  const mPrice = pkg.monthlyPrice !== undefined ? pkg.monthlyPrice : (isMonthly ? pkg.suggestedPrice : 0);

                  return (
                    <tr key={pkg.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${theme.badgeBg}`}>
                          {theme.title}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-900 block text-xs">
                            {pkg.name}
                          </span>
                          {pkg.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-cyan-50 text-cyan-700 rounded-md border border-cyan-200">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 line-clamp-1">
                          {pkg.tagline}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isMonthly ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {isMonthly ? 'Mensalidade' : 'Projeto Pontual'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                        {pPrice > 0 ? (
                          <span className="font-bold text-slate-900 bg-slate-100/80 px-2 py-1 rounded-lg">
                            {formatBRL(pPrice)}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isMonthly ? (
                          <span className="font-black text-cyan-800 bg-cyan-50/80 px-2.5 py-1 rounded-lg border border-cyan-100">
                            {formatBRL(mPrice)}<span className="text-[10px] font-bold text-cyan-600">/mês</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal text-[11px]">Sem mensalidade</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setEditingPackage({
                            ...pkg,
                            hasMonthlyFee: isMonthly,
                            firstMonthSetupPrice: pPrice,
                            monthlyPrice: mPrice
                          })}
                          className="px-3 py-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-800 bg-cyan-50/60 hover:bg-cyan-100/80 rounded-xl transition-all cursor-pointer border border-cyan-200"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: CLEAN CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPackages.map(pkg => {
            const theme = getPillarColorTheme(pkg.pillarId);
            const isMonthly = pkg.hasMonthlyFee ?? (pkg.model === 'recorrente' || pkg.billingType === 'monthly' || pkg.periodLabel === '/mês');
            const pPrice = pkg.firstMonthSetupPrice !== undefined ? pkg.firstMonthSetupPrice : (!isMonthly ? pkg.suggestedPrice : 0);
            const mPrice = pkg.monthlyPrice !== undefined ? pkg.monthlyPrice : (isMonthly ? pkg.suggestedPrice : 0);

            return (
              <div
                key={pkg.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${theme.badgeBg}`}>
                      {theme.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isMonthly ? 'bg-cyan-50 text-cyan-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isMonthly ? 'Recorrente Mensal' : 'Projeto Pontual'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Clean Price Breakdown Box */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
                    {pPrice > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">1º Mês (Projeto/Setup):</span>
                        <span className="font-bold text-slate-900">{formatBRL(pPrice)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Mensalidade:</span>
                      <span className={`font-black ${isMonthly ? 'text-cyan-800 text-sm' : 'text-slate-400'}`}>
                        {isMonthly ? `${formatBRL(mPrice)}/mês` : 'Sem mensalidade'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingPackage({
                      ...pkg,
                      hasMonthlyFee: isMonthly,
                      firstMonthSetupPrice: pPrice,
                      monthlyPrice: mPrice
                    })}
                    className="text-xs font-bold text-cyan-700 hover:text-cyan-800 cursor-pointer"
                  >
                    Editar Detalhes →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR PACOTE / PRODUTO COMPLETO                                    */}
      {/* ========================================================================= */}
      {editingPackage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl animate-scaleIn max-h-[92vh] flex flex-col text-slate-800">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Editar Produto: {editingPackage.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Tabela Oficial dos Anexos Sharp
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingPackage(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveFullEdit} className="overflow-y-auto pr-1 flex-1 space-y-4 text-xs">
              
              {/* Name & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={editingPackage.name}
                    onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Badge / Destaque</label>
                  <input
                    type="text"
                    value={editingPackage.badge || ''}
                    onChange={(e) => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                    placeholder="Ex: Mais Escolhido, Start..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
              </div>

              {/* Has Monthly Fee Selector (Radio Buttons) */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <label className="block font-bold text-slate-800">
                  Formato de Cobrança (É por Mensalidade?)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPackage({
                      ...editingPackage,
                      hasMonthlyFee: true,
                      model: 'recorrente',
                      billingType: 'monthly',
                      periodLabel: '/mês',
                      monthlyPrice: editingPackage.monthlyPrice || editingPackage.suggestedPrice || 1000
                    })}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border ${
                      editingPackage.hasMonthlyFee
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Sim (Mensalidade)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingPackage({
                      ...editingPackage,
                      hasMonthlyFee: false,
                      model: 'pontual',
                      billingType: 'one_time',
                      periodLabel: 'pontual',
                      firstMonthSetupPrice: editingPackage.firstMonthSetupPrice || editingPackage.suggestedPrice || 1000,
                      monthlyPrice: 0
                    })}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border ${
                      !editingPackage.hasMonthlyFee
                        ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Não (Projeto Pontual)</span>
                  </button>
                </div>
              </div>

              {/* Price Fields: First Month (Project/Setup) and Monthly Fee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* First Month Setup / Project */}
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <label className="block font-bold text-slate-700">
                    Valor 1º Mês (Projeto / Setup) (R$)
                  </label>
                  <p className="text-[10px] text-slate-500 mb-1">
                    Valor referente ao projeto/setup inicial
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      value={editingPackage.firstMonthSetupPrice !== undefined ? editingPackage.firstMonthSetupPrice : 0}
                      onChange={(e) => setEditingPackage({
                        ...editingPackage,
                        firstMonthSetupPrice: parseFloat(e.target.value) || 0
                      })}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500/20"
                      placeholder="0,00"
                    />
                  </div>
                </div>

                {/* Monthly Fee */}
                <div className={`space-y-1 p-2.5 rounded-xl border transition-all ${
                  editingPackage.hasMonthlyFee 
                    ? 'bg-cyan-50/50 border-cyan-200' 
                    : 'bg-slate-100/50 border-slate-200 opacity-60'
                }`}>
                  <label className="block font-bold text-slate-700">
                    Valor da Mensalidade (R$/mês)
                  </label>
                  <p className="text-[10px] text-slate-500 mb-1">
                    {editingPackage.hasMonthlyFee ? 'Cobrança mensal subsequente' : 'Desativado para projeto pontual'}
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      disabled={!editingPackage.hasMonthlyFee}
                      value={editingPackage.hasMonthlyFee ? (editingPackage.monthlyPrice !== undefined ? editingPackage.monthlyPrice : editingPackage.suggestedPrice) : 0}
                      onChange={(e) => setEditingPackage({
                        ...editingPackage,
                        monthlyPrice: parseFloat(e.target.value) || 0,
                        suggestedPrice: parseFloat(e.target.value) || 0
                      })}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-cyan-300 rounded-xl font-black text-slate-900 text-xs focus:ring-2 focus:ring-cyan-500/20 disabled:bg-slate-100 disabled:text-slate-400"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Tagline / Subtítulo</label>
                <input
                  type="text"
                  value={editingPackage.tagline}
                  onChange={(e) => setEditingPackage({ ...editingPackage, tagline: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Focus */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Foco Estratégico do Pacote</label>
                <textarea
                  rows={2}
                  value={editingPackage.focus}
                  onChange={(e) => setEditingPackage({ ...editingPackage, focus: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              {/* Deliverables Checklist (Includes) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-900">
                    O Que Deverá Ser Entregue (Escopo do Pacote)
                  </label>
                  <span className="text-[10px] text-slate-400">{editingPackage.includes.length} itens</span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {editingPackage.includes.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const updated = [...editingPackage.includes];
                          updated[idx] = e.target.value;
                          setEditingPackage({ ...editingPackage, includes: updated });
                        }}
                        className="flex-1 bg-transparent text-xs text-slate-800 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editingPackage.includes.filter((_, i) => i !== idx);
                          setEditingPackage({ ...editingPackage, includes: updated });
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new deliverable */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={newIncludeText}
                    onChange={(e) => setNewIncludeText(e.target.value)}
                    placeholder="+ Adicionar item ao escopo deste pacote..."
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newIncludeText.trim()) {
                          setEditingPackage({
                            ...editingPackage,
                            includes: [...editingPackage.includes, newIncludeText.trim()]
                          });
                          setNewIncludeText('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newIncludeText.trim()) {
                        setEditingPackage({
                          ...editingPackage,
                          includes: [...editingPackage.includes, newIncludeText.trim()]
                        });
                        setNewIncludeText('');
                      }
                    }}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPackage(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVO PRODUTO / PACOTE                                               */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl animate-scaleIn max-h-[92vh] flex flex-col text-slate-800">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cadastrar Novo Produto ou Pacote
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Será adicionado à Tabela Oficial do Comercial
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePackage} className="overflow-y-auto pr-1 flex-1 space-y-3.5 text-xs">
              
              {/* Pillar */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Pilar Sharp</label>
                <select
                  value={newPkgPillar}
                  onChange={(e) => setNewPkgPillar(e.target.value as SolutionId)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  <option value="sharp_insights">Sharp Insights (Diagnóstico & Pesquisa)</option>
                  <option value="sharp_brand">Sharp Brand (Estratégia & Identidade)</option>
                  <option value="sharp_presence">Sharp Presence (Social Media & Conteúdo)</option>
                  <option value="sharp_growth">Sharp Growth (Consultoria & Acompanhamento)</option>
                </select>
              </div>

              {/* Name & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Presence Performance..."
                    value={newPkgName}
                    onChange={(e) => setNewPkgName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">Badge</label>
                  <input
                    type="text"
                    placeholder="Ex: Novo, Exclusivo..."
                    value={newPkgBadge}
                    onChange={(e) => setNewPkgBadge(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              {/* Formato de Cobrança (Radio) */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <label className="block font-bold text-slate-800">
                  Formato de Cobrança (É por Mensalidade?)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPkgHasMonthly(true)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border ${
                      newPkgHasMonthly
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Sim (Mensalidade)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPkgHasMonthly(false)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer border ${
                      !newPkgHasMonthly
                        ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>Não (Projeto Pontual)</span>
                  </button>
                </div>
              </div>

              {/* Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <label className="block font-bold text-slate-700">Valor 1º Mês (Projeto / Setup)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      value={newPkgFirstMonthPrice}
                      onChange={(e) => setNewPkgFirstMonthPrice(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 text-xs"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={`space-y-1 p-2.5 rounded-xl border ${
                  newPkgHasMonthly ? 'bg-cyan-50/50 border-cyan-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
                }`}>
                  <label className="block font-bold text-slate-700">Valor da Mensalidade</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      disabled={!newPkgHasMonthly}
                      value={newPkgMonthlyPrice}
                      onChange={(e) => setNewPkgMonthlyPrice(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-cyan-300 rounded-xl font-black text-slate-900 text-xs disabled:bg-slate-100 disabled:text-slate-400"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Tagline / Proposta</label>
                <input
                  type="text"
                  placeholder="Ex: Estratégia de alto impacto para autoridade..."
                  value={newPkgTagline}
                  onChange={(e) => setNewPkgTagline(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              {/* Focus */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-700">Foco do Pacote</label>
                <textarea
                  rows={2}
                  placeholder="Descreva quando este pacote é recomendado..."
                  value={newPkgFocus}
                  onChange={(e) => setNewPkgFocus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-black flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Cadastrar Pacote</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CONFIRMAR RESTAURAÇÃO DE TABELA PADRÃO                             */}
      {/* ========================================================================= */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center space-x-3 text-amber-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Restaurar Tabela de Preços Original?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Esta ação redefinirá todos os produtos e valores de volta para os valores padrão estipulados nos Anexos Oficiais Sharp.
            </p>

            <div className="flex items-center justify-end space-x-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs cursor-pointer"
              >
                Sim, Restaurar Padrão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
