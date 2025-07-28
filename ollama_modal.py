import modal
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import time
import json
import logging
from typing import Optional

# Configuração do logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = modal.App("ollama-chat-integration")

# Configuração da imagem Docker
image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install("curl", "sudo", "python3-pip")
    .run_commands(
        "curl -fsSL https://ollama.com/install.sh | sh",
        "mkdir -p /root/.ollama",
        "sudo chmod -R 777 /root/.ollama",
        "pip install fastapi pydantic"
    )
)

# Volume persistente para os modelos
volume = modal.Volume.from_name("ollama-chat-storage", create_if_missing=True)

# Criação do app FastAPI com CORS
web_app = FastAPI()

# Configuração de CORS para integração com o frontend
web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://trindaderayan.com.br", "https://www.trindaderayan.com.br"],
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

@web_app.post("/chat")
async def chat_endpoint(request: Request):
    proc = None
    try:
        # Parse do JSON com tratamento de erros
        try:
            data = await request.json()
            prompt = data.get("message") or data.get("prompt")
            
            if not prompt:
                logger.error("Nenhuma mensagem recebida")
                return Response(
                    content=json.dumps({"error": "O campo 'message' é obrigatório"}),
                    media_type="application/json",
                    status_code=400
                )
        except json.JSONDecodeError:
            return Response(
                content=json.dumps({"error": "JSON inválido"}),
                media_type="application/json",
                status_code=400
            )

        logger.info(f"Recebida mensagem: {prompt}")

        # Inicia o servidor Ollama
        proc = subprocess.Popen(
            ["ollama", "serve"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        time.sleep(8)  # Tempo para inicialização

        # Verifica e baixa o modelo se necessário
        try:
            subprocess.run(["ollama", "list"], check=True)
        except subprocess.CalledProcessError:
            logger.info("Baixando modelo tinyllama...")
            subprocess.run(["ollama", "pull", "tinyllama"], check=True)

        # Executa a consulta com tratamento robusto de encoding
        result = subprocess.run(
            ["ollama", "run", "tinyllama", prompt],
            capture_output=True,
            text=False,  # Captura como bytes para melhor controle
            timeout=90
        )

        # Decodificação com tratamento de erros
        response_text = result.stdout.decode('utf-8', errors='replace').strip()
        
        logger.info(f"Resposta gerada: {response_text[:100]}...")  # Log parcial

        return Response(
            content=json.dumps({
                "response": response_text,
                "error": None
            }, ensure_ascii=False),
            media_type="application/json; charset=utf-8"
        )

    except subprocess.TimeoutExpired:
        logger.error("Timeout ao processar a mensagem")
        return Response(
            content=json.dumps({
                "error": "O servidor demorou muito para responder",
                "response": None
            }),
            media_type="application/json",
            status_code=504
        )
    except Exception as e:
        logger.error(f"Erro interno: {str(e)}")
        return Response(
            content=json.dumps({
                "error": "Erro interno no servidor",
                "response": None
            }),
            media_type="application/json",
            status_code=500
        )
    finally:
        if proc:
            proc.terminate()

@app.function(
    image=image,
    volumes={"/root/.ollama": volume},
    timeout=600,  # 10 minutos
    cpu=4,       # 4 CPUs
    memory=8192, # 8GB RAM
    keep_warm=1  # Mantém uma instância ativa
)
@modal.asgi_app()
def api():
    return web_app