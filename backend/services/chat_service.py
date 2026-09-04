"""
Chat Service — HANDS-ON LAB (Session 10).
LLM bersifat stateless (PDF Part 1) -- service ini yang bertanggung jawab
merekonstruksi riwayat percakapan (dari tabel `messages`) jadi prompt sebelum
tiap kali manggil Bedrock, mengikuti pola "context-aware" vs "naive" di PDF
Part 5. Reuse get_bedrock_client()/MODEL_ID dari bedrock_service.py (Session
5/6) -- endpoint & auth Bedrock-nya sama, cuma sekarang "messages" berisi
banyak giliran (multi-turn), bukan cuma 1 prompt tunggal seperti trip
recommendation.

CATATAN FORMAT (lihat main.py / kb_service.py yang sudah jalan): body
invoke_model project ini pakai "content" sebagai LIST OF BLOCKS
(`[{"text": ...}]`), BUKAN string flat seperti contoh pseudocode di PDF Part 5
(`content: 'Plan a family trip...'`). Prompt Builder di bawah ini mengikuti
format asli yang benar-benar dipakai boto3 di project ini.
"""
import json

from services.bedrock_service import get_bedrock_client, MODEL_ID


# PRODUCT REQUIREMENT (di luar spesifikasi PDF Sesi 10) — kunci topik jawaban
# ke seputar travel via parameter "system" Bedrock, terpisah dari "messages"
# (histori asli percakapan yang disimpan ke DB, harus tetap bersih apa adanya).
SYSTEM_PROMPT = (
    "You are KelanaAI, a travel planning assistant. Your ONLY job is to help "
    "with travel: trip planning, destinations, itineraries, budgets, "
    "transportation, accommodation, local food, and culture.\n\n"
    "CRITICAL RULE: For ANY message that is not about travel — including "
    "math calculations (even simple ones like addition), coding, general "
    "knowledge questions, homework, or any other topic — you MUST NOT "
    "attempt to answer or solve it, even partially, even if it looks "
    "harmless or trivial. Instead, reply with ONLY a short 1-2 sentence "
    "message (in the same language the user used) saying you can only help "
    "with travel planning, and ask if they have a trip you'd like help "
    "with. Do not explain your reasoning, do not apologize at length, and "
    "do not compute or output any part of the requested answer."
)

# HANDS-ON LAB (Session 10, Part 5) — Prompt Builder.
# Ubah baris-baris Message dari DB jadi format "messages" yang dipahami
# Bedrock invoke_model: tiap giliran = {role, content: [{text}]}.
def build_prompt_messages(history: list) -> list[dict]:
    return [
        {"role": m.role, "content": [{"text": m.content}]}
        for m in history
    ]


# HANDS-ON LAB (Session 10, Part 4-5) — Generate: kirim SELURUH histori ke
# Bedrock (bukan cuma pesan terakhir saja) -- ini persis bedanya "naive" vs
# "context-aware" di PDF Part 5. `history` harus sudah termasuk pesan user
# yang baru saja disimpan (lihat main.py: send_message).
def generate_chat_response(history: list) -> str:
    client = get_bedrock_client()
    body = {
        "system": [{"text": SYSTEM_PROMPT}],
        "messages": build_prompt_messages(history),
        "inferenceConfig": {"maxTokens": 1024, "temperature": 0.7},
    }
    response = client.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(body),
        contentType="application/json",
        accept="application/json",
    )
    response_body = json.loads(response["body"].read())
    return response_body["output"]["message"]["content"][0]["text"]
