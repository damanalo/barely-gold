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

        <div class="bg-white rounded-3xl shadow-sm p-8">
          <header class="mb-10">
            <p class="text-xs font-semibold tracking-[0.3em] uppercase text-stone-500">
              Let's Connect
            </p>
            <h1 class="text-3xl font-bold text-stone-900 mt-2">Contact Barely Gold</h1>
            <p class="text-stone-600 mt-3">
              We’re here to help with sizing questions, order updates, care instructions, and anything else you need.
              Message us on social media and we’ll get back to you within 24 hours.
            </p>
          </header>

          <div class="grid gap-6 md:grid-cols-2">
            <section class="rounded-2xl border border-stone-100 bg-stone-50/60 p-6">
              <h2 class="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 text-primary-500" />
                Social Media
              </h2>
              <p class="text-sm text-stone-600 mt-2">
                Tap your preferred platform and send us a message anytime.
              </p>
              <div class="mt-5 space-y-3">
                <ULink
                  to="https://facebook.com/BarelyGoldPH"
                  target="_blank"
                  class="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3 hover:border-primary-200 hover:bg-primary-50/30 transition"
                >
                  <div class="flex items-center gap-3">
                    <UIcon name="i-simple-icons-facebook" class="w-6 h-6 text-[#1877F2]" />
                    <div>
                      <p class="text-sm font-medium text-stone-900">Facebook</p>
                      <p class="text-sm text-stone-500">facebook.com/BarelyGoldPH</p>
                    </div>
                  </div>
                  <UIcon name="i-heroicons-arrow-up-right" class="w-4 h-4 text-stone-400" />
                </ULink>

                <ULink
                  to="https://instagram.com/barely.gold"
                  target="_blank"
                  class="flex items-center justify-between rounded-xl border border-stone-200 px-4 py-3 hover:border-primary-200 hover:bg-primary-50/30 transition"
                >
                  <div class="flex items-center gap-3">
                    <UIcon name="i-simple-icons-instagram" class="w-6 h-6 text-[#E1306C]" />
                    <div>
                      <p class="text-sm font-medium text-stone-900">Instagram</p>
                      <p class="text-sm text-stone-500">instagram.com/barely.gold</p>
                    </div>
                  </div>
                  <UIcon name="i-heroicons-arrow-up-right" class="w-4 h-4 text-stone-400" />
                </ULink>
              </div>
            </section>

            <section class="rounded-2xl border border-stone-100 bg-stone-50/60 p-6">
              <h2 class="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5 text-primary-500" />
                Quick Details
              </h2>
              <div class="mt-5 space-y-4 text-sm text-stone-700">
                <p>
                  <span class="font-semibold text-stone-900">Support Hours:</span>
                  Daily, 8:00 AM – 8:00 PM (PH Time)
                </p>
                <p>
                  <span class="font-semibold text-stone-900">Response Time:</span>
                  Within 24 hours
                </p>
                <p>
                  <span class="font-semibold text-stone-900">Order Assistance:</span>
                  For updates or concerns, send us your order number together with your message.
                </p>
                <p>
                  <span class="font-semibold text-stone-900">Sizing or Product Questions:</span>
                  Share screenshots or links to the exact product so we can guide you quickly.
                </p>
              </div>
            </section>
          </div>
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

