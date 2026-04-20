"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ClipboardList, CheckCircle2, Clock, AlertCircle, X, FileText, Pen, Download } from "lucide-react";

const STUDENTS = [
  { id: "1", name: "Alex Johnson", grade: "5th Grade" },
  { id: "2", name: "Emma Johnson", grade: "3rd Grade" },
];

type FormStatus = "pending" | "signed" | "expired";

interface StudentForm {
  id: string;
  title: string;
  description: string;
  category: string;
  issuedDate: string;
  dueDate: string;
  status: FormStatus;
  signedDate?: string;
  pdfFile: string;
  info: { label: string; value: string }[];
}

const ALEX_FORMS: StudentForm[] = [
  {
    id: "af1",
    title: "Spring Soccer Permission Slip",
    description: "Permission for interscholastic spring soccer season",
    category: "Athletics",
    issuedDate: "Mar 25, 2026",
    dueDate: "Apr 10, 2026",
    status: "pending",
    pdfFile: "Spring_Soccer_Permission_2026.pdf",
    info: [
      { label: "Program", value: "Spring 2026 Interscholastic Soccer" },
      { label: "Schedule", value: "Mon/Wed/Fri 3:30–5:00 PM" },
      { label: "Transportation", value: "School bus for away games" },
      { label: "Issued by", value: "Athletic Department" },
    ],
  },
  {
    id: "af2",
    title: "Science Museum Field Trip",
    description: "Day trip to City Science Museum on April 18",
    category: "Field Trip",
    issuedDate: "Mar 20, 2026",
    dueDate: "Apr 14, 2026",
    status: "pending",
    pdfFile: "Science_Museum_Trip_Apr2026.pdf",
    info: [
      { label: "Destination", value: "City Science Museum" },
      { label: "Date", value: "April 18, 2026" },
      { label: "Departure", value: "8:30 AM — Return by 2:45 PM" },
      { label: "Cost", value: "$12.00 (admission + bus)" },
      { label: "Issued by", value: "Ms. Rivera, 5th Grade" },
    ],
  },
  {
    id: "af3",
    title: "Annual Health Screening Consent",
    description: "Consent for vision, hearing, and BMI screening",
    category: "Medical",
    issuedDate: "Feb 15, 2026",
    dueDate: "Mar 1, 2026",
    status: "signed",
    signedDate: "Feb 22, 2026",
    pdfFile: "Health_Screening_Consent_2026.pdf",
    info: [
      { label: "Screenings", value: "Vision, hearing, and BMI" },
      { label: "Conducted by", value: "School Nurse" },
      { label: "Cost", value: "Free" },
      { label: "Issued by", value: "Health Services" },
    ],
  },
  {
    id: "af4",
    title: "Technology Acceptable Use Policy",
    description: "Agreement for student device and internet usage",
    category: "Policy",
    issuedDate: "Sep 5, 2025",
    dueDate: "Sep 20, 2025",
    status: "signed",
    signedDate: "Sep 8, 2025",
    pdfFile: "Tech_AUP_2025-2026.pdf",
    info: [
      { label: "Covers", value: "Chromebooks, internet, educational software" },
      { label: "School year", value: "2025–2026" },
      { label: "Issued by", value: "IT Department" },
    ],
  },
  {
    id: "af5",
    title: "Winter Band Concert Photo Release",
    description: "Photo/video release for December concert",
    category: "Media Release",
    issuedDate: "Nov 10, 2025",
    dueDate: "Dec 1, 2025",
    status: "expired",
    pdfFile: "Band_Concert_Photo_Release_Dec2025.pdf",
    info: [
      { label: "Event", value: "Winter Band Concert — Dec 12, 2025" },
      { label: "Usage", value: "School newsletter, website, social media" },
      { label: "Issued by", value: "Music Department" },
    ],
  },
];

