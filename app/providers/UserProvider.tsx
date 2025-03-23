'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/store/user-store';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const {fetchUser} = useUserStore();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchUser();
    }
  }, [status]);

  return <>{children}</>;
} 