"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  getStudentsByClass, getAssignmentsByClass, SUBMISSIONS,
  Student, Assignment,
} from "@/data/teacher-mock-data";
import { Modal } from "@/components/ui/modal";
import {
  BarChart3, TrendingUp, TrendingDown, Search, Download,
  AlertTriangle, Award, Users, CheckCircle2, Clock,
  AlertCircle, ChevronDown, ChevronUp, ChevronRight,
  Mail, Phone, Send, MessageSquare, UserCircle, AtSign, BookOpen, X,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function letterGrade(pct: number) {
  if (pct >= 97) return "A+"; if (pct >= 93) return "A"; if (pct >= 90) return "A−";
  if (pct >= 87) return "B+"; if (pct >= 83) return "B"; if (pct >= 80) return "B−";
  if (pct >= 77) return "C+"; if (pct >= 73) return "C"; if (pct >= 70) return "C−";
  if (pct >= 60) return "D"; return "F";
}

function gradeBand(pct: number): "A" | "B" | "C" | "D" | "F" {
  if (pct >= 90) return "A"; if (pct >= 80) return "B";
  if (pct >= 70) return "C"; if (pct >= 60) return "D"; return "F";
}

const BAND_CONFIG = {
  A: { label: "A  (90–100%)", bar: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40" },
  B: { label: "B  (80–89%)",  bar: "bg-blue-500",    badge: "bg-blue-50   text-blue-700   ring-blue-200   dark:bg-blue-950/40   dark:text-blue-400   dark:ring-blue-800/40" },
  C: { label: "C  (70–79%)",  bar: "bg-amber-500",   badge: "bg-amber-50  text-amber-700  ring-amber-200  dark:bg-amber-950/40  dark:text-amber-500  dark:ring-amber-800/40" },
  D: { label: "D  (60–69%)",  bar: "bg-orange-500",  badge: "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:ring-orange-800/40" },
  F: { label: "F  (<60%)",    bar: "bg-red-500",      badge: "bg-red-50    text-red-700    ring-red-200    dark:bg-red-950/40    dark:text-red-400    dark:ring-red-800/40" },
};

function GradeBadge({ pct, size = "md" }: { pct: number; size?: "sm" | "md" | "lg" }) {
  const band = gradeBand(pct);
  const cfg  = BAND_CONFIG[band];
  const sz   = size === "sm" ? "text-[10px] px-1.5 py-0.5" : size === "lg" ? "text-base px-3 py-1" : "text-xs px-2 py-0.5";
  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-lg ring-1 ring-inset ${sz} ${cfg.badge}`}>
      {pct}%
    </span>
  );
}

function AssignmentTypePill({ type }: { type: Assignment["type"] }) {
  const map: Record<Assignment["type"], string> = {
    Assignment: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Quiz:       "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    Project:    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    Exam:       "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };
  const short: Record<Assignment["type"], string> = {
    Assignment: "A", Quiz: "Q", Project: "P", Exam: "E",
  };
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-black ${map[type]}`}>
      {short[type]}
    </span>
  );
}

