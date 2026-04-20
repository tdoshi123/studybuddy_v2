"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { ClipboardList, CheckCircle2, Plus, X, Info, AlertTriangle } from "lucide-react";

const STUDENTS = [
  { id: "1", name: "Alex Johnson", currentGrade: "5th Grade", upcomingGrade: "6th Grade" },
  { id: "2", name: "Emma Johnson", currentGrade: "3rd Grade", upcomingGrade: "4th Grade" },
];

type CourseStatus = "required" | "elective";
type RegistrationStatus = "open" | "waitlist" | "closed";

interface Course {
  id: string;
  name: string;
  teacher: string;
  period: string;
  credits: number;
  status: CourseStatus;
  registrationStatus: RegistrationStatus;
  spots: number;
  totalSpots: number;
  description: string;
  prerequisites?: string;
  category: string;
}

const ALEX_COURSES: Course[] = [
  // Required
  { id: "a-ela6", name: "English Language Arts 6", teacher: "Mrs. Patterson", period: "Period 1", credits: 1.0, status: "required", registrationStatus: "open", spots: 8, totalSpots: 28, description: "Comprehensive ELA covering literary analysis, argumentative writing, grammar, and vocabulary for 6th grade students.", category: "Core" },
  { id: "a-math6", name: "Math 6", teacher: "Mr. Torres", period: "Period 2", credits: 1.0, status: "required", registrationStatus: "open", spots: 5, totalSpots: 28, description: "Ratios, proportional relationships, expressions, equations, and introductory statistics.", category: "Core" },
  { id: "a-sci6", name: "Earth Science", teacher: "Ms. Nakamura", period: "Period 3", credits: 1.0, status: "required", registrationStatus: "open", spots: 12, totalSpots: 28, description: "Earth's systems, weather, climate, geology, and environmental science with hands-on lab work.", category: "Core" },
  { id: "a-ss6", name: "World History & Geography", teacher: "Mr. Okafor", period: "Period 4", credits: 1.0, status: "required", registrationStatus: "open", spots: 10, totalSpots: 28, description: "Ancient civilizations, geography skills, and cultural development from prehistory to the Middle Ages.", category: "Core" },
  { id: "a-pe6", name: "Physical Education 6", teacher: "Coach Davis", period: "Period 7", credits: 0.5, status: "required", registrationStatus: "open", spots: 15, totalSpots: 30, description: "Fitness fundamentals, team sports, health education, and personal wellness.", category: "Core" },
  // Electives
  { id: "a-band", name: "Beginning Band", teacher: "Mr. Whitfield", period: "Period 5", credits: 0.5, status: "elective", registrationStatus: "open", spots: 6, totalSpots: 24, description: "Introduction to wind, brass, and percussion instruments. Students will learn music reading, ensemble skills, and perform in two concerts per year.", prerequisites: "None", category: "Fine Arts" },
  { id: "a-art6", name: "Visual Art 6", teacher: "Ms. Castellano", period: "Period 5", credits: 0.5, status: "elective", registrationStatus: "open", spots: 3, totalSpots: 22, description: "Drawing, painting, sculpture, and digital art. Students explore elements of design and art history.", category: "Fine Arts" },
  { id: "a-choir", name: "Chorus", teacher: "Mrs. Lin", period: "Period 5", credits: 0.5, status: "elective", registrationStatus: "waitlist", spots: 0, totalSpots: 30, description: "Vocal technique, sight-reading, and choral performance. Two concerts per year plus a regional festival.", category: "Fine Arts" },
  { id: "a-span", name: "Intro to Spanish", teacher: "Sra. Reyes", period: "Period 6", credits: 0.5, status: "elective", registrationStatus: "open", spots: 9, totalSpots: 26, description: "Foundational Spanish vocabulary, grammar, pronunciation, and cultural exploration.", category: "World Languages" },
  { id: "a-french", name: "Intro to French", teacher: "M. Dubois", period: "Period 6", credits: 0.5, status: "elective", registrationStatus: "open", spots: 11, totalSpots: 26, description: "Foundational French vocabulary, grammar, pronunciation, and cultural exploration.", category: "World Languages" },
  { id: "a-tech", name: "Technology & Coding", teacher: "Mr. Kapoor", period: "Period 6", credits: 0.5, status: "elective", registrationStatus: "open", spots: 4, totalSpots: 24, description: "Introduction to Scratch, HTML/CSS basics, digital citizenship, and computational thinking.", category: "STEM" },
  { id: "a-robot", name: "Robotics Club", teacher: "Mr. Kapoor", period: "Period 6", credits: 0.5, status: "elective", registrationStatus: "closed", spots: 0, totalSpots: 16, description: "Hands-on LEGO robotics, programming, and competitive team challenges.", category: "STEM" },
];

