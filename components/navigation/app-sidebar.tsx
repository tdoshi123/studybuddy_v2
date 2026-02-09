"use client";

import { PrimarySidebar } from "./primary-sidebar";
import { SecondarySidebar } from "./secondary-sidebar";
import { BottomNav } from "./bottom-nav";

export function AppSidebar() {
  return (
    <>
      <PrimarySidebar />
      <SecondarySidebar />
      <BottomNav />
    </>
  );
}
