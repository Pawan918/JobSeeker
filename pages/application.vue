<template>
  <div class="max-w-6xl mx-auto px-6 py-12">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">📄 My Job Applications</h1>

    <div v-if="applications.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="app in applications" :key="app.id"
        class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6">
        <h2 class="text-xl font-semibold text-blue-700 mb-1">{{ app.job.title }}</h2>
        <p class="text-gray-600 text-sm mb-1">{{ app.job.company }} · {{ app.job.location }}</p>
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

        <p class="text-sm text-gray-400">
          Applied on: <span class="font-medium">{{ formatDate(app.createdAt) }}</span>
        </p>
      </div>
    </div>

    <p v-else class="text-center text-gray-500 mt-20 text-lg">
      You haven’t applied to any jobs yet.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Application } from '~/types/index'
const { token } = useAuth()

const applications: Ref<Application[]> = ref([])

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const { data, error } = await useAsyncData('my-applications', async () => {
  if (!token.value) return []
  const res = await useApi<Application[]>('/my-applications', {
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
