import type { AuthSession, AuthUser } from "../types";
import { USE_MOCKS } from "@/demo/demo.constants";
import { mockAuthService } from "./mockAuthService";
import { apiAuthService } from "./apiAuthService";

const SESSION_KEY = "jcf.session.v1";

export interface AuthService {
  login(email: string, password: string): Promise<AuthSession>;
  register(input: { name: string; email: string; phone: string; password: string }): Promise<AuthUser>;
  requestPasswordReset(email: string): Promise<{ accepted: boolean; email: string; message: string }>;
}

export const authService: AuthService = USE_MOCKS
  ? {
      login: (email, password) => mockAuthService.login(email, password),
      register: ({ name, email, phone }) => mockAuthService.register({ name, email, phone }),
      requestPasswordReset: (email) => mockAuthService.requestPasswordReset(email),
    }
  : apiAuthService;

export function storeSession(session: AuthSession) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignorar
  }
}

export function readSession(): { session: AuthSession | null; expired: boolean } {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { session: null, expired: false };
    const session = JSON.parse(raw) as AuthSession;
    if (session.expiresAt && session.expiresAt < Date.now()) {
      sessionStorage.removeItem(SESSION_KEY);
      return { session: null, expired: true };
    }
    return { session, expired: false };
  } catch {
    return { session: null, expired: false };
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignorar
  }
}
