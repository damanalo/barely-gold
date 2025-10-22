<template>
  <div class="min-h-screen bg-stone-50">
    <UContainer class="py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-stone-800">{{ pageTitle }}</h1>
        <p class="text-stone-600 mt-2">Browse our collection of exquisite jewelry</p>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="productsStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="i in 8"
          :key="`skeleton-${i}`"
          class="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <!-- Skeleton Image -->
          <USkeleton class="aspect-square w-full" />
          
          <!-- Skeleton Details -->
          <div class="p-4">
            <div class="mb-2">
              <USkeleton class="h-6 w-3/4 mb-2" />
            </div>
            
            <div class="flex items-center justify-between">
              <USkeleton class="h-6 w-20" />
              <USkeleton class="h-9 w-32" />
            </div>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
        >
          <!-- Product Image -->
          <div 
            class="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer"
            @click="openProductModal(product)"
          >
            <img
              :src="getImageUrl(product.images?.[0] as unknown as string)"
              :alt="product.name"
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div
              v-if="product.status === 'out_of_stock'"
              class="absolute inset-0 bg-black/50 flex items-center justify-center"
            >
              <span class="bg-red-500 text-white px-4 py-2 rounded-md font-semibold">Out of Stock</span>
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-4">
            <div class="mb-2">
              <h3 class="text-lg font-semibold text-stone-800 mt-1">{{ product.name }}</h3>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-xl font-bold" style="color: var(--color-gold-600)">&#8369;{{ product.price.toFixed(2) }}</span>
              <UButton
                @click="addToCart(product)"
                :disabled="product.status === 'out_of_stock' || cartStore.isAnyCartOperationInProgress"
                :loading="cartStore.operationLoading.addItem[product.id] || false"
                color="primary"
                size="sm"
                icon="i-heroicons-shopping-cart"
              >
                Add to Cart
              </UButton>
            </div>

          </div>
        </div>
      </div>

      <!-- No Products Found -->
      <div v-else class="text-center py-12">
        <p class="text-stone-600 text-lg">No products found in this category.</p>
      </div>
    </UContainer>

    <!-- Product Details Modal -->
    <Teleport to="body">
      <!-- Overlay -->
      <Transition name="fade">
        <div 
          v-if="isModalOpen && selectedProduct" 
          class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" 
          @click="closeModal"
        >
          <!-- Modal Content -->
          <Transition name="slide-down" appear>
            <div 
              v-if="isModalOpen && selectedProduct"
              class="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              @click.stop
            >
              <div class="flex flex-col md:flex-row h-full">
              <!-- Product Image - 70% -->
              <div class="md:w-[70%] bg-stone-100 flex items-center justify-center p-4 overflow-hidden">
                <img
                  :src="getImageUrl(selectedProduct.images?.[0] as unknown as string)"
                  :alt="selectedProduct.name"
                  class="w-full h-full object-contain max-h-[600px]"
                />
              </div>

              <!-- Product Details - 30% -->
              <div class="md:w-[30%] p-6 flex flex-col max-h-[90vh] overflow-y-auto">
                <!-- Close Button -->
                <button 
                  @click="closeModal"
                  class="absolute top-4 right-4 md:relative md:top-0 md:right-0 md:self-end p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div class="flex-1">
                  <!-- Product Name -->
                  <h2 class="text-2xl font-bold text-stone-800 mb-4">{{ selectedProduct.name }}</h2>

                  <!-- Product Price -->
                  <div class="mb-6">
                    <span class="text-3xl font-bold" style="color: var(--color-gold-600)">
                      &#8369;{{ selectedProduct.price.toFixed(2) }}
                    </span>
                  </div>

                  <!-- Product Status -->
                  <div class="mb-6">
                    <span 
                      v-if="selectedProduct.status === 'in_stock'" 
                      class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      In Stock
                    </span>
                    <span 
                      v-else 
                      class="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      Out of Stock
                    </span>
                  </div>

                  <!-- Product Description -->
                  <div class="mb-6">
                    <h3 class="text-sm font-semibold text-stone-700 uppercase mb-2">Description</h3>
                    <p class="text-stone-600 leading-relaxed">{{ selectedProduct.description }}</p>
                  </div>
                </div>

                <!-- Add to Cart Button -->
                <div class="mt-auto pt-4 border-t border-stone-200">
                  <UButton
                    @click="addToCartFromModal"
                    :disabled="selectedProduct.status === 'out_of_stock' || cartStore.isAnyCartOperationInProgress"
                    :loading="cartStore.operationLoading.addItem[selectedProduct.id] || false"
                    color="primary"
                    size="xl"
                    block
                    icon="i-heroicons-shopping-cart"
                    class="w-full"
                  >
                    Add to Cart
                  </UButton>
                </div>
              </div>
            </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useProductsStore } from '~/stores/products'
import { useCategoriesStore } from '~/stores/categories'
import type { IProduct } from '~/types/product'

const route = useRoute()
const cartStore = useCartStore()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()
const config = useRuntimeConfig()

// Modal state
const isModalOpen = ref(false)
const selectedProduct = ref<IProduct | null>(null)

// Helper function to get full image URL from CloudFront
const getImageUrl = (imagePath: string | undefined) => {
  return `${config.public.publicCloudfrontUrl}/${imagePath || 'misc/bg_image_not_available.png'}`
}

onMounted(async () => {
  await categoriesStore.fetchCategories()
  await productsStore.fetchProducts()
})


const categoryOptions = computed(() => categoriesStore.categoryOptions)

const filteredProducts = computed(() => {
  if (route.query.category === 'all') {
    return productsStore.products
  }
  return productsStore.products.filter(product => product.category === route.query.category)
})

const pageTitle = computed(() => {
  if (route.query.category === 'all') {
    return 'All Products'
  }
  const category = categoriesStore.getCategoryById(route.query.category as string)
  return category ? category.name : 'Products'
})

const addToCart = async (product: IProduct) => {
  await cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: getImageUrl(product.images?.[0] as unknown as string)
  })
  cartStore.openCart()
}

// Modal functions
const openProductModal = (product: IProduct) => {
  selectedProduct.value = product
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedProduct.value = null
}

const addToCartFromModal = () => {
  if (selectedProduct.value) {
    addToCart(selectedProduct.value)
    closeModal()
  }
}
</script>

<style scoped>
/* Fade transition for modal overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide down/up transition for modal content */
.slide-down-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-down-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-50px) scale(0.95);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(50px) scale(0.95);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>

