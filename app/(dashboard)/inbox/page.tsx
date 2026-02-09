"use client";

import { useState } from "react";
import { Send, Search, Megaphone, Users, MessageCircle, Clock, Paperclip, Star, ChevronDown, ChevronUp, Reply, Forward, Trash2, Archive } from "lucide-react";

type MessageType = "announcement" | "teacher" | "student";
type FilterType = "all" | "announcements" | "teachers" | "students";

interface Message {
  id: string;
  type: MessageType;
  sender: string;
  role?: string;
  course?: string;
  subject: string;
  preview: string;
  fullContent: string;
  time: string;
  date: string;
  tags: string[];
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  attachments?: { name: string; size: string }[];
}

const MESSAGES_DATA: Message[] = [
  {
    id: "1",
    type: "announcement",
    sender: "Principal's Office",
    role: "Administration",
    subject: "School Picture Day - February 10th",
    preview: "School picture day is scheduled for Tuesday, February 10th. All students should wear...",
    fullContent: `Dear Students and Families,

School picture day is scheduled for Tuesday, February 10th!

**Important Information:**

• Pictures will be taken during first period
• Please wear your best school-appropriate clothing
• Remember to smile and have fun!
• Retake day will be scheduled for March 3rd

**Picture Package Information:**
- Basic package: $15 (includes 2 sheets)
- Deluxe package: $25 (includes 4 sheets + digital copy)
- Premium package: $40 (includes 6 sheets + digital copy + yearbook photo)

Order forms will be sent home next week. You can also order online at our school website.

If you have any questions, please contact the main office at (555) 123-4567.

Best regards,
Mrs. Anderson
Principal`,
    time: "1h ago",
    date: "February 1, 2026 at 9:30 AM",
    tags: ["Picture Day", "Important"],
    isRead: false,
    isStarred: true,
    hasAttachment: true,
    attachments: [{ name: "Picture_Day_Order_Form.pdf", size: "1.2 MB" }],
  },
  {
    id: "2",
    type: "teacher",
    sender: "Mrs. Johnson",
    role: "Math Teacher",
    course: "Math",
    subject: "Math: Fractions Worksheet Posted",
    preview: "Hello students, the Fractions Worksheet has been posted and is due next Friday...",
    fullContent: `Hello students,

The Fractions Worksheet has been posted and is due next Friday, February 7th by the end of class.

**Assignment Overview:**
This worksheet covers adding, subtracting, multiplying, and dividing fractions. Make sure to show all your work!

**Requirements:**
1. Complete all 20 problems on the worksheet
2. Show your work for each problem
3. Circle your final answers
4. Ask for help if you get stuck!

**Tips:**
- Remember to find common denominators when adding/subtracting
- Simplify your answers to lowest terms
- Check your work by working backwards

Please start early! If you need extra help, I'm available during lunch on Tuesday and Thursday in Room 204.

Let me know if you have any questions.

Best,
Mrs. Johnson`,
    time: "2h ago",
    date: "February 1, 2026 at 8:15 AM",
    tags: ["Assignment", "Due Soon"],
    isRead: false,
    isStarred: false,
    hasAttachment: true,
    attachments: [
      { name: "Fractions_Worksheet.pdf", size: "856 KB" },
    ],
  },
  {
    id: "3",
    type: "student",
    sender: "Sarah Martinez",
    course: "Science",
    subject: "Study Group for Solar System Project",
    preview: "Hey! I'm organizing a study group to work on the Solar System project together...",
    fullContent: `Hey!

I'm organizing a study group to work on the Solar System project together. Would you like to join?

**Details:**
- When: Saturday, February 8th from 2-4 PM
- Where: Public Library - Community Room
- What: Work on our Solar System projects and share ideas

I've already got 3 friends confirmed. We're planning to help each other with research and compare our planet posters.

My mom can give you a ride if you need one. Let me know if you're interested! It'll be fun! 😊

- Sarah`,
    time: "1d ago",
    date: "January 31, 2026 at 3:45 PM",
    tags: ["Study Group"],
    isRead: true,
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: "4",
    type: "teacher",
    sender: "Mr. Thompson",
    role: "ELA Teacher",
    course: "English",
    subject: "English: Extra Help Sessions This Week",
    preview: "Please note that I'll be offering extra help sessions this week for anyone who needs...",
    fullContent: `Dear Students,

I'll be offering extra help sessions this week for anyone who needs assistance with the book report or wants to practice their reading skills.

**Extra Help Schedule for This Week:**
- Tuesday: 3:00 PM - 4:00 PM (Room 112)
- Thursday: 3:00 PM - 4:00 PM (Room 112)

If you can't make these times, please let me know and we can arrange another time to meet.

Remember, the book report on "Charlotte's Web" is due on February 15th. Make sure to include:
- A summary of the story
- Your favorite character and why
- What you learned from the book
- A colorful cover page with illustrations

Keep up the great work!

Mr. Thompson`,
    time: "2d ago",
    date: "January 30, 2026 at 11:00 AM",
    tags: ["Extra Help"],
    isRead: true,
    isStarred: false,
    hasAttachment: false,
  },
];

