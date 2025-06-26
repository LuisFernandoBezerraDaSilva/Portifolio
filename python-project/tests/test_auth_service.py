import pytest
import sys
import hashlib
from unittest.mock import patch, MagicMock
from services.auth_service import validar_autenticacao


class TestAuthService:
    """Testes unitários para serviço de autenticação."""
    
    @patch('services.auth_service.solicitar_senha')
    @patch('services.auth_service.PASSWORD_HASH', 'hash_correto')
    def test_validar_autenticacao_senha_correta(self, mock_solicitar_senha):
        """Testa autenticação com senha correta."""
        # Configura mock para retornar senha que gera hash correto
        mock_solicitar_senha.return_value = "senha_teste"
        
        # Mock do hash da senha
        with patch('hashlib.sha256') as mock_sha256:
            mock_hash = MagicMock()
            mock_hash.hexdigest.return_value = "hash_correto"
            mock_sha256.return_value = mock_hash
            
            resultado = validar_autenticacao()
            
            assert resultado is True
            mock_solicitar_senha.assert_called_once()
            mock_sha256.assert_called_once_with("senha_teste".encode())
    
    @patch('services.auth_service.solicitar_senha')
    @patch('services.auth_service.PASSWORD_HASH', 'hash_correto')
    @patch('sys.exit')
    def test_validar_autenticacao_senha_incorreta(self, mock_exit, mock_solicitar_senha):
        """Testa autenticação com senha incorreta."""
        mock_solicitar_senha.return_value = "senha_errada"
        
        with patch('hashlib.sha256') as mock_sha256:
            mock_hash = MagicMock()
            mock_hash.hexdigest.return_value = "hash_errado"
            mock_sha256.return_value = mock_hash
            
            with patch('tkinter.Tk') as mock_tk:
                with patch('tkinter.messagebox.showerror') as mock_error:
                    validar_autenticacao()
                    
                    mock_exit.assert_called_once_with(1)
                    mock_error.assert_called_once_with(
                        "Acesso negado", 
                        "Senha incorreta, favor chamar o administrador"
                    )
    
    @patch('services.auth_service.solicitar_senha')
    @patch('services.auth_service.PASSWORD_HASH', 'hash_correto')
    @patch('sys.exit')
    def test_validar_autenticacao_senha_vazia(self, mock_exit, mock_solicitar_senha):
        """Testa autenticação com senha vazia."""
        mock_solicitar_senha.return_value = ""
        
        with patch('tkinter.Tk') as mock_tk:
            with patch('tkinter.messagebox.showerror') as mock_error:
                validar_autenticacao()
                
                mock_exit.assert_called_once_with(1)
                mock_error.assert_called_once()
    
    @patch('services.auth_service.solicitar_senha')
    @patch('services.auth_service.PASSWORD_HASH', 'hash_correto')
    @patch('sys.exit')
    def test_validar_autenticacao_senha_none(self, mock_exit, mock_solicitar_senha):
        """Testa autenticação quando solicitar_senha retorna None."""
        mock_solicitar_senha.return_value = None
        
        with patch('tkinter.Tk') as mock_tk:
            with patch('tkinter.messagebox.showerror') as mock_error:
                validar_autenticacao()
                
                mock_exit.assert_called_once_with(1)
                mock_error.assert_called_once()
    
    @patch('services.auth_service.solicitar_senha')
    def test_validar_autenticacao_hash_encoding(self, mock_solicitar_senha):
        """Testa se o encoding da senha está correto."""
        mock_solicitar_senha.return_value = "teste123"
        senha_hash = hashlib.sha256("teste123".encode()).hexdigest()
        
        with patch('services.auth_service.PASSWORD_HASH', senha_hash):
            resultado = validar_autenticacao()
            assert resultado is True
    
    @patch('services.auth_service.solicitar_senha')
    @patch('services.auth_service.PASSWORD_HASH', 'hash_correto')
    def test_validar_autenticacao_tkinter_withdraw(self, mock_solicitar_senha):
        """Testa se Tkinter window é ocultada em caso de erro."""
        mock_solicitar_senha.return_value = "senha_errada"
        
        with patch('hashlib.sha256') as mock_sha256:
            mock_hash = MagicMock()
            mock_hash.hexdigest.return_value = "hash_errado"
            mock_sha256.return_value = mock_hash
            
            with patch('tkinter.Tk') as mock_tk_class:
                mock_tk_instance = MagicMock()
                mock_tk_class.return_value = mock_tk_instance
                
                with patch('tkinter.messagebox.showerror'):
                    with patch('sys.exit'):
                        validar_autenticacao()
                        
                        mock_tk_instance.withdraw.assert_called_once()
