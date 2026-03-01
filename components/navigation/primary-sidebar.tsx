"use client";

import { NavItem } from "./nav-item";
import { NAV_ITEMS, SIDEBAR_CONFIG } from "@/lib/constants/navigation";

export function PrimarySidebar() {
  const topItems = NAV_ITEMS.filter((item) => item.position !== "bottom");
  const bottomItems = NAV_ITEMS.filter((item) => item.position === "bottom");

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-screen flex-col z-50"
      style={{
        width: SIDEBAR_CONFIG.primaryWidth,
        backgroundColor: SIDEBAR_CONFIG.primaryBg,
      }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center justify-center h-[68px] flex-shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
          <span className="text-white font-bold text-lg tracking-tight">S</span>
        </div>
      </div>

      {/* Top Navigation Items */}
      <nav className="flex-1 flex flex-col py-4 overflow-y-auto">
        {topItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation Items */}
      <nav className="flex flex-col py-3">
        {bottomItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>
    </aside>
  );
}
