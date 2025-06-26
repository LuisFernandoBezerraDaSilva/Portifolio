# Testes do Projeto React/Next.js

Este diretório contém todos os testes unitários e de integração para o projeto React/Next.js.

## Estrutura de Testes

```
src/
  __tests__/
    components/           # Testes de componentes
      baseComponent.test.tsx
      snackbar.test.tsx
    services/            # Testes de serviços
      authService.test.tsx
      baseService.test.tsx
    pages/              # Testes de páginas
      home.test.tsx
    utils/              # Utilitários para testes
      testUtils.tsx
```

## Configuração

### Dependências de Teste

As seguintes dependências foram adicionadas ao projeto:

- `@testing-library/react` - Biblioteca para testar componentes React
- `@testing-library/jest-dom` - Matchers customizados para Jest
- `@testing-library/user-event` - Biblioteca para simular interações do usuário
- `jest` - Framework de testes
- `jest-environment-jsdom` - Ambiente de DOM para Jest
- `@types/jest` - Definições de tipos para Jest

### Instalação

Para instalar as dependências de teste, execute:

```bash
npm install
```

## Executando os Testes

### Comandos Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (reexecuta quando arquivos mudam)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage
```

### Configuração do Jest

O Jest está configurado através do arquivo `jest.config.js` que:

- Usa o ambiente jsdom para simular o DOM
- Configura mocks para módulos do Next.js
- Define thresholds de cobertura (70% mínimo)
- Exclui arquivos desnecessários da cobertura

## Estratégia de Testes

### Componentes

Os testes de componentes focam em:

- Renderização correta
- Comportamento de props
- Interações do usuário
- Estados internos

### Serviços

Os testes de serviços verificam:

- Métodos HTTP corretos
- Headers de autenticação
- Tratamento de erros
- Transformação de dados

### Páginas

Os testes de páginas cobrem:

- Renderização de elementos
- Formulários e validações
- Navegação
- Integração com serviços

## Mocks

### Módulos Globais

Os seguintes módulos são mockados globalmente no `jest.setup.js`:

- `next/navigation` - Funções de roteamento do Next.js
- `firebase` - SDK do Firebase
- `localStorage` - Armazenamento local do browser
- `serviceWorker` - Service Worker APIs

### Utilitários de Teste

O arquivo `testUtils.tsx` fornece:

- Funções helper para renderizar componentes
- Mocks reutilizáveis para serviços
- Dados de teste comuns
- Helpers para async/await

## Boas Práticas

### Estrutura de Teste

```tsx
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
    jest.clearAllMocks()
  })

  it('should do something specific', () => {
    // Arrange
    const props = { ... }
    
    // Act
    render(<Component {...props} />)
    
    // Assert
    expect(screen.getByText('...')).toBeInTheDocument()
  })
})
```

### Nomenclatura

- Use nomes descritivos para testes
- Comece com "should" para descrever o comportamento esperado
- Agrupe testes relacionados com `describe`

### Assertions

- Use matchers específicos do `@testing-library/jest-dom`
- Prefira `getByRole` quando possível
- Use `findBy` para elementos que aparecem assincronamente

## Cobertura de Testes

O projeto está configurado para manter pelo menos 70% de cobertura em:

- Branches (ramificações)
- Functions (funções)
- Lines (linhas)
- Statements (declarações)

Para visualizar o relatório de cobertura:

```bash
npm run test:coverage
```

O relatório será gerado em `coverage/lcov-report/index.html`

## Troubleshooting

### Problemas Comuns

1. **Erro de tipos TypeScript**: Certifique-se de que `@types/jest` está instalado
2. **Mocks não funcionam**: Verifique se os mocks estão no `jest.setup.js`
3. **Testes lentos**: Use `screen.debug()` para investigar renderizações desnecessárias

### Debug

Para debuggar testes:

```tsx
import { screen } from '@testing-library/react'

// Em um teste
render(<Component />)
screen.debug() // Mostra o DOM atual
```

## Contribuindo

Ao adicionar novos componentes ou funcionalidades:

1. Crie testes correspondentes na estrutura apropriada
2. Mantenha a cobertura acima de 70%
3. Use os utilitários existentes em `testUtils.tsx`
4. Siga as convenções de nomenclatura estabelecidas
