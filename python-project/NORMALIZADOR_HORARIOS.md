# 🕐 Normalizador de Horários

Pós-processador que converte diferentes formatos de horário para o padrão HH:MM.

## 🎯 Funcionalidades

### ✅ Formatos Suportados

| Entrada    | Saída   | Descrição                |
|------------|---------|--------------------------|
| `8 00`     | `08:00` | Espaço entre hora/minuto |
| `8`        | `08:00` | Apenas hora (1 dígito)   |
| `800`      | `08:00` | Formato HHMM             |
| `1230`     | `12:30` | Formato HHMM             |
| `8:00`     | `08:00` | Formato padrão           |
| `8.00`     | `08:00` | Ponto como separador     |
| `8h 00`    | `08:00` | Formato com 'h'          |
| `8h 00m`   | `08:00` | Formato com 'h' e 'm'    |
| `8-00`     | `08:00` | Hífen como separador     |

### 🛡️ Proteções

- **Horários inválidos** são mantidos inalterados
- **Horas > 23** (ex: `25:00`, `2500`) → mantém original
- **Minutos > 59** (ex: `8:75`, `1260`) → mantém original  
- **Números ambíguos** (ex: `15`, `20`, `12`) → mantém original
- **Formatos não reconhecidos** (ex: `8:ss`) → mantém original

## 🔧 Como Usar

### Automático (Recomendado)
O normalizador já está integrado no processamento do Document AI e funciona automaticamente.

### Manual
```python
from utils.horario_utils import normalizar_horario

# Normalizar horário individual
horario = normalizar_horario("8 00")  # → "08:00"
horario = normalizar_horario("25:00") # → "25:00" (inválido, mantido)

# Processar linha CSV completa
from utils.horario_utils import processar_linha_horarios

linha = ["arquivo.pdf", "123", "João", "8 00", "12.30", "texto"]
linha_processada = processar_linha_horarios(linha)
# → ["arquivo.pdf", "123", "João", "08:00", "12:30", "texto"]
```

## 🧪 Testes

```bash
python -m pytest tests/test_horario_utils.py -v
```

### Casos de Teste Cobertos:
- ✅ 15 cenários diferentes
- ✅ Formatos válidos e inválidos
- ✅ Casos extremos (00:00, 23:59)
- ✅ Detecção automática de campos
- ✅ Entradas vazias e inválidas

## 🔄 Integração

O normalizador está integrado automaticamente em:
- **`document_ai_utils.py`** - Processa dados do Document AI
- **`extrair_apontamentos()`** - Normaliza horários automaticamente

## 📝 Exemplos Reais

### Antes (Document AI):
```csv
arquivo,matricula,nome,entrada,saida,entrada2,saida2
folha.pdf,123,João,8 00,1230,13h00,17-45
folha.pdf,456,Maria,800,18h 30,15,2500
```

### Depois (Normalizado):
```csv
arquivo,matricula,nome,entrada,saida,entrada2,saida2
folha.pdf,123,João,08:00,12:30,13:00,17:45
folha.pdf,456,Maria,08:00,18:30,15,2500
```

> **Notas:** 
> - `15` foi mantido (número ambíguo de 2 dígitos)
> - `2500` foi mantido como inválido (hora > 23)
