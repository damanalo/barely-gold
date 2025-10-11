import type { ICategory } from '~/types/category'

export const useCategories = () => {
    const getCategories = async (cloudfrontUrl: string): Promise<ICategory[]> => {
        const data = [{
            id: 'bangles',
            name: 'Bangles',
            description: '',
            image: cloudfrontUrl + '/bangles/category-bangles.jpg'
        },
        {
            id: 'bracelets',
            name: 'Bracelets',
            description: '',
            image: cloudfrontUrl + '/bracelets/category-bracelets.jpg'
        },
        {
            id: 'earrings',
            name: 'Earrings',
            description: '',
            image: cloudfrontUrl + '/earrings/category-earrings.jpg'
        },
        {
            id: 'necklaces',
            name: 'Necklaces',
            description: '',
            image: cloudfrontUrl + '/necklaces/category-necklaces.jpg'
        },
        {
            id: 'rings',
            name: 'Rings',
            description: '',
            image: cloudfrontUrl + '/rings/category-rings.jpg'
        },
        {
            id: 'sets',
            name: 'Sets',
            description: '',
            image: cloudfrontUrl + '/sets/category-sets.jpg'
        },
    ]
    
        return data as ICategory[]
    }

    return { getCategories }
}