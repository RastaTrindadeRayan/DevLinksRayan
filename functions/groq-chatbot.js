const { Groq } = require("groq-sdk");
// Adicione no início do arquivo groq-chatbot.js
console.log("Debug - Ambiente:", {
  chavePresente: !!process.env.GROQ_API_KEY,
  chaveIniciaCom: process.env.GROQ_API_KEY?.slice(0, 4) + '...',
  netlifyDev: process.env.NETLIFY_DEV
});

exports.handler = async (event, context) => {
  // Configuração de CORS
  const headers = {
    'Access-Control-Allow-Origin': 'https://trindaderayan.com.br',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Resposta para OPTIONS (CORS pré-flight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    // Verificação da chave API
    if (!process.env.GROQ_API_KEY) {
      console.error('Erro: GROQ_API_KEY não definida');
      throw new Error('Configuração do servidor incompleta');
    }

    // Verifica o método HTTP
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Método não permitido' })
      };
    }

    // Parse do corpo da requisição
    const { messages } = JSON.parse(event.body);
    if (!messages) {
      throw new Error('Formato inválido: messages é obrigatório');
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });

    const completion = await groq.chat.completions.create({
      messages,
      model: "mixtral-8x7b-32768",
      temperature: 0.7
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: completion.choices[0]?.message?.content || "Não foi possível gerar resposta"
      })
    };

  } catch (error) {
    console.error('Erro detalhado:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro no processamento',
        details: error.message
      })
    };
  }
};