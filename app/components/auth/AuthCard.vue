<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background with parallax effect -->
    <div 
      class="absolute inset-0 bg-fixed bg-cover bg-center"
      :style="{ backgroundImage: `url(${bannerUrl})` }"
    ></div>
    
    <!-- Elegant overlay with gold tint -->
    <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(46, 36, 12, 0.85) 0%, rgba(243, 214, 135, 0.75) 25%, rgba(51, 46, 34, 0.85) 50%);"></div>
    
    <!-- Decorative gold accents -->
    <div class="absolute top-0 left-0 w-full h-1" style="background: linear-gradient(90deg, transparent, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400), transparent);"></div>
    <div class="absolute bottom-0 left-0 w-full h-1" style="background: linear-gradient(90deg, transparent, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400), transparent);"></div>
    
    <!-- Main content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
      <div class="w-full max-w-md my-auto">
        <!-- Logo and brand section -->
        <div v-if="showLogo" class="text-center mb-6">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] p-[2px] shadow-lg">
              <div class="w-full h-full rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center">
                <LogoMini :size="40" rounded />
              </div>
            </div>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2 tracking-wide">Barely Gold</h1>
          <p class="text-white/80 text-sm">Timeless Elegance, Modern Luxury</p>
          <div class="mx-auto mt-3 h-[2px] w-16 rounded-full" style="background: linear-gradient(90deg, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400));"></div>
        </div>
        
        <!-- Auth card -->
        <div class="auth-card backdrop-blur-md bg-white/95 rounded-2xl shadow-2xl border border-white/20">
          <div class="p-8">
            <!-- Title and subtitle -->
            <div v-if="title" class="text-center mb-6">
              <h2 class="text-2xl font-bold mb-2" style="color: var(--color-gold-800);">{{ title }}</h2>
              <p v-if="subtitle" class="text-gray-600 text-sm">{{ subtitle }}</p>
            </div>
            
            <!-- Card content slot -->
            <slot />
          </div>
        </div>
        
        <!-- Footer text -->
        <p class="text-center text-white/70 text-sm mt-6 mb-4 flex items-center justify-center gap-2">
          <UIcon name="i-heroicons-lock-closed" class="w-4 h-4" />
          <span>Secure authentication built on AWS</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoMini from '~/components/LogoMini.vue';
import bannerUrl from '~/assets/images/banner.png';

interface Props {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

withDefaults(defineProps<Props>(), {
  showLogo: true
});
</script>

<style scoped>
/* Auth card enhancement */
.auth-card {
  position: relative;
  overflow: visible;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 1rem;
  }
}
</style>

