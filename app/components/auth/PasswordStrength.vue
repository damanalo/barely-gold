<template>
  <div v-if="password" class="password-strength-wrapper">
    <!-- Strength meter -->
    <div class="strength-meter">
      <div class="strength-meter-bars">
        <div 
          v-for="i in 4" 
          :key="i" 
          class="strength-meter-bar"
          :class="{
            'strength-meter-bar-weak': strength >= 1 && i <= 1 && strength < 2,
            'strength-meter-bar-fair': strength >= 2 && i <= 2 && strength < 3,
            'strength-meter-bar-good': strength >= 3 && i <= 3 && strength < 4,
            'strength-meter-bar-strong': strength >= 4 && i <= 4
          }"
        ></div>
      </div>
      <p class="strength-meter-label" :class="strengthLabelClass">
        {{ strengthLabel }}
      </p>
    </div>
    
    <!-- Requirements checklist -->
    <div class="requirements-list">
      <div class="requirement-item" :class="{ 'requirement-met': hasMinLength }">
        <UIcon 
          :name="hasMinLength ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
          class="w-4 h-4"
        />
        <span>At least 8 characters</span>
      </div>
      <div class="requirement-item" :class="{ 'requirement-met': hasUppercase }">
        <UIcon 
          :name="hasUppercase ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
          class="w-4 h-4"
        />
        <span>One uppercase letter</span>
      </div>
      <div class="requirement-item" :class="{ 'requirement-met': hasLowercase }">
        <UIcon 
          :name="hasLowercase ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
          class="w-4 h-4"
        />
        <span>One lowercase letter</span>
      </div>
      <div class="requirement-item" :class="{ 'requirement-met': hasNumber }">
        <UIcon 
          :name="hasNumber ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
          class="w-4 h-4"
        />
        <span>One number</span>
      </div>
      <div class="requirement-item" :class="{ 'requirement-met': hasSpecialChar }">
        <UIcon 
          :name="hasSpecialChar ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'" 
          class="w-4 h-4"
        />
        <span>One special character</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  password: string;
}

const props = defineProps<Props>();

// Password requirement checks
const hasMinLength = computed(() => props.password.length >= 8);
const hasUppercase = computed(() => /[A-Z]/.test(props.password));
const hasLowercase = computed(() => /[a-z]/.test(props.password));
const hasNumber = computed(() => /[0-9]/.test(props.password));
const hasSpecialChar = computed(() => /[^A-Za-z0-9]/.test(props.password));

// Calculate strength (0-4)
const strength = computed(() => {
  let score = 0;
  if (hasMinLength.value) score++;
  if (hasUppercase.value && hasLowercase.value) score++;
  if (hasNumber.value) score++;
  if (hasSpecialChar.value) score++;
  return score;
});

const strengthLabel = computed(() => {
  if (strength.value === 0) return 'Very Weak';
  if (strength.value === 1) return 'Weak';
  if (strength.value === 2) return 'Fair';
  if (strength.value === 3) return 'Good';
  return 'Strong';
});

const strengthLabelClass = computed(() => ({
  'strength-label-weak': strength.value <= 1,
  'strength-label-fair': strength.value === 2,
  'strength-label-good': strength.value === 3,
  'strength-label-strong': strength.value === 4
}));
</script>

<style scoped>
.password-strength-wrapper {
  margin-top: 0.75rem;
  padding: 1rem;
  background-color: #F9FAFB;
  border-radius: 0.5rem;
  border: 1px solid #E5E7EB;
}

.strength-meter {
  margin-bottom: 1rem;
}

.strength-meter-bars {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.strength-meter-bar {
  flex: 1;
  height: 6px;
  background-color: #E5E7EB;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.strength-meter-bar-weak {
  background-color: #EF4444;
}

.strength-meter-bar-fair {
  background-color: #F59E0B;
}

.strength-meter-bar-good {
  background-color: #10B981;
}

.strength-meter-bar-strong {
  background-color: var(--color-gold-600);
}

.strength-meter-label {
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
}

.strength-label-weak {
  color: #EF4444;
}

.strength-label-fair {
  color: #F59E0B;
}

.strength-label-good {
  color: #10B981;
}

.strength-label-strong {
  color: var(--color-gold-600);
}

.requirements-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6B7280;
  transition: all 0.2s;
}

.requirement-met {
  color: #10B981;
}

.requirement-item :deep(svg) {
  flex-shrink: 0;
}
</style>

