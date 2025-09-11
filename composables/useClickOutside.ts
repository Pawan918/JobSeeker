import { onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useClickOutside(
  elementRef: Ref<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  options: { events?: (keyof DocumentEventMap)[]; active?: Ref<boolean> } = {}
) {
  const { events = ['mousedown', 'touchstart'], active } = options

  const listener = (event: Event) => {
    const el = elementRef.value
    if (!el) return
    if (active && !active.value) return

    if (event.target instanceof Node && !el.contains(event.target)) {
      handler(event as MouseEvent | TouchEvent)
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    events.forEach((evt) => document.addEventListener(evt, listener))
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined') return
    events.forEach((evt) => document.removeEventListener(evt, listener))
  })
}
