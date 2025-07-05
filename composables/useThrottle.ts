export function useThrottle(fn: Function, delay = 300) {
  let lastCall = 0
  let timeout: NodeJS.Timeout | null = null

  return (...args: any[]) => {
    const now = Date.now()

    if (now - lastCall < delay) {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        lastCall = Date.now()
        fn(...args)
      }, delay)
    } else {
      lastCall = now
      fn(...args)
    }
  }
}
