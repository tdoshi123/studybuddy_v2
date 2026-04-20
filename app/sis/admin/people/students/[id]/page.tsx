"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Activity,
  Briefcase,
  Edit,
  MoreHorizontal,
  User,
  BookOpen,
  GraduationCap,
  CalendarCheck,
  ShieldAlert,
  HeartPulse,
  Target,
  Landmark,
  School,
  CreditCard,
  Layers,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ScheduleEntry {
  period: string;
  course: string;
  term: string;
  gradePercent: number | null;
  absences: number;
  tardies: number;
  teacher: string;
  room: string;
}

interface ParentInfo {
  name: string;
  relationship: string;
  email: string;
  homePhone: string;
  workPhone: string;
  employer: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  homePhone: string;
  workPhone: string;
  cellPhone: string;
}

interface FamilyMember {
  name: string;
  grade: string;
  studentId: string;
}

interface StudentDetail {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  homeroom: string;
  counselor: string;
  status: "Active" | "Inactive" | "Transferred";
  email: string;
  enrollmentDate: string;
  stateStudentNumber: string;
  photoUrl: string | null;

  guardian: string;
  homePhone: string;
  address: string;
  city: string;
  state: string;
  zip: string;

  busRoute: string;
  busStop: string;
  lockerNumber: string;
  lockerCombo: string;

  activities: string[];

