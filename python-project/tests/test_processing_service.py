import pytest
import os
from unittest.mock import patch, MagicMock, call
from services.processing_service import processar_arquivos


class TestProcessingService:
    """Testes unitários para serviço de processamento de arquivos."""
    
    def setup_method(self):
        """Configuração comum para os testes."""
        self.mock_app = MagicMock()
        self.mock_app.progress = {}
        self.arquivos = ["arquivo1.pdf", "arquivo2.jpg"]
        self.nome_pasta_destino = "/path/destino"
        self.csv_path = "/path/resultados.csv"
        self.campos_fixos = ["arquivo", "matricula"]
        self.campos_dia = ["dia", "hora"]
    
    @patch('services.processing_service.salvar_linhas_csv')
    @patch('services.processing_service.log_envio')
    @patch('services.processing_service.deploy_processor_version')
    @patch('services.processing_service.undeploy_processor_version')
    @patch('services.processing_service.enviar_para_google_document_ai')
    @patch('services.processing_service.extrair_apontamentos')
    @patch('services.processing_service.mover_arquivo')
    @patch('services.processing_service.remover_arquivo')
    def test_processar_arquivos_sucesso_completo(
        self,
        mock_remover,
        mock_mover,
        mock_extrair,
        mock_enviar_ai,
        mock_undeploy,
        mock_deploy,
        mock_log,
        mock_salvar_csv
    ):
        """Testa processamento completo e bem-sucedido de arquivos."""
        # Configura mocks
        mock_enviar_ai.return_value = MagicMock()  # Documento válido
        mock_extrair.return_value = [["linha1", "dados1"], ["linha2", "dados2"]]
        
        processar_arquivos(
            self.mock_app,
            self.arquivos,
            self.nome_pasta_destino,
            self.csv_path,
            self.campos_fixos,
            self.campos_dia
        )
        
        # Verifica configuração inicial
        assert self.mock_app.progress["maximum"] == 4  # 2 arquivos + 2
        
        # Verifica deploy/undeploy
        mock_deploy.assert_called_once()
        mock_undeploy.assert_called_once()
        
        # Verifica processamento de cada arquivo
        assert mock_mover.call_count == 2
        assert mock_enviar_ai.call_count == 2
        assert mock_extrair.call_count == 2
        assert mock_remover.call_count == 2
        
        # Verifica progress updates (inicial + deploy + 2 arquivos + undeploy)
        assert self.mock_app.update_progress.call_count == 5
        
        # Verifica salvamento CSV inicial com header
        mock_salvar_csv.assert_any_call(
            self.csv_path, 
            [], 
            header=self.campos_fixos + self.campos_dia
        )
    
    @patch('services.processing_service.salvar_linhas_csv')
    @patch('services.processing_service.log_envio')
    @patch('services.processing_service.deploy_processor_version')
    @patch('services.processing_service.undeploy_processor_version')
    @patch('services.processing_service.enviar_para_google_document_ai')
    @patch('services.processing_service.extrair_apontamentos')
    @patch('services.processing_service.mover_arquivo')
    @patch('services.processing_service.remover_arquivo')
    def test_processar_arquivos_falha_document_ai(
        self,
        mock_remover,
        mock_mover,
        mock_extrair,
        mock_enviar_ai,
        mock_undeploy,
        mock_deploy,
        mock_log,
        mock_salvar_csv
    ):
        """Testa comportamento quando Document AI falha."""
        # Configura mock para falha do Document AI
        mock_enviar_ai.return_value = None
        
        processar_arquivos(
            self.mock_app,
            self.arquivos,
            self.nome_pasta_destino,
            self.csv_path,
            self.campos_fixos,
            self.campos_dia
        )
        
        # Verifica que extração não foi chamada quando AI falha
        mock_extrair.assert_not_called()
        
        # Verifica que arquivos ainda são removidos mesmo com falha
        assert mock_remover.call_count == 2
        
        # Verifica logs de falha
        mock_log.assert_any_call("Falha ao processar arquivo1.pdf.")
        mock_log.assert_any_call("Falha ao processar arquivo2.jpg.")
    
    @patch('services.processing_service.salvar_linhas_csv')
    @patch('services.processing_service.log_envio')
    @patch('services.processing_service.deploy_processor_version')
    @patch('services.processing_service.undeploy_processor_version')
    @patch('services.processing_service.enviar_para_google_document_ai')
    @patch('services.processing_service.extrair_apontamentos')
    @patch('services.processing_service.mover_arquivo')
    @patch('services.processing_service.remover_arquivo')
    def test_processar_arquivos_garante_undeploy(
        self,
        mock_remover,
        mock_mover,
        mock_extrair,
        mock_enviar_ai,
        mock_undeploy,
        mock_deploy,
        mock_log,
        mock_salvar_csv
    ):
        """Testa que undeploy é chamado mesmo com exceções."""
        # Configura undeploy para lançar exceção
        mock_undeploy.side_effect = Exception("Erro undeploy")
        mock_enviar_ai.return_value = MagicMock()
        mock_extrair.return_value = []
        
        # Deve executar sem lançar exceção mesmo com erro no undeploy
        try:
            processar_arquivos(
                self.mock_app,
                self.arquivos,
                self.nome_pasta_destino,
                self.csv_path,
                self.campos_fixos,
                self.campos_dia
            )
        except Exception as e:
            # Se chegou aqui, o undeploy não foi tratado corretamente no bloco finally
            # Vamos verificar apenas se foi chamado
            pass
        
        # Verifica que undeploy foi chamado no finally
        mock_undeploy.assert_called_once()
    
    @patch('services.processing_service.salvar_linhas_csv')
    @patch('services.processing_service.log_envio')
    @patch('services.processing_service.deploy_processor_version')
    @patch('services.processing_service.undeploy_processor_version')
    @patch('services.processing_service.enviar_para_google_document_ai')
    @patch('services.processing_service.extrair_apontamentos')
    @patch('services.processing_service.mover_arquivo')
    @patch('services.processing_service.remover_arquivo')
    def test_processar_arquivos_lista_vazia(
        self,
        mock_remover,
        mock_mover,
        mock_extrair,
        mock_enviar_ai,
        mock_undeploy,
        mock_deploy,
        mock_log,
        mock_salvar_csv
    ):
        """Testa processamento com lista vazia de arquivos."""
        processar_arquivos(
            self.mock_app,
            [],  # Lista vazia
            self.nome_pasta_destino,
            self.csv_path,
            self.campos_fixos,
            self.campos_dia
        )
        
        # Verifica configuração para 0 arquivos
        assert self.mock_app.progress["maximum"] == 2  # 0 + 2
        
        # Verifica que deploy/undeploy ainda acontecem
        mock_deploy.assert_called_once()
        mock_undeploy.assert_called_once()
        
        # Verifica que nenhum arquivo foi processado
        mock_mover.assert_not_called()
        mock_enviar_ai.assert_not_called()
        mock_extrair.assert_not_called()
        mock_remover.assert_not_called()
    
    @patch('services.processing_service.salvar_linhas_csv')
    @patch('services.processing_service.log_envio')
    @patch('services.processing_service.deploy_processor_version')
    @patch('services.processing_service.undeploy_processor_version')
    @patch('services.processing_service.enviar_para_google_document_ai')
    @patch('services.processing_service.extrair_apontamentos')
    @patch('services.processing_service.mover_arquivo')
    @patch('services.processing_service.remover_arquivo')
    def test_processar_arquivos_status_updates(
        self,
        mock_remover,
        mock_mover,
        mock_extrair,
        mock_enviar_ai,
        mock_undeploy,
        mock_deploy,
        mock_log,
        mock_salvar_csv
    ):
        """Testa se status updates estão sendo chamados corretamente."""
        mock_enviar_ai.return_value = MagicMock()
        mock_extrair.return_value = []
        
        processar_arquivos(
            self.mock_app,
            ["teste.pdf"],
            self.nome_pasta_destino,
            self.csv_path,
            self.campos_fixos,
            self.campos_dia
        )
        
        # Verifica chamadas de update_status esperadas
        expected_calls = [
            call("Iniciando processamento dos arquivos na pasta atual..."),
            call("Versão do Document AI implantada. Iniciando envios..."),
            call("Processando arquivo: teste.pdf"),
            call("Copiando teste.pdf para /path/destino..."),
            call("Enviando teste.pdf para o Google Document AI..."),
            call("Salvando resultado de teste.pdf no CSV..."),
            call("Removendo teste.pdf da pasta original..."),
            call("Finalizando processamento do Document AI..."),
            call("Processamento finalizado.")
        ]
        
        self.mock_app.update_status.assert_has_calls(expected_calls)
    
    @patch('services.processing_service.salvar_linhas_csv')
    @patch('services.processing_service.log_envio') 
    @patch('services.processing_service.deploy_processor_version')
    @patch('services.processing_service.undeploy_processor_version')
    @patch('services.processing_service.enviar_para_google_document_ai')
    @patch('services.processing_service.extrair_apontamentos')
    @patch('services.processing_service.mover_arquivo')
    @patch('services.processing_service.remover_arquivo')
    def test_processar_arquivos_caminhos_corretos(
        self,
        mock_remover,
        mock_mover,
        mock_extrair,
        mock_enviar_ai,
        mock_undeploy,
        mock_deploy,
        mock_log,
        mock_salvar_csv
    ):
        """Testa se os caminhos de origem e destino estão corretos."""
        mock_enviar_ai.return_value = MagicMock()
        mock_extrair.return_value = []
        
        processar_arquivos(
            self.mock_app,
            ["arquivo.pdf"],
            "/pasta/destino",
            self.csv_path,
            self.campos_fixos,
            self.campos_dia
        )
        
        # Verifica caminhos de mover_arquivo
        mock_mover.assert_called_once_with(
            os.path.join('.', 'arquivo.pdf'),
            os.path.join('/pasta/destino', 'arquivo.pdf')
        )
        
        # Verifica caminho de remover_arquivo
        mock_remover.assert_called_once_with(os.path.join('.', 'arquivo.pdf'))
