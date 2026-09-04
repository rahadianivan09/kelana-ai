# HANDS-ON LAB (Session 10, Part 2) — tabel conversations.
# Sesuai PDF: id, user_id, created_at. + kolom `title` ditambahkan di luar ERD
# PDF Part 2 karena dibutuhkan supaya Core Challenge (sidebar list) dan Bonus
# (rename conversation) bisa jalan -- PDF Part 3 sendiri sudah menampilkan
# `title` di contoh response GET /api/v1/conversations, jadi ini menutup gap
# dokumentasi tsb, bukan menyimpang dari maksud materi.
#
# user_id: FK ke users, mengikuti pola ownership yang sama dengan Trip.user_id
# (Session 8) -- setiap conversation wajib punya pemilik, supaya user lain
# tidak bisa melihat/melanjutkan percakapan yang bukan miliknya.
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # default "New Conversation" -- cuma berubah lewat endpoint rename (BONUS)
    title = Column(String(255), nullable=False, default="New Conversation", server_default="New Conversation")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