const EMMA_FORMS: StudentForm[] = [
  {
    id: "ef1",
    title: "Zoo Field Trip Permission",
    description: "Day trip to Riverside Zoo on April 22",
    category: "Field Trip",
    issuedDate: "Mar 28, 2026",
    dueDate: "Apr 18, 2026",
    status: "pending",
    pdfFile: "Zoo_Field_Trip_Apr2026.pdf",
    info: [
      { label: "Destination", value: "Riverside Zoo" },
      { label: "Date", value: "April 22, 2026" },
      { label: "Departure", value: "9:00 AM — Return by 2:30 PM" },
      { label: "Cost", value: "$8.00 per student" },
      { label: "Issued by", value: "Mrs. Chen, 3rd Grade" },
    ],
  },
  {
    id: "ef2",
    title: "Spring Art Show Display Permission",
    description: "Permission to display student artwork at Spring Art Show",
    category: "Media Release",
    issuedDate: "Mar 15, 2026",
    dueDate: "Apr 5, 2026",
    status: "pending",
    pdfFile: "Art_Show_Display_Permission_2026.pdf",
    info: [
      { label: "Event", value: "Spring Art Show — April 25, 2026" },
      { label: "Location", value: "School Gymnasium" },
      { label: "Display", value: "First name and grade shown" },
      { label: "Issued by", value: "Art Department" },
    ],
  },
  {
    id: "ef3",
    title: "Annual Health Screening Consent",
    description: "Consent for vision, hearing, and BMI screening",
    category: "Medical",
    issuedDate: "Feb 15, 2026",
    dueDate: "Mar 1, 2026",
    status: "signed",
    signedDate: "Feb 18, 2026",
    pdfFile: "Health_Screening_Consent_2026.pdf",
    info: [
      { label: "Screenings", value: "Vision, hearing, and BMI" },
      { label: "Conducted by", value: "School Nurse" },
      { label: "Issued by", value: "Health Services" },
    ],
  },
  {
    id: "ef4",
    title: "Technology Acceptable Use Policy",
    description: "Agreement for student device and internet usage",
    category: "Policy",
    issuedDate: "Sep 5, 2025",
    dueDate: "Sep 20, 2025",
    status: "signed",
    signedDate: "Sep 10, 2025",
    pdfFile: "Tech_AUP_2025-2026.pdf",
    info: [
      { label: "Covers", value: "Chromebooks, internet, educational software" },
      { label: "School year", value: "2025–2026" },
      { label: "Issued by", value: "IT Department" },
    ],
  },
];

const FORM_DATA: Record<string, StudentForm[]> = {
  "1": ALEX_FORMS,
  "2": EMMA_FORMS,
};

