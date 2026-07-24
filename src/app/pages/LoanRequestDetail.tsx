import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Check,
  FileText,
  FileImage,
  Home,
  IdCard,
  Image as ImageIcon,
  Info,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User,
  Wallet as WalletIcon,
  X,
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDateTime, formatMZN } from "../utils/format";
import {
  loanRequests,
  loanStateLabel,
  loanStateStyle,
} from "../mock/loanRequests";

type DocKind = "PDF" | "IMAGE";
interface DocItem {
  id: string;
  name: string;
  kind: DocKind;
  size: string;
  uploadedAt: string;
  url: string;
}
interface GuaranteeItem {
  id: string;
  tipo: string;
  descricao: string;
  valorEstimado: number;
  fotos: string[];
}
interface ObsItem {
  id: string;
  autor: string;
  data: string;
  texto: string;
}

// Deterministic mock generators based on processo id
function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

const IMG_PLACEHOLDER =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=60";
const PDF_PREVIEW =
  "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nD3MsQ3AIAxE0Z4pblQKUHYxJgwQKV1coyRO7v9tRJHiV+/pIQm9CqQe1p5RgqZbGl0V3sVo3wFsi9DdRk4NPBhBfDx0jK1kWyc2yWk3ZpM0nOA5cV0f7Q3gCwyfEwplbmRzdHJlYW0KZW5kb2JqCg==";

function buildDocs(id: string): DocItem[] {
  const base = "https://images.unsplash.com/";
  const imgs = [
    "photo-1554224155-6726b3ff858f",
    "photo-1554224154-26032ffc0d07",
    "photo-1450101499163-c8848c66ca85",
  ];
  return [
    {
      id: `${id}-d1`,
      name: "BI - Frente.jpg",
      kind: "IMAGE",
      size: "412 KB",
      uploadedAt: "2026-07-20T10:12:00Z",
      url: `${base}${imgs[0]}?auto=format&fit=crop&w=1200&q=60`,
    },
    {
      id: `${id}-d2`,
      name: "BI - Verso.jpg",
      kind: "IMAGE",
      size: "398 KB",
      uploadedAt: "2026-07-20T10:12:30Z",
      url: `${base}${imgs[1]}?auto=format&fit=crop&w=1200&q=60`,
    },
    {
      id: `${id}-d3`,
      name: "Comprovativo de residência.pdf",
      kind: "PDF",
      size: "1.2 MB",
      uploadedAt: "2026-07-20T10:15:00Z",
      url: PDF_PREVIEW,
    },
    {
      id: `${id}-d4`,
      name: "Declaração de rendimento.pdf",
      kind: "PDF",
      size: "820 KB",
      uploadedAt: "2026-07-20T10:16:00Z",
      url: PDF_PREVIEW,
    },
    {
      id: `${id}-d5`,
      name: "Fotografia da garantia.jpg",
      kind: "IMAGE",
      size: "1.6 MB",
      uploadedAt: "2026-07-20T10:18:00Z",
      url: `${base}${imgs[2]}?auto=format&fit=crop&w=1200&q=60`,
    },
  ];
}

function buildGuarantees(id: string, garantia: string, valor: number): GuaranteeItem[] {
  return [
    {
      id: `${id}-g1`,
      tipo: garantia.includes("Viatura") || garantia.includes("Moto")
        ? "Veículo"
        : garantia.includes("DUAT") || garantia.includes("Terreno") || garantia.includes("Imóvel")
        ? "Imóvel"
        : "Bem móvel",
      descricao: garantia,
      valorEstimado: Math.round(valor * 1.4),
      fotos: [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=60",
      ],
    },
  ];
}

function buildScore(id: string, estado: string) {
  const h = hashCode(id);
  const base = 45 + (h % 45); // 45–89
  const bonus = estado === "APROVADO" || estado === "DESEMBOLSADO" ? 8 : estado === "REJEITADO" ? -18 : 0;
  const score = Math.max(15, Math.min(95, base + bonus));
  return {
    score,
    capacidadePagamento: Math.min(100, score + 5),
    historicoCredito: Math.max(10, score - 8),
    estabilidade: Math.min(100, score + 2),
    garantia: Math.min(100, score + 10),
  };
}

