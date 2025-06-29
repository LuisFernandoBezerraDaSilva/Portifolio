import pytest
import os
import tempfile
from unittest.mock import patch, mock_open, MagicMock
from datetime import datetime
from utils.log_utils import log_envio


class TestLogUtils:
    """Testes unitários para utilitários de log."""
    
    @patch('utils.log_utils.datetime')
    def test_log_envio_pasta_nova(self, mock_datetime):
        """Testa criação de log quando pasta não existe."""
        mock_datetime.now.return_value.strftime.return_value = "25-06-2025 logs.txt"
        
        with patch('os.path.exists', return_value=False):
            with patch('os.makedirs') as mock_makedirs:
                with patch('builtins.open', mock_open()) as mock_file:
                    log_envio("Mensagem de teste")
                    
                    mock_makedirs.assert_called_once_with("logs de envio")
                    mock_file.assert_called_once_with(
                        os.path.join("logs de envio", "25-06-2025 logs.txt"),
                        "a",
                        encoding="utf-8"
                    )
                    mock_file().write.assert_called_once_with("Mensagem de teste\n")
    
    @patch('utils.log_utils.datetime')
    def test_log_envio_pasta_existente(self, mock_datetime):
        """Testa criação de log quando pasta já existe."""
        mock_datetime.now.return_value.strftime.return_value = "25-06-2025 logs.txt"
        
        with patch('os.path.exists', return_value=True):
            with patch('os.makedirs') as mock_makedirs:
                with patch('builtins.open', mock_open()) as mock_file:
                    log_envio("Outra mensagem")
                    
                    mock_makedirs.assert_not_called()
                    mock_file.assert_called_once_with(
                        os.path.join("logs de envio", "25-06-2025 logs.txt"),
                        "a",
                        encoding="utf-8"
                    )
                    mock_file().write.assert_called_once_with("Outra mensagem\n")
    
    @patch('utils.log_utils.datetime')
    def test_log_envio_multiplas_mensagens(self, mock_datetime):
        """Testa múltiplas chamadas de log no mesmo dia."""
        mock_datetime.now.return_value.strftime.return_value = "25-06-2025 logs.txt"
        
        with patch('os.path.exists', return_value=True):
            with patch('builtins.open', mock_open()) as mock_file:
                log_envio("Primeira mensagem")
                log_envio("Segunda mensagem")
                
                assert mock_file.call_count == 2
                calls = mock_file().write.call_args_list
                assert str(calls[0]) == "call('Primeira mensagem\\n')"
                assert str(calls[1]) == "call('Segunda mensagem\\n')"
    
    @patch('utils.log_utils.datetime')
    def test_log_envio_cria_pasta_quando_necessario(self, mock_datetime):
        """Testa se a pasta é criada quando não existe."""
        mock_datetime.now.return_value.strftime.return_value = "25-06-2025 logs.txt"
        
        # Simula que a pasta não existe na primeira verificação
        with patch('os.path.exists', return_value=False):
            with patch('os.makedirs') as mock_makedirs:
                with patch('builtins.open', mock_open()) as mock_file:
                    log_envio("Teste criação pasta")
                    
                    # Verifica se makedirs foi chamado
                    mock_makedirs.assert_called_once_with("logs de envio")
                    
                    # Verifica se arquivo foi aberto para escrita
                    expected_path = os.path.join("logs de envio", "25-06-2025 logs.txt")
                    mock_file.assert_called_once_with(expected_path, "a", encoding="utf-8")
    
    @patch('utils.log_utils.datetime')
    def test_log_envio_formato_data(self, mock_datetime):
        """Testa se o formato da data está correto."""
        # Configura mock para retornar data específica
        mock_dt = MagicMock()
        mock_dt.strftime.return_value = "01-12-2023 logs.txt"
        mock_datetime.now.return_value = mock_dt
        
        with patch('os.path.exists', return_value=True):
            with patch('builtins.open', mock_open()) as mock_file:
                log_envio("Teste formato")
                
                # Verifica se foi chamado com o formato correto
                expected_path = os.path.join("logs de envio", "01-12-2023 logs.txt")
                mock_file.assert_called_once_with(expected_path, "a", encoding="utf-8")
                mock_dt.strftime.assert_called_once_with("%d-%m-%Y logs.txt")
