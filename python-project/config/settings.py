import os
from dotenv import load_dotenv

# Configura o caminho das credenciais do Google
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.join("configs", "smart-bloom-462611-s2-960e48565279.json")
load_dotenv(dotenv_path=os.path.join("configs", ".env"))

# Configurações do Google Document AI
PROJECT_ID = os.getenv("PROJECT_ID")
LOCATION = os.getenv("LOCATION")
PROCESSOR_ID = os.getenv("PROCESSOR_ID")
VERSION_ID = os.getenv("VERSION_ID")
PASSWORD_HASH = os.getenv("PASSWORD_HASH")

# Definições de campos CSV
CAMPOS_FIXOS = ["arquivo", "matricula", "nome", "periodo"]
CAMPOS_DIA = ["diaDoMes", "diaSemana", "fim", "inicio", "intervalo-f", "intervalo-i", "hExtra-f", "hExtra-i"]
