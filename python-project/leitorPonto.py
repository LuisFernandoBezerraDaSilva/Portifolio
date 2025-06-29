import os
import threading
from frontend.app import App
from services.auth_service import validar_autenticacao
from services.processing_service import processar_arquivos
from utils.file_utils import criar_pasta_mes_enviados
from config.settings import CAMPOS_FIXOS, CAMPOS_DIA

if __name__ == "__main__":
    # Valida autenticação
    validar_autenticacao()
    
    # Coleta arquivos para processar
    arquivos = [f for f in os.listdir('.') if f.lower().endswith(('.pdf', '.jpg', '.png'))]
    total_files = len(arquivos)
    
    # Configura destinos e interface
    nome_pasta_destino = criar_pasta_mes_enviados()
    csv_path = os.path.join(nome_pasta_destino, "resultados.txt")
    app = App(total_files + 2) 
    
    # Inicia processamento em thread separada
    thread = threading.Thread(
        target=processar_arquivos, 
        args=(app, arquivos, nome_pasta_destino, csv_path, CAMPOS_FIXOS, CAMPOS_DIA)
    )
    thread.start()
    app.mainloop()