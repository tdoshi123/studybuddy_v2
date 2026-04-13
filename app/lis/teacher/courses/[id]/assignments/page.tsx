"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  getAssignmentsByClass, getStudentsByClass, getSubmissionsByAssignment,
  Assignment, AssignmentType, AssignmentStatus,
} from "@/data/teacher-mock-data";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Paperclip, ClipboardList, Search,
  FileText, HelpCircle, FolderOpen, BookOpen, Calendar,
  CheckCircle2, AlertCircle, Clock, ChevronRight, AlertTriangle,
  Upload, Users,
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<AssignmentType, { icon: React.ElementType; bg: string; badge: string; dot: string }> = {
  Assignment: { icon: FileText,    bg: "bg-sky-50 dark:bg-sky-950/30",     badge: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:ring-sky-800/40",     dot: "bg-sky-500" },
  Quiz:       { icon: HelpCircle,  bg: "bg-violet-50 dark:bg-violet-950/30", badge: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:ring-violet-800/40", dot: "bg-violet-500" },
  Project:    { icon: FolderOpen,  bg: "bg-emerald-50 dark:bg-emerald-950/30", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800/40", dot: "bg-emerald-500" },
  Exam:       { icon: BookOpen,    bg: "bg-rose-50 dark:bg-rose-950/30",    badge: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:ring-rose-800/40",       dot: "bg-rose-500" },
};

const ALL_TYPES: AssignmentType[] = ["Assignment", "Quiz", "Project", "Exam"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(iso: string) {
  return new Date(iso + "T23:59:00") < new Date();
}

function daysUntil(iso: string) {
  const diff = new Date(iso + "T23:59:00").getTime() - Date.now();
  return Math.ceil(diff / 86_400_000);
}

function submissionCounts(assignment: Assignment, classStudents: ReturnType<typeof getStudentsByClass>) {
  const eligibleIds = assignment.assignTo === "all"
    ? new Set(classStudents.map((s) => s.id))
    : new Set(assignment.assignTo);
  const total     = eligibleIds.size;
  const subs      = getSubmissionsByAssignment(assignment.id).filter((s) => eligibleIds.has(s.studentId));
  const submitted = subs.filter((s) => s.status !== "Missing").length;
  const missing   = subs.filter((s) => s.status === "Missing").length;
  const graded    = subs.filter((s) => s.status === "Graded" || (s.status === "Late" && s.grade != null)).length;
  return { submitted, total, missing, graded };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypePillButton({ selected, type, onClick }: { selected: boolean; type: AssignmentType; onClick: () => void }) {
  const cfg  = TYPE_CONFIG[type];
  const Icon = cfg.icon;
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${
        selected
          ? `ring-2 ring-[#1e3a8a] border-[#1e3a8a] bg-blue-50 dark:bg-blue-950/30 text-[#1e3a8a] dark:text-blue-400`
          : "border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600 hover:text-gray-700 dark:hover:text-gray-200"
      }`}>
      <Icon className="w-3.5 h-3.5" />
      {type}
    </button>
  );
}

function FormField({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}

const INPUT_CLS = "w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors placeholder-gray-400";

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "published" | "draft";

export default function TeacherAssignmentsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id     = params.id as string;

  const classStudents = useMemo(() => getStudentsByClass(id), [id]);
  const [assignments, setAssignments] = useState<Assignment[]>(() => getAssignmentsByClass(id));
  const [filter,      setFilter]      = useState<FilterTab>("all");
  const [search,      setSearch]      = useState("");
  const [modalOpen,   setModalOpen]   = useState(() => searchParams.get("create") === "1");
  const [editingId,   setEditingId]   = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);

  // Form state
  const [title,        setTitle]        = useState("");
  const [description,  setDescription]  = useState("");
  const [type,         setType]         = useState<AssignmentType>("Assignment");
  const [dueDate,      setDueDate]      = useState("");
  const [points,       setPoints]       = useState<number>(100);
  const [status,       setStatus]       = useState<AssignmentStatus>("draft");
  const [assignToMode, setAssignToMode] = useState<"all" | string>("all");

  // Stats
  const allCount       = assignments.length;
  const publishedCount = assignments.filter((a) => a.status === "published").length;
  const draftCount     = assignments.filter((a) => a.status === "draft").length;
  const overdueCount   = assignments.filter((a) => a.status === "published" && isOverdue(a.dueDate)).length;
  const totalPoints    = assignments.filter((a) => a.status === "published").reduce((s, a) => s + a.points, 0);

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return assignments
      .filter((a) => {
        if (filter === "published") return a.status === "published";
        if (filter === "draft")     return a.status === "draft";
        return true;
      })
      .filter((a) => !q || a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
  }, [assignments, filter, search]);

  function openCreate() {
    setEditingId(null); setTitle(""); setDescription(""); setType("Assignment");
    setDueDate(""); setPoints(100); setStatus("draft"); setAssignToMode("all");
    setModalOpen(true);
  }
  function openEdit(a: Assignment) {
    setEditingId(a.id); setTitle(a.title); setDescription(a.description);
    setType(a.type); setDueDate(a.dueDate); setPoints(a.points); setStatus(a.status);
    setAssignToMode(a.assignTo === "all" ? "all" : (a.assignTo[0] ?? "all"));
    setModalOpen(true);
  }
  function closeModal() { setModalOpen(false); setEditingId(null); }

  function handleSave() {
    const assignTo: Assignment["assignTo"] = assignToMode === "all" ? "all" : [assignToMode];
    if (editingId) {
      setAssignments((prev) => prev.map((a) => a.id === editingId ? { ...a, title, description, type, dueDate, points, status, assignTo } : a));
    } else {
      const created: Assignment = {
        id: `a-new-${Date.now()}`, classId: id, title, description, type,
        dueDate: dueDate || new Date().toISOString().slice(0, 10),
        points: Number(points) || 0, status, createdAt: new Date().toISOString().slice(0, 10), assignTo,
      };
      setAssignments((prev) => [created, ...prev]);
    }
    closeModal();
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setAssignments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Assignments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {allCount} total &middot; {publishedCount} published &middot; {draftCount} drafts
          </p>
        </div>
        <div className="shrink-0">
          <button type="button" onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors">
            <Plus className="h-4 w-4" /> Create Assignment
          </button>
        </div>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Published",   value: publishedCount, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
          { label: "Drafts",      value: draftCount,     icon: Clock,        color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-950/30" },
          { label: "Overdue",     value: overdueCount,   icon: AlertTriangle, color: "text-red-600 dark:text-red-400",      bg: "bg-red-50 dark:bg-red-950/30" },
          { label: "Total Points",value: totalPoints,    icon: BookOpen,     color: "text-blue-600 dark:text-blue-400",     bg: "bg-blue-50 dark:bg-blue-950/30" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">{label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-3xl font-black tabular-nums text-gray-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter + Search toolbar ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-0.5 gap-0.5">
          {([["all", "All", allCount], ["published", "Published", publishedCount], ["draft", "Drafts", draftCount]] as const).map(([key, label, count]) => (
            <button key={key} type="button" onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                filter === key
                  ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}>
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${filter === key ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" : "bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400"}`}>{count}</span>
            </button>
          ))}
        </div>
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments…"
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
        </div>
      </div>

      {/* ── Empty state ─────────────────────────────────────────────────────── */}
      {assignments.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm">
          <EmptyState icon={ClipboardList} title="No assignments yet"
            description="Create your first assignment to get started."
            action={{ label: "Create Assignment", onClick: openCreate }} />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/60">
                  <th className="px-5 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Assignment</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Type</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Due Date</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Points</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Submissions</th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <Search className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 dark:text-slate-500">No assignments match your search or filter.</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((a) => {
                    const { submitted, total } = submissionCounts(a, classStudents);
                    const pct     = total > 0 ? Math.round((submitted / total) * 100) : 0;
                    const overdue = isOverdue(a.dueDate) && a.status === "published";
                    const days    = daysUntil(a.dueDate);
                    const cfg     = TYPE_CONFIG[a.type];
                    const TypeIcon = cfg.icon;

                    return (
                      <tr key={a.id} className="group hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition-colors">

                        {/* Title */}
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
                              <TypeIcon className={`w-4 h-4 ${TYPE_CONFIG[a.type].badge.includes("sky") ? "text-sky-600 dark:text-sky-400" : TYPE_CONFIG[a.type].badge.includes("violet") ? "text-violet-600 dark:text-violet-400" : TYPE_CONFIG[a.type].badge.includes("emerald") ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`} />
                            </div>
                            <div>
                              <Link href={`/lis/teacher/courses/${id}/assignments/${a.id}`}
                                className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 flex items-center gap-1 group/link">
                                {a.title}
                                <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                              </Link>
                              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-1 max-w-xs">{a.description}</p>
                            </div>
                          </div>
                        </td>

                        {/* Type badge */}
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${cfg.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {a.type}
                          </span>
                        </td>

                        {/* Due date */}
                        <td className="px-4 py-4">
                          <div>
                            <p className={`text-sm font-semibold ${overdue ? "text-red-600 dark:text-red-400" : "text-gray-800 dark:text-gray-200"}`}>
                              {fmt(a.dueDate)}
                            </p>
                            {overdue ? (
                              <p className="text-[11px] font-bold text-red-500 dark:text-red-400 flex items-center gap-1 mt-0.5">
                                <AlertCircle className="w-3 h-3" /> Overdue
                              </p>
                            ) : a.status === "published" ? (
                              <p className={`text-[11px] mt-0.5 font-medium ${days <= 3 ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-slate-500"}`}>
                                {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `In ${days} days`}
                              </p>
                            ) : (
                              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Not published</p>
                            )}
                          </div>
                        </td>

                        {/* Points */}
                        <td className="px-4 py-4">
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tabular-nums">{a.points}</span>
                          <span className="text-xs text-gray-400 dark:text-slate-500 ml-1">pts</span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          {a.status === "published" ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/40 dark:text-amber-500 dark:ring-amber-800/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Draft
                            </span>
                          )}
                        </td>

                        {/* Submissions */}
                        <td className="px-4 py-4 min-w-[140px]">
                          {a.status === "published" ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 tabular-nums">{submitted}/{total}</span>
                                <span className="text-[10px] text-gray-400 dark:text-slate-500">{pct}%</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : "bg-amber-500"}`}
                                  style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-300 dark:text-slate-700">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button type="button" onClick={() => openEdit(a)}
                              className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Edit">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button type="button" onClick={() => setDeleteTarget(a)}
                              className="rounded-lg p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors" aria-label="Delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      <Modal isOpen={modalOpen} onClose={closeModal}
        title={editingId ? "Edit Assignment" : "Create Assignment"} size="lg"
        footer={
          <>
            <button type="button" onClick={closeModal}
              className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={!title.trim()}
              className="rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              {editingId ? "Save Changes" : "Create Assignment"}
            </button>
          </>
        }>
        <div className="space-y-5">

          {/* Title */}
          <FormField label="Title">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Assignment title" className={INPUT_CLS} />
          </FormField>

          {/* Description */}
          <FormField label="Instructions">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              placeholder="Instructions and details for students…"
              className={`${INPUT_CLS} resize-y min-h-[100px]`} />
          </FormField>

          {/* Type selector */}
          <FormField label="Type">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ALL_TYPES.map((t) => (
                <TypePillButton key={t} type={t} selected={type === t} onClick={() => setType(t)} />
              ))}
            </div>
          </FormField>

          {/* Due date + Points row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Due Date">
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={INPUT_CLS} />
            </FormField>
            <FormField label="Points">
              <input type="number" min={0} value={points} onChange={(e) => setPoints(Number(e.target.value))} className={INPUT_CLS} />
            </FormField>
          </div>

          {/* Status + Assign to row */}
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Status">
              <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-0.5 gap-0.5">
                {(["draft", "published"] as const).map((s) => (
                  <button key={s} type="button" onClick={() => setStatus(s)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      status === s
                        ? s === "published"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}>
                    {s === "published" ? "Published" : "Draft"}
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="Assign To">
              <select value={assignToMode} onChange={(e) => setAssignToMode(e.target.value)} className={INPUT_CLS}>
                <option value="all">All Students</option>
                {classStudents.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Attachments */}
          <FormField label="Attachments" hint="File upload is not connected in this demo.">
            <button type="button"
              className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 px-4 py-6 text-sm font-medium text-gray-500 dark:text-slate-400 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Upload className="h-6 w-6 text-gray-400 dark:text-slate-500" />
              <span>Click to upload files</span>
              <span className="text-xs text-gray-400 dark:text-slate-500">PDF, DOCX, PPTX up to 50MB</span>
            </button>
          </FormField>

        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ───────────────────────────────────────── */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        title="Delete Assignment" size="sm"
        footer={
          <>
            <button type="button" onClick={() => setDeleteTarget(null)}
              className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="button" onClick={confirmDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors">
              Delete
            </button>
          </>
        }>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Are you sure you want to delete this assignment?
            </p>
            {deleteTarget && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &ldquo;{deleteTarget.title}&rdquo; will be permanently removed. This action cannot be undone.
              </p>
            )}
          </div>
        </div>
      </Modal>

    </div>
  );
}
