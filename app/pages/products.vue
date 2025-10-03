<template>
  <div class="min-h-screen bg-stone-50">
    <UContainer class="py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-stone-800">{{ pageTitle }}</h1>
        <p class="text-stone-600 mt-2">Browse our collection of exquisite jewelry</p>
      </div>

      <!-- Filter by Category -->
      <div class="mb-8">
        <USelectMenu
          v-model="selectedCategory"
          :options="categoryOptions"
          placeholder="Filter by category"
          class="w-full md:w-64"
        />
      </div>

      <!-- Products Grid -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
        >
          <!-- Product Image -->
          <div class="relative aspect-square overflow-hidden bg-stone-100">
            <img
              :src="product.images[0]"
              :alt="product.name"
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
              <span class="text-xs text-stone-500 uppercase tracking-wide">{{ product.category_name }}</span>
              <h3 class="text-lg font-semibold text-stone-800 mt-1">{{ product.name }}</h3>
            </div>
            <p class="text-sm text-stone-600 line-clamp-2 mb-3">{{ product.description }}</p>
            
            <div class="flex items-center justify-between">
              <span class="text-xl font-bold" style="color: var(--color-gold-600)">&#8369;{{ product.price.toFixed(2) }}</span>
              <UButton
                @click="addToCart(product)"
                :disabled="product.status === 'out_of_stock'"
                color="primary"
                size="sm"
                icon="i-heroicons-shopping-cart"
              >
                Add to Cart
              </UButton>
            </div>

            <div class="mt-3 text-xs text-stone-500">
              SKU: {{ product.sku }}
            </div>
          </div>
        </div>
      </div>

      <!-- No Products Found -->
      <div v-else class="text-center py-12">
        <p class="text-stone-600 text-lg">No products found in this category.</p>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useProducts } from '~/composables/api/useProducts'
import { useCategories } from '~/composables/api/useCategories'
import type { IProduct } from '~/types/product'

const route = useRoute()
const cartStore = useCartStore()

const { getProducts, products } = useProducts()
const { getCategories, categories } = useCategories()

const selectedCategory = ref<string>('all')

onMounted(async () => {
  await getCategories()
  await getProducts()
  
  // Set initial category from query params
  const categoryId = route.query.category as string
  if (categoryId) {
    selectedCategory.value = categoryId
  }
})

// Watch for query parameter changes
watch(() => route.query.category, (newCategory) => {
  if (newCategory) {
    selectedCategory.value = newCategory as string
  }
})

const categoryOptions = computed(() => [
  { label: 'All Categories', value: 'all' },
  ...categories.value.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
])

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products.value
  }
  return products.value.filter(product => product.category_id === selectedCategory.value)
})

const pageTitle = computed(() => {
  if (selectedCategory.value === 'all') {
    return 'All Products'
  }
  const category = categories.value.find(cat => cat.id === selectedCategory.value)
  return category ? category.name : 'Products'
})

const addToCart = (product: IProduct) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0]
  })
  cartStore.openCart()
}
</script>

