<template>
  <div class="min-h-screen bg-stone-50">
    <UContainer class="py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-stone-800">{{ pageTitle }}</h1>
        <p class="text-stone-600 mt-2">Browse our collection of exquisite jewelry</p>
      </div>

      <!-- Category Grid -->
      <section class="mb-10" aria-labelledby="categories-heading">
        <div class="flex items-center justify-between mb-4">
          <h2 id="categories-heading" class="text-xl font-semibold text-stone-800">Categories</h2>
        </div>

        <div v-if="categoriesStore.loading" class="flex gap-3 overflow-hidden">
          <USkeleton
            v-for="i in 6"
            :key="`category-skeleton-${i}`"
            class="h-16 w-40 rounded-xl"
          />
        </div>

        <div
          v-else
          class="flex gap-3 overflow-x-auto pb-1 -mx-2 px-2"
        >
          <button
            v-for="category in displayCategories"
            :key="category.id"
            type="button"
            @click="handleCategorySelect(category.id)"
            :aria-pressed="currentCategoryId === category.id ? 'true' : 'false'"
            class="relative flex-shrink-0 min-w-[160px] h-20 rounded-2xl text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 cursor-pointer"
            :class="currentCategoryId === category.id 
              ? 'ring-1 ring-[var(--color-gold-200)] shadow-[0_12px_32px_-18px_rgba(0,0,0,0.75)] scale-105' 
              : 'opacity-80 hover:opacity-100'"
          >
            <span
              class="absolute inset-0 rounded-2xl bg-cover bg-center"
              :style="category.image ? { backgroundImage: `url('${category.image}')` } : { backgroundImage: 'linear-gradient(135deg,#f3f4f6,#e7e5e4)' }"
              aria-hidden="true"
            ></span>
            <span
              class="absolute inset-0 rounded-2xl bg-gradient-to-r from-stone-950/70 to-stone-900/30"
              :class="currentCategoryId === category.id ? 'from-stone-950/75 via-stone-900/25 to-transparent' : ''"
              aria-hidden="true"
            ></span>
            <span class="relative z-10 flex flex-col h-full justify-center px-4 text-white">
              <span
                class="text-lg font-semibold"
                :class="currentCategoryId === category.id ? 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]' : 'text-white/90'"
              >
                {{ category.name }}
              </span>
            </span>
          </button>
        </div>
      </section>

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
              v-if="(product as any).quantity !== undefined && (product as any).quantity <= 0"
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
            
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <!-- Price Display -->
                <div class="flex-1">
                  <div v-if="product.salePrice" class="flex items-center gap-2">
                    <span class="text-xl font-bold" style="color: var(--color-gold-600)">&#8369;{{ product.salePrice.toFixed(2) }}</span>
                    <span class="text-sm text-stone-500 line-through">&#8369;{{ product.price.toFixed(2) }}</span>
                  </div>
                  <div v-else>
                    <span class="text-xl font-bold" style="color: var(--color-gold-600)">&#8369;{{ product.price.toFixed(2) }}</span>
                  </div>
                </div>

                <!-- Add to Cart Button -->
                <UButton
                  @click="addToCart(product)"
                  :disabled="((product as any).quantity ?? 0) <= 0 || cartStore.isAnyCartOperationInProgress"
                  :loading="cartStore.operationLoading.addItem[product.id] || false"
                  color="primary"
                  size="sm"
                  icon="i-heroicons-shopping-cart"
                >
                  Add to Cart
                </UButton>
              </div>

              <div
                v-if="product.salePrice"
                class="flex flex-wrap items-center gap-2"
              >
                <span class="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                  Save &#8369;{{ (product.price - product.salePrice).toFixed(2) }}
                </span>
                <span class="inline-block bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                  {{ Math.round(((product.price - product.salePrice) / product.price) * 100) }}% OFF
                </span>
              </div>
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
    <UModal
      v-model:open="isModalOpen"
      :title="selectedProduct?.name || ''"
      :ui="{ content: 'max-w-6xl', body: 'p-0', footer: 'px-6 py-4 border-t border-stone-200' }"
    >
      <template #body>
        <div v-if="selectedProduct" class="flex flex-col md:flex-row">
          <!-- Product Image - 70% -->
          <div class="md:w-[70%] bg-stone-100 flex items-center justify-center p-4">
            <img
              :src="getImageUrl(selectedProduct.images?.[0] as unknown as string)"
              :alt="selectedProduct.name"
              class="w-full h-full object-contain max-h-[600px]"
            />
          </div>

          <!-- Product Details - 30% -->
          <div class="md:w-[30%] p-6 flex flex-col max-h-[80vh] overflow-y-auto">
            <!-- Product Price -->
            <div class="mb-6">
              <div v-if="selectedProduct.salePrice" class="flex flex-col gap-2">
                <div class="flex items-center gap-3">
                  <span class="text-3xl font-bold" style="color: var(--color-gold-600)">
                    &#8369;{{ selectedProduct.salePrice.toFixed(2) }}
                  </span>
                  <span class="text-lg text-stone-500 line-through">
                    &#8369;{{ selectedProduct.price.toFixed(2) }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
                    Save &#8369;{{ (selectedProduct.price - selectedProduct.salePrice).toFixed(2) }}
                  </span>
                  <span class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
                    {{ Math.round(((selectedProduct.price - selectedProduct.salePrice) / selectedProduct.price) * 100) }}% OFF
                  </span>
                </div>
              </div>
              <div v-else>
                <span class="text-3xl font-bold" style="color: var(--color-gold-600)">
                  &#8369;{{ selectedProduct.price.toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Product Status -->
            <div class="mb-6">
              <span
                v-if="(selectedProduct as any).quantity !== undefined && (selectedProduct as any).quantity > 0"
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
            <div class="space-y-4 text-stone-600 leading-relaxed">
              <div>
                <h3 class="text-sm font-semibold text-stone-700 uppercase mb-2">Description</h3>
                <p>{{ selectedProduct.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="selectedProduct" #footer>
        <UButton
          @click="addToCartFromModal"
          :disabled="(((selectedProduct as any)?.quantity ?? 0) <= 0) || cartStore.isAnyCartOperationInProgress"
          :loading="cartStore.operationLoading.addItem[selectedProduct.id] || false"
          color="primary"
          size="xl"
          block
          icon="i-heroicons-shopping-cart"
        >
          Add to Cart
        </UButton>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">

import { useCartStore } from '~/stores/cart'
import { useProductsStore } from '~/stores/products'
import { useCategoriesStore } from '~/stores/categories'
import type { IProduct } from '~/types/product'
import getImageUrl from '~/utils/get-image-url'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

// Modal state
const isModalOpen = ref(false)
const selectedProduct = ref<IProduct | null>(null)

type DisplayCategory = {
  id: string
  name: string
  description?: string
  image?: string
}

const currentCategoryId = computed(() => {
  const categoryParam = route.query.category
  return typeof categoryParam === 'string' && categoryParam.length > 0
    ? categoryParam
    : 'all'
})

const displayCategories = computed<DisplayCategory[]>(() => {
  const formatted = categoriesStore.categories.map(category => ({
    id: category.id,
    name: category.name,
    description: category.description,
    image: category.image
  }))

  return [
    {
      id: 'all',
      name: 'All Products',
      description: 'Browse our complete lineup'
    },
    ...formatted
  ]
})

const ensureCategoryQuery = async () => {
  const categoryParam = route.query.category
  if (typeof categoryParam !== 'string' || categoryParam.length === 0) {
    const nextQuery = { ...route.query, category: 'all' } as Record<string, any>
    await router.replace({ query: nextQuery })
  }
}

onMounted(async () => {
  await ensureCategoryQuery()
  await categoriesStore.fetchCategories()
  await productsStore.fetchProducts()
})


const filteredProducts = computed(() => {
  const source = productsStore.activeProducts
  if (currentCategoryId.value === 'all') {
    return source
  }
  return source.filter(product => product.category === currentCategoryId.value)
})

const pageTitle = computed(() => {
  if (currentCategoryId.value === 'all') {
    return 'All Products'
  }
  const category = categoriesStore.getCategoryById(currentCategoryId.value)
  return category ? category.name : 'Products'
})

const handleCategorySelect = async (categoryId: string) => {
  if (categoryId === currentCategoryId.value) {
    return
  }

  const nextQuery = { ...route.query, category: categoryId } as Record<string, any>
  await router.replace({ query: nextQuery })
}

const addToCart = async (product: IProduct) => {
  await cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.salePrice ?? product.price,
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


