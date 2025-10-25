import axios from 'axios';
import { wrapUserCode, DEFAULT_WRAPPERS, needsWrapper } from './codeWrapperService';

// Judge0 API Configuration - Get from environment variables
const JUDGE0_API_URL = import.meta.env.VITE_JUDGE0_URL || 'http://localhost:2358';
const JUDGE0_API_KEY = import.meta.env.VITE_JUDGE0_API_KEY;

// Debug logging
console.log('🔧 Judge0 Configuration:', {
  url: JUDGE0_API_URL,
  hasApiKey: !!JUDGE0_API_KEY,
  apiKeyPrefix: JUDGE0_API_KEY ? JUDGE0_API_KEY.substring(0, 10) + '...' : 'none'
});

// Check if using RapidAPI
const isRapidAPI = JUDGE0_API_URL.includes('rapidapi.com');

// Create axios instance with proper headers
const judge0Client = axios.create({
  baseURL: JUDGE0_API_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(JUDGE0_API_KEY && isRapidAPI && {
      'X-RapidAPI-Key': JUDGE0_API_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    }),
    ...(JUDGE0_API_KEY && !isRapidAPI && {
      'Authorization': `Bearer ${JUDGE0_API_KEY}`
    })
  }
});

// Language IDs for Judge0 - Popular Languages 2025
export const LANGUAGE_IDS: Record<string, number> = {
  // Most Popular
  python: 71,           // Python 3.8.1
  javascript: 63,       // JavaScript (Node.js 12.14.0)
  typescript: 74,       // TypeScript 3.7.4
  java: 62,             // Java (OpenJDK 13.0.1)
  cpp: 54,              // C++ (GCC 9.2.0)
  c: 50,                // C (GCC 9.2.0)
  csharp: 51,           // C# (Mono 6.6.0.161)
  
  // Web Development
  php: 68,              // PHP 7.4.1
  ruby: 72,             // Ruby 2.7.0
  go: 60,               // Go 1.13.5
  rust: 73,             // Rust 1.40.0
  kotlin: 78,           // Kotlin 1.3.70
  swift: 83,            // Swift 5.2.3
  
  // Scripting
  bash: 46,             // Bash 5.0.0
  perl: 85,             // Perl 5.28.1
  lua: 64,              // Lua 5.3.5
  
  // Functional
  haskell: 61,          // Haskell GHC 8.8.1
  scala: 81,            // Scala 2.13.2
  elixir: 57,           // Elixir 1.9.4
  
  // Data Science
  r: 80,                // R 4.0.0
  
  // Systems
  assembly: 45,         // Assembly (NASM 2.14.02)
  d: 56,                // D (DMD 2.089.1)
};

export interface SubmissionResult {
  stdout: string | null;
  stderr: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
  compile_output: string | null;
  token: string;
}

export interface CodeSubmission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

/**
 * Submit code for execution
 * @param sourceCode - User's code (function implementation only)
 * @param language - Programming language
 * @param stdin - Standard input for the program
 * @param expectedOutput - Expected output (optional)
 * @param wrapperTemplate - Wrapper code template to wrap user's code (optional)
 * @param functionName - Name of the function to call (default: 'solution')
 * @param options - Additional options including wrapper configuration
 */
