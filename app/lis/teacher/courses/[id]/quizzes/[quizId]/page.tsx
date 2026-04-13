"use client";

import { useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { QUIZZES, QuizQuestion } from "@/data/teacher-mock-data";
import Link from "next/link";
import {
  ArrowLeft, Save, Plus, Trash2, Settings,
  ChevronDown, ChevronUp, Clock, ListOrdered,
  Image as ImageIcon, ChevronRight, GripVertical,
  Copy, Eye, EyeOff, CheckSquare, Circle, AlignLeft,
  FileText, ToggleLeft, ShieldCheck, X, CheckCircle2,
} from "lucide-react";

// ─── Question type definitions ─────────────────────────────────────────────

type QType = QuizQuestion["type"];

const QUESTION_TYPES: {
  value: QType;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  { value: "multiple_choice",  label: "Multiple Choice",  icon: Circle,       description: "One correct answer from several options" },
  { value: "multiple_answers", label: "Multiple Answers", icon: CheckSquare,  description: "Select all answers that apply" },
  { value: "true_false",       label: "True / False",     icon: ToggleLeft,   description: "Simple binary question" },
  { value: "short_answer",     label: "Short Answer",     icon: AlignLeft,    description: "Student types a brief response" },
  { value: "essay",            label: "Essay",            icon: FileText,     description: "Long-form written response, manually graded" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newId(): string {
  return `qq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createEmpty(): QuizQuestion {
  return {
    id: newId(), type: "multiple_choice",
    text: "", options: ["", "", "", ""],
    correctAnswer: "", correctAnswers: [],
    points: 5, imageUrl: undefined, explanation: undefined,
  };
}

function normalize(q: QuizQuestion, type: QType): QuizQuestion {
  if (type === "multiple_choice")
    return { ...q, type, options: q.options?.length ? [...q.options] : ["", "", "", ""], correctAnswer: q.options?.includes(q.correctAnswer ?? "") ? (q.correctAnswer ?? "") : "", correctAnswers: [] };
  if (type === "multiple_answers")
    return { ...q, type, options: q.options?.length ? [...q.options] : ["", "", "", ""], correctAnswer: "", correctAnswers: [] };
  if (type === "true_false")
    return { ...q, type, options: ["True", "False"], correctAnswer: q.correctAnswer === "False" ? "False" : "True", correctAnswers: [] };
  if (type === "short_answer")
    return { ...q, type, options: undefined, correctAnswer: q.type === "short_answer" ? (q.correctAnswer ?? "") : "", correctAnswers: [] };
  return { ...q, type: "essay", options: undefined, correctAnswer: "", correctAnswers: [] };
}

// ─── TypePill ─────────────────────────────────────────────────────────────────

function TypePill({ type }: { type: QType }) {
  const t = QUESTION_TYPES.find((x) => x.value === type);
  if (!t) return null;
  const Icon = t.icon;
  const colors: Record<QType, string> = {
    multiple_choice:  "bg-blue-50   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
    multiple_answers: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    true_false:       "bg-amber-50  text-amber-700  dark:bg-amber-900/30  dark:text-amber-500",
    short_answer:     "bg-teal-50   text-teal-700   dark:bg-teal-900/30   dark:text-teal-400",
    essay:            "bg-rose-50   text-rose-700   dark:bg-rose-900/30   dark:text-rose-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${colors[type]}`}>
      <Icon className="h-3 w-3" />
      {t.label}
    </span>
  );
}

// ─── ImageArea ────────────────────────────────────────────────────────────────

function ImageArea({ imageUrl, onSet, onRemove }: { imageUrl?: string; onSet: (url: string) => void; onRemove: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);

  if (imageUrl) {
    return (
      <div className="relative rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Question image" className="w-full max-h-56 object-contain bg-gray-50 dark:bg-slate-800" />
        <button type="button" onClick={onRemove} className="absolute top-2 right-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-gray-200 dark:border-slate-600 p-1 text-gray-500 hover:text-red-500 shadow-sm">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4">
      {!showInput ? (
        <button type="button" onClick={() => setShowInput(true)}
          className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-gray-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/40 transition-colors w-full justify-center">
          <ImageIcon className="h-4 w-4" />
          Attach image to this question
        </button>
      ) : (
        <div className="flex gap-2">
          <input ref={inputRef} type="text" placeholder="Paste an image URL and press Enter…" autoFocus
            className="flex-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") { const v = (e.target as HTMLInputElement).value.trim(); if (v) { onSet(v); setShowInput(false); } }
              if (e.key === "Escape") setShowInput(false);
            }} />
          <button type="button" onClick={() => { const v = inputRef.current?.value.trim(); if (v) { onSet(v); setShowInput(false); } }}
            className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">Attach</button>
          <button type="button" onClick={() => setShowInput(false)}
            className="rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800">Cancel</button>
        </div>
      )}
    </div>
  );
}

