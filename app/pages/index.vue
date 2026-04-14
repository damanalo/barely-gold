<template>
  <div class="bg-champagne-50 text-stone-900">

    <!-- Hero -->
    <section id="hero" class="relative overflow-hidden text-white reveal-section">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[#f9e1c3]"></div>
        <div
          class="absolute inset-y-0 right-[-10%] w-[70%]"
          :style="{ backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center 60%' }"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-t from-onyx-950/90 via-transparent to-transparent"></div>
        <div class="absolute inset-0 hero-noise"></div>
      </div>

      <UContainer class="relative z-10 py-20 md:py-28">
        <div class="grid gap-12 md:grid-cols-[1.15fr_0.85fr] items-center">
          <div>
            <div class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs tracking-[0.4em] uppercase text-gold-light">
              Barely Gold. Clearly Bold.
              <span class="inline-flex h-2 w-2 rounded-full bg-gold-400"></span>
            </div>
            <h1 class="mt-6 text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight drop-shadow-lg text-[#c59042]">
              Where Elegance Meets Everyday.
            </h1>
            <p class="mt-5 text-lg text-[#c59042] max-w-2xl">
              Shine every day with pieces made to complement you.
            </p>

            <div class="mt-10 flex flex-wrap gap-4">
              <UButton size="lg" color="primary" icon="i-heroicons-sparkles" @click="navigateTo('/products')" class="uppercase tracking-wide">
                Shop now
              </UButton>
            </div>

            <div class="mt-12 grid grid-cols-2 gap-6 text-left text-[#c59042]">
              <div class="glass-stat shadow-lg">
                <p class="text-4xl font-semibold text-[#8b5200]">400+</p>
                <p class="text-xs uppercase tracking-[0.4em] text-[#8b5200]">Designs</p>
              </div>
              <div class="glass-stat shadow-lg">
                <p class="text-4xl font-semibold text-[#8b5200]">800+</p>
                <p class="text-xs uppercase tracking-[0.4em] text-[#8b5200]">Pieces Sold</p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Collections -->
    <section id="collections" class="pt-20 pb-15 bg-gradient-to-b from-white via-champagne-25 to-rose-mist reveal-section">
      <UContainer>
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p class="eyebrow text-stone-500">Curated Collections</p>
            <h2 class="display-heading text-[#c59042]">Discover your signature glow.</h2>
            <p class="section-copy">
              Shop by mood or occasion—each curation highlights the metals, textures, and silhouettes our stylists reach for daily.
            </p>
          </div>
          <div class="flex gap-3">
            <UButton color="primary" variant="soft" icon="i-heroicons-arrow-right" @click="navigateTo('/products')">
              View all products
            </UButton>
          </div>
        </div>

        <div class="mx-auto max-w-6xl">
          <div v-if="categoriesStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="i in 6"
              :key="`skeleton-${i}`"
              class="collection-card loading"
            >
              <USkeleton class="h-64 w-full rounded-[28px]" />
              <div class="mt-5 space-y-3">
                <USkeleton class="h-4 w-1/3" />
                <USkeleton class="h-3 w-2/3" />
              </div>
            </div>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="collection in enrichedCollections"
              :key="collection.id"
              :to="`/products?category=${collection.id}`"
              class="collection-card group"
            >
              <div class="relative overflow-hidden rounded-[28px]">
                <img
                  :src="collection.image"
                  :alt="collection.name"
                  class="h-64 w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-onyx-950/80 via-onyx-900/20 to-transparent opacity-95"></div>
                <div class="absolute inset-x-0 bottom-0 p-6 text-white collection-caption">
                  <div class="flex flex-wrap items-start justify-between gap-3 text-white/90">
                    <div>
                      <p class="text-xs uppercase tracking-[0.35em] text-white/80 drop-shadow-xl">Collection</p>
                      <h3 class="text-2xl font-semibold drop-shadow-2xl">{{ collection.name }}</h3>
                    </div>
                    <span class="text-sm self-end font-semibold drop-shadow-2xl text-white">From {{ collection.priceFrom }}</span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Promise -->
    <section id="promise" class="py-15 bg-white reveal-section">
      <UContainer>
        <div class="mb-14 text-right">
          <h2 class="display-heading text-[#c59042]">Elegance without compromise.</h2>
          <p class="section-copy ml-auto">
            Designed for everyday ease yet polished enough for celebrations—crafted with premium finishes rooted in our champagne-gold palette.
          </p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <div v-for="(value, index) in brandValues" :key="value.title" class="promise-card" :style="{ transitionDelay: `${index * 60}ms` }">
            <div class="promise-icon" :class="value.tint">
              <UIcon :name="value.icon" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-semibold text-stone-900 mt-4">{{ value.title }}</h3>
            <p class="text-stone-600 mt-2">{{ value.copy }}</p>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Trust & Testimonials -->
    <section id="trust" class="py-16 bg-white reveal-section">
      <UContainer>
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 mb-12">
          <div>
            <p class="eyebrow text-stone-500">Trusted and loved by many</p>
            <h2 class="display-heading text-[#c59042]">Every unboxing tells the story.</h2>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          <div v-for="(testimonial, index) in testimonials" :key="testimonial.author" class="testimonial-card" :style="{ animationDelay: `${index * 80}ms` }">
            <p class="text-lg font-medium text-onyx-900">“{{ testimonial.quote }}”</p>
            <p class="mt-6 text-sm text-stone-500">{{ testimonial.author }}</p>
          </div>
        </div>
      </UContainer>
    </section>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useCategoriesStore } from '~/stores/categories'
