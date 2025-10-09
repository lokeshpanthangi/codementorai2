from datetime import datetime
from typing import Optional
from passlib.context import CryptContext
from bson import ObjectId
from database import db  # importing from your database.py

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------- Helpers ----------
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


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
        "created_at": datetime.utcnow()
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
    if not verify_password(password, user["password_hash"]):
        return None

    user["_id"] = str(user["_id"])
    user.pop("password_hash")
    return user
