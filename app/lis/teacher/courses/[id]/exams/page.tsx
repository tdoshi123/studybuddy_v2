"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getExamsByClass, Quiz, QuizQuestion } from "@/data/teacher-mock-data";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  BookOpen,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

function newExamId(): string {
  return `ex-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function fmt(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(dueDate: string) {
  return new Date(dueDate + "T23:59:59") < new Date();
}

export default function TeacherExamsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const [exams, setExams] = useState<Quiz[]>(() => getExamsByClass(id));
  const [createOpen, setCreateOpen] = useState(() => searchParams.get("create") === "1");
  const [deleteTarget, setDeleteTarget] = useState<Quiz | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDueDate, setFormDueDate] = useState("");
  const [formTimeLimit, setFormTimeLimit] = useState(90);
  const [formAttempts, setFormAttempts] = useState(1);
  const [formPassingScore, setFormPassingScore] = useState(75);
  const [formShowResults, setFormShowResults] = useState(false);
  const [formStatus, setFormStatus] = useState<"published" | "draft">("draft");

  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormDueDate("");
    setFormTimeLimit(90);
    setFormAttempts(1);
    setFormPassingScore(75);
    setFormShowResults(false);
    setFormStatus("draft");
  };

  const handleCreate = () => {
    const newId = newExamId();
    const newExam: Quiz = {
      id: newId,
      classId: id,
      title: formTitle.trim() || "Untitled Exam",
      description: formDescription.trim(),
      questions: [] as QuizQuestion[],
      timeLimit: Math.max(1, formTimeLimit),
      attemptsAllowed: Math.max(1, formAttempts),
      shuffleQuestions: false,
      status: formStatus,
      dueDate: formDueDate || new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
      totalPoints: 0,
      quizType: "exam",
      passingScore: Math.max(0, Math.min(100, formPassingScore)),
      showResultsAfter: formShowResults,
    };
    setExams((prev) => [newExam, ...prev]);
    setCreateOpen(false);
    resetForm();
    router.push(`/lis/teacher/courses/${id}/exams/${newId}`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setExams((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const publishedCount = exams.filter((e) => e.status === "published").length;
  const draftCount  = exams.filter((e) => e.status === "draft").length;
  const totalPoints = exams.reduce((sum, e) => sum + e.totalPoints, 0);
  const today       = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Exams</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {exams.length} total &middot; {publishedCount} published &middot; {draftCount} drafts
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/lis/teacher/courses/${id}/exams/new`)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Exam
        </button>
      </div>

      {/* Stats row */}
      {exams.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Exams",    value: exams.length,     color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-950/30" },
            { label: "Published",      value: publishedCount,   color: "text-emerald-600",bg: "bg-emerald-50 dark:bg-emerald-950/30" },
            { label: "Drafts",         value: draftCount,       color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-950/30" },
            { label: "Total Points",   value: totalPoints,      color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/30" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`rounded-xl ${bg} border border-gray-200 dark:border-slate-700 px-4 py-3`}>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-0.5">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {exams.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <EmptyState
            icon={BookOpen}
            title="No exams yet"
            description="Create your first exam to formally assess student understanding."
            action={{ label: "Build Exam", onClick: () => router.push(`/lis/teacher/courses/${id}/exams/new`) }}
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                    Exam Title
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    Questions
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    Points
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    Time
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    Passing
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    Due Date
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => {
                  const overdue = isOverdue(exam.dueDate) && exam.status === "published";
                  return (
                    <tr
                      key={exam.id}
                      className="border-b border-gray-50 dark:border-slate-800/60 last:border-0 hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {exam.title}
                        </div>
                        {exam.description && (
                          <p className="text-xs text-gray-400 dark:text-slate-500 line-clamp-1 mt-0.5 max-w-xs">
                            {exam.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                          {exam.questions.length}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          {exam.totalPoints}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {exam.timeLimit}m
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {exam.passingScore != null ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            {exam.passingScore}%
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={exam.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 text-sm ${
                            overdue ? "text-red-500 font-semibold" : "text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          <Calendar className={`h-3.5 w-3.5 ${overdue ? "text-red-400" : "text-gray-400"}`} />
                          {fmt(exam.dueDate)}
                          {overdue && (
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide ml-0.5">
                              Overdue
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/lis/teacher/courses/${id}/exams/${exam.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(exam)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 dark:border-red-900/50 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick-start card */}
      <div className="rounded-2xl border border-dashed border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Build a new exam</p>
          <p className="text-xs text-blue-700/70 dark:text-blue-400/70 mt-0.5">Add questions, set a time limit, passing score, and publish when ready.</p>
        </div>
        <button type="button" onClick={() => router.push(`/lis/teacher/courses/${id}/exams/new`)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors shrink-0">
          Open Exam Builder <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Create Exam Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => { setCreateOpen(false); resetForm(); }}
        title="Create Exam"
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => { setCreateOpen(false); resetForm(); }}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-xl bg-[#1e3a8a] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Create &amp; Build
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Exam title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g. Midterm Examination"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Description / Instructions</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              rows={3}
              placeholder="Instructions shown to students before the exam begins."
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Due date</label>
              <input
                type="date"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Time limit (minutes)</label>
              <input
                type="number"
                min={1}
                value={formTimeLimit}
                onChange={(e) => setFormTimeLimit(Number(e.target.value) || 1)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Attempts allowed</label>
              <input
                type="number"
                min={1}
                value={formAttempts}
                onChange={(e) => setFormAttempts(Number(e.target.value) || 1)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Passing score (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={formPassingScore}
                onChange={(e) => setFormPassingScore(Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Status</label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as "published" | "draft")}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <input
              type="checkbox"
              checked={formShowResults}
              onChange={(e) => setFormShowResults(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="flex items-center gap-2 text-sm text-gray-700">
              {formShowResults ? <Eye className="h-4 w-4 text-gray-400" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
              Show results to students after submission
            </span>
          </label>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete exam?"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">&quot;{deleteTarget?.title}&quot;</span>?
          This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status: Quiz["status"] }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
        Published
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-600/15">
      Draft
    </span>
  );
}
