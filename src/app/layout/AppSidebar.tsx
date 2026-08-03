import { NavLink, useLocation } from "react-router-dom";
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
import { CLIENT_NAV, NAV_GROUPS, type NavItem } from "./navigation";
import { PERFIL_LABEL } from "@/demo/demo.constants";
import { NAV_ICONS } from "./navIcons";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user } = useAuth();
  const { pathname } = useLocation();

  const allowed = (i: NavItem) => !!user && i.roles.includes(user.role);
  const isClient = user?.role === "USER";

  const renderItem = (i: NavItem) => {
    const Icon = NAV_ICONS[i.to] ?? NAV_ICONS.default;
    const active = pathname === i.to || pathname.startsWith(`${i.to}/`);
    return (
      <SidebarMenuItem key={i.to}>
        <SidebarMenuButton asChild isActive={active} tooltip={i.label}>
          <NavLink to={i.to} className="flex items-center gap-3">
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{i.label}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const groups = isClient
    ? [{ label: "Área do Cliente", items: CLIENT_NAV }]
    : NAV_GROUPS.map((g) => ({ ...g, items: g.items.filter(allowed) })).filter(
        (g) => g.items.length > 0,
      );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="h-9 w-9 rounded-[10px] bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-serif text-base font-semibold">
            J
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">JCF Microcrédito</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {isClient ? "Portal do Cliente" : "Backoffice"}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{group.items.map(renderItem)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {user && (
        <SidebarFooter className="border-t border-sidebar-border">
          {collapsed ? (
            <div className="px-2 py-2 text-center text-[10px] text-sidebar-foreground/60">
              {user.role.slice(0, 3)}
            </div>
          ) : (
            <div className="px-2 py-2">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {PERFIL_LABEL[user.role] ?? user.role}
              </p>
            </div>
          )}
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
