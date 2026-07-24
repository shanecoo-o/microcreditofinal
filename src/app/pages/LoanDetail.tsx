import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Phone,
  User,
  Wallet as WalletIcon,
  FileText,
  ShieldCheck,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  IdCard,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDateTime, formatMZN } from "../utils/format";
import { loans, loanStatusLabel, loanStatusStyle, scoreStyle } from "../mock/loans";
import { WorkflowTimeline } from "../components/WorkflowTimeline";

type ActionType = "approve" | "reject" | "correction";

interface DocItem {
  nome: string;
  tipo: string;
  tamanho: string;
  data: string;
  estado: "VALIDADO" | "PENDENTE" | "REJEITADO";
}

interface Observacao {
  autor: string;
  data: string;
  texto: string;
}

const mockDocumentos: DocItem[] = [
  { nome: "BI_frente_verso.pdf", tipo: "Identificação", tamanho: "1.2 MB", data: "2026-07-21T09:12:00Z", estado: "VALIDADO" },
  { nome: "Comprovativo_residencia.pdf", tipo: "Residência", tamanho: "780 KB", data: "2026-07-21T09:14:00Z", estado: "VALIDADO" },
  { nome: "Declaracao_rendimento.pdf", tipo: "Financeiro", tamanho: "540 KB", data: "2026-07-21T09:15:00Z", estado: "PENDENTE" },
  { nome: "Foto_garantia.jpg", tipo: "Garantia", tamanho: "2.1 MB", data: "2026-07-21T09:16:00Z", estado: "VALIDADO" },
];

const mockObservacoesBase: Observacao[] = [
  {
    autor: "Ana Cossa",
    data: "2026-07-21T10:00:00Z",
    texto: "Cliente com bom histórico de pagamento em processos anteriores. Recomenda-se aprovar após validação da garantia.",
  },
  {
    autor: "Bruno Chissano",
    data: "2026-07-21T11:30:00Z",
    texto: "Documentação de rendimento aguarda confirmação da entidade empregadora.",
  },
];

const docEstadoStyle: Record<DocItem["estado"], string> = {
  VALIDADO: "bg-success/15 text-success hover:bg-success/15",
  PENDENTE: "bg-warning/15 text-warning hover:bg-warning/15",
  REJEITADO: "bg-destructive/15 text-destructive hover:bg-destructive/15",
};

