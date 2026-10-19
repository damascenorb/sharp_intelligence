import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Calendar, Layers, Info, Key, LogOut, Instagram, Menu, X, 
  Activity, Cpu, Compass, Calculator, Globe2, BookOpen, Bot, Download,
  Bell, Check, AlertCircle, Clock, ArrowRight, Eye
} from 'lucide-react';
import { SharpLogo } from './SharpLogo';

interface HeaderProps {
  onOpenBrandModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBrandModal, activeTab, setActiveTab }) => {
  const { 
    userRole, 
    currentUser, 
    logout, 
    setIsAuthModalOpen,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSelectedDeliverableForFocus
  } = useApp();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tabName: string) => {
    setActiveTab(tabName);
    setMobileMenuOpen(false);
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    setIsNotificationsOpen(false);

    if (notif.projectId && notif.deliverableId) {
      setSelectedDeliverableForFocus({
        projectId: notif.projectId,
        deliverableId: notif.deliverableId
      });
    }

    if (notif.actionTab) {
      setActiveTab(notif.actionTab);
    } else {
      setActiveTab('projects');
    }
  };

  const userFilteredNotifications = notifications.filter(n => {
    if (currentUser?.role === 'sharp_admin') {
      return n.targetRole === 'sharp' || n.targetRole === 'all';
    }
    return n.targetRole === 'client' || n.targetRole === 'all';
  });

  const navItems = [
    { id: 'solutions', label: 'Soluções', icon: Layers },
    { id: 'health_check', label: 'Diagnóstico', icon: Activity },
    { id: 'platform', label: 'Metodologia', icon: Compass },
    { id: 'calculators', label: 'Ferramentas', icon: Calculator },
    { id: 'observatory', label: 'Observatório', icon: Globe2 },
    { id: 'intelligence_hub', label: 'Conteúdo', icon: BookOpen },
    { id: 'ai_assistant', label: 'IA Sharp', icon: Bot },
    { id: 'downloads', label: 'Biblioteca', icon: Download },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/90 py-2.5' 
        : 'bg-white border-b border-slate-200 py-3.5'
    }`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[52px]">
          
          {/* Logo Sharp (Left) */}
          <div 
            className="flex items-center cursor-pointer select-none shrink-0 hover:opacity-90 transition-opacity" 
            onClick={() => setActiveTab('solutions')}
            title="Ir para Soluções Sharp"
          >
            <SharpLogo size="md" showText={true} />
          </div>

          {/* Centered Desktop Menu */}
          <nav className="hidden xl:flex items-center space-x-1 text-xs font-bold uppercase tracking-wider">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-full transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isActive 
                      ? 'bg-cyan-50 text-cyan-800 font-extrabold border border-cyan-200/80 shadow-2xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right CTAs */}
          <div className="hidden lg:flex items-center space-x-2.5 shrink-0">
            
            {/* Round Search/CTA button matching attachment top right */}
            <button
              onClick={() => handleNavClick('health_check')}
              title="Buscar / Diagnóstico"
              className="w-9 h-9 rounded-full bg-slate-900 hover:bg-cyan-600 text-cyan-400 hover:text-white flex items-center justify-center shadow-xs cursor-pointer transition-transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                title="Notificações e Avaliações de Arte"
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shadow-2xs cursor-pointer transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-scaleIn">
                  <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">Central de Notificações</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-cyan-400 hover:underline font-semibold cursor-pointer"
                      >
                        Marcar todas lidas
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {userFilteredNotifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        Nenhuma notificação no momento.
                      </div>
                    ) : (
                      userFilteredNotifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start space-x-3 ${
                            !notif.read ? 'bg-cyan-50/50' : 'bg-white'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            notif.type === 'internal_art_review'
                              ? 'bg-amber-100 text-amber-700 border border-amber-300'
                              : notif.type === 'client_feedback'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                              : 'bg-cyan-100 text-cyan-700 border border-cyan-300'
                          }`}>
                            {notif.type === 'internal_art_review' ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[11px] font-bold text-slate-900 truncate">{notif.title}</span>
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-cyan-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                              {notif.message}
                            </p>
                            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                              <span>{notif.clientName || 'Geral'}</span>
                              <span className="flex items-center space-x-1 text-cyan-700 font-bold">
                                <span>Ver arte</span>
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Highlighted CTA: FALE COM A SHARP */}
            <button
              onClick={() => handleNavClick('calendar')}
              className="px-4 py-2 rounded-full bg-slate-900 hover:bg-cyan-600 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <span>FALE COM A SHARP</span>
              <span className="text-cyan-400 font-bold">✦</span>
            </button>

            {/* Login / User Status */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-slate-100 text-slate-800 p-1 pl-2.5 pr-2 rounded-full border border-slate-200 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-800 font-bold text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold leading-none text-slate-900">{currentUser.name}</div>
                </div>
                <button
                  onClick={logout}
                  title="Sair da conta"
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors flex items-center space-x-1.5 cursor-pointer border border-slate-200 shadow-2xs"
              >
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>Login</span>
              </button>
            )}

          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('calendar')}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white font-bold text-[11px] flex items-center space-x-1"
            >
              <Calendar className="w-3 h-3" />
              <span>Agendar</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 animate-fadeIn max-h-[80vh] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full p-3 rounded-xl font-bold text-xs flex items-center space-x-3 text-left ${
                  isActive ? 'bg-cyan-50 text-cyan-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-600" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={onOpenBrandModal}
            className="w-full p-3 rounded-xl font-bold text-xs flex items-center space-x-3 text-left text-slate-700 hover:bg-slate-50"
          >
            <Info className="w-4 h-4 text-cyan-600" />
            <span>Sobre a Sharp</span>
          </button>

          {!currentUser ? (
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 mt-2"
            >
              <Key className="w-4 h-4" />
              <span>Login / Acesso</span>
            </button>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
              <button onClick={logout} className="text-xs text-red-600 font-bold">Sair</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
