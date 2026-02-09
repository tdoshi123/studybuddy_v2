"use client";

import { useState } from "react";
import { TrendingUp, Search, Download, ChevronDown, ChevronUp, Book, Calendar, Target, CheckCircle, Award, Calculator, LineChart, X, Plus, AlertCircle } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

type GradeFilter = "all" | "a" | "b" | "c";
type SortOption = "grade" | "name" | "credits";

interface Assignment {
  id: string;
  name: string;
  type: "Homework" | "Quiz" | "Exam" | "Project";
  dueDate: string;
  score: number;
  maxScore: number;
  feedback?: string;
  needsImprovement?: boolean;
  missing?: boolean;
}

interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  semester: string;
  assignmentCount: number;
  grade: string;
  percentage: number;
  color: string;
  gradingBreakdown: {
    homework: number;
    quizzes: number;
    exams: number;
    projects: number;
    participation: number;
  };
  assignments: Assignment[];
  teacherComment?: string;
}

const COURSES_DATA: Course[] = [
  {
    id: "1",
    name: "Math - Period 3",
    code: "MATH",
    instructor: "Mrs. Johnson",
    credits: 1,
    semester: "Spring 2026",
    assignmentCount: 5,
    grade: "A",
    percentage: 94.5,
    color: "#6E8CB9",
    gradingBreakdown: {
      homework: 30,
      quizzes: 25,
      exams: 30,
      projects: 10,
      participation: 5,
    },
    assignments: [
      { id: "1", name: "Fractions Worksheet", type: "Homework", dueDate: "1/14/2026", score: 95, maxScore: 100, feedback: "Great work! Your understanding of equivalent fractions is excellent." },
      { id: "2", name: "Multiplication Quiz", type: "Quiz", dueDate: "1/19/2026", score: 92, maxScore: 100, feedback: "Nice job! Watch your work on multi-digit problems." },
      { id: "3", name: "Chapter 5 Test", type: "Exam", dueDate: "2/9/2026", score: 88, maxScore: 100, feedback: "Good effort. Review word problem strategies - come see me if you need help!", needsImprovement: true },
      { id: "4", name: "Geometry Project", type: "Project", dueDate: "2/19/2026", score: 98, maxScore: 100, feedback: "Outstanding work! Your geometric models were very creative and accurate." },
      { id: "5", name: "Word Problems Practice", type: "Homework", dueDate: "2/20/2026", score: 100, maxScore: 100, feedback: "Perfect! You've mastered these problem-solving strategies." },
    ],
    teacherComment: "Excellent progress this semester! Keep up the great work on homework completion.",
  },
  {
    id: "2",
    name: "English Language Arts",
    code: "ELA",
    instructor: "Mr. Thompson",
    credits: 1,
    semester: "Spring 2026",
    assignmentCount: 4,
    grade: "A-",
    percentage: 91.8,
    color: "#4A7C59",
    gradingBreakdown: {
      homework: 25,
      quizzes: 20,
      exams: 25,
      projects: 25,
      participation: 5,
    },
    assignments: [
      { id: "1", name: "Personal Narrative Essay", type: "Homework", dueDate: "1/20/2026", score: 90, maxScore: 100, feedback: "Great story structure! Work on adding more descriptive details." },
      { id: "2", name: "Spelling Quiz: Unit 5", type: "Quiz", dueDate: "1/25/2026", score: 88, maxScore: 100, feedback: "Good job! Review the i-before-e rule for next time.", needsImprovement: true },
      { id: "3", name: "Book Report: Charlotte's Web", type: "Project", dueDate: "2/15/2026", score: 95, maxScore: 100, feedback: "Excellent analysis! Your understanding of the themes was impressive." },
      { id: "4", name: "Grammar Test", type: "Exam", dueDate: "2/22/2026", score: 92, maxScore: 100, feedback: "Strong performance! Just a few comma splice errors to watch." },
    ],
    teacherComment: "Your writing has improved tremendously! Keep reading to expand your vocabulary.",
  },
  {
    id: "3",
    name: "Science - Period 4",
    code: "SCI",
    instructor: "Ms. Garcia",
    credits: 1,
    semester: "Spring 2026",
    assignmentCount: 4,
    grade: "B+",
    percentage: 89.2,
    color: "#8B5A2B",
    gradingBreakdown: {
      homework: 20,
      quizzes: 25,
      exams: 30,
      projects: 20,
      participation: 5,
    },
    assignments: [
      { id: "1", name: "Solar System Worksheet", type: "Homework", dueDate: "1/18/2026", score: 88, maxScore: 100, feedback: "Good work! Double-check your planet order next time." },
      { id: "2", name: "Plant Life Cycle Quiz", type: "Quiz", dueDate: "1/28/2026", score: 85, maxScore: 100, feedback: "Study the photosynthesis process more carefully. See me for extra help materials.", needsImprovement: true },
      { id: "3", name: "Solar System Project", type: "Project", dueDate: "2/12/2026", score: 92, maxScore: 100, feedback: "Creative presentation! Your model was well-researched and detailed." },
      { id: "4", name: "Ecosystem Test", type: "Exam", dueDate: "2/25/2026", score: 90, maxScore: 100, feedback: "Much better! You clearly studied the food chain concepts." },
    ],
    teacherComment: "Steady improvement shown. More focus on lab procedures would help boost your grade.",
  },
  {
    id: "4",
    name: "Social Studies",
    code: "SS",
    instructor: "Mr. Williams",
    credits: 1,
    semester: "Spring 2026",
    assignmentCount: 6,
    grade: "C+",
    percentage: 80.5,
    color: "#6B4C9A",
    gradingBreakdown: {
      homework: 35,
      quizzes: 20,
      exams: 35,
      projects: 5,
      participation: 5,
    },
    assignments: [
      { id: "1", name: "Chapter 8 Questions", type: "Homework", dueDate: "1/15/2026", score: 82, maxScore: 100, feedback: "Decent effort, but answers need more detail from the text." },
      { id: "2", name: "States & Capitals Quiz", type: "Quiz", dueDate: "1/22/2026", score: 78, maxScore: 100, feedback: "Study using flashcards daily. You can retake this next week for a better grade.", needsImprovement: true },
      { id: "3", name: "Current Events Report", type: "Homework", dueDate: "1/29/2026", score: 0, maxScore: 100, feedback: "Not turned in. Please submit by next week - this is an important part of the curriculum.", missing: true, needsImprovement: true },
      { id: "4", name: "Map Skills Worksheet", type: "Homework", dueDate: "2/1/2026", score: 90, maxScore: 100, feedback: "Excellent improvement! Your map reading skills are getting stronger." },
      { id: "5", name: "U.S. History Test", type: "Exam", dueDate: "2/10/2026", score: 85, maxScore: 100, feedback: "Better! Focus on dates and timeline relationships for the next unit." },
      { id: "6", name: "Geography Quiz", type: "Quiz", dueDate: "2/18/2026", score: 88, maxScore: 100, feedback: "Nice work! You're making progress on memorization techniques." },
    ],
    teacherComment: "I can see you're working harder! Keep up with the study guides and your grade will continue to rise. Please remember to turn in all homework assignments - missing work really impacts your grade.",
  },
  {
    id: "5",
    name: "Art",
    code: "ART",
    instructor: "Mrs. Davis",
    credits: 1,
    semester: "Spring 2026",
    assignmentCount: 4,
    grade: "A",
    percentage: 96.0,
    color: "#C4564A",
    gradingBreakdown: {
      homework: 15,
      quizzes: 10,
      exams: 20,
      projects: 50,
      participation: 5,
    },
    assignments: [
      { id: "1", name: "Color Wheel Project", type: "Project", dueDate: "1/16/2026", score: 95, maxScore: 100, feedback: "Beautiful color blending! Your understanding of complementary colors shines through." },
      { id: "2", name: "Art History Quiz", type: "Quiz", dueDate: "1/24/2026", score: 92, maxScore: 100, feedback: "Great knowledge of the Renaissance period!" },
      { id: "3", name: "Self Portrait", type: "Project", dueDate: "2/5/2026", score: 98, maxScore: 100, feedback: "Exceptional work! Your shading technique has improved dramatically." },
      { id: "4", name: "Techniques Test", type: "Exam", dueDate: "2/14/2026", score: 100, maxScore: 100, feedback: "Perfect score! You've mastered all the techniques we covered." },
    ],
    teacherComment: "You have real artistic talent! Consider joining the after-school art club.",
  },
  {
    id: "6",
    name: "Physical Education",
    code: "PE",
    instructor: "Coach Martinez",
    credits: 1,
    semester: "Spring 2026",
    assignmentCount: 3,
    grade: "A",
    percentage: 93.0,
    color: "#2E8B8B",
    gradingBreakdown: {
      homework: 10,
      quizzes: 15,
      exams: 20,
      projects: 10,
      participation: 45,
    },
    assignments: [
      { id: "1", name: "Fitness Log", type: "Homework", dueDate: "1/20/2026", score: 90, maxScore: 100, feedback: "Great effort tracking your activities! Try to include more stretching exercises." },
      { id: "2", name: "Sports Rules Quiz", type: "Quiz", dueDate: "2/3/2026", score: 88, maxScore: 100, feedback: "Good knowledge! Review basketball fouls for next unit." },
      { id: "3", name: "Mile Run Test", type: "Exam", dueDate: "2/17/2026", score: 100, maxScore: 100, feedback: "Outstanding! You improved your time by 45 seconds. Excellent dedication!" },
    ],
    teacherComment: "Great attitude and sportsmanship! You're a positive role model in class.",
  },
  {
    id: "7",
    name: "Spanish 1",
    code: "SPAN",
    instructor: "Señora Rodriguez",
    credits: 1,
    semester: "Spring 2026",
    assignmentCount: 8,
    grade: "D",
    percentage: 62.4,
    color: "#D97706",
    gradingBreakdown: {
      homework: 30,
      quizzes: 25,
      exams: 35,
      projects: 5,
      participation: 5,
    },
    assignments: [
      { id: "1", name: "Vocabulary Homework Ch. 1", type: "Homework", dueDate: "1/12/2026", score: 58, maxScore: 100, feedback: "Missing several words. Please use flashcards to study vocabulary daily.", needsImprovement: true },
      { id: "2", name: "Conjugation Practice", type: "Homework", dueDate: "1/18/2026", score: 0, maxScore: 100, feedback: "Assignment not submitted. This is hurting your grade significantly. Please see me to make up work.", missing: true, needsImprovement: true },
      { id: "3", name: "Conjugation Quiz", type: "Quiz", dueDate: "1/21/2026", score: 52, maxScore: 100, feedback: "You're struggling with verb endings. Let's set up a tutoring session - see me after class.", needsImprovement: true },
      { id: "4", name: "Grammar Worksheet", type: "Homework", dueDate: "1/28/2026", score: 70, maxScore: 100, feedback: "Better effort here! Keep practicing the patterns we reviewed." },
      { id: "5", name: "Unit 1 Exam", type: "Exam", dueDate: "2/5/2026", score: 64, maxScore: 100, feedback: "This shows some improvement. Continue working with the study guide. You CAN do this!", needsImprovement: true },
      { id: "6", name: "Listening Comprehension", type: "Homework", dueDate: "2/10/2026", score: 0, maxScore: 100, feedback: "Missing assignment. You have until Friday to submit for partial credit (max 70%).", missing: true, needsImprovement: true },
      { id: "7", name: "Speaking Quiz", type: "Quiz", dueDate: "2/14/2026", score: 75, maxScore: 100, feedback: "Much better! Your pronunciation is improving when you practice out loud." },
      { id: "8", name: "Culture Project", type: "Project", dueDate: "2/20/2026", score: 80, maxScore: 100, feedback: "Great research on Mexican traditions! Your effort really shows here." },
    ],
    teacherComment: "I'm concerned about your grades, especially the missing assignments which are significantly impacting your grade. Please attend tutoring on Tuesdays and Thursdays, and make sure to turn in all homework. You can still make up the recent missing work for partial credit. With consistent practice and completing all assignments, you can bring this up to a C or better! Don't give up.",
  },
];

