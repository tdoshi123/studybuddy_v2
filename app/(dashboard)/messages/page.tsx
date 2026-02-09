"use client";

import { useState } from "react";
import {
  Send, Search, Users, User, MessageCircle, Paperclip, Smile,
  MoreVertical, Phone, Video, UserCircle, Plus, Settings,
  Filter, Star, X, Edit2, Check, UserPlus, UserMinus, ArrowLeft
} from "lucide-react";

type ConversationType = "class" | "dm" | "study-group" | "teacher";
type FilterType = "all" | "class" | "dm" | "study-group" | "teacher" | "unread" | "favorites";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  type: ConversationType;
  name: string;
  courseName?: string;
  courseColor?: string;
  participants: string[];
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isFavorite: boolean;
  isOnline?: boolean;
}

// Mock conversations data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "class-math",
    type: "class",
    name: "Math - Period 3 Class Chat",
    courseName: "Math",
    courseColor: "#6E8CB9",
    participants: ["Mrs. Johnson", "25 Students"],
    lastMessage: "Don't forget the quiz on Friday!",
    lastMessageTime: "10 min ago",
    unreadCount: 3,
    isFavorite: true,
  },
  {
    id: "class-ela",
    type: "class",
    name: "English Language Arts Class Chat",
    courseName: "English",
    courseColor: "#4A7C59",
    participants: ["Mr. Thompson", "28 Students"],
    lastMessage: "Book report presentations start Monday",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    isFavorite: false,
  },
  {
    id: "class-science",
    type: "class",
    name: "Science - Period 4 Class Chat",
    courseName: "Science",
    courseColor: "#8B5A2B",
    participants: ["Ms. Garcia", "24 Students"],
    lastMessage: "Lab report due next Wednesday",
    lastMessageTime: "2h ago",
    unreadCount: 1,
    isFavorite: true,
  },
  {
    id: "teacher-johnson",
    type: "teacher",
    name: "Mrs. Johnson",
    courseName: "Math",
    courseColor: "#6E8CB9",
    participants: ["Mrs. Johnson", "You"],
    lastMessage: "Great work on your test! 98/100",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    isFavorite: false,
    isOnline: true,
  },
  {
    id: "teacher-thompson",
    type: "teacher",
    name: "Mr. Thompson",
    courseName: "English",
    courseColor: "#4A7C59",
    participants: ["Mr. Thompson", "You"],
    lastMessage: "Can we schedule a time to discuss your essay?",
    lastMessageTime: "2 days ago",
    unreadCount: 1,
    isFavorite: false,
    isOnline: false,
  },
  {
    id: "dm-sarah",
    type: "dm",
    name: "Sarah Martinez",
    participants: ["Sarah Martinez", "You"],
    lastMessage: "Thanks for helping me with the homework!",
    lastMessageTime: "5 min ago",
    unreadCount: 2,
    isFavorite: true,
    isOnline: true,
  },
  {
    id: "dm-alex",
    type: "dm",
    name: "Alex Chen",
    participants: ["Alex Chen", "You"],
    lastMessage: "Want to work on the project together?",
    lastMessageTime: "30 min ago",
    unreadCount: 0,
    isFavorite: false,
    isOnline: true,
  },
  {
    id: "dm-emma",
    type: "dm",
    name: "Emma Wilson",
    participants: ["Emma Wilson", "You"],
    lastMessage: "See you at lunch!",
    lastMessageTime: "1h ago",
    unreadCount: 0,
    isFavorite: false,
    isOnline: false,
  },
  {
    id: "study-solar",
    type: "study-group",
    name: "Solar System Project Group",
    courseName: "Science",
    courseColor: "#8B5A2B",
    participants: ["You", "Sarah", "Alex", "Maya", "Jordan"],
    lastMessage: "Maya: I finished my poster!",
    lastMessageTime: "20 min ago",
    unreadCount: 5,
    isFavorite: true,
  },
  {
    id: "study-math",
    type: "study-group",
    name: "Math Study Group",
    courseName: "Math",
    courseColor: "#6E8CB9",
    participants: ["You", "Emma", "Lucas", "Olivia"],
    lastMessage: "Lucas: Meeting tomorrow at library?",
    lastMessageTime: "3h ago",
    unreadCount: 0,
    isFavorite: false,
  },
  {
    id: "study-reading",
    type: "study-group",
    name: "Book Club - Charlotte's Web",
    courseName: "English",
    courseColor: "#4A7C59",
    participants: ["You", "Sarah", "Emma", "Sophia", "Liam"],
    lastMessage: "Sophia: What did you think of chapter 8?",
    lastMessageTime: "1 day ago",
    unreadCount: 0,
    isFavorite: false,
  },
];

