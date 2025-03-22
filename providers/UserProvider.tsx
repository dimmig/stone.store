'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/store/user-store';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const fetchUser = useUserStore(state => state.fetchUser);

  useEffect(() => {
    console.log('UserProvider: Session status changed:', status);
    if (status === 'authenticated') {
      console.log('UserProvider: Fetching user data');
      fetchUser();
    }
  }, [status]);

  return <>{children}</>;
} 