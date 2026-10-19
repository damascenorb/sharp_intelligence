import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, Globe2, 
  BarChart3, RefreshCw, Sparkles, ShieldCheck, Zap, Layers,
  Compass, PieChart, ArrowUpRight, ArrowDownRight, Filter, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Indicator {
  id: string;
  category: 'macroecon' | 'macroamb' | 'setorial';
  name: string;
  value: string;
  trend: string;
  change: string;
  status: 'up' | 'down' | 'neutral';
  impact: 'Alto' | 'Médio' | 'Crítico';
  detail: string;
  recommendation: string;
}

const macroIndicators: Indicator[] = [
  {
    id: 'selic',
    category: 'macroecon',
    name: 'Taxa SELIC Meta',
    value: '10.50%',
    trend: 'Estável',
    change: '0.00%',
    status: 'neutral',
    impact: 'Crítico',
    detail: 'Impacto direto no custo de captação de crédito B2B, linhas de giro e taxa de desconto para valuation.',
    recommendation: 'Priorizar capital próprio em expansões e renegociar spreads bancários de giro.'
  },
  {
    id: 'dolar',
    category: 'macroecon',
    name: 'Dólar Comercial (USD/BRL)',
    value: 'R$ 5.48',
    trend: 'Em Alta',
    change: '+0.85%',
    status: 'up',
    impact: 'Crítico',
    detail: 'Atenção imediata para insumos importados, frete internacional e licenças de software em dólar (SaaS).',
    recommendation: 'Avaliar hedge cambial e repassar reajuste em novos contratos B2B.'
  },
  {
    id: 'ipca',
    category: 'macroecon',
    name: 'IPCA (Inflação 12m)',
    value: '4.23%',
    trend: 'Dentro da Meta',
    change: '-0.12%',
    status: 'down',
    impact: 'Médio',
    detail: 'Índice de reajuste de contratos anuais de prestação de serviços e repasse de folha salarial.',
    recommendation: 'Aplicar cláusulas de reajuste automático por IPCA nos contratos recorrentes.'
  },
  {
    id: 'pib',
    category: 'macroecon',
    name: 'PIB Brasil (Projeção 2026)',
    value: '+2.10%',
    trend: 'Crescimento Moderado',
    change: '+0.30%',
    status: 'up',
    impact: 'Alto',
    detail: 'Ritmo sustentado de demanda nos setores industriais, de tecnologia e serviços B2B de alto valor.',
    recommendation: 'Aproveitar a janela de expansão para capturar fatia de mercado de concorrentes desestruturados.'
  },
  {
    id: 'icei',
    category: 'macroamb',
    name: 'Confiança Empresarial (ICEI)',
    value: '54.2 pts',
    trend: 'Otimista',
    change: '+1.80 pts',
    status: 'up',
    impact: 'Alto',
    detail: 'Propensão do mercado C-Level para aprovação de novos projetos, investimentos e contratos contratados.',
    recommendation: 'Intensificar abordagem de vendas consultivas e propostas de estruturação.'
  },
  {
    id: 'desemprego',
    category: 'macroamb',
    name: 'Taxa de Desemprego (IBGE)',
    value: '6.90%',
    trend: 'Em Queda',
    change: '-0.40%',
    status: 'down',
    impact: 'Médio',
    detail: 'Mão de obra qualificada mais concorrida e aquecida. Pressiona retenção de talentos e salários em tech/mídia.',
    recommendation: 'Fortalecer employer branding e plano de incentivo por desempenho.'
  },
  {
    id: 'diesel',
    category: 'macroamb',
    name: 'Preço do Diesel / Logística',
    value: 'R$ 5.92/L',
    trend: 'Ligeira Alta',
    change: '+1.20%',
    status: 'up',
    impact: 'Médio',
    detail: 'Impacta fretes de distribuição, entregas físicas e margem bruta de produtos comercializados.',
    recommendation: 'Racionalizar rotas e renegociar contratos de logística terceirizada.'
  },
  {
    id: 'inadimplencia',
    category: 'macroamb',
    name: 'Inadimplência PME (Serasa)',
    value: '5.80%',
    trend: 'Alerta',
    change: '+0.35%',
    status: 'up',
    impact: 'Crítico',
    detail: 'Aumento do risco de atraso em mensalidades e prazos estendidos de faturamento B2B.',
    recommendation: 'Exigir análise prévia de crédito, retenção de sinal e cobrança automatizada preventiva.'
  }
];

