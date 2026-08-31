# HANDS-ON LAB (Session 8, Part 2) — tabel users, fondasi fitur Authentication
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    # password_hash — never store plain text passwords (lihat services/auth_service.py)
    password_hash = Column(String(255), nullable=False)
    # role: "user" (default, semua yang register lewat form) atau "admin"
    # (dipakai untuk "mengadopsi" trip lama hasil sesi 1-7, lihat migrations.py)
    role = Column(String(20), nullable=False, default="user", server_default="user")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )