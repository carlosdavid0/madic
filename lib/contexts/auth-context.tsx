'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ProfileModal } from '@/components/auth/profile-modal';

type User = {
  id: string;
  name: string;
  username: string | null;
  email: string;
  avatar: string | null;
  socialName: string | null;
  bio: string | null;
  age: string | null;
  locate: string | null;
  availableFreelancer: boolean;
  active: boolean;
  profileCompleted: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.ok) {
        const currentUser = await response.json();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();

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
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
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

