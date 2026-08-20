from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_recommended_transportation,
)
from models.trip import Trip
from database import SessionLocal, init_db

app = FastAPI(title="KelanaAI")

# buat semua tabel (kalau belum ada) saat aplikasi start
init_db()


# Pydantic model — validasi request body untuk POST /api/v1/trips
class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: Optional[str] = None


# Pydantic model — request body untuk PUT (HOMEWORK)
class TripUpdateRequest(BaseModel):
    budget: float


def trip_to_dict(trip: Trip) -> dict:
    """Ubah objek Trip (SQLAlchemy) jadi dict biasa untuk response JSON."""
    return {
        "id": trip.id,
        "destination": trip.destination,
        "days": trip.days,
        "budget": trip.budget,
        "category": trip.category,
        "daily_budget": trip.daily_budget,
        "created_at": trip.created_at,  # BONUS
    }


@app.get("/")
def home():
    return {"message": "Welcome to KelanaAI"}


@app.get("/health")
def health():
    return {"status": "OK"}


@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    # Reuse business logic dari Session 2 — trip_service.py tidak diubah
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    recommended_transport = get_recommended_transportation(category)

    # bikin objek Trip (ORM) untuk disimpan ke PostgreSQL
    trip = Trip(
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        category=category,
        daily_budget=daily_budget,
    )

    # simpan ke PostgreSQL
    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)  # ambil id & created_at yang auto-generated
    db.close()

    result = trip_to_dict(trip)
    result["recommendation_transport"] = recommended_transport
    return result


@app.get("/api/v1/trips")
def list_trips():
    db = SessionLocal()
    trips = db.query(Trip).all()
    db.close()
    return [trip_to_dict(t) for t in trips]


@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()

    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    return trip_to_dict(trip)


# HOMEWORK: PUT /api/v1/trips/{id} — update budget, recalculate category & daily_budget
@app.put("/api/v1/trips/{trip_id}")
def update_trip(trip_id: int, request: TripUpdateRequest):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    # reuse business logic dari Session 2 — recalculate berdasarkan budget baru
    new_daily_budget = calculate_daily_budget(request.budget, trip.days)
    new_category = get_trip_category(request.budget)

    trip.budget = request.budget
    trip.category = new_category
    trip.daily_budget = new_daily_budget

    db.commit()
    db.refresh(trip)
    db.close()

    return trip_to_dict(trip)


# HOMEWORK: DELETE /api/v1/trips/{id} — hapus trip, 404 kalau tidak ditemukan
@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    db.delete(trip)
    db.commit()
    db.close()

    return {"message": f"Trip with id {trip_id} deleted successfully"}


# Session 3 — dua endpoint GET yang mengembalikan list
@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]


# Session 3 — endpoint yang me-list semua kategori trip yang valid
@app.get("/api/v1/trip-categories")
def get_trip_categories():
    return ["Backpacker", "Standard", "Luxury"]