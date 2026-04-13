"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ChevronRight } from "lucide-react";
import { CLASSES, Class } from "@/data/teacher-mock-data";

export type ContentDestination =
  | "assignments"
  | "quizzes"
  | "discussions"
  | "announcements";

const DESTINATION_LABEL: Record<ContentDestination, string> = {
  assignments:   "Assignment",
  quizzes:       "Quiz",
  discussions:   "Discussion",
  announcements: "Announcement",
};

function getRoute(classId: string, dest: ContentDestination): string {
  if (dest === "quizzes") return `/lis/teacher/courses/${classId}/quizzes/new`;
  return `/lis/teacher/courses/${classId}/${dest}?create=1`;
}

interface ClassPickerModalProps {
  destination: ContentDestination;
  onClose: () => void;
}

export function ClassPickerModal({ destination, onClose }: ClassPickerModalProps) {
  const router = useRouter();
  const label  = DESTINATION_LABEL[destination];

  function handleSelect(cls: Class) {
    router.push(getRoute(cls.id, destination));
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-slate-700 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">
              New {label}
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
              Choose which class to create it in
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Class list */}
        <div className="p-3 space-y-1.5">
          {CLASSES.map((cls) => (
            <button
              key={cls.id}
              onClick={() => handleSelect(cls)}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-[#1e3a8a] dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-150 text-left group"
            >
              {/* Course thumbnail */}
              <div className="w-11 h-11 rounded-xl flex-shrink-0 overflow-hidden relative">
                <Image
                  src={cls.image}
                  alt={cls.name}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ backgroundColor: cls.color }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {cls.name}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-slate-500">
                  {cls.section} · {cls.gradeLevel}
                </p>
              </div>

              {/* Arrow */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-slate-800 group-hover:bg-[#1e3a8a] transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] text-gray-400 dark:text-slate-500 pb-4">
          You&apos;ll be taken directly to the {label.toLowerCase()} builder
        </p>
      </div>
    </div>
  );
}
