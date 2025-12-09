<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Elegant gradient background -->
    <div 
      class="absolute inset-0"
      style="background: linear-gradient(135deg, rgba(46, 36, 12, 0.92) 0%, rgba(139, 111, 36, 0.85) 30%, rgba(107, 83, 27, 0.88) 70%, rgba(46, 36, 12, 0.92) 100%);"
    ></div>
    
    <!-- Animated background blobs -->
    <div class="absolute inset-0 overflow-hidden opacity-10">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-gold-400)] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-[var(--color-gold-500)] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[var(--color-gold-600)] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>
    
    <!-- Decorative gold accents -->
    <div class="absolute top-0 left-0 w-full h-1" style="background: linear-gradient(90deg, transparent, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400), transparent);"></div>
    <div class="absolute bottom-0 left-0 w-full h-1" style="background: linear-gradient(90deg, transparent, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400), transparent);"></div>
    
    <!-- Main content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-2xl text-center">
        <!-- Logo and brand section -->
        <div class="mb-8 flex justify-center">
          <div class="relative animate-float">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] p-[3px] shadow-2xl">
              <div class="w-full h-full rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center">
                <LogoMini :size="60" rounded />
              </div>
            </div>
          </div>
        </div>

        <!-- Error number with shimmer effect -->
        <h1 class="text-9xl md:text-[12rem] font-bold mb-4 bg-gradient-to-r from-[var(--color-gold-300)] via-[var(--color-gold-500)] to-[var(--color-gold-300)] bg-clip-text text-transparent animate-shimmer leading-none pb-4">
          404
        </h1>

        <!-- Error title -->
        <div class="mb-6">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">Page Not Found</h2>
          <div class="mx-auto h-[2px] w-24 rounded-full" style="background: linear-gradient(90deg, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400));"></div>
        </div>

        <!-- Error description -->
        <p class="text-lg md:text-xl text-white/90 mb-4 max-w-lg mx-auto leading-relaxed">
          The page or product you're looking for doesn't exist.
        </p>
        <p class="text-base text-white/75 mb-10 max-w-md mx-auto">
          It may have been moved, deleted, or the link you followed might be incorrect.
        </p>

        <!-- Decorative divider -->
        <div class="flex items-center justify-center mb-10">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-gold-400)]"></div>
          <div class="mx-4">
            <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6 text-[var(--color-gold-400)]" />
          </div>
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-gold-400)]"></div>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <UButton 
            @click="navigateTo('/')"
            color="primary" 
            size="lg" 
            icon="i-heroicons-home"
            class="error-button-primary shadow-xl min-w-[180px]"
          >
            Return Home
          </UButton>
          
          <UButton 
            @click="goBack"
            color="primary"
            variant="ghost" 
            size="lg" 
            icon="i-heroicons-arrow-left"
            class="error-button-ghost min-w-[180px] text-white hover:text-white border-2 border-white/30 hover:border-[var(--color-gold-400)]"
          >
            Go Back
          </UButton>
        </div>

        <!-- Additional info -->
        <div class="text-white/60 text-sm">
          <p class="mb-2">Looking for something specific?</p>
          <NuxtLink 
            to="/products" 
            class="text-[var(--color-gold-300)] hover:text-[var(--color-gold-200)] underline decoration-1 underline-offset-4 transition-colors"
          >
            Browse our products
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Footer accent -->
    <div class="absolute bottom-8 left-0 right-0 text-center z-10">
      <p class="text-white/50 text-xs tracking-wider">
        BARELY GOLD &mdash; TIMELESS ELEGANCE
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import LogoMini from '~/components/LogoMini.vue';

const goBack = () => {
  // Check if there's history to go back to
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // If no history, go to home
    navigateTo('/');
  }
};

// Set page meta
useHead({
  title: '404 - Page Not Found | Barely Gold',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
});
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-shimmer {
  background-size: 200% 200%;
  animation: shimmer 4s ease-in-out infinite;
}

.error-button-primary {
  background: linear-gradient(135deg, var(--color-gold-600), var(--color-gold-700)) !important;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.35);
  transition: all 0.3s ease;
}

.error-button-primary:hover {
  background: linear-gradient(135deg, var(--color-gold-700), var(--color-gold-800)) !important;
  box-shadow: 0 12px 32px rgba(212, 175, 55, 0.45);
  transform: translateY(-2px);
}

.error-button-ghost {
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.05) !important;
}

.error-button-ghost:hover {
  background: rgba(212, 175, 55, 0.15) !important;
  transform: translateY(-2px);
}
</style>

