from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from auth import verify_access_token
from services.ai import generate_hint

ai_router = APIRouter(
    prefix="/ai",
    tags=["AI"],
    dependencies=[Depends(verify_access_token)],
)


class CodeAnalysisRequest(BaseModel):
    user_code: str = Field(..., min_length=1, description="The user's current code snippet")
    language: str = Field(..., description="Programming language of the submission")
    problem_description: str | None = Field(
        default=None,
        description="Full problem description or summary to provide context",
    )
    test_feedback: str | None = Field(
        default=None,
        description="Optional textual feedback from failed test cases or runtime errors",
    )
    hint_history: list[str] | None = Field(
        default=None,
        description="Previous hints returned to the user (most recent first) to maintain context",
    )


class CodeAnalysisResponse(BaseModel):
    hint: str = Field(..., description="High-level coaching hint for the user")


@ai_router.post("/analyze", response_model=CodeAnalysisResponse)
async def analyze_code(payload: CodeAnalysisRequest) -> CodeAnalysisResponse:
    hint = await generate_hint(
        user_code=payload.user_code,
        language=payload.language,
        problem_description=payload.problem_description,
        test_feedback=payload.test_feedback,
        hint_history=payload.hint_history,
    )
    return CodeAnalysisResponse(hint=hint)