import bannerUrl from '~/assets/images/banner.png'

const categoriesStore = useCategoriesStore()
const authStore = useAuthStore()

const newsletterEmail = ref('')
const newsletterStatus = ref<'idle' | 'success' | 'error'>('idle')
const brandValues = [
  {
    title: 'Curated Classics',
    copy: 'A refined mix of trending silhouettes and timeless staples for effortless layering.',
    icon: 'i-heroicons-sparkles',
    tint: 'tint-gold'
  },
  {
    title: 'Hypoallergenic Comfort',
    copy: 'Stainless steel and gold-plated alloys that stay gentle on skin from AM to PM.',
    icon: 'i-heroicons-shield-check',
    tint: 'tint-cream'
  },
  {
    title: 'Gift-Ready Moments',
    copy: 'Thoughtful packaging and styling support for birthdays, milestones, and the everyday.',
    icon: 'i-heroicons-gift-top',
    tint: 'tint-rose'
  }
]

const craftsmanshipDetails = [
  {
    title: 'Plating',
    value: '18k gold',
    copy: 'Multiple dips with ceramic coating to lock in the finish.'
  },
  {
    title: 'Batch size',
    value: '50 pcs',
    copy: 'Produced in intimate runs to ensure artisan-level QC.'
  },
  {
    title: 'Care',
    value: 'Lifetime',
    copy: 'Complimentary cleaning and sizing adjustments.'
  },
  {
    title: 'Lead time',
    value: '3 days',
    copy: 'Metro Manila deliveries fulfilled within 72 hours.'
  }
]

const testimonials = [
  {
    quote: '10/10. Very nice quality. Its appearance is perfect, gustong gusto ng girlfriend ko. Mas lalo nya raw akong minahal dahil sa ganda ng bracelet kaya makaka ulit.',
    author: 'Lowell',
  },
  {
    quote: 'Hello, 10/10 super good and nice nung quality ++ super affordable pa. Will surely buy again!.',
    author: 'Aya',
  },
  {
    quote: "I'm super satisfied with my order. I love the quality and the design! Yun po talaga ineexpect ko when I saw the photos. I'll recommend your shop to my friends.",
    author: 'Gwen',
  }
]

const priceBands = ['₱279', '₱149', '₱79', '₱149', '₱99', '₱278']
const categories = computed(() => categoriesStore.categories)
const enrichedCollections = computed(() =>
  categories.value.map((category, index) => ({
    ...category,
    priceFrom: priceBands[index % priceBands.length],
  }))
)

const handleSubscribe = () => {
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) {
    newsletterStatus.value = 'error'
    return
  }
  newsletterStatus.value = 'success'
  newsletterEmail.value = ''
  setTimeout(() => {
    newsletterStatus.value = 'idle'
  }, 5000)
}

let revealObserver: IntersectionObserver | null = null
const initRevealObserver = () => {
  if (typeof window === 'undefined') return
  revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.15 }
  )

  document.querySelectorAll('.reveal-section').forEach(element => {
    revealObserver?.observe(element)
  })
}

onMounted(async () => {
  await categoriesStore.fetchCategories()
  await authStore.checkAuthStatus()
  initRevealObserver()
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
})
</script>

