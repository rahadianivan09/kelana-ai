"""
Knowledge Base Service — HANDS-ON LAB (Session 9).
KB coach = Managed Knowledge Base -> gak support retrieve_and_generate,
jadi RAG-nya dipecah manual jadi 2 langkah:
  1. Retrieve  -> cari potongan dokumen relevan (managedSearchConfiguration)
  2. Generate  -> susun jawaban dari potongan itu, reuse client dari
                  bedrock_service.py (sama kayak fitur trip recommendation)
"""
import json
import os

import boto3
from dotenv import load_dotenv

from services.bedrock_service import get_bedrock_client, MODEL_ID

load_dotenv()

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID")


def get_kb_client():
    if not KNOWLEDGE_BASE_ID:
        raise ValueError("KNOWLEDGE_BASE_ID is not set in environment variables.")
    if not AWS_ACCESS_KEY_ID or not AWS_SECRET_ACCESS_KEY:
        raise ValueError("AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY is not set in environment variables.")

    return boto3.client(
        service_name="bedrock-agent-runtime",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    )


def ask_knowledge_base(question: str) -> dict:
    kb_client = get_kb_client()

    # LANGKAH 1 — Retrieve: cari potongan dokumen relevan
    retrieval = kb_client.retrieve(
        knowledgeBaseId=KNOWLEDGE_BASE_ID,
        retrievalQuery={"text": question},
        retrievalConfiguration={
            "managedSearchConfiguration": {"numberOfResults": 5}
        },
    )
    results = retrieval.get("retrievalResults", [])

    if not results:
        return {"answer": "Maaf, tidak ditemukan informasi relevan di dokumen.", "sources": []}

    context_chunks = []
    sources = []
    for r in results:
        context_chunks.append(r.get("content", {}).get("text", ""))
        uri = r.get("location", {}).get("s3Location", {}).get("uri", "")
        if uri:
            filename = uri.split("/")[-1]
            if filename not in sources:
                sources.append(filename)

    context = "\n\n---\n\n".join(context_chunks)

    # LANGKAH 2 — Generate: susun jawaban dari konteks yang ketemu
    prompt = (
        "Jawab pertanyaan berikut HANYA berdasarkan konteks dokumen di bawah ini. "
        "Kalau jawabannya tidak ada di konteks, bilang tidak menemukan informasinya.\n\n"
        f"Konteks:\n{context}\n\n"
        f"Pertanyaan: {question}"
    )

    gen_client = get_bedrock_client()
    body = {
        "messages": [{"role": "user", "content": [{"text": prompt}]}],
        "inferenceConfig": {"maxTokens": 1024, "temperature": 0.3},
    }
    response = gen_client.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(body),
        contentType="application/json",
        accept="application/json",
    )
    response_body = json.loads(response["body"].read())
    answer = response_body["output"]["message"]["content"][0]["text"]

    return {"answer": answer, "sources": sources}


def ask_base_model(question: str) -> str:
    """HOMEWORK (Session 9) — jawaban base-model TANPA Knowledge Base."""
    client = get_bedrock_client()
    body = {
        "messages": [{"role": "user", "content": [{"text": question}]}],
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