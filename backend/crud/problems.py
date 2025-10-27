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
        "slug": problem["slug"],
        "title": problem["title"],
        "description": problem.get("description", ""),
        "difficulty": problem["difficulty"],
        "tags": problem.get("tags", []),
        "boilerplates": problem.get("boilerplates", []),
        "input_format": problem.get("input_format", ""),
        "output_format": problem.get("output_format", ""),
        "constraints": problem.get("constraints", ""),
        "examples": problem.get("examples", []),
        "run_template": problem.get("run_template", ""),
        "time_limit_ms": problem.get("time_limit_ms", 1000),
        "memory_limit_kb": problem.get("memory_limit_kb", 65536),
        "created_at": problem.get("created_at"),
        "updated_at": problem.get("updated_at"),
    }


async def ensure_indexes() -> None:
    await db.problems.create_index("slug", unique=True)
    await db.problems.create_index("difficulty")


async def create_problem(
    *,
    slug: str,
    title: str,
    description: str,
    difficulty: str,
    tags: Optional[List[str]] = None,
    boilerplates: Optional[List[Dict[str, Any]]] = None,
    input_format: str,
    output_format: str,
    constraints: str,
    examples: Optional[List[Dict[str, Any]]] = None,
    run_template: str,
    time_limit_ms: Optional[int] = None,
    memory_limit_kb: Optional[int] = None,
) -> Dict[str, Any]:
    now = datetime.utcnow()

    document = {
        "slug": slug,
        "title": title,
        "description": description,
        "difficulty": difficulty,
        "tags": tags or [],
        "boilerplates": boilerplates or [],
        "input_format": input_format,
        "output_format": output_format,
        "constraints": constraints,
        "examples": examples or [],
        "run_template": run_template,
        "time_limit_ms": time_limit_ms or 1000,
        "memory_limit_kb": memory_limit_kb or 65536,
        "created_at": now,
        "updated_at": now,
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