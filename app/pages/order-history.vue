<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <UContainer>
            <!-- Page Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
                <p class="text-gray-600 mt-2">View and manage your orders</p>
            </div>

            <!-- Loading State -->
            <div v-if="ordersStore.loading && ordersStore.orders.length === 0" class="flex justify-center py-12">
                <div class="text-center">
                    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-600 mx-auto" />
                    <p class="mt-2 text-gray-600">Loading orders...</p>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!ordersStore.loading && ordersStore.sortedOrders.length === 0" class="text-center py-12">
                <div class="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
                    <UIcon name="i-heroicons-shopping-bag" class="w-16 h-16 text-gray-400 mx-auto" />
                    <h3 class="mt-4 text-lg font-semibold text-gray-900">No orders yet</h3>
                    <p class="mt-2 text-gray-600">Start shopping to create your first order!</p>
                    <UButton
                        color="primary"
                        size="lg"
                        class="mt-6"
                        @click="$router.push('/products')"
                    >
                        Browse Products
                    </UButton>
                </div>
            </div>

            <!-- Orders List -->
            <div v-else class="space-y-6">
                <div
                    v-for="order in ordersStore.sortedOrders"
                    :key="`${order.user_id}-${order.created_at}`"
                    class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                    <!-- Order Header -->
                    <div class="px-6 py-4 border-b border-gray-200 bg-gray-200 relative">
                        <div class="flex flex-wrap items-center justify-between gap-4 pr-10 md:pr-0">
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900">
                                    Order #{{ order.order_number }}
                                </h3>
                                <p class="text-sm text-gray-600">
                                    {{ formatDate(order.created_at) }}
                                </p>
                            </div>
                            <div class="flex items-center gap-3">
                                <UBadge :color="getStatusColor(order.status)" size="lg">
                                    {{ getStatusLabel(order.status) }}
                                </UBadge>
                                <!-- Chevron button visible on large screens only -->
                                <UButton
                                    icon="i-heroicons-chevron-down"
                                    variant="ghost"
                                    @click="toggleOrderDetails(order)"
                                    :class="{ 'rotate-180': expandedOrders.has(`${order.user_id}-${order.created_at}`) }"
                                    class="hidden md:inline-flex"
                                />
                            </div>
                        </div>
                        <!-- Chevron button - positioned top right on small screens -->
                        <UButton
                            icon="i-heroicons-chevron-down"
                            variant="ghost"
                            @click="toggleOrderDetails(order)"
                            :class="{ 'rotate-180': expandedOrders.has(`${order.user_id}-${order.created_at}`) }"
                            class="absolute top-2 right-2 md:hidden"
                        />
                    </div>

                    <!-- Order Summary (Always Visible) -->
                    <div class="px-6 py-4">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-sm text-gray-600">
                                    {{ order.items.length }} item{{ order.items.length !== 1 ? 's' : '' }}
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="text-lg font-bold text-primary-600">₱{{ formatPrice(order.total) }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Expanded Order Details -->
                    <div
                        v-if="expandedOrders.has(`${order.user_id}-${order.created_at}`)"
                        class="border-t border-gray-200"
                    >
                        <!-- Order Progress Steps (Show only if not cancelled) -->
                        <div v-if="order.status !== 'cancelled'" class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <div class="flex items-center justify-between max-w-3xl mx-auto">
                                <!-- Step 1: Payment -->
                                <div class="flex flex-col items-center flex-1">
                                    <div 
                                        :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base transition-all duration-300',
                                            getOrderStep(order.status) >= 1 
                                                ? 'bg-primary-600 text-white shadow-lg' 
                                                : 'bg-gray-200 text-gray-400'
                                        ]"
                                    >
                                        <UIcon v-if="getOrderStep(order.status) > 1" name="i-heroicons-check" class="w-5 h-5" />
                                        <span v-else>1</span>
                                    </div>
                                    <span 
                                        :class="[
                                            'mt-1 text-xs font-medium',
                                            getOrderStep(order.status) === 1 ? 'text-primary-600' : 'text-gray-500'
                                        ]"
                                    >
                                        Payment
                                    </span>
                                </div>

                                <!-- Connector Line -->
                                <div 
                                    :class="[
                                        'h-1 flex-1 mx-2 transition-all duration-300',
                                        getOrderStep(order.status) >= 2 ? 'bg-primary-600' : 'bg-gray-200'
                                    ]"
                                ></div>

                                <!-- Step 2: Processing -->
                                <div class="flex flex-col items-center flex-1">
                                    <div 
                                        :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base transition-all duration-300',
                                            getOrderStep(order.status) >= 2 
                                                ? 'bg-primary-600 text-white shadow-lg' 
                                                : 'bg-gray-200 text-gray-400'
                                        ]"
                                    >
                                        <UIcon v-if="getOrderStep(order.status) > 2" name="i-heroicons-check" class="w-5 h-5" />
                                        <span v-else>2</span>
                                    </div>
                                    <span 
                                        :class="[
                                            'mt-1 text-xs font-medium',
                                            getOrderStep(order.status) === 2 ? 'text-primary-600' : 'text-gray-500'
                                        ]"
                                    >
                                        Processing
                                    </span>
                                </div>

                                <!-- Connector Line -->
                                <div 
                                    :class="[
                                        'h-1 flex-1 mx-2 transition-all duration-300',
                                        getOrderStep(order.status) >= 3 ? 'bg-primary-600' : 'bg-gray-200'
                                    ]"
                                ></div>

                                <!-- Step 3: Shipped -->
                                <div class="flex flex-col items-center flex-1">
                                    <div 
                                        :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base transition-all duration-300',
                                            getOrderStep(order.status) >= 3 
                                                ? 'bg-primary-600 text-white shadow-lg' 
                                                : 'bg-gray-200 text-gray-400'
                                        ]"
                                    >
                                        <UIcon v-if="getOrderStep(order.status) > 3" name="i-heroicons-check" class="w-5 h-5" />
                                        <span v-else>3</span>
                                    </div>
                                    <span 
                                        :class="[
                                            'mt-1 text-xs font-medium',
                                            getOrderStep(order.status) === 3 ? 'text-primary-600' : 'text-gray-500'
                                        ]"
                                    >
                                        Shipped
                                    </span>
                                </div>

                                <!-- Connector Line -->
                                <div 
                                    :class="[
                                        'h-1 flex-1 mx-2 transition-all duration-300',
                                        getOrderStep(order.status) >= 4 ? 'bg-primary-600' : 'bg-gray-200'
                                    ]"
                                ></div>

                                <!-- Step 4: Received -->
                                <div class="flex flex-col items-center flex-1">
                                    <div 
                                        :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-base transition-all duration-300',
                                            getOrderStep(order.status) >= 4 
                                                ? 'bg-primary-600 text-white shadow-lg' 
                                                : 'bg-gray-200 text-gray-400'
                                        ]"
                                    >
                                        <UIcon v-if="getOrderStep(order.status) >= 4" name="i-heroicons-check" class="w-5 h-5" />
                                        <span v-else>4</span>
                                    </div>
                                    <span 
                                        :class="[
                                            'mt-1 text-xs font-medium',
                                            getOrderStep(order.status) === 4 ? 'text-primary-600' : 'text-gray-500'
                                        ]"
                                    >
                                        Received
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Main Content Grid -->
                        <div class="px-6 py-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Left Column -->
                                <div class="space-y-6">
                                    <!-- Order Items -->
                                    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                        <h4 class="font-semibold mb-3 text-gray-900">Order Items</h4>
                                        <div class="space-y-3">
                                            <div
                                                v-for="item in order.items"
                                                :key="item.id"
                                                class="flex gap-4"
                                            >
                                                <div v-if="item.image" class="flex-shrink-0">
                                                    <img
                                                        :src="item.image"
                                                        :alt="item.name"
                                                        class="w-16 h-16 object-cover rounded"
                                                    />
                                                </div>
                                                <div class="flex-1">
                                                    <p class="font-medium">{{ item.name }}</p>
                                                    <p class="text-xs text-gray-400">{{ capitalizeFirst(item.category || productsStore.getProductById(item.id)?.category) }}</p>
                                                    <p class="text-sm text-gray-600">
                                                        Qty: {{ item.quantity }} × ₱{{ formatPrice(item.price) }}
                                                    </p>
                                                </div>
                                                <div class="text-right">
                                                    <p class="font-semibold">₱{{ formatPrice(item.price * item.quantity) }}</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Order Summary (moved from separate section) -->
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
                                                    <span class="text-gray-600 font-bold">Shipping:</span>
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
                                    <div v-if="order.notes" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                        <h4 class="font-semibold mb-2 text-gray-900">Additional Notes</h4>
                                        <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ order.notes }}</p>
                                    </div>

                                    <!-- Payment Information -->
                                    <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                        <h4 class="font-semibold mb-3 text-gray-900">Payment Information</h4>
                                        
                                        <!-- Payment Method Card with QR Codes (shown when payment proof is editable) -->
                                        <div v-if="isPaymentProofEditable(order)" class="mb-6">
                                            <!-- Payment Information -->
                                            <div class="pt-4 mb-4">
                                                <div class="border-l-4 border-primary-600 pl-4 py-3 bg-primary-50">
                                                    <h3 class="font-semibold text-lg">Payment Method: GCash / Bank Transfer (BDO)</h3>
                                                    <p class="text-sm text-gray-600 mt-1">To confirm your order, please 1) pay using the QR codes below, and 2) upload your proof of payment. Order processing begins once your payment has been successfully verified.</p>
                                                </div>
                                            </div>

                                            <!-- QR Code Preview -->
                                            <div class="flex justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div class="text-center">
                                                    <div class="flex flex-col md:flex-row gap-4 justify-center">
                                                        <img
                                                            :src="getImageUrl('misc/gcash_qr_code_250_290.jpg')"
                                                            alt="GCash QR Code"
                                                            class="object-cover rounded"
                                                        />
                                                        <img
                                                            :src="getImageUrl('misc/bdo_qr_code_250_290.jpg')"
                                                            alt="BDO QR Code"
                                                            class="object-cover rounded"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="space-y-3 text-sm">
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">Payment Method:</span>
                                                <span class="font-medium">{{ order.payment_method }}</span>
                                            </div>
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">Payment Status:</span>
                                                <UBadge :color="getPaymentStatusColor(order.payment_status)">
                                                    {{ order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) }}
                                                </UBadge>
                                            </div>

                                            

                                            <!-- Payment Proof Upload/View -->
                                            <div class="mt-4">
                                                <!-- Show payment proof image if it exists -->
                                                <div v-if="order.payment_proof" class="mb-4">
                                                    <div class="flex items-center gap-2 mb-2">
                                                        <p class="text-sm font-medium text-gray-700">Payment Proof:</p>
                                                    </div>
                                                    <div class="relative inline-block">
                                                        <img
                                                            :src="getImageUrl(order.payment_proof, order.updated_at)"
                                                            alt="Payment Proof"
                                                            class="w-48 h-48 object-cover rounded border border-gray-300"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <!-- Show upload field if payment proof is editable (pending or failed status) -->
                                                <div v-if="isPaymentProofEditable(order)" class="space-y-3">
                                                    <div v-if="!order.payment_proof" class="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                                        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                        <p class="text-sm text-yellow-800">
                                                            Please upload your proof of payment to proceed with your order.
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <label class="block text-sm font-medium text-gray-700 mb-2">
                                                            {{ order.payment_proof ? 'Replace Payment Proof' : 'Upload Proof of Payment' }}
                                                        </label>
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg, image/jpg, image/png"
                                                            @change="handlePaymentProofUpload($event, order)"
                                                            :disabled="uploadingProof.has(`${order.user_id}-${order.created_at}`)"
                                                            class="block w-full text-sm text-gray-500
                                                                file:mr-4 file:py-2 file:px-4
                                                                file:rounded-md file:border-0
                                                                file:text-sm file:font-semibold
                                                                file:bg-primary-50 file:text-primary-700
                                                                hover:file:bg-primary-100
                                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                                cursor-pointer border border-gray-300 rounded-md"
                                                        />
                                                        <p class="text-xs text-gray-500 mt-1">JPG, JPEG, PNG (Max 5MB)</p>
                                                    </div>
                                                    <div v-if="uploadingProof.has(`${order.user_id}-${order.created_at}`)" class="flex items-center gap-2 text-sm text-primary-600">
                                                        <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
                                                        Uploading payment proof...
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Right Column -->
                                <div class="space-y-6">
                                    <!-- Shipping Address (Only show if shipping via J&T) -->
                                    <div v-if="order.delivery_method === 'ship_via_jt' && getShippingAddress(order.shipping_address)" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                        <h4 class="font-semibold mb-2 text-gray-900">Shipping Address</h4>
                                        <div class="text-sm text-gray-700">
                                            <p class="font-medium">{{ order.customer_name }}</p>
                                            <p class="mt-1">
                                                {{ getShippingAddress(order.shipping_address).street }}<br />
                                                {{ getShippingAddress(order.shipping_address).city }}, 
                                                {{ getShippingAddress(order.shipping_address).province }}
                                                <span v-if="getShippingAddress(order.shipping_address).postal_code">
                                                    {{ getShippingAddress(order.shipping_address).postal_code }}
                                                </span><br />
                                                {{ getShippingAddress(order.shipping_address).country }}
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Delivery Method -->
                                    <div v-if="order.delivery_method" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                        <h4 class="font-semibold mb-2 text-gray-900">Delivery Method</h4>
                                        <div class="text-sm text-gray-700">
                                            <p class="font-medium">
                                                {{ getDeliveryMethodLabel(order.delivery_method) }}
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Tracking Information (Only show for shipped/delivered J&T orders with tracking number) -->
                                    <div v-if="(order.status === 'shipped' || order.status === 'delivered') && order.delivery_method === 'ship_via_jt' && order.tracking_number" class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                                        <h4 class="font-semibold mb-3 text-gray-900">Tracking Information</h4>
                                        <div class="space-y-3 text-sm">
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">Courier:</span>
                                                <span class="font-medium">J&T</span>
                                            </div>
                                            <div class="flex justify-between">
                                                <span class="text-gray-600">Tracking Number:</span>
                                                <span class="font-mono font-medium">{{ order.tracking_number }}</span>
                                            </div>
                                            <div v-if="order.estimated_delivery" class="flex justify-between">
                                                <span class="text-gray-600">Estimated Delivery:</span>
                                                <span class="font-medium">{{ formatEstimatedDelivery(order.estimated_delivery) }}</span>
                                            </div>
                                            <div class="mt-3 pt-3 border-t border-gray-200">
                                                <a
                                                    href="https://www.jtexpress.ph"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    class="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                                >
                                                    <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
                                                    Track Package on J&T Website
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import { useOrdersStore } from '~/stores/orders'
import { useProductsStore } from '~/stores/products'
import type { IOrder } from '~/types/order'
import getImageUrl from '~/utils/get-image-url'
import formatPrice from '~/utils/format-price'

