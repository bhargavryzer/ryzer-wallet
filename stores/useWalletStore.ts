import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Wallet {
  id: string
  name: string
  type: 'custodial' | 'mpc' | 'smart-contract' | 'exchange'
  status: 'active' | 'frozen'
  balance: string
  address: string
}

interface Transaction {
  id: string
  date: string
  type: string
  amount: string
  status: string
  from: string
  to: string
  walletId: string
}

interface WalletState {
  wallets: Wallet[]
  transactions: Transaction[]
  selectedWallet: string | null
  selectedTransactions: string[]
  filters: {
    walletType: string
    status: string
    dateRange: string
    searchQuery: string
  }
  pagination: {
    page: number
    itemsPerPage: number
  }
  sort: {
    key: keyof Transaction
    direction: 'asc' | 'desc'
  }
  setWallets: (wallets: Wallet[]) => void
  setTransactions: (transactions: Transaction[]) => void
  setSelectedWallet: (walletId: string | null) => void
  setSelectedTransactions: (transactionIds: string[]) => void
  setFilter: (key: keyof WalletState['filters'], value: string) => void
  setPagination: (page: number, itemsPerPage: number) => void
  setSort: (key: keyof Transaction, direction: 'asc' | 'desc') => void
  addWallet: (wallet: Wallet) => void
  updateWallet: (walletId: string, updates: Partial<Wallet>) => void
  deleteWallet: (walletId: string) => void
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      wallets: [],
      transactions: [],
      selectedWallet: null,
      selectedTransactions: [],
      filters: {
        walletType: 'all',
        status: 'all',
        dateRange: 'all',
        searchQuery: '',
      },
      pagination: {
        page: 1,
        itemsPerPage: 10,
      },
      sort: {
        key: 'date',
        direction: 'desc',
      },
      setWallets: (wallets) => set({ wallets }),
      setTransactions: (transactions) => set({ transactions }),
      setSelectedWallet: (walletId) => set({ selectedWallet: walletId }),
      setSelectedTransactions: (transactionIds) => set({ selectedTransactions: transactionIds }),
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          pagination: { ...state.pagination, page: 1 },
        })),
      setPagination: (page, itemsPerPage) =>
        set({ pagination: { page, itemsPerPage } }),
      setSort: (key, direction) => set({ sort: { key, direction } }),
      addWallet: (wallet) =>
        set((state) => ({ wallets: [...state.wallets, wallet] })),
      updateWallet: (walletId, updates) =>
        set((state) => ({
          wallets: state.wallets.map((wallet) =>
            wallet.id === walletId ? { ...wallet, ...updates } : wallet
          ),
        })),
      deleteWallet: (walletId) =>
        set((state) => ({
          wallets: state.wallets.filter((wallet) => wallet.id !== walletId),
        })),
      addTransaction: (transaction) =>
        set((state) => ({ transactions: [...state.transactions, transaction] })),
      updateTransaction: (transactionId, updates) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === transactionId ? { ...transaction, ...updates } : transaction
          ),
        })),
    }),
    {
      name: 'wallet-storage',
    }
  )
) 