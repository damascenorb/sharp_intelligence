import React, { useState } from 'react';
import { Project, ProjectStage } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  TrendingUp,
  Search,
  Check
} from 'lucide-react';

interface ClientPreProductionStageProps {
  project: Project;
  onSelectStage?: (stage: ProjectStage) => void;
}

interface StepMeta {
  stage: ProjectStage;
  number: number;
  title: string;
  subtitle: string;
  badgeColor: string;
  activeColor: string;
  icon: string;
}

const PRE_PRODUCTION_STEPS: StepMeta[] = [
  {
    stage: 'vendas_negociacao',
    number: 1,
    title: 'Vendas & Negociação',
    subtitle: 'Contrato assinado, escopo comercial fechado e ativação da conta',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    activeColor: 'bg-emerald-600 text-white',
    icon: '🤝'
  },
  {
    stage: 'onboarding',
    number: 2,
    title: 'Reunião de Onboarding',
    subtitle: 'Coleta de briefing técnico, logos em vetor, fotos e acessos Meta/Google',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    activeColor: 'bg-cyan-600 text-white',
    icon: '⚡'
  },
  {
    stage: 'kickoff',
    number: 3,
    title: 'Reunião de Kickoff',
    subtitle: 'Alinhamento executivo entre Estrategista, equipe Sharp e liderança do cliente',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    activeColor: 'bg-indigo-600 text-white',
    icon: '🎯'
  },
  {
    stage: 'investigacao_estudo',
    number: 4,
    title: 'Investigação & Estudo',
    subtitle: 'Pesquisa de mercado, concorrentes e dores do ICP (Raphael & Cristiano)',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    activeColor: 'bg-amber-600 text-white',
    icon: '🔍'
  },
  {
    stage: 'producao',
    number: 5,
    title: 'Produção & Criação',
    subtitle: 'Criação de artes visuais, carrosséis, copys e criativos (Kauã & Luan)',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    activeColor: 'bg-purple-600 text-white',
    icon: '🎨'
  },
  {
    stage: 'revisao_cliente',
    number: 6,
    title: 'Validação & Aprovações',
    subtitle: 'Validação técnica do Líder de Arte e aprovação direta com o cliente',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    activeColor: 'bg-blue-600 text-white',
    icon: '✨'
  },
  {
    stage: 'concluido',
    number: 7,
    title: 'Go-Live & Escala',
    subtitle: 'Publicação oficial, veiculação de anúncios no ar e acompanhamento de métricas',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    activeColor: 'bg-rose-600 text-white',
    icon: '🚀'
  }
];

const DEFAULT_STAGE_CHECKLISTS: Record<string, string[]> = {
  vendas_negociacao: [
    'Contrato de prestação de serviços assinado',
    'Escopo de produtos definido (Brand, Presence, Insights ou Growth)',
    'Condições de pagamento e faturamento validadas',
    'Criação da conta de acesso e dados cadastrais no portal'
  ],
  onboarding: [
    'Envio do link do formulário de Briefing Estratégico',
    'Solicitação de arquivos da marca (logotipo vetorial .AI, .EPS ou .SVG)',
    'Concessão de acesso de parceiro ao Meta Business Suite & Google Ads',
    'Recebimento do acervo fotográfico / fotos reais da equipe e espaço'
  ],
  kickoff: [
    'Realização da Reunião de Kickoff (Apresentação do time ao cliente)',
    'Definição das metas prioritárias e expectativas para o ciclo',
    'Alinhamento do cronograma de entregas e dias de postagem',
    'Confirmação dos canais oficiais de comunicação e aprovação'
  ],
  investigacao_estudo: [
    'Auditoria de concorrentes diretos e indiretos no segmento',
    'Mapeamento de Personas e Dores emocionais do ICP',
    'Benchmarking de território e Proposta Única de Valor (UVP)',
    'Definição dos 4 pilares temáticos de autoridade da linha editorial',
    'Passagem de bastão de Raphael & Cristiano para Kauã (Artes)'
  ],
  producao: [
    'Execução do primeiro lote de posts de feed e carrosséis',
    'Redação de copys persuasivas alinhadas ao tom de voz validado',
    'Criação de stories interativos com enquetes de engajamento',
    'Subida dos arquivos e artes na esteira de aprovação interna'
  ],
  revisao_cliente: [
    'Revisão técnica de grid, tipografia e contraste pelo Líder de Arte (Luan)',
    'Envio do lote para visualização e aprovação no portal do cliente',
    'Ajustes finos solicitados pelo cliente executados com agilidade',
    'Aprovação formal registrada no sistema para agendamento'
  ],
  concluido: [
    'Agendamento e publicação das peças aprovadas nos canais oficiais',
    'Ativação das campanhas de tráfego pago no Meta Ads / Google Ads',
    'Monitoramento das métricas de alcance, engajamento e CPL',
    'Emissão do relatório executivo quinzenal/mensal de resultados'
  ]
};

