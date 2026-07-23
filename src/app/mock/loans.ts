export type LoanStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CONTRACT_PENDING"
  | "DISBURSED";

export interface Loan {
  processo: string;
  cliente: string;
  telefone: string;
  valor: number;
  garantia: string;
  score: number;
  estado: LoanStatus;
  analista: string;
  data: string;
  prazo: number;
  taxaJuros: number;
  parcelaEstimada: number;
  finalidade: string;
  bi: string;
  endereco: string;
  historico: { data: string; evento: string; autor: string }[];
}

export const loanAnalistas = [
  "Ana Cossa",
  "Bruno Chissano",
  "Carla Mahumane",
  "Daniel Sitoe",
  "Elsa Nhantumbo",
];

export const loanStatusLabel: Record<LoanStatus, string> = {
  SUBMITTED: "Submetido",
  UNDER_REVIEW: "Em análise",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CONTRACT_PENDING: "Contrato pendente",
  DISBURSED: "Desembolsado",
};

export const loanStatusStyle: Record<LoanStatus, string> = {
  SUBMITTED: "bg-muted text-foreground hover:bg-muted",
  UNDER_REVIEW: "bg-accent/15 text-accent hover:bg-accent/15",
  APPROVED: "bg-primary/10 text-primary hover:bg-primary/10",
  REJECTED: "bg-destructive/15 text-destructive hover:bg-destructive/15",
  CONTRACT_PENDING: "bg-warning/15 text-warning hover:bg-warning/15",
  DISBURSED: "bg-success/15 text-success hover:bg-success/15",
};

export const scoreStyle = (score: number) => {
  if (score >= 750) return "bg-success/15 text-success";
  if (score >= 600) return "bg-primary/10 text-primary";
  if (score >= 450) return "bg-warning/15 text-warning";
  return "bg-destructive/15 text-destructive";
};

