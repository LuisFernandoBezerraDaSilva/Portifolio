# NgRx Implementation Documentation

## Overview
This project implements NgRx for state management in the Angular frontend, providing a centralized, predictable state management solution that follows the Redux pattern.

## Architecture

### Store Structure
```
app.state.ts - Root state interface
├── auth/
│   ├── auth.actions.ts - Authentication actions (login, logout, register)
│   ├── auth.reducer.ts - Authentication state reducer
│   ├── auth.effects.ts - Side effects for auth operations
│   └── auth.selectors.ts - Selectors for auth state
└── task/
    ├── task.actions.ts - Task CRUD actions
    ├── task.reducer.ts - Task state reducer with entity adapter
    ├── task.effects.ts - Side effects for task operations
    ├── task.selectors.ts - Selectors for task state
    └── task.state.ts - Task state interface
```

### Key Features Implemented

#### 1. Authentication State Management
- **Actions**: `login`, `loginSuccess`, `loginFailure`, `logout`, `register`
- **State**: User info, token, authentication status, loading, errors
- **Effects**: Handle login/register API calls, token storage, navigation

#### 2. Task State Management
- **Actions**: `loadTasks`, `createTask`, `updateTask`, `deleteTask`, `selectTask`
- **State**: Task entities, pagination, loading states, errors
- **Effects**: Handle all CRUD operations with backend API
- **Entity Adapter**: Optimized entity management for task collection

#### 3. Component Integration
**LoginPageComponent**:
- Dispatches login actions instead of calling service directly
- Subscribes to auth state (loading, error, authenticated)
- Automatic navigation on successful authentication

**TaskPageComponent**:
- Dispatches task actions for all CRUD operations
- Subscribes to task state (tasks, loading, error)
- Real-time updates through store subscription

### Benefits Achieved
1. **Centralized State**: All application state is managed in one place
2. **Predictable Updates**: State changes only through dispatched actions
3. **Time Travel Debugging**: Redux DevTools integration for debugging
4. **Better Testing**: Isolated action/reducer testing with MockStore
5. **Side Effect Management**: Centralized API calls and business logic in effects
6. **Performance**: OnPush change detection compatibility
7. **Type Safety**: Full TypeScript support throughout the store

### Dependencies Added
- `@ngrx/store` - Core store functionality
- `@ngrx/effects` - Side effect management
- `@ngrx/entity` - Entity state management utilities
- `@ngrx/store-devtools` - Development tools integration

### Development Tools
The implementation includes Redux DevTools support for:
- Action inspection
- State time-travel debugging
- Performance monitoring
- Action replay

This NgRx implementation demonstrates modern Angular state management practices and provides a scalable foundation for complex application state requirements.

## Conceitos Fundamentais

### O que é "State" (Estado)?

O **state** é um objeto JavaScript que contém todos os dados da aplicação em um determinado momento. É como uma "fotografia" de toda a informação que sua aplicação precisa para funcionar.

#### Exemplo de State da Aplicação:
```typescript
// Estado completo da aplicação
{
  auth: {
    user: { id: 1, name: "João", email: "joao@email.com" },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    isLoading: false,
    error: null,
    authenticated: true
  },
  task: {
    tasks: [
      { id: 1, title: "Estudar NgRx", completed: false },
      { id: 2, title: "Fazer exercícios", completed: true }
    ],
    selectedTask: null,
    total: 2,
    page: 1,
    isLoading: false,
    error: null
  }
}
```

### Diferença entre `isLoading` e `isLoading$`

#### 1. `isLoading` (sem $)
```typescript
// Valor direto/primitivo
let isLoading: boolean = false;

// Uso direto no template
<div *ngIf="isLoading">Carregando...</div>

// Problema: Não é reativo!
// Se o valor mudar, o componente não será notificado automaticamente
```

#### 2. `isLoading$` (com $)
```typescript
// Observable - fluxo de dados reativo
isLoading$: Observable<boolean> = this.store.select(selectAuthLoading);

// Uso no template com async pipe
<div *ngIf="isLoading$ | async">Carregando...</div>

// Vantagem: Completamente reativo!
// Quando o estado muda, o componente é automaticamente atualizado
```

### Convenção do $ (Dollar Sign)

A convenção do `$` no final do nome indica que a variável é um **Observable**:

