/**
 * Selectores agregados do backoffice — derivados exclusivamente do demoStore.
 * Nenhum valor aleatório: tudo é calculado a partir dos dados demonstrativos.
 */
import type {
  DemoData,
  Installment,
  Loan,
  LoanApplication,
  OpsStage,
  Priority,
} from "@/demo/demo.types";

/* ============ Derivações de pedido ============ */

export function stageOf(app: LoanApplication): OpsStage {
  if (app.stage) return app.stage;
  switch (app.status) {
    case "PRE_CANDIDATURA":
      return "NOVOS";
    case "AGUARDA_DOCUMENTOS":
      return "DOCUMENTOS";
    case "EM_ANALISE":
      return "ANALISE";
    case "APROVADO":
      return "APROVACAO";
    case "CONTRATO":
      return "CONTRATO";
    case "DESEMBOLSADO":
      return "DESEMBOLSO";
    default:
      return "VERIFICACAO";
  }
}

const STAGE_SLA_DAYS: Record<OpsStage, number> = {
  NOVOS: 1,
  DOCUMENTOS: 3,
  VERIFICACAO: 2,
  ANALISE: 4,
  APROVACAO: 2,
  CONTRATO: 3,
  DESEMBOLSO: 2,
};

export function priorityOf(app: LoanApplication): Priority {
  if (app.priority) return app.priority;
  if (app.requestedAmount >= 300000) return "ALTA";
  if (app.requestedAmount >= 150000) return "MEDIA";
  return "BAIXA";
}

export function daysInStage(app: LoanApplication, now = Date.now()): number {
  return Math.max(0, Math.floor((now - new Date(app.updatedAt).getTime()) / 86_400_000));
}

export function slaDueDate(app: LoanApplication): Date {
  if (app.slaDueAt) return new Date(app.slaDueAt);
  const due = new Date(app.updatedAt);
  due.setDate(due.getDate() + STAGE_SLA_DAYS[stageOf(app)]);
  return due;
}

export function slaState(app: LoanApplication, now = Date.now()) {
  const due = slaDueDate(app).getTime();
  const hoursLeft = Math.round((due - now) / 3_600_000);
  const state = hoursLeft < 0 ? "VENCIDO" : hoursLeft <= 24 ? "EM_RISCO" : "EM_PRAZO";
  return { state, hoursLeft, due: new Date(due) } as const;
}

export const isOpenApplication = (app: LoanApplication) =>
  !["DESEMBOLSADO", "RECUSADO", "CANCELADO"].includes(app.status);

/* ============ Documentos ============ */

export function documentStats(data: DemoData, applicationId: string) {
  const docs = data.documents.filter((d) => d.applicationId === applicationId);
  const valid = docs.filter((d) => d.status === "VALIDADO").length;
  const pending = docs.filter((d) => d.status === "PENDENTE" || d.status === "REJEITADO").length;
  const review = docs.filter((d) => d.status === "EM_REVISAO").length;
  return { total: docs.length, valid, pending, review, docs };
}

/* ============ Créditos ============ */

export function daysOverdue(installments: Installment[], now = Date.now()): number {
  const overdue = installments
    .filter((i) => i.status !== "PAGA" && new Date(i.dueDate).getTime() < now)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  if (!overdue) return 0;
  return Math.floor((now - new Date(overdue.dueDate).getTime()) / 86_400_000);
}

export type LoanSituation = "REGULAR" | "OBSERVACAO" | "ATRASO" | "RENEGOCIADO" | "LIQUIDADO";

export function loanSituation(loan: Loan, overdue: number): LoanSituation {
  if (loan.status === "LIQUIDADO") return "LIQUIDADO";
  if (loan.status === "RENEGOCIADO") return "RENEGOCIADO";
  if (overdue > 30) return "ATRASO";
  if (overdue > 0) return "OBSERVACAO";
  return "REGULAR";
}

