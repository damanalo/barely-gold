<template>
  <AuthCard title="Reset Password" subtitle="Enter your email to receive a reset code">
    <div class="space-y-4">
      <!-- Success message -->
      <div v-if="successMessage" class="success-alert">
        <UIcon name="i-heroicons-check-circle" class="w-5 h-5" />
        <span>{{ successMessage }}</span>
      </div>
      
      <!-- Error message -->
      <div v-if="errorMessage" class="error-alert">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
        <span>{{ errorMessage }}</span>
      </div>
      
      <!-- Info message -->
      <div v-if="!codeSent && !errorMessage" class="info-alert">
        <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
        <span>Enter your email address and we'll send you a code to reset your password.</span>
      </div>
      
      <form v-if="!codeSent" @submit.prevent="handleRequestReset" class="space-y-4">
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
        
        <!-- Submit button -->
        <AuthButton
          type="submit"
          variant="primary"
          :loading="loading"
          :disabled="loading"
          block
          icon="i-heroicons-paper-airplane"
        >
          Send Reset Code
        </AuthButton>
      </form>
      
      <!-- Show button to go to reset password page after code sent -->
      <div v-if="codeSent" class="space-y-3">
        <AuthButton
          variant="primary"
          @click="goToResetPassword"
          block
          icon="i-heroicons-arrow-right"
        >
          Enter Reset Code
        </AuthButton>
        
        <AuthButton
          variant="ghost"
          @click="codeSent = false"
          block
        >
          Use Different Email
        </AuthButton>
      </div>
      
      <!-- Back to login link -->
      <div class="text-center pt-4 border-t" style="border-color: var(--color-gold-100);">
        <NuxtLink 
          to="/login" 
          class="text-sm font-medium"
          style="color: var(--color-gold-700);"
        >
          ← Back to Sign In
        </NuxtLink>
      </div>
    </div>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import AuthCard from '~/components/auth/AuthCard.vue';
import AuthInput from '~/components/auth/AuthInput.vue';
import AuthButton from '~/components/auth/AuthButton.vue';

definePageMeta({
  layout: 'empty'
});

const authStore = useAuthStore();
const router = useRouter();

// Form state
const email = ref('');
const loading = ref(false);
const codeSent = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const emailError = ref('');

const validateForm = () => {
  emailError.value = '';
  errorMessage.value = '';
  
  if (!email.value) {
    emailError.value = 'Email is required';
    return false;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'Please enter a valid email address';
    return false;
  }
  
  return true;
};

const handleRequestReset = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    const result = await authStore.resetPassword(email.value);
    
    if (result.success) {
      codeSent.value = true;
      successMessage.value = 'Reset code sent! Check your email for the verification code.';
    } else {
      errorMessage.value = result.error || 'Failed to send reset code';
    }
  } catch (error: any) {
    console.error('Reset password error:', error);
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goToResetPassword = () => {
  router.push(`/reset-password?email=${encodeURIComponent(email.value)}`);
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
  background-color: #D1FAE5;
  border: 1px solid #6EE7B7;
  color: #065F46;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
}

.info-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background-color: #DBEAFE;
  border: 1px solid #93C5FD;
  color: #1E40AF;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

a:hover {
  text-decoration: underline;
}
</style>

