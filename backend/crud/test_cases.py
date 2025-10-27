from datetime import datetime
from typing import Any, Dict, List, Optional

from bson import ObjectId

from database import db


def _serialize_test_case(test_case: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not test_case:
        return None

    return {
        "id": str(test_case["_id"]),
        "question_id": str(test_case["question_id"]),
        "stdin": test_case.get("stdin", ""),
        "expected_stdout": test_case.get("expected_stdout", ""),
        "is_hidden": test_case.get("is_hidden", False),
        "is_public": test_case.get("is_public", True),
        "weight": test_case.get("weight"),
        "created_at": test_case.get("created_at"),
        "updated_at": test_case.get("updated_at"),
    }


async def ensure_indexes() -> None:
    await db.test_cases.create_index("question_id")
    await db.test_cases.create_index("is_hidden")
    await db.test_cases.create_index("is_public")


async def create_test_case(
    *,
    question_id: str,
    stdin: str = "",
    expected_stdout: str = "",
    is_hidden: bool = False,
    is_public: bool = True,
    weight: Optional[float] = None,
) -> Dict[str, Any]:
    try:
        question_object_id = ObjectId(question_id)
    except Exception as exc:
        raise ValueError("Invalid question_id") from exc

    # Check if question exists (using problems collection)
    question_exists = await db.problems.find_one({"_id": question_object_id})
    if not question_exists:
        raise ValueError("Question not found")

    now = datetime.utcnow()
    document = {
        "question_id": question_object_id,
        "stdin": stdin,
        "expected_stdout": expected_stdout,
        "is_hidden": is_hidden,
        "is_public": is_public,
        "weight": weight,
        "created_at": now,
        "updated_at": now,
    }

    result = await db.test_cases.insert_one(document)
    document["_id"] = result.inserted_id

    serialized = _serialize_test_case(document)
    if not serialized:
        raise RuntimeError("Failed to create test case")

    return serialized


async def update_test_case(
    test_case_id: str,
    *,
    stdin: Optional[str] = None,
    expected_stdout: Optional[str] = None,
    is_hidden: Optional[bool] = None,
    is_public: Optional[bool] = None,
    weight: Optional[float] = None,
) -> Optional[Dict[str, Any]]:
    try:
        object_id = ObjectId(test_case_id)
    except Exception as exc:
        raise ValueError("Invalid test_case_id") from exc

    update_data = {"updated_at": datetime.utcnow()}
    
    if stdin is not None:
        update_data["stdin"] = stdin
    if expected_stdout is not None:
        update_data["expected_stdout"] = expected_stdout
    if is_hidden is not None:
        update_data["is_hidden"] = is_hidden
    if is_public is not None:
        update_data["is_public"] = is_public
    if weight is not None:
        update_data["weight"] = weight

    result = await db.test_cases.find_one_and_update(
        {"_id": object_id},
        {"$set": update_data},
        return_document=True
    )

    return _serialize_test_case(result)


async def _list_by_visibility(
    *,
    question_id: Optional[str],
    is_hidden: Optional[bool],
    is_public: Optional[bool] = None,
) -> List[Dict[str, Any]]:
    query: Dict[str, Any] = {}
    if question_id:
        try:
            query["question_id"] = ObjectId(question_id)
        except Exception:
            return []

    if is_hidden is not None:
        query["is_hidden"] = is_hidden
    
    if is_public is not None:
        query["is_public"] = is_public

    cursor = db.test_cases.find(query).sort("created_at", 1)
    test_cases = await cursor.to_list(None)
    return [tc for tc in map(_serialize_test_case, test_cases) if tc]


async def list_public_test_cases(question_id: Optional[str] = None) -> List[Dict[str, Any]]:
    return await _list_by_visibility(question_id=question_id, is_hidden=False, is_public=True)


async def list_hidden_test_cases(question_id: Optional[str] = None) -> List[Dict[str, Any]]:
    return await _list_by_visibility(question_id=question_id, is_hidden=True)


async def list_all_test_cases(question_id: Optional[str] = None) -> List[Dict[str, Any]]:
    return await _list_by_visibility(question_id=question_id, is_hidden=None)


async def delete_test_case(test_case_id: str) -> bool:
    try:
        object_id = ObjectId(test_case_id)
    except Exception:
        return False

    result = await db.test_cases.delete_one({"_id": object_id})
    return result.deleted_count > 0


# Legacy functions for backward compatibility
async def list_public_test_cases_legacy(problem_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Legacy function that maps problem_id to question_id"""
    return await list_public_test_cases(problem_id)


async def list_hidden_test_cases_legacy(problem_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Legacy function that maps problem_id to question_id"""
    return await list_hidden_test_cases(problem_id)
