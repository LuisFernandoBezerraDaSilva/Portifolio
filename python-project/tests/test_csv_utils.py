import pytest
import os
import tempfile
import shutil
from unittest.mock import patch, mock_open, MagicMock
from datetime import datetime
from utils.csv_utils import salvar_linhas_csv


class TestCsvUtils:
    """Testes unitários para utilitários de CSV."""
    
    def test_salvar_linhas_csv_novo_arquivo_com_header(self):
        """Testa criação de novo arquivo CSV com cabeçalho."""
        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = os.path.join(temp_dir, "test.csv")
            header = ["col1", "col2", "col3"]
            linhas = [["valor1", "valor2", "valor3"], ["valor4", "valor5", "valor6"]]
            
            salvar_linhas_csv(csv_path, linhas, header)
            
            # Verifica se arquivo foi criado
            assert os.path.exists(csv_path)
            
            # Verifica conteúdo
            with open(csv_path, 'r', encoding='utf-8') as f:
                content = f.read()
                assert "col1,col2,col3" in content
                assert '"valor1","valor2","valor3"' in content
                assert '"valor4","valor5","valor6"' in content
    
    def test_salvar_linhas_csv_arquivo_existente_sem_header(self):
        """Testa adição de linhas em arquivo existente (sem duplicar cabeçalho)."""
        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = os.path.join(temp_dir, "test.csv")
            
            # Cria arquivo inicial
            with open(csv_path, 'w', encoding='utf-8') as f:
                f.write("col1,col2\n")
                f.write('"inicial1","inicial2"\n')
            
            # Adiciona novas linhas
            novas_linhas = [["nova1", "nova2"]]
            salvar_linhas_csv(csv_path, novas_linhas, ["col1", "col2"])
            
            # Verifica que não duplicou cabeçalho
            with open(csv_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.strip().split('\n')
                assert len([line for line in lines if "col1,col2" in line]) == 1
                assert '"nova1","nova2"' in content
    
    def test_salvar_linhas_csv_vazia(self):
        """Testa comportamento com lista vazia de linhas."""
        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = os.path.join(temp_dir, "test.csv")
            header = ["col1", "col2"]
            
            salvar_linhas_csv(csv_path, [], header)
            
            # Deve criar arquivo apenas com cabeçalho
            with open(csv_path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                assert content == "col1,col2"
    
    def test_salvar_linhas_csv_sem_header(self):
        """Testa salvamento sem cabeçalho."""
        with tempfile.TemporaryDirectory() as temp_dir:
            csv_path = os.path.join(temp_dir, "test.csv")
            linhas = [["valor1", "valor2"]]
            
            salvar_linhas_csv(csv_path, linhas)
            
            with open(csv_path, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                assert content == '"valor1","valor2"'
