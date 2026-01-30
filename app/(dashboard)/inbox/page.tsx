import { Mail, Star, Clock, Paperclip } from "lucide-react";

export default function InboxPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Inbox
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Messages from instructors and classmates.
          </p>
        </div>
        <button className="px-4 py-2 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors">
          Compose
        </button>
      </div>

      {/* Messages List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-200 dark:divide-gray-800">
        {MOCK_MESSAGES.map((message) => (
          <MessageRow key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "Dr. Smith",
    subject: "Assignment 3 Feedback",
    preview: "Great work on your recent submission. I wanted to highlight a few areas...",
    time: "10:30 AM",
    isRead: false,
    isStarred: true,
    hasAttachment: true,
  },
  {
    id: "2",
    sender: "Prof. Johnson",
    subject: "Upcoming Office Hours Change",
    preview: "Please note that my office hours for next week will be moved to...",
    time: "Yesterday",
    isRead: true,
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: "3",
    sender: "Study Group - CS201",
    subject: "Meeting tomorrow at 3pm",
    preview: "Hey everyone, just a reminder that we're meeting tomorrow to review...",
    time: "Yesterday",
    isRead: true,
    isStarred: false,
    hasAttachment: false,
  },
  {
    id: "4",
    sender: "Academic Advisor",
    subject: "Course Registration Reminder",
    preview: "Registration for Spring semester opens next Monday. Please review...",
    time: "2 days ago",
    isRead: true,
    isStarred: true,
    hasAttachment: true,
  },
  {
    id: "5",
    sender: "Library Services",
    subject: "Book Due Soon",
    preview: "This is a reminder that 'Data Structures and Algorithms' is due...",
    time: "3 days ago",
    isRead: true,
    isStarred: false,
    hasAttachment: false,
  },
];

function MessageRow({ message }: { message: Message }) {
  return (
    <div
      className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors ${
        !message.isRead ? "bg-[#6E8CB9]/5" : ""
      }`}
    >
      {/* Star */}
      <button className="flex-shrink-0">
        <Star
          className={`w-5 h-5 ${
            message.isStarred
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      </button>

      {/* Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#6E8CB9]/20 flex items-center justify-center">
        <Mail className="w-5 h-5 text-[#6E8CB9]" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`font-medium ${
              !message.isRead
                ? "text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {message.sender}
          </span>
          {message.hasAttachment && (
            <Paperclip className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <p
          className={`text-sm ${
            !message.isRead
              ? "font-medium text-gray-900 dark:text-white"
              : "text-gray-600 dark:text-gray-400"
          }`}
        >
          {message.subject}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
          {message.preview}
        </p>
      </div>

      {/* Time */}
      <div className="flex-shrink-0 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        <Clock className="w-4 h-4" />
        <span>{message.time}</span>
      </div>
    </div>
  );
}

