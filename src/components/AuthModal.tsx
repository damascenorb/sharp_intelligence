import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, ShieldCheck, Building2, KeyRound, ArrowRight } from 'lucide-react';
import { SharpLogo } from './SharpLogo';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'staff' | 'client'>('staff');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const result = login(username, password);
    if (!result.success) {
      setErrorMsg(result.message || 'Erro ao efetuar login. Verifique usuário e senha.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative text-slate-800">
        
        {/* Header decoration */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-xs">
              <SharpLogo size="sm" showText={false} textColor="text-cyan-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Portal de Acesso Sharp</h3>
              <p className="text-xs text-slate-500">Entre com seu Usuário e Senha</p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-2 bg-slate-50/80 border-b border-slate-200 flex space-x-2 px-6">
          <button
            type="button"
            onClick={() => { setActiveTab('staff'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'staff'
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>Acesso Equipe Sharp</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('client'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'client'
                ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4 text-cyan-600" />
            <span>Portal do Cliente</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Login Form with only Username and Password */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Usuário
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={activeTab === 'staff' ? 'Digite seu usuário de equipe' : 'Digite seu usuário de cliente'}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-500 text-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-500 text-slate-900 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center space-x-2"
            >
              <span>Entrar no Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Informe as credenciais fornecidas pela administração da Sharp Intelligence.
        </div>

      </div>
    </div>
  );
};

