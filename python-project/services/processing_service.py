import os
from services.document_ai_service import (
    deploy_processor_version,
    undeploy_processor_version,
    enviar_para_google_document_ai
)
from utils.document_ai_utils import extrair_apontamentos
from utils.file_utils import (
    mover_arquivo,
    remover_arquivo
)
from utils.csv_utils import salvar_linhas_csv
from utils.log_utils import log_envio
from config.settings import PROJECT_ID, LOCATION, PROCESSOR_ID, VERSION_ID

def processar_arquivos(app, arquivos, nome_pasta_destino, csv_path, campos_fixos, campos_dia):
    """
    Processa uma lista de arquivos usando Google Document AI.
    
    Args:
        app: Instância da aplicação GUI
        arquivos: Lista de arquivos para processar
        nome_pasta_destino: Pasta de destino para os arquivos processados
        csv_path: Caminho do arquivo CSV de resultados
        campos_fixos: Lista de campos fixos do CSV
        campos_dia: Lista de campos de dia do CSV
    """
    total_files = len(arquivos)
    max_progress = total_files + 2
    progress = 0

    app.progress["maximum"] = max_progress
    app.update_progress(progress)  
    log_envio("Iniciando processamento dos arquivos na pasta atual...")
    app.update_status("Iniciando processamento dos arquivos na pasta atual...")
    salvar_linhas_csv(csv_path, [], header=campos_fixos + campos_dia)

    # --- IMPLANTAÇÃO DA VERSÃO ---
    deploy_processor_version(PROJECT_ID, LOCATION, PROCESSOR_ID, VERSION_ID)
    progress += 1
    app.update_progress(progress) 
    app.update_status("Versão do Document AI implantada. Iniciando envios...")

    try:
        for idx, arquivo in enumerate(arquivos, 1):
            app.update_status(f"Processando arquivo: {arquivo}")
            log_envio(f"Processando arquivo: {arquivo}")
            caminho_origem = os.path.join('.', arquivo)
            caminho_destino = os.path.join(nome_pasta_destino, arquivo)
            app.update_status(f"Copiando {arquivo} para {nome_pasta_destino}...")
            log_envio(f"Copiando {arquivo} para {nome_pasta_destino}...")
            mover_arquivo(caminho_origem, caminho_destino)

            app.update_status(f"Enviando {arquivo} para o Google Document AI...")
            log_envio(f"Enviando {arquivo} para o Google Document AI...")
            doc = enviar_para_google_document_ai(PROJECT_ID, LOCATION, PROCESSOR_ID, VERSION_ID, caminho_destino)

            if doc is not None:
                linhas = extrair_apontamentos(doc, arquivo, campos_fixos, campos_dia)
                salvar_linhas_csv(csv_path, linhas)
                app.update_status(f"Salvando resultado de {arquivo} no CSV...")
                log_envio(f"Salvando resultado de {arquivo} no CSV...")
            else:
                app.update_status(f"Falha ao processar {arquivo}.")
                log_envio(f"Falha ao processar {arquivo}.")

            app.update_status(f"Removendo {arquivo} da pasta original...")
            log_envio(f"Removendo {arquivo} da pasta original...")
            remover_arquivo(caminho_origem)
            progress += 1
            app.update_progress(progress)  
        app.update_status("Finalizando processamento do Document AI...")
        log_envio("Finalizando processamento do Document AI...")
    finally:
        undeploy_processor_version(PROJECT_ID, LOCATION, PROCESSOR_ID, VERSION_ID)
        progress += 1
        app.update_progress(progress)  
        app.update_status("Processamento finalizado.")
        log_envio("Processamento finalizado.")
