import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      
      login: (email, name) => set({ 
        user: { email, name, orders: [] } 
      }),
      
      logout: () => set({ user: null }),
      
      updateName: (newName) => set((state) => ({
        user: state.user ? { ...state.user, name: newName } : null
      })),
      
      addOrder: (items, total) => set((state) => {
        if (!state.user) return state;
        const newOrder = {
          id: Math.random().toString(36).substring(2, 8).toUpperCase(),
          date: new Date().toLocaleDateString('ru-RU'),
          items: items,
          total: total,
          status: 'В обработке'
        };
        return {
          user: { ...state.user, orders: [newOrder, ...state.user.orders] }
        };
      })
    }),
    {
      name: 'waseworm-user-storage'
    }
  )
);