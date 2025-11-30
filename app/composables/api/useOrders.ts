import type { IOrder, IOrderInput } from '~/types/order'
import { get, post, put } from 'aws-amplify/api'
import { fetchUserAttributes } from 'aws-amplify/auth'
import { v4 as uuidv4 } from 'uuid'
import { uploadData, remove } from 'aws-amplify/storage'

export const useOrders = () => {
  const config = useRuntimeConfig()
  const apiName = config.public.apiName

  /**
   * Get all orders for the current user
   */
  const getUserOrders = async (): Promise<IOrder[]> => {
    try {
      // Get the logged-in user's ID from Cognito
      const userAttributes = await fetchUserAttributes()
      const userId = userAttributes.sub

      if (!userId) {
        console.error('No user ID found in Cognito attributes')
        return []
      }

      const operation = await get({
        apiName: apiName as string,
        path: `/orders/${userId}`
      }).response

      const data = await operation.body.json()

      return data as unknown as IOrder[]
    }
    catch (error) {
      console.error("Get user orders API call failed:", error)
      return []
    }
  }

  /**
   * Get a single order by userId and createdAt
   */
  const getOrder = async (userId: string, createdAt: number): Promise<IOrder | null> => {
    try {
      const operation = await get({
        apiName: apiName as string,
        path: `/orders/object/${userId}/${createdAt}`
      }).response

      const data = await operation.body.json() as any

      if (!data || !data.id) {
        return null
      }

      return data as IOrder
    }
    catch (error) {
      console.error("Get order API call failed:", error)
      return null
    }
  }

  /**
   * Create a new order
   */
  const createOrder = async (orderInput: IOrderInput): Promise<IOrder | null> => {
    try {
      // Get the logged-in user's ID from Cognito
      const userAttributes = await fetchUserAttributes()
      const userId = userAttributes.sub

      if (!userId) {
        console.error('No user ID found in Cognito attributes')
        return null
      }

      // Generate order ID and order number
      const orderId = uuidv4()
      const orderNumber = `BG-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
      
      // Get current timestamp
      const now = Date.now()

      // Prepare order data
      const orderData: IOrder = {
        id: orderId,
        user_id: userId,
        order_number: orderNumber,
        items: orderInput.items,
        subtotal: orderInput.subtotal,
        shipping_cost: orderInput.shipping_cost,
        total: orderInput.total,
        customer_name: orderInput.customer_name,
        email: orderInput.email,
        phone_number: orderInput.phone_number,
        shipping_address: orderInput.shipping_address,
        payment_method: orderInput.payment_method,
        payment_status: 'pending',
        status: 'pending_payment',
        inventory_reserved: false, // Will be set to true after inventory is reserved
        inventory_restocked: false, // Will be set to true if order is cancelled and inventory is returned
        created_at: now,
        updated_at: now,
        delivery_method: orderInput.delivery_method,
        notes: orderInput.notes,
        paper_bag_quantity: orderInput.paper_bag_quantity,
        paper_bag_cost: orderInput.paper_bag_cost,
        promotional_discount_amount: orderInput.promotional_discount_amount
      }

      const operation = await post({
        apiName: apiName as string,
        path: '/orders',
        options: {
          body: orderData as any
        }
      }).response

      const response = await operation.body.json() as any

      if (response && response.success) {
        return orderData
      }

      return null
    }
    catch (error) {
      console.error("Create order API call failed:", error)
      return null
    }
  }

  /**
   * Update order with payment proof
   */
  const updateOrderPaymentProof = async (
    order: IOrder,
    paymentProofFile: File
  ): Promise<boolean> => {
    try {
      // Delete existing payment proof from S3 if it exists
      if (order.payment_proof) {
        try {
          await remove({
            path: `public/${order.payment_proof}`
          })
        } catch (deleteError) {
          // Log error but don't fail the upload if deletion fails
          console.warn('Failed to delete old payment proof, continuing with upload:', deleteError)
        }
      }

      // Upload payment proof to S3
      const fileExtension = paymentProofFile.name.substring(paymentProofFile.name.lastIndexOf('.') + 1)
      const s3Path = `orders/${order.user_id}/${order.id}/payment-proof.${fileExtension}`

      // Upload to S3
      await uploadData({
        path: `public/${s3Path}`,
        data: paymentProofFile,
        options: {
          contentType: paymentProofFile.type
        }
      })

      // Update order record with payment proof path
      const updatedOrder: IOrder = {
        ...order,
        payment_proof: s3Path,
        updated_at: Date.now()
      }

      const operation = await put({
        apiName: apiName as string,
        path: '/orders',
        options: {
          body: updatedOrder as any
        }
      }).response

      const response = await operation.body.json() as any

      return response?.success || false
    }
    catch (error) {
      console.error("Update order payment proof failed:", error)
      return false
    }
  }

  /**
   * Get all orders (admin only)
   */
  const getAllOrders = async (): Promise<IOrder[]> => {
    try {
      const operation = await get({
        apiName: apiName as string,
        path: '/orders'
      }).response

      const data = await operation.body.json()

      return data as unknown as IOrder[]
    }
    catch (error) {
      console.error("Get all orders API call failed:", error)
      return []
    }
  }

  /**
   * Update an order (admin or user with proper permissions)
   */
  const updateOrder = async (order: IOrder): Promise<boolean> => {
    try {
      // Update the updated_at timestamp
      const updatedOrder: IOrder = {
        ...order,
        updated_at: Date.now()
      }

      const operation = await put({
        apiName: apiName as string,
        path: '/orders',
        options: {
          body: updatedOrder as any
        }
      }).response

      const response = await operation.body.json() as any

      return response?.success || false
    }
    catch (error) {
      console.error("Update order failed:", error)
      return false
    }
  }

  return {
    getUserOrders,
    getOrder,
    createOrder,
    updateOrderPaymentProof,
    getAllOrders,
    updateOrder
  }
}

