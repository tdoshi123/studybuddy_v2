"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Send, Search, Users, User, MessageCircle, Paperclip, Smile, MoreVertical, Phone, Video, UserCircle } from "lucide-react";
import { getCourse } from "@/lib/constants/courses";

type ChatType = "class" | "private";
type UserRole = "teacher" | "student" | "parent";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Chat {
  id: string;
  type: ChatType;
  name: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
  role?: UserRole;
}

const getMockChats = (courseName: string, teacherName: string): Chat[] => [
  {
    id: "class",
    type: "class",
    name: courseName,
    participants: ["All Students", teacherName],
    lastMessage: "Don't forget the homework is due tomorrow!",
    lastMessageTime: "2 hours ago",
    unreadCount: 3,
  },
  {
    id: "teacher",
    type: "private",
    name: teacherName,
    participants: ["You", teacherName],
    lastMessage: "Great work on your last assignment!",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    role: "teacher",
  },
  {
    id: "parent1",
    type: "private",
    name: `${teacherName} & Your Parents`,
    participants: ["You", teacherName, "Mom", "Dad"],
    lastMessage: "We'd like to schedule a parent-teacher conference",
    lastMessageTime: "2 days ago",
    unreadCount: 1,
    role: "parent",
  },
  {
    id: "student1",
    type: "private",
    name: "Sarah Martinez",
    participants: ["You", "Sarah Martinez"],
    lastMessage: "Can you help me with the math homework?",
    lastMessageTime: "3 days ago",
    unreadCount: 0,
    role: "student",
  },
  {
    id: "student2",
    type: "private",
    name: "Alex Chen",
    participants: ["You", "Alex Chen"],
    lastMessage: "Want to work on the project together?",
    lastMessageTime: "1 week ago",
    unreadCount: 0,
    role: "student",
  },
];

const getMockMessages = (teacherName: string): Record<string, Message[]> => ({
  class: [
    {
      id: "1",
      senderId: "teacher",
      senderName: teacherName,
      senderRole: "teacher",
      content: "Good morning class! Today we'll be reviewing fractions. Make sure you've completed yesterday's worksheet.",
      timestamp: "9:00 AM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "student1",
      senderName: "Sarah Martinez",
      senderRole: "student",
      content: "Will we have a quiz this week?",
      timestamp: "9:15 AM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "teacher",
      senderName: teacherName,
      senderRole: "teacher",
      content: "Yes, the quiz will be on Friday. It will cover chapters 4 and 5.",
      timestamp: "9:20 AM",
      isRead: true,
    },
    {
      id: "4",
      senderId: "student2",
      senderName: "Alex Chen",
      senderRole: "student",
      content: "Can we use calculators on the quiz?",
      timestamp: "9:25 AM",
      isRead: true,
    },
    {
      id: "5",
      senderId: "teacher",
      senderName: teacherName,
      senderRole: "teacher",
      content: "No calculators for this quiz. But you can use scratch paper for your work!",
      timestamp: "9:30 AM",
      isRead: true,
    },
    {
      id: "6",
      senderId: "current",
      senderName: "You",
      senderRole: "student",
      content: "Thank you! I'll make sure to study chapters 4 and 5.",
      timestamp: "10:00 AM",
      isRead: true,
    },
  ],
  teacher: [
    {
      id: "1",
      senderId: "teacher",
      senderName: teacherName,
      senderRole: "teacher",
      content: "Hi! I wanted to talk to you about your recent test score.",
      timestamp: "Yesterday, 2:30 PM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "current",
      senderName: "You",
      senderRole: "student",
      content: "Yes, Mrs. Johnson?",
      timestamp: "Yesterday, 2:45 PM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "teacher",
      senderName: teacherName,
      senderRole: "teacher",
      content: "Great work on your last assignment! You got 98 out of 100. Your understanding of fractions has really improved. Keep up the excellent work!",
      timestamp: "Yesterday, 3:00 PM",
      isRead: true,
    },
  ],
  parent1: [
    {
      id: "1",
      senderId: "teacher",
      senderName: teacherName,
      senderRole: "teacher",
      content: "Hello! I hope you're all doing well. I wanted to reach out about scheduling a parent-teacher conference to discuss progress this semester.",
      timestamp: "2 days ago, 4:00 PM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "parent",
      senderName: "Mom",
      senderRole: "parent",
      content: "Thank you for reaching out! We'd be happy to meet. What times work best for you?",
      timestamp: "2 days ago, 5:30 PM",
      isRead: false,
    },
  ],
  student1: [
    {
      id: "1",
      senderId: "student1",
      senderName: "Sarah Martinez",
      senderRole: "student",
      content: "Hey! Can you help me with the math homework? I'm stuck on problem 5.",
      timestamp: "3 days ago, 6:00 PM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "current",
      senderName: "You",
      senderRole: "student",
      content: "Sure! Which part are you having trouble with?",
      timestamp: "3 days ago, 6:15 PM",
      isRead: true,
    },
  ],
  student2: [
    {
      id: "1",
      senderId: "student2",
      senderName: "Alex Chen",
      senderRole: "student",
      content: "Want to work on the project together?",
      timestamp: "1 week ago, 3:00 PM",
      isRead: true,
    },
  ],
});

export default function CourseMessagesPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = getCourse(courseId);

  const [activeChat, setActiveChat] = useState<string>("class");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const MOCK_CHATS = getMockChats(course.name, course.teacher);
  const MOCK_MESSAGES = getMockMessages(course.teacher);

  const activeChatData = MOCK_CHATS.find((chat) => chat.id === activeChat);
  const messages = MOCK_MESSAGES[activeChat] || [];

  const filteredChats = MOCK_CHATS.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message to the backend
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "teacher":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "student":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "parent":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    }
  };

  const getRoleInitial = (role?: UserRole, name?: string) => {
    if (role === "teacher") return "T";
    if (role === "parent") return "P";
    return name ? name.charAt(0).toUpperCase() : "S";
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-4">
      {/* Left Sidebar - Chat List */}
      <div className="w-80 flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Messages
          </h2>

          {/* Search */}
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
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-800 ${activeChat === chat.id ? "bg-blue-50 dark:bg-blue-900/10" : ""
                }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold flex-shrink-0 ${chat.type === "class"
                  ? "bg-[#6E8CB9] text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}>
                  {chat.type === "class" ? (
                    <Users className="w-6 h-6" />
                  ) : (
                    <span>{getRoleInitial(chat.role, chat.name)}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <div className="mt-1">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#6E8CB9] text-white">
                        {chat.unreadCount} new
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Active Chat */}
      <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden">
        {activeChatData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold ${activeChatData.type === "class"
                  ? "bg-[#6E8CB9] text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  }`}>
                  {activeChatData.type === "class" ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    <span>{getRoleInitial(activeChatData.role, activeChatData.name)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {activeChatData.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activeChatData.participants.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.senderId === "current";

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
                  >
                    {/* Avatar */}
                    {!isCurrentUser && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <UserCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}

                    <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} max-w-[70%]`}>
                      {/* Sender Name & Role */}
                      {!isCurrentUser && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {message.senderName}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${getRoleColor(message.senderRole)}`}>
                            {message.senderRole}
                          </span>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2 rounded-2xl ${isCurrentUser
                          ? "bg-[#6E8CB9] text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                          }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>

                      {/* Timestamp */}
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-end gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
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
                    className="w-full px-4 py-2 pr-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent resize-none"
                  />
                  <button className="absolute right-2 bottom-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!messageInput.trim()}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
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
  );
}
