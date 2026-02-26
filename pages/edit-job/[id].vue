<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <div class="bg-white shadow-md border border-gray-200 rounded-2xl p-8 dark:bg-zinc-900 dark:border-zinc-800">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3 dark:text-zinc-100">
        <PencilSquareIcon class="w-10 h-10" /> Edit Job
      </h1>

      <form @submit.prevent="updateJob" class="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <FormField label="Job Title">
          <input v-model="form.title" type="text" class="form-input" required />
        </FormField>

        <FormField label="Company">
          <input v-model="form.company" type="text" class="form-input" required />
        </FormField>

        <FormField label="Location">
          <input v-model="form.location" type="text" class="form-input" required />
        </FormField>

        <FormField label="Job Type">
          <select v-model="form.type" class="form-input">
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="freelance">Freelance</option>
          </select>
        </FormField>

        <FormField label="Tags (comma separated)">
          <input v-model="form.tags" type="text" class="form-input" />
        </FormField>

        <FormField label="Description" class="sm:col-span-2">
          <textarea v-model="form.description" rows="5" class="form-input" required></textarea>
        </FormField>

        <div class="sm:col-span-2 flex justify-end pt-2">
          <BaseButton variant="primary" size="md" :disabled="loading" type="submit">
            <div class="flex items-center gap-2">
              <div v-if="loading" class="flex items-center gap-2">
                <ArrowPathIcon class="w-5 h-5 mr-2 animate-spin inline-block" />
                <span>
                  Updating...
                </span>
              </div>
              <div v-else class="flex items-center gap-2">
                <RocketLaunchIcon class="w-4 h-4" />
                <span>
                  Update Job
                </span>
              </div>
            </div>
          </BaseButton>
        </div>
      </form>

      <p v-if="successMessage" class="text-green-600 text-sm mt-6 dark:text-green-400">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RocketLaunchIcon, PencilSquareIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'
import { useRoute, useRouter } from 'vue-router'
import FormField from '~/components/FormField.vue'

const toast = useNotification()
const { token, isAuthenticated } = useAuth()
const route = useRoute()
const router = useRouter()

const jobId = Number(route.params.id)

const form = ref({
  title: '',
  company: '',
  location: '',
  type: 'full-time',
  tags: '',
  description: '',
})

const loading = ref(false)
const successMessage = ref('')

const fetchJob = async () => {
  try {
    const data = await useApi(`/jobs/${jobId}`)

    form.value = {
      title: data.title,
      company: data.company,
      location: data.location,
      type: data.type,
      tags: data.tags.join(', '),
      description: data.description,
    }
  } catch (error: any) {
    toast.error('Network Error');
  }
}

const updateJob = async () => {
  if (!isAuthenticated.value) {
    toast.info('Please log in update jobs')
    return router.push('/login')
  }

  loading.value = true
  try {
    const body = {
      ...form.value,
      tags: form.value.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    }

    await useApi(`/jobs/${jobId}`, {
      method: 'PUT',
      body,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    successMessage.value = '✅ Job updated successfully!'
    toast.success('Job updated successfully')
    setTimeout(() => router.push('/my-jobs'), 1500)
  } catch (err: any) {
    toast.error('Network Error');
  } finally {
    loading.value = false
  }
}

onMounted(fetchJob)
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

.dark .form-input {
  border-color: #3f3f46;
  background-color: #18181b;
  color: #f4f4f5;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.dark .form-input:focus {
  border-color: #22d3ee;
  box-shadow: 0 0 0 2px rgba(34, 211, 238, 0.25);
}
</style>
