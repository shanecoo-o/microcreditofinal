import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, CreditCard, MapPin, Phone, Mail, Wallet } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { KpiCard } from "../components/KpiCard";
import { StatusPill, ScorePill } from "../components/StatusPill";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { clientsService, loansService } from "../api/backoffice";
import { collections, contracts, guarantees } from "../mock/backoffice";
import { formatDate, formatMZN } from "../utils/format";

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

export default function ClientDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: client } = useQuery({ queryKey: ["client", id], queryFn: () => clientsService.byId(id) });
  const { data: loans = [] } = useQuery({ queryKey: ["client-loans", id], queryFn: () => loansService.byClient(id) });

  if (!client) {
    return (
      <>
        <PageHeader title="Cliente 360°" description="A carregar dados do cliente..." />
      </>
    );
  }

  const clientGuarantees = guarantees.filter((g) => g.cliente === client.nome);
  const clientContracts = contracts.filter((c) => c.cliente === client.nome);
  const clientCollections = collections.filter((c) => c.cliente === client.nome);

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-2" onClick={() => navigate("/app/admin/clients")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar aos clientes
      </Button>

      <PageHeader
        title={client.nome}
        description={`${client.id} · Cliente desde ${formatDate(client.desde)} · ${client.filial}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusPill status={client.estado} />
            <ScorePill score={client.score} />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <KpiCard label="Saldo devedor" value={formatMZN(client.saldoDevedor)} icon={Wallet} tone="warning" />
        <KpiCard label="Empréstimos" value={client.totalEmprestimos} icon={CreditCard} />
        <KpiCard label="Rendimento mensal" value={formatMZN(client.rendimento)} icon={Briefcase} tone="success" />
        <KpiCard label="Parcelas em atraso" value={clientCollections.length} icon={Wallet} tone={clientCollections.length ? "danger" : "default"} />
      </div>

      <Tabs defaultValue="perfil">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="emprestimos">Empréstimos</TabsTrigger>
          <TabsTrigger value="garantias">Garantias</TabsTrigger>
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="cobranca">Cobrança</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Dados do cliente</CardTitle></CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Telefone" value={client.telefone} icon={Phone} />
              <Field label="Email" value={client.email} icon={Mail} />
              <Field label="Endereço" value={client.endereco} icon={MapPin} />
              <Field label="BI" value={client.bi} />
              <Field label="NUIT" value={client.nuit} />
              <Field label="Profissão" value={client.profissao} icon={Briefcase} />
              <Field label="Rendimento" value={formatMZN(client.rendimento)} />
              <Field label="Filial" value={client.filial} />
              <Field label="Cliente desde" value={formatDate(client.desde)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emprestimos" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Processo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Parcelas</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs">{l.processo}</TableCell>
                    <TableCell>{l.produto}</TableCell>
                    <TableCell className="text-right font-mono">{formatMZN(l.valor)}</TableCell>
                    <TableCell>{l.parcelasPagas}/{l.parcelasTotal}</TableCell>
                    <TableCell><StatusPill status={l.estado} /></TableCell>
                  </TableRow>
                ))}
                {loans.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sem empréstimos.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="garantias" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clientGuarantees.map((g) => (
              <Card key={g.id} className="overflow-hidden">
                <img src={g.foto} alt={`Garantia ${g.tipo}`} className="h-32 w-full object-cover" loading="lazy" />
                <CardContent className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{g.tipo}</p>
                    <StatusPill status={g.estado} />
                  </div>
                  <p className="text-sm text-muted-foreground">{g.descricao}</p>
                  <p className="font-semibold">{formatMZN(g.valorEstimado)}</p>
                </CardContent>
              </Card>
            ))}
            {clientGuarantees.length === 0 && <p className="text-sm text-muted-foreground">Sem garantias registadas.</p>}
          </div>
        </TabsContent>

        <TabsContent value="contratos" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientContracts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.numero}</TableCell>
                    <TableCell>{formatDate(c.data)}</TableCell>
                    <TableCell className="text-right font-mono">{formatMZN(c.valor)}</TableCell>
                    <TableCell><StatusPill status={c.estado} /></TableCell>
                  </TableRow>
                ))}
                {clientContracts.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Sem contratos.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="cobranca" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Processo</TableHead>
                  <TableHead>Parcela</TableHead>
                  <TableHead className="text-right">Dias em atraso</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Prioridade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientCollections.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.processo}</TableCell>
                    <TableCell>{c.parcela}</TableCell>
                    <TableCell className="text-right">{c.diasAtraso}</TableCell>
                    <TableCell className="text-right font-mono">{formatMZN(c.valor)}</TableCell>
                    <TableCell><StatusPill status={c.prioridade} /></TableCell>
                  </TableRow>
                ))}
                {clientCollections.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sem parcelas em atraso.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
