<template>
    <div class="flex flex-col gap-4 m-5 border-2 border-gray-200 rounded-md p-5">
        <h1>Categories</h1>
        <div class="flex flex-col gap-4 w-1/4 ">
            <UInput v-model="name" placeholder="Name" />
            <UInput v-model="description" placeholder="Description" />
            <UFileUpload accept="image/jpeg, image/jpg" v-model="image" placeholder="Image" />
            <UButton @click="handleAddCategory">Add Category</UButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCategories } from '~/components/api/useCategories'

const { addCategory } = useCategories()

const name = ref<string>('')
const description = ref<string>('')
const image = ref<File | null>(null)

const handleAddCategory = async () => {
    const formData = new FormData()
    formData.append('name', name.value)
    formData.append('description', description.value)
    formData.append('image', image.value as File)
    
    const data = await addCategory(formData)
    console.log("data:", data)
    if(data) {
        name.value = ''
        description.value = ''
        image.value = null
    }
}


</script>

<style scoped>
</style>