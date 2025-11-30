<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <UContainer>
      <!-- Page Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Manage Orders</h1>
          <p class="text-gray-600 mt-2">View and update customer orders</p>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          @click="$router.push('/admin')"
        >
          Back to Dashboard
        </UButton>
      </div>

      <!-- Loading State -->
      <div v-if="ordersStore.loading && ordersStore.allOrders.length === 0" class="flex justify-center py-12">
        <div class="text-center">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-600 mx-auto" />
          <p class="mt-2 text-gray-600">Loading orders...</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!ordersStore.loading && ordersStore.sortedAllOrders.length === 0" class="text-center py-12">
        <div class="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
          <UIcon name="i-heroicons-shopping-bag" class="w-16 h-16 text-gray-400 mx-auto" />
          <h3 class="mt-4 text-lg font-semibold text-gray-900">No orders yet</h3>
          <p class="mt-2 text-gray-600">Orders will appear here once customers start placing them.</p>
        </div>
      </div>

      <!-- Orders Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-100 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Order #
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Payment
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="order in ordersStore.sortedAllOrders"
                :key="`${order.user_id}-${order.created_at}`"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                @click="navigateToOrder(order.id)"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ order.order_number }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ order.customer_name }}</div>
                  <div class="text-sm text-gray-500">{{ order.email }}</div>
                  <div v-if="getShippingMobileNumber(order.shipping_address)" class="text-sm text-gray-500">
                    {{ getShippingMobileNumber(order.shipping_address) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(order.created_at) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ order.items.length }} item{{ order.items.length !== 1 ? 's' : '' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">
                    ₱{{ order.total.toFixed(2) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge :color="getPaymentStatusColor(order.payment_status)">
                    {{ order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) }}
                  </UBadge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <UBadge :color="getStatusColor(order.status)">
                    {{ getStatusLabel(order.status) }}
                  </UBadge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <UButton
                    size="sm"
                    color="primary"
                    variant="ghost"
                    @click.stop="navigateToOrder(order.order_number)"
                  >
                    View/Edit
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'

definePageMeta({
  middleware: ['admin']
})

const ordersStore = useOrdersStore()
const router = useRouter()

// Fetch all orders on mount
onMounted(async () => {
  await ordersStore.fetchAllOrders()
})

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string): 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'neutral' => {
  const colors: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'neutral'> = {
    pending_payment: 'warning',
    processing: 'info',
    shipped: 'secondary',
    delivered: 'success',
    cancelled: 'error'
  }
  return colors[status] || 'neutral'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending_payment: 'Pending Payment',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  }
  return labels[status] || status
}

const getPaymentStatusColor = (status: string): 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'neutral' => {
  const colors: Record<string, 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'neutral'> = {
    pending: 'warning',
    verified: 'success',
    failed: 'error'
  }
  return colors[status] || 'neutral'
}

const navigateToOrder = (orderId: string) => {
  router.push(`/admin/orders/${orderId}`)
}

// Helper function to get mobile number from shipping address
const getShippingMobileNumber = (addressString: string): string | null => {
  try {
    const address = JSON.parse(addressString)
    if (address.contact_number) {
      return `Mobile: ${address.contact_number}`
    }
    return null
  } catch {
    return null
  }
}
</script>
