<template>
    <div class="flex flex-col gap-4 m-5 border-2 border-gray-200 rounded-md p-5">
        <h1 class="text-3xl font-bold text-center">Add Products</h1>
        <div class="flex flex-col gap-4 w-1/4 mx-auto">
            <div class="flex flex-col gap-2">
                <label for="category">Category</label>
                <USelect v-model="category" placeholder="Category" :items="categories" value-key="id" label-key="name"/>
            </div>
            <div class="flex flex-col gap-2">
                <label for="name">Name</label>
                <UInput v-model="name" placeholder="Name" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="description">Description</label>
                <UInput v-model="description" placeholder="Description" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="price">Price</label>
                <UInputNumber v-model="price" placeholder="Price" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="status">Status</label>
                <USelect v-model="status" placeholder="Status" :items="statusOptions"/>
            </div>
            <div class="flex flex-col gap-2">
                <label for="images">Images</label>
                <UFileUpload accept="image/jpeg, image/jpg" multiple v-model="images" placeholder="Images" />
                </div>
            <UButton @click="handleAddProduct" class="justify-center" block>Add Product</UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '~/stores/products'
import { useCategoriesStore } from '~/stores/categories'
import type { SelectItem } from '@nuxt/ui'

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

onMounted(async () => {
    await categoriesStore.fetchCategories()
})

// Create computed property for categories
const categories = computed(() => categoriesStore.categories)

const handleAddProduct = async () => {
    const success = await productsStore.addProduct({
        category: category.value,
        name: name.value,
        description: description.value,
        price: price.value, 
        status: status.value, 
        images: images.value || null, 
        created_at: Date.now(), 
        updated_at: Date.now() 
    })
    
    if (success) {
        // Reset form
        category.value = ''
        name.value = ''
        description.value = ''
        price.value = 0
        status.value = 'in_stock'
        images.value = null
    }
}


</script>

<style scoped></style>