"use client";

import { useState } from "react";
import { Search, FileText, Calendar, ChevronRight, Printer } from "lucide-react";
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
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <p className="text-[#6E8CB9] font-medium">Math - Period 3</p>
          <p className="text-[#6E8CB9]">Introduction to Algebra</p>
        </div>
        
        <div className="space-y-2">
          <p><span className="font-semibold">Instructor:</span> Mrs. Johnson [johnson@school.edu]</p>
          <p><span className="font-semibold">Office Hours:</span> Tuesday & Thursday 3:30-4:30 PM</p>
          <p><span className="font-semibold">Room:</span> 204</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#6E8CB9]">1. Course Description</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            This course introduces students to the fundamental concepts of algebra. Students will learn to work with variables, 
            solve equations, understand functions, and apply mathematical reasoning to real-world problems. Emphasis will be 
            placed on building a strong foundation for future mathematics courses.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#6E8CB9]">2. Course Objectives</h3>
          <p className="text-gray-700 dark:text-gray-300">Upon completion of this course, students will be able to:</p>
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">Standard</th>
                <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left">Objective</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center">1</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Solve linear equations and inequalities</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center">2</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Graph linear functions on a coordinate plane</td>
              </tr>
              <tr>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center">3</td>
                <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">Apply algebraic concepts to word problems</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-[#6E8CB9]">3. Grading Policy</h3>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
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
  toc: {
    title: "Table of Contents",
    type: "list",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">Course materials organized by unit:</p>
        <div className="space-y-1">
          {["Unit 1: Variables & Expressions", "Unit 2: Solving Equations", "Unit 3: Inequalities", "Unit 4: Functions", "Unit 5: Graphing", "Unit 6: Systems of Equations", "Unit 7: Polynomials", "Unit 8: Factoring", "Unit 9: Quadratics", "Unit 10: Review & Final"].map((unit, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FileText className="w-5 h-5 text-[#6E8CB9]" />
              <span className="text-gray-700 dark:text-gray-300">{unit}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  homework: {
    title: "Homework",
    type: "list",
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">Current homework assignments:</p>
        <div className="space-y-1">
          {[
            { name: "HW 5: Chapter 5 Practice", due: "Jan 20", status: "pending" },
            { name: "HW 4: Graphing Linear Equations", due: "Jan 15", status: "completed" },
            { name: "HW 3: Solving Multi-Step Equations", due: "Jan 10", status: "completed" },
            { name: "HW 2: Variables & Expressions", due: "Jan 6", status: "completed" },
            { name: "HW 1: Course Introduction", due: "Jan 3", status: "completed" },
          ].map((hw, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FileText className={cn("w-5 h-5", hw.status === "completed" ? "text-green-500" : "text-[#6E8CB9]")} />
              <div className="flex-1">
                <span className="text-gray-700 dark:text-gray-300">{hw.name}</span>
                <p className="text-xs text-gray-500">Due: {hw.due}</p>
              </div>
              {hw.status === "completed" && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Completed</span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

export default function ContentPage() {
  const [selectedTopic, setSelectedTopic] = useState("syllabus");
  const [searchQuery, setSearchQuery] = useState("");

  const currentContent = TOPIC_CONTENT[selectedTopic] || TOPIC_CONTENT.syllabus;

  const filteredTopics = CONTENT_TOPICS.filter((topic) =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-8 min-h-[600px]">
      {/* Left Sidebar - Topics Navigation */}
      <div className="w-64 flex-shrink-0">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Topics"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent"
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
                onClick={() => setSelectedTopic(topic.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 text-left rounded-lg transition-colors",
                  topic.isLarge ? "py-3" : "py-2",
                  isActive 
                    ? "text-[#6E8CB9] font-medium" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {topic.isLarge && (
                  <Icon className={cn(
                    "w-6 h-6",
                    isActive ? "text-[#6E8CB9]" : "text-gray-500 dark:text-gray-400"
                  )} />
                )}
                <span className={cn(
                  "flex-1",
                  topic.isLarge ? "text-base" : "text-sm"
                )}>
                  {topic.title}
                </span>
                {topic.count && (
                  <span className={cn(
                    "text-sm font-medium",
                    isActive ? "text-[#6E8CB9]" : "text-gray-400"
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
      <div className="w-px bg-gray-200 dark:bg-gray-700" />

      {/* Right Content Area */}
      <div className="flex-1">
        {/* Content Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
            {currentContent.title}
          </h2>
          <button className="flex items-center gap-2 text-sm text-[#6E8CB9] hover:underline">
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>

        {/* Content Body */}
        <div className="text-gray-900 dark:text-white">
          {currentContent.content}
        </div>
      </div>
    </div>
  );
}
