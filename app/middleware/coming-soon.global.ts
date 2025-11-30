export default defineNuxtRouteMiddleware(async (to, from) => {
  const { public: config } = useRuntimeConfig()
  
  // Check if coming soon mode is enabled
  const showComingSoon = String(config.showComingSoon) === 'true'
  
  if (!showComingSoon) {
    // Coming soon is disabled, allow all routes
    return
  }
  
  // Check if user is admin - admins can access all pages
  const authStore = useAuthStore()
  await authStore.checkAuthStatus()
  
  if (authStore.isAuthenticated && authStore.user?.groups?.includes('Admin')) {
    return
  }
  
  // Allow these routes to bypass coming soon
  const allowedRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/403',  // Allow forbidden page to show when user doesn't have access
  ]
  
  // Check if route is allowed
  const isAllowedRoute = allowedRoutes.includes(to.path) || to.path.startsWith('/admin')
  
  if (isAllowedRoute) {
    // Allow access to login, admin, and 403 page
    return
  }
  
  // Redirect to 403 page
  return navigateTo('/403')
})

