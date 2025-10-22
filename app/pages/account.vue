<template>
  <UContainer class="py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

      <!-- Personal Information Section -->
      <UCard class="mb-6">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900">Personal Information</h2>
        </template>

        <UForm :state="personalInfoState" @submit="updatePersonalInfo" class="space-y-4">
          <UFormGroup label="First Name" name="given_name">
            <UInput 
              v-model="personalInfoState.given_name" 
              placeholder="Enter your first name"
              :disabled="loadingPersonalInfo"
            />
          </UFormGroup>

          <UFormGroup label="Last Name" name="family_name">
            <UInput 
              v-model="personalInfoState.family_name" 
              placeholder="Enter your last name"
              :disabled="loadingPersonalInfo"
            />
          </UFormGroup>

          <UFormGroup label="Email" name="email">
            <UInput 
              v-model="personalInfoState.email" 
              disabled
              placeholder="Your email"
              :ui="{ base: 'cursor-not-allowed opacity-75' }"
            />
            <template #help>
              <span class="text-xs text-gray-500">Email cannot be changed</span>
            </template>
          </UFormGroup>

          <div class="flex justify-end">
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

        <UForm :state="passwordState" @submit="changePassword" class="space-y-4">
          <UFormGroup label="Current Password" name="oldPassword" required>
            <UInput 
              v-model="passwordState.oldPassword" 
              type="password"
              placeholder="Enter current password"
              :disabled="loadingPassword"
            />
          </UFormGroup>

          <UFormGroup label="New Password" name="newPassword" required>
            <UInput 
              v-model="passwordState.newPassword" 
              type="password"
              placeholder="Enter new password"
              :disabled="loadingPassword"
            />
            <template #help>
              <span class="text-xs text-gray-500">Minimum 8 characters</span>
            </template>
          </UFormGroup>

          <UFormGroup label="Confirm New Password" name="confirmPassword" required>
            <UInput 
              v-model="passwordState.confirmPassword" 
              type="password"
              placeholder="Confirm new password"
              :disabled="loadingPassword"
            />
          </UFormGroup>

          <div class="flex justify-end">
            <UButton 
              type="submit" 
              color="primary"
              :loading="loadingPassword"
              :disabled="loadingPassword"
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
import { updatePassword } from 'aws-amplify/auth'
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
    const success = await userStore.updateUserData({
      given_name: personalInfoState.given_name,
      family_name: personalInfoState.family_name
    })

    if (success) {
      toast.add({
        title: 'Success',
        description: 'Personal information updated successfully',
        color: 'green'
      })
    } else {
      toast.add({
        title: 'Error',
        description: 'Failed to update personal information',
        color: 'red'
      })
    }
  } catch (error) {
    console.error('Error updating personal info:', error)
    toast.add({
      title: 'Error',
      description: 'An error occurred while updating your information',
      color: 'red'
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
      color: 'red'
    })
    return
  }

  if (passwordState.newPassword !== passwordState.confirmPassword) {
    toast.add({
      title: 'Validation Error',
      description: 'New passwords do not match',
      color: 'red'
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
      color: 'green'
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
      color: 'red'
    })
  } finally {
    loadingPassword.value = false
  }
}
</script>

