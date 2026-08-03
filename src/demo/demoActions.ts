import type {
  Appointment,
  AppointmentMode,
  AppointmentService,
  ApplicationStatus,
  Client,
  DemoData,
  LoanApplication,
} from "./demo.types";
import { demoStore, nextId, nextSequence, nowIso } from "./demoStore";
import { REQUIRED_DOCUMENTS } from "./demo.constants";
import { buildSchedule, simulateCredit } from "@/domain/simulation";

/* ============ Utilitários internos ============ */

function pushTimeline(
  data: DemoData,
  subjectId: string,
  entry: {
    title: string;
    description?: string;
    actor: string;
    visibility?: "CLIENTE" | "INTERNO";
    kind: DemoData["timeline"][number]["kind"];
  },
): DemoData["timeline"] {
  return [
    ...data.timeline,
    {
      id: nextId("TML", data.timeline),
      subjectId,
      title: entry.title,
      description: entry.description,
      actor: entry.actor,
      createdAt: nowIso(),
      visibility: entry.visibility ?? "CLIENTE",
      kind: entry.kind,
    },
  ];
}

function pushAudit(
  data: DemoData,
  entry: { actor: string; action: string; module: string; detail?: string },
): DemoData["audit"] {
  return [
    {
      id: nextId("AUD", data.audit),
      actor: entry.actor,
      action: entry.action,
      module: entry.module,
      ip: "197.218.10.10",
      createdAt: nowIso(),
      detail: entry.detail,
    },
    ...data.audit,
  ];
}

function pushNotification(
  data: DemoData,
  entry: {
    title: string;
    message: string;
    level?: "info" | "success" | "warning" | "error";
    clientId?: string;
    userId?: string;
    link?: string;
  },
): DemoData["notifications"] {
  return [
    {
      id: nextId("NOT", data.notifications),
      clientId: entry.clientId,
      userId: entry.userId,
      title: entry.title,
      message: entry.message,
      level: entry.level ?? "info",
      read: false,
      createdAt: nowIso(),
      link: entry.link,
    },
    ...data.notifications,
  ];
}

function appointmentCode(data: DemoData): string {
  const seq = nextSequence(
    data.appointments.map((a) => a.code),
    /JCF-[A-Z](\d{2})/,
  );
  const letters = "ABCDEFGHJKLMNPQRSTUVXZ";
  const letter = letters[(data.appointments.length + 1) % letters.length];
  const suffix = String(1000 + ((data.appointments.length + 1) * 137) % 8999);
  return `JCF-${letter}${String(seq).padStart(2, "0")}-${suffix}`;
}

/* ============ Pré-candidatura e documentos ============ */

export interface PreApplicationInput {
  fullName: string;
  phone: string;
  productId: string;
  amount: number;
  termMonths: number;
  purpose: string;
  branchId: string;
  contactPreference: string;
  email?: string;
  consent: boolean;
}

