"use client";

import { PrimarySidebar } from "./primary-sidebar";
import { SecondarySidebar } from "./secondary-sidebar";
import { BottomNav } from "./bottom-nav";
import { MobileHeader } from "./mobile-header";

export function AppSidebar() {
  return (
    <>
      <MobileHeader />
      <PrimarySidebar />
      <SecondarySidebar />
      <BottomNav />
    </>
  );
}
