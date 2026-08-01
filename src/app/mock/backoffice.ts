// Mock data do Backoffice JCF Microcrédito.
// TODO(backend): substituir por chamadas às APIs Spring Boot (ver src/app/api/http.ts).

const nomes = [
  "Ana Cossa", "Bruno Chissano", "Carla Mahumane", "Daniel Sitoe", "Elsa Nhantumbo",
  "Fernando Macuácua", "Gina Tembe", "Hélder Mondlane", "Isabel Machava", "João Bila",
  "Katia Zandamela", "Lúcio Muianga", "Marta Guambe", "Nelson Chirindza", "Olga Matsinhe",
  "Paulo Ubisse", "Quitéria Langa", "Rui Massingue", "Sónia Bombo", "Tomás Nhaca",
  "Ussene Ali", "Vânia Cuna", "Wilson Chauque", "Xénia Mabote", "Yolanda Sumbana",
  "Zacarias Nhampossa", "Amélia Fumo", "Belarmino Djedje", "Célia Nhalivilo", "Dino Matola",
];

const analistas = ["Ana Cossa", "Bruno Chissano", "Carla Mahumane", "Daniel Sitoe", "Elsa Nhantumbo"];
const filiais = ["Maputo Baixa", "Matola", "Beira", "Nampula", "Tete"];
const produtos = ["Micro Negócio", "Consumo", "Salário", "Agro", "Equipamento"];

const rnd = (seed: number) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};
const pick = <T,>(arr: readonly T[], seed: number) => arr[Math.floor(rnd(seed) * arr.length) % arr.length];
const between = (seed: number, min: number, max: number) => Math.round(min + rnd(seed) * (max - min));
const dateAgo = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

/* ------------------------------------------------------------------ Clientes */

export type ClientStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface Client {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  bi: string;
  nuit: string;
  estado: ClientStatus;
  score: number;
  totalEmprestimos: number;
  saldoDevedor: number;
  filial: string;
  endereco: string;
  profissao: string;
  rendimento: number;
  desde: string;
}

export const clients: Client[] = nomes.map((nome, i) => {
  const s = i + 1;
  return {
    id: `CLI-${String(1000 + i)}`,
    nome,
    telefone: `+258 8${between(s, 2, 7)} ${between(s * 3, 100, 999)} ${between(s * 7, 1000, 9999)}`,
    email: `${nome.toLowerCase().split(" ")[0]}.${nome.toLowerCase().split(" ")[1]}@email.co.mz`,
    bi: `${between(s * 11, 100000000, 999999999)}${pick(["A", "B", "C", "N", "Q"], s)}`,
    nuit: `${between(s * 13, 100000000, 999999999)}`,
    estado: rnd(s * 17) > 0.85 ? "INACTIVE" : rnd(s * 19) > 0.95 ? "BLOCKED" : "ACTIVE",
    score: between(s * 23, 340, 920),
    totalEmprestimos: between(s * 29, 1, 9),
    saldoDevedor: between(s * 31, 0, 480000),
    filial: pick(filiais, s * 37),
    endereco: `Av. ${pick(["Julius Nyerere", "24 de Julho", "Eduardo Mondlane", "Vladimir Lenine"], s * 41)}, nº ${between(s * 43, 10, 900)}, ${pick(filiais, s * 37)}`,
    profissao: pick(["Comerciante", "Professor", "Motorista", "Enfermeira", "Agricultor", "Técnico"], s * 47),
    rendimento: between(s * 53, 12000, 145000),
    desde: dateAgo(between(s * 59, 60, 1400)),
  };
});

/* ------------------------------------------------------- Centro de Operações */

export type OpsStage =
  | "NOVOS_PEDIDOS" | "DOCUMENTOS" | "ANALISE" | "APROVACAO"
  | "CONTRATO" | "DESEMBOLSO" | "COBRANCA" | "FINALIZADOS";

export const opsStages: { key: OpsStage; label: string }[] = [
  { key: "NOVOS_PEDIDOS", label: "Novos Pedidos" },
  { key: "DOCUMENTOS", label: "Documentos" },
  { key: "ANALISE", label: "Análise" },
  { key: "APROVACAO", label: "Aprovação" },
  { key: "CONTRATO", label: "Contrato" },
  { key: "DESEMBOLSO", label: "Desembolso" },
  { key: "COBRANCA", label: "Cobrança" },
  { key: "FINALIZADOS", label: "Finalizados" },
];

export interface OpsCard {
  id: string;
  processo: string;
  cliente: string;
  valor: number;
  data: string;
  responsavel: string;
  status: string;
  prioridade: "ALTA" | "MEDIA" | "BAIXA";
  stage: OpsStage;
}

