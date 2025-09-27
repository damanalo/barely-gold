export interface ICategory {
    id: string,
    name: string,
    description: string
}

export type ICategoryInput = Omit<ICategory, 'id'>