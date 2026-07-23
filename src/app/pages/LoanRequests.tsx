import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search, X } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDate, formatMZN } from "../utils/format";
import {
  analistas,
  loanRequests,
  loanStateLabel,
  loanStateStyle,
  type LoanState,
} from "../mock/loanRequests";

const STATES: LoanState[] = [
  "PENDENTE",
  "EM_ANALISE",
  "APROVADO",
  "DESEMBOLSADO",
  "REJEITADO",
];

export default function LoanRequests() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<string>("ALL");
  const [analista, setAnalista] = useState<string>("ALL");
  const [dataFrom, setDataFrom] = useState<string>("");
  const [dataTo, setDataTo] = useState<string>("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return loanRequests.filter((r) => {
      if (estado !== "ALL" && r.estado !== estado) return false;
      if (analista !== "ALL" && r.analista !== analista) return false;
      if (dataFrom && new Date(r.data) < new Date(dataFrom)) return false;
      if (dataTo && new Date(r.data) > new Date(dataTo + "T23:59:59")) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.processo.toLowerCase().includes(q) &&
          !r.cliente.toLowerCase().includes(q) &&
          !r.telefone.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [estado, analista, dataFrom, dataTo, search]);

  const clearFilters = () => {
    setEstado("ALL");
    setAnalista("ALL");
    setDataFrom("");
    setDataTo("");
    setSearch("");
  };

  const hasFilters =
    estado !== "ALL" || analista !== "ALL" || dataFrom || dataTo || search;

  return (
    <>
      <PageHeader
        title="Solicitações de Crédito"
        description="Consulte, filtre e faça o seguimento dos pedidos de empréstimo."
      />

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por processo, cliente ou telefone"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os estados</SelectItem>
                {STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {loanStateLabel[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={analista} onValueChange={setAnalista}>
              <SelectTrigger>
                <SelectValue placeholder="Analista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os analistas</SelectItem>
                {analistas.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dataFrom}
              onChange={(e) => setDataFrom(e.target.value)}
              aria-label="Data de"
            />
            <Input
              type="date"
              value={dataTo}
              onChange={(e) => setDataTo(e.target.value)}
              aria-label="Data até"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              {filtered.length} de {loanRequests.length} solicitações
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-1" /> Limpar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº Processo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Prazo</TableHead>
                  <TableHead>Garantia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow
                    key={r.processo}
                    className="cursor-pointer"
                    onClick={() => navigate(`/app/admin/loan-requests/${r.processo}`)}
                  >
                    <TableCell className="font-mono text-xs">{r.processo}</TableCell>
                    <TableCell className="font-medium">{r.cliente}</TableCell>
                    <TableCell className="text-muted-foreground">{r.telefone}</TableCell>
                    <TableCell className="text-right font-mono">{formatMZN(r.valor)}</TableCell>
                    <TableCell className="text-right">{r.prazo} meses</TableCell>
                    <TableCell className="max-w-[220px] truncate" title={r.garantia}>
                      {r.garantia}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("font-medium", loanStateStyle[r.estado])}>
                        {loanStateLabel[r.estado]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(r.data)}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                      Nenhuma solicitação encontrada com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
