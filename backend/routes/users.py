from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from crud.users import create_user,authenticate_user
from auth import create_access_token, verify_access_token

user_router = APIRouter(prefix="/users", tags=["Users"])


# ---------- Schemas ----------
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Routes ----------

@user_router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(payload: UserSignup):
    user = await create_user(payload.username, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists.")
    return {"message": "User created successfully", "user": user}


@user_router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token({"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}


@user_router.get("/me")
async def get_user_profile(token_data: dict = Depends(verify_access_token)):
    """Protected route to verify JWT and return user data"""
    email = token_data.get("sub")
    if not email:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    return {"message": f"Access granted for {email}"}
