import { defineStore } from 'pinia'
import type { ICartItem } from '../types/cart'
import { useUserCart } from '../composables/api/useUserCart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as ICartItem[],
    isCartOpen: false,
    loading: false,
    initialized: false
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    
    total: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  },

  actions: {
    /**
     * Initialize cart by fetching from backend
     * Forces refresh to ensure cart is up-to-date
     */
    async initCart() {
      this.loading = true
      try {
        const { getCart } = useUserCart()
        const cartItems = await getCart()
        this.items = cartItems
        this.initialized = true
        console.log('Cart initialized with items:', cartItems)
      } catch (error) {
        console.error('Failed to initialize cart:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Add item to cart (syncs with backend)
     * The useUserCart.addToCart handles merging logic
     */
    async addItem(item: Omit<ICartItem, 'quantity'> & { quantity?: number }) {
      const { addToCart } = useUserCart()
      
      // Prepare the item
      const newItem: ICartItem = {
        ...item,
        quantity: item.quantity || 1
      }
      
      // Add to backend (handles merging if item exists)
      const success = await addToCart(newItem)
      
      if (success) {
        // Update local state
        const existingItem = this.items.find(i => i.id === newItem.id)
        if (existingItem) {
          existingItem.quantity += newItem.quantity
        } else {
          this.items.push(newItem)
        }
      } else {
        console.error('Failed to add item to backend cart')
      }
    },

    /**
     * Remove item from cart (syncs with backend)
     */
    async removeItem(itemId: string) {
      const { removeFromCart } = useUserCart()
      const success = await removeFromCart(itemId)
      
      if (success) {
        const index = this.items.findIndex(i => i.id === itemId)
        if (index > -1) {
          this.items.splice(index, 1)
        }
      } else {
        console.error('Failed to remove item from backend cart')
      }
    },

    /**
     * Update item quantity (syncs with backend)
     */
    async updateQuantity(itemId: string, quantity: number) {
      if (quantity <= 0) {
        await this.removeItem(itemId)
        return
      }

      const { updateCartItem } = useUserCart()
      const success = await updateCartItem(itemId, quantity)
      
      if (success) {
        const item = this.items.find(i => i.id === itemId)
        if (item) {
          item.quantity = quantity
        }
      } else {
        console.error('Failed to update item quantity in backend')
      }
    },

    /**
     * Increment item quantity (syncs with backend)
     */
    async incrementQuantity(itemId: string) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        await this.updateQuantity(itemId, item.quantity + 1)
      }
    },

    /**
     * Decrement item quantity (syncs with backend)
     */
    async decrementQuantity(itemId: string) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        if (item.quantity > 1) {
          await this.updateQuantity(itemId, item.quantity - 1)
        } else {
          await this.removeItem(itemId)
        }
      }
    },

    /**
     * Clear all items from cart (syncs with backend)
     */
    async clearCart() {
      const { clearCart } = useUserCart()
      const success = await clearCart()
      
      if (success) {
        this.items = []
      } else {
        console.error('Failed to clear cart in backend')
      }
    },

    /**
     * Refresh cart from backend
     */
    async refreshCart() {
      this.loading = true
      try {
        const { getCart } = useUserCart()
        const cartItems = await getCart()
        this.items = cartItems
        console.log('Cart refreshed with items:', cartItems)
      } catch (error) {
        console.error('Failed to refresh cart:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Reset cart state (for logout)
     */
    resetCart() {
      this.items = []
      this.initialized = false
      this.isCartOpen = false
      this.loading = false
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

