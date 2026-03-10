"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Bell,
  FileText,
  BookOpen,
  CheckSquare,
  ChevronRight,
  Megaphone,
  Award,
  CalendarDays,
  BarChart3,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Course {
  id: string;
  name: string;
  teacher: string;
  term: string;
  color: string;
  image: string;          // subject-specific photo
  grade: string;
  gradeNum: number;       // for colour coding
  announcements?: number;
  assignments?: number;
}

interface TodoItem {
  id: string;
  title: string;
  course: string;
  courseId: string;
  dueLabel: string;
  type: "assignment" | "quiz";
  urgent: boolean;
}

interface Announcement {
  id: string;
  course: string;
  courseColor: string;
  title: string;
  preview: string;
  time: string;
  courseId: string;
}

interface ScheduleItem {
  id: string;
  courseName: string;
  color: string;
  time: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const COURSES: Course[] = [
  {
    id: "1",
    name: "Math – Period 3",
    teacher: "Mrs. Johnson",
    term: "Spring 2026",
    color: "#1e3a8a",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=200&fit=crop&q=80",
    grade: "A",
    gradeNum: 95,
    announcements: 2,
    assignments: 1,
  },
  {
    id: "2",
    name: "English Language Arts",
    teacher: "Mr. Thompson",
    term: "Spring 2026",
    color: "#166534",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=200&fit=crop&q=80",
    grade: "B+",
    gradeNum: 88,
    assignments: 3,
  },
  {
    id: "3",
    name: "Science – Period 4",
    teacher: "Ms. Garcia",
    term: "Spring 2026",
    color: "#7c3aed",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=200&fit=crop&q=80",
    grade: "A–",
    gradeNum: 91,
  },
  {
    id: "4",
    name: "Social Studies",
    teacher: "Mr. Williams",
    term: "Spring 2026",
    color: "#b45309",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=200&fit=crop&q=80",
    grade: "B",
    gradeNum: 84,
    announcements: 1,
  },
  {
    id: "5",
    name: "Art",
    teacher: "Mrs. Davis",
    term: "Spring 2026",
    color: "#be185d",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=200&fit=crop&q=80",
    grade: "A",
    gradeNum: 97,
  },
  {
    id: "6",
    name: "Physical Education",
    teacher: "Coach Martinez",
    term: "Spring 2026",
    color: "#0f766e",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=200&fit=crop&q=80",
    grade: "A",
    gradeNum: 98,
    assignments: 2,
  },
];

const TODO: TodoItem[] = [
  { id: "1", title: "Fractions Worksheet",    course: "Math",    courseId: "1", dueLabel: "Due today",    type: "assignment", urgent: true  },
  { id: "2", title: "Spelling Quiz: Unit 5",  course: "ELA",     courseId: "2", dueLabel: "Due tomorrow", type: "quiz",       urgent: true  },
  { id: "3", title: "Solar System Project",   course: "Science", courseId: "3", dueLabel: "Due Jan 22",   type: "assignment", urgent: false },
  { id: "4", title: "Chapter 8 Questions",    course: "SS",      courseId: "4", dueLabel: "Due Jan 23",   type: "assignment", urgent: false },
  { id: "5", title: "Multiplication Quiz",    course: "Math",    courseId: "1", dueLabel: "Due Jan 24",   type: "quiz",       urgent: false },
  { id: "6", title: "Book Report",            course: "ELA",     courseId: "2", dueLabel: "Due Jan 25",   type: "assignment", urgent: false },
  { id: "7", title: "States & Capitals Quiz", course: "SS",      courseId: "4", dueLabel: "Due Jan 26",   type: "quiz",       urgent: false },
];

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    course: "Math",
    courseColor: "#1e3a8a",
    courseId: "1",
    title: "Test next Friday — Chapter 7",
    preview: "Please review sections 7.1–7.4 and complete the practice problems before Friday.",
    time: "2 hrs ago",
  },
  {
    id: "2",
    course: "ELA",
    courseColor: "#166534",
    courseId: "2",
    title: "Book Report deadline extended",
    preview: "The Charlotte's Web report deadline has been moved to January 27th.",
    time: "5 hrs ago",
  },
  {
    id: "3",
    course: "Social Studies",
    courseColor: "#b45309",
    courseId: "4",
    title: "Field trip permission slip due",
    preview: "Return your signed permission slip by Thursday for the history museum visit.",
    time: "Yesterday",
  },
];

