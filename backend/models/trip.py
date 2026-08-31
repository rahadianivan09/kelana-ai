# HANDS-ON LAB (Session 8, Part 2) — trips.MODIFIED: + user_id (ownership), + updated_at
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.sql import func

from database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True)
    # HANDS-ON LAB (Session 8, Part 2) — FK ke users, setiap trip wajib punya pemilik.
    # Kolom ini di-set NOT NULL secara bertahap oleh migrations.py (lihat file itu)
    # supaya aman untuk tabel `trips` yang sudah berisi data dari sesi-sesi sebelumnya.
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    destination = Column(String, nullable=False)
    days = Column(Integer, nullable=False)
    budget = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    daily_budget = Column(Float, nullable=False)
    travel_style = Column(String, nullable=True)
    ai_recommendation = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    # HOMEWORK (Session 8) — updated_at: melacak kapan trip terakhir diubah lewat PUT
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )