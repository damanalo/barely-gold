import type { ICategory } from '~/types/category'

export const useCategories = () => {
    const { public: config } = useRuntimeConfig()

    const categories = ref<ICategory[]>([])
    
    const getCategories = async () => {
        const data = [{
            id: 'bangles',
            name: 'Bangles',
            description: '',
            image: config.publicCloudfrontUrl + '/bangles/category-bangles.jpg'
        },
        {
            id: 'bracelets',
            name: 'Bracelets',
            description: '',
            image: config.publicCloudfrontUrl + '/bracelets/category-bracelets.jpg'
        },
        {
            id: 'earrings',
            name: 'Earrings',
            description: '',
            image: config.publicCloudfrontUrl + '/earrings/category-earrings.jpg'
        },
        {
            id: 'necklaces',
            name: 'Necklaces',
            description: '',
            image: config.publicCloudfrontUrl + '/necklaces/category-necklaces.jpg'
        },
        {
            id: 'rings',
            name: 'Rings',
            description: '',
            image: config.publicCloudfrontUrl + '/rings/category-rings.jpg'
        },
        {
            id: 'sets',
            name: 'Sets',
            description: '',
            image: config.publicCloudfrontUrl + '/sets/category-sets.jpg'
        },
    ]
    
        categories.value = data as ICategory[]
    }

    return { getCategories, categories }
}