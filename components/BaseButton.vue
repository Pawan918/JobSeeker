<template>
    <button :class="computedClass" :disabled="disabled">
        <slot />
    </button>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false
  }
)

const computedClass = computed<string>(() => {
  const variants: Record<'primary' | 'secondary' | 'outline', string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  }

  const sizes: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  }

  const variant = props.variant as keyof typeof variants
  const size = props.size as keyof typeof sizes

  return [
    'inline-flex items-center justify-center rounded-lg font-medium transition',
    props.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500',
    variants[variant],
    sizes[size]
  ].join(' ')
})

</script>
