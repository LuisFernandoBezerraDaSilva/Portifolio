import pytest
from utils.horario_utils import normalizar_horario, processar_linha_horarios, _parece_horario


class TestHorarioUtils:
    """Testes unitários para utilitários de normalização de horários."""
    
    def test_normalizar_horario_formato_padrao(self):
        """Testa normalização de horários já no formato padrão."""
        assert normalizar_horario("08:00") == "08:00"
        assert normalizar_horario("23:59") == "23:59"
        assert normalizar_horario("00:00") == "00:00"
    
    def test_normalizar_horario_apenas_hora_com_h(self):
        """Testa normalização de apenas hora com 'h' (assume :00)."""
        assert normalizar_horario("8h") == "08:00"
        assert normalizar_horario("0h") == "00:00"
        assert normalizar_horario("23h") == "23:00"
        assert normalizar_horario("12h") == "12:00"
        
        # Hora inválida com 'h'
        assert normalizar_horario("24h") == "24h"  # > 23
        assert normalizar_horario("25h") == "25h"  # > 23
    
    def test_normalizar_horario_espaco(self):
        """Testa normalização de horários com espaço."""
        assert normalizar_horario("8 00") == "08:00"
        assert normalizar_horario("23 59") == "23:59"
        assert normalizar_horario("0 0") == "00:00"
    
    def test_normalizar_horario_ponto(self):
        """Testa normalização de horários com ponto."""
        assert normalizar_horario("8.00") == "08:00"
        assert normalizar_horario("23.59") == "23:59"
        assert normalizar_horario("12.30") == "12:30"
    
    def test_normalizar_horario_hifen(self):
        """Testa normalização de horários com hífen."""
        assert normalizar_horario("8-00") == "08:00"
        assert normalizar_horario("23-59") == "23:59"
        assert normalizar_horario("12-30") == "12:30"
    
    def test_normalizar_horario_com_h(self):
        """Testa normalização de horários com 'h'."""
        assert normalizar_horario("8h00") == "08:00"
        assert normalizar_horario("8h 00") == "08:00"
        assert normalizar_horario("23h59") == "23:59"
        assert normalizar_horario("12h30") == "12:30"
    
    def test_normalizar_horario_com_h_m(self):
        """Testa normalização de horários com 'h' e 'm'."""
        assert normalizar_horario("8h00m") == "08:00"
        assert normalizar_horario("8h 00m") == "08:00"
        assert normalizar_horario("23h59m") == "23:59"
        assert normalizar_horario("12h30m") == "12:30"
    
    def test_normalizar_horario_invalido_hora(self):
        """Testa que horários com hora inválida são mantidos."""
        assert normalizar_horario("25:00") == "25:00"  # Hora > 23
        assert normalizar_horario("32:15") == "32:15"  # Hora > 23
        assert normalizar_horario("24:00") == "24:00"  # Hora > 23
    
    def test_normalizar_horario_invalido_minuto(self):
        """Testa que horários com minuto inválido são mantidos."""
        assert normalizar_horario("8:60") == "8:60"    # Minuto > 59
        assert normalizar_horario("12:75") == "12:75"  # Minuto > 59
        assert normalizar_horario("8:ss") == "8:ss"    # Minuto não numérico
    
    def test_normalizar_horario_formato_estranho(self):
        """Testa que formatos não reconhecidos são mantidos."""
        assert normalizar_horario("abc") == "abc"
        assert normalizar_horario("8::00") == "8::00"
        assert normalizar_horario("h00") == "h00"
        assert normalizar_horario("8hh") == "8hh"
    
    def test_normalizar_horario_entrada_vazia(self):
        """Testa comportamento com entradas vazias ou inválidas."""
        assert normalizar_horario("") == ""
        assert normalizar_horario("   ") == "   "
        assert normalizar_horario(None) == None
        assert normalizar_horario(123) == 123
    
    def test_processar_linha_horarios(self):
        """Testa processamento de linha completa."""
        linha = ["arquivo.pdf", "123", "João", "8 00", "12.30", "13h00", "17:30"]
        indices_horarios = [3, 4, 5, 6]
        
        resultado = processar_linha_horarios(linha, indices_horarios)
        esperado = ["arquivo.pdf", "123", "João", "08:00", "12:30", "13:00", "17:30"]
        
        assert resultado == esperado
    
    def test_processar_linha_horarios_deteccao_automatica(self):
        """Testa detecção automática de campos de horário."""
        linha = ["arquivo.pdf", "800", "8h", "12.30", "15", "texto"]
        
        resultado = processar_linha_horarios(linha)
        esperado = ["arquivo.pdf", "08:00", "08:00", "12:30", "15", "texto"]
        
        assert resultado == esperado
    
    def test_parece_horario(self):
        """Testa detecção de campos que parecem horário."""
        # Formatos que parecem horário
        assert _parece_horario("8:00") == True
        assert _parece_horario("8 00") == True
        assert _parece_horario("8.00") == True
        assert _parece_horario("8h00") == True
        assert _parece_horario("8h") == True     # Hora com 'h'
        assert _parece_horario("800") == True    # 3 dígitos (HHMM)
        assert _parece_horario("1230") == True   # 4 dígitos (HHMM)
        
        # Formatos que NÃO parecem horário
        assert _parece_horario("texto") == False
        assert _parece_horario("123456") == False  # > 4 dígitos
        assert _parece_horario("") == False
        assert _parece_horario("abc:def") == False
        assert _parece_horario("8") == False      # Número isolado
        assert _parece_horario("15") == False     # Número isolado
        assert _parece_horario("12") == False     # Número isolado
        assert _parece_horario("99") == False     # Número isolado
    
    def test_normalizar_horario_casos_extremos(self):
        """Testa casos extremos de normalização."""
        # Horários válidos nos extremos
        assert normalizar_horario("0:0") == "00:00"
        assert normalizar_horario("23:59") == "23:59"
        
        # Com zeros à esquerda
        assert normalizar_horario("08:09") == "08:09"
        assert normalizar_horario("8:09") == "08:09"
        assert normalizar_horario("08:9") == "08:09"
    
    def test_normalizar_horario_formato_hhmm(self):
        """Testa normalização de horários no formato HHMM (800, 1230)."""
        assert normalizar_horario("800") == "08:00"
        assert normalizar_horario("1230") == "12:30"
        assert normalizar_horario("2359") == "23:59"
        assert normalizar_horario("0000") == "00:00"
        assert normalizar_horario("700") == "07:00"
    
    def test_normalizar_horario_numeros_ambiguos_ignorados(self):
        """Testa que números isolados (8, 15, 20, 12) são mantidos."""
        # Todos os números isolados devem ser mantidos (ambíguos)
        assert normalizar_horario("8") == "8"    # Mantido (pode ser 8 de algo)
        assert normalizar_horario("15") == "15"  # Mantido (pode ser 15 de algo)
        assert normalizar_horario("20") == "20"  # Mantido (pode ser 20 de algo)
        assert normalizar_horario("12") == "12"  # Mantido (pode ser 12 de algo)
        assert normalizar_horario("30") == "30"  # Mantido (> 23, inválido como hora)
        assert normalizar_horario("99") == "99"  # Mantido (> 23, inválido como hora)
    
    def test_normalizar_horario_apenas_hora_valida(self):
        """Testa que apenas horas com 'h' são aceitas para formato simples."""
        # Apenas com 'h' são aceitos
        assert normalizar_horario("8h") == "08:00"
        assert normalizar_horario("23h") == "23:00"
        
        # Números isolados são mantidos
        assert normalizar_horario("8") == "8"
        assert normalizar_horario("23") == "23"
    
    def test_normalizar_horario_hhmm_invalido(self):
        """Testa horários HHMM inválidos."""
        assert normalizar_horario("2500") == "2500"  # Hora > 23
        assert normalizar_horario("1260") == "1260"  # Minuto > 59
        assert normalizar_horario("2400") == "2400"  # Hora > 23
