/**
 * Authentication Context
 * Manages user session, agency data, and Supabase authentication
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AuthUser, AuthAgency, AuthLocation, AuthSessionResponse } from '../types/auth';
import { extractSessionKey, removeSessionKeyFromUrl } from '../lib/sessionExtractor';
import { setSupabaseAccessToken } from '../lib/supabaseClient';

interface AuthContextValue {
  user: AuthUser | null;
  agency: AuthAgency | null;
  location: AuthLocation;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [agency, setAgency] = useState<AuthAgency | null>(null);
  const [location, setLocation] = useState<AuthLocation>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async (sessionKey: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Call auth session endpoint
      const response = await fetch(`/api/auth/session?sessionKey=${encodeURIComponent(sessionKey)}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: AuthSessionResponse = await response.json();

      // Save token to sessionStorage for persistence
      if (data.supabaseAccessToken) {
        sessionStorage.setItem('sb_access_token', data.supabaseAccessToken);
        console.log('[AuthContext] Token saved to sessionStorage');
      }

      // Configure Supabase client with the access token
      setSupabaseAccessToken(data.supabaseAccessToken);

      // Update state
      setUser(data.user);
      setAgency(data.agency);
      setLocation(data.location);

      // Remove sessionKey from URL
      removeSessionKeyFromUrl(sessionKey);

      setIsLoading(false);
    } catch (err: any) {
      console.error('[AuthContext] Authentication failed:', err);
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Extract session key on mount
    const sessionKey = extractSessionKey();

    if (sessionKey) {
      authenticate(sessionKey);
    } else {
      // No session key found - stay in anonymous mode
      setIsLoading(false);
    }
  }, [authenticate]);

  const value: AuthContextValue = {
    user,
    agency,
    location,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

