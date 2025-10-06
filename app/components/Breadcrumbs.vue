<template>
  <nav 
    v-if="shouldShowBreadcrumbs" 
    aria-label="Breadcrumb" 
    class="py-3 border-b border-gray-200 bg-gray-50/50"
  >
    <UContainer>
      <ol class="flex items-center gap-2 text-sm">
        <li 
          v-for="(crumb, index) in breadcrumbs" 
          :key="index"
          class="flex items-center gap-2"
        >
          <!-- Separator (except for first item) -->
          <UIcon 
            v-if="index > 0" 
            name="i-heroicons-chevron-right" 
            class="w-4 h-4 text-gray-400"
          />
          
          <!-- Breadcrumb Link or Text -->
          <NuxtLink
            v-if="crumb.to"
            :to="crumb.to"
            class="text-gray-600 hover:text-primary-600 transition-colors"
          >
            {{ crumb.label }}
          </NuxtLink>
          <span
            v-else
            :class="[
              crumb.active 
                ? 'text-primary-600 font-medium' 
                : 'text-gray-600'
            ]"
          >
            {{ crumb.label }}
          </span>
        </li>
      </ol>
    </UContainer>
  </nav>
</template>

<script setup lang="ts">
import { useBreadcrumbs } from '~/composables/useBreadcrumbs'

const { breadcrumbs, shouldShowBreadcrumbs } = useBreadcrumbs()
</script>

