import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Phone, User, Wallet as WalletIcon } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatDateTime, formatMZN } from "../utils/format";
import {
  loanRequests,
  loanStateLabel,
  loanStateStyle,
} from "../mock/loanRequests";

export default function LoanRequestDetail() {
  const { processo } = useParams<{ processo: string }>();
  const navigate = useNavigate();
  const request = loanRequests.find((r) => r.processo === processo);

  if (!request) {
    return (
      <>
        <PageHeader
          title="Solicitação não encontrada"
          description="O processo indicado não existe ou foi removido."
        />
        <Button variant="outline" onClick={() => navigate("/app/admin/loan-requests")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar à lista
        </Button>
      </>
    );
  }

  const info = [
    { icon: User, label: "Cliente", value: request.cliente },
    { icon: Phone, label: "Telefone", value: request.telefone },
    { icon: WalletIcon, label: "Valor solicitado", value: formatMZN(request.valor) },
    { icon: Calendar, label: "Data do pedido", value: formatDateTime(request.data) },
  ];

  return (
    <>
      <div className="mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/app/admin/loan-requests")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Solicitações
        </Button>
      </div>

      <PageHeader
        title={request.processo}
        description={`Solicitação de ${request.cliente}`}
        actions={
          <Badge
            variant="secondary"
            className={cn("font-medium text-sm px-3 py-1", loanStateStyle[request.estado])}
          >
            {loanStateLabel[request.estado]}
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Dados do pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {info.map((i) => (
                <div key={i.label} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-md bg-muted grid place-items-center shrink-0">
                    <i.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{i.label}</p>
                    <p className="text-sm font-medium truncate">{i.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Prazo" value={`${request.prazo} meses`} />
              <Field label="Taxa de juros" value={`${request.taxaJuros.toFixed(2)}% / mês`} />
              <Field label="Parcela estimada" value={formatMZN(request.parcelaEstimada)} />
              <Field label="Garantia" value={request.garantia} />
              <Field label="Analista responsável" value={request.analista} />
              <Field label="BI" value={request.bi} />
              <Field label="Endereço" value={request.endereco} className="sm:col-span-2" />
              <Field label="Finalidade" value={request.finalidade} className="sm:col-span-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico do processo</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-border ml-2 space-y-4">
              {request.historico.map((h, idx) => (
                <li key={idx} className="ml-4">
                  <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary" />
                  <p className="text-sm font-medium">{h.evento}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(h.data)} · {h.autor}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
