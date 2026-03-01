"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { SIDEBAR_CONFIG } from "@/lib/constants/navigation";
import { useSidebar } from "./sidebar-provider";
import { cn } from "@/lib/utils";

// Mock courses for the secondary sidebar
const ENROLLED_COURSES = [
  { id: "1", name: "Math - Period 3", code: "Mrs. Johnson" },
  { id: "2", name: "English Language Arts", code: "Mr. Thompson" },
  { id: "3", name: "Science - Period 4", code: "Ms. Garcia" },
  { id: "4", name: "Social Studies", code: "Mr. Williams" },
  { id: "5", name: "Art", code: "Mrs. Davis" },
  { id: "6", name: "Physical Education", code: "Coach Martinez" },
];

export function SecondarySidebar() {
  const pathname = usePathname();
  const { isSecondaryOpen, closeSecondarySidebar } = useSidebar();

  return (
    <AnimatePresence>
      {isSecondaryOpen && (
        <motion.aside
          initial={{ x: -SIDEBAR_CONFIG.secondaryWidth, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -SIDEBAR_CONFIG.secondaryWidth, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 h-screen z-40 shadow-2xl flex flex-col bg-white dark:bg-slate-900"
          style={{
            left: SIDEBAR_CONFIG.primaryWidth,
            width: SIDEBAR_CONFIG.secondaryWidth,
          }}
        >
          {/* Header */}
          <div className="h-[68px] flex items-center justify-between px-5 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
            <h2 className="text-gray-900 dark:text-white font-semibold text-base tracking-tight">Courses</h2>
            <button
              onClick={closeSecondarySidebar}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Course List */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
            {/* All Courses */}
            <Link
              href="/courses"
              onClick={() => closeSecondarySidebar()}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200",
                pathname === "/courses"
                  ? "bg-[#1e3a8a]/10 text-[#1e3a8a] dark:text-blue-400 font-semibold"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              )}
            >
              <span className="text-sm">All Courses</span>
            </Link>

            {/* Divider */}
            <div className="mx-4 my-2 border-t border-gray-200 dark:border-slate-700" />

            {/* Enrolled Courses */}
            {ENROLLED_COURSES.map((course) => {
              const courseHref = `/courses/${course.id}`;
              const isActive = pathname === courseHref || pathname.startsWith(`${courseHref}/`);

              return (
                <Link
                  key={course.id}
                  href={courseHref}
                  onClick={() => closeSecondarySidebar()}
                  className={cn(
                    "flex flex-col px-4 py-2.5 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-[#1e3a8a]/10"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm line-clamp-1",
                      isActive ? "font-semibold text-[#1e3a8a] dark:text-blue-400" : "font-medium text-gray-900 dark:text-white"
                    )}
                  >
                    {course.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{course.code}</span>
                </Link>
              );
            })}
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