```typescript
// ❌ Sem $: Valores estáticos
user: User = { name: 'João' };
isLoading: boolean = false;
tasks: Task[] = [];

// ✅ Com $: Observables (fluxos reativos)
user$: Observable<User> = this.store.select(selectCurrentUser);
isLoading$: Observable<boolean> = this.store.select(selectAuthLoading);
tasks$: Observable<Task[]> = this.store.select(selectAllTasks);
```

### Exemplo Prático Completo

#### No Componente:
```typescript
export class TaskPageComponent {
  // Observables do state (com $)
  tasks$ = this.store.select(selectAllTasks);
  isLoading$ = this.store.select(selectTasksLoading);
  error$ = this.store.select(selectTasksError);

  constructor(private store: Store) {}

  loadTasks() {
    // Dispara ação para carregar tasks
    this.store.dispatch(TaskActions.loadTasks());
  }
}
```

#### No Template:
```html
<!-- Loading reativo -->
<div *ngIf="isLoading$ | async" class="loading">
  Carregando tarefas...
</div>

<!-- Error reativo -->
<div *ngIf="error$ | async as error" class="error">
  Erro: {{ error }}
</div>

<!-- Lista reativa -->
<div *ngFor="let task of tasks$ | async">
  {{ task.title }}
</div>
```

### Fluxo de Dados Reativo

```
1. Usuário clica em "Carregar Tasks"
   ↓
2. Componente dispara: store.dispatch(loadTasks())
   ↓
3. Effect intercepta a ação e chama API
   ↓
4. API retorna dados
   ↓
5. Effect dispara: loadTasksSuccess(data)
   ↓
6. Reducer atualiza o state
   ↓
7. Observables automaticamente emitem novos valores
   ↓
8. Template é atualizado automaticamente (async pipe)
```

### Vantagens dos Observables ($)

1. **Reatividade Automática**: UI se atualiza quando state muda
2. **Gerenciamento de Subscription**: `async pipe` gerencia automaticamente
3. **Performance**: OnPush change detection funciona perfeitamente
4. **Composição**: Pode combinar múltiplos observables
5. **Error Handling**: Tratamento de erros integrado

### Resumo das Diferenças

| Aspecto | `isLoading` | `isLoading$` |
|---------|-------------|--------------|
| **Tipo** | `boolean` | `Observable<boolean>` |
| **Reatividade** | ❌ Manual | ✅ Automática |
| **Template** | `*ngIf="isLoading"` | `*ngIf="isLoading$ \| async"` |
| **Subscription** | ❌ N/A | ✅ Automática (async pipe) |
| **Performance** | ❌ Menor | ✅ Otimizada |
| **NgRx Integration** | ❌ Não recomendado | ✅ Padrão recomendado |

## Exemplo Prático do Nosso Projeto

### No TaskPageComponent (Atual)

#### Definição dos Observables:
```typescript
export class TaskPageComponent extends BasePageComponent implements OnInit {
  // ✅ Observables com $ - conectados ao NgRx store
  tasks$: Observable<Task[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store<AppState>) {
    super();
    // Conectando aos selectors do store
    this.tasks$ = this.store.select(TaskSelectors.selectTasks);
    this.isLoading$ = this.store.select(TaskSelectors.selectTasksLoading);
    this.error$ = this.store.select(TaskSelectors.selectTasksError);
  }

  ngOnInit(): void {
    // Disparando ação para carregar tasks
    this.store.dispatch(TaskActions.loadTasks());
    
    // Reagindo às mudanças do state
    this.tasks$.subscribe(tasks => {
      this.dataSource.data = tasks; // Atualiza tabela automaticamente
    });
  }
}
```

#### No Template HTML:
```html
<!-- ✅ Loading reativo - mostra/esconde automaticamente -->
<app-loading *ngIf="isLoading$ | async"></app-loading>

<!-- ✅ Conteúdo só aparece quando NÃO está carregando -->
<ng-container *ngIf="!(isLoading$ | async)">
  <mat-card-title>Task List</mat-card-title>
  
  <!-- ✅ Tabela atualizada automaticamente quando tasks$ emite novos valores -->
  <table mat-table [dataSource]="dataSource">
    <!-- colunas da tabela -->
  </table>
</ng-container>
```

### Como o State Funciona Na Prática

#### 1. Estado Inicial:
```typescript
// Quando a aplicação inicia
taskState = {
  tasks: [],           // Nenhuma task carregada
  isLoading: false,    // Não está carregando
  error: null         // Nenhum erro
}
```

