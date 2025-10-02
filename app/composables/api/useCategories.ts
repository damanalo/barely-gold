import type { ICategory, ICategoryInput } from '~/types/category'
import { fetchAuthSession } from 'aws-amplify/auth';

export const useCategories = () => {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl
    const categories = ref<ICategory[]>([])
    
    const getCategories = async () => {
        const session = await fetchAuthSession()
        const { data } = await useFetch(`${apiUrl}/categories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session.tokens?.idToken?.toString()}`
            }
        })
        categories.value = data.value as ICategory[]
    }

    const addCategory = async (category: ICategoryInput) => {
        const formData = new FormData()

        formData.append('name', category.name)
        formData.append('description', category.description)
        formData.append('image', category.image as File)

        const { data } = await useFetch(`${apiUrl}/categories`, {
            method: 'POST',
            body: formData
        })
        
        categories.value.push(data.value as ICategory)
    }

    return { categories, getCategories, addCategory }
}