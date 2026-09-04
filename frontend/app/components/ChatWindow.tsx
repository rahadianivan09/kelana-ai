"use client";
// HANDS-ON LAB (Session 10, Part 6) — Chat UI: render pesan + capture input.
// Backend yang mengelola conversation context (PDF Part 6) -- komponen ini
// murni presentational + local UI state (input value).
//
// HOMEWORK (Session 10) — 4 UX wins:
//  1. Conversation title (header)
//  2. Auto-scroll ke pesan terbaru: skenario (a) saat pertama buka percakapan,
//     (b) saat baru saja mengirim pesan baru
//  3. Typing indicator saat AI sedang memproses jawaban
//  4. Timestamp di tiap message bubble
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/types/conversation";

interface ChatWindowProps {
  title: string;
  messages: Message[];
  onSend: (content: string) => Promise<void>;
  sending: boolean;
  disabled: boolean; // true kalau belum ada conversation aktif
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({ title, messages, onSend, sending, disabled }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // HOMEWORK (Session 10, #2) — Auto-scroll. Efek ini jalan tiap `messages`
  // berubah (mencakup skenario "baru buka percakapan" karena messages baru
  // di-set dari kosong -> terisi, DAN skenario "baru kirim pesan baru" karena
  // array messages bertambah) maupun saat `sending` berubah (typing indicator
  // muncul/hilang juga perlu ikut men-scroll ke bawah).
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend() {
    const content = input.trim();
    if (!content || disabled || sending) return;
    setInput("");
    await onSend(content);
  }

  return (
    <div className="flex flex-col h-full flex-1 min-w-0 bg-white">
      {/* HOMEWORK (Session 10, #1) — Conversation title di header */}
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="font-semibold text-slate-800 truncate">
          {disabled ? "KelanaAI Chat" : title}
        </h2>
        {/* UI POLISH — subtitle kecil di bawah title, sesuai referensi */}
        <p className="text-xs text-slate-400">KelanaAI Travel Assistant</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {disabled && (
          <p className="text-sm text-slate-400 text-center mt-10">
            Select a conversation or start a new one to begin chatting.
          </p>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-slate-100 text-slate-800 rounded-bl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{m.content}</p>
              {/* HOMEWORK (Session 10, #4) — Timestamp per message bubble */}
              <p className={`mt-1 text-[11px] ${m.role === "user" ? "text-blue-100" : "text-slate-400"}`}>
                {formatTimestamp(m.created_at)}
              </p>
            </div>
          </div>
        ))}

        {/* HOMEWORK (Session 10, #3) — Typing indicator saat menunggu jawaban AI */}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-200 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={disabled ? "Start a new conversation first..." : "Type a message..."}
          disabled={disabled || sending}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || sending || !input.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}