"use client";

import { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FolderOpen, BarChart3, Users, Settings, Megaphone, FileText, ClipboardCheck, MessageCircle, UsersRound, HelpCircle, ClipboardList } from "lucide-react";
import { getCourse } from "@/lib/constants/courses";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default function CourseLayout({ children, params }: LayoutProps) {
  const { id } = use(params);
  const course = getCourse(id);
  const pathname = usePathname();

  const basePath = `/courses/${id}`;

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div
        className="rounded-xl p-6 text-white"
        style={{ backgroundColor: course.color }}
      >
        <h1 className="text-2xl font-semibold">{course.name}</h1>
        <p className="mt-1 text-white/80">{course.teacher}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <NavButton
          href={basePath}
          icon={Home}
          label="Home"
          isActive={pathname === basePath}
        />
        <NavButton
          href={`${basePath}/content`}
          icon={FolderOpen}
          label="Content"
          isActive={pathname.startsWith(`${basePath}/content`)}
        />
        <NavButton
          href={`${basePath}/grades`}
          icon={BarChart3}
          label="Grades"
          isActive={pathname.startsWith(`${basePath}/grades`)}
        />
        <NavButton
          href={`${basePath}/classlist`}
          icon={Users}
          label="Classlist"
          isActive={pathname.startsWith(`${basePath}/classlist`)}
        />
        <CourseToolsDropdown courseId={id} />
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}

function NavButton({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
        isActive && "ring-2 ring-[#6E8CB9] bg-[#6E8CB9]/5"
      )}
    >
      <Icon className={cn(
        "w-6 h-6 text-gray-600 dark:text-gray-400",
        isActive && "text-[#6E8CB9]"
      )} />
      <span className={cn(
        "text-sm text-gray-700 dark:text-gray-300",
        isActive && "text-[#6E8CB9] font-medium"
      )}>{label}</span>
    </Link>
  );
}

const COURSE_TOOLS = [
  { icon: Megaphone, label: "Announcements", path: "announcements" },
  { icon: FileText, label: "Assignments", path: "assignments" },
  { icon: ClipboardCheck, label: "Attendance", path: "attendance" },
  { icon: MessageCircle, label: "Discussions", path: "discussions" },
  { icon: UsersRound, label: "Groups", path: "groups" },
  { icon: HelpCircle, label: "Quizzes", path: "quizzes" },
  { icon: ClipboardList, label: "Surveys", path: "surveys" },
];

function CourseToolsDropdown({ courseId }: { courseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isToolActive = COURSE_TOOLS.some(
    (tool) => pathname.includes(`/courses/${courseId}/${tool.path}`)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative flex flex-col items-center gap-2 p-4 w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
          isOpen && "bg-gray-50 dark:bg-gray-800",
          isToolActive && "ring-2 ring-[#6E8CB9] bg-[#6E8CB9]/5"
        )}
      >
        <Settings className={cn(
          "w-6 h-6 text-gray-600 dark:text-gray-400",
          isToolActive && "text-[#6E8CB9]"
        )} />
        <span className={cn(
          "text-sm text-gray-700 dark:text-gray-300",
          isToolActive && "text-[#6E8CB9] font-medium"
        )}>Course Tools</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-lg z-50 overflow-hidden">
          {COURSE_TOOLS.map((tool) => {
            const isActive = pathname.includes(`/courses/${courseId}/${tool.path}`);
            return (
              <Link
                key={tool.label}
                href={`/courses/${courseId}/${tool.path}`}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                  isActive && "bg-[#6E8CB9]/10"
                )}
                onClick={() => setIsOpen(false)}
              >
                <tool.icon className={cn(
                  "w-5 h-5 text-gray-500 dark:text-gray-400",
                  isActive && "text-[#6E8CB9]"
                )} />
                <span className={cn(
                  "text-sm text-gray-700 dark:text-gray-300",
                  isActive && "text-[#6E8CB9] font-medium"
                )}>{tool.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

