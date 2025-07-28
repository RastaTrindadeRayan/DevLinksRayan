import modal
import os
import shutil

app = modal.App("clean-volume-temp")

@app.function(volumes={"/root/.ollama": modal.Volume.from_name("ollama-models")})
def clean():
    try:
        if os.path.exists("/root/.ollama/models"):
            shutil.rmtree("/root/.ollama/models")
            os.makedirs("/root/.ollama/models")
        return "Volume limpo com sucesso!"
    except Exception as e:
        return f"Erro: {str(e)}"

if __name__ == "__main__":
    with app.run():
        print(clean.remote())