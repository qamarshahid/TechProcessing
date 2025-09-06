import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../lib/api';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await apiClient.getProfile();
      setUser(response as User); // Backend returns user data directly
    } catch (error: unknown) {
      // Only clear auth on actual authentication errors
      const errorMessage = error instanceof Error ? error.message : '';
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('Invalid token')) {
        localStorage.removeItem('auth_token');
        apiClient.setToken(null);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        
        if (token) {
          apiClient.setToken(token);
          await fetchUser();
        }
      } catch (error) {
        localStorage.removeItem('auth_token');
        apiClient.setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      
      // If MFA is required, return the response without setting token
      if (response.requires_mfa) {
        return response;
      }
      
      // Normal login flow
      apiClient.setToken(response.access_token);
      localStorage.setItem('auth_token', response.access_token);
      setUser(response.user as User);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'ADMIN' | 'CLIENT' | 'AGENT') => {
    try {
      const response = await apiClient.register(email, password, fullName, role);
      
      // Registration now requires email verification, so don't set token immediately
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await apiClient.logout();
      apiClient.setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      // Clear token even if logout fails
      apiClient.setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}