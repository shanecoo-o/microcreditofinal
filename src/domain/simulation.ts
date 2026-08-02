/**
 * Regras únicas de simulação de crédito (valores demonstrativos).
 * Toda a aplicação — website, pré-candidatura e backoffice — usa este ficheiro.
 */

export interface FeeTier {
  min: number;
  max: number;
  fee: number;
}

/** Taxa de inscrição demonstrativa por intervalo de montante (MZN). */
export const REGISTRATION_FEE_TIERS: FeeTier[] = [
  { min: 5000, max: 20000, fee: 247 },
  { min: 20001, max: 50000, fee: 397 },
  { min: 50001, max: 100000, fee: 797 },
  { min: 100001, max: 200000, fee: 1297 },
  { min: 200001, max: 350000, fee: 1797 },
  { min: 350001, max: 600000, fee: 2497 },
];

export const MIN_AMOUNT = REGISTRATION_FEE_TIERS[0].min;
export const MAX_AMOUNT = REGISTRATION_FEE_TIERS[REGISTRATION_FEE_TIERS.length - 1].max;
export const AVAILABLE_TERMS = [3, 6, 9, 12, 18, 24];

/** Taxa mensal demonstrativa por defeito. */
export const DEFAULT_MONTHLY_RATE = 0.025;

/** Cobertura total dos intervalos, sem lacunas. */
export function getRegistrationFee(amount: number): number {
  const clamped = Math.min(Math.max(amount, MIN_AMOUNT), MAX_AMOUNT);
  const tier =
    REGISTRATION_FEE_TIERS.find((t) => clamped >= t.min && clamped <= t.max) ??
    REGISTRATION_FEE_TIERS[REGISTRATION_FEE_TIERS.length - 1];
  return tier.fee;
}

export interface SimulationInput {
  amount: number;
  termMonths: number;
  monthlyRate?: number;
}

export interface SimulationResult {
  amount: number;
  termMonths: number;
  monthlyRate: number;
  monthlyInstallment: number;
  totalToRepay: number;
  totalInterest: number;
  registrationFee: number;
  estimatedCost: number;
}

/** Prestação constante (amortização francesa) — valor demonstrativo. */
export function simulateCredit({
  amount,
  termMonths,
  monthlyRate = DEFAULT_MONTHLY_RATE,
}: SimulationInput): SimulationResult {
  const safeAmount = Math.min(Math.max(Math.round(amount), MIN_AMOUNT), MAX_AMOUNT);
  const n = Math.max(1, Math.round(termMonths));
  const factor = monthlyRate === 0 ? 1 / n : monthlyRate / (1 - Math.pow(1 + monthlyRate, -n));
  const monthlyInstallment = Math.round(safeAmount * factor);
  const totalToRepay = monthlyInstallment * n;
  const registrationFee = getRegistrationFee(safeAmount);

  return {
    amount: safeAmount,
    termMonths: n,
    monthlyRate,
    monthlyInstallment,
    totalToRepay,
    totalInterest: totalToRepay - safeAmount,
    registrationFee,
    estimatedCost: totalToRepay - safeAmount + registrationFee,
  };
}

export interface ScheduleRow {
  number: number;
  principal: number;
  interest: number;
  total: number;
  balanceAfter: number;
}

/**
 * Plano de prestações determinístico.
 * Quando `fixedInstallment` é indicado, a última prestação absorve o valor residual.
 */
export function buildSchedule(
  principal: number,
  termMonths: number,
  monthlyRate = DEFAULT_MONTHLY_RATE,
  fixedInstallment?: number,
): ScheduleRow[] {
  const payment =
    fixedInstallment ?? simulateCredit({ amount: principal, termMonths, monthlyRate }).monthlyInstallment;
  const rows: ScheduleRow[] = [];
  let balance = principal;

  for (let i = 1; i <= termMonths; i += 1) {
    const interest = Math.round(balance * monthlyRate);
    const isLast = i === termMonths;
    let total = payment;
    let principalPart = total - interest;

    if (isLast || principalPart >= balance) {
      principalPart = balance;
      total = principalPart + interest;
    }

    balance = Math.max(0, balance - principalPart);
    rows.push({ number: i, principal: principalPart, interest, total, balanceAfter: balance });
    if (balance === 0 && !isLast) break;
  }

  return rows;
}
