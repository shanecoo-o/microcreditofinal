import type {
  Appointment,
  ApplicationDocument,
  AuditEvent,
  AvailabilitySlot,
  Client,
  CreditAnalysis,
  DemoData,
  Guarantee,
  Guarantor,
  LoanApplication,
  Notification,
  TimelineEvent,
  User,
} from "../demo.types";
import { REQUIRED_DOCUMENTS } from "../demo.constants";
import { branches, permissions, products, roles } from "./catalog";
import { APPOINTMENT_TIMES } from "../demo.constants";

/* ============ Datas determinísticas (sem Math.random, sem datas fixas) ============ */

export const BASE_DATE = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

export const isoDay = (offsetDays: number) => {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export const isoAt = (offsetDays: number, hour = 9, minute = 0) => {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

/* ============ Utilizadores internos e cliente ============ */

export const users: User[] = [
  {
    id: "USR-001",
    name: "Direcção JCF",
    email: "admin@jcf.co.mz",
    phone: "+258 84 300 0001",
    role: "ADMIN",
    branchId: "AGE-MAP",
    status: "ACTIVE",
    createdAt: isoAt(-420),
  },
  {
    id: "USR-002",
    name: "Marta Tembe",
    email: "gestor@jcf.co.mz",
    phone: "+258 84 300 0002",
    role: "MANAGER",
    branchId: "AGE-MAP",
    status: "ACTIVE",
    createdAt: isoAt(-390),
  },
  {
    id: "USR-003",
    name: "Ana Cossa",
    email: "analista@jcf.co.mz",
    phone: "+258 84 300 0003",
    role: "ANALYST",
    branchId: "AGE-MAP",
    status: "ACTIVE",
    createdAt: isoAt(-360),
  },
  {
    id: "USR-004",
    name: "Bruno Mahumane",
    email: "atendimento@jcf.co.mz",
    phone: "+258 84 300 0004",
    role: "SUPPORT",
    branchId: "AGE-BOA",
    status: "ACTIVE",
    createdAt: isoAt(-300),
  },
  {
    id: "USR-005",
    name: "Sónia Macuácua",
    email: "financeiro@jcf.co.mz",
    phone: "+258 84 300 0005",
    role: "FINANCE",
    branchId: "AGE-MAP",
    status: "ACTIVE",
    createdAt: isoAt(-280),
  },
  {
    id: "USR-006",
    name: "Hélder Sitoe",
    email: "cobrancas@jcf.co.mz",
    phone: "+258 84 300 0006",
    role: "COLLECTIONS",
    branchId: "AGE-MAT",
    status: "ACTIVE",
    createdAt: isoAt(-260),
  },
  {
    id: "USR-007",
    name: "Lúcia Banze",
    email: "auditoria@jcf.co.mz",
    phone: "+258 84 300 0007",
    role: "AUDIT",
    branchId: "AGE-MAP",
    status: "ACTIVE",
    createdAt: isoAt(-240),
  },
  {
    id: "USR-100",
    name: "Carlos Nhantumbo",
    email: "carlos@demo.jcf.co.mz",
    phone: "+258 84 512 4300",
    role: "USER",
    status: "ACTIVE",
    createdAt: isoAt(-45),
    clientId: "CLI-2026-0001",
  },
];

export const CONSULTANTS = users.filter((u) =>
  ["MANAGER", "ANALYST", "SUPPORT"].includes(u.role),
);

/* ============ Clientes ============ */

export const clients: Client[] = [
  {
    id: "CLI-2026-0001",
    name: "Carlos Nhantumbo",
    email: "carlos@demo.jcf.co.mz",
    phone: "+258 84 512 4300",
    identityNumber: "110100234567A",
    profession: "Comerciante",
    businessName: "Mercearia Nhantumbo",
    monthlyIncome: 65000,
    monthlyExpenses: 28500,
    branchId: "AGE-MAP",
    createdAt: isoAt(-45),
    address: "Bairro Central, Maputo",
  },
  {
    id: "CLI-2026-0002",
    name: "Eugénia Chissano",
    email: "eugenia@demo.jcf.co.mz",
    phone: "+258 84 512 4301",
    identityNumber: "110100987651B",
    profession: "Costureira",
    businessName: "Atelier Eugénia",
    monthlyIncome: 42000,
    monthlyExpenses: 19000,
    branchId: "AGE-BOA",
    createdAt: isoAt(-120),
  },
  {
    id: "CLI-2026-0003",
    name: "Jorge Matlombe",
    email: "jorge@demo.jcf.co.mz",
    phone: "+258 84 512 4302",
    identityNumber: "110100445533C",
    profession: "Transportador",
    businessName: "Matlombe Transportes",
    monthlyIncome: 88000,
    monthlyExpenses: 51000,
    branchId: "AGE-MAT",
    createdAt: isoAt(-200),
  },
];

/* ============ Pedidos de crédito ============ */

export const applications: LoanApplication[] = [
  {
    id: "APP-0001",
    processId: "PRC-2026-00051",
    clientId: "CLI-2026-0001",
    productId: "PRD-CGI",
    requestedAmount: 350000,
    recommendedAmount: 300000,
    termMonths: 12,
    purpose: "Capital de giro",
    status: "EM_ANALISE",
    progress: 55,
    nextAction: "Entrevista de análise",
    origin: "Website",
    branchId: "AGE-MAP",
    analystId: "USR-003",
    managerId: "USR-002",
    risk: "MEDIO",
    createdAt: isoAt(-12, 10, 15),
    updatedAt: isoAt(-2, 16, 40),
    reference: "JCF-PRC-00051",
  },
  {
    id: "APP-0002",
    processId: "PRC-2026-00048",
    clientId: "CLI-2026-0002",
    productId: "PRD-PES",
    requestedAmount: 90000,
    termMonths: 9,
    purpose: "Compra de stock",
    status: "AGUARDA_DOCUMENTOS",
    progress: 30,
    nextAction: "Entregar comprovativo de rendimento",
    origin: "Agência",
    branchId: "AGE-BOA",
    analystId: "USR-003",
    risk: "BAIXO",
    createdAt: isoAt(-20, 11, 0),
    updatedAt: isoAt(-5, 9, 30),
    reference: "JCF-PRC-00048",
  },
  {
    id: "APP-0003",
    processId: "PRC-2026-00042",
    clientId: "CLI-2026-0003",
    productId: "PRD-EQP",
    requestedAmount: 250000,
    recommendedAmount: 250000,
    termMonths: 18,
    purpose: "Equipamento",
    status: "APROVADO",
    progress: 80,
    nextAction: "Preparar contrato",
    origin: "Telefone",
    branchId: "AGE-MAT",
    analystId: "USR-003",
    managerId: "USR-002",
    risk: "MEDIO",
    createdAt: isoAt(-35, 8, 45),
    updatedAt: isoAt(-8, 15, 10),
    reference: "JCF-PRC-00042",
  },
];

/* ============ Documentos ============ */

export const documents: ApplicationDocument[] = [
  ...REQUIRED_DOCUMENTS.map((name, i) => ({
    id: `DOC-0001-${i + 1}`,
    applicationId: "APP-0001",
    name,
    required: true,
    status:
      name === "Comprovativo de residência"
        ? ("EM_REVISAO" as const)
        : name === "Documento da garantia"
          ? ("PENDENTE" as const)
          : ("VALIDADO" as const),
    fileName: name === "Documento da garantia" ? undefined : `${name.toLowerCase().replace(/[^a-z]+/g, "-")}.pdf`,
    uploadedAt: name === "Documento da garantia" ? undefined : isoAt(-11, 12, 0),
    note:
      name === "Comprovativo de residência"
        ? "Documento em revisão pelo analista de crédito."
        : undefined,
  })),
  ...REQUIRED_DOCUMENTS.slice(0, 3).map((name, i) => ({
    id: `DOC-0002-${i + 1}`,
    applicationId: "APP-0002",
    name,
    required: true,
    status: i === 2 ? ("PENDENTE" as const) : ("VALIDADO" as const),
    uploadedAt: i === 2 ? undefined : isoAt(-19, 10, 0),
  })),
];

/* ============ Garantias e avalistas ============ */

export const guarantees: Guarantee[] = [
  {
    id: "GAR-0001",
    applicationId: "APP-0001",
    description: "Stock comercial e equipamento da Mercearia Nhantumbo",
    type: "STOCK",
    appraisedValue: 420000,
    coverageRatio: 1.4,
    status: "ACEITE",
    createdAt: isoAt(-10, 14, 0),
  },
  {
    id: "GAR-0002",
    applicationId: "APP-0003",
    description: "Viatura de transporte de mercadoria",
    type: "VEICULO",
    appraisedValue: 380000,
    coverageRatio: 1.52,
    status: "ACEITE",
    createdAt: isoAt(-30, 9, 0),
  },
];

export const guarantors: Guarantor[] = [
  {
    id: "AVL-0001",
    applicationId: "APP-0001",
    name: "Amélia Nhantumbo",
    phone: "+258 84 512 4310",
    relation: "Cônjuge",
    identityNumber: "110100234599D",
    status: "ACEITE",
  },
];

/* ============ Análise ============ */

export const analyses: CreditAnalysis[] = [
  {
    id: "ANL-0001",
    applicationId: "APP-0001",
    analystId: "USR-003",
    internalScore: 682,
    risk: "MEDIO",
    debtToIncome: 0.44,
    internalNotes:
      "Negócio com histórico estável. Recomenda-se reduzir o montante solicitado e confirmar residência.",
    recommendedAmount: 300000,
    recommendedTerm: 12,
    createdAt: isoAt(-3, 11, 20),
  },
];

/* ============ Marcações e disponibilidade ============ */

export const appointments: Appointment[] = [
  {
    id: "APT-0001",
    code: "JCF-A18-2608",
    service: "ENTREVISTA_CREDITO",
    mode: "PRESENCIAL",
    branchId: "AGE-MAP",
    consultantId: "USR-003",
    date: isoDay(3),
    time: "10:00",
    clientId: "CLI-2026-0001",
    clientName: "Carlos Nhantumbo",
    clientPhone: "+258 84 512 4300",
    clientEmail: "carlos@demo.jcf.co.mz",
    applicationId: "APP-0001",
    status: "CONFIRMADA",
    createdAt: isoAt(-4, 9, 10),
    notes: "Trazer comprovativo de residência actualizado.",
  },
  {
    id: "APT-0002",
    code: "JCF-B07-1145",
    service: "ENTREGA_DOCUMENTOS",
    mode: "PRESENCIAL",
    branchId: "AGE-BOA",
    consultantId: "USR-004",
    date: isoDay(-6),
    time: "09:15",
    clientId: "CLI-2026-0002",
    clientName: "Eugénia Chissano",
    clientPhone: "+258 84 512 4301",
    applicationId: "APP-0002",
    status: "REALIZADA",
    createdAt: isoAt(-12, 8, 0),
  },
];

/** Slots determinísticos: dias úteis das próximas 4 semanas. */
export function buildSlots(): AvailabilitySlot[] {
  const slots: AvailabilitySlot[] = [];
  for (let day = 1; day <= 28; day += 1) {
    const date = new Date(BASE_DATE);
    date.setDate(date.getDate() + day);
    const weekday = date.getDay();
    if (weekday === 0 || weekday === 6) continue;
    const dateStr = date.toISOString().slice(0, 10);

    branches.forEach((branch, bIdx) => {
      CONSULTANTS.forEach((consultant, cIdx) => {
        APPOINTMENT_TIMES.forEach((time, tIdx) => {
          // Padrão determinístico de disponibilidade (sem aleatoriedade).
          const closed = (day + bIdx + cIdx + tIdx) % 4 === 0;
          if (closed) return;
          slots.push({
            id: `SLT-${dateStr}-${branch.id}-${consultant.id}-${time.replace(":", "")}`,
            date: dateStr,
            time,
            branchId: branch.id,
            consultantId: consultant.id,
            capacity: 1,
            booked: 0,
          });
        });
      });
    });
  }

  // Reflectir marcações já existentes
  appointments
    .filter((a) => a.status === "CONFIRMADA" || a.status === "REMARCADA")
    .forEach((a) => {
      const slot = slots.find(
        (s) => s.date === a.date && s.time === a.time && s.consultantId === a.consultantId,
      );
      if (slot) slot.booked = slot.capacity;
    });

  return slots;
}

/* ============ Notificações, timeline e auditoria ============ */

export const notifications: Notification[] = [
  {
    id: "NOT-0001",
    clientId: "CLI-2026-0001",
    title: "Documento em revisão",
    message: "O comprovativo de residência está em revisão pela equipa de análise.",
    level: "warning",
    read: false,
    createdAt: isoAt(-2, 16, 45),
    link: "/app/applications/PRC-2026-00051",
  },
  {
    id: "NOT-0002",
    clientId: "CLI-2026-0001",
    title: "Marcação confirmada",
    message: "Entrevista de crédito confirmada. Código JCF-A18-2608.",
    level: "success",
    read: false,
    createdAt: isoAt(-4, 9, 12),
    link: "/app/appointments",
  },
  {
    id: "NOT-0003",
    userId: "USR-003",
    title: "Pedido atribuído",
    message: "Pedido PRC-2026-00051 atribuído para análise.",
    level: "info",
    read: true,
    createdAt: isoAt(-11, 9, 0),
  },
];

export const timeline: TimelineEvent[] = [
  {
    id: "TML-0001",
    subjectId: "APP-0001",
    title: "Pedido de crédito submetido",
    description: "Pré-candidatura recebida através do website.",
    actor: "Carlos Nhantumbo",
    createdAt: isoAt(-12, 10, 15),
    visibility: "CLIENTE",
    kind: "PEDIDO",
  },
  {
    id: "TML-0002",
    subjectId: "APP-0001",
    title: "Documentos recebidos",
    description: "Quatro documentos submetidos para verificação.",
    actor: "Atendimento",
    createdAt: isoAt(-11, 12, 5),
    visibility: "CLIENTE",
    kind: "DOCUMENTO",
  },
  {
    id: "TML-0003",
    subjectId: "APP-0001",
    title: "Análise de crédito iniciada",
    description: "Processo em análise pela analista Ana Cossa.",
    actor: "Ana Cossa",
    createdAt: isoAt(-3, 11, 20),
    visibility: "CLIENTE",
    kind: "ANALISE",
  },
  {
    id: "TML-0004",
    subjectId: "APP-0001",
    title: "Notas internas de análise registadas",
    description: "Score interno e rácio de endividamento actualizados.",
    actor: "Ana Cossa",
    createdAt: isoAt(-3, 11, 25),
    visibility: "INTERNO",
    kind: "ANALISE",
  },
  {
    id: "TML-0005",
    subjectId: "APP-0001",
    title: "Entrevista de análise marcada",
    description: "Marcação JCF-A18-2608.",
    actor: "Atendimento",
    createdAt: isoAt(-4, 9, 10),
    visibility: "CLIENTE",
    kind: "MARCACAO",
  },
];

export const audit: AuditEvent[] = [
  {
    id: "AUD-0001",
    actor: "atendimento@jcf.co.mz",
    action: "Criou pedido de crédito PRC-2026-00051",
    module: "Pedidos de Crédito",
    ip: "197.218.10.14",
    createdAt: isoAt(-12, 10, 16),
  },
  {
    id: "AUD-0002",
    actor: "analista@jcf.co.mz",
    action: "Registou análise ANL-0001",
    module: "Análise",
    ip: "197.218.10.22",
    createdAt: isoAt(-3, 11, 21),
  },
  {
    id: "AUD-0003",
    actor: "gestor@jcf.co.mz",
    action: "Consultou garantia GAR-0001",
    module: "Garantias",
    ip: "197.218.10.31",
    createdAt: isoAt(-2, 14, 5),
  },
];

/* ============ Estado inicial ============ */

export function buildInitialDemoData(): DemoData {
  return {
    scenario: "INITIAL",
    users: users.map((u) => ({ ...u })),
    roles: roles.map((r) => ({ ...r })),
    permissions: permissions.map((p) => ({ ...p })),
    branches: branches.map((b) => ({ ...b })),
    clients: clients.map((c) => ({ ...c })),
    products: products.map((p) => ({ ...p })),
    applications: applications.map((a) => ({ ...a })),
    documents: documents.map((d) => ({ ...d })),
    guarantees: guarantees.map((g) => ({ ...g })),
    guarantors: guarantors.map((g) => ({ ...g })),
    analyses: analyses.map((a) => ({ ...a })),
    decisions: [],
    appointments: appointments.map((a) => ({ ...a })),
    slots: buildSlots(),
    contracts: [],
    disbursements: [],
    loans: [],
    installments: [],
    payments: [],
    receipts: [],
    notifications: notifications.map((n) => ({ ...n })),
    timeline: timeline.map((t) => ({ ...t })),
    audit: audit.map((a) => ({ ...a })),
  };
}

export { branches, permissions, products, roles } from "./catalog";