export function createPreApplication(input: PreApplicationInput): {
  application: LoanApplication;
  client: Client;
} {
  let created!: { application: LoanApplication; client: Client };

  demoStore.update((data) => {
    const existingClient = data.clients.find(
      (c) => c.phone === input.phone || (input.email && c.email === input.email),
    );

    const client: Client =
      existingClient ??
      {
        id: `CLI-${new Date().getFullYear()}-${String(data.clients.length + 1).padStart(4, "0")}`,
        name: input.fullName,
        email: input.email ?? "",
        phone: input.phone,
        identityNumber: "",
        profession: "",
        monthlyIncome: 0,
        monthlyExpenses: 0,
        branchId: input.branchId,
        createdAt: nowIso(),
      };

    const seq = nextSequence(
      data.applications.map((a) => a.processId),
      /PRC-\d{4}-(\d{5})/,
    );
    const processId = `PRC-${new Date().getFullYear()}-${String(seq).padStart(5, "0")}`;
    const id = nextId("APP", data.applications);

    const application: LoanApplication = {
      id,
      processId,
      clientId: client.id,
      productId: input.productId,
      requestedAmount: input.amount,
      termMonths: input.termMonths,
      purpose: input.purpose,
      status: "PRE_CANDIDATURA",
      progress: 15,
      nextAction: "Completar documentos do pedido",
      origin: "Website",
      branchId: input.branchId,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      reference: `JCF-${processId.replace(/PRC-\d{4}-/, "PRC-")}`,
    };

    const documents = [
      ...data.documents,
      ...REQUIRED_DOCUMENTS.map((name, i) => ({
        id: `DOC-${id.replace("APP-", "")}-${i + 1}`,
        applicationId: id,
        name,
        required: true,
        status: "PENDENTE" as const,
      })),
    ];

    created = { application, client };

    return {
      ...data,
      clients: existingClient ? data.clients : [...data.clients, client],
      applications: [application, ...data.applications],
      documents,
      timeline: pushTimeline(data, id, {
        title: "Pré-candidatura submetida",
        description: `Pedido ${processId} recebido através do website.`,
        actor: input.fullName,
        kind: "PEDIDO",
      }),
      notifications: pushNotification(data, {
        clientId: client.id,
        title: "Pré-candidatura registada",
        message: `Referência ${application.reference}. Aguarda validação de documentos.`,
        level: "success",
        link: `/app/applications/${processId}`,
      }),
      audit: pushAudit(data, {
        actor: input.phone,
        action: `Criou pré-candidatura ${processId}`,
        module: "Pedidos de Crédito",
      }),
    };
  });

  return created;
}

export function uploadDemoDocument(documentId: string, fileName: string) {
  demoStore.update((data) => {
    const doc = data.documents.find((d) => d.id === documentId);
    if (!doc) return data;
    return {
      ...data,
      documents: data.documents.map((d) =>
        d.id === documentId
          ? {
              ...d,
              status: "EM_REVISAO" as const,
              fileName,
              uploadedAt: nowIso(),
              note: "Documento guardado apenas na sessão demo.",
            }
          : d,
      ),
      timeline: pushTimeline(data, doc.applicationId, {
        title: `Documento submetido: ${doc.name}`,
        description: "Documento guardado apenas na sessão demo.",
        actor: "Cliente",
        kind: "DOCUMENTO",
      }),
      audit: pushAudit(data, {
        actor: "cliente",
        action: `Submeteu documento ${doc.name}`,
        module: "Documentos",
      }),
    };
  });
}

export function validateDocument(documentId: string, approved: boolean, note?: string) {
  demoStore.update((data) => {
    const doc = data.documents.find((d) => d.id === documentId);
    if (!doc) return data;
    return {
      ...data,
      documents: data.documents.map((d) =>
        d.id === documentId
          ? { ...d, status: approved ? ("VALIDADO" as const) : ("REJEITADO" as const), note }
          : d,
      ),
      timeline: pushTimeline(data, doc.applicationId, {
        title: `${approved ? "Documento validado" : "Documento rejeitado"}: ${doc.name}`,
        description: note,
        actor: "Analista de Crédito",
        kind: "DOCUMENTO",
      }),
      audit: pushAudit(data, {
        actor: "analista@jcf.co.mz",
        action: `${approved ? "Validou" : "Rejeitou"} documento ${doc.name}`,
        module: "Documentos",
      }),
    };
  });
}

export function addApplicationNote(applicationId: string, note: string, internal = true) {
  demoStore.update((data) => ({
    ...data,
    timeline: pushTimeline(data, applicationId, {
      title: internal ? "Nota interna registada" : "Mensagem para o cliente",
      description: note,
      actor: "Equipa JCF",
      visibility: internal ? "INTERNO" : "CLIENTE",
      kind: "ANALISE",
    }),
    audit: pushAudit(data, {
      actor: "equipa@jcf.co.mz",
      action: `Registou nota no pedido ${applicationId}`,
      module: "Pedidos de Crédito",
    }),
  }));
}

/* ============ Marcações ============ */

export interface AppointmentInput {
  service: AppointmentService;
  mode: AppointmentMode;
  branchId?: string;
  consultantId?: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  clientId?: string;
  applicationId?: string;
  notes?: string;
}

