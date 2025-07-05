<template>
    <div class="h-full bg-gray-100 flex items-center justify-center px-4">
        <div class="max-w-md mx-auto px-6 py-12">
          <div class="bg-white shadow-lg border border-gray-200 rounded-2xl p-8 w-100">
            <h1 class="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <EnvelopeIcon class="h-6 w-6 text-blue-600" />
              Forgot Password
            </h1>
            <p class="text-sm text-gray-600 mb-8 leading-relaxed">
              Enter your registered email address. We'll send you a secure link to reset your password.
            </p>
      
            <form @submit.prevent="handleSubmit" class="space-y-5" novalidate>
              <div>
                <BaseInput
                  v-model="email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  autocomplete="email"
                  :has-icon="true"
                  :aria-invalid="!!errorMsg"
                  required
                >
                  <template #icon>
                    <AtSymbolIcon class="w-5 h-5 text-blue-500" />
                  </template>
                </BaseInput>
                <p v-if="errorMsg" class="text-xs text-red-600 mt-1 ml-1">{{ errorMsg }}</p>
              </div>
      
              <BaseButton type="submit" class="w-full" :disabled="loading">
                <template v-if="loading">
                  <svg class="animate-spin h-5 w-5 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Sending...
                </template>
                <template v-else>Send Reset Link</template>
              </BaseButton>
            </form>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useNotification } from '~/composables/useNotification'
import { EnvelopeIcon, AtSymbolIcon } from '@heroicons/vue/24/solid'

const email = ref('')
const errorMsg = ref('')
const loading = ref(false)
const { success, error } = useNotification()

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})

const handleSubmit = async () => {
  errorMsg.value = ''
  const result = schema.safeParse({ email: email.value })

  if (!result.success) {
    errorMsg.value = result.error.flatten().fieldErrors.email?.[0] || 'Invalid email'
    return
  }

  try {
    loading.value = true

    await useApi('/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })

    success('✅ Password reset link sent successfully.')
    email.value = ''
  } catch (err: any) {
    error(err?.data?.error || '❌ Failed to send reset email.')
  } finally {
    loading.value = false
  }
}
</script>
