"use client";

import { Printer, MessageSquare } from "lucide-react";

// Mock grades data
const MOCK_GRADES = [
  {
    id: "1",
    name: "Revolution Topic Discussion",
    dueDate: "Oct 16 by 11:59pm",
    status: "late",
    score: null,
    outOf: 10,
    hasComments: true,
  },
  {
    id: "2",
    name: "Abraham Lincoln Essay",
    dueDate: "Oct 22 by 11:59pm",
    status: "missing",
    score: null,
    outOf: 50,
    hasComments: false,
  },
  {
    id: "3",
    name: "Position Paper",
    dueDate: "Oct 23 by 11:59pm",
    status: "graded",
    score: 22,
    outOf: 25,
    hasComments: false,
  },
  {
    id: "4",
    name: "History Overview",
    dueDate: "Oct 24 by 11:59pm",
    status: "submitted",
    score: null,
    outOf: 11,
    hasComments: true,
  },
  {
    id: "5",
    name: "The Bill of Rights Quiz",
    dueDate: "Oct 29 by 11:59pm",
    status: "graded",
    score: 8,
    outOf: 10,
    hasComments: false,
  },
  {
    id: "6",
    name: "Chapter 5 Homework",
    dueDate: "Nov 2 by 11:59pm",
    status: "graded",
    score: 18,
    outOf: 20,
    hasComments: false,
  },
  {
    id: "7",
    name: "Midterm Exam",
    dueDate: "Nov 10 by 3:00pm",
    status: "graded",
    score: 87,
    outOf: 100,
    hasComments: true,
  },
  {
    id: "8",
    name: "Chapter 6 Vocabulary Quiz",
    dueDate: "Nov 14 by 11:59pm",
    status: "graded",
    score: 15,
    outOf: 15,
    hasComments: false,
  },
  {
    id: "9",
    name: "Civil War Timeline Project",
    dueDate: "Nov 18 by 11:59pm",
    status: "graded",
    score: 42,
    outOf: 50,
    hasComments: true,
  },
  {
    id: "10",
    name: "Chapter 7 Reading Response",
    dueDate: "Nov 21 by 11:59pm",
    status: "graded",
    score: 9,
    outOf: 10,
    hasComments: false,
  },
  {
    id: "11",
    name: "Reconstruction Era Quiz",
    dueDate: "Nov 25 by 11:59pm",
    status: "graded",
    score: 18,
    outOf: 20,
    hasComments: false,
  },
  {
    id: "12",
    name: "Primary Source Analysis",
    dueDate: "Dec 1 by 11:59pm",
    status: "graded",
    score: 28,
    outOf: 30,
    hasComments: true,
  },
  {
    id: "13",
    name: "Chapter 8 Homework",
    dueDate: "Dec 5 by 11:59pm",
    status: "graded",
    score: 17,
    outOf: 20,
    hasComments: false,
  },
  {
    id: "14",
    name: "Industrial Revolution Essay",
    dueDate: "Dec 10 by 11:59pm",
    status: "graded",
    score: 45,
    outOf: 50,
    hasComments: true,
  },
  {
    id: "15",
    name: "Map Skills Assessment",
    dueDate: "Dec 12 by 11:59pm",
    status: "graded",
    score: 23,
    outOf: 25,
    hasComments: false,
  },
  {
    id: "16",
    name: "Chapter 9 Quiz",
    dueDate: "Dec 15 by 11:59pm",
    status: "graded",
    score: 14,
    outOf: 15,
    hasComments: false,
  },
  {
    id: "17",
    name: "Immigration Research Project",
    dueDate: "Dec 18 by 11:59pm",
    status: "submitted",
    score: null,
    outOf: 75,
    hasComments: false,
  },
  {
    id: "18",
    name: "Final Exam Review Worksheet",
    dueDate: "Jan 5 by 11:59pm",
    status: "upcoming",
    score: null,
    outOf: 20,
    hasComments: false,
  },
  {
    id: "19",
    name: "Final Exam",
    dueDate: "Jan 15 by 3:00pm",
    status: "upcoming",
    score: null,
    outOf: 150,
    hasComments: false,
  },
];

export default function GradesPage() {
  // Calculate total points and grade
  const totalScore = MOCK_GRADES.reduce((sum, g) => sum + (g.score || 0), 0);
  const totalPossible = MOCK_GRADES.reduce((sum, g) => sum + g.outOf, 0);
  const gradePercentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-normal text-gray-900 dark:text-white">
          Final Calculated Grade
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      {/* Points and Grade Summary */}
      <div className="flex items-center gap-12 mb-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Points</span>
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {totalScore}/{totalPossible}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Grade</span>
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            {gradePercentage}%
          </span>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 px-6 py-2 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Name
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Due
              </th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Points
              </th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Grade
              </th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Comments
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_GRADES.map((grade) => {
              const gradePercent = grade.score !== null ? Math.round((grade.score / grade.outOf) * 100) : null;
              return (
                <tr
                  key={grade.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-2">
                    <a
                      href="#"
                      className="text-[#6E8CB9] hover:underline text-sm"
                    >
                      {grade.name}
                    </a>
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
                    {grade.dueDate}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <StatusBadge status={grade.status} />
                  </td>
                  <td className="py-4 px-2 text-center text-sm text-gray-900 dark:text-white">
                    {grade.score !== null ? `${grade.score}/${grade.outOf}` : "-"}
                  </td>
                  <td className="py-4 px-2 text-center text-sm text-gray-900 dark:text-white">
                    {gradePercent !== null ? `${gradePercent}%` : "-"}
                  </td>
                  <td className="py-4 px-2 text-center">
                    {grade.hasComments ? (
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="View Comments"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "late":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-transparent border border-red-500 text-red-600">
          LATE
        </span>
      );
    case "missing":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-transparent border border-red-500 text-red-600">
          MISSING
        </span>
      );
    case "graded":
      return null;
    case "submitted":
      return null;
    case "upcoming":
      return null;
    default:
      return null;
  }
}