// Mock messages
const MOCK_MESSAGES: Record<string, Message[]> = {
  "dm-sarah": [
    {
      id: "1",
      senderId: "sarah",
      senderName: "Sarah Martinez",
      content: "Hey! Can you help me with problem 5 on the math homework?",
      timestamp: "2:30 PM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "current",
      senderName: "You",
      content: "Sure! Which part are you stuck on?",
      timestamp: "2:32 PM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "sarah",
      senderName: "Sarah Martinez",
      content: "The fraction part where we have to find the common denominator",
      timestamp: "2:35 PM",
      isRead: true,
    },
    {
      id: "4",
      senderId: "current",
      senderName: "You",
      content: "Okay! So for 3/4 + 2/5, you need to find the LCD which is 20. Then convert: 15/20 + 8/20 = 23/20",
      timestamp: "2:38 PM",
      isRead: true,
    },
    {
      id: "5",
      senderId: "sarah",
      senderName: "Sarah Martinez",
      content: "Thanks for helping me with the homework!",
      timestamp: "2:45 PM",
      isRead: false,
    },
    {
      id: "6",
      senderId: "current",
      senderName: "You",
      content: "No problem! Good luck!",
      timestamp: "2:47 PM",
      isRead: true,
    },
  ],
  "class-math": [
    {
      id: "1",
      senderId: "teacher",
      senderName: "Mrs. Johnson",
      content: "Good morning everyone! Today we'll be reviewing for Friday's quiz on fractions.",
      timestamp: "9:00 AM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "student1",
      senderName: "Alex Chen",
      content: "Will the quiz cover all of chapter 5?",
      timestamp: "9:05 AM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "teacher",
      senderName: "Mrs. Johnson",
      content: "Yes, chapters 4 and 5. Make sure to review your worksheets!",
      timestamp: "9:07 AM",
      isRead: true,
    },
    {
      id: "4",
      senderId: "student2",
      senderName: "Emma Wilson",
      content: "Can we use calculators?",
      timestamp: "9:10 AM",
      isRead: true,
    },
    {
      id: "5",
      senderId: "teacher",
      senderName: "Mrs. Johnson",
      content: "No calculators for this quiz, but you can use scratch paper. Show your work!",
      timestamp: "9:12 AM",
      isRead: true,
    },
    {
      id: "6",
      senderId: "current",
      senderName: "You",
      content: "Thanks Mrs. Johnson! I'll make sure to study chapters 4 and 5.",
      timestamp: "9:15 AM",
      isRead: true,
    },
    {
      id: "7",
      senderId: "teacher",
      senderName: "Mrs. Johnson",
      content: "Don't forget the quiz on Friday!",
      timestamp: "10:45 AM",
      isRead: false,
    },
  ],
  "class-ela": [
    {
      id: "1",
      senderId: "teacher",
      senderName: "Mr. Thompson",
      content: "Hello class! Reminder that book report presentations start next Monday.",
      timestamp: "8:30 AM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "student1",
      senderName: "Sophia Lee",
      content: "How long should our presentation be?",
      timestamp: "8:35 AM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "teacher",
      senderName: "Mr. Thompson",
      content: "Aim for 5-7 minutes. Make sure to cover the main characters, plot, and your favorite part!",
      timestamp: "8:37 AM",
      isRead: true,
    },
    {
      id: "4",
      senderId: "student2",
      senderName: "Liam Brown",
      content: "Can we bring visual aids like posters?",
      timestamp: "8:40 AM",
      isRead: true,
    },
    {
      id: "5",
      senderId: "teacher",
      senderName: "Mr. Thompson",
      content: "Absolutely! Visual aids are encouraged. Get creative!",
      timestamp: "8:42 AM",
      isRead: true,
    },
  ],
  "class-science": [
    {
      id: "1",
      senderId: "teacher",
      senderName: "Ms. Garcia",
      content: "Good afternoon! Lab report for the ecosystem experiment is due next Wednesday.",
      timestamp: "11:15 AM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "student1",
      senderName: "Jordan Kim",
      content: "Should we type it or can it be handwritten?",
      timestamp: "11:20 AM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "teacher",
      senderName: "Ms. Garcia",
      content: "Either is fine, but if handwritten, make sure it's legible! Include all diagrams.",
      timestamp: "11:22 AM",
      isRead: true,
    },
    {
      id: "4",
      senderId: "current",
      senderName: "You",
      content: "Thanks! I'll get started on it this weekend.",
      timestamp: "11:25 AM",
      isRead: true,
    },
  ],
  "teacher-johnson": [
    {
      id: "1",
      senderId: "teacher",
      senderName: "Mrs. Johnson",
      content: "Hi! I wanted to talk to you about your recent test.",
      timestamp: "Yesterday, 3:00 PM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "current",
      senderName: "You",
      content: "Oh, how did I do?",
      timestamp: "Yesterday, 3:15 PM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "teacher",
      senderName: "Mrs. Johnson",
      content: "Great work on your test! You got 98 out of 100. Your understanding of fractions has really improved!",
      timestamp: "Yesterday, 3:20 PM",
      isRead: true,
    },
    {
      id: "4",
      senderId: "current",
      senderName: "You",
      content: "Thank you so much! I've been studying really hard.",
      timestamp: "Yesterday, 3:25 PM",
      isRead: true,
    },
    {
      id: "5",
      senderId: "teacher",
      senderName: "Mrs. Johnson",
      content: "It shows! Keep up the excellent work. Let me know if you need any help preparing for the next quiz.",
      timestamp: "Yesterday, 3:30 PM",
      isRead: true,
    },
  ],
  "teacher-thompson": [
    {
      id: "1",
      senderId: "teacher",
      senderName: "Mr. Thompson",
      content: "Hello! I read your essay draft and wanted to give you some feedback.",
      timestamp: "2 days ago, 2:00 PM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "current",
      senderName: "You",
      content: "Yes, I'd love to hear your thoughts!",
      timestamp: "2 days ago, 2:30 PM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "teacher",
      senderName: "Mr. Thompson",
      content: "Your introduction is strong, but I think you could expand on your main points. Can we schedule a time to discuss your essay?",
      timestamp: "2 days ago, 2:45 PM",
      isRead: false,
    },
  ],
  "dm-alex": [
    {
      id: "1",
      senderId: "alex",
      senderName: "Alex Chen",
      content: "Hey! Want to work on the science project together?",
      timestamp: "30 min ago",
      isRead: true,
    },
    {
      id: "2",
      senderId: "current",
      senderName: "You",
      content: "Sure! When are you free?",
      timestamp: "25 min ago",
      isRead: true,
    },
    {
      id: "3",
      senderId: "alex",
      senderName: "Alex Chen",
      content: "How about Saturday afternoon at the library?",
      timestamp: "20 min ago",
      isRead: true,
    },
    {
      id: "4",
      senderId: "current",
      senderName: "You",
      content: "Perfect! 2 PM work for you?",
      timestamp: "15 min ago",
      isRead: true,
    },
    {
      id: "5",
      senderId: "alex",
      senderName: "Alex Chen",
      content: "Sounds good! See you then!",
      timestamp: "10 min ago",
      isRead: true,
    },
  ],
  "dm-emma": [
    {
      id: "1",
      senderId: "emma",
      senderName: "Emma Wilson",
      content: "Did you understand today's math lesson? I'm so confused 😅",
      timestamp: "1h ago",
      isRead: true,
    },
    {
      id: "2",
      senderId: "current",
      senderName: "You",
      content: "Yeah it was tricky! Which part?",
      timestamp: "55 min ago",
      isRead: true,
    },
    {
      id: "3",
      senderId: "emma",
      senderName: "Emma Wilson",
      content: "The whole denominator thing. Can you explain it at lunch?",
      timestamp: "50 min ago",
      isRead: true,
    },
    {
      id: "4",
      senderId: "current",
      senderName: "You",
      content: "For sure! See you at lunch!",
      timestamp: "45 min ago",
      isRead: true,
    },
  ],
  "study-solar": [
    {
      id: "1",
      senderId: "sarah",
      senderName: "Sarah Martinez",
      content: "Hey everyone! How's everyone doing with their planets?",
      timestamp: "2:00 PM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "alex",
      senderName: "Alex Chen",
      content: "I picked Jupiter! Working on the poster now.",
      timestamp: "2:05 PM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "maya",
      senderName: "Maya Patel",
      content: "I have Mars! Just finished my research.",
      timestamp: "2:10 PM",
      isRead: true,
    },
    {
      id: "4",
      senderId: "current",
      senderName: "You",
      content: "I'm doing Saturn! The rings are so interesting!",
      timestamp: "2:15 PM",
      isRead: true,
    },
    {
      id: "5",
      senderId: "jordan",
      senderName: "Jordan Smith",
      content: "Neptune here! Did you guys know it's the windiest planet?",
      timestamp: "2:20 PM",
      isRead: true,
    },
    {
      id: "6",
      senderId: "maya",
      senderName: "Maya Patel",
      content: "I finished my poster!",
      timestamp: "2:30 PM",
      isRead: false,
    },
    {
      id: "7",
      senderId: "sarah",
      senderName: "Sarah Martinez",
      content: "That's awesome Maya! Can you share a pic?",
      timestamp: "2:32 PM",
      isRead: false,
    },
  ],
  "study-math": [
    {
      id: "1",
      senderId: "lucas",
      senderName: "Lucas Brown",
      content: "Hey team! Ready for Friday's quiz?",
      timestamp: "3:00 PM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "emma",
      senderName: "Emma Wilson",
      content: "Not really 😬 Can we meet to study?",
      timestamp: "3:05 PM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "olivia",
      senderName: "Olivia Davis",
      content: "I'm free tomorrow after school!",
      timestamp: "3:10 PM",
      isRead: true,
    },
    {
      id: "4",
      senderId: "current",
      senderName: "You",
      content: "Same! Library at 3:30?",
      timestamp: "3:12 PM",
      isRead: true,
    },
    {
      id: "5",
      senderId: "lucas",
      senderName: "Lucas Brown",
      content: "Meeting tomorrow at library?",
      timestamp: "3:15 PM",
      isRead: true,
    },
  ],
  "study-reading": [
    {
      id: "1",
      senderId: "sophia",
      senderName: "Sophia Lee",
      content: "Has everyone finished chapter 8 of Charlotte's Web?",
      timestamp: "Yesterday, 4:00 PM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "liam",
      senderName: "Liam Brown",
      content: "Yes! It was so good!",
      timestamp: "Yesterday, 4:15 PM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "sarah",
      senderName: "Sarah Martinez",
      content: "I cried at the end 😢",
      timestamp: "Yesterday, 4:20 PM",
      isRead: true,
    },
    {
      id: "4",
      senderId: "current",
      senderName: "You",
      content: "Me too! Charlotte was such a good friend.",
      timestamp: "Yesterday, 4:25 PM",
      isRead: true,
    },
    {
      id: "5",
      senderId: "sophia",
      senderName: "Sophia Lee",
      content: "What did you think of chapter 8?",
      timestamp: "Yesterday, 4:30 PM",
      isRead: true,
    },
  ],
};

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<string>("dm-sarah");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [messageInput, setMessageInput] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const activeConv = MOCK_CONVERSATIONS.find((c) => c.id === activeConversation);
  const messages = MOCK_MESSAGES[activeConversation] || [];

  // Filter conversations
  const filteredConversations = MOCK_CONVERSATIONS.filter((conv) => {
    const matchesSearch =
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (conv.courseName && conv.courseName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conv.unreadCount > 0) ||
      (filter === "favorites" && conv.isFavorite) ||
      conv.type === filter;

    return matchesSearch && matchesFilter;
  });

  // Get counts for filters
  const getCounts = () => {
    return {
      all: MOCK_CONVERSATIONS.length,
      class: MOCK_CONVERSATIONS.filter((c) => c.type === "class").length,
      dm: MOCK_CONVERSATIONS.filter((c) => c.type === "dm").length,
      "study-group": MOCK_CONVERSATIONS.filter((c) => c.type === "study-group").length,
      teacher: MOCK_CONVERSATIONS.filter((c) => c.type === "teacher").length,
      unread: MOCK_CONVERSATIONS.filter((c) => c.unreadCount > 0).length,
      favorites: MOCK_CONVERSATIONS.filter((c) => c.isFavorite).length,
    };
  };

  const counts = getCounts();

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const getConversationIcon = (conv: Conversation) => {
    switch (conv.type) {
      case "class":
        return <Users className="w-5 h-5" />;
      case "teacher":
        return <User className="w-5 h-5" />;
      case "dm":
        return <MessageCircle className="w-5 h-5" />;
      case "study-group":
        return <Users className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: ConversationType) => {
    switch (type) {
      case "class":
        return "Class Chat";
      case "teacher":
        return "Teacher";
      case "dm":
        return "Direct Message";
      case "study-group":
        return "Study Group";
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)] flex flex-col gap-4">
      {/* Header with Stats - Hide on mobile when chat is open */}
      <div className={`flex items-center justify-between ${showChatOnMobile ? 'hidden md:flex' : 'flex'}`}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {counts.unread} unread • {counts.all} total conversations
          </p>
        </div>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors text-sm touch-manipulation"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Group</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
        {/* Left Sidebar - Conversations List */}
        <div className={`${showChatOnMobile ? 'hidden md:flex' : 'flex'} w-full md:w-96 md:flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex-col overflow-hidden`}>
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
              {filter !== "all" && (
                <span className="px-2 py-0.5 bg-[#6E8CB9] text-white text-xs rounded-full">
                  Active
                </span>
              )}
            </button>

            {/* Filter Options */}
            {showFilters && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${filter === "all"
                    ? "bg-[#6E8CB9] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  All ({counts.all})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${filter === "unread"
                    ? "bg-[#6E8CB9] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  Unread ({counts.unread})
                </button>
                <button
                  onClick={() => setFilter("favorites")}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${filter === "favorites"
                    ? "bg-[#6E8CB9] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  <Star className="w-3 h-3 inline mr-1" />
                  Favorites ({counts.favorites})
                </button>
                <button
                  onClick={() => setFilter("class")}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${filter === "class"
                    ? "bg-[#6E8CB9] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  Classes ({counts.class})
                </button>
                <button
                  onClick={() => setFilter("dm")}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${filter === "dm"
                    ? "bg-[#6E8CB9] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  DMs ({counts.dm})
                </button>
                <button
                  onClick={() => setFilter("study-group")}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${filter === "study-group"
                    ? "bg-[#6E8CB9] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  Study Groups ({counts["study-group"]})
                </button>
                <button
                  onClick={() => setFilter("teacher")}
                  className={`px-3 py-2 text-xs rounded-lg transition-colors ${filter === "teacher"
                    ? "bg-[#6E8CB9] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                >
                  Teachers ({counts.teacher})
                </button>
              </div>
            )}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No conversations found
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setActiveConversation(conv.id);
                    setShowChatOnMobile(true);
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 touch-manipulation ${activeConversation === conv.id ? "bg-blue-50 dark:bg-blue-900/10" : ""
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar/Icon */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0 relative"
                      style={{ backgroundColor: conv.courseColor || "#6E8CB9" }}
                    >
                      {getConversationIcon(conv)}
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {conv.name}
                          </h3>
                          {conv.isFavorite && (
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      {conv.courseName && (
                        <div className="mb-1">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: conv.courseColor }}
                          >
                            {conv.courseName}
                          </span>
                        </div>
                      )}

                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mb-1">
                        {conv.lastMessage}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {getTypeLabel(conv.type)}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#6E8CB9] text-white">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side - Active Chat */}
        <div className={`${showChatOnMobile ? 'flex' : 'hidden md:flex'} flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex-col overflow-hidden`}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {/* Back button for mobile */}
                  <button
                    onClick={() => setShowChatOnMobile(false)}
                    className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white relative flex-shrink-0"
                    style={{ backgroundColor: activeConv.courseColor || "#6E8CB9" }}
                  >
                    {getConversationIcon(activeConv)}
                    {activeConv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                        {activeConv.name}
                      </h3>
                      {activeConv.isFavorite && (
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {activeConv.participants.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {(activeConv.type === "dm" || activeConv.type === "teacher") && (
                    <>
                      <button className="hidden sm:flex p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation" aria-label="Call">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="hidden sm:flex p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation" aria-label="Video call">
                        <Video className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {activeConv.type === "study-group" && (
                    <button className="hidden sm:flex p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation" aria-label="Group settings">
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation" aria-label="More options">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = message.senderId === "current";

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                      >
                        {!isCurrentUser && (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <UserCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}

                        <div
                          className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"
                            } max-w-[85%] sm:max-w-[75%] md:max-w-[70%]`}
                        >
                          {!isCurrentUser && (
                            <span className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                              {message.senderName}
                            </span>
                          )}

                          <div
                            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl ${isCurrentUser
                              ? "bg-[#6E8CB9] text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                              }`}
                          >
                            <p className="text-sm break-words">{message.content}</p>
                          </div>

                          <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-end gap-2">
                  <button className="hidden sm:flex p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-manipulation" aria-label="Attach file">
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type your message..."
                      rows={1}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent resize-none"
                    />
                    <button className="absolute right-2 bottom-2.5 sm:bottom-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-manipulation" aria-label="Add emoji">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    className="p-2.5 sm:p-3 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                    disabled={!messageInput.trim()}
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-xl border border-gray-200 dark:border-gray-800 w-full max-w-md p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Study Group
              </h2>
              <button
                onClick={() => setShowCreateGroup(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., History Study Group"
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Course (Optional)
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent">
                  <option value="">No specific course</option>
                  <option value="math">Math - Period 3</option>
                  <option value="ela">English Language Arts</option>
                  <option value="science">Science - Period 4</option>
                  <option value="social">Social Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Add Members
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2">
                  {["Sarah Martinez", "Alex Chen", "Emma Wilson", "Lucas Brown", "Olivia Davis"].map(
                    (name) => (
                      <label
                        key={name}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-[#6E8CB9] rounded focus:ring-2 focus:ring-[#6E8CB9]"
                        />
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">{name}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Creating group...");
                    setShowCreateGroup(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors"
                >
                  Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
