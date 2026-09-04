from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_recommended_transportation,
)
from services.bedrock_service import get_travel_recommendation
from services.kb_service import ask_knowledge_base, ask_base_model  # HANDS-ON LAB (Session 9) — RAG
from services import auth_service  # HANDS-ON LAB (Session 8) — register/login/JWT
from services.chat_service import generate_chat_response  # HANDS-ON LAB (Session 10) — Conversation Memory
from models.conversation import Conversation  # HANDS-ON LAB (Session 10, Part 2) — wajib di-import
from models.message import Message              # supaya Base.metadata.create_all() mengenal tabel ini
from models.trip import Trip
from models.user import User  # HANDS-ON LAB (Session 8, Part 2) — wajib di-import
                                # supaya Base.metadata.create_all() mengenal tabel `users`
from database import SessionLocal, init_db
from dependencies import get_current_user  # HANDS-ON LAB (Session 8, Part 5)

app = FastAPI(title="KelanaAI")

# SESSION 6 — HANDS-ON LAB: izinkan Next.js (localhost:3000) manggil API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: Optional[str] = None


class TripUpdateRequest(BaseModel):
    budget: float


# HANDS-ON LAB (Session 8, Part 3) — request body Register
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

# HANDS-ON LAB (Session 8, Part 4) — request body Login
class LoginRequest(BaseModel):
    email: str
    password: str

# HANDS-ON LAB (Session 9) — request body untuk /api/v1/assistant
class AssistantRequest(BaseModel):
    question: str

# ⬇️ TAMBAH INI
class CompareRequest(BaseModel):
    question: str

# HANDS-ON LAB (Session 10, Part 3) — request body: buat conversation baru
class ConversationCreateRequest(BaseModel):
    title: Optional[str] = None  # kosong -> default "New Conversation" (lihat model)


# BONUS (Session 10) — request body: rename conversation
class ConversationRenameRequest(BaseModel):
    title: str


# HANDS-ON LAB (Session 10, Part 4) — request body: kirim pesan baru
class MessageCreateRequest(BaseModel):
    content: str

def trip_to_dict(trip: Trip) -> dict:
    return {
        "id": trip.id,
        "user_id": trip.user_id,
        "destination": trip.destination,
        "days": trip.days,
        "budget": trip.budget,
        "category": trip.category,
        "daily_budget": trip.daily_budget,
        "travel_style": trip.travel_style,
        "ai_recommendation": trip.ai_recommendation,
        "created_at": trip.created_at,
        "updated_at": trip.updated_at,
    }


def user_to_dict(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at,
    }

# HANDS-ON LAB (Session 10, Part 2-3) — helper dict, pola sama seperti trip_to_dict
def conversation_to_dict(conversation: Conversation) -> dict:
    return {
        "id": conversation.id,
        "user_id": conversation.user_id,
        "title": conversation.title,
        "created_at": conversation.created_at,
    }


def message_to_dict(message: Message) -> dict:
    return {
        "id": message.id,
        "conversation_id": message.conversation_id,
        "role": message.role,
        "content": message.content,
        "created_at": message.created_at,
    }

@app.get("/")
def home():
    return {"message": "Welcome to KelanaAI"}


@app.get("/health")
def health():
    return {"status": "OK"}


# ============================================================
# HANDS-ON LAB (Session 8) — AUTH ENDPOINTS
# ============================================================

@app.post("/api/v1/auth/register")
def register(request: RegisterRequest):
    db = SessionLocal()
    try:
        user = auth_service.register(db, request.name, request.email, request.password)
        return user_to_dict(user)
    finally:
        db.close()


@app.post("/api/v1/auth/login")
def login(request: LoginRequest):
    db = SessionLocal()
    try:
        token = auth_service.login(db, request.email, request.password)
        return {"access_token": token, "token_type": "Bearer"}
    finally:
        db.close()


# CHALLENGE (Session 8) — Core Challenge: GET /api/v1/auth/me
# Dipakai halaman /profile: nama, email, total trip. Identitas diambil dari JWT,
# BUKAN dari user_id di URL (sesuai hint PDF slide 16).
@app.get("/api/v1/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    try:
        trip_count = db.query(Trip).filter(Trip.user_id == current_user.id).count()
        data = user_to_dict(current_user)
        data["total_trips"] = trip_count
        return data
    finally:
        db.close()


# ============================================================
# TRIP ENDPOINTS — sekarang seluruhnya diproteksi JWT
# ============================================================

# HANDS-ON LAB (Session 8, Part 6) — ownership diambil dari token (Depends),
# TIDAK PERNAH dari body request. Mencegah user membuat trip atas nama user lain.
@app.post("/api/v1/trips")
def create_trip(request: TripRequest, current_user: User = Depends(get_current_user)):
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category = get_trip_category(request.budget)
    recommended_transport = get_recommended_transportation(category)

    trip = Trip(
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        category=category,
        daily_budget=daily_budget,
        travel_style=request.travel_style,
        user_id=current_user.id,  # <-- backend-set
    )

    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip)
    db.close()

    result = trip_to_dict(trip)
    result["recommendation_transport"] = recommended_transport
    return result


