import { defineStore } from 'pinia'
import type { ICartItem } from '../types/cart'
import { useUserCart } from '../composables/api/useUserCart'
import { useProductsStore } from '~/stores/products'

const GUEST_CART_KEY = 'bg_guest_cart'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as ICartItem[],
    isCartOpen: false,
    loading: false,
    initialized: false,
    isGuest: true, // Track if user is guest or authenticated
    // Granular loading states for individual operations
    operationLoading: {
      addItem: {} as Record<string, boolean>,
      removeItem: {} as Record<string, boolean>,
      incrementQuantity: {} as Record<string, boolean>,
      decrementQuantity: {} as Record<string, boolean>,
      clearCart: false
    }
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    
    total: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),

    // Check if any cart operation is in progress
    isAnyCartOperationInProgress: (state) => {
      return (
        Object.values(state.operationLoading.addItem).some(v => v) ||
        Object.values(state.operationLoading.removeItem).some(v => v) ||
        Object.values(state.operationLoading.incrementQuantity).some(v => v) ||
        Object.values(state.operationLoading.decrementQuantity).some(v => v) ||
        state.operationLoading.clearCart
      )
    }
  },

  actions: {
    // Helper: get available quantity for a product (0 if missing/inactive)
    _availableQty(productId: string): number {
      const productsStore = useProductsStore()
      const product = productsStore.products.find(p => p.id === productId)
      if (!product) return 0
      if (product.status !== 'active') return 0
      const qty = (product as any).quantity
      return typeof qty === 'number' && qty > 0 ? qty : 0
    },
    /**
     * Load cart from localStorage (for guest users)
     */
    loadGuestCart() {
      if (typeof window === 'undefined') return
      
      try {
        const savedCart = localStorage.getItem(GUEST_CART_KEY)
        if (savedCart) {
          this.items = JSON.parse(savedCart)
          console.log('Guest cart loaded from localStorage:', this.items)
        }
      } catch (error) {
        console.error('Failed to load guest cart:', error)
      }
    },

    /**
     * Save cart to localStorage (for guest users)
     */
    saveGuestCart() {
      if (typeof window === 'undefined') return
      
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(this.items))
        console.log('Guest cart saved to localStorage')
      } catch (error) {
        console.error('Failed to save guest cart:', error)
      }
    },

    /**
     * Clear guest cart from localStorage
     */
    clearGuestCart() {
      if (typeof window === 'undefined') return
      
      try {
        localStorage.removeItem(GUEST_CART_KEY)
        console.log('Guest cart cleared from localStorage')
      } catch (error) {
        console.error('Failed to clear guest cart:', error)
      }
    },
    /**
     * Initialize cart - loads from backend for authenticated users, localStorage for guests
     */
    async initCart(isAuthenticated: boolean = false) {
      this.loading = true
      this.isGuest = !isAuthenticated
      
      try {
        if (isAuthenticated) {
          // Load from backend for authenticated users
          const { getCart } = useUserCart()
          const cartItems = await getCart()
          this.items = cartItems
          console.log('Authenticated cart initialized with items:', cartItems)
        } else {
          // Load from localStorage for guests
          this.loadGuestCart()
          console.log('Guest cart initialized with items:', this.items)
        }
        this.initialized = true
      } catch (error) {
        console.error('Failed to initialize cart:', error)
        // Fallback to guest cart if backend fails
        if (isAuthenticated) {
          this.loadGuestCart()
        }
      } finally {
        this.loading = false
      }
    },

    /**
     * Sync guest cart to backend when user authenticates
     */
    async syncGuestCartToBackend() {
      if (this.items.length === 0) return

      console.log('Syncing guest cart to backend:', this.items)
      const { addToCart } = useUserCart()
      
      try {
        // Add all guest cart items to backend
        for (const item of this.items) {
          await addToCart(item)
        }
        
        // Clear guest cart from localStorage
        this.clearGuestCart()
        
        // Refresh cart from backend
        await this.refreshCart(true)
        
        console.log('Guest cart synced to backend successfully')
      } catch (error) {
        console.error('Failed to sync guest cart to backend:', error)
      }
    },

    /**
     * Add item to cart (syncs with backend for authenticated, localStorage for guests)
     */
    async addItem(item: Omit<ICartItem, 'quantity'> & { quantity?: number }) {
      const itemId = item.id
      this.operationLoading.addItem[itemId] = true
      
      try {
        const toast = useToast()
        // Prepare the item
        const newItem: ICartItem = {
          ...item,
          quantity: item.quantity || 1
        }

        // Enforce stock limit
        const existing = this.items.find(i => i.id === newItem.id)
        const desired = (existing?.quantity || 0) + newItem.quantity
        const limit = this._availableQty(newItem.id)
        if (desired > limit) {
          console.error(`Only ${limit} left in stock for this item.`)
          toast.add({
            title: 'Not enough stock',
            description: limit > 0 ? `Only ${limit} left in stock` : 'This item is currently out of stock',
            color: 'error'
          })
          return
        }
        
        if (this.isGuest) {
          // Guest user - save to localStorage
          const existingItem = this.items.find(i => i.id === newItem.id)
          if (existingItem) {
            existingItem.quantity += newItem.quantity
          } else {
            this.items.push(newItem)
          }
          this.saveGuestCart()
          console.log('Item added to guest cart')
          // Show success toast
          toast.add({
            title: 'Added to cart',
            description: `${newItem.name} has been added to your cart`,
            color: 'success'
          })
        } else {
          // Authenticated user - save to backend
          const { addToCart } = useUserCart()
          const success = await addToCart(newItem)
          
          if (success) {
            // Update local state
            const existingItem = this.items.find(i => i.id === newItem.id)
            if (existingItem) {
              existingItem.quantity += newItem.quantity
            } else {
              this.items.push(newItem)
            }
            // Show success toast
            toast.add({
              title: 'Added to cart',
              description: `${newItem.name} has been added to your cart`,
              color: 'success'
            })
          } else {
            console.error('Failed to add item to backend cart')
            toast.add({
              title: 'Failed to add item',
              description: 'There was an error adding the item to your cart. Please try again.',
              color: 'error'
            })
          }
        }
      } finally {
        delete this.operationLoading.addItem[itemId]
      }
    },

    /**
     * Remove item from cart (syncs with backend for authenticated, localStorage for guests)
     */
    async removeItem(itemId: string) {
      this.operationLoading.removeItem[itemId] = true
      
      try {
        if (this.isGuest) {
          // Guest user - remove from localStorage
          const index = this.items.findIndex(i => i.id === itemId)
          if (index > -1) {
            this.items.splice(index, 1)
            this.saveGuestCart()
            console.log('Item removed from guest cart')
          }
        } else {
          // Authenticated user - remove from backend
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
        }
      } finally {
        delete this.operationLoading.removeItem[itemId]
      }
    },

    /**
     * Update item quantity (syncs with backend for authenticated, localStorage for guests)
     * Internal method - use incrementQuantity or decrementQuantity instead
     */
    async updateQuantity(itemId: string, quantity: number) {
      if (quantity <= 0) {
        await this.removeItem(itemId)
        return
      }

      // Enforce stock limit
      const limit = this._availableQty(itemId)
      if (quantity > limit) {
        const toast = useToast()
        console.error(`Cannot set quantity to ${quantity}. Only ${limit} left in stock.`)
        toast.add({
          title: 'Quantity limit reached',
          description: limit > 0 ? `Only ${limit} left in stock` : 'This item is currently out of stock',
          color: 'error'
        })
        return
      }

      if (this.isGuest) {
        // Guest user - update in localStorage
        const item = this.items.find(i => i.id === itemId)
        if (item) {
          item.quantity = quantity
          this.saveGuestCart()
          console.log('Item quantity updated in guest cart')
        }
      } else {
        // Authenticated user - update in backend
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
      }
    },

    /**
     * Increment item quantity (syncs with backend)
     */
    async incrementQuantity(itemId: string) {
      this.operationLoading.incrementQuantity[itemId] = true
      
      try {
        const item = this.items.find(i => i.id === itemId)
        if (item) {
          await this.updateQuantity(itemId, item.quantity + 1)
        }
      } finally {
        delete this.operationLoading.incrementQuantity[itemId]
      }
    },

    /**
     * Decrement item quantity (syncs with backend)
     */
    async decrementQuantity(itemId: string) {
      this.operationLoading.decrementQuantity[itemId] = true
      
      try {
        const item = this.items.find(i => i.id === itemId)
        if (item) {
          if (item.quantity > 1) {
            await this.updateQuantity(itemId, item.quantity - 1)
          } else {
            await this.removeItem(itemId)
          }
        }
      } finally {
        delete this.operationLoading.decrementQuantity[itemId]
      }
    },

    /**
     * Clear all items from cart (syncs with backend for authenticated, localStorage for guests)
     */
    async clearCart() {
      this.operationLoading.clearCart = true
      
      try {
        if (this.isGuest) {
          // Guest user - clear from localStorage
          this.items = []
          this.clearGuestCart()
          console.log('Guest cart cleared')
        } else {
          // Authenticated user - clear from backend
          const { clearCart } = useUserCart()
          const success = await clearCart()
          
          if (success) {
            this.items = []
          } else {
            console.error('Failed to clear cart in backend')
          }
        }
      } finally {
        this.operationLoading.clearCart = false
      }
    },

    /**
     * Refresh cart from backend or localStorage
     */
    async refreshCart(isAuthenticated: boolean = false) {
      this.loading = true
      this.isGuest = !isAuthenticated
      
      try {
        if (isAuthenticated) {
          // Refresh from backend for authenticated users
          const { getCart } = useUserCart()
          const cartItems = await getCart()
          this.items = cartItems
          console.log('Authenticated cart refreshed with items:', cartItems)
        } else {
          // Refresh from localStorage for guests
          this.loadGuestCart()
          console.log('Guest cart refreshed with items:', this.items)
        }
      } catch (error) {
        console.error('Failed to refresh cart:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Reset cart state (for logout) - switches back to guest mode
     */
    resetCart() {
      this.items = []
      this.initialized = false
      this.isCartOpen = false
      this.loading = false
      this.isGuest = true
      // Load guest cart after logout
      this.loadGuestCart()
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

