"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { BarChart3, Mail } from "lucide-react";
import Link from "next/link";

const STUDENTS = [
  { id: "1", name: "Alex Johnson", grade: "5th Grade", initials: "AJ", color: "#1e3a8a" },
  { id: "2", name: "Emma Johnson", grade: "3rd Grade", initials: "EJ", color: "#166534" },
];

interface ClassRow {
  id: string;
  period: string;
  course: string;
  teacher: string;
  teacherEmail: string;
  room: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  s1: number | null;
  s2: number | null;
  absences: number;
  tardies: number;
  lastWeek: string[];
  thisWeek: string[];
}

const ALEX_CLASSES: ClassRow[] = [
  { id: "c1", period: "1(A-D)", course: "Homeroom Grade 05", teacher: "Julia Arlington", teacherEmail: "jarlington@school.edu", room: "A138", q1: null, q2: null, q3: null, q4: null, s1: null, s2: null, absences: 4, tardies: 0, lastWeek: ["", "2A", "2A", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "c2", period: "2(A-D)", course: "Language Arts Grade 5", teacher: "Julia Arlington", teacherEmail: "jarlington@school.edu", room: "314/Artigo", q1: 85, q2: 85, q3: 94, q4: null, s1: 85, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "c3", period: "3(A-D)", course: "Math Grade 5", teacher: "Julia Arlington", teacherEmail: "jarlington@school.edu", room: "314/Artigo", q1: 81, q2: 81, q3: 80, q4: null, s1: 81, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "c4", period: "4(A-D)", course: "Science Grade 5", teacher: "Julia Arlington", teacherEmail: "jarlington@school.edu", room: "314/Artigo", q1: 81, q2: 81, q3: 84, q4: null, s1: 81, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "c5", period: "5(A-D)", course: "Social Studies Grade 5", teacher: "Julia Arlington", teacherEmail: "jarlington@school.edu", room: "314/Artigo", q1: 88, q2: 81, q3: 85, q4: null, s1: 85, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "c6", period: "3B(A)", course: "Art Grade 5", teacher: "Michael H. Garrett", teacherEmail: "mgarrett@school.edu", room: "ART", q1: null, q2: null, q3: null, q4: null, s1: null, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "c7", period: "3B(B)", course: "Music Grade 5", teacher: "Virginia B. Williamson", teacherEmail: "vwilliamson@school.edu", room: "MUSIC", q1: null, q2: null, q3: null, q4: null, s1: null, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "c8", period: "3B(C)", course: "Physical Education Grade 5", teacher: "Catherine Old", teacherEmail: "cold@school.edu", room: "GYM", q1: null, q2: null, q3: null, q4: null, s1: null, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "c9", period: "3B(D)", course: "STEM Grade 5", teacher: "Jessica Gray", teacherEmail: "jgray@school.edu", room: "A126", q1: null, q2: null, q3: null, q4: null, s1: null, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
];

const EMMA_CLASSES: ClassRow[] = [
  { id: "e1", period: "1(A-D)", course: "Homeroom Grade 03", teacher: "Sarah Mitchell", teacherEmail: "smitchell@school.edu", room: "B205", q1: null, q2: null, q3: null, q4: null, s1: null, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "e2", period: "2(A-D)", course: "Language Arts Grade 3", teacher: "Sarah Mitchell", teacherEmail: "smitchell@school.edu", room: "B205", q1: 95, q2: 97, q3: 98, q4: null, s1: 96, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "e3", period: "3(A-D)", course: "Math Grade 3", teacher: "Sarah Mitchell", teacherEmail: "smitchell@school.edu", room: "B205", q1: 92, q2: 94, q3: 96, q4: null, s1: 93, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "e4", period: "4(A-D)", course: "Science Grade 3", teacher: "Sarah Mitchell", teacherEmail: "smitchell@school.edu", room: "B205", q1: 90, q2: 93, q3: 95, q4: null, s1: 92, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
  { id: "e5", period: "5(A-D)", course: "Social Studies Grade 3", teacher: "Sarah Mitchell", teacherEmail: "smitchell@school.edu", room: "B205", q1: 88, q2: 91, q3: 93, q4: null, s1: 90, s2: null, absences: 0, tardies: 0, lastWeek: ["", "", "", "", ""], thisWeek: ["", "", "", "", ""] },
];

const CLASS_DATA: Record<string, ClassRow[]> = {
  "1": ALEX_CLASSES,
  "2": EMMA_CLASSES,
};

const DAYS = ["M", "T", "W", "H", "F"];

function pctToGPA(pct: number): number {
  if (pct >= 93) return 4.0;
  if (pct >= 90) return 3.7;
  if (pct >= 87) return 3.3;
  if (pct >= 83) return 3.0;
  if (pct >= 80) return 2.7;
  if (pct >= 77) return 2.3;
  if (pct >= 73) return 2.0;
  if (pct >= 70) return 1.7;
  if (pct >= 67) return 1.3;
  if (pct >= 65) return 1.0;
  return 0.0;
}

function gradeColor(g: number | null): string {
  if (g === null) return "text-gray-300 dark:text-gray-600";
  return "text-[#1e3a8a] dark:text-blue-400";
}

function gradeBg(g: number | null): string {
  if (g === null) return "";
  if (g >= 90) return "bg-emerald-50 dark:bg-emerald-950/30";
  if (g >= 80) return "bg-blue-50 dark:bg-blue-950/30";
  if (g >= 70) return "bg-amber-50 dark:bg-amber-950/30";
  return "bg-red-50 dark:bg-red-950/30";
}

export default function GradesAttendancePage() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const initialStudentId = searchParams.get("student");
  const initialStudent = STUDENTS.find(s => s.id === initialStudentId) ?? STUDENTS[0];
  const [selectedStudent, setSelectedStudent] = useState(initialStudent);
  const classes = CLASS_DATA[selectedStudent.id] ?? [];

  const totalAbsences = classes.reduce((s, c) => s + c.absences, 0);
  const totalTardies = classes.reduce((s, c) => s + c.tardies, 0);

  const gradedClasses = classes.filter(c => c.q1 !== null || c.q2 !== null || c.q3 !== null);
  const avgQ1 = gradedClasses.length ? Math.round(gradedClasses.reduce((s, c) => s + (c.q1 ?? 0), 0) / gradedClasses.filter(c => c.q1 !== null).length) : null;
  const avgQ2 = gradedClasses.length ? Math.round(gradedClasses.reduce((s, c) => s + (c.q2 ?? 0), 0) / gradedClasses.filter(c => c.q2 !== null).length) : null;
  const avgS1 = gradedClasses.filter(c => c.s1 !== null).length ? Math.round(gradedClasses.filter(c => c.s1 !== null).reduce((s, c) => s + c.s1!, 0) / gradedClasses.filter(c => c.s1 !== null).length) : null;
  const avgQ3 = gradedClasses.length ? Math.round(gradedClasses.reduce((s, c) => s + (c.q3 ?? 0), 0) / gradedClasses.filter(c => c.q3 !== null).length) : null;
  const avgQ4 = gradedClasses.filter(c => c.q4 !== null).length ? Math.round(gradedClasses.filter(c => c.q4 !== null).reduce((s, c) => s + c.q4!, 0) / gradedClasses.filter(c => c.q4 !== null).length) : null;
  const avgS2 = gradedClasses.filter(c => c.s2 !== null).length ? Math.round(gradedClasses.filter(c => c.s2 !== null).reduce((s, c) => s + c.s2!, 0) / gradedClasses.filter(c => c.s2 !== null).length) : null;

  const q3Classes = classes.filter(c => c.q3 !== null);
  const currentGPA = q3Classes.length
    ? (q3Classes.reduce((s, c) => s + pctToGPA(c.q3!), 0) / q3Classes.length).toFixed(2)
    : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-950/40">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Grades & Attendance</h1>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current GPA</p>
          <p className="text-2xl font-bold text-[#1e3a8a] dark:text-blue-400">{currentGPA}</p>
        </div>
      </div>

      {/* Student tabs + table */}
      <section>
        <div className="overflow-x-auto pl-4 border-b border-gray-200 dark:border-gray-700 mb-4">
          <div className="flex gap-6">
            {STUDENTS.map((s) => {
              const isActive = s.id === selectedStudent.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudent(s)}
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th rowSpan={2} className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50 sticky left-0 z-10 min-w-[60px]">Exp</th>
                  <th colSpan={5} className="text-center px-2 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">Last Week</th>
                  <th colSpan={5} className="text-center px-2 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">This Week</th>
                  <th rowSpan={2} className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50 min-w-[200px]">Course</th>
                  <th rowSpan={2} className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Q1</th>
                  <th rowSpan={2} className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Q2</th>
                  <th rowSpan={2} className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">S1</th>
                  <th rowSpan={2} className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Q3</th>
                  <th rowSpan={2} className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Q4</th>
                  <th rowSpan={2} className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">S2</th>
                  <th rowSpan={2} className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Abs</th>
                  <th rowSpan={2} className="text-center px-3 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50 dark:bg-slate-800/50">Tard</th>
                </tr>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  {DAYS.map(d => <th key={`lw-${d}`} className="text-center px-1.5 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50 w-8">{d}</th>)}
                  {DAYS.map(d => <th key={`tw-${d}`} className="text-center px-1.5 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50 w-8">{d}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {classes.map((c) => (
                  <tr key={c.id} className="group hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 sticky left-0 bg-white dark:bg-slate-900 group-hover:bg-gray-50 dark:group-hover:bg-slate-800/30 z-10 transition-colors">{c.period}</td>
                    {c.lastWeek.map((v, i) => (
                      <td key={`lw-${i}`} className="text-center px-1.5 py-3 text-xs text-gray-500 dark:text-gray-400">
                        {v && <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">{v}</span>}
                      </td>
                    ))}
                    {c.thisWeek.map((v, i) => (
                      <td key={`tw-${i}`} className="text-center px-1.5 py-3 text-xs text-gray-500 dark:text-gray-400">
                        {v && <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">{v}</span>}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div>
                        <Link
                          href={`/sis/parent/grades-attendance/${c.id}?student=${selectedStudent.id}`}
                          className="text-sm font-semibold text-[#1e3a8a] dark:text-blue-400 hover:underline"
                        >
                          {c.course}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <a href={`mailto:${c.teacherEmail}`} className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-300 transition-colors group/email">
                            <Mail className="w-3 h-3 text-blue-500 group-hover/email:text-blue-600 dark:group-hover/email:text-blue-300" />
                            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover/email:text-blue-600 dark:group-hover/email:text-blue-300 group-hover/email:underline">{c.teacher}</span>
                          </a>
                          <span className="text-xs text-gray-500 dark:text-gray-400">· Rm {c.room}</span>
                        </div>
                      </div>
                    </td>
                    <td className={`text-center px-3 py-3 text-sm font-bold ${gradeColor(c.q1)}`}>{c.q1 ?? "—"}</td>
                    <td className={`text-center px-3 py-3 text-sm font-bold ${gradeColor(c.q2)}`}>{c.q2 ?? "—"}</td>
                    <td className={`text-center px-3 py-3 text-sm font-bold ${gradeColor(c.s1)}`}>{c.s1 ?? "—"}</td>
                    <td className={`text-center px-3 py-3 text-sm font-bold ${gradeColor(c.q3)}`}>{c.q3 ?? "—"}</td>
                    <td className={`text-center px-3 py-3 text-sm font-bold ${gradeColor(c.q4)}`}>{c.q4 ?? "—"}</td>
                    <td className={`text-center px-3 py-3 text-sm font-bold ${gradeColor(c.s2)}`}>{c.s2 ?? "—"}</td>
                    <td className={`text-center px-3 py-3 text-sm font-bold ${c.absences > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{c.absences}</td>
                    <td className={`text-center px-3 py-3 text-sm font-bold ${c.tardies > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{c.tardies}</td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-gray-50 dark:bg-slate-800/50 border-t-2 border-gray-200 dark:border-slate-700">
                  <td colSpan={11} className="px-4 py-3 sticky left-0 bg-gray-50 dark:bg-slate-800/50 z-10" />
                  <td className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Totals</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${avgQ1 !== null ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{avgQ1 ?? "—"}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${avgQ2 !== null ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{avgQ2 ?? "—"}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${avgS1 !== null ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{avgS1 ?? "—"}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${avgQ3 !== null ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{avgQ3 ?? "—"}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${avgQ4 !== null ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{avgQ4 ?? "—"}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${avgS2 !== null ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{avgS2 ?? "—"}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${totalAbsences > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{totalAbsences}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${totalTardies > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{totalTardies}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Attendance by Day table */}
      <section>
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Attendance by Day</h2>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="w-12 bg-gray-50 dark:bg-slate-800/50" />
                  <th colSpan={5} className="text-center px-2 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">Last Week</th>
                  <th colSpan={5} className="text-center px-2 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">This Week</th>
                  <th className="text-center px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-slate-800/50">25-26</th>
                  <th colSpan={2} className="text-center px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-slate-800/50">Absences</th>
                  <th colSpan={2} className="text-center px-3 py-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-slate-800/50">Tardies</th>
                </tr>
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <th className="bg-gray-50 dark:bg-slate-800/50" />
                  {DAYS.map(d => <th key={`lw-${d}`} className="text-center px-1.5 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50 w-8">{d}</th>)}
                  {DAYS.map(d => <th key={`tw-${d}`} className="text-center px-1.5 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50 w-8">{d}</th>)}
                  <th className="bg-gray-50 dark:bg-slate-800/50" />
                  <th className="text-center px-2 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50">25-26</th>
                  <th className="text-center px-2 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50">YTD</th>
                  <th className="text-center px-2 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50">25-26</th>
                  <th className="text-center px-2 py-1.5 text-[10px] font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50">YTD</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td />
                  {/* Last week — 2A on Monday & Tuesday for Alex */}
                  {(selectedStudent.id === "1" ? ["2A", "2A", "", "", ""] : ["", "", "", "", ""]).map((v, i) => (
                    <td key={`dlw-${i}`} className="text-center px-1.5 py-3 text-xs text-gray-500 dark:text-gray-400">
                      {v && <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">{v}</span>}
                    </td>
                  ))}
                  {DAYS.map((_, i) => <td key={`dtw-${i}`} className="text-center px-1.5 py-3" />)}
                  <td />
                  <td className={`text-center px-3 py-3 text-sm font-bold ${totalAbsences > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{totalAbsences}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${totalAbsences > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{totalAbsences}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${totalTardies > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{totalTardies}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${totalTardies > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{totalTardies}</td>
                </tr>
                <tr className="bg-gray-50 dark:bg-slate-800/50 border-t-2 border-gray-200 dark:border-slate-700">
                  <td colSpan={11} />
                  <td className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Totals</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${totalAbsences > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{totalAbsences}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${totalAbsences > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{totalAbsences}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${totalTardies > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{totalTardies}</td>
                  <td className={`text-center px-3 py-3 text-sm font-bold ${totalTardies > 0 ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-300 dark:text-gray-600"}`}>{totalTardies}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Legend */}
      <section>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm px-5 py-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Legend</h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
            {[
              { code: "A", meaning: "Absent" },
              { code: "2A", meaning: "Half-day Absent" },
              { code: "T", meaning: "Tardy" },
              { code: "E", meaning: "Excused" },
              { code: "ISS", meaning: "In-School Suspension" },
              { code: "OSS", meaning: "Out-of-School Suspension" },
              { code: "M", meaning: "Medical" },
              { code: "R", meaning: "Religious Observance" },
              { code: "F", meaning: "Field Trip" },
            ].map(({ code, meaning }) => (
              <div key={code} className="flex items-center gap-1.5">
                <span className="inline-block px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-[10px] font-bold text-gray-700 dark:text-gray-300">{code}</span>
                <span>{meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
