"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Mail, 
  MessageSquare, 
  Printer, 
  ChevronDown, 
  Search, 
  User,
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Undo,
  Redo,
} from "lucide-react";

// Mock data for classlist
const CLASSLIST_DATA = [
  { id: 1, name: "Abrams, George", email: "gabrams@purdue.edu", role: "Student" },
  { id: 2, name: "Ahmmed, Jeeaan", email: "jahmmed@purdue.edu", role: "Student" },
  { id: 3, name: "Ahn, Hannah", email: "ahn129@purdue.edu", role: "Student" },
  { id: 4, name: "Ahn, Ryan", email: "ahn144@purdue.edu", role: "Student" },
  { id: 5, name: "Anderson, Emily", email: "eanders@purdue.edu", role: "Student" },
  { id: 6, name: "Baker, Michael", email: "mbaker@purdue.edu", role: "Student" },
  { id: 7, name: "Chen, Sarah", email: "schen@purdue.edu", role: "Student" },
  { id: 8, name: "Davis, James", email: "jdavis@purdue.edu", role: "Student" },
  { id: 9, name: "Martinez, Sofia", email: "smartinez@purdue.edu", role: "Instructor" },
];

type TabType = "all" | "students" | "instructors";

interface EmailRecipient {
  id: number;
  name: string;
  email: string;
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: EmailRecipient[];
}

