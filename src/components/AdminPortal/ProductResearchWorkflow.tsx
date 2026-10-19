import React, { useState } from 'react';
import { Project, ProjectActiveProduct, ResearchStudyTask, ResearchHandoff } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Lightbulb,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Send,
  Sparkles,
  Users,
  Layers,
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  ChevronRight,
  TrendingUp,
  Award,
  AlertCircle,
  MessageSquare,
  Check
} from 'lucide-react';

interface ProductResearchWorkflowProps {
  project: Project;
  product?: ProjectActiveProduct;
  onNavigateToArt?: () => void;
}

const DEFAULT_RESEARCH_TASKS: Omit<ResearchStudyTask, 'id'>[] = [
  {
    title: '1. Auditoria de Presença Digital & Concorrência',
    category: 'concorrencia',
    description: 'Investigação aprofundada dos 3 principais concorrentes no segmento, avaliando posicionamento, estética e falhas na comunicação.',
    whatToResearch: [
      'Identificar os 3 maiores players diretos na região/nicho',
      'Analisar frequência de postagem e formatos mais engajados deles',
      'Mapear comentários e reclamações de clientes dos concorrentes (gaps de mercado)',
      'Avaliar clareza da bio, links de captura e velocidade de resposta no WhatsApp'
    ],
    findings: 'Concorrentes pecam na constância e usam banco de imagens genérico. Oportunidade clara para posicionar autoridade humanizada e estética autoral.',
    status: 'completed',
    assignedTo: 'Raphael & Cristiano'
  },
  {
    title: '2. Mapeamento de Personas & Dores do ICP',
    category: 'persona',
    description: 'Compreensão detalhada do perfil de cliente ideal (ICP), identificando desejos profundos, medos e critérios de decisão.',
    whatToResearch: [
      'Qual o perfil socioeconômico e faixa etária do cliente pagador?',
      'Qual o maior medo/objeção antes de contratar o serviço?',
      'Quais termos e palavras o cliente usa para descrever sua dor?',
      'Quais provas sociais geram maior segurança na decisão de compra?'
    ],
    findings: 'Público prioritário busca segurança, sofisticação e atendimento ágil. Valorizam bastidores clínicos e clareza nos procedimentos.',
    status: 'completed',
    assignedTo: 'Raphael (Estrategista)'
  },
  {
    title: '3. Benchmarking de Território & UVP',
    category: 'posicionamento',
    description: 'Definição da Proposta Única de Valor (UVP) e território exclusivo que a marca deve ocupar na mente do consumidor.',
    whatToResearch: [
      'Qual atributo a marca pode ser a Nº 1 indiscutível na mente do público?',
      'Definição da Promessa Central e Manifesto da Marca',
      'Validação de tom de voz: Elegante, Científico, Acessível ou Provocativo?',
      'Mapeamento de palavras-chave obrigatórias e proibidas'
    ],
    findings: 'Território definido: "Excelência e Precisão com Atendimento Humanizado". Tom de voz equilibrado entre autoridade médica e acolhimento.',
    status: 'completed',
    assignedTo: 'Cristiano (Growth & Mídia)'
  },
  {
    title: '4. Linha Editorial & Pilares de Conteúdo',
    category: 'editorial',
    description: 'Estruturação dos 4 pilares temáticos de autoridade e conversão para alimentar o cronograma de postagens e criativos.',
    whatToResearch: [
      'Pilar 1 - Autoridade & Ciência: Explicações técnicas simplificadas',
      'Pilar 2 - Desejo & Transformação: Antes & Depois e casos de sucesso',
      'Pilar 3 - Conexão & Bastidores: Rotina, equipe e valores da clínica',
      'Pilar 4 - Conversão & Oferta: Chamadas diretas para avaliação e contato'
    ],
    findings: 'Divisão balanceada: 40% Autoridade / 30% Transformação / 20% Conexão / 10% Conversão Direta.',
    status: 'completed',
    assignedTo: 'Raphael & Cristiano'
  },
  {
    title: '5. Diretrizes Criativas para o Time de Arte',
    category: 'growth',
    description: 'Síntese das pesquisas em um briefing visual acionável para a equipe de designers iniciarem a produção com direcionamento preciso.',
    whatToResearch: [
      'Definir paleta de cores dominante e contraste nos feeds',
      'Especificar tipografia para títulos impactantes e corpo legível',
      'Instruir sobre enquadramentos de fotos reais da equipe',
      'Formatos prioritários: Carrosséis educativos e Stories com enquetes'
    ],
    findings: 'Paleta: Azul Profundo + Dourado Champagne + Branco Off-White. Tipografia sem serifa geométrica com elegância visual.',
    status: 'completed',
    assignedTo: 'Raphael (Estrategista)'
  }
];

