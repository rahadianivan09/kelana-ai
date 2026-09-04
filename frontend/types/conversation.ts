// HANDS-ON LAB (Session 10, Part 2) — tipe data sesuai bentuk response backend
// (conversation_to_dict / message_to_dict di main.py)
export type MessageRole = "user" | "assistant";

export interface Message {
  id: number;
  conversation_id: number;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
}

// CORE CHALLENGE — GET /api/v1/conversations/{id} mengembalikan conversation + messages sekaligus
export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

// HANDS-ON LAB (Session 10, Part 4) — response POST /api/v1/conversations/{id}/messages
export interface SendMessageResponse {
  conversation_id: number;
  user_message: Message;
  ai_message: Message;
}
