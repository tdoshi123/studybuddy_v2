// Course Home Page - shows recent announcements and upcoming work

export default function CourseHomePage() {
  return (
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
