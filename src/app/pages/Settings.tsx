import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "../components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [company, setCompany] = useState("JCF Microcrédito, E.I");
  const [currency, setCurrency] = useState("MZN");
  const [notifs, setNotifs] = useState(true);
  const [twoFa, setTwoFa] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Preferências gerais e de segurança da plataforma."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Geral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome da empresa</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Moeda base</Label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
            <Button onClick={() => toast.success("Configurações guardadas")}>Guardar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Segurança e notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Autenticação de dois fatores</p>
                <p className="text-xs text-muted-foreground">
                  Camada extra de segurança no login.
                </p>
              </div>
              <Switch checked={twoFa} onCheckedChange={setTwoFa} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Notificações por email</p>
                <p className="text-xs text-muted-foreground">
                  Receber alertas e resumos operacionais.
                </p>
              </div>
              <Switch checked={notifs} onCheckedChange={setNotifs} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Modo manutenção</p>
                <p className="text-xs text-muted-foreground">
                  Bloqueia acesso enquanto atualiza a plataforma.
                </p>
              </div>
              <Switch checked={maintenance} onCheckedChange={setMaintenance} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
