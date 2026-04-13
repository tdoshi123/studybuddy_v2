"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  HelpCircle,
  MessageCircle,
  Megaphone,
  BarChart3,
  MessageSquare,
  Settings,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { CONVERSATIONS } from "@/data/teacher-mock-data";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "dashboard",     label: "Dashboard",     icon: LayoutDashboard, href: "/lis/teacher/dashboard" },
  { id: "courses",       label: "Courses",        icon: BookOpen,        href: "/lis/teacher/courses" },
  { id: "assignments",   label: "Assignments",    icon: ClipboardList,   href: "/lis/teacher/assignments" },
  { id: "quizzes",       label: "Quizzes",        icon: HelpCircle,      href: "/lis/teacher/quizzes" },
  { id: "discussions",   label: "Discussions",     icon: MessageCircle,   href: "/lis/teacher/discussions" },
  { id: "announcements", label: "Announcements",  icon: Megaphone,       href: "/lis/teacher/announcements" },
  { id: "gradebook",     label: "Grades",         icon: BarChart3,       href: "/lis/teacher/gradebook" },
  { id: "messages",      label: "Inbox",          icon: MessageSquare,   href: "/lis/teacher/inbox" },
  { id: "settings",      label: "Settings",       icon: Settings,        href: "/lis/teacher/settings" },
];

export function TeacherSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const unreadCount = CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#0f172a] flex flex-col z-30 select-none">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">StudyBuddy</p>
          <p className="text-white/40 text-[10px] uppercase tracking-widest">Teacher Portal</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto sidebar-scroll">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/lis/teacher/dashboard"
              ? pathname === item.href
              : pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90"
              )}
            >
              <Icon
                className={cn(
                  "w-[18px] h-[18px] flex-shrink-0",
                  isActive ? "text-blue-400" : "text-white/50 group-hover:text-white/70"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="flex-1">{item.label}</span>
              {item.id === "messages" && unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {unreadCount}
                </span>
              )}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.firstName?.[0] ?? "T"}{user?.lastName?.[0] ?? ""}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {user?.fullName ?? "Teacher"}
            </p>
            <p className="text-white/40 text-[10px] truncate">Mathematics</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-white/50 hover:text-white/80 hover:bg-white/5 transition-all text-sm"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
