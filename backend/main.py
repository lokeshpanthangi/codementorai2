from fastapi import FastAPI

from crud.problems import ensure_indexes as ensure_problem_indexes
from routes.problems import problem_router
from routes.users import user_router


app = FastAPI(title="CodeMentor API", version="1.0.0")
app.include_router(user_router)
app.include_router(problem_router)


@app.on_event("startup")
async def startup_event() -> None:
    await ensure_problem_indexes()


@app.get("/")
async def root():
    return {"message": "Welcome to the CodeMentor API"}