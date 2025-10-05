export interface IProduct {
    id: string,
    category: string,
    name: string,
    description: string,
    price: number,
    status: string,
    images: string[],
    created_at: string, //Unix timestamp
    updated_at: string, //Unix timestamp
}

export type IProductInput = Omit<IProduct, 'id'>