export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    // Preflight request
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*', // ou 'https://trindaderayan.com.br' se quiser restringir
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const { message } = await req.json();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Você é um assistente espiritual rastafári chamado RASTRINDADs. Responda com sabedoria e serenidade." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Não consegui entender, irmão.";

  return new Response(JSON.stringify({ reply }), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // ou coloque seu domínio aqui para restringir
    },
  });
}
