import { defineStore } from 'pinia';
import { fetchUserAttributes, fetchAuthSession } from 'aws-amplify/auth'; // Import client-side Amplify Auth
import { signOut } from 'aws-amplify/auth';
import { navigateTo } from 'nuxt/app';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
    isAuthenticated: false,
    loading: true,
  }),
  actions: {
    // This is the core logic to check auth status with Amplify
    async checkAuthStatus() {
      if (!this.loading && this.isAuthenticated) {
        return; // Already checked and authenticated
      }
      
      this.loading = true;
      try {
        const userAttributes = await fetchUserAttributes();
        const { tokens } = await fetchAuthSession();
        const groups = tokens?.accessToken?.payload['cognito:groups'] || [];
        const user = {userAttributes, groups};
        
        this.user = user;
        this.isAuthenticated = true;
        this.loading = false;
        navigateTo('/');
      } catch (error) {
        this.user = null;
        this.isAuthenticated = false;
        this.loading = false;
        // Optionally, clear local tokens if an error indicates an invalid session
      }
    },
    
    // Simple setter for logging out/in if you use the Auth UI components
    setUser(user: any | null) {
      this.user = user;
      this.isAuthenticated = !!user;
    },
    
    // You should also have sign-in/sign-out actions that update this state
    async signOut() {
      await signOut(); // Call Amplify signOut
      this.setUser(null);
      
      // Clear user and cart data from stores
      const { useUserStore } = await import('./user');
      const { useCartStore } = await import('./cart');
      
      const userStore = useUserStore();
      const cartStore = useCartStore();
      
      userStore.clearUser();
      cartStore.resetCart();
      
      navigateTo('/login');
    },
  },
});