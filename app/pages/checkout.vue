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
                            <!-- Delivery Method Selection -->
                            <div>
                                <h3 class="font-semibold text-lg mb-3">Delivery Method</h3>
                                <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div class="text-sm text-blue-800">
                                            <p class="font-medium mb-1">How to get a free shipping fee:</p>
                                            <ul class="list-disc list-outside pl-5 space-y-1 text-blue-700">
                                                <li class="pl-1">Orders containing items from the "Sets" category qualify for free shipping</li>
                                                <li class="pl-1">Orders with 5 or more items qualify for free shipping</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="space-y-3">
                                    <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="deliveryMethod === 'meet_up' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'">
                                        <input
                                            v-model="deliveryMethod"
                                            type="radio"
                                            value="meet_up"
                                            class="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500"
                                        />
                                        <div class="flex-1">
                                            <span class="font-medium text-gray-900">Meet up</span>
                                            <p class="text-sm text-gray-500">Arrange a meeting location</p>
                                        </div>
                                    </label>
                                    <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="deliveryMethod === 'pick_up' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'">
                                        <input
                                            v-model="deliveryMethod"
                                            type="radio"
                                            value="pick_up"
                                            class="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500"
                                        />
                                        <div class="flex-1">
                                            <span class="font-medium text-gray-900">Pick up</span>
                                            <p class="text-sm text-gray-500">Pick up from our location</p>
                                        </div>
                                    </label>
                                    <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="deliveryMethod === 'ship_via_jt' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'">
                                        <input
                                            v-model="deliveryMethod"
                                            type="radio"
                                            value="ship_via_jt"
                                            class="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500"
                                        />
                                        <div class="flex-1">
                                            <span class="font-medium text-gray-900">Ship via J&T</span>
                                            <p class="text-sm text-gray-500">Ship to your address via J&T Express</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <!-- Paper Bag Section -->
                            <div>
                                <h3 class="font-semibold text-lg mb-3">Paper Bag</h3>
                                
                                <!-- Information about free paper bag -->
                                <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div class="text-sm text-blue-800">
                                            <p class="font-medium mb-1">How to get a free paper bag:</p>
                                            <ul class="list-disc list-outside pl-5 space-y-1 text-blue-700">
                                                <li class="pl-1">Orders with 4 or more items automatically get free paper bags (1 bag per 4 items)</li>
                                                <li class="pl-1">Orders containing items from the "Sets" category automatically get at least 1 free paper bag</li>
                                                <li class="pl-1">Each bag can hold up to 5 jewelries</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="space-y-3">
                                    <!-- Free paper bag for 4+ items -->
                                    <div v-if="totalItemCount >= 4" class="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                                        <div class="flex items-center gap-2 mb-1">
                                            <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-600" />
                                            <span class="font-medium text-green-800">Free paper bag included</span>
                                        </div>
                                        <p class="text-sm text-green-700">
                                            Your order qualifies for {{ paperBagQuantity }} free paper bag{{ paperBagQuantity > 1 ? 's' : '' }} (auto-calculated based on item count)
                                        </p>
                                        <p class="text-xs text-green-600 mt-1">Each bag can hold up to 5 jewelries</p>
                                    </div>
                                    
                                    <!-- Free paper bag for Sets items -->
                                    <div v-else-if="hasSetsItems" class="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                                        <div class="flex items-center gap-2 mb-1">
                                            <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-600" />
                                            <span class="font-medium text-green-800">Free paper bag included</span>
                                        </div>
                                        <p class="text-sm text-green-700">
                                            Your order includes Sets items, so you'll receive {{ paperBagQuantity }} free paper bag{{ paperBagQuantity > 1 ? 's' : '' }} (1 bag per 4 items)
                                        </p>
                                        <p class="text-xs text-green-600 mt-1">Each bag can hold up to 5 jewelries</p>
                                    </div>
                                    
                                    <!-- Optional paper bag for < 4 items (no Sets) -->
                                    <div v-else class="p-4 border-2 rounded-lg" :class="includePaperBag ? 'border-primary-600 bg-primary-50' : 'border-gray-200'">
                                        <label class="flex items-start cursor-pointer">
                                            <input
                                                v-model="includePaperBag"
                                                type="checkbox"
                                                class="mt-1 mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500 rounded"
                                            />
                                            <div class="flex-1">
                                                <span class="font-medium text-gray-900">Add mini paper bag (+₱20)</span>
                                                <p class="text-sm text-gray-600 mt-1">
                                                    Optionally add a paper bag for your order. Can hold up to 5 jewelries.
                                                </p>
                                                <p v-if="includePaperBag && paperBagQuantity > 0" class="text-sm text-primary-600 mt-1">
                                                    {{ paperBagQuantity }} paper bag{{ paperBagQuantity > 1 ? 's' : '' }} will be added
                                                </p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Shipping Address Section (Conditional) -->
                            <div v-if="deliveryMethod === 'ship_via_jt'">
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
                                            class="w-48 h-48 object-cover rounded"
                                        />
                                        <img
                                            :src="getImageUrl('misc/bdo_qr_code_250_290.jpg')"
                                            alt="BDO QR Code"
                                            class="w-48 h-48 object-cover rounded"
                                        />
                                    </div>
                                </div>
                            </div>

                            <!-- Additional Notes -->
                            <div>
                                <h3 class="font-semibold text-lg mb-3">Additional Notes</h3>
                                <textarea
                                    v-model="additionalNotes"
                                    rows="4"
                                    placeholder="Any special instructions or notes for your order (optional)"
                                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none"
                                ></textarea>
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
                                By confirming this order, you agree to our 
                                <NuxtLink to="/terms-and-conditions" class="text-primary-600 hover:text-primary-700 underline">
                                    terms and conditions
                                </NuxtLink>
                            </p>
                        </div>
                    </div>

                    <!-- Order Summary (Right Column) -->
                    <div class="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
                        <h3 class="text-lg font-bold mb-4">Order Summary</h3>

                        <div class="space-y-2">
                            <!-- Item Breakdown -->
                            <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm">
                                <span class="text-gray-600">{{ item.name }} x {{ item.quantity }}</span>
                                <span>₱{{ (item.price * item.quantity).toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">Subtotal</span>
                                <span>₱{{ cartStore.total.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600">
                                    Shipping ({{ getDeliveryMethodLabel(deliveryMethod) }})
                                    <span v-if="totalItemCount >= 5" class="text-xs text-green-600">(Free for 5+ items)</span>
                                </span>
                                <span :class="shippingCost === 0 ? 'text-green-600 font-medium' : ''">
                                    {{ shippingCost === 0 ? 'FREE' : `₱${shippingCost.toFixed(2)}` }}
                                </span>
                            </div>
                            <div v-if="paperBagQuantity > 0" class="flex justify-between text-sm">
                                <span class="text-gray-600">
                                    Paper Bag{{ paperBagQuantity > 1 ? ` (x${paperBagQuantity})` : '' }}
                                </span>
                                <span :class="paperBagCost === 0 ? 'text-green-600 font-medium' : ''">
                                    {{ paperBagCost === 0 ? 'FREE' : `₱${paperBagCost.toFixed(2)}` }}
                                </span>
                            </div>
                        </div>

                        <div class="border-t my-4"></div>

                        <div class="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span class="text-primary-600">₱{{ orderTotal.toFixed(2) }}</span>
                        </div>

                        <div class="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800">
                            <UIcon name="i-heroicons-information-circle" class="inline" />
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
import { useProductsStore } from '~/stores/products'
import { useUser } from '~/composables/api/useUser'
import { useInventoryAdjustments } from '~/composables/useInventoryAdjustments'
import type { IOrderItem, IOrderInput } from '~/types/order'
import getImageUrl from '~/utils/get-image-url'

const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const productsStore = useProductsStore()

// Current step in the order process
const currentStep = ref(1) // 1: Payment, 2: Processing, 3: Shipped, 4: Received

// Delivery method selection
const deliveryMethod = ref<'meet_up' | 'pick_up' | 'ship_via_jt'>('meet_up')

// Shipping address form
const shippingAddress = ref({
    street: '',
    city: '',
    province: '',
    postal_code: '',
    country: 'Philippines'
})

// Additional notes
const additionalNotes = ref('')

// Paper bag selection for orders < 4 items (and no Sets)
const includePaperBag = ref(false)

// Loading state
const isSubmitting = ref(false)

// Check authentication and cart on mount
onMounted(async () => {
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
        return
    }
    
    // Ensure products are loaded for category lookups
    if (productsStore.products.length === 0) {
        await productsStore.fetchProducts()
    }
})

const formatPrice = (price: number) => {
    return price.toFixed(2)
}

// Calculate total item count (sum of quantities)
const totalItemCount = computed(() => {
    return cartStore.items.reduce((sum, item) => sum + item.quantity, 0)
})

// Check if cart contains any items from "Sets" category
const hasSetsItems = computed(() => {
    return cartStore.items.some(item => {
        const product = productsStore.getProductById(item.id)
        return product?.category === 'Sets'
    })
})

// Calculate paper bag quantity
const paperBagQuantity = computed(() => {
    if (hasSetsItems.value) {
        // Sets items always get at least 1 free bag
        return Math.max(1, Math.ceil(totalItemCount.value / 4))
    }
    if (totalItemCount.value >= 4) {
        // 4+ items get free bags (1 bag per 4 items)
        return Math.ceil(totalItemCount.value / 4)
    }
    if (totalItemCount.value < 4 && includePaperBag.value) {
        // Optional bag for < 4 items
        return 1
    }
    return 0
})

// Calculate paper bag cost
const paperBagCost = computed(() => {
    if (hasSetsItems.value) {
        // Free for Sets items
        return 0
    }
    if (totalItemCount.value >= 4) {
        // Free for 4+ items
        return 0
    }
    if (totalItemCount.value < 4 && includePaperBag.value) {
        // 20 pesos per bag for < 4 items
        return 20 * paperBagQuantity.value
    }
    return 0
})

// Calculate shipping cost based on delivery method
const shippingCost = computed(() => {
    // Free shipping for 5+ items regardless of delivery method
    if (totalItemCount.value >= 5) {
        return 0
    }
    // Otherwise use existing logic
    if (deliveryMethod.value === 'ship_via_jt') {
        return 75
    }
    return 0 // Free for meet_up and pick_up
})

// Calculate order total including shipping and paper bag
const orderTotal = computed(() => {
    return cartStore.total + shippingCost.value + paperBagCost.value
})

// Get delivery method label
const getDeliveryMethodLabel = (method: string): string => {
    const labels: Record<string, string> = {
        meet_up: 'Meet up',
        pick_up: 'Pick up',
        ship_via_jt: 'Ship via J&T'
    }
    return labels[method] || method
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

    // Validate shipping address only if Ship via J&T is selected
    if (deliveryMethod.value === 'ship_via_jt') {
        if (!shippingAddress.value.street || !shippingAddress.value.city || !shippingAddress.value.province) {
            toast.add({
                title: 'Missing Information',
                description: 'Please fill in all shipping address fields',
                color: 'error'
            })
            return
        }
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
        const orderItems: IOrderItem[] = cartStore.items.map(item => {
            const product = productsStore.getProductById(item.id)
            return {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                category: product?.category
            }
        })

        // Prepare shipping address string (JSON)
        // If not shipping via J&T, use empty address or delivery method info
        const shippingAddressStr = deliveryMethod.value === 'ship_via_jt' 
            ? JSON.stringify(shippingAddress.value)
            : JSON.stringify({
                ...shippingAddress.value,
                delivery_method: deliveryMethod.value
            })

        // Prepare order input
        const orderInput: IOrderInput = {
            items: orderItems,
            subtotal: cartStore.total,
            shipping_cost: shippingCost.value,
            total: orderTotal.value,
            customer_name: user.given_name && user.family_name 
                ? `${user.given_name} ${user.family_name}` 
                : user.email,
            email: user.email,
            phone_number: user.phone_number || '',
            shipping_address: shippingAddressStr,
            payment_method: 'GCash/Bank Transfer',
            delivery_method: deliveryMethod.value,
            notes: additionalNotes.value.trim() || undefined,
            paper_bag_quantity: paperBagQuantity.value,
            paper_bag_cost: paperBagCost.value
        }

        // Create a temporary order object for stock checking
        // We need to create a mock order with the items to check stock
        const tempOrderForStockCheck: any = {
            items: orderItems,
            user_id: user.id || '',
            order_number: '', // Will be set after order creation
            id: '', // Will be set after order creation
            created_at: Date.now()
        }

        // Check stock availability before creating order
        const { checkStockAvailability } = useInventoryAdjustments()
        const stockCheck = await checkStockAvailability(tempOrderForStockCheck as any)

        if (!stockCheck.success) {
            toast.add({
                title: 'Insufficient Stock',
                description: stockCheck.errors?.join(', ') || 'One or more products are out of stock',
                color: 'error'
            })
            isSubmitting.value = false
            return
        }

        // Create order
        const order = await ordersStore.createOrder(orderInput)

        if (!order) {
            toast.add({
                title: 'Order Failed',
                description: 'Failed to create order. Please try again.',
                color: 'error'
            })
            isSubmitting.value = false
            return
        }

        // Reserve inventory after order is successfully created
        const { reserveInventory } = useInventoryAdjustments()
        const reserveResult = await reserveInventory(order)

        if (!reserveResult.success) {
            // Order was created but inventory reservation failed
            // This is a critical error - we should log it and notify the user
            console.error('Inventory reservation failed after order creation:', reserveResult.errors)
            toast.add({
                title: 'Order Created with Warning',
                description: `Order ${order.order_number} was created, but there was an issue reserving inventory. Please contact support.`,
                color: 'warning'
            })
            // Still redirect to order history, but admin will need to handle this
            router.push('/order-history')
            isSubmitting.value = false
            return
        }

        // Update order with inventory_reserved flag
        const updatedOrder = {
            ...order,
            inventory_reserved: true,
            updated_at: Date.now()
        }
        await ordersStore.updateOrder(updatedOrder)

        // Clear cart only after both order creation and inventory reservation succeed
        await cartStore.clearCart()

        // Show success message
        toast.add({
            title: 'Order Created!',
            description: `Order ${order.order_number} has been created. Please upload payment proof in your order history.`,
            color: 'success'
        })

        // Redirect to order history
        router.push('/order-history')
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

