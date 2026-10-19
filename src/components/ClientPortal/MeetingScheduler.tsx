import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, CheckCircle, Sparkles, Video, ChevronRight, User, Building2, AtSign, Phone, HelpCircle } from 'lucide-react';

interface MeetingSchedulerProps {
  onMeetingBookedSuccess?: () => void;
}

export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({ onMeetingBookedSuccess }) => {
  const { bookMeeting, clientInfo, scheduledMeetings } = useApp();

  // Contact & Company Form State (Acesso Comum)
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companySocial, setCompanySocial] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bookingReason, setBookingReason] = useState('');

  // Meeting Logistics
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [meetingType, setMeetingType] = useState<'diagnostico_gratuito' | 'semanal_feedback' | ''>('');

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const availableSlots = ['09:00', '10:30', '14:00', '14:30', '16:00', '17:30'];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate || !meetingType || !selectedSpecialist) return;
    await bookMeeting(
      selectedDate,
      selectedSlot,
      selectedSpecialist,
      meetingType as 'diagnostico_gratuito' | 'semanal_feedback',
      {
        name: fullName,
        company: companyName,
        email,
        companySocial,
        phone,
        reason: bookingReason
      }
    );
    setBookingSuccess(true);
    if (onMeetingBookedSuccess) onMeetingBookedSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-cyan-50 border border-cyan-200/80 text-cyan-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Sincronização com Google Calendar API</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agendamento de Reunião & Diagnóstico Estratégico
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed">
            Reserve 30 minutos com nossos especialistas. A Sharp Intelligence desenvolve estratégias de marca, presença digital, inteligência de mercado e crescimento empresarial para PMEs que desejam ser lembradas e vender mais.
          </p>
        </div>
      </div>

      {bookingSuccess ? (
        /* Booking Success Card */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm animate-scaleIn">
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="w-8 h-8 text-cyan-600" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              Confirmado & Sincronizado
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">Reunião Agendada com Sucesso!</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              O convite foi inserido na agenda da equipe Sharp e enviado para <strong className="text-cyan-800 font-semibold">{email}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 max-w-md mx-auto text-left space-y-3 text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Empresa / @Social:</span>
              <span className="font-bold text-slate-900">{companyName} ({companySocial || 'N/I'})</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Contato:</span>
              <span className="font-semibold text-slate-900">{fullName} - {phone}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Data e Horário:</span>
              <span className="font-bold text-cyan-800">{selectedDate} às {selectedSlot}h</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Motivo:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[200px]">{bookingReason}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-slate-500">Especialista Responsável:</span>
              <span className="font-semibold text-slate-900">{selectedSpecialist}</span>
            </div>

            <div className="flex items-center space-x-2 text-cyan-800 pt-1">
              <Video className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Link do Google Meet gerado automaticamente e enviado por e-mail</span>
            </div>
          </div>

          <button
            onClick={() => setBookingSuccess(false)}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white text-xs font-bold transition-colors shadow-2xs"
          >
            Agendar Outra Reunião
          </button>
        </div>
      ) : (
        /* Calendar Booking Form */
        <form onSubmit={handleBook} className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              <span>Dados do Solicitante & Empresa</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Preencha os dados da sua empresa para direcionarmos o especialista ideal da equipe Sharp.
            </p>
          </div>

          {/* Form Fields Grid: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-cyan-600" />
                <span>Seu Nome Completo *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Roberto Silva"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-600" />
                <span>Nome da Empresa *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Lumina Odontologia"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Form Fields Grid: @ Social & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
                <AtSign className="w-3.5 h-3.5 text-cyan-600" />
                <span>@ da Empresa (Instagram / Redes) *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: @lumina.estetica"
                value={companySocial}
                onChange={e => setCompanySocial(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-600" />
                <span>Contato Telefônico / WhatsApp *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Ex: (19) 99568-2110"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              E-mail Comercial (Para convite do Google Meet) *
            </label>
            <input
              type="email"
              required
              placeholder="Ex: roberto@empresa.com.br"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Motivo do Agendamento Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center space-x-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
              <span>Motivo do Agendamento *</span>
            </label>
            <select
              required
              value={bookingReason}
              onChange={e => setBookingReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
            >
              <option value="">Ex: Selecione o motivo do agendamento...</option>
              <option value="Inteligência de Mercado (Sharp Insights) — Pesquisa & Diagnóstico">
                1. Sharp Insights — "Quero compreender meu mercado, concorrência e tomar decisões com segurança"
              </option>
              <option value="Estratégia de Marca (Sharp Brand) — Posicionamento & Identidade">
                2. Sharp Brand — "Quero que minha empresa seja percebida como referência e tenha uma marca forte"
              </option>
              <option value="Gestão de Presença Digital (Sharp Presence) — Redes Sociais & Autoridade">
                3. Sharp Presence — "Quero que minha marca tenha uma presença digital frequente, profissional e reconhecível"
              </option>
              <option value="Consultoria de Crescimento (Sharp Growth) — KPIs & Acompanhamento">
                4. Sharp Growth — "Quero monitorar meus resultados, resolver gargalos e crescer com metas"
              </option>
              <option value="Diagnóstico Completo de Rebranding & Estruturação">
                5. Diagnóstico Completo — "Quero reestruturar a marca, presença e estratégia da minha empresa"
              </option>
            </select>
          </div>

          {/* Specialist & Meeting Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Especialista Responsável *</label>
              <select
                required
                value={selectedSpecialist}
                onChange={e => setSelectedSpecialist(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
              >
                <option value="">Ex: Selecione o especialista...</option>
                <option value="Raphael (Estratégia & Diagnóstico)">Raphael (Estratégia & Diagnóstico)</option>
                <option value="Luan (Design & Direção Visual)">Luan (Design & Direção Visual)</option>
                <option value="Ingrid (Comercial & Prospecção)">Ingrid (Comercial & Prospecção)</option>
                <option value="Cristiano (Estratégia de Conteúdo)">Cristiano (Estratégia de Conteúdo)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Modalidade *</label>
              <select
                required
                value={meetingType}
                onChange={e => setMeetingType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
              >
                <option value="">Ex: Selecione a modalidade...</option>
                <option value="diagnostico_gratuito">Diagnóstico Gratuito Sharp (30 min)</option>
                <option value="semanal_feedback">Reunião Semanal de Feedback & Estratégia</option>
              </select>
            </div>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Selecione o Dia *</label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              min="2026-07-30"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Time Slots Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Horários Disponíveis de Atendimento *</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    selectedSlot === slot
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {slot}h
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">🎁 1ª Reunião 100% Gratuita e sem compromisso</span>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Confirmar Agendamento</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
