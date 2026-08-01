import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const labels: Record<string, string> = {
  app: "Início",
  dashboard: "Dashboard",
  admin: "Backoffice",
  operations: "Centro de Operações",
  clients: "Clientes",
  loans: "Empréstimos",
  guarantees: "Garantias",
  contracts: "Contratos",
  finance: "Financeiro",
  collections: "Cobrança",
  reports: "Relatórios",
  users: "Utilizadores",
  roles: "Perfis",
  permissions: "Permissões",
  settings: "Configurações",
  audit: "Auditoria",
  "loan-requests": "Solicitações",
  wallet: "Carteira",
  transactions: "Transações",
  notifications: "Notificações",
  profile: "Perfil",
};

export function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return null;

  return (
    <nav aria-label="Trilho de navegação" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link to="/app/dashboard" className="hover:text-foreground flex items-center gap-1">
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Início</span>
          </Link>
        </li>
        {parts.slice(1).map((part, i) => {
          const href = "/" + parts.slice(0, i + 2).join("/");
          const last = i === parts.length - 2;
          return (
            <li key={href} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              {last ? (
                <span aria-current="page" className="text-foreground font-medium">
                  {labels[part] ?? part}
                </span>
              ) : (
                <Link to={href} className="hover:text-foreground">
                  {labels[part] ?? part}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
