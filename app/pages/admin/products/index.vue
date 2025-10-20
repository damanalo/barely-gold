<template>
    <div class="flex flex-col gap-4 m-5">
        <div class="flex justify-between items-center">
            <h1 class="text-3xl font-bold">Manage Products</h1>
            <UButton @click="navigateToAdd" color="primary">
                Add New Product
            </UButton>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-10">
            <p>Loading products...</p>
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-10">
            <p>{{ error }}</p>
        </div>

        <div v-else-if="products.length === 0" class="text-gray-500 text-center py-10">
            <p>No products found. Add your first product!</p>
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
                        v-for="product in products" 
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
                            ${{ product.price.toFixed(2) }}
                        </td>
                        <td class="px-4 py-3 text-sm">
                            <span 
                                :class="[
                                    'px-2 py-1 rounded text-xs font-medium',
                                    product.status === 'in_stock' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                ]"
                            >
                                {{ product.status === 'in_stock' ? 'In Stock' : 'Out of Stock' }}
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

        <!-- Statistics Summary -->
        <div v-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div class="border-2 border-gray-200 rounded-md p-4">
                <p class="text-sm text-gray-600">Total Products</p>
                <p class="text-2xl font-bold">{{ products.length }}</p>
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

// Statistics
const inStockCount = computed(() => 
    products.value.filter(p => p.status === 'in_stock').length
)
const outOfStockCount = computed(() => 
    products.value.filter(p => p.status === 'out_of_stock').length
)
const uniqueCategories = computed(() => 
    new Set(products.value.map(p => p.category)).size
)

onMounted(async () => {
    // Fetch categories for name mapping
    if (categoriesStore.categories.length === 0) {
        await categoriesStore.fetchCategories()
    }
    
    // Fetch all products
    await productsStore.fetchProducts()
})

const getCategoryName = (categoryId: string): string => {
    const category = categoriesStore.categories.find(c => c.id === categoryId)
    return category?.name || categoryId
}

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    })
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

