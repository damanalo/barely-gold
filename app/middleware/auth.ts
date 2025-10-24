import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const timestamp = new Date().toISOString()
  console.log(`\n🟢 [${timestamp}] AUTH MIDDLEWARE START`)
  console.log('  📍 From:', from.path || 'initial')
  console.log('  📍 To:', to.path)
  
  const authStore = useAuthStore();

  console.log('  🔐 Checking auth status...')
  // Ensure the Pinia store has checked the Amplify status
  await authStore.checkAuthStatus();

  console.log('  🔐 Is authenticated?', authStore.isAuthenticated)
  console.log('  👤 User:', authStore.user ? 'exists' : 'null')

  // Check if user is authenticated
  if (!authStore.isAuthenticated && to.path !== '/login' && to.path !== '/signup') {
    console.log('  🔴 User NOT authenticated and NOT going to /login or /signup')
    console.log('  🔴 Redirecting to /login')
    console.log('🟢 AUTH MIDDLEWARE END: REDIRECT to /login\n')
    return navigateTo('/login');
  }

  // Redirect authenticated users away from login/signup pages
  if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/signup')) {
    console.log('  ✅ User IS authenticated and trying to access /login or /signup')
    
    const { public: config } = useRuntimeConfig()
    const showComingSoon = String(config.showComingSoon) === 'true'
    
    console.log('  📦 Config showComingSoon:', config.showComingSoon)
    console.log('  ✅ Converted showComingSoon:', showComingSoon)
    
    // If coming soon is enabled, redirect to admin instead of home
    if (showComingSoon) {
      console.log('  🔴 Coming soon ENABLED - redirecting to /admin')
      console.log('🟢 AUTH MIDDLEWARE END: REDIRECT to /admin\n')
      return navigateTo('/admin');
    }
    
    console.log('  🔴 Coming soon DISABLED - redirecting to /')
    console.log('🟢 AUTH MIDDLEWARE END: REDIRECT to /\n')
    return navigateTo('/');
  }
  
  console.log('  ✅ No redirect needed - passing through')
  console.log('🟢 AUTH MIDDLEWARE END: ALLOW\n')
});