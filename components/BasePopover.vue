<template>
    <div class="relative inline-block" ref="popoverWrapper">
        <div @click="toggle" ref="triggerRef" class="inline-flex">
            <slot name="trigger">
                <BaseButton variant="gray-light" rounded class="!p-1.5 cursor-pointer">
                    <EllipsisHorizontalIcon class="w-5 h-5" />
                </BaseButton>
            </slot>
        </div>

        <transition name="fade">
            <div v-if="isOpen" ref="contentRef" :class="[
                'absolute z-30 min-w-[8rem] bg-white border border-gray-200 rounded-md shadow-lg',
                positionClass
            ]">
                <slot name="content" />
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'
import { useClickOutside } from '~/composables/useClickOutside'

const props = withDefaults(
    defineProps<{
        placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
        closeOnContentClick?: boolean
    }>(),
    {
        placement: 'bottom-end',
        closeOnContentClick: false,
    }
)

const isOpen = ref(false)
const popoverWrapper = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

const toggle = () => (isOpen.value = !isOpen.value)
const close = () => (isOpen.value = false)

const positionClass = computed(() => {
    switch (props.placement) {
        case 'bottom-start':
            return 'top-full left-0 mt-2'
        case 'bottom-end':
            return 'top-full right-0 mt-2'
        case 'top-start':
            return 'bottom-full left-0 mb-2'
        case 'top-end':
            return 'bottom-full right-0 mb-2'
        default:
            return 'top-full right-0 mt-2'
    }
})

useClickOutside(popoverWrapper, (event) => {
    if (!isOpen.value) return
    if (!(popoverWrapper.value as HTMLElement)?.contains(event.target as Node)) {
        close()
    }
})

watch(isOpen, (open) => {
    if (open && props.closeOnContentClick) {
        contentRef.value?.addEventListener('click', close)
    } else {
        contentRef.value?.removeEventListener('click', close)
    }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>
