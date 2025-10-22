<template>
  <UContainer class="py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

      <!-- Coming Soon State -->
      <UCard>
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <UIcon 
            name="i-heroicons-clipboard-document-list" 
            class="w-24 h-24 text-gray-300 dark:text-gray-600 mb-6" 
          />
          <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Order History Coming Soon
          </h2>
          <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            We're working on bringing you a comprehensive order history feature. 
            Soon you'll be able to view all your past orders, track shipments, and download invoices.
          </p>
          <UButton @click="navigateTo('/')" color="primary">
            Continue Shopping
          </UButton>
        </div>
      </UCard>

      <!-- Placeholder for future order table structure -->
      <!-- 
      <div class="space-y-4">
        <UCard v-for="order in orders" :key="order.id">
          Order details will go here
        </UCard>
      </div>
      -->
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

