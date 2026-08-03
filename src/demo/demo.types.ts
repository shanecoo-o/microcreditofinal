/**
 * Tipos canónicos do MVP demonstrativo JCF Microcrédito.
 * Terminologia em português: Pedido de Crédito, Crédito, Cliente, Prestação, etc.
 */

export type PerfilCodigo =
  | "ADMIN"
  | "MANAGER"
  | "ANALYST"
  | "SUPPORT"
  | "FINANCE"
  | "COLLECTIONS"
  | "AUDIT"
  | "USER";

export type DemoScenario = "INITIAL" | "APPROVED" | "DISBURSED" | "PAID";

export interface Permission {
  id: string;
  key: string;
  description: string;
}

export interface Role {
  id: string;
  code: PerfilCodigo;
  name: string;
  description: string;
  permissions: string[];
}

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: PerfilCodigo;
  branchId?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  clientId?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  identityNumber: string;
  profession: string;
  businessName?: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  branchId: string;
  createdAt: string;
  address?: string;
}

export interface CreditProduct {
  id: string;
  code: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  terms: number[];
  monthlyRate: number;
}

export type ApplicationStatus =
  | "PRE_CANDIDATURA"
  | "EM_ANALISE"
  | "AGUARDA_DOCUMENTOS"
  | "APROVADO"
  | "CONTRATO"
  | "DESEMBOLSADO"
  | "RECUSADO"
  | "CANCELADO";

export type RiskLevel = "BAIXO" | "MEDIO" | "ALTO";

/** Etapas do pipeline operacional (Centro de Operações). */
export type OpsStage =
  | "NOVOS"
  | "DOCUMENTOS"
  | "VERIFICACAO"
  | "ANALISE"
  | "APROVACAO"
  | "CONTRATO"
  | "DESEMBOLSO";

export type Priority = "ALTA" | "MEDIA" | "BAIXA";

export interface LoanApplication {
  id: string;
  processId: string;
  clientId: string;
  productId: string;
  requestedAmount: number;
  recommendedAmount?: number;
  termMonths: number;
  purpose: string;
  status: ApplicationStatus;
  progress: number;
  nextAction: string;
  origin: "Website" | "Agência" | "Telefone";
  branchId: string;
  analystId?: string;
  managerId?: string;
  risk?: RiskLevel;
  createdAt: string;
  updatedAt: string;
  reference: string;
  loanId?: string;
  /** Etapa operacional; quando ausente é derivada do estado. */
  stage?: OpsStage;
  priority?: Priority;
  /** Data limite de SLA da etapa actual. */
  slaDueAt?: string;
}

export type DocumentStatus = "PENDENTE" | "EM_REVISAO" | "VALIDADO" | "REJEITADO";

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  name: string;
  required: boolean;
  status: DocumentStatus;
  fileName?: string;
  uploadedAt?: string;
  note?: string;
}

export interface Guarantee {
  id: string;
  applicationId: string;
  description: string;
  type: "STOCK" | "EQUIPAMENTO" | "VEICULO" | "IMOVEL" | "OUTRO";
  appraisedValue: number;
  coverageRatio: number;
  status: "PROPOSTA" | "ACEITE" | "REJEITADA";
  createdAt: string;
}

export interface Guarantor {
  id: string;
  applicationId: string;
  name: string;
  phone: string;
  relation: string;
  identityNumber: string;
  status: "PENDENTE" | "ACEITE" | "REJEITADO";
}

export interface CreditAnalysis {
  id: string;
  applicationId: string;
  analystId: string;
  /** Interno — nunca exposto ao cliente. */
  internalScore: number;
  risk: RiskLevel;
  debtToIncome: number;
  /** Interno — nunca exposto ao cliente. */
  internalNotes: string;
  recommendedAmount: number;
  recommendedTerm: number;
  createdAt: string;
}

export interface CreditDecision {
  id: string;
  applicationId: string;
  decision: "APROVADO" | "RECUSADO" | "APROVADO_COM_CONDICOES";
  approvedAmount?: number;
  termMonths?: number;
  decidedById: string;
  /** Interno — nunca exposto ao cliente. */
  internalComment?: string;
  clientMessage: string;
  decidedAt: string;
}

export type AppointmentService =
  | "PRIMEIRA_CONSULTA"
  | "APOIO_CANDIDATURA"
  | "ENTREGA_DOCUMENTOS"
  | "ENTREVISTA_CREDITO"
  | "ASSINATURA_CONTRATO"
  | "APOIO_PAGAMENTO"
  | "RENEGOCIACAO";

export type AppointmentMode = "PRESENCIAL" | "ONLINE" | "TELEFONE";

export type AppointmentStatus =
  | "AGUARDA_CONFIRMACAO"
  | "CONFIRMADA"
  | "EM_ESPERA"
  | "EM_ATENDIMENTO"
  | "REALIZADA"
  | "NAO_COMPARECEU"
  | "CANCELADA"
  | "REMARCADA"
  | "EXPIRADA"
  | "TRANSFERIDA";

