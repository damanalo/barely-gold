export interface ICategory {
    id: string,
    name: string,
    description: string,
    image: string
}

export type ICategoryInput = Omit<ICategory, 'id'>