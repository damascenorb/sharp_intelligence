import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, Clock, CheckCircle2, FileText, Sparkles, User, 
  ArrowRight, ShieldCheck, BookOpen, Calculator
} from 'lucide-react';

interface LeadDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const LeadDashboard: React.FC<LeadDashboardProps> = ({ onNavigateTab }) => {
  const { currentUser, scheduledMeetings, cmsArticles } = useApp();

  // Find meeting for current lead user if available
  const myMeeting = scheduledMeetings.find(
    m => m.clientEmail === currentUser?.clientEmail || m.clientName === currentUser?.name
  ) || scheduledMeetings[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-50 via-cyan-50/40 to-slate-50 text-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold bg-cyan-100 text-cyan-800 border border-cyan-200 px-3 py-1 rounded-full">
            Portal do Lead — Sharp Intelligence
          </span>
          <span className="text-xs text-slate-500 font-medium">Diagnóstico Estratégico Registrado</span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Bem-vindo(a), {currentUser?.name || 'Visitante Qualificado'}!
          </h1>
          <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed">
            Seu diagnóstico empresarial foi recebido pela nossa equipe de consultores. Acompanhe abaixo o status da sua reunião e acesse nossos conteúdos e ferramentas estratégicas.
          </p>
        </div>
      </div>

      {/* Grid of Main Lead Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Próxima Reunião */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>Minha Reunião Agendada</span>
            </span>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Confirmada
            </span>
          </div>

          {myMeeting ? (
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Empresa:</span>
                  <strong className="text-slate-900">{myMeeting.companyName}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Consultor Responsável:</span>
                  <strong className="text-cyan-800">{myMeeting.specialist}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Data:</span>
                  <strong className="text-slate-900">{myMeeting.date}</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Horário Reservado:</span>
                  <strong className="text-slate-900">{myMeeting.timeSlot} hs</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Nossos consultores entrarão em contato no horário marcado.</span>
              </p>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500 space-y-2">
              <p>Nenhuma reunião agendada no momento.</p>
              <button
                onClick={() => onNavigateTab('briefing')}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl"
              >
                Agendar Diagnóstico
              </button>
            </div>
          )}
        </div>

        {/* Card 2: Status do Diagnóstico */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-cyan-600" />
              <span>Meu Diagnóstico Enviado</span>
            </span>
            <span className="text-[10px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200 px-2.5 py-0.5 rounded-full">
              Em Análise
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <p className="leading-relaxed">
              As respostas do seu formulário foram compiladas em formato executivo para a equipe preparar o diagnóstico de posicionamento e crescimento da sua empresa.
            </p>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-[11px]">
              <div className="flex items-center space-x-1 text-slate-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Diagnóstico de Marca & Presença Digital em andamento</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('lead_diagnostic')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>Ver Detalhes do Diagnóstico</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-600" />
            </button>
          </div>
        </div>

      </div>

      {/* Section: Conteúdos Recomendados */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <h3 className="text-sm font-bold text-slate-900">Conteúdos Recomendados para o seu Negócio</h3>
          </div>
          <button
            onClick={() => onNavigateTab('intelligence_hub')}
            className="text-xs font-bold text-cyan-700 hover:underline flex items-center space-x-1"
          >
            <span>Ver Todos</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cmsArticles.slice(0, 2).map(art => (
            <div key={art.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100/60 px-2.5 py-0.5 rounded-full">
                {art.category}
              </span>
              <h4 className="text-xs font-bold text-slate-900">{art.title}</h4>
              <p className="text-[11px] text-slate-600 line-clamp-2">{art.summary}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
