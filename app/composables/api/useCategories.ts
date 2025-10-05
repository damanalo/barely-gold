import type { ICategory } from '~/types/category'

export const useCategories = () => {
    const { public: config } = useRuntimeConfig()
    const categoryImageUrl = config.categoryImageUrl

    const categories = ref<ICategory[]>([])
    
    const getCategories = async () => {
        const data = [{
            name: 'Bangles',
            description: '',
            image: categoryImageUrl + 'bangle.jpeg'
        },
        {
            name: 'Bracelets',
            description: '',
            image: categoryImageUrl + 'bracelet.jpeg'
        },
        {
            name: 'Earrings',
            description: '',
            image: categoryImageUrl + 'earrings.jpeg'
        },
        {
            name: 'Necklaces',
            description: '',
            image: categoryImageUrl + 'necklace.jpeg'
        },
        {
            name: 'Rings',
            description: '',
            image: categoryImageUrl + 'ring.jpeg'
        },
        {
            name: 'Sets',
            description: '',
            image: categoryImageUrl + 'sets.jpeg'
        },
    ]
    
        categories.value = data as ICategory[]
    }

    return { getCategories, categories }
}