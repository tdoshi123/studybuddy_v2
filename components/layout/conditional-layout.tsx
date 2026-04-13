"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/navigation";
import { MainContent } from "@/components/layout/main-content";
import { ReactNode } from "react";

export function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Don't show student sidebar on auth pages or role-specific layouts that manage their own sidebar
  const isAuthPage = pathname === "/" ||
                     pathname?.startsWith("/sign-in") || 
                     pathname?.startsWith("/sign-up") || 
                     pathname?.startsWith("/login") ||
                     pathname === "/onboarding";

  const hasOwnLayout = pathname?.startsWith("/sis/admin");

  if (isAuthPage || hasOwnLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <AppSidebar />
      <MainContent>{children}</MainContent>
    </>
  );
}
