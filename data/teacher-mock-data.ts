// ─── Types ────────────────────────────────────────────────────────────────────

export interface Class {
  id: string;
  name: string;
  section: string;
  gradeLevel: string;
  room: string;
  schedule: string;
  color: string;
  studentCount: number;
  description: string;
  image: string;
}

export interface Student {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar: string;
  classId: string;
  currentGrade: number;
  activitySummary: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  parentRelation: "Mother" | "Father" | "Guardian";
}

export type AssignmentType = "Assignment" | "Quiz" | "Project" | "Exam";
export type AssignmentStatus = "published" | "draft";

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  type: AssignmentType;
  description: string;
  dueDate: string;
  points: number;
  status: AssignmentStatus;
  createdAt: string;
  attachments?: string[];
  assignTo: "all" | string[];
}

export type SubmissionStatus = "Submitted" | "Missing" | "Late" | "Graded";

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: SubmissionStatus;
  submittedAt: string | null;
  grade: number | null;
  feedback: string | null;
  content?: string;
  attachments?: { name: string; size: string; type: string }[];
}

export interface RubricLevel {
  label: string;
  points: number;
  description: string;
}

export interface RubricCriterion {
  id: string;
  label: string;
  description: string;
  points: number;
  levels: RubricLevel[];
}

export interface Rubric {
  id: string;
  assignmentId: string;
  title: string;
  criteria: RubricCriterion[];
}

export interface Announcement {
  id: string;
  classId: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
}

export interface QuizQuestion {
  id: string;
  type: "multiple_choice" | "multiple_answers" | "true_false" | "short_answer" | "essay";
  text: string;
  options?: string[];
  correctAnswer: string;
  correctAnswers?: string[];   // for multiple_answers type
  points: number;
  imageUrl?: string;           // optional image attached to question
  explanation?: string;        // shown to students after answering
}

export interface Quiz {
  id: string;
  classId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number;
  attemptsAllowed: number;
  shuffleQuestions: boolean;
  status: "published" | "draft";
  dueDate: string;
  createdAt: string;
  totalPoints: number;
  quizType?: "quiz" | "exam";
  passingScore?: number;
  showResultsAfter?: boolean;
}

export interface DiscussionReply {
  id: string;
  author: string;
  authorRole: "teacher" | "student";
  content: string;
  createdAt: string;
  likes: number;
  replies?: DiscussionReply[];
}

