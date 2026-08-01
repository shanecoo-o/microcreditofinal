import { useQuery } from "@tanstack/react-query";
import { Clock, User } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { operationsService } from "../api/backoffice";
import { opsStages } from "../mock/backoffice";
import { formatDate, formatMZN } from "../utils/format";
import { cn } from "@/lib/utils";

const prioridadeClass: Record<string, string> = {
  ALTA: "bg-destructive/15 text-destructive hover:bg-destructive/15",
  MEDIA: "bg-warning/15 text-warning hover:bg-warning/15",
  BAIXA: "bg-muted text-muted-foreground hover:bg-muted",
};

export default function OperationsPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["ops-board"],
    queryFn: operationsService.board,
  });

  return (
    <>
      <PageHeader
        title="Centro de Operações"
        description="Pipeline operacional de todos os processos, do pedido ao encerramento."
      />

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max">
          {opsStages.map((stage) => {
            const cards = data.filter((c) => c.stage === stage.key);
            return (
              <section key={stage.key} className="w-[280px] shrink-0" aria-label={stage.label}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-sm font-semibold text-foreground">{stage.label}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {isLoading ? "…" : cards.length}
                  </Badge>
                </div>
                <div className="space-y-3 bg-muted/40 rounded-xl p-3 min-h-[160px]">
                  {isLoading &&
                    Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-28 w-full rounded-lg" />
                    ))}
                  {!isLoading && cards.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-6">Sem processos.</p>
                  )}
                  {cards.map((c) => (
                    <Card key={c.id} className="p-3 space-y-2 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs text-primary font-medium">{c.processo}</span>
                        <Badge
                          variant="secondary"
                          className={cn("text-[10px]", prioridadeClass[c.prioridade])}
                        >
                          {c.prioridade}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium leading-tight">{c.cliente}</p>
                      <p className="text-base font-semibold">{formatMZN(c.valor)}</p>
                      <p className="text-xs text-muted-foreground">{c.status}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                        <span className="flex items-center gap-1 truncate">
                          <User className="h-3 w-3 shrink-0" />
                          {c.responsavel.split(" ")[0]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(c.data)}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