const EMMA_COURSES: Course[] = [
  // Required
  { id: "e-ela4", name: "Reading & Writing 4", teacher: "Mrs. Chen", period: "Period 1", credits: 1.0, status: "required", registrationStatus: "open", spots: 6, totalSpots: 24, description: "Reading comprehension, creative and expository writing, grammar, and spelling for 4th graders.", category: "Core" },
  { id: "e-math4", name: "Math 4", teacher: "Mr. Brooks", period: "Period 2", credits: 1.0, status: "required", registrationStatus: "open", spots: 7, totalSpots: 24, description: "Multi-digit multiplication, fractions, decimals, geometry basics, and measurement.", category: "Core" },
  { id: "e-sci4", name: "Science 4", teacher: "Ms. Rivera", period: "Period 3", credits: 1.0, status: "required", registrationStatus: "open", spots: 10, totalSpots: 24, description: "Life science, earth science, and physical science with hands-on experiments and observation journals.", category: "Core" },
  { id: "e-ss4", name: "Social Studies 4", teacher: "Mrs. Hall", period: "Period 4", credits: 1.0, status: "required", registrationStatus: "open", spots: 9, totalSpots: 24, description: "State history, geography, government, and community. Includes a research project.", category: "Core" },
  { id: "e-pe4", name: "Physical Education", teacher: "Coach Miller", period: "Period 6", credits: 0.5, status: "required", registrationStatus: "open", spots: 14, totalSpots: 26, description: "Movement skills, team games, fitness activities, and sportsmanship.", category: "Core" },
  // Electives
  { id: "e-art4", name: "Art 4", teacher: "Ms. Castellano", period: "Period 5", credits: 0.5, status: "elective", registrationStatus: "open", spots: 5, totalSpots: 22, description: "Drawing, painting, collage, and sculpture. Students develop creativity and learn about famous artists.", category: "Fine Arts" },
  { id: "e-music4", name: "Music 4", teacher: "Mrs. Lin", period: "Period 5", credits: 0.5, status: "elective", registrationStatus: "open", spots: 8, totalSpots: 24, description: "Singing, rhythm, recorder basics, music appreciation, and one performance per semester.", category: "Fine Arts" },
  { id: "e-drama", name: "Creative Drama", teacher: "Ms. Kowalski", period: "Period 5", credits: 0.5, status: "elective", registrationStatus: "waitlist", spots: 0, totalSpots: 20, description: "Improvisation, storytelling, puppetry, and a short class play. Builds confidence and public speaking skills.", category: "Fine Arts" },
  { id: "e-stem4", name: "STEM Explorers", teacher: "Mr. Kapoor", period: "Period 5", credits: 0.5, status: "elective", registrationStatus: "open", spots: 3, totalSpots: 20, description: "Fun, project-based intro to science and engineering. Build bridges, code simple programs, and conduct experiments.", category: "STEM" },
];

const STUDENT_COURSES: Record<string, Course[]> = {
  "1": ALEX_COURSES,
  "2": EMMA_COURSES,
};

