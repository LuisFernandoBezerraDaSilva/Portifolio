import os

def salvar_linhas_csv(caminho_csv, linhas, header=None):
    novo_arquivo = not os.path.exists(caminho_csv)
    with open(caminho_csv, "a", encoding="utf-8", newline='') as f:
        if novo_arquivo and header:
            f.write(",".join(header) + "\n")
        for valores in linhas:
            f.write(",".join(f'"{v}"' for v in valores) + "\n")