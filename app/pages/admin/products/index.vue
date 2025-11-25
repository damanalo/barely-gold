<template>
    <div class="flex flex-col gap-4 m-5">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold">Manage Products</h1>
            <UButton @click="navigateToAdd" color="primary">
                Add New Product
            </UButton>
        </div>

        <!-- Search and Items Per Page Controls -->
        <div v-if="!loading && products.length > 0" class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div class="flex-1 max-w-md">
                <UInput
                    v-model="searchQuery"
                    placeholder="Search products by name, category, or status..."
                    icon="i-heroicons-magnifying-glass"
                    size="md"
                />
            </div>
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600 whitespace-nowrap">Items per page:</span>
                <USelect
                    v-model="itemsPerPage"
                    :items="itemsPerPageOptions"
                    value-key="value"
                    label-key="label"
                    class="w-24"
                />
            </div>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="border-2 border-gray-200 rounded-md overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-4 py-3 text-left text-sm font-semibold">ID</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Name</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Category</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Price</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Images</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Created</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="i in 5" 
                        :key="`skeleton-${i}`"
                        class="border-t border-gray-200"
                    >
                        <td class="px-4 py-3"><USkeleton class="h-4 w-20" /></td>
                        <td class="px-4 py-3"><USkeleton class="h-4 w-32" /></td>
                        <td class="px-4 py-3"><USkeleton class="h-6 w-24" /></td>
                        <td class="px-4 py-3"><USkeleton class="h-4 w-16" /></td>
                        <td class="px-4 py-3"><USkeleton class="h-6 w-20" /></td>
                        <td class="px-4 py-3"><USkeleton class="h-4 w-16" /></td>
                        <td class="px-4 py-3"><USkeleton class="h-4 w-24" /></td>
                        <td class="px-4 py-3"><USkeleton class="h-7 w-12" /></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-10">
            <p>{{ error }}</p>
        </div>

        <div v-else-if="products.length === 0" class="text-gray-500 text-center py-10">
            <p>No products found. Add your first product!</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="text-gray-500 text-center py-10">
            <p>No products match your search criteria.</p>
        </div>

        <div v-else class="border-2 border-gray-200 rounded-md overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="px-4 py-3 text-left text-sm font-semibold">ID</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Name</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Category</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Price</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Images</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Created</th>
                        <th class="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr 
                        v-for="product in paginatedProducts" 
                        :key="product.id"
                        class="border-t border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                        @click="navigateToEdit(product.id)"
                    >
                        <td class="px-4 py-3 text-sm text-gray-600">
                            {{ product.id.substring(0, 8) }}...
                        </td>
                        <td class="px-4 py-3 text-sm font-medium">
                            {{ product.name }}
                        </td>
                        <td class="px-4 py-3 text-sm">
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {{ getCategoryName(product.category) }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm font-medium text-green-600">
                            {{ formatPrice(product.price as number) }}
                        </td>
                        <td class="px-4 py-3 text-sm font-medium">
                            {{ (product as any).quantity ?? 0 }}
                        </td>
                        <td class="px-4 py-3 text-sm">
                            <span 
                                :class="[
                                    'px-2 py-1 rounded text-xs font-medium',
                                    product.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-200 text-gray-700'
                                ]"
                            >
                                {{ product.status === 'active' ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-600">
                            {{ product.images?.length || 0 }} image(s)
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-600">
                            {{ formatDate(product.created_at) }}
                        </td>
                        <td class="px-4 py-3 text-sm">
                            <UButton 
                                @click.stop="navigateToEdit(product.id)" 
                                size="xs"
                                color="primary"
                                variant="soft"
                            >
                                Edit
                            </UButton>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="!loading && filteredProducts.length > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div class="text-sm text-gray-600">
                Showing {{ showingFrom }} to {{ showingTo }} of {{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }}
                <span v-if="filteredProducts.length < products.length" class="text-gray-500">
                    (filtered from {{ products.length }} total)
                </span>
            </div>
            <div class="flex items-center gap-2">
                <UButton
                    @click="goToPreviousPage"
                    :disabled="currentPage === 1"
                    icon="i-heroicons-chevron-left"
                    variant="outline"
                    size="sm"
                >
                    Previous
                </UButton>
                <div class="flex items-center gap-1">
                    <span class="text-sm text-gray-600">Page</span>
                    <UInput
                        v-model.number="currentPageInput"
                        type="number"
                        :min="1"
                        :max="totalPages"
                        class="w-16 text-center"
                        @keyup.enter="goToPageFromInput"
                        @blur="goToPageFromInput"
                    />
                    <span class="text-sm text-gray-600">of {{ totalPages }}</span>
                </div>
                <UButton
                    @click="goToNextPage"
                    :disabled="currentPage === totalPages || totalPages === 0"
                    icon="i-heroicons-chevron-right"
                    icon-position="right"
                    variant="outline"
                    size="sm"
                >
                    Next
                </UButton>
            </div>
        </div>

        <!-- Statistics Summary -->
        <div v-if="!loading && products.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div class="border-2 border-gray-200 rounded-md p-4">
                <p class="text-sm text-gray-600">Total Products</p>
                <p class="text-2xl font-bold">{{ filteredProducts.length }}</p>
                <p v-if="filteredProducts.length < products.length" class="text-xs text-gray-500">
                    of {{ products.length }} total
                </p>
            </div>
            <div class="border-2 border-gray-200 rounded-md p-4">
                <p class="text-sm text-gray-600">In Stock</p>
                <p class="text-2xl font-bold text-green-600">{{ inStockCount }}</p>
            </div>
            <div class="border-2 border-gray-200 rounded-md p-4">
                <p class="text-sm text-gray-600">Out of Stock</p>
                <p class="text-2xl font-bold text-red-600">{{ outOfStockCount }}</p>
            </div>
            <div class="border-2 border-gray-200 rounded-md p-4">
                <p class="text-sm text-gray-600">Categories</p>
                <p class="text-2xl font-bold text-blue-600">{{ uniqueCategories }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { useCategoriesStore } from '~/stores/categories'

const router = useRouter()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const loading = computed(() => productsStore.loading)
const error = computed(() => productsStore.error)
const products = computed(() => productsStore.products)

// Helper function for category name
const getCategoryName = (categoryId: string): string => {
    const category = categoriesStore.categories.find(c => c.id === categoryId)
    return category?.name || categoryId
}

// Search functionality
const searchQuery = ref('')

// Pagination state with cookie persistence
const itemsPerPageCookie = useCookie('admin-products-items-per-page', { 
    default: () => 25,
    maxAge: 60 * 60 * 24 * 365 // 1 year
})
const itemsPerPage = ref(itemsPerPageCookie.value)
const currentPage = ref(1)

// Items per page options
const itemsPerPageOptions = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }
]

// Filtered products based on search
const filteredProducts = computed(() => {
    if (!searchQuery.value.trim()) {
        return products.value
    }
    
    const query = searchQuery.value.toLowerCase()
    return products.value.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(query)
        const categoryMatch = getCategoryName(product.category).toLowerCase().includes(query)
        const statusMatch = product.status.toLowerCase().includes(query)
        return nameMatch || categoryMatch || statusMatch
    })
})

