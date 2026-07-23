import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "../auth/AuthContext";
import type { Role } from "../types";

const schema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  password: z.string().min(4, "Mínimo 4 caracteres").max(72),
});
type FormData = z.infer<typeof schema>;

const quickAccounts: { role: Role; email: string; label: string }[] = [
  { role: "ADMIN", email: "admin@jcf.co.mz", label: "Admin" },
  { role: "MANAGER", email: "ana@jcf.co.mz", label: "Manager" },
  { role: "SUPPORT", email: "bruno@jcf.co.mz", label: "Support" },
  { role: "USER", email: "cristina@example.com", label: "Cliente" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState<Role>("ADMIN");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@jcf.co.mz", password: "demo1234" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password, tab);
      toast.success(`Bem-vindo, ${user.name}`);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      navigate(from ?? (user.role === "USER" ? "/app/dashboard" : "/app/admin/dashboard"), {
        replace: true,
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao iniciar sessão");
    } finally {
      setLoading(false);
    }
  });

  const quickFill = (role: Role, email: string) => {
    setTab(role);
    setValue("email", email);
    setValue("password", "demo1234");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-primary-foreground/10 grid place-items-center font-bold">
            J
          </div>
          <span className="font-semibold">JCF Microcrédito</span>
        </div>
        <div className="max-w-md">
          <h1 className="text-4xl font-semibold leading-tight">
            Plataforma de gestão financeira moderna.
          </h1>
          <p className="mt-4 text-primary-foreground/70">
            Gestão de utilizadores, carteira digital, transações e auditoria com segurança
            enterprise.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-2xl font-semibold">99.9%</p>
              <p className="text-primary-foreground/60">Uptime</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">RBAC</p>
              <p className="text-primary-foreground/60">Segurança</p>
            </div>
            <div>
              <p className="text-2xl font-semibold">24/7</p>
              <p className="text-primary-foreground/60">Suporte</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-primary-foreground/60">© 2026 JCF Microcrédito, E.I</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Iniciar sessão</CardTitle>
            <CardDescription>Aceda ao painel da plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={(v) => setTab(v as Role)} className="mb-4">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="ADMIN">Admin</TabsTrigger>
                <TabsTrigger value="MANAGER">Manager</TabsTrigger>
                <TabsTrigger value="SUPPORT">Support</TabsTrigger>
                <TabsTrigger value="USER">Cliente</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Palavra-passe</Label>
                  <Link
                    to="/app/forgot-password"
                    className="text-xs text-accent hover:underline"
                  >
                    Esqueci-me
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "A entrar..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-xs text-muted-foreground mb-2">Acesso rápido (mock):</p>
              <div className="grid grid-cols-2 gap-2">
                {quickAccounts.map((a) => (
                  <Button
                    key={a.role}
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => quickFill(a.role, a.email)}
                  >
                    {a.label}
                  </Button>
                ))}
              </div>
            </div>

            <p className="mt-6 text-sm text-center text-muted-foreground">
              Não tem conta?{" "}
              <Link to="/app/register" className="text-accent hover:underline font-medium">
                Registar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
