import React from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Clock, Headphones, CheckCircle2, 
  BarChart3, MessageSquareQuote, Globe2, Layers, MapPin, Mail, TrendingUp, Lightbulb, Target, Building2, ExternalLink
} from 'lucide-react';
import { WhatsAppIcon } from '../WhatsAppIcon';

interface HeroDashboardProps {
  onGoToDiagnostic?: () => void;
  onGoToPlatform?: () => void;
  onGoToPainAnalyzer?: () => void;
  onScrollToSolutions?: () => void;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({ 
  onGoToDiagnostic, 
  onGoToPlatform,
  onGoToPainAnalyzer,
  onScrollToSolutions
}) => {
  const handlePrimaryAction = () => {
    if (onGoToDiagnostic) {
      onGoToDiagnostic();
    } else if (onScrollToSolutions) {
      onScrollToSolutions();
    }
  };

  const handleSecondaryAction = () => {
    if (onGoToPlatform) {
      onGoToPlatform();
    } else if (onGoToPainAnalyzer) {
      onGoToPainAnalyzer();
    }
  };

  return (
    <div className="space-y-16 animate-fadeIn">
      
      {/* =========================================================================
          SECTION 1: HERO CONTAINER (Design layout from mockup, Sharp Cyan Brand Palette)
          - Left: Stacked Bold Typography + Cyan Pill Buttons
          - Right: Curved / Rounded Frame with Executive Strategy Photo
         ========================================================================= */}
      <section className="relative overflow-hidden bg-white border border-slate-200/80 rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-cyan-50 border border-cyan-200/80 text-cyan-800 px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>CONSULTORIA EXECUTIVA & INTELIGÊNCIA B2B</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] uppercase">
                ESTRATÉGIA DE <br />
                <span className="text-cyan-600">INTELIGÊNCIA</span> <br />
                E CRESCIMENTO
              </h1>
              <p className="text-slate-600 text-sm sm:text-base font-normal max-w-md pt-2 leading-relaxed">
                Diagnóstico de mercado, fortalecimento de marca e soluções estratégicas sob medida para impulsionar a lucratividade de médias e pequenas empresas.
              </p>
            </div>

            {/* Cyan Pill CTA Button with Arrow Badge */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={handlePrimaryAction}
                className="group px-7 py-3.5 rounded-full bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>Conheça as Soluções Sharp</span>
                <span className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1 shadow-2xs">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </span>
              </button>

              <button
                onClick={handleSecondaryAction}
                className="group px-6 py-3.5 rounded-full bg-cyan-50 hover:bg-cyan-100/80 text-cyan-900 font-bold text-xs uppercase tracking-wider transition-all duration-300 border border-cyan-200/80 flex items-center justify-between gap-3 cursor-pointer"
              >
                <span>Diagnóstico com IA</span>
                <span className="w-7 h-7 rounded-full bg-slate-900 text-cyan-400 flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1">
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </span>
              </button>
            </div>
          </div>

          {/* Hero Right: Curved / Rounded Photo Frame with Business Strategy Image */}
          <div className="lg:col-span-6 relative flex justify-end">
            <div className="relative w-full max-w-lg h-[340px] sm:h-[420px] rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200 bg-slate-950">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" 
                alt="Equipe executiva em reunião de planejamento estratégico" 
                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest block">Sharp Intelligence</span>
                  <span className="text-xs font-black text-slate-900">Metodologia Exclusiva de Diagnóstico</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                  ★
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: AGENCY / MISSION MOSAIC (Design Layout + Sharp Business Focus)
          - Left: 3-card mosaic (Cyan/Slate solid card + 2 executive strategy photos)
          - Right: "Estratégia que gera clareza, resultados que transformam o seu negócio."
         ========================================================================= */}
      <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Grid: Mosaic of 3 Cards */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3 sm:gap-4">
            
            {/* Top-Left: Solid Dark Slate Card with Cyan Highlights */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-between items-center text-center shadow-lg border border-slate-800 min-h-[180px]">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest block text-cyan-400">NOSSA CONSULTORIA</span>
                <span className="text-sm font-extrabold text-white">SHARP INTELLIGENCE</span>
              </div>
            </div>

            {/* Top-Right: Analytics / Strategy Photo Card */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-[180px]">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" 
                alt="Gráficos de indicadores de desempenho e inteligência de mercado" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Bottom Wide: Team Branding Workshop Photo Card */}
            <div className="col-span-2 rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-[160px]">
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80" 
                alt="Workshop de posicionamento de marca e gestão" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Estratégia que gera clareza, <br />
              <span className="text-cyan-600">resultados que transformam seu negócio.</span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
              Acompanhamos pequenas e médias empresas na estruturação do seu posicionamento, viabilidade financeira, arquitetura de marca e presença comercial para alcançar novos patamares de lucratividade e sustentabilidade.
            </p>

            <button
              onClick={handleSecondaryAction}
              className="group px-6 py-3 rounded-full bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer"
            >
              <span>Conhecer Metodologia 360º</span>
              <span className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            </button>
          </div>

        </div>
      </section>



      {/* =========================================================================
          SECTION 4: PROJECTS / STATS BANNER
          - Left: Title + Paragraph + Pill Button
          - Right: Stat Card ("250+ ESTRUTURAÇÕES") + Business Photo Cards
         ========================================================================= */}
      <section className="bg-white rounded-[2.5rem] p-6 sm:p-10 lg:p-12 border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Projetos que impulsionam <br />
              <span className="text-cyan-600">o crescimento do seu negócio.</span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed">
              Da avaliação inicial de viabilidade à implementação dos pilares comerciais, ajudamos sua empresa a criar valor sustentável e atrair clientes de maior ticket.
            </p>

            <button
              onClick={handlePrimaryAction}
              className="group px-7 py-3.5 rounded-full bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-between gap-4 cursor-pointer"
            >
              <span>Explorar Matriz do Cliente</span>
              <span className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </span>
            </button>
          </div>

          {/* Right Grid: Stats + Photos */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-3 sm:gap-4">
            
            {/* Top-Left: Solid Dark Slate Stat Card with Cyan Number */}
            <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col justify-center items-center text-center shadow-lg border border-slate-800">
              <span className="text-4xl sm:text-5xl font-black tracking-tight mb-1 text-cyan-400">250+</span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-300">EMPRESAS E ESTRUTURAÇÕES</span>
            </div>

            {/* Top-Right: Business Growth Photo */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-[150px] sm:h-[180px]">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80" 
                alt="Reunião executiva de apresentação de resultados" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Bottom Wide Photo */}
            <div className="col-span-2 rounded-3xl overflow-hidden shadow-sm border border-slate-200 h-[150px]">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
                alt="Equipe consultiva em sessão de ideação" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: 4-BADGE VALUE BAR
         ========================================================================= */}
      <section className="bg-cyan-50/60 rounded-2xl border border-cyan-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center sm:text-left">
          
          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">DIAGNÓSTICO SOB MEDIDA</span>
          </div>

          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <Clock className="w-5 h-5 text-cyan-600 shrink-0" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">IMPLEMENTAÇÃO ÁGIL</span>
          </div>

          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">GOVERNANÇA & SEGURANÇA</span>
          </div>

          <div className="flex items-center space-x-3 justify-center sm:justify-start">
            <Headphones className="w-5 h-5 text-cyan-600 shrink-0" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">SUPORTE EXECUTIVO</span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 6: CONTACT BLOCK
          - Left: Solid Dark Card ("FALE COM A SHARP")
          - Center: White Info Card with Phone, Email, Office Address & Pill Button
          - Right: Real Google Map Embedded Frame
         ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Left: Solid Dark Slate Card */}
        <div className="lg:col-span-3 bg-slate-900 text-white rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-lg border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 sm:mb-0">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-wider text-white">FALE COM A SHARP</h3>
        </div>

        {/* Center: White Details Card */}
        <div className="lg:col-span-5 bg-white rounded-[2rem] border border-slate-200/90 p-6 sm:p-8 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3 text-xs text-slate-600 font-medium">
            <a 
              href="https://wa.me/5519995682110?text=Ol%C3%A1%2C%20gostaria%20de%20conhecer%20melhor%20as%20solu%C3%A7%C3%B5es%20da%20Sharp%20para%20meu%20neg%C3%B3cio." 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-slate-900 hover:text-emerald-600 transition-colors group"
              title="Iniciar conversa no WhatsApp com a Sharp"
            >
              <WhatsAppIcon className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-900 group-hover:text-emerald-700">(19) 9 9568-2110</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                WhatsApp
              </span>
            </a>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>contato@sharpintelligence.com.br</span>
            </div>
            <div className="flex items-start space-x-3">
              <Building2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-slate-900 font-bold block">Edifício Comercial Cetenco Plaza • Conj. 1102</span>
                <span className="text-slate-500 text-[11px] block">Av. Paulista, 1842 - Bela Vista, São Paulo - SP, 01310-200</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrimaryAction}
            className="group px-6 py-3 rounded-full bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs uppercase tracking-wider border border-slate-800 transition-all flex items-center justify-between cursor-pointer w-fit"
          >
            <span>Agendar Reunião Consultiva</span>
            <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center ml-3 shrink-0 transition-transform group-hover:translate-x-1">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

        {/* Right: Real Embedded Google Map Card */}
        <div className="lg:col-span-4 rounded-[2rem] overflow-hidden border border-slate-200 bg-slate-100 relative min-h-[220px] shadow-xs flex flex-col">
          <iframe
            title="Sede Sharp Intelligence - Av Paulista"
            src="https://maps.google.com/maps?q=Av.+Paulista,+1842+-+Bela+Vista,+S%C3%A3o+Paulo+-+SP,+01310-200&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full min-h-[200px] border-0 grayscale-[20%] hover:grayscale-0 transition-all duration-300"
            loading="lazy"
            allowFullScreen
          />
          
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200/90 shadow-md flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="truncate">
                <p className="text-[10px] font-bold text-slate-900 truncate">Av. Paulista, 1842 - Conj. 1102</p>
                <p className="text-[9px] text-slate-500 truncate">Edifício Comercial Cetenco Plaza • São Paulo/SP</p>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Av.+Paulista,+1842+-+Bela+Vista,+S%C3%A3o+Paulo+-+SP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white text-[10px] font-bold transition-colors flex items-center space-x-1 shrink-0"
              title="Abrir no Google Maps"
            >
              <span>Abrir</span>
              <ExternalLink className="w-3 h-3 text-cyan-400" />
            </a>
          </div>
        </div>

      </section>

    </div>
  );
};
