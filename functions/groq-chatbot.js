const { Groq } = require("groq-sdk");

// Configuração de debug (remova em produção)
const DEBUG_MODE = process.env.NETLIFY_DEV === "true";

exports.handler = async (event, context) => {
  // Verificação EXTRA da chave API
  if (DEBUG_MODE) {
    console.log("Variáveis de ambiente:", process.env);
    console.log("Corpo da requisição:", event.body);
  }

  // Bloqueia métodos não permitidos
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método não permitido" }),
      headers: { 
        'Content-Type': 'application/json',
        'Allow': 'POST'
      }
    };
  }

  // Verificação CRÍTICA da chave API
  if (!process.env.GROQ_API_KEY) {
    const errorMsg = "Erro: GROQ_API_KEY não configurada no ambiente";
    console.error(errorMsg);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Erro de configuração do servidor",
        details: errorMsg,
        solution: "Configure a variável GROQ_API_KEY no painel do Netlify"
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    // Parse e validação do corpo
    if (!event.body) {
      throw new Error("Corpo da requisição vazio");
    }

    const { messages } = JSON.parse(event.body);
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Formato de mensagens inválido");
    }

    const groq = new Groq({ 
      apiKey: process.env.GROQ_API_KEY 
    });

    // Configuração da chamada à API Groq
    const completion = await groq.chat.completions.create({
      messages,
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    if (DEBUG_MODE) {
      console.log("Resposta da Groq API:", completion);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        reply: completion.choices[0]?.message?.content || "Não foi possível gerar resposta"
      }),
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST'
      }
    };

  } catch (error) {
    console.error("ERRO DETALHADO:", error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Erro ao processar sua solicitação",
        details: error.message,
        stack: DEBUG_MODE ? error.stack : undefined
      }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};