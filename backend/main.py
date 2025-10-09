from fastapi import FastAPI
#IMPORT CORS
from fastapi.middleware.cors import CORSMiddleware


from crud.problems import ensure_indexes as ensure_problem_indexes
from crud.submissions import ensure_indexes as ensure_submission_indexes
from crud.test_cases import ensure_indexes as ensure_test_case_indexes
from routes.problems import problem_router
from routes.submissions import submissions_router
from routes.test_cases import test_case_router
from routes.users import user_router


app = FastAPI(title="CodeMentor API", version="1.0.0")
app.include_router(user_router)
app.include_router(problem_router)
app.include_router(test_case_router)
app.include_router(submissions_router)


# CORS settings
origins = [
    "http://localhost:3000",
    "https://your-frontend-domain.com",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event() -> None:
    await ensure_problem_indexes()
    await ensure_test_case_indexes()
    await ensure_submission_indexes()


@app.get("/")
async def root():
    return {"message": "Welcome to the CodeMentor API"}