import type {
  AuditLog,
  Notification,
  Permission,
  RoleDef,
  Transaction,
  User,
  Wallet,
} from "../types";

const now = Date.now();
const daysAgo = (d: number) => new Date(now - d * 86400000).toISOString();

export const seedUsers: User[] = [
  {
    id: "u-1",
    name: "Admin JCF",
    email: "admin@jcf.co.mz",
    phone: "+258 84 000 0001",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: daysAgo(120),
  },
  {
    id: "u-2",
    name: "Ana Cossa",
    email: "ana@jcf.co.mz",
    phone: "+258 84 100 0002",
    role: "MANAGER",
    status: "ACTIVE",
    createdAt: daysAgo(90),
  },
  {
    id: "u-3",
    name: "Bruno Mahumane",
    email: "bruno@jcf.co.mz",
    phone: "+258 84 200 0003",
    role: "SUPPORT",
    status: "ACTIVE",
    createdAt: daysAgo(60),
  },
  {
    id: "u-4",
    name: "Cristina Nhaca",
    email: "cristina@example.com",
    phone: "+258 84 300 0004",
    role: "USER",
    status: "ACTIVE",
    createdAt: daysAgo(30),
  },
  {
    id: "u-5",
    name: "Daniel Machava",
    email: "daniel@example.com",
    phone: "+258 84 400 0005",
    role: "USER",
    status: "INACTIVE",
    createdAt: daysAgo(15),
  },
  ...Array.from({ length: 25 }).map<User>((_, i) => ({
    id: `u-${100 + i}`,
    name: `Cliente ${i + 1}`,
    email: `cliente${i + 1}@mail.mz`,
    phone: `+258 84 ${String(500 + i).padStart(3, "0")} ${String(1000 + i).padStart(4, "0")}`,
    role: "USER",
    status: i % 7 === 0 ? "INACTIVE" : "ACTIVE",
    createdAt: daysAgo(i * 2),
  })),
];

export const seedTransactions: Transaction[] = Array.from({ length: 60 }).map((_, i) => {
  const types: Transaction["type"][] = ["DEPOSIT", "WITHDRAW", "TRANSFER", "PAYMENT"];
  const statuses: Transaction["status"][] = ["COMPLETED", "PENDING", "FAILED"];
  return {
    id: `tx-${1000 + i}`,
    userId: seedUsers[i % seedUsers.length].id,
    type: types[i % types.length],
    amount: Math.round((Math.random() * 45000 + 500) * 100) / 100,
    status: statuses[i % statuses.length === 2 && i % 11 !== 0 ? 0 : i % statuses.length],
    createdAt: daysAgo(i),
    description: "Movimento operacional",
  };
});

export const seedNotifications: Notification[] = [
  {
    id: "n-1",
    userId: "u-1",
    title: "Novo empréstimo submetido",
    message: "Cliente Bruno M. submeteu um pedido de 50.000 MZN.",
    read: false,
    level: "info",
    createdAt: daysAgo(0),
  },
  {
    id: "n-2",
    userId: "u-1",
    title: "Parcela em atraso",
    message: "Ana C. tem uma parcela vencida há 3 dias.",
    read: false,
    level: "warning",
    createdAt: daysAgo(1),
  },
  {
    id: "n-3",
    userId: "u-1",
    title: "Backup concluído",
    message: "Backup diário concluído com sucesso.",
    read: true,
    level: "success",
    createdAt: daysAgo(2),
  },
];

export const seedAudit: AuditLog[] = Array.from({ length: 30 }).map((_, i) => ({
  id: `a-${i}`,
  user: seedUsers[i % seedUsers.length].email,
  action: ["LOGIN", "CREATE_USER", "UPDATE_USER", "DISABLE_USER", "EXPORT_REPORT"][i % 5],
  module: ["Auth", "Users", "Users", "Users", "Reports"][i % 5],
  ip: `10.0.${i % 255}.${(i * 3) % 255}`,
  createdAt: daysAgo(i),
}));

export const seedPermissions: Permission[] = [
  { id: "p-1", key: "users.read", description: "Ver utilizadores" },
  { id: "p-2", key: "users.write", description: "Criar/editar utilizadores" },
  { id: "p-3", key: "roles.manage", description: "Gerir roles" },
  { id: "p-4", key: "transactions.read", description: "Ver transações" },
  { id: "p-5", key: "reports.export", description: "Exportar relatórios" },
  { id: "p-6", key: "audit.read", description: "Ver auditoria" },
  { id: "p-7", key: "wallet.manage", description: "Gerir carteira" },
];

export const seedRoles: RoleDef[] = [
  {
    id: "r-1",
    name: "ADMIN",
    description: "Acesso total",
    permissions: seedPermissions.map((p) => p.key),
  },
  {
    id: "r-2",
    name: "MANAGER",
    description: "Gestão operacional",
    permissions: ["users.read", "users.write", "transactions.read", "reports.export"],
  },
  {
    id: "r-3",
    name: "SUPPORT",
    description: "Apoio ao cliente",
    permissions: ["users.read", "transactions.read"],
  },
  {
    id: "r-4",
    name: "USER",
    description: "Cliente final",
    permissions: ["wallet.manage"],
  },
];

export const seedWallets: Record<string, Wallet> = Object.fromEntries(
  seedUsers.map((u) => [
    u.id,
    { userId: u.id, balance: Math.round(Math.random() * 250000), currency: "MZN" },
  ]),
);
