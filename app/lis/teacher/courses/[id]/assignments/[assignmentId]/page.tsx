"use client";

import { useParams } from "next/navigation";
import { ASSIGNMENTS, STUDENTS, getSubmissionsByAssignment } from "@/data/teacher-mock-data";
import Link from "next/link";
import {
  ArrowLeft, Calendar, Hash, FileText, HelpCircle, FolderOpen, BookOpen,
  CheckCircle2, AlertCircle, Clock, Users, Award,
  AlertTriangle, ChevronRight,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(iso: string) {
  return new Date(iso + "T23:59:00") < new Date();
}

const STATUS_CONFIG: Record<string, { badge: string; icon: React.ElementType; dot: string }> = {
  Graded:    { badge: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40", icon: CheckCircle2, dot: "bg-emerald-500" },
  Submitted: { badge: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-800/40",                 icon: Clock,        dot: "bg-blue-500" },
  Late:      { badge: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:ring-orange-800/40",       icon: AlertTriangle, dot: "bg-orange-500" },
  Missing:   { badge: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-800/40",                         icon: AlertCircle,  dot: "bg-red-500" },
};

const TYPE_CONFIG: Record<string, { icon: React.ElementType; bg: string; text: string; badge: string }> = {
  Assignment: { icon: FileText,   bg: "bg-sky-50 dark:bg-sky-950/30",       text: "text-sky-600 dark:text-sky-400",     badge: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:ring-sky-800/40" },
  Quiz:       { icon: HelpCircle, bg: "bg-violet-50 dark:bg-violet-950/30", text: "text-violet-600 dark:text-violet-400", badge: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:ring-violet-800/40" },
  Project:    { icon: FolderOpen, bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800/40" },
  Exam:       { icon: BookOpen,   bg: "bg-rose-50 dark:bg-rose-950/30",     text: "text-rose-600 dark:text-rose-400",   badge: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:ring-rose-800/40" },
};

function gradeBand(pct: number) {
  if (pct >= 90) return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40";
  if (pct >= 80) return "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-800/40";
  if (pct >= 70) return "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-500 dark:ring-amber-800/40";
  return "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-800/40";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherAssignmentDetailPage() {
  const params       = useParams();
  const courseId     = params.id as string;
  const assignmentId = params.assignmentId as string;

  const assignment  = ASSIGNMENTS.find((a) => a.id === assignmentId);
  const submissions = getSubmissionsByAssignment(assignmentId);
  const studentById = new Map(STUDENTS.map((s) => [s.id, s]));

  const submittedCount = submissions.filter((s) => s.status !== "Missing").length;
  const missingCount   = submissions.filter((s) => s.status === "Missing").length;
  const gradedCount    = submissions.filter((s) => s.status === "Graded" || (s.status === "Late" && s.grade != null)).length;
  const lateCount      = submissions.filter((s) => s.status === "Late").length;
  const totalCount     = submissions.length;
  const submitPct      = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;

  // ── Not found ────────────────────────────────────────────────────────
  if (!assignment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
          <FileText className="w-7 h-7 text-gray-400 dark:text-slate-500" />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-gray-800 dark:text-white mb-1">Assignment not found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">This assignment may have been removed.</p>
          <Link href={`/lis/teacher/courses/${courseId}/assignments`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Assignments
          </Link>
        </div>
      </div>
    );
  }

  const overdue  = isOverdue(assignment.dueDate) && assignment.status === "published";
  const typeCfg  = TYPE_CONFIG[assignment.type] ?? TYPE_CONFIG.Assignment;
  const TypeIcon = typeCfg.icon;

  return (
    <div className="space-y-6">

      {/* ── Breadcrumb + back ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <Link href={`/lis/teacher/courses/${courseId}/assignments`}
          className="inline-flex items-center gap-1.5 font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Assignments
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-slate-600" />
        <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-xs">{assignment.title}</span>
      </div>

      {/* ── Assignment card ────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">

        {/* Header stripe */}
        <div className={`px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-start gap-4`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${typeCfg.bg}`}>
            <TypeIcon className={`w-6 h-6 ${typeCfg.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{assignment.title}</h1>
              {assignment.status === "published" ? (
                <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/40 dark:text-amber-500 dark:ring-amber-800/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Draft
                </span>
              )}
              {overdue && (
                <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold bg-red-50 text-red-600 ring-1 ring-inset ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-800/40">
                  <AlertCircle className="w-3 h-3" /> Overdue
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
              {assignment.description}
            </p>
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100 dark:divide-slate-800">
          {[
            { icon: Calendar, label: "Due Date", value: fmt(assignment.dueDate), accent: overdue ? "text-red-600 dark:text-red-400" : undefined },
            { icon: Hash,     label: "Points",   value: `${assignment.points} pts` },
            { icon: TypeIcon, label: "Type",     value: assignment.type },
            { icon: Users,    label: "Assigned To", value: assignment.assignTo === "all" ? "All Students" : `${Array.isArray(assignment.assignTo) ? assignment.assignTo.length : 0} student(s)` },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-4">
              <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">{label}</p>
                <p className={`text-sm font-semibold mt-0.5 ${accent ?? "text-gray-800 dark:text-gray-200"}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Submission stat cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Submitted",  value: submittedCount, icon: CheckCircle2, bg: "bg-blue-50 dark:bg-blue-950/30",     text: "text-blue-600 dark:text-blue-400",     num: "text-blue-700 dark:text-blue-400" },
          { label: "Graded",     value: gradedCount,    icon: Award,        bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", num: "text-emerald-700 dark:text-emerald-400" },
          { label: "Missing",    value: missingCount,   icon: AlertCircle,  bg: "bg-red-50 dark:bg-red-950/30",       text: "text-red-600 dark:text-red-400",       num: "text-red-700 dark:text-red-400" },
          { label: "Late",       value: lateCount,      icon: AlertTriangle, bg: "bg-orange-50 dark:bg-orange-950/30", text: "text-orange-600 dark:text-orange-400", num: "text-orange-700 dark:text-orange-400" },
        ].map(({ label, value, icon: Icon, bg, text, num }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">{label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`w-4 h-4 ${text}`} />
              </div>
            </div>
            <p className={`text-3xl font-black tabular-nums ${num}`}>{value}</p>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">of {totalCount} students</p>
          </div>
        ))}
      </div>

      {/* Submission progress bar */}
      {totalCount > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm px-5 py-4">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Submission Progress</p>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 tabular-nums">{submittedCount}/{totalCount} &middot; {submitPct}%</span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${submitPct >= 80 ? "bg-emerald-500" : submitPct >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
              style={{ width: `${submitPct}%` }} />
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400 dark:text-slate-500">
            <span>{gradedCount} graded</span>
            <span>{missingCount} missing</span>
          </div>
        </div>
      )}

      {/* ── Submission table ───────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">Student Submissions</h2>
          <span className="text-xs text-gray-400 dark:text-slate-500">{submissions.length} record{submissions.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/60">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Student</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Submitted</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Grade</th>
                <th className="px-4 py-3.5 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <Users className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 dark:text-slate-500">No submission records yet.</p>
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => {
                  const student  = studentById.get(sub.studentId);
                  const statusCfg = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.Submitted;
                  const StatusIcon = statusCfg.icon;
                  const gradePct = sub.grade != null ? Math.round((sub.grade / assignment.points) * 100) : null;

                  return (
                    <tr key={sub.id} className="group hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition-colors">

                      {/* Student */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${sub.status === "Missing" ? "bg-red-400" : "bg-[#1e3a8a]"}`}>
                            {student ? student.avatar : "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white leading-none">
                              {student?.name ?? sub.studentId}
                            </p>
                            {student?.email && (
                              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 leading-none">{student.email}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${statusCfg.badge}`}>
                          <StatusIcon className="w-3 h-3" />
                          {sub.status}
                        </span>
                      </td>

                      {/* Submitted at */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{fmt(sub.submittedAt)}</span>
                      </td>

                      {/* Grade */}
                      <td className="px-4 py-4">
                        {sub.grade != null ? (
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ring-1 ring-inset ${gradeBand(gradePct!)}`}>
                              {sub.grade}/{assignment.points}
                            </span>
                            <span className="text-[11px] text-gray-400 dark:text-slate-500 tabular-nums">{gradePct}%</span>
                          </div>
                        ) : (
                          <span className="text-gray-300 dark:text-slate-700 text-lg leading-none select-none">—</span>
                        )}
                      </td>

                      {/* Feedback */}
                      <td className="px-4 py-4 max-w-[220px]">
                        {sub.feedback ? (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug" title={sub.feedback}>
                            {sub.feedback}
                          </p>
                        ) : (
                          <span className="text-gray-300 dark:text-slate-700 text-lg leading-none select-none">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