function scoreLevel(score: number) {
  if (score >= 75) return { label: "Baixo risco", color: "text-success", bar: "bg-success" };
  if (score >= 55) return { label: "Risco moderado", color: "text-warning", bar: "bg-warning" };
  if (score >= 40) return { label: "Risco elevado", color: "text-warning", bar: "bg-warning" };
  return { label: "Risco muito elevado", color: "text-destructive", bar: "bg-destructive" };
}

const PROFISSOES = ["Comerciante", "Motorista", "Costureira", "Empresário", "Funcionário público"];

export default function LoanRequestDetail() {
  const { processo } = useParams<{ processo: string }>();
  const navigate = useNavigate();
  const request = loanRequests.find((r) => r.processo === processo);

  const [obs, setObs] = useState<ObsItem[]>([
    {
      id: "o1",
      autor: "Ana Cossa",
      data: "2026-07-21T09:30:00Z",
      texto: "Cliente apresenta bom histórico de pagamentos anteriores.",
    },
  ]);
  const [novaObs, setNovaObs] = useState("");
  const [preview, setPreview] = useState<DocItem | null>(null);
  const [tab, setTab] = useState("cliente");

  const docs = useMemo(() => (request ? buildDocs(request.processo) : []), [request]);
  const garantias = useMemo(
    () => (request ? buildGuarantees(request.processo, request.garantia, request.valor) : []),
    [request],
  );
  const score = useMemo(
    () => (request ? buildScore(request.processo, request.estado) : null),
    [request],
  );

  if (!request || !score) {
    return (
      <>
        <PageHeader
          title="Solicitação não encontrada"
          description="O processo indicado não existe ou foi removido."
        />
        <Button variant="outline" onClick={() => navigate("/app/admin/loan-requests")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar à lista
        </Button>
      </>
    );
  }

  const h = hashCode(request.processo);
  const profissao = PROFISSOES[h % PROFISSOES.length];
  const rendimento = 15_000 + (h % 60) * 1_000;
  const email = `${request.cliente.toLowerCase().split(" ")[0]}.${request.cliente.toLowerCase().split(" ").slice(-1)[0]}@email.co.mz`;
  const level = scoreLevel(score.score);

  const adicionarObs = () => {
    const t = novaObs.trim();
    if (!t) return;
    setObs((prev) => [
      { id: `o${prev.length + 1}`, autor: "Você", data: new Date().toISOString(), texto: t },
      ...prev,
    ]);
    setNovaObs("");
    toast.success("Observação adicionada");
  };

  const decidir = (acao: string) => {
    toast.success(acao);
  };

  return (
    <>
      <div className="mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/app/admin/loan-requests")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Solicitações
        </Button>
      </div>

      <PageHeader
        title={request.processo}
        description={`Solicitação de ${request.cliente} · ${formatMZN(request.valor)} · ${request.prazo} meses`}
        actions={
          <Badge
            variant="secondary"
            className={cn("font-medium text-sm px-3 py-1", loanStateStyle[request.estado])}
          >
            {loanStateLabel[request.estado]}
          </Badge>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="cliente">Cliente</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="garantias">Garantias</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="score">Score</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
          <TabsTrigger value="decisao">Decisão</TabsTrigger>
        </TabsList>

        {/* CLIENTE */}
        <TabsContent value="cliente">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados do cliente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoRow icon={User} label="Nome" value={request.cliente} />
              <InfoRow icon={IdCard} label="BI" value={request.bi} />
              <InfoRow icon={Phone} label="Telefone" value={request.telefone} />
              <InfoRow icon={Mail} label="Email" value={email} />
              <InfoRow icon={Home} label="Endereço" value={request.endereco} />
              <InfoRow icon={MapPin} label="Filial" value={request.filial} />
              <InfoRow icon={Briefcase} label="Profissão" value={profissao} />
              <InfoRow icon={WalletIcon} label="Rendimento mensal" value={formatMZN(rendimento)} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* DOCUMENTOS */}
        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documentos enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {docs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setPreview(d)}
                    className="text-left rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors overflow-hidden"
                  >
                    <div className="h-32 bg-muted grid place-items-center overflow-hidden">
                      {d.kind === "IMAGE" ? (
                        <img src={d.url} alt={d.name} className="h-full w-full object-cover" />
                      ) : (
                        <FileText className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2">
                        {d.kind === "IMAGE" ? (
                          <FileImage className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <p className="text-sm font-medium truncate">{d.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {d.size} · {formatDateTime(d.uploadedAt)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GARANTIAS */}
        <TabsContent value="garantias">
          <div className="space-y-4">
            {garantias.map((g) => (
              <Card key={g.id}>
                <CardHeader>
                  <CardTitle className="text-base">{g.tipo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Tipo" value={g.tipo} />
                    <Field label="Valor estimado" value={formatMZN(g.valorEstimado)} />
                    <Field label="Cobertura" value={`${Math.round((g.valorEstimado / request.valor) * 100)}%`} />
                    <Field label="Descrição" value={g.descricao} className="sm:col-span-3" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Fotografias</p>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {g.fotos.map((f, i) => (
                        <div key={i} className="aspect-video rounded-md overflow-hidden bg-muted">
                          <img src={f} alt={`Garantia ${i + 1}`} className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* HISTÓRICO */}
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Timeline do processo</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-border ml-2 space-y-6">
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

        {/* SCORE */}
        <TabsContent value="score">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base">Score de risco</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <div className="relative h-40 w-40 grid place-items-center rounded-full border-8 border-muted">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full",
                      "border-8 border-transparent",
                    )}
                    style={{
                      borderTopColor: "hsl(var(--primary))",
                      transform: `rotate(${(score.score / 100) * 360}deg)`,
                      transition: "transform 0.6s",
                    }}
                  />
                  <div className="text-center">
                    <p className="text-4xl font-bold">{score.score}</p>
                    <p className="text-xs text-muted-foreground">/ 100</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {score.score >= 55 ? (
                    <ShieldCheck className={cn("h-4 w-4", level.color)} />
                  ) : (
                    <ShieldAlert className={cn("h-4 w-4", level.color)} />
                  )}
                  <span className={cn("text-sm font-medium", level.color)}>{level.label}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Indicadores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScoreBar label="Capacidade de pagamento" value={score.capacidadePagamento} />
                <ScoreBar label="Histórico de crédito" value={score.historicoCredito} />
                <ScoreBar label="Estabilidade profissional" value={score.estabilidade} />
                <ScoreBar label="Qualidade da garantia" value={score.garantia} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OBSERVAÇÕES */}
        <TabsContent value="observacoes">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comentários internos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Adicionar uma observação interna..."
                  value={novaObs}
                  onChange={(e) => setNovaObs(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button size="sm" onClick={adicionarObs}>
                    Adicionar observação
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                {obs.map((o) => (
                  <div key={o.id} className="rounded-md border border-border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{o.autor}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(o.data)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{o.texto}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DECISÃO */}
        <TabsContent value="decisao">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tomada de decisão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-border bg-muted/40 p-4 flex items-start gap-3">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  Score atual: <span className={cn("font-medium", level.color)}>{score.score} — {level.label}</span>. Reveja documentos e garantias antes de decidir.
                </div>
              </div>
              <Textarea placeholder="Justificação da decisão (opcional)" rows={3} />
              <div className="flex flex-wrap gap-2">
                <Button
                  className="bg-success hover:bg-success/90 text-success-foreground"
                  onClick={() => decidir("Solicitação aprovada")}
                >
                  <Check className="h-4 w-4 mr-2" /> Aprovar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => decidir("Solicitação rejeitada")}
                >
                  <X className="h-4 w-4 mr-2" /> Rejeitar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => decidir("Documentos adicionais solicitados")}
                >
                  <FileText className="h-4 w-4 mr-2" /> Solicitar documentos adicionais
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {preview?.kind === "IMAGE" ? (
                <ImageIcon className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {preview?.name}
            </DialogTitle>
          </DialogHeader>
          {preview?.kind === "IMAGE" ? (
            <img src={preview.url} alt={preview.name} className="w-full rounded-md" />
          ) : (
            <iframe
              src={preview?.url}
              title={preview?.name}
              className="w-full h-[70vh] rounded-md bg-muted"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-md bg-muted grid place-items-center shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
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

function ScoreBar({ label, value }: { label: string; value: number }) {
  const lvl = scoreLevel(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm">{label}</p>
        <span className={cn("text-sm font-medium", lvl.color)}>{value}</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}
