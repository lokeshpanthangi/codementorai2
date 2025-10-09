from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from auth import verify_access_token
from crud.test_cases import (
    create_test_case,
    list_hidden_test_cases,
    list_public_test_cases,
)


test_case_router = APIRouter(
    prefix="/test-cases",
    tags=["Test Cases"],
    dependencies=[Depends(verify_access_token)],
)


class TestCaseCreate(BaseModel):
    problem_id: str = Field(..., description="Associated problem ObjectId")
    input: str
    expected_output: str
    is_hidden: bool = False


class TestCaseResponse(BaseModel):
    id: str
    problem_id: str
    input: str
    expected_output: str
    is_hidden: bool
    created_at: datetime


@test_case_router.post("/", response_model=TestCaseResponse, status_code=status.HTTP_201_CREATED)
async def create_test_case_route(payload: TestCaseCreate) -> TestCaseResponse:
    try:
        test_case = await create_test_case(**payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return TestCaseResponse.model_validate(test_case)


@test_case_router.get("/public", response_model=List[TestCaseResponse])
async def list_public_test_cases_route(
    problem_id: Optional[str] = Query(None, description="Filter by problem ObjectId"),
) -> List[TestCaseResponse]:
    test_cases = await list_public_test_cases(problem_id)
    return [TestCaseResponse.model_validate(tc) for tc in test_cases]


@test_case_router.get("/hidden", response_model=List[TestCaseResponse])
async def list_hidden_test_cases_route(
    problem_id: Optional[str] = Query(None, description="Filter by problem ObjectId"),
) -> List[TestCaseResponse]:
    test_cases = await list_hidden_test_cases(problem_id)
    return [TestCaseResponse.model_validate(tc) for tc in test_cases]
