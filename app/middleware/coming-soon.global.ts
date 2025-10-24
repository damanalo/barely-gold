export default defineNuxtRouteMiddleware((to, from) => {
  const timestamp = new Date().toISOString()
  console.log(`\n🔵 [${timestamp}] COMING-SOON MIDDLEWARE START`)
  console.log('  📍 From:', from.path || 'initial')
  console.log('  📍 To:', to.path)
  console.log('  📍 Full path:', to.fullPath)
  
  const { public: config } = useRuntimeConfig()
  
  console.log('  📦 Config showComingSoon:', config.showComingSoon)
  console.log('  📦 Config type:', typeof config.showComingSoon)
  
  // Check if coming soon mode is enabled
  const showComingSoon = String(config.showComingSoon) === 'true'
  
  console.log('  ✅ Converted showComingSoon:', showComingSoon)
  
  if (!showComingSoon) {
    // Coming soon is disabled, allow all routes
    console.log('  ⏭️  Coming soon DISABLED - allowing all routes')
    console.log('🔵 COMING-SOON MIDDLEWARE END: ALLOW\n')
    return
  }
  
  // Allow these routes to bypass coming soon
  const allowedRoutes = [
    '/coming-soon',
    '/login',
    '/403',  // Allow forbidden page to show when user doesn't have access
  ]
  
  console.log('  📋 Allowed routes:', allowedRoutes)
  console.log('  🔍 Checking if', to.path, 'is in allowed routes...')
  console.log('  🔍 Is in array?', allowedRoutes.includes(to.path))
  console.log('  🔍 Starts with /admin?', to.path.startsWith('/admin'))
  
  // Check if route is allowed
  const isAllowedRoute = allowedRoutes.includes(to.path) || to.path.startsWith('/admin')
  
  console.log('  ⚖️  Is allowed route?', isAllowedRoute)
  
  if (isAllowedRoute) {
    // Allow access to login, admin, and coming-soon page
    console.log('  ✅ Route IS ALLOWED - passing through')
    console.log('🔵 COMING-SOON MIDDLEWARE END: ALLOW\n')
    return
  }
  
  // Redirect to coming soon page
  console.log('  🔴 Route NOT ALLOWED - redirecting to /coming-soon')
  console.log('🔵 COMING-SOON MIDDLEWARE END: REDIRECT to /coming-soon\n')
  return navigateTo('/coming-soon')
})

