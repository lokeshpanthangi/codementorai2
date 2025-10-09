from datetime import datetime
from typing import Any, Dict, List, Optional

from bson import ObjectId

from database import db


def _serialize_test_case(test_case: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not test_case:
        return None

    return {
        "id": str(test_case["_id"]),
        "problem_id": str(test_case["problem_id"]),
        "input": test_case.get("input", ""),
        "expected_output": test_case.get("expected_output", ""),
        "is_hidden": test_case.get("is_hidden", False),
        "created_at": test_case.get("created_at"),
    }


async def ensure_indexes() -> None:
    await db.test_cases.create_index("problem_id")
    await db.test_cases.create_index("is_hidden")


async def create_test_case(
    *,
    problem_id: str,
    input: str,
    expected_output: str,
    is_hidden: bool = False,
) -> Dict[str, Any]:
    try:
        problem_object_id = ObjectId(problem_id)
    except Exception as exc:
        raise ValueError("Invalid problem_id") from exc

    problem_exists = await db.problems.find_one({"_id": problem_object_id})
    if not problem_exists:
        raise ValueError("Problem not found")

    document = {
        "problem_id": problem_object_id,
        "input": input,
        "expected_output": expected_output,
        "is_hidden": is_hidden,
        "created_at": datetime.utcnow(),
    }

    result = await db.test_cases.insert_one(document)
    document["_id"] = result.inserted_id

    serialized = _serialize_test_case(document)
    if not serialized:
        raise RuntimeError("Failed to create test case")

    return serialized


async def _list_by_visibility(
    *,
    problem_id: Optional[str],
    is_hidden: Optional[bool],
) -> List[Dict[str, Any]]:
    query: Dict[str, Any] = {}
    if problem_id:
        try:
            query["problem_id"] = ObjectId(problem_id)
        except Exception:
            return []

    if is_hidden is not None:
        query["is_hidden"] = is_hidden

    cursor = db.test_cases.find(query).sort("created_at", 1)
    test_cases = await cursor.to_list(None)
    return [tc for tc in map(_serialize_test_case, test_cases) if tc]


async def list_public_test_cases(problem_id: Optional[str] = None) -> List[Dict[str, Any]]:
    return await _list_by_visibility(problem_id=problem_id, is_hidden=False)


async def list_hidden_test_cases(problem_id: Optional[str] = None) -> List[Dict[str, Any]]:
    return await _list_by_visibility(problem_id=problem_id, is_hidden=True)
