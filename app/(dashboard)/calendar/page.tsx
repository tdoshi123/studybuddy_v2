"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Download, Filter } from "lucide-react";
import Link from "next/link";

type ViewType = "month" | "week" | "day" | "agenda";

interface CalendarEvent {
  id: string;
  title: string;
  date: number;
  startTime?: string; // Format: "HH:MM" (24-hour)
  endTime?: string;
  type: "class" | "assignment" | "quiz" | "test" | "project" | "event";
  color: string;
  textColor: string;
  bgColor: string;
  courseId?: string;
  assignmentId?: string;
}

// Event color schemes
const EVENT_COLORS = {
  math: { color: "#6E8CB9", textColor: "#4A5F82", bgColor: "#dae4f2" },
  ela: { color: "#4A7C59", textColor: "#2d5038", bgColor: "#d4e8dc" },
  science: { color: "#8B5A2B", textColor: "#5d3d1d", bgColor: "#e8ddd0" },
  socialStudies: { color: "#6B4C9A", textColor: "#483369", bgColor: "#e3daf0" },
  art: { color: "#C4564A", textColor: "#8a3c32", bgColor: "#f3dcd9" },
  pe: { color: "#2E8B8B", textColor: "#1d5959", bgColor: "#d0e8e8" },
  assignment: { color: "#ec4899", textColor: "#be185d", bgColor: "#fce7f3" },
  quiz: { color: "#ef4444", textColor: "#b91c1c", bgColor: "#fee2e2" },
  test: { color: "#f59e0b", textColor: "#b45309", bgColor: "#fef3c7" },
  project: { color: "#22c55e", textColor: "#15803d", bgColor: "#dcfce7" },
};

