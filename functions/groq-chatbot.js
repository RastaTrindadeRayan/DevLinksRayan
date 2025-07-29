const { Groq } = require("groq-sdk");

exports.handler = async (event, context) => {
  // Configuração de CORS
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://trindaderayan.com.br',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Resposta para requisições OPTIONS (pré-voo CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  // Verifica se o método é POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    // Verifica a chave API
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Chave API não configurada');
    }

    // Parse do corpo da requisição
    const { messages } = JSON.parse(event.body);
    
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
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erro no servidor',
        details: error.message
      })
    };
  }
};