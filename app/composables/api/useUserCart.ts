import type { ICartItem } from '~/types/cart'
import { useUser } from './useUser'

export const useUserCart = () => {
  const { getUser, updateUser } = useUser()

  /**
   * Fetch the user's cart from DynamoDB Users table
   */
  const getCart = async (): Promise<ICartItem[]> => {
    try {
      const userData = await getUser()
      
      if (!userData) {
        console.warn('No user data found')
        return []
      }

      console.log('Get Cart from User Data:', userData.cart);

      return userData.cart || []
    }
    catch (error) {
      console.error("Get cart failed:", error);
      return []
    }
  }

  /**
   * Add an item to the user's cart in DynamoDB
   * Updates the entire user record with modified cart
   */
  const addToCart = async (item: ICartItem): Promise<boolean> => {
    try {
      // First get current cart
      const currentCart = await getCart()
      
      // Check if item already exists
      const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id)
      
      let updatedCart: ICartItem[]
      if (existingItemIndex !== -1) {
        // Update quantity if exists
        updatedCart = [...currentCart]
        const existingItem = updatedCart[existingItemIndex]
        if (existingItem) {
          existingItem.quantity += item.quantity
        }
      } else {
        // Add new item
        updatedCart = [...currentCart, item]
      }

      // Update user with new cart
      const success = await updateUser({ cart: updatedCart })

      console.log('Add to Cart Success:', success);

      return success
    }
    catch (error) {
      console.error("Add to cart failed:", error);
      return false
    }
  }

  /**
   * Update an item's quantity in the user's cart
   */
  const updateCartItem = async (itemId: string, quantity: number): Promise<boolean> => {
    try {
      const currentCart = await getCart()
      
      const updatedCart = currentCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )

      const success = await updateUser({ cart: updatedCart })

      console.log('Update Cart Item Success:', success);

      return success
    }
    catch (error) {
      console.error("Update cart item failed:", error);
      return false
    }
  }

  /**
   * Remove an item from the user's cart
   */
  const removeFromCart = async (itemId: string): Promise<boolean> => {
    try {
      const currentCart = await getCart()
      
      const updatedCart = currentCart.filter(item => item.id !== itemId)

      const success = await updateUser({ cart: updatedCart })

      console.log('Remove from Cart Success:', success);

      return success
    }
    catch (error) {
      console.error("Remove from cart failed:", error);
      return false
    }
  }

  /**
   * Clear all items from the user's cart
   */
  const clearCart = async (): Promise<boolean> => {
    try {
      const success = await updateUser({ cart: [] })

      console.log('Clear Cart Success:', success);

      return success
    }
    catch (error) {
      console.error("Clear cart failed:", error);
      return false
    }
  }

  return { 
    getCart, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
  }
}