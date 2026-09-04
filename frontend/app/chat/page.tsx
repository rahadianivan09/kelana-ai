"use client";
// HANDS-ON LAB (Session 10) — halaman /chat: gabungan ConversationSidebar
// (CORE CHALLENGE) + ChatWindow (Hands-on Lab UI + Homework 4 UX wins).
// Backend yang menyimpan & merekonstruksi context (main.py + chat_service.py) --
// halaman ini murni orkestrasi state di sisi frontend, pola sama seperti
// trips/page.tsx (RouteGuard + Content component + service layer).
import { useEffect, useState } from "react";
import RouteGuard from "@/app/components/RouteGuard";
import ConversationSidebar from "@/app/components/ConversationSidebar";
import ChatWindow from "@/app/components/ChatWindow";
import {
  createConversation,
  getConversation,
  listConversations,
  sendMessage,
} from "@/services/conversationService";
import type { Conversation, Message } from "@/types/conversation";

function ChatContent() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [activeTitle, setActiveTitle] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // HANDS-ON LAB (Session 10, Part 3) — load sidebar saat halaman dibuka
  useEffect(() => {
    listConversations()
      .then(setConversations)
      .catch(() => setError("Unable to load conversations."))
      .finally(() => setLoadingList(false));
  }, []);

  // CORE CHALLENGE + PDF Part 7 (Continue Existing Conversations) — klik
  // conversation di sidebar -> reload semua message sebelumnya dari DB.
  async function handleSelect(id: number) {
    setError(null);
    try {
      const data = await getConversation(id);
      setActiveId(data.id);
      setActiveTitle(data.title);
      setMessages(data.messages);
    } catch {
      setError("Unable to load this conversation.");
    }
  }

  // CORE CHALLENGE — "New conversations appear in the list automatically"
  async function handleCreateNew() {
    setCreating(true);
    setError(null);
    try {
      const conversation = await createConversation();
      setConversations((prev) => [conversation, ...prev]);
      setActiveId(conversation.id);
      setActiveTitle(conversation.title);
      setMessages([]);
    } catch {
      setError("Unable to start a new conversation.");
    } finally {
      setCreating(false);
    }
  }

  // HANDS-ON LAB (Session 10, Part 4) — kirim pesan: tampilkan typing
  // indicator selama menunggu, lalu append user_message + ai_message
  // sekaligus saat response datang (backend mengembalikan keduanya).
  async function handleSend(content: string) {
    if (activeId === null) return;
    setSending(true);
    setError(null);
    try {
      const result = await sendMessage(activeId, content);
      setMessages((prev) => [...prev, result.user_message, result.ai_message]);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function handleRenamed(updated: Conversation) {
    setConversations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (updated.id === activeId) setActiveTitle(updated.title);
  }

  return (
    <div className="flex h-[calc(100vh-57px)] bg-white">
      {loadingList ? (
        <div className="w-64 shrink-0 border-r border-slate-200 p-4 bg-white">
          <div className="h-9 rounded-lg bg-gray-100 animate-pulse mb-3" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-gray-100 animate-pulse mb-2" />
          ))}
        </div>
      ) : (
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onCreateNew={handleCreateNew}
          onRenamed={handleRenamed}
          creating={creating}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {error && <p className="text-red-600 text-sm px-4 pt-2">{error}</p>}
        <ChatWindow
          title={activeTitle}
          messages={messages}
          onSend={handleSend}
          sending={sending}
          disabled={activeId === null}
        />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <RouteGuard>
      <ChatContent />
    </RouteGuard>
  );
}
