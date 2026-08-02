import type { DemoScenario } from "./demo.types";
import { demoStore } from "./demoStore";
import { buildInitialDemoData } from "./fixtures";
import {
  authorizeDisbursement,
  markContractSigned,
  prepareContract,
  prepareDisbursement,
  recordCreditDecision,
  simulateDisbursement,
  simulatePayment,
} from "./demoActions";

const MAIN_APPLICATION_ID = "APP-0001";

/** Reinicia o cenário demonstrativo para o estado inicial. */
export function resetDemoScenario() {
  demoStore.replace(buildInitialDemoData());
}

/**
 * Aplica um cenário demonstrativo completo, reconstruindo o percurso do processo
 * principal (PRC-2026-00051) através das mesmas acções usadas pela interface.
 */
export function applyDemoScenario(scenario: DemoScenario) {
  resetDemoScenario();

  if (scenario === "INITIAL") {
    demoStore.update((data) => ({ ...data, scenario }));
    return;
  }

  recordCreditDecision(MAIN_APPLICATION_ID, "APROVADO_COM_CONDICOES", {
    approvedAmount: 300000,
    termMonths: 12,
    clientMessage:
      "Pedido aprovado no valor de 300.000 MZN a 12 meses, mediante manutenção da garantia apresentada.",
    internalComment: "Montante reduzido face ao solicitado por rácio de endividamento.",
  });

  if (scenario === "APPROVED") {
    demoStore.update((data) => ({ ...data, scenario }));
    return;
  }

  prepareContract(MAIN_APPLICATION_ID);
  const contract = demoStore
    .getState()
    .contracts.find((c) => c.applicationId === MAIN_APPLICATION_ID);
  if (contract) {
    markContractSigned(contract.id);
    prepareDisbursement(contract.id, "CARTEIRA_MOVEL");
    const disbursement = demoStore
      .getState()
      .disbursements.find((d) => d.contractId === contract.id);
    if (disbursement) {
      authorizeDisbursement(disbursement.id);
      simulateDisbursement(disbursement.id);
    }
  }

  if (scenario === "DISBURSED") {
    demoStore.update((data) => ({ ...data, scenario }));
    return;
  }

  // PAID: liquidar todas as prestações do crédito criado
  const loan = demoStore.getState().loans.find((l) => l.applicationId === MAIN_APPLICATION_ID);
  if (loan) {
    const total = demoStore
      .getState()
      .installments.filter((i) => i.loanId === loan.id)
      .reduce((sum, i) => sum + i.total, 0);
    simulatePayment(loan.id, total, "TRANSFERENCIA");
  }

  demoStore.update((data) => ({ ...data, scenario }));
}

export const DEMO_SCENARIOS: { code: DemoScenario; label: string; description: string }[] = [
  { code: "INITIAL", label: "Pedido em análise", description: "Processo principal em análise de crédito." },
  { code: "APPROVED", label: "Pedido aprovado", description: "Decisão de crédito registada." },
  { code: "DISBURSED", label: "Crédito desembolsado", description: "Contrato assinado e desembolso simulado." },
  { code: "PAID", label: "Crédito liquidado", description: "Todas as prestações pagas na demonstração." },
];