export const submitCode = async (
  sourceCode: string,
  language: string,
  stdin: string = '',
  expectedOutput?: string,
  wrapperTemplate?: string,
  functionName: string = 'solution',
  options?: { 
    noWrap?: boolean;
    functionSignature?: string;
    inputParsing?: string;
    outputFormatting?: string;
  }
): Promise<SubmissionResult> => {
  try {
    // Decide whether to wrap code or run as-is
    const noWrap = options?.noWrap === true;
    let finalCode = sourceCode;
    
    if (!noWrap && wrapperTemplate && wrapperTemplate.trim() !== '') {
      // Use problem-specific wrapper
      finalCode = wrapUserCode({
        userCode: sourceCode,
        wrapperTemplate: wrapperTemplate,
        functionName: functionName,
        functionSignature: options?.functionSignature,
        inputParsing: options?.inputParsing,
        outputFormatting: options?.outputFormatting
      }, language);
      console.log('🔄 Using problem-specific wrapper code');
    } else if (!noWrap && needsWrapper(sourceCode, language)) {
      // Use default wrapper if needed
      const defaultWrapper = DEFAULT_WRAPPERS[language];
      if (defaultWrapper) {
        finalCode = wrapUserCode({
          userCode: sourceCode,
          wrapperTemplate: defaultWrapper,
          functionName: functionName,
          functionSignature: options?.functionSignature,
          inputParsing: options?.inputParsing,
          outputFormatting: options?.outputFormatting
        }, language);
        console.log('🔄 Using default wrapper code for', language);
      }
    }

    const submission: CodeSubmission = {
      source_code: finalCode,
      language_id: LANGUAGE_IDS[language],
      stdin: stdin,
      cpu_time_limit: 2, // 2 seconds
      memory_limit: 128000, // 128 MB
    };

    if (expectedOutput) {
      submission.expected_output = expectedOutput;
    }

    console.log('📤 Submitting to Judge0:', {
      url: judge0Client.defaults.baseURL,
      language,
      language_id: LANGUAGE_IDS[language],
      stdin_length: stdin.length,
      code_length: finalCode.length,
      wrapped: finalCode !== sourceCode
    });

    // Submit and wait for result
    const response = await judge0Client.post(
      '/submissions?base64_encoded=false&wait=true',
      submission
    );

    console.log('📥 Judge0 Response:', {
      status: response.data.status.description,
      time: response.data.time,
      memory: response.data.memory
    });

    return response.data;
  } catch (error) {
    console.error('Judge0 submission error:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Judge0 API authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Judge0 API rate limit exceeded. Please try again later.');
      }
      console.error('Error details:', error.response?.data);
    }
    throw new Error('Failed to execute code. Please check your Judge0 configuration.');
  }
};

/**
 * Run code with test cases
 * @param sourceCode - User's code
 * @param language - Programming language
 * @param testCases - Array of test cases with input and expected output
 * @param wrapperTemplate - Wrapper code template (optional)
 * @param functionName - Function name (optional)
 * @param options - Additional options including wrapper configuration
 */
export const runTestCases = async (
  sourceCode: string,
  language: string,
  testCases: Array<{ input: string; expectedOutput: string }>,
  wrapperTemplate?: string,
  functionName: string = 'solution',
  options?: { 
    noWrap?: boolean;
    wrapperTemplate?: string;
    functionSignature?: string;
    inputParsing?: string;
    outputFormatting?: string;
  }
): Promise<Array<SubmissionResult & { passed: boolean; testCase: number }>> => {
  const results = await Promise.all(
    testCases.map(async (testCase, index) => {
      const result = await submitCode(
        sourceCode,
        language,
        testCase.input,
        testCase.expectedOutput,
        options?.wrapperTemplate || wrapperTemplate,
        functionName,
        {
          noWrap: options?.noWrap,
          functionSignature: options?.functionSignature,
          inputParsing: options?.inputParsing,
          outputFormatting: options?.outputFormatting
        }
      );

      // Check if test passed
      const passed = result.status.id === 3 && // Status 3 = Accepted
        result.stdout?.trim() === testCase.expectedOutput.trim();

      return {
        ...result,
        passed,
        testCase: index + 1,
      };
    })
  );

  return results;
};

/**
 * Get submission by token (for async submissions)
 */
export const getSubmission = async (token: string): Promise<SubmissionResult> => {
  try {
    const response = await judge0Client.get(
      `/submissions/${token}?base64_encoded=false`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching submission:', error);
    throw new Error('Failed to fetch submission result');
  }
};

/**
 * Check if Judge0 is running
 */
export const checkJudge0Status = async (): Promise<boolean> => {
  try {
    const response = await judge0Client.get('/about');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Status descriptions for Judge0
 */
export const STATUS_DESCRIPTIONS: Record<number, { name: string; color: string }> = {
  1: { name: 'In Queue', color: 'text-yellow-500' },
  2: { name: 'Processing', color: 'text-blue-500' },
  3: { name: 'Accepted', color: 'text-green-500' },
  4: { name: 'Wrong Answer', color: 'text-red-500' },
  5: { name: 'Time Limit Exceeded', color: 'text-orange-500' },
  6: { name: 'Compilation Error', color: 'text-red-500' },
  7: { name: 'Runtime Error (SIGSEGV)', color: 'text-red-500' },
  8: { name: 'Runtime Error (SIGXFSZ)', color: 'text-red-500' },
  9: { name: 'Runtime Error (SIGFPE)', color: 'text-red-500' },
  10: { name: 'Runtime Error (SIGABRT)', color: 'text-red-500' },
  11: { name: 'Runtime Error (NZEC)', color: 'text-red-500' },
  12: { name: 'Runtime Error (Other)', color: 'text-red-500' },
  13: { name: 'Internal Error', color: 'text-gray-500' },
  14: { name: 'Exec Format Error', color: 'text-red-500' },
};
