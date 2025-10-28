import os
import logging

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
from routes.voice_agent_api import voice_agent_router


app = FastAPI(title="CodeMentor API", version="1.0.0")


frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:8080")
additional_origins = os.getenv("ADDITIONAL_CORS_ORIGINS", "")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(problem_router)
app.include_router(test_case_router)
app.include_router(submissions_router)
app.include_router(ai_router)
app.include_router(voice_agent_router)


@app.on_event("startup")
async def startup_event() -> None:
    logger = logging.getLogger("startup")
    try:
        await ensure_problem_indexes()
        await ensure_test_case_indexes()
        await ensure_submission_indexes()
        logger.info("MongoDB indexes ensured successfully")
    except Exception:
        # Do not block service startup if DB is unreachable; log for diagnostics.
        logger.exception("Skipping index creation due to database connectivity/error")


@app.get("/")
async def root():
    return {"message": "Welcome to the CodeMentor API"}