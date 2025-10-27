const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface VoiceAgentRequest {
  user_id: string;
  problem_id?: string;
  code?: string;
  action: string;
  message?: string;
  chat_history?: ChatMessage[];
}

export interface VoiceAgentResponse {
  success: boolean;
  message: string;
  data?: {
    feedback?: string;
    code_analysis?: {
      issues: string[];
      improvements: string[];
      complexity: string;
    };
    [key: string]: any;
  };
}

export interface VoiceAgentStatus {
  status: string;
  is_active: boolean;
  last_interaction?: string;
}

// Chat history management
class ChatHistoryManager {
  private history: ChatMessage[] = [];
  private maxHistoryLength = 10; // Keep last 10 messages

  addMessage(role: 'user' | 'assistant', content: string): void {
    const message: ChatMessage = {
      role,
      content,
      timestamp: new Date()
    };
    
    this.history.push(message);
    
    // Keep only the most recent messages
    if (this.history.length > this.maxHistoryLength) {
      this.history = this.history.slice(-this.maxHistoryLength);
    }
  }

  getHistory(): ChatMessage[] {
    return [...this.history]; // Return a copy
  }

  clearHistory(): void {
    this.history = [];
  }

  getRecentHistory(count: number = 6): ChatMessage[] {
    return this.history.slice(-count);
  }
}

export const chatHistoryManager = new ChatHistoryManager();

// Voice Agent API Service
export const analyzeCodeWithVoiceAgent = async (request: VoiceAgentRequest): Promise<VoiceAgentResponse> => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    // Add chat history to the request
    const requestWithHistory = {
      ...request,
      chat_history: chatHistoryManager.getRecentHistory()
    };

    // Add user message to chat history if provided
    if (request.message) {
      chatHistoryManager.addMessage('user', request.message);
    }

    // Log the request payload for debugging
    console.log('Voice Agent Request Payload:', JSON.stringify(requestWithHistory, null, 2));

    const response = await fetch(`${API_BASE_URL}/voice-agent/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestWithHistory),
    });

    console.log('Voice Agent Response Status:', response.status);
    console.log('Voice Agent Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Voice Agent Error Response:', errorText);
      
      if (response.status === 401) {
        // Handle authentication error
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        throw new Error('Authentication expired. Please log in again.');
      }
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    console.log('Voice Agent Success Response:', data);
    
    // Add assistant response to chat history
    if (data.success && data.data?.feedback) {
      chatHistoryManager.addMessage('assistant', data.data.feedback);
    }
    
    return data;
  } catch (error) {
    console.error('Error analyzing code with voice agent:', error);
    throw error;
  }
};

// Get user submissions for voice agent context
export const getUserSubmissionsForVoiceAgent = async (userId: string, problemId?: string): Promise<any[]> => {
  try {
    const params = new URLSearchParams({ user_id: userId });
    if (problemId) {
      params.append('problem_id', problemId);
    }

    const response = await fetch(`${API_BASE_URL}/voice-agent/submissions?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user submissions for voice agent:', error);
    throw error;
  }
};

export const getUserSubmissions = async (userId: string, message?: string): Promise<VoiceAgentResponse> => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const requestPayload = {
      user_id: userId,
      action: 'get_submissions',
      message: message || 'Tell me about my submissions',
      chat_history: chatHistoryManager.getRecentHistory()
    };

    // Add user message to chat history if provided
    if (message) {
      chatHistoryManager.addMessage('user', message);
    }

    const response = await fetch(`${API_BASE_URL}/voice-agent/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        throw new Error('Authentication expired. Please log in again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Add assistant response to chat history
    if (data.success && data.data?.feedback) {
      chatHistoryManager.addMessage('assistant', data.data.feedback);
    }
    
    return data;
  } catch (error) {
    console.error('Error getting user submissions:', error);
    throw error;
  }
};

export const getProblemDetailsForVoiceAgent = async (problemId: string, message?: string): Promise<VoiceAgentResponse> => {
  try {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    const requestPayload = {
      user_id: 'current_user', // This should be replaced with actual user ID
      problem_id: problemId,
      action: 'get_problem',
      message: message || 'Tell me about this problem',
      chat_history: chatHistoryManager.getRecentHistory()
    };

    // Add user message to chat history if provided
    if (message) {
      chatHistoryManager.addMessage('user', message);
    }

    const response = await fetch(`${API_BASE_URL}/voice-agent/problem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        throw new Error('Authentication expired. Please log in again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Add assistant response to chat history
    if (data.success && data.data?.feedback) {
      chatHistoryManager.addMessage('assistant', data.data.feedback);
    }
    
    return data;
  } catch (error) {
    console.error('Error getting problem details:', error);
    throw error;
  }
};

export const checkVoiceAgentStatus = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/voice-agent/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking voice agent status:', error);
    throw error;
  }
};

// Web Speech API integration for voice input
export class VoiceSpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening = false;
  private onTranscriptCallback: ((transcript: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    if (this.isSupported()) {
      this.initializeRecognition();
    }
  }

  private initializeRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.setupRecognition();
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      
      if (finalTranscript && this.onTranscriptCallback) {
        this.onTranscriptCallback(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Speech recognition error';
      switch (event.error) {
        case 'network':
          errorMessage = 'Network error. Please check your internet connection and try again.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone permissions and try again.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage = 'Audio capture failed. Please check your microphone.';
          break;
        case 'service-not-allowed':
          errorMessage = 'Speech service not allowed. Please use HTTPS or localhost.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      if (this.onErrorCallback) {
        this.onErrorCallback(errorMessage);
      }
      
      this.isListening = false;
      
      // Auto-retry for network errors
      if (event.error === 'network' && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => {
          if (this.onErrorCallback) {
            this.onErrorCallback(`Retrying... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          }
          this.startListening(this.onTranscriptCallback!, this.onErrorCallback!);
        }, 2000);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.onstart = () => {
      this.reconnectAttempts = 0; // Reset on successful start
    };
  }

  // Start listening for voice input
  startListening(
    onResult: (transcript: string) => void,
    onError: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser');
      return false;
    }

    if (this.isListening) {
      return true;
    }

    // Store callbacks for potential reconnection
    this.onTranscriptCallback = onResult;
    this.onErrorCallback = onError;

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      const errorMessage = `Failed to start speech recognition: ${error}`;
      onError(errorMessage);
      return false;
    }
  }

  // Stop listening
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.onTranscriptCallback = null;
      this.onErrorCallback = null;
      this.reconnectAttempts = 0;
    }
  }

  // Speak text using Text-to-Speech
  speak(text: string, onEnd?: () => void): void {
    if (!text.trim()) return;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    // Handle browser-specific issues with speech synthesis
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };

    this.synthesis.speak(utterance);
  }

  // Stop speaking
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }

  // Check if speech recognition is supported
  isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  // Check if browser supports HTTPS or is localhost
  isSecureContext(): boolean {
    return window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  }

  // Get user-friendly setup instructions
  getSetupInstructions(): string {
    if (!this.isSupported()) {
      return 'Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.';
    }
    
    if (!this.isSecureContext()) {
      return 'Voice recognition requires HTTPS or localhost. Please use a secure connection.';
    }
    
    return 'Click the microphone button and allow microphone access when prompted.';
  }
}

// Export singleton instance
export const voiceSpeechService = new VoiceSpeechService();