<template>
  <div class="auth-input-wrapper">
    <label v-if="label" :for="inputId" class="auth-label">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        :type="computedType"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :disabled="disabled"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        class="auth-input"
        :class="{
          'auth-input-error': error,
          'auth-input-disabled': disabled,
          'pr-12': type === 'password'
        }"
      />
      
      <!-- Password visibility toggle -->
      <button
        v-if="type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="auth-password-toggle"
        :disabled="disabled"
        tabindex="-1"
      >
        <UIcon 
          :name="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" 
          class="w-5 h-5"
        />
      </button>
    </div>
    
    <p v-if="error" class="auth-error-message">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  modelValue: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autocomplete?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const showPassword = ref(false);
const inputId = `auth-input-${Math.random().toString(36).substr(2, 9)}`;

const computedType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text';
  }
  return props.type;
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
.auth-input-wrapper {
  margin-bottom: 1.25rem;
  width: 100%;
}

.auth-label {
  display: block;
  color: #374151;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.auth-input {
  width: 100%;
  border: 2px solid #E5E7EB;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  transition: all 0.2s;
  background-color: white;
  color: #1F1F1F;
}

.auth-input:focus {
  border-color: var(--color-gold-400);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  outline: none;
}

.auth-input-error {
  border-color: #FCA5A5;
}

.auth-input-error:focus {
  border-color: #EF4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.auth-input-disabled {
  background-color: #F3F4F6;
  cursor: not-allowed;
  opacity: 0.6;
}

.auth-password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gold-600);
  background: transparent;
  border: 2px solid var(--color-gold-300);
  box-shadow: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;
}

.auth-password-toggle:hover:not(:disabled) {
  color: var(--color-gold-700);
  background: var(--color-gold-50);
  border-color: var(--color-gold-400);
}

.auth-password-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-error-message {
  color: #EF4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>