export interface Discussion {
  id: string;
  classId: string;
  title: string;
  prompt: string;
  author: string;
  authorRole: "teacher" | "student";
  createdAt: string;
  replies: DiscussionReply[];
  pinned: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: "Student" | "Parent" | "Admin";
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: ChatMessage[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const CLASSES: Class[] = [
  { id: "c1", name: "Mathematics 9",  section: "Section A", gradeLevel: "Grade 9",  room: "Room 201", schedule: "MWF 7:30–8:30 AM",   color: "#2563eb", studentCount: 6, description: "Covers quadratic equations, rational expressions, and radical expressions.", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=200&fit=crop&q=80" },
  { id: "c2", name: "Mathematics 10", section: "Section B", gradeLevel: "Grade 10", room: "Room 202", schedule: "TTh 9:00–10:30 AM",   color: "#7c3aed", studentCount: 6, description: "Topics include sequences, polynomials, circles, and combinatorics.", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=200&fit=crop&q=80" },
  { id: "c3", name: "Algebra I",      section: "Section C", gradeLevel: "Grade 8",  room: "Room 105", schedule: "MWF 10:00–11:00 AM",  color: "#059669", studentCount: 6, description: "Introduction to algebraic thinking, linear equations, and functions.", image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&h=200&fit=crop&q=80" },
];

export const STUDENTS: Student[] = [
  { id: "s1",  name: "Santos, Maria A.",    firstName: "Maria",    lastName: "Santos",    email: "m.santos@school.edu.ph",    phone: "+63 912 345 6781", avatar: "MA", classId: "c1", currentGrade: 94, activitySummary: "Very active — submitted all assignments on time.",         parentName: "Elena Santos",      parentEmail: "elena.santos@gmail.com",      parentPhone: "+63 917 200 0001", parentRelation: "Mother" },
  { id: "s2",  name: "Reyes, Juan B.",      firstName: "Juan",     lastName: "Reyes",     email: "j.reyes@school.edu.ph",     phone: "+63 912 345 6782", avatar: "JR", classId: "c1", currentGrade: 85, activitySummary: "Good participation. Late on 1 submission.",              parentName: "Roberto Reyes",     parentEmail: "roberto.reyes@gmail.com",     parentPhone: "+63 917 200 0002", parentRelation: "Father" },
  { id: "s3",  name: "Cruz, Anna C.",       firstName: "Anna",     lastName: "Cruz",      email: "a.cruz@school.edu.ph",      phone: "+63 912 345 6783", avatar: "AC", classId: "c1", currentGrade: 78, activitySummary: "Needs improvement on quizzes.",                          parentName: "Patricia Cruz",     parentEmail: "patricia.cruz@gmail.com",     parentPhone: "+63 917 200 0003", parentRelation: "Mother" },
  { id: "s4",  name: "Dela Cruz, Pedro D.", firstName: "Pedro",    lastName: "Dela Cruz", email: "p.delacruz@school.edu.ph",  phone: "+63 912 345 6784", avatar: "PD", classId: "c1", currentGrade: 72, activitySummary: "Missing 2 assignments. Needs follow-up.",                parentName: "Carlos Dela Cruz",  parentEmail: "carlos.delacruz@gmail.com",   parentPhone: "+63 917 200 0004", parentRelation: "Father" },
  { id: "s5",  name: "Garcia, Liza E.",     firstName: "Liza",     lastName: "Garcia",    email: "l.garcia@school.edu.ph",    phone: "+63 912 345 6785", avatar: "LG", classId: "c1", currentGrade: 91, activitySummary: "Strong performer. Active in discussions.",              parentName: "Maribel Garcia",    parentEmail: "maribel.garcia@gmail.com",    parentPhone: "+63 917 200 0005", parentRelation: "Mother" },
  { id: "s6",  name: "Mendoza, Carlo F.",   firstName: "Carlo",    lastName: "Mendoza",   email: "c.mendoza@school.edu.ph",   phone: "+63 912 345 6786", avatar: "CM", classId: "c1", currentGrade: 66, activitySummary: "At risk — missing multiple submissions.",                parentName: "Fernando Mendoza",  parentEmail: "fernando.mendoza@gmail.com",  parentPhone: "+63 917 200 0006", parentRelation: "Father" },
  { id: "s7",  name: "Torres, Sofia G.",    firstName: "Sofia",    lastName: "Torres",    email: "s.torres@school.edu.ph",    phone: "+63 912 345 6787", avatar: "ST", classId: "c2", currentGrade: 92, activitySummary: "Excellent student. Participates regularly.",             parentName: "Gloria Torres",     parentEmail: "gloria.torres@gmail.com",     parentPhone: "+63 917 200 0007", parentRelation: "Mother" },
  { id: "s8",  name: "Ramos, Diego H.",     firstName: "Diego",    lastName: "Ramos",     email: "d.ramos@school.edu.ph",     phone: "+63 912 345 6788", avatar: "DR", classId: "c2", currentGrade: 81, activitySummary: "Improving steadily. Good quiz scores.",                  parentName: "Hernando Ramos",    parentEmail: "hernando.ramos@gmail.com",    parentPhone: "+63 917 200 0008", parentRelation: "Father" },
  { id: "s9",  name: "Flores, Isabella I.", firstName: "Isabella", lastName: "Flores",    email: "i.flores@school.edu.ph",    phone: "+63 912 345 6789", avatar: "IF", classId: "c2", currentGrade: 96, activitySummary: "Top of class. Perfect attendance.",                     parentName: "Irene Flores",      parentEmail: "irene.flores@gmail.com",      parentPhone: "+63 917 200 0009", parentRelation: "Mother" },
  { id: "s10", name: "Castillo, Marco J.",  firstName: "Marco",    lastName: "Castillo",  email: "m.castillo@school.edu.ph",  phone: "+63 912 345 6790", avatar: "MC", classId: "c2", currentGrade: 70, activitySummary: "Struggles with homework. Attends study groups.",          parentName: "Jose Castillo",     parentEmail: "jose.castillo@gmail.com",     parentPhone: "+63 917 200 0010", parentRelation: "Father" },
  { id: "s11", name: "Navarro, Camila K.",  firstName: "Camila",   lastName: "Navarro",   email: "c.navarro@school.edu.ph",   phone: "+63 912 345 6791", avatar: "CN", classId: "c2", currentGrade: 88, activitySummary: "Consistent work. Good discussion posts.",                parentName: "Karen Navarro",     parentEmail: "karen.navarro@gmail.com",     parentPhone: "+63 917 200 0011", parentRelation: "Mother" },
  { id: "s12", name: "Bautista, Luis L.",   firstName: "Luis",     lastName: "Bautista",  email: "l.bautista@school.edu.ph",  phone: "+63 912 345 6792", avatar: "LB", classId: "c2", currentGrade: 74, activitySummary: "Late submissions. Needs time management help.",          parentName: "Loreto Bautista",   parentEmail: "loreto.bautista@gmail.com",   parentPhone: "+63 917 200 0012", parentRelation: "Father" },
  { id: "s13", name: "Aquino, Rosa M.",     firstName: "Rosa",     lastName: "Aquino",    email: "r.aquino@school.edu.ph",    phone: "+63 912 345 6793", avatar: "RA", classId: "c3", currentGrade: 93, activitySummary: "Outstanding. Helps other students.",                    parentName: "Marta Aquino",      parentEmail: "marta.aquino@gmail.com",      parentPhone: "+63 917 200 0013", parentRelation: "Mother" },
  { id: "s14", name: "Villanueva, Jose N.", firstName: "Jose",     lastName: "Villanueva",email: "j.villanueva@school.edu.ph",phone: "+63 912 345 6794", avatar: "JV", classId: "c3", currentGrade: 77, activitySummary: "Moderate performance. Improving on tests.",              parentName: "Noel Villanueva",   parentEmail: "noel.villanueva@gmail.com",   parentPhone: "+63 917 200 0014", parentRelation: "Father" },
  { id: "s15", name: "Fernandez, Clara O.", firstName: "Clara",    lastName: "Fernandez", email: "c.fernandez@school.edu.ph", phone: "+63 912 345 6795", avatar: "CF", classId: "c3", currentGrade: 86, activitySummary: "Good student. Active in class.",                        parentName: "Oscar Fernandez",   parentEmail: "oscar.fernandez@gmail.com",   parentPhone: "+63 917 200 0015", parentRelation: "Father" },
  { id: "s16", name: "Soriano, Miguel P.",  firstName: "Miguel",   lastName: "Soriano",   email: "m.soriano@school.edu.ph",   phone: "+63 912 345 6796", avatar: "MS", classId: "c3", currentGrade: 69, activitySummary: "At risk — frequent absences.",                          parentName: "Paz Soriano",       parentEmail: "paz.soriano@gmail.com",       parentPhone: "+63 917 200 0016", parentRelation: "Mother" },
  { id: "s17", name: "Aguilar, Nina Q.",    firstName: "Nina",     lastName: "Aguilar",   email: "n.aguilar@school.edu.ph",   phone: "+63 912 345 6797", avatar: "NA", classId: "c3", currentGrade: 90, activitySummary: "Strong in algebra. Great test scores.",                 parentName: "Quirino Aguilar",   parentEmail: "quirino.aguilar@gmail.com",   parentPhone: "+63 917 200 0017", parentRelation: "Father" },
  { id: "s18", name: "Diaz, Ramon R.",      firstName: "Ramon",    lastName: "Diaz",      email: "r.diaz@school.edu.ph",      phone: "+63 912 345 6798", avatar: "RD", classId: "c3", currentGrade: 62, activitySummary: "At risk — missing multiple assignments and quizzes.", parentName: "Rosario Diaz",      parentEmail: "rosario.diaz@gmail.com",      parentPhone: "+63 917 200 0018", parentRelation: "Mother" },
];

export const ASSIGNMENTS: Assignment[] = [
  // ── Math 9 (c1) — week of Feb 2 ───────────────────────────────────────────
  { id: "a38", classId: "c1", title: "Algebraic Notation Classwork",  type: "Assignment", description: "In-class practice: evaluate and write algebraic expressions.",               dueDate: "2026-02-04", points: 15, status: "published", createdAt: "2026-02-02", assignTo: "all" },
  { id: "a39", classId: "c1", title: "Expressions Mini-Quiz",         type: "Quiz",       description: "10-question in-class check on evaluating algebraic expressions.",            dueDate: "2026-02-06", points: 20, status: "published", createdAt: "2026-02-04", assignTo: "all" },
  { id: "a12", classId: "c1", title: "Variable Expressions Review",   type: "Assignment", description: "Evaluate algebraic expressions for given values.",                            dueDate: "2026-02-07", points: 20, status: "published", createdAt: "2026-01-31", assignTo: "all" },
  // ── week of Feb 9 ─────────────────────────────────────────────────────────
  { id: "a40", classId: "c1", title: "Factoring Practice Worksheet",  type: "Assignment", description: "Factor 15 trinomials using the GCF and grouping method.",                    dueDate: "2026-02-11", points: 20, status: "published", createdAt: "2026-02-09", assignTo: "all" },
  { id: "a41", classId: "c1", title: "Perfect Squares Classwork",     type: "Assignment", description: "Identify and factor perfect square trinomials.",                              dueDate: "2026-02-12", points: 15, status: "published", createdAt: "2026-02-10", assignTo: "all" },
  { id: "a13", classId: "c1", title: "Factoring Trinomials Quiz",     type: "Quiz",       description: "Quiz on factoring ax²+bx+c by grouping and the AC method.",                  dueDate: "2026-02-14", points: 50, status: "published", createdAt: "2026-02-07", assignTo: "all" },
  // ── week of Feb 16 ────────────────────────────────────────────────────────
  { id: "a42", classId: "c1", title: "Square Root Method Practice",   type: "Assignment", description: "Solve equations of the form ax²=c by taking square roots.",                  dueDate: "2026-02-18", points: 20, status: "published", createdAt: "2026-02-16", assignTo: "all" },
  { id: "a43", classId: "c1", title: "Completing Square Check",       type: "Quiz",       description: "In-class quiz: complete the square and solve 6 quadratics.",                 dueDate: "2026-02-19", points: 25, status: "published", createdAt: "2026-02-17", assignTo: "all" },
  { id: "a14", classId: "c1", title: "Completing the Square",         type: "Assignment", description: "Solve quadratic equations by completing the square. Problems 1–12.",          dueDate: "2026-02-21", points: 30, status: "published", createdAt: "2026-02-14", assignTo: "all" },
  // ── week of Feb 23 ────────────────────────────────────────────────────────
  { id: "a44", classId: "c1", title: "Discriminant Practice",         type: "Assignment", description: "Calculate the discriminant and describe the nature of roots.",               dueDate: "2026-02-25", points: 20, status: "published", createdAt: "2026-02-23", assignTo: "all" },
  { id: "a45", classId: "c1", title: "Quadratic Word Problems I",     type: "Assignment", description: "Solve 8 real-world quadratic equation problems.",                            dueDate: "2026-02-27", points: 15, status: "published", createdAt: "2026-02-25", assignTo: "all" },
  { id: "a15", classId: "c1", title: "Quadratic Formula Practice",    type: "Assignment", description: "Apply the quadratic formula to solve mixed problems.",                        dueDate: "2026-03-01", points: 25, status: "published", createdAt: "2026-02-22", assignTo: "all" },
  // ── week of Mar 2 ─────────────────────────────────────────────────────────
  { id: "a46", classId: "c1", title: "Exam Review Packet",            type: "Assignment", description: "Comprehensive review packet for Q1 exam—all quadratic topics.",              dueDate: "2026-03-04", points: 30, status: "published", createdAt: "2026-03-02", assignTo: "all" },
  { id: "a47", classId: "c1", title: "Q1 Practice Exam",              type: "Quiz",       description: "Full-length practice exam under timed conditions.",                          dueDate: "2026-03-06", points: 40, status: "published", createdAt: "2026-03-04", assignTo: "all" },
  { id: "a16", classId: "c1", title: "Q1 Chapter Exam",               type: "Exam",       description: "End-of-quarter exam covering quadratics and polynomials.",                    dueDate: "2026-03-07", points: 100, status: "published", createdAt: "2026-02-28", assignTo: "all" },
  // ── week of Mar 9 ─────────────────────────────────────────────────────────
  { id: "a48", classId: "c1", title: "Parabola Analysis Worksheet",   type: "Assignment", description: "Identify vertex, axis of symmetry, and intercepts for 8 parabolas.",         dueDate: "2026-03-11", points: 20, status: "published", createdAt: "2026-03-09", assignTo: "all" },
  { id: "a49", classId: "c1", title: "Vertex Form Practice",          type: "Assignment", description: "Convert standard form to vertex form; identify transformations.",             dueDate: "2026-03-12", points: 15, status: "published", createdAt: "2026-03-10", assignTo: "all" },
  { id: "a17", classId: "c1", title: "Graphing Parabolas Project",    type: "Project",    description: "Design and graph 5 parabolas in real-world contexts.",                        dueDate: "2026-03-14", points: 75, status: "published", createdAt: "2026-03-01", assignTo: "all" },
  // ── week of Mar 16 ────────────────────────────────────────────────────────
  { id: "a50", classId: "c1", title: "Simplifying Radicals Worksheet",type: "Assignment", description: "Simplify 20 radical expressions; prime factorization method.",               dueDate: "2026-03-18", points: 20, status: "published", createdAt: "2026-03-16", assignTo: "all" },
  { id: "a51", classId: "c1", title: "Radical Operations Quiz",       type: "Quiz",       description: "Add, subtract, multiply, and divide radical expressions.",                   dueDate: "2026-03-19", points: 30, status: "published", createdAt: "2026-03-17", assignTo: "all" },
  { id: "a18", classId: "c1", title: "Radical Expressions Quiz",      type: "Quiz",       description: "Simplify radical expressions and rationalize denominators.",                  dueDate: "2026-03-21", points: 40, status: "published", createdAt: "2026-03-14", assignTo: "all" },
  // ── week of Mar 23 ────────────────────────────────────────────────────────
  { id: "a52", classId: "c1", title: "Negative Exponents Practice",   type: "Assignment", description: "Rewrite expressions with negative and zero exponents.",                       dueDate: "2026-03-25", points: 15, status: "published", createdAt: "2026-03-23", assignTo: "all" },
  { id: "a53", classId: "c1", title: "Scientific Notation Worksheet", type: "Assignment", description: "Convert to/from scientific notation and perform operations.",                 dueDate: "2026-03-26", points: 20, status: "published", createdAt: "2026-03-24", assignTo: "all" },
  { id: "a19", classId: "c1", title: "Exponent Laws Worksheet",       type: "Assignment", description: "Apply laws of exponents to simplify expressions with integer/fractional exponents.", dueDate: "2026-03-28", points: 25, status: "published", createdAt: "2026-03-21", assignTo: "all" },
  // ── week of Mar 30 / Apr ──────────────────────────────────────────────────
  { id: "a54", classId: "c1", title: "Factoring Review Classwork",    type: "Assignment", description: "Review all factoring techniques before the quadratic equations quiz.",        dueDate: "2026-04-03", points: 15, status: "published", createdAt: "2026-03-30", assignTo: "all" },
  { id: "a1",  classId: "c1", title: "Quadratic Equations Quiz",      type: "Quiz",       description: "Short quiz covering solving quadratic equations by factoring.",               dueDate: "2026-04-05", points: 50, status: "published", createdAt: "2026-03-28", assignTo: "all" },
  { id: "a2",  classId: "c1", title: "Rational Expressions Worksheet",type: "Assignment", description: "Complete problems 1–20 on simplifying rational expressions.",                 dueDate: "2026-04-10", points: 30, status: "published", createdAt: "2026-03-30", assignTo: "all" },
  { id: "a3",  classId: "c1", title: "Midterm Exam",                  type: "Exam",       description: "Midterm covering all topics from Q1 and Q2.",                                dueDate: "2026-04-18", points: 100, status: "draft",    createdAt: "2026-03-31", assignTo: "all" },
  { id: "a4",  classId: "c1", title: "Math in Real Life Project",     type: "Project",    description: "Research project on real-world applications of quadratic equations.",         dueDate: "2026-04-20", points: 80, status: "published", createdAt: "2026-03-29", assignTo: "all" },

  // ── Math 10 (c2) — week of Feb 2 ──────────────────────────────────────────
  { id: "a55", classId: "c2", title: "Patterns in Sequences",         type: "Assignment", description: "Identify arithmetic and geometric patterns in number lists.",                 dueDate: "2026-02-04", points: 15, status: "published", createdAt: "2026-02-02", assignTo: "all" },
  { id: "a56", classId: "c2", title: "Arithmetic vs Geometric Quiz",  type: "Quiz",       description: "Distinguish and extend arithmetic vs geometric sequences.",                  dueDate: "2026-02-06", points: 25, status: "published", createdAt: "2026-02-04", assignTo: "all" },
  { id: "a22", classId: "c2", title: "Sequences & Series Worksheet",  type: "Assignment", description: "Identify arithmetic and geometric sequences; find nth terms.",               dueDate: "2026-02-08", points: 30, status: "published", createdAt: "2026-02-01", assignTo: "all" },
  // ── week of Feb 9 ─────────────────────────────────────────────────────────
  { id: "a57", classId: "c2", title: "Common Ratio Practice",         type: "Assignment", description: "Find the common ratio and missing terms in geometric sequences.",             dueDate: "2026-02-11", points: 20, status: "published", createdAt: "2026-02-09", assignTo: "all" },
  { id: "a58", classId: "c2", title: "Convergent Series Classwork",   type: "Assignment", description: "Determine whether infinite geometric series converge; find sums.",            dueDate: "2026-02-13", points: 15, status: "published", createdAt: "2026-02-11", assignTo: "all" },
  { id: "a23", classId: "c2", title: "Geometric Sequences Quiz",      type: "Quiz",       description: "Quiz on geometric sequences, common ratio, and infinite series.",             dueDate: "2026-02-15", points: 50, status: "published", createdAt: "2026-02-08", assignTo: "all" },
  // ── week of Feb 16 ────────────────────────────────────────────────────────
  { id: "a59", classId: "c2", title: "Series Sum Formulas",           type: "Assignment", description: "Apply arithmetic and geometric series sum formulas to find totals.",          dueDate: "2026-02-18", points: 20, status: "published", createdAt: "2026-02-16", assignTo: "all" },
  { id: "a60", classId: "c2", title: "Sigma Notation Check",          type: "Quiz",       description: "Evaluate 10 series written in sigma notation.",                              dueDate: "2026-02-20", points: 30, status: "published", createdAt: "2026-02-18", assignTo: "all" },
  { id: "a24", classId: "c2", title: "Sigma Notation Practice",       type: "Assignment", description: "Evaluate series written in sigma notation.",                                  dueDate: "2026-02-22", points: 25, status: "published", createdAt: "2026-02-15", assignTo: "all" },
  // ── week of Feb 23 ────────────────────────────────────────────────────────
  { id: "a61", classId: "c2", title: "Induction Base Cases",          type: "Assignment", description: "Practice writing base cases and inductive hypotheses.",                       dueDate: "2026-02-25", points: 15, status: "published", createdAt: "2026-02-23", assignTo: "all" },
  { id: "a62", classId: "c2", title: "Proof Structure Worksheet",     type: "Assignment", description: "Complete 4 partially-written induction proofs.",                             dueDate: "2026-02-27", points: 20, status: "published", createdAt: "2026-02-25", assignTo: "all" },
  { id: "a25", classId: "c2", title: "Mathematical Induction Project",type: "Project",    description: "Prove three propositions using mathematical induction.",                      dueDate: "2026-03-01", points: 80, status: "published", createdAt: "2026-02-22", assignTo: "all" },
  // ── week of Mar 2 ─────────────────────────────────────────────────────────
  { id: "a63", classId: "c2", title: "Q1 Review: Sequences",          type: "Assignment", description: "Comprehensive review worksheet for all Q1 sequence and series topics.",       dueDate: "2026-03-04", points: 30, status: "published", createdAt: "2026-03-02", assignTo: "all" },
  { id: "a64", classId: "c2", title: "Q1 Practice Exam",              type: "Quiz",       description: "Full-length timed practice exam for Q1 topics.",                            dueDate: "2026-03-06", points: 50, status: "published", createdAt: "2026-03-04", assignTo: "all" },
  { id: "a26", classId: "c2", title: "Q1 Algebra Exam",               type: "Exam",       description: "End-of-quarter exam covering sequences, series, and polynomials.",            dueDate: "2026-03-07", points: 100, status: "published", createdAt: "2026-02-28", assignTo: "all" },
  // ── week of Mar 9 ─────────────────────────────────────────────────────────
  { id: "a65", classId: "c2", title: "Pascal's Triangle Exploration", type: "Assignment", description: "Explore patterns in Pascal's triangle and link to binomial coefficients.",    dueDate: "2026-03-11", points: 15, status: "published", createdAt: "2026-03-09", assignTo: "all" },
  { id: "a66", classId: "c2", title: "Combination Coefficients",      type: "Assignment", description: "Calculate C(n,r) and match to Pascal's triangle entries.",                   dueDate: "2026-03-13", points: 20, status: "published", createdAt: "2026-03-11", assignTo: "all" },
  { id: "a27", classId: "c2", title: "Binomial Theorem Worksheet",    type: "Assignment", description: "Expand binomial expressions using Pascal's triangle and the theorem.",        dueDate: "2026-03-14", points: 30, status: "published", createdAt: "2026-03-07", assignTo: "all" },
  // ── week of Mar 16 ────────────────────────────────────────────────────────
  { id: "a67", classId: "c2", title: "Synthetic Division Practice",   type: "Assignment", description: "Perform synthetic division on 10 polynomial expressions.",                   dueDate: "2026-03-18", points: 20, status: "published", createdAt: "2026-03-16", assignTo: "all" },
  { id: "a68", classId: "c2", title: "Remainder Theorem Quiz",        type: "Quiz",       description: "Apply the remainder and factor theorems to evaluate polynomials.",            dueDate: "2026-03-19", points: 30, status: "published", createdAt: "2026-03-17", assignTo: "all" },
  { id: "a28", classId: "c2", title: "Polynomial Division Quiz",      type: "Quiz",       description: "Divide polynomials using synthetic and long division methods.",               dueDate: "2026-03-21", points: 40, status: "published", createdAt: "2026-03-14", assignTo: "all" },
  // ── week of Mar 23 ────────────────────────────────────────────────────────
  { id: "a69", classId: "c2", title: "Factor Theorem Worksheet",      type: "Assignment", description: "Use the factor theorem to find factors of polynomials.",                     dueDate: "2026-03-25", points: 20, status: "published", createdAt: "2026-03-23", assignTo: "all" },
  { id: "a70", classId: "c2", title: "Polynomial Roots Practice",     type: "Assignment", description: "Find rational roots using the rational roots theorem.",                       dueDate: "2026-03-26", points: 15, status: "published", createdAt: "2026-03-24", assignTo: "all" },
  { id: "a29", classId: "c2", title: "Factoring & Roots Worksheet",   type: "Assignment", description: "Factor higher-degree polynomials and find their roots.",                      dueDate: "2026-03-28", points: 35, status: "published", createdAt: "2026-03-21", assignTo: "all" },
  // ── week of Mar 30 / Apr ──────────────────────────────────────────────────
  { id: "a71", classId: "c2", title: "Sequences Review Classwork",    type: "Assignment", description: "In-class review of all sequence types before the upcoming quiz.",            dueDate: "2026-04-03", points: 15, status: "published", createdAt: "2026-03-30", assignTo: "all" },
  { id: "a5",  classId: "c2", title: "Arithmetic Sequences Quiz",     type: "Quiz",       description: "Quiz on identifying and solving arithmetic sequences.",                       dueDate: "2026-04-06", points: 50, status: "published", createdAt: "2026-03-28", assignTo: "all" },
  { id: "a6",  classId: "c2", title: "Polynomial Operations",         type: "Assignment", description: "Practice problems on adding, subtracting, and multiplying polynomials.",      dueDate: "2026-04-12", points: 40, status: "published", createdAt: "2026-03-30", assignTo: "all" },
  { id: "a7",  classId: "c2", title: "Circle Theorems Project",       type: "Project",    description: "Create a poster illustrating all major circle theorems with examples.",       dueDate: "2026-04-22", points: 100, status: "draft",    createdAt: "2026-03-31", assignTo: "all" },

  // ── Algebra I (c3) — week of Feb 2 ────────────────────────────────────────
  { id: "a72", classId: "c3", title: "Integer Operations Review",     type: "Assignment", description: "Add, subtract, multiply, and divide positive and negative integers.",        dueDate: "2026-02-04", points: 15, status: "published", createdAt: "2026-02-02", assignTo: "all" },
  { id: "a73", classId: "c3", title: "Number Line Classwork",         type: "Quiz",       description: "Plot integers and rational numbers on a number line; compare values.",       dueDate: "2026-02-06", points: 20, status: "published", createdAt: "2026-02-04", assignTo: "all" },
  { id: "a30", classId: "c3", title: "Real Number Properties",         type: "Assignment", description: "Identify and apply commutative, associative, and distributive properties.",  dueDate: "2026-02-07", points: 20, status: "published", createdAt: "2026-01-31", assignTo: "all" },
  // ── week of Feb 9 ─────────────────────────────────────────────────────────
  { id: "a74", classId: "c3", title: "Grouping Symbols Practice",     type: "Assignment", description: "Simplify expressions with nested parentheses, brackets, and braces.",        dueDate: "2026-02-11", points: 20, status: "published", createdAt: "2026-02-09", assignTo: "all" },
  { id: "a75", classId: "c3", title: "Mixed Operations Check",        type: "Quiz",       description: "10-problem in-class check on mixed operations and grouping symbols.",         dueDate: "2026-02-12", points: 25, status: "published", createdAt: "2026-02-10", assignTo: "all" },
  { id: "a31", classId: "c3", title: "Order of Operations Quiz",       type: "Quiz",       description: "Evaluate expressions using PEMDAS/BODMAS with mixed operations.",            dueDate: "2026-02-14", points: 50, status: "published", createdAt: "2026-02-07", assignTo: "all" },
  // ── week of Feb 16 ────────────────────────────────────────────────────────
  { id: "a76", classId: "c3", title: "Expression Writing",            type: "Assignment", description: "Write algebraic expressions from verbal descriptions.",                       dueDate: "2026-02-18", points: 15, status: "published", createdAt: "2026-02-16", assignTo: "all" },
  { id: "a77", classId: "c3", title: "Translating Words to Algebra",  type: "Assignment", description: "Translate 20 word phrases into algebraic expressions and equations.",        dueDate: "2026-02-19", points: 20, status: "published", createdAt: "2026-02-17", assignTo: "all" },
  { id: "a32", classId: "c3", title: "Variables & Expressions Project",type: "Project",    description: "Create a real-world problem that uses variables and expressions.",           dueDate: "2026-02-21", points: 60, status: "published", createdAt: "2026-02-14", assignTo: "all" },
  // ── week of Feb 23 ────────────────────────────────────────────────────────
  { id: "a78", classId: "c3", title: "Solving One-Step Equations",    type: "Assignment", description: "Solve 15 one-step equations using inverse operations.",                       dueDate: "2026-02-25", points: 15, status: "published", createdAt: "2026-02-23", assignTo: "all" },
  { id: "a79", classId: "c3", title: "Equation Balance Check",        type: "Quiz",       description: "Quick check: solve and verify 8 one-step equations.",                        dueDate: "2026-02-27", points: 25, status: "published", createdAt: "2026-02-25", assignTo: "all" },
  { id: "a33", classId: "c3", title: "One-Step Equations Worksheet",   type: "Assignment", description: "Solve 20 one-step equations and verify each answer.",                        dueDate: "2026-03-01", points: 20, status: "published", createdAt: "2026-02-22", assignTo: "all" },
  // ── week of Mar 2 ─────────────────────────────────────────────────────────
  { id: "a80", classId: "c3", title: "Q1 Review Packet",              type: "Assignment", description: "Comprehensive review of all Q1 topics for exam preparation.",                dueDate: "2026-03-04", points: 25, status: "published", createdAt: "2026-03-02", assignTo: "all" },
  { id: "a81", classId: "c3", title: "Q1 Practice Test",              type: "Quiz",       description: "Timed full-length practice test for Q1 content.",                           dueDate: "2026-03-06", points: 50, status: "published", createdAt: "2026-03-04", assignTo: "all" },
  { id: "a34", classId: "c3", title: "Q1 Algebra Exam",                type: "Exam",       description: "End-of-quarter exam covering variables, expressions, and basic equations.",  dueDate: "2026-03-07", points: 100, status: "published", createdAt: "2026-02-28", assignTo: "all" },
  // ── week of Mar 9 ─────────────────────────────────────────────────────────
  { id: "a82", classId: "c3", title: "Combining Like Terms",          type: "Assignment", description: "Simplify expressions by identifying and combining like terms.",               dueDate: "2026-03-11", points: 15, status: "published", createdAt: "2026-03-09", assignTo: "all" },
  { id: "a83", classId: "c3", title: "Distribution Practice",         type: "Assignment", description: "Apply the distributive property to simplify expressions.",                   dueDate: "2026-03-12", points: 20, status: "published", createdAt: "2026-03-10", assignTo: "all" },
  { id: "a35", classId: "c3", title: "Two-Step Equations Practice",    type: "Assignment", description: "Solve 15 two-step equations showing all work.",                              dueDate: "2026-03-14", points: 25, status: "published", createdAt: "2026-03-07", assignTo: "all" },
  // ── week of Mar 16 ────────────────────────────────────────────────────────
  { id: "a84", classId: "c3", title: "Graphing Inequalities",         type: "Assignment", description: "Solve inequalities and graph solutions on number lines.",                     dueDate: "2026-03-18", points: 20, status: "published", createdAt: "2026-03-16", assignTo: "all" },
  { id: "a85", classId: "c3", title: "Compound Inequalities Intro",   type: "Assignment", description: "Introduction to AND/OR compound inequalities with number line solutions.",    dueDate: "2026-03-19", points: 15, status: "published", createdAt: "2026-03-17", assignTo: "all" },
  { id: "a36", classId: "c3", title: "Inequalities Quiz",              type: "Quiz",       description: "Solve and graph one- and two-step inequalities on a number line.",           dueDate: "2026-03-21", points: 40, status: "published", createdAt: "2026-03-14", assignTo: "all" },
  // ── week of Mar 23 ────────────────────────────────────────────────────────
  { id: "a86", classId: "c3", title: "Variables on Both Sides",       type: "Assignment", description: "Solve equations where variables appear on both sides.",                       dueDate: "2026-03-25", points: 15, status: "published", createdAt: "2026-03-23", assignTo: "all" },
  { id: "a87", classId: "c3", title: "Equation Word Problems",        type: "Assignment", description: "Write and solve equations from 10 word problem scenarios.",                   dueDate: "2026-03-26", points: 20, status: "published", createdAt: "2026-03-24", assignTo: "all" },
  { id: "a37", classId: "c3", title: "Multi-Step Equations Worksheet", type: "Assignment", description: "Solve multi-step equations with variables on both sides.",                   dueDate: "2026-03-28", points: 30, status: "published", createdAt: "2026-03-21", assignTo: "all" },
  // ── week of Mar 30 / Apr ──────────────────────────────────────────────────
  { id: "a88", classId: "c3", title: "Pre-Quiz Review Classwork",     type: "Assignment", description: "In-class review of linear equations before the unit quiz.",                  dueDate: "2026-04-02", points: 15, status: "published", createdAt: "2026-03-30", assignTo: "all" },
  { id: "a8",  classId: "c3", title: "Linear Equations Quiz",          type: "Quiz",       description: "Solve linear equations in one variable.",                                    dueDate: "2026-04-04", points: 50, status: "published", createdAt: "2026-03-27", assignTo: "all" },
  { id: "a9",  classId: "c3", title: "Graphing Functions Worksheet",   type: "Assignment", description: "Plot and identify properties of linear functions.",                           dueDate: "2026-04-08", points: 30, status: "published", createdAt: "2026-03-29", assignTo: "all" },
  { id: "a10", classId: "c3", title: "Systems of Equations",           type: "Assignment", description: "Solve systems of linear equations using substitution and elimination.",       dueDate: "2026-04-14", points: 40, status: "published", createdAt: "2026-03-30", assignTo: "all" },
  { id: "a11", classId: "c3", title: "Algebra I Midterm",              type: "Exam",       description: "Comprehensive midterm covering all Algebra I topics.",                        dueDate: "2026-04-18", points: 100, status: "draft",    createdAt: "2026-03-31", assignTo: "all" },
];

export const SUBMISSIONS: Submission[] = [
  { id: "sb1",  assignmentId: "a1", studentId: "s1", status: "Graded",    submittedAt: "2026-04-04", grade: 48,   feedback: "Excellent work!" },
  { id: "sb2",  assignmentId: "a1", studentId: "s2", status: "Graded",    submittedAt: "2026-04-04", grade: 42,   feedback: "Good job, review problem 3." },
  { id: "sb3",  assignmentId: "a1", studentId: "s3", status: "Graded",    submittedAt: "2026-04-05", grade: 35,   feedback: "Practice more on factoring." },
  { id: "sb4",  assignmentId: "a1", studentId: "s4", status: "Late",      submittedAt: "2026-04-06", grade: 38,   feedback: "Late submission." },
  { id: "sb5",  assignmentId: "a1", studentId: "s5", status: "Graded",    submittedAt: "2026-04-04", grade: 46,   feedback: "Very good!" },
  { id: "sb6",  assignmentId: "a1", studentId: "s6", status: "Missing",   submittedAt: null,          grade: null, feedback: null },
  { id: "sb7",  assignmentId: "a2", studentId: "s1", status: "Submitted", submittedAt: "2026-04-09", grade: null, feedback: null,
    content: "Problem 1: (x+3)/(x²-9) = (x+3)/((x+3)(x-3)) = 1/(x-3), x ≠ ±3\nProblem 2: (2x²-8)/(x-2) = 2(x²-4)/(x-2) = 2(x+2)(x-2)/(x-2) = 2(x+2), x ≠ 2\nProblems 3–20 are attached in the PDF worksheet.\n\nI found problems 15–18 quite challenging — I wasn't sure whether to factor first or find the LCD. I went with factoring and it seemed to work.",
    attachments: [{ name: "Rational_Expressions_Santos.pdf", size: "1.1 MB", type: "pdf" }] },
  { id: "sb8",  assignmentId: "a2", studentId: "s2", status: "Submitted", submittedAt: "2026-04-09", grade: null, feedback: null,
    content: "Completed all 20 problems as required. Here are my work for problems 1–5:\n1. (x²-4)/(x-2) = (x+2)(x-2)/(x-2) = x+2\n2. (3x+9)/(x+3) = 3(x+3)/(x+3) = 3\n3. (x²-1)/(x+1) = (x-1)(x+1)/(x+1) = x-1\n4–20 shown in attached worksheet.",
    attachments: [{ name: "Worksheet_Reyes.pdf", size: "890 KB", type: "pdf" }] },
  { id: "sb9",  assignmentId: "a2", studentId: "s3", status: "Missing",   submittedAt: null,          grade: null, feedback: null },
  { id: "sb10", assignmentId: "a2", studentId: "s4", status: "Submitted", submittedAt: "2026-04-10", grade: null, feedback: null,
    content: "I completed problems 1–20. Some of them were hard especially the ones with quadratics in the denominator. I tried my best and showed all steps.\n\nFor problem 12 I got stuck and had to look at my notes but I think I got it right in the end.\n\nPlease see attached file.",
    attachments: [{ name: "Dela_Cruz_Worksheet.pdf", size: "754 KB", type: "pdf" }, { name: "Notes_Reference.jpg", size: "320 KB", type: "img" }] },
  { id: "sb11", assignmentId: "a2", studentId: "s5", status: "Submitted", submittedAt: "2026-04-10", grade: null, feedback: null,
    content: "All 20 problems completed with full step-by-step solutions. I double-checked every answer by substituting back into the original expression.\n\nKey method I used: Factor completely → cancel common factors → state restrictions.\n\nI also added bonus work on problems 8 and 14 using an alternative method.",
    attachments: [{ name: "Garcia_Rational_Expressions.pdf", size: "1.3 MB", type: "pdf" }] },
  { id: "sb12", assignmentId: "a2", studentId: "s6", status: "Missing",   submittedAt: null,          grade: null, feedback: null },
  { id: "sb13", assignmentId: "a4", studentId: "s1", status: "Graded",    submittedAt: "2026-04-19", grade: 75,   feedback: "Good research, needs more examples." },
  { id: "sb14", assignmentId: "a4", studentId: "s2", status: "Graded",    submittedAt: "2026-04-19", grade: 70,   feedback: "Decent work." },
  { id: "sb15", assignmentId: "a4", studentId: "s3", status: "Graded",    submittedAt: "2026-04-20", grade: 65,   feedback: "More effort needed." },
  { id: "sb16", assignmentId: "a4", studentId: "s4", status: "Missing",   submittedAt: null,          grade: null, feedback: null },
  { id: "sb17", assignmentId: "a4", studentId: "s5", status: "Graded",    submittedAt: "2026-04-18", grade: 78,   feedback: "Excellent presentation!" },
  { id: "sb18", assignmentId: "a4", studentId: "s6", status: "Late",      submittedAt: "2026-04-21", grade: 60,   feedback: "Late submission." },
  { id: "sb19", assignmentId: "a5", studentId: "s7",  status: "Graded",    submittedAt: "2026-04-05", grade: 45,   feedback: "Well done!" },
  { id: "sb20", assignmentId: "a5", studentId: "s8",  status: "Graded",    submittedAt: "2026-04-05", grade: 40,   feedback: "Review sequences more." },
  { id: "sb21", assignmentId: "a5", studentId: "s9",  status: "Graded",    submittedAt: "2026-04-06", grade: 48,   feedback: "Near perfect!" },
  { id: "sb22", assignmentId: "a5", studentId: "s10", status: "Missing",   submittedAt: null,          grade: null, feedback: null },
  { id: "sb23", assignmentId: "a5", studentId: "s11", status: "Graded",    submittedAt: "2026-04-05", grade: 44,   feedback: "Good job." },
  { id: "sb24", assignmentId: "a5", studentId: "s12", status: "Late",      submittedAt: "2026-04-07", grade: 38,   feedback: "Submitted late." },
  { id: "sb25", assignmentId: "a6", studentId: "s7",  status: "Submitted", submittedAt: "2026-04-11", grade: null, feedback: null,
    content: "1. (2x+4)(3x-6) = 2(x+2)·3(x-2) = 6(x+2)(x-2) = 6(x²-4) = 6x²-24\n2. (x²+5x+6)+(x²-x-12) = 2x²+4x-6\n3. (3x³-2x²+x)-(x³+4x-1) = 2x³-2x²-3x+1\nAll remaining problems on attached worksheet.",
    attachments: [{ name: "Torres_Polynomial_Ops.pdf", size: "980 KB", type: "pdf" }] },
  { id: "sb26", assignmentId: "a6", studentId: "s8",  status: "Missing",   submittedAt: null,          grade: null, feedback: null },
  { id: "sb27", assignmentId: "a6", studentId: "s9",  status: "Submitted", submittedAt: "2026-04-12", grade: null, feedback: null,
    content: "Polynomial Operations — complete solutions:\n\nAddition problems (1–7): Completed by combining like terms and arranging in descending order.\nSubtraction (8–14): Used the 'change signs and add' method.\nMultiplication (15–20): Applied FOIL and the distributive property.\n\nPlease check my work on #17 — I may have made an arithmetic error in the final step.",
    attachments: [{ name: "Flores_Polynomial_Work.pdf", size: "1.05 MB", type: "pdf" }, { name: "Scratch_Work.jpg", size: "440 KB", type: "img" }] },
  { id: "sb28", assignmentId: "a6", studentId: "s10", status: "Submitted", submittedAt: "2026-04-11", grade: null, feedback: null,
    content: "I finished all the problems but honestly struggled with the multiplication section. I tried to use FOIL for all of them but some had three terms and I wasn't sure how to extend the method. See my work in the attached file.",
    attachments: [{ name: "Castillo_Polynomials.pdf", size: "670 KB", type: "pdf" }] },
  { id: "sb29", assignmentId: "a6", studentId: "s11", status: "Submitted", submittedAt: "2026-04-12", grade: null, feedback: null,
    content: "Problems 1–20 completed. I used the standard algorithm for all operations and verified by substituting x=1 into both the original and simplified expressions to check equivalence. All 20 verified.",
    attachments: [{ name: "Navarro_Polynomial_Operations.pdf", size: "1.2 MB", type: "pdf" }] },
  { id: "sb30", assignmentId: "a6", studentId: "s12", status: "Missing",   submittedAt: null,          grade: null, feedback: null },
  { id: "sb31", assignmentId: "a8", studentId: "s13", status: "Graded",    submittedAt: "2026-04-03", grade: 47,   feedback: "Excellent!" },
  { id: "sb32", assignmentId: "a8", studentId: "s14", status: "Graded",    submittedAt: "2026-04-04", grade: 38,   feedback: "Practice more." },
  { id: "sb33", assignmentId: "a8", studentId: "s15", status: "Graded",    submittedAt: "2026-04-03", grade: 42,   feedback: "Good effort." },
  { id: "sb34", assignmentId: "a8", studentId: "s16", status: "Late",      submittedAt: "2026-04-05", grade: 35,   feedback: "Submitted late." },
  { id: "sb35", assignmentId: "a8", studentId: "s17", status: "Graded",    submittedAt: "2026-04-03", grade: 44,   feedback: "Very good!" },
  { id: "sb36", assignmentId: "a8", studentId: "s18", status: "Missing",   submittedAt: null,          grade: null, feedback: null },
  { id: "sb37", assignmentId: "a9", studentId: "s13", status: "Submitted", submittedAt: "2026-04-07", grade: null, feedback: null,
    content: "Graphing Functions Worksheet — Rosa Aquino\n\nGraph 1 (y=2x+3): slope = 2, y-intercept = 3, x-intercept = -1.5. Domain: all reals. Range: all reals.\nGraph 2 (y=-x+5): slope = -1, y-intercept = 5, x-intercept = 5. Decreasing function.\nGraph 3 (y=0.5x-2): slope = 0.5, y-intercept = -2. Very gradual positive slope.\nGraphs 4–10 plotted on attached grid paper with labeled axes and identified key features.",
    attachments: [{ name: "Aquino_Graphing_Worksheet.pdf", size: "2.1 MB", type: "pdf" }] },
  { id: "sb38", assignmentId: "a9", studentId: "s14", status: "Submitted", submittedAt: "2026-04-08", grade: null, feedback: null,
    content: "I completed the graphing worksheet. I plotted each function and labeled the slope and intercepts. Some of the graphs were tricky when the slope was a fraction. I used a table of values for each one to make sure I had at least 3 points before drawing the line.",
    attachments: [{ name: "Villanueva_Graphs.pdf", size: "1.7 MB", type: "pdf" }] },
  { id: "sb39", assignmentId: "a9", studentId: "s15", status: "Missing",   submittedAt: null,          grade: null, feedback: null },
  { id: "sb40", assignmentId: "a9", studentId: "s16", status: "Submitted", submittedAt: "2026-04-07", grade: null, feedback: null,
    content: "Graphing assignment done. I had trouble with problems 6 and 7 because the y-intercept was a decimal. I estimated the point on the graph as best I could. All 10 functions are graphed in the attached file.",
    attachments: [{ name: "Soriano_Graphing.pdf", size: "1.4 MB", type: "pdf" }] },
  { id: "sb41", assignmentId: "a9", studentId: "s17", status: "Submitted", submittedAt: "2026-04-08", grade: null, feedback: null,
    content: "All 10 linear functions graphed with full analysis:\n• Slope identified (positive/negative/zero/undefined)\n• Both x and y intercepts labeled\n• Domain and range stated\n• Rate of change described in context\n\nFor function 9 (y = 3), I noted it is a horizontal line with slope = 0 and undefined x-intercept. For function 10 (x = -2), I noted it is a vertical line with undefined slope.",
    attachments: [{ name: "Aguilar_Linear_Functions.pdf", size: "1.9 MB", type: "pdf" }, { name: "Function_Analysis_Table.docx", size: "48 KB", type: "doc" }] },
  { id: "sb42", assignmentId: "a9", studentId: "s18", status: "Missing",   submittedAt: null,          grade: null, feedback: null },
  { id: "sb43", assignmentId: "a10", studentId: "s13", status: "Submitted", submittedAt: "2026-04-13", grade: null, feedback: null,
    content: "Systems of Equations — Rosa Aquino\n\nSubstitution method (problems 1–5):\nProblem 1: y=2x+1, 3x+y=11 → 3x+(2x+1)=11 → 5x=10 → x=2, y=5 ✓\nProblem 2: x=y-3, 2x+3y=4 → 2(y-3)+3y=4 → 5y=10 → y=2, x=-1 ✓\n\nElimination method (problems 6–10): All solved and verified by substituting back.",
    attachments: [{ name: "Aquino_Systems.pdf", size: "890 KB", type: "pdf" }] },
  { id: "sb44", assignmentId: "a10", studentId: "s14", status: "Missing",   submittedAt: null,           grade: null, feedback: null },
  { id: "sb45", assignmentId: "a10", studentId: "s15", status: "Submitted", submittedAt: "2026-04-14", grade: null, feedback: null,
    content: "I used both substitution and elimination for the problems assigned. The substitution method was easier for me. The elimination method I found confusing when I had to multiply both equations — I wasn't sure which number to multiply by. Please see my attached work.",
    attachments: [{ name: "Fernandez_Systems.pdf", size: "760 KB", type: "pdf" }] },
  { id: "sb46", assignmentId: "a10", studentId: "s16", status: "Submitted", submittedAt: "2026-04-13", grade: null, feedback: null,
    content: "Systems completed. I want to note that for problem 7 I got no solution (parallel lines) — I checked three times and the lines definitely don't intersect. For problem 9 I got infinite solutions (same line). I hope those are correct because they felt different from the others.",
    attachments: [{ name: "Soriano_Systems_of_Equations.pdf", size: "820 KB", type: "pdf" }] },
  { id: "sb47", assignmentId: "a10", studentId: "s17", status: "Late",      submittedAt: "2026-04-15", grade: null, feedback: null,
    content: "I apologize for the late submission — I was absent on the due date. I completed all 10 systems and verified each answer. I used elimination for all problems as I find it more systematic. My solutions and checks are all shown in the attached file.",
    attachments: [{ name: "Aguilar_Systems_Late.pdf", size: "910 KB", type: "pdf" }] },
  { id: "sb48", assignmentId: "a10", studentId: "s18", status: "Missing",   submittedAt: null,           grade: null, feedback: null },

  // ── Math 9 (c1) new weekly assignments ───────────────────────────────────
  // a38 (15pts, Feb 4)
  { id: "sb193", assignmentId: "a38", studentId: "s1", status: "Graded",  submittedAt: "2026-02-04", grade: 14, feedback: "Great classwork!" },
  { id: "sb194", assignmentId: "a38", studentId: "s2", status: "Graded",  submittedAt: "2026-02-04", grade: 13, feedback: "Good effort." },
  { id: "sb195", assignmentId: "a38", studentId: "s3", status: "Graded",  submittedAt: "2026-02-04", grade: 11, feedback: "Adequate." },
  { id: "sb196", assignmentId: "a38", studentId: "s4", status: "Graded",  submittedAt: "2026-02-04", grade: 10, feedback: "Needs review." },
  { id: "sb197", assignmentId: "a38", studentId: "s5", status: "Graded",  submittedAt: "2026-02-04", grade: 14, feedback: "Excellent!" },
  { id: "sb198", assignmentId: "a38", studentId: "s6", status: "Graded",  submittedAt: "2026-02-04", grade: 9,  feedback: "Review expressions." },
  // a39 (20pts, Feb 6)
  { id: "sb199", assignmentId: "a39", studentId: "s1", status: "Graded",  submittedAt: "2026-02-06", grade: 19, feedback: "Near perfect!" },
  { id: "sb200", assignmentId: "a39", studentId: "s2", status: "Graded",  submittedAt: "2026-02-06", grade: 17, feedback: "Good work." },
  { id: "sb201", assignmentId: "a39", studentId: "s3", status: "Graded",  submittedAt: "2026-02-06", grade: 15, feedback: "Adequate." },
  { id: "sb202", assignmentId: "a39", studentId: "s4", status: "Graded",  submittedAt: "2026-02-06", grade: 14, feedback: "Review needed." },
  { id: "sb203", assignmentId: "a39", studentId: "s5", status: "Graded",  submittedAt: "2026-02-06", grade: 18, feedback: "Very good!" },
  { id: "sb204", assignmentId: "a39", studentId: "s6", status: "Late",    submittedAt: "2026-02-07", grade: 12, feedback: "Late." },
  // a40 (20pts, Feb 11)
  { id: "sb205", assignmentId: "a40", studentId: "s1", status: "Graded",  submittedAt: "2026-02-10", grade: 19, feedback: "Excellent!" },
  { id: "sb206", assignmentId: "a40", studentId: "s2", status: "Graded",  submittedAt: "2026-02-10", grade: 17, feedback: "Good." },
  { id: "sb207", assignmentId: "a40", studentId: "s3", status: "Graded",  submittedAt: "2026-02-11", grade: 15, feedback: "Okay." },
  { id: "sb208", assignmentId: "a40", studentId: "s4", status: "Graded",  submittedAt: "2026-02-11", grade: 14, feedback: "Passing." },
  { id: "sb209", assignmentId: "a40", studentId: "s5", status: "Graded",  submittedAt: "2026-02-10", grade: 18, feedback: "Strong work." },
  { id: "sb210", assignmentId: "a40", studentId: "s6", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a41 (15pts, Feb 12)
  { id: "sb211", assignmentId: "a41", studentId: "s1", status: "Graded",  submittedAt: "2026-02-12", grade: 14, feedback: "Great!" },
  { id: "sb212", assignmentId: "a41", studentId: "s2", status: "Graded",  submittedAt: "2026-02-12", grade: 13, feedback: "Good work." },
  { id: "sb213", assignmentId: "a41", studentId: "s3", status: "Graded",  submittedAt: "2026-02-12", grade: 11, feedback: "Needs more practice." },
  { id: "sb214", assignmentId: "a41", studentId: "s4", status: "Graded",  submittedAt: "2026-02-12", grade: 10, feedback: "Review perfect squares." },
  { id: "sb215", assignmentId: "a41", studentId: "s5", status: "Graded",  submittedAt: "2026-02-11", grade: 14, feedback: "Excellent!" },
  { id: "sb216", assignmentId: "a41", studentId: "s6", status: "Graded",  submittedAt: "2026-02-12", grade: 9,  feedback: "Below expectation." },
  // a42 (20pts, Feb 18)
  { id: "sb217", assignmentId: "a42", studentId: "s1", status: "Graded",  submittedAt: "2026-02-18", grade: 19, feedback: "Well done!" },
  { id: "sb218", assignmentId: "a42", studentId: "s2", status: "Graded",  submittedAt: "2026-02-18", grade: 17, feedback: "Good." },
  { id: "sb219", assignmentId: "a42", studentId: "s3", status: "Graded",  submittedAt: "2026-02-18", grade: 15, feedback: "Okay effort." },
  { id: "sb220", assignmentId: "a42", studentId: "s4", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb221", assignmentId: "a42", studentId: "s5", status: "Graded",  submittedAt: "2026-02-18", grade: 18, feedback: "Very good!" },
  { id: "sb222", assignmentId: "a42", studentId: "s6", status: "Graded",  submittedAt: "2026-02-18", grade: 12, feedback: "Review steps." },
  // a43 (25pts, Feb 19)
  { id: "sb223", assignmentId: "a43", studentId: "s1", status: "Graded",  submittedAt: "2026-02-19", grade: 24, feedback: "Excellent!" },
  { id: "sb224", assignmentId: "a43", studentId: "s2", status: "Graded",  submittedAt: "2026-02-19", grade: 21, feedback: "Good quiz." },
  { id: "sb225", assignmentId: "a43", studentId: "s3", status: "Graded",  submittedAt: "2026-02-19", grade: 19, feedback: "Passing." },
  { id: "sb226", assignmentId: "a43", studentId: "s4", status: "Graded",  submittedAt: "2026-02-19", grade: 17, feedback: "Review constant term." },
  { id: "sb227", assignmentId: "a43", studentId: "s5", status: "Graded",  submittedAt: "2026-02-19", grade: 23, feedback: "Very good!" },
  { id: "sb228", assignmentId: "a43", studentId: "s6", status: "Late",    submittedAt: "2026-02-20", grade: 15, feedback: "Late." },
  // a44 (20pts, Feb 25)
  { id: "sb229", assignmentId: "a44", studentId: "s1", status: "Graded",  submittedAt: "2026-02-25", grade: 19, feedback: "Correct analysis!" },
  { id: "sb230", assignmentId: "a44", studentId: "s2", status: "Graded",  submittedAt: "2026-02-25", grade: 17, feedback: "Good work." },
  { id: "sb231", assignmentId: "a44", studentId: "s3", status: "Graded",  submittedAt: "2026-02-25", grade: 15, feedback: "Adequate." },
  { id: "sb232", assignmentId: "a44", studentId: "s4", status: "Graded",  submittedAt: "2026-02-25", grade: 14, feedback: "Watch sign errors." },
  { id: "sb233", assignmentId: "a44", studentId: "s5", status: "Graded",  submittedAt: "2026-02-25", grade: 18, feedback: "Strong work!" },
  { id: "sb234", assignmentId: "a44", studentId: "s6", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a45 (15pts, Feb 27)
  { id: "sb235", assignmentId: "a45", studentId: "s1", status: "Graded",  submittedAt: "2026-02-27", grade: 14, feedback: "Good application!" },
  { id: "sb236", assignmentId: "a45", studentId: "s2", status: "Graded",  submittedAt: "2026-02-27", grade: 13, feedback: "Good." },
  { id: "sb237", assignmentId: "a45", studentId: "s3", status: "Graded",  submittedAt: "2026-02-27", grade: 11, feedback: "Okay." },
  { id: "sb238", assignmentId: "a45", studentId: "s4", status: "Graded",  submittedAt: "2026-02-27", grade: 10, feedback: "Needs more practice." },
  { id: "sb239", assignmentId: "a45", studentId: "s5", status: "Graded",  submittedAt: "2026-02-27", grade: 13, feedback: "Well done!" },
  { id: "sb240", assignmentId: "a45", studentId: "s6", status: "Graded",  submittedAt: "2026-02-27", grade: 9,  feedback: "Review word problems." },
  // a46 (30pts, Mar 4)
  { id: "sb241", assignmentId: "a46", studentId: "s1", status: "Graded",  submittedAt: "2026-03-04", grade: 28, feedback: "Thorough review!" },
  { id: "sb242", assignmentId: "a46", studentId: "s2", status: "Graded",  submittedAt: "2026-03-04", grade: 26, feedback: "Good preparation." },
  { id: "sb243", assignmentId: "a46", studentId: "s3", status: "Graded",  submittedAt: "2026-03-04", grade: 22, feedback: "Adequate." },
  { id: "sb244", assignmentId: "a46", studentId: "s4", status: "Graded",  submittedAt: "2026-03-04", grade: 20, feedback: "Review quadratics." },
  { id: "sb245", assignmentId: "a46", studentId: "s5", status: "Graded",  submittedAt: "2026-03-03", grade: 27, feedback: "Excellent preparation!" },
  { id: "sb246", assignmentId: "a46", studentId: "s6", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a47 (40pts, Mar 6)
  { id: "sb247", assignmentId: "a47", studentId: "s1", status: "Graded",  submittedAt: "2026-03-06", grade: 38, feedback: "Ready for exam!" },
  { id: "sb248", assignmentId: "a47", studentId: "s2", status: "Graded",  submittedAt: "2026-03-06", grade: 34, feedback: "Good practice." },
  { id: "sb249", assignmentId: "a47", studentId: "s3", status: "Graded",  submittedAt: "2026-03-06", grade: 30, feedback: "Passing." },
  { id: "sb250", assignmentId: "a47", studentId: "s4", status: "Graded",  submittedAt: "2026-03-06", grade: 27, feedback: "Review before exam." },
  { id: "sb251", assignmentId: "a47", studentId: "s5", status: "Graded",  submittedAt: "2026-03-06", grade: 37, feedback: "Great practice run!" },
  { id: "sb252", assignmentId: "a47", studentId: "s6", status: "Graded",  submittedAt: "2026-03-06", grade: 25, feedback: "Extra prep recommended." },
  // a48 (20pts, Mar 11)
  { id: "sb253", assignmentId: "a48", studentId: "s1", status: "Graded",  submittedAt: "2026-03-11", grade: 19, feedback: "Great analysis!" },
  { id: "sb254", assignmentId: "a48", studentId: "s2", status: "Graded",  submittedAt: "2026-03-11", grade: 17, feedback: "Good." },
  { id: "sb255", assignmentId: "a48", studentId: "s3", status: "Graded",  submittedAt: "2026-03-11", grade: 15, feedback: "Okay." },
  { id: "sb256", assignmentId: "a48", studentId: "s4", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb257", assignmentId: "a48", studentId: "s5", status: "Graded",  submittedAt: "2026-03-10", grade: 18, feedback: "Very good!" },
  { id: "sb258", assignmentId: "a48", studentId: "s6", status: "Graded",  submittedAt: "2026-03-11", grade: 12, feedback: "Needs revision." },
  // a49 (15pts, Mar 12)
  { id: "sb259", assignmentId: "a49", studentId: "s1", status: "Graded",  submittedAt: "2026-03-12", grade: 14, feedback: "Excellent!" },
  { id: "sb260", assignmentId: "a49", studentId: "s2", status: "Graded",  submittedAt: "2026-03-12", grade: 13, feedback: "Good conversions." },
  { id: "sb261", assignmentId: "a49", studentId: "s3", status: "Graded",  submittedAt: "2026-03-12", grade: 11, feedback: "Needs practice." },
  { id: "sb262", assignmentId: "a49", studentId: "s4", status: "Graded",  submittedAt: "2026-03-12", grade: 10, feedback: "Review vertex form." },
  { id: "sb263", assignmentId: "a49", studentId: "s5", status: "Graded",  submittedAt: "2026-03-11", grade: 14, feedback: "Well done!" },
  { id: "sb264", assignmentId: "a49", studentId: "s6", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a50 (20pts, Mar 18)
  { id: "sb265", assignmentId: "a50", studentId: "s1", status: "Graded",  submittedAt: "2026-03-18", grade: 19, feedback: "All simplified correctly." },
  { id: "sb266", assignmentId: "a50", studentId: "s2", status: "Graded",  submittedAt: "2026-03-18", grade: 17, feedback: "Good work." },
  { id: "sb267", assignmentId: "a50", studentId: "s3", status: "Graded",  submittedAt: "2026-03-18", grade: 15, feedback: "Adequate." },
  { id: "sb268", assignmentId: "a50", studentId: "s4", status: "Graded",  submittedAt: "2026-03-18", grade: 14, feedback: "Review prime factorization." },
  { id: "sb269", assignmentId: "a50", studentId: "s5", status: "Graded",  submittedAt: "2026-03-17", grade: 18, feedback: "Strong work!" },
  { id: "sb270", assignmentId: "a50", studentId: "s6", status: "Graded",  submittedAt: "2026-03-18", grade: 12, feedback: "Keep practicing." },
  // a51 (30pts, Mar 19)
  { id: "sb271", assignmentId: "a51", studentId: "s1", status: "Graded",  submittedAt: "2026-03-19", grade: 28, feedback: "Excellent quiz!" },
  { id: "sb272", assignmentId: "a51", studentId: "s2", status: "Graded",  submittedAt: "2026-03-19", grade: 26, feedback: "Good." },
  { id: "sb273", assignmentId: "a51", studentId: "s3", status: "Graded",  submittedAt: "2026-03-19", grade: 22, feedback: "Passing." },
  { id: "sb274", assignmentId: "a51", studentId: "s4", status: "Graded",  submittedAt: "2026-03-19", grade: 21, feedback: "Review operations." },
  { id: "sb275", assignmentId: "a51", studentId: "s5", status: "Graded",  submittedAt: "2026-03-19", grade: 27, feedback: "Very good!" },
  { id: "sb276", assignmentId: "a51", studentId: "s6", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a52 (15pts, Mar 25)
  { id: "sb277", assignmentId: "a52", studentId: "s1", status: "Graded",  submittedAt: "2026-03-25", grade: 14, feedback: "Correct rewrites!" },
  { id: "sb278", assignmentId: "a52", studentId: "s2", status: "Graded",  submittedAt: "2026-03-25", grade: 13, feedback: "Good." },
  { id: "sb279", assignmentId: "a52", studentId: "s3", status: "Graded",  submittedAt: "2026-03-25", grade: 11, feedback: "Watch zero exponents." },
  { id: "sb280", assignmentId: "a52", studentId: "s4", status: "Graded",  submittedAt: "2026-03-25", grade: 10, feedback: "Review negative exponents." },
  { id: "sb281", assignmentId: "a52", studentId: "s5", status: "Graded",  submittedAt: "2026-03-24", grade: 14, feedback: "Excellent!" },
  { id: "sb282", assignmentId: "a52", studentId: "s6", status: "Graded",  submittedAt: "2026-03-25", grade: 9,  feedback: "Needs more practice." },
  // a53 (20pts, Mar 26)
  { id: "sb283", assignmentId: "a53", studentId: "s1", status: "Graded",  submittedAt: "2026-03-26", grade: 19, feedback: "Precise conversions!" },
  { id: "sb284", assignmentId: "a53", studentId: "s2", status: "Graded",  submittedAt: "2026-03-26", grade: 17, feedback: "Good." },
  { id: "sb285", assignmentId: "a53", studentId: "s3", status: "Graded",  submittedAt: "2026-03-26", grade: 15, feedback: "Adequate." },
  { id: "sb286", assignmentId: "a53", studentId: "s4", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb287", assignmentId: "a53", studentId: "s5", status: "Graded",  submittedAt: "2026-03-25", grade: 18, feedback: "Very good!" },
  { id: "sb288", assignmentId: "a53", studentId: "s6", status: "Graded",  submittedAt: "2026-03-26", grade: 12, feedback: "Review notation." },
  // a54 (15pts, Apr 3)
  { id: "sb289", assignmentId: "a54", studentId: "s1", status: "Graded",  submittedAt: "2026-04-03", grade: 14, feedback: "Great review!" },
  { id: "sb290", assignmentId: "a54", studentId: "s2", status: "Graded",  submittedAt: "2026-04-03", grade: 13, feedback: "Good." },
  { id: "sb291", assignmentId: "a54", studentId: "s3", status: "Graded",  submittedAt: "2026-04-03", grade: 11, feedback: "Keep reviewing." },
  { id: "sb292", assignmentId: "a54", studentId: "s4", status: "Graded",  submittedAt: "2026-04-03", grade: 10, feedback: "Practice factoring." },
  { id: "sb293", assignmentId: "a54", studentId: "s5", status: "Graded",  submittedAt: "2026-04-02", grade: 14, feedback: "Excellent!" },
  { id: "sb294", assignmentId: "a54", studentId: "s6", status: "Late",    submittedAt: "2026-04-04", grade: 9,  feedback: "Late." },

  // ── Math 10 (c2) new weekly assignments ───────────────────────────────────
  // a55 (15pts, Feb 4)
  { id: "sb295", assignmentId: "a55", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-04", grade: 14, feedback: "Good patterns!" },
  { id: "sb296", assignmentId: "a55", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-04", grade: 12, feedback: "Good." },
  { id: "sb297", assignmentId: "a55", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-04", grade: 15, feedback: "Perfect!" },
  { id: "sb298", assignmentId: "a55", studentId: "s10", status: "Graded",  submittedAt: "2026-02-04", grade: 10, feedback: "Review sequences." },
  { id: "sb299", assignmentId: "a55", studentId: "s11", status: "Graded",  submittedAt: "2026-02-04", grade: 13, feedback: "Well done." },
  { id: "sb300", assignmentId: "a55", studentId: "s12", status: "Graded",  submittedAt: "2026-02-04", grade: 11, feedback: "Good attempt." },
  // a56 (25pts, Feb 6)
  { id: "sb301", assignmentId: "a56", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-06", grade: 23, feedback: "Excellent!" },
  { id: "sb302", assignmentId: "a56", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-06", grade: 20, feedback: "Good." },
  { id: "sb303", assignmentId: "a56", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-06", grade: 24, feedback: "Near perfect!" },
  { id: "sb304", assignmentId: "a56", studentId: "s10", status: "Graded",  submittedAt: "2026-02-06", grade: 17, feedback: "Adequate." },
  { id: "sb305", assignmentId: "a56", studentId: "s11", status: "Graded",  submittedAt: "2026-02-06", grade: 22, feedback: "Very good!" },
  { id: "sb306", assignmentId: "a56", studentId: "s12", status: "Late",    submittedAt: "2026-02-07", grade: 18, feedback: "Late." },
  // a57 (20pts, Feb 11)
  { id: "sb307", assignmentId: "a57", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-11", grade: 19, feedback: "Great!" },
  { id: "sb308", assignmentId: "a57", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-11", grade: 16, feedback: "Good." },
  { id: "sb309", assignmentId: "a57", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-10", grade: 19, feedback: "Excellent!" },
  { id: "sb310", assignmentId: "a57", studentId: "s10", status: "Graded",  submittedAt: "2026-02-11", grade: 14, feedback: "Review ratio." },
  { id: "sb311", assignmentId: "a57", studentId: "s11", status: "Graded",  submittedAt: "2026-02-11", grade: 18, feedback: "Strong." },
  { id: "sb312", assignmentId: "a57", studentId: "s12", status: "Graded",  submittedAt: "2026-02-11", grade: 15, feedback: "Adequate." },
  // a58 (15pts, Feb 13)
  { id: "sb313", assignmentId: "a58", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-13", grade: 14, feedback: "Good analysis." },
  { id: "sb314", assignmentId: "a58", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-13", grade: 12, feedback: "Good." },
  { id: "sb315", assignmentId: "a58", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-12", grade: 15, feedback: "Perfect!" },
  { id: "sb316", assignmentId: "a58", studentId: "s10", status: "Graded",  submittedAt: "2026-02-13", grade: 10, feedback: "Needs work." },
  { id: "sb317", assignmentId: "a58", studentId: "s11", status: "Graded",  submittedAt: "2026-02-13", grade: 13, feedback: "Well done." },
  { id: "sb318", assignmentId: "a58", studentId: "s12", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a59 (20pts, Feb 18)
  { id: "sb319", assignmentId: "a59", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-18", grade: 19, feedback: "Formulas correct!" },
  { id: "sb320", assignmentId: "a59", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-18", grade: 16, feedback: "Good." },
  { id: "sb321", assignmentId: "a59", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-17", grade: 20, feedback: "Perfect!" },
  { id: "sb322", assignmentId: "a59", studentId: "s10", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb323", assignmentId: "a59", studentId: "s11", status: "Graded",  submittedAt: "2026-02-18", grade: 18, feedback: "Strong work." },
  { id: "sb324", assignmentId: "a59", studentId: "s12", status: "Graded",  submittedAt: "2026-02-18", grade: 15, feedback: "Adequate." },
  // a60 (30pts, Feb 20)
  { id: "sb325", assignmentId: "a60", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-20", grade: 28, feedback: "Excellent quiz!" },
  { id: "sb326", assignmentId: "a60", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-20", grade: 25, feedback: "Good." },
  { id: "sb327", assignmentId: "a60", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-19", grade: 29, feedback: "Near perfect!" },
  { id: "sb328", assignmentId: "a60", studentId: "s10", status: "Graded",  submittedAt: "2026-02-20", grade: 20, feedback: "Review sigma." },
  { id: "sb329", assignmentId: "a60", studentId: "s11", status: "Graded",  submittedAt: "2026-02-20", grade: 27, feedback: "Very good!" },
  { id: "sb330", assignmentId: "a60", studentId: "s12", status: "Graded",  submittedAt: "2026-02-20", grade: 22, feedback: "Good effort." },
  // a61 (15pts, Feb 25)
  { id: "sb331", assignmentId: "a61", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-25", grade: 14, feedback: "Good base cases." },
  { id: "sb332", assignmentId: "a61", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-25", grade: 12, feedback: "Good." },
  { id: "sb333", assignmentId: "a61", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-24", grade: 15, feedback: "Excellent!" },
  { id: "sb334", assignmentId: "a61", studentId: "s10", status: "Graded",  submittedAt: "2026-02-25", grade: 10, feedback: "Review induction." },
  { id: "sb335", assignmentId: "a61", studentId: "s11", status: "Graded",  submittedAt: "2026-02-25", grade: 13, feedback: "Well done." },
  { id: "sb336", assignmentId: "a61", studentId: "s12", status: "Graded",  submittedAt: "2026-02-25", grade: 11, feedback: "Adequate." },
  // a62 (20pts, Feb 27)
  { id: "sb337", assignmentId: "a62", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-27", grade: 19, feedback: "Strong proofs!" },
  { id: "sb338", assignmentId: "a62", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-27", grade: 16, feedback: "Good structure." },
  { id: "sb339", assignmentId: "a62", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-26", grade: 20, feedback: "Perfect!" },
  { id: "sb340", assignmentId: "a62", studentId: "s10", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb341", assignmentId: "a62", studentId: "s11", status: "Graded",  submittedAt: "2026-02-27", grade: 18, feedback: "Very good." },
  { id: "sb342", assignmentId: "a62", studentId: "s12", status: "Graded",  submittedAt: "2026-02-27", grade: 15, feedback: "Adequate." },
  // a63 (30pts, Mar 4)
  { id: "sb343", assignmentId: "a63", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-04", grade: 28, feedback: "Comprehensive review!" },
  { id: "sb344", assignmentId: "a63", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-04", grade: 24, feedback: "Good effort." },
  { id: "sb345", assignmentId: "a63", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-03", grade: 29, feedback: "Excellent!" },
  { id: "sb346", assignmentId: "a63", studentId: "s10", status: "Graded",  submittedAt: "2026-03-04", grade: 20, feedback: "Review series sums." },
  { id: "sb347", assignmentId: "a63", studentId: "s11", status: "Graded",  submittedAt: "2026-03-04", grade: 27, feedback: "Strong." },
  { id: "sb348", assignmentId: "a63", studentId: "s12", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a64 (50pts, Mar 6)
  { id: "sb349", assignmentId: "a64", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-06", grade: 47, feedback: "Ready for exam!" },
  { id: "sb350", assignmentId: "a64", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-06", grade: 41, feedback: "Good practice." },
  { id: "sb351", assignmentId: "a64", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-05", grade: 49, feedback: "Outstanding!" },
  { id: "sb352", assignmentId: "a64", studentId: "s10", status: "Graded",  submittedAt: "2026-03-06", grade: 34, feedback: "Passing. Study more." },
  { id: "sb353", assignmentId: "a64", studentId: "s11", status: "Graded",  submittedAt: "2026-03-06", grade: 44, feedback: "Very good!" },
  { id: "sb354", assignmentId: "a64", studentId: "s12", status: "Graded",  submittedAt: "2026-03-06", grade: 37, feedback: "Good attempt." },
  // a65 (15pts, Mar 11)
  { id: "sb355", assignmentId: "a65", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-11", grade: 14, feedback: "Good exploration!" },
  { id: "sb356", assignmentId: "a65", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-11", grade: 12, feedback: "Good." },
  { id: "sb357", assignmentId: "a65", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-10", grade: 15, feedback: "Perfect!" },
  { id: "sb358", assignmentId: "a65", studentId: "s10", status: "Graded",  submittedAt: "2026-03-11", grade: 10, feedback: "Review Pascal's." },
  { id: "sb359", assignmentId: "a65", studentId: "s11", status: "Graded",  submittedAt: "2026-03-11", grade: 13, feedback: "Well done." },
  { id: "sb360", assignmentId: "a65", studentId: "s12", status: "Graded",  submittedAt: "2026-03-11", grade: 11, feedback: "Adequate." },
  // a66 (20pts, Mar 13)
  { id: "sb361", assignmentId: "a66", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-13", grade: 19, feedback: "Excellent matching!" },
  { id: "sb362", assignmentId: "a66", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-13", grade: 16, feedback: "Good work." },
  { id: "sb363", assignmentId: "a66", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-12", grade: 20, feedback: "Perfect!" },
  { id: "sb364", assignmentId: "a66", studentId: "s10", status: "Graded",  submittedAt: "2026-03-13", grade: 14, feedback: "Review C(n,r)." },
  { id: "sb365", assignmentId: "a66", studentId: "s11", status: "Graded",  submittedAt: "2026-03-13", grade: 18, feedback: "Strong." },
  { id: "sb366", assignmentId: "a66", studentId: "s12", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a67 (20pts, Mar 18)
  { id: "sb367", assignmentId: "a67", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-18", grade: 19, feedback: "All steps correct!" },
  { id: "sb368", assignmentId: "a67", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-18", grade: 16, feedback: "Good." },
  { id: "sb369", assignmentId: "a67", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-17", grade: 20, feedback: "Perfect!" },
  { id: "sb370", assignmentId: "a67", studentId: "s10", status: "Graded",  submittedAt: "2026-03-18", grade: 14, feedback: "Watch signs." },
  { id: "sb371", assignmentId: "a67", studentId: "s11", status: "Graded",  submittedAt: "2026-03-18", grade: 18, feedback: "Very good." },
  { id: "sb372", assignmentId: "a67", studentId: "s12", status: "Graded",  submittedAt: "2026-03-18", grade: 15, feedback: "Adequate." },
  // a68 (30pts, Mar 19)
  { id: "sb373", assignmentId: "a68", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-19", grade: 28, feedback: "Theorems mastered!" },
  { id: "sb374", assignmentId: "a68", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-19", grade: 25, feedback: "Good." },
  { id: "sb375", assignmentId: "a68", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-18", grade: 29, feedback: "Excellent!" },
  { id: "sb376", assignmentId: "a68", studentId: "s10", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb377", assignmentId: "a68", studentId: "s11", status: "Graded",  submittedAt: "2026-03-19", grade: 27, feedback: "Very good!" },
  { id: "sb378", assignmentId: "a68", studentId: "s12", status: "Late",    submittedAt: "2026-03-20", grade: 22, feedback: "Late." },
  // a69 (20pts, Mar 25)
  { id: "sb379", assignmentId: "a69", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-25", grade: 19, feedback: "Good factoring!" },
  { id: "sb380", assignmentId: "a69", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-25", grade: 16, feedback: "Good." },
  { id: "sb381", assignmentId: "a69", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-24", grade: 20, feedback: "Perfect!" },
  { id: "sb382", assignmentId: "a69", studentId: "s10", status: "Graded",  submittedAt: "2026-03-25", grade: 14, feedback: "Practice factors." },
  { id: "sb383", assignmentId: "a69", studentId: "s11", status: "Graded",  submittedAt: "2026-03-25", grade: 18, feedback: "Strong." },
  { id: "sb384", assignmentId: "a69", studentId: "s12", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a70 (15pts, Mar 26)
  { id: "sb385", assignmentId: "a70", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-26", grade: 14, feedback: "Rational roots correct!" },
  { id: "sb386", assignmentId: "a70", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-26", grade: 12, feedback: "Good." },
  { id: "sb387", assignmentId: "a70", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-25", grade: 15, feedback: "Perfect!" },
  { id: "sb388", assignmentId: "a70", studentId: "s10", status: "Graded",  submittedAt: "2026-03-26", grade: 10, feedback: "Review theorem." },
  { id: "sb389", assignmentId: "a70", studentId: "s11", status: "Graded",  submittedAt: "2026-03-26", grade: 13, feedback: "Well done." },
  { id: "sb390", assignmentId: "a70", studentId: "s12", status: "Graded",  submittedAt: "2026-03-26", grade: 11, feedback: "Adequate." },
  // a71 (15pts, Apr 3)
  { id: "sb391", assignmentId: "a71", studentId: "s7",  status: "Graded",  submittedAt: "2026-04-03", grade: 14, feedback: "Great review!" },
  { id: "sb392", assignmentId: "a71", studentId: "s8",  status: "Graded",  submittedAt: "2026-04-03", grade: 12, feedback: "Good." },
  { id: "sb393", assignmentId: "a71", studentId: "s9",  status: "Graded",  submittedAt: "2026-04-02", grade: 15, feedback: "Excellent!" },
  { id: "sb394", assignmentId: "a71", studentId: "s10", status: "Graded",  submittedAt: "2026-04-03", grade: 10, feedback: "Review needed." },
  { id: "sb395", assignmentId: "a71", studentId: "s11", status: "Graded",  submittedAt: "2026-04-03", grade: 13, feedback: "Well done." },
  { id: "sb396", assignmentId: "a71", studentId: "s12", status: "Late",    submittedAt: "2026-04-04", grade: 11, feedback: "Late." },

  // ── Algebra I (c3) new weekly assignments ─────────────────────────────────
  // a72 (15pts, Feb 4)
  { id: "sb397", assignmentId: "a72", studentId: "s13", status: "Graded",  submittedAt: "2026-02-04", grade: 14, feedback: "Great!" },
  { id: "sb398", assignmentId: "a72", studentId: "s14", status: "Graded",  submittedAt: "2026-02-04", grade: 12, feedback: "Good." },
  { id: "sb399", assignmentId: "a72", studentId: "s15", status: "Graded",  submittedAt: "2026-02-04", grade: 13, feedback: "Well done." },
  { id: "sb400", assignmentId: "a72", studentId: "s16", status: "Graded",  submittedAt: "2026-02-04", grade: 10, feedback: "Review integers." },
  { id: "sb401", assignmentId: "a72", studentId: "s17", status: "Graded",  submittedAt: "2026-02-04", grade: 14, feedback: "Excellent!" },
  { id: "sb402", assignmentId: "a72", studentId: "s18", status: "Graded",  submittedAt: "2026-02-04", grade: 9,  feedback: "Needs practice." },
  // a73 (20pts, Feb 6)
  { id: "sb403", assignmentId: "a73", studentId: "s13", status: "Graded",  submittedAt: "2026-02-06", grade: 19, feedback: "Excellent!" },
  { id: "sb404", assignmentId: "a73", studentId: "s14", status: "Graded",  submittedAt: "2026-02-06", grade: 15, feedback: "Good." },
  { id: "sb405", assignmentId: "a73", studentId: "s15", status: "Graded",  submittedAt: "2026-02-06", grade: 17, feedback: "Well done." },
  { id: "sb406", assignmentId: "a73", studentId: "s16", status: "Graded",  submittedAt: "2026-02-06", grade: 13, feedback: "Adequate." },
  { id: "sb407", assignmentId: "a73", studentId: "s17", status: "Graded",  submittedAt: "2026-02-05", grade: 18, feedback: "Very good!" },
  { id: "sb408", assignmentId: "a73", studentId: "s18", status: "Graded",  submittedAt: "2026-02-06", grade: 12, feedback: "Keep practicing." },
  // a74 (20pts, Feb 11)
  { id: "sb409", assignmentId: "a74", studentId: "s13", status: "Graded",  submittedAt: "2026-02-11", grade: 19, feedback: "All correct!" },
  { id: "sb410", assignmentId: "a74", studentId: "s14", status: "Graded",  submittedAt: "2026-02-11", grade: 15, feedback: "Good." },
  { id: "sb411", assignmentId: "a74", studentId: "s15", status: "Graded",  submittedAt: "2026-02-11", grade: 17, feedback: "Strong work." },
  { id: "sb412", assignmentId: "a74", studentId: "s16", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb413", assignmentId: "a74", studentId: "s17", status: "Graded",  submittedAt: "2026-02-10", grade: 18, feedback: "Excellent!" },
  { id: "sb414", assignmentId: "a74", studentId: "s18", status: "Graded",  submittedAt: "2026-02-11", grade: 12, feedback: "Needs review." },
  // a75 (25pts, Feb 12)
  { id: "sb415", assignmentId: "a75", studentId: "s13", status: "Graded",  submittedAt: "2026-02-12", grade: 24, feedback: "Near perfect!" },
  { id: "sb416", assignmentId: "a75", studentId: "s14", status: "Graded",  submittedAt: "2026-02-12", grade: 19, feedback: "Good." },
  { id: "sb417", assignmentId: "a75", studentId: "s15", status: "Graded",  submittedAt: "2026-02-12", grade: 22, feedback: "Well done." },
  { id: "sb418", assignmentId: "a75", studentId: "s16", status: "Graded",  submittedAt: "2026-02-12", grade: 17, feedback: "Adequate." },
  { id: "sb419", assignmentId: "a75", studentId: "s17", status: "Graded",  submittedAt: "2026-02-11", grade: 23, feedback: "Very good!" },
  { id: "sb420", assignmentId: "a75", studentId: "s18", status: "Late",    submittedAt: "2026-02-13", grade: 15, feedback: "Late." },
  // a76 (15pts, Feb 18)
  { id: "sb421", assignmentId: "a76", studentId: "s13", status: "Graded",  submittedAt: "2026-02-18", grade: 14, feedback: "Great writing!" },
  { id: "sb422", assignmentId: "a76", studentId: "s14", status: "Graded",  submittedAt: "2026-02-18", grade: 12, feedback: "Good." },
  { id: "sb423", assignmentId: "a76", studentId: "s15", status: "Graded",  submittedAt: "2026-02-18", grade: 13, feedback: "Well done." },
  { id: "sb424", assignmentId: "a76", studentId: "s16", status: "Graded",  submittedAt: "2026-02-18", grade: 10, feedback: "Review phrasing." },
  { id: "sb425", assignmentId: "a76", studentId: "s17", status: "Graded",  submittedAt: "2026-02-17", grade: 14, feedback: "Excellent!" },
  { id: "sb426", assignmentId: "a76", studentId: "s18", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a77 (20pts, Feb 19)
  { id: "sb427", assignmentId: "a77", studentId: "s13", status: "Graded",  submittedAt: "2026-02-19", grade: 19, feedback: "All translations correct!" },
  { id: "sb428", assignmentId: "a77", studentId: "s14", status: "Graded",  submittedAt: "2026-02-19", grade: 15, feedback: "Good work." },
  { id: "sb429", assignmentId: "a77", studentId: "s15", status: "Graded",  submittedAt: "2026-02-19", grade: 17, feedback: "Strong." },
  { id: "sb430", assignmentId: "a77", studentId: "s16", status: "Graded",  submittedAt: "2026-02-19", grade: 13, feedback: "Watch keywords." },
  { id: "sb431", assignmentId: "a77", studentId: "s17", status: "Graded",  submittedAt: "2026-02-18", grade: 18, feedback: "Very good!" },
  { id: "sb432", assignmentId: "a77", studentId: "s18", status: "Graded",  submittedAt: "2026-02-19", grade: 12, feedback: "Adequate." },
  // a78 (15pts, Feb 25)
  { id: "sb433", assignmentId: "a78", studentId: "s13", status: "Graded",  submittedAt: "2026-02-25", grade: 14, feedback: "All solved!" },
  { id: "sb434", assignmentId: "a78", studentId: "s14", status: "Graded",  submittedAt: "2026-02-25", grade: 12, feedback: "Good." },
  { id: "sb435", assignmentId: "a78", studentId: "s15", status: "Graded",  submittedAt: "2026-02-25", grade: 13, feedback: "Well done." },
  { id: "sb436", assignmentId: "a78", studentId: "s16", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb437", assignmentId: "a78", studentId: "s17", status: "Graded",  submittedAt: "2026-02-24", grade: 14, feedback: "Excellent!" },
  { id: "sb438", assignmentId: "a78", studentId: "s18", status: "Graded",  submittedAt: "2026-02-25", grade: 9,  feedback: "Needs more practice." },
  // a79 (25pts, Feb 27)
  { id: "sb439", assignmentId: "a79", studentId: "s13", status: "Graded",  submittedAt: "2026-02-27", grade: 24, feedback: "Near perfect check!" },
  { id: "sb440", assignmentId: "a79", studentId: "s14", status: "Graded",  submittedAt: "2026-02-27", grade: 19, feedback: "Good." },
  { id: "sb441", assignmentId: "a79", studentId: "s15", status: "Graded",  submittedAt: "2026-02-27", grade: 22, feedback: "Strong." },
  { id: "sb442", assignmentId: "a79", studentId: "s16", status: "Graded",  submittedAt: "2026-02-27", grade: 17, feedback: "Watch balance." },
  { id: "sb443", assignmentId: "a79", studentId: "s17", status: "Graded",  submittedAt: "2026-02-26", grade: 23, feedback: "Very good!" },
  { id: "sb444", assignmentId: "a79", studentId: "s18", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a80 (25pts, Mar 4)
  { id: "sb445", assignmentId: "a80", studentId: "s13", status: "Graded",  submittedAt: "2026-03-04", grade: 24, feedback: "Complete review!" },
  { id: "sb446", assignmentId: "a80", studentId: "s14", status: "Graded",  submittedAt: "2026-03-04", grade: 19, feedback: "Good preparation." },
  { id: "sb447", assignmentId: "a80", studentId: "s15", status: "Graded",  submittedAt: "2026-03-04", grade: 22, feedback: "Strong." },
  { id: "sb448", assignmentId: "a80", studentId: "s16", status: "Graded",  submittedAt: "2026-03-04", grade: 17, feedback: "Keep studying." },
  { id: "sb449", assignmentId: "a80", studentId: "s17", status: "Graded",  submittedAt: "2026-03-03", grade: 23, feedback: "Very good!" },
  { id: "sb450", assignmentId: "a80", studentId: "s18", status: "Graded",  submittedAt: "2026-03-04", grade: 15, feedback: "Needs more review." },
  // a81 (50pts, Mar 6)
  { id: "sb451", assignmentId: "a81", studentId: "s13", status: "Graded",  submittedAt: "2026-03-06", grade: 47, feedback: "Exam-ready!" },
  { id: "sb452", assignmentId: "a81", studentId: "s14", status: "Graded",  submittedAt: "2026-03-06", grade: 38, feedback: "Good practice." },
  { id: "sb453", assignmentId: "a81", studentId: "s15", status: "Graded",  submittedAt: "2026-03-06", grade: 44, feedback: "Strong run." },
  { id: "sb454", assignmentId: "a81", studentId: "s16", status: "Graded",  submittedAt: "2026-03-06", grade: 33, feedback: "Review equations." },
  { id: "sb455", assignmentId: "a81", studentId: "s17", status: "Graded",  submittedAt: "2026-03-05", grade: 46, feedback: "Excellent!" },
  { id: "sb456", assignmentId: "a81", studentId: "s18", status: "Graded",  submittedAt: "2026-03-06", grade: 29, feedback: "Extra prep needed." },
  // a82 (15pts, Mar 11)
  { id: "sb457", assignmentId: "a82", studentId: "s13", status: "Graded",  submittedAt: "2026-03-11", grade: 14, feedback: "All terms combined!" },
  { id: "sb458", assignmentId: "a82", studentId: "s14", status: "Graded",  submittedAt: "2026-03-11", grade: 12, feedback: "Good." },
  { id: "sb459", assignmentId: "a82", studentId: "s15", status: "Graded",  submittedAt: "2026-03-11", grade: 13, feedback: "Well done." },
  { id: "sb460", assignmentId: "a82", studentId: "s16", status: "Graded",  submittedAt: "2026-03-11", grade: 10, feedback: "Review like terms." },
  { id: "sb461", assignmentId: "a82", studentId: "s17", status: "Graded",  submittedAt: "2026-03-10", grade: 14, feedback: "Excellent!" },
  { id: "sb462", assignmentId: "a82", studentId: "s18", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a83 (20pts, Mar 12)
  { id: "sb463", assignmentId: "a83", studentId: "s13", status: "Graded",  submittedAt: "2026-03-12", grade: 19, feedback: "Distribution correct!" },
  { id: "sb464", assignmentId: "a83", studentId: "s14", status: "Graded",  submittedAt: "2026-03-12", grade: 15, feedback: "Good." },
  { id: "sb465", assignmentId: "a83", studentId: "s15", status: "Graded",  submittedAt: "2026-03-12", grade: 17, feedback: "Strong." },
  { id: "sb466", assignmentId: "a83", studentId: "s16", status: "Graded",  submittedAt: "2026-03-12", grade: 13, feedback: "Adequate." },
  { id: "sb467", assignmentId: "a83", studentId: "s17", status: "Graded",  submittedAt: "2026-03-11", grade: 18, feedback: "Very good!" },
  { id: "sb468", assignmentId: "a83", studentId: "s18", status: "Graded",  submittedAt: "2026-03-12", grade: 12, feedback: "Keep practicing." },
  // a84 (20pts, Mar 18)
  { id: "sb469", assignmentId: "a84", studentId: "s13", status: "Graded",  submittedAt: "2026-03-18", grade: 19, feedback: "Graphs accurate!" },
  { id: "sb470", assignmentId: "a84", studentId: "s14", status: "Graded",  submittedAt: "2026-03-18", grade: 15, feedback: "Good." },
  { id: "sb471", assignmentId: "a84", studentId: "s15", status: "Graded",  submittedAt: "2026-03-18", grade: 17, feedback: "Well done." },
  { id: "sb472", assignmentId: "a84", studentId: "s16", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb473", assignmentId: "a84", studentId: "s17", status: "Graded",  submittedAt: "2026-03-17", grade: 18, feedback: "Very good!" },
  { id: "sb474", assignmentId: "a84", studentId: "s18", status: "Graded",  submittedAt: "2026-03-18", grade: 12, feedback: "Review open/closed." },
  // a85 (15pts, Mar 19)
  { id: "sb475", assignmentId: "a85", studentId: "s13", status: "Graded",  submittedAt: "2026-03-19", grade: 14, feedback: "Good intro work!" },
  { id: "sb476", assignmentId: "a85", studentId: "s14", status: "Graded",  submittedAt: "2026-03-19", grade: 12, feedback: "Good." },
  { id: "sb477", assignmentId: "a85", studentId: "s15", status: "Graded",  submittedAt: "2026-03-19", grade: 13, feedback: "Well done." },
  { id: "sb478", assignmentId: "a85", studentId: "s16", status: "Graded",  submittedAt: "2026-03-19", grade: 10, feedback: "Review AND/OR." },
  { id: "sb479", assignmentId: "a85", studentId: "s17", status: "Graded",  submittedAt: "2026-03-18", grade: 14, feedback: "Excellent!" },
  { id: "sb480", assignmentId: "a85", studentId: "s18", status: "Graded",  submittedAt: "2026-03-19", grade: 9,  feedback: "Needs more work." },
  // a86 (15pts, Mar 25)
  { id: "sb481", assignmentId: "a86", studentId: "s13", status: "Graded",  submittedAt: "2026-03-25", grade: 14, feedback: "Both sides handled!" },
  { id: "sb482", assignmentId: "a86", studentId: "s14", status: "Graded",  submittedAt: "2026-03-25", grade: 12, feedback: "Good." },
  { id: "sb483", assignmentId: "a86", studentId: "s15", status: "Graded",  submittedAt: "2026-03-25", grade: 13, feedback: "Well done." },
  { id: "sb484", assignmentId: "a86", studentId: "s16", status: "Graded",  submittedAt: "2026-03-25", grade: 10, feedback: "Review process." },
  { id: "sb485", assignmentId: "a86", studentId: "s17", status: "Graded",  submittedAt: "2026-03-24", grade: 14, feedback: "Excellent!" },
  { id: "sb486", assignmentId: "a86", studentId: "s18", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  // a87 (20pts, Mar 26)
  { id: "sb487", assignmentId: "a87", studentId: "s13", status: "Graded",  submittedAt: "2026-03-26", grade: 19, feedback: "Word problems solved!" },
  { id: "sb488", assignmentId: "a87", studentId: "s14", status: "Graded",  submittedAt: "2026-03-26", grade: 15, feedback: "Good." },
  { id: "sb489", assignmentId: "a87", studentId: "s15", status: "Graded",  submittedAt: "2026-03-26", grade: 17, feedback: "Strong work." },
  { id: "sb490", assignmentId: "a87", studentId: "s16", status: "Graded",  submittedAt: "2026-03-26", grade: 13, feedback: "Watch setup." },
  { id: "sb491", assignmentId: "a87", studentId: "s17", status: "Graded",  submittedAt: "2026-03-25", grade: 18, feedback: "Very good!" },
  { id: "sb492", assignmentId: "a87", studentId: "s18", status: "Graded",  submittedAt: "2026-03-26", grade: 12, feedback: "Adequate." },
  // a88 (15pts, Apr 2)
  { id: "sb493", assignmentId: "a88", studentId: "s13", status: "Graded",  submittedAt: "2026-04-02", grade: 14, feedback: "Well-reviewed!" },
  { id: "sb494", assignmentId: "a88", studentId: "s14", status: "Graded",  submittedAt: "2026-04-02", grade: 12, feedback: "Good." },
  { id: "sb495", assignmentId: "a88", studentId: "s15", status: "Graded",  submittedAt: "2026-04-02", grade: 13, feedback: "Well done." },
  { id: "sb496", assignmentId: "a88", studentId: "s16", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb497", assignmentId: "a88", studentId: "s17", status: "Graded",  submittedAt: "2026-04-01", grade: 14, feedback: "Excellent!" },
  { id: "sb498", assignmentId: "a88", studentId: "s18", status: "Graded",  submittedAt: "2026-04-02", grade: 9,  feedback: "Needs review." },

  // ── Math 9 (c1) — a12 Variable Expressions Review (20 pts, Feb 7) ─────────
  { id: "sb49",  assignmentId: "a12", studentId: "s1", status: "Graded",  submittedAt: "2026-02-06", grade: 19, feedback: "Excellent precision." },
  { id: "sb50",  assignmentId: "a12", studentId: "s2", status: "Graded",  submittedAt: "2026-02-06", grade: 17, feedback: "Good work, minor error on #4." },
  { id: "sb51",  assignmentId: "a12", studentId: "s3", status: "Graded",  submittedAt: "2026-02-07", grade: 15, feedback: "Review substitution carefully." },
  { id: "sb52",  assignmentId: "a12", studentId: "s4", status: "Graded",  submittedAt: "2026-02-07", grade: 13, feedback: "Several errors. Practice more." },
  { id: "sb53",  assignmentId: "a12", studentId: "s5", status: "Graded",  submittedAt: "2026-02-06", grade: 18, feedback: "Very good!" },
  { id: "sb54",  assignmentId: "a12", studentId: "s6", status: "Graded",  submittedAt: "2026-02-08", grade: 11, feedback: "Late submission. Review basics." },

  // ── a13 Factoring Trinomials Quiz (50 pts, Feb 14) ────────────────────────
  { id: "sb55",  assignmentId: "a13", studentId: "s1", status: "Graded",  submittedAt: "2026-02-13", grade: 48, feedback: "Outstanding!" },
  { id: "sb56",  assignmentId: "a13", studentId: "s2", status: "Graded",  submittedAt: "2026-02-13", grade: 43, feedback: "Good, check AC method on #7." },
  { id: "sb57",  assignmentId: "a13", studentId: "s3", status: "Graded",  submittedAt: "2026-02-14", grade: 38, feedback: "Practice grouping method." },
  { id: "sb58",  assignmentId: "a13", studentId: "s4", status: "Late",    submittedAt: "2026-02-15", grade: 35, feedback: "Late. Review factoring steps." },
  { id: "sb59",  assignmentId: "a13", studentId: "s5", status: "Graded",  submittedAt: "2026-02-13", grade: 46, feedback: "Excellent!" },
  { id: "sb60",  assignmentId: "a13", studentId: "s6", status: "Missing", submittedAt: null,          grade: null, feedback: null },

  // ── a14 Completing the Square (30 pts, Feb 21) ────────────────────────────
  { id: "sb61",  assignmentId: "a14", studentId: "s1", status: "Graded",  submittedAt: "2026-02-20", grade: 29, feedback: "Perfect process shown." },
  { id: "sb62",  assignmentId: "a14", studentId: "s2", status: "Graded",  submittedAt: "2026-02-20", grade: 25, feedback: "Good. Missed constant on #9." },
  { id: "sb63",  assignmentId: "a14", studentId: "s3", status: "Graded",  submittedAt: "2026-02-21", grade: 22, feedback: "Review completing the square." },
  { id: "sb64",  assignmentId: "a14", studentId: "s4", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb65",  assignmentId: "a14", studentId: "s5", status: "Graded",  submittedAt: "2026-02-20", grade: 28, feedback: "Well done!" },
  { id: "sb66",  assignmentId: "a14", studentId: "s6", status: "Late",    submittedAt: "2026-02-23", grade: 17, feedback: "Late. Several steps incorrect." },

  // ── a15 Quadratic Formula Practice (25 pts, Mar 1) ────────────────────────
  { id: "sb67",  assignmentId: "a15", studentId: "s1", status: "Graded",  submittedAt: "2026-02-28", grade: 24, feedback: "Great application of the formula!" },
  { id: "sb68",  assignmentId: "a15", studentId: "s2", status: "Graded",  submittedAt: "2026-02-28", grade: 21, feedback: "Good, watch discriminant signs." },
  { id: "sb69",  assignmentId: "a15", studentId: "s3", status: "Graded",  submittedAt: "2026-03-01", grade: 19, feedback: "Adequate. Practice more." },
  { id: "sb70",  assignmentId: "a15", studentId: "s4", status: "Graded",  submittedAt: "2026-03-01", grade: 17, feedback: "Several computation errors." },
  { id: "sb71",  assignmentId: "a15", studentId: "s5", status: "Graded",  submittedAt: "2026-02-28", grade: 23, feedback: "Very good work!" },
  { id: "sb72",  assignmentId: "a15", studentId: "s6", status: "Late",    submittedAt: "2026-03-03", grade: 14, feedback: "Late. Needs significant review." },

  // ── a16 Q1 Chapter Exam (100 pts, Mar 7) ─────────────────────────────────
  { id: "sb73",  assignmentId: "a16", studentId: "s1", status: "Graded",  submittedAt: "2026-03-07", grade: 95, feedback: "Excellent exam performance!" },
  { id: "sb74",  assignmentId: "a16", studentId: "s2", status: "Graded",  submittedAt: "2026-03-07", grade: 85, feedback: "Good. Review rational expressions." },
  { id: "sb75",  assignmentId: "a16", studentId: "s3", status: "Graded",  submittedAt: "2026-03-07", grade: 76, feedback: "Passing. Extra practice recommended." },
  { id: "sb76",  assignmentId: "a16", studentId: "s4", status: "Late",    submittedAt: "2026-03-08", grade: 70, feedback: "Late submission. Study factoring." },
  { id: "sb77",  assignmentId: "a16", studentId: "s5", status: "Graded",  submittedAt: "2026-03-07", grade: 92, feedback: "Outstanding!" },
  { id: "sb78",  assignmentId: "a16", studentId: "s6", status: "Graded",  submittedAt: "2026-03-07", grade: 63, feedback: "Below average. Needs tutoring." },

  // ── a17 Graphing Parabolas Project (75 pts, Mar 14) ───────────────────────
  { id: "sb79",  assignmentId: "a17", studentId: "s1", status: "Graded",  submittedAt: "2026-03-13", grade: 72, feedback: "Creative and well-executed." },
  { id: "sb80",  assignmentId: "a17", studentId: "s2", status: "Graded",  submittedAt: "2026-03-13", grade: 63, feedback: "Good effort, needs more examples." },
  { id: "sb81",  assignmentId: "a17", studentId: "s3", status: "Graded",  submittedAt: "2026-03-14", grade: 58, feedback: "Adequate work, refine labeling." },
  { id: "sb82",  assignmentId: "a17", studentId: "s4", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb83",  assignmentId: "a17", studentId: "s5", status: "Graded",  submittedAt: "2026-03-13", grade: 70, feedback: "Well-done visual presentation!" },
  { id: "sb84",  assignmentId: "a17", studentId: "s6", status: "Late",    submittedAt: "2026-03-16", grade: 50, feedback: "Late. Minimal effort shown." },

  // ── a18 Radical Expressions Quiz (40 pts, Mar 21) ─────────────────────────
  { id: "sb85",  assignmentId: "a18", studentId: "s1", status: "Graded",  submittedAt: "2026-03-20", grade: 38, feedback: "Near perfect!" },
  { id: "sb86",  assignmentId: "a18", studentId: "s2", status: "Graded",  submittedAt: "2026-03-21", grade: 34, feedback: "Good. Watch rationalization steps." },
  { id: "sb87",  assignmentId: "a18", studentId: "s3", status: "Graded",  submittedAt: "2026-03-21", grade: 30, feedback: "Passing. Review index notation." },
  { id: "sb88",  assignmentId: "a18", studentId: "s4", status: "Late",    submittedAt: "2026-03-22", grade: 27, feedback: "Late. Practice simplification." },
  { id: "sb89",  assignmentId: "a18", studentId: "s5", status: "Graded",  submittedAt: "2026-03-20", grade: 37, feedback: "Excellent!" },
  { id: "sb90",  assignmentId: "a18", studentId: "s6", status: "Missing", submittedAt: null,          grade: null, feedback: null },

  // ── a19 Exponent Laws Worksheet (25 pts, Mar 28) ─────────────────────────
  { id: "sb91",  assignmentId: "a19", studentId: "s1", status: "Graded",  submittedAt: "2026-03-27", grade: 24, feedback: "All laws applied correctly." },
  { id: "sb92",  assignmentId: "a19", studentId: "s2", status: "Graded",  submittedAt: "2026-03-27", grade: 21, feedback: "Good. Minor slip on negative exponents." },
  { id: "sb93",  assignmentId: "a19", studentId: "s3", status: "Graded",  submittedAt: "2026-03-28", grade: 19, feedback: "Adequate work." },
  { id: "sb94",  assignmentId: "a19", studentId: "s4", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb95",  assignmentId: "a19", studentId: "s5", status: "Graded",  submittedAt: "2026-03-27", grade: 23, feedback: "Strong understanding!" },
  { id: "sb96",  assignmentId: "a19", studentId: "s6", status: "Late",    submittedAt: "2026-03-30", grade: 14, feedback: "Late. Several errors." },

  // ── Math 10 (c2) — a22 Sequences & Series Worksheet (30 pts, Feb 8) ───────
  { id: "sb97",  assignmentId: "a22", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-07", grade: 29, feedback: "Excellent sequencing." },
  { id: "sb98",  assignmentId: "a22", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-07", grade: 24, feedback: "Good work overall." },
  { id: "sb99",  assignmentId: "a22", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-07", grade: 30, feedback: "Perfect score!" },
  { id: "sb100", assignmentId: "a22", studentId: "s10", status: "Graded",  submittedAt: "2026-02-08", grade: 20, feedback: "Review nth-term formulas." },
  { id: "sb101", assignmentId: "a22", studentId: "s11", status: "Graded",  submittedAt: "2026-02-07", grade: 27, feedback: "Solid work!" },
  { id: "sb102", assignmentId: "a22", studentId: "s12", status: "Late",    submittedAt: "2026-02-09", grade: 22, feedback: "Late. Good attempt." },

  // ── a23 Geometric Sequences Quiz (50 pts, Feb 15) ─────────────────────────
  { id: "sb103", assignmentId: "a23", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-14", grade: 47, feedback: "Near-perfect quiz!" },
  { id: "sb104", assignmentId: "a23", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-14", grade: 41, feedback: "Good. Review infinite series." },
  { id: "sb105", assignmentId: "a23", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-14", grade: 49, feedback: "Outstanding!" },
  { id: "sb106", assignmentId: "a23", studentId: "s10", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb107", assignmentId: "a23", studentId: "s11", status: "Graded",  submittedAt: "2026-02-14", grade: 44, feedback: "Strong understanding." },
  { id: "sb108", assignmentId: "a23", studentId: "s12", status: "Graded",  submittedAt: "2026-02-15", grade: 37, feedback: "Adequate. Practice ratio problems." },

  // ── a24 Sigma Notation Practice (25 pts, Feb 22) ──────────────────────────
  { id: "sb109", assignmentId: "a24", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-21", grade: 24, feedback: "Excellent notation usage." },
  { id: "sb110", assignmentId: "a24", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-21", grade: 20, feedback: "Good, small index error." },
  { id: "sb111", assignmentId: "a24", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-21", grade: 25, feedback: "Perfect!" },
  { id: "sb112", assignmentId: "a24", studentId: "s10", status: "Graded",  submittedAt: "2026-02-22", grade: 17, feedback: "Review summation rules." },
  { id: "sb113", assignmentId: "a24", studentId: "s11", status: "Graded",  submittedAt: "2026-02-21", grade: 22, feedback: "Good work!" },
  { id: "sb114", assignmentId: "a24", studentId: "s12", status: "Graded",  submittedAt: "2026-02-22", grade: 18, feedback: "Adequate effort." },

  // ── a25 Mathematical Induction Project (80 pts, Mar 1) ────────────────────
  { id: "sb115", assignmentId: "a25", studentId: "s7",  status: "Graded",  submittedAt: "2026-02-28", grade: 76, feedback: "All three proofs solid." },
  { id: "sb116", assignmentId: "a25", studentId: "s8",  status: "Graded",  submittedAt: "2026-02-28", grade: 64, feedback: "Good. Inductive step needs clarity." },
  { id: "sb117", assignmentId: "a25", studentId: "s9",  status: "Graded",  submittedAt: "2026-02-28", grade: 79, feedback: "Near-perfect proofs!" },
  { id: "sb118", assignmentId: "a25", studentId: "s10", status: "Graded",  submittedAt: "2026-03-01", grade: 55, feedback: "Proofs incomplete. Review structure." },
  { id: "sb119", assignmentId: "a25", studentId: "s11", status: "Graded",  submittedAt: "2026-02-28", grade: 71, feedback: "Good logical structure." },
  { id: "sb120", assignmentId: "a25", studentId: "s12", status: "Missing", submittedAt: null,          grade: null, feedback: null },

  // ── a26 Q1 Algebra Exam (100 pts, Mar 7) ─────────────────────────────────
  { id: "sb121", assignmentId: "a26", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-07", grade: 93, feedback: "Excellent exam!" },
  { id: "sb122", assignmentId: "a26", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-07", grade: 82, feedback: "Good. Review sigma notation." },
  { id: "sb123", assignmentId: "a26", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-07", grade: 97, feedback: "Near-perfect!" },
  { id: "sb124", assignmentId: "a26", studentId: "s10", status: "Graded",  submittedAt: "2026-03-07", grade: 68, feedback: "Passing. Extra help recommended." },
  { id: "sb125", assignmentId: "a26", studentId: "s11", status: "Graded",  submittedAt: "2026-03-07", grade: 88, feedback: "Strong performance." },
  { id: "sb126", assignmentId: "a26", studentId: "s12", status: "Late",    submittedAt: "2026-03-09", grade: 74, feedback: "Late submission." },

  // ── a27 Binomial Theorem Worksheet (30 pts, Mar 14) ───────────────────────
  { id: "sb127", assignmentId: "a27", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-13", grade: 29, feedback: "Excellent expansion work." },
  { id: "sb128", assignmentId: "a27", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-13", grade: 24, feedback: "Good. Pascal's triangle correct." },
  { id: "sb129", assignmentId: "a27", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-13", grade: 30, feedback: "Perfect!" },
  { id: "sb130", assignmentId: "a27", studentId: "s10", status: "Graded",  submittedAt: "2026-03-14", grade: 20, feedback: "Some errors in binomial coefficients." },
  { id: "sb131", assignmentId: "a27", studentId: "s11", status: "Graded",  submittedAt: "2026-03-13", grade: 26, feedback: "Solid work." },
  { id: "sb132", assignmentId: "a27", studentId: "s12", status: "Missing", submittedAt: null,          grade: null, feedback: null },

  // ── a28 Polynomial Division Quiz (40 pts, Mar 21) ─────────────────────────
  { id: "sb133", assignmentId: "a28", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-20", grade: 38, feedback: "Both methods mastered." },
  { id: "sb134", assignmentId: "a28", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-20", grade: 32, feedback: "Good. Double-check remainders." },
  { id: "sb135", assignmentId: "a28", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-20", grade: 40, feedback: "Perfect quiz!" },
  { id: "sb136", assignmentId: "a28", studentId: "s10", status: "Graded",  submittedAt: "2026-03-21", grade: 27, feedback: "Struggling with long division." },
  { id: "sb137", assignmentId: "a28", studentId: "s11", status: "Graded",  submittedAt: "2026-03-20", grade: 35, feedback: "Strong performance." },
  { id: "sb138", assignmentId: "a28", studentId: "s12", status: "Late",    submittedAt: "2026-03-23", grade: 29, feedback: "Late. Adequate effort." },

  // ── a29 Factoring & Roots Worksheet (35 pts, Mar 28) ─────────────────────
  { id: "sb139", assignmentId: "a29", studentId: "s7",  status: "Graded",  submittedAt: "2026-03-27", grade: 33, feedback: "All roots correctly found." },
  { id: "sb140", assignmentId: "a29", studentId: "s8",  status: "Graded",  submittedAt: "2026-03-27", grade: 28, feedback: "Good. Review rational roots theorem." },
  { id: "sb141", assignmentId: "a29", studentId: "s9",  status: "Graded",  submittedAt: "2026-03-27", grade: 35, feedback: "Perfect score!" },
  { id: "sb142", assignmentId: "a29", studentId: "s10", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb143", assignmentId: "a29", studentId: "s11", status: "Graded",  submittedAt: "2026-03-27", grade: 31, feedback: "Good work!" },
  { id: "sb144", assignmentId: "a29", studentId: "s12", status: "Graded",  submittedAt: "2026-03-28", grade: 25, feedback: "Adequate. More practice needed." },

  // ── Algebra I (c3) — a30 Real Number Properties (20 pts, Feb 7) ──────────
  { id: "sb145", assignmentId: "a30", studentId: "s13", status: "Graded",  submittedAt: "2026-02-06", grade: 19, feedback: "All properties correctly applied." },
  { id: "sb146", assignmentId: "a30", studentId: "s14", status: "Graded",  submittedAt: "2026-02-06", grade: 15, feedback: "Good. Review distributive property." },
  { id: "sb147", assignmentId: "a30", studentId: "s15", status: "Graded",  submittedAt: "2026-02-06", grade: 17, feedback: "Solid work!" },
  { id: "sb148", assignmentId: "a30", studentId: "s16", status: "Graded",  submittedAt: "2026-02-07", grade: 13, feedback: "Adequate. Practice properties." },
  { id: "sb149", assignmentId: "a30", studentId: "s17", status: "Graded",  submittedAt: "2026-02-06", grade: 18, feedback: "Excellent!" },
  { id: "sb150", assignmentId: "a30", studentId: "s18", status: "Graded",  submittedAt: "2026-02-07", grade: 11, feedback: "Review associative property." },

  // ── a31 Order of Operations Quiz (50 pts, Feb 14) ─────────────────────────
  { id: "sb151", assignmentId: "a31", studentId: "s13", status: "Graded",  submittedAt: "2026-02-13", grade: 47, feedback: "Near-perfect quiz!" },
  { id: "sb152", assignmentId: "a31", studentId: "s14", status: "Graded",  submittedAt: "2026-02-13", grade: 39, feedback: "Good. Watch exponent order." },
  { id: "sb153", assignmentId: "a31", studentId: "s15", status: "Graded",  submittedAt: "2026-02-13", grade: 43, feedback: "Strong work!" },
  { id: "sb154", assignmentId: "a31", studentId: "s16", status: "Late",    submittedAt: "2026-02-15", grade: 33, feedback: "Late. Review PEMDAS." },
  { id: "sb155", assignmentId: "a31", studentId: "s17", status: "Graded",  submittedAt: "2026-02-13", grade: 45, feedback: "Excellent performance." },
  { id: "sb156", assignmentId: "a31", studentId: "s18", status: "Graded",  submittedAt: "2026-02-14", grade: 29, feedback: "Passing. Needs more practice." },

  // ── a32 Variables & Expressions Project (60 pts, Feb 21) ─────────────────
  { id: "sb157", assignmentId: "a32", studentId: "s13", status: "Graded",  submittedAt: "2026-02-20", grade: 57, feedback: "Creative and mathematically sound." },
  { id: "sb158", assignmentId: "a32", studentId: "s14", status: "Graded",  submittedAt: "2026-02-20", grade: 46, feedback: "Good effort. Needs clearer variables." },
  { id: "sb159", assignmentId: "a32", studentId: "s15", status: "Graded",  submittedAt: "2026-02-20", grade: 51, feedback: "Well-presented project." },
  { id: "sb160", assignmentId: "a32", studentId: "s16", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb161", assignmentId: "a32", studentId: "s17", status: "Graded",  submittedAt: "2026-02-20", grade: 54, feedback: "Strong analysis!" },
  { id: "sb162", assignmentId: "a32", studentId: "s18", status: "Late",    submittedAt: "2026-02-23", grade: 38, feedback: "Late. Minimal real-world connection." },

  // ── a33 One-Step Equations Worksheet (20 pts, Mar 1) ─────────────────────
  { id: "sb163", assignmentId: "a33", studentId: "s13", status: "Graded",  submittedAt: "2026-02-28", grade: 19, feedback: "All checks verified." },
  { id: "sb164", assignmentId: "a33", studentId: "s14", status: "Graded",  submittedAt: "2026-02-28", grade: 15, feedback: "Good. A few check steps missing." },
  { id: "sb165", assignmentId: "a33", studentId: "s15", status: "Graded",  submittedAt: "2026-03-01", grade: 17, feedback: "Solid work!" },
  { id: "sb166", assignmentId: "a33", studentId: "s16", status: "Graded",  submittedAt: "2026-03-01", grade: 13, feedback: "Review inverse operations." },
  { id: "sb167", assignmentId: "a33", studentId: "s17", status: "Graded",  submittedAt: "2026-02-28", grade: 18, feedback: "Excellent!" },
  { id: "sb168", assignmentId: "a33", studentId: "s18", status: "Missing", submittedAt: null,          grade: null, feedback: null },

  // ── a34 Q1 Algebra Exam (100 pts, Mar 7) ─────────────────────────────────
  { id: "sb169", assignmentId: "a34", studentId: "s13", status: "Graded",  submittedAt: "2026-03-07", grade: 94, feedback: "Outstanding exam!" },
  { id: "sb170", assignmentId: "a34", studentId: "s14", status: "Graded",  submittedAt: "2026-03-07", grade: 76, feedback: "Good. Review two-step equations." },
  { id: "sb171", assignmentId: "a34", studentId: "s15", status: "Graded",  submittedAt: "2026-03-07", grade: 87, feedback: "Strong performance!" },
  { id: "sb172", assignmentId: "a34", studentId: "s16", status: "Late",    submittedAt: "2026-03-08", grade: 65, feedback: "Late. Focus on equation concepts." },
  { id: "sb173", assignmentId: "a34", studentId: "s17", status: "Graded",  submittedAt: "2026-03-07", grade: 91, feedback: "Excellent!" },
  { id: "sb174", assignmentId: "a34", studentId: "s18", status: "Graded",  submittedAt: "2026-03-07", grade: 58, feedback: "Below average. Tutoring recommended." },

  // ── a35 Two-Step Equations Practice (25 pts, Mar 14) ─────────────────────
  { id: "sb175", assignmentId: "a35", studentId: "s13", status: "Graded",  submittedAt: "2026-03-13", grade: 24, feedback: "All work shown perfectly." },
  { id: "sb176", assignmentId: "a35", studentId: "s14", status: "Graded",  submittedAt: "2026-03-13", grade: 19, feedback: "Good. Minor arithmetic slip." },
  { id: "sb177", assignmentId: "a35", studentId: "s15", status: "Graded",  submittedAt: "2026-03-13", grade: 22, feedback: "Solid effort!" },
  { id: "sb178", assignmentId: "a35", studentId: "s16", status: "Missing", submittedAt: null,          grade: null, feedback: null },
  { id: "sb179", assignmentId: "a35", studentId: "s17", status: "Graded",  submittedAt: "2026-03-13", grade: 23, feedback: "Very good!" },
  { id: "sb180", assignmentId: "a35", studentId: "s18", status: "Graded",  submittedAt: "2026-03-14", grade: 16, feedback: "Review equation balance." },

  // ── a36 Inequalities Quiz (40 pts, Mar 21) ────────────────────────────────
  { id: "sb181", assignmentId: "a36", studentId: "s13", status: "Graded",  submittedAt: "2026-03-20", grade: 38, feedback: "Graphs and solutions both correct." },
  { id: "sb182", assignmentId: "a36", studentId: "s14", status: "Graded",  submittedAt: "2026-03-20", grade: 31, feedback: "Good. Check open/closed circles." },
  { id: "sb183", assignmentId: "a36", studentId: "s15", status: "Graded",  submittedAt: "2026-03-20", grade: 35, feedback: "Well done!" },
  { id: "sb184", assignmentId: "a36", studentId: "s16", status: "Late",    submittedAt: "2026-03-22", grade: 27, feedback: "Late. Review inequality direction." },
  { id: "sb185", assignmentId: "a36", studentId: "s17", status: "Graded",  submittedAt: "2026-03-20", grade: 37, feedback: "Excellent!" },
  { id: "sb186", assignmentId: "a36", studentId: "s18", status: "Graded",  submittedAt: "2026-03-21", grade: 24, feedback: "Adequate. More graphing practice needed." },

  // ── a37 Multi-Step Equations Worksheet (30 pts, Mar 28) ──────────────────
  { id: "sb187", assignmentId: "a37", studentId: "s13", status: "Graded",  submittedAt: "2026-03-27", grade: 28, feedback: "All equations solved correctly." },
  { id: "sb188", assignmentId: "a37", studentId: "s14", status: "Graded",  submittedAt: "2026-03-27", grade: 23, feedback: "Good. Watch combining like terms." },
  { id: "sb189", assignmentId: "a37", studentId: "s15", status: "Graded",  submittedAt: "2026-03-27", grade: 26, feedback: "Solid work!" },
  { id: "sb190", assignmentId: "a37", studentId: "s16", status: "Graded",  submittedAt: "2026-03-28", grade: 19, feedback: "Adequate. Review distribution." },
  { id: "sb191", assignmentId: "a37", studentId: "s17", status: "Graded",  submittedAt: "2026-03-27", grade: 27, feedback: "Very good!" },
  { id: "sb192", assignmentId: "a37", studentId: "s18", status: "Missing", submittedAt: null,          grade: null, feedback: null },
];

export const RUBRICS: Rubric[] = [
  // a2 – Rational Expressions Worksheet (30 pts)
  {
    id: "r1", assignmentId: "a2", title: "Rational Expressions Worksheet Rubric",
    criteria: [
      {
        id: "r1c1", label: "Mathematical Accuracy", description: "Correct simplification, factoring, and statement of domain restrictions.", points: 15,
        levels: [
          { label: "Excellent",   points: 15, description: "All simplifications correct; all domain restrictions properly stated." },
          { label: "Good",        points: 12, description: "Minor arithmetic errors only; restrictions mostly correct." },
          { label: "Satisfactory",points: 9,  description: "Several errors but demonstrates understanding of the process." },
          { label: "Needs Work",  points: 5,  description: "Major errors; partial understanding shown." },
          { label: "Incomplete",  points: 0,  description: "Not attempted or mostly incorrect." },
        ],
      },
      {
        id: "r1c2", label: "Work & Steps Shown", description: "Clear step-by-step solutions showing the simplification process.", points: 10,
        levels: [
          { label: "Full Credit", points: 10, description: "All steps clearly shown and logically organized." },
          { label: "Good",        points: 8,  description: "Most steps shown with minor gaps." },
          { label: "Partial",     points: 5,  description: "Some work shown; key steps missing." },
          { label: "Minimal",     points: 2,  description: "Only answers with minimal work." },
          { label: "Not Shown",   points: 0,  description: "Answers only; no supporting work." },
        ],
      },
      {
        id: "r1c3", label: "Completeness", description: "All 20 problems attempted.", points: 5,
        levels: [
          { label: "All 20",    points: 5, description: "All 20 problems completed." },
          { label: "16–19",     points: 4, description: "16–19 problems completed." },
          { label: "11–15",     points: 3, description: "11–15 problems completed." },
          { label: "1–10",      points: 1, description: "1–10 problems completed." },
          { label: "None",      points: 0, description: "No problems submitted." },
        ],
      },
    ],
  },
  // a4 – Math in Real Life Project (80 pts)
  {
    id: "r2", assignmentId: "a4", title: "Math in Real Life Project Rubric",
    criteria: [
      {
        id: "r2c1", label: "Research Quality", description: "Depth, accuracy, and relevance of research on real-world applications.", points: 20,
        levels: [
          { label: "Excellent",    points: 20, description: "Thorough, well-cited research with multiple credible sources." },
          { label: "Good",         points: 16, description: "Adequate research with mostly reliable sources." },
          { label: "Satisfactory", points: 12, description: "Basic research present but lacks depth." },
          { label: "Needs Work",   points: 8,  description: "Minimal research; sources questionable." },
          { label: "Incomplete",   points: 0,  description: "No research evident." },
        ],
      },
      {
        id: "r2c2", label: "Mathematical Accuracy", description: "Correct application of quadratic equations to the chosen context.", points: 25,
        levels: [
          { label: "Excellent",    points: 25, description: "Equations correctly set up and solved; real-world values used accurately." },
          { label: "Good",         points: 20, description: "Minor errors in setup or calculation." },
          { label: "Satisfactory", points: 15, description: "Shows understanding but contains notable errors." },
          { label: "Needs Work",   points: 8,  description: "Significant mathematical errors." },
          { label: "Incomplete",   points: 0,  description: "Mathematics absent or entirely incorrect." },
        ],
      },
      {
        id: "r2c3", label: "Real-world Connection", description: "How meaningfully mathematics is connected to the chosen real-world scenario.", points: 20,
        levels: [
          { label: "Excellent",    points: 20, description: "Clear, insightful connection with compelling explanation." },
          { label: "Good",         points: 16, description: "Good connection; explanation mostly clear." },
          { label: "Satisfactory", points: 12, description: "Basic connection made but not fully explained." },
          { label: "Needs Work",   points: 6,  description: "Tenuous connection; limited explanation." },
          { label: "Incomplete",   points: 0,  description: "No real-world connection made." },
        ],
      },
      {
        id: "r2c4", label: "Presentation & Organization", description: "Clarity, structure, and overall quality of the project.", points: 15,
        levels: [
          { label: "Excellent",    points: 15, description: "Well-structured, professional, easy to follow." },
          { label: "Good",         points: 12, description: "Mostly clear with minor organizational issues." },
          { label: "Satisfactory", points: 9,  description: "Basic structure present; some parts unclear." },
          { label: "Needs Work",   points: 5,  description: "Disorganized; difficult to follow." },
          { label: "Incomplete",   points: 0,  description: "No discernible organization." },
        ],
      },
    ],
  },
  // a6 – Polynomial Operations (40 pts)
  {
    id: "r3", assignmentId: "a6", title: "Polynomial Operations Rubric",
    criteria: [
      {
        id: "r3c1", label: "Mathematical Accuracy", description: "Correct addition, subtraction, and multiplication of polynomials.", points: 20,
        levels: [
          { label: "Excellent",    points: 20, description: "All 20 problems solved correctly." },
          { label: "Good",         points: 16, description: "1–3 errors; demonstrates strong understanding." },
          { label: "Satisfactory", points: 12, description: "4–6 errors; shows basic understanding." },
          { label: "Needs Work",   points: 6,  description: "7+ errors; limited understanding." },
          { label: "Incomplete",   points: 0,  description: "Not attempted." },
        ],
      },
      {
        id: "r3c2", label: "Method & Steps", description: "Proper use of FOIL, distributive property, and combining like terms.", points: 12,
        levels: [
          { label: "Full Credit", points: 12, description: "Correct methods used throughout with all steps shown." },
          { label: "Good",        points: 10, description: "Correct methods with minor procedural gaps." },
          { label: "Partial",     points: 7,  description: "Some correct methods; inconsistent application." },
          { label: "Minimal",     points: 3,  description: "Methods poorly applied." },
          { label: "None",        points: 0,  description: "No recognizable method." },
        ],
      },
      {
        id: "r3c3", label: "Presentation", description: "Neatness, organization, and clarity of written work.", points: 8,
        levels: [
          { label: "Excellent",    points: 8, description: "Work is neat, clearly organized, and easy to follow." },
          { label: "Good",         points: 6, description: "Generally clear with minor issues." },
          { label: "Satisfactory", points: 4, description: "Legible but disorganized." },
          { label: "Needs Work",   points: 2, description: "Difficult to read or follow." },
          { label: "Incomplete",   points: 0, description: "Not presented." },
        ],
      },
    ],
  },
  // a9 – Graphing Functions Worksheet (30 pts)
  {
    id: "r4", assignmentId: "a9", title: "Graphing Functions Rubric",
    criteria: [
      {
        id: "r4c1", label: "Graph Accuracy", description: "Correct plotting of points and lines with proper slope and intercepts.", points: 15,
        levels: [
          { label: "Excellent",    points: 15, description: "All graphs plotted accurately with correct slope and intercepts." },
          { label: "Good",         points: 12, description: "Minor plotting errors; overall correct." },
          { label: "Satisfactory", points: 9,  description: "Some graphs correct; several contain errors." },
          { label: "Needs Work",   points: 5,  description: "Most graphs incorrect." },
          { label: "Incomplete",   points: 0,  description: "No accurate graphs." },
        ],
      },
      {
        id: "r4c2", label: "Labels & Notation", description: "Proper labeling of axes, intercepts, slope, domain, and range.", points: 10,
        levels: [
          { label: "Full Credit", points: 10, description: "All graphs fully labeled with intercepts, slope, domain, and range." },
          { label: "Good",        points: 8,  description: "Most labels present; minor omissions." },
          { label: "Partial",     points: 5,  description: "Some labels missing." },
          { label: "Minimal",     points: 2,  description: "Very few labels." },
          { label: "None",        points: 0,  description: "No labels at all." },
        ],
      },
      {
        id: "r4c3", label: "Completeness", description: "All assigned functions graphed.", points: 5,
        levels: [
          { label: "All 10",  points: 5, description: "All 10 functions graphed." },
          { label: "8–9",     points: 4, description: "8–9 functions graphed." },
          { label: "5–7",     points: 3, description: "5–7 functions graphed." },
          { label: "1–4",     points: 1, description: "1–4 functions graphed." },
          { label: "None",    points: 0, description: "Nothing submitted." },
        ],
      },
    ],
  },
  // a10 – Systems of Equations (40 pts)
  {
    id: "r5", assignmentId: "a10", title: "Systems of Equations Rubric",
    criteria: [
      {
        id: "r5c1", label: "Substitution Method", description: "Correct use of substitution for designated problems.", points: 15,
        levels: [
          { label: "Excellent",    points: 15, description: "All substitution problems solved correctly with steps shown." },
          { label: "Good",         points: 12, description: "Minor errors; method correctly applied." },
          { label: "Satisfactory", points: 9,  description: "Some errors; shows understanding of the method." },
          { label: "Needs Work",   points: 5,  description: "Significant errors in substitution." },
          { label: "Incomplete",   points: 0,  description: "Not attempted." },
        ],
      },
      {
        id: "r5c2", label: "Elimination Method", description: "Correct use of elimination for designated problems.", points: 15,
        levels: [
          { label: "Excellent",    points: 15, description: "All elimination problems solved correctly with steps shown." },
          { label: "Good",         points: 12, description: "Minor errors; method correctly applied." },
          { label: "Satisfactory", points: 9,  description: "Some errors; shows understanding of elimination." },
          { label: "Needs Work",   points: 5,  description: "Significant errors in elimination." },
          { label: "Incomplete",   points: 0,  description: "Not attempted." },
        ],
      },
      {
        id: "r5c3", label: "Verification & Checking", description: "Evidence of checking answers by substituting solutions back into original equations.", points: 10,
        levels: [
          { label: "Full Credit", points: 10, description: "All answers verified with work shown." },
          { label: "Good",        points: 8,  description: "Most answers verified." },
          { label: "Partial",     points: 5,  description: "Some answers verified." },
          { label: "Minimal",     points: 2,  description: "Checking attempted but mostly missing." },
          { label: "None",        points: 0,  description: "No verification shown." },
        ],
      },
    ],
  },
];

export const ANNOUNCEMENTS: Announcement[] = [
  { id: "an1", classId: "c1", title: "Midterm Schedule Update",   content: "The midterm exam is on April 18. Review all topics from Q1 and Q2. Bring your calculator.",                       createdAt: "2026-03-31", author: "You" },
  { id: "an2", classId: "c1", title: "Group Project Guidelines",  content: "See the uploaded guidelines for the Math in Real Life project. Groups of 3–4. Present on April 25.",             createdAt: "2026-03-29", author: "You" },
  { id: "an3", classId: "c2", title: "No Class on April 9",       content: "No class on April 9 (school holiday). Catch-up session will be on April 11.",                                    createdAt: "2026-04-01", author: "You" },
  { id: "an4", classId: "c2", title: "Quiz This Thursday",        content: "Reminder: Arithmetic Sequences Quiz this Thursday. Study chapters 3 and 4.",                                     createdAt: "2026-04-01", author: "You" },
  { id: "an5", classId: "c3", title: "Linear Equations Quiz",     content: "Short quiz tomorrow on solving linear equations. Cover pages 45–62 in your textbook.",                           createdAt: "2026-04-03", author: "You" },
  { id: "an6", classId: "c3", title: "Study Groups Available",    content: "Study groups every Tuesday and Thursday after school in Room 105. Highly recommended for extra help.",             createdAt: "2026-03-30", author: "You" },
];

export const QUIZZES: Quiz[] = [
  {
    id: "q1", classId: "c1", title: "Quadratic Equations Quiz", description: "Test your knowledge of solving quadratic equations by factoring and using the quadratic formula.",
    timeLimit: 30, attemptsAllowed: 1, shuffleQuestions: true, status: "published", dueDate: "2026-04-05", createdAt: "2026-03-28", totalPoints: 40,
    questions: [
      { id: "qq1", type: "multiple_choice", text: "What are the solutions to x² - 5x + 6 = 0?", options: ["x = 2, x = 3", "x = -2, x = -3", "x = 1, x = 6", "x = -1, x = -6"], correctAnswer: "x = 2, x = 3", points: 10 },
      { id: "qq2", type: "multiple_choice", text: "Which method is used to solve x² + 4x + 4 = 0?", options: ["Factoring", "Quadratic Formula", "Completing the Square", "All of the above"], correctAnswer: "All of the above", points: 10 },
      { id: "qq3", type: "true_false", text: "The discriminant determines the number of real solutions of a quadratic equation.", options: ["True", "False"], correctAnswer: "True", points: 10 },
      { id: "qq4", type: "short_answer", text: "Solve for x: x² - 9 = 0. List both solutions separated by a comma.", correctAnswer: "3, -3", points: 10 },
    ],
  },
  {
    id: "q2", classId: "c1", title: "Radical Expressions Assessment", description: "Evaluate your understanding of simplifying and operating with radical expressions.",
    timeLimit: 45, attemptsAllowed: 2, shuffleQuestions: false, status: "draft", dueDate: "2026-04-15", createdAt: "2026-04-01", totalPoints: 50,
    questions: [
      { id: "qq5", type: "multiple_choice", text: "Simplify √72.", options: ["6√2", "8√3", "3√8", "2√18"], correctAnswer: "6√2", points: 10 },
      { id: "qq6", type: "multiple_choice", text: "What is √50 + √18?", options: ["8√2", "5√2 + 3√2", "Both A and B", "Neither"], correctAnswer: "Both A and B", points: 10 },
      { id: "qq7", type: "true_false", text: "√(a²) = a for all real numbers a.", options: ["True", "False"], correctAnswer: "False", points: 10 },
      { id: "qq8", type: "short_answer", text: "Rationalize the denominator: 1/√5", correctAnswer: "√5/5", points: 10 },
      { id: "qq9", type: "multiple_choice", text: "Which expression equals √(12) · √(3)?", options: ["6", "√36", "Both A and B", "3√4"], correctAnswer: "Both A and B", points: 10 },
    ],
  },
  {
    id: "q3", classId: "c2", title: "Arithmetic Sequences Quiz", description: "Test your knowledge on arithmetic sequences and series.",
    timeLimit: 25, attemptsAllowed: 1, shuffleQuestions: true, status: "published", dueDate: "2026-04-06", createdAt: "2026-03-28", totalPoints: 30,
    questions: [
      { id: "qq10", type: "multiple_choice", text: "What is the common difference in 3, 7, 11, 15?", options: ["3", "4", "5", "7"], correctAnswer: "4", points: 10 },
      { id: "qq11", type: "true_false", text: "An arithmetic sequence can have a negative common difference.", options: ["True", "False"], correctAnswer: "True", points: 10 },
      { id: "qq12", type: "short_answer", text: "Find the 10th term of the sequence: 2, 5, 8, 11, ...", correctAnswer: "29", points: 10 },
    ],
  },
  {
    id: "q4", classId: "c3", title: "Linear Equations Quiz", description: "Solve linear equations in one variable.",
    timeLimit: 20, attemptsAllowed: 1, shuffleQuestions: false, status: "published", dueDate: "2026-04-04", createdAt: "2026-03-27", totalPoints: 30,
    questions: [
      { id: "qq13", type: "multiple_choice", text: "Solve: 3x + 7 = 22", options: ["x = 5", "x = 3", "x = 7", "x = 15"], correctAnswer: "x = 5", points: 10 },
      { id: "qq14", type: "true_false", text: "The equation 2x + 3 = 2x + 5 has no solution.", options: ["True", "False"], correctAnswer: "True", points: 10 },
      { id: "qq15", type: "short_answer", text: "Solve for x: 5(x - 2) = 3x + 4", correctAnswer: "7", points: 10 },
    ],
  },
];

// Exams are stored in QUIZZES with quizType: "exam"
export const EXAMS: Quiz[] = [
  {
    id: "ex1", classId: "c1", title: "Midterm Examination", description: "Comprehensive midterm covering quadratic equations, radicals, and rational expressions. Show all work for partial credit.",
    timeLimit: 90, attemptsAllowed: 1, shuffleQuestions: false, status: "published", dueDate: "2026-04-18", createdAt: "2026-04-01", totalPoints: 100,
    quizType: "exam", passingScore: 75, showResultsAfter: false,
    questions: [
      { id: "eq1", type: "multiple_choice",  text: "What is the discriminant of x² - 4x + 4 = 0?", options: ["0", "4", "-4", "16"], correctAnswer: "0", points: 10, explanation: "Discriminant b²-4ac = (-4)²-4(1)(4) = 16-16 = 0" },
      { id: "eq2", type: "multiple_answers", text: "Which of the following are methods to solve a quadratic equation? (Select all that apply)", options: ["Factoring", "Quadratic Formula", "Integration", "Completing the Square"], correctAnswer: "", correctAnswers: ["Factoring", "Quadratic Formula", "Completing the Square"], points: 15 },
      { id: "eq3", type: "true_false",       text: "Every quadratic equation has exactly two real solutions.", options: ["True", "False"], correctAnswer: "False", points: 10, explanation: "A quadratic can have 0, 1, or 2 real solutions depending on the discriminant." },
      { id: "eq4", type: "short_answer",     text: "Simplify: √48", correctAnswer: "4√3", points: 15 },
      { id: "eq5", type: "essay",            text: "Explain in your own words how the quadratic formula is derived. Include the key steps of completing the square.", correctAnswer: "", points: 25 },
      { id: "eq6", type: "multiple_choice",  text: "Rationalize the denominator: 3/√7", options: ["3√7/7", "3/7", "√7/3", "21/7"], correctAnswer: "3√7/7", points: 15 },
      { id: "eq7", type: "short_answer",     text: "Solve: x² - 2x - 15 = 0. List solutions separated by a comma.", correctAnswer: "5, -3", points: 10 },
    ],
  },
  {
    id: "ex2", classId: "c1", title: "First Quarter Final Exam", description: "Comprehensive final covering all Q1 topics. Time management is key — allocate about 1 minute per point.",
    timeLimit: 120, attemptsAllowed: 1, shuffleQuestions: false, status: "draft", dueDate: "2026-05-10", createdAt: "2026-04-10", totalPoints: 100,
    quizType: "exam", passingScore: 75, showResultsAfter: false,
    questions: [],
  },
  {
    id: "ex3", classId: "c2", title: "Midterm Examination", description: "Covers arithmetic and geometric sequences, polynomial functions, and combinatorics.",
    timeLimit: 90, attemptsAllowed: 1, shuffleQuestions: false, status: "published", dueDate: "2026-04-20", createdAt: "2026-04-02", totalPoints: 100,
    quizType: "exam", passingScore: 75, showResultsAfter: true,
    questions: [
      { id: "eq8", type: "multiple_choice",  text: "Find the 15th term of the arithmetic sequence: 4, 9, 14, 19...", options: ["74", "69", "79", "64"], correctAnswer: "74", points: 20 },
      { id: "eq9", type: "multiple_answers", text: "Which of the following are properties of geometric sequences? (Select all that apply)", options: ["Constant common difference", "Constant common ratio", "Can have negative terms", "Always increasing"], correctAnswer: "", correctAnswers: ["Constant common ratio", "Can have negative terms"], points: 20 },
      { id: "eq10", type: "essay",           text: "Compare and contrast arithmetic and geometric sequences. Give one real-world example of each.", correctAnswer: "", points: 30 },
      { id: "eq11", type: "short_answer",    text: "How many ways can 5 students be arranged in a row?", correctAnswer: "120", points: 30 },
    ],
  },
  {
    id: "ex4", classId: "c3", title: "Unit 1 Exam – Linear Equations", description: "Covers solving linear equations, inequalities, and graphing on the coordinate plane.",
    timeLimit: 60, attemptsAllowed: 1, shuffleQuestions: false, status: "published", dueDate: "2026-04-12", createdAt: "2026-04-01", totalPoints: 80,
    quizType: "exam", passingScore: 70, showResultsAfter: true,
    questions: [
      { id: "eq12", type: "multiple_choice",  text: "Solve: 2(3x - 1) = 4x + 8", options: ["x = 5", "x = 3", "x = 2", "x = 4"], correctAnswer: "x = 5", points: 20 },
      { id: "eq13", type: "true_false",       text: "The graph of y = -2x + 3 has a negative slope.", options: ["True", "False"], correctAnswer: "True", points: 10 },
      { id: "eq14", type: "multiple_answers", text: "Which of the following are linear equations? (Select all that apply)", options: ["y = 3x + 2", "y = x²", "2x + 3y = 6", "y = 1/x"], correctAnswer: "", correctAnswers: ["y = 3x + 2", "2x + 3y = 6"], points: 20 },
      { id: "eq15", type: "short_answer",     text: "Find the slope of the line through (2, 5) and (6, 13).", correctAnswer: "2", points: 15 },
      { id: "eq16", type: "essay",            text: "Describe what the slope and y-intercept tell us about a real-world linear relationship. Use an example.", correctAnswer: "", points: 15 },
    ],
  },
];

export function getExamsByClass(classId: string) { return EXAMS.filter(e => e.classId === classId); }
export function getExamById(examId: string) { return EXAMS.find(e => e.id === examId); }

export const DISCUSSIONS: Discussion[] = [
  {
    id: "d1", classId: "c1", title: "Real-World Applications of Quadratics", prompt: "Share an example of how quadratic equations are used in real life. Explain the situation and how the equation models it. Respond to at least one classmate's post.", author: "You", authorRole: "teacher", createdAt: "2026-03-28", pinned: true,
    replies: [
      { id: "dr1", author: "Maria Santos", authorRole: "student", content: "Quadratic equations are used in physics to model projectile motion! When you throw a ball, the height over time follows a parabola. The equation h(t) = -16t² + v₀t + h₀ describes this perfectly.", createdAt: "2026-03-29", likes: 4, replies: [
        { id: "dr1a", author: "Juan Reyes", authorRole: "student", content: "Great example Maria! I also learned that architects use parabolas in bridge design for structural strength.", createdAt: "2026-03-29", likes: 2 },
        { id: "dr1b", author: "You", authorRole: "teacher", content: "Excellent examples, both of you! The parabolic shape indeed distributes weight evenly, which is why it's so common in engineering.", createdAt: "2026-03-30", likes: 3 },
      ]},
      { id: "dr2", author: "Liza Garcia", authorRole: "student", content: "In business, quadratic equations help find maximum profit! If revenue is R(x) = -2x² + 100x, you can find the price x that maximizes revenue.", createdAt: "2026-03-30", likes: 3, replies: [
        { id: "dr2a", author: "Carlo Mendoza", authorRole: "student", content: "That's interesting! So the vertex of the parabola gives the optimal price?", createdAt: "2026-03-31", likes: 1 },
      ]},
    ],
  },
  {
    id: "d2", classId: "c1", title: "Study Tips for Midterm", prompt: "What study strategies work best for you when preparing for math exams? Share your tips and techniques.", author: "You", authorRole: "teacher", createdAt: "2026-03-31", pinned: false,
    replies: [
      { id: "dr3", author: "Anna Cruz", authorRole: "student", content: "I find that practice problems are the best way to study. I redo all the homework problems and then try the extra practice from the textbook.", createdAt: "2026-04-01", likes: 5 },
      { id: "dr4", author: "Pedro Dela Cruz", authorRole: "student", content: "Flashcards for formulas really help me! I write the formula on one side and an example on the other.", createdAt: "2026-04-01", likes: 2 },
    ],
  },
  {
    id: "d3", classId: "c2", title: "Patterns in Nature", prompt: "Find an example of a mathematical sequence or pattern in nature. Share a photo or description and explain the math behind it.", author: "You", authorRole: "teacher", createdAt: "2026-04-01", pinned: true,
    replies: [
      { id: "dr5", author: "Sofia Torres", authorRole: "student", content: "The Fibonacci sequence appears in sunflower seed patterns! The seeds spiral in two directions, and the number of spirals are consecutive Fibonacci numbers.", createdAt: "2026-04-02", likes: 6 },
    ],
  },
  {
    id: "d4", classId: "c3", title: "When Will We Use Algebra?", prompt: "Many students ask 'when will I use this?' Let's discuss! Where have you seen algebra concepts outside of school?", author: "You", authorRole: "teacher", createdAt: "2026-03-29", pinned: false,
    replies: [
      { id: "dr6", author: "Rosa Aquino", authorRole: "student", content: "My mom uses algebra at work for budgeting! She sets up equations to figure out how much supplies to order.", createdAt: "2026-03-30", likes: 3 },
      { id: "dr7", author: "Jose Villanueva", authorRole: "student", content: "I use it in video games — calculating damage, speed, and trajectory is basically algebra!", createdAt: "2026-03-30", likes: 4, replies: [
        { id: "dr7a", author: "You", authorRole: "teacher", content: "Great observation Jose! Game developers use tons of math, including algebra, to create realistic physics and mechanics.", createdAt: "2026-03-31", likes: 2 },
      ]},
    ],
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv1", participantId: "s1", participantName: "Maria Santos", participantAvatar: "MA", participantRole: "Student",
    lastMessage: "Thank you, Ms. Santos!", lastMessageTime: "2026-03-30T14:30:00", unread: 0,
    messages: [
      { id: "m1", senderId: "s1",      text: "Good morning, Ms. Santos. I have a question about the midterm.",       timestamp: "2026-03-30T14:00:00" },
      { id: "m2", senderId: "teacher", text: "Hello Maria! Of course, what would you like to know?",                 timestamp: "2026-03-30T14:05:00" },
      { id: "m3", senderId: "s1",      text: "Will the exam cover topics from Q2 as well?",                          timestamp: "2026-03-30T14:10:00" },
      { id: "m4", senderId: "teacher", text: "Yes, it covers all of Q1 and Q2. I'll post a reviewer tomorrow.",      timestamp: "2026-03-30T14:20:00" },
      { id: "m5", senderId: "s1",      text: "Thank you, Ms. Santos!",                                               timestamp: "2026-03-30T14:30:00" },
    ],
  },
  {
    id: "conv2", participantId: "parent1", participantName: "Mr. Roberto Reyes", participantAvatar: "RR", participantRole: "Parent",
    lastMessage: "We appreciate your dedication.", lastMessageTime: "2026-03-29T10:15:00", unread: 2,
    messages: [
      { id: "m6",  senderId: "parent1", text: "Good day. This is Roberto Reyes, father of Juan Reyes.",              timestamp: "2026-03-29T09:00:00" },
      { id: "m7",  senderId: "teacher", text: "Good day, Mr. Reyes! How can I help?",                                 timestamp: "2026-03-29T09:30:00" },
      { id: "m8",  senderId: "parent1", text: "I wanted to check on Juan's progress. He seems to be struggling.",     timestamp: "2026-03-29T09:45:00" },
      { id: "m9",  senderId: "teacher", text: "Juan is doing well overall. I recommend he joins the Tuesday study group.", timestamp: "2026-03-29T10:00:00" },
      { id: "m10", senderId: "parent1", text: "We appreciate your dedication.",                                       timestamp: "2026-03-29T10:15:00" },
    ],
  },
  {
    id: "conv3", participantId: "admin1", participantName: "Principal Cruz", participantAvatar: "PC", participantRole: "Admin",
    lastMessage: "Please submit your grades by April 30.", lastMessageTime: "2026-03-28T11:00:00", unread: 1,
    messages: [
      { id: "m11", senderId: "admin1",  text: "Good morning, Ms. Santos. Reminder about the upcoming grading period.", timestamp: "2026-03-28T10:30:00" },
      { id: "m12", senderId: "teacher", text: "Good morning, Principal Cruz. I'm on track with grading.",             timestamp: "2026-03-28T10:45:00" },
      { id: "m13", senderId: "admin1",  text: "Please submit your grades by April 30.",                               timestamp: "2026-03-28T11:00:00" },
    ],
  },
  {
    id: "conv4", participantId: "s7", participantName: "Sofia Torres", participantAvatar: "ST", participantRole: "Student",
    lastMessage: "I understand now, thank you!", lastMessageTime: "2026-03-27T16:00:00", unread: 0,
    messages: [
      { id: "m14", senderId: "s7",      text: "Ms. Santos, I'm having trouble with arithmetic sequences.",            timestamp: "2026-03-27T15:30:00" },
      { id: "m15", senderId: "teacher", text: "Hi Sofia! An arithmetic sequence has a constant difference between terms.", timestamp: "2026-03-27T15:40:00" },
      { id: "m16", senderId: "s7",      text: "So for 2, 5, 8, 11... the common difference is 3?",                   timestamp: "2026-03-27T15:50:00" },
      { id: "m17", senderId: "teacher", text: "Exactly right! You've got it.",                                        timestamp: "2026-03-27T15:55:00" },
      { id: "m18", senderId: "s7",      text: "I understand now, thank you!",                                         timestamp: "2026-03-27T16:00:00" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getClassById(id: string): Class | undefined {
  return CLASSES.find((c) => c.id === id);
}

export function getStudentsByClass(classId: string): Student[] {
  return STUDENTS.filter((s) => s.classId === classId);
}

export function getAssignmentsByClass(classId: string): Assignment[] {
  return ASSIGNMENTS.filter((a) => a.classId === classId);
}

export function getQuizzesByClass(classId: string): Quiz[] {
  return QUIZZES.filter((q) => q.classId === classId);
}

export function getAnnouncementsByClass(classId: string): Announcement[] {
  return ANNOUNCEMENTS.filter((a) => a.classId === classId);
}

export function getDiscussionsByClass(classId: string): Discussion[] {
  return DISCUSSIONS.filter((d) => d.classId === classId);
}

export function getSubmissionsByAssignment(assignmentId: string): Submission[] {
  return SUBMISSIONS.filter((s) => s.assignmentId === assignmentId);
}
