from fastapi import APIRouter, HTTPException, status
from typing import List
from app.models import TestCaseResponse
from app.database import get_testcases_collection
from bson import ObjectId

router = APIRouter(prefix="/testcases", tags=["Test Cases"])

@router.get("/{problem_id}/visible", response_model=List[TestCaseResponse])
async def get_visible_testcases(problem_id: str):
    """Get visible test cases for a problem (for Run button)"""
    testcases_collection = await get_testcases_collection()
    
    cursor = testcases_collection.find({
        "problem_id": problem_id,
        "is_hidden": False
    }).sort("order", 1)
    
    testcases = await cursor.to_list(length=100)
    
    return [
        TestCaseResponse(
            id=str(tc["_id"]),
            problem_id=tc["problem_id"],
            is_hidden=tc["is_hidden"],
            input_data=tc["input_data"],
            expected_output=tc["expected_output"],
            explanation=tc.get("explanation"),
            order=tc["order"]
        )
        for tc in testcases
    ]

@router.get("/{problem_id}/hidden", response_model=List[TestCaseResponse])
async def get_hidden_testcases(problem_id: str):
    """Get hidden test cases for a problem (for Submit button - admin only in production)"""
    testcases_collection = await get_testcases_collection()
    
    cursor = testcases_collection.find({
        "problem_id": problem_id,
        "is_hidden": True
    }).sort("order", 1)
    
    testcases = await cursor.to_list(length=100)
    
    return [
        TestCaseResponse(
            id=str(tc["_id"]),
            problem_id=tc["problem_id"],
            is_hidden=tc["is_hidden"],
            input_data=tc["input_data"],
            expected_output=tc["expected_output"],
            explanation=tc.get("explanation"),
            order=tc["order"]
        )
        for tc in testcases
    ]

@router.get("/{problem_id}/all", response_model=List[TestCaseResponse])
async def get_all_testcases(problem_id: str):
    """Get all test cases for a problem"""
    testcases_collection = await get_testcases_collection()
    
    cursor = testcases_collection.find({
        "problem_id": problem_id
    }).sort("order", 1)
    
    testcases = await cursor.to_list(length=100)
    
    return [
        TestCaseResponse(
            id=str(tc["_id"]),
            problem_id=tc["problem_id"],
            is_hidden=tc["is_hidden"],
            input_data=tc["input_data"],
            expected_output=tc["expected_output"],
            explanation=tc.get("explanation"),
            order=tc["order"]
        )
        for tc in testcases
    ]
