<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <UContainer>
            <!-- Order Progress Steps -->
            <div class="mb-8">
                <div class="flex items-center justify-between max-w-3xl mx-auto">
                    <!-- Step 1: Payment -->
                    <div class="flex flex-col items-center flex-1">
                        <div 
                            :class="[
                                'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300',
                                currentStep >= 1 
                                    ? 'bg-primary-600 text-white shadow-lg' 
                                    : 'bg-gray-200 text-gray-400'
                            ]"
                        >
                            <UIcon v-if="currentStep > 1" name="i-heroicons-check" class="w-6 h-6" />
                            <span v-else>1</span>
                        </div>
                        <span 
                            :class="[
                                'mt-2 text-sm font-medium',
                                currentStep === 1 ? 'text-primary-600' : 'text-gray-500'
                            ]"
                        >
                            Payment
                        </span>
                    </div>

                    <!-- Connector Line -->
                    <div 
                        :class="[
                            'h-1 flex-1 mx-2 transition-all duration-300',
                            currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'
                        ]"
                    ></div>

                    <!-- Step 2: Processing -->
                    <div class="flex flex-col items-center flex-1">
                        <div 
                            :class="[
                                'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300',
                                currentStep >= 2 
                                    ? 'bg-primary-600 text-white shadow-lg' 
                                    : 'bg-gray-200 text-gray-400'
                            ]"
                        >
                            <UIcon v-if="currentStep > 2" name="i-heroicons-check" class="w-6 h-6" />
                            <span v-else>2</span>
                        </div>
                        <span 
                            :class="[
                                'mt-2 text-sm font-medium',
                                currentStep === 2 ? 'text-primary-600' : 'text-gray-500'
                            ]"
                        >
                            Processing
                        </span>
                    </div>

                    <!-- Connector Line -->
                    <div 
                        :class="[
                            'h-1 flex-1 mx-2 transition-all duration-300',
                            currentStep >= 3 ? 'bg-primary-600' : 'bg-gray-200'
                        ]"
                    ></div>

                    <!-- Step 3: Shipped -->
                    <div class="flex flex-col items-center flex-1">
                        <div 
                            :class="[
                                'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300',
                                currentStep >= 3 
                                    ? 'bg-primary-600 text-white shadow-lg' 
                                    : 'bg-gray-200 text-gray-400'
                            ]"
                        >
                            <UIcon v-if="currentStep > 3" name="i-heroicons-check" class="w-6 h-6" />
                            <span v-else>3</span>
                        </div>
                        <span 
                            :class="[
                                'mt-2 text-sm font-medium',
                                currentStep === 3 ? 'text-primary-600' : 'text-gray-500'
                            ]"
                        >
                            Shipped
                        </span>
                    </div>

                    <!-- Connector Line -->
                    <div 
                        :class="[
                            'h-1 flex-1 mx-2 transition-all duration-300',
                            currentStep >= 4 ? 'bg-primary-600' : 'bg-gray-200'
                        ]"
                    ></div>

                    <!-- Step 4: Received -->
                    <div class="flex flex-col items-center flex-1">
                        <div 
                            :class="[
                                'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300',
                                currentStep >= 4 
                                    ? 'bg-primary-600 text-white shadow-lg' 
                                    : 'bg-gray-200 text-gray-400'
                            ]"
                        >
                            <UIcon v-if="currentStep >= 4" name="i-heroicons-check" class="w-6 h-6" />
                            <span v-else>4</span>
                        </div>
                        <span 
                            :class="[
                                'mt-2 text-sm font-medium',
                                currentStep === 4 ? 'text-primary-600' : 'text-gray-500'
                            ]"
                        >
                            Received
                        </span>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="max-w-4xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Order Details Form (Left Column) -->
                    <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
                        <h2 class="text-2xl font-bold mb-4">Complete Your Order</h2>
                        
                        <div class="space-y-6">
                            <!-- Shipping Address Section -->
                            <div>
                                <h3 class="font-semibold text-lg mb-3">Shipping Address</h3>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                                        <input
                                            v-model="shippingAddress.street"
                                            type="text"
                                            placeholder="House no., Street name"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                            <input
                                                v-model="shippingAddress.city"
                                                type="text"
                                                placeholder="City"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                                            <input
                                                v-model="shippingAddress.province"
                                                type="text"
                                                placeholder="Province"
                                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input
                                            v-model="shippingAddress.postal_code"
                                            type="text"
                                            placeholder="Postal Code"
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                        <input
                                            v-model="shippingAddress.country"
                                            type="text"
                                            disabled
                                            class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Payment Information -->
                            <div class="border-t pt-4">
                                <div class="border-l-4 border-primary-600 pl-4 py-3 bg-primary-50">
                                    <h3 class="font-semibold text-lg">Payment Method: GCash / Bank Transfer</h3>
                                    <p class="text-sm text-gray-600 mt-1">After confirming your order, you can upload proof of payment from your Order History.</p>
                                </div>
                            </div>

                            <!-- QR Code Preview -->
                            <div class="flex justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div class="text-center">
                                    <p class="text-sm text-gray-600 mb-3">Payment QR codes will be available in your order details</p>
                                    <div class="flex gap-4 justify-center">
                                        <img
                                            :src="getImageUrl('misc/gcash_qr_code_250_290.jpg')"
                                            alt="GCash QR Code"
                                            class="w-24 h-24 object-cover rounded"
                                        />
                                        <img
                                            :src="getImageUrl('misc/bdo_qr_code_250_290.jpg')"
                                            alt="BDO QR Code"
                                            class="w-24 h-24 object-cover rounded"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Submit Button -->
                            <UButton 
                                block 
                                color="primary" 
                                size="lg" 
                                @click="handleSubmitOrder"
                                :loading="isSubmitting"
                                :disabled="isSubmitting"
                            >
                                {{ isSubmitting ? 'Creating Order...' : 'Confirm Order' }}
                            </UButton>

                            <p class="text-xs text-gray-500 text-center">
                                By confirming this order, you agree to our terms and conditions
                            </p>
                        </div>
                    </div>

                    <!-- Order Summary (Right Column) -->
                    <div class="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
                        <h3 class="text-lg font-bold mb-4">Order Summary</h3>
                        
                        <div class="space-y-3">
                            <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm">
                                <span class="text-gray-600">{{ item.name }} x {{ item.quantity }}</span>
                                <span class="font-medium">₱{{ (item.price * item.quantity).toFixed(2) }}</span>
                            </div>
                        </div>

                        <div class="border-t my-4"></div>

                        <div class="space-y-2">
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Subtotal</span>
                                <span>₱{{ cartStore.total.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Shipping</span>
                                <span class="text-green-600">FREE</span>
                            </div>
                        </div>

                        <div class="border-t my-4"></div>

                        <div class="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span class="text-primary-600">₱{{ cartStore.total.toFixed(2) }}</span>
                        </div>

                        <div class="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800">
                            <UIcon name="i-heroicons-information-circle" class="inline mr-1" />
                            Your order will be processed after payment verification
                        </div>
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useOrdersStore } from '~/stores/orders'
import { useUser } from '~/composables/api/useUser'
import type { IOrderItem, IOrderInput } from '~/types/order'
import getImageUrl from '~/utils/get-image-url'

const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

// Current step in the order process
const currentStep = ref(1) // 1: Payment, 2: Processing, 3: Shipped, 4: Received

// Shipping address form
const shippingAddress = ref({
    street: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'Philippines'
})

// Loading state
const isSubmitting = ref(false)

// Check authentication and cart on mount
onMounted(() => {
    // Redirect if cart is empty
    if (cartStore.items.length === 0) {
        router.push('/')
        return
    }
    
    // Redirect to login if not authenticated
    if (!authStore.isAuthenticated) {
        toast.add({
            title: 'Authentication Required',
            description: 'Please sign in or register to proceed with checkout',
            color: 'error'
        })
        router.push('/login')
    }
})

const formatPrice = (price: number) => {
    return price.toFixed(2)
}

const handleSubmitOrder = async () => {
    // Validate authentication
    if (!authStore.isAuthenticated) {
        toast.add({
            title: 'Authentication Required',
            description: 'Please sign in to complete your order',
            color: 'error'
        })
        router.push('/login')
        return
    }

    // Validate shipping address
    if (!shippingAddress.value.street || !shippingAddress.value.city || !shippingAddress.value.province) {
        toast.add({
            title: 'Missing Information',
            description: 'Please fill in all shipping address fields',
            color: 'error'
        })
        return
    }

    isSubmitting.value = true

    try {
        // Get user information
        const { getUser } = useUser()
        const user = await getUser()

        if (!user) {
            toast.add({
                title: 'Error',
                description: 'Failed to retrieve user information',
                color: 'error'
            })
            isSubmitting.value = false
            return
        }

        // Create order items from cart (snapshot product details)
        const orderItems: IOrderItem[] = cartStore.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }))

        // Prepare shipping address string (JSON)
        const shippingAddressStr = JSON.stringify(shippingAddress.value)

        // Prepare order input
        const orderInput: IOrderInput = {
            items: orderItems,
            subtotal: cartStore.total,
            shipping_cost: 0,
            total: cartStore.total,
            customer_name: user.given_name && user.family_name 
                ? `${user.given_name} ${user.family_name}` 
                : user.email,
            email: user.email,
            phone_number: user.phone_number || '',
            shipping_address: shippingAddressStr,
            payment_method: 'GCash/Bank Transfer'
        }

        // Create order
        const order = await ordersStore.createOrder(orderInput)

        if (order) {
            // Clear cart
            await cartStore.clearCart()

            // Show success message
            toast.add({
                title: 'Order Created!',
                description: `Order ${order.order_number} has been created. Please upload payment proof in your order history.`,
                color: 'success'
            })

            // Redirect to order history
            router.push('/order-history')
        } else {
            toast.add({
                title: 'Order Failed',
                description: 'Failed to create order. Please try again.',
                color: 'error'
            })
        }
    } catch (error) {
        console.error('Order creation failed:', error)
        toast.add({
            title: 'Error',
            description: 'An error occurred while creating your order',
            color: 'error'
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>