const statusPorStage: Record<OpsStage, string> = {
  NOVOS_PEDIDOS: "Submetido",
  DOCUMENTOS: "Documentos pendentes",
  ANALISE: "Em análise",
  APROVACAO: "Aguarda decisão",
  CONTRATO: "Contrato por assinar",
  DESEMBOLSO: "Aguarda desembolso",
  COBRANCA: "Parcela em atraso",
  FINALIZADOS: "Liquidado",
};

export const opsCards: OpsCard[] = Array.from({ length: 38 }, (_, i) => {
  const s = i + 101;
  const stage = opsStages[i % opsStages.length].key;
  return {
    id: `OPS-${i + 1}`,
    processo: `PR-2026-${String(1200 + i)}`,
    cliente: pick(nomes, s),
    valor: between(s * 3, 25000, 950000),
    data: dateAgo(between(s * 5, 0, 90)),
    responsavel: pick(analistas, s * 7),
    status: statusPorStage[stage],
    prioridade: rnd(s * 9) > 0.75 ? "ALTA" : rnd(s * 11) > 0.4 ? "MEDIA" : "BAIXA",
    stage,
  };
});

/* --------------------------------------------------------------- Empréstimos */

export type BoLoanStatus = "ATIVO" | "LIQUIDADO" | "EM_ATRASO" | "PENDENTE" | "CANCELADO";

export interface BoLoan {
  id: string;
  processo: string;
  clienteId: string;
  cliente: string;
  produto: string;
  valor: number;
  taxaJuros: number;
  parcelasTotal: number;
  parcelasPagas: number;
  estado: BoLoanStatus;
  data: string;
  filial: string;
}

export const boLoans: BoLoan[] = Array.from({ length: 42 }, (_, i) => {
  const s = i + 201;
  const cli = clients[i % clients.length];
  const total = pick([6, 9, 12, 18, 24, 36], s);
  return {
    id: `LN-${2000 + i}`,
    processo: `PR-2026-${String(1200 + i)}`,
    clienteId: cli.id,
    cliente: cli.nome,
    produto: pick(produtos, s * 3),
    valor: between(s * 5, 25000, 1200000),
    taxaJuros: between(s * 7, 12, 32),
    parcelasTotal: total,
    parcelasPagas: between(s * 11, 0, total),
    estado: pick<BoLoanStatus>(["ATIVO", "ATIVO", "ATIVO", "LIQUIDADO", "EM_ATRASO", "PENDENTE", "CANCELADO"], s * 13),
    data: dateAgo(between(s * 17, 5, 700)),
    filial: pick(filiais, s * 19),
  };
});

/* ----------------------------------------------------------------- Garantias */

export type GuaranteeStatus = "AVALIADA" | "PENDENTE" | "REJEITADA" | "LIBERTADA";

export interface Guarantee {
  id: string;
  tipo: string;
  descricao: string;
  valorEstimado: number;
  estado: GuaranteeStatus;
  processo: string;
  cliente: string;
  foto: string;
  avaliador: string;
  data: string;
}

const tiposGarantia = ["Viatura", "Imóvel", "Equipamento", "Stock de mercadoria", "Ordenado", "Aval pessoal"];

export const guarantees: Guarantee[] = Array.from({ length: 24 }, (_, i) => {
  const s = i + 301;
  const loan = boLoans[i % boLoans.length];
  const tipo = pick(tiposGarantia, s);
  return {
    id: `GAR-${3000 + i}`,
    tipo,
    descricao: `${tipo} — ${pick(["bom estado", "estado razoável", "novo", "usado"], s * 3)}, ref. ${between(s * 5, 1000, 9999)}`,
    valorEstimado: between(s * 7, 40000, 2400000),
    estado: pick<GuaranteeStatus>(["AVALIADA", "AVALIADA", "PENDENTE", "REJEITADA", "LIBERTADA"], s * 11),
    processo: loan.processo,
    cliente: loan.cliente,
    foto: `https://picsum.photos/seed/gar${i}/200/140`,
    avaliador: pick(analistas, s * 13),
    data: dateAgo(between(s * 17, 3, 400)),
  };
});

/* ----------------------------------------------------------------- Contratos */

export type ContractStatus = "RASCUNHO" | "AGUARDA_ASSINATURA" | "ATIVO" | "ENCERRADO" | "CANCELADO";

export interface Contract {
  id: string;
  numero: string;
  cliente: string;
  processo: string;
  data: string;
  estado: ContractStatus;
  valor: number;
  responsavel: string;
}

export const contracts: Contract[] = Array.from({ length: 28 }, (_, i) => {
  const s = i + 401;
  const loan = boLoans[i % boLoans.length];
  return {
    id: `CT-${4000 + i}`,
    numero: `CTR/2026/${String(500 + i)}`,
    cliente: loan.cliente,
    processo: loan.processo,
    data: dateAgo(between(s * 3, 2, 500)),
    estado: pick<ContractStatus>(["ATIVO", "ATIVO", "AGUARDA_ASSINATURA", "RASCUNHO", "ENCERRADO", "CANCELADO"], s * 5),
    valor: loan.valor,
    responsavel: pick(analistas, s * 7),
  };
});

