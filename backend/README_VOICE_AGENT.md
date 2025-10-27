# Voice Agent for Practisr Platform

This document describes the LiveKit-based voice agent implementation for the Practisr coding platform.

## Overview

The voice agent provides conversational AI assistance for coding problems, allowing users to:
- Get help with their code through voice interaction
- Analyze code and receive feedback
- Access their submission history
- Get problem details and hints
- Receive coding guidance and explanations

## Architecture

The voice agent consists of two main components:

1. **LiveKit Voice Agent** (`routes/voice_agent.py`): The core voice assistant using LiveKit agents
2. **FastAPI Integration** (`routes/voice_agent_api.py`): REST API endpoints for voice agent functionality

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

The following LiveKit packages are included:
- `livekit-agents==0.8.0`
- `livekit-plugins-openai==0.8.0`
- `livekit-plugins-deepgram==0.8.0`
- `livekit-plugins-silero==0.8.0`

### 2. Environment Configuration

Add the following environment variables to your `.env` file:

```env
# LiveKit Configuration
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

# Deepgram Configuration (for Speech-to-Text)
DEEPGRAM_API_KEY=your-deepgram-api-key

# OpenAI Configuration (already configured)
OPENAI_API_KEY=your-openai-api-key

# LLM Model Choice (optional)
LLM_CHOICE=gpt-4o-mini
```

### 3. LiveKit Server Setup

You need a LiveKit server running. Options:

1. **LiveKit Cloud**: Sign up at [livekit.io](https://livekit.io)
2. **Self-hosted**: Follow [LiveKit deployment guide](https://docs.livekit.io/deploy/)
3. **Local development**: Use Docker with LiveKit server

### 4. API Keys Setup

1. **OpenAI API Key**: Already configured in your `.env`
2. **Deepgram API Key**: Sign up at [deepgram.com](https://deepgram.com) for speech-to-text
3. **LiveKit Credentials**: Get from your LiveKit server dashboard

## Running the Voice Agent

### Option 1: Standalone Voice Agent

```bash
python run_voice_agent.py
```

This runs the LiveKit voice agent independently, connecting to LiveKit rooms.

### Option 2: FastAPI Integration

The voice agent API is automatically included when running the main FastAPI server:

```bash
uvicorn main:app --reload
```

API endpoints available at:
- `POST /voice-agent/analyze` - Analyze code
- `POST /voice-agent/submissions` - Get user submissions
- `POST /voice-agent/problem` - Get problem details
- `GET /voice-agent/status` - Check agent status

## Voice Agent Features

### Function Tools Available

1. **`get_user_submissions`**: Retrieves user's recent submissions
2. **`get_problem_details`**: Gets detailed problem information
3. **`analyze_code`**: Analyzes code and provides feedback
4. **`set_context`**: Sets current user/problem context

### Voice Pipeline Components

- **VAD (Voice Activity Detection)**: Silero VAD for detecting speech
- **STT (Speech-to-Text)**: Deepgram Nova-2 model
- **LLM (Language Model)**: OpenAI GPT-4o-mini
- **TTS (Text-to-Speech)**: OpenAI TTS with "echo" voice

## Usage Examples

### Voice Interaction Flow

1. User joins a LiveKit room
2. Voice agent greets the user
3. User can ask questions like:
   - "Can you analyze my code?"
   - "Show me my recent submissions"
   - "Help me with this problem"
   - "What's wrong with my solution?"

### API Integration Example

```python
import requests

# Analyze code
response = requests.post("/voice-agent/analyze", json={
    "user_id": "user123",
    "code": "def solution(nums): return sum(nums)",
    "action": "analyze_code"
})
```

## Development Notes

### Code Structure

- `CodingAssistant` class contains all function tools
- Function tools are decorated with `@function_tool`
- Voice assistant uses proper LiveKit v1 syntax
- Database integration through existing CRUD functions

### Error Handling

- All function tools include try-catch blocks
- Logging is configured for debugging
- Graceful fallbacks for missing data

### Security

- All API endpoints require authentication
- User data access is controlled through existing auth system
- No sensitive data is logged

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all LiveKit packages are installed
2. **Environment Variables**: Check all required variables are set
3. **LiveKit Connection**: Verify LiveKit server is running and accessible
4. **API Keys**: Ensure OpenAI and Deepgram keys are valid

### Debugging

Enable debug logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Testing

Test the voice agent API endpoints:

```bash
curl -X GET http://localhost:8000/voice-agent/status
```

## Future Enhancements

Potential improvements:
- Real-time code execution feedback
- Integration with Judge0 for code testing
- Multi-language support for voice interaction
- Advanced code analysis with static analysis tools
- Integration with problem hints and solutions

## Support

For issues or questions:
1. Check the logs for error messages
2. Verify environment configuration
3. Test individual components (STT, TTS, LLM)
4. Check LiveKit server connectivity