// ─── Main builder ─────────────────────────────────────────────────────────────

export default function QuizBuilderPage() {
  const params   = useParams();
  const router   = useRouter();
  const courseId = params.id as string;
  const quizId   = params.quizId as string;
  const isNew    = quizId === "new";

  const initial = useMemo(
    () => (isNew ? undefined : QUIZZES.find((q) => q.id === quizId)),
    [quizId, isNew]
  );

  const [title,        setTitle]        = useState(initial?.title       ?? "Untitled Quiz");
  const [description,  setDescription]  = useState(initial?.description ?? "");
  const [timeLimit,    setTimeLimit]    = useState(initial?.timeLimit   ?? 30);
  const [attempts,     setAttempts]     = useState(initial?.attemptsAllowed ?? 1);
  const [shuffle,      setShuffle]      = useState(initial?.shuffleQuestions ?? false);
  const [passingScore, setPassingScore] = useState(initial?.passingScore ?? 0);
  const [showResults,  setShowResults]  = useState(initial?.showResultsAfter ?? true);
  const [dueDate,      setDueDate]      = useState(initial?.dueDate ?? "");
  const [status,       setStatus]       = useState<"published"|"draft">(initial?.status ?? "draft");
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [savedFlash,   setSavedFlash]   = useState(false);
  const [previewMode,  setPreviewMode]  = useState(false);
  const [expandedExp,  setExpandedExp]  = useState<Set<string>>(new Set());
  const [typePickerFor, setTypePickerFor] = useState<string | null>(null);

  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    initial?.questions?.length
      ? initial.questions.map((q) => ({ ...q, id: q.id || newId(), correctAnswers: q.correctAnswers ?? [] }))
      : []
  );

  const totalPoints = useMemo(
    () => questions.reduce((s, q) => s + (Number(q.points) || 0), 0),
    [questions]
  );

  // ── Question mutations ──────────────────────────────────────────────────────

  const updateQ = (i: number, patch: Partial<QuizQuestion>) =>
    setQuestions((prev) => { const n = [...prev]; if (!n[i]) return prev; n[i] = { ...n[i], ...patch }; return n; });

  const setType = (i: number, type: QType) => {
    setQuestions((prev) => { const n = [...prev]; if (!n[i]) return prev; n[i] = normalize({ ...n[i] }, type); return n; });
    setTypePickerFor(null);
  };

  const updateOption = (qi: number, oi: number, val: string) => {
    setQuestions((prev) => {
      const n = [...prev]; const cur = n[qi];
      if (!cur || !cur.options) return prev;
      const old = cur.options[oi];
      const opts = [...cur.options]; opts[oi] = val;
      let ca = cur.correctAnswer; let cas = [...(cur.correctAnswers ?? [])];
      if (ca === old) ca = val;
      const idx = cas.indexOf(old); if (idx !== -1) { cas = [...cas]; cas[idx] = val; }
      n[qi] = { ...cur, options: opts, correctAnswer: ca, correctAnswers: cas };
      return n;
    });
  };

  const addOption = (qi: number) =>
    setQuestions((prev) => { const n = [...prev]; const c = n[qi]; if (!c || !c.options) return prev; n[qi] = { ...c, options: [...c.options, ""] }; return n; });

  const removeOption = (qi: number, oi: number) => {
    setQuestions((prev) => {
      const n = [...prev]; const c = n[qi];
      if (!c || !c.options || c.options.length <= 2) return prev;
      const removed = c.options[oi];
      n[qi] = { ...c, options: c.options.filter((_, i) => i !== oi), correctAnswer: c.correctAnswer === removed ? "" : c.correctAnswer, correctAnswers: (c.correctAnswers ?? []).filter((v) => v !== removed) };
      return n;
    });
  };

  const toggleMultiAnswer = (qi: number, opt: string) =>
    setQuestions((prev) => { const n = [...prev]; const c = n[qi]; if (!c) return prev; const ca = c.correctAnswers ?? []; n[qi] = { ...c, correctAnswers: ca.includes(opt) ? ca.filter((v) => v !== opt) : [...ca, opt] }; return n; });

  const moveQ = (i: number, dir: "up" | "down") => {
    setQuestions((prev) => { const n = [...prev]; const t = dir === "up" ? i - 1 : i + 1; if (t < 0 || t >= n.length) return prev; [n[i], n[t]] = [n[t], n[i]]; return n; });
  };

  const duplicateQ = (i: number) =>
    setQuestions((prev) => { const n = [...prev]; const copy = { ...n[i], id: newId() }; n.splice(i + 1, 0, copy); return n; });

  const removeQ = (i: number) =>
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const toggleExp = (id: string) =>
    setExpandedExp((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleSave = () => {
    setSavedFlash(true);
    setTimeout(() => {
      setSavedFlash(false);
      if (isNew) router.push(`/lis/teacher/courses/${courseId}/quizzes`);
    }, 1200);
  };

  // ── Preview mode ────────────────────────────────────────────────────────────

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Preview — Student View</p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <button type="button" onClick={() => setPreviewMode(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm">
              <EyeOff className="h-4 w-4" /> Exit Preview
            </button>
          </div>
          <div className="space-y-5">
            {questions.map((q, i) => (
              <div key={q.id} className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a] text-xs font-bold text-white mt-0.5">{i + 1}</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{q.text || <em className="text-gray-400">No question text</em>}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TypePill type={q.type} />
                    <span className="text-xs text-gray-400">{q.points}pt</span>
                  </div>
                </div>
                {q.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={q.imageUrl} alt="" className="rounded-xl mb-4 max-h-48 object-contain w-full bg-gray-50 dark:bg-slate-800" />
                )}
                {(q.type === "multiple_choice" || q.type === "true_false") && q.options && (
                  <div className="space-y-2 ml-10">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 px-3 py-2.5 cursor-pointer hover:border-blue-300 transition-colors">
                        <input type="radio" name={`prev-${q.id}`} className="h-4 w-4 text-blue-600 border-gray-300" readOnly />
                        <span className="text-sm text-gray-700 dark:text-gray-200">{opt || <em className="text-gray-400">Option {oi + 1}</em>}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "multiple_answers" && q.options && (
                  <div className="space-y-2 ml-10">
                    <p className="text-xs text-gray-500 mb-2 font-medium">Select all that apply</p>
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 px-3 py-2.5 cursor-pointer hover:border-blue-300 transition-colors">
                        <input type="checkbox" className="h-4 w-4 rounded text-blue-600 border-gray-300" readOnly />
                        <span className="text-sm text-gray-700 dark:text-gray-200">{opt || <em className="text-gray-400">Option {oi + 1}</em>}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "short_answer" && (
                  <div className="ml-10">
                    <input type="text" placeholder="Type your answer here…" disabled className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm placeholder:text-gray-400" />
                  </div>
                )}
                {q.type === "essay" && (
                  <div className="ml-10">
                    <textarea rows={4} placeholder="Write your response here…" disabled className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm placeholder:text-gray-400 resize-none" />
                  </div>
                )}
              </div>
            ))}
            {questions.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-12 text-center">
                <p className="text-sm text-gray-400">No questions added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Builder ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-8 pb-32">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href={`/lis/teacher/courses/${courseId}/quizzes`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 mb-3">
              <ArrowLeft className="h-4 w-4" /> Back to quizzes
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isNew ? "New Quiz" : "Edit Quiz"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isNew
                ? "Build your quiz below — add questions, configure settings, then save."
                : "Editing an existing quiz. Changes are kept this session."}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={() => setPreviewMode(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              <Eye className="h-4 w-4" /> Preview
            </button>
            <button type="button" onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors">
              {savedFlash ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Quiz</>}
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm mb-5">
          <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Quiz Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xl font-bold text-gray-900 dark:text-white border-0 border-b-2 border-gray-100 dark:border-slate-700 focus:border-blue-500 focus:ring-0 px-0 py-2 mb-5 bg-transparent placeholder:text-gray-300 dark:placeholder:text-slate-600 outline-none transition-colors"
            placeholder="Enter quiz title…" />
          <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Instructions / Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
            placeholder="Instructions shown to students before they begin."
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y min-h-[80px]" />
        </div>

        {/* Settings */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden mb-6">
          <button type="button" onClick={() => setSettingsOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <span className="inline-flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm">
              <Settings className="h-4 w-4 text-blue-600" /> Quiz Settings
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{timeLimit}m &middot; {attempts} attempt{attempts !== 1 ? "s" : ""} &middot; {totalPoints} pts</span>
              {settingsOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
          </button>
          {settingsOpen && (
            <div className="border-t border-gray-100 dark:border-slate-800 px-5 py-5 bg-gray-50/50 dark:bg-slate-800/30">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5"><Clock className="h-3.5 w-3.5" /> Time (min)</label>
                  <input type="number" min={1} value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value) || 1)}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5"><ListOrdered className="h-3.5 w-3.5" /> Attempts</label>
                  <input type="number" min={1} value={attempts} onChange={(e) => setAttempts(Number(e.target.value) || 1)}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Pass score (%)</label>
                  <input type="number" min={0} max={100} value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5"><Clock className="h-3.5 w-3.5" /> Due date</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5 block">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 select-none">
                  <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Shuffle questions</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 select-none">
                  <input type="checkbox" checked={showResults} onChange={(e) => setShowResults(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Show results to students</span>
                </label>
              </div>
              <p className="mt-3 text-xs text-gray-400 dark:text-slate-500">
                Total points: <span className="font-semibold text-gray-700 dark:text-gray-300">{totalPoints}</span>
                {passingScore > 0 && <> &middot; Passing: <span className="font-semibold text-gray-700 dark:text-gray-300">{Math.round((passingScore / 100) * totalPoints)} pts ({passingScore}%)</span></>}
              </p>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Questions <span className="ml-1.5 text-sm font-normal text-gray-400">({questions.length})</span>
            </h2>
            <button type="button" onClick={() => setQuestions((p) => [...p, createEmpty()])}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors">
              <Plus className="h-3.5 w-3.5" /> Add Question
            </button>
          </div>

          {questions.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-14 text-center shadow-sm">
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-5">Choose a question type to get started</p>
              <div className="flex flex-wrap justify-center gap-3">
                {QUESTION_TYPES.map(({ value, label, icon: Icon }) => (
                  <button key={value} type="button" onClick={() => setQuestions([{ ...createEmpty(), type: value }])}
                    className="flex items-center gap-2 rounded-xl border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 shadow-sm transition-all">
                    <Icon className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {questions.map((q, index) => (
            <article key={q.id} className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-start gap-3 p-5">
                {/* Left gutter */}
                <div className="flex flex-col items-center gap-1.5 mt-0.5 shrink-0">
                  <GripVertical className="h-4 w-4 text-gray-300 dark:text-slate-600" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1e3a8a] text-xs font-bold text-white">{index + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Row: type picker + controls */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <div className="relative">
                      <button type="button" onClick={() => setTypePickerFor(typePickerFor === q.id ? null : q.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <TypePill type={q.type} />
                        <ChevronDown className="h-3 w-3 text-gray-400 ml-0.5" />
                      </button>
                      {typePickerFor === q.id && (
                        <div className="absolute top-full left-0 mt-1 z-50 w-72 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
                          {QUESTION_TYPES.map(({ value, label, icon: Icon, description }) => (
                            <button key={value} type="button" onClick={() => setType(index, value)}
                              className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors ${q.type === value ? "bg-blue-50 dark:bg-blue-950/30" : ""}`}>
                              <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                                <p className="text-xs text-gray-400 dark:text-slate-500">{description}</p>
                              </div>
                              {q.type === value && <ChevronRight className="h-4 w-4 text-blue-600 ml-auto shrink-0 mt-0.5" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="ml-auto flex items-center gap-1">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300">
                        Pts:
                        <input type="number" min={0} step={0.5} value={q.points}
                          onChange={(e) => updateQ(index, { points: Number(e.target.value) || 0 })}
                          className="w-14 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-right shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                      </label>
                      <button type="button" onClick={() => moveQ(index, "up")} disabled={index === 0}
                        className="rounded-lg border border-gray-200 dark:border-slate-700 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" title="Move up">
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => moveQ(index, "down")} disabled={index === questions.length - 1}
                        className="rounded-lg border border-gray-200 dark:border-slate-700 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" title="Move down">
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => duplicateQ(index)}
                        className="rounded-lg border border-gray-200 dark:border-slate-700 p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" title="Duplicate">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => removeQ(index)}
                        className="rounded-lg border border-red-100 dark:border-red-900/50 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Question text */}
                  <textarea value={q.text} onChange={(e) => updateQ(index, { text: e.target.value })} rows={2}
                    placeholder="Type the question here…"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y min-h-[64px] mb-3" />

                  {/* Image */}
                  <ImageArea imageUrl={q.imageUrl} onSet={(url) => updateQ(index, { imageUrl: url })} onRemove={() => updateQ(index, { imageUrl: undefined })} />

                  {/* Answer area */}
                  {(q.type === "multiple_choice" || q.type === "multiple_answers") && q.options && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                          {q.type === "multiple_choice" ? "Choices — radio = correct answer" : "Choices — check all correct answers"}
                        </p>
                        {q.options.length < 8 && (
                          <button type="button" onClick={() => addOption(index)} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                            <Plus className="h-3 w-3" /> Add option
                          </button>
                        )}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, oi) => {
                          const correctSingle = q.type === "multiple_choice" && q.correctAnswer === opt && opt !== "";
                          const correctMulti  = q.type === "multiple_answers" && (q.correctAnswers ?? []).includes(opt) && opt !== "";
                          const isCorrect = correctSingle || correctMulti;
                          return (
                            <div key={oi} className={`flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm transition-all ${isCorrect ? "border-emerald-400 ring-2 ring-emerald-400/20 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-600" : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"}`}>
                              {q.type === "multiple_choice" ? (
                                <input type="radio" name={`c-${q.id}`} checked={correctSingle} onChange={() => updateQ(index, { correctAnswer: opt })} className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 shrink-0" />
                              ) : (
                                <input type="checkbox" checked={correctMulti} onChange={() => toggleMultiAnswer(index, opt)} className="h-4 w-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500 shrink-0" />
                              )}
                              <input type="text" value={opt} onChange={(e) => updateOption(index, oi, e.target.value)} placeholder={`Option ${oi + 1}`}
                                className="flex-1 min-w-0 border-0 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-0 p-0 outline-none" />
                              {q.options!.length > 2 && (
                                <button type="button" onClick={() => removeOption(index, oi)} className="shrink-0 text-gray-300 dark:text-slate-600 hover:text-red-500 transition-colors">
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">
                        {q.type === "multiple_choice" ? "Click the radio button to mark the correct answer." : "Check every option that is correct."}
                      </p>
                    </div>
                  )}

                  {q.type === "true_false" && q.options && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Correct Answer</p>
                      <div className="flex gap-3">
                        {q.options.map((opt) => (
                          <label key={opt} className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium cursor-pointer transition-all shadow-sm ${q.correctAnswer === opt ? "border-emerald-400 ring-2 ring-emerald-400/20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:border-gray-300"}`}>
                            <input type="radio" name={`tf-${q.id}`} checked={q.correctAnswer === opt} onChange={() => updateQ(index, { correctAnswer: opt })} className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {q.type === "short_answer" && (
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Correct Answer / Grading Key</label>
                      <input type="text" value={q.correctAnswer} onChange={(e) => updateQ(index, { correctAnswer: e.target.value })} placeholder="Expected answer or key phrase"
                        className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                      <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Auto-grading checks if the student&apos;s answer contains this text (case-insensitive).</p>
                    </div>
                  )}

                  {q.type === "essay" && (
                    <div className="mb-4 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/30 px-4 py-3">
                      <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">Essay / Long Response</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Students will see a large text area. This question type is manually graded.</p>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
                    <button type="button" onClick={() => toggleExp(q.id)}
                      className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      {expandedExp.has(q.id) ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedExp.has(q.id) ? "Hide explanation" : "Add explanation (shown after answering)"}
                    </button>
                    {expandedExp.has(q.id) && (
                      <textarea value={q.explanation ?? ""} onChange={(e) => updateQ(index, { explanation: e.target.value || undefined })} rows={2}
                        placeholder="Explain why the answer is correct…"
                        className="mt-2 w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y min-h-[52px]" />
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}

          {/* Add question type buttons */}
          {questions.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {QUESTION_TYPES.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" onClick={() => setQuestions((p) => [...p, { ...createEmpty(), type: value }])}
                  className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 px-2 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/40 transition-colors shadow-sm">
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom save bar */}
        {questions.length > 0 && (
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 shadow-sm">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{title || "Untitled Quiz"}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{questions.length} questions &middot; {totalPoints} pts &middot; {timeLimit} min</p>
            </div>
            <button type="button" onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors">
              {savedFlash ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Quiz</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
