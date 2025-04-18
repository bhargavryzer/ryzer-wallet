import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Wallet {
  id: string;
  name: string;
  type: "mpc" | "hot" | "cold";
  balance: number;
  currency: string;
  status: "active" | "inactive" | "pending";
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface WalletState {
  wallets: Wallet[];
  selectedWallet: Wallet | null;
  isLoading: boolean;
  error: string | null;
  fetchWallets: () => Promise<void>;
  createWallet: (wallet: Omit<Wallet, "id" | "createdAt">) => Promise<void>;
  updateWallet: (id: string, updates: Partial<Wallet>) => Promise<void>;
  deleteWallet: (id: string) => Promise<void>;
  selectWallet: (id: string) => void;
  clearSelection: () => void;
  setError: (error: string | null) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      wallets: [],
      selectedWallet: null,
      isLoading: false,
      error: null,

      fetchWallets: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/wallets");
          if (!response.ok) {
            throw new Error("Failed to fetch wallets");
          }
          const data = await response.json();
          set({ wallets: data });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to fetch wallets" });
        } finally {
          set({ isLoading: false });
        }
      },

      createWallet: async (wallet) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/wallets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(wallet),
          });
          if (!response.ok) {
            throw new Error("Failed to create wallet");
          }
          const newWallet = await response.json();
          set((state) => ({ wallets: [...state.wallets, newWallet] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to create wallet" });
        } finally {
          set({ isLoading: false });
        }
      },

      updateWallet: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/wallets/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
          if (!response.ok) {
            throw new Error("Failed to update wallet");
          }
          const updatedWallet = await response.json();
          set((state) => ({
            wallets: state.wallets.map((w) => (w.id === id ? updatedWallet : w)),
            selectedWallet: state.selectedWallet?.id === id ? updatedWallet : state.selectedWallet,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to update wallet" });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteWallet: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/wallets/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete wallet");
          }
          set((state) => ({
            wallets: state.wallets.filter((w) => w.id !== id),
            selectedWallet: state.selectedWallet?.id === id ? null : state.selectedWallet,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to delete wallet" });
        } finally {
          set({ isLoading: false });
        }
      },

      selectWallet: (id) => {
        set((state) => ({
          selectedWallet: state.wallets.find((w) => w.id === id) || null,
        }));
      },

      clearSelection: () => {
        set({ selectedWallet: null });
      },

      setError: (error) => set({ error }),
    }),
    {
      name: "wallet-storage",
      partialize: (state) => ({
        wallets: state.wallets,
        selectedWallet: state.selectedWallet,
      }),
    }
  )
); 