import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Coins,
  FileWarning,
  HandCoins,
  PiggyBank,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { KpiCard } from "../components/KpiCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate, formatDateTime, formatMZN, formatNumber } from "../utils/format";

/* ================= MOCK DATA ================= */

const kpis = {
  totalClientes: 1284,
  clientesActivos: 1041,
  clientesNovosMes: 62,
  emprestimosActivos: 487,
  emprestimosPendentes: 34,
  emprestimosAprovados: 128,
  emprestimosRejeitados: 41,
  valorDesembolsado: 42_580_000,
  valorRecuperado: 28_190_000,
  receitaJuros: 3_845_000,
  par30: 4.7,
  par90: 1.9,
  inadimplencia: 6.3,
};

const monthlyLoans = [
  { month: "Jan", desembolsado: 2_100_000, contratos: 38 },
  { month: "Fev", desembolsado: 2_450_000, contratos: 42 },
  { month: "Mar", desembolsado: 2_980_000, contratos: 51 },
  { month: "Abr", desembolsado: 3_250_000, contratos: 55 },
  { month: "Mai", desembolsado: 3_640_000, contratos: 61 },
  { month: "Jun", desembolsado: 3_890_000, contratos: 66 },
  { month: "Jul", desembolsado: 4_120_000, contratos: 70 },
  { month: "Ago", desembolsado: 3_980_000, contratos: 68 },
  { month: "Set", desembolsado: 4_310_000, contratos: 74 },
  { month: "Out", desembolsado: 4_580_000, contratos: 78 },
  { month: "Nov", desembolsado: 4_890_000, contratos: 82 },
  { month: "Dez", desembolsado: 5_120_000, contratos: 86 },
];

const monthlyPayments = [
  { month: "Jan", capital: 1_200_000, juros: 240_000 },
  { month: "Fev", capital: 1_380_000, juros: 275_000 },
  { month: "Mar", capital: 1_610_000, juros: 310_000 },
  { month: "Abr", capital: 1_820_000, juros: 342_000 },
  { month: "Mai", capital: 1_940_000, juros: 368_000 },
  { month: "Jun", capital: 2_150_000, juros: 402_000 },
  { month: "Jul", capital: 2_310_000, juros: 431_000 },
  { month: "Ago", capital: 2_240_000, juros: 418_000 },
  { month: "Set", capital: 2_470_000, juros: 462_000 },
  { month: "Out", capital: 2_690_000, juros: 501_000 },
  { month: "Nov", capital: 2_820_000, juros: 528_000 },
  { month: "Dez", capital: 3_010_000, juros: 568_000 },
];

const newClientsMonthly = [
  { month: "Jan", novos: 34 },
  { month: "Fev", novos: 41 },
  { month: "Mar", novos: 39 },
  { month: "Abr", novos: 47 },
  { month: "Mai", novos: 52 },
  { month: "Jun", novos: 58 },
  { month: "Jul", novos: 62 },
  { month: "Ago", novos: 55 },
  { month: "Set", novos: 64 },
  { month: "Out", novos: 71 },
  { month: "Nov", novos: 78 },
  { month: "Dez", novos: 82 },
];

const loanStatusDistribution = [
  { name: "Activo", value: 487, color: "hsl(var(--primary))" },
  { name: "Pendente", value: 34, color: "hsl(var(--warning))" },
  { name: "Aprovado", value: 128, color: "hsl(var(--accent))" },
  { name: "Em atraso", value: 58, color: "hsl(var(--destructive))" },
  { name: "Liquidado", value: 312, color: "hsl(var(--success))" },
  { name: "Rejeitado", value: 41, color: "hsl(var(--muted-foreground))" },
];

type LoanState =
  | "PENDENTE"
  | "EM_ANALISE"
  | "APROVADO"
  | "DESEMBOLSADO"
  | "ACTIVO"
  | "LIQUIDADO"
  | "EM_ATRASO"
  | "REJEITADO";

interface LoanRow {
  processo: string;
  cliente: string;
  valor: number;
  prazo: number;
  estado: LoanState;
  data: string;
}