export const ProductResearchWorkflow: React.FC<ProductResearchWorkflowProps> = ({
  project,
  product,
  onNavigateToArt
}) => {
  const { sendChatMessage, updateProject } = useApp();

  const [tasks, setTasks] = useState<ResearchStudyTask[]>(() => {
    return DEFAULT_RESEARCH_TASKS.map((t, idx) => ({
      ...t,
      id: `task_res_${idx}_${Date.now()}`
    }));
  });

  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [editingFindings, setEditingFindings] = useState('');
  const [handoffStatus, setHandoffStatus] = useState<'pending' | 'passed' | 'accepted'>('pending');
  const [handoffSuccessMessage, setHandoffSuccessMessage] = useState<string | null>(null);

  // Pop-up Modals State
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [handoffCustomNote, setHandoffCustomNote] = useState('');

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || tasks[0];

  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const isResearchAllCompleted = completedTasksCount === tasks.length;
  const progressPercent = Math.round((completedTasksCount / tasks.length) * 100);

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'in_progress' : 'completed';
        return {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined
        };
      }
      return t;
    }));
  };

  const handleSaveFindings = (taskId: string) => {
    if (!editingFindings.trim()) return;
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, findings: editingFindings.trim() };
      }
      return t;
    }));
    setEditingFindings('');
  };

  const handleConfirmHandoff = () => {
    setHandoffStatus('passed');
    setIsHandoffModalOpen(false);
    setHandoffSuccessMessage('🏆 Bastão passado com sucesso para Kauã & Luan! O time de criação foi notificado.');

    // Send automatic message to internal team chat
    sendChatMessage({
      senderId: 'staff-raphael',
      senderName: 'Raphael (Estrategista)',
      senderRole: 'sharp',
      channel: 'internal_team',
      content: `📢 [PASSAGEM DE BASTÃO - ${project.companyName}]: A investigação estratégica e estudo de mercado foi concluída por Raphael & Cristiano! O bastão está oficialmente passado para Kauã e Luan iniciarem a criação visual dos carrosséis e artes. Nota adicional: "${handoffCustomNote || 'Seguir os 4 pilares validados.'}"`
    });

    setTimeout(() => {
      if (onNavigateToArt) {
        onNavigateToArt();
      }
    }, 2500);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'concorrencia':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'persona':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'posicionamento':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'editorial':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6 animate-fadeIn text-slate-800">
      
      {/* Toast Notification for Handoff */}
      {handoffSuccessMessage && (
        <div className="bg-white text-slate-900 px-5 py-4 rounded-2xl shadow-xl flex items-center justify-between border border-emerald-300 animate-slideDown">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900">{handoffSuccessMessage}</p>
              <p className="text-[11px] text-emerald-800 mt-0.5 font-medium">
                Redirecionando para a área de Criação & Upload de Imagens...
              </p>
            </div>
          </div>
          {onNavigateToArt && (
            <button
              onClick={onNavigateToArt}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Ir para Artes Agora →
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Investigação, Estudo & Diagnóstico Estratégico (Trilha Horizontal)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              {completedTasksCount}/{tasks.length} Estudos Concluídos
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Nesta etapa, <strong>Raphael</strong> e <strong>Cristiano</strong> realizam a investigação aprofundada do cliente <strong>{project.companyName}</strong> para fundamentar os pilares antes de passar o bastão para <strong>Kauã</strong> criar as artes visuais.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsHandoffModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Passar Bastão (Pop-up)</span>
          </button>
        </div>
      </div>

      {/* HORIZONTAL RESEARCH TASKS LANE (Light Theme) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <span>📚</span>
            <span>Itens de Estudo & Pesquisa (Clique para ver e abrir em Pop-up)</span>
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {progressPercent}% Concluído
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {tasks.map((task, idx) => {
            const isSelected = task.id === selectedTaskId;
            const isCompleted = task.status === 'completed';

            return (
              <div
                key={task.id}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  setEditingFindings(task.findings || '');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative text-left ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 text-slate-900'
                    : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted 
                        ? 'bg-emerald-600 text-white' 
                        : isSelected 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </span>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(task.category)}`}>
                      {task.category.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold line-clamp-2 leading-tight text-slate-900">
                    {task.title}
                  </h4>

                  <p className="text-[10px] mt-1.5 line-clamp-2 text-slate-500">
                    {task.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] gap-1">
                  <span className="font-semibold text-slate-600 truncate max-w-[80px]">
                    {task.assignedTo.split('&')[0]}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTaskStatus(task.id);
                      }}
                      className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {isCompleted ? '✓ Feito' : 'Marcar'}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTaskId(task.id);
                        setEditingFindings(task.findings || '');
                        setIsStudyModalOpen(true);
                      }}
                      title="Abrir este estudo em pop-up"
                      className="px-1.5 py-0.5 rounded-md text-slate-500 hover:text-amber-800 hover:bg-amber-100 font-semibold cursor-pointer"
                    >
                      Pop-up ↗
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED STUDY TASK DETAILED VIEW & FINDINGS (Light Theme) */}
      {selectedTask && (
        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(selectedTask.category)}`}>
                  {selectedTask.category.toUpperCase()}
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedTask.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {selectedTask.description}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsStudyModalOpen(true)}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Ver em Pop-up</span>
              </button>

              <button
                onClick={() => handleToggleTaskStatus(selectedTask.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer ${
                  selectedTask.status === 'completed'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{selectedTask.status === 'completed' ? '✓ Estudo Concluído' : 'Concluir Estudo'}</span>
              </button>
            </div>
          </div>

          {/* Checklist: O Que Pesquisar */}
          <div>
            <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1.5">
              <Search className="w-3.5 h-3.5 text-amber-600" />
              <span>O que pesquisar neste item (Guia de Investigação Sharp):</span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedTask.whatToResearch.map((item, i) => (
                <div key={i} className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-slate-200/80 text-xs">
                  <div className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Descobertas & Anotações de Investigação */}
          <div>
            <h5 className="text-xs font-bold text-slate-800 mb-1.5 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Descobertas & Direcionamentos da Pesquisa:</span>
            </h5>
            
            {selectedTask.findings ? (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed relative">
                <p className="font-semibold text-slate-900">{selectedTask.findings}</p>
                <button
                  onClick={() => setEditingFindings(selectedTask.findings || '')}
                  className="text-[11px] text-indigo-600 hover:underline font-bold mt-2 block cursor-pointer"
                >
                  Editar anotações de estudo
                </button>
              </div>
            ) : null}

            {(!selectedTask.findings || editingFindings) && (
              <div className="mt-2 space-y-2">
                <textarea
                  value={editingFindings}
                  onChange={(e) => setEditingFindings(e.target.value)}
                  placeholder="Descreva aqui o que foi descoberto na pesquisa (concorrentes, dores, referências visuais)..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 placeholder:text-slate-400"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => handleSaveFindings(selectedTask.id)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Salvar Descoberta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HANDOFF BOX: PASSAGEM DE BASTÃO APÓS TÉRMINO DA PESQUISA (Clean Light Theme) */}
      <div className="rounded-3xl p-6 border border-amber-200/90 bg-amber-50/40 text-slate-900 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                PROCESSO DE PASSAGEM DE BASTÃO (HANDOFF)
              </span>
              {isResearchAllCompleted && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ✓ Investigação 100% Finalizada
                </span>
              )}
            </div>

            <h4 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
              Passar o Bastão para Kauã (Design & Criação de Artes)
            </h4>

            <p className="text-xs leading-relaxed text-slate-600">
              <strong>Quem investigou:</strong> Raphael (Estrategista) & Cristiano (Growth).<br />
              <strong>Para quem passa o bastão:</strong> <span className="text-cyan-700 font-bold">Kauã (Designer & Criação de Artes)</span> e <span className="text-indigo-700 font-bold">Luan (Líder de Arte)</span> para transformar o direcionamento nos lotes visuais, carrosséis e peças de feed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => setIsHandoffModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all cursor-pointer transform active:scale-95"
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>Configurar Handoff em Pop-up</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onNavigateToArt && (
              <button
                onClick={onNavigateToArt}
                className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Abrir Esteira de Artes</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* POP-UP MODAL 1: DETALHE DO ESTUDO / INVESTIGAÇÃO */}
      {isStudyModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryColor(selectedTask.category)}`}>
                      {selectedTask.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">• Investigador: {selectedTask.assignedTo}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {selectedTask.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsStudyModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedTask.description}
            </p>

            {/* Checklist of what to research */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Search className="w-4 h-4 text-amber-600" />
                <span>Roteiro de Pesquisa & Validação Obrigatória:</span>
              </h4>
              <div className="space-y-1.5">
                {selectedTask.whatToResearch.map((item, i) => (
                  <div key={i} className="flex items-start space-x-2 bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-800 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings Textarea */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Descobertas Registradas:</span>
              </h4>
              <textarea
                value={editingFindings || selectedTask.findings || ''}
                onChange={(e) => setEditingFindings(e.target.value)}
                placeholder="Insira as conclusões, tom de voz, UVP ou dores descobertas..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-800"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  handleToggleTaskStatus(selectedTask.id);
                  setIsStudyModalOpen(false);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  selectedTask.status === 'completed'
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {selectedTask.status === 'completed' ? 'Reabrir Estudo' : '✓ Marcar como Concluído'}
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsStudyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSaveFindings(selectedTask.id);
                    setIsStudyModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Salvar e Fechar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* POP-UP MODAL 2: PASSAGEM DE BASTÃO (HANDOFF DE RAPHAEL/CRISTIANO PARA KAUÃ) */}
      {isHandoffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-xl font-bold">
                  🏆
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-700">PROTOCOLO DE HANDOFF SHARP</span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Passagem de Bastão: Estratégia ➔ Time de Criação
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsHandoffModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Team Flow Banner */}
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">
                  R&C
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">De (Investigação):</span>
                  <strong className="text-slate-900">Raphael & Cristiano</strong>
                </div>
              </div>

              <div className="text-amber-500 font-bold text-sm">➔ ➔ ➔</div>

              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-[10px]">
                  K&L
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Para (Design & Artes):</span>
                  <strong className="text-slate-900">Kauã & Luan</strong>
                </div>
              </div>
            </div>

            {/* Directives Summary for Kauã */}
            <div className="space-y-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Diretrizes Estratégicas Validadas para o Design:</span>
              </h4>

              <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                <li><strong>Proposta Única (UVP):</strong> Excelência, precisão e autoridade humanizada para <strong>{project.companyName}</strong>.</li>
                <li><strong>Linha Editorial:</strong> 40% Autoridade e Ciência, 30% Casos de Sucesso e Transformação, 20% Conexão e Bastidores, 10% Conversão.</li>
                <li><strong>Formato Prioritário:</strong> Carrosséis educativos de 5 a 7 slides + Stories interativos com enquetes de decisão.</li>
              </ul>
            </div>

            {/* Custom Notes from Raphael/Cristiano to Kauã */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block">
                Instruções / Recado Adicional para Kauã e Luan (Opcional):
              </label>
              <textarea
                value={handoffCustomNote}
                onChange={(e) => setHandoffCustomNote(e.target.value)}
                placeholder="Ex: 'Kauã, focar na paleta azul marinho e dourado nos primeiros 3 carrosséis...' "
                rows={2}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsHandoffModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmHandoff}
                className="px-5 py-2.5 text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Confirmar e Notificar Time de Arte</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
