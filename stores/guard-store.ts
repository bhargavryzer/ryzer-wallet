import { create } from "zustand";

interface GuardState {
  qrCode: string;
  isGenerating: boolean;
  isVerifying: boolean;
  error: string | null;
  generateQrCode: () => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
  clearError: () => void;
}

export const useGuardStore = create<GuardState>((set) => ({
  qrCode: "",
  isGenerating: false,
  isVerifying: false,
  error: null,

  generateQrCode: async () => {
    set({ isGenerating: true, error: null });
    try {
      const response = await fetch("/api/auth/guard/generate", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }

      const data = await response.json();
      set({ qrCode: data.code });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to generate QR code" });
      throw error;
    } finally {
      set({ isGenerating: false });
    }
  },

  verifyCode: async (code: string) => {
    set({ isVerifying: true, error: null });
    try {
      const response = await fetch("/api/auth/guard/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Invalid code");
      }

      return true;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Verification failed" });
      return false;
    } finally {
      set({ isVerifying: false });
    }
  },

  clearError: () => set({ error: null }),
})); 