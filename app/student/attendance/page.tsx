"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_COURSES } from "@/lib/constants/courses";

type Status = "present" | "absent" | "tardy" | "excused";

const STATUS_CONFIG: Record<
  Status,
  { label: string; icon: typeof CheckCircle2; color: string; bg: string; dot: string }
> = {
  present: {
    label: "Present",
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    dot: "bg-emerald-500",
  },
  absent: {
    label: "Absent",
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    dot: "bg-red-500",
  },
  tardy: {
    label: "Tardy",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    dot: "bg-amber-500",
  },
  excused: {
    label: "Excused",
    icon: AlertTriangle,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    dot: "bg-blue-500",
  },
};

// ─── Weekly grid data (All Courses view) ─────────────────────────────────────

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

interface WeekData {
  label: string;
  dates: Record<string, string>;
  courses: Record<string, Record<string, { status: Status; note?: string } | null>>;
}

const WEEKS: WeekData[] = [
  {
    label: "Jan 5 – Jan 9",
    dates: { Mon: "Jan 5", Tue: "Jan 6", Wed: "Jan 7", Thu: "Jan 8", Fri: "Jan 9" },
    courses: Object.fromEntries(
      MOCK_COURSES.map((c) => [c.id, { Mon: { status: "present" as Status }, Tue: { status: "present" as Status }, Wed: { status: "present" as Status }, Thu: { status: "present" as Status }, Fri: { status: "present" as Status } }])
    ),
  },
  {
    label: "Jan 12 – Jan 16",
    dates: { Mon: "Jan 12", Tue: "Jan 13", Wed: "Jan 14", Thu: "Jan 15", Fri: "Jan 16" },
    courses: Object.fromEntries(
      MOCK_COURSES.map((c, i) => [c.id, { Mon: { status: "present" as Status }, Tue: i === 0 ? { status: "tardy" as Status, note: "Arrived 10 min late" } : { status: "present" as Status }, Wed: { status: "present" as Status }, Thu: { status: "present" as Status }, Fri: { status: "present" as Status } }])
    ),
  },
  {
    label: "Jan 20 – Jan 23",
    dates: { Mon: "—", Tue: "Jan 20", Wed: "Jan 21", Thu: "Jan 22", Fri: "Jan 23" },
    courses: Object.fromEntries(
      MOCK_COURSES.map((c, i) => [c.id, { Mon: null, Tue: { status: "present" as Status }, Wed: i === 2 ? { status: "absent" as Status, note: "Unexcused absence" } : { status: "present" as Status }, Thu: { status: "present" as Status }, Fri: { status: "present" as Status } }])
    ),
  },
  {
    label: "Jan 26 – Jan 30",
    dates: { Mon: "Jan 26", Tue: "Jan 27", Wed: "Jan 28", Thu: "Jan 29", Fri: "Jan 30" },
    courses: Object.fromEntries(
      MOCK_COURSES.map((c, i) => [c.id, { Mon: { status: "present" as Status }, Tue: { status: "present" as Status }, Wed: i === 1 ? { status: "excused" as Status, note: "Doctor's appointment" } : { status: "present" as Status }, Thu: { status: "present" as Status }, Fri: { status: "present" as Status } }])
    ),
  },
  {
    label: "Feb 2 – Feb 6",
    dates: { Mon: "Feb 2", Tue: "Feb 3", Wed: "Feb 4", Thu: "Feb 5", Fri: "Feb 6" },
    courses: Object.fromEntries(
      MOCK_COURSES.map((c, i) => [c.id, { Mon: { status: "present" as Status }, Tue: { status: "present" as Status }, Wed: { status: "present" as Status }, Thu: i === 3 ? { status: "tardy" as Status, note: "Arrived 5 min late" } : { status: "present" as Status }, Fri: { status: "present" as Status } }])
    ),
  },
  {
    label: "Feb 9 – Feb 13",
    dates: { Mon: "Feb 9", Tue: "Feb 10", Wed: "Feb 11", Thu: "Feb 12", Fri: "Feb 13" },
    courses: Object.fromEntries(
      MOCK_COURSES.map((c, i) => [c.id, { Mon: { status: "present" as Status }, Tue: { status: "present" as Status }, Wed: { status: "present" as Status }, Thu: { status: "present" as Status }, Fri: i === 4 ? { status: "absent" as Status, note: "Unexcused absence" } : { status: "present" as Status } }])
    ),
  },
  {
    label: "Feb 17 – Feb 20",
    dates: { Mon: "—", Tue: "Feb 17", Wed: "Feb 18", Thu: "Feb 19", Fri: "Feb 20" },
    courses: Object.fromEntries(
      MOCK_COURSES.map((c) => [c.id, { Mon: null, Tue: { status: "present" as Status }, Wed: { status: "present" as Status }, Thu: { status: "present" as Status }, Fri: { status: "present" as Status } }])
    ),
  },
  {
    label: "Feb 23 – Feb 27",
    dates: { Mon: "Feb 23", Tue: "Feb 24", Wed: "Feb 25", Thu: "Feb 26", Fri: "Feb 27" },
    courses: Object.fromEntries(
      MOCK_COURSES.map((c, i) => [c.id, { Mon: { status: "present" as Status }, Tue: i === 0 ? { status: "excused" as Status, note: "Family emergency" } : { status: "present" as Status }, Wed: { status: "present" as Status }, Thu: { status: "present" as Status }, Fri: { status: "present" as Status } }])
    ),
  },
];

