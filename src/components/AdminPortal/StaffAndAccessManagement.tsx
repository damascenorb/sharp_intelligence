import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  UserPlus, ShieldCheck, Building2, Key, Users, CheckCircle2, Search, 
  Trash2, Edit, AlertTriangle, X, Lock, Download, Upload, Camera, Image as ImageIcon,
  Check, User, Sparkles, RefreshCw, Eye, Globe, ExternalLink, ShieldAlert, Phone, Mail
} from 'lucide-react';
import { StaffMember, ClientAccount } from '../../types';
import { SharpLogo } from '../SharpLogo';

export const StaffAndAccessManagement: React.FC = () => {
  const { 
    staffMembers, 
    clientAccounts, 
    registerStaffMember, 
    updateStaffMember,
    deleteStaffMember,
    registerClientAccount, 
    updateClientAccount,
    deleteClientAccount,
    clearAllClientTestData,
    projects,
    createDataBackup,
    restoreDataBackup,
    sharpLogoUrl,
    setSharpLogoUrl,
    sharpMasterProfile,
    updateSharpMasterProfile,
    changeUserPassword,
  } = useApp();

  // Backup & Restore state
  const [backupMsg, setBackupMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoreJsonInput, setRestoreJsonInput] = useState('');
  
  // Staff Registration Form State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffAvatarUrl, setStaffAvatarUrl] = useState('');
  const [staffMsg, setStaffMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Staff State
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editStaffName, setEditStaffName] = useState('');
  const [editStaffRole, setEditStaffRole] = useState('');
  const [editStaffEmail, setEditStaffEmail] = useState('');
  const [editStaffUsername, setEditStaffUsername] = useState('');
  const [editStaffPassword, setEditStaffPassword] = useState('');
  const [editStaffAvatarUrl, setEditStaffAvatarUrl] = useState('');
  const [editStaffMsg, setEditStaffMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // File upload refs
  const addStaffFileRef = useRef<HTMLInputElement>(null);
  const editStaffFileRef = useRef<HTMLInputElement>(null);
  const sharpLogoFileRef = useRef<HTMLInputElement>(null);

  // Delete Staff Confirmation
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);

  // Client Registration Form State
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [clientCompanyName, setClientCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientUsername, setClientUsername] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientAvatarUrl, setClientAvatarUrl] = useState('');
  const [clientStatus, setClientStatus] = useState<'active' | 'inactive'>('active');
  const [clientMsg, setClientMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Client State
  const [editingClient, setEditingClient] = useState<ClientAccount | null>(null);
  const [editClientCompanyName, setEditClientCompanyName] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [editClientEmail, setEditClientEmail] = useState('');
  const [editClientUsername, setEditClientUsername] = useState('');
  const [editClientPassword, setEditClientPassword] = useState('');
  const [editClientStatus, setEditClientStatus] = useState<'active' | 'inactive'>('active');
  const [editClientMsg, setEditClientMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [clientStatusFilter, setClientStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Delete Client Confirmation
  const [deletingClient, setDeletingClient] = useState<ClientAccount | null>(null);

  // Clear All Client Test Data Modal
  const [showClearDataModal, setShowClearDataModal] = useState(false);

  // Tab State: 'staff' | 'clients' | 'sharp'
  const [activeTab, setActiveTab] = useState<'staff' | 'clients' | 'sharp'>('staff');
  const [searchQuery, setSearchQuery] = useState('');

  // SHARP Tab Specific States
  const [sharpLogoInputUrl, setSharpLogoInputUrl] = useState(sharpLogoUrl || '');
  const [sharpLogoMsg, setSharpLogoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewBgTheme, setPreviewBgTheme] = useState<'white' | 'dark' | 'cyan'>('white');
  const [showMasterEditModal, setShowMasterEditModal] = useState(false);
  const [masterName, setMasterName] = useState(sharpMasterProfile?.companyName || 'SHARP Intelligence Corp / Matriz');
  const [masterEmail, setMasterEmail] = useState(sharpMasterProfile?.email || 'contato@sharpintelligence.com.br');
  const [masterPhone, setMasterPhone] = useState(sharpMasterProfile?.phone || '(19) 9 9568-2110');
  const [masterWhatsapp, setMasterWhatsapp] = useState(sharpMasterProfile?.whatsapp || '5519995682110');
  const [masterDescription, setMasterDescription] = useState(sharpMasterProfile?.description || 'Hub executivo de inteligência, branding e presença digital.');
  const [masterNewPassword, setMasterNewPassword] = useState('');
  const [masterProfileMsg, setMasterProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Handle Photo File Upload
  const handlePhotoFileUpload = (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Sharp Logo Upload
  const handleSharpLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoFileUpload(file, (dataUrl) => {
        setSharpLogoInputUrl(dataUrl);
        setSharpLogoUrl(dataUrl);
        setSharpLogoMsg({
          type: 'success',
          text: 'Logotipo da SHARP atualizado com sucesso e aplicado em todo o site!'
        });
        setTimeout(() => setSharpLogoMsg(null), 4000);
      });
    }
  };

  const handleSaveSharpLogoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sharpLogoInputUrl.trim()) {
      setSharpLogoUrl(null);
      setSharpLogoMsg({
        type: 'success',
        text: 'Restaurado o logotipo vetorial padrão da SHARP.'
      });
    } else {
      setSharpLogoUrl(sharpLogoInputUrl.trim());
      setSharpLogoMsg({
        type: 'success',
        text: 'Logotipo da SHARP atualizado com sucesso e aplicado em todo o site!'
      });
    }
    setTimeout(() => setSharpLogoMsg(null), 4000);
  };

  const handleResetSharpLogo = () => {
    setSharpLogoInputUrl('');
    setSharpLogoUrl(null);
    setSharpLogoMsg({
      type: 'success',
      text: 'Logotipo vetorial padrão da SHARP restaurado com sucesso!'
    });
    setTimeout(() => setSharpLogoMsg(null), 4000);
  };

  const handleSaveMasterProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSharpMasterProfile({
      companyName: masterName,
      email: masterEmail,
      phone: masterPhone,
      whatsapp: masterWhatsapp,
      description: masterDescription,
    });

    if (masterNewPassword.trim()) {
      changeUserPassword(masterNewPassword.trim());
    }

    setMasterProfileMsg({
      type: 'success',
      text: 'Dados institucionais da Matriz SHARP atualizados com sucesso!'
    });

    setTimeout(() => {
      setMasterProfileMsg(null);
      setShowMasterEditModal(false);
      setMasterNewPassword('');
    }, 1500);
  };

  // Handle Staff Add
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffMsg(null);
    const firstName = staffName.split(' ')[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");

    const res = registerStaffMember({
      name: staffName,
      username: firstName || staffName.toLowerCase(),
      password: staffPassword || '2026',
      role: staffRole || 'Estrategista & Operação',
      email: staffEmail || `${firstName || 'staff'}@sharp.com.br`,
      avatarUrl: staffAvatarUrl || undefined
    });

    if (res.success) {
      setStaffMsg({ type: 'success', text: res.message || 'Integrante registrado com sucesso!' });
      setTimeout(() => {
        setShowAddStaffModal(false);
        setStaffName('');
        setStaffRole('');
        setStaffEmail('');
        setStaffPassword('');
        setStaffAvatarUrl('');
        setStaffMsg(null);
      }, 1200);
    } else {
      setStaffMsg({ type: 'error', text: res.message || 'Erro ao registrar integrante.' });
    }
  };

  // Handle Open Edit Staff
  const handleOpenEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setEditStaffName(staff.name);
    setEditStaffRole(staff.role);
    setEditStaffEmail(staff.email || '');
    setEditStaffUsername(staff.username);
    setEditStaffPassword(staff.password);
    setEditStaffAvatarUrl(staff.avatarUrl || '');
    setEditStaffMsg(null);
  };

  // Handle Save Edit Staff
  const handleSaveEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setEditStaffMsg(null);

    const res = updateStaffMember(editingStaff.id, {
      name: editStaffName,
      role: editStaffRole,
      email: editStaffEmail,
      username: editStaffUsername,
      password: editStaffPassword,
      avatarUrl: editStaffAvatarUrl || undefined
    });

    if (res.success) {
      setEditStaffMsg({ type: 'success', text: res.message || 'Dados atualizados com sucesso!' });
      setTimeout(() => {
        setEditingStaff(null);
        setEditStaffMsg(null);
      }, 1200);
    } else {
      setEditStaffMsg({ type: 'error', text: res.message || 'Erro ao atualizar dados.' });
    }
  };

  // Handle Confirm Delete Staff
  const handleConfirmDeleteStaff = () => {
    if (!deletingStaff) return;
    deleteStaffMember(deletingStaff.id);
    setDeletingStaff(null);
  };

  // Handle Client Add
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    setClientMsg(null);

    const cleanUsername = clientCompanyName
      .split(' ')[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

    const res = registerClientAccount({
      companyName: clientCompanyName,
      clientName: clientName,
      email: clientEmail,
      username: clientUsername || cleanUsername || 'cliente',
      password: clientPassword || '1234',
      avatarUrl: clientAvatarUrl || undefined,
      status: clientStatus
    });

    if (res.success) {
      setClientMsg({ type: 'success', text: res.message || 'Acesso do cliente criado com sucesso!' });
      setTimeout(() => {
        setShowAddClientModal(false);
        setClientCompanyName('');
        setClientName('');
        setClientEmail('');
        setClientUsername('');
        setClientPassword('');
        setClientAvatarUrl('');
        setClientStatus('active');
        setClientMsg(null);
      }, 1200);
    } else {
      setClientMsg({ type: 'error', text: res.message || 'Erro ao registrar cliente.' });
    }
  };

  // Handle Open Edit Client
  const handleOpenEditClient = (client: ClientAccount) => {
    setEditingClient(client);
    setEditClientCompanyName(client.companyName);
    setEditClientName(client.clientName);
    setEditClientEmail(client.email);
    setEditClientUsername(client.username);
    setEditClientPassword(client.password);
    setEditClientStatus(client.status || 'active');
    setEditClientMsg(null);
  };

  // Handle Save Edit Client
  const handleSaveEditClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    setEditClientMsg(null);

    const res = updateClientAccount(editingClient.id, {
      companyName: editClientCompanyName,
      clientName: editClientName,
      email: editClientEmail,
      username: editClientUsername,
      password: editClientPassword,
      status: editClientStatus
    });

    if (res.success) {
      setEditClientMsg({ type: 'success', text: res.message || 'Dados do cliente atualizados!' });
      setTimeout(() => {
        setEditingClient(null);
        setEditClientMsg(null);
      }, 1200);
    } else {
      setEditClientMsg({ type: 'error', text: res.message || 'Erro ao atualizar dados.' });
    }
  };

  // Handle Confirm Delete Client
  const handleConfirmDeleteClient = () => {
    if (!deletingClient) return;
    deleteClientAccount(deletingClient.id);
    setDeletingClient(null);
  };

  // Handle Confirm Clear All Data
  const handleConfirmClearAllData = () => {
    clearAllClientTestData();
    setShowClearDataModal(false);
  };

  // Handle Backup Export
  const handleDownloadBackup = () => {
    try {
      const json = createDataBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_sharp_intelligence_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupMsg({ type: 'success', text: 'Backup exportado com sucesso!' });
      setTimeout(() => setBackupMsg(null), 3000);
    } catch {
      setBackupMsg({ type: 'error', text: 'Erro ao gerar backup.' });
      setTimeout(() => setBackupMsg(null), 3000);
    }
  };

  // Handle Backup Restore
  const handleRestoreBackup = () => {
    if (!restoreJsonInput.trim()) return;
    const res = restoreDataBackup(restoreJsonInput.trim());
    if (res.success) {
      setBackupMsg({ type: 'success', text: 'Dados restaurados com sucesso!' });
      setShowRestoreModal(false);
      setRestoreJsonInput('');
      setTimeout(() => setBackupMsg(null), 3000);
    } else {
      setBackupMsg({ type: 'error', text: res.message || 'Erro ao restaurar backup.' });
      setTimeout(() => setBackupMsg(null), 3000);
    }
  };

  // Filter staff and clients
  const filteredStaff = staffMembers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredClients = clientAccounts.filter(c => {
    const matchesSearch = 
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (clientStatusFilter === 'active') return matchesSearch && c.status !== 'inactive';
    if (clientStatusFilter === 'inactive') return matchesSearch && c.status === 'inactive';
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header card with Action buttons */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-800">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Equipe, Permissões & Identidade SHARP
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Gerencie os acessos institucionais, membros da equipe, credenciais de clientes e a identidade oficial da SHARP.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('sharp')}
              className="px-3.5 py-2 bg-gradient-to-r from-slate-900 to-cyan-950 hover:from-slate-800 hover:to-cyan-900 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer border border-cyan-800/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Identidade SHARP & Logo</span>
            </button>

            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-3.5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Integrante Sharp</span>
            </button>

            <button
              onClick={() => setShowAddClientModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>+ Acesso de Cliente</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <button
              onClick={handleDownloadBackup}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1 transition-all cursor-pointer"
              title="Baixar backup dos dados"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            <button
              onClick={() => setShowRestoreModal(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1 transition-all cursor-pointer"
              title="Restaurar backup"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {backupMsg && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
            backupMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{backupMsg.text}</span>
          </div>
        )}

        {/* Tab & Search controls */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'staff'
                  ? 'bg-white text-cyan-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-600" />
              <span>Equipe Sharp ({staffMembers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'clients'
                  ? 'bg-white text-cyan-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-cyan-600" />
              <span>Clientes com Acesso ({clientAccounts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sharp')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'sharp'
                  ? 'bg-gradient-to-r from-slate-900 to-cyan-950 text-cyan-300 shadow-xs ring-1 ring-cyan-500/40'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>SHARP (Identidade, Logo & Matriz)</span>
            </button>
          </div>

          {activeTab === 'clients' && (
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => setClientStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  clientStatusFilter === 'all' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({clientAccounts.length})
              </button>
              <button
                onClick={() => setClientStatusFilter('active')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  clientStatusFilter === 'active' ? 'bg-emerald-100 text-emerald-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ativos ({clientAccounts.filter(c => c.status !== 'inactive').length})
              </button>
              <button
                onClick={() => setClientStatusFilter('inactive')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  clientStatusFilter === 'inactive' ? 'bg-amber-100 text-amber-800 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inativos ({clientAccounts.filter(c => c.status === 'inactive').length})
              </button>
            </div>
          )}

          {activeTab !== 'sharp' && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={activeTab === 'staff' ? "Buscar integrante..." : "Buscar cliente..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SHARP (IDENTIDADE INSTITUCIONAL, LOGO & ACESSOS MATRIZ)            */}
      {/* ========================================================================= */}
      {activeTab === 'sharp' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Logo Management Section */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-100 text-cyan-800 border border-cyan-200">
                    Marca Oficial
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Logotipo Institucional da SHARP
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Envie ou vincule a logo oficial da SHARP. A imagem configurada aqui será exibida automaticamente no topo do site (Header), Menu Lateral (Sidebar), Tela de Login, Área de Clientes e Dossiês.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-slate-500">Testar Fundo:</span>
                <button
                  onClick={() => setPreviewBgTheme('white')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    previewBgTheme === 'white' 
                      ? 'bg-white border-cyan-500 text-slate-900 shadow-xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Claro
                </button>
                <button
                  onClick={() => setPreviewBgTheme('dark')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    previewBgTheme === 'dark' 
                      ? 'bg-slate-900 border-cyan-500 text-white shadow-xs' 
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  Escuro
                </button>
                <button
                  onClick={() => setPreviewBgTheme('cyan')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    previewBgTheme === 'cyan' 
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-xs' 
                      : 'bg-cyan-900/60 border-cyan-800 text-cyan-400'
                  }`}
                >
                  Cyan
                </button>
              </div>
            </div>

            {sharpLogoMsg && (
              <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                sharpLogoMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{sharpLogoMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Live Preview Box */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Visualização em Tempo Real no Site</span>
                </div>

                <div className={`w-full h-44 rounded-2xl border flex flex-col items-center justify-center p-6 transition-all duration-300 shadow-inner ${
                  previewBgTheme === 'white'
                    ? 'bg-white border-slate-200'
                    : previewBgTheme === 'dark'
                    ? 'bg-slate-950 border-slate-800'
                    : 'bg-gradient-to-br from-slate-900 to-cyan-950 border-cyan-900'
                }`}>
                  <SharpLogo 
                    size="lg" 
                    textColor={previewBgTheme === 'white' ? 'text-slate-900' : 'text-white'}
                  />
                  <div className="mt-3">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      sharpLogoUrl 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {sharpLogoUrl ? '✓ Imagem Personalizada Ativa' : '✓ Logotipo Vetorial Padrão Ativo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload & URL Input Controls */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* File Upload Trigger Area */}
                <div 
                  onClick={() => sharpLogoFileRef.current?.click()}
                  className="border-2 border-dashed border-cyan-300 hover:border-cyan-500 bg-cyan-50/30 hover:bg-cyan-50/60 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 group"
                >
                  <input
                    type="file"
                    ref={sharpLogoFileRef}
                    accept="image/png, image/svg+xml, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleSharpLogoFileChange}
                  />
                  <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Clique para fazer upload da Logo da Sharp
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Suporta arquivos PNG transparente, SVG, JPG ou WebP (recomendado: proporção quadrada ou retangular limpa)
                    </p>
                  </div>
                </div>

                {/* Direct Image URL Form */}
                <form onSubmit={handleSaveSharpLogoUrl} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="url"
                        placeholder="Ou cole a URL direta da imagem (ex: https://.../logo.png)"
                        value={sharpLogoInputUrl}
                        onChange={(e) => setSharpLogoInputUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs whitespace-nowrap"
                    >
                      Salvar URL
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={handleResetSharpLogo}
                      className="text-slate-500 hover:text-slate-800 font-bold flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Restaurar Logotipo Vetorial Padrão</span>
                    </button>

                    {sharpLogoUrl && (
                      <span className="text-[11px] text-emerald-700 font-bold">
                        ● Logo sincronizada em tempo real
                      </span>
                    )}
                  </div>
                </form>

              </div>
            </div>
          </div>

          {/* Master Account & Linked Permissions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Master Credentials Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-700/80 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100">
                        {sharpMasterProfile?.companyName || 'SHARP Intelligence Corp'}
                      </h4>
                      <span className="text-[10px] text-cyan-300 font-extrabold uppercase tracking-wider">
                        Conta Matriz / Super Administrador
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowMasterEditModal(true)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors cursor-pointer"
                    title="Editar informações institucionais e senha"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {sharpMasterProfile?.description || 'Hub executivo de inteligência, branding e presença digital de alta performance.'}
                </p>

                <div className="p-3.5 bg-black/30 rounded-2xl border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Usuário Master:</span>
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">sharp</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Senha Master:</span>
                    </span>
                    <span className="font-mono text-slate-100 font-bold">Sharp@2026</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <span>E-mail Oficial:</span>
                    </span>
                    <span className="text-slate-200 font-medium text-[11px] truncate max-w-[180px]">
                      {sharpMasterProfile?.email || 'contato@sharpintelligence.com.br'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Telefone / WhatsApp:</span>
                    </span>
                    <span className="text-slate-200 font-medium text-[11px]">
                      {sharpMasterProfile?.phone || '(19) 9 9568-2110'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>Nível de Acesso: Soberano</span>
                <button
                  onClick={() => setShowMasterEditModal(true)}
                  className="text-cyan-300 hover:text-cyan-200 font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <span>Alterar Senha / Dados</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Sovereign Permissions & Capabilities List */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-600" />
                  <span>Permissões & Acessos Vinculados à SHARP</span>
                </h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Acesso Total Irrestrito
                </span>
              </div>

              <p className="text-xs text-slate-600">
                O acesso master e os integrantes vinculados à SHARP possuem controle integrado sobre as seguintes esteiras e módulos da plataforma:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dossiês & Inteligência</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Criação, edição e exportação de relatórios estratégicos e pesquisas.</p>
                </div>

                <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Esteira Criativa & Artes</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Upload de entregáveis, aprovação e revisão interna e envio ao cliente.</p>
                </div>

                <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Operação & Etapas</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Controle completo das etapas de produção e validação das entregas.</p>
                </div>

                <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-slate-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Gestão de Equipe & Acessos</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Criação, edição e revogação de acessos de colaboradores e clientes.</p>
                </div>
              </div>

              {/* Linked Team Members Quick Grid */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Colaboradores Vinculados à Matriz SHARP ({staffMembers.length}):</span>
                  <button
                    onClick={() => setActiveTab('staff')}
                    className="text-cyan-700 hover:text-cyan-900 text-[11px] font-bold cursor-pointer"
                  >
                    Ver Todos →
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {staffMembers.map(staff => (
                    <span 
                      key={staff.id}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-cyan-50 border border-slate-200 text-slate-800 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                      onClick={() => {
                        setActiveTab('staff');
                        setSearchQuery(staff.name);
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{staff.name}</span>
                      <span className="text-[10px] text-slate-400">({staff.role.split(' ')[0]})</span>
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STAFF LIST                                                         */}
      {/* ========================================================================= */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white border border-slate-200/90 rounded-2xl">
              <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Nenhum integrante encontrado.</p>
              <p className="text-xs text-slate-500 mt-1">Clique no botão "+ Integrante Sharp" para cadastrar um novo membro.</p>
            </div>
          ) : (
            filteredStaff.map((staff) => {
              return (
                <div
                  key={staff.id}
                  className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-800 font-bold text-sm overflow-hidden shrink-0">
                          {staff.avatarUrl ? (
                            <img src={staff.avatarUrl} alt={staff.name} className="w-full h-full object-cover" />
                          ) : (
                            staff.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 tracking-tight">{staff.name}</h3>
                          <p className="text-xs text-slate-500">{staff.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEditStaff(staff)}
                          className="p-1.5 text-slate-400 hover:text-cyan-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Editar integrante"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingStaff(staff)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir integrante"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {staff.email && (
                      <p className="text-[11px] text-slate-500 truncate">{staff.email}</p>
                    )}
                  </div>

                  {/* Credentials & Access Info */}
                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Usuário de Login:</span>
                      <span className="font-mono text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        {staff.username}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Senha de Acesso:</span>
                      <span className="font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-md text-[11px]">
                        {staff.password}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CLIENTS LIST                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'clients' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-500">
              Total de {filteredClients.length} contas de clientes cadastradas
            </span>
            <button
              onClick={() => setShowClearDataModal(true)}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Clientes de Teste</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white border border-slate-200/90 rounded-2xl">
                <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Nenhum cliente cadastrado no momento.</p>
                <p className="text-xs text-slate-500 mt-1">Clique em "+ Acesso de Cliente" para cadastrar um novo cliente.</p>
              </div>
            ) : (
              filteredClients.map((client) => {
                const isInactive = client.status === 'inactive';

                return (
                  <div
                    key={client.id}
                    className={`bg-white border rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between transition-all ${
                      isInactive ? 'border-amber-200 bg-amber-50/20' : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold text-sm">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            isInactive
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {isInactive ? 'Inativo' : '✓ Ativo'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenEditClient(client)}
                            className="p-1.5 text-slate-400 hover:text-cyan-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Editar dados do cliente"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingClient(client)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir acesso do cliente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">{client.companyName}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Contato: <span className="font-semibold text-slate-800">{client.clientName}</span></p>
                      <p className="text-[11px] text-slate-500 mt-1 truncate">{client.email}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Usuário:</span>
                          <span className="font-mono text-cyan-800 font-bold">{client.username}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Senha:</span>
                          <span className="font-mono text-slate-800 font-bold">{client.password}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT SHARP MASTER INSTITUTIONAL PROFILE & PASSWORD                 */}
      {/* ========================================================================= */}
      {showMasterEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Editar Matriz SHARP & Senha Master
                </h3>
              </div>
              <button
                onClick={() => setShowMasterEditModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {masterProfileMsg && (
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                masterProfileMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{masterProfileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveMasterProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nome Institucional:</label>
                <input
                  type="text"
                  required
                  value={masterName}
                  onChange={(e) => setMasterName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">E-mail Oficial:</label>
                  <input
                    type="email"
                    required
                    value={masterEmail}
                    onChange={(e) => setMasterEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Telefone / WhatsApp:</label>
                  <input
                    type="text"
                    required
                    value={masterPhone}
                    onChange={(e) => setMasterPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Descrição Institucional:</label>
                <textarea
                  rows={2}
                  value={masterDescription}
                  onChange={(e) => setMasterDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white resize-none"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-700" />
                  <span>Nova Senha Master (Opcional):</span>
                </label>
                <input
                  type="text"
                  placeholder="Deixe em branco para manter a senha atual"
                  value={masterNewPassword}
                  onChange={(e) => setMasterNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <p className="text-[11px] text-slate-500">
                  A senha padrão é <span className="font-mono font-bold">Sharp@2026</span>.
                </p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMasterEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD STAFF MEMBER                                                   */}
      {/* ========================================================================= */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Cadastrar Integrante Sharp</h3>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {staffMsg && (
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                staffMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{staffMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleAddStaff} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nome Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Matheus Oliveira"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Cargo / Função:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Estrategista & Growth"
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">E-mail Profissional:</label>
                <input
                  type="email"
                  placeholder="Ex: matheus@sharp.com.br"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Senha de Acesso Inicial:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 2026"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white font-mono"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-slate-700">Foto de Perfil:</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {staffAvatarUrl ? (
                      <img src={staffAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={addStaffFileRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoFileUpload(file, setStaffAvatarUrl);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => addStaffFileRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Selecionar Foto</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Cadastrar Integrante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT STAFF MEMBER                                                  */}
      {/* ========================================================================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Editar Integrante Sharp</h3>
              <button
                onClick={() => setEditingStaff(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editStaffMsg && (
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                editStaffMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{editStaffMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditStaff} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nome Completo:</label>
                <input
                  type="text"
                  required
                  value={editStaffName}
                  onChange={(e) => setEditStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Cargo / Função:</label>
                <input
                  type="text"
                  required
                  value={editStaffRole}
                  onChange={(e) => setEditStaffRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">E-mail:</label>
                <input
                  type="email"
                  value={editStaffEmail}
                  onChange={(e) => setEditStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Usuário:</label>
                  <input
                    type="text"
                    required
                    value={editStaffUsername}
                    onChange={(e) => setEditStaffUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Senha:</label>
                  <input
                    type="text"
                    required
                    value={editStaffPassword}
                    onChange={(e) => setEditStaffPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-slate-700">Foto de Perfil:</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {editStaffAvatarUrl ? (
                      <img src={editStaffAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={editStaffFileRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoFileUpload(file, setEditStaffAvatarUrl);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => editStaffFileRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Alterar Foto</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Salvar Dados
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD CLIENT ACCOUNT                                                 */}
      {/* ========================================================================= */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Novo Acesso de Cliente</h3>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {clientMsg && (
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                clientMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{clientMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleAddClient} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nome da Empresa / Marca:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lumina Odontologia"
                  value={clientCompanyName}
                  onChange={(e) => setClientCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nome do Contato / Sócio:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dra. Camila Vasconcelos"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">E-mail do Cliente:</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: contato@lumina.com.br"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Usuário de Login:</label>
                  <input
                    type="text"
                    placeholder="Ex: lumina"
                    value={clientUsername}
                    onChange={(e) => setClientUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Senha de Acesso:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 1234"
                    value={clientPassword}
                    onChange={(e) => setClientPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Criar Acesso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT CLIENT ACCOUNT                                                */}
      {/* ========================================================================= */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Editar Acesso de Cliente</h3>
              <button
                onClick={() => setEditingClient(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editClientMsg && (
              <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                editClientMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{editClientMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditClient} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Empresa / Marca:</label>
                <input
                  type="text"
                  required
                  value={editClientCompanyName}
                  onChange={(e) => setEditClientCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nome do Contato:</label>
                <input
                  type="text"
                  required
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">E-mail:</label>
                <input
                  type="email"
                  required
                  value={editClientEmail}
                  onChange={(e) => setEditClientEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Usuário:</label>
                  <input
                    type="text"
                    required
                    value={editClientUsername}
                    onChange={(e) => setEditClientUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Senha:</label>
                  <input
                    type="text"
                    required
                    value={editClientPassword}
                    onChange={(e) => setEditClientPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Status do Acesso:</label>
                <select
                  value={editClientStatus}
                  onChange={(e) => setEditClientStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white cursor-pointer"
                >
                  <option value="active">Ativo (Acesso Liberado)</option>
                  <option value="inactive">Inativo (Acesso Suspenso)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Salvar Dados
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE STAFF CONFIRMATION                                          */}
      {/* ========================================================================= */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-slate-800 animate-scaleIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Excluir Integrante?</h3>
              <p className="text-xs text-slate-500">
                Tem certeza que deseja remover o acesso de <span className="font-bold text-slate-800">{deletingStaff.name}</span>? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setDeletingStaff(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteStaff}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex-1 shadow-xs"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE CLIENT CONFIRMATION                                         */}
      {/* ========================================================================= */}
      {deletingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-slate-800 animate-scaleIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Excluir Acesso do Cliente?</h3>
              <p className="text-xs text-slate-500">
                Tem certeza que deseja remover as credenciais de <span className="font-bold text-slate-800">{deletingClient.companyName}</span>?
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setDeletingClient(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteClient}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex-1 shadow-xs"
              >
                Excluir Acesso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CLEAR ALL CLIENT TEST DATA                                         */}
      {/* ========================================================================= */}
      {showClearDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-slate-800 animate-scaleIn">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Limpar Clientes de Teste?</h3>
              <p className="text-xs text-slate-500">
                Esta ação removerá todos os clientes mockados de exemplo, mantendo sua equipe e configurações intactas para uso limpo em produção.
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 pt-2">
              <button
                onClick={() => setShowClearDataModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmClearAllData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex-1 shadow-xs"
              >
                Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RESTORE BACKUP JSON                                                */}
      {/* ========================================================================= */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-800 animate-scaleIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Restaurar Backup dos Dados</h3>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-500">
                Cole o conteúdo JSON do backup exportado anteriormente para restaurar clientes, projetos, etapas e equipe:
              </p>
              <textarea
                rows={6}
                value={restoreJsonInput}
                onChange={(e) => setRestoreJsonInput(e.target.value)}
                placeholder='Cole o JSON aqui...'
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:bg-white resize-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestoreBackup}
                className="px-5 py-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
              >
                Restaurar Dados
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
