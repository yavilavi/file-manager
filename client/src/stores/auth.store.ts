/**
 * File Manager - Auth.Store
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
// stores/auth.store.ts
import { create } from 'zustand';
import { UserInterface } from '../types/interfaces/user-interface.ts';

interface AuthState {
  token: string | null;
  user: UserInterface | null;
  setToken: (token: string) => void;
  setUser: (user: UserInterface) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
