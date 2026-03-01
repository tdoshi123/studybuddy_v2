"use client";

import { useState } from "react";
import {
  Send,
  Search,
  Megaphone,
  Users,
  MessageCircle,
  Paperclip,
  Star,
  Reply,
  Forward,
  Trash2,
  Archive,
  X,
  ChevronLeft,
  Download,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageType = "announcement" | "teacher" | "student";
type FilterType  = "all" | "announcements" | "teachers" | "students";

interface Message {
  id: string;
  type: MessageType;
  sender: string;
  initials: string;
  avatarColor: string;
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

// ─── Mock data ────────────────────────────────────────────────────────────────

const MESSAGES: Message[] = [
  {
    id: "1",
    type: "announcement",
    sender: "Principal's Office",
    initials: "PO",
    avatarColor: "#1e3a8a",
    role: "Administration",
    subject: "School Picture Day — February 10th",
    preview: "School picture day is scheduled for Tuesday, February 10th. All students should wear their best...",
    fullContent: `Dear Students and Families,

School picture day is scheduled for Tuesday, February 10th!

Important Information:
• Pictures will be taken during first period
• Please wear your best school-appropriate clothing
• Retake day will be scheduled for March 3rd

Picture Package Information:
– Basic package: $15 (includes 2 sheets)
– Deluxe package: $25 (includes 4 sheets + digital copy)
– Premium package: $40 (includes 6 sheets + digital copy + yearbook photo)

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
    initials: "MJ",
    avatarColor: "#7c3aed",
    role: "Math Teacher",
    course: "Math",
    subject: "Fractions Worksheet Posted — Due Feb 7",
    preview: "Hello students, the Fractions Worksheet has been posted and is due next Friday by the end of class.",
    fullContent: `Hello students,

The Fractions Worksheet has been posted and is due next Friday, February 7th by the end of class.

Assignment Overview:
This worksheet covers adding, subtracting, multiplying, and dividing fractions. Make sure to show all your work!

Requirements:
1. Complete all 20 problems on the worksheet
2. Show your work for each problem
3. Circle your final answers

Tips:
– Remember to find common denominators when adding/subtracting
– Simplify your answers to lowest terms

If you need extra help, I'm available during lunch on Tuesday and Thursday in Room 204.

Best,
Mrs. Johnson`,
    time: "2h ago",
    date: "February 1, 2026 at 8:15 AM",
    tags: ["Assignment", "Due Soon"],
    isRead: false,
    isStarred: false,
    hasAttachment: true,
    attachments: [{ name: "Fractions_Worksheet.pdf", size: "856 KB" }],
  },
  {
    id: "3",
    type: "student",
    sender: "Sarah Martinez",
    initials: "SM",
    avatarColor: "#0f766e",
    course: "Science",
    subject: "Study Group for Solar System Project",
    preview: "Hey! I'm organizing a study group to work on the Solar System project together. Would you like to join?",
    fullContent: `Hey!

I'm organizing a study group to work on the Solar System project together. Would you like to join?

Details:
– When: Saturday, February 8th from 2–4 PM
– Where: Public Library – Community Room
– What: Work on Solar System projects and share ideas

I've already got 3 friends confirmed. We're planning to help each other with research and compare our planet posters.

My mom can give you a ride if you need one. Let me know if you're interested!

– Sarah`,
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
    initials: "MT",
    avatarColor: "#166534",
    role: "ELA Teacher",
    course: "English",
    subject: "Extra Help Sessions This Week",
    preview: "I'll be offering extra help sessions for anyone who needs assistance with the book report.",
    fullContent: `Dear Students,

I'll be offering extra help sessions this week for anyone who needs assistance with the book report or wants to practice reading skills.

Extra Help Schedule:
– Tuesday: 3:00 PM – 4:00 PM (Room 112)
– Thursday: 3:00 PM – 4:00 PM (Room 112)

Remember, the book report on "Charlotte's Web" is due on February 15th. Make sure to include:
– A summary of the story
– Your favorite character and why
– What you learned from the book
– A colorful cover page with illustrations

Keep up the great work!

Mr. Thompson`,
    time: "2d ago",
    date: "January 30, 2026 at 11:00 AM",
    tags: ["Extra Help"],
    isRead: true,
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: "5",
    type: "announcement",
    sender: "Athletic Department",
    initials: "AD",
    avatarColor: "#b45309",
    role: "Administration",
    subject: "Spring Sports Sign-Ups Now Open",
    preview: "Spring sports registration is now open. Sign up for baseball, softball, track, or tennis by February 14th.",
    fullContent: `Dear Students,

Spring sports registration is now open! Sign up by February 14th for the following sports:

– Baseball (Grades 4–6)
– Softball (Grades 4–6)
– Track & Field (All grades)
– Tennis (Grades 5–6)

Sign-up sheets are available in the gym and the front office. Physicals must be on file before the first practice.

Questions? Contact Coach Martinez at cmartinez@school.edu.

Go Tigers!`,
    time: "3d ago",
    date: "January 29, 2026 at 2:00 PM",
    tags: ["Sports", "Sign-Up"],
    isRead: true,
    isStarred: false,
    hasAttachment: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_META: Record<MessageType, { label: string; icon: React.ElementType; pill: string }> = {
  announcement: { label: "Announcement", icon: Megaphone,     pill: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"     },
  teacher:      { label: "Teacher",       icon: Users,         pill: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400" },
  student:      { label: "Student",       icon: MessageCircle, pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400" },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const [search, setSearch]       = useState("");
  const [filter, setFilter]       = useState<FilterType>("all");
  const [selected, setSelected]   = useState<string | null>(MESSAGES[0].id);
  const [starred, setStarred]     = useState<Record<string, boolean>>(
    Object.fromEntries(MESSAGES.map((m) => [m.id, m.isStarred]))
  );
  const [read, setRead]           = useState<Record<string, boolean>>(
    Object.fromEntries(MESSAGES.map((m) => [m.id, m.isRead]))
  );
  const [showDetail, setShowDetail] = useState(false); // mobile: show detail panel

  const filtered = MESSAGES.filter((m) => {
    const matchSearch =
      m.sender.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.preview.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "announcements" && m.type === "announcement") ||
      (filter === "teachers"      && m.type === "teacher")      ||
      (filter === "students"      && m.type === "student");
    return matchSearch && matchFilter;
  });

  const unreadCount = MESSAGES.filter((m) => !read[m.id]).length;
  const selectedMsg = MESSAGES.find((m) => m.id === selected) ?? null;

  const openMessage = (id: string) => {
    setSelected(id);
    setRead((r) => ({ ...r, [id]: true }));
    setShowDetail(true);
  };

  const FILTERS: { id: FilterType; label: string; icon: React.ElementType }[] = [
    { id: "all",           label: "All",           icon: Megaphone     },
    { id: "announcements", label: "Announcements", icon: Megaphone     },
    { id: "teachers",      label: "Teachers",      icon: Users         },
    { id: "students",      label: "Students",      icon: MessageCircle },
  ];

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Inbox</h1>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#162554] transition-colors text-sm font-semibold shadow-sm">
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Compose</span>
        </button>
      </div>

      {/* ── Search + Filters ── */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5">
          {FILTERS.map(({ id, label, icon: Icon }) => {
            const count = id === "all"
              ? MESSAGES.length
              : MESSAGES.filter((m) => m.type === id.slice(0, -1) as MessageType || (id === "announcements" && m.type === "announcement")).length;
            const isActive = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#1e3a8a] text-white shadow-sm"
                    : "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:border-[#1e3a8a] hover:text-[#1e3a8a] dark:hover:text-blue-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Two-panel layout ── */}
      <div className="flex gap-4 h-[calc(100vh-280px)] min-h-[520px]">

        {/* ── Message list ── */}
        <div className={`
          flex-shrink-0 w-full md:w-[340px] lg:w-[380px]
          rounded-xl border border-gray-200 dark:border-slate-700
          bg-white dark:bg-slate-900 shadow-sm overflow-y-auto
          ${showDetail ? "hidden md:flex md:flex-col" : "flex flex-col"}
        `}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-16 text-center px-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No messages found</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Try adjusting your search or filter</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-slate-800">
              {filtered.map((m) => {
                const isActive  = selected === m.id;
                const isUnread  = !read[m.id];
                const TypeIcon  = TYPE_META[m.type].icon;
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => openMessage(m.id)}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3.5 transition-all group ${
                        isActive
                          ? "bg-[#1e3a8a]/8 dark:bg-[#1e3a8a]/20 border-l-2 border-[#1e3a8a]"
                          : isUnread
                          ? "bg-blue-50/40 dark:bg-blue-950/10 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                          : "hover:bg-gray-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: m.avatarColor }}
                      >
                        {m.initials}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={`text-sm truncate ${isUnread ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-700 dark:text-gray-300"}`}>
                            {m.sender}
                          </span>
                          <span className="text-[10px] text-gray-400 dark:text-slate-500 flex-shrink-0">{m.time}</span>
                        </div>
                        <p className={`text-xs line-clamp-1 mb-1 ${isUnread ? "font-semibold text-gray-800 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}`}>
                          {m.subject}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 line-clamp-1">{m.preview}</p>

                        {/* Badges row */}
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {m.course && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#1e3a8a]/10 text-[#1e3a8a] dark:text-blue-400">
                              {m.course}
                            </span>
                          )}
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TYPE_META[m.type].pill}`}>
                            {TYPE_META[m.type].label}
                          </span>
                          {m.hasAttachment && <Paperclip className="w-3 h-3 text-gray-400" />}
                          {starred[m.id] && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                          {isUnread && <span className="ml-auto w-2 h-2 rounded-full bg-[#1e3a8a] flex-shrink-0" />}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* ── Detail panel ── */}
        <div className={`
          flex-1 min-w-0 rounded-xl border border-gray-200 dark:border-slate-700
          bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col
          ${showDetail ? "flex" : "hidden md:flex"}
        `}>
          {selectedMsg ? (
            <>
              {/* Detail header */}
              <div className="flex items-start gap-4 px-5 py-4 border-b border-gray-100 dark:border-slate-800">
                {/* Mobile back */}
                <button
                  onClick={() => setShowDetail(false)}
                  className="md:hidden flex-shrink-0 p-1 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Avatar */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: selectedMsg.avatarColor }}
                >
                  {selectedMsg.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
                    {selectedMsg.subject}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedMsg.sender}</span>
                    {selectedMsg.role && (
                      <span className="text-xs text-gray-400 dark:text-slate-500">{selectedMsg.role}</span>
                    )}
                    {selectedMsg.course && (
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-[#1e3a8a]/10 text-[#1e3a8a] dark:text-blue-400">
                        {selectedMsg.course}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{selectedMsg.date}</p>
                </div>

                {/* Star action */}
                <button
                  onClick={() => setStarred((s) => ({ ...s, [selectedMsg.id]: !s[selectedMsg.id] }))}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Star className={`w-5 h-5 ${starred[selectedMsg.id] ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-slate-600"}`} />
                </button>
              </div>

              {/* Tags */}
              {selectedMsg.tags.length > 0 && (
                <div className="flex items-center gap-2 px-5 py-2.5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                  {selectedMsg.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedMsg.fullContent}
                </p>

                {/* Attachments */}
                {selectedMsg.attachments && selectedMsg.attachments.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Attachments ({selectedMsg.attachments.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {selectedMsg.attachments.map((att, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#1e3a8a]/10 flex items-center justify-center flex-shrink-0">
                            <Paperclip className="w-4 h-4 text-[#1e3a8a]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{att.name}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500">{att.size}</p>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-[#1e3a8a] transition-colors flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action bar — only for student messages */}
              {selectedMsg.type === "student" && (
                <div className="flex items-center gap-2 px-5 py-3.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1e3a8a] text-white rounded-xl hover:bg-[#162554] transition-colors text-sm font-semibold">
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm">
                    <Forward className="w-4 h-4" />
                    <span className="hidden sm:inline">Forward</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm">
                    <Archive className="w-4 h-4" />
                    <span className="hidden sm:inline">Archive</span>
                  </button>
                  <button className="ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm">
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center px-8">
              <div className="w-14 h-14 rounded-2xl bg-[#1e3a8a]/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-[#1e3a8a]" />
              </div>
              <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Select a message</p>
              <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Choose a message from the list to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
