import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { Role } from "../types";
import { useAuth } from "./AuthContext";

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/app/login" state={{ from: location }} replace />;
  return <Outlet />;
}

export function RequireRole({ roles }: { roles: Role[] }) {
  const { user, hasRole } = useAuth();
  if (!user) return <Navigate to="/app/login" replace />;
  if (!hasRole(roles))
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">Acesso negado</h1>
        <p className="text-muted-foreground mt-2">
          A sua conta ({user.role}) não tem permissão para aceder a esta secção.
        </p>
      </div>
    );
  return <Outlet />;
}
