import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[60vh] grid place-items-center p-8">
          <div className="max-w-md text-center">
            <h2 className="text-xl font-semibold text-foreground">Algo correu mal</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {this.state.error.message || "Erro inesperado."}
            </p>
            <Button className="mt-4" onClick={() => this.setState({ error: null })}>
              Tentar novamente
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
