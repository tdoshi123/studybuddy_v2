"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { getStudentsByClass, getAssignmentsByClass, SUBMISSIONS, Student } from "@/data/teacher-mock-data";
import { Modal } from "@/components/ui/modal";
import {
  Search, Users, TrendingUp, TrendingDown, Mail, Phone,
  CheckCircle2, AlertCircle, Clock, Send, X, UserCircle,
  BookOpen, MessageSquare, ChevronDown, AtSign,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gradeColor(g: number) {
  if (g >= 90) return "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400";
  if (g >= 80) return "text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400";
  if (g >= 70) return "text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400";
  return "text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-400";
}
function gradeBar(g: number) {
  if (g >= 90) return "bg-emerald-500"; if (g >= 80) return "bg-blue-500";
  if (g >= 70) return "bg-amber-500"; return "bg-red-500";
}
function letterGrade(p: number) {
  if (p >= 93) return "A"; if (p >= 90) return "A−"; if (p >= 87) return "B+";
  if (p >= 83) return "B"; if (p >= 80) return "B−"; if (p >= 70) return "C";
  if (p >= 60) return "D"; return "F";
}

type Sort = "name" | "grade_desc" | "grade_asc";

// ─── Message Compose Modal ─────────────────────────────────────────────────────

type MessageTarget = { label: string; email: string; type: "student" | "parent" };

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  defaultTarget?: "student" | "parent";
}

