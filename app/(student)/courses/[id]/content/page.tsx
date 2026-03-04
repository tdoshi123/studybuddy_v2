"use client";

import { useState } from "react";
import { Search, FileText, Calendar, ChevronRight, Printer, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock content data organized by modules/topics
const CONTENT_TOPICS = [
  { id: "syllabus", title: "Syllabus", icon: FileText, count: null, isLarge: true },
  { id: "schedule", title: "Course Schedule", icon: Calendar, count: null, isLarge: true },
  { id: "toc", title: "Table of Contents", icon: FileText, count: 10, isLarge: true },
  { id: "homework", title: "Homework", icon: FileText, count: 5, isLarge: false },
  { id: "worksheets", title: "Worksheets", icon: FileText, count: 8, isLarge: false },
  { id: "projects", title: "Projects", icon: FileText, count: 3, isLarge: false },
  { id: "resources", title: "Resources", icon: FileText, count: null, isLarge: false },
  { id: "extra", title: "Extra Credit", icon: FileText, count: 1, isLarge: false },
];

// Mock content for different topics
const TOPIC_CONTENT: Record<string, { title: string; type: string; content: React.ReactNode }> = {
  syllabus: {
    title: "Syllabus",
    type: "document",
    content: (
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center space-y-1">
          <p className="text-[#1e3a8a] font-medium text-sm sm:text-base">Math - Period 3</p>
          <p className="text-[#1e3a8a] text-sm sm:text-base">Introduction to Algebra</p>
        </div>
        
        <div className="space-y-2 text-xs sm:text-sm">
          <p><span className="font-semibold">Instructor:</span> Mrs. Johnson [johnson@school.edu]</p>
          <p><span className="font-semibold">Office Hours:</span> Tuesday & Thursday 3:30-4:30 PM</p>
          <p><span className="font-semibold">Room:</span> 204</p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-[#1e3a8a]">1. Course Description</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-sm">
            This course introduces students to the fundamental concepts of algebra. Students will learn to work with variables, 
            solve equations, understand functions, and apply mathematical reasoning to real-world problems. Emphasis will be 
            placed on building a strong foundation for future mathematics courses.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-[#1e3a8a]">2. Course Objectives</h3>
          <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Upon completion of this course, students will be able to:</p>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 text-left">Standard</th>
                  <th className="border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 text-left">Objective</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 text-center">1</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2">Solve linear equations and inequalities</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 text-center">2</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2">Graph linear functions on a coordinate plane</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 text-center">3</td>
                  <td className="border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2">Apply algebraic concepts to word problems</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-semibold text-[#1e3a8a]">3. Grading Policy</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 text-xs sm:text-sm">
            <li>Homework: 20%</li>
            <li>Quizzes: 25%</li>
            <li>Tests: 35%</li>
            <li>Projects: 15%</li>
            <li>Participation: 5%</li>
          </ul>
        </div>
      </div>
    ),
  },
  schedule: {
    title: "Course Schedule",
    type: "document",
    content: (
      <div className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#1e3a8a] text-white">
                <th className="px-3 sm:px-4 py-2.5 text-left font-semibold">Week</th>
                <th className="px-3 sm:px-4 py-2.5 text-left font-semibold">Dates</th>
                <th className="px-3 sm:px-4 py-2.5 text-left font-semibold">Topic</th>
                <th className="px-3 sm:px-4 py-2.5 text-left font-semibold">Assignments Due</th>
              </tr>
            </thead>
            <tbody>
              {[
                { week: "1",  dates: "Jan 5–9",    topic: "Review: Order of Operations",           due: "HW 1" },
                { week: "2",  dates: "Jan 12–16",   topic: "Variables & Expressions",               due: "HW 2, Worksheet 1" },
                { week: "3",  dates: "Jan 19–23",   topic: "Solving One-Step Equations",            due: "HW 3, Quiz 1" },
                { week: "4",  dates: "Jan 26–30",   topic: "Solving Multi-Step Equations",          due: "HW 4, Worksheet 2–3" },
                { week: "5",  dates: "Feb 2–6",     topic: "Inequalities",                          due: "Worksheet 4, Project 1" },
                { week: "6",  dates: "Feb 9–13",    topic: "Introduction to Functions",             due: "HW 5, Quiz 2" },
                { week: "7",  dates: "Feb 16–20",   topic: "Graphing Linear Functions",             due: "Worksheet 5–6" },
                { week: "8",  dates: "Feb 23–27",   topic: "Slope & Rate of Change",                due: "Worksheet 7, Project 2" },
                { week: "9",  dates: "Mar 2–6",     topic: "Systems of Equations",                  due: "HW 6, Quiz 3" },
                { week: "10", dates: "Mar 9–13",    topic: "Intro to Polynomials",                  due: "HW 7, Worksheet 8" },
                { week: "11", dates: "Mar 16–20",   topic: "Factoring",                             due: "HW 8" },
                { week: "12", dates: "Mar 23–27",   topic: "Quadratic Equations",                   due: "Project 3, Quiz 4" },
                { week: "13", dates: "Mar 30–Apr 3",topic: "Review & Final Exam Prep",              due: "Study Guide" },
                { week: "14", dates: "Apr 6–10",    topic: "Final Exam Week",                       due: "Final Exam" },
              ].map((row, i) => (
                <tr
                  key={i}
                  className={cn(
                    "border-b border-gray-200 dark:border-gray-700",
                    i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/50"
                  )}
                >
                  <td className="px-3 sm:px-4 py-2.5 font-medium text-gray-900 dark:text-white">{row.week}</td>
                  <td className="px-3 sm:px-4 py-2.5 text-gray-600 dark:text-gray-400 whitespace-nowrap">{row.dates}</td>
                  <td className="px-3 sm:px-4 py-2.5 text-gray-700 dark:text-gray-300">{row.topic}</td>
                  <td className="px-3 sm:px-4 py-2.5 text-gray-500 dark:text-gray-400">{row.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300">
            <span className="font-semibold">Note:</span> Schedule is subject to change. Check announcements for any updates.
          </p>
        </div>
      </div>
    ),
  },
  toc: {
    title: "Table of Contents",
    type: "list",
    content: (
      <div className="space-y-1">
          {["Unit 1: Variables & Expressions", "Unit 2: Solving Equations", "Unit 3: Inequalities", "Unit 4: Functions", "Unit 5: Graphing", "Unit 6: Systems of Equations", "Unit 7: Polynomials", "Unit 8: Factoring", "Unit 9: Quadratics", "Unit 10: Review & Final"].map((unit, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors touch-manipulation">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e3a8a] flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm flex-1">{unit}</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
      </div>
    ),
  },
  homework: {
    title: "Homework",
    type: "list",
    content: (
      <div className="space-y-1">
          {[
            { name: "HW 5: Chapter 5 Practice", due: "Jan 20", status: "pending" },
            { name: "HW 4: Graphing Linear Equations", due: "Jan 15", status: "completed" },
            { name: "HW 3: Solving Multi-Step Equations", due: "Jan 10", status: "completed" },
            { name: "HW 2: Variables & Expressions", due: "Jan 6", status: "completed" },
            { name: "HW 1: Course Introduction", due: "Jan 3", status: "completed" },
          ].map((hw, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors touch-manipulation">
              <FileText className={cn("w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0", hw.status === "completed" ? "text-green-500" : "text-[#1e3a8a]")} />
              <div className="flex-1 min-w-0">
                <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm block truncate">{hw.name}</span>
                <p className="text-[10px] sm:text-xs text-gray-500">Due: {hw.due}</p>
              </div>
              {hw.status === "completed" && (
                <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">Completed</span>
              )}
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
      </div>
    ),
  },
  worksheets: {
    title: "Worksheets",
    type: "list",
    content: (
      <div className="space-y-1">
          {[
            { name: "Worksheet 8: Quadratic Expressions", due: "Jan 24", status: "pending" },
            { name: "Worksheet 7: Factoring Polynomials", due: "Jan 20", status: "pending" },
            { name: "Worksheet 6: Graphing Practice", due: "Jan 17", status: "completed" },
            { name: "Worksheet 5: Systems of Equations", due: "Jan 13", status: "completed" },
            { name: "Worksheet 4: Slope & Intercepts", due: "Jan 10", status: "completed" },
            { name: "Worksheet 3: Solving Inequalities", due: "Jan 7", status: "completed" },
            { name: "Worksheet 2: Multi-Step Equations", due: "Jan 5", status: "completed" },
            { name: "Worksheet 1: Order of Operations Review", due: "Jan 3", status: "completed" },
          ].map((ws, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors touch-manipulation">
              <FileText className={cn("w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0", ws.status === "completed" ? "text-green-500" : "text-[#1e3a8a]")} />
              <div className="flex-1 min-w-0">
                <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm block truncate">{ws.name}</span>
                <p className="text-[10px] sm:text-xs text-gray-500">Due: {ws.due}</p>
              </div>
              {ws.status === "completed" && (
                <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">Completed</span>
              )}
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
      </div>
    ),
  },
  projects: {
    title: "Projects",
    type: "list",
    content: (
      <div className="space-y-1">
          {[
            { name: "Project 3: Real-World Algebra Application", due: "Feb 14", status: "pending" },
            { name: "Project 2: Graphing Story Problems", due: "Jan 17", status: "completed" },
            { name: "Project 1: Math in Everyday Life Poster", due: "Jan 6", status: "completed" },
          ].map((proj, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors touch-manipulation">
              <FileText className={cn("w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0", proj.status === "completed" ? "text-green-500" : "text-[#1e3a8a]")} />
              <div className="flex-1 min-w-0">
                <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm block truncate">{proj.name}</span>
                <p className="text-[10px] sm:text-xs text-gray-500">Due: {proj.due}</p>
              </div>
              {proj.status === "completed" && (
                <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">Completed</span>
              )}
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
      </div>
    ),
  },
  resources: {
    title: "Resources",
    type: "list",
    content: (
      <div className="space-y-1">
          {[
            { name: "Formula Reference Sheet" },
            { name: "Graphing Calculator Guide" },
            { name: "Study Tips & Strategies" },
            { name: "Practice Test Answer Keys" },
            { name: "Khan Academy Links" },
          ].map((res, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors touch-manipulation">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-[#1e3a8a]" />
              <div className="flex-1 min-w-0">
                <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm block truncate">{res.name}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
      </div>
    ),
  },
  extra: {
    title: "Extra Credit",
    type: "list",
    content: (
      <div className="space-y-1">
          {[
            { name: "Bonus: Math Puzzle Challenge", due: "Feb 7", status: "pending" },
          ].map((ec, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors touch-manipulation">
              <FileText className={cn("w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0", ec.status === "completed" ? "text-green-500" : "text-[#1e3a8a]")} />
              <div className="flex-1 min-w-0">
                <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm block truncate">{ec.name}</span>
                <p className="text-[10px] sm:text-xs text-gray-500">Due: {ec.due}</p>
              </div>
              {ec.status === "completed" && (
                <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap flex-shrink-0">Completed</span>
              )}
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
      </div>
    ),
  },
};

export default function ContentPage() {
  const [selectedTopic, setSelectedTopic] = useState("syllabus");
  const [searchQuery, setSearchQuery] = useState("");
  const [showContent, setShowContent] = useState(false);

  const currentContent = TOPIC_CONTENT[selectedTopic] || TOPIC_CONTENT.syllabus;

  const filteredTopics = CONTENT_TOPICS.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    setShowContent(true);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 min-h-[600px]">
      {/* Left Sidebar - Topics Navigation */}
      <div className={`${showContent ? 'hidden lg:block' : 'block'} w-full lg:w-64 lg:flex-shrink-0`}>
        {/* Search */}
        <div className="mb-3 sm:mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Topics"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
            />
          </div>
        </div>

        {/* Topics List */}
        <nav className="space-y-1">
          {filteredTopics.map((topic) => {
            const Icon = topic.icon;
            const isActive = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 text-left rounded-lg transition-colors touch-manipulation",
                  topic.isLarge ? "py-3" : "py-2",
                  isActive 
                    ? "text-[#1e3a8a] font-medium bg-blue-50 dark:bg-blue-900/10" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {topic.isLarge && (
                  <Icon className={cn(
                    "w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0",
                    isActive ? "text-[#1e3a8a]" : "text-gray-500 dark:text-gray-400"
                  )} />
                )}
                <span className={cn(
                  "flex-1",
                  topic.isLarge ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                )}>
                  {topic.title}
                </span>
                {topic.count && (
                  <span className={cn(
                    "text-xs sm:text-sm font-medium flex-shrink-0",
                    isActive ? "text-[#1e3a8a]" : "text-gray-400"
                  )}>
                    {topic.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-gray-200 dark:bg-gray-700" />

      {/* Right Content Area */}
      <div className={`${showContent ? 'block' : 'hidden lg:block'} flex-1`}>
        {/* Back Button (Mobile Only) */}
        <button
          onClick={() => setShowContent(false)}
          className="lg:hidden flex items-center gap-2 text-[#1e3a8a] mb-4 hover:underline touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Topics</span>
        </button>

        {/* Content Header */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white flex-1">
            {currentContent.title}
          </h2>
          {selectedTopic === "syllabus" && (
            <button className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[#1e3a8a] hover:underline flex-shrink-0 touch-manipulation">
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="text-gray-900 dark:text-white text-sm sm:text-base">
          {currentContent.content}
        </div>
      </div>
    </div>
  );
}
