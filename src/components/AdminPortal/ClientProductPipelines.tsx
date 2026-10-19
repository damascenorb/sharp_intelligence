import React, { useState, useEffect } from 'react';
import { Project, SolutionId } from '../../types';
import { 
  ProductStageDefinition, 
  GET_DEFAULT_STAGES_FOR_SOLUTION 
} from '../../data/productStagesData';
import { StageTasksModal } from './StageTasksModal';
import { ContentUploadModal } from './ContentUploadModal';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Upload, 
  ChevronRight, 
  Users, 
  Plus, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ClientProductPipelinesProps {
  project: Project;
  onOpenClientDetailsModal: () => void;
}

export const ClientProductPipelines: React.FC<ClientProductPipelinesProps> = ({
  project,
  onOpenClientDetailsModal
}) => {
  const { addNotification } = useApp();

  // Manage stage definitions per product in local component state (or persisted per project)
  const [productStagesMap, setProductStagesMap] = useState<Record<string, ProductStageDefinition[]>>({});

  // Active Stage Modal State
  const [selectedStageData, setSelectedStageData] = useState<{
    productName: string;
    solutionId: string;
    stage: ProductStageDefinition;
  } | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadContext, setUploadContext] = useState<{
    productId?: string;
    subProductName?: string;
  }>({});

  // Initialize or synchronize stages for all active products of the project
  useEffect(() => {
    const prods = project.activeProducts || [];
    const newMap: Record<string, ProductStageDefinition[]> = { ...productStagesMap };

    prods.forEach(prod => {
      const prodKey = prod.id || prod.solutionId;
      if (!newMap[prodKey]) {
        newMap[prodKey] = GET_DEFAULT_STAGES_FOR_SOLUTION(
          prod.solutionId as string, 
          prod.name, 
          project.companyName
        );
      }
    });

    setProductStagesMap(newMap);
  }, [project.id, project.activeProducts]);

  const handleToggleTask = (prodKey: string, stageId: string, taskId: string) => {
    setProductStagesMap(prev => {
      const currentStages = prev[prodKey] || [];
      const updatedStages = currentStages.map(st => {
        if (st.id !== stageId) return st;
        const updatedTasks = st.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        const allCompleted = updatedTasks.length > 0 && updatedTasks.every(t => t.completed);
        return {
          ...st,
          tasks: updatedTasks,
          status: (allCompleted ? 'completed' : updatedTasks.some(t => t.completed) ? 'in_progress' : 'pending') as ProductStageDefinition['status']
        };
      });

      // Also update currently open modal data if matching
      if (selectedStageData && selectedStageData.stage.id === stageId) {
        const updatedStage = updatedStages.find(s => s.id === stageId);
        if (updatedStage) {
          setSelectedStageData(prevData => prevData ? { ...prevData, stage: updatedStage } : null);
        }
      }

      return {
        ...prev,
        [prodKey]: updatedStages
      };
    });
  };

  const handleAddTask = (prodKey: string, stageId: string, title: string, assignedTo: string) => {
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      title,
      assignedTo,
      completed: false,
      isArtUpload: title.toLowerCase().includes('arte') || title.toLowerCase().includes('upload') || title.toLowerCase().includes('design')
    };

    setProductStagesMap(prev => {
      const currentStages = prev[prodKey] || [];
      const updatedStages = currentStages.map(st => {
        if (st.id !== stageId) return st;
        return {
          ...st,
          tasks: [...st.tasks, newTask]
        };
      });

      if (selectedStageData && selectedStageData.stage.id === stageId) {
        const updatedStage = updatedStages.find(s => s.id === stageId);
        if (updatedStage) {
          setSelectedStageData(prevData => prevData ? { ...prevData, stage: updatedStage } : null);
        }
      }

      return { ...prev, [prodKey]: updatedStages };
    });
  };

  const handleAdvanceStage = (prodKey: string, stageId: string) => {
    setProductStagesMap(prev => {
      const currentStages = prev[prodKey] || [];
      const updatedStages = currentStages.map(st => {
        if (st.id !== stageId) return st;
        const nextStatus = st.status === 'completed' ? 'in_progress' : 'completed';
        const updatedTasks = nextStatus === 'completed' 
          ? st.tasks.map(t => ({ ...t, completed: true }))
          : st.tasks;

        return {
          ...st,
          status: nextStatus as ProductStageDefinition['status'],
          tasks: updatedTasks
        };
      });

      if (selectedStageData && selectedStageData.stage.id === stageId) {
        const updatedStage = updatedStages.find(s => s.id === stageId);
        if (updatedStage) {
          setSelectedStageData(prevData => prevData ? { ...prevData, stage: updatedStage } : null);
        }
      }

      return { ...prev, [prodKey]: updatedStages };
    });
  };

  const handleOpenUploadForStage = (productId?: string, subProductName?: string) => {
    setUploadContext({
      productId,
      subProductName
    });
    setIsUploadModalOpen(true);
  };

  const handlePassBaton = (note: string) => {
    addNotification({
      title: `Passagem de Bastão: ${project.companyName}`,
      message: note ? `Diretriz de Raphael/Cristiano: "${note}"` : 'Diretrizes de pesquisa enviadas para Kauã iniciar a criação de arte.',
      type: 'approval',
      priority: 'high',
      targetRole: 'staff'
    });
  };

  const activeProducts = project.activeProducts || [];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Client Context & Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white font-extrabold text-lg flex items-center justify-center shadow-xs border border-cyan-500 shrink-0">
            {project.companyName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {project.companyName}
              </h2>
              {project.segment && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
                  {project.segment}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Clique em qualquer etapa abaixo para abrir o <strong>Pop-up de Demandas & Tarefas</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenClientDetailsModal}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Ficha & Subprodutos (Pop-up)</span>
          </button>

          <button
            onClick={() => handleOpenUploadForStage(undefined, 'Arte Geral')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Subir Peça de Arte</span>
          </button>
        </div>
      </div>

      {/* STACKED PRODUCTS (PRODUTO 1 - LISTA DE ETAPAS, PRODUTO 2 - LISTA DE ETAPAS...) */}
      <div className="space-y-6">
        {activeProducts.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl text-slate-500 text-xs">
            Nenhum produto cadastrado para este cliente.
          </div>
        ) : (
          activeProducts.map((prod, pIdx) => {
            const prodKey = prod.id || prod.solutionId;
            const stages = productStagesMap[prodKey] || GET_DEFAULT_STAGES_FOR_SOLUTION(prod.solutionId as string, prod.name, project.companyName);
            
            const completedStagesCount = stages.filter(s => s.status === 'completed').length;
            const totalStagesCount = stages.length;
            const prodPercent = totalStagesCount > 0 ? Math.round((completedStagesCount / totalStagesCount) * 100) : 0;

            return (
              <div 
                key={prodKey || pIdx} 
                className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Product Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-extrabold text-sm shrink-0">
                      {pIdx + 1}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                          Produto {pIdx + 1}: {prod.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {totalStagesCount} etapas
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Líder da Operação: <strong className="text-slate-700">{prod.responsibleStaff}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Progress info */}
                  <div className="flex items-center space-x-3 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-700">
                        {completedStagesCount} de {totalStagesCount} etapas concluídas
                      </span>
                      <div className="w-32 bg-slate-100 rounded-full h-2 mt-1 overflow-hidden border border-slate-200">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${prodPercent}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl border border-emerald-200">
                      {prodPercent}%
                    </span>
                  </div>
                </div>

                {/* PRODUCT SPECIFIC STAGES LIST (Cards ordenados com demandas & botão de arte) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 pt-1">
                  {stages.map((stage, sIdx) => {
                    const completedTasksCount = stage.tasks.filter(t => t.completed).length;
                    const totalTasks = stage.tasks.length;
                    const isLastStage = sIdx === stages.length - 1;

                    return (
                      <div
                        key={stage.id}
                        onClick={() => setSelectedStageData({
                          productName: prod.name,
                          solutionId: prod.solutionId as string,
                          stage
                        })}
                        className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                          stage.status === 'completed'
                            ? 'bg-emerald-50/40 border-emerald-200/90 hover:border-emerald-300'
                            : stage.requiresArt
                            ? 'bg-purple-50/40 border-purple-200 hover:border-purple-300 ring-1 ring-purple-400/20'
                            : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200/90'
                        }`}
                      >
                        {/* Top: Stage Tag & Status */}
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                              stage.status === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : stage.requiresArt
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {stage.status === 'completed' ? '✓' : sIdx + 1}
                            </span>

                            {stage.requiresArt && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                🎨 Criação de Arte
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug line-clamp-2">
                            {stage.name}
                          </h4>

                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {stage.description}
                          </p>
                        </div>

                        {/* Bottom: Task Count, Staff & Quick Action */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 space-y-2">
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span className="font-semibold">
                              {completedTasksCount}/{totalTasks} tarefas
                            </span>
                            <span className="truncate max-w-[90px]" title={stage.responsibleStaff}>
                              {stage.responsibleStaff.split('(')[0]}
                            </span>
                          </div>

                          {/* IF THIS IS AN ART CREATION STAGE, RENDER DIRECT ACTION BUTTON TO UPLOAD ART */}
                          {stage.requiresArt && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenUploadForStage(prod.id, stage.name);
                              }}
                              className="w-full py-1.5 px-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <Upload className="w-3 h-3" />
                              <span>+ Subir para Arte</span>
                            </button>
                          )}

                          <div className="flex items-center justify-between text-[10px] font-bold text-cyan-600 pt-0.5">
                            <span>Ver Demandas</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* POP-UP 1: STAGE DEMANDS & TASKS MODAL */}
      {selectedStageData && (
        <StageTasksModal
          project={project}
          productName={selectedStageData.productName}
          solutionId={selectedStageData.solutionId}
          stage={selectedStageData.stage}
          isOpen={true}
          onClose={() => setSelectedStageData(null)}
          onToggleTask={(stageId, taskId) => {
            const prod = activeProducts.find(p => p.solutionId === selectedStageData.solutionId || p.name === selectedStageData.productName);
            const prodKey = prod?.id || prod?.solutionId || 'sharp_brand';
            handleToggleTask(prodKey, stageId, taskId);
          }}
          onAddTask={(stageId, title, assignedTo) => {
            const prod = activeProducts.find(p => p.solutionId === selectedStageData.solutionId || p.name === selectedStageData.productName);
            const prodKey = prod?.id || prod?.solutionId || 'sharp_brand';
            handleAddTask(prodKey, stageId, title, assignedTo);
          }}
          onOpenUploadModal={(subProdName) => {
            handleOpenUploadForStage(selectedStageData.solutionId, subProdName);
          }}
          onAdvanceStage={(stageId) => {
            const prod = activeProducts.find(p => p.solutionId === selectedStageData.solutionId || p.name === selectedStageData.productName);
            const prodKey = prod?.id || prod?.solutionId || 'sharp_brand';
            handleAdvanceStage(prodKey, stageId);
          }}
          onPassBaton={handlePassBaton}
        />
      )}

      {/* POP-UP 2: CONTENT & ART UPLOAD MODAL */}
      <ContentUploadModal
        projectId={project.id}
        productId={uploadContext.productId}
        subProductName={uploadContext.subProductName}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

    </div>
  );
};
