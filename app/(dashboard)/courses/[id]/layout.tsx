"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Home, FolderOpen, BarChart3, Users, Megaphone, FileText, MessageSquare, HelpCircle } from "lucide-react";
import { getCourse } from "@/lib/constants/courses";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function CourseLayout({ children }: LayoutProps) {
  const params = useParams();
  const id = params.id as string;
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-1 overflow-x-auto">
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
          href={`${basePath}/assignments`}
          icon={FileText}
          label="Assignments"
          isActive={pathname.startsWith(`${basePath}/assignments`)}
        />
        <NavButton
          href={`${basePath}/quizzes`}
          icon={HelpCircle}
          label="Quizzes"
          isActive={pathname.startsWith(`${basePath}/quizzes`)}
        />
        <NavButton
          href={`${basePath}/grades`}
          icon={BarChart3}
          label="Grades"
          isActive={pathname.startsWith(`${basePath}/grades`)}
        />
        <NavButton
          href={`${basePath}/announcements`}
          icon={Megaphone}
          label="Announcements"
          isActive={pathname.startsWith(`${basePath}/announcements`)}
        />
        <NavButton
          href={`${basePath}/messages`}
          icon={MessageSquare}
          label="Messages"
          isActive={pathname.startsWith(`${basePath}/messages`)}
        />
        <NavButton
          href={`${basePath}/classlist`}
          icon={Users}
          label="Classlist"
          isActive={pathname.startsWith(`${basePath}/classlist`)}
        />
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
        "relative flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap",
        isActive && "bg-[#6E8CB9] text-white hover:bg-[#6E8CB9]/90"
      )}
    >
      <Icon className={cn(
        "w-4 h-4 text-gray-600 dark:text-gray-400",
        isActive && "text-white"
      )} />
      <span className={cn(
        "text-sm text-gray-700 dark:text-gray-300",
        isActive && "text-white font-medium"
      )}>{label}</span>
    </Link>
  );
}

