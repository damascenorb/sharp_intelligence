import React, { useState } from 'react';
import { Project } from '../../types';
import { ClientDetailsModal } from './ClientDetailsModal';
import { getProductColorTheme } from '../../utils/productUtils';
import { 
  Building2, 
  Search, 
  Plus, 
  RefreshCw, 
  MessageSquare, 
  ChevronRight, 
  ChevronDown,
  Layers,
  Sparkles,
  Clock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ClientOperationSelectorProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectModal: () => void;
  onSyncClients: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStage: string;
  setFilterStage: (stage: string) => void;
}

export const ClientOperationSelector: React.FC<ClientOperationSelectorProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenNewProjectModal,
  onSyncClients,
  searchQuery,
  setSearchQuery,
  filterStage,
  setFilterStage
}) => {
  const { isClientInactive, navigateToClientChat } = useApp();

  // Modal state for client details and stages
  const [modalProject, setModalProject] = useState<Project | null>(null);
  const [focusedSolutionId, setFocusedSolutionId] = useState<string | null>(null);

  // Expanded client row for showing products inline if clicked
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

  // Filter projects (exclude archived ones by default)
  const activeProjects = projects.filter(p => !p.archived && !isClientInactive(p.companyName));

  const filteredProjects = activeProjects.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      p.companyName.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      (p.segment && p.segment.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (filterStage === 'all') return true;
    if (filterStage === 'has_pending_art') {
      return (p.contentItems || []).some(c => c.status === 'ready_for_review' || c.status === 'pending_client_approval');
    }
    if (filterStage === 'onboarding') {
      return p.stage === 'onboarding' || p.stage === 'kickoff';
    }
    if (filterStage === 'producao') {
      return p.stage === 'producao';
    }
    if (filterStage === 'concluido') {
      return p.stage === 'concluido';
    }
    return true;
  });

  // Calculate individual product progress
  const calculateProductProgress = (prod: any): number => {
    const subProds = prod.subProducts || [];
    if (subProds.length > 0) {
      const completedCount = subProds.filter((s: any) => s.status === 'completed').length;
      return Math.min(100, Math.round((completedCount / subProds.length) * 100));
    }
    return prod.status === 'completed' ? 100 : prod.status === 'in_progress' ? 60 : 30;
  };

  // Calculate overall client progress
  const calculateClientProgress = (project: Project): number => {
    const prods = project.activeProducts || [];
    if (prods.length === 0) return 30;

    let totalScore = 0;
    prods.forEach(prod => {
      totalScore += calculateProductProgress(prod);
    });

    return Math.min(100, Math.max(10, Math.round(totalScore / prods.length)));
  };

  const openClientModal = (project: Project, solutionId?: string) => {
    onSelectProject(project.id);
    setFocusedSolutionId(solutionId || null);
    setModalProject(project);
  };

  const toggleExpand = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedClientId(prev => prev === projectId ? null : projectId);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
              <Building2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Lista de Clientes em Operação
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'cliente ativo' : 'clientes ativos'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualização simplificada da operação. Clique no cliente para gerenciar produtos, contrato, follow-ups ou etapas de produção.
          </p>
        </div>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome do cliente ou empresa..."
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

        {/* Filter Badges */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'has_pending_art', label: '🎨 Artes para Aprovar' },
            { id: 'producao', label: '⚡ Em Produção' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setFilterStage(filter.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                filterStage === filter.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* VERTICAL STREAMLINED CLIENT ROWS */}
      {filteredProjects.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
          <p className="text-xs text-slate-500 font-medium">Nenhum cliente em operação encontrado com os filtros atuais.</p>
          <button
            onClick={() => { setSearchQuery(''); setFilterStage('all'); }}
            className="mt-2 text-xs text-cyan-600 hover:underline font-semibold cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => {
            const activeProds = project.activeProducts || [];
            const deliverables = project.contentItems || [];
            const pendingArts = deliverables.filter(d => d.status === 'ready_for_review' || d.status === 'pending_client_approval').length;
            const progress = calculateClientProgress(project);
            const isExpanded = expandedClientId === project.id;

            return (
              <div
                key={project.id}
                className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl transition-all shadow-xs overflow-hidden"
              >
                {/* Main Client Row */}
                <div 
                  onClick={() => openClientModal(project)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 transition-colors"
                >
                  
                  {/* 1. Nome do Cliente + Direct Chat Icon */}
                  <div className="flex items-center space-x-3.5 min-w-[220px]">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 shrink-0 overflow-hidden">
                      {project.logoUrl ? (
                        <img src={project.logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        project.companyName.substring(0, 2).toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {project.companyName}
                        </h4>
                        
                        {/* Direct Chat Link Icon per user prompt */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToClientChat(project.companyName);
                          }}
                          title={`Ir para o chat direto com ${project.companyName}`}
                          className="p-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200/80 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 truncate">
                        {project.clientName || 'Cliente'} • {project.segment || 'Serviços'}
                      </p>
                    </div>
                  </div>

                  {/* 2. Produto(s) Ativo(s) with Color Scales */}
                  <div className="flex flex-wrap items-center gap-2 flex-1 max-w-xl">
                    {activeProds.length > 0 ? (
                      activeProds.map((prod, idx) => {
                        const theme = getProductColorTheme(prod.solutionId || prod.name);
                        const prodProgress = calculateProductProgress(prod);

                        return (
                          <div
                            key={prod.id || idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              openClientModal(project, prod.solutionId);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer shadow-2xs ${theme.pillBg} ${theme.pillText} ${theme.pillBorder}`}
                            title={`Clique para abrir as etapas de ${prod.name}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${theme.dotColor}`} />
                            <span className="font-bold">{prod.name}</span>
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-white/80 border border-black/5 text-slate-800">
                              {prodProgress}%
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      (project.solutions || ['sharp_brand', 'sharp_presence']).map((solId, idx) => {
                        const theme = getProductColorTheme(solId);
                        const name = solId === 'sharp_brand' ? 'Sharp Brand' : solId === 'sharp_presence' ? 'Sharp Presence' : solId === 'sharp_insights' ? 'Sharp Insights' : 'Sharp Growth';
                        return (
                          <span
                            key={idx}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center space-x-1.5 ${theme.pillBg} ${theme.pillText} ${theme.pillBorder}`}
                          >
                            <span className={`w-2 h-2 rounded-full ${theme.dotColor}`} />
                            <span>{name}</span>
                          </span>
                        );
                      })
                    )}

                    {pendingArts > 0 && (
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{pendingArts} arte(s)</span>
                      </span>
                    )}
                  </div>

                  {/* 3. % de Conclusão */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conclusão</span>
                      <span className="text-xs font-black text-slate-900">{progress}%</span>
                    </div>
                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-600 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* 4. Botão "Ver Etapas" */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openClientModal(project);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <span>Ver etapas</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => toggleExpand(project.id, e)}
                      title={isExpanded ? 'Recolher produtos' : 'Ver resumo dos produtos'}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>

                </div>

                {/* Submenu Inline (Produtos & Percentual) when expanded */}
                {isExpanded && (
                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center gap-3 animate-fadeIn">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Produtos & Percentuais:
                    </span>
                    {activeProds.map((prod, idx) => {
                      const theme = getProductColorTheme(prod.solutionId || prod.name);
                      const prodProgress = calculateProductProgress(prod);
                      return (
                        <button
                          key={prod.id || idx}
                          onClick={() => openClientModal(project, prod.solutionId)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center space-x-2 transition-transform hover:scale-102 cursor-pointer bg-white ${theme.cardBorder}`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${theme.dotColor}`} />
                          <span className="text-slate-900">{prod.name}:</span>
                          <span className={`font-black ${theme.accentText}`}>{prodProgress}%</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </button>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED POP-UP MODAL (ETAPAS POR PRODUTO) */}
      {modalProject && (
        <ClientDetailsModal
          project={modalProject}
          isOpen={true}
          onClose={() => {
            setModalProject(null);
            setFocusedSolutionId(null);
          }}
        />
      )}

    </div>
  );
};
