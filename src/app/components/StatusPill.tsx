import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "muted";

const toneClass: Record<Tone, string> = {
  success: "bg-success/15 text-success hover:bg-success/15",
  warning: "bg-warning/15 text-warning hover:bg-warning/15",
  danger: "bg-destructive/15 text-destructive hover:bg-destructive/15",
  info: "bg-primary/10 text-primary hover:bg-primary/10",
  muted: "bg-muted text-muted-foreground hover:bg-muted",
};

const toneByStatus: Record<string, Tone> = {
  ACTIVE: "success",
  ATIVO: "success",
  AVALIADA: "success",
  LIQUIDADO: "success",
  APROVADO: "success",
  PENDENTE: "warning",
  AGUARDA_ASSINATURA: "warning",
  RASCUNHO: "muted",
  INACTIVE: "muted",
  LIBERTADA: "muted",
  ENCERRADO: "muted",
  EM_ATRASO: "danger",
  BLOCKED: "danger",
  REJEITADA: "danger",
  CANCELADO: "danger",
  CRITICA: "danger",
  ALTA: "danger",
  MEDIA: "warning",
  BAIXA: "info",
};

const labels: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  BLOCKED: "Bloqueado",
  ATIVO: "Ativo",
  EM_ATRASO: "Em atraso",
  PENDENTE: "Pendente",
  LIQUIDADO: "Liquidado",
  CANCELADO: "Cancelado",
  AVALIADA: "Avaliada",
  REJEITADA: "Rejeitada",
  LIBERTADA: "Libertada",
  RASCUNHO: "Rascunho",
  AGUARDA_ASSINATURA: "Aguarda assinatura",
  ENCERRADO: "Encerrado",
  CRITICA: "Crítica",
  ALTA: "Alta",
  MEDIA: "Média",
  BAIXA: "Baixa",
};

export function StatusPill({ status, tone }: { status: string; tone?: Tone }) {
  const t = tone ?? toneByStatus[status] ?? "muted";
  return (
    <Badge variant="secondary" className={cn("font-medium", toneClass[t])}>
      {labels[status] ?? status}
    </Badge>
  );
}

export function ScorePill({ score }: { score: number }) {
  const tone: Tone = score >= 750 ? "success" : score >= 600 ? "info" : score >= 480 ? "warning" : "danger";
  return (
    <Badge variant="secondary" className={cn("font-mono font-medium", toneClass[tone])}>
      {score}
    </Badge>
  );
}
