import { create } from "zustand";

interface PasskeyState {
  isSupported: boolean;
  isRegistering: boolean;
  isAuthenticating: boolean;
  error: string | null;
  checkSupport: () => Promise<boolean>;
  register: (userId: string) => Promise<void>;
  authenticate: () => Promise<void>;
  clearError: () => void;
}

export const usePasskeyStore = create<PasskeyState>((set) => ({
  isSupported: false,
  isRegistering: false,
  isAuthenticating: false,
  error: null,

  checkSupport: async () => {
    try {
      const isSupported = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      set({ isSupported });
      return isSupported;
    } catch (error) {
      set({ isSupported: false });
      return false;
    }
  },

  register: async (userId: string) => {
    set({ isRegistering: true, error: null });
    try {
      const response = await fetch("/api/auth/passkey/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to register passkey");
      }

      const options = await response.json();
      const credential = await navigator.credentials.create({
        publicKey: {
          ...options,
          challenge: Uint8Array.from(options.challenge, (c) => c.charCodeAt(0)),
          user: {
            ...options.user,
            id: Uint8Array.from(options.user.id, (c) => c.charCodeAt(0)),
          },
        },
      });

      await fetch("/api/auth/passkey/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Passkey registration failed" });
      throw error;
    } finally {
      set({ isRegistering: false });
    }
  },

  authenticate: async () => {
    set({ isAuthenticating: true, error: null });
    try {
      const response = await fetch("/api/auth/passkey/authenticate", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate with passkey");
      }

      const options = await response.json();
      const credential = await navigator.credentials.get({
        publicKey: {
          ...options,
          challenge: Uint8Array.from(options.challenge, (c) => c.charCodeAt(0)),
        },
      });

      await fetch("/api/auth/passkey/verify-authentication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Passkey authentication failed" });
      throw error;
    } finally {
      set({ isAuthenticating: false });
    }
  },

  clearError: () => set({ error: null }),
})); 