  schedule: ScheduleEntry[];
  family: FamilyMember[];
  parents: ParentInfo[];
  emergencyContacts: EmergencyContact[];
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const STUDENT_IDS = ["1", "2", "3", "4", "5", "6", "7", "8"];

const STUDENTS: Record<string, StudentDetail> = {
  "1": {
    id: "1", studentId: "STU-1001", firstName: "Emma", lastName: "Johnson", gradeLevel: "10th",
    dateOfBirth: "2010-03-15", age: 16, gender: "Female", homeroom: "Room 204", counselor: "Jessica Adams", status: "Active",
    email: "emma.j@school.edu", enrollmentDate: "2024-08-15", stateStudentNumber: "SS-4421001",
    photoUrl: null,
    guardian: "Linda Johnson", homePhone: "(555) 200-0001",
    address: "1234 Maple Avenue", city: "Springfield", state: "IL", zip: "62704",
    busRoute: "Route 12", busStop: "Maple Ave & 3rd St",
    lockerNumber: "A-204", lockerCombo: "32-18-7",
    activities: ["Volleyball", "Student Council", "Drama Club"],
    schedule: [
      { period: "1", course: "English 10 Honors", term: "Full Year", gradePercent: 94, absences: 2, tardies: 1, teacher: "R. Lee", room: "204" },
      { period: "2", course: "Algebra II", term: "Full Year", gradePercent: 88, absences: 1, tardies: 0, teacher: "S. Thompson", room: "108" },
      { period: "3", course: "Biology", term: "Full Year", gradePercent: 91, absences: 3, tardies: 2, teacher: "M. Chen", room: "312" },
      { period: "4", course: "World History", term: "Full Year", gradePercent: 86, absences: 1, tardies: 0, teacher: "D. Miller", room: "205" },
      { period: "5", course: "Spanish II", term: "Full Year", gradePercent: 92, absences: 0, tardies: 1, teacher: "A. Reyes", room: "118" },
      { period: "6", course: "Physical Education", term: "Semester 1", gradePercent: null, absences: 0, tardies: 0, teacher: "K. Morris", room: "GYM" },
      { period: "7", course: "Art Studio", term: "Semester 2", gradePercent: 95, absences: 1, tardies: 0, teacher: "L. Park", room: "ART" },
    ],
    family: [{ name: "Jake Johnson", grade: "7th", studentId: "STU-1020" }],
    parents: [
      { name: "Linda Johnson", relationship: "Mother", email: "linda.j@email.com", homePhone: "(555) 200-0001", workPhone: "(555) 300-0001", employer: "Springfield Medical Center" },
      { name: "Robert Johnson", relationship: "Father", email: "robert.j@email.com", homePhone: "(555) 200-0001", workPhone: "(555) 300-0012", employer: "Johnson & Associates Law" },
    ],
    emergencyContacts: [
      { name: "Linda Johnson", relationship: "Mother", homePhone: "(555) 200-0001", workPhone: "(555) 300-0001", cellPhone: "(555) 400-0001" },
      { name: "Margaret Johnson", relationship: "Grandmother", homePhone: "(555) 200-0099", workPhone: "", cellPhone: "(555) 400-0099" },
    ],
  },
  "2": {
    id: "2", studentId: "STU-1002", firstName: "Liam", lastName: "Williams", gradeLevel: "11th",
    dateOfBirth: "2009-07-22", age: 16, gender: "Male", homeroom: "Room 108", counselor: "Jessica Adams", status: "Active",
    email: "liam.w@school.edu", enrollmentDate: "2023-08-20", stateStudentNumber: "SS-4421002",
    photoUrl: null,
    guardian: "Mark Williams", homePhone: "(555) 200-0002",
    address: "567 Oak Street", city: "Springfield", state: "IL", zip: "62704",
    busRoute: "Route 7", busStop: "Oak St & Pine Blvd",
    lockerNumber: "B-108", lockerCombo: "14-26-9",
    activities: ["Basketball", "Math Club"],
    schedule: [
      { period: "1", course: "AP English Language", term: "Full Year", gradePercent: 82, absences: 4, tardies: 3, teacher: "R. Lee", room: "204" },
      { period: "2", course: "Pre-Calculus", term: "Full Year", gradePercent: 78, absences: 2, tardies: 1, teacher: "S. Thompson", room: "108" },
      { period: "3", course: "Chemistry", term: "Full Year", gradePercent: 85, absences: 3, tardies: 0, teacher: "M. Chen", room: "312" },
      { period: "4", course: "US History", term: "Full Year", gradePercent: 80, absences: 2, tardies: 2, teacher: "D. Miller", room: "205" },
      { period: "5", course: "Computer Science", term: "Full Year", gradePercent: 91, absences: 1, tardies: 0, teacher: "J. Adams", room: "LAB" },
      { period: "6", course: "Physical Education", term: "Semester 1", gradePercent: null, absences: 1, tardies: 0, teacher: "K. Morris", room: "GYM" },
    ],
    family: [],
    parents: [
      { name: "Mark Williams", relationship: "Father", email: "mark.w@email.com", homePhone: "(555) 200-0002", workPhone: "(555) 300-0020", employer: "Williams Construction" },
      { name: "Diana Williams", relationship: "Mother", email: "diana.w@email.com", homePhone: "(555) 200-0002", workPhone: "(555) 300-0021", employer: "Springfield Elementary" },
    ],
    emergencyContacts: [
      { name: "Mark Williams", relationship: "Father", homePhone: "(555) 200-0002", workPhone: "(555) 300-0020", cellPhone: "(555) 400-0002" },
    ],
  },
  "3": {
    id: "3", studentId: "STU-1003", firstName: "Olivia", lastName: "Brown", gradeLevel: "9th",
    dateOfBirth: "2011-11-08", age: 14, gender: "Female", homeroom: "Room 312", counselor: "Jessica Adams", status: "Active",
    email: "olivia.b@school.edu", enrollmentDate: "2025-08-18", stateStudentNumber: "SS-4421003",
    photoUrl: null,
    guardian: "Gregory Brown", homePhone: "(555) 200-0004",
    address: "890 Elm Drive", city: "Springfield", state: "IL", zip: "62701",
    busRoute: "Route 3", busStop: "Elm Dr & Walnut Ln",
    lockerNumber: "C-312", lockerCombo: "7-33-21",
    activities: ["Soccer", "Art Club", "Science Olympiad", "Debate Team"],
    schedule: [
      { period: "1", course: "English 9", term: "Full Year", gradePercent: 96, absences: 0, tardies: 0, teacher: "P. Walsh", room: "210" },
      { period: "2", course: "Geometry", term: "Full Year", gradePercent: 93, absences: 1, tardies: 0, teacher: "S. Thompson", room: "108" },
      { period: "3", course: "Earth Science", term: "Full Year", gradePercent: 97, absences: 0, tardies: 1, teacher: "M. Chen", room: "312" },
      { period: "4", course: "World Geography", term: "Full Year", gradePercent: 91, absences: 1, tardies: 0, teacher: "D. Miller", room: "205" },
      { period: "5", course: "French I", term: "Full Year", gradePercent: 94, absences: 0, tardies: 0, teacher: "C. Laurent", room: "120" },
      { period: "6", course: "Health & Wellness", term: "Semester 1", gradePercent: null, absences: 0, tardies: 0, teacher: "K. Morris", room: "GYM" },
      { period: "7", course: "Introduction to Art", term: "Semester 2", gradePercent: 98, absences: 0, tardies: 0, teacher: "L. Park", room: "ART" },
    ],
    family: [{ name: "Tyler Brown", grade: "6th", studentId: "STU-1021" }],
    parents: [
      { name: "Gregory Brown", relationship: "Father", email: "greg.b@email.com", homePhone: "(555) 200-0004", workPhone: "(555) 300-0040", employer: "Brown Financial Advisors" },
      { name: "Susan Brown", relationship: "Mother", email: "susan.b@email.com", homePhone: "(555) 200-0004", workPhone: "(555) 300-0041", employer: "Springfield Public Library" },
    ],
    emergencyContacts: [
      { name: "Susan Brown", relationship: "Mother", homePhone: "(555) 200-0004", workPhone: "(555) 300-0041", cellPhone: "(555) 400-0004" },
      { name: "Gregory Brown", relationship: "Father", homePhone: "(555) 200-0004", workPhone: "(555) 300-0040", cellPhone: "(555) 400-0005" },
    ],
  },
  "4": {
    id: "4", studentId: "STU-1004", firstName: "Noah", lastName: "Davis", gradeLevel: "12th",
    dateOfBirth: "2008-01-30", age: 18, gender: "Male", homeroom: "Room 101", counselor: "Jessica Adams", status: "Active",
    email: "noah.d@school.edu", enrollmentDate: "2022-08-22", stateStudentNumber: "SS-4421004",
    photoUrl: null,
    guardian: "Patricia Davis", homePhone: "(555) 200-0005",
    address: "321 Birch Lane", city: "Springfield", state: "IL", zip: "62702",
    busRoute: "Route 9", busStop: "Birch Ln & Main St",
    lockerNumber: "A-101", lockerCombo: "19-8-42",
    activities: ["Football", "National Honor Society", "Yearbook"],
    schedule: [
      { period: "1", course: "AP Literature", term: "Full Year", gradePercent: 87, absences: 3, tardies: 1, teacher: "R. Lee", room: "204" },
      { period: "2", course: "AP Calculus AB", term: "Full Year", gradePercent: 82, absences: 2, tardies: 0, teacher: "S. Thompson", room: "108" },
      { period: "3", course: "AP Physics", term: "Full Year", gradePercent: 79, absences: 4, tardies: 1, teacher: "M. Chen", room: "312" },
      { period: "4", course: "Government & Economics", term: "Full Year", gradePercent: 90, absences: 1, tardies: 0, teacher: "D. Miller", room: "205" },
      { period: "5", course: "Senior Seminar", term: "Full Year", gradePercent: 95, absences: 0, tardies: 0, teacher: "E. Clark", room: "101" },
    ],
    family: [],
    parents: [
      { name: "Patricia Davis", relationship: "Mother", email: "pat.d@email.com", homePhone: "(555) 200-0005", workPhone: "(555) 300-0050", employer: "Davis Medical Practice" },
      { name: "Charles Davis", relationship: "Father", email: "charles.d@email.com", homePhone: "(555) 200-0005", workPhone: "(555) 300-0051", employer: "Springfield Fire Department" },
    ],
    emergencyContacts: [
      { name: "Patricia Davis", relationship: "Mother", homePhone: "(555) 200-0005", workPhone: "(555) 300-0050", cellPhone: "(555) 400-0010" },
    ],
  },
  "5": {
    id: "5", studentId: "STU-1005", firstName: "Sophia", lastName: "Martinez", gradeLevel: "10th",
    dateOfBirth: "2010-06-12", age: 15, gender: "Female", homeroom: "Room 204", counselor: "Jessica Adams", status: "Transferred",
    email: "sophia.m@school.edu", enrollmentDate: "2024-08-15", stateStudentNumber: "SS-4421005",
    photoUrl: null,
    guardian: "Carmen Martinez", homePhone: "(555) 200-0003",
    address: "456 Cedar Court", city: "Springfield", state: "IL", zip: "62703",
    busRoute: "—", busStop: "—",
    lockerNumber: "A-206", lockerCombo: "—",
    activities: [],
    schedule: [],
    family: [],
    parents: [
      { name: "Carmen Martinez", relationship: "Mother", email: "carmen.m@email.com", homePhone: "(555) 200-0003", workPhone: "(555) 300-0030", employer: "Martinez Bakery" },
    ],
    emergencyContacts: [
      { name: "Carmen Martinez", relationship: "Mother", homePhone: "(555) 200-0003", workPhone: "(555) 300-0030", cellPhone: "(555) 400-0003" },
    ],
  },
  "6": {
    id: "6", studentId: "STU-1006", firstName: "James", lastName: "Garcia", gradeLevel: "11th",
    dateOfBirth: "2009-09-04", age: 16, gender: "Male", homeroom: "Room 108", counselor: "Jessica Adams", status: "Active",
    email: "james.g@school.edu", enrollmentDate: "2023-08-20", stateStudentNumber: "SS-4421006",
    photoUrl: null,
    guardian: "Thomas Garcia", homePhone: "(555) 200-0006",
    address: "789 Willow Way", city: "Springfield", state: "IL", zip: "62704",
    busRoute: "Route 5", busStop: "Willow Way & Oak Ave",
    lockerNumber: "B-110", lockerCombo: "28-14-36",
    activities: ["Soccer", "Spanish Club"],
    schedule: [
      { period: "1", course: "English 11", term: "Full Year", gradePercent: 84, absences: 2, tardies: 1, teacher: "R. Lee", room: "204" },
      { period: "2", course: "Algebra II", term: "Full Year", gradePercent: 79, absences: 3, tardies: 2, teacher: "S. Thompson", room: "108" },
      { period: "3", course: "Chemistry", term: "Full Year", gradePercent: 82, absences: 1, tardies: 0, teacher: "M. Chen", room: "312" },
      { period: "4", course: "US History", term: "Full Year", gradePercent: 86, absences: 2, tardies: 0, teacher: "D. Miller", room: "205" },
      { period: "5", course: "Spanish III", term: "Full Year", gradePercent: 95, absences: 0, tardies: 0, teacher: "A. Reyes", room: "118" },
      { period: "6", course: "Physical Education", term: "Semester 2", gradePercent: null, absences: 0, tardies: 0, teacher: "K. Morris", room: "GYM" },
    ],
    family: [{ name: "Ava Rodriguez", grade: "9th", studentId: "STU-1007" }],
    parents: [
      { name: "Thomas Garcia", relationship: "Guardian", email: "tom.g@email.com", homePhone: "(555) 200-0006", workPhone: "(555) 300-0060", employer: "Garcia Auto Repair" },
    ],
    emergencyContacts: [
      { name: "Thomas Garcia", relationship: "Guardian", homePhone: "(555) 200-0006", workPhone: "(555) 300-0060", cellPhone: "(555) 400-0006" },
    ],
  },
  "7": {
    id: "7", studentId: "STU-1007", firstName: "Ava", lastName: "Rodriguez", gradeLevel: "9th",
    dateOfBirth: "2011-04-19", age: 15, gender: "Female", homeroom: "Room 312", counselor: "Jessica Adams", status: "Active",
    email: "ava.r@school.edu", enrollmentDate: "2025-08-18", stateStudentNumber: "SS-4421007",
    photoUrl: null,
    guardian: "Thomas Garcia", homePhone: "(555) 200-0006",
    address: "789 Willow Way", city: "Springfield", state: "IL", zip: "62704",
    busRoute: "Route 5", busStop: "Willow Way & Oak Ave",
    lockerNumber: "C-314", lockerCombo: "11-29-5",
    activities: ["Dance Team", "Art Club"],
    schedule: [
      { period: "1", course: "English 9", term: "Full Year", gradePercent: 90, absences: 1, tardies: 0, teacher: "P. Walsh", room: "210" },
      { period: "2", course: "Algebra I", term: "Full Year", gradePercent: 86, absences: 0, tardies: 1, teacher: "S. Thompson", room: "108" },
      { period: "3", course: "Earth Science", term: "Full Year", gradePercent: 88, absences: 2, tardies: 0, teacher: "M. Chen", room: "312" },
      { period: "4", course: "World Geography", term: "Full Year", gradePercent: 84, absences: 1, tardies: 1, teacher: "D. Miller", room: "205" },
      { period: "5", course: "Spanish I", term: "Full Year", gradePercent: 92, absences: 0, tardies: 0, teacher: "A. Reyes", room: "118" },
      { period: "6", course: "Physical Education", term: "Semester 1", gradePercent: null, absences: 0, tardies: 0, teacher: "K. Morris", room: "GYM" },
      { period: "7", course: "Dance", term: "Semester 2", gradePercent: 96, absences: 0, tardies: 0, teacher: "M. Torres", room: "STUDIO" },
    ],
    family: [{ name: "James Garcia", grade: "11th", studentId: "STU-1006" }],
    parents: [
      { name: "Thomas Garcia", relationship: "Guardian", email: "tom.g@email.com", homePhone: "(555) 200-0006", workPhone: "(555) 300-0060", employer: "Garcia Auto Repair" },
    ],
    emergencyContacts: [
      { name: "Thomas Garcia", relationship: "Guardian", homePhone: "(555) 200-0006", workPhone: "(555) 300-0060", cellPhone: "(555) 400-0006" },
    ],
  },
  "8": {
    id: "8", studentId: "STU-1008", firstName: "William", lastName: "Wilson", gradeLevel: "12th",
    dateOfBirth: "2008-12-02", age: 17, gender: "Male", homeroom: "Room 101", counselor: "Jessica Adams", status: "Inactive",
    email: "william.w@school.edu", enrollmentDate: "2022-08-22", stateStudentNumber: "SS-4421008",
    photoUrl: null,
    guardian: "Karen Wilson", homePhone: "(555) 200-0008",
    address: "654 Pine Street", city: "Springfield", state: "IL", zip: "62701",
    busRoute: "—", busStop: "—",
    lockerNumber: "A-103", lockerCombo: "—",
    activities: [],
    schedule: [],
    family: [],
    parents: [
      { name: "Karen Wilson", relationship: "Mother", email: "karen.w@email.com", homePhone: "(555) 200-0008", workPhone: "(555) 300-0080", employer: "Wilson Realty Group" },
    ],
    emergencyContacts: [
      { name: "Karen Wilson", relationship: "Mother", homePhone: "(555) 200-0008", workPhone: "(555) 300-0080", cellPhone: "(555) 400-0008" },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const avatarColors = [
  "bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-amber-600",
  "bg-rose-600", "bg-cyan-600", "bg-indigo-600", "bg-teal-600",
];

function pickColor(id: string) {
  let hash = 0;
  for (const ch of id) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const statusColor: Record<string, string> = {
  Active:      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Inactive:    "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400",
  Transferred: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};

function gradeColor(pct: number): string {
  if (pct >= 90) return "text-emerald-700 dark:text-emerald-400";
  if (pct >= 80) return "text-blue-700 dark:text-blue-400";
  if (pct >= 70) return "text-amber-700 dark:text-amber-400";
  return "text-red-700 dark:text-red-400";
}

function formatDOB(dob: string): string {
  return new Date(dob + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

type SubItemKey =
  // Student Profile
  | "quickLookup" | "addresses" | "counselorDashboard" | "demographics"
  | "email" | "modifyInfo" | "otherInfo" | "studentPhoto"
  | "studentForms"
  | "family" | "contactManagement" | "guardianInfo"
  | "accessHistory" | "guardianStudentAccess"
  | "attachments" | "lunchProgram" | "transportation"
  // Academic Records
  | "classRankings" | "gpa" | "historicalGrades" | "honorRoll"
  | "testResults" | "transcripts"
  // Attendance
  | "dailyAttendance" | "meetingAttendance" | "timeAttendance"
  // Behavior
  | "behaviorDashboard" | "logEntries" | "incidents"
  // Courses & Programs
  | "schedule" | "courseRequests" | "modifySchedule"
  // Health
  | "healthDashboard" | "healthScreenings" | "immunizations"
  | "officeVisits" | "medications"
  // Postsecondary Readiness
  | "collegeEntranceTests" | "careerPlans"
  // State/Province
  | "stateReporting" | "stateProvinceInfo"
  // School Enrollment
  | "enrollmentHistory" | "transferInfo" | "reenrollment"
  // Transactions
  | "feeTransactions" | "lunchTransactions"
  // More (top-level)
  | "customScreens" | "fieldValueCenter" | "specialPrograms";

interface SubItem {
  key: SubItemKey;
  label: string;
}

interface SubGroup {
  heading: string;
  items: SubItem[];
}

interface SidebarCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  groups: SubGroup[];
}

const SIDEBAR_CATEGORIES: SidebarCategory[] = [
  {
    id: "studentProfile", label: "Student Profile", icon: User,
    groups: [
      {
        heading: "Student Details",
        items: [
          { key: "quickLookup", label: "Quick Lookup" },
          { key: "addresses", label: "Addresses" },
          { key: "counselorDashboard", label: "Counselor Dashboard" },
          { key: "demographics", label: "Demographics" },
          { key: "email", label: "Email" },
          { key: "modifyInfo", label: "Modify Info" },
          { key: "otherInfo", label: "Other Info" },
          { key: "studentPhoto", label: "Student Photo" },
        ],
      },
      {
        heading: "Forms",
        items: [
          { key: "studentForms", label: "Student Forms" },
        ],
      },
      {
        heading: "Contacts",
        items: [
          { key: "family", label: "Associated Family Members" },
          { key: "contactManagement", label: "Contact Management" },
          { key: "guardianInfo", label: "Guardian Info" },
        ],
      },
      {
        heading: "User Access",
        items: [
          { key: "accessHistory", label: "Access History" },
          { key: "guardianStudentAccess", label: "Guardian and Student Account Access" },
        ],
      },
      {
        heading: "More",
        items: [
          { key: "attachments", label: "Attachments" },
          { key: "lunchProgram", label: "Lunch Program" },
          { key: "transportation", label: "Transportation" },
        ],
      },
    ],
  },
  {
    id: "academicRecords", label: "Academic Records", icon: GraduationCap,
    groups: [
      {
        heading: "",
        items: [
          { key: "classRankings", label: "Class Rankings" },
          { key: "gpa", label: "GPA" },
          { key: "historicalGrades", label: "Historical Grades" },
          { key: "honorRoll", label: "Honor Roll" },
          { key: "testResults", label: "Test Results" },
          { key: "transcripts", label: "Transcripts" },
        ],
      },
    ],
  },
  {
    id: "attendance", label: "Attendance", icon: CalendarCheck,
    groups: [
      {
        heading: "",
        items: [
          { key: "dailyAttendance", label: "Daily Attendance" },
          { key: "meetingAttendance", label: "Meeting Attendance" },
          { key: "timeAttendance", label: "Time Attendance" },
        ],
      },
    ],
  },
  {
    id: "behavior", label: "Behavior", icon: ShieldAlert,
    groups: [
      {
        heading: "",
        items: [
          { key: "behaviorDashboard", label: "Behavior Dashboard" },
          { key: "logEntries", label: "Log Entries" },
          { key: "incidents", label: "Incidents" },
        ],
      },
    ],
  },
  {
    id: "coursesPrograms", label: "Courses & Programs", icon: BookOpen,
    groups: [
      {
        heading: "",
        items: [
          { key: "schedule", label: "Schedule" },
          { key: "courseRequests", label: "Course Requests" },
          { key: "modifySchedule", label: "Modify Schedule" },
        ],
      },
    ],
  },
  {
    id: "health", label: "Health", icon: HeartPulse,
    groups: [
      {
        heading: "",
        items: [
          { key: "healthDashboard", label: "Health Dashboard" },
          { key: "healthScreenings", label: "Health Screenings" },
          { key: "immunizations", label: "Immunizations" },
          { key: "officeVisits", label: "Office Visits" },
          { key: "medications", label: "Medications" },
        ],
      },
    ],
  },
  {
    id: "postsecondaryReadiness", label: "Postsecondary Readiness", icon: Target,
    groups: [
      {
        heading: "",
        items: [
          { key: "collegeEntranceTests", label: "College Entrance Tests" },
          { key: "careerPlans", label: "Career Plans" },
        ],
      },
    ],
  },
  {
    id: "stateProvince", label: "State/Province - __", icon: Landmark,
    groups: [
      {
        heading: "",
        items: [
          { key: "stateReporting", label: "State Reporting" },
          { key: "stateProvinceInfo", label: "State/Province Info" },
        ],
      },
    ],
  },
  {
    id: "schoolEnrollment", label: "School Enrollment", icon: School,
    groups: [
      {
        heading: "",
        items: [
          { key: "enrollmentHistory", label: "Enrollment History" },
          { key: "transferInfo", label: "Transfer Info" },
          { key: "reenrollment", label: "Re-enrollment" },
        ],
      },
    ],
  },
  {
    id: "transactions", label: "Transactions", icon: CreditCard,
    groups: [
      {
        heading: "",
        items: [
          { key: "feeTransactions", label: "Fee Transactions" },
          { key: "lunchTransactions", label: "Lunch Transactions" },
        ],
      },
    ],
  },
  {
    id: "more", label: "More", icon: Layers,
    groups: [
      {
        heading: "",
        items: [
          { key: "customScreens", label: "Custom Screens" },
          { key: "fieldValueCenter", label: "Field Value Center" },
          { key: "specialPrograms", label: "Special Programs" },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Subcomponents                                                      */
/* ------------------------------------------------------------------ */

function InfoRow({ label, value, href, isPhone }: { label: string; value: string; href?: string; isPhone?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-2.5 px-5">
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32 flex-shrink-0 pt-0.5">{label}</span>
      {href ? (
        <a href={href} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5">
          {isPhone && <Phone className="w-3 h-3" />}
          {!isPhone && <Mail className="w-3 h-3" />}
          {value}
        </a>
      ) : (
        <span className="text-sm text-gray-900 dark:text-white">{value}</span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;
  const student = STUDENTS[studentId];

  const [activeItem, setActiveItem] = useState<SubItemKey>("schedule");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set<string>()
  );

  function toggleCategory(id: string) {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <Link href="/sis/admin/people" className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Back to People
        </Link>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">Student not found.</p>
        </div>
      </div>
    );
  }

  const currentIdx = STUDENT_IDS.indexOf(studentId);
  const prevId = currentIdx > 0 ? STUDENT_IDS[currentIdx - 1] : STUDENT_IDS[STUDENT_IDS.length - 1];
  const nextId = currentIdx < STUDENT_IDS.length - 1 ? STUDENT_IDS[currentIdx + 1] : STUDENT_IDS[0];

  const now = new Date();
  const hours = now.getHours();
  const isSchoolHours = hours >= 8 && hours < 16;
  const currentPeriod = hours < 9 ? "—" : hours < 10 ? "1" : hours < 11 ? "2" : hours < 12 ? "3" : hours < 13 ? "4" : hours < 14 ? "5" : hours < 15 ? "6" : "7";
  const findMeEntry = student.schedule.find(s => s.period === currentPeriod);

  return (
    <div className="flex flex-col h-[calc(100vh-2.5rem)] gap-4">
      {/* Back link + prev/next */}
      <div className="flex items-center justify-between flex-shrink-0">
        <Link href="/sis/admin/people" className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to People
        </Link>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => router.push(`/sis/admin/people/students/${prevId}`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Prev
          </button>
          <span className="text-xs text-gray-400 dark:text-slate-500 tabular-nums">
            {currentIdx + 1} of {STUDENT_IDS.length}
          </span>
          <button
            onClick={() => router.push(`/sis/admin/people/students/${nextId}`)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Student header card — UNCHANGED */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex-shrink-0">
        <div className="px-6 py-5 flex flex-col sm:flex-row gap-5">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 select-none ${pickColor(student.id + "s")}`}>
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                {student.firstName} {student.lastName}
              </h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor[student.status]}`}>
                {student.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Grade <span className="font-medium text-gray-700 dark:text-gray-300">{student.gradeLevel}</span>
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ID <span className="font-medium text-gray-700 dark:text-gray-300">{student.studentId}</span>
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                DOB <span className="font-medium text-gray-700 dark:text-gray-300">{formatDOB(student.dateOfBirth)}</span>
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Age <span className="font-medium text-gray-700 dark:text-gray-300">{student.age}</span>
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Counselor <span className="font-medium text-gray-700 dark:text-gray-300">{student.counselor}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 flex-shrink-0" />
              {isSchoolHours && findMeEntry ? (
                <span className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">{findMeEntry.course}</span>
                  <span className="text-gray-400 dark:text-slate-500 mx-1.5">·</span>
                  <span className="text-gray-600 dark:text-gray-300">{findMeEntry.teacher}</span>
                  <span className="text-gray-400 dark:text-slate-500 mx-1.5">·</span>
                  <span className="text-gray-500 dark:text-gray-400">Room {findMeEntry.room}</span>
                  <span className="text-gray-400 dark:text-slate-500 mx-1.5">·</span>
                  <span className="text-gray-500 dark:text-gray-400">Period {findMeEntry.period}</span>
                </span>
              ) : (
                <span className="text-sm text-gray-400 dark:text-slate-500">— — —</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-start">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button className="p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar + Content area */}
      <div className="flex gap-4 min-h-0 flex-1">

        {/* ---- Left sidebar nav ---- */}
        <nav className="w-56 flex-shrink-0 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-y-auto">
          <div className="py-2">
            {SIDEBAR_CATEGORIES.map(cat => {
              const isExpanded = expandedCategories.has(cat.id);
              const CatIcon = cat.icon;
              const hasActiveChild = cat.groups.some(g => g.items.some(i => i.key === activeItem));
              return (
                <div key={cat.id}>
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${
                      hasActiveChild
                        ? "bg-blue-50 dark:bg-blue-950/20 text-[#1e3a8a] dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <CatIcon className={`w-4 h-4 flex-shrink-0 ${hasActiveChild ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-400 dark:text-slate-500"}`} />
                    <span className="text-[13px] font-semibold flex-1 truncate">{cat.label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isExpanded ? "" : "-rotate-90"} ${hasActiveChild ? "text-[#1e3a8a] dark:text-blue-400" : "text-gray-400 dark:text-slate-500"}`} />
                  </button>
                  {isExpanded && (
                    <div className="pb-1">
                      {cat.groups.map(group => {
                        const isSingleFlat = cat.groups.length === 1 && !group.heading;
                        return (
                          <div key={group.heading || "_default"}>
                            {!isSingleFlat && group.heading && (
                              <p className="pl-11 pr-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-blue-700/70 dark:text-blue-400/60">
                                {group.heading}
                              </p>
                            )}
                            {group.items.map(item => (
                              <button
                                key={item.key}
                                onClick={() => setActiveItem(item.key)}
                                className={`w-full text-left pl-11 pr-4 py-1.5 text-[13px] transition-colors ${
                                  activeItem === item.key
                                    ? "text-[#1e3a8a] dark:text-blue-400 font-semibold bg-blue-50/60 dark:bg-blue-950/10"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800/40"
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* ---- Content panel ---- */}
        <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">

          {/* Content header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-slate-800 flex-shrink-0 bg-gray-50/40 dark:bg-slate-800/20">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {SIDEBAR_CATEGORIES.flatMap(c => c.groups).flatMap(g => g.items).find(i => i.key === activeItem)?.label}
            </h2>
          </div>

          {/* Content body */}
          <div className="flex-1 overflow-auto">

            {/* Quick Lookup */}
            {activeItem === "quickLookup" && (
              <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
                <InfoRow label="Name" value={`${student.lastName}, ${student.firstName}`} />
                <InfoRow label="Student #" value={student.studentId} />
                <InfoRow label="State ID" value={student.stateStudentNumber} />
                <InfoRow label="Grade" value={student.gradeLevel} />
                <InfoRow label="DOB" value={formatDOB(student.dateOfBirth)} />
                <InfoRow label="Gender" value={student.gender} />
                <InfoRow label="Homeroom" value={student.homeroom} />
                <InfoRow label="Counselor" value={student.counselor} />
                <InfoRow label="Email" value={student.email} href={`mailto:${student.email}`} />
                <InfoRow label="Enrolled" value={new Date(student.enrollmentDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
              </div>
            )}

            {/* Demographics */}
            {activeItem === "demographics" && (
              <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
                <InfoRow label="Guardian" value={student.guardian} />
                <InfoRow label="Home Phone" value={student.homePhone} href={`tel:${student.homePhone}`} isPhone />
                <InfoRow label="Email" value={student.email} href={`mailto:${student.email}`} />
                <InfoRow label="Address" value={`${student.address}, ${student.city}, ${student.state} ${student.zip}`} />
                <InfoRow label="Gender" value={student.gender} />
                <InfoRow label="Enrolled" value={new Date(student.enrollmentDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
              </div>
            )}

            {/* Addresses */}
            {activeItem === "addresses" && (
              <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
                <InfoRow label="Street" value={student.address} />
                <InfoRow label="City" value={student.city} />
                <InfoRow label="State" value={student.state} />
                <InfoRow label="Zip" value={student.zip} />
              </div>
            )}

            {/* Email */}
            {activeItem === "email" && (
              <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
                <InfoRow label="Student Email" value={student.email} href={`mailto:${student.email}`} />
              </div>
            )}

            {/* Student Photo */}
            {activeItem === "studentPhoto" && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className={`w-32 h-32 rounded-2xl flex items-center justify-center text-white text-5xl font-bold select-none ${pickColor(student.id + "s")}`}>
                  {student.firstName[0]}{student.lastName[0]}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {student.firstName} {student.lastName}
                </p>
              </div>
            )}

            {/* Schedule */}
            {activeItem === "schedule" && (
              student.schedule.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-slate-800">
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/50 dark:bg-slate-800/30">Period</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/50 dark:bg-slate-800/30 min-w-[180px]">Course Name</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/50 dark:bg-slate-800/30">Teacher</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/50 dark:bg-slate-800/30">Room</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/50 dark:bg-slate-800/30">Term</th>
                        <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/50 dark:bg-slate-800/30">Grade</th>
                        <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/50 dark:bg-slate-800/30">Abs</th>
                        <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide bg-gray-50/50 dark:bg-slate-800/30">Tdy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-slate-800/60">
                      {student.schedule.map(entry => (
                        <tr key={entry.period} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-2.5 font-semibold text-gray-900 dark:text-white">{entry.period}</td>
                          <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">{entry.course}</td>
                          <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300">{entry.teacher}</td>
                          <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400 font-mono text-xs">{entry.room}</td>
                          <td className="px-4 py-2.5 text-gray-500 dark:text-gray-400">{entry.term}</td>
                          <td className="px-4 py-2.5 text-center">
                            {entry.gradePercent !== null ? (
                              <span className={`font-bold ${gradeColor(entry.gradePercent)}`}>{entry.gradePercent}%</span>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            {entry.absences > 0 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">{entry.absences}</span>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600">0</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            {entry.tardies > 0 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">{entry.tardies}</span>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-600">0</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-gray-400 dark:text-slate-500">No schedule available.</div>
              )
            )}

            {/* Family */}
            {activeItem === "family" && (
              student.family.length > 0 ? (
                <div>
                  <div className="flex items-center justify-end px-5 py-2 border-b border-gray-50 dark:border-slate-800/60">
                    <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Select Entire Family
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
                    {student.family.map(member => (
                      <div key={member.studentId} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none ${pickColor(member.studentId)}`}>
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">{member.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Grade {member.grade} · {member.studentId}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-gray-400 dark:text-slate-500">No family members linked.</div>
              )
            )}

            {/* Contact Management (parents + emergency contacts) */}
            {activeItem === "contactManagement" && (
              <div>
                {student.parents.length > 0 && (
                  <>
                    <div className="px-5 py-2.5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-800/20">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parents / Guardians</p>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                      {student.parents.map((parent, i) => (
                        <div key={i} className="px-5 py-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none ${pickColor(parent.name)}`}>
                              {parent.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{parent.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{parent.relationship}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 ml-10">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <a href={`mailto:${parent.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{parent.email}</a>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <a href={`tel:${parent.homePhone}`} className="text-blue-600 dark:text-blue-400 hover:underline">{parent.homePhone}</a>
                              <span className="text-xs text-gray-400">(Home)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-gray-700 dark:text-gray-300">{parent.employer}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <a href={`tel:${parent.workPhone}`} className="text-blue-600 dark:text-blue-400 hover:underline">{parent.workPhone}</a>
                              <span className="text-xs text-gray-400">(Work)</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {student.emergencyContacts.length > 0 && (
                  <>
                    <div className="px-5 py-2.5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-800/20">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Emergency Contacts</p>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-slate-800">
                      {student.emergencyContacts.map((contact, i) => (
                        <div key={i} className="px-5 py-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-50 dark:bg-red-950/40 flex-shrink-0">
                              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{contact.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{contact.relationship}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ml-10">
                            {contact.homePhone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                <a href={`tel:${contact.homePhone}`} className="text-blue-600 dark:text-blue-400 hover:underline">{contact.homePhone}</a>
                                <span className="text-xs text-gray-400">(Home)</span>
                              </div>
                            )}
                            {contact.workPhone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                <a href={`tel:${contact.workPhone}`} className="text-blue-600 dark:text-blue-400 hover:underline">{contact.workPhone}</a>
                                <span className="text-xs text-gray-400">(Work)</span>
                              </div>
                            )}
                            {contact.cellPhone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                <a href={`tel:${contact.cellPhone}`} className="text-blue-600 dark:text-blue-400 hover:underline">{contact.cellPhone}</a>
                                <span className="text-xs text-gray-400">(Cell)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {student.parents.length === 0 && student.emergencyContacts.length === 0 && (
                  <div className="p-8 text-center text-sm text-gray-400 dark:text-slate-500">No contacts on file.</div>
                )}
              </div>
            )}

            {/* Guardian Info */}
            {activeItem === "guardianInfo" && (
              <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
                <InfoRow label="Guardian" value={student.guardian} />
                <InfoRow label="Phone" value={student.homePhone} href={`tel:${student.homePhone}`} isPhone />
                <InfoRow label="Address" value={`${student.address}, ${student.city}, ${student.state} ${student.zip}`} />
              </div>
            )}

            {/* Transportation */}
            {activeItem === "transportation" && (
              <div className="divide-y divide-gray-50 dark:divide-slate-800/60">
                <InfoRow label="Bus Route" value={student.busRoute} />
                <InfoRow label="Bus Stop" value={student.busStop} />
              </div>
            )}

            {/* Placeholder for sections without real data yet */}
            {([
              "counselorDashboard", "modifyInfo", "otherInfo",
              "studentForms",
              "accessHistory", "guardianStudentAccess",
              "attachments", "lunchProgram",
              "classRankings", "gpa", "historicalGrades", "honorRoll",
              "testResults", "transcripts",
              "dailyAttendance", "meetingAttendance", "timeAttendance",
              "behaviorDashboard", "logEntries", "incidents",
              "courseRequests", "modifySchedule",
              "healthDashboard", "healthScreenings", "immunizations",
              "officeVisits", "medications",
              "collegeEntranceTests", "careerPlans",
              "stateReporting", "stateProvinceInfo",
              "enrollmentHistory", "transferInfo", "reenrollment",
              "feeTransactions", "lunchTransactions",
              "customScreens", "fieldValueCenter", "specialPrograms",
            ] as SubItemKey[]).includes(activeItem) && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Coming Soon</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 max-w-xs text-center">
                  This section is not yet available. It will be enabled in a future update.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
