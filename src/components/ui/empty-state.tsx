"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card/20 backdrop-blur-xl border border-border/40 rounded-3xl max-w-md mx-auto space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground/80">
        <Icon size={32} weight="duotone" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-black tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
          {description}
        </p>
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          className="rounded-xl px-6 py-2 h-auto text-xs font-bold uppercase tracking-widest"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
