"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 120, height = 31 }: LogoProps) {
  return (
    <div className={cn("relative", className)} style={{ width, height }}>
      <Image
        src="/logo_white.svg"
        alt="Lume Logo"
        fill
        priority
        className="object-contain hidden dark:block"
      />
      <Image
        src="/logo_black.svg"
        alt="Lume Logo"
        fill
        priority
        className="object-contain block dark:hidden"
      />
    </div>
  );
}
