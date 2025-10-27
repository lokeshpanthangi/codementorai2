import apiClient from './apiClient';

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Boilerplate {
  language_id: number;
  language_name: string;
  code: string;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

// New Question interface matching the backend schema
export interface Question {
  _id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  boilerplates: Boilerplate[];
  input_format: string;
  output_format: string;
  constraints: string;
  examples: Example[];
  run_template: string;
  time_limit_ms: number;
  memory_limit_kb: number;
  created_at: string;
  updated_at: string;
}

export interface QuestionCreate {
  slug: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  boilerplates?: Boilerplate[];
  input_format: string;
  output_format: string;
  constraints: string;
  examples?: Example[];
  run_template: string;
  time_limit_ms?: number;
  memory_limit_kb?: number;
}

// Legacy Problem interface for backward compatibility - DEPRECATED
export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  examples: ProblemExample[];
  created_at: string;
  updated_at: string;
  boilerplates: Record<string, string>;
}

export interface CreateProblemData {
  slug: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  input_format: string;
  output_format: string;
  constraints: string;
  examples?: ProblemExample[];
  boilerplates?: Record<string, string>;
}

/**
 * Create a new question (admin/protected)
 */
export const createQuestion = async (data: QuestionCreate): Promise<Question> => {
  const response = await apiClient.post<Question>('/problems/', data);
  return response.data;
};

/**
 * Get all questions with optional difficulty filter
 */
export const getQuestions = async (difficulty?: 'Easy' | 'Medium' | 'Hard'): Promise<Question[]> => {
  const params = difficulty ? { difficulty } : {};
  const response = await apiClient.get<Question[]>('/problems/', { params });
  return response.data;
};

/**
 * Get a single question by ID
 */
export const getQuestionById = async (id: string): Promise<Question> => {
  const response = await apiClient.get<Question>(`/problems/id/${id}`);
  return response.data;
};

/**
 * Get a single question by slug
 */
export const getQuestionBySlug = async (slug: string): Promise<Question> => {
  const response = await apiClient.get<Question>(`/problems/${slug}`);
  return response.data;
};

/**
 * Create a new problem (admin/protected) - Legacy
 */
export const createProblem = async (data: CreateProblemData): Promise<Problem> => {
  const response = await apiClient.post<Problem>('/problems/legacy', data);
  return response.data;
};

/**
 * Get all problems with optional difficulty filter - Legacy
 */
export const getProblems = async (difficulty?: 'Easy' | 'Medium' | 'Hard'): Promise<Problem[]> => {
  const params = difficulty ? { difficulty } : {};
  const response = await apiClient.get<Problem[]>('/problems/legacy', { params });
  return response.data;
};

/**
 * Get a single problem by ID - Legacy
 */
export const getProblemById = async (id: string): Promise<Problem> => {
  const response = await apiClient.get<Problem>(`/problems/legacy/id/${id}`);
  return response.data;
};

/**
 * Get a single problem by slug - Legacy
 */
export const getProblemBySlug = async (slug: string): Promise<Problem> => {
  const response = await apiClient.get<Problem>(`/problems/legacy/${slug}`);
  return response.data;
};

/**
 * Filter questions locally by search query and tags
 */
export const filterQuestions = (
  questions: Question[],
  searchQuery: string,
  tags?: string[]
): Question[] => {
  let filtered = [...questions];

  // Filter by search query (title, description, tags)
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (question) =>
        question.title.toLowerCase().includes(query) ||
        question.description.toLowerCase().includes(query) ||
        question.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Filter by tags
  if (tags && tags.length > 0) {
    filtered = filtered.filter((question) =>
      tags.some((tag) => question.tags.includes(tag))
    );
  }

  return filtered;
};

/**
 * Get unique tags from questions list
 */
export const getUniqueTags = (questions: Question[]): string[] => {
  const tagsSet = new Set<string>();
  questions.forEach((question) => {
    if (question.tags) {
      question.tags.forEach((tag) => tagsSet.add(tag));
    }
  });
  return Array.from(tagsSet).sort();
};

/**
 * Filter problems locally by search query and tags
 */
export const filterProblems = (
  problems: Question[],
  searchQuery?: string,
  tags?: string[]
): Question[] => {
  let filtered = problems;

  // Filter by search query (title, description, tags)
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter((problem) =>
      problem.title.toLowerCase().includes(query) ||
      problem.description.toLowerCase().includes(query) ||
      problem.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  // Filter by tags
  if (tags && tags.length > 0) {
    filtered = filtered.filter((problem) =>
      tags.some((tag) => problem.tags.includes(tag))
    );
  }

  return filtered;
};
