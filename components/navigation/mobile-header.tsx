"use client";

import { Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotifications } from "@/lib/hooks";
import { usesSisParentSidebar } from "@/lib/constants/navigation";
import { useClerk } from "@clerk/nextjs";

export function MobileHeader() {
  const pathname = usePathname();
  const notifications = useNotifications();
  const { signOut } = useClerk();
  const sisParentStyle = usesSisParentSidebar(pathname);

  const getPageTitle = () => {
    const sisNorm =
      pathname?.startsWith("/sis/student")
        ? pathname.replace("/sis/student", "/sis/parent")
        : pathname?.startsWith("/sis/parent")
          ? pathname
          : null;
    if (sisNorm) {
      if (sisNorm === "/sis/parent/dashboard") return "Dashboard";
      if (sisNorm === "/sis/parent/grades-attendance") return "Grades & Attendance";
      if (
        sisNorm.startsWith("/sis/parent/grades-attendance/") &&
        sisNorm !== "/sis/parent/grades-attendance"
      )
        return "Course";
      if (sisNorm === "/sis/parent/test-results") return "Test Results";
      if (sisNorm === "/sis/parent/grade-history") return "Grade History";
      if (sisNorm === "/sis/parent/state-test-reports") return "State Tests";
      if (sisNorm === "/sis/parent/teacher-comments") return "Teacher Comments";
      if (sisNorm === "/sis/parent/student-forms") return "Student Forms";
      if (sisNorm === "/sis/parent/student-schedule") return "Schedule";
      if (sisNorm === "/sis/parent/school-information") return "School Info";
      if (sisNorm === "/sis/parent/settings") return "Settings";
      if (sisNorm === "/sis/parent/transportation-info") return "Transportation";
      if (sisNorm === "/sis/parent/class-registration") return "Registration";
    }
    if (pathname === "/dashboard" || pathname === "/lis/student/dashboard") return "Dashboard";
    if (pathname === "/lis/student/courses") return "Courses";
    if (pathname?.startsWith("/lis/student/courses/")) return "Course";
    if (pathname === "/lis/student/calendar") return "Calendar";
    if (pathname === "/lis/student/grades") return "Grades";
    if (pathname === "/lis/student/attendance") return "Attendance";
    if (pathname === "/lis/student/inbox") return "Inbox";
    if (pathname === "/lis/teacher/dashboard") return "Dashboard";
    if (pathname === "/lis/teacher/courses") return "Courses";
    if (pathname?.startsWith("/lis/teacher/courses/")) return "Course";
    if (pathname === "/lis/teacher/assignments") return "Assignments";
    if (pathname === "/lis/teacher/quizzes") return "Quizzes";
    if (pathname === "/lis/teacher/discussions") return "Discussions";
    if (pathname === "/lis/teacher/announcements") return "Announcements";
    if (pathname === "/lis/teacher/gradebook") return "Gradebook";
    if (pathname === "/lis/teacher/inbox") return "Inbox";
    if (pathname === "/lis/teacher/settings") return "Settings";
    if (pathname === "/lis/student/settings") return "Settings";
    return "StudyBuddy";
  };

  const totalNotifications = notifications.inbox + notifications.grades;

  return (
    <header className="md:hidden sticky top-0 z-40 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          {getPageTitle()}
        </h1>
        <div className="flex items-center gap-2">
          <Link
            href={
              pathname?.startsWith("/sis/student")
                ? "/sis/student/dashboard"
                : sisParentStyle
                  ? "/sis/parent/dashboard"
                  : pathname?.startsWith("/lis/teacher")
                    ? "/lis/teacher/inbox"
                    : "/lis/student/inbox"
            }
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