const latestLoans: LoanRow[] = [
  { processo: "PROC-2026-01048", cliente: "Maria Machava", valor: 75_000, prazo: 12, estado: "PENDENTE", data: "2026-07-21T09:12:00Z" },
  { processo: "PROC-2026-01047", cliente: "João Nhaca", valor: 150_000, prazo: 24, estado: "EM_ANALISE", data: "2026-07-21T08:47:00Z" },
  { processo: "PROC-2026-01046", cliente: "Alberto Cossa", valor: 45_000, prazo: 9, estado: "APROVADO", data: "2026-07-20T16:31:00Z" },
  { processo: "PROC-2026-01045", cliente: "Isabel Mahumane", valor: 200_000, prazo: 36, estado: "DESEMBOLSADO", data: "2026-07-20T14:05:00Z" },
  { processo: "PROC-2026-01044", cliente: "Carlos Sitoe", valor: 30_000, prazo: 6, estado: "REJEITADO", data: "2026-07-20T11:22:00Z" },
  { processo: "PROC-2026-01043", cliente: "Fátima Muchanga", valor: 90_000, prazo: 18, estado: "ACTIVO", data: "2026-07-19T15:44:00Z" },
  { processo: "PROC-2026-01042", cliente: "Bruno Chissano", valor: 60_000, prazo: 12, estado: "EM_ATRASO", data: "2026-07-19T10:18:00Z" },
  { processo: "PROC-2026-01041", cliente: "Rosa Tembe", valor: 120_000, prazo: 24, estado: "LIQUIDADO", data: "2026-07-18T17:02:00Z" },
];

interface PaymentRow {
  recibo: string;
  cliente: string;
  processo: string;
  valor: number;
  metodo: "M-Pesa" | "e-Mola" | "Transferência" | "Numerário";
  data: string;
}

const latestPayments: PaymentRow[] = [
  { recibo: "REC-2026-08321", cliente: "Rosa Tembe", processo: "PROC-2026-01041", valor: 12_500, metodo: "M-Pesa", data: "2026-07-22T10:14:00Z" },
  { recibo: "REC-2026-08320", cliente: "Fátima Muchanga", processo: "PROC-2026-01043", valor: 8_750, metodo: "e-Mola", data: "2026-07-22T09:41:00Z" },
  { recibo: "REC-2026-08319", cliente: "Isabel Mahumane", processo: "PROC-2026-01045", valor: 22_000, metodo: "Transferência", data: "2026-07-22T08:29:00Z" },
  { recibo: "REC-2026-08318", cliente: "Alberto Cossa", processo: "PROC-2026-01046", valor: 5_600, metodo: "M-Pesa", data: "2026-07-21T17:58:00Z" },
  { recibo: "REC-2026-08317", cliente: "Bruno Chissano", processo: "PROC-2026-01042", valor: 6_200, metodo: "Numerário", data: "2026-07-21T16:12:00Z" },
  { recibo: "REC-2026-08316", cliente: "João Nhaca", processo: "PROC-2026-01047", valor: 15_800, metodo: "Transferência", data: "2026-07-21T14:03:00Z" },
  { recibo: "REC-2026-08315", cliente: "Maria Machava", processo: "PROC-2026-01048", valor: 9_400, metodo: "M-Pesa", data: "2026-07-21T11:47:00Z" },
];

const stateStyle: Record<LoanState, string> = {
  PENDENTE: "bg-warning/15 text-warning hover:bg-warning/15",
  EM_ANALISE: "bg-accent/15 text-accent hover:bg-accent/15",
  APROVADO: "bg-primary/10 text-primary hover:bg-primary/10",
  DESEMBOLSADO: "bg-success/15 text-success hover:bg-success/15",
  ACTIVO: "bg-primary/10 text-primary hover:bg-primary/10",
  LIQUIDADO: "bg-success/15 text-success hover:bg-success/15",
  EM_ATRASO: "bg-destructive/15 text-destructive hover:bg-destructive/15",
  REJEITADO: "bg-destructive/15 text-destructive hover:bg-destructive/15",
};

const stateLabel: Record<LoanState, string> = {
  PENDENTE: "Pendente",
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  DESEMBOLSADO: "Desembolsado",
  ACTIVO: "Activo",
  LIQUIDADO: "Liquidado",
  EM_ATRASO: "Em atraso",
  REJEITADO: "Rejeitado",
};

interface Alert {
  id: string;
  tipo: "PARCELA" | "CONTRATO" | "DOCUMENTO";
  titulo: string;
  detalhe: string;
  ref: string;
  data: string;
  severidade: "alta" | "media" | "baixa";
}

