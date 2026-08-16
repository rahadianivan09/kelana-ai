from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_recommended_transportation,
)

app = FastAPI(title="KelanaAI")


# Pydantic model — validasi request body untuk POST /api/v1/trips
class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    # CORE CHALLENGE: field tambahan travel_style (opsional)
    travel_style: Optional[str] = None


@app.get("/")
def home():
    return {"message": "Welcome to KelanaAI"}


@app.get("/health")
def health():
    return {"status": "OK"}


@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    # Reuse business logic dari Session 2 — trip_service.py tidak diubah sama sekali
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)

    # CORE CHALLENGE: rekomendasi transportasi (reuse business rule Sesi 2 Challenge)
    recommended_transport = get_recommended_transportation(category)

    return {
        "destination": request.destination,
        "days": request.days,
        "budget": request.budget,
        "daily_budget": daily_budget,
        "category": category,
        "recommendation_transport": recommended_transport,
    }


# HOMEWORK: dua endpoint GET baru yang mengembalikan list
# @app.get("/api/v1/recommendations")
# def get_recommendations():
#     return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


# @app.get("/api/v1/transportations")
# def get_transportations():
#     return ["Bus", "Train", "Flight"]


# BONUS: endpoint yang me-list semua kategori trip yang valid
@app.get("/api/v1/trip-categories")
def get_trip_categories():
    return ["Backpacker", "Standard", "Luxury"]