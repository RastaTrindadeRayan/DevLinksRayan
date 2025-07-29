// functions/groq-chatbot.js
const { Groq } = require("groq-sdk");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Método não permitido" };
  }

  const { messages } = JSON.parse(event.body);
  const groq = new Groq({ apiKey: "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" });

  try {
    const response = await groq.chat.completions.create({
      messages,
      model: "mixtral-8x7b-32768", // ou outro modelo suportado
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: response.choices[0].message.content }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Erro ao chamar Groq API" }) };
  }
};