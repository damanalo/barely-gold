export interface IProduct {
    id: string,
    category_id: string,
    category_name: string,
    name: string,
    description: string,
    price: number,
    sku: string,
    status: string,
    images: string[],
    date_added: string,
    created_at: string,
    updated_at: string
}

export type IProductInput = Omit<IProduct, 'id'>