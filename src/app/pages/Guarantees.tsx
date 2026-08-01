import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { StatusPill } from "../components/StatusPill";
import { KpiCard } from "../components/KpiCard";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, XCircle, Coins } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { guaranteesService } from "../api/backoffice";
import type { Guarantee } from "../mock/backoffice";
import { formatDate, formatMZN } from "../utils/format";
import { exportToCsv } from "../utils/export";

export default function GuaranteesPage() {
  const { data = [] } = useQuery({ queryKey: ["guarantees"], queryFn: guaranteesService.list });
  const [estado, setEstado] = useState("all");
  const [tipo, setTipo] = useState("all");

  const tipos = useMemo(() => [...new Set(data.map((g) => g.tipo))], [data]);
  const filtered = useMemo(
    () => data.filter((g) => (estado === "all" || g.estado === estado) && (tipo === "all" || g.tipo === tipo)),
    [data, estado, tipo],
  );

  const columns: Column<Guarantee>[] = [
    {
      key: "foto",
      header: "Bem",
      render: (g) => (
        <img src={g.foto} alt={`Garantia ${g.tipo}`} loading="lazy" className="h-10 w-16 rounded object-cover" />
      ),
    },
    { key: "tipo", header: "Tipo", render: (g) => <span className="font-medium">{g.tipo}</span> },
    { key: "descricao", header: "Descrição", className: "max-w-[280px] truncate whitespace-normal", render: (g) => g.descricao },
    { key: "cliente", header: "Cliente", render: (g) => g.cliente },
    { key: "processo", header: "Processo", render: (g) => <span className="font-mono text-xs text-primary">{g.processo}</span> },
    { key: "valor", header: "Valor estimado", className: "text-right", render: (g) => <span className="font-mono">{formatMZN(g.valorEstimado)}</span> },
    { key: "avaliador", header: "Avaliador", render: (g) => g.avaliador },
    { key: "data", header: "Data", render: (g) => formatDate(g.data) },
    { key: "estado", header: "Estado", render: (g) => <StatusPill status={g.estado} /> },
  ];

  const total = filtered.reduce((a, g) => a + g.valorEstimado, 0);

  return (
    <>
      <PageHeader title="Gestão de Garantias" description="Bens dados em garantia, avaliações e cobertura da carteira." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard label="Valor em garantias" value={formatMZN(total)} icon={Coins} tone="success" />
        <KpiCard label="Avaliadas" value={data.filter((g) => g.estado === "AVALIADA").length} icon={ShieldCheck} />
        <KpiCard label="Pendentes" value={data.filter((g) => g.estado === "PENDENTE").length} icon={Clock} tone="warning" />
        <KpiCard label="Rejeitadas" value={data.filter((g) => g.estado === "REJEITADA").length} icon={XCircle} tone="danger" />
      </div>

      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(g) => g.id}
        searchKeys={(g) => [g.tipo, g.descricao, g.cliente, g.processo]}
        searchPlaceholder="Pesquisar por tipo, cliente ou processo..."
        caption="Lista de garantias"
        filters={
          <>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="AVALIADA">Avaliada</SelectItem>
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="REJEITADA">Rejeitada</SelectItem>
                <SelectItem value="LIBERTADA">Libertada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {tipos.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <Button variant="outline" onClick={() => exportToCsv("garantias.csv", filtered.map((g) => ({
            tipo: g.tipo, cliente: g.cliente, processo: g.processo, valor: g.valorEstimado, estado: g.estado,
          })))}>
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
        }
      />
    </>
  );
}
