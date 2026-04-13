"use client";

import { useParams, usePathname } from "next/navigation";
import {
  getClassById, getStudentsByClass, getAssignmentsByClass,
  getQuizzesByClass, getAnnouncementsByClass, getDiscussionsByClass,
  SUBMISSIONS,
} from "@/data/teacher-mock-data";
import Link from "next/link";
import {
  ClipboardList, HelpCircle, Megaphone, MessageCircle, Users,
  Plus, ChevronRight, Clock, AlertCircle, CheckCircle2,
  TrendingUp, BookOpen, BarChart2,
} from "lucide-react";

/* ─── Helpers ────────────────────────────────────────────────── */
function fmt(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function fmtFull(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}
function isOverdue(iso: string) { return new Date(iso + "T23:59:00") < new Date(); }

function gradeColor(g: number) {
  if (g >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (g >= 80) return "text-blue-600 dark:text-blue-400";
  if (g >= 70) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}
function gradeBar(g: number) {
  if (g >= 90) return "bg-emerald-500";
  if (g >= 80) return "bg-blue-500";
  if (g >= 70) return "bg-amber-500";
  return "bg-red-500";
}
function letterGrade(p: number) {
  if (p >= 93) return "A"; if (p >= 90) return "A−"; if (p >= 87) return "B+";
  if (p >= 83) return "B"; if (p >= 80) return "B−"; if (p >= 70) return "C";
  if (p >= 60) return "D"; return "F";
}

const TYPE_DOT: Record<string, string> = {
  Assignment: "bg-sky-500",
  Quiz:       "bg-violet-500",
  Project:    "bg-emerald-500",
  Exam:       "bg-rose-500",
};
const TYPE_BADGE: Record<string, string> = {
  Assignment: "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400",
  Quiz:       "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  Project:    "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Exam:       "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
};

/* ─── Card header ─────────────────────────────────────────────── */
function CardHeader({ icon: Icon, title, href, linkLabel = "View all" }: {
  icon: React.ElementType; title: string; href: string; linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
      <div className="flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-[#1e3a8a] dark:text-blue-400" />
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <Link href={href} className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
        {linkLabel} <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

/* ─── Empty ───────────────────────────────────────────────────── */
function Empty({ message, cta, href }: { message: string; cta: string; href: string }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm text-gray-400 dark:text-slate-500">{message}</p>
      <Link href={href} className="inline-block mt-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
        {cta} →
      </Link>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function TeacherCourseHomePage() {
  const params   = useParams();
  const pathname = usePathname();
  const id       = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";
  const course = getClassById(id);
  const base   = `/lis/teacher/courses/${id}`;

  if (!course) return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <p className="text-gray-600">Course not found.</p>
      <Link href="/lis/teacher/courses" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">Back to My Courses</Link>
    </div>
  );

  const students      = getStudentsByClass(id);
  const assignments   = getAssignmentsByClass(id);
  const quizzes       = getQuizzesByClass(id);
  const announcements = getAnnouncementsByClass(id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const discussions   = getDiscussionsByClass(id);

  const published   = assignments.filter(a => a.status === "published").length;
  const drafts      = assignments.filter(a => a.status === "draft").length;
  const avgGrade    = students.length ? Math.round(students.reduce((s, st) => s + st.currentGrade, 0) / students.length) : 0;
  const passing     = students.filter(s => s.currentGrade >= 70).length;
  const atRisk      = students.filter(s => s.currentGrade < 70).length;

  /* Upcoming: published assignments sorted by due date */
  const upcoming = [...assignments]
    .filter(a => a.status === "published")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  /* Draft assignments */
  const draftList = assignments.filter(a => a.status === "draft").slice(0, 3);

  /* Pending submissions */
  const assignmentIds = new Set(assignments.map(a => a.id));
  const pendingGrades = SUBMISSIONS.filter(s =>
    assignmentIds.has(s.assignmentId) && s.status === "Submitted" && s.grade === null
  ).length;

  /* Grade distribution */
  const gradeRanges = [
    { label: "A (90–100)", count: students.filter(s => s.currentGrade >= 90).length, color: "bg-emerald-500" },
    { label: "B (80–89)",  count: students.filter(s => s.currentGrade >= 80 && s.currentGrade < 90).length, color: "bg-blue-500" },
    { label: "C (70–79)",  count: students.filter(s => s.currentGrade >= 70 && s.currentGrade < 80).length, color: "bg-amber-500" },
    { label: "D / F",      count: students.filter(s => s.currentGrade < 70).length, color: "bg-red-500" },
  ];

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{today}</p>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{course.name}</h1>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            {course.section} &middot; {course.gradeLevel} &middot; Room {course.room}
          </p>
        </div>
        <Link
          href={`${base}/assignments`}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Create Content
        </Link>
      </div>

      {/* ── Stat summary bar ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {[
          { label: "Students",      value: students.length,     sub: course.gradeLevel,                            href: `${base}/students`,      icon: Users,         bg: "bg-blue-50 dark:bg-blue-950/40",     fg: "text-blue-600 dark:text-blue-400" },
          { label: "Assignments",   value: assignments.length,  sub: `${published} live · ${drafts} draft`,        href: `${base}/assignments`,   icon: ClipboardList, bg: "bg-violet-50 dark:bg-violet-950/40", fg: "text-violet-600 dark:text-violet-400" },
          { label: "Quizzes",       value: quizzes.length,      sub: `${quizzes.filter(q=>q.status==="published").length} published`, href: `${base}/quizzes`, icon: HelpCircle, bg: "bg-emerald-50 dark:bg-emerald-950/40", fg: "text-emerald-600 dark:text-emerald-400" },
          { label: "Discussions",   value: discussions.length,  sub: `${discussions.reduce((s,d)=>s+d.replies.length,0)} replies`,   href: `${base}/discussions`, icon: MessageCircle, bg: "bg-amber-50 dark:bg-amber-950/40", fg: "text-amber-600 dark:text-amber-400" },
          { label: "Announcements", value: announcements.length,sub: "total posted",                               href: `${base}/announcements`, icon: Megaphone,     bg: "bg-rose-50 dark:bg-rose-950/40",     fg: "text-rose-600 dark:text-rose-400" },
        ].map(s => (
          <Link
            key={s.label}
            href={s.href}
            className="group bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-3 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all flex items-center gap-3"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.bg}`}>
              <s.icon className={`w-3.5 h-3.5 ${s.fg}`} />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold tabular-nums text-gray-900 dark:text-white leading-none">{s.value}</span>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 truncate">{s.label}</span>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 truncate">{s.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main content grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Left column (col-span-2) ─────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Course description */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <BookOpen className="w-4 h-4 text-[#1e3a8a] dark:text-blue-400" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">About This Course</h2>
            </div>
            <p className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{course.description}</p>
          </div>

          {/* Upcoming assignments timeline */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <CardHeader icon={ClipboardList} title="Upcoming Assignments" href={`${base}/assignments`} />
            {upcoming.length === 0 ? (
              <Empty message="No published assignments yet." cta="Create an assignment" href={`${base}/assignments`} />
            ) : (
              <ul className="divide-y divide-gray-50 dark:divide-slate-800/60">
                {upcoming.map((a) => {
                  const overdue = isOverdue(a.dueDate);
                  const subs = SUBMISSIONS.filter(s => s.assignmentId === a.id);
                  const submitted = subs.filter(s => s.status !== "Missing").length;
                  const pct = students.length > 0 ? Math.round((submitted / students.length) * 100) : 0;
                  return (
                    <li key={a.id}>
                      <Link
                        href={`${base}/assignments/${a.id}`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Type dot */}
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${TYPE_DOT[a.type] ?? "bg-gray-400"}`} />

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {a.title}
                            </p>
                            <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${TYPE_BADGE[a.type]}`}>{a.type}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500">
                            <span className={`flex items-center gap-1 ${overdue ? "text-red-500 dark:text-red-400 font-semibold" : ""}`}>
                              {overdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {overdue ? "Overdue" : "Due"} {fmt(a.dueDate)}
                            </span>
                            <span>·</span>
                            <span>{a.points} pts</span>
                          </div>
                        </div>

                        {/* Submission progress */}
                        <div className="flex-shrink-0 w-28 hidden sm:block">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-gray-400 dark:text-slate-500">Submitted</span>
                            <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">{submitted}/{students.length}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Drafts (if any) */}
          {draftList.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/50 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100 dark:border-amber-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">Unpublished Drafts</h2>
                  <span className="text-xs font-bold px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full">{drafts}</span>
                </div>
                <Link href={`${base}/assignments`} className="flex items-center gap-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  Manage <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <ul className="divide-y divide-gray-50 dark:divide-slate-800/60">
                {draftList.map(a => (
                  <li key={a.id}>
                    <Link href={`${base}/assignments/${a.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group">
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${TYPE_BADGE[a.type]}`}>{a.type}</span>
                      <p className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-1 group-hover:text-blue-600 transition-colors">{a.title}</p>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full flex-shrink-0">Draft</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent discussions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <CardHeader icon={MessageCircle} title="Discussion Board" href={`${base}/discussions`} />
            {discussions.length === 0 ? (
              <Empty message="No discussions yet." cta="Start a discussion" href={`${base}/discussions`} />
            ) : (
              <ul className="divide-y divide-gray-50 dark:divide-slate-800/60">
                {discussions.slice(0, 3).map(d => {
                  const replyCount = d.replies.reduce((s, r) => s + 1 + (r.replies?.length ?? 0), 0);
                  return (
                    <li key={d.id}>
                      <Link href={`${base}/discussions`} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group">
                        {d.pinned && (
                          <span className="flex-shrink-0 mt-0.5 text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded">PIN</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{d.title}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-1">{d.prompt}</p>
                        </div>
                        <span className="flex-shrink-0 text-xs font-semibold text-blue-600 dark:text-blue-400">{replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

        </div>

        {/* ── Right column ─────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Quick actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-4">Quick Create</h2>
            <div className="space-y-2">
              {[
                { label: "New Assignment",   icon: ClipboardList, href: `${base}/assignments`,   segment: "assignments" },
                { label: "New Quiz",         icon: HelpCircle,    href: `${base}/quizzes`,       segment: "quizzes" },
                { label: "New Discussion",   icon: MessageCircle, href: `${base}/discussions`,   segment: "discussions" },
                { label: "New Announcement", icon: Megaphone,     href: `${base}/announcements`, segment: "announcements" },
              ].map(({ label, icon: Icon, href, segment }) => {
                const active = pathname.startsWith(`${base}/${segment}`);
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`group flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      active
                        ? "bg-[#1e3a8a] text-white shadow-sm"
                        : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 hover:bg-[#1e3a8a] hover:text-white hover:border-[#1e3a8a] hover:shadow-sm"
                    }`}
                  >
                    <Plus className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? "text-white" : "text-blue-600 dark:text-blue-400 group-hover:text-white"}`} />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Class health */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <BarChart2 className="w-4 h-4 text-[#1e3a8a] dark:text-blue-400" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Class Health</h2>
            </div>
            <div className="p-5 space-y-4">
              {/* Average */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Class Average</p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className={`text-3xl font-black tabular-nums ${gradeColor(avgGrade)}`}>{avgGrade}%</span>
                    <span className="text-sm font-bold text-gray-400 dark:text-slate-500 mb-0.5">{letterGrade(avgGrade)}</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center">
                  <TrendingUp className={`w-6 h-6 ${gradeColor(avgGrade)}`} />
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${gradeBar(avgGrade)} transition-all`} style={{ width: `${avgGrade}%` }} />
              </div>

              {/* Pass/fail */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">{passing}</p>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-500 mt-0.5">Passing</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-3 text-center">
                  <p className="text-xl font-black text-red-600 dark:text-red-400 tabular-nums">{atRisk}</p>
                  <p className="text-[11px] font-semibold text-red-500 dark:text-red-400 mt-0.5">At Risk</p>
                </div>
              </div>

              {/* Grade distribution */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Grade Distribution</p>
                {gradeRanges.map(g => (
                  <div key={g.label} className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 dark:text-slate-400 w-20 flex-shrink-0">{g.label}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${g.color}`}
                        style={{ width: students.length > 0 ? `${(g.count / students.length) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300 w-3 text-right flex-shrink-0">{g.count}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`${base}/grades`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-[#1e3a8a] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors border border-blue-100 dark:border-blue-900/50"
              >
                View Full Gradebook <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Needs grading alert */}
          {pendingGrades > 0 && (
            <Link
              href={`${base}/grades`}
              className="flex items-center gap-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-4 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">{pendingGrades} submission{pendingGrades > 1 ? "s" : ""} to grade</p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">Open gradebook to review</p>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {/* Recent announcements */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <CardHeader icon={Megaphone} title="Announcements" href={`${base}/announcements`} linkLabel="Manage" />
            {announcements.length === 0 ? (
              <Empty message="Nothing posted yet." cta="Post an announcement" href={`${base}/announcements`} />
            ) : (
              <ul className="divide-y divide-gray-50 dark:divide-slate-800/60">
                {announcements.slice(0, 4).map((a, i) => (
                  <li key={a.id}>
                    <Link href={`${base}/announcements`} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group">
                      <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{a.title}</p>
                          {i === 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-600 text-white rounded-full flex-shrink-0">NEW</span>}
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{fmtFull(a.createdAt)}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Students snapshot */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <CardHeader icon={Users} title="Students" href={`${base}/students`} linkLabel="View all" />
            <ul className="divide-y divide-gray-50 dark:divide-slate-800/60">
              {students.slice(0, 4).map(s => (
                <li key={s.id}>
                  <Link href={`${base}/students`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group">
                    <div className="w-7 h-7 rounded-full bg-[#1e3a8a] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {s.avatar}
                    </div>
                    <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{s.firstName} {s.lastName}</p>
                    <span className={`text-xs font-bold ${gradeColor(s.currentGrade)}`}>{s.currentGrade}%</span>
                  </Link>
                </li>
              ))}
              {students.length > 4 && (
                <li className="px-5 py-3 text-center text-xs font-semibold text-gray-400 dark:text-slate-500">
                  +{students.length - 4} more students
                </li>
              )}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
