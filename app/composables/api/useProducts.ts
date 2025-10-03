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
        
        const mockData: IProduct[] = [
            // Bangles
            {
                id: 'prod-001',
                category_id: '1',
                category_name: 'Bangles',
                name: 'Gold Plated Bangle Set',
                description: 'Elegant set of 4 gold-plated bangles with intricate design patterns',
                price: 299.99,
                sku: 'BGL-001',
                status: 'in_stock',
                images: [categoryImageUrl + 'bangle.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            {
                id: 'prod-002',
                category_id: '1',
                category_name: 'Bangles',
                name: 'Classic Bangle Duo',
                description: 'Simple yet sophisticated pair of bangles for everyday wear',
                price: 199.99,
                sku: 'BGL-002',
                status: 'in_stock',
                images: [categoryImageUrl + 'bangle.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            // Bracelets
            {
                id: 'prod-003',
                category_id: '2',
                category_name: 'Bracelets',
                name: 'Delicate Chain Bracelet',
                description: 'Refined chain bracelet with adjustable clasp',
                price: 159.99,
                sku: 'BRC-001',
                status: 'in_stock',
                images: [categoryImageUrl + 'bracelet.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            {
                id: 'prod-004',
                category_id: '2',
                category_name: 'Bracelets',
                name: 'Charm Bracelet',
                description: 'Beautiful bracelet with decorative charms',
                price: 249.99,
                sku: 'BRC-002',
                status: 'in_stock',
                images: [categoryImageUrl + 'bracelet.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            // Earrings
            {
                id: 'prod-005',
                category_id: '3',
                category_name: 'Earrings',
                name: 'Hoop Earrings',
                description: 'Classic gold-plated hoop earrings, perfect for any occasion',
                price: 129.99,
                sku: 'EAR-001',
                status: 'in_stock',
                images: [categoryImageUrl + 'earrings.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            {
                id: 'prod-006',
                category_id: '3',
                category_name: 'Earrings',
                name: 'Stud Earrings',
                description: 'Elegant stud earrings with refined finish',
                price: 89.99,
                sku: 'EAR-002',
                status: 'in_stock',
                images: [categoryImageUrl + 'earrings.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            {
                id: 'prod-007',
                category_id: '3',
                category_name: 'Earrings',
                name: 'Drop Earrings',
                description: 'Stunning drop earrings with intricate detailing',
                price: 179.99,
                sku: 'EAR-003',
                status: 'out_of_stock',
                images: [categoryImageUrl + 'earrings.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            // Necklaces
            {
                id: 'prod-008',
                category_id: '4',
                category_name: 'Necklaces',
                name: 'Pendant Necklace',
                description: 'Delicate pendant necklace with adjustable chain',
                price: 349.99,
                sku: 'NCK-001',
                status: 'in_stock',
                images: [categoryImageUrl + 'necklace.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            {
                id: 'prod-009',
                category_id: '4',
                category_name: 'Necklaces',
                name: 'Statement Necklace',
                description: 'Bold statement necklace for special occasions',
                price: 449.99,
                sku: 'NCK-002',
                status: 'in_stock',
                images: [categoryImageUrl + 'necklace.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            // Rings
            {
                id: 'prod-010',
                category_id: '5',
                category_name: 'Rings',
                name: 'Classic Band Ring',
                description: 'Timeless band ring with polished finish',
                price: 199.99,
                sku: 'RNG-001',
                status: 'in_stock',
                images: [categoryImageUrl + 'ring.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            {
                id: 'prod-011',
                category_id: '5',
                category_name: 'Rings',
                name: 'Stackable Ring Set',
                description: 'Set of 3 stackable rings for versatile styling',
                price: 279.99,
                sku: 'RNG-002',
                status: 'in_stock',
                images: [categoryImageUrl + 'ring.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            {
                id: 'prod-012',
                category_id: '5',
                category_name: 'Rings',
                name: 'Statement Ring',
                description: 'Eye-catching statement ring with unique design',
                price: 329.99,
                sku: 'RNG-003',
                status: 'in_stock',
                images: [categoryImageUrl + 'ring.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            // Sets
            {
                id: 'prod-013',
                category_id: '6',
                category_name: 'Sets',
                name: 'Complete Jewelry Set',
                description: 'Matching necklace, earrings, and bracelet set',
                price: 599.99,
                sku: 'SET-001',
                status: 'in_stock',
                images: [categoryImageUrl + 'sets.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            },
            {
                id: 'prod-014',
                category_id: '6',
                category_name: 'Sets',
                name: 'Bridal Jewelry Set',
                description: 'Exquisite bridal set with necklace, earrings, and bangles',
                price: 899.99,
                sku: 'SET-002',
                status: 'in_stock',
                images: [categoryImageUrl + 'sets.jpeg'],
                date_added: currentDate,
                created_at: currentDate,
                updated_at: currentDate
            }
        ]
        
        products.value = mockData
        
        // Uncomment below when backend is ready:
        // const session = await fetchAuthSession()
        // const { data } = await useFetch(`${apiUrl}/products`, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${session.tokens?.idToken?.toString()}`
        //     }
        // })
        // products.value = data.value as IProduct[]
    }

    const addProduct = async (product: IProductInput) => {
        const formData = new FormData()

        formData.append('name', product.name)
        formData.append('description', product.description)
        formData.append('images', product.images as unknown as File)
        formData.append('price', product.price.toString())
        formData.append('sku', product.sku)
        formData.append('status', product.status)
        formData.append('category_id', product.category_id)
        formData.append('category_name', product.category_name)

        const { data } = await useFetch(`${apiUrl}/products`, {
            method: 'POST',
            body: formData
        })
        
        products.value.push(data.value as IProduct)
    }

    return { products, getProducts, addProduct }
}