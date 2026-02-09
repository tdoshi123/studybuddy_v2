"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageSquare } from "lucide-react";

type CompletionStatus = "not_submitted" | "submitted";

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  startDate?: string;
  completionStatus: CompletionStatus;
  score: number | null;
  outOf: number;
  hasComments: boolean;
}

// Mock data for assignments
const ASSIGNMENTS_DATA: Assignment[] = [
  {
    id: 1,
    title: "Final Exam Review Worksheet",
    dueDate: "Feb 10, 2026 11:59 PM",
    startDate: "Jan 28",
    completionStatus: "not_submitted",
    score: null,
    outOf: 20,
    hasComments: false,
  },
  {
    id: 3,
    title: "Research Project Proposal",
    dueDate: "Jan 24, 2026 11:59 PM",
    startDate: "Jan 10",
    completionStatus: "submitted",
    score: null,
    outOf: 30,
    hasComments: false,
  },
  {
    id: 4,
    title: "Immigration Research Project",
    dueDate: "Dec 18, 2025 11:59 PM",
    completionStatus: "submitted",
    score: 68,
    outOf: 75,
    hasComments: true,
  },
  {
    id: 5,
    title: "Chapter 8 Homework",
    dueDate: "Dec 5, 2025 11:59 PM",
    completionStatus: "submitted",
    score: 17,
    outOf: 20,
    hasComments: false,
  },
  {
    id: 6,
    title: "Primary Source Analysis",
    dueDate: "Dec 1, 2025 11:59 PM",
    completionStatus: "submitted",
    score: 28,
    outOf: 30,
    hasComments: true,
  },
  {
    id: 7,
    title: "Civil War Timeline Project",
    dueDate: "Nov 18, 2025 11:59 PM",
    completionStatus: "submitted",
    score: 42,
    outOf: 50,
    hasComments: true,
  },
  {
    id: 9,
    title: "Abraham Lincoln Essay",
    dueDate: "Oct 22, 2025 11:59 PM",
    completionStatus: "not_submitted",
    score: null,
    outOf: 50,
    hasComments: false,
  },
];

export default function AssignmentsPage() {
  const params = useParams();
  const courseId = params.id as string;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-normal text-gray-900 dark:text-white">Assignments</h1>
      </div>

      {/* Assignments Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 px-6 py-2 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Assignment
              </th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Completion Status
              </th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Score
              </th>
              <th className="text-center py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Comments
              </th>
            </tr>
          </thead>
          <tbody>
            {ASSIGNMENTS_DATA.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No assignments found
                </td>
              </tr>
            ) : (
              ASSIGNMENTS_DATA.map((assignment) => (
                <tr
                  key={assignment.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Assignment Column */}
                  <td className="py-4 px-2">
                    <div className="space-y-1">
                      <Link
                        href={`/courses/${courseId}/assignments/${assignment.id}`}
                        className="text-[#6E8CB9] hover:underline text-sm"
                      >
                        {assignment.title}
                      </Link>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Due on {assignment.dueDate}
                      </div>
                      {assignment.startDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="underline">Starts {assignment.startDate}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  {/* Completion Status Column */}
                  <td className="py-4 px-2 text-center">
                    <CompletionStatusBadge status={assignment.completionStatus} />
                  </td>
                  
                  {/* Score Column */}
                  <td className="py-4 px-2 text-center text-sm text-gray-900 dark:text-white">
                    {assignment.score !== null ? assignment.score : "-"} / {assignment.outOf}
                  </td>
                  
                  {/* Comments Column */}
                  <td className="py-4 px-2 text-center">
                    {assignment.hasComments ? (
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="View Comments"
                      >
                        <MessageSquare className="w-4 h-4 mx-auto" />
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompletionStatusBadge({ status }: { status: CompletionStatus }) {
  switch (status) {
    case "not_submitted":
      return (
        <span className="text-sm text-red-600 dark:text-red-400">
          Not Submitted
        </span>
      );
    case "submitted":
      return (
        <span className="text-sm text-green-600 dark:text-green-400">
          Submitted
        </span>
      );
    default:
      return null;
  }
}
