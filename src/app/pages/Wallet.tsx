import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, CreditCard, Send } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime, formatMZN } from "../utils/format";
import { transactionsApi, walletApi } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function WalletPage() {
  const { user } = useAuth();
  const uid = user?.id ?? "u-4";
  const { data: wallet } = useQuery({
    queryKey: ["wallet", uid],
    queryFn: () => walletApi.get(uid),
  });
  const { data: tx = [] } = useQuery({
    queryKey: ["tx", uid],
    queryFn: () => transactionsApi.list({ userId: uid }),
  });

  return (
    <>
      <PageHeader title="Carteira" description="Saldo e operações da sua conta." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-primary text-primary-foreground overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary-foreground/70">
                  Saldo disponível
                </p>
                <p className="text-4xl font-semibold mt-2">
                  {formatMZN(wallet?.balance ?? 0)}
                </p>
                <p className="text-sm text-primary-foreground/70 mt-1">
                  Conta {user?.email}
                </p>
              </div>
              <CreditCard className="h-8 w-8 opacity-70" />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">
                <ArrowDownLeft className="h-4 w-4 mr-2" /> Depositar
              </Button>
              <Button variant="secondary" size="sm">
                <ArrowUpRight className="h-4 w-4 mr-2" /> Levantar
              </Button>
              <Button variant="secondary" size="sm">
                <Send className="h-4 w-4 mr-2" /> Transferir
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Moeda</span>
              <span className="font-medium">{wallet?.currency ?? "MZN"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transações</span>
              <span className="font-medium">{tx.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado</span>
              <StatusBadge status="ACTIVE" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Últimos movimentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {tx.slice(0, 10).map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{t.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(t.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={t.status} />
                  <span className="font-mono font-medium">{formatMZN(t.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
