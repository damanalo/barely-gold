<template>
  <UApp>
    <header class="border-b border-primary-200 bg-white/70 backdrop-blur sticky top-0 z-50">
      <UContainer class="py-3 flex items-center justify-between">
        <div @click="navigateTo('/')" class="flex items-center gap-2 cursor-pointer">
          <LogoMini :size="28" rounded />
          <span class="font-semibold">Barely Gold</span>
        </div>
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
      <UContainer class="py-6 text-sm text-gray-500 flex items-center justify-between">
        <span>© {{ new Date().getFullYear() }} Barely Gold</span>
        <div class="flex items-center gap-3">
          <ULink to="/faqs" class="hover:text-primary-600">FAQs</ULink>
          <ULink to="/terms-and-conditions" class="hover:text-primary-600">Terms and Conditions</ULink>
          <ULink to="/contact" class="hover:text-primary-600">Contact Us</ULink>
          <ULink to="/about" class="hover:text-primary-600">About Us</ULink>
        </div>
      </UContainer>
    </footer>

    <!-- Cart Slideover -->
    <USlideover
      v-model:open="isCartOpen"
      :title="`Shopping Cart (${cartStore.itemCount})`"
      :ui="{ body: 'p-4 flex-1 overflow-y-auto', footer: 'p-4 border-t' }"
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
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ formatPrice(item.price) }}</p>
              
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
                {{ formatPrice(item.price * item.quantity) }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
          <UIcon name="i-heroicons-shopping-cart" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Your cart is empty</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Add some items to get started!</p>
          <UButton @click="cartStore.closeCart" color="primary">Continue Shopping</UButton>
        </div>
      </template>

      <template v-if="cartStore.items.length > 0" #footer="{ close }">
        <div class="space-y-3">
          <div class="flex justify-between text-lg">
            <span class="font-semibold text-gray-900 dark:text-white">Total</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ formatPrice(cartStore.total) }}</span>
          </div>
          <UButton block color="primary" size="lg" class="mt-2" @click="() => handleCheckout(close)">
            Checkout
          </UButton>
        </div>
      </template>
    </USlideover>
  </UApp>
</template>

<script setup lang="ts">
import LogoMini from '~/components/LogoMini.vue'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const authStore = useAuthStore()
await authStore.checkAuthStatus();
const user = authStore.user

const cartStore = useCartStore()

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

// Initialize on mount
onMounted(async () => {
  await initializeUserData()
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

const route = useRoute()

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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP'
  }).format(price)
}

const handleCheckout = async (close?: () => void) => {
  // Close the slideover UI and navigate to checkout
  close?.()
  cartStore.closeCart()
  await navigateTo('/checkout')
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
      label: 'Account',
      icon: 'i-heroicons-user-circle',
      onSelect: () => navigateTo('/account')
    },
    {
      label: 'Order History',
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

