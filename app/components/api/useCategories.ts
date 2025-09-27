import type { ICategory, ICategoryInput } from '~/types/category'

export const useCategories = () => {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl
    const categories = ref<ICategory[]>([])
    
    const getCategories = async () => {
        const { data } = await useFetch(`${apiUrl}/categories`, {
            method: 'GET',
        })
        categories.value = data.value as ICategory[]
    }

    const addCategory = async (category: FormData) => {
        const { data } = await useFetch(`${apiUrl}/categories`, {
            method: 'POST',
            body: category
        })

        console.log("addCategory:", data)

        categories.value.push(data.value as ICategory)

        return data

    }

    return { categories, getCategories, addCategory }
}