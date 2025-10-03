<template>
  <UApp>
    <header class="border-b border-primary-200 bg-white/70 backdrop-blur sticky top-0 z-50">
      <UContainer class="py-3 flex items-center justify-between">
        <div @click="navigateTo('/')" class="flex items-center gap-2 cursor-pointer">
          <LogoMini :size="28" rounded />
          <span class="font-semibold">Barely Gold</span>
        </div>
        <nav class="flex items-center gap-4">
          <ULink to="/" active-class="text-primary-600" class="hover:text-primary-600">Home</ULink>
          <ULink @click="handleProductsClick" active-class="text-primary-600" class="hover:text-primary-600 cursor-pointer">Products</ULink>
          <UButton 
            @click="cartStore.openCart" 
            icon="i-heroicons-shopping-cart" 
            variant="ghost" 
            class="cursor-pointer relative"
          >
            Cart
            <UBadge v-if="cartStore.itemCount > 0" color="primary" variant="solid" class="absolute -top-1 -right-1">
              {{ cartStore.itemCount }}
            </UBadge>
          </UButton>
          <span>|</span>
          <span v-if="authStore.isAuthenticated && user">Welcome, {{ user.given_name }} </span>
          <UButton v-if="authStore.isAuthenticated" @click="authStore.signOut" variant="ghost" class="cursor-pointer">Sign Out</UButton>
        </nav>
      </UContainer>
    </header>

    <main>
      <slot />
    </main>

    <footer class="mt-12">
      <UContainer class="py-6 text-sm text-gray-500 flex items-center justify-between">
        <span>© {{ new Date().getFullYear() }} Barely Gold</span>
        <div class="flex items-center gap-3">
          <ULink to="/" class="hover:text-primary-600">Home</ULink>
        </div>
      </UContainer>
    </footer>

    <!-- Cart Slideover -->
    <Teleport to="body">
      <!-- Overlay -->
      <Transition name="fade">
        <div 
          v-if="cartStore.isCartOpen" 
          class="fixed inset-0 bg-black/50 z-40" 
          @click="cartStore.closeCart"
        ></div>
      </Transition>
      
      <!-- Cart Panel -->
      <Transition name="slide-right">
        <div 
          v-if="cartStore.isCartOpen" 
          class="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              Shopping Cart ({{ cartStore.itemCount }})
            </h3>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="cartStore.closeCart" />
          </div>

          <!-- Cart Items -->
          <div class="flex-1 overflow-y-auto p-4">
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
                      color="neutral" 
                      variant="outline"
                      @click="cartStore.decrementQuantity(item.id)"
                    />
                    <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
                    <UButton 
                      icon="i-heroicons-plus" 
                      size="xs" 
                      color="neutral" 
                      variant="outline"
                      @click="cartStore.incrementQuantity(item.id)"
                    />
                    <UButton 
                      icon="i-heroicons-trash" 
                      size="xs" 
                      color="error" 
                      variant="ghost"
                      class="ml-auto"
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

            <!-- Empty Cart State -->
            <div v-else class="flex flex-col items-center justify-center py-12 text-center">
              <UIcon name="i-heroicons-shopping-cart" class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Your cart is empty</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Add some items to get started!</p>
              <UButton @click="cartStore.closeCart" color="primary">Continue Shopping</UButton>
            </div>
          </div>

          <!-- Footer / Totals -->
          <div v-if="cartStore.items.length > 0" class="p-4 border-t border-gray-200 dark:border-gray-800">
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatPrice(cartStore.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatPrice(cartStore.tax) }}</span>
              </div>
              <UDivider />
              <div class="flex justify-between text-base">
                <span class="font-semibold text-gray-900 dark:text-white">Total</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ formatPrice(cartStore.total) }}</span>
              </div>
              <UButton block color="primary" size="lg" class="mt-4">
                Checkout
              </UButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
</script>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide from right transition for cart panel */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
}
</style>
