"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Users,
  BookOpen,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Bell,
} from "lucide-react";

const CLASSES = [
  { id: "1", name: "Math – Period 3",      students: 28, pending: 12, avgGrade: "B+", color: "#1e3a8a" },
  { id: "2", name: "Math – Period 5",      students: 25, pending: 8,  avgGrade: "A–", color: "#1e3a8a" },
  { id: "3", name: "Algebra I – Period 1", students: 30, pending: 15, avgGrade: "B",  color: "#7c3aed" },
];

const RECENT = [
  { id: "1", icon: ClipboardList, color: "text-blue-600 bg-blue-50",     text: "12 new assignment submissions in Math P3",   time: "1 hr ago"   },
  { id: "2", icon: MessageSquare, color: "text-purple-600 bg-purple-50", text: "New message from parent of Alex Johnson",    time: "3 hrs ago"  },
  { id: "3", icon: Bell,          color: "text-amber-600 bg-amber-50",   text: "Reminder: progress reports due Friday",      time: "Yesterday"  },
  { id: "4", icon: CheckCircle2,  color: "text-emerald-600 bg-emerald-50", text: "8 quizzes graded in Algebra I",            time: "Yesterday"  },
];

export default function TeacherPage() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "Teacher";

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Teacher Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {firstName}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: "83",  icon: Users,         color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40"       },
          { label: "Classes",        value: "3",   icon: BookOpen,      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40" },
          { label: "To Grade",       value: "35",  icon: ClipboardList, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40"    },
          { label: "Avg Grade",      value: "B+",  icon: TrendingUp,    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
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

      {/* Classes */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">My Classes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {CLASSES.map((cls) => (
            <div
              key={cls.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-2 w-full" style={{ backgroundColor: cls.color }} />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">{cls.name}</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Students", value: cls.students, icon: Users,         color: "text-blue-600"    },
                    { label: "To Grade",  value: cls.pending,  icon: ClipboardList, color: "text-amber-600"   },
                    { label: "Avg",       value: cls.avgGrade, icon: TrendingUp,    color: "text-emerald-600" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="flex flex-col items-center justify-center py-2.5 rounded-lg bg-gray-50 dark:bg-slate-800/50 gap-1">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{label}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/courses/${cls.id}`}
                  className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:border-[#1e3a8a] transition-colors"
                >
                  Open class <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent Activity</h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm divide-y divide-gray-100 dark:divide-slate-800">
          {RECENT.map((item) => {
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
