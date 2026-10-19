import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, PipelineStage } from '../../types';
import { SHARP_SOLUTIONS } from '../../data/mockData';
import {
  Users,
  Calendar,
  Sparkles,
  Phone,
  Mail,
  FileText,
  Eye,
  X,
  ChevronRight,
  ChevronLeft,
  Plus,
  CheckSquare,
  Paperclip,
  MessageSquare,
  Trash2,
  UserCheck,
  Zap,
  ArrowRight,
  FolderKanban,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const LeadPipelineKanban: React.FC = () => {
  const { leads, updateLeadStage, deleteLead, scheduledMeetings, convertLeadToClientAndProject, analyzePain, isAnalyzingPain } = useApp();
  const [selectedLeadForDrawer, setSelectedLeadForDrawer] = useState<Lead | null>(null);
  const [conversionSuccessMsg, setConversionSuccessMsg] = useState<string | null>(null);

  // Stages CRM
  const columns: { id: PipelineStage; title: string; color: string }[] = [
    { id: 'novo_lead', title: '1. Novo Lead', color: 'text-cyan-800' },
    { id: 'contato_realizado', title: '2. Contato', color: 'text-blue-800' },
    { id: 'diagnostico_agendado', title: '3. Diagnóstico', color: 'text-indigo-800' },
    { id: 'reuniao_realizada', title: '4. Reunião', color: 'text-emerald-800' },
    { id: 'proposta_enviada', title: '5. Proposta', color: 'text-amber-800' },
    { id: 'negociacao', title: '6. Negociação', color: 'text-orange-800' },
    { id: 'cliente_fechado', title: '7. Cliente', color: 'text-purple-800' },
    { id: 'desqualificado', title: '8. Lead Desqualificado', color: 'text-rose-700' },
    { id: 'arquivado', title: '9. Arquivado', color: 'text-slate-600' }
  ];

  const getLeadsByStage = (stage: PipelineStage) => {
    return leads.filter(l => (l.stage || 'novo_lead') === stage);
  };

  const handleMoveStage = (leadId: string, currentStage: PipelineStage, direction: 'next' | 'prev') => {
    const stageIds = columns.map(c => c.id);
    const currentIndex = stageIds.indexOf(currentStage);
    if (currentIndex === -1) return;

    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (targetIndex >= 0 && targetIndex < stageIds.length) {
      updateLeadStage(leadId, stageIds[targetIndex]);
    }
  };

  const handleConvertToClient = (lead: Lead) => {
    const res = convertLeadToClientAndProject(lead.id);
    if (res.success) {
      setConversionSuccessMsg(`Lead "${lead.company || lead.name}" convertido com sucesso em Cliente Oficial e Projeto aberto em Onboarding!`);
      setSelectedLeadForDrawer(prev => prev ? { ...prev, stage: 'cliente_fechado' } : null);
      setTimeout(() => setConversionSuccessMsg(null), 5000);
    }
  };

  const handleRunGeminiAnalysis = async (lead: Lead) => {
    const challenge = lead.diagnosticData?.biggestDifficulty || lead.diagnosticData?.mainBottleneck || lead.notes || `Desafio de crescimento e posicionamento para a empresa ${lead.company} no segmento ${lead.segment}`;
    const result = await analyzePain(challenge);
    if (result) {
      setSelectedLeadForDrawer(prev => prev ? { ...prev, painAnalysis: result } : null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Admin Dashboard Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 bg-cyan-50 border border-cyan-200 text-cyan-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5 text-cyan-600" />
            <span>CRM & Inteligência Comercial Sharp</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Pipeline de Vendas & Mapeamento de Oportunidades</h1>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Acompanhe a jornada completa com suporte de IA: Novo Lead, Diagnóstico Estruturado, Proposta, Parecer Gemini e Conversão Direta para Projetos & Diretório de Clientes.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
          <div className="text-center px-3 border-r border-slate-200">
            <span className="block text-lg font-bold text-slate-900">{leads.length}</span>
            <span className="text-[10px] text-slate-500">Total Leads</span>
          </div>
          <div className="text-center px-3 border-r border-slate-200">
            <span className="block text-lg font-bold text-emerald-700">
              {leads.filter(l => l.stage === 'diagnostico_agendado' || l.stage === 'reuniao_realizada').length}
            </span>
            <span className="text-[10px] text-slate-500">Diagnóstico/Reunião</span>
          </div>
          <div className="text-center px-3">
            <span className="block text-lg font-bold text-purple-700">
              {leads.filter(l => l.stage === 'cliente_fechado' || l.stage === 'fechado_ganho').length}
            </span>
            <span className="text-[10px] text-slate-500">Clientes</span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {conversionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{conversionSuccessMsg}</span>
          </div>
          <button onClick={() => setConversionSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Horizontal Scrollable Kanban Board Columns */}
      <div className="flex gap-4 overflow-x-auto pb-6 min-h-[550px] scrollbar-thin">
        {columns.map(col => {
          const colLeads = getLeadsByStage(col.id);

          return (
            <div key={col.id} className="w-76 shrink-0 bg-slate-50 border border-slate-200 rounded-3xl p-4 space-y-4 flex flex-col justify-between">
              
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </span>
                <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                {colLeads.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs my-4 bg-white/50">
                    Vazio nesta etapa
                  </div>
                ) : (
                  colLeads.map(lead => {
                    const meeting = scheduledMeetings.find(m => m.clientEmail?.toLowerCase() === lead.email?.toLowerCase());

                    return (
                      <div
                        key={lead.id}
                        className="bg-white border border-slate-200 hover:border-cyan-600 rounded-2xl p-4 space-y-3 shadow-xs transition-all group relative"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-cyan-800 transition-colors">
                              {lead.company || lead.name}
                            </div>
                            {lead.diagnosticData?.overallScore && (
                              <span className="text-[9px] font-black bg-cyan-50 border border-cyan-200 text-cyan-800 px-1.5 py-0.5 rounded-md shrink-0">
                                {lead.diagnosticData.overallScore} pts
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                            <span>{lead.name}</span>
                            <span>•</span>
                            <span className="text-cyan-800 font-medium">{lead.segment}</span>
                          </div>
                        </div>

                        {/* Solutions Badge */}
                        {lead.selectedSolutions && lead.selectedSolutions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {lead.selectedSolutions.map(sId => (
                              <span key={sId} className="text-[9px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                {SHARP_SOLUTIONS.find(s => s.id === sId)?.name || sId}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* AI Insight Badge */}
                        {lead.painAnalysis?.oportunidade_sugerida && (
                          <div className="bg-slate-900 text-white rounded-xl p-2 text-[10px] space-y-0.5 border border-slate-800">
                            <div className="flex items-center justify-between text-cyan-400 font-bold text-[9px] uppercase tracking-wider">
                              <span className="flex items-center space-x-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Solução Gemini:</span>
                              </span>
                              {lead.painAnalysis.grau_urgencia && (
                                <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                                  lead.painAnalysis.grau_urgencia === 'Crítico' || lead.painAnalysis.grau_urgencia === 'Alto'
                                    ? 'bg-rose-500/30 text-rose-300'
                                    : 'bg-amber-500/30 text-amber-300'
                                }`}>
                                  {lead.painAnalysis.grau_urgencia}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-200 font-semibold truncate text-[10px]">
                              {lead.painAnalysis.oportunidade_sugerida}
                            </div>
                          </div>
                        )}

                        {/* Scheduled Meeting Notification */}
                        {meeting && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-[10px] text-emerald-800 font-semibold flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">Agendado: {meeting.date} às {meeting.timeSlot}</span>
                          </div>
                        )}

                        {/* Move Stage Actions */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleMoveStage(lead.id, col.id, 'prev')}
                              disabled={col.id === 'novo_lead'}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Mover para Etapa Anterior"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleMoveStage(lead.id, col.id, 'next')}
                              disabled={col.id === 'arquivado'}
                              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                              title="Mover para Próxima Etapa"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedLeadForDrawer(lead)}
                              className="text-[10px] font-bold text-cyan-700 hover:underline flex items-center space-x-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Ficha</span>
                            </button>

                            <button
                              onClick={() => deleteLead(lead.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Excluir Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Drawer Details Modal */}
      {selectedLeadForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg h-full p-6 sm:p-8 space-y-6 overflow-y-auto animate-slideLeft shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider block">Ficha Comercial do Lead</span>
                <h2 className="text-xl font-extrabold text-slate-900">{selectedLeadForDrawer.company}</h2>
              </div>
              <button
                onClick={() => setSelectedLeadForDrawer(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action: Convert to Official Client */}
            <div className="bg-linear-to-r from-cyan-900 to-slate-900 text-white p-4 rounded-2xl space-y-2 border border-cyan-800 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-extrabold uppercase tracking-wide">Ação de Conversão Sharp</span>
                </div>
                {selectedLeadForDrawer.stage === 'cliente_fechado' && (
                  <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 rounded-full text-[10px] font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Já é Cliente</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Transforme este lead imediatamente em cliente oficial cadastrado no Diretório e crie o projeto correspondente na esteira de Onboarding.
              </p>
              <button
                onClick={() => handleConvertToClient(selectedLeadForDrawer)}
                className="w-full mt-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Converter em Cliente & Abrir Projeto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Contato</span>
                  <strong className="text-slate-900">{selectedLeadForDrawer.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Segmento</span>
                  <strong className="text-slate-900">{selectedLeadForDrawer.segment}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">E-mail</span>
                  <a href={`mailto:${selectedLeadForDrawer.email}`} className="text-cyan-800 font-semibold hover:underline truncate block">
                    {selectedLeadForDrawer.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Telefone</span>
                  <a href={`tel:${selectedLeadForDrawer.phone}`} className="text-slate-900 font-semibold">
                    {selectedLeadForDrawer.phone}
                  </a>
                </div>
              </div>

              {/* Diagnóstico Estruturado (Preenchido no IA Sharp / Solicitar Diagnóstico) */}
              {selectedLeadForDrawer.diagnosticData && (
                <div className="bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-5 rounded-2xl space-y-3.5 border border-cyan-500/30 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center space-x-2 text-cyan-400 font-extrabold text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Diagnóstico Estruturado (IA Sharp)</span>
                    </div>
                    {selectedLeadForDrawer.diagnosticData.overallScore && (
                      <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded-full text-[10px] font-black">
                        Score: {selectedLeadForDrawer.diagnosticData.overallScore}/100
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                    {selectedLeadForDrawer.diagnosticData.employeeCount && (
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Porte / Equipe:</span>
                        <span className="text-slate-200 font-semibold">{selectedLeadForDrawer.diagnosticData.employeeCount}</span>
                      </div>
                    )}
                    {selectedLeadForDrawer.diagnosticData.revenueStage && (
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Faturamento Mensal:</span>
                        <span className="text-slate-200 font-semibold">{selectedLeadForDrawer.diagnosticData.revenueStage}</span>
                      </div>
                    )}
                    {selectedLeadForDrawer.diagnosticData.mainProduct && (
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Produto / Serviço Principal:</span>
                        <span className="text-slate-200 font-semibold">{selectedLeadForDrawer.diagnosticData.mainProduct}</span>
                      </div>
                    )}
                    {selectedLeadForDrawer.diagnosticData.mainDifferential && (
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Diferencial Competitivo:</span>
                        <span className="text-slate-200 font-semibold">{selectedLeadForDrawer.diagnosticData.mainDifferential}</span>
                      </div>
                    )}
                    {selectedLeadForDrawer.diagnosticData.salesChannel && (
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Canal Principal de Vendas:</span>
                        <span className="text-slate-200 font-semibold">{selectedLeadForDrawer.diagnosticData.salesChannel}</span>
                      </div>
                    )}
                    {selectedLeadForDrawer.diagnosticData.brandPresence && (
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Presença de Marca & Digital:</span>
                        <span className="text-slate-200 font-semibold">{selectedLeadForDrawer.diagnosticData.brandPresence}</span>
                      </div>
                    )}
                    {selectedLeadForDrawer.diagnosticData.mainBottleneck && (
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] text-amber-400 font-bold block uppercase">Maior Gargalo Comercial:</span>
                        <span className="text-amber-200 font-semibold">{selectedLeadForDrawer.diagnosticData.mainBottleneck}</span>
                      </div>
                    )}
                    {selectedLeadForDrawer.diagnosticData.growthObjective && (
                      <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] text-emerald-400 font-bold block uppercase">Objetivo Estratégico (12 Meses):</span>
                        <span className="text-emerald-200 font-semibold">{selectedLeadForDrawer.diagnosticData.growthObjective}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Gemini Parecer & Diagnóstico */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-3 border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-cyan-400 font-bold text-[10px] uppercase tracking-wider">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Parecer & Solução Recomendada pelo Gemini</span>
                  </div>
                  <button
                    onClick={() => handleRunGeminiAnalysis(selectedLeadForDrawer)}
                    disabled={isAnalyzingPain}
                    className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-[9px] font-bold rounded-md transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>{isAnalyzingPain ? 'Analisando...' : 'Reavaliar IA'}</span>
                  </button>
                </div>

                {selectedLeadForDrawer.painAnalysis ? (
                  <>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Solução Indicada:</span>
                      <strong className="text-sm text-cyan-300 block">{selectedLeadForDrawer.painAnalysis.oportunidade_sugerida}</strong>
                    </div>
                    {selectedLeadForDrawer.painAnalysis.problema_central && (
                      <div className="space-y-1 pt-1 border-t border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Problema Identificado:</span>
                        <p className="text-xs text-slate-300 leading-relaxed">{selectedLeadForDrawer.painAnalysis.problema_central}</p>
                      </div>
                    )}
                    {selectedLeadForDrawer.painAnalysis.diagnostico_preliminar && (
                      <div className="space-y-1 pt-1 border-t border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Diagnóstico Preliminar:</span>
                        <p className="text-xs text-slate-300 leading-relaxed">{selectedLeadForDrawer.painAnalysis.diagnostico_preliminar}</p>
                      </div>
                    )}
                    {selectedLeadForDrawer.painAnalysis.plano_preliminar && selectedLeadForDrawer.painAnalysis.plano_preliminar.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Plano de Ação Recomendado:</span>
                        <ul className="space-y-1 text-[11px] text-slate-300">
                          {selectedLeadForDrawer.painAnalysis.plano_preliminar.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-1.5">
                              <span className="text-cyan-400 font-bold">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-3 space-y-2">
                    <p className="text-slate-400 text-xs">Ainda não há parecer de IA gerado para este lead.</p>
                    <button
                      onClick={() => handleRunGeminiAnalysis(selectedLeadForDrawer)}
                      disabled={isAnalyzingPain}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAnalyzingPain ? 'Gerando Análise...' : 'Gerar Parecer com Gemini 3.7'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Stage selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mover Etapa do CRM</label>
                <select
                  value={selectedLeadForDrawer.stage}
                  onChange={e => {
                    updateLeadStage(selectedLeadForDrawer.id, e.target.value as PipelineStage);
                    setSelectedLeadForDrawer({ ...selectedLeadForDrawer, stage: e.target.value as PipelineStage });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
                >
                  {columns.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Observations / History */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <h3 className="font-bold text-slate-900 flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-600" />
                  <span>Histórico & Anotações Comerciais</span>
                </h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed text-[11px] whitespace-pre-wrap">
                  {selectedLeadForDrawer.notes || 'Lead cadastrado via canal de prospecção/atendimento Sharp.'}
                </div>

                {selectedLeadForDrawer.historyNotes && selectedLeadForDrawer.historyNotes.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Anotações Anteriores:</span>
                    {selectedLeadForDrawer.historyNotes.map(note => (
                      <div key={note.id} className="p-2.5 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-600">
                        <div className="font-bold text-slate-800 flex justify-between">
                          <span>{note.author}</span>
                          <span className="text-slate-400 font-normal">{new Date(note.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-1">{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete Lead Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    deleteLead(selectedLeadForDrawer.id);
                    setSelectedLeadForDrawer(null);
                  }}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir Lead do Pipeline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