// ─── Monthly calendar data (Single Course view) ─────────────────────────────

interface MonthCalendar {
  label: string;
  year: number;
  month: number;
  daysInMonth: number;
  startDay: number; // 0=Sun
  records: Record<number, { status: Status; note?: string }>;
}

function buildCourseMonths(courseIndex: number): MonthCalendar[] {
  const jan: Record<number, { status: Status; note?: string }> = {};
  const feb: Record<number, { status: Status; note?: string }> = {};

  // Jan school days (weekdays only)
  const janSchoolDays = [5,6,7,8,9,12,13,14,15,16,20,21,22,23,26,27,28,29,30];
  for (const d of janSchoolDays) jan[d] = { status: "present" };

  // Feb school days
  const febSchoolDays = [2,3,4,5,6,9,10,11,12,13,17,18,19,20,23,24,25,26,27];
  for (const d of febSchoolDays) feb[d] = { status: "present" };

  // Per-course exceptions
  if (courseIndex === 0) {
    jan[13] = { status: "tardy", note: "Arrived 10 min late" };
    feb[24] = { status: "excused", note: "Family emergency" };
  }
  if (courseIndex === 1) {
    jan[28] = { status: "excused", note: "Doctor's appointment" };
  }
  if (courseIndex === 2) {
    jan[21] = { status: "absent", note: "Unexcused absence" };
  }
  if (courseIndex === 3) {
    feb[5] = { status: "tardy", note: "Arrived 5 min late" };
  }
  if (courseIndex === 4) {
    feb[13] = { status: "absent", note: "Unexcused absence" };
  }

  return [
    { label: "January 2026", year: 2026, month: 0, daysInMonth: 31, startDay: 4, records: jan },
    { label: "February 2026", year: 2026, month: 1, daysInMonth: 28, startDay: 0, records: feb },
  ];
}

const COURSE_MONTHS: Record<string, MonthCalendar[]> = Object.fromEntries(
  MOCK_COURSES.map((c, i) => [c.id, buildCourseMonths(i)])
);

// ─── Summary helpers ─────────────────────────────────────────────────────────

function getWeeklySummary(weekIndex: number) {
  const week = WEEKS[weekIndex];
  const totals = { present: 0, absent: 0, tardy: 0, excused: 0 };
  for (const courseId of Object.keys(week.courses)) {
    for (const day of DAYS) {
      const cell = week.courses[courseId][day];
      if (cell) totals[cell.status]++;
    }
  }
  return totals;
}

function getMonthlySummary(records: Record<number, { status: Status }>) {
  const totals = { present: 0, absent: 0, tardy: 0, excused: 0 };
  for (const r of Object.values(records)) totals[r.status]++;
  return totals;
}

// ─── Calendar grid component ─────────────────────────────────────────────────

