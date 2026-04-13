"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, HelpCircle, Clock, RefreshCw, Shuffle } from "lucide-react";
import { QUIZZES, CLASSES } from "@/data/teacher-mock-data";
import { ClassPickerModal } from "@/components/teacher/class-picker-modal";

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function AllQuizzesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const sorted = [...QUIZZES].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const today  = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">All Quizzes &amp; Exams</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Every quiz and exam across all your courses</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#162554] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> New Quiz
        </button>
      </div>

      {modalOpen && <ClassPickerModal destination="quizzes" onClose={() => setModalOpen(false)} />}

      {CLASSES.map((cls) => {
        const items = sorted.filter((q) => q.classId === cls.id);
        return (
          <div key={cls.id} className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cls.color }} />
                <h2 className="font-semibold text-gray-900 dark:text-white">{cls.name}</h2>
                <span className="text-xs text-gray-400 dark:text-slate-500">{cls.section}</span>
              </div>
              <Link href={`/lis/teacher/courses/${cls.id}/quizzes`} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Manage →
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-slate-500">
                <HelpCircle className="w-8 h-8 mb-2" />
                <p className="text-sm">No quizzes yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {items.map((q) => (
                  <Link
                    key={q.id}
                    href={`/lis/teacher/courses/${cls.id}/quizzes/${q.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {q.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{q.description}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" />{q.questions.length} Qs</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{q.timeLimit} min</span>
                      <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" />{q.attemptsAllowed}×</span>
                      <span className="hidden sm:block">Due {formatDate(q.dueDate)}</span>
                    </div>
                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${q.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {q.status === "published" ? "Published" : "Draft"}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
