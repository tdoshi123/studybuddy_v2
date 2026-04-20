"use client";

import { Calendar } from "lucide-react";

interface ScheduleClass {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  color: string;
}

const COLORS = {
  ela: "#4A7C59",
  math: "#1e3a8a",
  science: "#8B5A2B",
  socialStudies: "#6B4C9A",
  art: "#C4564A",
  pe: "#2E8B8B",
  music: "#D97706",
};

type DayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

const ALEX_SCHEDULE: Record<DayName, ScheduleClass[]> = {
  Monday: [
    { id: "a-m1", title: "English Language Arts", startTime: "08:00", endTime: "08:50", color: COLORS.ela },
    { id: "a-m2", title: "Math", startTime: "10:00", endTime: "10:50", color: COLORS.math },
    { id: "a-m3", title: "Science", startTime: "11:00", endTime: "11:50", color: COLORS.science },
  ],
  Tuesday: [
    { id: "a-t1", title: "English Language Arts", startTime: "08:00", endTime: "08:50", color: COLORS.ela },
    { id: "a-t2", title: "Math", startTime: "10:00", endTime: "10:50", color: COLORS.math },
    { id: "a-t3", title: "Science", startTime: "11:00", endTime: "11:50", color: COLORS.science },
    { id: "a-t4", title: "Social Studies", startTime: "12:30", endTime: "13:20", color: COLORS.socialStudies },
  ],
  Wednesday: [
    { id: "a-w1", title: "Math", startTime: "10:00", endTime: "10:50", color: COLORS.math },
    { id: "a-w2", title: "Art", startTime: "13:30", endTime: "14:20", color: COLORS.art },
  ],
  Thursday: [
    { id: "a-h1", title: "English Language Arts", startTime: "08:00", endTime: "08:50", color: COLORS.ela },
    { id: "a-h2", title: "Science", startTime: "11:00", endTime: "11:50", color: COLORS.science },
    { id: "a-h3", title: "Physical Education", startTime: "14:30", endTime: "15:20", color: COLORS.pe },
  ],
  Friday: [
    { id: "a-f1", title: "English Language Arts", startTime: "08:00", endTime: "08:50", color: COLORS.ela },
    { id: "a-f2", title: "Math", startTime: "10:00", endTime: "10:50", color: COLORS.math },
    { id: "a-f3", title: "Social Studies", startTime: "12:30", endTime: "13:20", color: COLORS.socialStudies },
  ],
};

const EMMA_SCHEDULE: Record<DayName, ScheduleClass[]> = {
  Monday: [
    { id: "e-m1", title: "Reading & Writing", startTime: "08:15", endTime: "09:15", color: COLORS.ela },
    { id: "e-m2", title: "Math", startTime: "09:30", endTime: "10:30", color: COLORS.math },
    { id: "e-m3", title: "Science", startTime: "11:00", endTime: "11:45", color: COLORS.science },
  ],
  Tuesday: [
    { id: "e-t1", title: "Reading & Writing", startTime: "08:15", endTime: "09:15", color: COLORS.ela },
    { id: "e-t2", title: "Math", startTime: "09:30", endTime: "10:30", color: COLORS.math },
    { id: "e-t3", title: "Music", startTime: "13:00", endTime: "13:45", color: COLORS.music },
  ],
  Wednesday: [
    { id: "e-w1", title: "Reading & Writing", startTime: "08:15", endTime: "09:15", color: COLORS.ela },
    { id: "e-w2", title: "Math", startTime: "09:30", endTime: "10:30", color: COLORS.math },
    { id: "e-w3", title: "Art", startTime: "13:00", endTime: "13:45", color: COLORS.art },
  ],
  Thursday: [
    { id: "e-h1", title: "Reading & Writing", startTime: "08:15", endTime: "09:15", color: COLORS.ela },
    { id: "e-h2", title: "Math", startTime: "09:30", endTime: "10:30", color: COLORS.math },
    { id: "e-h3", title: "Physical Education", startTime: "13:00", endTime: "13:45", color: COLORS.pe },
  ],
  Friday: [
    { id: "e-f1", title: "Reading & Writing", startTime: "08:15", endTime: "09:15", color: COLORS.ela },
    { id: "e-f2", title: "Math", startTime: "09:30", endTime: "10:30", color: COLORS.math },
    { id: "e-f3", title: "Social Studies", startTime: "11:00", endTime: "11:45", color: COLORS.socialStudies },
  ],
};

const STUDENT_SCHEDULES: Record<string, Record<DayName, ScheduleClass[]>> = {
  "1": ALEX_SCHEDULE,
  "2": EMMA_SCHEDULE,
};

const DAYS: DayName[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const hourNum = parseInt(hour);
  const ampm = hourNum >= 12 ? "PM" : "AM";
  const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
  return `${displayHour}:${minute} ${ampm}`;
};

export default function StudentSchedulePage() {
  const schedule = STUDENT_SCHEDULES["1"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-cyan-50 dark:bg-cyan-950/40">
          <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Schedule</h1>
      </div>

      {/* Schedule grid */}
      <div className="grid grid-cols-5 gap-5">
        {DAYS.map((day) => {
          const classes = schedule[day];
          return (
            <div key={day} className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-wide">{day}</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800 flex-1">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-start gap-3.5 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                  >
                    <span className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: cls.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#1e3a8a] transition-colors leading-snug">
                        {cls.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                        {formatTime(cls.startTime)} – {formatTime(cls.endTime)}
                      </p>
                    </div>
                  </div>
                ))}
                {classes.length === 0 && (
                  <div className="px-5 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No classes</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
