import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
} from "lucide-react";
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
  filiais,
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

const VALOR_RANGES: { id: string; label: string; min: number; max: number }[] = [
  { id: "ALL", label: "Qualquer valor", min: 0, max: Infinity },
  { id: "R1", label: "Até 50.000 MZN", min: 0, max: 50_000 },
  { id: "R2", label: "50.001 – 100.000 MZN", min: 50_001, max: 100_000 },
  { id: "R3", label: "100.001 – 200.000 MZN", min: 100_001, max: 200_000 },
  { id: "R4", label: "Acima de 200.000 MZN", min: 200_001, max: Infinity },
];

const PAGE_SIZE = 10;

export default function LoanRequests() {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<string>("ALL");
  const [analista, setAnalista] = useState<string>("ALL");
  const [filial, setFilial] = useState<string>("ALL");
  const [valorRange, setValorRange] = useState<string>("ALL");
  const [dataFrom, setDataFrom] = useState<string>("");
  const [dataTo, setDataTo] = useState<string>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const range = VALOR_RANGES.find((r) => r.id === valorRange) ?? VALOR_RANGES[0];
    return loanRequests.filter((r) => {
      if (estado !== "ALL" && r.estado !== estado) return false;
      if (analista !== "ALL" && r.analista !== analista) return false;
      if (filial !== "ALL" && r.filial !== filial) return false;
      if (r.valor < range.min || r.valor > range.max) return false;
      if (dataFrom && new Date(r.data) < new Date(dataFrom)) return false;
      if (dataTo && new Date(r.data) > new Date(dataTo + "T23:59:59")) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.processo.toLowerCase().includes(q) &&
          !r.cliente.toLowerCase().includes(q) &&
          !r.telefone.toLowerCase().includes(q) &&
          !r.bi.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [estado, analista, filial, valorRange, dataFrom, dataTo, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const clearFilters = () => {
    setEstado("ALL");
    setAnalista("ALL");
    setFilial("ALL");
    setValorRange("ALL");
    setDataFrom("");
    setDataTo("");
    setSearch("");
    setPage(1);
  };

  const hasFilters =
    estado !== "ALL" ||
    analista !== "ALL" ||
    filial !== "ALL" ||
    valorRange !== "ALL" ||
    dataFrom ||
    dataTo ||
    search;

  const resetPage = () => setPage(1);

  return (
    <>
      <PageHeader
        title="Solicitações de Crédito"
        description="Consulte, filtre e faça o seguimento dos pedidos de empréstimo."
      />

      <Card className="mb-4">
        <CardContent className="pt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por processo, cliente, BI ou telefone"
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            <Select
              value={estado}
              onValueChange={(v) => {
                setEstado(v);
                resetPage();
              }}
            >
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

            <Select
              value={analista}
              onValueChange={(v) => {
                setAnalista(v);
                resetPage();
              }}
            >
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

            <Select
              value={filial}
              onValueChange={(v) => {
                setFilial(v);
                resetPage();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas as filiais</SelectItem>
                {filiais.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={valorRange}
              onValueChange={(v) => {
                setValorRange(v);
                resetPage();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Valor" />
              </SelectTrigger>
              <SelectContent>
                {VALOR_RANGES.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-2">
              <Input
                type="date"
                value={dataFrom}
                onChange={(e) => {
                  setDataFrom(e.target.value);
                  resetPage();
                }}
                aria-label="Data de"
              />
              <Input
                type="date"
                value={dataTo}
                onChange={(e) => {
                  setDataTo(e.target.value);
                  resetPage();
                }}
                aria-label="Data até"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
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
                  <TableHead>BI</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead className="text-right">Valor Solicitado</TableHead>
                  <TableHead className="text-right">Prazo</TableHead>
                  <TableHead>Garantia</TableHead>
                  <TableHead>Analista</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((r) => (
                  <TableRow
                    key={r.processo}
                    className="cursor-pointer"
                    onClick={() =>
                      navigate(`/app/admin/loan-requests/${r.processo}`)
                    }
                  >
                    <TableCell className="font-mono text-xs">{r.processo}</TableCell>
                    <TableCell className="font-medium">{r.cliente}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {r.bi}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.telefone}</TableCell>
                    <TableCell className="text-right font-mono">{formatMZN(r.valor)}</TableCell>
                    <TableCell className="text-right">{r.prazo} meses</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={r.garantia}>
                      {r.garantia}
                    </TableCell>
                    <TableCell className="text-sm">{r.analista}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(r.data)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("font-medium", loanStateStyle[r.estado])}
                      >
                        {loanStateLabel[r.estado]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {pageItems.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center text-muted-foreground py-10"
                    >
                      Nenhuma solicitação encontrada com os filtros aplicados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages} · A mostrar{" "}
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)} de{" "}
                {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Próxima <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