type SortKey = "name" | "grade_desc" | "grade_asc";

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

  const [toType,      setToType]      = useState<"student" | "parent">(defaultTarget);
  const [subject,     setSubject]     = useState("");
  const [body,        setBody]        = useState("");
  const [sent,        setSent]        = useState(false);
  const [showToMenu,  setShowToMenu]  = useState(false);

  const currentTarget = targets.find((t) => t.type === toType) ?? targets[0];

  const handleSend = () => { if (!subject.trim() || !body.trim()) return; setSent(true); };
  const handleClose = () => { setSubject(""); setBody(""); setSent(false); setToType(defaultTarget); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Message" size="lg"
      footer={
        sent ? (
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
        )
      }>
      {sent ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">Message sent!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Your message to <span className="font-medium text-gray-700 dark:text-gray-200">{currentTarget.label}</span> has been delivered via StudyBuddy.
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1"><span className="font-medium">To:</span> {currentTarget.email}</p>
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
                  <span className="text-xs text-gray-400 dark:text-slate-500 truncate hidden sm:inline">&lt;{currentTarget.email}&gt;</span>
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
                        <p className="text-xs text-gray-400 dark:text-slate-500">{t.email}</p>
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
            <p className="text-xs text-blue-700 dark:text-blue-400">Messages are delivered through StudyBuddy and a copy will be logged in the messaging center.</p>
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
        <button type="button" onClick={handleCopy} className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" title="Copy">
          {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 rotate-45" />}
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GradesPage() {
  const { id } = useParams<{ id: string }>();

  const students    = useMemo(() => getStudentsByClass(id), [id]);
  const assignments = useMemo(() => getAssignmentsByClass(id).filter((a) => a.status === "published"), [id]);

  const [search,        setSearch]        = useState("");
  const [sort,          setSort]          = useState<SortKey>("name");
  const [colSort,       setColSort]       = useState<{ assignmentId: string; dir: "asc" | "desc" } | null>(null);
  const [filter,        setFilter]        = useState<"all" | "at_risk" | "passing">("all");
  const [selected,      setSelected]      = useState<Student | null>(null);
  const [compose,       setCompose]       = useState<{ student: Student; defaultTarget: "student" | "parent" } | null>(null);
  const [bannerExpanded, setBannerExpanded] = useState(false);

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  function getStudentStats(studentId: string) {
    const ids  = new Set(assignments.map((a) => a.id));
    const subs = SUBMISSIONS.filter((s) => s.studentId === studentId && ids.has(s.assignmentId));
    return {
      submitted: subs.filter((s) => s.status !== "Missing").length,
      missing:   subs.filter((s) => s.status === "Missing").length,
      graded:    subs.filter((s) => s.status === "Graded" || (s.status === "Late" && s.grade != null)).length,
      total:     assignments.length,
    };
  }

  // Build a fast lookup: "studentId:assignmentId" → submission
  const subMap = useMemo(() => {
    const m = new Map<string, typeof SUBMISSIONS[0]>();
    for (const s of SUBMISSIONS) m.set(`${s.studentId}:${s.assignmentId}`, s);
    return m;
  }, []);

  // Computed stats
  const classAvg   = students.length ? Math.round(students.reduce((s, st) => s + st.currentGrade, 0) / students.length) : 0;
  const topStudent = [...students].sort((a, b) => b.currentGrade - a.currentGrade)[0];
  const atRisk     = students.filter((s) => s.currentGrade < 70);
  const passing    = students.filter((s) => s.currentGrade >= 70);
  const passRate   = students.length ? Math.round((passing.length / students.length) * 100) : 0;

  const bandCounts = useMemo(() => {
    const counts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    for (const st of students) counts[gradeBand(st.currentGrade)]++;
    return counts;
  }, [students]);

  // Filtered + sorted student rows
  const rows = useMemo(() => {
    const q = search.toLowerCase();
    let list = students.filter((s) => {
      const matchSearch  = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchFilter  =
        filter === "all"     ? true :
        filter === "at_risk" ? s.currentGrade < 70 :
        s.currentGrade >= 70;
      return matchSearch && matchFilter;
    });

    if (colSort) {
      list = [...list].sort((a, b) => {
        const ga = subMap.get(`${a.id}:${colSort.assignmentId}`)?.grade ?? -1;
        const gb = subMap.get(`${b.id}:${colSort.assignmentId}`)?.grade ?? -1;
        return colSort.dir === "desc" ? gb - ga : ga - gb;
      });
    } else {
      list = [...list].sort((a, b) => {
        if (sort === "name")       return a.name.localeCompare(b.name);
        if (sort === "grade_desc") return b.currentGrade - a.currentGrade;
        return a.currentGrade - b.currentGrade;
      });
    }
    return list;
  }, [students, search, filter, sort, colSort, subMap]);

  // Per-assignment class averages
  const assignmentAvgs = useMemo(() => {
    const out = new Map<string, number | null>();
    for (const a of assignments) {
      const grades = students.map((st) => subMap.get(`${st.id}:${a.id}`)?.grade ?? null).filter((g): g is number => g != null);
      out.set(a.id, grades.length ? Math.round(grades.reduce((s, g) => s + g, 0) / grades.length) : null);
    }
    return out;
  }, [assignments, students, subMap]);

  const toggleColSort = (assignmentId: string) => {
    setColSort((prev) => {
      if (!prev || prev.assignmentId !== assignmentId) return { assignmentId, dir: "desc" };
      if (prev.dir === "desc") return { assignmentId, dir: "asc" };
      return null;
    });
  };

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Gradebook</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {students.length} students &middot; {assignments.length} published assignments
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Class Average</p>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-3xl font-black tabular-nums text-gray-900 dark:text-white">{classAvg}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
            {letterGrade(classAvg)} average &middot; {students.length} students
          </p>
          <div className="mt-3 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${BAND_CONFIG[gradeBand(classAvg)].bar}`} style={{ width: `${classAvg}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Top Student</p>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">{topStudent?.firstName} {topStudent?.lastName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{topStudent?.email}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {topStudent?.currentGrade}% &middot; {letterGrade(topStudent?.currentGrade ?? 0)}
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
            students below 70%
          </p>
          {atRisk.length > 0 && (
            <p className="text-[11px] text-red-500 dark:text-red-400 mt-2 font-semibold">
              {atRisk.map((s) => s.firstName).join(", ")}
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Passing Rate</p>
            <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          <p className="text-3xl font-black tabular-nums text-gray-900 dark:text-white">{passRate}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
            {passing.length} of {students.length} passing
          </p>
          <div className="mt-3 h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-teal-500" style={{ width: `${passRate}%` }} />
          </div>
        </div>
      </div>

      {/* ── Grade Distribution ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Grade Distribution</h2>
        <div className="space-y-2.5">
          {(["A", "B", "C", "D", "F"] as const).map((band) => {
            const count = bandCounts[band];
            const pct   = students.length ? Math.round((count / students.length) * 100) : 0;
            const cfg   = BAND_CONFIG[band];
            return (
              <div key={band} className="flex items-center gap-3">
                <span className={`w-6 text-xs font-black text-center ${cfg.badge.includes("emerald") ? "text-emerald-700 dark:text-emerald-400" : cfg.badge.includes("blue") ? "text-blue-700 dark:text-blue-400" : cfg.badge.includes("amber") ? "text-amber-700 dark:text-amber-500" : cfg.badge.includes("orange") ? "text-orange-700 dark:text-orange-400" : "text-red-700 dark:text-red-400"}`}>
                  {band}
                </span>
                <div className="flex-1 h-6 bg-gray-50 dark:bg-slate-800 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700/50">
                  <div className={`h-full rounded-lg transition-all duration-300 ${cfg.bar} flex items-center justify-end pr-2`}
                    style={{ width: `${Math.max(pct, count > 0 ? 6 : 0)}%` }}>
                    {count > 0 && <span className="text-[10px] font-bold text-white">{count}</span>}
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{count} student{count !== 1 ? "s" : ""}</span>
                </div>
                <div className="w-10 text-right">
                  <span className="text-xs text-gray-400 dark:text-slate-500">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── At-risk banner ─────────────────────────────────────────────── */}
      {atRisk.length > 0 && (
        <div className="rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/10 overflow-hidden">
          {/* Banner header — clickable to expand */}
          <button
            type="button"
            onClick={() => setBannerExpanded((v) => !v)}
            className="w-full flex items-center gap-3 p-4 hover:bg-red-50/80 dark:hover:bg-red-950/20 transition-colors text-left"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-800 dark:text-red-300">
                {atRisk.length} student{atRisk.length > 1 ? "s" : ""} below the passing threshold (70%)
              </p>
              <p className="text-xs text-red-700/70 dark:text-red-400/70 mt-0.5 truncate">
                {atRisk.map((s) => `${s.firstName} ${s.lastName} (${s.currentGrade}%)`).join(" · ")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                {bannerExpanded ? "Hide" : "View profiles"}
              </span>
              {bannerExpanded
                ? <ChevronUp className="w-4 h-4 text-red-500 dark:text-red-400" />
                : <ChevronRight className="w-4 h-4 text-red-500 dark:text-red-400" />
              }
            </div>
          </button>

          {/* Expanded student list */}
          {bannerExpanded && (
            <div className="border-t border-red-200 dark:border-red-800/40 divide-y divide-red-100 dark:divide-red-900/30">
              {atRisk.map((st) => {
                const stats = getStudentStats(st.id);
                return (
                  <div key={st.id} className="flex items-center gap-3 px-4 py-3 bg-white/60 dark:bg-slate-900/40">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl bg-red-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {st.avatar}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {st.firstName} {st.lastName}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs font-bold text-red-600 dark:text-red-400">{st.currentGrade}% · {letterGrade(st.currentGrade)}</span>
                        <span className="text-[11px] text-gray-400 dark:text-slate-500">{stats.missing} missing · {stats.graded} graded</span>
                      </div>
                    </div>
                    {/* Grade mini-bar */}
                    <div className="w-16 hidden sm:block">
                      <div className="h-1.5 bg-red-100 dark:bg-red-900/30 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${st.currentGrade}%` }} />
                      </div>
                      <p className="text-[10px] text-center text-gray-400 mt-0.5">{st.currentGrade}/100</p>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button type="button"
                        onClick={() => setSelected(st)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-800/60 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                        View Profile
                      </button>
                      <button type="button"
                        onClick={() => setCompose({ student: st, defaultTarget: "student" })}
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

      {/* ── Grade sheet ────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Grade Sheet</h2>
            <span className="text-xs text-gray-400 dark:text-slate-500">·</span>
            <span className="text-xs text-gray-500 dark:text-slate-400">{rows.length} of {students.length} students</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter tabs */}
            <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-0.5">
              {(["all", "passing", "at_risk"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
                  {f === "all" ? "All" : f === "passing" ? "Passing" : "At Risk"}
                </button>
              ))}
            </div>
            {/* Sort */}
            <select value={sort} onChange={(e) => { setSort(e.target.value as SortKey); setColSort(null); }}
              className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
              <option value="name">Sort: Name</option>
              <option value="grade_desc">Sort: Grade ↓</option>
              <option value="grade_asc">Sort: Grade ↑</option>
            </select>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 shadow-sm" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: `${Math.max(700, 220 + assignments.length * 110)}px` }}>
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/60">
                {/* Student column */}
                <th className="sticky left-0 z-20 bg-gray-50 dark:bg-slate-800 text-left py-3 px-5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide border-r border-gray-100 dark:border-slate-800 min-w-[200px]">
                  Student
                </th>
                {/* Assignment columns */}
                {assignments.map((a) => {
                  const isColSorted = colSort?.assignmentId === a.id;
                  return (
                    <th key={a.id}
                      className="text-center py-3 px-3 text-xs font-semibold text-gray-500 dark:text-slate-400 max-w-[110px] cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors select-none"
                      onClick={() => toggleColSort(a.id)}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <AssignmentTypePill type={a.type} />
                          <span className={`${isColSorted ? "text-blue-600 dark:text-blue-400" : ""}`}>
                            {isColSorted
                              ? colSort!.dir === "desc" ? <ChevronDown className="w-3 h-3 inline" /> : <ChevronUp className="w-3 h-3 inline" />
                              : null}
                          </span>
                        </div>
                        <span className="line-clamp-2 leading-tight text-center max-w-[90px]">{a.title}</span>
                        <span className="text-[10px] font-normal text-gray-400 dark:text-slate-500">/{a.points} pts</span>
                      </div>
                    </th>
                  );
                })}
                {/* Final grade column */}
                <th className="sticky right-0 z-20 bg-gray-50 dark:bg-slate-800 text-center py-3 px-5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide border-l border-gray-100 dark:border-slate-800 min-w-[120px]">
                  Overall
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
              {rows.map((st) => {
                const isAtRisk = st.currentGrade < 70;
                return (
                  <tr key={st.id}
                    className={`group hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors ${isAtRisk ? "bg-red-50/20 dark:bg-red-950/5" : ""}`}>

                    {/* Student cell */}
                    <td className={`sticky left-0 z-10 py-3.5 px-5 border-r border-gray-100 dark:border-slate-800 ${isAtRisk ? "bg-red-50/30 dark:bg-red-950/10 group-hover:bg-red-50/50 dark:group-hover:bg-red-950/20" : "bg-white dark:bg-slate-900 group-hover:bg-gray-50/80 dark:group-hover:bg-slate-800/40"}`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl text-white text-xs font-bold flex items-center justify-center flex-shrink-0 ${isAtRisk ? "bg-red-500" : "bg-[#1e3a8a]"}`}>
                          {st.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                            {st.firstName} {st.lastName}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 leading-none">{st.email}</p>
                        </div>
                        {isAtRisk && (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 dark:text-red-400 ml-auto shrink-0" />
                        )}
                      </div>
                    </td>

                    {/* Assignment cells */}
                    {assignments.map((a) => {
                      const sub  = subMap.get(`${st.id}:${a.id}`);
                      const pct  = sub?.grade != null ? Math.round((sub.grade / a.points) * 100) : null;

                      if (!sub) {
                        return (
                          <td key={a.id} className="py-3.5 px-3 text-center">
                            <span className="text-gray-300 dark:text-slate-700 text-lg leading-none select-none">—</span>
                          </td>
                        );
                      }

                      if (sub.status === "Missing") {
                        return (
                          <td key={a.id} className="py-3.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-800/40 whitespace-nowrap">
                              <AlertCircle className="w-2.5 h-2.5" /> Missing
                            </span>
                          </td>
                        );
                      }

                      if (sub.status === "Submitted" && sub.grade == null) {
                        return (
                          <td key={a.id} className="py-3.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/40 dark:text-amber-500 dark:ring-amber-800/40 whitespace-nowrap">
                              <Clock className="w-2.5 h-2.5" /> Pending
                            </span>
                          </td>
                        );
                      }

                      if (sub.status === "Late" && sub.grade == null) {
                        return (
                          <td key={a.id} className="py-3.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:ring-orange-800/40 whitespace-nowrap">
                              <Clock className="w-2.5 h-2.5" /> Late
                            </span>
                          </td>
                        );
                      }

                      // Graded
                      return (
                        <td key={a.id} className="py-3.5 px-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ring-1 ring-inset ${BAND_CONFIG[gradeBand(pct!)].badge}`}>
                              {sub.grade}/{a.points}
                            </span>
                            {sub.status === "Late" && (
                              <span className="text-[9px] font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wide">Late</span>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Overall grade cell */}
                    <td className={`sticky right-0 z-10 py-3.5 px-5 text-center border-l border-gray-100 dark:border-slate-800 ${isAtRisk ? "bg-red-50/30 dark:bg-red-950/10 group-hover:bg-red-50/50 dark:group-hover:bg-red-950/20" : "bg-white dark:bg-slate-900 group-hover:bg-gray-50/80 dark:group-hover:bg-slate-800/40"}`}>
                      <div className="flex flex-col items-center gap-1.5">
                        <GradeBadge pct={st.currentGrade} />
                        <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400">
                          {letterGrade(st.currentGrade)}
                        </span>
                        <div className="w-14 h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${BAND_CONFIG[gradeBand(st.currentGrade)].bar}`}
                            style={{ width: `${st.currentGrade}%` }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr>
                  <td colSpan={assignments.length + 2} className="py-14 text-center">
                    <Search className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 dark:text-slate-500">No students match your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>

            {/* Class average footer row */}
            {rows.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60">
                  <td className="sticky left-0 z-10 bg-gray-50 dark:bg-slate-800 py-3.5 px-5 border-r border-gray-200 dark:border-slate-700">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                      <BarChart3 className="w-3.5 h-3.5 text-blue-500" /> Class Average
                    </p>
                  </td>
                  {assignments.map((a) => {
                    const avg = assignmentAvgs.get(a.id);
                    const pct = avg != null ? Math.round((avg / a.points) * 100) : null;
                    return (
                      <td key={a.id} className="py-3.5 px-3 text-center">
                        {avg != null
                          ? <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ring-1 ring-inset ${BAND_CONFIG[gradeBand(pct!)].badge}`}>{avg}/{a.points}</span>
                          : <span className="text-gray-300 dark:text-slate-700">—</span>
                        }
                      </td>
                    );
                  })}
                  <td className="sticky right-0 z-10 bg-gray-50 dark:bg-slate-800 py-3.5 px-5 text-center border-l border-gray-200 dark:border-slate-700">
                    <div className="flex flex-col items-center gap-1">
                      <GradeBadge pct={classAvg} />
                      <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400">{letterGrade(classAvg)}</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 flex flex-wrap items-center gap-4">
          <span className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Legend:</span>
          {[
            { label: "Graded", el: <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ring-1 ring-inset ${BAND_CONFIG.A.badge}`}>10/10</span> },
            { label: "Missing", el: <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 ring-1 ring-inset ring-red-200 dark:bg-red-950/40 dark:text-red-400 dark:ring-red-800/40"><AlertCircle className="w-2.5 h-2.5" /> Missing</span> },
            { label: "Submitted / Pending", el: <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/40 dark:text-amber-500 dark:ring-amber-800/40"><Clock className="w-2.5 h-2.5" /> Pending</span> },
            { label: "Not assigned", el: <span className="text-gray-300 dark:text-slate-700 text-lg leading-none">—</span> },
          ].map(({ label, el }) => (
            <div key={label} className="flex items-center gap-1.5">
              {el}
              <span className="text-[11px] text-gray-500 dark:text-slate-400">{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] text-gray-400 dark:text-slate-500">Click column header to sort by assignment</span>
          </div>
        </div>
      </div>

      {/* ── Student Profile Modal ─────────────────────────────────────────── */}
      {selected && (
        <Modal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          title="Student Profile"
          size="lg"
          footer={
            <div className="flex items-center gap-2 w-full">
              <button type="button"
                onClick={() => { setCompose({ student: selected, defaultTarget: "student" }); setSelected(null); }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors">
                <Mail className="h-4 w-4" /> Message Student
              </button>
              <button type="button"
                onClick={() => { setCompose({ student: selected, defaultTarget: "parent" }); setSelected(null); }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 hover:bg-violet-100 dark:hover:bg-violet-950/50 px-4 py-2.5 text-sm font-semibold text-violet-700 dark:text-violet-400 transition-colors">
                <MessageSquare className="h-4 w-4" /> Message Parent
              </button>
              <button type="button" onClick={() => setSelected(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                Close
              </button>
            </div>
          }
        >
          {(() => {
            const stats    = getStudentStats(selected.id);
            const isRisk   = selected.currentGrade < 70;
            return (
              <div className="space-y-5">
                {/* Avatar + name */}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl text-white text-xl font-bold flex items-center justify-center flex-shrink-0 ${isRisk ? "bg-red-500" : "bg-[#1e3a8a]"}`}>
                    {selected.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selected.firstName} {selected.lastName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
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

                {/* Grade card */}
                <div className={`flex items-center gap-4 p-4 rounded-2xl ${BAND_CONFIG[gradeBand(selected.currentGrade)].badge}`}>
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

                {/* Stats grid */}
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

                {/* Activity summary */}
                <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-2">Activity Summary</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selected.activitySummary}</p>
                </div>

                {/* Parent / Guardian */}
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
                        className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-violet-200 dark:border-violet-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:border-violet-400 transition-colors">
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

                {/* Student Contact */}
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
            );
          })()}
        </Modal>
      )}

      {/* ── Compose Modal ──────────────────────────────────────────────────── */}
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
