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
  loans,
  loanAnalistas,
  loanStatusLabel,
  loanStatusStyle,
  scoreStyle,
  type LoanStatus,
} from "../mock/loans";

const STATUSES: LoanStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "CONTRACT_PENDING",
  "DISBURSED",
];

export default function Loans() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<string>("ALL");
  const [analista, setAnalista] = useState<string>("ALL");
  const [dataFrom, setDataFrom] = useState("");
  const [dataTo, setDataTo] = useState("");
  const [valorMin, setValorMin] = useState("");
  const [valorMax, setValorMax] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return loans.filter((r) => {
      if (estado !== "ALL" && r.estado !== estado) return false;
      if (analista !== "ALL" && r.analista !== analista) return false;
      if (dataFrom && new Date(r.data) < new Date(dataFrom)) return false;
      if (dataTo && new Date(r.data) > new Date(dataTo + "T23:59:59")) return false;
      if (valorMin && r.valor < Number(valorMin)) return false;
      if (valorMax && r.valor > Number(valorMax)) return false;
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
  }, [estado, analista, dataFrom, dataTo, valorMin, valorMax, search]);

  const clearFilters = () => {
    setEstado("ALL");
    setAnalista("ALL");
    setDataFrom("");
    setDataTo("");
    setValorMin("");
    setValorMax("");
    setSearch("");
  };

  const hasFilters =
    estado !== "ALL" ||
    analista !== "ALL" ||
    dataFrom ||
    dataTo ||
    valorMin ||
    valorMax ||
    search;

  return (
    <>
      <PageHeader
        title="Solicitações de Crédito"
        description="Gestão completa do ciclo de vida dos empréstimos."
      />

      <Card className="mb-4">
        <CardContent className="pt-6 space-y-3">
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
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {loanStatusLabel[s]}
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
                {loanAnalistas.map((a) => (
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

          <div className="grid gap-3 md:grid-cols-6">
            <Input
              type="number"
              placeholder="Valor mínimo (MZN)"
              value={valorMin}
              onChange={(e) => setValorMin(e.target.value)}
              className="md:col-span-2"
            />
            <Input
              type="number"
              placeholder="Valor máximo (MZN)"
              value={valorMax}
              onChange={(e) => setValorMax(e.target.value)}
              className="md:col-span-2"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              {filtered.length} de {loans.length} solicitações
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
                  <TableHead className="text-right">Valor Solicitado</TableHead>
                  <TableHead>Garantia</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Analista</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow
                    key={r.processo}
                    className="cursor-pointer"
                    onClick={() => navigate(`/app/loans/${r.processo}`)}
                  >
                    <TableCell className="font-mono text-xs">{r.processo}</TableCell>
                    <TableCell className="font-medium">{r.cliente}</TableCell>
                    <TableCell className="text-muted-foreground">{r.telefone}</TableCell>
                    <TableCell className="text-right font-mono">{formatMZN(r.valor)}</TableCell>
                    <TableCell className="max-w-[220px] truncate" title={r.garantia}>
                      {r.garantia}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className={cn("font-mono", scoreStyle(r.score))}>
                        {r.score}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("font-medium", loanStatusStyle[r.estado])}>
                        {loanStatusLabel[r.estado]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.analista}</TableCell>
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

      <p className="text-xs text-muted-foreground mt-3">
        Última actualização: {formatDate(new Date().toISOString())}
      </p>
    </>
  );
}
