"use client";

import { useUser } from "@clerk/nextjs";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Shield,
} from "lucide-react";

const RECENT_EVENTS = [
  { id: "1", icon: Users,        color: "text-blue-600 bg-blue-50",      text: "3 new student accounts registered",          time: "1 hr ago"   },
  { id: "2", icon: GraduationCap,color: "text-purple-600 bg-purple-50",  text: "Mid-term grades published for all classes",  time: "3 hrs ago"  },
  { id: "3", icon: AlertCircle,  color: "text-amber-600 bg-amber-50",    text: "2 teacher accounts pending approval",        time: "Yesterday"  },
  { id: "4", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50","text": "System backup completed successfully",      time: "Yesterday"  },
];

export default function AdminPage() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "Admin";

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-7 h-7 text-[#1e3a8a]" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {firstName}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "1,248", icon: Users,         color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40"          },
          { label: "Teachers",       value: "64",    icon: GraduationCap, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40"    },
          { label: "Active Courses", value: "312",   icon: BookOpen,      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
          { label: "School GPA",     value: "3.4",   icon: TrendingUp,    color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40"       },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 flex items-center gap-4"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color.split(" ").slice(1).join(" ")}`}>
              <Icon className={`w-5 h-5 ${color.split(" ")[0]}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Activity</h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm divide-y divide-gray-100 dark:divide-slate-800">
          {RECENT_EVENTS.map((item) => {
            const Icon = item.icon;
            const [iconColor, bgColor] = item.color.split(" ");
            return (
              <div key={item.id} className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${bgColor} dark:bg-opacity-20`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <p className="flex-1 text-sm text-gray-900 dark:text-white">{item.text}</p>
                <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />{item.time}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
