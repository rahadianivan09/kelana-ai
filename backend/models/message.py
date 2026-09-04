# HANDS-ON LAB (Session 10, Part 2) — tabel messages, sesuai ERD PDF Part 2:
# id, conversation_id (FK), role, content, created_at.
# Relasi: satu conversation punya banyak messages (1 -> N), diurutkan created_at.
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from database import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    # role: "user" atau "assistant" -- dipakai Prompt Builder (chat_service.py)
    # untuk merekonstruksi urutan giliran bicara sebelum dikirim ke Bedrock.
    role = Column(String(16), nullable=False)
    content = Column(Text, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
