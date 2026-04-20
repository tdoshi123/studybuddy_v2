"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  NAV_ITEMS,
  TEACHER_NAV_ITEMS,
  PARENT_NAV_ITEMS,
  SIS_STUDENT_NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  usesSisParentSidebar,
} from "@/lib/constants/navigation";
import { useNotifications } from "@/lib/hooks";

export function BottomNav() {
  const pathname = usePathname();
  const notifications = useNotifications();
  const isTeacher = pathname?.startsWith("/lis/teacher");
  const sisParentStyle = usesSisParentSidebar(pathname);
  const isAdminPortal = pathname?.startsWith("/sis/admin");
  const isStudentPortal = pathname?.startsWith("/sis/student");

  const allItems = isAdminPortal
    ? ADMIN_NAV_ITEMS
    : isStudentPortal
      ? SIS_STUDENT_NAV_ITEMS
      : sisParentStyle
        ? PARENT_NAV_ITEMS
        : isTeacher
          ? TEACHER_NAV_ITEMS
          : NAV_ITEMS;
  const mobileNavItems = allItems.filter(
    (item) => item.position !== "bottom" && item.id !== "account"
  ).slice(0, 5);

  const getNotificationCount = (itemId: string) => {
    switch (itemId) {
      case "inbox":
        return notifications.inbox;
      case "grades":
        return notifications.grades;
      default:
        return 0;
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-area-bottom" style={{ backgroundColor: "#1e3a8a" }}>
      <div className="flex items-center justify-around h-16 px-1">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false);
          const notificationCount = getNotificationCount(item.id);

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full relative transition-colors"
            >
              {/* Active pill background */}
              {isActive && (
                <span className="absolute inset-x-2 inset-y-2 rounded-xl bg-white/15" />
              )}
              <div className="relative z-10">
                <Icon
                  className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-white/60"}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold z-10 transition-colors ${
                  isActive ? "text-white" : "text-white/60"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
