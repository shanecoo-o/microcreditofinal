import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
  Clock,
  Coins,
  HandCoins,
  PiggyBank,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { KpiCard } from "../components/KpiCard";
import {
  Card,
  CardContent,
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
import { formatDate, formatMZN, formatNumber } from "../utils/format";

/* ================= MOCK DATA ================= */

const kpis = {
  totalClientes: 1284,
  clientesNovosMes: 62,
  emprestimosActivos: 487,
  emprestimosPendentes: 34,
  valorDesembolsado: 42_580_000,
  valorRecuperado: 28_190_000,
  receitaJuros: 3_845_000,
  par30: 4.7,
  par90: 1.9,
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

const paymentsReceived = [
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

const loanStatusDistribution = [
  { name: "Activo", value: 487, color: "hsl(var(--primary))" },
  { name: "Pendente", value: 34, color: "hsl(var(--warning))" },
  { name: "Em atraso", value: 58, color: "hsl(var(--destructive))" },
  { name: "Liquidado", value: 312, color: "hsl(var(--success))" },
  { name: "Rejeitado", value: 41, color: "hsl(var(--muted-foreground))" },
];

type LoanState =
  | "PENDENTE"
  | "EM_ANALISE"
  | "APROVADO"
  | "DESEMBOLSADO"
  | "REJEITADO";

interface LoanRequest {
  processo: string;
  cliente: string;
  valor: number;
  prazo: number;
  estado: LoanState;
  data: string;
}

const latestRequests: LoanRequest[] = [
  { processo: "PROC-2026-01048", cliente: "Maria Machava", valor: 75_000, prazo: 12, estado: "PENDENTE", data: "2026-07-21T09:12:00Z" },
  { processo: "PROC-2026-01047", cliente: "João Nhaca", valor: 150_000, prazo: 24, estado: "EM_ANALISE", data: "2026-07-21T08:47:00Z" },
  { processo: "PROC-2026-01046", cliente: "Alberto Cossa", valor: 45_000, prazo: 9, estado: "APROVADO", data: "2026-07-20T16:31:00Z" },
  { processo: "PROC-2026-01045", cliente: "Isabel Mahumane", valor: 200_000, prazo: 36, estado: "DESEMBOLSADO", data: "2026-07-20T14:05:00Z" },
  { processo: "PROC-2026-01044", cliente: "Carlos Sitoe", valor: 30_000, prazo: 6, estado: "REJEITADO", data: "2026-07-20T11:22:00Z" },
  { processo: "PROC-2026-01043", cliente: "Fátima Muchanga", valor: 90_000, prazo: 18, estado: "APROVADO", data: "2026-07-19T15:44:00Z" },
  { processo: "PROC-2026-01042", cliente: "Bruno Chissano", valor: 60_000, prazo: 12, estado: "EM_ANALISE", data: "2026-07-19T10:18:00Z" },
  { processo: "PROC-2026-01041", cliente: "Rosa Tembe", valor: 120_000, prazo: 24, estado: "DESEMBOLSADO", data: "2026-07-18T17:02:00Z" },
];

const stateStyle: Record<LoanState, string> = {
  PENDENTE: "bg-warning/15 text-warning hover:bg-warning/15",
  EM_ANALISE: "bg-accent/15 text-accent hover:bg-accent/15",
  APROVADO: "bg-primary/10 text-primary hover:bg-primary/10",
  DESEMBOLSADO: "bg-success/15 text-success hover:bg-success/15",
  REJEITADO: "bg-destructive/15 text-destructive hover:bg-destructive/15",
};

const stateLabel: Record<LoanState, string> = {
  PENDENTE: "Pendente",
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  DESEMBOLSADO: "Desembolsado",
  REJEITADO: "Rejeitado",
};

const chartTooltip = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontSize: 12,
  },
};

export default function AdminDashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard Executivo"
        description="Visão consolidada da carteira, cobrança e risco da JCF Microcrédito."
      />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total de Clientes"
          value={formatNumber(kpis.totalClientes)}
          trend={`+${kpis.clientesNovosMes} este mês`}
          icon={Users}
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
      </div>

      {/* Gráficos linha superior */}
      <div className="grid gap-4 lg:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução mensal dos empréstimos</CardTitle>
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
                    name === "desembolsado" ? formatMZN(v) : formatNumber(v)
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
            <CardTitle>Pagamentos recebidos</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentsReceived}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip {...chartTooltip} formatter={(v: number) => formatMZN(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="capital" name="Capital" stackId="p" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="juros" name="Juros" stackId="p" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por estado + Últimas solicitações */}
      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Distribuição por estado</CardTitle>
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
            <CardTitle>Últimas Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Processo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Prazo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestRequests.map((r) => (
                    <TableRow key={r.processo}>
                      <TableCell className="font-mono text-xs">{r.processo}</TableCell>
                      <TableCell className="font-medium">{r.cliente}</TableCell>
                      <TableCell className="text-right font-mono">{formatMZN(r.valor)}</TableCell>
                      <TableCell className="text-right">{r.prazo} meses</TableCell>
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
      </div>
    </>
  );
}