export interface LoanRow {
  loan: Loan;
  clientName: string;
  productName: string;
  installments: Installment[];
  overdueDays: number;
  situation: LoanSituation;
  nextInstallment?: Installment;
  branchId?: string;
  analystName?: string;
}

export function loanRows(data: DemoData, now = Date.now()): LoanRow[] {
  return data.loans.map((loan) => {
    const installments = data.installments
      .filter((i) => i.loanId === loan.id)
      .sort((a, b) => a.number - b.number);
    const overdueDays = daysOverdue(installments, now);
    const app = data.applications.find((a) => a.id === loan.applicationId);
    const analyst = data.users.find((u) => u.id === app?.analystId);
    return {
      loan,
      clientName: data.clients.find((c) => c.id === loan.clientId)?.name ?? "—",
      productName: data.products.find((p) => p.id === loan.productId)?.name ?? "—",
      installments,
      overdueDays,
      situation: loanSituation(loan, overdueDays),
      nextInstallment: installments.find((i) => i.status !== "PAGA"),
      branchId: app?.branchId,
      analystName: analyst?.name,
    };
  });
}

/* ============ KPIs executivos ============ */

export interface DashboardFilters {
  branchId?: string;
  productId?: string;
  days?: number;
}

export function executiveKpis(data: DemoData, filters: DashboardFilters = {}, now = Date.now()) {
  const since = now - (filters.days ?? 90) * 86_400_000;
  const rows = loanRows(data, now).filter(
    (r) =>
      (!filters.branchId || r.branchId === filters.branchId) &&
      (!filters.productId || r.loan.productId === filters.productId),
  );
  const apps = data.applications.filter(
    (a) =>
      (!filters.branchId || a.branchId === filters.branchId) &&
      (!filters.productId || a.productId === filters.productId),
  );

  const activeLoans = rows.filter((r) => r.loan.status !== "LIQUIDADO");
  const portfolio = activeLoans.reduce((s, r) => s + r.loan.outstandingBalance, 0);
  const disbursedPeriod = rows
    .filter((r) => new Date(r.loan.disbursedAt).getTime() >= since)
    .reduce((s, r) => s + r.loan.principal, 0);
  const par30 = activeLoans.filter((r) => r.overdueDays > 30);
  const par30Value = par30.reduce((s, r) => s + r.loan.outstandingBalance, 0);
  const decided = data.decisions.length;
  const approved = data.decisions.filter((d) => d.decision !== "RECUSADO").length;

  return {
    activeClients: new Set(activeLoans.map((r) => r.loan.clientId)).size || data.clients.length,
    portfolio,
    activeLoans: activeLoans.length,
    disbursedPeriod,
    par30: portfolio > 0 ? par30Value / portfolio : 0,
    approvalRate: decided > 0 ? approved / decided : 0,
    applications: apps,
    rows,
  };
}

export function portfolioBySituation(rows: LoanRow[]) {
  const buckets = [
    { key: "REGULAR", label: "Regular", test: (r: LoanRow) => r.overdueDays === 0 },
    { key: "A1", label: "Atraso 1–30 dias", test: (r: LoanRow) => r.overdueDays > 0 && r.overdueDays <= 30 },
    { key: "A2", label: "Atraso 31–60 dias", test: (r: LoanRow) => r.overdueDays > 30 && r.overdueDays <= 60 },
    { key: "A3", label: "Atraso superior a 60 dias", test: (r: LoanRow) => r.overdueDays > 60 },
  ];
  const active = rows.filter((r) => r.loan.status !== "LIQUIDADO");
  return buckets.map((b) => {
    const list = active.filter(b.test);
    return {
      key: b.key,
      label: b.label,
      count: list.length,
      value: list.reduce((s, r) => s + r.loan.outstandingBalance, 0),
    };
  });
}