const SCHEDULE: ScheduleItem[] = [
  { id: "1", courseName: "Math",    color: "#1e3a8a", time: "9:00 AM"  },
  { id: "2", courseName: "Science", color: "#7c3aed", time: "10:30 AM" },
  { id: "3", courseName: "ELA",     color: "#166534", time: "11:15 AM" },
  { id: "4", courseName: "Art",     color: "#be185d", time: "1:00 PM"  },
  { id: "5", courseName: "SS",      color: "#b45309", time: "2:00 PM"  },
  { id: "6", courseName: "PE",      color: "#0f766e", time: "3:00 PM"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gradeColor(num: number) {
  if (num >= 90) return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400";
  if (num >= 80) return "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400";
  if (num >= 70) return "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400";
  return "text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentPage() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "Student";
  const avgGrade = Math.round(COURSES.reduce((a, c) => a + c.gradeNum, 0) / COURSES.length);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

      {/* ── Left / main ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              {firstName}&apos;s Dashboard
            </h1>
          </div>
          <Link href="/student/grades"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:opacity-80 transition-opacity self-end sm:self-auto"
          >
            <Award className="w-3.5 h-3.5" />
            GPA {(avgGrade / 25).toFixed(1)}
          </Link>
        </div>

        {/* ── Today's Classes schedule strip ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <CalendarDays className="w-4 h-4 text-[#1e3a8a]" />
              Today&apos;s Classes
            </h2>
            <Link href="/student/calendar" className="text-xs font-medium text-[#1e3a8a] dark:text-blue-400 hover:underline">
              Full calendar
            </Link>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {SCHEDULE.map((s) => (
              <div
                key={s.id}
                className="flex-shrink-0 flex flex-col gap-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 min-w-[110px]"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <p className="text-xs font-semibold text-gray-800 dark:text-white leading-tight">
                    {s.courseName}
                  </p>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-slate-500">{s.time}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Course cards ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <BookOpen className="w-4 h-4 text-[#1e3a8a]" />
              My Courses
            </h2>
            <Link href="/student/courses" className="text-xs font-medium text-[#1e3a8a] dark:text-blue-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {COURSES.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        </section>

      </div>

      {/* ── Right: To-Do sidebar ────────────────────────────────── */}
      <aside className="w-full lg:w-72 xl:w-80 lg:flex-shrink-0">
        <div className="lg:sticky lg:top-6 space-y-5">

          {/* To-Do card */}
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#1e3a8a]" />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">To Do</h2>
              </div>
              <span className="text-xs text-gray-400 dark:text-slate-500">{TODO.length} items</span>
            </div>

            <ul className="divide-y divide-gray-100 dark:divide-slate-800 max-h-[350px] overflow-y-auto">
              {TODO.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/student/courses/${item.courseId}/assignments`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <span
                      className={`mt-1.5 flex-shrink-0 w-3 h-3 rounded-full border-2 transition-colors ${
                        item.urgent
                          ? "border-amber-400 bg-amber-100 dark:bg-amber-950"
                          : "border-gray-300 dark:border-slate-600 group-hover:border-[#1e3a8a]"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.course} ·{" "}
                        <span className={item.urgent ? "text-amber-600 dark:text-amber-400 font-medium" : ""}>
                          {item.dueLabel}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`flex-shrink-0 mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        item.type === "quiz"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      }`}
                    >
                      {item.type === "quiz" ? "Quiz" : "Assign"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-100 dark:border-slate-800">
              <Link
                href="/student/calendar"
                className="flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-[#1e3a8a] dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                View calendar <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Announcements card */}
          <div className="rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#1e3a8a]" />
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Announcements</h2>
              </div>
              <Link href="/student/inbox" className="text-xs font-medium text-[#1e3a8a] dark:text-blue-400 hover:underline">
                View all
              </Link>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-slate-800">
              {ANNOUNCEMENTS.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/student/courses/${a.courseId}/announcements`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <span
                      className="flex-shrink-0 w-2 h-2 rounded-full"
                      style={{ backgroundColor: a.courseColor }}
                    />
                    <p className="text-sm text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 transition-colors">
                      {a.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── Course card ──────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col">

      {/* Image header with color overlay */}
      <Link href={`/student/courses/${course.id}`} className="block relative h-[120px] flex-shrink-0 overflow-hidden">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Color tint overlay */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: course.color, opacity: 0.72 }}
        />
        {/* Grade badge — top right */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full shadow ${gradeColor(course.gradeNum)}`}>
          {course.gradeNum}%
        </span>
        {/* Course name at bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
          <h3 className="text-white font-bold text-sm sm:text-base leading-snug drop-shadow-sm line-clamp-1">
            {course.name}
          </h3>
          <p className="text-white/80 text-xs mt-0.5">{course.teacher}</p>
        </div>
      </Link>

      {/* Term */}
      <Link href={`/student/courses/${course.id}`} className="block px-4 pt-2 pb-2">
        <p className="text-[11px] text-gray-400 dark:text-slate-500">{course.term}</p>
      </Link>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-100 dark:border-slate-800" />

      {/* Actions */}
      <div className="px-3 py-2 flex items-center gap-0.5">
        {[
          { href: `/student/courses/${course.id}/announcements`, icon: Bell,          label: "Announcements", badge: course.announcements },
          { href: `/student/courses/${course.id}/assignments`,   icon: FileText,      label: "Assignments",   badge: course.assignments  },
          { href: `/student/courses/${course.id}/grades`,            icon: BarChart3,     label: "Grades"                                    },
        ].map(({ href, icon: Icon, label, badge }) => (
          <Link
            key={label}
            href={href}
            aria-label={label}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-400 hover:text-[#1e3a8a] hover:bg-[#1e3a8a]/10 dark:hover:bg-[#1e3a8a]/20 dark:hover:text-blue-400 transition-colors"
          >
            <Icon className="w-4 h-4" />
            {badge != null && badge > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-0.5 bg-[#1e3a8a] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </article>
  );
}
