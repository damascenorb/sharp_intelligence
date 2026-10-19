import React, { useState, useEffect } from 'react';
import { 
  Users, Building2, Eye, Plus, CheckCircle, XCircle, Clock, 
  Calendar, Phone, Mail, Edit, Save, Trash2, Search, Filter, 
  Sparkles, FileText, Check, ShieldCheck, AlertTriangle, Compass, Target, TrendingUp, Layers, CheckSquare, Square,
  Folder, FolderPlus, ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UnifiedClient, PillarId, SHARP_METHODOLOGY_PILLARS, getUnifiedClients, saveUnifiedClients, createUnifiedEnrollment } from '../../data/methodologyData';

export const ClientsDirectory: React.FC = () => {
  const { projects, addProject, registerClientAccount } = useApp();
  const [clients, setClients] = useState<UnifiedClient[]>(() => getUnifiedClients());

  // Listen to cross-component unified changes
  useEffect(() => {
    const handleUpdate = () => {
      setClients(getUnifiedClients());
    };

    window.addEventListener('sharp_unified_clients_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sharp_unified_clients_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [dirStatusFilter, setDirStatusFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotesText, setTempNotesText] = useState('');

  // Modal States
  const [selectedClientModal, setSelectedClientModal] = useState<UnifiedClient | null>(null);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [deletingClientModal, setDeletingClientModal] = useState<UnifiedClient | null>(null);

  // New Client Form State
  const [newName, setNewName] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newSegment, setNewSegment] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newSelectedProducts, setNewSelectedProducts] = useState<{ pillarId: PillarId; packageId: string }[]>([
    { pillarId: 'sharp_brand', packageId: 'brand_strategy' }
  ]);

  // Toggle selected product package for new client
  const handleToggleProduct = (pillarId: PillarId, packageId: string) => {
    setNewSelectedProducts(prev => {
      const exists = prev.some(p => p.pillarId === pillarId && p.packageId === packageId);
      if (exists) {
        return prev.filter(p => !(p.pillarId === pillarId && p.packageId === packageId));
      } else {
        return [...prev, { pillarId, packageId }];
      }
    });
  };

  const handleSaveNotes = (clientId: string) => {
    const updated = clients.map(c => c.id === clientId ? { ...c, sharpNotes: tempNotesText } : c);
    setClients(updated);
    saveUnifiedClients(updated);
    setEditingNotesId(null);
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCompany) return;

    // Build enrolled products list with default initial tasks and stages
    const productsToEnroll = newSelectedProducts.length > 0
      ? newSelectedProducts
      : [{ pillarId: 'sharp_brand' as PillarId, packageId: 'brand_strategy' }];

    const enrolledProducts = productsToEnroll.map(p => 
      createUnifiedEnrollment(p.pillarId, p.packageId, 'Raphael (Estrategista Chefe)')
    );

    const contractedProductNames = enrolledProducts.map(p => p.packageName);

    const newCli: UnifiedClient = {
      id: `cli-${Date.now()}`,
      name: newName.trim(),
      clientName: newName.trim(),
      companyName: newCompany.trim(),
      segment: newSegment.trim() || 'Serviços Gerais',
      phone: newPhone.trim() || '(19) 9 9568-2110',
      email: newEmail.trim() || 'cliente@exemplo.com.br',
      contractedProducts: contractedProductNames,
      nextMeetingDate: newDate.trim() || 'A agendar',
      meetingTopic: 'Reunião Inicial de Kickoff & Alinhamento',
      approvedMaterials: 0,
      rejectedMaterials: 0,
      pendingMaterials: enrolledProducts.length,
      sharpNotes: 'Novo cliente cadastrado no diretório e integrado à esteira de Metodologia Sharp.',
      status: 'Ativo',
      createdAt: new Date().toISOString().split('T')[0],
      enrolledProducts
    };

    const updated = [newCli, ...clients];
    setClients(updated);
    saveUnifiedClients(updated);

    // Register authentication account, auto-open project and trigger notification
    registerClientAccount({
      companyName: newCompany.trim(),
      clientName: newName.trim(),
      email: newEmail.trim() || 'cliente@exemplo.com.br',
      username: newName.split(' ')[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ""),
      password: '2026',
      status: 'active'
    });

    // Reset Form
    setIsNewClientModalOpen(false);
    setNewName('');
    setNewCompany('');
    setNewSegment('');
    setNewPhone('');
    setNewEmail('');
    setNewDate('');
    setNewSelectedProducts([{ pillarId: 'sharp_brand', packageId: 'brand_strategy' }]);
  };

  const handleUpdateModalClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientModal) return;

    const updated = clients.map(c => c.id === selectedClientModal.id ? {
      ...selectedClientModal,
      clientName: selectedClientModal.name
    } : c);

    setClients(updated);
    saveUnifiedClients(updated);
    setSelectedClientModal(null);
  };

  const handleDeleteClient = (clientId: string) => {
    const updated = clients.filter(c => c.id !== clientId);
    setClients(updated);
    saveUnifiedClients(updated);

    if (selectedClientModal && selectedClientModal.id === clientId) {
      setSelectedClientModal(null);
    }
    setDeletingClientModal(null);
  };

  const filteredClients = clients.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      (c.name || '').toLowerCase().includes(q) || 
      (c.companyName || '').toLowerCase().includes(q) || 
      (c.segment || '').toLowerCase().includes(q) || 
      (c.email || '').toLowerCase().includes(q);
    const isInactive = c.status === 'Inativo / Arquivado' || (c.status as string) === 'Inativo';

    if (dirStatusFilter === 'active') return matchesSearch && !isInactive;
    if (dirStatusFilter === 'inactive') return matchesSearch && isInactive;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-50 via-cyan-50/40 to-slate-50 text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-black bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full tracking-wider">
              Gestão Integrada Sharp
            </span>
            <span className="text-xs text-slate-500 font-medium">Diretório de Clientes & Sincronização com Metodologia</span>
          </div>

          <button
            onClick={() => setIsNewClientModalOpen(true)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-cyan-600 text-white font-black text-xs rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs transition-all uppercase tracking-wider active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Novo Cliente</span>
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Gestão de Clientes & Contratos Operacionais
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1 leading-relaxed">
            Painel unificado com contatos, produtos contratados, acompanhamento de entregáveis e sincronização automática com a esteira operacional da Metodologia Sharp.
          </p>
        </div>
      </div>

      {/* Search Bar & Status Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, empresa ou e-mail..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setDirStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              dirStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Todos ({clients.length})
          </button>
          <button
            onClick={() => setDirStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              dirStatusFilter === 'active' ? 'bg-emerald-50 text-emerald-800 shadow-2xs font-bold border border-emerald-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Ativos ({clients.filter(c => c.status !== 'Inativo / Arquivado').length})
          </button>
          <button
            onClick={() => setDirStatusFilter('inactive')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              dirStatusFilter === 'inactive' ? 'bg-amber-50 text-amber-800 shadow-2xs font-bold border border-amber-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Inativos ({clients.filter(c => c.status === 'Inativo / Arquivado').length})
          </button>
        </div>

        <div className="text-slate-500 font-semibold text-right">
          Exibindo <strong>{filteredClients.length}</strong> de {clients.length} cliente(s)
        </div>
      </div>

      {/* Cards Grid */}
      {filteredClients.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl shadow-xs space-y-3">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Nenhum cliente cadastrado no diretório</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Utilize o botão "+ Cadastrar Novo Cliente" acima para registrar um cliente com seus produtos e linhas contratadas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => {
            const isEditingThisNote = editingNotesId === client.id;
            const displayProducts = client.contractedProducts && client.contractedProducts.length > 0 
              ? client.contractedProducts 
              : (client.enrolledProducts || []).map(p => p.packageName);

            return (
              <div key={client.id} className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative group">
                
                {/* Card Top Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/60 space-y-3 relative">
                  
                  <div className="flex items-start justify-between">
                    <button
                      onClick={() => setSelectedClientModal(client)}
                      className="p-2 bg-slate-900 hover:bg-cyan-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95"
                      title="Visualizar Dados Cadastrais Completos"
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Ver Cadastro</span>
                    </button>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        client.status === 'Ativo' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {client.status}
                      </span>

                      <button
                        onClick={() => setDeletingClientModal(client)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir cadastro deste cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900">{client.companyName}</h3>
                    <div className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>{client.name || client.clientName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{client.segment}</p>
                  </div>
                </div>

                {/* Card Body Info */}
                <div className="p-5 space-y-4 text-xs flex-1">
                  
                  {/* Contracted Services / Products */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Produtos & Linhas Contratadas</span>
                      <span className="text-[10px] text-cyan-700 font-bold bg-cyan-50 px-1.5 py-0.5 rounded-md border border-cyan-100">
                        {displayProducts.length} na Metodologia
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {displayProducts.map((prod, idx) => (
                        <span key={idx} className="bg-cyan-50 text-cyan-900 border border-cyan-200/80 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Scheduled Meeting */}
                  <div className="bg-amber-50/80 text-slate-900 p-3 rounded-2xl border border-amber-200/80 space-y-1 shadow-2xs">
                    <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider block flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-amber-600" />
                      <span>Próximo Agendamento</span>
                    </span>
                    <div className="font-bold text-xs text-slate-900">{client.nextMeetingDate || 'A agendar'}</div>
                    <p className="text-[10px] text-slate-600 font-medium leading-tight">{client.meetingTopic || 'Alinhamento Periódico'}</p>
                  </div>

                  {/* Integrated Material Status Counters */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Status dos Materiais & Entregáveis</span>
                    
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-xl">
                        <span className="text-[10px] font-bold text-emerald-800 block">Aprovados</span>
                        <span className="text-base font-black text-emerald-600">{client.approvedMaterials ?? 0}</span>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 p-2 rounded-xl">
                        <span className="text-[10px] font-bold text-amber-800 block">Pendentes</span>
                        <span className="text-base font-black text-amber-600">{client.pendingMaterials ?? 0}</span>
                      </div>

                      <div className="bg-rose-50 border border-rose-200 p-2 rounded-xl">
                        <span className="text-[10px] font-bold text-rose-800 block">Reprovados</span>
                        <span className="text-base font-black text-rose-600">{client.rejectedMaterials ?? 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Linked Projects in Projetos & Entregáveis */}
                  {(() => {
                    const linked = projects.filter(p => 
                      (p.clientId && p.clientId === client.id) ||
                      p.companyName.toLowerCase() === client.companyName.toLowerCase() ||
                      p.clientEmail.toLowerCase() === client.email.toLowerCase()
                    );
                    return (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px]">
                          <div className="flex items-center space-x-1.5 font-bold text-slate-700">
                            <Folder className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                            <span>{linked.length} Projeto(s) Pós-Venda</span>
                          </div>
                          {linked.length > 0 ? (
                            <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded-full uppercase">
                              {linked[0].stage}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">
                              Sem projeto ativo
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Editable Sharp Team Notes Field */}
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block flex items-center space-x-1">
                        <FileText className="w-3 h-3 text-cyan-600" />
                        <span>Observações da Equipe Sharp</span>
                      </span>

                      {!isEditingThisNote ? (
                        <button
                          onClick={() => {
                            setEditingNotesId(client.id);
                            setTempNotesText(client.sharpNotes || '');
                          }}
                          className="text-[10px] text-cyan-600 hover:underline font-bold flex items-center space-x-0.5 cursor-pointer"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveNotes(client.id)}
                          className="text-[10px] text-emerald-600 font-bold flex items-center space-x-0.5 cursor-pointer"
                        >
                          <Save className="w-3 h-3" />
                          <span>Salvar</span>
                        </button>
                      )}
                    </div>

                    {isEditingThisNote ? (
                      <textarea
                        rows={3}
                        value={tempNotesText}
                        onChange={e => setTempNotesText(e.target.value)}
                        className="w-full bg-slate-50 border border-cyan-400 rounded-xl p-2 text-xs text-slate-900 font-medium focus:outline-none"
                      />
                    ) : (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700 leading-relaxed italic">
                        "{client.sharpNotes || 'Nenhuma observação cadastrada.'}"
                      </div>
                    )}
                  </div>

                </div>

                {/* Card Footer Contact Bar */}
                <div className="p-3 bg-slate-100 border-t border-slate-200 text-[10px] text-slate-600 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-cyan-600" />
                    <span>{client.phone}</span>
                  </span>
                  <span className="truncate font-medium">{client.email}</span>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: FULL CLIENT DETAILS (EYE ICON) */}
      {selectedClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-slate-900">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-widest block">Cadastro do Cliente</span>
                <h3 className="text-lg font-black text-slate-900">{selectedClientModal.companyName}</h3>
              </div>
              <button
                onClick={() => setSelectedClientModal(null)}
                className="text-slate-400 hover:text-slate-900 font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateModalClient} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Contato Principal</label>
                  <input
                    type="text"
                    value={selectedClientModal.name}
                    onChange={e => setSelectedClientModal({ ...selectedClientModal, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Segmento</label>
                  <input
                    type="text"
                    value={selectedClientModal.segment}
                    onChange={e => setSelectedClientModal({ ...selectedClientModal, segment: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={selectedClientModal.phone}
                    onChange={e => setSelectedClientModal({ ...selectedClientModal, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="text"
                    value={selectedClientModal.email}
                    onChange={e => setSelectedClientModal({ ...selectedClientModal, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Data da Próxima Reunião</label>
                <input
                  type="text"
                  value={selectedClientModal.nextMeetingDate || ''}
                  onChange={e => setSelectedClientModal({ ...selectedClientModal, nextMeetingDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-amber-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Produtos Contratados (Metodologia Sharp)</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                  {(selectedClientModal.enrolledProducts || []).length === 0 ? (
                    <span className="text-slate-400 italic">Nenhum produto cadastrado na esteira.</span>
                  ) : (
                    (selectedClientModal.enrolledProducts || []).map(enr => (
                      <div key={enr.id} className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                        <span className="font-bold text-slate-800">{enr.packageName}</span>
                        <span className="text-[10px] font-bold text-slate-500">{enr.responsibleStaff}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-emerald-800 mb-1">Materiais Aprovados</label>
                  <input
                    type="number"
                    value={selectedClientModal.approvedMaterials ?? 0}
                    onChange={e => setSelectedClientModal({ ...selectedClientModal, approvedMaterials: Number(e.target.value) })}
                    className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-center font-black text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-amber-800 mb-1">Materiais Pendentes</label>
                  <input
                    type="number"
                    value={selectedClientModal.pendingMaterials ?? 0}
                    onChange={e => setSelectedClientModal({ ...selectedClientModal, pendingMaterials: Number(e.target.value) })}
                    className="w-full bg-amber-50 border border-amber-200 rounded-xl p-2 text-center font-black text-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-rose-800 mb-1">Materiais Reprovados</label>
                  <input
                    type="number"
                    value={selectedClientModal.rejectedMaterials ?? 0}
                    onChange={e => setSelectedClientModal({ ...selectedClientModal, rejectedMaterials: Number(e.target.value) })}
                    className="w-full bg-rose-50 border border-rose-200 rounded-xl p-2 text-center font-black text-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observações da Equipe Sharp</label>
                <textarea
                  rows={3}
                  value={selectedClientModal.sharpNotes || ''}
                  onChange={e => setSelectedClientModal({ ...selectedClientModal, sharpNotes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              {/* Linked Projects in Projetos & Entregáveis */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <Folder className="w-4 h-4 text-cyan-600" />
                    <span>Projetos & Entregáveis Vinculados</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newProj = addProject({
                        leadId: `lead-${Date.now()}`,
                        clientId: selectedClientModal.id,
                        companyName: selectedClientModal.companyName,
                        clientName: selectedClientModal.name || selectedClientModal.clientName,
                        clientEmail: selectedClientModal.email,
                        clientPhone: selectedClientModal.phone,
                        segment: selectedClientModal.segment,
                        solutions: ['brand', 'presence'],
                        stage: 'onboarding',
                        assignedTeam: {
                          designer: 'Luan (Líder de Arte)',
                          strategist: 'Raphael (Estrategista Chefe)',
                          commercial: 'Ingrid (Atendimento & CS)'
                        },
                        onboardingChecklist: [
                          { id: `ob-${Date.now()}-1`, label: 'Envio da logo e vetor da marca em alta resolução', completed: false },
                          { id: `ob-${Date.now()}-2`, label: 'Preenchimento do Briefing Detalhado de Conteúdo', completed: false },
                          { id: `ob-${Date.now()}-3`, label: 'Concessão de acesso ao Meta Business Suite', completed: false }
                        ],
                        contentItems: [],
                        archived: false
                      });
                      alert(`Novo projeto criado com sucesso para "${selectedClientModal.companyName}"! Acesse a aba Projetos & Entregáveis.`);
                    }}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Abrir Novo Projeto</span>
                  </button>
                </div>

                {(() => {
                  const clientProjects = projects.filter(p =>
                    (p.clientId && p.clientId === selectedClientModal.id) ||
                    p.companyName.toLowerCase() === selectedClientModal.companyName.toLowerCase() ||
                    p.clientEmail.toLowerCase() === selectedClientModal.email.toLowerCase()
                  );

                  if (clientProjects.length === 0) {
                    return (
                      <p className="text-[11px] text-slate-500 italic bg-white p-3 rounded-xl border border-slate-200">
                        Nenhum projeto aberto ainda para este cliente. Clique em "Abrir Novo Projeto" acima para iniciar a esteira de entregáveis.
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-2">
                      {clientProjects.map(proj => (
                        <div key={proj.id} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 block">{proj.companyName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {proj.id} • {proj.contentItems.length} peças criadas</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-full uppercase">
                              {proj.stage}
                            </span>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                              {proj.onboardingChecklist.filter(i => i.completed).length}/{proj.onboardingChecklist.length} tarefas
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingClientModal(selectedClientModal)}
                  className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer text-xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir Cliente</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedClientModal(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold rounded-xl uppercase tracking-wider cursor-pointer"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: NEW CLIENT REGISTRATION WITH PRODUCT & PRODUCT LINE SELECTION */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-slate-900 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-100 text-cyan-800 px-2.5 py-0.5 rounded-full">
                  Cadastro Unificado Sharp
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">Cadastrar Novo Cliente & Contratos</h3>
                <p className="text-xs text-slate-500">Ao cadastrar, o cliente e os produtos selecionados subirão automaticamente para a esteira da Metodologia.</p>
              </div>
              <button onClick={() => setIsNewClientModalOpen(false)} className="text-slate-400 hover:text-slate-900 cursor-pointer text-lg font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              
              {/* Basic Client Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome da Empresa / Marca *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Clínica Lumina Odontologia"
                    value={newCompany}
                    onChange={e => setNewCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contato Principal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dra. Camila Rocha"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="Ex: (19) 9 9568-2110"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Segmento</label>
                  <input
                    type="text"
                    placeholder="Ex: Saúde & Odontologia"
                    value={newSegment}
                    onChange={e => setNewSegment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    placeholder="Ex: contato@empresa.com.br"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
              </div>

              {/* PRODUCTS & PRODUCT LINES SELECTOR (4 PILARES SHARP) */}
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-extrabold text-slate-900 text-xs">
                      Produtos & Linhas de Produto Contratadas *
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Selecione um ou mais pacotes. Cada produto gerará sua esteira de etapas e tarefas na Metodologia.
                    </p>
                  </div>
                  <span className="text-[11px] font-black text-cyan-800 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-lg">
                    {newSelectedProducts.length} selecionado(s)
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {SHARP_METHODOLOGY_PILLARS.map(pillar => {
                    const pillarSelectedCount = newSelectedProducts.filter(p => p.pillarId === pillar.id).length;

                    return (
                      <div key={pillar.id} className="bg-slate-50/90 rounded-2xl border border-slate-200 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${pillar.colorScheme.badge}`}>
                              {pillar.id === 'sharp_insights' && <Compass className="w-3.5 h-3.5" />}
                              {pillar.id === 'sharp_brand' && <Sparkles className="w-3.5 h-3.5" />}
                              {pillar.id === 'sharp_presence' && <Target className="w-3.5 h-3.5" />}
                              {pillar.id === 'sharp_growth' && <TrendingUp className="w-3.5 h-3.5" />}
                            </div>
                            <span className="font-extrabold text-slate-900 text-xs">{pillar.name}</span>
                            <span className="text-[10px] text-slate-500 italic hidden sm:inline">— {pillar.tagline}</span>
                          </div>
                          {pillarSelectedCount > 0 && (
                            <span className="text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                              {pillarSelectedCount} pacote(s)
                            </span>
                          )}
                        </div>

                        {/* Package Pills */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {pillar.packages.map(pkg => {
                            const isSelected = newSelectedProducts.some(p => p.pillarId === pillar.id && p.packageId === pkg.id);

                            return (
                              <button
                                key={pkg.id}
                                type="button"
                                onClick={() => handleToggleProduct(pillar.id, pkg.id)}
                                className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                  isSelected 
                                    ? `${pillar.colorScheme.pill} border-current ring-2 ring-cyan-500/20 shadow-xs`
                                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-1 mb-1">
                                  <span className="font-bold text-[11px] leading-tight text-slate-900">{pkg.name}</span>
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <Square className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                                  )}
                                </div>
                                <span className="text-[9px] text-slate-500 line-clamp-2 leading-snug">{pkg.description}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer text-xs transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={!newName || !newCompany || newSelectedProducts.length === 0}
                  className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold rounded-xl uppercase tracking-wider cursor-pointer shadow-sm active:scale-95 transition-all text-xs flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar & Subir para Metodologia</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EXCLUIR CLIENTE DO DIRETÓRIO */}
      {deletingClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative space-y-4 text-white text-center">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold">Excluir Cliente do Diretório & Metodologia?</h3>
            <p className="text-xs text-slate-400">
              Tem certeza que deseja remover permanentemente o registro de <strong className="text-white">{deletingClientModal.companyName}</strong> ({deletingClientModal.name})? Ele será removido tanto de Clientes quanto da Metodologia.
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setDeletingClientModal(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteClient(deletingClientModal.id)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-red-600/30"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
