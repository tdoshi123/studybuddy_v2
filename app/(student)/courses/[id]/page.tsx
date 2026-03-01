import Link from "next/link";
import { FileText, HelpCircle, Megaphone, ChevronRight, Clock, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const ANNOUNCEMENTS = [
  {
    id: "1",
    title: "Class Field Trip — Permission Slip Due Friday",
    date: "Jan 18, 2026",
    preview: "Please return the signed permission slip by Friday for our upcoming trip to the Science Museum.",
    isNew: true,
  },
  {
    id: "2",
    title: "Study Guide Posted for Chapter 7 Quiz",
    date: "Jan 15, 2026",
    preview: "The study guide for next week's quiz has been posted under Content. Review sections 7.1–7.4.",
    isNew: false,
  },
];

const UPCOMING_WORK = [
  {
    id: "1",
    title: "Fractions Worksheet",
    dueDate: "Today",
    dueTime: "3:00 PM",
    type: "assignment" as const,
    points: 20,
    status: "not-started" as const,
    urgent: true,
  },
  {
    id: "2",
    title: "Quiz: Unit 3 — Multiplication",
    dueDate: "Today",
    dueTime: "10:00 AM",
    type: "quiz" as const,
    points: 25,
    status: "not-started" as const,
    urgent: true,
  },
  {
    id: "3",
    title: "Chapter 6 Review Questions",
    dueDate: "Jan 28",
    dueTime: "3:00 PM",
    type: "assignment" as const,
    points: 15,
    status: "submitted" as const,
    urgent: false,
  },
  {
    id: "4",
    title: "Research Report: Number Systems",
    dueDate: "Feb 15",
    dueTime: "3:00 PM",
    type: "assignment" as const,
    points: 100,
    status: "in-progress" as const,
    urgent: false,
  },
];

const RECENT_GRADES = [
  { id: "1", title: "Quiz: Chapter 5",         score: 23,  max: 25,  grade: "A"  },
  { id: "2", title: "Worksheet: Decimals",      score: 18,  max: 20,  grade: "A"  },
  { id: "3", title: "Project: Number Patterns", score: 88,  max: 100, grade: "B+" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  "not-started": { label: "Not started", color: "text-gray-500 bg-gray-100 dark:bg-slate-800 dark:text-gray-400" },
  "in-progress":  { label: "In progress", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400" },
  "submitted":    { label: "Submitted",   color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400" },
};

const TYPE_CONFIG = {
  assignment: { label: "Assignment", color: "text-blue-600 bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400" },
  quiz:       { label: "Quiz",       color: "text-purple-600 bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseHomePage() {
  const notStartedCount = UPCOMING_WORK.filter((w) => w.status === "not-started").length;
  const urgentCount     = UPCOMING_WORK.filter((w) => w.urgent).length;

  return (
    <div className="space-y-6">

      {/* ── Quick stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Current Grade", value: "95%",                          sub: "A",             color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
          { label: "Assignments",   value: String(UPCOMING_WORK.length),   sub: `${notStartedCount} pending`, color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-950/30"    },
          { label: "Due Soon",      value: String(urgentCount),             sub: "this week",     color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-950/30"  },
          { label: "Announcements", value: String(ANNOUNCEMENTS.length),   sub: "1 new",         color: "text-purple-600",  bg: "bg-purple-50 dark:bg-purple-950/30"},
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} className={`rounded-xl p-4 ${bg} border border-gray-100 dark:border-slate-800`}>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Urgent alert ── */}
      {urgentCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300 font-medium flex-1">
            <span className="font-bold">{urgentCount} item{urgentCount > 1 ? "s" : ""}</span> due today
          </p>
          <Link href="assignments" className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline">
            View →
          </Link>
        </div>
      )}

      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Upcoming Work */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1e3a8a]" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Upcoming Work</h2>
            </div>
            <Link href="assignments" className="text-xs font-medium text-[#1e3a8a] dark:text-blue-400 hover:underline flex items-center gap-0.5">
              All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <ul className="divide-y divide-gray-100 dark:divide-slate-800">
            {UPCOMING_WORK.map((item) => (
              <li key={item.id}>
                <Link
                  href={`assignments/${item.id}`}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Type icon */}
                  <div className={`flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center ${TYPE_CONFIG[item.type].color}`}>
                    {item.type === "quiz"
                      ? <HelpCircle className="w-3.5 h-3.5" />
                      : <FileText className="w-3.5 h-3.5" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug line-clamp-1 group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 transition-colors ${
                      item.status === "submitted" ? "text-gray-400 dark:text-slate-500 line-through" : "text-gray-900 dark:text-white"
                    }`}>
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`flex items-center gap-1 text-xs ${item.urgent ? "text-red-600 dark:text-red-400 font-semibold" : "text-gray-400 dark:text-slate-500"}`}>
                        <Clock className="w-3 h-3" />
                        {item.dueDate}
                      </span>
                      <span className="text-gray-300 dark:text-slate-600">·</span>
                      <span className="text-xs text-gray-400 dark:text-slate-500">{item.points} pts</span>
                    </div>
                  </div>

                  <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[item.status].color}`}>
                    {STATUS_CONFIG[item.status].label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Announcements */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#1e3a8a]" />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Announcements</h2>
              </div>
              <Link href="announcements" className="text-xs font-medium text-[#1e3a8a] dark:text-blue-400 hover:underline flex items-center gap-0.5">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <ul className="divide-y divide-gray-100 dark:divide-slate-800">
              {ANNOUNCEMENTS.map((a) => (
                <li key={a.id}>
                  <Link
                    href="announcements"
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {a.title}
                        </p>
                        {a.isNew && (
                          <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#1e3a8a] text-white">
                            NEW
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {a.preview}
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-[10px] text-gray-400 dark:text-slate-500 whitespace-nowrap mt-0.5">{a.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Grades */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Grades</h2>
              </div>
              <Link href="grades" className="text-xs font-medium text-[#1e3a8a] dark:text-blue-400 hover:underline flex items-center gap-0.5">
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <ul className="divide-y divide-gray-100 dark:divide-slate-800">
              {RECENT_GRADES.map((g) => (
                <li key={g.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                  <BookOpen className="w-4 h-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
                  <p className="flex-1 text-sm text-gray-800 dark:text-gray-200 line-clamp-1">{g.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400 dark:text-slate-500">{g.score}/{g.max}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                      {g.grade}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
