import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  Clock,
  PlusCircle,
  ListFilter,
  CheckCircle,
  AlertCircle,
  Video,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  Briefcase,
  Sparkles,
  X
} from 'lucide-react';
import { ScheduledMeeting } from '../types';

export const CalendarAgenda: React.FC = () => {
  const { currentUser, scheduledMeetings, bookMeeting, clientInfo } = useApp();

  const isSharp = currentUser?.role === 'sharp_admin';
  const isClient = currentUser?.role === 'client';

  // Client View Toggle: 'view_agenda' vs 'add_meeting'
  const [clientViewMode, setClientViewMode] = useState<'view_agenda' | 'add_meeting'>('view_agenda');

  // Month navigation (e.g., August 2026)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [selectedDay, setSelectedDay] = useState<string | null>('2026-08-04');
  const [hoveredMeetingDay, setHoveredMeetingDay] = useState<string | null>(null);

  // Form State for Booking
  const [bookDate, setBookDate] = useState('2026-08-05');
  const [bookTimeSlot, setBookTimeSlot] = useState('14:00');
  const [bookSector, setBookSector] = useState<'Estratégia' | 'Arte & Design' | 'Comercial' | 'Financeiro'>('Estratégia');
  const [bookSpecialist, setBookSpecialist] = useState('Raphael & Cristiano (Estratégia & Growth)');
  const [bookReason, setBookReason] = useState('Reunião de Alinhamento e Estratégia');
  const [bookType, setBookType] = useState<'diagnostico_gratuito' | 'semanal_feedback'>('semanal_feedback');

  const [bookingStatus, setBookingStatus] = useState<{ success: boolean; message: string } | null>(null);

  const timeSlots = ['09:00', '10:30', '14:00', '14:30', '16:00', '17:30'];

  const specialistsBySector = {
    'Estratégia': 'Raphael & Cristiano (Estratégia & Growth)',
    'Arte & Design': 'Luan (Líder de Arte)',
    'Comercial': 'Ingrid & Lucas (Comercial & Vendas)',
    'Financeiro': 'Financeiro Sharp'
  };

  const handleSectorChange = (sector: 'Estratégia' | 'Arte & Design' | 'Comercial' | 'Financeiro') => {
    setBookSector(sector);
    setBookSpecialist(specialistsBySector[sector]);
  };

  // Helper: check if date + timeSlot has conflict
  const checkTimeSlotConflict = (dateStr: string, slotStr: string, specialistStr: string) => {
    return scheduledMeetings.some(
      m => m.date === dateStr && m.timeSlot === slotStr && m.status !== 'canceled'
    );
  };

  const handleBookMeetingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus(null);

    // Conflict Check
    const hasConflict = checkTimeSlotConflict(bookDate, bookTimeSlot, bookSpecialist);
    if (hasConflict) {
      setBookingStatus({
        success: false,
        message: `O horário ${bookTimeSlot}h no dia ${bookDate} já possui uma reunião agendada na equipe Sharp. Por favor, escolha outro horário ou data.`
      });
      return;
    }

    const meetingNotes = `[Setor: ${bookSector}] ${bookReason}`;
    await bookMeeting(bookDate, bookTimeSlot, `${bookSpecialist} (${bookSector})`, bookType, {
      name: currentUser?.name || clientInfo.name,
      company: currentUser?.companyName || clientInfo.company,
      email: currentUser?.clientEmail || clientInfo.email,
      phone: clientInfo.phone,
      reason: bookReason
    });

    setBookingStatus({
      success: true,
      message: `Reunião agendada com sucesso com o setor de ${bookSector}! O convite foi sincronizado na agenda.`
    });

    setClientViewMode('view_agenda');
    setSelectedDay(bookDate);
  };

  // Filter meetings based on role
  const visibleMeetings = scheduledMeetings.filter(m => {
    if (isClient) {
      const userEmail = (currentUser?.clientEmail || clientInfo.email || '').toLowerCase();
      const userName = (currentUser?.name || clientInfo.name || '').toLowerCase();
      const userCompany = (currentUser?.companyName || clientInfo.company || '').toLowerCase();

      const mEmail = (m.clientEmail || '').toLowerCase();
      const mName = (m.clientName || '').toLowerCase();
      const mCompany = (m.companyName || '').toLowerCase();

      return (
        (userEmail && mEmail === userEmail) ||
        (userName && mName.includes(userName)) ||
        (userName && userName.includes(mName)) ||
        (userCompany && mCompany === userCompany)
      );
    }
    return true; // Sharp staff sees all meetings
  });

  // Days in Month calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 7 = August

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0-6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Map meetings by date string (YYYY-MM-DD)
  const meetingsByDate: Record<string, ScheduledMeeting[]> = {};
  visibleMeetings.forEach(m => {
    if (!meetingsByDate[m.date]) {
      meetingsByDate[m.date] = [];
    }
    meetingsByDate[m.date].push(m);
  });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn text-slate-900">
      
      {/* Top Banner Header (UNIFIED LIGHT THEME) */}
      <div className="bg-gradient-to-r from-cyan-50/90 via-white to-cyan-50/90 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-cyan-100 border border-cyan-200 text-cyan-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <CalendarIcon className="w-3.5 h-3.5 text-cyan-700" />
            <span>{isSharp ? 'Gestão da Agenda Geral Sharp' : 'Sua Agenda de Reuniões'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isSharp ? 'Agenda & Calendário da Equipe Sharp' : `Agenda de ${currentUser?.companyName || clientInfo.company || 'Cliente'}`}
          </h1>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
            {isSharp
              ? 'Visualize todos os compromissos, diagnósticos e alinhamentos semanais agendados com clientes por setor.'
              : 'Agende reuniões com os setores da Sharp (Estratégia, Arte, Comercial, Financeiro) sem conflitos de horário.'}
          </p>
        </div>

        {/* Action Buttons for CLIENT Users */}
        {isClient && (
          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
            <button
              onClick={() => setClientViewMode('add_meeting')}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
                clientViewMode === 'add_meeting'
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-cyan-500/30'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-cyan-600" />
              <span>Adicionar Nova Reunião</span>
            </button>

            <button
              onClick={() => setClientViewMode('view_agenda')}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
                clientViewMode === 'view_agenda'
                  ? 'bg-slate-900 text-white border border-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              <span>Ver Meus Agendamentos ({visibleMeetings.length})</span>
            </button>
          </div>
        )}
      </div>

      {/* STATUS BANNER */}
      {bookingStatus && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between space-x-3 shadow-2xs ${
          bookingStatus.success
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center space-x-2.5">
            {bookingStatus.success ? <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" /> : <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />}
            <span className="font-bold">{bookingStatus.message}</span>
          </div>
          <button onClick={() => setBookingStatus(null)} className="text-slate-500 hover:text-slate-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* IF CLIENT IS ADDING A NEW MEETING */}
      {isClient && clientViewMode === 'add_meeting' ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-sm space-y-6 text-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-cyan-600" />
                <span>Solicitar Novo Agendamento de Reunião</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Validação automática contra conflitos de agenda com a equipe Sharp.
              </p>
            </div>
            <button
              onClick={() => setClientViewMode('view_agenda')}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleBookMeetingSubmit} className="space-y-5">
            
            {/* Sector / Department Selection */}
            <div>
              <label className="block text-xs font-extrabold text-slate-900 mb-2 uppercase tracking-wider">
                1. Selecione o Setor Desejado na Sharp *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(['Estratégia', 'Arte & Design', 'Comercial', 'Financeiro'] as const).map(sec => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleSectorChange(sec)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-center cursor-pointer ${
                      bookSector === sec
                        ? 'bg-cyan-50 text-cyan-900 border-cyan-500 shadow-2xs font-black'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            {/* Specialist auto label */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs flex items-center space-x-2">
              <User className="w-4 h-4 text-cyan-600 shrink-0" />
              <div>
                <span className="text-slate-500 font-medium">Responsável do Setor: </span>
                <strong className="text-slate-900 font-bold">{bookSpecialist}</strong>
              </div>
            </div>

            {/* Meeting Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Modalidade do Agendamento *
                </label>
                <select
                  value={bookType}
                  onChange={e => setBookType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none"
                >
                  <option value="semanal_feedback">Reunião de Alinhamento & Feedback</option>
                  <option value="diagnostico_gratuito">Diagnóstico Estratégico Sharp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1.5">
                  Data Desejada *
                </label>
                <input
                  type="date"
                  required
                  min="2026-07-30"
                  value={bookDate}
                  onChange={e => setBookDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Time Slot Selection with Conflict Indicators */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-2">
                Horários Disponíveis (Sem Conflitos) *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {timeSlots.map(slot => {
                  const isOccupied = checkTimeSlotConflict(bookDate, slot, bookSpecialist);
                  const isSelected = bookTimeSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => setBookTimeSlot(slot)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all relative cursor-pointer ${
                        isOccupied
                          ? 'bg-slate-100 border-slate-200 text-slate-400 line-through cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-extrabold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {slot}h
                      {isOccupied && (
                        <span className="block text-[9px] text-rose-600 no-underline font-normal">Ocupado</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reason / Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">
                Motivo / Pauta da Reunião *
              </label>
              <textarea
                required
                rows={3}
                value={bookReason}
                onChange={e => setBookReason(e.target.value)}
                placeholder="Descreva brevemente o assunto que deseja tratar nesta reunião..."
                className="w-full bg-slate-50 border border-slate-200 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-900 font-medium focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>Confirmar Agendamento Sem Conflitos</span>
            </button>
          </form>
        </div>
      ) : (
        /* CALENDAR MAIN VISUAL GRID VIEW (UNIFIED LIGHT THEME) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Month Calendar Box (2 cols on large screens) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 text-slate-900">
            
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="w-5 h-5 text-cyan-600" />
                <h2 className="text-lg font-extrabold text-slate-900">
                  {monthNames[month]} {year}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>

            {/* Monthly Day Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty padding cells before first day */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 rounded-2xl bg-slate-50/50 border border-slate-100" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const monthStr = (month + 1).toString().padStart(2, '0');
                const dayStr = dayNum.toString().padStart(2, '0');
                const dateKey = `${year}-${monthStr}-${dayStr}`;

                const dayMeetings = meetingsByDate[dateKey] || [];
                const hasMeetings = dayMeetings.length > 0;
                const isSelected = selectedDay === dateKey;

                return (
                  <div
                    key={dateKey}
                    onClick={() => setSelectedDay(dateKey)}
                    onMouseEnter={() => setHoveredMeetingDay(dateKey)}
                    onMouseLeave={() => setHoveredMeetingDay(null)}
                    className={`h-16 rounded-2xl p-2 border transition-all cursor-pointer relative flex flex-col justify-between group ${
                      hasMeetings
                        ? 'bg-cyan-50 border-cyan-400 text-cyan-950 font-bold shadow-2xs hover:bg-cyan-100'
                        : isSelected
                        ? 'bg-slate-100 border-slate-400 text-slate-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-extrabold ${hasMeetings ? 'text-cyan-950' : 'text-slate-800'}`}>
                        {dayNum}
                      </span>
                      {hasMeetings && (
                        <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                      )}
                    </div>

                    {hasMeetings ? (
                      <div className="text-[10px] font-extrabold truncate bg-cyan-100 px-1.5 py-0.5 rounded border border-cyan-200 text-cyan-900">
                        {dayMeetings.length} Reunião{dayMeetings.length > 1 ? 's' : ''}
                      </div>
                    ) : (
                      <span className="text-[9px] text-slate-400 group-hover:text-slate-600">Livre</span>
                    )}

                    {/* HOVER TOOLTIP POPUP */}
                    {hasMeetings && hoveredMeetingDay === dateKey && (
                      <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border border-slate-200 rounded-2xl p-3 shadow-xl space-y-2 pointer-events-none text-left animate-fadeIn">
                        <div className="text-[11px] font-extrabold text-cyan-800 border-b border-slate-100 pb-1 flex items-center justify-between">
                          <span>{dateKey} ({dayMeetings.length} compromisso)</span>
                          <Clock className="w-3 h-3 text-cyan-600" />
                        </div>
                        {dayMeetings.map((m, idx) => (
                          <div key={idx} className="text-[10px] text-slate-700 space-y-0.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                            <div className="font-extrabold text-slate-900 flex items-center justify-between">
                              <span>{m.companyName} ({m.clientName})</span>
                              <span className="text-cyan-800 font-mono">{m.timeSlot}h</span>
                            </div>
                            <div className="text-slate-500 truncate">{m.notes || m.type}</div>
                            <div className="text-cyan-700 font-semibold">{m.specialist}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend Footer */}
            <div className="pt-4 border-t border-slate-200/80 flex items-center space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-lg bg-cyan-50 border border-cyan-400 shadow-2xs" />
                <span className="text-slate-800 font-semibold">Dia com Reunião Agendada</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded-lg bg-white border border-slate-200" />
                <span>Dia Livre</span>
              </div>
            </div>

          </div>

          {/* Side Details List for Selected Day / General List */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-600" />
                <span>{selectedDay ? `Compromissos do Dia ${selectedDay}` : 'Lista de Reuniões'}</span>
              </h3>
              {selectedDay && (
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-[10px] text-cyan-700 hover:underline font-bold"
                >
                  Ver Todos
                </button>
              )}
            </div>

            {/* List of Meetings */}
            {(() => {
              const listToDisplay = selectedDay
                ? visibleMeetings.filter(m => m.date === selectedDay)
                : visibleMeetings;

              if (listToDisplay.length === 0) {
                return (
                  <div className="text-center py-8 text-slate-400 text-xs space-y-2 font-medium">
                    <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
                    <p>Nenhuma reunião agendada para {selectedDay || 'este período'}.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {listToDisplay.map((m) => (
                    <div
                      key={m.id}
                      className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 hover:border-slate-300 transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-cyan-900 bg-cyan-100 border border-cyan-200 px-2.5 py-1 rounded-lg">
                          {m.date} às {m.timeSlot}h
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-800 flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Video className="w-3 h-3 text-emerald-600" />
                          <span>Meet Confirmado</span>
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-black text-slate-900 flex items-center space-x-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>{m.companyName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Solicitado por: <strong className="text-slate-800">{m.clientName}</strong>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="text-slate-400 text-[10px] uppercase tracking-wider font-extrabold">Pauta:</div>
                        <div className="font-medium">{m.notes || m.type}</div>
                      </div>

                      <div className="pt-1 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-200">
                        <span>Responsável: <strong className="text-cyan-800 font-extrabold">{m.specialist}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

          </div>

        </div>
      )}

    </div>
  );
};
