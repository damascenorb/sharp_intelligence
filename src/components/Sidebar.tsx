import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WhatsAppIcon } from './WhatsAppIcon';
import {
  Layers,
  Activity,
  Sparkles,
  Calendar,
  CheckCircle,
  Briefcase,
  Users,
  MessageSquare,
  Key,
  ShieldCheck,
  Building2,
  LogOut,
  Instagram,
  Settings,
  Lock,
  ChevronRight,
  UserCheck,
  Calculator,
  BookOpen,
  LayoutDashboard,
  FileText,
  DollarSign
} from 'lucide-react';
import { SharpLogo } from './SharpLogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, userRole, logout, changeUserPassword, setIsAuthModalOpen } = useApp();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const res = changeUserPassword(newPassword);
    if (res.success) {
      setPasswordMsg({ type: 'success', text: res.message || 'Senha alterada com sucesso!' });
      setNewPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMsg(null);
      }, 1500);
    } else {
      setPasswordMsg({ type: 'error', text: res.message || 'Erro ao alterar senha.' });
    }
  };

  const isSharp = userRole === 'sharp_admin';
  const isClient = userRole === 'client';
  const isLead = userRole === 'lead';

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen text-slate-700 transition-all duration-300 ease-in-out group shadow-md relative z-30 ${
        isHovered ? 'w-64' : 'w-20'
      }`}
    >
      
      {/* Top Branding Header */}
      <div className="p-4 border-b border-slate-200 space-y-4">
        <div className="flex items-center justify-between overflow-hidden">
          <SharpLogo size="sm" showText={isHovered} onClick={() => setActiveTab('solutions')} />
        </div>

        {/* User Badge or Guest Login Prompt */}
        {currentUser ? (
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2 overflow-hidden">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-800 font-bold text-sm shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              {isHovered && (
                <div className="overflow-hidden transition-all duration-200">
                  <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-cyan-700 font-medium truncate">
                    {isSharp ? (currentUser.staffRole || 'Equipe Sharp') : isClient ? currentUser.companyName : 'Lead Registrado'}
                  </div>
                </div>
              )}
            </div>

            {isHovered && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-slate-500 uppercase tracking-wider">
                  {isSharp ? 'Acesso Sharp' : isClient ? 'Acesso Cliente' : 'Acesso Lead'}
                </span>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="text-cyan-700 hover:underline flex items-center space-x-1 font-bold"
                >
                  <Lock className="w-2.5 h-2.5" />
                  <span>Alterar Senha</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-center overflow-hidden">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-2 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
              title="Entrar com Usuário"
            >
              <Key className="w-3.5 h-3.5 shrink-0" />
              {isHovered && <span>Entrar com Usuário</span>}
            </button>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-2.5 space-y-1.5 overflow-y-auto">
        
        {isHovered && (
          <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
            {isSharp ? 'Painel de Controle Sharp' : isClient ? 'Portal do Cliente' : isLead ? 'Portal do Lead' : 'Menu Principal'}
          </div>
        )}

        {/* LEAD MENU ITEMS */}
        {isLead && (
          <>
            <button
              onClick={() => setActiveTab('lead_dashboard')}
              title="Dashboard Lead"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'lead_dashboard'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <LayoutDashboard className="w-4 h-4 text-cyan-600 shrink-0" />
                {isHovered && <span className="truncate">Dashboard</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            <button
              onClick={() => setActiveTab('briefing')}
              title="Meu Diagnóstico"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'briefing'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <FileText className="w-4 h-4 text-cyan-600 shrink-0" />
                {isHovered && <span className="truncate">Meu Diagnóstico</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              title="Minha Reunião"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'calendar'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                {isHovered && <span className="truncate">Minha Reunião</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>
          </>
        )}

        {/* CLIENT MENU ITEMS */}
        {isClient && (
          <>
            <button
              onClick={() => setActiveTab('approval_portal')}
              title="Meus Projetos & Aprovações"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'approval_portal'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                {isHovered && <span className="truncate">Projetos & Aprovação</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            <button
              onClick={() => setActiveTab('entrepreneur_hub')}
              title="Hub do Empreendedor"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'entrepreneur_hub'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                {isHovered && <span className="truncate">Hub do Empreendedor</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              title="Agenda de Reuniões"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'calendar'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                {isHovered && <span className="truncate">Minha Agenda</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              title="Chat com a Sharp"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'chat'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <MessageSquare className="w-4 h-4 text-cyan-600 shrink-0" />
                {isHovered && <span className="truncate">Chat Direto</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>
          </>
        )}

        {/* COMMON / PUBLIC ITEMS */}
        {!isClient && (
          <button
            onClick={() => setActiveTab('solutions')}
            title="Soluções Sharp"
            className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
              activeTab === 'solutions'
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center space-x-3 shrink-0">
              <Layers className="w-4 h-4 text-cyan-600 shrink-0" />
              {isHovered && <span className="truncate">Soluções</span>}
            </span>
            {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          </button>
        )}

        <button
          onClick={() => setActiveTab('calculators')}
          title="Ferramentas Públicas"
          className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
            activeTab === 'calculators'
              ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="flex items-center space-x-3 shrink-0">
            <Calculator className="w-4 h-4 text-cyan-600 shrink-0" />
            {isHovered && <span className="truncate">Ferramentas Públicas</span>}
          </span>
          {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        </button>

        <button
          onClick={() => setActiveTab('intelligence_hub')}
          title="Conteúdos & Artigos"
          className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
            activeTab === 'intelligence_hub'
              ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span className="flex items-center space-x-3 shrink-0">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
            {isHovered && <span className="truncate">Conteúdos</span>}
          </span>
          {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        </button>

        {/* SHARP STAFF EXCLUSIVE ITEMS (ETAPA 13) */}
        {isSharp && (
          <>
            {isHovered && (
              <div className="pt-3 pb-1 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-200 mt-3 truncate">
                Menu Executivo Sharp
              </div>
            )}

            {/* 1. Overview */}
            <button
              onClick={() => setActiveTab('my_operations')}
              title="Overview"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'my_operations' || activeTab === 'overview'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <LayoutDashboard className="w-4 h-4 text-cyan-600 shrink-0" />
                {isHovered && <span className="truncate">Overview</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            {/* 2. Clientes & Contas */}
            <button
              onClick={() => setActiveTab('clients')}
              title="Clientes & Contas"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'clients' || activeTab === 'accounts'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <Users className="w-4 h-4 text-cyan-600 shrink-0" />
                {isHovered && <span className="truncate">Clientes & Contas</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            {/* 3. Comercial */}
            <button
              onClick={() => setActiveTab('crm')}
              title="Comercial"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'crm'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                {isHovered && <span className="truncate">Comercial</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            {/* 4. Financeiro */}
            <button
              onClick={() => setActiveTab('financial')}
              title="Financeiro"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'financial' || activeTab === 'pricing'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                {isHovered && <span className="truncate">Financeiro</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            {/* 5. Operação */}
            <button
              onClick={() => setActiveTab('projects')}
              title="Operação"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'projects' || activeTab === 'art_queue'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {isHovered && <span className="truncate">Operação</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            {/* 5. Diagnósticos e Ferramentas */}
            <button
              onClick={() => setActiveTab('sharp_tools')}
              title="Diagnósticos e Ferramentas"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'sharp_tools'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                {isHovered && <span className="truncate">Diagnósticos e Ferramentas</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            {/* 7. Comunicação */}
            <button
              onClick={() => setActiveTab('chat')}
              title="Comunicação"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'chat'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <MessageSquare className="w-4 h-4 text-cyan-600 shrink-0" />
                {isHovered && <span className="truncate">Comunicação</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>

            {/* 8. Equipe e Permissões */}
            <button
              onClick={() => setActiveTab('access_management')}
              title="Equipe e Permissões"
              className={`w-full p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                activeTab === 'access_management'
                  ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center space-x-3 shrink-0">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                {isHovered && <span className="truncate">Equipe e Permissões</span>}
              </span>
              {isHovered && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>
          </>
        )}

      </div>

      {/* Footer Phone, Social & Logout */}
      <div className="p-3 border-t border-slate-200 space-y-2">
        {/* Contact WhatsApp per User Request: 19 9 9568-2110 */}
        <a
          href="https://wa.me/5519995682110?text=Ol%C3%A1%2C%20gostaria%20de%20conhecer%20melhor%20as%20solu%C3%A7%C3%B5es%20da%20Sharp%20para%20meu%20neg%C3%B3cio."
          target="_blank"
          rel="noopener noreferrer"
          title="Falar com a Sharp via WhatsApp"
          className="text-[10px] text-slate-700 hover:text-emerald-700 px-2.5 py-1.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl border border-slate-200 hover:border-emerald-300 flex items-center justify-between transition-colors group cursor-pointer"
        >
          <div className="flex items-center space-x-1.5">
            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="font-bold">WhatsApp:</span>
          </div>
          <span className="font-extrabold text-emerald-700">(19) 9 9568-2110</span>
        </a>

        <a
          href="https://instagram.com/sharpintelligence"
          target="_blank"
          rel="noopener noreferrer"
          title="@sharpintelligence"
          className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-pink-600 text-xs font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
          {isHovered && <span className="truncate">@sharpintelligence</span>}
        </a>

        {currentUser && (
          <button
            onClick={logout}
            title="Sair da Conta"
            className="w-full p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isHovered && <span>Sair da Conta</span>}
          </button>
        )}
      </div>

      {/* Modal: Change Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold flex items-center space-x-2 text-slate-900">
                <Lock className="w-4 h-4 text-cyan-600" />
                <span>Alterar Minha Senha</span>
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Nova Senha</label>
                <input
                  type="password"
                  required
                  placeholder="Digite a nova senha..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              {passwordMsg && (
                <div className={`p-2.5 rounded-xl text-xs ${passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {passwordMsg.text}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Salvar Nova Senha
              </button>
            </form>
          </div>
        </div>
      )}

    </aside>
  );
};