export const loans: Loan[] = [
  {
    processo: "LN-2026-02001",
    cliente: "Maria Machava",
    telefone: "+258 84 512 3390",
    valor: 75_000,
    garantia: "Moto Yamaha YBR 125",
    score: 720,
    estado: "SUBMITTED",
    analista: "Ana Cossa",
    data: "2026-07-21T09:12:00Z",
    prazo: 12,
    taxaJuros: 1.2,
    parcelaEstimada: 7_150,
    finalidade: "Capital de giro para banca no Mercado Central",
    bi: "110234567890A",
    endereco: "Bairro Alto-Maé, Maputo",
    historico: [
      { data: "2026-07-21T09:12:00Z", evento: "Solicitação submetida", autor: "Cliente" },
    ],
  },
  {
    processo: "LN-2026-02002",
    cliente: "João Nhaca",
    telefone: "+258 82 447 1102",
    valor: 150_000,
    garantia: "Viatura Toyota Vitz 2015",
    score: 680,
    estado: "UNDER_REVIEW",
    analista: "Bruno Chissano",
    data: "2026-07-21T08:47:00Z",
    prazo: 24,
    taxaJuros: 1.0,
    parcelaEstimada: 7_180,
    finalidade: "Ampliação de oficina mecânica",
    bi: "110998877665B",
    endereco: "Bairro Costa do Sol, Maputo",
    historico: [
      { data: "2026-07-21T08:47:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-21T09:05:00Z", evento: "Documentação validada", autor: "Bruno Chissano" },
    ],
  },
  {
    processo: "LN-2026-02003",
    cliente: "Alberto Cossa",
    telefone: "+258 87 221 5580",
    valor: 45_000,
    garantia: "Aparelhagem de som profissional",
    score: 640,
    estado: "APPROVED",
    analista: "Ana Cossa",
    data: "2026-07-20T16:31:00Z",
    prazo: 9,
    taxaJuros: 1.3,
    parcelaEstimada: 5_640,
    finalidade: "Compra de equipamento para eventos",
    bi: "110445566778C",
    endereco: "Bairro Malhangalene, Maputo",
    historico: [
      { data: "2026-07-20T16:31:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-20T17:10:00Z", evento: "Aprovado após análise", autor: "Ana Cossa" },
    ],
  },
  {
    processo: "LN-2026-02004",
    cliente: "Isabel Mahumane",
    telefone: "+258 84 776 3399",
    valor: 200_000,
    garantia: "Título de propriedade DUAT",
    score: 790,
    estado: "DISBURSED",
    analista: "Carla Mahumane",
    data: "2026-07-20T14:05:00Z",
    prazo: 36,
    taxaJuros: 0.9,
    parcelaEstimada: 6_950,
    finalidade: "Construção de residência",
    bi: "110778899001D",
    endereco: "Bairro Zimpeto, Maputo",
    historico: [
      { data: "2026-07-20T14:05:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-20T15:30:00Z", evento: "Aprovado", autor: "Carla Mahumane" },
      { data: "2026-07-20T18:00:00Z", evento: "Contrato assinado", autor: "Cliente" },
      { data: "2026-07-20T19:00:00Z", evento: "Valor desembolsado", autor: "Tesouraria" },
    ],
  },
  {
    processo: "LN-2026-02005",
    cliente: "Carlos Sitoe",
    telefone: "+258 82 118 4471",
    valor: 30_000,
    garantia: "Telemóvel Samsung Galaxy S22",
    score: 380,
    estado: "REJECTED",
    analista: "Daniel Sitoe",
    data: "2026-07-20T11:22:00Z",
    prazo: 6,
    taxaJuros: 1.5,
    parcelaEstimada: 5_320,
    finalidade: "Despesas pessoais",
    bi: "110223344556E",
    endereco: "Bairro Chamanculo, Maputo",
    historico: [
      { data: "2026-07-20T11:22:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-20T13:00:00Z", evento: "Rejeitado - garantia insuficiente", autor: "Daniel Sitoe" },
    ],
  },
  {
    processo: "LN-2026-02006",
    cliente: "Fátima Muchanga",
    telefone: "+258 84 993 2210",
    valor: 90_000,
    garantia: "Máquina de costura industrial",
    score: 705,
    estado: "CONTRACT_PENDING",
    analista: "Bruno Chissano",
    data: "2026-07-19T15:44:00Z",
    prazo: 18,
    taxaJuros: 1.1,
    parcelaEstimada: 5_750,
    finalidade: "Expansão de atelier de costura",
    bi: "110334455667F",
    endereco: "Bairro Mafalala, Maputo",
    historico: [
      { data: "2026-07-19T15:44:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-19T17:00:00Z", evento: "Aprovado - aguarda assinatura", autor: "Bruno Chissano" },
    ],
  },
  {
    processo: "LN-2026-02007",
    cliente: "Bruno Chissano",
    telefone: "+258 87 550 1122",
    valor: 60_000,
    garantia: "Frigorífico comercial",
    score: 610,
    estado: "UNDER_REVIEW",
    analista: "Carla Mahumane",
    data: "2026-07-19T10:18:00Z",
    prazo: 12,
    taxaJuros: 1.2,
    parcelaEstimada: 5_720,
    finalidade: "Compra de stock para talho",
    bi: "110556677889G",
    endereco: "Bairro Xipamanine, Maputo",
    historico: [
      { data: "2026-07-19T10:18:00Z", evento: "Solicitação submetida", autor: "Cliente" },
    ],
  },
  {
    processo: "LN-2026-02008",
    cliente: "Rosa Tembe",
    telefone: "+258 84 220 8877",
    valor: 120_000,
    garantia: "Viatura Honda Fit 2018",
    score: 755,
    estado: "DISBURSED",
    analista: "Ana Cossa",
    data: "2026-07-18T17:02:00Z",
    prazo: 24,
    taxaJuros: 1.0,
    parcelaEstimada: 5_740,
    finalidade: "Abertura de mini-mercado",
    bi: "110667788990H",
    endereco: "Bairro Matola-A, Matola",
    historico: [
      { data: "2026-07-18T17:02:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-18T18:30:00Z", evento: "Aprovado", autor: "Ana Cossa" },
      { data: "2026-07-19T09:00:00Z", evento: "Valor desembolsado", autor: "Tesouraria" },
    ],
  },
  {
    processo: "LN-2026-02009",
    cliente: "Ernesto Guambe",
    telefone: "+258 82 665 4433",
    valor: 25_000,
    garantia: "Bicicleta e ferramentas",
    score: 520,
    estado: "SUBMITTED",
    analista: "Daniel Sitoe",
    data: "2026-07-18T09:30:00Z",
    prazo: 6,
    taxaJuros: 1.4,
    parcelaEstimada: 4_450,
    finalidade: "Serviços de entrega",
    bi: "110889900112I",
    endereco: "Bairro Laulane, Maputo",
    historico: [
      { data: "2026-07-18T09:30:00Z", evento: "Solicitação submetida", autor: "Cliente" },
    ],
  },
  {
    processo: "LN-2026-02010",
    cliente: "Sónia Bilale",
    telefone: "+258 87 331 9988",
    valor: 180_000,
    garantia: "Terreno com DUAT",
    score: 810,
    estado: "APPROVED",
    analista: "Carla Mahumane",
    data: "2026-07-17T14:10:00Z",
    prazo: 30,
    taxaJuros: 0.9,
    parcelaEstimada: 6_720,
    finalidade: "Investimento agrícola",
    bi: "110001122334J",
    endereco: "Distrito de Boane",
    historico: [
      { data: "2026-07-17T14:10:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-17T16:00:00Z", evento: "Aprovado", autor: "Carla Mahumane" },
    ],
  },
  {
    processo: "LN-2026-02011",
    cliente: "Paulo Mondlane",
    telefone: "+258 84 118 5566",
    valor: 55_000,
    garantia: "Geleira industrial",
    score: 590,
    estado: "CONTRACT_PENDING",
    analista: "Elsa Nhantumbo",
    data: "2026-07-17T11:00:00Z",
    prazo: 12,
    taxaJuros: 1.2,
    parcelaEstimada: 5_050,
    finalidade: "Reforço de stock para snack-bar",
    bi: "110998811223K",
    endereco: "Bairro Polana Caniço, Maputo",
    historico: [
      { data: "2026-07-17T11:00:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-17T13:20:00Z", evento: "Aprovado - aguarda assinatura", autor: "Elsa Nhantumbo" },
    ],
  },
  {
    processo: "LN-2026-02012",
    cliente: "Luísa Tivane",
    telefone: "+258 82 774 1290",
    valor: 40_000,
    garantia: "Computador portátil e impressora",
    score: 660,
    estado: "SUBMITTED",
    analista: "Elsa Nhantumbo",
    data: "2026-07-16T16:45:00Z",
    prazo: 9,
    taxaJuros: 1.3,
    parcelaEstimada: 5_020,
    finalidade: "Serviços de papelaria",
    bi: "110445599881L",
    endereco: "Bairro Ferroviário, Maputo",
    historico: [
      { data: "2026-07-16T16:45:00Z", evento: "Solicitação submetida", autor: "Cliente" },
    ],
  },
];
