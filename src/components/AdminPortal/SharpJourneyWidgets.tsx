import React, { useState } from 'react';
import { 
  Plus, Trash2, Lightbulb, Users, DollarSign, TrendingUp, 
  HelpCircle, ChevronDown, ChevronUp, CheckCircle2, Download, 
  Printer, Building2, Target, BarChart2, ShieldCheck, Sparkles,
  Award, Briefcase, FileText, Calculator, Copy, Check, X, ArrowLeft,
  Percent, ArrowRight
} from 'lucide-react';
import { QuestionHelpGuide, GuidedProject, Milestone, SHARP_GUIDED_JOURNEYS } from '../../data/sharpJourneysData';

// -------------------------------------------------------------
// 1. HELP GUIDE DRAWER & INTERACTIVE CALCULATOR / PROJECTION POP-UP
// -------------------------------------------------------------
export type ProjectionPeriodType = 'mensal' | 'bimestral' | 'trimestral' | 'semestral' | 'anual';

interface PeriodColumnData {
  label: string;
  revenue: string;
  fixedCost: string;
  mktCost: string;
  teamCost: string;
}

export const HelpGuideDrawer: React.FC<{ 
  helpGuide: QuestionHelpGuide;
  onApplyValue?: (val: string) => void;
}> = ({ helpGuide, onApplyValue }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isProjectionOpen, setIsProjectionOpen] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  // Determine calculator type
  const calcType = helpGuide.calculatorType || (
    helpGuide.title.toLowerCase().includes('tam') ? 'tam' :
    helpGuide.title.toLowerCase().includes('sam') ? 'sam' :
    helpGuide.title.toLowerCase().includes('som') ? 'som' :
    helpGuide.title.toLowerCase().includes('nps') ? 'nps' :
    helpGuide.title.toLowerCase().includes('break-even') || helpGuide.title.toLowerCase().includes('equilíbrio') ? 'breakeven' :
    helpGuide.title.toLowerCase().includes('gtm') || helpGuide.title.toLowerCase().includes('cac') ? 'cac_ltv' :
    helpGuide.title.toLowerCase().includes('custo') ? 'costs_projection' :
    helpGuide.title.toLowerCase().includes('lucro') || helpGuide.title.toLowerCase().includes('projeção') ? 'profit_margin' :
    'general'
  );

  const isProjectionEligible = 
    calcType === 'costs_projection' || 
    calcType === 'profit_margin' || 
    calcType === 'breakeven' ||
    helpGuide.title.toLowerCase().includes('proj') ||
    helpGuide.title.toLowerCase().includes('custo') ||
    helpGuide.title.toLowerCase().includes('receita');

  // State for different calculator inputs (INITIALIZED EMPTY as requested)
  // TAM / SAM / SOM
  const [marketUnits, setMarketUnits] = useState<string>('');
  const [annualPrice, setAnnualPrice] = useState<string>('');

  // CAC / LTV
  const [mktSpend, setMktSpend] = useState<string>('');
  const [newCustomers, setNewCustomers] = useState<string>('');
  const [monthlyTicket, setMonthlyTicket] = useState<string>('');
  const [retentionMonths, setRetentionMonths] = useState<string>('');

  // NPS
  const [promoters, setPromoters] = useState<string>('');
  const [neutrals, setNeutrals] = useState<string>('');
  const [detractors, setDetractors] = useState<string>('');

  // Custos (9.1)
  const [fixedMonthlyCosts, setFixedMonthlyCosts] = useState<string>('');
  const [mktMonthlyCosts, setMktMonthlyCosts] = useState<string>('');
  const [teamMonthlyCosts, setTeamMonthlyCosts] = useState<string>('');
  const [otherAnnualCosts, setOtherAnnualCosts] = useState<string>('');

  // Projeção & Lucro (9.2)
  const [projectedAnnualRevenue, setProjectedAnnualRevenue] = useState<string>('');
  const [projectedAnnualCosts, setProjectedAnnualCosts] = useState<string>('');

  // Break-even (9.3)
  const [beFixedCosts, setBeFixedCosts] = useState<string>('');
  const [beUnitPrice, setBeUnitPrice] = useState<string>('');
  const [beUnitVarCost, setBeUnitVarCost] = useState<string>('');

  // General Calc
  const [genNumA, setGenNumA] = useState<string>('');
  const [genNumB, setGenNumB] = useState<string>('');
  const [genOperation, setGenOperation] = useState<'multiply' | 'divide' | 'percent' | 'subtract'>('multiply');

  // -------------------------------------------------------------
  // PROJECTION SPREADSHEET STATE (TABELA DE PROJEÇÃO POR PERÍODOS)
  // -------------------------------------------------------------
  const [projPeriodType, setProjPeriodType] = useState<ProjectionPeriodType>('trimestral');
  
  const getInitialPeriodColumns = (type: ProjectionPeriodType): PeriodColumnData[] => {
    if (type === 'mensal') {
      return Array.from({ length: 12 }, (_, i) => ({
        label: `Mês ${i + 1}`,
        revenue: '',
        fixedCost: '',
        mktCost: '',
        teamCost: ''
      }));
    }
    if (type === 'bimestral') {
      return Array.from({ length: 6 }, (_, i) => ({
        label: `${i + 1}º Bim`,
        revenue: '',
        fixedCost: '',
        mktCost: '',
        teamCost: ''
      }));
    }
    if (type === 'trimestral') {
      return [
        { label: 'T1 (M1-3)', revenue: '', fixedCost: '', mktCost: '', teamCost: '' },
        { label: 'T2 (M4-6)', revenue: '', fixedCost: '', mktCost: '', teamCost: '' },
        { label: 'T3 (M7-9)', revenue: '', fixedCost: '', mktCost: '', teamCost: '' },
        { label: 'T4 (M10-12)', revenue: '', fixedCost: '', mktCost: '', teamCost: '' }
      ];
    }
    if (type === 'semestral') {
      return [
        { label: '1º Semestre', revenue: '', fixedCost: '', mktCost: '', teamCost: '' },
        { label: '2º Semestre', revenue: '', fixedCost: '', mktCost: '', teamCost: '' }
      ];
    }
    // anual (3 anos)
    return [
      { label: 'Ano 1', revenue: '', fixedCost: '', mktCost: '', teamCost: '' },
      { label: 'Ano 2', revenue: '', fixedCost: '', mktCost: '', teamCost: '' },
      { label: 'Ano 3', revenue: '', fixedCost: '', mktCost: '', teamCost: '' }
    ];
  };

  const [projColumns, setProjColumns] = useState<PeriodColumnData[]>(() => getInitialPeriodColumns('trimestral'));

  // Switch period type handler
  const handlePeriodTypeChange = (newType: ProjectionPeriodType) => {
    setProjPeriodType(newType);
    setProjColumns(getInitialPeriodColumns(newType));
  };

  // Helper formatter
  const formatBRL = (val: number) => {
    if (isNaN(val)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const parseNum = (str: string): number => {
    if (!str) return 0;
    const clean = str.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  // Diagnostic definition interface
  interface DiagnosticInfo {
    status: 'good' | 'medium' | 'bad' | 'neutral';
    tag: string;
    text: string;
  }

  // Live calculation results
  const computeResult = (): { 
    hasInputs: boolean; 
    text: string; 
    raw: string; 
    summary: string;
    diagnostic: DiagnosticInfo;
  } => {
    if (calcType === 'tam' || calcType === 'sam' || calcType === 'som') {
      const units = parseNum(marketUnits);
      const price = parseNum(annualPrice);
      if (!marketUnits && !annualPrice) {
        return {
          hasInputs: false,
          text: 'Preencha os campos acima',
          raw: '',
          summary: 'Informe a quantidade de clientes e o gasto anual para calcular o mercado total.',
          diagnostic: {
            status: 'neutral',
            tag: 'Aguardando Dados',
            text: 'Insira a estimativa de unidades e preço médio para avaliar a oportunidade.'
          }
        };
      }
      const total = units * price;
      const label = calcType.toUpperCase();
      let diag: DiagnosticInfo = {
        status: 'good',
        tag: 'Oportunidade Relevante',
        text: 'Mercado com dimensão suficiente para viabilizar escala e atração de investimento.'
      };
      if (total < 500000) {
        diag = {
          status: 'medium',
          tag: 'Nicho Específico',
          text: 'Mercado de dimensão reduzida; requer margens altas ou foco em alto valor agregado.'
        };
      }

      return {
        hasInputs: true,
        text: formatBRL(total),
        raw: `${label}: ${formatBRL(total)}/ano (${units.toLocaleString('pt-BR')} potenciais clientes a ${formatBRL(price)}/ano) — Diagnóstico: ${diag.tag} (${diag.text})`,
        summary: `Fórmula: ${units.toLocaleString('pt-BR')} clientes × ${formatBRL(price)}/ano = ${formatBRL(total)}`,
        diagnostic: diag
      };
    }

    if (calcType === 'cac_ltv') {
      if (!mktSpend && !newCustomers && !monthlyTicket && !retentionMonths) {
        return {
          hasInputs: false,
          text: 'Preencha os campos acima',
          raw: '',
          summary: 'Informe os custos de marketing, clientes conquistados e ticket médio para calcular CAC e LTV.',
          diagnostic: {
            status: 'neutral',
            tag: 'Aguardando Dados',
            text: 'Informe os valores de atração e retenção para diagnosticar a saúde da aquisição.'
          }
        };
      }
      const spend = parseNum(mktSpend);
      const custs = parseNum(newCustomers) || 1;
      const ticket = parseNum(monthlyTicket);
      const months = parseNum(retentionMonths);

      const cac = custs > 0 ? spend / custs : 0;
      const ltv = ticket * months;
      const ratio = cac > 0 ? parseFloat((ltv / cac).toFixed(1)) : 0;

      let diag: DiagnosticInfo;
      if (ratio >= 3.0) {
        diag = {
          status: 'good',
          tag: 'Excelente (LTV/CAC ≥ 3x)',
          text: `O retorno gerado por cliente (${formatBRL(ltv)}) supera amplamente o custo de aquisição (${formatBRL(cac)}). Modelo saudável para acelerar crescimento.`
        };
      } else if (ratio >= 1.5) {
        diag = {
          status: 'medium',
          tag: 'Aceitável / Atenção (1.5x a 3x)',
          text: `O cliente se paga, mas a margem de segurança é moderada. Otimize canais de marketing ou melhore a retenção.`
        };
      } else {
        diag = {
          status: 'bad',
          tag: 'Crítico / Ruim (LTV/CAC < 1.5x)',
          text: `Custo de aquisição (${formatBRL(cac)}) consome quase todo o valor gerado (${formatBRL(ltv)}). Alto risco financeiro para escalar.`
        };
      }

      return {
        hasInputs: true,
        text: `CAC: ${formatBRL(cac)} | LTV: ${formatBRL(ltv)} (Ratio: ${ratio}x)`,
        raw: `CAC projetado de ${formatBRL(cac)}, LTV de ${formatBRL(ltv)} (relação LTV/CAC de ${ratio}x) — Diagnóstico: ${diag.tag} (${diag.text})`,
        summary: `Fórmula: CAC = ${formatBRL(spend)} ÷ ${custs} = ${formatBRL(cac)} | LTV = ${formatBRL(ticket)} × ${months}m = ${formatBRL(ltv)}`,
        diagnostic: diag
      };
    }

    if (calcType === 'nps') {
      if (!promoters && !neutrals && !detractors) {
        return {
          hasInputs: false,
          text: 'Preencha os campos acima',
          raw: '',
          summary: 'Informe o número de promotores, neutros e detratores para calcular o NPS.',
          diagnostic: {
            status: 'neutral',
            tag: 'Aguardando Dados',
            text: 'Informe a quantidade de promotores e detratores para o diagnóstico de satisfação.'
          }
        };
      }
      const p = parseNum(promoters);
      const n = parseNum(neutrals);
      const d = parseNum(detractors);
      const total = p + n + d;
      const score = total > 0 ? Math.round(((p - d) / total) * 100) : 0;
      
      let diag: DiagnosticInfo;
      if (score >= 75) {
        diag = {
          status: 'good',
          tag: 'Excelente (Zona de Encantamento)',
          text: 'Clientes altamente leais e promotores ativos da sua marca; excelente potencial de indicação orgânica.'
        };
      } else if (score >= 50) {
        diag = {
          status: 'good',
          tag: 'Muito Bom (Zona de Qualidade)',
          text: 'Boa satisfação geral e baixo risco de cancelamento, com oportunidades pontuais de fidelização.'
        };
      } else if (score >= 0) {
        diag = {
          status: 'medium',
          tag: 'Regular / Atenção (Zona de Aperfeiçoamento)',
          text: 'Risco moderado de churn. Entenda as dores dos neutros e resolva as queixas dos detratores com urgência.'
        };
      } else {
        diag = {
          status: 'bad',
          tag: 'Crítico / Ruim (Zona Crítica)',
          text: 'Detratores superam promotores. Requer revisão imediata da proposta de valor, produto e suporte.'
        };
      }

      return {
        hasInputs: true,
        text: `NPS ${score} (${diag.tag})`,
        raw: `NPS projetado de ${score} (${diag.tag}) com ${p} promotores e ${d} detratores em ${total} respostas — Diagnóstico: ${diag.text}`,
        summary: `Fórmula: (( ${p} promotores - ${d} detratores ) ÷ ${total} respostas) × 100 = ${score}`,
        diagnostic: diag
      };
    }

    if (calcType === 'costs_projection') {
      if (!fixedMonthlyCosts && !mktMonthlyCosts && !teamMonthlyCosts && !otherAnnualCosts) {
        return {
          hasInputs: false,
          text: 'Preencha os campos acima',
          raw: '',
          summary: 'Informe custos fixos, marketing, folha e outros para projetar o orçamento de 12 meses.',
          diagnostic: {
            status: 'neutral',
            tag: 'Aguardando Dados',
            text: 'Informe os gastos estimados para diagnosticar a estrutura de custos.'
          }
        };
      }
      const fixed = parseNum(fixedMonthlyCosts);
      const mkt = parseNum(mktMonthlyCosts);
      const team = parseNum(teamMonthlyCosts);
      const other = parseNum(otherAnnualCosts);

      const monthlyTotal = fixed + mkt + team;
      const annualTotal = (monthlyTotal * 12) + other;

      const diag: DiagnosticInfo = {
        status: 'good',
        tag: 'Orçamento Estruturado',
        text: `Previsão anual equilibrada de ${formatBRL(annualTotal)} com gasto operacional médio de ${formatBRL(monthlyTotal)}/mês.`
      };

      return {
        hasInputs: true,
        text: formatBRL(annualTotal),
        raw: `Custos previstos de ${formatBRL(annualTotal)} para os próximos 12 meses (${formatBRL(monthlyTotal)}/mês fixo + equipe + marketing) — Diagnóstico: ${diag.text}`,
        summary: `Fórmula: (${formatBRL(monthlyTotal)}/mês × 12 meses) + ${formatBRL(other)} outros = ${formatBRL(annualTotal)}/ano`,
        diagnostic: diag
      };
    }

    if (calcType === 'profit_margin') {
      if (!projectedAnnualRevenue && !projectedAnnualCosts) {
        return {
          hasInputs: false,
          text: 'Preencha os campos acima',
          raw: '',
          summary: 'Informe a receita e os custos anuais para calcular o lucro líquido e a margem percentual.',
          diagnostic: {
            status: 'neutral',
            tag: 'Aguardando Dados',
            text: 'Informe receita e custos para diagnosticar a lucratividade do projeto.'
          }
        };
      }
      const rev = parseNum(projectedAnnualRevenue);
      const cost = parseNum(projectedAnnualCosts);
      const profit = rev - cost;
      const margin = rev > 0 ? parseFloat(((profit / rev) * 100).toFixed(1)) : 0;

      let diag: DiagnosticInfo;
      if (profit > 0 && margin >= 20) {
        diag = {
          status: 'good',
          tag: `Excelente / Altamente Lucrativo (${margin}% margem)`,
          text: `Margem líquida saudável de ${margin}%, gerando forte fluxo de caixa positivo (${formatBRL(profit)}).`
        };
      } else if (profit > 0 && margin >= 5) {
        diag = {
          status: 'medium',
          tag: `Moderado / Operação Sustentável (${margin}% margem)`,
          text: `Negócio com resultado positivo (${formatBRL(profit)}), mas margem moderada. Busque otimizar custos com escala.`
        };
      } else if (profit > 0) {
        diag = {
          status: 'medium',
          tag: `Apertado / Alerta de Margem (${margin}% margem)`,
          text: `Margem estreita; variações de vendas ou custos imprevistos podem levar ao prejuízo.`
        };
      } else {
        diag = {
          status: 'bad',
          tag: `Prejuízo Projetado / Déficit (${formatBRL(profit)})`,
          text: `Despesas superam o faturamento anual. Necessário aporte inicial de capital de giro ou revisão do modelo de preços.`
        };
      }

      return {
        hasInputs: true,
        text: `Lucro Líquido: ${formatBRL(profit)} (${margin}% margem)`,
        raw: `Receita de ${formatBRL(rev)}, Custos de ${formatBRL(cost)}, Lucro Líquido de ${formatBRL(profit)} (Margem de ${margin}%) — Diagnóstico: ${diag.tag} (${diag.text})`,
        summary: `Fórmula: Receita ${formatBRL(rev)} - Custos ${formatBRL(cost)} = Lucro Líquido ${formatBRL(profit)} (${margin}%)`,
        diagnostic: diag
      };
    }

    if (calcType === 'breakeven') {
      if (!beFixedCosts && !beUnitPrice && !beUnitVarCost) {
        return {
          hasInputs: false,
          text: 'Preencha os campos acima',
          raw: '',
          summary: 'Informe custos fixos e preço unitário para calcular a quantidade de clientes necessária para o equilíbrio.',
          diagnostic: {
            status: 'neutral',
            tag: 'Aguardando Dados',
            text: 'Informe os dados unitários para calcular o ponto de equilíbrio.'
          }
        };
      }
      const fixed = parseNum(beFixedCosts);
      const price = parseNum(beUnitPrice);
      const varCost = parseNum(beUnitVarCost);

      const contribMargin = price - varCost;
      const unitsNeeded = contribMargin > 0 ? Math.ceil(fixed / contribMargin) : 0;
      const breakEvenRevenue = unitsNeeded * price;

      let diag: DiagnosticInfo;
      if (contribMargin <= 0) {
        diag = {
          status: 'bad',
          tag: 'Inviável / Margem Negativa',
          text: 'O preço unitário é menor ou igual ao custo variável. Cada venda gera prejuízo.'
        };
      } else if (unitsNeeded <= 50) {
        diag = {
          status: 'good',
          tag: `Ponto de Equilíbrio Acessível (${unitsNeeded} clientes/mês)`,
          text: `Meta de vendas realista e atingível no curto prazo para cobrir todos os custos fixos mensais.`
        };
      } else {
        diag = {
          status: 'medium',
          tag: `Demanda Moderada (${unitsNeeded} clientes/mês)`,
          text: `Exige volume relevante de clientes ativos para atingir o equilíbrio (${formatBRL(breakEvenRevenue)}/mês).`
        };
      }

      return {
        hasInputs: true,
        text: `${unitsNeeded} clientes/mês (${formatBRL(breakEvenRevenue)}/mês)`,
        raw: `Ponto de equilíbrio (Break-even): ${unitsNeeded} clientes/mês pagantes gerando ${formatBRL(breakEvenRevenue)}/mês com margem unitária de ${formatBRL(contribMargin)} — Diagnóstico: ${diag.tag} (${diag.text})`,
        summary: `Fórmula: Custos Fixos ${formatBRL(fixed)} ÷ Margem Unitária ${formatBRL(contribMargin)} = ${unitsNeeded} vendas/mês`,
        diagnostic: diag
      };
    }

    // Default general calculator
    if (!genNumA && !genNumB) {
      return {
        hasInputs: false,
        text: 'Preencha os campos acima',
        raw: '',
        summary: 'Insira os valores para calcular a operação.',
        diagnostic: {
          status: 'neutral',
          tag: 'Aguardando Operação',
          text: 'Insira os números e selecione a operação desejada.'
        }
      };
    }
    const a = parseNum(genNumA);
    const b = parseNum(genNumB);
    let res = 0;
    if (genOperation === 'multiply') res = a * b;
    if (genOperation === 'divide') res = b !== 0 ? a / b : 0;
    if (genOperation === 'percent') res = (a * b) / 100;
    if (genOperation === 'subtract') res = a - b;

    return {
      hasInputs: true,
      text: res.toLocaleString('pt-BR'),
      raw: `Resultado: ${res.toLocaleString('pt-BR')}`,
      summary: `Fórmula: ${a} ${genOperation === 'multiply' ? '×' : genOperation === 'divide' ? '÷' : genOperation === 'percent' ? '% de' : '-'} ${b} = ${res.toLocaleString('pt-BR')}`,
      diagnostic: {
        status: 'good',
        tag: 'Cálculo Concluído',
        text: 'Valor calculado com sucesso a partir das premissas informadas.'
      }
    };
  };

  const currentResult = computeResult();

  // -------------------------------------------------------------
  // PROJECTION SPREADSHEET COMPUTATION
  // -------------------------------------------------------------
  const computeProjectionTotals = () => {
    let totalRev = 0;
    let totalFix = 0;
    let totalMkt = 0;
    let totalTeam = 0;
    let hasAnyData = false;

    const columnResults = projColumns.map(col => {
      const r = parseNum(col.revenue);
      const f = parseNum(col.fixedCost);
      const m = parseNum(col.mktCost);
      const t = parseNum(col.teamCost);

      if (col.revenue || col.fixedCost || col.mktCost || col.teamCost) {
        hasAnyData = true;
      }

      totalRev += r;
      totalFix += f;
      totalMkt += m;
      totalTeam += t;

      const totalCost = f + m + t;
      const profit = r - totalCost;
      const margin = r > 0 ? ((profit / r) * 100).toFixed(1) : '0';

      return {
        label: col.label,
        revenue: r,
        totalCost,
        profit,
        margin
      };
    });

    const totalCosts = totalFix + totalMkt + totalTeam;
    const netProfit = totalRev - totalCosts;
    const overallMargin = totalRev > 0 ? parseFloat(((netProfit / totalRev) * 100).toFixed(1)) : 0;

    let diag: DiagnosticInfo;
    if (!hasAnyData) {
      diag = {
        status: 'neutral',
        tag: 'Aguardando Projeção',
        text: 'Preencha os períodos na planilha para calcular totais e viabilidade.'
      };
    } else if (netProfit > 0 && overallMargin >= 20) {
      diag = {
        status: 'good',
        tag: `Excelente Viabilidade (${overallMargin}% margem)`,
        text: `Projeção robusta com lucro acumulado de ${formatBRL(netProfit)} e margem consistente ao longo dos períodos.`
      };
    } else if (netProfit > 0) {
      diag = {
        status: 'medium',
        tag: `Sustentável (${overallMargin}% margem)`,
        text: `Operação com lucro acumulado de ${formatBRL(netProfit)}. Margem moderada com potencial de ganho de eficiência.`
      };
    } else {
      diag = {
        status: 'bad',
        tag: `Déficit Projetado (${formatBRL(netProfit)})`,
        text: `Despesas acumuladas superam as receitas previstas. Exige capital de giro inicial ou ajuste de metas de vendas.`
      };
    }

    // Build formatted response string
    const periodBreakdownText = columnResults
      .map(c => `[${c.label}]: Receita ${formatBRL(c.revenue)} | Custos ${formatBRL(c.totalCost)} | Lucro ${formatBRL(c.profit)} (${c.margin}%)`)
      .join('; ');

    const periodTypeName = 
      projPeriodType === 'mensal' ? '12 Meses' :
      projPeriodType === 'bimestral' ? '6 Bimestres' :
      projPeriodType === 'trimestral' ? '4 Trimestres' :
      projPeriodType === 'semestral' ? '2 Semestres' : '3 Anos';

    const rawReport = `Projeção Financeira Detalhada (${periodTypeName}): ${periodBreakdownText}. TOTAL ACUMULADO: Receita Total de ${formatBRL(totalRev)}, Custos Totais de ${formatBRL(totalCosts)}, Lucro Líquido Final de ${formatBRL(netProfit)} (Margem Líquida Média de ${overallMargin}%). Diagnóstico de Viabilidade: ${diag.tag} — ${diag.text}`;

    return {
      hasData: hasAnyData,
      totalRev,
      totalFix,
      totalMkt,
      totalTeam,
      totalCosts,
      netProfit,
      overallMargin,
      columnResults,
      diag,
      rawReport
    };
  };

  const projTotals = computeProjectionTotals();

  // Handlers for spreadsheet cells
  const handleCellChange = (index: number, field: keyof PeriodColumnData, value: string) => {
    setProjColumns(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      return copy;
    });
  };

  // Quick auto-populate helper with growth simulation
  const handleAutoFillGrowth = () => {
    const baseRev = 15000;
    const baseFix = 4000;
    const baseMkt = 2500;
    const baseTeam = 5000;

    setProjColumns(prev => prev.map((col, idx) => {
      const growthFactor = 1 + (idx * 0.20); // 20% growth per step
      const r = Math.round(baseRev * growthFactor);
      const f = Math.round(baseFix * (1 + idx * 0.05));
      const m = Math.round(baseMkt * (1 + idx * 0.10));
      const t = Math.round(baseTeam * (1 + idx * 0.12));

      return {
        ...col,
        revenue: r.toString(),
        fixedCost: f.toString(),
        mktCost: m.toString(),
        teamCost: t.toString()
      };
    }));
  };

  const handleClearSpreadsheet = () => {
    setProjColumns(getInitialPeriodColumns(projPeriodType));
  };

  const handleCopyResult = () => {
    if (!currentResult.raw) return;
    navigator.clipboard.writeText(currentResult.raw);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2500);
  };

  const handleApplyToAnswer = () => {
    if (onApplyValue && currentResult.raw) {
      onApplyValue(currentResult.raw);
    }
    setIsCalcOpen(false);
    setIsGuideOpen(false);
  };

  const handleApplyProjectionToAnswer = () => {
    if (onApplyValue && projTotals.rawReport) {
      onApplyValue(projTotals.rawReport);
    }
    setIsProjectionOpen(false);
    setIsGuideOpen(false);
  };

  const handleCopyProjection = () => {
    if (!projTotals.rawReport) return;
    navigator.clipboard.writeText(projTotals.rawReport);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2500);
  };

  return (
    <div className="mt-2 text-xs">
      {/* Trigger Buttons: Unified Warm Amber Palette */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold transition-all cursor-pointer shadow-xs group"
        >
          <Lightbulb className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          <span>💡 Guia Explicativo & Fórmulas</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsGuideOpen(false);
            setIsProjectionOpen(false);
            setIsCalcOpen(true);
          }}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold transition-all cursor-pointer shadow-xs group"
        >
          <Calculator className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          <span>🧮 Calcule Aqui</span>
        </button>

        {isProjectionEligible && (
          <button
            type="button"
            onClick={() => {
              setIsGuideOpen(false);
              setIsCalcOpen(false);
              setIsProjectionOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black transition-all cursor-pointer shadow-xs group"
          >
            <BarChart2 className="w-4 h-4 text-amber-100 group-hover:scale-110 transition-transform" />
            <span>📊 Projete</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: GUIA EXPLICATIVO POP-UP (UNIFIED WARM AMBER TONE) */}
      {/* ========================================================= */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-amber-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Unified Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-100 block">
                    Conceito & Guia Metodológico
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {helpGuide.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-800 text-xs sm:text-sm">
              
              {/* Concept */}
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-amber-900 tracking-wide block">
                  O que é este conceito:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200/70">
                  {helpGuide.explanation}
                </p>
              </div>

              {/* Formula & Demonstration Box */}
              {helpGuide.calculationFormula && (
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase text-amber-900 tracking-wide block">
                    Fórmula de Cálculo:
                  </span>
                  <div className="bg-amber-50/90 border-2 border-amber-300 p-4 rounded-2xl text-amber-950 space-y-2">
                    <div className="font-mono font-black text-amber-950 text-xs sm:text-sm tracking-wide">
                      {helpGuide.calculationFormula}
                    </div>
                    {helpGuide.example && (
                      <div className="text-[11px] text-amber-900 font-medium pt-2 border-t border-amber-200">
                        <strong className="text-amber-950 font-bold">Resultado Demonstrado com a Fórmula:</strong> {helpGuide.example}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step by step */}
              {helpGuide.steps && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-amber-900 tracking-wide block">
                    Como chegar nesta informação:
                  </span>
                  <div className="space-y-1.5 bg-amber-50/40 p-3.5 rounded-2xl border border-amber-200/60">
                    {helpGuide.steps.map((st, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Benchmarks */}
              {helpGuide.benchmarks && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase text-amber-900 tracking-wide block">
                    Benchmarks e Referências de Mercado:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {helpGuide.benchmarks.map((bm, i) => (
                      <div key={i} className="bg-white p-2.5 rounded-xl border border-amber-200 text-xs text-amber-950 font-semibold shadow-2xs">
                        {bm}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer with "Calcular" & "Projete" Buttons */}
            <div className="p-4 bg-amber-50/40 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Fechar Guia
              </button>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                {isProjectionEligible && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsGuideOpen(false);
                      setIsCalcOpen(false);
                      setIsProjectionOpen(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-black rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <BarChart2 className="w-4 h-4 text-amber-200" />
                    <span>Abrir Projeção / Tabela</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsGuideOpen(false);
                    setIsProjectionOpen(false);
                    setIsCalcOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-amber-100" />
                  <span>Abrir Calculadora</span>
                  <ArrowRight className="w-4 h-4 text-amber-100" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CALCULADORA INTERATIVA SUB POP-UP (UNIFIED PALETTE) */}
      {/* ========================================================= */}
      {isCalcOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-amber-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Unified Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-100 block">
                    Assistente de Cálculo
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    Calculadora: {helpGuide.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCalcOpen(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Calculator Form */}
            <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">
              
              <div className="bg-amber-50/70 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-950 font-medium leading-relaxed flex items-start justify-between gap-3">
                <span>Insira as premissas nos campos abaixo. O sistema calculará a fórmula em tempo real e indicará o diagnóstico (se o valor é bom ou ruim).</span>
                {isProjectionEligible && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCalcOpen(false);
                      setIsProjectionOpen(true);
                    }}
                    className="shrink-0 text-amber-900 font-black hover:underline flex items-center space-x-1"
                  >
                    <span>Ver Tabela por Períodos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Specific Calculator Inputs with Clean Placeholders "Ex.: ..." */}
              {(calcType === 'tam' || calcType === 'sam' || calcType === 'som') && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      1. Quantidade Estimada de Clientes ({calcType.toUpperCase()}):
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {calcType === 'tam' && 'Total de empresas ou pessoas que existem em todo o mercado nacional/global.'}
                      {calcType === 'sam' && 'Clientes no segmento ou região geográfica que você consegue atender.'}
                      {calcType === 'som' && 'Meta realista de clientes ativos capturados em 1 a 3 anos.'}
                    </p>
                    <input
                      type="text"
                      value={marketUnits}
                      onChange={e => setMarketUnits(e.target.value)}
                      placeholder="Ex.: 10.000"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      2. Gasto / Ticket Médio Anual por Cliente (R$):
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Valor médio anual que cada cliente gasta no seu produto ou serviço (ex.: mensalidade × 12 meses).
                    </p>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600">R$</span>
                      <input
                        type="text"
                        value={annualPrice}
                        onChange={e => setAnnualPrice(e.target.value)}
                        placeholder="Ex.: 1.200,00"
                        className="w-full bg-white border border-amber-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {calcType === 'cac_ltv' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      Total Investido em Marketing & Vendas (R$):
                    </label>
                    <input
                      type="text"
                      value={mktSpend}
                      onChange={e => setMktSpend(e.target.value)}
                      placeholder="Ex.: 15.000,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      Novos Clientes Conquistados:
                    </label>
                    <input
                      type="text"
                      value={newCustomers}
                      onChange={e => setNewCustomers(e.target.value)}
                      placeholder="Ex.: 30"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      Ticket Médio Mensal por Cliente (R$):
                    </label>
                    <input
                      type="text"
                      value={monthlyTicket}
                      onChange={e => setMonthlyTicket(e.target.value)}
                      placeholder="Ex.: 350,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      Tempo Médio de Retenção (Meses):
                    </label>
                    <input
                      type="text"
                      value={retentionMonths}
                      onChange={e => setRetentionMonths(e.target.value)}
                      placeholder="Ex.: 18"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {calcType === 'nps' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-amber-950">
                      Promotores (Notas 9-10):
                    </label>
                    <input
                      type="text"
                      value={promoters}
                      onChange={e => setPromoters(e.target.value)}
                      placeholder="Ex.: 70"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-amber-950">
                      Neutros (Notas 7-8):
                    </label>
                    <input
                      type="text"
                      value={neutrals}
                      onChange={e => setNeutrals(e.target.value)}
                      placeholder="Ex.: 20"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-amber-950">
                      Detratores (Notas 0-6):
                    </label>
                    <input
                      type="text"
                      value={detractors}
                      onChange={e => setDetractors(e.target.value)}
                      placeholder="Ex.: 10"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {calcType === 'costs_projection' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      Custos Fixos Mensais (Infra/SaaS/Escritório):
                    </label>
                    <input
                      type="text"
                      value={fixedMonthlyCosts}
                      onChange={e => setFixedMonthlyCosts(e.target.value)}
                      placeholder="Ex.: 8.000,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      Folha Salarial / Pró-labore Mensal:
                    </label>
                    <input
                      type="text"
                      value={teamMonthlyCosts}
                      onChange={e => setTeamMonthlyCosts(e.target.value)}
                      placeholder="Ex.: 12.000,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      Investimento Mensal em Vendas & Mkt:
                    </label>
                    <input
                      type="text"
                      value={mktMonthlyCosts}
                      onChange={e => setMktMonthlyCosts(e.target.value)}
                      placeholder="Ex.: 3.000,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      Outros Custos / Imprevistos Anuais:
                    </label>
                    <input
                      type="text"
                      value={otherAnnualCosts}
                      onChange={e => setOtherAnnualCosts(e.target.value)}
                      placeholder="Ex.: 10.000,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {calcType === 'profit_margin' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      Receita Total Projetada (Ano 1 - 12 meses):
                    </label>
                    <input
                      type="text"
                      value={projectedAnnualRevenue}
                      onChange={e => setProjectedAnnualRevenue(e.target.value)}
                      placeholder="Ex.: 350.000,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-amber-950">
                      Custos Operacionais Totais (Ano 1):
                    </label>
                    <input
                      type="text"
                      value={projectedAnnualCosts}
                      onChange={e => setProjectedAnnualCosts(e.target.value)}
                      placeholder="Ex.: 210.000,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {calcType === 'breakeven' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-amber-950">
                      Custos Fixos Mensais (R$):
                    </label>
                    <input
                      type="text"
                      value={beFixedCosts}
                      onChange={e => setBeFixedCosts(e.target.value)}
                      placeholder="Ex.: 15.000,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-amber-950">
                      Preço Unitário / Mensalidade:
                    </label>
                    <input
                      type="text"
                      value={beUnitPrice}
                      onChange={e => setBeUnitPrice(e.target.value)}
                      placeholder="Ex.: 400,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-amber-950">
                      Custo Variável por Venda:
                    </label>
                    <input
                      type="text"
                      value={beUnitVarCost}
                      onChange={e => setBeUnitVarCost(e.target.value)}
                      placeholder="Ex.: 50,00"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              {calcType === 'general' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <input
                    type="text"
                    value={genNumA}
                    onChange={e => setGenNumA(e.target.value)}
                    placeholder="Ex.: 100"
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                  />
                  <select
                    value={genOperation}
                    onChange={e => setGenOperation(e.target.value as any)}
                    className="w-full bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-950 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="multiply">Multiplicar (×)</option>
                    <option value="divide">Dividir (÷)</option>
                    <option value="percent">Porcentagem (%)</option>
                    <option value="subtract">Subtrair (-)</option>
                  </select>
                  <input
                    type="text"
                    value={genNumB}
                    onChange={e => setGenNumB(e.target.value)}
                    placeholder="Ex.: 12"
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              )}

              {/* Dynamic Live Result Box - Unified Amber & Clear Theme */}
              <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-2xl text-amber-950 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-900 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Resultado Calculado Automaticamente</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                    {currentResult.hasInputs ? 'Cálculo Ativo' : 'Aguardando Valores'}
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-black text-amber-950">
                  {currentResult.text}
                </div>

                <div className="text-[11px] text-amber-900 font-mono pt-1.5 border-t border-amber-200">
                  {currentResult.summary}
                </div>

                {/* Clear Good / Bad / Health Indicator below the formula */}
                {currentResult.hasInputs && (
                  <div className={`pt-2.5 border-t border-amber-200/80 flex items-start space-x-2.5 rounded-xl p-2.5 ${
                    currentResult.diagnostic.status === 'good' ? 'bg-emerald-50 border border-emerald-300 text-emerald-950' :
                    currentResult.diagnostic.status === 'medium' ? 'bg-amber-100/60 border border-amber-300 text-amber-950' :
                    currentResult.diagnostic.status === 'bad' ? 'bg-rose-50 border border-rose-300 text-rose-950' :
                    'bg-slate-100 border border-slate-200 text-slate-800'
                  }`}>
                    <div className="shrink-0 mt-0.5">
                      {currentResult.diagnostic.status === 'good' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      {currentResult.diagnostic.status === 'medium' && <Lightbulb className="w-4 h-4 text-amber-600" />}
                      {currentResult.diagnostic.status === 'bad' && <X className="w-4 h-4 text-rose-600" />}
                      {currentResult.diagnostic.status === 'neutral' && <HelpCircle className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-black text-xs flex items-center space-x-1.5">
                        <span>O que este valor indica:</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          currentResult.diagnostic.status === 'good' ? 'bg-emerald-200 text-emerald-900' :
                          currentResult.diagnostic.status === 'medium' ? 'bg-amber-200 text-amber-900' :
                          currentResult.diagnostic.status === 'bad' ? 'bg-rose-200 text-rose-900' :
                          'bg-slate-200 text-slate-800'
                        }`}>
                          {currentResult.diagnostic.tag}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed font-medium">
                        {currentResult.diagnostic.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 bg-amber-50/40 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsCalcOpen(false);
                    setIsGuideOpen(true);
                  }}
                  className="px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar ao Guia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCalcOpen(false)}
                  className="px-3.5 py-2.5 text-slate-500 hover:text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
                >
                  Fechar
                </button>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyResult}
                  disabled={!currentResult.hasInputs}
                  className={`flex-1 sm:flex-none px-4 py-2.5 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs ${
                    currentResult.hasInputs 
                      ? 'bg-amber-900 hover:bg-amber-950 text-white cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {copiedFeedback ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-amber-200" />}
                  <span>{copiedFeedback ? 'Copiado!' : 'Copiar Resultado'}</span>
                </button>

                {onApplyValue && (
                  <button
                    type="button"
                    onClick={handleApplyToAnswer}
                    disabled={!currentResult.hasInputs}
                    className={`flex-1 sm:flex-none px-5 py-2.5 font-black rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md ${
                      currentResult.hasInputs 
                        ? 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-100" />
                    <span>Inserir na Resposta</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: PROJETE - TABELA / PLANILHA INTERATIVA DE PROJEÇÃO */}
      {/* ========================================================= */}
      {isProjectionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-3xl border border-amber-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <BarChart2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-100 block">
                    Planilha & Tabela de Projeção Interativa
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    Projeção Financeira: Meses, Bimestres, Trimestres e Anos
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProjectionOpen(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">
              
              {/* Period Type Selector & Quick Action Pills */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-950 tracking-wider block">
                    1. Escolha a Granularidade dos Períodos:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'mensal', label: '12 Meses' },
                      { id: 'bimestral', label: '6 Bimestres' },
                      { id: 'trimestral', label: '4 Trimestres' },
                      { id: 'semestral', label: '2 Semestres' },
                      { id: 'anual', label: '3 Anos' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePeriodTypeChange(p.id as ProjectionPeriodType)}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                          projPeriodType === p.id 
                            ? 'bg-amber-600 text-white shadow-xs' 
                            : 'bg-white text-amber-950 border border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleAutoFillGrowth}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black rounded-xl text-xs border border-amber-300 transition-colors cursor-pointer"
                    title="Preenche valores realistas com curva de crescimento para teste rápido"
                  >
                    Simular Crescimento
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSpreadsheet}
                    className="px-2.5 py-1.5 text-slate-500 hover:text-rose-600 font-bold text-xs cursor-pointer"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {/* Spreadsheet Grid Table */}
              <div className="overflow-x-auto border-2 border-amber-200 rounded-2xl bg-white shadow-xs">
                <table className="w-full text-left border-collapse min-w-[580px]">
                  <thead>
                    <tr className="bg-amber-100/70 border-b border-amber-200 text-[11px] font-black text-amber-950">
                      <th className="p-3 w-44 sticky left-0 bg-amber-100/90 z-10">Categoria / Linha</th>
                      {projColumns.map((col, idx) => (
                        <th key={idx} className="p-3 text-center min-w-[110px]">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 text-xs">
                    {/* Row 1: Receitas */}
                    <tr className="hover:bg-amber-50/40">
                      <td className="p-2.5 font-black text-emerald-950 bg-emerald-50/50 sticky left-0">
                        📈 Receitas / Vendas (R$)
                      </td>
                      {projColumns.map((col, idx) => (
                        <td key={idx} className="p-2">
                          <input
                            type="text"
                            value={col.revenue}
                            onChange={e => handleCellChange(idx, 'revenue', e.target.value)}
                            placeholder="Ex.: 25.000"
                            className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-300 focus:outline-none"
                          />
                        </td>
                      ))}
                    </tr>

                    {/* Row 2: Custos Fixos */}
                    <tr className="hover:bg-amber-50/40">
                      <td className="p-2.5 font-bold text-slate-800 bg-amber-50/30 sticky left-0">
                        🏢 Custos Fixos & Infra (R$)
                      </td>
                      {projColumns.map((col, idx) => (
                        <td key={idx} className="p-2">
                          <input
                            type="text"
                            value={col.fixedCost}
                            onChange={e => handleCellChange(idx, 'fixedCost', e.target.value)}
                            placeholder="Ex.: 6.000"
                            className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-300 focus:outline-none"
                          />
                        </td>
                      ))}
                    </tr>

                    {/* Row 3: Marketing */}
                    <tr className="hover:bg-amber-50/40">
                      <td className="p-2.5 font-bold text-slate-800 bg-amber-50/30 sticky left-0">
                        📣 Marketing & Vendas (R$)
                      </td>
                      {projColumns.map((col, idx) => (
                        <td key={idx} className="p-2">
                          <input
                            type="text"
                            value={col.mktCost}
                            onChange={e => handleCellChange(idx, 'mktCost', e.target.value)}
                            placeholder="Ex.: 3.000"
                            className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-300 focus:outline-none"
                          />
                        </td>
                      ))}
                    </tr>

                    {/* Row 4: Equipe */}
                    <tr className="hover:bg-amber-50/40">
                      <td className="p-2.5 font-bold text-slate-800 bg-amber-50/30 sticky left-0">
                        👥 Pessoal & Equipe (R$)
                      </td>
                      {projColumns.map((col, idx) => (
                        <td key={idx} className="p-2">
                          <input
                            type="text"
                            value={col.teamCost}
                            onChange={e => handleCellChange(idx, 'teamCost', e.target.value)}
                            placeholder="Ex.: 8.000"
                            className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-300 focus:outline-none"
                          />
                        </td>
                      ))}
                    </tr>

                    {/* Row 5: Calculated Net Profit per period */}
                    <tr className="bg-amber-50/80 font-black border-t-2 border-amber-300">
                      <td className="p-2.5 text-amber-950 sticky left-0 bg-amber-100/90">
                        💵 Lucro Líquido do Período
                      </td>
                      {projTotals.columnResults.map((c, idx) => (
                        <td key={idx} className="p-2.5 text-center font-black">
                          <span className={c.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                            {formatBRL(c.profit)}
                          </span>
                          <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                            ({c.margin}% margem)
                          </span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Consolidation & Diagnostic Card */}
              <div className="bg-amber-50 border-2 border-amber-300 p-5 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-black tracking-wider text-amber-900 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Consolidado da Projeção Acumulada</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                    {projTotals.hasData ? 'Projeção Ativa' : 'Aguardando Preenchimento'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold text-slate-500 block">Receita Total:</span>
                    <strong className="text-sm font-black text-emerald-800">{formatBRL(projTotals.totalRev)}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold text-slate-500 block">Custos Totais:</span>
                    <strong className="text-sm font-black text-slate-900">{formatBRL(projTotals.totalCosts)}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold text-slate-500 block">Lucro Líquido:</span>
                    <strong className={`text-sm font-black ${projTotals.netProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                      {formatBRL(projTotals.netProfit)}
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold text-slate-500 block">Margem Média:</span>
                    <strong className="text-sm font-black text-amber-950">{projTotals.overallMargin}%</strong>
                  </div>
                </div>

                {/* Health Indicator (Se é bom ou ruim) */}
                <div className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
                  projTotals.diag.status === 'good' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' :
                  projTotals.diag.status === 'medium' ? 'bg-amber-100/70 border-amber-300 text-amber-950' :
                  projTotals.diag.status === 'bad' ? 'bg-rose-50 border-rose-300 text-rose-950' :
                  'bg-white border-amber-200 text-slate-700'
                }`}>
                  <div className="shrink-0 mt-0.5">
                    {projTotals.diag.status === 'good' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {projTotals.diag.status === 'medium' && <Lightbulb className="w-4 h-4 text-amber-600" />}
                    {projTotals.diag.status === 'bad' && <X className="w-4 h-4 text-rose-600" />}
                    {projTotals.diag.status === 'neutral' && <HelpCircle className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-black text-xs flex items-center space-x-1.5">
                      <span>O que esta projeção indica:</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        projTotals.diag.status === 'good' ? 'bg-emerald-200 text-emerald-900' :
                        projTotals.diag.status === 'medium' ? 'bg-amber-200 text-amber-900' :
                        projTotals.diag.status === 'bad' ? 'bg-rose-200 text-rose-900' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        {projTotals.diag.tag}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-medium">
                      {projTotals.diag.text}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer with "Inserir na Resposta" */}
            <div className="p-4 bg-amber-50/40 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsProjectionOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-slate-600 hover:text-slate-900 font-bold rounded-xl text-xs cursor-pointer"
              >
                Fechar Tabela
              </button>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyProjection}
                  disabled={!projTotals.hasData}
                  className={`flex-1 sm:flex-none px-4 py-2.5 font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs ${
                    projTotals.hasData 
                      ? 'bg-amber-900 hover:bg-amber-950 text-white cursor-pointer' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {copiedFeedback ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-amber-200" />}
                  <span>{copiedFeedback ? 'Copiado!' : 'Copiar Projeção'}</span>
                </button>

                {onApplyValue && (
                  <button
                    type="button"
                    onClick={handleApplyProjectionToAnswer}
                    disabled={!projTotals.hasData}
                    className={`flex-1 sm:flex-none px-5 py-2.5 font-black rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md ${
                      projTotals.hasData 
                        ? 'bg-amber-600 hover:bg-amber-700 text-white cursor-pointer' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-100" />
                    <span>Inserir na Resposta</span>
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

// -------------------------------------------------------------
// 2. SECONDARY SEGMENT CONDITIONAL
// -------------------------------------------------------------
export const SecondarySegmentConditional: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  // Parse compound value: "Sim|||Detalhes..." or "Não"
  const isSim = value.startsWith('Sim');
  const details = value.includes('|||') ? value.split('|||')[1] : '';

  const handleChoice = (choice: 'Sim' | 'Não') => {
    if (choice === 'Não') {
      onChange('Não');
    } else {
      onChange(`Sim|||${details}`);
    }
  };

  const handleDetailChange = (text: string) => {
    onChange(`Sim|||${text}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => handleChoice('Sim')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            isSim
              ? 'bg-cyan-500 text-slate-950 border-cyan-600 shadow-xs font-extrabold ring-2 ring-cyan-500/20'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Sim, existe segmento secundário
        </button>
        <button
          type="button"
          onClick={() => handleChoice('Não')}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
            !isSim && value.trim().length > 0
              ? 'bg-cyan-500 text-slate-950 border-cyan-600 shadow-xs font-extrabold ring-2 ring-cyan-500/20'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          Não, foco apenas no segmento primário
        </button>
      </div>

      {isSim && (
        <div className="p-4 bg-cyan-50/50 border border-cyan-200 rounded-2xl space-y-2 animate-fadeIn">
          <label className="block text-xs font-extrabold text-slate-800">
            Descreva o Segmento Secundário (Perfil, Demografia e Necessidade):
          </label>
          <textarea
            rows={2}
            value={details}
            onChange={(e) => handleDetailChange(e.target.value)}
            placeholder="Ex.: Pacientes particulares buscando agendamento ágil e lembretes por WhatsApp sem complicação..."
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 3. BRAINSTORM IDEAS WIDGET (MODULO 3 - PERGUNTA 0)
// -------------------------------------------------------------
export const BrainstormIdeasWidget: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const [newIdea, setNewIdea] = useState('');

  // Parse ideas from JSON or comma/newline
  let ideas: string[] = [];
  try {
    if (value.startsWith('[')) {
      ideas = JSON.parse(value);
    } else if (value.trim()) {
      ideas = value.split('\n').filter(Boolean);
    }
  } catch {
    ideas = value ? [value] : [];
  }

  const addIdea = () => {
    if (!newIdea.trim()) return;
    const updated = [...ideas, newIdea.trim()];
    onChange(JSON.stringify(updated));
    setNewIdea('');
  };

  const removeIdea = (index: number) => {
    const updated = ideas.filter((_, i) => i !== index);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <span>Ideias de Solução Geradas ({ideas.length})</span>
        </span>
        <span className="text-[11px] text-slate-500 font-medium">Adicione quantas hipóteses desejar</span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addIdea();
            }
          }}
          placeholder="Ex.: Aplicativo com confirmação de consulta por IA via WhatsApp..."
          className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-cyan-500"
        />
        <button
          type="button"
          onClick={addIdea}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </div>

      {ideas.length > 0 && (
        <div className="space-y-2 pt-2">
          {ideas.map((idea, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 shadow-2xs"
            >
              <div className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-100 text-cyan-800 font-black text-[10px] flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>{idea}</span>
              </div>
              <button
                type="button"
                onClick={() => removeIdea(idx)}
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                title="Remover ideia"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 4. COMPETITOR PROS & CONS WIDGET (MODULO 6)
// -------------------------------------------------------------
interface CompetitorItem {
  name: string;
  origin: 'Brasil' | 'Global';
  strengths: string;
  weaknesses: string;
  pricing: string;
}

export const CompetitorProsConsWidget: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState<'Brasil' | 'Global'>('Brasil');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [pricing, setPricing] = useState('');

  let competitors: CompetitorItem[] = [];
  try {
    if (value.startsWith('[')) {
      competitors = JSON.parse(value);
    }
  } catch {
    competitors = [];
  }

  const addCompetitor = () => {
    if (!name.trim()) return;
    const updated = [
      ...competitors,
      {
        name: name.trim(),
        origin,
        strengths: strengths.trim() || 'Não informado',
        weaknesses: weaknesses.trim() || 'Não informado',
        pricing: pricing.trim() || 'Não informado'
      }
    ];
    onChange(JSON.stringify(updated));
    setName('');
    setStrengths('');
    setWeaknesses('');
    setPricing('');
  };

  const removeCompetitor = (idx: number) => {
    const updated = competitors.filter((_, i) => i !== idx);
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-slate-800">
          Mapeamento Estruturado de Concorrentes ({competitors.length})
        </span>
        <span className="text-[11px] text-slate-500 font-medium">Nacionais e Internacionais</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Nome do Concorrente</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: DoctorSys, AgendaPro..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Origem</label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value as 'Brasil' | 'Global')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
          >
            <option value="Brasil">🇧🇷 Brasil</option>
            <option value="Global">🌎 Global / Internacional</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Pontos Fortes</label>
          <input
            type="text"
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            placeholder="Ex.: Forte marca, base grande..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Pontos Fracos</label>
          <input
            type="text"
            value={weaknesses}
            onChange={(e) => setWeaknesses(e.target.value)}
            placeholder="Ex.: Sistema legado, sem WhatsApp..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Faixa de Preço</label>
            <input
              type="text"
              value={pricing}
              onChange={(e) => setPricing(e.target.value)}
              placeholder="Ex.: R$ 250/mês"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
            />
          </div>
          <button
            type="button"
            onClick={addCompetitor}
            disabled={!name.trim()}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Adicionar
          </button>
        </div>
      </div>

      {competitors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {competitors.map((c, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs relative">
              <button
                type="button"
                onClick={() => removeCompetitor(idx)}
                className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900">{c.name}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {c.origin === 'Brasil' ? '🇧🇷 Nacional' : '🌎 Global'}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600">
                <div><strong className="text-emerald-700">Pontos Fortes:</strong> {c.strengths}</div>
                <div><strong className="text-rose-700">Pontos Fracos:</strong> {c.weaknesses}</div>
                <div><strong className="text-slate-800">Preço Estimado:</strong> {c.pricing}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 5. GROWTH AND COSTS SPLIT WIDGET (MODULO 9)
// -------------------------------------------------------------
export const GrowthAndCostsWidget: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  let parsed: any = {};
  try {
    if (value.startsWith('{')) {
      parsed = JSON.parse(value);
    }
  } catch {
    parsed = {};
  }

  const updateField = (field: string, val: string) => {
    const updated = { ...parsed, [field]: val };
    onChange(JSON.stringify(updated));
  };

  return (
    <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
      <span className="text-xs font-extrabold text-slate-800 block">
        Detalhamento de Crescimento e Estrutura de Custos (12 Meses)
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-600 mb-1">
            Taxa Média de Crescimento Mensal Esperada (%)
          </label>
          <input
            type="text"
            value={parsed.monthlyGrowth || ''}
            onChange={(e) => updateField('monthlyGrowth', e.target.value)}
            placeholder="Ex.: 15% ao mês"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">
            Custos de Infraestrutura & Tecnologia (AWS, APIs, Softwares)
          </label>
          <input
            type="text"
            value={parsed.techCosts || ''}
            onChange={(e) => updateField('techCosts', e.target.value)}
            placeholder="Ex.: R$ 2.500/mês"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">
            Investimento Mensal em Marketing & Aquisição (CAC)
          </label>
          <input
            type="text"
            value={parsed.mktCosts || ''}
            onChange={(e) => updateField('mktCosts', e.target.value)}
            placeholder="Ex.: R$ 5.000/mês"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">
            Equipe / Folha Salarial & Pró-labore
          </label>
          <input
            type="text"
            value={parsed.teamCosts || ''}
            onChange={(e) => updateField('teamCosts', e.target.value)}
            placeholder="Ex.: R$ 12.000/mês"
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
          />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. TEAM MEMBERS WIDGET (MODULO 10 - 10.1)
// -------------------------------------------------------------
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string;
  dedication: 'Integral (Full-time)' | 'Parcial (Part-time)' | 'Conselheiro/Mentor';
}

export const TeamMembersWidget: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [skills, setSkills] = useState('');
  const [dedication, setDedication] = useState<'Integral (Full-time)' | 'Parcial (Part-time)' | 'Conselheiro/Mentor'>('Integral (Full-time)');

  let members: TeamMember[] = [];
  try {
    if (value.startsWith('[')) {
      members = JSON.parse(value);
    }
  } catch {
    members = [];
  }

  const addMember = () => {
    if (!name.trim()) return;
    const newM: TeamMember = {
      id: String(Date.now()),
      name: name.trim(),
      role: role.trim() || 'Co-fundador',
      skills: skills.trim() || 'Geral',
      dedication
    };
    const updated = [...members, newM];
    onChange(JSON.stringify(updated));
    setName('');
    setRole('');
    setSkills('');
  };

  const removeMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    onChange(JSON.stringify(updated));
  };

  const fullTimeCount = members.filter((m) => m.dedication.includes('Integral')).length;
  const partTimeCount = members.filter((m) => m.dedication.includes('Parcial')).length;

  return (
    <div className="space-y-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-cyan-600" />
            <span>Quadro de Fundadores e Colaboradores ({members.length})</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Cadastre todos os integrantes e consulte o resumo</span>
        </div>

        {members.length > 0 && (
          <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <span>{fullTimeCount} Full-time</span>
            <span>•</span>
            <span>{partTimeCount} Part-time</span>
          </div>
        )}
      </div>

      {/* Form Add Member */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 text-xs">
        <div>
          <label className="block font-bold text-slate-600 mb-1">Nome Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Lucas Silveira"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Função / Cargo</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ex.: CEO / Comercial, CTO / Desenvolvedor..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Formação & Principais Habilidades</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Ex.: Engenharia de Software, vendas B2B..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-600 mb-1">Regime de Dedicação</label>
          <div className="flex gap-2">
            <select
              value={dedication}
              onChange={(e) => setDedication(e.target.value as any)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900"
            >
              <option value="Integral (Full-time)">Integral (Full-time)</option>
              <option value="Parcial (Part-time)">Parcial (Part-time)</option>
              <option value="Conselheiro/Mentor">Conselheiro / Mentor</option>
            </select>
            <button
              type="button"
              onClick={addMember}
              disabled={!name.trim()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              + Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Member Cards List */}
      {members.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {members.map((m) => (
            <div key={m.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs relative shadow-2xs">
              <button
                type="button"
                onClick={() => removeMember(m.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-black text-xs flex items-center justify-center">
                  {m.name.charAt(0)}
                </div>
                <div>
                  <div className="font-extrabold text-slate-900">{m.name}</div>
                  <div className="text-[11px] text-cyan-700 font-bold">{m.role}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 pt-1">
                <div><strong>Habilidades:</strong> {m.skills}</div>
                <div className="mt-1">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                    {m.dedication}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 7. MARCO 1 PITCH REVIEW
// -------------------------------------------------------------
export const Marco1PitchReview: React.FC<{ project: GuidedProject }> = ({ project }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-cyan-950 p-5 rounded-2xl border border-cyan-500/30 text-white space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase text-cyan-300 flex items-center space-x-1.5">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>Consolidação do Marco 1: Oportunidade & Solução</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
          Wadhwani Ignite
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
          <span className="text-cyan-300 font-bold block text-[10px] uppercase">Problema Central:</span>
          <p className="text-slate-200 text-xs line-clamp-2">
            {project.answers['j1_1_1_q1'] || 'Ainda não preenchido no Módulo 1.'}
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
          <span className="text-cyan-300 font-bold block text-[10px] uppercase">Persona & Perfil:</span>
          <p className="text-slate-200 text-xs line-clamp-2">
            {project.answers['j1_2_1_q1'] || 'Ainda não preenchido no Módulo 2.'}
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
          <span className="text-cyan-300 font-bold block text-[10px] uppercase">Conceito da Solução:</span>
          <p className="text-slate-200 text-xs line-clamp-2">
            {project.answers['j1_3_1_q1'] || 'Ainda não preenchido no Módulo 3.'}
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
          <span className="text-cyan-300 font-bold block text-[10px] uppercase">Estimativa TAM:</span>
          <p className="text-slate-200 text-xs line-clamp-2">
            {project.answers['j1_4_1_q1'] || 'Ainda não preenchido no Módulo 4.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 8. MARCO 2 REVIEW
// -------------------------------------------------------------
export const Marco2Review: React.FC<{ project: GuidedProject }> = ({ project }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-purple-950 p-5 rounded-2xl border border-purple-500/30 text-white space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase text-purple-300 flex items-center space-x-1.5">
          <Award className="w-4 h-4 text-purple-400" />
          <span>Consolidação do Marco 2: Modelo & Validação de Mercado</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
          Wadhwani Ignite
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
          <span className="text-purple-300 font-bold block text-[10px] uppercase">Proposta de Valor Única (UVP):</span>
          <p className="text-slate-200 text-xs line-clamp-2">
            {project.answers['j1_7_2_q1'] || 'Ainda não preenchido no Módulo 7.'}
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
          <span className="text-purple-300 font-bold block text-[10px] uppercase">Modelo de Receita Principal:</span>
          <p className="text-slate-200 text-xs line-clamp-2">
            {project.answers['j1_7_1_q1'] || 'Ainda não selecionado no Módulo 7.'}
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
          <span className="text-purple-300 font-bold block text-[10px] uppercase">Estimativa SOM (Mercado Atingível):</span>
          <p className="text-slate-200 text-xs line-clamp-2">
            {project.answers['j1_6_2_q4'] || 'Ainda não preenchido no Módulo 6.'}
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-xl border border-white/10 space-y-1">
          <span className="text-purple-300 font-bold block text-[10px] uppercase">Vantagem Injusta:</span>
          <p className="text-slate-200 text-xs line-clamp-2">
            {project.answers['j1_7_2_q5'] || 'Ainda não preenchido no Módulo 7.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 9. MARCO 3 DOSSIER & FINAL REPORT (DOWNLOAD PDF)
// -------------------------------------------------------------
export const Marco3DossierReport: React.FC<{
  project: GuidedProject;
  milestones: Milestone[];
}> = ({ project, milestones }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200 text-slate-900">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-cyan-500 text-slate-950">
            Dossiê Executivo Consolidado
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white">{project.name}</h3>
          <p className="text-xs text-slate-400 font-medium">
            Relatório de Conclusão da Jornada Metodológica Sharp & Wadhwani Ignite
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Baixar Relatório em PDF / Imprimir</span>
        </button>
      </div>

      {/* Summary Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Empresa / Projeto</span>
          <strong className="text-slate-900 text-sm font-extrabold truncate block">{project.name}</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Localização</span>
          <strong className="text-slate-900 text-sm font-extrabold truncate block">{project.companyLocation || 'Não informado'}</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Ramo de Atuação</span>
          <strong className="text-slate-900 text-sm font-extrabold truncate block">{project.companyBranch || 'Geral'}</strong>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Data de Emissão</span>
          <strong className="text-slate-900 text-sm font-extrabold truncate block">{new Date().toLocaleDateString('pt-BR')}</strong>
        </div>
      </div>

      {/* Structured Sections Overview */}
      <div className="space-y-4">
        <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Resumo por Marcos Metodológicos
        </h4>

        {milestones.map((m) => {
          return (
            <div key={m.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {m.milestoneCode}
                  </span>
                  <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">{m.title}</h5>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {m.sections.flatMap((s) => s.questions).map((q) => {
                  const ans = project.answers[q.id];
                  if (!ans || String(ans).trim().length === 0) return null;
                  
                  // Clean up stringified JSON if needed
                  let displayAns = String(ans);
                  if (displayAns.startsWith('[')) {
                    try {
                      const arr = JSON.parse(displayAns);
                      if (Array.isArray(arr)) {
                        displayAns = arr.map((item: any) => typeof item === 'object' ? `${item.name} (${item.role || item.origin})` : item).join(', ');
                      }
                    } catch {}
                  } else if (displayAns.includes('|||')) {
                    displayAns = displayAns.replace('|||', ' — Detalhes: ');
                  }

                  return (
                    <div key={q.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="font-bold text-slate-700 text-[11px]">{q.title}</div>
                      <div className="text-slate-900 font-medium text-xs mt-0.5">{displayAns}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
