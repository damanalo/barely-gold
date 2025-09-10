<script setup lang="ts">
// Import the banner image explicitly
import bannerUrl from '~/assets/images/banner.jpeg'

// Import all other images in assets/images except banner
const allImages = import.meta.glob('~/assets/images/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

// Filter out the banner image and take first 6 images
const gridImages = Object
  .entries(allImages)
  .filter(([path]) => !path.endsWith('/banner.jpeg'))
  .slice(0, 6)
  .map(([, url]) => url)
</script>

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
    <UContainer class="py-12">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-semibold">Gallery</h2>
        <p class="text-gray-500">A curated selection from our collection</p>
      </div>

      <div class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
          <div v-for="(src, idx) in gridImages" :key="idx" class="w-full sm:w-[320px]">
            <UCard>
              <img :src="src" alt="Gallery image" class="w-full h-48 object-cover rounded-md" />
            </UCard>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
section {
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
</style>
