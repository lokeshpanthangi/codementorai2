import apiClient from './apiClient';

interface AnalyzeCodePayload {
  user_code: string;
  language: string;
  problem_description?: string;
  test_feedback?: string;
  hint_history?: string[];
}

export interface AnalyzeCodeResponse {
  hint: string;
}

export const analyzeCode = async (
  payload: AnalyzeCodePayload
): Promise<AnalyzeCodeResponse> => {
  const response = await apiClient.post<AnalyzeCodeResponse>('/ai/analyze', payload);
  return response.data;
};
