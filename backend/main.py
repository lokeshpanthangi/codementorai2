import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from crud.problems import ensure_indexes as ensure_problem_indexes
from crud.submissions import ensure_indexes as ensure_submission_indexes
from crud.test_cases import ensure_indexes as ensure_test_case_indexes
from routes.problems import problem_router
from routes.submissions import submissions_router
from routes.test_cases import test_case_router
from routes.users import user_router
from routes.ai import ai_router


app = FastAPI(title="CodeMentor API", version="1.0.0")


frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:8080")
additional_origins = os.getenv("ADDITIONAL_CORS_ORIGINS", "")

allowed_origins = {
    frontend_origin.rstrip('/'),
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
}
for origin in additional_origins.split(','):
    origin = origin.strip()
    if origin:
        allowed_origins.add(origin.rstrip('/'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(allowed_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(problem_router)
app.include_router(test_case_router)
app.include_router(submissions_router)
app.include_router(ai_router)


@app.on_event("startup")
async def startup_event() -> None:
    await ensure_problem_indexes()
    await ensure_test_case_indexes()
    await ensure_submission_indexes()


@app.get("/")
async def root():
    return {"message": "Welcome to the CodeMentor API"}