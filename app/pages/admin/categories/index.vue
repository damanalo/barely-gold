<template>
    <div>
        <h1>Categories</h1>
        <div v-for="category in categories" :key="category.id">
            <h2>{{ category.name }}</h2>
            <h2>{{ category.description }}</h2>
            <img :src="category.image" alt="Category Image" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCategories } from '~/composables/api/useCategories'

const { getCategories, categories } = useCategories()

onMounted(async () => {
    await getCategories()
})

</script>

<style scoped>
</style>