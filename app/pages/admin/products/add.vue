<template>
    <div class="flex flex-col gap-4 m-5 border-2 border-gray-200 rounded-md p-5">
        <h1>Add Products</h1>
        <div class="flex flex-col gap-4 w-1/4 ">
            <UInput v-model="name" placeholder="Name" />
            <UInput v-model="description" placeholder="Description" />
            <UFileUpload accept="image/jpeg, image/jpg" v-model="image" placeholder="Image" />
            <UButton @click="handleAddProduct">Add Product</UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProducts } from '~/composables/api/useProducts'

const { addProduct } = useProducts()

const name = ref<string>('')
const description = ref<string>('')
const image = ref<File | null>(null)

const handleAddProduct = () => {
    addProduct({ name: name.value, description: description.value, image: image.value })
}


</script>

<style scoped>
</style>