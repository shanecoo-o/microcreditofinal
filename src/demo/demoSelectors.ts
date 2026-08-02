import type {
  Appointment,
  ApplicationDocument,
  Client,
  DemoData,
  Installment,
  Loan,
  LoanApplication,
} from "./demo.types";

/* ============ Selectores puros ============ */

export const selectClient = (data: DemoData, clientId?: string): Client | undefined =>
  data.clients.find((c) => c.id === clientId);

export const selectClientByEmail = (data: DemoData, email: string): Client | undefined =>
  data.clients.find((c) => c.email.toLowerCase() === email.toLowerCase());

export const selectProduct = (data: DemoData, productId?: string) =>
  data.products.find((p) => p.id === productId);

export const selectBranch = (data: DemoData, branchId?: string) =>
  data.branches.find((b) => b.id === branchId);

export const selectUser = (data: DemoData, userId?: string) =>
  data.users.find((u) => u.id === userId);

export const selectApplications = (data: DemoData, clientId?: string): LoanApplication[] =>
  data.applications
    .filter((a) => (clientId ? a.clientId === clientId : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const selectApplicationByProcess = (
  data: DemoData,
  processId: string,
): LoanApplication | undefined => data.applications.find((a) => a.processId === processId);

export const selectDocuments = (data: DemoData, applicationId?: string): ApplicationDocument[] =>
  data.documents.filter((d) => d.applicationId === applicationId);

export const selectPendingDocuments = (data: DemoData, applicationId?: string) =>
  selectDocuments(data, applicationId).filter((d) => d.status === "PENDENTE" || d.status === "REJEITADO");

export const selectGuarantees = (data: DemoData, applicationId?: string) =>
  data.guarantees.filter((g) => g.applicationId === applicationId);

export const selectGuarantors = (data: DemoData, applicationId?: string) =>
  data.guarantors.filter((g) => g.applicationId === applicationId);

export const selectAnalysis = (data: DemoData, applicationId?: string) =>
  data.analyses.find((a) => a.applicationId === applicationId);

export const selectDecision = (data: DemoData, applicationId?: string) =>
  data.decisions.find((d) => d.applicationId === applicationId);

export const selectContract = (data: DemoData, applicationId?: string) =>
  data.contracts.find((c) => c.applicationId === applicationId);

export const selectDisbursement = (data: DemoData, applicationId?: string) =>
  data.disbursements.find((d) => d.applicationId === applicationId);

export const selectAppointments = (
  data: DemoData,
  filters: { clientId?: string; applicationId?: string } = {},
): Appointment[] =>
  data.appointments
    .filter((a) => (filters.clientId ? a.clientId === filters.clientId : true))
    .filter((a) => (filters.applicationId ? a.applicationId === filters.applicationId : true))
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));

const isFuture = (a: Appointment) => new Date(`${a.date}T${a.time}:00`).getTime() >= Date.now();

export const selectUpcomingAppointments = (data: DemoData, clientId?: string) =>
  selectAppointments(data, { clientId }).filter(
    (a) => (a.status === "CONFIRMADA" || a.status === "REMARCADA") && isFuture(a),
  );

export const selectPastAppointments = (data: DemoData, clientId?: string) =>
  selectAppointments(data, { clientId }).filter(
    (a) => a.status === "REALIZADA" || ((a.status === "CONFIRMADA" || a.status === "REMARCADA") && !isFuture(a)),
  );

export const selectCancelledAppointments = (data: DemoData, clientId?: string) =>
  selectAppointments(data, { clientId }).filter((a) => a.status === "CANCELADA");

export const selectAvailableSlots = (
  data: DemoData,
  filters: { date?: string; branchId?: string; consultantId?: string },
) =>
  data.slots.filter(
    (s) =>
      s.booked < s.capacity &&
      (filters.date ? s.date === filters.date : true) &&
      (filters.branchId ? s.branchId === filters.branchId : true) &&
      (filters.consultantId ? s.consultantId === filters.consultantId : true),
  );

export const selectAvailableDates = (
  data: DemoData,
  filters: { branchId?: string; consultantId?: string } = {},
) =>
  Array.from(new Set(selectAvailableSlots(data, filters).map((s) => s.date))).sort();

export const selectLoans = (data: DemoData, clientId?: string): Loan[] =>
  data.loans.filter((l) => (clientId ? l.clientId === clientId : true));

export const selectLoanByReference = (data: DemoData, reference: string): Loan | undefined =>
  data.loans.find((l) => l.loanId === reference || l.id === reference);

export const selectInstallments = (data: DemoData, loanId?: string): Installment[] =>
  data.installments.filter((i) => i.loanId === loanId).sort((a, b) => a.number - b.number);

export const selectNextInstallment = (data: DemoData, loanId?: string) =>
  selectInstallments(data, loanId).find((i) => i.status !== "PAGA");

export const selectPayments = (data: DemoData, loanId?: string) =>
  data.payments
    .filter((p) => (loanId ? p.loanId === loanId : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const selectReceipts = (data: DemoData, loanId?: string) =>
  data.receipts
    .filter((r) => (loanId ? r.loanId === loanId : true))
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));

export const selectNotifications = (
  data: DemoData,
  filters: { clientId?: string; userId?: string } = {},
) =>
  data.notifications
    .filter((n) =>
      filters.clientId ? n.clientId === filters.clientId : filters.userId ? n.userId === filters.userId || !n.clientId : true,
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

/** Timeline visível ao cliente — nunca expõe eventos internos. */
export const selectClientTimeline = (data: DemoData, subjectId?: string) =>
  data.timeline
    .filter((t) => t.subjectId === subjectId && t.visibility === "CLIENTE")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const selectInternalTimeline = (data: DemoData, subjectId?: string) =>
  data.timeline
    .filter((t) => t.subjectId === subjectId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const selectAudit = (data: DemoData) =>
  [...data.audit].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

/** Resumo do cliente para o portal. */
export function selectClientOverview(data: DemoData, clientId?: string) {
  const applications = selectApplications(data, clientId);
  const activeApplication =
    applications.find((a) => !["RECUSADO", "CANCELADO", "DESEMBOLSADO"].includes(a.status)) ??
    applications[0];
  const loans = selectLoans(data, clientId);
  const activeLoan = loans.find((l) => l.status !== "LIQUIDADO") ?? loans[0];
  const installments = selectInstallments(data, activeLoan?.id);

  return {
    applications,
    activeApplication,
    pendingDocuments: selectPendingDocuments(data, activeApplication?.id),
    upcomingAppointments: selectUpcomingAppointments(data, clientId),
    loans,
    activeLoan,
    installments,
    nextInstallment: installments.find((i) => i.status !== "PAGA"),
    payments: selectPayments(data, activeLoan?.id),
    notifications: selectNotifications(data, { clientId }),
  };
}
