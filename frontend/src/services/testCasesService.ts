import apiClient from './apiClient';

export interface TestCase {
  id: string;
  problem_id: string;
  input: string;
  expected_output: string;
  is_hidden: boolean;
  created_at: string;
}

/**
 * Get public (non-hidden) test cases for a specific problem
 */
export const getPublicTestCases = async (problemId: string): Promise<TestCase[]> => {
  const response = await apiClient.get<TestCase[]>('/test-cases/public', {
    params: { problem_id: problemId }
  });
  return response.data;
};

/**
 * Get hidden test cases for a specific problem (admin only, for submissions)
 */
export const getHiddenTestCases = async (problemId: string): Promise<TestCase[]> => {
  const response = await apiClient.get<TestCase[]>('/test-cases/hidden', {
    params: { problem_id: problemId }
  });
  return response.data;
};

/**
 * Get all test cases for a problem (both public and hidden)
 * Used during submission to run against all test cases
 */
export const getAllTestCases = async (problemId: string): Promise<TestCase[]> => {
  const [publicCases, hiddenCases] = await Promise.all([
    getPublicTestCases(problemId),
    getHiddenTestCases(problemId)
  ]);
  return [...publicCases, ...hiddenCases];
};
