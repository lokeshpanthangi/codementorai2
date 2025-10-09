from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from crud.problems import create_problem, get_problem_by_id, get_problem_by_slug, list_problems
from auth import verify_access_token


problem_router = APIRouter(
    prefix="/problems",
    tags=["Problems"],
    dependencies=[Depends(verify_access_token)],
)


class ProblemExample(BaseModel):
    input: str
    output: str
    explanation: Optional[str] = None


class ProblemCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    slug: str = Field(..., min_length=3, max_length=200)
    difficulty: str = Field(..., pattern="^(Easy|Medium|Hard)$")
    description: str
    input_format: str
    output_format: str
    constraints: str
    topics: List[str] = Field(default_factory=list)
    companies: List[str] = Field(default_factory=list)
    examples: List[ProblemExample] = Field(default_factory=list)


class ProblemResponse(BaseModel):
    id: str
    title: str
    slug: str
    difficulty: str
    description: str
    input_format: str
    output_format: str
    constraints: str
    topics: List[str]
    companies: List[str]
    examples: List[ProblemExample]
    created_at: datetime


@problem_router.post("/", response_model=ProblemResponse, status_code=status.HTTP_201_CREATED)
async def create_problem_route(payload: ProblemCreate) -> ProblemResponse:
    try:
        problem = await create_problem(**payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return ProblemResponse.model_validate(problem)


@problem_router.get("/", response_model=List[ProblemResponse])
async def list_problems_route(difficulty: Optional[str] = Query(None, pattern="^(Easy|Medium|Hard)$")) -> List[ProblemResponse]:
    problems = await list_problems(difficulty)
    return [ProblemResponse.model_validate(problem) for problem in problems]


@problem_router.get("/id/{problem_id}", response_model=ProblemResponse)
async def get_problem_by_id_route(problem_id: str) -> ProblemResponse:
    problem = await get_problem_by_id(problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    return ProblemResponse.model_validate(problem)


@problem_router.get("/{slug}", response_model=ProblemResponse)
async def get_problem_route(slug: str) -> ProblemResponse:
    problem = await get_problem_by_slug(slug)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    return ProblemResponse.model_validate(problem)
