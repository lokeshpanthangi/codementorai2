from fastapi import FastAPI, APIRouter
from routes.users import user_router


app = FastAPI(title="CodeMentor API", version="1.0.0")
app.include_router(user_router)


@app.get("/")
async def root():
    return {"message": "Welcome to the CodeMentor API"}