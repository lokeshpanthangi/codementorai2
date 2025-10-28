from __future__ import annotations

import os
from typing import Optional, Dict, Any, List
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.exceptions import OutputParserException
from fastapi import HTTPException
import logging

logger = logging.getLogger("voice-ai")

_llm: Optional[ChatOpenAI] = None
_parser = StrOutputParser()

# Voice-specific AI prompts for different types of interactions
_CODE_ANALYSIS_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are an expert programming mentor providing voice assistance. 
    Analyze the user's code and provide helpful, conversational feedback.
    Be encouraging and specific about what you observe.
    Keep responses natural and suitable for voice interaction (2-3 sentences max).
    Focus on practical insights the user can act on immediately.
    
    If there's previous conversation context, reference it naturally to maintain continuity."""),
    ("human", """
User's voice request: {voice_message}

Problem context: {problem_description}

{chat_history_context}

Code to analyze:
```{language}
{code}
```

Provide a helpful, conversational analysis that addresses their voice request and maintains conversation flow.
""")
])

_GENERAL_ASSISTANCE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful programming assistant providing voice support.
    Respond naturally and conversationally to the user's request.
    Keep responses concise and actionable (2-3 sentences max).
    Be encouraging and supportive.
    
    If there's previous conversation context, reference it naturally to maintain continuity."""),
    ("human", """
User's voice request: {voice_message}

Context: {context}

{chat_history_context}

Provide a helpful response to their request that maintains conversation flow.
""")
])

_SUBMISSION_ANALYSIS_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are an encouraging programming mentor analyzing submission history.
    Provide encouraging insights about the user's progress and patterns.
    Keep responses conversational and motivating (2-3 sentences max).
    
    If there's previous conversation context, reference it naturally to maintain continuity."""),
    ("human", """
User's voice request: {voice_message}

Recent submissions summary:
{submissions_summary}

{chat_history_context}

Provide encouraging insights about their coding progress that maintains conversation flow.
""")
])


def _get_llm() -> ChatOpenAI:
    global _llm
    if _llm is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=503,
                detail="AI service is not configured. Set the OPENAI_API_KEY environment variable."
            )
        # Support regional routing and model selection
        base_url = os.getenv("OPENAI_BASE_URL") or os.getenv("OPENAI_API_BASE")
        model_choice = os.getenv("LLM_CHOICE", "gpt-4o-mini")
        try:
            if base_url:
                _llm = ChatOpenAI(model=model_choice, temperature=0.7, api_key=api_key, base_url=base_url)
            else:
                _llm = ChatOpenAI(model=model_choice, temperature=0.7, api_key=api_key)
        except TypeError:
            # Fallback for older langchain-openai versions that use openai_api_base
            if base_url:
                _llm = ChatOpenAI(model=model_choice, temperature=0.7, api_key=api_key, openai_api_base=base_url)
            else:
                _llm = ChatOpenAI(model=model_choice, temperature=0.7, api_key=api_key)
    return _llm


def _format_chat_history(chat_history: Optional[List[Dict[str, str]]]) -> str:
    """Format chat history for inclusion in prompts."""
    if not chat_history:
        return ""
    
    formatted_messages = []
    for message in chat_history[-3:]:  # Only include last 3 messages for context
        role = message.get("role", "")
        content = message.get("content", "")
        if role and content:
            formatted_messages.append(f"{role.capitalize()}: {content}")
    
    if formatted_messages:
        return f"Previous conversation:\n" + "\n".join(formatted_messages) + "\n"
    return ""