// February 2026 events
const FEBRUARY_EVENTS: CalendarEvent[] = [
  // Monday events (2, 9, 16, 23) - Classes with times
  { id: "1", title: "English Language Arts", date: 2, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "2", title: "Math - Period 3", date: 2, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "3", title: "Science - Period 4", date: 2, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "3a", title: "Science: Hypothesis Worksheet", date: 2, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "3", assignmentId: "3a", ...EVENT_COLORS.science },
  { id: "4", title: "English Language Arts", date: 9, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "5", title: "Math - Period 3", date: 9, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "6", title: "Science - Period 4", date: 9, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "6a", title: "ELA: Sentence Structure HW", date: 9, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "2", assignmentId: "6a", ...EVENT_COLORS.ela },
  { id: "7", title: "English Language Arts", date: 16, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "8", title: "Math - Period 3", date: 16, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "9", title: "Math: Chapter 5 Test", date: 16, startTime: "10:00", endTime: "10:50", type: "test", courseId: "1", assignmentId: "9", ...EVENT_COLORS.math },
  { id: "10", title: "Science - Period 4", date: 16, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "10a", title: "Science: Study for Test", date: 16, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "3", assignmentId: "10a", ...EVENT_COLORS.science },
  { id: "11", title: "English Language Arts", date: 23, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "12", title: "Math - Period 3", date: 23, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "13", title: "Science - Period 4", date: 23, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "13a", title: "Math: Decimal Practice", date: 23, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "1", assignmentId: "13a", ...EVENT_COLORS.math },

  // Tuesday events (3, 10, 17, 24) - Feb 3 has many items
  { id: "13b", title: "English Language Arts", date: 3, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "13c", title: "Math - Period 3", date: 3, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "14", title: "Science - Period 4", date: 3, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "15", title: "Social Studies", date: 3, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "16", title: "Math: Fractions Worksheet", date: 3, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "1", assignmentId: "16", ...EVENT_COLORS.math },
  { id: "16a", title: "Science: Observation Journal", date: 3, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "3", assignmentId: "16a", ...EVENT_COLORS.science },
  { id: "16b", title: "ELA: Reading Log Due", date: 3, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "2", assignmentId: "16b", ...EVENT_COLORS.ela },
  { id: "17", title: "Science - Period 4", date: 10, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "17b", title: "English Language Arts", date: 10, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "17c", title: "Math - Period 3", date: 10, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "18", title: "Social Studies", date: 10, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "19", title: "ELA: Spelling Quiz Unit 5", date: 10, startTime: "08:00", endTime: "08:50", type: "quiz", courseId: "2", assignmentId: "19", ...EVENT_COLORS.ela },
  { id: "19a", title: "Social Studies: Timeline HW", date: 10, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "4", assignmentId: "19a", ...EVENT_COLORS.socialStudies },
  { id: "19b", title: "Math: Test Corrections", date: 10, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "1", assignmentId: "19b", ...EVENT_COLORS.math },
  { id: "19c", title: "Science: Experiment Write-up", date: 10, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "3", assignmentId: "19c", ...EVENT_COLORS.science },
  { id: "19d", title: "Art: Color Theory Project", date: 10, startTime: "15:00", endTime: "15:00", type: "project", courseId: "5", assignmentId: "19d", ...EVENT_COLORS.art },
  { id: "20", title: "Science - Period 4", date: 17, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "21", title: "Social Studies", date: 17, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "21a", title: "Science: Lab Report", date: 17, startTime: "11:00", endTime: "11:50", type: "assignment", courseId: "3", assignmentId: "21a", ...EVENT_COLORS.science },
  { id: "22", title: "Science - Period 4", date: 24, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "23", title: "Social Studies", date: 24, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "23a", title: "Math: Word Problems", date: 24, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "1", assignmentId: "23a", ...EVENT_COLORS.math },

  // Wednesday events (4, 11, 18, 25)
  { id: "24", title: "Math - Period 3", date: 4, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "25", title: "Art", date: 4, startTime: "13:30", endTime: "14:20", type: "class", courseId: "5", ...EVENT_COLORS.art },
  { id: "26", title: "Math: Multiplication Quiz", date: 4, startTime: "10:00", endTime: "10:50", type: "quiz", courseId: "1", assignmentId: "26", ...EVENT_COLORS.math },
  { id: "26a", title: "Art: Color Wheel Worksheet", date: 4, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "5", assignmentId: "26a", ...EVENT_COLORS.art },
  { id: "27", title: "Math - Period 3", date: 11, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "28", title: "Art", date: 11, startTime: "13:30", endTime: "14:20", type: "class", courseId: "5", ...EVENT_COLORS.art },
  { id: "29", title: "Science: Solar System Project", date: 11, startTime: "15:00", endTime: "15:00", type: "project", courseId: "3", assignmentId: "29", ...EVENT_COLORS.science },
  { id: "29a", title: "Math: Geometry Practice Due", date: 11, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "1", assignmentId: "29a", ...EVENT_COLORS.math },
  { id: "30", title: "Math - Period 3", date: 18, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "30b", title: "English Language Arts", date: 18, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "30c", title: "Science - Period 4", date: 18, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "30d", title: "Social Studies", date: 18, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "31", title: "Art", date: 18, startTime: "13:30", endTime: "14:20", type: "class", courseId: "5", ...EVENT_COLORS.art },
  { id: "31a", title: "Social Studies: Map Quiz", date: 18, startTime: "12:30", endTime: "13:20", type: "quiz", courseId: "4", assignmentId: "31a", ...EVENT_COLORS.socialStudies },
  { id: "31b", title: "Math: Chapter 7 Test", date: 18, startTime: "10:00", endTime: "10:50", type: "test", courseId: "1", assignmentId: "31b", ...EVENT_COLORS.math },
  { id: "31c", title: "ELA: Book Review Due", date: 18, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "2", assignmentId: "31c", ...EVENT_COLORS.ela },
  { id: "31d", title: "Science: Periodic Table Quiz", date: 18, startTime: "11:00", endTime: "11:50", type: "quiz", courseId: "3", assignmentId: "31d", ...EVENT_COLORS.science },
  { id: "32", title: "Math - Period 3", date: 25, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "33", title: "Art", date: 25, startTime: "13:30", endTime: "14:20", type: "class", courseId: "5", ...EVENT_COLORS.art },

  // Thursday events (5, 12, 19, 26) - Feb 5 has lots of items to test "+X more"
  { id: "34", title: "English Language Arts", date: 5, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "34b", title: "Math - Period 3", date: 5, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "34c", title: "Science - Period 4", date: 5, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "34d", title: "Social Studies", date: 5, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "35", title: "Physical Education", date: 5, startTime: "14:30", endTime: "15:20", type: "class", courseId: "6", ...EVENT_COLORS.pe },
  { id: "36", title: "Social Studies: Chapter 8 Questions", date: 5, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "4", assignmentId: "36", ...EVENT_COLORS.socialStudies },
  { id: "36a", title: "ELA: Vocabulary Worksheet", date: 5, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "2", assignmentId: "36a", ...EVENT_COLORS.ela },
  { id: "36b", title: "Math: Fractions Quiz", date: 5, startTime: "10:00", endTime: "10:50", type: "quiz", courseId: "1", assignmentId: "36b", ...EVENT_COLORS.math },
  { id: "36c", title: "Science: Lab Report Due", date: 5, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "3", assignmentId: "36c", ...EVENT_COLORS.science },
  { id: "37", title: "English Language Arts", date: 12, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "38", title: "Physical Education", date: 12, startTime: "14:30", endTime: "15:20", type: "class", courseId: "6", ...EVENT_COLORS.pe },
  { id: "38a", title: "PE: Fitness Log Due", date: 12, startTime: "14:30", endTime: "15:20", type: "assignment", courseId: "6", assignmentId: "38a", ...EVENT_COLORS.pe },
  { id: "39", title: "English Language Arts", date: 19, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "40", title: "Physical Education", date: 19, startTime: "14:30", endTime: "15:20", type: "class", courseId: "6", ...EVENT_COLORS.pe },
  { id: "40a", title: "ELA: Reading Comprehension", date: 19, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "2", assignmentId: "40a", ...EVENT_COLORS.ela },
  { id: "41", title: "English Language Arts", date: 26, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "42", title: "Physical Education", date: 26, startTime: "14:30", endTime: "15:20", type: "class", courseId: "6", ...EVENT_COLORS.pe },
  { id: "42a", title: "Science: Ecosystem Worksheet", date: 26, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "3", assignmentId: "42a", ...EVENT_COLORS.science },

  // Friday events (6, 13, 20, 27)
  { id: "43", title: "Math - Period 3", date: 6, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "44", title: "Social Studies", date: 6, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "45", title: "ELA: Personal Narrative Due", date: 6, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "2", assignmentId: "45", ...EVENT_COLORS.ela },
  { id: "45a", title: "Math: Practice Problems", date: 6, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "1", assignmentId: "45a", ...EVENT_COLORS.math },
  { id: "46", title: "Math - Period 3", date: 13, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "46b", title: "English Language Arts", date: 13, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "46c", title: "Science - Period 4", date: 13, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "47", title: "Social Studies", date: 13, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "48", title: "Science: Ecosystem Test", date: 13, startTime: "11:00", endTime: "11:50", type: "test", courseId: "3", assignmentId: "48", ...EVENT_COLORS.science },
  { id: "48a", title: "Art: Self Portrait Project", date: 13, startTime: "15:00", endTime: "15:00", type: "project", courseId: "5", assignmentId: "48a", ...EVENT_COLORS.art },
  { id: "48b", title: "ELA: Essay Rough Draft Due", date: 13, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "2", assignmentId: "48b", ...EVENT_COLORS.ela },
  { id: "48c", title: "Math: Geometry Problems", date: 13, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "1", assignmentId: "48c", ...EVENT_COLORS.math },
  { id: "48d", title: "Social Studies: Current Events", date: 13, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "4", assignmentId: "48d", ...EVENT_COLORS.socialStudies },
  { id: "49", title: "Math - Period 3", date: 20, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "49b", title: "English Language Arts", date: 20, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "49c", title: "Science - Period 4", date: 20, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
  { id: "50", title: "Social Studies", date: 20, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "50a", title: "Science: Plant Life Diagram", date: 20, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "3", assignmentId: "50a", ...EVENT_COLORS.science },
  { id: "50b", title: "ELA: Poetry Analysis", date: 20, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "2", assignmentId: "50b", ...EVENT_COLORS.ela },
  { id: "50c", title: "Math: Probability Worksheet", date: 20, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "1", assignmentId: "50c", ...EVENT_COLORS.math },
  { id: "50d", title: "Social Studies: Biography Project", date: 20, startTime: "15:00", endTime: "15:00", type: "project", courseId: "4", assignmentId: "50d", ...EVENT_COLORS.socialStudies },
  { id: "50e", title: "Art: Painting Due", date: 20, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "5", assignmentId: "50e", ...EVENT_COLORS.art },
  { id: "51", title: "Math - Period 3", date: 27, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "52", title: "Social Studies", date: 27, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "52a", title: "Math: Chapter 6 Review", date: 27, startTime: "15:00", endTime: "15:00", type: "assignment", courseId: "1", assignmentId: "52a", ...EVENT_COLORS.math },

  // Saturday events (7, 14, 21, 28)
  { id: "53", title: "ELA: Book Report Charlotte's Web", date: 7, startTime: "12:00", endTime: "12:00", type: "assignment", courseId: "2", assignmentId: "53", ...EVENT_COLORS.ela },
  { id: "53a", title: "Social Studies: Research Assignment", date: 14, startTime: "12:00", endTime: "12:00", type: "assignment", courseId: "4", assignmentId: "53a", ...EVENT_COLORS.socialStudies },
  { id: "53b", title: "Math: Extra Credit Problems", date: 21, startTime: "12:00", endTime: "12:00", type: "assignment", courseId: "1", assignmentId: "53b", ...EVENT_COLORS.math },

  // Sunday events (1, 8, 15, 22)
  { id: "54", title: "Social Studies: States & Capitals", date: 8, startTime: "10:00", endTime: "10:00", type: "quiz", courseId: "4", assignmentId: "54", ...EVENT_COLORS.socialStudies },
  { id: "54a", title: "ELA: Grammar Practice", date: 15, startTime: "10:00", endTime: "10:00", type: "assignment", courseId: "2", assignmentId: "54a", ...EVENT_COLORS.ela },
  { id: "54b", title: "Science: Study Guide Review", date: 22, startTime: "10:00", endTime: "10:00", type: "assignment", courseId: "3", assignmentId: "54b", ...EVENT_COLORS.science },
];

// March 2026 events (shown in last row)
const MARCH_EVENTS: CalendarEvent[] = [
  { id: "m1", title: "Math - Period 3", date: 2, startTime: "10:00", endTime: "10:50", type: "class", courseId: "1", ...EVENT_COLORS.math },
  { id: "m2", title: "English Language Arts", date: 2, startTime: "08:00", endTime: "08:50", type: "class", courseId: "2", ...EVENT_COLORS.ela },
  { id: "m3", title: "Social Studies", date: 3, startTime: "12:30", endTime: "13:20", type: "class", courseId: "4", ...EVENT_COLORS.socialStudies },
  { id: "m4", title: "Science - Period 4", date: 3, startTime: "11:00", endTime: "11:50", type: "class", courseId: "3", ...EVENT_COLORS.science },
];

export default function CalendarPage() {
  const [currentView, setCurrentView] = useState<ViewType>("month");
  const [currentMonth, setCurrentMonth] = useState(1); // February = 1 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number>(5); // For day view

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper function to get the appropriate link for an event
  const getEventLink = (event: CalendarEvent) => {
    if (event.type === "class") {
      // For classes, link to the course page
      return `/courses/${event.courseId}`;
    } else if (event.assignmentId && event.courseId) {
      // For assignments, quizzes, tests, projects - link to assignment page
      return `/courses/${event.courseId}/assignments/${event.assignmentId}`;
    }
    return "#";
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(1); // February
    setCurrentYear(2026);
  };

  const viewDayDetails = (day: number) => {
    setSelectedDay(day);
    setCurrentView("day");
  };

  const getDayOfWeek = (date: number) => {
    // February 1, 2026 is a Sunday (day 0)
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[date % 7];
  };

  // Generate calendar days for February 2026
  const generateCalendarDays = () => {
    const days: { date: number; isCurrentMonth: boolean; events: CalendarEvent[] }[] = [];

    // February 2026 starts on Sunday, so no previous month days needed for first row
    // But we need to show the last row with March dates

    // February 2026 days (28 days, starts on Sunday)
    for (let i = 1; i <= 28; i++) {
      const dayEvents = FEBRUARY_EVENTS.filter(e => e.date === i);
      days.push({ date: i, isCurrentMonth: true, events: dayEvents });
    }

    // March days to fill the remaining cells (March 1-14 for the last two rows)
    for (let i = 1; i <= 14; i++) {
      const dayEvents = MARCH_EVENTS.filter(e => e.date === i);
      days.push({ date: i, isCurrentMonth: false, events: dayEvents });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            View your schedule, assignments, and upcoming events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors">
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        {/* Calendar Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {monthNames[currentMonth]} {currentYear}
            </h2>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(["month", "week", "day", "agenda"] as ViewType[]).map((view) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${currentView === view
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Content */}
        <div className="p-4">
          {/* Month View */}
          {currentView === "month" && (
            <>
              {/* Days of Week Header */}
              <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-3"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[120px] border-b border-r border-gray-100 dark:border-gray-800 p-2 ${index % 7 === 0 ? "border-l" : ""
                      } ${!day.isCurrentMonth ? "bg-gray-50/50 dark:bg-gray-800/30" : ""}`}
                  >
                    <div className={`text-sm mb-1 ${day.isCurrentMonth
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-400 dark:text-gray-600"
                      }`}>
                      {day.date}
                    </div>
                    <div className="space-y-1">
                      {/* Show first 4 events */}
                      {day.events.slice(0, 4).map((event) => (
                        <Link
                          key={event.id}
                          href={getEventLink(event)}
                          className="block text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: event.bgColor,
                            color: event.textColor,
                            borderLeft: `3px solid ${event.color}`
                          }}
                          title={event.title}
                        >
                          {event.title}
                        </Link>
                      ))}
                      {day.events.length > 4 && (
                        <button
                          onClick={() => viewDayDetails(day.date)}
                          className="text-xs text-[#6E8CB9] hover:text-[#5a7399] dark:text-[#8fa8cc] dark:hover:text-[#6E8CB9] pl-1 cursor-pointer hover:underline"
                        >
                          +{day.events.length - 4} more
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Week View */}
          {currentView === "week" && (
            <div className="space-y-0">
              {/* Week Header */}
              <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-10">
                <div className="py-3" /> {/* Time column */}
                {[
                  { day: "Sun", date: 1 },
                  { day: "Mon", date: 2 },
                  { day: "Tue", date: 3 },
                  { day: "Wed", date: 4 },
                  { day: "Thu", date: 5 },
                  { day: "Fri", date: 6 },
                  { day: "Sat", date: 7 },
                ].map((item) => (
                  <div
                    key={item.date}
                    className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 py-3 border-l border-gray-200 dark:border-gray-700"
                  >
                    <div>{item.day}</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{item.date}</div>
                  </div>
                ))}
              </div>

              {/* Time slots with events */}
              <div className="relative">
                {Array.from({ length: 10 }, (_, i) => i + 8).map((hour) => {
                  // Get events for this hour across all days of the week
                  const getEventsForHourAndDay = (day: number) => {
                    return FEBRUARY_EVENTS.filter((event) => {
                      if (event.date !== day || !event.startTime) return false;
                      const eventHour = parseInt(event.startTime.split(':')[0]);
                      return eventHour === hour;
                    });
                  };

                  return (
                    <div key={hour} className="grid grid-cols-8 min-h-[70px] border-b border-gray-100 dark:border-gray-800">
                      <div className="text-xs text-gray-500 dark:text-gray-400 pr-2 text-right pt-1">
                        {hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
                      </div>
                      {[1, 2, 3, 4, 5, 6, 7].map((dayDate) => {
                        const events = getEventsForHourAndDay(dayDate);
                        return (
                          <div
                            key={dayDate}
                            className="border-l border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer p-1 relative"
                          >
                            {events.map((event) => (
                              <Link
                                key={event.id}
                                href={getEventLink(event)}
                                className="block text-xs px-2 py-1 rounded mb-1 truncate hover:opacity-80 transition-opacity"
                                style={{
                                  backgroundColor: event.bgColor,
                                  color: event.textColor,
                                  borderLeft: `3px solid ${event.color}`,
                                }}
                                title={`${event.title} - ${event.startTime} to ${event.endTime}`}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                {event.startTime && (
                                  <div className="text-[10px] opacity-75">
                                    {event.startTime.replace(':00', '')} - {event.endTime?.replace(':00', '')}
                                  </div>
                                )}
                              </Link>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day View */}
          {currentView === "day" && (
            <div className="space-y-4">
              <div className="text-center py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getDayOfWeek(selectedDay)}, {monthNames[currentMonth]} {selectedDay}, {currentYear}
                </h3>
              </div>

              {/* All Day / Due Items */}
              {(() => {
                const allDayEvents = FEBRUARY_EVENTS.filter(e =>
                  e.date === selectedDay && (!e.startTime || e.startTime === "15:00")
                );
                if (allDayEvents.length > 0) {
                  return (
                    <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">All Day / Due Today</h4>
                      <div className="space-y-2">
                        {allDayEvents.map((event) => (
                          <Link
                            key={event.id}
                            href={getEventLink(event)}
                            className="block text-sm px-3 py-2 rounded hover:opacity-80 transition-opacity"
                            style={{
                              backgroundColor: event.bgColor,
                              color: event.textColor,
                              borderLeft: `3px solid ${event.color}`
                            }}
                          >
                            {event.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Time slots for day */}
              {Array.from({ length: 14 }, (_, i) => i + 7).map((hour) => {
                const hourEvents = FEBRUARY_EVENTS.filter(e => {
                  if (e.date !== selectedDay || !e.startTime) return false;
                  const eventHour = parseInt(e.startTime.split(':')[0]);
                  return eventHour === hour;
                });
                return (
                  <div key={hour} className="flex min-h-[60px] border-b border-gray-100 dark:border-gray-800">
                    <div className="w-20 text-xs text-gray-500 dark:text-gray-400 pr-4 text-right flex-shrink-0 pt-1">
                      {hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? "12:00 PM" : `${hour}:00 AM`}
                    </div>
                    <div className="flex-1 border-l border-gray-200 dark:border-gray-700 pl-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer">
                      {hourEvents.map((event) => (
                        <Link
                          key={event.id}
                          href={getEventLink(event)}
                          className="block text-xs px-2 py-1 rounded mb-1 hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: event.bgColor,
                            color: event.textColor,
                            borderLeft: `3px solid ${event.color}`
                          }}
                        >
                          {event.startTime && event.endTime && (
                            <span className="font-medium">{event.startTime} - {event.endTime} </span>
                          )}
                          {event.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Agenda View */}
          {currentView === "agenda" && (
            <div className="space-y-6">
              {/* Group events by date */}
              {Array.from({ length: 28 }, (_, i) => i + 1).map((date) => {
                const dayEvents = FEBRUARY_EVENTS.filter(e => e.date === date).sort((a, b) => {
                  const timeA = a.startTime || "23:59";
                  const timeB = b.startTime || "23:59";
                  return timeA.localeCompare(timeB);
                });
                if (dayEvents.length === 0) return null;

                // Correct day of week calculation for February 2026
                // February 1, 2026 is a Sunday
                const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                const dayOfWeek = dayNames[date % 7];

                // Get event type badge
                const getEventTypeBadge = (type: string) => {
                  const badges = {
                    class: "Class",
                    assignment: "Due",
                    quiz: "Quiz",
                    test: "Test",
                    project: "Project",
                    event: "Event",
                  };
                  return badges[type as keyof typeof badges] || badges.event;
                };

                const formatTime = (time?: string) => {
                  if (!time || time === "15:00") return null;
                  const [hour, minute] = time.split(':');
                  const hourNum = parseInt(hour);
                  const ampm = hourNum >= 12 ? 'PM' : 'AM';
                  const displayHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
                  return `${displayHour}:${minute} ${ampm}`;
                };

                return (
                  <div key={date} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {/* Date Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-baseline gap-3">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{date}</div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">{dayOfWeek}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-500">February 2026</div>
                        <div className="ml-auto">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#6E8CB9]/10 text-[#6E8CB9]">
                            {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Events List */}
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {dayEvents.map((event) => {
                        const badge = getEventTypeBadge(event.type);
                        const startTimeFormatted = formatTime(event.startTime);
                        const endTimeFormatted = formatTime(event.endTime);

                        return (
                          <Link
                            key={event.id}
                            href={getEventLink(event)}
                            className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-start gap-4">
                              {/* Time Column */}
                              <div className="w-24 flex-shrink-0 pt-0.5">
                                {startTimeFormatted ? (
                                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {startTimeFormatted}
                                  </div>
                                ) : (
                                  <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                    All Day
                                  </div>
                                )}
                                {endTimeFormatted && startTimeFormatted !== endTimeFormatted && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    to {endTimeFormatted}
                                  </div>
                                )}
                              </div>

                              {/* Color Indicator */}
                              <div
                                className="w-1 h-full rounded-full mt-1 flex-shrink-0"
                                style={{ backgroundColor: event.color, minHeight: '40px' }}
                              />

                              {/* Event Details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-3 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-[#6E8CB9] dark:group-hover:text-[#6E8CB9] transition-colors">
                                      {event.title}
                                    </h4>
                                  </div>
                                  <span
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium flex-shrink-0"
                                    style={{
                                      backgroundColor: event.bgColor,
                                      color: event.textColor,
                                    }}
                                  >
                                    {badge}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
