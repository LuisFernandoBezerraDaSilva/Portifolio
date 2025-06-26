"""
Arquivo principal para executar APENAS TESTES UNITÁRIOS.
Execute: python run_tests.py
"""
import subprocess
import sys
import os

def run_tests():
    """Executa apenas testes unitários usando pytest."""
    print("🧪 Executando TESTES UNITÁRIOS do Leitor de Folha de Ponto...")
    print("=" * 60)
    
    try:
        # Executa pytest com configurações focadas em testes unitários
        result = subprocess.run([
            sys.executable, "-m", "pytest",
            "tests/",
            "-v",
            "--tb=short",
            "--color=yes",
            "--durations=10",  # Mostra os 10 testes mais lentos
            "--cov=utils",     # Cobertura para utils
            "--cov=services",  # Cobertura para services
            "--cov-report=term-missing",  # Mostra linhas não cobertas
            "--cov-report=html:htmlcov",  # Gera relatório HTML
            "-m", "not integration",  # Exclui qualquer teste marcado como integração
        ], capture_output=False, text=True)
        
        print("\n" + "=" * 60)
        
        if result.returncode == 0:
            print("✅ Todos os testes passaram!")
            print("📊 Relatório de cobertura HTML gerado em: htmlcov/index.html")
        else:
            print("❌ Alguns testes falharam.")
            print(f"Código de saída: {result.returncode}")
            
        return result.returncode
        
    except FileNotFoundError:
        print("❌ Erro: pytest não encontrado.")
        print("💡 Instale com: pip install pytest pytest-cov")
        return 1
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
        return 1

def check_dependencies():
    """Verifica se as dependências necessárias estão instaladas."""
    required_packages = ['pytest', 'pytest-cov']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("⚠️  Dependências faltando:")
        for pkg in missing_packages:
            print(f"   - {pkg}")
        print(f"\n💡 Instale com: pip install {' '.join(missing_packages)}")
        return False
    
    return True

if __name__ == "__main__":
    print("🔍 Verificando dependências...")
    
    if not check_dependencies():
        sys.exit(1)
    
    # Adiciona o diretório raiz ao PYTHONPATH
    project_root = os.path.dirname(os.path.abspath(__file__))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    
    exit_code = run_tests()
    sys.exit(exit_code)
