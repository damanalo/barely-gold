export interface ICategory {
    id: string,
    name: string,
    description: string,
    image: File | null
}

export type ICategoryInput = Omit<ICategory, 'id'>