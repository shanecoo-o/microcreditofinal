import { useQuery } from "@tanstack/react-query";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Banknote, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { KpiCard } from "../components/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { financeService } from "../api/backoffice";
import { formatMZN } from "../utils/format";

const axis = { stroke: "hsl(var(--muted-foreground))", fontSize: 12 };
const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  color: "hsl(var(--card-foreground))",
};
const fmtCompact = (v: number) => `${Math.round(v / 1000)}k`;

export default function FinancePage() {
  const { data: summary } = useQuery({ queryKey: ["finance-summary"], queryFn: financeService.summary });
  const { data: series = [] } = useQuery({ queryKey: ["finance-series"], queryFn: financeService.series });

  return (
    <>
      <PageHeader title="Financeiro" description="Fluxo de caixa, receitas, despesas e evolução da carteira." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
        <KpiCard label="Desembolsado" value={formatMZN(summary?.totalDesembolsado ?? 0)} icon={ArrowUpRight} />
        <KpiCard label="Recebimentos" value={formatMZN(summary?.recebimentos ?? 0)} icon={ArrowDownRight} tone="success" />
        <KpiCard label="Juros" value={formatMZN(summary?.juros ?? 0)} icon={TrendingUp} tone="success" />
        <KpiCard label="Despesas" value={formatMZN(summary?.despesas ?? 0)} icon={Banknote} tone="warning" />
        <KpiCard label="Resultado" value={formatMZN(summary?.receita ?? 0)} icon={PiggyBank} tone={(summary?.receita ?? 0) >= 0 ? "success" : "danger"} />
        <KpiCard label="Carteira ativa" value={formatMZN(summary?.carteiraAtiva ?? 0)} icon={Wallet} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Fluxo de caixa mensal</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" {...axis} />
                <YAxis {...axis} tickFormatter={fmtCompact} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatMZN(v)} />
                <Legend />
                <Bar name="Recebimentos" dataKey="recebimentos" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                <Bar name="Desembolsos" dataKey="desembolsos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Receita vs Despesas</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" {...axis} />
                <YAxis {...axis} tickFormatter={fmtCompact} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatMZN(v)} />
                <Legend />
                <Line name="Juros" type="monotone" dataKey="juros" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                <Line name="Despesas" type="monotone" dataKey="despesas" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Evolução da carteira</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <defs>
                  <linearGradient id="carteiraFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" {...axis} />
                <YAxis {...axis} tickFormatter={fmtCompact} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatMZN(v)} />
                <Area name="Carteira" type="monotone" dataKey="carteira" stroke="hsl(var(--primary))" fill="url(#carteiraFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
