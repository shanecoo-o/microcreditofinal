import type { AuthSession, AuthUser } from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Falha na comunicação com o servidor.");
  }
  return (await response.json()) as T;
}

/**
 * Serviço de autenticação real (integração futura).
 * Activa-se com VITE_USE_MOCKS=false e VITE_API_BASE_URL definido.
 */
export const apiAuthService = {
  login(email: string, password: string): Promise<AuthSession> {
    return request<AuthSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register(input: { name: string; email: string; phone: string; password: string }): Promise<AuthUser> {
    return request<AuthUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  requestPasswordReset(email: string) {
    return request<{ accepted: boolean; email: string; message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },
};
