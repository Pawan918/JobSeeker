<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3">
      <NewspaperIcon class="w-10 h-10 text-blue-600" /> My Job Applications
    </h1>

    <!-- Applications Grid -->
    <div v-if="applications.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="app in applications" :key="app.id"
        class="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between">
        <!-- Job Info -->
        <div>
          <NuxtLink :to="`/job/${app.job.id}`" class="text-xl font-semibold text-blue-700 hover:underline">
            {{ app.job.title }}
          </NuxtLink>
          <p class="text-gray-600 text-sm mt-1">
            {{ app.job.company }} · {{ app.job.location }}
          </p>
          <p class="text-gray-500 text-sm mb-4">{{ app.job.type.toUpperCase() }}</p>

          <p class="text-gray-700 text-sm line-clamp-3 mb-4">
            {{ app.job.description }}
          </p>

          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in app.job.tags" :key="tag"
              class="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Footer: Status + Dates -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span class="inline-block text-xs font-semibold px-2 py-1 rounded-full border" :class="{
            'bg-yellow-50 text-yellow-700 border-yellow-200': app.status === 'PENDING',
            'bg-green-50 text-green-700 border-green-200': app.status === 'ACCEPTED',
            'bg-red-50 text-red-700 border-red-200': app.status === 'REJECTED'
          }">
            {{ app.status }}
          </span>

          <div class="text-right text-xs text-gray-500">
            <p>
              Applied on:
              <span class="font-medium">{{ formatDate(app.createdAt) }}</span>
            </p>
            <p class="italic">{{ timeAgo(app.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <p v-else class="text-center text-gray-500 mt-20 text-lg">
      You haven’t applied to any jobs yet. 📭
    </p>
  </div>
</template>

<script setup lang="ts">
import { NewspaperIcon } from '@heroicons/vue/24/solid'
import type { Application } from '~/types/index'

const { token, isAuthenticated } = useAuth()
const applications: Ref<Application[]> = ref([])

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

const { data } = await useAsyncData('my-applications', async () => {
  if (!isAuthenticated.value) return []
  const res = await useApi<Application[]>('/applications/me', {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
  return res
})

watchEffect(() => {
  if (data.value) {
    applications.value = data.value
  }
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
