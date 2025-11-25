<template>
    <div class="min-h-screen bg-gray-50 py-8">
        <UContainer>
            <div class="max-w-4xl mx-auto">
                <!-- Back Button -->
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-arrow-left"
                    @click="$router.back()"
                    class="mb-6"
                >
                    Back
                </UButton>

                <!-- Terms Content -->
                <div class="bg-white rounded-lg shadow p-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
                    
                    <div class="prose max-w-none space-y-6">
                        <p class="text-sm text-gray-500 mb-8">
                            Last updated: {{ new Date().toLocaleDateString() }}
                        </p>

                        <!-- Ordering -->
                        <section>
                            <h2 class="text-xl font-semibold text-gray-900 mb-3">1. Ordering</h2>
                            <p class="text-gray-700 mb-2">
                                By placing an order with Barely Gold, you agree to these terms and conditions. All orders are subject to product availability and acceptance by Barely Gold.
                            </p>
                            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li>Orders are confirmed once payment is verified</li>
                                <li>You will receive an order confirmation via email</li>
                                <li>We reserve the right to cancel any order at our discretion</li>
                            </ul>
                        </section>

                        <!-- Payment -->
                        <section>
                            <h2 class="text-xl font-semibold text-gray-900 mb-3">2. Payment</h2>
                            <p class="text-gray-700 mb-2">
                                Payment must be made using the methods specified during checkout. Your order will not be processed until payment has been verified.
                            </p>
                            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li>We accept GCash and bank transfers (BDO)</li>
                                <li>Payment proof must be uploaded within 24 hours of order placement</li>
                                <li>Orders may be cancelled if payment is not verified within 3 business days</li>
                                <li>All prices are in Philippine Peso (₱)</li>
                            </ul>
                        </section>

                        <!-- Delivery -->
                        <section>
                            <h2 class="text-xl font-semibold text-gray-900 mb-3">3. Delivery</h2>
                            <p class="text-gray-700 mb-2">
                                We offer multiple delivery options to suit your needs:
                            </p>
                            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li><strong>Meet up:</strong> We will arrange a meeting location at a mutually convenient time</li>
                                <li><strong>Pick up:</strong> You may pick up your order from our designated location</li>
                                <li><strong>Ship via J&T:</strong> Orders will be shipped via J&T Express to the address provided</li>
                            </ul>
                            <p class="text-gray-700 mt-3">
                                Delivery times vary based on the selected method and order processing time. We will notify you once your order has been shipped.
                            </p>
                        </section>

                        <!-- Returns and Refunds -->
                        <section>
                            <h2 class="text-xl font-semibold text-gray-900 mb-3">4. Returns and Refunds</h2>
                            <p class="text-gray-700 mb-2">
                                Due to the nature of our products, we have the following return policy:
                            </p>
                            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li>Returns are accepted within 7 days of delivery</li>
                                <li>Items must be in original condition, unused, and with all tags attached</li>
                                <li>Refunds will be processed within 5-10 business days</li>
                                <li>Custom or personalized items are not eligible for return</li>
                            </ul>
                        </section>

                        <!-- Product Information -->
                        <section>
                            <h2 class="text-xl font-semibold text-gray-900 mb-3">5. Product Information</h2>
                            <p class="text-gray-700 mb-2">
                                We strive to provide accurate product descriptions and images. However:
                            </p>
                            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
                                <li>Colors may vary slightly due to screen settings</li>
                                <li>Product dimensions are approximate</li>
                                <li>We reserve the right to update product information at any time</li>
                            </ul>
                        </section>

                        <!-- Limitation of Liability -->
                        <section>
                            <h2 class="text-xl font-semibold text-gray-900 mb-3">6. Limitation of Liability</h2>
                            <p class="text-gray-700">
                                Barely Gold shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or services.
                            </p>
                        </section>

                        <!-- Contact Information -->
                        <section>
                            <h2 class="text-xl font-semibold text-gray-900 mb-3">7. Contact Us</h2>
                            <p class="text-gray-700">
                                If you have any questions about these Terms and Conditions, please contact us through your account settings or via the contact information provided in your order confirmation.
                            </p>
                        </section>
                    </div>

                    <div class="mt-8 pt-6 border-t border-gray-200">
                        <p class="text-sm text-gray-500">
                            By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                        </p>
                    </div>
                </div>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
/* Additional styling if needed */
</style>
