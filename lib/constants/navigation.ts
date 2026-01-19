import {
  Home,
  BookOpen,
  Mail,
  BarChart3,
  Calendar,
  User,
} from "lucide-react";
import { NavItemConfig } from "@/lib/types/navigation";

export const NAV_ITEMS: NavItemConfig[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    position: "top",
  },
  {
    id: "courses",
    label: "Courses",
    icon: BookOpen,
    href: "/courses",
    position: "top",
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: Mail,
    href: "/inbox",
    position: "top",
  },
  {
    id: "grades",
    label: "Grades",
    icon: BarChart3,
    href: "/grades",
    position: "top",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    href: "/calendar",
    position: "top",
    // TODO: Optional feature - can be enabled later
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
  primaryBg: "#6E8CB9",
  secondaryBg: "#5F7AA3",
} as const;

