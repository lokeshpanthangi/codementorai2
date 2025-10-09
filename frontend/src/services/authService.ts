import apiClient from './apiClient';

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;  // Backend expects email in the 'username' field
  password: string;
}

export interface UserData {
  id?: string;
  username: string;
  email: string;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserData;
}

export interface SignupResponse {
  message: string;
  user: UserData;
}

/**
 * Sign up a new user
 */
export const signup = async (data: SignupData): Promise<SignupResponse> => {
  const response = await apiClient.post<SignupResponse>('/users/signup', data);
  return response.data;
};

/**
 * Login with email and password
 * Note: Backend expects form-data, so we convert to URLSearchParams
 */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', email);  // OAuth2 form expects 'username' field
  formData.append('password', password);

  const response = await apiClient.post<AuthResponse>('/users/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  // Store token and user data in localStorage
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
  }
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

/**
 * Get current user profile (validates token)
 */
export const getCurrentUser = async (): Promise<UserData> => {
  const response = await apiClient.get<UserData>('/users/me');
  
  // Store user data in localStorage
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  
  return response.data;
};

/**
 * Logout - clear local storage
 */
export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('access_token');
};

/**
 * Get stored token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

/**
 * Get stored user data
 */
export const getStoredUser = (): UserData | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};
