import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { StatusPill } from "../components/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { contractsService } from "../api/backoffice";
import type { Contract } from "../mock/backoffice";
import { formatDate, formatMZN } from "../utils/format";
import { exportToCsv, exportToPdf } from "../utils/export";

export default function ContractsPage() {
  const { data = [] } = useQuery({ queryKey: ["contracts"], queryFn: contractsService.list });
  const [estado, setEstado] = useState("all");

  const filtered = useMemo(
    () => data.filter((c) => estado === "all" || c.estado === estado),
    [data, estado],
  );

  const downloadContract = (c: Contract) => {
    exportToPdf(`Contrato ${c.numero}`, [
      { Campo: "Número", Valor: c.numero },
      { Campo: "Processo", Valor: c.processo },
      { Campo: "Cliente", Valor: c.cliente },
      { Campo: "Valor", Valor: formatMZN(c.valor) },
      { Campo: "Data", Valor: formatDate(c.data) },
      { Campo: "Responsável", Valor: c.responsavel },
      { Campo: "Estado", Valor: c.estado },
    ]);
    toast.success(`Contrato ${c.numero} gerado em PDF.`);
  };

  const columns: Column<Contract>[] = [
    { key: "numero", header: "Nº Contrato", render: (c) => <span className="font-mono text-xs text-primary">{c.numero}</span> },
    { key: "cliente", header: "Cliente", render: (c) => <span className="font-medium">{c.cliente}</span> },
    { key: "processo", header: "Processo", render: (c) => <span className="font-mono text-xs">{c.processo}</span> },
    { key: "valor", header: "Valor", className: "text-right", render: (c) => <span className="font-mono">{formatMZN(c.valor)}</span> },
    { key: "data", header: "Data", render: (c) => formatDate(c.data) },
    { key: "responsavel", header: "Responsável", render: (c) => c.responsavel },
    { key: "estado", header: "Estado", render: (c) => <StatusPill status={c.estado} /> },
    {
      key: "acoes",
      header: "Ações",
      className: "text-right",
      render: (c) => (
        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); downloadContract(c); }}>
          <FileText className="h-4 w-4 mr-1" /> PDF
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader title="Gestão de Contratos" description="Contratos emitidos, estado de assinatura e geração de PDF." />
      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(c) => c.id}
        searchKeys={(c) => [c.numero, c.cliente, c.processo]}
        searchPlaceholder="Pesquisar por contrato, cliente ou processo..."
        caption="Lista de contratos"
        filters={
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger className="w-[190px]"><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os estados</SelectItem>
              <SelectItem value="RASCUNHO">Rascunho</SelectItem>
              <SelectItem value="AGUARDA_ASSINATURA">Aguarda assinatura</SelectItem>
              <SelectItem value="ATIVO">Ativo</SelectItem>
              <SelectItem value="ENCERRADO">Encerrado</SelectItem>
              <SelectItem value="CANCELADO">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        }
        actions={
          <Button variant="outline" onClick={() => exportToCsv("contratos.csv", filtered.map((c) => ({
            numero: c.numero, cliente: c.cliente, processo: c.processo, valor: c.valor, estado: c.estado,
          })))}>
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
        }
      />
    </>
  );
}
