import { getToken } from "@/services/authService";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type AskResponse = {
  question: string;
  answer: string;
  sources: string[];
};

export async function askAssistant(question: string): Promise<AskResponse> {
  const res = await fetch(`${API_URL}/assistant`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("Failed to get answer from KelanaAI");
  return res.json();
}