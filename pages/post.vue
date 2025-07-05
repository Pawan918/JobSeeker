<template>
    <div class="max-w-4xl mx-auto px-6 py-12">
        <div class="bg-white shadow-md border border-gray-200 rounded-2xl p-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <MegaphoneIcon class="h-7 w-7 text-blue-600" />
                Post a New Job Opening
            </h1>

            <form @submit.prevent="submitJob" class="grid gap-6 grid-cols-1 sm:grid-cols-2">

                <BaseInput v-model="form.title" label="Job Title" placeholder="e.g. Senior Vue Developer"
                    :has-icon="true" :error="errors.title">
                    <template #icon>
                        <BriefcaseIcon class="w-5 h-5 text-blue-500" />
                    </template>
                </BaseInput>

                <BaseInput v-model="form.company" label="Company" placeholder="e.g. TechNova" :has-icon="true"
                    :error="errors.company">
                    <template #icon>
                        <BuildingOfficeIcon class="w-5 h-5 text-blue-500" />
                    </template>
                </BaseInput>

                <BaseInput v-model="form.location" label="Location" placeholder="e.g. Remote / Bangalore"
                    :has-icon="true" :error="errors.location">
                    <template #icon>
                        <MapPinIcon class="w-5 h-5 text-blue-500" />
                    </template>
                </BaseInput>

                <BaseSelect v-model="form.type" label="Job Type" :options="jobTypeOptions" placeholder="Select job type"
                    :error="errors.type" />

                <BaseInput v-model="form.tags" label="Tags (comma separated)" placeholder="e.g. vue, nuxt, tailwind"
                    :has-icon="true">
                    <template #icon>
                        <TagIcon class="w-5 h-5 text-blue-500" />
                    </template>
                </BaseInput>

                <FormField label="Description" class="sm:col-span-2">
                    <textarea v-model="form.description" rows="5"
                        placeholder="Write a short description about the job..." class="form-input" />
                    <p v-if="errors.description" class="text-red-600 text-xs mt-1">{{ errors.description }}</p>
                </FormField>

                <div class="sm:col-span-2 flex justify-end pt-2">
                    <BaseButton type="submit" :disabled="loading">
                        <template v-if="loading">Posting...</template>
                        <template v-else>
                            <RocketLaunchIcon class="h-5 w-5 mr-1" />
                            Post Job
                        </template>
                    </BaseButton>
                </div>
            </form>

            <p v-if="successMessage" class="text-green-600 text-sm mt-6">{{ successMessage }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    MegaphoneIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    TagIcon,
    RocketLaunchIcon,
} from '@heroicons/vue/24/solid'
import BaseInput from '~/components/BaseInput.vue'
import BaseSelect from '~/components/BaseSelect.vue'
import BaseButton from '~/components/BaseButton.vue'
import FormField from '~/components/FormField.vue'
import { z } from 'zod'

const { user, token, isAuthenticated } = useAuth()
const router = useRouter()
const toast = useNotification()

const form = ref({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    tags: '',
    description: '',
})

const jobSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    company: z.string().min(2, 'Company must be at least 2 characters'),
    location: z.string().min(2, 'Location must be at least 2 characters'),
    type: z.enum(['full-time', 'part-time', 'freelance'], {
        errorMap: () => ({ message: 'Select a valid job type' }),
    }),
    tags: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
})

const errors = reactive<Record<string, string | undefined>>({})
const successMessage = ref('')
const loading = ref(false)

const jobTypeOptions = [
    { label: 'Full Time', value: 'full-time' },
    { label: 'Part Time', value: 'part-time' },
    { label: 'Freelance', value: 'freelance' },
]

const submitJob = async () => {
    if (!isAuthenticated.value) {
        toast.info('Please login to post job')
        return router.push('/login')
    }

    const parseResult = jobSchema.safeParse(form.value)
    Object.keys(errors).forEach(k => (errors[k] = undefined))

    if (!parseResult.success) {
        const flattened = parseResult.error.flatten().fieldErrors
        Object.assign(errors, flattened)
        return
    }

    loading.value = true

    try {
        const body = {
            ...parseResult.data,
            tags: parseResult.data.tags
                ? parseResult.data.tags.split(',').map(t => t.trim()).filter(Boolean)
                : [],
        }

        await useApi('/jobs', {
            method: 'POST',
            body,
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        })

        successMessage.value = '✅ Job posted successfully!'
        Object.assign(form.value, {
            title: '',
            company: '',
            location: '',
            type: 'full-time',
            tags: '',
            description: '',
        })
    } catch (error: any) {
        toast.error('Network error')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.form-input {
    display: block;
    width: 100%;
    border-radius: 0.5rem;
    border: 1px solid #d1d5db;
    padding: 0.5rem 0.75rem;
    font-size: 0.95rem;
    color: #111827;
    background-color: white;
    transition: border-color 0.2s ease;
}

.form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}
</style>