import { z } from 'zod'

// Base validation rules
const baseProductValidation = {
  category: z.string().min(1, 'Category is required'),
  name: z.string()
    .min(1, 'Product name is required')
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must not exceed 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  price: z.number()
    .positive('Price must be greater than 0')
    .min(0.01, 'Price must be at least 0.01'),
  quantity: z.number()
    .min(0, 'Quantity must be at least 0')
    .max(1000, 'Quantity must not exceed 1000'),
  status: z.enum(['active', 'inactive'], {
    message: 'Status must be either active or inactive'
  })
}

// Schema for adding products (images optional but validated)
export const productSchema = z.object({
  ...baseProductValidation,
  images: z.custom<File[] | null>((value) => {
    if (value === null) return true
    if (!Array.isArray(value)) return false
    return value.every(item => item instanceof File)
  }, 'Images must be valid files').nullable().optional()
})

// Schema for editing products (images truly optional)
export const productUpdateSchema = z.object({
  ...baseProductValidation,
  images: z.custom<File[] | null>((value) => {
    if (value === null || value === undefined) return true
    if (!Array.isArray(value)) return false
    return value.every(item => item instanceof File)
  }, 'Images must be valid files').nullable().optional()
})

export type ProductFormData = z.infer<typeof productSchema>
export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>

