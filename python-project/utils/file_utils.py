import os
import shutil
from datetime import datetime

def criar_pasta_enviados():
    """Garante que exista a pasta 'enviados' e retorna seu caminho."""
    if not os.path.exists("enviados"):
        os.makedirs("enviados")
    return "enviados"

def criar_pasta_mes_enviados():
    """Cria (se necessário) e retorna o caminho da pasta enviados/mm-aaaa para o mês atual."""
    mes_atual = datetime.now().strftime("%m-%Y")
    pasta_base = criar_pasta_enviados()
    pasta_mes = os.path.join(pasta_base, mes_atual)
    if not os.path.exists(pasta_mes):
        os.makedirs(pasta_mes)
    return pasta_mes

def mover_arquivo(origem, destino):
    shutil.copy2(origem, destino)

def remover_arquivo(caminho):
    os.remove(caminho)