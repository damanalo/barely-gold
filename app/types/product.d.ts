export interface IProduct {
    id: string, //SK
    category: string, //PK
    name: string,
    description: string,
    price: number,
    status: 'in_stock' | 'out_of_stock',
    images: string[] | null, // Image paths from database
    created_at: number, //Unix timestamp
    updated_at: number, //Unix timestamp
}

export interface IProductInput {
    category: string,
    name: string,
    description: string,
    price: number,
    status: 'in_stock' | 'out_of_stock',
    images: File[] | null, // File objects for upload
    created_at: number,
    updated_at: number
}