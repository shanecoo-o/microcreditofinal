import { useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  searchKeys?: (row: T) => string[];
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyMessage?: string;
  caption?: string;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
  searchKeys,
  searchPlaceholder = "Pesquisar...",
  filters,
  actions,
  onRowClick,
  pageSize = 10,
  emptyMessage = "Sem registos.",
  caption,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!query.trim() || !searchKeys) return data;
    const q = query.toLowerCase();
    return data.filter((row) => searchKeys(row).some((v) => v?.toLowerCase().includes(q)));
  }, [data, query, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <Card className="overflow-hidden">
      {(searchKeys || filters || actions) && (
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 p-4 border-b border-border">
          {searchKeys && (
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="pl-9"
                aria-label={searchPlaceholder}
              />
            </div>
          )}
          {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
          {actions && <div className="flex items-center gap-2 lg:ml-auto">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          {caption && <caption className="sr-only">{caption}</caption>}
          <TableHeader>
            <TableRow className="bg-muted/40">
              {columns.map((c) => (
                <TableHead key={c.key} scope="col" className={cn("whitespace-nowrap", c.className)}>
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((c) => (
                  <TableCell key={c.key} className={cn("whitespace-nowrap", c.className)}>
                    {c.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-10">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {filtered.length} registo(s) · página {current} de {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current >= totalPages}
          >
            Seguinte <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