async def analyze_code_with_voice_context(
    code: str,
    voice_message: str,
    language: str = "python",
    problem_description: Optional[str] = None,
    chat_history: Optional[List[Dict[str, str]]] = None
) -> str:
    """Generate AI-powered code analysis based on voice input context."""
    try:
        llm = _get_llm()
        
        problem_text = problem_description or "No specific problem context provided."
        
        # Format chat history
        chat_history_context = _format_chat_history(chat_history)
        
        messages = _CODE_ANALYSIS_PROMPT.format_messages(
            voice_message=voice_message,
            problem_description=problem_text,
            chat_history_context=chat_history_context,
            code=code,
            language=language
        )
        
        response = await llm.ainvoke(messages)
        content = response.content if isinstance(response.content, str) else str(response.content)
        return _parser.parse(content).strip()
        
    except Exception as e:
        logger.error(f"Voice code analysis failed: {e}")
        raise HTTPException(
            status_code=500, 
            detail="AI analysis service is currently unavailable"
        )


async def provide_general_assistance(
    voice_message: str,
    context: Optional[str] = None,
    chat_history: Optional[List[Dict[str, str]]] = None
) -> str:
    """Provide general programming assistance based on voice input."""
    try:
        llm = _get_llm()
        
        context_text = context or "General programming assistance request."
        
        # Format chat history
        chat_history_context = _format_chat_history(chat_history)
        
        messages = _GENERAL_ASSISTANCE_PROMPT.format_messages(
            voice_message=voice_message,
            context=context_text,
            chat_history_context=chat_history_context
        )
        
        response = await llm.ainvoke(messages)
        content = response.content if isinstance(response.content, str) else str(response.content)
        return _parser.parse(content).strip()
        
    except Exception as e:
        logger.error(f"Voice general assistance failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="AI assistance service is currently unavailable"
        )


async def analyze_submission_history(
    voice_message: str,
    submissions_data: List[Dict[str, Any]],
    chat_history: Optional[List[Dict[str, str]]] = None
) -> str:
    """Analyze submission history with voice context and conversation history."""
    try:
        llm = _get_llm()
        
        # Format submissions summary
        if not submissions_data:
            submissions_summary = "No recent submissions found."
        else:
            summary_parts = []
            for sub in submissions_data[:5]:  # Limit to recent 5
                status = sub.get('status', 'unknown')
                language = sub.get('language', 'unknown')
                summary_parts.append(f"- {status} submission in {language}")
            submissions_summary = "\n".join(summary_parts)
        
        # Format chat history
        chat_history_context = _format_chat_history(chat_history)
        
        messages = _SUBMISSION_ANALYSIS_PROMPT.format_messages(
            voice_message=voice_message,
            submissions_summary=submissions_summary,
            chat_history_context=chat_history_context
        )
        
        response = await llm.ainvoke(messages)
        content = response.content if isinstance(response.content, str) else str(response.content)
        return _parser.parse(content).strip()
        
    except Exception as e:
        logger.error(f"Voice submission analysis failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="AI analysis service is currently unavailable"
        )


async def generate_voice_response(
    action: str,
    voice_message: str,
    chat_history: Optional[List[Dict[str, str]]] = None,
    **kwargs
) -> str:
    """Generate appropriate AI response based on the action and voice context with conversation history."""
    try:
        if action == "analyze_code":
            code = kwargs.get("code", "")
            language = kwargs.get("language", "python")
            problem_description = kwargs.get("problem_description")
            
            if not code.strip():
                return "I don't see any code to analyze. Could you share your code with me?"
            
            return await analyze_code_with_voice_context(
                code=code,
                voice_message=voice_message,
                language=language,
                problem_description=problem_description,
                chat_history=chat_history
            )
            
        elif action == "get_submissions":
            submissions = kwargs.get("submissions", [])
            return await analyze_submission_history(
                voice_message, 
                submissions,
                chat_history=chat_history
            )
            
        elif action == "get_problem":
            problem_data = kwargs.get("problem_data", {})
            context = f"Problem: {problem_data.get('title', 'Unknown')} - {problem_data.get('difficulty', 'Unknown')} difficulty"
            return await provide_general_assistance(
                voice_message, 
                context,
                chat_history=chat_history
            )
            
        else:
            return await provide_general_assistance(
                voice_message, 
                f"Action: {action}",
                chat_history=chat_history
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Voice response generation failed: {e}")
        return "I'm having trouble processing your request right now. Please try again."