import { useMemo, useState } from "react";
import {
  Check,
  FileText,
  FileSearch,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  FileSignature,
  Wallet,
  Send,
  Circle,
  MessageSquarePlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "../utils/format";
import {
  LoanStatus,
  Loan,
  loanStatusLabel,
} from "../mock/loans";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export interface WorkflowEvent {
  data: string;
  estado: LoanStatus;
  autor: string;
  evento: string;
  observacao?: string;
}

const PIPELINE: LoanStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "DOCUMENT_PENDING",
  "GUARANTEE_REVIEW",
  "APPROVED",
  "CONTRACT_PENDING",
  "DISBURSED",
];

const STATE_ICON: Record<LoanStatus, typeof Send> = {
  SUBMITTED: Send,
  UNDER_REVIEW: FileSearch,
  DOCUMENT_PENDING: FileText,
  GUARANTEE_REVIEW: ShieldCheck,
  APPROVED: ThumbsUp,
  REJECTED: ThumbsDown,
  CONTRACT_PENDING: FileSignature,
  DISBURSED: Wallet,
};

function stateAccent(state: LoanStatus): { ring: string; bg: string; text: string } {
  switch (state) {
    case "REJECTED":
      return { ring: "ring-destructive/40", bg: "bg-destructive text-destructive-foreground", text: "text-destructive" };
    case "DISBURSED":
    case "APPROVED":
      return { ring: "ring-success/40", bg: "bg-success text-success-foreground", text: "text-success" };
    case "DOCUMENT_PENDING":
    case "CONTRACT_PENDING":
      return { ring: "ring-warning/40", bg: "bg-warning text-warning-foreground", text: "text-warning" };
    default:
      return { ring: "ring-primary/40", bg: "bg-primary text-primary-foreground", text: "text-primary" };
  }
}

/** Build a realistic workflow history for a loan, seeded by base historico + current state. */
export function buildWorkflow(loan: Loan): WorkflowEvent[] {
  const submitDate = new Date(loan.data);
  const step = (mins: number) => new Date(submitDate.getTime() + mins * 60_000).toISOString();

  const events: WorkflowEvent[] = [
    {
      data: step(0),
      estado: "SUBMITTED",
      autor: loan.cliente,
      evento: "Solicitação submetida",
      observacao: `Pedido de ${loan.finalidade.toLowerCase()}.`,
    },
    {
      data: step(45),
      estado: "UNDER_REVIEW",
      autor: loan.analista,
      evento: "Análise iniciada",
      observacao: "Documentação recebida e triada para análise.",
    },
  ];

  const path: LoanStatus[] = (() => {
    switch (loan.estado) {
      case "SUBMITTED":
        return [];
      case "UNDER_REVIEW":
        return [];
      case "DOCUMENT_PENDING":
        return ["DOCUMENT_PENDING"];
      case "GUARANTEE_REVIEW":
        return ["DOCUMENT_PENDING", "GUARANTEE_REVIEW"];
      case "REJECTED":
        return ["REJECTED"];
      case "APPROVED":
        return ["GUARANTEE_REVIEW", "APPROVED"];
      case "CONTRACT_PENDING":
        return ["GUARANTEE_REVIEW", "APPROVED", "CONTRACT_PENDING"];
      case "DISBURSED":
        return ["GUARANTEE_REVIEW", "APPROVED", "CONTRACT_PENDING", "DISBURSED"];
    }
  })();

  const notes: Partial<Record<LoanStatus, { autor: string; evento: string; obs: string }>> = {
    DOCUMENT_PENDING: {
      autor: loan.analista,
      evento: "Documentos pendentes solicitados",
      obs: "Cliente notificado para envio de comprovativo de residência actualizado.",
    },
    GUARANTEE_REVIEW: {
      autor: "Comissão de Garantias",
      evento: "Garantia enviada para avaliação",
      obs: `Avaliação em curso: ${loan.garantia}.`,
    },
    APPROVED: {
      autor: loan.analista,
      evento: "Crédito aprovado",
      obs: `Aprovação com base no score ${loan.score} e cobertura da garantia.`,
    },
    REJECTED: {
      autor: loan.analista,
      evento: "Crédito rejeitado",
      obs: "Insuficiência de garantia e/ou capacidade de endividamento.",
    },
    CONTRACT_PENDING: {
      autor: "Jurídico",
      evento: "Contrato gerado — aguarda assinatura",
      obs: "Contrato disponível para assinatura no balcão.",
    },
    DISBURSED: {
      autor: "Tesouraria",
      evento: "Valor desembolsado",
      obs: `Transferência efectuada ao cliente ${loan.cliente}.`,
    },
  };

  path.forEach((st, i) => {
    const n = notes[st]!;
    events.push({
      data: step(120 + i * 90),
      estado: st,
      autor: n.autor,
      evento: n.evento,
      observacao: n.obs,
    });
  });

  return events;
}

