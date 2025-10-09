from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from auth import verify_access_token
from crud.submissions import create_submission, list_submissions


submissions_router = APIRouter(
    prefix="/submissions",
    tags=["Submissions"],
    dependencies=[Depends(verify_access_token)],
)


class SubmissionTestResult(BaseModel):
    test_case_id: Optional[str] = Field(None, description="Reference to test case ObjectId")
    status: Optional[str] = Field(None, description="Outcome for the specific test case")
    output: Optional[str] = None
    exec_time: Optional[float] = Field(None, description="Execution time in seconds")


class SubmissionCreate(BaseModel):
    user_id: str = Field(..., description="User ObjectId")
    problem_id: str = Field(..., description="Problem ObjectId")
    code: str
    language: str
    status: str = Field(..., pattern="^(Pending|Accepted|Wrong Answer|Runtime Error|Compilation Error)$")
    execution_time: Optional[float] = None
    test_results: List[SubmissionTestResult] = Field(default_factory=list)


class SubmissionResponse(BaseModel):
    id: str
    user_id: str
    problem_id: str
    code: str
    language: str
    status: str
    execution_time: Optional[float]
    test_results: List[SubmissionTestResult]
    created_at: datetime


@submissions_router.post("/", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_submission_route(payload: SubmissionCreate) -> SubmissionResponse:
    try:
        submission = await create_submission(**payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return SubmissionResponse.model_validate(submission)


@submissions_router.get("/", response_model=List[SubmissionResponse])
async def list_submissions_route(
    user_id: Optional[str] = Query(None, description="Filter by user ObjectId"),
    problem_id: Optional[str] = Query(None, description="Filter by problem ObjectId"),
    status_filter: Optional[str] = Query(
        None,
        description="Filter by submission status",
        pattern="^(Accepted|Wrong Answer|Runtime Error|Compilation Error|Pending)$",
    ),
) -> List[SubmissionResponse]:
    submissions = await list_submissions(user_id=user_id, problem_id=problem_id, status=status_filter)
    return [SubmissionResponse.model_validate(submission) for submission in submissions]
