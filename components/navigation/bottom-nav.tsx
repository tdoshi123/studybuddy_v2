"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { useNotifications } from "@/lib/hooks";

export function BottomNav() {
  const pathname = usePathname();
  const notifications = useNotifications();

  // Only show main navigation items in bottom nav (exclude Account which is less frequently used)
  const mobileNavItems = NAV_ITEMS.filter(
    (item) => item.position !== "bottom" && item.id !== "account"
  ).slice(0, 5); // Limit to 5 items for better mobile UX

  const getNotificationCount = (itemId: string) => {
    switch (itemId) {
      case "messages":
        return notifications.messages;
      case "inbox":
        return notifications.inbox;
      case "grades":
        return notifications.grades;
      default:
        return 0;
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1a1a1a] dark:bg-[#0a0a0a] border-t border-gray-800 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const notificationCount = getNotificationCount(item.id);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isActive ? "text-white" : "text-gray-400"
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
