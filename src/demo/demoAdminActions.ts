/**
 * Acções administrativas do backoffice demonstrativo.
 * Todas actualizam o demoStore e criam timeline, auditoria e notificações quando aplicável.
 */
import type { AppointmentStatus, OpsStage, Priority } from "./demo.types";
import { demoStore, nextId, nowIso } from "./demoStore";
import { pushAudit, pushNotification, pushTimeline, setApplication } from "./demoActions";

/* ============ Pedidos ============ */

export function assignApplication(applicationId: string, userId: string, actor = "gestor@jcf.co.mz") {
  demoStore.update((data) => {
    const app = data.applications.find((a) => a.id === applicationId);
    const target = data.users.find((u) => u.id === userId);
    if (!app || !target) return data;
    const patch = target.role === "MANAGER" ? { managerId: userId } : { analystId: userId };
    return {
      ...data,
      applications: setApplication(data, applicationId, patch),
      timeline: pushTimeline(data, applicationId, {
        title: "Processo atribuído",
        description: `Responsável: ${target.name}.`,
        actor: "Backoffice",
        visibility: "INTERNO",
        kind: "PEDIDO",
      }),
      notifications: pushNotification(data, {
        userId,
        title: "Processo atribuído",
        message: `${app.processId} foi atribuído a ${target.name}.`,
        link: `/app/admin/loan-requests/${app.processId}`,
      }),
      audit: pushAudit(data, {
        actor,
        action: `Atribuiu o pedido ${app.processId} a ${target.name}`,
        module: "Pedidos de Crédito",
        detail: `analystId/managerId → ${userId}`,
      }),
    };
  });
}

export function setApplicationPriority(applicationId: string, priority: Priority, actor = "gestor@jcf.co.mz") {
  demoStore.update((data) => {
    const app = data.applications.find((a) => a.id === applicationId);
    if (!app) return data;
    return {
      ...data,
      applications: setApplication(data, applicationId, { priority }),
      timeline: pushTimeline(data, applicationId, {
        title: `Prioridade alterada para ${priority}`,
        actor: "Backoffice",
        visibility: "INTERNO",
        kind: "PEDIDO",
      }),
      audit: pushAudit(data, {
        actor,
        action: `Alterou prioridade do pedido ${app.processId}`,
        module: "Pedidos de Crédito",
        detail: `${app.priority ?? "MEDIA"} → ${priority}`,
      }),
    };
  });
}

export function setApplicationStage(applicationId: string, stage: OpsStage, actor = "gestor@jcf.co.mz") {
  demoStore.update((data) => {
    const app = data.applications.find((a) => a.id === applicationId);
    if (!app) return data;
    return {
      ...data,
      applications: setApplication(data, applicationId, { stage }),
      timeline: pushTimeline(data, applicationId, {
        title: `Etapa actualizada: ${stage}`,
        actor: "Backoffice",
        visibility: "INTERNO",
        kind: "PEDIDO",
      }),
      audit: pushAudit(data, {
        actor,
        action: `Alterou etapa do pedido ${app.processId}`,
        module: "Centro de Operações",
        detail: `${app.stage ?? "—"} → ${stage}`,
      }),
    };
  });
}

export function requestDocument(applicationId: string, name: string, actor = "atendimento@jcf.co.mz") {
  demoStore.update((data) => {
    const app = data.applications.find((a) => a.id === applicationId);
    if (!app) return data;
    return {
      ...data,
      documents: [
        ...data.documents,
        {
          id: nextId("DOC", data.documents),
          applicationId,
          name,
          required: true,
          status: "PENDENTE" as const,
          note: "Documento solicitado ao cliente.",
        },
      ],
      applications: setApplication(data, applicationId, {
        nextAction: `Aguardar documento: ${name}`,
      }),
      timeline: pushTimeline(data, applicationId, {
        title: "Documento solicitado",
        description: name,
        actor: "Atendimento",
        kind: "DOCUMENTO",
      }),
      notifications: pushNotification(data, {
        clientId: app.clientId,
        title: "Documento solicitado",
        message: `É necessário entregar: ${name}.`,
        level: "warning",
        link: `/app/applications/${app.processId}`,
      }),
      audit: pushAudit(data, {
        actor,
        action: `Solicitou documento "${name}" no pedido ${app.processId}`,
        module: "Documentos",
      }),
    };
  });
}

