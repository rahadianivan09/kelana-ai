# HANDS-ON LAB (Session 8, Part 5) — Protect FastAPI endpoints
# Dependency ini di-inject via `Depends(get_current_user)` ke endpoint mana pun
# yang butuh proteksi. FastAPI otomatis menjalankan fungsi ini sebelum handler.
from fastapi import Header, HTTPException, Depends

from database import SessionLocal
from models.user import User
from services.auth_service import decode_access_token


def get_current_user(authorization: str = Header(None)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = authorization.split(" ", 1)[1]
    try:
        payload = decode_access_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    db = SessionLocal()
    user = db.query(User).filter(User.id == int(user_id)).first()
    db.close()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# Disiapkan untuk kebutuhan admin-only endpoint di masa depan (belum dipakai
# endpoint mana pun di sesi 8 ini — role admin sekarang cukup lewat pengecekan
# `current_user.role == "admin"` langsung di main.py).
def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return current_user