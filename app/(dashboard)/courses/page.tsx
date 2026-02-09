import Link from "next/link";
import { Clock, Users, ChevronRight } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 dark:text-white">
          All Courses
        </h1>
        <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          View all your enrolled classes
        </p>
      </div>

      {/* Courses List */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
        {MOCK_COURSES.map((course) => (
          <CourseRow key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

interface Course {
  id: string;
  name: string;
  teacher: string;
  room: string;
  period: string;
  students: number;
  color: string;
}

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    name: "Math - Period 3",
    teacher: "Mrs. Johnson",
    room: "Room 204",
    period: "Period 3 • 10:00 - 10:50 AM",
    students: 28,
    color: "#6E8CB9",
  },
  {
    id: "2",
    name: "English Language Arts",
    teacher: "Mr. Thompson",
    room: "Room 112",
    period: "Period 1 • 8:00 - 8:50 AM",
    students: 26,
    color: "#4A7C59",
  },
  {
    id: "3",
    name: "Science - Period 4",
    teacher: "Ms. Garcia",
    room: "Room 301 (Lab)",
    period: "Period 4 • 11:00 - 11:50 AM",
    students: 24,
    color: "#8B5A2B",
  },
  {
    id: "4",
    name: "Social Studies",
    teacher: "Mr. Williams",
    room: "Room 215",
    period: "Period 5 • 12:30 - 1:20 PM",
    students: 30,
    color: "#6B4C9A",
  },
  {
    id: "5",
    name: "Art",
    teacher: "Mrs. Davis",
    room: "Art Studio",
    period: "Period 6 • 1:30 - 2:20 PM",
    students: 22,
    color: "#C4564A",
  },
  {
    id: "6",
    name: "Physical Education",
    teacher: "Coach Martinez",
    room: "Gymnasium",
    period: "Period 7 • 2:30 - 3:20 PM",
    students: 32,
    color: "#2E8B8B",
  },
];

function CourseRow({ course }: { course: Course }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      {/* Color indicator */}
      <div
        className="w-1 h-14 rounded-full flex-shrink-0"
        style={{ backgroundColor: course.color }}
      />

      {/* Course info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 dark:text-white">
          {course.name}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {course.teacher}
        </p>
        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{course.period}</span>
          </div>
          <span>•</span>
          <span>{course.room}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{course.students} students</span>
          </div>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </Link>
  );
}
