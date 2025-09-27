<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <NuxtLink to="/"
      class="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mb-8">
      <ArrowLongLeftIcon class="h-4 w-4" />
      <span>Back to all jobs</span>
    </NuxtLink>

    <section v-if="job" class="rounded-3xl border border-gray-200 shadow-sm bg-white/80 backdrop-blur-md">
      <header class="p-8 sm:p-10 flex flex-col sm:flex-row justify-between gap-6">
        <div class="flex-1">
          <h1 class="text-3xl font-semibold text-gray-900 leading-tight">
            {{ job.title }}
          </h1>
          <p class="mt-1 text-lg text-gray-700">{{ job.company }}</p>
          <p class="mt-1 text-sm text-gray-500">
            {{ job.location }} • {{ job.type.toUpperCase() }}
          </p>
        </div>

        <div class="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <div class="flex items-center gap-2 shrink-0">
            <button @click="toggleBookmark"
              class="p-2 rounded-full hover:bg-blue-50 transition focus-visible:outline-2 focus-visible:outline-blue-500 cursor-pointer"
              :title="bookmarked ? 'Remove bookmark' : 'Bookmark'">
              <component :is="bookmarked ? BookmarkSolid : BookmarkOutline" class="h-5 w-5 text-blue-600" />
            </button>

            <button @click="copyLink"
              class="p-2 rounded-full hover:bg-gray-100 transition focus-visible:outline-2 focus-visible:outline-blue-500 cursor-pointer"
              title="Copy job link">
              <ClipboardDocumentIcon class="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      <div class="px-8 pb-8 sm:px-10 sm:pb-10 space-y-8">
        <section>
          <h2 class="text-lg font-medium text-gray-800 mb-2">Job Description</h2>
          <p class="whitespace-pre-line leading-relaxed text-gray-700">
            {{ job.description }}
          </p>
        </section>
        <section v-if="job.tags?.length">
          <h2 class="text-lg font-medium text-gray-800 mb-2">Tags</h2>
          <ul class="flex flex-wrap gap-2">
            <li v-for="tag in job.tags" :key="tag"
              class="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold tracking-tight">
              #{{ tag }}
            </li>
          </ul>
        </section>
        <footer class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div class="text-sm text-gray-500 space-y-0.5 leading-snug">
            <p>
              Posted by
              <strong class="text-gray-700">{{ job.postedBy?.name || 'Anonymous' }}</strong>
            </p>
            <p>Posted {{ timeAgo(job.createdAt) }}</p>
            <p>Job&nbsp;ID&nbsp;#{{ job.id }}</p>
          </div>

          <button v-if="!applied" @click="applyToJob" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
                   font-medium px-6 py-2 rounded-lg shadow-sm transition-colors
                    focus-visible:outline-2 focus-visible:outline-blue-500">
            <RocketLaunchIcon class="h-5 w-5 -rotate-12" />
            Apply&nbsp;Now
          </button>

          <p v-else class="inline-flex items-center gap-1 text-green-600 font-medium">
            <CheckCircleIcon class="h-5 w-5" />
            You&#160;have&#160;applied
          </p>
        </footer>
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import {
  ArrowLongLeftIcon,
  BookmarkIcon as BookmarkSolid,
  ClipboardDocumentIcon,
  CheckCircleIcon,
  RocketLaunchIcon,
} from '@heroicons/vue/24/solid'
import { BookmarkIcon as BookmarkOutline } from '@heroicons/vue/24/outline'
import type { Job, Application } from '~/types/index'

const route = useRoute()
const router = useRouter()
const toast = useNotification()
const jobId = Number(route.params.id)

const bookmarked = ref(false)
const applied = ref(false)

const { token, isAuthenticated } = useAuth()

const { data: job, error } = await useAsyncData<Job>(
  `job-${jobId}`,
  () => useApi<Job>(`/jobs/${jobId}`),
)

const copyLink = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success('Link copied')
    })
  }
}


const applyToJob = async () => {
  if (!isAuthenticated.value) {
    toast.info('Please login to apply job')
    return router.push('/login')
  }
  if (!job.value) return

  try {
    await useApi(`/jobs/apply/${job.value.id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    applied.value = true
    toast.success('🎉 Successfully applied for this job!')
  } catch (err: any) {
    toast.error('Network error')
  }
}


const checkIfBookmarked = async () => {
  try {
    const bookmarks = await useApi<Job[]>('/bookmarks', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    bookmarked.value = bookmarks.some(b => b.id === jobId)
  } catch {
    bookmarked.value = false
  }
}

const toggleBookmark = async () => {
  if (!token.value) return router.push('/login')

  const method = bookmarked.value ? 'DELETE' : 'POST'
  try {
    await useApi(`/bookmarks/${jobId}`, {
      method,
      headers: { Authorization: `Bearer ${token.value}` }
    })
    bookmarked.value = !bookmarked.value;
    if (bookmarked.value)
      toast.success('bookmarked successfully')
    else
      toast.success('removed from bookmarks')
  } catch (err: any) {
    toast.error('Network error')
  }
}


const checkIfApplied = async () => {
  try {
    const applications = await useApi<Application[]>('/applications/me', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    applied.value = applications.some(app => app.job?.id === jobId)
  } catch {
    applied.value = false
  }
}

onMounted(async () => {
  if (token.value) {
    await Promise.all([checkIfBookmarked(), checkIfApplied()])
  }
})
</script>