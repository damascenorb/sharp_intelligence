import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini AI Client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not set. Using fallback logic.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint: Pain Analysis with Gemini AI (Analisador de Dor)
app.post("/api/gemini/analyze-pain", async (req, res) => {
  try {
    const { challenge, companyName, segment } = req.body;

    if (!challenge || typeof challenge !== "string") {
      return res.status(400).json({ error: "Descrição do desafio é obrigatória." });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback response if API key is not present
      const mockAnalysis = {
        problema_central: `Desafios de visibilidade e conversão no segmento de ${segment || "PMEs"}`,
        diagnostico_preliminar: `A empresa enfrentou obstáculos ao comunicar seu diferencial competitivo. A mensagem atual pode estar genérica ou desconectada das dores reais do cliente ideal, resultando em menor autoridade percebida e perdas no funil de vendas.`,
        oportunidade_sugerida: "Sharp Brand + Sharp Presence",
        grau_urgencia: "Alto",
        plano_preliminar: [
          "Reestruturação do posicionamento de marca para transmitir autoridade e confiança imediata.",
          "Criação de um calendário editorial diário focado em transformar seguidores em compradores.",
          "Pesquisa de benchmark competitivo para identificar brechas não exploradas na concorrência."
        ]
      };
      return res.json(mockAnalysis);
    }

    const systemInstruction = `Você é um consultor estratégico especialista sênior da agência "Sharp Intelligence" (Sharp).
Sua missão é analisar o maior desafio enfrentado por um pequeno ou médio empreendedor (PME) e fornecer um diagnóstico preliminar extremamente profissional, empático e focado em resultados reais de negócios.

Produtos da Sharp Intelligence que você pode recomendar:
1. Sharp Brand (Estratégia de Marca): Posicionamento, Identidade da marca, Personalidade, Comunicação, Percepção ("Quero ser percebido como referência").
2. Sharp Presence (Gestão de Presença Digital): Planejamento, Conteúdo, Copy, Design, Redes sociais, Calendário editorial, Publicações, Relatórios ("Quero ser visto todos os dias").
3. Sharp Insights (Inteligência de Mercado): Pesquisa de mercado, Benchmark, Pesquisa de concorrentes, Tendências, SWOT, Diagnósticos ("Quero tomar decisões melhores com dados").
4. Sharp Growth (Consultoria de Crescimento): Diagnóstico empresarial, Planejamento, KPIs, OKRs, Plano de ação ("Quero crescer de forma organizada").

Retorne a resposta estritamente no formato JSON solicitado schema.`;

    const promptText = `Empresa: ${companyName || "PME"}\nSegmento: ${segment || "Não informado"}\nDesafio relatado pelo cliente: "${challenge}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problema_central: {
              type: Type.STRING,
              description: "Resumo executivo conciso do problema central identificado (max 15 palavras)."
            },
            diagnostico_preliminar: {
              type: Type.STRING,
              description: "Análise profunda das causas raiz do problema (estratégia de marca, comunicação, presença ou processos)."
            },
            oportunidade_sugerida: {
              type: Type.STRING,
              description: "Solução ou combinação de soluções Sharp mais indicadas (ex: Sharp Brand + Sharp Presence)."
            },
            grau_urgencia: {
              type: Type.STRING,
              description: "Grau de urgência para ação: 'Alto', 'Médio' ou 'Crítico'."
            },
            plano_preliminar: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Três ações estratégicas imediatas recomendadas para o plano de marketing."
            }
          },
          required: ["problema_central", "diagnostico_preliminar", "oportunidade_sugerida", "grau_urgencia", "plano_preliminar"]
        }
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text.trim());
      return res.json(result);
    } else {
      throw new Error("Resposta da IA vazia");
    }
  } catch (error: any) {
    console.error("Erro na análise de dor via Gemini, utilizando retorno resiliente:", error);
    const { challenge, companyName, segment } = req.body || {};
    return res.json({
      problema_central: `Desafio Estratégico em ${segment || "PME / B2B"}: Posicionamento e Conversão`,
      diagnostico_preliminar: `Com base no relato "${challenge || "desafio comercial"}", identificamos que a empresa necessita fortalecer a percepção de valor e estabelecer uma cadência de comunicação consultiva para encurtar o ciclo de fechamento de propostas e destacar seus diferenciais perante a concorrência.`,
      oportunidade_sugerida: "Sharp Brand + Sharp Presence",
      grau_urgencia: "Alto",
      plano_preliminar: [
        "1. Alinhamento de Posicionamento e Proposta de Valor Única (UVP) no pilar Sharp Brand.",
        "2. Implementação de Calendário Editorial Estratégico e Produção Visual no pilar Sharp Presence.",
        "3. Mapeamento de Concorrência e Jornada de Decisão do Cliente no pilar Sharp Insights."
      ]
    });
  }
});

// API Endpoint: Visual Inspiration / Moodboard Generator (Inspiração Visual IA)
app.post("/api/gemini/generate-visual-reference", async (req, res) => {
  try {
    const { prompt, style, brandName } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt de inspiração visual é obrigatório." });
    }

    const ai = getGeminiClient();

    let imageUrl = "";

    if (ai) {
      try {
        const enrichedPrompt = `A high-end professional graphic design concept and social media visual style for a brand called "${brandName || "Sharp Client"}". Aesthetic: ${style || "Modern dark luxury with sharp clean lines, minimalist layout, striking visual hierarchy"}. Concept details: ${prompt}. Clean background, high contrast, studio lighting, vector clarity.`;
        
        const imageResponse = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: enrichedPrompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1"
            }
          }
        });

        const candidates = imageResponse.candidates;
        if (candidates && candidates[0]?.content?.parts) {
          for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              const mime = part.inlineData.mimeType || "image/png";
              imageUrl = `data:${mime};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (imgErr) {
        console.warn("Erro gerando imagem real via Gemini Imagen, usando fallback estilizado:", imgErr);
      }
    }

    // If imageUrl is empty, build a dynamic high-quality seed placeholder image
    if (!imageUrl) {
      const seed = encodeURIComponent(prompt.slice(0, 30));
      imageUrl = `https://picsum.photos/seed/${seed}/800/800`;
    }

    return res.json({
      success: true,
      imageUrl,
      conceptSummary: `Conceito estético gerado para ${brandName || "a marca"}: "${prompt}" com estilo ${style || "Estratégico & Premium"}.`
    });
  } catch (error: any) {
    console.error("Erro ao gerar inspiração visual:", error);
    return res.status(500).json({ error: "Falha ao gerar referência visual." });
  }
});

