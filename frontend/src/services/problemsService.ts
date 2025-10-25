import apiClient from './apiClient';

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  topics: string[];
  companies: string[];
  examples: ProblemExample[];
  created_at: string;
  updated_at: string;
  boilerplates: Record<string, string>;
  wrapper_code: Record<string, string>;
  function_name: string;
  function_signature: Record<string, string>;
  input_parsing: Record<string, string>;
  output_formatting: Record<string, string>;
}

export interface CreateProblemData {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  topics?: string[];
  companies?: string[];
  examples?: ProblemExample[];
  boilerplates?: Record<string, string>;
  wrapper_code?: Record<string, string>;
  function_name?: string;
  function_signature?: Record<string, string>;
  input_parsing?: Record<string, string>;
  output_formatting?: Record<string, string>;
}

/**
 * Create a new problem (admin/protected)
 */
export const createProblem = async (data: CreateProblemData): Promise<Problem> => {
  const response = await apiClient.post<Problem>('/problems/', data);
  return response.data;
};

/**
 * Get all problems with optional difficulty filter
 */
export const getProblems = async (difficulty?: 'Easy' | 'Medium' | 'Hard'): Promise<Problem[]> => {
  const params = difficulty ? { difficulty } : {};
  const response = await apiClient.get<Problem[]>('/problems/', { params });
  return response.data;
};

/**
 * Get a single problem by ID
 */
export const getProblemById = async (id: string): Promise<Problem> => {
  const response = await apiClient.get<Problem>(`/problems/id/${id}`);
  return response.data;
};

/**
 * Get a single problem by slug
 */
export const getProblemBySlug = async (slug: string): Promise<Problem> => {
  const response = await apiClient.get<Problem>(`/problems/${slug}`);
  return response.data;
};

/**
 * Filter problems locally by search query and topics
 */
export const filterProblems = (
  problems: Problem[],
  searchQuery: string,
  topics?: string[]
): Problem[] => {
  let filtered = [...problems];

  // Filter by search query (title, description, topics)
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (problem) =>
        problem.title.toLowerCase().includes(query) ||
        problem.description.toLowerCase().includes(query) ||
        problem.topics.some((topic) => topic.toLowerCase().includes(query)) ||
        problem.companies.some((company) => company.toLowerCase().includes(query))
    );
  }

  // Filter by topics
  if (topics && topics.length > 0) {
    filtered = filtered.filter((problem) =>
      topics.some((topic) => problem.topics.includes(topic))
    );
  }

  return filtered;
};

/**
 * Get unique topics from problems list
 */
export const getUniqueTopics = (problems: Problem[]): string[] => {
  const topicsSet = new Set<string>();
  problems.forEach((problem) => {
    problem.topics.forEach((topic) => topicsSet.add(topic));
  });
  return Array.from(topicsSet).sort();
};

/**
 * Get unique companies from problems list
 */
export const getUniqueCompanies = (problems: Problem[]): string[] => {
  const companiesSet = new Set<string>();
  problems.forEach((problem) => {
    problem.companies.forEach((company) => companiesSet.add(company));
  });
  return Array.from(companiesSet).sort();
};
