import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-success/15 text-success hover:bg-success/15",
    INACTIVE: "bg-muted text-muted-foreground hover:bg-muted",
    COMPLETED: "bg-success/15 text-success hover:bg-success/15",
    PENDING: "bg-warning/15 text-warning hover:bg-warning/15",
    FAILED: "bg-destructive/15 text-destructive hover:bg-destructive/15",
  };
  return (
    <Badge variant="secondary" className={cn("font-medium", map[status] ?? "")}>
      {status}
    </Badge>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    ADMIN: "bg-primary/10 text-primary hover:bg-primary/10",
    MANAGER: "bg-accent/15 text-accent hover:bg-accent/15",
    SUPPORT: "bg-warning/15 text-warning hover:bg-warning/15",
    USER: "bg-muted text-muted-foreground hover:bg-muted",
  };
  return (
    <Badge variant="secondary" className={cn("font-medium", map[role] ?? "")}>
      {role}
    </Badge>
  );
}
