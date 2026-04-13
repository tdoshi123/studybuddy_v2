"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, MessageCircle, Pin } from "lucide-react";
import { DISCUSSIONS, CLASSES } from "@/data/teacher-mock-data";
import { ClassPickerModal } from "@/components/teacher/class-picker-modal";

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function totalReplies(replies: { replies?: unknown[] }[]): number {
  let count = 0;
  for (const r of replies) {
    count += 1;
    if (r.replies) count += totalReplies(r.replies as { replies?: unknown[] }[]);
  }
  return count;
}

export default function AllDiscussionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">All Discussions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Discussion boards across all your courses</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#162554] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> New Discussion
        </button>
      </div>

      {modalOpen && <ClassPickerModal destination="discussions" onClose={() => setModalOpen(false)} />}

      {CLASSES.map((cls) => {
        const items = DISCUSSIONS.filter((d) => d.classId === cls.id).sort((a, b) => {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return b.createdAt.localeCompare(a.createdAt);
        });

        return (
          <div key={cls.id} className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cls.color }} />
                <h2 className="font-semibold text-gray-900 dark:text-white">{cls.name}</h2>
                <span className="text-xs text-gray-400 dark:text-slate-500">{cls.section}</span>
              </div>
              <Link href={`/lis/teacher/courses/${cls.id}/discussions`} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Manage →
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-slate-500">
                <MessageCircle className="w-8 h-8 mb-2" />
                <p className="text-sm">No discussions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {items.map((d) => (
                  <Link
                    key={d.id}
                    href={`/lis/teacher/courses/${cls.id}/discussions`}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {d.title}
                        </p>
                        {d.pinned && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            <Pin className="w-3 h-3" /> Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{d.prompt}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{totalReplies(d.replies)} replies</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{formatDate(d.createdAt)}</p>
                    </div>
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