const ordersStore = useOrdersStore()
const productsStore = useProductsStore()
const toast = useToast()

// Track expanded orders
const expandedOrders = ref<Set<string>>(new Set())

// Track uploading state per order
const uploadingProof = ref<Set<string>>(new Set())

// Fetch orders on mount
onMounted(async () => {
    // Load products for category lookups in order items
    if (productsStore.products.length === 0) {
        await productsStore.fetchProducts()
    }
    await ordersStore.fetchOrders()
    // Auto-expand the most recent order (first in sortedOrders)
    if (ordersStore.sortedOrders.length > 0) {
        const mostRecentOrder = ordersStore.sortedOrders[0]
        if (mostRecentOrder) {
            const orderKey = `${mostRecentOrder.user_id}-${mostRecentOrder.created_at}`
            expandedOrders.value.add(orderKey)
        }
    }
})

// Watch for changes in sortedOrders to auto-expand most recent order if needed
watch(() => ordersStore.sortedOrders, (newOrders) => {
    if (newOrders.length > 0 && expandedOrders.value.size === 0) {
        const mostRecentOrder = newOrders[0]
        if (mostRecentOrder) {
            const orderKey = `${mostRecentOrder.user_id}-${mostRecentOrder.created_at}`
            expandedOrders.value.add(orderKey)
        }
    }
}, { immediate: true })

