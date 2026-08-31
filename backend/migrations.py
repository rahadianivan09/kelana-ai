"""
HOMEWORK (Session 8) — migrasi ringan untuk mendukung fitur Auth.
Project ini belum pakai Alembic, jadi migrasi ditulis manual pakai raw SQL,
mengikuti pola yang dicontohkan PDF Sesi 8 Part 2:
  ALTER TABLE trips ADD COLUMN user_id BIGINT NOT NULL;

Yang dilakukan tiap kali server start (idempotent — aman dijalankan berkali-kali):
1. Tambah kolom trips.user_id & trips.updated_at (kalau tabel trips sudah lebih
   dulu ada dari sesi 1-7 dan belum punya kolom ini).
2. Buat 1 akun admin default kalau belum ada — sesuai request: "database yang
   udah ada masuk ke role admin".
3. Assign semua trip lama yang user_id-nya masih NULL ke akun admin tsb.
4. Kunci kolom user_id jadi NOT NULL setelah backfill selesai (aman, karena
   sudah tidak ada baris NULL yang tersisa).
"""
import os
from sqlalchemy import text
from sqlalchemy.engine import Engine

from services.auth_service import hash_password


def _column_exists(engine: Engine, table: str, column: str) -> bool:
    query = text(
        """
        SELECT 1 FROM information_schema.columns
        WHERE table_name = :table AND column_name = :column
        """
    )
    with engine.connect() as conn:
        result = conn.execute(query, {"table": table, "column": column}).first()
    return result is not None


def run_migrations(engine: Engine) -> None:
    with engine.connect() as conn:
        # --- 1. Tambah kolom trips.user_id (nullable dulu, dikunci NOT NULL di step 4) ---
        if not _column_exists(engine, "trips", "user_id"):
            conn.execute(text("ALTER TABLE trips ADD COLUMN user_id INTEGER"))
            conn.commit()

        if not _column_exists(engine, "trips", "updated_at"):
            conn.execute(text("ALTER TABLE trips ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now()"))
            conn.commit()

        # --- 2. Buat akun admin default kalau belum ada ---
        admin_email = os.getenv("ADMIN_EMAIL", "admin@kelanaai.local")
        admin_password = os.getenv("ADMIN_PASSWORD", "ChangeMe123!")

        existing_admin = conn.execute(
            text("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
        ).first()

        if existing_admin is None:
            conn.execute(
                text(
                    """
                    INSERT INTO users (name, email, password_hash, role, created_at)
                    VALUES (:name, :email, :password_hash, 'admin', now())
                    ON CONFLICT (email) DO NOTHING
                    """
                ),
                {"name": "Admin", "email": admin_email, "password_hash": hash_password(admin_password)},
            )
            conn.commit()
            admin_row = conn.execute(
                text("SELECT id FROM users WHERE email = :email"), {"email": admin_email}
            ).first()
        else:
            admin_row = existing_admin

        admin_id = admin_row[0] if admin_row else None

        # --- 3. Backfill trip lama (user_id NULL) ke admin ---
        if admin_id is not None:
            conn.execute(
                text("UPDATE trips SET user_id = :admin_id WHERE user_id IS NULL"),
                {"admin_id": admin_id},
            )
            conn.commit()

        # --- 4. Kunci NOT NULL setelah dipastikan tidak ada NULL tersisa ---
        remaining_null = conn.execute(text("SELECT COUNT(*) FROM trips WHERE user_id IS NULL")).scalar()
        if remaining_null == 0:
            conn.execute(text("ALTER TABLE trips ALTER COLUMN user_id SET NOT NULL"))
            conn.commit()