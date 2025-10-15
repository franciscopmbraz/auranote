import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing emotional content...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em análise emocional de texto em português. Analise o texto do diário fornecido e identifique as emoções presentes.

Responda APENAS com um objeto JSON válido (sem markdown, sem explicações extras) no seguinte formato:
{
  "summary": "breve resumo do estado emocional (máximo 2 frases)",
  "tags": ["emoção1", "emoção2", "emoção3"]
}

Tags possíveis (escolha 2-4 que melhor se aplicam):
- feliz
- triste
- ansioso
- calmo
- energizado
- cansado
- motivado
- frustrado
- grato
- esperançoso
- nostálgico
- confuso
- relaxado
- estressado
- animado
- reflexivo
- solitário
- conectado
- preocupado
- otimista`
          },
          {
            role: 'user',
            content: `Analise este texto de diário:\n\n${content}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Por favor, tente novamente em alguns instantes.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Por favor, adicione créditos ao seu workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI response:', aiResponse);

    // Parse the AI response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      // Fallback response
      analysis = {
        summary: 'Não foi possível analisar completamente o texto. Tente novamente.',
        tags: ['reflexivo']
      };
    }

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-emotion function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        summary: 'Erro ao analisar emoções',
        tags: []
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
