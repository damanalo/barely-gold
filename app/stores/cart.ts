import { defineStore } from 'pinia'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isCartOpen: false
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    
    subtotal: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    
    tax: (state) => {
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      return subtotal * 0.1 // 10% tax
    },
    
    total: (state) => {
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const tax = subtotal * 0.1
      return subtotal + tax
    }
  },

  actions: {
    addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
      const existingItem = this.items.find(i => i.id === item.id)
      
      if (existingItem) {
        existingItem.quantity += item.quantity || 1
      } else {
        this.items.push({
          ...item,
          quantity: item.quantity || 1
        })
      }
    },

    removeItem(itemId: string) {
      const index = this.items.findIndex(i => i.id === itemId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    updateQuantity(itemId: string, quantity: number) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(itemId)
        } else {
          item.quantity = quantity
        }
      }
    },

    incrementQuantity(itemId: string) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        item.quantity++
      }
    },

    decrementQuantity(itemId: string) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        if (item.quantity > 1) {
          item.quantity--
        } else {
          this.removeItem(itemId)
        }
      }
    },

    clearCart() {
      this.items = []
    },

    openCart() {
      this.isCartOpen = true
    },

    closeCart() {
      this.isCartOpen = false
    },

    toggleCart() {
      this.isCartOpen = !this.isCartOpen
    }
  }
})

