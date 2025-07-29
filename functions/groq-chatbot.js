const { Groq } = require("groq-sdk");

exports.handler = async (event, context) => {
  // Verificação de erro robusta
  if (!process.env.GROQ_API_KEY) {
    console.error("ERRO: Chave API não configurada");
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Configuração do servidor incompleta",
        solution: "Configure a variável GROQ_API_KEY no Netlify"
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    // Verifica o método HTTP
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método não permitido" }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    // Parse e validação do corpo
    const { messages } = JSON.parse(event.body);
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Formato de mensagens inválido" }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages,
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        reply: completion.choices[0]?.message?.content || "Não recebi uma resposta válida"
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };

  } catch (error) {
    console.error("ERRO DETALHADO:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Erro ao processar sua solicitação",
        details: error.message,
        solution: "Verifique os logs do servidor"
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};