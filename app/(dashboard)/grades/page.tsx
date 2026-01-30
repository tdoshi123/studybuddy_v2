import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function GradesPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Grades
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your academic performance across all courses.
        </p>
      </div>

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Current GPA
          </p>
          <p className="mt-2 text-4xl font-bold text-[#6E8CB9]">3.75</p>
          <div className="mt-2 flex items-center gap-1 text-emerald-500">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+0.15 from last semester</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Credits Completed
          </p>
          <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">
            68
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            of 120 required
          </p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Dean&apos;s List
          </p>
          <p className="mt-2 text-4xl font-bold text-emerald-500">Yes</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            3 consecutive semesters
          </p>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Current Semester Grades
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {MOCK_GRADES.map((grade) => (
                <tr key={grade.course} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {grade.course}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {grade.code}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {grade.credits}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getGradeColor(
                        grade.grade
                      )}`}
                    >
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {grade.points.toFixed(1)}
                  </td>
                  <td className="px-6 py-4">
                    <TrendIndicator trend={grade.trend} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface Grade {
  course: string;
  code: string;
  credits: number;
  grade: string;
  points: number;
  trend: "up" | "down" | "stable";
}

const MOCK_GRADES: Grade[] = [
  { course: "Introduction to Computer Science", code: "CS101", credits: 4, grade: "A", points: 4.0, trend: "up" },
  { course: "Calculus II", code: "MATH201", credits: 4, grade: "B+", points: 3.3, trend: "stable" },
  { course: "Data Structures", code: "CS201", credits: 3, grade: "A-", points: 3.7, trend: "up" },
  { course: "Physics I", code: "PHY101", credits: 4, grade: "B", points: 3.0, trend: "down" },
  { course: "English Composition", code: "ENG101", credits: 3, grade: "A", points: 4.0, trend: "up" },
  { course: "Introduction to Psychology", code: "PSY101", credits: 3, grade: "A-", points: 3.7, trend: "stable" },
];

function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  if (grade.startsWith("C")) return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
}

function TrendIndicator({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return <TrendingUp className="w-5 h-5 text-emerald-500" />;
  }
  if (trend === "down") {
    return <TrendingDown className="w-5 h-5 text-red-500" />;
  }
  return <Minus className="w-5 h-5 text-gray-400" />;
}

