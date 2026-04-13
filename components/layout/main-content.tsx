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
      className="min-h-screen md:pl-[96px] pb-16 md:pb-0"
    >
      <div className="px-4 py-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[1400px] mx-auto">
        {children}
      </div>
    </main>
  );
}
