"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3, Mail, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Assignment {
  id: string;
  name: string;
  category: string;
  dateAssigned: string;
  dateDue: string;
  score: number | null;
  maxScore: number;
  weight: number;
  status: "graded" | "missing" | "upcoming" | "excused";
}

interface ClassInfo {
  id: string;
  course: string;
  teacher: string;
  room: string;
  period: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  studentName: string;
  assignments: Assignment[];
}

const CLASS_DETAILS: Record<string, Record<string, ClassInfo>> = {
  "1": {
    c1: {
      id: "c1", course: "Homeroom Grade 05", teacher: "Julia Arlington", room: "A138", period: "1(A-D)",
      q1: null, q2: null, q3: null, studentName: "Alex Johnson",
      assignments: [],
    },
    c2: {
      id: "c2", course: "Language Arts Grade 5", teacher: "Julia Arlington", room: "314/Artigo", period: "2(A-D)",
      q1: 85, q2: 85, q3: 94, studentName: "Alex Johnson",
      assignments: [
        { id: "a1", name: "Narrative Essay – Personal Experience", category: "Writing", dateAssigned: "2026-01-06", dateDue: "2026-01-13", score: 92, maxScore: 100, weight: 15, status: "graded" },
        { id: "a2", name: "Reading Comprehension Quiz Ch. 12", category: "Quizzes", dateAssigned: "2026-01-10", dateDue: "2026-01-10", score: 88, maxScore: 100, weight: 10, status: "graded" },
        { id: "a3", name: "Vocabulary Unit 8 Test", category: "Tests", dateAssigned: "2026-01-15", dateDue: "2026-01-17", score: 96, maxScore: 100, weight: 20, status: "graded" },
        { id: "a4", name: "Book Report – Island of the Blue Dolphins", category: "Projects", dateAssigned: "2026-01-06", dateDue: "2026-01-24", score: 95, maxScore: 100, weight: 20, status: "graded" },
        { id: "a5", name: "Grammar Worksheet – Complex Sentences", category: "Homework", dateAssigned: "2026-01-20", dateDue: "2026-01-22", score: 90, maxScore: 100, weight: 5, status: "graded" },
        { id: "a6", name: "Spelling Test Week 20", category: "Quizzes", dateAssigned: "2026-01-24", dateDue: "2026-01-24", score: 100, maxScore: 100, weight: 10, status: "graded" },
        { id: "a7", name: "Persuasive Writing Draft", category: "Writing", dateAssigned: "2026-01-27", dateDue: "2026-02-03", score: 91, maxScore: 100, weight: 15, status: "graded" },
        { id: "a8", name: "Reading Response Journal", category: "Homework", dateAssigned: "2026-02-03", dateDue: "2026-02-07", score: null, maxScore: 100, weight: 5, status: "upcoming" },
      ],
    },
    c3: {
      id: "c3", course: "Math Grade 5", teacher: "Julia Arlington", room: "314/Artigo", period: "3(A-D)",
      q1: 81, q2: 81, q3: 80, studentName: "Alex Johnson",
      assignments: [
        { id: "m1", name: "Fractions & Decimals Quiz", category: "Quizzes", dateAssigned: "2026-01-06", dateDue: "2026-01-08", score: 78, maxScore: 100, weight: 10, status: "graded" },
        { id: "m2", name: "Chapter 9 Test – Geometry", category: "Tests", dateAssigned: "2026-01-13", dateDue: "2026-01-15", score: 82, maxScore: 100, weight: 25, status: "graded" },
        { id: "m3", name: "Homework Set 17 – Area & Perimeter", category: "Homework", dateAssigned: "2026-01-15", dateDue: "2026-01-17", score: 85, maxScore: 100, weight: 5, status: "graded" },
        { id: "m4", name: "Problem Solving Challenge #4", category: "Projects", dateAssigned: "2026-01-13", dateDue: "2026-01-24", score: 76, maxScore: 100, weight: 15, status: "graded" },
        { id: "m5", name: "Order of Operations Worksheet", category: "Homework", dateAssigned: "2026-01-22", dateDue: "2026-01-24", score: 80, maxScore: 100, weight: 5, status: "graded" },
        { id: "m6", name: "Chapter 10 Quiz – Volume", category: "Quizzes", dateAssigned: "2026-01-27", dateDue: "2026-01-29", score: 75, maxScore: 100, weight: 10, status: "graded" },
        { id: "m7", name: "Mid-Quarter Assessment", category: "Tests", dateAssigned: "2026-01-31", dateDue: "2026-02-02", score: 83, maxScore: 100, weight: 25, status: "graded" },
        { id: "m8", name: "Homework Set 18 – Coordinate Planes", category: "Homework", dateAssigned: "2026-02-03", dateDue: "2026-02-05", score: null, maxScore: 100, weight: 5, status: "upcoming" },
      ],
    },
    c4: {
      id: "c4", course: "Science Grade 5", teacher: "Julia Arlington", room: "314/Artigo", period: "4(A-D)",
      q1: 81, q2: 81, q3: 84, studentName: "Alex Johnson",
      assignments: [
        { id: "s1", name: "Weather Patterns Lab Report", category: "Labs", dateAssigned: "2026-01-06", dateDue: "2026-01-13", score: 88, maxScore: 100, weight: 20, status: "graded" },
        { id: "s2", name: "Chapter 7 Quiz – Earth's Atmosphere", category: "Quizzes", dateAssigned: "2026-01-10", dateDue: "2026-01-10", score: 80, maxScore: 100, weight: 10, status: "graded" },
        { id: "s3", name: "Water Cycle Diagram Project", category: "Projects", dateAssigned: "2026-01-06", dateDue: "2026-01-20", score: 90, maxScore: 100, weight: 20, status: "graded" },
        { id: "s4", name: "Unit 4 Test – Weather & Climate", category: "Tests", dateAssigned: "2026-01-22", dateDue: "2026-01-24", score: 82, maxScore: 100, weight: 25, status: "graded" },
        { id: "s5", name: "Vocabulary Review Worksheet", category: "Homework", dateAssigned: "2026-01-24", dateDue: "2026-01-27", score: 78, maxScore: 100, weight: 5, status: "graded" },
        { id: "s6", name: "Ecosystem Research Presentation", category: "Projects", dateAssigned: "2026-01-27", dateDue: "2026-02-07", score: null, maxScore: 100, weight: 20, status: "upcoming" },
      ],
    },
    c5: {
      id: "c5", course: "Social Studies Grade 5", teacher: "Julia Arlington", room: "314/Artigo", period: "5(A-D)",
      q1: 88, q2: 81, q3: 85, studentName: "Alex Johnson",
      assignments: [
        { id: "ss1", name: "Colonial America Map Activity", category: "Homework", dateAssigned: "2026-01-06", dateDue: "2026-01-08", score: 90, maxScore: 100, weight: 5, status: "graded" },
        { id: "ss2", name: "Chapter 11 Quiz – American Revolution", category: "Quizzes", dateAssigned: "2026-01-10", dateDue: "2026-01-10", score: 84, maxScore: 100, weight: 10, status: "graded" },
        { id: "ss3", name: "Research Project – Famous Founders", category: "Projects", dateAssigned: "2026-01-06", dateDue: "2026-01-24", score: 88, maxScore: 100, weight: 25, status: "graded" },
        { id: "ss4", name: "Unit 5 Test – Revolutionary War", category: "Tests", dateAssigned: "2026-01-27", dateDue: "2026-01-29", score: 82, maxScore: 100, weight: 25, status: "graded" },
        { id: "ss5", name: "Current Events Summary #8", category: "Homework", dateAssigned: "2026-01-29", dateDue: "2026-01-31", score: 85, maxScore: 100, weight: 5, status: "graded" },
        { id: "ss6", name: "Constitution Study Guide", category: "Homework", dateAssigned: "2026-02-03", dateDue: "2026-02-05", score: null, maxScore: 100, weight: 5, status: "upcoming" },
      ],
    },
    c6: {
      id: "c6", course: "Art Grade 5", teacher: "Michael H. Garrett", room: "ART", period: "3B(A)",
      q1: null, q2: null, q3: null, studentName: "Alex Johnson",
      assignments: [
        { id: "ar1", name: "Self-Portrait – Mixed Media", category: "Projects", dateAssigned: "2026-01-06", dateDue: "2026-01-17", score: null, maxScore: 100, weight: 30, status: "graded" },
        { id: "ar2", name: "Color Theory Worksheet", category: "Homework", dateAssigned: "2026-01-13", dateDue: "2026-01-15", score: null, maxScore: 100, weight: 10, status: "graded" },
        { id: "ar3", name: "Landscape Painting", category: "Projects", dateAssigned: "2026-01-20", dateDue: "2026-02-03", score: null, maxScore: 100, weight: 30, status: "upcoming" },
      ],
    },
    c7: {
      id: "c7", course: "Music Grade 5", teacher: "Virginia B. Williamson", room: "MUSIC", period: "3B(B)",
      q1: null, q2: null, q3: null, studentName: "Alex Johnson",
      assignments: [
        { id: "mu1", name: "Recorder Performance – Hot Cross Buns", category: "Performance", dateAssigned: "2026-01-06", dateDue: "2026-01-10", score: null, maxScore: 100, weight: 25, status: "graded" },
        { id: "mu2", name: "Music Theory Quiz – Note Reading", category: "Quizzes", dateAssigned: "2026-01-13", dateDue: "2026-01-13", score: null, maxScore: 100, weight: 15, status: "graded" },
      ],
    },
    c8: {
      id: "c8", course: "Physical Education Grade 5", teacher: "Catherine Old", room: "GYM", period: "3B(C)",
      q1: null, q2: null, q3: null, studentName: "Alex Johnson",
      assignments: [
        { id: "pe1", name: "Fitness Assessment – Mile Run", category: "Performance", dateAssigned: "2026-01-10", dateDue: "2026-01-10", score: null, maxScore: 100, weight: 25, status: "graded" },
        { id: "pe2", name: "Team Sports Participation", category: "Participation", dateAssigned: "2026-01-06", dateDue: "2026-01-31", score: null, maxScore: 100, weight: 50, status: "graded" },
      ],
    },
    c9: {
      id: "c9", course: "STEM Grade 5", teacher: "Jessica Gray", room: "A126", period: "3B(D)",
      q1: null, q2: null, q3: null, studentName: "Alex Johnson",
      assignments: [
        { id: "st1", name: "Bridge Building Challenge", category: "Projects", dateAssigned: "2026-01-06", dateDue: "2026-01-17", score: null, maxScore: 100, weight: 30, status: "graded" },
        { id: "st2", name: "Coding Exercise – Scratch Animation", category: "Labs", dateAssigned: "2026-01-20", dateDue: "2026-01-24", score: null, maxScore: 100, weight: 20, status: "graded" },
      ],
    },
  },
  "2": {
    e1: {
      id: "e1", course: "Homeroom Grade 03", teacher: "Sarah Mitchell", room: "B205", period: "1(A-D)",
      q1: null, q2: null, q3: null, studentName: "Emma Johnson",
      assignments: [],
    },
    e2: {
      id: "e2", course: "Language Arts Grade 3", teacher: "Sarah Mitchell", room: "B205", period: "2(A-D)",
      q1: 95, q2: 97, q3: 98, studentName: "Emma Johnson",
      assignments: [
        { id: "ea1", name: "Story Writing – My Favorite Day", category: "Writing", dateAssigned: "2026-01-06", dateDue: "2026-01-10", score: 98, maxScore: 100, weight: 15, status: "graded" },
        { id: "ea2", name: "Sight Words Quiz #15", category: "Quizzes", dateAssigned: "2026-01-08", dateDue: "2026-01-08", score: 100, maxScore: 100, weight: 10, status: "graded" },
        { id: "ea3", name: "Reading Log – January Week 2", category: "Homework", dateAssigned: "2026-01-06", dateDue: "2026-01-10", score: 100, maxScore: 100, weight: 5, status: "graded" },
        { id: "ea4", name: "Phonics Assessment Unit 6", category: "Tests", dateAssigned: "2026-01-13", dateDue: "2026-01-15", score: 96, maxScore: 100, weight: 20, status: "graded" },
        { id: "ea5", name: "Handwriting Practice – Cursive Letters", category: "Homework", dateAssigned: "2026-01-15", dateDue: "2026-01-17", score: 95, maxScore: 100, weight: 5, status: "graded" },
        { id: "ea6", name: "Poetry Recitation", category: "Performance", dateAssigned: "2026-01-20", dateDue: "2026-01-24", score: 100, maxScore: 100, weight: 15, status: "graded" },
        { id: "ea7", name: "Book Report – Charlotte's Web", category: "Projects", dateAssigned: "2026-01-13", dateDue: "2026-01-27", score: 97, maxScore: 100, weight: 20, status: "graded" },
        { id: "ea8", name: "Spelling Test Week 20", category: "Quizzes", dateAssigned: "2026-01-31", dateDue: "2026-01-31", score: null, maxScore: 100, weight: 10, status: "upcoming" },
      ],
    },
    e3: {
      id: "e3", course: "Math Grade 3", teacher: "Sarah Mitchell", room: "B205", period: "3(A-D)",
      q1: 92, q2: 94, q3: 96, studentName: "Emma Johnson",
      assignments: [
        { id: "em1", name: "Addition & Subtraction Timed Test", category: "Quizzes", dateAssigned: "2026-01-06", dateDue: "2026-01-06", score: 95, maxScore: 100, weight: 10, status: "graded" },
        { id: "em2", name: "Chapter 7 Test – Multiplication", category: "Tests", dateAssigned: "2026-01-10", dateDue: "2026-01-13", score: 94, maxScore: 100, weight: 25, status: "graded" },
        { id: "em3", name: "Shapes & Fractions Worksheet", category: "Homework", dateAssigned: "2026-01-13", dateDue: "2026-01-15", score: 100, maxScore: 100, weight: 5, status: "graded" },
        { id: "em4", name: "Math Facts Challenge #6", category: "Quizzes", dateAssigned: "2026-01-17", dateDue: "2026-01-17", score: 98, maxScore: 100, weight: 10, status: "graded" },
        { id: "em5", name: "Word Problems Practice", category: "Homework", dateAssigned: "2026-01-20", dateDue: "2026-01-22", score: 92, maxScore: 100, weight: 5, status: "graded" },
        { id: "em6", name: "Chapter 8 Test – Division Basics", category: "Tests", dateAssigned: "2026-01-27", dateDue: "2026-01-29", score: 96, maxScore: 100, weight: 25, status: "graded" },
      ],
    },
    e4: {
      id: "e4", course: "Science Grade 3", teacher: "Sarah Mitchell", room: "B205", period: "4(A-D)",
      q1: 90, q2: 93, q3: 95, studentName: "Emma Johnson",
      assignments: [
        { id: "es1", name: "Plant Life Cycle Observation Journal", category: "Labs", dateAssigned: "2026-01-06", dateDue: "2026-01-17", score: 95, maxScore: 100, weight: 20, status: "graded" },
        { id: "es2", name: "Chapter 5 Quiz – Living Things", category: "Quizzes", dateAssigned: "2026-01-10", dateDue: "2026-01-10", score: 92, maxScore: 100, weight: 10, status: "graded" },
        { id: "es3", name: "Animal Habitat Diorama", category: "Projects", dateAssigned: "2026-01-06", dateDue: "2026-01-24", score: 98, maxScore: 100, weight: 25, status: "graded" },
        { id: "es4", name: "Unit 3 Test – Animals & Habitats", category: "Tests", dateAssigned: "2026-01-27", dateDue: "2026-01-29", score: 94, maxScore: 100, weight: 25, status: "graded" },
        { id: "es5", name: "Science Vocabulary Match", category: "Homework", dateAssigned: "2026-01-29", dateDue: "2026-01-31", score: 95, maxScore: 100, weight: 5, status: "graded" },
      ],
    },
    e5: {
      id: "e5", course: "Social Studies Grade 3", teacher: "Sarah Mitchell", room: "B205", period: "5(A-D)",
      q1: 88, q2: 91, q3: 93, studentName: "Emma Johnson",
      assignments: [
        { id: "ess1", name: "Community Helpers Poster", category: "Projects", dateAssigned: "2026-01-06", dateDue: "2026-01-13", score: 95, maxScore: 100, weight: 20, status: "graded" },
        { id: "ess2", name: "Map Skills Quiz", category: "Quizzes", dateAssigned: "2026-01-10", dateDue: "2026-01-10", score: 90, maxScore: 100, weight: 10, status: "graded" },
        { id: "ess3", name: "Our Town History Report", category: "Projects", dateAssigned: "2026-01-06", dateDue: "2026-01-24", score: 92, maxScore: 100, weight: 25, status: "graded" },
        { id: "ess4", name: "Unit 4 Test – Communities", category: "Tests", dateAssigned: "2026-01-27", dateDue: "2026-01-29", score: 94, maxScore: 100, weight: 25, status: "graded" },
        { id: "ess5", name: "Current Events Show & Tell", category: "Participation", dateAssigned: "2026-01-31", dateDue: "2026-02-03", score: null, maxScore: 100, weight: 5, status: "upcoming" },
      ],
    },
  },
};