export default function InboxPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  const toggleMessageExpand = (id: string) => {
    setExpandedMessage(expandedMessage === id ? null : id);
  };

  const filteredMessages = MESSAGES_DATA.filter((message) => {
    const matchesSearch =
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "announcements" && message.type === "announcement") ||
      (filter === "teachers" && message.type === "teacher") ||
      (filter === "students" && message.type === "student");

    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: MESSAGES_DATA.length,
    announcements: MESSAGES_DATA.filter((m) => m.type === "announcement").length,
    teachers: MESSAGES_DATA.filter((m) => m.type === "teacher").length,
    students: MESSAGES_DATA.filter((m) => m.type === "student").length,
  };

  const unreadCounts = {
    announcements: MESSAGES_DATA.filter((m) => m.type === "announcement" && !m.isRead).length,
    teachers: MESSAGES_DATA.filter((m) => m.type === "teacher" && !m.isRead).length,
    students: MESSAGES_DATA.filter((m) => m.type === "student" && !m.isRead).length,
  };

  const toggleMessageSelection = (id: string) => {
    setSelectedMessages((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case "announcement":
        return <Megaphone className="w-5 h-5 text-[#6E8CB9]" />;
      case "teacher":
        return <Users className="w-5 h-5 text-[#6E8CB9]" />;
      case "student":
        return <MessageCircle className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getIconBgColor = (type: MessageType) => {
    switch (type) {
      case "announcement":
        return "bg-blue-100 dark:bg-blue-900/30";
      case "teacher":
        return "bg-blue-100 dark:bg-blue-900/30";
      case "student":
        return "bg-emerald-100 dark:bg-emerald-900/30";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Inbox
          </h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Messages, announcements, and notifications
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors text-sm touch-manipulation flex-shrink-0">
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Compose</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Unread Announcements */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              Unread Announcements
            </p>
            <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {unreadCounts.announcements + 2}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            From school & teachers
          </p>
        </div>

        {/* Unread from Teachers */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              Unread from Teachers
            </p>
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {unreadCounts.teachers}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Course updates & feedback
          </p>
        </div>

        {/* Unread from Students */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              Unread from Students
            </p>
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            {unreadCounts.students + 1}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Messages from classmates
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap touch-manipulation ${filter === "all"
              ? "bg-[#6E8CB9] text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <Megaphone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">All</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === "all" ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"
              }`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setFilter("announcements")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap touch-manipulation ${filter === "announcements"
              ? "bg-[#6E8CB9] text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Announcements</span>
            <span className="sm:hidden">Annc.</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === "announcements" ? "bg-white/20" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              }`}>
              {counts.announcements + 2}
            </span>
          </button>

          <button
            onClick={() => setFilter("teachers")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap touch-manipulation ${filter === "teachers"
              ? "bg-[#6E8CB9] text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Teachers
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === "teachers" ? "bg-white/20" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}>
              {counts.teachers}
            </span>
          </button>

          <button
            onClick={() => setFilter("students")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap touch-manipulation ${filter === "students"
              ? "bg-[#6E8CB9] text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Students
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === "students" ? "bg-white/20" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              }`}>
              {counts.students}
            </span>
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
        {filteredMessages.map((message) => {
          const isExpanded = expandedMessage === message.id;

          return (
            <div key={message.id}>
              {/* Message Header (Collapsed View) */}
              <div
                onClick={() => toggleMessageExpand(message.id)}
                className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors touch-manipulation ${!message.isRead ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
                  }`}
              >
                {/* Checkbox - Hidden on mobile */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMessageSelection(message.id);
                  }}
                  className="hidden sm:block flex-shrink-0 mt-1"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 transition-colors ${selectedMessages.includes(message.id)
                      ? "bg-[#6E8CB9] border-[#6E8CB9]"
                      : "border-gray-300 dark:border-gray-600"
                      }`}
                  />
                </button>

                {/* Icon */}
                <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${getIconBgColor(message.type)}`}>
                  {getMessageIcon(message.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Sender Row */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <span className={`text-sm sm:text-base font-semibold truncate ${!message.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                      {message.sender}
                    </span>
                    {message.role && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs rounded">
                        {message.role}
                      </span>
                    )}
                    {message.course && (
                      <span className="px-1.5 sm:px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs rounded font-medium">
                        {message.course}
                      </span>
                    )}
                  </div>

                  {/* Subject */}
                  <p className={`mt-1 text-sm sm:text-base line-clamp-1 ${!message.isRead ? "font-semibold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300"}`}>
                    {message.subject}
                  </p>

                  {/* Preview (only when collapsed) */}
                  {!isExpanded && (
                    <p className="mt-0.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {message.preview}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mt-2 overflow-x-auto hide-scrollbar">
                    {message.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 sm:px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[10px] sm:text-xs rounded whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Side - Time & Actions */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1.5 sm:gap-2">
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {message.time}
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Clock className="hidden sm:block w-4 h-4 text-gray-400" />
                    {message.hasAttachment && (
                      <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    )}
                    <Star
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${message.isStarred
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300 dark:text-gray-600"
                        }`}
                    />
                    {!message.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#6E8CB9]" />
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Message Content */}
              {isExpanded && (
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100 dark:border-gray-800">
                  {/* Message Meta */}
                  <div className="py-2 sm:py-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                    {message.date}
                  </div>

                  {/* Full Message Content */}
                  <div className="py-3 sm:py-4 text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {message.fullContent}
                  </div>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Attachments ({message.attachments.length})
                      </p>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                        {message.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors touch-manipulation"
                          >
                            <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">
                              {attachment.name}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                              ({attachment.size})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-800 mt-3 sm:mt-4">
                    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors text-xs sm:text-sm touch-manipulation">
                      <Reply className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Reply
                    </button>
                    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm touch-manipulation">
                      <Forward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Forward</span>
                    </button>
                    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-xs sm:text-sm touch-manipulation">
                      <Archive className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Archive</span>
                    </button>
                    <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-xs sm:text-sm sm:ml-auto touch-manipulation">
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
