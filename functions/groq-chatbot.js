const { Groq } = require("groq-sdk");

exports.handler = async (event, context) => {
  // Configuração de CORS
  const headers = {
    'Access-Control-Allow-Origin': 'https://trindaderayan.com.br',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Resposta para OPTIONS (pré-voo CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  try {
    // Verifique a chave API
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Variável GROQ_API_KEY não configurada');
    }

    // Verifique o método HTTP
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Método não permitido' })
      };
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
        reply: completion.choices[0]?.message?.content || "Sem resposta"
      })
    };

  } catch (error) {
    console.error('Erro na função:', error);
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