import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { login as loginReq, register as registerReq, logout as logoutReq, getStoredUser, getAccessToken } from '../services/authService';

interface User {
  username?: string;
  email?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  isInitializing: boolean;
  login: (creds: { username: string; password: string }) => Promise<any>;
  register: (payload: { username: string; email: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // On mount, restore user from localStorage
  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getAccessToken();
    
    if (storedUser && storedToken) {
      setUser(storedUser);
    }
    
    setIsInitializing(false);
  }, []);

  const login = async (creds: { username: string; password: string }) => {
    setLoading(true);
    try {
      const data = await loginReq(creds);
      setUser(data.user); // Set the user from response
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { username: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const data = await registerReq(payload);
      setUser(data.user); // Set the user from response
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutReq();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, isInitializing, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}