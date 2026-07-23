import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      
      addToCart: (product, variant, quantity) => set((state) => {
        const safeQuantity = Math.min(Math.max(1, quantity), 10);
        
        const existingItem = state.items.find(
          item => item.variant?.id === variant?.id && item.product.id === product.id
        );

        if (existingItem) {
          const newTotalQuantity = Math.min(existingItem.quantity + safeQuantity, 10);
          return {
            items: state.items.map(item =>
              item.variant?.id === variant?.id && item.product.id === product.id
                ? { ...item, quantity: newTotalQuantity }
                : item
            )
          };
        }
        
        return { items: [...state.items, { product, variant, quantity: safeQuantity }] };
      }),

      increaseQuantity: (variantId, productId) => set((state) => ({
        items: state.items.map(item =>
          item.variant?.id === variantId && item.product.id === productId
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item
        )
      })),

      decreaseQuantity: (variantId, productId) => set((state) => ({
        items: state.items
          .map(item =>
            item.variant?.id === variantId && item.product.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter(item => item.quantity > 0)
      })),

      removeFromCart: (variantId, productId) => set((state) => ({
        items: state.items.filter(item => !(item.variant?.id === variantId && item.product.id === productId))
      })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'waseworm-cart-storage',
    }
  )
);