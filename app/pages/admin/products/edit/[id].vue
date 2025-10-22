<template>
    <div class="flex flex-col gap-4 m-5 border-2 border-gray-200 rounded-md p-5">
        <h1 class="text-3xl font-bold text-center">Edit Product</h1>
        
        <!-- Loading Skeleton -->
        <div v-if="loading" class="flex flex-col gap-4 w-1/4 mx-auto">
            <div class="flex flex-col gap-2">
                <USkeleton class="h-4 w-20 mb-1" />
                <USkeleton class="h-10 w-full" />
            </div>
            <div class="flex flex-col gap-2">
                <USkeleton class="h-4 w-20 mb-1" />
                <USkeleton class="h-10 w-full" />
            </div>
            <div class="flex flex-col gap-2">
                <USkeleton class="h-4 w-24 mb-1" />
                <USkeleton class="h-10 w-full" />
            </div>
            <div class="flex flex-col gap-2">
                <USkeleton class="h-4 w-16 mb-1" />
                <USkeleton class="h-10 w-full" />
            </div>
            <div class="flex flex-col gap-2">
                <USkeleton class="h-4 w-16 mb-1" />
                <USkeleton class="h-10 w-full" />
            </div>
            <div class="flex flex-col gap-2">
                <USkeleton class="h-4 w-20 mb-1" />
                <USkeleton class="h-10 w-full" />
            </div>
            <div class="flex gap-2">
                <USkeleton class="h-10 flex-1" />
                <USkeleton class="h-10 flex-1" />
            </div>
        </div>

        <div v-else-if="!product" class="flex justify-center items-center">
            <p class="text-red-500">Product not found</p>
        </div>

        <div v-else class="flex flex-col gap-4 w-1/4 mx-auto">
            <div class="flex flex-col gap-2">
                <label for="category">Category <span class="text-red-500">*</span></label>
                <USelect 
                    v-model="category" 
                    placeholder="Category" 
                    :items="categories" 
                    value-key="id" 
                    label-key="name"
                    :disabled="productsStore.loading"
                    :class="{ 'border-red-500': errors.category }"
                />
                <span v-if="errors.category" class="text-red-500 text-sm">{{ errors.category }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <label for="name">Name <span class="text-red-500">*</span></label>
                <UInput 
                    v-model="name" 
                    placeholder="Name"
                    :disabled="productsStore.loading"
                    :class="{ 'border-red-500': errors.name }"
                />
                <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <label for="description">Description <span class="text-red-500">*</span></label>
                <UInput 
                    v-model="description" 
                    placeholder="Description"
                    :disabled="productsStore.loading"
                    :class="{ 'border-red-500': errors.description }"
                />
                <span v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <label for="price">Price <span class="text-red-500">*</span></label>
                <UInputNumber 
                    v-model="price" 
                    placeholder="Price"
                    :disabled="productsStore.loading"
                    :class="{ 'border-red-500': errors.price }"
                />
                <span v-if="errors.price" class="text-red-500 text-sm">{{ errors.price }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <label for="status">Status <span class="text-red-500">*</span></label>
                <USelect 
                    v-model="status" 
                    placeholder="Status" 
                    :items="statusOptions"
                    :disabled="productsStore.loading"
                    :class="{ 'border-red-500': errors.status }"
                />
                <span v-if="errors.status" class="text-red-500 text-sm">{{ errors.status }}</span>
            </div>
            <div class="flex flex-col gap-2">
                <label for="images">Images (optional - upload new to replace existing)</label>
                <UFileUpload 
                    accept="image/jpeg, image/jpg" 
                    multiple 
                    v-model="images" 
                    placeholder="Upload new images"
                    :disabled="productsStore.loading"
                    :class="{ 'border-red-500': errors.images }"
                />
                <span v-if="errors.images" class="text-red-500 text-sm">{{ errors.images }}</span>
                <span v-if="existingImageCount > 0" class="text-gray-600 text-sm">
                    Currently has {{ existingImageCount }} existing image(s)
                </span>
            </div>
            <div class="flex gap-2">
                <UButton 
                    @click="handleUpdateProduct" 
                    class="justify-center flex-1" 
                    block
                    :loading="productsStore.loading"
                    :disabled="productsStore.loading"
                >
                    Update Product
                </UButton>
                <UButton 
                    @click="handleCancel" 
                    color="neutral" 
                    class="justify-center flex-1" 
                    block
                    :disabled="productsStore.loading"
                >
                    Cancel
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { useCategoriesStore } from '~/stores/categories'
import type { SelectItem } from '@nuxt/ui'
import { productUpdateSchema } from '~/utils/schemas/product.schema'
import { ZodError, type ZodIssue } from 'zod'

const route = useRoute()
const router = useRouter()
const productId = route.params.id as string

const statusOptions = ref<SelectItem[]>([
    { label: 'In Stock', value: 'in_stock' },
    { label: 'Out of Stock', value: 'out_of_stock' }
])

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const category = ref<string>('')
const name = ref<string>('')
const description = ref<string>('')
const price = ref<number>(0)
const status = ref<'in_stock' | 'out_of_stock'>('in_stock')
const images = ref<File[] | null>(null)
const existingImages = ref<string[]>([])
const existingImageCount = ref<number>(0)

// Store original values
const originalCreatedAt = ref<number>(0)

// Validation errors
const errors = ref<Record<string, string>>({})
const loading = ref<boolean>(true)

// Get product from store
const product = computed(() => productsStore.getProductById(productId))

onMounted(async () => {
    // Fetch categories and products if not already loaded
    if (categoriesStore.categories.length === 0) {
        await categoriesStore.fetchCategories()
    }
    
    if (productsStore.products.length === 0) {
        await productsStore.fetchProducts()
    }
    
    loading.value = false

    // Populate form with existing product data
    if (product.value) {
        category.value = product.value.category
        name.value = product.value.name
        description.value = product.value.description
        price.value = product.value.price
        status.value = product.value.status
        originalCreatedAt.value = product.value.created_at
        
        // Store existing images
        if (Array.isArray(product.value.images) && product.value.images.length > 0) {
            existingImages.value = product.value.images
            existingImageCount.value = product.value.images.length
        }
    }
})

// Create computed property for categories
const categories = computed(() => categoriesStore.categories)

const handleUpdateProduct = async () => {
    // Clear previous errors
    errors.value = {}

    const formData = {
        category: category.value,
        name: name.value,
        description: description.value,
        price: price.value,
        status: status.value,
        images: images.value || null
    }

    try {
        // Validate form data
        const validatedData = productUpdateSchema.parse(formData)

        // If validation passes, update the product
        const success = await productsStore.updateProduct(
            productId, 
            {
                category: validatedData.category,
                name: validatedData.name,
                description: validatedData.description,
                price: validatedData.price,
                status: validatedData.status,
                images: validatedData.images ?? null,
                created_at: originalCreatedAt.value, // Keep original creation time
                updated_at: Date.now()
            },
            existingImages.value // Pass existing images to preserve them if no new ones uploaded
        )

        if (success) {
            // Navigate back to products list or admin page
            router.push('/admin/products')
        }
    } catch (error) {
        if (error instanceof ZodError) {
            // Map Zod errors to our errors object
            error.issues.forEach((err: ZodIssue) => {
                if (err.path.length > 0) {
                    errors.value[err.path[0] as string] = err.message
                }
            })
        } else {
            console.error('Unexpected error:', error)
        }
    }
}

const handleCancel = () => {
    router.push('/admin/products')
}
</script>

<style scoped></style>


