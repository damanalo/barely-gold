<template>
    <div class="flex flex-col gap-4 m-5 border-2 border-gray-200 rounded-md p-5">
        <h1 class="text-3xl font-bold text-center">Add Products</h1>
        <div class="flex flex-col gap-4 w-1/4 mx-auto">
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
                <label for="quantity">Quantity <span class="text-red-500">*</span></label>
                <UInputNumber 
                    v-model="quantity" 
                    placeholder="Quantity"
                    :min="0"
                    :max="1000"
                    :disabled="productsStore.loading"
                    :class="{ 'border-red-500': errors.quantity }"
                />
                <span v-if="errors.quantity" class="text-red-500 text-sm">{{ errors.quantity }}</span>
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
                <label for="images">Images</label>
                <UFileUpload 
                    accept="image/jpeg, image/jpg" 
                    multiple 
                    v-model="images" 
                    placeholder="Images"
                    :disabled="productsStore.loading"
                    :class="{ 'border-red-500': errors.images }"
                />
                <small class="text-gray-500">300px x 300px JPG image is recommended</small>
                <span v-if="errors.images" class="text-red-500 text-sm">{{ errors.images }}</span>
            </div>
            <div class="flex gap-2">
                <UButton 
                    @click="handleAddProduct" 
                    color="primary"
                    class="justify-center flex-1" 
                    block
                    :loading="productsStore.loading"
                    :disabled="productsStore.loading"
                >
                    Add Product
                </UButton>
                <UButton 
                    @click="handleCancel" 
                    color="primary"
                    variant="outline"
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
import { productSchema } from '~/utils/schemas/product.schema'
import { ZodError, type ZodIssue } from 'zod'

const router = useRouter()

const statusOptions = ref<SelectItem[]>([
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
])

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const category = ref<string>('')
const name = ref<string>('')
const description = ref<string>('')
const price = ref<number>(0)
const quantity = ref<number>(0)
const status = ref<'active' | 'inactive'>('active')
const images = ref<File[] | null>(null)

// Validation errors
const errors = ref<Record<string, string>>({})

onMounted(async () => {
    await categoriesStore.fetchCategories()
})

// Create computed property for categories
const categories = computed(() => categoriesStore.categories)

const handleAddProduct = async () => {
    // Clear previous errors
    errors.value = {}

    const formData = {
        category: category.value,
        name: name.value,
        description: description.value,
        price: price.value,
        quantity: quantity.value,
        status: status.value,
        images: images.value || null
    }

    try {
        // Validate form data
        const validatedData = productSchema.parse(formData)

        // If validation passes, add the product
        const success = await productsStore.addProduct({
            category: validatedData.category,
            name: validatedData.name,
            description: validatedData.description,
            price: validatedData.price,
            quantity: validatedData.quantity,
            status: validatedData.status,
            images: validatedData.images ?? null,
            created_at: Date.now(),
            updated_at: Date.now()
        })

        if (success) {
            // Navigate back to products list after successful add
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