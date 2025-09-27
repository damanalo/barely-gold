<template>
    <div class="flex flex-col gap-4 m-5 border-2 border-gray-200 rounded-md p-5">
        <h1>Products</h1>
        <div class="flex flex-col gap-4 w-1/4 ">
            <USelect v-model="category_id" :options="categories" option-attribute="name" placeholder="Category ID" />
            <UInput v-model="name" placeholder="Name" />
            <UInput v-model="description" placeholder="Description" />
            <UInput v-model="price" placeholder="Price" />
            <UInput v-model="status" placeholder="Status" />
            <UFile v-model="images" placeholder="Images" />
            <UButton>Add Product</UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCategories } from '~/components/api/useCategories'

const { categories, getCategories } = useCategories()
const category_id = ref('')
const name = ref('')
const description = ref('')
const price = ref('')
const status = ref('')
const images = ref('')


</script>

<style scoped>
</style>