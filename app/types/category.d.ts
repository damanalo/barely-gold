export interface ICategory {
    name: string,
    description: string,
    image: string
}

export type ICategoryInput = Omit<ICategory, 'id'>