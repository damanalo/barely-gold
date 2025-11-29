<template>
  <AuthCard title="Verify Your Email" subtitle="Enter the verification code sent to your email">
    <div class="space-y-4">
      <!-- Email display -->
      <div class="email-display">
        <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
        <span>{{ email }}</span>
      </div>
      
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
      <div v-if="!successMessage && !errorMessage" class="info-alert">
        <UIcon name="i-heroicons-information-circle" class="w-5 h-5" />
        <span>We've sent a 6-digit verification code to your email. Please check your inbox and spam folder.</span>
      </div>
      
      <form @submit.prevent="handleVerify" class="space-y-4">
        <!-- Verification code field -->
        <AuthInput
          v-model="verificationCode"
          type="text"
          label="Verification Code"
          placeholder="Enter 6-digit code"
          :error="codeError"
          :disabled="loading"
          required
          autocomplete="one-time-code"
        />
        
        <!-- Verify button -->
        <AuthButton
          type="submit"
          variant="primary"
          :loading="loading"
          :disabled="loading"
          block
          icon="i-heroicons-check-badge"
        >
          Verify Email
        </AuthButton>
      </form>
      
      <!-- Resend code section -->
      <div class="resend-section">
        <p class="text-gray-600 text-sm text-center">
          Didn't receive the code?
        </p>
        <AuthButton
          v-if="canResend"
          variant="ghost"
          :loading="resending"
          :disabled="resending"
          @click="handleResendCode"
          block
        >
          Resend Code
        </AuthButton>
        <p v-else class="text-sm text-center" style="color: var(--color-gold-700);">
          Resend available in {{ resendCountdown }}s
        </p>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import AuthCard from '~/components/auth/AuthCard.vue';
import AuthInput from '~/components/auth/AuthInput.vue';
import AuthButton from '~/components/auth/AuthButton.vue';

definePageMeta({
  layout: 'empty'
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Get email from query params
const email = ref((route.query.email as string) || '');

// Get redirect parameter from query
const redirectPath = computed(() => {
  const redirect = route.query.redirect as string;
  return redirect || null;
});

// Redirect if no email provided
onMounted(() => {
  if (!email.value) {
    router.push('/login');
  }
});

// Form state
const verificationCode = ref('');
const loading = ref(false);
const resending = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const codeError = ref('');

// Resend cooldown (60 seconds)
const resendCooldown = ref(60);
const canResend = computed(() => resendCooldown.value <= 0);
const resendCountdown = computed(() => resendCooldown.value);

let countdownInterval: NodeJS.Timeout | null = null;

const startResendCooldown = () => {
  resendCooldown.value = 60;
  
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  countdownInterval = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    }
  }, 1000);
};

onMounted(() => {
  startResendCooldown();
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

const validateForm = () => {
  codeError.value = '';
  errorMessage.value = '';
  
  if (!verificationCode.value) {
    codeError.value = 'Verification code is required';
    return false;
  }
  
  if (!/^\d{6}$/.test(verificationCode.value)) {
    codeError.value = 'Please enter a valid 6-digit code';
    return false;
  }
  
  return true;
};

const handleVerify = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    const result = await authStore.confirmSignUp(email.value, verificationCode.value);
    
    if (result.success) {
      successMessage.value = 'Email verified successfully! Redirecting...';
      
      // Wait a moment then redirect
      setTimeout(async () => {
        // Check if user is automatically signed in after verification
        await authStore.checkAuthStatus();
        
        if (authStore.isAuthenticated) {
          // User is auto-signed in, redirect to intended destination or home
          const destination = redirectPath.value || '/';
          router.push(destination);
        } else {
          // User needs to sign in, redirect to login with redirect parameter
          const loginUrl = redirectPath.value 
            ? `/login?redirect=${encodeURIComponent(redirectPath.value)}`
            : '/login';
          router.push(loginUrl);
        }
      }, 1500);
    } else {
      errorMessage.value = result.error || 'Failed to verify email';
      
      // If code expired, allow immediate resend
      if (result.code === 'ExpiredCodeException') {
        resendCooldown.value = 0;
      }
    }
  } catch (error: any) {
    console.error('Verification error:', error);
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleResendCode = async () => {
  resending.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    const result = await authStore.resendSignUpCode(email.value);
    
    if (result.success) {
      successMessage.value = 'Verification code sent! Please check your email.';
      startResendCooldown();
      
      // Clear success message after a few seconds
      setTimeout(() => {
        successMessage.value = '';
      }, 5000);
    } else {
      errorMessage.value = result.error || 'Failed to resend code';
    }
  } catch (error: any) {
    console.error('Resend code error:', error);
    errorMessage.value = 'An unexpected error occurred. Please try again.';
  } finally {
    resending.value = false;
  }
};
</script>

<style scoped>
.email-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--color-gold-50);
  border: 1px solid var(--color-gold-200);
  color: var(--color-gold-900);
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
}

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

.resend-section {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

a:hover {
  text-decoration: underline;
}
</style>

