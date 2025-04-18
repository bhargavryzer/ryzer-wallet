import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TransactionPolicy {
  id: string
  name: string
  type: string
  description: string
  rules: {
    maxAmount: string
    allowedTokens: string[]
    allowedAddresses: string[]
    timeRestrictions: {
      startTime: string
      endTime: string
    }
  }
  status: 'active' | 'inactive'
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  allowedIPs: string[]
  sessionTimeout: number
  emergencyFreeze: boolean
}

interface SecurityState {
  policies: TransactionPolicy[]
  settings: SecuritySettings
  selectedPolicies: string[]
  filters: {
    policyType: string
    status: string
    searchQuery: string
  }
  setPolicies: (policies: TransactionPolicy[]) => void
  setSettings: (settings: Partial<SecuritySettings>) => void
  setSelectedPolicies: (policyIds: string[]) => void
  setFilter: (key: keyof SecurityState['filters'], value: string) => void
  addPolicy: (policy: TransactionPolicy) => void
  updatePolicy: (policyId: string, updates: Partial<TransactionPolicy>) => void
  deletePolicy: (policyId: string) => void
  toggleEmergencyFreeze: () => void
  updateSecuritySettings: (updates: Partial<SecuritySettings>) => void
}

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set) => ({
      policies: [],
      settings: {
        twoFactorEnabled: false,
        emailNotifications: true,
        pushNotifications: true,
        allowedIPs: [],
        sessionTimeout: 30,
        emergencyFreeze: false,
      },
      selectedPolicies: [],
      filters: {
        policyType: 'all',
        status: 'all',
        searchQuery: '',
      },
      setPolicies: (policies) => set({ policies }),
      setSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),
      setSelectedPolicies: (policyIds) => set({ selectedPolicies: policyIds }),
      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      addPolicy: (policy) =>
        set((state) => ({ policies: [...state.policies, policy] })),
      updatePolicy: (policyId, updates) =>
        set((state) => ({
          policies: state.policies.map((policy) =>
            policy.id === policyId ? { ...policy, ...updates } : policy
          ),
        })),
      deletePolicy: (policyId) =>
        set((state) => ({
          policies: state.policies.filter((policy) => policy.id !== policyId),
        })),
      toggleEmergencyFreeze: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            emergencyFreeze: !state.settings.emergencyFreeze,
          },
        })),
      updateSecuritySettings: (updates) =>
        set((state) => ({
          settings: { ...state.settings, ...updates },
        })),
    }),
    {
      name: 'security-storage',
    }
  )
) 