<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <UContainer>
            <!-- Page Heading -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
                <p class="text-lg text-gray-600">Review your order and complete your purchase</p>
            </div>

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

            <!-- Promotional Discount Banner -->
            <div v-if="promotionalDiscountAmount > 0" class="max-w-6xl mx-auto mb-6">
                <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4 shadow-sm">
                    <div class="flex items-center gap-3">
                        <UIcon name="i-heroicons-sparkles" class="w-6 h-6 text-green-600 flex-shrink-0" />
                        <p class="text-base font-semibold text-green-800">
                            Congratulations! You are one of the first 10 buyers &#8211; enjoy your 10% OFF!
                        </p>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="max-w-6xl mx-auto">
                <div class="flex flex-col md:grid md:grid-cols-3 gap-6">
                    <!-- Order Summary (Right Column) -->
                    <div class="bg-white rounded-lg shadow p-6 h-fit md:sticky md:top-20 order-1 md:row-start-1 md:col-start-3 md:col-span-1">
                        <h3 class="text-lg font-bold mb-4">Order Summary</h3>

                        <div class="space-y-2">
                            <!-- Item Breakdown -->
                            <div v-for="item in cartStore.items" :key="item.id" class="flex justify-between text-sm">
                                <div class="flex flex-col">
                                    <span class="text-gray-600">{{ item.name }} x {{ item.quantity }}</span>
                                    <span class="text-xs text-gray-400">{{ capitalizeFirst(productsStore.getProductById(item.id)?.category) }}</span>
                                </div>
                                <span>₱{{ formatPrice(item.price * item.quantity) }}</span>
                            </div>
                            <div class="border-t border-gray-200 my-2"></div>
                            <div class="flex justify-between text-sm mb-5">
                                <span class="text-gray-600">Subtotal</span>
                                <span>₱{{ formatPrice(cartStore.total) }}</span>
                            </div>
                            <div v-if="promotionalDiscountAmount > 0" class="flex justify-between text-sm text-green-600">
                                <span class="text-gray-600 font-bold">
                                    Promotional Discount (10%)
                                </span>
                                <span class="font-medium">-₱{{ formatPrice(promotionalDiscountAmount) }}</span>
                            </div>
                            <div class="flex justify-between text-sm">
                                <span class="text-gray-600 font-bold">
                                    Shipping ({{ getDeliveryMethodLabel(deliveryMethod) }})
                                    <span v-if="totalItemCount >= 5" class="text-xs text-green-600">(Free for 5+ items)</span>
                                </span>
                                <span :class="shippingCost === 0 ? 'text-green-600 font-medium' : ''">
                                    {{ shippingCost === 0 ? 'FREE' : `₱${formatPrice(shippingCost)}` }}
                                </span>
                            </div>
                            <div v-if="paperBagQuantity > 0" class="flex justify-between text-sm">
                                <span class="text-gray-600 font-bold">
                                    Paper Bag{{ paperBagQuantity > 1 ? ` (x${paperBagQuantity})` : '' }}
                                </span>
                                <span :class="paperBagCost === 0 ? 'text-green-600 font-medium' : ''">
                                    {{ paperBagCost === 0 ? 'FREE' : `₱${formatPrice(paperBagCost)}` }}
                                </span>
                            </div>
                        </div>

                        <div class="border-t my-4"></div>

                        <div class="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span class="text-primary-600">₱{{ formatPrice(orderTotal) }}</span>
                        </div>

                    </div>

                    <!-- Order Details Form (Left Column) -->
                    <div class="bg-white rounded-lg shadow p-6 order-2 md:row-start-1 md:col-start-1 md:col-span-2">
                        <h2 class="text-2xl font-bold mb-4">Complete Your Order</h2>
                        
                        <div class="space-y-6">
                            <!-- Delivery Method Selection -->
                            <div ref="deliveryMethodRef">
                                <h3 class="font-semibold text-lg mb-3">Delivery Method</h3>
                                <div class="space-y-3">
                                    <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="deliveryMethod === 'meet_up' ? 'border-primary-600 bg-primary-50' : fieldErrors.deliveryMethod ? 'border-red-500' : 'border-gray-200'">
                                        <input
                                            v-model="deliveryMethod"
                                            type="radio"
                                            value="meet_up"
                                            class="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500"
                                            @change="fieldErrors.deliveryMethod = ''"
                                        />
                                        <div class="flex-1">
                                            <span class="font-medium text-gray-900">Meet up</span>
                                            <p class="text-sm text-gray-500">
                                                <span class="font-medium">Meet up locations:</span> McDonalds Lipa Cathedral or Jollibee Levitown.
                                                Please contact us at our official social media pages &#8211;
                                                <NuxtLink to="https://www.facebook.com/BarelyGoldPH" target="_blank" class="text-primary-600 underline hover:text-primary-700">Facebook</NuxtLink>
                                                or
                                                <NuxtLink to="https://www.instagram.com/barely.gold/" target="_blank" class="text-primary-600 underline hover:text-primary-700">Instagram</NuxtLink>
                                                to arrange a meet up schedule.
                                            </p>
                                        </div>
                                    </label>
                                    <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="deliveryMethod === 'pick_up' ? 'border-primary-600 bg-primary-50' : fieldErrors.deliveryMethod ? 'border-red-500' : 'border-gray-200'">
                                        <input
                                            v-model="deliveryMethod"
                                            type="radio"
                                            value="pick_up"
                                            class="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500"
                                            @change="fieldErrors.deliveryMethod = ''"
                                        />
                                        <div class="flex-1">
                                            <span class="font-medium text-gray-900">Pickup</span>
                                            <p class="text-sm text-gray-500">
                                                <span class="font-medium">Pickup locations:</span> Lipa City District Hospital or Grove Park Malvar.
                                                Please contact us at our official social media pages &#8211;
                                                <NuxtLink to="https://www.facebook.com/BarelyGoldPH" target="_blank" class="text-primary-600 underline hover:text-primary-700">Facebook</NuxtLink>
                                                or
                                                <NuxtLink to="https://www.instagram.com/barely.gold/" target="_blank" class="text-primary-600 underline hover:text-primary-700">Instagram</NuxtLink>
                                                to arrange a pickup schedule.
                                            </p>
                                        </div>
                                    </label>
                                    <label class="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" :class="deliveryMethod === 'ship_via_jt' ? 'border-primary-600 bg-primary-50' : fieldErrors.deliveryMethod ? 'border-red-500' : 'border-gray-200'">
                                        <input
                                            v-model="deliveryMethod"
                                            type="radio"
                                            value="ship_via_jt"
                                            class="mr-3 w-4 h-4 text-primary-600 focus:ring-primary-500"
                                            @change="fieldErrors.deliveryMethod = ''"
                                        />
                                        <div class="flex-1">
                                            <span class="font-medium text-gray-900">Ship via J&T</span>
                                            <p class="text-sm text-gray-500">Ship to your address via J&T Express</p>
                                        </div>
                                    </label>
                                </div>
                                <p v-if="fieldErrors.deliveryMethod" class="mt-2 text-sm text-red-600">
                                    {{ fieldErrors.deliveryMethod }}
                                </p>
                            </div>

                            <!-- Free Shipping Information (Conditional - Only for Ship via J&T) -->
                            <div v-if="deliveryMethod === 'ship_via_jt'">
                                <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div class="text-sm text-blue-800">
                                            <p class="font-medium mb-1">How to get a free shipping fee:</p>
                                            <ul class="list-disc list-outside pl-5 space-y-1 text-blue-700">
                                                <li class="pl-1">Orders with 5 or more items qualify for free shipping</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Shipping Address Section (Conditional) -->
                            <div v-if="deliveryMethod === 'ship_via_jt'" ref="shippingAddressRef">
                                <h3 class="font-semibold text-lg mb-3">Shipping Address</h3>
                                <div class="space-y-4">
                                    <div ref="nameRef">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input
                                            v-model="shippingAddress.name"
                                            type="text"
                                            placeholder="Full name"
                                            :class="[
                                                'w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors',
                                                fieldErrors.shippingAddress.name 
                                                    ? 'border-red-500 focus:ring-red-500' 
                                                    : 'border-gray-300 focus:ring-primary-600'
                                            ]"
                                            required
                                            @input="fieldErrors.shippingAddress.name = ''"
                                        />
                                        <p v-if="fieldErrors.shippingAddress.name" class="mt-1 text-sm text-red-600">
                                            {{ fieldErrors.shippingAddress.name }}
                                        </p>
                                    </div>
                                    <div ref="contactNumberRef">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                                        <input
                                            v-model="shippingAddress.contact_number"
                                            type="tel"
                                            placeholder="09XXXXXXXXX (11 digits)"
                                            maxlength="11"
                                            :class="[
                                                'w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors',
                                                fieldErrors.shippingAddress.contact_number 
                                                    ? 'border-red-500 focus:ring-red-500' 
                                                    : 'border-gray-300 focus:ring-primary-600'
                                            ]"
                                            required
                                            @input="(e) => {
                                                const value = (e.target as HTMLInputElement).value
                                                const numericValue = filterNumericOnly(value)
                                                // Limit to 11 digits
                                                shippingAddress.contact_number = numericValue.slice(0, 11)
                                                fieldErrors.shippingAddress.contact_number = ''
                                            }"
                                        />
                                        <p v-if="fieldErrors.shippingAddress.contact_number" class="mt-1 text-sm text-red-600">
                                            {{ fieldErrors.shippingAddress.contact_number }}
                                        </p>
                                        <p class="mt-1 text-xs text-gray-500">Format: 09XXXXXXXXX (11 digits, starts with 09)</p>
                                    </div>
                                    <div ref="streetAddressRef">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                                        <input
                                            v-model="shippingAddress.street"
                                            type="text"
                                            placeholder="House no., Street name"
                                            :class="[
                                                'w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors',
                                                fieldErrors.shippingAddress.street 
                                                    ? 'border-red-500 focus:ring-red-500' 
                                                    : 'border-gray-300 focus:ring-primary-600'
                                            ]"
                                            required
                                            @input="fieldErrors.shippingAddress.street = ''"
                                        />
                                        <p v-if="fieldErrors.shippingAddress.street" class="mt-1 text-sm text-red-600">
                                            {{ fieldErrors.shippingAddress.street }}
                                        </p>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div ref="cityRef">
                                            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                                            <input
                                                v-model="shippingAddress.city"
                                                type="text"
                                                placeholder="City"
                                                :class="[
                                                    'w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors',
                                                    fieldErrors.shippingAddress.city 
                                                        ? 'border-red-500 focus:ring-red-500' 
                                                        : 'border-gray-300 focus:ring-primary-600'
                                                ]"
                                                required
                                                @input="fieldErrors.shippingAddress.city = ''"
                                            />
                                            <p v-if="fieldErrors.shippingAddress.city" class="mt-1 text-sm text-red-600">
                                                {{ fieldErrors.shippingAddress.city }}
                                            </p>
                                        </div>
                                        <div ref="provinceRef">
                                            <label class="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                                            <input
                                                v-model="shippingAddress.province"
                                                type="text"
                                                placeholder="Province"
                                                :class="[
                                                    'w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors',
                                                    fieldErrors.shippingAddress.province 
                                                        ? 'border-red-500 focus:ring-red-500' 
                                                        : 'border-gray-300 focus:ring-primary-600'
                                                ]"
                                                required
                                                @input="fieldErrors.shippingAddress.province = ''"
                                            />
                                            <p v-if="fieldErrors.shippingAddress.province" class="mt-1 text-sm text-red-600">
                                                {{ fieldErrors.shippingAddress.province }}
                                            </p>
                                        </div>
                                    </div>
                                    <div ref="postalCodeRef">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                        <input
                                            v-model="shippingAddress.postal_code"
                                            type="text"
                                            placeholder="Postal Code"
                                            :class="[
                                                'w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-transparent transition-colors',
                                                fieldErrors.shippingAddress.postal_code 
                                                    ? 'border-red-500 focus:ring-red-500' 
                                                    : 'border-gray-300 focus:ring-primary-600'
                                            ]"
                                            @input="(e) => {
                                                const value = (e.target as HTMLInputElement).value
                                                shippingAddress.postal_code = filterNumericOnly(value)
                                                fieldErrors.shippingAddress.postal_code = ''
                                            }"
                                        />
                                        <p v-if="fieldErrors.shippingAddress.postal_code" class="mt-1 text-sm text-red-600">
                                            {{ fieldErrors.shippingAddress.postal_code }}
                                        </p>
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

                            <!-- Paper Bag Section -->
                            <div>
                                <h3 class="font-semibold text-lg mb-3">Paper Bag</h3>
                                
                                <img 
                                    :src="getImageUrl('misc/bg-packaging.jpg')" 
                                    alt="Paper bag packaging" 
                                    class="max-w-[50%] w-full mx-auto rounded-lg mb-4 object-cover"
                                />
                                
                                <!-- Information about free paper bag -->
                                <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div class="flex items-start gap-2">
                                        <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <div class="text-sm text-blue-800">
                                            <p class="font-medium mb-1">How to get a free paper bag:</p>
                                            <ul class="list-disc list-outside pl-5 space-y-1 text-blue-700">
                                                <li class="pl-1">Orders with 4 or more items automatically get a free paper bag (1 bag per 4 items)</li>
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


                            <div class="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800 flex items-start gap-2">
                                <UIcon name="i-heroicons-information-circle" class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <span>Your order will be processed after payment verification</span>
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
                                {{ isSubmitting ? 'Processing...' : 'Proceed to Payment' }}
                            </UButton>

                            <p class="text-xs text-gray-500 text-center">
                                By confirming this order, you agree to our 
                                <NuxtLink to="/terms-and-conditions" class="text-primary-600 hover:text-primary-700 underline">
                                    terms and conditions
                                </NuxtLink>
                            </p>
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
import formatPrice from '~/utils/format-price'

definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const productsStore = useProductsStore()
const config = useRuntimeConfig()

// Current step in the order process
const currentStep = ref(1) // 1: Payment, 2: Processing, 3: Shipped, 4: Received

// Delivery method selection
const deliveryMethod = ref<'meet_up' | 'pick_up' | 'ship_via_jt'>('meet_up')

// Shipping address form
const shippingAddress = ref({
    name: '',
    contact_number: '',
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

// Field errors state management
const fieldErrors = reactive({
    deliveryMethod: '',
    shippingAddress: {
        name: '',
        contact_number: '',
        street: '',
        city: '',
        province: '',
        postal_code: ''
    }
})

// Helper function to clear all field errors
const clearAllErrors = () => {
    fieldErrors.deliveryMethod = ''
    fieldErrors.shippingAddress.name = ''
    fieldErrors.shippingAddress.contact_number = ''
    fieldErrors.shippingAddress.street = ''
    fieldErrors.shippingAddress.city = ''
    fieldErrors.shippingAddress.province = ''
    fieldErrors.shippingAddress.postal_code = ''
}

// Helper function to clear shipping address errors
const clearShippingAddressErrors = () => {
    fieldErrors.shippingAddress.name = ''
    fieldErrors.shippingAddress.contact_number = ''
    fieldErrors.shippingAddress.street = ''
    fieldErrors.shippingAddress.city = ''
    fieldErrors.shippingAddress.province = ''
    fieldErrors.shippingAddress.postal_code = ''
}

// Template refs for scrolling to error fields
const deliveryMethodRef = ref<HTMLElement | null>(null)
const shippingAddressRef = ref<HTMLElement | null>(null)
const nameRef = ref<HTMLElement | null>(null)
const contactNumberRef = ref<HTMLElement | null>(null)
const streetAddressRef = ref<HTMLElement | null>(null)
const cityRef = ref<HTMLElement | null>(null)
const provinceRef = ref<HTMLElement | null>(null)
const postalCodeRef = ref<HTMLElement | null>(null)

// Helper function to check if a string contains only numbers
const isNumericOnly = (value: string): boolean => {
    return /^\d+$/.test(value)
}

// Helper function to filter out non-numeric characters
const filterNumericOnly = (value: string): string => {
    return value.replace(/\D/g, '')
}

// Helper function to validate Philippines mobile number format
// Valid formats: 09XXXXXXXXX (11 digits starting with 09)
const isValidPhilippinesMobileNumber = (value: string): boolean => {
    // Must be exactly 11 digits and start with 09
    return /^09\d{9}$/.test(value)
}

// Function to scroll to the first field with an error
const scrollToFirstError = () => {
    // Use nextTick to ensure DOM is updated with error messages
    nextTick(() => {
        // Check delivery method error first
        if (fieldErrors.deliveryMethod && deliveryMethodRef.value) {
            deliveryMethodRef.value.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            })
            return
        }

        // Check shipping address errors (only if ship_via_jt is selected)
        if (deliveryMethod.value === 'ship_via_jt') {
            if (fieldErrors.shippingAddress.name && nameRef.value) {
                nameRef.value.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                })
                return
            }
            if (fieldErrors.shippingAddress.contact_number && contactNumberRef.value) {
                contactNumberRef.value.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                })
                return
            }
            if (fieldErrors.shippingAddress.street && streetAddressRef.value) {
                streetAddressRef.value.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                })
                return
            }
            if (fieldErrors.shippingAddress.city && cityRef.value) {
                cityRef.value.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                })
                return
            }
            if (fieldErrors.shippingAddress.province && provinceRef.value) {
                provinceRef.value.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                })
                return
            }
            if (fieldErrors.shippingAddress.postal_code && postalCodeRef.value) {
                postalCodeRef.value.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                })
                return
            }
        }
    })
}

