import type { Branch, CreditProduct, Permission, Role } from "../demo.types";

export const branches: Branch[] = [
  {
    id: "AGE-MAP",
    name: "Agência Maputo",
    city: "Maputo",
    address: "Av. 24 de Julho, 1200, Maputo",
    phone: "+258 21 300 100",
  },
  {
    id: "AGE-BOA",
    name: "Agência Boane",
    city: "Boane",
    address: "Rua Central, Campoane, Boane",
    phone: "+258 21 300 200",
  },
  {
    id: "AGE-MAT",
    name: "Agência Matola",
    city: "Matola",
    address: "Av. da Namaacha, Matola",
    phone: "+258 21 300 300",
  },
];

export const products: CreditProduct[] = [
  {
    id: "PRD-CGI",
    code: "CGI",
    name: "Capital de Giro",
    description: "Financiamento de stock e despesas correntes de negócios formais e informais.",
    minAmount: 20000,
    maxAmount: 600000,
    terms: [3, 6, 9, 12, 18, 24],
    monthlyRate: 0.025,
  },
  {
    id: "PRD-EQP",
    code: "EQP",
    name: "Crédito Equipamento",
    description: "Aquisição de equipamento produtivo com garantia sobre o bem financiado.",
    minAmount: 50000,
    maxAmount: 600000,
    terms: [6, 12, 18, 24],
    monthlyRate: 0.023,
  },
  {
    id: "PRD-PES",
    code: "PES",
    name: "Crédito Pessoal",
    description: "Apoio a despesas pessoais com prestações fixas e prazo curto.",
    minAmount: 5000,
    maxAmount: 200000,
    terms: [3, 6, 9, 12],
    monthlyRate: 0.028,
  },
  {
    id: "PRD-AGR",
    code: "AGR",
    name: "Crédito Agrícola",
    description: "Campanha agrícola, insumos e pequenos equipamentos de rega.",
    minAmount: 20000,
    maxAmount: 350000,
    terms: [6, 9, 12],
    monthlyRate: 0.024,
  },
];

export const permissions: Permission[] = [
  { id: "p-1", key: "pedidos.ver", description: "Consultar pedidos de crédito" },
  { id: "p-2", key: "pedidos.editar", description: "Editar pedidos de crédito" },
  { id: "p-3", key: "analise.registar", description: "Registar análise de crédito" },
  { id: "p-4", key: "decisao.registar", description: "Registar decisão de crédito" },
  { id: "p-5", key: "contratos.preparar", description: "Preparar contratos" },
  { id: "p-6", key: "contratos.assinar", description: "Marcar contrato como assinado" },
  { id: "p-7", key: "desembolsos.preparar", description: "Preparar desembolsos" },
  { id: "p-8", key: "desembolsos.autorizar", description: "Autorizar desembolsos" },
  { id: "p-9", key: "pagamentos.registar", description: "Registar pagamentos" },
  { id: "p-10", key: "cobrancas.gerir", description: "Gerir cobranças" },
  { id: "p-11", key: "clientes.ver", description: "Consultar clientes" },
  { id: "p-12", key: "utilizadores.gerir", description: "Gerir utilizadores" },
  { id: "p-13", key: "perfis.gerir", description: "Gerir perfis e permissões" },
  { id: "p-14", key: "auditoria.ver", description: "Consultar auditoria" },
  { id: "p-15", key: "relatorios.ver", description: "Consultar relatórios" },
  { id: "p-16", key: "marcacoes.gerir", description: "Gerir marcações de atendimento" },
  { id: "p-17", key: "configuracoes.gerir", description: "Gerir configurações" },
];

const all = permissions.map((p) => p.key);

export const roles: Role[] = [
  {
    id: "r-admin",
    code: "ADMIN",
    name: "Administrador",
    description: "Acesso total à plataforma, incluindo perfis, permissões e configurações.",
    permissions: all,
  },
  {
    id: "r-manager",
    code: "MANAGER",
    name: "Gestor de Crédito",
    description: "Decide pedidos de crédito, aprova contratos e acompanha a carteira.",
    permissions: all.filter((k) => !["perfis.gerir", "configuracoes.gerir"].includes(k)),
  },
  {
    id: "r-analyst",
    code: "ANALYST",
    name: "Analista de Crédito",
    description: "Analisa pedidos, valida documentos e recomenda condições.",
    permissions: [
      "pedidos.ver",
      "pedidos.editar",
      "analise.registar",
      "clientes.ver",
      "marcacoes.gerir",
      "relatorios.ver",
    ],
  },
  {
    id: "r-support",
    code: "SUPPORT",
    name: "Atendimento",
    description: "Recebe pedidos, gere marcações e apoia o cliente.",
    permissions: ["pedidos.ver", "clientes.ver", "marcacoes.gerir", "utilizadores.gerir"],
  },
  {
    id: "r-finance",
    code: "FINANCE",
    name: "Financeiro",
    description: "Prepara e autoriza desembolsos e registo de pagamentos.",
    permissions: [
      "desembolsos.preparar",
      "desembolsos.autorizar",
      "pagamentos.registar",
      "pedidos.ver",
      "relatorios.ver",
    ],
  },
  {
    id: "r-collections",
    code: "COLLECTIONS",
    name: "Cobranças",
    description: "Acompanha prestações em atraso e acções de cobrança.",
    permissions: ["cobrancas.gerir", "pagamentos.registar", "clientes.ver", "relatorios.ver"],
  },
  {
    id: "r-audit",
    code: "AUDIT",
    name: "Auditoria",
    description: "Consulta registos de auditoria e relatórios, sem alterar dados.",
    permissions: ["auditoria.ver", "relatorios.ver", "pedidos.ver", "clientes.ver"],
  },
  {
    id: "r-user",
    code: "USER",
    name: "Cliente",
    description: "Acompanha os seus pedidos de crédito, marcações e pagamentos.",
    permissions: [],
  },
];
