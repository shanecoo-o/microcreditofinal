import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "../components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { permissionsApi, rolesApi } from "../api/client";
import { RoleBadge } from "../components/StatusBadge";

export default function RolesPage() {
  const { data: roles = [] } = useQuery({ queryKey: ["roles"], queryFn: rolesApi.list });
  const { data: perms = [] } = useQuery({ queryKey: ["perms"], queryFn: permissionsApi.list });

  return (
    <>
      <PageHeader title="Roles" description="Perfis de acesso e permissões associadas." />
      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex flex-row items-center gap-3">
              <RoleBadge role={r.name} />
              <div>
                <CardTitle className="text-base">{r.description}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {perms.map((p) => {
                const checked = r.permissions.includes(p.key);
                return (
                  <label
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-muted/40"
                  >
                    <div>
                      <p className="text-sm font-medium">{p.description}</p>
                      <p className="text-xs text-muted-foreground font-mono">{p.key}</p>
                    </div>
                    <Checkbox checked={checked} disabled />
                  </label>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
