import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Download, Phone, TrendingDown, Users } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { KpiCard } from "../components/KpiCard";
import { StatusPill } from "../components/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { collectionsService } from "../api/backoffice";
import type { CollectionItem } from "../mock/backoffice";
import { formatDate, formatMZN } from "../utils/format";
import { exportToCsv } from "../utils/export";

const buckets = [
  { key: "1-30", label: "1-30 dias", test: (d: number) => d <= 30 },
  { key: "31-60", label: "31-60 dias", test: (d: number) => d > 30 && d <= 60 },
  { key: "61-90", label: "61-90 dias", test: (d: number) => d > 60 && d <= 90 },
  { key: "90+", label: "+90 dias", test: (d: number) => d > 90 },
];

export default function CollectionsPage() {
  const { data = [] } = useQuery({ queryKey: ["collections"], queryFn: collectionsService.list });
  const [prioridade, setPrioridade] = useState("all");
  const [bucket, setBucket] = useState("all");

  const filtered = useMemo(
    () =>
      data.filter((c) => {
        const b = buckets.find((x) => x.key === bucket);
        return (
          (prioridade === "all" || c.prioridade === prioridade) && (!b || b.test(c.diasAtraso))
        );
      }),
    [data, prioridade, bucket],
  );

  const emRisco = data.reduce((a, c) => a + c.valor, 0);

  const columns: Column<CollectionItem>[] = [
    { key: "cliente", header: "Cliente", render: (c) => <span className="font-medium">{c.cliente}</span> },
    { key: "processo", header: "Processo", render: (c) => <span className="font-mono text-xs text-primary">{c.processo}</span> },
    { key: "parcela", header: "Parcela", render: (c) => c.parcela },
    {
      key: "dias",
      header: "Dias em atraso",
      className: "text-right",
      render: (c) => (
        <span className={c.diasAtraso > 90 ? "text-destructive font-semibold" : c.diasAtraso > 30 ? "text-warning font-medium" : ""}>
          {c.diasAtraso}
        </span>
      ),
    },
    { key: "valor", header: "Valor", className: "text-right", render: (c) => <span className="font-mono">{formatMZN(c.valor)}</span> },
    { key: "prioridade", header: "Prioridade", render: (c) => <StatusPill status={c.prioridade} /> },
    { key: "responsavel", header: "Responsável", render: (c) => c.responsavel },
    { key: "ultimo", header: "Último contacto", render: (c) => formatDate(c.ultimoContacto) },
    {
      key: "acoes",
      header: "Ações",
      className: "text-right",
      render: (c) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => { e.stopPropagation(); toast.success(`Contacto registado para ${c.cliente} (${c.telefone}).`); }}
        >
          <Phone className="h-4 w-4 mr-1" /> Contactar
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Cobrança" description="Parcelas em atraso priorizadas por risco e antiguidade." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard label="Valor em atraso" value={formatMZN(emRisco)} icon={TrendingDown} tone="danger" />
        <KpiCard label="Casos críticos" value={data.filter((c) => c.prioridade === "CRITICA").length} icon={AlertTriangle} tone="danger" />
        <KpiCard label="Casos abertos" value={data.length} icon={Users} tone="warning" />
        <KpiCard label="Atraso médio (dias)" value={Math.round(data.reduce((a, c) => a + c.diasAtraso, 0) / (data.length || 1))} icon={TrendingDown} tone="warning" />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(c) => c.id}
        searchKeys={(c) => [c.cliente, c.processo, c.responsavel]}
        searchPlaceholder="Pesquisar por cliente, processo ou responsável..."
        caption="Casos de cobrança"
        filters={
          <>
            <Select value={prioridade} onValueChange={setPrioridade}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Prioridade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="CRITICA">Crítica</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
                <SelectItem value="MEDIA">Média</SelectItem>
                <SelectItem value="BAIXA">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={bucket} onValueChange={setBucket}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Antiguidade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os prazos</SelectItem>
                {buckets.map((b) => <SelectItem key={b.key} value={b.key}>{b.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <Button variant="outline" onClick={() => exportToCsv("cobranca.csv", filtered.map((c) => ({
            cliente: c.cliente, processo: c.processo, parcela: c.parcela,
            dias: c.diasAtraso, valor: c.valor, prioridade: c.prioridade,
          })))}>
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
        }
      />
    </>
  );
}
