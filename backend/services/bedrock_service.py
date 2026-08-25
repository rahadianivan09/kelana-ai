import json
import os

import boto3
from dotenv import load_dotenv

load_dotenv()

AWS_BEARER_TOKEN_BEDROCK = os.getenv("AWS_BEARER_TOKEN_BEDROCK")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
MODEL_ID = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")


def get_bedrock_client():
    """Create and return a Bedrock runtime client using a bearer token (API key)."""
    if not AWS_BEARER_TOKEN_BEDROCK:
        raise ValueError("AWS_BEARER_TOKEN_BEDROCK is not set in environment variables.")

    client = boto3.client(
        service_name="bedrock-runtime",
        region_name=AWS_REGION,
        aws_session_token=None,
        endpoint_url=f"https://bedrock-runtime.{AWS_REGION}.amazonaws.com",
    )

    def _add_bearer_token(request, **kwargs):
        request.headers["Authorization"] = f"Bearer {AWS_BEARER_TOKEN_BEDROCK}"

    client.meta.events.register("before-send.bedrock-runtime.*", _add_bearer_token)

    return client


def get_travel_recommendation(
    destination: str,
    days: int,
    budget: float,
    travel_style: str,
) -> str:
    # SESSION 6 — CORE CHALLENGE: prompt diubah dari Markdown (sesi 5) jadi JSON terstruktur
    # supaya frontend bisa render daily cards / travel tips / food / budget breakdown terpisah
    prompt = (
        f"You are an experienced travel planner.\n"
        f"Destination: {destination}\n"
        f"Budget: USD {budget}\n"
        f"Duration: {days} days\n"
        f"Travel style: {travel_style}\n\n"
        f"Respond with ONLY valid JSON (no markdown, no code fences, no extra text) "
        f"in exactly this shape:\n\n"
        "{\n"
        '  "itinerary": [\n'
        '    {"day": 1, "title": "short day title", "activities": ["activity 1", "activity 2", "activity 3"]}\n'
        "  ],\n"
        '  "travel_tips": ["tip 1", "tip 2", "tip 3"],\n'
        '  "food_recommendations": ["dish or place 1", "dish or place 2", "dish or place 3"],\n'
        '  "budget_breakdown": [\n'
        '    {"category": "Accommodation", "amount": 0},\n'
        '    {"category": "Food", "amount": 0},\n'
        '    {"category": "Transportation", "amount": 0},\n'
        '    {"category": "Activities", "amount": 0}\n'
        "  ]\n"
        "}\n\n"
        f"The itinerary array must have exactly {days} entries (one per day). "
        f"budget_breakdown amounts must sum to approximately {budget}. "
        f"Output raw JSON only, nothing else."
    )

    client = get_bedrock_client()

    body = {
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}],
            }
        ],
        "inferenceConfig": {
            "maxTokens": 4096,
            "temperature": 0.7,
        },
    }

    response = client.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(body),
        contentType="application/json",
        accept="application/json",
    )

    response_body = json.loads(response["body"].read())
    result_text = response_body["output"]["message"]["content"][0]["text"]

    # SESSION 6 — HANDS-ON LAB: cleanup jaga-jaga kalau Bedrock tetap bungkus jawaban pakai code fence
    result_text = result_text.strip()
    if result_text.startswith("```"):
        result_text = result_text.strip("`")
        if result_text.lower().startswith("json"):
            result_text = result_text[4:].strip()

    return result_text