function scoreBadge(a: Assignment): { text: string; bg: string; textColor: string } {
  if (a.status === "upcoming") return { text: "Upcoming", bg: "bg-gray-100 dark:bg-slate-800", textColor: "text-gray-500 dark:text-gray-400" };
  if (a.status === "missing") return { text: "Missing", bg: "bg-red-100 dark:bg-red-950/40", textColor: "text-red-700 dark:text-red-400" };
  if (a.status === "excused") return { text: "Excused", bg: "bg-amber-100 dark:bg-amber-950/40", textColor: "text-amber-700 dark:text-amber-400" };
  if (a.score === null) return { text: "—", bg: "", textColor: "text-gray-300 dark:text-gray-600" };
  const pct = Math.round((a.score / a.maxScore) * 100);
  if (pct >= 90) return { text: `${a.score}/${a.maxScore}`, bg: "bg-emerald-50 dark:bg-emerald-950/30", textColor: "text-emerald-700 dark:text-emerald-400" };
  if (pct >= 80) return { text: `${a.score}/${a.maxScore}`, bg: "bg-blue-50 dark:bg-blue-950/30", textColor: "text-blue-700 dark:text-blue-400" };
  if (pct >= 70) return { text: `${a.score}/${a.maxScore}`, bg: "bg-amber-50 dark:bg-amber-950/30", textColor: "text-amber-700 dark:text-amber-400" };
  return { text: `${a.score}/${a.maxScore}`, bg: "bg-red-50 dark:bg-red-950/30", textColor: "text-red-700 dark:text-red-400" };
}

