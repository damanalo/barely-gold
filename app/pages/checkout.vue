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
                    <!-- Payment Instructions (Left Column) -->
                    <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
                        <h2 class="text-2xl font-bold mb-4">Payment Instructions</h2>
                        
                        <div class="space-y-4">
                            <div class="border-l-4 border-primary-600 pl-4 py-2 bg-primary-50">
                                <h3 class="font-semibold text-lg">Pay via GCash</h3>
                                <p class="text-sm text-gray-600">Scan the QR code below to complete your payment</p>
                            </div>

                            <!-- QR Code Placeholder -->
                            <div class="flex justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <div class="text-center">
                                    <div class="w-64 h-64 bg-white flex items-center justify-center rounded-lg shadow-sm mb-4">
                                        <div class="text-gray-400">
                                            <UIcon name="i-heroicons-qr-code" class="w-32 h-32 mb-2" />
                                            <p class="text-sm">GCash QR Code</p>
                                            <p class="text-xs">(To be uploaded)</p>
                                        </div>
                                    </div>
                                    <p class="text-sm text-gray-600">Scan this QR code with your GCash app</p>
                                </div>
                            </div>

                            <!-- Payment Steps -->
                            <div class="space-y-3">
                                <h4 class="font-semibold">How to pay:</h4>
                                <ol class="space-y-2">
                                    <li class="flex items-start gap-3">
                                        <span class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                                        <span class="text-gray-700">Open your GCash app</span>
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <span class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                                        <span class="text-gray-700">Tap "Scan QR" to scan the QR code above</span>
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <span class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                                        <span class="text-gray-700">Verify the amount (₱{{ formatPrice(cartStore.total) }})</span>
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <span class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                                        <span class="text-gray-700">Complete the payment and take a screenshot of the confirmation</span>
                                    </li>
                                    <li class="flex items-start gap-3">
                                        <span class="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm">5</span>
                                        <span class="text-gray-700">Upload your proof of payment below</span>
                                    </li>
                                </ol>
                            </div>

                            <!-- Upload Proof of Payment -->
                            <div class="border-t pt-4">
                                <label class="block font-semibold mb-2">Upload Proof of Payment</label>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/jpg, image/png"
                                    @change="handleFileChange"
                                    class="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-primary-50 file:text-primary-700
                                        hover:file:bg-primary-100
                                        cursor-pointer border border-gray-300 rounded-md"
                                />
                                <p class="text-xs text-gray-500 mt-2">Accepted formats: JPG, JPEG, PNG (Max 5MB)</p>
                            </div>

                            <!-- Submit Button -->
                            <UButton 
                                block 
                                color="primary" 
                                size="lg" 
                                @click="handleSubmitPayment"
                                :disabled="!proofOfPayment"
                            >
                                Submit Payment
                            </UButton>
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

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// Current step in the order process
const currentStep = ref(1) // 1: Payment, 2: Processing, 3: Shipped, 4: Received

// Proof of payment file
const proofOfPayment = ref<File | null>(null)

// Check authentication and cart on mount
onMounted(() => {
    // Redirect if cart is empty
    if (cartStore.items.length === 0) {
        router.push('/')
        return
    }
    
    // Redirect to login if not authenticated
    if (!authStore.isAuthenticated) {
        alert('Please sign in or register to proceed with checkout')
        router.push('/login')
    }
})

const formatPrice = (price: number) => {
    return price.toFixed(2)
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        proofOfPayment.value = target.files[0] || null
    } else {
        proofOfPayment.value = null
    }
}

const handleSubmitPayment = () => {
    if (!proofOfPayment.value) {
        alert('Please upload proof of payment')
        return
    }

    // Check authentication again before submitting
    if (!authStore.isAuthenticated) {
        alert('Please sign in to complete your order')
        router.push('/login')
        return
    }

    // TODO: Upload proof of payment and create order
    console.log('Submitting payment proof:', proofOfPayment.value)
    
    // Show success message (you can add a toast notification here)
    alert('Payment submitted successfully! We will verify your payment and process your order shortly.')
    
    // Clear cart and redirect
    cartStore.clearCart()
    router.push('/')
}
</script>

<style scoped>
/* Add any custom styles here */
</style>

