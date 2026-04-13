"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Plus, RotateCcw } from "lucide-react";


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
    color: "#1e3a8a",
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

type TabType = "grades" | "history" | "calculator";
type CalcType = "course" | "semester" | "cumulative";

interface CalcRow {
  name: string;
  grade: string;
  weight: string;
}

const EMPTY_ROW: CalcRow = { name: "", grade: "", weight: "" };

const GRADE_OPTIONS = [
  "-", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F",
];

const letterToGPA = (letter: string): number => {
  const map: Record<string, number> = {
    "A+": 4.0, "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0,
  };
  return map[letter] ?? -1;
};

const percentageToLetter = (pct: number): string => {
  if (pct >= 97) return "A+";
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 65) return "D";
  return "F";
};

// ─── Grade History data ──────────────────────────────────────────────────────

interface HistoryCourse {
  name: string;
  grade: string;
  percentage: number;
}

interface HistoryYear {
  label: string;
  courses: HistoryCourse[];
}

const GRADE_HISTORY: HistoryYear[] = [
  {
    label: "2022-2023",
    courses: [
      { name: "Algebra 1", grade: "A-", percentage: 91 },
      { name: "English 9", grade: "B+", percentage: 88 },
      { name: "Earth Science", grade: "A", percentage: 94 },
      { name: "World History", grade: "B", percentage: 85 },
      { name: "Intro to Art", grade: "A+", percentage: 98 },
      { name: "Physical Education 9", grade: "A", percentage: 95 },
      { name: "French 1", grade: "B-", percentage: 82 },
    ],
  },
  {
    label: "2023-2024",
    courses: [
      { name: "Geometry", grade: "A-", percentage: 92 },
      { name: "English 10", grade: "A-", percentage: 90 },
      { name: "Biology", grade: "B+", percentage: 88 },
      { name: "U.S. History", grade: "B+", percentage: 87 },
      { name: "Studio Art", grade: "A", percentage: 96 },
      { name: "Physical Education 10", grade: "A", percentage: 93 },
      { name: "French 2", grade: "B", percentage: 84 },
    ],
  },
  {
    label: "2024-2025",
    courses: [
      { name: "Algebra 2", grade: "A", percentage: 93 },
      { name: "AP English Language", grade: "A-", percentage: 91 },
      { name: "Chemistry", grade: "B+", percentage: 89 },
      { name: "Government & Economics", grade: "A-", percentage: 90 },
      { name: "Advanced Art", grade: "A+", percentage: 97 },
      { name: "Physical Education 11", grade: "A", percentage: 94 },
      { name: "Spanish 1", grade: "C+", percentage: 78 },
    ],
  },
  {
    label: "2025-2026",
    courses: COURSES_DATA.map((c) => ({
      name: c.name,
      grade: c.grade,
      percentage: Math.round(c.percentage),
    })),
  },
];

interface SemRow {
  name: string;
  credits: string;
  grade: string;
}

