import React, { useState } from 'react';
import { Project, ProjectActiveProduct, ProjectSubProduct } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Sparkles,
  Palette,
  FileText,
  Video,
  Code,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  ChevronRight,
  Trash2,
  Edit2,
  X,
  Check,
  Upload
} from 'lucide-react';

interface ClientSubProductsViewProps {
  project: Project;
  product: ProjectActiveProduct;
  selectedSubProductId: string | null;
  onSelectSubProduct: (subProductId: string) => void;
  onBackToProducts: () => void;
  onOpenUploadModal: (subProductId?: string, subProductName?: string) => void;
}

export const ClientSubProductsView: React.FC<ClientSubProductsViewProps> = ({
  project,
  product,
  selectedSubProductId,
  onSelectSubProduct,
  onBackToProducts,
  onOpenUploadModal
}) => {
  const { addSubProductToActiveProduct, updateProjectSubProduct, removeProjectSubProduct } = useApp();

  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCategory, setSubCategory] = useState<'art' | 'strategy' | 'copy' | 'media' | 'tech'>('art');
  const [subDescription, setSubDescription] = useState('');
  const [subStage, setSubStage] = useState('Criação Visual');
  const [subStaff, setSubStaff] = useState('Luan (Líder de Arte)');
  const [isArt, setIsArt] = useState(true);

  const subProducts = product.subProducts || [];

  const handleCreateSubProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;

    addSubProductToActiveProduct(project.id, product.id, {
      name: subName.trim(),
      category: subCategory,
      description: subDescription.trim() || undefined,
      isArtDeliverable: isArt,
      stage: subStage.trim() || 'Em Andamento',
      responsibleStaff: subStaff.trim() || 'Luan (Líder de Arte)',
      deliverablesCount: 0,
      approvedCount: 0,
      status: 'in_progress'
    });

    setSubName('');
    setSubDescription('');
    setIsAddSubModalOpen(false);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'art':
        return { label: '🎨 Arte / Design', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'strategy':
        return { label: '🎯 Estratégia', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'copy':
        return { label: '✍️ Copywriting', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'media':
        return { label: '🎬 Mídia / Vídeo', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'tech':
        return { label: '⚙️ Tecnologia / Tráfego', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: '📦 Entregável', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: '✓ Concluído', color: 'bg-emerald-100 text-emerald-800' };
      case 'in_review':
        return { label: '● Em Validação', color: 'bg-amber-100 text-amber-800' };
      case 'in_progress':
        return { label: '⚡ Em Produção', color: 'bg-indigo-100 text-indigo-800' };
      default:
        return { label: '○ Pendente', color: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
      
      {/* Navigation Breadcrumb & Product Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <button
              onClick={onBackToProducts}
              className="font-medium hover:text-cyan-600 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar aos Produtos Ativos</span>
            </button>
            <span>/</span>
            <span className="font-semibold text-slate-700">{project.companyName}</span>
            <span>/</span>
            <span className="font-bold text-slate-900">{product.name}</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                4. Subprodutos de: {product.name}
              </h3>
              <p className="text-xs text-slate-500">
                {product.packageName || 'Entregas operacionais e peças visuais deste pacote.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddSubModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Subproduto</span>
          </button>
        </div>
      </div>

      {/* Subproducts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {subProducts.map((sub, idx) => {
          const isSelected = sub.id === selectedSubProductId;
          const catInfo = getCategoryBadge(sub.category);
          const statusInfo = getStatusBadge(sub.status);

          // Deliverables count for this subproduct
          const projectDeliverables = project.contentItems || [];
          const subDeliverables = projectDeliverables.filter(d => d.subProductId === sub.id);
          const approvedCount = subDeliverables.filter(d => d.status === 'approved').length;

          return (
            <div
              key={sub.id}
              onClick={() => onSelectSubProduct(sub.id)}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50/60 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md scale-[1.01]'
                  : 'bg-slate-50/70 hover:bg-slate-100/90 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Category badge & Status */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${catInfo.color}`}>
                    {catInfo.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {sub.name}
                </h4>

                {sub.description && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                )}

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 space-y-1 text-[10px] text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Etapa:</span>
                    <strong className="text-slate-800">{sub.stage}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Responsável:</span>
                    <strong className="text-slate-800">{sub.responsibleStaff}</strong>
                  </div>
                </div>
              </div>

              {/* Footer with Deliverable Stats & Action */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1 font-semibold text-slate-700">
                  {sub.isArtDeliverable ? (
                    <span className="text-indigo-600 flex items-center space-x-1">
                      <Palette className="w-3 h-3" />
                      <span>{subDeliverables.length} peças</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center space-x-1">
                      <FileText className="w-3 h-3" />
                      <span>Estratégia</span>
                    </span>
                  )}
                </div>

                <span className={`font-bold ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {isSelected ? '● Foco Ativo' : 'Ver Artes →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add Subproduct */}
      {isAddSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Novo Subproduto para {product.name}
                </h3>
              </div>
              <button
                onClick={() => setIsAddSubModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubProduct} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Subproduto / Entregável:
                </label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="Ex: Artes de Feed & Carrosséis Autoriais..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoria:
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="art">🎨 Arte / Design</option>
                    <option value="strategy">🎯 Estratégia</option>
                    <option value="copy">✍️ Copywriting</option>
                    <option value="media">🎬 Mídia / Vídeo</option>
                    <option value="tech">⚙️ Tecnologia / Tráfego</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Responsável:
                  </label>
                  <select
                    value={subStaff}
                    onChange={(e) => setSubStaff(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="Luan (Líder de Arte)">Luan (Líder de Arte)</option>
                    <option value="Raphael (Estrategista Chefe)">Raphael (Estrategista Chefe)</option>
                    <option value="Ingrid (Atendimento & CS)">Ingrid (Atendimento & CS)</option>
                    <option value="Cristiano (Growth & Mídia)">Cristiano (Growth & Mídia)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Etapa Operacional:
                </label>
                <input
                  type="text"
                  value={subStage}
                  onChange={(e) => setSubStage(e.target.value)}
                  placeholder="Ex: Criação & Vetorização..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição & Especificações:
                </label>
                <textarea
                  value={subDescription}
                  onChange={(e) => setSubDescription(e.target.value)}
                  rows={2}
                  placeholder="Detalhes dos requisitos, especificações ou formatos..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isArtCheck"
                  checked={isArt}
                  onChange={(e) => setIsArt(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="isArtCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Este subproduto possui entregáveis de arte / foto e necessita da esteira de aprovação.
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSubModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  Criar Subproduto
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
