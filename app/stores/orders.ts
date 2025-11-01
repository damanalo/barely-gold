import { defineStore } from 'pinia'
import type { IOrder, IOrderInput } from '../types/order'
import { useOrders } from '../composables/api/useOrders'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as IOrder[],
    currentOrder: null as IOrder | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    /**
     * Get orders sorted by created_at DESC (newest first)
     */
    sortedOrders: (state) => {
      return [...state.orders].sort((a, b) => b.created_at - a.created_at)
    },

    /**
     * Filter orders with pending payment status
     */
    pendingPaymentOrders: (state) => {
      return state.orders.filter(order => order.status === 'pending_payment')
    },

    /**
     * Get N most recent orders
     */
    recentOrders: (state) => {
      return (count: number = 5) => {
        return [...state.orders]
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, count)
      }
    },

    /**
     * Get order by user_id and created_at
     */
    getOrderByKey: (state) => {
      return (userId: string, createdAt: number) => {
        return state.orders.find(
          order => order.user_id === userId && order.created_at === createdAt
        )
      }
    }
  },

  actions: {
    /**
     * Fetch all orders for the current user
     */
    async fetchOrders() {
      this.loading = true
      this.error = null

      try {
        const { getUserOrders } = useOrders()
        const orders = await getUserOrders()
        this.orders = orders
        console.log('Orders fetched:', orders)
      } catch (error) {
        console.error('Failed to fetch orders:', error)
        this.error = 'Failed to load orders'
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch a single order by userId and createdAt
     */
    async fetchOrder(userId: string, createdAt: number) {
      this.loading = true
      this.error = null

      try {
        const { getOrder } = useOrders()
        const order = await getOrder(userId, createdAt)
        
        if (order) {
          this.currentOrder = order
          
          // Update in orders list if exists
          const index = this.orders.findIndex(
            o => o.user_id === userId && o.created_at === createdAt
          )
          if (index > -1) {
            this.orders[index] = order
          } else {
            this.orders.push(order)
          }
        }

        console.log('Order fetched:', order)
        return order
      } catch (error) {
        console.error('Failed to fetch order:', error)
        this.error = 'Failed to load order'
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Create a new order
     */
    async createOrder(orderInput: IOrderInput): Promise<IOrder | null> {
      this.loading = true
      this.error = null

      try {
        const { createOrder } = useOrders()
        const newOrder = await createOrder(orderInput)

        if (newOrder) {
          // Add to orders list
          this.orders.push(newOrder)
          this.currentOrder = newOrder
          console.log('Order created:', newOrder)
          return newOrder
        } else {
          this.error = 'Failed to create order'
          return null
        }
      } catch (error) {
        console.error('Failed to create order:', error)
        this.error = 'Failed to create order'
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * Upload payment proof for an order
     */
    async uploadPaymentProof(order: IOrder, proofFile: File): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        const { updateOrderPaymentProof } = useOrders()
        const success = await updateOrderPaymentProof(order, proofFile)

        if (success) {
          // Refresh the order to get updated data
          await this.fetchOrder(order.user_id, order.created_at)
          console.log('Payment proof uploaded successfully')
          return true
        } else {
          this.error = 'Failed to upload payment proof'
          return false
        }
      } catch (error) {
        console.error('Failed to upload payment proof:', error)
        this.error = 'Failed to upload payment proof'
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Refresh orders from API
     */
    async refreshOrders() {
      await this.fetchOrders()
    },

    /**
     * Clear current order
     */
    clearCurrentOrder() {
      this.currentOrder = null
    },

    /**
     * Reset store state
     */
    resetStore() {
      this.orders = []
      this.currentOrder = null
      this.loading = false
      this.error = null
    }
  }
})