const alerts: Alert[] = [
  { id: "a1", tipo: "PARCELA", titulo: "Parcela vencida há 12 dias", detalhe: "Bruno Chissano · MZN 6.200", ref: "PROC-2026-01042", data: "2026-07-10T00:00:00Z", severidade: "alta" },
  { id: "a2", tipo: "PARCELA", titulo: "Parcela vencida há 5 dias", detalhe: "Nélson Cuna · MZN 3.850", ref: "PROC-2026-00987", data: "2026-07-17T00:00:00Z", severidade: "media" },
  { id: "a3", tipo: "PARCELA", titulo: "Parcela vencida há 2 dias", detalhe: "Aurora Sitoe · MZN 4.100", ref: "PROC-2026-01003", data: "2026-07-20T00:00:00Z", severidade: "baixa" },
  { id: "a4", tipo: "CONTRATO", titulo: "Contrato por assinar", detalhe: "Maria Machava · aguarda assinatura digital", ref: "PROC-2026-01048", data: "2026-07-21T00:00:00Z", severidade: "media" },
  { id: "a5", tipo: "CONTRATO", titulo: "Contrato por assinar", detalhe: "Alberto Cossa · aguarda assinatura do gestor", ref: "PROC-2026-01046", data: "2026-07-20T00:00:00Z", severidade: "baixa" },
  { id: "a6", tipo: "DOCUMENTO", titulo: "BI em falta", detalhe: "João Nhaca · documento pendente de upload", ref: "PROC-2026-01047", data: "2026-07-21T00:00:00Z", severidade: "alta" },
  { id: "a7", tipo: "DOCUMENTO", titulo: "Comprovativo de residência expirado", detalhe: "Isabel Mahumane", ref: "PROC-2026-01045", data: "2026-07-19T00:00:00Z", severidade: "media" },
];

const chartTooltip = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: 12,
  },
};

const severityStyle: Record<Alert["severidade"], string> = {
  alta: "bg-destructive/10 text-destructive border-destructive/30",
  media: "bg-warning/10 text-warning border-warning/30",
  baixa: "bg-muted text-muted-foreground border-border",
};

const alertIcon = {
  PARCELA: AlertTriangle,
  CONTRATO: FileWarning,
  DOCUMENTO: ShieldAlert,
} as const;

