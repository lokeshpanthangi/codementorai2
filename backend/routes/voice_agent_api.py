from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
import logging
import asyncio
import os
from datetime import datetime

from auth import verify_access_token
from crud.problems import get_problem_by_id, get_problem_by_slug
from crud.submissions import list_submissions
from crud.users import get_user_by_email
from services.voice_ai import generate_voice_response

logger = logging.getLogger("voice-agent-api")

voice_agent_router = APIRouter(
    prefix="/voice-agent",
    tags=["Voice Agent"],
    dependencies=[Depends(verify_access_token)],
)


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: Optional[datetime] = None


class VoiceAgentRequest(BaseModel):
    user_id: str
    problem_id: Optional[str] = None
    code: Optional[str] = None
    action: str  # "analyze_code", "get_submissions", "get_problem", "set_context"
    message: Optional[str] = None  # Voice transcript or additional context
    chat_history: Optional[List[ChatMessage]] = None  # Previous conversation context


class VoiceAgentResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None


@voice_agent_router.post("/analyze", response_model=VoiceAgentResponse)
async def analyze_code_endpoint(
    request: VoiceAgentRequest,
    token_data: dict = Depends(verify_access_token)
) -> VoiceAgentResponse:
    """Analyze user's code and provide AI-powered feedback."""
    try:
        # Get problem context if available
        problem_description = None
        if request.problem_id:
            try:
                problem = await get_problem_by_id(request.problem_id)
                if problem:
                    problem_description = problem.get("description", "")
            except:
                try:
                    problem = await get_problem_by_slug(request.problem_id)
                    if problem:
                        problem_description = problem.get("description", "")
                except:
                    pass
        
        # Use voice-specific AI service for intelligent responses
        voice_message = request.message or "Please analyze my code"
        
        # Convert chat history to dict format for the AI service
        chat_history_dict = None
        if request.chat_history:
            chat_history_dict = [
                {"role": msg.role, "content": msg.content}
                for msg in request.chat_history
            ]
        
        try:
            ai_feedback = await generate_voice_response(
                action=request.action,
                voice_message=voice_message,
                chat_history=chat_history_dict,
                code=request.code or "",
                language="python",  # Could be enhanced to detect language
                problem_description=problem_description
            )
            
            # Basic code metrics for additional context
            code = request.code or ""
            lines = code.split('\n') if code else []
            functions = [line.strip() for line in lines if line.strip().startswith('def ')]
            imports = [line.strip() for line in lines if line.strip().startswith(('import ', 'from '))]
            
            analysis = {
                "code_length": len(code),
                "line_count": len(lines),
                "functions": functions[:5],  # Limit to first 5
                "imports": imports,
                "feedback": ai_feedback,
                "code_analysis": {
                    "issues": [],
                    "improvements": [],
                    "complexity": "medium"
                }
            }
            
            return VoiceAgentResponse(
                success=True,
                message="AI code analysis completed successfully.",
                data=analysis
            )
            
        except HTTPException as http_error:
            # Handle AI service errors gracefully
            logger.error(f"AI service error: {http_error.detail}")
            
            # Provide fallback response
            fallback_feedback = "I'm having trouble with my AI analysis right now, but I can see your code. Let me try to help in a simpler way."
            if request.code:
                code_lines = len(request.code.split('\n'))
                fallback_feedback = f"I can see your code has {code_lines} lines. I'd be happy to help you debug or optimize it, but my AI analysis is temporarily unavailable."
            
            analysis = {
                "code_length": len(request.code) if request.code else 0,
                "line_count": len(request.code.split('\n')) if request.code else 0,
                "feedback": fallback_feedback
            }
            
            return VoiceAgentResponse(
                success=True,
                message="Basic analysis completed (AI temporarily unavailable).",
                data=analysis
            )
        
    except Exception as e:
        logger.error(f"Error in voice agent analyze endpoint: {e}")
        return VoiceAgentResponse(
            success=False,
            message=f"Error analyzing code: {str(e)}"
        )