export function createAppointment(input: AppointmentInput): Appointment {
  let created!: Appointment;

  demoStore.update((data) => {
    const slot = data.slots.find(
      (s) =>
        s.date === input.date &&
        s.time === input.time &&
        (input.branchId ? s.branchId === input.branchId : true) &&
        (input.consultantId ? s.consultantId === input.consultantId : true) &&
        s.booked < s.capacity,
    );

    const appointment: Appointment = {
      id: nextId("APT", data.appointments),
      code: appointmentCode(data),
      service: input.service,
      mode: input.mode,
      branchId: input.branchId ?? slot?.branchId,
      consultantId: input.consultantId ?? slot?.consultantId,
      date: input.date,
      time: input.time,
      clientId: input.clientId,
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      clientEmail: input.clientEmail,
      applicationId: input.applicationId,
      notes: input.notes,
      status: "CONFIRMADA",
      createdAt: nowIso(),
    };

    created = appointment;

    return {
      ...data,
      appointments: [appointment, ...data.appointments],
      slots: slot
        ? data.slots.map((s) => (s.id === slot.id ? { ...s, booked: s.booked + 1 } : s))
        : data.slots,
      timeline: input.applicationId
        ? pushTimeline(data, input.applicationId, {
            title: "Marcação de atendimento criada",
            description: `Código ${appointment.code}.`,
            actor: input.clientName,
            kind: "MARCACAO",
          })
        : data.timeline,
      notifications: pushNotification(data, {
        clientId: input.clientId,
        title: "Marcação confirmada",
        message: `${input.date} às ${input.time}. Código ${appointment.code}.`,
        level: "success",
        link: "/app/appointments",
      }),
      audit: pushAudit(data, {
        actor: input.clientPhone,
        action: `Criou marcação ${appointment.code}`,
        module: "Atendimento",
      }),
    };
  });

  return created;
}

export function rescheduleAppointment(appointmentId: string, date: string, time: string) {
  demoStore.update((data) => {
    const current = data.appointments.find((a) => a.id === appointmentId);
    if (!current) return data;

    const freedSlotId = data.slots.find(
      (s) => s.date === current.date && s.time === current.time && s.consultantId === current.consultantId,
    )?.id;
    const newSlot = data.slots.find(
      (s) =>
        s.date === date &&
        s.time === time &&
        (current.consultantId ? s.consultantId === current.consultantId : true) &&
        s.booked < s.capacity,
    );

    return {
      ...data,
      appointments: data.appointments.map((a) =>
        a.id === appointmentId
          ? {
              ...a,
              date,
              time,
              status: "REMARCADA" as const,
              rescheduledFrom: { date: current.date, time: current.time },
              consultantId: newSlot?.consultantId ?? a.consultantId,
              branchId: newSlot?.branchId ?? a.branchId,
            }
          : a,
      ),
      slots: data.slots.map((s) => {
        if (freedSlotId && s.id === freedSlotId) return { ...s, booked: Math.max(0, s.booked - 1) };
        if (newSlot && s.id === newSlot.id) return { ...s, booked: s.booked + 1 };
        return s;
      }),
      timeline: current.applicationId
        ? pushTimeline(data, current.applicationId, {
            title: "Marcação remarcada",
            description: `Novo horário: ${date} às ${time}.`,
            actor: current.clientName,
            kind: "MARCACAO",
          })
        : data.timeline,
      notifications: pushNotification(data, {
        clientId: current.clientId,
        title: "Marcação remarcada",
        message: `Nova data: ${date} às ${time}. Código ${current.code}.`,
        level: "info",
        link: "/app/appointments",
      }),
      audit: pushAudit(data, {
        actor: current.clientPhone,
        action: `Remarcou marcação ${current.code}`,
        module: "Atendimento",
      }),
    };
  });
}

