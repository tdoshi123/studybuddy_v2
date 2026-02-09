// Mock course data - in real app would fetch from database
export const COURSES: Record<string, { name: string; teacher: string; room: string; period: string; color: string }> = {
  "1": { name: "Math - Period 3", teacher: "Mrs. Johnson", room: "Room 204", period: "Period 3 • 10:00 - 10:50 AM", color: "#6E8CB9" },
  "2": { name: "English Language Arts", teacher: "Mr. Thompson", room: "Room 112", period: "Period 1 • 8:00 - 8:50 AM", color: "#4A7C59" },
  "3": { name: "Science - Period 4", teacher: "Ms. Garcia", room: "Room 301 (Lab)", period: "Period 4 • 11:00 - 11:50 AM", color: "#8B5A2B" },
  "4": { name: "Social Studies", teacher: "Mr. Williams", room: "Room 215", period: "Period 5 • 12:30 - 1:20 PM", color: "#6B4C9A" },
  "5": { name: "Art", teacher: "Mrs. Davis", room: "Art Studio", period: "Period 6 • 1:30 - 2:20 PM", color: "#C4564A" },
  "6": { name: "Physical Education", teacher: "Coach Martinez", room: "Gymnasium", period: "Period 7 • 2:30 - 3:20 PM", color: "#2E8B8B" },
};

// Array format for dropdowns
export const MOCK_COURSES = Object.entries(COURSES).map(([id, course]) => ({
  id,
  ...course,
}));

export function getCourse(id: string) {
  return COURSES[id] || COURSES["1"];
}

