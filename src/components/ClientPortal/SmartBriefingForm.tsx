import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DiagnosticData } from '../../types';
import { Send, CheckCircle, ArrowLeft, Building2, BarChart3, Target, Sparkles, ShieldCheck, ChevronRight, Calendar, Clock } from 'lucide-react';

interface SmartBriefingFormProps {
  onBackToSolutions: () => void;
  onGoToCalendar?: () => void;
}

export const SmartBriefingForm: React.FC<SmartBriefingFormProps> = ({ onBackToSolutions, onGoToCalendar }) => {
  const { submitBriefing, bookMeeting, setClientInfo, submitDiagnosticLead } = useApp();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  // Form State matching the 5 steps in the PDF
  const [formData, setFormData] = useState<DiagnosticData>({
    // Etapa 1: Dados da Empresa
    contactName: '',
    companyName: '',
    segment: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    website: '',
    instagram: '',
    linkedin: '',

    // Etapa 2: Sobre o Negócio
    timeInMarket: '',
    employeeCount: '',
    productCount: '',
    serviceCount: '',
    revenueRange: '',
    mainProduct: '',
    mainService: '',
    mainDifferential: '',

    // Etapa 3: Mercado
    idealClients: '',
    mainCompetitors: '',
    clientAcquisitionMethod: '',
    biggestDifficulty: '',
    next12MonthsGoals: '',

    // Etapa 4: Marca & Estratégia
    hasVisualIdentity: '',
    hasPositioning: '',
    hasDigitalPresence: '',
    hasStrategicPlanning: '',
    hasMarketingTeam: '',
    hasSalesTeam: '',

    // Etapa 5: Agendamento
    createdAt: ''
  });

  // Schedule slot state for Step 5
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleChange = (field: keyof DiagnosticData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinishDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Update Client Info state first
      const newClientData = {
        name: formData.contactName,
        company: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        segment: formData.segment
      };
      setClientInfo(newClientData);

      // 2. Submit Lead to Lead Channel Sharp
      await submitDiagnosticLead({
        contactName: formData.contactName,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        segment: formData.segment,
        notes: `Smart Briefing Finalizado | Faturamento: ${formData.revenueRange} | Time: ${formData.employeeCount}`
      });

      // 3. Submit Diagnostic / Briefing to Context
      await submitBriefing({
        companyName: formData.companyName,
        segment: formData.segment,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        websiteOrSocial: formData.instagram || formData.website || '',
        revenueStage: formData.revenueRange,
        teamSize: formData.employeeCount
      });

      // 3. Book Meeting in Agenda Sharp automatically with customInfo
      await bookMeeting(
        selectedDate,
        selectedTime,
        'Raphael (Estrategista Chefe)',
        'diagnostico_gratuito',
        {
          name: formData.contactName,
          company: formData.companyName,
          email: formData.email
        }
      );

      setIsSubmitting(false);
      setSubmittedSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToSolutions}
          className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center space-x-1.5 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-600" />
          <span>Voltar ao Início</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-3 py-1 rounded-full">
            Diagnóstico Estratégico PME
          </span>
        </div>
      </div>

      {submittedSuccess ? (
        /* Success Screen & Meeting Confirmation */
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm animate-scaleIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900">Diagnóstico Concluído & Reunião Confirmada!</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Obrigado, <strong className="text-slate-900 font-bold">{formData.contactName}</strong>. As informações estratégicas da <strong className="text-cyan-800 font-bold">{formData.companyName}</strong> foram salvas com sucesso.
            </p>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 max-w-lg mx-auto text-left space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Agendamento de Diagnóstico Estratégico</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                Confirmado na Agenda Sharp
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Empresa</span>
                <span className="font-bold text-white">{formData.companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Consultor Responsável</span>
                <span className="font-bold text-cyan-300">Raphael (Estrategista Chefe)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Data Selecionada</span>
                <span className="font-bold text-white">{selectedDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Horário Reservado</span>
                <span className="font-bold text-white">{selectedTime}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              📌 Sua reunião foi registrada na nossa agenda central e a equipe Sharp apresentará a devolutiva consultiva no horário marcado.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {onGoToCalendar && (
              <button
                onClick={onGoToCalendar}
                className="w-full sm:w-auto px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
              >
                <Calendar className="w-4 h-4" />
                <span>Ver Reunião na Agenda Sharp</span>
              </button>
            )}

            <button
              onClick={onBackToSolutions}
              className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Soluções</span>
            </button>
          </div>
        </div>
      ) : (
        /* Multi-Step Diagnostic Form */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          
          {/* Progress Indicator */}
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="uppercase tracking-wider text-cyan-800">
                Etapa {step} de 5 — {
                  step === 1 ? 'Dados da Empresa' :
                  step === 2 ? 'Sobre o Negócio' :
                  step === 3 ? 'Mercado e Desafios' :
                  step === 4 ? 'Marca e Posicionamento' :
                  'Agendamento Consultivo'
                }
              </span>
              <span className="text-slate-400">{step * 20}% Concluído</span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-600 h-full transition-all duration-300 ease-out"
                style={{ width: `${step * 20}%` }}
              />
            </div>
          </div>

          {/* STEP 1: DADOS DA EMPRESA */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-cyan-600" />
                  <span>Etapa 1: Dados da Empresa</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Informe os dados básicos para identificação da sua empresa.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={e => handleChange('contactName', e.target.value)}
                    placeholder="Ex: Dra. Camila Vasconcelos"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Empresa *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={e => handleChange('companyName', e.target.value)}
                    placeholder="Ex: Lumina Odontologia"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Segmento de Atuação *</label>
                  <input
                    type="text"
                    required
                    value={formData.segment}
                    onChange={e => handleChange('segment', e.target.value)}
                    placeholder="Ex: Saúde & Estética / Gastronomia / Serviços B2B"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cidade / Estado *</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Ex: Campinas"
                      value={formData.city}
                      onChange={e => handleChange('city', e.target.value)}
                      className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Ex: SP"
                      value={formData.state}
                      onChange={e => handleChange('state', e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 uppercase text-center focus:outline-none focus:border-cyan-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    placeholder="Ex: (11) 98765-4321"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail Corporativo *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="Ex: camila@empresa.com.br"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Website (Opcional)</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={e => handleChange('website', e.target.value)}
                    placeholder="Ex: www.suaempresa.com.br"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instagram (Opcional)</label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={e => handleChange('instagram', e.target.value)}
                    placeholder="Ex: @suaempresa"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!formData.contactName || !formData.companyName || !formData.email}
                  onClick={() => setStep(2)}
                  className="px-6 py-3 bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>Próxima Etapa</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SOBRE O NEGÓCIO */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-cyan-600" />
                  <span>Etapa 2: Sobre o Negócio</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Mapeamento da estrutura comercial e capacidade operacional.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempo de Mercado</label>
                  <select
                    value={formData.timeInMarket}
                    onChange={e => handleChange('timeInMarket', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="">Ex: Selecione o tempo de mercado...</option>
                    <option value="Menos de 1 ano">Menos de 1 ano</option>
                    <option value="1 a 3 anos">1 a 3 anos</option>
                    <option value="3 a 5 anos">3 a 5 anos</option>
                    <option value="Mais de 5 anos">Mais de 5 anos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quantidade de Funcionários</label>
                  <select
                    value={formData.employeeCount}
                    onChange={e => handleChange('employeeCount', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="">Ex: Selecione a faixa de equipe...</option>
                    <option value="Apenas os sócios">Apenas os sócios</option>
                    <option value="2 a 5 colaboradores">2 a 5 colaboradores</option>
                    <option value="5 a 10 colaboradores">5 a 10 colaboradores</option>
                    <option value="10 a 30 colaboradores">10 a 30 colaboradores</option>
                    <option value="Mais de 30 colaboradores">Mais de 30 colaboradores</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Faturamento Aproximado Mensal</label>
                  <select
                    value={formData.revenueRange}
                    onChange={e => handleChange('revenueRange', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="">Ex: Selecione a faixa de faturamento...</option>
                    <option value="Até R$ 30k / mês">Até R$ 30k / mês</option>
                    <option value="R$ 30k a R$ 80k / mês">R$ 30k a R$ 80k / mês</option>
                    <option value="R$ 80k a R$ 200k / mês">R$ 80k a R$ 200k / mês</option>
                    <option value="R$ 200k a R$ 500k / mês">R$ 200k a R$ 500k / mês</option>
                    <option value="Acima de R$ 500k / mês">Acima de R$ 500k / mês</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Principal Diferencial do Negócio</label>
                  <input
                    type="text"
                    value={formData.mainDifferential}
                    onChange={e => handleChange('mainDifferential', e.target.value)}
                    placeholder="Ex: Atendimento humanizado, produto exclusivo, pontualidade"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Principais Produtos e Serviços Oferecidos</label>
                  <input
                    type="text"
                    value={formData.mainProduct}
                    onChange={e => handleChange('mainProduct', e.target.value)}
                    placeholder="Ex: Implantes de alta tecnologia, alinhadores transparentes"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-2"
                >
                  <span>Próxima Etapa</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MERCADO E DESAFIOS */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-cyan-600" />
                  <span>Etapa 3: Mercado e Desafios</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Compreensão do perfil do público-alvo e maiores gargalos de crescimento.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quem são seus clientes ideais? (ICP)</label>
                  <textarea
                    rows={2}
                    value={formData.idealClients}
                    onChange={e => handleChange('idealClients', e.target.value)}
                    placeholder="Ex: Famílias de classe A/B, gerentes de compras de indústrias, etc."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quem são seus principais concorrentes diretos?</label>
                  <input
                    type="text"
                    value={formData.mainCompetitors}
                    onChange={e => handleChange('mainCompetitors', e.target.value)}
                    placeholder="Ex: Concorrente Alpha, Empresa Beta, Grupo Gamma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Como conquista novos clientes hoje?</label>
                  <input
                    type="text"
                    value={formData.clientAcquisitionMethod}
                    onChange={e => handleChange('clientAcquisitionMethod', e.target.value)}
                    placeholder="Ex: Indicações, Instagram, prospecção ativa, representantes"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Qual a sua principal dificuldade / gargalo atualmente?</label>
                  <textarea
                    rows={2}
                    value={formData.biggestDifficulty}
                    onChange={e => handleChange('biggestDifficulty', e.target.value)}
                    placeholder="Ex: Falta de constância no fluxo de caixa, precificação baixa, pouca autoridade de marca"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Quais os objetivos para os próximos 12 meses?</label>
                  <input
                    type="text"
                    value={formData.next12MonthsGoals}
                    onChange={e => handleChange('next12MonthsGoals', e.target.value)}
                    placeholder="Ex: Dobrar o faturamento, abrir 2ª unidade, consolidar marca como premium"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-2"
                >
                  <span>Próxima Etapa</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: MARCA E ESTRATÉGIA */}
          {step === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-600" />
                  <span>Etapa 4: Marca e Estratégia</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Avaliação da estrutura de posicionamento, autoridade e vendas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Possui Identidade Visual Profissional?</label>
                  <select
                    value={formData.hasVisualIdentity}
                    onChange={e => handleChange('hasVisualIdentity', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="">Ex: Selecione o status...</option>
                    <option value="Sim">Sim, desenvolvida por agência</option>
                    <option value="Parcialmente">Parcialmente / Precisa de redesign</option>
                    <option value="Não">Não possui logotipo/manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Possui Posicionamento de Alto Valor Clarificado?</label>
                  <select
                    value={formData.hasPositioning}
                    onChange={e => handleChange('hasPositioning', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="">Ex: Selecione o posicionamento...</option>
                    <option value="Sim">Sim, somos vistos como premium</option>
                    <option value="Parcialmente">Parcialmente, brigamos por preço</option>
                    <option value="Não">Não temos discurso padronizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Possui Presença Digital Ativa e Constante?</label>
                  <select
                    value={formData.hasDigitalPresence}
                    onChange={e => handleChange('hasDigitalPresence', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="">Ex: Selecione a presença digital...</option>
                    <option value="Sim">Sim, postagens e anúncios diários</option>
                    <option value="Parcialmente">Postamos esporadicamente</option>
                    <option value="Não">Inexistente / Desatualizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Possui Planejamento Estratégico Anual?</label>
                  <select
                    value={formData.hasStrategicPlanning}
                    onChange={e => handleChange('hasStrategicPlanning', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="">Ex: Selecione o planejamento...</option>
                    <option value="Sim">Sim, metas e métricas definidas</option>
                    <option value="Não">Não, executamos no dia a dia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Possui Equipe Interna de Marketing?</label>
                  <select
                    value={formData.hasMarketingTeam}
                    onChange={e => handleChange('hasMarketingTeam', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="">Ex: Selecione a estrutura de marketing...</option>
                    <option value="Sim">Sim, equipe própria</option>
                    <option value="Terceirizado">Agência / Freelancers terceirizados</option>
                    <option value="Não">Não, os sócios fazem tudo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Possui Equipe Comercial Estruturada?</label>
                  <select
                    value={formData.hasSalesTeam}
                    onChange={e => handleChange('hasSalesTeam', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                  >
                    <option value="">Ex: Selecione a equipe comercial...</option>
                    <option value="Sim">Sim, vendedores dedicados</option>
                    <option value="Parcialmente">Apenas atendimento e orçamento</option>
                    <option value="Não">Vendas concentradas nos sócios</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-6 py-3 bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl transition-all flex items-center space-x-2"
                >
                  <span>Avançar para Agendamento</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: FINALIZAÇÃO E AGENDAMENTO */}
          {step === 5 && (
            <form onSubmit={handleFinishDiagnostic} className="space-y-5 animate-fadeIn">
              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  <span>Etapa 5: Encaminhamento Comercial Sharp & Agendamento</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Preencha as informações abaixo para um analista entrar em contato
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Seus dados e as informações deste diagnóstico serão vinculados ao canal de leads da Sharp Intelligence para atendimento prioritário por um consultor.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-cyan-800">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  <span>Selecione a Data para a Reunião Consultiva (30 min)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Data Preferencial *</label>
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Horário Disponível *</label>
                    <select
                      required
                      value={selectedTime}
                      onChange={e => setSelectedTime(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600"
                    >
                      <option value="">Ex: Selecione o horário...</option>
                      <option value="09:00">09:00 hs</option>
                      <option value="10:30">10:30 hs</option>
                      <option value="14:00">14:00 hs</option>
                      <option value="15:30">15:30 hs</option>
                      <option value="17:00">17:00 hs</option>
                    </select>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center space-x-2 pt-2 border-t border-slate-200/80">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Ao agendar, todas as respostas do seu diagnóstico serão enviadas diretamente à equipe de consultores da Sharp Intelligence.
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Registrando Agendamento...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-cyan-400" />
                      <span>Agendar Diagnóstico Estratégico</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      )}

    </div>
  );
};
