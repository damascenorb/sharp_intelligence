import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, Shield, Zap, RefreshCw, Calendar, Send, CheckCircle, 
  ArrowRight, ArrowLeft, Building2, BarChart3, Target, UserCheck, 
  ClipboardCheck, CheckCircle2, Award
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PainAnalyzerAIProps {
  onGoToCalendar?: () => void;
  initialMode?: 'ai' | 'diagnostic';
}

interface DiagnosticState {
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  segment: string;
  employeeCount: string;
  revenueStage: string;
  mainProduct: string;
  mainDifferential: string;
  salesChannel: string;
  brandPresence: string;
  mainBottleneck: string;
  growthObjective: string;
}

export const PainAnalyzerAI: React.FC<PainAnalyzerAIProps> = ({ 
  onGoToCalendar,
  initialMode = 'ai'
}) => {
  const { analyzePain, isAnalyzingPain, currentPainAnalysis, submitDiagnosticLead } = useApp();

  const [viewMode, setViewMode] = useState<'ai' | 'diagnostic'>(initialMode);
  const [challengeText, setChallengeText] = useState('');

  // Diagnostic 5-Step Form State
  const [step, setStep] = useState<number>(1);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<DiagnosticState>({
    contactName: '',
    companyName: '',
    email: '',
    phone: '',
    segment: '',
    employeeCount: '',
    revenueStage: '',
    mainProduct: '',
    mainDifferential: '',
    salesChannel: '',
    brandPresence: '',
    mainBottleneck: '',
    growthObjective: ''
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeText.trim()) return;
    await analyzePain(challengeText);
  };

  const handleNextStep = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        if (formData.contactName && formData.companyName && formData.email) {
          await submitDiagnosticLead({
            contactName: formData.contactName,
            companyName: formData.companyName,
            email: formData.email,
            phone: formData.phone,
            segment: formData.segment,
            painAnalysis: currentPainAnalysis || undefined,
            notes: `Desafio Informado: ${challengeText || 'N/A'} | Score: ${overallScore}/100 | Gargalo: ${formData.mainBottleneck} | Objetivo: ${formData.growthObjective}`
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
        setIsCalculated(true);
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Scores calculation
  const presencaScore = formData.brandPresence.includes('Profissional') ? 90 : formData.brandPresence.includes('Apenas') ? 55 : 35;
  const comercialScore = formData.salesChannel.includes('Inbound') || formData.salesChannel.includes('Ativo') ? 85 : 50;
  const posicionamentoScore = formData.mainDifferential ? 80 : 45;
  const comunicacaoScore = formData.mainBottleneck.includes('Marca') ? 40 : 75;

  const overallScore = Math.round((presencaScore + comercialScore + posicionamentoScore + comunicacaoScore) / 4);

  const chartData = [
    { label: 'Presença Digital & Marca', score: presencaScore, color: '#0284c7' },
    { label: 'Estrutura Comercial', score: comercialScore, color: '#059669' },
    { label: 'Posicionamento Mercado', score: posicionamentoScore, color: '#d97706' },
    { label: 'Comunicação Estratégica', score: comunicacaoScore, color: '#7c3aed' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-cyan-50 border border-cyan-200/80 text-cyan-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Diagnóstico com Inteligência Artificial Gemini</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analisador Inteligente de Dores Empresariais
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed">
            Descreva com suas palavras o maior problema, barreira de vendas ou desafio que sua empresa enfrenta hoje. Nossa inteligência artificial especializada irá gerar a recomendação ideal para o seu momento.
          </p>
        </div>
      </div>

      {/* QUADRO INTERATIVO - AI CHAT / DIAGNÓSTICO EM 5 ETAPAS */}
      {viewMode === 'ai' ? (
        <div className="space-y-6">
          {/* Form Box */}
          <form onSubmit={handleAnalyze} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Qual o maior desafio da sua empresa hoje?</span>
                <span className="text-[10px] text-slate-400 font-normal">Ex: Vendas estagnadas, marca amadora, falta de autoridade</span>
              </label>

              <textarea
                rows={4}
                value={challengeText}
                onChange={e => setChallengeText(e.target.value)}
                placeholder="Ex.: Temos dificuldade em atrair clientes qualificados e nossas propostas comerciais demoram para fechar..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:bg-white transition-colors leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-[11px] text-slate-500">
                ⚡ Processamento em tempo real via Gemini AI com direcionamento estratégico Sharp.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={isAnalyzingPain || !challengeText.trim()}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-xs ${
                    isAnalyzingPain || !challengeText.trim()
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-cyan-700 text-white cursor-pointer'
                  }`}
                >
                  {isAnalyzingPain ? (
                    <span className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processando Diagnóstico...</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Gerar Análise com IA</span>
                    </span>
                  )}
                </button>

                {/* BOTÃO SOLICITAR DIAGNÓSTICO AO LADO */}
                <button
                  type="button"
                  onClick={() => setViewMode('diagnostic')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  <ClipboardCheck className="w-4 h-4 text-cyan-200" />
                  <span>Solicitar Diagnóstico</span>
                </button>
              </div>
            </div>
          </form>

          {/* AI Output Display & Accept Recommendation CTA */}
          {currentPainAnalysis && (
            <div className="space-y-6 animate-scaleIn">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-cyan-600" />
                  <span>Resultado do Diagnóstico Gemini</span>
                </h2>
                <span className="text-xs font-bold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                  Análise Concluída
                </span>
              </div>

              {/* Solução Recomendada Exclusiva */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl border border-slate-700">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">Solução Recomendada Sharp</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {currentPainAnalysis.oportunidade_sugerida}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {currentPainAnalysis.diagnostico_preliminar}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-slate-300">
                    Pronto para avançar com esta indicação? Preencha as 5 etapas da sua empresa.
                  </span>
                  <button
                    onClick={() => setViewMode('diagnostic')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap"
                  >
                    <span>Aceitar Indicação & Solicitar Diagnóstico (5 Etapas)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MODE 2: QUADRO DE MAPEAMENTO ESTRUTURADO EM 5 ETAPAS */
        <div className="space-y-6">
          {!isCalculated ? (
            <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-lg space-y-8 animate-fadeIn">
              
              {/* Header with Switch back to AI */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-extrabold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full uppercase tracking-wider border border-cyan-200 inline-block">
                    Diagnóstico Estruturado em 5 Etapas
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Mapeamento de Perfil, Público & Contato
                  </h2>
                </div>
                <button
                  onClick={() => setViewMode('ai')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Voltar para IA</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <span>Etapa {step} de 5</span>
                  <span>
                    {step === 1 ? 'Empresa & Ramo' : 
                     step === 2 ? 'Produtos & Mercado' : 
                     step === 3 ? 'Presença & Marca' : 
                     step === 4 ? 'Objetivos' : 
                     'Contato Comercial'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-cyan-600 h-full transition-all duration-500"
                    style={{ width: `${(step / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* STEP 1: EMPRESA E RAMO */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-cyan-600" />
                    <span>1. Dados da Empresa e Ramo de Atuação</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Nome da Empresa *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Ex: Clínica Lumina / Grupo Alpha"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Ramo / Segmento *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.segment}
                        onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                        placeholder="Ex: Saúde & Estética / Gastronomia / Arquitetura"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Quantidade de Colaboradores / Funcionários
                      </label>
                      <select
                        value={formData.employeeCount}
                        onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium bg-slate-50 focus:bg-white"
                      >
                        <option value="">Ex: Selecione o porte...</option>
                        <option value="Apenas os sócios">Apenas os sócios</option>
                        <option value="2 a 5 colaboradores">2 a 5 colaboradores</option>
                        <option value="5 a 15 colaboradores">5 a 15 colaboradores</option>
                        <option value="15 a 50 colaboradores">15 a 50 colaboradores</option>
                        <option value="Mais de 50 colaboradores">Mais de 50 colaboradores</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Faturamento Mensal Aproximado
                      </label>
                      <select
                        value={formData.revenueStage}
                        onChange={(e) => setFormData({ ...formData, revenueStage: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium bg-slate-50 focus:bg-white"
                      >
                        <option value="">Ex: Selecione a faixa...</option>
                        <option value="Até R$ 30k / mês">Até R$ 30k / mês</option>
                        <option value="R$ 30k a R$ 80k / mês">R$ 30k a R$ 80k / mês</option>
                        <option value="R$ 80k a R$ 200k / mês">R$ 80k a R$ 200k / mês</option>
                        <option value="R$ 200k a R$ 500k / mês">R$ 200k a R$ 500k / mês</option>
                        <option value="Acima de R$ 500k / mês">Acima de R$ 500k / mês</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: PRODUTOS E MERCADO */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-cyan-600" />
                    <span>2. Produtos, Serviços e Diferenciais no Mercado</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Principais Produtos e Serviços Oferecidos
                      </label>
                      <input
                        type="text"
                        value={formData.mainProduct}
                        onChange={(e) => setFormData({ ...formData, mainProduct: e.target.value })}
                        placeholder="Ex: Consultoria empresarial, desenvolvimento de software e suporte contínuo"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Diferencial Competitivo Principal
                      </label>
                      <input
                        type="text"
                        value={formData.mainDifferential}
                        onChange={(e) => setFormData({ ...formData, mainDifferential: e.target.value })}
                        placeholder="Ex: Atendimento personalizado, metodologia ágil e equipe sênior"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        Principal Canal Atual de Atração de Clientes
                      </label>
                      <select
                        value={formData.salesChannel}
                        onChange={(e) => setFormData({ ...formData, salesChannel: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium bg-slate-50 focus:bg-white"
                      >
                        <option value="">Ex: Selecione o canal principal...</option>
                        <option value="Indicações de clientes e rede de contatos">Indicações e Boca a Boca</option>
                        <option value="Redes Sociais (Instagram, LinkedIn)">Redes Sociais Orgânicas</option>
                        <option value="Tráfego Pago (Google Ads / Meta Ads)">Tráfego Pago / Anúncios</option>
                        <option value="Vendas Ativas Prospecção B2B">Prospecção Ativa B2B</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PRESENÇA E MARCA */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-cyan-600" />
                    <span>3. Presença Digital & Percepção de Marca</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      Como é a presença digital da empresa hoje?
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Profissional: Site moderno, redes ativas e materiais de alto nível',
                        'Apenas redes sociais básicas (Instagram / WhatsApp)',
                        'Site desatualizado sem geração de contatos',
                        'Ainda não temos presença digital estruturada'
                      ].map((item) => (
                        <div
                          key={item}
                          onClick={() => setFormData({ ...formData, brandPresence: item })}
                          className={`p-4 rounded-xl border cursor-pointer transition-all text-xs font-semibold flex items-center space-x-3 ${
                            formData.brandPresence === item
                              ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            formData.brandPresence === item ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300'
                          }`}>
                            {formData.brandPresence === item && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      Qual é o maior gargalo atual para fechar mais negócios?
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Falta de atração constante de novos clientes qualificados',
                        'Dificuldade para transmitir o real valor do serviço e cobrar mais caro',
                        'Concorrentes com melhor apresentação e redes mais atraentes',
                        'Apresentação comercial e propostas despadronizadas'
                      ].map((item) => (
                        <div
                          key={item}
                          onClick={() => setFormData({ ...formData, mainBottleneck: item })}
                          className={`p-4 rounded-xl border cursor-pointer transition-all text-xs font-semibold flex items-center space-x-3 ${
                            formData.mainBottleneck === item
                              ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            formData.mainBottleneck === item ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300'
                          }`}>
                            {formData.mainBottleneck === item && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: OBJETIVOS */}
              {step === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-cyan-600" />
                    <span>4. Objetivos Estratégicos</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      O que é prioridade nos próximos 12 meses?
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        'Dobrar o faturamento nos próximos 12 meses',
                        'Reposicionar a marca para cobrar tickets maiores',
                        'Dominar o mercado regional com presença digital imbatível',
                        'Estruturar apresentação executiva e pitch de vendas'
                      ].map((item) => (
                        <div
                          key={item}
                          onClick={() => setFormData({ ...formData, growthObjective: item })}
                          className={`p-4 rounded-xl border cursor-pointer transition-all text-xs font-semibold flex items-center space-x-3 ${
                            formData.growthObjective === item
                              ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            formData.growthObjective === item ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300'
                          }`}>
                            {formData.growthObjective === item && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: CONTATO COMERCIAL */}
              {step === 5 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-1.5 border-b border-slate-100 pb-4">
                    <div className="flex items-center space-x-2 text-cyan-800 text-xs font-bold uppercase tracking-wider">
                      <UserCheck className="w-4 h-4 text-cyan-600" />
                      <span>Encaminhamento Comercial Sharp</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Preencha as informações abaixo para um analista entrar em contato
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Seus dados serão vinculados ao resultado do diagnóstico do Gemini e enviados diretamente para o nosso canal de leads para atendimento prioritário por um consultor.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Seu Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={formData.contactName}
                        onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                        placeholder="Ex: Roberto Guimarães"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Empresa *</label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Ex: Guimarães Consultoria"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail Corporativo *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Ex: roberto@empresa.com.br"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Ex: (11) 98765-4321"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Segmento de Atuação (Opcional)</label>
                      <input
                        type="text"
                        value={formData.segment}
                        onChange={e => setFormData({ ...formData, segment: e.target.value })}
                        placeholder="Ex: Saúde & Estética, Consultoria, Varejo, Gastronomia"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-cyan-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                {step > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>
                ) : <div />}

                <button
                  onClick={handleNextStep}
                  disabled={isSubmitting || (step === 5 && (!formData.contactName || !formData.companyName || !formData.email))}
                  className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-cyan-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Enviando Informações...</span>
                  ) : (
                    <>
                      <span>{step === 5 ? 'Enviar Informações para Analista Sharp' : 'Próxima Etapa'}</span>
                      {step === 5 ? <Send className="w-4 h-4 text-cyan-400" /> : <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </div>

            </div>
          ) : (
            /* RESULT REPORT VIEW */
            <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-2xl space-y-8 animate-fadeIn">
              
              {/* Top Score Banner */}
              <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-4 text-center lg:text-left space-y-2 border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">Score de Posicionamento</span>
                  <div className="text-5xl sm:text-6xl font-black text-white">{overallScore}<span className="text-2xl text-slate-500">/100</span></div>
                  <div className="inline-block bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold">
                    Alto Potencial de Expansão de Mercado
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span>Resumo da Análise Comercial ({formData.companyName || 'Sua Empresa'})</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    Sua empresa possui excelente produto e potencial de mercado no segmento de <strong className="text-white">{formData.segment || 'Atuação'}</strong>. Alinhando a identidade visual, a presença digital e a apresentação comercial, é possível elevar a percepção de valor da marca.
                  </p>
                  <div className="pt-2 text-xs font-semibold text-cyan-400 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Dados salvos no pipeline. Agende agora sua reunião de devolutiva estratégica com a equipe Sharp.</span>
                  </div>
                </div>
              </div>

              {/* Recharts Bar Chart Breakdown */}
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                  Análise Dimensional de Marca e Mercado
                </h3>
                
                <div className="h-64 w-full bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                      <XAxis dataKey="label" stroke="#475569" fontSize={11} tickLine={false} />
                      <YAxis stroke="#475569" fontSize={11} tickLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CTA Row */}
              <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-white">Próximo Passo Consultivo</h4>
                  <p className="text-xs text-slate-400">Sua análise foi gravada. Clique abaixo para escolher a data da reunião com a Sharp.</p>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setIsCalculated(false);
                      setStep(1);
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refazer</span>
                  </button>

                  <button
                    onClick={() => onGoToCalendar && onGoToCalendar()}
                    className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-cyan-500/25 flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Agendar Reunião Com Diagnóstico</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

    </div>
  );
};
