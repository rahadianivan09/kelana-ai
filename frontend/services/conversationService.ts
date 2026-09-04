import type {
  Conversation,
  ConversationWithMessages,
  SendMessageResponse,
} from "@/types/conversation";
import { getToken } from "@/services/authService"; // HANDS-ON LAB (Session 8, Part 6) — pola sama seperti tripService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// HANDS-ON LAB (Session 10, Part 3) — buat conversation baru
export async function createConversation(title?: string): Promise<Conversation> {
  const res = await fetch(`${API_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ title: title ?? null }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

// HANDS-ON LAB (Session 10, Part 3) + CORE CHALLENGE — list untuk sidebar
export async function listConversations(): Promise<Conversation[]> {
  const res = await fetch(`${API_URL}/conversations`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

// CORE CHALLENGE — load conversation + seluruh messages-nya (saat diklik di sidebar)
export async function getConversation(id: number): Promise<ConversationWithMessages> {
  const res = await fetch(`${API_URL}/conversations/${id}`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch conversation");
  return res.json();
}

// BONUS (Session 10) — rename conversation
export async function renameConversation(id: number, title: string): Promise<Conversation> {
  const res = await fetch(`${API_URL}/conversations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to rename conversation");
  return res.json();
}

// HANDS-ON LAB (Session 10, Part 4) — kirim pesan baru, dipakai baik untuk
// memulai maupun melanjutkan percakapan (conversationId beda, endpoint sama)
export async function sendMessage(conversationId: number, content: string): Promise<SendMessageResponse> {
  const res = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
