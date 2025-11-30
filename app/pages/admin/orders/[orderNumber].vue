<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <UContainer>
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Order Details</h1>
          <p class="text-sm text-gray-600 mt-1">{{ order?.order_number }}</p>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          @click="$router.push('/admin/orders')"
        >
          Back to Orders
        </UButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-600 mx-auto" />
          <p class="mt-2 text-gray-600">Loading order...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="!order" class="text-center py-12">
        <div class="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-red-400 mx-auto" />
          <h3 class="mt-4 text-lg font-semibold text-gray-900">Order Not Found</h3>
          <p class="mt-2 text-gray-600">The order you're looking for doesn't exist.</p>
          <UButton
            color="primary"
            class="mt-6"
            @click="$router.push('/admin/orders')"
          >
            Back to Orders
          </UButton>
        </div>
      </div>

      <!-- Order Content -->
      <div v-else class="space-y-6">
        <!-- Order Items -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold text-lg mb-4">Order Items</h3>
          <div class="space-y-3">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex gap-4 p-3 bg-gray-50 rounded"
            >
              <div v-if="item.image" class="flex-shrink-0">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-20 h-20 object-cover rounded"
                />
              </div>
              <div class="flex-1">
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm text-gray-600">
                  Qty: {{ item.quantity }} × ₱{{ formatPrice(item.price) }}
                </p>
                <p v-if="item.category" class="text-xs text-gray-500 mt-1">
                  Category: {{ item.category }}
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold">₱{{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Order Summary -->
          <div class="mt-6 pt-3 border-t border-gray-200">
            <div class="space-y-2">
              <div class="flex justify-between text-sm mb-3">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">₱{{ formatPrice(order.subtotal) }}</span>
              </div>
              <div v-if="order.promotional_discount_amount && order.promotional_discount_amount > 0" class="flex justify-between text-sm text-green-600">
                <span class="text-gray-600 font-bold">
                  Promotional Discount (10%)
                </span>
                <span class="font-medium">-₱{{ formatPrice(order.promotional_discount_amount) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 font-bold">
                  Shipping{{ order.delivery_method ? ` (${getDeliveryMethodLabel(order.delivery_method)})` : '' }}:
                </span>
                <span class="font-medium text-green-600">
                  {{ order.shipping_cost === 0 ? 'FREE' : `₱${formatPrice(order.shipping_cost)}` }}
                </span>
              </div>
              <div v-if="order.paper_bag_quantity && order.paper_bag_quantity > 0" class="flex justify-between text-sm">
                <span class="text-gray-600 font-bold">
                  Paper Bag{{ order.paper_bag_quantity > 1 ? ` (x${order.paper_bag_quantity})` : '' }}
                </span>
                <span :class="(order.paper_bag_cost ?? 0) === 0 ? 'text-green-600 font-medium' : ''">
                  {{ (order.paper_bag_cost ?? 0) === 0 ? 'FREE' : `₱${formatPrice(order.paper_bag_cost ?? 0)}` }}
                </span>
              </div>
              <div class="flex justify-between text-lg font-bold border-t border-gray-200 pt-3 mt-2">
                <span>Total:</span>
                <span class="text-primary-600">₱{{ formatPrice(order.total) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Notes -->
        <div v-if="order.notes" class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold text-lg mb-4">Additional Notes</h3>
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ order.notes }}</p>
        </div>

        <!-- Customer & Shipping Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Customer Information -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-semibold text-lg mb-4">Customer Information</h3>
            <div class="space-y-3 text-sm">
              <div>
                <span class="text-gray-600">Name:</span>
                <span class="ml-2 font-medium">{{ order.customer_name }}</span>
              </div>
              <div>
                <span class="text-gray-600">Email:</span>
                <span class="ml-2 font-medium">{{ order.email }}</span>
              </div>
              <div>
                <span class="text-gray-600">Phone:</span>
                <span class="ml-2 font-medium">{{ order.phone_number }}</span>
              </div>
              <div>
                <span class="text-gray-600">Order Date:</span>
                <span class="ml-2 font-medium">{{ formatDate(order.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white rounded-lg shadow p-6">
            <h3 class="font-semibold text-lg mb-4">Shipping Address</h3>
            <div class="text-sm text-gray-700" v-if="getShippingAddress(order.shipping_address)">
              <div v-if="getShippingAddress(order.shipping_address).name" class="mb-2">
                <span class="text-gray-600">Name:</span>
                <span class="ml-2 font-medium">{{ getShippingAddress(order.shipping_address).name }}</span>
              </div>
              <div v-if="getShippingAddress(order.shipping_address).contact_number" class="mb-2">
                <span class="text-gray-600">Mobile Number:</span>
                <span class="ml-2 font-medium">{{ getShippingAddress(order.shipping_address).contact_number }}</span>
              </div>
              <p class="font-medium">{{ getShippingAddress(order.shipping_address).street }}</p>
              <p class="mt-1">
                {{ getShippingAddress(order.shipping_address).city }}, 
                {{ getShippingAddress(order.shipping_address).province }}
                <span v-if="getShippingAddress(order.shipping_address).postal_code">
                  {{ getShippingAddress(order.shipping_address).postal_code }}
                </span>
              </p>
              <p class="mt-1">{{ getShippingAddress(order.shipping_address).country }}</p>
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold text-lg mb-4">Payment Information</h3>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Payment Method:</span>
                <span class="ml-2 font-medium">{{ order.payment_method }}</span>
              </div>
              <div>
                <span class="text-gray-600">Payment Status:</span>
                <UBadge :color="getPaymentStatusColor(order.payment_status)" class="ml-2">
                  {{ order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) }}
                </UBadge>
              </div>
            </div>
            
            <!-- Payment Proof -->
            <div v-if="order.payment_proof" class="mt-4">
              <p class="text-sm font-medium text-gray-700 mb-2">Payment Proof:</p>
              <img
                :src="getImageUrl(order.payment_proof, order.updated_at)"
                alt="Payment Proof"
                class="w-full max-w-md h-auto object-contain rounded border border-gray-300"
              />
            </div>
            <div v-else class="text-sm text-gray-500 italic">
              No payment proof uploaded yet
            </div>
          </div>
        </div>

        <!-- Update Order Form -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold text-lg mb-4">Update Order</h3>
          <form @submit.prevent="updateOrder" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Payment Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <USelect
                  v-model="editForm.payment_status"
                  :items="paymentStatusOptions"
                />
              </div>

              <!-- Order Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>
                <USelect
                  v-model="editForm.status"
                  :items="orderStatusOptions"
                />
              </div>
            </div>

            <!-- Tracking Information -->
            <div class="border-t pt-4 mt-4">
              <h4 class="font-medium text-gray-900 mb-3">Tracking Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <UInput
                    v-model="editForm.tracking_number"
                    placeholder="e.g., 1234567890"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Courier
                  </label>
                  <USelect
                    v-model="editForm.carrier"
                    :items="courierOptions"
                  />
                </div>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Delivery Date
                </label>
                <UInput
                  v-model="editForm.estimated_delivery"
                  type="date"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 pt-4 border-t">
              <UButton
                color="neutral"
                variant="ghost"
                @click="$router.push('/admin/orders')"
                :disabled="updating"
              >
                Cancel
              </UButton>
              <UButton
                type="submit"
                color="primary"
                :loading="updating"
              >
                Save Changes
              </UButton>
            </div>
          </form>
        </div>

      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'
import { useProductsStore } from '~/stores/products'
import { useInventoryAdjustments } from '~/composables/useInventoryAdjustments'
import type { IOrder } from '~/types/order'
import getImageUrl from '~/utils/get-image-url'
import formatPrice from '~/utils/format-price'

definePageMeta({
  middleware: ['admin']
})

const route = useRoute()
const ordersStore = useOrdersStore()
const productsStore = useProductsStore()
const toast = useToast()

const orderNumber = route.params.orderNumber as string
const loading = ref(true)
const updating = ref(false)
const order = ref<IOrder | null>(null)

const editForm = ref({
  payment_status: 'pending' as 'pending' | 'verified' | 'failed',
  status: 'pending_payment' as 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  tracking_number: '',
  carrier: '',
  estimated_delivery: ''
})

const paymentStatusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Verified', value: 'verified' },
  { label: 'Failed', value: 'failed' }
]

const orderStatusOptions = [
  { label: 'Pending Payment', value: 'pending_payment' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' }
]

const courierOptions = [
  { label: 'J&T', value: 'J&T' }
]

// Fetch order on mount
onMounted(async () => {
  loading.value = true
  
  // Fetch products to ensure they're available for quantity updates
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
  
  // First check if orders are already loaded in store
  if (ordersStore.allOrders.length === 0) {
    await ordersStore.fetchAllOrders()
  }
  
  // Find order by ID
  const foundOrder = ordersStore.allOrders.find(o => o.order_number === orderNumber)
  
  if (foundOrder) {
    order.value = foundOrder
    // Initialize form with current values
    editForm.value = {
      payment_status: foundOrder.payment_status,
      status: foundOrder.status,
      tracking_number: foundOrder.tracking_number || '',
      carrier: foundOrder.delivery_method === 'ship_via_jt' 
        ? (foundOrder.carrier || 'J&T')
        : (foundOrder.carrier || ''),
      estimated_delivery: foundOrder.estimated_delivery || ''
    }
  }
  
  loading.value = false
})

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getPaymentStatusColor = (status: string): 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'neutral' => {
  const colors: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'neutral'> = {
    pending: 'warning',
    verified: 'success',
    failed: 'error'
  }
  return colors[status] || 'neutral'
}

const getShippingAddress = (addressString: string) => {
  try {
    return JSON.parse(addressString)
  } catch {
    return null
  }
}

const getDeliveryMethodLabel = (method: string | undefined): string => {
  if (!method) return ''
  const labels: Record<string, string> = {
    meet_up: 'Meet up',
    pick_up: 'Pick up',
    ship_via_jt: 'Ship via J&T'
  }
  return labels[method] || method
}

const updateOrder = async () => {
  if (!order.value) return

  updating.value = true

  try {
    const previousPaymentStatus = order.value.payment_status
    const previousStatus = order.value.status
    const isPaymentVerified = editForm.value.payment_status === 'verified' && previousPaymentStatus !== 'verified'
    const isCancelled = editForm.value.status === 'cancelled' && previousStatus !== 'cancelled'
    const { reserveInventory, releaseInventory } = useInventoryAdjustments()

    const updatedOrder: IOrder = {
      ...order.value,
      payment_status: editForm.value.payment_status,
      status: editForm.value.status,
      tracking_number: editForm.value.tracking_number || undefined,
      carrier: editForm.value.carrier || undefined,
      estimated_delivery: editForm.value.estimated_delivery || undefined,
      // Set delivered_at when status changes to delivered
      delivered_at: editForm.value.status === 'delivered' && order.value.status !== 'delivered' 
        ? Date.now() 
        : order.value.delivered_at,
      updated_at: Date.now()
    }

    let inventoryMessage = ''

    // Handle inventory release when order is cancelled
    if (isCancelled && order.value.inventory_reserved && !order.value.inventory_restocked) {
      const releaseResult = await releaseInventory(order.value)
      
      if (releaseResult.success) {
        updatedOrder.inventory_restocked = true
        inventoryMessage = ' Inventory has been returned to stock.'
      } else {
        console.error('Failed to release inventory:', releaseResult.errors)
        toast.add({
          title: 'Warning',
          description: 'Order status updated, but failed to return inventory to stock. Please check manually.',
          color: 'warning'
        })
      }
    }

    // Handle inventory reservation (fallback for old orders that weren't reserved at checkout)
    if (isPaymentVerified && !order.value.inventory_reserved) {
      const reserveResult = await reserveInventory(order.value)
      
      if (reserveResult.success) {
        updatedOrder.inventory_reserved = true
        inventoryMessage = ' Product quantities have been deducted.'
      } else {
        console.error('Failed to reserve inventory:', reserveResult.errors)
        toast.add({
          title: 'Warning',
          description: 'Payment verified, but failed to deduct product quantities. Please check manually.',
          color: 'warning'
        })
      }
    }

    const success = await ordersStore.updateOrder(updatedOrder)

    if (success) {
      // Update local order
      order.value = updatedOrder
      
      toast.add({
        title: 'Success',
        description: 'Order updated successfully!' + inventoryMessage,
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Error',
        description: 'Failed to update order. Please try again.',
        color: 'error'
      })
    }
  } catch (error) {
    console.error('Error updating order:', error)
    toast.add({
      title: 'Error',
      description: 'An error occurred while updating the order.',
      color: 'error'
    })
  } finally {
    updating.value = false
  }
}

</script>

