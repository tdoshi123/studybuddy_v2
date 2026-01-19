import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            View your schedule and upcoming events.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Calendar View */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            January 2026
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="px-3 py-1 text-sm font-medium text-[#6E8CB9] hover:bg-[#6E8CB9]/10 rounded-lg transition-colors">
              Today
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => (
              <CalendarDay key={index} day={day} />
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Upcoming Events
        </h2>
        <div className="space-y-3">
          {MOCK_EVENTS.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div
                className="w-1 h-12 rounded-full"
                style={{ backgroundColor: event.color }}
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {event.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {event.time} • {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface CalendarDayData {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvent: boolean;
}

function generateCalendarDays(): CalendarDayData[] {
  const days: CalendarDayData[] = [];
  
  // Previous month days (assuming January 2026 starts on Thursday)
  for (let i = 0; i < 4; i++) {
    days.push({ date: 28 + i, isCurrentMonth: false, isToday: false, hasEvent: false });
  }
  
  // Current month days
  for (let i = 1; i <= 31; i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: i === 19, // Today is January 19
      hasEvent: [5, 12, 19, 22, 28].includes(i),
    });
  }
  
  // Next month days
  for (let i = 1; i <= 7; i++) {
    days.push({ date: i, isCurrentMonth: false, isToday: false, hasEvent: false });
  }
  
  return days.slice(0, 35);
}

function CalendarDay({ day }: { day: CalendarDayData }) {
  return (
    <div
      className={`relative h-12 flex items-center justify-center rounded-lg transition-colors ${
        day.isCurrentMonth
          ? "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          : "text-gray-300 dark:text-gray-700"
      } ${day.isToday ? "bg-[#6E8CB9] text-white hover:bg-[#5F7AA3]" : ""}`}
    >
      <span className={day.isToday ? "font-semibold" : ""}>{day.date}</span>
      {day.hasEvent && !day.isToday && (
        <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#6E8CB9]" />
      )}
    </div>
  );
}

interface Event {
  id: string;
  title: string;
  time: string;
  location: string;
  color: string;
}

const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "CS101 Lecture",
    time: "10:00 AM - 11:30 AM",
    location: "Room 204",
    color: "#6E8CB9",
  },
  {
    id: "2",
    title: "Study Group Meeting",
    time: "3:00 PM - 5:00 PM",
    location: "Library Room B",
    color: "#10b981",
  },
  {
    id: "3",
    title: "Assignment Due: Data Structures",
    time: "11:59 PM",
    location: "Online Submission",
    color: "#f59e0b",
  },
];

