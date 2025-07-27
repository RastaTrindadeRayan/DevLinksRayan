const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        const OLLAMA_SERVER = "http://SEU_IP_DO_GOOGLE_CLOUD:11434"; // Substitua
        
        const response = await fetch(`${OLLAMA_SERVER}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': event.headers.authorization || ''
            },
            body: event.body
        });

        return {
            statusCode: 200,
            body: await response.text()
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};