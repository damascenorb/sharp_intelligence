import React, { useState } from 'react';
import { Project, ProjectActiveProduct, SolutionId } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Sparkles,
  Palette,
  TrendingUp,
  Lightbulb,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Users,
  Calendar,
  Trash2,
  Edit2,
  ExternalLink,
  PlusCircle,
  X,
  Check
} from 'lucide-react';
import { SHARP_SOLUTIONS } from '../../data/mockData';

interface ClientActiveProductsGridProps {
  project: Project;
  onSelectProduct: (productId: string) => void;
  selectedProductId: string | null;
}

export const ClientActiveProductsGrid: React.FC<ClientActiveProductsGridProps> = ({
  project,
  onSelectProduct,
  selectedProductId
}) => {
  const { addActiveProductToProject, updateProjectActiveProduct, removeProjectActiveProduct } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSolutionId, setSelectedSolutionId] = useState<SolutionId>('sharp_brand');
  const [customName, setCustomName] = useState('');
  const [packageName, setPackageName] = useState('');
  const [responsibleStaff, setResponsibleStaff] = useState('Luan (Líder de Arte)');
  const [currentStage, setCurrentStage] = useState('Criação & Produção');
  const [deliverablesSummary, setDeliverablesSummary] = useState('');

  const activeProducts = project.activeProducts || [];

  const handleOpenAddModal = (defaultSol?: SolutionId) => {
    const sol = defaultSol || 'sharp_brand';
    setSelectedSolutionId(sol);
    if (sol === 'sharp_brand') {
      setCustomName('Sharp Brand');
      setPackageName('Identidade & Posicionamento Autoral');
      setResponsibleStaff('Luan (Líder de Arte)');
      setCurrentStage('Criação de Ativos & Brandbook');
      setDeliverablesSummary('Logotipo vetorial, manual de marca e brandbook institucional.');
    } else if (sol === 'sharp_presence') {
      setCustomName('Sharp Presence');
      setPackageName('Social Media & Gestão de Conteúdo');
      setResponsibleStaff('Luan (Líder de Arte)');
      setCurrentStage('Produção de Lote & Copys');
      setDeliverablesSummary('Artes de feed, carrosséis, stories interativos e roteiros.');
    } else if (sol === 'sharp_insights') {
      setCustomName('Sharp Insights');
      setPackageName('Inteligência de Mercado & Diagnóstico');
      setResponsibleStaff('Raphael (Estrategista Chefe)');
      setCurrentStage('Direcionamento Estratégico');
      setDeliverablesSummary('Diagnóstico de mercado, auditoria e posicionamento.');
    } else if (sol === 'sharp_growth') {
      setCustomName('Sharp Growth');
      setPackageName('Performance & Gestão de Tráfego');
      setResponsibleStaff('Cristiano (Growth & Mídia)');
      setCurrentStage('Setup de Campanhas & Conversão');
      setDeliverablesSummary('Gestão de anúncios Meta/Google, criativos e relatórios.');
    }
    setIsAddModalOpen(true);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    addActiveProductToProject(project.id, {
      solutionId: selectedSolutionId,
      name: customName.trim(),
      packageName: packageName.trim() || 'Pacote Operacional',
      status: 'active',
      currentStage: currentStage.trim() || 'Em Execução',
      responsibleStaff: responsibleStaff.trim() || 'Luan (Líder de Arte)',
      startDate: new Date().toISOString().split('T')[0],
      deliverablesSummary: deliverablesSummary.trim() || `Execução de ${customName} para ${project.companyName}.`
    });

    setIsAddModalOpen(false);
  };

  // Helper icons
  const getProductIcon = (solutionId: string) => {
    switch (solutionId) {
      case 'sharp_brand':
        return <Palette className="w-5 h-5 text-indigo-600" />;
      case 'sharp_presence':
        return <Sparkles className="w-5 h-5 text-cyan-600" />;
      case 'sharp_insights':
        return <Lightbulb className="w-5 h-5 text-amber-600" />;
      case 'sharp_growth':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
      default:
        return <Layers className="w-5 h-5 text-purple-600" />;
    }
  };

  const getProductTheme = (solutionId: string) => {
    switch (solutionId) {
      case 'sharp_brand':
        return {
          bg: 'bg-indigo-50/50',
          border: 'border-indigo-200',
          hoverBorder: 'hover:border-indigo-400',
          activeRing: 'ring-indigo-500/20 border-indigo-500',
          tagBg: 'bg-indigo-100 text-indigo-800'
        };
      case 'sharp_presence':
        return {
          bg: 'bg-cyan-50/50',
          border: 'border-cyan-200',
          hoverBorder: 'hover:border-cyan-400',
          activeRing: 'ring-cyan-500/20 border-cyan-500',
          tagBg: 'bg-cyan-100 text-cyan-800'
        };
      case 'sharp_insights':
        return {
          bg: 'bg-amber-50/50',
          border: 'border-amber-200',
          hoverBorder: 'hover:border-amber-400',
          activeRing: 'ring-amber-500/20 border-amber-500',
          tagBg: 'bg-amber-100 text-amber-800'
        };
      case 'sharp_growth':
        return {
          bg: 'bg-emerald-50/50',
          border: 'border-emerald-200',
          hoverBorder: 'hover:border-emerald-400',
          activeRing: 'ring-emerald-500/20 border-emerald-500',
          tagBg: 'bg-emerald-100 text-emerald-800'
        };
      default:
        return {
          bg: 'bg-slate-50/50',
          border: 'border-slate-200',
          hoverBorder: 'hover:border-slate-400',
          activeRing: 'ring-slate-500/20 border-slate-500',
          tagBg: 'bg-slate-100 text-slate-800'
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              3. Produtos Ativos no Cliente ({project.companyName})
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {activeProducts.length} {activeProducts.length === 1 ? 'produto contratado' : 'produtos contratados'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Clique no produto desejado para abrir seus <strong>subprodutos</strong>, entregáveis de design e esteira de aprovação.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar Outro Produto Ativo</span>
        </button>
      </div>

      {/* Grid 2x2 or cards as in the user's drawing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeProducts.map((product, idx) => {
          const isSelected = product.id === selectedProductId;
          const theme = getProductTheme(product.solutionId);
          const subs = product.subProducts || [];
          
          // Deliverables count linked to this product or general for this project
          const projectDeliverables = project.contentItems || [];
          const prodDeliverables = projectDeliverables.filter(d => d.productId === product.id || (!d.productId && idx === 0));
          const approvedCount = prodDeliverables.filter(d => d.status === 'approved').length;

          return (
            <div
              key={product.id}
              className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between ${theme.bg} ${
                isSelected
                  ? `ring-2 ${theme.activeRing} shadow-md bg-white`
                  : `${theme.border} ${theme.hoverBorder} hover:shadow-sm`
              }`}
            >
              {/* Product Card Top */}
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center">
                      {getProductIcon(product.solutionId)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          PRODUTO ATIVO {idx + 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${theme.tagBg}`}>
                          {product.status === 'active' ? '● Em Execução' : product.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {product.name}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => removeProjectActiveProduct(project.id, product.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Remover produto do cliente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtitle / Package description */}
                {product.packageName && (
                  <p className="text-xs text-slate-600 font-medium mt-2.5">
                    {product.packageName}
                  </p>
                )}

                {/* Stage and Details */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                    <span className="text-slate-500 block">Etapa Operacional:</span>
                    <strong className="text-slate-800">{product.currentStage || 'Produção'}</strong>
                  </div>
                  <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                    <span className="text-slate-500 block">Responsável:</span>
                    <strong className="text-slate-800">{product.responsibleStaff || 'Luan (Arte)'}</strong>
                  </div>
                </div>

                {/* Subproducts and Deliverables stats */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-white/60 px-3 py-2 rounded-xl border border-slate-200/60">
                  <div className="flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    <span><strong>{subs.length}</strong> Subprodutos cadastrados</span>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{approvedCount} artes aprovadas</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Drill down into subproducts */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  {isSelected ? '✓ Produto em visualização' : 'Clique para gerenciar entregáveis'}
                </span>

                <button
                  onClick={() => onSelectProduct(product.id)}
                  className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <span>{isSelected ? 'Visualizando Subprodutos' : 'Ver Subprodutos & Artes'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state / Add product placeholder card */}
        <button
          onClick={() => handleOpenAddModal()}
          className="p-8 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group space-y-2 min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600">
              + Adicionar Outro Produto Ativo
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Adicione Sharp Brand, Sharp Presence, Sharp Growth ou um pacote customizado a este cliente.
            </p>
          </div>
        </button>
      </div>

      {/* Modal: Add Active Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Adicionar Produto Ativo ao Cliente
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              
              {/* Solution Preset Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Selecione a Solução Sharp:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sharp_brand' as SolutionId, name: 'Sharp Brand', desc: 'Identidade & Posicionamento' },
                    { id: 'sharp_presence' as SolutionId, name: 'Sharp Presence', desc: 'Social Media & Conteúdo' },
                    { id: 'sharp_insights' as SolutionId, name: 'Sharp Insights', desc: 'Diagnóstico & Estratégia' },
                    { id: 'sharp_growth' as SolutionId, name: 'Sharp Growth', desc: 'Tráfego & Conversão' }
                  ].map(sol => (
                    <button
                      key={sol.id}
                      type="button"
                      onClick={() => handleOpenAddModal(sol.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedSolutionId === sol.id
                          ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <strong className="text-xs text-slate-900 block">{sol.name}</strong>
                      <span className="text-[11px] text-slate-500">{sol.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Produto / Serviço:
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Package Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtítulo / Descrição do Pacote:
                </label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Responsible Staff & Stage */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Responsável:
                  </label>
                  <select
                    value={responsibleStaff}
                    onChange={(e) => setResponsibleStaff(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Luan (Líder de Arte)">Luan (Líder de Arte)</option>
                    <option value="Raphael (Estrategista Chefe)">Raphael (Estrategista Chefe)</option>
                    <option value="Ingrid (Atendimento & CS)">Ingrid (Atendimento & CS)</option>
                    <option value="Cristiano (Growth & Mídia)">Cristiano (Growth & Mídia)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Etapa Atual:
                  </label>
                  <input
                    type="text"
                    value={currentStage}
                    onChange={(e) => setCurrentStage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resumo das Entregas:
                </label>
                <textarea
                  value={deliverablesSummary}
                  onChange={(e) => setDeliverablesSummary(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  Adicionar Produto
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
