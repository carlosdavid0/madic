'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

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

async function fetchUser(): Promise<User | null> {
  const response = await fetch('/api/auth/me', {
    credentials: 'include',
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 60 * 1000, // 1 minuto
    retry: 1,
  });
}

export function useRefreshUser() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: ['user'] });
  };
}

export type { User };

