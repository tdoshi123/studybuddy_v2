"use client";

import Link from "next/link";
import { CLASSES, ASSIGNMENTS, QUIZZES, STUDENTS } from "@/data/teacher-mock-data";
import { Clock, MapPin, Users, ClipboardList, HelpCircle, ArrowRight, BookOpen } from "lucide-react";

function getProgressColor(pct: number) {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 70) return "bg-blue-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export default function TeacherCoursesPage() {
  const totalStudents    = CLASSES.reduce((s, c) => s + c.studentCount, 0);
  const totalAssignments = ASSIGNMENTS.length;
  const today            = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-7 max-w-7xl">

      {/* Header */}
      <div className="pb-6 border-b border-gray-200 dark:border-slate-800">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">My Courses</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {CLASSES.length} courses &middot; {totalStudents} students &middot; {totalAssignments} assignments
        </p>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {CLASSES.map((course) => {
          const assignments = ASSIGNMENTS.filter(a => a.classId === course.id);
          const quizzes    = QUIZZES.filter(q => q.classId === course.id);
          const students   = STUDENTS.filter(s => s.classId === course.id);
          const published  = assignments.filter(a => a.status === "published").length;
          const avgGrade   = students.length
            ? Math.round(students.reduce((s, st) => s + st.currentGrade, 0) / students.length)
            : 0;

          return (
            <Link
              key={course.id}
              href={`/lis/teacher/courses/${course.id}`}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              {/* Color banner with texture */}
              <div
                className="relative h-24 flex items-end px-5 pb-4"
                style={{ backgroundColor: course.color }}
              >
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "16px 16px" }}
                />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                    <BookOpen className="w-3 h-3 text-white" />
                    <span className="text-[11px] font-semibold text-white">{course.gradeLevel}</span>
                  </div>
                </div>
                {/* Avg grade pill top-right */}
                <div className="absolute top-3 right-4">
                  <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${avgGrade >= 90 ? "bg-emerald-400/20 text-white" : avgGrade >= 70 ? "bg-amber-400/20 text-white" : "bg-red-400/20 text-white"}`}>
                    Avg {avgGrade}%
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-5">
                <h2 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {course.name}
                </h2>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{course.section}</p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" />{course.room}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400" />{course.schedule}</span>
                </div>

                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{course.description}</p>

                {/* Class avg progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Class average</span>
                    <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{avgGrade}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${getProgressColor(avgGrade)}`} style={{ width: `${avgGrade}%` }} />
                  </div>
                </div>

                {/* Stats footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{course.studentCount} students</span>
                    <span className="flex items-center gap-1.5"><ClipboardList className="w-3.5 h-3.5" />{published}/{assignments.length} published</span>
                    <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" />{quizzes.length} quizzes</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
