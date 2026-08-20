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
    """Membuat semua tabel SQLAlchemy di database yang dikonfigurasi."""
    Base.metadata.create_all(bind=engine)