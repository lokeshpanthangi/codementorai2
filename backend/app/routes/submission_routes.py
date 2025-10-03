from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
import httpx
from datetime import datetime
from app.models import SubmissionCreate, SubmissionResponse, UserInDB
from app.database import get_submissions_collection, get_testcases_collection, get_problems_collection, get_user_progress_collection
from app.auth import get_current_active_user
from app.config import settings
from bson import ObjectId

router = APIRouter(prefix="/submissions", tags=["Submissions"])

# Judge0 Language IDs
LANGUAGE_IDS = {
    "python": 71,
    "javascript": 63,
    "typescript": 74,
    "java": 62,
    "cpp": 54,
    "c": 50,
    "csharp": 51,
    "go": 60,
    "rust": 73,
    "kotlin": 78,
    "swift": 83,
    "php": 68,
    "ruby": 72,
}

async def run_code_on_judge0(source_code: str, language: str, input_data: str, expected_output: str):
    """Run code on Judge0 and return result"""
    language_id = LANGUAGE_IDS.get(language.lower())
    
    if not language_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported language: {language}"
        )
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                f"{settings.JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true",
                json={
                    "source_code": source_code,
                    "language_id": language_id,
                    "stdin": input_data,
                    "expected_output": expected_output
                },
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Judge0 error: {str(e)}"
            )

