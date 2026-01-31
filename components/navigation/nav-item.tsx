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

  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isCourses = item.id === "courses";
  const Icon = item.icon;

  // TODO: use user role from auth context
  // const { user } = useAuth();
  // if (item.requiredRoles && !item.requiredRoles.includes(user?.role)) {
  //   return null;
  // }

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
        "group relative flex flex-col items-center justify-center w-full py-3 transition-all duration-200",
        "hover:bg-white/10 dark:hover:bg-white/5",
        showAsActive && "bg-white/95 dark:bg-gray-900/80"
      )}
      aria-label={item.label}
      aria-current={showAsActive ? "page" : undefined}
    >
      {/* Active indicator bar */}
      {showAsActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#6E8CB9] dark:bg-[#7F9CCF] rounded-r-full" />
      )}

      {/* Icon */}
      <Icon
        className={cn(
          "w-6 h-6 transition-colors duration-200",
          showAsActive 
            ? "text-[#6E8CB9] dark:text-[#7F9CCF]" 
            : "text-white/80 dark:text-white/70 group-hover:text-white"
        )}
        strokeWidth={showAsActive ? 2.5 : 2}
      />

      {/* Label below icon */}
      <span
        className={cn(
          "mt-1 text-[10px] font-medium transition-colors duration-200",
          showAsActive 
            ? "text-[#6E8CB9] dark:text-[#7F9CCF] font-semibold" 
            : "text-white/80 dark:text-white/70 group-hover:text-white"
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
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        "hover:bg-gray-100",
        isActive && "bg-[#6E8CB9]/10"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 text-gray-600",
          isActive && "text-[#6E8CB9]"
        )}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span
        className={cn(
          "text-sm font-medium text-gray-700",
          isActive && "text-[#6E8CB9] font-semibold"
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}
