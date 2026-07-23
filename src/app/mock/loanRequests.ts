export type LoanState =
  | "PENDENTE"
  | "EM_ANALISE"
  | "APROVADO"
  | "DESEMBOLSADO"
  | "REJEITADO";

export interface LoanRequest {
  processo: string;
  cliente: string;
  telefone: string;
  valor: number;
  prazo: number;
  garantia: string;
  estado: LoanState;
  data: string;
  analista: string;
  finalidade: string;
  taxaJuros: number;
  parcelaEstimada: number;
  bi: string;
  endereco: string;
  historico: { data: string; evento: string; autor: string }[];
}

export const analistas = [
  "Ana Cossa",
  "Bruno Chissano",
  "Carla Mahumane",
  "Daniel Sitoe",
];

export const loanStateLabel: Record<LoanState, string> = {
  PENDENTE: "Pendente",
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  DESEMBOLSADO: "Desembolsado",
  REJEITADO: "Rejeitado",
};

export const loanStateStyle: Record<LoanState, string> = {
  PENDENTE: "bg-warning/15 text-warning hover:bg-warning/15",
  EM_ANALISE: "bg-accent/15 text-accent hover:bg-accent/15",
  APROVADO: "bg-primary/10 text-primary hover:bg-primary/10",
  DESEMBOLSADO: "bg-success/15 text-success hover:bg-success/15",
  REJEITADO: "bg-destructive/15 text-destructive hover:bg-destructive/15",
};

