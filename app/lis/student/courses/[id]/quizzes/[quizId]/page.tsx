"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, PlayCircle, Download } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  points: number;
  timeLimit: string;
  questions: number;
  attempts: number;
  maxAttempts: number;
  instructions: string;
  attachments?: { name: string; url: string }[];
  submitted: boolean;
  grade?: number;
  feedback?: string;
}

const getQuizData = (quizId: string): Quiz => {
  const quizzes: Record<string, Quiz> = {
    "1": {
      id: "1",
      title: "Chapter 9: World War II Quiz",
      description: "This quiz covers the major events, key figures, and outcomes of World War II as discussed in Chapter 9.",
      dueDate: "February 7, 2026",
      dueTime: "11:59 PM",
      points: 25,
      timeLimit: "30 minutes",
      questions: 20,
      attempts: 0,
      maxAttempts: 1,
      instructions: "Read each question carefully before selecting your answer. You will have 30 minutes to complete all 20 questions. Once you begin, the timer cannot be paused. Make sure you have a stable internet connection before starting.",
      attachments: [
        { name: "Chapter_9_Study_Guide.pdf", url: "#" },
      ],
      submitted: false,
    },
    "2": {
      id: "2",
      title: "Vocabulary Quiz: Unit 5",
      description: "Test your knowledge of the vocabulary words from Unit 5.",
      dueDate: "February 5, 2026",
      dueTime: "11:59 PM",
      points: 15,
      timeLimit: "15 minutes",
      questions: 10,
      attempts: 0,
      maxAttempts: 2,
      instructions: "Match each vocabulary word with its correct definition. You may attempt this quiz up to 2 times — your highest score will be kept.",
      submitted: false,
    },
  };

  return quizzes[quizId] || {
    id: quizId,
    title: "Quiz",
    description: "Complete this quiz by the due date.",
    dueDate: "TBD",
    dueTime: "11:59 PM",
    points: 25,
    timeLimit: "30 minutes",
    questions: 10,
    attempts: 0,
    maxAttempts: 1,
    instructions: "No instructions available yet.",
    submitted: false,
  };
};

export default function QuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;
  const quiz = getQuizData(quizId);

  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(quiz.submitted);

  const handleStartQuiz = () => {
    setStarted(true);
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {quiz.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  Quiz
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {quiz.points} points
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {quiz.questions} questions
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {quiz.timeLimit}
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
            {!submitted && !started && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                      Due {quiz.dueDate} at {quiz.dueTime}
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                      Make sure to complete this quiz before the deadline.
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
                {quiz.description}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Instructions
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {quiz.instructions}
              </p>
            </div>

            {/* Attachments */}
            {quiz.attachments && quiz.attachments.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Attachments
                </h2>
                <div className="space-y-2">
                  {quiz.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#1e3a8a]" />
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 group-hover:text-[#1e3a8a]">
                        {attachment.name}
                      </span>
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-[#1e3a8a]" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Start Quiz / In Progress / Submitted */}
            {!submitted && !started && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
                <PlayCircle className="w-12 h-12 text-[#1e3a8a] mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Ready to begin?
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  You have {quiz.timeLimit} to complete {quiz.questions} questions. The timer starts as soon as you click the button below.
                </p>
                <button
                  onClick={handleStartQuiz}
                  className="px-8 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e293b] transition-colors font-medium flex items-center gap-2 mx-auto"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Quiz
                </button>
              </div>
            )}

            {!submitted && started && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center">
                <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Quiz In Progress
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  This is a demo — in production, quiz questions would appear here.
                </p>
                <button
                  onClick={handleSubmitQuiz}
                  className="px-8 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e293b] transition-colors font-medium flex items-center gap-2 mx-auto"
                >
                  <CheckCircle className="w-5 h-5" />
                  Submit Quiz
                </button>
              </div>
            )}

            {submitted && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-1">
                      Quiz Submitted!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Your answers have been recorded. You&apos;ll receive your grade soon.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Details Card */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Quiz Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Limit</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.timeLimit}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Points Possible</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.points} points</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Attempts</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.attempts} / {quiz.maxAttempts}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grade Card (if graded) */}
            {quiz.grade !== undefined && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Your Grade
                </h3>
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-[#1e3a8a] mb-2">
                    {quiz.grade}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {quiz.grade} / {quiz.points} points
                  </div>
                </div>
                {quiz.feedback && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Teacher Feedback:
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.feedback}
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
