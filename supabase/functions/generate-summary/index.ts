import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DiaryEntry {
  data: string;
  conteudo: string;
  tags: string;
  resumo_emocional: string;
}

interface GenerateSummaryRequest {
  entries: DiaryEntry[];
  startDate: string;
  endDate: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { entries, startDate, endDate }: GenerateSummaryRequest = await req.json();
    
    console.log(`Generating summary for ${entries.length} entries from ${startDate} to ${endDate}`);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare entries data for AI
    const entriesText = entries.map(entry => 
      `Data: ${entry.data}\nConteúdo: ${entry.conteudo}\nTags emocionais: ${entry.tags}\nResumo emocional: ${entry.resumo_emocional}`
    ).join("\n\n");

    const prompt = `Analisa as seguintes entradas de diário emocional do período de ${startDate} a ${endDate} e cria um resumo em HTML profissional e empático.

Entradas:
${entriesText}

Cria um resumo em HTML que inclua:
1. Um título com o período analisado
2. Uma análise do estado emocional geral (parágrafo descritivo começando com "Do dia X a Y estiveste...")
3. Sugestões práticas e empáticas (começando com "Deves...")
4. Uma conclusão motivadora

O HTML deve ser bonito e bem formatado, usando tags como <h2>, <h3>, <p>, <ul>, <li>, <strong>, etc.
Usa um tom profissional mas caloroso e empático.
NÃO incluas tags <html>, <head> ou <body>, apenas o conteúdo interno.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "És um psicólogo especializado em análise emocional e bem-estar. Crias resumos empáticos e profissionais de entradas de diário."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Por favor, tenta novamente mais tarde." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "É necessário adicionar créditos à tua conta Lovable AI." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      throw new Error("Erro ao comunicar com o serviço de IA");
    }

    const aiData = await aiResponse.json();
    const htmlSummary = aiData.choices[0].message.content;

    console.log("Summary generated successfully");

    return new Response(
      JSON.stringify({ htmlSummary }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in generate-summary function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao gerar resumo" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
