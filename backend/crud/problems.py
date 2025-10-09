from datetime import datetime
from typing import Any, Dict, List, Optional

from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from database import db


def _serialize_problem(problem: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not problem:
        return None

    return {
        "id": str(problem["_id"]),
        "title": problem["title"],
        "slug": problem["slug"],
        "difficulty": problem["difficulty"],
        "description": problem.get("description", ""),
        "input_format": problem.get("input_format", ""),
        "output_format": problem.get("output_format", ""),
        "constraints": problem.get("constraints", ""),
        "topics": problem.get("topics", []),
        "companies": problem.get("companies", []),
        "examples": problem.get("examples", []),
        "created_at": problem.get("created_at"),
    }


async def ensure_indexes() -> None:
    await db.problems.create_index("slug", unique=True)
    await db.problems.create_index("difficulty")


async def create_problem(
    *,
    title: str,
    slug: str,
    difficulty: str,
    description: str,
    input_format: str,
    output_format: str,
    constraints: str,
    topics: Optional[List[str]] = None,
    companies: Optional[List[str]] = None,
    examples: Optional[List[Dict[str, Any]]] = None,
) -> Dict[str, Any]:
    document = {
        "title": title,
        "slug": slug,
        "difficulty": difficulty,
        "description": description,
        "input_format": input_format,
        "output_format": output_format,
        "constraints": constraints,
        "topics": topics or [],
        "companies": companies or [],
        "examples": examples or [],
        "created_at": datetime.utcnow(),
    }

    try:
        result = await db.problems.insert_one(document)
    except DuplicateKeyError as exc:
        raise ValueError("Problem slug already exists") from exc

    document["_id"] = result.inserted_id
    serialized = _serialize_problem(document)
    if not serialized:
        raise RuntimeError("Failed to create problem")

    return serialized


async def get_problem_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    raw_problem = await db.problems.find_one({"slug": slug})
    return _serialize_problem(raw_problem)


async def get_problem_by_id(problem_id: str) -> Optional[Dict[str, Any]]:
    try:
        object_id = ObjectId(problem_id)
    except Exception:
        return None

    raw_problem = await db.problems.find_one({"_id": object_id})
    return _serialize_problem(raw_problem)


async def list_problems(difficulty: Optional[str] = None) -> List[Dict[str, Any]]:
    query: Dict[str, Any] = {}
    if difficulty:
        query["difficulty"] = difficulty

    cursor = db.problems.find(query).sort("created_at", -1)
    problems = await cursor.to_list(None)
    return [problem for problem in map(_serialize_problem, problems) if problem]