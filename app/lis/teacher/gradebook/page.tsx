"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3, ChevronRight, TrendingUp, TrendingDown, Users, Award,
  AlertTriangle, CheckCircle2, Search, Download, ChevronDown, ChevronUp,
  AlertCircle, Clock, FileText, HelpCircle, FolderOpen, BookOpen,
  LayoutGrid, ExternalLink, CalendarDays, CalendarClock, Calendar, ChevronLeft,
  Mail, Phone, Send, MessageSquare, UserCircle, AtSign, X,
  Check, Pencil, RefreshCw, Star, GraduationCap, Zap,
  Eye, EyeOff, Paperclip,
} from "lucide-react";
import { CLASSES, STUDENTS, ASSIGNMENTS, SUBMISSIONS, RUBRICS, Class, Student, Assignment, Rubric } from "@/data/teacher-mock-data";
import { Modal } from "@/components/ui/modal";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function letterGrade(pct: number) {
  if (pct >= 97) return "A+"; if (pct >= 93) return "A"; if (pct >= 90) return "A−";
  if (pct >= 87) return "B+"; if (pct >= 83) return "B"; if (pct >= 80) return "B−";
  if (pct >= 77) return "C+"; if (pct >= 73) return "C"; if (pct >= 70) return "C−";
  if (pct >= 60) return "D"; return "F";
}

type Band = "A" | "B" | "C" | "D" | "F";

function gradeBand(pct: number): Band {
  if (pct >= 90) return "A"; if (pct >= 80) return "B";
  if (pct >= 70) return "C"; if (pct >= 60) return "D"; return "F";
}

