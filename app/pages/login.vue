<template>
  <AuthCard title="Welcome Back" subtitle="Sign in to your Barely Gold account">
    <form @submit.prevent="handleSignIn" class="space-y-4">
      <!-- Error message -->
      <div v-if="errorMessage" class="error-alert">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
        <span>{{ errorMessage }}</span>
      </div>
      
      <!-- Success message for password reset -->
      <div v-if="successMessage" class="success-alert">
        <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
        <span>{{ successMessage }}</span>
      </div>
      
      <!-- Email field -->
      <AuthInput
        v-model="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        :error="emailError"
        :disabled="loading"
        required
        autocomplete="email"
      />
      
      <!-- Password field -->
      <AuthInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        :error="passwordError"
        :disabled="loading"
        required
        autocomplete="current-password"
      />
      
      <!-- Forgot password link -->
      <div class="text-right">
        <NuxtLink 
          to="/forgot-password" 
          class="text-sm font-medium"
          style="color: var(--color-gold-700);"
        >
          Forgot password?
        </NuxtLink>
      </div>
      
      <!-- Sign in button -->
      <AuthButton
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="loading"
        block
        icon="i-heroicons-arrow-right-on-rectangle"
      >
        Sign In
      </AuthButton>
      
      <!-- Sign up link -->
      <div v-if="!showComingSoon" class="text-center pt-4 border-t" style="border-color: var(--color-gold-100);">
        <p class="text-gray-600 text-sm">
          Don't have an account?
          <NuxtLink 
            to="/signup" 
            class="font-semibold ml-1"
            style="color: var(--color-gold-700);"
          >
            Create Account
          </NuxtLink>
        </p>
      </div>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import AuthCard from '~/components/auth/AuthCard.vue';
import AuthInput from '~/components/auth/AuthInput.vue';
import AuthButton from '~/components/auth/AuthButton.vue';

definePageMeta({
  layout: 'empty',
  middleware: ['auth']
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Get config to check if coming soon is enabled
const { public: config } = useRuntimeConfig();
const showComingSoon = computed(() => String(config.showComingSoon) === 'true');

// Form state
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');
const emailError = ref('');
const passwordError = ref('');

// Check for success message from password reset
const successMessage = ref('');
if (route.query.reset === 'success') {
  successMessage.value = 'Password reset successfully! Please sign in with your new password.';
}

const validateForm = () => {
  let isValid = true;
  emailError.value = '';
  passwordError.value = '';
  errorMessage.value = '';
  
  if (!email.value) {
    emailError.value = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address';
    isValid = false;
  }
  
  if (!password.value) {
    passwordError.value = 'Password is required';
    isValid = false;
  }
  
  return isValid;
};

const handleSignIn = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const result = await authStore.signIn(email.value, password.value);
    
    if (result.success) {
      // Check where to redirect
      const redirect = route.query.redirect as string || '/';
      
      // If coming soon is enabled and user is not admin, redirect to admin
      if (showComingSoon.value) {
        // Check if user is admin
        await authStore.checkAuthStatus();
        if (authStore.user?.groups?.includes('Admin')) {
          router.push(redirect);
        } else {
          router.push('/');
        }
      } else {
        router.push(redirect);
      }
    } else if (result.code === 'UserNotConfirmedException') {
      // Redirect to verify email page
      errorMessage.value = result.error || 'Please verify your email';
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(email.value)}`);
      }, 2000);
    } else {
      errorMessage.value = result.error || 'Failed to sign in';
    }
  } catch (error: any) {
    console.error('Sign in error:', error);
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.error-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #FEE2E2;
  border: 1px solid #FCA5A5;
  color: #991B1B;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
}

.success-alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-gold-50);
  border: 1px solid var(--color-gold-200);
  color: var(--color-gold-900);
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
}

a:hover {
  text-decoration: underline;
}
</style>
