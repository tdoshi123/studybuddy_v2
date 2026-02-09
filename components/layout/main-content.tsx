"use client";

import { ReactNode } from "react";
import { SIDEBAR_CONFIG } from "@/lib/constants/navigation";

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  // Content always has the same padding - secondary sidebar overlays on top
  // On mobile, no left padding, but add bottom padding for bottom nav
  return (
    <main
      className="min-h-screen md:pl-[72px] pb-16 md:pb-0"
    >
      {children}
    </main>
  );
}
