"""
Auth Service — HANDS-ON LAB (Session 8).
Berisi logika: hash/verify password, generate/decode JWT, register & login.
Dipisah dari main.py, mengikuti pola layered architecture yang sudah ada
(trip_service.py = business logic trip, auth_service.py = business logic auth).
"""
import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt, JWTError
import bcrypt
from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.user import User

load_dotenv()

# HANDS-ON LAB (Session 8, Part 4) — SECRET_KEY & durasi token, dari .env
# (jangan hardcode di production; tambahkan JWT_SECRET_KEY di backend/.env)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))  # default 24 jam

# HANDS-ON LAB (Session 8, Part 3) — SECURITY RULE: never store plain text passwords
def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(),
    ).decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        password_hash.encode("utf-8"),
    )


# HANDS-ON LAB (Session 8, Part 4) — JWT = identitas user, stateless (no server session)
def create_access_token(user_id: int, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "role": role, "exp": expire}
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
    except JWTError:
        raise ValueError("Invalid or expired token")


# HANDS-ON LAB (Session 8, Part 3) — Register Endpoint (business logic)
def register(db: Session, name: str, email: str, password: str) -> User:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=name,
        email=email,
        password_hash=hash_password(password),
        role="user",  # user baru daftar sendiri SELALU role "user", tidak bisa diubah dari frontend
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# HANDS-ON LAB (Session 8, Part 4) — Login Endpoint (business logic)
def login(db: Session, email: str, password: str) -> str:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return create_access_token(user_id=user.id, role=user.role)