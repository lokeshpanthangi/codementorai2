from datetime import datetime
from typing import Any, Dict, List, Optional

from bson import ObjectId

from database import db


def _serialize_test_result(result: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "test_case_id": str(result.get("test_case_id")) if result.get("test_case_id") else None,
        "status": result.get("status"),
        "output": result.get("output"),
        "exec_time": result.get("exec_time"),
    }


def _serialize_submission(submission: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not submission:
        return None

    test_results = submission.get("test_results", [])

    return {
        "id": str(submission["_id"]),
        "user_id": str(submission["user_id"]),
        "problem_id": str(submission["problem_id"]),
        "code": submission.get("code", ""),
        "language": submission.get("language", ""),
        "status": submission.get("status", "Pending"),
        "execution_time": submission.get("execution_time"),
        "test_results": [_serialize_test_result(result) for result in test_results],
        "created_at": submission.get("created_at"),
    }


async def ensure_indexes() -> None:
    await db.submissions.create_index("user_id")
    await db.submissions.create_index("problem_id")
    await db.submissions.create_index("status")


async def create_submission(
    *,
    user_id: str,
    problem_id: str,
    code: str,
    language: str,
    status: str,
    execution_time: Optional[float],
    test_results: Optional[List[Dict[str, Any]]],
) -> Dict[str, Any]:
    try:
        user_object_id = ObjectId(user_id)
        problem_object_id = ObjectId(problem_id)
    except Exception as exc:
        raise ValueError("Invalid user_id or problem_id") from exc

    user_exists = await db.users.find_one({"_id": user_object_id})
    if not user_exists:
        raise ValueError("User not found")

    problem_exists = await db.problems.find_one({"_id": problem_object_id})
    if not problem_exists:
        raise ValueError("Problem not found")

    normalized_results: List[Dict[str, Any]] = []
    if test_results:
        for result in test_results:
            test_case_id = result.get("test_case_id")
            test_case_object_id: Optional[ObjectId] = None
            if test_case_id:
                try:
                    test_case_object_id = ObjectId(test_case_id)
                except Exception as exc:
                    raise ValueError("Invalid test_case_id in test_results") from exc

            normalized_results.append(
                {
                    "test_case_id": test_case_object_id,
                    "status": result.get("status"),
                    "output": result.get("output"),
                    "exec_time": result.get("exec_time"),
                }
            )

    document = {
        "user_id": user_object_id,
        "problem_id": problem_object_id,
        "code": code,
        "language": language,
        "status": status,
        "execution_time": execution_time,
        "test_results": normalized_results,
        "created_at": datetime.utcnow(),
    }

    result = await db.submissions.insert_one(document)
    document["_id"] = result.inserted_id

    serialized = _serialize_submission(document)
    if not serialized:
        raise RuntimeError("Failed to create submission")

    return serialized


async def list_submissions(
    *,
    user_id: Optional[str] = None,
    problem_id: Optional[str] = None,
    status: Optional[str] = None,
) -> List[Dict[str, Any]]:
    query: Dict[str, Any] = {}

    if user_id:
        try:
            query["user_id"] = ObjectId(user_id)
        except Exception:
            return []

    if problem_id:
        try:
            query["problem_id"] = ObjectId(problem_id)
        except Exception:
            return []

    if status:
        query["status"] = status

    cursor = db.submissions.find(query).sort("created_at", -1)
    submissions = await cursor.to_list(None)
    return [submission for submission in map(_serialize_submission, submissions) if submission]
