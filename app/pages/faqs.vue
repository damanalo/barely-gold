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
              Support
            </p>
            <h1 class="text-3xl font-bold text-stone-900 mt-2">Frequently Asked Questions</h1>
            <p class="text-stone-600 mt-3">
              Find quick answers about our jewelry, ordering policies, care instructions, and more.
              Need additional help? Message us on social media and we’ll respond within 24 hours.
            </p>
          </header>

          <div class="space-y-4">
            <section
              v-for="faq in faqs"
              :key="faq.question"
              class="rounded-2xl border border-stone-100 bg-stone-50/60 p-6"
            >
              <h2 class="text-lg font-semibold text-stone-900">
                {{ faq.question }}
              </h2>
              <p class="text-stone-700 mt-3 leading-relaxed">
                {{ faq.answer }}
              </p>
            </section>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
type FAQ = {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: 'What materials are your jewelry pieces made of?',
    answer:
      'Our pieces are made from fashion jewelry materials such as stainless steel, gold-plated alloys, and hypoallergenic metals.'
  },
  {
    question: 'Are your items waterproof or tarnish-resistant?',
    answer:
      'Some pieces are water-resistant, while others require extra care. Please refer to the care instructions of each product.'
  },
  {
    question: 'Do you accept returns?',
    answer:
      'Yes. Returns are accepted within 7 days of delivery and require a clear unboxing video. We do not accept returns for wrong size or color orders—please review our full Return Policy.'
  },
  {
    question: 'What should I do if I receive a defective item?',
    answer:
      'Send us a clear video taken during unboxing. If the item is defective upon arrival or the wrong item was delivered, we will process a return or refund.'
  },
  {
    question: 'How long does shipping take?',
    answer: 'Shipping times vary by location. Standard delivery typically takes 2-3 business days.'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'No, we currently ship within the Philippines only.'
  },
  {
    question: 'Can I cancel my order?',
    answer: 'Once an order has been placed, processed, or shipped, cancellation is no longer possible.'
  },
  {
    question: 'How do I know my size?',
    answer:
      'Each product page includes detailed measurements. Review these carefully before ordering to ensure the best fit.'
  },
  {
    question: 'Is your jewelry suitable for sensitive skin?',
    answer: 'Most pieces are hypoallergenic, but skin sensitivity varies by person.'
  },
  {
    question: 'How do I care for my jewelry?',
    answer:
      'While our pieces are tarnish-resistant, they are not waterproof. Avoid moisture, perfumes, lotions, alcohol, and chemicals. Store jewelry in a dry pouch when not in use.'
  },
  {
    question: 'Do you offer gift packaging?',
    answer:
      'We offer mini paper bags that hold up to five jewelry items. They are free for purchases of four items or more, or can be added for ₱20 on smaller orders.'
  },
  {
    question: 'How can I contact customer support?',
    answer: 'Reach us through our social media pages. We typically respond within 24 hours.'
  }
]

definePageMeta({
  layout: 'default'
})
</script>

