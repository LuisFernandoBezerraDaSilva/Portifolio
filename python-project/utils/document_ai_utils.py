from .horario_utils import processar_linha_horarios

def get_entity_by_type(entities, tipo):
    for entity in entities:
        if getattr(entity, "type_", "") == tipo:
            return entity
    return None

def get_entities_by_type(entities, tipo):
    return [entity for entity in entities if getattr(entity, "type_", "") == tipo]

def get_mention_text(entities, tipo):
    entity = get_entity_by_type(entities, tipo)
    return getattr(entity, "mention_text", "") if entity else ""

def get_property(entity, tipo):
    for prop in getattr(entity, "properties", []):
        if getattr(prop, "type_", "") == tipo:
            return getattr(prop, "mention_text", "")
    return ""

def extrair_apontamentos(doc, arquivo, campos_fixos, campos_dia):
    """Extrai os dados do documento processado pelo Document AI com normalização de horários."""
    matricula = get_mention_text(doc.entities, "matricula")
    nome = get_mention_text(doc.entities, "nome")
    periodo = get_mention_text(doc.entities, "periodo")
    dias = get_entities_by_type(doc.entities, "diaApontamento")

    linhas = []
    for dia in dias:
        valores_dia = [get_property(dia, campo) for campo in campos_dia]
        valores = [arquivo, matricula, nome, periodo] + valores_dia
        
        # Aplica normalização de horários automaticamente
        # Os campos de horário geralmente estão nos campos_dia (após os campos fixos)
        indice_inicio_horarios = len(campos_fixos)
        indices_possiveis_horarios = list(range(indice_inicio_horarios, len(valores)))
        
        valores_normalizados = processar_linha_horarios(valores, indices_possiveis_horarios)
        linhas.append(valores_normalizados)
    
    return linhas