export function cancelAppointment(appointmentId: string, reason?: string) {
  demoStore.update((data) => {
    const current = data.appointments.find((a) => a.id === appointmentId);
    if (!current) return data;
    const slotId = data.slots.find(
      (s) => s.date === current.date && s.time === current.time && s.consultantId === current.consultantId,
    )?.id;

    return {
      ...data,
      appointments: data.appointments.map((a) =>
        a.id === appointmentId
          ? { ...a, status: "CANCELADA" as const, cancelReason: reason }
          : a,
      ),
      slots: slotId
        ? data.slots.map((s) => (s.id === slotId ? { ...s, booked: Math.max(0, s.booked - 1) } : s))
        : data.slots,
      timeline: current.applicationId
        ? pushTimeline(data, current.applicationId, {
            title: "Marcação cancelada",
            description: reason,
            actor: current.clientName,
            kind: "MARCACAO",
          })
        : data.timeline,
      notifications: pushNotification(data, {
        clientId: current.clientId,
        title: "Marcação cancelada",
        message: `A marcação ${current.code} foi cancelada.`,
        level: "warning",
        link: "/app/appointments",
      }),
      audit: pushAudit(data, {
        actor: current.clientPhone,
        action: `Cancelou marcação ${current.code}`,
        module: "Atendimento",
      }),
    };
  });
}

/* ============ Decisão, contrato e desembolso ============ */

function setApplication(
  data: DemoData,
  applicationId: string,
  patch: Partial<LoanApplication>,
): LoanApplication[] {
  return data.applications.map((a) =>
    a.id === applicationId ? { ...a, ...patch, updatedAt: nowIso() } : a,
  );
}

export function recordCreditDecision(
  applicationId: string,
  decision: "APROVADO" | "RECUSADO" | "APROVADO_COM_CONDICOES",
  options: { approvedAmount?: number; termMonths?: number; clientMessage: string; internalComment?: string },
) {
  demoStore.update((data) => {
    const app = data.applications.find((a) => a.id === applicationId);
    if (!app) return data;
    const status: ApplicationStatus = decision === "RECUSADO" ? "RECUSADO" : "APROVADO";

    return {
      ...data,
      decisions: [
        ...data.decisions,
        {
          id: nextId("DEC", data.decisions),
          applicationId,
          decision,
          approvedAmount: options.approvedAmount,
          termMonths: options.termMonths ?? app.termMonths,
          decidedById: app.managerId ?? "USR-002",
          internalComment: options.internalComment,
          clientMessage: options.clientMessage,
          decidedAt: nowIso(),
        },
      ],
      applications: setApplication(data, applicationId, {
        status,
        progress: decision === "RECUSADO" ? 100 : 80,
        nextAction: decision === "RECUSADO" ? "Processo encerrado" : "Preparar contrato",
        recommendedAmount: options.approvedAmount ?? app.recommendedAmount,
      }),
      timeline: pushTimeline(data, applicationId, {
        title: decision === "RECUSADO" ? "Pedido recusado" : "Pedido aprovado",
        description: options.clientMessage,
        actor: "Gestor de Crédito",
        kind: "DECISAO",
      }),
      notifications: pushNotification(data, {
        clientId: app.clientId,
        title: decision === "RECUSADO" ? "Decisão do pedido" : "Pedido aprovado",
        message: options.clientMessage,
        level: decision === "RECUSADO" ? "error" : "success",
        link: `/app/applications/${app.processId}`,
      }),
      audit: pushAudit(data, {
        actor: "gestor@jcf.co.mz",
        action: `Registou decisão ${decision} no pedido ${app.processId}`,
        module: "Decisão de Crédito",
      }),
    };
  });
}

