"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/navigation";
import { MainContent } from "@/components/layout/main-content";
import { ReactNode } from "react";

export function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Don't show sidebar/navigation on auth pages
  const isAuthPage = pathname === "/" ||
                     pathname?.startsWith("/sign-in") || 
                     pathname?.startsWith("/sign-up") || 
                     pathname?.startsWith("/login") ||
                     pathname === "/onboarding";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      <AppSidebar />
      <MainContent>{children}</MainContent>
    </>
  );
}