interface Props {
  loan: Loan;
}

export function WorkflowTimeline({ loan }: Props) {
  const initial = useMemo(() => buildWorkflow(loan), [loan]);
  const [events, setEvents] = useState<WorkflowEvent[]>(initial);
  const [newState, setNewState] = useState<LoanStatus>(loan.estado);
  const [newObs, setNewObs] = useState("");

  const currentState = events[events.length - 1]?.estado ?? loan.estado;
  const currentIdx = PIPELINE.indexOf(currentState);
  const rejected = currentState === "REJECTED";

  const addEvent = () => {
    if (!newObs.trim()) {
      toast.error("Adicione uma observação para registar a alteração.");
      return;
    }
    setEvents((prev) => [
      ...prev,
      {
        data: new Date().toISOString(),
        estado: newState,
        autor: "Você",
        evento: `Estado alterado para ${loanStatusLabel[newState]}`,
        observacao: newObs.trim(),
      },
    ]);
    setNewObs("");
    toast.success("Alteração registada na timeline");
  };

  return (
    <div className="space-y-4">
      {/* Visual pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fluxo do processo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-1 overflow-x-auto pb-2">
            {PIPELINE.map((st, i) => {
              const Icon = STATE_ICON[st];
              const isDone = !rejected && i < currentIdx;
              const isActive = !rejected && i === currentIdx;
              const accent = stateAccent(st);
              return (
                <div key={st} className="flex items-start gap-1 min-w-fit">
                  <div className="flex flex-col items-center min-w-[92px]">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full grid place-items-center border-2 transition-colors",
                        isDone && "bg-success text-success-foreground border-success",
                        isActive && `${accent.bg} border-transparent ring-4 ${accent.ring}`,
                        !isDone && !isActive && "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      {isDone ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <p
                      className={cn(
                        "text-[11px] mt-2 text-center leading-tight px-1",
                        isActive ? accent.text + " font-semibold" : "text-muted-foreground",
                      )}
                    >
                      {loanStatusLabel[st]}
                    </p>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 w-8 mt-5 rounded",
                        i < currentIdx && !rejected ? "bg-success" : "bg-border",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {rejected && (
            <div className="mt-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2">
              <ThumbsDown className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive font-medium">
                Processo rejeitado — fluxo interrompido.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Register change */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4" />
            Registar alteração de estado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
            <Select value={newState} onValueChange={(v) => setNewState(v as LoanStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  [
                    "SUBMITTED",
                    "UNDER_REVIEW",
                    "DOCUMENT_PENDING",
                    "GUARANTEE_REVIEW",
                    "APPROVED",
                    "REJECTED",
                    "CONTRACT_PENDING",
                    "DISBURSED",
                  ] as LoanStatus[]
                ).map((s) => (
                  <SelectItem key={s} value={s}>
                    {loanStatusLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Observação sobre a alteração..."
              value={newObs}
              onChange={(e) => setNewObs(e.target.value)}
              rows={2}
            />
          </div>
          <div className="flex justify-end">
            <Button size="sm" onClick={addEvent}>
              Registar alteração
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline detalhada</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l-2 border-border ml-3 space-y-6">
            {[...events].reverse().map((e, idx) => {
              const Icon = STATE_ICON[e.estado] ?? Circle;
              const accent = stateAccent(e.estado);
              return (
                <li key={idx} className="ml-6">
                  <span
                    className={cn(
                      "absolute -left-[13px] h-6 w-6 rounded-full grid place-items-center",
                      accent.bg,
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("text-xs font-semibold uppercase tracking-wide", accent.text)}>
                      {loanStatusLabel[e.estado]}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(e.data)}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{e.autor}</span>
                  </div>
                  <p className="text-sm font-medium mt-1">{e.evento}</p>
                  {e.observacao && (
                    <p className="text-sm text-muted-foreground mt-1">{e.observacao}</p>
                  )}
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
