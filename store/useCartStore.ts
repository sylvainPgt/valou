import {create} from 'zustand'

export type CartItem = {
  id: string
  title: string
  price: number
  image: string | null
  quantity: number
}

type CartState = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotalAmount: () => number
  getItemsCount: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((cartItem) => cartItem.id === item.id)
      if (existing) {
        return {
          items: state.items.map((cartItem) =>
            cartItem.id === item.id
              ? {...cartItem, quantity: cartItem.quantity + 1}
              : cartItem,
          ),
        }
      }

      return {items: [...state.items, {...item, quantity: 1}]}
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearCart: () => set({items: []}),
  getTotalAmount: () =>
    get().items.reduce((total, item) => total + item.price * item.quantity, 0),
  getItemsCount: () =>
    get().items.reduce((count, item) => count + item.quantity, 0),
}))