export function prepareContract(applicationId: string) {
  demoStore.update((data) => {
    const app = data.applications.find((a) => a.id === applicationId);
    if (!app) return data;
    const product = data.products.find((p) => p.id === app.productId);
    const amount = app.recommendedAmount ?? app.requestedAmount;

    const contract = {
      id: nextId("CTR", data.contracts),
      applicationId,
      reference:
        app.processId === "PRC-2026-00051"
          ? "CTR-2026-00089"
          : `CTR-${app.processId.replace("PRC-", "")}`,
      status: "PREPARADO" as const,
      amount,
      termMonths: app.termMonths,
      monthlyRate: product?.monthlyRate ?? 0.025,
      preparedAt: nowIso(),
      clauses: [
        "Prestações mensais devidas na data indicada no plano de pagamentos.",
        "Garantia mantida até liquidação integral do crédito.",
        "Pagamento antecipado permitido sem penalização.",
        "Cenário demonstrativo — sem efeitos contratuais reais.",
      ],
    };

    return {
      ...data,
      contracts: [...data.contracts, contract],
      applications: setApplication(data, applicationId, {
        status: "CONTRATO",
        progress: 88,
        nextAction: "Assinatura de contrato",
      }),
      timeline: pushTimeline(data, applicationId, {
        title: "Contrato preparado",
        description: `Referência ${contract.reference}.`,
        actor: "Gestor de Crédito",
        kind: "CONTRATO",
      }),
      audit: pushAudit(data, {
        actor: "gestor@jcf.co.mz",
        action: `Preparou contrato ${contract.reference}`,
        module: "Contratos",
      }),
    };
  });
}

export function markContractSigned(contractId: string) {
  demoStore.update((data) => {
    const contract = data.contracts.find((c) => c.id === contractId);
    if (!contract) return data;
    const app = data.applications.find((a) => a.id === contract.applicationId);

    return {
      ...data,
      contracts: data.contracts.map((c) =>
        c.id === contractId ? { ...c, status: "ASSINADO" as const, signedAt: nowIso() } : c,
      ),
      applications: setApplication(data, contract.applicationId, {
        progress: 92,
        nextAction: "Preparar desembolso",
      }),
      timeline: pushTimeline(data, contract.applicationId, {
        title: "Contrato marcado como assinado no cenário demonstrativo",
        actor: "Atendimento",
        kind: "CONTRATO",
      }),
      notifications: app
        ? pushNotification(data, {
            clientId: app.clientId,
            title: "Contrato assinado",
            message: "Contrato marcado como assinado no cenário demonstrativo.",
            level: "success",
            link: `/app/applications/${app.processId}`,
          })
        : data.notifications,
      audit: pushAudit(data, {
        actor: "atendimento@jcf.co.mz",
        action: `Marcou contrato ${contract.reference} como assinado`,
        module: "Contratos",
      }),
    };
  });
}

export function prepareDisbursement(
  contractId: string,
  method: "TRANSFERENCIA" | "CARTEIRA_MOVEL" | "BALCAO" = "CARTEIRA_MOVEL",
  options: { channel?: string; destination?: string; preparedById?: string } = {},
) {
  demoStore.update((data) => {
    const contract = data.contracts.find((c) => c.id === contractId);
    if (!contract) return data;
    const app = data.applications.find((a) => a.id === contract.applicationId);
    const client = data.clients.find((c) => c.id === app?.clientId);
    const isMain = app?.processId === "PRC-2026-00051";
    const reference = isMain
      ? "DSB-DEMO-2026-00124"
      : `DSB-DEMO-${new Date().getFullYear()}-${String(124 + data.disbursements.length).padStart(5, "0")}`;

    return {
      ...data,
      disbursements: [
        ...data.disbursements,
        {
          id: nextId("DSB", data.disbursements),
          applicationId: contract.applicationId,
          contractId,
          amount: contract.amount,
          method,
          status: "PREPARADO" as const,
          preparedAt: nowIso(),
          preparedById: options.preparedById ?? "USR-005",
          reference,
          channel: options.channel ?? (method === "CARTEIRA_MOVEL" ? "M-Pesa — demonstração" : method === "TRANSFERENCIA" ? "Transferência bancária — demonstração" : "Numerário — demonstração"),
          destination: options.destination ?? client?.phone ?? "—",
        },
      ],
      timeline: pushTimeline(data, contract.applicationId, {
        title: "Desembolso preparado",
        actor: "Financeiro",
        visibility: "INTERNO",
        kind: "DESEMBOLSO",
      }),
      audit: pushAudit(data, {
        actor: "financeiro@jcf.co.mz",
        action: `Preparou desembolso do contrato ${contract.reference}`,
        module: "Financeiro",
      }),
    };
  });
}

