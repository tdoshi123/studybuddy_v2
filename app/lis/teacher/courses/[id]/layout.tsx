"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  Home, FileText, HelpCircle, BookOpen, MessageCircle,
  Megaphone, BarChart3, Users, MapPin, Clock, ChevronRight,
  Camera, Check, X, ImageIcon, Link as LinkIcon,
} from "lucide-react";
import { getClassById } from "@/data/teacher-mock-data";
import { cn } from "@/lib/utils";

const PRIMARY_NAV = [
  { label: "Home",          icon: Home,          segment: "" },
  { label: "Assignments",   icon: FileText,      segment: "assignments" },
  { label: "Quizzes",       icon: HelpCircle,    segment: "quizzes" },
  { label: "Exams",         icon: BookOpen,      segment: "exams" },
  { label: "Discussions",   icon: MessageCircle, segment: "discussions" },
  { label: "Announcements", icon: Megaphone,     segment: "announcements" },
  { label: "Grades",        icon: BarChart3,     segment: "grades" },
  { label: "Students",      icon: Users,         segment: "students" },
];

/* ── Preset cover images (subject-appropriate) ───────────────────────────── */
const PRESET_COVERS = [
  { label: "Equations",    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=400&fit=crop&q=80" },
  { label: "Geometry",     url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=400&fit=crop&q=80" },
  { label: "Algebra",      url: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=1200&h=400&fit=crop&q=80" },
  { label: "Chalkboard",   url: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?w=1200&h=400&fit=crop&q=80" },
  { label: "Science",      url: "https://images.unsplash.com/photo-1532094349884-543559059dfe?w=1200&h=400&fit=crop&q=80" },
  { label: "Library",      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop&q=80" },
  { label: "Notebook",     url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=400&fit=crop&q=80" },
  { label: "Classroom",    url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=400&fit=crop&q=80" },
];

/* ── Cover Picker Modal ──────────────────────────────────────────────────── */
function CoverPickerModal({
  current,
  onSelect,
  onClose,
}: {
  current: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"presets" | "url">("presets");
  const [customUrl, setCustomUrl] = useState("");
  const [preview, setPreview] = useState(current);

  function handleApply() {
    const url = tab === "url" ? customUrl.trim() : preview;
    if (url) { onSelect(url); onClose(); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-slate-700 overflow-hidden">

        {/* Preview strip */}
        <div className="relative h-32 w-full overflow-hidden">
          <Image src={preview} alt="Preview" fill className="object-cover" sizes="512px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-3 left-4 text-white text-xs font-semibold opacity-70">Preview</p>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Change Cover Photo</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-4">
          {(["presets", "url"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                tab === t
                  ? "bg-[#1e3a8a] text-white"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
              )}
            >
              {t === "presets" ? <ImageIcon className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
              {t === "presets" ? "Photo Library" : "Custom URL"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {tab === "presets" && (
            <div className="grid grid-cols-4 gap-2">
              {PRESET_COVERS.map((img) => (
                <button
                  key={img.url}
                  onClick={() => setPreview(img.url)}
                  className={cn(
                    "relative h-16 rounded-xl overflow-hidden border-2 transition-all",
                    preview === img.url
                      ? "border-[#1e3a8a] ring-2 ring-[#1e3a8a]/30"
                      : "border-transparent hover:border-gray-300 dark:hover:border-slate-600"
                  )}
                >
                  <Image src={img.url} alt={img.label} fill className="object-cover" sizes="96px" />
                  {preview === img.url && (
                    <div className="absolute inset-0 bg-[#1e3a8a]/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  )}
                  <p className="absolute bottom-0 left-0 right-0 text-[9px] text-white font-semibold text-center py-0.5 bg-black/40">{img.label}</p>
                </button>
              ))}
            </div>
          )}

          {tab === "url" && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 dark:text-slate-400">Paste any direct image URL (.jpg, .png, .webp)</p>
              <input
                type="url"
                placeholder="https://example.com/my-cover.jpg"
                value={customUrl}
                onChange={(e) => { setCustomUrl(e.target.value); if (e.target.value) setPreview(e.target.value); }}
                className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-xl bg-[#1e3a8a] hover:bg-[#162554] text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Apply Cover
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Layout ──────────────────────────────────────────────────────────────── */
export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const params   = useParams();
  const id       = params.id as string;
  const course   = getClassById(id);
  const pathname = usePathname();
  const basePath = `/lis/teacher/courses/${id}`;

  const storageKey = `teacher-course-cover-${id}`;
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [headerHover, setHeaderHover] = useState(false);

  /* Load persisted cover on mount */
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    setCoverUrl(saved ?? (course?.image ?? ""));
  }, [storageKey, course?.image]);

  function handleSelectCover(url: string) {
    setCoverUrl(url);
    localStorage.setItem(storageKey, url);
  }

  if (!course) return <div className="p-8 text-gray-500">Course not found.</div>;

  const isActive = (segment: string) =>
    segment === "" ? pathname === basePath : pathname.startsWith(`${basePath}/${segment}`);

  const activeNav = PRIMARY_NAV.find((n) => isActive(n.segment));
  const pageLabel = activeNav?.label ?? "";

  return (
    <div>
      {/* ── Course banner ──────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl group/header cursor-default"
        style={{ minHeight: 180 }}
        onMouseEnter={() => setHeaderHover(true)}
        onMouseLeave={() => setHeaderHover(false)}
      >
        {/* Cover image */}
        {coverUrl && (
          <Image
            key={coverUrl}
            src={coverUrl}
            alt={course.name}
            fill
            className="object-cover transition-transform duration-700 group-hover/header:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 900px"
            priority
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

        {/* Color accent bottom stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: course.color }} />

        {/* Change cover button */}
        <button
          onClick={() => setPickerOpen(true)}
          className={cn(
            "absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white text-xs font-semibold border border-white/20 transition-all duration-200",
            headerHover ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          )}
        >
          <Camera className="w-3.5 h-3.5" /> Change Cover
        </button>

        {/* Content */}
        <div className="relative px-6 py-6 sm:px-8 sm:py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] text-white/60 mb-4 font-medium">
            <Link href="/lis/teacher/courses" className="hover:text-white/90 transition-colors">
              My Courses
            </Link>
            <ChevronRight className="w-3 h-3 opacity-60" />
            <span className="text-white/90">{course.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              {/* Grade badge */}
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold tracking-wide border border-white/20 mb-3">
                {course.gradeLevel}
              </span>

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
                {course.name}
              </h1>
              <p className="mt-1 text-sm text-white/80 font-medium">{course.section}</p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-white/70 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3 h-3" /> {course.room}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/70 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                  <Clock className="w-3 h-3" /> {course.schedule}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-white/70 bg-black/20 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                  <Users className="w-3 h-3" /> {course.studentCount} students
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab navigation ─────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-10 xl:-mx-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        <div className="flex items-center overflow-x-auto hide-scrollbar">
          {PRIMARY_NAV.map(({ label, icon: Icon, segment }) => {
            const active = isActive(segment);
            return (
              <Link
                key={segment}
                href={segment === "" ? basePath : `${basePath}/${segment}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px flex-shrink-0",
                  active
                    ? "border-[#1e3a8a] text-[#1e3a8a] dark:text-blue-400 dark:border-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:border-gray-200 dark:hover:border-slate-600"
                )}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Breadcrumb trail (non-home pages) ──────────────────── */}
      {pageLabel && pageLabel !== "Home" && (
        <div className="flex items-center gap-1.5 pt-5 pb-1 text-xs text-gray-400 dark:text-slate-500">
          <Link href="/lis/teacher/courses" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            Courses
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={basePath} className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            {course.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 dark:text-gray-300 font-semibold">{pageLabel}</span>
        </div>
      )}

      <div className="pt-5">{children}</div>

      {/* ── Cover picker modal ──────────────────────────────────── */}
      {pickerOpen && (
        <CoverPickerModal
          current={coverUrl}
          onSelect={handleSelectCover}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
