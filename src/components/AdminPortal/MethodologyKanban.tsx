import React, { useState, useEffect } from 'react';
import {
  Layers, CheckCircle2, Clock, ChevronRight, Plus, Users,
  Building2, Sparkles, AlertCircle, ArrowRight, Filter, Search, Tag, FileText,
  CheckSquare, Square, Eye, Edit3, Trash2, Calendar, UserCheck, Check,
  Sliders, ChevronDown, ChevronUp, BarChart3, Target, Compass, Award, ExternalLink,
  Briefcase, TrendingUp, ShieldCheck, CheckCheck, ListChecks, HelpCircle, User,
  Archive, FolderArchive, RotateCcw, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  PillarId,
  MethodologyTask,
  ProductNoteLog,
  ProductPackage,
  StageDefinition,
  PillarDefinition,
  ClientProductEnrollment,
  UnifiedClient,
  OPERATIONAL_STATUS_OPTIONS,
  DEFAULT_STAFF_MEMBERS,
  SHARP_METHODOLOGY_PILLARS,
  getUnifiedClients,
  saveUnifiedClients,
  createUnifiedEnrollment
} from '../../data/methodologyData';

export type MethodologyClient = UnifiedClient;

export const MethodologyKanban: React.FC = () => {
  const { clientAccounts, currentUser, staffMembers } = useApp();

  // Unified persistent clients from shared methodology / directory storage
  const [clients, setClients] = useState<UnifiedClient[]>(() => getUnifiedClients());

  // Listen to external/shared unified client changes
  useEffect(() => {
    const handleSync = () => {
      setClients(getUnifiedClients());
    };
    window.addEventListener('sharp_unified_clients_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('sharp_unified_clients_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Update clients helper that automatically persists and syncs with Directory
  const updateClients = (updater: (prev: UnifiedClient[]) => UnifiedClient[]) => {
    setClients(prev => {
      const next = updater(prev);
      saveUnifiedClients(next);
      return next;
    });
  };

  // Selected Client for 360° view
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    const initialList = getUnifiedClients();
    return initialList[0]?.id || '';
  });

  // Keep selectedClientId in sync
  useEffect(() => {
    if (clients.length > 0 && (!selectedClientId || !clients.some(c => c.id === selectedClientId))) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  // Modals
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [targetClientForProduct, setTargetClientForProduct] = useState<string>('');

  // Confirmation modal for deleting an active product enrollment
  const [productToDelete, setProductToDelete] = useState<{
    clientId: string;
    enrollmentId: string;
    packageName: string;
    companyName: string;
  } | null>(null);

  // Form states for New Client Modal
  const [newClientName, setNewClientName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientSegment, setNewClientSegment] = useState('');
  const [newClientSelectedProducts, setNewClientSelectedProducts] = useState<{ pillarId: PillarId; packageId: string }[]>([
    { pillarId: 'sharp_brand', packageId: 'brand_strategy' }
  ]);

  // Form states for Add Product Modal
  const [selectedPillarToAdd, setSelectedPillarToAdd] = useState<PillarId>('sharp_insights');
  const [selectedPackageToAdd, setSelectedPackageToAdd] = useState<string>('insights_essential');

  // Filter Tabs: 'ativos' | 'concluidos' | 'arquivados'
  const [activeTab, setActiveTab] = useState<'ativos' | 'concluidos' | 'arquivados'>('ativos');

  // Custom task inputs per enrollment
  const [customTaskText, setCustomTaskText] = useState<{ [enrollmentId: string]: string }>({});

  // Status menu popover state in header
  const [openStatusMenuEnrollmentId, setOpenStatusMenuEnrollmentId] = useState<string | null>(null);

  // Responsible Staff menu popover state in header
  const [openResponsibleMenuEnrollmentId, setOpenResponsibleMenuEnrollmentId] = useState<string | null>(null);

  // Note Log input state per enrollment
  const [newNoteText, setNewNoteText] = useState<{ [enrollmentId: string]: string }>({});

  // Action Modal for Status Change (Concluir / Arquivar / Reativar) requiring mandatory note
  const [statusActionModal, setStatusActionModal] = useState<{
    type: 'concluir' | 'arquivar' | 'reativar';
    clientId: string;
    enrollmentId: string;
    packageName: string;
    companyName: string;
  } | null>(null);
  const [actionModalAuthor, setActionModalAuthor] = useState<string>('');
  const [actionModalNote, setActionModalNote] = useState<string>('');
  const [actionModalError, setActionModalError] = useState<string | null>(null);

  // Combined available staff names for selection
  const availableStaffNames = React.useMemo(() => {
    const fromContext = (staffMembers || []).map(s => s.name);
    return Array.from(new Set([...DEFAULT_STAFF_MEMBERS, ...fromContext]));
  }, [staffMembers]);

  // Active selected client object
  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0] || null;

  // Dropdown state for client selector
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Global counts for tabs
  const totalActiveProducts = clients.reduce((acc, c) => acc + (c.enrolledProducts || []).filter(p => (p.lifecycleStatus || 'ativo') === 'ativo').length, 0);
  const totalCompletedProducts = clients.reduce((acc, c) => acc + (c.enrolledProducts || []).filter(p => p.lifecycleStatus === 'concluido').length, 0);
  const totalArchivedProducts = clients.reduce((acc, c) => acc + (c.enrolledProducts || []).filter(p => p.lifecycleStatus === 'arquivado').length, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsClientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle Task Completion
  const handleToggleTask = (clientId: string, enrollmentId: string, taskId: string) => {
    updateClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        enrolledProducts: (c.enrolledProducts || []).map(enr => {
          if (enr.id !== enrollmentId) return enr;
          return {
            ...enr,
            tasks: enr.tasks.map(t => {
              if (t.id !== taskId) return t;
              const nextVal = !t.completed;
              return {
                ...t,
                completed: nextVal,
                completedAt: nextVal ? new Date().toISOString().split('T')[0] : undefined,
                completedBy: nextVal ? (currentUser?.name || 'Time Sharp') : undefined
              };
            })
          };
        })
      };
    }));
  };

  // Change current stage of an enrollment
  const handleChangeStage = (clientId: string, enrollmentId: string, newStageId: string) => {
    updateClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        enrolledProducts: (c.enrolledProducts || []).map(enr => {
          if (enr.id !== enrollmentId) return enr;
          return {
            ...enr,
            currentStageId: newStageId
          };
        })
      };
    }));
  };

  // Direct Assign Responsible Staff for an enrollment
  const handleSelectResponsibleStaff = (clientId: string, enrollmentId: string, staffName: string) => {
    const finalName = staffName.trim();
    if (!finalName) return;

    updateClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        enrolledProducts: (c.enrolledProducts || []).map(enr => {
          if (enr.id !== enrollmentId) return enr;
          return {
            ...enr,
            responsibleStaff: finalName
          };
        })
      };
    }));
    setOpenResponsibleMenuEnrollmentId(null);
  };

  // Select Operational Status / Motivo for an enrollment
  const handleSelectStatusReason = (clientId: string, enrollmentId: string, statusReason: string) => {
    // If status is 'Concluído', automatically transition lifecycle
    if (statusReason === 'Concluído') {
      const enrollment = selectedClient?.enrolledProducts?.find(e => e.id === enrollmentId);
      handleOpenStatusActionModal(
        'concluir',
        selectedClient?.id || clientId,
        enrollmentId,
        enrollment?.packageName || 'Produto',
        selectedClient?.companyName || selectedClient?.clientName || 'Cliente'
      );
      setOpenStatusMenuEnrollmentId(null);
      return;
    }

    updateClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        enrolledProducts: (c.enrolledProducts || []).map(enr => {
          if (enr.id !== enrollmentId) return enr;
          return {
            ...enr,
            statusReason
          };
        })
      };
    }));
    setOpenStatusMenuEnrollmentId(null);
  };

  // Open Mandatory Note Modal for Concluir / Arquivar / Reativar
  const handleOpenStatusActionModal = (
    type: 'concluir' | 'arquivar' | 'reativar',
    clientId: string,
    enrollmentId: string,
    packageName: string,
    companyName: string,
    defaultAuthor?: string
  ) => {
    setStatusActionModal({
      type,
      clientId,
      enrollmentId,
      packageName,
      companyName
    });
    setActionModalAuthor(defaultAuthor || currentUser?.name || 'Raphael (Estrategista Chefe)');
    setActionModalNote('');
    setActionModalError(null);
    setOpenStatusMenuEnrollmentId(null);
  };

  // Confirm Status Action Submit (saves mandatory note and updates lifecycle)
  const handleConfirmStatusAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusActionModal) return;

    const note = actionModalNote.trim();
    if (!note && (statusActionModal.type === 'concluir' || statusActionModal.type === 'arquivar')) {
      setActionModalError('O registro da observação é obrigatório para concluir ou arquivar este produto.');
      return;
    }

    const { clientId, enrollmentId, type } = statusActionModal;
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const author = currentUser?.name || actionModalAuthor.trim() || 'Time Sharp';

    const prefix = type === 'concluir'
      ? '🏆 [STATUS: CONCLUÍDO]'
      : type === 'arquivar'
      ? '📦 [STATUS: ARQUIVADO]'
      : '🔄 [STATUS: REATIVADO]';

    const newLog: ProductNoteLog = {
      id: `log-${Date.now()}`,
      author,
      date: dateStr,
      time: timeStr,
      text: `${prefix} ${note || 'Transição de status executada.'}`
    };

    const nextLifecycleStatus: 'ativo' | 'concluido' | 'arquivado' =
      type === 'concluir' ? 'concluido' : (type === 'arquivar' ? 'arquivado' : 'ativo');

    const nextStatusReason =
      type === 'concluir' ? 'Concluído' : (type === 'arquivar' ? 'Arquivado' : 'Em Andamento Normal');

    updateClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        enrolledProducts: (c.enrolledProducts || []).map(enr => {
          if (enr.id !== enrollmentId) return enr;
          const currentLogs = enr.noteLogs || (enr.notes ? [{
            id: `legacy-${enr.id}`,
            author: enr.responsibleStaff || 'Time Sharp',
            date: new Date(enr.startDate).toLocaleDateString('pt-BR'),
            time: '10:00',
            text: enr.notes
          }] : []);
          return {
            ...enr,
            lifecycleStatus: nextLifecycleStatus,
            statusReason: nextStatusReason,
            noteLogs: [newLog, ...currentLogs]
          };
        })
      };
    }));

    setStatusActionModal(null);
    setActionModalNote('');
    setActionModalError(null);
  };

  // Add structured Note Log with Author automatically assigned based on current user
  const handleAddNoteLog = (clientId: string, enrollmentId: string) => {
    const text = newNoteText[enrollmentId]?.trim();
    if (!text) return;

    const targetEnrollment = selectedClient?.enrolledProducts?.find(p => p.id === enrollmentId);
    const author = currentUser?.name || targetEnrollment?.responsibleStaff || 'Raphael (Estrategista Chefe)';
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newLog: ProductNoteLog = {
      id: `log-${Date.now()}`,
      author,
      date: dateStr,
      time: timeStr,
      text
    };

    updateClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        enrolledProducts: (c.enrolledProducts || []).map(enr => {
          if (enr.id !== enrollmentId) return enr;
          const currentLogs = enr.noteLogs || (enr.notes ? [{
            id: `legacy-${enr.id}`,
            author: enr.responsibleStaff || 'Time Sharp',
            date: new Date(enr.startDate).toLocaleDateString('pt-BR'),
            time: '10:00',
            text: enr.notes
          }] : []);
          return {
            ...enr,
            noteLogs: [newLog, ...currentLogs]
          };
        })
      };
    }));

    setNewNoteText(prev => ({ ...prev, [enrollmentId]: '' }));
  };

  // Delete specific note log
  const handleDeleteNoteLog = (clientId: string, enrollmentId: string, logId: string) => {
    updateClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        enrolledProducts: (c.enrolledProducts || []).map(enr => {
          if (enr.id !== enrollmentId) return enr;
          return {
            ...enr,
            noteLogs: (enr.noteLogs || []).filter(l => l.id !== logId)
          };
        })
      };
    }));
  };

  // Add Custom Task
  const handleAddCustomTask = (clientId: string, enrollmentId: string) => {
    const text = customTaskText[enrollmentId]?.trim();
    if (!text) return;

    updateClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        enrolledProducts: (c.enrolledProducts || []).map(enr => {
          if (enr.id !== enrollmentId) return enr;
          return {
            ...enr,
            tasks: [
              ...enr.tasks,
              {
                id: `custom-${Date.now()}`,
                text,
                completed: false
              }
            ]
          };
        })
      };
    }));

    setCustomTaskText(prev => ({ ...prev, [enrollmentId]: '' }));
  };

  // Confirm and delete product from client
  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;
    const { clientId, enrollmentId, packageName } = productToDelete;
    updateClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      const remainingEnrolled = (c.enrolledProducts || []).filter(enr => enr.id !== enrollmentId);
      const remainingContracted = (c.contractedProducts || []).filter(p => p !== packageName);
      return {
        ...c,
        contractedProducts: remainingContracted,
        enrolledProducts: remainingEnrolled
      };
    }));
    setProductToDelete(null);
  };

  // Create Client Submit
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newCompanyName.trim()) return;

    const productsToEnroll = newClientSelectedProducts.length > 0
      ? newClientSelectedProducts
      : [{ pillarId: 'sharp_brand' as PillarId, packageId: 'brand_strategy' }];

    const enrollments: ClientProductEnrollment[] = productsToEnroll.map(p => {
      const staff = p.pillarId === 'sharp_brand' ? 'Luan (Líder de Arte & Design)' : 'Raphael (Estrategista Chefe)';
      return createUnifiedEnrollment(p.pillarId, p.packageId, staff);
    });

    const contractedProductNames = enrollments.map(p => p.packageName);

    const newClient: UnifiedClient = {
      id: `cli-${Date.now()}`,
      name: newClientName.trim(),
      clientName: newClientName.trim(),
      companyName: newCompanyName.trim(),
      email: newClientEmail.trim() || `${newClientName.toLowerCase().replace(/\s+/g, '')}@empresa.com.br`,
      phone: newClientPhone.trim() || '(19) 9 9999-9999',
      segment: newClientSegment.trim() || 'Serviços & Negócios',
      status: 'Ativo',
      contractedProducts: contractedProductNames,
      nextMeetingDate: 'A agendar',
      meetingTopic: 'Reunião Inicial de Kickoff & Alinhamento',
      approvedMaterials: 0,
      rejectedMaterials: 0,
      pendingMaterials: enrollments.length,
      sharpNotes: 'Cliente cadastrado na Metodologia Sharp.',
      createdAt: new Date().toISOString().split('T')[0],
      enrolledProducts: enrollments
    };

    updateClients(prev => [newClient, ...prev]);
    setSelectedClientId(newClient.id);
    setIsAddClientModalOpen(false);

    setNewClientName('');
    setNewCompanyName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientSegment('');
    setNewClientSelectedProducts([{ pillarId: 'sharp_brand', packageId: 'brand_strategy' }]);
  };

  // Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetClientForProduct) return;

    const staff = selectedPillarToAdd === 'sharp_brand' ? 'Luan (Líder de Arte & Design)' : 'Raphael (Estrategista Chefe)';
    const newEnrollment = createUnifiedEnrollment(selectedPillarToAdd, selectedPackageToAdd, staff);

    updateClients(prev => prev.map(c => {
      if (c.id !== targetClientForProduct) return c;
      const existingContracted = c.contractedProducts || c.enrolledProducts.map(p => p.packageName);
      return {
        ...c,
        contractedProducts: Array.from(new Set([...existingContracted, newEnrollment.packageName])),
        enrolledProducts: [...(c.enrolledProducts || []), newEnrollment]
      };
    }));

    setIsAddProductModalOpen(false);
  };

  // Filtered products for current selected client based on activeTab
  const visibleProducts = (selectedClient?.enrolledProducts || []).filter(p => {
    const status = p.lifecycleStatus || 'ativo';
    if (activeTab === 'ativos') return status === 'ativo';
    if (activeTab === 'concluidos') return status === 'concluido';
    if (activeTab === 'arquivados') return status === 'arquivado';
    return true;
  });

  // Filtered clients for dropdown search
  const filteredClientsForDropdown = clients.filter(c => {
    const q = clientSearchQuery.toLowerCase();
    const name = (c.clientName || c.name || '').toLowerCase();
    const comp = (c.companyName || '').toLowerCase();
    return name.includes(q) || comp.includes(q);
  });

  return (
    <div id="methodology-kanban-root" className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* ==================================================== */}
      {/* CABEÇALHO DA SEÇÃO DE GESTÃO OPERACIONAL             */}
      {/* ==================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Esteira Operacional 360°
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">
                Metodologia Oficial Sharp Intelligence
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Gestão Operacional da Metodologia Sharp
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Acompanhamento em tempo real das 4 etapas de cada pilar contratado pelo cliente.
            </p>
          </div>

          {/* BOTÃO CADASTRAR CLIENTE NA METODOLOGIA */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddClientModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Cliente na Metodologia</span>
            </button>
          </div>
        </div>

        {/* ==================================================== */}
        {/* ABAS OPERACIONAIS: ATIVOS | CONCLUÍDOS | ARQUIVADOS   */}
        {/* ==================================================== */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('ativos')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'ativos'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Ativos</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'ativos' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {totalActiveProducts}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('concluidos')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'concluidos'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Concluídos</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'concluidos' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {totalCompletedProducts}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('arquivados')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'arquivados'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FolderArchive className="w-3.5 h-3.5 text-slate-500" />
              <span>Arquivados</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'arquivados' ? 'bg-slate-200 text-slate-800' : 'bg-slate-200/60 text-slate-500'
              }`}>
                {totalArchivedProducts}
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Mostrando produtos da categoria: <strong className="text-slate-800 capitalize">{activeTab}</strong>
          </div>
        </div>

        {/* ==================================================== */}
        {/* SELEÇÃO DO CLIENTE PARA GESTÃO 360°                  */}
        {/* ==================================================== */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Cliente Selecionado para Acompanhamento:
              </div>
              <div className="text-base font-bold text-slate-900">
                {selectedClient ? (selectedClient.companyName || selectedClient.clientName) : 'Nenhum cliente selecionado'}
              </div>
            </div>
          </div>

          {/* DROPDOWN CUSTOMIZADO DE CLIENTES */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsClientDropdownOpen(prev => !prev)}
              className="w-full md:w-80 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between shadow-xs hover:border-slate-400 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">
                  {selectedClient ? `${selectedClient.companyName || selectedClient.clientName}` : 'Selecionar Cliente...'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isClientDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isClientDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 space-y-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 pt-1 pb-2 border-b border-slate-100">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={clientSearchQuery}
                      onChange={(e) => setClientSearchQuery(e.target.value)}
                      placeholder="Buscar por cliente ou empresa..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredClientsForDropdown.length === 0 ? (
                    <div className="p-3 text-center text-xs text-slate-400">
                      Nenhum cliente encontrado.
                    </div>
                  ) : (
                    filteredClientsForDropdown.map((client) => {
                      const isSelected = selectedClient?.id === client.id;
                      const productCount = (client.enrolledProducts || []).length;
                      return (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => {
                            setSelectedClientId(client.id);
                            setIsClientDropdownOpen(false);
                            setClientSearchQuery('');
                          }}
                          className={`w-full p-2.5 rounded-xl text-left transition-colors flex items-center justify-between ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="font-bold text-xs truncate">
                              {client.companyName || client.clientName || client.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {client.clientName || client.name} • {client.segment}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-semibold text-slate-600">
                              {productCount} {productCount === 1 ? 'prod' : 'prods'}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsClientDropdownOpen(false);
                      setIsAddClientModalOpen(true);
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Cadastrar Novo Cliente</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* CONTEÚDO PRINCIPAL: PRODUTOS CONTRATADOS DO CLIENTE  */}
      {/* ==================================================== */}
      {selectedClient && (
        <div className="space-y-6">
          {/* BARRA SUPERIOR DO CLIENTE ATIVO */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedClient.segment}
                </span>
                <span className="text-xs text-slate-400">
                  Cliente desde: {new Date(selectedClient.createdAt || '2026-08-01').toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                {selectedClient.companyName || selectedClient.clientName}
              </h2>
              <div className="text-xs text-slate-300 mt-1 flex items-center gap-4 flex-wrap">
                <span>Contato: <strong>{selectedClient.clientName || selectedClient.name}</strong></span>
                <span>E-mail: <strong>{selectedClient.email}</strong></span>
                <span>Tel: <strong>{selectedClient.phone}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setTargetClientForProduct(selectedClient.id);
                  setIsAddProductModalOpen(true);
                }}
                className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Adicionar Produto à Esteira</span>
              </button>
            </div>
          </div>

          {/* LISTA DE PRODUTOS OU MENSAGEM VAZIA */}
          {visibleProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Archive className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Nenhum produto {activeTab === 'ativos' ? 'ativo' : activeTab === 'concluidos' ? 'concluído' : 'arquivado'} para este cliente
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  {activeTab === 'ativos'
                    ? 'Adicione um produto contratado a este cliente para iniciar o acompanhamento operacional das etapas e tarefas.'
                    : `Não há produtos com status de ${activeTab} registrados no histórico.`}
                </p>
              </div>
              {activeTab === 'ativos' && (
                <button
                  type="button"
                  onClick={() => {
                    setTargetClientForProduct(selectedClient.id);
                    setIsAddProductModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Primeiro Produto</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {visibleProducts.map((enrollment) => {
                const pillarDef = SHARP_METHODOLOGY_PILLARS.find(p => p.id === enrollment.pillarId)!;
                const completedCount = enrollment.tasks.filter(t => t.completed).length;
                const totalCount = enrollment.tasks.length;
                const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                const currentReason = enrollment.statusReason || (enrollment.lifecycleStatus === 'concluido' ? 'Concluído' : enrollment.lifecycleStatus === 'arquivado' ? 'Arquivado' : 'Em Andamento Normal');
                const reasonDef = OPERATIONAL_STATUS_OPTIONS.find(o => o.id === currentReason) || OPERATIONAL_STATUS_OPTIONS[0];
                const isStatusOpen = openStatusMenuEnrollmentId === enrollment.id;
                const isResponsibleOpen = openResponsibleMenuEnrollmentId === enrollment.id;

                return (
                  <div
                    key={enrollment.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                  >
                    {/* ==================================================== */}
                    {/* CABEÇALHO REORGANIZADO DO PRODUTO (2 LINHAS)         */}
                    {/* ==================================================== */}
                    <div className={`p-5 border-b border-slate-200 ${pillarDef.colorScheme.bgLight} space-y-3.5`}>
                      {/* LINHA 1: TIPO DE PRODUTO (ESQUERDA) & DATA DE INÍCIO (DIREITA) */}
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${pillarDef.colorScheme.badge}`}>
                            {pillarDef.name}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900">{enrollment.packageName}</h3>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white/90 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Início: {new Date(enrollment.startDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>

                      {/* LINHA 2: STATUS (ESQUERDA), RESPONSÁVEL CLICÁVEL (MEIO), ETAPA & AÇÕES (EXCLUIR / ARQUIVAR / CONCLUIR) */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-slate-200/60">
                        {/* BLOCO ESQUERDA: STATUS OPERACIONAL E RESPONSÁVEL */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {/* 1. SELETOR DE STATUS (CLICÁVEL DIRETO COM OPÇÕES SHARP) */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenStatusMenuEnrollmentId(isStatusOpen ? null : enrollment.id);
                                setOpenResponsibleMenuEnrollmentId(null);
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all hover:shadow-xs active:scale-95 cursor-pointer shadow-2xs ${reasonDef.badgeClass}`}
                              title="Clique para alterar o status operacional deste produto"
                            >
                              <span>{reasonDef.emoji}</span>
                              <span>{reasonDef.label}</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStatusOpen ? 'rotate-180 opacity-100' : 'opacity-60'}`} />
                            </button>

                            {isStatusOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-30"
                                  onClick={() => setOpenStatusMenuEnrollmentId(null)}
                                />
                                <div className="absolute left-0 top-full mt-1.5 z-40 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Status Operacional:
                                  </div>
                                  {OPERATIONAL_STATUS_OPTIONS.map((opt) => {
                                    const isSelected = currentReason === opt.id;
                                    return (
                                      <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => handleSelectStatusReason(selectedClient.id, enrollment.id, opt.id)}
                                        className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-colors ${
                                          isSelected
                                            ? `${opt.badgeClass} font-bold`
                                            : 'hover:bg-slate-50 text-slate-700'
                                        }`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm">{opt.emoji}</span>
                                          <span>{opt.label}</span>
                                        </div>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>

                          {/* 2. SELETOR DE RESPONSÁVEL (CLICÁVEL DIRETO COM USUÁRIOS SHARP) */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenResponsibleMenuEnrollmentId(isResponsibleOpen ? null : enrollment.id);
                                setOpenStatusMenuEnrollmentId(null);
                              }}
                              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-all hover:shadow-xs active:scale-95 cursor-pointer shadow-2xs"
                              title="Clique para selecionar o membro responsável"
                            >
                              <div className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                                {enrollment.responsibleStaff.charAt(0)}
                              </div>
                              <span className="truncate max-w-[150px]">{enrollment.responsibleStaff}</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isResponsibleOpen ? 'rotate-180 opacity-100' : 'opacity-60 text-slate-400'}`} />
                            </button>

                            {isResponsibleOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-30"
                                  onClick={() => setOpenResponsibleMenuEnrollmentId(null)}
                                />
                                <div className="absolute left-0 top-full mt-1.5 z-40 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-100">
                                  <div className="px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Selecionar Responsável:
                                  </div>
                                  <div className="space-y-1 max-h-48 overflow-y-auto">
                                    {availableStaffNames.map((name, sIdx) => {
                                      const isSelected = enrollment.responsibleStaff === name;
                                      return (
                                        <button
                                          key={sIdx}
                                          type="button"
                                          onClick={() => handleSelectResponsibleStaff(selectedClient.id, enrollment.id, name)}
                                          className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-colors ${
                                            isSelected
                                              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                                              : 'hover:bg-slate-50 text-slate-700'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-slate-700 text-white text-[9px] font-bold flex items-center justify-center">
                                              {name.charAt(0)}
                                            </div>
                                            <span className="truncate">{name}</span>
                                          </div>
                                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* BLOCO DIREITA: ETAPA ATUAL E AÇÕES (EXCLUIR / ARQUIVAR / CONCLUIR) */}
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          {/* SELETOR DE ETAPA ATUAL */}
                          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                            <span className="text-[11px] font-semibold text-slate-500">Etapa:</span>
                            <select
                              value={enrollment.currentStageId}
                              onChange={(e) => handleChangeStage(selectedClient.id, enrollment.id, e.target.value)}
                              className="text-xs font-bold text-slate-900 bg-transparent focus:outline-none cursor-pointer"
                            >
                              {pillarDef.stages.map((stg, sIdx) => (
                                <option key={stg.id} value={stg.id}>
                                  Etapa {sIdx + 1}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* BOTÃO CONCLUIR (SE ATIVO) */}
                          {enrollment.lifecycleStatus !== 'concluido' && (
                            <button
                              type="button"
                              onClick={() => handleOpenStatusActionModal(
                                'concluir',
                                selectedClient.id,
                                enrollment.id,
                                enrollment.packageName,
                                selectedClient.companyName || selectedClient.clientName
                              )}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Concluir este produto com observação obrigatória"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Concluir</span>
                            </button>
                          )}

                          {/* BOTÃO ARQUIVAR / REATIVAR */}
                          {enrollment.lifecycleStatus === 'arquivado' ? (
                            <button
                              type="button"
                              onClick={() => handleOpenStatusActionModal(
                                'reativar',
                                selectedClient.id,
                                enrollment.id,
                                enrollment.packageName,
                                selectedClient.companyName || selectedClient.clientName
                              )}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Reativar produto na esteira"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reativar</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenStatusActionModal(
                                'arquivar',
                                selectedClient.id,
                                enrollment.id,
                                enrollment.packageName,
                                selectedClient.companyName || selectedClient.clientName
                              )}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Arquivar este produto"
                            >
                              <FolderArchive className="w-3.5 h-3.5" />
                              <span>Arquivar</span>
                            </button>
                          )}

                          {/* BOTÃO EXCLUIR PRODUTO */}
                          <button
                            type="button"
                            onClick={() => setProductToDelete({
                              clientId: selectedClient.id,
                              enrollmentId: enrollment.id,
                              packageName: enrollment.packageName,
                              companyName: selectedClient.companyName || selectedClient.clientName
                            })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Excluir produto da esteira"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CORPO DO PRODUTO: ETAPAS & PROGRESSO */}
                    <div className="p-6 space-y-6">
                      {/* BARRA DE PROGRESSO GERAL DO PRODUTO */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-700">Progresso dos Entregáveis da Metodologia</span>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {completedCount} de {totalCount} concluídos ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full ${pillarDef.colorScheme.accentBg} transition-all duration-500 rounded-full`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* 4 ETAPAS DA METODOLOGIA SHARP */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {pillarDef.stages.map((stage, sIdx) => {
                          const isCurrent = stage.id === enrollment.currentStageId;
                          const currentStageIdx = pillarDef.stages.findIndex(s => s.id === enrollment.currentStageId);
                          const isPast = sIdx < currentStageIdx;

                          return (
                            <div
                              key={stage.id}
                              onClick={() => handleChangeStage(selectedClient.id, enrollment.id, stage.id)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                                isCurrent
                                  ? `${pillarDef.colorScheme.borderActive} bg-white shadow-sm ring-2`
                                  : isPast
                                  ? 'border-emerald-200 bg-emerald-50/40 text-slate-700'
                                  : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-white hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                                  isCurrent ? 'text-emerald-700' : isPast ? 'text-emerald-600' : 'text-slate-400'
                                }`}>
                                  Etapa {sIdx + 1}
                                </span>
                                {isPast ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : isCurrent ? (
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                ) : null}
                              </div>
                              <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-snug">
                                {stage.title.replace(/^Etapa \d+:\s*/, '')}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                {stage.subtitle}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* LISTA DE TAREFAS / ENTREGÁVEIS */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                            <ListChecks className="w-4 h-4 text-emerald-600" />
                            <span>Checklist de Tarefas & Entregáveis Oficiais</span>
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Clique na caixa para validar cada entrega
                          </span>
                        </div>

                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {enrollment.tasks.map((task) => (
                            <div
                              key={task.id}
                              onClick={() => handleToggleTask(selectedClient.id, enrollment.id, task.id)}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                                task.completed
                                  ? 'bg-slate-50 border-slate-200/80'
                                  : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20'
                              }`}
                            >
                              <div className="pt-0.5 shrink-0">
                                {task.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-300 hover:text-emerald-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`text-xs font-semibold leading-relaxed ${task.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-800'}`}>
                                  {task.text}
                                </p>
                                {task.completed && task.completedAt && (
                                  <span className="text-[10px] text-slate-400 block mt-0.5">
                                    Concluído em {new Date(task.completedAt).toLocaleDateString('pt-BR')} • {task.completedBy || 'Time Sharp'}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* INPUT PARA ADICIONAR TAREFA PERSONALIZADA */}
                        <div className="pt-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={customTaskText[enrollment.id] || ''}
                            onChange={(e) => setCustomTaskText(prev => ({ ...prev, [enrollment.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddCustomTask(selectedClient.id, enrollment.id);
                            }}
                            placeholder="Adicionar tarefa ou entregável personalizado..."
                            className="flex-1 text-xs border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddCustomTask(selectedClient.id, enrollment.id)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Inserir
                          </button>
                        </div>
                      </div>

                      {/* ==================================================== */}
                      {/* REGISTRO DE OBSERVAÇÕES (AUTOR AUTOMÁTICO)           */}
                      {/* ==================================================== */}
                      <div className="mt-6 pt-5 border-t border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <h5 className="font-bold text-xs text-slate-800">
                              Registro de Observações & Histórico Operacional
                            </h5>
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              {(() => {
                                const logs = enrollment.noteLogs || (enrollment.notes ? [1] : []);
                                return `${logs.length} ${logs.length === 1 ? 'registro' : 'registros'}`;
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* FORMULÁRIO COM CAMPO DE COMENTÁRIO E BOTÃO REGISTRAR OBSERVAÇÃO */}
                        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200 space-y-3">
                          <div>
                            <textarea
                              rows={2}
                              value={newNoteText[enrollment.id] || ''}
                              onChange={(e) => setNewNoteText(prev => ({ ...prev, [enrollment.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                  handleAddNoteLog(selectedClient.id, enrollment.id);
                                }
                              }}
                              placeholder="Digite a observação (ex: cliente solicitou pausa até segunda-feira, insumos recebidos pelo Drive, alinhamento de prazo...)"
                              className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y transition-all leading-relaxed"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] text-slate-400">
                              Autor atribuído automaticamente: <strong>{currentUser?.name || enrollment.responsibleStaff || 'Time Sharp'}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddNoteLog(selectedClient.id, enrollment.id)}
                              disabled={!(newNoteText[enrollment.id]?.trim())}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Registrar Observação</span>
                            </button>
                          </div>
                        </div>

                        {/* LISTA DE REGISTROS ANTERIORES */}
                        {(() => {
                          const rawLogs = enrollment.noteLogs;
                          const logsToRender: ProductNoteLog[] = rawLogs && rawLogs.length > 0
                            ? rawLogs
                            : (enrollment.notes ? [{
                                id: `legacy-${enrollment.id}`,
                                author: enrollment.responsibleStaff || 'Time Sharp',
                                date: new Date(enrollment.startDate).toLocaleDateString('pt-BR'),
                                time: '10:00',
                                text: enrollment.notes
                              }] : []);

                          if (logsToRender.length === 0) {
                            return (
                              <div className="text-center py-4 text-xs text-slate-400 italic bg-white rounded-xl border border-dashed border-slate-200">
                                Nenhuma observação registrada até o momento.
                              </div>
                            );
                          }

                          return (
                            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                              {logsToRender.map((log) => (
                                <div
                                  key={log.id}
                                  className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all space-y-1.5"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                                        <UserCheck className="w-3 h-3 text-emerald-600" />
                                        {log.author}
                                      </span>
                                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        {log.date}
                                      </span>
                                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        {log.time}
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteNoteLog(selectedClient.id, enrollment.id, log.id)}
                                      title="Excluir este registro"
                                      className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <p className="text-xs text-slate-700 leading-relaxed pl-1 whitespace-pre-wrap">
                                    {log.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: CADASTRAR CLIENTE NA METODOLOGIA              */}
      {/* ==================================================== */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Cadastrar Cliente na Metodologia</h3>
                  <p className="text-xs text-slate-500">Adicione um novo cliente e ative seus produtos contratados</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddClientModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome da Empresa *</label>
                  <input
                    type="text"
                    required
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Ex: Alfa Empreendimentos"
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Contato/Decisor *</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ex: Roberto Silveira"
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={newClientEmail}
                    onChange={(e) => setNewClientEmail(e.target.value)}
                    placeholder="contato@empresa.com.br"
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="(19) 9 9999-9999"
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Segmento</label>
                  <input
                    type="text"
                    value={newClientSegment}
                    onChange={(e) => setNewClientSegment(e.target.value)}
                    placeholder="Ex: Imobiliário, Saúde"
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* SELEÇÃO DOS PRODUTOS A SEREM ATIVADOS */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Selecione o Produto Inicial a Ativar:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {SHARP_METHODOLOGY_PILLARS.map((pillar) =>
                    pillar.packages.map((pkg) => {
                      const isSelected = newClientSelectedProducts.some(
                        p => p.pillarId === pillar.id && p.packageId === pkg.id
                      );
                      return (
                        <div
                          key={`${pillar.id}-${pkg.id}`}
                          onClick={() => {
                            setNewClientSelectedProducts([{ pillarId: pillar.id, packageId: pkg.id }]);
                          }}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? `${pillar.colorScheme.border} ${pillar.colorScheme.bgLight} font-bold ring-2 ring-emerald-500/20`
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[10px] text-slate-500">{pillar.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <div className="font-semibold text-slate-900">{pkg.name}</div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Salvar e Iniciar Metodologia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADICIONAR PRODUTO À ESTEIRA                   */}
      {/* ==================================================== */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Adicionar Produto à Esteira</h3>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilar Sharp</label>
                <select
                  value={selectedPillarToAdd}
                  onChange={(e) => {
                    const nextPillar = e.target.value as PillarId;
                    setSelectedPillarToAdd(nextPillar);
                    const pDef = SHARP_METHODOLOGY_PILLARS.find(p => p.id === nextPillar)!;
                    setSelectedPackageToAdd(pDef.packages[0].id);
                  }}
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {SHARP_METHODOLOGY_PILLARS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pacote / Produto Contratado</label>
                <select
                  value={selectedPackageToAdd}
                  onChange={(e) => setSelectedPackageToAdd(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {SHARP_METHODOLOGY_PILLARS.find(p => p.id === selectedPillarToAdd)?.packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Ativar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: AÇÃO DE STATUS COM OBSERVAÇÃO OBRIGATÓRIA     */}
      {/* ==================================================== */}
      {statusActionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                {statusActionModal.type === 'concluir' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                {statusActionModal.type === 'arquivar' && <FolderArchive className="w-5 h-5 text-slate-600" />}
                {statusActionModal.type === 'reativar' && <RotateCcw className="w-5 h-5 text-blue-600" />}
                <h3 className="text-base font-bold text-slate-900">
                  {statusActionModal.type === 'concluir' && 'Concluir Produto na Metodologia'}
                  {statusActionModal.type === 'arquivar' && 'Arquivar Produto'}
                  {statusActionModal.type === 'reativar' && 'Reativar Produto'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStatusActionModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Produto: <strong>{statusActionModal.packageName}</strong> • Cliente: <strong>{statusActionModal.companyName}</strong>
            </p>

            <form onSubmit={handleConfirmStatusAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observação do Status *
                </label>
                <textarea
                  rows={3}
                  required={statusActionModal.type !== 'reativar'}
                  value={actionModalNote}
                  onChange={(e) => setActionModalNote(e.target.value)}
                  placeholder={
                    statusActionModal.type === 'concluir'
                      ? 'Descreva a conclusão (ex: todas as etapas validadas com o cliente, Brandbook entregue e aprovado...)'
                      : statusActionModal.type === 'arquivar'
                      ? 'Motivo do arquivamento (ex: pausa de contrato pelo cliente, contrato encerrado...)'
                      : 'Observação opcional sobre a reativação...'
                  }
                  className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                {actionModalError && (
                  <p className="text-xs text-rose-600 font-semibold mt-1">{actionModalError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStatusActionModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE PRODUTO          */}
      {/* ==================================================== */}
      {productToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Excluir Produto da Esteira?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Você está prestes a remover <strong>{productToDelete.packageName}</strong> do cliente <strong>{productToDelete.companyName}</strong>. Esta ação é irreversível.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProduct}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Sim, Excluir Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