export function authorizeDisbursement(disbursementId: string, authorizedById = "USR-005") {
  demoStore.update((data) => {
    const disb = data.disbursements.find((d) => d.id === disbursementId);
    if (!disb) return data;
    return {
      ...data,
      disbursements: data.disbursements.map((d) =>
        d.id === disbursementId
          ? { ...d, status: "AUTORIZADO" as const, authorizedAt: nowIso(), authorizedById }
          : d,
      ),
      timeline: pushTimeline(data, disb.applicationId, {
        title: "Desembolso autorizado",
        actor: "Financeiro",
        visibility: "INTERNO",
        kind: "DESEMBOLSO",
      }),
      audit: pushAudit(data, {
        actor: "financeiro@jcf.co.mz",
        action: `Autorizou desembolso ${disbursementId}`,
        module: "Financeiro",
      }),
    };
  });
}

/** Executa o desembolso simulado e cria o Crédito com plano de prestações. */
export function simulateDisbursement(disbursementId: string) {
  demoStore.update((data) => {
    const disb = data.disbursements.find((d) => d.id === disbursementId);
    if (!disb) return data;
    const app = data.applications.find((a) => a.id === disb.applicationId);
    const contract = data.contracts.find((c) => c.id === disb.contractId);
    if (!app || !contract) return data;

    const seq = nextSequence(
      data.loans.map((l) => l.loanId),
      /CRD-\d{4}-(\d{5})/,
    );
    const loanId = `CRD-${new Date().getFullYear()}-${String(seq + 123).padStart(5, "0")}`;
    const id = nextId("LON", data.loans);

    const firstDue = new Date();
    firstDue.setMonth(firstDue.getMonth() + 1);

    const isMainProcess = app.processId === "PRC-2026-00051";
    const fixedInstallment = isMainProcess ? 28500 : undefined;
    const rows = buildSchedule(contract.amount, contract.termMonths, contract.monthlyRate, fixedInstallment);

    const installments = rows.map((row) => {
      const due = new Date(firstDue);
      due.setMonth(due.getMonth() + (row.number - 1));
      return {
        id: `INS-${id}-${String(row.number).padStart(2, "0")}`,
        loanId: id,
        number: row.number,
        dueDate: due.toISOString().slice(0, 10),
        principal: row.principal,
        interest: row.interest,
        total: row.total,
        paidAmount: 0,
        status: "PENDENTE" as const,
      };
    });

    return {
      ...data,
      disbursements: data.disbursements.map((d) =>
        d.id === disbursementId ? { ...d, status: "EXECUTADO" as const, executedAt: nowIso() } : d,
      ),
      loans: [
        ...data.loans,
        {
          id,
          loanId,
          applicationId: app.id,
          clientId: app.clientId,
          productId: app.productId,
          principal: contract.amount,
          termMonths: contract.termMonths,
          monthlyRate: contract.monthlyRate,
          outstandingBalance: contract.amount,
          status: "ACTIVO" as const,
          disbursedAt: nowIso(),
          firstInstallmentDate: installments[0]?.dueDate ?? firstDue.toISOString().slice(0, 10),
        },
      ],
      installments: [...data.installments, ...installments],
      applications: setApplication(data, app.id, {
        status: "DESEMBOLSADO",
        progress: 100,
        nextAction: "Acompanhar pagamento das prestações",
        loanId: id,
      }),
      timeline: pushTimeline(data, app.id, {
        title: "Desembolso simulado",
        description: `Crédito ${loanId} criado no cenário demonstrativo.`,
        actor: "Financeiro",
        kind: "DESEMBOLSO",
      }),
      notifications: pushNotification(data, {
        clientId: app.clientId,
        title: "Desembolso simulado",
        message: `Crédito ${loanId} activo no cenário demonstrativo.`,
        level: "success",
        link: `/app/loans/${loanId}`,
      }),
      audit: pushAudit(data, {
        actor: "financeiro@jcf.co.mz",
        action: `Executou desembolso simulado ${disbursementId}`,
        module: "Financeiro",
      }),
    };
  });
}

/* ============ Pagamentos ============ */

