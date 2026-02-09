"use client";

import { ReactNode } from "react";
import { SIDEBAR_CONFIG } from "@/lib/constants/navigation";

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  // Content always has the same padding - secondary sidebar overlays on top
  return (
    <main
      className="min-h-screen"
      style={{ paddingLeft: SIDEBAR_CONFIG.primaryWidth }}
    >
      {children}
    </main>
  );
}