#### 2. Usuário Carrega Tasks:
```typescript
// Quando dispatch(loadTasks()) é chamado
taskState = {
  tasks: [],           // Ainda vazio
  isLoading: true,     // ✅ Agora está carregando
  error: null         // Limpa erros anteriores
}

// Template automaticamente mostra: <app-loading>
```

#### 3. API Retorna Dados:
```typescript
// Quando loadTasksSuccess() é disparado
taskState = {
  tasks: [             // ✅ Tasks carregadas
    { id: 1, title: "Estudar NgRx", date: "2025-01-01" },
    { id: 2, title: "Fazer exercício", date: "2025-01-02" }
  ],
  isLoading: false,    // ✅ Parou de carregar
  error: null
}

// Template automaticamente:
// - Esconde <app-loading>
// - Mostra tabela com as tasks
```

#### 4. Se Ocorrer Erro:
```typescript
// Quando loadTasksFailure() é disparado
taskState = {
  tasks: [],
  isLoading: false,    // Parou de carregar
  error: "Falha ao carregar tasks"  // ✅ Erro registrado
}

// Template pode reagir ao error$ observable
```

### Comparação: Antes vs. Depois do NgRx

#### ❌ ANTES (sem NgRx):
```typescript
export class TaskPageComponent {
  tasks: Task[] = [];           // Variável estática
  isLoading: boolean = false;   // Variável estática
  
  constructor(private taskService: TaskService) {}
  
  loadTasks() {
    this.isLoading = true;      // Mudança manual
    this.taskService.getAllTasks().subscribe(
      (tasks) => {
        this.tasks = tasks;     // Atribuição manual
        this.isLoading = false; // Mudança manual
      },
      (error) => {
        this.isLoading = false; // Mudança manual
        // Tratamento de erro manual
      }
    );
  }
}
```

#### ✅ DEPOIS (com NgRx):
```typescript
export class TaskPageComponent {
  tasks$ = this.store.select(selectTasks);        // Observable reativo
  isLoading$ = this.store.select(selectLoading);  // Observable reativo
  
  constructor(private store: Store) {}
  
  loadTasks() {
    this.store.dispatch(loadTasks());  // Simples dispatch
    // NgRx gerencia automaticamente:
    // - Estado de loading
    // - Chamada da API (effects)
    // - Atualização do state
    // - Notificação dos observables
  }
}
```

### Vantagens Práticas no Nosso Projeto

1. **Automatização Total**: State muda → UI atualiza automaticamente
2. **Sincronização**: Múltiplos componentes sempre em sync
3. **Debugging**: Redux DevTools mostra todo o histórico
4. **Testing**: Muito mais fácil testar com MockStore
5. **Performance**: OnPush change detection otimizado
6. **Manutenibilidade**: Lógica centralizada nos effects/reducers

## Como Visualizar o State em Ação

### 1. Redux DevTools (Recomendado)

Abra o navegador (Chrome/Firefox) e:

1. Acesse: `http://localhost:4200`
2. Abra o DevTools (F12)
3. Procure pela aba **Redux**
4. Você verá:
   - **Actions**: Todas as ações disparadas
   - **State**: Estado atual completo
   - **Diff**: O que mudou no state
   - **Time Travel**: Voltar/avançar no histórico

#### Exemplo do que você verá:
```
⚡ Actions Timeline:
[Auth] Login Success          ← Usuário fez login
[Task] Load Tasks            ← Componente carregou tasks  
[Task] Load Tasks Success    ← API retornou dados

📊 State Inspector:
{
  auth: {
    user: { id: 1, name: "João" },
    authenticated: true,
    isLoading: false
  },
  task: {
    tasks: [array com 5 items],
    isLoading: false,
    error: null
  }
}
```

### 2. Console do Navegador

Adicione logs temporários para ver o fluxo:

```typescript
// No component
ngOnInit() {
  this.isLoading$.subscribe(loading => {
    console.log('🔄 Loading state:', loading);
  });
  
  this.tasks$.subscribe(tasks => {
    console.log('📋 Tasks updated:', tasks.length, 'items');
  });
  
  this.error$.subscribe(error => {
    console.log('❌ Error state:', error);
  });
}
```

### 3. Teste Prático Agora

Execute estas ações na aplicação para ver o state mudando:

1. **Faça Login**:
   ```
   Console mostrará:
   🔄 Auth loading: true
   🔄 Auth loading: false
   ✅ User authenticated: true
   ```

