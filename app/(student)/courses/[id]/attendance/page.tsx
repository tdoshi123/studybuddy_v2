"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "present" | "absent" | "tardy" | "excused";

interface AttendanceRecord {
  date: string;
  day: string;
  status: Status;
  note?: string;
}

const STATUS_CONFIG: Record<Status, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  present:  { label: "Present",  icon: CheckCircle2,   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  absent:   { label: "Absent",   icon: XCircle,        color: "text-red-600 dark:text-red-400",         bg: "bg-red-50 dark:bg-red-950/30" },
  tardy:    { label: "Tardy",    icon: Clock,          color: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-950/30" },
  excused:  { label: "Excused",  icon: AlertTriangle,  color: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-50 dark:bg-blue-950/30" },
};

const MONTHS = [
  {
    label: "January 2026",
    records: [
      { date: "Jan 5",  day: "Mon", status: "present" as Status },
      { date: "Jan 6",  day: "Tue", status: "present" as Status },
      { date: "Jan 7",  day: "Wed", status: "present" as Status },
      { date: "Jan 8",  day: "Thu", status: "present" as Status },
      { date: "Jan 9",  day: "Fri", status: "present" as Status },
      { date: "Jan 12", day: "Mon", status: "present" as Status },
      { date: "Jan 13", day: "Tue", status: "tardy"   as Status, note: "Arrived 10 min late" },
      { date: "Jan 14", day: "Wed", status: "present" as Status },
      { date: "Jan 15", day: "Thu", status: "present" as Status },
      { date: "Jan 16", day: "Fri", status: "present" as Status },
      { date: "Jan 20", day: "Tue", status: "present" as Status },
      { date: "Jan 21", day: "Wed", status: "absent"  as Status, note: "Unexcused absence" },
      { date: "Jan 22", day: "Thu", status: "present" as Status },
      { date: "Jan 23", day: "Fri", status: "present" as Status },
      { date: "Jan 26", day: "Mon", status: "present" as Status },
      { date: "Jan 27", day: "Tue", status: "present" as Status },
      { date: "Jan 28", day: "Wed", status: "excused" as Status, note: "Doctor's appointment" },
      { date: "Jan 29", day: "Thu", status: "present" as Status },
      { date: "Jan 30", day: "Fri", status: "present" as Status },
    ],
  },
  {
    label: "February 2026",
    records: [
      { date: "Feb 2",  day: "Mon", status: "present" as Status },
      { date: "Feb 3",  day: "Tue", status: "present" as Status },
      { date: "Feb 4",  day: "Wed", status: "present" as Status },
      { date: "Feb 5",  day: "Thu", status: "tardy"   as Status, note: "Arrived 5 min late" },
      { date: "Feb 6",  day: "Fri", status: "present" as Status },
      { date: "Feb 9",  day: "Mon", status: "present" as Status },
      { date: "Feb 10", day: "Tue", status: "present" as Status },
      { date: "Feb 11", day: "Wed", status: "present" as Status },
      { date: "Feb 12", day: "Thu", status: "present" as Status },
      { date: "Feb 13", day: "Fri", status: "absent"  as Status, note: "Unexcused absence" },
      { date: "Feb 17", day: "Tue", status: "present" as Status },
      { date: "Feb 18", day: "Wed", status: "present" as Status },
      { date: "Feb 19", day: "Thu", status: "present" as Status },
      { date: "Feb 20", day: "Fri", status: "present" as Status },
      { date: "Feb 23", day: "Mon", status: "present" as Status },
      { date: "Feb 24", day: "Tue", status: "excused" as Status, note: "Family emergency" },
      { date: "Feb 25", day: "Wed", status: "present" as Status },
      { date: "Feb 26", day: "Thu", status: "present" as Status },
      { date: "Feb 27", day: "Fri", status: "present" as Status },
    ],
  },
];

function getSummary(records: AttendanceRecord[]) {
  const totals = { present: 0, absent: 0, tardy: 0, excused: 0 };
  records.forEach((r) => totals[r.status]++);
  return totals;
}

export default function AttendancePage() {
  const [monthIndex, setMonthIndex] = useState(MONTHS.length - 1);
  const currentMonth = MONTHS[monthIndex];

  const monthly = getSummary(currentMonth.records);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-normal text-gray-900 dark:text-white">Attendance</h1>

      {/* Month Navigation */}
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
          {currentMonth.label}
        </h2>
        <button
          onClick={() => setMonthIndex((i) => Math.min(MONTHS.length - 1, i + 1))}
          disabled={monthIndex === MONTHS.length - 1}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Monthly Stats Bar */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {(Object.keys(STATUS_CONFIG) as Status[]).map((status) => {
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;
          return (
            <span key={status} className="flex items-center gap-1.5">
              <Icon className={cn("w-3.5 h-3.5", config.color)} />
              {config.label}: <span className="font-semibold text-gray-700 dark:text-gray-300">{monthly[status]}</span>
            </span>
          );
        })}
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Day</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note</th>
            </tr>
          </thead>
          <tbody>
            {currentMonth.records.map((record, i) => {
              const config = STATUS_CONFIG[record.status];
              const Icon = config.icon;
              return (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                    {record.date}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {record.day}
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                      config.bg, config.color
                    )}>
                      <Icon className="w-3.5 h-3.5" />
                      {config.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {record.note || "—"}
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