function pctColor(pct: number): string {
  if (pct >= 90) return "text-emerald-700 dark:text-emerald-400";
  if (pct >= 80) return "text-blue-700 dark:text-blue-400";
  if (pct >= 70) return "text-amber-700 dark:text-amber-400";
  return "text-red-700 dark:text-red-400";
}

function letterGrade(pct: number): string {
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 65) return "D";
  return "F";
}

function formatDate(d: string): string {
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ClassGradesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const classId = params.classId as string;
  const studentId = searchParams.get("student") ?? "1";

  const studentClasses = CLASS_DETAILS[studentId];
  const classInfo = studentClasses?.[classId];

  if (!classInfo) {
    return (
      <div className="space-y-6">
        <Link href="/sis/parent/grades-attendance" className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to Grades & Attendance
        </Link>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Class not found.</p>
        </div>
      </div>
    );
  }

  const gradedAssignments = classInfo.assignments.filter(a => a.status === "graded" && a.score !== null);
  const totalWeightedScore = gradedAssignments.reduce((sum, a) => sum + (a.score! / a.maxScore) * a.weight, 0);
  const totalWeight = gradedAssignments.reduce((sum, a) => sum + a.weight, 0);
  const overallPct = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : null;

  const categories = [...new Set(classInfo.assignments.map(a => a.category))];
  const categoryStats = categories.map(cat => {
    const catAssignments = classInfo.assignments.filter(a => a.category === cat);
    const catGraded = catAssignments.filter(a => a.status === "graded" && a.score !== null);
    const catAvg = catGraded.length
      ? Math.round(catGraded.reduce((s, a) => s + (a.score! / a.maxScore) * 100, 0) / catGraded.length)
      : null;
    return { category: cat, count: catAssignments.length, graded: catGraded.length, avg: catAvg };
  });

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link href="/sis/parent/grades-attendance" className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Back to Grades & Attendance
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-950/40">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{classInfo.course}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{classInfo.teacher} · Period {classInfo.period} · Room {classInfo.room}</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Student: {classInfo.studentName}</p>
          </div>
        </div>

        {overallPct !== null && (
          <div className="text-right">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current Grade</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${pctColor(overallPct)}`}>{overallPct}%</p>
              <span className={`text-lg font-semibold ${pctColor(overallPct)}`}>{letterGrade(overallPct)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quarter grades + category summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quarter grades */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Quarter Grades</h3>
          <div className="grid grid-cols-3 gap-3">
            {(["q1", "q2", "q3"] as const).map((q, i) => {
              const val = classInfo[q];
              return (
                <div key={q} className="text-center p-3 rounded-lg bg-gray-50 dark:bg-slate-800/50">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Q{i + 1}</p>
                  <p className={`text-xl font-bold ${val !== null ? pctColor(val) : "text-gray-300 dark:text-gray-600"}`}>
                    {val !== null ? `${val}%` : "—"}
                  </p>
                  {val !== null && (
                    <p className={`text-xs font-medium mt-0.5 ${pctColor(val)}`}>{letterGrade(val)}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Category Averages</h3>
          <div className="space-y-2">
            {categoryStats.map(cs => (
              <div key={cs.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{cs.category}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">({cs.graded}/{cs.count})</span>
                </div>
                {cs.avg !== null ? (
                  <span className={`text-sm font-bold ${pctColor(cs.avg)}`}>{cs.avg}%</span>
                ) : (
                  <span className="text-sm font-bold text-gray-300 dark:text-gray-600">—</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments table */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Assignments ({classInfo.assignments.length})
        </h2>
        {classInfo.assignments.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No assignments for this class.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700">
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50 min-w-[250px]">Assignment</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Category</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Assigned</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Due</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Score</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">%</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {classInfo.assignments.map(a => {
                    const badge = scoreBadge(a);
                    const pct = a.score !== null ? Math.round((a.score / a.maxScore) * 100) : null;
                    return (
                      <tr key={a.id} className="group hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{a.name}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400">
                            {a.category}
                          </span>
                        </td>
                        <td className="text-center px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{formatDate(a.dateAssigned)}</td>
                        <td className="text-center px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{formatDate(a.dateDue)}</td>
                        <td className="text-center px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${badge.bg} ${badge.textColor}`}>
                            {badge.text}
                          </span>
                        </td>
                        <td className={`text-center px-4 py-3 text-sm font-bold ${pct !== null ? pctColor(pct) : "text-gray-300 dark:text-gray-600"}`}>
                          {pct !== null ? `${pct}%` : "—"}
                        </td>
                        <td className="text-center px-4 py-3 text-xs text-gray-500 dark:text-gray-400">{a.weight}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
