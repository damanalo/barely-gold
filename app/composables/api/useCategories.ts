import type { ICategory } from '~/types/category'

export const useCategories = () => {
    const { public: config } = useRuntimeConfig()
    const categoryImageUrl = config.categoryImageUrl

    const categories = ref<ICategory[]>([])
    
    const getCategories = async () => {
        const data = [{
            id: '1',
            name: 'Bangles',
            description: '',
            image: categoryImageUrl + 'bangle.jpeg'
        },
        {
            id: '2',
            name: 'Bracelets',
            description: '',
            image: categoryImageUrl + 'bracelet.jpeg'
        },
        {
            id: '3',
            name: 'Earrings',
            description: '',
            image: categoryImageUrl + 'earrings.jpeg'
        },
        {
            id: '4',
            name: 'Necklaces',
            description: '',
            image: categoryImageUrl + 'necklace.jpeg'
        },
        {
            id: '5',
            name: 'Rings',
            description: '',
            image: categoryImageUrl + 'ring.jpeg'
        },
        {
            id: '6',
            name: 'Sets',
            description: '',
            image: categoryImageUrl + 'sets.jpeg'
        },
    ]
    
        categories.value = data as ICategory[]
    }

    return { getCategories, categories }
}