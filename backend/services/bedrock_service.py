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
    prompt = (
        f"You are an experienced travel planner.\n"
        f"Create a {days}-day itinerary for {destination}.\n"
        f"Budget: USD {budget}\n"
        f"Travel Style: {travel_style}\n\n"
        # CORE CHALLENGE — ask Bedrock for a structured response
        f"Provide:\n"
        f"- A daily itinerary\n"
        f"- Estimated daily budget\n"
        f"- Local food recommendations\n"
        f"- Transportation suggestions\n\n"
        # HOMEWORK — break each day into morning/afternoon/evening
        f"For each day, structure the plan into:\n"
        f"- Morning activities (2-3 suggestions)\n"
        f"- Afternoon activities (cultural sites and experiences)\n"
        f"- Evening activities (dinner spots and nightlife)\n\n"
        # BONUS — Markdown formatting, instruction placed at the end
        f"Format your response as Markdown with headers (##) and bullet lists (-)."
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
            "maxTokens": 2048,
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

    return response_body["output"]["message"]["content"][0]["text"]