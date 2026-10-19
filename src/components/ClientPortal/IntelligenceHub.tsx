import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, Search, Sparkles, Clock, User, ArrowRight, X, 
  Share2, Bookmark, CheckCircle2, TrendingUp, Tag, Plus, PenTool 
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  summary: string;
  content: string[];
  takeaways: string[];
}

const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Dominância em Presença Digital: Como Construir Autoridade Inabalável e Atrair Inbound',
    category: 'Presença Digital',
    readTime: '6 min de leitura',
    author: 'Cristiano (Estrategista de Conteúdo)',
    date: '28 de Julho, 2026',
    summary: 'Guia definitivo para marcas PME dominarem os canais digitais com estética high-ticket, SEO executivo e engajamento qualificado.',
    content: [
      'Ter um site bonito não basta se ele não estiver posicionado onde seu cliente ideal busca soluções. A presença digital moderna exige um ecossistema omnicanal integrado.',
      'A autoridade é construída na intersecção entre prova social técnica, clareza estética e distribuição consistente em redes de negócios e buscas do Google.',
      'Ao alinhar a identidade visual à linguagem executiva, sua empresa passa a ser enxergada como a única opção viável no setor.'
    ],
    takeaways: [
      'Unifique a identidade em todos os pontos de contato digitais (site, LinkedIn, Instagram e portais).',
      'Publique cases de sucesso com métricas de resultado real.',
      'Otimize seu ecossistema para conversão direta com chamadas claras para reuniões de diagnóstico.'
    ]
  },
  {
    id: '2',
    title: 'Inteligência de Mercado B2B: Mapeamento de Concorrência e Radar de Preço em Tempo Real',
    category: 'Inteligência de Mercado',
    readTime: '7 min de leitura',
    author: 'Raphael (Estrategista Chefe)',
    date: '20 de Julho, 2026',
    summary: 'Como utilizar análise de dados e benchmarking contínuo para antecipar movimentos dos concorrentes e capturar demandas reprimidas.',
    content: [
      'Tomar decisões com base em palpites no mercado B2B atual é o caminho mais rápido para perda de margem de lucro.',
      'Através de ferramentas de inteligência de mercado, monitoramos a precificação dos concorrentes, alterações na esteira de produtos e lacunas não atendidas pelos líderes do setor.'
    ],
    takeaways: [
      'Monitore bimestralmente as ofertas e reajustes de preço da concorrência.',
      'Identifique os nichos de clientes insatisfeitos com os players tradicionais.',
      'Ajuste o posicionamento comercial para cobrir exatamente as brechas do setor.'
    ]
  },
  {
    id: '3',
    title: 'Comunicação Estratégica & Pitch Decks C-Level: O Segredo para Vender sem Dar Descontos',
    category: 'Comunicação Estratégica',
    readTime: '5 min de leitura',
    author: 'Luan & Lucas (Equipe Sharp)',
    date: '12 de Julho, 2026',
    summary: 'Estruturação de discursos de venda persuasivos, copywriting de fechamento e apresentações corporativas de altíssimo impacto.',
    content: [
      'Quando o comprador pede desconto, o problema quase nunca é o preço do produto — é a falta de clareza na percepção de valor gerada pelo seu discurso.',
      'Uma comunicação estratégica bem desenhada antecipa todas as objeções do decisor antes mesmo que ele as verbalize.'
    ],
    takeaways: [
      'Estruture suas apresentações comerciais com foco nos ganhos de margem e ROI do cliente.',
      'Elimine termos genéricos e jargões vagos das propostas.',
      'Utilize pitch decks executivos com provas sociais inquestionáveis.'
    ]
  }
];

