<template>
  <div class="max-w-7xl mx-auto px-6 py-12">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-3">
      <BookmarkIcon class="w-10 h-10 text-red-500" /> Bookmarked Jobs
    </h1>
    <div v-if="bookmarks && bookmarks.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="bookmark in bookmarks" :key="bookmark.id" :to="`/job/${bookmark.id}`" class="group bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition
               hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-blue-500">
        <h2 class="text-xl font-semibold text-blue-700 group-hover:underline">
          {{ bookmark.title }}
        </h2>
        <p class="text-sm text-gray-500 mt-1">
          {{ bookmark.company }} — {{ bookmark.location }}
        </p>
        <p class="mt-3 text-sm text-gray-600 line-clamp-3">
          {{ bookmark.description }}
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="tag in bookmark.tags" :key="tag"
            class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
            #{{ tag }}
          </span>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="text-center text-gray-500 mt-20">
      <BookmarkSlashIcon class="w-10 h-10 mx-auto text-gray-300 mb-4" />
      <p class="text-lg">No bookmarked jobs yet.</p>
      <NuxtLink to="/" class="inline-block mt-4 text-blue-600 hover:underline text-sm font-medium">
        ← Browse available jobs
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookmarkSlashIcon, BookmarkIcon } from '@heroicons/vue/24/solid'
import type { Job } from '~/types/index'

// Auth token
const { token, isAuthenticated } = useAuth()

const { data: bookmarks, error } = await useAsyncData<Job[]>('bookmarks', async () => {
  if (!isAuthenticated()) return []
  const res = await useApi<Job[]>('/bookmarks', {
    headers: { Authorization: `Bearer ${token.value}` },
  })
  return res
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