const STATUS_CONFIG: Record<FormStatus, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending: { label: "Needs Signature", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30" },
  signed: { label: "Signed", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  expired: { label: "Expired", icon: AlertCircle, color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-100 dark:bg-slate-800" },
};

type FilterType = "all" | FormStatus;

export default function StudentFormsPage() {
  const selectedStudent = STUDENTS[0];
  const [filter, setFilter] = useState<FilterType>("all");
  const [openForm, setOpenForm] = useState<StudentForm | null>(null);
  const [signing, setSigning] = useState(false);
  const [signedForms, setSignedForms] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const allForms = (FORM_DATA[selectedStudent.id] ?? []).map(f =>
    signedForms.has(f.id) ? { ...f, status: "signed" as FormStatus, signedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) } : f
  );
  const forms = filter === "all" ? allForms : allForms.filter(f => f.status === filter);

  const pendingCount = allForms.filter(f => f.status === "pending").length;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    isDrawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const isCanvasEmpty = (): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    const ctx = canvas.getContext("2d");
    if (!ctx) return true;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return !data.some((v, i) => i % 4 === 3 && v > 0);
  };

  const handleSign = () => {
    if (!openForm || isCanvasEmpty()) return;
    setSignedForms(prev => new Set(prev).add(openForm.id));
    setSigning(false);
    setOpenForm(null);
  };

  const openFormModal = (form: StudentForm) => {
    setOpenForm(form);
    setSigning(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-orange-50 dark:bg-orange-950/40">
            <ClipboardList className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Student Forms</h1>
        </div>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-sm font-semibold">
            <Clock className="w-3.5 h-3.5" />
            {pendingCount} awaiting signature
          </span>
        )}
      </div>

      {/* Status filters */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {([
          { key: "all" as FilterType, label: `All (${allForms.length})` },
          { key: "pending" as FilterType, label: `Pending (${allForms.filter(f => f.status === "pending").length})` },
          { key: "signed" as FilterType, label: `Signed (${allForms.filter(f => f.status === "signed").length})` },
          { key: "expired" as FilterType, label: `Expired (${allForms.filter(f => f.status === "expired").length})` },
        ]).filter(t => {
          if (t.key === "all") return true;
          return allForms.some(f => f.status === t.key);
        }).map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === t.key
                ? "bg-[#1e3a8a] text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Forms list */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-slate-800">
        {forms.map((f) => {
          const statusCfg = STATUS_CONFIG[f.status];
          const StatusIcon = statusCfg.icon;
          return (
            <button
              key={f.id}
              onClick={() => openFormModal(f)}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${f.status === "pending" ? "bg-amber-50 dark:bg-amber-950/30" : "bg-gray-50 dark:bg-slate-800"}`}>
                <FileText className={`w-4 h-4 ${f.status === "pending" ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-gray-500"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{f.title}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">{f.category}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{f.description}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${statusCfg.bg} ${statusCfg.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusCfg.label}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 w-20 text-right">
                  {f.status === "signed" ? `Signed ${f.signedDate}` : `Due ${f.dueDate}`}
                </span>
              </div>
            </button>
          );
        })}

        {forms.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No forms in this category</p>
          </div>
        )}
      </div>

      {/* Form detail / signing modal */}
      {openForm && createPortal(
        (() => {
          const currentForm = allForms.find(f => f.id === openForm.id) ?? openForm;
          const statusCfg = STATUS_CONFIG[currentForm.status];
          const StatusIcon = statusCfg.icon;
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/40" onClick={() => { setOpenForm(null); setSigning(false); }} />
              <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden max-h-[85vh] flex flex-col">
                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30 flex-shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{currentForm.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{currentForm.category} · Issued {currentForm.issuedDate}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setOpenForm(null); setSigning(false); }}
                    className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Modal body */}
                <div className="px-6 py-5 overflow-y-auto flex-1">
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${statusCfg.bg} ${statusCfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusCfg.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {currentForm.status === "signed" ? `Signed ${currentForm.signedDate}` : `Due by ${currentForm.dueDate}`}
                    </span>
                  </div>

                  {/* Form information */}
                  <div className="space-y-2.5 mb-5">
                    {currentForm.info.map((row, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 w-24 flex-shrink-0 pt-0.5 uppercase tracking-wide">{row.label}</span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* PDF download */}
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 mb-5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{currentForm.pdfFile}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">PDF Document · Click to download</p>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  </button>

                  {/* Signature area */}
                  {currentForm.status === "pending" && !signing && (
                    <button
                      onClick={() => setSigning(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1e3a8a] text-white text-sm font-semibold hover:bg-[#162d6e] transition-colors"
                    >
                      <Pen className="w-4 h-4" />
                      Sign This Form
                    </button>
                  )}

                  {currentForm.status === "pending" && signing && (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Draw your e-signature below</p>
                      <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                        <canvas
                          ref={canvasRef}
                          width={480}
                          height={120}
                          className="w-full cursor-crosshair"
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleSign}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1e3a8a] text-white text-sm font-semibold hover:bg-[#162d6e] transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Sign & Submit
                        </button>
                        <button
                          onClick={clearSignature}
                          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
                        Your signature will be applied to {currentForm.pdfFile} on behalf of {selectedStudent.name}.
                      </p>
                    </div>
                  )}

                  {currentForm.status === "signed" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          Signed on {currentForm.signedDate}
                        </p>
                      </div>
                      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <Download className="w-4 h-4" />
                        Download Signed Copy
                      </button>
                    </div>
                  )}

                  {currentForm.status === "expired" && (
                    <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                      <AlertCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        This form has expired. Contact the school if you still need to sign it.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}
    </div>
  );
}
