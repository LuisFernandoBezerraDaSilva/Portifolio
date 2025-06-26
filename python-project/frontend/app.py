import tkinter as tk
from tkinter import ttk, simpledialog

class App(tk.Tk):
    def __init__(self, total_files):
        super().__init__()
        self.title("Leitor Folha de Ponto")
        self.geometry("600x200")
        self.resizable(False, False)

        self.status_var = tk.StringVar()
        self.status_var.set("Aguardando início...")
        self.status_label = tk.Label(self, textvariable=self.status_var, anchor="w", justify="left", font=("Arial", 11), bg="#f0f0f0")
        self.status_label.pack(fill="x", padx=10, pady=(15, 5))

        self.progress = ttk.Progressbar(self, orient="horizontal", length=580, mode="determinate", maximum=total_files)
        self.progress.pack(padx=10, pady=5)

        self.fixed_label = tk.Label(self, text="Não feche esse arquivo antes de sua conclusão", fg="red", font=("Arial", 10, "bold"))
        self.fixed_label.pack(pady=(10, 0))

    def update_status(self, msg):
        self.status_var.set(msg)
        self.update_idletasks()

    def update_progress(self, value):
        self.progress["value"] = value
        self.update_idletasks()

def solicitar_senha():
    root = tk.Tk()
    root.withdraw()
    senha = simpledialog.askstring("Senha", "Digite a senha para acessar o sistema:", show='*', parent=root)
    root.destroy()
    return senha