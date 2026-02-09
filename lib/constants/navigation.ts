import {
  Home,
  BookOpen,
  Calendar,
  BarChart3,
  Bus,
  Mail,
  MessageCircle,
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
    id: "calendar",
    label: "Calendar",
    icon: Calendar,
    href: "/calendar",
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
    id: "messages",
    label: "Messages",
    icon: MessageCircle,
    href: "/messages",
    position: "top",
  },
  {
    id: "bus",
    label: "Bus",
    icon: Bus,
    href: "/bus",
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
