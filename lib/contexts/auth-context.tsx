'use client';

import { createContext, useContext, useEffect, useCallback } from 'react';
import { ProfileModal } from '@/components/auth/profile-modal';
import { useUser, useRefreshUser, type User } from '@/lib/hooks/use-user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading: loading } = useUser();
  const refreshUserQuery = useRefreshUser();

  const refreshUser = useCallback(async () => {
    refreshUserQuery();
  }, [refreshUserQuery]);

  useEffect(() => {
    // Listener para sincronizar entre abas quando o login/logout acontece
    const handleStorageChange = () => {
      refreshUser();
    };

    // Escutar eventos de storage (para sincronizar entre abas)
    window.addEventListener('storage', handleStorageChange);

    // Escutar eventos customizados de login/logout
    window.addEventListener('auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, [refreshUser]);

  return (
    <AuthContext.Provider value={{ user: user || null, loading, refreshUser }}>
      {children}
      <ProfileModal />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

