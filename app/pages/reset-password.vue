<template>
  <AuthCard title="Reset Password" subtitle="Enter the code and your new password">
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
        <span>Enter the verification code from your email and choose a new password.</span>
      </div>
      
      <form @submit.prevent="handleResetPassword" class="space-y-4">
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
        
        <!-- New password field -->
        <AuthInput
          v-model="newPassword"
          type="password"
          label="New Password"
          placeholder="Create a strong password"
          :error="passwordError"
          :disabled="loading"
          required
          autocomplete="new-password"
        />
        
        <!-- Password strength indicator -->
        <PasswordStrength :password="newPassword" />
        
        <!-- Confirm password field -->
        <AuthInput
          v-model="confirmPassword"
          type="password"
          label="Confirm New Password"
          placeholder="Re-enter your password"
          :error="confirmPasswordError"
          :disabled="loading"
          required
          autocomplete="new-password"
        />
        
        <!-- Reset password button -->
        <AuthButton
          type="submit"
          variant="primary"
          :loading="loading"
          :disabled="loading || !isPasswordStrong"
          block
          icon="i-heroicons-lock-closed"
        >
          Reset Password
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
import PasswordStrength from '~/components/auth/PasswordStrength.vue';

definePageMeta({
  layout: 'empty'
});

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Get email from query params
const email = ref((route.query.email as string) || '');

// Redirect if no email provided
onMounted(() => {
  if (!email.value) {
    router.push('/forgot-password');
  }
});

// Form state
const verificationCode = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const resending = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const codeError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// Password validation
const hasMinLength = computed(() => newPassword.value.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(newPassword.value));
const hasLowercase = computed(() => /[a-z]/.test(newPassword.value));
const hasNumber = computed(() => /[0-9]/.test(newPassword.value));
const hasSpecialChar = computed(() => /[^A-Za-z0-9]/.test(newPassword.value));

const isPasswordStrong = computed(() => {
  return hasMinLength.value && 
         hasUppercase.value && 
         hasLowercase.value && 
         hasNumber.value && 
         hasSpecialChar.value;
});

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
  let isValid = true;
  codeError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
  errorMessage.value = '';
  
  if (!verificationCode.value) {
    codeError.value = 'Verification code is required';
    isValid = false;
  } else if (!/^\d{6}$/.test(verificationCode.value)) {
    codeError.value = 'Please enter a valid 6-digit code';
    isValid = false;
  }
  
  if (!newPassword.value) {
    passwordError.value = 'Password is required';
    isValid = false;
  } else if (!isPasswordStrong.value) {
    passwordError.value = 'Password does not meet all requirements';
    isValid = false;
  }
  
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password';
    isValid = false;
  } else if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match';
    isValid = false;
  }
  
  return isValid;
};

const handleResetPassword = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  try {
    const result = await authStore.confirmResetPassword(
      email.value,
      verificationCode.value,
      newPassword.value
    );
    
    if (result.success) {
      successMessage.value = 'Password reset successfully! Redirecting to login...';
      
      // Wait a moment then redirect to login
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 2000);
    } else {
      errorMessage.value = result.error || 'Failed to reset password';
      
      // If code expired, allow immediate resend
      if (result.code === 'ExpiredCodeException') {
        resendCooldown.value = 0;
      }
    }
  } catch (error: any) {
    console.error('Reset password error:', error);
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
    const result = await authStore.resetPassword(email.value);
    
    if (result.success) {
      successMessage.value = 'Reset code sent! Please check your email.';
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

