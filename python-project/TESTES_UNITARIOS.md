# Configuração de Testes Unitários
# ================================

Este projeto foi configurado para executar APENAS testes unitários.

## Características dos Testes Unitários:

✅ **Isolados**: Cada teste é independente
✅ **Rápidos**: Execução em segundos
✅ **Mockados**: Todas as dependências externas são simuladas
✅ **Determinísticos**: Resultados sempre consistentes
✅ **Sem custos**: Não fazem chamadas reais para APIs pagas

## Execução:

```bash
# Método recomendado
python test_runner_simples.py

# Método alternativo
python run_tests.py

# Pytest direto
python -m pytest tests/ -v -m unit
```

## Cobertura:

- ✅ Todas as funções utilitárias (utils/)
- ✅ Todos os serviços (services/) 
- ✅ Arquivo principal (leitorPonto.py)
- ✅ Fluxos de erro e exceções
- ✅ Validações e edge cases

## Testes Excluídos:

- ❌ Testes de integração com Google Document AI
- ❌ Testes que fazem chamadas HTTP reais
- ❌ Testes que requerem arquivos específicos
- ❌ Testes end-to-end que custam dinheiro
