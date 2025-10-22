import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // Ensure the Pinia store has checked the Amplify status
  await authStore.checkAuthStatus();

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }

  // Check if user is in Admin group
  if (!authStore.user.groups.includes('Admin')) {
    return navigateTo('/403');
  }
});

