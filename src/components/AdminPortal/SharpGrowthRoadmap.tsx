import React, { useState } from 'react';
import { Project, ProjectActiveProduct } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Target,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Settings,
  DollarSign,
  PieChart,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';

interface SharpGrowthRoadmapProps {
  project: Project;
  product?: ProjectActiveProduct;
}

interface GrowthStep {
  id: number;
  title: string;
  subtitle: string;
  responsibleStaff: string; // e.g. "Cristiano (Growth)" or "Raphael & Cristiano"
  deliverables: string[];
  tasks: { id: string; label: string; completed: boolean }[];
  status: 'completed' | 'in_progress' | 'pending';
  kpisFocus: string;
  notes: string;
}

const INITIAL_GROWTH_STEPS: GrowthStep[] = [
  {
    id: 1,
    title: '1. Setup Técnico & Infraestrutura de Tracking',
    subtitle: 'Configuração integral de Business Manager, tags, pixels e eventos de conversão',
    responsibleStaff: 'Cristiano (Growth & Mídia)',
    deliverables: [
      'Business Manager verificado com autenticação de dois fatores',
      'Pixel Meta + API de Conversões (CAPI) configurada no servidor',
      'Google Tag Manager instalado com disparadores de WhatsApp e Formulário',
      'Domínio verificado e eventos de mensuração agregada configurados'
    ],
    tasks: [
      { id: 'g1-1', label: 'Criação e validação do Meta Pixel na página/site', completed: true },
      { id: 'g1-2', label: 'Configuração de eventos de clique para WhatsApp', completed: true },
      { id: 'g1-3', label: 'Testar e validar disparos no Google Tag Assistant', completed: true },
      { id: 'g1-4', label: 'Conexão da conta de anúncios ao cartão/método de faturamento', completed: true }
    ],
    status: 'completed',
    kpisFocus: 'Integridade de Dados & Mensuração Precisa (100% Tracking)',
    notes: 'Pixel e CAPI ativos com nota de qualidade de evento 8.9/10 no Gerenciador de Eventos Meta.'
  },
  {
    id: 2,
    title: '2. Estratégia de Funil & Segmentação de Públicos',
    subtitle: 'Estruturação da distribuição de verba e mapeamento de públicos frios, mornos e quentes',
    responsibleStaff: 'Raphael & Cristiano',
    deliverables: [
      'Públicos Topo de Funil (Interesses mapeados + Semelhança Lookalike 1%)',
      'Públicos Meio de Funil (Engajamento de Instagram 30/90/180 dias)',
      'Públicos Fundo de Funil (Visitantes da página + Lista de clientes CRM)',
      'Matriz de distribuição de orçamento (70% Atração / 20% Remarketing / 10% Testes)'
    ],
    tasks: [
      { id: 'g2-1', label: 'Construir públicos personalizados no Meta Ads', completed: true },
      { id: 'g2-2', label: 'Definir raio de geolocalização e raio de atendimento prioritário', completed: true },
      { id: 'g2-3', label: 'Montar planilha de distribuição de verba diária por campanha', completed: true },
      { id: 'g2-4', label: 'Alinhar objetivos de campanha (Mensagens no WhatsApp vs Leads na LP)', completed: true }
    ],
    status: 'completed',
    kpisFocus: 'Custo por Mil Impressões (CPM) & Relevância de Audiência',
    notes: 'Públicos segmentados para a região de atuação com exclusão de clientes já convertidos.'
  },
  {
    id: 3,
    title: '3. Criativos de Tráfego & Copys de Alta Conversão',
    subtitle: 'Validação dos formatos de alta performance, ganchos de 3s e ofertas irresistíveis',
    responsibleStaff: 'Raphael (Estrategista Chefe)',
    deliverables: [
      'Ganchos de abertura focados na dor e desejo imediato',
      'Variações de criativos estáticos, carrosséis de prova social e vídeos',
      'Copys com gatilhos de urgência, autoridade e CTA direto',
      'Alinhamento com o script de resposta do atendimento no WhatsApp'
    ],
    tasks: [
      { id: 'g3-1', label: 'Desenvolver 4 variações de ângulos de criativos', completed: true },
      { id: 'g3-2', label: 'Redigir copys com formato AIDA (Atenção, Interesse, Desejo, Ação)', completed: true },
      { id: 'g3-3', label: 'Adequar tamanhos para Feed (1:1/4:5) e Stories/Reels (9:16)', completed: true },
      { id: 'g3-4', label: 'Revisar conformidade com políticas de publicidade da Meta/Google', completed: true }
    ],
    status: 'in_progress',
    kpisFocus: 'CTR (Taxa de Clique) Esperada > 2.0% & Taxa de Retenção de Vídeo',
    notes: 'Lote de 4 criativos prioritários em validação com foco nos serviços de maior margem.'
  },
  {
    id: 4,
    title: '4. Lançamento de Campanhas & Testes A/B',
    subtitle: 'Subida dos conjuntos de anúncios no Meta Ads e Google Ads com monitoramento ativo',
    responsibleStaff: 'Cristiano (Growth & Mídia)',
    deliverables: [
      'Campanhas ativadas no Meta Ads (Campanha de Conversão e Mensagens)',
      'Campanhas de Google Search (Palavras-chave de fundo de funil de alta intenção)',
      'Teste A/B de Criativos vs Públicos com orçamento controlado',
      'Acompanhamento das primeiras 72 horas para estabilização de aprendizado'
    ],
    tasks: [
      { id: 'g4-1', label: 'Subir anúncios no Gerenciador de Anúncios com UTMs de rastreamento', completed: false },
      { id: 'g4-2', label: 'Verificar status de aprovação de todos os conjuntos', completed: false },
      { id: 'g4-3', label: 'Monitorar custo inicial por clique (CPC) e custo por conversa', completed: false },
      { id: 'g4-4', label: 'Validar chegada das mensagens no WhatsApp da equipe comercial', completed: false }
    ],
    status: 'pending',
    kpisFocus: 'Custo por Lead (CPL) & Volume Diário de Oportunidades',
    notes: 'Início programado para veiculação após validação final dos criativos do passo 3.'
  },
  {
    id: 5,
    title: '5. Otimização Contínua de CAC & ROAS & Escala',
    subtitle: 'Pausa de criativos ineficientes, remanejamento de verba e reuniões executivas de resultado',
    responsibleStaff: 'Raphael & Cristiano',
    deliverables: [
      'Relatórios executivos semanais de CPL, Leads Qualificados e CAC',
      'Corte cirúrgico de anúncios com métricas abaixo do benchmark',
      'Escala horizontal (novos públicos) e vertical (aumento de budget lucrativo)',
      'Reunião quinzenal de alinhamento com a diretoria do cliente'
    ],
    tasks: [
      { id: 'g5-1', label: 'Análise diária de métricas no painel de gestão Sharp Growth', completed: false },
      { id: 'g5-2', label: 'Otimização de lances e horários de maior conversão', completed: false },
      { id: 'g5-3', label: 'Ajuste fino no script de fechamento do WhatsApp conforme feedback', completed: false },
      { id: 'g5-4', label: 'Emissão de relatório de ROAS (Retorno sobre Gasto em Anúncios)', completed: false }
    ],
    status: 'pending',
    kpisFocus: 'CAC (Custo de Aquisição), ROAS (> 4x) & LTV do Cliente',
    notes: 'Processo cíclico de melhoria contínua para garantir previsibilidade de faturamento.'
  }
];

