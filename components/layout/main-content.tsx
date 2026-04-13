"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getSidebarWidth } from "@/lib/constants/navigation";

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  const sidebarWidth = getSidebarWidth(pathname);

  return (
    <main
      className="min-h-screen pb-16 md:pb-0 max-md:!pl-0"
      style={{ paddingLeft: sidebarWidth }}
    >
      <div className="px-4 py-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[1400px] mx-auto">
        {children}
      </div>
    </main>
  );
}
