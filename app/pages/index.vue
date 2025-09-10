<script setup lang="ts">
// Import the banner image explicitly
import bannerUrl from '~/assets/images/banner.jpeg'

// Curated selection (static)
import bangleUrl from '~/assets/images/bangle.jpeg?url'
import braceletUrl from '~/assets/images/bracelet.jpeg?url'
import earringsUrl from '~/assets/images/earrings.jpeg?url'
import necklaceUrl from '~/assets/images/necklace.jpeg?url'
import ringUrl from '~/assets/images/ring.jpeg?url'
import setsUrl from '~/assets/images/sets.jpeg?url'

const curatedImages = [
  bangleUrl,
  braceletUrl,
  earringsUrl,
  necklaceUrl,
  ringUrl,
  setsUrl
]
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
    <section
      class="py-12"
      :style="{ background: 'linear-gradient(180deg, var(--color-gold-100) 0%, var(--color-gold-50) 60%, #FAFAF9 100%)' }"
    >
      <UContainer>
        <div class="text-center mb-8">
          <h2 class="text-2xl font-semibold">Gallery</h2>
          <p class="text-gray-500">A curated selection from our collection</p>
        </div>

        <div class="mx-auto max-w-6xl">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            <div v-for="(src, idx) in curatedImages" :key="idx" class="w-full sm:w-[320px] group cursor-pointer">
              <div class="rounded-md overflow-hidden shadow-sm ring-1 ring-transparent transition duration-500 ease-in-out hover:shadow-md hover:ring-[var(--color-gold-300)] hover:ring-offset-1 hover:ring-offset-white hover-gold-glow">
                <img :src="src" alt="Gallery image" class="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.04] group-hover:brightness-105" />
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<style scoped>
section {
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}
</style>
