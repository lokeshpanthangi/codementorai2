from dotenv import load_dotenv
import livekit.agents as agents
from livekit.agents import VoiceAssistant, WorkerOptions, cli
from livekit.agents.llm import function_tool
from livekit.plugins import openai, deepgram, silero
from datetime import datetime
import os
import logging
from typing import Annotated, Optional, Dict, Any, List
from bson import ObjectId

# Import database and CRUD functions
from database import db
from crud.problems import get_problem_by_id, get_problem_by_slug
from crud.submissions import list_submissions
from crud.users import get_user_by_email

load_dotenv()

logger = logging.getLogger("voice-agent")


class CodingAssistant:
    """Voice assistant for coding help with access to user's code and problems."""
    
    def __init__(self):
        self.current_user_id: Optional[str] = None
        self.current_problem_id: Optional[str] = None
        self.current_code: Optional[str] = None
    
    @function_tool
    async def get_user_submissions(
        self,
        user_id: Annotated[str, "The user's ID to fetch submissions for"],
        problem_id: Annotated[Optional[str], "Optional problem ID to filter submissions"] = None,
        limit: Annotated[int, "Maximum number of submissions to return"] = 5
    ) -> str:
        """Get the user's recent submissions for analysis and help."""
        try:
            submissions = await list_submissions(
                user_id=user_id,
                problem_id=problem_id
            )
            
            if not submissions:
                return "No submissions found for this user."
            
            # Limit results and format for voice response
            recent_submissions = submissions[:limit]
            result = f"Found {len(recent_submissions)} recent submissions:\n"
            
            for i, sub in enumerate(recent_submissions, 1):
                result += f"{i}. Status: {sub['status']}, Language: {sub['language']}, "
                result += f"Submitted: {sub['created_at']}\n"
                if sub.get('code'):
                    # Show first 100 chars of code
                    code_preview = sub['code'][:100] + "..." if len(sub['code']) > 100 else sub['code']
                    result += f"   Code preview: {code_preview}\n"
            
            return result
            
        except Exception as e:
            logger.error(f"Error fetching submissions: {e}")
            return f"Error fetching submissions: {str(e)}"
    
    @function_tool
    async def get_problem_details(
        self,
        problem_identifier: Annotated[str, "Problem ID or slug to get details for"]
    ) -> str:
        """Get detailed information about a coding problem."""
        try:
            # Try to get by ID first, then by slug
            problem = None
            try:
                problem = await get_problem_by_id(problem_identifier)
            except:
                problem = await get_problem_by_slug(problem_identifier)
            
            if not problem:
                return f"Problem '{problem_identifier}' not found."
            
            result = f"Problem: {problem['title']}\n"
            result += f"Difficulty: {problem['difficulty']}\n"
            result += f"Description: {problem['description'][:200]}...\n"
            
            if problem.get('examples'):
                result += f"Examples: {len(problem['examples'])} provided\n"
            
            if problem.get('boilerplates'):
                languages = list(problem['boilerplates'].keys())
                result += f"Available languages: {', '.join(languages)}\n"
            
            if problem.get('constraints'):
                result += f"Constraints: {problem['constraints'][:100]}...\n"
            
            return result
            
        except Exception as e:
            logger.error(f"Error fetching problem: {e}")
            return f"Error fetching problem details: {str(e)}"
    
    @function_tool
    async def analyze_code(
        self,
        code: Annotated[str, "The code to analyze"],
        problem_context: Annotated[Optional[str], "Optional problem context or description"] = None
    ) -> str:
        """Analyze the provided code and give feedback."""
        try:
            if not code.strip():
                return "No code provided to analyze."
            
            # Store current code for context
            self.current_code = code
            
            analysis = "Code Analysis:\n"
            analysis += f"Code length: {len(code)} characters\n"
            
            # Basic code analysis
            lines = code.split('\n')
            analysis += f"Lines of code: {len(lines)}\n"
            
            # Check for common patterns
            if 'def ' in code:
                functions = [line.strip() for line in lines if line.strip().startswith('def ')]
                analysis += f"Functions found: {len(functions)}\n"
                for func in functions[:3]:  # Show first 3 functions
                    analysis += f"  - {func}\n"
            
            if 'import ' in code or 'from ' in code:
                imports = [line.strip() for line in lines if line.strip().startswith(('import ', 'from '))]
                analysis += f"Imports: {len(imports)}\n"
            
            # Add problem context if provided
            if problem_context:
                analysis += f"\nProblem context: {problem_context[:100]}...\n"
            
            analysis += "\nI can help you debug, optimize, or explain this code. What specific help do you need?"
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing code: {e}")
            return f"Error analyzing code: {str(e)}"
    
    @function_tool
    async def set_context(
        self,
        user_id: Annotated[Optional[str], "User ID for context"] = None,
        problem_id: Annotated[Optional[str], "Problem ID for context"] = None,
        code: Annotated[Optional[str], "Current code for context"] = None
    ) -> str:
        """Set the current context for the voice assistant."""
        try:
            if user_id:
                self.current_user_id = user_id
            if problem_id:
                self.current_problem_id = problem_id
            if code:
                self.current_code = code
            
            context_info = "Context updated:\n"
            if self.current_user_id:
                context_info += f"User ID: {self.current_user_id}\n"
            if self.current_problem_id:
                context_info += f"Problem ID: {self.current_problem_id}\n"
            if self.current_code:
                context_info += f"Code length: {len(self.current_code)} characters\n"
            
            return context_info
            
        except Exception as e:
            logger.error(f"Error setting context: {e}")
            return f"Error setting context: {str(e)}"


async def entrypoint(ctx: agents.JobContext):
    """Entry point for the voice assistant agent."""
    
    # Initialize the coding assistant
    assistant = CodingAssistant()
    
    # Create the voice assistant with proper LiveKit v1 syntax
    voice_assistant = VoiceAssistant(
        vad=silero.VAD.load(),
        stt=deepgram.STT(model="nova-2"),
        llm=openai.LLM(model=os.getenv("LLM_CHOICE", "gpt-4o-mini")),
        tts=openai.TTS(voice="echo"),
        fnc_ctx=assistant,  # Pass the assistant instance for function tools
    )
    
    # Set initial instructions for the assistant
    voice_assistant.start(ctx.room, 
        instructions="""You are a helpful coding assistant for the Practisr platform. 
        You can help users with their coding problems by:
        
        1. Analyzing their code and providing feedback
        2. Explaining coding concepts and algorithms
        3. Helping debug issues in their solutions
        4. Providing hints for coding problems
        5. Accessing their submission history for context
        
        You have access to the user's code, problem details, and submission history.
        Always be encouraging and provide constructive feedback.
        Keep responses concise but helpful since this is a voice interface.
        
        When users ask for help, try to understand their current context and provide relevant assistance.
        """)
    
    logger.info("Voice assistant started successfully")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))