// Historical grade data for trends chart
const GRADE_TRENDS_DATA = [
  { month: "Sep", math: 92, ela: 88, science: 85, social: 84, art: 94, pe: 91, spanish: 72, overall: 86.6 },
  { month: "Oct", math: 93, ela: 89, science: 87, social: 85, art: 95, pe: 92, spanish: 70, overall: 87.3 },
  { month: "Nov", math: 94, ela: 90, science: 88, social: 84, art: 96, pe: 93, spanish: 68, overall: 87.6 },
  { month: "Dec", math: 93, ela: 91, science: 88, social: 83, art: 95, pe: 92, spanish: 65, overall: 86.7 },
  { month: "Jan", math: 95, ela: 92, science: 89, social: 82, art: 96, pe: 93, spanish: 64, overall: 87.3 },
  { month: "Feb", math: 94.5, ela: 91.8, science: 89.2, social: 80.5, art: 96.0, pe: 93.0, spanish: 62.4, overall: 86.8 },
];

// GPA conversion (4.0 scale)
const gradeToGPA = (percentage: number): number => {
  if (percentage >= 93) return 4.0;
  if (percentage >= 90) return 3.7;
  if (percentage >= 87) return 3.3;
  if (percentage >= 83) return 3.0;
  if (percentage >= 80) return 2.7;
  if (percentage >= 77) return 2.3;
  if (percentage >= 73) return 2.0;
  if (percentage >= 70) return 1.7;
  if (percentage >= 67) return 1.3;
  if (percentage >= 65) return 1.0;
  return 0.0;
};

