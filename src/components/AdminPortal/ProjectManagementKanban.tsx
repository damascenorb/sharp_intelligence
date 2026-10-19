import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientOperationSelector } from './ClientOperationSelector';
import { 
  Project, 
  SolutionId 
} from '../../types';
import {
  Building2,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Check,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { SHARP_SOLUTIONS } from '../../data/mockData';

export const ProjectManagementKanban: React.FC = () => {
  const {
    projects,
    addProject,
    syncAllRegisteredClientsToProjects,
    currentUser
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('all');

  // Selected Project / Client
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Modals & UI Controls
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  // Form State: New Project
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newSegment, setNewSegment] = useState('');
  const [newSolutions, setNewSolutions] = useState<SolutionId[]>(['sharp_brand', 'sharp_presence']);
  const [newDesigner, setNewDesigner] = useState('Kauã (Designer & Criação de Artes)');
  const [newStrategist, setNewStrategist] = useState('Raphael (Estrategista Chefe)');
  const [newCommercial, setNewCommercial] = useState('Ingrid (Atendimento & CS)');
  const [newGrowth, setNewGrowth] = useState('Cristiano (Growth & Mídia)');

  // Auto-select first project if none selected
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const handleSyncClients = () => {
    const result = syncAllRegisteredClientsToProjects();
    setSyncToastMessage(result.message);
    setTimeout(() => setSyncToastMessage(null), 4500);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleToggleSolutionSelection = (solId: SolutionId) => {
    setNewSolutions(prev => 
      prev.includes(solId) ? prev.filter(s => s !== solId) : [...prev, solId]
    );
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;

    const projectId = addProject({
      companyName: newCompanyName.trim(),
      clientName: newClientName.trim() || newCompanyName.trim(),
      clientEmail: newClientEmail.trim() || `contato@${newCompanyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
      clientPhone: newClientPhone.trim() || '(19) 9 9568-2110',
      segment: newSegment.trim() || 'Serviços & Negócios',
      solutions: newSolutions.length > 0 ? newSolutions : ['sharp_brand', 'sharp_presence'],
      stage: 'onboarding',
      assignedTeam: {
        designer: newDesigner,
        strategist: newStrategist,
        commercial: newCommercial,
        growth: newGrowth
      }
    });

    setSelectedProjectId(projectId);
    setIsNewProjectModalOpen(false);

    // Reset Form
    setNewCompanyName('');
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewSegment('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn text-slate-800">
      
      {/* Toast Notification for Sync */}
      {syncToastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-white text-slate-900 px-5 py-3.5 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-200 animate-slideDown">
          <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold">{syncToastMessage}</p>
            <p className="text-[10px] text-slate-500">Dados integrados em tempo real na Operação.</p>
          </div>
          <button onClick={() => setSyncToastMessage(null)} className="text-slate-400 hover:text-slate-700 text-xs ml-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main Header (Clean Light Theme) */}
      <div className="bg-white border border-slate-200/90 text-slate-900 rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-50 via-indigo-50/50 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                CENTRAL DE OPERAÇÕES SHARP
              </span>
              <span className="text-slate-500 text-xs font-medium">• Visualização Limpa & Etapas por Produto</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Gestão Operacional por Cliente & Produtos
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1.5 leading-relaxed">
              Clientes organizados em lista vertical clara. Clique em qualquer cliente, no nome da empresa ou nos botões de ação para abrir o pop-up exclusivo com todas as etapas por produto, ficha com subprodutos e galeria de artes.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 self-start md:self-auto">
            <button
              onClick={handleSyncClients}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-cyan-600" />
              <span>Sincronizar Cadastros</span>
            </button>
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Cliente / Projeto</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. LISTA VERTICAL DE CLIENTES (PÁGINA PRINCIPAL ABRE ATÉ AQUI, DEMAIS INFORMAÇÕES EM POP-UP) */}
      <ClientOperationSelector
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={handleSelectProject}
        onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        onSyncClients={handleSyncClients}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStage={filterStage}
        setFilterStage={setFilterStage}
      />

      {/* MODAL 2: NEW PROJECT / CLIENT */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Novo Cliente & Projeto Operacional
                </h3>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome da Empresa / Marca:
                  </label>
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Ex: Dra. Juliana Rossi Odonto..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome do Responsável / Contato:
                  </label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ex: Dra. Juliana Rossi..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Segmento:
                  </label>
                  <input
                    type="text"
                    value={newSegment}
                    onChange={(e) => setNewSegment(e.target.value)}
                    placeholder="Ex: Odontologia Estética"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email de Contato:
                  </label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="juliana@rossi.com.br"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="(19) 9 9568-2110"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Solutions Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Produtos / Soluções Contratadas:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SHARP_SOLUTIONS.map(sol => {
                    const isSelected = newSolutions.includes(sol.id);
                    return (
                      <div
                        key={sol.id}
                        onClick={() => handleToggleSolutionSelection(sol.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center space-x-2 text-xs ${
                          isSelected
                            ? 'bg-cyan-50 border-cyan-400 text-cyan-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="truncate">{sol.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Staff Assignments */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Estrategista:</label>
                  <input
                    type="text"
                    value={newStrategist}
                    onChange={(e) => setNewStrategist(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Growth & Mídia:</label>
                  <input
                    type="text"
                    value={newGrowth}
                    onChange={(e) => setNewGrowth(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Designer:</label>
                  <input
                    type="text"
                    value={newDesigner}
                    onChange={(e) => setNewDesigner(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Comercial:</label>
                  <input
                    type="text"
                    value={newCommercial}
                    onChange={(e) => setNewCommercial(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Cadastrar Cliente & Ativar
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
