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
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState("16px");
  const [fontFamily, setFontFamily] = useState("Lato, sans-serif");

  useEffect(() => {
    setToRecipients(recipients);
  }, [recipients]);

  const handleRemoveToRecipient = (id: number) => {
    setToRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  // Rich text formatting commands
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFormatBlock = (tag: string) => {
    execCommand("formatBlock", tag);
  };

  const handleFontSize = (size: string) => {
    setFontSize(size);
    // execCommand fontSize uses 1-7 scale, so we apply via style
    if (editorRef.current) {
      editorRef.current.style.fontSize = size;
    }
  };

  const handleFontFamily = (font: string) => {
    setFontFamily(font);
    execCommand("fontName", font);
  };

  const handleLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const handleImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const handleSend = () => {
    const bodyContent = editorRef.current?.innerHTML || "";
    // Here you would integrate with an email service
    console.log("Sending email:", {
      to: toRecipients.map((r) => r.email),
      cc: ccField,
      bcc: bccField,
      subject,
      body: bodyContent,
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
              <select 
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 cursor-pointer"
                onChange={(e) => handleFormatBlock(e.target.value)}
                defaultValue="p"
              >
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Bold (Ctrl+B)"
                onClick={() => execCommand("bold")}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Italic (Ctrl+I)"
                onClick={() => execCommand("italic")}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Underline (Ctrl+U)"
                onClick={() => execCommand("underline")}
              >
                <Underline className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Strikethrough"
                onClick={() => execCommand("strikeThrough")}
              >
                <Strikethrough className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Align Left"
                onClick={() => execCommand("justifyLeft")}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Align Center"
                onClick={() => execCommand("justifyCenter")}
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Align Right"
                onClick={() => execCommand("justifyRight")}
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Bulleted List"
                onClick={() => execCommand("insertUnorderedList")}
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Numbered List"
                onClick={() => execCommand("insertOrderedList")}
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Insert Link"
                onClick={handleLink}
              >
                <Link className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Insert Image"
                onClick={handleImage}
              >
                <Image className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Code"
                onClick={() => execCommand("formatBlock", "pre")}
              >
                <Code className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-1" />
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Undo (Ctrl+Z)"
                onClick={() => execCommand("undo")}
              >
                <Undo className="w-4 h-4" />
              </button>
              <button 
                className="p-1.5 hover:bg-gray-200 rounded text-gray-600" 
                title="Redo (Ctrl+Y)"
                onClick={() => execCommand("redo")}
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
              <select 
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 cursor-pointer"
                value={fontSize}
                onChange={(e) => handleFontSize(e.target.value)}
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
              </select>
              <select 
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 ml-2 cursor-pointer"
                value={fontFamily}
                onChange={(e) => handleFontFamily(e.target.value)}
              >
                <option value="Lato, sans-serif">Lato (Recommended)</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Times New Roman, serif">Times New Roman</option>
                <option value="Georgia, serif">Georgia</option>
              </select>
            </div>
            {/* Rich Text Editor */}
            <div
              ref={editorRef}
              contentEditable
              className="w-full h-64 p-4 text-sm text-gray-800 focus:outline-none overflow-y-auto bg-white"
              style={{ fontSize, fontFamily, minHeight: "256px" }}
              data-placeholder="Write your message here..."
              onFocus={(e) => {
                if (e.currentTarget.textContent === "") {
                  e.currentTarget.classList.remove("empty");
                }
              }}
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
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 px-6 py-2 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="w-12 py-3 px-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredData.length && filteredData.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="w-16 py-3 px-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Image
              </th>
              <th className="py-3 px-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                <button className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white">
                  Name
                  <ChevronDown className="w-3 h-3 rotate-180" />
                </button>
              </th>
              <th className="py-3 px-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </th>
              <th className="py-3 px-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((person) => (
              <tr
                key={person.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="py-4 px-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(person.id)}
                    onChange={() => handleSelectOne(person.id)}
                  />
                </td>
                <td className="py-4 px-2">
                  <div className="w-10 h-10 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-200 dark:border-gray-600">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <a href="#" className="text-[#6E8CB9] hover:underline text-sm">
                      {person.name}
                    </a>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </td>
                <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
                  {person.email}
                </td>
                <td className="py-4 px-2 text-sm text-gray-600 dark:text-gray-400">
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
