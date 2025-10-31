import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { handleApiError } from '@/services/api';
import { saveTokens, saveUser, clearAll, getUser } from '@/services/storage';
import type { User, LoginResponse, ApiResponse } from '@/types';

const LOGIN_ENDPOINT = '/admin/auth/login';
const LOGOUT_ENDPOINT = '/admin/auth/logout';
const HOME_ROUTE = '/';
const LOGIN_ROUTE = '/login';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadUserFromStorage = useCallback(async (): Promise<void> => {
    try {
      const savedUser = getUser();
      if (savedUser) {
        setUser(savedUser);
      }
    } catch (error) {
      console.warn('Error loading user:', error);
      clearAll();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const persistUserSession = (user: User, accessToken: string, refreshToken: string): void => {
    saveTokens(accessToken, refreshToken);
    saveUser(user);
    setUser(user);
  };

  const performLogin = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>(LOGIN_ENDPOINT, {
      email,
      password,
    });
    return response.data.data!;
  };

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        const { user, tokens } = await performLogin(email, password);
        persistUserSession(user, tokens.accessToken, tokens.refreshToken);
        navigate(HOME_ROUTE);
      } catch (error) {
        throw new Error(handleApiError(error));
      }
    },
    [navigate]
  );

  const performLogout = async (): Promise<void> => {
    try {
      await api.post(LOGOUT_ENDPOINT);
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
  };

  const clearUserSession = (): void => {
    clearAll();
    setUser(null);
  };

  const logout = useCallback(async (): Promise<void> => {
    await performLogout();
    clearUserSession();
    navigate(LOGIN_ROUTE);
  }, [navigate]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
