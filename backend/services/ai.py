from __future__ import annotations

import os
from typing import Optional, Sequence

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.exceptions import OutputParserException

from fastapi import HTTPException

_llm: Optional[ChatOpenAI] = None
_parser = StrOutputParser()

_SYSTEM_PROMPT = (
    "You are an expert competitive programming coach. "
    "Analyze the candidate's code, understand the described problem, "
    "and produce a short, constructive hint. "
    "Focus on the high-level approach: point out logical issues, missing edge cases, "
    "or more suitable data structures/algorithms. "
    "Never provide full code or detailed implementation. "
    "When prior hints are provided, build on them instead of repeating the same advice. "
    "Keep the hint under 25 words and encourage the user to adjust their strategy."
)

_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", _SYSTEM_PROMPT),
        (
            "human",
            """
Problem description:
{problem_description}

Programming language: {language}

User's current code:
```{language}
{user_code}
```

Observed behaviour or test feedback:
{test_feedback}

Previous hints shared with the user (most recent first):
{hint_history}

Based on this information, provide a single concise hint focused on the user's approach.
            """.strip(),
        ),
    ]
)


def _get_llm() -> ChatOpenAI:
    global _llm
    if _llm is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=503,
                detail=(
                    "AI hint service is not configured. Set the OPENAI_API_KEY environment variable "
                    "on the backend to enable AI insights."
                ),
            )
        _llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.4, api_key=api_key)
    return _llm


async def generate_hint(
    *,
    user_code: str,
    language: str,
    problem_description: Optional[str] = None,
    test_feedback: Optional[str] = None,
    hint_history: Optional[Sequence[str]] = None,
) -> str:
    """Generate a coaching hint for the provided code snippet."""

    problem_text = problem_description or "Problem statement not provided."
    feedback_text = (
        test_feedback.strip()
        if test_feedback and test_feedback.strip()
        else "No tests were run or no additional feedback is available."
    )
    history_items = [item.strip() for item in (hint_history or []) if item.strip()]
    if history_items:
        formatted_history = "\n".join(f"- {entry}" for entry in history_items[:5])
    else:
        formatted_history = "None"

    llm = _get_llm()
    messages = _prompt.format_messages(
        problem_description=problem_text,
        language=language,
        user_code=user_code,
        test_feedback=feedback_text,
        hint_history=formatted_history,
    )

    try:
        response = await llm.ainvoke(messages)
        content = response.content if isinstance(response.content, str) else str(response.content)
        hint = _parser.parse(content)
    except OutputParserException as exc:
        raise HTTPException(status_code=500, detail="Failed to parse hint from AI response") from exc
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - catch-all for upstream API errors
        raise HTTPException(status_code=502, detail="AI hint service is currently unavailable") from exc

    return hint.strip()