export function simulatePayment(
  loanId: string,
  amount: number,
  method: "CARTEIRA_MOVEL" | "TRANSFERENCIA" | "BALCAO" = "CARTEIRA_MOVEL",
) {
  let receiptId = "";

  demoStore.update((data) => {
    const loan = data.loans.find((l) => l.id === loanId);
    if (!loan) return data;
    const client = data.clients.find((c) => c.id === loan.clientId);

    const pending = data.installments
      .filter((i) => i.loanId === loanId && i.status !== "PAGA")
      .sort((a, b) => a.number - b.number);
    const target = pending[0];

    let remaining = amount;
    const updatedInstallments = data.installments.map((inst) => {
      if (inst.loanId !== loanId || inst.status === "PAGA" || remaining <= 0) return inst;
      const due = inst.total - inst.paidAmount;
      const applied = Math.min(due, remaining);
      remaining -= applied;
      const paidAmount = inst.paidAmount + applied;
      return {
        ...inst,
        paidAmount,
        status: paidAmount >= inst.total ? ("PAGA" as const) : ("PARCIAL" as const),
        paidAt: paidAmount >= inst.total ? nowIso() : inst.paidAt,
      };
    });

    const principalPaid = updatedInstallments
      .filter((i) => i.loanId === loanId)
      .reduce((sum, i) => {
        const ratio = i.total > 0 ? Math.min(1, i.paidAmount / i.total) : 0;
        return sum + i.principal * ratio;
      }, 0);
    const outstandingBalance = Math.max(0, Math.round(loan.principal - principalPaid));

    const paymentId = nextId("PAY", data.payments);
    receiptId = nextId("REC", data.receipts);
    const isMainLoan = data.applications.some(
      (a) => a.id === loan.applicationId && a.processId === "PRC-2026-00051",
    );
    const firstOfLoan = !data.payments.some((p) => p.loanId === loanId);
    const paymentReference =
      isMainLoan && firstOfLoan
        ? "PAY-DEMO-2026-00451"
        : `PAY-DEMO-${new Date().getFullYear()}-${String(451 + data.payments.length).padStart(5, "0")}`;
    const receiptNumber =
      isMainLoan && firstOfLoan
        ? "REC-DEMO-2026-00451"
        : `REC-DEMO-${new Date().getFullYear()}-${String(451 + data.receipts.length).padStart(5, "0")}`;

    const allPaid = updatedInstallments
      .filter((i) => i.loanId === loanId)
      .every((i) => i.status === "PAGA");

    return {
      ...data,
      installments: updatedInstallments,
      loans: data.loans.map((l) =>
        l.id === loanId
          ? {
              ...l,
              outstandingBalance,
              status: allPaid ? ("LIQUIDADO" as const) : l.status,
            }
          : l,
      ),
      payments: [
        {
          id: paymentId,
          loanId,
          installmentId: target?.id,
          amount,
          method,
          reference: paymentReference,
          status: "CONFIRMADO_DEMO" as const,
          createdAt: nowIso(),
          receiptId,
        },
        ...data.payments,
      ],
      receipts: [
        {
          id: receiptId,
          paymentId,
          loanId,
          number: receiptNumber,
          amount,
          issuedAt: nowIso(),
          clientName: client?.name ?? "Cliente",
          note: "DOCUMENTO DEMONSTRATIVO — SEM VALIDADE FINANCEIRA",
        },
        ...data.receipts,
      ],
      timeline: pushTimeline(data, loan.applicationId, {
        title: "Pagamento demonstrativo confirmado",
        description: `Recibo ${receiptNumber}.`,
        actor: client?.name ?? "Cliente",
        kind: "PAGAMENTO",
      }),
      notifications: pushNotification(data, {
        clientId: loan.clientId,
        title: "Pagamento demonstrativo confirmado",
        message: `Recibo ${receiptNumber} disponível. Saldo em dívida actualizado.`,
        level: "success",
        link: `/app/loans/${loan.loanId}`,
      }),
      audit: pushAudit(data, {
        actor: client?.email ?? "cliente",
        action: `Registou pagamento demonstrativo ${receiptNumber}`,
        module: "Pagamentos",
      }),
    };
  });

  return receiptId;
}

export { simulateCredit };
