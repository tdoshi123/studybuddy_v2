"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText, HelpCircle, FolderOpen, ClipboardList } from "lucide-react";
import { ASSIGNMENTS, CLASSES } from "@/data/teacher-mock-data";
import { ClassPickerModal } from "@/components/teacher/class-picker-modal";

const TYPE_STYLES: Record<string, string> = {
  Assignment: "bg-blue-50 text-blue-700 ring-blue-200",
  Quiz:       "bg-purple-50 text-purple-700 ring-purple-200",
  Project:    "bg-amber-50 text-amber-700 ring-amber-200",
  Exam:       "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function AllAssignmentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const sorted = [...ASSIGNMENTS].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const today  = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">All Assignments</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Every assignment across all your courses</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#162554] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> New Assignment
        </button>
      </div>

      {modalOpen && <ClassPickerModal destination="assignments" onClose={() => setModalOpen(false)} />}

      {/* Per-course sections */}
      {CLASSES.map((cls) => {
        const items = sorted.filter((a) => a.classId === cls.id);
        return (
          <div key={cls.id} className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cls.color }} />
                <h2 className="font-semibold text-gray-900 dark:text-white">{cls.name}</h2>
                <span className="text-xs text-gray-400 dark:text-slate-500">{cls.section}</span>
              </div>
              <Link
                href={`/lis/teacher/courses/${cls.id}/assignments`}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Manage →
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-slate-500">
                <ClipboardList className="w-8 h-8 mb-2" />
                <p className="text-sm">No assignments yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800">
                    <th className="text-left py-2.5 px-5 text-xs font-medium text-gray-500 dark:text-slate-400">Title</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500 dark:text-slate-400">Type</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500 dark:text-slate-400">Due</th>
                    <th className="text-right py-2.5 px-3 text-xs font-medium text-gray-500 dark:text-slate-400">Points</th>
                    <th className="text-right py-2.5 px-5 text-xs font-medium text-gray-500 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((a) => (
                    <tr key={a.id} className="border-b border-gray-50 dark:border-slate-800/60 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-5">
                        <Link
                          href={`/lis/teacher/courses/${cls.id}/assignments/${a.id}`}
                          className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {a.title}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ${TYPE_STYLES[a.type] ?? "bg-gray-100 text-gray-600 ring-gray-200"}`}>
                          {a.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400">{formatDate(a.dueDate)}</td>
                      <td className="py-3 px-3 text-sm text-gray-600 dark:text-gray-400 text-right">{a.points} pts</td>
                      <td className="py-3 px-5 text-right">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${a.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {a.status === "published" ? "Published" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
