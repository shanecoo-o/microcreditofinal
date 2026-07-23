import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMZN } from "../utils/format";
import { reportsApi, transactionsApi } from "../api/client";
import { exportToCsv, exportToPdf } from "../utils/export";

export default function ReportsPage() {
  const { data: series = [] } = useQuery({
    queryKey: ["series"],
    queryFn: reportsApi.series,
  });
  const { data: tx = [] } = useQuery({
    queryKey: ["tx-all"],
    queryFn: () => transactionsApi.list(),
  });

  const rows = tx.map((t) => ({
    id: t.id,
    tipo: t.type,
    estado: t.status,
    valor: t.amount,
    data: new Date(t.createdAt).toLocaleDateString("pt-PT"),
  }));

  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Análise financeira e exportação de dados."
        actions={
          <>
            <Button variant="outline" onClick={() => exportToCsv("relatorio.csv", rows)}>
              <Download className="h-4 w-4 mr-2" /> CSV
            </Button>
            <Button variant="outline" onClick={() => exportToPdf("Relatório", rows)}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
          </>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Volume acumulado (MZN)</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                }}
                formatter={(v: number) => formatMZN(v)}
              />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                fill="url(#v)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
