<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background with parallax effect -->
    <div 
      class="absolute inset-0 bg-fixed bg-cover bg-center"
      :style="{ backgroundImage: `url(${bannerUrl})` }"
    ></div>
    
    <!-- Elegant overlay with gold tint -->
    <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(46, 36, 12, 0.85) 0%, rgba(139, 111, 36, 0.75) 50%, rgba(46, 36, 12, 0.85) 100%);"></div>
    
    <!-- Decorative gold accents -->
    <div class="absolute top-0 left-0 w-full h-1" style="background: linear-gradient(90deg, transparent, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400), transparent);"></div>
    <div class="absolute bottom-0 left-0 w-full h-1" style="background: linear-gradient(90deg, transparent, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400), transparent);"></div>
    
    <!-- Main content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
      <div class="w-full max-w-md my-auto">
        <!-- Logo and brand section -->
        <div class="text-center mb-6">
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
          <authenticator :hide-sign-up="showComingSoon">
            <template v-slot="{ user, signOut }">
              <!-- Authenticated state -->
              <div class="text-center py-6">
                <div class="mb-4">
                  <div class="w-16 h-16 rounded-full mx-auto mb-4" style="background: linear-gradient(135deg, var(--color-gold-400), var(--color-gold-600));">
                    <div class="w-full h-full rounded-full flex items-center justify-center">
                      <UIcon name="i-heroicons-check-circle" class="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 class="text-2xl font-semibold mb-2" style="color: var(--color-gold-700);">Welcome Back!</h2>
                  <p class="text-gray-600 mb-6">You are successfully signed in</p>
                </div>
                
                <div class="space-y-3">
                  <UButton 
                    @click="navigateTo('/admin')"
                    color="primary" 
                    size="lg" 
                    block
                    icon="i-heroicons-squares-2x2"
                    class="auth-button"
                  >
                    Go to Dashboard
                  </UButton>
                  
                  <UButton 
                    @click="signOut"
                    color="primary"
                    variant="ghost" 
                    size="lg" 
                    block
                    icon="i-heroicons-arrow-left-on-rectangle"
                  >
                    Sign Out
                  </UButton>
                </div>
              </div>
            </template>
          </authenticator>
        </div>
        
        <!-- Footer text -->
        <p class="text-center text-white/70 text-sm mt-6 mb-4">
          Secure authentication powered by AWS Amplify
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Authenticator } from '@aws-amplify/ui-vue';
import "@aws-amplify/ui-vue/styles.css";
import LogoMini from '~/components/LogoMini.vue';
import bannerUrl from '~/assets/images/banner.jpeg';

definePageMeta({
  layout: 'empty',
  middleware: ['auth']
})

// Get config to check if coming soon is enabled
const { public: config } = useRuntimeConfig()
const showComingSoon = computed(() => String(config.showComingSoon) === 'true')
</script>

<style scoped>
/* Custom styling for AWS Amplify Authenticator */
:deep(.amplify-authenticator) {
  --amplify-colors-font-primary: #1F1F1F;
  --amplify-colors-font-secondary: #6B7280;
  --amplify-colors-font-interactive: var(--color-gold-700);
  --amplify-colors-background-primary: transparent;
  --amplify-colors-background-secondary: #F9FAFB;
  --amplify-colors-brand-primary-10: var(--color-gold-50);
  --amplify-colors-brand-primary-80: var(--color-gold-600);
  --amplify-colors-brand-primary-90: var(--color-gold-700);
  --amplify-colors-brand-primary-100: var(--color-gold-800);
  --amplify-radii-small: 0.5rem;
  --amplify-radii-medium: 0.75rem;
  --amplify-radii-large: 1rem;
  --amplify-space-medium: 1rem;
  --amplify-space-large: 1.5rem;
  --amplify-fonts-default-variable: 'Inter', system-ui, -apple-system, sans-serif;
  width: 100% !important;
  max-width: 100% !important;
}

:deep(.amplify-authenticator__container) {
  padding: 1.5rem;
  width: 100% !important;
}

:deep(.amplify-tabs) {
  border-bottom: 2px solid var(--color-gold-200) !important;
  margin-bottom: 1.5rem;
}

:deep(.amplify-tabs-item),
:deep(button.amplify-tabs-item) {
  color: var(--color-gold-700) !important;
  font-weight: 500;
  padding: 0.75rem 1rem;
  transition: all 0.2s;
  background: transparent !important;
  border: none !important;
  border-bottom: 3px solid transparent !important;
}

:deep(.amplify-tabs-item:hover),
:deep(button.amplify-tabs-item:hover) {
  color: var(--color-gold-600) !important;
}

:deep(.amplify-tabs-item[data-state="active"]),
:deep(button.amplify-tabs-item[data-state="active"]),
:deep(.amplify-tabs-item[aria-selected="true"]),
:deep(button[role="tab"][aria-selected="true"]) {
  color: var(--color-gold-800) !important;
  border-bottom: 3px solid var(--color-gold-600) !important;
  font-weight: 600;
}

:deep(.amplify-form) {
  padding: 0.5rem 0;
  width: 100% !important;
}

:deep(.amplify-fieldset) {
  width: 100% !important;
}

