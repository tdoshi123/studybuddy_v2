"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuizzesByClass, Quiz } from "@/data/teacher-mock-data";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, HelpCircle, Award, Clock, RefreshCw,
  Calendar, CheckCircle2, AlertCircle, Search, ArrowRight,
  Shuffle, LayoutGrid, List, ChevronRight, Copy, Eye, AlertTriangle,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
}
function isOverdue(dueDate: string) {
  return new Date(dueDate + "T23:59:59") < new Date();
}
function daysUntil(iso: string) {
  return Math.ceil((new Date(iso + "T23:59:00").getTime() - Date.now()) / 86_400_000);
}

type FilterTab = "all" | "published" | "draft";
type SortKey   = "due_asc" | "due_desc" | "points" | "questions" | "title";
type ViewMode  = "grid" | "list";

// ─── Meta Chip ────────────────────────────────────────────────────────────────

function MetaChip({ icon: Icon, label, color = "text-gray-500 dark:text-slate-400" }: {
  icon: React.ElementType; label: string; color?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{label}</span>
    </div>
  );
}

// ─── Quiz Card ────────────────────────────────────────────────────────────────

function QuizCard({
  quiz, courseId, onDelete, onDuplicate,
}: {
  quiz: Quiz; courseId: string; onDelete: (q: Quiz) => void; onDuplicate: (q: Quiz) => void;
}) {
  const overdue = isOverdue(quiz.dueDate) && quiz.status === "published";
  const days    = daysUntil(quiz.dueDate);
  const router  = useRouter();

  return (
    <div className={`group relative bg-white dark:bg-slate-900 rounded-2xl border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden ${
      overdue
        ? "border-red-200 dark:border-red-800/50"
        : quiz.status === "published"
        ? "border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800"
        : "border-gray-200 dark:border-slate-700 border-dashed"
    }`}>

      {/* Top accent bar */}
      <div className={`h-1 w-full ${quiz.status === "published" ? (overdue ? "bg-red-500" : "bg-[#1e3a8a]") : "bg-amber-400"}`} />

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col gap-3">

        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              quiz.status === "published" ? "bg-violet-50 dark:bg-violet-950/30" : "bg-gray-100 dark:bg-slate-800"
            }`}>
              <HelpCircle className={`w-4 h-4 ${quiz.status === "published" ? "text-violet-600 dark:text-violet-400" : "text-gray-400"}`} />
            </div>
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => router.push(`/lis/teacher/courses/${courseId}/quizzes/${quiz.id}`)}
                className="text-left font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-snug line-clamp-2"
              >
                {quiz.title}
              </button>
              {quiz.description && (
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {quiz.description}
                </p>
              )}
            </div>
          </div>

          {/* Status badge */}
          {quiz.status === "published" ? (
            <span className="inline-flex items-center gap-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/40 dark:text-amber-500 dark:ring-amber-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Draft
            </span>
          )}
        </div>

        {/* Meta chips row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
          <MetaChip icon={HelpCircle} label={`${quiz.questions.length} question${quiz.questions.length !== 1 ? "s" : ""}`} color="text-violet-500 dark:text-violet-400" />
          <MetaChip icon={Award}      label={`${quiz.totalPoints} pts`}  color="text-amber-500 dark:text-amber-400" />
          <MetaChip icon={Clock}      label={`${quiz.timeLimit} min`}    color="text-blue-500 dark:text-blue-400" />
          <MetaChip icon={RefreshCw}  label={`${quiz.attemptsAllowed} attempt${quiz.attemptsAllowed !== 1 ? "s" : ""}`} color="text-teal-500 dark:text-teal-400" />
          {quiz.shuffleQuestions && (
            <MetaChip icon={Shuffle} label="Shuffled" color="text-indigo-500 dark:text-indigo-400" />
          )}
        </div>

        {/* Due date */}
        <div className={`flex items-center gap-1.5 text-xs font-medium mt-auto pt-1 ${overdue ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-slate-400"}`}>
          {overdue
            ? <AlertCircle className="w-3.5 h-3.5" />
            : <Calendar className="w-3.5 h-3.5" />}
          <span>{fmt(quiz.dueDate)}</span>
          {overdue ? (
            <span className="font-bold uppercase tracking-wide text-[10px] ml-1">· Overdue</span>
          ) : quiz.status === "published" ? (
            <span className="text-gray-400 dark:text-slate-500">
              · {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : days > 0 ? `In ${days} days` : ""}
            </span>
          ) : null}
        </div>
      </div>

      {/* Action footer */}
      <div className="px-5 py-3 bg-gray-50/70 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex items-center gap-2">
        <Link
          href={`/lis/teacher/courses/${courseId}/quizzes/${quiz.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" /> Edit Builder
        </Link>
        <button
          type="button"
          onClick={() => onDuplicate(quiz)}
          title="Duplicate quiz"
          className="w-8 h-8 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(quiz)}
          title="Delete quiz"
          className="w-8 h-8 rounded-xl border border-red-100 dark:border-red-900/40 bg-white dark:bg-slate-800 flex items-center justify-center text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── List Row ─────────────────────────────────────────────────────────────────

function QuizRow({
  quiz, courseId, onDelete, onDuplicate,
}: {
  quiz: Quiz; courseId: string; onDelete: (q: Quiz) => void; onDuplicate: (q: Quiz) => void;
}) {
  const overdue = isOverdue(quiz.dueDate) && quiz.status === "published";
  const days    = daysUntil(quiz.dueDate);

  return (
    <tr className="group hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition-colors">
      {/* Title */}
      <td className="px-5 py-4">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            quiz.status === "published" ? "bg-violet-50 dark:bg-violet-950/30" : "bg-gray-100 dark:bg-slate-800"
          }`}>
            <HelpCircle className={`w-4 h-4 ${quiz.status === "published" ? "text-violet-600 dark:text-violet-400" : "text-gray-400"}`} />
          </div>
          <div>
            <Link href={`/lis/teacher/courses/${courseId}/quizzes/${quiz.id}`}
              className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 group/link">
              {quiz.title}
              <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </Link>
            {quiz.description && (
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-1 max-w-xs">{quiz.description}</p>
            )}
          </div>
        </div>
      </td>
      {/* Qs */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          <HelpCircle className="w-3.5 h-3.5 text-violet-500" />
          {quiz.questions.length}
        </span>
      </td>
      {/* Points */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          {quiz.totalPoints}
        </span>
      </td>
      {/* Time */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          {quiz.timeLimit}m
        </span>
      </td>
      {/* Status */}
      <td className="px-4 py-4">
        {quiz.status === "published" ? (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/40 dark:text-amber-500 dark:ring-amber-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Draft
          </span>
        )}
      </td>
      {/* Due */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div>
          <p className={`text-sm font-semibold ${overdue ? "text-red-600 dark:text-red-400" : "text-gray-800 dark:text-gray-200"}`}>
            {fmt(quiz.dueDate)}
          </p>
          {overdue ? (
            <p className="text-[11px] font-bold text-red-500 flex items-center gap-0.5 mt-0.5">
              <AlertCircle className="w-3 h-3" /> Overdue
            </p>
          ) : quiz.status === "published" && (
            <p className={`text-[11px] mt-0.5 font-medium ${days <= 3 ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-slate-500"}`}>
              {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : days > 0 ? `In ${days} days` : ""}
            </p>
          )}
        </div>
      </td>
      {/* Actions */}
      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/lis/teacher/courses/${courseId}/quizzes/${quiz.id}`}
            className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Edit">
            <Pencil className="w-4 h-4" />
          </Link>
          <button type="button" onClick={() => onDuplicate(quiz)}
            className="rounded-lg p-2 text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Duplicate">
            <Copy className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => onDelete(quiz)}
            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherQuizzesPage() {
  const params = useParams();
  const router = useRouter();
  const id     = params.id as string;

  const [quizzes,      setQuizzes]      = useState<Quiz[]>(() => getQuizzesByClass(id));
  const [deleteTarget, setDeleteTarget] = useState<Quiz | null>(null);
  const [filter,       setFilter]       = useState<FilterTab>("all");
  const [sort,         setSort]         = useState<SortKey>("due_asc");
  const [search,       setSearch]       = useState("");
  const [viewMode,     setViewMode]     = useState<ViewMode>("grid");

  const today          = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const publishedCount = quizzes.filter((q) => q.status === "published").length;
  const draftCount     = quizzes.filter((q) => q.status === "draft").length;
  const overdueCount   = quizzes.filter((q) => q.status === "published" && isOverdue(q.dueDate)).length;
  const totalPoints    = quizzes.reduce((s, q) => s + q.totalPoints, 0);
  const totalQs        = quizzes.reduce((s, q) => s + q.questions.length, 0);

  const displayed = useMemo(() => {
    const q = search.toLowerCase();
    return quizzes
      .filter((quiz) => {
        if (filter === "published") return quiz.status === "published";
        if (filter === "draft")     return quiz.status === "draft";
        return true;
      })
      .filter((quiz) => !q || quiz.title.toLowerCase().includes(q) || quiz.description.toLowerCase().includes(q))
      .sort((a, b) => {
        if (sort === "due_asc")   return a.dueDate.localeCompare(b.dueDate);
        if (sort === "due_desc")  return b.dueDate.localeCompare(a.dueDate);
        if (sort === "points")    return b.totalPoints - a.totalPoints;
        if (sort === "questions") return b.questions.length - a.questions.length;
        return a.title.localeCompare(b.title);
      });
  }, [quizzes, filter, search, sort]);

  const handleDuplicate = (quiz: Quiz) => {
    const copy: Quiz = {
      ...quiz,
      id:        `q-copy-${Date.now()}`,
      title:     `${quiz.title} (Copy)`,
      status:    "draft",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setQuizzes((prev) => [copy, ...prev]);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setQuizzes((prev) => prev.filter((q) => q.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quizzes</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {quizzes.length} total &middot; {publishedCount} published &middot; {draftCount} drafts
          </p>
        </div>
        <div className="shrink-0">
          <button type="button" onClick={() => router.push(`/lis/teacher/courses/${id}/quizzes/new`)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors">
            <Plus className="h-4 w-4" /> Create Quiz
          </button>
        </div>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Published",   value: publishedCount, icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400" },
          { label: "Drafts",      value: draftCount,     icon: Eye,          bg: "bg-amber-50 dark:bg-amber-950/30",   text: "text-amber-600 dark:text-amber-400" },
          { label: "Overdue",     value: overdueCount,   icon: AlertTriangle, bg: "bg-red-50 dark:bg-red-950/30",      text: "text-red-600 dark:text-red-400" },
          { label: "Total Questions", value: totalQs,   icon: HelpCircle,   bg: "bg-violet-50 dark:bg-violet-950/30", text: "text-violet-600 dark:text-violet-400" },
        ].map(({ label, value, icon: Icon, bg, text }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">{label}</p>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`w-4 h-4 ${text}`} />
              </div>
            </div>
            <p className="text-3xl font-black tabular-nums text-gray-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

        {/* Filter tabs */}
        <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-0.5 gap-0.5">
          {([["all", "All", quizzes.length], ["published", "Published", publishedCount], ["draft", "Drafts", draftCount]] as const).map(([key, label, count]) => (
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

        {/* Right side controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Sort */}
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="due_asc">Due ↑</option>
            <option value="due_desc">Due ↓</option>
            <option value="points">Points</option>
            <option value="questions">Questions</option>
            <option value="title">Title</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes…"
              className="pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 shadow-sm" />
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-xl p-0.5">
            <button type="button" onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`} title="Grid view">
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-white dark:bg-slate-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`} title="List view">
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      {quizzes.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <EmptyState icon={HelpCircle} title="No quizzes yet"
            description="Create your first quiz to assess students and track their progress."
            action={{ label: "Create Quiz", onClick: () => router.push(`/lis/teacher/courses/${id}/quizzes/new`) }} />
        </div>
      ) : displayed.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm py-14 text-center">
          <Search className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-gray-400 dark:text-slate-500">No quizzes match your search or filter.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayed.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} courseId={id}
              onDelete={setDeleteTarget} onDuplicate={handleDuplicate} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/60">
                  <th className="px-5 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Quiz</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Questions</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Points</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Time</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3.5 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Due Date</th>
                  <th className="px-4 py-3.5 text-right text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
                {displayed.map((quiz) => (
                  <QuizRow key={quiz.id} quiz={quiz} courseId={id}
                    onDelete={setDeleteTarget} onDuplicate={handleDuplicate} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Quick-start banner ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-dashed border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5 text-[#1e3a8a] dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Build a new quiz from scratch</p>
            <p className="text-xs text-blue-700/70 dark:text-blue-400/70 mt-0.5">
              Multiple choice, true/false, short answer, essay, images, and more.
            </p>
          </div>
        </div>
        <button type="button" onClick={() => router.push(`/lis/teacher/courses/${id}/quizzes/new`)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors shrink-0">
          Open Quiz Builder <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Delete Modal ──────────────────────────────────────────────────── */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        title="Delete Quiz" size="sm"
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
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Are you sure you want to delete this quiz?</p>
            {deleteTarget && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &ldquo;{deleteTarget.title}&rdquo; will be permanently removed. This cannot be undone.
              </p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
