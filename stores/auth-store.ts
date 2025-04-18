import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithPasskey: () => Promise<void>;
  loginWithGuard: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("Invalid credentials");
          }

          const data = await response.json();
          set({ user: data.user, isAuthenticated: true });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Login failed" });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithPasskey: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/auth/passkey/login", {
            method: "POST",
          });

          if (!response.ok) {
            throw new Error("Passkey authentication failed");
          }

          const data = await response.json();
          set({ user: data.user, isAuthenticated: true });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Passkey login failed" });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithGuard: async (code: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/auth/guard/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error("Invalid guard code");
          }

          const data = await response.json();
          set({ user: data.user, isAuthenticated: true });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Guard login failed" });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await fetch("/api/auth/logout", { method: "POST" });
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Logout failed" });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      setError: (error: string | null) => set({ error }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 