# JCF Microcrédito, E.I — Plataforma

MVP demonstrativo da plataforma da **JCF Microcrédito, E.I**: website institucional,
portal do cliente e backoffice de crédito (pedidos, análise, contratos, desembolsos,
cobranças, auditoria).

> **Ambiente de demonstração — dados fictícios.** Nenhuma operação financeira, envio de
> email, assinatura digital ou pagamento é real.

## Stack

- React 18 + TypeScript + Vite
- React Router
- TanStack React Query
- Tailwind CSS + shadcn/ui
- Zod + React Hook Form

## Estrutura

```text
src/
  components/        Website público e componentes partilhados (shadcn em components/ui)
  app/               Aplicação autenticada
    auth/            AuthProvider, guards, mockAuthService / apiAuthService
    layout/          AppLayout, AppSidebar, Topbar
    pages/           Portal do cliente e backoffice
    components/      PageHeader, KpiCard, DataTable, StatusBadge, Timeline, ...
  demo/              Fonte única de dados demonstrativos
    fixtures/        Catálogo (agências, produtos, perfis) e dados de processos
    demo.types.ts    Entidades canónicas
    demo.constants.ts
    demoStore.ts     Estado em sessionStorage + notificação a subscritores
    demoActions.ts   Acções de negócio (pedido, documentos, marcações, pagamentos)
    demoSelectors.ts
    demoScenario.ts  Cenários INITIAL / APPROVED / DISBURSED / PAID
  domain/
    simulation.ts    Regras únicas de simulação e taxas de inscrição
```

## Comandos

```sh
npm install
npm run dev      # http://localhost:8080
npm run build
npm run lint
```

## Modo demo

Configurado em `.env` (ver `.env.example`):

| Variável | Efeito |
| --- | --- |
| `VITE_USE_MOCKS` | Usa `mockAuthService` e o `demoStore` em vez do backend |
| `VITE_SHOW_DEMO_ACCESS` | Mostra as contas de demonstração no ecrã de início de sessão |
| `VITE_API_BASE_URL` | Base do backend real (integração futura) |

Contas demonstrativas (palavra-passe `demo1234`, nunca pré-preenchida):
`admin@`, `gestor@`, `analista@`, `atendimento@`, `financeiro@`, `cobrancas@`,
`auditoria@` `jcf.co.mz` e o cliente `carlos@demo.jcf.co.mz`.

## Rotas principais

- Público: `/`, `/simulador`, `/pre-candidatura`, `/agendar`, `/privacidade`, `/termos`,
  `/tratamento-de-dados`, `/credito-responsavel`
- Autenticação: `/app/login`, `/app/register`, `/app/forgot-password`
- Cliente: `/app/dashboard`, `/app/applications`, `/app/applications/:processId`,
  `/app/appointments`, `/app/loans/:loanId`
- Backoffice: `/app/admin/*` (pedidos, operações, clientes, créditos, garantias,
  contratos, financeiro, cobranças, relatórios, auditoria, utilizadores, perfis,
  permissões, configurações)

## Limitações do MVP

- Todos os dados vivem em `sessionStorage`; ao fechar o separador o cenário reinicia.
- Pagamentos, desembolsos, assinaturas e notificações são **simulados**.
- Recibos incluem a marca `DOCUMENTO DEMONSTRATIVO — SEM VALIDADE FINANCEIRA`.
- Sem persistência multi-utilizador e sem envio real de comunicações.

## Integrações futuras

- Backend de crédito (autenticação, pedidos, contratos, desembolsos, pagamentos)
- Pagamentos por carteira móvel e transferência bancária
- Assinatura de contratos e arquivo documental
- Notificações por email/SMS e relatórios regulatórios
