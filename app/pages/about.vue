<template>
  <div class="min-h-screen bg-stone-50 py-10">
    <UContainer>
      <div class="max-w-4xl mx-auto">
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-left"
          class="mb-6"
          @click="$router.back()"
        >
          Back
        </UButton>

        <div class="bg-white shadow-sm p-8">
          <header class="mb-5">
            <p class="text-xs font-semibold tracking-[0.3em] uppercase text-stone-500">
              Our Story
            </p>
            <h1 class="text-3xl font-bold text-stone-900 mt-2">About Barely Gold</h1>
            <p class="text-stone-600 mt-3 leading-relaxed">
              Welcome to Barely Gold, your go-to destination for stylish, affordable, and thoughtfully curated fashion jewelry.
              Founded in April 2025, we exist to help you express your personality—anytime, anywhere.
            </p>
          </header>

          <section class="space-y-6 text-stone-700 leading-relaxed">
            <p>
              We believe jewelry should be both beautiful and practical. Every piece is designed for daily use—perfect for
              school runs, office days, casual outings, or special celebrations. Expect effortless pairings that elevate your
              everyday style with a touch of elegance.
            </p>

            <div class="rounded-2xl border border-stone-100 bg-stone-50/70 p-6">
              <h2 class="text-xl font-semibold text-stone-900 mb-4">What We Offer</h2>
              <ul class="space-y-3 text-stone-700">
                <li class="flex gap-3">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                  <span>A curated selection of rings, necklaces, bracelets, bangles, and earrings</span>
                </li>
                <li class="flex gap-3">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                  <span>Trendy and timeless designs that match any outfit</span>
                </li>
                <li class="flex gap-3">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                  <span>Pieces ideal for daily wear and comfortable enough for long hours</span>
                </li>
                <li class="flex gap-3">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                  <span>Affordable styles made from stainless steel, gold-plated metals, and hypoallergenic materials</span>
                </li>
                <li class="flex gap-3">
                  <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                  <span>Gift-ready items for birthdays, anniversaries, holidays, and meaningful milestones</span>
                </li>
              </ul>
            </div>

            <p class="text-stone-700">
              Thank you for choosing Barely Gold. We're honored to be part of your everyday looks and your most meaningful
              moments. Stay golden!
            </p>
          </section>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

