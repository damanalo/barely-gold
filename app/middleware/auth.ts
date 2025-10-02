import { useAuthStore } from '~/stores/auth'; // Adjust path to your Pinia store

export default defineNuxtRouteMiddleware(async (to, from) => {
  // NOTE: This runs only on the client because you have ssr: false
  
  const authStore = useAuthStore();

  // 1. Ensure the Pinia store has checked the Amplify status
  await authStore.checkAuthStatus();

  // 2. Auth Guard Logic
  if (!authStore.isAuthenticated && to.path !== '/login' && to.path !== '/signup') {
    // User is not authenticated AND is trying to access a protected route
    return navigateTo('/login');
  }
  
  // Optional: Redirect authenticated users away from login/signup pages
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/'); // or your dashboard page
  }
});