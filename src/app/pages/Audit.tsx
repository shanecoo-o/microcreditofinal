import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auditApi } from "../api/client";
import { formatDateTime } from "../utils/format";
import { exportToCsv } from "../utils/export";

export default function AuditPage() {
  const { data = [] } = useQuery({ queryKey: ["audit"], queryFn: auditApi.list });

  return (
    <>
      <PageHeader
        title="Auditoria"
        description="Registo cronológico de ações realizadas na plataforma."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              exportToCsv(
                "auditoria.csv",
                data.map((a) => ({
                  data: formatDateTime(a.createdAt),
                  utilizador: a.user,
                  acao: a.action,
                  modulo: a.module,
                  ip: a.ip,
                })),
              )
            }
          >
            <Download className="h-4 w-4 mr-2" /> Exportar
          </Button>
        }
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Utilizador</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>IP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(a.createdAt)}
                </TableCell>
                <TableCell>{a.user}</TableCell>
                <TableCell className="font-mono text-xs">{a.action}</TableCell>
                <TableCell>{a.module}</TableCell>
                <TableCell className="font-mono text-xs">{a.ip}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
