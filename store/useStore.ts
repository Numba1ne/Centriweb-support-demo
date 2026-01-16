
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState } from '../types';

interface Store extends AppState {}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      theme: 'dark', // Default to the premium dark mode
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      agencyConfig: null,
      setAgencyConfig: (config) => set({ agencyConfig: config }),

      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      mobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),
      
      viewedGuides: [],
      markGuideAsViewed: (id) =>
        set((state) => {
          // Remove the ID if it exists already so we can move it to the front
          const filtered = state.viewedGuides.filter(gId => gId !== id);
          // Add to front and limit to 10
          return { viewedGuides: [id, ...filtered].slice(0, 10) };
        }),

      completedTasks: [],
      toggleTaskCompletion: (taskId) => 
        set((state) => {
          const exists = state.completedTasks.includes(taskId);
          if (exists) {
            return { completedTasks: state.completedTasks.filter(t => t !== taskId) };
          }
          return { completedTasks: [...state.completedTasks, taskId] };
        }),
      resetOnboarding: () => set({ completedTasks: [] }),
    }),
    {
      name: 'centriweb-storage',
      partialize: (state) => ({ 
        viewedGuides: state.viewedGuides,
        completedTasks: state.completedTasks,
        theme: state.theme,
        // We do NOT persist agencyConfig because it should be fetched fresh on reload based on domain/context
      }),
    }
  )
);
