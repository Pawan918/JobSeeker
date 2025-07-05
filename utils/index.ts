export const timeAgo = (iso: string) => {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    const u = [
        ['year', 31536000],
        ['month', 2592000],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
        ['second', 1],
    ] as const
    for (const [l, sec] of u) {
        const v = Math.floor(s / sec)
        if (v) return `${v} ${l}${v > 1 ? 's' : ''} ago`
    }
    return 'just now'
}