function EmailComposeModal({ isOpen, onClose, recipients }: EmailModalProps) {
  const [toRecipients, setToRecipients] = useState<EmailRecipient[]>(recipients);
  const [ccField, setCcField] = useState("");
  const [bccField, setBccField] = useState("");
  const [subject, setSubject] = useState("Spring 2026 CGT 41201-001 LEC >");
  const [body, setBody] = useState("");

  useEffect(() => {
    setToRecipients(recipients);
  }, [recipients]);

  const handleRemoveToRecipient = (id: number) => {
    setToRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSend = () => {
    // Here you would integrate with an email service
    console.log("Sending email:", {
      to: toRecipients.map((r) => r.email),
      cc: ccField,
      bcc: bccField,
      subject,
      body,
    });
    alert("Email sent successfully!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop (transparent, just for click-to-close) */}
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 px-6 py-4 rounded-t-lg border-b border-gray-300">
          <h2 className="text-2xl font-normal text-gray-900">Compose New Email</h2>
        </div>

        {/* Form Fields */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* To Field */}
          <div className="flex items-start gap-4">
            <label className="text-[#0066cc] text-sm w-12 text-right pt-2">To</label>
            <div className="flex-1 border border-gray-300 rounded px-3 py-2 min-h-[42px] flex flex-wrap gap-2">
              {toRecipients.map((recipient) => (
                <span
                  key={recipient.id}
                  className="inline-flex items-center gap-1 bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded"
                >
                  &quot;{recipient.name}&quot; &lt;{recipient.email}&gt;
                  <button
                    onClick={() => handleRemoveToRecipient(recipient.id)}
                    className="hover:text-red-600 ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cc Field */}
          <div className="flex items-center gap-4">
            <label className="text-[#0066cc] text-sm w-12 text-right">Cc</label>
            <input
              type="text"
              value={ccField}
              onChange={(e) => setCcField(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
            />
          </div>

          {/* Bcc Field */}
          <div className="flex items-center gap-4">
            <label className="text-[#0066cc] text-sm w-12 text-right">Bcc</label>
            <input
              type="text"
              value={bccField}
              onChange={(e) => setBccField(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
            />
          </div>

          {/* Subject Field */}
          <div className="flex items-center gap-4">
            <label className="text-gray-700 text-sm w-12 text-right font-medium">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
            />
          </div>

          {/* Body Label */}
          <div className="text-gray-700 text-sm font-medium">Body</div>

          {/* Rich Text Toolbar */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 text-gray-600">
              <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700">
                <option>Paragraph</option>
                <option>Heading 1</option>
                <option>Heading 2</option>
                <option>Heading 3</option>
              </select>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Bold">
                <Bold className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Italic">
                <Italic className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Underline">
                <Underline className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Strikethrough">
                <Strikethrough className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Align Left">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Align Center">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Align Right">
                <AlignRight className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Bulleted List">
                <List className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Numbered List">
                <ListOrdered className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Link">
                <Link className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Image">
                <Image className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Code">
                <Code className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Undo">
                <Undo className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-gray-200 rounded text-gray-600" title="Redo">
                <Redo className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
              <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700">
                <option>19px</option>
                <option>12px</option>
                <option>14px</option>
                <option>16px</option>
                <option>18px</option>
                <option>24px</option>
              </select>
              <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 ml-2">
                <option>Lato (Recommended)</option>
                <option>Arial</option>
                <option>Times New Roman</option>
                <option>Georgia</option>
              </select>
            </div>
            {/* Body Textarea */}
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full h-64 p-4 text-sm text-gray-800 focus:outline-none resize-none bg-white"
              placeholder="Write your message here..."
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleSend}
            className="bg-[#0066cc] hover:bg-[#004999] text-white px-6 py-2 rounded text-sm font-medium transition-colors"
          >
            Send
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClasslistPage() {
  const [activeTab, setActiveTab] = useState<TabType>("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNoSelectionTooltip = (action: string) => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setShowTooltip(action);
    // Auto-hide after 3 seconds
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(null);
    }, 3000);
  };

  const handleEmailClick = () => {
    if (selectedIds.length === 0) {
      showNoSelectionTooltip("email");
      return;
    }

    // Open the email compose modal
    setShowEmailModal(true);
  };

  const getSelectedRecipients = (): EmailRecipient[] => {
    return CLASSLIST_DATA
      .filter((person) => selectedIds.includes(person.id))
      .map((person) => ({
        id: person.id,
        name: person.name,
        email: person.email,
      }));
  };

  const handleActionClick = (action: string) => {
    if (selectedIds.length === 0) {
      showNoSelectionTooltip(action);
    } else {
      // Handle other actions here
      console.log(`${action} action for:`, selectedIds);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const filteredData = CLASSLIST_DATA.filter((person) => {
    // Filter by tab
    if (activeTab === "students" && person.role !== "Student") return false;
    if (activeTab === "instructors" && person.role !== "Instructor") return false;
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        person.name.toLowerCase().includes(query) ||
        person.email.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((p) => p.id));
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "students", label: "Students" },
    { id: "instructors", label: "Instructors" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-normal text-gray-900 dark:text-white">Classlist</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0066cc]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="relative w-64">
        <input
          type="text"
          placeholder="Search For..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-6 ml-1">
        <div className="relative">
          <button 
            onClick={handleEmailClick}
            className="flex items-center gap-2 text-[#0066cc] hover:text-[#004999] transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm">Email</span>
          </button>
          {showTooltip === "email" && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
              <div className="bg-[#2d3b45] text-white text-sm px-4 py-3 rounded-lg shadow-lg text-center w-[220px]">
                Select one or more items to use the multi-action functions.
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#2d3b45]" />
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button 
            onClick={() => handleActionClick("message")}
            className="flex items-center gap-2 text-[#0066cc] hover:text-[#004999] transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Instant Message</span>
          </button>
          {showTooltip === "message" && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
              <div className="bg-[#2d3b45] text-white text-sm px-4 py-3 rounded-lg shadow-lg text-center w-[220px]">
                Select one or more items to use the multi-action functions.
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#2d3b45]" />
              </div>
            </div>
          )}
        </div>
        <div className="relative">
          <button 
            onClick={() => handleActionClick("print")}
            className="flex items-center gap-2 text-[#0066cc] hover:text-[#004999] transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="text-sm">Print</span>
          </button>
          {showTooltip === "print" && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
              <div className="bg-[#2d3b45] text-white text-sm px-4 py-3 rounded-lg shadow-lg text-center w-[220px]">
                Select one or more items to use the multi-action functions.
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#2d3b45]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#0066cc] focus:ring-[#0066cc]"
                />
              </th>
              <th className="w-20 px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Image
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                  Name
                  <ChevronDown className="w-3 h-3 rotate-180" />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.map((person) => (
              <tr
                key={person.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(person.id)}
                    onChange={() => handleSelectOne(person.id)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#0066cc] focus:ring-[#0066cc]"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button className="text-[#0066cc] hover:text-[#004999] hover:underline text-sm font-medium transition-colors">
                      {person.name}
                    </button>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {person.email}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {person.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No users found matching your criteria.
        </div>
      )}

      {/* Email Compose Modal */}
      <EmailComposeModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        recipients={getSelectedRecipients()}
      />
    </div>
  );
}
