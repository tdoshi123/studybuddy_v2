"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, Star, AlertTriangle, Award, ThumbsUp, Mail, X } from "lucide-react";

const STUDENTS = [
  { id: "1", name: "Alex Johnson", grade: "5th Grade" },
  { id: "2", name: "Emma Johnson", grade: "3rd Grade" },
];

type CommentCategory = "achievement" | "behavior" | "progress" | "concern";

interface TeacherComment {
  id: string;
  teacher: string;
  course: string;
  date: string;
  category: CommentCategory;
  comment: string;
}

const ALEX_COMMENTS: TeacherComment[] = [
  {
    id: "ac1",
    teacher: "Julia Arlington",
    course: "Language Arts Grade 5",
    date: "Mar 28, 2026",
    category: "achievement",
    comment: "Alex scored a perfect 100% on the persuasive essay assignment. His writing has improved tremendously this quarter — clear thesis statements, strong supporting evidence, and excellent vocabulary usage. Very proud of his progress!",
  },
  {
    id: "ac2",
    teacher: "Julia Arlington",
    course: "Math Grade 5",
    date: "Mar 20, 2026",
    category: "progress",
    comment: "Alex has been working hard on fractions and decimals. While he still occasionally struggles with multi-step word problems, he's shown consistent improvement on homework and class participation. Encourage him to keep practicing at home.",
  },
  {
    id: "ac3",
    teacher: "Julia Arlington",
    course: "Science Grade 5",
    date: "Mar 15, 2026",
    category: "behavior",
    comment: "Alex has been a great lab partner and collaborator during our ecosystems unit. He's respectful, stays focused, and helps other students who are struggling with the material.",
  },
  {
    id: "ac4",
    teacher: "Julia Arlington",
    course: "Social Studies Grade 5",
    date: "Mar 10, 2026",
    category: "achievement",
    comment: "Excellent presentation on the American Revolution! Alex clearly put a lot of research into his project and delivered it with confidence in front of the class.",
  },
  {
    id: "ac5",
    teacher: "Michael H. Garrett",
    course: "Art Grade 5",
    date: "Feb 28, 2026",
    category: "achievement",
    comment: "Alex has real artistic talent. His watercolor landscapes were among the best in the class. I'd encourage him to consider joining the after-school art club.",
  },
  {
    id: "ac6",
    teacher: "Julia Arlington",
    course: "Homeroom Grade 05",
    date: "Feb 20, 2026",
    category: "concern",
    comment: "Alex has had 4 half-day absences this quarter. While his academic performance hasn't been affected yet, consistent attendance is important. Please let us know if there's anything we can help with.",
  },
  {
    id: "ac7",
    teacher: "Catherine Old",
    course: "Physical Education Grade 5",
    date: "Feb 14, 2026",
    category: "behavior",
    comment: "Alex is a great sport — he's encouraging to teammates and always gives full effort. He improved his mile run time by over a minute this semester!",
  },
];

const EMMA_COMMENTS: TeacherComment[] = [
  {
    id: "ec1",
    teacher: "Sarah Mitchell",
    course: "Language Arts Grade 3",
    date: "Mar 30, 2026",
    category: "achievement",
    comment: "Emma is reading well above grade level and her comprehension skills are exceptional. She's already finishing chapter books that most 4th graders read. Keep up the wonderful reading habits at home!",
  },
  {
    id: "ec2",
    teacher: "Sarah Mitchell",
    course: "Math Grade 3",
    date: "Mar 22, 2026",
    category: "achievement",
    comment: "Emma achieved a perfect score on the multiplication facts timed test — she was the first in the class to master all facts through 12. Outstanding dedication!",
  },
  {
    id: "ec3",
    teacher: "Sarah Mitchell",
    course: "Science Grade 3",
    date: "Mar 12, 2026",
    category: "progress",
    comment: "Emma's science journal entries are very detailed and thoughtful. She asks excellent questions during our experiments and shows genuine curiosity about the natural world.",
  },
  {
    id: "ec4",
    teacher: "Sarah Mitchell",
    course: "Social Studies Grade 3",
    date: "Mar 5, 2026",
    category: "behavior",
    comment: "Emma is a wonderful classroom citizen. She's kind to all her classmates, volunteers to help others, and consistently follows classroom expectations. She's a role model for her peers.",
  },
  {
    id: "ec5",
    teacher: "Sarah Mitchell",
    course: "Homeroom Grade 03",
    date: "Feb 26, 2026",
    category: "achievement",
    comment: "Emma was selected as Student of the Month for February! She was recognized for her kindness, hard work, and positive attitude. Congratulations!",
  },
];

const COMMENT_DATA: Record<string, TeacherComment[]> = {
  "1": ALEX_COMMENTS,
  "2": EMMA_COMMENTS,
};

const CATEGORY_CONFIG: Record<CommentCategory, { label: string; icon: typeof Star; color: string; bg: string }> = {
  achievement: { label: "Achievement", icon: Award, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  behavior: { label: "Behavior", icon: ThumbsUp, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
  progress: { label: "Progress", icon: Star, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
  concern: { label: "Concern", icon: AlertTriangle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30" },
};

type FilterType = "all" | CommentCategory;

export default function TeacherCommentsPage() {
  const [selectedStudent, setSelectedStudent] = useState(STUDENTS[0]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [openComment, setOpenComment] = useState<TeacherComment | null>(null);

  const allComments = COMMENT_DATA[selectedStudent.id] ?? [];
  const comments = filter === "all" ? allComments : allComments.filter(c => c.category === filter);

  const categoryCounts = allComments.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-violet-50 dark:bg-violet-950/40">
            <MessageSquare className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Teacher Comments</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {allComments.length} comment{allComments.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Student tabs */}
      <div className="overflow-x-auto pl-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          {STUDENTS.map((s) => {
            const isActive = s.id === selectedStudent.id;
            return (
              <button
                key={s.id}
                onClick={() => { setSelectedStudent(s); setFilter("all"); }}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  isActive
                    ? "text-[#3b82f6] border-b-2 border-[#3b82f6]"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "all"
              ? "bg-[#1e3a8a] text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All ({allComments.length})
        </button>
        {(Object.entries(CATEGORY_CONFIG) as [CommentCategory, typeof CATEGORY_CONFIG[CommentCategory]][]).map(([key, config]) => {
          const count = categoryCounts[key] ?? 0;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === key
                  ? "bg-[#1e3a8a] text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Comments list */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-slate-800">
        {comments.map((c) => {
          const config = CATEGORY_CONFIG[c.category];
          const Icon = config.icon;
          return (
            <button
              key={c.id}
              onClick={() => setOpenComment(c)}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.course}</p>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold flex-shrink-0 ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{c.comment}</p>
              </div>
              <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
                <span className="text-xs text-gray-400 dark:text-gray-500">{c.date}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">{c.teacher}</span>
              </div>
            </button>
          );
        })}

        {comments.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No comments in this category</p>
          </div>
        )}
      </div>

      {/* Comment modal */}
      {openComment && createPortal(
        (() => {
          const config = CATEGORY_CONFIG[openComment.category];
          const Icon = config.icon;
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => setOpenComment(null)} />
              <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.bg}`}>
                      <Icon className={`w-4.5 h-4.5 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{openComment.course}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">{openComment.teacher}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenComment(null)}
                    className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{openComment.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{openComment.comment}</p>
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}
    </div>
  );
}
