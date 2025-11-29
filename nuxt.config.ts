import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  runtimeConfig: {
    public: {
      apiName: process.env.API_NAME,
      publicCloudfrontUrl: process.env.PUBLIC_CLOUDFRONT_URL,
      showComingSoon: process.env.SHOW_COMING_SOON,
      apply10Discount: process.env.APPLY_10_DISCOUNT
    }
  },
  ssr: false,
})
