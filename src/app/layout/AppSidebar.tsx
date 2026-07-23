import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Bell,
  FileText,
  FileSignature,
  History,
  KeyRound,
  LayoutDashboard,
  ScrollText,
  Settings,
  Shield,
  UserCircle2,
  Users,
  Wallet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "../auth/AuthContext";
import type { Role } from "../types";

interface Item {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Role[];
}

const userItems: Item[] = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/wallet", label: "Carteira", icon: Wallet },
  { to: "/app/transactions", label: "Transações", icon: History },
  { to: "/app/loans", label: "Solicitações de Crédito", icon: FileSignature },
  { to: "/app/notifications", label: "Notificações", icon: Bell },
  { to: "/app/profile", label: "Perfil", icon: UserCircle2 },
];

const adminItems: Item[] = [
  { to: "/app/admin/dashboard", label: "Dashboard Admin", icon: BarChart3, roles: ["ADMIN", "MANAGER"] },
  { to: "/app/admin/loan-requests", label: "Solicitações", icon: FileSignature, roles: ["ADMIN", "MANAGER"] },
  { to: "/app/admin/users", label: "Utilizadores", icon: Users, roles: ["ADMIN", "MANAGER", "SUPPORT"] },
  { to: "/app/admin/roles", label: "Roles", icon: Shield, roles: ["ADMIN"] },
  { to: "/app/admin/permissions", label: "Permissões", icon: KeyRound, roles: ["ADMIN"] },
  { to: "/app/admin/audit", label: "Auditoria", icon: ScrollText, roles: ["ADMIN", "MANAGER"] },
  { to: "/app/admin/reports", label: "Relatórios", icon: FileText, roles: ["ADMIN", "MANAGER"] },
  { to: "/app/admin/settings", label: "Configurações", icon: Settings, roles: ["ADMIN"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, hasRole } = useAuth();
  const { pathname } = useLocation();

  const visibleAdmin = adminItems.filter((i) => !i.roles || hasRole(i.roles));

  const renderItem = (i: Item) => {
    const active = pathname === i.to;
    return (
      <SidebarMenuItem key={i.to}>
        <SidebarMenuButton asChild isActive={active} tooltip={i.label}>
          <NavLink to={i.to} className="flex items-center gap-3">
            <i.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{i.label}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold">
            J
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">JCF Microcrédito</p>
              <p className="text-xs text-muted-foreground truncate">Admin Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Área Pessoal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{userItems.map(renderItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {visibleAdmin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{visibleAdmin.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {!collapsed && user && (
        <SidebarFooter className="border-t border-sidebar-border">
          <div className="px-2 py-2">
            <p className="text-xs text-muted-foreground">Sessão</p>
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
