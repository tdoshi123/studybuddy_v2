"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Calendar, Clock, FileText, Upload, CheckCircle, AlertCircle, Download, X } from "lucide-react";
import { getCourse } from "@/lib/constants/courses";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  points: number;
  type: "assignment" | "quiz" | "test" | "project";
  instructions: string;
  attachments?: { name: string; url: string }[];
  submitted: boolean;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
}

// Mock assignment data based on assignmentId
const getAssignmentData = (assignmentId: string, courseId: string): Assignment => {
  const assignments: Record<string, Assignment> = {
    "3a": {
      id: "3a",
      title: "Science: Hypothesis Worksheet",
      description: "Complete the hypothesis worksheet practicing scientific method and creating testable hypotheses.",
      dueDate: "February 2, 2026",
      dueTime: "11:59 PM",
      points: 20,
      type: "assignment",
      instructions: "Read the scenarios provided and write a proper hypothesis for each one. Remember to include your independent variable, dependent variable, and expected outcome. Show your work and explain your reasoning.",
      attachments: [
        { name: "Hypothesis_Worksheet.pdf", url: "#" },
        { name: "Example_Hypotheses.pdf", url: "#" }
      ],
      submitted: false
    },
    "16": {
      id: "16",
      title: "Math: Fractions Worksheet",
      description: "Practice adding, subtracting, multiplying, and dividing fractions.",
      dueDate: "February 3, 2026",
      dueTime: "11:59 PM",
      points: 25,
      type: "assignment",
      instructions: "Complete all 20 problems on the fractions worksheet. Show all your work for full credit. Remember to simplify your answers to lowest terms.",
      attachments: [
        { name: "Fractions_Practice.pdf", url: "#" }
      ],
      submitted: false
    },
    "45": {
      id: "45",
      title: "ELA: Personal Narrative Due",
      description: "Write a personal narrative essay about a meaningful experience in your life.",
      dueDate: "February 6, 2026",
      dueTime: "11:59 PM",
      points: 100,
      type: "assignment",
      instructions: "Your personal narrative should be 3-5 paragraphs long. Include a clear beginning, middle, and end. Use descriptive language and sensory details. Proofread for spelling, grammar, and punctuation.",
      attachments: [
        { name: "Personal_Narrative_Rubric.pdf", url: "#" },
        { name: "Example_Narratives.pdf", url: "#" }
      ],
      submitted: false
    },
    "29": {
      id: "29",
      title: "Science: Solar System Project",
      description: "Create a visual presentation about a planet in our solar system.",
      dueDate: "February 11, 2026",
      dueTime: "11:59 PM",
      points: 150,
      type: "project",
      instructions: "Choose a planet and create a poster, diorama, or digital presentation. Include: planet's size, distance from sun, temperature, atmosphere composition, number of moons, and 3 interesting facts. Be creative!",
      attachments: [
        { name: "Project_Guidelines.pdf", url: "#" },
        { name: "Research_Resources.pdf", url: "#" }
      ],
      submitted: false
    },
    "48": {
      id: "48",
      title: "Science: Ecosystem Test",
      description: "Test covering food chains, food webs, producers, consumers, and decomposers.",
      dueDate: "February 13, 2026",
      dueTime: "During class (11:00 AM - 11:50 AM)",
      points: 100,
      type: "test",
      instructions: "This test will be taken in class. Study your notes on ecosystems, food chains, and energy flow. Review vocabulary terms. No materials allowed except a pencil.",
      attachments: [
        { name: "Study_Guide.pdf", url: "#" }
      ],
      submitted: false
    }
  };

  return assignments[assignmentId] || {
    id: assignmentId,
    title: "Assignment",
    description: "Complete this assignment by the due date.",
    dueDate: "TBD",
    dueTime: "11:59 PM",
    points: 100,
    type: "assignment",
    instructions: "No instructions available yet.",
    submitted: false
  };
};

export default function AssignmentPage() {
  const params = useParams();
  const courseId = params.id as string;
  const assignmentId = params.assignmentId as string;
  const course = getCourse(courseId);
  const assignment = getAssignmentData(assignmentId, courseId);

  const [files, setFiles] = useState<File[]>([]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(assignment.submitted);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "assignment": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "quiz": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "test": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "project": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{course?.name || "Course"}</span>
            <span>/</span>
            <span>Assignments</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {assignment.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(assignment.type)}`}>
                  {getTypeLabel(assignment.type)}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {assignment.points} points
                </span>
              </div>
            </div>
            {submitted && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Submitted</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Due Date Alert */}
            {!submitted && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                      Due {assignment.dueDate} at {assignment.dueTime}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      Make sure to submit before the deadline to receive full credit.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                {assignment.description}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Instructions
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {assignment.instructions}
              </p>
            </div>

            {/* Teacher's Attachments */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Attachments
                </h2>
                <div className="space-y-2">
                  {assignment.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#6E8CB9]" />
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#6E8CB9]">
                        {attachment.name}
                      </span>
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-[#6E8CB9]" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Submission Form */}
            {!submitted ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Submission
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Files
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-[#6E8CB9] dark:hover:border-[#6E8CB9] transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          PDF, DOC, DOCX, PNG, JPG (max 10MB)
                        </span>
                      </label>
                    </div>

                    {/* Uploaded Files List */}
                    {files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Add a Comment (Optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#6E8CB9] focus:border-transparent resize-none"
                      placeholder="Add any notes or comments for your teacher..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Save Draft
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[#6E8CB9] text-white rounded-lg hover:bg-[#5F7AA3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Submit Assignment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-1">
                      Assignment Submitted!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                      Your teacher has been notified. You'll receive a grade soon.
                    </p>
                    {files.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <p className="text-sm font-medium text-green-900 dark:text-green-200">
                          Submitted Files:
                        </p>
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                            <FileText className="w-4 h-4" />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Due Date Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Assignment Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Due Date
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assignment.dueDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Due Time
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assignment.dueTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Points Possible
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assignment.points} points
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grade Card (if graded) */}
            {assignment.grade !== undefined && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Your Grade
                </h3>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-[#6E8CB9] mb-2">
                    {assignment.grade}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {assignment.grade} / {assignment.points} points
                  </div>
                </div>
                {assignment.feedback && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teacher Feedback:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assignment.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
