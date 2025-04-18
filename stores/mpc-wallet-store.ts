import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MPCWallet extends Wallet {
  threshold: string;
  mainGroupCreated: boolean;
  keyShares: {
    publicKey: string;
    encryptedShares: string[];
    threshold: number;
    totalShares: number;
  };
  recovery: {
    backupShares: string[];
    recoveryThreshold: number;
    recoveryTotalShares: number;
  };
  security: {
    allowedIPs: string[];
    allowedDevices: string[];
    lastKeyRotation: string;
    nextKeyRotation: string;
  };
}

interface MPCWalletState {
  mpcWallets: MPCWallet[];
  selectedMPCWallet: MPCWallet | null;
  isLoading: boolean;
  error: string | null;
  fetchMPCWallets: () => Promise<void>;
  createMPCWallet: (wallet: Omit<MPCWallet, "id" | "createdAt">) => Promise<void>;
  updateMPCWallet: (id: string, updates: Partial<MPCWallet>) => Promise<void>;
  deleteMPCWallet: (id: string) => Promise<void>;
  createMainGroup: (id: string) => Promise<void>;
  rotateKeys: (id: string) => Promise<void>;
  addAllowedIP: (id: string, ip: string) => Promise<void>;
  removeAllowedIP: (id: string, ip: string) => Promise<void>;
  addAllowedDevice: (id: string, device: string) => Promise<void>;
  removeAllowedDevice: (id: string, device: string) => Promise<void>;
  selectMPCWallet: (id: string) => void;
  clearSelection: () => void;
  setError: (error: string | null) => void;
}

export const useMPCWalletStore = create<MPCWalletState>()(
  persist(
    (set) => ({
      mpcWallets: [],
      selectedMPCWallet: null,
      isLoading: false,
      error: null,

      fetchMPCWallets: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/wallets/mpc");
          if (!response.ok) {
            throw new Error("Failed to fetch MPC wallets");
          }
          const data = await response.json();
          set({ mpcWallets: data });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to fetch MPC wallets" });
        } finally {
          set({ isLoading: false });
        }
      },

      createMPCWallet: async (wallet) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("/api/wallets/mpc", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(wallet),
          });
          if (!response.ok) {
            throw new Error("Failed to create MPC wallet");
          }
          const newWallet = await response.json();
          set((state) => ({ mpcWallets: [...state.mpcWallets, newWallet] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to create MPC wallet" });
        } finally {
          set({ isLoading: false });
        }
      },

      updateMPCWallet: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/wallets/mpc/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
          if (!response.ok) {
            throw new Error("Failed to update MPC wallet");
          }
          const updatedWallet = await response.json();
          set((state) => ({
            mpcWallets: state.mpcWallets.map((w) => (w.id === id ? updatedWallet : w)),
            selectedMPCWallet: state.selectedMPCWallet?.id === id ? updatedWallet : state.selectedMPCWallet,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to update MPC wallet" });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteMPCWallet: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/wallets/mpc/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete MPC wallet");
          }
          set((state) => ({
            mpcWallets: state.mpcWallets.filter((w) => w.id !== id),
            selectedMPCWallet: state.selectedMPCWallet?.id === id ? null : state.selectedMPCWallet,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to delete MPC wallet" });
        } finally {
          set({ isLoading: false });
        }
      },

      createMainGroup: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/wallets/mpc/${id}/main-group`, {
            method: "POST",
          });
          if (!response.ok) {
            throw new Error("Failed to create main group");
          }
          const updatedWallet = await response.json();
          set((state) => ({
            mpcWallets: state.mpcWallets.map((w) => (w.id === id ? updatedWallet : w)),
            selectedMPCWallet: state.selectedMPCWallet?.id === id ? updatedWallet : state.selectedMPCWallet,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to create main group" });
        } finally {
          set({ isLoading: false });
        }
      },

      rotateKeys: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/wallets/mpc/${id}/rotate-keys`, {
            method: "POST",
          });
          if (!response.ok) {
            throw new Error("Failed to rotate keys");
          }
          const updatedWallet = await response.json();
          set((state) => ({
            mpcWallets: state.mpcWallets.map((w) => (w.id === id ? updatedWallet : w)),
            selectedMPCWallet: state.selectedMPCWallet?.id === id ? updatedWallet : state.selectedMPCWallet,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to rotate keys" });
        } finally {
          set({ isLoading: false });
        }
      },

      addAllowedIP: async (id, ip) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/wallets/mpc/${id}/allowed-ips`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ip }),
          });
          if (!response.ok) {
            throw new Error("Failed to add allowed IP");
          }
          const updatedWallet = await response.json();
          set((state) => ({
            mpcWallets: state.mpcWallets.map((w) => (w.id === id ? updatedWallet : w)),
            selectedMPCWallet: state.selectedMPCWallet?.id === id ? updatedWallet : state.selectedMPCWallet,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to add allowed IP" });
        } finally {
          set({ isLoading: false });
        }
      },

      removeAllowedIP: async (id, ip) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/wallets/mpc/${id}/allowed-ips/${ip}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to remove allowed IP");
          }
          const updatedWallet = await response.json();
          set((state) => ({
            mpcWallets: state.mpcWallets.map((w) => (w.id === id ? updatedWallet : w)),
            selectedMPCWallet: state.selectedMPCWallet?.id === id ? updatedWallet : state.selectedMPCWallet,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to remove allowed IP" });
        } finally {
          set({ isLoading: false });
        }
      },

      addAllowedDevice: async (id, device) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/wallets/mpc/${id}/allowed-devices`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device }),
          });
          if (!response.ok) {
            throw new Error("Failed to add allowed device");
          }
          const updatedWallet = await response.json();
          set((state) => ({
            mpcWallets: state.mpcWallets.map((w) => (w.id === id ? updatedWallet : w)),
            selectedMPCWallet: state.selectedMPCWallet?.id === id ? updatedWallet : state.selectedMPCWallet,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to add allowed device" });
        } finally {
          set({ isLoading: false });
        }
      },

      removeAllowedDevice: async (id, device) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/wallets/mpc/${id}/allowed-devices/${device}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to remove allowed device");
          }
          const updatedWallet = await response.json();
          set((state) => ({
            mpcWallets: state.mpcWallets.map((w) => (w.id === id ? updatedWallet : w)),
            selectedMPCWallet: state.selectedMPCWallet?.id === id ? updatedWallet : state.selectedMPCWallet,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : "Failed to remove allowed device" });
        } finally {
          set({ isLoading: false });
        }
      },

      selectMPCWallet: (id) => {
        set((state) => ({
          selectedMPCWallet: state.mpcWallets.find((w) => w.id === id) || null,
        }));
      },

      clearSelection: () => {
        set({ selectedMPCWallet: null });
      },

      setError: (error) => set({ error }),
    }),
    {
      name: "mpc-wallet-storage",
      partialize: (state) => ({
        mpcWallets: state.mpcWallets,
        selectedMPCWallet: state.selectedMPCWallet,
      }),
    }
  )
); 