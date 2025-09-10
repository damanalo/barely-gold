<template>
  <UApp>
    <header class="border-b bg-white/70 backdrop-blur sticky top-0 z-50">
      <UContainer class="py-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-sparkles" class="text-primary-500" />
          <span class="font-semibold">Barely Gold</span>
        </div>
        <nav class="flex items-center gap-4">
          <ULink to="/" active-class="text-primary-600" class="hover:text-primary-600">Home</ULink>
          <ULink to="/grid" active-class="text-primary-600" class="hover:text-primary-600">Grid</ULink>
        </nav>
      </UContainer>
    </header>

    <main>
      <slot />
    </main>

    <footer class="border-t mt-12">
      <UContainer class="py-6 text-sm text-gray-500 flex items-center justify-between">
        <span>© {{ new Date().getFullYear() }} Barely Gold</span>
        <div class="flex items-center gap-3">
          <ULink to="/" class="hover:text-primary-600">Home</ULink>
          <ULink to="/grid" class="hover:text-primary-600">Grid</ULink>
        </div>
      </UContainer>
    </footer>
  </UApp>
</template>

