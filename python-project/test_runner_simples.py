#!/usr/bin/env python3
"""Script simples para executar APENAS TESTES UNITÁRIOS."""

import subprocess
import sys
import os

def main():
    """Executa apenas testes unitários e mostra resultados."""
    print("🧪 Executando TESTES UNITÁRIOS do projeto...")
    print("=" * 50)
    
    try:
        # Executa pytest apenas para testes unitários
        result = subprocess.run([
            sys.executable, '-m', 'pytest', 
            'tests/', 
            '-v',
            '--tb=short',
            '-m', 'not integration'  # Exclui testes de integração
        ], cwd=os.getcwd(), timeout=60)
        
        if result.returncode == 0:
            print("\n✅ Todos os testes unitários passaram!")
        else:
            print(f"\n❌ Alguns testes unitários falharam (código: {result.returncode})")
            
        return result.returncode
        
    except subprocess.TimeoutExpired:
        print("\n⏰ Testes demoraram muito (timeout)")
        return 1
    except Exception as e:
        print(f"\n💥 Erro ao executar testes: {e}")
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
