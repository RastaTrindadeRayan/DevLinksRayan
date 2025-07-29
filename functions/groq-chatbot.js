const { Groq } = require("groq-sdk");

exports.handler = async (event, context) => {
  // 1. Bloqueia métodos não-POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método não permitido. Use POST." }),
      headers: { 
        'Content-Type': 'application/json',
        'Allow': 'POST'
      }
    };
  }

  // 2. Verifica chave da API (crítico para produção)
  if (!process.env.GROQ_API_KEY) {
    console.error("❌ ERRO: GROQ_API_KEY não configurada");
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Erro de configuração",
        details: "Chave da API Groq não encontrada",
        solution: "Configure GROQ_API_KEY no Netlify > Environment"
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    // 3. Processa o corpo da requisição
    const { messages } = JSON.parse(event.body);
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Formato inválido: 'messages' deve ser um array");
    }

    // 4. Conecta à Groq
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const completion = await groq.chat.completions.create({
      messages,
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024
    });

    // 5. Retorna resposta formatada
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        reply: completion.choices[0]?.message?.content || "Sem resposta"
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://trindaderayan.com.br' // ⚠️ Altere para seu domínio
      }
    };

  } catch (error) {
    // 6. Tratamento de erros detalhado
    console.error("💥 ERRO:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Falha no servidor",
        details: error.message,
        stack: process.env.NETLIFY_DEV ? error.stack : undefined // Mostra stack apenas localmente
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};