:deep(.amplify-flex) {
  width: 100% !important;
}

:deep([data-amplify-authenticator]) {
  width: 100% !important;
}

:deep(.amplify-tabs),
:deep([role="tablist"]) {
  width: 100% !important;
}

:deep([role="tabpanel"]) {
  width: 100% !important;
}

:deep(.amplify-button[data-variation="primary"]) {
  background: linear-gradient(135deg, var(--color-gold-600), var(--color-gold-700));
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  border: none;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);
  transition: all 0.3s ease;
}

:deep(.amplify-button[data-variation="primary"]:hover) {
  background: linear-gradient(135deg, var(--color-gold-700), var(--color-gold-800));
  box-shadow: 0 6px 16px rgba(212, 175, 55, 0.35);
  transform: translateY(-1px);
}

:deep(.amplify-button[data-variation="link"]) {
  color: var(--color-gold-700);
  font-weight: 500;
}

:deep(.amplify-button[data-variation="link"]:hover) {
  color: var(--color-gold-600);
}

:deep(.amplify-input),
:deep(.amplify-field__input),
:deep(input.amplify-input),
:deep(input[type="email"]),
:deep(input[type="password"]),
:deep(input[type="text"]) {
  border: 2px solid #E5E7EB !important;
  border-radius: 0.75rem !important;
  padding: 0.75rem 1rem !important;
  font-size: 0.95rem !important;
  transition: all 0.2s !important;
}

:deep(.amplify-input:focus),
:deep(.amplify-field__input:focus),
:deep(input:focus) {
  border-color: var(--color-gold-400) !important;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1) !important;
  outline: none !important;
}

:deep(.amplify-field-group__field-wrapper) {
  position: relative;
}

:deep(.amplify-field-group__field-wrapper input) {
  border-radius: 0.75rem !important;
}

:deep(.amplify-label) {
  color: #374151;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

:deep(.amplify-text) {
  color: #6B7280;
  line-height: 1.6;
}

:deep(.amplify-heading) {
  color: var(--color-gold-800);
  font-weight: 700;
  margin-bottom: 0.5rem;
}

:deep(.amplify-alert) {
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
  margin-bottom: 1rem;
}

:deep(.amplify-alert--error) {
  background-color: #FEE2E2;
  border: 1px solid #FCA5A5;
  color: #991B1B;
}

:deep(.amplify-alert--info) {
  background-color: var(--color-gold-50);
  border: 1px solid var(--color-gold-200);
  color: var(--color-gold-900);
}

:deep(.amplify-field) {
  margin-bottom: 1.25rem;
}

:deep(.amplify-field-group) {
  margin-bottom: 1.5rem;
}

:deep(.amplify-field__show-password),
:deep(button.amplify-field__show-password) {
  color: var(--color-gold-600) !important;
  background: transparent !important;
  border: 2px solid var(--color-gold-300) !important;
  box-shadow: none !important;
  padding: 0.5rem !important;
  border-radius: 0.5rem !important;
  height: 100% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.amplify-field__show-password:hover),
:deep(button.amplify-field__show-password:hover) {
  color: var(--color-gold-700) !important;
  background: var(--color-gold-50) !important;
  border-color: var(--color-gold-400) !important;
}

:deep(.amplify-field__show-password svg),
:deep(button.amplify-field__show-password svg) {
  fill: currentColor;
  stroke: currentColor;
}

:deep(.amplify-field-group--password) {
  display: flex;
  align-items: stretch;
}

:deep(.amplify-field-group--password input) {
  flex: 1;
}

/* Additional gold theme enhancements */
:deep(.amplify-text--primary) {
  color: var(--color-gold-800);
}

:deep(.amplify-text--secondary) {
  color: #6B7280;
}

:deep(a.amplify-button--link),
:deep(button.amplify-button--link) {
  color: var(--color-gold-600) !important;
  text-decoration: none;
  background: transparent !important;
  border: none !important;
}

:deep(a.amplify-button--link:hover),
:deep(button.amplify-button--link:hover) {
  color: var(--color-gold-700) !important;
  text-decoration: underline;
}

:deep(.amplify-checkboxfield__icon) {
  border-color: var(--color-gold-300);
}

:deep(.amplify-checkboxfield__input:checked + .amplify-checkboxfield__icon) {
  background-color: var(--color-gold-600);
  border-color: var(--color-gold-600);
}

:deep(.amplify-visually-hidden:focus + .amplify-checkboxfield__icon) {
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
}

/* Auth card enhancement */
.auth-card {
  position: relative;
  overflow: visible;
  padding: 2rem;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-gold-400), var(--color-gold-600), var(--color-gold-400));
  opacity: 0.8;
  border-radius: 1rem 1rem 0 0;
}

@media (max-width: 640px) {
  .auth-card {
    padding: 1.5rem;
  }
}

.auth-button {
  background: linear-gradient(135deg, var(--color-gold-600), var(--color-gold-700)) !important;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);
  transition: all 0.3s ease;
}

.auth-button:hover {
  background: linear-gradient(135deg, var(--color-gold-700), var(--color-gold-800)) !important;
  box-shadow: 0 6px 16px rgba(212, 175, 55, 0.35);
  transform: translateY(-2px);
}
</style>