/** Série mensal da carteira, derivada das datas de desembolso e pagamentos. */
export function portfolioSeries(data: DemoData, months = 6, now = Date.now()) {
  const out: { month: string; carteira: number; desembolsado: number; recebido: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const ref = new Date(now);
    ref.setMonth(ref.getMonth() - i);
    const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59).getTime();
    const startMonth = new Date(ref.getFullYear(), ref.getMonth(), 1).getTime();
    const disbursed = data.loans.filter((l) => new Date(l.disbursedAt).getTime() <= end);
    const received = data.payments.filter((p) => {
      const t = new Date(p.createdAt).getTime();
      return t >= startMonth && t <= end;
    });
    out.push({
      month: ref.toLocaleDateString("pt-PT", { month: "short" }),
      carteira: disbursed.reduce((s, l) => s + l.outstandingBalance, 0),
      desembolsado: disbursed
        .filter((l) => new Date(l.disbursedAt).getTime() >= startMonth)
        .reduce((s, l) => s + l.principal, 0),
      recebido: received.reduce((s, p) => s + p.amount, 0),
    });
  }
  return out;
}

export function financeSummary(data: DemoData, now = Date.now()) {
  const disbursed = data.loans.reduce((s, l) => s + l.principal, 0);
  const received = data.payments.reduce((s, p) => s + p.amount, 0);
  const interestReceived = data.installments
    .filter((i) => i.status === "PAGA")
    .reduce((s, i) => s + i.interest, 0);
  const rows = loanRows(data, now);
  const inCollection = rows
    .filter((r) => r.overdueDays > 0 && r.loan.status !== "LIQUIDADO")
    .reduce((s, r) => s + r.loan.outstandingBalance, 0);
  const provision = Math.round(inCollection * 0.2);
  return {
    disbursed,
    received,
    interestReceived,
    inCollection,
    provision,
    net: interestReceived - provision,
  };
}

export interface DashboardAlert {
  id: string;
  label: string;
  count: number;
  tone: "warning" | "danger" | "info";
  to: string;
}

export function dashboardAlerts(data: DemoData, now = Date.now()): DashboardAlert[] {
  const open = data.applications.filter(isOpenApplication);
  const pendingDocs = data.documents.filter(
    (d) => (d.status === "PENDENTE" || d.status === "REJEITADO") && open.some((a) => a.id === d.applicationId),
  ).length;
  const slaBreached = open.filter((a) => slaState(a, now).state === "VENCIDO").length;
  const pendingContracts = data.contracts.filter((c) => c.status === "PREPARADO").length;
  const overdueInstallments = data.installments.filter(
    (i) => i.status !== "PAGA" && new Date(i.dueDate).getTime() < now,
  ).length;
  const pendingGuarantees = data.guarantees.filter((g) => g.status === "PROPOSTA").length;

  return [
    { id: "docs", label: "Documentos pendentes", count: pendingDocs, tone: "warning", to: "/app/admin/loan-requests?filtro=documentos" },
    { id: "sla", label: "SLAs vencidos", count: slaBreached, tone: "danger", to: "/app/admin/loan-requests?filtro=sla" },
    { id: "contracts", label: "Contratos pendentes", count: pendingContracts, tone: "info", to: "/app/admin/contracts" },
    { id: "installments", label: "Prestações vencidas", count: overdueInstallments, tone: "danger", to: "/app/admin/installments" },
    { id: "guarantees", label: "Garantias pendentes", count: pendingGuarantees, tone: "warning", to: "/app/admin/guarantees" },
  ];
}

export function operationsKpis(data: DemoData, now = Date.now()) {
  const open = data.applications.filter(isOpenApplication);
  const byStage = (stage: OpsStage) => open.filter((a) => stageOf(a) === stage).length;
  return {
    novos: byStage("NOVOS"),
    documentos: data.documents.filter(
      (d) => d.status === "PENDENTE" && open.some((a) => a.id === d.applicationId),
    ).length,
    verificacao: byStage("VERIFICACAO"),
    analise: byStage("ANALISE"),
    aprovacao: byStage("APROVACAO"),
    contratos: data.contracts.filter((c) => c.status === "PREPARADO").length,
    desembolsos: data.disbursements.filter((d) => d.status !== "EXECUTADO").length,
    slaVencidos: open.filter((a) => slaState(a, now).state === "VENCIDO").length,
  };
}

