import React, { useState } from 'react';
import { SharpLogo } from './SharpLogo';
import { Instagram, Send, CheckCircle2, ArrowRight, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';

export const Footer: React.FC<{
  setActiveTab: (tab: string) => void;
  onOpenBrandModal: () => void;
}> = ({ setActiveTab, onOpenBrandModal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-100 text-slate-600 border-t border-slate-200/90 pt-12 pb-8 text-xs font-medium">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Section: Brand + Newsletter Radar Sharp */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8 border-b border-slate-200">
          
          <div className="lg:col-span-5 space-y-4">
            <SharpLogo size="md" showText={true} onClick={() => setActiveTab('solutions')} />
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              Plataforma de inteligência empresarial, governança de indicadores, BI e posicionamento de marca de alto valor para PMEs e empresas B2B.
            </p>
            <div className="flex items-center space-x-3 text-slate-700 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SISTEMAS OPERACIONAIS 24/7</span>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Radar Sharp • Newsletter de Inteligência B2B</span>
            </div>
            <p className="text-xs text-slate-600">
              Receba semanalmente análises do mercado brasileiro, relatórios de tendências e metodologias de gestão.
            </p>

            {subscribed ? (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 flex items-center space-x-2 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Inscrição confirmada com sucesso no Radar Sharp!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail corporativo..."
                  required
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Assinar
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Soluções & Plataforma</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => setActiveTab('solutions')} className="hover:text-cyan-700 transition-colors cursor-pointer">
                  Catálogo de Soluções
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('platform')} className="hover:text-cyan-700 transition-colors cursor-pointer">
                  Plataforma Executiva
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('health_check')} className="hover:text-cyan-700 transition-colors cursor-pointer">
                  Business Health Check
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('calculators')} className="hover:text-cyan-700 transition-colors cursor-pointer">
                  Calculadoras de ROI
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Conteúdo & Dados</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => setActiveTab('intelligence_hub')} className="hover:text-cyan-700 transition-colors cursor-pointer">
                  Intelligence Hub
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('observatory')} className="hover:text-cyan-700 transition-colors cursor-pointer">
                  Observatório de Mercado
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('downloads')} className="hover:text-cyan-700 transition-colors cursor-pointer">
                  Downloads & Templates
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Assistente & Agendamento</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <button onClick={() => setActiveTab('ai_assistant')} className="hover:text-cyan-700 transition-colors cursor-pointer">
                  Assistente IA Sharp
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('calendar')} className="hover:text-cyan-700 transition-colors cursor-pointer">
                  Agendar Diagnóstico
                </button>
              </li>
              <li>
                <button onClick={onOpenBrandModal} className="hover:text-cyan-700 transition-colors cursor-pointer">
                  Sobre a Sharp
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider">Contato & Redes</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a
                  href="https://wa.me/5519995682110?text=Ol%C3%A1%2C%20gostaria%20de%20conhecer%20melhor%20as%20solu%C3%A7%C3%B5es%20da%20Sharp%20para%20meu%20neg%C3%B3cio."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 transition-colors flex items-center space-x-1.5 font-bold text-slate-800 group"
                  title="Atendimento via WhatsApp"
                >
                  <WhatsAppIcon className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>(19) 9 9568-2110</span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-extrabold uppercase">
                    WhatsApp
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/sharpintelligence"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-600 transition-colors flex items-center space-x-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@sharpintelligence</span>
                </a>
              </li>
              <li className="text-[11px] text-slate-600 leading-snug">
                <span className="font-bold text-slate-800 block">Edifício Comercial Cetenco Plaza</span>
                <span>Av. Paulista, 1842 - Conj. 1102 • SP</span>
              </li>
              <li className="text-cyan-700 font-semibold">contato@sharpintelligence.com.br</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <span>© {new Date().getFullYear()} Sharp Intelligence • Todos os direitos reservados.</span>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-800 cursor-pointer">Privacidade</span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer">Termos de Uso</span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer">Segurança de Dados LGPD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