function ComposeModal({ isOpen, onClose, student, defaultTarget = "student" }: ComposeModalProps) {
  const targets: MessageTarget[] = [
    { label: `${student.firstName} ${student.lastName} (Student)`, email: student.email, type: "student" },
    { label: `${student.parentName} (${student.parentRelation})`,  email: student.parentEmail, type: "parent" },
  ];

  const [toType,    setToType]    = useState<"student" | "parent">(defaultTarget);
  const [subject,   setSubject]   = useState("");
  const [body,      setBody]      = useState("");
  const [sent,      setSent]      = useState(false);
  const [showToMenu, setShowToMenu] = useState(false);

  const currentTarget = targets.find((t) => t.type === toType) ?? targets[0];

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) return;
    setSent(true);
  };

  const handleClose = () => {
    setSubject("");
    setBody("");
    setSent(false);
    setToType(defaultTarget);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Message"
      size="lg"
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
      }
    >
      {sent ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">Message sent!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Your message to <span className="font-medium text-gray-700 dark:text-gray-200">{currentTarget.label}</span> has been delivered via StudyBuddy.
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            <span className="font-medium">To:</span> {currentTarget.email}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* To field */}
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
                    <button key={t.type} type="button"
                      onClick={() => { setToType(t.type); setShowToMenu(false); }}
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

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Update on recent class performance"
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>

          {/* Message body */}
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Message</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6}
              placeholder={`Write your message to ${toType === "student" ? student.firstName : student.parentName}…`}
              className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y min-h-[140px]" />
          </div>

          {/* Info bar */}
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 px-3 py-2.5">
            <MessageSquare className="h-4 w-4 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Messages are delivered through StudyBuddy and a copy will be logged in the messaging center.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const { id } = useParams<{ id: string }>();
  const allStudents = useMemo(() => getStudentsByClass(id), [id]);
  const assignments = useMemo(() => getAssignmentsByClass(id), [id]);

  const [search,   setSearch]   = useState("");
  const [sort,     setSort]     = useState<Sort>("name");
  const [selected, setSelected] = useState<Student | null>(null);
  const [compose,  setCompose]  = useState<{ student: Student; defaultTarget: "student" | "parent" } | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return allStudents
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.parentName.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === "name")       return a.name.localeCompare(b.name);
        if (sort === "grade_desc") return b.currentGrade - a.currentGrade;
        return a.currentGrade - b.currentGrade;
      });
  }, [allStudents, search, sort]);

  const avgGrade = allStudents.length
    ? Math.round(allStudents.reduce((s, st) => s + st.currentGrade, 0) / allStudents.length)
    : 0;
  const atRisk = allStudents.filter((s) => s.currentGrade < 70).length;
  const today  = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  function getStudentStats(studentId: string) {
    const assignmentIds = new Set(assignments.map((a) => a.id));
    const subs = SUBMISSIONS.filter((s) => s.studentId === studentId && assignmentIds.has(s.assignmentId));
    return {
      submitted: subs.filter((s) => s.status !== "Missing").length,
      missing:   subs.filter((s) => s.status === "Missing").length,
      graded:    subs.filter((s) => s.status === "Graded" || (s.status === "Late" && s.grade != null)).length,
      total:     assignments.length,
    };
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Students</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {allStudents.length} enrolled &middot; class avg {avgGrade}% &middot; {atRisk} at risk
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
            className="px-3 py-2 rounded-xl text-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="name">Sort: Name</option>
            <option value="grade_desc">Sort: Grade ↓</option>
            <option value="grade_asc">Sort: Grade ↑</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students or parents…"
              className="pl-9 pr-4 py-2 rounded-xl text-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" />
          </div>
        </div>
      </div>

      {/* Student cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((st) => {
          const stats      = getStudentStats(st.id);
          const submitPct  = stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 0;
          const isAtRisk   = st.currentGrade < 70;

          return (
            <div
              key={st.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group ${isAtRisk ? "border-red-200 dark:border-red-900/50" : "border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800"}`}
            >
              {/* Card body — clickable for profile */}
              <button type="button" onClick={() => setSelected(st)}
                className="w-full text-left p-5 pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#1e3a8a] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {st.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {st.firstName} {st.lastName}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 truncate mt-0.5">{st.email}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${gradeColor(st.currentGrade)}`}>
                    {st.currentGrade}%
                  </span>
                </div>

                {/* Grade bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-gray-400 dark:text-slate-500">Grade</span>
                    <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">{letterGrade(st.currentGrade)}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${gradeBar(st.currentGrade)}`} style={{ width: `${st.currentGrade}%` }} />
                  </div>
                </div>

                {/* Submission stats */}
                <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3 h-3" />{stats.submitted}</span>
                  <span className="flex items-center gap-1 text-red-500 dark:text-red-400"><AlertCircle className="w-3 h-3" />{stats.missing} missing</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{stats.graded} graded</span>
                </div>
                <div className="mt-2 h-1 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${submitPct}%` }} />
                </div>
              </button>

              {/* Parent contact strip */}
              <div className="px-5 py-2.5 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <UserCircle className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
                  <span className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">{st.parentName}</span>
                    <span className="ml-1 text-gray-400">({st.parentRelation})</span>
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
                <button type="button"
                  onClick={() => setCompose({ student: st, defaultTarget: "student" })}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  <Mail className="w-3.5 h-3.5" /> Message Student
                </button>
                <button type="button"
                  onClick={() => setCompose({ student: st, defaultTarget: "parent" })}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-400 transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" /> Message Parent
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-12 text-center">
          <Users className="w-10 h-10 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">No students found matching &quot;{search}&quot;</p>
        </div>
      )}

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
            const stats = getStudentStats(selected.id);
            return (
              <div className="space-y-5">

                {/* Avatar + name */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#1e3a8a] text-white text-xl font-bold flex items-center justify-center flex-shrink-0">
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
                <div className={`flex items-center gap-4 p-4 rounded-2xl ${gradeColor(selected.currentGrade)}`}>
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

                {/* ── Parent / Guardian Contact ─────────────────────── */}
                <div className="rounded-2xl border border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-950/10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-violet-100 dark:border-violet-800/30">
                    <p className="text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400 flex items-center gap-2">
                      <UserCircle className="w-3.5 h-3.5" /> Parent / Guardian Contact
                    </p>
                  </div>
                  <div className="px-4 py-4 space-y-3">
                    {/* Parent name + relation */}
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

                    {/* Contact details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <ContactRow icon={Mail} label="Email" value={selected.parentEmail}
                        action={() => { setCompose({ student: selected, defaultTarget: "parent" }); setSelected(null); }}
                        actionLabel="Send Message" />
                      <ContactRow icon={Phone} label="Phone" value={selected.parentPhone} />
                    </div>
                  </div>
                </div>

                {/* ── Student Contact ───────────────────────────────── */}
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

      {/* ── Compose Message Modal ─────────────────────────────────────────── */}
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

// ─── Contact Row ──────────────────────────────────────────────────────────────

function ContactRow({
  icon: Icon,
  label,
  value,
  action,
  actionLabel,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  action?: () => void;
  actionLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <div className="flex items-start gap-2.5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 px-3 py-2.5">
      <Icon className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">{label}</p>
        <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate mt-0.5">{value}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {action && actionLabel && (
          <button type="button" onClick={action}
            className="rounded-lg p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors" title={actionLabel}>
            <Send className="w-3 h-3" />
          </button>
        )}
        <button type="button" onClick={handleCopy}
          className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors" title="Copy">
          {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <X className="w-3 h-3 rotate-45" />}
        </button>
      </div>
    </div>
  );
}
