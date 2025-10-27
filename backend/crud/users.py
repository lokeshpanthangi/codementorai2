from datetime import datetime
from typing import Optional
from passlib.context import CryptContext
from bson import ObjectId
from database import db  # importing from your database.py

# Use PBKDF2-SHA256 only (no 72-byte limit); handle legacy bcrypt hashes manually without passlib init
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def _is_bcrypt_hash(hash_str: str) -> bool:
    if not isinstance(hash_str, str):
        return False
    return hash_str.startswith(("$2a$", "$2b$", "$2y$"))


# ---------- Helpers ----------
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Legacy bcrypt hash: manually verify with truncation to 72 bytes
    if _is_bcrypt_hash(hashed_password):
        try:
            import bcrypt  # type: ignore
            return bcrypt.checkpw(
                plain_password.encode("utf-8")[:72],
                hashed_password.encode("utf-8"),
            )
        except Exception:
            return False
    # Default: pbkdf2_sha256 via passlib
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


# ---------- CRUD ----------
# ✅ Create user
async def create_user(username: str, email: str, password: str) -> Optional[dict]:
    existing_user = await db.users.find_one({"$or": [{"email": email}, {"username": username}]})
    if existing_user:
        return None

    user_data = {
        "username": username,
        "email": email,
        "password_hash": get_password_hash(password),
        "created_at": datetime.utcnow(),
    }

    result = await db.users.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    user_data.pop("password_hash")
    return user_data


# ✅ Authenticate user
async def authenticate_user(email: str, password: str) -> Optional[dict]:
    user = await db.users.find_one({"email": email})
    if not user:
        return None
    if not verify_password(password, user.get("password_hash", "")):
        return None

    user["_id"] = str(user["_id"])
    user.pop("password_hash", None)
    return user


# ✅ Get user by email
async def get_user_by_email(email: str) -> Optional[dict]:
    user = await db.users.find_one({"email": email})
    if not user:
        return None
    
    user["_id"] = str(user["_id"])
    user.pop("password_hash", None)
    return user