<style scoped>
:global(:root) {
  --champagne-50: #fefaf4;
  --champagne-25: #fff7ef;
  --rose-mist: #f7ebe6;
  --onyx-950: #0f0a05;
  --onyx-900: #1a120c;
  --onyx-800: #241912;
  --onyx-700: #2f2018;
  --onyx-400: #4a321e;
  --onyx-200: #99826e;
  --onyx-100: #e9e4df;
  --gold-400: #f5c06c;
  --gold-300: #ffd18d;
  --gold-200: #f7dab0;
  --gold-100: #fdf0d7;
  --gold-light: #d4b896;
  --champagne-100: #fce8d7;
}

.bg-champagne-50 {
  background-color: var(--champagne-50);
}

.bg-onyx-200 {
  background-color: var(--onyx-200);
}

.text-gold-400 {
  color: var(--gold-400);
}

.text-gold-200 {
  color: var(--gold-200);
}


.mini-nav-wrapper {
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid rgba(26, 18, 12, 0.08);
  background: rgba(255, 255, 255, 0.7);
}

.mini-pill {
  font-size: 0.65rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  border: 1px solid rgba(26, 18, 12, 0.12);
  border-radius: 999px;
  padding: 0.35rem 0.8rem;
}

.mini-nav-link {
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  transition: background 0.3s ease, color 0.3s ease;
}

.mini-nav-link:hover {
  background: rgba(26, 18, 12, 0.08);
  color: var(--onyx-900);
}

.hero-noise {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 3px 3px;
}

.hero-card {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 32px;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(18px);
  box-shadow: 0 40px 80px rgba(8, 5, 2, 0.45);
}

.glass-stat {
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.05);
  padding: 1.25rem;
  backdrop-filter: blur(12px);
}

.eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
}

.display-heading {
  font-size: clamp(2.25rem, 4vw, 3.25rem);
  font-family: 'Playfair Display', 'Times New Roman', serif;
  line-height: 1.2;
  margin-top: 0.75rem;
}

.section-copy {
  margin-top: 1rem;
  color: #6b625d;
  max-width: 640px;
}

.promise-card {
  border-radius: 32px;
  border: 1px solid rgba(78, 66, 58, 0.08);
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  box-shadow: 0 25px 60px rgba(26, 18, 12, 0.08);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.promise-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 30px 70px rgba(26, 18, 12, 0.12);
}

.promise-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tint-gold {
  background: var(--gold-100);
  color: var(--onyx-900);
}

.tint-cream {
  background: var(--champagne-100);
  color: var(--onyx-900);
}

.tint-rose {
  background: #f3e6e0;
  color: var(--onyx-900);
}

.collection-card {
  border-radius: 34px;
  border: 1px solid rgba(26, 18, 12, 0.08);
  background: rgba(255, 255, 255, 0.92);
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  transition: transform 0.45s ease, box-shadow 0.45s ease, border-color 0.45s ease;
}

.collection-card:hover {
  transform: translateY(-10px);
  border-color: rgba(245, 192, 108, 0.8);
  box-shadow: 0 35px 80px rgba(26, 18, 12, 0.18);
}

.collection-card.loading {
  background: rgba(255, 255, 255, 0.7);
}

.collection-caption {
  background: linear-gradient(180deg, rgba(228, 185, 143, 0) 0%, rgba(182, 153, 125, 0.75) 60%, rgba(180, 163, 143, 0.85) 100%);
  border-radius: 0 0 28px 28px;
}

.craftsmanship-card {
  border-radius: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(255, 243, 233, 0.95));
  border: 1px solid rgba(26, 18, 12, 0.08);
  padding: 3rem;
  box-shadow: 0 40px 80px rgba(26, 18, 12, 0.12);
}

.detail-card {
  border-radius: 24px;
  border: 1px solid rgba(26, 18, 12, 0.08);
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
}

.video-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.video-play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 4rem;
  height: 4rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.trust-stat {
  border-radius: 24px;
  border: 1px solid rgba(26, 18, 12, 0.1);
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
}

.testimonial-card {
  border-radius: 28px;
  border: 1px solid rgba(26, 18, 12, 0.08);
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 20px 60px rgba(26, 18, 12, 0.08);
  animation: fadeUp 0.6s ease forwards;
  opacity: 0;
}

.cta-glow {
  background: radial-gradient(circle, rgb(231, 172, 95));
}

.cta-panel {
  position: relative;
  isolation: isolate;
}

.newsletter-card {
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  padding: 2rem;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}

.newsletter-input {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 0.85rem 1.25rem;
  background: rgba(10, 6, 2, 0.4);
  color: white;
  width: 100%;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.reveal-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .craftsmanship-card {
    padding: 2rem;
  }

  .mini-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