export interface Appointment {
  id: string;
  code: string;
  service: AppointmentService;
  mode: AppointmentMode;
  branchId?: string;
  consultantId?: string;
  date: string;
  time: string;
  clientId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  applicationId?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
  rescheduledFrom?: { date: string; time: string };
  cancelReason?: string;
}

export interface AvailabilitySlot {
  id: string;
  date: string;
  time: string;
  branchId: string;
  consultantId: string;
  capacity: number;
  booked: number;
}

export interface Contract {
  id: string;
  applicationId: string;
  reference: string;
  status: "PENDENTE" | "PREPARADO" | "ASSINADO" | "ANULADO";
  amount: number;
  termMonths: number;
  monthlyRate: number;
  preparedAt?: string;
  signedAt?: string;
  clauses: string[];
}

export interface Disbursement {
  id: string;
  applicationId: string;
  contractId: string;
  amount: number;
  method: "TRANSFERENCIA" | "CARTEIRA_MOVEL" | "BALCAO";
  status: "PENDENTE" | "PREPARADO" | "AUTORIZADO" | "PROCESSANDO" | "EXECUTADO" | "FALHADO";
  preparedAt?: string;
  authorizedAt?: string;
  executedAt?: string;
  authorizedById?: string;
  preparedById?: string;
  /** Referência demonstrativa do desembolso (ex.: DSB-DEMO-2026-00124). */
  reference?: string;
  /** Canal demonstrativo: M-Pesa, e-Mola, transferência, numerário. */
  channel?: string;
  /** Destino demonstrativo (número de carteira ou conta). */
  destination?: string;
}

export type LoanStatus = "ACTIVO" | "LIQUIDADO" | "EM_ATRASO" | "RENEGOCIADO";

export interface Loan {
  id: string;
  loanId: string;
  applicationId: string;
  clientId: string;
  productId: string;
  principal: number;
  termMonths: number;
  monthlyRate: number;
  outstandingBalance: number;
  status: LoanStatus;
  disbursedAt: string;
  firstInstallmentDate: string;
}

export type InstallmentStatus = "PENDENTE" | "PAGA" | "PARCIAL" | "EM_ATRASO";

export interface Installment {
  id: string;
  loanId: string;
  number: number;
  dueDate: string;
  principal: number;
  interest: number;
  total: number;
  paidAmount: number;
  status: InstallmentStatus;
  paidAt?: string;
}

export interface Payment {
  id: string;
  loanId: string;
  installmentId?: string;
  amount: number;
  method: "CARTEIRA_MOVEL" | "TRANSFERENCIA" | "BALCAO";
  reference: string;
  status: "CONFIRMADO_DEMO";
  createdAt: string;
  receiptId: string;
  /** Reconciliação demonstrativa. */
  reconciled?: boolean;
  reconciledAt?: string;
}

export interface Receipt {
  id: string;
  paymentId: string;
  loanId: string;
  number: string;
  amount: number;
  issuedAt: string;
  clientName: string;
  note: string;
}

export interface Notification {
  id: string;
  userId?: string;
  clientId?: string;
  title: string;
  message: string;
  level: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface TimelineEvent {
  id: string;
  /** Entidade a que pertence: applicationId ou loanId */
  subjectId: string;
  title: string;
  description?: string;
  actor: string;
  createdAt: string;
  visibility: "CLIENTE" | "INTERNO";
  kind: "PEDIDO" | "DOCUMENTO" | "ANALISE" | "DECISAO" | "CONTRATO" | "DESEMBOLSO" | "PAGAMENTO" | "MARCACAO";
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  module: string;
  ip: string;
  createdAt: string;
  detail?: string;
}

export interface DemoData {
  scenario: DemoScenario;
  users: User[];
  roles: Role[];
  permissions: Permission[];
  branches: Branch[];
  clients: Client[];
  products: CreditProduct[];
  applications: LoanApplication[];
  documents: ApplicationDocument[];
  guarantees: Guarantee[];
  guarantors: Guarantor[];
  analyses: CreditAnalysis[];
  decisions: CreditDecision[];
  appointments: Appointment[];
  slots: AvailabilitySlot[];
  contracts: Contract[];
  disbursements: Disbursement[];
  loans: Loan[];
  installments: Installment[];
  payments: Payment[];
  receipts: Receipt[];
  notifications: Notification[];
  timeline: TimelineEvent[];
  audit: AuditEvent[];
  /** Registos de cobrança (opcionais em sessões demo antigas). */
  collectionContacts?: CollectionContact[];
  paymentPromises?: PaymentPromise[];
  slotBlocks?: SlotBlock[];
}

export interface CollectionContact {
  id: string;
  loanId: string;
  clientId: string;
  channel: "TELEFONE" | "SMS" | "VISITA" | "WHATSAPP";
  outcome: string;
  note?: string;
  agentId: string;
  createdAt: string;
}

export interface PaymentPromise {
  id: string;
  loanId: string;
  clientId: string;
  amount: number;
  promisedDate: string;
  status: "ACTIVA" | "CUMPRIDA" | "INCUMPRIDA";
  agentId: string;
  createdAt: string;
}

export interface SlotBlock {
  id: string;
  date: string;
  time: string;
  branchId: string;
  consultantId: string;
  reason: string;
  createdAt: string;
}
