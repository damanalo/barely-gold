<template>
  <nav 
    v-if="shouldShowBreadcrumbs" 
    aria-label="Breadcrumb" 
    class="py-4 border-b border-stone-200 bg-white/80 backdrop-blur-sm"
  >
    <UContainer>
      <ol class="flex flex-wrap items-center gap-1 text-sm text-stone-500">
        <li 
          v-for="(crumb, index) in breadcrumbs" 
          :key="index"
          class="flex items-center gap-1"
        >
          <!-- Separator (except for first item) -->
          <UIcon 
            v-if="index > 0" 
            name="i-heroicons-chevron-right" 
            class="w-4 h-4 text-stone-300"
            aria-hidden="true"
          />
          
          <!-- Breadcrumb Link or Text -->
          <NuxtLink
            v-if="crumb.to"
            :to="crumb.to"
            class="px-3 py-1 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            {{ crumb.label }}
          </NuxtLink>
          <span
            v-else
            :aria-current="crumb.active ? 'page' : undefined"
            :class="[
              'px-3 py-1 rounded-full',
              crumb.active 
                ? 'text-[var(--color-gold-700)] bg-[var(--color-gold-50)] font-semibold' 
                : 'text-stone-600'
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

