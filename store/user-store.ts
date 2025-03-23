import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => {
    set({ user });
  },
  clearUser: () => {
    set({ user: null, error: null });
  },
  fetchUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch('/api/user');
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch user');
      }
      
      const user = await response.json();
      set({ user, isLoading: false });
    } catch (error) {
      console.error('UserStore: Error fetching user:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        isLoading: false 
      });
    }
  },
})); 