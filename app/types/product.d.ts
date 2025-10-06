export interface IProduct {
    id: string, //SK
    category: string, //PK
    name: string,
    description: string,
    price: number,
    status: 'in_stock' | 'out_of_stock',
    images: File[] | null,
    created_at: number, //Unix timestamp
    updated_at: number, //Unix timestamp
}

export type IProductInput = Omit<IProduct, 'id'>