import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, Bell, Wallet } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { KpiCard } from "../components/KpiCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "../components/StatusBadge";
import { formatDateTime, formatMZN } from "../utils/format";
import { transactionsApi, walletApi } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function UserDashboard() {
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

  const income = tx.filter((t) => t.type === "DEPOSIT" && t.status === "COMPLETED")
    .reduce((s, t) => s + t.amount, 0);
  const outflow = tx.filter((t) => ["WITHDRAW", "PAYMENT"].includes(t.type) && t.status === "COMPLETED")
    .reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <PageHeader
        title={`Olá, ${user?.name.split(" ")[0] ?? ""} 👋`}
        description="Resumo da sua conta e movimentos recentes."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Saldo disponível" value={formatMZN(wallet?.balance ?? 0)} icon={Wallet} />
        <KpiCard label="Entradas" value={formatMZN(income)} icon={ArrowDownLeft} tone="success" />
        <KpiCard label="Saídas" value={formatMZN(outflow)} icon={ArrowUpRight} tone="warning" />
        <KpiCard label="Notificações" value={3} icon={Bell} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Movimentos recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {tx.slice(0, 8).map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm">{t.type}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(t.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={t.status} />
                  <span className="font-mono font-medium">{formatMZN(t.amount)}</span>
                </div>
              </div>
            ))}
            {tx.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">Sem movimentos.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