export const IntelligenceHub: React.FC<{ onGoToDiagnostic: () => void }> = ({ onGoToDiagnostic }) => {
  const { currentUser } = useApp();
  const isSharp = currentUser?.role === 'sharp_admin';

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('sharp_hub_articles');
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  useEffect(() => {
    localStorage.setItem('sharp_hub_articles', JSON.stringify(articles));
  }, [articles]);

  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // New Article Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Presença Digital');
  const [newAuthor, setNewAuthor] = useState(currentUser?.name || 'Equipe Sharp');
  const [newReadTime, setNewReadTime] = useState('5 min de leitura');
  const [newSummary, setNewSummary] = useState('');
  const [newContentText, setNewContentText] = useState('');
  const [newTakeawaysText, setNewTakeawaysText] = useState('');

  const categories = ['Todos', 'Presença Digital', 'Inteligência de Mercado', 'Comunicação Estratégica', 'BI & Gestão'];

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const newArt: Article = {
      id: `art-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      readTime: newReadTime || '5 min de leitura',
      author: newAuthor || 'Equipe Sharp',
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }),
      summary: newSummary,
      content: newContentText.split('\n\n').filter(p => p.trim().length > 0),
      takeaways: newTakeawaysText.split('\n').filter(t => t.trim().length > 0)
    };

    setArticles([newArt, ...articles]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewSummary('');
    setNewContentText('');
    setNewTakeawaysText('');
  };

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === 'Todos' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-950 text-white rounded-[28px] p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
              SHARP INTELLIGENCE HUB
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Análises, Metodologias & Estratégias Executivas
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              Conteúdo técnico e estratégico produzido por quem vive a transformação de dados e marcas no mercado B2B e PME.
            </p>
          </div>

          {/* Action button for Sharp staff to generate/publish content */}
          {isSharp && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>+ Gerar Conteúdo</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Category Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por palavra-chave..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="bg-white border border-slate-200/90 rounded-[22px] p-6 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group hover:-translate-y-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span className="bg-cyan-50 text-cyan-800 px-2.5 py-0.5 rounded-full border border-cyan-200">
                  {article.category}
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <h2 className="text-base font-black text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug">
                {article.title}
              </h2>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>{article.author}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Gerar Novo Conteúdo (Sharp Admin) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-[28px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <PenTool className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-extrabold text-white">Publicar Novo Conteúdo Estratégico</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Título do Conteúdo / Artigo *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Posicionamento High-Ticket no Mercado B2B..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Categoria *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Presença Digital">Presença Digital</option>
                    <option value="Inteligência de Mercado">Inteligência de Mercado</option>
                    <option value="Comunicação Estratégica">Comunicação Estratégica</option>
                    <option value="BI & Gestão">BI & Gestão</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Autor *</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tempo de Leitura</label>
                  <input
                    type="text"
                    value={newReadTime}
                    onChange={(e) => setNewReadTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Resumo Executivo *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Resumo em 2 a 3 frases para o card do artigo..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Conteúdo Completo (Parágrafos separados por linha dupla)</label>
                <textarea
                  rows={4}
                  placeholder="Digite o texto do artigo em parágrafos..."
                  value={newContentText}
                  onChange={(e) => setNewContentText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Pontos de Ação (Takeaways) - um por linha</label>
                <textarea
                  rows={3}
                  placeholder="ex: Unifique a identidade da marca no LinkedIn&#10;Monitore a concorrência a cada trimestre..."
                  value={newTakeawaysText}
                  onChange={(e) => setNewTakeawaysText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs transition-colors"
                >
                  Publicar para Todos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article Detail Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[28px] max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-200">
            
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3">
              <span className="bg-cyan-50 text-cyan-800 text-xs font-bold px-3 py-1 rounded-full border border-cyan-200 inline-block">
                {activeArticle.category}
              </span>

              <h1 className="text-2xl font-black text-slate-900 leading-snug">
                {activeArticle.title}
              </h1>

              <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500 border-b border-slate-100 pb-4">
                <span>Por: {activeArticle.author}</span>
                <span>•</span>
                <span>{activeArticle.date}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-medium">
              {activeArticle.content.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-extrabold uppercase text-slate-900 tracking-wider block">
                Principais Pontos de Ação (Takeaways)
              </span>
              <ul className="space-y-1.5">
                {activeArticle.takeaways.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-700 flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setActiveArticle(null);
                  onGoToDiagnostic();
                }}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <span>Aplicar estas metodologias no meu negócio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