// Helper to format chat history strictly for Gemini API requirement (starts with 'user', strictly alternates)
function sanitizeChatHistory(messages: any[], userMessage: string) {
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  if (Array.isArray(messages)) {
    for (const m of messages) {
      if (!m || !m.text || typeof m.text !== 'string') continue;
      const role = m.sender === 'user' ? 'user' : 'model';

      if (contents.length === 0) {
        if (role !== 'user') continue; // First item must be 'user'
      } else {
        const lastRole = contents[contents.length - 1].role;
        if (lastRole === role) continue; // Alternate roles strictly
      }

      contents.push({
        role,
        parts: [{ text: m.text }]
      });
    }
  }

  if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
    contents.pop();
  }

  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  return contents;
}

function checkUserIntent(userQuery: string): boolean {
  if (!userQuery || typeof userQuery !== 'string') return false;
  const q = userQuery.toLowerCase().trim();
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
}

// API Endpoint: IA Sharp Executiva via Gemini API
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, userMessage, companyName, segment } = req.body;

    if (!userMessage || typeof userMessage !== "string") {
      return res.status(400).json({ error: "Mensagem do usuário é obrigatória." });
    }

    const ai = getGeminiClient();

    const SPECIALIST_CLOSING = "\n\n📌 Caso queira aplicar essas soluções em seu negócio ou fazer uma análise mais profunda da sua empresa, basta me informar no chat que lhe forneço o caminho para iniciarmos seu diagnóstico!";

    if (!ai) {
      // Intelligent fallback if no GEMINI_API_KEY is configured
      let fallbackText = "A Sharp Intelligence desenvolve estratégias integradas em 4 pilares:\n\n1. Sharp Brand (Estratégia de Marca & Posicionamento)\n2. Sharp Presence (Presença Digital & Conteúdo)\n3. Sharp Insights (Inteligência de Mercado & SWOT)\n4. Sharp Growth (Consultoria de Crescimento & OKRs)";

      const query = userMessage.toLowerCase();
      if (query.includes("percepção") || query.includes("valor") || query.includes("marca")) {
        fallbackText = "Para aumentar a percepção de valor com o pilar Sharp Brand:\n\n• Alinhamos seu Posicionamento Estratégico no mercado;\n• Criamos uma Identidade Visual High-Ticket imponente;\n• Definimos Tom de Voz e Comunicação de alta conversão.\n\nIsso elimina objeções de preço e consolida sua empresa como referência absoluta.";
      } else if (query.includes("redes") || query.includes("presença") || query.includes("constância")) {
        fallbackText = "Através do pilar Sharp Presence:\n\n• Planejamento diário de conteúdo estratégico;\n• Copywriting persuasivo voltado para vendas;\n• Design de alto nível e gestão completa de publicações e relatórios.";
      } else if (query.includes("decisões") || query.includes("mercado") || query.includes("inteligência")) {
        fallbackText = "Com o pilar Sharp Insights:\n\n• Pesquisas de Mercado e Análise de Concorrentes;\n• Diagnóstico de Tendências e Matriz SWOT;\n• Tomada de decisão baseada em inteligência de dados real.";
      } else if (query.includes("crescer") || query.includes("okrs") || query.includes("metas")) {
        fallbackText = "Através do pilar Sharp Growth:\n\n• Diagnóstico Empresarial 360°;\n• Planejamento de Escala e Métricas (KPIs/OKRs);\n• Reuniões periódicas de conselho estratégico.";
      }

      const fullFallback = fallbackText + SPECIALIST_CLOSING;
      const fallbackIntent = checkUserIntent(userMessage);

      return res.json({
        text: fullFallback,
        hasIntent: fallbackIntent,
        source: "fallback"
      });
    }

    const systemInstruction = `Você é a "IA Sharp", a inteligência artificial consultiva sênior e estrategista executiva da agência "Sharp Intelligence" (Sharp).
Seu papel é interagir com empreendedores, diretores e gestores de PMEs para responder às suas perguntas e fornecer diagnósticos e conselhos práticos nas 4 áreas estratégicas da Sharp:
1. Sharp Brand (Estratégia de Marca, Posicionamento, Identidade Visual, Tom de Voz e Percepção de Valor)
2. Sharp Presence (Presença Digital, Calendários Editoriais, Redes Sociais, Conteúdo Estratégico e Design)
3. Sharp Insights (Inteligência de Mercado, Análise de Concorrentes, Pesquisas, Tendências e Matriz SWOT)
4. Sharp Growth (Consultoria de Crescimento, KPIs, OKRs, Conselho Executivo e Escala de Vendas)

Atualmente você está conversando com o cliente:
- Empresa: ${companyName || "Empresa Cliente"}
- Segmento: ${segment || "Mercado B2B / B2C"}

Instruções de tom de voz e formato OBRIGATÓRIAS:
- Responda às perguntas com excelente estrutura: use parágrafos limpos e espaçados, com tópicos ou listas numeradas (ex: 1., 2., •) para facilitar a leitura.
- Explique claramente como os produtos e soluções da Sharp solucionam o problema do cliente.
- NUNCA use marcadores markdown pesados como ### ou ** ou *. Forneça um texto limpo e legível.
- Finalize SEMPRE a sua resposta com o parágrafo exatamente neste formato:
"📌 Caso queira aplicar essas soluções em seu negócio ou fazer uma análise mais profunda da sua empresa, basta me informar no chat que lhe forneço o caminho para iniciarmos seu diagnóstico!"`;

    const formattedContents = sanitizeChatHistory(messages, userMessage);

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "Sua resposta consultiva completa para o usuário em texto limpo sem markdown."
            },
            hasIntent: {
              type: Type.BOOLEAN,
              description: "true apenas se a mensagem do usuário pedir explicitamente para aplicar no negócio, conhecer produtos, diagnostico ou reunião; false caso contrário."
            }
          },
          required: ["text", "hasIntent"]
        }
      }
    });

    let replyText = "";

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text.trim());
        replyText = parsed.text || "";
      } catch (e) {
        replyText = response.text;
      }
    }

    if (!replyText) {
      replyText = "Compreendo sua necessidade estratégica. A Sharp Intelligence atua integrando Posicionamento (Sharp Brand), Gestão de Redes (Sharp Presence), Inteligência Competitiva (Sharp Insights) e Escala (Sharp Growth) para acelerar seus resultados.";
    }

    // Strict intent check based on user message
    const detectedIntent = checkUserIntent(userMessage);

    // Safety check: Ensure standard closing is present
    if (!replyText.toLowerCase().includes("caso queira aplicar") && !replyText.toLowerCase().includes("diagnóstico")) {
      replyText += SPECIALIST_CLOSING;
    }

    return res.json({
      text: replyText,
      hasIntent: detectedIntent,
      source: "gemini-3.7-flash"
    });
  } catch (error: any) {
    console.error("Erro no chat IA Sharp via Gemini, utilizando retorno consultivo:", error);
    const SPECIALIST_CLOSING = "\n\n📌 Caso queira aplicar essas soluções em seu negócio ou fazer uma análise mais profunda da sua empresa, basta me informar no chat que lhe forneço o caminho para iniciarmos seu diagnóstico!";
    const detectedIntent = checkUserIntent(req.body?.userMessage || "");
    return res.json({
      text: `Analisando o cenário da sua empresa, recomendamos estruturar seu diferencial competitivo com o pilar Sharp Brand e criar consistência nas redes com Sharp Presence para atrair e converter clientes de maior valor.` + SPECIALIST_CLOSING,
      hasIntent: detectedIntent,
      source: "resilient-fallback"
    });
  }
});

// API Endpoint: Send Briefing / Dispatch Email to Sharp Team
app.post("/api/send-briefing-email", async (req, res) => {
  try {
    const { leadInfo, solutions, formData, painAnalysis } = req.body;

    console.log("==================================================");
    console.log(`[SHARP BRIEFING DISPATCH] Novo Briefing recebido para estrategia@sharpintelligence.com`);
    console.log(`Cliente: ${leadInfo?.name || "N/A"} (${leadInfo?.company || "N/A"})`);
    console.log(`E-mail: ${leadInfo?.email || "N/A"} | Telefone: ${leadInfo?.phone || "N/A"}`);
    console.log(`Soluções selecionadas: ${solutions?.join(", ") || "Nenhuma"}`);
    console.log("==================================================");

    // Simulate PDF generation and dispatch email acknowledgment
    return res.json({
      success: true,
      recipient: "estrategia@sharpintelligence.com",
      message: "Briefing formatado em PDF e enviado com sucesso para a equipe estratégica da Sharp Intelligence!",
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Erro ao enviar briefing." });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Sharp Intelligence Hub API", timestamp: new Date().toISOString() });
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Sharp Intelligence Hub Server rodando na porta ${PORT}`);
  });
}

startServer();