@router.post("/run", response_model=dict)
async def run_code(
    problem_id: str,
    source_code: str,
    language: str,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Run code against visible test cases (Run button)"""
    testcases_collection = await get_testcases_collection()
    
    # Get visible test cases
    cursor = testcases_collection.find({
        "problem_id": problem_id,
        "is_hidden": False
    }).sort("order", 1)
    
    testcases = await cursor.to_list(length=100)
    
    if not testcases:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No test cases found for this problem"
        )
    
    # Run code against each test case
    results = []
    for tc in testcases:
        judge_result = await run_code_on_judge0(
            source_code,
            language,
            tc["input_data"],
            tc["expected_output"]
        )
        
        results.append({
            "testCase": tc["order"],
            "passed": judge_result.get("status", {}).get("id") == 3,  # 3 = Accepted
            "stdout": judge_result.get("stdout"),
            "stderr": judge_result.get("stderr"),
            "compile_output": judge_result.get("compile_output"),
            "time": judge_result.get("time"),
            "memory": judge_result.get("memory"),
            "status": judge_result.get("status", {}).get("description")
        })
    
    passed_count = sum(1 for r in results if r["passed"])
    
    return {
        "results": results,
        "passed_count": passed_count,
        "total_count": len(results)
    }

@router.post("/submit", response_model=SubmissionResponse)
async def submit_code(
    problem_id: str,
    source_code: str,
    language: str,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Submit code against hidden test cases (Submit button)"""
    testcases_collection = await get_testcases_collection()
    submissions_collection = await get_submissions_collection()
    problems_collection = await get_problems_collection()
    progress_collection = await get_user_progress_collection()
    
    # Get hidden test cases
    cursor = testcases_collection.find({
        "problem_id": problem_id,
        "is_hidden": True
    }).sort("order", 1)
    
    testcases = await cursor.to_list(length=100)
    
    if not testcases:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No hidden test cases found for this problem"
        )
    
    # Run code against each test case
    results = []
    total_time = 0.0
    total_memory = 0.0
    
    for tc in testcases:
        judge_result = await run_code_on_judge0(
            source_code,
            language,
            tc["input_data"],
            tc["expected_output"]
        )
        
        is_passed = judge_result.get("status", {}).get("id") == 3
        
        results.append({
            "testCase": tc["order"],
            "passed": is_passed,
            "stdout": judge_result.get("stdout"),
            "stderr": judge_result.get("stderr"),
            "compile_output": judge_result.get("compile_output"),
            "time": judge_result.get("time"),
            "memory": judge_result.get("memory"),
            "status": judge_result.get("status", {}).get("description")
        })
        
        if judge_result.get("time"):
            total_time += float(judge_result["time"])
        if judge_result.get("memory"):
            total_memory += float(judge_result["memory"])
    
    passed_count = sum(1 for r in results if r["passed"])
    total_count = len(results)
    
    # Determine status
    if passed_count == total_count:
        submission_status = "Accepted"
    elif any(r.get("compile_output") for r in results):
        submission_status = "Compilation Error"
    elif any(r.get("stderr") for r in results):
        submission_status = "Runtime Error"
    else:
        submission_status = "Wrong Answer"
    
    # Save submission
    submission_data = {
        "user_id": str(current_user.id),
        "problem_id": problem_id,
        "language": language,
        "source_code": source_code,
        "status": submission_status,
        "passed_test_cases": passed_count,
        "total_test_cases": total_count,
        "execution_time": total_time / total_count if total_count > 0 else None,
        "memory_used": total_memory / total_count if total_count > 0 else None,
        "test_results": results,
        "submitted_at": datetime.utcnow()
    }
    
    # Find first failed test for error message
    first_failed = next((r for r in results if not r["passed"]), None)
    if first_failed:
        submission_data["error_message"] = first_failed.get("stderr") or first_failed.get("compile_output") or "Wrong Answer"
    
    result = await submissions_collection.insert_one(submission_data)
    submission_id = str(result.inserted_id)
    
    # Update problem stats
    await problems_collection.update_one(
        {"_id": ObjectId(problem_id)},
        {
            "$inc": {
                "total_submissions": 1,
                "total_accepted": 1 if submission_status == "Accepted" else 0
            }
        }
    )
    
    # Calculate and update acceptance rate
    problem = await problems_collection.find_one({"_id": ObjectId(problem_id)})
    if problem:
        total_subs = problem.get("total_submissions", 0) + 1
        total_acc = problem.get("total_accepted", 0) + (1 if submission_status == "Accepted" else 0)
        acceptance_rate = (total_acc / total_subs * 100) if total_subs > 0 else 0
        
        await problems_collection.update_one(
            {"_id": ObjectId(problem_id)},
            {"$set": {"acceptance_rate": round(acceptance_rate, 2)}}
        )
    
    # Update user progress
    progress_status = "Solved" if submission_status == "Accepted" else "Attempted"
    
    await progress_collection.update_one(
        {
            "user_id": str(current_user.id),
            "problem_id": problem_id
        },
        {
            "$set": {
                "status": progress_status,
                "last_attempted_at": datetime.utcnow()
            },
            "$inc": {"attempts": 1},
            "$setOnInsert": {
                "first_solved_at": datetime.utcnow() if submission_status == "Accepted" else None
            }
        },
        upsert=True
    )
    
    if submission_status == "Accepted":
        await progress_collection.update_one(
            {"user_id": str(current_user.id), "problem_id": problem_id},
            {"$set": {"best_submission_id": submission_id, "first_solved_at": datetime.utcnow()}}
        )
    
    return SubmissionResponse(
        id=submission_id,
        user_id=str(current_user.id),
        problem_id=problem_id,
        language=language,
        source_code=source_code,
        status=submission_status,
        passed_test_cases=passed_count,
        total_test_cases=total_count,
        execution_time=submission_data.get("execution_time"),
        memory_used=submission_data.get("memory_used"),
        error_message=submission_data.get("error_message"),
        submitted_at=submission_data["submitted_at"]
    )

@router.get("/user/{user_id}", response_model=List[SubmissionResponse])
async def get_user_submissions(
    user_id: str,
    problem_id: Optional[str] = None,
    current_user: UserInDB = Depends(get_current_active_user)
):
    """Get user's submissions"""
    if str(current_user.id) != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    submissions_collection = await get_submissions_collection()
    
    query = {"user_id": user_id}
    if problem_id:
        query["problem_id"] = problem_id
    
    cursor = submissions_collection.find(query).sort("submitted_at", -1).limit(50)
    submissions = await cursor.to_list(length=50)
    
    return [
        SubmissionResponse(
            id=str(sub["_id"]),
            user_id=sub["user_id"],
            problem_id=sub["problem_id"],
            language=sub["language"],
            source_code=sub["source_code"],
            status=sub["status"],
            passed_test_cases=sub["passed_test_cases"],
            total_test_cases=sub["total_test_cases"],
            execution_time=sub.get("execution_time"),
            memory_used=sub.get("memory_used"),
            error_message=sub.get("error_message"),
            submitted_at=sub["submitted_at"]
        )
        for sub in submissions
    ]