const mockTrendData = [
  { mes: 'Jan', usd: 5.20, selic: 11.25, icei: 51.0 },
  { mes: 'Fev', usd: 5.28, selic: 11.00, icei: 52.1 },
  { mes: 'Mar', usd: 5.32, selic: 10.75, icei: 52.8 },
  { mes: 'Abr', usd: 5.38, selic: 10.50, icei: 53.2 },
  { mes: 'Mai', usd: 5.40, selic: 10.50, icei: 53.8 },
  { mes: 'Jun', usd: 5.48, selic: 10.50, icei: 54.2 },
];

export const MarketObservatory: React.FC<{ onGoToDiagnostic: () => void }> = ({ onGoToDiagnostic }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'macroecon' | 'macroamb'>('all');

  const filteredIndicators = activeCategory === 'all' 
    ? macroIndicators 
    : macroIndicators.filter(i => i.category === activeCategory);

  const handleWhatsappContact = () => {
    const encodedMessage = encodeURIComponent('Olá, gostaria de saber como esses indicadores orientam meu negócio');
    window.open(`https://wa.me/5519995682110?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner - Clean Light Theme */}
      <div className="bg-white text-slate-900 rounded-[32px] p-8 sm:p-10 border border-slate-200/90 shadow-sm relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-cyan-50 border border-cyan-200/80 text-cyan-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Globe2 className="w-4 h-4 text-cyan-600" />
            <span>Observatório Macroeconômico & Mercado Sharp</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Indicadores do Cenário Brasileiro & Orientação Estratégica
          </h1>

          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-2xl">
            Acompanhamento em tempo real de taxas de juros, inflação, dólar, confiança empresarial e índices de inadimplência para orientação segura do seu negócio.
          </p>
        </div>

        {/* Filter Ribbon Inside Banner Header */}
        <div className="pt-2 flex flex-wrap items-center gap-2 relative z-10">
          <span className="text-xs font-bold text-slate-500 mr-2 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-cyan-600" />
            <span>Filtrar Visão:</span>
          </span>
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            Todos os Indicadores ({macroIndicators.length})
          </button>
          <button
            onClick={() => setActiveCategory('macroecon')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'macroecon'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            Macroeconômico (Moeda, Juros, Inflação)
          </button>
          <button
            onClick={() => setActiveCategory('macroamb')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'macroamb'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            Macroambiente (Confiança, Trabalho, Inadimplência)
          </button>
        </div>
      </div>

      {/* Grid of 8 Enhanced Macro Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredIndicators.map((item) => (
          <div 
            key={item.id} 
            className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group relative overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500 truncate max-w-[140px]">{item.name}</span>
                <span className={`flex items-center space-x-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  item.impact === 'Crítico' 
                    ? 'bg-rose-50 text-rose-800 border border-rose-200' 
                    : item.impact === 'Alto'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {item.impact}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{item.value}</div>
                <span className={`text-xs font-extrabold flex items-center space-x-0.5 ${
                  item.status === 'up' ? 'text-emerald-700' : item.status === 'down' ? 'text-blue-700' : 'text-slate-500'
                }`}>
                  {item.status === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{item.change}</span>
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1 border-t border-slate-100">
                {item.detail}
              </p>
            </div>

            {/* Sharp Executive Recommendation Pill */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-[11px] space-y-1">
              <span className="font-extrabold text-cyan-800 uppercase tracking-wider block text-[10px]">
                💡 Ação Recomendada:
              </span>
              <p className="text-slate-700 font-medium leading-snug">
                {item.recommendation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* WHATSAPP CTA BELOW INDICATORS TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Para saber como esses indicadores orientam seu negócio, entre em contato
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Fale diretamente com os consultores da Sharp via WhatsApp.
          </p>
        </div>

        <button
          onClick={handleWhatsappContact}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm flex items-center space-x-2.5 shrink-0 cursor-pointer"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 0C5.396 0 0 5.396 0 12.031c0 2.122.555 4.192 1.608 6.012L.031 24l6.096-1.597a12.002 12.002 0 005.904 1.543h.005c6.635 0 12.031-5.396 12.031-12.031C24.067 5.396 18.666 0 12.031 0zm0 22.052h-.004a10.007 10.007 0 01-5.097-1.392l-.365-.217-3.626.949.967-3.535-.238-.378a10.024 10.024 0 01-1.536-5.448c0-5.534 4.502-10.036 10.038-10.036 5.534 0 10.036 4.502 10.036 10.036 0 5.536-4.502 10.038-10.036 10.038zm5.503-7.525c-.302-.151-1.785-.881-2.062-.981-.277-.101-.479-.151-.68.151-.202.302-.782.981-.958 1.183-.176.202-.353.227-.655.076-1.802-.902-2.983-1.602-4.172-3.645-.316-.543.316-.504.903-1.68.101-.202.05-.378-.025-.529s-.68-1.637-.932-2.241c-.245-.588-.495-.508-.68-.518l-.58-.01c-.202 0-.529.076-.806.378s-1.058 1.033-1.058 2.52 1.083 2.922 1.234 3.123c.151.202 2.132 3.256 5.166 4.566 2.055.888 2.857.971 3.882.818.625-.093 1.785-.73 2.037-1.436.252-.706.252-1.31.176-1.436-.075-.126-.277-.202-.579-.353z"/>
          </svg>
          <span>Entre em Contato via WhatsApp</span>
        </button>
      </div>

      {/* Trend Graph & C-Level Strategic Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-[30px] p-7 sm:p-8 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-cyan-600" />
                <span>Evolução Macroeconômica (Dólar, Selic & ICEI)</span>
              </h3>
              <p className="text-xs text-slate-500">Acompanhamento semestral acumulado</p>
            </div>
            <span className="text-[10px] font-extrabold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              Dados Atualizados
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="mes" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', color: '#0f172a', fontSize: '11px', border: '1px solid #cbd5e1' }} />
                <Area type="monotone" dataKey="usd" stroke="#0891b2" fill="#0891b2" fillOpacity={0.15} name="Dólar (R$)" />
                <Area type="monotone" dataKey="selic" stroke="#059669" fill="#059669" fillOpacity={0.10} name="SELIC Meta (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-slate-100 text-xs">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 block font-bold">Média Dólar</span>
              <span className="font-extrabold text-cyan-800">R$ 5.38</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 block font-bold">Média SELIC</span>
              <span className="font-extrabold text-emerald-800">10.83%</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-500 block font-bold">ICEI Confiança</span>
              <span className="font-extrabold text-blue-800">52.8 pts</span>
            </div>
          </div>
        </div>

        {/* AI Commentary & Protection Plan Column */}
        <div className="lg:col-span-5 bg-slate-50 text-slate-900 border border-slate-200 rounded-[30px] p-7 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-cyan-800 font-extrabold text-xs uppercase tracking-wider bg-cyan-100/80 border border-cyan-200 px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-4 h-4 text-cyan-700" />
              <span>Orientação Estratégica Sharp</span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              Direcionamento para Preservação de Margem & Fluxo de Caixa
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Com a Selic em 10.50% e inadimplência de PMEs em 5.80%, o maior risco do trimestre não é a falta de vendas, mas a erosão da margem líquida e o alongamento do ciclo de recebimento (DSO).
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs space-y-1 shadow-2xs">
                <span className="font-extrabold text-emerald-800 block uppercase tracking-wider text-[10px]">
                  ✓ Ação 1: Encurtamento de Prazos Comerciais
                </span>
                <p className="text-slate-700 font-normal leading-relaxed text-[11px]">
                  Exigir entrada mínima de 30% a 50% em projetos B2B longos e travar prazos de pagamento em no máximo 30 dias.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs space-y-1 shadow-2xs">
                <span className="font-extrabold text-cyan-800 block uppercase tracking-wider text-[10px]">
                  ✓ Ação 2: Re-precificação por Valor Percebido
                </span>
                <p className="text-slate-700 font-normal leading-relaxed text-[11px]">
                  Migrar a comunicação do produto de 'custo' para 'retorno sobre investimento (ROI)', permitindo margens de lucro superiores a 25%.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onGoToDiagnostic}
            className="w-full py-3.5 bg-slate-900 hover:bg-cyan-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-2xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Aplicar Diagnóstico no Meu Negócio</span>
          </button>
        </div>

      </div>

    </div>
  );
};