const CAL_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarGrid({ month }: { month: MonthCalendar }) {
  const cells: (number | null)[] = [];
  for (let i = 0; i < month.startDay; i++) cells.push(null);
  for (let d = 1; d <= month.daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        {CAL_DAYS.map((d) => (
          <div
            key={d}
            className="py-3.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar weeks */}
      {weeks.map((row, wi) => (
        <div
          key={wi}
          className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 last:border-0"
        >
          {row.map((day, di) => {
            if (day === null) {
              return <div key={di} className="py-5 px-2" />;
            }

            const record = month.records[day];
            const isWeekend = di === 0 || di === 6;

            if (isWeekend || !record) {
              return (
                <div
                  key={di}
                  className={cn(
                    "py-5 px-2 text-center",
                    isWeekend && "bg-gray-50/50 dark:bg-gray-800/20"
                  )}
                >
                  <span className="text-sm text-gray-300 dark:text-gray-600">{day}</span>
                </div>
              );
            }

            const config = STATUS_CONFIG[record.status];
            const Icon = config.icon;

            return (
              <div
                key={di}
                className="py-3.5 px-2 flex flex-col items-center gap-1.5 group relative"
                title={record.note}
              >
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center justify-center w-10 h-10 rounded-full",
                    config.bg
                  )}
                >
                  <Icon className={cn("w-5 h-5", config.color)} />
                </span>
                {record.note && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {record.note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [weekIndex, setWeekIndex] = useState(WEEKS.length - 1);
  const [monthIndex, setMonthIndex] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  const isAllCourses = selectedCourse === "all";

  const summary = isAllCourses
    ? getWeeklySummary(weekIndex)
    : getMonthlySummary(COURSE_MONTHS[selectedCourse]?.[monthIndex]?.records ?? {});

  const currentMonth = !isAllCourses ? COURSE_MONTHS[selectedCourse]?.[monthIndex] : null;
  const maxMonth = !isAllCourses ? (COURSE_MONTHS[selectedCourse]?.length ?? 1) - 1 : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
        Attendance
      </h1>

      {/* Course filter */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          onClick={() => setSelectedCourse("all")}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
            selectedCourse === "all"
              ? "bg-[#1e3a8a] text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          )}
        >
          All Courses
        </button>
        {MOCK_COURSES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCourse(c.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              selectedCourse === c.id
                ? "text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            style={selectedCourse === c.id ? { backgroundColor: c.color } : undefined}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Navigation — week for all courses, month for single course */}
      {isAllCourses ? (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setWeekIndex((i) => Math.max(0, i - 1))}
            disabled={weekIndex === 0}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {WEEKS[weekIndex].label}
          </h2>
          <button
            onClick={() => setWeekIndex((i) => Math.min(WEEKS.length - 1, i + 1))}
            disabled={weekIndex === WEEKS.length - 1}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
            disabled={monthIndex === 0}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentMonth?.label ?? ""}
          </h2>
          <button
            onClick={() => setMonthIndex((i) => Math.min(maxMonth, i + 1))}
            disabled={monthIndex === maxMonth}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(STATUS_CONFIG) as Status[]).map((status) => {
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          return (
            <div
              key={status}
              className={cn("flex items-center gap-3 rounded-xl px-4 py-3", config.bg)}
            >
              <Icon className={cn("w-5 h-5", config.color)} />
              <div>
                <p className={cn("text-lg font-bold leading-none", config.color)}>
                  {summary[status]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {config.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content — weekly table or monthly calendar */}
      {isAllCourses ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="py-4 px-5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[240px]">
                  Course
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="py-4 px-5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    <div>{day}</div>
                    <div className="font-normal normal-case mt-0.5 text-gray-400 dark:text-gray-500">
                      {WEEKS[weekIndex].dates[day]}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_COURSES.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: course.color }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {course.name}
                      </span>
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const cell = WEEKS[weekIndex].courses[course.id]?.[day];
                    if (!cell) {
                      return (
                        <td key={day} className="py-4 px-5 text-center">
                          <span className="text-gray-300 dark:text-gray-600">—</span>
                        </td>
                      );
                    }
                    const config = STATUS_CONFIG[cell.status];
                    const Icon = config.icon;
                    return (
                      <td key={day} className="py-4 px-5 text-center" title={cell.note}>
                        <div className="flex justify-center">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center w-10 h-10 rounded-full",
                              config.bg
                            )}
                          >
                            <Icon className={cn("w-5 h-5", config.color)} />
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        currentMonth && <CalendarGrid month={currentMonth} />
      )}
    </div>
  );
}
