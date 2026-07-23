import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "../components/PageHeader";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { permissionsApi } from "../api/client";

export default function PermissionsPage() {
  const { data = [] } = useQuery({ queryKey: ["perms"], queryFn: permissionsApi.list });

  return (
    <>
      <PageHeader
        title="Permissões"
        description="Catálogo de permissões atribuíveis a roles."
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chave</TableHead>
              <TableHead>Descrição</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-sm">{p.key}</TableCell>
                <TableCell>{p.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}