const toggleOrderDetails = (order: IOrder) => {
    const key = `${order.user_id}-${order.created_at}`
    if (expandedOrders.value.has(key)) {
        expandedOrders.value.delete(key)
    } else {
        expandedOrders.value.add(key)
    }
}

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

const formatEstimatedDelivery = (dateString: string) => {
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    } catch {
        return dateString
    }
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

const getShippingAddress = (addressString: string) => {
    try {
        return JSON.parse(addressString)
    } catch {
        return null
    }
}

const getOrderStep = (status: string): number => {
    const statusMap: Record<string, number> = {
        pending_payment: 1,
        processing: 2,
        shipped: 3,
        delivered: 4
    }
    return statusMap[status] || 1
}

const getDeliveryMethodLabel = (method: string): string => {
    const labels: Record<string, string> = {
        meet_up: 'Meet up',
        pick_up: 'Pick up',
        ship_via_jt: 'Ship via J&T'
    }
    return labels[method] || method
}

// Capitalize first letter of a string
const capitalizeFirst = (str: string | undefined): string => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const isPaymentProofEditable = (order: IOrder): boolean => {
    return (order.payment_status === 'pending' || order.payment_status === 'failed') && order.status !== 'cancelled'
}

const handlePaymentProofUpload = async (event: Event, order: IOrder) => {
    const target = event.target as HTMLInputElement
    if (!target.files || target.files.length === 0) return

    const file = target.files[0]
    if (!file) return
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        toast.add({
            title: 'File Too Large',
            description: 'Please upload an image smaller than 5MB',
            color: 'error'
        })
        target.value = ''
        return
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        toast.add({
            title: 'Invalid File Type',
            description: 'Please upload a JPG, JPEG, or PNG image',
            color: 'error'
        })
        target.value = ''
        return
    }

    const orderKey = `${order.user_id}-${order.created_at}`
    uploadingProof.value.add(orderKey)

    try {
        const success = await ordersStore.uploadPaymentProof(order, file)

        if (success) {
            toast.add({
                title: 'Success',
                description: 'Payment proof uploaded successfully!',
                color: 'success'
            })
            target.value = ''
        } else {
            toast.add({
                title: 'Upload Failed',
                description: 'Failed to upload payment proof. Please try again.',
                color: 'error'
            })
        }
    } catch (error) {
        console.error('Payment proof upload error:', error)
        toast.add({
            title: 'Error',
            description: 'An error occurred while uploading',
            color: 'error'
        })
    } finally {
        uploadingProof.value.delete(orderKey)
    }
}
</script>

<style scoped>
/* Custom styles for smooth transitions */
.rotate-180 {
    transform: rotate(180deg);
}
</style>
