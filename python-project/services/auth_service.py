import sys
import hashlib
import tkinter as tk
from tkinter import messagebox
from frontend.app import solicitar_senha
from config.settings import PASSWORD_HASH

def validar_autenticacao():
    """
    Valida a autenticação do usuário.
    Retorna True se a senha estiver correta, senão encerra o programa.
    """
    senha_digitada = solicitar_senha()
    senha_digitada_hash = hashlib.sha256(senha_digitada.encode()).hexdigest() if senha_digitada else ""
    
    if senha_digitada_hash != PASSWORD_HASH:
        tk.Tk().withdraw()
        messagebox.showerror("Acesso negado", "Senha incorreta, favor chamar o administrador")
        sys.exit(1)
    
    return True
