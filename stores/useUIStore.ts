import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  sidebarState: 'expanded' | 'collapsed'
  isMobile: boolean
  activeTab: string
  searchQuery: string
  selectedItems: string[]
  showCreateDialog: boolean
  showEditDialog: boolean
  showDetailsDialog: boolean
  toggleSidebar: () => void
  setSidebarState: (state: 'expanded' | 'collapsed') => void
  setMobile: (isMobile: boolean) => void
  setActiveTab: (tab: string) => void
  setSearchQuery: (query: string) => void
  setSelectedItems: (items: string[]) => void
  setShowCreateDialog: (show: boolean) => void
  setShowEditDialog: (show: boolean) => void
  setShowDetailsDialog: (show: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarState: 'expanded',
      isMobile: false,
      activeTab: 'overview',
      searchQuery: '',
      selectedItems: [],
      showCreateDialog: false,
      showEditDialog: false,
      showDetailsDialog: false,
      toggleSidebar: () =>
        set((state) => ({
          sidebarState: state.sidebarState === 'expanded' ? 'collapsed' : 'expanded',
        })),
      setSidebarState: (state) => set({ sidebarState: state }),
      setMobile: (isMobile) => set({ isMobile }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedItems: (items) => set({ selectedItems: items }),
      setShowCreateDialog: (show) => set({ showCreateDialog: show }),
      setShowEditDialog: (show) => set({ showEditDialog: show }),
      setShowDetailsDialog: (show) => set({ showDetailsDialog: show }),
    }),
    {
      name: 'ui-storage',
    }
  )
) 