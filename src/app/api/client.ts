/**
 * API client — mock-first, prepared for Spring Boot backend.
 * TODO(backend): substituir por chamadas reais (fetch/axios) a `/api/*`.
 * Cada função abaixo mapeia diretamente para um endpoint documentado.
 */
import {
  seedAudit,
  seedNotifications,
  seedPermissions,
  seedRoles,
  seedTransactions,
  seedUsers,
  seedWallets,
} from "../mock/data";
import type {
  AuditLog,
  AuthUser,
  Notification,
  Permission,
  Role,
  RoleDef,
  Transaction,
  User,
  Wallet,
} from "../types";

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// In-memory stores (survive during session)
let users = [...seedUsers];
let notifications = [...seedNotifications];
const audit = [...seedAudit];
const permissions = [...seedPermissions];
let roles = [...seedRoles];
const wallets = { ...seedWallets };
const transactions = [...seedTransactions];

const TOKEN_KEY = "jcf.auth.token";
const USER_KEY = "jcf.auth.user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setSession(user: AuthUser, token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/* ============ AUTH ============ */
export const authApi = {
  // POST /auth/login
  async login(email: string, _password: string, role?: Role) {
    await wait();
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user && role) {
      user = users.find((u) => u.role === role) ?? users[0];
    }
    if (!user) throw new Error("Credenciais inválidas");
    const roleDef = roles.find((r) => r.name === user!.role);
    const authUser: AuthUser = { ...user, permissions: roleDef?.permissions ?? [] };
    const token = `mock.${btoa(user.id)}.${Date.now()}`;
    setSession(authUser, token);
    return { user: authUser, token, refreshToken: token + ".r" };
  },
  // POST /auth/register
  async register(input: Omit<User, "id" | "createdAt" | "status" | "role"> & { password: string }) {
    await wait();
    const user: User = {
      id: `u-${Date.now()}`,
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
    users = [user, ...users];
    return user;
  },
  // POST /auth/forgot-password
  async forgotPassword(email: string) {
    await wait();
    return { sent: true, email };
  },
  // POST /auth/refresh
  async refresh() {
    await wait(100);
    const u = getStoredUser();
    if (!u) throw new Error("Sem sessão");
    return { token: `mock.${btoa(u.id)}.${Date.now()}` };
  },
  logout() {
    clearSession();
  },
};

/* ============ USERS ============ */
export interface UserListParams {
  q?: string;
  role?: Role | "ALL";
  status?: "ACTIVE" | "INACTIVE" | "ALL";
  page?: number;
  pageSize?: number;
}
export const usersApi = {
  // GET /users
  async list(params: UserListParams = {}) {
    await wait();
    const { q = "", role = "ALL", status = "ALL", page = 1, pageSize = 10 } = params;
    let filtered = users;
    if (q)
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q.toLowerCase()) ||
          u.email.toLowerCase().includes(q.toLowerCase()),
      );
    if (role !== "ALL") filtered = filtered.filter((u) => u.role === role);
    if (status !== "ALL") filtered = filtered.filter((u) => u.status === status);
    const total = filtered.length;
    const items = filtered.slice((page - 1) * pageSize, page * pageSize);
    return { items, total, page, pageSize };
  },
  // POST /users
  async create(input: Omit<User, "id" | "createdAt">) {
    await wait();
    const user: User = { ...input, id: `u-${Date.now()}`, createdAt: new Date().toISOString() };
    users = [user, ...users];
    return user;
  },
  // PUT /users/:id
  async update(id: string, patch: Partial<User>) {
    await wait();
    users = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    return users.find((u) => u.id === id)!;
  },
  // DELETE /users/:id
  async remove(id: string) {
    await wait();
    users = users.map((u) => (u.id === id ? { ...u, status: "INACTIVE" } : u));
    return { ok: true };
  },
};

/* ============ ROLES & PERMISSIONS ============ */
export const rolesApi = {
  async list(): Promise<RoleDef[]> {
    await wait();
    return roles;
  },
  async create(input: Omit<RoleDef, "id">) {
    await wait();
    const r = { ...input, id: `r-${Date.now()}` };
    roles = [...roles, r];
    return r;
  },
  async update(id: string, patch: Partial<RoleDef>) {
    await wait();
    roles = roles.map((r) => (r.id === id ? { ...r, ...patch } : r));
    return roles.find((r) => r.id === id)!;
  },
  async remove(id: string) {
    await wait();
    roles = roles.filter((r) => r.id !== id);
    return { ok: true };
  },
};

export const permissionsApi = {
  async list(): Promise<Permission[]> {
    await wait();
    return permissions;
  },
};

/* ============ TRANSACTIONS / WALLET ============ */
export interface TxFilters {
  from?: string;
  to?: string;
  status?: Transaction["status"] | "ALL";
  type?: Transaction["type"] | "ALL";
  userId?: string;
}
export const transactionsApi = {
  async list(filters: TxFilters = {}): Promise<Transaction[]> {
    await wait();
    return transactions
      .filter((t) => (filters.userId ? t.userId === filters.userId : true))
      .filter((t) => (filters.status && filters.status !== "ALL" ? t.status === filters.status : true))
      .filter((t) => (filters.type && filters.type !== "ALL" ? t.type === filters.type : true))
      .filter((t) => (filters.from ? t.createdAt >= filters.from : true))
      .filter((t) => (filters.to ? t.createdAt <= filters.to : true));
  },
};

export const walletApi = {
  async get(userId: string): Promise<Wallet> {
    await wait();
    return wallets[userId] ?? { userId, balance: 0, currency: "MZN" };
  },
};

/* ============ NOTIFICATIONS ============ */
export const notificationsApi = {
  async list(): Promise<Notification[]> {
    await wait();
    return notifications;
  },
  async markRead(id: string) {
    await wait(80);
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    return { ok: true };
  },
  async markAllRead() {
    await wait(80);
    notifications = notifications.map((n) => ({ ...n, read: true }));
    return { ok: true };
  },
  async remove(id: string) {
    await wait(80);
    notifications = notifications.filter((n) => n.id !== id);
    return { ok: true };
  },
};

/* ============ AUDIT ============ */
export const auditApi = {
  async list(): Promise<AuditLog[]> {
    await wait();
    return audit;
  },
};

/* ============ REPORTS ============ */
export const reportsApi = {
  async summary() {
    await wait();
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "ACTIVE").length;
    const totalTx = transactions.length;
    const volume = transactions
      .filter((t) => t.status === "COMPLETED")
      .reduce((s, t) => s + t.amount, 0);
    const alerts = notifications.filter((n) => !n.read && n.level !== "info").length;
    return { totalUsers, activeUsers, totalTx, volume, alerts };
  },
  async series() {
    await wait();
    // last 12 months mock
    return Array.from({ length: 12 }).map((_, i) => ({
      month: new Date(2026, i, 1).toLocaleString("pt-PT", { month: "short" }),
      volume: Math.round(Math.random() * 800000 + 200000),
      transactions: Math.round(Math.random() * 200 + 50),
    }));
  },
};
