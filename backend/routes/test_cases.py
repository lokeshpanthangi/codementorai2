from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from auth import verify_access_token
from crud.test_cases import (
    create_test_case,
    update_test_case,
    delete_test_case,
    list_hidden_test_cases,
    list_public_test_cases,
    list_all_test_cases,
    list_hidden_test_cases_legacy,
    list_public_test_cases_legacy,
)
from schemas import TestCaseCreate, TestCaseResponse, TestCaseUpdate


test_case_router = APIRouter(
    prefix="/test-cases",
    tags=["Test Cases"],
    dependencies=[Depends(verify_access_token)],
)


# New endpoints using question_id
@test_case_router.post("/", response_model=TestCaseResponse, status_code=status.HTTP_201_CREATED)
async def create_test_case_route(payload: TestCaseCreate) -> TestCaseResponse:
    try:
        test_case = await create_test_case(**payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return TestCaseResponse.model_validate(test_case)


@test_case_router.put("/{test_case_id}", response_model=TestCaseResponse)
async def update_test_case_route(test_case_id: str, payload: TestCaseUpdate) -> TestCaseResponse:
    try:
        test_case = await update_test_case(test_case_id, **payload.model_dump(exclude_unset=True))
        if not test_case:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test case not found")
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    return TestCaseResponse.model_validate(test_case)


@test_case_router.delete("/{test_case_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_test_case_route(test_case_id: str):
    success = await delete_test_case(test_case_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Test case not found")


@test_case_router.get("/public", response_model=List[TestCaseResponse])
async def list_public_test_cases_route(
    question_id: Optional[str] = Query(None, description="Filter by question ObjectId"),
) -> List[TestCaseResponse]:
    test_cases = await list_public_test_cases(question_id)
    return [TestCaseResponse.model_validate(tc) for tc in test_cases]


@test_case_router.get("/hidden", response_model=List[TestCaseResponse])
async def list_hidden_test_cases_route(
    question_id: Optional[str] = Query(None, description="Filter by question ObjectId"),
) -> List[TestCaseResponse]:
    test_cases = await list_hidden_test_cases(question_id)
    return [TestCaseResponse.model_validate(tc) for tc in test_cases]


@test_case_router.get("/all", response_model=List[TestCaseResponse])
async def list_all_test_cases_route(
    question_id: Optional[str] = Query(None, description="Filter by question ObjectId"),
) -> List[TestCaseResponse]:
    test_cases = await list_all_test_cases(question_id)
    return [TestCaseResponse.model_validate(tc) for tc in test_cases]


# Legacy endpoints for backward compatibility (using problem_id)
@test_case_router.get("/public/legacy", response_model=List[TestCaseResponse])
async def list_public_test_cases_legacy_route(
    problem_id: Optional[str] = Query(None, description="Filter by problem ObjectId (legacy)"),
) -> List[TestCaseResponse]:
    test_cases = await list_public_test_cases_legacy(problem_id)
    return [TestCaseResponse.model_validate(tc) for tc in test_cases]


@test_case_router.get("/hidden/legacy", response_model=List[TestCaseResponse])
async def list_hidden_test_cases_legacy_route(
    problem_id: Optional[str] = Query(None, description="Filter by problem ObjectId (legacy)"),
) -> List[TestCaseResponse]:
    test_cases = await list_hidden_test_cases_legacy(problem_id)
    return [TestCaseResponse.model_validate(tc) for tc in test_cases]