export const SharpGrowthRoadmap: React.FC<SharpGrowthRoadmapProps> = ({
  project,
  product
}) => {
  const [steps, setSteps] = useState<GrowthStep[]>(INITIAL_GROWTH_STEPS);
  const [activeStepId, setActiveStepId] = useState<number>(3); // Default to in_progress step

  // Modal States
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);

  // Editable Metrics State
  const [metrics, setMetrics] = useState({
    monthlyBudget: 'R$ 3.500 /mês',
    qualifiedLeads: '74 contatos',
    averageCpl: 'R$ 47,30',
    estimatedRoas: '5.8x'
  });

  const [tempMetrics, setTempMetrics] = useState({ ...metrics });

  const activeStep = steps.find(s => s.id === activeStepId) || steps[0];

  const handleToggleTask = (stepId: number, taskId: string) => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        const updatedTasks = s.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        const allCompleted = updatedTasks.every(t => t.completed);
        const anyCompleted = updatedTasks.some(t => t.completed);
        
        return {
          ...s,
          tasks: updatedTasks,
          status: allCompleted ? 'completed' : anyCompleted ? 'in_progress' : 'pending'
        };
      }
      return s;
    }));
  };

  const handleAdvanceStep = (stepId: number) => {
    setSteps(prev => prev.map(s => {
      if (s.id === stepId) {
        return { ...s, status: 'completed' };
      }
      if (s.id === stepId + 1 && s.status === 'pending') {
        return { ...s, status: 'in_progress' };
      }
      return s;
    }));
    if (stepId < steps.length) {
      setActiveStepId(stepId + 1);
    }
  };

  const handleSaveKpis = () => {
    setMetrics({ ...tempMetrics });
    setIsKpiModalOpen(false);
  };

  const completedStepsCount = steps.filter(s => s.status === 'completed').length;
  const overallProgress = Math.round((completedStepsCount / steps.length) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6 animate-fadeIn text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Sharp Growth • Caminho Sequencial de Performance & Tráfego
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {completedStepsCount}/{steps.length} Etapas Concluídas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Esteira exclusiva de Growth Marketing para <strong>{project.companyName}</strong>, operada diretamente por <strong>Raphael</strong> (Estratégia & Copys) e <strong>Cristiano</strong> (Mídia, Tracking & Otimização).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsKpiModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Editar KPIs (Pop-up)</span>
          </button>

          <button
            onClick={() => setIsStepModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ver Etapa em Pop-up</span>
          </button>
        </div>
      </div>

      {/* KPI DASHBOARD METRICS SUMMARY */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50/80 border border-slate-200 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span>Investimento Mensal</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p className="text-base font-extrabold text-slate-900">{metrics.monthlyBudget}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Meta Ads + Google Ads</p>
        </div>

        <div className="bg-slate-50/80 border border-slate-200 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span>Leads Qualificados</span>
            <Target className="w-3.5 h-3.5 text-cyan-600" />
          </div>
          <p className="text-base font-extrabold text-slate-900">{metrics.qualifiedLeads}</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">+18% vs mês anterior</p>
        </div>

        <div className="bg-slate-50/80 border border-slate-200 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span>CPL Médio (Custo/Lead)</span>
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <p className="text-base font-extrabold text-slate-900">{metrics.averageCpl}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Benchmark seguro: R$ 65,00</p>
        </div>

        <div className="bg-slate-50/80 border border-slate-200 p-3.5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
            <span>ROAS Estimado</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <p className="text-base font-extrabold text-slate-900">{metrics.estimatedRoas}</p>
          <p className="text-[10px] text-amber-600 font-bold mt-0.5">Excelente retorno de vendas</p>
        </div>
      </div>

      {/* SEQUENTIAL ROADMAP PATH (O CAMINHO DO SHARP GROWTH - Light Theme) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <span>🗺️</span>
            <span>O Caminho do Sharp Growth (Trilha de 5 Etapas)</span>
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {overallProgress}% Concluído
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {steps.map((step) => {
            const isSelected = step.id === activeStepId;
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';

            return (
              <div
                key={step.id}
                onClick={() => setActiveStepId(step.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/40 hover:bg-emerald-50/70 border-emerald-200 text-slate-900'
                    : isInProgress
                    ? 'bg-amber-50/50 hover:bg-amber-50/80 border-amber-200 text-slate-900'
                    : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCompleted 
                        ? 'bg-emerald-600 text-white' 
                        : isSelected 
                        ? 'bg-emerald-700 text-white' 
                        : isInProgress 
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isCompleted ? '✓' : step.id}
                    </span>

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      isCompleted 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                        : isInProgress 
                        ? 'bg-amber-100 text-amber-800 border-amber-200' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {isCompleted ? 'Concluído' : isInProgress ? 'Em Curso' : 'Pendente'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold line-clamp-2 leading-tight text-slate-900">
                    {step.title}
                  </h4>

                  <p className="text-[10px] mt-1.5 line-clamp-2 text-slate-500">
                    {step.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] flex items-center justify-between">
                  <span className="font-semibold text-slate-600 truncate max-w-[90px]">
                    {step.responsibleStaff.split('(')[0]}
                  </span>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStepId(step.id);
                      setIsStepModalOpen(true);
                    }}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    Pop-up ↗
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE STEP DETAILED VIEW (Light Theme) */}
      {activeStep && (
        <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  {activeStep.id}
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {activeStep.title}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Responsável: {activeStep.responsibleStaff}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {activeStep.subtitle}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsStepModalOpen(true)}
                className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <span>Abrir em Pop-up</span>
              </button>

              <button
                onClick={() => handleAdvanceStep(activeStep.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>{activeStep.status === 'completed' ? 'Etapa Concluída ✓' : 'Concluir & Avançar Trilha →'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left: Deliverables list */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
              <h5 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Entregáveis Técnicos desta Etapa:</span>
              </h5>
              <div className="space-y-1.5">
                {activeStep.deliverables.map((del, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{del}</span>
                  </div>
                ))}
              </div>

              {/* KPI Focus */}
              <div className="pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">Métrica Foco: </span>
                <strong className="text-emerald-700">{activeStep.kpisFocus}</strong>
              </div>
            </div>

            {/* Right: Operational Tasks Checklist */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
              <h5 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                <span>Tarefas Operacionais de Raphael & Cristiano:</span>
              </h5>
              
              <div className="space-y-1.5">
                {activeStep.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(activeStep.id, task.id)}
                    className={`flex items-center space-x-2.5 p-2 rounded-xl border transition-all cursor-pointer text-xs ${
                      task.completed
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className={task.completed ? 'line-through text-slate-400' : ''}>
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Step Notes */}
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                <span className="font-bold text-slate-700 block mb-0.5">Anotações da Operação:</span>
                <p>{activeStep.notes}</p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* POP-UP MODAL 1: DETALHE COMPLETO DA ETAPA DE GROWTH */}
      {isStepModalOpen && activeStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-base">
                  {activeStep.id}
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase">
                    Etapa {activeStep.id} • {activeStep.responsibleStaff}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {activeStep.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsStepModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeStep.subtitle}
            </p>

            {/* Deliverables in Modal */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Entregáveis Validados:</span>
              </h4>
              <div className="space-y-1.5">
                {activeStep.deliverables.map((del, i) => (
                  <div key={i} className="flex items-start space-x-2 bg-white p-2 rounded-xl border border-slate-200 text-xs">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span className="text-slate-800">{del}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist Tasks in Modal */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                <span>Checklist de Tarefas (Clique para alternar status):</span>
              </h4>
              <div className="space-y-1.5">
                {activeStep.tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(activeStep.id, task.id)}
                    className={`flex items-center space-x-2.5 p-2.5 rounded-xl border transition-all cursor-pointer text-xs ${
                      task.completed
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className={task.completed ? 'line-through text-slate-400' : ''}>
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  handleAdvanceStep(activeStep.id);
                  setIsStepModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Concluir Etapa & Avançar Trilha →
              </button>

              <button
                type="button"
                onClick={() => setIsStepModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Fechar Pop-up
              </button>
            </div>

          </div>
        </div>
      )}

      {/* POP-UP MODAL 2: EDIÇÃO DE MÉTRICAS & KPIS */}
      {isKpiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8 text-slate-800 animate-scaleIn">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase">GESTÃO DE PERFORMANCE</span>
                  <h3 className="text-base font-bold text-slate-900">
                    Ajustar Indicadores & Metas de Tráfego
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsKpiModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Inputs Form */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Investimento Mensal em Mídia:
                </label>
                <input
                  type="text"
                  value={tempMetrics.monthlyBudget}
                  onChange={(e) => setTempMetrics({ ...tempMetrics, monthlyBudget: e.target.value })}
                  placeholder="Ex: R$ 5.000 /mês"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Volume de Leads Qualificados:
                </label>
                <input
                  type="text"
                  value={tempMetrics.qualifiedLeads}
                  onChange={(e) => setTempMetrics({ ...tempMetrics, qualifiedLeads: e.target.value })}
                  placeholder="Ex: 120 contatos"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Custo por Lead (CPL Médio):
                </label>
                <input
                  type="text"
                  value={tempMetrics.averageCpl}
                  onChange={(e) => setTempMetrics({ ...tempMetrics, averageCpl: e.target.value })}
                  placeholder="Ex: R$ 42,00"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Retorno sobre Gasto em Anúncios (ROAS):
                </label>
                <input
                  type="text"
                  value={tempMetrics.estimatedRoas}
                  onChange={(e) => setTempMetrics({ ...tempMetrics, estimatedRoas: e.target.value })}
                  placeholder="Ex: 6.2x"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsKpiModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveKpis}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Salvar Indicadores
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
