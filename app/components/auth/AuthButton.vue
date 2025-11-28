<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="auth-button"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="auth-button-spinner">
      <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
    </span>
    <span v-if="icon && !loading" class="auth-button-icon">
      <UIcon :name="icon" class="w-5 h-5" />
    </span>
    <span class="auth-button-text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'ghost' | 'link';
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  type?: 'button' | 'submit';
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  loading: false,
  disabled: false,
  block: false,
  type: 'button'
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => ({
  'auth-button-primary': props.variant === 'primary',
  'auth-button-ghost': props.variant === 'ghost',
  'auth-button-link': props.variant === 'link',
  'auth-button-block': props.block,
  'auth-button-loading': props.loading,
  'auth-button-disabled': props.disabled
}));
</script>

<style scoped>
.auth-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  border: none;
  outline: none;
}

.auth-button:focus-visible {
  outline: 2px solid var(--color-gold-400);
  outline-offset: 2px;
}

.auth-button-block {
  width: 100%;
}

.auth-button-primary {
  background: linear-gradient(135deg, var(--color-gold-600), var(--color-gold-700));
  color: white;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);
}

.auth-button-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-gold-700), var(--color-gold-800));
  box-shadow: 0 6px 16px rgba(212, 175, 55, 0.35);
  transform: translateY(-1px);
}

.auth-button-primary:active:not(:disabled) {
  transform: translateY(0);
}

.auth-button-ghost {
  background: transparent;
  color: var(--color-gold-700);
  border: 2px solid var(--color-gold-300);
}

.auth-button-ghost:hover:not(:disabled) {
  background: var(--color-gold-50);
  border-color: var(--color-gold-400);
  color: var(--color-gold-800);
}

.auth-button-link {
  background: transparent;
  color: var(--color-gold-700);
  padding: 0.5rem 0.75rem;
  font-weight: 500;
}

.auth-button-link:hover:not(:disabled) {
  color: var(--color-gold-600);
  text-decoration: underline;
}

.auth-button-disabled,
.auth-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.auth-button-loading {
  cursor: wait;
}

.auth-button-spinner {
  display: inline-flex;
  align-items: center;
}

.auth-button-icon {
  display: inline-flex;
  align-items: center;
}

.auth-button-text {
  display: inline-flex;
  align-items: center;
}
</style>

