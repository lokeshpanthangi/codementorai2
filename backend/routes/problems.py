from datetime import datetime
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from crud.problems import create_problem, get_problem_by_id, get_problem_by_slug, list_problems
from auth import verify_access_token
from schemas import QuestionCreate, QuestionResponse, ProblemCreate, ProblemResponse, ProblemExample


problem_router = APIRouter(
    prefix="/problems",
    tags=["Problems"],
    dependencies=[Depends(verify_access_token)],
)


@problem_router.post("/", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
async def create_question_route(payload: QuestionCreate) -> QuestionResponse:
    try:
        question = await create_problem(**payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return QuestionResponse.model_validate(question)


# Legacy endpoint for backward compatibility
@problem_router.post("/legacy", response_model=ProblemResponse, status_code=status.HTTP_201_CREATED)
async def create_problem_route(payload: ProblemCreate) -> ProblemResponse:
    try:
        problem = await create_problem(**payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return ProblemResponse.model_validate(problem)


@problem_router.get("/", response_model=List[QuestionResponse])
async def list_questions_route(difficulty: Optional[str] = Query(None, pattern="^(Easy|Medium|Hard)$")) -> List[QuestionResponse]:
    questions = await list_problems(difficulty)
    return [QuestionResponse.model_validate(question) for question in questions]


# Legacy endpoint for backward compatibility
@problem_router.get("/legacy", response_model=List[ProblemResponse])
async def list_problems_route(difficulty: Optional[str] = Query(None, pattern="^(Easy|Medium|Hard)$")) -> List[ProblemResponse]:
    problems = await list_problems(difficulty)
    return [ProblemResponse.model_validate(problem) for problem in problems]


@problem_router.get("/id/{question_id}", response_model=QuestionResponse)
async def get_question_by_id_route(question_id: str) -> QuestionResponse:
    question = await get_problem_by_id(question_id)
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    return QuestionResponse.model_validate(question)


# Legacy endpoint for backward compatibility
@problem_router.get("/legacy/id/{problem_id}", response_model=ProblemResponse)
async def get_problem_by_id_route(problem_id: str) -> ProblemResponse:
    problem = await get_problem_by_id(problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    return ProblemResponse.model_validate(problem)


@problem_router.get("/{slug}", response_model=QuestionResponse)
async def get_question_route(slug: str) -> QuestionResponse:
    question = await get_problem_by_slug(slug)
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    return QuestionResponse.model_validate(question)


# Legacy endpoint for backward compatibility
@problem_router.get("/legacy/{slug}", response_model=ProblemResponse)
async def get_problem_route(slug: str) -> ProblemResponse:
    problem = await get_problem_by_slug(slug)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    return ProblemResponse.model_validate(problem)