// Pagination computed properties
const totalPages = computed(() => {
    if (filteredProducts.value.length === 0) return 0
    return Math.ceil(filteredProducts.value.length / itemsPerPage.value)
})

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredProducts.value.slice(start, end)
})

const showingFrom = computed(() => {
    if (filteredProducts.value.length === 0) return 0
    return (currentPage.value - 1) * itemsPerPage.value + 1
})

const showingTo = computed(() => {
    const end = currentPage.value * itemsPerPage.value
    return Math.min(end, filteredProducts.value.length)
})

// Current page input for direct navigation
const currentPageInput = computed({
    get: () => currentPage.value,
    set: (value) => {
        const numValue = Number(value)
        if (!isNaN(numValue) && numValue >= 1 && numValue <= totalPages.value) {
            currentPage.value = numValue
        }
    }
})

// Statistics (based on filtered products)
const inStockCount = computed(() => 
    filteredProducts.value.filter((p: any) => (p.quantity ?? 0) > 0).length
)
const outOfStockCount = computed(() => 
    filteredProducts.value.filter((p: any) => (p.quantity ?? 0) <= 0).length
)
const uniqueCategories = computed(() => 
    new Set(filteredProducts.value.map(p => p.category)).size
)

// Watch for search query changes to reset to page 1
watch(searchQuery, () => {
    currentPage.value = 1
})

// Watch for items per page changes to reset to page 1 and save preference
watch(itemsPerPage, (newValue) => {
    currentPage.value = 1
    itemsPerPageCookie.value = newValue
})

// Watch totalPages to adjust currentPage if it exceeds available pages
watch(totalPages, (newTotal) => {
    if (currentPage.value > newTotal && newTotal > 0) {
        currentPage.value = newTotal
    }
})

// Pagination navigation functions
const goToPreviousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const goToNextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const goToPageFromInput = () => {
    const numValue = Number(currentPageInput.value)
    if (!isNaN(numValue)) {
        if (numValue < 1) {
            currentPage.value = 1
        } else if (numValue > totalPages.value) {
            currentPage.value = totalPages.value
        } else {
            currentPage.value = numValue
        }
    }
}

onMounted(async () => {
    // Fetch categories for name mapping
    if (categoriesStore.categories.length === 0) {
        await categoriesStore.fetchCategories()
    }
    
    // Fetch all products
    await productsStore.fetchProducts()
})

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    })
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP'
    }).format(price)
}

const navigateToEdit = (productId: string) => {
    router.push(`/admin/products/edit/${productId}`)
}

const navigateToAdd = () => {
    router.push('/admin/products/add')
}
</script>

<style scoped>
/* Add hover effect to table rows */
tbody tr:hover {
    transform: translateX(2px);
}
</style>