const BAND = {
  A: { bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40", text: "text-emerald-600 dark:text-emerald-400" },
  B: { bar: "bg-blue-500",    badge: "bg-blue-50   text-blue-700   ring-blue-200   dark:bg-blue-950/40   dark:text-blue-400   dark:ring-blue-800/40",   text: "text-blue-600   dark:text-blue-400" },
  C: { bar: "bg-amber-500",   badge: "bg-amber-50  text-amber-700  ring-amber-200  dark:bg-amber-950/40  dark:text-amber-500  dark:ring-amber-800/40",  text: "text-amber-600  dark:text-amber-500" },
  D: { bar: "bg-orange-500",  badge: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:ring-orange-800/40", text: "text-orange-600 dark:text-orange-400" },
  F: { bar: "bg-red-500",     badge: "bg-red-50    text-red-700    ring-red-200    dark:bg-red-950/40    dark:text-red-400    dark:ring-red-800/40",     text: "text-red-600    dark:text-red-400" },
};

function GradeBadge({ pct, size = "sm" }: { pct: number; size?: "sm" | "md" | "lg" }) {
  const band = gradeBand(pct);
  const sz   = size === "lg" ? "text-sm px-3 py-1" : size === "md" ? "text-xs px-2.5 py-0.5" : "text-[11px] px-2 py-0.5";
  return (
    <span className={`inline-flex items-center font-bold rounded-lg ring-1 ring-inset tabular-nums ${sz} ${BAND[band].badge}`}>
      {pct}%
    </span>
  );
}

// ─── Global sub/grade map built once ──────────────────────────────────────────

const SUB_MAP = new Map<string, (typeof SUBMISSIONS)[0]>();
for (const s of SUBMISSIONS) SUB_MAP.set(`${s.studentId}:${s.assignmentId}`, s);

// ─── Date helpers ─────────────────────────────────────────────────────────────

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

function fmtShort(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function fmtFull(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d < TODAY;
}

// Returns the ISO date (YYYY-MM-DD) of the Monday starting the week that contains `iso`
function getWeekMonday(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  return mon.toISOString().split("T")[0];
}

// "Mar 2 – Mar 6" style label for a week starting on mondayIso
function fmtWeekRange(mondayIso: string): string {
  const mon = new Date(mondayIso + "T00:00:00");
  const fri = new Date(mon);
  fri.setDate(mon.getDate() + 4);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${mon.toLocaleDateString(undefined, opts)} – ${fri.toLocaleDateString(undefined, opts)}`;
}

/** True if `iso` (YYYY-MM-DD) is the same calendar day as `ref` (local time). */
function isSameCalendarDay(iso: string, ref: Date): boolean {
  const d = new Date(iso + "T12:00:00");
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth() && d.getDate() === ref.getDate();
}

/** Build month grid cells (Mon–Sun weeks); leading/trailing nulls pad empty days. */
function buildMonthGrid(year: number, monthIndex: number): (number | null)[][] {
  const first = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const startPad = first.getDay() === 0 ? 6 : first.getDay() - 1;
  const cells: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let day = 1; day <= lastDay; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function isoFromParts(year: number, monthIndex: number, day: number): string {
  const m = String(monthIndex + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

// Subtle rotating palette for week group headers
const WEEK_COLORS = [
  { bg: "bg-blue-50   dark:bg-blue-950/20",   border: "border-blue-200   dark:border-blue-800/40",   text: "text-blue-700   dark:text-blue-400"   },
  { bg: "bg-violet-50 dark:bg-violet-950/20", border: "border-violet-200 dark:border-violet-800/40", text: "text-violet-700 dark:text-violet-400" },
  { bg: "bg-teal-50   dark:bg-teal-950/20",   border: "border-teal-200   dark:border-teal-800/40",   text: "text-teal-700   dark:text-teal-400"   },
  { bg: "bg-amber-50  dark:bg-amber-950/20",  border: "border-amber-200  dark:border-amber-800/40",  text: "text-amber-700  dark:text-amber-400"  },
  { bg: "bg-rose-50   dark:bg-rose-950/20",   border: "border-rose-200   dark:border-rose-800/40",   text: "text-rose-700   dark:text-rose-400"   },
  { bg: "bg-emerald-50 dark:bg-emerald-950/20", border: "border-emerald-200 dark:border-emerald-800/40", text: "text-emerald-700 dark:text-emerald-400" },
];

// ─── Class summary computed ────────────────────────────────────────────────────

function classSummary(cls: Class) {
  const students    = STUDENTS.filter((s) => s.classId === cls.id);
  const avg         = students.length ? Math.round(students.reduce((s, st) => s + st.currentGrade, 0) / students.length) : 0;
  const atRisk      = students.filter((s) => s.currentGrade < 70);
  const passing     = students.filter((s) => s.currentGrade >= 70);
  const passRate    = students.length ? Math.round((passing.length / students.length) * 100) : 0;
  const bandCounts  = { A: 0, B: 0, C: 0, D: 0, F: 0 } as Record<Band, number>;
  for (const st of students) bandCounts[gradeBand(st.currentGrade)]++;
  const topStudent  = [...students].sort((a, b) => b.currentGrade - a.currentGrade)[0];
  return { students, avg, atRisk, passing, passRate, bandCounts, topStudent };
}

// ─── Type helpers ─────────────────────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ElementType> = {
  Assignment: FileText, Quiz: HelpCircle, Project: FolderOpen, Exam: BookOpen,
};

const TYPE_COLOR: Record<string, string> = {
  Assignment: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  Quiz:       "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
  Project:    "bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
  Exam:       "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400",
};

const STATUS_CHIP: Record<string, string> = {
  Graded:    "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40",
  Missing:   "bg-red-50    text-red-700    ring-red-200    dark:bg-red-950/40    dark:text-red-400    dark:ring-red-800/40",
  Submitted: "bg-amber-50  text-amber-700  ring-amber-200  dark:bg-amber-950/40  dark:text-amber-500  dark:ring-amber-800/40",
  Late:      "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:ring-orange-800/40",
};

// ─── Local grade type ─────────────────────────────────────────────────────────

interface LocalGrade {
  score: number;
  feedback: string;
  retakeGranted?: boolean;
  gradingMode?: "points" | "rubric";
  rubricScores?: Record<string, number>;
}

// ─── Compose Modal ────────────────────────────────────────────────────────────

type MessageTarget = { label: string; email: string; type: "student" | "parent" };

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  defaultTarget?: "student" | "parent";
}

function ComposeModal({ isOpen, onClose, student, defaultTarget = "student" }: ComposeModalProps) {
  const targets: MessageTarget[] = [
    { label: `${student.firstName} ${student.lastName} (Student)`, email: student.email,       type: "student" },
    { label: `${student.parentName} (${student.parentRelation})`,  email: student.parentEmail, type: "parent"  },
  ];
  const [toType,     setToType]     = useState<"student" | "parent">(defaultTarget);
  const [subject,    setSubject]    = useState("");
  const [body,       setBody]       = useState("");
  const [sent,       setSent]       = useState(false);
  const [showToMenu, setShowToMenu] = useState(false);
  const currentTarget = targets.find((t) => t.type === toType) ?? targets[0];
  const handleSend  = () => { if (!subject.trim() || !body.trim()) return; setSent(true); };
  const handleClose = () => { setSubject(""); setBody(""); setSent(false); setToType(defaultTarget); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Message" size="lg"
      footer={sent ? (
        <button type="button" onClick={handleClose}
          className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
          Done
        </button>
      ) : (
        <>
          <button type="button" onClick={handleClose}
            className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button type="button" onClick={handleSend} disabled={!subject.trim() || !body.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="h-4 w-4" /> Send Message
          </button>
        </>
      )}>
      {sent ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">Message sent!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Your message to <span className="font-medium text-gray-700 dark:text-gray-200">{currentTarget.label}</span> has been delivered.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">To</label>
            <div className="relative">
              <button type="button" onClick={() => setShowToMenu(!showToMenu)}
                className="w-full flex items-center justify-between gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white shadow-sm hover:border-blue-400 transition-colors">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${toType === "student" ? "bg-blue-600" : "bg-violet-600"}`}>
                    {toType === "student" ? student.avatar : student.parentName.charAt(0)}
                  </div>
                  <span className="truncate font-medium">{currentTarget.label}</span>
                  <span className="text-xs text-gray-400 truncate hidden sm:inline">&lt;{currentTarget.email}&gt;</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
              </button>
              {showToMenu && (
                <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
                  {targets.map((t) => (
                    <button key={t.type} type="button" onClick={() => { setToType(t.type); setShowToMenu(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors ${toType === t.type ? "bg-blue-50 dark:bg-blue-950/30" : ""}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${t.type === "student" ? "bg-blue-600" : "bg-violet-600"}`}>
                        {t.type === "student" ? student.avatar : student.parentName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{t.label}</p>
                        <p className="text-xs text-gray-400">{t.email}</p>
                      </div>
                      {toType === t.type && <CheckCircle2 className="h-4 w-4 text-blue-600 ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Update on recent class performance"
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Message</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6}
              placeholder={`Write your message to ${toType === "student" ? student.firstName : student.parentName}…`}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y min-h-[140px]" />
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 px-3 py-2.5">
            <MessageSquare className="h-4 w-4 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-400">Messages are delivered through StudyBuddy and logged in the messaging center.</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Contact Row ──────────────────────────────────────────────────────────────

function ContactRow({ icon: Icon, label, value, action, actionLabel }: {
  icon: React.ElementType; label: string; value: string; action?: () => void; actionLabel?: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }); };
  return (
    <div className="flex items-start gap-2.5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 px-3 py-2.5">
      <Icon className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">{label}</p>
        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate mt-0.5">{value}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {action && actionLabel && (
          <button type="button" onClick={action} className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors" title={actionLabel}>
            <Send className="w-3 h-3" />
          </button>
        )}
        <button type="button" onClick={handleCopy} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" title="Copy">
          {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 rotate-45" />}
        </button>
      </div>
    </div>
  );
}

// ─── Class Summary Card ───────────────────────────────────────────────────────

function ClassSummaryCard({ cls, onClick }: { cls: Class; onClick: () => void }) {
  const { students, avg, atRisk, passRate, bandCounts } = classSummary(cls);
  const total = students.length;
  const clsAssignments = ASSIGNMENTS.filter((a) => a.classId === cls.id && a.status === "published");
  const nextDue = clsAssignments
    .filter((a) => !isOverdue(a.dueDate))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  const overdueCount = clsAssignments.filter((a) => isOverdue(a.dueDate)).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className="h-2 w-full" style={{ backgroundColor: cls.color }} />

      <div className="p-5 flex-1 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{cls.name}</h3>
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{cls.section} · {cls.gradeLevel}</p>
          </div>
          <GradeBadge pct={avg} size="md" />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-1.5">Grade Distribution</p>
          <div className="flex h-2.5 rounded-full overflow-hidden gap-px">
            {(["A", "B", "C", "D", "F"] as Band[]).map((band) => {
              const pct = total > 0 ? (bandCounts[band] / total) * 100 : 0;
              return pct > 0 ? (
                <div key={band} className={`${BAND[band].bar} transition-all`} style={{ width: `${pct}%` }} title={`${band}: ${bandCounts[band]} student${bandCounts[band] !== 1 ? "s" : ""}`} />
              ) : null;
            })}
          </div>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {(["A", "B", "C", "D", "F"] as Band[]).map((band) =>
              bandCounts[band] > 0 ? (
                <span key={band} className={`text-[10px] font-semibold ${BAND[band].text}`}>{band}: {bandCounts[band]}</span>
              ) : null
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-lg font-black tabular-nums text-gray-900 dark:text-white">{total}</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500">Students</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-black tabular-nums text-emerald-600 dark:text-emerald-400">{passRate}%</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500">Passing</p>
          </div>
          <div className="text-center">
            <p className={`text-lg font-black tabular-nums ${atRisk.length > 0 ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-slate-500"}`}>{atRisk.length}</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500">At Risk</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-100 dark:border-slate-800">
          {nextDue && (
            <div className="flex items-center gap-2 text-[11px]">
              <CalendarDays className="w-3 h-3 text-blue-500 shrink-0" />
              <span className="text-gray-500 dark:text-gray-400">
                Next due: <span className="font-semibold text-gray-700 dark:text-gray-200">{nextDue.title}</span>
              </span>
              <span className="ml-auto font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">{fmtShort(nextDue.dueDate)}</span>
            </div>
          )}
          {overdueCount > 0 && (
            <div className="flex items-center gap-2 text-[11px]">
              <CalendarClock className="w-3 h-3 text-red-500 shrink-0" />
              <span className="text-red-600 dark:text-red-400 font-semibold">{overdueCount} overdue assignment{overdueCount !== 1 ? "s" : ""}</span>
            </div>
          )}
          {!nextDue && overdueCount === 0 && (
            <p className="text-[11px] text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3" /> No upcoming assignments
            </p>
          )}
        </div>
      </div>

      <div className="px-5 py-3 bg-gray-50/70 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
        <button type="button" onClick={onClick}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors">
          View Gradebook
        </button>
        <Link href={`/lis/teacher/courses/${cls.id}/grades`}
          className="w-8 h-8 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors" title="Open full gradebook">
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ─── Submission Viewer ────────────────────────────────────────────────────────

function SubmissionViewer({ sub, assignment }: {
  sub: (typeof SUBMISSIONS)[0] | undefined;
  assignment: Assignment;
}) {
  const hasContent     = !!sub?.content;
  const hasAttachments = !!(sub?.attachments && sub.attachments.length > 0);
  const hasAnything    = hasContent || hasAttachments;

  if (!hasAnything) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 text-center px-6 py-10">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
          <FileText className="w-6 h-6 text-gray-400 dark:text-slate-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No submission content</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            {sub ? "The student submitted but did not include a written response or attachments." : "No submission on file for this student."}
          </p>
        </div>
        {assignment.description && (
          <div className="mt-4 w-full text-left p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl">
            <p className="text-[10px] font-bold uppercase tracking-wide text-blue-500 dark:text-blue-400 mb-1">Assignment Prompt</p>
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{assignment.description}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Submission meta */}
      {sub?.submittedAt && (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <CalendarClock className="w-3.5 h-3.5 text-gray-400" />
          Submitted {fmtFull(sub.submittedAt)}
          {sub.status === "Late" && (
            <span className="ml-1 text-orange-500 dark:text-orange-400 font-semibold">· Late</span>
          )}
        </div>
      )}

      {/* Written response */}
      {hasContent && (
        <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
            <BookOpen className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Written Response</span>
          </div>
          <div className="px-4 py-3 bg-white dark:bg-slate-900">
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {sub?.content}
            </p>
          </div>
        </div>
      )}

      {/* Attachments */}
      {hasAttachments && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
            <Paperclip className="w-3 h-3" /> Attachments ({sub!.attachments!.length})
          </p>
          <div className="space-y-2">
            {sub!.attachments!.map((att, i) => {
              const iconBg =
                att.type === "pdf" ? "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400" :
                att.type === "doc" ? "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400" :
                att.type === "img" ? "bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400" :
                "bg-gray-100 dark:bg-slate-700 text-gray-500";
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-lg text-[10px] font-black shrink-0 ${iconBg}`}>
                    {att.type.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{att.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">{att.size}</p>
                  </div>
                  <button type="button" title="Download"
                    className="w-7 h-7 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Assignment description */}
      {assignment.description && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl">
          <p className="text-[10px] font-bold uppercase tracking-wide text-blue-500 dark:text-blue-400 mb-1">Assignment Prompt</p>
          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{assignment.description}</p>
        </div>
      )}
    </div>
  );
}

// ─── Rubric Grading Panel ─────────────────────────────────────────────────────

function RubricGradingPanel({ rubric, rubricScores, onChange }: {
  rubric: Rubric;
  rubricScores: Record<string, number>;
  onChange: (criterionId: string, points: number) => void;
}) {
  const total    = rubric.criteria.reduce((s, c) => s + (rubricScores[c.id] ?? -1 >= 0 ? rubricScores[c.id] : 0), 0);
  const maxTotal = rubric.criteria.reduce((s, c) => s + c.points, 0);
  const scoredAll = rubric.criteria.every(c => rubricScores[c.id] !== undefined);

  return (
    <div className="space-y-4">
      {/* Running total */}
      <div className={`flex items-center justify-between p-3 rounded-xl border ${
        scoredAll ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40" : "bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700"
      }`}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Rubric Total</p>
          <p className={`text-2xl font-black tabular-nums mt-0.5 ${scoredAll ? "text-emerald-700 dark:text-emerald-400" : "text-gray-400 dark:text-slate-500"}`}>
            {scoredAll ? total : "—"}
            <span className="text-sm font-normal text-gray-400 dark:text-slate-500 ml-1">/ {maxTotal} pts</span>
          </p>
        </div>
        {scoredAll && (
          <div className={`px-3 py-1.5 rounded-xl text-sm font-bold ${
            Math.round((total / maxTotal) * 100) >= 90 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" :
            Math.round((total / maxTotal) * 100) >= 80 ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400" :
            Math.round((total / maxTotal) * 100) >= 70 ? "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-500" :
            "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
          }`}>
            {Math.round((total / maxTotal) * 100)}% · {letterGrade(Math.round((total / maxTotal) * 100))}
          </div>
        )}
      </div>

      {/* Criteria */}
      {rubric.criteria.map((criterion, idx) => {
        const selected = rubricScores[criterion.id];
        const isScored = selected !== undefined;
        return (
          <div key={criterion.id} className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            {/* Criterion header */}
            <div className="flex items-start justify-between gap-3 px-4 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 shrink-0">
                    {idx + 1}.
                  </span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{criterion.label}</p>
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 shrink-0">
                    {criterion.points} pts
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-4">{criterion.description}</p>
              </div>
              {isScored && (
                <div className={`shrink-0 px-2 py-0.5 rounded-lg text-xs font-bold ${
                  BAND[gradeBand(Math.round((selected / criterion.points) * 100))].badge
                } ring-1 ring-inset`}>
                  {selected}/{criterion.points}
                </div>
              )}
            </div>

            {/* Level buttons */}
            <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
              {criterion.levels.map(level => {
                const isSelected = selected === level.points;
                return (
                  <button key={level.label} type="button"
                    onClick={() => onChange(criterion.id, level.points)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "bg-[#1e3a8a] dark:bg-blue-900/50"
                        : "hover:bg-gray-50 dark:hover:bg-slate-800/40"
                    }`}>
                    {/* Points chip */}
                    <span className={`shrink-0 text-[10px] font-black w-8 text-center py-0.5 rounded-md ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                    }`}>
                      {level.points}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-gray-800 dark:text-gray-200"}`}>
                        {level.label}
                      </p>
                      <p className={`text-[10px] mt-0.5 leading-relaxed ${isSelected ? "text-white/80" : "text-gray-400 dark:text-slate-500"}`}>
                        {level.description}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Grade Entry Modal ────────────────────────────────────────────────────────

interface GradeEntryModalProps {
  student: Student;
  assignment: Assignment;
  existing: LocalGrade | null;
  originalGrade: number | null;
  onSave: (score: number, feedback: string, retakeGranted: boolean, gradingMode: "points" | "rubric", rubricScores?: Record<string, number>) => void;
  onClose: () => void;
}

function GradeEntryModal({ student, assignment, existing, originalGrade, onSave, onClose }: GradeEntryModalProps) {
  const sub          = SUB_MAP.get(`${student.id}:${assignment.id}`);
  const rubric       = RUBRICS.find(r => r.assignmentId === assignment.id) ?? null;
  const isQuizOrExam = assignment.type === "Quiz" || assignment.type === "Exam";
  const isEditing    = originalGrade != null || existing != null;
  const TypeIcon     = TYPE_ICON[assignment.type] ?? FileText;
  const cls          = CLASSES.find(c => c.id === assignment.classId);

  const defaultMode: "points" | "rubric" = existing?.gradingMode ?? (rubric ? "rubric" : "points");
  const [gradingMode,  setGradingMode]  = useState<"points" | "rubric">(defaultMode);
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(existing?.rubricScores ?? {});
  const [score,        setScore]        = useState(
    existing?.score != null ? String(existing.score) : (originalGrade != null ? String(originalGrade) : "")
  );
  const [feedback, setFeedback] = useState(existing?.feedback ?? "");
  const [retake,   setRetake]   = useState(existing?.retakeGranted ?? false);
  const [saved,    setSaved]    = useState(false);
  const [subPanel, setSubPanel] = useState(true);

  // When rubric mode scores all criteria, auto-fill the points score
  const rubricTotal = rubric
    ? rubric.criteria.reduce((s, c) => s + (rubricScores[c.id] ?? 0), 0)
    : 0;
  const rubricComplete = rubric
    ? rubric.criteria.every(c => rubricScores[c.id] !== undefined)
    : false;

  const effectiveScore = gradingMode === "rubric" && rubricComplete
    ? rubricTotal
    : (score !== "" && !isNaN(Number(score)) ? Number(score) : null);

  const pct   = effectiveScore != null ? Math.round((effectiveScore / assignment.points) * 100) : null;
  const valid =
    gradingMode === "rubric"
      ? rubricComplete
      : (score !== "" && !isNaN(Number(score)) && Number(score) >= 0 && Number(score) <= assignment.points);

  const handleRubricChange = (criterionId: string, points: number) => {
    setRubricScores(prev => ({ ...prev, [criterionId]: points }));
  };

  const handleSave = () => {
    if (!valid) return;
    const finalScore = gradingMode === "rubric" ? rubricTotal : Number(score);
    setSaved(true);
    setTimeout(() => {
      onSave(finalScore, feedback, retake, gradingMode, gradingMode === "rubric" ? rubricScores : undefined);
      onClose();
    }, 500);
  };

  const hasSubmissionContent = !!(sub?.content || sub?.attachments?.length);

  return (
    <Modal isOpen onClose={onClose}
      title={isEditing ? "Edit Grade" : "Grade Submission"}
      size="full">

      {saved ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">Grade saved!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {effectiveScore}/{assignment.points} pts
            {gradingMode === "rubric" && " (rubric)"}
          </p>
          {retake && (
            <p className="text-sm text-violet-600 dark:text-violet-400 font-medium flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" /> Retake granted
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-0 -mx-6 -my-5">

          {/* ── Top header bar ────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40">
            {/* Student */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#1e3a8a] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {student.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{student.email}</p>
              </div>
            </div>

            {/* Assignment */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${TYPE_COLOR[assignment.type]}`}>
                <TypeIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{assignment.title}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{assignment.type} · {assignment.points} pts · {cls?.name}</p>
              </div>
            </div>

            {/* Current grade (if editing) */}
            {originalGrade != null && (
              <div className="shrink-0 text-right">
                <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase tracking-wide">Current</p>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{originalGrade}/{assignment.points}</p>
              </div>
            )}

            {/* Submission toggle */}
            {hasSubmissionContent && (
              <button type="button" onClick={() => setSubPanel(v => !v)}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                {subPanel ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {subPanel ? "Hide Submission" : "Show Submission"}
              </button>
            )}
          </div>

          {/* ── Two-column body ──────────────────────────────────────── */}
          <div className={`flex flex-col ${subPanel && hasSubmissionContent ? "lg:flex-row" : ""}`}>

            {/* LEFT — Submission viewer */}
            {subPanel && hasSubmissionContent && (
              <div className="lg:w-1/2 lg:border-r border-gray-100 dark:border-slate-800 px-6 py-5 overflow-y-auto max-h-[60vh]">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Student Submission
                </p>
                <SubmissionViewer sub={sub} assignment={assignment} />
              </div>
            )}

            {/* RIGHT — Grading panel */}
            <div className={`${subPanel && hasSubmissionContent ? "lg:w-1/2" : "w-full"} px-6 py-5 space-y-5 overflow-y-auto max-h-[60vh]`}>

              {/* Grading mode toggle */}
              {rubric && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-2">Grading Method</p>
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1">
                    {([
                      { id: "rubric" as const, label: "Rubric",  icon: GraduationCap },
                      { id: "points" as const, label: "Points",  icon: BarChart3 },
                    ]).map(({ id, label, icon: Icon }) => (
                      <button key={id} type="button" onClick={() => setGradingMode(id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                          gradingMode === id
                            ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}>
                        <Icon className={`w-4 h-4 ${gradingMode === id ? "text-[#1e3a8a] dark:text-blue-400" : ""}`} />
                        {label}
                      </button>
                    ))}
                  </div>
                  {rubric && (
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" />
                      {gradingMode === "rubric"
                        ? `Score each criterion — total auto-calculates out of ${assignment.points} pts`
                        : "Enter a manual point score directly"}
                    </p>
                  )}
                </div>
              )}

              {/* ── Rubric mode ──────────────────────────────────────── */}
              {gradingMode === "rubric" && rubric && (
                <RubricGradingPanel
                  rubric={rubric}
                  rubricScores={rubricScores}
                  onChange={handleRubricChange}
                />
              )}

              {/* ── Points mode ──────────────────────────────────────── */}
              {gradingMode === "points" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Score <span className="font-normal normal-case text-gray-400">out of {assignment.points} points</span>
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative w-36">
                      <input
                        type="number" min={0} max={assignment.points}
                        value={score} onChange={e => setScore(e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2.5 pr-12 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-base font-bold text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                        /{assignment.points}
                      </span>
                    </div>
                    {pct !== null && valid && (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold ${
                        pct >= 90 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" :
                        pct >= 80 ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" :
                        pct >= 70 ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-500" :
                        "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                      }`}>
                        {pct}% <span className="font-black ml-1">{letterGrade(pct)}</span>
                      </div>
                    )}
                    {score !== "" && !valid && (
                      <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> 0 – {assignment.points} pts
                      </span>
                    )}
                  </div>
                  {pct !== null && valid && (
                    <div className="mt-2 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden w-36">
                      <div className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
              )}

              {/* Feedback */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Feedback <span className="font-normal normal-case text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={feedback} onChange={e => setFeedback(e.target.value)}
                  rows={3}
                  placeholder={`e.g. "Great effort — review section 4 for next time."`}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none placeholder-gray-400 dark:placeholder-slate-600"
                />
              </div>

              {/* Retake — Quiz / Exam only */}
              {isQuizOrExam && (
                <button type="button" onClick={() => setRetake(v => !v)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                    retake
                      ? "border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-950/20"
                      : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-700"
                  }`}>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    retake ? "bg-violet-600 border-violet-600" : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  }`}>
                    {retake && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-violet-500" /> Allow Retake
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Student can retake this {assignment.type.toLowerCase()}. Their best score will be kept.
                    </p>
                  </div>
                </button>
              )}

              {/* Save actions */}
              <div className="flex items-center gap-2 pt-1">
                <button type="button" onClick={handleSave} disabled={!valid}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <Check className="w-4 h-4" />
                  {isEditing ? "Update Grade" : "Save Grade"}
                  {gradingMode === "rubric" && rubricComplete && ` — ${rubricTotal}/${assignment.points}`}
                </button>
                <button type="button" onClick={onClose}
                  className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Quick Grade Row ──────────────────────────────────────────────────────────

function QuickGradeRow({
  student, assignment, sub, isQuizOrExam,
  onGrade,
}: {
  student: Student;
  assignment: Assignment;
  sub: (typeof SUBMISSIONS)[0];
  isQuizOrExam: boolean;
  onGrade: (score: number, feedback: string, retake: boolean) => void;
}) {
  const [score,    setScore]    = useState("");
  const [feedback, setFeedback] = useState("");
  const [retake,   setRetake]   = useState(false);
  const [graded,   setGraded]   = useState(false);
  const [open,     setOpen]     = useState(false);

  const pct   = score !== "" ? Math.round((Number(score) / assignment.points) * 100) : null;
  const valid = score !== "" && !isNaN(Number(score)) && Number(score) >= 0 && Number(score) <= assignment.points;

  if (graded) {
    return (
      <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-50/60 dark:bg-emerald-950/10">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          Graded — {score}/{assignment.points} pts
          {retake && <span className="ml-2 text-violet-600 dark:text-violet-400">· Retake allowed</span>}
        </p>
      </div>
    );
  }

  return (
    <div className={`border-b border-gray-50 dark:border-slate-800/60 last:border-0 ${open ? "bg-blue-50/30 dark:bg-blue-950/10" : ""}`}>
      <div
        className="flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-gray-50/70 dark:hover:bg-slate-800/30 transition-colors group"
        onClick={() => setOpen(v => !v)}
      >
        <div className="w-8 h-8 rounded-xl bg-[#1e3a8a] text-white text-xs font-bold flex items-center justify-center shrink-0">
          {student.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{student.firstName} {student.lastName}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
            {sub.submittedAt ? `Submitted ${fmtShort(sub.submittedAt)}` : "No date"}
            {sub.status === "Late" && <span className="ml-1.5 text-orange-500 dark:text-orange-400 font-semibold">· Late</span>}
          </p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${open ? "bg-[#1e3a8a] text-white" : "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 group-hover:bg-[#1e3a8a] group-hover:text-white"}`}>
          {open ? "Cancel" : "Grade"}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </div>

      {open && (() => {
        const sub = SUB_MAP.get(`${student.id}:${assignment.id}`);
        const hasContent = !!(sub?.content || sub?.attachments?.length);
        return (
          <div className="border-t border-blue-100 dark:border-blue-900/30">
            <div className={`flex flex-col ${hasContent ? "lg:flex-row" : ""}`}>

              {/* Submission viewer */}
              {hasContent && (
                <div className="lg:w-1/2 lg:border-r border-gray-100 dark:border-slate-800 px-5 py-4 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> Student Submission
                    {sub?.submittedAt && (
                      <span className="font-normal normal-case ml-auto">
                        {fmtShort(sub.submittedAt)}
                        {sub.status === "Late" && <span className="ml-1 text-orange-500">· Late</span>}
                      </span>
                    )}
                  </p>

                  {sub?.content && (
                    <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                      <div className="px-3 py-2 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 flex items-center gap-1"><BookOpen className="w-3 h-3" /> Written Response</p>
                      </div>
                      <div className="px-3 py-2.5 max-h-40 overflow-y-auto">
                        <p className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{sub.content}</p>
                      </div>
                    </div>
                  )}

                  {sub?.attachments && sub.attachments.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 flex items-center gap-1">
                        <Paperclip className="w-3 h-3" /> Attachments
                      </p>
                      {sub.attachments.map((att, i) => (
                        <div key={i} className="flex items-center gap-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded shrink-0 ${
                            att.type === "pdf" ? "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400" :
                            att.type === "doc" ? "bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" :
                            att.type === "img" ? "bg-violet-100 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400" :
                            "bg-gray-100 text-gray-500"
                          }`}>{att.type.toUpperCase()}</span>
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 flex-1 min-w-0 truncate">{att.name}</p>
                          <span className="text-[10px] text-gray-400 shrink-0">{att.size}</span>
                          <button type="button" className="text-gray-400 hover:text-blue-600 transition-colors shrink-0">
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Grading form */}
              <div className={`${hasContent ? "lg:w-1/2" : "w-full"} px-5 pb-5 pt-4 space-y-4`}>
                {/* Score */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative w-32">
                    <input type="number" min={0} max={assignment.points} value={score}
                      onChange={e => setScore(e.target.value)} placeholder="0"
                      className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">/{assignment.points}</span>
                  </div>
                  {pct !== null && valid && (
                    <div className={`px-3 py-2 rounded-xl text-sm font-bold ${
                      pct >= 90 ? "bg-emerald-50 text-emerald-700" : pct >= 80 ? "bg-blue-50 text-blue-700" :
                      pct >= 70 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                    }`}>{pct}% <span className="font-black">{letterGrade(pct)}</span></div>
                  )}
                  {score !== "" && !valid && (
                    <span className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Max {assignment.points}
                    </span>
                  )}
                </div>

                <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={2}
                  placeholder="Optional feedback for student…"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder-gray-400 dark:placeholder-slate-600"
                />

                {isQuizOrExam && (
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <button type="button" onClick={() => setRetake(v => !v)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${retake ? "bg-violet-600 border-violet-600" : "border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900"}`}>
                      {retake && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allow retake for this {assignment.type.toLowerCase()}
                    </span>
                    <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
                  </label>
                )}

                <div className="flex items-center gap-2">
                  <button type="button" disabled={!valid}
                    onClick={() => { if (!valid) return; setGraded(true); onGrade(Number(score), feedback, retake); }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <Check className="w-4 h-4" /> Save Grade
                  </button>
                  <button type="button" onClick={() => { setOpen(false); setScore(""); setFeedback(""); }}
                    className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Quick Grade Tab ──────────────────────────────────────────────────────────

function QuickGrade({
  cls, localGrades, onGrade,
}: {
  cls: Class;
  localGrades: Record<string, LocalGrade>;
  onGrade: (studentId: string, assignmentId: string, score: number, feedback: string, retake: boolean) => void;
}) {
  const assignments = ASSIGNMENTS.filter(a => a.classId === cls.id && a.status === "published");

  const pending = useMemo(() => {
    const items: { student: Student; assignment: Assignment; sub: (typeof SUBMISSIONS)[0] }[] = [];
    for (const a of assignments) {
      const subs = SUBMISSIONS.filter(s =>
        s.assignmentId === a.id &&
        s.grade === null &&
        s.status !== "Missing" &&
        s.submittedAt !== null
      );
      for (const sub of subs) {
        if (localGrades[`${sub.studentId}:${a.id}`]) continue;
        const student = STUDENTS.find(st => st.id === sub.studentId);
        if (student) items.push({ student, assignment: a, sub });
      }
    }
    return items;
  }, [assignments, localGrades]);

  if (pending.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">All caught up!</h3>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-2">No pending submissions to grade for this class.</p>
        <Link href="/lis/teacher/grading"
          className="inline-flex items-center gap-2 mt-6 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          <BarChart3 className="w-4 h-4" /> View all classes grading queue
        </Link>
      </div>
    );
  }

  const groups = new Map<string, typeof pending>();
  for (const item of pending) {
    if (!groups.has(item.assignment.id)) groups.set(item.assignment.id, []);
    groups.get(item.assignment.id)!.push(item);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        <span className="font-bold text-gray-900 dark:text-white">{pending.length}</span> submission{pending.length !== 1 ? "s" : ""} waiting to be graded
      </p>
      {Array.from(groups.entries()).map(([, items]) => {
        const { assignment } = items[0];
        const TypeIcon = TYPE_ICON[assignment.type] ?? FileText;
        const isQuizOrExam = assignment.type === "Quiz" || assignment.type === "Exam";
        return (
          <div key={assignment.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${TYPE_COLOR[assignment.type]}`}>
                <TypeIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{assignment.title}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">
                  {assignment.type} · {assignment.points} pts · Due {fmtShort(assignment.dueDate)}
                  {isQuizOrExam && (
                    <span className="ml-2 text-violet-500 dark:text-violet-400 font-semibold">· Retake available</span>
                  )}
                </p>
              </div>
              <span className="shrink-0 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg">
                {items.length} to grade
              </span>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
              {items.map(({ student, sub }) => (
                <QuickGradeRow
                  key={sub.id}
                  student={student}
                  assignment={assignment}
                  sub={sub}
                  isQuizOrExam={isQuizOrExam}
                  onGrade={(score, fb, rt) => onGrade(student.id, assignment.id, score, fb, rt)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Discussions Grading Tab ──────────────────────────────────────────────────

interface DiscEntry { score: string; note: string }

function DiscussionGrading({
  cls,
  scores,
  onUpdate,
  onSaveAll,
}: {
  cls: Class;
  scores: Record<string, DiscEntry>;
  onUpdate: (studentId: string, score: string, note: string) => void;
  onSaveAll: () => void;
}) {
  const students = STUDENTS.filter(s => s.classId === cls.id);
  const gradedCount = Object.values(scores).filter(s => s.score !== "").length;
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    onSaveAll();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 rounded-xl">
        <MessageSquare className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-violet-800 dark:text-violet-300">Discussion Participation Grades</p>
          <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">
            Score each student&apos;s participation out of 10. Add an optional note for context.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-800/40">
          <Star className="w-4 h-4 text-violet-500" />
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Participation Scores</h3>
          <span className="ml-auto text-xs text-gray-400 dark:text-slate-500">
            {gradedCount} / {students.length} scored · out of 10 pts
          </span>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
          {students.map(st => {
            const entry  = scores[st.id] ?? { score: "", note: "" };
            const num    = entry.score !== "" ? Number(entry.score) : null;
            const valid  = num !== null && num >= 0 && num <= 10;
            const pct    = valid && num !== null ? num * 10 : null;
            return (
              <div key={st.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-[#1e3a8a] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {st.avatar}
                </div>
                <div className="w-32 shrink-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{st.firstName} {st.lastName}</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5 truncate">{st.email}</p>
                </div>
                <input
                  type="text"
                  value={entry.note}
                  onChange={e => onUpdate(st.id, entry.score, e.target.value)}
                  placeholder="Participation note…"
                  className="hidden sm:block flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 placeholder-gray-400 dark:placeholder-slate-600"
                />
                <div className="relative w-20 shrink-0">
                  <input
                    type="number" min={0} max={10}
                    value={entry.score}
                    onChange={e => onUpdate(st.id, e.target.value, entry.note)}
                    placeholder="—"
                    className={`w-full px-3 py-1.5 pr-7 rounded-xl border text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-colors ${
                      entry.score === ""
                        ? "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-400"
                        : valid
                          ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400"
                          : "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/20 text-red-600"
                    }`}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">/10</span>
                </div>
                {pct !== null && valid && (
                  <span className={`shrink-0 text-xs font-black w-8 text-center ${BAND[gradeBand(pct)].text}`}>
                    {letterGrade(pct)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {gradedCount} of {students.length} students scored
          </p>
          {saved ? (
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Saved!
            </div>
          ) : (
            <button type="button" onClick={handleSave} disabled={gradedCount === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Check className="w-4 h-4" /> Save All Grades
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Assignment calendar (due dates) ──────────────────────────────────────────

function AssignmentCalendarView({
  viewedMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  assignments,
  assignmentCompletion,
  onSelectAssignment,
}: {
  viewedMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  assignments: Assignment[];
  assignmentCompletion: Map<string, { graded: number; total: number }>;
  onSelectAssignment: (a: Assignment) => void;
}) {
  const y = viewedMonth.getFullYear();
  const mi = viewedMonth.getMonth();
  const weeks = useMemo(() => buildMonthGrid(y, mi), [y, mi]);
  const title = viewedMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const byDate = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    for (const a of assignments) {
      if (!map.has(a.dueDate)) map.set(a.dueDate, []);
      map.get(a.dueDate)!.push(a);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return map;
  }, [assignments]);

  const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="p-5 border-b border-gray-100 dark:border-slate-800 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-800/40 dark:to-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Due date calendar</p>
          <p className="text-sm text-gray-600 dark:text-slate-400 mt-0.5">
            Each assignment appears on its <span className="font-semibold text-gray-800 dark:text-slate-200">due date</span>. Click to open grading.
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button type="button" onClick={onToday}
            className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 transition-colors">
            Today
          </button>
          <div className="flex items-center rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
            <button type="button" onClick={onPrevMonth} aria-label="Previous month"
              className="p-2 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1.5 text-sm font-bold text-gray-900 dark:text-white min-w-[10rem] text-center tabular-nums">
              {title}
            </span>
            <button type="button" onClick={onNextMonth} aria-label="Next month"
              className="p-2 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-slate-800 bg-gray-50/90 dark:bg-slate-800/80">
          {WEEKDAYS.map((wd) => (
            <div key={wd} className="py-2 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
              {wd}
            </div>
          ))}
        </div>
        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {weeks.map((row, wi) => (
            <div key={wi} className="grid grid-cols-7 divide-x divide-gray-100 dark:divide-slate-800 min-h-[7.5rem]">
              {row.map((dayNum, di) => {
                if (dayNum === null) {
                  return <div key={`e-${wi}-${di}`} className="bg-gray-50/40 dark:bg-slate-900/30" />;
                }
                const iso = isoFromParts(y, mi, dayNum);
                const dayItems = byDate.get(iso) ?? [];
                const isToday = isSameCalendarDay(iso, TODAY);
                const weekend = di >= 5;
                return (
                  <div
                    key={iso}
                    className={`p-1.5 flex flex-col min-h-[7.5rem] ${
                      weekend ? "bg-slate-50/50 dark:bg-slate-800/20" : ""
                    } ${isToday ? "ring-2 ring-inset ring-blue-400 dark:ring-blue-500 bg-blue-50/40 dark:bg-blue-950/20" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1 shrink-0">
                      <span
                        className={`text-[11px] font-bold tabular-nums w-6 h-6 flex items-center justify-center rounded-lg ${
                          isToday
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        {dayNum}
                      </span>
                      {dayItems.length > 0 && (
                        <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 tabular-nums">
                          {dayItems.length}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto max-h-[5.5rem]">
                      {dayItems.map((a) => {
                        const TypeIcon = TYPE_ICON[a.type] ?? FileText;
                        const comp = assignmentCompletion.get(a.id);
                        const done = comp && comp.graded >= comp.total;
                        const draft = a.status === "draft";
                        const overdue = isOverdue(a.dueDate) && a.status === "published";
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => onSelectAssignment(a)}
                            title={`${a.title} · Due ${fmtFull(a.dueDate)} · ${a.points} pts`}
                            className={`text-left rounded-lg px-1.5 py-1 border transition-colors hover:brightness-95 dark:hover:brightness-110 ${
                              draft
                                ? "border-dashed border-gray-300 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-800/50 opacity-90"
                                : done
                                  ? "border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/70 dark:bg-emerald-950/25"
                                    : overdue
                                    ? "border-amber-200 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/15"
                                    : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/80"
                            }`}
                          >
                            <div className="flex items-start gap-1">
                              <TypeIcon className={`w-3 h-3 shrink-0 mt-0.5 ${draft ? "text-gray-400" : "text-current opacity-80"}`} />
                              <span className={`text-[10px] font-semibold leading-snug line-clamp-2 ${draft ? "italic text-gray-500 dark:text-slate-400" : "text-gray-800 dark:text-slate-100"}`}>
                                {a.title}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-0.5 mt-0.5">
                              <span className="text-[9px] font-medium text-gray-500 dark:text-slate-500">{a.points} pts</span>
                              {comp && (
                                <span className={`text-[9px] font-bold tabular-nums ${done ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                                  {done ? "✓" : `${comp.graded}/${comp.total}`}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500" /> Today</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400" /> All graded</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400" /> Past due, not all graded</span>
        <span className="inline-flex items-center gap-1 border border-dashed border-gray-300 dark:border-slate-600 w-3 h-2 rounded-sm" /> Draft
      </p>
    </div>
  );
}

// ─── Per-class gradebook ──────────────────────────────────────────────────────

type GradebookTab = "sheet" | "quick" | "discussions";

function ClassGradebook({ cls }: { cls: Class }) {
  const [search,         setSearch]         = useState("");
  const [filter,         setFilter]         = useState<"all" | "at_risk" | "passing">("all");
  const [sortDir,        setSortDir]        = useState<"asc" | "desc">("asc");
  const [colSort,        setColSort]        = useState<{ id: string; dir: "asc" | "desc" } | null>(null);
  const [bannerExpanded, setBannerExpanded] = useState(false);
  const [selected,       setSelected]       = useState<Student | null>(null);
  const [compose,        setCompose]        = useState<{ student: Student; defaultTarget: "student" | "parent" } | null>(null);
  const [gradebookTab,   setGradebookTab]   = useState<GradebookTab>("sheet");
  const [localGrades,    setLocalGrades]    = useState<Record<string, LocalGrade>>({});
  const [discussionScores, setDiscussionScores] = useState<Record<string, DiscEntry>>({});
  const [gradingCell,    setGradingCell]    = useState<{ student: Student; assignment: Assignment } | null>(null);
  const [showDrafts,     setShowDrafts]     = useState(false);
  const [typeFilter,     setTypeFilter]     = useState<"all" | "Assignment" | "Quiz" | "Exam" | "Project">("all");
  const [groupByWeek,    setGroupByWeek]    = useState(false);
  const [sheetLayout,    setSheetLayout]    = useState<"table" | "calendar">("table");
  const [calendarMonth,  setCalendarMonth]  = useState(() => {
    const d = new Date(TODAY);
    d.setDate(1);
    return d;
  });

  const { students, avg, atRisk, passRate, bandCounts, topStudent } = classSummary(cls);

  const allClassAssignments = useMemo(
    () => ASSIGNMENTS.filter((a) => a.classId === cls.id).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [cls.id]
  );

  const assignments = useMemo(
    () => allClassAssignments.filter((a) =>
      (showDrafts || a.status === "published") &&
      (typeFilter === "all" || a.type === typeFilter)
    ),
    [allClassAssignments, showDrafts, typeFilter]
  );

  const pendingCount = useMemo(() => {
    let count = 0;
    for (const a of assignments) {
      const subs = SUBMISSIONS.filter(s =>
        s.assignmentId === a.id && s.grade === null &&
        s.status !== "Missing" && s.submittedAt !== null
      );
      count += subs.filter(s => !localGrades[`${s.studentId}:${a.id}`]).length;
    }
    return count;
  }, [assignments, localGrades]);

  const getStudentStats = (studentId: string) => {
    const subs = assignments.map((a) => SUB_MAP.get(`${studentId}:${a.id}`));
    return {
      submitted: subs.filter((s) => s && s.status !== "Missing").length,
      missing:   subs.filter((s) => s?.status === "Missing").length,
      graded:    subs.filter((s) => s && s.grade != null).length,
    };
  };

  const effectiveGrade = (studentId: string, assignmentId: string) => {
    const key   = `${studentId}:${assignmentId}`;
    const local = localGrades[key];
    if (local) return { grade: local.score, feedback: local.feedback, retakeGranted: local.retakeGranted ?? false, isLocal: true };
    const sub = SUB_MAP.get(key);
    return sub ? { grade: sub.grade, feedback: sub.feedback, retakeGranted: false, isLocal: false } : null;
  };

  const assignmentAvgs = useMemo(() => {
    const out = new Map<string, number | null>();
    for (const a of assignments) {
      const grades = students.map((st) => {
        const eg = effectiveGrade(st.id, a.id);
        return eg?.grade ?? null;
      }).filter((g): g is number => g != null);
      out.set(a.id, grades.length ? Math.round(grades.reduce((s, g) => s + g, 0) / grades.length) : null);
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments, students, localGrades]);

  // Per-assignment grading completion: how many students have a grade
  const assignmentCompletion = useMemo(() => {
    const out = new Map<string, { graded: number; total: number }>();
    for (const a of assignments) {
      const graded = students.filter((st) => effectiveGrade(st.id, a.id)?.grade != null).length;
      out.set(a.id, { graded, total: students.length });
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments, students, localGrades]);

  // Semester-level summary across allClassAssignments
  const semesterStats = useMemo(() => {
    const pub   = allClassAssignments.filter(a => a.status === "published");
    const draft = allClassAssignments.filter(a => a.status === "draft");
    const totalPts = pub.reduce((s, a) => s + a.points, 0);
    const typeCounts = { Assignment: 0, Quiz: 0, Project: 0, Exam: 0 } as Record<string, number>;
    for (const a of allClassAssignments) typeCounts[a.type] = (typeCounts[a.type] ?? 0) + 1;
    // Count fully-graded assignments (all students have a grade)
    const fullyGraded = pub.filter(a =>
      students.every(st => effectiveGrade(st.id, a.id)?.grade != null)
    ).length;
    return { total: allClassAssignments.length, published: pub.length, draft: draft.length, totalPts, typeCounts, fullyGraded };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allClassAssignments, students, localGrades]);

  const rows = useMemo(() => {
    const q = search.toLowerCase();
    let list = students.filter((s) => {
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchFilter =
        filter === "at_risk" ? s.currentGrade < 70 :
        filter === "passing" ? s.currentGrade >= 70 : true;
      return matchSearch && matchFilter;
    });

    if (colSort) {
      list = [...list].sort((a, b) => {
        const ga = effectiveGrade(a.id, colSort.id)?.grade ?? -1;
        const gb = effectiveGrade(b.id, colSort.id)?.grade ?? -1;
        return colSort.dir === "desc" ? gb - ga : ga - gb;
      });
    } else {
      list = [...list].sort((a, b) =>
        sortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    }
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, search, filter, sortDir, colSort, localGrades]);

  // Group the visible assignments by due-date week for the week-grouped header
  const weekGroups = useMemo(() => {
    const map = new Map<string, Assignment[]>();
    for (const a of assignments) {
      const wk = getWeekMonday(a.dueDate);
      if (!map.has(wk)) map.set(wk, []);
      map.get(wk)!.push(a);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([weekKey, assigns]) => ({ weekKey, assigns }));
  }, [assignments]);

  const toggleColSort = (id: string) => {
    setColSort((prev) => {
      if (!prev || prev.id !== id) return { id, dir: "desc" };
      if (prev.dir === "desc")    return { id, dir: "asc" };
      return null;
    });
  };

  const handleGrade = (
    studentId: string, assignmentId: string,
    score: number, feedback: string, retake: boolean,
    gradingMode: "points" | "rubric" = "points",
    rubricScores?: Record<string, number>
  ) => {
    setLocalGrades(prev => ({
      ...prev,
      [`${studentId}:${assignmentId}`]: { score, feedback, retakeGranted: retake, gradingMode, rubricScores },
    }));
  };

  const TABS: { id: GradebookTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "sheet",       label: "Grade Sheet",  icon: LayoutGrid },
    { id: "quick",       label: "Quick Grade",  icon: Zap,       badge: pendingCount },
    { id: "discussions", label: "Discussions",  icon: MessageSquare },
  ];

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Class Average</p>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black tabular-nums text-gray-900 dark:text-white leading-none">{avg}%</p>
            <span className={`text-sm font-bold mb-0.5 ${BAND[gradeBand(avg)].text}`}>{letterGrade(avg)}</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{students.length} students</p>
          <div className="mt-3 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${BAND[gradeBand(avg)].bar}`} style={{ width: `${avg}%` }} />
          </div>
          <div className="mt-2.5 flex h-2 rounded-full overflow-hidden gap-px">
            {(["A","B","C","D","F"] as Band[]).map((band) => {
              const p = students.length > 0 ? (bandCounts[band] / students.length) * 100 : 0;
              return p > 0 ? (
                <div key={band} className={`${BAND[band].bar} opacity-80`} style={{ width: `${p}%` }} title={`${band}: ${bandCounts[band]}`} />
              ) : null;
            })}
          </div>
          <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
            {(["A","B","C","D","F"] as Band[]).map((band) => bandCounts[band] > 0 ? (
              <span key={band} className={`text-[10px] font-bold ${BAND[band].text}`}>{band}<span className="font-normal text-gray-400 dark:text-slate-500 ml-0.5">×{bandCounts[band]}</span></span>
            ) : null)}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Top Student</p>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{topStudent?.firstName} {topStudent?.lastName}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {topStudent?.currentGrade}% · {letterGrade(topStudent?.currentGrade ?? 0)}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">At Risk</p>
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-black tabular-nums text-red-600 dark:text-red-400">{atRisk.length}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">students below 70%</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Passing Rate</p>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <p className="text-3xl font-black tabular-nums text-gray-900 dark:text-white">{passRate}%</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{students.filter(s => s.currentGrade >= 70).length} of {students.length} passing</p>
          <div className="mt-3 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-teal-500" style={{ width: `${passRate}%` }} />
          </div>
        </div>
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-gray-100/80 dark:bg-slate-800/80 rounded-2xl p-1.5 border border-gray-200 dark:border-slate-700">
        {TABS.map(({ id, label, icon: Icon, badge }) => (
          <button key={id} type="button" onClick={() => setGradebookTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
              gradebookTab === id
                ? "bg-white dark:bg-slate-900 text-[#1e3a8a] dark:text-blue-400 shadow-sm border border-gray-200 dark:border-slate-700"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-slate-700/40"
            }`}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
            {badge != null && badge > 0 && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                gradebookTab === id
                  ? "bg-amber-500 text-white"
                  : "bg-amber-500 text-white"
              }`}>{badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Grade Sheet tab ──────────────────────────────────────────────────── */}
      {gradebookTab === "sheet" && (
        <>
          {/* At-risk banner */}
          {atRisk.length > 0 && (
            <div className="rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/10 overflow-hidden shadow-sm">
              <button type="button" onClick={() => setBannerExpanded((v) => !v)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50/80 dark:hover:bg-red-950/20 transition-colors text-left">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-red-800 dark:text-red-300">
                    {atRisk.length} student{atRisk.length > 1 ? "s" : ""} at risk
                    <span className="font-normal ml-1 text-red-600/70 dark:text-red-400/70">· below 70%</span>
                  </p>
                  <p className="text-xs text-red-700/60 dark:text-red-400/60 mt-0.5 truncate">
                    {atRisk.map((s) => `${s.firstName} ${s.lastName} (${s.currentGrade}%)`).join(" · ")}
                  </p>
                </div>
                <span className="text-xs font-semibold text-red-600 dark:text-red-400 shrink-0 flex items-center gap-1 bg-red-100 dark:bg-red-950/40 px-3 py-1.5 rounded-xl">
                  {bannerExpanded ? "Hide" : "View all"}
                  {bannerExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </span>
              </button>
              {bannerExpanded && (
                <div className="border-t border-red-200 dark:border-red-800/40 divide-y divide-red-100 dark:divide-red-900/30">
                  {atRisk.map((st) => {
                    const stats = getStudentStats(st.id);
                    return (
                      <div key={st.id} className="flex items-center gap-3 px-4 py-3 bg-white/60 dark:bg-slate-900/40">
                        <div className="w-9 h-9 rounded-xl bg-red-500 text-white text-xs font-bold flex items-center justify-center shrink-0">{st.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{st.firstName} {st.lastName}</p>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            <span className="text-xs font-bold text-red-600 dark:text-red-400">{st.currentGrade}% · {letterGrade(st.currentGrade)}</span>
                            <span className="text-[11px] text-gray-400 dark:text-slate-500">{stats.missing} missing · {stats.graded} graded</span>
                          </div>
                        </div>
                        <div className="w-16 hidden sm:block">
                          <div className="h-1.5 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${st.currentGrade}%` }} />
                          </div>
                          <p className="text-[10px] text-center text-gray-400 mt-0.5">{st.currentGrade}/100</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button type="button" onClick={() => setSelected(st)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-800/60 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                            View Profile
                          </button>
                          <button type="button" onClick={() => setCompose({ student: st, defaultTarget: "student" })}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                            <Mail className="w-3 h-3" /> Message
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Grade sheet */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="border-b border-gray-100 dark:border-slate-800">

              {/* ── Semester summary strip ───────────────────────────────────── */}
              <div className="flex items-center gap-0 border-b border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/50 px-5 py-2.5 overflow-x-auto">
                <div className="flex items-center gap-4 flex-none mr-auto">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {semesterStats.fullyGraded}<span className="font-normal text-gray-400 dark:text-slate-500">/{semesterStats.published} fully graded</span>
                    </span>
                  </div>
                  <div className="w-px h-3.5 bg-gray-200 dark:bg-slate-700" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{semesterStats.totalPts}</span> total pts
                  </span>
                  <div className="w-px h-3.5 bg-gray-200 dark:bg-slate-700" />
                  <div className="flex items-center gap-2">
                    {(["Assignment","Quiz","Project","Exam"] as const).filter(t => semesterStats.typeCounts[t] > 0).map(t => {
                      const TIcon = TYPE_ICON[t] ?? FileText;
                      return (
                        <span key={t} className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${TYPE_COLOR[t]}`}>
                          <TIcon className="w-2.5 h-2.5" />{semesterStats.typeCounts[t]}
                        </span>
                      );
                    })}
                  </div>
                  {semesterStats.draft > 0 && (
                    <>
                      <div className="w-px h-3.5 bg-gray-200 dark:bg-slate-700" />
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500">
                        {semesterStats.draft} draft{semesterStats.draft !== 1 ? "s" : ""} hidden
                      </span>
                    </>
                  )}
                </div>
                {/* Grading progress bar */}
                <div className="flex items-center gap-2 flex-none ml-4">
                  <div className="w-32 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${semesterStats.published > 0 ? Math.round((semesterStats.fullyGraded / semesterStats.published) * 100) : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 whitespace-nowrap">
                    {semesterStats.published > 0 ? Math.round((semesterStats.fullyGraded / semesterStats.published) * 100) : 0}% done
                  </span>
                </div>
              </div>

              {/* ── Main toolbar row ─────────────────────────────────────────── */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Grade Sheet</h3>
                  <div className="flex items-center rounded-xl p-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                    <button type="button" onClick={() => setSheetLayout("table")}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                        sheetLayout === "table"
                          ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-gray-200"
                      }`}>
                      <LayoutGrid className="w-3.5 h-3.5" /> Table
                    </button>
                    <button type="button" onClick={() => setSheetLayout("calendar")}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                        sheetLayout === "calendar"
                          ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-gray-200"
                      }`}>
                      <Calendar className="w-3.5 h-3.5" /> Calendar
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-slate-500">
                    {rows.length} student{rows.length !== 1 ? "s" : ""} · {assignments.length} assignment{assignments.length !== 1 ? "s" : ""}
                  </span>
                  {sheetLayout === "table" ? (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded-lg">
                      <Pencil className="w-2.5 h-2.5" /> Click any cell to grade
                    </span>
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 rounded-lg">
                      <CalendarDays className="w-2.5 h-2.5" /> Due dates on the grid — click an item to grade
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Student filter */}
                  <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-0.5 border border-gray-200 dark:border-slate-700">
                    {(["all", "passing", "at_risk"] as const).map((f) => (
                      <button key={f} type="button" onClick={() => setFilter(f)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap ${
                          filter === f
                            ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}>
                        {f === "at_risk" ? "⚠ At Risk" : f === "passing" ? "Passing" : "All"}
                      </button>
                    ))}
                  </div>
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search students…"
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 w-36 shadow-sm transition-colors" />
                  </div>
                  <Link href={`/lis/teacher/courses/${cls.id}/grades`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 transition-colors">
                    <ExternalLink className="w-3 h-3" /> Full View
                  </Link>
                </div>
              </div>

              {/* ── Assignment type + drafts filter row ──────────────────────── */}
              <div className="flex items-center gap-2 px-5 pb-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 shrink-0">Filter:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {(["all", "Assignment", "Quiz", "Project", "Exam"] as const).map((t) => {
                    const isActive = typeFilter === t;
                    if (t === "all") return (
                      <button key={t} type="button" onClick={() => setTypeFilter("all")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                          isActive
                            ? "bg-[#1e3a8a] border-[#1e3a8a] text-white"
                            : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                        }`}>
                        All types
                      </button>
                    );
                    const TIcon = TYPE_ICON[t] ?? FileText;
                    const count = semesterStats.typeCounts[t] ?? 0;
                    if (count === 0) return null;
                    return (
                      <button key={t} type="button" onClick={() => setTypeFilter(t)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                          isActive
                            ? `${TYPE_COLOR[t]} border-transparent`
                            : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                        }`}>
                        <TIcon className="w-3 h-3" /> {t} <span className="opacity-60">({count})</span>
                      </button>
                    );
                  })}
                </div>
                <div className="h-4 w-px bg-gray-200 dark:bg-slate-700 mx-1" />
                {/* Include Drafts toggle */}
                <button type="button" onClick={() => setShowDrafts(v => !v)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                    showDrafts
                      ? "bg-slate-700 dark:bg-slate-600 border-slate-700 dark:border-slate-500 text-white"
                      : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
                  }`}>
                  <FileText className="w-3 h-3" />
                  {showDrafts ? "Drafts shown" : "Show drafts"}
                  {semesterStats.draft > 0 && (
                    <span className={`px-1 rounded text-[9px] font-bold ${showDrafts ? "bg-white/20" : "bg-gray-100 dark:bg-slate-800 text-gray-500"}`}>
                      {semesterStats.draft}
                    </span>
                  )}
                </button>
                {/* Group by week toggle (table only — calendar already shows dates) */}
                {sheetLayout === "table" && (
                  <button type="button" onClick={() => setGroupByWeek(v => !v)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors border ${
                      groupByWeek
                        ? "bg-[#1e3a8a] border-[#1e3a8a] text-white"
                        : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}>
                    <CalendarDays className="w-3 h-3" />
                    {groupByWeek ? "By week ✓" : "Group by week"}
                    {groupByWeek && (
                      <span className="text-[9px] font-bold bg-white/20 px-1 rounded">
                        {weekGroups.length}w
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {sheetLayout === "calendar" && (
              <AssignmentCalendarView
                viewedMonth={calendarMonth}
                onPrevMonth={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                onNextMonth={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                onToday={() => {
                  const t = new Date(TODAY);
                  setCalendarMonth(new Date(t.getFullYear(), t.getMonth(), 1));
                }}
                assignments={assignments}
                assignmentCompletion={assignmentCompletion}
                onSelectAssignment={(a) => {
                  const st = rows[0] ?? students[0];
                  if (st) setGradingCell({ student: st, assignment: a });
                }}
              />
            )}

            {sheetLayout === "table" && (
            <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: `${Math.max(600, 200 + assignments.length * 120)}px` }}>
                <thead>
                  {/* ── Week group header row (only when groupByWeek) ─────── */}
                  {groupByWeek && (
                    <tr className="border-b border-gray-200 dark:border-slate-700">
                      <th className="sticky left-0 z-20 bg-gray-50 dark:bg-slate-800 border-r border-gray-100 dark:border-slate-800 min-w-[200px]"
                        rowSpan={2}>
                        {/* Student header spans both rows */}
                        <div className="py-3 px-5 text-left">
                          <button type="button" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}
                            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                            <Users className="w-3 h-3" />
                            Student
                            {sortDir === "asc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                          </button>
                        </div>
                      </th>
                      {weekGroups.map(({ weekKey, assigns }, wi) => {
                        const col = WEEK_COLORS[wi % WEEK_COLORS.length];
                        const weekPts = assigns.reduce((s, a) => s + a.points, 0);
                        return (
                          <th key={weekKey} colSpan={assigns.length}
                            className={`text-center px-3 py-2 border-r border-gray-200 dark:border-slate-700 ${col.bg}`}>
                            <div className={`flex items-center justify-center gap-2 flex-wrap`}>
                              <span className={`text-xs font-bold ${col.text}`}>
                                {fmtWeekRange(weekKey)}
                              </span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-white/60 dark:bg-black/20 ${col.text}`}>
                                {assigns.length} item{assigns.length !== 1 ? "s" : ""} · {weekPts} pts
                              </span>
                            </div>
                          </th>
                        );
                      })}
                      <th className="sticky right-0 z-20 bg-gray-50 dark:bg-slate-800 border-l border-gray-100 dark:border-slate-800 min-w-[110px]"
                        rowSpan={2}>
                        <div className="py-3 px-5 text-center">
                          <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide block">Overall</span>
                          <span className="text-[9px] font-normal normal-case text-gray-400 dark:text-slate-600">Current grade</span>
                        </div>
                      </th>
                    </tr>
                  )}

                  {/* ── Assignment column headers ────────────────────────── */}
                  <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/60">
                    {!groupByWeek && (
                      <th className="sticky left-0 z-20 bg-gray-50 dark:bg-slate-800 text-left py-3 px-5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide border-r border-gray-100 dark:border-slate-800 min-w-[200px]">
                        <button type="button" onClick={() => setSortDir((d) => d === "asc" ? "desc" : "asc")}
                          className="flex items-center gap-1.5 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                          <Users className="w-3 h-3" />
                          Student
                          {sortDir === "asc" ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                        </button>
                      </th>
                    )}
                    {assignments.map((a) => {
                      const TypeIcon     = TYPE_ICON[a.type] ?? FileText;
                      const isActive     = colSort?.id === a.id;
                      const overdue      = isOverdue(a.dueDate);
                      const isQuizOrExam = a.type === "Quiz" || a.type === "Exam";
                      const isDraft      = a.status === "draft";
                      const completion   = assignmentCompletion.get(a.id) ?? { graded: 0, total: students.length };
                      const completionPct = completion.total > 0
                        ? Math.round((completion.graded / completion.total) * 100) : 0;
                      const fullyGraded  = completionPct === 100 && completion.total > 0;
                      return (
                        <th key={a.id}
                          className={`text-center py-3 px-2 text-xs font-semibold cursor-pointer select-none transition-colors group/th ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
                              : isDraft
                                ? "bg-slate-50 dark:bg-slate-800/80 text-gray-400 dark:text-slate-500"
                                : fullyGraded
                                  ? "bg-emerald-50/40 dark:bg-emerald-950/10 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/20"
                                  : "text-gray-500 dark:text-slate-400 hover:bg-gray-100/80 dark:hover:bg-slate-700/50"
                          }`}
                          title={`Due: ${fmtFull(a.dueDate)} · ${a.points} pts${isDraft ? " · DRAFT" : ""}`}
                          onClick={() => toggleColSort(a.id)}>
                          <div className="flex flex-col items-center gap-1.5 min-w-[110px]">
                            {/* Type pill + sort indicator + draft tag */}
                            <div className="flex items-center gap-1 flex-wrap justify-center">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${isDraft ? "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400" : TYPE_COLOR[a.type]}`}>
                                <TypeIcon className="w-2.5 h-2.5 shrink-0" />
                                {a.type}
                              </span>
                              {isDraft && (
                                <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                                  Draft
                                </span>
                              )}
                              {isActive
                                ? (colSort!.dir === "desc"
                                    ? <ChevronDown className="w-3 h-3 text-blue-500" />
                                    : <ChevronUp   className="w-3 h-3 text-blue-500" />)
                                : <ChevronDown className="w-3 h-3 text-gray-300 dark:text-slate-600 opacity-0 group-hover/th:opacity-100 transition-opacity" />
                              }
                            </div>
                            {/* Title */}
                            <span className={`line-clamp-2 text-center leading-snug text-[11px] font-semibold max-w-[108px] ${
                              isDraft ? "text-gray-400 dark:text-slate-500 italic" :
                              isActive ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                            }`}>
                              {a.title}
                            </span>
                            {/* Points + Due date */}
                            <div className="flex items-center gap-1 text-[10px]">
                              <span className={`font-semibold ${isDraft ? "text-gray-400 dark:text-slate-600" : "text-gray-400 dark:text-slate-500"}`}>{a.points} pts</span>
                              <span className="text-gray-300 dark:text-slate-700">·</span>
                              <span className={`font-semibold ${overdue && !isDraft ? "text-red-500 dark:text-red-400" : "text-gray-400 dark:text-slate-500"}`}>
                                {fmtShort(a.dueDate)}
                              </span>
                              {overdue && !isDraft && <AlertCircle className="w-2.5 h-2.5 text-red-400 dark:text-red-500 shrink-0" />}
                            </div>
                            {isQuizOrExam && !isDraft && (
                              <span className="text-[9px] font-bold text-violet-500 dark:text-violet-400 flex items-center gap-0.5 bg-violet-50 dark:bg-violet-950/30 px-1.5 py-0.5 rounded-md">
                                <RefreshCw className="w-2 h-2" /> Retake
                              </span>
                            )}
                            {/* Grading completion bar */}
                            {!isDraft && (
                              <div className="w-full px-1 mt-0.5">
                                <div className="h-1 bg-gray-150 dark:bg-slate-700/60 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700">
                                  <div
                                    className={`h-full rounded-full transition-all ${fullyGraded ? "bg-emerald-500" : completionPct > 0 ? "bg-amber-400" : "bg-gray-200 dark:bg-slate-600"}`}
                                    style={{ width: `${completionPct}%` }}
                                  />
                                </div>
                                <p className={`text-[9px] text-center mt-0.5 font-semibold ${
                                  fullyGraded ? "text-emerald-600 dark:text-emerald-400" :
                                  completionPct > 0 ? "text-amber-600 dark:text-amber-400" :
                                  "text-gray-400 dark:text-slate-500"
                                }`}>
                                  {fullyGraded
                                    ? "✓ All graded"
                                    : `${completion.graded}/${completion.total} graded`}
                                </p>
                              </div>
                            )}
                          </div>
                        </th>
                      );
                    })}
                    {!groupByWeek && (
                      <th className="sticky right-0 z-20 bg-gray-50 dark:bg-slate-800 text-center py-3 px-5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide border-l border-gray-100 dark:border-slate-800 min-w-[110px]">
                        <div className="flex flex-col items-center gap-0.5">
                          <span>Overall</span>
                          <span className="text-[9px] font-normal normal-case text-gray-400 dark:text-slate-600">Current grade</span>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
                  {rows.map((st) => {
                    const isRisk = st.currentGrade < 70;
                    return (
                      <tr key={st.id}
                        className={`group hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors ${isRisk ? "bg-red-50/20 dark:bg-red-950/5" : ""}`}>
                        <td className={`sticky left-0 z-10 py-3.5 px-5 border-r border-gray-100 dark:border-slate-800 ${isRisk ? "bg-red-50/30 dark:bg-red-950/10 group-hover:bg-red-50/50" : "bg-white dark:bg-slate-900 group-hover:bg-gray-50/80 dark:group-hover:bg-slate-800/40"}`}>
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl text-white text-xs font-bold flex items-center justify-center shrink-0 ${isRisk ? "bg-red-500" : "bg-[#1e3a8a]"}`}>
                              {st.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">{st.firstName} {st.lastName}</p>
                              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">{st.email}</p>
                            </div>
                            {isRisk && <AlertTriangle className="w-3.5 h-3.5 text-red-500 ml-auto shrink-0" />}
                          </div>
                        </td>

                        {assignments.map((a) => {
                          const sub      = SUB_MAP.get(`${st.id}:${a.id}`);
                          const eg       = effectiveGrade(st.id, a.id);
                          const grade    = eg?.grade ?? null;
                          const pct      = grade != null ? Math.round((grade / a.points) * 100) : null;
                          const isLocal  = eg?.isLocal ?? false;
                          const retakeGranted = eg?.retakeGranted ?? false;
                          const late     = sub?.submittedAt && isOverdue(a.dueDate) && sub.status !== "Missing";
                          const canClick = true;

                          const cellBase = `py-3.5 px-3 text-center transition-colors cursor-pointer group/cell ${canClick ? "hover:bg-blue-50/60 dark:hover:bg-blue-950/10" : ""}`;

                          if (!sub && !isLocal) return (
                            <td key={a.id} className={cellBase}
                              onClick={() => setGradingCell({ student: st, assignment: a })}>
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-gray-200 dark:text-slate-700 text-base select-none font-light">—</span>
                                <span className="text-[9px] text-blue-500 dark:text-blue-400 opacity-0 group-hover/cell:opacity-100 transition-opacity flex items-center gap-0.5 font-semibold">
                                  <Pencil className="w-2 h-2" /> Add grade
                                </span>
                              </div>
                            </td>
                          );

                          if (!isLocal && sub?.status === "Missing") return (
                            <td key={a.id} className={`${cellBase} bg-red-50/30 dark:bg-red-950/5`}
                              title={`Due: ${fmtFull(a.dueDate)}`}
                              onClick={() => setGradingCell({ student: st, assignment: a })}>
                              <div className="flex flex-col items-center gap-1">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_CHIP.Missing}`}>
                                  <AlertCircle className="w-2.5 h-2.5" /> Missing
                                </span>
                                <span className="text-[9px] text-blue-500 dark:text-blue-400 opacity-0 group-hover/cell:opacity-100 transition-opacity flex items-center gap-0.5 font-semibold">
                                  <Pencil className="w-2 h-2" /> Override
                                </span>
                              </div>
                            </td>
                          );

                          if (!isLocal && grade == null) return (
                            <td key={a.id} className={`${cellBase} bg-amber-50/20 dark:bg-amber-950/5`}
                              title={sub?.submittedAt ? `Submitted: ${fmtFull(sub.submittedAt)}` : undefined}
                              onClick={() => setGradingCell({ student: st, assignment: a })}>
                              <div className="flex flex-col items-center gap-1.5">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${sub?.status === "Late" ? STATUS_CHIP.Late : STATUS_CHIP.Submitted}`}>
                                  <Clock className="w-2.5 h-2.5" /> {sub?.status === "Late" ? "Late" : "To Grade"}
                                </span>
                                {sub?.submittedAt && (
                                  <span className="text-[9px] text-gray-400 dark:text-slate-600 flex items-center gap-0.5">
                                    {fmtShort(sub.submittedAt)}
                                  </span>
                                )}
                                <span className="text-[9px] text-blue-500 dark:text-blue-400 opacity-0 group-hover/cell:opacity-100 transition-opacity flex items-center gap-0.5 font-semibold">
                                  <Pencil className="w-2 h-2" /> Grade now
                                </span>
                              </div>
                            </td>
                          );

                          return (
                            <td key={a.id} className={cellBase}
                              title={`${grade}/${a.points} pts${sub?.feedback ? ` · ${sub.feedback}` : ""}`}
                              onClick={() => setGradingCell({ student: st, assignment: a })}>
                              <div className="flex flex-col items-center gap-0.5">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ring-1 ring-inset ${BAND[gradeBand(pct!)].badge} ${isLocal ? "ring-2 ring-blue-400 dark:ring-blue-500" : ""}`}>
                                  {grade}/{a.points}
                                </span>
                                <span className={`text-[10px] font-semibold ${BAND[gradeBand(pct!)].text}`}>
                                  {pct}%
                                </span>
                                {retakeGranted && (
                                  <span className="text-[9px] font-bold text-violet-500 dark:text-violet-400 flex items-center gap-0.5 mt-0.5">
                                    <RefreshCw className="w-2 h-2" /> Retake
                                  </span>
                                )}
                                {late && !retakeGranted && (
                                  <span className="text-[9px] font-semibold text-orange-500 dark:text-orange-400 mt-0.5">
                                    Late
                                  </span>
                                )}
                                <span className="text-[9px] text-blue-500 dark:text-blue-400 opacity-0 group-hover/cell:opacity-100 transition-opacity flex items-center gap-0.5 font-semibold mt-0.5">
                                  <Pencil className="w-2 h-2" /> Edit
                                </span>
                              </div>
                            </td>
                          );
                        })}

                        <td className={`sticky right-0 z-10 py-3.5 px-5 text-center border-l border-gray-100 dark:border-slate-800 ${isRisk ? "bg-red-50/30 dark:bg-red-950/10 group-hover:bg-red-50/50" : "bg-white dark:bg-slate-900 group-hover:bg-gray-50/80 dark:group-hover:bg-slate-800/40"}`}>
                          <div className="flex flex-col items-center gap-1">
                            <GradeBadge pct={st.currentGrade} />
                            <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">{letterGrade(st.currentGrade)}</span>
                            <div className="w-12 h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full ${BAND[gradeBand(st.currentGrade)].bar} rounded-full`} style={{ width: `${st.currentGrade}%` }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={assignments.length + 2} className="py-12 text-center">
                        <Search className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-400 dark:text-slate-500">No students match your filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>

                {rows.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60">
                      <td className="sticky left-0 z-10 bg-gray-50 dark:bg-slate-800 py-3.5 px-5 border-r border-gray-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                          <BarChart3 className="w-3.5 h-3.5 text-blue-500" /> Class Avg
                        </p>
                      </td>
                      {assignments.map((a) => {
                        const aAvg = assignmentAvgs.get(a.id);
                        const pct  = aAvg != null ? Math.round((aAvg / a.points) * 100) : null;
                        return (
                          <td key={a.id} className="py-3.5 px-3 text-center">
                            {aAvg != null
                              ? <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ring-1 ring-inset ${BAND[gradeBand(pct!)].badge}`}>{aAvg}/{a.points}</span>
                              : <span className="text-gray-300 dark:text-slate-700">—</span>}
                          </td>
                        );
                      })}
                      <td className="sticky right-0 z-10 bg-gray-50 dark:bg-slate-800 py-3.5 px-5 text-center border-l border-gray-200 dark:border-slate-700">
                        <div className="flex flex-col items-center gap-1">
                          <GradeBadge pct={avg} />
                          <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400">{letterGrade(avg)}</span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Legend */}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide shrink-0">Legend</span>
              {[
                { label: "Graded",         el: <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ring-1 ring-inset ${BAND.A.badge}`}>10/10</span> },
                { label: "Locally saved",  el: <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ring-2 ring-blue-400 dark:ring-blue-500 ${BAND.A.badge}`}>10/10</span> },
                { label: "Needs grading",  el: <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_CHIP.Submitted}`}><Clock className="w-2.5 h-2.5" /> To Grade</span> },
                { label: "Missing",        el: <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${STATUS_CHIP.Missing}`}><AlertCircle className="w-2.5 h-2.5" /> Missing</span> },
                { label: "Retake granted", el: <span className="text-[9px] font-bold text-violet-500 flex items-center gap-0.5 bg-violet-50 dark:bg-violet-950/30 px-1.5 py-0.5 rounded-md"><RefreshCw className="w-2.5 h-2.5" /> Retake</span> },
                { label: "Not assigned",   el: <span className="text-gray-200 dark:text-slate-700 text-sm font-light">—</span> },
              ].map(({ label, el }) => (
                <div key={label} className="flex items-center gap-1.5">
                  {el}
                  <span className="text-[10px] text-gray-500 dark:text-slate-400">{label}</span>
                </div>
              ))}
            </div>
            </>
            )}
          </div>
        </>
      )}

      {/* ── Quick Grade tab ──────────────────────────────────────────────────── */}
      {gradebookTab === "quick" && (
        <QuickGrade cls={cls} localGrades={localGrades} onGrade={handleGrade} />
      )}

      {/* ── Discussions tab ──────────────────────────────────────────────────── */}
      {gradebookTab === "discussions" && (
        <DiscussionGrading
          cls={cls}
          scores={discussionScores}
          onUpdate={(id, score, note) => setDiscussionScores(prev => ({ ...prev, [id]: { score, note } }))}
          onSaveAll={() => {}}
        />
      )}

      {/* ── Grade Entry Modal ────────────────────────────────────────────────── */}
      {gradingCell && (() => {
        const key      = `${gradingCell.student.id}:${gradingCell.assignment.id}`;
        const local    = localGrades[key] ?? null;
        const origSub  = SUB_MAP.get(key);
        const origGrade = local?.score ?? origSub?.grade ?? null;
        return (
          <GradeEntryModal
            student={gradingCell.student}
            assignment={gradingCell.assignment}
            existing={local}
            originalGrade={origGrade}
            onSave={(score, feedback, retake, mode, rScores) =>
              handleGrade(gradingCell.student.id, gradingCell.assignment.id, score, feedback, retake, mode, rScores)
            }
            onClose={() => setGradingCell(null)}
          />
        );
      })()}

      {/* ── Student Profile Modal ─────────────────────────────────────────── */}
      {selected && (() => {
        const stats = getStudentStats(selected.id);
        return (
          <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Student Profile" size="lg">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1e3a8a] text-white text-lg font-black flex items-center justify-center shrink-0">
                  {selected.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selected.firstName} {selected.lastName}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <AtSign className="w-3.5 h-3.5" /> {selected.email}
                    </span>
                    {selected.phone && (
                      <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="w-3.5 h-3.5" /> {selected.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-4 p-4 rounded-2xl ring-1 ring-inset ${BAND[gradeBand(selected.currentGrade)].badge}`}>
                <div>
                  <p className="text-3xl font-black tabular-nums">{selected.currentGrade}%</p>
                  <p className="text-sm font-bold mt-0.5">{letterGrade(selected.currentGrade)} · Current Grade</p>
                </div>
                <div className="ml-auto">
                  {selected.currentGrade >= 70
                    ? <TrendingUp className="w-8 h-8 opacity-50" />
                    : <TrendingDown className="w-8 h-8 opacity-50" />}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Submitted", value: stats.submitted, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
                  { label: "Missing",   value: stats.missing,   icon: AlertCircle,  color: "text-red-600 bg-red-50 dark:bg-red-950/40" },
                  { label: "Graded",    value: stats.graded,    icon: BookOpen,     color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-gray-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 ${color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-gray-900 dark:text-white tabular-nums">{value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-2">Activity Summary</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selected.activitySummary}</p>
              </div>

              <div className="rounded-2xl border border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-950/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-violet-100 dark:border-violet-800/30">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400 flex items-center gap-2">
                    <UserCircle className="w-3.5 h-3.5" /> Parent / Guardian Contact
                  </p>
                </div>
                <div className="px-4 py-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {selected.parentName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{selected.parentName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{selected.parentRelation}</p>
                    </div>
                    <button type="button"
                      onClick={() => { setCompose({ student: selected, defaultTarget: "parent" }); setSelected(null); }}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-violet-200 dark:border-violet-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors">
                      <Send className="w-3 h-3" /> Message
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <ContactRow icon={Mail} label="Email" value={selected.parentEmail}
                      action={() => { setCompose({ student: selected, defaultTarget: "parent" }); setSelected(null); }}
                      actionLabel="Send Message" />
                    <ContactRow icon={Phone} label="Phone" value={selected.parentPhone} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-blue-100 dark:border-blue-800/30">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <AtSign className="w-3.5 h-3.5" /> Student Contact
                  </p>
                </div>
                <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <ContactRow icon={Mail} label="School Email" value={selected.email}
                    action={() => { setCompose({ student: selected, defaultTarget: "student" }); setSelected(null); }}
                    actionLabel="Send Message" />
                  {selected.phone && <ContactRow icon={Phone} label="Phone" value={selected.phone} />}
                </div>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* ── Compose Modal ─────────────────────────────────────────────────── */}
      {compose && (
        <ComposeModal
          isOpen={!!compose}
          onClose={() => setCompose(null)}
          student={compose.student}
          defaultTarget={compose.defaultTarget}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GradebookPage() {
  const [activeClass, setActiveClass] = useState<string | "all">("all");
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const totalStudents  = STUDENTS.length;
  const overallAvg     = totalStudents ? Math.round(STUDENTS.reduce((s, st) => s + st.currentGrade, 0) / totalStudents) : 0;
  const totalAtRisk    = STUDENTS.filter((s) => s.currentGrade < 70).length;
  const totalPassing   = STUDENTS.filter((s) => s.currentGrade >= 70).length;
  const overallPass    = totalStudents ? Math.round((totalPassing / totalStudents) * 100) : 0;

  const activeClassObj = CLASSES.find((c) => c.id === activeClass);

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Gradebook</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {CLASSES.length} classes &middot; {totalStudents} students &middot; overall avg {overallAvg}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/lis/teacher/grading"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-colors shrink-0">
            <GraduationCap className="w-4 h-4" /> Grading Queue
          </Link>
          <button type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-colors shrink-0">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </div>

      {/* ── Global stat cards ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Total Students</p>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-black tabular-nums text-gray-900 dark:text-white">{totalStudents}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">{CLASSES.length} classes</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Overall Average</p>
            <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black tabular-nums text-gray-900 dark:text-white leading-none">{overallAvg}%</p>
            <span className={`text-sm font-bold mb-0.5 ${BAND[gradeBand(overallAvg)].text}`}>{letterGrade(overallAvg)}</span>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${BAND[gradeBand(overallAvg)].bar}`} style={{ width: `${overallAvg}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">At Risk</p>
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
            </div>
          </div>
          <p className={`text-3xl font-black tabular-nums ${totalAtRisk > 0 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}>{totalAtRisk}</p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">below 70% threshold</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Passing Rate</p>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black tabular-nums text-gray-900 dark:text-white leading-none">{overallPass}%</p>
            <span className="text-xs text-gray-400 dark:text-slate-500 mb-0.5">{totalPassing}/{totalStudents}</span>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${overallPass}%` }} />
          </div>
        </div>
      </div>

      {/* ── Class selector tabs ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={() => setActiveClass("all")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
            activeClass === "all"
              ? "bg-[#1e3a8a] border-[#1e3a8a] text-white shadow-sm"
              : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700"
          }`}>
          <LayoutGrid className="w-4 h-4" />
          All Classes
        </button>
        {CLASSES.map((c) => {
          const { avg, atRisk } = classSummary(c);
          const isActive = activeClass === c.id;
          return (
            <button key={c.id} type="button" onClick={() => setActiveClass(c.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                isActive
                  ? "text-white border-transparent shadow-sm"
                  : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
              }`}
              style={isActive ? { backgroundColor: c.color, borderColor: c.color } : undefined}>
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? "bg-white/40" : ""}`}
                style={!isActive ? { backgroundColor: c.color } : undefined} />
              {c.name}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400"}`}>
                {avg}%
              </span>
              {atRisk.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? "bg-red-400/40 text-white" : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"}`}>
                  {atRisk.length} risk
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── All-classes overview grid ─────────────────────────────────────── */}
      {activeClass === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {CLASSES.map((c) => (
            <ClassSummaryCard key={c.id} cls={c} onClick={() => setActiveClass(c.id)} />
          ))}
        </div>
      )}

      {/* ── Per-class gradebook ───────────────────────────────────────────── */}
      {activeClassObj && <ClassGradebook key={activeClassObj.id} cls={activeClassObj} />}

    </div>
  );
}
