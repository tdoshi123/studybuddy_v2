"use client";

import { User, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotifications } from "@/lib/hooks";

export function MobileHeader() {
  const pathname = usePathname();
  const notifications = useNotifications();
  
  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/courses") return "Courses";
    if (pathname.startsWith("/courses/")) return "Course";
    if (pathname === "/calendar") return "Calendar";
    if (pathname === "/grades") return "Grades";
    if (pathname === "/messages") return "Messages";
    if (pathname === "/bus") return "Bus";
    if (pathname === "/inbox") return "Inbox";
    if (pathname === "/account") return "Account";
    return "StudyBuddy";
  };

  const totalNotifications = notifications.inbox + notifications.messages + notifications.grades;

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6E8CB9] flex items-center justify-center">
            <span className="text-white font-bold text-sm">SB</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <Link
            href="/inbox"
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {totalNotifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalNotifications > 9 ? "9+" : totalNotifications}
              </span>
            )}
          </Link>

          {/* Account Button */}
          <Link
            href="/account"
            className={`p-2 rounded-lg transition-colors touch-manipulation ${
              pathname === "/account"
                ? "bg-[#6E8CB9] text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            aria-label="Account Settings"
          >
            <User className={`w-5 h-5 ${
              pathname === "/account"
                ? "text-white"
                : "text-gray-600 dark:text-gray-400"
            }`} />
          </Link>
        </div>
      </div>
    </header>
  );
}
