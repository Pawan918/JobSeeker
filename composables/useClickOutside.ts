import { onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useClickOutside(
  elementRef: Ref<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const listener = (event: MouseEvent | TouchEvent) => {
    const el = elementRef.value
    if (!el) return

    if (event.target instanceof Node && !el.contains(event.target)) {
      handler(event)
    }
  }

  onMounted(() => {
    document.addEventListener('click', listener)
    document.addEventListener('touchstart', listener)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', listener)
    document.removeEventListener('touchstart', listener)
  })
}
