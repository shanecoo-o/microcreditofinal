import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Bell, CheckCheck, Info, Trash2, XCircle } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { notificationsApi } from "../api/client";
import { formatDateTime } from "../utils/format";
import { cn } from "@/lib/utils";
import type { Notification } from "../types";

const iconMap: Record<Notification["level"], typeof Bell> = {
  info: Info,
  success: CheckCheck,
  warning: AlertTriangle,
  error: XCircle,
};

const toneMap: Record<Notification["level"], string> = {
  info: "text-accent bg-accent/10",
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/10",
  error: "text-destructive bg-destructive/10",
};

export default function NotificationsPage() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.list,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const markAll = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
  const remove = useMutation({
    mutationFn: (id: string) => notificationsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  return (
    <>
      <PageHeader
        title="Notificações"
        description="Alertas e eventos importantes do sistema."
        actions={
          <Button variant="outline" onClick={() => markAll.mutate()}>
            <CheckCheck className="h-4 w-4 mr-2" /> Marcar todas como lidas
          </Button>
        }
      />
      <div className="space-y-3">
        {data.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Sem notificações.
            </CardContent>
          </Card>
        )}
        {data.map((n) => {
          const Icon = iconMap[n.level];
          return (
            <Card key={n.id} className={cn(!n.read && "border-accent/40")}>
              <CardContent className="p-4 flex gap-4 items-start">
                <div
                  className={cn("h-10 w-10 rounded-lg grid place-items-center", toneMap[n.level])}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-accent" aria-label="Não lida" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDateTime(n.createdAt)}
                  </p>
                </div>
                <div className="flex gap-1">
                  {!n.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markRead.mutate(n.id)}
                    >
                      Marcar
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove.mutate(n.id)}
                    aria-label="Remover"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
