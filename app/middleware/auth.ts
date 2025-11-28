import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  
  const authStore = useAuthStore();

  // List of auth pages that don't require authentication
  const authPages = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email'
  ];

  // Ensure the Pinia store has checked the Amplify status
  await authStore.checkAuthStatus();

  // Check if user is authenticated
  const isAuthPage = authPages.includes(to.path);
  
  if (!authStore.isAuthenticated && !isAuthPage) {
    // Store the intended destination
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }

  // Redirect authenticated users away from auth pages
  if (authStore.isAuthenticated && isAuthPage) {
    const { public: config } = useRuntimeConfig()
    const showComingSoon = String(config.showComingSoon) === 'true'
    
    // Check if there's a redirect query param
    const redirect = to.query.redirect as string;
    
    if (redirect) {
      return navigateTo(redirect);
    }
    
    // If coming soon is enabled, redirect to admin instead of home
    if (showComingSoon) {
      return navigateTo('/admin');
    }
    
    return navigateTo('/');
  }
  

});