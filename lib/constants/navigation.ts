import {
  Home,
  BookOpen,
  Calendar,
  BarChart3,
  CalendarCheck,
  Mail,
  User,
  ClipboardList,
  Settings,
  HelpCircle,
  MessageCircle,
  Megaphone,
  FileText,
  ClipboardCheck,
  Bus,
  School,
  MessageSquare,
} from "lucide-react";
import { NavItemConfig } from "@/lib/types/navigation";

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/lis/student/dashboard",
    position: "top",
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
    href: "/lis/student/courses",
    position: "top",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    href: "/lis/student/calendar",
    position: "top",
  },
  {
    id: "grades",
    label: "Grades",
    icon: BarChart3,
    href: "/lis/student/grades",
    position: "top",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: CalendarCheck,
    href: "/lis/student/attendance",
    position: "top",
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: Mail,
    href: "/lis/student/inbox",
    position: "top",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/lis/student/settings",
    position: "bottom",
  },
];

export const TEACHER_NAV_ITEMS: NavItemConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/lis/teacher/dashboard",
    position: "top",
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
    href: "/lis/teacher/courses",
    position: "top",
  },
  {
    id: "assignments",
    label: "Assignments",
    icon: ClipboardList,
    href: "/lis/teacher/assignments",
    position: "top",
  },
  {
    id: "quizzes",
    label: "Quizzes",
    icon: HelpCircle,
    href: "/lis/teacher/quizzes",
    position: "top",
  },
  {
    id: "discuss",
    label: "Discuss",
    icon: MessageCircle,
    href: "/lis/teacher/discussions",
    position: "top",
  },
  {
    id: "announce",
    label: "Announcements",
    icon: Megaphone,
    href: "/lis/teacher/announcements",
    position: "top",
  },
  {
    id: "gradebook",
    label: "Grades",
    icon: BarChart3,
    href: "/lis/teacher/gradebook",
    position: "top",
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: Mail,
    href: "/lis/teacher/inbox",
    position: "top",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/lis/teacher/settings",
    position: "bottom",
  },
];

export const PARENT_NAV_ITEMS: NavItemConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/sis/parent/dashboard",
    position: "top",
  },
  {
    id: "grades-attendance",
    label: "Grades & Attendance",
    icon: BarChart3,
    href: "/sis/parent/grades-attendance",
    position: "top",
  },
  {
    id: "test-results",
    label: "Test Results",
    icon: ClipboardCheck,
    href: "/sis/parent/test-results",
    position: "top",
  },
  {
    id: "grade-history",
    label: "Grade History",
    icon: BarChart3,
    href: "/sis/parent/grade-history",
    position: "top",
  },
  {
    id: "teacher-comments",
    label: "Teacher Comments",
    icon: MessageSquare,
    href: "/sis/parent/teacher-comments",
    position: "top",
  },
  {
    id: "student-forms",
    label: "Student Forms",
    icon: ClipboardList,
    href: "/sis/parent/student-forms",
    position: "top",
  },
  {
    id: "student-schedule",
    label: "Schedule",
    icon: Calendar,
    href: "/sis/parent/student-schedule",
    position: "top",
  },
  {
    id: "class-registration",
    label: "Registration",
    icon: ClipboardList,
    href: "/sis/parent/class-registration",
    position: "top",
  },
  {
    id: "school-information",
    label: "School Information",
    icon: School,
    href: "/sis/parent/school-information",
    position: "top",
  },
  {
    id: "transportation-info",
    label: "Transportation",
    icon: Bus,
    href: "/sis/parent/transportation-info",
    position: "top",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/sis/parent/settings",
    position: "bottom",
  },
];

/** Same structure as parent SIS nav; routes live under `/sis/student`. */
export const SIS_STUDENT_NAV_ITEMS: NavItemConfig[] = PARENT_NAV_ITEMS.map((item) => ({
  ...item,
  href: item.href.replace("/sis/parent", "/sis/student"),
}));

export const SIDEBAR_CONFIG = {
  studentWidth: 72,
  teacherWidth: 84,
  parentWidth: 190,
  secondaryWidth: 280,
  primaryBg: "#1e3a8a",
  secondaryBg: "#1e293b",
} as const;

/** SIS routes that share the same primary nav and width as `/sis/parent` (excludes `/sis/admin`). */
export function usesSisParentSidebar(pathname: string | null): boolean {
  if (!pathname?.startsWith("/sis/")) return false;
  if (pathname.startsWith("/sis/admin")) return false;
  return true;
}

export function getSidebarWidth(pathname: string | null): number {
  if (usesSisParentSidebar(pathname)) return SIDEBAR_CONFIG.parentWidth;
  if (pathname?.startsWith("/lis/teacher")) return SIDEBAR_CONFIG.teacherWidth;
  return SIDEBAR_CONFIG.studentWidth;
}