export function topProducts(data: DemoData) {
  return data.products
    .map((p) => {
      const apps = data.applications.filter((a) => a.productId === p.id);
      const loans = data.loans.filter((l) => l.productId === p.id);
      return {
        product: p,
        applications: apps.length,
        volume: loans.reduce((s, l) => s + l.principal, 0),
        requested: apps.reduce((s, a) => s + a.requestedAmount, 0),
      };
    })
    .sort((a, b) => b.requested - a.requested);
}

export function branchPerformance(data: DemoData, now = Date.now()) {
  const rows = loanRows(data, now);
  return data.branches.map((b) => {
    const apps = data.applications.filter((a) => a.branchId === b.id);
    const branchLoans = rows.filter((r) => r.branchId === b.id);
    return {
      branch: b,
      applications: apps.length,
      approved: data.decisions.filter(
        (d) => apps.some((a) => a.id === d.applicationId) && d.decision !== "RECUSADO",
      ).length,
      portfolio: branchLoans.reduce((s, r) => s + r.loan.outstandingBalance, 0),
      overdue: branchLoans.filter((r) => r.overdueDays > 0).length,
    };
  });
}

/* ============ Pesquisa global ============ */

export interface SearchHit {
  id: string;
  label: string;
  hint: string;
  group: string;
  to: string;
}

export function globalSearch(data: DemoData, term: string, limit = 12): SearchHit[] {
  const q = term.trim().toLowerCase();
  if (q.length < 2) return [];
  const hits: SearchHit[] = [];
  const match = (...values: (string | undefined)[]) =>
    values.some((v) => v?.toLowerCase().includes(q));

  data.applications.forEach((a) => {
    const client = data.clients.find((c) => c.id === a.clientId);
    if (match(a.processId, a.reference, client?.name, client?.phone, client?.identityNumber))
      hits.push({
        id: a.id,
        label: a.processId,
        hint: `Pedido · ${client?.name ?? ""}`,
        group: "Pedidos",
        to: `/app/admin/loan-requests/${a.processId}`,
      });
  });

  data.clients.forEach((c) => {
    if (match(c.name, c.phone, c.identityNumber, c.email))
      hits.push({ id: c.id, label: c.name, hint: `Cliente · ${c.phone}`, group: "Clientes", to: `/app/admin/clients/${c.id}` });
  });

  data.loans.forEach((l) => {
    const client = data.clients.find((c) => c.id === l.clientId);
    if (match(l.loanId, client?.name))
      hits.push({ id: l.id, label: l.loanId, hint: `Crédito · ${client?.name ?? ""}`, group: "Créditos", to: `/app/admin/loans/${l.loanId}` });
  });

  data.contracts.forEach((c) => {
    if (match(c.reference))
      hits.push({ id: c.id, label: c.reference, hint: "Contrato", group: "Contratos", to: "/app/admin/contracts" });
  });

  data.payments.forEach((p) => {
    if (match(p.reference))
      hits.push({ id: p.id, label: p.reference, hint: "Pagamento", group: "Pagamentos", to: "/app/admin/payments" });
  });

  data.guarantees.forEach((g) => {
    if (match(g.description))
      hits.push({ id: g.id, label: g.description, hint: "Garantia", group: "Garantias", to: "/app/admin/guarantees" });
  });

  data.disbursements.forEach((d) => {
    if (match(d.reference))
      hits.push({ id: d.id, label: d.reference ?? d.id, hint: "Desembolso", group: "Desembolsos", to: "/app/admin/disbursements" });
  });

  return hits.slice(0, limit);
}
