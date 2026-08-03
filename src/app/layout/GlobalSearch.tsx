import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDemoStore } from "@/demo/DemoDataProvider";
import { globalSearch } from "../admin/adminSelectors";

/** Pesquisa global do backoffice: processo, cliente, crédito, contrato, pagamento. */
export function GlobalSearch() {
  const data = useDemoStore();
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const hits = useMemo(() => globalSearch(data, term), [data, term]);

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        placeholder="Pesquisar processo, cliente, crédito, contrato..."
        aria-label="Pesquisa global"
        className="pl-9 h-9"
      />
      {open && term.trim().length >= 2 && (
        <div className="absolute top-11 left-0 right-0 z-50 rounded-[10px] border border-border bg-popover shadow-lg overflow-hidden">
          {hits.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">Sem resultados para “{term}”.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {hits.map((hit) => (
                <li key={`${hit.group}-${hit.id}`}>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-accent flex items-center justify-between gap-3"
                    onMouseDown={() => {
                      navigate(hit.to);
                      setTerm("");
                      setOpen(false);
                    }}
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-medium truncate">{hit.label}</span>
                      <span className="block text-xs text-muted-foreground truncate">{hit.hint}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground shrink-0">
                      {hit.group}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
