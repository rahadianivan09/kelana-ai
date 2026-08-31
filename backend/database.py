from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# load .env supaya os.getenv() bisa baca DATABASE_URL
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# engine = connection pool ke PostgreSQL
engine = create_engine(DATABASE_URL)

# SessionLocal = factory untuk bikin session per request
SessionLocal = sessionmaker(bind=engine, autoflush=False)

# Base = kelas dasar yang semua model ORM akan inherit darinya
Base = declarative_base()


def init_db() -> None:
    """Membuat semua tabel SQLAlchemy + menjalankan migrasi ringan (Sesi 8)."""
    Base.metadata.create_all(bind=engine)

    # HOMEWORK (Session 8) — jalankan migrasi auth: kolom user_id/updated_at + admin seed.
    # Import lokal (di dalam fungsi) untuk menghindari circular import dengan migrations.py.
    from migrations import run_migrations
    run_migrations(engine)