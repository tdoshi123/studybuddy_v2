"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavItemConfig } from "@/lib/types/navigation";
import { useSidebar } from "./sidebar-provider";
interface NavItemProps {
  item: NavItemConfig;
}

export function NavItem({ item }: NavItemProps) {
  const pathname = usePathname();
  const { toggleSecondarySidebar, closeSecondarySidebar, isSecondaryOpen } = useSidebar();
  const dashboardPaths = ["/dashboard", "/student", "/parent", "/teacher", "/admin"];
  const isActive = item.id === "dashboard"
    ? dashboardPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isCourses = item.id === "courses";
  const Icon = item.icon;

  const handleClick = (e: React.MouseEvent) => {
    if (isCourses) {
      // For courses, toggle the secondary sidebar without navigating
      e.preventDefault();
      toggleSecondarySidebar();
    } else {
      // For other items, close the secondary sidebar
      closeSecondarySidebar();
    }
  };

  // For courses, show as active when secondary sidebar is open OR when on any /courses page
  const isOnCoursesPage = pathname === "/courses" || pathname.startsWith("/courses/");
  const showAsActive = isCourses ? (isSecondaryOpen || isOnCoursesPage) : isActive;

  return (
    <Link
      href={isCourses ? "#" : item.href}
      onClick={handleClick}
      className={cn(
        "group relative flex flex-col items-center justify-center py-3.5 transition-all duration-200",
        showAsActive
          ? "bg-white rounded-none"
          : "hover:bg-white/20"
      )}
      aria-label={item.label}
      aria-current={showAsActive ? "page" : undefined}
    >
      {/* Icon */}
      <Icon
        className={cn(
          "w-5 h-5 transition-colors duration-200",
          showAsActive
            ? "text-[#1e3a8a]"
            : "text-white/60 group-hover:text-white"
        )}
        strokeWidth={showAsActive ? 2.5 : 2}
      />

      {/* Label */}
      <span
        className={cn(
          "mt-1.5 text-[10px] font-semibold leading-none transition-colors duration-200",
          showAsActive
            ? "text-[#1e3a8a]"
            : "text-white/60 group-hover:text-white"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

interface NavItemExpandedProps {
  item: NavItemConfig;
}

export function NavItemExpanded({ item }: NavItemExpandedProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative",
        "hover:bg-gray-100",
        isActive && "bg-[#1e3a8a]/10"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 text-gray-600",
          isActive && "text-[#1e3a8a]"
        )}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span
        className={cn(
          "text-sm font-medium text-gray-700 flex-1",
          isActive && "text-[#1e3a8a] font-semibold"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}
