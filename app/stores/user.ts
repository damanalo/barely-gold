import { defineStore } from 'pinia'
import { useUser, type IUser } from '~/composables/api/useUser'

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null as IUser | null,
    loading: false,
    initialized: false
  }),

  getters: {
    user: (state) => state.userData,
    cart: (state) => state.userData?.cart || [],
    userEmail: (state) => state.userData?.email,
    userFullName: (state) => {
      if (!state.userData) return ''
      return `${state.userData.given_name || ''} ${state.userData.family_name || ''}`.trim()
    }
  },

  actions: {
    /**
     * Initialize user data by fetching from backend
     */
    async initUser() {
      if (this.initialized) return
      
      this.loading = true
      try {
        const { getUser } = useUser()
        const userData = await getUser()
        
        if (userData) {
          this.userData = userData
          this.initialized = true
        }
      } catch (error) {
        console.error('Failed to initialize user data:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Refresh user data from backend
     */
    async refreshUser() {
      this.loading = true
      try {
        const { getUser } = useUser()
        const userData = await getUser()
        
        if (userData) {
          this.userData = userData
        }
      } catch (error) {
        console.error('Failed to refresh user data:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Update user data in backend
     */
    async updateUserData(updates: Partial<IUser>) {
      this.loading = true
      try {
        const { updateUser } = useUser()
        const success = await updateUser(updates)
        
        if (success) {
          // Merge updates into local state
          if (this.userData) {
            this.userData = { ...this.userData, ...updates }
          }
          return true
        } else {
          console.error('Failed to update user data in backend')
          return false
        }
      } catch (error) {
        console.error('Failed to update user data:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Clear user data (for logout)
     */
    clearUser() {
      this.userData = null
      this.initialized = false
    }
  }
})

