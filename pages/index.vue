<template>
    <div class="max-w-7xl mx-auto py-12 px-6">
        <!-- ── header ── -->
        <header class="mb-10 flex flex-col sm:flex-row justify-between gap-6">
            <div>
                <h1 class="text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <RocketLaunchIcon class="h-7 w-7 text-blue-600" />
                    Explore Developer Jobs
                </h1>
                <p class="mt-2 text-lg text-gray-500">
                    Browse top tech opportunities, updated in real&nbsp;time.
                </p>
            </div>

            <NuxtLink to="/post">
                <BaseButton variant="primary" size="md" class="gap-2">
                    <PlusIcon class="h-5 w-5" />
                    Post&nbsp;Job
                </BaseButton>
            </NuxtLink>
        </header>

        <section class="bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-6 mb-12">
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-end">
                <BaseInput v-model="filters.search" label="Search" placeholder="Search by title, company, or keyword">
                    <template #iconLeft>
                        <MagnifyingGlassIcon class="w-5 h-5 text-blue-500" />
                    </template>
                </BaseInput>

                <BaseSelect v-model="filters.type" label="Job Type" :options="jobTypeOptions" placeholder="All Types" />

                <BaseInput v-model="filters.location" label="Location" placeholder="Remote, Bengaluru, etc." />

                <div class="flex justify-start sm:justify-end">
                    <BaseButton variant="primary" size="md" class="gap-1" @click="resetFilters">
                        <ArrowPathIcon class="h-5 w-5" />
                        Clear
                    </BaseButton>
                </div>
            </div>
        </section>

        <section class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <NuxtLink v-for="job in jobs" :key="job.id" :to="`/job/${job.id}`"
                class="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500 transition focus-visible:outline-2 focus-visible:outline-blue-500">
                <div class="p-6 flex flex-col h-full">
                    <div class="flex justify-between items-start mb-3">
                        <h2 class="text-lg font-semibold text-blue-700 leading-snug group-hover:underline">
                            {{ job.title }}
                        </h2>

                        <BaseButton @click.prevent.stop="toggleBookmark(job.id)"
                            :title="bookmarkedJobs.includes(job.id) ? 'Remove bookmark' : 'Bookmark'"
                            variant="ghost-light" size="sm" class="!p-1.5" rounded>
                            <component :is="bookmarkedJobs.includes(job.id) ? BookmarkSolid : BookmarkOutline"
                                class="h-5 w-5 text-blue-600 cursor-pointer" />
                        </BaseButton>
                    </div>

                    <p class="text-sm text-gray-600 font-medium">
                        {{ job.company }}
                        <span class="text-gray-400 font-normal">· {{ job.location }}</span>
                    </p>

                    <p class="text-sm text-gray-700 line-clamp-3 mt-2">
                        {{ job.description }}
                    </p>

                    <div class="mt-4 flex flex-wrap gap-2">
                        <span v-for="tag in job.tags" :key="tag"
                            class="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            #{{ tag }}
                        </span>
                    </div>

                    <div class="mt-auto pt-4 flex justify-between items-center">
                        <span
                            class="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            {{ job.type.toUpperCase() }}
                        </span>

                        <span v-if="appliedJobIds.includes(job.id)"
                            class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
                            <CheckCircleIcon class="h-4 w-4" />
                            Applied
                        </span>
                    </div>

                    <p class="text-xs text-gray-400 mt-2 flex items-center">
                        <ClockIcon class="inline h-3.5 w-3.5 mr-0.5 text-blue-700" />
                        Posted {{ timeAgo(job.createdAt) }}
                    </p>
                </div>
            </NuxtLink>
        </section>

        <BasePagination v-model:page="currentPage" :totalPages="totalPages" class="mt-12" />
    </div>
</template>

<script setup lang="ts">
import {
    RocketLaunchIcon,
    PlusIcon,
    ArrowPathIcon,
    MagnifyingGlassIcon,
    BookmarkIcon as BookmarkSolid,
    ClockIcon,
    CheckCircleIcon,
} from '@heroicons/vue/24/solid'
import { BookmarkIcon as BookmarkOutline } from '@heroicons/vue/24/outline'

import BaseButton from '@/components/BaseButton.vue'
import BasePagination from '@/components/BasePagination.vue'

import type { Bookmark, Job } from '~/types/index'
import { useThrottle } from '~/composables/useThrottle'

const { token, isAuthenticated } = useAuth()
const toast = useNotification();
const limit = 6
const currentPage = ref(1)
const bookmarkedJobs = ref<number[]>([])
const appliedJobIds = ref<number[]>([])

const filters = reactive({
    search: '',
    type: '',
    location: '',
})

const jobTypeOptions = [
    { label: 'Full Time', value: 'full-time' },
    { label: 'Part Time', value: 'part-time' },
    { label: 'Freelance', value: 'freelance' },
]

const toQuery = () => {
    const p = new URLSearchParams()
    if (filters.search) p.append('search', filters.search.trim())
    if (filters.type) p.append('type', filters.type)
    if (filters.location) p.append('location', filters.location.trim())
    p.append('page', currentPage.value.toString())
    p.append('limit', limit.toString())
    return p.toString()
}

const { data: jobData } = await useAsyncData('jobs', async () => {
    console.log('Fetching jobs with filters:', toQuery())
    return await useApi<{ jobs: Job[]; total: number }>(`/jobs?${toQuery()}`)
})

watch(filters, () => {
    currentPage.value = 1
})

watch(
    [filters, currentPage],
    useThrottle(async () => {
        jobData.value = await useApi<{ jobs: Job[]; total: number }>(`/jobs?${toQuery()}`);
    }, 300),
    { deep: true }
)

const fetchBookmarks = async () => {
    const data = await useApi<{ id: number }[]>('/bookmarks', {
        headers: { Authorization: `Bearer ${token.value}` },
    })
    bookmarkedJobs.value = data.map((b) => b.id)
}

const fetchAppliedJobs = async () => {
    const apps = await useApi<{ jobId: number }[]>('/applications/me', {
        headers: { Authorization: `Bearer ${token.value}` },
    })
    appliedJobIds.value = apps.map((a) => a.jobId)
}

onMounted(() => {
    if (isAuthenticated.value) {
        fetchBookmarks()
        fetchAppliedJobs()
    }
})

const resetFilters = () => Object.assign(filters, { search: '', type: '', location: '' })

const toggleBookmark = async (jobId: number) => {
    try {
        if (!isAuthenticated) return toast.info('ℹ️ Please log in to bookmark jobs.')
        const isBookmarked = bookmarkedJobs.value.includes(jobId)
        await useApi<Bookmark>(`/bookmarks/${jobId}`, {
            method: isBookmarked ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${token.value}` },
        })
        isBookmarked
            ? (bookmarkedJobs.value = bookmarkedJobs.value.filter((id: number) => id !== jobId))
            : bookmarkedJobs.value.push(jobId)
    } catch (err) {
        toast.error('Network error')
    }
}

const jobs = computed(() => jobData.value?.jobs ?? [])
const totalJobs = computed(() => jobData.value?.total ?? 0)
const totalPages = computed(() => Math.ceil(totalJobs.value / limit))

</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
