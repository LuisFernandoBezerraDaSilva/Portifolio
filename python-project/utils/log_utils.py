import os
from datetime import datetime

def log_envio(msg):
    pasta_logs = "logs de envio"
    if not os.path.exists(pasta_logs):
        os.makedirs(pasta_logs)
    nome_arquivo = datetime.now().strftime("%d-%m-%Y logs.txt")
    caminho_arquivo = os.path.join(pasta_logs, nome_arquivo)
    with open(caminho_arquivo, "a", encoding="utf-8") as f:
        f.write(msg + "\n")