"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  Briefcase,
  UserCheck,
  Search,
  Plus,
  ChevronDown,
  Mail,
  Phone,
  Filter,
  Download,
  Upload,
  ArrowUpDown,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type PersonCategory = "all" | "students" | "staff" | "contacts";
type SortField = "name" | "id" | "grade" | "department" | "status";
type SortDir = "asc" | "desc";

interface StudentRow {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  homeroom: string;
  status: "Active" | "Inactive" | "Transferred";
  email: string;
  enrollmentDate: string;
}

interface StaffRow {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  status: "Active" | "On Leave" | "Inactive";
  email: string;
  phone: string;
}

interface ContactRow {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  linkedStudents: string[];
  phone: string;
  email: string;
  emergencyContact: boolean;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const STUDENTS: StudentRow[] = [
  { id: "1", studentId: "STU-1001", firstName: "Emma",    lastName: "Johnson",   gradeLevel: "10th", homeroom: "Room 204", status: "Active",      email: "emma.j@school.edu",       enrollmentDate: "2024-08-15" },
  { id: "2", studentId: "STU-1002", firstName: "Liam",    lastName: "Williams",  gradeLevel: "11th", homeroom: "Room 108", status: "Active",      email: "liam.w@school.edu",       enrollmentDate: "2023-08-20" },
  { id: "3", studentId: "STU-1003", firstName: "Olivia",  lastName: "Brown",     gradeLevel: "9th",  homeroom: "Room 312", status: "Active",      email: "olivia.b@school.edu",     enrollmentDate: "2025-08-18" },
  { id: "4", studentId: "STU-1004", firstName: "Noah",    lastName: "Davis",     gradeLevel: "12th", homeroom: "Room 101", status: "Active",      email: "noah.d@school.edu",       enrollmentDate: "2022-08-22" },
  { id: "5", studentId: "STU-1005", firstName: "Sophia",  lastName: "Martinez",  gradeLevel: "10th", homeroom: "Room 204", status: "Transferred", email: "sophia.m@school.edu",     enrollmentDate: "2024-08-15" },
  { id: "6", studentId: "STU-1006", firstName: "James",   lastName: "Garcia",    gradeLevel: "11th", homeroom: "Room 108", status: "Active",      email: "james.g@school.edu",      enrollmentDate: "2023-08-20" },
  { id: "7", studentId: "STU-1007", firstName: "Ava",     lastName: "Rodriguez", gradeLevel: "9th",  homeroom: "Room 312", status: "Active",      email: "ava.r@school.edu",        enrollmentDate: "2025-08-18" },
  { id: "8", studentId: "STU-1008", firstName: "William", lastName: "Wilson",    gradeLevel: "12th", homeroom: "Room 101", status: "Inactive",    email: "william.w@school.edu",    enrollmentDate: "2022-08-22" },
];

const STAFF: StaffRow[] = [
  { id: "1", employeeId: "EMP-2001", firstName: "Sarah",   lastName: "Thompson", role: "Teacher",           department: "Mathematics",    status: "Active",  email: "s.thompson@school.edu", phone: "(555) 101-0001" },
  { id: "2", employeeId: "EMP-2002", firstName: "Michael", lastName: "Chen",     role: "Teacher",           department: "Science",        status: "Active",  email: "m.chen@school.edu",     phone: "(555) 101-0002" },
  { id: "3", employeeId: "EMP-2003", firstName: "Jessica", lastName: "Adams",    role: "Counselor",         department: "Student Services",status: "Active",  email: "j.adams@school.edu",    phone: "(555) 101-0003" },
  { id: "4", employeeId: "EMP-2004", firstName: "Robert",  lastName: "Lee",      role: "Teacher",           department: "English",        status: "On Leave",email: "r.lee@school.edu",      phone: "(555) 101-0004" },
  { id: "5", employeeId: "EMP-2005", firstName: "Emily",   lastName: "Clark",    role: "Administrator",     department: "Administration", status: "Active",  email: "e.clark@school.edu",    phone: "(555) 101-0005" },
  { id: "6", employeeId: "EMP-2006", firstName: "David",   lastName: "Miller",   role: "Teacher",           department: "History",        status: "Active",  email: "d.miller@school.edu",   phone: "(555) 101-0006" },
];

const CONTACTS: ContactRow[] = [
  { id: "1", firstName: "Linda",   lastName: "Johnson",   relationship: "Mother",   linkedStudents: ["Emma Johnson"],                phone: "(555) 200-0001", email: "linda.j@email.com",  emergencyContact: true  },
  { id: "2", firstName: "Mark",    lastName: "Williams",  relationship: "Father",   linkedStudents: ["Liam Williams"],               phone: "(555) 200-0002", email: "mark.w@email.com",   emergencyContact: true  },
  { id: "3", firstName: "Carmen",  lastName: "Martinez",  relationship: "Mother",   linkedStudents: ["Sophia Martinez"],             phone: "(555) 200-0003", email: "carmen.m@email.com", emergencyContact: true  },
  { id: "4", firstName: "Gregory", lastName: "Brown",     relationship: "Father",   linkedStudents: ["Olivia Brown"],                phone: "(555) 200-0004", email: "greg.b@email.com",   emergencyContact: false },
  { id: "5", firstName: "Patricia",lastName: "Davis",     relationship: "Mother",   linkedStudents: ["Noah Davis"],                  phone: "(555) 200-0005", email: "pat.d@email.com",    emergencyContact: true  },
  { id: "6", firstName: "Thomas",  lastName: "Garcia",    relationship: "Guardian", linkedStudents: ["James Garcia", "Ava Rodriguez"],phone: "(555) 200-0006", email: "tom.g@email.com",    emergencyContact: true  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const TABS: { key: PersonCategory; label: string; icon: React.ElementType }[] = [
  { key: "all",      label: "All",      icon: Users },
  { key: "students", label: "Students", icon: GraduationCap },
  { key: "staff",    label: "Staff",    icon: Briefcase },
  { key: "contacts", label: "Contacts", icon: UserCheck },
];

const statusColor: Record<string, string> = {
  Active:      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  Inactive:    "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400",
  Transferred: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  "On Leave":  "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColor[status] ?? statusColor.Inactive}`}>
      {status}
    </span>
  );
}

function Avatar({ firstName, lastName, color }: { firstName: string; lastName: string; color: string }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 select-none ${color}`}>
      {firstName[0]}{lastName[0]}
    </div>
  );
}

const avatarColors = [
  "bg-blue-600", "bg-purple-600", "bg-emerald-600", "bg-amber-600",
  "bg-rose-600", "bg-cyan-600", "bg-indigo-600", "bg-teal-600",
];

function pickColor(id: string) {
  let hash = 0;
  for (const ch of id) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function AdminPeoplePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PersonCategory>("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showFilters, setShowFilters] = useState(false);

  const [letterFilter, setLetterFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [relationshipFilter, setRelationshipFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const q = search.toLowerCase().trim();

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll(ids: string[]) {
    const allSelected = ids.every(id => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(ids));
    }
  }

  // Reset selection when switching tabs
  function switchTab(tab: PersonCategory) {
    setActiveTab(tab);
    setSelectedIds(new Set());
    setSearch("");
    setLetterFilter("all");
    setGradeFilter("all");
    setRoleFilter("all");
    setDeptFilter("all");
    setRelationshipFilter("all");
    setStatusFilter("all");
    setShowFilters(false);
  }

  function clearFilters() {
    setLetterFilter("all");
    setGradeFilter("all");
    setRoleFilter("all");
    setDeptFilter("all");
    setRelationshipFilter("all");
    setStatusFilter("all");
  }

  const hasActiveFilters = letterFilter !== "all" || gradeFilter !== "all" || roleFilter !== "all" || deptFilter !== "all" || relationshipFilter !== "all" || statusFilter !== "all";

  /* ---------------------------------------------------------------- */
  /*  Filtered + sorted data                                          */
  /* ---------------------------------------------------------------- */

  const filteredStudents = useMemo(() => {
    let rows = STUDENTS.filter(s =>
      `${s.firstName} ${s.lastName} ${s.studentId} ${s.email}`.toLowerCase().includes(q)
    );
    if (letterFilter !== "all") rows = rows.filter(s => s.firstName[0].toUpperCase() === letterFilter);
    if (gradeFilter !== "all") rows = rows.filter(s => s.gradeLevel === gradeFilter);
    rows.sort((a, b) => {
      const cmp =
        sortField === "name"  ? `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`) :
        sortField === "id"    ? a.studentId.localeCompare(b.studentId) :
        sortField === "grade" ? a.gradeLevel.localeCompare(b.gradeLevel) :
        sortField === "status"? a.status.localeCompare(b.status) : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [q, sortField, sortDir, letterFilter, gradeFilter]);

  const filteredStaff = useMemo(() => {
    let rows = STAFF.filter(s =>
      `${s.firstName} ${s.lastName} ${s.employeeId} ${s.email} ${s.department} ${s.role}`.toLowerCase().includes(q)
    );
    if (letterFilter !== "all") rows = rows.filter(s => s.firstName[0].toUpperCase() === letterFilter);
    if (roleFilter !== "all") rows = rows.filter(s => s.role === roleFilter);
    if (deptFilter !== "all") rows = rows.filter(s => s.department === deptFilter);
    rows.sort((a, b) => {
      const cmp =
        sortField === "name"       ? `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`) :
        sortField === "id"         ? a.employeeId.localeCompare(b.employeeId) :
        sortField === "department" ? a.department.localeCompare(b.department) :
        sortField === "status"     ? a.status.localeCompare(b.status) : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [q, sortField, sortDir, letterFilter, roleFilter, deptFilter]);

  const filteredContacts = useMemo(() => {
    let rows = CONTACTS.filter(c =>
      `${c.firstName} ${c.lastName} ${c.email} ${c.relationship} ${c.linkedStudents.join(" ")}`.toLowerCase().includes(q)
    );
    if (letterFilter !== "all") rows = rows.filter(c => c.firstName[0].toUpperCase() === letterFilter);
    if (relationshipFilter !== "all") rows = rows.filter(c => c.relationship === relationshipFilter);
    if (statusFilter !== "all") rows = rows.filter(c => statusFilter === "Emergency" ? c.emergencyContact : !c.emergencyContact);
    rows.sort((a, b) => {
      const cmp = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [q, sortDir, letterFilter, relationshipFilter, statusFilter]);

  const currentIds = activeTab === "all"      ? [...filteredStudents, ...filteredStaff, ...filteredContacts].map(r => r.id) :
                     activeTab === "students" ? filteredStudents.map(r => r.id) :
                     activeTab === "staff"    ? filteredStaff.map(r => r.id) :
                     filteredContacts.map(r => r.id);

  const totalCount = STUDENTS.length + STAFF.length + CONTACTS.length;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="flex flex-col h-[calc(100vh-2.5rem)] gap-6">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Users className="w-7 h-7 text-[#1e3a8a]" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              People
            </h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              Manage students, staff, and contacts across your school
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm bg-[#1e3a8a] hover:bg-blue-700 text-white transition-all">
            <Plus className="w-4 h-4" />
            Add {activeTab === "staff" ? "Staff" : activeTab === "contacts" ? "Contact" : "Student"}
          </button>
        </div>
      </div>

      {/* Tab bar + search + filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col min-h-0 flex-1">

        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-gray-200 dark:border-slate-700 px-2 flex-shrink-0">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === key
                  ? "border-[#1e3a8a] text-[#1e3a8a] dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === key
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                  : "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400"
              }`}>
                {key === "all" ? totalCount : key === "students" ? STUDENTS.length : key === "staff" ? STAFF.length : CONTACTS.length}
              </span>
            </button>
          ))}
        </div>

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={
                activeTab === "all"      ? "Search across all people…" :
                activeTab === "students" ? "Search by name, ID, or email…" :
                activeTab === "staff"    ? "Search by name, ID, department, or role…" :
                "Search by name, email, or linked student…"
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          {activeTab !== "all" && (
            <button
              onClick={() => setShowFilters(f => !f)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                showFilters || hasActiveFilters
                  ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
                  : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && activeTab !== "all" && (
          <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30 flex-shrink-0">
            {/* Alphabetical filter — all tabs */}
            <div className="flex items-center gap-1.5 w-full">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1.5 flex-shrink-0">A–Z</span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setLetterFilter("all")}
                  className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
                    letterFilter === "all"
                      ? "bg-[#1e3a8a] text-white"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                  }`}
                >
                  All
                </button>
                {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(letter => (
                  <button
                    key={letter}
                    onClick={() => setLetterFilter(letterFilter === letter ? "all" : letter)}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
                      letterFilter === letter
                        ? "bg-[#1e3a8a] text-white"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab-specific filters */}
            <div className="flex flex-wrap items-center gap-3">
              {activeTab === "students" && (
                <FilterSelect label="Grade" value={gradeFilter} onChange={setGradeFilter} options={["9th", "10th", "11th", "12th"]} />
              )}

              {activeTab === "staff" && (
                <>
                  <FilterSelect label="Role" value={roleFilter} onChange={setRoleFilter} options={[...new Set(STAFF.map(s => s.role))]} />
                  <FilterSelect label="Department" value={deptFilter} onChange={setDeptFilter} options={[...new Set(STAFF.map(s => s.department))]} />
                </>
              )}

              {activeTab === "contacts" && (
                <>
                  <FilterSelect label="Relationship" value={relationshipFilter} onChange={setRelationshipFilter} options={[...new Set(CONTACTS.map(c => c.relationship))]} />
                  <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={["Emergency", "Non-emergency"]} />
                </>
              )}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Batch action bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-4 px-5 py-3 border-b border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
              {selectedIds.size} selected
            </span>
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Send email</button>
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">Export selected</button>
            <button className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline">Deactivate</button>
            <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-gray-500 dark:text-gray-400 hover:underline">
              Clear selection
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-auto min-h-0 flex-1">
          {/* Students section header (All tab only) */}
          {activeTab === "all" && filteredStudents.length > 0 && (
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Students</span>
              <span className="text-xs text-gray-400 dark:text-slate-500">({filteredStudents.length})</span>
            </div>
          )}

          {(activeTab === "students" || activeTab === "all") && filteredStudents.length > 0 && (
            <table className="w-full text-left table-fixed">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
              </colgroup>
              <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <th className="pl-5 pr-2 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={filteredStudents.length > 0 && filteredStudents.every(r => selectedIds.has(r.id))}
                      onChange={() => toggleSelectAll(filteredStudents.map(r => r.id))}
                      className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <ThBtn label="Name" field="name" current={sortField} dir={sortDir} onClick={toggleSort} />
                  <ThBtn label="Student ID" field="id" current={sortField} dir={sortDir} onClick={toggleSort} />
                  <th colSpan={3}><ThBtnInner label="Grade" field="grade" current={sortField} dir={sortDir} onClick={toggleSort} /></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(row => (
                  <tr
                    key={row.id}
                    onClick={() => router.push(`/sis/admin/people/students/${row.id}`)}
                    className="border-b border-gray-50 dark:border-slate-800/60 hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="pl-5 pr-2 py-3" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar firstName={row.firstName} lastName={row.lastName} color={pickColor(row.id + "s")} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">{row.firstName} {row.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-mono truncate">{row.studentId}</td>
                    <td colSpan={3} className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 truncate">{row.gradeLevel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === "students" && filteredStudents.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-400 dark:text-slate-500">No students found</div>
          )}

          {/* Staff section header (All tab only) */}
          {activeTab === "all" && filteredStaff.length > 0 && (
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20">
              <Briefcase className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Staff</span>
              <span className="text-xs text-gray-400 dark:text-slate-500">({filteredStaff.length})</span>
            </div>
          )}

          {(activeTab === "staff" || activeTab === "all") && filteredStaff.length > 0 && (
            <table className="w-full text-left table-fixed">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
              </colgroup>
              <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <th className="pl-5 pr-2 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={filteredStaff.length > 0 && filteredStaff.every(r => selectedIds.has(r.id))}
                      onChange={() => toggleSelectAll(filteredStaff.map(r => r.id))}
                      className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <ThBtn label="Name" field="name" current={sortField} dir={sortDir} onClick={toggleSort} />
                  <ThBtn label="Employee ID" field="id" current={sortField} dir={sortDir} onClick={toggleSort} />
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th colSpan={2}><ThBtnInner label="Department" field="department" current={sortField} dir={sortDir} onClick={toggleSort} /></th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(row => (
                  <tr key={row.id} className="border-b border-gray-50 dark:border-slate-800/60 hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                    <td className="pl-5 pr-2 py-3">
                      <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar firstName={row.firstName} lastName={row.lastName} color={pickColor(row.id + "st")} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">{row.firstName} {row.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 font-mono truncate">{row.employeeId}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 truncate">{row.role}</td>
                    <td colSpan={2} className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 truncate">{row.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === "staff" && filteredStaff.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-400 dark:text-slate-500">No staff found</div>
          )}

          {/* Contacts section header (All tab only) */}
          {activeTab === "all" && filteredContacts.length > 0 && (
            <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Contacts</span>
              <span className="text-xs text-gray-400 dark:text-slate-500">({filteredContacts.length})</span>
            </div>
          )}

          {(activeTab === "contacts" || activeTab === "all") && filteredContacts.length > 0 && (
            <table className="w-full text-left table-fixed">
              <colgroup>
                <col style={{ width: 48 }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "18%" }} />
              </colgroup>
              <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                <tr className="border-b border-gray-100 dark:border-slate-800">
                  <th className="pl-5 pr-2 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={filteredContacts.length > 0 && filteredContacts.every(r => selectedIds.has(r.id))}
                      onChange={() => toggleSelectAll(filteredContacts.map(r => r.id))}
                      className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <ThBtn label="Name" field="name" current={sortField} dir={sortDir} onClick={toggleSort} />
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Relationship</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Linked Students</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(row => (
                  <tr key={row.id} className="border-b border-gray-50 dark:border-slate-800/60 hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                    <td className="pl-5 pr-2 py-3">
                      <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleSelect(row.id)} className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar firstName={row.firstName} lastName={row.lastName} color={pickColor(row.id + "c")} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white hover:underline cursor-pointer">{row.firstName} {row.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 truncate">{row.relationship}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 truncate">
                      {row.linkedStudents.join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      {row.emergencyContact ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400">
                          Emergency
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button title="Email" className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button title="Phone" className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === "contacts" && filteredContacts.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-400 dark:text-slate-500">No contacts found</div>
          )}
          {activeTab === "all" && filteredStudents.length === 0 && filteredStaff.length === 0 && filteredContacts.length === 0 && (
            <div className="text-center py-12 text-sm text-gray-400 dark:text-slate-500">No results found</div>
          )}
        </div>

        {/* Footer / pagination hint */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-800/20 flex-shrink-0">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {activeTab === "all"      ? filteredStudents.length + filteredStaff.length + filteredContacts.length :
               activeTab === "students" ? filteredStudents.length :
               activeTab === "staff"    ? filteredStaff.length :
               filteredContacts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {activeTab === "all"      ? totalCount :
               activeTab === "students" ? STUDENTS.length :
               activeTab === "staff"    ? STAFF.length :
               CONTACTS.length}
            </span>{" "}
            {activeTab === "all" ? "people" : activeTab}
          </p>
          <div className="flex items-center gap-1">
            <button disabled className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#1e3a8a]">
              1
            </button>
            <button disabled className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter select                                                      */
/* ------------------------------------------------------------------ */

const selectCls = "px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

function FilterSelect({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      {label}:
      <select value={value} onChange={e => onChange(e.target.value)} className={selectCls}>
        <option value="all">All</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  Sortable table header button                                       */
/* ------------------------------------------------------------------ */

function ThBtnInner({ label, field, current, dir, onClick }: {
  label: string;
  field: SortField;
  current: SortField;
  dir: SortDir;
  onClick: (f: SortField) => void;
}) {
  const active = current === field;
  return (
    <button
      type="button"
      onClick={() => onClick(field)}
      className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
    >
      {label}
      <ArrowUpDown className={`w-3 h-3 ${active ? "text-blue-600 dark:text-blue-400" : "text-gray-300 dark:text-slate-600"}`} />
    </button>
  );
}

function ThBtn(props: {
  label: string;
  field: SortField;
  current: SortField;
  dir: SortDir;
  onClick: (f: SortField) => void;
}) {
  return (
    <th>
      <ThBtnInner {...props} />
    </th>
  );
}
