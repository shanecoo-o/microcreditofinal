import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const pricingData = [
  { range: "5.000 - 20.000 MZN", fee: "247 MZN" },
  { range: "21.000 - 50.000 MZN", fee: "397 MZN" },
  { range: "51.000 - 100.000 MZN", fee: "797 MZN" },
  { range: "101.000 - 200.000 MZN", fee: "1.297 MZN" },
];

const PricingTable = () => {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tabela de Taxas de Inscrição
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Confira os valores das taxas de acordo com o montante solicitado
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold text-base py-4">
                    Valor Solicitado
                  </TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-base py-4 text-right">
                    Taxa de Inscrição
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData.map((item, index) => (
                  <TableRow 
                    key={index} 
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground py-4">
                      {item.range}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary py-4">
                      {item.fee}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
