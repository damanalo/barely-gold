export default defineNuxtPlugin(() => {
  const router = useRouter()
  
  router.afterEach((to, from) => {
    // If the route has a hash, let the browser handle scrolling to the anchor
    // Otherwise, scroll to top
    if (!to.hash) {
      // Use nextTick to ensure the DOM has updated
      nextTick(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
    }
  })
})

