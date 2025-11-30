<template>
  <UApp>
    <header class="border-b border-primary-200 bg-white/70 backdrop-blur sticky top-0 z-50">
      <UContainer class="py-3 flex items-center justify-between">
        <!-- Logo and Mobile Hamburger -->
        <div class="flex items-center gap-3">
          <UButton 
            @click="isMobileMenuOpen = true" 
            icon="i-heroicons-bars-3" 
            color="primary"
            variant="ghost" 
            class="md:hidden cursor-pointer"
            aria-label="Open menu"
          />
          <div @click="navigateTo('/')" class="flex items-center gap-2 cursor-pointer">
            <LogoMini :size="28" rounded />
            <span class="font-semibold">Barely Gold</span>
          </div>
        </div>

        <!-- Desktop Category Navigation -->
        <nav ref="navContainer" class="hidden md:flex items-center gap-1 relative">
          <button
            v-for="category in categoriesStore.categories"
            :key="category.id"
            :ref="(el) => setNavButtonRef(el, category.id)"
            @click="handleCategoryClick(category.id)"
            class="px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer relative"
            :class="activeCategory === category.id 
              ? 'text-[var(--color-gold-700)]' 
              : 'text-gray-600 hover:text-gray-900'"
          >
            {{ category.name }}
          </button>
          <!-- Animated underline -->
          <span 
            v-if="underlineStyle"
            class="absolute bottom-0 h-0.5 rounded-full transition-all duration-300 ease-out"
            :style="underlineStyle"
          ></span>
        </nav>

        <!-- Cart and Settings -->
        <nav class="flex items-center gap-4">
          <UButton 
            @click="cartStore.openCart" 
            icon="i-heroicons-shopping-cart" 
            color="primary"
            variant="ghost" 
            class="cursor-pointer relative"
          >
            Cart
            <UBadge v-if="cartStore.itemCount > 0" size="xs" color="primary" variant="solid" class="absolute -top-1 -right-1">
              {{ cartStore.itemCount }}
            </UBadge>
          </UButton>
          <UButton 
            v-if="!authStore.isAuthenticated"
            @click="handleLoginClick" 
            icon="i-heroicons-arrow-right-on-rectangle" 
            color="primary"
            variant="ghost" 
            class="cursor-pointer"
          >
            Login
          </UButton>
          <UDropdownMenu v-if="authStore.isAuthenticated" :items="settingsMenuItems">
            <UButton 
              icon="i-heroicons-cog-6-tooth" 
              color="primary"
              variant="ghost" 
              class="cursor-pointer"
            />
          </UDropdownMenu>
        </nav>
      </UContainer>
    </header>

    <Breadcrumbs />

    <main>
      <slot />
    </main>

    <footer class="mt-12 bg-[#f7e7ce]">
      <UContainer class="py-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
        <div class="flex items-center gap-3 flex-wrap justify-center order-1 md:order-2">
          <ULink to="/faqs" class="hover:text-primary-600">FAQs</ULink>
          <ULink to="/terms-and-conditions" class="hover:text-primary-600">Terms and Conditions</ULink>
          <ULink to="/contact" class="hover:text-primary-600">Contact Us</ULink>
          <ULink to="/about" class="hover:text-primary-600">About Us</ULink>
        </div>
        <span class="order-2 md:order-1">© {{ new Date().getFullYear() }} Barely Gold</span>
      </UContainer>
    </footer>

    <!-- Mobile Navigation Menu -->
    <USlideover
      v-model:open="isMobileMenuOpen"
      title="Categories"
      side="left"
      :ui="{ body: 'p-4 flex-1 overflow-y-auto' }"
    >
      <template #body>
        <div class="flex flex-col gap-1">
          <button
            v-for="category in categoriesStore.categories"
            :key="category.id"
            @click="handleMobileCategoryClick(category.id)"
            class="px-4 py-3 text-left text-base font-medium transition-all duration-200 cursor-pointer relative rounded-lg"
            :class="activeCategory === category.id 
              ? 'text-[var(--color-gold-700)] bg-[var(--color-gold-50)]' 
              : 'text-gray-700 hover:bg-gray-50'"
          >
            {{ category.name }}
          </button>
        </div>
      </template>
    </USlideover>

    <!-- Cart Slideover -->
    <USlideover
      v-model:open="isCartOpen"
      :title="`Shopping Cart (${cartStore.itemCount})`"
      :ui="{ body: 'p-4 flex-1 overflow-y-auto flex flex-col', footer: 'p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 block' }"
    >
      <template #body>
        <div v-if="cartStore.items.length > 0" class="flex flex-col gap-4">
          <div v-for="item in cartStore.items" :key="item.id" class="flex gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div v-if="item.image" class="w-20 h-20 flex-shrink-0">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover rounded" />
            </div>
            <div v-else class="w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
              <UIcon name="i-heroicons-photo" class="w-8 h-8 text-gray-400" />
            </div>

            <div class="flex-1 min-w-0">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ item.name }}</h4>
              <p class="text-xs text-gray-400 dark:text-gray-500">{{ capitalizeFirst(productsStore.getProductById(item.id)?.category) }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">₱{{ formatPrice(item.price) }}</p>
              
              <div class="flex items-center gap-2 mt-3">
                <UButton 
                  icon="i-heroicons-minus" 
                  size="xs" 
                  color="primary" 
                  variant="outline"
                  :loading="cartStore.operationLoading.decrementQuantity[item.id] || false"
                  :disabled="cartStore.isAnyCartOperationInProgress"
                  @click="cartStore.decrementQuantity(item.id)"
                />
                <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
                <UButton 
                  icon="i-heroicons-plus" 
                  size="xs" 
                  color="primary" 
                  variant="outline"
                  :loading="cartStore.operationLoading.incrementQuantity[item.id] || false"
                  :disabled="cartStore.isAnyCartOperationInProgress"
                  @click="cartStore.incrementQuantity(item.id)"
                />
                <UButton 
                  icon="i-heroicons-trash" 
                  size="xs" 
                  color="error" 
                  variant="ghost"
                  class="ml-auto"
                  :loading="cartStore.operationLoading.removeItem[item.id] || false"
                  :disabled="cartStore.isAnyCartOperationInProgress"
                  @click="cartStore.removeItem(item.id)"
                />
              </div>
            </div>

            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                ₱{{ formatPrice(item.price * item.quantity) }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center flex-1 py-12 text-center">
          <UIcon name="i-heroicons-shopping-cart" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Your cart is empty</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Add some items to get started!</p>
          <UButton @click="handleContinueShopping" color="primary">Continue Shopping</UButton>
        </div>
      </template>

      <template v-if="cartStore.items.length > 0" #footer="{ close }">
        <div class="flex items-center justify-between gap-6">
          <!-- Total Label -->
          <div>
            <span class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Total
            </span>
            <div class="text-3xl font-bold" style="color: var(--color-gold-600)">
              ₱{{ formatPrice(cartStore.total) }}
            </div>
          </div>

          <!-- Amount + Action -->
          <div>
            <UButton
              color="primary"
              size="lg"
              class="font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-200"
              @click="() => handleCheckout(close)"
            >
              Checkout
            </UButton>
          </div>
        </div>
      </template>
    </USlideover>
  </UApp>
</template>

<script setup lang="ts">
import LogoMini from '~/components/LogoMini.vue'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useCategoriesStore } from '~/stores/categories'
import { useProductsStore } from '~/stores/products'
import formatPrice from '~/utils/format-price'

const authStore = useAuthStore()
await authStore.checkAuthStatus();
const user = authStore.user

const cartStore = useCartStore()
const categoriesStore = useCategoriesStore()
const productsStore = useProductsStore()
const route = useRoute()

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Computed property for cart v-model binding
const isCartOpen = computed({
  get: () => cartStore.isCartOpen,
  set: (value: boolean) => {
    if (value) {
      cartStore.openCart()
    } else {
      cartStore.closeCart()
    }
  }
})

// Active category based on route query
const activeCategory = computed(() => {
  return route.query.category as string | undefined
})

// Navigation underline animation
const navContainer = ref<HTMLElement | null>(null)
const navButtonRefs = ref<Map<string, HTMLElement>>(new Map())

const setNavButtonRef = (el: any, categoryId: string) => {
  if (el) {
    navButtonRefs.value.set(categoryId, el)
  }
}

const underlineStyle = computed(() => {
  if (!navContainer.value || !activeCategory.value) return null
  
  const activeButton = navButtonRefs.value.get(activeCategory.value)
  if (!activeButton) return null
  
  const containerRect = navContainer.value.getBoundingClientRect()
  const buttonRect = activeButton.getBoundingClientRect()
  
  const left = buttonRect.left - containerRect.left
  const width = buttonRect.width
  
  return {
    left: `${left}px`,
    width: `${width}px`,
    backgroundColor: 'var(--color-gold-700)'
  }
})

// Category navigation handlers
const handleCategoryClick = async (categoryId: string) => {
  await navigateTo(`/products?category=${categoryId}`)
}

const handleMobileCategoryClick = async (categoryId: string) => {
  isMobileMenuOpen.value = false
  await navigateTo(`/products?category=${categoryId}`)
}

// Initialize user data and cart when authenticated
const initializeUserData = async () => {
  if (authStore.isAuthenticated) {
    console.log('Initializing user data and cart...')
    // Import and initialize user store
    const { useUserStore } = await import('~/stores/user')
    const userStore = useUserStore()
    
    // Initialize user data
    await userStore.initUser()
    
    // Sync guest cart to backend if exists, then initialize authenticated cart
    const hasGuestCart = cartStore.items.length > 0 && cartStore.isGuest
    
    if (hasGuestCart) {
      console.log('Syncing guest cart to backend...')
      await cartStore.syncGuestCartToBackend()
    } else {
      // Initialize cart from backend
      await cartStore.initCart(true)
    }
    
    console.log('User data and cart initialized. Cart items:', cartStore.items)
  } else {
    // Initialize guest cart from localStorage
    console.log('Initializing guest cart...')
    await cartStore.initCart(false)
  }
}

// Handle window resize for underline recalculation
const handleResize = () => {
  // Force recomputation of underline style
  if (underlineStyle.value) {
    // Trigger reactivity by accessing the computed
    void underlineStyle.value
  }
}

// Initialize on mount
onMounted(async () => {
  await categoriesStore.fetchCategories()
  // Load products for category lookups in cart
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
  await initializeUserData()
  
  // Recalculate underline position after categories load
  await nextTick()
  
  // Add resize listener for underline recalculation
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Watch for authentication changes and reload cart
watch(() => authStore.isAuthenticated, async (isAuth) => {
  if (isAuth) {
    console.log('User authenticated, syncing and loading cart...')
    await initializeUserData()
  } else {
    console.log('User logged out, switching to guest cart...')
    cartStore.resetCart()
  }
})

const handleProductsClick = async () => {
  if (route.path === '/') {
    // Already on home page, scroll to products section
    const productsSection = document.getElementById('products')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  } else {
    // Navigate to home page with hash
    await navigateTo('/#products')
  }
}


const handleCheckout = async (close?: () => void) => {
  // Close the slideover UI and navigate to checkout
  close?.()
  cartStore.closeCart()
  await navigateTo('/checkout')
}

const handleContinueShopping = async () => {
  cartStore.closeCart()
  await navigateTo('/products')
}

const handleLoginClick = async () => {
  // Preserve current route when navigating to login
  const currentPath = route.fullPath
  await navigateTo({
    path: '/login',
    query: { redirect: currentPath }
  })
}

// Capitalize first letter of a string
const capitalizeFirst = (str: string | undefined): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const isAdmin = computed(() => {
  return authStore.user?.groups?.includes('Admin') || false
})

const settingsMenuItems = computed(() => {
  const items = []
  
  // Admin section (only if user is admin)
  if (isAdmin.value) {
    items.push([
      {
        label: 'Admin Dashboard',
        icon: 'i-heroicons-cog-6-tooth',
        onSelect: () => navigateTo('/admin')
      }
    ])
  }
  
  // User sections
  items.push([
    {
      label: 'My Account',
      icon: 'i-heroicons-user-circle',
      onSelect: () => navigateTo('/account')
    },
    {
      label: 'My Orders',
      icon: 'i-heroicons-clipboard-document-list',
      onSelect: () => navigateTo('/order-history')
    }
  ])
  
  // Sign out section
  items.push([
    {
      label: 'Sign Out',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      onSelect: () => authStore.signOut()
    }
  ])
  
  return items
})
</script>