export function cancelApplication(applicationId: string, reason: string, actor = "gestor@jcf.co.mz") {
  demoStore.update((data) => {
    const app = data.applications.find((a) => a.id === applicationId);
    if (!app) return data;
    return {
      ...data,
      applications: setApplication(data, applicationId, {
        status: "CANCELADO",
        nextAction: "Processo encerrado",
        progress: 100,
      }),
      timeline: pushTimeline(data, applicationId, {
        title: "Pedido cancelado",
        description: reason,
        actor: "Backoffice",
        kind: "PEDIDO",
      }),
      notifications: pushNotification(data, {
        clientId: app.clientId,
        title: "Pedido cancelado",
        message: reason,
        level: "warning",
      }),
      audit: pushAudit(data, {
        actor,
        action: `Cancelou o pedido ${app.processId}`,
        module: "Pedidos de Crédito",
        detail: reason,
      }),
    };
  });
}

/* ============ Marcações ============ */

const APPOINTMENT_ACTION_LABEL: Record<AppointmentStatus, string> = {
  AGUARDA_CONFIRMACAO: "Marcação registada",
  CONFIRMADA: "Marcação confirmada",
  EM_ESPERA: "Cliente em espera",
  EM_ATENDIMENTO: "Atendimento iniciado",
  REALIZADA: "Atendimento concluído",
  NAO_COMPARECEU: "Cliente não compareceu",
  CANCELADA: "Marcação cancelada",
  REMARCADA: "Marcação remarcada",
  EXPIRADA: "Marcação expirada",
  TRANSFERIDA: "Marcação transferida",
};

export function setAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
  actor = "atendimento@jcf.co.mz",
) {
  demoStore.update((data) => {
    const appt = data.appointments.find((a) => a.id === appointmentId);
    if (!appt) return data;
    const releasesSlot = status === "CANCELADA" || status === "NAO_COMPARECEU" || status === "EXPIRADA";
    return {
      ...data,
      appointments: data.appointments.map((a) => (a.id === appointmentId ? { ...a, status } : a)),
      slots: releasesSlot
        ? data.slots.map((s) =>
            s.date === appt.date && s.time === appt.time && s.consultantId === appt.consultantId
              ? { ...s, booked: Math.max(0, s.booked - 1) }
              : s,
          )
        : data.slots,
      timeline: appt.applicationId
        ? pushTimeline(data, appt.applicationId, {
            title: APPOINTMENT_ACTION_LABEL[status],
            description: `${appt.code} — ${appt.date} ${appt.time}`,
            actor: "Atendimento",
            kind: "MARCACAO",
          })
        : data.timeline,
      notifications: pushNotification(data, {
        clientId: appt.clientId,
        title: APPOINTMENT_ACTION_LABEL[status],
        message: `Marcação ${appt.code} — ${appt.date} às ${appt.time}.`,
        level: status === "CANCELADA" || status === "NAO_COMPARECEU" ? "warning" : "info",
        link: "/app/appointments",
      }),
      audit: pushAudit(data, {
        actor,
        action: `${APPOINTMENT_ACTION_LABEL[status]} (${appt.code})`,
        module: "Agenda e Atendimentos",
      }),
    };
  });
}

export function transferAppointmentConsultant(
  appointmentId: string,
  consultantId: string,
  actor = "atendimento@jcf.co.mz",
) {
  demoStore.update((data) => {
    const appt = data.appointments.find((a) => a.id === appointmentId);
    const consultant = data.users.find((u) => u.id === consultantId);
    if (!appt || !consultant) return data;
    return {
      ...data,
      appointments: data.appointments.map((a) =>
        a.id === appointmentId ? { ...a, consultantId, status: "TRANSFERIDA" as const } : a,
      ),
      audit: pushAudit(data, {
        actor,
        action: `Transferiu marcação ${appt.code} para ${consultant.name}`,
        module: "Agenda e Atendimentos",
      }),
      notifications: pushNotification(data, {
        clientId: appt.clientId,
        title: "Marcação transferida",
        message: `Passa a ser atendido por ${consultant.name}.`,
        link: "/app/appointments",
      }),
    };
  });
}

export function blockSlot(slotId: string, reason: string, actor = "atendimento@jcf.co.mz") {
  demoStore.update((data) => {
    const slot = data.slots.find((s) => s.id === slotId);
    if (!slot) return data;
    const blocks = data.slotBlocks ?? [];
    return {
      ...data,
      slots: data.slots.map((s) => (s.id === slotId ? { ...s, booked: s.capacity } : s)),
      slotBlocks: [
        ...blocks,
        {
          id: nextId("BLK", blocks),
          date: slot.date,
          time: slot.time,
          branchId: slot.branchId,
          consultantId: slot.consultantId,
          reason,
          createdAt: nowIso(),
        },
      ],
      audit: pushAudit(data, {
        actor,
        action: `Bloqueou o horário ${slot.date} ${slot.time}`,
        module: "Agenda e Atendimentos",
        detail: reason,
      }),
    };
  });
}

