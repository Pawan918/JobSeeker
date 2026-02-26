<template>
  <div class="max-w-4xl mx-auto px-6 py-12">

    <NuxtLink to="/"
      class="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-all duration-200 hover:gap-2 mb-8 group dark:text-cyan-300 dark:hover:text-cyan-200">
      <ArrowLongLeftIcon class="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" />
      <span>Back to all jobs</span>
    </NuxtLink>

    <section v-if="job"
      class="rounded-3xl border border-gray-200 shadow-2xl shadow-gray-200/50 bg-white backdrop-blur-md overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-black/30">

      <header class="p-8 sm:p-10 flex flex-col md:flex-row justify-between gap-6 border-b border-gray-100 dark:border-zinc-800">

        <div class="flex items-start gap-4 flex-1">
          <div class="h-14 w-14 rounded-xl bg-gray-50 border border-gray-100 p-0.5 shrink-0 overflow-hidden dark:bg-zinc-800 dark:border-zinc-700">
            <img :src="getLogoUrl(job.company)" class="h-full w-full rounded-lg object-cover" alt="Company Logo" />
          </div>

          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight leading-snug dark:text-zinc-100">
              {{ job.title }}
            </h1>
            <p class="mt-1 text-xl text-gray-700 font-medium dark:text-zinc-300">{{ job.company }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0 pt-1">
          <BaseButton @click="toggleBookmark" variant="ghost-light" size="sm" class="!p-2"
            :title="bookmarked ? 'Remove bookmark' : 'Bookmark'" rounded>
            <component :is="bookmarked ? BookmarkSolid : BookmarkOutline" class="h-5 w-5 text-blue-600 dark:text-cyan-300" />
          </BaseButton>
          <BaseButton @click="copyLink" variant="ghost-light" size="sm" class="p-2! group" title="Copy job link"
            rounded>
            <ClipboardDocumentIcon class="h-5 w-5 text-gray-500 group-hover:text-blue-600 dark:text-zinc-400 dark:group-hover:text-cyan-300" />
          </BaseButton>
        </div>
      </header>

      <section
        class="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm px-8 py-6 sm:px-10 sm:py-8 border-b border-gray-100 dark:border-zinc-800">

        <div>
          <p class="text-gray-500 font-medium mb-1 dark:text-zinc-400">Type</p>
          <span :class="getJobTypeClass(job.type)"
            class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border">
            {{ job.type }}
          </span>
        </div>

        <div>
          <p class="text-gray-500 font-medium mb-1 dark:text-zinc-400">Location</p>
          <div class="flex items-center text-gray-800 font-semibold gap-1 dark:text-zinc-200">
            <MapPinIcon class="h-4 w-4 text-blue-500 dark:text-cyan-400" />
            {{ job.location }}
          </div>
        </div>

        <div>
          <p class="text-gray-500 font-medium mb-1 dark:text-zinc-400">Posted</p>
          <div class="flex items-center text-gray-800 font-semibold gap-1 dark:text-zinc-200" :class="{ 'text-red-500': isOldJob }">
            <ClockIcon class="h-4 w-4" />
            {{ timeAgo(job.createdAt) }}
          </div>
          <p v-if="isOldJob" class="text-xs text-red-500 mt-0.5 flex items-center gap-0.5 dark:text-red-400">
            <ExclamationTriangleIcon class="h-3 w-3" /> This job is quite old.
          </p>
        </div>

        <div>
          <p class="text-gray-500 font-medium mb-1 dark:text-zinc-400">Experience</p>
          <div class="flex items-center text-gray-800 font-semibold gap-1 dark:text-zinc-200">
            <AcademicCapIcon class="h-4 w-4 text-blue-500 dark:text-cyan-400" />
            {{ job.experience || 'Mid-Level' }}
          </div>
        </div>

      </section>

      <div class="px-8 pb-8 sm:px-10 sm:pb-10 space-y-10">

        <section class="pt-2">
          <h2 class="text-xl font-bold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3 dark:text-zinc-100 dark:border-cyan-400">Job Description</h2>
          <p class="whitespace-pre-line leading-relaxed text-gray-700 prose max-w-none dark:text-zinc-300">
            {{ job.description }}
          </p>
        </section>

        <section v-if="job.tags?.length">
          <h2 class="text-xl font-bold text-gray-900 mb-3 border-l-4 border-blue-600 pl-3 dark:text-zinc-100 dark:border-cyan-400">Required Skills</h2>
          <ul class="flex flex-wrap gap-3">
            <li v-for="tag in job.tags" :key="tag"
              class="rounded-full bg-blue-50 text-blue-800 px-3.5 py-1.5 text-sm font-semibold border border-blue-200 dark:bg-cyan-900/30 dark:text-cyan-200 dark:border-cyan-800">
              #{{ tag }}
            </li>
          </ul>
        </section>

        <footer class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
          <div class="text-sm text-gray-600 space-y-1 leading-snug dark:text-zinc-300">
            <p>
              Posted by
              <strong class="text-gray-900 dark:text-zinc-100">{{ job.postedBy?.name || 'Anonymous' }}</strong>
            </p>
            <p class="flex items-center gap-1.5">
              <CalendarDaysIcon class="h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <span>Posted {{ timeAgo(job.createdAt) }}</span>
            </p>
            <p class="text-xs text-gray-400 dark:text-zinc-500">Job&nbsp;ID&nbsp;#{{ job.id }}</p>
          </div>

          <button v-if="!applied" @click="applyToJob" class="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white
            font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/50 transition-all transform hover:scale-[1.02] active:scale-95
             focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:shadow-cyan-500/20 dark:focus-visible:outline-cyan-300">
            <RocketLaunchIcon class="h-5 w-5 -rotate-12" />
            Apply&nbsp;Now
          </button>

          <p v-else
            class="inline-flex items-center gap-2 text-green-600 font-bold text-lg px-4 py-2 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800">
            <CheckCircleIcon class="h-6 w-6" />
            You've applied!
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
  MapPinIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ClockIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/solid'
import { BookmarkIcon as BookmarkOutline } from '@heroicons/vue/24/outline'
import type { Job, Application } from '~/types/index'

const route = useRoute()
const router = useRouter()
const toast = useNotification()
const jobId = Number(route.params.id)

const bookmarked = ref(false)
const applied = ref(false)
const isOldJob = ref(false)

const { token, isAuthenticated } = useAuth()

const { data: job, error } = await useAsyncData<Job>(
  `job-${jobId}`,
  () => useApi<Job>(`/jobs/${jobId}`),
)

const getLogoUrl = (companyName: string) => {
  return `https://ui-avatars.com/api/?name=${companyName}&background=random&color=fff&size=128&bold=true`
}

const getJobTypeClass = (type: string) => {
  const typeMap: Record<string, string> = {
    'full-time': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800',
    'part-time': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800',
    'freelance': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-200 dark:border-indigo-800',
  }
  return typeMap[type.toLowerCase()] || 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-200'
}

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
