import apiClient from './apiClient';

// New test case interface matching the updated schema
export interface TestCase {
  _id: string;
  question_id: string;
  stdin: string;
  expected_stdout: string;
  is_hidden: boolean;
  is_public: boolean;
  weight?: number;
  created_at: string;
  updated_at: string;
}

// Legacy test case interface for backward compatibility
export interface LegacyTestCase {
  id: string;
  problem_id: string;
  input: string;
  expected_output: string;
  parameters?: Record<string, any>;
  is_hidden: boolean;
  created_at: string;
}

// Test case creation interface
export interface TestCaseCreate {
  question_id: string;
  stdin: string;
  expected_stdout: string;
  is_hidden?: boolean;
  is_public?: boolean;
  weight?: number;
}

// Test case update interface
export interface TestCaseUpdate {
  stdin?: string;
  expected_stdout?: string;
  is_hidden?: boolean;
  is_public?: boolean;
  weight?: number;
}

/**
 * Create a new test case
 */
export const createTestCase = async (testCase: TestCaseCreate): Promise<TestCase> => {
  const response = await apiClient.post<TestCase>('/test-cases/', testCase);
  return response.data;
};

/**
 * Update an existing test case
 */
export const updateTestCase = async (testCaseId: string, updates: TestCaseUpdate): Promise<TestCase> => {
  const response = await apiClient.put<TestCase>(`/test-cases/${testCaseId}`, updates);
  return response.data;
};

/**
 * Delete a test case
 */
export const deleteTestCase = async (testCaseId: string): Promise<void> => {
  await apiClient.delete(`/test-cases/${testCaseId}`);
};

/**
 * Get public test cases for a specific question
 */
export const getPublicTestCases = async (questionId: string): Promise<TestCase[]> => {
  const response = await apiClient.get<TestCase[]>('/test-cases/public', {
    params: { question_id: questionId }
  });
  return response.data;
};

/**
 * Get hidden test cases for a specific question (admin only, for submissions)
 */
export const getHiddenTestCases = async (questionId: string): Promise<TestCase[]> => {
  const response = await apiClient.get<TestCase[]>('/test-cases/hidden', {
    params: { question_id: questionId }
  });
  return response.data;
};

/**
 * Get all test cases for a question (both public and hidden)
 */
export const getAllTestCases = async (questionId: string): Promise<TestCase[]> => {
  const response = await apiClient.get<TestCase[]>('/test-cases/all', {
    params: { question_id: questionId }
  });
  return response.data;
};

/**
 * Legacy functions for backward compatibility with problem_id
 */
export const getPublicTestCasesLegacy = async (problemId: string): Promise<TestCase[]> => {
  const response = await apiClient.get<TestCase[]>('/test-cases/public/legacy', {
    params: { problem_id: problemId }
  });
  return response.data;
};

export const getHiddenTestCasesLegacy = async (problemId: string): Promise<TestCase[]> => {
  const response = await apiClient.get<TestCase[]>('/test-cases/hidden/legacy', {
    params: { problem_id: problemId }
  });
  return response.data;
};

export const getAllTestCasesLegacy = async (problemId: string): Promise<TestCase[]> => {
  const [publicCases, hiddenCases] = await Promise.all([
    getPublicTestCasesLegacy(problemId),
    getHiddenTestCasesLegacy(problemId)
  ]);
  return [...publicCases, ...hiddenCases];
};

/**
 * Convert test case to input format for Judge0 (updated for new schema)
 */
export const convertTestCaseToInput = (testCase: TestCase): string => {
  return testCase.stdin;
};

/**
 * Get expected output from test case (updated for new schema)
 */
export const getExpectedOutput = (testCase: TestCase): string => {
  return testCase.expected_stdout;
};

/**
 * Legacy conversion functions for backward compatibility
 */
export const convertLegacyTestCaseToInput = (testCase: LegacyTestCase): string => {
  if (testCase.parameters) {
    // Convert parameters to JSON lines format
    return Object.values(testCase.parameters)
      .map(val => JSON.stringify(val))
      .join('\n');
  }
  return testCase.input;
};

export const getLegacyExpectedOutput = (testCase: LegacyTestCase): string => {
  // If expected_output is already a string, return it
  if (typeof testCase.expected_output === 'string') {
    return testCase.expected_output;
  }
  // Otherwise, convert to JSON string
  return JSON.stringify(testCase.expected_output);
};
