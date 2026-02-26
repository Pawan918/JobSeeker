<template>
  <button :class="computedClass" :disabled="disabled">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'gray-light' | 'outline' | 'danger' | 'ghost-light'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    rounded?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    rounded: false
  }
)

const computedClass = computed<string>(() => {
  const variants: Record<'primary' | 'secondary' | 'gray-light' | 'outline' | 'danger' | 'ghost-light', string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900',
    'ghost-light': 'hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-500 dark:hover:bg-zinc-900',
    'gray-light': 'bg-gray-100 hover:bg-gray-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  }

  const sizes: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  }

  const variant = props.variant as keyof typeof variants
  const size = props.size as keyof typeof sizes

  return [
    'inline-flex items-center justify-center font-medium transition transition',
    props.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500',
    variants[variant],
    sizes[size],
    props.rounded ? 'rounded-full' : 'rounded-lg'
  ].join(' ')
})

</script>
