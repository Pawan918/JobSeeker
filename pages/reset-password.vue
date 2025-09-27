<template>
    <div class="max-w-md mx-auto px-6 py-12">
        <div class="bg-white shadow-md border border-gray-200 rounded-2xl p-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <LockClosedIcon class="h-6 w-6 text-blue-600" />
                Reset Password
            </h1>

            <p class="text-sm text-gray-600 mb-6">
                Enter your new password to reset your account access.
            </p>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <BaseInput v-model="password" type="password" label="New Password" placeholder="Enter a new password"
                    autocomplete="new-password" required>
                    <template #iconLeft>
                        <KeyIcon class="w-5 h-5 text-blue-500" />
                    </template>
                    <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
                </BaseInput>

                <BaseButton type="submit" class="w-full" :disabled="loading">
                    <template v-if="loading">Resetting...</template>
                    <template v-else>
                        <span class="flex gap-2 items-center">
                            <LockClosedIcon class="w-4 h-4" /> Reset Password
                        </span>
                    </template>
                </BaseButton>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LockClosedIcon, KeyIcon } from '@heroicons/vue/24/solid'
import { z } from 'zod'
import BaseInput from '~/components/BaseInput.vue'
import BaseButton from '~/components/BaseButton.vue'
import { useNotification } from '~/composables/useNotification'

const password = ref('')
const loading = ref(false)
const route = useRoute()
const router = useRouter()
const { success, error } = useNotification()

const token = route.query.token as string | undefined

onMounted(() => {
    if (!token) {
        error('❌ Invalid or expired reset link.')
        router.push('/forgot-password')
    }
})

const passwordSchema = z.object({
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(64, 'Password too long'),
})
const { validate, errors } = useValidation(passwordSchema)

const handleSubmit = async () => {
    if (!validate({ password: password.value })) return
    loading.value = true
    try {
        await useApi('/auth/reset-password', {
            method: 'POST',
            body: {
                token,
                password: password.value,
            },
        })
        success('✅ Your password has been reset successfully.')
        router.push('/login')
    } catch (err: any) {
        error(err?.data?.error || '❌ Something went wrong.')
    } finally {
        loading.value = false
    }
}
</script>