@voice_agent_router.post("/submissions", response_model=VoiceAgentResponse)
async def get_user_submissions_endpoint(
    request: VoiceAgentRequest,
    token_data: dict = Depends(verify_access_token)
) -> VoiceAgentResponse:
    """Get user's recent submissions with AI-powered insights."""
    try:
        submissions = await list_submissions(
            user_id=request.user_id,
            problem_id=request.problem_id
        )
        
        if not submissions:
            return VoiceAgentResponse(
                success=True,
                message="No submissions found for this user.",
                data={"submissions": [], "feedback": "You haven't made any submissions yet. Ready to start coding?"}
            )
        
        # Limit to recent 5 submissions and format for response
        recent_submissions = submissions[:5]
        formatted_submissions = []
        
        for sub in recent_submissions:
            formatted_sub = {
                "id": sub["id"],
                "status": sub["status"],
                "language": sub["language"],
                "created_at": sub["created_at"],
                "code_preview": sub["code"][:100] + "..." if len(sub["code"]) > 100 else sub["code"]
            }
            formatted_submissions.append(formatted_sub)
        
        # Generate AI insights about submissions
        voice_message = request.message or "Tell me about my submissions"
        
        # Convert chat history to dict format for the AI service
        chat_history_dict = None
        if request.chat_history:
            chat_history_dict = [
                {"role": msg.role, "content": msg.content}
                for msg in request.chat_history
            ]
        
        try:
            ai_insights = await generate_voice_response(
                action="get_submissions",
                voice_message=voice_message,
                chat_history=chat_history_dict,
                submissions=recent_submissions
            )
        except:
            ai_insights = f"You have {len(recent_submissions)} recent submissions. Keep up the great work!"
        
        return VoiceAgentResponse(
            success=True,
            message=f"Found {len(recent_submissions)} recent submissions.",
            data={
                "submissions": formatted_submissions,
                "feedback": ai_insights
            }
        )
        
    except Exception as e:
        logger.error(f"Error fetching submissions: {e}")
        return VoiceAgentResponse(
            success=False,
            message=f"Error fetching submissions: {str(e)}"
        )


@voice_agent_router.post("/problem", response_model=VoiceAgentResponse)
async def get_problem_details_endpoint(
    request: VoiceAgentRequest,
    token_data: dict = Depends(verify_access_token)
) -> VoiceAgentResponse:
    """Get detailed information about a coding problem with AI assistance."""
    try:
        if not request.problem_id:
            return VoiceAgentResponse(
                success=False,
                message="Problem ID is required."
            )
        
        # Try to get by ID first, then by slug
        problem = None
        try:
            problem = await get_problem_by_id(request.problem_id)
        except:
            try:
                problem = await get_problem_by_slug(request.problem_id)
            except:
                pass
        
        if not problem:
            return VoiceAgentResponse(
                success=False,
                message=f"Problem '{request.problem_id}' not found."
            )
        
        # Format problem data for voice response
        problem_data = {
            "title": problem["title"],
            "difficulty": problem["difficulty"],
            "description": problem["description"][:300] + "..." if len(problem["description"]) > 300 else problem["description"],
            "examples_count": len(problem.get("examples", [])),
            "available_languages": list(problem.get("boilerplates", {}).keys()),
            "constraints": problem.get("constraints", "")[:200] + "..." if len(problem.get("constraints", "")) > 200 else problem.get("constraints", "")
        }
        
        # Generate AI-powered problem explanation
        voice_message = request.message or "Tell me about this problem"
        
        # Convert chat history to dict format for the AI service
        chat_history_dict = None
        if request.chat_history:
            chat_history_dict = [
                {"role": msg.role, "content": msg.content}
                for msg in request.chat_history
            ]
        
        try:
            ai_explanation = await generate_voice_response(
                action="get_problem",
                voice_message=voice_message,
                chat_history=chat_history_dict,
                problem_data=problem_data
            )
        except:
            ai_explanation = f"This is '{problem['title']}', a {problem['difficulty']} difficulty problem. I can help you understand it better!"
        
        return VoiceAgentResponse(
            success=True,
            message=f"Problem '{problem['title']}' - {problem['difficulty']} difficulty",
            data={
                **problem_data,
                "feedback": ai_explanation
            }
        )
        
    except Exception as e:
        logger.error(f"Error fetching problem: {e}")
        return VoiceAgentResponse(
            success=False,
            message=f"Error fetching problem details: {str(e)}"
        )


@voice_agent_router.get("/status")
async def voice_agent_status():
    """Check if voice agent service is available."""
    return {
        "status": "active",
        "message": "Voice agent API is running",
        "timestamp": datetime.utcnow().isoformat(),
        "features": [
            "code_analysis",
            "submission_history",
            "problem_details",
            "context_management"
        ]
    }