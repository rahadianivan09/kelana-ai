"use client";
import { useState } from "react";
import RouteGuard from "@/app/components/RouteGuard";
import { askAssistant, AskResponse } from "@/services/assistantService";

function AssistantContent() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await askAssistant(question);
      setResult(res);
    } catch {
      setError("Failed to get an answer. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="text-gray-500 mb-6">Powered by your trusted travel documents</p>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Can I bring medication into Japan?"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <p className="text-slate-800">{result.answer}</p>
          {result.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-emerald-200 text-sm text-slate-500">
              Source: {result.sources.join(", ")}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function AssistantPage() {
  return (
    <RouteGuard>
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-1">Ask KelanaAI</h1>
        <AssistantContent />
      </main>
    </RouteGuard>
  );
}