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

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <BaseInput v-model="email" type="email" label="Email Address" placeholder="you@example.com"
              autocomplete="email" :has-icon="true" :aria-invalid="!!errors" required>
              <template #iconLeft>
                <AtSymbolIcon class="w-5 h-5 text-blue-500" />
              </template>
            </BaseInput>
            <p v-if="errors.email" class="text-xs text-red-600 mt-1 ml-1">{{ errors.email }}</p>
          </div>

          <BaseButton type="submit" class="w-full" :disabled="loading">
            <template v-if="loading">
              <ArrowPathIcon v-if="loading" class="w-5 h-5 mr-2 animate-spin inline-block" />
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
import { EnvelopeIcon, AtSymbolIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'

const email = ref('')
const loading = ref(false)
const { success, error } = useNotification()

const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
})
const { validate, errors } = useValidation(schema)

const handleSubmit = async () => {
  if (!validate({ email: email.value })) return
  loading.value = true
  try {

    await useApi('/auth/forgot-password', {
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
