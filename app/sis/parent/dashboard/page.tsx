"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  GraduationCap,
  FileText,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Bell,
  Users,
  BookOpen,
} from "lucide-react";

function pctToGPA(pct: number): number {
  if (pct >= 93) return 4.0;
  if (pct >= 90) return 3.7;
  if (pct >= 87) return 3.3;
  if (pct >= 83) return 3.0;
  if (pct >= 80) return 2.7;
  if (pct >= 77) return 2.3;
  if (pct >= 73) return 2.0;
  if (pct >= 70) return 1.7;
  if (pct >= 67) return 1.3;
  if (pct >= 65) return 1.0;
  return 0.0;
}

function computeGPA(q3Grades: (number | null)[]): string {
  const graded = q3Grades.filter((g): g is number => g !== null);
  if (graded.length === 0) return "—";
  return (graded.reduce((s, g) => s + pctToGPA(g), 0) / graded.length).toFixed(2);
}

const ALEX_Q3 = [null, 94, 80, 84, 85, null, null, null, null];
const EMMA_Q3 = [null, 98, 96, 95, 93];

const CHILDREN = [
  {
    id: "1",
    name: "Alex Johnson",
    grade: "5th Grade",
    initials: "AJ",
    color: "#1e3a8a",
    gpa: computeGPA(ALEX_Q3),
    attendance: "98%",
    classes: 9,
    lastActive: "Today",
  },
  {
    id: "2",
    name: "Emma Johnson",
    grade: "3rd Grade",
    initials: "EJ",
    color: "#166534",
    gpa: computeGPA(EMMA_Q3),
    attendance: "100%",
    classes: 5,
    lastActive: "Yesterday",
  },
];

const ACTIVITY = [
  { id: "1", child: "Alex", icon: GraduationCap, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40", text: "New grade posted in Math – 95/100", time: "2 hrs ago" },
  { id: "2", child: "Emma", icon: FileText, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40", text: "Science Project due Feb 15", time: "5 hrs ago" },
  { id: "3", child: "Alex", icon: Mail, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40", text: "New message from Mrs. Johnson", time: "Yesterday" },
  { id: "4", child: "Emma", icon: Bell, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40", text: "Announcement in English Language Arts", time: "Yesterday" },
  { id: "5", child: "Alex", icon: CheckCircle2, color: "text-teal-600 bg-teal-50 dark:bg-teal-950/40", text: "Assignment submitted: Fractions Worksheet", time: "2 days ago" },
];

export default function SisParentDashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "Parent";

  return (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-950/40">
              <Users className="w-6 h-6 text-[#166534] dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Parent portal
              </h1>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {firstName} — school overview for your family
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">My children</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CHILDREN.map((child) => (
                <div
                  key={child.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="h-2 w-full" style={{ backgroundColor: child.color }} />
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ backgroundColor: child.color }}
                      >
                        {child.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{child.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{child.grade}</p>
                      </div>
                      <span className="ml-auto text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {child.lastActive}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "GPA", value: child.gpa, icon: TrendingUp, color: "text-emerald-600" },
                        { label: "Attendance", value: child.attendance, icon: CheckCircle2, color: "text-blue-600" },
                        { label: "Classes", value: String(child.classes), icon: BookOpen, color: "text-amber-600" },
                      ].map(({ label, value, icon: Icon, color }) => (
                        <div
                          key={label}
                          className="flex flex-col items-center justify-center py-3 rounded-lg bg-gray-50 dark:bg-slate-800/50 gap-1"
                        >
                          <Icon className={`w-4 h-4 ${color}`} />
                          <span className="text-base font-bold text-gray-900 dark:text-white">{value}</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">{label}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/sis/parent/grades-attendance?student=${child.id}`}
                      className="mt-4 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:border-[#1e3a8a] dark:hover:border-blue-500 transition-colors"
                    >
                      View {child.name.split(" ")[0]}&apos;s Grades
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-4">Recent activity</h2>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm divide-y divide-gray-100 dark:divide-slate-800">
              {ACTIVITY.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.id} className="flex items-start gap-4 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${a.color.split(" ").slice(1).join(" ")}`}>
                      <Icon className={`w-4 h-4 ${a.color.split(" ")[0]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{a.child}</p>
                      <p className="text-sm text-gray-900 dark:text-white mt-0.5 line-clamp-2">{a.text}</p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-slate-500 flex-shrink-0 mt-0.5">{a.time}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
  );
}
