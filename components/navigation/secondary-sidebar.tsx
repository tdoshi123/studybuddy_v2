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
          className="fixed top-0 h-screen z-40 shadow-xl bg-white"
          style={{
            left: SIDEBAR_CONFIG.primaryWidth,
            width: SIDEBAR_CONFIG.secondaryWidth,
          }}
        >
          {/* Header with close button */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200">
            <h2 className="text-gray-900 font-semibold text-lg">Courses</h2>
            <button
              onClick={closeSecondarySidebar}
              className="p-1 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Course List */}
          <nav className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1">
              {/* All Courses Link - navigates and closes sidebar */}
              <Link
                href="/courses"
                onClick={() => closeSecondarySidebar()}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-gray-100",
                  pathname === "/courses" && "bg-[#6E8CB9]/10"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-medium text-gray-700",
                    pathname === "/courses" && "text-[#6E8CB9] font-semibold"
                  )}
                >
                  All Courses
                </span>
              </Link>

              {/* Divider */}
              <div className="my-2 border-t border-gray-100" />

              {/* Enrolled Courses - navigate to class dashboard and close sidebar */}
              {ENROLLED_COURSES.map((course) => {
                const courseHref = `/courses/${course.id}`;
                const isActive = pathname === courseHref || pathname.startsWith(`${courseHref}/`);

                return (
                  <Link
                    key={course.id}
                    href={courseHref}
                    onClick={() => closeSecondarySidebar()}
                    className={cn(
                      "flex flex-col px-4 py-2 rounded-lg transition-all duration-200",
                      "hover:bg-gray-100",
                      isActive && "bg-[#6E8CB9]/10"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium text-gray-700 line-clamp-1",
                        isActive && "text-[#6E8CB9] font-semibold"
                      )}
                    >
                      {course.name}
                    </span>
                    <span className="text-xs text-gray-500">{course.code}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
