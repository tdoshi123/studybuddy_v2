import {
  Home,
  BookOpen,
  Calendar,
  BarChart3,
  CalendarCheck,
  Mail,
  User,
} from "lucide-react";
import { NavItemConfig } from "@/lib/types/navigation";

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/student/dashboard",
    position: "top",
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
    href: "/student/courses",
    position: "top",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    href: "/student/calendar",
    position: "top",
  },
  {
    id: "grades",
    label: "Grades",
    icon: BarChart3,
    href: "/student/grades",
    position: "top",
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: CalendarCheck,
    href: "/student/attendance",
    position: "top",
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: Mail,
    href: "/student/inbox",
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

export const SIDEBAR_CONFIG = {
  primaryWidth: 72,
  secondaryWidth: 280,
  primaryBg: "#1e3a8a",
  secondaryBg: "#1e293b",
} as const;
