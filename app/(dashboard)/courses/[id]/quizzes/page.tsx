"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageSquare } from "lucide-react";

type CompletionStatus = "not_submitted" | "submitted";

interface Quiz {
  id: number;
  title: string;
  dueDate: string;
  startDate?: string;
  completionStatus: CompletionStatus;
  score: number | null;
  outOf: number;
  hasComments: boolean;
}

// Mock data for quizzes
const QUIZZES_DATA: Quiz[] = [
  {
    id: 1,
    title: "Chapter 9: World War II Quiz",
    dueDate: "Feb 12, 2026 11:59 PM",
    startDate: "Feb 5",
    completionStatus: "not_submitted",
    score: null,
    outOf: 50,
    hasComments: false,
  },
  {
    id: 2,
    title: "Midterm Review Quiz",
    dueDate: "Feb 8, 2026 11:59 PM",
    startDate: "Feb 1",
    completionStatus: "not_submitted",
    score: null,
    outOf: 100,
    hasComments: false,
  },
  {
    id: 3,
    title: "Chapter 8: The Great Depression",
    dueDate: "Jan 20, 2026 11:59 PM",
    completionStatus: "submitted",
    score: 45,
    outOf: 50,
    hasComments: true,
  },
  {
    id: 4,
    title: "Chapter 7: Roaring Twenties Quiz",
    dueDate: "Dec 15, 2025 11:59 PM",
    completionStatus: "submitted",
    score: 38,
    outOf: 40,
    hasComments: false,
  },
  {
    id: 5,
    title: "WWI Impact and Aftermath",
    dueDate: "Dec 8, 2025 11:59 PM",
    completionStatus: "submitted",
    score: 28,
    outOf: 30,
    hasComments: true,
  },
  {
    id: 6,
    title: "Progressive Era Quiz",
    dueDate: "Nov 22, 2025 11:59 PM",
    completionStatus: "submitted",
    score: 47,
    outOf: 50,
    hasComments: false,
  },
  {
    id: 7,
    title: "Industrial Revolution Final Quiz",
    dueDate: "Nov 10, 2025 11:59 PM",
    completionStatus: "submitted",
    score: 85,
    outOf: 100,
    hasComments: true,
  },
];

export default function QuizzesPage() {
  const params = useParams();
  const courseId = params.id as string;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-normal text-gray-900 dark:text-white">Quizzes</h1>
      </div>

      {/* Quizzes Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 px-6 py-2 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Quiz
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
            {QUIZZES_DATA.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500 dark:text-gray-400">
                  No quizzes found
                </td>
              </tr>
            ) : (
              QUIZZES_DATA.map((quiz) => (
                <tr
                  key={quiz.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Quiz Column */}
                  <td className="py-4 px-2">
                    <div className="space-y-1">
                      <Link
                        href={`/courses/${courseId}/quizzes/${quiz.id}`}
                        className="text-[#6E8CB9] hover:underline text-sm"
                      >
                        {quiz.title}
                      </Link>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Due on {quiz.dueDate}
                      </div>
                      {quiz.startDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <span className="underline">Starts {quiz.startDate}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Completion Status Column */}
                  <td className="py-4 px-2 text-center">
                    <CompletionStatusBadge status={quiz.completionStatus} />
                  </td>

                  {/* Score Column */}
                  <td className="py-4 px-2 text-center text-sm text-gray-900 dark:text-white">
                    {quiz.score !== null ? quiz.score : "-"} / {quiz.outOf}
                  </td>

                  {/* Comments Column */}
                  <td className="py-4 px-2 text-center">
                    {quiz.hasComments ? (
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
