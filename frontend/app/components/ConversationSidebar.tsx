"use client";
// CORE CHALLENGE (Session 10) — sidebar kiri: list semua conversation milik
// user yang login. Klik salah satu -> load messages-nya ke chat panel (lewat
// callback onSelect, actual fetch dilakukan oleh parent/page.tsx).
// Acceptance criteria PDF: (1) sidebar list semua conversation user saat ini,
// (2) klik -> load messages ke chat view yang sama, (3) conversation baru
// otomatis muncul di list -- (3) ditangani parent dengan prepend ke state.
//
// BONUS (Session 10) — Rename Conversations: klik ikon pensil di tiap item
// untuk edit title inline, commit lewat PATCH /api/v1/conversations/{id}.
import { useState } from "react";
import type { Conversation } from "@/types/conversation";
import { renameConversation } from "@/services/conversationService";

// UI POLISH (matching reference layout) — format created_at conversation
// jadi "Sep 1, 03:49 PM", ditampilkan di bawah title tiap item sidebar.
function formatConversationDate(iso: string): string {
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onCreateNew: () => void;
  onRenamed: (updated: Conversation) => void;
  creating: boolean;
  isOpen: boolean; // UI POLISH (mobile) — kontrol tampil/sembunyi drawer di layar kecil
  onClose: () => void;
}

export default function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onCreateNew,
  onRenamed,
  creating,
  isOpen,
  onClose,
}: ConversationSidebarProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  function startEditing(conversation: Conversation) {
    setEditingId(conversation.id);
    setEditValue(conversation.title);
  }

  async function commitRename(id: number) {
    const title = editValue.trim();
    setEditingId(null);
    if (!title) return;
    try {
      const updated = await renameConversation(id, title);
      onRenamed(updated);
    } catch {
      // gagal rename -> title lama tetap tampil, tidak perlu blocking error di sini
    }
  }

  return (
    <>
      {/* Backdrop — cuma muncul di mobile saat drawer terbuka, klik buat nutup */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 shrink-0 border-r border-slate-200 flex flex-col bg-white transition-transform duration-200 ease-in-out
        md:static md:z-auto md:h-full md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-3 border-b border-slate-200">
          <button
            onClick={onCreateNew}
            disabled={creating}
            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? "Starting..." : "+ New Conversation"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="p-4 text-sm text-slate-400">No conversations yet.</p>
          )}

          {conversations.map((c) => (
            <div
              key={c.id}
              className={`group flex items-center gap-1 px-3 py-2 cursor-pointer border-b border-slate-100 ${
                c.id === activeId ? "bg-blue-50" : "hover:bg-slate-50"
              }`}
              onClick={() => editingId !== c.id && onSelect(c.id)}
            >
              {editingId === c.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => commitRename(c.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename(c.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 rounded border border-blue-300 px-1 py-0.5 text-sm focus:outline-none"
                />
              ) : (
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm text-slate-700">{c.title}</p>
                  {/* UI POLISH — timestamp di bawah title, sesuai referensi */}
                  <p className="truncate text-xs text-slate-400">{formatConversationDate(c.created_at)}</p>
                </div>
              )}

              {editingId !== c.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(c);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 text-xs px-1"
                  title="Rename"
                >
                  ✎
                </button>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}