import type { DemoData } from "./demo.types";
import { buildInitialDemoData } from "./fixtures";

const STORAGE_KEY = "jcf.demo.state.v2";

type Listener = () => void;

function load(): DemoData {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DemoData;
  } catch {
    // sessionStorage indisponível — usar dados iniciais
  }
  return buildInitialDemoData();
}

function persist(data: DemoData) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignorar: a demo continua em memória
  }
}

let state: DemoData = load();
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export const demoStore = {
  getState(): DemoData {
    return state;
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  update(updater: (current: DemoData) => DemoData) {
    state = updater(state);
    persist(state);
    emit();
    return state;
  },
  replace(next: DemoData) {
    state = next;
    persist(state);
    emit();
    return state;
  },
  clear() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorar
    }
    state = buildInitialDemoData();
    persist(state);
    emit();
    return state;
  },
};

/** Contadores determinísticos por prefixo (sem Math.random). */
export function nextId(prefix: string, existing: { id: string }[]): string {
  const numbers = existing
    .map((e) => Number(e.id.replace(/\D+/g, "")))
    .filter((n) => Number.isFinite(n));
  const max = numbers.length ? Math.max(...numbers) : 0;
  return `${prefix}-${String(max + 1).padStart(4, "0")}`;
}

export function nextSequence(existing: string[], pattern: RegExp): number {
  const numbers = existing
    .map((value) => {
      const match = value.match(pattern);
      return match ? Number(match[1]) : NaN;
    })
    .filter((n) => Number.isFinite(n));
  return (numbers.length ? Math.max(...numbers) : 0) + 1;
}

export const nowIso = () => new Date().toISOString();
