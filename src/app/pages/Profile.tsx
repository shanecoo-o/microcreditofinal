import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "../components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "../components/StatusBadge";
import { useAuth } from "../auth/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  const initials = user?.name
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();

  return (
    <>
      <PageHeader title="Perfil" description="Detalhes da sua conta." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 text-center">
            <Avatar className="h-20 w-20 mx-auto">
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <p className="font-semibold mt-4">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-3">{user && <RoleBadge role={user.role} />}</div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Telemóvel</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Email</Label>
                  <Input value={user?.email ?? ""} disabled />
                </div>
              </div>
              <Button onClick={() => toast.success("Perfil actualizado")}>Guardar</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alterar palavra-passe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Atual</Label>
                  <Input
                    type="password"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nova</Label>
                  <Input
                    type="password"
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  if (next.length < 6) {
                    toast.error("Mínimo 6 caracteres");
                    return;
                  }
                  toast.success("Palavra-passe alterada");
                  setCurrent("");
                  setNext("");
                }}
              >
                Alterar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
