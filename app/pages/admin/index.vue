<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <UContainer>
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p class="text-gray-600 mt-2">Manage your store and monitor performance</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Orders -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Orders</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">
                {{ ordersStore.loading ? '-' : ordersStore.orderStats.total }}
              </p>
            </div>
            <div class="bg-blue-100 rounded-full p-3">
              <UIcon name="i-heroicons-shopping-bag" class="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Pending Payments -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Pending Payments</p>
              <p class="text-3xl font-bold text-orange-600 mt-2">
                {{ ordersStore.loading ? '-' : ordersStore.orderStats.pendingPayments }}
              </p>
            </div>
            <div class="bg-orange-100 rounded-full p-3">
              <UIcon name="i-heroicons-clock" class="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <!-- Processing Orders -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Processing</p>
              <p class="text-3xl font-bold text-purple-600 mt-2">
                {{ ordersStore.loading ? '-' : ordersStore.orderStats.processing }}
              </p>
            </div>
            <div class="bg-purple-100 rounded-full p-3">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Total Revenue</p>
              <p class="text-3xl font-bold text-green-600 mt-2">
                {{ ordersStore.loading ? '-' : `₱${ordersStore.orderStats.totalRevenue.toFixed(2)}` }}
              </p>
            </div>
            <div class="bg-green-100 rounded-full p-3">
              <UIcon name="i-heroicons-currency-dollar" class="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Cards -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Manage Products Card -->
        <div 
          @click="$router.push('/admin/products')"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-primary-100 rounded-full p-3">
                <UIcon name="i-heroicons-cube" class="w-8 h-8 text-primary-600" />
              </div>
              <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage Products</h3>
            <p class="text-sm text-gray-600">Add, edit, and manage your product catalog</p>
          </div>
          <div class="bg-gray-50 px-6 py-3">
            <span class="text-sm font-medium text-primary-600">View Products →</span>
          </div>
        </div>

        <!-- Manage Categories Card -->
        <div 
          @click="$router.push('/admin/categories/add')"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-indigo-100 rounded-full p-3">
                <UIcon name="i-heroicons-tag" class="w-8 h-8 text-indigo-600" />
              </div>
              <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage Categories</h3>
            <p class="text-sm text-gray-600">Organize your products into categories</p>
          </div>
          <div class="bg-gray-50 px-6 py-3">
            <span class="text-sm font-medium text-indigo-600">View Categories →</span>
          </div>
        </div>

        <!-- Manage Orders Card -->
        <div 
          @click="$router.push('/admin/orders')"
          class="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="bg-green-100 rounded-full p-3">
                <UIcon name="i-heroicons-shopping-cart" class="w-8 h-8 text-green-600" />
              </div>
              <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Manage Orders</h3>
            <p class="text-sm text-gray-600">View and update order status and payments</p>
          </div>
          <div class="bg-gray-50 px-6 py-3">
            <span class="text-sm font-medium text-green-600">View Orders →</span>
          </div>
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

// Fetch all orders for stats on mount
onMounted(async () => {
  await ordersStore.fetchAllOrders()
})
</script>