/* ------------------------------------------------------------------ Cobrança */

export interface CollectionItem {
  id: string;
  cliente: string;
  processo: string;
  parcela: string;
  diasAtraso: number;
  valor: number;
  prioridade: "CRITICA" | "ALTA" | "MEDIA" | "BAIXA";
  responsavel: string;
  telefone: string;
  ultimoContacto: string;
}

export const collections: CollectionItem[] = Array.from({ length: 34 }, (_, i) => {
  const s = i + 501;
  const cli = clients[(i * 3) % clients.length];
  const dias = between(s * 3, 1, 180);
  return {
    id: `COB-${5000 + i}`,
    cliente: cli.nome,
    processo: `PR-2026-${String(1200 + (i % 42))}`,
    parcela: `${between(s * 5, 1, 12)}/${pick([6, 12, 18, 24], s * 7)}`,
    diasAtraso: dias,
    valor: between(s * 11, 3500, 180000),
    prioridade: dias > 90 ? "CRITICA" : dias > 60 ? "ALTA" : dias > 30 ? "MEDIA" : "BAIXA",
    responsavel: pick(analistas, s * 13),
    telefone: cli.telefone,
    ultimoContacto: dateAgo(between(s * 17, 0, 30)),
  };
});

/* ---------------------------------------------------------------- Financeiro */

export const financeSeries = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez",
].map((mes, i) => {
  const s = i + 601;
  const desembolsos = between(s * 3, 1800000, 5200000);
  const recebimentos = between(s * 5, 1500000, 4800000);
  return {
    mes,
    desembolsos,
    recebimentos,
    juros: Math.round(recebimentos * 0.19),
    despesas: between(s * 7, 380000, 920000),
    carteira: between(s * 11, 12000000, 26000000),
    fluxo: recebimentos - desembolsos,
  };
});

export const financeSummary = {
  totalDesembolsado: financeSeries.reduce((a, b) => a + b.desembolsos, 0),
  recebimentos: financeSeries.reduce((a, b) => a + b.recebimentos, 0),
  juros: financeSeries.reduce((a, b) => a + b.juros, 0),
  despesas: financeSeries.reduce((a, b) => a + b.despesas, 0),
  carteiraAtiva: financeSeries[financeSeries.length - 1].carteira,
  get receita() {
    return this.juros - this.despesas;
  },
  get fluxoCaixa() {
    return this.recebimentos - this.totalDesembolsado;
  },
};

/* ----------------------------------------------------- Dashboard executivo */

export const executiveKpis = {
  clientesAtivos: clients.filter((c) => c.estado === "ACTIVE").length,
  solicitacoesPendentes: opsCards.filter((c) =>
    ["NOVOS_PEDIDOS", "DOCUMENTOS", "ANALISE", "APROVACAO"].includes(c.stage),
  ).length,
  emprestimosAtivos: boLoans.filter((l) => l.estado === "ATIVO").length,
  valorCarteira: financeSummary.carteiraAtiva,
  pagamentosRecebidos: financeSummary.recebimentos,
  taxaAprovacao: 0.734,
  inadimplencia: 0.086,
};

export const recentActivities = Array.from({ length: 10 }, (_, i) => {
  const s = i + 701;
  return {
    id: `ACT-${i}`,
    autor: pick(analistas, s),
    acao: pick(
      [
        "aprovou o processo", "rejeitou o processo", "registou pagamento em", "criou contrato para",
        "solicitou documentos em", "desembolsou o processo", "avaliou garantia de",
      ],
      s * 3,
    ),
    alvo: `PR-2026-${String(1200 + between(s * 5, 0, 41))}`,
    data: dateAgo(rnd(s * 7) * 6),
  };
});

export const systemAlerts = [
  { id: "AL-1", nivel: "error" as const, titulo: "12 parcelas vencidas há mais de 90 dias", detalhe: "Carteira em risco: 1.240.000 MZN" },
  { id: "AL-2", nivel: "warning" as const, titulo: "7 contratos por assinar", detalhe: "Bloqueiam desembolso de 5 processos" },
  { id: "AL-3", nivel: "warning" as const, titulo: "9 processos com documentos em falta", detalhe: "Média de 4 dias parados" },
  { id: "AL-4", nivel: "info" as const, titulo: "Backup diário concluído", detalhe: "Hoje às 03:00" },
];

export const portfolioSeries = financeSeries.map((f) => ({ mes: f.mes, carteira: f.carteira }));

export const boFiliais = filiais;
export const boProdutos = produtos;
export const boAnalistas = analistas;
