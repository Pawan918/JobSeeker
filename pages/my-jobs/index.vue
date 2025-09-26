<template>
  <div class="max-w-7xl mx-auto px-6 py-12">
    <div class="flex items-center justify-between mb-10">
      <h1 class="text-4xl font-bold text-gray-900 flex items-center gap-3">
        <FolderIcon class="w-10 h-10" /> My Posted Jobs
      </h1>
      <BaseButton variant="danger" size="md" :disabled="!jobs?.length" @click="confirmDeleteAll" class="gap-2">
        <TrashIcon class="w-5 h-5" />
        Delete All Jobs
      </BaseButton>
    </div>

    <div v-if="jobs && jobs.length" class="grid gap-8 sm: grid-cols-2 lg:grid-cols-3">
      <div v-for="job in jobs" :key="job.id" @click="router.push(`/my-jobs/${job.id}`)"
        class="relative group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition">
        <div class="p-6 flex flex-col h-full">
          <div class="absolute top-4 right-4 z-20">
            <BasePopover @click.stop>
              <template #content>
                <button class="w-32 px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  @click="editJob(job.id)">
                  <PencilSquareIcon class="w-4 h-4" />
                  Edit
                </button>
                <button
                  class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  @click="deleteJob(job.id)">
                  <TrashIcon class="w-4 h-4" />
                  Delete
                </button>
              </template>
            </BasePopover>
          </div>

          <h2 class="text-lg font-semibold text-blue-700 group-hover:underline">
            {{ job.title }}
          </h2>
          <p class="text-sm text-gray-600 font-medium mt-1">
            {{ job.company }} <span class="text-gray-400">· {{ job.location }}</span>
          </p>
          <p class="text-sm text-gray-700 line-clamp-3 mt-2">
            {{ job.description }}
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="tag in job.tags" :key="tag"
              class="bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full font-medium">
              #{{ tag }}
            </span>
          </div>

          <div class="mt-auto pt-4 text-right">
            <span
              class="inline-block text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              {{ job.type.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-center text-gray-500 text-lg mt-20">
      You haven’t posted any jobs yet. 🚧
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Job } from '~/types/index'
import BaseButton from '~/components/BaseButton.vue'
import BasePopover from '~/components/BasePopover.vue'
import { TrashIcon, FolderIcon } from '@heroicons/vue/24/outline'
import { PencilSquareIcon } from '@heroicons/vue/24/solid';
const toast = useNotification();
const { token } = useAuth()
const router = useRouter()
const openPopoverId = ref<number | null>(null)

const { data: jobs } = await useAsyncData<Job[]>('my-jobs', async () => {
  if (!token.value) return []
  return await useApi('/jobs/me', {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
})

const deleteJob = async (id: number) => {
  try {
    await useApi(`/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    jobs.value = jobs.value?.filter(job => job.id !== id) || []
    openPopoverId.value = null;
    toast.success('Successfully deleted job.')
  } catch (err: any) {
    toast.error('Network Error');
  }
}

const confirmDeleteAll = async () => {
  try {
    await useApi(`/jobs/me/delete-all`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    jobs.value = []
    toast.success('Successfully deleted all jobs.')
  } catch (err: any) {
    toast.error('Network Error');
  }
}

const editJob = (id: number) => {
  router.push(`/edit-job/${id}`)
  openPopoverId.value = null
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
