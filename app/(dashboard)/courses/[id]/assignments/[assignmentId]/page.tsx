"use client";

import { use, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, X, CheckCircle2, Upload, Play, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from "lucide-react";

type SubmissionTab = "file" | "text" | "url" | "googledoc" | "media";

type SubmissionType = "file" | "text";

interface AssignmentDetail {
  id: number;
  title: string;
  dueDate: string;
  points: number;
  instructions: string;
  submissionType: SubmissionType;
  submitted: boolean;
  submittedAt?: string;
  submittedFile?: string;
  submittedText?: string;
}

// Mock data for assignment details
const ASSIGNMENTS_DETAIL: Record<string, AssignmentDetail> = {
  "1": {
    id: 1,
    title: "Final Exam Review Worksheet",
    dueDate: "Feb 10, 2026 11:59 PM",
    points: 20,
    instructions: `Complete the review worksheet covering all chapters from this semester. This will help you prepare for the final exam.

**Requirements:**
- Answer all questions thoroughly
- You may use your notes and textbook
- Show your work for calculation problems
- Submit as a PDF or Word document

**Topics Covered:**
1. Chapters 1-3: Early American History
2. Chapters 4-6: Revolutionary Period
3. Chapters 7-9: Civil War Era
4. Chapter 10: Reconstruction

Please review your notes and the study guide posted in Course Content before completing this worksheet.`,
    submissionType: "file",
    submitted: false,
  },
  "3": {
    id: 3,
    title: "Research Project Proposal",
    dueDate: "Jan 24, 2026 11:59 PM",
    points: 30,
    instructions: `Submit your research project proposal including your chosen topic, thesis statement, and preliminary sources.

**Your proposal must include:**
1. **Topic Selection** - Choose from the approved list provided in class
2. **Research Question** - A clear, focused question your project will answer
3. **Thesis Statement** - Your preliminary argument or main point
4. **Initial Sources** - At least 3 academic sources (books, journal articles, primary sources)
5. **Brief Outline** - A preliminary structure for your paper

**Format Requirements:**
- 1-2 pages, double-spaced
- 12pt Times New Roman font
- MLA citation format for sources
- Submit as PDF or Word document`,
    submissionType: "file",
    submitted: true,
    submittedAt: "Jan 23, 2026 at 4:32 PM",
    submittedFile: "research_proposal_final.pdf",
  },
  "4": {
    id: 4,
    title: "Immigration Research Project",
    dueDate: "Dec 18, 2025 11:59 PM",
    points: 75,
    instructions: `A comprehensive research project exploring immigration patterns in American history.

**Project Requirements:**
- 8-10 pages, not including bibliography
- Must include at least 8 sources (mix of primary and secondary)
- Include relevant maps, charts, or images
- MLA format throughout

**Grading Criteria:**
- Research quality: 25 points
- Argument/Analysis: 25 points
- Writing quality: 15 points
- Sources/Citations: 10 points`,
    submissionType: "file",
    submitted: true,
    submittedAt: "Dec 17, 2025 at 10:45 PM",
    submittedFile: "immigration_project.pdf",
  },
  "5": {
    id: 5,
    title: "Chapter 8 Homework",
    dueDate: "Dec 5, 2025 11:59 PM",
    points: 20,
    instructions: `Complete questions 1-15 from Chapter 8 in your textbook.

**Instructions:**
- Answer each question in complete sentences
- Include page numbers for any quotes used
- Questions 10-15 require short paragraph responses (3-5 sentences each)

Submit your completed answers as a PDF or Word document.`,
    submissionType: "file",
    submitted: true,
    submittedAt: "Dec 4, 2025 at 8:20 PM",
    submittedFile: "chapter8_homework.pdf",
  },
  "6": {
    id: 6,
    title: "Primary Source Analysis",
    dueDate: "Dec 1, 2025 11:59 PM",
    points: 30,
    instructions: `Analyze the provided primary source documents and write a reflection on their historical significance.

**Documents to Analyze:**
1. Letter from a Civil War soldier (1863)
2. Newspaper editorial on Reconstruction (1867)
3. Political cartoon from Harper's Weekly (1870)

**Your analysis should address:**
- What is the main message or purpose of each document?
- Who was the intended audience?
- What biases or perspectives are evident?
- How do these documents help us understand this historical period?

**Format:** Type your analysis directly in the text box below. Your response should be 400-600 words.`,
    submissionType: "text",
    submitted: true,
    submittedAt: "Nov 30, 2025 at 6:15 PM",
    submittedText: "The three primary source documents provide valuable insight into the tumultuous period of the Civil War and Reconstruction...",
  },
  "7": {
    id: 7,
    title: "Civil War Timeline Project",
    dueDate: "Nov 18, 2025 11:59 PM",
    points: 50,
    instructions: `Create a detailed timeline of major events during the Civil War era (1860-1877).

**Requirements:**
- Include at least 20 significant events
- Each event should include:
  - Date
  - Event name
  - Brief description (2-3 sentences)
  - Historical significance
- Include images or illustrations where appropriate
- Timeline can be created digitally or by hand (scan if handmade)

**Suggested format:** PowerPoint, Google Slides, Canva, or PDF`,
    submissionType: "file",
    submitted: true,
    submittedAt: "Nov 17, 2025 at 11:30 PM",
    submittedFile: "civil_war_timeline.pptx",
  },
  "9": {
    id: 9,
    title: "Abraham Lincoln Essay",
    dueDate: "Oct 22, 2025 11:59 PM",
    points: 50,
    instructions: `Write a 3-page essay on Abraham Lincoln's leadership during the Civil War.

**Essay Prompt:**
Analyze Abraham Lincoln's leadership style and decision-making during the Civil War. How did his approach to leadership evolve throughout his presidency? What were his greatest challenges and how did he address them?

**Requirements:**
- 3 pages, double-spaced
- 12pt Times New Roman font
- Include a thesis statement in your introduction
- Use at least 4 sources (cited in MLA format)
- Include a Works Cited page (not counted in page requirement)

**Grading Criteria:**
- Thesis and argument: 15 points
- Evidence and analysis: 15 points
- Organization and structure: 10 points
- Writing quality and citations: 10 points`,
    submissionType: "file",
    submitted: false,
  },
};

interface PageProps {
  params: Promise<{ id: string; assignmentId: string }>;
}

export function generateStaticParams() {
  const assignmentIds = Object.keys(ASSIGNMENTS_DETAIL);
  const courseIds = ["1", "2", "3", "4", "5", "6"];
  
  // Generate all combinations of course IDs and assignment IDs
  const params = courseIds.flatMap((id) =>
    assignmentIds.map((assignmentId) => ({
      id,
      assignmentId,
    }))
  );
  
  return params;
}

export default function AssignmentDetailPage({ params }: PageProps) {
  const { id: courseId, assignmentId } = use(params);
  const assignment = ASSIGNMENTS_DETAIL[assignmentId];
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textSubmission, setTextSubmission] = useState(assignment?.submittedText || "");
  const [urlSubmission, setUrlSubmission] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<SubmissionTab>("file");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textEditorRef = useRef<HTMLDivElement>(null);

  if (!assignment) {
    return (
      <div className="space-y-6">
        <Link
          href={`/courses/${courseId}/assignments`}
          className="inline-flex items-center gap-2 text-[#6E8CB9] hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Assignments
        </Link>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Assignment not found</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setJustSubmitted(true);
      const content = textEditorRef.current?.innerHTML || textSubmission;
      console.log("Submitted:", activeTab, selectedFile?.name || content || urlSubmission);
    }, 1500);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setTextSubmission("");
    setUrlSubmission("");
    if (textEditorRef.current) {
      textEditorRef.current.innerHTML = "";
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    textEditorRef.current?.focus();
  };

  const canSubmit = () => {
    switch (activeTab) {
      case "file":
        return selectedFile !== null;
      case "text":
        return (textEditorRef.current?.innerHTML || "").trim().length > 0;
      case "url":
        return urlSubmission.trim().length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href={`/courses/${courseId}/assignments`}
        className="inline-flex items-center gap-2 text-[#6E8CB9] hover:underline text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Assignments
      </Link>

      {/* Assignment Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {assignment.title}
        </h1>
        
        <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Due: {assignment.dueDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{assignment.points} points</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Instructions
        </h2>
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
          {assignment.instructions}
        </div>
      </div>

      {/* Submission Section */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Submission
        </h2>

        {/* Already Submitted */}
        {(assignment.submitted || justSubmitted) && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">
                {justSubmitted ? "Assignment submitted successfully!" : "Assignment Submitted"}
              </span>
            </div>
            {assignment.submittedAt && !justSubmitted && (
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                Submitted on {assignment.submittedAt}
              </p>
            )}
            {assignment.submittedFile && !justSubmitted && (
              <div className="flex items-center gap-2 mt-2 text-sm text-green-600 dark:text-green-500">
                <FileText className="w-4 h-4" />
                <span>{assignment.submittedFile}</span>
              </div>
            )}
          </div>
        )}

        {/* Submission Tabs */}
        {!assignment.submitted && !justSubmitted && (
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <button
                onClick={() => setActiveTab("file")}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "file"
                    ? "text-[#6E8CB9] border-b-2 border-[#6E8CB9] bg-white dark:bg-gray-900 -mb-px"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                File Upload
              </button>
              <button
                onClick={() => setActiveTab("text")}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "text"
                    ? "text-[#6E8CB9] border-b-2 border-[#6E8CB9] bg-white dark:bg-gray-900 -mb-px"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Text Entry
              </button>
              <button
                onClick={() => setActiveTab("url")}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "url"
                    ? "text-[#6E8CB9] border-b-2 border-[#6E8CB9] bg-white dark:bg-gray-900 -mb-px"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Website URL
              </button>
              <button
                onClick={() => setActiveTab("googledoc")}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "googledoc"
                    ? "text-[#6E8CB9] border-b-2 border-[#6E8CB9] bg-white dark:bg-gray-900 -mb-px"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Google Doc
              </button>
              <button
                onClick={() => setActiveTab("media")}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "media"
                    ? "text-[#6E8CB9] border-b-2 border-[#6E8CB9] bg-white dark:bg-gray-900 -mb-px"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Media
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-white dark:bg-gray-900">
              {/* File Upload Tab */}
              {activeTab === "file" && (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                    onChange={handleFileChange}
                  />
                  
                  {!selectedFile ? (
                    <div className="text-center py-8">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Drag and drop files here, or click to select
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-[#6E8CB9] hover:bg-[#5F7AA3] text-white rounded text-sm transition-colors"
                      >
                        Choose a File
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-[#6E8CB9]" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Text Entry Tab */}
              {activeTab === "text" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Copy and paste or type your submission right here.
                  </p>
                  
                  {/* Rich Text Toolbar */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => execCommand("bold")}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="Bold"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand("italic")}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand("underline")}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="Underline"
                      >
                        <Underline className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                      <button
                        type="button"
                        onClick={() => execCommand("justifyLeft")}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="Align Left"
                      >
                        <AlignLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand("justifyCenter")}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="Align Center"
                      >
                        <AlignCenter className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand("justifyRight")}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="Align Right"
                      >
                        <AlignRight className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                      <button
                        type="button"
                        onClick={() => execCommand("insertUnorderedList")}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="Bullet List"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => execCommand("insertOrderedList")}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-400"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Editor Area */}
                    <div
                      ref={textEditorRef}
                      contentEditable
                      className="min-h-[200px] p-4 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 focus:outline-none"
                      data-placeholder="Type your response here..."
                    />
                  </div>
                </div>
              )}

              {/* Website URL Tab */}
              {activeTab === "url" && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Type or paste a URL to submit.
                  </p>
                  <input
                    type="url"
                    value={urlSubmission}
                    onChange={(e) => setUrlSubmission(e.target.value)}
                    placeholder="https://"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent"
                  />
                </div>
              )}

              {/* Google Doc Tab */}
              {activeTab === "googledoc" && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 mx-auto mb-4" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.6 66.85L3.3 61.35 28.95 18.2h17.55L6.6 66.85z" fill="#0066da"/>
                    <path d="M43.65 78L28.95 51.05 57.05 4.8l14.7 46.25L43.65 78z" fill="#00ac47"/>
                    <path d="M83.7 51.05L71.75 51.05 57.05 24.1 71.75 4.8 87.3 33.35 83.7 51.05z" fill="#ea4335"/>
                    <path d="M71.75 51.05H28.95L43.65 78h42.8L71.75 51.05z" fill="#00832d"/>
                    <path d="M28.95 51.05L6.6 66.85 21.3 78h22.35L28.95 51.05z" fill="#2684fc"/>
                    <path d="M71.75 4.8L57.05 4.8 46.5 18.2h17.55L71.75 4.8z" fill="#ffba00"/>
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Connect your Google account to submit a Google Doc
                  </p>
                  <button
                    type="button"
                    onClick={() => alert("Google Drive integration coming soon")}
                    className="px-4 py-2 bg-[#6E8CB9] hover:bg-[#5F7AA3] text-white rounded text-sm transition-colors"
                  >
                    Connect to Google Drive
                  </button>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === "media" && (
                <div className="text-center py-8">
                  <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Record or upload audio/video for your submission
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => alert("Audio recording feature coming soon")}
                      className="px-4 py-2 bg-[#6E8CB9] hover:bg-[#5F7AA3] text-white rounded text-sm transition-colors"
                    >
                      Record Audio
                    </button>
                    <button
                      type="button"
                      onClick={() => alert("Video recording feature coming soon")}
                      className="px-4 py-2 bg-[#6E8CB9] hover:bg-[#5F7AA3] text-white rounded text-sm transition-colors"
                    >
                      Record Video
                    </button>
                  </div>
                </div>
              )}

              {/* Comments Field */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Comments..."
                  className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit() || isSubmitting}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                    canSubmit() && !isSubmitting
                      ? "bg-[#6E8CB9] hover:bg-[#5F7AA3] text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Assignment"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resubmit Option */}
        {(assignment.submitted || justSubmitted) && (
          <div className="mt-4">
            <button
              onClick={() => setJustSubmitted(false)}
              className="text-sm text-[#6E8CB9] hover:underline"
            >
              Submit a new attempt
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
