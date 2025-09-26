<template>
    <div class="max-w-7xl mx-auto px-6 py-12">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <router-link to="/my-jobs" class="text-blue-600 hover:underline font-medium">
                ← Back to My Jobs
            </router-link>
            <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <UsersIcon class="w-9 h-9 text-blue-600" /> Applicants
            </h1>
        </div>

        <!-- Job Summary -->
        <div v-if="job" class="mb-10 border-b border-gray-200 pb-6">
            <h1 class="text-4xl font-extrabold text-gray-900">{{ job.title }}</h1>
            <div class="mt-2 flex items-center gap-3 text-gray-600 text-lg">
                <span class="font-medium">{{ job.company }}</span>
                <span>•</span>
                <span>{{ job.type }}</span>
                <span>•</span>
                <span>{{ job.location }}</span>
            </div>
            <p class="mt-1 text-sm text-gray-500">
                Posted on {{ new Date(job.createdAt).toLocaleDateString() }}
            </p>
        </div>

        <!-- Applicants Grid -->
        <div v-if="applications.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="app in applications" :key="app.id"
                class="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition p-6 flex flex-col justify-between">
                <!-- Applicant Info -->
                <div class="flex items-start gap-4">
                    <!-- Avatar placeholder -->
                    <div
                        class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                        {{ app.user.name.charAt(0) }}
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900">{{ app.user.name }}</h2>
                        <p class="text-sm text-gray-600">{{ app.user.email }}</p>
                        <a v-if="app.user.resumeUrl" :href="app.user.resumeUrl" target="_blank"
                            class="text-sm text-blue-600 hover:underline font-medium">
                            📄 View Resume
                        </a>
                    </div>
                </div>

                <!-- Cover Letter -->
                <p class="text-sm text-gray-700 mt-3 line-clamp-3">
                    {{ app.coverLetter || 'No cover letter provided.' }}
                </p>

                <!-- Status & Actions -->
                <div class="mt-5 flex justify-between items-center">
                    <span
                        class="inline-block text-xs font-semibold px-3 py-1 rounded-full border uppercase tracking-wide"
                        :class="{
                            'bg-yellow-50 text-yellow-700 border-yellow-200': app.status === 'PENDING',
                            'bg-green-50 text-green-700 border-green-200': app.status === 'ACCEPTED',
                            'bg-red-50 text-red-700 border-red-200': app.status === 'REJECTED'
                        }">
                        {{ app.status }}
                    </span>

                    <div v-if="app.status === 'PENDING'" class="flex gap-2">
                        <BaseButton size="sm" variant="primary" @click="updateStatus(app.id, 'ACCEPTED')">
                            Accept
                        </BaseButton>
                        <BaseButton size="sm" variant="danger" @click="updateStatus(app.id, 'REJECTED')">
                            Reject
                        </BaseButton>
                    </div>
                </div>

                <!-- Applied Time -->
                <p class="text-xs text-gray-500 mt-3">
                    Applied {{ new Date(app.createdAt).toLocaleDateString() }}
                </p>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center mt-20">
            <UsersIcon class="mx-auto w-12 h-12 text-gray-400" />
            <p class="text-gray-500 text-lg mt-3">No applications yet for this job. 📭</p>
            <router-link to="/jobs" class="inline-block mt-4 text-blue-600 hover:underline font-medium">
                Browse more jobs
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { UsersIcon } from '@heroicons/vue/24/outline'
import BaseButton from '~/components/BaseButton.vue'
import type { Job, JobApplicationsResponse } from '~/types/index'

const route = useRoute()
const jobId = Number(route.params.id)
const jobTitle = ref('')

// Notification & auth
const toast = useNotification()
const { token } = useAuth()

const { data: job } = await useAsyncData<Job>(
    `job-${jobId}`,
    () => useApi<Job>(`/jobs/${jobId}`)
)

// Fetch applications
const { data: applicationsData, refresh } = await useAsyncData<JobApplicationsResponse>(
    `applications-${jobId}`,
    () => useApi<JobApplicationsResponse>(`/applications/by-job/${jobId}`)
)
const applications = computed(() => applicationsData.value?.applicants || [])

// Update status
const updateStatus = async (id: number, status: 'ACCEPTED' | 'REJECTED') => {
    try {
        await useApi(`/applications/${id}/status`, {
            method: 'PATCH',
            body: { status }
        })
        toast.success(`Application ${status.toLowerCase()}!`)
        refresh()
    } catch {
        toast.error('Failed to update status')
    }
}
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
