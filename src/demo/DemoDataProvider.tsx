import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { DemoData, DemoScenario } from "./demo.types";
import { demoStore } from "./demoStore";
import { applyDemoScenario, resetDemoScenario } from "./demoScenario";

interface DemoCtx {
  data: DemoData;
  scenario: DemoScenario;
  applyScenario: (scenario: DemoScenario) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoCtx | null>(null);

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const data = useSyncExternalStore(demoStore.subscribe, demoStore.getState, demoStore.getState);

  const applyScenario = useCallback((scenario: DemoScenario) => applyDemoScenario(scenario), []);
  const reset = useCallback(() => resetDemoScenario(), []);

  const value = useMemo(
    () => ({ data, scenario: data.scenario, applyScenario, reset }),
    [data, applyScenario, reset],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoData() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemoData deve ser usado dentro de DemoDataProvider");
  return ctx;
}

/** Acesso directo ao estado, para componentes fora do provider. */
export function useDemoStore(): DemoData {
  return useSyncExternalStore(demoStore.subscribe, demoStore.getState, demoStore.getState);
}
