"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp,
  FileText, HelpCircle, FolderOpen, BookOpen, ExternalLink,
  Check, BarChart3, Users, Paperclip, Download, Eye, EyeOff,
} from "lucide-react";
import {
  CLASSES, STUDENTS, ASSIGNMENTS, SUBMISSIONS,
  Assignment, Student,
} from "@/data/teacher-mock-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function daysAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso + "T00:00:00").getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
}

const TYPE_ICON: Record<string, React.ElementType> = {
  Assignment: FileText, Quiz: HelpCircle, Project: FolderOpen, Exam: BookOpen,
};

const TYPE_COLOR: Record<string, string> = {
  Assignment: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  Quiz:       "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  Project:    "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
  Exam:       "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
};

// ─── Grading row ──────────────────────────────────────────────────────────────

interface PendingSub {
  subId:       string;
  student:     Student;
  assignment:  Assignment;
  submittedAt: string;
  isLate:      boolean;
  content?:    string;
  attachments?: { name: string; size: string; type: string }[];
}

function GradeRow({
  item,
  onGraded,
}: {
  item: PendingSub;
  onGraded: (subId: string, score: number, feedback: string) => void;
}) {
  const [expanded,      setExpanded]      = useState(false);
  const [score,         setScore]         = useState("");
  const [feedback,      setFeedback]      = useState("");
  const [submitted,     setSubmitted]     = useState(false);
  const [showSub,       setShowSub]       = useState(true);

  const cls    = CLASSES.find(c => c.id === item.assignment.classId);
  const pct    = score !== "" ? Math.round((Number(score) / item.assignment.points) * 100) : null;
  const valid  = score !== "" && Number(score) >= 0 && Number(score) <= item.assignment.points;

  const handleSubmit = () => {
    if (!valid) return;
    setSubmitted(true);
    setTimeout(() => onGraded(item.subId, Number(score), feedback), 600);
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-50/50 dark:bg-emerald-950/10 border-b border-emerald-100 dark:border-emerald-900/30">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          Graded — {score}/{item.assignment.points} pts saved
        </p>
      </div>
    );
  }

  return (
    <div className={`border-b border-gray-50 dark:border-slate-800/60 last:border-0 ${expanded ? "bg-blue-50/30 dark:bg-blue-950/10" : ""}`}>
      {/* Row */}
      <div
        className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/70 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
        onClick={() => setExpanded(v => !v)}
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-[#1e3a8a] text-white text-xs font-bold flex items-center justify-center shrink-0">
          {item.student.avatar}
        </div>

        {/* Student info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none truncate">
            {item.student.firstName} {item.student.lastName}
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{item.student.email}</p>
        </div>

        {/* Submitted date */}
        <div className="hidden sm:flex flex-col items-end shrink-0">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{fmtDate(item.submittedAt)}</span>
          <span className={`text-[10px] font-semibold mt-0.5 ${item.isLate ? "text-orange-500 dark:text-orange-400" : "text-gray-400 dark:text-slate-500"}`}>
            {item.isLate ? "⚠ Late — " : ""}{daysAgo(item.submittedAt)}
          </span>
        </div>

        {/* Course dot + name */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cls?.color }} />
          <span className="text-xs text-gray-500 dark:text-slate-400">{cls?.name}</span>
        </div>

        {/* Grade action */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${expanded ? "bg-[#1e3a8a] text-white" : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors"}`}>
            {expanded ? "Cancel" : "Grade"}
          </span>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-gray-400" />
            : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Expanded grading panel */}
      {expanded && (
        <div className="border-t border-blue-100 dark:border-blue-900/30 bg-gray-50/60 dark:bg-slate-900/60">
          {/* Panel toolbar */}
          <div className="flex items-center gap-3 px-5 py-2.5 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
              Grading: {item.student.firstName} {item.student.lastName}
            </span>
            <div className="ml-auto flex items-center gap-2">
              {(item.content || (item.attachments && item.attachments.length > 0)) && (
                <button
                  type="button"
                  onClick={() => setShowSub(v => !v)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {showSub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showSub ? "Hide submission" : "Show submission"}
                </button>
              )}
              <Link
                href={`/lis/teacher/courses/${item.assignment.classId}/assignments/${item.assignment.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Assignment details
              </Link>
            </div>
          </div>

          <div className={`grid gap-0 ${showSub && (item.content || item.attachments?.length) ? "lg:grid-cols-2" : "grid-cols-1"}`}>

            {/* LEFT — Submission viewer */}
            {showSub && (item.content || (item.attachments && item.attachments.length > 0)) && (
              <div className="border-r border-gray-200 dark:border-slate-800 p-5 space-y-4 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-[#1e3a8a] dark:text-blue-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                    Student Submission
                  </h4>
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 ml-auto">
                    Submitted {fmtDate(item.submittedAt)}
                    {item.isLate && (
                      <span className="ml-1.5 text-orange-500 dark:text-orange-400">· Late</span>
                    )}
                  </span>
                </div>

                {/* Written response */}
                {item.content && (
                  <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                      <BookOpen className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">Written response</span>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {item.attachments && item.attachments.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                      <Paperclip className="w-3 h-3" /> Attachments ({item.attachments.length})
                    </p>
                    <div className="space-y-2">
                      {item.attachments.map((att, i) => {
                        const iconBg =
                          att.type === "pdf" ? "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400" :
                          att.type === "doc" ? "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" :
                          att.type === "img" ? "bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400" :
                          "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400";
                        const typeLabel = att.type.toUpperCase();
                        return (
                          <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5">
                            <div className={`flex items-center justify-center w-9 h-9 rounded-lg text-[10px] font-black ${iconBg} shrink-0`}>
                              {typeLabel}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{att.name}</p>
                              <p className="text-[10px] text-gray-400 dark:text-slate-500">{att.size}</p>
                            </div>
                            <button
                              type="button"
                              title="Download"
                              className="w-7 h-7 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RIGHT — Grading form */}
            <div className="p-5 space-y-4 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="w-4 h-4 text-[#1e3a8a] dark:text-blue-400" />
                <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-slate-400">Grade</h4>
              </div>

              {/* Score input */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2">
                  Score <span className="text-gray-400 font-normal">out of {item.assignment.points} points</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-32">
                    <input
                      type="number"
                      min={0}
                      max={item.assignment.points}
                      value={score}
                      onChange={e => setScore(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                      /{item.assignment.points}
                    </span>
                  </div>
                  {pct !== null && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold ${
                      pct >= 90 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" :
                      pct >= 80 ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" :
                      pct >= 70 ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-500" :
                      "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                    }`}>
                      {pct}%
                      <span className="font-black">
                        {pct >= 97 ? "A+" : pct >= 93 ? "A" : pct >= 90 ? "A−" :
                         pct >= 87 ? "B+" : pct >= 83 ? "B" : pct >= 80 ? "B−" :
                         pct >= 77 ? "C+" : pct >= 73 ? "C" : pct >= 70 ? "C−" :
                         pct >= 60 ? "D" : "F"}
                      </span>
                    </div>
                  )}
                  {score !== "" && !valid && (
                    <span className="text-xs font-semibold text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Max {item.assignment.points}
                    </span>
                  )}
                </div>
                {pct !== null && valid && (
                  <div className="mt-2 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden w-32">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 80 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-2">
                  Feedback <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  rows={4}
                  placeholder={`e.g. "Great work on problems 1–3. Review section 4 for next time."`}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none placeholder-gray-400 dark:placeholder-slate-600"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!valid}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" /> Save Grade
                </button>
                <button
                  type="button"
                  onClick={() => { setExpanded(false); setScore(""); setFeedback(""); }}
                  className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Assignment group ─────────────────────────────────────────────────────────

function AssignmentGroup({
  assignment,
  items,
  onGraded,
}: {
  assignment: Assignment;
  items: PendingSub[];
  onGraded: (subId: string, score: number, feedback: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const cls      = CLASSES.find(c => c.id === assignment.classId);
  const TypeIcon = TYPE_ICON[assignment.type] ?? FileText;
  const gradedCount = 0; // all items here are ungraded

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Group header */}
      <button
        type="button"
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors text-left"
      >
        {/* Type icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TYPE_COLOR[assignment.type]}`}>
          <TypeIcon className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{assignment.title}</h3>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${TYPE_COLOR[assignment.type]}`}>{assignment.type}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 dark:text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cls?.color }} />
              {cls?.name}
            </span>
            <span>Due {fmtDate(assignment.dueDate)}</span>
            <span>{assignment.points} pts</span>
          </div>
        </div>

        {/* Count badge */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            {items.length} to grade
          </span>
          {collapsed
            ? <ChevronDown className="w-4 h-4 text-gray-400" />
            : <ChevronUp   className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Student rows */}
      {!collapsed && (
        <div>
          {items.map(item => (
            <GradeRow key={item.subId} item={item} onGraded={onGraded} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GradingQueuePage() {
  return (
    <Suspense>
      <GradingQueueInner />
    </Suspense>
  );
}

function GradingQueueInner() {
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const searchParams = useSearchParams();
  const classParam = searchParams.get("class") ?? "all";

  // Build grading queue from submissions
  const initialQueue = useMemo((): PendingSub[] => {
    return SUBMISSIONS
      .filter(s => s.grade === null && s.status !== "Missing" && s.submittedAt !== null)
      .map(s => {
        const student    = STUDENTS.find(st => st.id === s.studentId)!;
        const assignment = ASSIGNMENTS.find(a => a.id === s.assignmentId)!;
        return {
          subId:       s.id,
          student,
          assignment,
          submittedAt: s.submittedAt!,
          isLate:      s.status === "Late",
          content:     s.content,
          attachments: s.attachments,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  }, []);

  const [graded,       setGraded]       = useState<Record<string, { score: number; feedback: string }>>({});
  const [filterClass,  setFilterClass]  = useState<string>(
    CLASSES.some(c => c.id === classParam) ? classParam : "all"
  );

  const handleGraded = (subId: string, score: number, feedback: string) => {
    setGraded(prev => ({ ...prev, [subId]: { score, feedback } }));
  };

  const queue = initialQueue.filter(item => !graded[item.subId]);
  const filtered = filterClass === "all" ? queue : queue.filter(i => i.assignment.classId === filterClass);

  // Group by assignment
  const groups = useMemo(() => {
    const map = new Map<string, PendingSub[]>();
    for (const item of filtered) {
      const key = item.assignment.id;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).map(([, items]) => ({
      assignment: items[0].assignment,
      items,
    }));
  }, [filtered]);

  const totalRemaining  = queue.length;
  const totalGraded     = Object.keys(graded).length;
  const totalOriginal   = initialQueue.length;
  const progressPct     = totalOriginal ? Math.round((totalGraded / totalOriginal) * 100) : 100;
  const coursesAffected = new Set(queue.map(i => i.assignment.classId)).size;
  const lateCount       = queue.filter(i => i.isLate).length;

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Grading Queue</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {totalRemaining > 0
              ? `${totalRemaining} submission${totalRemaining !== 1 ? "s" : ""} waiting to be graded`
              : "All submissions graded — great work!"}
          </p>
        </div>
        <Link href="/lis/teacher/gradebook"
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-colors shrink-0">
          <BarChart3 className="w-4 h-4" /> View Gradebook
        </Link>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "To Grade",        value: totalRemaining, icon: Clock,         color: "bg-amber-50 dark:bg-amber-950/30",   text: "text-amber-600 dark:text-amber-400" },
          { label: "Graded Today",    value: totalGraded,    icon: CheckCircle2,  color: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400" },
          { label: "Courses Affected",value: coursesAffected,icon: Users,         color: "bg-blue-50 dark:bg-blue-950/30",     text: "text-blue-600 dark:text-blue-400" },
          { label: "Late Submissions", value: lateCount,     icon: AlertCircle,   color: "bg-red-50 dark:bg-red-950/30",       text: "text-red-600 dark:text-red-400" },
        ].map(({ label, value, icon: Icon, color, text }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">{label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className={`w-4 h-4 ${text}`} />
              </div>
            </div>
            <p className="text-3xl font-black tabular-nums text-gray-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Progress bar ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-900 dark:text-white">Grading Progress</p>
          <p className="text-sm font-bold tabular-nums text-gray-500 dark:text-slate-400">
            {totalGraded} / {totalOriginal} <span className="text-[11px] font-normal">submissions</span>
          </p>
        </div>
        <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressPct === 100 ? "bg-emerald-500" : "bg-[#1e3a8a]"}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">{progressPct}% complete this session</p>
      </div>

      {/* ── Filter toolbar ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={() => setFilterClass("all")}
          className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${
            filterClass === "all"
              ? "bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-sm"
              : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
          }`}>
          All Classes
        </button>
        {CLASSES.map(cls => {
          const cnt = queue.filter(i => i.assignment.classId === cls.id).length;
          if (cnt === 0) return null;
          return (
            <button key={cls.id} type="button" onClick={() => setFilterClass(cls.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                filterClass === cls.id
                  ? "text-white border-transparent shadow-sm"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-gray-300"
              }`}
              style={filterClass === cls.id ? { backgroundColor: cls.color, borderColor: cls.color } : undefined}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: filterClass === cls.id ? "rgba(255,255,255,0.5)" : cls.color }} />
              {cls.name}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filterClass === cls.id ? "bg-white/25 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-500"}`}>
                {cnt}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Queue ──────────────────────────────────────────────────────── */}
      {groups.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">All caught up!</h3>
          <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">
            {filterClass !== "all" ? "No pending submissions for this class." : "No ungraded submissions remaining."}
          </p>
          <Link href="/lis/teacher/gradebook"
            className="inline-flex items-center gap-2 mt-6 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors">
            <BarChart3 className="w-4 h-4" /> Open Gradebook
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(({ assignment, items }) => (
            <AssignmentGroup
              key={assignment.id}
              assignment={assignment}
              items={items}
              onGraded={handleGraded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
