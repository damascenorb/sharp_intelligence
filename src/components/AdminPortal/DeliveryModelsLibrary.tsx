import React, { useState, useEffect } from 'react';
import {
  Layers, CheckCircle2, Clock, ChevronRight, Plus, Users,
  Building2, Sparkles, AlertCircle, ArrowRight, Filter, Search, Tag, FileText,
  CheckSquare, Square, Eye, Edit3, Trash2, Calendar, UserCheck, Check,
  Sliders, ChevronDown, ChevronUp, BarChart3, Target, Compass, Award, ExternalLink,
  Briefcase, TrendingUp, ShieldCheck, CheckCheck, ListChecks, HelpCircle, User,
  Archive, FolderArchive, RotateCcw, CheckCircle, AlertTriangle, Copy, Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeliveryTemplate, DeliveryStage, DeliveryTaskTemplate, SolutionId } from '../../types';
import { INITIAL_DELIVERY_TEMPLATES, STORAGE_KEYS } from '../../data/singleSourceData';

export const DeliveryModelsLibrary: React.FC = () => {
  const { currentUser } = useApp();

  const [templates, setTemplates] = useState<DeliveryTemplate[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DELIVERY_TEMPLATES;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.deliveryTemplates);
      return raw ? JSON.parse(raw) : INITIAL_DELIVERY_TEMPLATES;
    } catch {
      return INITIAL_DELIVERY_TEMPLATES;
    }
  });

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    return templates[0]?.id || 'dt_sharp_brand_strategy';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [showNewVersionModal, setShowNewVersionModal] = useState(false);
  const [versionNotes, setVersionNotes] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Sync to local storage
  const saveTemplates = (newTemplates: DeliveryTemplate[]) => {
    setTemplates(newTemplates);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.deliveryTemplates, JSON.stringify(newTemplates));
    }
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.productId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProduct = productFilter === 'all' || t.productId === productFilter;
    return matchesSearch && matchesProduct;
  });

  // Create new version of a template (idempotent, does not affect active projects)
  const handleCreateNewVersion = () => {
    if (!selectedTemplate) return;

    const newVersionNum = selectedTemplate.version + 1;
    const newTemplateId = `${selectedTemplate.id}_v${newVersionNum}_${Date.now()}`;

    const updatedCurrent = {
      ...selectedTemplate,
      status: 'archived' as const,
      updatedAt: new Date().toISOString()
    };

    const newVersion: DeliveryTemplate = {
      ...selectedTemplate,
      id: newTemplateId,
      version: newVersionNum,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedList = templates.map(t => t.id === selectedTemplate.id ? updatedCurrent : t).concat(newVersion);
    saveTemplates(updatedList);
    setSelectedTemplateId(newVersion.id);
    setShowNewVersionModal(false);
    setVersionNotes('');
    setSuccessBanner(`Nova Versão v${newVersionNum} criada com sucesso para ${selectedTemplate.name}! Os projetos antigos continuam preservando sua respectiva versão original.`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Metodologia & Modelos Sharp</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Modelos de Entrega
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl">
              Biblioteca de modelos operacionais para execução dos produtos Sharp.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowNewVersionModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Gerar Nova Versão do Modelo</span>
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="mt-6 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successBanner}</span>
          </div>
        )}
      </div>

      {/* Main Layout: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Template Selector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <ListChecks className="w-4 h-4 text-purple-600" />
                <span>Modelos Oficiais</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">{filteredTemplates.length} ativos</span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar modelo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* List */}
            <div className="space-y-2">
              {filteredTemplates.map(t => {
                const isSelected = t.id === selectedTemplate?.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTemplateId(t.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-50/80 border-purple-300 shadow-2xs text-purple-950'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{t.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-purple-200 text-purple-900' : 'bg-slate-100 text-slate-600'
                      }`}>
                        v{t.version}.0
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center space-x-3 text-[11px] text-slate-500">
                      <span>{t.stages.length} etapas</span>
                      <span>•</span>
                      <span>{t.stages.reduce((acc, s) => acc + s.tasks.length, 0)} tarefas</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Selected Template Deep-Dive */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTemplate ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Template Title & Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-black text-slate-900">{selectedTemplate.name}</h2>
                    <span className="px-2.5 py-0.5 bg-purple-100 border border-purple-200 text-purple-800 rounded-full text-xs font-bold">
                      Versão {selectedTemplate.version}.0
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
                      {selectedTemplate.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    ID Técnico: <code className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded-md">{selectedTemplate.id}</code>
                  </p>
                </div>
              </div>

              {/* Stages and Task Breakdown */}
              <div className="space-y-6">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Esteira de Etapas e Critérios de Aceite</span>
                </h3>

                <div className="space-y-4">
                  {selectedTemplate.stages.map((stage, sIdx) => (
                    <div
                      key={stage.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                              {sIdx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{stage.name}</h4>
                          </div>
                          {stage.description && (
                            <p className="text-xs text-slate-600 pl-8">{stage.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Acceptance Criteria */}
                      {stage.acceptanceCriteria && stage.acceptanceCriteria.length > 0 && (
                        <div className="pl-8 pt-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                            Critérios de Aceite para Conclusão da Etapa:
                          </span>
                          <div className="space-y-1">
                            {stage.acceptanceCriteria.map((crit, cIdx) => (
                              <div key={cIdx} className="flex items-center space-x-2 text-xs text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{crit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tasks in Stage */}
                      <div className="pl-8 pt-2 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Tarefas Padronizadas do Modelo:
                        </span>
                        {stage.tasks.map(task => (
                          <div
                            key={task.id}
                            className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center space-x-2.5">
                              <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
                              <span className="font-semibold text-slate-800">{task.title}</span>
                            </div>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                              {task.role || 'Geral'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              Selecione um modelo de entrega ao lado.
            </div>
          )}
        </div>

      </div>

      {/* Modal: Gerar Nova Versão do Modelo */}
      {showNewVersionModal && selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Criar Versão v{selectedTemplate.version + 1}.0 de {selectedTemplate.name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Esta ação cria uma nova versão ativa do modelo para os próximos contratos fechados. 
              <strong>Importante:</strong> Projetos e contratos que já estão em execução continuarão vinculados à versão original (v{selectedTemplate.version}.0) sem alterações indesejadas.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Notas da Versão (opcional):</label>
              <textarea
                value={versionNotes}
                onChange={e => setVersionNotes(e.target.value)}
                placeholder="Ex: Atualização dos critérios de aceite da etapa 2 e adição de checklist de SEO..."
                className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowNewVersionModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateNewVersion}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Confirmar e Publicar Versão v{selectedTemplate.version + 1}.0
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
