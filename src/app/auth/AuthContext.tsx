import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser, Role } from "../types";
import { authService, clearSession, readSession, storeSession } from "./authService";
import { isReadOnly } from "../layout/navigation";

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
  hasPermission: (key: string) => boolean;
  /** Perfis de auditoria não executam acções. */
  readOnly: boolean;
  /** Agência activa do backoffice (branch switcher). */
  branchId?: string;
  setBranchId: (branchId?: string) => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [branchId, setBranchId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const { session } = readSession();
    if (session) {
      setUser(session.user);
      setBranchId(session.user.branchId);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const session = await authService.login(email, password);
    storeSession(session);
    setUser(session.user);
    setBranchId(session.user.branchId);
    return session.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setBranchId(undefined);
  }, []);

  const hasRole = useCallback(
    (roles: Role | Role[]) => {
      if (!user) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.includes(user.role);
    },
    [user],
  );

  const hasPermission = useCallback((key: string) => !!user?.permissions.includes(key), [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      hasRole,
      hasPermission,
      readOnly: isReadOnly(user?.role),
      branchId,
      setBranchId,
    }),
    [user, loading, login, logout, hasRole, hasPermission, branchId],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
