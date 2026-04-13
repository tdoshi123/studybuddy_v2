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
    id: "account",
    label: "Account",
    icon: User,
    href: "/account",
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

export const SIDEBAR_CONFIG = {
  primaryWidth: 84,
  secondaryWidth: 280,
  primaryBg: "#1e3a8a",
  secondaryBg: "#1e293b",
} as const;
