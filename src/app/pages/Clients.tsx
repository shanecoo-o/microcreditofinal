import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Download, Eye } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { DataTable, type Column } from "../components/DataTable";
import { StatusPill, ScorePill } from "../components/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { clientsService } from "../api/backoffice";
import { boFiliais, type Client } from "../mock/backoffice";
import { formatMZN } from "../utils/format";
import { exportToCsv } from "../utils/export";

export default function ClientsPage() {
  const navigate = useNavigate();
  const { data = [] } = useQuery({ queryKey: ["clients"], queryFn: clientsService.list });
  const [estado, setEstado] = useState("all");
  const [filial, setFilial] = useState("all");

  const filtered = useMemo(
    () =>
      data.filter(
        (c) =>
          (estado === "all" || c.estado === estado) &&
          (filial === "all" || c.filial === filial),
      ),
    [data, estado, filial],
  );

  const columns: Column<Client>[] = [
    { key: "nome", header: "Nome", render: (c) => <span className="font-medium">{c.nome}</span> },
    { key: "contacto", header: "Contacto", render: (c) => <span className="text-sm">{c.telefone}</span> },
    { key: "bi", header: "BI", render: (c) => <span className="font-mono text-xs">{c.bi}</span> },
    { key: "nuit", header: "NUIT", render: (c) => <span className="font-mono text-xs">{c.nuit}</span> },
    { key: "estado", header: "Estado", render: (c) => <StatusPill status={c.estado} /> },
    { key: "score", header: "Score", render: (c) => <ScorePill score={c.score} /> },
    { key: "total", header: "Empréstimos", className: "text-right", render: (c) => c.totalEmprestimos },
    {
      key: "saldo",
      header: "Saldo devedor",
      className: "text-right",
      render: (c) => <span className="font-mono">{formatMZN(c.saldoDevedor)}</span>,
    },
    {
      key: "acoes",
      header: "Ações",
      className: "text-right",
      render: (c) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/app/admin/clients/${c.id}`);
          }}
        >
          <Eye className="h-4 w-4 mr-1" /> Cliente 360°
        </Button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Gestão de Clientes"
        description="Base de clientes, score de risco e exposição por cliente."
      />
      <DataTable
        data={filtered}
        columns={columns}
        rowKey={(c) => c.id}
        searchKeys={(c) => [c.nome, c.bi, c.nuit, c.telefone, c.email]}
        searchPlaceholder="Pesquisar por nome, BI, NUIT ou contacto..."
        onRowClick={(c) => navigate(`/app/admin/clients/${c.id}`)}
        caption="Lista de clientes"
        filters={
          <>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="ACTIVE">Ativo</SelectItem>
                <SelectItem value="INACTIVE">Inativo</SelectItem>
                <SelectItem value="BLOCKED">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filial} onValueChange={setFilial}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filial" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as filiais</SelectItem>
                {boFiliais.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
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
                "clientes.csv",
                filtered.map((c) => ({
                  nome: c.nome, bi: c.bi, nuit: c.nuit, telefone: c.telefone,
                  estado: c.estado, score: c.score, saldo: c.saldoDevedor,
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
