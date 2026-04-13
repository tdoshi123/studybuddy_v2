"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  Home,
  FolderOpen,
  BarChart3,
  FileText,
  HelpCircle,
  Megaphone,
  Users,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { getCourse } from "@/lib/constants/courses";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

// ─── Nav config ──────────────────────────────────────────────────────────────

const PRIMARY_NAV = [
  { label: "Home",          icon: Home,          segment: ""              },
  { label: "Content",       icon: FolderOpen,    segment: "content"       },
  { label: "Assignments",   icon: FileText,      segment: "assignments"   },
  { label: "Quizzes",       icon: HelpCircle,    segment: "quizzes"       },
  { label: "Grades",        icon: BarChart3,     segment: "grades"        },
  { label: "Announcements", icon: Megaphone,     segment: "announcements" },
  { label: "Classlist",     icon: Users,         segment: "classlist"     },
];

export default function CourseLayout({ children }: LayoutProps) {
  const params   = useParams();
  const id       = params.id as string;
  const course   = getCourse(id);
  const pathname = usePathname();
  const basePath = `/lis/student/courses/${id}`;

  const isActiveSegment = (segment: string) =>
    segment === ""
      ? pathname === basePath
      : pathname.startsWith(`${basePath}/${segment}`);

  // Build breadcrumb label
  const activeNav = PRIMARY_NAV.find((n) => isActiveSegment(n.segment));
  const pageLabel = activeNav?.label ?? "";

  return (
    <div className="space-y-0">

      {/* ── Course banner ──────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ backgroundColor: course.color }}
      >
        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative px-5 py-5 sm:px-7 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Course name */}
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {course.name}
            </h1>
            <p className="mt-1 text-sm text-white/80 font-medium">{course.teacher}</p>

            {/* Meta row */}
            <div className="flex items-center gap-4 mt-2.5 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-white/70">
                <MapPin className="w-3.5 h-3.5" />
                {course.room}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/70">
                <Clock className="w-3.5 h-3.5" />
                {course.period}
              </span>
            </div>
          </div>

          {/* Grade pill */}
          <div className="flex-shrink-0 flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 self-start sm:self-auto">
            <div className="text-right">
              <p className="text-2xl font-black text-white leading-none">A</p>
              <p className="text-[10px] text-white/70 mt-0.5">95%</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-left">
              <p className="text-xs font-semibold text-white">Current</p>
              <p className="text-[10px] text-white/70">Grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation bar ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 xl:-mx-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 flex items-center">

        {/* All tabs — scrollable row */}
        <div className="flex items-center gap-0.5 overflow-x-auto hide-scrollbar flex-1 min-w-0">
          {PRIMARY_NAV.map(({ label, icon: Icon, segment }) => {
            const active = isActiveSegment(segment);
            return (
              <Link
                key={segment}
                href={segment === "" ? basePath : `${basePath}/${segment}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px",
                  active
                    ? "border-[#1e3a8a] text-[#1e3a8a] dark:text-blue-400 dark:border-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-slate-600"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>

      </div>

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      {pageLabel && (
        <div className="flex items-center gap-1.5 pt-5 pb-1 text-xs text-gray-400 dark:text-slate-500">
          <Link href="/lis/student/courses" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Courses
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={basePath} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            {course.name}
          </Link>
          {pageLabel !== "Home" && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-600 dark:text-gray-300 font-medium">{pageLabel}</span>
            </>
          )}
        </div>
      )}

      {/* ── Page content ───────────────────────────────────────────────────── */}
      <div className="pt-3">
        {children}
      </div>
    </div>
  );
}
