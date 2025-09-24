import { useNuxtApp } from '#app'
import type { Notification } from '~/types/notification'

const socket = ref<any>(null)
const notifications = ref<Notification[]>([])

export const useRealtime = () => {
    const init = (token: string) => {
        const auth = useAuth()
        if (socket.value) return
        try {
            socket.value = useNuxtApp().$nuxtSocket({ name: 'main' })
            if (socket.value) {
                socket.value.on('connect', () => {
                    console.log('Socket connected:', socket.value.id)
                    socket.value.emit('authenticate', token)
                })
                socket.value.on('receiveNotification', (n: Notification) => {
                    console.log('New notification received:', n);
                    notifications.value.unshift(n)
                })
            }
            if (auth.token.value)
                getNotifications();
        } catch (error) {
            console.error('Error during socket initialization:', error)
        }
    }
    const disconnect = () => {
        if (socket.value) {
            console.log('Disconnecting socket...')
            socket.value.disconnect()
            socket.value = null
        }
    }

    const markAsRead = async (id: number) => {
        if (!socket.value) return
        try {
            await useApi(`/notifications/${id}/read`, { method: 'PATCH' })
            const notif = notifications.value.find(n => n.id === id)
            if (notif) notif.isRead = true
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }

    const getNotifications = async () => {
        try {
            const res = await useApi('/notifications');
            notifications.value = res.notifications || [];
        } catch (error) {
            console.error('Error fetching notifications:', error)
        }
    }
    return { init, disconnect, notifications, markAsRead }
}
