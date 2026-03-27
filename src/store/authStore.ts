import { create } from 'zustand';
import { setAccessToken } from '@/api/client';
import { setToken, getToken, removeToken } from '@/lib/secureStorage';
import { loginApi, registerApi } from '@/api/auth';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  userEmail: null,

  login: async (email, password) => {
    const { access_token } = await loginApi(email, password);
    setAccessToken(access_token);
    await setToken(access_token);
    set({ isAuthenticated: true, userEmail: email });
  },

  register: async (email, password) => {
    await registerApi(email, password);
    const { access_token } = await loginApi(email, password);
    setAccessToken(access_token);
    await setToken(access_token);
    set({ isAuthenticated: true, userEmail: email });
  },

  logout: async () => {
    setAccessToken(null);
    await removeToken();
    set({ isAuthenticated: false, userEmail: null });
  },

  restoreSession: async () => {
    try {
      const token = await getToken();
      if (token) {
        setAccessToken(token);
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
