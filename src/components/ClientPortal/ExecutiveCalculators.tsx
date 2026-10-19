import React, { useState } from 'react';
import { 
  Calculator, TrendingUp, DollarSign, Zap, ArrowRight, 
  BarChart3, Sparkles, Award, Globe2, Compass 
} from 'lucide-react';

type CalculatorType = 
  | 'cac' 
  | 'ltv' 
  | 'roi' 
  | 'breakeven' 
  | 'brand_diag' 
  | 'digital_diag' 
  | 'strategic_diag' 
  | 'swot';

export const ExecutiveCalculators: React.FC<{ onGoToDiagnostic: () => void }> = ({ onGoToDiagnostic }) => {
  const [activeCalc, setActiveCalc] = useState<CalculatorType>('cac');

  // Tool 1: CAC
  const [cacMktSpend, setCacMktSpend] = useState<number>(30000);
  const [cacNewClients, setCacNewClients] = useState<number>(15);

  // Tool 2: LTV
  const [ltvMonthlyTicket, setLtvMonthlyTicket] = useState<number>(4500);
  const [ltvRetentionMonths, setLtvRetentionMonths] = useState<number>(18);
  const [ltvCurrentCac, setLtvCurrentCac] = useState<number>(2000);

  // Tool 3: ROI
  const [roiInvestment, setRoiInvestment] = useState<number>(50000);
  const [roiRevenueGenerated, setRoiRevenueGenerated] = useState<number>(180000);

  // Tool 4: Break-Even
  const [fixedCosts, setFixedCosts] = useState<number>(80000);
  const [contributionMarginPct, setContributionMarginPct] = useState<number>(40);

  // Tool 5: Brand Diagnosis (0-100)
  const [brandClarity, setBrandClarity] = useState<number>(60);
  const [brandVisuals, setBrandVisuals] = useState<number>(50);
  const [brandAuthority, setBrandAuthority] = useState<number>(40);
  const [brandPricingPower, setBrandPricingPower] = useState<number>(50);

  // Tool 6: Digital Presence Diagnosis
  const [digitalFrequency, setDigitalFrequency] = useState<number>(40);
  const [digitalQuality, setDigitalQuality] = useState<number>(60);
  const [digitalInboundLeads, setDigitalInboundLeads] = useState<number>(30);
  const [digitalOmnichannel, setDigitalOmnichannel] = useState<number>(40);

  // Tool 7: Strategic Growth Diagnosis
  const [stratGoalClarity, setStratGoalClarity] = useState<number>(50);
  const [stratKpiTracking, setStratKpiTracking] = useState<number>(40);
  const [stratTeamAlign, setStratTeamAlign] = useState<number>(60);
  const [stratMarketIntel, setStratMarketIntel] = useState<number>(30);

  // Tool 8: SWOT Inputs
  const [swotStrengths, setSwotStrengths] = useState<string>('');
  const [swotOpportunities, setSwotOpportunities] = useState<string>('');
  const [swotWeaknesses, setSwotWeaknesses] = useState<string>('');
  const [swotThreats, setSwotThreats] = useState<string>('');

  // Calculations
  const calculatedCac = cacNewClients > 0 ? Math.round(cacMktSpend / cacNewClients) : 0;
  const calculatedLtv = ltvMonthlyTicket * ltvRetentionMonths;
  const ltvCacRatioNum = ltvCurrentCac > 0 ? (calculatedLtv / ltvCurrentCac) : 0;
  const ltvCacRatioStr = ltvCacRatioNum.toFixed(1);

  const roiNetGain = roiRevenueGenerated - roiInvestment;
  const roiPct = roiInvestment > 0 ? Math.round((roiNetGain / roiInvestment) * 100) : 0;
  const breakEvenRevenue = contributionMarginPct > 0 ? Math.round((fixedCosts / (contributionMarginPct / 100))) : 0;

  const brandScore = Math.round((brandClarity + brandVisuals + brandAuthority + brandPricingPower) / 4);
  const digitalScore = Math.round((digitalFrequency + digitalQuality + digitalInboundLeads + digitalOmnichannel) / 4);
  const stratScore = Math.round((stratGoalClarity + stratKpiTracking + stratTeamAlign + stratMarketIntel) / 4);

  const TOOL_LIST = [
    { id: 'cac', label: 'Calculadora de CAC' },
    { id: 'ltv', label: 'Calculadora de LTV' },
    { id: 'roi', label: 'Calculadora de ROI' },
    { id: 'breakeven', label: 'Ponto de Equilíbrio' },
    { id: 'brand_diag', label: 'Diagnóstico de Marca' },
    { id: 'digital_diag', label: 'Presença Digital' },
    { id: 'strategic_diag', label: 'Diagnóstico Estratégico' },
    { id: 'swot', label: 'Matriz SWOT' },
  ];

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Banner - Clean Light Theme */}
      <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 sm:p-10 text-slate-900 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-cyan-50 border border-cyan-200/80 text-cyan-800 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-cyan-600" />
            <span>Ferramentas Práticas & Fáceis de Entender</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Simuladores & Ferramentas Estratégicas
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
            Insira os dados da sua empresa e receba a análise explicada em linguagem simples e direta, ideal para quem não é especialista em finanças ou marketing.
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {TOOL_LIST.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveCalc(item.id as CalculatorType)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeCalc === item.id
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TOOL 1: CALCULADORA DE CAC */}
      {activeCalc === 'cac' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-cyan-600" />
                <span>1. Custo de Aquisição de Clientes (CAC)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                <strong>O que é em poucas palavras:</strong> Quanto dinheiro sua empresa gasta para atrair 1 novo cliente.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Investimento em Marketing & Vendas (R$/mês)</span>
                  <span className="text-cyan-800 font-extrabold">R$ {cacMktSpend.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="200000"
                  step="1000"
                  value={cacMktSpend}
                  onChange={(e) => setCacMktSpend(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Novos Clientes Conquistados no Mês</span>
                  <span className="text-cyan-800 font-extrabold">{cacNewClients} clientes</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={cacNewClients}
                  onChange={(e) => setCacNewClients(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 text-slate-900 border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
              RESULTADO DO CUSTO DE AQUISIÇÃO
            </span>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-1 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold uppercase">Você gasta para cada cliente novo:</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-800">
                R$ {calculatedCac.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="bg-cyan-50/70 p-4 rounded-xl border border-cyan-200 text-xs text-slate-700 leading-relaxed font-medium space-y-2">
              <strong className="text-slate-900 block font-bold">O que fazer com este valor?</strong>
              <p>
                Sua empresa investe <strong>R$ {calculatedCac.toLocaleString('pt-BR')}</strong> para conquistar 1 cliente. Para o negócio valer a pena, o valor total que esse cliente compra de você durante o contrato precisa ser significativamente maior do que esse custo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: CALCULADORA DE LTV */}
      {activeCalc === 'ltv' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
                <span>2. Valor do Tempo de Vida do Cliente (LTV)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                <strong>O que é em poucas palavras:</strong> O total de dinheiro que 1 cliente deixa na sua empresa antes de encerrar o contrato.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Mensalidade / Compra Média por Cliente (R$)</span>
                  <span className="text-cyan-800 font-extrabold">R$ {ltvMonthlyTicket.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={ltvMonthlyTicket}
                  onChange={(e) => setLtvMonthlyTicket(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Tempo Médio que o Cliente Fica com Você (Meses)</span>
                  <span className="text-cyan-800 font-extrabold">{ltvRetentionMonths} meses</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="60"
                  step="1"
                  value={ltvRetentionMonths}
                  onChange={(e) => setLtvRetentionMonths(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>CAC (Custo para Atrair o Cliente)</span>
                  <span className="text-cyan-800 font-extrabold">R$ {ltvCurrentCac.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="20000"
                  step="200"
                  value={ltvCurrentCac}
                  onChange={(e) => setLtvCurrentCac(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 text-slate-900 border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
              RESULTADO DA SAÚDE FINANCEIRA DO CLIENTE
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">1 Cliente deixa na empresa:</span>
                <span className="text-2xl font-extrabold text-cyan-800 mt-1 block">R$ {calculatedLtv.toLocaleString('pt-BR')}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Proporção LTV ÷ CAC</span>
                <span className={`text-2xl font-extrabold mt-1 block ${ltvCacRatioNum >= 3 ? 'text-emerald-700' : ltvCacRatioNum >= 2 ? 'text-amber-700' : 'text-rose-700'}`}>
                  {ltvCacRatioStr}x
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium space-y-2">
              <strong className="text-slate-900 block font-bold">O que significa este número?</strong>
              {ltvCacRatioNum >= 3 ? (
                <p className="text-emerald-800">
                  ✓ <strong>Excelente e Saudável!</strong> Cada cliente paga {ltvCacRatioStr} vezes o valor que você gastou para atrai-lo. Seu negócio está em uma zona de crescimento segura.
                </p>
              ) : ltvCacRatioNum >= 2 ? (
                <p className="text-amber-800">
                  ⚠ <strong>Atenção Moderada!</strong> Seu cliente paga {ltvCacRatioStr} vezes o custo de aquisição. Tente manter o cliente por mais tempo ou reajustar seu preço para chegar ao patamar ideal de 3x.
                </p>
              ) : (
                <p className="text-rose-800">
                  ✖ <strong>Alerta Vermelho!</strong> O custo para atrair o cliente está alto em relação ao que ele gasta. É preciso fortalecer sua marca para cobrar mais ou melhorar a atração.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: CALCULADORA DE ROI */}
      {activeCalc === 'roi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-cyan-600" />
                <span>3. Retorno sobre Investimento (ROI)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                <strong>O que é em poucas palavras:</strong> Quanto dinheiro volta para o seu bolso para cada R$ 1,00 investido.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Valor Investido na Ação / Projeto (R$)</span>
                  <span className="text-cyan-800 font-extrabold">R$ {roiInvestment.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={roiInvestment}
                  onChange={(e) => setRoiInvestment(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Faturamento Gerado com a Ação (R$)</span>
                  <span className="text-cyan-800 font-extrabold">R$ {roiRevenueGenerated.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={roiRevenueGenerated}
                  onChange={(e) => setRoiRevenueGenerated(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 text-slate-900 border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
              RESULTADO DO RETORNO DE CAPITAL
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Retorno Percentual</span>
                <span className="text-3xl font-extrabold text-emerald-700 mt-1 block">+{roiPct}%</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-center shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Lucro Líquido no Bolso</span>
                <span className="text-2xl font-extrabold text-cyan-800 mt-1 block">R$ {roiNetGain.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              <strong className="text-slate-900 block mb-1 font-bold">Resumo Simples:</strong>
              Para cada <strong>R$ 1,00</strong> colocado no projeto, sua empresa recebeu de volta <strong>R$ {(1 + (roiNetGain / roiInvestment)).toFixed(2)}</strong>. Isso significa que o dinheiro trabalhou para você gerando lucro.
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: PONTO DE EQUILÍBRIO */}
      {activeCalc === 'breakeven' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-cyan-600" />
                <span>4. Ponto de Equilíbrio (Zero a Zero)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                <strong>O que é em poucas palavras:</strong> Quanto você precisa faturar no mês só para pagar todas as contas da empresa.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Custos Fixos Mensais (Aluguel, Salários, Contas)</span>
                  <span className="text-cyan-800 font-extrabold">R$ {fixedCosts.toLocaleString('pt-BR')}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={fixedCosts}
                  onChange={(e) => setFixedCosts(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Margem de Lucro Bruta Média (%)</span>
                  <span className="text-cyan-800 font-extrabold">{contributionMarginPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  step="5"
                  value={contributionMarginPct}
                  onChange={(e) => setContributionMarginPct(Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 text-slate-900 border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
              META MÍNIMA PARA NÃO TER PREJUÍZO
            </span>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-1 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold uppercase">Faturamento Mínimo Obrigatório por Mês:</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-700">
                R$ {breakEvenRevenue.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              <strong className="text-slate-900 block mb-1 font-bold">Como interpretar:</strong>
              Você precisa vender pelo menos <strong>R$ {breakEvenRevenue.toLocaleString('pt-BR')}</strong> por mês para ficar no "zero a zero". Tudo o que vender acima deste valor vira lucro real da sua empresa.
            </div>
          </div>
        </div>
      )}

      {/* TOOL 5: DIAGNÓSTICO DE MARCA */}
      {activeCalc === 'brand_diag' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Award className="w-5 h-5 text-cyan-600" />
                <span>5. Força & Percepção da Sua Marca</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                <strong>O que é em poucas palavras:</strong> Mede se o cliente enxerga sua empresa como uma referência de alto nível ou se acha que é "só mais uma".
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Sua proposta de valor é clara para o cliente?</span>
                  <span className="text-cyan-800 font-bold">{brandClarity}%</span>
                </div>
                <input type="range" min="0" max="100" value={brandClarity} onChange={(e) => setBrandClarity(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Sua identidade visual passa profissionalismo?</span>
                  <span className="text-cyan-800 font-bold">{brandVisuals}%</span>
                </div>
                <input type="range" min="0" max="100" value={brandVisuals} onChange={(e) => setBrandVisuals(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Você é reconhecido como autoridade no setor?</span>
                  <span className="text-cyan-800 font-bold">{brandAuthority}%</span>
                </div>
                <input type="range" min="0" max="100" value={brandAuthority} onChange={(e) => setBrandAuthority(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Você consegue cobrar mais sem o cliente pedir desconto?</span>
                  <span className="text-cyan-800 font-bold">{brandPricingPower}%</span>
                </div>
                <input type="range" min="0" max="100" value={brandPricingPower} onChange={(e) => setBrandPricingPower(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 text-slate-900 border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
              DIAGNÓSTICO DA MARCA
            </span>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-1 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold uppercase">Nota Geral de Força da Marca:</span>
              <div className={`text-4xl font-extrabold ${brandScore >= 75 ? 'text-emerald-700' : brandScore >= 45 ? 'text-amber-700' : 'text-rose-700'}`}>
                {brandScore} / 100
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              <strong className="text-slate-900 block mb-1 font-bold">Diagnóstico Simplificado:</strong>
              {brandScore >= 75 ? (
                <p className="text-emerald-800">
                  <strong>Marca Forte:</strong> Sua empresa transmite confiança imediata e não sofre com comparações de preço.
                </p>
              ) : brandScore >= 45 ? (
                <p className="text-amber-800">
                  <strong>Marca Intermediária:</strong> Boa apresentação, mas ainda falta um posicionamento marcante para eliminar objeções de valor.
                </p>
              ) : (
                <p className="text-rose-800">
                  <strong>Marca Frágil:</strong> Apresentação desatualizada que atrai clientes buscando pechincha. Precisa renovar a identidade visual e o discurso comercial.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 6: DIAGNÓSTICO DE PRESENÇA DIGITAL */}
      {activeCalc === 'digital_diag' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Globe2 className="w-5 h-5 text-cyan-600" />
                <span>6. Presença Digital & Redes Sociais</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                <strong>O que é em poucas palavras:</strong> Avalia se sua empresa aparece todos os dias na internet para atrair clientes de forma ativa.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Frequência de postagens nas redes sociais</span>
                  <span className="text-cyan-800 font-bold">{digitalFrequency}%</span>
                </div>
                <input type="range" min="0" max="100" value={digitalFrequency} onChange={(e) => setDigitalFrequency(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Qualidade visual e redação dos posts</span>
                  <span className="text-cyan-800 font-bold">{digitalQuality}%</span>
                </div>
                <input type="range" min="0" max="100" value={digitalQuality} onChange={(e) => setDigitalQuality(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Chegada de mensagens e clientes interessados</span>
                  <span className="text-cyan-800 font-bold">{digitalInboundLeads}%</span>
                </div>
                <input type="range" min="0" max="100" value={digitalInboundLeads} onChange={(e) => setDigitalInboundLeads(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Google, Instagram e Site bem integrados</span>
                  <span className="text-cyan-800 font-bold">{digitalOmnichannel}%</span>
                </div>
                <input type="range" min="0" max="100" value={digitalOmnichannel} onChange={(e) => setDigitalOmnichannel(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 text-slate-900 border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
              DIAGNÓSTICO DA INTERNET
            </span>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-1 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold uppercase">Nota da Presença Digital:</span>
              <div className={`text-4xl font-extrabold ${digitalScore >= 75 ? 'text-emerald-700' : digitalScore >= 45 ? 'text-amber-700' : 'text-rose-700'}`}>
                {digitalScore} / 100
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              <strong className="text-slate-900 block mb-1 font-bold">O que fazer para melhorar:</strong>
              {digitalScore >= 75 ? (
                <p className="text-emerald-800">
                  Presença digital de alto nível! Sua empresa é vista e lembrada diariamente.
                </p>
              ) : digitalScore >= 45 ? (
                <p className="text-amber-800">
                  Presença irregular. Publicações esporádicas fazem você perder espaço para concorrentes mais ativos.
                </p>
              ) : (
                <p className="text-rose-800">
                  Sua empresa está praticamente invisível na internet. É fundamental criar uma rotina de publicações profissionais.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 7: DIAGNÓSTICO ESTRATÉGICO */}
      {activeCalc === 'strategic_diag' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
          <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Compass className="w-5 h-5 text-cyan-600" />
                <span>7. Organização & Metas da Empresa</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                <strong>O que é em poucas palavras:</strong> Avalia se a empresa tem metas bem definidas para crescer com calma e organização.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>As metas do ano estão bem claras para todos?</span>
                  <span className="text-cyan-800 font-bold">{stratGoalClarity}%</span>
                </div>
                <input type="range" min="0" max="100" value={stratGoalClarity} onChange={(e) => setStratGoalClarity(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Você acompanha os números de vendas semanalmente?</span>
                  <span className="text-cyan-800 font-bold">{stratKpiTracking}%</span>
                </div>
                <input type="range" min="0" max="100" value={stratKpiTracking} onChange={(e) => setStratKpiTracking(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>A equipe trabalha unida pelo mesmo objetivo?</span>
                  <span className="text-cyan-800 font-bold">{stratTeamAlign}%</span>
                </div>
                <input type="range" min="0" max="100" value={stratTeamAlign} onChange={(e) => setStratTeamAlign(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>Você conhece os movimentos dos concorrentes?</span>
                  <span className="text-cyan-800 font-bold">{stratMarketIntel}%</span>
                </div>
                <input type="range" min="0" max="100" value={stratMarketIntel} onChange={(e) => setStratMarketIntel(Number(e.target.value))} className="w-full accent-cyan-600 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 text-slate-900 border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
              DIAGNÓSTICO DA ORGANIZAÇÃO
            </span>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center space-y-1 shadow-2xs">
              <span className="text-xs text-slate-500 font-bold uppercase">Nota de Organização Estratégica:</span>
              <div className={`text-4xl font-extrabold ${stratScore >= 75 ? 'text-emerald-700' : stratScore >= 45 ? 'text-amber-700' : 'text-rose-700'}`}>
                {stratScore} / 100
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              <strong className="text-slate-900 block mb-1 font-bold">Resumo Executivo:</strong>
              {stratScore >= 75 ? (
                <p className="text-emerald-800">
                  Empresa muito bem organizada e focada no crescimento!
                </p>
              ) : stratScore >= 45 ? (
                <p className="text-amber-800">
                  A correria do dia a dia consome o tempo que você deveria gastar planejando o futuro do negócio.
                </p>
              ) : (
                <p className="text-rose-800">
                  Falta de metas e indicadores claros. É importante ter reuniões periódicas para alinhar os próximos passos.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 8: MATRIZ SWOT */}
      {activeCalc === 'swot' && (
        <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-600" />
              <span>8. Matriz SWOT (Pontos Fortes e Fracos)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Organize em 4 quadros simples o que sua empresa tem de melhor e o que precisa melhorar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
              <label className="text-xs font-bold uppercase text-emerald-900 block">Pontos Fortes (O que você faz muito bem)</label>
              <textarea
                rows={3}
                placeholder="Ex.: Produto de alta qualidade, atendimento personalizado, boa retenção."
                value={swotStrengths}
                onChange={(e) => setSwotStrengths(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-emerald-300 rounded-lg text-slate-800 font-medium focus:outline-none"
              />
            </div>

            <div className="p-4 bg-cyan-50/60 border border-cyan-200 rounded-xl space-y-2">
              <label className="text-xs font-bold uppercase text-cyan-900 block">Oportunidades (Novos caminhos para crescer)</label>
              <textarea
                rows={3}
                placeholder="Ex.: Expansão para novos nichos, presença digital omnicanal, parcerias B2B."
                value={swotOpportunities}
                onChange={(e) => setSwotOpportunities(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-cyan-300 rounded-lg text-slate-800 font-medium focus:outline-none"
              />
            </div>

            <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
              <label className="text-xs font-bold uppercase text-amber-900 block">Pontos Fracos (O que precisa melhorar)</label>
              <textarea
                rows={3}
                placeholder="Ex.: Marca pouco conhecida, comunicação desatualizada, processos manuais."
                value={swotWeaknesses}
                onChange={(e) => setSwotWeaknesses(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-amber-300 rounded-lg text-slate-800 font-medium focus:outline-none"
              />
            </div>

            <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-2">
              <label className="text-xs font-bold uppercase text-rose-900 block">Ameaças (Perigos da concorrência/mercado)</label>
              <textarea
                rows={3}
                placeholder="Ex.: Concorrentes com maior investimento em marketing, guerras de preço no setor."
                value={swotThreats}
                onChange={(e) => setSwotThreats(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-rose-300 rounded-lg text-slate-800 font-medium focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* COMMON BOTTOM CTA */}
      <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-extrabold text-slate-900">
            Quer ajuda para entender e aplicar esses cálculos na sua empresa?
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Agende uma conversa gratuita com a equipe estratégica da Sharp Intelligence.
          </p>
        </div>

        <button
          onClick={onGoToDiagnostic}
          className="px-5 py-3 bg-slate-900 hover:bg-cyan-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-2xs flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <span>Agendar Diagnóstico Gratuito</span>
          <ArrowRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

    </div>
  );
};
