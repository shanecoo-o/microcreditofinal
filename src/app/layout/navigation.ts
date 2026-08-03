import type { Role } from "../types";

export interface NavItem {
  to: string;
  label: string;
  roles: Role[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

const ALL_INTERNAL: Role[] = [
  "ADMIN",
  "MANAGER",
  "ANALYST",
  "SUPPORT",
  "FINANCE",
  "COLLECTIONS",
  "AUDIT",
];

/** Navegação canónica do backoffice, filtrada por perfil. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Visão Geral",
    items: [
      { to: "/app/admin/dashboard", label: "Painel Executivo", roles: ["ADMIN", "MANAGER", "AUDIT"] },
    ],
  },
  {
    label: "Operações",
    items: [
      { to: "/app/admin/operations", label: "Centro de Operações", roles: ["ADMIN", "MANAGER", "ANALYST", "SUPPORT"] },
      { to: "/app/admin/loan-requests", label: "Pedidos de Crédito", roles: ["ADMIN", "MANAGER", "ANALYST", "SUPPORT", "AUDIT"] },
      { to: "/app/admin/appointments", label: "Agenda e Atendimentos", roles: ["ADMIN", "MANAGER", "ANALYST", "SUPPORT"] },
      { to: "/app/admin/clients", label: "Clientes", roles: ["ADMIN", "MANAGER", "ANALYST", "SUPPORT", "COLLECTIONS", "AUDIT"] },
      { to: "/app/admin/analyses", label: "Análises", roles: ["ADMIN", "MANAGER", "ANALYST", "AUDIT"] },
      { to: "/app/admin/approvals", label: "Aprovações", roles: ["ADMIN", "MANAGER", "AUDIT"] },
    ],
  },
  {
    label: "Carteira",
    items: [
      { to: "/app/admin/loans", label: "Créditos", roles: ["ADMIN", "MANAGER", "FINANCE", "COLLECTIONS", "AUDIT"] },
      { to: "/app/admin/guarantees", label: "Garantias", roles: ["ADMIN", "MANAGER", "ANALYST", "AUDIT"] },
      { to: "/app/admin/guarantors", label: "Avalistas", roles: ["ADMIN", "MANAGER", "ANALYST", "AUDIT"] },
      { to: "/app/admin/contracts", label: "Contratos", roles: ["ADMIN", "MANAGER", "SUPPORT", "AUDIT"] },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { to: "/app/admin/disbursements", label: "Desembolsos", roles: ["ADMIN", "MANAGER", "FINANCE", "AUDIT"] },
      { to: "/app/admin/payments", label: "Pagamentos", roles: ["ADMIN", "MANAGER", "FINANCE", "COLLECTIONS", "AUDIT"] },
      { to: "/app/admin/installments", label: "Prestações", roles: ["ADMIN", "MANAGER", "FINANCE", "COLLECTIONS", "AUDIT"] },
      { to: "/app/admin/reconciliation", label: "Reconciliação", roles: ["ADMIN", "MANAGER", "FINANCE", "AUDIT"] },
      { to: "/app/admin/collections", label: "Cobranças", roles: ["ADMIN", "MANAGER", "COLLECTIONS", "AUDIT"] },
      { to: "/app/admin/restructurings", label: "Reestruturações", roles: ["ADMIN", "MANAGER", "COLLECTIONS", "AUDIT"] },
    ],
  },
  {
    label: "Relatórios",
    items: [
      { to: "/app/admin/reports", label: "Relatórios", roles: ALL_INTERNAL },
      { to: "/app/admin/exports", label: "Exportações", roles: ["ADMIN", "MANAGER", "FINANCE", "AUDIT"] },
    ],
  },
  {
    label: "Administração",
    items: [
      { to: "/app/admin/users", label: "Utilizadores", roles: ["ADMIN", "SUPPORT"] },
      { to: "/app/admin/roles", label: "Perfis e Permissões", roles: ["ADMIN"] },
      { to: "/app/admin/products", label: "Produtos de Crédito", roles: ["ADMIN", "MANAGER"] },
      { to: "/app/admin/branches", label: "Agências", roles: ["ADMIN", "MANAGER"] },
      { to: "/app/admin/settings", label: "Configurações", roles: ["ADMIN"] },
      { to: "/app/admin/audit", label: "Auditoria", roles: ["ADMIN", "MANAGER", "AUDIT"] },
    ],
  },
];

/** Itens da área pessoal — apenas para clientes. */
export const CLIENT_NAV: NavItem[] = [
  { to: "/app/dashboard", label: "Painel", roles: ["USER"] },
  { to: "/app/loans", label: "Os meus créditos", roles: ["USER"] },
  { to: "/app/wallet", label: "Carteira", roles: ["USER"] },
  { to: "/app/transactions", label: "Movimentos", roles: ["USER"] },
  { to: "/app/notifications", label: "Notificações", roles: ["USER"] },
  { to: "/app/profile", label: "Perfil", roles: ["USER"] },
];

/** Perfis com acesso apenas de leitura ao backoffice. */
export const READONLY_ROLES: Role[] = ["AUDIT"];

export const isReadOnly = (role?: Role) => !!role && READONLY_ROLES.includes(role);
