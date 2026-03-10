"use client";

import { Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotifications } from "@/lib/hooks";
import { useClerk } from "@clerk/nextjs";

export function MobileHeader() {
  const pathname = usePathname();
  const notifications = useNotifications();
  const { signOut } = useClerk();

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname === "/dashboard" || pathname === "/student/dashboard") return "Dashboard";
    if (pathname === "/student/courses") return "Courses";
    if (pathname.startsWith("/student/courses/")) return "Course";
    if (pathname === "/student/calendar") return "Calendar";
    if (pathname === "/student/grades") return "Grades";
    if (pathname === "/student/attendance") return "Attendance";
    if (pathname === "/student/inbox") return "Inbox";
    if (pathname === "/account") return "Account";
    return "StudyBuddy";
  };

  const totalNotifications = notifications.inbox + notifications.grades;

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Title */}
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getPageTitle()}
        </h1>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications Button */}
          <Link
            href="/student/inbox"
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

          {/* Logout Button */}
          <button
            onClick={() => signOut()}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            aria-label="Log Out"
          >
            <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