export function unblockSlot(blockId: string, actor = "atendimento@jcf.co.mz") {
  demoStore.update((data) => {
    const blocks = data.slotBlocks ?? [];
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return data;
    return {
      ...data,
      slots: data.slots.map((s) =>
        s.date === block.date && s.time === block.time && s.consultantId === block.consultantId
          ? { ...s, booked: 0 }
          : s,
      ),
      slotBlocks: blocks.filter((b) => b.id !== blockId),
      audit: pushAudit(data, {
        actor,
        action: `Desbloqueou o horário ${block.date} ${block.time}`,
        module: "Agenda e Atendimentos",
      }),
    };
  });
}

/* ============ Financeiro ============ */

export function markDisbursementProcessing(disbursementId: string, actor = "financeiro@jcf.co.mz") {
  demoStore.update((data) => {
    const disb = data.disbursements.find((d) => d.id === disbursementId);
    if (!disb) return data;
    return {
      ...data,
      disbursements: data.disbursements.map((d) =>
        d.id === disbursementId ? { ...d, status: "PROCESSANDO" as const } : d,
      ),
      audit: pushAudit(data, {
        actor,
        action: `Colocou o desembolso ${disb.reference ?? disb.id} em processamento`,
        module: "Desembolsos",
      }),
    };
  });
}

export function reconcilePayment(paymentId: string, actor = "financeiro@jcf.co.mz") {
  demoStore.update((data) => {
    const payment = data.payments.find((p) => p.id === paymentId);
    if (!payment) return data;
    return {
      ...data,
      payments: data.payments.map((p) =>
        p.id === paymentId ? { ...p, reconciled: true, reconciledAt: nowIso() } : p,
      ),
      audit: pushAudit(data, {
        actor,
        action: `Reconciliou o pagamento ${payment.reference}`,
        module: "Pagamentos",
      }),
    };
  });
}

/* ============ Cobranças ============ */

export function registerCollectionContact(
  input: {
    loanId: string;
    channel: "TELEFONE" | "SMS" | "VISITA" | "WHATSAPP";
    outcome: string;
    note?: string;
    agentId?: string;
  },
  actor = "cobrancas@jcf.co.mz",
) {
  demoStore.update((data) => {
    const loan = data.loans.find((l) => l.id === input.loanId || l.loanId === input.loanId);
    if (!loan) return data;
    const contacts = data.collectionContacts ?? [];
    return {
      ...data,
      collectionContacts: [
        {
          id: nextId("CTC", contacts),
          loanId: loan.id,
          clientId: loan.clientId,
          channel: input.channel,
          outcome: input.outcome,
          note: input.note,
          agentId: input.agentId ?? "USR-006",
          createdAt: nowIso(),
        },
        ...contacts,
      ],
      audit: pushAudit(data, {
        actor,
        action: `Registou contacto de cobrança no crédito ${loan.loanId}`,
        module: "Cobranças",
        detail: `${input.channel} — ${input.outcome}`,
      }),
    };
  });
}

export function createPaymentPromise(
  input: { loanId: string; amount: number; promisedDate: string; agentId?: string },
  actor = "cobrancas@jcf.co.mz",
) {
  demoStore.update((data) => {
    const loan = data.loans.find((l) => l.id === input.loanId || l.loanId === input.loanId);
    if (!loan) return data;
    const promises = data.paymentPromises ?? [];
    return {
      ...data,
      paymentPromises: [
        {
          id: nextId("PRM", promises),
          loanId: loan.id,
          clientId: loan.clientId,
          amount: input.amount,
          promisedDate: input.promisedDate,
          status: "ACTIVA" as const,
          agentId: input.agentId ?? "USR-006",
          createdAt: nowIso(),
        },
        ...promises,
      ],
      notifications: pushNotification(data, {
        clientId: loan.clientId,
        title: "Promessa de pagamento registada",
        message: `Compromisso de pagamento para ${input.promisedDate}.`,
        level: "info",
      }),
      audit: pushAudit(data, {
        actor,
        action: `Criou promessa de pagamento no crédito ${loan.loanId}`,
        module: "Cobranças",
      }),
    };
  });
}

export function forwardToRestructuring(loanId: string, actor = "cobrancas@jcf.co.mz") {
  demoStore.update((data) => {
    const loan = data.loans.find((l) => l.id === loanId || l.loanId === loanId);
    if (!loan) return data;
    return {
      ...data,
      audit: pushAudit(data, {
        actor,
        action: `Encaminhou o crédito ${loan.loanId} para reestruturação`,
        module: "Cobranças",
      }),
      notifications: pushNotification(data, {
        clientId: loan.clientId,
        title: "Processo encaminhado para reestruturação",
        message: "A equipa de crédito irá analisar novas condições de pagamento.",
        level: "info",
      }),
    };
  });
}