interface WhatIfAssignment extends Assignment {
  courseId: string;
}

interface HypotheticalAssignment {
  id: string;
  courseId: string;
  name: string;
  type: "Homework" | "Quiz" | "Exam" | "Project";
  score: number;
  maxScore: number;
}

type TabType = "grades" | "calculator" | "trends";

export default function GradesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("grade");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("grades");
  const [expandedWhatIfCourse, setExpandedWhatIfCourse] = useState<string | null>(null);
  const [showMissingAssignments, setShowMissingAssignments] = useState(false);

  // Store what-if scores for existing assignments (courseId-assignmentId -> score)
  const [whatIfScores, setWhatIfScores] = useState<Record<string, number>>({});

  // Store hypothetical future assignments
  const [hypotheticalAssignments, setHypotheticalAssignments] = useState<HypotheticalAssignment[]>([]);

  const filteredCourses = COURSES_DATA.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      gradeFilter === "all" ||
      (gradeFilter === "a" && course.grade.startsWith("A")) ||
      (gradeFilter === "b" && course.grade.startsWith("B")) ||
      (gradeFilter === "c" && (course.grade.startsWith("C") || course.grade.startsWith("D") || course.grade.startsWith("F")));

    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortOption) {
      case "grade":
        // Sort by percentage (descending - highest grade first)
        return b.percentage - a.percentage;
      case "name":
        // Sort alphabetically by course name
        return a.name.localeCompare(b.name);
      case "credits":
        // Sort by credits (descending - most credits first)
        return b.credits - a.credits;
      default:
        return 0;
    }
  });

  const toggleExpand = (courseId: string) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-emerald-100 text-emerald-700";
    if (grade.startsWith("B")) return "bg-emerald-50 text-emerald-600";
    if (grade.startsWith("C")) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Homework": return "bg-blue-100 text-blue-700";
      case "Quiz": return "bg-purple-100 text-purple-700";
      case "Exam": return "bg-red-100 text-red-700";
      case "Project": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // Calculate what-if course grade based on modified assignments
  const calculateWhatIfCourseGrade = (course: Course): number => {
    // Get all assignments for this course (original + hypothetical)
    const courseHypotheticals = hypotheticalAssignments.filter(a => a.courseId === course.id);

    // Calculate scores for each category
    const categoryScores: Record<string, { total: number; earned: number; count: number }> = {
      Homework: { total: 0, earned: 0, count: 0 },
      Quiz: { total: 0, earned: 0, count: 0 },
      Exam: { total: 0, earned: 0, count: 0 },
      Project: { total: 0, earned: 0, count: 0 },
    };

    // Process original assignments
    course.assignments.forEach(assignment => {
      const key = `${course.id}-${assignment.id}`;
      const score = whatIfScores[key] !== undefined ? whatIfScores[key] : assignment.score;

      categoryScores[assignment.type].earned += score;
      categoryScores[assignment.type].total += assignment.maxScore;
      categoryScores[assignment.type].count += 1;
    });

    // Process hypothetical assignments
    courseHypotheticals.forEach(assignment => {
      categoryScores[assignment.type].earned += assignment.score;
      categoryScores[assignment.type].total += assignment.maxScore;
      categoryScores[assignment.type].count += 1;
    });

    // Calculate weighted average based on grading breakdown
    let weightedGrade = 0;
    const breakdown = course.gradingBreakdown;

    // Map assignment types to breakdown keys
    const typeToBreakdown: Record<string, keyof typeof breakdown> = {
      Homework: 'homework',
      Quiz: 'quizzes',
      Exam: 'exams',
      Project: 'projects',
    };

    Object.entries(categoryScores).forEach(([type, scores]) => {
      if (scores.count > 0) {
        const categoryPercentage = (scores.earned / scores.total) * 100;
        const weight = breakdown[typeToBreakdown[type]] / 100;
        weightedGrade += categoryPercentage * weight;
      }
    });

    return weightedGrade;
  };

  // Calculate current GPA
  const calculateCurrentGPA = () => {
    const totalCredits = COURSES_DATA.reduce((sum, c) => sum + c.credits, 0);
    const weightedSum = COURSES_DATA.reduce((sum, c) => sum + (gradeToGPA(c.percentage) * c.credits), 0);
    return (weightedSum / totalCredits).toFixed(2);
  };

  // Calculate what-if GPA
  const calculateWhatIfGPA = () => {
    const totalCredits = COURSES_DATA.reduce((sum, c) => sum + c.credits, 0);
    const weightedSum = COURSES_DATA.reduce((sum, c) => {
      const whatIfGrade = calculateWhatIfCourseGrade(c);
      return sum + (gradeToGPA(whatIfGrade) * c.credits);
    }, 0);
    return (weightedSum / totalCredits).toFixed(2);
  };

  const resetWhatIfGrades = () => {
    setWhatIfScores({});
    setHypotheticalAssignments([]);
  };

  const addHypotheticalAssignment = (courseId: string) => {
    const newAssignment: HypotheticalAssignment = {
      id: `hyp-${Date.now()}`,
      courseId,
      name: "Upcoming Assignment",
      type: "Homework",
      score: 90,
      maxScore: 100,
    };
    setHypotheticalAssignments([...hypotheticalAssignments, newAssignment]);
  };

  const removeHypotheticalAssignment = (id: string) => {
    setHypotheticalAssignments(hypotheticalAssignments.filter(a => a.id !== id));
  };

  const updateHypotheticalAssignment = (id: string, updates: Partial<HypotheticalAssignment>) => {
    setHypotheticalAssignments(
      hypotheticalAssignments.map(a => a.id === id ? { ...a, ...updates } : a)
    );
  };

  const currentGPA = calculateCurrentGPA();
  const whatIfGPA = calculateWhatIfGPA();
  const gpaChange = (parseFloat(whatIfGPA) - parseFloat(currentGPA)).toFixed(2);

  // Get all missing assignments
  const getAllMissingAssignments = () => {
    const missing: Array<{ course: Course; assignment: Assignment }> = [];
    COURSES_DATA.forEach(course => {
      course.assignments.forEach(assignment => {
        if (assignment.missing) {
          missing.push({ course, assignment });
        }
      });
    });
    return missing;
  };

  const missingAssignments = getAllMissingAssignments();
  const totalMissing = missingAssignments.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Grades
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Track your academic progress and view teacher feedback
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Average Card - Blue */}
        <div className="bg-[#3b82f6] rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-100">Overall Average</p>
            <Award className="w-5 h-5 text-blue-200" />
          </div>
          <p className="mt-2 text-4xl font-bold">86.8%</p>
          <div className="mt-2 flex items-center gap-1 text-blue-100">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">+0.2% from last quarter</span>
          </div>
        </div>

        {/* Total Classes Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Classes</p>
            <Book className="w-5 h-5 text-gray-400" />
          </div>
          <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">7</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This semester</p>
        </div>

        {/* Highest Grade Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Highest Grade</p>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">96%</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Art class</p>
        </div>

        {/* Assignments Done Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assignments</p>
            <CheckCircle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-4xl font-bold text-amber-500">31/34</p>
            <span className="text-sm text-red-600 dark:text-red-400 font-medium">3 missing</span>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Assignments this semester</p>
        </div>
      </div>

      {/* Missing Assignments Alert */}
      {totalMissing > 0 && (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-100">
                  You have {totalMissing} missing assignment{totalMissing !== 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">
                  Missing assignments significantly impact your grades. Review and submit them as soon as possible.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowMissingAssignments(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              View Missing
            </button>
          </div>
        </div>
      )}

      {/* Missing Assignments Modal */}
      {showMissingAssignments && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Missing Assignments ({totalMissing})
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Submit these assignments to improve your grades
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMissingAssignments(false)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {missingAssignments.map(({ course, assignment }) => (
                  <div
                    key={`${course.id}-${assignment.id}`}
                    className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: course.color }}
                          />
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {course.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            • {course.instructor}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-semibold text-red-900 dark:text-red-100">
                            {assignment.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(assignment.type)}`}>
                            {assignment.type}
                          </span>
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                            MISSING
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Due: {assignment.dueDate}
                          </span>
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            Worth: {assignment.maxScore} points
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium">
                          0/{assignment.maxScore}
                        </div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                          0%
                        </div>
                      </div>
                    </div>

                    {/* Teacher Feedback */}
                    {assignment.feedback && (
                      <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Teacher's Note:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          "{assignment.feedback}"
                        </p>
                      </div>
                    )}

                    {/* Grading Weight Info */}
                    <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        This {assignment.type.toLowerCase()} counts for{' '}
                        <span className="font-semibold">
                          {assignment.type === 'Homework' && course.gradingBreakdown.homework}
                          {assignment.type === 'Quiz' && course.gradingBreakdown.quizzes}
                          {assignment.type === 'Exam' && course.gradingBreakdown.exams}
                          {assignment.type === 'Project' && course.gradingBreakdown.projects}%
                        </span>
                        {' '}of your final grade in {course.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Contact your teachers about make-up work opportunities
                </p>
                <button
                  onClick={() => setShowMissingAssignments(false)}
                  className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("grades")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "grades"
              ? "text-[#3b82f6] border-b-2 border-[#3b82f6]"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            My Grades
          </button>
          <button
            onClick={() => setActiveTab("calculator")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "calculator"
              ? "text-[#3b82f6] border-b-2 border-[#3b82f6]"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            GPA Calculator
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "trends"
              ? "text-[#3b82f6] border-b-2 border-[#3b82f6]"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            Grade Trends
          </button>
        </div>
      </div>

      {/* Tab Content: My Grades */}
      {activeTab === "grades" && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
              >
                <option value="grade">Sort by Grade</option>
                <option value="name">Sort by Name</option>
                <option value="credits">Sort by Credits</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Grade Filter Buttons */}
            <div className="flex items-center gap-2">
              {[
                { value: "all" as GradeFilter, label: "All" },
                { value: "a" as GradeFilter, label: "A's" },
                { value: "b" as GradeFilter, label: "B's" },
                { value: "c" as GradeFilter, label: "C's & Below" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setGradeFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gradeFilter === filter.value
                    ? "bg-[#3b82f6] text-white"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Course Cards */}
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Course Header */}
                <div
                  className="flex items-center p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleExpand(course.id)}
                >
                  {/* Color Bar */}
                  <div
                    className="w-1 h-16 rounded-full mr-4"
                    style={{ backgroundColor: course.color }}
                  />

                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {course.name}
                      </h3>
                      {course.teacherComment && (
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                          Has Feedback
                        </span>
                      )}
                      {course.assignments.some(a => a.missing) && (
                        <span className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                          {course.assignments.filter(a => a.missing).length} Missing
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {course.instructor}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Book className="w-4 h-4" />
                        {course.assignmentCount} assignments
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {course.semester}
                      </span>
                    </div>
                  </div>

                  {/* Grade Badge */}
                  <div className="flex items-center gap-3">
                    <div className={`flex flex-col items-center px-5 py-3 rounded-lg ${getGradeColor(course.grade)}`}>
                      <span className="text-2xl font-bold">{course.grade}</span>
                      <span className="text-sm mt-0.5">{course.percentage}%</span>
                    </div>
                    {expandedCourse === course.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedCourse === course.id && (
                  <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 space-y-5">
                    {/* Teacher Comment */}
                    {course.teacherComment && (
                      <div className="mt-5 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                              Teacher Comment from {course.instructor}
                            </h4>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              {course.teacherComment}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Grading Breakdown */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Grading Breakdown
                      </h4>
                      <div className="grid grid-cols-5 gap-3">
                        {[
                          { label: "Homework", value: course.gradingBreakdown.homework },
                          { label: "Quizzes", value: course.gradingBreakdown.quizzes },
                          { label: "Exams", value: course.gradingBreakdown.exams },
                          { label: "Projects", value: course.gradingBreakdown.projects },
                          { label: "Participation", value: course.gradingBreakdown.participation },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center"
                          >
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {item.label}
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {item.value}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assignments with Feedback */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Recent Assignments
                      </h4>
                      <div className="space-y-3">
                        {course.assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className={`p-4 rounded-lg border ${assignment.missing
                              ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                              : assignment.needsImprovement
                                ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                              }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-medium ${assignment.missing ? 'text-red-900 dark:text-red-100' : 'text-gray-900 dark:text-white'}`}>
                                    {assignment.name}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(assignment.type)}`}>
                                    {assignment.type}
                                  </span>
                                  {assignment.missing && (
                                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-medium">
                                      MISSING
                                    </span>
                                  )}
                                  {assignment.needsImprovement && !assignment.missing && (
                                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-xs font-medium">
                                      Needs Work
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Due: {assignment.dueDate}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-4 py-2 rounded-lg text-sm font-medium ${assignment.missing
                                  ? 'bg-red-600 text-white'
                                  : 'bg-[#3b82f6] text-white'
                                  }`}>
                                  {assignment.score}/{assignment.maxScore}
                                </span>
                                <span className={`text-lg font-semibold min-w-[3rem] text-right ${assignment.missing
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-gray-900 dark:text-white'
                                  }`}>
                                  {Math.round((assignment.score / assignment.maxScore) * 100)}%
                                </span>
                              </div>
                            </div>
                            {assignment.feedback && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                                  "{assignment.feedback}"
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Grade Progress Bar */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Overall Grade Progress
                      </h4>
                      <div className="relative">
                        <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-end pr-3"
                            style={{ width: `${course.percentage}%` }}
                          >
                            <span className="text-sm font-bold text-white">
                              {course.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span>0%</span>
                          <span>50%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: GPA Calculator */}
      {activeTab === "calculator" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#6E8CB9]/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-[#6E8CB9]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">GPA Calculator</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Calculate your current GPA and run what-if scenarios</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-6">
            {/* Current GPA & What-If GPA Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current GPA */}
              <div className="bg-gradient-to-br from-[#6E8CB9] to-[#5a7399] rounded-xl p-5 text-white">
                <p className="text-sm font-medium text-blue-100">Current GPA</p>
                <p className="mt-2 text-4xl font-bold">{currentGPA}</p>
                <p className="mt-2 text-sm text-blue-100">Out of 4.0</p>
              </div>

              {/* What-If GPA */}
              <div className="bg-gradient-to-br from-[#4A7C59] to-[#3d6649] rounded-xl p-5 text-white">
                <p className="text-sm font-medium text-emerald-100">What-If GPA</p>
                <p className="mt-2 text-4xl font-bold">{whatIfGPA}</p>
                <div className="mt-2 flex items-center gap-1 text-emerald-100">
                  <TrendingUp className={`w-4 h-4 ${parseFloat(gpaChange) >= 0 ? '' : 'rotate-180'}`} />
                  <span className="text-sm">
                    {parseFloat(gpaChange) >= 0 ? '+' : ''}{gpaChange} from current
                  </span>
                </div>
              </div>

              {/* GPA Scale Reference */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">GPA Scale (4.0)</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">A (93-100%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">4.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">A- (90-92%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">3.7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">B+ (87-89%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">3.3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">B (83-86%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">3.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">B- (80-82%)</span>
                    <span className="font-medium text-gray-900 dark:text-white">2.7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What-If Scenarios by Course */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">What-If Scenarios</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Modify assignment scores or add upcoming assignments to see impact on your GPA
                  </p>
                </div>
                <button
                  onClick={resetWhatIfGrades}
                  className="px-4 py-2 text-sm text-[#6E8CB9] hover:bg-[#6E8CB9]/10 rounded-lg transition-colors"
                >
                  Reset All
                </button>
              </div>

              <div className="space-y-3">
                {COURSES_DATA.map((course) => {
                  const whatIfGrade = calculateWhatIfCourseGrade(course);
                  const gradeChange = whatIfGrade - course.percentage;
                  const courseHypotheticals = hypotheticalAssignments.filter(a => a.courseId === course.id);
                  const isExpanded = expandedWhatIfCourse === course.id;

                  return (
                    <div
                      key={course.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      {/* Course Header */}
                      <div
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                        onClick={() => setExpandedWhatIfCourse(isExpanded ? null : course.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {course.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Current:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {course.percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm text-gray-500 dark:text-gray-400">What-If:</span>
                              <span className="font-semibold text-[#6E8CB9]">
                                {whatIfGrade.toFixed(1)}%
                              </span>
                              {Math.abs(gradeChange) > 0.1 && (
                                <span className={`text-xs ${gradeChange > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                  ({gradeChange > 0 ? '+' : ''}{gradeChange.toFixed(1)}%)
                                </span>
                              )}
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Assignments */}
                      {isExpanded && (
                        <div className="p-4 space-y-4">
                          {/* Existing Assignments */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                              Current Assignments
                            </h4>
                            <div className="space-y-2">
                              {course.assignments.map((assignment) => {
                                const key = `${course.id}-${assignment.id}`;
                                const modifiedScore = whatIfScores[key] !== undefined
                                  ? whatIfScores[key]
                                  : assignment.score;

                                return (
                                  <div
                                    key={assignment.id}
                                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                          {assignment.name}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(assignment.type)}`}>
                                          {assignment.type}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Original: {assignment.score}/{assignment.maxScore}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        <input
                                          type="number"
                                          min="0"
                                          max={assignment.maxScore}
                                          value={modifiedScore}
                                          onChange={(e) => setWhatIfScores({
                                            ...whatIfScores,
                                            [key]: parseFloat(e.target.value) || 0
                                          })}
                                          className="w-16 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6E8CB9]"
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          / {assignment.maxScore}
                                        </span>
                                      </div>
                                      <span className={`text-sm font-medium ${modifiedScore !== assignment.score
                                        ? 'text-[#6E8CB9]'
                                        : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {Math.round((modifiedScore / assignment.maxScore) * 100)}%
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Hypothetical Assignments */}
                          {courseHypotheticals.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                Upcoming Assignments (Hypothetical)
                              </h4>
                              <div className="space-y-2">
                                {courseHypotheticals.map((assignment) => (
                                  <div
                                    key={assignment.id}
                                    className="flex items-center gap-3 p-3 bg-[#6E8CB9]/5 rounded-lg border border-[#6E8CB9]/20"
                                  >
                                    <input
                                      type="text"
                                      value={assignment.name}
                                      onChange={(e) => updateHypotheticalAssignment(assignment.id, { name: e.target.value })}
                                      className="flex-1 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6E8CB9]"
                                      placeholder="Assignment name"
                                    />

                                    <select
                                      value={assignment.type}
                                      onChange={(e) => updateHypotheticalAssignment(assignment.id, {
                                        type: e.target.value as "Homework" | "Quiz" | "Exam" | "Project"
                                      })}
                                      className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6E8CB9]"
                                    >
                                      <option value="Homework">Homework</option>
                                      <option value="Quiz">Quiz</option>
                                      <option value="Exam">Exam</option>
                                      <option value="Project">Project</option>
                                    </select>

                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min="0"
                                        max={assignment.maxScore}
                                        value={assignment.score}
                                        onChange={(e) => updateHypotheticalAssignment(assignment.id, {
                                          score: parseFloat(e.target.value) || 0
                                        })}
                                        className="w-16 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6E8CB9]"
                                      />
                                      <span className="text-sm text-gray-600 dark:text-gray-400">/</span>
                                      <input
                                        type="number"
                                        min="1"
                                        max="1000"
                                        value={assignment.maxScore}
                                        onChange={(e) => updateHypotheticalAssignment(assignment.id, {
                                          maxScore: parseFloat(e.target.value) || 100
                                        })}
                                        className="w-16 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded text-sm text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6E8CB9]"
                                      />
                                    </div>

                                    <button
                                      onClick={() => removeHypotheticalAssignment(assignment.id)}
                                      className="px-2 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                      title="Remove assignment"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Add Assignment Button */}
                          <button
                            onClick={() => addHypotheticalAssignment(course.id)}
                            className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-[#6E8CB9] hover:text-[#6E8CB9] transition-colors flex items-center justify-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Upcoming Assignment
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Grade Trends */}
      {activeTab === "trends" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#4A7C59]/10 flex items-center justify-center">
                <LineChart className="w-5 h-5 text-[#4A7C59]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Grade Trends</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">View your grade progress throughout the semester</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="p-5 border-t border-gray-100 dark:border-gray-800">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={GRADE_TRENDS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      domain={[70, 100]}
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      label={{ value: 'Grade (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                    />
                    <Legend
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="line"
                    />
                    <Line
                      type="monotone"
                      dataKey="overall"
                      stroke="#000000"
                      strokeWidth={3}
                      name="Overall Average"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="math"
                      stroke={COURSES_DATA[0].color}
                      strokeWidth={2}
                      name="Math"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ela"
                      stroke={COURSES_DATA[1].color}
                      strokeWidth={2}
                      name="ELA"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="science"
                      stroke={COURSES_DATA[2].color}
                      strokeWidth={2}
                      name="Science"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="social"
                      stroke={COURSES_DATA[3].color}
                      strokeWidth={2}
                      name="Social Studies"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="art"
                      stroke={COURSES_DATA[4].color}
                      strokeWidth={2}
                      name="Art"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pe"
                      stroke={COURSES_DATA[5].color}
                      strokeWidth={2}
                      name="PE"
                      dot={{ r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="spanish"
                      stroke={COURSES_DATA[6].color}
                      strokeWidth={2}
                      name="Spanish"
                      dot={{ r: 3 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              {/* Insights */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Strongest Improvement</span>
                  </div>
                  <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Art</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">+2.0% this semester</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">Most Consistent</span>
                  </div>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-100">Math</p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">±1.5% variance</p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">Needs Attention</span>
                  </div>
                  <p className="text-xl font-bold text-amber-900 dark:text-amber-100">Spanish</p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">Attend tutoring sessions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
