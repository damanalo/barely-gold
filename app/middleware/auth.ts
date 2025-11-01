import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  
  const authStore = useAuthStore();

  // Ensure the Pinia store has checked the Amplify status
  await authStore.checkAuthStatus();

  // Check if user is authenticated
  if (!authStore.isAuthenticated && to.path !== '/login' && to.path !== '/signup') {
    return navigateTo('/login');
  }

  // Redirect authenticated users away from login/signup pages
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    
    const { public: config } = useRuntimeConfig()
    const showComingSoon = String(config.showComingSoon) === 'true'
    
    // If coming soon is enabled, redirect to admin instead of home
    if (showComingSoon) {
      return navigateTo('/admin');
    }
    
    return navigateTo('/');
  }
  

});