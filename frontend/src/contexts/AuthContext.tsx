import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';
import type { SignupData, UserData } from '../services/authService';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user && authService.isAuthenticated();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Try to get stored user first
      const storedUser = authService.getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }

      // Validate token with backend and get fresh user data
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      // Set user from login response
      setUser(response.user);
      
      // Show loading for 1-2 seconds for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  const signup = async (data: SignupData) => {
    try {
      setIsLoading(true);
      const response = await authService.signup(data);
      
      // Auto-login after successful signup
      await login(data.email, data.password);
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.response?.data?.detail || 'Signup failed');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/auth');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
