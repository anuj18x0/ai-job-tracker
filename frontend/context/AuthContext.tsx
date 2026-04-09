"use client";

import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { login as apiLogin, register as apiRegister, getMe, logout as apiLogout } from '@/lib/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading: isAuthLoading, refetch: checkAuthQuery } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const data = await getMe();
      if (!data.success) return null;
      return data.user as User;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, 
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: any) => {
      const data = await apiLogin(email, password);
      if (!data.success) throw new Error(data.message || 'Login failed');
      return data.user;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(['user'], userData);
    }
  });

  const registerMutation = useMutation({
    mutationFn: async ({ name, email, password }: any) => {
      const data = await apiRegister(name, email, password);
      if (!data.success) throw new Error(data.message || 'Registration failed');
      return data;
    }
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      queryClient.clear(); 
      window.location.href = "/login"; 
    }
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };
  
  const register = async (name: string, email: string, password: string) => {
    await registerMutation.mutateAsync({ name, email, password });
  };
  
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const checkAuth = async () => {
    await checkAuthQuery();
  };

  const loading = isAuthLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending;

  return (
    <AuthContext.Provider value={{ user: user || null, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
