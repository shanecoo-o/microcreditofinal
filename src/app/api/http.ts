/**
 * Camada HTTP preparada para integração futura com as APIs Spring Boot.
 *
 * Hoje todos os módulos do backoffice consomem dados mockados
 * (src/app/mock/*). Quando o backend estiver disponível basta:
 *   1. definir VITE_API_BASE_URL
 *   2. trocar os `mock*` services por chamadas `http.get/post/...`
 * A assinatura dos services (src/app/api/backoffice.ts) mantém-se igual.
 */

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface Page<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("jcf.token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    let details: unknown;
    try {
      details = await res.json();
    } catch {
      details = await res.text();
    }
    throw new ApiError(res.status, `Erro ${res.status} em ${path}`, details);
  }

  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export const http = {
  get: <T,>(path: string) => request<T>(path),
  post: <T,>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body ?? {}) }),
  put: <T,>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body ?? {}) }),
  patch: <T,>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body ?? {}) }),
  delete: <T,>(path: string) => request<T>(path, { method: "DELETE" }),
};

/** Simula latência de rede nos services mockados. */
export const delay = <T,>(data: T, ms = 180): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));