2. **Navegue para Tasks**:
   ```
   Console mostrará:
   🔄 Tasks loading: true
   📋 Tasks updated: 0 items
   📋 Tasks updated: 5 items
   🔄 Tasks loading: false
   ```

3. **Crie uma Nova Task**:
   ```
   Console mostrará:
   🔄 Tasks loading: true
   📋 Tasks updated: 6 items  ← Uma task a mais!
   🔄 Tasks loading: false
   ```

### 4. Experimente com Erros

Desligue o backend temporariamente:

```bash
docker-compose stop backend
```

Então tente carregar tasks - você verá:
```
Console mostrará:
🔄 Tasks loading: true
❌ Error state: "Failed to load tasks"
🔄 Tasks loading: false
```

### Exercício Prático

1. Abra o projeto: `http://localhost:4200`
2. Abra Redux DevTools
3. Faça login
4. Vá para tasks
5. Crie uma nova task
6. Observe no DevTools:
   - Como o state muda
   - Sequência de actions
   - Como a UI reage automaticamente

**Isso é o poder do NgRx: state reativo e previsível! 🚀**

## Troubleshooting Comum

### Erro: "Cannot read properties of undefined (reading 'pipe')"

**Sintoma**: `TypeError: Cannot read properties of undefined (reading 'pipe') at auth.effects.ts:22:19`

**Causa**: O serviço `Actions` do NgRx não foi injetado corretamente nos effects devido à ordem de inicialização.

**Solução Definitiva**: Usar `inject()` ao invés de constructor injection para effects.

#### ❌ Problemático:
```typescript
@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,  // Pode estar undefined na inicialização
    private authService: AuthService
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(  // ← Erro: actions$ is undefined
      ofType(AuthActions.login),
      // ...
    )
  );
}
```

#### ✅ Solução Correta:
```typescript
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);        // Injeção moderna
  private authService = inject(AuthService); // Sempre funciona

  login$ = createEffect(() =>
    this.actions$.pipe(  // ✅ Funciona perfeitamente
      ofType(AuthActions.login),
      // ...
    )
  );
}
```

### Por que `inject()` resolve o problema?

1. **Timing**: `inject()` resolve a dependência no momento exato que é necessária
2. **Confiabilidade**: Funciona independente da ordem de inicialização da classe
3. **Moderno**: É a abordagem recomendada para Angular 15+
4. **Compatibilidade**: Funciona perfeitamente com NgRx effects

### Migração Rápida

Para converter effects existentes:
```bash
# Antes
constructor(private actions$: Actions) {}

# Depois  
private actions$ = inject(Actions);
```

### Erro: Loop de Navegação (Redirecionamento Infinito)

**Sintoma**: Aplicação fica em loop entre `/` e `/tasks`, nunca conseguindo acessar a página de tasks.

**Causa**: Conflito entre:
1. Effects do NgRx navegando automaticamente após login
2. Guard de autenticação redirecionando para `/` quando não autenticado
3. Componente de login tentando navegar novamente

**Solução**:

#### 1. Remover Navegação Automática dos Effects
```typescript
// ❌ Problemático - effects navegando automaticamente
loginSuccess$ = createEffect(() => 
  this.actions$.pipe(
    ofType(AuthActions.loginSuccess),
    tap(({ response }) => {
      this.storageService.setToken(response.token);
      this.router.navigate(['/tasks']); // ← Causa loop
    })
  )
);

// ✅ Correto - apenas salvar token
loginSuccess$ = createEffect(() => 
  this.actions$.pipe(
    ofType(AuthActions.loginSuccess),
    tap(({ response }) => {
      this.storageService.setToken(response.token);
      // Navigation handled by component
    })
  )
);
```

#### 2. Sincronizar Guard com NgRx Store
```typescript
// ❌ Problemático - guard usando storage diretamente
export const authGuard: CanActivateFn = (route, state) => {
  const token = storageService.getToken();
  return !!token;
};

// ✅ Correto - guard usando NgRx store
export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map(isAuthenticated => isAuthenticated || router.navigate(['/']))
  );
};
```

#### 3. Navegação Controlada no Componente
```typescript
// ✅ Navegar apenas após login bem-sucedido
ngOnInit() {
  this.store.select(state => state.auth).subscribe(authState => {
    if (authState.isAuthenticated && !authState.isLoading && this.username) {
      this.router.navigate(['/tasks']);
      this.username = ''; // Limpar para evitar navegação em refresh
    }
  });
}
```

**Dica**: Use Redux DevTools para ver o fluxo de actions e state durante o login.
