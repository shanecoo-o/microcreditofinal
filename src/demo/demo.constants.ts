import type {
  AppointmentMode,
  AppointmentService,
  AppointmentStatus,
  ApplicationStatus,
  DocumentStatus,
  PerfilCodigo,
  RiskLevel,
} from "./demo.types";

/* ============ Modo demonstração ============ */

const flag = (value: unknown, fallback: boolean) =>
  value === undefined ? fallback : String(value) === "true";

export const USE_MOCKS = flag(import.meta.env.VITE_USE_MOCKS, true);
export const SHOW_DEMO_ACCESS = flag(import.meta.env.VITE_SHOW_DEMO_ACCESS, true);

export const DEMO_BANNER_TEXT = "Ambiente de demonstração — dados fictícios";
export const DEMO_PASSWORD = "demo1234";
export const RECEIPT_DISCLAIMER = "DOCUMENTO DEMONSTRATIVO — SEM VALIDADE FINANCEIRA";

export const DEMO_MESSAGES = {
  paymentConfirmed: "Pagamento demonstrativo confirmado",
  disbursementSimulated: "Desembolso simulado",
  notificationCreated: "Notificação demonstrativa registada",
  documentStored: "Documento guardado apenas na sessão demo",
  contractSigned: "Contrato marcado como assinado no cenário demonstrativo",
  scenarioApplied: "Cenário demonstrativo aplicado",
  scenarioReset: "Cenário demonstrativo reiniciado",
} as const;

/* ============ Perfis ============ */

export const PERFIL_LABEL: Record<PerfilCodigo, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gestor de Crédito",
  ANALYST: "Analista de Crédito",
  SUPPORT: "Atendimento",
  FINANCE: "Financeiro",
  COLLECTIONS: "Cobranças",
  AUDIT: "Auditoria",
  USER: "Cliente",
};

export const PERFIL_HOME: Record<PerfilCodigo, string> = {
  ADMIN: "/app/admin/dashboard",
  MANAGER: "/app/admin/dashboard",
  ANALYST: "/app/admin/operations",
  SUPPORT: "/app/admin/loan-requests",
  FINANCE: "/app/admin/disbursements",
  COLLECTIONS: "/app/admin/collections",
  AUDIT: "/app/admin/audit",
  USER: "/app/dashboard",
};

/* ============ Estados ============ */

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  PRE_CANDIDATURA: "Pré-candidatura",
  EM_ANALISE: "Em análise",
  AGUARDA_DOCUMENTOS: "Aguarda documentos",
  APROVADO: "Aprovado",
  CONTRATO: "Contrato",
  DESEMBOLSADO: "Desembolsado",
  RECUSADO: "Recusado",
  CANCELADO: "Cancelado",
};

export const DOCUMENT_STATUS_LABEL: Record<DocumentStatus, string> = {
  PENDENTE: "Pendente",
  EM_REVISAO: "Em revisão",
  VALIDADO: "Validado",
  REJEITADO: "Rejeitado",
};

export const RISK_LABEL: Record<RiskLevel, string> = {
  BAIXO: "Risco baixo",
  MEDIO: "Risco médio",
  ALTO: "Risco alto",
};

export const INSTALLMENT_STATUS_LABEL = {
  PENDENTE: "Pendente",
  PAGA: "Paga",
  PARCIAL: "Parcial",
  EM_ATRASO: "Em atraso",
} as const;

/* ============ Marcações ============ */

export const APPOINTMENT_SERVICES: {
  code: AppointmentService;
  label: string;
  description: string;
  durationMin: number;
}[] = [
  {
    code: "PRIMEIRA_CONSULTA",
    label: "Primeira consulta",
    description: "Conhecer os produtos de crédito e as condições aplicáveis.",
    durationMin: 30,
  },
  {
    code: "APOIO_CANDIDATURA",
    label: "Apoio à candidatura",
    description: "Preenchimento do pedido de crédito com acompanhamento.",
    durationMin: 45,
  },
  {
    code: "ENTREGA_DOCUMENTOS",
    label: "Entrega de documentos",
    description: "Entrega e verificação dos documentos do processo.",
    durationMin: 20,
  },
  {
    code: "ENTREVISTA_CREDITO",
    label: "Entrevista de crédito",
    description: "Entrevista de análise conduzida por um analista de crédito.",
    durationMin: 60,
  },
  {
    code: "ASSINATURA_CONTRATO",
    label: "Assinatura de contrato",
    description: "Leitura e assinatura do contrato de crédito.",
    durationMin: 45,
  },
  {
    code: "APOIO_PAGAMENTO",
    label: "Apoio a pagamento",
    description: "Esclarecimento de prestações, saldos e comprovativos.",
    durationMin: 20,
  },
  {
    code: "RENEGOCIACAO",
    label: "Renegociação",
    description: "Análise de alteração de condições de pagamento.",
    durationMin: 45,
  },
];

export const APPOINTMENT_MODES: {
  code: AppointmentMode;
  label: string;
  description: string;
}[] = [
  { code: "PRESENCIAL", label: "Presencial", description: "Atendimento na agência escolhida." },
  { code: "ONLINE", label: "Online", description: "Videochamada com um consultor." },
  { code: "TELEFONE", label: "Telefone", description: "Contacto telefónico no horário marcado." },
];

export const APPOINTMENT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  CONFIRMADA: "Confirmada",
  REMARCADA: "Remarcada",
  CANCELADA: "Cancelada",
  REALIZADA: "Realizada",
};

export const APPOINTMENT_TIMES = [
  "08:30",
  "09:15",
  "10:00",
  "10:45",
  "11:30",
  "14:00",
  "14:45",
  "15:30",
  "16:15",
];

/* ============ Finalidades e documentos ============ */

export const LOAN_PURPOSES = [
  "Capital de giro",
  "Compra de stock",
  "Equipamento",
  "Expansão do negócio",
  "Despesas familiares",
  "Educação",
  "Saúde",
  "Habitação",
];

export const CONTACT_PREFERENCES = ["Telefone", "WhatsApp", "Email"] as const;

export const REQUIRED_DOCUMENTS = [
  "Documento de identificação (BI)",
  "Comprovativo de residência",
  "Comprovativo de rendimento",
  "Registo ou licença do negócio",
  "Documento da garantia",
] as const;
