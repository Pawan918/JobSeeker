<template>
    <div :class="[
        'inline-flex items-center justify-center rounded-full font-semibold text-white uppercase bg-blue-600',
        sizeClasses
    ]" :style="src ? backgroundImageStyle : {}" :aria-label="name" role="img">
        <span v-if="!src">
            {{ initials }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    name: string
    src?: string
    size?: 'sm' | 'md' | 'lg'
}>(), {
    size: 'md'
})

const sizeClasses = computed(() => {
    switch (props.size) {
        case 'sm': return 'w-8 h-8 text-sm'
        case 'lg': return 'w-14 h-14 text-xl'
        default: return 'w-10 h-10 text-base'
    }
})

const initials = computed(() => {
    if (!props.name) return ''
    const words = props.name.trim().split(' ')
    const first = words[0]?.charAt(0) || ''
    const last = words.length > 1 ? words[words.length - 1]?.charAt(0) : ''
    return `${first}${last}`.toUpperCase()
})

const backgroundImageStyle = computed(() =>
    props.src ? { backgroundImage: `url(${props.src})`, backgroundSize: 'cover' } : {}
)
</script>