export default function LoanDetail() {
  const { processo } = useParams<{ processo: string }>();
  const navigate = useNavigate();
  const request = loans.find((r) => r.processo === processo);

  const [action, setAction] = useState<ActionType | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [observacoes, setObservacoes] = useState<Observacao[]>(mockObservacoesBase);
  const [novaObs, setNovaObs] = useState("");

  if (!request) {
    return (
      <>
        <PageHeader
          title="Solicitação não encontrada"
          description="O processo indicado não existe ou foi removido."
        />
        <Button variant="outline" onClick={() => navigate("/app/loans")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar à lista
        </Button>
      </>
    );
  }

  const info = [
    { icon: User, label: "Cliente", value: request.cliente },
    { icon: Phone, label: "Telefone", value: request.telefone },
    { icon: WalletIcon, label: "Valor solicitado", value: formatMZN(request.valor) },
    { icon: Calendar, label: "Data do pedido", value: formatDateTime(request.data) },
    { icon: IdCard, label: "BI", value: request.bi },
    { icon: MapPin, label: "Endereço", value: request.endereco },
  ];

  const scorePct = Math.min(100, Math.round((request.score / 850) * 100));
  const scoreCategoria =
    request.score >= 750
      ? "Excelente"
      : request.score >= 600
      ? "Bom"
      : request.score >= 450
      ? "Regular"
      : "Baixo";

  const openAction = (type: ActionType) => {
    setAction(type);
    setActionNote("");
  };

  const confirmAction = () => {
    if (!action) return;
    const labels: Record<ActionType, string> = {
      approve: "Solicitação aprovada",
      reject: "Solicitação rejeitada",
      correction: "Correção solicitada ao cliente",
    };
    toast.success(labels[action], {
      description: actionNote || `Processo ${request.processo} atualizado.`,
    });
    setAction(null);
  };

  const addObservacao = () => {
    if (!novaObs.trim()) return;
    setObservacoes((prev) => [
      { autor: "Você", data: new Date().toISOString(), texto: novaObs.trim() },
      ...prev,
    ]);
    setNovaObs("");
    toast.success("Observação adicionada");
  };

  const actionMeta: Record<ActionType, { title: string; desc: string; confirmLabel: string }> = {
    approve: {
      title: "Aprovar solicitação",
      desc: "Confirme a aprovação do processo. Um contrato será gerado para assinatura.",
      confirmLabel: "Confirmar aprovação",
    },
    reject: {
      title: "Rejeitar solicitação",
      desc: "Indique o motivo da rejeição. O cliente será notificado.",
      confirmLabel: "Rejeitar processo",
    },
    correction: {
      title: "Solicitar correção",
      desc: "Descreva os ajustes necessários. O cliente poderá reenviar a documentação.",
      confirmLabel: "Enviar solicitação",
    },
  };

  return (
    <>
      <div className="mb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/loans")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Solicitações
        </Button>
      </div>

      <PageHeader
        title={request.processo}
        description={`Solicitação de ${request.cliente}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={cn("font-mono", scoreStyle(request.score))}>
              Score {request.score}
            </Badge>
            <Badge
              variant="secondary"
              className={cn("font-medium text-sm px-3 py-1", loanStatusStyle[request.estado])}
            >
              {loanStatusLabel[request.estado]}
            </Badge>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2 mb-6">
        <Button onClick={() => openAction("approve")} className="gap-2">
          <CheckCircle2 className="h-4 w-4" /> Aprovar
        </Button>
        <Button variant="destructive" onClick={() => openAction("reject")} className="gap-2">
          <XCircle className="h-4 w-4" /> Rejeitar
        </Button>
        <Button variant="outline" onClick={() => openAction("correction")} className="gap-2">
          <AlertCircle className="h-4 w-4" /> Solicitar Correção
        </Button>
      </div>

      <Tabs defaultValue="cliente" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="garantias">Garantias</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="score">Score</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
        </TabsList>

        <TabsContent value="cliente">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados do cliente e do pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {info.map((i) => (
                  <div key={i.label} className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-md bg-muted grid place-items-center shrink-0">
                      <i.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{i.label}</p>
                      <p className="text-sm font-medium truncate">{i.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Prazo" value={`${request.prazo} meses`} />
                <Field label="Taxa de juros" value={`${request.taxaJuros.toFixed(2)}% / mês`} />
                <Field label="Parcela estimada" value={formatMZN(request.parcelaEstimada)} />
                <Field label="Analista responsável" value={request.analista} />
                <Field label="Finalidade" value={request.finalidade} className="sm:col-span-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documentos submetidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockDocumentos.map((d) => (
                <div
                  key={d.nome}
                  className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-md bg-muted grid place-items-center shrink-0">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{d.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.tipo} · {d.tamanho} · {formatDateTime(d.data)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className={cn("font-medium", docEstadoStyle[d.estado])}>
                      {d.estado}
                    </Badge>
                    <Button variant="ghost" size="icon" title="Descarregar">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="garantias">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Garantia a penhorar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-md bg-muted grid place-items-center shrink-0">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bem oferecido</p>
                  <p className="text-sm font-medium">{request.garantia}</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Valor avaliado" value={formatMZN(Math.round(request.valor * 1.4))} />
                <Field
                  label="Rácio garantia / crédito"
                  value={`${((1.4) * 100).toFixed(0)}%`}
                />
                <Field label="Estado da avaliação" value="Validada" />
                <Field label="Local de guarda" value="Armazém JCF - Boane" className="sm:col-span-2" />
                <Field label="Avaliador" value={request.analista} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Histórico do processo</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-border ml-2 space-y-4">
                {request.historico.map((h, idx) => (
                  <li key={idx} className="ml-4">
                    <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary" />
                    <p className="text-sm font-medium">{h.evento}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(h.data)} · {h.autor}
                    </p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="score">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Avaliação de crédito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Pontuação</p>
                  <p className="text-3xl font-semibold">
                    {request.score}
                    <span className="text-base text-muted-foreground font-normal"> / 850</span>
                  </p>
                </div>
                <Badge variant="secondary" className={cn("font-medium", scoreStyle(request.score))}>
                  {scoreCategoria}
                </Badge>
              </div>
              <Progress value={scorePct} />

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Histórico de pagamento" value="Bom — sem incidentes registados" />
                <Field label="Endividamento actual" value="Baixo" />
                <Field label="Tempo de relação" value="14 meses" />
                <Field label="Consultas recentes" value="2 nos últimos 6 meses" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observacoes">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Observações internas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Adicionar nova observação..."
                  value={novaObs}
                  onChange={(e) => setNovaObs(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={addObservacao} disabled={!novaObs.trim()}>
                    Adicionar
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                {observacoes.map((o, idx) => (
                  <div key={idx} className="rounded-md border border-border p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium">{o.autor}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(o.data)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{o.texto}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={action !== null} onOpenChange={(o) => !o && setAction(null)}>
        <DialogContent>
          {action && (
            <>
              <DialogHeader>
                <DialogTitle>{actionMeta[action].title}</DialogTitle>
                <DialogDescription>{actionMeta[action].desc}</DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Notas (opcional)"
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={4}
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setAction(null)}>
                  Cancelar
                </Button>
                <Button
                  variant={action === "reject" ? "destructive" : "default"}
                  onClick={confirmAction}
                >
                  {actionMeta[action].confirmLabel}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
