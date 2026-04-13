import { LucideIcon } from "lucide-react";

export interface NavItemConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  position?: "top" | "bottom";
  // TODO: use user role from auth context
  requiredRoles?: string[];
}

export interface SidebarState {
  isSecondaryOpen: boolean;
  activeItemId: string | null;
}

export interface NotificationCounts {
  inbox: number;
  grades: number;
  calendar: number;
}

