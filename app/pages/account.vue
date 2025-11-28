<template>
  <UContainer class="py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      <!-- Personal Information Section -->
      <UCard class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900">Personal Information</h2>
        </template>

        <UForm :state="personalInfoState" @submit="updatePersonalInfo">
          <div class="mb-6">
            <AuthInput
              v-model="personalInfoState.given_name"
              type="text"
              label="First Name"
              placeholder="Enter your first name"
              :disabled="loadingPersonalInfo"
            />
          </div>

          <div class="mb-6">
            <AuthInput
              v-model="personalInfoState.family_name"
              type="text"
              label="Last Name"
              placeholder="Enter your last name"
              :disabled="loadingPersonalInfo"
            />
          </div>

          <div class="mb-6">
            <AuthInput
              v-model="personalInfoState.email"
              type="email"
              label="Email"
              placeholder="Your email"
              disabled
            />
            <div class="mt-3 flex items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
              <UIcon name="i-heroicons-information-circle" class="h-4 w-4 flex-shrink-0" />
              <span>Email cannot be changed</span>
            </div>
          </div>

          <div class="flex justify-end mt-8">
            <UButton 
              type="submit" 
              color="primary"
              :loading="loadingPersonalInfo"
              :disabled="loadingPersonalInfo"
            >
              Save Changes
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Password Section -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900">Change Password</h2>
        </template>

        <UForm :state="passwordState" @submit="changePassword" class="space-y-6">
          <AuthInput
            v-model="passwordState.oldPassword"
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            :disabled="loadingPassword"
            autocomplete="current-password"
            required
          />

          <div class="space-y-4">
            <AuthInput
              v-model="passwordState.newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              :disabled="loadingPassword"
              autocomplete="new-password"
              required
            />

            <PasswordStrength :password="passwordState.newPassword" />
          </div>

          <AuthInput
            v-model="passwordState.confirmPassword"
            type="password"
            label="Confirm New Password"
            placeholder="Confirm new password"
            :disabled="loadingPassword"
            autocomplete="new-password"
            required
          />

          <div class="flex justify-end mt-8">
            <UButton 
              type="submit" 
              color="primary"
              :loading="loadingPassword"
              :disabled="loadingPassword || !isPasswordStrong"
            >
              Update Password
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { updatePassword, updateUserAttributes } from 'aws-amplify/auth'
import AuthInput from '~/components/auth/AuthInput.vue'
import PasswordStrength from '~/components/auth/PasswordStrength.vue'
import { useUserStore } from '~/stores/user'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth'
})

const userStore = useUserStore()
const authStore = useAuthStore()
const toast = useToast()

// Personal Information State
const personalInfoState = reactive({
  given_name: '',
  family_name: '',
  email: ''
})

const loadingPersonalInfo = ref(false)

// Password State
const passwordState = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loadingPassword = ref(false)

const hasMinLength = computed(() => passwordState.newPassword.length >= 8)
const hasUppercase = computed(() => /[A-Z]/.test(passwordState.newPassword))
const hasLowercase = computed(() => /[a-z]/.test(passwordState.newPassword))
const hasNumber = computed(() => /[0-9]/.test(passwordState.newPassword))
const hasSpecialChar = computed(() => /[^A-Za-z0-9]/.test(passwordState.newPassword))

const isPasswordStrong = computed(() => {
  return (
    hasMinLength.value &&
    hasUppercase.value &&
    hasLowercase.value &&
    hasNumber.value &&
    hasSpecialChar.value
  )
})

// Initialize user data
onMounted(async () => {
  await userStore.initUser()
  
  if (userStore.userData) {
    personalInfoState.given_name = userStore.userData.given_name || ''
    personalInfoState.family_name = userStore.userData.family_name || ''
    personalInfoState.email = userStore.userData.email || ''
  }
})

// Update Personal Info
const updatePersonalInfo = async () => {
  loadingPersonalInfo.value = true
  
  try {
    // Update Cognito user attributes
    await updateUserAttributes({
      userAttributes: {
        given_name: personalInfoState.given_name,
        family_name: personalInfoState.family_name
      }
    })

    // Update DynamoDB user record
    const success = await userStore.updateUserData({
      given_name: personalInfoState.given_name,
      family_name: personalInfoState.family_name
    })

    if (success) {
      toast.add({
        title: 'Success',
        description: 'Personal information updated successfully',
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Error',
        description: 'Failed to update personal information',
        color: 'error'
      })
    }
  } catch (error) {
    console.error('Error updating personal info:', error)
    
    let errorMessage = 'An error occurred while updating your information'
    if (error instanceof Error && error.message) {
      errorMessage = error.message
    }
    
    toast.add({
      title: 'Error',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    loadingPersonalInfo.value = false
  }
}

// Change Password
const changePassword = async () => {
  // Validate passwords
  if (passwordState.newPassword.length < 8) {
    toast.add({
      title: 'Validation Error',
      description: 'Password must be at least 8 characters long',
      color: 'error'
    })
    return
  }

  if (passwordState.newPassword !== passwordState.confirmPassword) {
    toast.add({
      title: 'Validation Error',
      description: 'New passwords do not match',
      color: 'error'
    })
    return
  }

  if (!isPasswordStrong.value) {
    toast.add({
      title: 'Validation Error',
      description: 'Password must meet all security requirements',
      color: 'error'
    })
    return
  }

  loadingPassword.value = true

  try {
    await updatePassword({
      oldPassword: passwordState.oldPassword,
      newPassword: passwordState.newPassword
    })

    toast.add({
      title: 'Success',
      description: 'Password updated successfully',
      color: 'success'
    })

    // Clear password form
    passwordState.oldPassword = ''
    passwordState.newPassword = ''
    passwordState.confirmPassword = ''
  } catch (error: any) {
    console.error('Error updating password:', error)
    
    let errorMessage = 'Failed to update password'
    
    if (error.name === 'NotAuthorizedException') {
      errorMessage = 'Current password is incorrect'
    } else if (error.name === 'InvalidPasswordException') {
      errorMessage = 'Password does not meet requirements'
    } else if (error.message) {
      errorMessage = error.message
    }

    toast.add({
      title: 'Error',
      description: errorMessage,
      color: 'error'
    })
  } finally {
    loadingPassword.value = false
  }
}
</script>