function AlertsList({ items, title, description, icon: Icon }: {
  items: Alert[];
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Icon className="h-4 w-4" />
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="secondary" className="font-mono">
            {items.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((a) => {
          const AIcon = alertIcon[a.tipo];
          return (
            <div
              key={a.id}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3",
                severityStyle[a.severidade],
              )}
            >
              <AIcon className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{a.titulo}</p>
                <p className="text-xs opacity-80 mt-0.5 truncate">{a.detalhe}</p>
                <p className="text-[10px] font-mono opacity-60 mt-1">
                  {a.ref} · {formatDate(a.data)}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const parcelasVencidas = alerts.filter((a) => a.tipo === "PARCELA");
  const contratosPendentes = alerts.filter((a) => a.tipo === "CONTRATO");
  const documentosPendentes = alerts.filter((a) => a.tipo === "DOCUMENTO");

  return (
    <>
      <PageHeader
        title="Dashboard Executivo"
        description="Visão consolidada da carteira, cobrança e risco da JCF Microcrédito."
      />

      {/* KPIs — Clientes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total de Clientes"
          value={formatNumber(kpis.totalClientes)}
          trend={`+${kpis.clientesNovosMes} este mês`}
          icon={Users}
        />
        <KpiCard
          label="Clientes Activos"
          value={formatNumber(kpis.clientesActivos)}
          trend={`${((kpis.clientesActivos / kpis.totalClientes) * 100).toFixed(1)}% da base`}
          icon={UserCheck}
          tone="success"
        />
        <KpiCard
          label="Empréstimos Activos"
          value={formatNumber(kpis.emprestimosActivos)}
          trend="Contratos em curso"
          icon={BadgeCheck}
          tone="success"
        />
        <KpiCard
          label="Empréstimos Pendentes"
          value={formatNumber(kpis.emprestimosPendentes)}
          trend="A aguardar análise"
          icon={Clock}
          tone="warning"
        />
        <KpiCard
          label="Empréstimos Aprovados"
          value={formatNumber(kpis.emprestimosAprovados)}
          trend="A aguardar desembolso"
          icon={CheckCircle2}
          tone="success"
        />
        <KpiCard
          label="Empréstimos Rejeitados"
          value={formatNumber(kpis.emprestimosRejeitados)}
          trend="Últimos 12 meses"
          icon={XCircle}
          tone="danger"
        />
        <KpiCard
          label="Valor Desembolsado"
          value={formatMZN(kpis.valorDesembolsado)}
          trend="Acumulado do ano"
          icon={HandCoins}
        />
        <KpiCard
          label="Valor Recuperado"
          value={formatMZN(kpis.valorRecuperado)}
          trend="Capital cobrado"
          icon={PiggyBank}
          tone="success"
        />
        <KpiCard
          label="Receita de Juros"
          value={formatMZN(kpis.receitaJuros)}
          trend="Rendimento acumulado"
          icon={Coins}
        />
        <KpiCard
          label="PAR30"
          value={`${kpis.par30.toFixed(1)}%`}
          trend="Carteira em risco > 30 dias"
          icon={TrendingUp}
          tone="warning"
        />
        <KpiCard
          label="PAR90"
          value={`${kpis.par90.toFixed(1)}%`}
          trend="Carteira em risco > 90 dias"
          icon={AlertTriangle}
          tone="danger"
        />
        <KpiCard
          label="Taxa de Inadimplência"
          value={`${kpis.inadimplencia.toFixed(1)}%`}
          trend="Contratos com atraso > 1 dia"
          icon={TrendingDown}
          tone="danger"
        />
      </div>

      {/* Gráficos linha superior */}
      <div className="grid gap-4 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução mensal dos empréstimos</CardTitle>
            <CardDescription>Valor desembolsado nos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyLoans}>
                <defs>
                  <linearGradient id="gradLoans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  {...chartTooltip}
                  formatter={(v: number, name) =>
                    name === "Desembolsado" ? formatMZN(v) : formatNumber(v)
                  }
                />
                <Area
                  type="monotone"
                  dataKey="desembolsado"
                  name="Desembolsado"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  fill="url(#gradLoans)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução mensal dos pagamentos</CardTitle>
            <CardDescription>Capital e juros recebidos</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPayments}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip {...chartTooltip} formatter={(v: number) => formatMZN(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="capital" name="Capital" stackId="p" fill="hsl(var(--primary))" />
                <Bar dataKey="juros" name="Juros" stackId="p" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por estado + Novos clientes */}
      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Distribuição dos estados dos empréstimos</CardTitle>
            <CardDescription>Composição actual da carteira</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip {...chartTooltip} formatter={(v: number) => formatNumber(v)} />
                <Pie
                  data={loanStatusDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {loanStatusDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Novos clientes por mês
            </CardTitle>
            <CardDescription>Aquisição de clientes nos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={newClientsMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip {...chartTooltip} formatter={(v: number) => formatNumber(v)} />
                <Line
                  type="monotone"
                  dataKey="novos"
                  name="Novos clientes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <AlertsList
          items={parcelasVencidas}
          title="Parcelas vencidas"
          description="Cobranças em atraso a acompanhar"
          icon={AlertTriangle}
        />
        <AlertsList
          items={contratosPendentes}
          title="Contratos pendentes"
          description="A aguardar assinatura ou aprovação"
          icon={FileWarning}
        />
        <AlertsList
          items={documentosPendentes}
          title="Documentos pendentes"
          description="Ficheiros em falta ou expirados"
          icon={ShieldAlert}
        />
      </div>

      {/* Tabelas — Últimos empréstimos & pagamentos */}
      <div className="grid gap-4 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Últimos empréstimos</CardTitle>
            <CardDescription>Solicitações e contratos mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Processo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestLoans.map((r) => (
                    <TableRow key={r.processo}>
                      <TableCell className="font-mono text-xs">{r.processo}</TableCell>
                      <TableCell className="font-medium">{r.cliente}</TableCell>
                      <TableCell className="text-right font-mono">{formatMZN(r.valor)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("font-medium", stateStyle[r.estado])}>
                          {stateLabel[r.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(r.data)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos pagamentos</CardTitle>
            <CardDescription>Recibos mais recentes registados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recibo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestPayments.map((p) => (
                    <TableRow key={p.recibo}>
                      <TableCell className="font-mono text-xs">{p.recibo}</TableCell>
                      <TableCell className="font-medium">{p.cliente}</TableCell>
                      <TableCell className="text-right font-mono">{formatMZN(p.valor)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {p.metodo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDateTime(p.data)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
