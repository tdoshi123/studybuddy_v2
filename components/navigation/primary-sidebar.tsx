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
      <div className="flex items-center justify-center h-16">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
      </div>

      {/* Top Navigation Items */}
      <nav className="flex-1 flex flex-col py-4">
        {topItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>

      {/* Bottom Navigation Items */}
      <nav className="py-4">
        {bottomItems.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </nav>
    </aside>
  );
}
