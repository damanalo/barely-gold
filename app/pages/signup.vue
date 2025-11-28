<template>
  <AuthCard title="Create Account" subtitle="Join Barely Gold and discover timeless elegance">
    <form @submit.prevent="handleSignUp" class="space-y-4">
      <!-- Error message -->
      <div v-if="errorMessage" class="error-alert">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
        <span>{{ errorMessage }}</span>
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
      
      <!-- Name field (optional) -->
      <AuthInput
        v-model="name"
        type="text"
        label="Full Name"
        placeholder="John Doe"
        :error="nameError"
        :disabled="loading"
        autocomplete="name"
      />
      
      <!-- Password field -->
      <AuthInput
        v-model="password"
        type="password"
        label="Password"
        placeholder="Create a strong password"
        :error="passwordError"
        :disabled="loading"
        required
        autocomplete="new-password"
      />
      
      <!-- Password strength indicator -->
      <PasswordStrength :password="password" />
      
      <!-- Confirm password field -->
      <AuthInput
        v-model="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Re-enter your password"
        :error="confirmPasswordError"
        :disabled="loading"
        required
        autocomplete="new-password"
      />
      
      <!-- Terms and conditions -->
      <div class="flex items-start gap-3 pt-2">
        <input
          id="terms"
          v-model="acceptedTerms"
          type="checkbox"
          class="terms-checkbox"
          :disabled="loading"
        />
        <label for="terms" class="terms-label">
          I agree to the
          <NuxtLink to="/terms-and-conditions" target="_blank" class="terms-link">
            Terms and Conditions
          </NuxtLink>
        </label>
      </div>
      <p v-if="termsError" class="error-text">{{ termsError }}</p>
      
      <!-- Sign up button -->
      <AuthButton
        type="submit"
        variant="primary"
        :loading="loading"
        :disabled="loading || !isPasswordStrong"
        block
        icon="i-heroicons-user-plus"
      >
        Create Account
      </AuthButton>
      
      <!-- Sign in link -->
      <div class="text-center pt-4 border-t" style="border-color: var(--color-gold-100);">
        <p class="text-gray-600 text-sm">
          Already have an account?
          <NuxtLink 
            to="/login" 
            class="font-semibold ml-1"
            style="color: var(--color-gold-700);"
          >
            Sign In
          </NuxtLink>
        </p>
      </div>
    </form>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import AuthCard from '~/components/auth/AuthCard.vue';
import AuthInput from '~/components/auth/AuthInput.vue';
import AuthButton from '~/components/auth/AuthButton.vue';
import PasswordStrength from '~/components/auth/PasswordStrength.vue';

definePageMeta({
  layout: 'empty'
});

const authStore = useAuthStore();
const router = useRouter();

// Get config to check if coming soon is enabled
const { public: config } = useRuntimeConfig();
const showComingSoon = computed(() => String(config.showComingSoon) === 'true');

// Check if signup should be blocked
onMounted(() => {
  if (showComingSoon.value) {
    router.push('/coming-soon');
  }
});

// Form state
const email = ref('');
const name = ref('');
const password = ref('');
const confirmPassword = ref('');
const acceptedTerms = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const emailError = ref('');
const nameError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const termsError = ref('');

// Password validation
const hasMinLength = computed(() => password.value.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(password.value));
const hasLowercase = computed(() => /[a-z]/.test(password.value));
const hasNumber = computed(() => /[0-9]/.test(password.value));
const hasSpecialChar = computed(() => /[^A-Za-z0-9]/.test(password.value));

const isPasswordStrong = computed(() => {
  return hasMinLength.value && 
         hasUppercase.value && 
         hasLowercase.value && 
         hasNumber.value && 
         hasSpecialChar.value;
});

const validateForm = () => {
  let isValid = true;
  emailError.value = '';
  nameError.value = '';
  passwordError.value = '';
  confirmPasswordError.value = '';
  termsError.value = '';
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
  } else if (!isPasswordStrong.value) {
    passwordError.value = 'Password does not meet all requirements';
    isValid = false;
  }
  
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Please confirm your password';
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match';
    isValid = false;
  }
  
  if (!acceptedTerms.value) {
    termsError.value = 'You must accept the terms and conditions';
    isValid = false;
  }
  
  return isValid;
};

const handleSignUp = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const result = await authStore.signUp(
      email.value,
      password.value,
      name.value || undefined
    );
    
    if (result.success) {
      // Redirect to verify email page
      router.push(`/verify-email?email=${encodeURIComponent(email.value)}`);
    } else {
      errorMessage.value = result.error || 'Failed to create account';
    }
  } catch (error: any) {
    console.error('Sign up error:', error);
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

.terms-checkbox {
  width: 1.125rem;
  height: 1.125rem;
  border: 2px solid var(--color-gold-300);
  border-radius: 0.25rem;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 0.125rem;
  accent-color: var(--color-gold-600);
}

.terms-checkbox:checked {
  background-color: var(--color-gold-600);
  border-color: var(--color-gold-600);
}

.terms-checkbox:focus {
  outline: 2px solid var(--color-gold-400);
  outline-offset: 2px;
}

.terms-checkbox:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.terms-label {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
}

.terms-link {
  color: var(--color-gold-700);
  font-weight: 500;
  text-decoration: underline;
}

.terms-link:hover {
  color: var(--color-gold-600);
}

.error-text {
  color: #EF4444;
  font-size: 0.875rem;
  margin-top: -0.75rem;
}

a:hover {
  text-decoration: underline;
}
</style>