# HOMEWORK (Session 8, #1) — View: only own trips.
# role "admin" boleh melihat semua trip (dipakai untuk melihat data hasil migrasi);
# role "user" hanya melihat trip miliknya sendiri.
@app.get("/api/v1/trips")
def list_trips(current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    query = db.query(Trip)
    if current_user.role != "admin":
        query = query.filter(Trip.user_id == current_user.id)
    trips = query.all()
    db.close()
    return [trip_to_dict(t) for t in trips]


# HOMEWORK (Session 8) — detail trip juga diproteksi ownership (403 kalau bukan pemilik)
@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()

    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    if current_user.role != "admin" and trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this trip")

    return trip_to_dict(trip)


# HOMEWORK (Session 8, #2) — Update: reject other users' trips -> 403
@app.put("/api/v1/trips/{trip_id}")
def update_trip(trip_id: int, request: TripUpdateRequest, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    if current_user.role != "admin" and trip.user_id != current_user.id:
        db.close()
        raise HTTPException(status_code=403, detail="You do not have permission to update this trip")

    new_daily_budget = calculate_daily_budget(request.budget, trip.days)
    new_category = get_trip_category(request.budget)

    trip.budget = request.budget
    trip.category = new_category
    trip.daily_budget = new_daily_budget

    db.commit()
    db.refresh(trip)
    db.close()

    return trip_to_dict(trip)


# HOMEWORK (Session 8, #3) — Delete: reject other users' trips -> 403
@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    if current_user.role != "admin" and trip.user_id != current_user.id:
        db.close()
        raise HTTPException(status_code=403, detail="You do not have permission to delete this trip")

    db.delete(trip)
    db.commit()
    db.close()

    return {"message": f"Trip with id {trip_id} deleted successfully"}


# Session 5 — HANDS-ON LAB: AI generation endpoint
# UPDATE (Session 8) — ikut diproteksi ownership. Endpoint ini mengubah data trip
# (ai_recommendation), jadi harus tunduk aturan yang sama dengan PUT/DELETE.
@app.post("/api/v1/trips/{trip_id}/generate")
def generate_trip_recommendation(trip_id: int, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Trip with id {trip_id} not found")

    if current_user.role != "admin" and trip.user_id != current_user.id:
        db.close()
        raise HTTPException(status_code=403, detail="You do not have permission to modify this trip")

    recommendation = get_travel_recommendation(
        destination=trip.destination,
        days=trip.days,
        budget=trip.budget,
        travel_style=trip.travel_style or trip.category,
    )

    trip.ai_recommendation = recommendation
    db.commit()
    db.refresh(trip)
    db.close()

    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "recommendation": trip.ai_recommendation,
    }


# HANDS-ON LAB (Session 9) — RAG ASSISTANT ENDPOINT
@app.post("/api/v1/assistant")
def ask_assistant(request: AssistantRequest, current_user: User = Depends(get_current_user)):
    result = ask_knowledge_base(request.question)
    return {
        "question": request.question,
        "answer": result["answer"],
        "sources": result["sources"],
    }

# ⬇ENDPOINT BARU DITAMBAH DI SINI
@app.post("/api/v1/assistant/compare")
def compare_assistant(request: CompareRequest, current_user: User = Depends(get_current_user)):
    rag_result = ask_knowledge_base(request.question)
    base_answer = ask_base_model(request.question)
    return {
        "question": request.question,
        "base_model_answer": base_answer,
        "rag_answer": rag_result["answer"],
        "rag_sources": rag_result["sources"],
    }


# HANDS-ON LAB (Session 10) — CONVERSATION MEMORY ENDPOINTS
# Seluruh endpoint di bawah ini diproteksi JWT + ownership, konsisten dengan
# pola Trip (Session 8): 403 kalau bukan pemilik, admin bisa lihat/ubah semua.

# HANDS-ON LAB (Session 10, Part 3) — buat conversation baru.
# Ownership diambil dari token (Depends), TIDAK PERNAH dari body request --
# pola sama persis dengan create_trip (Session 8, Part 6).
@app.post("/api/v1/conversations")
def create_conversation(request: ConversationCreateRequest, current_user: User = Depends(get_current_user)):
    conversation = Conversation(
        user_id=current_user.id,
        title=request.title or "New Conversation",
    )

    db = SessionLocal()
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    db.close()

    return conversation_to_dict(conversation)


# HANDS-ON LAB (Session 10, Part 3) + CORE CHALLENGE — list conversation untuk sidebar.
# role "admin" boleh melihat semua conversation, role "user" hanya miliknya sendiri
# (pola sama dengan list_trips, Session 8 Homework #1).
@app.get("/api/v1/conversations")
def list_conversations(current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    query = db.query(Conversation)
    if current_user.role != "admin":
        query = query.filter(Conversation.user_id == current_user.id)
    conversations = query.order_by(Conversation.created_at.desc()).all()
    db.close()
    return [conversation_to_dict(c) for c in conversations]


# CORE CHALLENGE (Session 10) — dipanggil saat user klik salah satu conversation
# di sidebar: mengembalikan title + seluruh messages sekaligus dalam 1 request,
# supaya frontend tidak perlu 2 kali fetch untuk "load history" (PDF Part 7).
@app.get("/api/v1/conversations/{conversation_id}")
def get_conversation(conversation_id: int, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()

    if conversation is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Conversation with id {conversation_id} not found")

    if current_user.role != "admin" and conversation.user_id != current_user.id:
        db.close()
        raise HTTPException(status_code=403, detail="You do not have access to this conversation")

    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )
    db.close()

    result = conversation_to_dict(conversation)
    result["messages"] = [message_to_dict(m) for m in messages]
    return result


# BONUS (Session 10) — Rename Conversations: PATCH /api/v1/conversations/{id}
# (endpoint & method sesuai hint UI di PDF slide Bonus)
@app.patch("/api/v1/conversations/{conversation_id}")
def rename_conversation(
    conversation_id: int,
    request: ConversationRenameRequest,
    current_user: User = Depends(get_current_user),
):
    db = SessionLocal()
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()

    if conversation is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Conversation with id {conversation_id} not found")

    if current_user.role != "admin" and conversation.user_id != current_user.id:
        db.close()
        raise HTTPException(status_code=403, detail="You do not have permission to rename this conversation")

    conversation.title = request.title
    db.commit()
    db.refresh(conversation)
    db.close()

    return conversation_to_dict(conversation)


# HANDS-ON LAB (Session 10, Part 4) — SEND MESSAGE API: jantung sesi ini.
# 7 langkah sesuai PDF Part 4: receive user message -> save message ->
# load previous messages -> build prompt -> Amazon Bedrock -> save AI response
# -> return response. Endpoint yang sama dipakai baik untuk memulai percakapan
# BARU maupun MELANJUTKAN percakapan lama (PDF Part 7) -- yang beda cuma
# conversation_id di URL.
@app.post("/api/v1/conversations/{conversation_id}/messages")
def send_message(
    conversation_id: int,
    request: MessageCreateRequest,
    current_user: User = Depends(get_current_user),
):
    db = SessionLocal()
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()

    if conversation is None:
        db.close()
        raise HTTPException(status_code=404, detail=f"Conversation with id {conversation_id} not found")

    if current_user.role != "admin" and conversation.user_id != current_user.id:
        db.close()
        raise HTTPException(status_code=403, detail="You do not have permission to post in this conversation")

    # 1-2. Receive + Save Message (role="user")
    user_message = Message(conversation_id=conversation_id, role="user", content=request.content)
    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    # 3. Load Previous Messages — REKONSTRUKSI seluruh riwayat (termasuk pesan
    # yang baru saja disimpan di atas), diurutkan created_at (PDF Part 2 & 7).
    history = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    # 4-5. Build Prompt + Amazon Bedrock (lihat services/chat_service.py)
    try:
        answer = generate_chat_response(history)
    except Exception as e:
        db.close()
        raise HTTPException(status_code=502, detail=f"Failed to get response from Bedrock: {e}")

    # 6. Save AI Response (role="assistant")
    ai_message = Message(conversation_id=conversation_id, role="assistant", content=answer)
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)

    user_message_dict = message_to_dict(user_message)
    ai_message_dict = message_to_dict(ai_message)
    db.close()

    # 7. Return Response — user_message + ai_message sekaligus, supaya frontend
    # bisa langsung append 2 message bubble tanpa fetch ulang (mendukung
    # Homework: auto-scroll & typing-indicator lebih presisi tahu kapan
    # jawaban AI benar-benar datang).
    return {
        "conversation_id": conversation_id,
        "user_message": message_to_dict(user_message),
        "ai_message": message_to_dict(ai_message),
    }


@app.get("/api/v1/recommendations")
def get_recommendations():
    return ["Tokyo Tower", "Mount Fuji", "Shibuya"]


@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]


@app.get("/api/v1/trip-categories")
def get_trip_categories():
    return ["Backpacker", "Standard", "Luxury"]