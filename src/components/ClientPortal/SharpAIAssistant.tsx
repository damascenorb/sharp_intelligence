import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, User, RefreshCw, Cpu, ArrowRight, ArrowLeft, UserCheck, CheckCircle, Calendar,
  ClipboardCheck, Building2, BarChart3, Target, Zap, Shield, CheckCircle2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../../context/AppContext';
import { WhatsAppIcon } from '../WhatsAppIcon';

interface ChatMsg {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  source?: string;
  hasIntent?: boolean;
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

const PRESET_PROMPTS = [
  'Como aumentar a percepção de valor da minha empresa com o Sharp Brand?',
  'Como ter constância e autoridade nas redes sociais com o Sharp Presence?',
  'Qual o impacto da Inteligência de Mercado (Sharp Insights) nas minhas decisões?',
  'Como estruturar metas e OKRs para crescer com o Sharp Growth?'
];

const checkIntentKeywords = (query: string): boolean => {
  if (!query) return false;
  const q = query.toLowerCase().trim();
  const intentPhrases = [
    "conhecer os produtos", "conhecer produto", "quais produtos", "quais os produtos", "ver produtos",
    "como aplico", "como aplicar", "me ajude a aplicar", "ajude a aplicar", "ajuda para aplicar",
    "aplicar na minha empresa", "aplicar em minha empresa", "aplicar isso",
    "ha alguma forma", "há alguma forma", "existe alguma forma", "tem como fazer",
    "sim, quero", "quero sim", "pode fornecer", "forneça", "forneca",
    "diagnostico", "diagnóstico", "solicitar diagnostico", "solicitar diagnóstico", "fazer diagnóstico", "fazer diagnostico",
    "entrar em contato", "falar com especialista", "falar com consultor", "falar com a sharp",
    "quero contratar", "como contratar", "tenho interesse", "marcar reuniao", "marcar reunião", "agendar reunião", "agendar reuniao",
    "orçamento", "orcamento", "proposta", "quero ajuda", "preciso de ajuda", "me ajude"
  ];
  return intentPhrases.some(phrase => q.includes(phrase));
};

const cleanMarkdownText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/^#{1,6}\s+/gm, '')           // Remove headers ###
    .replace(/\*\*(.*?)\*\*/g, '$1')       // Remove bold **
    .replace(/\*(.*?)\*/g, '$1')           // Remove italics *
    .replace(/`{1,3}(.*?)`{1,3}/g, '$1')   // Remove backticks
    .trim();
};

