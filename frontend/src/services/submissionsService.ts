import apiClient from './apiClient';

export interface SubmissionTestResult {
  test_case_id?: string;
  status?: string;
  output?: string;
  exec_time?: number;
}

export interface SubmissionCreate {
  user_id: string;
  problem_id: string;
  code: string;
  language: string;
  status: 'Pending' | 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error';
  execution_time?: number;
  test_results?: SubmissionTestResult[];
}

export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  code: string;
  language: string;
  status: string;
  execution_time?: number;
  test_results: SubmissionTestResult[];
  created_at: string;
}

/**
 * Create a new submission
 */
export const createSubmission = async (submission: SubmissionCreate): Promise<Submission> => {
  const response = await apiClient.post<Submission>('/submissions/', submission);
  return response.data;
};

/**
 * Get submissions with optional filters
 */
export const getSubmissions = async (
  user_id?: string,
  problem_id?: string,
  status?: string
): Promise<Submission[]> => {
  const params: Record<string, string> = {};
  if (user_id) params.user_id = user_id;
  if (problem_id) params.problem_id = problem_id;
  if (status) params.status_filter = status;

  const response = await apiClient.get<Submission[]>('/submissions/', { params });
  return response.data;
};