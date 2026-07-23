# Plataforma Admin Fintech — Frontend MVP

Vou construir o painel administrativo como uma app separada da landing page pública atual (que permanece em `/`). Todo o painel vive em `/app/*` com autenticação mock (pronta para trocar por JWT do Spring Boot depois).

## Escopo

- Design system: paleta indicada (#0F172A, #2563EB, #16A34A, #F59E0B, #DC2626), tipografia Inter, dark/light mode via `next-themes`, tokens semânticos em `index.css`.
- Autenticação mock com JWT simulado guardado em `localStorage`, contexto `AuthProvider`, refresh token stub, seletor de perfil para testar RBAC (ADMIN, MANAGER, SUPPORT, USER).
- Camada `api/` com Axios + interceptors (Authorization, refresh, error toast). Base URL `/api`. Adaptadores mock para todos os endpoints listados — cada um pronto para trocar por chamada real.
- React Query para todas as leituras/mutações.
- Rotas protegidas por `RequireAuth` e `RequireRole`.

## Estrutura de rotas

```text
/                       landing pública (mantida)
/app/login
/app/register
/app/forgot-password
/app/(protegido)
  ├─ dashboard          KPIs, gráficos (recharts), atividades
  ├─ profile
  ├─ wallet             saldo, entradas/saídas, histórico
  ├─ transactions       tabela com filtros período/estado/tipo
  ├─ notifications      centro, marcar lida, eliminar
  └─ admin/(ADMIN|MANAGER)
      ├─ dashboard      KPIs executivos
      ├─ users          CRUD, pesquisa, filtros, paginação
      ├─ roles          criar/editar roles + permissões
      ├─ permissions
      ├─ audit          log com IP
      ├─ reports        export PDF/Excel (jspdf, xlsx)
      └─ settings
```

## Layout

- `AppLayout` com `SidebarProvider` (shadcn sidebar colapsável), topbar com pesquisa global, alternador de tema, sino de notificações, menu do utilizador.
- Sidebar filtra itens por role do utilizador autenticado.
- Layout responsivo: sidebar off-canvas em mobile.

## Componentes reutilizáveis

- `DataTable` genérica (tanstack table) com pesquisa, paginação, filtros, seleção.
- `KpiCard`, `StatTrend`, `PageHeader`, `EmptyState`, `ConfirmDialog`, `RoleBadge`, `StatusBadge`.
- Formulários com `react-hook-form` + `zod`.

## Detalhes técnicos

- Lazy loading de todas as páginas (`React.lazy` + `Suspense`).
- `ErrorBoundary` global + por rota.
- Toasts via sonner.
- Mock data seedado em `src/mocks/` (utilizadores, transações, notificações, auditoria) com utilitários para simular latência e paginação server-side.
- Comentários `// TODO(backend)` em cada ponto de troca para Spring Boot.
- Sem backend real nesta fase — a landing existente e o painel podem coexistir. Cloud/Supabase pode ser adicionado depois se preferires auth real.

## Fora do escopo (nesta fase)

- Integração real com Spring Boot (fica preparada, não conectada).
- Geração real de relatórios do lado do servidor (exports são client-side).
- WebSocket para notificações em tempo real.
- Testes automatizados.

Após aprovares, começo pela base (theming, auth, layout, sidebar RBAC) e depois cada módulo.
