"use client";

import Link from "next/link";
import { MoreVertical, MessageSquare, FileText, Bell, Folder, ClipboardList, Circle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Main Content - Course Cards */}
      <div className="flex-1 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-normal text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Right Sidebar - To-Do (stacks below on mobile, sidebar on desktop) */}
      <div className="w-full lg:w-80 lg:flex-shrink-0">
        <div className="lg:sticky lg:top-6">
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900">
            {/* To-Do Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <ClipboardList className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="font-semibold text-gray-900 dark:text-white">To-Do</h2>
              <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                {TODO_ITEMS.length} items
              </span>
            </div>

            {/* To-Do List */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[600px] lg:max-h-[calc(100vh-200px)] overflow-y-auto">
              {TODO_ITEMS.map((item) => (
                <TodoItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TodoItemData {
  id: string;
  title: string;
  course: string;
  courseCode: string;
  dueDate: string;
  type: "assignment" | "quiz";
  points: number;
}

const TODO_ITEMS: TodoItemData[] = [
  {
    id: "1",
    title: "Fractions Worksheet",
    course: "Math - Period 3",
    courseCode: "Math",
    dueDate: "Jan 20, 3:00 PM",
    type: "assignment",
    points: 20,
  },
  {
    id: "2",
    title: "Spelling Quiz: Unit 5",
    course: "English Language Arts",
    courseCode: "ELA",
    dueDate: "Jan 21, 10:00 AM",
    type: "quiz",
    points: 15,
  },
  {
    id: "3",
    title: "Solar System Project",
    course: "Science - Period 4",
    courseCode: "Science",
    dueDate: "Jan 22, 3:00 PM",
    type: "assignment",
    points: 50,
  },
  {
    id: "4",
    title: "Chapter 8 Questions",
    course: "Social Studies",
    courseCode: "SS",
    dueDate: "Jan 23, 3:00 PM",
    type: "assignment",
    points: 25,
  },
  {
    id: "5",
    title: "Multiplication Quiz",
    course: "Math - Period 3",
    courseCode: "Math",
    dueDate: "Jan 24, 9:00 AM",
    type: "quiz",
    points: 20,
  },
  {
    id: "6",
    title: "Book Report: Charlotte's Web",
    course: "English Language Arts",
    courseCode: "ELA",
    dueDate: "Jan 25, 3:00 PM",
    type: "assignment",
    points: 100,
  },
  {
    id: "7",
    title: "States & Capitals Quiz",
    course: "Social Studies",
    courseCode: "SS",
    dueDate: "Jan 26, 1:00 PM",
    type: "quiz",
    points: 30,
  },
];

function TodoItem({ item }: { item: TodoItemData }) {
  return (
    <div className="px-3 sm:px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer touch-manipulation">
      <div className="flex items-start gap-3">
        {/* Checkbox circle */}
        <button className="mt-0.5 flex-shrink-0 w-9 h-9 flex items-center justify-center -ml-2 touch-manipulation" aria-label="Mark as complete">
          <Circle className="w-4 h-4 text-gray-300 hover:text-[#6E8CB9] transition-colors" />
        </button>

        <div className="flex-1 min-w-0">
          {/* Title with type badge */}
          <div className="flex items-start gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 flex-1">
              {item.title}
            </span>
            <span
              className={`flex-shrink-0 text-[10px] font-medium px-2 py-1 rounded whitespace-nowrap ${item.type === "quiz"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
            >
              {item.type === "quiz" ? "Quiz" : "Assign"}
            </span>
          </div>

          {/* Course and Points */}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {item.courseCode} • {item.points} pts
          </p>

          {/* Due date */}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Due: {item.dueDate}
          </p>
        </div>
      </div>
    </div>
  );
}

interface Course {
  id: string;
  name: string;
  code: string;
  term: string;
  image: string;
  color: string;
  announcements?: number;
  assignments?: number;
}

const MOCK_COURSES: Course[] = [
  {
    id: "1",
    name: "Math - Period 3",
    code: "Mrs. Johnson",
    term: "Spring 2026",
    image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=200&fit=crop",
    color: "#6E8CB9",
    announcements: 2,
    assignments: 1,
  },
  {
    id: "2",
    name: "English Language Arts",
    code: "Mr. Thompson",
    term: "Spring 2026",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=200&fit=crop",
    color: "#4A7C59",
    assignments: 3,
  },
  {
    id: "3",
    name: "Science - Period 4",
    code: "Ms. Garcia",
    term: "Spring 2026",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=200&fit=crop",
    color: "#8B5A2B",
  },
  {
    id: "4",
    name: "Social Studies",
    code: "Mr. Williams",
    term: "Spring 2026",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=200&fit=crop",
    color: "#6B4C9A",
    announcements: 1,
  },
  {
    id: "5",
    name: "Art",
    code: "Mrs. Davis",
    term: "Spring 2026",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=200&fit=crop",
    color: "#C4564A",
  },
  {
    id: "6",
    name: "Physical Education",
    code: "Coach Martinez",
    term: "Spring 2026",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=200&fit=crop",
    color: "#2E8B8B",
    assignments: 2,
  },
];

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Course Image - Clickable */}
      <Link href={`/courses/${course.id}`} className="block relative h-32 sm:h-36 overflow-hidden">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Menu button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-2 right-2 p-1.5 hover:bg-white/20 rounded-lg transition-colors z-10 touch-manipulation"
          aria-label="Course options"
        >
          <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        {/* Course name on image */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2 leading-tight drop-shadow-lg">
            {course.name}
          </h3>
        </div>
      </Link>

      {/* Course Info - Clickable */}
      <Link href={`/courses/${course.id}`} className="block p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
          {course.code}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
          {course.term}
        </p>
      </Link>

      {/* Action Icons */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex items-center gap-3 sm:gap-4">
        <Link
          href={`/courses/${course.id}/messages`}
          className="relative inline-flex items-center justify-center w-9 h-9 text-gray-400 hover:text-[#6E8CB9] dark:hover:text-[#6E8CB9] transition-colors touch-manipulation"
          aria-label="Messages"
        >
          <MessageSquare className="w-5 h-5" />
          {course.announcements && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#6E8CB9] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              {course.announcements}
            </span>
          )}
        </Link>
        <Link
          href={`/courses/${course.id}/assignments`}
          className="relative inline-flex items-center justify-center w-9 h-9 text-gray-400 hover:text-[#6E8CB9] dark:hover:text-[#6E8CB9] transition-colors touch-manipulation"
          aria-label="Assignments"
        >
          <FileText className="w-5 h-5" />
          {course.assignments && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#6E8CB9] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              {course.assignments}
            </span>
          )}
        </Link>
        <Link
          href={`/courses/${course.id}/announcements`}
          className="inline-flex items-center justify-center w-9 h-9 text-gray-400 hover:text-[#6E8CB9] dark:hover:text-[#6E8CB9] transition-colors touch-manipulation"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
        </Link>
        <Link
          href={`/courses/${course.id}/content`}
          className="inline-flex items-center justify-center w-9 h-9 text-gray-400 hover:text-[#6E8CB9] dark:hover:text-[#6E8CB9] transition-colors touch-manipulation"
          aria-label="Course materials"
        >
          <Folder className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
