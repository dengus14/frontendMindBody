import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getAccessToken } from '../services/authService';

interface User {
  id?: string;
  username?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On app start, check if token exists in memory (will be null after page refresh)
    const initAuth = () => {
      const token = getAccessToken();
      if (token) {
        setUser({ id: 'authenticated' });
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await loginService({ username, password });
      setUser(data.user || { id: 'authenticated' });
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await registerService({ username, email, password });
      setUser(data.user || { id: 'authenticated' });
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
