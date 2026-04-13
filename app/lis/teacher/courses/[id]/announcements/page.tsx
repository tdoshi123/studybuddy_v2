"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getAnnouncementsByClass, Announcement } from "@/data/teacher-mock-data";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Megaphone, Plus, Pencil, Trash2, ChevronDown, ChevronUp, Calendar, User } from "lucide-react";

export default function AnnouncementsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const classId = params.id as string;

  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    [...getAnnouncementsByClass(classId)].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [createOpen, setCreateOpen] = useState(() => searchParams.get("create") === "1");
  const [editTarget, setEditTarget] = useState<Announcement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formDate, setFormDate] = useState("");

  const sorted = [...announcements].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const newestId = sorted[0]?.id;

  function openCreate() {
    setFormTitle("");
    setFormMessage("");
    setFormDate(new Date().toISOString().slice(0, 10));
    setCreateOpen(true);
  }

  function openEdit(a: Announcement) {
    setEditTarget(a);
    setFormTitle(a.title);
    setFormMessage(a.content);
    setFormDate(a.createdAt);
  }

  function handleCreateSave() {
    const title = formTitle.trim();
    const content = formMessage.trim();
    const createdAt = formDate || new Date().toISOString().slice(0, 10);
    if (!title || !content) return;
    const next: Announcement = {
      id: `an-${Date.now()}`,
      classId,
      title,
      content,
      createdAt,
      author: "You",
    };
    setAnnouncements((prev) => [next, ...prev]);
    setCreateOpen(false);
  }

  function handleEditSave() {
    if (!editTarget) return;
    const title = formTitle.trim();
    const content = formMessage.trim();
    const createdAt = formDate || editTarget.createdAt;
    if (!title || !content) return;
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === editTarget.id ? { ...a, title, content, createdAt } : a
      )
    );
    setEditTarget(null);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setAnnouncements((prev) => prev.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
    setExpandedIds((s) => {
      const n = new Set(s);
      n.delete(deleteTarget.id);
      return n;
    });
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  function fmt(iso: string) {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Announcements</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{sorted.length} posted</p>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <EmptyState
            icon={Megaphone}
            title="No announcements yet"
            description="Post updates for your class."
            action={{ label: "New Announcement", onClick: openCreate }}
          />
        </div>
      ) : (
        <ul className="space-y-3">
          {sorted.map((a) => {
            const expanded = expandedIds.has(a.id);
            const isNew = a.id === newestId;
            return (
              <li key={a.id}>
                <div className={`rounded-2xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-shadow hover:shadow-md ${isNew ? "border-blue-300 dark:border-blue-700" : "border-gray-200 dark:border-slate-700"}`}>
                  {/* Left accent bar */}
                  <div className="flex items-stretch">
                    <div className={`w-1 flex-shrink-0 ${isNew ? "bg-blue-600" : "bg-gray-200 dark:bg-slate-700"}`} />
                    <button
                      type="button"
                      onClick={() => toggleExpand(a.id)}
                      className="min-w-0 flex-1 text-left px-5 py-4 hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            {isNew && (
                              <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                                NEW
                              </span>
                            )}
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white">{a.title}</h2>
                          </div>
                          {!expanded && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {a.content}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {fmt(a.createdAt)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              {a.author}
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 pt-0.5 text-gray-400">
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>
                    <div className="flex items-start gap-0.5 pr-4 py-4 flex-shrink-0">
                      <button type="button" onClick={() => openEdit(a)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setDeleteTarget(a)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {expanded && (
                    <div className="border-t border-gray-100 dark:border-slate-800 px-6 py-5 bg-gray-50/50 dark:bg-slate-800/30">
                      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{a.content}</p>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Announcement"
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateSave}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Post
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              placeholder="Announcement title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              placeholder="Your message to the class"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Post date</label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Announcement"
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditTarget(null)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEditSave}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Save
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Post date</label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete announcement?"
        size="sm"
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          This cannot be undone. Are you sure you want to delete{" "}
          <span className="font-medium text-gray-900">&ldquo;{deleteTarget?.title}&rdquo;</span>?
        </p>
      </Modal>
    </div>
  );
}
