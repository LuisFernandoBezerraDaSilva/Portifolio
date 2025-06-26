import re

def normalizar_horario(horario_str):
    """
    Normaliza diferentes formatos de horário para o padrão HH:MM.
    
    Formatos aceitos:
    - 8 00 -> 08:00
    - 8h -> 08:00 (apenas hora com 'h')
    - 800 -> 08:00 (formato HHMM)
    - 1230 -> 12:30 (formato HHMM)
    - 8:00 -> 08:00
    - 8.00 -> 08:00
    - 8h 00 -> 08:00
    - 8h 00m -> 08:00
    - 8-00 -> 08:00
    
    Números isolados (8, 15, 20, 12) são mantidos inalterados para evitar ambiguidade.
    
    Args:
        horario_str (str): String com horário em qualquer formato
        
    Returns:
        str: Horário normalizado no formato HH:MM ou string original se inválido
    """
    if not horario_str or not isinstance(horario_str, str):
        return horario_str
    
    # Remove espaços extras
    horario_limpo = horario_str.strip()
    
    if not horario_limpo:
        return horario_str
    
    # Padrões para diferentes formatos de horário
    padroes = [
        # 8:00, 08:00, 23:59
        r'^(\d{1,2}):(\d{1,2})$',
        
        # 8.00, 08.00, 23.59
        r'^(\d{1,2})\.(\d{1,2})$',
        
        # 8-00, 08-00, 23-59
        r'^(\d{1,2})-(\d{1,2})$',
        
        # 8 00, 08 00, 23 59 (com espaços)
        r'^(\d{1,2})\s+(\d{1,2})$',
        
        # 8h00, 8h 00, 8h00m, 8h 00m
        r'^(\d{1,2})h\s*(\d{1,2})m?$',
        
        # 800, 1230 (formato HHMM - 3 ou 4 dígitos)
        r'^(\d{3,4})$',
        
        # 8h (apenas hora com 'h', assume :00)
        r'^(\d{1,2})h$'
    ]
    
    for padrao in padroes:
        match = re.match(padrao, horario_limpo)
        if match:
            if len(match.groups()) == 1:
                valor = match.group(1)
                
                # Formato HHMM (800, 1230, etc.)
                if len(valor) >= 3:
                    if len(valor) == 3:
                        # 800 -> 8:00
                        hora = int(valor[0])
                        minuto = int(valor[1:3])
                    else:  # len(valor) == 4
                        # 1230 -> 12:30
                        hora = int(valor[0:2])
                        minuto = int(valor[2:4])
                else:
                    # Apenas hora com 'h' (ex: "8h")
                    numero = int(valor)
                    if 0 <= numero <= 23:
                        hora = numero
                        minuto = 0
                    else:
                        return horario_str  # Hora inválida
            else:
                # Hora e minuto separados
                hora = int(match.group(1))
                minuto = int(match.group(2))
            
            # Validação de horário válido
            if 0 <= hora <= 23 and 0 <= minuto <= 59:
                return f"{hora:02d}:{minuto:02d}"
            else:
                # Horário inválido, retorna original
                return horario_str
    
    # Nenhum padrão correspondeu, retorna original
    return horario_str


def processar_linha_horarios(linha, indices_horarios=None):
    """
    Processa uma linha do CSV normalizando os campos de horário.
    
    Args:
        linha (list): Lista com valores da linha
        indices_horarios (list): Lista de índices que contêm horários
                                Se None, tenta detectar automaticamente
    
    Returns:
        list: Linha com horários normalizados
    """
    if not linha:
        return linha
    
    linha_processada = linha.copy()
    
    # Se não especificado, tenta detectar campos de horário automaticamente
    if indices_horarios is None:
        indices_horarios = []
        for i, valor in enumerate(linha):
            if isinstance(valor, str) and _parece_horario(valor):
                indices_horarios.append(i)
    
    # Normaliza os campos identificados como horários
    for indice in indices_horarios:
        if indice < len(linha_processada):
            valor_original = linha_processada[indice]
            valor_normalizado = normalizar_horario(valor_original)
            linha_processada[indice] = valor_normalizado
    
    return linha_processada


def _parece_horario(texto):
    """
    Detecta se um texto parece ser um horário.
    
    Args:
        texto (str): Texto para verificar
        
    Returns:
        bool: True se parece ser horário
    """
    if not isinstance(texto, str):
        return False
    
    texto_limpo = texto.strip()
    
    # Padrões que indicam horário
    padroes_horario = [
        r'^\d{1,2}:\d{1,2}$',      # 8:00
        r'^\d{1,2}\.\d{1,2}$',     # 8.00  
        r'^\d{1,2}-\d{1,2}$',      # 8-00
        r'^\d{1,2}\s+\d{1,2}$',    # 8 00
        r'^\d{1,2}h\s*\d{1,2}m?$', # 8h00, 8h 00m
        r'^\d{3,4}$',              # 800, 1230 (formato HHMM)
        r'^\d{1,2}h$'              # 8h (apenas hora com 'h')
    ]
    
    for padrao in padroes_horario:
        if re.match(padrao, texto_limpo):
            return True
    
    return False