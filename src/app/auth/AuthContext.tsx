import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser, Role } from "../types";
import { authApi, getStoredUser } from "../api/client";

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, role?: Role) => Promise<AuthUser>;
  logout: () => void;
  hasRole: (roles: Role | Role[]) => boolean;
  hasPermission: (key: string) => boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string, role?: Role) => {
    const res = await authApi.login(email, password, role);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: Role | Role[]) => {
      if (!user) return false;
      const list = Array.isArray(roles) ? roles : [roles];
      return list.includes(user.role);
    },
    [user],
  );

  const hasPermission = useCallback(
    (key: string) => !!user?.permissions.includes(key),
    [user],
  );

  const value = useMemo(
    () => ({ user, loading, login, logout, hasRole, hasPermission }),
    [user, loading, login, logout, hasRole, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