export const loanRequests: LoanRequest[] = [
  {
    processo: "PROC-2026-01048",
    cliente: "Maria Machava",
    telefone: "+258 84 512 3390",
    valor: 75_000,
    prazo: 12,
    garantia: "Moto Yamaha YBR 125",
    estado: "PENDENTE",
    data: "2026-07-21T09:12:00Z",
    analista: "Ana Cossa",
    finalidade: "Capital de giro para banca no Mercado Central",
    taxaJuros: 1.2,
    parcelaEstimada: 7_150,
    bi: "110234567890A",
    endereco: "Bairro Alto-Maé, Maputo",
    historico: [
      { data: "2026-07-21T09:12:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-21T09:20:00Z", evento: "Atribuído à Ana Cossa", autor: "Sistema" },
    ],
  },
  {
    processo: "PROC-2026-01047",
    cliente: "João Nhaca",
    telefone: "+258 82 447 1102",
    valor: 150_000,
    prazo: 24,
    garantia: "Viatura Toyota Vitz 2015",
    estado: "EM_ANALISE",
    data: "2026-07-21T08:47:00Z",
    analista: "Bruno Chissano",
    finalidade: "Ampliação de oficina mecânica",
    taxaJuros: 1.0,
    parcelaEstimada: 7_180,
    bi: "110998877665B",
    endereco: "Bairro Costa do Sol, Maputo",
    historico: [
      { data: "2026-07-21T08:47:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-21T09:05:00Z", evento: "Documentação validada", autor: "Bruno Chissano" },
    ],
  },
  {
    processo: "PROC-2026-01046",
    cliente: "Alberto Cossa",
    telefone: "+258 87 221 5580",
    valor: 45_000,
    prazo: 9,
    garantia: "Aparelhagem de som profissional",
    estado: "APROVADO",
    data: "2026-07-20T16:31:00Z",
    analista: "Ana Cossa",
    finalidade: "Compra de equipamento para eventos",
    taxaJuros: 1.3,
    parcelaEstimada: 5_640,
    bi: "110445566778C",
    endereco: "Bairro Malhangalene, Maputo",
    historico: [
      { data: "2026-07-20T16:31:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-20T17:10:00Z", evento: "Aprovado após análise", autor: "Ana Cossa" },
    ],
  },
  {
    processo: "PROC-2026-01045",
    cliente: "Isabel Mahumane",
    telefone: "+258 84 776 3399",
    valor: 200_000,
    prazo: 36,
    garantia: "Título de propriedade DUAT",
    estado: "DESEMBOLSADO",
    data: "2026-07-20T14:05:00Z",
    analista: "Carla Mahumane",
    finalidade: "Construção de residência",
    taxaJuros: 0.9,
    parcelaEstimada: 6_950,
    bi: "110778899001D",
    endereco: "Bairro Zimpeto, Maputo",
    historico: [
      { data: "2026-07-20T14:05:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-20T15:30:00Z", evento: "Aprovado", autor: "Carla Mahumane" },
      { data: "2026-07-20T18:00:00Z", evento: "Valor desembolsado", autor: "Tesouraria" },
    ],
  },
  {
    processo: "PROC-2026-01044",
    cliente: "Carlos Sitoe",
    telefone: "+258 82 118 4471",
    valor: 30_000,
    prazo: 6,
    garantia: "Telemóvel Samsung Galaxy S22",
    estado: "REJEITADO",
    data: "2026-07-20T11:22:00Z",
    analista: "Daniel Sitoe",
    finalidade: "Despesas pessoais",
    taxaJuros: 1.5,
    parcelaEstimada: 5_320,
    bi: "110223344556E",
    endereco: "Bairro Chamanculo, Maputo",
    historico: [
      { data: "2026-07-20T11:22:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-20T13:00:00Z", evento: "Rejeitado - garantia insuficiente", autor: "Daniel Sitoe" },
    ],
  },
  {
    processo: "PROC-2026-01043",
    cliente: "Fátima Muchanga",
    telefone: "+258 84 993 2210",
    valor: 90_000,
    prazo: 18,
    garantia: "Máquina de costura industrial",
    estado: "APROVADO",
    data: "2026-07-19T15:44:00Z",
    analista: "Bruno Chissano",
    finalidade: "Expansão de atelier de costura",
    taxaJuros: 1.1,
    parcelaEstimada: 5_750,
    bi: "110334455667F",
    endereco: "Bairro Mafalala, Maputo",
    historico: [
      { data: "2026-07-19T15:44:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-19T17:00:00Z", evento: "Aprovado", autor: "Bruno Chissano" },
    ],
  },
  {
    processo: "PROC-2026-01042",
    cliente: "Bruno Chissano",
    telefone: "+258 87 550 1122",
    valor: 60_000,
    prazo: 12,
    garantia: "Frigorífico comercial",
    estado: "EM_ANALISE",
    data: "2026-07-19T10:18:00Z",
    analista: "Carla Mahumane",
    finalidade: "Compra de stock para talho",
    taxaJuros: 1.2,
    parcelaEstimada: 5_720,
    bi: "110556677889G",
    endereco: "Bairro Xipamanine, Maputo",
    historico: [
      { data: "2026-07-19T10:18:00Z", evento: "Solicitação submetida", autor: "Cliente" },
    ],
  },
  {
    processo: "PROC-2026-01041",
    cliente: "Rosa Tembe",
    telefone: "+258 84 220 8877",
    valor: 120_000,
    prazo: 24,
    garantia: "Viatura Honda Fit 2018",
    estado: "DESEMBOLSADO",
    data: "2026-07-18T17:02:00Z",
    analista: "Ana Cossa",
    finalidade: "Abertura de mini-mercado",
    taxaJuros: 1.0,
    parcelaEstimada: 5_740,
    bi: "110667788990H",
    endereco: "Bairro Matola-A, Matola",
    historico: [
      { data: "2026-07-18T17:02:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-18T18:30:00Z", evento: "Aprovado", autor: "Ana Cossa" },
      { data: "2026-07-19T09:00:00Z", evento: "Valor desembolsado", autor: "Tesouraria" },
    ],
  },
  {
    processo: "PROC-2026-01040",
    cliente: "Ernesto Guambe",
    telefone: "+258 82 665 4433",
    valor: 25_000,
    prazo: 6,
    garantia: "Bicicleta e ferramentas",
    estado: "PENDENTE",
    data: "2026-07-18T09:30:00Z",
    analista: "Daniel Sitoe",
    finalidade: "Serviços de entrega",
    taxaJuros: 1.4,
    parcelaEstimada: 4_450,
    bi: "110889900112I",
    endereco: "Bairro Laulane, Maputo",
    historico: [
      { data: "2026-07-18T09:30:00Z", evento: "Solicitação submetida", autor: "Cliente" },
    ],
  },
  {
    processo: "PROC-2026-01039",
    cliente: "Sónia Bilale",
    telefone: "+258 87 331 9988",
    valor: 180_000,
    prazo: 30,
    garantia: "Terreno com DUAT",
    estado: "EM_ANALISE",
    data: "2026-07-17T14:10:00Z",
    analista: "Carla Mahumane",
    finalidade: "Investimento agrícola",
    taxaJuros: 0.9,
    parcelaEstimada: 6_720,
    bi: "110001122334J",
    endereco: "Distrito de Boane",
    historico: [
      { data: "2026-07-17T14:10:00Z", evento: "Solicitação submetida", autor: "Cliente" },
      { data: "2026-07-17T16:00:00Z", evento: "Avaliação de garantia agendada", autor: "Carla Mahumane" },
    ],
  },
];