const REGISTRATION_STATUS_CONFIG: Record<RegistrationStatus, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  waitlist: { label: "Waitlist", color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
  closed: { label: "Closed", color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-100 dark:bg-slate-800" },
};

export default function ClassRegistrationPage() {
  const selectedStudent = STUDENTS[0];
  const [registered, setRegistered] = useState<Set<string>>(new Set());
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);
  const [confirmDrop, setConfirmDrop] = useState<Course | null>(null);

  const allCourses = STUDENT_COURSES[selectedStudent.id] ?? [];

  const registeredCourses = allCourses.filter((c) => registered.has(c.id));
  const totalCredits = registeredCourses.reduce((sum, c) => sum + c.credits, 0);

  const handleRegister = (course: Course) => {
    setRegistered((prev) => new Set(prev).add(course.id));
  };

  const handleDrop = (course: Course) => {
    setRegistered((prev) => {
      const next = new Set(prev);
      next.delete(course.id);
      return next;
    });
    setConfirmDrop(null);
  };

  const categories = [...new Set(allCourses.map((c) => c.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-violet-50 dark:bg-violet-950/40">
            <ClipboardList className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Class Registration</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">2026–2027 School Year</p>
          </div>
        </div>
        {registeredCourses.length > 0 && (
          <div className="text-right">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Registered</p>
            <p className="text-lg font-bold text-[#1e3a8a] dark:text-blue-400">{registeredCourses.length} classes · {totalCredits} credits</p>
          </div>
        )}
      </div>

      {/* Registered courses summary */}
      {registeredCourses.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4">
          <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Your Selections</h2>
          <div className="flex flex-wrap gap-2">
            {registeredCourses.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e3a8a]/10 dark:bg-blue-950/40 text-[#1e3a8a] dark:text-blue-400 text-sm font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {c.name}
                <button
                  onClick={() => setConfirmDrop(c)}
                  className="ml-1 p-0.5 rounded hover:bg-[#1e3a8a]/20 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      

      {/* Course listings by category */}
      {categories.map((category) => {
        const categoryCourses = allCourses.filter((c) => c.category === category);
        if (categoryCourses.length === 0) return null;
        return (
          <section key={category}>
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">{category}</h2>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-slate-800">
              {categoryCourses.map((course) => {
                const isRegistered = registered.has(course.id);
                const regStatus = REGISTRATION_STATUS_CONFIG[course.registrationStatus];
                const canRegister = course.registrationStatus === "open" || course.registrationStatus === "waitlist";
                return (
                  <div key={course.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => setDetailCourse(course)}
                          className="text-sm font-semibold text-gray-900 dark:text-white hover:text-[#1e3a8a] dark:hover:text-blue-400 transition-colors text-left"
                        >
                          {course.name}
                        </button>
                        {course.status === "required" && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">REQUIRED</span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${regStatus.bg} ${regStatus.color}`}>
                          {regStatus.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {course.teacher} · {course.period} · {course.credits} credit{course.credits !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {course.registrationStatus === "closed" ? "Full" : `${course.spots}/${course.totalSpots} spots`}
                      </span>
                      {isRegistered ? (
                        <button
                          onClick={() => setConfirmDrop(course)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Registered
                        </button>
                      ) : canRegister ? (
                        <button
                          onClick={() => handleRegister(course)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e3a8a] text-white text-xs font-bold hover:bg-[#162d6e] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {course.registrationStatus === "waitlist" ? "Join Waitlist" : "Register"}
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 text-xs font-bold">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {allCourses.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No courses available</p>
        </div>
      )}

      {/* Course detail modal */}
      {detailCourse && createPortal(
        (() => {
          const regStatus = REGISTRATION_STATUS_CONFIG[detailCourse.registrationStatus];
          const isRegistered = registered.has(detailCourse.id);
          const canRegister = detailCourse.registrationStatus === "open" || detailCourse.registrationStatus === "waitlist";
          const spotsPct = detailCourse.totalSpots > 0 ? ((detailCourse.totalSpots - detailCourse.spots) / detailCourse.totalSpots) * 100 : 100;
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => setDetailCourse(null)} />
              <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden max-h-[85vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30 flex-shrink-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{detailCourse.name}</p>
                      {detailCourse.status === "required" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400">REQUIRED</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{detailCourse.category}</p>
                  </div>
                  <button onClick={() => setDetailCourse(null)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0">
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="px-6 py-5 overflow-y-auto flex-1 space-y-5">
                  <div className="space-y-2.5">
                    {[
                      { label: "Teacher", value: detailCourse.teacher },
                      { label: "Period", value: detailCourse.period },
                      { label: "Credits", value: `${detailCourse.credits}` },
                      ...(detailCourse.prerequisites ? [{ label: "Prerequisites", value: detailCourse.prerequisites }] : []),
                    ].map((row, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-24 flex-shrink-0 pt-0.5 uppercase tracking-wide">{row.label}</span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{detailCourse.description}</p>

                  {/* Enrollment bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Enrollment</span>
                      <span className={`text-xs font-bold ${regStatus.color}`}>{regStatus.label} · {detailCourse.spots} spots left</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${spotsPct > 85 ? "bg-red-500" : spotsPct > 60 ? "bg-amber-500" : "bg-emerald-500"}`}
                        style={{ width: `${spotsPct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{detailCourse.totalSpots - detailCourse.spots} of {detailCourse.totalSpots} enrolled</p>
                  </div>

                  {isRegistered ? (
                    <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Registered for this course</p>
                    </div>
                  ) : canRegister ? (
                    <button
                      onClick={() => { handleRegister(detailCourse); setDetailCourse(null); }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1e3a8a] text-white text-sm font-semibold hover:bg-[#162d6e] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {detailCourse.registrationStatus === "waitlist" ? "Join Waitlist" : "Register for This Course"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                      <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">This course is full. Contact the school for options.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}

      {/* Drop confirmation modal */}
      {confirmDrop && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDrop(null)} />
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-5 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Drop Course?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Remove <span className="font-semibold text-gray-700 dark:text-gray-200">{confirmDrop.name}</span> from {selectedStudent.name}&apos;s registration?
              </p>
            </div>
            <div className="flex border-t border-gray-100 dark:border-slate-800">
              <button
                onClick={() => setConfirmDrop(null)}
                className="flex-1 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDrop(confirmDrop)}
                className="flex-1 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-l border-gray-100 dark:border-slate-800"
              >
                Drop Course
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
