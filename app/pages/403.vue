<template>
  <div class="h-screen relative overflow-hidden flex flex-col">
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
    
    <!-- Decorative gold accent - Header -->
    <div class="relative z-10 h-1 flex-shrink-0" style="background: linear-gradient(90deg, transparent, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400), transparent);"></div>
    
    <!-- Main content -->
    <div class="relative z-10 flex-1 flex items-center justify-center p-4 overflow-hidden">
      <div class="w-full max-w-2xl text-center">
        <!-- Logo and brand section -->
        <div class="mb-3 md:mb-4 flex justify-center">
          <div class="relative animate-float">
            <div class="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] p-[3px] shadow-2xl">
              <div class="w-full h-full rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center">
                <LogoMini :size="40" rounded />
              </div>
            </div>
          </div>
        </div>

        <!-- Error number with shimmer effect -->
        <h1 class="text-7xl md:text-9xl lg:text-[10rem] font-bold mb-2 bg-gradient-to-r from-[var(--color-gold-300)] via-[var(--color-gold-500)] to-[var(--color-gold-300)] bg-clip-text text-transparent animate-shimmer leading-none">
          403
        </h1>

        <!-- Error title -->
        <div class="mb-3">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-wide">Access Forbidden</h2>
          <div class="mx-auto h-[2px] w-24 rounded-full" style="background: linear-gradient(90deg, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400));"></div>
        </div>

        <!-- Error description -->
        <p class="text-base md:text-lg text-white/90 mb-2 max-w-lg mx-auto leading-relaxed">
          You don't have permission to access this exclusive area.
        </p>
        <p class="text-sm md:text-base text-white/75 mb-4 max-w-md mx-auto">
          This content requires special authorization. If you believe this is an error, please contact an administrator.
        </p>

        <!-- Decorative divider -->
        <div class="flex items-center justify-center mb-4">
          <div class="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-gold-400)]"></div>
          <div class="mx-4">
            <UIcon name="i-heroicons-lock-closed" class="w-5 h-5 md:w-6 md:h-6 text-[var(--color-gold-400)]" />
          </div>
          <div class="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-gold-400)]"></div>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
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
          <p class="mb-2">Need access to this area?</p>
          <NuxtLink 
            to="/login" 
            class="text-[var(--color-gold-300)] hover:text-[var(--color-gold-200)] underline decoration-1 underline-offset-4 transition-colors"
          >
            Sign in with authorized account
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Footer accent -->
    <div class="relative z-10 flex-shrink-0 pb-8 text-center">
      <p class="text-white/50 text-xs tracking-wider">
        BARELY GOLD &mdash; TIMELESS ELEGANCE
      </p>
    </div>
    
    <!-- Decorative gold accent - Footer -->
    <div class="relative z-10 h-1 flex-shrink-0" style="background: linear-gradient(90deg, transparent, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400), transparent);"></div>
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
  title: '403 - Access Forbidden | Barely Gold',
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

