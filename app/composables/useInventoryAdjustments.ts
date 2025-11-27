import type { IOrder } from '~/types/order'
import { useProductsStore } from '~/stores/products'

export interface InventoryAdjustmentResult {
  success: boolean
  message?: string
  errors?: string[]
}

/**
 * Composable for managing inventory adjustments (reserve and release)
 */
export const useInventoryAdjustments = () => {
  const productsStore = useProductsStore()

  /**
   * Check if products have sufficient stock for an order
   */
  const checkStockAvailability = async (order: IOrder): Promise<InventoryAdjustmentResult> => {
    try {
      // Ensure products are loaded
      if (productsStore.products.length === 0) {
        await productsStore.fetchProducts()
      }

      const errors: string[] = []

      // Check each item in the order
      for (const orderItem of order.items) {
        const product = productsStore.getProductById(orderItem.id)
        
        if (!product) {
          errors.push(`Product "${orderItem.name}" (ID: ${orderItem.id}) not found`)
          continue
        }

        if (product.quantity < orderItem.quantity) {
          errors.push(
            `Insufficient stock for "${orderItem.name}". Available: ${product.quantity}, Required: ${orderItem.quantity}`
          )
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Insufficient stock for one or more products',
          errors
        }
      }

      return {
        success: true,
        message: 'All products have sufficient stock'
      }
    } catch (error) {
      console.error('Error checking stock availability:', error)
      return {
        success: false,
        message: 'Failed to check stock availability',
        errors: [String(error)]
      }
    }
  }

  /**
   * Reserve inventory by deducting quantities for an order
   */
  const reserveInventory = async (order: IOrder): Promise<InventoryAdjustmentResult> => {
    try {
      // First check if stock is available
      const availabilityCheck = await checkStockAvailability(order)
      if (!availabilityCheck.success) {
        return availabilityCheck
      }

      // Ensure products are loaded
      if (productsStore.products.length === 0) {
        await productsStore.fetchProducts()
      }

      const errors: string[] = []
      const updatedProducts: Array<{ id: string; name: string; newQuantity: number }> = []

      // Deduct quantities for each item in the order
      for (const orderItem of order.items) {
        const product = productsStore.getProductById(orderItem.id)
        
        if (!product) {
          errors.push(`Product with ID ${orderItem.id} not found. Cannot reserve inventory.`)
          continue
        }

        // Calculate new quantity (ensure it doesn't go below 0)
        const newQuantity = Math.max(0, product.quantity - orderItem.quantity)
        
        // Update the product quantity
        const productInput = {
          category: product.category,
          name: product.name,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          status: product.status,
          quantity: newQuantity,
          images: null,
          created_at: product.created_at,
          updated_at: Date.now()
        }
        
        const success = await productsStore.updateProduct(
          product.id,
          productInput,
          product.images || undefined
        )
        
        if (success) {
          updatedProducts.push({
            id: product.id,
            name: product.name,
            newQuantity
          })
          console.log(`Reserved ${orderItem.quantity} from product ${product.name}. New quantity: ${newQuantity}`)
        } else {
          errors.push(`Failed to update quantity for product "${product.name}"`)
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Failed to reserve inventory for some products',
          errors
        }
      }

      return {
        success: true,
        message: `Successfully reserved inventory for ${updatedProducts.length} product(s)`
      }
    } catch (error) {
      console.error('Error reserving inventory:', error)
      return {
        success: false,
        message: 'Failed to reserve inventory',
        errors: [String(error)]
      }
    }
  }

  /**
   * Release inventory by adding quantities back for a cancelled order
   */
  const releaseInventory = async (order: IOrder): Promise<InventoryAdjustmentResult> => {
    try {
      // Ensure products are loaded
      if (productsStore.products.length === 0) {
        await productsStore.fetchProducts()
      }

      const errors: string[] = []
      const updatedProducts: Array<{ id: string; name: string; newQuantity: number }> = []

      // Add quantities back for each item in the order
      for (const orderItem of order.items) {
        const product = productsStore.getProductById(orderItem.id)
        
        if (!product) {
          errors.push(`Product with ID ${orderItem.id} not found. Cannot release inventory.`)
          continue
        }

        // Calculate new quantity (add back the reserved quantity)
        const newQuantity = product.quantity + orderItem.quantity
        
        // Update the product quantity
        const productInput = {
          category: product.category,
          name: product.name,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          status: product.status,
          quantity: newQuantity,
          images: null,
          created_at: product.created_at,
          updated_at: Date.now()
        }
        
        const success = await productsStore.updateProduct(
          product.id,
          productInput,
          product.images || undefined
        )
        
        if (success) {
          updatedProducts.push({
            id: product.id,
            name: product.name,
            newQuantity
          })
          console.log(`Released ${orderItem.quantity} back to product ${product.name}. New quantity: ${newQuantity}`)
        } else {
          errors.push(`Failed to update quantity for product "${product.name}"`)
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          message: 'Failed to release inventory for some products',
          errors
        }
      }

      return {
        success: true,
        message: `Successfully released inventory for ${updatedProducts.length} product(s)`
      }
    } catch (error) {
      console.error('Error releasing inventory:', error)
      return {
        success: false,
        message: 'Failed to release inventory',
        errors: [String(error)]
      }
    }
  }

  return {
    checkStockAvailability,
    reserveInventory,
    releaseInventory
  }
}