export default function GradesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("grades");
  const [historyYear, setHistoryYear] = useState(0);
  const [calcTab, setCalcTab] = useState<CalcType>("course");

  // Course Grades calculator state
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [calcRows, setCalcRows] = useState<CalcRow[]>(Array(8).fill(null).map(() => ({ ...EMPTY_ROW })));
  const [finalGradeGoal, setFinalGradeGoal] = useState("");
  const [remainingWeight, setRemainingWeight] = useState("");
  const [calcResult, setCalcResult] = useState<{ grade: number; needed: number | null } | null>(null);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCalcResult(null);
    if (!courseId) {
      setCalcRows(Array(8).fill(null).map(() => ({ ...EMPTY_ROW })));
      return;
    }
    const course = COURSES_DATA.find(c => c.id === courseId);
    if (!course) return;

    const typeWeightMap: Record<string, number> = {
      Homework: course.gradingBreakdown.homework / course.assignments.filter(a => a.type === "Homework").length || 0,
      Quiz: course.gradingBreakdown.quizzes / course.assignments.filter(a => a.type === "Quiz").length || 0,
      Exam: course.gradingBreakdown.exams / course.assignments.filter(a => a.type === "Exam").length || 0,
      Project: course.gradingBreakdown.projects / course.assignments.filter(a => a.type === "Project").length || 0,
    };

    const filled: CalcRow[] = course.assignments.map(a => ({
      name: a.name,
      grade: String(Math.round((a.score / a.maxScore) * 100)),
      weight: String(Math.round((typeWeightMap[a.type] || 0) * 10) / 10),
    }));

    const padCount = Math.max(0, 8 - filled.length);
    setCalcRows([...filled, ...Array(padCount).fill(null).map(() => ({ ...EMPTY_ROW }))]);
  };

  const updateCalcRow = (index: number, field: keyof CalcRow, value: string) => {
    setCalcRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
    setCalcResult(null);
  };

  const addCalcRows = () => {
    setCalcRows(prev => [...prev, ...Array(3).fill(null).map(() => ({ ...EMPTY_ROW }))]);
  };

  const calculateCourseGrade = () => {
    const validRows = calcRows.filter(r => r.grade !== "" && r.weight !== "");
    if (validRows.length === 0) return;

    let weightedSum = 0;
    let totalWeight = 0;
    validRows.forEach(r => {
      const g = parseFloat(r.grade);
      const w = parseFloat(r.weight);
      if (!isNaN(g) && !isNaN(w)) {
        weightedSum += g * w;
        totalWeight += w;
      }
    });

    const currentGrade = totalWeight > 0 ? weightedSum / totalWeight : 0;

    let needed: number | null = null;
    if (finalGradeGoal && remainingWeight) {
      const goal = parseFloat(finalGradeGoal);
      const remW = parseFloat(remainingWeight);
      if (!isNaN(goal) && !isNaN(remW) && remW > 0) {
        needed = (goal * (totalWeight + remW) - weightedSum) / remW;
      }
    }

    setCalcResult({ grade: Math.round(currentGrade * 100) / 100, needed });
  };

  const clearCourseCalc = () => {
    setSelectedCourseId("");
    setCalcRows(Array(8).fill(null).map(() => ({ ...EMPTY_ROW })));
    setFinalGradeGoal("");
    setRemainingWeight("");
    setCalcResult(null);
  };

  // Semester GPA calculator state
  const makeSemRows = (): SemRow[] => {
    const filled: SemRow[] = COURSES_DATA.map(c => ({
      name: c.name,
      credits: "",
      grade: "-",
    }));
    const pad = Math.max(0, 5 - filled.length);
    return [...filled, ...Array(pad).fill(null).map((): SemRow => ({ name: "", credits: "", grade: "-" }))];
  };

  const [semRows, setSemRows] = useState<SemRow[]>(makeSemRows);
  const [semResult, setSemResult] = useState<number | null>(null);

  const updateSemRow = (i: number, field: keyof SemRow, value: string) => {
    setSemRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
    setSemResult(null);
  };

  const addSemRows = () => {
    setSemRows(prev => [...prev, ...Array(2).fill(null).map((): SemRow => ({ name: "", credits: "", grade: "-" }))]);
  };

  const calculateSemGPA = () => {
    let totalCredits = 0;
    let weightedSum = 0;
    semRows.forEach(r => {
      const cr = parseFloat(r.credits);
      const gpa = letterToGPA(r.grade);
      if (!isNaN(cr) && cr > 0 && gpa >= 0) {
        totalCredits += cr;
        weightedSum += gpa * cr;
      }
    });
    setSemResult(totalCredits > 0 ? Math.round((weightedSum / totalCredits) * 100) / 100 : 0);
  };

  const clearSemCalc = () => {
    setSemRows(prev => prev.map(r => ({ ...r, credits: "", grade: "-" })));
    setSemResult(null);
  };

  // Cumulative GPA calculator state
  interface CumSemester {
    id: string;
    label: string;
    courses: SemRow[];
  }

  const [cumPriorGPA, setCumPriorGPA] = useState("3.50");
  const [cumPriorCredits, setCumPriorCredits] = useState(String(COURSES_DATA.reduce((sum, c) => sum + c.credits, 0)));
  const [cumSemesters, setCumSemesters] = useState<CumSemester[]>([
    { id: "1", label: "Semester 1", courses: Array(4).fill(null).map((): SemRow => ({ name: "", credits: "", grade: "-" })) },
  ]);
  const [cumResult, setCumResult] = useState<{ semGPAs: number[]; cumulative: number } | null>(null);

  const updateCumCourse = (semIdx: number, courseIdx: number, field: keyof SemRow, value: string) => {
    setCumSemesters(prev => prev.map((sem, si) =>
      si === semIdx ? { ...sem, courses: sem.courses.map((c, ci) => ci === courseIdx ? { ...c, [field]: value } : c) } : sem
    ));
    setCumResult(null);
  };

  const addCumCourse = (semIdx: number) => {
    setCumSemesters(prev => prev.map((sem, si) =>
      si === semIdx ? { ...sem, courses: [...sem.courses, { name: "", credits: "", grade: "-" }] } : sem
    ));
  };

  const removeCumCourse = (semIdx: number, courseIdx: number) => {
    setCumSemesters(prev => prev.map((sem, si) =>
      si === semIdx ? { ...sem, courses: sem.courses.filter((_, ci) => ci !== courseIdx) } : sem
    ));
    setCumResult(null);
  };

  const addCumSemester = () => {
    const num = cumSemesters.length + 1;
    setCumSemesters(prev => [...prev, {
      id: String(Date.now()),
      label: `Semester ${num}`,
      courses: Array(4).fill(null).map((): SemRow => ({ name: "", credits: "", grade: "-" })),
    }]);
  };

  const removeCumSemester = (semIdx: number) => {
    setCumSemesters(prev => prev.filter((_, i) => i !== semIdx));
    setCumResult(null);
  };

  const calculateCumGPA = () => {
    let allCredits = 0;
    let allWeighted = 0;

    const priorGPA = parseFloat(cumPriorGPA);
    const priorCr = parseFloat(cumPriorCredits);
    if (!isNaN(priorGPA) && !isNaN(priorCr) && priorCr > 0) {
      allCredits += priorCr;
      allWeighted += priorGPA * priorCr;
    }

    const semGPAs: number[] = [];
    cumSemesters.forEach(sem => {
      let semCr = 0;
      let semW = 0;
      sem.courses.forEach(c => {
        const cr = parseFloat(c.credits);
        const gpa = letterToGPA(c.grade);
        if (!isNaN(cr) && cr > 0 && gpa >= 0) {
          semCr += cr;
          semW += gpa * cr;
          allCredits += cr;
          allWeighted += gpa * cr;
        }
      });
      semGPAs.push(semCr > 0 ? Math.round((semW / semCr) * 100) / 100 : 0);
    });

    setCumResult({
      semGPAs,
      cumulative: allCredits > 0 ? Math.round((allWeighted / allCredits) * 100) / 100 : 0,
    });
  };

  const clearCumCalc = () => {
    setCumPriorGPA("");
    setCumPriorCredits("");
    setCumSemesters([
      { id: "1", label: "Semester 1", courses: Array(4).fill(null).map((): SemRow => ({ name: "", credits: "", grade: "-" })) },
    ]);
    setCumResult(null);
  };

  const sortedCourses = [...COURSES_DATA].sort((a, b) => b.percentage - a.percentage);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-emerald-100 text-emerald-700";
    if (grade.startsWith("B")) return "bg-emerald-50 text-emerald-600";
    if (grade.startsWith("C")) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const currentGPA = (() => {
    const totalCredits = COURSES_DATA.reduce((sum, c) => sum + c.credits, 0);
    const weightedSum = COURSES_DATA.reduce((sum, c) => sum + (gradeToGPA(c.percentage) * c.credits), 0);
    return (weightedSum / totalCredits).toFixed(2);
  })();


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
          Grades
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {/* Current Quarter Grade - Blue */}
        <div className="bg-[#3b82f6] rounded-xl p-5 text-white">
          <p className="text-sm font-medium text-blue-100">Quarter Grade</p>
          <p className="mt-2 text-4xl font-bold">
            {Math.round(COURSES_DATA.reduce((s, c) => s + c.percentage, 0) / COURSES_DATA.length)}%
          </p>
          <p className="mt-2 text-sm text-blue-100">Q2 · Spring 2026</p>
        </div>

        {/* Semester Grade - Emerald */}
        <div className="bg-emerald-600 rounded-xl p-5 text-white">
          <p className="text-sm font-medium text-emerald-100">Semester Grade</p>
          <p className="mt-2 text-4xl font-bold">
            {Math.round((COURSES_DATA.reduce((s, c) => s + c.percentage, 0) / COURSES_DATA.length) + 1)}%
          </p>
          <p className="mt-2 text-sm text-emerald-100">S1 · Spring 2026</p>
        </div>

        {/* Cumulative GPA - White */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cumulative GPA</p>
          <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{currentGPA}</p>
          <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">4.0 Scale</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
        <div className="flex gap-4 sm:gap-6 min-w-max sm:min-w-0">
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
            onClick={() => setActiveTab("history")}
            className={`pb-3 px-1 text-sm font-medium transition-colors relative ${activeTab === "history"
              ? "text-[#3b82f6] border-b-2 border-[#3b82f6]"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            Grade History
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
        </div>
      </div>

      {/* Tab Content: My Grades */}
      {activeTab === "grades" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="py-4 px-5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[220px]">
                    Course
                  </th>
                  {(["Q1", "Q2", "S1", "Q3", "Q4", "S2", "Final"] as const).map((col) => (
                    <th
                      key={col}
                      className="py-4 px-4 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[80px]"
                    >
                      {col === "Final" ? "Final Grade" : col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedCourses.map((course) => {
                  const q1Offset = ((parseInt(course.id, 10) * 7) % 5) - 2;
                  const q1Pct = Math.round(course.percentage + q1Offset);
                  const q2Pct = Math.round(course.percentage);
                  const q1Letter = percentageToLetter(q1Pct);
                  const q2Letter = percentageToLetter(q2Pct);
                  return (
                    <tr
                      key={course.id}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <Link
                          href={`/lis/student/courses/${course.id}`}
                          className="group flex items-center gap-3"
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: course.color }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 transition-colors truncate">
                              {course.name}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                              {course.instructor}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${getGradeColor(q1Letter)}`}>
                          {q1Pct}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${getGradeColor(q2Letter)}`}>
                          {q2Pct}%
                        </span>
                      </td>
                      {["S1", "Q3", "Q4", "S2", "Final"].map((col) => (
                        <td key={col} className="py-4 px-4 text-center">
                          <span className="text-gray-300 dark:text-gray-600 text-xs font-medium">—</span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Grade History */}
      {activeTab === "history" && (
        <div className="space-y-5">
          {/* Year tabs */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {GRADE_HISTORY.map((year, i) => (
              <button
                key={year.label}
                onClick={() => setHistoryYear(i)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  historyYear === i
                    ? "bg-[#1e3a8a] text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {year.label}
              </button>
            ))}
          </div>

          {/* History table */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="py-4 px-5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="py-4 px-5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]">
                    Grade
                  </th>
                  <th className="py-4 px-5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[100px]">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {GRADE_HISTORY[historyYear].courses.map((course, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-5 text-sm font-medium text-gray-900 dark:text-white">
                      {course.name}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${getGradeColor(course.grade)}`}>
                        {course.grade}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {course.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: GPA Calculator */}
      {activeTab === "calculator" && (
        <div className="space-y-6">
          {/* GPA Scale - Compact */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">GPA Scale (4.0)</h3>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
              {[
                { grade: "A+", gpa: "4.0" }, { grade: "A", gpa: "4.0" }, { grade: "A-", gpa: "3.7" },
                { grade: "B+", gpa: "3.3" }, { grade: "B", gpa: "3.0" }, { grade: "B-", gpa: "2.7" },
                { grade: "C+", gpa: "2.3" }, { grade: "C", gpa: "2.0" }, { grade: "C-", gpa: "1.7" },
                { grade: "D+", gpa: "1.3" }, { grade: "D", gpa: "1.0" }, { grade: "F", gpa: "0.0" },
              ].map((item) => (
                <div key={item.grade} className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900 dark:text-white">{item.grade}</span>
                  <span className="text-gray-400">=</span>
                  <span className="font-medium text-[#1e3a8a] dark:text-blue-400">{item.gpa}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator Sub-tabs */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-800">
              {([
                { id: "course" as CalcType, label: "Course Grades" },
                { id: "semester" as CalcType, label: "Semester GPA" },
                { id: "cumulative" as CalcType, label: "Cumulative GPA" },
              ]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCalcTab(tab.id)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${calcTab === tab.id
                    ? "bg-[#1e3a8a] text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {calcTab === "course" && (
                <div className="space-y-6">
                  {/* Course Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select a class to auto-fill grades
                    </label>
                    <select
                      value={selectedCourseId}
                      onChange={(e) => handleCourseSelect(e.target.value)}
                      className="w-full sm:w-72 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option value="">Choose a class...</option>
                      {COURSES_DATA.map(c => (
                        <option key={c.id} value={c.id}>{c.name} — {c.instructor}</option>
                      ))}
                    </select>
                  </div>

                  {/* Assignment Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2.5 pr-3 font-semibold text-gray-700 dark:text-gray-300 w-1/2">
                            Assignment / Exam <span className="font-normal text-gray-400">(optional)</span>
                          </th>
                          <th className="text-left py-2.5 px-3 font-semibold text-gray-700 dark:text-gray-300 w-1/4">
                            Grade
                          </th>
                          <th className="text-left py-2.5 pl-3 font-semibold text-gray-700 dark:text-gray-300 w-1/4">
                            Weight
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {calcRows.map((row, i) => (
                          <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1.5 pr-3">
                              <input
                                type="text"
                                value={row.name}
                                onChange={(e) => updateCalcRow(i, "name", e.target.value)}
                                placeholder={`Assignment ${i + 1}`}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="text"
                                value={row.grade}
                                onChange={(e) => updateCalcRow(i, "grade", e.target.value)}
                                placeholder="90"
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                              />
                            </td>
                            <td className="py-1.5 pl-3">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={row.weight}
                                  onChange={(e) => updateCalcRow(i, "weight", e.target.value)}
                                  placeholder="20"
                                  className="w-full pl-3 pr-7 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]"
                                />
                                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={addCalcRows}
                    className="text-sm font-medium text-[#1e3a8a] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    add more rows
                  </button>

                  {/* Final Grade Planning */}
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-[#1e3a8a] px-4 py-2.5">
                      <h4 className="text-sm font-semibold text-white">Final Grade Planning (Optional)</h4>
                    </div>
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Final Grade Goal</label>
                        <input
                          type="text"
                          value={finalGradeGoal}
                          onChange={(e) => { setFinalGradeGoal(e.target.value); setCalcResult(null); }}
                          placeholder="90"
                          className="w-24 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                        />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Weight of Remaining Tasks</label>
                        <div className="relative w-24">
                          <input
                            type="text"
                            value={remainingWeight}
                            onChange={(e) => { setRemainingWeight(e.target.value); setCalcResult(null); }}
                            placeholder="30"
                            className="w-full pl-7 pr-7 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Result */}
                  {calcResult && (
                    <div className="rounded-lg bg-[#1e3a8a]/5 dark:bg-[#1e3a8a]/10 border border-[#1e3a8a]/20 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Weighted Grade</span>
                        <span className="text-2xl font-bold text-[#1e3a8a] dark:text-blue-400">{calcResult.grade}%</span>
                      </div>
                      {calcResult.needed !== null && (
                        <div className="flex items-center justify-between pt-2 border-t border-[#1e3a8a]/10">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade Needed on Remaining</span>
                          <span className={`text-2xl font-bold ${calcResult.needed > 100 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {Math.round(calcResult.needed * 100) / 100}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={calculateCourseGrade}
                      className="px-6 py-2.5 bg-[#1e3a8a] text-white rounded-lg text-sm font-semibold hover:bg-[#162554] transition-colors"
                    >
                      Calculate
                    </button>
                    <button
                      onClick={clearCourseCalc}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  </div>
                </div>
              )}
              {calcTab === "semester" && (
                <div className="space-y-6">
                  {/* Semester Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2.5 pr-3 font-semibold text-gray-700 dark:text-gray-300 w-1/2">
                            Course
                          </th>
                          <th className="text-left py-2.5 px-3 font-semibold text-gray-700 dark:text-gray-300 w-1/4">
                            Credits
                          </th>
                          <th className="text-left py-2.5 pl-3 font-semibold text-gray-700 dark:text-gray-300 w-1/4">
                            Grade
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {semRows.map((row, i) => (
                          <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-1.5 pr-3">
                              <input
                                type="text"
                                value={row.name}
                                onChange={(e) => updateSemRow(i, "name", e.target.value)}
                                placeholder={`Course ${i + 1}`}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]"
                              />
                            </td>
                            <td className="py-1.5 px-3">
                              <input
                                type="text"
                                value={row.credits}
                                onChange={(e) => updateSemRow(i, "credits", e.target.value)}
                                placeholder="3"
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]"
                              />
                            </td>
                            <td className="py-1.5 pl-3">
                              <select
                                value={row.grade}
                                onChange={(e) => updateSemRow(i, "grade", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a] appearance-none"
                              >
                                {GRADE_OPTIONS.map(g => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Result */}
                  {semResult !== null && (
                    <div className="rounded-lg bg-[#1e3a8a]/5 dark:bg-[#1e3a8a]/10 border border-[#1e3a8a]/20 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Semester GPA</span>
                        <span className="text-2xl font-bold text-[#1e3a8a] dark:text-blue-400">{semResult.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={calculateSemGPA}
                      className="px-6 py-2.5 bg-[#1e3a8a] text-white rounded-lg text-sm font-semibold hover:bg-[#162554] transition-colors"
                    >
                      Calculate
                    </button>
                    <button
                      onClick={clearSemCalc}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  </div>
                </div>
              )}
              {calcTab === "cumulative" && (
                <div className="space-y-6">
                  {/* Current GPA (Optional) */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2.5 pr-3 font-semibold text-gray-700 dark:text-gray-300 w-1/2">
                            Current GPA
                          </th>
                          <th className="text-left py-2.5 pl-3 font-semibold text-gray-700 dark:text-gray-300 w-1/2">
                            Total Credits
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-1.5 pr-3">
                            <input
                              type="text"
                              value={cumPriorGPA}
                              onChange={(e) => { setCumPriorGPA(e.target.value); setCumResult(null); }}
                              placeholder="3.50"
                              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]"
                            />
                          </td>
                          <td className="py-1.5 pl-3">
                            <input
                              type="text"
                              value={cumPriorCredits}
                              onChange={(e) => { setCumPriorCredits(e.target.value); setCumResult(null); }}
                              placeholder="25"
                              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Semesters */}
                  {cumSemesters.map((sem, semIdx) => (
                    <div key={sem.id} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e3a8a]">
                        <h4 className="text-sm font-semibold text-white">{sem.label}</h4>
                        {cumSemesters.length > 1 && (
                          <button
                            onClick={() => removeCumSemester(semIdx)}
                            className="text-xs text-white/60 hover:text-white transition-colors"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        {sem.courses.map((course, courseIdx) => (
                          <div key={courseIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={course.name}
                              onChange={(e) => updateCumCourse(semIdx, courseIdx, "name", e.target.value)}
                              placeholder="Course name"
                              className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]"
                            />
                            <select
                              value={course.grade}
                              onChange={(e) => updateCumCourse(semIdx, courseIdx, "grade", e.target.value)}
                              className="w-20 px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]"
                            >
                              {GRADE_OPTIONS.map(g => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={course.credits}
                              onChange={(e) => updateCumCourse(semIdx, courseIdx, "credits", e.target.value)}
                              placeholder="Credits"
                              className="w-20 px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1e3a8a]"
                            />
                          </div>
                        ))}

                        <div className="flex items-center justify-between pt-2">
                          {cumResult && (
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {sem.label} GPA: <span className="text-[#1e3a8a] dark:text-blue-400">{cumResult.semGPAs[semIdx]?.toFixed(2) ?? "0.00"}</span>
                            </span>
                          )}
                          <button
                            onClick={() => addCumCourse(semIdx)}
                            className="text-sm font-medium text-[#1e3a8a] hover:underline flex items-center gap-1 ml-auto"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add Course
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Semester */}
                  <button
                    onClick={addCumSemester}
                    className="text-sm font-medium text-[#1e3a8a] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Semester
                  </button>

                  {/* Cumulative Result */}
                  {cumResult && (
                    <div className="rounded-lg bg-[#1e3a8a]/5 dark:bg-[#1e3a8a]/10 border border-[#1e3a8a]/20 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cumulative GPA</span>
                        <span className="text-2xl font-bold text-[#1e3a8a] dark:text-blue-400">{cumResult.cumulative.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={calculateCumGPA}
                      className="px-6 py-2.5 bg-[#1e3a8a] text-white rounded-lg text-sm font-semibold hover:bg-[#162554] transition-colors"
                    >
                      Calculate
                    </button>
                    <button
                      onClick={clearCumCalc}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
