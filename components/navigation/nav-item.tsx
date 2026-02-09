"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavItemConfig } from "@/lib/types/navigation";
import { useSidebar } from "./sidebar-provider";
import { useNotifications } from "@/lib/hooks/useNotifications";

interface NavItemProps {
  item: NavItemConfig;
}

export function NavItem({ item }: NavItemProps) {
  const pathname = usePathname();
  const { toggleSecondarySidebar, closeSecondarySidebar, isSecondaryOpen } = useSidebar();
  const notifications = useNotifications();

  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const isCourses = item.id === "courses";
  const Icon = item.icon;

  // Get notification count for this item
  const getNotificationCount = () => {
    switch (item.id) {
      case "messages":
        return notifications.messages;
      case "inbox":
        return notifications.inbox;
      case "grades":
        return notifications.grades;
      default:
        return 0;
    }
  };

  const notificationCount = getNotificationCount();
  const showBadge = notificationCount > 0;

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
        "hover:bg-white/10",
        showAsActive && "bg-white dark:bg-black"
      )}
      aria-label={item.label}
      aria-current={showAsActive ? "page" : undefined}
    >
      {/* Notification Badge */}
      {showBadge && (
        <div className="absolute top-2 right-2">
          <div
            className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold px-1 bg-red-500 text-white shadow-lg"
          >
            {notificationCount > 99 ? "99+" : notificationCount}
          </div>
        </div>
      )}

      {/* Icon */}
      <Icon
        className={cn(
          "w-6 h-6 text-white/80 transition-colors duration-200",
          "group-hover:text-white",
          showAsActive && "text-[#6E8CB9] dark:text-white"
        )}
        strokeWidth={showAsActive ? 2.5 : 2}
      />

      {/* Label below icon */}
      <span
        className={cn(
          "mt-1 text-[10px] font-medium text-white/80 transition-colors duration-200",
          "group-hover:text-white",
          showAsActive && "text-[#6E8CB9] dark:text-white"
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
  const notifications = useNotifications();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  // Get notification count for this item
  const getNotificationCount = () => {
    switch (item.id) {
      case "messages":
        return notifications.messages;
      case "inbox":
        return notifications.inbox;
      case "grades":
        return notifications.grades;
      default:
        return 0;
    }
  };

  const notificationCount = getNotificationCount();
  const showBadge = notificationCount > 0;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative",
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
          "text-sm font-medium text-gray-700 flex-1",
          isActive && "text-[#6E8CB9] font-semibold"
        )}
      >
        {item.label}
      </span>
      {showBadge && (
        <div className="flex items-center justify-center min-w-[20px] h-[20px] rounded-full text-[10px] font-bold px-1.5 bg-red-500 text-white">
          {notificationCount > 99 ? "99+" : notificationCount}
        </div>
      )}
    </Link>
  );
}
