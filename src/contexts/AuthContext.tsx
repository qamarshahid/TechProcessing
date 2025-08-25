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
      console.log('🌐 Making API call to get profile...');
      const response = await apiClient.getProfile();
      console.log('✅ Profile response:', response);
      setUser(response.user as User);
      console.log('👤 User set in state:', response.user);
    } catch (error: any) {
      console.error('❌ Error fetching user:', error);
      // Only clear auth on actual authentication errors
      const errorMessage = error?.message || '';
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('Invalid token')) {
        console.log('🔒 Authentication error detected, clearing auth...');
        localStorage.removeItem('auth_token');
        apiClient.setToken(null);
        setUser(null);
      } else {
        // For network errors, keep the user logged in but don't throw
        console.warn('⚠️ Network error during profile fetch, keeping user logged in');
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        const token = localStorage.getItem('auth_token');
        console.log('📦 Token from localStorage:', token ? 'exists' : 'not found');
        
        if (token) {
          console.log('🔑 Setting token in API client...');
          apiClient.setToken(token);
          console.log('👤 Fetching user profile...');
          await fetchUser();
        } else {
          console.log('❌ No token found, user not authenticated');
        }
      } catch (error) {
        console.error('🚨 Auth initialization error:', error);
        localStorage.removeItem('auth_token');
        apiClient.setToken(null);
        setUser(null);
      } finally {
        console.log('✅ Auth initialization complete');
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      apiClient.setToken(response.access_token);
      setUser(response.user as User);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: 'ADMIN' | 'CLIENT') => {
    try {
      const response = await apiClient.register(email, password, fullName, role);
      apiClient.setToken(response.access_token);
      setUser(response.user as User);
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