// Watch delivery method changes to clear shipping address errors when switching away from ship_via_jt
watch(deliveryMethod, (newMethod) => {
    if (newMethod !== 'ship_via_jt') {
        clearShippingAddressErrors()
    }
    // Clear delivery method error when user selects a method
    fieldErrors.deliveryMethod = ''
})

// Check authentication and cart on mount
onMounted(async () => {
    // Redirect if cart is empty
    if (cartStore.items.length === 0) {
        router.push('/')
        return
    }
    
    // Auth middleware will handle authentication redirect
    // Just ensure products are loaded for category lookups
    if (productsStore.products.length === 0) {
        await productsStore.fetchProducts()
    }
})


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
        return Math.max(1, Math.floor(totalItemCount.value / 4))
    }
    if (totalItemCount.value >= 4) {
        // 4+ items get free bags (1 bag per 4 items)
        return Math.floor(totalItemCount.value / 4)
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

// Check if promotional discount should be applied
const applyPromotionalDiscount = computed(() => {
    const flagValue = config.public.apply10Discount as string | undefined
    return flagValue === 'true' || flagValue === 'True'
})

// Calculate promotional discount amount (10% of subtotal)
const promotionalDiscountAmount = computed(() => {
    if (applyPromotionalDiscount.value) {
        return cartStore.total * 0.1
    }
    return 0
})

// Calculate discounted subtotal (subtotal minus promotional discount)
const discountedSubtotal = computed(() => {
    return cartStore.total - promotionalDiscountAmount.value
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

// Calculate order total including shipping and paper bag (using discounted subtotal)
const orderTotal = computed(() => {
    return discountedSubtotal.value + shippingCost.value + paperBagCost.value
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

// Capitalize first letter of a string
const capitalizeFirst = (str: string | undefined): string => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const handleSubmitOrder = async () => {
    // Clear previous errors
    clearAllErrors()

    // Auth middleware ensures user is authenticated, but double-check for safety
    if (!authStore.isAuthenticated) {
        toast.add({
            title: 'Authentication Required',
            description: 'Please create an account to complete your order',
            color: 'error'
        })
        return
    }

    // Validate delivery method (always required)
    if (!deliveryMethod.value) {
        fieldErrors.deliveryMethod = 'Please select a delivery method'
        scrollToFirstError()
        return
    }

    // Validate shipping address only if Ship via J&T is selected
    if (deliveryMethod.value === 'ship_via_jt') {
        let hasErrors = false

        if (!shippingAddress.value.name || !shippingAddress.value.name.trim()) {
            fieldErrors.shippingAddress.name = 'Name is required'
            hasErrors = true
        }

        if (!shippingAddress.value.contact_number || !shippingAddress.value.contact_number.trim()) {
            fieldErrors.shippingAddress.contact_number = 'Mobile number is required'
            hasErrors = true
        } else if (!isNumericOnly(shippingAddress.value.contact_number)) {
            fieldErrors.shippingAddress.contact_number = 'Mobile number must contain only numbers'
            hasErrors = true
        } else if (!isValidPhilippinesMobileNumber(shippingAddress.value.contact_number)) {
            fieldErrors.shippingAddress.contact_number = 'Please enter a valid Philippines mobile number (09XXXXXXXXX - 11 digits starting with 09)'
            hasErrors = true
        }

        if (!shippingAddress.value.street || !shippingAddress.value.street.trim()) {
            fieldErrors.shippingAddress.street = 'Street address is required'
            hasErrors = true
        }

        if (!shippingAddress.value.city || !shippingAddress.value.city.trim()) {
            fieldErrors.shippingAddress.city = 'City is required'
            hasErrors = true
        }

        if (!shippingAddress.value.province || !shippingAddress.value.province.trim()) {
            fieldErrors.shippingAddress.province = 'Province is required'
            hasErrors = true
        }

        // Validate postal code if provided (optional field, but must be numeric if filled)
        if (shippingAddress.value.postal_code && shippingAddress.value.postal_code.trim()) {
            if (!isNumericOnly(shippingAddress.value.postal_code)) {
                fieldErrors.shippingAddress.postal_code = 'Postal code must contain only numbers'
                hasErrors = true
            }
        }

        if (hasErrors) {
            scrollToFirstError()
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
            paper_bag_cost: paperBagCost.value,
            promotional_discount_amount: promotionalDiscountAmount.value > 0 ? promotionalDiscountAmount.value : undefined
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

// Set page title
useHead({
    title: 'Checkout | Barely Gold'
})
</script>

<style scoped>
/* Add any custom styles here */
</style>

