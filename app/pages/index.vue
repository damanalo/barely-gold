<template>
  <div>
    <!-- Parallax Hero -->
    <section
      class="relative min-h-[65vh] flex items-center justify-center text-center text-white"
      :style="{ backgroundImage: `url(${bannerUrl})`, backgroundPosition: 'center 70%' }"
    >
      <div class="absolute inset-0 bg-black/40"></div>
      <div class="relative z-10">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow">Barely Gold</h1>
        <p class="mt-4 text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
          Discover crafted pieces with a modern aesthetic.
        </p>
        <div class="mt-8 flex items-center justify-center gap-3">
          <UButton color="primary" size="lg" icon="i-heroicons-eye">Explore</UButton>
          <UButton variant="ghost" size="lg" icon="i-heroicons-heart">Favorites</UButton>
        </div>
      </div>

      <!-- Parallax effect -->
      <div class="absolute inset-0 bg-fixed bg-cover bg-center" :style="{ backgroundImage: `url(${bannerUrl})`, backgroundPosition: 'center 70%' }"></div>
    </section>

    <!-- Image Grid -->
    <section
      id="products"
      class="py-12"
      :style="{ background: 'linear-gradient(180deg, var(--color-gold-150) 0%, var(--color-gold-50) 60%, #FAFAF9 100%)' }"
    >
      <UContainer>
        <div class="text-center mb-8">
          <h2 class="text-2xl font-semibold text-white">Gallery</h2>
          <p class="text-white/85">A curated selection from our collection</p>
        </div>

        <div class="mx-auto max-w-6xl">
          <!-- Loading Skeleton -->
          <div v-if="categoriesStore.loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            <div 
              v-for="i in 6" 
              :key="`skeleton-${i}`"
              class="w-full sm:w-[320px]"
            >
              <div class="relative rounded-md overflow-hidden shadow-sm">
                <USkeleton class="w-full h-48" />
              </div>
            </div>
          </div>

          <!-- Categories Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            <NuxtLink 
              v-for="category in categories" 
              :key="category.id" 
              :to="`/products?category=${category.id}`"
              class="w-full sm:w-[320px] group"
            >
              <div class="relative rounded-md overflow-hidden shadow-sm ring-1 ring-transparent transition duration-500 ease-in-out hover:shadow-md hover:ring-[var(--color-gold-300)] hover:ring-offset-1 hover:ring-offset-white hover-gold-glow">
                <img :src="category.image" :alt="category.name" class="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.04]" />
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-center justify-center" style="background-color: rgba(46, 36, 12, 0.35); backdrop-filter: blur(1.5px);">
                  <div class="text-center">
                    <span class="text-white/95 text-lg font-semibold tracking-wide drop-shadow">{{ category.name }}</span>
                    <div class="mx-auto mt-2 h-[2px] w-12 rounded-full" :style="{ background: 'linear-gradient(90deg, var(--color-gold-400), var(--color-gold-600))' }"></div>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCategoriesStore } from '~/stores/categories'

const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()

onMounted(async () => {
    await categoriesStore.fetchCategories()
    await authStore.checkAuthStatus();
})

// Import the banner image explicitly
import bannerUrl from '~/assets/images/banner.jpeg'

// Create computed property for categories
const categories = computed(() => categoriesStore.categories)
</script>

<style scoped>
section {
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
</style>
