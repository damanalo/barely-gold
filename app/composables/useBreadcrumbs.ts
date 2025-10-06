import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface Breadcrumb {
  label: string
  to?: string
  active?: boolean
}

export const useBreadcrumbs = () => {
  const route = useRoute()
  
  const shouldShowBreadcrumbs = computed(() => {
    // Hide breadcrumbs on home page and login page
    const hiddenPages = ['/', '/login']
    return !hiddenPages.includes(route.path)
  })
  
  const generateBreadcrumbs = (currentRoute: RouteLocationNormalizedLoaded): Breadcrumb[] => {
    const breadcrumbs: Breadcrumb[] = []
    
    // Always start with Home
    breadcrumbs.push({
      label: 'Home',
      to: '/'
    })
    
    // Split path into segments
    const pathSegments = currentRoute.path.split('/').filter(segment => segment !== '')
    
    // If we're on the home page, return just Home
    if (pathSegments.length === 0) {
      breadcrumbs[0].active = true
      return breadcrumbs
    }
    
    // Build path progressively
    let builtPath = ''
    
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i]
      builtPath += `/${segment}`
      
      // Determine label for the segment with custom mappings
      let label = getLabelForSegment(segment)
      
      // Check if this is the last segment (current page)
      const isLast = i === pathSegments.length - 1
      
      breadcrumbs.push({
        label,
        to: isLast ? undefined : builtPath,
        active: isLast
      })
    }
    
    // Handle query parameters for products page
    if (currentRoute.path === '/products' && currentRoute.query.category) {
      const category = currentRoute.query.category as string
      breadcrumbs.push({
        label: category,
        active: true
      })
      // Make the "Products" breadcrumb clickable to go back to all products
      breadcrumbs[breadcrumbs.length - 2].to = '/products'
      breadcrumbs[breadcrumbs.length - 2].active = false
    }
    
    return breadcrumbs
  }
  
  // Helper function to get proper labels for segments
  const getLabelForSegment = (segment: string): string => {
    const labelMap: Record<string, string> = {
      'admin': 'Admin Dashboard',
      'products': 'Products',
      'categories': 'Categories',
      'add': 'Add New',
      'edit': 'Edit',
      'login': 'Login'
    }
    
    // Return mapped label or capitalize the segment
    if (labelMap[segment]) {
      return labelMap[segment]
    }
    
    // Replace hyphens with spaces and capitalize each word
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  const breadcrumbs = computed(() => generateBreadcrumbs(route))
  
  return {
    breadcrumbs,
    shouldShowBreadcrumbs
  }
}