export const ClientPreProductionStage: React.FC<ClientPreProductionStageProps> = ({ 
  project,
  onSelectStage
}) => {
  const { 
    setProjectStage, 
    toggleStageChecklistItem, 
    addStageChecklistItem, 
    removeStageChecklistItem,
    updateProject 
  } = useApp();

  const [newChecklistText, setNewChecklistText] = useState('');
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState<ProjectStage>(project.stage);
  const [stageNotes, setStageNotes] = useState('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const currentStepIndex = PRE_PRODUCTION_STEPS.findIndex(s => s.stage === project.stage);
  const activeStepMeta = PRE_PRODUCTION_STEPS[currentStepIndex >= 0 ? currentStepIndex : 0];

  const targetModalStepMeta = PRE_PRODUCTION_STEPS.find(s => s.stage === modalStage) || activeStepMeta;

  // Stage checklist items for current project stage
  const stageChecklists = project.stageChecklists || {};
  let currentStageItems = stageChecklists[project.stage];
  
  if (!currentStageItems || currentStageItems.length === 0) {
    const defaultLabels = DEFAULT_STAGE_CHECKLISTS[project.stage] || [
      'Execução dos entregáveis prioritários da etapa',
      'Validação de conformidade com a liderança do projeto',
      'Registro de avanço na esteira operacional'
    ];
    currentStageItems = defaultLabels.map((lbl, idx) => ({
      id: `chk_${project.stage}_${idx}`,
      label: lbl,
      completed: idx < 2 // First couple as sample completed
    }));
  }

  // Stage items for the modal stage
  let modalStageItems = stageChecklists[modalStage];
  if (!modalStageItems || modalStageItems.length === 0) {
    const defaultLabels = DEFAULT_STAGE_CHECKLISTS[modalStage] || [
      'Execução dos entregáveis prioritários da etapa',
      'Validação de conformidade com a liderança do projeto',
      'Registro de avanço na esteira operacional'
    ];
    modalStageItems = defaultLabels.map((lbl, idx) => ({
      id: `chk_${modalStage}_${idx}`,
      label: lbl,
      completed: false
    }));
  }
  
  const completedCount = currentStageItems.filter(i => i.completed).length;
  const totalCount = currentStageItems.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;

  const handleStageClick = (stage: ProjectStage) => {
    setProjectStage(project.id, stage);
    setModalStage(stage);
    if (onSelectStage) {
      onSelectStage(stage);
    }
  };

  const handleOpenStageModal = (stage?: ProjectStage) => {
    setModalStage(stage || project.stage);
    setIsStageModalOpen(true);
  };

  const handleAdvanceToNextStage = () => {
    if (currentStepIndex < PRE_PRODUCTION_STEPS.length - 1) {
      const nextStage = PRE_PRODUCTION_STEPS[currentStepIndex + 1].stage;
      setProjectStage(project.id, nextStage);
      setModalStage(nextStage);
      setSaveToast(`Etapa avançada para ${PRE_PRODUCTION_STEPS[currentStepIndex + 1].title}!`);
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleAddCheckitem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    addStageChecklistItem(project.id, project.stage, newChecklistText.trim());
    setNewChecklistText('');
  };

  const handleAddModalCheckitem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    addStageChecklistItem(project.id, modalStage, newChecklistText.trim());
    setNewChecklistText('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6 animate-fadeIn text-slate-800">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-white text-slate-900 px-5 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 border border-slate-200 animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold">{saveToast}</span>
        </div>
      )}

      {/* Container Header with Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xl">{activeStepMeta.icon}</span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Etapa Atual do Cliente (Pós-Lead): {activeStepMeta.number}. {activeStepMeta.title}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${activeStepMeta.badgeColor}`}>
              {project.companyName}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Controle do ciclo de vida pós-lead: desde vendas e reuniões até investigação, criação visual, aprovação e go-live.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenStageModal(project.stage)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Ver Detalhes em Pop-up</span>
          </button>

          {currentStepIndex < PRE_PRODUCTION_STEPS.length - 1 && (
            <button
              onClick={handleAdvanceToNextStage}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Avançar Etapa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 7-STEP INTERACTIVE PROGRESSION ROADMAP (All Light Mode Cards) */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {PRE_PRODUCTION_STEPS.map((step, idx) => {
            const isCurrent = step.stage === project.stage;
            const isCompleted = idx < currentStepIndex;

            return (
              <div
                key={step.stage}
                className={`relative text-left p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-cyan-50/70 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 text-slate-900'
                    : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-cyan-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isCompleted ? '✓' : step.number}
                    </span>
                    <span className="text-xs">{step.icon}</span>
                  </div>

                  <h4 className="text-[11px] font-bold leading-tight text-slate-900 line-clamp-1">
                    {step.title}
                  </h4>
                  <p className="text-[9px] mt-0.5 line-clamp-2 leading-relaxed text-slate-500">
                    {step.subtitle}
                  </p>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between gap-1">
                  <button
                    onClick={() => handleStageClick(step.stage)}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-cyan-600 text-white'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {isCurrent ? '● Ativo' : isCompleted ? '✓ Selecionar' : 'Ativar'}
                  </button>

                  <button
                    onClick={() => handleOpenStageModal(step.stage)}
                    title="Abrir pop-up com checklist e notas"
                    className="text-[9px] text-slate-500 hover:text-cyan-700 font-semibold px-1.5 py-0.5 rounded-md hover:bg-white cursor-pointer"
                  >
                    Pop-up ↗
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stage Checklist & Team Details (Clean Light Mode) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
        
        {/* Left 2 Cols: Checklist for Current Stage */}
        <div className="lg:col-span-2 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              <h4 className="text-xs font-bold text-slate-900">
                Checklist Operacional da Etapa ({completedCount}/{totalCount})
              </h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-600">
                {progressPercent}% Concluído
              </span>
              <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {currentStageItems.map(item => (
              <div
                key={item.id}
                onClick={() => toggleStageChecklistItem(project.id, project.stage, item.id)}
                className={`flex items-start justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                  item.completed
                    ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950 font-medium'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start space-x-2.5">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                  <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-800'}>
                    {item.label}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeStageChecklistItem(project.id, project.stage, item.id);
                  }}
                  className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                  title="Remover item"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Item Form */}
          <form onSubmit={handleAddCheckitem} className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              placeholder="Adicionar nova tarefa para esta etapa..."
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!newChecklistText.trim()}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </form>
        </div>

        {/* Right 1 Col: Team Assignment & Quick Info */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5 mb-2.5">
              <Users className="w-4 h-4 text-cyan-600" />
              <span>Equipe Atribuída na Operação</span>
            </h4>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-500">Estrategista:</span>
                <strong className="text-slate-900">{project.assignedTeam?.strategist || 'Raphael'}</strong>
              </div>
              <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-500">Mídia & Growth:</span>
                <strong className="text-slate-900">{project.assignedTeam?.growth || 'Cristiano'}</strong>
              </div>
              <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-500">Criação & Artes:</span>
                <strong className="text-slate-900">Kauã & Luan</strong>
              </div>
              <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200/80">
                <span className="text-slate-500">CS & Vendas:</span>
                <strong className="text-slate-900">{project.assignedTeam?.commercial || 'Ingrid & Lucas'}</strong>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Contato: <strong className="text-slate-800">{project.clientName}</strong></span>
            <span>{project.clientPhone || '(19) 9 9568-2110'}</span>
          </div>
        </div>

      </div>

      {/* POP-UP MODAL: DETALHES E CHECKLIST DA ETAPA PÓS-LEAD */}
      {isStageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-xl">
                  {targetModalStepMeta.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-cyan-600">ETAPA {targetModalStepMeta.number} DE 7</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${targetModalStepMeta.badgeColor}`}>
                      {modalStage === project.stage ? 'Etapa Atual' : 'Em Planejamento'}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {targetModalStepMeta.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsStageModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {targetModalStepMeta.subtitle}
            </p>

            {/* Checklist Section in Modal */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                  <span>Tarefas & Entregáveis Obrigatórios desta Etapa</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {modalStageItems.filter(i => i.completed).length}/{modalStageItems.length} concluídos
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {modalStageItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleStageChecklistItem(project.id, modalStage, item.id)}
                    className={`flex items-start justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                      item.completed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start space-x-2.5">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => {}}
                        className="mt-0.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                      />
                      <span className={item.completed ? 'line-through text-slate-400' : 'text-slate-800'}>
                        {item.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStageChecklistItem(project.id, modalStage, item.id);
                      }}
                      className="text-slate-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add form inside modal */}
              <form onSubmit={handleAddModalCheckitem} className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  placeholder="Adicionar novo item a este checklist..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!newChecklistText.trim()}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  + Adicionar
                </button>
              </form>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Cliente: <strong className="text-slate-800">{project.companyName}</strong>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsStageModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Fechar
                </button>

                {modalStage !== project.stage && (
                  <button
                    type="button"
                    onClick={() => {
                      setProjectStage(project.id, modalStage);
                      setSaveToast(`Etapa alterada para ${targetModalStepMeta.title}`);
                      setTimeout(() => setSaveToast(null), 3000);
                      setIsStageModalOpen(false);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Tornar Etapa Atual
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
