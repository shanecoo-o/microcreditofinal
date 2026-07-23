import { useState } from "react";
import { Calculator, Calendar, Percent, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const loanTerms = [
  { months: 6, interestRate: 1.5 },
  { months: 12, interestRate: 1.2 },
  { months: 18, interestRate: 1.0 },
  { months: 24, interestRate: 0.8 },
  { months: 36, interestRate: 0.6 },
];

const LoanSimulator = () => {
  const [amount, setAmount] = useState(50000);
  const [selectedTerm, setSelectedTerm] = useState(loanTerms[1]);

  const calculateMonthlyPayment = () => {
    const principal = amount;
    const monthlyRate = selectedTerm.interestRate / 100;
    const months = selectedTerm.months;
    
    // Simple interest calculation
    const totalInterest = principal * monthlyRate * months;
    const totalAmount = principal + totalInterest;
    const monthlyPayment = totalAmount / months;
    
    return {
      monthlyPayment: Math.round(monthlyPayment),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
    };
  };

  const calculation = calculateMonthlyPayment();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-MZ') + ' MZN';
  };

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simule Seu Empréstimo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubra quanto você pode pagar por mês. Ajuste o valor e o prazo para ver a simulação.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Simulator Controls */}
            <Card className="border-border shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calculator className="w-5 h-5 text-primary" />
                  Configurar Simulação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Amount Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">Valor do Empréstimo</Label>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <Slider
                    value={[amount]}
                    onValueChange={(value) => setAmount(value[0])}
                    min={5000}
                    max={200000}
                    step={1000}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>5.000 MZN</span>
                    <span>200.000 MZN</span>
                  </div>
                </div>

                {/* Term Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Prazo de Pagamento</Label>
                  <Select
                    value={selectedTerm.months.toString()}
                    onValueChange={(value) => {
                      const term = loanTerms.find(t => t.months.toString() === value);
                      if (term) setSelectedTerm(term);
                    }}
                  >
                    <SelectTrigger className="w-full h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTerms.map((term) => (
                        <SelectItem key={term.months} value={term.months.toString()}>
                          {term.months} meses - {term.interestRate}% juros/mês
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Interest Rate Info */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="w-4 h-4 text-primary" />
                    <span className="font-medium">Taxa de Juros</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {selectedTerm.interestRate}% ao mês
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Quanto maior o prazo, menor a taxa de juros
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="border-primary/20 shadow-lg bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Banknote className="w-5 h-5 text-primary" />
                  Resultado da Simulação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Monthly Payment Highlight */}
                <div className="bg-primary rounded-2xl p-6 text-center">
                  <p className="text-primary-foreground/80 text-sm mb-1">
                    Parcela Mensal Estimada
                  </p>
                  <p className="text-4xl font-bold text-primary-foreground">
                    {formatCurrency(calculation.monthlyPayment)}
                  </p>
                  <p className="text-primary-foreground/80 text-sm mt-2">
                    por {selectedTerm.months} meses
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Valor Solicitado</span>
                    <span className="font-semibold">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Prazo</span>
                    <span className="font-semibold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {selectedTerm.months} meses
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Taxa de Juros</span>
                    <span className="font-semibold">{selectedTerm.interestRate}% ao mês</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Total de Juros</span>
                    <span className="font-semibold text-amber-600">{formatCurrency(calculation.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-muted/50 rounded-lg px-3">
                    <span className="font-medium">Total a Pagar</span>
                    <span className="font-bold text-lg text-primary">{formatCurrency(calculation.totalAmount)}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  * Valores simulados. O valor final pode variar conforme análise de crédito.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoanSimulator;
