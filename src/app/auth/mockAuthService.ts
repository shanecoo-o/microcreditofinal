import type { AuthSession, AuthUser } from "../types";
import { DEMO_PASSWORD } from "@/demo/demo.constants";
import { demoStore } from "@/demo/demoStore";

const SESSION_HOURS = 8;

/**
 * Serviço de autenticação demonstrativo.
 * Só aceita contas existentes no conjunto de dados demo e a palavra-passe demo.
 */
export const mockAuthService = {
  async login(email: string, password: string): Promise<AuthSession> {
    await new Promise((r) => setTimeout(r, 220));

    const data = demoStore.getState();
    const user = data.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) throw new Error("Credenciais inválidas. Verifique o email indicado.");
    if (password !== DEMO_PASSWORD)
      throw new Error("Credenciais inválidas. Verifique a palavra-passe.");
    if (user.status !== "ACTIVE") throw new Error("Conta inactiva. Contacte o administrador.");

    const role = data.roles.find((r) => r.code === user.role);
    const authUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      clientId: user.clientId,
      branchId: user.branchId,
      permissions: role?.permissions ?? [],
    };

    return {
      user: authUser,
      token: `demo.${btoa(user.id)}`,
      expiresAt: Date.now() + SESSION_HOURS * 3600_000,
    };
  },

  async register(input: { name: string; email: string; phone: string }): Promise<AuthUser> {
    await new Promise((r) => setTimeout(r, 220));
    const data = demoStore.getState();
    if (data.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase()))
      throw new Error("Já existe uma conta com este email.");

    const id = `USR-${String(data.users.length + 101).padStart(3, "0")}`;
    const clientId = `CLI-${new Date().getFullYear()}-${String(data.clients.length + 1).padStart(4, "0")}`;

    const user: AuthUser = {
      id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: "USER",
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      clientId,
      permissions: [],
    };

    demoStore.update((current) => ({
      ...current,
      users: [...current.users, { ...user }],
      clients: [
        ...current.clients,
        {
          id: clientId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          identityNumber: "",
          profession: "",
          monthlyIncome: 0,
          monthlyExpenses: 0,
          branchId: current.branches[0].id,
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    return user;
  },

  async requestPasswordReset(email: string) {
    await new Promise((r) => setTimeout(r, 220));
    return {
      accepted: true,
      email,
      message: "Pedido de recuperação registado no cenário demonstrativo (nenhum email é enviado).",
    };
  },
};
