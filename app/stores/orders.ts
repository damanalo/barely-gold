import { defineStore } from 'pinia'
import type { IOrder, IOrderInput } from '../types/order'
import { useOrders } from '../composables/api/useOrders'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [] as IOrder[],
    allOrders: [] as IOrder[], // For admin view - all orders
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
    },

    /**
     * Get all orders sorted by created_at DESC (for admin)
     */
    sortedAllOrders: (state) => {
      return [...state.allOrders].sort((a, b) => b.created_at - a.created_at)
    },

    /**
     * Get quick stats for dashboard
     */
    orderStats: (state) => {
      const total = state.allOrders.length
      const pendingPayments = state.allOrders.filter(o => o.payment_status === 'pending').length
      const processing = state.allOrders.filter(o => o.status === 'processing').length
      const totalRevenue = state.allOrders
        .filter(o => o.payment_status === 'verified')
        .reduce((sum, order) => sum + order.total, 0)
      
      return {
        total,
        pendingPayments,
        processing,
        totalRevenue
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
     * Fetch all orders (admin only)
     */
    async fetchAllOrders() {
      this.loading = true
      this.error = null

      try {
        const { getAllOrders } = useOrders()
        const orders = await getAllOrders()
        this.allOrders = orders
      } catch (error) {
        console.error('Failed to fetch all orders:', error)
        this.error = 'Failed to load all orders'
      } finally {
        this.loading = false
      }
    },

    /**
     * Update an order
     */
    async updateOrder(order: IOrder): Promise<boolean> {
      this.loading = true
      this.error = null

      try {
        const { updateOrder } = useOrders()
        const success = await updateOrder(order)

        if (success) {
          // Update in allOrders list if exists
          const index = this.allOrders.findIndex(
            o => o.user_id === order.user_id && o.created_at === order.created_at
          )
          if (index > -1) {
            this.allOrders[index] = order
          }

          // Update in user's orders list if exists
          const userIndex = this.orders.findIndex(
            o => o.user_id === order.user_id && o.created_at === order.created_at
          )
          if (userIndex > -1) {
            this.orders[userIndex] = order
          }

          return true
        } else {
          this.error = 'Failed to update order'
          return false
        }
      } catch (error) {
        console.error('Failed to update order:', error)
        this.error = 'Failed to update order'
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
      this.allOrders = []
      this.currentOrder = null
      this.loading = false
      this.error = null
    }
  }
})

