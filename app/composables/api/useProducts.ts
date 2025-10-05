import type { IProduct, IProductInput } from '~/types/product'
import { fetchAuthSession } from 'aws-amplify/auth';

export const useProducts = () => {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl
    const products = ref<IProduct[]>([])
    
    const getProducts = async () => {
        // Mock data for now - replace with API call when backend is ready
        const currentDate = new Date().toISOString()
        const categoryImageUrl = config.public.categoryImageUrl
        
        // const mockData: IProduct[] = [
        //     // Bangles
        //     {
        //         id: 'prod-001',
        //         category: 'Bangles',
        //         name: 'Gold Plated Bangle Set',
        //         description: 'Elegant set of 4 gold-plated bangles with intricate design patterns',
        //         price: 299.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'bangle.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     {
        //         id: 'prod-002',
        //         category: 'Bangles',
        //         name: 'Classic Bangle Duo',
        //         description: 'Simple yet sophisticated pair of bangles for everyday wear',
        //         price: 199.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'bangle.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     // Bracelets
        //     {
        //         id: 'prod-003',
        //         category: 'Bracelets',
        //         name: 'Delicate Chain Bracelet',
        //         description: 'Refined chain bracelet with adjustable clasp',
        //         price: 159.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'bracelet.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     {
        //         id: 'prod-004',
        //         category: 'Bracelets',
        //         name: 'Charm Bracelet',
        //         description: 'Beautiful bracelet with decorative charms',
        //         price: 249.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'bracelet.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     // Earrings
        //     {
        //         id: 'prod-005',
        //         category: 'Earrings',
        //         name: 'Hoop Earrings',
        //         description: 'Classic gold-plated hoop earrings, perfect for any occasion',
        //         price: 129.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'earrings.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     {
        //         id: 'prod-006',
        //         category: 'Earrings',
        //         name: 'Stud Earrings',
        //         description: 'Elegant stud earrings with refined finish',
        //         price: 89.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'earrings.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     {
        //         id: 'prod-007',
        //         category: 'Earrings',
        //         name: 'Drop Earrings',
        //         description: 'Stunning drop earrings with intricate detailing',
        //         price: 179.99,
        //         status: 'out_of_stock',
        //         images: [categoryImageUrl + 'earrings.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     // Necklaces
        //     {
        //         id: 'prod-008',
        //         category: 'Necklaces',
        //         name: 'Pendant Necklace',
        //         description: 'Delicate pendant necklace with adjustable chain',
        //         price: 349.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'necklace.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     {
        //         id: 'prod-009',
        //         category: 'Necklaces',
        //         name: 'Statement Necklace',
        //         description: 'Bold statement necklace for special occasions',
        //         price: 449.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'necklace.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     // Rings
        //     {
        //         id: 'prod-010',
        //         category: 'Rings',
        //         name: 'Classic Band Ring',
        //         description: 'Timeless band ring with polished finish',
        //         price: 199.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'ring.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     {
        //         id: 'prod-011',
        //         category: 'Rings',
        //         name: 'Stackable Ring Set',
        //         description: 'Set of 3 stackable rings for versatile styling',
        //         price: 279.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'ring.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     {
        //         id: 'prod-012',
        //         category: 'Rings',
        //         name: 'Statement Ring',
        //         description: 'Eye-catching statement ring with unique design',
        //         price: 329.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'ring.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     // Sets
        //     {
        //         id: 'prod-013',
        //         category: 'Sets',
        //         name: 'Complete Jewelry Set',
        //         description: 'Matching necklace, earrings, and bracelet set',
        //         price: 599.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'sets.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     },
        //     {
        //         id: 'prod-014',
        //         category: 'Sets',
        //         name: 'Bridal Jewelry Set',
        //         description: 'Exquisite bridal set with necklace, earrings, and bangles',
        //         price: 899.99,
        //         status: 'in_stock',
        //         images: [categoryImageUrl + 'sets.jpeg'],
        //         created_at: currentDate,
        //         updated_at: currentDate
        //     }
        // ]
        
        // products.value = mockData
        
        // Uncomment below when backend is ready:
        const session = await fetchAuthSession()
        const { data } = await useFetch(`${apiUrl}/products`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session.tokens?.idToken?.toString()}`
            }
        })
        products.value = data.value as IProduct[]
    }

    const addProduct = async (product: IProductInput) => {
        const formData = new FormData()

        formData.append('name', product.name)
        formData.append('description', product.description)
        formData.append('images', product.images as unknown as File)
        formData.append('price', product.price.toString())
        formData.append('status', product.status)
        formData.append('category', product.category)

        const { data } = await useFetch(`${apiUrl}/products`, {
            method: 'POST',
            body: formData
        })
        
        products.value.push(data.value as IProduct)
    }

    return { products, getProducts, addProduct }
}