import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime, formatMZN } from "../utils/format";
import { transactionsApi } from "../api/client";
import { exportToCsv, exportToPdf } from "../utils/export";
import type { Transaction } from "../types";

export default function TransactionsPage() {
  const [status, setStatus] = useState<Transaction["status"] | "ALL">("ALL");
  const [type, setType] = useState<Transaction["type"] | "ALL">("ALL");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data = [] } = useQuery({
    queryKey: ["transactions", { status, type, from, to }],
    queryFn: () =>
      transactionsApi.list({
        status,
        type,
        from: from ? new Date(from).toISOString() : undefined,
        to: to ? new Date(to).toISOString() : undefined,
      }),
  });

  const rows = data.map((t) => ({
    id: t.id,
    tipo: t.type,
    estado: t.status,
    valor: t.amount,
    data: formatDateTime(t.createdAt),
  }));

  return (
    <>
      <PageHeader
        title="Transações"
        description="Histórico e monitorização de todos os movimentos."
        actions={
          <>
            <Button variant="outline" onClick={() => exportToCsv("transacoes.csv", rows)}>
              <Download className="h-4 w-4 mr-2" /> CSV
            </Button>
            <Button variant="outline" onClick={() => exportToPdf("Transações", rows)}>
              <Download className="h-4 w-4 mr-2" /> PDF
            </Button>
          </>
        }
      />

      <Card className="p-4 mb-4 grid gap-3 md:grid-cols-4">
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["ALL", "DEPOSIT", "WITHDRAW", "TRANSFER", "PAYMENT"].map((t) => (
              <SelectItem key={t} value={t}>
                {t === "ALL" ? "Todos os tipos" : t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["ALL", "PENDING", "COMPLETED", "FAILED"].map((s) => (
              <SelectItem key={s} value={s}>
                {s === "ALL" ? "Todos os estados" : s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Sem transações.
                </TableCell>
              </TableRow>
            )}
            {data.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs">{t.id}</TableCell>
                <TableCell>{t.type}</TableCell>
                <TableCell>
                  <StatusBadge status={t.status} />
                </TableCell>
                <TableCell className="text-right font-mono">{formatMZN(t.amount)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(t.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