export const SharpAIAssistant: React.FC<{ onGoToDiagnostic: () => void }> = ({ onGoToDiagnostic }) => {
  const { clientInfo, submitDiagnosticLead } = useApp();
  const [viewMode, setViewMode] = useState<'chat' | 'diagnostic'>('chat');
  const [hasDetectedIntent, setHasDetectedIntent] = useState(false);

  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: 'ai',
      text: `Olá, ${clientInfo?.name ? clientInfo.name : 'gestor'}! Sou a IA Sharp, sua assistente executiva alimentada pelo Gemini AI. Faça qualquer pergunta sobre estratégia de marca, presença digital, inteligência de mercado ou consultoria de crescimento da ${clientInfo?.company ? clientInfo.company : 'sua empresa'}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.6-flash',
      hasIntent: false
    }
  ]);

  // Diagnostic 5-Step Form State
  const [step, setStep] = useState<number>(1);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<DiagnosticState>({
    contactName: clientInfo?.name || '',
    companyName: clientInfo?.company || '',
    email: clientInfo?.email || '',
    phone: '',
    segment: clientInfo?.segment || '',
    employeeCount: '2 a 5 colaboradores',
    revenueStage: 'R$ 30k a R$ 80k / mês',
    mainProduct: '',
    mainDifferential: '',
    salesChannel: 'Indicações de clientes e rede de contatos',
    brandPresence: 'Apenas redes sociais básicas',
    mainBottleneck: 'Falta de atração constante de novos clientes qualificados',
    growthObjective: 'Dobrar o faturamento nos próximos 12 meses'
  });

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMsg;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages,
          userMessage: query,
          companyName: clientInfo?.company,
          segment: clientInfo?.segment
        })
      });

      if (!res.ok) {
        throw new Error('Falha na conexão com a API de IA');
      }

      const data = await res.json();
      
      const intentFound = Boolean(data.hasIntent) || checkIntentKeywords(query);
      if (intentFound) {
        setHasDetectedIntent(true);
      }

      const aiMsg: ChatMsg = {
        sender: 'ai',
        text: data.text || 'Desculpe, não consegui obter a resposta no momento.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'gemini-3.6-flash',
        hasIntent: intentFound
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Erro na chamada da IA Sharp:', err);

      const fallbackIntent = checkIntentKeywords(query);
      if (fallbackIntent) setHasDetectedIntent(true);

      const fallbackMsg: ChatMsg = {
        sender: 'ai',
        text: 'A Sharp Intelligence desenvolve soluções integradas nos pilares:\n\n1. Sharp Brand (Estratégia de Marca & Posicionamento)\n2. Sharp Presence (Presença Digital & Conteúdo)\n3. Sharp Insights (Inteligência de Mercado & SWOT)\n4. Sharp Growth (Consultoria de Crescimento & OKRs)\n\n📌 Caso queira aplicar essas soluções em seu negócio ou fazer uma análise mais profunda da sua empresa, basta me informar no chat que lhe forneço o caminho para iniciarmos seu diagnóstico!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'fallback',
        hasIntent: fallbackIntent
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const lastAiMsgs = messages.filter(m => m.sender === 'ai').slice(-2).map(m => m.text).join(' | ');
        await submitDiagnosticLead({
          contactName: formData.contactName,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          segment: formData.segment,
          chatSummary: lastAiMsgs ? cleanMarkdownText(lastAiMsgs) : 'Interação realizada via Chat IA Sharp',
          notes: `Score de Posicionamento: ${overallScore}/100 | Gargalo: ${formData.mainBottleneck} | Objetivo: ${formData.growthObjective}`,
          diagnosticData: {
            contactName: formData.contactName,
            companyName: formData.companyName,
            email: formData.email,
            phone: formData.phone,
            segment: formData.segment,
            employeeCount: formData.employeeCount,
            revenueStage: formData.revenueStage,
            mainProduct: formData.mainProduct,
            mainDifferential: formData.mainDifferential,
            salesChannel: formData.salesChannel,
            brandPresence: formData.brandPresence,
            mainBottleneck: formData.mainBottleneck,
            growthObjective: formData.growthObjective,
            overallScore,
            presencaScore,
            comercialScore,
            posicionamentoScore,
            comunicacaoScore
          }
        });
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
    <div className="max-w-[950px] mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-950 text-white rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>IA Sharp • Powered by Gemini 3.6 Flash</span>
            </span>
            
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase">
              Online
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Assistente Virtual de Estratégia IA Sharp
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium">
            Sua inteligência artificial consultiva para tirar dúvidas sobre posicionamento de marca, presença digital e consultoria de crescimento.
          </p>
        </div>

        {/* TOP CTA BUTTON TO SWITCH TO DIAGNOSTIC (Visible when intent is detected or in diagnostic mode) */}
        {(hasDetectedIntent || viewMode === 'diagnostic') && (
          <button
            onClick={() => {
              if (viewMode === 'chat') {
                setViewMode('diagnostic');
              } else {
                setViewMode('chat');
              }
            }}
            className="px-5 py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center space-x-2 shrink-0 cursor-pointer border border-cyan-400/30 animate-fadeIn"
          >
            {viewMode === 'chat' ? (
              <>
                <ClipboardCheck className="w-4 h-4 text-cyan-200" />
                <span>Solicitar Diagnóstico (5 Etapas)</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-cyan-200" />
                <span>Voltar ao Chat com IA</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Preset Prompts Chips (Visible in Chat Mode) */}
      {viewMode === 'chat' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {PRESET_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-cyan-500 text-slate-700 hover:text-cyan-700 text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      )}

      {/* QUADRO INTERATIVO - CHAT / FORMULÁRIO DE 5 ETAPAS */}
      {viewMode === 'chat' ? (
        <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 shadow-lg space-y-6 min-h-[420px] flex flex-col justify-between transition-all">
          
          {/* Messages List */}
          <div className="space-y-4 overflow-y-auto max-h-[480px] pr-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'ai' ? 'bg-slate-900 text-cyan-400 border border-slate-800' : 'bg-cyan-600 text-white'
                }`}>
                  {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-xl p-4 rounded-2xl leading-relaxed shadow-2xs space-y-2 ${
                  msg.sender === 'ai' 
                    ? 'bg-slate-50 border border-slate-200/80 text-slate-800 text-[11px] sm:text-xs font-medium' 
                    : 'bg-cyan-600 text-white text-xs sm:text-sm font-medium'
                }`}>
                  <div className="whitespace-pre-wrap">
                    {msg.sender === 'ai' ? cleanMarkdownText(msg.text) : msg.text}
                  </div>

                  {/* ACTION CTA BOX INSIDE AI MESSAGES (Only when intent is detected on specific user request, NEVER on initial message) */}
                  {idx > 0 && msg.sender === 'ai' && msg.hasIntent && (
                    <div className="mt-3 p-3.5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-xl text-white space-y-2 shadow-sm animate-fadeIn">
                      <div className="flex items-center space-x-1.5 text-cyan-400 font-extrabold text-[11px] uppercase tracking-wider">
                        <ClipboardCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Diagnóstico Estruturado Sharp</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        Identificamos seu interesse em impulsionar seu negócio. Preencha as 5 etapas da sua empresa para mapear seus gargalos e solicitar o diagnóstico da Sharp.
                      </p>
                      <button
                        onClick={() => setViewMode('diagnostic')}
                        className="w-full sm:w-auto px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-[11px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Solicitar Diagnóstico (5 Etapas)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] flex items-center justify-between pt-1 border-t ${
                    msg.sender === 'ai' ? 'border-slate-200/60 text-slate-400 font-mono' : 'border-cyan-500/50 text-cyan-200 font-mono'
                  }`}>
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'ai' && (
                      <span className="flex items-center space-x-1 text-[9px] font-extrabold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Gemini AI</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2.5 text-xs text-slate-600 font-bold bg-cyan-50/80 border border-cyan-200/80 p-3 rounded-2xl animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-600 shrink-0" />
                <span>Sintetizando recomendações com Gemini 3.6 Flash...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pergunte à IA Sharp sobre estratégias para sua empresa..."
              disabled={isLoading}
              className="flex-1 px-4 py-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium disabled:opacity-50"
            />

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMsg.trim()}
                className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>Enviar</span>
                <Send className="w-4 h-4" />
              </button>

              {/* BOTÃO SOLICITAR DIAGNÓSTICO (Visível apenas quando a IA detectar intenção/interesse) */}
              {hasDetectedIntent && (
                <button
                  type="button"
                  onClick={() => setViewMode('diagnostic')}
                  className="px-4 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md whitespace-nowrap animate-fadeIn"
                >
                  <ClipboardCheck className="w-4 h-4 text-cyan-200" />
                  <span>Solicitar Diagnóstico</span>
                </button>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* MODE 2: CHAT CONVERTS INTO 5-STEP DIAGNOSTIC FORM PANEL */
        <div className="space-y-6">
          {!isCalculated ? (
            <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 shadow-lg space-y-8 animate-fadeIn">
              
              {/* Header with Switch back to Chat */}
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
                  onClick={() => setViewMode('chat')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-cyan-600" />
                  <span>Voltar para o Chat</span>
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
                        placeholder="Descreva o carro-chefe da empresa e suas soluções principais"
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
                        placeholder="Ex: Atendimento personalizado, localização nobre, rapidez"
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
                      Seus dados e o contexto da conversa com a IA serão vinculados ao canal de leads da Sharp Intelligence para atendimento prioritário por um consultor.
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
                        placeholder="roberto@empresa.com.br"
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
                        placeholder="(11) 98765-4321"
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
                      setViewMode('chat');
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Voltar ao Chat</span>
                  </button>

                  <button
                    onClick={() => onGoToDiagnostic && onGoToDiagnostic()}
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

      {/* Specialist Bottom Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-[24px] p-6 border border-slate-700 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Atendimento Especializado por Setor</span>
          </div>
          <h3 className="text-base font-bold text-white">Deseja um estudo completo e diagnóstico aprofundado?</h3>
          <p className="text-xs text-slate-300">
            Conecte-se com um especialista de mercado e setor da Sharp Intelligence para analisar a situação específica da sua empresa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <a
            href="https://wa.me/5519995682110?text=Ol%C3%A1%2C%20gostaria%20de%20conhecer%20melhor%20as%20solu%C3%A7%C3%B5es%20da%20Sharp%20para%20meu%20neg%C3%B3cio."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
          >
            <WhatsAppIcon className="w-4 h-4" />
            <span>Especialista no WhatsApp</span>
          </a>

          <button
            onClick={() => setViewMode('diagnostic')}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md"
          >
            <span>Preencher Diagnóstico</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
