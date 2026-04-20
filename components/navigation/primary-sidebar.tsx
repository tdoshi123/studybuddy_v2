"use client";

import { usePathname } from "next/navigation";
import { NavItem } from "./nav-item";
import {
  NAV_ITEMS,
  TEACHER_NAV_ITEMS,
  PARENT_NAV_ITEMS,
  SIS_STUDENT_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  SIDEBAR_CONFIG,
  getSidebarWidth,
  usesSisParentSidebar,
} from "@/lib/constants/navigation";

export function PrimarySidebar() {
  const pathname = usePathname();
  const isTeacher = pathname?.startsWith("/lis/teacher");
  const sisParentStyle = usesSisParentSidebar(pathname);
  const isAdminPortal = pathname?.startsWith("/sis/admin");
  const isStudentPortal = pathname?.startsWith("/sis/student");
  const items = isAdminPortal
    ? ADMIN_NAV_ITEMS
    : isStudentPortal
      ? SIS_STUDENT_NAV_ITEMS
      : sisParentStyle
        ? PARENT_NAV_ITEMS
        : isTeacher
          ? TEACHER_NAV_ITEMS
          : NAV_ITEMS;
  const width = getSidebarWidth(pathname);

  const topItems = items.filter((item) => item.position !== "bottom");
  const bottomItems = items.filter((item) => item.position === "bottom");

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-screen flex-col z-50"
      style={{
        width,
        backgroundColor: SIDEBAR_CONFIG.primaryBg,
      }}
    >
      {/* Logo / Brand */}
      {sisParentStyle ? (
        <div className="flex items-center gap-2.5 h-[68px] flex-shrink-0 px-4">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-inner flex-shrink-0">
            <span className="text-white font-bold text-base tracking-tight">S</span>
          </div>
          <span className="text-white/90 font-bold text-sm tracking-tight">StudyBuddy</span>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[68px] flex-shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
            <span className="text-white font-bold text-lg tracking-tight">S</span>
          </div>
        </div>
      )}

      {/* Top Navigation Items */}
      <nav className={`flex-1 flex flex-col py-4 overflow-y-auto ${sisParentStyle ? "gap-0.5" : ""}`}>
        {topItems.map((item) => (
          <NavItem key={item.id} item={item} horizontal={sisParentStyle} />
        ))}
      </nav>

      {/* Bottom Navigation Items */}
      <nav className={`flex flex-col py-3 ${sisParentStyle ? "gap-0.5" : ""}`}>
        {bottomItems.map((item) => (
          <NavItem key={item.id} item={item} horizontal={sisParentStyle} />
        ))}
      </nav>
    </aside>
  );
}
