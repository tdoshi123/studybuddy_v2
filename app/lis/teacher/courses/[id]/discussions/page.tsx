"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import { useParams, useSearchParams } from "next/navigation";import {
  getDiscussionsByClass,
  Discussion,
  DiscussionReply,
} from "@/data/teacher-mock-data";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import {
  MessageCircle,
  Plus,
  Pin,
  ChevronDown,
  ChevronUp,
  Heart,
  ThumbsUp,
  Send,
} from "lucide-react";

function countAllReplies(replies: DiscussionReply[]): number {
  return replies.reduce(
    (acc, r) => acc + 1 + (r.replies?.length ? countAllReplies(r.replies) : 0),
    0
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

function appendReplyToTree(
  replies: DiscussionReply[],
  parentId: string,
  newReply: DiscussionReply
): DiscussionReply[] {
  return replies.map((r) => {
    if (r.id === parentId) {
      return { ...r, replies: [...(r.replies ?? []), newReply] };
    }
    if (r.replies?.length) {
      return { ...r, replies: appendReplyToTree(r.replies, parentId, newReply) };
    }
    return r;
  });
}

export default function DiscussionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const classId = params.id as string;

  const [discussions, setDiscussions] = useState<Discussion[]>(() =>
    getDiscussionsByClass(classId)
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(() => searchParams.get("create") === "1");
  const [newTitle, setNewTitle] = useState("");
  const [newPrompt, setNewPrompt] = useState("");
  const [likeOverrides, setLikeOverrides] = useState<Record<string, number>>({});
  const [replyTarget, setReplyTarget] = useState<{
    discussionId: string;
    parentReplyId: string | null;
  } | null>(null);
  const [replyText, setReplyText] = useState("");

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const sortedDiscussions = [...discussions].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  function getLikes(reply: DiscussionReply): number {
    return likeOverrides[reply.id] ?? reply.likes;
  }

  function bumpLike(reply: DiscussionReply) {
    setLikeOverrides((prev) => {
      const current = prev[reply.id] ?? reply.likes;
      return { ...prev, [reply.id]: current + 1 };
    });
  }

  function togglePin(discussionId: string) {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId ? { ...d, pinned: !d.pinned } : d
      )
    );
  }

  function toggleExpand(id: string) {
    setExpandedId((cur) => (cur === id ? null : id));
    setReplyTarget(null);
    setReplyText("");
  }

  function handleCreateSubmit() {
    const title = newTitle.trim();
    const prompt = newPrompt.trim();
    if (!title || !prompt) return;
    const id = `d-${Date.now()}`;
    const next: Discussion = {
      id,
      classId,
      title,
      prompt,
      author: "You",
      authorRole: "teacher",
      createdAt: new Date().toISOString().slice(0, 10),
      pinned: false,
      replies: [],
    };
    setDiscussions((prev) => [next, ...prev]);
    setNewTitle("");
    setNewPrompt("");
    setCreateOpen(false);
    setExpandedId(id);
  }

  function submitReply(discussionId: string) {
    const text = replyText.trim();
    if (!text) return;
    const newReply: DiscussionReply = {
      id: `dr-${Date.now()}`,
      author: "You",
      authorRole: "teacher",
      content: text,
      createdAt: new Date().toISOString().slice(0, 10),
      likes: 0,
    };
    setDiscussions((prev) =>
      prev.map((d) => {
        if (d.id !== discussionId) return d;
        if (replyTarget?.parentReplyId == null) {
          return { ...d, replies: [...d.replies, newReply] };
        }
        return {
          ...d,
          replies: appendReplyToTree(d.replies, replyTarget.parentReplyId, newReply),
        };
      })
    );
    setReplyText("");
    setReplyTarget(null);
  }

  function fmt(iso: string) {
    return new Date(iso + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{today}</p>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Discussion Board</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{sortedDiscussions.length} topics &middot; {sortedDiscussions.reduce((s, d) => s + countAllReplies(d.replies), 0)} replies</p>
        </div>
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Discussion
          </button>
        </div>
      </div>

      {sortedDiscussions.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <EmptyState
            icon={MessageCircle}
            title="No discussions yet"
            description="Start a conversation with your students."
            action={{ label: "New Discussion", onClick: () => setCreateOpen(true) }}
          />
        </div>
      ) : (
        <ul className="space-y-3">
          {sortedDiscussions.map((d) => {
            const open = expandedId === d.id;
            const preview = d.prompt.length > 160 ? `${d.prompt.slice(0, 160)}…` : d.prompt;
            const replyCount = countAllReplies(d.replies);
            return (
              <li key={d.id}>
                <div className={`rounded-2xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all hover:shadow-md ${open ? "border-blue-300 dark:border-blue-700 shadow-md" : "border-gray-200 dark:border-slate-700"}`}>
                  <div className="flex items-stretch">
                    {/* Pin accent */}
                    <div className={`w-1 flex-shrink-0 ${d.pinned ? "bg-amber-400" : "bg-gray-200 dark:bg-slate-700"}`} />
                    <button
                      type="button"
                      onClick={() => toggleExpand(d.id)}
                      className="min-w-0 flex-1 text-left px-5 py-4 hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            {d.pinned && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                                <Pin className="w-3 h-3" /> Pinned
                              </span>
                            )}
                            <h2 className="text-sm font-bold text-gray-900 dark:text-white">{d.title}</h2>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{preview}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-slate-500">
                            <span className="font-medium text-gray-600 dark:text-gray-300">{d.author}</span>
                            <span>·</span>
                            <span>{fmt(d.createdAt)}</span>
                            <span>·</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">{replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 pt-0.5 text-gray-400">
                          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>
                    <div className="flex items-start gap-1 pr-4 py-4 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => togglePin(d.id)}
                        className={`rounded-lg p-2 transition-colors ${d.pinned ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40" : "text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-amber-500"}`}
                        title={d.pinned ? "Unpin" : "Pin"}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {open && (
                    <div className="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20 px-5 py-5 space-y-4">
                      {/* Prompt card */}
                      <div className="rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4">
                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">Discussion Prompt</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{d.prompt}</p>
                        <div className="mt-3 flex items-center gap-2 text-xs">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{d.author}</span>
                          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${d.authorRole === "teacher" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                            {d.authorRole}
                          </span>
                          <span className="text-gray-400">· {fmt(d.createdAt)}</span>
                        </div>
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => { setReplyTarget({ discussionId: d.id, parentReplyId: null }); setReplyText(""); }}
                            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                          >
                            Reply to prompt
                          </button>
                          {replyTarget?.discussionId === d.id && replyTarget.parentReplyId === null && (
                            <div className="mt-2 space-y-2">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={3}
                                placeholder="Write a reply…"
                                className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                              />
                              <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setReplyTarget(null)} className="rounded-xl px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800">Cancel</button>
                                <button type="button" onClick={() => submitReply(d.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm">
                                  <Send className="w-3.5 h-3.5" /> Submit
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Replies */}
                      <div className="space-y-3">
                        {d.replies.map((r) => (
                          <ReplyNode
                            key={r.id}
                            reply={r}
                            depth={0}
                            maxDepth={1}
                            discussionId={d.id}
                            getLikes={getLikes}
                            onLike={bumpLike}
                            replyTarget={replyTarget}
                            setReplyTarget={setReplyTarget}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            onSubmitReply={() => submitReply(d.id)}
                            fmt={fmt}
                          />
                        ))}
                      </div>
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
        title="New Discussion"
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
              onClick={handleCreateSubmit}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Create
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              placeholder="Discussion title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prompt
            </label>
            <textarea
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              placeholder="What should students discuss?"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ReplyNode({
  reply, depth, maxDepth, discussionId, getLikes, onLike,
  replyTarget, setReplyTarget, replyText, setReplyText, onSubmitReply, fmt,
}: {
  reply: DiscussionReply;
  depth: number;
  maxDepth: number;
  discussionId: string;
  getLikes: (r: DiscussionReply) => number;
  onLike: (reply: DiscussionReply) => void;
  replyTarget: { discussionId: string; parentReplyId: string | null } | null;
  setReplyTarget: Dispatch<SetStateAction<{ discussionId: string; parentReplyId: string | null } | null>>;
  replyText: string;
  setReplyText: Dispatch<SetStateAction<string>>;
  onSubmitReply: () => void;
  fmt: (iso: string) => string;
}) {
  const likes = getLikes(reply);
  const showNested = depth < maxDepth && (reply.replies?.length ?? 0) > 0;
  const isReplying = replyTarget?.discussionId === discussionId && replyTarget?.parentReplyId === reply.id;

  return (
    <div className={`rounded-xl border bg-white dark:bg-slate-900 p-4 shadow-sm ${depth > 0 ? "ml-5 border-l-2 border-l-blue-200 dark:border-l-blue-800 border-gray-100 dark:border-slate-800" : "border-gray-200 dark:border-slate-700"}`}>
      <div className="flex gap-3">
        <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${reply.authorRole === "teacher" ? "bg-[#1e3a8a]" : "bg-slate-400 dark:bg-slate-600"}`}>
          {initials(reply.author)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{reply.author}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${reply.authorRole === "teacher" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"}`}>
              {reply.authorRole}
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-500">{fmt(reply.createdAt)}</span>
          </div>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{reply.content}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => onLike(reply)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <Heart className="w-3.5 h-3.5" />
              <span>{likes}</span>
            </button>
            {depth < maxDepth && (
              <button type="button" onClick={() => { setReplyTarget({ discussionId, parentReplyId: reply.id }); setReplyText(""); }} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                Reply
              </button>
            )}
          </div>
          {isReplying && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={3}
                placeholder="Write a reply…"
                className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setReplyTarget(null)} className="rounded-xl px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800">Cancel</button>
                <button type="button" onClick={onSubmitReply} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1e3a8a] hover:bg-blue-700 px-3 py-1.5 text-sm font-semibold text-white shadow-sm">
                  <Send className="w-3.5 h-3.5" /> Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showNested && reply.replies!.map((child) => (
        <div key={child.id} className="mt-3">
          <ReplyNode
            reply={child} depth={depth + 1} maxDepth={maxDepth} discussionId={discussionId}
            getLikes={getLikes} onLike={onLike} replyTarget={replyTarget} setReplyTarget={setReplyTarget}
            replyText={replyText} setReplyText={setReplyText} onSubmitReply={onSubmitReply} fmt={fmt}
          />
        </div>
      ))}
    </div>
  );
}
