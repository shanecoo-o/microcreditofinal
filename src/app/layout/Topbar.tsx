import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GlobalSearch } from "./GlobalSearch";
import { useDemoStore } from "@/demo/DemoDataProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "../auth/AuthContext";
import { ThemeToggle } from "../components/ThemeProvider";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "../api/client";
import { Badge } from "@/components/ui/badge";

export function Topbar() {
  const { user, logout, branchId, setBranchId } = useAuth();
  const branches = useDemoStore().branches;
  const navigate = useNavigate();
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.list,
  });
  const unread = notifications.filter((n) => !n.read).length;

  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur sticky top-0 z-30 flex items-center gap-2 px-3 sm:px-4">
      <SidebarTrigger />
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <GlobalSearch />
      </div>
      {branches.length > 1 && user?.role !== "USER" && (
        <Select value={branchId ?? "TODAS"} onValueChange={(v) => setBranchId(v === "TODAS" ? undefined : v)}>
          <SelectTrigger className="hidden lg:flex h-9 w-[190px]" aria-label="Agência activa">
            <SelectValue placeholder="Agência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAS">Todas as agências</SelectItem>
            {branches.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <div className="flex-1 md:hidden" />
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => navigate("/app/notifications")}
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground">
              {unread}
            </Badge>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground font-normal">{user?.role}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/app/profile")}>Perfil</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/app/admin/settings")}>
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate("/app/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" /> Terminar sessão
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
