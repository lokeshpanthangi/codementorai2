from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from app.models import ProblemResponse
from app.database import get_problems_collection
from bson import ObjectId

router = APIRouter(prefix="/problems", tags=["Problems"])

@router.get("", response_model=List[ProblemResponse])
async def get_all_problems(
    difficulty: Optional[str] = Query(None, description="Filter by difficulty: Easy, Medium, Hard"),
    topic: Optional[str] = Query(None, description="Filter by topic"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100)
):
    """Get all problems with optional filters"""
    problems_collection = await get_problems_collection()
    
    # Build query filter
    query = {}
    if difficulty:
        query["difficulty"] = difficulty
    if topic:
        query["topics"] = topic
    
    # Fetch problems
    cursor = problems_collection.find(query).skip(skip).limit(limit).sort("problem_number", 1)
    problems = await cursor.to_list(length=limit)
    
    # Convert to response format
    return [
        ProblemResponse(
            id=str(problem["_id"]),
            problem_number=problem["problem_number"],
            title=problem["title"],
            slug=problem["slug"],
            difficulty=problem["difficulty"],
            description=problem["description"],
            examples=problem["examples"],
            constraints=problem["constraints"],
            topics=problem["topics"],
            companies=problem["companies"],
            hints=problem.get("hints", []),
            solution_template=problem["solution_template"],
            acceptance_rate=problem.get("acceptance_rate", 0.0),
            total_submissions=problem.get("total_submissions", 0),
            total_accepted=problem.get("total_accepted", 0)
        )
        for problem in problems
    ]

@router.get("/{problem_id}", response_model=ProblemResponse)
async def get_problem_by_id(problem_id: str):
    """Get a specific problem by ID"""
    problems_collection = await get_problems_collection()
    
    # Try to find by ObjectId or by slug
    try:
        problem = await problems_collection.find_one({"_id": ObjectId(problem_id)})
    except:
        problem = await problems_collection.find_one({"slug": problem_id})
    
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Problem with id '{problem_id}' not found"
        )
    
    return ProblemResponse(
        id=str(problem["_id"]),
        problem_number=problem["problem_number"],
        title=problem["title"],
        slug=problem["slug"],
        difficulty=problem["difficulty"],
        description=problem["description"],
        examples=problem["examples"],
        constraints=problem["constraints"],
        topics=problem["topics"],
        companies=problem["companies"],
        hints=problem.get("hints", []),
        solution_template=problem["solution_template"],
        acceptance_rate=problem.get("acceptance_rate", 0.0),
        total_submissions=problem.get("total_submissions", 0),
        total_accepted=problem.get("total_accepted", 0)
    )

@router.get("/{problem_id}/stats")
async def get_problem_stats(problem_id: str):
    """Get problem statistics"""
    problems_collection = await get_problems_collection()
    
    try:
        problem = await problems_collection.find_one({"_id": ObjectId(problem_id)})
    except:
        problem = await problems_collection.find_one({"slug": problem_id})
    
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    
    return {
        "problem_id": str(problem["_id"]),
        "total_submissions": problem.get("total_submissions", 0),
        "total_accepted": problem.get("total_accepted", 0),
        "acceptance_rate": problem.get("acceptance_rate", 0.0),
        "difficulty": problem["difficulty"]
    }
