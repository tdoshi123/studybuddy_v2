"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Users, ClipboardList, HelpCircle, Megaphone,
  ArrowRight, MessageSquare, Send, Sparkles,
  Plus, AlertCircle, CheckCircle2,
  Camera, BookOpen, X, ChevronRight, FileQuestion,
  FileText, GraduationCap, MessagesSquare, ChevronLeft,
} from "lucide-react";
import { CLASSES, ASSIGNMENTS, QUIZZES, ANNOUNCEMENTS, SUBMISSIONS, Class } from "@/data/teacher-mock-data";

/* ── Create Content Modal ────────────────────────────────────────────────── */
const CONTENT_TYPES = [
  { id: "assignments", label: "Assignment",   icon: ClipboardList,  color: "bg-blue-50 dark:bg-blue-900/30 text-[#1e3a8a] dark:text-blue-400",   desc: "Worksheet, homework, or project",   route: (classId: string) => `/lis/teacher/courses/${classId}/assignments?create=1` },
  { id: "quizzes",     label: "Quiz",         icon: FileQuestion,   color: "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400", desc: "Timed or untimed question set",   route: (classId: string) => `/lis/teacher/courses/${classId}/quizzes/new` },
  { id: "exams",       label: "Exam",         icon: GraduationCap,  color: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",     desc: "High-stakes graded assessment",     route: (classId: string) => `/lis/teacher/courses/${classId}/exams?create=1` },
  { id: "announcements", label: "Announcement", icon: Megaphone,    color: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",  desc: "Post a notice to your class",       route: (classId: string) => `/lis/teacher/courses/${classId}/announcements?create=1` },
  { id: "discussions", label: "Discussion",   icon: MessagesSquare, color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400", desc: "Start a class conversation",  route: (classId: string) => `/lis/teacher/courses/${classId}/discussions?create=1` },
];

function CreateContentModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  function handleClassSelect(cls: Class) {
    setSelectedClass(cls);
    setStep(2);
  }

  function handleCreate() {
    if (!selectedClass || !selectedType) return;
    const type = CONTENT_TYPES.find(t => t.id === selectedType);
    if (!type) return;
    router.push(type.route(selectedClass.id));
    onClose();
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-700 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                onClick={() => { setStep(1); setSelectedType(null); }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Create Content</h2>
              <p className="text-[11px] text-gray-400 dark:text-slate-500">
                {step === 1 ? "Step 1 of 2 — Choose a class" : `Step 2 of 2 — Choose content type`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 px-5 pt-4">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                s <= step ? "bg-[#1e3a8a]" : "bg-gray-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Step 1 — Pick a class */}
        {step === 1 && (
          <div className="p-5 space-y-2">
            {CLASSES.map((cls) => (
              <button
                key={cls.id}
                onClick={() => handleClassSelect(cls)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-[#1e3a8a] dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-150 text-left group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden relative"
                >
                  <Image src={cls.image} alt={cls.name} fill className="object-cover" sizes="40px" />
                  <div className="absolute inset-0" style={{ backgroundColor: cls.color, opacity: 0.25 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{cls.name}</p>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500">{cls.section} · {cls.gradeLevel}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — Pick content type */}
        {step === 2 && selectedClass && (
          <div className="p-5">
            {/* Selected class badge */}
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <div className="w-6 h-6 rounded-lg flex-shrink-0 overflow-hidden relative">
                <Image src={selectedClass.image} alt={selectedClass.name} fill className="object-cover" sizes="24px" />
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{selectedClass.name}</span>
              <span className="text-[11px] text-gray-400 dark:text-slate-500 ml-auto flex-shrink-0">{selectedClass.section}</span>
            </div>

            <div className="space-y-2">
              {CONTENT_TYPES.map((type) => {
                const Icon = type.icon;
                const active = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 text-left ${
                      active
                        ? "border-[#1e3a8a] bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500 ring-1 ring-[#1e3a8a] dark:ring-blue-500"
                        : "border-gray-200 dark:border-slate-700 hover:border-[#1e3a8a]/50 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${type.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{type.label}</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">{type.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${
                      active ? "border-[#1e3a8a] bg-[#1e3a8a]" : "border-gray-300 dark:border-slate-600"
                    }`}>
                      {active && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full" /></div>}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleCreate}
              disabled={!selectedType}
              className="mt-5 w-full py-3 rounded-xl bg-[#1e3a8a] hover:bg-[#162554] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm"
            >
              {selectedType ? `Create ${CONTENT_TYPES.find(t => t.id === selectedType)?.label}` : "Select a content type"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Course Card ─────────────────────────────────────────────────────────── */
function CourseCard({
  cls: c,
  aCount,
  qCount,
  pending,
}: {
  cls: Class;
  aCount: number;
  qCount: number;
  pending: number;
}) {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">

      {/* Cover image */}
      <Link href={`/lis/teacher/courses/${c.id}`} className="relative block h-28 overflow-hidden flex-shrink-0">
        <Image
          src={c.image}
          alt={c.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Color accent stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: c.color }} />

        {/* Course name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-bold text-white text-sm leading-tight drop-shadow-sm">{c.name}</h3>
          <p className="text-[11px] text-white/80 mt-0.5">{c.section} · {c.gradeLevel}</p>
        </div>

        {/* Change cover button (visible on hover) */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/50 hover:bg-black/70 text-white text-[10px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
        >
          <Camera className="w-2.5 h-2.5" /> Change cover
        </button>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-3">
        {/* Stats row */}
        <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1 font-medium">
            <Users className="w-3 h-3" />{c.studentCount} <span className="text-gray-400">students</span>
          </span>
          <span className="flex items-center gap-1">
            <ClipboardList className="w-3 h-3" />{aCount}
          </span>
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />{qCount}
          </span>
          {pending > 0 && (
            <Link
              href={`/lis/teacher/grading?class=${c.id}`}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold text-[10px] hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
            >
              <AlertCircle className="w-2.5 h-2.5" />{pending} to grade
            </Link>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          <Link
            href={`/lis/teacher/courses/${c.id}/assignments`}
            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-[#1e3a8a] hover:text-white dark:hover:bg-[#1e3a8a] text-gray-600 dark:text-gray-300 text-[11px] font-medium transition-all duration-150 border border-gray-200 dark:border-slate-700 hover:border-[#1e3a8a]"
          >
            <ClipboardList className="w-3 h-3" /> Assignments
          </Link>
          <Link
            href={`/lis/teacher/courses/${c.id}/students`}
            className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-gray-50 dark:bg-slate-800 hover:bg-[#1e3a8a] hover:text-white dark:hover:bg-[#1e3a8a] text-gray-600 dark:text-gray-300 text-[11px] font-medium transition-all duration-150 border border-gray-200 dark:border-slate-700 hover:border-[#1e3a8a]"
          >
            <Users className="w-3 h-3" /> Students
          </Link>
        </div>

        {/* Open course link */}
        <Link
          href={`/lis/teacher/courses/${c.id}`}
          className="mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-[#1e3a8a] dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" /> Open Course <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

const RECENT_ACTIVITY = [
  { id: "1", icon: Send,         label: "New submission for Quadratic Equations Quiz",  meta: "Mathematics 9 · 2 hours ago",  color: "bg-blue-50 text-blue-600" },
  { id: "2", icon: MessageSquare,label: "Anna Cruz posted in Discussion Board",          meta: "Study Tips for Midterm · 5 hours ago", color: "bg-violet-50 text-violet-600" },
  { id: "3", icon: CheckCircle2, label: "Rational Expressions Worksheet published",     meta: "Mathematics 9 · Yesterday",    color: "bg-emerald-50 text-emerald-600" },
  { id: "4", icon: Sparkles,     label: "Sofia Torres completed Arithmetic Sequences Quiz", meta: "Mathematics 10 · Yesterday", color: "bg-amber-50 text-amber-600" },
  { id: "5", icon: Megaphone,    label: "Announcement posted: No Class on April 9",     meta: "Mathematics 10 · 2 days ago",  color: "bg-rose-50 text-rose-600" },
];

function fmt(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isOverdue(iso: string) {
  return new Date(iso + "T23:59:00") < new Date();
}

export default function TeacherDashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstName ?? "Teacher";
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const [showModal, setShowModal] = useState(false);

  const pendingGrades = SUBMISSIONS.filter(s => s.status === "Submitted" && s.grade === null).length;

  const upcomingDeadlines = ASSIGNMENTS
    .filter(a => a.status === "published")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  return (
    <div className="space-y-7 max-w-7xl">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Here is an overview of your courses and recent activity.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-[#162554] text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Create Content
        </button>
      </div>

      {showModal && <CreateContentModal onClose={() => setShowModal(false)} />}

      {/* ── Main grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left: courses + activity */}
        <div className="xl:col-span-2 space-y-6">

          {/* Course cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">My Courses</h2>
              <Link href="/lis/teacher/courses" className="text-xs font-medium text-[#1e3a8a] dark:text-blue-400 hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CLASSES.map((c) => {
                const aCount = ASSIGNMENTS.filter(a => a.classId === c.id).length;
                const qCount = QUIZZES.filter(q => q.classId === c.id).length;
                const pending = SUBMISSIONS.filter(s => {
                  const a = ASSIGNMENTS.find(a => a.id === s.assignmentId);
                  return a?.classId === c.id && s.status === "Submitted" && s.grade === null;
                }).length;
                return (
                  <CourseCard
                    key={c.id}
                    cls={c}
                    aCount={aCount}
                    qCount={qCount}
                    pending={pending}
                  />
                );
              })}
            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {RECENT_ACTIVITY.map((item) => (
                <div key={item.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">{item.label}</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{item.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">

          {/* Upcoming deadlines */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Upcoming Deadlines</h2>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {upcomingDeadlines.map((a) => {
                const cls = CLASSES.find(c => c.id === a.classId);
                const overdue = isOverdue(a.dueDate);
                return (
                  <Link
                    key={a.id}
                    href={`/lis/teacher/courses/${a.classId}/assignments/${a.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cls?.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{a.title}</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">{cls?.name}</p>
                    </div>
                    <span className={`text-[11px] font-semibold flex-shrink-0 ${overdue ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"}`}>
                      {overdue ? <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />Overdue</span> : fmt(a.dueDate)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">Quick Create</h2>
            <div className="space-y-2">
              {[
                { label: "New Assignment", icon: ClipboardList, href: "/lis/teacher/courses/c1/assignments", primary: true },
                { label: "New Quiz",       icon: HelpCircle,    href: "/lis/teacher/courses/c1/quizzes",     primary: false },
                { label: "Announcement",   icon: Megaphone,     href: "/lis/teacher/courses/c1/announcements", primary: false },
              ].map(({ label, icon: Icon, href, primary }) => (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    primary
                      ? "bg-[#1e3a8a] hover:bg-blue-700 text-white shadow-sm"
                      : "bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${primary ? "text-white" : "text-blue-600 dark:text-blue-400"}`} />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent announcements */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Announcements</h2>
              <Link href="/lis/teacher/announcements" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {ANNOUNCEMENTS.slice(0, 3).map((a) => {
                const cls = CLASSES.find(c => c.id === a.classId);
                return (
                  <div key={a.id} className="px-5 py-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{a.title}</p>
                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{cls?.name} · {fmt(a.createdAt)}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
