"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, Star, Reply, Forward, Trash2, Archive, X,
  Download, Paperclip, Inbox, Send as SendIcon, FileText,
  Plus, CheckCheck, RefreshCw, Mail, MailOpen, Users, Megaphone,
  MessageCircle, CornerUpLeft, Pencil, ChevronLeft, Tag,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Folder      = "inbox" | "starred" | "sent" | "drafts" | "archive" | "trash";
type Category    = "all" | "announcements" | "internal" | "parents";
type MessageType = "announcement" | "internal" | "parent";

interface Addr { name: string; email: string; }
interface Att  { name: string; size: string; ext: string; }

interface Email {
  id: string;
  type: MessageType;
  folder: Folder;
  from: Addr;
  to: Addr[];
  cc?: Addr[];
  subject: string;
  preview: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  attachments: Att[];
  labels: string[];
  replies?: { from: Addr; date: string; body: string }[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ME: Addr = { name: "Teacher Clay", email: "t.clay@studybuddy.edu" };

const EMAILS: Email[] = [
  {
    id: "e1", type: "announcement", folder: "inbox",
    from: { name: "Principal Anderson", email: "principal@studybuddy.edu" },
    to: [ME],
    subject: "Staff Meeting — Thursday April 3rd at 3:00 PM",
    preview: "All faculty are required to attend the quarterly staff meeting this Thursday in the Main Hall.",
    body: `Dear Faculty,

Please be advised that our quarterly staff meeting is scheduled for:

    Date:   Thursday, April 3rd, 2026
    Time:   3:00 PM – 4:30 PM
    Venue:  Main Hall, Building A

Agenda items include:
    1. Academic progress review (Q3 results)
    2. Upcoming standardized testing schedule
    3. Professional development opportunities
    4. Extracurricular program updates
    5. Open floor for faculty concerns

Attendance is mandatory. If you have a scheduling conflict, please notify the main office by end of day Wednesday.

Refreshments will be provided.

Warm regards,
Mrs. Anderson
Principal, StudyBuddy Academy`,
    date: "2026-04-02T09:30:00",
    isRead: false, isStarred: true,
    attachments: [{ name: "Staff_Meeting_Agenda_Q3.pdf", size: "214 KB", ext: "PDF" }],
    labels: ["Important", "Staff"],
  },
  {
    id: "e2", type: "parent", folder: "inbox",
    from: { name: "Elena Santos", email: "elena.santos@gmail.com" },
    to: [ME],
    subject: "Re: Maria's grade on the Quadratic Equations Quiz",
    preview: "Good morning, I am writing to ask about Maria's grade. She mentioned she was confused about a few problems.",
    body: `Good morning, Teacher Clay,

I hope this message finds you well. I am writing to ask about Maria's grade on the Quadratic Equations Quiz she took last week.

Maria mentioned she was confused about problems involving the quadratic formula, and I wanted to understand if she needs additional support before the next exam.

Could you let me know:

    1. Which specific areas she struggled with?
    2. Are there any practice resources you would recommend?
    3. Is there an opportunity for extra help sessions?

I appreciate your dedication to your students. Maria speaks very highly of your class.

Thank you for your time.

Sincerely,
Elena Santos
Parent of Maria Santos — Mathematics 9, Section A`,
    date: "2026-04-02T08:15:00",
    isRead: false, isStarred: false,
    attachments: [],
    labels: ["Grade Inquiry"],
    replies: [
      {
        from: ME,
        date: "2026-04-02T10:45:00",
        body: `Dear Mrs. Santos,

Thank you for reaching out. Maria is a wonderful student and I'm happy to help.

She did well overall on the quiz, but had some difficulty with problems that required completing the square. I will send home a practice sheet this week.

I also hold office hours every Tuesday and Thursday from 3–4 PM in Room 201. Maria is welcome to come in for extra help.

Best regards,
Teacher Clay
Mathematics 9 — StudyBuddy Academy`,
      },
    ],
  },
  {
    id: "e3", type: "internal", folder: "inbox",
    from: { name: "Mrs. Ramirez", email: "g.ramirez@studybuddy.edu" },
    to: [ME],
    cc: [{ name: "Mr. Dela Cruz (Dept. Head)", email: "dept.head@studybuddy.edu" }],
    subject: "Follow-up: Carlo Mendoza — Academic Support Plan",
    preview: "Following our discussion last week, I've attached Carlo's updated academic support plan for your review and signature.",
    body: `Hi Teacher Clay,

Following our discussion last week regarding Carlo Mendoza's academic standing, I've drafted an updated Academic Support Plan for your review and signature.

Summary of the plan:

    • Weekly check-ins with the guidance office (Tuesdays, 12:30 PM)
    • Mandatory attendance at Tuesday/Thursday tutoring sessions
    • Grade progress report sent to parents every two weeks
    • Counselor review at end of Q4

Please review the attached document and let me know if you'd like to make any modifications before we share it with Carlo's parents.

I'll need your signature by Friday, April 4th.

Thank you,
Mrs. Ramirez
Guidance Counselor — StudyBuddy Academy`,
    date: "2026-04-01T14:00:00",
    isRead: true, isStarred: false,
    attachments: [
      { name: "Carlo_Mendoza_Support_Plan.pdf", size: "380 KB", ext: "PDF" },
      { name: "Grade_History_Q1-Q3.xlsx",       size: "92 KB",  ext: "XLS" },
    ],
    labels: ["Action Required", "At-Risk"],
  },
  {
    id: "e4", type: "parent", folder: "inbox",
    from: { name: "Roberto Reyes", email: "roberto.reyes@gmail.com" },
    to: [ME],
    subject: "Juan absent tomorrow — doctor's appointment",
    preview: "Good afternoon, I wanted to let you know that Juan will be absent tomorrow due to a scheduled doctor's appointment.",
    body: `Good afternoon, Teacher Clay,

I wanted to let you know that Juan will be absent tomorrow, Thursday April 3rd, due to a doctor's appointment that was scheduled several weeks ago.

I will send a formal absence letter to the main office in the morning.

Could you please let us know if there are any assignments or class activities Juan will miss so he can make them up promptly? He is very committed to keeping up with his work.

Thank you very much.

Respectfully,
Roberto Reyes
Father of Juan Reyes — Mathematics 9, Section A`,
    date: "2026-04-01T16:30:00",
    isRead: true, isStarred: false,
    attachments: [],
    labels: ["Absence Notice"],
  },
  {
    id: "e5", type: "announcement", folder: "inbox",
    from: { name: "IT Department", email: "it@studybuddy.edu" },
    to: [{ name: "All Staff", email: "staff@studybuddy.edu" }],
    subject: "Scheduled Maintenance — Sunday April 6th, 12:00 AM–4:00 AM",
    preview: "StudyBuddy will undergo scheduled maintenance this Sunday. All services will be unavailable during this window.",
    body: `Dear Users,

StudyBuddy will undergo scheduled system maintenance on:

    Date:   Sunday, April 6th, 2026
    Time:   12:00 AM – 4:00 AM (Philippine Standard Time)

During this window, ALL services will be temporarily unavailable, including grade submissions, student messaging, assignment uploads, and quiz tools.

We recommend saving any open work before midnight on Saturday.

If you experience any issues after maintenance is complete, please contact it@studybuddy.edu.

Thank you for your patience.

StudyBuddy IT Team`,
    date: "2026-03-31T10:00:00",
    isRead: true, isStarred: false,
    attachments: [],
    labels: ["System Notice"],
  },
  {
    id: "e6", type: "internal", folder: "sent",
    from: ME,
    to: [{ name: "Fernando Mendoza", email: "fernando.mendoza@gmail.com" }],
    subject: "Carlo Mendoza — Academic Standing Update",
    preview: "Dear Mr. Mendoza, I'm writing to discuss Carlo's current academic standing and outline the steps we are taking to support him.",
    body: `Dear Mr. Mendoza,

I'm writing to discuss Carlo's current academic standing in Mathematics 9.

Carlo's current grade is 66%, which is below our passing threshold of 70%. He has missed several key assignments and has been struggling with recent quiz material.

I want to assure you that we are actively working to support Carlo:

    • He has been enrolled in Tuesday/Thursday tutoring
    • He is now working with our guidance counselor, Mrs. Ramirez
    • A tailored Academic Support Plan has been prepared (attached)

I would welcome the opportunity to schedule a brief call this week to discuss next steps together. Please let me know your availability.

Best regards,
Teacher Clay
Mathematics 9 — StudyBuddy Academy`,
    date: "2026-03-30T11:30:00",
    isRead: true, isStarred: false,
    attachments: [{ name: "Carlo_Mendoza_Support_Plan.pdf", size: "380 KB", ext: "PDF" }],
    labels: ["At-Risk"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtListDate(iso: string) {
  const d    = new Date(iso);
  const day0 = new Date(); day0.setHours(0,0,0,0);
  const dDay = new Date(d); dDay.setHours(0,0,0,0);
  const diff = Math.round((day0.getTime() - dDay.getTime()) / 86400000);
  if (diff === 0) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (diff === 1) return "Yesterday";
  if (diff < 7)  return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function fmtFullDate(iso: string) {
  return new Date(iso).toLocaleString([], {
    weekday: "long", month: "long", day: "numeric",
    year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

const EXT_COLOR: Record<string, string> = {
  PDF: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  XLS: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  DOC: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
};

const TYPE_PILL: Record<MessageType, { label: string; cls: string; icon: React.ElementType }> = {
  announcement: { label: "Announcement",    cls: "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",     icon: Megaphone },
  internal:     { label: "Internal",         cls: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400", icon: Users },
  parent:       { label: "Parent / Student", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400", icon: MessageCircle },
};

const AVATAR_COLOR: Record<MessageType, string> = {
  announcement: "#1e3a8a",
  internal:     "#7c3aed",
  parent:       "#059669",
};

function initials(name: string) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Compose ──────────────────────────────────────────────────────────────────

function ComposeWindow({ onClose }: { onClose: () => void }) {
  const [to, setTo]         = useState("");
  const [subj, setSubj]     = useState("");
  const [body, setBody]     = useState("");
  const [sent, setSent]     = useState(false);

  return (
    <div className="fixed bottom-0 right-6 z-50 w-[520px] max-w-[calc(100vw-2rem)] shadow-2xl rounded-t-2xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1e3a8a]">
        <span className="text-sm font-semibold text-white flex items-center gap-2">
          <Pencil className="w-3.5 h-3.5" /> New Message
        </span>
        <button type="button" onClick={onClose} className="p-1 rounded text-white/70 hover:text-white hover:bg-white/20 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {sent ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 px-6">
          <CheckCheck className="w-10 h-10 text-emerald-500" />
          <p className="font-bold text-gray-900 dark:text-white">Message sent</p>
          <button type="button" onClick={onClose} className="rounded-xl bg-[#1e3a8a] px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">Done</button>
        </div>
      ) : (
        <>
          {/* To / Subject fields */}
          <div className="divide-y divide-gray-100 dark:divide-slate-800 border-b border-gray-100 dark:border-slate-800">
            {[
              { label: "To",      value: to,   set: setTo,   ph: "Recipients…" },
              { label: "Subject", value: subj, set: setSubj, ph: "Subject…" },
            ].map(({ label, value, set, ph }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-2.5">
                <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 w-14 shrink-0 uppercase tracking-wide">{label}</span>
                <input type="text" value={value} onChange={e => set(e.target.value)} placeholder={ph}
                  className="flex-1 text-sm text-gray-900 dark:text-white bg-transparent outline-none placeholder-gray-400 dark:placeholder-slate-600" />
              </div>
            ))}
          </div>

          {/* Body */}
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={9}
            placeholder={`Compose your message…\n\nBest regards,\n${ME.name}`}
            className="w-full px-4 py-3 text-sm text-gray-800 dark:text-gray-200 bg-transparent outline-none resize-none placeholder-gray-400 dark:placeholder-slate-600" />

          {/* Toolbar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
            <button type="button" onClick={() => { if (to && subj && body) setSent(true); }}
              disabled={!to.trim() || !subj.trim() || !body.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1e3a8a] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
              <SendIcon className="w-3.5 h-3.5" /> Send
            </button>
            <button type="button" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" title="Attach">
              <Paperclip className="w-4 h-4" />
            </button>
            <button type="button" onClick={onClose} className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors" title="Discard">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Inline reply ─────────────────────────────────────────────────────────────

function ReplyArea({ to, onSend, onCancel }: { to: string; onSend: () => void; onCancel: () => void }) {
  const [body, setBody] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div className="rounded-xl border border-gray-300 dark:border-slate-600 overflow-hidden shadow-sm bg-white dark:bg-slate-900 mt-4">
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <CornerUpLeft className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">Reply to</span>
        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{to}</span>
      </div>
      <textarea ref={ref} value={body} onChange={e => setBody(e.target.value)} rows={6}
        placeholder={`Write your reply…\n\nBest regards,\n${ME.name}`}
        className="w-full px-4 py-3 text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-900 outline-none resize-none placeholder-gray-400 dark:placeholder-slate-600" />
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
        <button type="button" onClick={() => { if (body.trim()) onSend(); }}
          disabled={!body.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1e3a8a] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
          <SendIcon className="w-3.5 h-3.5" /> Send Reply
        </button>
        <button type="button" className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          <Paperclip className="w-4 h-4" />
        </button>
        <button type="button" onClick={onCancel} className="ml-auto text-xs font-medium text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Folders ──────────────────────────────────────────────────────────────────

const FOLDERS: { id: Folder; label: string; icon: React.ElementType }[] = [
  { id: "inbox",   label: "Inbox",   icon: Inbox    },
  { id: "starred", label: "Starred", icon: Star     },
  { id: "sent",    label: "Sent",    icon: SendIcon },
  { id: "drafts",  label: "Drafts",  icon: FileText },
  { id: "archive", label: "Archive", icon: Archive  },
  { id: "trash",   label: "Trash",   icon: Trash2   },
];

const CATS: { id: Category; label: string; icon: React.ElementType }[] = [
  { id: "all",           label: "All Mail",      icon: Mail         },
  { id: "announcements", label: "Announcements", icon: Megaphone    },
  { id: "internal",      label: "Internal",      icon: Users        },
  { id: "parents",       label: "Parents",       icon: MessageCircle},
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const [folder,     setFolder]     = useState<Folder>("inbox");
  const [category,   setCategory]   = useState<Category>("all");
  const [search,     setSearch]     = useState("");
  const [selId,      setSelId]      = useState<string | null>("e1");
  const [read,       setRead]       = useState<Record<string,boolean>>(Object.fromEntries(EMAILS.map(e => [e.id, e.isRead])));
  const [starred,    setStarred]    = useState<Record<string,boolean>>(Object.fromEntries(EMAILS.map(e => [e.id, e.isStarred])));
  const [archived,   setArchived]   = useState<Record<string,boolean>>({});
  const [trashed,    setTrashed]    = useState<Record<string,boolean>>({});
  const [mobilePane, setMobilePane] = useState<"list"|"read">("list");
  const [composing,  setComposing]  = useState(false);
  const [replying,   setReplying]   = useState(false);
  const [replySent,  setReplySent]  = useState(false);

  // Filtering
  const list = EMAILS.filter(e => {
    const inFolder =
      folder === "starred" ? starred[e.id] && !trashed[e.id] :
      folder === "trash"   ? !!trashed[e.id] :
      folder === "archive" ? !!archived[e.id] :
      !trashed[e.id] && !archived[e.id] && e.folder === folder;
    if (!inFolder) return false;
    const matchCat =
      category === "all"           ? true :
      category === "announcements" ? e.type === "announcement" :
      category === "internal"      ? e.type === "internal"     :
      category === "parents"       ? e.type === "parent"       : true;
    if (!matchCat) return false;
    const q = search.toLowerCase();
    return !q || e.subject.toLowerCase().includes(q) || e.from.name.toLowerCase().includes(q) || e.preview.toLowerCase().includes(q);
  });

  const unread  = EMAILS.filter(e => !read[e.id] && !trashed[e.id] && !archived[e.id] && e.folder === "inbox").length;
  const selEmail = EMAILS.find(e => e.id === selId) ?? null;

  const openEmail = (id: string) => {
    setSelId(id); setRead(r => ({ ...r, [id]: true }));
    setMobilePane("read"); setReplying(false); setReplySent(false);
  };

  const archive = (id: string) => { setArchived(a => ({ ...a, [id]: true })); if (selId === id) { setSelId(null); setMobilePane("list"); } };
  const trash   = (id: string) => { setTrashed(t  => ({ ...t,  [id]: true })); if (selId === id) { setSelId(null); setMobilePane("list"); } };

  return (
    /* Full-bleed: escape the MainContent padding so the email client fills the viewport */
    <div className="-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 xl:-mx-12 -mt-5 flex flex-col"
      style={{ height: "calc(100vh - 72px)" }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 border-b border-gray-200 dark:border-slate-800 shrink-0 bg-white dark:bg-black">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">{today}</p>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Inbox</h1>
            {unread > 0 && (
              <span className="text-xs font-bold bg-[#1e3a8a] text-white px-2 py-0.5 rounded-full">{unread} unread</span>
            )}
          </div>
        </div>
        <button type="button" onClick={() => setComposing(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors shrink-0">
          <Pencil className="w-4 h-4" /> Compose
        </button>
      </div>

      {/* ── Three-panel client ───────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 bg-white dark:bg-black">

        {/* ── Folder sidebar ────────────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-48 lg:w-52 shrink-0 border-r border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-950 overflow-y-auto">
          <div className="px-3 pt-4 pb-2">
            <button type="button" onClick={() => setComposing(true)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#1e3a8a] text-[#1e3a8a] dark:text-blue-400 dark:border-blue-500 px-3 py-2 text-sm font-bold hover:bg-[#1e3a8a] hover:text-white dark:hover:bg-blue-900/40 transition-colors">
              <Plus className="w-4 h-4" /> Compose
            </button>
          </div>

          <nav className="flex-1 px-2 py-1 space-y-0.5">
            {FOLDERS.map(({ id, label, icon: Icon }) => {
              const cnt = id === "inbox" ? unread : 0;
              const active = folder === id;
              return (
                <button key={id} type="button" onClick={() => setFolder(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                    active
                      ? "bg-[#1e3a8a] text-white font-semibold shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-slate-800 font-medium"
                  }`}>
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left">{label}</span>
                  {cnt > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-[#1e3a8a] text-white"}`}>{cnt}</span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 pb-1 px-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">Categories</p>
            </div>
            {CATS.map(({ id, label, icon: Icon }) => {
              const active = folder === "inbox" && category === id;
              return (
                <button key={id} type="button" onClick={() => { setFolder("inbox"); setCategory(id); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                    active
                      ? "bg-blue-50 dark:bg-blue-950/30 text-[#1e3a8a] dark:text-blue-400 font-bold"
                      : "text-gray-500 dark:text-slate-400 hover:bg-gray-200/60 dark:hover:bg-slate-800 font-medium"
                  }`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── Email list panel ──────────────────────────────────────────── */}
        <div className={`flex flex-col w-full md:w-[300px] lg:w-[340px] xl:w-[380px] shrink-0 border-r border-gray-100 dark:border-slate-800 overflow-hidden ${mobilePane === "read" ? "hidden md:flex" : "flex"}`}>
          {/* List toolbar */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search mail…"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm" />
              {search && <button type="button" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>}
            </div>
            <button type="button" className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>
          </div>

          {/* Count */}
          <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/40 dark:bg-slate-900/40 shrink-0">
            <p className="text-[11px] font-semibold text-gray-500 dark:text-slate-400">
              {list.length} {list.length === 1 ? "message" : "messages"}
            </p>
          </div>

          {/* Email rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800/60">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <MailOpen className="w-8 h-8 text-gray-300 dark:text-slate-600 mb-2" />
                <p className="text-sm text-gray-400 dark:text-slate-500">No messages</p>
              </div>
            ) : list.map(e => {
              const isActive = selId === e.id;
              const isUnread = !read[e.id];
              return (
                <button key={e.id} type="button" onClick={() => openEmail(e.id)}
                  className={`w-full text-left flex gap-3 px-4 py-3.5 transition-all relative border-l-[3px] ${
                    isActive
                      ? "bg-blue-50/80 dark:bg-blue-950/20 border-[#1e3a8a]"
                      : "hover:bg-gray-50 dark:hover:bg-slate-800/40 border-transparent"
                  }`}>
                  {/* Unread indicator */}
                  {isUnread && !isActive && (
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#1e3a8a]" />
                  )}

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: AVATAR_COLOR[e.type] }}>
                    {initials(e.from.name)}
                  </div>

                  {/* Content — email hierarchy: subject first */}
                  <div className="flex-1 min-w-0">
                    {/* Row 1: Subject + Date */}
                    <div className="flex items-baseline gap-2 justify-between mb-0.5">
                      <p className={`text-sm leading-snug truncate pr-1 ${isUnread ? "font-bold text-gray-900 dark:text-white" : "font-semibold text-gray-700 dark:text-gray-200"}`}>
                        {e.subject}
                      </p>
                      <span className="text-[10px] tabular-nums text-gray-400 dark:text-slate-500 shrink-0">{fmtListDate(e.date)}</span>
                    </div>
                    {/* Row 2: From */}
                    <p className={`text-xs mb-1 ${isUnread ? "font-semibold text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-slate-400"}`}>
                      {e.folder === "sent" ? `To: ${e.to[0]?.name}` : `From: ${e.from.name}`}
                    </p>
                    {/* Row 3: Preview */}
                    <p className="text-xs text-gray-400 dark:text-slate-500 line-clamp-1">{e.preview}</p>
                    {/* Row 4: Badges */}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${TYPE_PILL[e.type].cls}`}>
                        {TYPE_PILL[e.type].label}
                      </span>
                      {e.attachments.length > 0 && <Paperclip className="w-2.5 h-2.5 text-gray-400" />}
                      {starred[e.id]           && <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />}
                      {e.replies?.length       && <span className="text-[9px] text-gray-400 flex items-center gap-0.5"><CornerUpLeft className="w-2.5 h-2.5" />{e.replies.length}</span>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Reading pane ──────────────────────────────────────────────── */}
        <div className={`flex-1 min-w-0 flex flex-col overflow-hidden bg-white dark:bg-slate-950 ${mobilePane === "list" ? "hidden md:flex" : "flex"}`}>
          {selEmail ? (
            <>
              {/* Pane toolbar */}
              <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
                <button type="button" onClick={() => setMobilePane("list")} className="md:hidden p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 mr-1 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setReplying(r => !r)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  <Reply className="w-3.5 h-3.5" /> Reply
                </button>
                <button type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <Forward className="w-3.5 h-3.5" /> Forward
                </button>
                <div className="w-px h-4 bg-gray-200 dark:bg-slate-700 mx-0.5" />
                <button type="button" onClick={() => setStarred(s => ({ ...s, [selEmail.id]: !s[selEmail.id] }))} title="Star">
                  <Star className={`w-4 h-4 mx-1 ${starred[selEmail.id] ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-slate-600 hover:text-amber-400"} transition-colors`} />
                </button>
                <button type="button" onClick={() => setRead(r => ({ ...r, [selEmail.id]: !r[selEmail.id] }))} title="Toggle read">
                  {read[selEmail.id]
                    ? <MailOpen className="w-4 h-4 mx-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
                    : <Mail     className="w-4 h-4 mx-1 text-blue-500 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />}
                </button>
                <div className="ml-auto flex items-center gap-1">
                  <button type="button" onClick={() => archive(selEmail.id)} title="Archive"
                    className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                    <Archive className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => trash(selEmail.id)} title="Delete"
                    className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Email document */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

                  {/* Subject */}
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
                    {selEmail.subject}
                  </h1>

                  {/* Formal email header card */}
                  <div className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden text-sm">
                    {/* From */}
                    <div className="flex items-start gap-4 px-5 py-3 bg-gray-50/80 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-700/60">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ backgroundColor: AVATAR_COLOR[selEmail.type] }}>
                        {initials(selEmail.from.name)}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900 dark:text-white">{selEmail.from.name}</span>
                          <span className="text-gray-400 dark:text-slate-500 text-xs">&lt;{selEmail.from.email}&gt;</span>
                          <span className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${TYPE_PILL[selEmail.type].cls}`}>
                            {TYPE_PILL[selEmail.type].label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{fmtFullDate(selEmail.date)}</p>
                      </div>
                    </div>

                    {/* To / CC */}
                    {[
                      { label: "To", addrs: selEmail.to },
                      ...(selEmail.cc?.length ? [{ label: "CC", addrs: selEmail.cc }] : []),
                    ].map(({ label, addrs }) => (
                      <div key={label} className="flex items-start gap-3 px-5 py-2.5 border-b border-gray-100 dark:border-slate-700/60 last:border-0">
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 w-7 shrink-0 pt-0.5">{label}</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                          {addrs.map(a => (
                            <span key={a.email} className="text-gray-700 dark:text-gray-300">
                              <span className="font-medium">{a.name}</span>
                              <span className="text-gray-400 dark:text-slate-500 text-xs ml-1">&lt;{a.email}&gt;</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Labels */}
                  {selEmail.labels.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      {selEmail.labels.map(l => (
                        <span key={l} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700">{l}</span>
                      ))}
                    </div>
                  )}

                  {/* Email body — document style */}
                  <div className="text-sm leading-7 text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-[inherit]">
                    {selEmail.body}
                  </div>

                  {/* Attachments */}
                  {selEmail.attachments.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5" /> {selEmail.attachments.length} Attachment{selEmail.attachments.length > 1 ? "s" : ""}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selEmail.attachments.map((att, i) => (
                          <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${EXT_COLOR[att.ext] ?? "bg-gray-100 text-gray-600"}`}>
                              {att.ext}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{att.name}</p>
                              <p className="text-xs text-gray-400 dark:text-slate-500">{att.size}</p>
                            </div>
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-[#1e3a8a] dark:group-hover:text-blue-400 ml-2 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Thread: prior replies */}
                  {selEmail.replies && selEmail.replies.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 dark:border-slate-800 space-y-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Thread history</p>
                      {selEmail.replies.map((r, i) => (
                        <div key={i} className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                          <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                            <div className="w-7 h-7 rounded-full bg-[#1e3a8a] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {initials(r.from.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-gray-900 dark:text-white">{r.from.name}</span>
                              <span className="text-xs text-gray-400 dark:text-slate-500 ml-2">&lt;{r.from.email}&gt;</span>
                            </div>
                            <span className="text-[10px] text-gray-400 shrink-0">{fmtFullDate(r.date)}</span>
                          </div>
                          <div className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed bg-white dark:bg-slate-900">
                            {r.body}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply sent confirmation */}
                  {replySent && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                      <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Reply sent to {selEmail.from.name}</p>
                    </div>
                  )}

                  {/* Inline reply */}
                  {replying && (
                    <ReplyArea
                      to={`${selEmail.from.name} <${selEmail.from.email}>`}
                      onSend={() => { setReplying(false); setReplySent(true); }}
                      onCancel={() => setReplying(false)}
                    />
                  )}
                </div>
              </div>

              {/* Bottom bar */}
              {!replying && (
                <div className="shrink-0 flex items-center gap-2 px-5 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                  <button type="button" onClick={() => setReplying(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors">
                    <Reply className="w-4 h-4" /> Reply
                  </button>
                  <button type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <Forward className="w-4 h-4" /> Forward
                  </button>
                  <div className="ml-auto flex items-center gap-2">
                    <button type="button" onClick={() => archive(selEmail.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <Archive className="w-4 h-4" /> Archive
                    </button>
                    <button type="button" onClick={() => trash(selEmail.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-100 dark:border-red-900/50 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center px-8 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#1e3a8a]/10 dark:bg-blue-950/30 flex items-center justify-center">
                <Mail className="w-8 h-8 text-[#1e3a8a] dark:text-blue-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-gray-700 dark:text-gray-300">No message selected</p>
                <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">Select a message from the list to read it</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Compose window (Gmail-style bottom-right popup) ──────────────── */}
      {composing && <ComposeWindow onClose={() => setComposing(false)} />}
    </div>
  );
}
