<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const authStore = useAuthStore()
await authStore.checkAuthStatus();

const cartStore = useCartStore()

// Demo function to add items to cart
const addToCart = (itemName: string, price: number, image?: string) => {
  cartStore.addItem({
    id: `${itemName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
    name: itemName,
    price,
    image
  })
  cartStore.openCart()
}

// Import the banner image explicitly
import bannerUrl from '~/assets/images/banner.jpeg'

// Curated selection (static)
import bangleUrl from '~/assets/images/bangle.jpeg?url'
import braceletUrl from '~/assets/images/bracelet.jpeg?url'
import earringsUrl from '~/assets/images/earrings.jpeg?url'
import necklaceUrl from '~/assets/images/necklace.jpeg?url'
import ringUrl from '~/assets/images/ring.jpeg?url'
import setsUrl from '~/assets/images/sets.jpeg?url'

type CuratedItem = { src: string; label: string }

const curatedItems: CuratedItem[] = [
  { src: bangleUrl, label: 'Bangle' },
  { src: braceletUrl, label: 'Bracelet' },
  { src: earringsUrl, label: 'Earrings' },
  { src: necklaceUrl, label: 'Necklace' },
  { src: ringUrl, label: 'Ring' },
  { src: setsUrl, label: 'Sets' }
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
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 place-items-center">
            <div v-for="(item, idx) in curatedItems" :key="idx" class="w-full sm:w-[320px] group">
              <div class="relative rounded-md overflow-hidden shadow-sm ring-1 ring-transparent transition duration-500 ease-in-out hover:shadow-md hover:ring-[var(--color-gold-300)] hover:ring-offset-1 hover:ring-offset-white hover-gold-glow">
                <img :src="item.src" :alt="item.label" class="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.04]" />
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out flex items-center justify-center" style="background-color: rgba(46, 36, 12, 0.35); backdrop-filter: blur(1.5px);">
                  <div class="text-center">
                    <span class="text-white/95 text-lg font-semibold tracking-wide drop-shadow">{{ item.label }}</span>
                    <div class="mx-auto mt-2 h-[2px] w-12 rounded-full" :style="{ background: 'linear-gradient(90deg, var(--color-gold-400), var(--color-gold-600))' }"></div>
                    <UButton 
                      @click.stop="addToCart(item.label, 299.99, item.src)" 
                      color="primary" 
                      size="sm" 
                      class="mt-3"
                      icon="i-heroicons-shopping-cart"
                    >
                      Add to Cart
                    </UButton>
                  </div>
                </div>
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
