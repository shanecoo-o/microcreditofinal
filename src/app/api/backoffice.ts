/**
 * Services do Backoffice.
 * Cada função corresponde a um endpoint futuro do Spring Boot (indicado no comentário).
 * Hoje devolvem dados mockados via `delay()` para manter a mesma assinatura assíncrona.
 */
import { delay } from "./http";
import {
  boLoans, clients, collections, contracts, executiveKpis, financeSeries,
  financeSummary, guarantees, opsCards, portfolioSeries, recentActivities, systemAlerts,
  type BoLoan, type Client, type CollectionItem, type Contract, type Guarantee, type OpsCard,
} from "../mock/backoffice";

export const dashboardService = {
  /** GET /api/dashboard/kpis */
  kpis: () => delay(executiveKpis),
  /** GET /api/dashboard/portfolio-series */
  portfolio: () => delay(portfolioSeries),
  /** GET /api/dashboard/activities */
  activities: () => delay(recentActivities),
  /** GET /api/dashboard/alerts */
  alerts: () => delay(systemAlerts),
};

export const operationsService = {
  /** GET /api/operations/board */
  board: (): Promise<OpsCard[]> => delay(opsCards),
};

export const clientsService = {
  /** GET /api/clients */
  list: (): Promise<Client[]> => delay(clients),
  /** GET /api/clients/{id} */
  byId: (id: string) => delay(clients.find((c) => c.id === id) ?? null),
};

export const loansService = {
  /** GET /api/loans */
  list: (): Promise<BoLoan[]> => delay(boLoans),
  /** GET /api/clients/{id}/loans */
  byClient: (clienteId: string) => delay(boLoans.filter((l) => l.clienteId === clienteId)),
};

export const guaranteesService = {
  /** GET /api/guarantees */
  list: (): Promise<Guarantee[]> => delay(guarantees),
};

export const contractsService = {
  /** GET /api/contracts */
  list: (): Promise<Contract[]> => delay(contracts),
};

export const financeService = {
  /** GET /api/finance/summary */
  summary: () => delay({ ...financeSummary, receita: financeSummary.receita, fluxoCaixa: financeSummary.fluxoCaixa }),
  /** GET /api/finance/series */
  series: () => delay(financeSeries),
};

export const collectionsService = {
  /** GET /api/collections */
  list: (): Promise<CollectionItem[]> => delay(collections),
};
