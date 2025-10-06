<template>
  <div class="min-h-screen bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A] flex items-center justify-center p-4 overflow-hidden relative">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden opacity-20">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37] rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#FCD34D] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
    </div>

    <!-- Main content -->
    <div class="relative z-10 max-w-4xl w-full text-center">
      <!-- Logo -->
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <img 
            src="/barely-gold-logo.jpeg"
            alt="Barely Gold" 
            class="h-24 w-auto object-contain drop-shadow-xl animate-float"
          />
        </div>
      </div>

      <!-- Heading -->
      <h1 class="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-[#8C6F24] via-[#D4AF37] to-[#B08C2E] bg-clip-text text-transparent animate-shimmer leading-tight pb-2">
        Coming Soon
      </h1>

      <!-- Subheading -->
      <p class="text-2xl md:text-3xl text-[#4B3A13] mb-4 font-light">
        Something Beautiful is Being Crafted
      </p>

      <p class="text-lg md:text-xl text-[#6B531B] mb-12 max-w-2xl mx-auto">
        We're putting the finishing touches on our exquisite collection.
        <br>
        Stay tuned for timeless elegance.
      </p>

      <!-- Decorative divider -->
      <div class="flex items-center justify-center mb-12">
        <div class="h-px w-20 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
        <div class="mx-4">
          <div class="w-3 h-3 bg-[#D4AF37] rounded-full shadow-lg"></div>
        </div>
        <div class="h-px w-20 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
      </div>

      <!-- Email subscription (optional - can be connected later) -->
      <div class="max-w-md mx-auto mb-8">
        <p class="text-sm text-[#6B531B] mb-4 uppercase tracking-wider font-semibold">
          Follow us on Facebook for updates.
        </p>  
      </div>

      <!-- Social links placeholder -->
      <div class="flex justify-center gap-6">
        <a
          v-for="social in socialLinks"
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border-2 border-[#D4AF37]/30 flex items-center justify-center hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:scale-110 transition-all duration-300 group"
          :aria-label="social.name"
        >
          <Icon :name="social.icon" class="w-6 h-6 text-[#8C6F24] group-hover:text-white transition-colors" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const socialLinks = ref([
  { name: 'Facebook', icon: 'i-simple-icons-facebook', url: 'https://www.facebook.com/BarelyGoldPH' },
])

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
    transform: translateY(-20px);
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
  animation: shimmer 3s ease-in-out infinite;
}
</style>

