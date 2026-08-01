import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Download, Eye } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { StatusPill } from "../components/StatusPill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { loansService } from "../api/backoffice";
import { boProdutos, type BoLoan } from "../mock/backoffice";
import { formatMZN } from "../utils/format";
import { exportToCsv } from "../utils/export";

export default function LoanManagementPage() {
  const navigate = useNavigate();
  const { data = [] } = useQuery({ queryKey: ["bo-loans"], queryFn: loansService.list });
  const [estado, setEstado] = useState("all");
  const [produto, setProduto] = useState("all");

  const filtered = useMemo(
    () =>
      data.filter(
        (l) => (estado === "all" || l.estado === estado) && (produto === "all" || l.produto === produto),
      ),
    [data, estado, produto],
  );

  const columns: Column<BoLoan>[] = [
    { key: "processo", header: "Processo", render: (l) => <span className="font-mono text-xs text-primary">{l.processo}</span> },
    { key: "cliente", header: "Cliente", render: (l) => <span className="font-medium">{l.cliente}</span> },
    { key: "produto", header: "Produto", render: (l) => l.produto },
    { key: "valor", header: "Valor", className: "text-right", render: (l) => <span className="font-mono">{formatMZN(l.valor)}</span> },
    { key: "juros", header: "Juros", className: "text-right", render: (l) => `${l.taxaJuros}%` },
    {
      key: "parcelas",
      header: "Parcelas",
      render: (l) => (
        <div className="w-28">
          <p className="text-xs mb-1">{l.parcelasPagas}/{l.parcelasTotal}</p>
          <Progress value={(l.parcelasPagas / l.parcelasTotal) * 100} className="h-1.5" />
        </div>
      ),
    },
    { key: "estado", header: "Status", render: (l) => <StatusPill status={l.estado} /> },
    {
      key: "acoes",
      header: "Ações",
      className: "text-right",
      render: (l) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/app/loans/${l.processo}`);
          }}
        >
          <Eye className="h-4 w-4 mr-1" /> Ver
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Gestão de Empréstimos"
        description="Carteira completa de empréstimos por produto, estado e desempenho."
      />
      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(l) => l.id}
        searchKeys={(l) => [l.processo, l.cliente, l.produto]}
        searchPlaceholder="Pesquisar por processo, cliente ou produto..."
        onRowClick={(l) => navigate(`/app/loans/${l.processo}`)}
        caption="Lista de empréstimos"
        filters={
          <>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="ATIVO">Ativo</SelectItem>
                <SelectItem value="EM_ATRASO">Em atraso</SelectItem>
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="LIQUIDADO">Liquidado</SelectItem>
                <SelectItem value="CANCELADO">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={produto} onValueChange={setProduto}>
              <SelectTrigger className="w-[170px]"><SelectValue placeholder="Produto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os produtos</SelectItem>
                {boProdutos.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <Button
            variant="outline"
            onClick={() =>
              exportToCsv(
                "emprestimos.csv",
                filtered.map((l) => ({
                  processo: l.processo, cliente: l.cliente, produto: l.produto,
                  valor: l.valor, juros: l.taxaJuros, estado: l.estado,
                })),
              )
            }
          >
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
        }
      />
    </>
  );
}
