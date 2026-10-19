import React, { useState, useEffect } from 'react';
import { 
  Plus, FolderArchive, Printer, CheckCircle2, 
  ArrowLeft, ArrowRight, Building2, ChevronDown, 
  Sparkles, Package, TrendingUp, Compass, 
  Check, Archive, RotateCcw, BarChart3, Clock, 
  Layers, ChevronRight, FileText, CheckCircle, Search,
  Trash2, Upload, FileUp, X, Paperclip, Gauge, Lightbulb
} from 'lucide-react';
import { 
  SHARP_GUIDED_JOURNEYS, 
  JourneyId, 
  GuidedProject, 
  Milestone,
  getStoredGuidedProjects, 
  saveStoredGuidedProjects, 
  createStarterGuidedProject,
  createFullDemoGuidedProject 
} from '../../data/sharpJourneysData';
import {
  HelpGuideDrawer,
  SecondarySegmentConditional,
  BrainstormIdeasWidget,
  CompetitorProsConsWidget,
  GrowthAndCostsWidget,
  TeamMembersWidget,
  Marco1PitchReview,
  Marco2Review,
  Marco3DossierReport
} from './SharpJourneyWidgets';

export const IdeaOperatingSystem: React.FC = () => {
  const [projects, setProjects] = useState<GuidedProject[]>(() => getStoredGuidedProjects());
  
  // Navigation State: null means we are on the Project Selection / Hub Screen
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  
  // Selection Screen Filter Tab: 'active' (Em andamento) | 'completed' (Prontos) | 'archived' (Arquivados)
  const [projectListFilter, setProjectListFilter] = useState<'active' | 'completed' | 'archived'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete confirmation dialog state
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  // New Project Wizard State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [chosenJourney, setChosenJourney] = useState<JourneyId>('jornada_1');
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyBranch, setCompanyBranch] = useState('');
  const [companyMarket, setCompanyMarket] = useState('');

  // Persist projects
  useEffect(() => {
    saveStoredGuidedProjects(projects);
  }, [projects]);

  // Calculate project progress percentage
  const calculateProjectStats = (project: GuidedProject | undefined) => {
    if (!project) return { total: 0, answered: 0, percent: 0 };
    const journey = SHARP_GUIDED_JOURNEYS[project.journeyId] || SHARP_GUIDED_JOURNEYS['jornada_1'];
    let totalQuestions = 0;
    let answeredCount = 0;

    journey.milestones.forEach(m => {
      m.sections.forEach(s => {
        s.questions.forEach(q => {
          totalQuestions++;
          const val = project.answers[q.id];
          if (val && String(val).trim().length > 0) {
            answeredCount++;
          }
        });
      });
    });

    const percent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
    return { total: totalQuestions, answered: answeredCount, percent };
  };

  // Check if a specific milestone is completely answered
  const isMilestoneCompleted = (project: GuidedProject | undefined, milestone: Milestone) => {
    if (!project) return false;
    let hasQuestions = false;
    for (const sec of milestone.sections) {
      for (const q of sec.questions) {
        hasQuestions = true;
        const val = project.answers[q.id];
        if (!val || String(val).trim().length === 0) {
          return false;
        }
      }
    }
    return hasQuestions;
  };

  // Count answered questions in a milestone
  const getMilestoneStats = (project: GuidedProject | undefined, milestone: Milestone) => {
    if (!project) return { total: 0, answered: 0 };
    let total = 0;
    let answered = 0;
    milestone.sections.forEach(s => {
      s.questions.forEach(q => {
        total++;
        const val = project.answers[q.id];
        if (val && String(val).trim().length > 0) answered++;
      });
    });
    return { total, answered };
  };

  // Active Project Reference
  const activeProject = projects.find(p => p.id === activeProjectId);
  const currentJourney = activeProject 
    ? (SHARP_GUIDED_JOURNEYS[activeProject.journeyId] || SHARP_GUIDED_JOURNEYS['jornada_1'])
    : SHARP_GUIDED_JOURNEYS['jornada_1'];
  const projectStats = calculateProjectStats(activeProject);

  // Calculate Viability Index (for Module 11 in Journey 1)
  const calculateViabilityIndex = (project: GuidedProject | undefined) => {
    if (!project) return 0;
    const scaleKeys = [
      'j1_11_1_q1', 'j1_11_1_q2', 'j1_11_1_q3',
      'j1_11_1_q4', 'j1_11_1_q5', 'j1_11_1_q6',
      'j1_11_1_q7', 'j1_11_1_q8', 'j1_11_1_q9'
    ];
    let sum = 0;
    let answered = 0;
    scaleKeys.forEach(k => {
      const v = Number(project.answers[k]);
      if (v >= 1 && v <= 5) {
        sum += v;
        answered++;
      }
    });
    if (answered === 0) return 0;
    const avg = sum / answered;
    return Math.round((avg / 5) * 100);
  };

  // Answer change handler (with smart sync to project main metadata)
  const handleAnswerChange = (questionId: string, value: string) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        const updatedAnswers = {
          ...p.answers,
          [questionId]: value
        };
        
        let updatedName = p.name;
        let updatedLocation = p.companyLocation;
        let updatedBranch = p.companyBranch;
        let updatedMarket = p.companyMarket;

        if (questionId === 'j1_0_1_q1' && value.trim()) {
          updatedName = value.trim();
        }
        if (questionId === 'j1_0_1_q4' && value.trim()) {
          updatedLocation = value.trim();
        }
        if (questionId === 'j1_0_1_q5' && value.trim()) {
          updatedBranch = value.trim();
        }
        if (questionId === 'j1_0_1_q6' && value.trim()) {
          updatedMarket = value.trim();
        }

        return {
          ...p,
          name: updatedName,
          companyLocation: updatedLocation,
          companyBranch: updatedBranch,
          companyMarket: updatedMarket,
          updatedAt: new Date().toISOString(),
          answers: updatedAnswers
        };
      }
      return p;
    }));
  };

  // File Upload handler
  const handleFileUpload = (questionId: string, file: File) => {
    if (!activeProject) return;
    const fileInfo = {
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      date: new Date().toLocaleDateString('pt-BR')
    };

    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        return {
          ...p,
          answers: {
            ...p.answers,
            [questionId]: file.name
          },
          files: {
            ...(p.files || {}),
            [questionId]: fileInfo
          },
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  // Remove uploaded file
  const handleRemoveFile = (questionId: string) => {
    if (!activeProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === activeProject.id) {
        const newAnswers = { ...p.answers };
        delete newAnswers[questionId];
        const newFiles = { ...(p.files || {}) };
        delete newFiles[questionId];
        return {
          ...p,
          answers: newAnswers,
          files: newFiles,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  // Archive / Unarchive
  const handleToggleArchive = (projectId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          archived: !p.archived,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  // Delete Project
  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProjectId === projectId) {
      setActiveProjectId(null);
      setSelectedMilestoneId(null);
    }
    setProjectToDelete(null);
  };

  // Create Project Submission (Auto fills Marco 0 questions)
  const handleCreateProject = () => {
    if (!companyName.trim()) return;
    const newProj = createStarterGuidedProject(
      chosenJourney,
      companyName.trim(),
      companyLocation.trim() || 'Não informado',
      companyBranch.trim() || 'Geral',
      companyMarket.trim() || 'Geral'
    );
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    setSelectedMilestoneId(null);
    setIsModalOpen(false);
    // Reset wizard
    setWizardStep(1);
    setCompanyName('');
    setCompanyLocation('');
    setCompanyBranch('');
    setCompanyMarket('');
  };

  // Load / View pre-filled complete demo model
  const handleLoadDemoProject = () => {
    const demoProj = createFullDemoGuidedProject();
    const existingIdx = projects.findIndex(p => p.id === demoProj.id);
    if (existingIdx >= 0) {
      setProjects(prev => {
        const copy = [...prev];
        copy[existingIdx] = demoProj;
        return copy;
      });
    } else {
      setProjects(prev => [demoProj, ...prev]);
    }
    setActiveProjectId(demoProj.id);
    setSelectedMilestoneId(null);
  };

  // Active milestone for deep dive view
  const currentSelectedMilestone = currentJourney.milestones.find(m => m.id === selectedMilestoneId);

  // Filter projects for the initial selection screen
  const filteredProjectsList = projects.filter(p => {
    const stats = calculateProjectStats(p);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.companyBranch.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.companyMarket.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (projectListFilter === 'archived') {
      return p.archived === true;
    }
    if (projectListFilter === 'completed') {
      return !p.archived && stats.percent === 100;
    }
    // 'active' / em andamento
    return !p.archived && stats.percent < 100;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-16 print:p-0 print:m-0 print:max-w-none">
      
      {/* ========================================================================= */}
      {/* SCREEN 1: PROJECT SELECTION SCREEN (PRIMEIRO PASSO - SELEÇÃO DE PROJETO) */}
      {/* ========================================================================= */}
      {!activeProjectId && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Header Card */}
          <div className="bg-[#0b1324] text-white p-7 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full flex items-center space-x-2 w-fit">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SHARP • 4 JORNADAS ROBUSTAS DE PERGUNTAS GUIADAS</span>
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white pt-2">
                  Tomada de Decisão em Novos Negócios
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed font-medium">
                  Selecione um projeto existente (em andamento, pronto ou arquivado) para continuar a análise, ou crie um novo projeto estruturado.
                </p>
              </div>

              {/* Actions: Carregar Modelo Preenchido & + Novo Projeto */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={handleLoadDemoProject}
                  className="px-4 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-black text-xs sm:text-sm rounded-2xl flex items-center space-x-2 transition-all cursor-pointer shadow-sm"
                  title="Abrir um projeto completo 100% preenchido com dados reais de exemplo"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ver Modelo Preenchido</span>
                </button>

                <button
                  onClick={() => {
                    setWizardStep(1);
                    setIsModalOpen(true);
                  }}
                  className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-2xl flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Criar Novo Projeto</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
              
              {/* 3 Main Tabs: Em Andamento | Prontos | Arquivados */}
              <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setProjectListFilter('active')}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
                    projectListFilter === 'active'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Em Andamento ({projects.filter(p => !p.archived && calculateProjectStats(p).percent < 100).length})</span>
                </button>

                <button
                  onClick={() => setProjectListFilter('completed')}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
                    projectListFilter === 'completed'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Prontos ({projects.filter(p => !p.archived && calculateProjectStats(p).percent === 100).length})</span>
                </button>

                <button
                  onClick={() => setProjectListFilter('archived')}
                  className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center space-x-2 cursor-pointer ${
                    projectListFilter === 'archived'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FolderArchive className="w-3.5 h-3.5" />
                  <span>Arquivados ({projects.filter(p => p.archived).length})</span>
                </button>
              </div>

              {/* Quick Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome, ramo ou mercado..."
                  className="bg-slate-800/80 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 w-full sm:w-64"
                />
              </div>

            </div>
          </div>

          {/* List of Projects Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                {projectListFilter === 'active' && 'Projetos em Andamento'}
                {projectListFilter === 'completed' && 'Projetos Concluídos (100%)'}
                {projectListFilter === 'archived' && 'Projetos Arquivados'}
              </h3>
              <span className="text-xs text-slate-500 font-bold">
                {filteredProjectsList.length} {filteredProjectsList.length === 1 ? 'projeto encontrado' : 'projetos encontrados'}
              </span>
            </div>

            {filteredProjectsList.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-slate-800">
                    Nenhum projeto encontrado nesta visualização
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {projectListFilter === 'archived'
                      ? 'Nenhum projeto foi arquivado até o momento.'
                      : projectListFilter === 'completed'
                      ? 'Nenhum projeto atingiu 100% de preenchimento ainda.'
                      : 'Clique em "Criar Novo Projeto" acima para iniciar sua primeira jornada.'}
                  </p>
                </div>
                {projectListFilter === 'active' && (
                  <button
                    onClick={() => {
                      setWizardStep(1);
                      setIsModalOpen(true);
                    }}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black rounded-xl cursor-pointer"
                  >
                    + Criar Novo Projeto Agora
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjectsList.map(project => {
                  const stats = calculateProjectStats(project);
                  const journey = SHARP_GUIDED_JOURNEYS[project.journeyId] || SHARP_GUIDED_JOURNEYS['jornada_1'];

                  return (
                    <div
                      key={project.id}
                      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md hover:border-cyan-400 transition-all flex flex-col justify-between space-y-4 group"
                    >
                      {/* Top Badges & Title */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200">
                            {journey.badge}
                          </span>
                          <span className="text-[11px] font-black text-slate-400">
                            {new Date(project.updatedAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-black text-slate-900 group-hover:text-cyan-700 transition-colors">
                            {project.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                            {journey.title}
                          </p>
                        </div>

                        {/* Metadata Tag Strips */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl">
                            <span className="text-slate-400 block font-bold">Ramo:</span>
                            <span className="font-extrabold text-slate-800 truncate block">{project.companyBranch || 'Geral'}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl">
                            <span className="text-slate-400 block font-bold">Local:</span>
                            <span className="font-extrabold text-slate-800 truncate block">{project.companyLocation || 'Não informado'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress & Bottom Actions */}
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-extrabold">
                            <span className="text-slate-600">Progresso</span>
                            <span className="text-cyan-800 font-black">{stats.percent}% ({stats.answered}/{stats.total})</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${stats.percent}%` }}
                            />
                          </div>
                        </div>

                        {/* Buttons: Abrir Projeto | Arquivar | Excluir */}
                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            onClick={() => {
                              setActiveProjectId(project.id);
                              setSelectedMilestoneId(null);
                            }}
                            className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-cyan-600 text-white text-xs font-black rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                          >
                            <span>Abrir Projeto & Perguntas</span>
                            <ArrowRight className="w-4 h-4 text-cyan-400" />
                          </button>

                          {/* Arquivar / Desarquivar */}
                          <button
                            onClick={() => handleToggleArchive(project.id)}
                            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
                            title={project.archived ? 'Desarquivar' : 'Arquivar'}
                          >
                            {project.archived ? <RotateCcw className="w-4 h-4 text-amber-600" /> : <Archive className="w-4 h-4" />}
                          </button>

                          {/* Excluir */}
                          <button
                            onClick={() => setProjectToDelete(project.id)}
                            className="p-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-500 hover:text-rose-700 cursor-pointer transition-colors"
                            title="Excluir Projeto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: PROJECT INTERNAL VIEW (DETALHES, MARCOS E BASE DE PERGUNTAS) */}
      {/* ========================================================================= */}
      {activeProjectId && activeProject && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main White Project Container with Navigation & Print Included */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            {/* Top Toolbar: Voltar à Seleção (Left) + Imprimir (Right) */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <button
                onClick={() => {
                  setActiveProjectId(null);
                  setSelectedMilestoneId(null);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black rounded-xl flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>← Voltar à Lista de Projetos</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-cyan-600 text-white text-xs font-black rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Imprimir Relatório</span>
              </button>
            </div>

            {/* Project Identification Details */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200">
                    {currentJourney.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    {currentJourney.title}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{activeProject.name}</h2>
              </div>

              {/* Quick Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                  <span className="text-slate-400 font-bold">Local:</span>
                  <strong className="text-slate-900 font-bold">{activeProject.companyLocation || 'Não informado'}</strong>
                </span>
                <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                  <span className="text-slate-400 font-bold">Ramo:</span>
                  <strong className="text-slate-900 font-bold">{activeProject.companyBranch || 'Geral'}</strong>
                </span>
                <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
                  <span className="text-slate-400 font-bold">Mercado:</span>
                  <strong className="text-slate-900 font-bold">{activeProject.companyMarket || 'Geral'}</strong>
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800 flex items-center space-x-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-600" />
                  <span>Progresso do Projeto</span>
                </span>
                <span className="font-black text-cyan-800 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full">
                  {projectStats.percent}% Concluído ({projectStats.answered} de {projectStats.total} perguntas)
                </span>
              </div>

              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${projectStats.percent}%` }}
                />
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* VIEW A: LIST OF MARCOS (STACKED VERTICALLY ONE BELOW THE OTHER) */}
          {/* ========================================================================= */}
          {!selectedMilestoneId && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Marcos da Metodologia Sharp ({currentJourney.milestones.length} Marcos)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clique em qualquer marco abaixo para abrir as perguntas guiadas para preenchimento.
                  </p>
                </div>
              </div>

              {/* SINGLE COLUMN: ONE BELOW THE OTHER */}
              <div className="flex flex-col space-y-3.5">
                {currentJourney.milestones.map((milestone) => {
                  const completed = isMilestoneCompleted(activeProject, milestone);
                  const stats = getMilestoneStats(activeProject, milestone);
                  const hasProgress = stats.answered > 0;

                  return (
                    <div
                      key={milestone.id}
                      onClick={() => setSelectedMilestoneId(milestone.id)}
                      className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer relative group flex flex-col justify-between space-y-3 hover:shadow-md ${
                        completed
                          ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-500'
                          : hasProgress
                          ? 'bg-white border-cyan-300 hover:border-cyan-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Top Bar of Card */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                            milestone.milestoneCode.includes('Marco 0') 
                              ? 'bg-cyan-600 text-white' 
                              : milestone.milestoneCode.includes('Wadhwani')
                              ? 'bg-purple-700 text-white'
                              : 'bg-slate-900 text-white'
                          }`}>
                            {milestone.milestoneCode}
                          </span>
                          <h4 className="text-base sm:text-lg font-black text-slate-900 pt-1 group-hover:text-cyan-700 transition-colors">
                            {milestone.title}
                          </h4>
                        </div>

                        {/* Completion Checkmark Badge */}
                        <div>
                          {completed ? (
                            <span className="flex items-center space-x-1 text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full shadow-xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Concluído ✓</span>
                            </span>
                          ) : hasProgress ? (
                            <span className="text-xs font-bold text-cyan-800 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
                              {stats.answered}/{stats.total} respondidas
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                              Pendente ({stats.total} perguntas)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Objective text matching the PDF verbatim */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        <strong className="text-slate-800 font-bold">Objetivo:</strong> {milestone.objective}
                      </p>

                      {/* Bottom Action Footer */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-xs text-slate-500 font-semibold">
                          {milestone.sections.length} {milestone.sections.length === 1 ? 'etapa' : 'etapas'} estruturadas
                        </span>

                        <span className="font-extrabold text-cyan-800 group-hover:text-cyan-600 flex items-center space-x-1.5 text-xs sm:text-sm">
                          <span>Abrir Perguntas</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW B: DEEP DIVE INTO A SELECTED MARCO (QUESTIONS VIEW) */}
          {/* ========================================================================= */}
          {selectedMilestoneId && currentSelectedMilestone && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Top Bar with Back Button */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedMilestoneId(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-black flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-700" />
                  <span>← Voltar aos Marcos</span>
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500">
                    Marco selecionado: <strong className="text-slate-900">{currentSelectedMilestone.milestoneCode}</strong>
                  </span>
                  {isMilestoneCompleted(activeProject, currentSelectedMilestone) && (
                    <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Preenchido ✓</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Milestone Header Box */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-md space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 px-2.5 py-1 rounded-lg">
                  {currentSelectedMilestone.milestoneCode}
                </span>
                <h2 className="text-xl sm:text-2xl font-black">{currentSelectedMilestone.title}</h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  <strong className="text-cyan-400">Objetivo:</strong> {currentSelectedMilestone.objective}
                </p>
                {currentSelectedMilestone.conclusionOutcome && (
                  <p className="text-xs text-slate-400 leading-relaxed pt-0.5">
                    <strong className="text-slate-300">Ao concluir:</strong> {currentSelectedMilestone.conclusionOutcome}
                  </p>
                )}
                {currentSelectedMilestone.submissionReview && (
                  <div className="bg-cyan-950/80 border border-cyan-500/40 p-3 rounded-xl mt-3 text-cyan-300 text-xs font-semibold flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{currentSelectedMilestone.submissionReview}</span>
                  </div>
                )}
              </div>

              {/* Sections & Exact Questions from PDF */}
              <div className="space-y-6">
                {currentSelectedMilestone.sections.map(sec => (
                  <div key={sec.id} className="space-y-4">
                    
                    {/* Section Header */}
                    <div className="bg-slate-50 border border-slate-200 px-5 py-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-black uppercase text-cyan-800 tracking-wider">
                          Etapa {sec.sectionCode}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900">{sec.title}</h3>
                        {sec.exposureDescription && (
                          <p className="text-xs text-slate-500 font-medium italic">{sec.exposureDescription}</p>
                        )}
                      </div>
                      <span className="text-xs text-slate-600 font-bold shrink-0">
                        {sec.questions.length} perguntas
                      </span>
                    </div>

                    {/* Question Cards with EXACT PDF text & clean Ex.: placeholders */}
                    <div className="space-y-4">
                      {sec.questions.map(q => {
                        const answerValue = activeProject.answers[q.id] || '';
                        const uploadedFileInfo = activeProject.files?.[q.id];

                        return (
                          <div 
                            key={q.id} 
                            className={`bg-white p-6 rounded-3xl border transition-all space-y-3 ${
                              answerValue.trim().length > 0 
                                ? 'border-slate-200 shadow-xs' 
                                : 'border-slate-200/80 hover:border-cyan-300'
                            }`}
                          >
                            {/* Question Header & Verbatim Guidance from the PDF */}
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2.5">
                                <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                                  {q.questionNumber}
                                </span>
                                <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                                  {q.title}
                                </h4>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed font-medium">
                                {q.guidance}
                              </p>
                            </div>

                            {/* Input Area */}
                            <div className="pl-0 sm:pl-8 pt-1 space-y-3">
                              {/* Special Custom Interactive Components */}
                              {q.specialComponent === 'secondary_segment_conditional' ? (
                                <SecondarySegmentConditional
                                  value={answerValue}
                                  onChange={val => handleAnswerChange(q.id, val)}
                                />
                              ) : q.specialComponent === 'brainstorm_ideas' ? (
                                <BrainstormIdeasWidget
                                  value={answerValue}
                                  onChange={val => handleAnswerChange(q.id, val)}
                                />
                              ) : q.specialComponent === 'competitor_pros_cons' ? (
                                <CompetitorProsConsWidget
                                  value={answerValue}
                                  onChange={val => handleAnswerChange(q.id, val)}
                                />
                              ) : q.specialComponent === 'growth_and_costs_split' ? (
                                <GrowthAndCostsWidget
                                  value={answerValue}
                                  onChange={val => handleAnswerChange(q.id, val)}
                                />
                              ) : q.specialComponent === 'team_members' ? (
                                <TeamMembersWidget
                                  value={answerValue}
                                  onChange={val => handleAnswerChange(q.id, val)}
                                />
                              ) : q.specialComponent === 'pitch_marco1_review' ? (
                                <div className="space-y-4">
                                  <Marco1PitchReview project={activeProject} />
                                  <div className="border-t border-slate-100 pt-3">
                                    <span className="text-xs font-bold text-slate-700 block mb-1">
                                      Upload de Apresentação / Deck do Marco 1 (Opcional):
                                    </span>
                                    {uploadedFileInfo || answerValue ? (
                                      <div className="bg-cyan-50/70 border border-cyan-300 p-4 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                                            <Paperclip className="w-5 h-5" />
                                          </div>
                                          <div>
                                            <div className="text-xs font-black text-slate-900">{uploadedFileInfo?.name || answerValue}</div>
                                            <div className="text-[11px] text-slate-500 font-medium">
                                              {uploadedFileInfo?.size || 'Arquivo anexado'} • {uploadedFileInfo?.date || 'Hoje'}
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveFile(q.id)}
                                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <label className="border-2 border-dashed border-slate-300 hover:border-cyan-500 bg-slate-50/50 hover:bg-cyan-50/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                                        <Upload className="w-5 h-5 text-cyan-600 mb-1" />
                                        <span className="text-xs font-bold text-slate-800">Subir Arquivo de Apresentação</span>
                                        <input
                                          type="file"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(q.id, file);
                                          }}
                                        />
                                      </label>
                                    )}
                                  </div>
                                </div>
                              ) : q.specialComponent === 'marco2_review' ? (
                                <div className="space-y-4">
                                  <Marco2Review project={activeProject} />
                                  <div className="border-t border-slate-100 pt-3">
                                    <span className="text-xs font-bold text-slate-700 block mb-1">
                                      Upload de Apresentação / Documento do Marco 2:
                                    </span>
                                    {uploadedFileInfo || answerValue ? (
                                      <div className="bg-purple-50/70 border border-purple-300 p-4 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                                            <Paperclip className="w-5 h-5" />
                                          </div>
                                          <div>
                                            <div className="text-xs font-black text-slate-900">{uploadedFileInfo?.name || answerValue}</div>
                                            <div className="text-[11px] text-slate-500 font-medium">
                                              {uploadedFileInfo?.size || 'Arquivo anexado'} • {uploadedFileInfo?.date || 'Hoje'}
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveFile(q.id)}
                                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <label className="border-2 border-dashed border-slate-300 hover:border-purple-500 bg-slate-50/50 hover:bg-purple-50/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                                        <Upload className="w-5 h-5 text-purple-600 mb-1" />
                                        <span className="text-xs font-bold text-slate-800">Subir Arquivo do Marco 2</span>
                                        <input
                                          type="file"
                                          className="hidden"
                                          onChange={e => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(q.id, file);
                                          }}
                                        />
                                      </label>
                                    )}
                                  </div>
                                </div>
                              ) : q.specialComponent === 'marco3_dossier_report' ? (
                                <div className="space-y-4">
                                  <Marco3DossierReport
                                    project={activeProject}
                                    milestones={currentJourney.milestones}
                                  />
                                </div>
                              ) : q.type === 'long_text' ? (
                                <textarea
                                  rows={3}
                                  value={answerValue}
                                  onChange={e => handleAnswerChange(q.id, e.target.value)}
                                  placeholder={q.placeholder || 'Ex.: Escreva sua resposta com base em dados e fatos observados...'}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all leading-relaxed"
                                />
                              ) : q.type === 'select' ? (
                                <div className="space-y-2.5">
                                  {/* For questions with up to 6 concise options, render interactive choice pills */}
                                  {q.options && q.options.length <= 6 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {q.options.map(opt => {
                                        const isSelected = answerValue.startsWith(opt.value);
                                        return (
                                          <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => handleAnswerChange(q.id, isSelected ? '' : opt.value)}
                                            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer border flex items-center space-x-2 ${
                                              isSelected
                                                ? 'bg-cyan-500 text-slate-950 border-cyan-600 shadow-sm ring-2 ring-cyan-500/20 font-extrabold'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                                            }`}
                                          >
                                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                                            <span>{opt.label}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="relative max-w-xl">
                                      <select
                                        value={answerValue.includes('|||') ? answerValue.split('|||')[0] : answerValue}
                                        onChange={e => handleAnswerChange(q.id, e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none cursor-pointer appearance-none pr-10"
                                      >
                                        <option value="">Selecione uma opção...</option>
                                        {q.options?.map(opt => (
                                          <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                          </option>
                                        ))}
                                      </select>
                                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                  )}

                                  {/* Custom text field if 'Outro' is chosen */}
                                  {(answerValue.toLowerCase().includes('outro')) && (
                                    <div className="pt-2 animate-fadeIn max-w-xl">
                                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                        Especifique o valor personalizado (opcional):
                                      </label>
                                      <input
                                        type="text"
                                        value={answerValue.includes('|||') ? answerValue.split('|||')[1] : ''}
                                        onChange={e => {
                                          const base = answerValue.includes('|||') ? answerValue.split('|||')[0] : answerValue;
                                          handleAnswerChange(q.id, `${base}|||${e.target.value}`);
                                        }}
                                        placeholder="Digite os detalhes..."
                                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-cyan-500"
                                      />
                                    </div>
                                  )}
                                </div>
                              ) : q.type === 'scale_1_5' ? (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    {[1, 2, 3, 4, 5].map((num) => {
                                      const isSelected = answerValue === String(num);
                                      return (
                                        <button
                                          key={num}
                                          type="button"
                                          onClick={() => handleAnswerChange(q.id, String(num))}
                                          className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all cursor-pointer border ${
                                            isSelected
                                              ? 'bg-cyan-500 text-slate-950 border-cyan-600 shadow-md ring-2 ring-cyan-500/20'
                                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                          }`}
                                        >
                                          {num}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="flex justify-between text-[11px] font-bold text-slate-400 px-1">
                                    <span>1 = Nada confiante</span>
                                    <span>5 = Muito confiante</span>
                                  </div>
                                </div>
                              ) : q.type === 'auto_calc_viability' ? (
                                (() => {
                                  const viScore = calculateViabilityIndex(activeProject);
                                  return (
                                    <div className="bg-gradient-to-r from-slate-900 to-cyan-950 p-5 rounded-2xl border border-cyan-500/30 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                                      <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                          <Gauge className="w-5 h-5 text-cyan-400" />
                                          <span className="text-xs uppercase font-black tracking-wider text-cyan-300">
                                            Índice Calculado Automaticamente
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium">
                                          Baseado na média das 9 afirmações de autoavaliação (Escala 1 a 5).
                                        </p>
                                      </div>
                                      <div className="text-center sm:text-right bg-slate-900/80 px-6 py-3 rounded-2xl border border-cyan-400/40">
                                        <div className="text-3xl font-black text-cyan-300">{viScore}%</div>
                                        <span className="text-[10px] uppercase font-bold text-slate-400">
                                          {viScore >= 80 ? 'Alta Viabilidade' : viScore >= 60 ? 'Viabilidade Moderada' : 'Ajustes Necessários'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })()
                              ) : q.type === 'file_upload' ? (
                                <div className="space-y-3">
                                  {uploadedFileInfo || answerValue ? (
                                    <div className="bg-cyan-50/70 border border-cyan-300 p-4 rounded-2xl flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                                          <Paperclip className="w-5 h-5" />
                                        </div>
                                        <div>
                                          <div className="text-xs font-black text-slate-900">{uploadedFileInfo?.name || answerValue}</div>
                                          <div className="text-[11px] text-slate-500 font-medium">
                                            {uploadedFileInfo?.size || 'Arquivo anexado'} • {uploadedFileInfo?.date || 'Hoje'}
                                          </div>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveFile(q.id)}
                                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                        title="Remover arquivo"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <label className="border-2 border-dashed border-slate-300 hover:border-cyan-500 bg-slate-50/50 hover:bg-cyan-50/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                                      <Upload className="w-6 h-6 text-cyan-600 mb-1" />
                                      <span className="text-xs font-black text-slate-800">
                                        SUBIR ARQUIVO
                                      </span>
                                      <span className="text-[11px] text-slate-500 mt-0.5">
                                        Clique ou arraste o arquivo (PDF, PPTX, Imagem, Excel, até 10MB)
                                      </span>
                                      <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) {
                                            handleFileUpload(q.id, file);
                                          }
                                        }}
                                      />
                                    </label>
                                  )}
                                </div>
                              ) : q.type === 'currency' ? (
                                <div className="relative max-w-xs">
                                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                                  <input
                                    type="text"
                                    value={answerValue}
                                    onChange={e => handleAnswerChange(q.id, e.target.value)}
                                    placeholder="0,00"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-none"
                                  />
                                </div>
                              ) : q.type === 'number' ? (
                                <input
                                  type="number"
                                  value={answerValue}
                                  onChange={e => handleAnswerChange(q.id, e.target.value)}
                                  placeholder={q.placeholder || 'Ex.: 15'}
                                  className="max-w-xs w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-none"
                                />
                              ) : q.type === 'date' ? (
                                <input
                                  type="date"
                                  value={answerValue}
                                  onChange={e => handleAnswerChange(q.id, e.target.value)}
                                  className="max-w-xs w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-none"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={answerValue}
                                  onChange={e => handleAnswerChange(q.id, e.target.value)}
                                  placeholder={q.placeholder || 'Ex.: Digite a resposta...'}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-none"
                                />
                              )}

                              {/* Help Guide Drawer with Formulas & Guidance */}
                              {q.helpGuide && (
                                <HelpGuideDrawer 
                                  helpGuide={q.helpGuide} 
                                  onApplyValue={(val) => handleAnswerChange(q.id, val)}
                                />
                              )}
                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>

              {/* Bottom Bar with TWO Return Buttons (As Requested) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setSelectedMilestoneId(null)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-700" />
                  <span>Voltar aos Marcos</span>
                </button>

                <div className="flex items-center space-x-4">
                  <span className="text-xs font-bold text-slate-500">
                    {getMilestoneStats(activeProject, currentSelectedMilestone).answered} de {getMilestoneStats(activeProject, currentSelectedMilestone).total} preenchidas
                  </span>

                  <button
                    onClick={() => setSelectedMilestoneId(null)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-cyan-600 text-white rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Check className="w-4 h-4 text-cyan-400" />
                    <span>Salvar & Concluir Marco</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EXCLUSÃO DE PROJETO (CONFIRMAÇÃO) */}
      {/* ========================================================================= */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">Excluir Projeto</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tem certeza de que deseja excluir este projeto permanentemente? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-3">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProject(projectToDelete)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOVO PROJETO WIZARD */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-black bg-cyan-100 text-cyan-900 px-2.5 py-0.5 rounded-full">
                  Passo {wizardStep} de 2
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {wizardStep === 1 ? '1. Escolha o Tipo de Projeto' : '2. Dados Principais da Empresa (Marco 0)'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: CHOOSE FROM THE 4 JOURNEYS */}
            {wizardStep === 1 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600">
                  Selecione qual das 4 experiências metodológicas melhor descreve o momento do empreendimento:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(SHARP_GUIDED_JOURNEYS) as JourneyId[]).map(jId => {
                    const j = SHARP_GUIDED_JOURNEYS[jId];
                    const isSelected = chosenJourney === jId;

                    return (
                      <button
                        key={jId}
                        type="button"
                        onClick={() => setChosenJourney(jId)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                          isSelected
                            ? 'bg-cyan-50/80 border-cyan-500 ring-2 ring-cyan-500/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {j.badge}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-600" />}
                        </div>

                        <div>
                          <div className="font-extrabold text-xs text-slate-900">{j.shortTitle}</div>
                          <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{j.subtitle}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black rounded-xl flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <span>Avançar para Dados da Empresa</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: COMPANY MAIN DATA FORM */}
            {wizardStep === 2 && (
              <div className="space-y-4 text-xs">
                <p className="text-xs text-slate-600">
                  Preencha as informações fundamentais para inicializar os marcos vinculados:
                </p>

                {/* 1. Nome da empresa */}
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">
                    Nome Provisório do Projeto / Empresa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Ex.: Lumina Odontologia Premium, Veloce Tech..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* 2. Local da empresa */}
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">
                    Local da Empresa (País / Região / Cidade de Partida)
                  </label>
                  <input
                    type="text"
                    value={companyLocation}
                    onChange={e => setCompanyLocation(e.target.value)}
                    placeholder="Ex.: Indaiatuba - SP / Brasil (ou Operação Digital)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* 3. Ramo da empresa */}
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">
                    Indústria / Segmento Principal
                  </label>
                  <input
                    type="text"
                    value={companyBranch}
                    onChange={e => setCompanyBranch(e.target.value)}
                    placeholder="Ex.: Saúde & Clínicas, Varejo, Tecnologia SaaS, Serviços..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* 4. Mercado da empresa */}
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">
                    Domínio ou Área Específica
                  </label>
                  <input
                    type="text"
                    value={companyMarket}
                    onChange={e => setCompanyMarket(e.target.value)}
                    placeholder="Ex.: Consultórios particulares e clientes da classe A e B..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 focus:bg-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Voltar
                  </button>

                  <button
                    onClick={handleCreateProject}
                    disabled={!companyName.trim()}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Criar Projeto & Abrir Marcos
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
