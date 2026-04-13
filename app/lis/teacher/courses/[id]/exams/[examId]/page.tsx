"use client";

import { useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { EXAMS, QuizQuestion } from "@/data/teacher-mock-data";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Settings,
  ChevronDown,
  ChevronUp,
  Clock,
  ListOrdered,
  Image as ImageIcon,
  ChevronRight,
  GripVertical,
  Copy,
  Eye,
  EyeOff,
  CheckSquare,
  Circle,
  AlignLeft,
  FileText,
  ToggleLeft,
  ShieldCheck,
  X,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type QType = QuizQuestion["type"];

const QUESTION_TYPES: { value: QType; label: string; icon: React.ElementType; description: string }[] = [
  { value: "multiple_choice",  label: "Multiple Choice",  icon: Circle,       description: "One correct answer from several options" },
  { value: "multiple_answers", label: "Multiple Answers", icon: CheckSquare,  description: "Select all answers that apply" },
  { value: "true_false",       label: "True / False",     icon: ToggleLeft,   description: "Simple binary question" },
  { value: "short_answer",     label: "Short Answer",     icon: AlignLeft,    description: "Student types a brief response" },
  { value: "essay",            label: "Essay",            icon: FileText,     description: "Long-form written response, manually graded" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newId(): string {
  return `eq-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function createEmpty(): QuizQuestion {
  return {
    id: newId(),
    type: "multiple_choice",
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    correctAnswers: [],
    points: 10,
    imageUrl: undefined,
    explanation: undefined,
  };
}

function normalize(q: QuizQuestion, type: QType): QuizQuestion {
  if (type === "multiple_choice") {
    return { ...q, type, options: q.options?.length ? [...q.options] : ["", "", "", ""], correctAnswer: q.options?.includes(q.correctAnswer ?? "") ? (q.correctAnswer ?? "") : "", correctAnswers: [] };
  }
  if (type === "multiple_answers") {
    return { ...q, type, options: q.options?.length ? [...q.options] : ["", "", "", ""], correctAnswer: "", correctAnswers: [] };
  }
  if (type === "true_false") {
    return { ...q, type, options: ["True", "False"], correctAnswer: q.correctAnswer === "False" ? "False" : "True", correctAnswers: [] };
  }
  if (type === "short_answer") {
    return { ...q, type, options: undefined, correctAnswer: q.type === "short_answer" ? (q.correctAnswer ?? "") : "", correctAnswers: [] };
  }
  return { ...q, type: "essay", options: undefined, correctAnswer: "", correctAnswers: [] };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function TypePill({ type }: { type: QType }) {
  const t = QUESTION_TYPES.find((x) => x.value === type);
  if (!t) return null;
  const Icon = t.icon;
  const colors: Record<QType, string> = {
    multiple_choice:  "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    multiple_answers: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    true_false:       "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500",
    short_answer:     "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    essay:            "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${colors[type]}`}>
      <Icon className="h-3 w-3" />
      {t.label}
    </span>
  );
}

function ImageArea({ imageUrl, onSet, onRemove }: { imageUrl?: string; onSet: (url: string) => void; onRemove: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (imageUrl) {
    return (
      <div className="relative rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Question image" className="w-full max-h-56 object-contain bg-gray-50 dark:bg-slate-800" />
        <button type="button" onClick={onRemove} className="absolute top-2 right-2 rounded-full bg-white/90 dark:bg-slate-800/90 border border-gray-200 dark:border-slate-600 p-1 text-gray-500 hover:text-red-500 shadow-sm" title="Remove image">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 px-4 py-3 text-sm text-gray-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/40 transition-colors w-full justify-center"
      >
        <ImageIcon className="h-4 w-4" />
        Attach image to this question
      </button>
      <input
        ref={inputRef}
        type="text"
        placeholder="Paste an image URL…"
        className="mt-2 w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
        onBlur={(e) => { if (e.target.value.trim()) { onSet(e.target.value.trim()); e.target.value = ""; } }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const val = (e.target as HTMLInputElement).value.trim();
            if (val) { onSet(val); (e.target as HTMLInputElement).value = ""; }
          }
        }}
      />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExamBuilderPage() {
  const params   = useParams();
  const router   = useRouter();
  const courseId = params.id as string;
  const examId   = params.examId as string;
  const isNew    = examId === "new";

  const initial = useMemo(
    () => (isNew ? undefined : EXAMS.find((e) => e.id === examId)),
    [examId, isNew]
  );

  const [title,        setTitle]        = useState(initial?.title       ?? "Untitled Exam");
  const [description,  setDescription]  = useState(initial?.description ?? "");
  const [timeLimit,    setTimeLimit]    = useState(initial?.timeLimit   ?? 90);
  const [attempts,     setAttempts]     = useState(initial?.attemptsAllowed ?? 1);
  const [passingScore, setPassingScore] = useState(initial?.passingScore ?? 75);
  const [showResults,  setShowResults]  = useState(initial?.showResultsAfter ?? false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [savedFlash,   setSavedFlash]   = useState(false);
  const [previewMode,  setPreviewMode]  = useState(false);
  const [expandedExp,  setExpandedExp]  = useState<Set<string>>(new Set());
  const [typePickerFor, setTypePickerFor] = useState<string | null>(null);

  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    initial?.questions?.length
      ? initial.questions.map((q) => ({ ...q, id: q.id || newId(), correctAnswers: q.correctAnswers ?? [], imageUrl: q.imageUrl, explanation: q.explanation }))
      : []
  );

  const totalPoints = useMemo(() => questions.reduce((s, q) => s + (Number(q.points) || 0), 0), [questions]);

  // ─── Question mutations ────────────────────────────────────────────────────

  const updateQ = (index: number, patch: Partial<QuizQuestion>) => {
    setQuestions((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const setType = (index: number, type: QType) => {
    setQuestions((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = normalize({ ...next[index] }, type);
      return next;
    });
    setTypePickerFor(null);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      const cur = next[qIndex];
      if (!cur || !cur.options) return prev;
      const oldVal = cur.options[optIndex];
      const opts = [...cur.options];
      opts[optIndex] = value;
      let correctAnswer = cur.correctAnswer;
      let correctAnswers = [...(cur.correctAnswers ?? [])];
      if (correctAnswer === oldVal) correctAnswer = value;
      const idx = correctAnswers.indexOf(oldVal);
      if (idx !== -1) { correctAnswers = [...correctAnswers]; correctAnswers[idx] = value; }
      next[qIndex] = { ...cur, options: opts, correctAnswer, correctAnswers };
      return next;
    });
  };

  const addOption = (qIndex: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      const cur = next[qIndex];
      if (!cur || !cur.options) return prev;
      next[qIndex] = { ...cur, options: [...cur.options, ""] };
      return next;
    });
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      const cur = next[qIndex];
      if (!cur || !cur.options || cur.options.length <= 2) return prev;
      const removedVal = cur.options[optIndex];
      const opts = cur.options.filter((_, i) => i !== optIndex);
      const correctAnswer = cur.correctAnswer === removedVal ? "" : cur.correctAnswer;
      const correctAnswers = (cur.correctAnswers ?? []).filter((v) => v !== removedVal);
      next[qIndex] = { ...cur, options: opts, correctAnswer, correctAnswers };
      return next;
    });
  };

  const toggleMultiAnswer = (qIndex: number, option: string) => {
    setQuestions((prev) => {
      const next = [...prev];
      const cur = next[qIndex];
      if (!cur) return prev;
      const ca = cur.correctAnswers ?? [];
      const newCa = ca.includes(option) ? ca.filter((v) => v !== option) : [...ca, option];
      next[qIndex] = { ...cur, correctAnswers: newCa };
      return next;
    });
  };

  const moveQuestion = (index: number, direction: "up" | "down") => {
    setQuestions((prev) => {
      const next = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const duplicateQuestion = (index: number) => {
    setQuestions((prev) => {
      const next = [...prev];
      const copy = { ...next[index], id: newId() };
      next.splice(index + 1, 0, copy);
      return next;
    });
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleExp = (id: string) => {
    setExpandedExp((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    setSavedFlash(true);
    setTimeout(() => {
      setSavedFlash(false);
      if (isNew) router.push(`/lis/teacher/courses/${courseId}/exams`);
    }, 1200);
  };

  // ─── Preview mode ──────────────────────────────────────────────────────────

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Preview — Student View</p>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm"
            >
              <EyeOff className="h-4 w-4" /> Exit Preview
            </button>
          </div>
          <div className="space-y-5">
            {questions.map((q, i) => (
              <div key={q.id} className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a] text-xs font-bold text-white mt-0.5">{i + 1}</span>
                    <p className="text-sm font-medium text-gray-900 dark:text-white leading-relaxed">{q.text || <span className="text-gray-400 italic">No question text</span>}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TypePill type={q.type} />
                    <span className="text-xs text-gray-400">{q.points} pt{q.points !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                {q.imageUrl && <img src={q.imageUrl} alt="" className="rounded-xl mb-4 max-h-48 object-contain w-full bg-gray-50 dark:bg-slate-800" />}
                {(q.type === "multiple_choice" || q.type === "true_false") && q.options && (
                  <div className="space-y-2 ml-10">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 px-3 py-2.5 cursor-pointer hover:border-blue-300 transition-colors">
                        <input type="radio" name={`preview-${q.id}`} className="h-4 w-4 text-blue-600 border-gray-300" readOnly />
                        <span className="text-sm text-gray-700 dark:text-gray-200">{opt || <span className="text-gray-400 italic">Option {oi + 1}</span>}</span>
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
                        <span className="text-sm text-gray-700 dark:text-gray-200">{opt || <span className="text-gray-400 italic">Option {oi + 1}</span>}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === "short_answer" && (
                  <div className="ml-10">
                    <input type="text" placeholder="Type your answer here…" disabled className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-500 placeholder:text-gray-400" />
                  </div>
                )}
                {q.type === "essay" && (
                  <div className="ml-10">
                    <textarea rows={4} placeholder="Write your response here…" disabled className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-gray-500 placeholder:text-gray-400 resize-none" />
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

  // ─── Builder mode ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 lg:py-8 pb-24">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href={`/lis/teacher/courses/${courseId}/exams`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to exams
            </Link>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-5 w-5 text-[#1e3a8a]" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {isNew ? "New Exam" : "Edit Exam"}
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isNew
                ? "Build your exam below — add questions, set a time limit, then save."
                : "Editing an existing exam — changes are kept this session."}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {savedFlash && <span className="text-sm font-medium text-emerald-600">Saved!</span>}
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Eye className="h-4 w-4" /> Preview
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
            >
              {savedFlash ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Exam</>}
            </button>
          </div>
        </div>

        {/* Title & description */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm mb-5">
          <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Exam Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-bold text-gray-900 dark:text-white border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 px-0 py-1 mb-5 bg-transparent placeholder:text-gray-300 dark:placeholder:text-slate-600 outline-none"
            placeholder="Exam title…"
          />
          <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Instructions</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Instructions displayed to students before the exam begins."
            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/80 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-gray-800 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y min-h-[80px]"
          />
        </div>

        {/* Settings */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden mb-6">
          <button
            type="button"
            onClick={() => setSettingsOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors"
          >
            <span className="inline-flex items-center gap-2 font-semibold text-gray-900 dark:text-white text-sm">
              <Settings className="h-4 w-4 text-blue-600" />
              Exam Settings
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {timeLimit}m &middot; {attempts} attempt{attempts !== 1 ? "s" : ""} &middot; {passingScore}% passing &middot; {totalPoints} pts
              </span>
              {settingsOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </div>
          </button>

          {settingsOpen && (
            <div className="border-t border-gray-100 dark:border-slate-800 px-5 py-5 bg-gray-50/50 dark:bg-slate-800/30">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                    <Clock className="h-3.5 w-3.5" /> Time limit (min)
                  </label>
                  <input
                    type="number" min={1} value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value) || 1)}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                    <ListOrdered className="h-3.5 w-3.5" /> Attempts allowed
                  </label>
                  <input
                    type="number" min={1} value={attempts}
                    onChange={(e) => setAttempts(Number(e.target.value) || 1)}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-400 mb-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> Passing score (%)
                  </label>
                  <input
                    type="number" min={0} max={100} value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value) || 0)}
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800">
                    <input type="checkbox" checked={showResults} onChange={(e) => setShowResults(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-200">
                      <Eye className="h-3.5 w-3.5 text-gray-400" /> Show results after
                    </span>
                  </label>
                </div>
              </div>
              <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
                <p className="text-xs text-gray-500 dark:text-slate-500">
                  Total points: <span className="font-semibold text-gray-800 dark:text-gray-200">{totalPoints}</span>
                  {passingScore > 0 && (
                    <> &middot; Passing threshold: <span className="font-semibold text-gray-800 dark:text-gray-200">{Math.round((passingScore / 100) * totalPoints)} pts ({passingScore}%)</span></>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              Questions
              <span className="ml-2 text-sm font-normal text-gray-400">({questions.length})</span>
            </h2>
            <button
              type="button"
              onClick={() => setQuestions((prev) => [...prev, createEmpty()])}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Add Question
            </button>
          </div>

          {questions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-14 text-center shadow-sm">
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {QUESTION_TYPES.map(({ value, label, icon: Icon }) => (
                  <button key={value} type="button" onClick={() => setQuestions([{ ...createEmpty(), type: value }])}
                    className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm transition-colors">
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 dark:text-slate-500">Choose a question type above or</p>
              <button type="button" onClick={() => setQuestions([createEmpty()])}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                <Plus className="h-4 w-4" /> Add Question
              </button>
            </div>
          )}

          {questions.map((q, index) => (
            <article key={q.id} className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-start gap-3 px-5 pt-5 pb-0">
                <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
                  <GripVertical className="h-4 w-4 text-gray-300 dark:text-slate-600 cursor-grab" />
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1e3a8a] text-xs font-bold text-white">{index + 1}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <div className="relative">
                      <button type="button" onClick={() => setTypePickerFor(typePickerFor === q.id ? null : q.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <TypePill type={q.type} />
                        <ChevronDown className="h-3 w-3 text-gray-400 ml-0.5" />
                      </button>
                      {typePickerFor === q.id && (
                        <div className="absolute top-full left-0 mt-1 z-50 min-w-[260px] rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
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
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 pr-1">
                        Points:
                        <input type="number" min={0} step={0.5} value={q.points}
                          onChange={(e) => updateQ(index, { points: Number(e.target.value) || 0 })}
                          className="w-16 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-right shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                      </label>
                      <button type="button" onClick={() => moveQuestion(index, "up")} disabled={index === 0}
                        className="rounded-lg border border-gray-200 dark:border-slate-700 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" title="Move up">
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => moveQuestion(index, "down")} disabled={index === questions.length - 1}
                        className="rounded-lg border border-gray-200 dark:border-slate-700 p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" title="Move down">
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => duplicateQuestion(index)}
                        className="rounded-lg border border-gray-200 dark:border-slate-700 p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors" title="Duplicate">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button type="button" onClick={() => removeQuestion(index)}
                        className="rounded-lg border border-red-100 dark:border-red-900/50 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea value={q.text} onChange={(e) => updateQ(index, { text: e.target.value })} rows={2}
                    placeholder="Type the question here…"
                    className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y min-h-[64px] mb-4" />

                  <ImageArea imageUrl={q.imageUrl} onSet={(url) => updateQ(index, { imageUrl: url })} onRemove={() => updateQ(index, { imageUrl: undefined })} />

                  {(q.type === "multiple_choice" || q.type === "multiple_answers") && q.options && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide">
                          {q.type === "multiple_choice" ? "Answer Choices — select one correct" : "Answer Choices — check all correct"}
                        </p>
                        {q.options.length < 8 && (
                          <button type="button" onClick={() => addOption(index)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700">
                            <Plus className="h-3 w-3" /> Add option
                          </button>
                        )}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, oi) => {
                          const isCorrectSingle = q.type === "multiple_choice" && q.correctAnswer === opt && opt !== "";
                          const isCorrectMulti  = q.type === "multiple_answers" && (q.correctAnswers ?? []).includes(opt) && opt !== "";
                          const isCorrect = isCorrectSingle || isCorrectMulti;
                          return (
                            <div key={oi} className={`flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm transition-all ${isCorrect ? "border-emerald-400 ring-2 ring-emerald-400/20 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-600" : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800"}`}>
                              {q.type === "multiple_choice" ? (
                                <input type="radio" name={`correct-${q.id}`} checked={isCorrectSingle} onChange={() => updateQ(index, { correctAnswer: opt })} className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500 shrink-0" />
                              ) : (
                                <input type="checkbox" checked={isCorrectMulti} onChange={() => toggleMultiAnswer(index, opt)} className="h-4 w-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500 shrink-0" />
                              )}
                              <input type="text" value={opt} onChange={(e) => updateOption(index, oi, e.target.value)} placeholder={`Option ${oi + 1}`}
                                className="flex-1 min-w-0 border-0 bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:ring-0 p-0 outline-none" />
                              {q.options!.length > 2 && (
                                <button type="button" onClick={() => removeOption(index, oi)} className="shrink-0 text-gray-300 dark:text-slate-600 hover:text-red-500 transition-colors" title="Remove option">
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {q.type === "true_false" && q.options && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">Correct Answer</p>
                      <div className="flex gap-3">
                        {q.options.map((opt) => (
                          <label key={opt} className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium cursor-pointer transition-all shadow-sm ${q.correctAnswer === opt ? "border-emerald-400 ring-2 ring-emerald-400/20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400" : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200"}`}>
                            <input type="radio" name={`tf-${q.id}`} checked={q.correctAnswer === opt} onChange={() => updateQ(index, { correctAnswer: opt })} className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500" />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {q.type === "short_answer" && (
                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Correct Answer / Grading Key</label>
                      <input type="text" value={q.correctAnswer} onChange={(e) => updateQ(index, { correctAnswer: e.target.value })} placeholder="Expected answer or key phrase"
                        className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                    </div>
                  )}

                  {q.type === "essay" && (
                    <div className="mb-4 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/30 px-4 py-3">
                      <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-1">Essay / Long Response</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">Students will write an extended response. This question is manually graded.</p>
                    </div>
                  )}

                  <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
                    <button type="button" onClick={() => toggleExp(q.id)}
                      className="flex items-center gap-2 text-xs font-medium text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      {expandedExp.has(q.id) ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {expandedExp.has(q.id) ? "Hide explanation" : "Add explanation (shown after submission)"}
                    </button>
                    {expandedExp.has(q.id) && (
                      <textarea value={q.explanation ?? ""} onChange={(e) => updateQ(index, { explanation: e.target.value || undefined })} rows={2}
                        placeholder="Optional: explain why the answer is correct…"
                        className="mt-2 w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-y min-h-[56px]" />
                    )}
                  </div>
                </div>
              </div>
              <div className="h-4" />
            </article>
          ))}

          {questions.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {QUESTION_TYPES.map(({ value, label, icon: Icon }) => (
                <button key={value} type="button" onClick={() => setQuestions((prev) => [...prev, { ...createEmpty(), type: value }])}
                  className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 px-2 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/40 transition-colors shadow-sm">
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-4 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{title || "Untitled Exam"}</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                {questions.length} questions &middot; {totalPoints} pts &middot; {timeLimit} min &middot; Pass: {passingScore}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors">
                {savedFlash ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : <><Save className="h-4 w-4" /> Save Exam</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
