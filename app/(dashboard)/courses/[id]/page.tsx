import { FileText, MessageSquare, Users, Calendar, ClipboardList, BookOpen } from "lucide-react";

// Mock course data - in real app would fetch based on ID
const COURSES: Record<string, { name: string; teacher: string; room: string; period: string; color: string }> = {
  "1": { name: "Math - Period 3", teacher: "Mrs. Johnson", room: "Room 204", period: "Period 3 • 10:00 - 10:50 AM", color: "#6E8CB9" },
  "2": { name: "English Language Arts", teacher: "Mr. Thompson", room: "Room 112", period: "Period 1 • 8:00 - 8:50 AM", color: "#4A7C59" },
  "3": { name: "Science - Period 4", teacher: "Ms. Garcia", room: "Room 301 (Lab)", period: "Period 4 • 11:00 - 11:50 AM", color: "#8B5A2B" },
  "4": { name: "Social Studies", teacher: "Mr. Williams", room: "Room 215", period: "Period 5 • 12:30 - 1:20 PM", color: "#6B4C9A" },
  "5": { name: "Art", teacher: "Mrs. Davis", room: "Art Studio", period: "Period 6 • 1:30 - 2:20 PM", color: "#C4564A" },
  "6": { name: "Physical Education", teacher: "Coach Martinez", room: "Gymnasium", period: "Period 7 • 2:30 - 3:20 PM", color: "#2E8B8B" },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CoursePage({ params }: PageProps) {
  const { id } = await params;
  const course = COURSES[id] || COURSES["1"];

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div
        className="rounded-xl p-6 text-white"
        style={{ backgroundColor: course.color }}
      >
        <h1 className="text-2xl font-semibold">{course.name}</h1>
        <p className="mt-1 text-white/80">{course.teacher}</p>
        <div className="mt-2 flex items-center gap-4 text-sm text-white/70">
          <span>{course.period}</span>
          <span>•</span>
          <span>{course.room}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <QuickAction icon={MessageSquare} label="Announcements" count={2} />
        <QuickAction icon={FileText} label="Assignments" count={3} />
        <QuickAction icon={ClipboardList} label="Quizzes" count={1} />
        <QuickAction icon={BookOpen} label="Materials" />
        <QuickAction icon={Users} label="Classmates" />
        <QuickAction icon={Calendar} label="Schedule" />
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Announcements */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Announcements</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <AnnouncementItem
              title="Class Field Trip Permission Slip"
              date="Jan 18, 2026"
              preview="Please return the signed permission slip by Friday for our upcoming trip to the Science Museum."
            />
            <AnnouncementItem
              title="Study Guide Posted"
              date="Jan 15, 2026"
              preview="The study guide for next week's quiz has been posted under Materials."
            />
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white">Upcoming Work</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <AssignmentItem
              title="Worksheet: Chapter 5 Review"
              dueDate="Jan 20, 3:00 PM"
              type="assignment"
              points={20}
            />
            <AssignmentItem
              title="Quiz: Unit 3"
              dueDate="Jan 22, 10:00 AM"
              type="quiz"
              points={25}
            />
            <AssignmentItem
              title="Project: Research Report"
              dueDate="Jan 28, 3:00 PM"
              type="assignment"
              points={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ElementType;
  label: string;
  count?: number;
}) {
  return (
    <button className="relative flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      {count && (
        <span className="absolute top-2 right-2 w-5 h-5 bg-[#6E8CB9] text-white text-xs font-medium rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function AnnouncementItem({
  title,
  date,
  preview,
}: {
  title: string;
  date: string;
  preview: string;
}) {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <span className="text-xs text-gray-400 flex-shrink-0">{date}</span>
      </div>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {preview}
      </p>
    </div>
  );
}

function AssignmentItem({
  title,
  dueDate,
  type,
  points,
}: {
  title: string;
  dueDate: string;
  type: "assignment" | "quiz";
  points: number;
}) {
  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
            type === "quiz"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          {type === "quiz" ? "Quiz" : "Assignment"}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        <span>Due: {dueDate}</span>
        <span>•</span>
        <span>{points} pts</span>
      </div>
    </div>
  );
}

