"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";

interface HistoryCourse {
  name: string;
  grade: string;
  percentage: number;
}

interface HistoryYear {
  label: string;
  courses: HistoryCourse[];
}

const ALEX_HISTORY: HistoryYear[] = [
  {
    label: "2022-2023",
    courses: [
      { name: "Homeroom Grade 02", grade: "—", percentage: 0 },
      { name: "Language Arts Grade 2", grade: "B+", percentage: 88 },
      { name: "Math Grade 2", grade: "B", percentage: 84 },
      { name: "Science Grade 2", grade: "B+", percentage: 87 },
      { name: "Social Studies Grade 2", grade: "A-", percentage: 90 },
      { name: "Art Grade 2", grade: "A", percentage: 95 },
      { name: "Music Grade 2", grade: "A", percentage: 93 },
      { name: "Physical Education Grade 2", grade: "A", percentage: 96 },
    ],
  },
  {
    label: "2023-2024",
    courses: [
      { name: "Homeroom Grade 03", grade: "—", percentage: 0 },
      { name: "Language Arts Grade 3", grade: "B+", percentage: 87 },
      { name: "Math Grade 3", grade: "B", percentage: 83 },
      { name: "Science Grade 3", grade: "B", percentage: 85 },
      { name: "Social Studies Grade 3", grade: "B+", percentage: 88 },
      { name: "Art Grade 3", grade: "A", percentage: 94 },
      { name: "Music Grade 3", grade: "A-", percentage: 91 },
      { name: "Physical Education Grade 3", grade: "A", percentage: 95 },
    ],
  },
  {
    label: "2024-2025",
    courses: [
      { name: "Homeroom Grade 04", grade: "—", percentage: 0 },
      { name: "Language Arts Grade 4", grade: "B+", percentage: 89 },
      { name: "Math Grade 4", grade: "B", percentage: 82 },
      { name: "Science Grade 4", grade: "B+", percentage: 86 },
      { name: "Social Studies Grade 4", grade: "B+", percentage: 87 },
      { name: "Art Grade 4", grade: "A", percentage: 96 },
      { name: "Music Grade 4", grade: "A", percentage: 93 },
      { name: "Physical Education Grade 4", grade: "A", percentage: 97 },
      { name: "STEM Grade 4", grade: "A-", percentage: 90 },
    ],
  },
  {
    label: "2025-2026",
    courses: [
      { name: "Homeroom Grade 05", grade: "—", percentage: 0 },
      { name: "Language Arts Grade 5", grade: "A-", percentage: 94 },
      { name: "Math Grade 5", grade: "B", percentage: 80 },
      { name: "Science Grade 5", grade: "B", percentage: 84 },
      { name: "Social Studies Grade 5", grade: "B+", percentage: 85 },
      { name: "Art Grade 5", grade: "—", percentage: 0 },
      { name: "Music Grade 5", grade: "—", percentage: 0 },
      { name: "Physical Education Grade 5", grade: "—", percentage: 0 },
      { name: "STEM Grade 5", grade: "—", percentage: 0 },
    ],
  },
];

const EMMA_HISTORY: HistoryYear[] = [
  {
    label: "2023-2024",
    courses: [
      { name: "Homeroom Grade 02", grade: "—", percentage: 0 },
      { name: "Language Arts Grade 2", grade: "A", percentage: 94 },
      { name: "Math Grade 2", grade: "A-", percentage: 91 },
      { name: "Science Grade 2", grade: "A-", percentage: 90 },
      { name: "Social Studies Grade 2", grade: "B+", percentage: 88 },
      { name: "Art Grade 2", grade: "A+", percentage: 98 },
      { name: "Music Grade 2", grade: "A", percentage: 95 },
      { name: "Physical Education Grade 2", grade: "A", percentage: 93 },
    ],
  },
  {
    label: "2024-2025",
    courses: [
      { name: "Homeroom Grade 02", grade: "—", percentage: 0 },
      { name: "Language Arts Grade 2", grade: "A", percentage: 96 },
      { name: "Math Grade 2", grade: "A-", percentage: 93 },
      { name: "Science Grade 2", grade: "A", percentage: 94 },
      { name: "Social Studies Grade 2", grade: "A-", percentage: 91 },
      { name: "Art Grade 2", grade: "A+", percentage: 97 },
      { name: "Music Grade 2", grade: "A", percentage: 95 },
      { name: "Physical Education Grade 2", grade: "A", percentage: 94 },
    ],
  },
  {
    label: "2025-2026",
    courses: [
      { name: "Homeroom Grade 03", grade: "—", percentage: 0 },
      { name: "Language Arts Grade 3", grade: "A+", percentage: 98 },
      { name: "Math Grade 3", grade: "A", percentage: 96 },
      { name: "Science Grade 3", grade: "A", percentage: 95 },
      { name: "Social Studies Grade 3", grade: "A-", percentage: 93 },
    ],
  },
];

const HISTORY_DATA: Record<string, HistoryYear[]> = {
  "1": ALEX_HISTORY,
  "2": EMMA_HISTORY,
};

function letterToGPA(grade: string): number {
  const map: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0,
  };
  return map[grade] ?? -1;
}

function getGradeColor(grade: string): string {
  if (grade === "—") return "bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-gray-500";
  if (grade.startsWith("A")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  if (grade.startsWith("C")) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
}

export default function GradeHistoryPage() {
  const [selectedYear, setSelectedYear] = useState(0);

  const years = HISTORY_DATA["1"] ?? [];
  const currentYear = years[selectedYear] ?? years[0];

  const gradedCourses = currentYear ? currentYear.courses.filter(c => letterToGPA(c.grade) >= 0) : [];
  const yearGPA = gradedCourses.length
    ? (gradedCourses.reduce((s, c) => s + letterToGPA(c.grade), 0) / gradedCourses.length).toFixed(2)
    : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/40">
            <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Grade History</h1>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{currentYear?.label} GPA</p>
          <p className="text-2xl font-bold text-[#1e3a8a] dark:text-blue-400">{yearGPA}</p>
        </div>
      </div>

      {/* Year pills */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {years.map((year, i) => (
          <button
            key={year.label}
            onClick={() => setSelectedYear(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedYear === i
                ? "bg-[#1e3a8a] text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {year.label}
          </button>
        ))}
      </div>

      {/* History table */}
      {currentYear && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                <th className="py-4 px-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="py-4 px-5 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]">
                  Grade
                </th>
                <th className="py-4 px-5 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]">
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {currentYear.courses.map((course, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-4 px-5 text-sm font-medium text-gray-900 dark:text-white">
                    {course.name}
                  </td>
                  <td className="py-4 px-5 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${getGradeColor(course.grade)}`}>
                      {course.grade}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {course.percentage > 0 ? `${course.percentage}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
