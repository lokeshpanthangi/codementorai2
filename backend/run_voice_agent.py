#!/usr/bin/env python3
"""
Script to run the LiveKit Voice Agent for Practisr platform.

This script runs the voice agent independently from the main FastAPI server.
The voice agent connects to LiveKit rooms and provides coding assistance.

Usage:
    python run_voice_agent.py

Environment Variables Required:
    - LIVEKIT_URL: LiveKit server URL
    - LIVEKIT_API_KEY: LiveKit API key
    - LIVEKIT_API_SECRET: LiveKit API secret
    - OPENAI_API_KEY: OpenAI API key for LLM and TTS
    - DEEPGRAM_API_KEY: Deepgram API key for STT
"""

import asyncio
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger("voice-agent-runner")


def check_environment():
    """Check if all required environment variables are set."""
    required_vars = [
        "LIVEKIT_URL",
        "LIVEKIT_API_KEY", 
        "LIVEKIT_API_SECRET",
        "OPENAI_API_KEY",
        "DEEPGRAM_API_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        logger.error("Please set these variables in your .env file or environment")
        return False
    
    logger.info("All required environment variables are set")
    return True


async def main():
    """Main function to run the voice agent."""
    logger.info("Starting Practisr Voice Agent...")
    
    # Check environment variables
    if not check_environment():
        return
    
    try:
        # Import and run the voice agent
        from routes.voice_agent import entrypoint
        from livekit.agents import WorkerOptions, cli
        
        # Run the voice agent with LiveKit CLI
        logger.info("Voice agent is ready to connect to LiveKit rooms")
        cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
        
    except ImportError as e:
        logger.error(f"Failed to import voice agent modules: {e}")
        logger.error("Make sure all LiveKit dependencies are installed:")
        logger.error("pip install livekit-agents livekit-plugins-openai livekit-plugins-deepgram livekit-plugins-silero")
    except Exception as e:
        logger.error(f"Error running voice agent: {e}")
        raise


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Voice agent stopped by user")
    except Exception as e:
        logger.error(f"Voice agent crashed: {e}")
        exit(1)