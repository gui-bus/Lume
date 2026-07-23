"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Warning } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/Logo";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#020617] canvas-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-border/40 p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 text-center">
        <Logo width={100} height={26} />

        <div className="w-16 h-16 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center mt-2">
          <Warning size={32} weight="duotone" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black tracking-tight text-foreground">
            Algo deu errado
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Ocorreu um erro inesperado ao processar sua solicitação. Por favor,
            tente novamente.
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="w-full py-3 h-auto rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-[0.98]"
          >
            Tentar Novamente
          </Button>
          <Button
            variant="ghost"
            onClick={() => (window.location.href = "/")}
            className="w-full py-3 h-auto rounded-2xl text-xs font-bold uppercase tracking-widest"
          >
            Ir para a Home
          </Button>
        </div>
      </div>
    </main>
  );
}
