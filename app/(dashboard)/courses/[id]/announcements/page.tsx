"use client";

import { useState, useRef, useEffect } from "react";
import { Megaphone, Search, Calendar, ChevronDown, ChevronUp, Pin, User, Filter } from "lucide-react";

type FilterType = "all" | "unread" | "pinned";

// Mock data for announcements
const ANNOUNCEMENTS_DATA = [
  {
    id: 1,
    title: "Class Field Trip Permission Slip",
    author: "Mrs. Johnson",
    date: "Jan 18, 2026",
    timestamp: "10:30 AM",
    pinned: true,
    unread: true,
    content: `Dear Students and Parents,

We are excited to announce an upcoming field trip to the Science Museum on February 5th, 2026!

**Important Details:**
- Date: February 5th, 2026
- Departure: 8:00 AM from the school parking lot
- Return: 3:30 PM
- Cost: $15 (includes admission and lunch)

Please return the signed permission slip by Friday, January 24th. You can find the permission slip attached below or pick up a physical copy from the main office.

Students without a signed permission slip will not be able to attend the field trip.

If you have any questions, please don't hesitate to reach out.

Best regards,
Mrs. Johnson`,
  },
  {
    id: 2,
    title: "Study Guide Posted for Unit 3 Quiz",
    author: "Mrs. Johnson",
    date: "Jan 15, 2026",
    timestamp: "2:45 PM",
    pinned: true,
    unread: true,
    content: `Hello Class!

The study guide for next week's Unit 3 quiz has been posted under Course Content > Materials.

**Quiz Details:**
- Date: January 22nd, 2026
- Time: During regular class period
- Format: 25 multiple choice questions + 2 short answer
- Topics covered: Chapters 7-9

**Study Tips:**
1. Review all vocabulary terms
2. Practice the sample problems at the end of each chapter
3. Review your notes from class discussions
4. Complete the practice quiz (optional but recommended)

Office hours are available Tuesday and Thursday from 3:00-4:00 PM if you need extra help.

Good luck studying!`,
  },
  {
    id: 3,
    title: "Reminder: Project Proposals Due Friday",
    author: "Mrs. Johnson",
    date: "Jan 13, 2026",
    timestamp: "9:00 AM",
    pinned: false,
    unread: true,
    content: `Just a friendly reminder that your research project proposals are due this Friday, January 17th by 3:00 PM.

Your proposal should include:
- Topic selection (from the approved list)
- Research question
- Initial sources (at least 3)
- Brief outline of your approach

Submit through the Assignments section of the course. Late submissions will receive a 10% deduction per day.

Let me know if you have any questions!`,
  },
  {
    id: 4,
    title: "Welcome Back from Winter Break!",
    author: "Mrs. Johnson",
    date: "Jan 6, 2026",
    timestamp: "8:00 AM",
    pinned: false,
    unread: false,
    content: `Welcome back, everyone! I hope you all had a wonderful winter break.

Here's what to expect this week:
- Monday: Review of last semester's content
- Tuesday: Introduction to Unit 3
- Wednesday: Lab activity (remember your lab notebooks!)
- Thursday: Reading assignment discussion
- Friday: Quiz review game

Please make sure you have all your materials ready. If you need any supplies, let me know by Tuesday.

Looking forward to a great semester!`,
  },
  {
    id: 5,
    title: "Holiday Assignment Reminder",
    author: "Mrs. Johnson",
    date: "Dec 20, 2025",
    timestamp: "1:00 PM",
    pinned: false,
    unread: false,
    content: `Happy Holidays, everyone!

Just a reminder about the optional holiday assignment:
- Read Chapter 6 and complete the reflection questions
- This is worth 10 extra credit points
- Due: January 10th, 2026

Have a safe and happy holiday break! See you in the new year.`,
  },
];

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread Only" },
  { value: "pinned", label: "Pinned Only" },
];

export default function AnnouncementsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredAnnouncements = ANNOUNCEMENTS_DATA.filter((announcement) => {
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        announcement.title.toLowerCase().includes(query) ||
        announcement.content.toLowerCase().includes(query) ||
        announcement.author.toLowerCase().includes(query)
      );
    }
    return true;
  }).filter((announcement) => {
    // Filter by type
    if (filter === "pinned") return announcement.pinned;
    if (filter === "unread") return announcement.unread;
    return true;
  });

  // Sort: pinned first, then by date
  const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const currentFilterLabel = FILTER_OPTIONS.find((opt) => opt.value === filter)?.label || "All";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-normal text-gray-900 dark:text-white">Announcements</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        
        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              filter !== "all"
                ? "bg-[#6E8CB9]/10 border-[#6E8CB9] text-[#6E8CB9]"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <Filter className="w-4 h-4" />
            {currentFilterLabel}
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilter(option.value);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    filter === option.value
                      ? "bg-[#6E8CB9]/10 text-[#6E8CB9] font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <Megaphone className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No announcements found</p>
          </div>
        ) : (
          sortedAnnouncements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isExpanded={expandedIds.includes(announcement.id)}
              onToggle={() => toggleExpand(announcement.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface AnnouncementCardProps {
  announcement: {
    id: number;
    title: string;
    author: string;
    date: string;
    timestamp: string;
    pinned: boolean;
    unread: boolean;
    content: string;
  };
  isExpanded: boolean;
  onToggle: () => void;
}

// Simple markdown parser for announcements
function parseMarkdown(text: string): string {
  return text
    // Escape HTML first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Bold: **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    // Italic: *text* or _text_
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Convert line breaks to <br> for proper spacing
    .replace(/\n/g, "<br>");
}

// Strip markdown for preview
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/_(.+?)_/g, "$1");
}

function AnnouncementCard({ announcement, isExpanded, onToggle }: AnnouncementCardProps) {
  // Get preview (first 150 characters), strip markdown
  const strippedContent = stripMarkdown(announcement.content);
  const preview = strippedContent.slice(0, 150).trim() + (strippedContent.length > 150 ? "..." : "");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {announcement.unread && (
                <span className="inline-flex items-center text-xs font-medium text-[#0066cc] bg-[#0066cc]/10 px-2 py-0.5 rounded">
                  Unread
                </span>
              )}
              {announcement.pinned && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
            </div>
            <h3 className={`font-semibold text-gray-900 dark:text-white text-lg ${announcement.unread ? "font-bold" : ""}`}>
              {announcement.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{announcement.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{announcement.date} at {announcement.timestamp}</span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Preview (when collapsed) */}
        {!isExpanded && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {preview}
          </p>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800">
          <div className="pt-4">
            <div 
              className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed [&_strong]:font-semibold [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(announcement.content) }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
