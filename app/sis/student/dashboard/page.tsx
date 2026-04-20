"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  TrendingUp,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Mail,
  Bell,
} from "lucide-react";

const STATS = [
  { label: "GPA", value: "3.42", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
  { label: "Attendance", value: "98%", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40" },
  { label: "Classes", value: "9", icon: BookOpen, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40" },
  { label: "Grade", value: "5th", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/40" },
];

const TODAY_SCHEDULE = [
  { time: "8:00 AM", class: "Math", room: "Room 204", teacher: "Mr. Rivera" },
  { time: "9:00 AM", class: "English Language Arts", room: "Room 112", teacher: "Mrs. Johnson" },
  { time: "10:00 AM", class: "Science", room: "Lab 3", teacher: "Ms. Chen" },
  { time: "11:15 AM", class: "Social Studies", room: "Room 208", teacher: "Mr. Patel" },
  { time: "12:00 PM", class: "Lunch", room: "Cafeteria", teacher: "" },
  { time: "1:00 PM", class: "Art", room: "Art Studio", teacher: "Ms. Lopez" },
];

const ACTIVITY = [
  { id: "1", icon: GraduationCap, bg: "bg-emerald-50 dark:bg-emerald-950/40", color: "text-emerald-600", text: "New grade posted in Math – 95/100", time: "2 hrs ago" },
  { id: "2", icon: Mail, bg: "bg-purple-50 dark:bg-purple-950/40", color: "text-purple-600", text: "New message from Mrs. Johnson", time: "Yesterday" },
  { id: "3", icon: Bell, bg: "bg-amber-50 dark:bg-amber-950/40", color: "text-amber-600", text: "Announcement in English Language Arts", time: "Yesterday" },
  { id: "4", icon: CheckCircle2, bg: "bg-teal-50 dark:bg-teal-950/40", color: "text-teal-600", text: "Assignment submitted: Fractions Worksheet", time: "2 days ago" },
];

export default function SisStudentDashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "Alex";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Here&apos;s what&apos;s happening today
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATS.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two-column layout: Today's schedule + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's schedule */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300">Today&apos;s schedule</h2>
            <Link
              href="/sis/student/student-schedule"
              className="text-xs font-medium text-[#1e3a8a] dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              Full schedule <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm divide-y divide-gray-100 dark:divide-slate-800">
            {TODAY_SCHEDULE.map((slot, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <span className="text-xs font-mono text-gray-400 dark:text-slate-500 w-16 flex-shrink-0">
                  {slot.time}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{slot.class}</p>
                  {slot.teacher && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {slot.teacher} · {slot.room}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent activity</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm divide-y divide-gray-100 dark:divide-slate-800">
            {ACTIVITY.map((a) => {
              const Icon = a.icon;
              return (
                <div key={a.id} className="flex items-start gap-4 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${a.bg}`}>
                    <Icon className={`w-4 h-4 ${a.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{a.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0 mt-0.5">{a.time}</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

    </div>
  );
}
